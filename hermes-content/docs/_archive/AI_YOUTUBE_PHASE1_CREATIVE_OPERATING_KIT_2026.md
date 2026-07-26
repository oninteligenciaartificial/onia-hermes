# AI YouTube Phase 1 Creative Operating Kit 2026

Fecha: 2026-06-05

Estado: operativo local, sin publicacion, sin gasto y sin acciones client-facing.

Objetivo: empezar la Fase 1 de Atlas AI Media con un sistema creativo reutilizable para los dos canales definidos en `AI_YOUTUBE_CHANNELS_MASTER_PLAN_2026.md`:

- Workflow ROI: mercado USA, ingles, AI automation + SaaS workflows for SMB operators.
- Automatiza PyME: mercado hispano, espanol, IA y automatizacion para PYMES.

## 1. Resumen ejecutivo

La primera ejecucion no debe producir "videos de IA genericos". Debe producir paquetes editoriales con:

- caso de negocio concreto;
- demo o workflow original;
- fuentes verificables;
- visuales propios o generados;
- thumbnail y SEO;
- derivaciones Shorts;
- aprobacion humana antes de subir o publicar.

Decision operativa: automatizar el 90-95% de investigacion, guion, assets, metadata, QA y analisis. Mantener aprobacion humana para claims, publicacion, sponsors, afiliados nuevos, voces clonadas, pagos y cualquier accion irreversible.

## 2. Supuestos

- Sergio actua solo como dueno/supervisor.
- No hay canales creados aun o no se usaran hasta recibir confirmacion.
- No se usaran rostros, voces, logos, musica ni assets protegidos sin permiso.
- Los canales son independientes de ONIA; el repo Hermes solo documenta y prepara la operacion.
- El primer objetivo no es monetizacion inmediata por AdSense, sino validacion de formato, retencion, busqueda y conversion hacia newsletter/afiliados.

## 3. Fuentes actuales revisadas

Estas fuentes se usaron para ajustar la ejecucion de Fase 1:

- YouTube monetization policies: contenido monetizable debe ser original, autentico y no repetitivo; el contenido masivo con plantilla y poco valor puede afectar la monetizacion del canal. Fuente: https://support.google.com/youtube/answer/1311392
- YouTube synthetic/altered content disclosure: se debe declarar contenido alterado o sintetico cuando parezca realista o represente escenas que no ocurrieron. Fuente: https://support.google.com/youtube/answer/14328491
- YouTube Data API: la subida `videos.insert` cuesta 100 unidades de cuota y los proyectos API no verificados creados despues de 2020 pueden quedar restringidos a videos privados. Fuente: https://developers.google.com/youtube/v3/docs/videos/insert
- n8n AI Agent: los AI Agent nodes operan como Tools Agent y necesitan herramientas conectadas. Fuente: https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/
- n8n AI Agent Tool: permite orquestar subagentes especializados como herramientas. Fuente: https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.toolaiagent/
- n8n Schedule Trigger: los workflows programados deben guardarse y publicarse para ejecutarse por horario. Fuente: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.scheduletrigger/
- n8n YouTube node: soporta operaciones de canal y playlists; para operaciones no soportadas se usa HTTP Request contra API. Fuente: https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.youtube/
- Google Veo 3.1: soporta text-to-video, image-to-video, 16:9 y 9:16, 720/1080, 24 FPS, videos de 4/6/8 segundos; prompts en ingles. Fuente: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/veo/3-1-generate
- ElevenLabs TTS: TTS en 32 idiomas, util para narracion multilingue y estilos de voz. Fuente: https://elevenlabs.io/docs/capabilities/text-to-speech
- Microsoft Work Trend Index 2026: agentes de IA y trabajo con agentes son tema central para empresas. Fuente: https://www.microsoft.com/en-us/worklab/work-trend-index/agents-human-agency-and-the-opportunity-for-every-organization
- Goldman Sachs small business AI survey 2026: pequenas empresas ya adoptan IA, pero necesitan integracion operativa y soporte. Fuente: https://www.goldmansachs.com/pressroom/press-releases/2026/small-businesses-embrace-ai-but-need-training-and-support-to-fully-harness-it
- Google Cloud AI Business Trends Report 2026: 2026 se posiciona como ano de reshaping empresarial por AI agents. Fuente: https://blog.google/products/google-cloud/ai-business-trends-report-2026/

## 4. Frentes activados

