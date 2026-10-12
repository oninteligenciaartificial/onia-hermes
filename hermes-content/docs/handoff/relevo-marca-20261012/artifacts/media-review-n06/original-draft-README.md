# BORRADOR, no es master · N06 · Gemini CLI se apagó, llega Antigravity

Molde: Santiago «noticia con tarjetas» (`edicion-referentes/scripts/santiago/`). 45,5 s, 1080x1920, 30 fps.
Armado sobre el corte **PROPUESTO** (`../cutplan.json`, 19 bloques, 45,5 s), todavía **sin el «ok cortes»** de Sergio Urcullo.
Si el corte cambia, se rehace con un solo comando. No se publicó ni agendó nada.

## Rehacerlo con un comando

```bash
bash /home/user/onia-hermes/videos/marca-personal/2026-10-11/n06-antigravity/borrador/rehacer.sh
```

Con el corte aprobado y el bruto (los tres argumentos son opcionales; el día del master sumar `RECAPTURAR=1`):

```bash
RECAPTURAR=1 bash .../n06-antigravity/borrador/rehacer.sh <cutplan-aprobado.json> <bruto.mp4> <carpeta-de-trabajo>
```

Hace, en orden: `armar-transcript.py` (transcript corregido en tiempo de salida) · `santiago-cv5.py --plan` (guarda `plan.txt`) ·
render completo con **`--sin-aire`** (regla 15 manda sobre el aire del molde) · `silencedetect -35dB d=0.3` (debe dar 0) · 360p liviano.
El 1080x1920 queda en la carpeta de trabajo (`video.mp4`, `sheets/`, `work/`), **no en el repo**.

Equivale a estos dos comandos de fondo (el segundo es el de la tarea):
```bash
python3 armar-transcript.py --transcript ../transcript-whisper-small.json --cutplan ../cutplan.json \
  --arreglos arreglos.json --extra dudosas-extra.json --out segments-cut.json --dudosas palabras-a-confirmar.txt
python3 santiago-cv5.py --bruto <bruto> --cutplan ../cutplan.json --transcript segments-cut.json \
  --storyboard storyboard.json --out <S>/video.mp4 --sin-aire        # + --plan, o --fotos 0.5,6,14,24,33,43
```
`santiago-cv5.py` es `santiago.py` sin tocar (ver «Trampas»): hace falta porque este Python trae OpenCV 5.0, que ya no tiene Haar.

Tiempos medidos hoy (4 CPU): transcript <1 s · capturas oficiales (9 páginas + 2 logos) 28 s · primera pasada, que analiza el bruto
(saltos, cara por toma, voz), 28 s y queda en `work/` · `--plan` ya con caché 3 s · **render completo 81 s y 121 s** (dos corridas, la
máquina estaba compartida) · silencedetect <1 s · 360p 8 s. Pipeline entero desde cero ≈ 2 min 15 s.

## Si el corte cambia, o se agrega / saca un bloque

- Lo que se recalcula solo: `segments-cut.json` (palabras por bloque `keep`, restando el corrimiento acumulado), `plan.txt`, render.
  Los `arreglos.json` se aplican por texto, así que siguen valiendo; el corrimiento de bordes (`pad`) no pide tocar nada.
