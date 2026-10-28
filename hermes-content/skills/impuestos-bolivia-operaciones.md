# Skill: impuestos-bolivia-operaciones

> Fusiona desde el 27-oct-2026 a `recordatorios-fiscales-bolivia.md` (las dos decían casi lo mismo): esta es la única.
> **Datos de ONIA:** el NIT, el régimen y si aplica el RC-IVA salen de la skill `onia-contabilidad-bolivia`
> («Datos ONIA confirmados»). Si esta skill y esa chocan sobre NIT o régimen, **gana `onia-contabilidad-bolivia`**.
> No se re-preguntan ni se copian acá.

## Objetivo
Operar recordatorios fiscales de Bolivia para ONIA usando datos confirmados, n8n, Telegram y registros en Notion, a
partir de una plantilla editable. No inventar fechas personalizadas si faltan NIT, regimen, responsable o calendario
confirmado.

## Comandos

### Recordatorios fiscales ONIA
Mostrar configuracion, obligaciones, proximas alertas, recordatorios pendientes y datos faltantes.

### Configura impuestos ONIA: <datos>
Preparar o actualizar configuracion fiscal con datos provistos por el usuario.
Ejemplo:
`Configura impuestos ONIA: responsable Sergio, alertar 7 dias antes y 1 dia antes`

### Resumen fiscal ONIA
Resumir estado de obligaciones, pendientes y proximos vencimientos confirmados.

### Marca impuesto ONIA: <obligacion> como <estado>
Preparar actualizacion de estado para Notion o registro operativo.

## Archivo de referencia
Usar como base la plantilla editable:
`/root/.hermes/references/impuestos-bolivia.template.json`

## Obligaciones contempladas
- IVA mensual.
- IT mensual.
- RC-IVA mensual si aplica (para ONIA, lo que diga `onia-contabilidad-bolivia`).
- IUE anual.

## Datos requeridos
- NIT o terminacion de NIT (ONIA: ver la nota de arriba).
- Regimen tributario o impuestos aplicables (ONIA: ver la nota de arriba).
- Responsable.
- Canal de alerta: Telegram, email, dashboard u otro.
- Anticipacion de alertas: por ejemplo 7 dias, 3 dias y 1 dia antes.
- Calendario confirmado: fecha o regla confirmada para cada obligacion.

## Reglas
- No inventar fechas. No asumir fechas exactas sin confirmacion.
- Para un cliente, o para un dato que `onia-contabilidad-bolivia` no confirma: no asumir terminacion de NIT, regimen ni
  si RC-IVA aplica.
- Si faltan datos, responder `configuracion incompleta` con una lista clara de campos pendientes.
- Las alertas deben ser editables.
- n8n es el orquestador recomendado para recordatorios recurrentes.
- Recomendar validacion con contador o fuente oficial.
- No presentar la respuesta ni la plantilla como asesoria contable o legal definitiva.

## Formato de respuesta

### Estado fiscal
- Configurado: si/no/parcial.
- Datos faltantes.
- Responsable.
- Canal de alerta.

### Obligaciones
Para cada obligacion:
- Impuesto.
- Frecuencia.
- Regla de vencimiento o fecha confirmada.
- Estado: confirmado o pendiente.
- Alertas configuradas y proxima alerta.
- Fuente/calendario.

### Siguiente accion
Indicar el dato exacto que falta, la accion operativa siguiente o el flujo de n8n que debe crearse.

## n8n
n8n debe:
- revisar obligaciones diariamente;
- enviar alertas por Telegram;
- registrar alertas enviadas;
- actualizar estados en Notion cuando el usuario confirme.

## Criterios de calidad
- Ser conservador con fechas fiscales.
- Si hay dudas, confirmar con contador o fuente oficial antes de afirmar.
