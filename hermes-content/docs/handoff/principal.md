# Handoff — sesión Principal

Escrito el 20-oct-2026, ~23:50 La Paz, por la Principal `local_e1ada2a4` (la segunda del día), cuando Sergio
Urcullo pidió sesión nueva («estás haciendo huevadas»). Reemplaza al de las 17:15.

## 1. Objetivo

Que Sergio Urcullo VEA a Hermes orquestar de verdad antes de relanzar las áreas: Hermes carga una tarea real
`orquesta` con su «Hecho cuando», un trabajador la hace con el modelo de su carril y queda un PR revisado. **Hecho
cuando:** el Panel ONIA muestra una tarea cargada por Hermes y su pasada terminada (PR), y él lo vio.
Después (no antes): revisión de skills → sesiones por área (Taller, Platform, BCP).

## 2. Qué quedó en producción

- **Hermes con Sol por la suscripción de Codex** (lo cambió él con `/model … --global`). Leído en el VPS a las ~23:40:
  `config.yaml` → `default: gpt-6.1-sol-900k`, `provider: openai-codex`; gateway activo; 3 trabajos encendidos
  (resumen, vigía, planificador). La API de OpenAI sigue configurada: el tablero de las 13:00 y el veredicto de las
  16:00 la usan directo. **No borrarla.**
- PRs mergeados: [#266](https://github.com/oninteligenciaartificial/onia-hermes/pull/266) (el diagnóstico muestra
  la respuesta del planificador) y [#267](https://github.com/oninteligenciaartificial/onia-hermes/pull/267) (con la
  cola vacía, Hermes carga UNA tarea de `principal.md` o de los «Próximos pasos» de un carril).
- **Panel ONIA 0.5.0** publicado (mod fuera del repo, `~/.claude/onia-mods/panel-onia`): métricas arriba, barras,
  logos, dos columnas; secciones nuevas «Hermes» (modelo, última revisión, qué contestó), «Quién hace cada trabajo»
  y «Dónde se gastan tus tokens». Él lo vio funcionando (capturas). Método en la skill `panel-onia`.
- Sesiones: Sergio Urcullo archivó TODAS. Las carpetas siguen y no tenían nada sin subir.

## 3. Qué quedó a medias, y dónde

- **El tercer `aplicar` NO se corrió.** Sin él, Hermes sigue con la skill vieja (la que con la cola vacía contesta
  `[SILENT]`). Sergio Urcullo dijo «sí, aplicar» en la sesión anterior; la nueva necesita su sí EN ella (regla de
  `onia-hermes-jarvis`). Se despacha `hermes-jarvis.yml` con acción `aplicar` (`gh workflow run`), se lee el log
  (sección 5e) y después se corre `diagnostico` (secciones 16 y 18).
- **Correr la revisión ya:** no hay acción en el workflow para forzarla. Camino más simple: que Sergio Urcullo le
  pida a Hermes por Telegram «corré la revisión de la orquesta ahora» (tiene la skill y el comando). Si no, la
  próxima automática es cada 3 h desde las 23:02 (02:02, 05:02… La Paz). La de las 20:01 dio `[SILENT]`; la de
  las 23:02, error (Sol por la API daba HTTP 400).
- [PR #265](https://github.com/oninteligenciaartificial/onia-hermes/pull/265) **abierto, revisado, sin mergear**
  (el control de permisos no deja mergear a la sesión): trabajadores de la orquesta leen su handoff y cierran con
  «## Leí» / «## Aprendido»; mapa único en `ONIA_SKILLS_STACK_Y_SUBAGENTES.md`; `onia-router` al día; skill
  `panel-onia` y este handoff.
- **Revisión de skills en pausa:** 142 skills con veredicto (77 limpias, 65 a corregir), arreglos en cinco ramas
  subidas, sin PR (faltaba la revisión independiente de los diffs). Estado: `hermes-content/docs/handoff/revision-skills.md`
  en la rama `claude/revision-skills` (carpeta `E:\onia-wt\revision-skills`, creada a mano, no la borra archivar).
- **Taller** (PR #256, carpeta `agent-llm-orchestration-56e7cc`, handoff `taller-31-oct.md` en esa rama) y
  **Platform** (carpeta `onia-platform/.claude/worktrees/brave-northcutt-60131b`, notas
  `side-session-notes/local_549192e7-…/plataforma-20261020.md`): las sesiones nuevas arrancaron y él las paró.
- **BCP:** borrador a María Bayá en Gmail sin enviar (`side-session-notes/local_6214be25-…/bcp-estado.md`).
- **Disco C: 7,5 GB libres.** Inventario: `side-session-notes/local_549192e7-…/inventario-carpetas-20oct.md`
  (~50 copias limpias y mergeadas borrables; borrar pide su sí).

## 4. Archivos

`scripts/orquesta/{orquesta.mjs,orquesta.test.mjs,carriles.json}`, `hermes-content/docs/ONIA_SKILLS_STACK_Y_SUBAGENTES.md`,
`.claude/skills/{onia-router,panel-onia}/SKILL.md`, este archivo. Notas fuera del repo:
`side-session-notes/local_6214be25-…/inventario-{skills,modelos-navegadores}-20oct.md`,
`side-session-notes/local_549192e7-…/inventario-carpetas-20oct.md`.

## 5. Intentos fallidos (con su causa)

- **Sol con `provider: openai-api`** tumbó a Hermes (HTTP 400: el modelo no existe en la API). Se arregla con
  `/model openai-codex:gpt-6.1-sol-900k --global`. Y `/model` sin `--global` vale solo para esa terminal: pasó dos veces.
- **Lanzar sesiones de área antes de que él viera funcionar la orquesta:** las paró («stop las sesiones»). Primero
  la prueba visible; después las áreas.
- **Demasiados mensajes y pasos a la vez:** se enojó («estás haciendo huevadas»). Un paso, verificado, y recién el siguiente.
- `gh pr merge` y archivar sesiones: los frena el control de permisos/la app. Los hace él.
- La PC no llegó a `api.github.com` ~1 h (Google sí, GitHub operativo): se trabó todo lo de GitHub. Volvió solo.
- Python con `'\\n'` dentro de un heredoc de bash escribió saltos de línea reales en el código: editar con la
  herramienta de edición, no con heredocs.

## 6. Qué depende de Sergio Urcullo

1. «sí, aplicar» en la sesión nueva (y pedirle a Hermes la revisión por Telegram, si quiere verla ya).
2. Mergear el #265.
3. Decir cuándo retomar la revisión de skills y las áreas.
4. Su sí para borrar las ~50 copias limpias del disco C:.

## 7. Próximos pasos

1. Con su sí: `aplicar`, leer 5e; `diagnostico`, leer 16 y 18. Revisión (Telegram o la automática) y verificar en
   el panel que Hermes cargó una tarea `orquesta` real; después, que la orquesta la tome y deje PR.
2. Contarle en 3-4 líneas qué cargó Hermes, quién la hizo, con qué modelo y dónde verlo en el panel.
3. Recién entonces: retomar la revisión de skills (PRs desde `claude/revision-skills`), y las áreas una por una.
4. No archivar la sesión Principal anterior desde acá: es dueña de esta carpeta (`onia-madre-v2-pr-review-2d85bb`).
