# Lote estilo nuevo · semana 12 → 16 de octubre (COTIZADO, NO GENERADO)

Pedido de la MADRE MARKETING, 11-oct. Los cinco carruseles de la semana (K4 v3, K8 v4, K7 v3, K2 v4, K6 v3) siguen con imágenes de arcilla, el estilo que Sergio Urcullo reemplazó el 8-oct por **foto en blanco y negro con un solo objeto en verde esmeralda** (`fotobn`, `diseno-contenido-onia`). Acá está qué láminas llevan imagen, el prompt de cada una y lo que cuesta. **No se generó nada** (saldo medido: 438,17 créditos, sin cambio). Generar lo aprueba Sergio Urcullo.

## Resumen

| Publica (La Paz) | Carrusel | Láminas con imagen | Imágenes | Costo |
|---|---|---|---|---|
| lun 12 16:00 | K4 v3 · 5 pruebas del bot | 1, 5, 6 | 3 | 3,0 cr |
| mar 13 16:00 | K8 v4 · Recuperar vs reconstruir el prompt | 1, 3, 4, 7 | 4 | 4,0 cr |
| mié 14 16:00 | K7 v3 · Carruseles por código | 1, 2, 4 | 3 | 3,0 cr |
| jue 15 16:00 | K2 v4 · Tu primera skill | 1, 3, 7 | 3 | 3,0 cr |
| vie 16 16:00 | K6 v3 · Las 2 listas del bot | 1, 2, 7 | 3 | 3,0 cr |
| | **Total** | | **16** | **16,0 cr** (saldo 438,17 → 422,17) |

**Tope pedido: 20 cr** = 16 + hasta 4 de reintentos (una imagen que salga con letras o con dos objetos verdes se regenera sola, 1 cr). El lote del 8-oct (12 imágenes con GPT Image 2.5) respetó «sin letras» en las 12; el riesgo real es el segundo objeto verde, no el texto.

## Qué se cotizó y qué no (dicho de frente)

- **Cotizado en vivo, sin crear trabajos:** 2 de las 16 imágenes (K4 láminas 1 y 5), con el conector de Higgsfield (`generate_image` con `get_cost: true`), `gpt_image_2_5`, 4:3, `quality medium`, `resolution 2k`: **1 crédito exacto cada una** (`credits_exact: 1`). Esos mismos parámetros dieron 1 cr/imagen el 8-oct.
- **Derivado, no cotizado una por una:** las otras 14. La tercera consulta de costo (K4 lámina 6) **la bloqueó el clasificador de permisos del entorno** («transacciones»), aunque `get_cost` no crea trabajos. **No la reintenté ni busqué rodeos.** El precio de un mismo modelo, calidad, resolución y aspecto no depende del texto del prompt, por eso el total es 16 × 1,0 = **16,0 cr**; pero es una cuenta, no 16 cotizaciones.
- **Para cerrarlo con cifra del CLI** (en la PC, no cuesta nada; la nube no tiene el CLI instalado): `node scripts/carousel_images.mjs --brief hermes-content/carousels/briefs/marca-personal/lote-estilo-nuevo/<k4v3|k8v4|k7v3|k2v4|k6v3>-imagenes.json --out <carpeta> --model gpt_image_2_5` **sin `--yes`** imprime el costo de cada lámina y el TOTAL. Con `--yes` genera.
- **Los 5 briefs cargan:** probados con un CLI de mentira que solo responde «1 credits» a `cost` y falla en cualquier otra orden (no puede generar): salen 3 + 4 + 3 + 3 + 3 = 16 láminas. La cifra de ese ensayo es el CLI de mentira, no un precio; sirve para comprobar el formato.
- **Aprobación:** son 16 cr, más de los ~5 del lote chico con permiso previo (CLAUDE.md, «Gasto»): **hace falta el sí de Sergio Urcullo al lote entero**, sin partirlo.

## Reglas del estilo (de `diseno-contenido-onia` y el lote del 8-oct)

- Modelo `gpt_image_2_5`, `--quality medium --resolution 2k`, 4:3 (el mismo aspecto que la arcilla: el layout `ilustrado` no cambia). Soul 2.0 no: inventó letras en 5 de 7.
- El script antepone «Black and white editorial photograph, soft natural light, real materials, clean uncluttered composition on a light grey seamless background,» y agrega al final «Everything is black and white except that one object, which is vivid emerald green. No letters, no numbers, no logos, no watermark, no interface, no people.» Cada prompt de abajo es **la escena + «X is the green object»**.
- Objetos sin nada impreso (sin tazas, cuadernos ni pantallas) y **sin texto en ninguna escena**: la tipografía la pone el código.
- Cada carrusel entra **entero o no entra**: no se mezclan fotos B/N y arcilla dentro de un mismo carrusel.

