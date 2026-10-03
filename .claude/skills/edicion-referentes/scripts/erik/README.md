# Receta Erik Taveras: editor reutilizable

`erik_edit.py` recibe el bruto, el cutplan aprobado, el transcript corregido y un storyboard, y devuelve un MP4 de 1080×1920 a 30 fps.
Los tiempos salen de las palabras del transcript (re-alineadas) o de los cortes del cutplan. No se escribe ningún segundo a mano.
Receta medida el 3-oct-2026: subagentes, DevDay, EVOX2, Dots y Opus. Corregida el mismo día con el QA del video de prueba.

## Comando

```bash
# 0) Una vez por máquina: alineador local (gratis, ~40 MB). Sin esto usa los tiempos del transcript y lo avisa.
pip install --no-deps vosk cffi      # «srt» no compila en el contenedor: el script lo reemplaza con un stub
mkdir -p ~/.cache/vosk && cd ~/.cache/vosk && \
  curl -sSLO https://alphacephei.com/vosk/models/vosk-model-small-es-0.42.zip && \
  python3 -c "import zipfile; zipfile.ZipFile('vosk-model-small-es-0.42.zip').extractall('.')"

# 1) Pruebas reales (capturas de la doc y logos oficiales rasterizados). Una vez por video.
node capturar.mjs capturas-n03.json assets-ejemplo

# 2) Mirar cuadros sueltos e informe antes de renderizar (~30 s)
python3 erik_edit.py --bruto raw/bruto.mp4 --cutplan cutplan.json --transcript segments-cut.json \
  --storyboard storyboard-n03.json --salida out/video.mp4 --cuadros 1.5,12,40

# 3) Render completo con hojas de control (~3 min para 53 s)
python3 erik_edit.py --bruto raw/bruto.mp4 --cutplan cutplan.json --transcript segments-cut.json \
  --storyboard storyboard-n03.json --salida out/video.mp4 --hojas out/sheets [--trabajo DIR]
```

Banderas: `--sin-apretar` usa el cutplan tal cual (ni huecos ni frases), `--sin-vosk` no re-alinea, `--sin-recorte-cola` no corta la cola.
Necesita ffmpeg (libx264), Python con Pillow, numpy y opencv (YuNet), y Node con playwright-core y Chromium solo para `capturar.mjs`.
El modelo de caras se lee de `../../../editor-videos/assets/models/face_detection_yunet_2023mar.onnx`. El de Vosk, de `~/.cache/vosk/vosk-model-small-es-0.42` (o `ERIK_VOSK_MODELO`).
Las fuentes están en `assets-ejemplo/fuentes`: Anton, JetBrains Mono e Inter, todas OFL.

## Entradas

- **bruto**: el MP4 original. Cada cuadro de salida toma el cuadro del bruto que está a su mismo tiempo, así que el audio y el video no se desfasan.
- **cutplan**: `{"keep": [{"start", "end"}, …]}` en segundos del bruto: el corte que aprobó Sergio Urcullo.
- **transcript**: `{"words": [{"word", "start", "end"}, …]}` en tiempo de salida, ya corregido. Se quema tal cual, en mayúsculas; solo se corrigen los TIEMPOS.
- **storyboard**: JSON con `paleta` (`onia` para Sergio Urcullo; `erik` para medir contra el referente), `assets`, `firma`, `corte` y `eventos`. Mirá `storyboard-n03.json`.
  - `corte`: `hueco_max` (0,25 s) y `quitar` (frases enteras `{desde, hasta, por_que}`).
  - Disparadores: `{"palabra": "push", "n": 2}`, `{"palabra": "guardar", "fin": true, "desfase": 0.12}`, `{"corte": 3}` (el tercer límite del cutplan APROBADO, llevado al tiempo nuevo) o `{"t": 0}`.
  - Cada pieza se ancla a la palabra que la NOMBRA: entra 2 cuadros (0,067 s) después de su inicio real.
  - `sello`, `lamina` (layout G), `tarjeta` (`lista` —con `"mono": true` la fila es el comando real—, `flujo` o `estado`; `rotulo_der_color`; `apaga_subtitulos` va en true por defecto), `zoom`, `cta` (logo monocromo blanco dentro de la caja), `sfx`, `corte_ritmo` (un jump cut forzado).
  - `pantalla` (layout S): `grabacion` (la pantalla REAL grabada: `archivo`, `inicio`, `sincro: [{en, seg}]`, `recorte`, `encuadre`, y `piezas: [{rect, en, hasta, pastilla}]` para el contorno verde y la pastilla), o los mockups dibujados `terminal` y `codigo` cuando no hay grabación.

## Salidas en `--trabajo`

- `cutplan-erik.json` y `tabla-cortes.md`: el corte derivado (huecos apretados y frases quitadas), en segundos del bruto. **Se le muestra a Sergio Urcullo antes de publicar** (regla de oro).
- `informe.txt` si se redirige la salida: cortes cada 10 s, plano más largo, planos-flash, silencio más largo, tarjetas (duración y si tapan la frente), límites de los subtítulos, y cada ancla con su inicio real, el de Whisper y el desfase de la pieza.
- `vosk.json` y `caras.json`: cachés.

## Qué automatiza

- **Tiempo de palabra:** Vosk (Kaldi) + alineación con fusiones («.claude» = «punto clave», «arranca en» = «arranquen») + inicio llevado al fin del silencio real. Whisper erraba de −0,3 a +0,3 s.
- **Huecos:** silencio = 8 dB debajo del percentil 75 de la voz y sin fricativa (banda 3-8 kHz) por encima del piso. Una pausa de más de 0,30 s queda en 0,25 s (0,13 después + 0,12 antes). Un recorte chico (< 0,25 s) a menos de 0,9 s de otro corte no se hace: dejaría un plano-flash.
- **Audio:** cruce de igual potencia de 15 ms en cada empalme y room tone de la misma toma en los huecos del teléfono (12 dB debajo del piso). Después, pasa-altos, compresión, −14 LUFS, pico ≤ −1,5 dBTP.
- **Ritmo:** ningún plano de cámara pasa de 3,3 s; si pasa, jump cut en el mejor borde de frase (puntuación, pausa, nexo). En T reencuadra 1,00 ↔ 1,08; en S mueve el recorte 90 px, sin zoom.
- **Subtítulos:** centro del bloque en y 1427; dos líneas en 72 % y 76,5 %; nada debajo del 80 %. Activa de 1,00 a 1,08 en 3 cuadros. Se apagan con un fundido de 0,3 s mientras hay tarjeta.
- **Tarjetas:** banda de arriba si la barbilla cae debajo del 50 % (encuadre selfie); pecho (51-75 %) si se graba con los ojos al 30 %. Si una tarjeta releva a otra en el mismo lugar, la vieja no deja fantasma.
