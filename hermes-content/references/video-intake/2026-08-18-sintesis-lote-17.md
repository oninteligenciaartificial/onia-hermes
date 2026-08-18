# Síntesis — 17 ítems de Instagram

## 1. Lo que hay que aprender a hacer (carril A, por técnica)

### T1 — Sustitución de objeto conservando al humano real (`video_edit`)
**Ítem:** DcJ2NFlCw9D.
**Qué produce:** el MISMO plano filmado con celular, con un objeto reemplazado (auto barato → Mustang / Corvette C8 / descapotable). Real: la persona, su ropa, sus gestos, el fondo, la luz y el movimiento de cámara. Sintético: únicamente el objeto.
**Insumos:** un video vertical 9:16 filmado con celular por el propio creador. Nada de estudio. Plantillas cortas filmadas sueltas (se ven cielos de días distintos).
**Prompt:** no se muestra en ninguno de los 7 fotogramas. No es recuperable de ese reel.
**Por qué importa:** elimina de raíz el problema caro de la IA de video (sostener una cara entre planos) simplemente no generándola.
**Repetible con lo nuestro:** sí, verificado contra la cuenta. `seedance_2_5` con `mode: "video_edit"` ("edit one reference video; billed by that video's duration; duration y aspect_ratio se ignoran"), 4–30 s, 480p/720p/1080p, 9:16. Cuidado de gasto: se factura por la duración del video FUENTE → filmar plantillas de 5–8 s y montar después.

### T2 — Transformación por dos keyframes (start_image + end_image)
**Ítem:** DakoqucxYpW.
**Qué produce:** una transformación imposible entre estado A y estado B dentro de un solo plano (persona seca → empapada por un derrumbe de agua del techo).
**Insumos:** 2 clips REALES filmados con celular, mismo encuadre y mismo lugar (seca / mojada — verbatim del método: "Just take the shower in the clothes"), y un screenshot de cada clip. Cero generación de imagen.
**Estructura del prompt (la parte que sí se ve):** encuadre fijo declarado ("Static front-facing shot") → evento violento a mitad de toma → **cláusula de persistencia** que obliga a que el destrozo creado en el medio siga existiendo en el keyframe final → bloque técnico (simulación física, iluminación, "single continuous shot, no camera movement, photorealistic, 4K").
**Patrón reusable, literal:** `The final frame must inherit the [X] from the first frame. [X] is a part of the environment and must still exist in the last frame. Don't make [X] disappear.` — es exactamente lo que la autora NO regala y solo aparece en la versión del resultado final.
**Consistencia:** no la resuelve el modelo, la resuelve el insumo (misma persona, misma habitación, misma ropa, misma luz).
**Repetible con lo nuestro:** sí, y sin pagar renoise.ai (que es un revendedor de los mismos proveedores). `seedance_2_0` en nuestra cuenta acepta `start_image` + `end_image`, 9:16, 4–15 s, 1080p/4k, `generate_audio`; `seedance_2_0_mini` hace lo mismo más barato.

### T3 — Consistencia de personaje por set de anclas (`omni_reference`)
**Ítem:** Db6GCW8N6sz (anuncio del propio Higgsfield).
**Qué produce:** la misma persona sintética en escenarios distintos, sosteniendo un producto real en cuadro.
**Insumos:** no se muestran. Por el modo, el mínimo sería 1 foto de identidad + 1 packshot del producto — **es inferencia, no está dicho**.
**Método visible y copiable:** el ancla no es solo la cara, es un SET fijo — corte bob rubio, top bandeau de leopardo, dos cadenitas superpuestas, argollas, dos anillos grandes, smartwatch negro, uñas rosa almendra. Ese set se repite idéntico interior/auto. Coincide con lo ya fichado en `2026-08-15-bloquear-identidad-avatar-anclas.md`.
**Prompt:** no se muestra.
**Repetible con lo nuestro:** sí — `seedance_2_5` modo `omni_reference`, 4–30 s, 9:16, `generate_audio`. Con gasto: `unlim.available = false`, y 2.5 ni siquiera figura entre los que soportan unlim.
**Cobertura pobre declarada:** solo 2 fotogramas y transcripción de audio VACÍA (1 byte).

