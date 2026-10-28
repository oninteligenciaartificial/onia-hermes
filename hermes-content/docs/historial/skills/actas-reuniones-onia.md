# Skill: actas-reuniones-onia

Genera **actas de reunion en Word (.docx)** a partir de notas de texto, una
transcripcion ya hecha, o un audio. Todo el pipeline es free/OSS.

## Cuando usar
- "Genera acta: <notas>"
- "Acta de reunion ordinaria: <puntos>"
- Cuando llega un audio de reunion para convertir en acta formal.

## Pipeline
1. Entrada: notas en texto / transcripcion / audio.
2. Si es audio: transcribe con faster-whisper (OSS, CPU).
3. Redaccion con LLM: Ollama `qwen2.5:3b` (gratis) con respaldo `gpt-4o`.
4. Render a Word con `pandoc` (Markdown -> .docx).
5. Guarda en `/var/www/html/hermes-assets/actas/` y, si hay
   `TELEGRAM_CHAT_ID`, envia el archivo por Telegram.

## Comando (VPS)
```bash
acta-generator --notes "puntos tratados..." --title "Reunion semanal" --type ordinaria
acta-generator --notes-file /root/notas.txt --title "Directorio"
acta-generator --audio /root/reunion.m4a --title "Comite"
echo "notas..." | acta-generator -
```
Salida: imprime JSON con `docx_path`, `public_url` y `telegram_sent`.

## Estructura del acta
Encabezado (tipo, fecha, lugar, hora), Asistentes (tabla), Orden del dia,
Desarrollo, Acuerdos, Tareas (tabla: tarea / responsable / fecha limite),
Proxima reunion.

## Reglas
- No inventar datos: lo que no aparezca en las notas va como "No especificado".
- Espanol formal.
- El `.docx` y el `.md` quedan en `hermes-assets/actas/`.

## Variables (en `/root/.hermes/.env`)
- `OLLAMA_BASE_URL` (default `http://localhost:11434/v1`), `OLLAMA_MODEL` (`qwen2.5:3b`)
- `OPENAI_API_KEY`, `OPENAI_MODEL` (`gpt-4o`) para el respaldo
- `HERMES_ASSETS_BASE_URL` para construir la URL publica
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` para enviar el archivo
- `WHISPER_MODEL` (default `base`) si se usa audio

## Dependencias en el VPS
- `pandoc` (obligatorio para .docx): `apt-get install -y pandoc`
- `faster-whisper` (solo audio): `pip install faster-whisper`
