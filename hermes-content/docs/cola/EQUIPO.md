# El equipo — quién hace qué, y por qué dejaron de chocar

> Doc vivo, sin fecha en el nombre: se **EDITA**, no se duplica.
> Escrito el **2026-09-02** después de que Sergio mirara la lista de loops y dijera:
> *"quiero que te sientes y organices tu equipo, porque chocan tanto — uno desarrolla, otro
> audita, otro investiga, otro perfecciona, otro revisa"*.

> **HISTÓRICO desde el 17-oct-2026.** Reemplazado por `AGENTS.md` §1 (quién hace qué: la jefa reparte, la madre controla la PC, Codex solo revisa) y §4 (`main` solo por PR con CI verde y revisión de Codex; «Quién decide»). Donde diga que `onia-cola` o la madre mergean, que un loop se rearma contra esta lista o que lo visual se publica sin esperar, ya no rige. Las colas vigentes: `cola/loop/README.md`.

**Este archivo dice QUIÉN hacía qué (septiembre).** La lista de qué loops deben existir y con qué horario vive
en [`loops.md`](loops.md); la doctrina de cómo se arma uno, en
[`COMO_SE_ARMA_UN_LOOP.md`](../COMO_SE_ARMA_UN_LOOP.md). Un tema, un lugar.

---

## Por qué chocaban — las tres causas, medidas

No era mala suerte. Eran tres cosas concretas, y las tres tienen arreglo mecánico:

1. **Dos loops sobre la misma rama.** `docs-auditoria` nació sobre
   `claude/git-status-935f47`, que ya era de la sesión de control. En su primera vuelta las dos
   escribieron `loops.md` en paralelo: conflicto a mano, y una de las dos habría quedado con el
   push rechazado. **Crear un worktree sobre una rama que ya tiene dueño no avisa nada.**
2. **Cuatro loops editando el mismo archivo de cola.** `COLA.md` lo escribían el canario, el
   integrador, `web-venta` y el auditor.
3. **Nadie era dueño de una superficie viva.** `onia.com.bo/` y `/empezar` no estaban en ninguna
   zona: el canario dejaba defectos ahí y **nadie los consumía**.

## Las tres reglas que lo cierran

**1. Un oficio = un loop = un worktree = una rama = una zona.**
La zona son **rutas**, no temas. Si dos loops pueden escribir el mismo archivo, uno de los dos
está mal definido.

**2. En las colas, el que MIRA agrega y el que ARREGLA marca.**
El canario y el auditor **sólo agregan** ítems `[ ]` al final de la sección. El dueño de la zona
es el único que los marca `[x]` y el único que edita su texto. Agregar al final se mergea solo;
editar la misma línea desde dos lados, no.

**3. `main` solo por PR revisado.** *(Histórico: antes lo tocaba un único integrador, `onia-cola`, muerto desde el 27-sep.)* Hoy: CI verde y revisión de Codex, y lo une la jefa o la rutina QA bajo la lista de `AGENTS.md` §4. El hook `pre-push` (`.githooks/pre-push`) es un cerrojo para los clones del VPS; aún deja pasar `ONIA_LOOP_ID=onia-cola`, hueco anotado en AGENTS §4.

---

## Los oficios

| oficio | loop | qué hace | escribe SÓLO en |
|---|---|---|---|
| ~~**Integra**~~ | ~~`onia-cola`~~ (muerto desde el 27-sep) | Era el integrador. Hoy no hay integrador: une la jefa o la rutina QA por PR (`AGENTS.md` §4) | - |
| **Desarrolla la venta** | `web-venta` | `onia.com.bo/` y `/empezar` — la puerta de entrada | `web-factory/apps/onia-platform/**` |
| **Desarrolla el chatbot** | `chatbot-cola` | Que un desconocido escriba y esa charla se vea en la bandeja | `hermes-content/deploy/vps-ops/**` · `cola/chatbot.md` |
| **Revisa** | `canario-visual` | Abre y **MIRA** 10 pantallas de cliente. Cada diferencia se vuelve ítem en la cola del **dueño** | ítems `[ ]` nuevos, nada más |
| **Audita** | `docs-auditoria` | Que lo escrito sea cierto; que nadie pise a nadie; que lo que hacemos tenga sentido | `hermes-content/docs/**` |
| **Investiga** | `investigacion` | **Cotiza** las decisiones abiertas del radar para que Sergio decida en tanda, una vez, sobre un archivo | `docs/research/**` · el radar |
| **Produce** | `marca-personal` | El drop del día siguiente y una pieza creativa | `marca-personal/**` · `cola/marca-personal.md` |

