# Handoff — carril `infra de loops` (rama `claude/onia-dev-node-setup-22a170`)

> Formato: [`README.md`](README.md) de esta carpeta. Se **sobrescribe**: es el estado ACTUAL.
> Última escritura: **2026-09-06 22:4x UTC**. Todo lo de acá está medido ese día, no recordado.

---

## 1. Objetivo

**Terminar la configuración de la infra: canarios, loops, Hermes y configuración básica.**

| # | qué | estado |
|---|---|---|
| 1 | `web-venta` corriendo en `nodo-casa`, gate verde en las DOS máquinas y una vuelta con exit 0 | 🟡 **mudado y gate verde en el VPS**; falta la prueba de la vuelta del nodo. §3 |
| 2 | `canario-visual` decidido y aplicado | ✅ **congelado**, con el motivo y la consecuencia escritos |
| 3 | Hermes sin trabajos rotos en silencio (`onia-veredicto-sergio` sin `drift_skip`) | ✅ **corriendo**, verificado con una vuelta real |
| 4 | `onia-vigia-aprobaciones.sh` versionado en el repo | ✅ **ya lo estaba** — el handoff anterior se equivocaba. §5 |

---

## 2. Qué quedó EN PRODUCCIÓN

Medido el 2026-09-06, cada línea con el comando que la midió.

| pieza | estado |
|---|---|
| **`web-venta` mudado a `nodo-casa`** | ✅ fuera del `crontab` del VPS a las **22:38:02Z**, 10 min antes de la corrida de las `:48` — **sin solapamiento** |
| Gate `loops_registrados.mjs` en el VPS | ✅ *"coinciden en id y horario, en las dos direcciones"* · **3 loops** (eran 4) |
| Los 3 que quedan en el VPS | `chatbot-cola` `3 * * * *` · `onia-cola` `33 * * * *` · `recorrido-cliente` `9 1,4,…,22` |
| `nodo-casa` | ✅ marca `/root/.onia-nodo` = `casa` · corredor `onia-loop.sh` ejecutable · worktree en `claude/web-venta` · **una sola** línea `48 */2` |
| Vigía de loops remotos | ✅ **encendido para `web-venta`, cadencia 120.** Antes de hoy no vigilaba nada |
| **`onia-veredicto-sergio`** | ✅ `enabled=true` · `state=scheduled` · `provider=openai-api` · `model=gpt-5-mini` · `last_status=ok` · `failure_streak=0` · próxima 2026-09-07 16:00 (La Paz) |
| `hermes cron doctor` | ✅ *"Cron doctor found no issues. Checked 2 active job(s)."* — estaba en 1 issue |
| `canario-visual` | ⏸ congelado a propósito, en las **tres** máquinas. VPS comentado desde el 04-sep; Windows `enabled:false` desde el 01-sep (`lastRunAt 2026-09-01T18:26Z`) |

**Cambios hechos en el VPS fuera del repo**, todos con respaldo previo:

| qué | respaldo |
|---|---|
| `hermes cron edit 94f352c07554 --provider openai-api --model gpt-5-mini` + `resume` + una vuelta | `/root/jobs.json.antes-de-pinear-veredicto-2026-09-06.bak` |
| `loops-remotos.txt`: `web-venta` 60→**120**, `lucia` 180→**720**, y `web-venta` descomentado | `/root/loops-remotos.antes-de-cadencias-2026-09-06.bak` |
| línea de `web-venta` fuera del `crontab` | `/root/crontab.antes-de-mudar-web-venta-2026-09-06.txt` |

**Scripts dejados en el VPS** (de un solo uso, no versionados):
`/root/centinela-web-venta.sh` (esperó la fila en `main` y bajó la línea) ·
`/root/testigo-vuelta-nodo.sh` (espera la vuelta del nodo en `/var/log/homelab/`).

🔴 **Por qué las dos cadencias del vigía importaban aunque estuvieran comentadas.** El vigía avisa
cuando pasan **más de dos cadencias** sin corrida. `web-venta` corre `48 */2` — hueco de **120
min**, no 60 — y `lucia` `37 9,21` — **720**, no 180. Eran los valores de ANTES de las bajadas del
3 y 4 de septiembre. **Se encendió hoy mismo el de `web-venta`**: con 60 escrito habría gritado
**en cada ciclo sano** desde el minuto uno, y el propio archivo advierte que *"una alarma que grita
sin razón se apaga sola en la cabeza del que la lee"*. Era una mina armada para hoy.

---

## 3. Qué quedó a medias, y dónde

**Nada sin commitear.** Un solo carril, esta rama, árbol limpio.

