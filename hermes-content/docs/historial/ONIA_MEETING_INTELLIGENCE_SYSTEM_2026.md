# Onia Meeting Intelligence System 2026

Estado: decision tecnica y runbook inicial para implementar captura,
transcripcion y analisis de reuniones/audios comerciales en Onia.

Fecha de investigacion: 2026-06-26.

Decision inicial de Sergio:

- Deploy inicial en el VPS actual.
- No usar `meeting-gpu` todavia porque no hay GPU/HF token confirmado.
- Usar OpenAI por ahora para resumen, chat y propuestas.
- Mantener la transcripcion inicial lo mas open source posible con Speaches.
- Migrar resumen/LLM a local despues, cuando el flujo ya venda o ahorre tiempo.

Deploy inicial ejecutado:

- Fecha: 2026-06-26.
- VPS: `187.77.16.63`.
- Perfil: `meeting-lite`.
- Servicios: `onia_selfhosted-speakr-1` y `onia_selfhosted-speaches-1`.
- Estado validado: ambos contenedores `healthy`.
- Puertos privados:
  - Speakr: `127.0.0.1:3107`
  - Speaches: `127.0.0.1:3108`
- Acceso: solo por SSH tunnel; no hay publicacion web/DNS.
- Admin Speakr: usuario `admin`, email `admin@onia.com.bo`.
- Password: variable remota `SPEAKR_ADMIN_PASSWORD` en
  `/opt/onia-selfhosted/.env`; no guardar en docs ni chat.
- Nota: `/v1/models` de Speaches devuelve lista vacia antes de la primera
  transcripcion porque los modelos se cargan bajo demanda.

## Decision

La mejor opcion para Onia no es instalar solo Whisper ni una app aislada.

La opcion recomendada es:

1. Speakr como producto interno para grabar, subir, ordenar, buscar y revisar
   reuniones/audio.
2. Speaches como API local OpenAI-compatible para transcribir audios sueltos,
   WhatsApp, Telegram, pruebas y automatizaciones de bajo costo.
3. WhisperX ASR como motor premium para reuniones donde importa separar
   hablantes, extraer timestamps y preparar propuestas con mejor contexto.

Implementacion en el stack Onia:

- `meeting-lite`: Speakr + Speaches CPU. Es el primer paso recomendado.
- `meeting-gpu`: Speakr + WhisperX ASR. Es la mejor calidad, pero debe correr
  en un worker con NVIDIA GPU, HF token y suficiente RAM.

## Por que esta opcion

Speakr resuelve la parte de producto: UI, usuarios, grabaciones, uploads,
busqueda, resumen, chat sobre grabaciones, webhooks y uso de motores externos.
WhisperX y Speaches resuelven la parte de motor.

Para Onia, esto importa porque el valor no es "transcribir". El valor es:

- convertir reuniones en propuestas;
- detectar necesidad, objeciones, presupuesto, urgencia y proximo paso;
- guardar memoria comercial;
- reducir trabajo manual despues de cada llamada;
- procesar audios de WhatsApp/Telegram sin depender de copiar notas a mano.

## Investigacion resumida

Snapshot GitHub al 2026-06-26:

