# Colas en loop (desde el 9-oct-2026)

Sergio Urcullo, 9-oct: *«equipos de agentes que orquesten en loop cada cosa… que las cumplan, porque estuvieron parados»*.

Cada sesión tiene UNA cola: `<carril>.md`. La trabaja en loop hasta vaciarla, sin esperar mensajes de la madre.

**Cómo corre el loop (cada sesión, al arrancar):** `/loop` sin intervalo, con el prompt
«Trabajá tu cola `hermes-content/docs/cola/loop/<carril>.md`». En cada vuelta:
1. `git pull`. Tomá la PRIMERA tarea sin marcar.
2. Hacela hasta su criterio de hecho: publicada y MIRADA en producción, o mergeada si no se publica.
3. Marcala `[x]` con el SHA, el link o la captura. Commit y push en tu rama.
4. Si una tarea depende de Sergio Urcullo (solo gasto, contactar clientes, SIAT, actos legales, su cara o su voz), pasala a
   «Bloqueado» con una línea y seguí con la siguiente.
5. **Cola vacía:** sacá las 3 siguientes de tu handoff y del GOAL de `handoff/madre-local.md`, escribilas y seguí. Nunca
   quedes parada.
6. Despertate de nuevo enseguida (60-120 s) mientras haya tareas.

**Qué se reporta:** solo `PUBLICADO: <qué> — <link o SHA>`, en tu transcript (y por `send_message` si lo tenés). Nada de
proceso.

**Publicar (CLAUDE.md, 9-oct):** lo trabajado y revisado se sube sin esperar a Sergio Urcullo, también el diseño, las
migraciones (con backup y rollback) y la infra.

**Si `/loop` no existe en tu sesión:** al terminar cada tarea, empezá la siguiente en el mismo turno. No cierres el turno
con tareas en la cola.
