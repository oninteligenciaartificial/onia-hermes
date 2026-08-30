# Salida de Vercel — plan de ejecución

**Fecha:** 2026-08-01
**Decisión de Sergio:** ya no usamos Vercel. Todo se va al VPS.
**Estado de este doc:** plan. Nada ejecutado. No se tocó Vercel ni el VPS al escribirlo.
**Org Vercel:** `team_BqCitl3qx1WiekYzomhFbBUP` (`oninteligenciaartificial-8139s-projects`) — 16 proyectos.
**VPS destino:** `187.77.16.63` (`srv1360183`, Easypanel + Traefik).

---

## Resumen en 6 líneas

1. De 16 proyectos, **1 se puede apagar hoy**, **12 hay que migrar antes**, **3 se borran**.
2. El bloqueo grande no es técnico: es que **7 dominios/links tienen cliente real mirándolos hoy**.
3. Lo que rompe en silencio no está en el repo: **3 crons de Vercel** y el **`APP_URL` de 4 workflows n8n**.
4. Hay un **redirect 308 permanente** a `nuvia-store.vercel.app` metido en el middleware que corre en el VPS. Se cachea en el navegador. Hay que cambiarlo ANTES de apagar, no después.
5. El VPS aguanta la RAM (~9,1 GiB libres contra ~2,5 GB de carga nueva), pero **el swap está al 95% y eso es un bloqueo previo**, no un matiz.
6. `gesti-os` (gestioshq.app) **no tiene nada en el VPS**. Es el único sin plan B construido.

**Costo mensual actual de Vercel: UNKNOWN.** No tengo la factura. El ahorro no está cuantificado.

**Actualización 2026-08-01 (decisiones de Sergio, en sus palabras):** Gestios ya no se usa
como producto — se porta como módulo de comercio a Onia Platform (`ONIA_MODULOS_20260801.md`),
así que `gesti-os` **sale de la cubeta "migrar" y pasa a "borrar tras rescatar el código"**
(el repo local es la cantera; la base y el proyecto Vercel no reciben más cambios).
`onia-platform` es el único repo que va a producción; "todos los demás no los usamos".
Se mantienen DOS excepciones que necesitan su OK explícito antes de borrar, porque tienen
gente real del otro lado: `onia-forms` (clientes llenando el cuestionario hoy — se migra
al VPS primero) y `nuvia-store` (storefront de cliente + el redirect 308 del middleware).
`zen-zhukovsky`: bajar el fuente antes de borrar (única copia, datos bancarios).

---

## 1. Qué hace Vercel por nosotros hoy

### Cubeta A — ya cubierto por el VPS, se puede apagar hoy

| Proyecto | Hostname | Quién lo cubre en el VPS | Qué se pierde |
|---|---|---|---|
| `onia-center` | `onia-center.vercel.app` | `center.onia.com.bo` → 187.77.16.63 → contenedor `onia-center:3012`. DNS **ya apunta al VPS**. Responde 200 y **exige login** (Vercel no lo exige). | Los preview deploys de las ramas `claude/*` (~664 deploys en 30 días). Es costo operativo, no cliente. |

**Un solo proyecto en esta cubeta. No hay más.** Dos salvedades antes de apagarlo:

- `onia-center.vercel.app` responde **200 sin pedir login** y sirve `/nuvia` con el catálogo de un cliente. Está más expuesto que el del VPS.
- La ruta `/nuvia` del panel en el VPS **redirige a `nuvia-store.vercel.app`** (308). Apagar `onia-center` no rompe eso, pero apagar `nuvia-store` sí. Ver Cubeta B.

### Cubeta B — hay que MIGRAR antes de apagar

Ordenados por lo que cuesta migrarlos, de más barato a más caro.

