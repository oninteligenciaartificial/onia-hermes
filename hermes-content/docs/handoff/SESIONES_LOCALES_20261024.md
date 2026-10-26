# Sesiones locales · 24-oct-2026

Registro de ubicación y contratos, **no otra cola ni otro orquestador**. Complementa los backlogs y handoffs canónicos de cada carril. Encargo actual de Sergio: calendario que enseñe, sesión de startup Onia Platform, sesión de marca personal y mini-worktree del workshop. Hermes usa Sol6.1 máximo por orden explícita; ejecutores Sol6.1 medio.

## Responsabilidad
- **Última orden de Sergio:** primero armar la estructura; después definir una sola tarea y revisar el conjunto. No continuar los contratos iniciales ni abrir más frentes. Ambos turnos de producción se interrumpieron explícitamente conservando archivos; se solicitó checkpoint y cierre honesto, sin presentar lo parcial como terminado. Onia Platform ya había escrito sus dos documentos; el calendario tiene avances, recursos incompletos. El cierre de lifecycle debe comprobarse aparte.
- **Un responsable general:** Hermes en la conversación principal. Prioriza, fija alcance, resuelve dependencias, verifica y entrega a Sergio.
- Orca conserva el Run existente `run_66e1d03c2397`, Tasks/Dispatches y worktrees. No es permiso para crear otra cola permanente, cron o «madre».
- `scripts/orquesta/` conserva su papel canónico para el reparto habitual por issues. Este arranque local de sesiones es el piloto explícitamente pedido por Sergio, no una sustitución global ni una duplicación de issues.
- Cada frente puede usar ayuda acotada dentro de sus límites, pero no despacha otros frentes ni cambia prioridades globales. Máximo dos ejecutores de esta nueva ola en paralelo; reservar revisión para resultados terminados, no sostener revisores ociosos.
- Una aprobación técnica de guiones NO prueba valor educativo ni aceptación de Sergio. El lote anterior fue rechazado editorialmente y se conserva como antecedente.

## Espacios y propietarios
| Frente | Worktree y baseline | Sesión/contrato actual | Entrega |
|---|---|---|---|
| Coordinación | `C:/dev/proyectos/onia-hermes`, main | Hermes `term_3ff55a4d-25e7-43d1-b633-b5e2a4a1ac01` | Prioridades y verificación; no competir por archivos de ejecutores |
| Marca personal | `C:/Users/PC/orca/workspaces/onia-hermes/marca-personal-20261024`, desde main local `1b0bb95f` | Codex `term_c2cbdf9c-c17c-499f-bb7a-e431e76d0ea6`; task `task_de2ee8b3e339`, dispatch vigente `ctx_b24dce1d86a4` | `CALENDARIO-24-OCT-06-NOV-2026.md`, 3 fichas con demostración, recurso sintético y pruebas |
| Workshop (hijo de Marca personal) | `C:/Users/PC/orca/workspaces/onia-hermes/iman-workshop-20261022`, worktree existente conservado | Claude producción `term_48c2d0ff-4a42-4540-8bd5-76115897d3da`, Codex revisión `term_cdef21a0-b500-49b1-b0fb-9bd6c7bd2281`; entregas anteriores asentadas | Paquete conservado. Próxima tarea: alinear demostración práctica con calendario; no rediseño, venta ni publicación automática |
| Onia Platform · startup | `C:/Users/PC/orca/workspaces/onia-platform/startup-onia-20261024`, desde master local `a0488f04` | Codex `term_056528bc-c2ad-4ed4-b1f0-6e7af48df799`; task `task_42d2711e89ec`, dispatch vigente `ctx_8711bb603b6a` | `docs/STARTUP-ESTADO-20261024.md`, `docs/STARTUP-SPRINT-20261024.md`, un check local disponible |

Los worktrees nuevos no incluyen WIP sin commit del repositorio principal. El WIP de Onia Platform en `claude/f2-f3-panel` se preserva; no está integrado en el nuevo worktree. Las ramas se crearon desde referencias locales, sin fetch. La relación padre/hijo es organizativa: no sincroniza archivos, permisos ni decisiones entre worktrees.

## Cómo usar información sin repetir la investigación

Frentes todavía sin sesión dedicada en esta estructura: **Ventas y pauta de Onia Platform** (siguiente separación útil; no mezclar con marca personal) y **Operaciones/infra/Hermes** (a demanda, no un LLM permanente). Administración/contabilidad conserva revisión humana para decisiones fiscales, cobros y pagos; no abrir un agente autónomo por defecto. Comunidad y contenido permanecen en Marca personal; el workshop ya tiene su hijo. Estas son propuestas de organización, no tareas iniciadas.
1. Leer el contrato y las secciones pertinentes de fuentes canónicas; consultar títulos antes de documentos enteros.
2. Enlazar hechos a archivo/ubicación o fuente primaria. Separar observado, declarado, inferido y propuesto.
3. Una entrega por Task con archivos exclusivos, prueba observable y parada. No auditar de nuevo lo que no cambió.
4. Para contenido: destreza que se aprende + entrada + pasos + salida + comprobación. Si solo recomienda usar IA, no pasa.
5. Avisar al entregar; Hermes contrasta antes de decir «validado». La revisión editorial la hace Sergio sobre material visible.

## Alcance y límites
No instalar, publicar, activar campañas, gastar, contactar terceros, cambiar precios, tocar secretos, hacer deploy/migraciones ni Git de escritura. Ningún permiso histórico se amplía por crear un worktree. Aprobación de publicación y cara/voz sigue separada.

## Arranque verificado y recuperación
La creación de Marca personal devolvió timeout; se comprobó en Orca y `git worktree list`, y existía: no se duplicó. Los primeros Dispatches (`ctx_fc43abe86fe0`, `ctx_210a18879d20`) fallaron antes de ejecutar por el aviso de actualización Codex. Se omitió la actualización, se redujo FullAccess heredado a Workspace(Approve for me) y se reintentaron las MISMAS Tasks con `--retry-of`, conservando las terminales pedidas por Sergio. `/status` verificó Sol6.1 medio y workspace; las pantallas posteriores confirmaron Working y lecturas reales aunque `turn_start_unobserved` no lo detectara.

Ambos frentes reportaron Orca fuera de PATH. Se envió su ruta exacta y la orden de no transformar el producto en diagnóstico de infraestructura. Si la política impide lifecycle, se conserva bloqueo real, nunca worker_done inventado.

## Por qué un solo orquestador aquí
Es una elección adecuada para este encargo, no una ley universal. El patrón manager mantiene un punto de decisión y delega capacidades; los handoffs transfieren propiedad de una rama. Aquí Sergio mantiene un solo diálogo principal y pide dos frentes independientes, por eso Hermes conserva la responsabilidad final.

Fuentes primarias consultadas el24-oct-2026:
- Guía nativa instalada: `orca skills get orchestration` y referencia `recovery-and-cleanup.md`.
- Reglas vigentes: `COORDINATION_MANIFEST.md`, `.claude/skills/equipo-de-agentes/SKILL.md` y `CLAUDE.md` §Quién orquesta.
- OpenAI Agents SDK, Agent orchestration: https://openai.github.io/openai-agents-python/multi_agent/
- Anthropic, Building effective agents: https://www.anthropic.com/research/building-effective-agents