## Hallazgo del layout (medido hoy, gratis, con las fotos del 8-oct)

Probé una foto B/N del 8-oct en el layout `ilustrado` (`lote-estilo-nuevo/PRUEBA-LAYOUT-fotobn-verde-vs-blanco.png`):
- **Lámina blanca:** se ve bien. La foto se funde con el papel por la máscara radial y el objeto verde se lee.
- **Portada verde (la actual de las cinco):** el pack mezcla la imagen con `multiply` sobre el fondo, así que el gris se vuelve verde oscuro y el objeto verde pierde fuerza: queda turbio. **Propuesta: las cinco portadas pasan a `theme: blanco`** (con el badge «guía» y el título igual) cuando lleguen las fotos; el cierre sigue negro. Alternativa más cara: una opción `blend: normal` en el pack. Decisión de la madre.

## Detalle por carrusel

### K4 v3 · 5 pruebas del bot · publica lun 12 16:00 · 3 imágenes

| Lámina | Lámina dice | Prompt nuevo (escena) | Reemplaza | Cotización |
|---|---|---|---|---|
| 1 | «5 pruebas antes de activar tu bot de WhatsApp» | `Five smooth round pebbles lined up in a neat row on a grey surface. The last pebble in the row is the green object.` | `sergio-k4v2-cinco-pruebas-bot-20260929-s01-3f374e98.jpg` | ✓ en vivo (1,0 cr) |
| 5 | «Prueba 3: preguntale lo que no sabe» | `A black felt magician's top hat standing upright on a grey surface, with a thin black wand lying in front of it. The satin band around the hat is the green object.` | `sergio-k4v2-cinco-pruebas-bot-20260929-s05-b45bab76.jpg` | ✓ en vivo (1,0 cr) |
| 6 | «Pruebas 4 y 5: que avise a alguien» | `A metal referee whistle lying on a grey surface, with its black cord looped loosely beside it. The whistle is the green object.` | `sergio-k4v2-cinco-pruebas-bot-20260929-s06-764afdcb.jpg` | derivada (1,0 cr) |

Las demás láminas son de texto y no cambian. Brief de generación: `hermes-content/carousels/briefs/marca-personal/lote-estilo-nuevo/k4v3-imagenes.json`.

### K8 v4 · Recuperar vs reconstruir el prompt · publica mar 13 16:00 · 4 imágenes

| Lámina | Lámina dice | Prompt nuevo (escena) | Reemplaza | Cotización |
|---|---|---|---|---|
| 1 | «Sacá el prompt de una imagen: 2 caminos» | `A magnifying glass with a black handle lying on a grey surface next to a small empty black picture frame standing upright. The magnifying glass is the green object.` | `sergio-k8v3-recuperar-vs-reconstruir-20261001-s01-ae75c072.jpg` | derivada (1,0 cr) |
| 3 | «Un solo cuadro del reel mostraba el prompt» | `A long strip of blank black film with small round perforations along both edges, curving in a gentle wave across a grey surface, every square frame clear and empty. One single frame is the green object.` | `sergio-k8v3-recuperar-vs-reconstruir-20261001-s03-1fd716b5.jpg` | derivada (1,0 cr) |
| 4 | «Si no está: reconstruís y lo decís» | `A plain black jigsaw puzzle lying on a grey surface, almost complete, with one piece lifted just above its empty slot. The lifted piece is the green object.` | `sergio-k8v3-recuperar-vs-reconstruir-20261001-s04-ba4b46ca.jpg` | derivada (1,0 cr) |
| 7 | «Para comprobar: ponelas lado a lado» | `Two pears standing side by side on a grey surface, almost identical, the right one slightly rounder. The right pear is the green object.` | `sergio-k8v3-recuperar-vs-reconstruir-20261001-s07-e6c79aae.jpg` | derivada (1,0 cr) |

Las demás láminas son de texto y no cambian. Brief de generación: `hermes-content/carousels/briefs/marca-personal/lote-estilo-nuevo/k8v4-imagenes.json`.

### K7 v3 · Carruseles por código · publica mié 14 16:00 · 3 imágenes

| Lámina | Lámina dice | Prompt nuevo (escena) | Reemplaza | Cotización |
|---|---|---|---|---|
| 1 | «Carruseles por código en 5 pasos» | `A fanned stack of plain blank rectangular ceramic tiles on a grey surface, next to a small black wooden sculpting tool. The top tile is the green object.` | `sergio-k7v2-carruseles-por-codigo-20260929-s01-305cf3dc.jpg` | derivada (1,0 cr) |
| 2 | «La IA de imagen escribe mal» | `A black fountain pen lying flat on a sheet of plain white paper, its nib leaving a large uneven ink blot with a few scattered drops. The ink blot is the green object.` | `sergio-k7v2-carruseles-por-codigo-20260929-s02-723733b4.jpg` | derivada (1,0 cr) |
| 4 | «Paso 2: la IA pinta solo la imagen» | `A black wooden painter's palette with a thumb hole, holding round blobs of white and grey paint, with a clean paintbrush resting across it. One single blob of paint is the green object.` | `sergio-k7v2-carruseles-por-codigo-20260929-s04-a4074cda.jpg` | derivada (1,0 cr) |

