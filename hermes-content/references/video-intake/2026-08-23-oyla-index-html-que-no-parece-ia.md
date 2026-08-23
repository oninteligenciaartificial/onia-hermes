# OYLA — el index.html suelto que no parece hecho con IA

- **Fuente:** https://www.instagram.com/p/DaVV7JjIY9I/
- **Tipo:** MIXTO (WEB + MARKETING)
- **Veredicto:** SIRVE YA
- **Cobertura:** 21 de 43 fotogramas (6/6 `base_*` + 15 `texto_*`). Sin voz — Gemini, que oye el audio, reporta solo música y "sin diálogo hablado"; el mensaje va 100% por texto en pantalla.

## Que muestra, textual

**Texto en pantalla (verbatim, es lo que manda):**

- [0:00–0:02, centrado] `Fable 5 is back.` / `Your sites still look AI.`
- [~0:02, sobre negro pleno] las mismas dos líneas
- [0:06–0:10, abajo-izquierda] `I packed my free workflow and prompts` / (línea en blanco) / `comment/DM – "PROMPT"`

**Texto DENTRO del sitio filmado (verbatim, leído de los fotogramas):**

- Logo `OYLA` (con un óvalo/ojo dibujado encima de la O)
- Nav: `ABOUT` · icono hamburguesa · `( BAG )`
- Hero: `MEASURED PURITY` + botón `DISCOVER ⊕`
- Barra de URL de Safari: `file:///Users/dmitry/Downloads/oyla/index.html`, pestaña titulada `prompt`
- Bloque editorial: `Made Without Compromise` + `Each ring is forged by a single pair of hands — no factory floor, no assembly line. The material is chosen first; the form follows its nature.` / `We work in oxidized silver, blackened bronze, and raw brass. Weights are deliberate. Edges are left where they fall. Nothing is smoothed for comfort.` / `OYLA exists for those who wear jewelry that means something. Not decoration — declaration. One piece at a time, made to last a lifetime.` + `VIEW COLLECTION ⊕`
- Paneles de la derecha, en orden: `Every ring crafted by a single artisan, start to finish` → `14–92g / Per piece` + `Deliberate weight — each ring is a physical presence you feel` → `Sterling & Silver` + `Oxidized metals only — no plating, no compromise` → `Lifetime Guarantee` + `We stand behind every piece we make, forever`
- Grilla de producto: `Shadow Sigil $740`, `Matte Skull $850`, `Obsidian Coil $480`, `Void Arc $560`

**Caption** (estructura + fragmentos verbatim; no se reproduce entera): abre con `"Fable 5 didn't raise the bar. / It exposed it."`, sigue con el argumento de que el mismo modelo en diez manos da diez resultados distintos `"Not because the AI changed. / Because the thinking behind it did."`, diagnostica que sin brief real la IA rellena con `"the most average solution it knows"` y por eso `"so many AI-built sites feel identical"`, cierra en `"Better tools don't fix weak inputs. / Better workflows do."` y ofrece la guía gratis con los prompts. Hashtags: `#fable5 #website #claude #vibecoding`.

## Como esta hecho — la reconstruccion

### Eje WEB — el mecanismo, no el adjetivo

**El dato que cambia todo: la barra de URL dice `file:///Users/dmitry/Downloads/oyla/index.html`.** No hay framework, no hay build, no hay deploy, no hay CMS. Es **UN archivo HTML estático suelto en Downloads, abierto en Safari**. Todo lo que se ve abajo está dentro de ese único archivo. Eso es exactamente el output de un flujo `image-to-code` — y es la razón por la que esto es portable hoy y no un proyecto.

Cuatro mecanismos concretos, en orden de valor:

