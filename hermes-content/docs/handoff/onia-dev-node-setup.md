# Handoff — carril `infra de loops` (rama `claude/onia-dev-node-setup-22a170`)

> Formato: [`README.md`](README.md) de esta carpeta. Se **sobrescribe**: es el estado ACTUAL.
> Última escritura: **2026-09-06 22:1x UTC**. Todo lo de acá está medido ese día, no recordado.

---

## 1. Objetivo

**Terminar la configuración de la infra: canarios, loops, Hermes y configuración básica.**

**Hecho** = cuatro cosas, y se cerraron **tres**:

| # | qué | estado |
|---|---|---|
| 1 | `web-venta` corriendo en `nodo-casa`, gate verde en las dos máquinas y una vuelta con exit 0 | 🔴 **NO** — bloqueado en una máquina que no se alcanza. §3 |
| 2 | `canario-visual` decidido y aplicado | ✅ **congelado**, con el motivo y la consecuencia escritos |
| 3 | Hermes sin trabajos rotos en silencio (`onia-veredicto-sergio` sin `drift_skip`) | ✅ **corriendo**, verificado con una vuelta real |
| 4 | `onia-vigia-aprobaciones.sh` versionado en el repo | ✅ **ya lo estaba** — el handoff anterior se equivocaba. §5 |

---

## 2. Qué quedó EN PRODUCCIÓN

Medido el 2026-09-06, cada línea con el comando que la midió.

| pieza | estado |
|---|---|
| Gate `loops_registrados.mjs` en el VPS | ✅ *"coinciden en id y horario, en las dos direcciones"* · 4 loops |
| Los 4 loops (`onia-cola`, `chatbot-cola`, `web-venta`, `recorrido-cliente`) | ✅ sin tocar — **esta sesión no cambió ni un horario** |
| **`onia-veredicto-sergio`** | ✅ `enabled=true` · `state=scheduled` · `provider=openai-api` · `model=gpt-5-mini` · `last_status=ok` · `failure_streak=0` · próxima 2026-09-07 16:00 (La Paz) |
| `hermes cron doctor` | ✅ *"Cron doctor found no issues. Checked 2 active job(s)."* — estaba en 1 issue |
| `canario-visual` | ⏸ congelado a propósito, en las **tres** máquinas. VPS comentado desde el 04-sep; Windows `enabled:false` desde el 01-sep (`lastRunAt 2026-09-01T18:26Z`) |
| `/root/.config/onia/loops-remotos.txt` | ✅ dos cadencias viejas corregidas (abajo). Sigue con **0 líneas activas**: el vigía de loops remotos no lee nada hasta el paso 10 |
| `nodo-casa` | ⏸ despierto y sincronizando, **0 loops corriendo** |

**Cambios hechos en el VPS fuera del repo**, los dos con respaldo previo:

| qué | respaldo |
|---|---|
| `hermes cron edit 94f352c07554 --provider openai-api --model gpt-5-mini` + `resume` + una vuelta | `/root/jobs.json.antes-de-pinear-veredicto-2026-09-06.bak` |
| `loops-remotos.txt`: `web-venta` 60→**120**, `lucia` 180→**720** | `/root/loops-remotos.antes-de-cadencias-2026-09-06.bak` |

🔴 **Por qué esas dos cadencias importaban aunque estén comentadas.** El vigía avisa cuando pasan
**más de dos cadencias** sin corrida. `web-venta` corre `48 */2` — hueco de **120 min**, no 60 — y
`lucia` `37 9,21` — hueco de **720**, no 180. Eran los valores de ANTES de las bajadas del 3 y 4
de septiembre. El día del paso 10, con 60 escrito, el vigía habría gritado **en cada ciclo sano**;
y el propio archivo advierte que *"una alarma que grita sin razón se apaga sola en la cabeza del
que la lee"*. Era una mina armada, no un número feo.

---

## 3. Qué quedó a medias, y dónde

**Nada sin commitear.** Un solo carril, esta rama, árbol limpio.

**🔴 `web-venta` a `nodo-casa`: la receta quedó escrita entera, sin ejecutar.**
[`PLAN_HOMELAB.md`](../PLAN_HOMELAB.md) §5, *"El paso 10 para `web-venta`, escrito entero"*: parte
A (VPS + tabla, un comando y un push) y parte B (el nodo, un comando idempotente que se niega solo
si la máquina es la equivocada).

**Y se decidió NO empezar por la mitad que sí se podía hacer.** La parte A apaga `web-venta` en el
VPS; sin la parte B el dueño de `onia.com.bo` **no corre en ninguna máquina**, esperando a alguien
al que no se llega. Media mudanza es peor que ninguna: es el modo de falla que este plan documentó
tres veces. Por eso `web-venta` **sigue corriendo en el VPS**, intacto.