| Proyecto | Uso recomendado | Senal actual | Licencia / riesgo |
|---|---|---:|---|
| [openai/whisper](https://github.com/openai/whisper) | Base historica ASR | 103k+ stars | MIT. Muy usado, pero no trae producto interno ni diarizacion nativa. |
| [ggml-org/whisper.cpp](https://github.com/ggml-org/whisper.cpp) | CPU/local extremo | 51k+ stars | MIT. Excelente motor local, menos completo para flujo de reuniones/propuestas. |
| [SYSTRAN/faster-whisper](https://github.com/SYSTRAN/faster-whisper) | Motor rapido Whisper | 23k+ stars | MIT. Base practica para APIs como Speaches. |
| [m-bain/whisperX](https://github.com/m-bain/whisperX) | Diarizacion/timestamps | 22k+ stars | BSD-2. Mejor para reuniones con varios hablantes, pero pide GPU para buena experiencia. |
| [murtaza-nasir/speakr](https://github.com/murtaza-nasir/speakr) | Producto interno | 3.4k+ stars | AGPL-3. Bueno para uso interno; cuidado si Onia lo modifica y lo ofrece como servicio a terceros. |
| [speaches-ai/speaches](https://github.com/speaches-ai/speaches) | API local STT/TTS | 3.4k+ stars | MIT. Muy util como capa compatible con OpenAI. |
| [pluja/whishper](https://github.com/pluja/whishper) | UI local de transcripcion | 3k+ stars | AGPL-3. Buena UI, pero menos orientada a meeting intelligence/automatizacion Onia. |
| [rishikanthc/Scriberr](https://github.com/rishikanthc/Scriberr) | App self-hosted simple | 2.7k+ stars | MIT. Interesante, pero menos alineada que Speakr para colaboracion y webhooks. |

Lectura de foros:

- En self-hosted, WhisperX aparece como opcion fuerte cuando se necesita
  diarizacion, pero la comunidad marca limites con multiples hablantes,
  acentos, ruido y audio dificil. Esto confirma que Onia necesita revision
  humana antes de enviar propuestas.
- HN y foros tecnicos repiten el mismo tradeoff: diarizacion local funciona,
  pero consume GPU y mantenimiento. Por eso `meeting-gpu` debe ir separado del
  VPS principal si el audit muestra poca RAM.
- Speakr fue presentado en r/selfhosted como alternativa tipo Otter.ai que
  mantiene la infraestructura propia y agrego foco colaborativo. Eso calza con
  Onia mejor que una herramienta solo CLI.

Fuentes utiles:

- Speakr: https://github.com/murtaza-nasir/speakr
- Speakr self-hosted post: https://www.reddit.com/r/selfhosted/comments/1p5egkm/speakr_v059_voice_notes_with_major_update_with/
- Speaches: https://github.com/speaches-ai/speaches
- WhisperX: https://github.com/m-bain/whisperX
- WhisperX paper: https://arxiv.org/abs/2303.00747
- WhisperX ASR service: https://github.com/murtaza-nasir/whisperx-asr-service
- WhisperX self-hosted discussion: https://www.reddit.com/r/selfhosted/comments/1pplpz8/is_whisperx_the_best_selfhosted_transcription/
- HN self-hosted diarization discussion: https://news.ycombinator.com/item?id=40483878

## Arquitectura Onia

```text
Google Meet / Zoom / llamada / WhatsApp audio / Telegram audio
  -> Speakr upload o recording
  -> Speaches local STT (meeting-lite) o WhisperX ASR (meeting-gpu)
  -> transcript + hablantes + resumen
  -> scripts/analiza-transcripcion.js
  -> scripts/genera-propuesta.js
  -> propuesta HTML + resumen interno + follow-up CRM
```

Modulo Onia Center implementado:

- UI: `/onia-center`, modulo `Audio IA`.
- API: `web-factory/apps/site/src/app/api/onia-center/audio-intelligence/route.ts`.
- Entrada: archivo de audio, audio de WhatsApp descargado o transcript pegado.
- Salida: diagnostico comercial, objeciones, datos faltantes, nota CRM,
  transcript y borrador de propuesta.
- Uso diario: Onia Center es la pantalla principal. Speakr queda como backend
  privado/biblioteca para uploads, busqueda o revision manual.
- Login: no hace falta iniciar sesion en Speakr para preparar propuestas desde
  Onia Center. En produccion, Onia Center debe exigir sesion porque procesa
  audios y datos sensibles de clientes.
- Seguridad: la pantalla no guarda audio crudo por si sola; procesa y devuelve
  transcript/analisis para revision humana.

Actualizacion operativa 2026-06-29:

- Onia Center quedo conectado a Speaches por red Docker interna.
- Variable activa: `ONIA_AUDIO_STT_BASE_URL=http://speaches:8000/v1`.
- Onia Center debe correr en las redes `easypanel`, `supabase_default` y
  `onia_selfhosted_onia_internal`.
- Validacion: `/api/onia-center/audio-intelligence` devuelve
  `sttReachable=true`, `Speaches local responde`, fallback OpenAI configurado
  y OpenAI configurado para analisis.

Flujo minimo rentable:

1. Sergio graba una reunion con consentimiento o guarda el audio.
2. Sube el audio a Onia Center Audio IA, a Speakr o ejecuta
   `scripts/procesa-audio-cliente.js`.
3. Hermes genera transcript.
4. Hermes analiza oportunidad y prepara propuesta.
5. Sergio revisa antes de enviar al cliente.

## Grabacion de reuniones

Actualizacion: 2026-06-28.

Decision operativa:

- MVP recomendado: OBS Studio local en Windows.
- Alternativa simple para audio de computadora: Audacity con WASAPI loopback.
- Automatizacion posterior: bot open source solo cuando Onia tenga volumen real
  de reuniones, reglas de consentimiento y cuenta operativa separada.

### Opcion recomendada ahora: OBS Studio

Por que:

- Es gratis y open source.
- Graba audio del navegador/reunion y microfono en la misma sesion.
- En Windows 10/11 permite capturar audio por aplicacion con Application Audio
  Capture o audio incluido en Window Capture.
- No depende de que un bot entre a Google Meet, Zoom o Teams.
- Reduce riesgo de bloqueo por terminos de plataforma.

Setup recomendado en la PC de Sergio:

1. Instalar OBS Studio desde `https://obsproject.com/`.
2. Crear una escena `ONIA Reuniones`.
3. Agregar fuente `Application Audio Capture` o `Window Capture` para Chrome,
   Brave, Zoom o Teams.
4. Agregar fuente `Audio Input Capture` para el microfono.
5. Desactivar `Desktop Audio` global si se usa audio por aplicacion, para evitar
   eco o duplicados.
6. En `Settings > Output > Recording`, guardar en `.mkv` o `.mp4`.
7. Para audios de propuesta, usar perfil liviano: 640x360, 10 FPS, video bitrate
   bajo y audio 128 kbps. El objetivo es transcribir, no guardar video pesado.
8. Antes de iniciar la reunion, avisar al cliente y empezar grabacion.
9. Al terminar, subir el archivo a `/onia-center?view=audio-intelligence`.

Frase sugerida de consentimiento:

```text
Voy a grabar esta llamada solo para tomar mejores notas y preparar una propuesta
mas precisa. No se publica ni se comparte fuera de ONIA. Si prefieren que no,
tomamos notas manuales.
```

### Alternativa liviana: Audacity

Usar Audacity solo cuando se quiera capturar audio del sistema de forma rapida,
sin video ni layout de escena. En Windows, el metodo recomendado es `Windows
WASAPI` con entrada `(loopback)` del dispositivo por el que se escucha la
reunion.

Limitacion: Audacity es menos comodo para mezclar microfono + audio de reunion
en una sola operacion. Para llamadas comerciales reales, OBS sigue siendo mejor.

### Bots open source evaluados

| Opcion | Uso | Recomendacion Onia |
|---|---|---|
| `screenappai/meeting-bot` | Bot TypeScript/Node/Docker para entrar y grabar Google Meet, Teams y Zoom. | Interesante para fase 2. MIT, pero aun joven; probar en entorno aislado antes de usar con clientes. |
| `meetingbot/meetingbot` | Infra open source para enviar bots a Meet/Teams/Zoom con Terraform/AWS. | Potente, pero mas pesado. No recomendado para MVP local por costo operativo. |
| `jitsi/jibri` | Grabacion/streaming de conferencias Jitsi Meet. | Mejor si Onia decide usar reuniones propias en Jitsi. Requiere instalacion completa de Jitsi y maquina/VM separada. |

Decision tecnica:

- No instalar bot automatico todavia.
- Grabar manualmente con OBS y procesar en Audio IA.
- Mantener Speakr/Speaches como backend privado de transcripcion.
- Pasar a bot cuando haya al menos 10-15 reuniones mensuales que justifiquen
  mantenimiento y pruebas de plataforma.

Fuentes:

- OBS Studio: `https://obsproject.com/`
- OBS Application Audio Capture: `https://obsproject.com/kb/application-audio-capture-guide`
- Audacity WASAPI loopback: `https://manual.audacityteam.org/man/tutorial_recording_computer_playback_on_windows.html`
- screenappai/meeting-bot: `https://github.com/screenappai/meeting-bot`
- meetingbot/meetingbot: `https://github.com/meetingbot/meetingbot`
- Jitsi Jibri: `https://github.com/jitsi/jibri`

## Instalacion

Primero auditar:

```powershell
$env:VPS_HOST="187.77.16.63"
$env:VPS_USER="root"
# Set VPS_KEY_PATH or VPS_PASSWORD only in the current shell.
npm run audit:selfhosted
```

Instalar el primer perfil recomendado:

```powershell
npm run deploy:selfhosted -- --profile meeting-lite
```

Acceso por tunel:

```powershell
ssh -L 3107:127.0.0.1:3107 -L 3108:127.0.0.1:3108 root@187.77.16.63
```

En la PC de Sergio, usar el launcher canonico para mantener Supabase + Speakr +
Speaches:

```powershell
npm run onia-center:tunnels
npm run onia-center:tunnels:startup
```

`onia-center:tunnels:startup` instala el watchdog en el arranque del usuario de
Windows. Si la carpeta Startup esta bloqueada, el script cae al registro
`HKCU\Software\Microsoft\Windows\CurrentVersion\Run`.

Validacion en el VPS:

```bash
cd /opt/onia-selfhosted
docker compose --profile meeting-lite ps
curl -fsS http://127.0.0.1:3107 || true
curl -fsS http://127.0.0.1:3108/health || true
```

Instalar el perfil premium solo en un worker con GPU:

```powershell
npm run deploy:selfhosted -- --profile meeting-gpu
```

Requisitos de `meeting-gpu`:

- NVIDIA GPU y NVIDIA Container Toolkit;
- 16 GB RAM aprox.;
- `HF_TOKEN` en `/root/.hermes/.env`;
- aceptar terminos de los modelos pyannote requeridos por WhisperX ASR.

## Procesar audios de WhatsApp

Fase 1 recomendada: manual/semiautomatica.

1. Descargar o reenviar audio de WhatsApp a Telegram/Hermes.
2. Procesar archivo local:

```powershell
node scripts/procesa-audio-cliente.js --audio "C:\ruta\audio-whatsapp.ogg"
```

3. Revisar transcript y propuesta.

Fase 2: automatica oficial.

- Solo despues de tener WhatsApp Business API/Meta verificado o Chatwoot
  configurado.
- No automatizar WhatsApp personal con scraping de sesion.
- No enviar propuestas automaticamente sin revision humana.

## Variables y secretos

En `/root/.hermes/.env`:

```bash
OPENAI_API_KEY=...
# o:
TEXT_MODEL_API_KEY=...

# Solo meeting-gpu:
HF_TOKEN=...
```

El deploy remoto genera secretos de Speakr en `/opt/onia-selfhosted/.env`:

- `SPEAKR_ADMIN_PASSWORD`
- `SPEAKR_SECRET_KEY`

No pegar valores reales en docs ni en chat.

En `web-factory/apps/site/.env.local` o variables del deploy de Onia Center:

```bash
# Transcripcion open source por Speaches, con default local si el servicio corre
# en el mismo host o hay SSH tunnel activo.
ONIA_AUDIO_STT_BASE_URL=http://127.0.0.1:3108/v1
ONIA_AUDIO_STT_MODEL=Systran/faster-distil-whisper-large-v3
ONIA_AUDIO_STT_LANGUAGE=es
ONIA_AUDIO_STT_API_KEY=
ONIA_AUDIO_STT_FALLBACK_PROVIDER=openai
ONIA_AUDIO_STT_FALLBACK_MODEL=gpt-4o-mini-transcribe
ONIA_AUDIO_MAX_MB=100

# Analisis/propuesta por OpenAI mientras ONIA no migre el LLM a local.
OPENAI_ONIA_CENTER_API_KEY=...
ONIA_AUDIO_ANALYSIS_MODEL=gpt-4.1-mini
ONIA_AUDIO_MAX_OUTPUT_TOKENS=2600

# Solo para entornos controlados sin Supabase; no recomendado en produccion.
ONIA_AUDIO_INTELLIGENCE_ALLOW_LOCAL=false
```

Decision de costo:

- Transcripcion diaria: Speaches local/open source.
- Si Speaches o el tunel no responden: `gpt-4o-mini-transcribe` como fallback
  barato. Verificar pricing actual antes de presupuestar uso recurrente.
- Analisis/propuesta: `gpt-4.1-mini` por defecto, configurable con
  `ONIA_AUDIO_ANALYSIS_MODEL`. Subir a un modelo superior solo para propuestas
  grandes o decisiones de arquitectura/precio.

## PDFs de propuesta desde Audio IA

El boton `Generar PDF` en Onia Center usa una version imprimible del analisis de
Audio IA. La estructura sigue el piso visual del generador de propuestas:

- portada oscura con titulo grande;
- linea de acento por seccion;
- diagnostico comercial;
- calificacion del prospecto;
- alcance recomendado;
- entregables;
- fuera de alcance;
- precio y condiciones;
- plan de implementacion;
- datos faltantes;
- nota CRM;
- anexo con transcript.

Temas disponibles:

| Tema | Referencia interna | Uso recomendado |
|---|---|---|
| `Garabato` | `hermes-content/propuestas/propuesta-garabato.pdf` | ecommerce, catalogo, tienda, compra/orden. |
| `HSB Engineers` | `hermes-content/propuestas/propuesta-hsb-engineers.pdf` | industria, ingenieria, B2B tecnico, proyectos. |
| `Bench` | `hermes-content/propuestas/propuesta-bench.pdf` | agencia, marketing, autoridad creativa, portafolio. |
| `Lia` | `hermes-content/propuestas/propuesta-lia-albertengo.pdf` | salud, profesional independiente, confianza. |
| `AW` | `hermes-content/propuestas/propuesta-aw-climatizacion.pdf` | servicio tecnico, climatizacion, mantenimiento. |
| `Nuvia` | `web-factory/data/clients/nuvia.design.json` | ecommerce visual, catalogo amplio, skincare/producto. |
| `Bolivian Electric` | `hermes-content/propuestas/bolivian-electric-transformacion-ia-2026.pdf` | industrial, cotizacion B2B, operaciones. |
| `ONIA` | `hermes-content/brand/tokens.css` | IA, sistemas internos, automatizacion y consultoria general. |
| `Grigota` | pendiente de PDF o colores canonicos | tema provisional comercial/local hasta recibir referencia real. |

Regla: el PDF puede ser detallado, pero cada bloque debe ayudar a decidir,
vender, acotar alcance o registrar seguimiento. No llenar por llenar ni incluir
datos privados que no correspondan al cliente.

La version detallada del PDF incluye resumen ejecutivo, diagnostico, matriz de
calificacion del prospecto, decision recomendada, senales positivas, senales
rojas, alcance, entregables, fuera de alcance, precio/condiciones, plan de
implementacion, tareas sugeridas, datos faltantes, nota CRM y anexo de
transcript. Si falta una referencia real de marca, el tema debe quedar marcado
como provisional y no como canonico.

## Reglas de uso

- Avisar al inicio de la reunion: "Voy a grabar esta llamada solo para tomar
  notas y preparar mejor la propuesta. Si prefieren que no, lo hacemos sin
  grabacion."
- No grabar sin consentimiento.
- No subir audios sensibles a servicios publicos si el cliente no lo autorizo.
- El transcript puede fallar con ruido, acentos, nombres, marcas y terminos
  tecnicos. Toda propuesta debe revisarse.
- Audio IA debe calificar al prospecto antes de vender: buen cliente, dudoso,
  descartar o por verificar. Si faltan problema concreto, presupuesto,
  autoridad o urgencia, la salida recomendada es diagnostico/validacion antes
  de una propuesta grande.
- El boton `Generar PDF` produce una version imprimible de la propuesta interna.
  Usar `Guardar como PDF` en el navegador y revisar el archivo antes de enviarlo
  al cliente.
- Si Onia convierte esto en producto para terceros, revisar AGPL de Speakr y
  usar Speaches/WhisperX o licencia comercial si corresponde.

## Lo que falta decidir

1. Si el canal inicial sera upload manual en Onia Center, Telegram o WhatsApp
   Business API.
2. Politica de retencion: por defecto sugerido, borrar audio crudo a los 90
   dias y conservar transcript/resumen solo si es necesario para CRM.
3. Worker GPU + `HF_TOKEN` para pasar a `meeting-gpu` cuando Onia quiera
   diarizacion open source de mejor calidad.