1. **Split sticky — columna fija contra columna en scroll.** Es el patrón más fuerte del sitio. La mitad IZQUIERDA (`Made Without Compromise` + los 3 párrafos + `VIEW COLLECTION ⊕`) queda **congelada** mientras la mitad DERECHA desfila por cuatro paneles apilados (`Every ring crafted…` → `14–92g Per piece` → `Sterling & Silver` → `Lifetime Guarantee`). Verificado comparando `texto_004_08` y `texto_005_02`: el texto de la izquierda es idéntico píxel a píxel, el de la derecha cambió entero. Mecanismo: `position: sticky; top: 0` en la columna izquierda dentro de un contenedor grid de 2 columnas; la derecha en flujo normal. No hace falta JS.

2. **Hero pinneado con media que escala.** El titular `MEASURED PURITY` + `DISCOVER ⊕` se quedan clavados abajo-izquierda mientras el media detrás pasa de plano general (modelo con las dos manos hacia cámara) a primerísimo plano de la mano con los anillos. Comparar `texto_002_05` (plano general) contra `texto_002_08` (macro de la mano) — mismo titular, misma posición, media completamente distinto. Mecanismo reconstruido: media a pantalla completa con `transform: scale()` o un `<video>` scrubbeado, atado al progreso de scroll; el titular en una capa superior que no se mueve.

3. **Revelado de titular con duplicado desenfocado.** Cada titular serif entra con **una copia fantasma, borrosa y desplazada** que se le va alcanzando. Se ve en `Sterling & Silver`, en `Lifetime Guarantee` y en `MEASURED PURITY` (`texto_006_05`). **No es artefacto de cámara**: en ese mismo fotograma el texto sans (`DISCOVER`, `ABOUT`) está perfectamente nítido — si fuera rolling shutter estaría todo doblado. Mecanismo reconstruido: dos copias apiladas del titular, la de atrás con `filter: blur()` + `translateY` animando a 0, o un solo elemento animando `blur → 0` con offset.

4. **Grilla de 3 columnas con filetes de 1px y celda que se abre.** Fondo hueso, filetes verticales finísimos separando columnas, cada celda con el anillo flotando al centro y `nombre / precio` debajo en sans chiquita. En `texto_004_01` y `texto_005_05` la **columna del medio muestra un video/imagen a sangre que se desborda por encima y por debajo de sus vecinas**, que siguen siendo fichas chicas. Mecanismo reconstruido (dos lecturas posibles, no se dice cuál): hover que expande la celda a media completa, o parallax por columna a velocidades distintas. Además la grilla **hace crossfade entre dos sets de producto** (`texto_005_08` cachó el fantasma de las etiquetas viejas encima de las nuevas).

**Por qué no "parece IA":** cero cards con sombra, cero gradiente, cero botón redondeado azul, cero grilla uniforme. Manda un serif display de alto contraste, negativo enorme, filetes en vez de bordes, y UN solo color en toda la página.

### Eje MARKETING — el molde

Reel de ~10 s con **solo 3 cortes**. Estructura:

| t | qué | función |
|---|---|---|
| 0:00–0:02 | selfie handheld en la montaña, cara del creador, sin voz. Overlay centrado: `Fable 5 is back. / Your sites still look AI.` | **Gancho de dos líneas: noticia + acusación.** La primera te informa, la segunda te acusa a vos. |
| ~0:02 | **negro pleno** con las mismas dos líneas | beat de separación. Corta el mundo real y te deja solo con la frase. |
| 0:02–0:10 | laptop sobre una mesa al atardecer, el sitio scrolleando. Sin cara, sin voz, solo música. | **la prueba.** 8 segundos continuos, una sola toma. |
| 0:06–0:10 | overlay abajo-izquierda: `I packed my free workflow and prompts` + `comment/DM – "PROMPT"` | **CTA de palabra clave.** |

Tres decisiones que son el verdadero aprendizaje:

