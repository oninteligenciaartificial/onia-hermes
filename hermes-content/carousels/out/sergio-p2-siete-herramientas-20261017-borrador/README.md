# P2 · «7 herramientas. 4 son gratis.» — borrador (11-oct-2026)

Carrusel 4:5, 10 láminas, pack `referentes`, cuenta `sergio`. **Nada publicado ni agendado.** Sale el sáb 17-oct (16:00 IG · 16:01 LinkedIn · 16:02 TikTok). Spec: `hermes-content/docs/cola/plan-3-semanas/GRABAR-10-16-OCT.md` §P2.

| Qué | Dónde |
|---|---|
| Brief principal | `hermes-content/carousels/briefs/marca-personal/sergio-p2-siete-herramientas-20261017.json` |
| Hermano con la lámina 6 en plan B (es lo único que cambia, más el `title`) | `…/sergio-p2-siete-herramientas-20261017-planB.json` |
| Render principal / plan B | `hermes-content/carousels/out/sergio-p2-siete-herramientas-20261017-borrador/` · `…-planB-borrador/` (cada una con `slide-NN.png`, `jpg/`, `_contactsheet.png`) |
| Capturas y marcadores | `hermes-content/carousels/briefs/assets/p2-herramientas/` |
| Caption (solo el texto publicable) | `caption.txt`, en esta carpeta |

## 1. Estado de las 10 láminas

| # | Layout · tema | Imagen | Estado |
|---|---|---|---|
| 01 | `logos` · verde | ninguna (solo los 7 nombres; «pago» va dentro del `label`) | **Real** (texto). Título en 2 líneas, medido |
| 02 | `captura` · blanco | `PENDIENTE-02-sesiones.png` | **Marcador pendiente** |
| 03 | `captura` · blanco | `PENDIENTE-03-codex-tarea.png` | **Marcador pendiente** |
| 04 | `captura` · blanco | `04-hyperframes-intro-20261011.png` | **Real**: líneas 6-7 y 94-103 de `intro.html` + cuadro de la composición a 1,2 s |
| 05 | `captura` · blanco | `PENDIENTE-05-buffer-cola.png` | **Marcador pendiente** |
| 06 | `captura` · blanco | `PENDIENTE-06-n8n-ejecuciones.png` (plan B: `PENDIENTE-06B-n8n-inicio.png`) | **Marcador pendiente**; además **bloqueada por el OK de Sergio Urcullo** |
| 07 | `captura` · blanco | `07-whisper-palabras-20261011.png` | **Real**: 14 palabras y segundos del transcript de faster-whisper (campos `w`, `s`), sin prompt, rutas ni nombres de archivo |
| 08 | `captura` · blanco | `08-foto-fotobn-lote-s32-20261008.jpg` | **Real, pero es la FOTO generada** (`lote-fotobn-s32-c5e1d3d0.jpg`, Higgsfield, 8-oct, 1 cr ya gastado), recortada de 2048×1528 a 2048×1212 (sin el gris de arriba y abajo). **No es una captura de la galería de Higgsfield** |
| 09 | `ensayo` · blanco | ninguna | **Real** (texto). Espacio duro dentro de «*del cocinero*» |
| 10 | `ensayo` · negro | ninguna | **Real** (texto). «HERRAMIENTAS▌» en verde eléctrico, CTA en la pastilla sin asteriscos |

Qué se evalúa con captura real (control del 40 % vacío): 01, 04, 07, 08, 09, 10. Los marcadores (02, 03, 05, 06) no cuentan.

## 2. PEDIDO PC (para la madre): capturas que faltan

Se sacan el **vie 16-oct**. Más anchas que altas (el marcador es 16:9; con eso las 4 entran sin pisar el pie). Se guardan en `hermes-content/carousels/briefs/assets/p2-herramientas/` **con la fecha en el nombre** y se cambia la ruta `image` de la lámina en los DOS briefs (comando en §6). En todas se tapan ids, llaves, correos, URLs, rutas del servidor y nombres de clientes.

