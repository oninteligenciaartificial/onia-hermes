## 🔴 LEER LO REAL Y AVANZAR EL OBJETIVO — ni docs, ni re-verificar, ni esperar

> **Nace del 2026-09-03.** Sergio: *"¿qué hacían los loops? arreglá todo: que siempre lean lo
> REAL y que tengan OBJETIVO los loops… estuvieron sin trabajar y solo gastando."*
>
> Medido ese día por seis agentes sobre **215 vueltas**: el **46 %** terminó sin commit —
> re-verificando cosas bloqueadas en Sergio o escribiendo docs—, el **22 %** de los commits
> fue maquinaria (`scripts/loops`, kanban, prompts) y no producto, y el recorrido de cliente
> *"miraba y frenaba"*: **nunca envió un formulario**, por eso nadie vio que agendar una cita
> no funciona. Un loop que lee docs en vez de producción trabaja sobre una hipótesis; uno sin
> objetivo medible no puede saber si avanzó, así que reporta que sí.

### 1. Al arrancar, medís tu OBJETIVO contra la REALIDAD — antes de leer docs o memoria

Corré los comandos de tu sección **«CÓMO SE MIDE al arrancar»** (arriba de todo) y escribí
**UNA línea**, al principio de tu salida, justo después de la línea para Sergio:

    OBJETIVO: <medida actual> / <meta> — <fecha hora La Paz>      (TZ=America/La_Paz date '+%F %H:%M')

- **Docs, handoffs, `COLA.md`, el tablero y la memoria son HIPÓTESIS.** La realidad es
  producción: `app.onia.com.bo`, `onia.com.bo`, el VPS (contenedores, crons, logs), la base
  `supabase-db` y `origin/main` / `origin/master`. Si un doc y la medición discrepan, **gana la
  medición** y el doc se corrige de paso, en su propio archivo.
- **La salida final es lo único que queda en el log.** El corredor te pega arriba tu última
  vuelta (líneas `OBJETIVO:` / `RAZÓN:` / `LECCIÓN:`). Si la medida no se movió desde entonces,
  **esta vuelta cambia de método**, no lo repite.

### 2. Trabajás en la brecha más grande de TU objetivo, y lo roto se arregla en la MISMA vuelta

- Elegís lo que **más acerque la medida a la meta**. No lo más fácil, no lo primero de la cola.
- **Roto en tu carril → lo arreglás ahora:** rama propia, test que falla en ROJO primero por el
  motivo correcto, arreglo, gates verdes, commit con el porqué, push. Si hace falta desplegar,
  pedilo **comentando en la tarea de deploy que ya existe** (una sola, no una por commit):

      /root/bin/onia-tablero.sh comment <id> "DEPLOY PEDIDO <sha> — <qué arregla, en una línea>"

- **Roto en OTRO carril → tarea en el tablero para su dueño**, con la reproducción exacta y la
  captura, **en esta vuelta**, y seguís con lo tuyo. Al dueño le toca arreglarlo en la suya.
- **Abrir una tarea y ESPERAR sólo vale para tres cosas:** **plata** (gasto, créditos, compras,
  altas de plataforma), **marca** (publicar con la cara o la voz de Sergio o de Lucía, un
  rediseño que un cliente ve) y **contactar personas** (prospectos, clientes, terceros). Todo lo
  demás **se hace**, no se pregunta. Y cuando sí se pregunta, es UNA decisión concreta con las
  opciones ya cotizadas —él audita, no investiga—, y **primero `list`**: repetirle una decisión
  que ya tomó es peor que no preguntar.

      T=/root/bin/onia-tablero.sh
      ID=$($T create "Pregunta corta y concreta" --body "Qué necesito decidido, las opciones que ya miré y qué cambia según cada una. Archivo: <ruta>" --priority 1 --json | python3 -c 'import sys,json;print(json.load(sys.stdin)["id"])')
      $T block "$ID" "Espera decisión de Sergio" --kind needs_input

  ⚠️ **El motivo va ANTES de `--kind`** y **mirá el código de salida**. Medido el 2026-09-03:
  `block ID --kind needs_input "motivo"` muere con `unrecognized arguments` y la tarea queda
  `ready` — no bloquea nada y la pregunta nunca le llega. Sergio contesta `ok <id>` y vuelve
  a `ready` sola.

### 3. Bloqueado en Sergio: NO se toca, NO se re-verifica, se salta

Un ítem que espera su decisión ya está medido: su última línea dice qué falta. Volver a
medirlo cada vuelta es el 46 % de arriba. **Se salta y se toma la siguiente brecha.** Sólo se
vuelve a mirar cuando el tablero lo devuelve a `ready`.

### 4. PROHIBIDO cerrar la vuelta con

- **Un doc nuevo.** Lo que aprendiste va al archivo que ya existe, o al commit.
- **Una re-verificación** de algo ya medido en tu última vuelta o bloqueado en Sergio.
- **Un cambio a la maquinaria de loops** (`scripts/loops`, `scripts/kanban`, los prompts) —
  salvo un loop **muerto** (sin `case`, sin cron, sin log). Un prompt mejorado no es producto.
- **Un "hecho" sin prueba.** Prueba es: captura abierta y LEÍDA, un `SELECT` con su salida, un
  `curl` con código y tiempo, un test que estaba en rojo y ahora está en verde. Un 200 y un
  `grep` no son verificación; un `grep` sirve para **descartar**, nunca para **confirmar**.
  Y antes de decir hecho, los frentes que casi nadie mira: **¿anda en el segundo turno / el
  segundo paso?**, **¿está encendido en PRODUCCIÓN o commiteado detrás de un flag?**, **¿lo
  que promete la pantalla sigue siendo verdad después de tu cambio?**

### 5. Al terminar

Al final de tu salida, las mismas líneas que el corredor le va a mostrar a tu próxima vuelta:

    OBJETIVO: <medida nueva> / <meta> — <fecha hora La Paz>
    <qué cambió: sha, tarea, archivo — y la evidencia>
    RAZÓN: <si NO avanzó: la razón exacta, una línea — no "seguí investigando">
    LECCIÓN: <si es la segunda vuelta seguida sin avance: qué método se descarta y cuál va>

**Dos vueltas seguidas sin avance = cambiar de método, no repetirlo.** Una vuelta sin commit
es un resultado honesto si trae su `RAZÓN:`; una vuelta con commit y la medida igual que ayer
es la que hay que evitar.
