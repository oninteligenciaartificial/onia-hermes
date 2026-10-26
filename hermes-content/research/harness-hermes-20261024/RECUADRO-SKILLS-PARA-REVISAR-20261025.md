# Recuadro de skills propuesto · 25-oct-2026

**Propuesta para revisar, no una carga masiva.** Cada fila se usa cuando corresponde al encargo. Tener el manifiesto no prueba conexión, permiso ni ejecución. No instalé, activé, desactivé ni borré skills.

## Recuadro completo

| Frente | Skills exactas que propongo usar | Cuándo / límite |
|---|---|---|
| Coordinación y continuidad | `hermes-agent` · `claude-code` · `codex` · `onia-operar-harness` · `onia-relevo-sesion` · `onia-router` · `equipo-de-agentes` · `onia-continuidad` · `orca` | Base y delegación; ejecutores solo por contrato. No todos se cargan en cada turno. |
| GitHub y revisión de entrega | `github` · `requesting-code-review` · `verification-loop` · `security-review` | Repo/PR/revisión; gh ya existe. Lectura no autoriza commit, push o merge. |
| Diseño y UI web | `claude-design` · `design-md` · `popular-web-designs` · `dogfood` · `impeccable` · `onia-web-factory` · `web-factory-design-research` · `web-factory-intake-assets` · `figma` · `oversized-cursor` · `seam-craft` · `onia-frontend` | Diseñar con referencias, implementar, abrir y verificar capturas/flujos. Figma requiere su ruta autorizada. |
| Producto, backend y datos | `test-driven-development` · `systematic-debugging` · `spike` · `onia-core` · `api-design` · `backend-patterns` · `postgres-patterns` · `database-migrations` · `onia-backend` · `onia-db` · `onia-seguridad` · `onia-verificacion` · `onia-deploy` | Según el cambio y las seis skills propias del producto; ni deploy ni migración automáticos. |
| Infra, Hermes y automatización | `computer-use` · `inspecting-hermes-desktop-dom` · `onia-infra` · `onia-hermes-jarvis` · `docker-patterns` · `deployment-patterns` · `n8n-workflow-patterns` · `n8n-mcp-tools-expert` | Herramientas/SSH/Docker presentes no prueban permisos ni servidor sano; gates y aprobación aplican. |
| Investigación y aprendizaje | `grounded-citations` · `youtube-content` · `blocked-page-recovery` · `architecture-diagram` · `aprender-de-todo` · `deep-research` | Evidencia por dimensión, fuente actual y prueba de uso. No abrir otra investigación para posponer entrega. |
| Marca, educación y presentaciones | `humanizer` · `powerpoint` · `diseno-contenido-onia` · `content-strategy` · `copywriting` · `ad-creative` · `competitor-profiling` · `pricing` | Entrada, pasos, salida y habilidad observable; usted comercial / vos marca. Valor editorial separado de QA. |
| Video: ver, cortar, audio y captions | `gif-search` · `ver-videos` · `sacar-prompt` · `edicion-referentes` · `editor-videos` · `media-use` · `general-video` · `motion-doctrine` · `motion-graphics` · `captions-overlay` · `embedded-captions` · `cut-the-curve` · `talking-head-recut` | Proceso según el medio; no añadir música/SFX, descargar ni publicar por la mera presencia de la skill. |
| Render y formatos de video | `hyperframes` · `hyperframes-cli` · `hyperframes-core` · `hyperframes-animation` · `hyperframes-creative` · `hyperframes-keyframes` · `hyperframes-registry` · `slideshow` · `changelog-video` · `faceless-explainer` · `product-launch-video` · `pr-to-video` · `music-to-video` · `remotion-to-hyperframes` | Elegir un render y el formato pertinente, no todos. Verificar runtime y resultado real. |
| Ventas, propuestas y bot | `onia-ventas-pauta` · `onia-propuestas` · `onia-chatbot` · `panel-onia` | Solo oferta/capacidades acreditadas. Sin envío a prospectos, gasto, campaña o publicación no autorizados. |
| Documentos y operaciones | `pdf` · `docx` · `xlsx` · `document-to-action-items` · `google-workspace` · `notion` · `onia-contabilidad-bolivia` | Archivo local o cuenta conectada cuando la tarea lo pida. SIAT exclusivamente manual; no operar el portal. |