### T4 — Prompt largo estructurado de foto fotorrealista + negative prompt
**Ítems:** DbgN-8CDVc- (8 prompts completos), DcEIPU_keNv (6 personas, prompts retenidos), DcDy6VVjsO7 (colección "Realism", prompts retenidos).
**Qué produce:** imagen fija fotorrealista tipo editorial / campaña / snapshot. **Ninguno de los tres resuelve consistencia de cara**: son personas distintas en cada lámina.
**Insumos:** ninguno declarado en los tres. Texto a imagen.
**Estructura del prompt (de DbgN-8CDVc-, idéntica en las 8 láminas):**
1. Apertura fija: `Ultra-realistic vertical [género] photo of...`
2. Sujeto con acción concreta, no adjetivo.
3. Rasgos físicos enumerados (pelo, piel, maquillaje, expresión, dirección de la mirada).
4. Vestuario prenda por prenda, con material y color.
5. Pose explícita, miembro por miembro.
6. Fondo como lista de objetos.
7. Bloque técnico de cámara/película + una frase de referencia de género.
8. `Negative prompt:` — bloque casi constante (CGI, cartoon, plastic skin, beauty filter, over-retouched, bad anatomy, extra fingers, HDR, studio lighting, over-sharpening, blurry subject, text, watermark) + 2-3 términos específicos del sujeto.

**La palanca real del realismo (leída de las imágenes de los tres ítems):** pedir SUCIEDAD explícita y prohibir lo pulido. Piden "scratches and dirt marks", "stained plush fur", "peeling paint, rust marks", "harsh direct camera flash", "slight film grain", "muted colors"; el negative ataca justo lo contrario ("beauty filter", "clean costume", "perfect background", "studio lighting"). DcEIPU_keNv agrega seis ejes legibles sin prompt: imperfección de piel, luz dura de sol, encuadre de selfie torcido, contexto banal verificable, marcas reales, defectos de cámara. DcDy6VVjsO7 agrega el atajo más barato: **elegir caras con edad y textura real** en vez de modelos jóvenes perfectas.
**Repetible con lo nuestro:** el texto sí, hoy. **Pendiente antes de armar la plantilla:** verificar (consulta gratis al catálogo) cuáles de nuestros motores aceptan un campo `Negative prompt` separado — varios lo ignoran o exigen meterlo en el positivo.

### T5 — Edición generativa de fotos propias ("color grading")
**Ítem:** DcGfkVRCmiz.
**Qué produce:** pares antes/después de fotos de celular mal expuestas. **Se vende como color grading pero en 3 de los 5 pares es edición generativa**: inventa nubes, degradés de atardecer y cielo despejado que no existían en el "before".
**Insumos:** fotos propias de celular mal expuestas.
**Prompt:** retenido detrás del cebo. Herramienta nombrada solo en el caption: "Nano Banana 2", sin captura de UI.
**Repetible:** probable, escribiendo nosotros el prompt con la estructura de T4. Prueba barata: 5 fotos malas de un cliente real, una pasada, comparar.
**Límite a fijar antes de venderlo:** retoque de luz y color sí; inventar entorno no.

### T6 — Lámina gráfica: generada vs compuesta a mano
**Ítem:** DcGUUb9h3ZO (Ae "2 HOURS" vs Gemini "10 MINUTES").
**Qué produce:** un póster de marketing. **La lección es el error, no la promesa:** en el segundo fotograma el lado "Gemini/10 minutos" que vende como superior tiene el texto reventado ("is the real money" y encima "is al money" duplicado), "money" en verde fuera de paleta y un emoji intruso. El lado After Effects es el limpio.
**Regla que confirma para nuestro pipeline:** el modelo de imagen genera FONDO y SUJETO; el TEXTO nunca se hornea en la generación, va en HTML sobre HyperFrames, donde tipografía, color y ortografía son deterministas.
**Prompt:** ninguno visible.
**Cobertura pobre declarada:** 2 fotogramas, audio existente sin transcribir, sin caption.