- Lo que depende del corte es el **storyboard**: cada escena se dispara por una frase real, y `"corte": true` la pega al límite
  del corte más cercano (hasta 0,45 s antes de esa palabra). Consecuencias:
  - **Sacar un bloque:** las escenas cuya frase ya no está hacen que `santiago.py` aborte con «el storyboard pide «frase» y no está en el
    transcript». Se borra o reescribe esa escena. Mapa bloque → escenas: B1 `gancho, no-fue, plazo, cambio, quien` · B2 `usaban, app,
    gratis, comando, comando-win` · B3 `migrar, migrar-extensiones, migrar-traer` · B4 `skills, mover` · B5 `cta-cara, cta, cta-link`.
  - **Agregar un bloque** (o devolver un hueco que hoy se tira): sus palabras entran a los subtítulos, pero sin escena el apoyo anterior se
    queda en pantalla. Hay que escribir la escena con su frase. Si el audio es nuevo, transcribirlo (faster-whisper small, el mismo modelo)
    y reemplazar `../transcript-whisper-small.json`; lo dudoso nuevo va a `arreglos.json` / `dudosas-extra.json`.
  - **Un corte que ya no cae en la pausa** de antes de una frase con `"corte": true` imprime «pide corte y no hay corte ni salto…»: el
    cambio de panel queda a media frase y puede verse el salto de la cara. Mirar «a la vista» en `plan.txt`.
  - **Pausas largas devueltas** (los 2,9 s de aire muerto de los empalmes B2→B3, B3→B4, B4→B5): con `--sin-aire` el molde igual recorta
    los silencios de más de 0,56 s en un empalme, pero uno que quede dentro de una toma sale como «⚠ pausas > 0,56 s» y rompe la regla 15.
    El paso 4 de `rehacer.sh` lo cuenta.
- Si cambia la duración, la prueba en pantalla a ≤0,9 s y los 3 zooms se vuelven a comprobar en el `plan.txt` nuevo.

## Medido (render final)

| Qué | Resultado |
|---|---|
| **Regla 15**, `silencedetect noise=-35dB d=0.3` sobre el audio del render | **0 silencios** (a d=0,2: 4 pausas de 0,20-0,23 s en 8,58 · 18,22 · 19,63 · 35,21 s; a −45 dB d=0,3: 0) |
| Pausa más larga medida por el molde (voz del bruto en la salida) | 0,19 s (piso p1 −63,5 dBFS) |
| Audio | −13,2 LUFS · TP −1,6 dBFS · LRA 2,2 (receta −13 ±0,5; LRA 2,3-3,4: queda 0,1 por debajo) |
| Duración / ritmo | 45,50 s (receta 65-120 s: no se estira) · 3,10 palabras/s (receta 2,65-3,2) |
| Layouts | 7 cambios (1,54 por 10 s; receta 0,75-2,1) · split 76 % · cara 10 % · lámina 14 % · tramo sin cara máx. 4,1 s |
| Gancho | primera palabra a 0,12 s, subtítulo a 0,12 s, captura oficial en el cuadro 0 |
| Elementos nuevos | 36 (7,9 por 10 s; receta 6-9) · 3 golpes de zoom (receta 1-3) |
| Cortes «a la vista» (sin cambio de panel) | 3 de 18: **22,58 · 26,89 · 30,50 s** (pausas de 0,09-0,31 s sacadas dentro de una toma). Mirados antes/después: la cara no se mueve; cambia el gesto de la mano |
| Saltos internos del bruto | 28,2 · 38,57 · 50,77 s: los tres caen en tramos que el corte tira, no aparecen |

Faltan al molde: el **remate** de 3-10 s antes del CTA y la despedida (necesitan toma nueva; no se arman con palabras de otra frase) y el
«algo cambia cada 3-5 s» da 2,1 s porque el corte propuesto ya tiene un empalme cada ~2,4 s.

## Capturas oficiales (sacadas el 11-oct-2026, 03:26-03:29 hora La Paz = 07:26-07:29 UTC, `capturar.mjs`, proxy de la sesión, TLS intacto)

