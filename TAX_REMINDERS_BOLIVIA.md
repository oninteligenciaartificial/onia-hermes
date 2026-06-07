# Tax Reminders Bolivia - ONIA + Hermes

## Objetivo
Preparar un sistema de recordatorios fiscales para ONIA usando Hermes y n8n, sin inventar fechas ni reemplazar validacion contable.

## Alcance inicial
- IVA mensual.
- IT mensual.
- RC-IVA mensual si aplica.
- IUE anual.
- Alertas por Telegram.
- Registro de obligaciones y alertas en Notion.

## Datos requeridos antes de activar
- NIT o terminacion de NIT.
- Regimen tributario.
- Impuestos aplicables.
- Responsable interno.
- Canal de alerta.
- Calendario confirmado.
- Anticipacion de alertas.

## Regla de seguridad
Si falta algun dato, Hermes debe responder con `configuracion incompleta` y listar los campos faltantes.

No debe:
- inventar vencimientos;
- asumir regimen;
- asumir si RC-IVA aplica;
- dar asesoria legal o contable definitiva.

## Plantilla base
Archivo:
`hermes-content/references/impuestos-bolivia.template.json`

## Flujo n8n - Recordatorios fiscales
1. Schedule Trigger diario.
2. Leer configuracion fiscal desde Notion o archivo de referencia.
3. Verificar si la configuracion esta completa.
4. Si falta informacion, enviar tarea pendiente por Telegram.
5. Si esta completa, calcular alertas proximas.
6. Enviar recordatorio.
7. Registrar alerta enviada.

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

## Comandos Hermes
- `Recordatorios fiscales ONIA`
- `Configura impuestos ONIA: <datos>`
- `Resumen fiscal ONIA`
- `Marca impuesto ONIA: <obligacion> como <estado>`

## Criterios de exito
- Hermes nunca inventa fechas fiscales.
- n8n avisa a tiempo segun offsets configurados.
- Cada obligacion tiene responsable y estado.
- El usuario sabe exactamente que dato falta para activar el sistema.
