# Setup: Pipeline Automático — Llamada → Propuesta

## Qué hace este sistema

Enviás una nota de voz en Telegram con la grabación de una llamada de ventas.
En 30-60 segundos Hermes te devuelve:

1. **Resumen estructurado**: empresa, contacto, necesidad, objeciones, nivel de interés
2. **Propuesta HTML personalizada**: lista para mostrar al cliente o exportar a PDF

Stack: Telegram → n8n → Whisper (transcripción) → GPT-4o-mini (análisis) → genera propuesta

Costo por llamada de 20 min: ~$0.06 USD

---

## Requisitos

- VPS con n8n corriendo (ya tenés esto)
- OPENAI_API_KEY en el VPS (ya tenés esto)
- Telegram bot token (ya tenés esto — Alfred)
- Node.js en el VPS (ya tenés esto)
- El repo Hermes desplegado en el VPS en `/root/hermes`

---

## Paso 1 — Subir los scripts al VPS

Desde tu Windows local:

```powershell
cd C:\dev\Expermimentos\Hermes
npm run deploy:hermes-content
```

Esto sube `hermes-content/` al VPS. Los scripts nuevos están en `scripts/`.

Si los scripts no se copian con el deploy actual, copiarlos manualmente:

```powershell
# En PowerShell local
$VPS = "root@187.77.16.63"
scp scripts/webhook-propuestas.js ${VPS}:/root/hermes/scripts/
scp scripts/genera-propuesta.js ${VPS}:/root/hermes/scripts/
scp scripts/analiza-transcripcion.js ${VPS}:/root/hermes/scripts/
```

---

## Paso 2 — Configurar variables de entorno en el VPS

SSH al VPS:

```bash
ssh root@187.77.16.63
```

Editar el archivo de entorno de Hermes:

```bash
nano /root/hermes/.env
```

Agregar o verificar estas líneas:

```bash
OPENAI_API_KEY=sk-...tu-key-aqui...
TELEGRAM_BOT_TOKEN=...tu-bot-token...
HERMES_DIR=/root/hermes
PORT=3031
```

Guardar: `Ctrl+O` → Enter → `Ctrl+X`

---

## Paso 3 — Instalar el webhook como servicio PM2

En el VPS:

```bash
cd /root/hermes

# Instalar PM2 si no está
npm install -g pm2

# Crear el archivo de configuración PM2
cat > /root/hermes/pm2-webhook.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'hermes-propuestas',
    script: '/root/hermes/scripts/webhook-propuestas.js',
    env_file: '/root/hermes/.env',
    watch: false,
    autorestart: true,
    max_restarts: 10,
    log_file: '/root/hermes/logs/webhook-propuestas.log',
    error_file: '/root/hermes/logs/webhook-propuestas-error.log',
    time: true
  }]
}
EOF

# Crear directorio de logs
mkdir -p /root/hermes/logs

# Iniciar el servicio
pm2 start /root/hermes/pm2-webhook.config.js

# Guardar para que arranque automático con el VPS
pm2 save
pm2 startup
# (copiar y ejecutar el comando que te muestra)
```

Verificar que está corriendo:

```bash
pm2 status
curl http://127.0.0.1:3031/health
```

Debe responder: `{"ok":true,"service":"hermes-propuestas",...}`

---

## Paso 4 — Importar el workflow en n8n

1. Abrir n8n en el navegador
2. Ir a **Workflows** → botón **Import**
3. Seleccionar el archivo:
   `hermes-content/docs/n8n-workflows/n8n-pipeline-llamadas.json`
4. El workflow se importa con el nombre "ONIA — Pipeline Llamada → Propuesta"

---

## Paso 5 — Configurar credenciales en n8n

### Telegram
1. En n8n ir a **Credentials** → **Add Credential** → buscar "Telegram"
2. Pegar el Bot Token de Alfred
3. Guardar como "Alfred Bot"

### Asignar credenciales en el workflow
1. Abrir el workflow importado
2. Hacer clic en cada nodo Telegram (hay 4):
   - "Telegram — Resumen"
   - "Telegram — Propuesta HTML"  
   - "Telegram — No es audio"
   - "Telegram — Error"
3. En cada uno: seleccionar la credential "Alfred Bot"

---

## Paso 6 — Activar el workflow

1. En n8n, abrir el workflow
2. Click en el toggle **Active** (arriba a la derecha)
3. El workflow queda escuchando mensajes de Telegram

---

## Paso 7 — Probar el sistema

### Prueba básica (sin audio)
Enviar en Telegram al bot Alfred:
```
hola
```
Debe responder: "⚠️ No detecté audio..."