- Planner/Arquitectura: convertir el plan maestro en ejecucion Fase 1.
- Contenido/Media: paquetes piloto, guiones, prompts, thumbnails, Shorts.
- Automatizacion/n8n: workflow auditable con aprobacion humana.
- Compliance/Brand Safety: copyright, claims, IA sintetica, monetizacion.
- QA/Verificacion: checklist y pruebas locales de estructura.

## 5. Reglas editoriales no negociables

1. Cada video largo debe tener una demo, workflow, matriz, checklist o teardown original.
2. Cada guion debe citar fuentes internas o publicas revisadas.
3. Cada pieza debe evitar claims garantizados como "ahorra X horas" si no hay medicion.
4. Los titulos pueden ser fuertes, pero no fraudulentos.
5. Las miniaturas deben vender el problema, no inventar resultados.
6. Los videos generados con IA deben usar escenas abstractas, mockups genericos o recursos propios.
7. Si la pieza usa IA realista, activar disclosure en YouTube Studio.
8. El uploader solo debe dejar drafts/private hasta aprobacion explicita.

## 6. Cadencia piloto recomendada

Primeros 14 dias:

- 2 videos largos por canal: 4 videos largos totales.
- 3 Shorts por canal por semana: 12 Shorts totales.
- 1 newsletter semanal por idioma: 4 newsletters totales.
- 1 pagina recurso por video largo: 4 paginas.

Por que esta cadencia: es suficiente para probar formatos y keywords sin caer en produccion masiva repetitiva. Si la calidad de demo baja, se reduce volumen.

## 7. Pilares editoriales

### Workflow ROI

- AI Agents for Operators: agentes para ventas, soporte, reporting y follow-up.
- SaaS Stack Teardowns: CRM, project management, spreadsheets, automation.
- Workflow ROI Lab: una automatizacion concreta, con inputs, nodos, outputs y metricas.
- Tool Reality Checks: que funciona, que no, costo, riesgo y mejor alternativa.
- Template Drops: SOPs, n8n blueprints, prompt packs.

Tono: directo, sobrio, operator-led, con lenguaje de negocio. Evitar hype.

### Automatiza PyME

- Casos PyME: clinicas, inmobiliarias, restaurantes, ecommerce, agencias, consultores.
- WhatsApp + CRM + agenda: problemas diarios de seguimiento.
- IA sin humo: explicaciones claras, implementables, sin prometer milagros.
- Plantillas y flujos: Google Sheets, Notion, n8n, Make, email, reportes.
- Errores comunes: datos sucios, falta de proceso, mala adopcion.

Tono: practico, cercano, anti-humo, con ejemplos cotidianos.

## 8. Paquete piloto 1 - Workflow ROI

### Brief

- Canal: Workflow ROI.
- Idioma: ingles.
- Formato: YouTube largo 9-12 min + 3 Shorts.
- Objetivo: captar operadores/founders que pierden leads por falta de follow-up.
- Tema: build a 3-agent follow-up system for missed leads.
- Promesa segura: "turn missed lead follow-up into a visible workflow you can audit."
- Herramientas demostrables: n8n, Google Sheets or Airtable, Gmail, CRM placeholder, Slack/Telegram.
- Riesgo: no prometer ingresos, no usar datos de clientes reales.

### Titulos A/B

1. Build an AI Follow-Up System So Leads Stop Disappearing
2. The 3-Agent Workflow Every Small Business Should Build First
3. I Turned Missed Leads Into an AI-Audited Follow-Up Pipeline

### Thumbnail

- Texto corto: `LOST LEADS -> AI PIPELINE`
- Visual: split screen. Left: messy inbox with red missed tags. Right: clean workflow map with three agent nodes.
- No logos reales. Usar UI generica.

### Hook

```text
Most small businesses do not need a smarter chatbot first. They need a system that notices when a lead went quiet, decides the next follow-up, and makes the owner see what happened. In this video, we build that system with three simple agents: a detector, a drafter and a reviewer.
```

### Guion operativo

| Tiempo | Bloque | Voz | Visual |
|---|---|---|---|
| 0:00-0:25 | Cold open | "The leak is not your landing page. It is the silence after the first message." | Inbox generica, leads aging, simple red flags |
| 0:25-0:55 | Promise | "We will build an auditable follow-up workflow, not a magic agent." | Diagrama de 3 agentes |
| 0:55-1:40 | Problem | Explain missed leads, unclear owner, no status log | Before dashboard |
| 1:40-2:30 | Architecture | Detector agent, Drafting agent, Review agent | n8n style flow, generic nodes |
| 2:30-4:30 | Data model | lead_id, source, status, last_touch, next_action, risk | Spreadsheet/table mockup |
| 4:30-6:45 | Workflow build | Trigger, filter stale leads, AI draft, approval message | Screen recording/mock workflow |
| 6:45-8:10 | Safety | No auto-send first; approvals, logs, opt-out handling | Approval gate |
| 8:10-9:30 | ROI thinking | Measure response rate and cycle time, not fake revenue claims | KPI board |
| 9:30-10:20 | Template CTA | "Download the checklist / join newsletter" | Resource page mockup |

