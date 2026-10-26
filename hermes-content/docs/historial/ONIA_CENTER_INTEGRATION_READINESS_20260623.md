# Onia Center Integration Readiness 2026-06-23

## Decision

Onia Center debe seguir dentro de `onia-hermes` durante esta fase. Hermes sigue
como cerebro privado; Onia Center ejecuta, registra y muestra la operacion; el
repo `onia-hermes-collab` queda como entrada revisable para Arthur y futuros
colaboradores.

No crear otro repo hasta que esten estables:

- Supabase real aplicado.
- Auth/RLS por usuarios y membresias.
- Runtime multiusuario probado.
- Conectores basicos funcionando.
- Separacion privado/collab validada.

## Estado verificado desde repo

Operativo en app:

- `/onia-center` con vista por rol.
- Dashboard CEO con datos privados filtrados.
- Catalogo de servicios con bloqueo por campos obligatorios.
- Reglas de comision, Nuvia, premium y evidencia.
- Organizaciones, proyectos, tareas, collab, Bolivian, StockCam y adaptadores.
- Uso diario: leads, tareas, notas, reviews e ideas.
- Ideas Inbox con prompt para Codex, Claude o modelo self-hosted.
- Calendario estricto Sergio y quiet mode Higgsfield.
- API runtime `/api/onia-center/runtime` con fallback local si falta Supabase.

Preparado pero pendiente de conexion:

- Supabase real self-hosted para multiusuario.
- Cal.com para booking.
- n8n para automatizaciones y Telegram.
- LiteLLM/Open WebUI para IA gateway.
- Ollama/modelos locales para bajar costo.
- Dify/RAG cuando exista servidor con recursos suficientes.
- Remotion para editor de video interno.
- Web Factory intake para generar briefs/previews web.
- GitHub importer para `onia-hermes-collab`.
- Uptime Kuma para estado operativo dentro de Onia Center.

Bloqueado por seguridad/operacion:

- WhatsApp chatbots productivos hasta resolver Meta, opt-in, templates y
  politicas.
- Higgsfield automatico: queda manual-only hasta que cada uso tenga brief,
  centro contable, costo y aprobacion Sergio.
- Dify en VPS actual si los recursos siguen ajustados.

## Nuevo modelo preparado

Tablas nuevas:

- `onia_center.integration_connectors`
- `onia_center.feature_readiness_items`

Reglas:

- Guardan nombres de variables, estados, faltantes y proxima accion.
- Nunca guardan secretos, tokens ni valores de credenciales.
- RLS queda enabled y locked-by-default.
- Los conectores privados son visibles solo para Sergio.

Endpoint nuevo:

- `/api/onia-center/integrations`

Funcion:

- Revisa por presencia de env vars.
- Devuelve solo nombres de variables faltantes.
- No imprime valores.

## Orden correcto para activar

1. Supabase Onia Center
   - Aplicar migraciones.
   - Cargar `ONIA_CENTER_SUPABASE_URL`.
   - Cargar `ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY` solo server-side.
   - Crear usuarios reales y policies RLS.

2. Auth/RLS
   - Sergio: acceso completo.
   - Arthur: tareas, leads, briefs y entregables revisables.
   - Vendedor: leads/tareas comerciales asignadas.
   - Freelancer: solo entregable asignado.

3. Cal + n8n
   - Desplegar Cal.
   - Crear eventos: consulta inicial, demo Onia, reunion proyecto, auditoria pagada.
   - Webhook Cal -> n8n -> Google Calendar -> Telegram -> Supabase.

4. IA gateway
   - Conectar LiteLLM primero.
   - Crear endpoint de review de ideas/briefs/leads.
   - Registrar uso por centro.
   - Luego conectar modelos locales/Ollama.

5. Media Lab
   - Crear modulo Remotion.
   - Cola: idea -> brief -> script -> assets -> render -> revision.
   - Higgsfield solo manual o con aprobacion.

6. Web Factory automatico
   - Crear formulario cliente.
   - Generar lead + brief + tarea + preview interna.
   - Onia revisa alcance/precio antes de enviar.

7. Collab importer
   - Leer `onia-hermes-collab` con GitHub token de scope minimo.
   - Clasificar sensibilidad.
   - Redactorizar.
   - Crear review queue.
   - Importar solo con Sergio.

## Lo que falta para estar completamente operativo

- Migraciones aplicadas en Supabase real.
- Auth real y RLS no solo service-role.
- Variables seguras cargadas en Vercel/local/VPS.
- Workflows n8n importados.
- Cal desplegado con URL final.
- IA gateway conectado.
- Modelo local o servidor local decidido.
- UI especifica para Media Lab/Remotion.
- Intake publico Web Factory.
- Importador GitHub collab.
- Monitoreo visible en Onia Center.

## Regla de seguridad

Onia Center no debe exponer:

- capital privado Sergio;
- deuda exacta;
- estrategia interna;
- credenciales;
- service role;
- finanzas privadas;
- acuerdos sensibles;
- datos de clientes no saneados;
- cola colaborativa sin revision.

Toda automatizacion que contacte clientes, publique, genere videos con cara/voz
o use herramientas premium requiere aprobacion explicita.
