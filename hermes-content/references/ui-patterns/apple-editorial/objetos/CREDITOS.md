# Créditos de los objetos

Imágenes de stock con licencia libre para los layouts A/B/C del patrón
`apple-editorial`. **Nunca de Pinterest** — regla de la casa en
`hermes-content/carousels/CAROUSEL_SYSTEM.md`.

De Openverse se toma sólo **CC0 / dominio público**: en una lámina no hay lugar
para el crédito del fotógrafo, así que se usa lo que no exige atribuirlo. Aun así
se registra todo acá, que es lo que permite demostrar de dónde salió cada imagen.

| Objeto | Consulta | Fuente | Licencia | Autor | Origen |
|---|---|---|---|---|---|
| `cafe` | espresso cup coffee | openverse | CC0 | cogdogblog | https://www.flickr.com/photos/37996646802@N01/4169563191 |
| `reloj` | wrist watch | openverse | CC0 | Wonderlane | https://www.flickr.com/photos/71401718@N00/4810839332 |
| `cuaderno` | notebook paper | openverse | CC0 | Angelina Litvin | https://stocksnap.io/photo/notebook-paper-JLXDNN5BNE |
| `laptop` | laptop computer | openverse | CC0 | Image Catalog | https://www.flickr.com/photos/132795455@N08/17652700524 |
| `cafe2` | coffee cup isolated white background | openverse | CC0 | desconocido | https://www.rawpixel.com/image/5927628/photo-image-public-domain-free-forks |

---

## ⛔ Openverse quedó DESCARTADO como fuente (06-sep, medido)

Se probó primero porque **no pide llave** y funciona hoy mismo. No sirve para este patrón,
y la evidencia está en [`RECHAZO-openverse.jpg`](RECHAZO-openverse.jpg) — las cuatro
primeras búsquedas, miradas:

| Consulta | Lo que devolvió |
|---|---|
| `espresso cup coffee` | una laptop con stickers y un vaso de papel, escena desordenada |
| `wrist watch` | **dos monjes budistas** — matcheó metadata, no contenido |
| `notebook paper` | un lápiz y un sacapuntas |
| `laptop computer` | una MacBook con un cuaderno, escena desordenada |

Y con consultas de producto (`rolex watch isolated product`, `ceramic mug white background
studio`) devolvió **cero resultados**.

**Causa:** el subconjunto CC0 de Openverse es un archivo de fotos amateur, no una
biblioteca de fotografía de producto. Los layouts A/B/C necesitan objetos limpios y
aislados, que es exactamente lo que tienen Unsplash y Pexels.

**Qué falta:** las dos llaves gratuitas en el `.env` del repo (ya está en `.gitignore`).
El script las toma solo y cambia de fuente sin tocar código.
| `cafe` | espresso cup | unsplash | Unsplash License | Trent Erwin | https://unsplash.com/photos/flat-lay-photography-teacup-on-top-of-saucer-fKImVjUwkXc |
| `reloj` | wristwatch | unsplash | Unsplash License | Fashion Needles | https://unsplash.com/photos/a-stylish-rose-gold-watch-rests-on-a-display-55ZjBmoOH1U |
| `cuaderno` | notebook | unsplash | Unsplash License | Stylite yu | https://unsplash.com/photos/person-holding-green-covered-book-aKjAbP8DrMw |
| `celular` | smartphone | unsplash | Unsplash License | Rahul Chakraborty | https://unsplash.com/photos/smartphone-and-laptop-workspace-xsGxhtAsfSA |
| `reloj` | luxury wristwatch white background | unsplash | Unsplash License | Faraz Fayaz | https://unsplash.com/photos/a-black-minimalist-watch-with-a-leather-strap-3weffxf3mdk |
| `cuaderno` | closed notebook white background | unsplash | Unsplash License | MJH SHIKDER | https://unsplash.com/photos/white-printer-paper-on-white-surface-sWaBlk7OWrE |
| `cuaderno` | leather bound journal notebook | unsplash | Unsplash License | Beechmore Books | https://unsplash.com/photos/blue-and-brown-leather-tablet-case-ajSG_cVll_k |

---

## ✅ Unsplash funciona (06-sep, con llave viva)

Diferencia contra Openverse, mirada en `HOJA-unsplash.jpg`: fotografía de producto real,
limpia y recortable. Es la fuente del patrón.

**La consulta importa más de lo que parece.** Tres de las cuatro primeras salieron con
basura alrededor y hubo que reescribirlas:

| Primera consulta | Qué trajo | Consulta que sí sirvió |
|---|---|---|
| `wristwatch` | reloj sobre un cojín de exhibición | `luxury wristwatch white background` |
| `notebook` | cuadernos + una mano + una ramita + un busto de yeso | `leather bound journal notebook` |
| `closed notebook white background` | un **mockup de hojas en blanco**, no un cuaderno | ídem |

