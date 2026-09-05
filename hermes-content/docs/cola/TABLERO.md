# El tablero — cómo entra cualquier sesión sin pisar a las demás

> Doc vivo, sin fecha en el nombre: se **EDITA**, no se duplica.
> Escrito el **2026-09-02**, después de probar las dos formas contra el mismo problema.

---

## Por qué existe: las colas en markdown chocan aunque hagas todo bien

Probado el 2026-09-02 con dos ramas de prueba, no razonado:

**Dos carriles cerraron ítems DISTINTOS del mismo archivo — la línea 3 y la línea 4 — y git dio
conflicto igual.** Están pegadas y el merge no las puede separar.

Eso significa que la regla que habíamos escrito —*"el que MIRA agrega al final, el que ARREGLA
marca"*— **sólo ayuda si las ediciones quedan lejos**. Con ítems vecinos choca lo mismo. Y ya
pasó de verdad ese día: dos sesiones escribieron `loops.md` en paralelo y hubo que resolver a
mano.

**El tablero no tiene ese problema**: cada tarea es una **fila en SQLite**, no una línea de texto.
Probado con dos agentes reclamando la misma tarea al mismo tiempo:

```
[chatbot]  Claimed t_f42ff607
[webventa] cannot claim t_f42ff607: status=running lock=srv1360183:81929
```

Cerrojo atómico, con vencimiento, y **espacio de trabajo aislado por tarea**, creado solo.

---

## Cómo entra tu sesión — tres comandos

El tablero **vive en el VPS** y se llama `onia`. Toda sesión usa **el mismo**, y eso es
justamente lo que evita que se pisen. El script resuelve solo cómo llegar: si ya está **dentro**
del VPS ejecuta el CLI local, y si está afuera (Windows con Git Bash) sale por SSH. Los dos
caminos fuerzan `HOME=/root`, así que apuntan al mismo SQLite.

⚠️ **Corregido 2026-09-02.** Acá decía "cualquier sesión que llegue **por SSH**", y el script
hacía SSH siempre — incluso corriendo en el VPS, contra su propia IP, con una llave que ahí no
existe. Como los nueve loops se mudaron al VPS ese mismo día, `tablero.sh list` les moría con
`Permission denied (publickey)` a **todos**: el prompt de cada uno dice "el tablero va primero" y
ninguno podía leerlo. Un tablero único que la mayoría de sus usuarios no puede abrir no es un
tablero único.

⚠️ **Y por eso se invoca por ruta ABSOLUTA, no `scripts/kanban/tablero.sh`.** La ruta relativa
apuntaba al worktree de cada carril, pero cada carril está parado en **su** rama y el script
nació en `main`: en los worktrees del chatbot, el canario y web-venta el archivo **no existía**.
El corredor no mergea `main` hacia las ramas de carril —le arrancaría el árbol de abajo a un loop
en curso— así que **una herramienta compartida no puede vivir en una rama**: llega sólo a quien
casualmente esté al día. Ahora `sincronizar.sh` la despliega a `/root/bin/onia-tablero.sh`, junto
a `onia-tg.sh`, que es el mismo caso y por eso nunca falló.

```bash
# 1. Mirar qué hay
/root/bin/onia-tablero.sh list

# 2. Tomar una tarea — poné TU nombre de perfil, siempre
PERFIL=carril-chatbot /root/bin/onia-tablero.sh claim t_abc123

# 3. Cerrarla cuando esté hecha y verificada
PERFIL=carril-chatbot /root/bin/onia-tablero.sh complete t_abc123
```

Y para dejarle trabajo a otro:

```bash
/root/bin/onia-tablero.sh create "Título corto y accionable" \
  --body "Qué está roto, cómo se reproduce, y qué archivo mirar" --priority 1
```

---

## 🔴 Las cuatro reglas, y por qué cada una

**1. Reclamá ANTES de tocar nada.** Si no reclamaste, otra sesión puede estar en esa misma tarea
ahora mismo. El cerrojo es lo único que lo impide — y si el comando te dice `cannot claim`, **es
la respuesta correcta, no un error**: tomá otra.

**2. Poné tu `PERFIL`.** Sin eso todo aparece como `sesion-anonima` y, cuando una tarea figura
tomada, nadie sabe quién la tiene. El nombre es lo que hace legible el tablero.

