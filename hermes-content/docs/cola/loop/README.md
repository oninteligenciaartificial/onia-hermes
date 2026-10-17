# Colas en loop (desde el 9-oct-2026)

Sergio Urcullo, 9-oct: *«equipos de agentes que orquesten en loop cada cosa… que las cumplan, porque estuvieron parados»*.

Cada sesión tiene UNA cola: `<carril>.md`. La trabaja en loop hasta vaciarla, sin esperar mensajes de la madre.

**Arranque común (2026-10-09):** cargar `equipo-de-agentes` y `aprender-de-todo`.
Cada referencia deja ficha y destino en skill; la siguiente tarea pertinente registra
sesión, regla aplicada, artefacto y verificación. Sin esa prueba queda «incorporado, no aplicado».
Codex ejecuta solo el encargo cerrado: los pasos de Git/publicación son del carril
autorizado y la madre; nunca anulan un «no toques Git». Si faltan herramientas o
permisos, registrar el bloqueo y continuar lo autorizado; no afirmar un loop activo
después de cerrar el runtime.

**Cómo corre el loop (cada sesión, al arrancar):** `/loop` sin intervalo, con el prompt
«Trabajá tu cola `hermes-content/docs/cola/loop/<carril>.md`». En cada vuelta:
1. `git pull`. Tomá la PRIMERA tarea sin marcar.
2. Hacela hasta su criterio de hecho: publicada y MIRADA en producción, o mergeada si no se publica.
3. Marcala `[x]` con el SHA, el link o la captura. Commit y push en tu rama.
4. Si falta autorización según `AGENTS.md` §4 «Quién decide» (también
   claims de producto sin prueba, terceros y CTA no probado), o hay un bloqueo técnico,
   registrar causa, responsable y siguiente acción en «Bloqueado» y seguir con lo autorizado.
   Corrección 2026-10-09: no todos los bloqueos dependen de Sergio Urcullo.
5. **Cola vacía:** sacá las 3 siguientes de tu handoff y del GOAL de `handoff/madre-local.md`, escribilas y seguí. Nunca
   quedes parada.
6. Despertate de nuevo enseguida (60-120 s) mientras haya tareas.

**Qué se reporta:** solo `PUBLICADO: <qué> — <link o SHA>`, en tu transcript (y por `send_message` si lo tenés). Nada de
proceso.

**Publicar (`AGENTS.md` §4 «Quién decide», 17-oct):** lo técnico revisado y probado se sube sin consultarle (código,
migraciones con backup y rollback, infraestructura). El diseño nuevo, la marca y las piezas de contenido (lo visual) y lo
serio (legales, precios, gasto, terceros, datos reales, secretos) van ANTES a Sergio Urcullo.

**Si `/loop` no existe en tu sesión:** al terminar cada tarea, empezá la siguiente en el mismo turno. No cierres el turno
con tareas en la cola.