**Uno más, que no es mío:** `contenido-cola` corre en Windows y **lo maneja Sergio en su propia
sesión**. Ningún loop del VPS lo toca ni lo rearma.

### Y una capa ARRIBA de todos: Hermes Agent

Los siete loops tienen un techo que ninguno puede romper solo: **cada uno come de su propia cola.
Ninguno decide qué importa más esta semana.** Eso lo hacía Sergio, todos los días, o no lo hacía
nadie.

**Hermes Agent** (de NousResearch, en el VPS) cubre exactamente eso: **12 trabajos programados**
que entregan por Telegram — agenda diaria con 3 prioridades, kickoff los lunes, revisión de
finanzas los viernes, cierre los domingos. **No programa**: cuando hace falta código, delega a
Claude Code igual que `onia-loop.sh`.

Detalle completo, cómo se opera y su historia en [`../HERMES_AGENT.md`](../HERMES_AGENT.md).

⚠️ **Estuvo nueve días con 12 de 13 trabajos fallando y nadie se enteró** — sus API keys daban
401. Es el mismo modo de falla de este archivo, en otra caja. Ahora tiene su vigía horario
(`hermes-vigia.sh`), que es su mitad del bloque *"tenés que poder FALLAR a la vista"*.

### Los dos que ALIMENTAN, y por qué el sistema se moría sin ellos

`canario-visual` y `docs-auditoria` **no cierran ítems: los fabrican.** Es la distinción que casi
rompe el sistema — llegamos a tener **seis consumidores y cero productores**, con el refill
documentado como *"lo hace el cron de 10 minutos"* y **ese cron no existía**. Los carriles se
secaban sin que nadie se enterara.

`investigacion` es el tercer productor, y produce para **Sergio**: convierte una decisión abierta
en dos o tres opciones **con su costo medido**. Una decisión sin cotizar no se toma; se posterga.

## "Perfecciona" — el oficio que NO tiene loop propio, y el motivo

Sergio lo nombró y falta a propósito. **Ya lo intentamos y se midió mal:**
`web-factory-salud` era exactamente eso —correr chequeos y pulir— y tuvo **7 de 8 corridas en
no-op, cero rastro en el repo en 48 h**. "Perfeccionar" no tiene borde: sin una lista finita de
qué está mal, un loop no se planta, **inventa trabajo**.

Así que perfeccionar vive **dentro de cada desarrollador**, como el escalón 2 de su escalera:
cuando su cola no le da un ítem, **audita sus propios `[x]`** — el archivo que dice haber
cambiado, ¿cambió? ¿sigue siendo cierto contra el código de hoy? Eso sí tiene borde.

**Cuándo SÍ se le arma loop propio:** el día que exista una lista medida de deuda —cobertura por
debajo del piso, código muerto que reporte una herramienta, pantallas fuera de umbral— y no
antes. La lista primero, el loop después. **Al revés es como se llenó media carpeta de trabajo
fantasma: entre el 25% y el 46% de lo que las colas declaraban pendiente no existía.**

---

## Qué hace cada uno cuando se queda sin trabajo

Los cuatro escalones, iguales para todos. Se baja **UNO** por vuelta y se para en el primero que
dé trabajo:

```
0. Bloqueado NO se re-mide. Movelo a "Bloqueado en Sergio" y seguí.
   Antes, reverificá el bloqueo: uno VENCIDO es peor que un fantasma,
   porque le pide a Sergio una decisión que ya tomó.
1. "Después". Si todos los de "Ahora" quedaron bloqueados, tu ítem es el primero de ahí.
2. Auditar tus propios [x]. ¿El archivo que dice haber cambiado, cambió?
3. Nada. Avisá en UNA línea y TERMINÁ SIN COMMITEAR.
```

**Una vuelta sin commit es un resultado válido.** Commitear por commitear, no.

## Lo que ninguno hace, nunca