Las demás láminas son de texto y no cambian. Brief de generación: `hermes-content/carousels/briefs/marca-personal/lote-estilo-nuevo/k7v3-imagenes.json`.

### K2 v4 · Tu primera skill · publica jue 15 16:00 · 3 imágenes

| Lámina | Lámina dice | Prompt nuevo (escena) | Reemplaza | Cotización |
|---|---|---|---|---|
| 1 | «Tu primera skill en 5 pasos» | `A single small seedling sprouting from dark soil in a plain pot on a grey surface. The seedling is the green object.` | `sergio-k2-primera-skill-20260929-s01.jpg (foto, no arcilla)` | derivada (1,0 cr) |
| 3 | «La description decide» | `A single large metal key lying diagonally on a grey surface, with a small black keyring. The key is the green object.` | `k2-img-s03-bc401bfc.jpg` | derivada (1,0 cr) |
| 7 | «¿Cuál hacer primero? La que repetís» | `A black wooden rubber stamp with a rounded handle standing upright on a grey surface, beside a neat row of identical round ink impressions on a sheet of plain white paper. The ink impressions are the green object.` | `sergio-k2v3-primera-skill-20261001-s07-4389d3f7.jpg` | derivada (1,0 cr) |

Las demás láminas son de texto y no cambian. Brief de generación: `hermes-content/carousels/briefs/marca-personal/lote-estilo-nuevo/k2v4-imagenes.json`.

### K6 v3 · Las 2 listas del bot · publica vie 16 16:00 · 3 imágenes

| Lámina | Lámina dice | Prompt nuevo (escena) | Reemplaza | Cotización |
|---|---|---|---|---|
| 1 | «Las 2 listas que tu bot necesita» | `Two plain white ceramic bowls side by side on a grey surface, one filled with dark coffee beans and one empty. The empty bowl is the green object.` | `sergio-k6v2-confirmado-por-confirmar-20260929-s01-c3bbe494.jpg (foto, no arcilla)` | derivada (1,0 cr) |
| 2 | «Te preguntan lo que no sabés» | `A clear glass crystal ball resting on a small black metal stand with short curved legs, on a grey surface. The crystal ball is the green object.` | `sergio-k6v2-confirmado-por-confirmar-20260929-s02-39466ff6.jpg` | derivada (1,0 cr) |
| 7 | «Solo sabe lo que vos le das» | `A black funnel sitting in the neck of a short plain white bottle on a grey surface, with a few small round beads dropping into the funnel. The beads are the green object.` | `sergio-k6v2-confirmado-por-confirmar-20260929-s07-e84146f4.jpg` | derivada (1,0 cr) |

Las demás láminas son de texto y no cambian. Brief de generación: `hermes-content/carousels/briefs/marca-personal/lote-estilo-nuevo/k6v3-imagenes.json`.

## Qué pasa después del sí de Sergio Urcullo

1. Generar por carrusel, **en el orden en que publican** (K4 primero: lun 12 16:00 La Paz = 20:00 UTC). Quién: la madre desde la PC con el CLI (`--yes`), o esta sesión con el conector si Sergio Urcullo autoriza generar por esa vía (la cotización por el conector ya fue bloqueada una vez).
2. Mirar cada imagen sola: sin letras, sin logos, **un solo objeto verde**, fondo gris claro. Si falla, se regenera solo esa (1 cr).
3. Poner las imágenes en el brief, pasar las portadas a `theme: blanco`, renderizar, mirar la hoja de contactos y recién ahí «LISTA PARA MOSTRAR».
4. La madre reemplaza en el VPS (hoy: K4 v3 y K7 v3 ya tienen sus archivos listos; las láminas de imagen se suman a los reemplazos de cada uno) antes de cada publicación de las 16:00.
5. **Si no llega el sí a tiempo** para un carrusel, sale en arcilla como está: no se mezcla ni se frena la serie.

Archivos de este lote: `LOTE-ESTILO-NUEVO-SEMANA-12-16.json` (las 16 imágenes con costo y qué reemplazan, mismo formato que `lote-14-imagenes.json`), `<k4v3|k8v4|k7v3|k2v4|k6v3>-imagenes.json` (entrada de `carousel_images.mjs`) y `PRUEBA-LAYOUT-fotobn-verde-vs-blanco.png`.
