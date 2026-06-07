# n8n Workflow: Hermes Radar Diario Creativo y Clientes

## Estado

Creado en n8n como borrador seguro.

| Campo | Valor |
|---|---|
| Workflow ID | `lryabRhGQW4WIuJG` |
| Nombre | `Hermes Radar Diario Creativo y Clientes` |
| URL | `https://n8n-sergio-n8n.hqdqgh.easypanel.host/workflow/lryabRhGQW4WIuJG` |
| Proyecto | `On IA <oninteligenciaartificial@gmail.com>` |
| Schedule | 07:30 diario, segun timezone de la instancia n8n |
| Estado operativo | Draft/no publicado hasta configurar Telegram chat ID |

## Objetivo

Investigar diariamente novedades de IA, video, UGC, redes, automatizacion,
prospeccion y herramientas relevantes para Hermes/ONIA, y enviar un reporte
accionable a Telegram.

## Separacion obligatoria

El reporte debe separar:

- Sergio personal;
- ONIA empresa/consultoria;
- Higgsfield como motor/servicio;
- clientes/prospectos.

No mezclar precios, comisiones, claims ni mensajes comerciales entre marcas.

## Nodos

1. `Manual Test`
2. `Daily 07:30`
3. `Build Radar Brief`
4. `Telegram Chat Configured?`
5. `Missing Telegram Chat ID`
6. `OpenAI Web Research Model`
7. `Hermes Radar Agent`
8. `Send Telegram Radar`

## Credenciales autoasignadas

- OpenAI: `OpenAi account`
- Telegram: `Telegram account`

No imprimir secretos.

## Guardrail

Antes de gastar OpenAI o enviar Telegram, el workflow valida si el campo
`telegramChatId` sigue como:

```text
REPLACE_WITH_TELEGRAM_CHAT_ID
```

Si sigue como placeholder, termina en:

```text
blocked_missing_telegram_chat_id
```

## Prueba ejecutada

Ejecucion manual:

| Campo | Valor |
|---|---|
| Execution ID | `7502` |
| Estado | `success` |
| Ultimo nodo | `Missing Telegram Chat ID` |
| Resultado | No ejecuto OpenAI ni Telegram porque falta chat ID |

## Para activar

1. Obtener el chat ID interno de Telegram con el workflow auxiliar
   `Hermes Telegram Chat ID Capture`.
2. Reemplazar `REPLACE_WITH_TELEGRAM_CHAT_ID` en el nodo `Build Radar Brief`.
3. Ejecutar `Manual Test`.
4. Confirmar que llega un reporte correcto a Telegram.
5. Publicar/activar el workflow.
6. Si n8n queda activo, pausar o eliminar la automatizacion duplicada de Codex
   app para evitar doble reporte.

Workflow auxiliar:

| Campo | Valor |
|---|---|
| Workflow ID | `T3qtKnj94fBXQsxY` |
| Nombre | `Hermes Telegram Chat ID Capture` |
| URL | `https://n8n-sergio-n8n.hqdqgh.easypanel.host/workflow/T3qtKnj94fBXQsxY` |
| Estado | Activo |

Comando recomendado para Sergio:

```text
/id
```

## Acciones prohibidas

El workflow no debe:

- publicar contenido;
- contactar prospectos;
- usar cara o voz de Sergio;
- hacer deploy;
- imprimir secretos;
- mezclar marcas o precios;
- inventar resultados.