---

## 2. Los prompts que quedaron a la vista

Solo **3 de 17 ítems** dejaron texto de prompt legible en pantalla.

### DakoqucxYpW — versión 1 (la que teclea en cámara, frame 05, legible al 100%)
> "Static front-facing shot of a woman. Out of nowhere, an enormous wall of water violently bursts through the ceiling and crashes directly onto her, completely soaking her within a split second. Water keeps pouring down, quickly flooding the room. Hyper-realistic water simulation, natural physics, cinematic impact, dramatic lighting, authentic surprised reaction, single continuous shot, no camera movement, photorealistic, 4K."

### DakoqucxYpW — versión 2 (la que figura junto al resultado final, frame 06, cortada por el borde de la pantalla; `[...]` = texto no visible)
> "Static front-facing shot of a woman. Out[...] nowhere, an enormous wall of water vi[...] bursts through the ceiling and crashe[...] her, completely soaking her within a [...] The final frame must inherit the ceil[ing hole] from the first frame. The hole is a p[art of] the environment and must still exi[st in the last] frame. Don't make the ceiling ho[le disappear] keeps pouring down, quickly flo[oding...] staying on the floor. Hyper-rea[listic water] simulation, natural physics, a[...] reaction, single continuous [shot, no camera] movement, no music, phot[orealistic, 4K]"
>
> Metadata al pie del resultado: "Seedance 2.0 · 9:16 · 4sec".

### DcJSXVwAu7z — comandos y prompt de Claude Code (literales en pantalla)
> `claude --name frontend`
> `claude --name backend`
> Prompt dentro de la sesión rotulada "frontend": `Dile a "backend" que hemos terminado de mejorar el diseño de la web.`

### DbgN-8CDVc- — 8 prompts completos, uno por lámina

**Lámina 2 (mujer dentro de tobogán T-Rex) — única sin negative prompt:**
> "Ultra-realistic vertical editorial fashion photo of an adult woman sitting inside the open mouth of a giant T-Rex playground slide. The dinosaur head fills most of the frame, gray-green plastic with sculpted scales, wrinkles, big amber eye, white cone teeth, and a worn orange slide interior with scratches and dirt marks. The woman sits centered inside the mouth, calm and confident, looking at the camera. She has short dark brown hair, fair skin, natural makeup, and wears a sheer pale-blue ruffled blouse with dramatic layered frills, light denim shorts, and beige slouchy knee-high boots. One leg is bent, the other extended forward. Outdoor suburban playground background: grass, swing set, houses, trees, blue sky. Natural daylight, soft shadows, slight film grain, faded editorial color, shallow depth of field, realistic fashion-magazine feel."

**Lámina 3 (mujer junto a heladera abierta, look flash 35mm):**
> "Ultra-realistic vertical flash photo with a raw 35mm film look, showing an adult woman standing beside an open refrigerator in a small kitchen. She has short black bobbed hair, warm tan skin, natural makeup, and a calm direct expression looking into the camera. She wears a simple fitted white sleeveless bodysuit and holds a tall beer can in one hand while lightly pulling the fabric at her hip with the other. The fridge is open with shelves, bottles, condiments, and small items inside; the fridge door has taped photos/art prints and several bottles on top. Lighting feels like harsh direct camera flash in a dim indoor room: strong shadows, slight grain, soft focus edges, muted colors, realistic skin texture, candid amateur-film aesthetic, intimate apartment snapshot mood. Negative prompt: CGI, cartoon, plastic skin, beauty filter, over-retouched, bad anatomy, extra fingers, distorted hands, warped fridge, unreadable messy labels, HDR, studio lighting, over-sharp, blurry face, watermark."

