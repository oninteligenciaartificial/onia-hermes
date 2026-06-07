# n8n Workflow: ONIA - Plan semanal

## Objetivo
Orquestar cada semana la investigacion de tendencias, generacion del plan de contenido y aprobacion manual antes de publicar.

## Nodos recomendados
1. Schedule Trigger: una vez por semana.
2. Hermes/Telegram Request: pedir `Plan semanal ONIA`.
3. Telegram Send Message: enviar resumen al usuario.
4. Wait for Approval: esperar respuesta explicita.
5. IF Approval: continuar solo si el mensaje contiene aprobacion clara.
6. Publish Step: ejecutar publicacion aprobada o dejar tarea manual si faltan assets.
7. Log Step: guardar resultado, errores y URL publicada si existe.

## Regla de aprobacion
La aprobacion debe mencionar la pieza exacta.
Ejemplo valido:
`Apruebo publicar carrusel: 5 errores de automatizacion en clinicas`

Ejemplos no validos:
- `ok`
- `dale`
- `publica algo`

## Mensaje semanal sugerido
```text
Hermes preparo el Plan semanal ONIA.

Resumen:
<resumen>

Pieza prioritaria:
<pieza>

Para publicar, responde:
Apruebo publicar <pieza exacta>
```

## Variables utiles
- `ONIA_WEEKLY_TOPIC`: tema opcional para la semana.
- `ONIA_APPROVAL_CHAT_ID`: chat de Telegram que puede aprobar.
- `HERMES_ASSETS_BASE_URL`: base publica para assets si se publican carruseles.

## Criterios de exito
- El flujo genera un plan semanal sin publicar automaticamente.
- El usuario recibe el resumen por Telegram.
- El flujo se detiene si no hay aprobacion clara.
- La publicacion queda registrada cuando existe.