### Prueba completa con audio
1. Grabar una nota de voz en Telegram describiendo un cliente ficticio:
   > "Hablé con Ricardo de Epic Motion, son una productora audiovisual en Santa Cruz. 
   > Necesitan una web premium para mostrar su portafolio. Presupuesto alrededor de 6000 bolivianos. 
   > La preocupación es el tiempo de entrega, quieren algo en 3 semanas."

2. Enviarla al bot Alfred
3. Esperar ~30-60 segundos
4. Deberías recibir:
   - Resumen estructurado con empresa, industria, objeciones, nivel de interés
   - Archivo HTML de propuesta para Epic Motion

### Prueba con transcript de texto
Si querés testear sin audio, enviar texto directo por Telegram o usar el script:

```bash
# En el VPS
echo "Hablé con el Dr. Vaca de Dental Smile. Tienen 3 dentistas y usan WhatsApp para agendar. 
Quieren un sistema para pacientes y citas. Presupuesto hasta 800 bolivianos por mes." | \
node /root/hermes/scripts/analiza-transcripcion.js
```

---

## Comandos de mantenimiento

```bash
# Ver logs en tiempo real
pm2 logs hermes-propuestas

# Reiniciar webhook después de actualizar código
pm2 restart hermes-propuestas

# Ver estado
pm2 status

# Testear webhook manualmente
curl -X POST http://127.0.0.1:3031/analizar \
  -H "Content-Type: application/json" \
  -d '{"transcript":"Hablé con Ricardo de Epic Motion, productora audiovisual..."}'

# Ver propuestas generadas
ls -lt /root/hermes/hermes-content/propuestas/
```

---

## Cómo actualizar el código

Cuando cambies los scripts desde Windows:

```powershell
# Desde Windows
scp scripts/webhook-propuestas.js root@187.77.16.63:/root/hermes/scripts/
scp scripts/genera-propuesta.js root@187.77.16.63:/root/hermes/scripts/
```

Luego en el VPS:
```bash
pm2 restart hermes-propuestas
```

---

## Flujo completo en detalle

```
[Telegram] Sergio envía nota de voz
    │
    ▼
[n8n] Telegram Trigger recibe el mensaje
    │
    ▼
[n8n] IF: ¿tiene voice.file_id o audio.file_id?
    │ SÍ                          │ NO
    ▼                             ▼
[n8n] HTTP POST                [n8n] Telegram
  localhost:3031/pipeline        "Enviame audio"
  { file_id, chat_id }
    │
    ▼
[webhook-propuestas.js]
  1. getFile → Telegram API → file_path
  2. Download audio → buffer binario
  3. POST a Whisper API → transcript español
  4. POST a GPT-4o-mini → JSON extracción:
       empresa, contacto, industria, ciudad,
       necesidad, objeciones, nivel interés,
       productos relevantes, próximo paso
  5. node genera-propuesta.js → HTML personalizado
  6. Return { resumen, html_path, datos }
    │
    ▼
[n8n] Telegram — envía resumen Markdown
    │
    ▼
[n8n] Leer archivo HTML del disco
    │
    ▼
[n8n] Telegram — envía propuesta.html como documento
```

---

## Errores comunes

| Error | Causa | Solución |
|---|---|---|
| `curl: connection refused` | Webhook no está corriendo | `pm2 start hermes-propuestas` |
| `OPENAI_API_KEY no configurada` | Falta var de entorno | Editar `/root/hermes/.env` + `pm2 restart` |
| `Whisper sin texto` | Audio muy corto o silencio | Verificar que el audio tenga voz |
| `No se encontró ruta HTML` | Error en genera-propuesta.js | Ver logs: `pm2 logs hermes-propuestas` |
| Workflow n8n no activa | Credencial Telegram no asignada | Asignar "Alfred Bot" a los 4 nodos Telegram |

---

## Archivos del sistema

```
hermes/
├── scripts/
│   ├── webhook-propuestas.js      ← Servidor HTTP (PM2)
│   ├── genera-propuesta.js        ← Genera HTML personalizado
│   └── analiza-transcripcion.js   ← CLI: transcript → análisis
├── hermes-content/
│   ├── propuestas/                ← HTMLs generados aquí
│   │   ├── propuesta-*.html
│   │   └── datos-*.json
│   ├── skills/
│   │   ├── genera-propuesta.md
│   │   └── analiza-llamada.md
│   └── docs/n8n-workflows/
│       └── n8n-pipeline-llamadas.json  ← Importar en n8n
├── pm2-webhook.config.js
├── .env
└── SETUP_PROPUESTAS_AUTOMATICAS.md   ← Este archivo
```