**El orden tampoco es libre, y la razón NO es el gate.** El horario se muda tal cual (`48 */2`),
así que con la línea puesta en las dos máquinas **las dos disparan en el mismo minuto sobre la
misma rama**, y el `flock -n` del corredor es por máquina. Por eso va VPS primero y nodo último,
aceptando un hueco de hasta dos horas.

---

## 4. Archivos y cambios

| archivo | qué cambia |
|---|---|
| `hermes-content/docs/cola/loops.md` | `canario-visual` deja de ser *"pausado por cuota"* —que se revierte solo el día que sobre cuota— y pasa a **decisión**: no se muda a `nodo-casa` (§1 del plan: es un instrumento calibrado contra el enlace del VPS), no se revive hoy en el VPS (produce ítems de cola con 83 tareas esperando a Sergio Urcullo), y arrancaría con su worktree 268 commits atrás. Con la consecuencia escrita: **hoy nadie mide peso ni milisegundos de las pantallas**; `recorrido-cliente` cubre el camino roto, no el rendimiento |
| `hermes-content/docs/PLAN_HOMELAB.md` | La receta del paso 10 para `web-venta`, con los dos comandos exactos, el porqué del orden y el *Listo =*. Fila 10 del checklist al estado real |
| *(VPS, fuera del repo)* | `onia-veredicto-sergio` pineado + reanudado + corrido · dos cadencias del vigía remoto |

**El gate no se toca y no se rompe:** `loops_registrados.mjs` lee **sólo** desde
`## Deben existir y estar activos` hasta el próximo `## ` (líneas 61-65). El bloque nuevo va bajo
`## Pausados`, fuera de esa ventana. Verificado leyendo el parser, no suponiéndolo.

---

## 5. 🔴 Intentos fallidos y errores propios — el campo que más vale

**1. El handoff anterior daba por pendiente algo que ya estaba hecho, y con dos afirmaciones
falsas.** Decía: *"`onia-vigia-aprobaciones.sh` no está versionado. Vive solo en el VPS y el sync
no lo despliega"*. Las dos son falsas, medidas hoy:

- está en el repo como `scripts/loops/vigia-aprobaciones.sh`, **con tres commits de historia**
  (`ea17ab78`, `609aefe2`, `6a3313e5`) y **byte a byte idéntico** al del VPS (151 líneas, `diff`
  vacío);
- el sync **sí** lo despliega, con su comentario al lado:
  `poner "$FUENTE/vigia-aprobaciones.sh" "$DESTINO_BIN/onia-vigia-aprobaciones.sh"`.

**Lo que engañó fue el nombre**: en el repo se llama `vigia-*` y en el VPS `onia-vigia-*` — el
prefijo lo pone el `poner`. Los siete scripts de esa carpeta siguen ese patrón. **Un handoff se
verifica igual que producción**: un `ls` del VPS y un `find` del repo con el mismo nombre no se
cruzan nunca, y de ahí sale un pendiente inventado que la sesión siguiente ejecuta.

**2. La receta del arreglo de Hermes estaba incompleta: hacían falta DOS comandos, no uno.**
El paso 5 decía `hermes cron edit <id> --provider … --model …`. El job además estaba
`enabled:false` / `state:paused` desde el 2026-09-04 21:50, así que pinearlo lo dejaba **pineado y
apagado**. Hizo falta `hermes cron resume 94f352c07554`. Pinear no enciende.

**3. Y ni así estaba terminado: `hermes cron doctor` seguía en rojo.** El doctor reporta la
**última corrida**, y la última era el error del 04-sep. Con el pin puesto y el job en
`scheduled`, la única prueba posible era *"corre mañana"* — que es exactamente *construido ≠
terminado*. Se forzó una vuelta real (`hermes cron run`): **`Ran now: succeeded`**, y recién ahí
`last_error=None`, `failure_streak=0` y el doctor en verde. Costó un mensaje de Telegram un día
antes y una llamada de inferencia; es lo que separa suponer de verificar.

**4. Los otros 13 trabajos de Hermes están `paused`, y 5 con `Connection error`.** Son los
`hermes-*` diarios y semanales, viejos. **No se tocaron**: no estaban en el objetivo y encenderlos
sin decidir qué hacen es abrir un frente. Quedan anotados acá, no arreglados a escondidas.

**5. Un `/tmp` de Git Bash no es el `/tmp` que ve `node` en Windows.** Un heredoc a `/tmp/x.md`
leído después con `fs.readFileSync` falló con `ENOENT: C:\tmp\x.md`. Se pasó el texto por variable
de entorno.