**Lámina 4 (Estatua de la Libertad con campera inflable amarilla):**
> "Ultra-realistic vertical surreal editorial photo of the Statue of Liberty wearing an oversized glossy yellow puffer jacket. The statue keeps its original pale green copper face, crown, raised torch, and stone pedestal, but the body is wrapped in a huge inflated quilted winter coat with realistic nylon shine, puffed seams, folds, and shadows. Shot from a low angle, centered composition, bright daylight, clear blue sky with soft clouds. New York skyline and water are visible in the background, slightly softened by depth of field. Clean high-end fashion campaign feeling, realistic scale, crisp details, vibrant but natural color, no cartoon or CGI look. Negative prompt: cartoon, illustration, CGI, fake plastic texture, warped statue, distorted torch, bad anatomy, messy jacket seams, low resolution, HDR, over-sharpening, text, watermark."

**Lámina 5 (caballo tordillo contra cielo azul):**
> "Ultra-realistic vertical wildlife portrait of a gray dappled horse against a clear deep blue sky. Close-up framing from chest to head, shot from slightly low angle, with the horse facing forward. Long black mane blows dramatically across the face and to the left in strong wind, partially covering the eyes, with detailed flowing hair strands and natural shine. The horse has textured gray-and-black speckled coat, dark muzzle, upright ears, strong neck, realistic shadows, and crisp sunlight highlights. Minimal background, only clean blue sky, creating a powerful elegant portrait. Natural daylight, high-detail photography, sharp focus on horse face and mane, realistic fur texture, subtle grain, no artificial effects. Negative prompt: CGI, cartoon, fantasy horse, plastic texture, deformed face, extra ears, distorted mane, blurry subject, HDR, over-sharpening, text, watermark."

**Lámina 6 (retrato de estudio, mujer en cuclillas con blazer):**
> "Ultra-realistic vertical studio fashion portrait of an adult East Asian woman crouching against a plain blue-gray backdrop. She has messy shoulder-length black hair, pale natural skin, sharp eyeliner, minimal makeup, and a calm serious expression while looking directly at the camera. She wears an oversized charcoal-gray blazer, bare legs, and black leather platform boots with chunky heels. Pose is low crouched, knees bent, one hand relaxed near the floor, body angled slightly sideways. Moody editorial lighting with cool blue tones, soft spotlight on the face, strong shadow cast on the wall behind her, subtle film grain, realistic skin texture, muted colors, high-fashion magazine feel. Negative prompt: CGI, cartoon, plastic skin, beauty filter, bad anatomy, extra fingers, distorted boots, warped face, HDR, over-sharpening, blurry subject, text, watermark."

**Lámina 7 (astronauta en Marte con salvavidas de dinosaurio):**
> "Ultra-realistic vertical sci-fi editorial photo of an astronaut standing on a Mars-like desert landscape, wearing a full white space suit with a reflective golden visor and backpack life-support unit. Around the astronaut's waist is a bright yellow inflatable dinosaur pool float, glossy plastic, playful and surreal, with a cartoon dinosaur head and raised tail. Background: red rocky Martian terrain, scattered stones, distant dusty mountains, warm orange sky, cinematic desert haze. Centered full-body composition, natural sunlight, soft shadows on the ground, realistic suit fabric, dust, plastic reflections, and high-detail textures. The mood is funny, surreal, and realistic at the same time, like a premium space-fashion campaign. Negative prompt: cartoon, CGI, fake plastic texture, bad suit anatomy, distorted helmet, warped inflatable, extra limbs, blurry subject, over-HDR, low resolution, text, watermark."

**Lámina 8 (hombre barbudo a contraluz con halcón en el hombro):**
> "Ultra-realistic vertical editorial portrait of an adult bearded man in dark clothing, shown in side-profile silhouette against a soft purple-blue dusk sky. A falcon rests on his shoulder close to his head, sharply detailed with brown patterned feathers, pale chest, alert eye, and golden talons. The man's face and upper body are mostly shadowed, with warm rim light on his hair, ear, beard, and cheek. Add intentional motion blur / long-exposure ghosting around his body and arm, while keeping the falcon and head area more defined. Dreamy cinematic mood, grainy film texture, muted sunset colors, soft focus edges, mysterious desert/falconry editorial feel. Negative prompt: cartoon, CGI, plastic skin, distorted bird, extra wings, bad anatomy, warped face, over-sharp HDR, flat lighting, noisy artifacts, text, watermark."

