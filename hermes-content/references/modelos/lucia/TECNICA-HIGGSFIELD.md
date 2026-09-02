# Técnica Higgsfield — carril Lucía UGC

> Lo aprendido a los golpes con el CLI. Cada línea nace de una vuelta real del loop.

## Animar una imagen del banco (image → video)

- **`seedance1_5` es image-to-video vía `--start-image <path-o-id>`, NO `--image-references`.**
  `--image-references` es para los modelos de imagen. Para animar una foto va `--start-image`.
- **Costo medido 2026-09-02:** `seedance1_5` a **9:16 · duración 4 · 720p** = **4,8 cr** exactos
  (coincide con la tabla del corredor). El `generate cost` acepta los mismos flags que `create`,
  incluido `--start-image` con path local (lo sube solo para cotizar).
- Params reales del modelo (`higgsfield model get seedance1_5`): `duration` ∈ {4,8,12} (def 4),
  `resolution` ∈ {480p,720p,1080p} (def 720p), `aspect_ratio` def **16:9** → hay que pasar `9:16`
  siempre. `generate_audio` def true. `end_image` exige `start_image`.

## `--wait` vs. el timeout del shell (la trampa de esta vuelta)

- `higgsfield generate create ... --wait --wait-timeout 8m` **se corta a los 2 min** porque el
  timeout del shell del harness mata el proceso antes. **El job igual queda encolado.**
- Patrón que funciona: lanzar el create (aunque se corte), después **`higgsfield generate list
  --video --json`** y hacer polling por el `id` del job hasta `completed`/`failed`. Con un
  `timeout` de Bash largo el bucle de polling sí aguanta.

## Dónde queda el asset id de la imagen fuente

- En el JSON de `generate list --video`, `params.start_image` sale **`null`** (engañoso).
  El id real de la imagen subida está en **`params.medias[].data.id`** con `role: "start_image"`.
  Ése es el asset id que hay que anotar en el `LEEME.md` para re-referenciar sin re-subir.

## Verificar video = MIRAR frames

- `ffmpeg -ss <t> -i video.mp4 -frames:v 1 frame.jpg` en 4 tiempos (inicio/medio/fin) y **leer los
  JPG**. Un 200 del `curl` no es verificación. Chequear: cara idéntica cuadro a cuadro (que no
  morfee), que el movimiento pedido pasó, colores true-to-life, cero carteles legibles.

## Realismo — lo que anima bien

- **La "acción a medias" con dos manos sobre el mismo objeto** (tijera+mechón en G06) es el patrón
  que mejor anima: da un vector de movimiento claro y contenido, sin pedirle a la cara que actúe.
- El pedido de motion se mantiene sutil: micro-movimiento de cámara handheld + el gesto físico
  (tijera que cierra, ventilador que gira). Nada de "gira la cabeza y sonríe" — ahí se rompe la cara.
