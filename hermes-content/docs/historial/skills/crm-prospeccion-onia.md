# Skill: crm-prospeccion-onia

## Objetivo
Gestionar prospeccion, CRM y seguimientos comerciales de ONIA con informacion publica, notas claras y registros en Notion.

Notion es la fuente oficial. Antes de aprobar seguimiento, demo, propuesta o
comision, validar que el registro tenga los campos obligatorios del esquema:

- `NOTION_VENDOR_CRM_SCHEMA_2026.md`

Regla:

```text
SIN DATOS COMPLETOS, NO HAY COMISION APROBADA.
```

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
- Vendedor origen.
- Responsable actual.
- Ultimo contacto.
- Proximo seguimiento.
- Resultado ultimo contacto.
- Monto cobrado.
- Comision calculada.
- Estado de comision.
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

## Comisiones y propiedad
- `vendedor_origen` es quien consiguio el lead y cobra si esa venta se paga.
- `responsable_actual` es quien debe ejecutar el siguiente seguimiento.
- La comision mensual de SaaS se paga solo sobre el primer pago cobrado.
- Los meses futuros quedan para ONIA por soporte, entrega, mantenimiento y operacion.
- Un vendedor puede ganar de nuevo si vende una nueva compra al mismo cliente: upsell, cross-sell, anualidad, web, video, conector o sistema adicional.
- No duplicar contacto: si un lead ya tiene responsable, no sugerir que otro vendedor lo contacte sin reasignacion.

## WhatsApp ONIA chatbot
- El WhatsApp principal de ONIA funciona como recepcion y calificacion.
- El chatbot debe pedir rubro, necesidad, ciudad y urgencia.
- Despues debe crear o actualizar el lead en CRM y avisar a Sergio/Hermes.
- El vendedor hace seguimiento humano desde un canal autorizado.
- No sugerir automatizacion de WhatsApp client-facing hasta verificacion Meta y aprobacion de ONIA.

## Mensaje sugerido
Debe ser:
- breve;
- consultivo;
- personalizado;
- sin promesas exageradas;
- orientado a diagnostico o auditoria.

## Criterios de calidad
- Pocos prospectos buenos valen mas que muchos sin contexto.
- Priorizar empresas bolivianas donde ONIA pueda aportar web, IA, automatizacion, CRM o atencion al cliente.
- Nunca tratar el CSV como fuente principal si Notion esta disponible.
- No aprobar comision si faltan campos obligatorios, monto cobrado o servicio vendido.
