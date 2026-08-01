# Marcador de la serie — el ancla visual de los 155 días

Es la placa que va en **todos** los videos de la serie documental
(1-ago → 31-dic-2026). Muestra siempre lo mismo: **DÍA 47 / 155**, el MRR, los
clientes y el runway. Eso es lo que convierte videos sueltos en una serie: el
que ve el día 47 entiende que hay un día 48, y que hay un final anunciado.

Los números **no están escritos en el diseño**: salen de un archivo que actualizás
vos, `scripts/hyperframes/data/serie-estado.json`.

|                      | Vertical                     | Horizontal            |
| -------------------- | ---------------------------- | --------------------- |
| Tamaño               | 1080 × 1920                  | 1920 × 1080           |
| Para                 | TikTok · Reels · Shorts      | YouTube               |
| Dónde cae en pantalla| arriba                       | abajo a la izquierda  |
| Nombre en el comando | `Scoreboard`                 | `ScoreboardWide`      |

Muestras para mirar antes de usarlo: carpeta [`muestra/`](muestra/).

---

## Paso 1 — Actualizar los números

Abrí `scripts/hyperframes/data/serie-estado.json` y cambiá los valores.
Es un archivo de texto: cambiá **solo lo que está después de los dos puntos**.

```json
{
  "dia": 47,
  "diasTotal": 155,
  "mrrBs": 8400,
  "mrrUsd": 739,
  "clientes": 6,
  "runwaySemanas": 9,
  "eyebrow": "155 DÍAS EN PÚBLICO",
  "accent": "#00D26A"
}
```

| Campo           | Qué es                                            | Ojo                                     |
| --------------- | ------------------------------------------------- | --------------------------------------- |
| `dia`           | Qué día de la serie es hoy (1-ago-2026 = día 1)   | Ver el truco de abajo                   |
| `diasTotal`     | Días totales de la serie                          | **No se toca**, siempre 155             |
| `mrrBs`         | MRR del mes en bolivianos                         | Sin puntos: `8400`, no `8.400`          |
| `mrrUsd`        | El **mismo** MRR convertido a dólares             | Sin puntos                              |
| `clientes`      | Clientes pagando hoy                              | Solo los que pagan, no los interesados  |
| `runwaySemanas` | Semanas de caja que quedan                        | Entero                                  |
| `eyebrow`       | El texto chico de arriba                          | En MAYÚSCULAS                           |
| `accent`        | El naranja de la marca                            | No cambiarlo                            |

**Los números van sin puntos ni comas.** Escribís `8400` y la placa lo muestra
como `Bs 8.400` sola (separador boliviano). Si escribís `8.400` también funciona:
lo imprime tal cual.

**Truco para no contar los días a mano** — pegá esto en la terminal y te dice qué
día es hoy:

```bash
node -e "console.log(Math.floor((Date.now()-new Date('2026-08-01T00:00:00'))/864e5)+1)"
```

---

## Paso 2 — Generar la placa

Un comando. Para **TikTok / Reels / Shorts**:

```bash
node scripts/hyperframes/render.mjs --comp Scoreboard --out .hermes/video-lab/overlay/vertical --props-file scripts/hyperframes/data/serie-estado.json --duration 6
```

Para **YouTube**:

```bash
node scripts/hyperframes/render.mjs --comp ScoreboardWide --out .hermes/video-lab/overlay/horizontal --props-file scripts/hyperframes/data/serie-estado.json --duration 6
```

Tarda unos 20 segundos y deja una carpeta llena de PNGs numerados
(`frame_000001.png`, `frame_000002.png`, …). Eso es la animación: fondo
transparente, listo para poner encima del video.

- `--duration 6` = **cuántos segundos se ve la placa**. La animación de entrada
  y la de salida no cambian; lo que se alarga es el rato que se queda quieta.
  Para que acompañe todo un TikTok de 45 s: `--duration 45`.
- Esa carpeta es material desechable: se regenera cuando quieras y **no se sube
  al repo** a propósito.

---

## Paso 3 — Pegarla sobre el video

