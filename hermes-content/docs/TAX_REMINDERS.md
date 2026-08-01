# Tax Reminders

## Objetivo
Ayudar a Onia a recordar obligaciones fiscales de Bolivia sin inventar fechas ni reemplazar validacion contable.

## Comandos
- `Recordatorios fiscales ONIA`
- `Configura impuestos ONIA: <datos>`
- `Resumen fiscal ONIA`
- `Marca impuesto ONIA: <obligacion> como <estado>`

## Obligaciones contempladas
- IVA mensual.
- IT mensual.
- RC-IVA mensual si aplica.
- IUE anual.

## Datos requeridos
- NIT o terminacion de NIT.
- Regimen tributario.
- Impuestos aplicables.
- Responsable.
- Canal de alerta.
- Calendario confirmado.
- Anticipacion de alertas.

## Reglas
- No asumir fechas.
- No asumir regimen.
- No asumir si una obligacion aplica.
- Si faltan datos, listar pendientes.
- Recomendar validacion con contador o fuente oficial.

## Plantilla base
Archivo:
`hermes-content/references/impuestos-bolivia.template.json`

## Campos recomendados en Notion
- Obligacion
- Impuesto
- Frecuencia
- Fecha vencimiento
- Estado: pendiente, preparado, presentado, pagado, no aplica
- Responsable
- Canal de alerta
- Alertas enviadas
- Fuente/calendario confirmado
- Notas contador

## n8n

Flujo diario:
1. Schedule Trigger diario.
2. Leer configuracion fiscal desde Notion o archivo de referencia.
3. Verificar si la configuracion esta completa.
4. Si falta informacion, enviar tarea pendiente por Telegram.
5. Si esta completa, calcular alertas proximas.
6. Enviar recordatorio.
7. Registrar alerta enviada.