| Lám. | Archivo final | Qué se captura | Desde dónde | Qué se tapa |
|---|---|---|---|---|
| 02 | `02-sesiones-20261016.png` | La lista de sesiones por nombre de carril (salida de ListAgents), sin ids | En la PC: impresa en local y capturada con computer-use | Ids de sesión, y lo común a todas (arriba) |
| 03 | `03-codex-tarea-20261016.png` | Terminal con una tarea de `codex-tarea.sh` y sus 3 líneas | En la PC: impresa en local y capturada con computer-use | Rutas, llaves, nombres de clientes |
| 05 | `05-buffer-cola-20261016.png` | La cola de Buffer con los 3 canales y posts agendados (el plan gratis admite 10 por canal: revisar que la cola no pase de 10) | Chrome | El correo de la cuenta |
| 06 | `06-n8n-ejecuciones-20261016.png` | Solo la **lista de ejecuciones**, filtrada al workflow de barridos: horas en verde. **No abrir el lienzo ni ningún nodo** (7 workflows con claves escritas en los nodos). **No apretar «Execute»** (los `*-run.sh` del bot envían de verdad). Esta captura también verifica que el workflow está activo | Chrome | La URL, el id del workflow y el nombre de la instancia. Revisar que no aparezcan nombres de otros workflows ni datos de clientes |
| 06B | `06B-n8n-inicio-20261016.png` | Solo si no hay ejecuciones del día o Sergio Urcullo no da el OK: la pantalla de inicio de n8n **sin nombres de workflows** | Chrome | Nombres de workflows, URL, nombre de la instancia |
| 08 | `08-higgsfield-galeria-20261016.png` | **Opcional** (mejora, no bloquea): la galería de Higgsfield con la foto `lote-fotobn-s32-c5e1d3d0.jpg`. Hoy la lámina lleva la foto sola | Chrome | Correo, créditos y datos de la cuenta |

Captura 07 (ya hecha): se imprimió con un script que muestra solo palabra y segundos; se revisó que no quede ninguna ruta. La spec dice «bruto de N03»; se usó el transcript que pidió la madre, `videos/marca-personal/2026-10-11/n06-antigravity/transcript-whisper-small.json` (lo transcribió `faster-whisper small`; hay un error real de Whisper: «Google lo pagó» por «apagó», se dejó como salió).

Captura 04 (ya hecha): el cuadro es la composición `intro.html` sola, a **1920×1080** (el tamaño que declara su CSS) en t = 1,2 s, cargada en Chromium + Playwright y llevada con `window.__timelines.intro.seek(1.2)`. Ojo: la composición declara `data-width=1080 data-height=1920` (vertical) pero su CSS es 1920×1080; en el render vertical real del proyecto (`renders/frame-01s.png`) el título sale cortado («HYPERFRAM»). Si Sergio Urcullo prefiere el snapshot vertical oficial, hay que arreglar el proyecto primero. La tipografía del cuadro es la de reemplazo de la nube (el CSS pide «Helvetica Neue»; salió Liberation Sans). El gsap lo cargó la propia composición desde su CDN (3.14.2); no se descargó nada.

## 3. Qué decide Sergio Urcullo

1. **Lámina 6: principal o plan B.** Muestra los avisos del bot a los prospectos de Onia y la tabla «se promete / funciona» todavía no existe: sin ella, toda función del producto pasa por él (regla del 8-oct). Sin su OK sale el plan B («n8n: *corre en mi servidor*» · «Mis automatizaciones, sin pagar licencia.»). Además la principal exige que la captura 6 muestre ejecuciones del día.
2. **Costo de Claude Code en el caption** (línea «Claude Code: plan pago de Claude», sin cifra): qué plan es y quién lo paga. El rótulo de la portada es verdadero igual.
3. **«Mi empresa»** en el caption (la titular legal es Leslie Mercado Moreno; es la convención de todo el plan).
4. Láminas 9 y 10: **arregladas el 11-oct en el pack** (`ensayo` ahora acepta `grande` y `fit:"ancho"`, opt-in): 9 pasó de 74 % a 53 % de vacío y la palabra de la 10 llena el ancho con margen de 84 px (letra de 104 a 124 px). Siguen sobre el 40 % porque son láminas de una frase y de un CTA; el `cierre` aprobado mide igual (~71 %). Se acepta como lámina de remate, o se agrega una línea de apoyo.

## 4. Antes de publicar (sáb 17-oct)

