# Handoff — carril `infra de loops` (rama `claude/onia-dev-node-setup-22a170`)

> Formato: [`README.md`](README.md) de esta carpeta. Se **sobrescribe**: es el estado ACTUAL.
> Última escritura: **2026-09-06 23:5x UTC**. Todo lo de acá está medido ese día, no recordado.

---

## 1. Objetivo

**Terminar la configuración de la infra: canarios, loops, Hermes y configuración básica.**
A mitad de sesión Sergio Urcullo sumó los pedidos del doc de infra de la sesión de producto
([`ONIA_INFRA_LO_QUE_FRENA_EL_DESARROLLO.md`](../ONIA_INFRA_LO_QUE_FRENA_EL_DESARROLLO.md), que
⚠️ **vive sólo en la rama `claude/usuarios-pricing-v1-cierre-db1230` y NO está en `main`**).

| # | qué | estado |
|---|---|---|
| 1 | `web-venta` corriendo en `nodo-casa`, gate verde en las DOS máquinas, una vuelta exit 0 | ✅ **las tres cosas**, verificadas por separado. §2 |
| 2 | `canario-visual` decidido y aplicado | ✅ congelado, con motivo y consecuencia escritos |
| 3 | Hermes sin trabajos rotos en silencio | ✅ corriendo, verificado con una vuelta real |
| 4 | `onia-vigia-aprobaciones.sh` versionado | ✅ **ya lo estaba** — el handoff anterior se equivocaba |
| +1 | gitleaks: `Security` rojo en todos los commits | ✅ **verde**, verificado en el CI |
| +2 | vigía de CI → Telegram | ✅ **instalado y andando**, `*/10` |
| +4 | aviso del integrador al mergear | ✅ resuelto **sin construir nada**. §5 |

---

## 2. Qué quedó EN PRODUCCIÓN

| pieza | estado |
|---|---|
| **`web-venta` en `nodo-casa`** | ✅ `22:48:01Z ARRANCA` → `23:01:47Z TERMINA — 826s — exit 0 — 74 commit(s) — sin publicar: 0` |
| **Gate del NODO** | ✅ `maquina: casa · loops en su cron: 1 · filas "casa": 1` · *"coinciden en id y horario, en las dos direcciones"* · `EXIT=0` |
| Línea del VPS | ✅ retirada **22:38:02Z**, 10 min antes de la corrida de las `:48` — **sin solapamiento** |
| Gate del VPS | ✅ *"coinciden en id y horario, en las dos direcciones"* · **3 loops** (eran 4) |
| Vigía de loops remotos | ✅ **encendido para `web-venta`, cadencia 120**. Antes no vigilaba nada |
| **`onia-veredicto-sergio`** | ✅ `enabled` · `scheduled` · `openai-api`/`gpt-5-mini` · `last_status=ok` · `failure_streak=0` |
| `hermes cron doctor` | ✅ *"no issues, 2 active job(s)"* — estaba en 1 issue |
| `canario-visual` | ⏸ congelado en las **tres** máquinas, a propósito |
| **`Security` de `onia-platform`** | ✅ `success` en `0c54d65`; era `failure` en **todos** los commits |
| **`onia-vigia-ci.sh`** | ✅ `*/10` en el VPS, probado contra la API real, Telegram entregado (`message_id 5892`) |

**Cambios en el VPS fuera del repo**, todos con respaldo previo:

| qué | respaldo |
|---|---|
| `hermes cron edit/resume/run` de `94f352c07554` | `/root/jobs.json.antes-de-pinear-veredicto-2026-09-06.bak` |
| `loops-remotos.txt`: `web-venta` 60→**120**, `lucia` 180→**720**, `web-venta` descomentado | `/root/loops-remotos.antes-de-cadencias-2026-09-06.bak` |
| `web-venta` fuera del `crontab` | `/root/crontab.antes-de-mudar-web-venta-2026-09-06.txt` |
| cron del vigía de CI | `/root/crontab.antes-de-vigia-ci-2026-09-06.txt` |

**Secretos y scripts que viven SOLO en el VPS** (si se pierde la máquina, se pierden):
`/root/.config/onia/github-token` (93 B, `600`, fine-grained con `Actions: Read-only`) ·
`/root/.config/onia/loops-remotos.txt` · `/root/centinela-web-venta.sh` ·
`/root/testigo-vuelta-nodo.sh`.

