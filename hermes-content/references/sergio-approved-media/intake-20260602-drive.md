# Sergio Media Intake - Google Drive - 2026-06-02

## Estado

Sergio subio a Google Drive un lote reciente de cara, video y voz para preparar
la biblioteca privada de referencias.

## Resumen

| Tipo | Cantidad | Estado |
|---|---:|---|
| Videos `.MOV` con audio/voz | 4 | Descargados localmente y procesados |
| Fotos `.HEIC` | 24 | Descargadas localmente y procesadas |
| Audios WAV extraidos | 4 | `voice-inbox/*.wav` |
| Previews/frames locales | 28 carpetas | `processed/<asset>/` |
| Hoja de contacto | 1 | `processed/sergio_contact_sheet_20260602.jpg` |

## Archivos de video con voz

| Archivo | Drive ID | Tamano | Estado |
|---|---|---:|---|
| `IMG_0218.MOV` | `1oaxI1U8_FRk7JOzvQhJZYc92wWrpOrR9` | 79.9 MB | Descargado y procesado |
| `IMG_0217.MOV` | `14JP05JBTtOne2AaxhCJLoLCScXMHYDel` | 50.8 MB | Descargado y procesado |
| `IMG_0210.MOV` | `18v4BFFE33Up9X9xlrf1gISoALXQrPLMw` | 17.1 MB | Descargado y procesado |
| `IMG_0209.MOV` | `1BkfMSRT6ctpfotKKXTbfCPVIXeVZCX2r` | 14.8 MB | Descargado y procesado |

## Fotos catalogadas

`IMG_0180.HEIC`, `IMG_0181.HEIC`, `IMG_0182.HEIC`, `IMG_0183.HEIC`,
`IMG_0184.HEIC`, `IMG_0185.HEIC`, `IMG_0186.HEIC`, `IMG_0187.HEIC`,
`IMG_0188.HEIC`, `IMG_0189.HEIC`, `IMG_0190.HEIC`, `IMG_0191.HEIC`,
`IMG_0192.HEIC`, `IMG_0194.HEIC`, `IMG_0195.HEIC`, `IMG_0196.HEIC`,
`IMG_0198.HEIC`, `IMG_0199.HEIC`, `IMG_0200.HEIC`, `IMG_0204.HEIC`,
`IMG_0205.HEIC`, `IMG_0206.HEIC`, `IMG_0207.HEIC`, `IMG_0208.HEIC`.

Nota: todas las fotos estan descargadas localmente y convertidas a preview JPG
cuando FFmpeg puede leer el contenedor HEIC.

## Validaciones realizadas

- Google Drive visible por Chrome con sesion `ONIA DIA A DIA ONINTELIGENCIA`.
- n8n tiene credencial `Google Drive account`.
- n8n descargo `IMG_0198.HEIC` correctamente en ejecucion manual `7786`, pero
  MCP devuelve solo referencia binaria interna, no bytes descargables localmente.
- Chrome descargo localmente `IMG_0198.HEIC` con el boton real de Drive.
- FFmpeg/ffprobe disponibles localmente.
- Puente temporal n8n creado, usado y archivado para traer los bytes desde
  Drive sin depender de Chrome.
- 28 archivos descargados localmente en `inbox/`.
- 28 archivos procesados con `scripts/process_sergio_media.ps1`.
- Videos `.MOV`: audio WAV extraido en `voice-inbox/` y frames de referencia
  en `processed/<video>/frames/`.
- Fotos `.HEIC`: metadata y preview JPG generados en `processed/<foto>/`.
- Perfil base creado:
  `hermes-content/references/sergio-approved-media/sergio-face-voice-profile-20260602.md`.

## Bloqueo resuelto

Chrome bloqueo `drive.usercontent.google.com` con `ERR_BLOCKED_BY_CLIENT`. Se
resolvio usando un puente temporal de n8n con la credencial `Google Drive
account`. El puente se desactivo y archivo al terminar.

## Pendiente

- Transcripcion de voz pendiente porque `OPENAI_API_KEY` no esta presente en el
  entorno local.
- Clasificacion creativa fina pendiente: elegir mejores tomas de cara, mejores
  fragmentos de voz y mejores gestos para personajes/prompts.

## Guardrails

- Referencia interna: permitida por subida/confirmacion de Sergio.
- Generacion con cara/voz: requiere aprobacion explicita.
- Clonacion de voz: requiere consentimiento explicito separado.
- Publicacion o entrega a clientes: requiere aprobacion explicita por pieza.
