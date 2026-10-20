# Handoff — taller «No pierdas clientes» (página /taller y carruseles)

> Escrito el 20-oct-2026 por la sesión «taller: estilo y piezas», al pausar todo menos Hermes (pedido de Sergio Urcullo vía la sesión Principal).
> Fuente única del taller: `hermes-content/docs/TALLER_31_OCT.md`. Esto es el estado del carril; el método está en las skills.

**Objetivo**
Que Sergio Urcullo eligiera el estilo de las piezas del taller y diera su OK (o pidiera cambios) a la página `/taller` y a 2 carruseles, mostrados con capturas.
**No cumplido del todo:** eligió el estilo («1 · Ficha del taller», 20-oct) y se le mandaron las capturas de la página y de los 2 carruseles; **falta su OK o sus cambios.**

**Qué quedó EN PRODUCCIÓN**
Nada. La página tiene `noindex`, no se publicó en Vercel y no se subió ningún carrusel.

**Qué quedó a medias, y dónde**
- Rama `claude/guiones-taller-cierre` (PR #256: https://github.com/oninteligenciaartificial/onia-hermes/pull/256), commits `53615b22` (medición de los referentes) y `d8938c87` (página + carruseles). Worktree de trabajo: `.claude/worktrees/agent-llm-orchestration-56e7cc` (rama local `claude/relaxed-spence-7edfb2`, empujada a la del PR).
- Página rehecha: `hermes-content/sitio-sergiourcullo/taller/index.html` (+ `img/campana.webp`). Esperando el OK.
- Carruseles rehechos: `hermes-content/carousels/ficha-taller/1-la-cuenta.json` y `2-que-te-llevas.json`, render con `node hermes-content/carousels/ficha-taller/generar.cjs <brief> <salida>`. Esperando el OK.
- Capturas listas (las vio Sergio Urcullo el 20-oct): `E:/onia-render/taller/ficha/pagina-390-tramos.png`, `sticky-bajando-390.png`, `taller-1440.png`; `E:/onia-render/taller/carrusel-1-la-cuenta/hoja.png` y `lamina-01..06.png`; `E:/onia-render/taller/carrusel-2-que-te-llevas/hoja.png` y `lamina-01..06.png`.
- Las piezas viejas (`/auditoria`, briefs `sergio-taller-*-20261017.json`) quedan sin tocar y sin publicar.
- Sergio Urcullo preguntó si acá se usaba «rae»: no hay skill con ese nombre; quedó sin aclarar qué quiso decir.

**Archivos y cambios**
- `scripts/disenio-pagina-medir.cjs`: mide una página pública (captura entera 390/1440 + letras, colores y botones del CSS computado).
- `hermes-content/references/video-intake/2026-10-20-diseno-paginas-referentes.md`: ficha de lo aprendido de las webs de Erik Taveras, Santiago Muñoz, tododeia, Gadzhi, Hormozi y Alkimia (estado «aplicado, falta OK»). Informes y capturas completos, fuera de git: `E:/onia-research/disenio-paginas/<referente>/`. Láminas de aprendizaje que vio Sergio Urcullo: `E:/onia-render/taller/aprender-webs/*.png`.
- `.claude/skills/onia-web-factory/SKILL.md` §«Página de venta de un taller»: las 8 reglas medidas. `.claude/skills/diseno-contenido-onia/SKILL.md`: estilo Ficha, generador y trampas.
- `hermes-content/galeria/fotos-bn/taller-20261020-{campana,celular,silla,delantal,bolsa}-*.jpg` + `galeria.json`: 5 fotos fotobn de Higgsfield, 5 cr (`gpt_image_2_5`).
- `hermes-content/docs/TALLER_31_OCT.md`: decisión de marca (marca personal: fotobn y voseo) y §8 con el estado nuevo.

**Intentos fallidos**
- Primeros bocetos de estilo (A foto / B chat / C cartel, `E:/onia-render/taller/estilos/estilos.png`): hechos sin medir las páginas de los referentes y solo con fotos de la PC. Sergio Urcullo los rechazó: «no aprendiste nada de eso». Con la medición salió `estilos-v2.png`.
- La paleta violeta y naranja que sugiere `ui-ux-pro-max --design-system` para «workshop» no sirve: choca con la marca. Solo se tomó la estructura (hero dominante, 1 botón, barra fija).
- Foto de Sergio Urcullo (`sergio-bn.jpg`) sobre fondo oscuro: queda un recuadro blanco. Va sobre claro.
- Carruseles con letra de 36 px: láminas medio vacías e ilegibles en el celular. Se subió a 40-46 px.
- `carousel_images.mjs` sin campo `n` en la lámina nombra los archivos `s-undefined`: hay que renombrarlos y corregir `galeria.json`.
- Las capturas `fullPage` dejan en blanco la foto `loading="lazy"` y muestran la barra fija pegada en el medio: hay que bajar por la página antes y esconder la barra en esa captura.

**Qué depende de Sergio**
1. OK o cambios a la página `/taller` y a los 2 carruseles (capturas de arriba).
2. Con su OK: autorizar la publicación de la página (sacar el `noindex`, deploy) y la subida de los carruseles, según `TALLER_31_OCT.md` §4. La apertura era el mié 21-oct.
3. Leslie Mercado Moreno: QR del BCP, titular y cómo se factura, y el texto de devolución (compuerta §3, condiciones 4 y 5).
4. Aclarar qué quiso decir con «rae».

**Próximos pasos**
1. Leer el OK o los cambios de Sergio Urcullo y aplicarlos. Listo cuando él aprueba con capturas nuevas a 390/1440 y las hojas de los carruseles.
2. Con su autorización explícita: sacar `noindex`, publicar `/taller` en Vercel, mirarla en vivo a 390 y 1440 y medir el peso y el tiempo de carga. Listo cuando está viva y mirada.
3. Bajar los PNG de los carruseles a su celular o agendarlos (carrusel 1 el día de apertura, carrusel 2 el vie 23, `TALLER_31_OCT.md` §4). Listo cuando él los sube.
4. Si cambia el escalón (pagos 15 y 35): actualizar la tarjeta del hero, «Precio por cupo» y la barra fija de la página.