- **El aviso HERRAMIENTAS tiene que estar pegado en Avisos de la comunidad ANTES de publicar** (aviso primero, recurso después en otro mensaje): `hermes-content/docs/cola/plan-3-semanas/AVISOS-COMUNIDAD-8-16-OCT.md` §HERRAMIENTAS. Sin eso, «Buscá HERRAMIENTAS en Avisos de la comunidad» manda a nadie. Contiene la plantilla de encargo de 3 líneas de Codex y la tabla «qué herramienta para qué tarea».
- **Re-verificar el 17-oct** precios y planes (tabla de abajo) y recién entonces cambiar en `caption.txt` «leídas el 8 de octubre de 2026» por «17 de octubre de 2026». Las dos fechas están en el caption según la spec; hoy dice 8-oct, que es verdad.
- LinkedIn (16:01): el vie 16-oct se comprueba que el perfil muestre el link de la comunidad. Si no, sale sin «Link en mi perfil» y el link va en el texto.
- Portada B de TikTok (dom 18-oct 21:00): «Si te gusta hacerlo todo a mano, no deslices.»; las láminas 2-10 son las mismas.

### Datos a verificar el día de publicar (copiados de la spec; estado hoy: **pendiente** de re-verificar el 17-oct)

Estado al 8-oct según la spec: ok = confirmado en fuente oficial; medido = dato propio, sin página oficial; pendiente = no se puede cerrar hoy.

| Cifra | Estado 8-oct (spec) | Fuente | Estado hoy |
|---|---|---|---|
| «4 son gratis» (HyperFrames, Buffer, n8n, faster-whisper) | Ok. Cada una tiene su fila. n8n y la transcripción corren en el VPS, que se paga aparte: lo dice la línea 3 del caption | Filas de cada herramienta · `ONIA_PLAN_1.0_Y_CAJA.md` §2 | pendiente |
| «3 cocinan» y llevan «pago» (Claude Code, Codex, Higgsfield) | Ok, con una precisión. Claude Code pide plan pago (Pro US$20/mes, US$17/mes anual; Max desde US$100/mes; Free no lo incluye) o cuenta de Console. Codex sí tiene nivel gratis (ChatGPT Free y Go, con límites): «pago» en la portada es el plan que Sergio Urcullo usa (Pro, US$100/mes), no una condición de acceso. Higgsfield: plan Pro pagado anual (§2); su página de precios no se puede leer, «pago» es lo que Sergio Urcullo paga. Quién paga Claude y qué plan es lo decide Sergio Urcullo (§5.1); solo cambia la línea 2 del caption | https://claude.com/pricing · https://code.claude.com/docs/en/overview · https://learn.chatgpt.com/docs/pricing · `ONIA_PLAN_1.0_Y_CAJA.md` §2 y §5 | pendiente |
| Codex: 100 USD/mes | Ok, texto precisado. Es el plan Pro de ChatGPT («Plans at $100, $200, or $500 USD per month»), que incluye Codex; no es un precio de Codex solo. chatgpt.com/pricing da 403 al lector automático: abrirla en el navegador el sábado | https://developers.openai.com/codex/pricing (redirige a https://learn.chatgpt.com/docs/pricing) · https://chatgpt.com/pricing | pendiente |
| Higgsfield: plan anual | Medido. «El plan Pro se pagó anual (US$348)». El precio público no se puede leer (higgsfield.ai/pricing carga por JavaScript) y la lámina no muestra precio. Si el reclamo del cobro anual lo devuelve, la lámina 8 cambia «Plan anual» por «Plan mensual»; sigue siendo paga | `ONIA_PLAN_1.0_Y_CAJA.md` §2 (línea 41) · https://higgsfield.ai/pricing | pendiente |
| Foto fotobn: 1 crédito | Medido, no sale en la lámina. `lote-fotobn-s32` costó 1 crédito (modelo `gpt_image_2_5`, job `c5e1d3d0`). Sin el total de créditos del plan la cifra no tiene escala (la memoria dice 580, sin confirmar) | `hermes-content/galeria/galeria.json` | pendiente |
| HyperFrames: gratis | Ok. Licencia Apache-2.0, sin cobro por render. El render en la nube (HeyGen, AWS) es aparte; acá es local. `snapshot` existe en el CLI y `intro.html` existe en el repo | https://github.com/heygen-com/hyperframes | pendiente |
| Buffer: plan gratis, 3 canales | Ok, texto precisado. Free: US$0, hasta 3 canales, 10 posts agendados por canal, 1 llave API y 3.000 pedidos al mes. Publica en TikTok, LinkedIn y YouTube, pero en YouTube solo Shorts. Revisar que la cola no pase de 10 por canal | https://buffer.com/pricing | pendiente |
| Buffer: 10 fotos en TikTok | Dos páginas oficiales se contradicen: la ayuda dice máximo 10 imágenes propias, solo desde la web de Buffer, JPG o WebP; el blog dice hasta 35. Las 10 láminas caben en las dos. Falta probar que el «comando» (API) publica carruseles de fotos en TikTok | https://support.buffer.com/article/615-attaching-images-videos-and-other-media-to-your-posts · https://buffer.com/resources/tiktok-carousel/ | pendiente |
| n8n: sin costo extra, en el propio servidor | Ok. La edición Community se autoaloja gratis, sin licencia paga (vale también para el pie del plan B). Licencia Sustainable Use, «fair-code»; n8n no se llama a sí mismo código abierto: **no decir «código abierto»** | https://docs.n8n.io/hosting/ · https://github.com/n8n-io/n8n · https://n8n.io/pricing | pendiente |
| n8n revisa cada hora | **Pendiente, sin fuente oficial.** La memoria del 29-sep dice: barridos de seguimiento, recordatorio y postdemo, cada hora de 8 a 20 La Paz, encendidos el 18-sep. Un handoff del chatbot (16-ago) dice que los barridos de n8n se silenciaron por duplicar el cron del VPS. La captura 6 del vie 16-oct tiene que mostrar ejecuciones del día; si no, sale el plan B | Workflow de barridos del n8n del VPS · `hermes-content/docs/handoff/chatbot.md` línea 39 | pendiente |
| Lámina 6, función del producto | **Pendiente, bloquea esa lámina.** La tabla «se promete / funciona» no existe. Sin ella, la lámina 6 sale solo con el OK de Sergio Urcullo | Regla del 8-oct (CLAUDE.md, «Qué se publica sin preguntar») | pendiente |
| faster-whisper: gratis | Ok. Licencia MIT; `word_timestamps=True` da cada palabra con su inicio y fin | https://github.com/SYSTRAN/faster-whisper | pendiente |
| 5 sesiones | Ok. ListAgents del 8-oct: Lucía, Plataforma, Hermes-Jarvis, Marca personal y Ventas y pauta; la sesión que reparte no se cuenta. Recontar el sábado | ListAgents en vivo | pendiente |
| 10 láminas, carrusel de Instagram | Ok. La API acepta hasta 10 imágenes o videos por carrusel | https://developers.facebook.com/docs/instagram-platform/content-publishing | pendiente |
| Días: sáb 17, dom 18, lun 19, vie 16 | Ok para octubre de 2026 | Calendario | pendiente |
| «Mi empresa» (caption) | Sin fuente externa. La titular legal es Leslie Mercado Moreno y Sergio Urcullo opera. Convención de todo el plan; decide Sergio Urcullo | Memoria `sergio-menor-de-edad-quien-firma` | pendiente |