### Scene prompts

Prompt base visual:

```text
OBJECTIVE: create clean B2B automation visuals for a faceless YouTube tutorial.
FORMAT: 16:9, 8 seconds, 1080p.
STYLE: modern realistic software operations, clean office lighting, no brand logos, no readable private data.
SCENE: a generic business inbox transforms into an organized automation pipeline.
SUBJECT: abstract lead cards, agent nodes, status badges.
ACTION: lead cards move from missed inbox to detector, drafter and reviewer stages.
CAMERA: slow dolly-in, stable, no shaky movement.
LIGHTING: neutral daylight, crisp but not cinematic dark.
BACKGROUND: clean SaaS dashboard environment, generic UI.
IMPORTANT DETAILS: show audit log, approval gate, and next action column.
ON SCREEN TEXT: LOST LEADS -> AI PIPELINE
AVOID: real company logos, real emails, personal data, dramatic money claims.
FINAL PROMPT: A realistic generic SaaS operations dashboard where missed lead cards move into a three-stage AI follow-up pipeline labelled Detector, Drafter, Reviewer. Clean office daylight, neutral colors, readable but fictional UI, audit log visible, approval gate visible, slow dolly-in, 16:9, 1080p, no real logos, no personal data.
```

Negative prompt:

```text
No real logos, no real names, no celebrity, no identifiable inbox, no unreadable clutter, no stock-photo smiles, no fake revenue numbers, no medical or legal claims, no excessive neon, no crypto style.
```

### Shorts derivados

1. "Your first AI agent should not send messages. It should find the leads you forgot."
2. "Three columns that make follow-up automatable: status, last_touch, next_action."
3. "The approval gate is what turns AI follow-up from risky to usable."

### Metadata draft

Description:

```text
Build a practical AI follow-up workflow for missed leads using a detector, a drafting agent and a human approval gate. This is an educational build, not financial advice and not a guarantee of revenue.

Resource: workflow checklist coming soon.
Disclosure: some visuals may be AI-generated or synthetic for demonstration.
```

Tags:

```text
AI automation, AI agents, n8n tutorial, small business automation, CRM automation, lead follow up, workflow automation, SaaS operations
```

## 9. Paquete piloto 2 - Automatiza PyME

### Brief

- Canal: Automatiza PyME.
- Idioma: espanol.
- Formato: YouTube largo 8-11 min + 3 Shorts.
- Objetivo: mostrar una automatizacion clara para PYMES que pierden mensajes por WhatsApp o formularios.
- Tema: sistema basico para que una PyME no pierda solicitudes.
- Promesa segura: "organizar solicitudes y follow-ups en un flujo revisable."
- Herramientas demostrables: n8n, Google Sheets, WhatsApp Business via proveedor autorizado o simulacion, email/Telegram para aprobacion.
- Riesgo: no usar datos reales de pacientes/clientes; no prometer ventas.

### Titulos A/B

1. La Automatizacion Basica Para No Perder Clientes Por WhatsApp
2. Tu PyME No Necesita Mas Chats: Necesita Este Flujo
3. Como Convertir Mensajes Perdidos En Seguimientos Claros Con IA

### Thumbnail

- Texto corto: `MENSAJES PERDIDOS`
- Subtexto pequeno: `-> seguimiento IA`
- Visual: telefono generico con mensajes acumulados y, al lado, tablero con estados `nuevo`, `contactar`, `revisar`, `cerrado`.

### Hook

```text
El problema no es que tu PyME no tenga WhatsApp. El problema es que cada mensaje vive en un lugar distinto, nadie sabe quien respondio y los seguimientos dependen de la memoria. Hoy armamos un flujo simple para que cada solicitud tenga estado, proxima accion y aprobacion antes de enviar.
```

### Guion operativo

