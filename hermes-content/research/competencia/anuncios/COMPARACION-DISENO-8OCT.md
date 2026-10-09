# Comparación de diseño de los anuncios — Onia contra los que sobreviven (8-oct)

> Pedido de Sergio Urcullo (8-oct): *«los diseños… demasiado básicos, se supone que podés mirar browser y todo,
> mejora tus trabajos»*. Se miró lo que hace la competencia **pieza por pieza** y se rehízo D1 y A2.
> Hojas para mirar: `_hojas/comparacion-390-8oct.jpg` (a 390 px, el tamaño del celular).

## Qué se miró y qué no

| Fuente | Qué | Límite |
|---|---|---|
| 22 anuncios de la competencia (capturados por la madre desde la PC el 1-oct) | Doctocliq (5 videos, el más viejo 78 d), CitaPro (3), Agenda en Día/AgendaClínica (4), NativeCode (2), Calendico, Dentalink, Ultrapack, Medizona, Eholo, Dt.Dental. Se vieron **todos los fotogramas** en hojas de contacto: `_hojas/*.jpg` | Son fotos del 1-oct: no se sabe cuáles siguen vivos hoy |
| Biblioteca de Anuncios en vivo | **No abre desde la nube** (HTTP 403 de Facebook, medido el 8-oct; no se rodea) | La madre captura más desde la PC con `PEDIDO-CAPTURAS.md` |
| Sitios de referencia de diseño (celular, 8-oct) | Jane, Weave, AgendaPro, SimplyBook, Fresha → `_hojas/referentes-heroes-celular-8oct.jpg`. Doctolib: Cloudflare no deja pasar | Son webs, no anuncios: sirven para nivel de diseño, no para rendimiento |

## Qué hacen los que sobreviven (y lo que D1 v4 NO hacía)

| # | Lo que hacen | Ejemplo visto | D1 v4 | v5 |
|---|---|---|---|---|
| 1 | **UN foco visual enorme** que se entiende en 1 s a 390 px (un número, una cara) | CitaPro: calendarios con **9 ✓ / 2 ✗** gigantes. Fresha: «671.451 citas hoy». Doctocliq: la cara a pantalla completa | ❌ Nada dominaba: titular, mecanismo, pantalla y tres tildes pesaban parecido | ✅ **«10:00» gigante** con el chip «Sin confirmar» (es el texto de la propia tarjeta) |
| 2 | **Una sola idea** por pieza | CitaPro: «Más citas confirmadas, menos ausencias» | 🟡 Una idea, pero con 3 tildes genéricas | ✅ Tres líneas: hora → «Onia le deja el mensaje listo» → «Usted lo aprueba y lo envía» |
| 3 | **Campo de color** que separa la pieza del feed (azul, violeta, oscuro) | AgendaClínica: violeta oscuro; Medizona: azul | ❌ Hoja clara, igual que cualquier plantilla | ✅ Panel de **tinta** `#0C110F` (paleta de la marca; sin degradados, que la marca prohíbe) |
| 4 | **Producto en grande, en capas**, no una captura pegada | AgendaPro (tarjetas de interfaz flotando), Agenda en Día (laptop + celular) | ❌ Recortes de 2 px de borde pisando la barra del navegador | ✅ La tarjeta real a 1,22× con dos marcas (mensaje y botón) y la leyenda «datos de ejemplo» |
| 5 | **Titular de dolor en lenguaje del dueño** | «Muchos mensajes, poco orden» · «Mi papá antes siempre llegaba tarde» | ✅ «Un paciente que no confirma es un sillón vacío» | ✅ Se mantiene (es lo mejor de v4) |
| 6 | **Una persona** | Los 7 de software que sobreviven (6 videos + 1 estático) | ❌ | ❌ **Sigue faltando.** Ver abajo |
| 7 | **Movimiento** (casi todos los que duran son video) | Doctocliq 78 d (persona → pantalla → dinero) | ❌ | 🟡 Video de 11 s con las mismas piezas reales (`anuncio-video.js`); no tiene persona |
| 8 | **Un CTA, sin precio en la pieza** | «AGENDA UNA DEMO» (CitaPro) | ✅ | ✅ «Escríbanos por WhatsApp» + «llamada de 20 minutos» |

