# Skill: Inteligencia de Reuniones ONIA

## Cuando usar

Usar cuando Sergio envie o mencione:

- grabacion de reunion;
- audio de WhatsApp;
- audio de Telegram;
- llamada de venta;
- transcript de cliente;
- solicitud de propuesta desde una conversacion;
- acta, resumen, follow-up o tareas desde una reunion.

Comandos que activan este skill:

- `Procesa reunion: <archivo o contexto>`
- `Procesa audio WhatsApp: <archivo>`
- (`Analiza llamada: <transcript>` lo atiende la skill analiza-llamada)
- `Prepara propuesta desde esta reunion`
- `Haz acta de esta reunion`

## Regla principal

No asumir datos comerciales que no esten en el audio/transcript.

Si falta nombre de empresa, contacto, presupuesto, alcance o proximo paso,
marcar como `por verificar` y pedir solo ese dato minimo antes de enviar algo
client-facing.

## Flujo operativo

1. Verificar que el audio fue obtenido con permiso o que Sergio confirma que
   puede procesarse.
2. Transcribir:
   - Preferido en VPS: Speakr (`meeting-lite` o `meeting-gpu`).
   - Para archivo local: `node scripts/procesa-audio-cliente.js --audio "<ruta>"`.
   - Para acta formal: `python scripts/acta_generator.py --audio "<ruta>"`.
3. Guardar transcript en ruta canonica si se genera archivo:
   - `hermes-content/audio-intelligence/transcripts/` (crear la carpeta; no existe hoy)
4. Si el objetivo es propuesta:
   - ejecutar `scripts/analiza-transcripcion.js`;
   - generar propuesta con `scripts/genera-propuesta.js`;
   - devolver resumen y ruta.
5. Si el objetivo es acta:
   - ejecutar `scripts/acta_generator.py`;
   - devolver `.docx`/`.md`.
6. Si el objetivo es CRM/seguimiento:
   - extraer necesidad, objeciones, presupuesto, interes, proximo paso y fecha;
   - preparar nota para CRM/Notion;
   - no actualizar fuentes externas sin autorizacion o herramienta conectada.

## Audio de WhatsApp

Fase actual recomendada:

1. Descargar el audio de WhatsApp o reenviarlo al canal operativo de Hermes.
2. Procesar con `scripts/procesa-audio-cliente.js`, como archivo local o por Telegram.
3. Revisar antes de convertir en propuesta.

No automatizar WhatsApp personal por scraping. Para automatizacion real usar
WhatsApp Business API, Meta verificado o Chatwoot conectado.

## Comandos utiles

Transcribir y preparar propuesta desde archivo:

```bash
node scripts/procesa-audio-cliente.js --audio "/ruta/audio.ogg"
```

Transcribir sin generar propuesta:

```bash
node scripts/procesa-audio-cliente.js --audio "/ruta/audio.ogg" --no-propuesta
```

Analizar transcript ya existente:

```bash
node scripts/analiza-transcripcion.js "/ruta/transcript.txt"
```

Acta formal desde audio:

```bash
python scripts/acta_generator.py --audio "/ruta/reunion.m4a" --title "Reunion cliente"
```

## Variables

Para transcripcion local por Speaches:

```bash
STT_BASE_URL=http://127.0.0.1:3108/v1
STT_MODEL=Systran/faster-distil-whisper-large-v3
STT_API_KEY=local
```

Fallbacks soportados por script:

```bash
GROQ_API_KEY=...
OPENAI_API_KEY=...
```

Para Speakr:

```bash
TEXT_MODEL_API_KEY=...
```

Para WhisperX diarizacion:

```bash
HF_TOKEN=...
```

## Output para Sergio

Responder con:

- empresa/contacto detectado;
- necesidad principal;
- objeciones;
- nivel de interes;
- proximo paso;
- ruta del transcript;
- ruta de propuesta o acta;
- datos que faltan verificar.

No enviar propuesta al cliente automaticamente.