| Tiempo | Bloque | Voz | Visual |
|---|---|---|---|
| 0:00-0:25 | Cold open | "Si tu negocio responde cuando puede, tambien pierde cuando no ve." | Mensajes genericos acumulados |
| 0:25-0:55 | Promesa | "No vamos a prometer ventas. Vamos a crear orden." | Tablero simple |
| 0:55-1:35 | Caso | Solicitud entra por WhatsApp/formulario/email | Flujo omnicanal generico |
| 1:35-2:30 | Datos minimos | nombre, canal, motivo, urgencia, estado, proxima accion | Sheet mockup |
| 2:30-4:20 | Flujo | trigger, clasificacion, registro, notificacion, aprobacion | n8n style nodes |
| 4:20-5:50 | IA segura | resumen y sugerencia, no envio automatico | Approval message |
| 5:50-7:20 | Reporte | cuantas solicitudes sin responder y por cuanto tiempo | KPI simple |
| 7:20-8:40 | Errores | datos sensibles, mensajes automaticos agresivos, falta de opt-out | Checklist seguridad |
| 8:40-9:30 | CTA | plantilla y newsletter | Resource page |

### Scene prompts

Prompt base visual:

```text
OBJETIVO: crear visuales limpios para un video faceless sobre automatizacion de solicitudes en una PyME.
FORMATO: 16:9, 8 segundos, 1080p.
ESTILO: educativo, moderno, claro, sin marcas reales.
ESCENA: mensajes genericos entran desde un telefono y se ordenan en un tablero de seguimiento.
SUJETO: tarjetas de solicitud, estados, aprobacion humana.
ACCION: mensajes pasan de "sin responder" a "registrado", "revisar" y "proxima accion".
CAMARA: movimiento suave lateral, enfoque en claridad.
ILUMINACION: luz neutra, ambiente de oficina pequena.
FONDO: dashboard generico, sin logos, sin datos reales.
DETALLES IMPORTANTES: mostrar columna de aprobacion y alerta de datos sensibles.
TEXTO EN PANTALLA: MENSAJES PERDIDOS -> SEGUIMIENTO IA
EVITAR: logos, datos medicos, nombres reales, promesas de ventas, estilo futurista exagerado.
PROMPT FINAL: Clean educational faceless video visual showing generic customer messages moving from a phone inbox into a simple follow-up board with columns Registered, Review, Next Action and Human Approval. Small business office setting, neutral light, no real logos, no private data, smooth side camera movement, 16:9, 1080p.
```

Negative prompt:

```text
Sin logos reales, sin datos medicos, sin nombres de pacientes, sin promesas de ventas, sin antes/despues falso, sin personas identificables, sin estilo de banco o crypto.
```

### Shorts derivados

1. "La IA no debe responder por tu PyME primero. Debe registrar y ordenar."
2. "Si no tienes estado y proxima accion, no tienes seguimiento."
3. "El boton mas importante en una automatizacion no es enviar: es aprobar."

### Metadata draft

Description:

```text
Aprende a disenar un flujo simple para ordenar solicitudes de una PyME con IA, estado, proxima accion y aprobacion humana. Este video es educativo y no promete resultados comerciales garantizados.

Recurso: plantilla de seguimiento proximamente.
Disclosure: algunas imagenes pueden ser generadas con IA para demostracion.
```

Tags:

```text
automatizacion pyme, inteligencia artificial negocios, n8n espanol, WhatsApp Business, CRM para pymes, seguimiento clientes, IA para emprendedores
```

## 10. Prompt del Orquestador Creativo

Usar este prompt como raiz para cada paquete:

```text
Actua como Orquestador Creativo Senior para Atlas AI Media.

Canal: {{channel_name}}
Idioma: {{language}}
Mercado: {{market}}
Formato: {{format}}
Objetivo: {{objective}}
Audiencia: {{audience}}
Tema: {{topic}}
Fuentes disponibles: {{sources}}
Herramientas de produccion: {{tools}}
Restricciones: no inventar metricas, no usar logos ni datos reales, no prometer resultados, no publicar, preparar solo para revision.

Entrega:
1. Resumen creativo.
2. Supuestos.
3. Angulo recomendado y por que.
4. Titulos A/B.
5. Idea de thumbnail.
6. Hook.
7. Guion con timestamps.
8. Storyboard visual.
9. Prompts IA por escena.
10. Prompt negativo.
11. Voz, musica y SFX.
12. Metadata YouTube.
13. Shorts derivados.
14. Checklist de compliance.
15. Riesgos y aprobaciones necesarias.
```

## 11. Prompt del Fact Checker