- **Desplegar.** Publicar `onia.com.bo` o `app.onia.com.bo` es de Sergio.
- **Escribirle a un prospecto.**
- **Gastar plata.**
- **Bajar una superficie viva.**
- **Tocar el carril de contenido** (`claude/carril-contenido`, `claude/ads-creatividades-publicos`).
- **Mostrar obra en la venta**: ni "muy pronto", ni "beta", ni listas de lo que falta.
- **Fabricar prueba social.** No hay clientes pagando: ni testimonios, ni logos, ni cifras.

## Con qué modelo corren, y cada cuánto

**Todos con `claude-opus-5` y `--effort max`** — decisión de Sergio el 2026-09-02:
*"cambialos todos a opus 5 en max, pero quiero que terminen de una vez"*. Antes era
`claude-sonnet-5` sin `--effort`, y estaba **fijo en el corredor para los siete**, sin que
ninguna decisión lo hubiera elegido: quedó del primer script y nadie lo volvió a mirar.

| loop | cada | tope | turnos |
|---|---|---|---|
| `chatbot-cola` | 1 h | 50 min | 120 |
| `onia-cola` | 1 h | 50 min | **260** |
| `web-venta` | 2 h | 50 min | 120 |
| `docs-auditoria` | 4 h | 40 min | 120 |
| `investigacion` | 6 h | 40 min | 120 |
| `canario-visual` | 6 h | 45 min | 120 |
| `marca-personal` | 4 veces/día | 50 min | 120 |

El integrador lleva **260 turnos y no 120** porque cada carril son fetch + merge + gates + push:
con 120 se quedó sin turnos a mitad de un merge y dejó `MERGE_HEAD` abierto sobre `main`.

**El tope siempre menor que el intervalo del cron**, y el `flock` cubre el resto: un loop horario
que tarde más de una hora **se pisaría a sí mismo** sobre el mismo árbol.

⚠️ **Opus en `max` cuesta bastante más por vuelta que Sonnet.** `chatbot-cola` y `onia-cola`
corren **cada hora**: son ~48 vueltas de Opus-max por día sólo entre esos dos. Se compra
rendimiento por vuelta, no más vueltas. Si en algún momento hay que bajar el gasto, lo primero es
**espaciar los horarios**, no volver a Sonnet: una vuelta peor deja trabajo mal hecho que después
alguien tiene que deshacer.

## 🔴 El agujero que ningun loop podia ver, y como se tapa

Sergio, 2026-09-02, mirando que el bot seguia mudo: *"esos problemas no se supone que los loops
los arreglan? Osea de verdad se estan corriendo?"*.

**Si corrian** —21 vueltas del carril chatbot esa noche, 17 con commit— y aun asi el bot llevaba
una semana contestando el saludo y callandose en el segundo mensaje, con cinco personas reales
esperando. El loop no fallo: **reporto la verdad de lo que podia ver.** Su cola no tenia el bug,
y no lo tenia porque **nadie habia escrito nunca al bot**.

Ahi esta la regla, y es la misma que ya nos mordio una vez:

> **Un carril sin productor es un carril ciego.** No se planta: reporta "todo bien" mientras su
> superficie esta rota, y suena mas convincente cada vuelta.

Teniamos productor para **pantallas** (`canario-visual`, que las abre y las mira) y para
**decisiones** (`investigacion`, que las cotiza). **No teniamos ninguno para conversaciones**, que
es justo la superficie donde se pierde un cliente.

**Como se tapo, y por que asi:** en vez de un octavo loop, el carril chatbot **prueba su propia
definicion de hecho al empezar cada vuelta** — escribe DOS mensajes al widget y cuenta las
respuestas. Su objetivo ya decia *"que un desconocido escriba y esa conversacion se vea en la
bandeja"*; era una **frase**, no un chequeo. Ahora es un chequeo.

**La leccion, para el proximo carril que se arme:** un objetivo que no se ejecuta cada vuelta es
decoracion. Si la definicion de hecho de un carril no se puede correr, el carril no puede saber
si esta hecho — y va a reportar que si.

## Cómo se sabe que el equipo está sano

**No por cuántas vueltas corrieron.** Por esto, en orden:

1. `git log origin/main` tiene **merges de carriles**, no sólo `chore: auto-sync`.
2. Ninguna rama de carril acumula commits sin mergear más de un día.
3. Las colas tienen ítems **con evidencia** (archivo, línea o captura), no párrafos.
4. Abrir 3 o 4 commits de un loop y ver **qué cambió**. Contar commits mide actividad;
   abrirlos mide valor. Con ese criterio ya se apagaron tres loops.