## 5. Control de calidad (medido el 11-oct sobre el render de esta carpeta)

1. **Portada (lámina 1).** Medido en el DOM con la fuente cargada: título en 2 líneas, letra 138 px (arranca en 150 y el ajuste la baja), línea más ancha de 94,9 a 985,1 px → **margen 94,9 px por lado (≥ 84)**. Las 7 marcas: fila 1 (Claude Code · pago, Codex · pago, Higgsfield · pago) de 120,5 a 959,5; fila 2 (HyperFrames, Buffer, n8n, faster-whisper) de 161 a 919; ambas centradas (margen izq = der), misma altura dentro de cada fila, separación constante de 54 px. Sin tejas de logo, sin rojo.
2. **Vacío por lámina** (alto del contenido sin la etiqueta NN/10 ni el @handle, contra 1.171 px de zona segura): 01 = 39,3 % · 02 = 31,4 · 03 = 22,1 · 04 = 31,3 · 05 = 34,3 · 06 = 27,2 (plan B 31,6) · 07 = 31,9 · 08 = 25,0 · **09 = 74,4** · **10 = 74,8**. Los marcadores (02, 03, 05, 06) no cuentan. El máximo del control es 40 %.
3. **Láminas 9 y 10: 53,1 % y 73,0 % de vacío tras el arreglo del 11-oct** (antes 74 % las dos). `ensayo` ganó `grande: true` (título 150 px, cuerpo 74 px) y `fit: "ancho"` (el navegador mide el ancho del TEXTO y agranda hasta el margen de 84 px; medir el h2 daba siempre 912 px porque un ítem flex se estira: se midió con `width:max-content`). La 10 es el CTA de una palabra: se compara con el `cierre`, que da ~71 %. No se rellena con texto inventado.
4. **Rojo / terracota:** 0 píxeles sólidos (bloques de 5×5 con R dominante) en las 10 láminas, capturas incluidas. Quedan franjas de 1 px naranja/azul del antialiasing de las letras (no son color de marca) — por eso se mide por bloques.
5. **Peso:** `jpg/` a q92, de 66 a 159 KB cada lámina (límite 8 MB). 
6. **Palabras visibles:** 161 con la regla de la spec (título, marcas, pie, fuente y CTA; sin NN/10 ni flecha, pero con «Deslizá»). **Diferencia con la spec: 0.** Plan B: 152 (diferencia 0). La etiqueta «NN/10 · HERRAMIENTAS» que dibuja el pack suma 10 repeticiones de una palabra que la spec no cuenta.
7. **Márgenes:** títulos y pies dentro de 84 px en las 10; la sombra de las capturas llega a 82 px (es sombra, no contenido).