**Cobertura:** 98 skills distintas en 11 frentes; nombres y presencia contrastados contra manifiestos canónicos. El JSON paralelo contiene cada ruta y vía de lectura. Esto no es una lista de skills ejecutadas ni de cuerpos cargados en esta sesión.

## Dónde están y cómo se usan

- Perfil Hermes default: `skill_view` cuando la skill está ofrecida/disponible; comprobar sus prerrequisitos en el encargo, no cargarlas todas para inventariar.
- ONIA: fuente canónica `.claude/skills/`; leer por ruta cuando no esté en el índice Hermes. No copiar a `.agents/skills/` para aparentar instalación.
- Producto: las seis propias en `C:/dev/proyectos/onia-platform/.claude/skills/`; no confundir con los paquetes de diseño de `.agents/skills/`.

## Qué falta realmente

| Área | Ya presente | Pendiente / decisión |
|---|---|---|
| GitHub | `github`, `requesting-code-review`; gh/git presentes y lectura autenticada comprobada en la auditoría | No identifico otra skill imprescindible para este stack. La aprobación de escrituras sigue siendo específica. |
| Diseño | `impeccable`, `claude-design`, `design-md`, `popular-web-designs`, Figma y ONIA web/producto | Probar conexión/handoff si hace falta Figma; mejorar ejecución y aceptación visual, no instalar otro paquete de gusto por rutina. |
| Infra | Skills ONIA + Docker/deploy/n8n; ssh/docker/n8n presentes | Verificar servicio, destino y acceso de cada tarea. Presencia de binario no prueba conexión. |
| Apps | `google-workspace`, `notion`, `computer-use` | La vía/cuenta autorizadas y un flujo real; una skill no inicia sesión por sí sola. |
| Hooks | Inventario y25fixtures inertes pasan | Ciclo real actual y `legacy_notify`/WinError206 no acreditados/resueltos. No se desactivaron hooks. |
| REA | No se encontró `reverse-engineer-anything` en las raíces auditadas; rea/rea-agents no están en PATH | Opcional, no imprescindible. No instalar ahora. |

## REA: qué es y por qué no lo añadiría por reflejo

REA (`morluto/rea`) combina MCP/herramientas de ingeniería inversa para analizar comportamiento de aplicaciones, JavaScript/Electron y binarios. No es una skill de gusto visual.[1] La instalación de la skill `reverse-engineer-anything` aporta instrucciones y referencias; no registra por sí misma el MCP ni instala motores de análisis.[2]

**Mi criterio:** reservarlo para investigar una aplicación/artefacto propio o autorizado cuando navegador, DOM/CSS y código disponible no basten. Para nuestras webs y paneles, primero aplicar el stack instalado y comprobar el resultado. Si aparece ese caso, revisar cambios de configuración, proveedores y permisos antes de aprobar instalación; no copiar identidad, activos, credenciales o eludir licencias.

## Reservas: presentes, fuera de lo habitual por ahora