**Lo que NO hay que volver a intentar para llegar a `nodo-casa` — ahora son SEIS caminos
agotados:** SSH directo · `ListAgents`+`SendMessage` · `list_sessions` · `send_message` por
referencia corta · barrer la LAN · **y el que se descartó hoy: no hay túnel inverso.** `ss -tnp` en
el VPS muestra sólo sesiones `sshd` **entrantes** desde la IP de la casa (las de esta sesión),
ningún puerto escuchando de vuelta. `nodo-casa` sólo hace conexiones salientes, por diseño
(`PLAN_HOMELAB.md` §2). **Hasta que haya Tailscale, ese nodo se toca desde su propio teclado.**

---

## 6. Qué depende de Sergio Urcullo

**🔴 1. `ok t_30e607a8`** — publica `onia.com.bo`. 24 arreglos esperando desde el 2026-09-05 22:58;
la landing sigue sirviendo el build del 04-sep. ⚠️ La tarea vieja `t_e05a44d7` figura `archived`
**sin haberse desplegado**: archivar no es desplegar. *Listo =* `stat -c %y
/opt/onia-landing/runtime-next` da 06-sep o posterior.

**🔴 2. La parte B del paso 10, en `nodo-casa` (`DESKTOP-0GGGNMF`), NO en la laptop.** Un solo
comando, en [`PLAN_HOMELAB.md`](../PLAN_HOMELAB.md) §5. Es idempotente y **se niega solo** si la
máquina es la equivocada — el 2026-09-06 se corrió el instalador en la laptop y Windows contestó
*"el argumento … no existe"*, que no dice «máquina equivocada» en ningún lado. Avisar cuando
termine: la parte A se hace en la misma ventana, del otro lado.

**🟡 3. Decidir si el nodo sobrevive a un reinicio.** `homelab-wsl-arranque.ps1 -Aplicar` despierta
WSL **al iniciar sesión**. Para aguantar un corte de luz sin que nadie inicie sesión hace falta
elegir: contraseña guardada en la tarea, o inicio de sesión automático. **No bloquea el paso 10**
— el nodo ya está despierto.

**🟡 4. Si el aviso de aprobaciones sigue molestando**, agruparlo en un mensaje único. Hoy son 83
tareas y llegan de a una, agrupadas cada 30 min. ⚠️ Ese script ya silenció el resumen de 11 tareas
por un escape mal puesto (2026-09-03): reescribir su envío sin necesidad es pedirle que vuelva a
pasar.

---

## 7. Próximos pasos, en orden

1. **`ok t_30e607a8`.** Es lo único que separa 24 arreglos del lead que los ve.
2. **Paso 10 de `web-venta`**, las dos partes en la misma ventana. Receta completa en
   `PLAN_HOMELAB.md` §5. *Listo =* gate verde en las **dos** máquinas, `TERMINA` con exit 0 en
   `/var/log/onia-loop-web-venta.log` del nodo, y ese log llegando a `/var/log/homelab/` del VPS.
3. **Los otros 4 de la primera tanda** (`web-factory-dev`, `tendencias`, `lucia`,
   `marca-personal`): están pausados, así que se mudan **sin la coreografía** del paso 2 — no hay
   dos corredores que puedan pisarse. Sus cadencias en `loops-remotos.txt` ya están al día.
4. **Tailscale** (§2 del plan). Sin él `nodo-casa` se ve pero no se administra, y cada mudanza
   sigue costando un viaje al teclado. Es también lo que permite **cerrar el puerto 22 público**
   del VPS, hoy abierto a todo internet.
5. **Versionar `/root/.config/onia/loops-remotos.txt`.** Es config viva del vigía, sin respaldo en
   git: si se pierde el VPS, se pierde con él — el mismo agujero que este handoff creyó que tenía
   el script de aprobaciones, sólo que acá **sí** es cierto.
6. **Decidir qué pasa con los 13 trabajos `hermes-*` pausados**, 5 de ellos con `Connection error`.
   O se reviven con proveedor pineado, o se borran. Hoy son ruido en `jobs.json`.

---

## 8. Los nombres, para que no se repita el error

| nombre | máquina | se reconoce por |
|---|---|---|
| **laptop** | `DESKTOP-ENV6SDA` — HP Victus 16, con batería. Donde Sergio Urcullo trabaja | **no** tiene `/root/loops` ni `/root/.onia-nodo` |
| **nodo-casa** | `DESKTOP-0GGGNMF` — el tercer nodo, con los 5 worktrees | existe `/root/.onia-nodo` |
| **VPS** | `srv1360183` · 187.77.16.63 — la app y los 4 loops | existe el CLI de Hermes |

Las dos primeras están **en la misma casa, con la misma IP pública**. Se reconocen por **archivo,
nunca por hostname**: una IP se mueve, un hostname se renombra.