| # | Proyecto / dominio | Qué falta | Riesgo hoy |
|---|---|---|---|
| B1 | **`dental-gest`** — `dentalgest.app` + `www.dentalgest.app` | **Solo mover el DNS.** El contenedor `onia-platform` ya corre en el VPS y sirve el mismo `<title>` (DentalGest). La ruta Traefik `app.onia.com.bo` → `onia-platform:3000` ya está escrita. | alto |
| B2 | **`web-onia`** — `onia.com.bo` + `www.onia.com.bo` | Mover el DNS **+ decisión de contenido de Sergio.** El VPS sirve una landing **DISTINTA** (`Onia — El sistema con IA que maneja tu negocio completo`, 108 KB) vs la de Vercel (`Onia \| Plataforma con IA para negocios en Bolivia`, 49 KB). Es un reemplazo, no un espejo. | alto |
| B3 | **`nuvia-store`** — `nuvia-store.vercel.app` | Servir `/nuvia` desde el VPS **y cambiar `middleware.ts:201` primero.** Hoy el VPS depende de Vercel, no al revés. | alto |
| B4 | **`onia-forms`** — `onia-forms.vercel.app` | Levantar `/cuestionario` y `/brief` en el VPS **+ reemplazar los links ya enviados a clientes.** El backend (webhook n8n) ya vive en el VPS y está arriba. Sin esto, el webhook queda vivo y sin nadie que lo alimente. | alto |
| B5 | **`casajardin`** — `casajardin.vercel.app` | Web de cliente real (organizadora de bodas, Santa Cruz). Migrar al VPS o pasarle el sitio al cliente con dominio propio. | alto |
| B6 | **`tempohomes`** — `tempohomes.vercel.app` | Web de cliente real (alojamiento) **con widget de reserva y WhatsApp.** Apagarlo corta un canal de reserva, no solo una vitrina. Código local en `C:\dev\clientes\TempoHomes\tempohomes-web`. | alto |
| B7 | **`demo-epicmotion-v3`** — `demo-epicmotion-v3.vercel.app` | Cliente real Epic Motion Group. Evidencia dura en los commits: número de WhatsApp `59171087580`, clientes Grupo Ahabah y Adora by Dienzo, secuencias de email de seguimiento. Migrar. | alto |
| B8 | **`gesti-os`** — `gestioshq.app` + `www.gestioshq.app` | **CONSTRUIR DESDE CERO.** No hay contenedor, no hay ruta Traefik, no hay nada. Es el único proyecto sin plan B. Landing del ERP con Contador Pack fiscal. | alto |

**Pendientes de decisión de Sergio, no de trabajo técnico** (si confirma, bajan a Cubeta C):

| Proyecto | Qué necesito de Sergio |
|---|---|
| `demo-epicmotion` (v2) | ¿Al cliente se le pasó el link de v3? Si sí, v2 se borra. |
| `epic-motion-group` (v1) | Igual que arriba. Además: es el **único proyecto sin ninguna protección** (ni password, ni SSO, ni trusted IPs). Totalmente abierto e indexable. |
| `demo-fotografo-2` | ¿"Mateo Saints Photography" es persona real o de plantilla? Un solo deploy en 155 días, huele a ficticio. **Antes de decidir: revisar que la sección "PAGOS" no tenga datos bancarios reales.** |
| `demo-nude-twojeys` | Demo de e-commerce (`STITCH`), sin marca boliviana. Sirve como vitrina de venta. Guardar screenshots y borrar. Código a salvo en GitHub. |

### Cubeta C — se borran, no sirven a nadie

| Proyecto | Qué responde hoy | Precaución antes de borrar |
|---|---|---|
| `alfred-hq` | **404 NOT_FOUND.** Último deploy de producción en ERROR. Último deploy exitoso hace 64 días. | Ninguna. El código vive en el repo `AlfredHQ` (rama master). **Es el único que se puede borrar sin ningún paso previo.** |
| `nexodata-empresas` | Alias público **404 DEPLOYMENT_NOT_FOUND**. El resto detrás del SSO del team. Último deploy 2026-06-01. | **Bajar el fuente del deployment antes.** No hay clon local del repo `Organizador-de-datos-de-empresas` y el `rootDirectory` es UNKNOWN. |
| `zen-zhukovsky-5e5b10` | **500 en todas las rutas** desde el 16-jun-2026 (6,5 semanas). Causa: faltan las env vars de Supabase, el middleware revienta antes de renderizar. | **CRÍTICO: el deployment de Vercel es la ÚNICA copia del código** (el proyecto no tiene conexión git). Y ese código tiene **datos bancarios reales**: QR BCP, cuenta `701-51726678-3-55`, titular Urcullo Mercado Sergio. Descargar el fuente ANTES de borrar. Y revisar que esos datos no terminen en un repo. |