```text
Actua como fact checker y compliance reviewer de un canal faceless de YouTube.

Entrada:
- Guion: {{script}}
- Fuentes: {{sources}}
- Thumbnail: {{thumbnail}}
- Metadata: {{metadata}}
- Prompts visuales: {{visual_prompts}}

Revisa:
1. Claims no respaldados.
2. Promesas de ingresos, ahorro, salud, legal o seguridad.
3. Riesgo de copyright, logos, marcas o datos privados.
4. Repeticion excesiva o contenido plantilla.
5. Necesidad de disclosure de contenido sintetico.
6. Riesgo de afiliados o sponsors no declarados.
7. Frases que deben suavizarse.

Devuelve JSON:
{
  "approval_status": "approved|needs_revision|blocked",
  "risk_level": "low|medium|high",
  "required_edits": [],
  "safe_rewrite": [],
  "sources_needed": [],
  "disclosure_required": true,
  "notes": ""
}
```

## 12. Checklist de produccion

Antes de aprobar un paquete:

- El tema tiene caso de negocio especifico.
- El guion incluye demo o workflow original.
- No hay datos reales, privados o sensibles.
- No hay logos ni UI protegida salvo capturas permitidas y necesarias.
- Las escenas IA son genericas o claramente demostrativas.
- El video no promete ingresos, ahorro fijo o resultados garantizados.
- La descripcion incluye disclosure si aplica.
- La miniatura no exagera resultados.
- Hay al menos un recurso descargable o newsletter CTA.
- Existe un Short derivado para cada idea principal.
- El paquete tiene estado `ready_for_human_review`, no `ready_to_publish`.

## 13. Herramientas por etapa

| Etapa | Herramienta primaria | Alternativa | Nota |
|---|---|---|---|
| Tendencias | Gemini/OpenAI via web + fuentes oficiales | Perplexity/Google Trends manual | Guardar fuentes por item |
| Competencia | YouTube Data API search/list | vidIQ/Tubebuddy manual | No scrapear agresivamente |
| Guion | ChatGPT/Gemini | Claude | Usar estructura y fuentes |
| Fact-check | Claude/Gemini | ChatGPT | Requiere JSON |
| Imagen | Nano Banana/Imagen | Midjourney/Flux | No logos reales |
| Video | Veo 3.1 Fast | Runway/Higgsfield/Kling | Veo prompts en ingles |
| Voz | ElevenLabs | OpenAI TTS/HeyGen | No clonar sin permiso |
| Edicion | CapCut/Runway | Descript | Plantillas pero variacion real |
| Thumbnail | Canva + IA imagen | Photoshop | Exportar variantes |
| Orquestacion | n8n | Make | Aprobacion humana |
| Datos | Supabase/PostgreSQL | Airtable | Auditoria y estados |

## 14. Proximos pasos

1. Crear canales, emails, marca minima y carpetas de activos.
2. Crear Supabase schema para `content_items`, `scripts`, `fact_checks`, `assets`, `upload_packages`, `analytics`. Estado 2026-06-05: creado localmente en `supabase/migrations/20260605_atlas_ai_media_content_factory.sql`; pendiente aplicar en Supabase real.
3. Implementar workflow n8n en modo draft-only. Estado 2026-06-05: creado en n8n como borrador manual despublicado; ID `Si1cPoh65Ld4z7Ej`.
4. Generar los dos videos piloto como paquetes completos.
5. Revisar manualmente compliance y calidad.
6. Solo con aprobacion explicita: subir como privado/no listado para QA.

## 15. Ejecucion paso a paso iniciada

Decision de canal ajustada a la instruccion "alto CPM/RPM y CRM":

- El canal ingles se mantiene como Workflow ROI, enfocado en AI automation, SaaS, CRM workflows, lead follow-up, reporting, support ops y stacks B2B. Esta es la ruta con mayor potencial de RPM/CPM por anunciantes SaaS/CRM.
- El canal espanol se mantiene como Automatiza PyME, pero con mayor peso en CRM, WhatsApp, seguimiento comercial, agenda, ventas y reporting para PYMES. El AdSense sera menor que en USA, asi que el upside viene de afiliados CRM/SaaS, templates y sponsors.

Pendientes seguros completados:

- Schema local Supabase/PostgreSQL creado.
- Workflow SDK n8n creado localmente y validado.
- Workflow real creado en n8n como manual draft, sin credenciales, sin schedule, sin upload y sin publish.

Pendientes que requieren aprobacion o dato externo:

- Aplicar la migracion SQL en Supabase real.
- Conectar credenciales Supabase/n8n/OpenAI/YouTube/Telegram.
- Activar schedule.
- Generar video/audio con costo.
- Subir o publicar contenido.
