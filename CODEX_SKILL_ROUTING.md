# Codex Skill Routing Policy

## Objetivo
Definir como decidir automaticamente que skill usar antes de ejecutar cualquier tarea en este workspace.

Regla principal: antes de actuar, identificar el tipo de trabajo, activar la skill mas especifica disponible y leer su `SKILL.md` solo lo necesario para seguir el flujo correcto.

Regla de orquestacion: para tareas relevantes de implementacion, leer `AGENTS.md`, planear primero y activar los frentes/agentes necesarios: arquitectura, backend, frontend, diseno, base de datos/RLS, seguridad, automatizacion, contenido, QA y operaciones.

## Limpieza de skills 2026-09-29 (leer antes de buscar una skill)
- `~/.codex/skills` quedo en 38: salieron 23 sin uso en 30 dias a `~/.codex/skills-archivadas-20260929/`. Volver una: `mv ~/.codex/skills-archivadas-20260929/<nombre> ~/.codex/skills/`.
- HyperFrames ya no vive en `.agents/skills/` del repo (salvo `media-use` y `embedded-captions`): usar `~/.codex/skills/hyperframes*`. Un flujo que falte: `npx hyperframes skills update <nombre>`.
- `~/.agents/skills` es un enlace a `~/.claude/skills` (110 globales, compartidas con Claude).
- Detalle, motivo y como recuperar cada skill: `hermes-content/docs/historial/LIMPIEZA_SKILLS_20260929.md`.

## Prioridad de decision
1. Si el usuario nombra una skill, usar esa skill.
2. Si la tarea coincide claramente con una skill instalada, usarla.
3. Si varias skills aplican, usar el conjunto minimo y en orden operativo.
4. Si ninguna aplica, trabajar con las instrucciones generales del repo.
5. Si hay conflicto con `COORDINATION_MANIFEST.md`, respetar primero el manifiesto.

## Skills globales instaladas desde openai/skills
- `aspnet-core`
- `chatgpt-apps`
- `cli-creator`
- `cloudflare-deploy`
- `define-goal`
- `figma`
- `figma-code-connect-components`
- `figma-create-design-system-rules`
- `figma-create-new-file`
- `figma-generate-design`
- `figma-generate-library`
- `figma-implement-design`
- `figma-use`
- `gh-address-comments`
- `gh-fix-ci`
- `hatch-pet`
- `jupyter-notebook`
- `linear`
- `migrate-to-codex`
- `netlify-deploy`
- `notion-knowledge-capture`
- `notion-meeting-intelligence`
- `notion-research-documentation`
- `notion-spec-to-implementation`
- `openai-docs`
- `pdf`
- `playwright`
- `playwright-interactive`
- `render-deploy`
- `screenshot`
- `security-best-practices`
- `security-ownership-map`
- `security-threat-model`
- `sentry`
- `speech`
- `transcribe`
- `vercel-deploy`
- `winui-app`
- `yeet`

## Matriz de uso automatico

### OpenAI, modelos, API o ChatGPT
Usar `openai-docs`.

Aplica cuando:
- haya preguntas sobre OpenAI API, modelos, Responses API, Assistants, tools, embeddings, realtime, pricing o migraciones;
- se necesite documentacion oficial y actualizada.

### Objetivos largos o trabajo con presupuesto
Usar `define-goal`.

Aplica cuando:
- el usuario pida definir, perseguir o medir un objetivo;
- se necesite mantener progreso a lo largo de varias vueltas.

### GitHub, PRs y CI
Usar:
- `gh-address-comments` para responder comentarios de PR;
- `gh-fix-ci` para arreglar fallos de CI.

### Seguridad
Usar:
- `security-best-practices` para revisiones o hardening general;
- `security-threat-model` para modelado de amenazas;
- `security-ownership-map` para mapas de responsabilidad.

### Navegacion, pruebas web y screenshots
Usar:
- `playwright` para automatizar pruebas web;
- `playwright-interactive` si hace falta interaccion visual;
- `screenshot` para capturas o inspeccion visual.