---

## 2. El orden de apagado

La regla: **cortar auto-deploy → mover DNS → verificar que el VPS responde → recién ahí borrar.**
Nunca borrar antes de mover el DNS. Borrar un proyecto de Vercel no se deshace.

### Fase 0 — parar la sangría (reversible, hacer ya)

| # | Acción | Por qué primero |
|---|---|---|
| 0.1 | Desconectar la integración Git de Vercel en `onia-center` (proyecto `prj_l3aDcm5YHVAy1oMgge4JrVZHjGTo`). | Ese proyecto recibe ~664 deploys/30d de ramas `claude/*` y spamea "Failed preview deployment". El deploy real al VPS ya lo hace `.github/workflows/deploy-onia-center.yml` por SSH. Vercel ahí es redundante. |
| 0.2 | Desconectar la integración Git de Vercel en `dental-gest` (`prj_foZ5wCgtRI6ciU3GV4oEuIehouby`). | Mismo motivo. El sitio sigue vivo con el último deploy; solo deja de rebuildear. |
| 0.3 | Borrar los secrets `VERCEL_TOKEN` y `VERCEL_TEAM_ID` de GitHub **y** la fuente `vercel` en `hermes-content/references/onia-project-hygiene-config.json:26`. | Si no, el job diario `onia-hygiene-daily.yml` va a reportar `missingSecrets: VERCEL_TOKEN` todos los días para siempre. Ruido permanente que entrena a ignorar la alerta. **Hacer los dos juntos**, no solo el secret. |

Fase 0 no apaga ningún sitio. Es reversible.

### Fase 1 — desatar lo que rompe en silencio (ANTES de tocar cualquier DNS)

| # | Acción | Si no se hace |
|---|---|---|
| 1.1 | **Cambiar `web-factory/apps/site/src/middleware.ts:201`** — `NUVIA_STORE_ORIGIN = "https://nuvia-store.vercel.app"` → dominio propio. Desplegar al VPS. | `center.onia.com.bo/nuvia` redirige a un dominio muerto. Y es **308 permanente**: los navegadores que ya entraron lo tienen cacheado y van a seguir yendo al muerto aunque después arregles el código. Esto no se revierte con un deploy. |
| 1.2 | **Montar los 3 crons de `onia-platform/vercel.json` en el VPS** (ver tabla abajo) y **verificar una corrida real de cada uno**. | Se apagan mudos. Ninguno loguea "no corrí". |
| 1.3 | **Cambiar `APP_URL` en los workflows n8n WF-01, WF-03, WF-04, WF-05** — hoy vale `https://dentalgest-onia.vercel.app`. | Se rompen los 4 y el repo no avisa, porque el valor vive dentro de n8n. |
| 1.4 | Ampliar el swap del VPS (ver §5). | Ver §5. Es bloqueo previo a meter carga nueva. |

**Los 3 crons — qué son y qué pasa si se apagan:**

| Ruta | Schedule (UTC) | Hora La Paz | Si se apaga |
|---|---|---|---|
| `/api/cron/appointment-reminders` | `0 12 * * *` | 08:00 | Los pacientes dejan de recibir recordatorio de cita (WhatsApp + email). Falla visible al cliente. |
| `/api/cron/recurring-invoices` | `0 6 * * *` | **02:00** | Dejan de emitirse las facturas recurrentes. Falla de plata, silenciosa. |
| `/api/cron/onia-core-workitems` | `0 11 * * *` | 07:00 | Dejan de generarse work items (no-asistió → seguimiento, factura vencida → cobro, presupuesto 7d) **y el recordatorio fiscal IVA/IT del Contador Pack**. |

**Trampa de zona horaria — ⚠️ CORREGIDO el 2026-08-30, esto era falso.** Acá decía que
copiar los strings de `vercel.json` al crontab del VPS **corría los horarios 4 horas**.
**No pasa:** medido en vivo, el host está en `Etc/UTC` (`date` y `date -u` dan lo mismo,
`/etc/timezone` = `Etc/UTC`), así que los crons de Vercel y los del host **corren en la
misma zona** y los strings se copian tal cual. `0 6 * * *` sigue siendo 02:00 de La Paz en
los dos lados. `CRON_TZ=UTC` es innecesario.

