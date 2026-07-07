# AI YouTube Documentation Index 2026

Fecha: 2026-06-05

Objetivo: centralizar toda la documentacion necesaria para construir y operar dos canales de YouTube automatizados con IA, enfocados en alto CPM/RPM, CRM, SaaS y automatizacion B2B.

Estado general: documentacion y borradores operativos listos. No hay publicacion, gasto, subida a YouTube ni conexion de credenciales productivas sin aprobacion explicita.

## Decision final de contenido

No se recomienda contenido infantil para este negocio.

La linea editorial elegida es:

- Canal ingles: Workflow ROI. AI automation, CRM workflows, SaaS stack, lead follow-up, support ops, reporting and B2B operations.
- Canal espanol: Automatiza PyME. CRM simple, WhatsApp/follow-up, ventas, agenda, reportes e IA aplicada a PYMES hispanas.

Por que:

- Mas compatible con alto CPM/RPM que entretenimiento o kids.
- Mejor para afiliados SaaS/CRM.
- Mejor para sponsors B2B.
- Mejor para productos propios: templates, SOPs, n8n blueprints, prompt packs, mini-cursos.
- Faceless y automatizable sin depender de copyright.
- Riesgo menor que finanzas, legal, seguros o salud.

## Archivos canonicos

### Estrategia y negocio

- `AI_YOUTUBE_CHANNELS_MASTER_PLAN_2026.md`
  - Plan maestro, investigacion de nichos, arquitectura de negocio, agentes, stack, Bolivia, proyecciones y SOPs base.

- `AI_YOUTUBE_PHASE1_CREATIVE_OPERATING_KIT_2026.md`
  - Kit creativo Fase 1, paquetes piloto, prompts, cadencia, fuentes y reglas editoriales.

- `AI_YOUTUBE_HIGH_CPM_CRM_OPERATIONS_MANUAL_2026.md`
  - Manual operativo especifico para contenido alto CPM/RPM centrado en CRM, SaaS y automatizacion B2B.

- `AI_YOUTUBE_SOPS_AND_OPERATOR_HANDOFF_2026.md`
  - SOPs detalladas y manual para delegar a operador futuro.

### Automatizacion y datos

- `supabase/migrations/20260605_atlas_ai_media_content_factory.sql`
  - Schema local para Supabase/PostgreSQL: canales, items, fuentes, guiones, fact-check, assets, paquetes, aprobaciones, jobs y analytics.

- `hermes-content/references/n8n-ai-youtube-content-factory-20260605.md`
  - Especificacion n8n del content factory.

- `hermes-content/references/n8n-workflows/atlas-ai-media-content-factory-draft-v1.sdk.js`
  - Workflow SDK n8n validado. Workflow real creado como borrador manual despublicado.

### Plantillas machine-readable

- `hermes-content/references/ai-youtube-pilot-content-queue-20260605.json`
  - Cola inicial de contenidos.

- `hermes-content/references/ai-youtube-launch-checklist-20260605.json`
  - Checklist de lanzamiento por dominios: cuentas, marca, datos, automatizacion, monetizacion, compliance.

- `hermes-content/references/ai-youtube-content-package-template-20260605.json`
  - Template para cada paquete de contenido.

- `hermes-content/references/ai-youtube-approval-matrix-20260605.json`
  - Matriz de aprobaciones: que puede automatizarse y que requiere Sergio.

- `hermes-content/references/ai-youtube-high-cpm-crm-keyword-map-20260605.json`
  - Mapa editorial y de keywords para alto CPM/RPM con CRM/SaaS.

## Lo que ya existe

- Plan maestro completo.
- Kit creativo Fase 1.
- Primeros paquetes piloto definidos.
- Cola inicial de 10 contenidos.
- Schema local Supabase.
- Workflow n8n real creado como borrador manual.
- Matriz de seguridad conceptual.
- Reglas de no publicacion automatica.

## Lo que falta para operar en produccion

### Decisiones de Sergio

- Confirmar nombres finales de canales.
- Confirmar dominio o subdominio del hub.
- Confirmar si se usara una cuenta Google nueva o existente.
- Confirmar email de negocio.
- Confirmar presupuesto mensual maximo para generacion IA.
- Confirmar herramientas pagadas aprobadas.
- Confirmar idioma de primer piloto: ingles recomendado.

### Cuentas y accesos

- Google/YouTube account para cada canal.
- YouTube Brand Account.
- Google Cloud project para YouTube Data API.
- Supabase project.
- n8n credentials para Supabase, OpenAI/Gemini, Telegram y YouTube si se aprueba.
- ElevenLabs, Veo/Vertex, Runway/Higgsfield/Kling si se aprueba generacion.
- Newsletter tool: Beehiiv, ConvertKit, Brevo o similar.
- Website/resource hub.
- Afiliados SaaS/CRM aprobados.

### Activos de marca

- Logo simple por canal.
- Banner YouTube.
- Avatar.
- Thumbnail system.
- Voice style.
- Music/SFX safe library.
- Disclosure text.
- Resource page template.

### Produccion

- Primer guion largo ingles completo.
- Primer guion largo espanol completo.
- Primeros 6 Shorts derivados.
- Primeras 2 plantillas descargables.
- Primeras 2 newsletters.
- Primeras 2 paginas recurso.

## Orden recomendado

1. Aplicar schema Supabase real.
2. Conectar n8n a Supabase en modo lectura/escritura draft-only.
3. Crear paquete completo para `wroi-long-001`.
4. Revisar y aprobar guion.
5. Generar assets solo si hay presupuesto aprobado.
6. Subir privado/no listado solo con aprobacion explicita.
7. Repetir con `apyme-long-001`.
8. Activar newsletter/resource hub.
9. Activar afiliados cuando existan paginas y disclosures.
10. Activar schedule n8n solo despues de dos ejecuciones manuales limpias.

## Regla de oro

Automatizar preparacion, no decision irreversible.

El sistema puede investigar, proponer, escribir, fact-checkear, preparar assets, armar paquetes, crear metadata y analizar datos. No debe publicar, gastar, contactar sponsors, usar voz clonada, activar afiliados o hacer claims sensibles sin aprobacion.