**3. No cierres lo que no reclamaste.** Marcar `complete` en la tarea de otro es exactamente el
pisón que el tablero existe para evitar.

**4. Una tarea que creás tiene que poder reproducirse sin vos.** El cuerpo lleva **los pasos, el
comando y qué devuelve**. Medido en este proyecto: entre el **25% y el 46%** de lo que las colas
declaraban pendiente **no existía**. Una tarea sin evidencia le hace perder una vuelta entera a
quien la tome.

---

## 🔴 Cómo Sergio da el visto bueno — el circuito, probado

Lo que necesita su decisión **nace bloqueado**. Ningún loop lo puede tomar hasta que él lo suelte.

```
Hermes crea la tarea  →  block <id> "qué decide Sergio" --kind needs_input
Un loop intenta       →  cannot claim: status=blocked        ← el cerrojo
Sergio da el OK       →  unblock <id>
El loop la toma       →  Workspace: … y la trabaja
```

Probado de punta a punta el 2026-09-02, en los dos sentidos: bloqueada **no se puede reclamar**,
y liberada se reclama en el acto.

⚠️ **El orden de ese primer renglón no es cosmético: al revés no bloquea.** Hasta el 2026-09-03
acá decía `block --kind needs_input "motivo"`, y esa forma muere entera en
`hermes: error: unrecognized arguments: motivo` (exit 2) **sin tocar la tarea**. La firma real es
`block task_id [reason ...]` con `--kind` opcional: argparse no puede leer un posicional de cola
que viene después de un opcional. Medido contra un id inexistente, para aislar el parseo:

```
block <id> --kind needs_input "motivo"   → unrecognized arguments   exit=2   NO BLOQUEA
block <id> "motivo" --kind needs_input   → unknown task             exit=1   parseo OK
```

Importa porque es el comando con el que se reserva lo que espera el veredicto de Sergio. Si el
que lo corre no mira el código de salida, cree que dejó la pieza bloqueada y la dejó en `ready`:
tomable y publicable por cualquiera. **Es exactamente lo que el bloqueo existe para evitar.**

**Sergio libera con UNA línea:**

```bash
scripts/kanban/tablero.sh unblock t_abc123
```

O varias de una: `unblock t_abc123 t_def456`. Y si la respuesta es que no, se archiva:
`archive t_abc123`.

**Lo que ve en el tablero**, de un vistazo:

| símbolo | estado | qué significa |
|---|---|---|
| `▶` | `ready` | libre, cualquier loop de esa zona la toma |
| `●` | `running` | alguien la tiene, con cerrojo |
| `⛔` | `blocked` | **espera el veredicto de Sergio** |
| `?` | `triage` | sin especificar todavía |
| `✓` | `done` | cerrada, con su evidencia en los comentarios |

⚠️ **Una decisión sin número no se toma: se posterga.** Por eso el ordenador tiene prohibido
bloquear una tarea sin las opciones **cotizadas** adentro. Si no pudo medir el costo, tiene que
decir qué falta medir en vez de inventarlo.

## Qué NO reemplaza todavía

**Las colas en markdown siguen siendo la fuente de los loops** (`COLA.md`,
`cola/chatbot.md`, etc.). El tablero está **en prueba**, con tareas reales, en paralelo.

La decisión de migrar del todo es de Sergio y **no se toma hasta que el tablero muestre que
sostiene un carril completo**. Mientras tanto:

- **Trabajo entre sesiones o entre personas → tablero.** Es donde el choque duele.
- **Cola interna de un loop → markdown**, como está.

⚠️ **Si una tarea está en los dos lados, la del tablero manda** — y hay que sacar la del markdown
en el mismo momento, no después. Dos fuentes de verdad del mismo tema es el problema que
`CLAUDE.md` prohíbe, y un tablero a medias lo crea en vez de resolverlo.

---

## Ver el tablero con los ojos

Está también en el panel de Hermes, pestaña **Kanban**:

```bash
ssh -i ~/.ssh/onia_hermes_vps_ed25519 -N -L 9119:127.0.0.1:9119 root@187.77.16.63
```

Y abrir **http://127.0.0.1:9119**. Detalle de Hermes en
[`../HERMES_AGENT.md`](../HERMES_AGENT.md); quién hace qué oficio, en [`EQUIPO.md`](EQUIPO.md).
