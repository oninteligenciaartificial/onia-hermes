# ONIA Core External Research 2026-07-03

Fecha: 2026-07-03.
Estado: investigacion de proyectos externos y modelos aplicables.
Owner: Onia / Hermes.

Objetivo: identificar proyectos open source (GitHub) y modelos (Hugging Face)
que aceleren ONIA Core beta y los verticales, sin reinventar piezas probadas.
Regla del workflow Onia: buscar implementaciones existentes antes de escribir
codigo nuevo.

## GitHub — patrones para robar (no dependencias, referencias de diseno)

| Proyecto | Stars | Que mirar para ONIA Core |
|---|---|---|
| [twentyhq/twenty](https://github.com/twentyhq/twenty) | 52k | Modelo de datos CRM moderno: objetos con metadata, campos custom por workspace. Referencia directa para `BusinessPartner`/`Contact` y para como exponer entidades configurables sin fork. |
| [makeplane/plane](https://github.com/makeplane/plane) | 54k | Work items, ciclos y vistas guardadas. Referencia para `WorkItem` + `SavedView` (filtros serializados por rol). |
| [hcengineering/platform](https://github.com/hcengineering/platform) (Huly) | 26k | Arquitectura all-in-one (proyectos + CRM + mensajeria). Referencia de como un core comun sirve a varios modulos. |
| [frappe/erpnext](https://github.com/frappe/erpnext) | 36k | Workflows de aprobacion con estados y roles (doctype workflow). Referencia canonica para `ApprovalRequest` + `RoleAssignment`. |
| [nocobase/nocobase](https://github.com/nocobase/nocobase) | 23k | Plugins + colecciones con metadata. Referencia para el patron adapter/vertical: core pequeno, dominios como plugins. |
| [chatwoot/chatwoot](https://github.com/chatwoot/chatwoot) | 34k | Ya lo usamos con Bolivian Electric. Referencia para normalizar intake externo -> `WorkItem` (conversacion -> caso con responsable y SLA). |
| [novuhq/novu](https://github.com/novuhq/novu) | 39k | Infraestructura de notificaciones multicanal. Referencia para `Notification` cuando pase de tabla simple a preferencias/digest. |
| [documenso/documenso](https://github.com/documenso/documenso) | 13k | Firma de documentos open source. Referencia para `Document` (signedAt, visibilidad, storage externo) y futuro consentimiento DentalGest. |
| [electric-sql/electric](https://github.com/electric-sql/electric) | 10k | Sync Postgres offline-first. Candidato tecnico para el adapter Ganadero OS. |
| [rxdb/rxdb](https://github.com/rxdb/rxdb) / PowerSync | — | Alternativas de replicacion local-first para movil/campo. Evaluar contra ElectricSQL antes del adapter ganadero. |

Lectura CTO: Twenty + Plane + ERPNext cubren el 90% de las decisiones de diseno
que ONIA Core beta todavia tiene abiertas (campos custom, saved views,
aprobaciones). Antes de disenar el read-model del panel del dueno, revisar como
Plane serializa vistas y como Twenty define su capa de metadata.

## Hugging Face — modelos aplicables a los flujos Onia

| Modelo | Uso Onia |
|---|---|
| [openai/whisper-large-v3](https://huggingface.co/openai/whisper-large-v3) (o turbo, 6x mas rapido) | Transcripcion de llamadas y reuniones en espanol. Alimenta las skills existentes `analiza-llamada` e `inteligencia-reuniones-onia`. |
| [m-bain/whisperX](https://github.com/m-bain/whisperx) | Diarizacion (quien hablo) + timestamps por palabra. Mejora actas de reuniones y analisis de llamadas de venta. |
| [BAAI/bge-multilingual-gemma2](https://huggingface.co/BAAI/bge-multilingual-gemma2) o EmbeddingGemma | Embeddings multilingues. Clasificacion de mensajes de intake WhatsApp (venta/soporte/reclamo), scoring de leads, busqueda semantica en evidencia/documentos del core. |
| [facebook/mms-tts-spa](https://huggingface.co/facebook/mms-tts-spa) | TTS espanol local si se quiere bajar costo de ElevenLabs en flujos internos. |

Aplicacion concreta al core: un clasificador liviano (embeddings + regla) puede
etiquetar `WorkItem.type` y prioridad al crear items desde intake externo
(WhatsApp/Chatwoot/formularios), sin meter IA dentro del contrato — la IA vive
como servicio alrededor del core, igual que las integraciones gated.

## Skills verificadas (GitHub, por stars — verificado 2026-07-03)

Fuentes verificadas con `gh repo view` (stars reales, no listas de blogs):

| Repo | Stars | Que aporta a Onia |
|---|---|---|
| [obra/superpowers](https://github.com/obra/superpowers) | 245k | Framework de skills agentic (brainstorm -> spec -> plan -> TDD -> review). YA instalado en este entorno; usarlo al construir DentalGest beta. |
| [anthropics/skills](https://github.com/anthropics/skills) | 158k | Repo oficial de Agent Skills (docx, pdf, xlsx, pptx...). Base para generar propuestas y reportes de clientes. |
| [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) | 48k | Indice curado de skills/agents/tooling. Primera parada al buscar skill para una tarea nueva. |
| [wshobson/agents](https://github.com/wshobson/agents) | 37k | Marketplace multi-harness de plugins (Claude Code, Codex, Cursor...). Referencia si Onia publica skills propias. |
| [davila7/claude-code-templates](https://github.com/davila7/claude-code-templates) | 28k | CLI de configuracion y monitoreo de Claude Code. |
| [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) | 23k | 100+ subagentes especializados listos para adaptar. |

Aplicacion Onia:

1. Skills de documento (anthropics/skills: docx/pdf/xlsx) -> reportes
   exportables del panel del dueno y propuestas por rubro.
2. Superpowers workflow -> disciplina para el desarrollo de DentalGest beta.
3. Publicar a futuro "onia-core skill" interna para que cualquier sesion de
   desarrollo en productos respete el contrato (leer contract.json, validar,
   no romper gates).

## Skills / mejoras internas detectadas durante la investigacion

1. La skill `orquestacion-proyectos-onia` ya referencia ONIA Core y el mapa de
   adopcion (actualizada 2026-07-03).
2. Las skills `analiza-llamada` e `inteligencia-reuniones-onia` pueden
   potenciarse con WhisperX (diarizacion) cuando haya GPU o worker dedicado.
3. `n8n-mcp` + Chatwoot ya cubren el intake; lo que falta es el normalizador
   intake -> WorkItem (documentado como pendiente en el adoption map).

## Fuentes

- https://openalternative.co/alternatives/plane
- https://dev.to/nocobase/top-10-open-source-ai-crm-projects-with-the-most-github-stars-493m
- https://plane.so/blog/top-6-open-source-project-management-software-in-2026
- https://northflank.com/blog/best-open-source-speech-to-text-stt-model-in-2026-benchmarks
- https://huggingface.co/openai/whisper-large-v3
- https://huggingface.co/BAAI/bge-multilingual-gemma2
