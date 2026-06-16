# n8n Workflow: ONIA Intake Cliente a Telegram

## Estado

Activo en n8n.

| Campo | Valor |
|---|---|
| Workflow ID | `w3vgUCV1yMkv70TW` |
| Nombre | `ONIA Intake Cliente a Telegram` |
| URL editor | `https://n8n-sergio-n8n.hqdqgh.easypanel.host/workflow/w3vgUCV1yMkv70TW` |
| Webhook (producción) | `https://n8n-sergio-n8n.hqdqgh.easypanel.host/webhook/intake-cliente` |
| Proyecto | `On IA <oninteligenciaartificial@gmail.com>` |

## Objetivo

Recibir las respuestas del formulario de levantamiento de cliente
(`web-factory/intake-cliente.html`) y enviarlas por Telegram a ONIA, sin exponer
el token del bot en el HTML público.

## Flujo

1. **Recibe Formulario Intake** (`webhook`, POST, path `intake-cliente`,
   `responseMode: responseNode`, `allowedOrigins: *` para CORS del navegador).
2. **Avisar a Sergio (Telegram)** (`telegram` sendMessage, credencial
   `Telegram account`, `chatId: 6830070978`, texto = `{{ $json.body.resumen }}`).
3. **Responder al Formulario** (`respondToWebhook`, texto `ok`) → el formulario
   muestra "✅ ¡Enviado!".

## Payload que envía el formulario

```json
{ "resumen": "<texto formateado>", "datos": { ... }, "origen": "intake-cliente", "ts": "ISO" }
```

## Pendiente / mejoras

- **Chat ID de Arthur**: la regla ONIA es avisar a Arthur Y Sergio; falta el
  chat ID de Arthur. Cuando se tenga, agregar un segundo nodo Telegram (o pasar
  `chatId` a una lista) para notificar a ambos.
- Opcional: guardar cada `datos` en una Data Table / Google Sheet como respaldo.
- Opcional: validar `origen` para descartar spam al webhook público.

## Seguridad

- El token de Telegram vive solo en la credencial n8n `Telegram account`, nunca
  en el HTML. No imprimir tokens.
