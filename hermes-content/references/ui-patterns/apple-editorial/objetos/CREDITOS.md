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