| Archivo (`capturas/`) | URL | Qué se ve y dónde se usa |
|---|---|---|
| `gem-aviso.png` | https://geminicli.com/ | Cartel verde «Unpaid tier and Google One users: Gemini CLI was replaced by Antigravity CLI on June 18th, 2026. To learn more, see our blog post.» · gancho 0-2,2 s |
| `blog-plazo.png` | https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli | «Important timeline for Consumers»: «On June 18, 2026, Gemini CLI and Gemini Code Assist IDE extensions will stop serving requests for Google AI Pro and Ultra, as well as those using it free of charge using Gemini Code Assist for individuals.» · 4,0-7,1 s y 9,4-13,3 s |
| `blog-titulo.png` | (misma) | Título «Transitioning Gemini CLI to Antigravity CLI», fecha MAY 19, 2026 (Dmitry Lyalin, Taylor Mullen) y la imagen oficial con los dos íconos · 7,1-9,4 s |
| `ag-inicio.png` | https://antigravity.google/ | «Download on Desktop · Available on macOS, Windows, Linux, and Googlebook» · 15,5-18,3 s |
| `ag-precio.png` | https://antigravity.google/pricing | «For Individuals $0/month · Experience Antigravity without a subscription plan» (Generally Available) · 18,3-20,6 s |
| `ag-instalar-unix.png`, `ag-instalar-win.png` | https://antigravity.google/docs/cli/install/ | `curl -fsSL https://antigravity.google/cli/install.sh \| bash` y `irm https://antigravity.google/cli/install.ps1 \| iex` · 20,6-23,7 s |
| `ag-migracion-inicio.png` | https://antigravity.google/docs/cli/gcli-migration/ | «First-launch onboarding»: al correr `agy` por primera vez, «An interactive checklist prompts you to choose which assets to migrate»; «Auto-conversion: Select the extensions and global configurations you want to convert» · 23,7-31,1 s |
| `ag-migracion-skills.png` | (misma) | Tabla «Updated skills paths» (workspace `.gemini/skills/` → `.agents/skills/`) y la nota «Action required… you must manually rename or relocate the folder» · 31,1-36,0 s |
| `logo-gemini.png`, `logo-whatsapp.png` | `hermes-content/references/brand-logos/` | Logos oficiales en SVG, rasterizados; no se recreó ninguno. El logo de Antigravity sale de la propia captura de su página |

Todos los textos en pantalla son palabras de Sergio Urcullo pasadas a voseo («Descargate la app», «Con estos comandos», «Arrastralas a su nueva
carpeta»…) o lo que dice la página capturada (cada cifra, fecha y ruta). Cierre **sin palabra**: no hay «Buscá ANTIGRAVITY».

## Página vs. dicho (dato a contrastar)

Sergio Urcullo dijo: «le pasó a quien lo usaba gratis o de pago en planes Pro o Ultra». En pantalla va lo que dice la página, y los subtítulos
llevan lo que dijo él.

- **El blog oficial (19-may-2026) lo respalda:** el 18 de junio de 2026 Gemini CLI y las extensiones de Gemini Code Assist «stop serving
  requests for Google AI Pro and Ultra, as well as those using it free of charge using Gemini Code Assist for individuals». Fecha, «gratis»,
  «Pro» y «Ultra» coinciden con lo que dijo. Por eso la tarjeta dice «Gratis, Pro o Ultra» con la captura marcada.
- **El cartel de geminicli.com usa otra redacción:** «Unpaid tier and Google One users». No contradice, pero no es la misma frase; no se
  afirma que «Google One» equivalga a «Google AI Pro/Ultra» porque ninguna página lo dice. El cartel aparece en el gancho sin marcar esa parte.
- **Lo que la página agrega y el video no dice:** para clientes empresa (licencias Code Assist Standard o Enterprise) el acceso no cambia, y
  «Gemini CLI will remain accessible via paid Gemini and Gemini Enterprise Agent Platform API keys». No se puso en pantalla porque Sergio
  Urcullo no lo dijo; si quiere acotar «de pago», tiene que decirlo él o sumar una captura.
- **«Skill local»:** la página separa dos rutas. Las de proyecto (`.gemini/skills/` → `.agents/skills/`) exigen moverlas a mano («Action
  required»); las globales pasan de `~/.gemini/skills/` a `~/.gemini/antigravity-cli/skills/` y la página no pide moverlas a mano. La escena de
  «mover a su nueva carpeta» muestra solo el par de proyecto. **Confirmar con él a cuál se refería.**
- «Los planes gratuitos»: la página dice $0/month con «Basic weekly rate limits»; la tarjeta muestra $0/month, sin prometer más.

## Palabras a confirmar con el audio (segundo del BRUTO)