- **La prueba NO es una captura de pantalla, es un objeto filmado.** La laptop está en ángulo 3/4, a la hora dorada, con reflejo en la mesa y la mano del tipo entrando en cuadro. Una grabación de pantalla dice "esto salió de una IA"; una laptop filmada dice "esto existe en el mundo". Es el movimiento más barato y más portable de todo el post.
- **El scroll es a mano, no programático.** Irregular, con pausas, con micro-correcciones. Un scroll suave y perfecto delata automatización.
- **El CTA se apoya sobre el TECLADO, nunca sobre la pantalla.** El texto blanco vive en la zona oscura del teclado; la prueba jamás se tapa.
- **El video es gancho + prueba + CTA. El argumento entero está en el caption.** El que se queda 10 s ve que funciona; el que quiere entender lee. Dos audiencias, un post.

La mecánica de conversión es **comentario/DM con palabra clave** ("PROMPT") hacia un lead magnet gratis.

## El estilo, como conocimiento portable

**Tipografía — pairing de dos familias, con un tercer rol:**
- *Display:* serif de altísimo contraste, tipo Didone/transicional, remates finos y afilados. `MEASURED PURITY` en versalitas con tracking abierto (~0.04em), `Made Without Compromise` y `14–92g / Per piece` en caja alta y baja. **No se dice qué fuente es.**
- *UI/micro:* grotesca neutra, ~10-11px, CAJA ALTA, tracking muy abierto (~0.14em), gris medio: `DISCOVER`, `ABOUT`, `VIEW COLLECTION`, `BAG`.
- *Cuerpo:* grotesca ~14-15px, interlineado 1.55, medida corta (~55 caracteres), en bloques de 3-4 líneas con aire entre ellos.
- *Overlay del reel:* sans blanca de peso medio, sin contorno ni caja, sin sombra dura. Gancho **centrado**; CTA **alineado a la izquierda**.

**Paleta (hex aproximado, leído de fotograma — no declarado):**
- Fondo del sitio: hueso cálido `#F2EFEA`, fichas de producto un punto más claras `#F8F6F3`
- Texto: casi-negro cálido `#1C1A18`
- Micro-labels: gris `#6E6A65`
- Filetes: `#DAD5CE` (1px, es el único "borde" del sitio)
- **Acento único — el logo: oxblood/borgoña profundo `#7E1F2A`.** Es LA única cromía de toda la página.
- Rubí del anillo: `#A8121F` (segundo punto de color, y es producto, no interfaz)
- *Entorno del reel (no del sitio):* cielo de ciruela `#3E3448` → malva `#6B4A52` → naranja quemado `#C2662E` → ámbar `#E79B45`. Laptop `#131313`.

La regla portable: **una sola cromía en toda la página, y que sea profunda, no brillante.** Todo lo demás es hueso, tinta y filete.

**Composición:** encuadre 9:16 con la laptop en el tercio inferior y ~45% del cuadro entregado a cielo vacío. La pantalla NUNCA de frente: siempre en perspectiva 3/4. Dentro del sitio, grid de 2 columnas para lo editorial y de 3 para producto, con negativo agresivo — el anillo ocupa quizá el 15% de su celda.

**Ritmo de corte:** 3 cortes en ~10 s (2 s / 0,3 s / 7,7 s). Poquísimo para IG. La apuesta entera es que el sitio aguante 8 segundos sin cortar.

**Motion:** todo el movimiento del sitio está atado al scroll, a velocidad de dedo humano. La cámara aporta una deriva handheld lenta y un push-in mínimo. Curva aparente: nada de rebotes ni elásticos — desaceleración larga tipo `cubic-bezier(0.16, 1, 0.3, 1)`.

**Textura/atmósfera:** el sitio en sí es plano y limpio; la textura la pone el MUNDO — grano de sensor con poca luz, halo del atardecer, reflejo de la mesa mojada, brillo del LCD. Es atmósfera prestada, no efecto CSS.

**Tratamiento del texto en pantalla:** blanco puro, sin caja ni contorno, colocado siempre sobre zona oscura para que no necesite fondo. Bloques de máximo 2 líneas, separados por una línea vacía.