## 6. Cómo volver a renderizar cuando lleguen las capturas

```sh
cd /home/user/onia-hermes
# 1) en cada brief (principal y planB), cambiar la ruta de la lámina, por ejemplo:
sed -i 's#PENDIENTE-02-sesiones.png#02-sesiones-20261016.png#' hermes-content/carousels/briefs/marca-personal/sergio-p2-siete-herramientas-20261017.json hermes-content/carousels/briefs/marca-personal/sergio-p2-siete-herramientas-20261017-planB.json
# (igual con PENDIENTE-03-codex-tarea, PENDIENTE-05-buffer-cola, PENDIENTE-06-n8n-ejecuciones y, en el planB, PENDIENTE-06B-n8n-inicio)
# 2) render + hoja de contactos (en la nube; el eval va en el MISMO comando)
eval "$(sh scripts/carousel_cloud_setup.sh)" && node scripts/carousel_render.js --brief hermes-content/carousels/briefs/marca-personal/sergio-p2-siete-herramientas-20261017.json --out hermes-content/carousels/out/sergio-p2-siete-herramientas-20261017-borrador --account sergio --pack referentes --format feed && node scripts/carousel_contactsheet.js --dir hermes-content/carousels/out/sergio-p2-siete-herramientas-20261017-borrador
# 3) control (márgenes, vacío, rojo, jpg/ q92, palabras)
python3 hermes-content/carousels/briefs/assets/p2-herramientas/qa-lamina.py hermes-content/carousels/out/sergio-p2-siete-herramientas-20261017-borrador hermes-content/carousels/briefs/marca-personal/sergio-p2-siete-herramientas-20261017.json
```

En la PC (PowerShell, sin `eval`): `node scripts/carousel_render.js --brief hermes-content/carousels/briefs/marca-personal/sergio-p2-siete-herramientas-20261017.json --out hermes-content/carousels/out/sergio-p2-siete-herramientas-20261017-borrador --account sergio --pack referentes --format feed`.

Para el plan B, mismo comando con `…-planB.json` y `--out …-planB-borrador`. Las capturas 04 y 07 se rehacen con `python3 hermes-content/carousels/briefs/assets/p2-herramientas/hacer-capturas.py --sin-marcadores` (leen `intro.html` y el transcript tal como están; si cambian, la captura cambia). `--out` va siempre explícito: sin él el render escribe en `./out/`, que está versionado.

## 7. Limitaciones del pack que hay que saber

- **`captura` ahora acepta `logo`** (11-oct, como `ilustrado`): láminas 2 (`brand-claude/claude--light.png`) y 3 (`brand-logos/openai.svg`) llevan su logo delante del título. Tests 50 ok, 0 fallos.
- **Las láminas 2-9 llevan `"next": ""`**: no se dibuja «seguí →» para no sumar palabras que la spec no escribió (solo la portada dice «Deslizá →»). Si Sergio Urcullo quiere una flecha en cada lámina, se pone y la cuenta sube.
- **Arreglo del layout `logos`** (`scripts/carousel_pack_referentes.js`, tests en `scripts/carousel_render.test.js`): una palabra = marcado y aspecto de siempre (comparadas 74 láminas de 10 briefs viejos antes/después: 0 píxeles distintos); varias palabras = una línea por `\n`, sin letter-spacing ni mayúsculas, ajuste por medición con 84 px de margen; sin `file` en las marcas, solo nombres. Efecto lateral que NO se tocó: «Worktree» (K12, una palabra) ya pasaba el margen de 84 px por ~19 px; el ajuste no se aplica al camino de una palabra para no cambiar su aspecto.