**🟡 Falta la prueba de la vuelta del nodo, y es lo único que separa el objetivo 1 de estar
cerrado.** `web-venta` dispara en `nodo-casa` a las `48 */2`; la vuelta se ve en
`/var/log/homelab/onia-loop-web-venta.log` **del VPS**, que el nodo sube por rsync cada 10 min. El
baseline es `2026-09-05T03:52` (última vuelta antes de que se pausara allá): cualquier `ARRANCA`
del 06-sep 22:4x o posterior es nueva. `/root/testigo-vuelta-nodo.sh` está esperando eso.

**Se mira el LOG y no el cron a propósito** — *"un loop puede morir con su cron INTACTO"*.

**Si esa vuelta no llega o sale mal**, revertir es una línea con el respaldo de arriba:
`crontab -l > /tmp/x; { cat /tmp/x; echo "48 */2 * * * /root/bin/onia-loop.sh web-venta >> /var/log/onia-loop-web-venta.log 2>&1"; } | crontab -`
y devolver la fila de la tabla a `**VPS**` — **las dos juntas**, con el candado de §5 en la cabeza.

---

## 4. Archivos y cambios

| archivo | qué cambia |
|---|---|
| `hermes-content/docs/cola/loops.md` | `web-venta` pasa de `**VPS**` a `**casa**` en la tabla de activos, **sin tocar el horario**. Y `canario-visual` deja de ser *"pausado por cuota"* —que se revierte solo el día que sobre cuota— y pasa a **decisión**, con la consecuencia escrita: hoy nadie mide peso ni milisegundos de las pantallas; `recorrido-cliente` cubre el camino roto, no el rendimiento |
| `hermes-content/docs/PLAN_HOMELAB.md` | La receta del paso 10 **ejecutada y corregida**: el orden es NODO → TABLA → VPS, con el último disparado por la condición y no por un reloj. Fila 10 del checklist al estado real |
| *(VPS, fuera del repo)* | `onia-veredicto-sergio` pineado + reanudado + corrido · vigía remoto con `web-venta` encendido y las cadencias al día · línea de `web-venta` fuera del cron |

---

## 5. 🔴 Intentos fallidos y errores propios — el campo que más vale

**1. El orden que yo mismo escribí para el paso 10 era al revés, y se atasca solo.** Lo escribí
razonando sobre el minuto `:48` compartido —*"VPS primero, nodo último"*— y choqué con la
restricción que de verdad manda: **la tabla sólo llega a `main` por el integrador, y el integrador
exige el gate del VPS en verde.**

| si sacás la línea del VPS primero | 3 líneas de cron contra 4 filas `VPS` → gate rojo → `npm test` falla → **el integrador deja de mergear** → la fila corregida no llega NUNCA. Candado permanente |
|---|---|
| **si la tabla llega primero** | 4 líneas contra 3 filas → rojo también, **pero de segundos**, y el integrador ya mergeó |

**No existe un orden sin rojo**: lo único que se elige es cuál de los dos y cuánto dura. Quedó
escrito en el plan. Lección más general: *una receta escrita y no ejecutada es una hipótesis.*
Esta se veía impecable y era un candado.

**2. El primer centinela lo colgué de mi propia sesión SSH y se murió** con `Connection reset by
peer` (exit 255) sin llegar a medir nada. **Falló seguro** —verificado: cron con 1 línea, vigía en
0, sin backup creado— pero si la condición se hubiera cumplido en ese rato, la ventana se pasaba y
el VPS quedaba con la línea de más. **Un centinela que vigila una ventana corta va DESPRENDIDO en
la máquina que vigila**, no en el tubo de quien lo lanza.

**3. El handoff anterior daba por pendiente algo ya hecho, con dos afirmaciones falsas.** Decía que
`onia-vigia-aprobaciones.sh` *"no está versionado, vive solo en el VPS y el sync no lo despliega"*.
Las dos falsas: está en `scripts/loops/vigia-aprobaciones.sh` con **tres commits** (`ea17ab78`,
`609aefe2`, `6a3313e5`), **byte a byte idéntico** (151 líneas, `diff` vacío), y el sync lo
despliega con su comentario al lado. **Engañó el prefijo**: en el repo es `vigia-*` y en el VPS
`onia-vigia-*` — lo pone el `poner`. Buscar el mismo nombre en los dos lados no cruza nunca, y de
ahí sale un pendiente inventado que la sesión siguiente ejecuta.

**4. La receta del arreglo de Hermes tenía un comando y hacían falta TRES.** `hermes cron edit`
pinea, pero el job estaba además `enabled:false`/`paused` desde el 04-sep: **pinear no enciende**,
hizo falta `resume`. Y ni así estaba terminado: `cron doctor` reporta la **última corrida**, que
seguía siendo el error del 04-sep, así que la única prueba era *"corre mañana"* — exactamente
*construido ≠ terminado*. Se forzó una vuelta: **`Ran now: succeeded`**, y recién ahí verde.

**5. Los otros 13 trabajos de Hermes están `paused`, 5 con `Connection error`.** No se tocaron: no
estaban en el objetivo. Anotados, no arreglados a escondidas.

