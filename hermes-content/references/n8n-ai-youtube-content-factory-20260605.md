# n8n Workflow Spec: Atlas AI Media - YouTube Content Factory Draft v1

Fecha: 2026-06-05

Estado: especificacion local. No crear, publicar, subir ni conectar credenciales sin aprobacion explicita.

Update 2026-06-05:

- Workflow draft real creado en n8n: `Atlas AI Media - YouTube Content Factory Draft v1`.
- Workflow ID: `Si1cPoh65Ld4z7Ej`.
- URL: `https://n8n-sergio-n8n.hqdqgh.easypanel.host/workflow/Si1cPoh65Ld4z7Ej`.
- Target project: `On IA <oninteligenciaartificial@gmail.com>` personal project.
- Estado operativo: despublicado/inactivo con `unpublish_workflow`.
- Credenciales autoasignadas: ninguna.
- Trigger actual: manual dry-run solamente.
- Upload/publicacion: bloqueados por diseno.
- Validacion: workflow SDK valido y creado mediante MCP oficial de Codex.
- Pendiente tecnico: `npm run health:n8n-mcp` local devolvio 401 Unauthorized el 2026-06-05; revisar token/config local del script antes de depender de healthchecks locales. No imprimir ni pegar el token.

## Nombre del workflow

`Atlas AI Media - YouTube Content Factory Draft v1`

## Objetivo

Orquestar la produccion diaria de paquetes de contenido para Workflow ROI y Automatiza PyME, dejando cada pieza en estado `ready_for_human_review`.

El workflow no publica videos. No contacta sponsors. No gasta creditos de generacion de video sin aprobacion. No envia mensajes a clientes.

## Trigger

- Node: Schedule Trigger.
- Frecuencia piloto: lunes, miercoles y viernes a las 08:30 America/Caracas.
- Motivo: suficiente para producir cola sin caer en contenido repetitivo.
- Nota n8n: el workflow programado debe guardarse y publicarse para ejecutarse; antes de eso correr manualmente en dry-run.

## Datos de entrada

- `channel_id`: `workflow_roi` o `automatiza_pyme`.
- `format`: `long`, `short`, `newsletter`, `resource_page`.
- `topic_seed`: texto breve o item de cola.
- `source_requirements`: lista de fuentes requeridas.
- `production_budget_mode`: `draft_only`, `low_cost`, `approved_generation`.
- `approval_required`: true.

## Nodos recomendados

1. Schedule Trigger
   - Ejecuta el workflow por horario.

2. Supabase/PostgreSQL - Fetch Content Queue
   - Lee items `queued` o `ready_for_script_package`.
   - Ordena por prioridad, canal y freshness.

3. AI Agent - Trend Researcher
   - Herramientas: HTTP Request, RSS/search provider, YouTube Data API search si hay credenciales.
   - Output: tendencias, fuentes, keywords, riesgos.

4. AI Agent Tool - Competition Researcher
   - Revisa titulos, duracion, angulos y patrones de videos competidores.
   - No copia guiones, voces ni thumbnails.

5. AI Agent Tool - Idea Generator
   - Convierte tendencia + cola en 3 angulos.
   - Selecciona uno por canal.

6. AI Agent Tool - Scriptwriter
   - Genera hook, guion con timestamps, storyboard y CTA.

7. AI Agent Tool - Fact Checker
   - Devuelve JSON con `approved`, `needs_revision` o `blocked`.
   - Bloquea claims sin fuente.

8. AI Agent Tool - Visual Prompt Engineer
   - Genera prompts para imagen y video por escena.
   - Usa prompts en ingles para Veo.

9. Conditional IF - Generation Approval
   - Si `production_budget_mode` es `draft_only`, no llama APIs de video/audio.
   - Si `approved_generation`, puede crear assets segun presupuesto aprobado.

10. ElevenLabs / TTS HTTP Request
   - Solo despues de aprobacion para generar audio.
   - No clonar voces sin consentimiento.

11. Veo/Runway/Higgsfield HTTP Request
   - Solo despues de aprobacion para generar video.
   - Guardar prompt, costo estimado y resultado.

12. Thumbnail Generator
   - Crea brief y variantes.
   - Canva/manual o API si esta aprobada.