La advertencia sólo valdría si el host estuviera en hora local, que era la suposición no
verificada con la que se escribió. Peligro real de dejarla: alguien la lee, "corrige" los
horarios 4 horas, y los trabajos disparan cuando no deben. **Verificar siempre con
`date -u; date` antes de instalar un cron.**

**Cómo montarlos.** Las 4 rutas ya están listas para vivir fuera de Vercel: son `GET` y validan `Authorization: Bearer ${CRON_SECRET}`. No usan nada de Vercel.

- **n8n (recomendado).** Un workflow por cron: `Schedule Trigger` → `HTTP Request` GET. El `CRON_SECRET` va como **credencial "Header Auth"** de n8n, nunca hardcodeado en el nodo (el plan VPS de n8n no tiene `$env`). Ventaja: n8n deja historial de ejecución, así que **un cron caído se ve**.
- **crontab del VPS.** Más simple, pero vuelve a fallar en silencio salvo que le agregues alerta.

**Ojo con el compose self-host:** `docker-compose.selfhost.example.yml` define **un solo servicio** (`app`) y **cero referencias a cron**. `.env.selfhost.example:32` sí declara `CRON_SECRET=CHANGE_ME_32_BYTES`. O sea: el secreto está previsto, el disparador NO existe. Quien levante el self-host hoy tiene las rutas protegidas y a nadie llamándolas.

**Bonus:** existe una 4ª ruta, `app/api/cron/onia-agents/route.ts`, que **no está en `vercel.json`** — nunca corrió por schedule. Hoy responde `skipped: flags_off`. **Decidí explícito si se agenda o no. No la arrastres por inercia.**

### Fase 2 — mover DNS, uno por uno

Para cada dominio, el ciclo es siempre el mismo. **No hacer dos dominios a la vez.**

```
1. Verificar que el VPS responde ese Host forzando el header:
   curl -H "Host: dentalgest.app" http://187.77.16.63/  → esperar 200
2. Si no hay ruta en Traefik, escribirla en:
   /etc/easypanel/traefik/config/onia-manual-routes.yaml
3. Bajar el TTL del registro A a 300s. Esperar que expire el TTL viejo.
4. Cambiar el A a 187.77.16.63.
5. Esperar el cert de Let's Encrypt (Traefik lo pide solo). Verificar HTTPS.
6. Verificar el sitio en vivo desde afuera. Recién ahí queda migrado.
7. NO borrar el proyecto de Vercel todavía — dejarlo apagado y esperar.
```

Orden sugerido, de menos a más riesgo:

| Orden | Dominio | Nota |
|---|---|---|
| 2.1 | `app.onia.com.bo` | **Está caído en producción ahora mismo** (Vercel devuelve 404 DEPLOYMENT_NOT_FOUND) mientras el VPS sirve 200. Mover esto solo mejora. Riesgo casi nulo. |
| 2.2 | `dentalgest.onia.com.bo` | También 404 en Vercel hoy. Sin ruta en el VPS todavía. |
| 2.3 | `dentalgest.app` + `www.dentalgest.app` | El contenedor ya sirve el mismo contenido. Es cambiar el A. |
| 2.4 | `onia.com.bo` + `www.onia.com.bo` | **Requiere que Sergio apruebe la landing nueva antes.** Es otra página, no la misma. |
| 2.5 | `gestioshq.app` + `www.gestioshq.app` | Solo después de construir y probar el contenedor. |

### Fase 3 — borrar proyectos

Recién cuando el dominio ya está sirviendo desde el VPS **y verificado en vivo**, y ya pasaron unos días sin quejas.

Ver §3: cada borrado va aprobado por Sergio, uno por uno.

### Fase 4 — limpieza de código (después de apagar, no antes)