Regla: pedir el objeto **aislado** (`white background`, `product`) y MIRAR el recorte. Un
mockup y un objeto real pesan lo mismo en KB.

⚠️ `PEXELS_API_KEY` sigue con el placeholder. No hace falta —Unsplash alcanza— pero tener
las dos da más de dónde elegir cuando una consulta no rinde.

✅ **Pexels verificado el 06-sep** con una consulta de prueba (respondió con licencia
y autor). Las dos fuentes están vivas: si una consulta no rinde en una, se prueba en
la otra con `--fuente`.
| `mate` | yerba mate gourd bombilla | unsplash | Unsplash License | olga safronova | https://unsplash.com/photos/brown-ceramic-mug-on-white-textile-192yAV0NQno |
| `energetica` | energy drink can isolated | unsplash | Unsplash License | Prasanna Inamati | https://unsplash.com/photos/a-can-of-monster-energy-drink-on-a-table-_2NOzM8-9ag |
| `efectivo` | cash banknotes money isolated | unsplash | Unsplash License | Shamblen Studios | https://unsplash.com/photos/a-lot-of-money-sitting-on-top-of-a-green-surface-aCYnKTYgl0I |
| `efectivo` | dollar bills money | pexels | Pexels License | Sergei Starostin | https://www.pexels.com/photo/paper-dollar-bills-6590651/ |
| `energetica` | energy drink can | pexels | Pexels License | thiago japyassu | https://www.pexels.com/photo/closeup-of-an-open-can-18555421/ |
| `energetica` | red bull energy drink can | unsplash | Unsplash License | Emma Gasseau-Dryer | https://unsplash.com/photos/red-bull-neon-sign-glows-in-a-dark-interior-THWUVWsm0RE |
| `energetica` | red bull can | pexels | Pexels License | Sanket Sawale | https://www.pexels.com/photo/cans-of-red-bull-17423276/ |
| `energetica` | red bull can white background studio | pexels | Pexels License | Rubaitul Azad | https://www.pexels.com/photo/red-bull-can-against-white-background-17220088/ |
| `energetica` | red bull can | unsplash | Unsplash License | Emma Gasseau-Dryer | https://unsplash.com/photos/red-bull-neon-sign-glows-in-a-dark-interior-THWUVWsm0RE |
| `energetica` | red bull can white background studio | pexels | Pexels License | Rubaitul Azad | https://www.pexels.com/photo/red-bull-can-against-white-background-17220088/ |
| `transferencia` | mobile banking app phone hand | pexels | Pexels License | Tranmautritam | https://www.pexels.com/photo/digital-wallet-app-on-smartphone-6406691/ |
| `transferencia-b` | smartphone isolated white background | pexels | Pexels License | KATRIN  BOLOVTSOVA | https://www.pexels.com/photo/a-smartphone-with-blank-screen-on-white-surface-6373160/ |
| `transferencia-c` | credit card isolated | pexels | Pexels License | Marta Branco | https://www.pexels.com/photo/euro-coins-and-payment-cards-close-up-37125405/ |

## Rechazados — la celda «Transferencia» de founders-bo (07-sep)

Tres búsquedas en Pexels para reemplazar el dibujo por una foto, según el pedido de Sergio
Urcullo (*"las imágenes puedes usar simplemente pngs, mejor"*). Las tres fallaron, y el
motivo es de fondo: **una transferencia bancaria no tiene objeto físico que fotografiar**.
Quedan guardadas como evidencia de que se intentó, para que nadie repita la búsqueda.

| Archivo | Consulta | Por qué no sirve |
|---|---|---|
| `RECHAZO-transferencia-google-wallet.png` | "mobile banking app phone hand" | Una mano con **Google Wallet** en pantalla: marca ajena que la pieza no nombra, y que ni siquiera opera en Bolivia. Sería un error factual visual |
| `RECHAZO-transferencia-celular-vacio.png` | "smartphone isolated white background" | Un celular con la pantalla en blanco. No comunica nada |
| `RECHAZO-transferencia-monedas-euro.png` | "credit card isolated" | Monedas de **euro** sobre tarjetas, sin recortar y sobre fondo negro |

La celda pasó a **squircle** (azul de banca, flechas de ida y vuelta), que además es más
coherente: en su misma fila USDT ya es squircle, y en la de arriba lo son Claude, ChatGPT y
Gemini. Cuatro de las nueve celdas ya lo eran — la que desentonaba era ésta.
Autoría de las tres: Pexels License — Tranmautritam, KATRIN BOLOVTSOVA, Marta Branco.