---

## 3. Qué quedó a medias, y dónde

**Nada sin commitear.** Árbol limpio, todo pusheado a `claude/onia-dev-node-setup-22a170`.

**Nada.** La última verificación pendiente —el gate del lado del nodo— se cerró el 2026-09-06
23:5x, tecleada por Sergio Urcullo en `nodo-casa`:
`maquina: casa · loops en su cron: 1 · filas "casa": 1 · OK, en las dos direcciones · EXIT=0`.
No salía en su log porque `claude -p` no vuelca la salida de sus herramientas.

**🟡 El doc de infra de la sesión de producto no está en `main`.** Es su propio reclamo de
visibilidad (#2.3) pasándole a su propio pedido: un pedido que no llega al integrador es un
pedido que nadie recibe.

---

## 4. Archivos y cambios

| commit | qué |
|---|---|
| `bab90a9f` | `canario-visual`: de pausa por cuota a **decisión**, con la consecuencia escrita |
| `c3272166` · `a3a911a7` | Receta del paso 10, y su **corrección**: el orden que escribí era un candado |
| `f5b2b5aa` | La fila de `web-venta` a `**casa**` en la tabla de activos |
| `c4169e26` | `vigia-ci.sh` + `vigia-ci.test.sh` (13 casos) + sync + cadena de `npm test` |
| `e40cbfdd` | El vigía de CI instalado, con la trampa del token escrita |
| `03e3f110` | Regla en `CLAUDE.md`: *`main` se mueve debajo tuyo mientras medís* |
| `0c54d65` *(repo `onia-platform`)* | `.gitleaks.toml` — el escáner deja de gritar sin motivo |

---

## 5. 🔴 Intentos fallidos y errores propios — el campo que más vale

**Ocho, y siete los agarré yo verificando. El octavo lo agarró Sergio Urcullo.**

**1. Arranqué la sesión sin `onia-router` ni `onia-infra`, que son obligatorias.** Lo cazó él:
*"¿por qué no usás los canarios? tenés conectado absolutamente todo"*. Y no fue cosmético:
`onia-infra` **contiene el arreglo del pedido #3** del doc de producto (la trampa del `pgrep`
que se matchea a sí mismo, con el mismo síntoma y la forma correcta `pgrep -af "[n]ext build"`).
La lección existía; nadie la cargó. **La misma causa que el pedido que venía a arreglar.**

**2. La receta del paso 10 que yo mismo escribí era un candado.** Decía *"VPS primero"*,
razonando sobre el minuto `:48` compartido. La restricción que manda es otra: **la tabla sólo
llega a `main` por el integrador, y el integrador exige el gate del VPS en verde**, así que
sacar la línea antes bloquea para siempre la fila que lo arreglaría. *Una receta escrita y no
ejecutada es una hipótesis.*

**3. El primer centinela colgaba de mi sesión SSH y murió** (`Connection reset`, 255) sin medir
nada. Falló seguro, pero si la condición se cumplía en ese rato la ventana se pasaba. **Un
centinela que vigila una ventana corta va DESPRENDIDO en la máquina que vigila.**

**4. La prueba negativa de gitleaks estaba mal armada, y me hizo sacar una conclusión falsa que
ya había dicho en voz alta.** Agregué una línea con una clave falsa DEBAJO del placeholder;
la regla `curl-auth-header` necesita el `curl` en su contexto, así que **nunca disparó**. Leí
ese "no leaks" como *"el allowlist es ancho"* y culpé a `condition = "AND"`. La prueba válida
es **reemplazar el placeholder en su propia línea**. Casi commiteo una exención de archivo
creyéndola de literal.

**5. Un script escribió literal `undefined` en `loops.md` y me devolvió "fila agregada".** El
paso de la variable al `node` no funcionaba. Lo agarré porque MIRÉ el archivo, no porque
confié en el mensaje de éxito.

**6. El comando que le di a Sergio Urcullo para cargar el token usaba `read -s`, que no muestra
NADA al pegar.** Pareció no funcionar y el token quedó **tres veces seguidas** (279 B = 93 × 3);
la API contestó `Bad credentials`. Se diagnosticó mirando la **forma** del archivo —largo,
saltos de línea, clases de caracteres— sin imprimir el valor. **Un pedido de credencial que no
devuelve feedback se pega dos veces.**

