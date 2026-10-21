# Skill: n8n-automatizaciones-onia

## Objetivo
Ayudar a operar y disenar automatizaciones n8n para ONIA relacionadas con horarios, aprobaciones por Telegram, planificacion semanal, prospeccion, impuestos, CRM, Notion y finanzas.

## Comandos

### Automatizaciones ONIA
Mostrar flujos activos/recomendados y proximas acciones.

### Planifica workflow n8n: <objetivo>
Disenar un workflow n8n concreto con disparador, nodos, aprobaciones, datos y salida.

### Plan semanal ONIA
Generar el plan semanal de contenido y prepararlo para aprobacion por Telegram.

## Flujos base
- `ONIA - Plan semanal`
- `ONIA - Prospeccion semanal`
- `ONIA - Seguimientos CRM`
- `ONIA - Recordatorios fiscales`
- `ONIA - Finanzas semanal`

## Reglas
- n8n agenda y registra; Hermes razona y redacta.
- Las acciones sensibles requieren aprobacion explicita.
- Telegram es el canal de aprobacion principal.
- Notion es el registro recomendado para CRM, finanzas, reportes y tareas.
- No crear flujos de publicacion automatica sin aprobacion.
- Leer `/root/.hermes/docs/N8N_CANONICAL.md` antes de tocar instancias n8n.
- La unica instancia viva es `n8n-sergio_n8n` (`n8n_n8n` esta apagada); no cambiar sin plan de migracion.
- Nunca poner un secreto (API key, token, service_role) en un nodo: usar credencial de n8n o `$env`.

## Formato de respuesta para workflows
Responder con:
- Nombre del workflow.
- Objetivo.
- Trigger.
- Nodos.
- Datos de entrada.
- Aprobacion requerida.
- Salida esperada.
- Errores posibles.
- Como probarlo.

## Aprobacion valida
Debe incluir accion y objeto exacto:
- `Apruebo plan semanal: <pieza>`
- `Apruebo contactar: <empresa>`
- `Confirmo impuesto: <obligacion> <fecha>`

## Criterios de calidad
- Mantener flujos simples y auditables.
- Registrar decisiones y errores.
- Evitar automatizar acciones irreversibles sin control humano.
