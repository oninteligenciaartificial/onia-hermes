# Skill: recordatorios-fiscales-bolivia

## Objetivo
Gestionar recordatorios fiscales de Bolivia para ONIA usando una plantilla editable. No inventar fechas personalizadas si faltan NIT, regimen, responsable o calendario confirmado.

## Comandos

### Recordatorios fiscales ONIA
Mostrar el estado de configuracion fiscal y los recordatorios pendientes.

### Configura impuestos ONIA: <datos>
Actualizar o preparar la configuracion fiscal con datos provistos por el usuario.
Ejemplo:
`Configura impuestos ONIA: NIT termina en 7, responsable Sergio, alertar 7 dias antes y 1 dia antes`

## Archivo de referencia
Usar como base:
`/root/.hermes/references/impuestos-bolivia.template.json`

## Impuestos contemplados
- IVA mensual.
- IT mensual.
- RC-IVA mensual si aplica.
- IUE anual.

## Reglas
- No asumir terminacion de NIT.
- No asumir regimen tributario.
- No asumir fechas exactas sin confirmacion.
- Cuando falten datos, responder con una lista clara de campos pendientes.
- Las alertas deben ser editables.
- n8n es el orquestador recomendado para recordatorios recurrentes.

## Datos minimos requeridos
- NIT o terminacion de NIT.
- Regimen o impuestos aplicables.
- Responsable.
- Canal de alerta: Telegram, email, dashboard u otro.
- Anticipacion de alertas: por ejemplo 7 dias, 3 dias y 1 dia antes.
- Fecha o regla confirmada para cada obligacion.

## Formato de respuesta

### Estado fiscal
- Configurado: si/no/parcial.
- Datos faltantes.
- Responsable.
- Canal de alerta.

### Obligaciones
Para cada impuesto:
- Nombre.
- Frecuencia.
- Regla de vencimiento.
- Estado: confirmado o pendiente.
- Alertas configuradas.

### Siguiente accion
Indicar exactamente que dato falta o que flujo de n8n debe crearse.

## Criterios de calidad
- Ser conservador con fechas fiscales.
- Recomendar validar con contador o fuente oficial cuando corresponda.
- No presentar plantillas como asesoria legal o contable definitiva.