| Skill | Fuente | Motivo |
|---|---|---|
| `airtable` | hermes-default | Especialidad en reserva; no necesaria para el stack propuesto actual. |
| `apple-notes` | hermes-default | No usar en este Windows; plataforma macOS. |
| `apple-reminders` | hermes-default | No usar en este Windows; plataforma macOS. |
| `arxiv` | hermes-default | Especialidad en reserva; no necesaria para el stack propuesto actual. |
| `ascii-video` | hermes-default | Nicho opcional; proponer mantener fuera del habitual, sin desactivar ni borrar. |
| `baoyu-infographic` | hermes-default | Especialidad en reserva; no necesaria para el stack propuesto actual. |
| `box` | hermes-default | Especialidad en reserva; no necesaria para el stack propuesto actual. |
| `codebase-inspection` | hermes-default | Especialidad en reserva; no necesaria para el stack propuesto actual. |
| `competitor-news-monitor` | hermes-default | Especialidad en reserva; no necesaria para el stack propuesto actual. |
| `email-inbox-triage` | hermes-default | Especialidad en reserva; no necesaria para el stack propuesto actual. |
| `findmy` | hermes-default | No usar en este Windows; plataforma macOS. |
| `hermes-agent-skill-authoring` | hermes-default | Especialidad en reserva; no necesaria para el stack propuesto actual. |
| `himalaya` | hermes-default | Especialidad en reserva; no necesaria para el stack propuesto actual. |
| `imessage` | hermes-default | No usar en este Windows; plataforma macOS. |
| `llm-wiki` | hermes-default | Especialidad en reserva; no necesaria para el stack propuesto actual. |
| `manim-video` | hermes-default | Nicho opcional; proponer mantener fuera del habitual, sin desactivar ni borrar. |
| `maps` | hermes-default | Especialidad en reserva; no necesaria para el stack propuesto actual. |
| `meeting-action-items` | hermes-default | Especialidad en reserva; no necesaria para el stack propuesto actual. |
| `node-inspect-debugger` | hermes-default | Especialidad en reserva; no necesaria para el stack propuesto actual. |
| `obsidian` | hermes-default | Especialidad en reserva; no necesaria para el stack propuesto actual. |
| `opencode` | hermes-default | Especialidad en reserva; no necesaria para el stack propuesto actual. |
| `p5js` | hermes-default | Nicho opcional; proponer mantener fuera del habitual, sin desactivar ni borrar. |
| `product-price-monitor` | hermes-default | Especialidad en reserva; no necesaria para el stack propuesto actual. |
| `python-debugpy` | hermes-default | Especialidad en reserva; no necesaria para el stack propuesto actual. |
| `sdlc-review` | hermes-default | Especialidad en reserva; no necesaria para el stack propuesto actual. |
| `simplify-code` | hermes-default | Especialidad en reserva; no necesaria para el stack propuesto actual. |
| `songsee` | hermes-default | Nicho opcional; proponer mantener fuera del habitual, sin desactivar ni borrar. |
| `songwriting-and-ai-music` | hermes-default | Nicho opcional; proponer mantener fuera del habitual, sin desactivar ni borrar. |
| `teams-meeting-pipeline` | hermes-default | Especialidad en reserva; no necesaria para el stack propuesto actual. |
| `weekly-review-planning` | hermes-default | Especialidad en reserva; no necesaria para el stack propuesto actual. |
| `xurl` | hermes-default | Especialidad en reserva; no necesaria para el stack propuesto actual. |
| `higgsfield-generate` | onia-hermes-claude | Generación condicionada a cuenta, gasto y cara/voz; no parte de esta propuesta operativa. |
| `higgsfield-soul-id` | onia-hermes-claude | Generación condicionada a cuenta, gasto y cara/voz; no parte de esta propuesta operativa. |
| `onia-sesion-madre` | onia-hermes-claude | Archivo histórico/canales, no autoridad ni loop actual. |

Las copias globales/vendorizadas, backups y alias no se cuentan como skills adicionales del stack. No borro copias hasta resolver el consumidor y la precedencia; los contadores de lectura no demuestran falta de utilidad.

## Regla de parada

Esta entrega termina en revisión con Sergio Urcullo. No abre otra investigación, instalación, generación pagada ni publicación. Los frentes históricos conservan su estado. Revisión cerrada: 83 reglas globales verificadas; seis correcciones con nueve checks; QA documental de entradas ONIA aprobado con doce anclas preservadas. Las pruebas del coordinador pasan. El ciclo real actual de hooks y el incidente legacy_notify/WinError206 siguen separados y sin resolver. El stack es propuesta para revisar, no adopción ni instalación.

## Sources

[1] https://raw.githubusercontent.com/morluto/rea/f69c52a1cf3940ed1999fcc0859a75dbb913d684/README.md — REA · README.md
[2] https://raw.githubusercontent.com/morluto/rea/f69c52a1cf3940ed1999fcc0859a75dbb913d684/docs/installation.md — REA · docs/installation.md
