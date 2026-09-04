# Instalar los 2 crons que solo vivian en Vercel

`onia-platform/vercel.json` declara 3 crons. Contra el crontab del host (2026-08-30):

| Ruta | En el VPS | Estado |
|---|---|---|
| `/api/cron/appointment-reminders` | `*/15 * * * * /root/bin/run-onia-appointment-reminders.sh` | ✅ ya corre |
| `/api/cron/recurring-invoices` | — | 🔴 **no existe** |
| `/api/cron/onia-core-workitems` | — | 🔴 **no existe** |

El auto-deploy de Vercel ya esta cortado (`git.deploymentEnabled.master=false`), y ademas
ese deploy apuntaba al Supabase de la nube: **estos dos nunca corrieron contra
produccion**. No es una migracion, es un encendido.

> ⚠️ Nada de esto esta instalado. La decision de instalarlo es de Sergio.

---

## 1. Antes de copiar nada (2 minutos, en el VPS)

```sh
grep -c '^CRON_SECRET=' /opt/onia-platform/app.env   # espera 1
date -u; date                                         # ver punto 3 (zona horaria)
crontab -l                                            # ver que hay hoy
```

Solo para `recurring-invoices`: al terminar avisa a n8n (WF-03, la entrega de la factura)
haciendo `POST` a `${NEXT_PUBLIC_APP_URL}/api/n8n/webhook/recurring-invoices`. Si esa var
no esta, cae al default `http://localhost:3000` y el aviso se pierde **sin romper la
emision**. Verificar:

```sh
grep -E '^(NEXT_PUBLIC_APP_URL|N8N_API_KEY)=' /opt/onia-platform/app.env
```

`NEXT_PUBLIC_APP_URL` se hornea en el build, no se lee en caliente: si esta mal, no
alcanza con editar `app.env`, hay que rebuildear.

## 2. Instalar

```sh
# desde tu maquina
scp hermes-content/infra/vps-ops/crons/run-onia-recurring-invoices.sh \
    hermes-content/infra/vps-ops/crons/run-onia-core-workitems.sh \
    root@187.77.16.63:/root/bin/

# en el VPS — 700 y no 755: los scripts leen app.env, que tiene el secreto
chmod 700 /root/bin/run-onia-recurring-invoices.sh /root/bin/run-onia-core-workitems.sh
head -1 /root/bin/run-onia-recurring-invoices.sh | cat -A | head -1   # que NO diga ^M$
```

Si aparece `^M$`, el archivo viajo con CRLF y `/bin/sh` lo va a rechazar
(`bad interpreter: /bin/sh^M`). Arreglo: `sed -i 's/\r$//' /root/bin/run-onia-*.sh`.
El `.gitattributes` de esta carpeta ya fuerza LF, asi que no deberia pasar.

## 3. Las lineas de crontab (`crontab -e`)

```
0 6 * * * /root/bin/run-onia-recurring-invoices.sh >> /var/log/onia-recurring-invoices-cron.log 2>&1
0 10 * * * /root/bin/run-onia-core-workitems.sh >> /var/log/onia-core-workitems-cron.log 2>&1
```

**Zona horaria.** El crontab del host corre en **UTC**: el cron de agentes esta como
`0 11 * * *` y esta documentado como "07:00 La Paz" (`ONIA_CATALOGO_DE_VENTA.md`), que es
UTC-4. Por eso los strings de `vercel.json` se copian tal cual y dan la MISMA hora de
pared que daban en Vercel. Igual confirmalo con `date -u; date` antes de instalar — si el
host resultara estar en `America/La_Paz`, los horarios se corren 4 horas y hay que poner
`CRON_TZ=UTC` arriba de las dos lineas.

### Cambie un horario a proposito

- **`recurring-invoices`: dejo `0 6 * * *`** (02:00 La Paz), igual que Vercel. Es de
  madrugada, pero eso esta *bien* aca: la factura queda emitida antes de que empiece el
  dia habil, no compite con nadie por el VPS, y cae el mismo dia calendario en UTC y en
  La Paz (no hay corrimiento de fecha en el correlativo).
- **`onia-core-workitems`: lo movi de `0 11` a `0 10 * * *`** (06:00 La Paz). En `0 11`
  choca **al segundo** con `0 11 * * * /root/bin/run-onia-agents-cron.sh`, que ya existe.
  Los dos barren TODAS las orgs contra la misma base y el mismo contenedor, en un VPS que
  ya estuvo estrangulado por Hostinger. Correrlo una hora antes ademas deja los pendientes
  del dia creados antes de que pasen los agentes, que leen `oniaCoreWorkItem`
  (`lib/onia-core/modules/agents-runtime.ts:426`). Si preferis fidelidad exacta a Vercel,
  poné `0 11` — pero entonces separalos por minutos (`5 11`), no los dejes en el mismo.

Ocupacion del crontab despues de esto: `*/15` recordatorios · `0 6` recurrentes ·
`0 10` work items · `0 11` agentes · `0 13` trial-drip. Sin colisiones.

## 4. Verificar que funciono

**Primero a mano, antes de agendar.** Las dos corridas son seguras de repetir: los work
items se deduplican, y cada factura recurrente se crea en una transaccion junto con el
avance de `nextRunAt`, asi que la que falla queda vencida y la vuelve a tomar la corrida
siguiente. No duplican.

```sh
/root/bin/run-onia-core-workitems.sh
/root/bin/run-onia-recurring-invoices.sh
```

Se espera una linea asi (una por corrida, en el log del punto 3):

```
2026-08-30T10:00:01+00:00 OK http=200 body={"ok":true,"organizations":7,"created":3,"deduped":1,"errors":0}
2026-08-30T06:00:02+00:00 OK http=200 body={"ok":true,"processed":2,"failed":0,"skipped":0,"total":2,"createdInvoiceIds":["..."]}
```

`total:0` / `created:0` **no es un fallo**: es que hoy no vencia nada. Lo que importa es
que la linea exista todos los dias y diga `OK`.

Los scripts salen `FAIL` (y exit 1) en estos casos, no solo cuando el http no es 200:

| Salida | Que paso |
|---|---|
| `FAIL http=401` | `CRON_SECRET` mal leido de `app.env` |
| `FAIL http=503` | `CRON_SECRET` sigue en el placeholder `cambia-esto-...` |
| `FAIL ... facturas_fallidas=N` | la ruta devolvio **200** y aun asi N facturas no se emitieron |
| `FAIL ... orgs_con_error=N` | la ruta devolvio **200** y N orgs se quedaron sin pendientes |

Los dos ultimos son el motivo de que estos scripts miren el cuerpo y no solo el codigo.
La ruta atrapa el error de cada item por separado, lo manda a Sentry y **igual responde
200**: con la comprobacion sola del http, tres clientes sin factura se loguean como `OK`.
Detalle del error: Sentry (tag `cron: recurring-invoices`) o el JSON crudo en
`/tmp/onia-*-cron-last.json`.

**Al dia siguiente**, confirmar que el reloj los llamo solo:

```sh
tail -3 /var/log/onia-recurring-invoices-cron.log /var/log/onia-core-workitems-cron.log
```

## 5. Revertir

```sh
crontab -e            # comentar las dos lineas con #
```

Los scripts pueden quedar en `/root/bin/` sin hacer nada. Para borrar del todo:

```sh
rm /root/bin/run-onia-recurring-invoices.sh /root/bin/run-onia-core-workitems.sh
```

Revertir no deshace lo ya emitido: las facturas creadas quedan en `BORRADOR` y los work
items creados quedan abiertos. Se anulan desde el producto, no desde aca.