**Lámina 9 (botarga de pantera rosa gastada en un callejón):**
> "Ultra-realistic vertical editorial street photo of a worn pink cartoon panther mascot sitting slouched on a dirty white plastic chair in a gritty alley. The mascot suit is faded, dusty, torn in places, with stained plush fur, oversized paws and feet, round ears, sunglasses, and a tired open-mouth expression. It wears a dirty white T-shirt with bold black text reading \"CHASE YOUR DREAMS.\" One hand holds a cigarette with visible smoke drifting upward, the other rests lazily on the chair. Background is a scratched dusty pink metal wall with peeling paint, rust marks, trash, cigarette butts, and cracked concrete floor. Raw documentary style, natural daylight, muted colors, realistic grime, soft shadows, subtle film grain, dark humor, absurd mascot realism, not cute or polished. Negative prompt: cartoon, CGI, clean costume, glossy plastic, perfect background, bad anatomy, extra fingers, distorted mascot head, unreadable shirt text, over-HDR, studio lighting, blurry subject, watermark."

**Sin ningún prompt visible:** DcJ2NFlCw9D, DcGUUb9h3ZO, Db6GCW8N6sz, DcGfkVRCmiz, DcEIPU_keNv, DcDy6VVjsO7, DcAIGCCINJF, DcBOQF5t61t, DbYqMnpRrmk, Db3AW3SooRl, DcEITCmoSHX, Db3x_rPFHl8, DbmN3AfiYPz, Db8hFCFFTZg (este último sí trae código GSAP literal, no prompt).

---

## 3. Lo informativo que sirve (carril B)

**SIRVE_YA**
- **DcJSXVwAu7z** — `claude --name <nombre>` verificado en nuestra instalación (`-n, --name`: nombre de sesión en prompt box, `/resume` picker y título de terminal): adoptarlo ya por carril; lo NO verificado es que dos sesiones se manden mensajes entre sí, prueba de 3 minutos antes de prometerlo.
- **DcEITCmoSHX** — popup multi-paso con capturas reales (Nike 1/10 → gruns 10/10): el paso 1 es un CLIC que segmenta, el email recién después; portar a web-factory con WhatsApp en vez de SMS, sin el confirmshaming.
- **Db8hFCFFTZg** — secuencia de PNGs en canvas atada al scroll con GSAP ScrollTrigger (`snap:"frame"`, `ease:"none"`, `scrub:0.5`, `onUpdate:render`); GSAP ya está autorizado en el repo, el patrón no existe (grep `drawImage` = 0), y el bloqueante real es el peso (69 KB/frame).
- **Db3x_rPFHl8** — 5 dispositivos creativos reusables como plantillas de brief y de prompt de imagen (sacar de contexto, temperatura, tacto, "si fuera otro producto", merch inventado); las piezas mostradas no están creditadas y varias parecen spec, no campañas oficiales.

**MEJORA**
- **DcBOQF5t61t** — gancho vacío (el contenido está en un caption que no se leyó); lo aprovechable es el formato faceless de 5-8 s con B-roll de escritorio y dos láminas de texto.
- **DbYqMnpRrmk** — contenido de derecho colombiano (DIAN, S.A.S.) inaplicable en Bolivia; lo que se copia es la gramática del explicador de autoridad: eyebrow de 3 actos, diagrama que se arma capa por capa sincronizado con la voz, karaoke con keyword dorada, logo fijo.
- **Db3AW3SooRl** — la arquitectura 1+N (un video de conversión anclado + N piezas cuyo único KPI es empujar hacia él) sirve; el disfraz de "bajar las defensas" choca con nuestra regla de declarar; sus cifras no se repiten.
- **DcAIGCCINJF** — el "equipo de 7 empleados IA" ya lo tenemos y más verificado; lo único que sirve es la plantilla de carrusel parametrizable (pager, eyebrow, tarjetas, chips, pasos, dots), poniendo capturas reales donde ellos ponen cifras dibujadas.