| Qué | Dónde |
|---|---|
| Borrar `vercel.json` | `onia-platform/vercel.json` (solo después de montar los crons) y `onia-hermes/web-factory/apps/site/vercel.json` (inofensivo, solo declara framework/build) |
| Borrar carpetas `.vercel/` | `onia-hermes/web-factory/.vercel/`, `onia-hermes/web-factory/apps/site/.vercel/`, `onia-platform/.vercel/`. **Usalas antes de borrarlas**: son el único mapeo repo→proyecto que hay en disco. |
| **Rotar secretos** | `web-factory/.vercel/.env.preview.local` y `web-factory/apps/site/.vercel/.env.preview.local` (1896 bytes c/u) tienen valores traídos de Vercel — Supabase y otros. Están gitignoreados y nunca se commitearon, pero **son secretos reales de tu stack que sobreviven a Vercel.** Revisalos; si alguno es key de producción, rotala. El `VERCEL_OIDC_TOKEN` muere solo al cerrar la cuenta. |
| Reemplazar `NEXT_PUBLIC_VERCEL_ENV` | `onia-platform/instrumentation-client.ts:5`. No rompe (tiene fallback a `NODE_ENV`), pero perdés la distinción preview/production en Sentry. Reemplazo: una env propia `APP_ENV` en el compose del VPS. |
| Corregir docs | `onia-platform/docs/CODEMAPS/dependencies.md:10`, `onia-hermes/COORDINATION_MANIFEST.md:446`, `hermes-content/docs/ONIA_NUVIA_DOMINIO_PROPIO_20260706.md:11,63,72,74`, y los comentarios en `web-factory/apps/site/src/app/page.tsx:4,7` y `middleware.ts:213`. |
| Corregir la recomendación de Bolivian Electric | `C:\dev\clientes\Bolivian Electric\docs\technical\notification-channel-options.md:66,153,155` recomienda Vercel Cron. **Corregir ahora**, o el próximo que lea el doc implementa el acoplamiento que estamos sacando. |
| Arreglar la ruta rota de Traefik | En `main.yaml` hay una regla con el dominio literal `` `WEBHOOK_URL=https://n8n-sergio-n8n.hqdqgh.easypanel.host` ``. Alguien pegó la env var entera en el campo dominio. Apunta a `n8n_n8n:5678`, que no existe. Es basura inerte pero **pide un cert de Let's Encrypt para un hostname inválido**. Sacarla antes de meter 10 dominios nuevos. |

**Ignorar:** los ~7 `vercel.json` bajo `.claude/worktrees/*` son copias de worktrees de sesión, no fuentes. Y los ~60 hits de `*.vercel.app` en `web-factory/data/references/design-sources/**` son portfolios de terceros capturados por el harvester de diseño. Nada que ver con nuestra infra.

---

## 3. Lo irreversible — aprobar uno por uno

**Borrar un proyecto de Vercel no se deshace.** Y borrar uno con cliente mirándolo es una caída en vivo, no un ticket.

**Ninguno de estos proyectos tiene Web Analytics habilitado.** La API devuelve 404 `Web Analytics not found` en todos los que consulté. Traducción: **no hay un solo dato de visitas para ninguno.** No puedo probar que alguien lo mira, y tampoco puedo probar que nadie lo mira. La ausencia de métrica no es prueba de ausencia de tráfico. Todas las decisiones de abajo son con esa ceguera.

### Lista de aprobación

