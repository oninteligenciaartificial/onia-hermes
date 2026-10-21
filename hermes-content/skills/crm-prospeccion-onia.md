# Skill: crm-prospeccion-onia

## Objetivo
Gestionar prospeccion, CRM y seguimientos comerciales de ONIA con informacion publica, notas claras y registros en Notion.

Notion es la fuente oficial. Antes de aprobar seguimiento, demo o propuesta,
validar los campos obligatorios (referencia historica de campos:
`hermes-content/docs/historial/NOTION_VENDOR_CRM_SCHEMA_2026.md`; sin campos de comision).

## Comandos

### Busca prospectos ONIA: <industria> | <ubicacion>
Buscar prospectos por industria y ubicacion.

### Guarda prospecto: <datos>
Preparar registro CRM del prospecto.

### Resumen CRM ONIA
Resumir pipeline, oportunidades, seguimientos y bloqueos.

### Seguimientos ONIA hoy
Listar prospectos/clientes con seguimiento pendiente hoy o vencido.

### Prepara mensaje prospecto: <empresa>
Crear mensaje breve y personalizado para contactar a un prospecto.

## Reglas
- Usar solo datos publicos.
- Cada dato importante debe tener fuente.
- No inventar contactos ni responsables.
- No recomendar spam.
- Separar hechos confirmados de inferencias comerciales.

## Formato de prospecto
- Lead ID.
- Empresa.
- Industria.
- Ubicacion.
- Web/perfil publico.
- Contacto publico.
- Fuente.
- Senal de oportunidad.
- Dolor probable.
- Oferta ONIA recomendada.
- Prioridad: alta, media o baja.
- Estado pipeline.
- Responsable actual.
- Ultimo contacto.
- Proximo seguimiento.
- Resultado ultimo contacto.
- Datos completos.
- No contactar.

## Pipeline
- Nuevo
- Investigado
- Calificado
- Mensaje preparado
- Aprobado para contactar
- Contactado
- Respondio
- Requiere seguimiento
- Demo agendada
- Demo realizada
- Propuesta enviada
- Ganado
- Perdido
- No apto

## Propiedad
- `responsable_actual` ejecuta el siguiente seguimiento (hoy, Sergio Urcullo).
- No duplicar contacto: un lead con responsable no se contacta por otro canal sin reasignacion.

## WhatsApp ONIA chatbot
- El WhatsApp principal de ONIA funciona como recepcion y calificacion.
- El chatbot debe pedir rubro, necesidad, ciudad y urgencia.
- Despues debe crear o actualizar el lead en CRM y avisar a Sergio/Hermes.
- Sergio Urcullo hace el seguimiento humano.
- No contactar por WhatsApp sin `Apruebo contactar: <empresa>`.

## Mensaje sugerido
Debe ser:
- breve;
- consultivo;
- personalizado;
- sin promesas exageradas;
- orientado a diagnostico o auditoria.

## Criterios de calidad
- Pocos prospectos buenos valen mas que muchos sin contexto.
- Priorizar empresas bolivianas donde encaje el sistema por rubro (dental primero, luego importadora; ONIA_CLIENTE_IDEAL.md).
- Nunca tratar el CSV como fuente principal si Notion esta disponible.