**Se porta a:**
- `web-factory/docs/MOTION_PATTERN_BANK_2026.md` → split sticky, hero pinneado con media escalando, revelado de titular con duplicado desenfocado
- `hermes-content/references/ui-patterns/editorial-hairline-joyeria/` → grilla de filetes 1px, paleta hueso+oxblood, pairing serif display / grotesca micro
- `hermes-content/references/video-intake/` → esta ficha
- El molde de reel (gancho 2 líneas → negro → prueba filmada → CTA palabra clave) → marketing / INFLUENCERS IA

## Las tres preguntas

1. **Frente:** **web-factory** (principal — los 4 mecanismos + el estilo van al pattern bank y a la galería de `ui-patterns`). Secundario: **marketing / INFLUENCERS IA** (el molde de reel y la mecánica comentario→DM).
2. **Herramienta nuestra:** para el sitio, skill **`image-to-code`** (que produce exactamente esto: un `index.html` de una pieza) + **`impeccable`** con galería/tokens cargados antes de codear + **`gsap-scrolltrigger`**/`gsap-core` para el pin y el scrub + **`ui-ux-pro-max`**. Para el reel, **`editor-videos`** / **HyperFrames**, y el circuito **comentario→DM que ya está VIVO en producción** (probado 18-ago). La regla `web/design-quality.md` ya exige ≥4 Required Qualities: este post cumple 6-7 y sirve de vara concreta.
3. **Qué falta:** **nada** para portar los cuatro mecanismos y armar la página — son CSS/GSAP y un archivo suelto. Dos salvedades honestas: (a) para replicar el hero con imaginería propia hace falta o fotos reales del cliente o **permiso explícito de gasto** en generación paga; (b) **la "free guide" del autor no está en el post** — no hay link ni contenido, así que se le copia el RESULTADO, no su workflow.

## Lo que NO se puede afirmar

- **Objecion del critico del lote (2026-08-23):** decir “un index.html suelto **sin framework ni build**” va mas alla de la prueba. La barra de URL prueba `file:///…/oyla/index.html`; un build escupe exactamente eso. Y queda sin resolver que Gemini reporte “sin dialogo hablado” mientras la ficha observa que el hombre mueve la boca en la apertura. La transcripcion devolvio 0 palabras (11 s), asi que la pista no tiene voz: lo que se ve es locucion muda o playback.

- **Qué es "Fable 5".** El caption lo trata como un modelo y hashtaguea `#claude`, pero el post no dice quién lo hace ni qué es. **NO-VERIFICADO** — no lo confirmé contra ninguna fuente.
- **Con qué se generó el sitio.** El caption habla de "el mismo modelo" en abstracto; nunca dice qué herramienta produjo ese `index.html`. La barra de URL prueba que es un archivo local, nada más.
- **El prompt.** No aparece escrito en ningún fotograma. Todo lo de "Como está hecho" es **RECONSTRUIDO** leyendo el render, no recuperado.
- **Los mecanismos marcados "reconstruido"**: el scrub del hero, el blur del titular y el comportamiento de la celda del medio son mi lectura del render, no algo que el post declare. El split sticky sí está probado por comparación directa de fotogramas.
- **Precios y nombres de producto:** reporto los que LEÍ (`Shadow Sigil $740`, `Matte Skull $850`, `Obsidian Coil $480`, `Void Arc $560`). Gemini reportó otro set (`Urban Arch $320`, `Onyx Hex $420`, `Shadow Sigil $780`, `Echo Band $710`, `Stella Dust $900`) y para "Shadow Sigil" da $780 donde yo leo $740. **No los mezclo** — vale lo que vi en el fotograma. Los de Gemini quedan sin verificar.
- **Cómo suena.** No escuché el audio; me apoyo en el reporte de Gemini (música, sin diálogo). El hombre mueve la boca en la apertura y eso no está explicado.
- **Métricas.** El post no muestra vistas, likes, comentarios ni resultados de la guía. Cero evidencia de que este molde convierta.
- **Que la modelo/las manos sean IA.** El sitio se llama a sí mismo joyería artesanal; el post no dice si esa imaginería es generada o fotográfica.
