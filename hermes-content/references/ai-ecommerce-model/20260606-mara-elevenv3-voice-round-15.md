# Round 15 - Mara Eleven v3 voice draft

Fecha: 2026-06-06
Estado: borrador interno, no publicado
Herramienta: Higgsfield Audio
Modelo: Eleven v3
Voz/preset: Tallulah
Objetivo: crear audio exacto para lipsync palabra por palabra de Mara Vale.

## Guion usado

```text
Anoche casi borre este video. Me vi en la pantalla y pense: otra vez estoy
intentando gustarle a todos. Respire, no corregi nada, y entendi algo:
encontrarte empieza cuando dejas de editarte.
```

Nota: en la interfaz de Higgsfield se pego el guion con acentos. Esta ficha lo
guarda normalizado en ASCII para consistencia del repositorio.

## Archivo

Carpeta:

`audio/`

Archivo local:

`audio/20260606-mara-elevenv3-tallulah-storytime-v1.mp3`

Fuente generada:

`https://d8j0ntlcm91z4.cloudfront.net/user_38ZdeEBSxQlcwfO6cjFGGPpE3Kz/hf_20260606_042349_22de24d6-7a07-4274-a078-bbfb5ca585e1.mp3`

## Validacion tecnica

```text
Duracion: 17.28s
Bitrate: 128503 bps
mean_volume: -14.6 dB
max_volume: -1.7 dB
```

## Uso recomendado

Usar este MP3 como audio exacto para:

- lipsync dedicado;
- captions palabra por palabra;
- referencia de tono para Mara Voice v2;
- videos storytime de 15-20s.

## QA pendiente

- Escuchar manualmente pronunciacion y naturalidad.
- Transcribir con STT/Whisper antes de publicar.
- Comparar transcripcion contra guion exacto.
- Si el lipsync cambia el audio o altera palabras, rehacer.

## Decision

Tallulah queda como primera voz Eleven v3 usable para Mara. El siguiente paso es
generar o recibir un video con movimientos naturales y aplicar lipsync usando
este audio como fuente cerrada.