| # | Proyecto | Estado hoy | Decisión de Sergio | Aprobado |
|---|---|---|---|---|
| 1 | `alfred-hq` | 404, deploy en ERROR, 64 días | Borrar. Sin precauciones. Código en repo `AlfredHQ`. | ☐ |
| 2 | `nexodata-empresas` | Alias 404, resto tras SSO | Borrar **después de bajar el fuente** | ☐ |
| 3 | `zen-zhukovsky-5e5b10` | 500 desde 16-jun | Borrar **después de bajar el fuente**. Contiene datos bancarios reales. | ☐ |
| 4 | `demo-nude-twojeys` | 200, demo `STITCH`, sin marca boliviana | Borrar tras guardar screenshots. Código en GitHub. | ☐ |
| 5 | `demo-fotografo-2` | 200 público | ¿Cliente real o ficticio? **Revisar sección "PAGOS" antes.** | ☐ |
| 6 | `epic-motion-group` (v1) | 200, **sin ninguna protección** | ¿El cliente está en v3? Si sí, borrar. | ☐ |
| 7 | `demo-epicmotion` (v2) | 200 público | ¿El cliente está en v3? Si sí, borrar. | ☐ |
| 8 | `onia-center` | 200 sin login | Borrar tras confirmar que nadie difundió `onia-center.vercel.app/nuvia` | ☐ |
| 9 | `demo-epicmotion-v3` | 200, cliente real confirmado | **NO borrar hasta migrar.** | ☐ |
| 10 | `casajardin` | 200, cliente real | **NO borrar hasta migrar o entregar al cliente.** | ☐ |
| 11 | `tempohomes` | 200, cliente real con reservas | **NO borrar hasta migrar o entregar al cliente.** | ☐ |
| 12 | `onia-forms` | 200, intake vivo cableado a n8n | **NO borrar hasta migrar y reemplazar links.** | ☐ |
| 13 | `nuvia-store` | 200, cliente real + el VPS depende de él | **NO borrar hasta cambiar el 308 y servir /nuvia local.** | ☐ |
| 14 | `web-onia` | 200, web corporativa | **NO borrar hasta mover DNS y verificar.** | ☐ |
| 15 | `dental-gest` | 200, SaaS en venta activa | **NO borrar hasta mover DNS y verificar.** | ☐ |
| 16 | `gesti-os` | 200, sin plan B en el VPS | **NO borrar hasta construir el reemplazo.** | ☐ |

**Alternativa a borrar, para todo lo de la mitad de abajo:** en vez de borrar, se puede dejar el proyecto sin deploys y con el dominio ya movido al VPS. Deja de costar builds y no se pierde nada. Borrar de verdad recién cuando pase un mes sin ruido. **Recomiendo eso para los 8 de riesgo alto.**

---

## 4. Qué se pierde al salir de Vercel

| Qué da Vercel | Cómo se reemplaza en el VPS | Estado |
|---|---|---|
| **Certificados TLS automáticos** | Traefik + Let's Encrypt. Ya funciona: `center.onia.com.bo` y `cal.onia.com.bo` tienen cert válido servido desde el VPS. | Cubierto |
| **Ruteo automático por dominio nuevo** | **Manual.** Cada dominio nuevo es una edición a mano de `/etc/easypanel/traefik/config/onia-manual-routes.yaml`. Con ~10 dominios entrando, es trabajo repetido y propenso a error. | Degradado |
| **CDN global** | **No hay reemplazo.** Hoy `www.onia.com.bo` responde cacheado desde `iad1`. Desde el VPS, todo sale de un solo servidor en una sola ubicación. Para Bolivia el impacto probablemente sea chico; **no lo medí — UNKNOWN**. Si duele, la salida es Cloudflare por delante (gratis), no volver a Vercel. | Se pierde |
| **Preview deployments por rama** | **No hay reemplazo.** Y no se puede improvisar: **los builds no pueden correr en el VPS** (lo dice el propio script de deploy: "NUNCA el VPS: swap al 100% → riesgo OOM en prod"). El build seguirá en GitHub Actions y al VPS llega solo el tarball. Para revisar una rama: build local + `pnpm dev`, o un contenedor de staging levantado a mano. | Se pierde |
| **Web Analytics** | **No se pierde nada: estaba deshabilitado en todos los proyectos.** Pero ojo, eso significa que **nunca tuvimos datos de tráfico** y por eso esta migración se hace a ciegas. Si querés métricas, hay que instalar algo (Plausible/Umami self-hosted) — decisión aparte. | No aplica |
| **Crons** | n8n o crontab del VPS. **Ver §2 Fase 1.2 — es el punto más peligroso de todo el plan.** | A construir |
| **Absorción de picos / DDoS** | No hay. Un solo servidor, sin redundancia. Si cae, caen juntos: n8n, Chatwoot, 2 stacks Supabase, Cal.com, el panel y todas las webs. | Se pierde |
| **Rollback de deploy** | Ya existe para `onia-center`: `swap-and-verify.sh` hace backup, swap, verificación HTTP y **rollback automático** si falla. Para `onia-platform` y `onia-landing` **no hay auto-deploy** — se despliegan a mano por tarball/scp. | Parcial |