---

## 4. Lo que se descarta y por qué

- **DbmN3AfiYPz — HUMO, cerrado.** Noticiero reciclado sin una sola fuente, con el contador roto (rotula "1/4", "2/4" y después "3/3"), un hook ("CANCELADAS") que ninguna noticia sostiene y el caption pegado 8 veces. Ninguna de las tres novedades cambia lo que vendemos. Única pista, y solo como tarea de verificación contra fuente primaria (Moonshot/HuggingFace), nunca como dato: si Kimi K3 existiera abierto y gratis, importaría por costo del chatbot.
- **No volver a buscar el prompt de DcGfkVRCmiz, DcEIPU_keNv, DcDy6VVjsO7 ni DcAIGCCINJF.** Los cuatro lo retienen detrás del cebo y ninguno lo muestra en lámina. Ya está extraído todo lo extraíble (ejes de realismo, batería de 5 registros, plantilla de carrusel). Escribir nuestro prompt con la estructura de T4 sale más barato que comentar.
- **DcBOQF5t61t queda cerrado con el eje contenido SIN EVALUAR**, y así hay que dejarlo: 2 fotogramas, audio existente sin transcribir, caption no leído.
- **DbYqMnpRrmk: descartar el contenido, quedarse con la forma.** Ley extranjera; repetirla en Bolivia sería el error exacto que la regla de contabilidad prohíbe.
- **Db6GCW8N6sz: no re-analizar por receta.** Es publicidad del propio vendedor, sin insumos ni prompt a la vista, y su oferta ("33 DAYS UNLIMITED") está verificada como falsa para nuestra cuenta.
- **Ítems con cobertura pobre que NO conviene reabrir sin transcribir el audio primero** (reabrirlos sin eso da lo mismo que ya hay): DcJ2NFlCw9D, DcJSXVwAu7z, DcGUUb9h3ZO, DcEITCmoSHX (faltan además las notas 2, 4, 5 y 8), Db8hFCFFTZg, DbYqMnpRrmk, Db6GCW8N6sz (transcripción de 1 byte).

---

## 5. Lo transversal

1. **12 de 17 ítems cierran con cebo** (11 con "comenta X / DM" y 1 con "Lee abajo"). Pero el cebo NO es señal de que falte el método: en 6 (DbgN-8CDVc-, Db3x_rPFHl8, DakoqucxYpW, DbYqMnpRrmk, Db3AW3SooRl, DcJ2NFlCw9D) el método completo estaba en pantalla y quedó extraído sin comentar nada; en los otros 6 (DcGUUb9h3ZO, DcGfkVRCmiz, DcEIPU_keNv, DcDy6VVjsO7, DcAIGCCINJF, DcBOQF5t61t) el cebo sí retiene el entregable. **Regla operativa: el cebo no descalifica; lo que descalifica es que el contenido no esté en las láminas.**

2. **Seedance 2.5 existe hoy en nuestra cuenta — 3 ítems lo verificaron por separado y coinciden** (DcJ2NFlCw9D, DakoqucxYpW, Db6GCW8N6sz): `seedance_2_5`, Bytedance, modos `t2v` / `omni_reference` / `video_edit` / `video_extension`, 4–30 s, 480p–1080p, 9:16. Eso **CORRIGE `METODO_DE_ANALISIS.md` líneas 35-38** y las 6 fichas del corpus que dicen "no existe, hay seedance_2_0, tope 15 s" (el tope de 15 s es de 2.0). El ejemplo del doc caducó; la regla (verificar contra la cuenta antes de escribir) se queda. **Lo que sigue siendo falso: la ventana ilimitada — `unlim.available = false`, y 2.5 ni siquiera figura entre los que soportan unlim.** Toda generación con 2.5 consume créditos → permiso explícito de Sergio.