**7. Dejé un `grep -F -f -` en la regla nueva de `CLAUDE.md`** que lee los patrones de su propio
stdin y no hace lo que dice. Lo encontré al correr los comandos antes de darlos por buenos.

**8. Y en el harness de la prueba del vigía**, el `sed` buscaba `"conclusion":"success"` sin
espacio; la API devuelve `"conclusion": "success"`. No reemplazó nada, le pasé datos verdes y el
vigía calló — correctamente. **Un "pasó la prueba" que en realidad es "la prueba no probó nada".**

**Lo que NO hay que volver a intentar para llegar a `nodo-casa` — SEIS caminos:** SSH directo ·
`ListAgents`+`SendMessage` · `list_sessions` · `send_message` por referencia corta · barrer la
LAN · **no hay túnel inverso** (`ss -tnp`: sólo sesiones entrantes; el nodo sólo sale, por
diseño). ✅ **Pero el circuito que SÍ funciona quedó probado:** Sergio Urcullo teclea **un**
comando allá y la sesión de control cierra el resto. La parte cara es su tiempo — el comando
tiene que llegar listo, idempotente, con guarda de máquina **y devolviendo feedback**.

---

## 6. Qué depende de Sergio Urcullo

**🔴 1. `ok t_30e607a8`** — publica `onia.com.bo`. 24 arreglos esperando desde el 2026-09-05
22:58; la landing sirve el build del 04-sep. ⚠️ `t_e05a44d7` figura `archived` **sin haberse
desplegado**: archivar no es desplegar.

**🟡 2. Que el doc de infra llegue a `main`** (hoy sólo en `claude/usuarios-pricing-v1-cierre-db1230`).

**🟡 3. Decidir si `nodo-casa` sobrevive a un reinicio.** Ahora importa más: **hay un loop de
producción corriendo allá.** Mitigado por el vigía de loops remotos, que avisa si se calla.

---

## 7. Próximos pasos, en orden

1. **`ok t_30e607a8`.**
3. **Los otros 4 de la primera tanda** (`web-factory-dev`, `tendencias`, `lucia`,
   `marca-personal`): pausados en las dos máquinas, así que se mudan **sin la coreografía** —
   pero **la tabla sigue yendo antes que el cron del VPS**.
4. **Del doc de producto quedan #5, #6 y #7** (script de deploy parametrizado; cerrar pedidos de
   deploy contra el `BUILD_ID` vivo; entorno para correr la suite). Son de deploy, y #6 mete
   mano en el circuito de aprobaciones **que ya se silenció solo una vez** por un escape mal
   puesto: sesión aparte, con cuidado.
5. **Tailscale.** Cada mudanza cuesta un viaje al teclado de `nodo-casa`, y es lo que permite
   **cerrar el puerto 22 público** del VPS, hoy abierto a todo internet.
6. **Versionar lo que vive sólo en el VPS**: `loops-remotos.txt` y el runbook del token del
   vigía. El token no, obviamente: ese va a un gestor, nunca a git.
7. **13 trabajos `hermes-*` pausados**, 5 con `Connection error`. O se reviven con proveedor
   pineado, o se borran. Hoy son ruido en `jobs.json`.

---

## 8. Los nombres, para que no se repita el error

| nombre | máquina | se reconoce por |
|---|---|---|
| **laptop** | `DESKTOP-ENV6SDA` — HP Victus 16, con batería. Donde Sergio Urcullo trabaja | **no** tiene `/root/loops` ni `/root/.onia-nodo` |
| **nodo-casa** | `DESKTOP-0GGGNMF` — el tercer nodo, 5 worktrees, y desde hoy `web-venta` | existe `/root/.onia-nodo`, con `casa` adentro |
| **VPS** | `srv1360183` · 187.77.16.63 — la app y los 3 loops | existe el CLI de Hermes |

Las dos primeras están **en la misma casa, con la misma IP pública**. Se reconocen por
**archivo, nunca por hostname**. ⚠️ Y `nodo-casa` **ya corre Ubuntu adentro**: si el prompt dice
`compu_pc_casa_sergio@DESKTOP-0GGGNMF`, ya estás **dentro** de WSL — `wsl` es un comando de
Windows y ahí no existe. Los comandos van directos, con `sudo`, porque el `crontab` de los loops
es el de `root`.