Los subtítulos NO llevan `[?]`; llevan la mejor lectura. Lista generada en `palabras-a-confirmar.txt`.

| Bruto (s) | Whisper oyó | Subtítulo dice | Duda |
|---|---|---|---|
| 6,22-6,98 | lo pagó | lo apagó | ¿apagó? |
| 17,60-18,22 | descarate | descargate | ¿descargate? |
| 45,76-46,88 | carpeta de Ains | carpeta de skills | ¿skills? |
| 15,18-17,12 | Sol, de los que lo usaba | Y los que lo usaban | la más dudosa: Whisper oyó «Sol» + pausa de 0,26 s + «de los»; la otra pasada sin prompt oyó «So de los que lo usaba». Escuchar 15,2-16,2 s. En pantalla sale «Los que lo usaban» (full face, 13,4-15,5 s) |
| 29,92-30,58 · 31,86-33,38 · 34,28-35,58 | lo haces · marcas · marcas | igual | ¿«hacés / marcás»? Whisper dejó tuteo; el resto del video es voseo |
| 45,10-45,66 · 47,20-47,92 | entras · arrastras | igual | ¿«entrás / arrastrás»? |
| 0,00-1,96 | Si tu Gemini CLI | igual | la pasada sin prompt oyó «Geminis CLI»; se lee «Gemini CLI» |

Tiempos por palabra: son los de Whisper small, no alineación forzada. Se ajustaron a la voz (ni empiezan ni terminan dentro de un silencio
medido: 17 bordes) pero palabras largas siguen con tramos cortos (p. ej. «simplemente» 0,14 s a 15,47 s). El karaoke puede ir unas
centésimas corrido. Para el master conviene alinear de nuevo o corregir a mano.

## Trampas y decisiones de este borrador

- **`santiago.py` revienta en este Python** (`cv2` 5.0.0: ya no existe `CascadeClassifier` ni los haarcascades). No se tocó. `santiago-cv5.py` lo
  corre con `runpy` y mete un detector de cara con la misma interfaz, hecho con `cv2.FaceDetectorYN` y el modelo YuNet que ya está en el repo
  (`editor-videos/assets/models/`), con los ojos tomados de los landmarks. Si el OpenCV tiene Haar, no parchea nada.
- **Rojo:** no hay terracota ni rojo de diseño, pero los tres puntos del marco de navegador que dibuja el molde (`marco_navegador`, línea 303 de
  `santiago.py`) incluyen `#FF5F57`. Y el subtítulo activo es amarillo `#FDC82F` (receta de septiembre; la variante «noticia con tarjetas»
  pide verde y a 83-85 %). Cambiar cualquiera de las dos cosas pide tocar `santiago.py`.
- **`capturar.mjs`:** `ancla` toma la primera coincidencia visible, y en los docs de Antigravity el índice «On this page» tiene el mismo
  texto que el título: el recorte salía desde arriba de todo. Se anclaron a un párrafo único debajo de cada título (con `margen`). Además
  `capturas.json` se escribe solo al final: cualquier error de una captura obliga a repetir las nueve (28 s).
- `Error closing file: Broken pipe` en `render.log` es el ffmpeg que decodifica el bruto, cerrado al terminar; el video se verificó
  (`ffmpeg -i video.mp4 -f null -` sin errores, 1365 cuadros = 45,5 s).
- Las etiquetas y títulos usan solo palabras suyas; la URL del marco se acorta al dominio (la barra del molde corta las largas).

## Archivos

`storyboard.json` · `segments-cut.json` · `plan.txt` (control de `--plan`) · `capturas/` (PNG + `capturas.json`) · `cuadro-0N-tXX.jpg` (6 cuadros
del render final) · `BORRADOR-no-es-master-360p.mp4` (1,2 MB) · `armar-transcript.py` · `arreglos.json` · `dudosas-extra.json` ·
`palabras-a-confirmar.txt` · `santiago-cv5.py` · `rehacer.sh`. El render a 1080x1920 y la hoja de control (`sheets/`, 2 fps) quedan en la carpeta de trabajo.

