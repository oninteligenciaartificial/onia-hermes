# Round 20 - Mara motion control automation

Fecha: 2026-06-06
Estado: sistema interno, no publicado
Objetivo: replicar el flujo que Sergio probo en Higgsfield con video de
referencia, automatizando analisis, compresion, upload, costo, generacion,
descarga y QA para Mara.

## Input revisado

Archivo original de Sergio:

`C:/Users/HP I5 13va/Downloads/hf_20260606_135039_ff990687-85b8-46a1-a575-06816ac0f754.mp4`

Copia interna:

`video-ads/sergio-motion-reference-output-20260606/20260606-sergio-higgsfield-tiktok-motion-output.mp4`

Metadata:

```text
720x1280
28.266667s
30 fps
audio AAC stereo
bitrate aprox: 13.8 Mbps
```

Frames de analisis:

`video-ads/sergio-motion-reference-output-20260606/analysis-frame-01.jpg`
`video-ads/sergio-motion-reference-output-20260606/analysis-frame-03.jpg`
`video-ads/sergio-motion-reference-output-20260606/analysis-frame-05.jpg`

## Aprendizaje tecnico

El video que Sergio genero funciona mejor que los intentos anteriores porque no
solo anima una imagen: usa un video de referencia como motion guide. Transfiere:

- angulo de camara;
- inclinacion del torso;
- gestos de manos;
- giros de cabeza;
- timing de storytime;
- energia de hablar frente a camara;
- cambios de postura.

Problemas visibles:

- set tipo oficina, no luxury apartment;
- escote mas fuerte de lo ideal para pauta premium segura;
- riesgo de drift en boca y dientes;
- fondo y luz menos alineados con Mara premium;
- no debe usarse como publicable sin QA.

## Ruta automatizada descubierta

El primer intento de subir el MP4 completo fallo porque era pesado:

```text
48.7 MB
28.27s
13.8 Mbps
```

La solucion fue preprocesar cualquier referencia a un driving clip liviano:

```text
540x960
12s max
24 fps
sin audio
CRF 24
faststart
```

Ese clip se subio correctamente a Higgsfield:

```text
Upload ID: a839e72e-4ff0-4e44-b5f3-30088aaedf9c
URL: https://d2ol7oe51mr4n9.cloudfront.net/user_38ZdeEBSxQlcwfO6cjFGGPpE3Kz/a839e72e-4ff0-4e44-b5f3-30088aaedf9c.mp4
```

## Generacion V2 con Seedance

Modelo:

`seedance_2_0`

Job ID:

`5166dcf2-fba5-40d5-8bf0-31bf915ce58d`

Result URL:

`https://d8j0ntlcm91z4.cloudfront.net/user_38ZdeEBSxQlcwfO6cjFGGPpE3Kz/hf_20260606_142419_5166dcf2-fba5-40d5-8bf0-31bf915ce58d.mp4`

Archivos locales:

- `video-ads/sergio-motion-reference-output-20260606/20260606-mara-motion-reference-seedance-v2-final.mp4`
- `video-ads/sergio-motion-reference-output-20260606/20260606-mara-motion-reference-seedance-v2-visual-clean.mp4`
- `video-ads/sergio-motion-reference-output-20260606/seedance-v2-frame-01.jpg`
- `video-ads/sergio-motion-reference-output-20260606/seedance-v2-frame-03.jpg`
- `video-ads/sergio-motion-reference-output-20260606/seedance-v2-frame-06.jpg`

Validacion:

```text
720x1280
10.041667s video
24 fps
audio original generado removido en visual-clean
```

Resultado creativo:

- Si transfiere la postura inicial del reference.
- Si transfiere giro de cabeza, hombros y manos.
- Mantiene mejor el set de departamento.
- Mantiene vestuario mas seguro.
- Sigue necesitando QA humano de identidad/dientes antes de publicar.

## Fallbacks probados

### Cinematic Studio Video V2

Costo estimado: `15` creditos.

Resultado: fallo con HTTP 500 durante generacion.

Decision: mantener como fallback secundario, pero no como ruta principal por
ahora.

### Kling 3.0

Resultado: no acepta video input por CLI como driving video en esta combinacion.

Decision: usar Kling para animacion desde still o tomas generativas, no para
motion reference exacto via CLI.

### Seedance 2.0

Resultado: completado.

Decision: ruta principal automatizada para motion-control desde referencia local
preprocesada.

## Script creado

Archivo:

`scripts/mara_motion_control_pipeline.ps1`

Funcion:

```text
reference video local/autorizado
-> copiar a carpeta de run
-> ffprobe metadata
-> crear driving clip liviano 540x960, 12s, 24fps, sin audio
-> extraer frames QA
-> generar prompt Mara motion-control
-> subir clip a Higgsfield
-> estimar costo
-> opcionalmente generar Seedance/Cinematic
-> descargar resultado
-> remover audio generado
-> extraer frames QA del resultado
-> guardar run-manifest.json y README
```

Uso de estimacion:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/mara_motion_control_pipeline.ps1 `
  -ReferenceVideoPath "C:\path\to\reference.mp4" `
  -RunName "mara-motion-test" `
  -Model seedance_2_0 `
  -Duration 10 `
  -ReferenceSeconds 12 `
  -Estimate
```

Uso de generacion:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/mara_motion_control_pipeline.ps1 `
  -ReferenceVideoPath "C:\path\to\reference.mp4" `
  -RunName "mara-motion-test" `
  -Model seedance_2_0 `
  -Duration 10 `
  -ReferenceSeconds 12 `
  -Generate
```

Validacion del script:

Run:

`video-ads/motion-control-runs/20260606-validation-sergio-reference-v3/`

Resultado:

```text
upload_id: a6405832-a6f0-44a1-871a-26129f713cf2
cost: 22.5 credits
```

## Regla operativa para Sergio

Sergio no debe hacer produccion manual. El operador debe:

1. tomar un video local/autorizado como referencia;
2. correr el script;
3. revisar frames QA;
4. si pasa, generar;
5. si el resultado visual pasa, aplicar voz/lipsync;
6. registrar en README y no publicar sin aprobacion.

## Limite legal

El script no descarga TikToks automaticamente.

Motivo:

Si se copia exactamente el movimiento de una creadora real sin permiso, puede
haber riesgo de copyright, likeness/performance imitation y problemas de
plataforma. Los TikToks publicos se usan como estructura si no hay permiso. Para
motion-control exacto, usar video propio, licenciado o explicitamente
autorizado.

## Proxima accion recomendada

Convertir este script en watcher/n8n:

```text
carpeta inbox/motion-references
-> nuevo MP4
-> pipeline Estimate
-> si costo OK y permiso confirmado
-> pipeline Generate
-> Telegram envia preview y frames QA
-> Sergio aprueba/rechaza
```
