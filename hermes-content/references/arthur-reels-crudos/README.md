# Reels crudos de Arthur — carpeta de entrada

Acá van los videos SIN EDITAR que graba Arthur para que el pipeline
`editor-videos` los procese.

## Cómo nombrar el archivo

```
arthur-<tema-corto>-<AAAAMMDD>.mp4
```

Ejemplos:
- `arthur-no-necesitas-ia-20260802.mp4`
- `arthur-5-clinicas-20260804.mp4`

## Reglas del archivo crudo

- Sin música, sin subtítulos, sin texto en pantalla, sin filtros, sin CapCut.
- Una sola toma continua (con "otra vez" en voz alta al repetir una frase).
- Vertical, cámara trasera, 1080p o 4K a 30fps.
- **NO enviarlo por WhatsApp** — recomprime y arruina la calidad.
  Usar cable, AirDrop, o Google Drive.

## Salidas

Los cortes, previews y exports finales quedan en subcarpetas por run:

```
arthur-reels-crudos/
  arthur-no-necesitas-ia-20260802.mp4      ← crudo
  runs/20260802-no-necesitas-ia/
    cut-plan.json                           ← tabla de cortes
    preview-360p.mp4                        ← preview para aprobar
    final-1080x1920.mp4                     ← export final
    RUN_SUMMARY.md
```

## Regla de oro (no saltear)

La **tabla de cortes + el preview en 360p se le muestran a Arthur ANTES**
de aplicar el corte definitivo. Nunca cortar a ciegas.

## Nota técnica

Transcripción: usar Speaches en el VPS (gratis), forzando
`Systran/faster-whisper-small`. El modelo distil del contenedor es
English-only y traduce el español. La transcripción local de HyperFrames
no corre en Windows (falta whisper-cpp).
