---
name: equipo-de-agentes
description: El método del equipo de agentes de Onia (desde el 9-oct-2026). La madre local orquesta; cada sesión de la nube trabaja en loop su propia cola; Codex hace el código cerrado; los verificadores Haiku 5.5 controlan que se cumpla; a Sergio Urcullo solo le llega lo publicado. Invocar al arrancar una sesión madre, al despachar trabajo o al revisar si algo se cumplió.
---

# Equipo de agentes de Onia

Sergio Urcullo, 9-oct-2026:
- *«te ahogás en tareas y no me das los resultados que quiero… menos texto en el output… en el backend bien desarrolladas y con lógica»*;
- *«una madre que revise que se cumpla todo con subagentes de Haiku 5.5 para no quemar la cuenta, y que orquestes a Codex»*.

Detalle operativo de cada pieza: skill `onia-sesion-madre` (canales, Codex, trampas medidas). Esta skill es el MÉTODO.

## 1. Quién hace qué

| Rol | Quién | Hace | No hace |
|---|---|---|---|
| Madre | Claude local, en la PC de Sergio Urcullo | llena las colas, despacha a Codex, corre los gates en la PC, mergea/pushea lo que la nube no puede, hace lo que exige la PC | código largo (va a Codex), análisis largos (van a Gemini/Codex), mensajes largos |
| Sesiones de la nube | Plataforma · Marca personal · Ventas y pauta · Lucía · Hermes-Jarvis | trabajan en LOOP su cola `hermes-content/docs/cola/loop/<carril>.md` hasta vaciarla | quedarse paradas esperando un mensaje |
| Codex | `scripts/codex-tarea.sh` (Sol por defecto; Astra para seguridad, plata o lógica con riesgo) | código cerrado con META, PRUEBA DE HECHO y REGLA DE PARADA | git, commits, red; no corre la suite (sandbox `EPERM`) |
| Verificadores | subagentes **Haiku 5.5** (`model: haiku`) | contar y comprobar: ¿se cumplió? ¿está publicado? ¿hay sesiones paradas? | decidir ni escribir código |
| Gemini (gratis) | `gemini-see-video.mjs` en bucles de bash | mirar videos sin gastar tokens de Claude | — (tope diario: pasar a `flash-lite`) |

## 2. La cola en loop (cada sesión)

Protocolo en `hermes-content/docs/cola/loop/README.md`. En corto: `/loop` sobre su cola, la primera tarea sin marcar hasta su
criterio de hecho (publicada y MIRADA), `[x]` con SHA o link, commit y push, siguiente. Cola vacía → se rellena sola desde su
handoff y el GOAL. Nunca termina el turno con tareas pendientes.

## 3. La ronda de la madre (cada 20 min, `CronCreate`)

1. **Verificador Haiku** (uno solo, barato): por cada cola, cuántas tareas `[x]` desde la última ronda y cuál es la siguiente;
   `ListAgents` para ver quién está `idle` con tareas pendientes; PRs nuevos o mergeados; tareas nuevas en `codex-tareas/` y
   bundles en `docs/cola/ramas-locales/`. Devuelve una tabla corta.
2. Sesión `idle` con cola pendiente → UN mensaje: «retomá tu cola, siguiente tarea: X».
3. Tarea de Codex nueva → la madre la lanza (sección 4).
4. Bundle nuevo → la madre lo trae, lo pushea y abre el PR.
5. A Sergio Urcullo: solo `PUBLICADO: <qué> — <link>`. Si no se publicó nada, no se le escribe.

## 4. Despachar a Codex (paso a paso, medido el 8 y 9-oct)

1. Worktree en una ruta corta, `C:/dev/proyectos/onia-platform-codex-<tarea>`, desde la rama que dice la tarea. Si hay que
   traer `master`: lo hace la madre (Codex no puede git). Conflictos en docs → `git merge-file --union`. En código, se deja
   el merge abierto y se le pide a Codex que resuelva los marcadores.
2. `node_modules`: junction a `C:\dev\proyectos\onia-platform-v1-integracion-20260927\node_modules` (la de
   `onia-platform` está vacía).
3. El prompt lleva la NOTA DE LA MADRE (carpeta, rama, «no hagas git», «PARA LA MADRE:» al final) + el texto de la tarea.
4. `bash scripts/codex-tarea.sh <prompt> <carpeta> <modelo> medium`, en background y desde el worktree correcto. Para `resume`,
   hacer `cd` a la carpeta antes: toma el cwd.
5. Gate de la madre, siempre: `git checkout -- '*.snap'` → `npx vitest run` COMPLETO (JSON) → si hay rojos, ver si son
   reales o de carga (los tests que lanzan procesos se corren solos) → los reales vuelven a Codex con `resume` y la lista.
6. Push SOLO si la suite da 0 rojos, en el mismo comando con `&&`. El informe de Codex no va al commit: va al cuerpo o a un
   comentario del PR.
7. Mensaje de una línea a la sesión dueña: «X hecho en #N, suite N/0».

## 5. Publicar

Regla del 9-oct (CLAUDE.md): **lo trabajado y revisado se sube sin esperar a Sergio Urcullo**, incluido el diseño, las
migraciones (con backup y rollback) y la infra. Sigue con su sí: gasto, contactar clientes o terceros, el portal del SIAT,
actos legales o firmas (los hace Leslie Mercado Moreno) y su cara o su voz en servicios externos.

## 6. Cómo se le habla a Sergio Urcullo

- Máximo 3 bloques (Pasó · Necesito · Sigue), caveman. Lo publicado, con link o captura.
- Un link que manda sin instrucción es para APRENDER: ficha en `video-intake` y lo aprendido a la skill. No se produce
  ninguna pieza.
- Nada de proceso, hipótesis ni listas de lo que se hizo por dentro: eso va al handoff y a las skills.

## 7. Costos (cuidar la cuenta)

- Lectura, conteo y verificación: Haiku 5.5. Juicio y síntesis: Sonnet. Decidir lo ambiguo: Opus/Astra.
- Workflows de más de 5 agentes solo si Sergio Urcullo pide algo exhaustivo. El 8-oct costaron ~60 M de tokens.
- Videos: Gemini gratis en bash (borrar cada mp4 al terminar). Fichas y síntesis: Codex Sol.
- La madre se reabre cuando su conversación se hace larga. Primero se escribe el handoff.

## 8. Trampas ya pagadas

- `vitest related` no alcanza: corre la suite completa.
- La suite en el sandbox de Codex siempre da ~148 rojos y en la PC da 0. Manda la de la PC.
- Git Bash convierte `'/dir/'` en una ruta de Windows: usar `MSYS_NO_PATHCONV=1` para el sparse.
- La nube no puede pushear ramas nuevas a onia-platform: deja bundles y la madre los sube.
- Disco: `df -h /c` antes de bajar videos. Codex falla con menos de 1 GiB libre.
- `SendMessage` con nombre viejo falla: `ListAgents` primero.
