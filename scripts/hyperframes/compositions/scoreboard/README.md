# Marcador de la serie — el ancla visual de los 155 días

Acá viven **dos piezas distintas** de la misma familia visual:

1. **El marcador** (esta primera mitad) — la placa chica de esquina que va
   encima del video en **todos** los clips de la serie.
2. **El tablero de objetivos** ([saltar ahí](#el-tablero-de-objetivos--la-tabla-grande-del-cierre))
   — la tabla grande con los 18 objetivos, que va **al final** del video
   semanal de YouTube y en el resumen de fin de semana.

---

## El marcador

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
| `accent`        | El verde de marca (`#00D26A`)                     | No cambiarlo                            |

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

# El tablero de objetivos — la tabla grande del cierre

El marcador de arriba dice **dónde vamos hoy**. El tablero dice **qué falta**:
las 18 filas del año, cada una con su meta, el valor de hoy y si está cumplida.
Va **al final del video semanal de YouTube** y en el resumen de fin de semana —
ocupa el cuadro entero, no es una placa de esquina.

Arriba lleva el contador general (**«7 de 18 cumplidos»**) y una barra que se
llena con esa fracción. De un vistazo se ve cuántas van.

|                      | Full (16:9)              | Full vertical (9:16)          |
| -------------------- | ------------------------ | ----------------------------- |
| Tamaño               | 1920 × 1080              | 1080 × 1920                   |
| Para                 | YouTube                  | TikTok · Reels · Shorts       |
| Cómo acomoda 18 filas| 2 columnas de 9          | 1 columna de 18               |
| Nombre en el comando | `ScoreboardFull`         | `ScoreboardFullVertical`      |

Muestras: [`muestra/objetivos-full.png`](muestra/objetivos-full.png) ·
[`muestra/objetivos-full-vertical.png`](muestra/objetivos-full-vertical.png).

## Paso 1 — Actualizar el tablero

Los datos salen de **`scripts/hyperframes/data/serie-objetivos.json`** (archivo
propio; el marcador sigue usando `serie-estado.json`).

Cada objetivo lleva **dos líneas**: cuánto va hoy y en qué estado está.

```json
  "clinicas": "12",
  "clinicasEstado": "progreso",
```

| Estado      | Cómo se ve                          | Qué significa            |
| ----------- | ----------------------------------- | ------------------------ |
| `cumplido`  | disco verde lleno con tilde         | listo, cuenta en «X de 18» |
| `progreso`  | anillo verde medio lleno            | arrancado, no terminado  |
| `pendiente` | anillo gris vacío (y la fila apagada) | sin empezar            |

- El estado se escribe **a mano**: no se deduce del número. Un valor que no se
  reconozca cae en `pendiente` — nunca inventa avance.
- También valen `hecho` / `listo` (= cumplido) y `en curso` / `en progreso`
  (= progreso). Mayúsculas y tildes dan igual.
- Los números van **sin puntos**: escribís `25000` y sale `25.000`.
- El valor de hoy puede ser texto (`"en trámite"`, `"4,2%"`, `"28-nov-2026"`).

**Las metas y los nombres de los objetivos NO están en el JSON**: son el
compromiso del año y viven dentro de la composición (`ROWS`, en el `<script>`).
Si cambia una meta, se cambia ahí — en los **dos** archivos, el `full` y el
`full-vertical`.

Las dos metas binarias (`NIT desbloqueado`, `Caja neutra personal`) dicen
**«hecho»** y no un tilde: las fuentes de marca vienen recortadas al alfabeto
latino y un emoji saldría como cuadradito vacío. El tilde de verdad es el que
está dibujado en la marca de estado, que es un SVG.

## Paso 2 — Generarlo

Para **YouTube**:

```bash
node scripts/hyperframes/render.mjs --comp ScoreboardFull --out .hermes/video-lab/objetivos/full --props-file scripts/hyperframes/data/serie-objetivos.json --duration 10
```

Para **TikTok / Reels / Shorts**:

```bash
node scripts/hyperframes/render.mjs --comp ScoreboardFullVertical --out .hermes/video-lab/objetivos/vertical --props-file scripts/hyperframes/data/serie-objetivos.json --duration 10
```

`--duration` son los segundos que se ve el tablero. **Son 18 filas para leer:
menos de 8 segundos no alcanza.** El default de la composición es 8; para el
cierre de un video de YouTube, 10-12 va mejor. Alargarlo no alarga la animación,
alarga el rato que se queda quieto.

Sale una carpeta de PNGs con fondo transparente, igual que el marcador — se pega
sobre el video con el mismo `ffmpeg` del Paso 3 de arriba.

## Por qué el tablero está diseñado así

- **Misma placa, mismos tokens, misma curva que el marcador.** Es la versión
  grande de la misma pieza, no un diseño nuevo.
- **Fila de dos líneas.** Arriba: estado + categoría + objetivo. Abajo: `meta X`
  a la izquierda y `hoy Y` a la derecha. Las dos líneas comparten la sangría de
  la marca y la categoría, así que `meta` y `hoy` quedan alineados en todas las
  filas: se lee como tabla, no como lista.
- **El estado se ve por forma Y por color**, y hay leyenda al pie. Las filas
  pendientes se apagan (texto en gris) para que las cumplidas salten.
- **En 16:9 van 2 columnas de 9.** A una sola columna cada fila quedaría de 38 px
  de alto y con 1.600 px de aire muerto al medio. En 9:16 al revés: el cuadro da
  1.530 px de alto útil, así que entran las 18 en una columna con 85 px por fila.
- **El verde es semántico**: marca lo cumplido y llena la barra de progreso. No
  se usa de adorno.

---

# Notas de diseño — lo que comparten las cuatro variantes

Notas para el que las toque en el futuro — no hace falta leerlas para usarlas.
Los ejemplos hablan del marcador, pero las reglas valen igual para el tablero.

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

Cada variante es un proyecto HyperFrames independiente, con su propia carpeta y
su propia copia de `fonts/`:

| Carpeta                  | Composición              | Qué es                    |
| ------------------------ | ------------------------ | ------------------------- |
| `scoreboard/vertical`    | `Scoreboard`             | marcador 9:16             |
| `scoreboard/horizontal`  | `ScoreboardWide`         | marcador 16:9             |
| `scoreboard/full`        | `ScoreboardFull`         | tablero de objetivos 16:9 |
| `scoreboard/full-vertical` | `ScoreboardFullVertical` | tablero de objetivos 9:16 |

```bash
cd scripts/hyperframes/compositions/scoreboard/full
npx hyperframes check      # lint + runtime + layout + motion + contraste
npx hyperframes preview    # Studio, para ver la animación
```

Las variantes de cada pieza **declaran los mismos campos**, así que si agregás un
dato (o cambiás una meta) hay que hacerlo en las **dos** y en el JSON.

Los `.woff2` se reparten desde `hermes-content/brand/fonts/build-onia-fonts.py`
(entradas `scoreboard/full` y `scoreboard/full-vertical`): **no se copian a
mano**, se regeneran. Si falta la carpeta, el render no falla — sale con una
fuente del sistema y **en silencio**.

Estado de los gates al construir el tablero (las dos variantes, `v0.7.85`):

```
Layout     0 issues across 9 sample(s)
Motion     0 errors, 0 warnings
Contrast   504/504 text checks pass WCAG AA
```

Verificado además con los 18 valores en su máximo (MRR `Bs 125.000 / USD 10.995`,
60.000 seguidores, 155 videos, fechas largas): mismos gates en verde y nada se
desborda — ver `muestra/prueba-ancho-objetivos-*.png`.

Queda un aviso (no error) de `composition_file_too_large`: el archivo pasa las
300 líneas contando los comentarios. Se deja así a propósito — las demás
composiciones de la casa llevan el mismo bloque de ayudantes y los comentarios
son la documentación del porqué.
