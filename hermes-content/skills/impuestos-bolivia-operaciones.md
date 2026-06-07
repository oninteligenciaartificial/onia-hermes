# Skill: impuestos-bolivia-operaciones

## Objetivo
Operar recordatorios fiscales de Bolivia para ONIA usando datos confirmados, n8n, Telegram y registros en Notion.

## Comandos

### Recordatorios fiscales ONIA
Mostrar configuracion, obligaciones, proximas alertas y datos faltantes.

### Configura impuestos ONIA: <datos>
Preparar o actualizar configuracion fiscal con datos provistos por el usuario.

### Resumen fiscal ONIA
Resumir estado de obligaciones, pendientes y proximos vencimientos confirmados.

### Marca impuesto ONIA: <obligacion> como <estado>
Preparar actualizacion de estado para Notion o registro operativo.

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
- No inventar fechas.
- No asumir regimen.
- No asumir si RC-IVA aplica.
- Si faltan datos, responder `configuracion incompleta`.
- Recomendar validacion con contador o fuente oficial.
- No presentar la respuesta como asesoria contable definitiva.

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
- Fecha o regla confirmada.
- Estado.
- Proxima alerta.
- Fuente/calendario.

### Siguiente accion
Indicar el dato exacto que falta o la accion operativa siguiente.

## n8n
n8n debe:
- revisar obligaciones diariamente;
- enviar alertas por Telegram;
- registrar alertas enviadas;
- actualizar estados en Notion cuando el usuario confirme.