```bash
ffmpeg -i ENTRADA.mp4 -framerate 30 -start_number 1 -i .hermes/video-lab/overlay/vertical/frame_%06d.png -filter_complex "[0:v][1:v]overlay=0:0:eof_action=pass" -c:a copy SALIDA.mp4
```

Cambiá `ENTRADA.mp4` por tu video y `SALIDA.mp4` por el nombre que quieras.
Para YouTube, cambiá `vertical` por `horizontal`.

Qué hace cada pedazo, por si algo falla:

| Pedazo                  | Para qué                                                        |
| ----------------------- | --------------------------------------------------------------- |
| `-framerate 30`         | Los PNGs son 30 por segundo. **Va antes del `-i`**, no después.  |
| `-start_number 1`       | El primer PNG es el `000001`. Sin esto ffmpeg no lo encuentra.   |
| `overlay=0:0`           | La placa ya viene ubicada en su lugar: se pega en la esquina.    |
| `eof_action=pass`       | Cuando la placa termina, el video sigue **sin** quedar congelada.|
| `-c:a copy`             | No re-comprime el audio.                                         |

**Si querés que la placa aparezca más tarde** (ej. a los 3 segundos), usá esta
variante en vez de la de arriba:

```bash
ffmpeg -i ENTRADA.mp4 -framerate 30 -start_number 1 -i .hermes/video-lab/overlay/vertical/frame_%06d.png -filter_complex "[1:v]setpts=PTS+3/TB[ov];[0:v][ov]overlay=0:0:eof_action=pass" -c:a copy SALIDA.mp4
```

(el `3` es el segundo en el que entra)

---

## Por qué está diseñada así

Notas para el que la toque en el futuro — no hace falta leerlas para usarla.

- **La placa es OPACA, no un rectángulo negro al 50%.** A media transparencia el
  contraste del texto depende de lo que haya atrás, y una pared blanca o una
  ventana lo arruinan. Con fondo sólido + filo de luz arriba + sombra proyectada,
  el texto siempre cae sobre el mismo color. Verificado quemándola sobre barras
  de color saturadas: se lee sobre rojo, verde, magenta y cian.
- **No es glassmorphism**: no hay `backdrop-filter` ni translucidez decorativa.
- **El contador se lee como fracción** (`47 / 155`), no como número héroe: el
  `/ 155` pesa dos tercios del `47`. El patrón "cifra gigante + etiqueta
  chiquita" está prohibido por las reglas de diseño de la casa, igual que la
  franja vertical de color en el borde y el texto con degradado.
- **La barra ES el acento.** El naranja carga significado (días quemados de 155),
  no es decoración. Es relleno sólido y no degradado: con `clip-path` lo visible
  es siempre el tramo izquierdo, así que un degradado pintaba la barra de color
  equivocado justo cuando menos avance hay.
- **Las tres lecturas tienen la misma estructura** (etiqueta / cifra / unidad) y
  el mismo rango. Es un tablero de instrumentos, no un dato importante con dos
  acompañantes.
- **Movimiento:** solo `transform`, `opacity` y `clip-path` — nada que toque
  layout. Curva `oniaOutExpo` (la `--ease-out-expo` de la marca), sin rebote.
  Arranca como un instrumento (la barra se llena, el día y el % tickean juntos,
  700 ms) y después **se queda quieta**: es un HUD que se lee mientras corre el
  video, y moverlo sería ruido sobre la narración.
- **Dónde cae:** en vertical va arriba y termina cerca del 25% de la altura, así
  que no tapa la cara (centro) ni los subtítulos quemados (~y 1250-1600) ni la
  UI de TikTok. En horizontal va abajo a la izquierda con 108 px de margen, que
  deja libre la barra de controles de YouTube.
- **Tipografía de marca autohospedada**: Bricolage Grotesque (máx. peso 700),
  DM Sans y Spline Sans Mono con `tabular-nums` en las cifras. Los `.woff2` están
  dentro de cada variante en `fonts/` y **no se copian a mano**: los reparte
  `hermes-content/brand/fonts/build-onia-fonts.py`. Si esa carpeta falta, el
  render no falla — sale con una fuente del sistema y **en silencio**.