13. SEO YouTube Agent
   - Genera title, description, tags, chapters, disclosure text.

14. Upload Package Builder
   - Compila carpeta o registro:
     - script
     - voice brief
     - visual prompts
     - thumbnail brief
     - metadata
     - source list
     - fact-check result
     - approval checklist

15. Telegram Approval Message
   - Envia resumen para aprobacion.
   - Formato de aprobacion:
     - `Apruebo paquete YouTube: <content_id>`
     - `Rehacer paquete YouTube: <content_id> | <cambio>`
   - No usar `Publicar` salvo que Sergio lo diga explicitamente.

16. Supabase/PostgreSQL - Update State
   - Estados:
     - `queued`
     - `researching`
     - `script_draft`
     - `fact_check_needs_revision`
     - `ready_for_human_review`
     - `approved_for_generation`
     - `approved_for_private_upload`
     - `published`
     - `blocked`

## Data model minimo

### `content_items`

- `id`
- `channel_id`
- `language`
- `format`
- `pillar`
- `title_working`
- `priority`
- `state`
- `created_at`
- `updated_at`
- `approval_required`

### `research_sources`

- `id`
- `content_id`
- `url`
- `source_type`
- `summary`
- `checked_at`

### `scripts`

- `id`
- `content_id`
- `hook`
- `script_markdown`
- `storyboard_markdown`
- `cta`
- `version`

### `fact_checks`

- `id`
- `content_id`
- `approval_status`
- `risk_level`
- `required_edits_json`
- `sources_needed_json`
- `disclosure_required`

### `asset_prompts`

- `id`
- `content_id`
- `asset_type`
- `tool`
- `prompt`
- `negative_prompt`
- `status`

### `upload_packages`

- `id`
- `content_id`
- `title_final`
- `description`
- `tags_json`
- `thumbnail_brief`
- `chapters`
- `disclosure_text`
- `status`

## Aprobacion requerida

Siempre requerida para:

- Crear canal o cambiar configuracion.
- Generar video/audio con costo.
- Usar voz clonada.
- Subir video a YouTube.
- Publicar o cambiar visibilidad a publico.
- Incluir afiliados nuevos.
- Contactar sponsors.
- Hacer claims financieros, legales, medicos o de resultados.

No requerida para:

- Crear brief.
- Crear guion.
- Crear prompts.
- Crear metadata.
- Crear cola local.
- Fact-check local.

## Salida esperada

Un paquete por item seleccionado:

```json
{
  "content_id": "wroi-long-001",
  "state": "ready_for_human_review",
  "script_ready": true,
  "fact_check_status": "approved_or_needs_revision",
  "generation_required": false,
  "upload_allowed": false,
  "publish_allowed": false
}
```

## Errores posibles

- Fuentes insuficientes para claims.
- Tema demasiado generico o repetitivo.
- Riesgo de contenido masivo bajo politicas de YouTube.
- Prompts con logos, datos o personas reales.
- API de YouTube no verificada: uploads quedan privados.
- Falta de credenciales de TTS/video.
- Costo de generacion no aprobado.

## Como probarlo

1. Dry-run con un solo item `wroi-long-001`.
2. Confirmar que no se llama ningun nodo de generacion pagada.
3. Confirmar que el estado final es `ready_for_human_review`.
4. Confirmar que el mensaje de Telegram no usa palabra `Publicar`.
5. Validar JSON del fact-check.
6. Revisar que fuentes y disclosure quedan adjuntos al paquete.

## Prompt del agente orquestador n8n

```text
Actua como orquestador de produccion de Atlas AI Media.

Objetivo: producir paquetes de contenido para YouTube, no publicar.
Canales: Workflow ROI y Automatiza PyME.
Reglas:
- No inventes datos.
- No copies creadores, marcas, logos ni assets.
- No generes video/audio con costo si production_budget_mode no es approved_generation.
- No subas ni publiques.
- Cada paquete debe tener caso de negocio, demo original, fuentes, guion, storyboard, prompts, metadata y checklist.
- Si falta fuente para un claim, marca needs_revision.

Input:
{{json}}

Output JSON:
{
  "content_id": "",
  "recommended_angle": "",
  "package_markdown": "",
  "fact_check_request": {},
  "approval_message": "",
  "next_state": "ready_for_human_review"
}
```
