# n8n Workflow: Hermes Telegram Chat ID Capture

## Estado

Activo en n8n.

| Campo | Valor |
|---|---|
| Workflow ID | `T3qtKnj94fBXQsxY` |
| Nombre | `Hermes Telegram Chat ID Capture` |
| URL | `https://n8n-sergio-n8n.hqdqgh.easypanel.host/workflow/T3qtKnj94fBXQsxY` |
| Proyecto | `On IA <oninteligenciaartificial@gmail.com>` |
| Estado operativo | Activo |

## Objetivo

Capturar el `chat_id` real del bot de Telegram conectado a n8n para poder
activar workflows de Hermes que necesitan enviar reportes o pedir aprobaciones.

## Uso

1. Enviar cualquier mensaje al bot conectado a la credencial `Telegram account`.
2. Preferido: enviar `/id`.
3. El bot responde con:
   - `Chat ID capturado`
   - tipo de chat
   - usuario/texto recibido
   - workflow de radar relacionado
4. Copiar ese `chat_id` al workflow que lo necesita.

## Relacion con radar diario

El radar diario espera este dato:

```text
REPLACE_WITH_TELEGRAM_CHAT_ID
```

Workflow de radar:

- ID: `lryabRhGQW4WIuJG`
- Nombre: `Hermes Radar Diario Creativo y Clientes`
- Referencia: `hermes-content/references/n8n-radar-diario-creativo-clientes.md`

## Nodos

1. `Telegram Message Trigger`
2. `Normalize Chat ID`
3. `Reply With Chat ID`

## Credenciales

- Telegram: `Telegram account`

No imprimir tokens ni secretos.

## Validacion

Prueba con pin data:

| Campo | Valor |
|---|---|
| Execution ID | `7777` |
| Estado | `success` |
| Nodo revisado | `Normalize Chat ID` |
| Resultado | `chatId` normalizado como string y listo para Telegram |

## Guardrails

Este workflow no debe:

- publicar contenido;
- contactar prospectos;
- usar cara o voz de Sergio;
- hacer deploy;
- exponer tokens;
- activar por si solo otros workflows.