**Lo que NO se pierde, porque nunca estuvo acoplado.** Barrí los 3 repos:

- **Cero** dependencias `@vercel/*` (analytics, speed-insights, og, kv, blob, postgres). Ni el CLI como devDependency.
- **Cero** `export const runtime = "edge"` en ningún archivo.
- **Cero** workflows de CI que deployen a Vercel. De hecho `deploy-onia-center.yml` ya deploya por SSH al VPS.
- `onia-platform/next.config.ts:41` → `output: "standalone"` siempre. `web-factory/apps/site/next.config.ts` → standalone detrás de `ONIA_STANDALONE_BUILD=true`.
- `onia-platform` ya tiene `Dockerfile`, `docker-compose.selfhost.example.yml`, `.env.selfhost.example` y `scripts/selfhost-preflight.mjs`.
- `Bolivian Electric` no tiene acoplamiento de ningún tipo (solo una recomendación en un doc, sin implementar).

**El acoplamiento a Vercel es superficial en código. El riesgo vive fuera del repo: los crons y el `APP_URL` de n8n.**

---

## 5. Cuánto aguanta el VPS

Números medidos hoy, no estimados:

```
CPU     4 vCPU AMD EPYC 9354P @2.0GHz   load 1.89 / 1.79 / 1.52   steal 8%
RAM     15.62 GiB total | 6.5 usado | 7.4 buff/cache | 9.1 GiB available
SWAP    4.0 GiB total | 3.8 GiB usado (95%) | 217 MiB libres
DISCO   193 G | 93 G usado | 100 G libres (49%)
PSI     memoria: some/full avg300 = 0.00   CPU: some avg300 = 6.11%   IO: 0.24%
OOM     ninguno en dmesg
```

Ya corren 43 contenedores: 2 stacks Supabase completos (26 contenedores), n8n, Chatwoot (4), Cal.com (3), Easypanel + Traefik, speaches, litellm, crawl4ai, uptime-kuma, searxng, y las 4 apps ONIA.

### Sí aguanta la RAM. Con holgura.

Lo que cuesta cada app Next standalone acá, medido:

| App | RAM del contenedor |
|---|---|
| `onia-landing` | 32 MiB |
| `onia-center` | 78 MiB |
| `onia-platform` | 93 MiB |

Los procesos `next-server` en el host van de 148 a 569 MB RSS según app y tráfico. Absorber las 5-6 apps de Vercel que importan = **~1,5-2,5 GB contra 9,1 GiB disponibles**. Entra.

La presión real medida es **cero**: PSI memoria full avg300 = 0.00, sin thrashing, sin OOM en dmesg.

### Pero NO como está. Tres bloqueos concretos.

**1. El swap está al 95%. Bloqueo previo, no matiz.**
3,8 de 4,0 GiB usados. Son páginas frías (litellm 580 MB, speaches/python 550 MB, realtime beam.smp ~460 MB, chatwoot ruby 205 MB). Hoy no duele. Pero **la válvula de seguridad ya está consumida**: el próximo pico no va a swapear, va a OOM-killear. Antes de meter carga nueva:
- subir el swapfile a 8-16 GB, **o**
- recortar los límites de `speaches` y `crawl4ai` (4 GiB reservados cada uno para procesos que usan 866 y 505 MiB).

**2. Los builds no corren acá.** Con 4 vCPU y 8% de steal, un `next build` compite con producción. El script de deploy lo dice explícito. Los builds siguen obligatoriamente en GitHub Actions.

**3. Disco: sobra, pero está sucio.** 100 GB libres hoy. Después de limpiar quedarían ~160 GB:
- 47,88 GB de imágenes Docker reclamables (99% del total de 47,92 GB)
- `/opt/onia-center` pesa **18 G** de backups de deploy acumulados
- `/opt/onia-center-src` 3,1 G de tarballs viejos (uno de 507 MB)

El prune diario (`31 0 * * * docker image prune -af --filter until=24h`) corre pero no alcanza: el filtro `until=24h` no toca imágenes referenciadas por los 68 contenedores (42 activos, 26 restos).