### Editar el diseño

Cada variante es un proyecto HyperFrames independiente. Para trabajar una:

```bash
cd scripts/hyperframes/compositions/scoreboard/vertical
npx hyperframes check      # lint + runtime + layout + motion + contraste
npx hyperframes preview    # Studio, para ver la animación
```

Las dos variantes **declaran los mismos campos**, así que si agregás un dato hay
que agregarlo en las dos y en el JSON.

Estado de los gates al momento de construirla (las dos variantes):

```
Layout     0 issues across 9 sample(s)
Motion     0 errors, 0 warnings
Contrast   67/67 text checks pass WCAG AA
```

Queda un aviso (no error) de `composition_file_too_large`: el archivo pasa las
300 líneas contando los comentarios. Se deja así a propósito — las demás
composiciones de la casa llevan el mismo bloque de ayudantes y los comentarios
son la documentación del porqué.

---

# La tabla grande — `ScoreboardFull` (los 18 objetivos)

El marcador chico dice **dónde vamos hoy**; esta placa dice **contra qué**. Va al
final del episodio semanal de YouTube y en el resumen del domingo. 1920 × 1080,
dos columnas de nueve, y arriba el progreso (`X / 18` + barra).

|                      | Valor |
| -------------------- | ----- |
| Tamaño               | 1920 × 1080 |
| Nombre en el comando | `ScoreboardFull` |
| Datos                | `scripts/hyperframes/data/serie-objetivos.json` |
| Duración por defecto | 8 s (es para LEER, no para pasar) |

## Actualizar y renderizar

Editá `serie-objetivos.json`: cada objetivo tiene `cat` (la categoría),
`obj` (el objetivo), `meta` (a dónde hay que llegar), `hoy` (dónde estamos) y
`hecho` (`true` cuando se cumplió).

- Si `hoy` tiene texto (`"0"`, `"$0"`, `"—"`), la placa lo muestra tal cual.
- Si `hoy` está vacío (`""`), es un objetivo de sí/no y sale una **casilla**:
  vacía si `hecho` es `false`, tildada y en verde si es `true`.
- El `X / 18` y la barra se calculan solos contando los `hecho: true`.

```bash
node scripts/hyperframes/render.mjs --comp ScoreboardFull --out .hermes/video-lab/overlay/full --props-file scripts/hyperframes/data/serie-objetivos.json --duration 8
```

Se quema igual que el marcador chico (mismo ffmpeg, `eof_action=pass`), pero
suele ir **al final**: para que entre en el segundo 42, `-itsoffset 42` en la
entrada de la secuencia.

## Decisiones (para el que la toque)

- **Cero emoji.** Las fuentes de marca son subset latin: un `⬜`/`✅` sale tofu
  (la misma trampa del `≈` en el marcador chico). La casilla está dibujada en CSS
  y la categoría es texto en el verde de marca.
- **Dos columnas de nueve, no dieciocho seguidas.** A 1080 de alto, 18 filas
  seguidas obligan a achicar el texto hasta que deja de leerse en un video.
- **La cascada de filas se estira ~1.3 s a propósito.** Es una tabla para LEER, y
  además el gate de layout (`sweep_static`) rechaza una pieza cuyo reveal muere en
  el primer segundo y después queda congelada.
- **Entrada en Y desde abajo**, opacidad binaria y huecos que se achican
  (`cut-the-curve` §6). Después **se queda quieta**: nada de idle wobble.
- **Los datos viajan como JSON en una variable.** Las variables de HyperFrames son
  strings: `render.mjs` serializa objetos y listas, y la composición los parsea.
  Si el JSON viene roto, la placa sale vacía en vez de reventar el render.

Gates al construirla (mejor que las otras dos variantes, que arrastran un aviso):

```
Lint       0 errors, 0 warnings
Runtime    0 errors, 0 warnings
Layout     0 issues across 9 sample(s)
Motion     0 errors, 0 warnings
Contrast   115/115 text checks pass WCAG AA
```