**Lo que no se copia:** sus cifras («+3500 doctores»), sus testimonios, su identidad ni su texto.

## Lo que quedó (medido, con la cara al frente)

- **A1 v5 «Las 10:00»** y **A2 v2 «El saldo que nadie cobra»** (`carousels/out/ads/…a1v5-las-diez/` y `…a2v2-el-saldo/`):
  feed 1080×1350 y historia 1080×1920, de usted, con la marca de la web. El revisor de promesas da 0 en ambas.
- **Video de A1** (11 s, 9:16, sin audio, 0,66 MB): `…a1v5-las-diez/onia-platform-dental-meta-a1v5-las-diez.mp4`.
  El titular está desde el cuadro 0 (es lo que Meta muestra antes del play). Fotogramas: `_hojas/a1v5-video-fotogramas.jpg`.
- **Qué se ve a 390 px:** el titular, «10:00», el chip amarillo y el botón verde. **El texto interno de la pantalla no se
  lee** (es de 15 px en la captura); sirve como prueba de que existe, no como lectura. Lo mismo pasa con la pantalla de
  Agenda en Día y AgendaClínica: la competencia tampoco la hace legible.

## Lo que sigue mal (sin maquillar)

1. **No hay persona.** Es la brecha que más pesa y no se arregla con diseño. Opción barata, sin Higgsfield: Sergio Urcullo
   se graba 25 s con el celular vertical (guion abajo). Es **opcional** para la primera tanda.
2. **La captura es provisoria** (candidato del 30-sep, entorno local): hasta que haya cuenta demo no se puede decir
   «producción». El día que haya cuenta: que **la misma persona** salga en la agenda como pendiente a las 10:00 y en
   Pendientes con su mensaje (hoy la agenda y Pendientes son de capturas distintas).
3. **A2 no se sube** hasta que E-03 esté en ✅ (la propuesta de cobro nunca se vio funcionando).
4. **No se midió rendimiento**: sin gasto no hay cifras propias. Diseño más claro ≠ más conversaciones hasta que
   corra la prueba de US$ 56.
5. Es **diseño nuevo**: pasa por Sergio Urcullo (renderizado) antes de subir.

## Guion de 25 s con Sergio Urcullo (solo si él quiere)

Celular vertical, luz de ventana, sin música, subtítulos grandes en chip (como Doctocliq). Todo lo que dice sale del
catálogo §8: no «la IA escribe», no «detecta», no precio.

| s | Imagen | Dice (de usted) |
|---|---|---|
| 0–3 | A cámara, en el consultorio o la oficina | «Mañana a las diez tiene un paciente que no confirmó.» |
| 3–7 | Mismo plano | «Si nadie le escribe, ese sillón queda vacío.» |
| 7–17 | Grabación de pantalla de `/pending` (cuenta demo): tarjeta → mensaje listo | «Onia le deja el mensaje listo. Usted lo aprueba.» |
| 17–25 | A cámara | «Se lo muestro en una llamada de 20 minutos. Escríbame por WhatsApp.» |

## Cómo se rehace

```bash
node .claude/skills/onia-ventas-pauta/scripts/anuncio-render.js --brief hermes-content/carousels/briefs/ads/<brief>.json --out <dir>
node .claude/skills/onia-ventas-pauta/scripts/anuncio-video.js  --brief hermes-content/carousels/briefs/ads/<brief>.json --out <dir>
```
Plantilla `"plantilla":"bloques"` (hora · flecha · tile con anillos · leyenda · texto). Detalle en la skill
`onia-ventas-pauta` §4.2.
