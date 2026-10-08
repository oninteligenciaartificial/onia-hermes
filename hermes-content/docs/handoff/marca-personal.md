# Handoff — carril marca personal (guiones, comunidad, edición, contenido IA)

**Archivo único del carril.** Actualizado 2026-09-29 por Claude (Opus 5.5).

## ▶ 8-oct (noche, 4) — calendario de publicación ordenado

- **Fuente:** `docs/cola/plan-3-semanas/CALENDARIO-PUBLICACION-9-16-OCT.md`, también en la página de Sergio Urcullo.
- **Horas fijas (La Paz):**
  - 12:30 video A en IG y 12:35 en TikTok, Shorts y LinkedIn;
  - 13:30 yap de A a Trial;
  - 16:00 / 16:01 / 16:02 carrusel en IG, LinkedIn y TikTok;
  - 18:30 video B y 19:30 su yap;
  - 21:00 paquete del día siguiente.
- **Un yap por video** esta semana. Los horarios se revisan el lun 19-oct con datos de Instagram.
- **Guiones por fecha de publicación:** `GRABAR-10-16-OCT.md` (antes 9-15). Orden: lo perecedero primero (Haiku 5.5 el
  sáb 10) y cada video el mismo día que un carrusel del mismo tema.
- **Falta:** agendar cada video y su yap cuando Sergio Urcullo vea su tabla de cortes; el yap de N03 no existe.

## ▶ 8-oct (noche, 3) — N03 v2 listo, publicar frenado por el control de permisos