**Veredicto: aguanta, después de subir el swap y limpiar disco. No antes.**

---

## 6. Qué necesita hacer Sergio

Solo esto. El resto es trabajo técnico que se hace sin vos.

| # | Qué | Bloquea a |
|---|---|---|
| S-V1 | **Aprobar la landing nueva de `onia.com.bo`.** El VPS tiene una versión distinta a la de Vercel, no un espejo. Decime cuál publicamos. | Fase 2.4 |
| S-V2 | **Cambiar los registros A del DNS a `187.77.16.63`**, cuando cada dominio esté verificado. Uno por uno, no todos juntos. Dominios: `onia.com.bo`, `www.onia.com.bo`, `app.onia.com.bo`, `dentalgest.onia.com.bo`, `dentalgest.app`, `www.dentalgest.app`, `gestioshq.app`, `www.gestioshq.app`. | Toda la Fase 2 |
| S-V3 | **Confirmar Epic Motion: ¿qué link tiene el cliente?** Si es v3, borramos v1 y v2 y ahorramos dos migraciones. | Aprobaciones 6 y 7 |
| S-V4 | **Confirmar Casa Jardín y TempoHomes: ¿siguen siendo clientes activos?** Si no, no los migramos. Si sí, decidir si los migramos al VPS o se los entregamos con dominio propio. | B5, B6 |
| S-V5 | **Confirmar si a alguien se le mandó el link de `onia-forms.vercel.app`** (cuestionario o brief). Si sí, hay que reemplazar ese link antes de apagar. | B4 |
| S-V6 | **Aprobar los borrados de la §3, uno por uno.** No se borra nada sin tu tilde. | Fase 3 |
| S-V7 | **Decidir si el cron `onia-agents` se agenda o no.** Nunca corrió por schedule. Hoy está gateado por flags. | Fase 1.2 |
| S-V8 | **Decidir sobre `gesti-os`.** Es el único sin plan B: construir el contenedor cuesta trabajo real. ¿Vale la pena mantener gestioshq.app vivo, o se apaga la landing y se retoma después? | B8 |

---

## Apéndice — referencias exactas

**Archivos a tocar:**
- `C:\dev\proyectos\onia-hermes\web-factory\apps\site\src\middleware.ts:201` y `:215` — el 308 a Nuvia
- `C:\dev\proyectos\onia-platform\vercel.json:1-16` — los 3 crons
- `C:\dev\proyectos\onia-platform\instrumentation-client.ts:5` — `NEXT_PUBLIC_VERCEL_ENV`
- `C:\dev\proyectos\onia-hermes\hermes-content\references\onia-project-hygiene-config.json:26` — fuente `vercel`
- `C:\dev\proyectos\onia-hermes\scripts\onia_project_hygiene.mjs:239-243`, `:394` — llamadas a `api.vercel.com`
- `C:\dev\proyectos\onia-hermes\.github\workflows\onia-hygiene-daily.yml:41-42` — secrets Vercel
- `C:\dev\proyectos\onia-platform\docs\n8n-workflows-audit.md:330` — el `APP_URL` (el cambio real va en n8n, no acá)

**IDs de Vercel:**
- Org: `team_BqCitl3qx1WiekYzomhFbBUP`
- `onia-center` (repo `onia-hermes/web-factory`, root `apps/site`): `prj_l3aDcm5YHVAy1oMgge4JrVZHjGTo`
- `dental-gest` (repo `onia-platform`): `prj_foZ5wCgtRI6ciU3GV4oEuIehouby`

**Lo que sigue siendo UNKNOWN y no inventé:**
- Costo mensual de Vercel.
- Tráfico real de cualquier proyecto (Web Analytics deshabilitado en todos).
- Si el workflow n8n del cuestionario está activo (el conector devolvió "connection invalidated" y no disparé el webhook de leads para no ensuciar datos reales).
- `rootDirectory` de `nexodata-empresas`.
- Impacto real de perder el CDN para usuarios en Bolivia.
- Estado del `acme.json` de Traefik y cuántos certs nuevos aguanta la instancia sin pegar contra el rate limit de Let's Encrypt. Por eso: **escalonar los dominios, no meter 10 el mismo día.**
