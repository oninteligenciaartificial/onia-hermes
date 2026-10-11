# Colas en loop (desde el 9-oct-2026)

Sergio Urcullo, 9-oct: *«equipos de agentes que orquesten en loop cada cosa… que las cumplan, porque estuvieron parados»*.

Cada sesión tiene UNA cola: `<carril>.md`. La trabaja en loop hasta vaciarla, sin esperar mensajes de la madre.

**Dueño de cada cola (reparto del 11-oct):** la madre que ordena a ese carril.
- Madre desarrollo-infra: `plataforma.md`, `hermes-jarvis.md`.
- Madre marketing: `lucia.md`, `marca-personal.md`, `ventas-pauta.md`.
- `madre.md` es el libro único de las dos. Frentes y dueños: `hermes-content/docs/ONIA_HARNESS.md` §4.

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
4. Si falta autorización según las excepciones completas de `CLAUDE.md` (también
   claims de producto sin prueba, terceros y CTA no probado), o hay un bloqueo técnico,
   registrar causa, responsable y siguiente acción en «Bloqueado» y seguir con lo autorizado.
   Corrección 2026-10-09: no todos los bloqueos dependen de Sergio Urcullo.
5. **Cola vacía:** sacá las 3 siguientes de tu handoff y del GOAL de `handoff/madre-local.md`, escribilas y seguí. Nunca
   quedes parada.
6. Despertate de nuevo mientras haya tareas. El intervalo lo fija la madre de tu carril (`ONIA_HARNESS.md` §3); no lo elijas vos.

**Qué se reporta:** solo `PUBLICADO: <qué> — <link o SHA>`, en tu transcript (y por `send_message` si lo tenés). Nada de
proceso.

**Publicar (CLAUDE.md, 9-oct):** lo trabajado y revisado se sube sin esperar a Sergio Urcullo, también el diseño, las
migraciones (con backup y rollback) y la infra.

**Si `/loop` no existe en tu sesión:** al terminar cada tarea, empezá la siguiente en el mismo turno. No cierres el turno
con tareas en la cola.

## Formato de cada cola

- Cada ítem: `- [ ] <id> <descripción>`. Si es de publicación o de producto, agregá `Hecho = <prueba>` (SHA, link o captura).
- Bloqueado: sección `## Bloqueado` con `causa | responsable | siguiente acción`.

## Codex y modelos

- Codex corre solo en la PC, lanzado por la madre de desarrollo-infra con `scripts/codex-tarea.sh` (protocolo en `ONIA_HARNESS.md` §10). Las sesiones de nube no tienen Codex (C07).
- Si algo de tu cola necesita Codex: escribí el contrato en `hermes-content/docs/handoff/codex-tareas/` (copia de `_PLANTILLA.md`, `estado: pendiente`) y commitealo en tu rama `claude/*`. La madre lo adopta a main y lo lanza. Tu ítem nombra el archivo: `- [ ] <id> codex pendiente: ver codex-tareas/<archivo>. Dueño: madre`.
- Modelos de Codex: `gpt-6.1-sol` por defecto; `gpt-6-astra` para seguridad, cobros, producción o permisos; `gpt-6-luna` para lo mecánico (su línea en el script aún no está).
- Codex no hace git. La madre revisa el diff, commitea y abre el PR.
- Claude por rol: Haiku cuenta y verifica; Sonnet sintetiza; Opus solo lo ambiguo o riesgoso. Subagentes con `model` explícito.
- Cupo: lo lee la madre con `node scripts/codex-cupo.mjs`. Los carriles no lo consultan.
