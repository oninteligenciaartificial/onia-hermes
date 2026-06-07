# Tax Reminders

## Objetivo
Ayudar a ONIA a recordar obligaciones fiscales de Bolivia sin inventar fechas ni reemplazar validacion contable.

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

## n8n
n8n debe revisar diariamente las obligaciones configuradas y enviar alertas por Telegram segun anticipacion definida.