3. **8 de los 10 ítems con audio quedaron sin transcribir** (uno con archivo de 1 byte). Es un fallo del pipeline, no de los videos: los dos que sí se transcribieron (DakoqucxYpW, Db3AW3SooRl) son justamente los que entregaron el método hablado completo. Y Whisper degrada términos técnicos ("see dance 2.0" = Seedance, "viesel" = VSL, "tofumo o furofumo" = TOFU/MOFU/BOFU, "Theme 2 clips" = "Film 2 clips") → nunca citar un término técnico de transcripción sin contrastarlo con la imagen.

4. **6 de 17 esconden el motor** (DcGUUb9h3ZO dice solo "Gemini"; DbgN-8CDVc- lo llama "the machine"; DcEIPU_keNv, DcDy6VVjsO7, DcBOQF5t61t y DcAIGCCINJF no lo nombran). Los 5 que sí lo declaran en pantalla (DcJ2NFlCw9D, DakoqucxYpW, Db6GCW8N6sz, DcJSXVwAu7z, Db8hFCFFTZg) son exactamente los que quedaron VERIFICADO o SIRVE_YA. Correlación directa entre declarar la herramienta y ser reproducible.

5. **5 tiran cifras sin ninguna fuente** (DcGUUb9h3ZO "2 HOURS / 10 MINUTES"; Db3AW3SooRl 105.640 / 20.000.000 / 300.000 USD; DcAIGCCINJF "2.4M views +152%" dibujado como post-it; DbmN3AfiYPz "3x veces más grande"; DcBOQF5t61t "5 automatizaciones necesarias"). Ninguna se repite. En 2 de ellos la "prueba" es directamente una ilustración de diseño o el estilo de vida del creador.

6. **El problema de consistencia de cara sigue sin resolverse en 17 ítems.** Las dos técnicas que lo "resuelven" (T1 y T2) lo hacen NO generando al humano — usan metraje real. La única que lo enfrenta de verdad (T3, omni_reference con set de anclas) es un anuncio del propio vendedor sin insumos a la vista. Los tres carruseles de realismo muestran caras todas distintas. **Consecuencia para Lucía: nada de este lote reemplaza Soul+texto; T1 y T2 no le sirven porque no hay clip real que filmar.**

7. **El humano real como ancla es el hallazgo comercial del lote.** T1 y T2 dan el mismo formato de venta B2B: filmar al cliente en su negocio real y sustituir SOLO la pantalla / el escritorio por ONIA, o dos keyframes (escritorio con papeles → escritorio con el panel) con la cláusula de persistencia. Es la comparación irrefutable que ningún demo grabado consigue, y el insumo lo pone el celular del propio cliente.

8. **5 ítems apoyan todo en subtítulo quemado** (DcJSXVwAu7z karaoke amarillo de 2-3 palabras; DbYqMnpRrmk keyword dorada; Db3AW3SooRl doble altura dicho-gris / activo-blanco; Db8hFCFFTZg una palabra amarilla sobre la costura; DcEITCmoSHX una línea) — y uno de ellos publicó **dos faltas de ortografía quemadas en 10 fotogramas** ("A GENERADO", "ARANA" sin ñ), salidas del auto-transcriptor sin revisar. **Gate para `editor-videos`: el SRT se revisa a ojo antes de quemarlo, con foco en ñ y acentos.** En B2B boliviano una falta quemada cuesta la credibilidad que el video intenta construir.

9. **5 ítems usan comparación en un solo cuadro** (barrido split-screen IA/real; split 2h vs 10min; antes/después apilado; cara+terminal; cara+captura). El truco de oficio no es el copy: es la jerarquía — el ganador es más grande y está más arriba, el perdedor achicado y hundido. El ojo decide antes de leer. Es montaje puro, sale de HyperFrames sin gastar un crédito.

10. **Tres reels distintos comparten el mismo esqueleto de tutorial:** resultado primero (segundo 0), "así se hace", un paso por plano con una sola palabra en pantalla, y romper a cara completa en el gancho y en el CTA. Reproducible hoy con `embedded-captions` + `talking-head-recut`, sin generación paga.