- **La regla ya está en `main`** (CLAUDE.md, «Qué se publica sin preguntar», #151). Se aplicó a N03 y falló en una
  condición: el video traía la tarjeta final y la frase hablada «Comentá COMUNIDAD y te paso el link». Es un CTA
  comentario → DM, que queda fuera.
- **N03 v2:** el del 1-oct cortado en la pausa de 53,1 s (después de «manual mode on») y con una tarjeta de cierre nueva,
  «La comunidad es gratis · El link está en mi perfil», con las mismas tipografías. 55,5 s, −14,5 LUFS. Mirada la cola
  entera. Está en el VPS: `/root/publicar/n03-modo-auto/{final-v2.mp4,caption-v2.txt,tt.json,yt.json}`.
- **Qué se frenó:** subir los archivos al VPS pasó. El ensayo de `ig-reel.mjs` lo frenó el control de permisos
  («Unrequested Commit in a Connected App»), con la regla ya en `main`. No se esquivó.
- **Para publicarlo:** `agendar-n03.sh --ensayo` y después `--agendar` (vie 9, 18:30 La Paz en IG y 1 a 3 min después en
  TikTok, YouTube Shorts y LinkedIn). Lo corre quien tenga el permiso: una sesión que Sergio Urcullo abra en modo
  «Accept edits», o la madre desde la PC.
- **Cómo hablarle (pedido de Sergio Urcullo, 8-oct):** mensajes cortos. Qué pasó en una línea, qué necesito de él y qué
  sigue. Sin tablas largas ni explicaciones. No existe la skill `/caveman`; la regla «Simple» de CLAUDE.md ya lo pide.

## ▶ 8-oct (noche, 2) — qué se manda a la comunidad y qué se hace con las llamadas

- **Sergio Urcullo graba los guiones del plan 9-15.** La comunidad y las llamadas quedaron en su página
  (`claude.ai/artifact/Hssf9o3ikt2fE7nkNBzrvd`):
  - **«Para pegar hoy, jueves 8»:** 6 textos en orden, con la vuelta y el reto primero.
    - Los 3 carruseles ya salidos o por salir prometen CACHE, VERIFY y HISTORIA.
    - El aviso de CACHE se releyó el 8-oct contra la página de precios de OpenAI: Sol 2 / 0,10 / 10; Astra 10 / 1 / 50.
    - El 9 va primero la respuesta del reto, a las 10:00.
  - **Asesoría de IA gratis:** se llama así en todo el material, no «auditoría». Cupo de 3 por semana, 2 preguntas al
    reservar y guion de 20 minutos en ese archivo y en `ONIA_COMUNIDAD_CONTENIDO.md`.
  - **Después de cada llamada**, Sergio Urcullo manda una línea (rubro, tarea elegida, si es clínica). A las 10 llamadas
    se mide cuántas pasan a la comunidad o a ver Onia.

## ▶ 8-oct (noche) — autorización de publicar y control de calidad de N03

- **N03 «modo auto» pasó el control de calidad el 8-oct:**
  - 57,8 s, 1080×1920, −14,5 LUFS;
  - hoja cada 2 s vista entera;
  - datos vigentes en `code.claude.com/docs/en/permission-modes`.
  Está en el VPS: `/root/publicar/n03-modo-auto/{final.mp4,caption.txt}`. **No se publicó.**
- **Autorización «publicá lo que pase control de calidad»** (Sergio Urcullo, por la madre): solo en la rama de la madre
  (`ad011a95a`), sin PR a `main`. El control de permisos de esta sesión frenó incluso subir el texto al VPS. Para
  publicar N03, falta una de dos:
  - un «sí» de Sergio Urcullo en ESTA sesión;
  - que la regla entre a `main`.
- **Comando listo**, con el texto nuevo («link en mi perfil» en vez de «comentá»):
  `agendar-publicacion.sh n03-ig '2026-10-09 22:30:00' node /root/bin/ig-reel.mjs --cuenta sergio --video
  /root/publicar/n03-modo-auto/final.mp4 --caption <caption> --publicar`. A las 22:31-22:33, `buffer-post.mjs --video`
  a TikTok (`--meta` con título), YouTube (`--meta` con título, `privacy: public`) y LinkedIn.

## ▶ 8-oct (tarde) — segundo pedido de la madre: contenido diario (`session_01WPecmppa9uZEc4fJDjSmaS`)

- **Decisión de Sergio Urcullo (8-oct, por la madre):** las asesorías van gratis por ahora. Él solo se graba; las
  pantallas las sacan los agentes.
- **Plan del 9 al 15-oct:** `docs/cola/plan-3-semanas/GRABAR-10-16-OCT.md`. Reemplaza al 9-14 y se renombró.
  - **13 piezas, 1 o 2 por día.** El martes va solo el YouTube D01-C. Cada pieza trae formato, molde, CTA y lo que pone
    la edición en pantalla.
  - **CTA nuevo: «link en mi perfil»** (comunidad o asesoría gratis), ya no «comentá X y te lo mando». La ficha del 8-oct
    lo desaconseja, porque el DM automático no está probado.
  - **Avisos nuevos:** HAIKU y SKILL.
  - **Tres piezas sin grabación (solo briefs, sin render todavía):**
    - P1 «Niveles», video HyperFrames con cuenta propia a precios oficiales: de 0,60 a 0,10 USD por tarea;
    - P2 «7 herramientas», carrusel;
    - P3 «Así trabaja mi empresa», carrusel o diagrama.
  - El archivo trae también el **plan de publicación de la semana**.
- **Falta para que el CTA funcione:** que la bio sume «Asesoría gratis → sergiourcullo.vercel.app/llamada» y que cal.com
  pase a «Asesoría de IA gratis».
- **Próximo:** renderizar P1 y P2, para el primer día sin bruto. P2 lleva 4 íconos de arcilla que entran en el lote de la
  decisión 1.

## ▶ 8-oct — retomada tras el corte de la semana de Claude (`session_01WPecmppa9uZEc4fJDjSmaS`)

- **Publicado y verificado el 8-oct:** el 6 y el 7-oct salieron los carruseles en las tres redes. 6 de 6 `sent`, sin
  error.
  - DD-A: IG `DeKl9Zcjwco`, LinkedIn `ugcPost:7513327593224458240`, TikTok `7693647592986578197`.
  - N04: IG `DeNKxt7D8KJ`, LinkedIn `ugcPost:7513689985171206144`, TikTok `7694018690777369876`.
  - Quedan 27 timers, del 8 al 16-oct.
- **Guiones del 9 al 14-oct** en `docs/cola/plan-3-semanas/GRABAR-10-16-OCT.md` (pedido de la madre): 17 piezas, una hora
  por día.
  - Pieza nueva N07 HAIKU (Haiku 5.5, verificada en la página de precios el 8-oct), con su aviso de comunidad al final
    del archivo.
  - N04: la skill tiene que ser propia, no de un plugin.
  - D01-C nombra a Haiku 5.5.
  - La página de Sergio Urcullo ya muestra esta semana, por día.
- **El carrusel N06 (11-oct) está bien:** geminicli.com, el blog de Google del 19-may y los planes de antigravity.google
  confirman lo que dice, leídos el 8-oct.
- **Brutos:** ninguno nuevo en Drive el 8-oct.
- **Rama de Codex `codex/madre-orquestacion-20261005`** (61 commits, sin mergear): su commit `6e1a4dae` del 6-oct
  reescribe GRABAR/GUIONES/KIT con menos pasos. No se mergeó acá; decide la madre.

## ▶ 5-oct noche — sesión nueva (`session_01WPecmppa9uZEc4fJDjSmaS`, rama `claude/gifted-clarke-y4vvtj`)

**Página única para Sergio Urcullo:** https://claude.ai/artifact/Hssf9o3ikt2fE7nkNBzrvd. Tiene qué necesito de él, día
por día con el texto de la comunidad para copiar, los comentarios, las historias, los 6 guiones y la auditoría. La
genera `gen_page.py` en el scratchpad de esta sesión. Si se pierde, los datos salen de `AVISOS-POR-DIA.md`,
`GRABAR-2-14-OCT.md` y los briefs.

- **EN PRODUCCIÓN (agendado):** 11 carruseles en @sergiourcullo, uno por día a las 16:00 La Paz, del mar 6 al vie
  16-oct. Timers `pub-car-20261006` a `pub-car-20261016` en el VPS (`agendar-publicacion.sh --lista`). Lo pidió él en
  esta sesión. Antes, un ensayo de DD-A sin publicar dio 6 láminas aceptadas por Instagram.
  - Script sin fecha en el nombre: `deploy/vps-ops/publicar/agendar-carruseles.sh` (antes `-3-20-oct`).
  - Orden: DD-A, N04, K3v2, N03, K11, N06, K4v2, K8v3, K7v2, K2v3 y K6v2.
  - ⚠ Si el VPS se reinicia, los timers se pierden y no sale nada: re-agendar con el script.
- **También en LinkedIn y TikTok (pedido de Sergio Urcullo el 5-oct: «alistamos buffer para postear a todas las
  redes»):** 22 timers más, `pub-car-li-*` a las 20:01 y `pub-car-tt-*` a las 20:02 (33 en total).
  - Salen con `buffer-post.mjs --imagenes`, que es nuevo; el original quedó en el VPS en `/root/bin/buffer-post.mjs.bak-20261005`.
  - Probado como borrador en las dos redes, aceptado y borrado. La publicación real todavía no se probó.
  - Hay un control programado para el 6-oct a las 20:10 UTC (`trig_017LEVgojRbj4QJmpa2UbE3V`) que mira si salieron las tres.
- **Grabaciones de pantalla:** las hace Claude al editar; Sergio Urcullo graba solo la cámara (lo pidió el 5-oct). Desde
  la nube el navegador no abre páginas (`ERR_CERT_AUTHORITY_INVALID`) y el modo «Auto» frenó la importación del
  certificado. Hace falta su OK en esta sesión o una sesión en la PC con Chrome. Las demos de terminal se arman acá.
- **Guiones:** la página tiene los 32 (bloques 1 y 2 del plan). Primero van 6; R05 espera su decisión sobre MARKETING.
- **En espera (7):** K1, N02, K9, K12, K5, K13 y K10, por las 10 láminas que no se entienden. Falta que él elija:
  - «rehacé las 10» (1,20 cr; los prompts nuevos están en el CIERRE 3-oct);
  - o «van sin esas láminas».
- **Comunidad:** los avisos se re-alinearon al calendario nuevo, en la página.
  - Mar 6: «Volví» + reto + CACHE.
  - Mié 7: respuesta del reto + VERIFY.
  - Desde ahí, un aviso por carrusel.
  - En la página, «mañana sábado» se cambió a «mañana miércoles» y el JSON de BRIEF va como mensaje, no adjunto. El
    texto de `AVISOS-POR-DIA.md` sigue con las fechas viejas.
  - **Los pega él, antes de las 12:30.** No hay confirmación de que lo haya hecho.
- **Comentarios:** se contestan a mano, porque el mensaje privado automático no existe.
- **Historias:**
  - todos los días, compartir el carrusel a la historia con el sticker de la comunidad;
  - los jueves, la historia de la auditoría.
- **Guiones:** 6 para una sola sesión de ~1 h, sin tela verde. Cada uno va con su carrusel ya agendado: DD-A, N04, N06,
  D03-A, D01-A y S2-D08-A. El texto sale de `GRABAR-2-14-OCT.md`.
- **Auditoría: Sergio Urcullo eligió B** (de IA, para cualquier negocio) el 5-oct. Está en `ONIA_COMUNIDAD_CONTENIDO.md`
  §«Auditoría de IA gratis».
  - Se renombra el evento `/20min`; no se crea otro. Así siguen andando `sergiourcullo.vercel.app/llamada` (307 a
    `/20min`, medido el 5-oct) y los links viejos.
  - Cupo de 3 por semana y 2 preguntas al reservar.
  - Falta que él lo cambie en cal.com y sume el link a la bio. Después: mirar la página renderizada.
- **Pregunta abierta:** ¿agendo el reel N03 (ya en el VPS, `/root/publicar/n03-modo-auto/`) para el vie 9, junto a su
  carrusel?
- **Brutos:** ninguno nuevo en Drive el 5-oct.

## ⏹ CIERRE 5-oct — cambio de sesión madre (`session_01CE21mytrEXdqanCFoWxm32`)

**Objetivo de la tanda (madre, 3-oct):**
1. Alinear el kit al plan de grabación por bloques.
2. Re-verificar las piezas REVISAR.
3. Sumar el paso de pantalla verde.
4. Editar los brutos con tabla de cortes ANTES de cortar.

**En `main` (todo mergeado, nada publicado):**
- `KIT-GRABACION.md` ordenado por los 5 bloques de `PLAN-GRABACION-3-OCT.md`, con el verde primero. Las 10 piezas REVISAR
  quedaron verificadas el 3-oct con su fuente; GUIONES, GRABAR y los drops, corregidos: Fable 5.1 en D01-C, los 1.000
  mensajes gratis de Meta, la caché de OpenAI, la demo de N04 y los 5 ajustes de N02 (PR #113).
- `editor-videos/scripts/fondo-verde.mjs`: chromakey probado con una toma de prueba (PR #113).
- Moldes en `edicion-referentes`: Santiago, Erik, **Pablo** para los repos (PR #119) y **Boceto** (PR #126). Ficha del
  reel de @theaigeekk en `video-intake` (PR #120).

**Estado del embudo** (contestado a la madre el 3-oct, comprobado en vivo):
- existen el grupo «Onia Community», la agenda `cal.com/sergiourcullo/20min` y la web;
- la «auditoría gratis» no está definida en ningún lado;
- la acción más chica: renombrar ese evento de cal.com a auditoría con 2 preguntas y poner el link en la bio, en el
  grupo y en las respuestas a los comentarios.

**A medias, y dónde:**
- **N03 (modo auto, versión Codex):** listo para publicar.
  - Archivo en el VPS: `/root/publicar/n03-modo-auto/{final.mp4,caption.txt}`.
  - Copia en el scratchpad de esta sesión: se pierde si la sesión muere, pero se rehace con `edit-codex.py`.
  - El 4-oct se le mandó a Sergio Urcullo como archivo para descargar.
  - Desde esta sesión en modo «Auto», el clasificador bloqueó hasta el ensayo de `ig-reel.mjs`.
- **Molde Boceto:** sin probar. Espera las fotos de 4 a 6 bocetos de Sergio Urcullo.
- **`santiago.py --estilo pablo`:** se escribe con el primer bruto de un R.
- **Brutos:** en Drive («Videos Onia Octubre») sigue solo el de N03 del 1-oct. No llegó nada grabado el 3-oct, así que
  no hay tabla de cortes pendiente.

**Intentos fallidos:**
- `ig-reel.mjs` (ensayo, sin publicar) lo frenó el clasificador del modo Auto: «Unrequested Commit in a Connected App».
- `transcribe.sh` desde la nube se cuelga con la IP directa: va con `ONIA_VPS_HOST=onia-vps`.
- Un `git checkout origin/main --` dejó HEAD suelto: se arregla con `git checkout -B <rama> origin/main`.

**Lo que depende de Sergio Urcullo:**
1. N03: lo sube él o pasa la sesión a «Accept edits» y dice «publicalo», con dónde y cuándo.
2. Los brutos del bloque 1 (verde) y del bloque 2.
3. Los 18 carruseles: «ok, agendá». Las fechas del script (3 a 20-oct) ya se corrieron: hay que reprogramarlas.
4. Las 10 láminas: «rehacé las 10» (1,20 cr) o «van sin imagen».
5. Si se prueba el molde Boceto, con sus dibujos.
6. Si los guiones R y G (~60 s) se acortan al largo del molde Pablo (21 s).

## ⏹ CIERRE 3-oct ~18:45 UTC — alcance congelado por Sergio Urcullo; esperando revisión (`session_01CE21mytrEXdqanCFoWxm32`)

**Objetivo de la tanda** (asignado por la madre, alcance congelado el 2-oct):
1. N03 al estilo Fable/Astra.
2. La skill `edicion-referentes` con un video de prueba por referente.
3. Los 18 carruseles mostrados a Sergio Urcullo.

**Qué quedó hecho y dónde (nada publicado):**
- **N03 «modo auto», versión Codex:** `videos/n03-modo-auto-20261001/scripts/edit-codex.py`, 57,8 s, −14,5 LUFS. El render
  está en el scratchpad (`video-v1/final/sergio-n03-modo-auto-codex.mp4`) y se rehace en ~2 min con
  `N03_DIR=<dir> python3 edit-codex.py`. Visto en hojas y transiciones.
- **Los 18 carruseles, renderizados y revisados** (3 agentes de QA, uno por cada 6, más DD-A mirado por mí). Página para
  Sergio Urcullo: **https://claude.ai/artifact/FzA8mtJhv81wwADHhYfGgK** (video + calendario + los 18, con las 10 láminas
  a rehacer marcadas en naranja).
- **Calendario corrido un día:** `hermes-content/deploy/vps-ops/publicar/agendar-carruseles-3-20-oct.sh`, del 3 al 20 de
  octubre a las 20:00 UTC. El 2-oct no salió nada.
- **Lote de 32 imágenes:** 33 trabajos, 3,96 cr, verificados en `higgsfield generate list`. Bitácora en
  `ONIA_MARCA_PERSONAL_HIGGSFIELD_RECETAS.md`. Arreglado sin gastar:
  - fondos grises a blanco con `scripts/blanquear-fondo.py`;
  - letras inventadas en el pincel de K7 (lámina 4);
  - la palabra del cierre, que ahora el pack mide en el navegador;
  - tres textos.
- **Skill `edicion-referentes`** (`2176a489`):
  - `SKILL.md` + `recetas/{santiago,erik}.json` (cada regla con su rango y su evidencia de reel + segundo);
  - `scripts/santiago/santiago.py` y `scripts/erik/erik_edit.py`;
  - sumada a `onia-router` y nombrada arriba de `editor-videos`.
- **Pruebas de edición** (mismo bruto de N03, para comparar): **https://claude.ai/artifact/LiNJv5mCdcH5HXsrXmzPTR**. QA
  antes del arreglo: Santiago 6,5/10 y Erik 6/10. Lo que falta no se arregla editando; ver «cómo grabar» en la skill.
- PR [#100](https://github.com/oninteligenciaartificial/onia-hermes/pull/100), en borrador. El [#76](https://github.com/oninteligenciaartificial/onia-hermes/pull/76) ya está mergeado.

**Qué quedó a medias y por qué:**
1. **10 imágenes que no sirven**, sin presupuesto (el tope de 4 cr se usó):
   - K13 lámina 2: el destornillador parece otra cosa;
   - K5 lámina 7: el gotero parece un masajeador;
   - K9 lámina 5 y K12 lámina 7: tienen cara;
   - K5 lámina 3: el globo parece cara;
   - N02 láminas 3 y 7: no se reconocen;
   - K1 lámina 7: parece una rana;
   - K10 lámina 5: la perilla no se entiende;
   - K9 lámina 6: el monedero parece una piedra.
   Esperan el «sí, rehacé las 10» (1,20 cr, tope 1,50). Los prompts nuevos están pensados (dos hojas con clip, sobre,
   vidrio esmerilado, molde de galletas, linterna, llave inglesa, escalerita, línea de largada, check + pala, monedero
   de frente) pero **no están escritos en los briefs**: hay que pasarlos con `aplicar-lote.py prompts`.
2. **Agendar** espera dos cosas de Sergio Urcullo: su «ok, agendá» sobre la página y que pase el modo de «Auto» a
   «Accept edits». En modo Auto, publicar queda bloqueado aunque lo pida por chat. DD-A (3-oct) sale sólo si llega
   antes de las 20:00 UTC.
3. **N03:** publicarlo espera su OK sobre la pieza.

**Intentos fallidos (no repetir):**
- «coins with smooth blank faces» dibujó una moneda con cara.
- Biombo y globo de diálogo salen con ojos.
- Detector de metales y palanca de cambios no se reconocen en arcilla.
- El cierre contaba letras: COMUNIDAD tiene 9 y se salía igual.
- El flood fill con `-fuzz` no limpia la viñeta gris.
- El workflow de referentes del 2-oct murió por límite de sesión (reinicio a las 17:30 UTC) y se reanudó con
  `resumeFromRunId`.
- La investigación propia de «cómo editó Codex» se cortó porque la madre rescató el `edit.py` real.

**Qué depende de Sergio Urcullo:**
1. Mirar la página del pack y responder «ok, agendá».
2. Aprobar las 10 imágenes (1,20 cr) o decir «van sin imagen».
3. Cambiar el modo para agendar.
4. Aprobar la publicación de N03.
5. Grabar los próximos videos con trípode, micrófono de solapa y una toma de cierre.

**Pendientes para después (vistos en la QA, fuera del alcance congelado, NO se hicieron):**
- **Imágenes viejas de lotes anteriores** (medio):
  - K1 lámina 4: los tres aviones dicen lo contrario de «mismo resultado»;
  - portadas: K3v2 (canario sin relación), K11 (no se lee «hook»), K2v3 (foto oscura), N06 (borde recortado),
    K5v2 (bloque turbio) y K7v2 (verde sobre verde);
  - K12 lámina 5: el vagón no dice nada.
- **Texto y layout:**
  - K6v2 lámina 6 queda media vacía;
  - N02 lámina 4 tiene una captura en inglés densa y espacios rotos en las capturas;
  - K13 lámina 5: el comando se parte en dos renglones;
  - los cierres quedan ~60 % vacíos, sin pregunta arriba;
  - el énfasis partido deja barras sueltas (K10 lámina 6, K6 lámina 3).

## ▶▶▶ Estado 2-oct 13:40 UTC — misma sesión (`session_01CE21mytrEXdqanCFoWxm32`)

- **PR #76 al día con `main`** (merge sin conflictos, `e3091f74`), marcado listo para revisión, `mergeable_state: clean`.
  El merge a `main` lo hace Sergio Urcullo o la madre.
- **Lote de imágenes COTIZADO y SIN generar: 32 imágenes · 3,84 cr (tope 4 cr)**, text2image_soul_v2 clay. Son 31
  prompts pendientes de los 18 briefs, más la portada de K9v2, que salía con una criatura con ojos: su prompt era de foto
  (tijeras) con estilo clay. Ahora pide una lupa sobre película. Se cotizó con
  `HF_CMD="ssh onia-vps higgsfield" node scripts/carousel_images.mjs --brief <b> --out <scratch>/<slug>` sin `--yes`.
  **Falta su «sí, generá las 32».**
- **Orden pactado con la madre v2 (CLAUDE.md §4: construir y publicar son dos permisos):**
  1. Generar.
  2. Hacer QA de cada imagen.
  3. Renderizar los 18.
  4. Armar UNA página privada con los 18 + calendario.
  5. Esperar su OK sobre esa página.
  6. Recién ahí `agendar-carruseles-2-19-oct.sh --agendar`. El de hoy (DD-A, 20:00 UTC) sale sólo si es la versión
     que vio.
- **Permiso para publicar (IG/Buffer): medido.** El modo Auto bloquea `--agendar` aunque el pedido esté en el chat; la
  intención del usuario sólo levanta los `soft_deny`. Hay dos vías:
  - **Elegida, por ser la de menos pasos:** Sergio Urcullo pasa el selector de modo de «Auto» a «Accept edits», aprueba
    el botón y vuelve a «Auto».
  - Una regla `permissions.allow` angosta para ese script. Tendría que ponerla él, no la sesión.
- **Investigación de los videos de Codex:** workflow `w9xtnrhy5` en curso. Con su receta se re-edita N03; la versión
  vigente es la v3 sin SFX.

## ▶▶ Estado 2-oct ~01:10 UTC — misma sesión (`session_01CE21mytrEXdqanCFoWxm32`)

- **Video modo auto (N03) TERMINADO**, sin publicar: `final/sergio-n03-modo-auto-20261001.mp4` (59,6 s, −14 LUFS,
  52 MB) en el scratchpad de la sesión (`…/scratchpad/video-v1/`), FUERA del repo. Si la sesión muere se pierde el
  render, pero se rehace en ~5 min: `scripts/cutplan.json` + `scripts/segments-fixed.json` + `scripts/una-pasada.cjs`
  (todo en ese scratchpad; el bruto está en Drive, carpeta «Videos Onia Octubre», compartida por enlace). Corte
  aprobado por Sergio Urcullo («está bien»). Se sacó la frase «Esto es lo que deja de pasar» y el «de» del segundo
  «deja de pasar» (decía lo contrario). Palabra: COMUNIDAD (la dijo a cámara). Falta su «ok» para publicar.
- **18 carruseles listos** (13 K + 5 noticias), revisados con rúbrica de utilidad, todos con cierre `cierre`
  «Comentá PALABRA». Calendario uno por día 16:00 La Paz del vie 2 al lun 19 en
  `…/hermes-content/deploy/vps-ops/publicar/agendar-carruseles-2-19-oct.sh` (y `CARRUSELES-DIARIOS.md`). **Nada agendado:** el modo automático de
  permisos frenó la subida a Instagram («Real-World Transactions») aunque Sergio Urcullo dijo «programalos». Falta su
  «sí» explícito o una regla de permiso. No buscar otro camino.
- Imágenes: lote 2-oct 1,08 cr en total (K8, K13, N03, N04, K7), bitácora en `ONIA_MARCA_PERSONAL_HIGGSFIELD_RECETAS.md`.
- N06 rehecha: «Google cambió Gemini CLI gratis por Antigravity CLI» (la vieja era falsa).
- Comunidad: `cola/drops/AVISOS-POR-DIA.md` — qué pegar cada día, revisado. Hoy vie 2: vuelta + reto, PLANILLA +
  COMUNIDAD + TARIFA, EFFORT + MIRAR + CACHE.
- Guiones para grabar: `plan-3-semanas/GRABAR-2-14-OCT.md` (D02-A y DD-A corregidos hoy, N06 nuevo).
- Pendientes de Sergio Urcullo: ok para publicar el video; «sí» para agendar; pegar los avisos; mirar la web
  `/claude-code` (dice «3 subagentes»; DELEGAR y SKILL mandan ahí); subir el video de Sonnet 5.5 (D01-B) a Drive.

## ▶ Estado 1-oct ~21:40 UTC — sesión `session_01CE21mytrEXdqanCFoWxm32` (nube, entorno onia-higgsfield)

- **Hecho y pusheado** (rama `claude/marca-personal-contenido-ae658c`): K2v3, K8v3, K11, K12 y K13 rehechos y mirados;
  K2v3, K11 y K12 con imágenes de arcilla (lote aprobado, 0,84 cr, bitácora en `ONIA_MARCA_PERSONAL_HIGGSFIELD_RECETAS.md`)
  y logos oficiales (git y Telegram nuevos en `references/brand-logos/`). Calendario 2→14 oct en `CARRUSELES-DIARIOS.md`
  §1 (única fuente). Los 38 guiones cierran con «comentá PALABRA» (tabla al principio de `GUIONES-2-SEMANAS-1-14-OCT.md`).
  `carousel_contactsheet.js` ya anda en la nube.
- **Esperando a Sergio Urcullo:**
  1. el video del 1-oct está en Drive (`Videos Onia Octubre/A0550B92-….mp4`, id `1fOVS40NXa25ZBt-b_3gJkBXfCCOcs-3q`, 78 MB)
     pero PRIVADO: hace falta «Cualquier persona con el enlace» para bajarlo con curl. Solo subió UNO de los dos;
  2. «sí» explícito para las 4 imágenes de K8 y K13 (0,48 cr): el modo automático de permisos frenó la generación
     paga. No buscar otro camino;
  3. «ok» de los carruseles y del calendario para agendarlos.
- **Video, listo para arrancar:** ffmpeg está; `pip install faster-whisper` + modelo `small` ya bajados; script de
  transcripción local en el scratchpad (formato que comen `cut-plan.mjs`/`karaoke-captions.mjs`, ver skill `editor-videos`).
  El bruto se trabaja FUERA del repo (`videos/` no está en `.gitignore` y el autosync lo subiría).
- **Publicar:** Sergio Urcullo pidió «que lo postees a mis redes». Circuito en `deploy/vps-ops/publicar/README.md`
  (`ig-reel.mjs` + Buffer para TikTok/YouTube/LinkedIn, por `ssh onia-vps`). Se publica recién con su «ok» sobre el
  video terminado (antes: tabla de cortes + preview).
- **Intentos fallidos:** generar en subagentes con `--out k11-img` dejó `usado_en` mal (corregido); los subagentes no
  heredan el OK de Sergio Urcullo para gasto.

## 🔁 RELEVO 1-oct noche — empezá ACÁ (sesión nueva en la nube con Drive)

Sergio Urcullo: *«cambiemos de sesión, ya conecté Drive»*. La sesión anterior (`session_012ppFowADbJNtZ6WBMtqpuf`, nube)
termina acá. La sesión madre (local) orquesta y hace lo que exige la PC. La nube no le puede escribir a la madre: se le
contesta en el transcript.

**1. Objetivo del carril:** marca personal y comunidad de Sergio Urcullo (contenido diario → comunidad → curso a los
100 miembros). Onia Platform y @oniahq NO son de este carril (los lleva la sesión de ventas y pauta).

**2. En producción / publicado:** NADA todavía. Ningún video, carrusel ni mensaje de comunidad salió.

**3. A medias y dónde (todo en la rama `claude/marca-personal-contenido-ae658c`, PR #76 abierto en draft):**
- **2 videos GRABADOS, sin editar** (Sonnet 5.5 = D01-B, «lo cambié un poco»; modo auto = N03, tal cual). Están en la PC.
  Guía de edición lista: `cola/plan-3-semanas/EDICION-VIDEOS-20261001.md`. Próximo paso: que Sergio Urcullo comparta los
  brutos por Drive y editarlos con `editor-videos` (tabla de cortes + preview ANTES de cortar).
- **Carruseles K2v3, K8v3, K11, K12, K13: NO HECHOS.** El workflow que los hacía se cortó a propósito por el relevo, antes
  de escribir nada. El script está en `cola/plan-3-semanas/auditoria-20260930/workflow-drops-carruseles-20261001.js`: rehacé
  esa fase con esos prompts. K12 ya puede usar «424 commits» (confirmado por la madre).
- **17 drops escritos, sin enviar:** `cola/drops/2026-10-01-drops-noticias-repos.md`. Incluye drop 2 corregido, drop 14
  corregido, EFFORT, N01–N06 y R01–R07. Pasaron una vuelta de revisor y arreglo, pero no se re-verificaron después del
  arreglo: leelos antes de mandarlos.
- **Vuelta de la comunidad + reto:** `cola/drops/2026-10-01.md`, sin enviar. Las fechas se corren al día real.
- **Programar carruseles:** pedido de Sergio Urcullo («programalos para postear, subido a drive»). Falta: (a) que vea cada
  carrusel y dé el «ok»; (b) re-alinear `CARRUSELES-DIARIOS.md` con el calendario nuevo de videos. Propuesta: vie 2 K10 ·
  sáb 3 K1 (después del reto) · dom 4 K2 · lun 5 K6 · mar 6 K3 · mié 7 K11 · jue 8 K4 · vie 9 K9 · sáb 10 K12 · dom 11 K5 ·
  lun 12 K13 · mar 13 K7 · mié 14 K8. Todos a las 16:00 La Paz; (c) agendarlos con `deploy/vps-ops/publicar/ig-carrusel.mjs`
  + `agendar-publicacion.sh`. Eso exige la llave del VPS (`ONIA_VPS_SSH_KEY_B64`) o pedírselo a la madre.

**4. Archivos clave:** `cola/plan-3-semanas/GUIONES-2-SEMANAS-1-14-OCT.md` (38 guiones, calendario 1–14 oct, ya con las
verificaciones de la madre) · `cola/plan-3-semanas/VERIFICACION-LAPTOP-20261001.md` · `auditoria-20260930/LOTE-A…D.md` ·
`EDICION-VIDEOS-20261001.md` · `cola/drops/` · `carousels/out/sergio-historias-comunidad-20261001/` y
`sergio-comunidad-reto-presupuestos-20261001/`.

**5. Intentos fallidos (no repetir):**
- Video por el chat: no llega.
- Drive por MCP en la sesión vieja: las búsquedas venían vacías, `root` no se encontraba y crear archivos daba «invalid
  argument». Sergio Urcullo reconectó Drive al cerrar; probalo primero con `search_files` sobre `mimeType contains 'video/'`.
- Bajar un video por `download_file_content` (base64 dentro del contexto) no sirve. Con un link «cualquiera con el enlace»
  se baja por curl desde `drive.usercontent.google.com`.
- `SendMessage` a la madre desde la nube: falla.
- `git grep` en todo el repo: más de 2 minutos.
- Detalle en las skills `editor-videos`, `diseno-contenido-onia` y `onia-continuidad` (commit `d64a6418`).

**6. Depende de Sergio Urcullo:**
- compartir los videos;
- mirar y aprobar los carruseles y el calendario de programación;
- pegar los mensajes de la comunidad (o autorizar a que se manden);
- poner «Comunidad» como primer link de la bio de IG;
- corregir y publicar la web `sergiourcullo.vercel.app/claude-code` (dice «3 subagentes»).

**7. Próximos pasos, en orden:**
1. Probar Drive y bajar los 2 videos.
2. Editarlos (tabla de cortes a Sergio Urcullo primero).
3. Rehacer K2v3, K8v3 y K11–K13, y mirarlos.
4. Mostrarle a Sergio Urcullo todos los carruseles con el calendario de arriba y, con su «ok», agendarlos.
5. Releer y dejar listos los 17 drops.

## 🔁 1-oct (tarde) · el carril iba a pasar a la sesión LOCAL — HISTORIA, ver el relevo de arriba

La sesión de la nube (`session_012ppFowADbJNtZ6WBMtqpuf`) queda EN PAUSA desde ahora; una sola sesión por carril.
La local arranca con `git pull` de `claude/marca-personal-contenido-ae658c` y lee esto primero.

**Dónde quedó todo (todo en `main` vía PR #57 y #61, nada sin commitear):**
- **Guiones de dos semanas, auditados:** `cola/plan-3-semanas/GUIONES-2-SEMANAS-1-14-OCT.md` — 38 piezas, calendario
  jue 1 → mié 14 (tutorial · informativo · caso por día; YouTube sáb 3, mar 6, vie 9, mar 13). Auditoría con qué se
  cambió y por qué: `cola/plan-3-semanas/auditoria-20260930/LOTE-A…D.md`. **Nada grabado todavía.**
- **Comunidad de WhatsApp:** textos de la vuelta + reto de los presupuestos en `cola/drops/2026-10-01.md`
  (con imágenes en `carousels/out/sergio-comunidad-reto-presupuestos-20261001/`). **No enviados.** Las fechas de ese
  archivo (jue 1 / vie 2) se corren al día real en que Sergio Urcullo los mande.
- **Historias de IG:** `carousels/out/sergio-historias-comunidad-20261001/` (2, con ilustraciones de Higgsfield).
- **K1** sale en opción B (`carousels/out/sergio-k1-opcion-b-clay-20260929/`), después del reto.

**Lo primero que tiene que hacer la sesión local** (lo que la nube no pudo): `cola/plan-3-semanas/PEDIDO-LAPTOP-20261001.md`.
Lo urgente es la página de precios de WhatsApp de Meta antes de grabar D02-B. Después: OpenAI DevDay, la web
`sergiourcullo.vercel.app`, gitdiagram, la memoria de los 424 commits y el filtro de n8n.

**1-oct, verificaciones de la madre integradas** (`VERIFICACION-LAPTOP-20261001.md`): D02-B confirmado; S2-D08-C y
su drop 4 corregidos (ventana de anuncios «hasta 7 días», no 72 h); DD-A (GPT-6.1 Sol) entra el vie 2 y N02 pasa al
dom 4 (R04 al mié 14, G01 a reserva); 424 commits confirmado; n8n hoy 38 activos de 96 (el 44 es del 20-ago).
**Pendiente que depende de Sergio Urcullo:** la web `sergiourcullo.vercel.app/claude-code` sigue diciendo «3 subagentes»
(hoy queda 1): corregir la web, no el guion; publicarla es su permiso.

**Pendientes del carril, en orden:**
1. Verificaciones de la laptop (arriba) → pasar los resultados a los guiones.
2. Escribir los drops que faltan (noticias N*, repos R*) y corregir el drop 2 (WhatsApp) y el 14 (MCP); juntarlos en
   los avisos de lun/mié/vie (propuesta del lote C: no 17 cierres sueltos).
3. Flujo de video: los brutos quedan en `C:\Users\PC\Videos\ONIA-brutos\<fecha>\`; la local edita con
   `editor-videos` (tabla de cortes + preview a Sergio Urcullo ANTES de cortar) y publica desde el VPS con su OK.
4. Bio de IG: «Comunidad» como primer link + destacado «Comunidad» (lo hace Sergio Urcullo; la local puede revisar
   perfiles con el Chrome logueado, solo lectura).

**Intentos fallidos / trampas de la nube (para no repetir):** el campo del título en el pack es `headline`, no
`title` (sale sin título y sin aviso); en la nube no hay `ffmpeg` (se instala con apt) ni CLI de Higgsfield (se usó el
MCP, 0,48 cr registrados); `git grep` sobre todo el repo tarda >2 min (dejó un merge a medias una vez: usar `grep`
sobre el archivo).

## 🧭 La visión del carril (Sergio Urcullo, 30-sep, textual)

> *«ser un experto en ia, contenido diario · pasar a lanzar un curso luego, comunidad atrae ventas de curso ia ·
> contenido diario · la onia plattform es nuestra muestra que sabemos trabajar · seguir lanzando apps y demás ·
> onia community presencial»*

Cadena: **contenido diario → autoridad en IA → comunidad → curso**. Onia Platform es la prueba de que sabe
construir; el presencial es el escalón de confianza.

**Respuestas de Sergio Urcullo (30-sep, 15:40 La Paz):**
1. *«los 5 clientes se consiguen solos, claude desarrolla solo, yo solo orquesto y grabo contenido»* → su tiempo va
   al contenido; la etapa del negocio no cambia.
2. *«demostración, pero si es buena, escala a producto»*.
3. Puerta del curso: **100 miembros** + encuesta con ≥ 20 «lo compraría».
4. Onia como muestra necesita cliente real: *«es correcto, por eso aún seguimos desarrollando»*.
- Historias: 2-3 por día (qué hace, noticias de IA, llevar a llamadas 1-a-1 o a la comunidad).
- Bio de IG (captura 30-sep): dos links, **primero «OnIA» onia.com.bo**, segundo «Comunidad» (WhatsApp). Sin destacados.

**Tensiones planteadas (historia de la respuesta de arriba):**
1. **Etapa vigente del negocio = 5 clientes de Onia Platform con la 1.0** (`ONIA_ESTRATEGIA_DE_EMPRESA.md` §16).
   El curso es una línea nueva que compite por las mismas horas. ¿La marca personal sigue en segundo plano
   hasta los 5 clientes, o cambia la etapa?
2. **«Seguir lanzando apps»:** como CONTENIDO (construir en vivo y mostrar) suma; como producto que hay que
   mantener abre líneas nuevas, lo que la regla prohíbe.
3. **El curso se valida antes de grabarlo** (`ONIA_COMUNIDAD_CONTENIDO.md` §Embudo). Puerta propuesta, falta su
   OK: comunidad ≥ 200 miembros + encuesta con ≥ 20 «lo compraría» sobre un temario salido de preguntas reales.
   Con 30 miembros hoy, el trabajo es crecer, no el curso.
4. **Onia Platform como muestra** necesita un cliente real para ser prueba: los 5 clientes y la marca se ayudan.
   Contenido «construyendo Onia» sirve a los dos a la vez.

## 📋 LA LISTA — todos los puntos del carril (Sergio Urcullo, 30-sep: «vamos recolectando todos y los vamos tocando»)

Una sola lista. Se toca de a uno, en este orden salvo que Sergio Urcullo diga otro. Estado al 30-sep.

| # | Punto | Estado | Qué falta |
|---|---|---|---|
| 1 | **Vuelta de la comunidad de WhatsApp** (~30 miembros, callada desde el 22-sep) | Mensajes listos en `cola/drops/2026-10-01.md` | Que Sergio Urcullo diga si sostiene audio del domingo y wins del viernes; que los pegue |
| 2 | **Atraer gente a la comunidad** (puerta del curso: 100 miembros) | Aclarado 30-sep: el video de YouTube es público y ADEMÁS se comparte en la comunidad (primero) | Armar el embudo: CTA en cada pieza, link en la bio, palabra clave → DM, invitación de miembros |
| 3 | **Historias de Instagram** | Sube 2-3/día. Primeras 2 plantillas hechas (`out/sergio-historias-comunidad-20261001`) | Rutina fija de 3; destacado «Comunidad» |
| 4 | **Perfiles** (IG, TikTok, YouTube, LinkedIn: bio, link, destacados) | Sin auditar | Desde la nube: con capturas que mande Sergio Urcullo. Con Chrome logueado: laptop |
| 5 | **Grabar** | **Dos semanas armadas y auditadas (jue 1 → mié 14-oct): `plan-3-semanas/GUIONES-2-SEMANAS-1-14-OCT.md`** — 38 piezas (tutorial · informativo · caso por día; YouTube sáb 3, mar 6, vie 9, mar 13). Auditoría en `auditoria-20260930/`. Pedido de Sergio Urcullo: «hoy no subimos, preparamos» | Que grabe; que valide la página de Meta antes de D02-B; drops a escribir (N, R) y a corregir (drop 2, drop 14); OpenAI DevDay sin revisar (bloqueado desde la nube) |
| 6 | **Carruseles** K11–K21 + arreglar K2 y K8 | K1 en B (listo); K2–K10 hechos | Diseñar |
| 7 | **Publicar** (primer post real) | Publicador probado, nada real | Desde el VPS: laptop o sesión con la llave |
| 8 | **Encuentro presencial** | Después del 1 | Encuesta en la semana 2; convocar con ≥15 confirmados (falta OK) |
| 9 | **Método de Santiago** (videos animados por código) | Ficha escrita | Sergio Urcullo comenta «OPUS» si lo quiere |
| — | ~~@oniahq y pauta de Onia Platform~~ | Fuera del carril (30-sep) | Lo lleva la sesión de ventas y pauta (Sergio Urcullo, 30-sep) |

## ☁️ 30-sep 14:10 UTC — el carril pasó a la nube

- **Sesión viva: `session_012ppFowADbJNtZ6WBMtqpuf`** (nube). La de la laptop
  (`session_01LV2Djb9n8BgziusUEoJRq7`) queda en pausa: si se retoma con Remote Control, `git pull` primero.
- Rama al día con `main` (merge `f1579668`, sin conflictos).
- **Render de carruseles en la nube: anda.** `eval "$(sh scripts/carousel_cloud_setup.sh)"` + `carousel_render.js`
  → DM Sans y pie completos (mirado). Google Fonts responde 200 desde acá.
- **Higgsfield desde acá:** el CLI `higgsfield` NO está instalado; el MCP de Higgsfield sí responde (saldo
  486,91 cr, plan pro, leído sin gastar). cloudfront `d8j0ntlcm91z4` responde (403 de S3 en la raíz, no bloqueo).
- **Edición de video en la nube (30-sep):** `ffmpeg` no viene instalado; `apt-get install -y ffmpeg` funciona (6.1.1) pero se pierde cuando el contenedor se recicla. `faster-whisper` se baja por pip. Falta probar que un video subido por Sergio Urcullo llegue a la sesión.
- **No se puede desde la nube:** brutos de `C:\Users\PC\Videos\ONIA-brutos`, auditoría de perfiles con el Chrome
  logueado, publicar desde el VPS (sin llave; infra tiene un dueño). Eso sigue en la laptop.
- **Heredado de Mercado (decisión de Sergio Urcullo, 30-sep):** las piezas de pauta dental **D1 «Los de mañana»** y
  **D4 «Tratamiento a medias»** son de este carril. Briefs en `carousels/briefs/ads/onia-platform-dental-meta-d1-…json`
  y `…-d4-…json`. Requisitos fijos en `ONIA_ADQUISICION_Y_PAUTA.md` §5.2/§5.4/§5.8 (abre con «Para dueños/as de
  clínicas dentales en Santa Cruz», sin precio, CTA «Escribinos», solo capturas reales de la demo, solo lo que hace
  la 1.0, sin testimonios). Capturas: las pone la sesión principal en `carousels/briefs/assets/onia-1.0-dental-ads/`.
  Se muestran renderizadas a Sergio Urcullo antes de subir; campaña y encendido son de Mercado.
- ⛔ **Corregido el 30-sep, 14:40 UTC — Sergio Urcullo:** *«aquí es solo marca personal y comunidad, ya si
  querés postear algo de onia platform ya vemos cómo lo hacemos»*. D1/D4 **quedan fuera de este carril** hasta que
  él decida quién las hace. No se diseñan acá. Avisado en EL HILO.
- **Prioridad que fijó el mismo día:** la **comunidad de WhatsApp** va antes que el encuentro presencial.

## ⏩⏩⏩⏩ Pedido de Sergio Urcullo, 29-sep 20:30 (en curso)

| # | Pedido | Estado |
|---|---|---|
| 1 | «Aprendé el método de sanmunoz» | Era su último carrusel: videos animados que Claude dibuja con código, sin grabarse. Ficha: `references/marca-personal/SANTIAGO-VIDEOS-ANIMADOS-POR-CODIGO.md`. El skill real llega por DM si se comenta «OPUS» (decisión de Sergio) |
| 2 | Un carrusel por día, agendado | Publicador `ig-carrusel.mjs` listo (ensayo con 7 láminas hasta FINISHED, sin publicar). Calendario de los 21 días en `cola/plan-3-semanas/CARRUSELES-DIARIOS.md` (16:00 La Paz). **Hechos: K1–K9 y K10** (perilla de esfuerzo, mirado). **Faltan K11–K21**: tema, guion de origen y portada de cada uno ya están en ese archivo §2; se retoman desde ahí. Arreglos pendientes: K2 re-render con tema de marca (gratis), K8 portada vacía. Lote Higgsfield opcional de 4 portadas (0,48 cr) sin generar ni aprobar. Decisiones de Sergio: opción A o B de K1, e intercambiar K1↔K10 o no. Nada agendado todavía |
| 3 | Configurar bien todos sus perfiles | Pendiente: auditoría de solo lectura (IG, TikTok, YouTube, LinkedIn) y propuesta de cambios para su OK |
| 4 | ¿Qué hacemos con ONIA (@oniahq)? | Pendiente: mirar sus cuentas y proponer. Pista: el método de Santiago (anuncio dental hecho con código + una pantalla real del sistema) produce contenido de ONIA sin horas de grabación |
| 5 | Comunidad semanal (expositores, networking, temas) | Anotado en `ONIA_COMUNIDAD_CONTENIDO.md` con el tema de cada semana; faltan sus decisiones (día, sede, fecha, nombre, expositores) |
| 6 | Compartir entre sesiones | Avisos enviados a plataforma, limpieza de skills y Lucía v4. Regla nueva de Sergio (29-sep): compartir solo lo que le sirve a cada sesión, sin avisos de más. A Hermes el SendMessage no le llega: lo de coordinación va en `COORDINATION_MANIFEST.md` §EL HILO. Hermes lee «Para grabar hoy» de `S*-GUIONES.md` (formato `## Mié 30-sep` / `### DNN-X · Formato · Título`): no cambiarlo sin anotarlo en EL HILO |

**Cierre del 29-sep (Sergio pidió pausar las sesiones):**
- Alertas del publicador por la aduana `/root/bin/onia-tg.sh` (sistema), nunca curl directo: `agendar-publicacion.sh` e `ig-refrescar.sh` ya desplegados así.
- Checklist de grabación (método de Santiago + nuestra edición) en `ORDEN-DE-PRODUCCION.md` §1b.
- Sin commitear no queda nada. Riesgo conocido: el auto-sync de las 23:00 subió una versión intermedia de K10 (`fad8e2ff`); la final la reemplaza en el commit siguiente.
- Retomar por: (1) perfiles, auditoría de solo lectura con Chrome; (2) propuesta para @oniahq; (3) K11–K21; (4) respuestas de Sergio (OPUS, comunidad, K1).

## ⏩⏩⏩ Estado 29-sep noche: publicador

- **Circuito listo, todavía SIN publicaciones reales:** Sergio deja los brutos en
  `C:\Users\PC\Videos\ONIA-brutos\<fecha>\` → Claude edita, arma el paquete del día → «ok» de Sergio →
  Claude publica desde el VPS. Doc: [`deploy/vps-ops/publicar/README.md`](../../deploy/vps-ops/publicar/README.md);
  ritmo: [`cola/plan-3-semanas/FLUJO-DIARIO.md`](../cola/plan-3-semanas/FLUJO-DIARIO.md) (3 principales + 6 yaps a Trial).
- **Instagram** (reel + Trial) por API propia, `ig-reel.mjs`: ensayado hasta FINISHED, falta el primer
  `--publicar` real. **TikTok, YouTube Shorts y LinkedIn** por **Buffer Free**, `buffer-post.mjs`: cuenta,
  3 canales y clave activos (clave solo en el VPS, vence 29-sep-2027). Probado con un borrador por red
  (video adjunto, YouTube lo toma como Short) y borrados.
- **Arreglo de infra hecho:** la ruta Traefik `/hermes-assets` comprimía los MP4 con gzip y Buffer no los
  podía leer. Se le sacó `comprimir` solo a esa ruta; respaldo del archivo en el VPS
  (`/root/onia-manual-routes.bak-hermes-assets-20260929212725`). Los demás sitios siguen respondiendo igual.
- **Depende de Sergio Urcullo:** activar el compartido automático IG → Facebook (Centro de cuentas);
  decidir si se pide la auditoría de YouTube (para que los largos salgan solos: hace falta registrar la
  app en Google Cloud, que es un registro, no servidores). Hasta entonces, los largos los sube él.

## ⏩⏩ Estado 29-sep tarde

- **Diseño en un solo lugar:** skill `.claude/skills/diseno-contenido-onia/` (índice: fuentes de
  imagen, packs, patrones, QA, gasto) + galería única `hermes-content/galeria/` con
  `galeria.json`. Orden de imágenes: galería → **Higgsfield** (Sergio dicta «Pixel» = Higgsfield, confirmado
  29-sep) → logo oficial → captura real. Paleta: verde ONIA + blanco + negro (temas del pack). Google/Pinterest: no se publica
  nada sin licencia.
- **Pack nuevo `referentes`** (`scripts/carousel_pack_referentes.js`, layouts logos · analogia ·
  ensayo · ilustrado · lista) tras la crítica «vacíos y con demasiado texto». Prototipos mirados:
  `carousels/out/sergio-k1v2-*` y `sergio-k2v2-*`. K3–K9 siguen en el pack viejo: rehacerlos con
  este (imágenes: galería/Pexels primero; acuarelas Higgsfield ≈0,12 cr c/u con lote aprobado).
- **Presentaciones de YouTube:** 9 decks `carousels/out/yt-10…yt-18` (`scripts/decks/yt-octubre-2026.mjs`,
  generador con `--decks`), mirados.
- **GitHub:** `cola/plan-3-semanas/S4-GITHUB-REPOS.md` — 15 repos en tendencia con riesgo, 12
  formatos, 10 verticales + 1 YouTube (G01–G11) SIN fecha en el calendario todavía.
- **Patrones visuales de los 8 referentes:** `diseno-contenido-onia/patrones/REFERENTES-VISUAL.md`.
- **Coordinación:** la sesión «Onia platform development handoff» es dueña de onia-platform,
  SIAT, sales-kit y la web pública (árbol `onia-hermes-v1-remoto-20260928`); esta sesión, del
  contenido de onia-hermes. Acordado 29-sep: nadie arma lugares paralelos; se avisa antes de
  tocar `.claude/skills/` o `hermes-content/references/`.
- Gasto Higgsfield del día: ver bitácora. El audio del bot NO es de este carril (Sergio: «tú no tocas eso»).

## ⏩ Estado 29-sep (mañana)

- **Plan de 3 semanas** (30-sep → 20-oct): [`cola/plan-3-semanas/MAPA.md`](../cola/plan-3-semanas/MAPA.md)
  — recorrido video → web → comunidad → ONIA, 3 videos/día (A tutorial · B actualidad · C YouTube
  o negocio/historia), 3 carruseles/semana, calendario día por día y lista «antes de grabar».
  Guiones: `S1-GUIONES.md` · `S2-GUIONES.md` · `S3-GUIONES.md` (63 piezas; 56 nuevas). **Sin
  aprobación de Sergio todavía: él dijo «primero veamos qué sabés y yo te corrijo».**
- **Base del plan** (en `references/marca-personal/`): INVENTARIO (67 unidades reales de ONIA),
  FORMULAS (8 fórmulas de referentes), RADAR (16 novedades con fuente primaria), SANTIAGO
  (método de carruseles).
- **Carruseles:** método de Santiago adaptado (Higgsfield pinta la imagen, el texto va por
  código): `scripts/carousel_images.mjs` + skill `hermes-content/skills/carruseles-onia.md`.
  K1–K3 renderizados con portada (`carousels/out/sergio-k1..k3-*-20260929/`). K4–K9: brief +
  vista previa; **imagen pendiente de aprobación** (≈0,72 cr). Gasto del día: 0,60 cr (bitácora
  en `ONIA_MARCA_PERSONAL_HIGGSFIELD_RECETAS.md`).
- **El CLI de Higgsfield solo está logueado en el VPS**; en la PC `higgsfield account` da «Not
  authenticated». El script corre por ssh con `HF_CMD`. Loguear la PC = OAuth en el navegador de
  Sergio (su clic).
- **Decisiones que esperan a Sergio:** (1) ¿1 de cada 3 videos para dueños de negocio (etapa 1 =
  clínicas) o 100 % marca personal? (2) S-09 «agentes sin LLM» contradice cómo se vende el
  producto. (3) ¿Láminas interiores ilustradas como Santiago (hay que agregar el tipo al pack) o
  solo portada?
Los otros cinco handoffs de este carril quedan como HISTORIA (ver §Historial): la próxima
sesión, Codex o Claude, empieza ACÁ y edita ESTE archivo.

## 1. Objetivo de la sesión

Que Sergio Urcullo pueda grabar: un solo archivo de guiones que enseñen de verdad, sobre
temas actuales verificados y ejemplos reales de ONIA, con el trabajo disperso de Codex
rescatado en una sola rama.

## 2. Qué quedó hecho (en `main` vía rama `claude/marca-personal-contenido-ae658c`)

- **Guiones para grabar:** [`cola/GUIONES-PARA-GRABAR-2026-09-29.md`](../cola/GUIONES-PARA-GRABAR-2026-09-29.md)
  — 1 YouTube (Opus 5.5 vs Sonnet 5.5) + 9 verticales + 5 ideas POV Ray-Ban + enseñanza.
  **Sin aprobación editorial de Sergio todavía.**
- **Producción:** [`cola/PRODUCCION-GUIONES-2026-09-29.md`](../cola/PRODUCCION-GUIONES-2026-09-29.md)
  — fuentes verificadas el 28-sep, las dos pruebas ejecutadas con sus salidas, pantallas por
  pieza y los 6 drops que tienen que estar en la comunidad ANTES de publicar cada video.
- **Rescate:** las cuatro ramas de Codex del carril (`codex/marca-comunidad-plan`,
  `codex/marca-sergio-guiones-20260927`, `codex/guiones-referentes-20260928`,
  `codex/guiones-reinicio-20260928`) quedaron mergeadas en esta rama. Conflictos resueltos:
  `RODAJE-MARCA-PERSONAL-2026-09-27.md` → versión 28-sep (referentes);
  `ONIA_MARCA_PERSONAL_TRES_CARRILES.md` → se conservan las decisiones de Sergio del 21-sep
  (pilares, estructura diaria) + el párrafo «el cómo sí va» del 28-sep;
  `COORDINATION_MANIFEST.md` → ambas entradas.

## 3. Qué quedó a medias y dónde

- **Nada grabado, nada publicado.** Postiz daba 502 el 27-sep; no se tocó.
- **Drops de comunidad** (6, en PRODUCCION §Drops): escritos, NO publicados en Announcements.
- **Carruseles** SERGIO-CAR-01/02/03-V2: listos y verificados por Codex el 27-sep, esperan
  aprobación: `cola/APROBACION-CARRUSELES-SERGIO-2026-09-27.md`.
- **Rama `codex/sergio-vault-growth`** (21-sep) NO se mergeó: toca `sitio-sergiourcullo/*` y
  `scripts/carousel_*.js` con tests. Publicar la web es permiso aparte; decidir con Sergio.
- **Cotizador demo** (`cola/cotizador-tarjetas-demo.html`): falta probar en navegador real.

## 4. Archivos

`cola/GUIONES-PARA-GRABAR-2026-09-29.md` · `cola/PRODUCCION-GUIONES-2026-09-29.md` ·
`handoff/marca-personal.md` (este) · assets de Opus: `hermes-content/captures/opus-5-5/`.
Fuentes de estructura: `ONIA_ESTRUCTURA_PUBLICACION_DIARIA.md` (reparto 10-13, Samuel hace
pilar y yap), `ONIA_DONDE_VA_CADA_COSA.md` (Instagram · YouTube · web · Onia Community).

## 5. Intentos fallidos y por qué (lo que NO hay que repetir)

1. **Cada sesión de Codex arrancaba de `main` y no veía la rama anterior** → repetía la
   investigación de referentes y reescribía desde cero. Causa raíz de los «errores tontos».
   Regla: al cerrar, el trabajo del carril se mergea a `main` o se nombra acá con su rama.
2. **Ejemplos inventados** (taller de bicicletas, imprenta) → guiones intercambiables con
   cualquier creador. Sergio los rechazó por «vacíos». Usar lo real de ONIA.
3. **Disclaimers a cámara** («todavía no ejecutamos la prueba») → si hay que probar, se prueba
   ANTES de escribir. Claude puede correr Opus y Sonnet con subagentes (`model: opus|sonnet`)
   sin login de CLI; Codex no pudo porque `claude auth status` da `loggedIn:false`.
4. **Premisa sin probar:** el guion de Codex daba por hecho que la IA promete la entrega.
   Probado el 28-sep: Sonnet 5.5 no lo hizo ni sin regla. Probar la premisa antes del guion.
5. **Mismo tema repetido** (cotizador en 4 de 10 piezas) aunque Sergio había pedido variedad.
6. **Investigación sin cierre:** horas releyendo perfiles. Las fichas ya están en
   `references/marca-personal/EXTRACCION-REFERENTES-GUIONES.md` y `references/video-intake/`.
7. **Cinco handoffs para un carril**, con fecha en el nombre. Ahora uno solo: este.
8. **1-oct WhatsApp:** la memoria dice que cambia el cobro de mensajes de servicio; la página
   oficial consultada el 28-sep no lo confirma para LatAm. No publicarlo sin fuente primaria.

## 6. Qué depende de Sergio Urcullo

- Aprobar (o corregir) los 10 guiones y grabarlos.
- Aprobar los 3 carruseles del 27-sep (texto exacto en `APROBACION-CARRUSELES-...`).
- Publicar los drops en Announcements (o autorizar a publicarlos).
- Decidir `codex/sergio-vault-growth` (cambios a la web personal).

## 7. Próximos pasos

1. Cuando Sergio grabe: localizar el bruto, pipeline `editor-videos` (tabla de cortes a
   Sergio ANTES de cortar; transcript leído a ojo).
2. Publicar el drop de cada pieza antes que la pieza.
3. Tanda siguiente: temas del banco (PRODUCCION §Banco) + lo que haya salido esa semana,
   verificado contra fuente primaria el mismo día. Formato: resultado primero → pasos exactos
   → prueba → cierre en comunidad/web.

## Historial (no es fuente; se conserva)

`EDICION-MARCA-PERSONAL-2026-09-21.md` · `marca-personal-carruseles.md` ·
`marca-sergio-guiones-20260927.md` · `REINICIO-GUIONES-2026-09-28.md` ·
`CONTINUAR-GUIONES-CLAUDE-2026-09-28.md`.