### Notion
Usar:
- `notion-knowledge-capture` para guardar decisiones, notas o documentacion;
- `notion-research-documentation` para investigar y sintetizar informacion de Notion;
- `notion-meeting-intelligence` para preparar reuniones;
- `notion-spec-to-implementation` para convertir specs de Notion en tareas o planes.

### Figma
Usar:
- `figma` para tareas generales de Figma;
- `figma-use` para trabajar con archivos o contexto existente;
- `figma-create-new-file` para crear archivos;
- `figma-generate-design` para generar disenos;
- `figma-generate-library` para librerias;
- `figma-create-design-system-rules` para reglas de sistema;
- `figma-code-connect-components` para Code Connect;
- `figma-implement-design` para implementar un diseno en codigo.

### Deploy
Usar:
- `vercel-deploy` para despliegues en Vercel;
- `netlify-deploy` para Netlify;
- `cloudflare-deploy` para Cloudflare;
- `render-deploy` para Render.

### Apps, CLI y migraciones
Usar:
- `chatgpt-apps` para apps de ChatGPT;
- `cli-creator` para crear CLIs;
- `migrate-to-codex` para migraciones hacia Codex;
- `aspnet-core` para proyectos ASP.NET Core;
- `winui-app` para apps WinUI.

### Datos, notebooks y documentos
Usar:
- `jupyter-notebook` para notebooks;
- `pdf` para analizar, crear o transformar PDFs.

### Audio y voz
Usar:
- `speech` para generacion o trabajo con voz;
- `transcribe` para transcripcion.

### Observabilidad e incidentes
Usar `sentry` cuando la tarea involucre errores, issues, tracing, releases o monitoreo en Sentry.

### Linear
Usar `linear` para crear, leer o actualizar issues/proyectos en Linear.

## Reglas especificas de Hermes
Antes de editar en este repo:
1. Leer `COORDINATION_MANIFEST.md`.
2. Leer `AGENTS.md` para aplicar la orden de planificacion y frentes/agentes.
3. Verificar si la tarea pertenece a Session A o Session B.
4. No tocar archivos de la otra sesion.
5. Para docs/skills de Hermes, preferir archivos canonicos existentes.
6. Para despliegue de contenido Hermes, usar `npm run deploy:hermes-content` solo si hay credenciales VPS cargadas.
7. Para acciones productivas, leer `HERMES_EXECUTION_PROTOCOL.md` y presentar un plan breve antes de ejecutar.

## Skills locales de Hermes
Usar estas skills dentro de `hermes-content/skills` cuando la tarea sea operativa de Hermes:
- `n8n-automatizaciones-onia` para n8n, horarios, aprobaciones, Notion y finanzas.
- `crm-prospeccion-onia` para CRM, prospeccion y seguimientos.
- `impuestos-bolivia-operaciones` para impuestos y recordatorios fiscales.
- `tendencias-ia-redes` para tendencias IA y redes sociales.
- `plan-semanal-onia` para calendario semanal de contenido.
- `instagram-publicacion` solo si la tarea pertenece a Session A.
- `video-lab-higgsfield` para videos, Higgsfield, aprobaciones y publicaciones de Reel por Video Lab.
- `marca-personal-sergio` para contenido de Sergio como marca personal.
- `historias-sergio` para historias de Sergio y referencias de lifestyle/founder.
- `crons-diarios-hermes` para crons diarios, recordatorios y scheduler Hermes.
- `sistema-semanal-hermes` para organizar la semana y gestionar la cadencia semanal.

## Checklist antes de actuar
- Lea `AGENTS.md` si la tarea requiere implementacion o coordinacion.
- Identifique tipo de tarea.
- Seleccione skill global o local.
- Lea el `SKILL.md` de la skill seleccionada cuando sea necesario.
- Respete `COORDINATION_MANIFEST.md`.
- Ejecute o edite solo dentro del alcance.
- Valide con comandos no destructivos.
- Informe si hace falta reiniciar Codex para cargar skills nuevas.
