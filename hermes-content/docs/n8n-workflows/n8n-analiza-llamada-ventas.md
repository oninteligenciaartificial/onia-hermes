# n8n Workflow: Analiza Llamada de Ventas

## Descripción
Recibe audio de llamada de venta por Telegram → transcribe con Whisper → extrae datos del cliente con Claude → genera propuesta HTML → reporta resultado a Sergio.

## Trigger
Sergio envía nota de voz o archivo de audio en el chat de Telegram de Hermes.

## Flujo

```
Telegram Trigger
    ↓ (mensaje de voz o audio)
Filtro: ¿es audio?
    ↓ SÍ
Descargar archivo de Telegram
    ↓
OpenAI Whisper — transcribir
    ↓
Detectar si es llamada de venta
    ↓ SÍ
Ejecutar analiza-transcripcion.js (VPS)
    ↓
Leer JSON de datos extraídos
    ↓
Leer HTML de propuesta generada
    ↓
Telegram: enviar resumen de análisis
    ↓
Telegram: enviar propuesta.html como documento
    ↓
Notion: crear/actualizar lead con datos extraídos
```

## Nodos necesarios

### 1. Telegram Trigger
- Event: message
- Filtrar por: `message.voice` o `message.audio`

### 2. HTTP Request — Descargar audio Telegram
```
GET https://api.telegram.org/bot{TOKEN}/getFile?file_id={{ $json.message.voice.file_id }}
→ obtener file_path
GET https://api.telegram.org/file/bot{TOKEN}/{{ file_path }}
→ obtener binario del audio
```

### 3. HTTP Request — Whisper OpenAI
```
POST https://api.openai.com/v1/audio/transcriptions
Authorization: Bearer {{ $env.OPENAI_API_KEY }}
Content-Type: multipart/form-data
  file: [audio binario]
  model: whisper-1
  language: es
→ Output: { text: "transcript completo..." }
```

### 4. Execute Command — Analizar transcript (en VPS)
```bash
cd /root/hermes
echo '{{ $json.text }}' | node scripts/analiza-transcripcion.js
```
O vía script wrapper que lee stdin.

### 5. Read File — JSON de datos
```
/root/hermes/hermes-content/propuestas/datos-<slug>-<ts>.json
```

### 6. Read File — HTML propuesta
```
/root/hermes/hermes-content/propuestas/propuesta-<slug>-<ts>.html
```

### 7. Telegram — Enviar resumen
```
Chat ID: {{ $env.TELEGRAM_CHAT_ID }}
Texto formateado con los datos del cliente, objeciones, nivel de interés y próximos pasos
```

### 8. Telegram — Enviar documento HTML
```
Chat ID: {{ $env.TELEGRAM_CHAT_ID }}
Document: propuesta.html
Caption: "Propuesta personalizada para {{ empresa }}"
```

### 9. Notion — Crear/actualizar lead (opcional)
- Buscar lead existente por nombre de empresa
- Si existe: actualizar estado, agregar notas, registrar fecha propuesta enviada
- Si no existe: crear nuevo lead con todos los datos extraídos

## Variables de entorno requeridas
```
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
OPENAI_API_KEY        # Para Whisper
ANTHROPIC_API_KEY     # Para análisis Claude
NOTION_API_KEY        # Para CRM (opcional)
NOTION_DATABASE_ID    # Para CRM (opcional)
```

## Costo estimado por llamada de 20 minutos
| Servicio | Costo |
|---|---|
| Whisper (20 min audio) | ~$0.05 USD |
| Claude Haiku (extracción) | ~$0.001 USD |
| Total por análisis | < $0.06 USD |

## Alternativa sin VPS — solo Claude Code
Si el workflow no está disponible, Sergio puede:
1. Grabar la llamada con cualquier app
2. Subir el audio a https://platform.openai.com/playground/speech (transcripción gratuita en playground)
3. Copiar el transcript y enviarlo a Hermes por Telegram: `Analiza llamada: [transcript]`
4. Hermes ejecuta el análisis directamente desde Claude Code

## Notas de implementación
- El audio de WhatsApp llega como .ogg — Whisper lo acepta directamente
- El audio de Telegram nativa llega como .oga (también válido)
- Para llamadas largas (+30 min) dividir en chunks de 20 min antes de enviar a Whisper
- Límite Whisper: 25 MB por archivo