**6. Un `/tmp` de Git Bash no es el `/tmp` que ve `node` en Windows** (`ENOENT: C:\tmp\...`). Y un
`heredoc` largo con comillas desbalanceadas muere con *"unexpected EOF"*: para textos largos, ir
por variable de entorno o por la herramienta de escritura.

**Lo que NO hay que volver a intentar para llegar a `nodo-casa` — SEIS caminos agotados:** SSH
directo · `ListAgents`+`SendMessage` · `list_sessions` · `send_message` por referencia corta ·
barrer la LAN · **y el descartado hoy: no hay túnel inverso** (`ss -tnp` en el VPS muestra sólo
sesiones `sshd` entrantes; el nodo sólo hace conexiones salientes, por diseño). ✅ **Pero el
circuito que SÍ funciona quedó probado hoy:** Sergio Urcullo teclea **un** comando allá y la
sesión de control cierra el resto sola. La parte cara es su tiempo, así que el comando tiene que
llegar listo, idempotente y con guarda de máquina.

---

## 6. Qué depende de Sergio Urcullo

**🔴 1. `ok t_30e607a8`** — publica `onia.com.bo`. 24 arreglos esperando desde el 2026-09-05 22:58;
la landing sigue sirviendo el build del 04-sep. ⚠️ La tarea vieja `t_e05a44d7` figura `archived`
**sin haberse desplegado**: archivar no es desplegar. *Listo =* `stat -c %y
/opt/onia-landing/runtime-next` da 06-sep o posterior.

**🟡 2. Decidir si el nodo sobrevive a un reinicio.** Ahora importa más que ayer: **hay un loop de
producción corriendo allá.** `homelab-wsl-arranque.ps1 -Aplicar` despierta WSL **al iniciar
sesión**; para aguantar un corte de luz sin que nadie inicie sesión hace falta elegir: contraseña
guardada en la tarea, o inicio de sesión automático. Mitigado mientras tanto: el vigía de loops
remotos avisa si `web-venta` deja de dar señales.

**🟡 3. Si el aviso de aprobaciones sigue molestando**, agruparlo en un mensaje único. Hoy son 83
tareas, de a una, agrupadas cada 30 min. ⚠️ Ese script ya silenció el resumen de 11 tareas por un
escape mal puesto (2026-09-03): reescribir su envío sin necesidad es pedirle que vuelva a pasar.

---

## 7. Próximos pasos, en orden

1. **Confirmar la vuelta del nodo** (§3). Es lo único que falta del objetivo 1.
2. **`ok t_30e607a8`.** Lo único que separa 24 arreglos del lead que los ve.
3. **Los otros 4 de la primera tanda** (`web-factory-dev`, `tendencias`, `lucia`,
   `marca-personal`): están pausados en las dos máquinas, así que se mudan **sin la coreografía**
   —no hay dos corredores que puedan pisarse—, pero **la tabla sigue yendo antes que el cron del
   VPS**. Sus cadencias en `loops-remotos.txt` ya están al día.
4. **Tailscale** (§2 del plan). Cada mudanza sigue costando un viaje al teclado de `nodo-casa`, y
   es lo que permite **cerrar el puerto 22 público** del VPS, hoy abierto a todo internet.
5. **Versionar `/root/.config/onia/loops-remotos.txt`.** Es config viva del vigía sin respaldo en
   git — y desde hoy **ya no es hipotética**: si se pierde el VPS, `web-venta` queda sin vigilancia
   y nadie se entera.
6. **Decidir qué pasa con los 13 trabajos `hermes-*` pausados**, 5 con `Connection error`. O se
   reviven con proveedor pineado, o se borran. Hoy son ruido en `jobs.json`.

---

## 8. Los nombres, para que no se repita el error

| nombre | máquina | se reconoce por |
|---|---|---|
| **laptop** | `DESKTOP-ENV6SDA` — HP Victus 16, con batería. Donde Sergio Urcullo trabaja | **no** tiene `/root/loops` ni `/root/.onia-nodo` |
| **nodo-casa** | `DESKTOP-0GGGNMF` — el tercer nodo, con los 5 worktrees | existe `/root/.onia-nodo`, con `casa` adentro |
| **VPS** | `srv1360183` · 187.77.16.63 — la app y los 3 loops | existe el CLI de Hermes |

Las dos primeras están **en la misma casa, con la misma IP pública**. Se reconocen por **archivo,
nunca por hostname**: una IP se mueve, un hostname se renombra. ⚠️ Y `nodo-casa` **ya corre Ubuntu
adentro**: si el prompt dice `compu_pc_casa_sergio@DESKTOP-0GGGNMF`, ya estás **dentro** de WSL —
`wsl` es un comando de Windows y ahí no existe. Los comandos van directos, con `sudo`, porque el
`crontab` de los loops es el de `root`.
