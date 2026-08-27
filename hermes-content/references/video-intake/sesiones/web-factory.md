# Sesión `web-factory`

> **Este archivo es la raíz de la sesión `web-factory`.** Todo lo que esta sesión tiene que hacer
> de lo que salió del análisis de reels está acá, completo. No hace falta abrir otro archivo.
>
> Orden: **C1 primero (nuestra web no indexa) → B1 → B2 (depende de B1) → el resto**
>
> Índice general del carril: [../INDEX.md](../INDEX.md) · fichas de origen en `../`

---

## Preambulo — pega esto al inicio de CUALQUIER sesion

Seis reglas que salieron de los errores de la sesion de analisis de reels (2026-08-11). No son
teoria: cada una nacio de algo que se hizo mal y se corrigio.

```text
Antes de escribir una sola linea:
1. Invoca `onia-router` y ubica el carril. Verifica `git branch --show-current`.
2. BUSCA DONDE VIVE LA COSA ANTES DE CREARLA. El repo ya tiene pipeline para casi todo
   (web-factory tiene reels->learned models; ver-videos tiene el intake; el pattern bank tiene
   el motion). Escribir un doc "al lado" del sistema que ya existe es el error mas caro:
   duplica y se desincroniza. Si no encontras donde va, pregunta antes de inventar carpeta.
3. Verifica en vivo lo que toca prod, plata o main. Y deci explicitamente lo que NO pudiste
   verificar: "los estados estan probados, el timing no porque el panel del navegador esta
   oculto y las transiciones no avanzan" es una respuesta correcta; "quedo listo" no lo es.
4. Ninguna cifra, precio o capacidad que venga de afuera se repite como propia sin verificarla.
   Marcala como "a verificar" o no la menciones.
5. Reporta la cobertura real ("audio 100%, 5 de 7 laminas"), nunca "lo vi" desde dos cuadros.
6. Al cerrar: que quedo en produccion, que quedo a medias y donde exactamente, y que depende
   de Sergio. Nada flotando en la conversacion.
```

---

## Los dos gates que aplican a TODOS los prompts de este archivo

Pegá esto junto al prompt. Nacen de errores concretos de esta sesión, no de teoría.

### Gate 1 — control de calidad ANTES de ejecutar

```text
Antes de hacer nada de lo que pide el prompt, verificá que el prompt siga siendo válido:
1. ¿YA ESTA HECHO? Mirá el repo y la memoria del proyecto, no el prompt. Un prompt de esta
   lista mandaba a cerrar la seguridad de produccion cuando ya estaba cerrada y verificada
   dias antes — habria mandado a rehacer trabajo terminado.
2. ¿EL BLOQUEO EXISTE? Si el prompt dice que algo esta trabado, comprobalo. Dos "bloqueos" de
   esta lista se cayeron con un `ls` y una consulta gratis: los SFX estaban en otra carpeta y
   la voz no era ambigua, era un ID truncado en los docs.
3. ¿EL DATO SIGUE VIGENTE? Los numeros de cuenta, precios y capacidades tienen fecha. Si el
   prompt trae uno, confirmalo antes de construir encima.
4. ¿YA VIVE EN ALGUN LADO? El repo tiene pipeline para casi todo. Buscá donde vive la cosa
   antes de crear una carpeta nueva: escribir un doc "al lado" del sistema que ya existe es
   el error mas caro, porque duplica y se desincroniza.
Si algo de esto invalida el prompt, DECILO y no lo ejecutes. Un prompt que quedo viejo se
corrige, no se obedece.
```

### Gate 2 — ordenar en su carpeta ANTES de cerrar

```text
Al terminar, nada queda suelto ni en la raiz del repo. Cada cosa a su lugar:
- Web entera vista en un reel  -> web-factory/data/references/reels/models/ (learned model)
- Componente de UI reconstruido -> hermes-content/references/ui-patterns/<patron>/
- Patron de movimiento          -> web-factory/docs/MOTION_PATTERN_BANK_2026.md
- Analisis de un video          -> hermes-content/references/video-intake/
- Doc de proceso o decision     -> hermes-content/docs/  (es la fuente; la raiz sin gemelos)
- Receta de generacion          -> hermes-content/docs/ y se apunta desde la skill
- Codigo de herramienta         -> scripts/ o .claude/skills/<skill>/scripts/
Si no sabes donde va, PREGUNTA antes de inventar carpeta.
Y antes de commitear: `git status` limpio de archivos huerfanos, y el commit explica el POR QUE,
no solo el que.
```

---

### Gate 3 — el loop: auto-evaluacion ANTES de responder

Sale del reel de AI loops, que en la primera pasada despache como humo y era el mas importante
del corpus ([ficha](../2026-08-09-ai-loops-code-review.md)). La idea no es el comando: es **donde
esta el control**. La verificacion va antes de entregar, no despues de que Sergio encuentre el
error.

```text
Antes de decir que terminaste, corre este loop sobre tu propio trabajo:
1. Reelee el "LISTO =" del prompt. ¿Lo cumpliste, literal? No "casi".
2. Buscá activamente en que te podes haber equivocado. Nombra la parte mas fragil de lo que
   hiciste y comprobala. Si no encontras ninguna parte fragil, no miraste bien.
3. Lo que afirmes, verificalo: si decis que algo existe, abrilo; si decis que funciona,
   corrélo; si decis que se perdio, revisá que estabas mirando el lugar correcto.
4. Deci explicitamente que NO pudiste verificar. Un "esto quedo sin comprobar" vale mas que un
   "listo" que se cae al primer toque.
5. Recien ahi respondé.
Si el paso 2 encuentra algo, corregilo y volve al 1. El loop se cierra cuando una pasada
completa no encuentra nada nuevo — no cuando te cansaste de mirar.
```

**Un gate que depende de acordarse no es un gate.** En una sola sesion, con los Gates 1 y 2 ya
escritos, se entregaron cinco cosas sin verificar: un prompt que mandaba a rehacer trabajo
terminado, dos bloqueos que no existian, un archivo "perdido" que estaba intacto, y una
escritura en el arbol de otra rama. En los cinco casos el dato correcto estaba a una consulta
de distancia.

---

**Para delegar a subagentes** (esto se probo con 8 agentes en paralelo y funciono):

```text
Trabajas en el worktree EXACTO: <ruta completa>
Verifica `git branch --show-current` (debe decir <rama>). No commitees, no hagas push.
Escribis SOLO estos archivos: <lista>. NO toques indices ni docs compartidos — de eso me encargo yo.
Si el video/doc afirma un dato, marcalo como "a verificar", no lo des por cierto.
DEVOLVE: una linea por entregable con <archivo> | <resultado> | <decision que tomaste>.
```

La regla que hace que esto no choque: **cada agente escribe sus propios archivos, el
orquestador escribe los indices.** Ocho agentes en la misma carpeta no se pisaron ni una vez.

---

---

## M4 · Los cinco estilos de footer

```text
Contexto: un reel muestra 5 estilos de footer como mockups: centrado, silueta, tipografia
gigante, y dos mas. Ficha:
hermes-content/references/video-intake/analisis/2026-08-22-items.json (item DYIRUT2Mwwj)

YA TENEMOS MEDIO CAMINO, verificado en el repo: web-factory/packages/blocks/src/footer-brand.ts
implementa el de tipografia gigante — su propio comentario dice "the band variant is the grid
with no groups: the oversized wordmark carries it". Pero tiene dos diferencias contra el reel;
el analisis las tiene anotadas.

Tarea:
1. Compará footer-brand.ts contra los 5 del reel y deci cuales faltan.
2. Los que son solo CSS (3 de 5) agregalos como variantes del bloque que YA existe. NO crees un
   bloque nuevo al lado.
3. El de SILUETA necesita un SVG que hay que dibujar. Para Onia no van arboles: skyline de Santa
   Cruz o algo del rubro del cliente. Decilo como pendiente, no lo improvises.
4. Respeta el presupuesto de la landing y las reglas de motion del pattern bank.

LISTO = las variantes que son CSS agregadas al bloque existente y probadas, y el SVG anotado
como pendiente con su propuesta.
```

---

## J5 · Interiores con Nano Banana — cuatro recetas image-to-image

```text
Contexto: un carrusel regala CUATRO recetas image-to-image de diseno de interiores, con los
prompts literales. Ficha y datos:
hermes-content/references/video-intake/2026-08-20-sintesis-lote-13.md
hermes-content/references/video-intake/analisis/2026-08-20-items.json (item DcEYP7tjsIA)

LOS CUATRO PROMPTS, literales de las laminas:
  1. clay/wireframe 3D -> foto fotorrealista del MISMO encuadre:
     "show me the AD magazine photography version of image 1."
  2. cambiar TODO el mobiliario contra un moodboard:
     "in image 1, swap all furniture with the furniture shown in image 2"
  3. moodboard de productos -> escena amueblada desde cero:
     "In a minimalist dark wooden living room, add all products and furniture shown on image 1.
      Add also other objects to make the space feels alive."
  4. plano 2D de linea -> render cenital tipo casa de munecas: mismo prompt que el 3, cambiando
     la descripcion del ambiente.

LOS CUATRO MECANISMOS — esto es el conocimiento, no los prompts:
  a. El catalogo de muebles va como UNA SOLA IMAGEN-COLLAGE, no como N referencias sueltas.
  b. El prompt direcciona POR INDICE ("image 1", "image 2"), asi que EL ORDEN DE CARGA de las
     referencias es parte del prompt. Cambiar el orden cambia el resultado.
  c. ENCADENA: la salida de un paso es la "image 1" del siguiente. Asi conserva la arquitectura
     (paneles, cuadro, curva del cielorraso) mientras reemplaza todo el mobiliario.
     LA CONSISTENCIA NO LA SOSTIENE EL TEXTO NI EL SEED: LA SOSTIENE LA REFERENCIA.
  d. El texto es CORTO y SIN JERGA FOTOGRAFICA: ni lente, ni f-stop, ni esquema de luz. La
     instruccion de estilo entera es un nombre propio -- "the AD magazine photography version".
     Delega el estilo en una referencia cultural que el modelo ya tiene, en vez de describirla.

  OJO, TENSION A PROPOSITO con el prompt G6 (plantilla de foto realista de 8 bloques largos con
  negative prompt): las dos sirven, para cosas distintas. Bloques largos = generar desde cero.
  Referencia nombrada + frase corta = EDITAR sobre algo que ya existe. No las mezcles.

VERIFICADO EN LA CUENTA el 2026-08-20 (volve a consultarlo vos: una verificacion tiene fecha de
vencimiento): existen nano_banana, nano_banana_pro, nano_banana_2, nano_banana_2_lite y
nano_banana_2_shots, todos de Google, con rol image_references SIN tope declarado de cantidad --
que es exactamente lo que estos prompts necesitan para direccionar "image 1" e "image 2".
nano_banana_2 y nano_banana_pro dan 1k/2k/4k. Alternativa para el swap: seedream_v5_pro tiene
flag is_inpaint.

POR QUE ESTO ES DE WEB-FACTORY Y NO DE INFLUENCERS: es un SERVICIO VENDIBLE a un rubro que
existe en Bolivia -- inmobiliaria, estudio de arquitectura, muebleria. Y el insumo es lo que el
cliente YA TIENE: un plano, una foto del ambiente vacio, un catalogo de productos. No hace falta
sesion de fotos ni render 3D pago.

Tarea:
1. Escribi la receta de las 4 transformaciones como doc reusable, donde ya vivan las recetas de
   imagen. Busca primero; no crees carpeta nueva.
2. Anota los 4 mecanismos como REGLAS, no como datos sueltos. El (b) y el (c) son los que nadie
   escribe y los que hacen la diferencia.
3. Preparalo como oferta: que le pedimos al cliente (plano / foto / catalogo), que le devolvemos,
   y en cuantas pasadas. Sin precio -- eso lo decide Sergio.
4. Verifica vos el catalogo antes de prometer nada, y anota la fecha de tu verificacion.

GASTO: generar imagen esta permitido y es barato. Aun asi, si vas a hacer una tanda de prueba,
avisa el costo estimado antes. unlim.available devolvio false, o sea cada generacion sale de
creditos.

LISTO = la receta de 4 transformaciones escrita con sus 4 mecanismos como reglas, el catalogo
re-verificado por vos con fecha, y la oferta descrita en terminos de que pide y que entrega.
```

---

## J1 · DESIGN.md por cliente — el sistema de diseño como archivo del repo

```text
Contexto: un reel muestra 7 herramientas para que una landing hecha con IA no salga generica, y
el nucleo real de tres de ellas es UN FORMATO DE ARCHIVO, no una libreria.

EL ARTEFACTO: DESIGN.md. Verbatim del README que se ve en pantalla:
  "Copy a DESIGN.md into your project, tell your AI agent 'build me a page that looks like this,'
   and generate high-quality UI that stays visually consistent with the design language"
  "Built with real design depth - including analyzed patterns, tokens, and rules - for
   high-quality UI generation, not surface-level outputs"
  "A collection of DESIGN.md files analyzed by popular brand design systems. Drop one into your
   project and let coding agents generate a matching UI"

Un markdown por marca, versionado EN EL REPO del proyecto, con tokens (color, tipografia,
espaciado), patrones analizados y reglas. Sin instalacion, sin dependencia, sin build. No toca el
runtime: cambia el prompt.

Y el oficio esta en como describen cada sistema — una linea que captura el lenguaje visual:
  "Nintendo (2001): Y2K console chrome web. Brushed-periwinkle metal panels, amber nav on a
   slotted carbon bar, outlined Arial-Black box-art type"
  "Dell (1996): Catalog-era PC retail web. Black page frame, flat color-block ribbon cards,
   Helvetica-Black over Times Roman"
  "BMW M: Motorsport automotive. Pure track canvas, M tricolor stripe accents, full-bleed
   photography"
Repo publico visible en pantalla: YakAgent/awesome-design-md. Catalogo de 300+ sitios.

LO QUE YA TENEMOS, verificado leyendo ~/.claude/skills (no de memoria):
- `impeccable` ES LITERALMENTE la herramienta #4 del video, ya instalada, y ya es regla de
  entrada obligatoria en CLAUDE.md para todo trabajo de UI. El reel la vende como hallazgo y para
  nosotros es el default desde hace semanas.
- `design-dna` extrae tokens, estilo y efectos desde imagenes o URLs de referencia a un JSON de
  3 dimensiones: es funcionalmente un DESIGN.md.
- `stitch-extract-design-md` y `design-md` tambien estan instaladas.
Osea: NO hay que construir el generador. Hay que DECIDIR EL FORMATO y usarlo.

Tarea:
1. Decidi el formato unico de DESIGN.md de web-factory y donde vive: uno por cliente, versionado
   con el proyecto del cliente. Buscá primero si ya existe algo asi en
   web-factory/data/references/ antes de crear nada.
2. Generá el DESIGN.md de UN cliente real que ya tengamos entregado, usando design-dna o
   stitch-extract-design-md sobre su web. No inventes tokens: extraelos.
3. Probalo: pedile a un agente que genere una pagina nueva con ese DESIGN.md y compará contra el
   sitio real. Si no se parece, el formato esta mal, no el agente.
4. Conectalo al pipeline de learned models que YA existe
   (web-factory/data/references/reels/models/ + harvester/reels/build-web-models.mjs). Un
   learned model y un DESIGN.md son casi lo mismo: no armes un segundo sistema al lado.

Este es el error mas caro del preambulo: escribir un doc "al lado" del sistema que ya existe.
Si terminas con dos formatos que describen lo mismo, la tarea salio mal.

LISTO = un DESIGN.md de un cliente real existe, una pagina generada con el se parece al sitio, y
esta conectado al pipeline de learned models, no al lado.
```

---

## J2 · El bucle de práctica de diseño — brief aleatorio, referencia, prototipo

```text
Contexto: un reel muestra un bucle de practica de diseno completo, y las tres piezas son
reproducibles hoy sin construir casi nada. Reconstruccion detallada en
hermes-content/references/video-intake/2026-08-20-sintesis-lote-13.md

(1) EL GENERADOR DE BRIEFS es un ARTIFACT de Claude publicado — no una app aparte. Titulo
"Random Project Generator", plantilla de dos ranuras "Design a [tipo] For [rubro]", y dos botones:
"Randomize" y "Go Crazy". El mecanismo de la animacion, leido cuadro a cuadro: RULETA VERTICAL
tipo slot machine con DOS ranuras INDEPENDIENTES y FRENADO ESCALONADO — la ranura de arriba frena
primero (valor en negro solido y nitido) mientras la de abajo sigue girando. El desenfoque es de
MOVIMIENTO en el eje Y, no opacidad. Eso es lo que se porta, no "se ve lindo".

(2) REFERENCIA ANTES DE DISENAR. Antes de tocar nada: un caso de estudio del lider del rubro y un
tablero de Pinterest. Las pestanas del navegador delatan el resto del metodo: "mesh gradients",
"mac pointer cursor png", "React Bits Particles". El fondo y el cursor grande de los planos de
zoom salen de ahi.

(3) EL PROMPT, literal de la pantalla:
   "I want your help in creating a booking page for car rentals. I want you to go towards the
    theme of what Uber does aesthetically. Something that Uber is good at in smoothness and user
    experience to create the best experience for the user with minimal elements and an aesthetic
    design with modern stylings and typography taken care of the most. Help me with a mobile
    experience for this layout in light theme. I like the colors where dark and black collide
    with each other in a nice contrasting way. I also want all the unnecessary elements on that
    particular step to be hidden. In case there is a car selected, the user can even drop down on
    that particular car to see what car it is, the model, and everything there. Basically, it
    should be a nice two- or three-step flow. Let's go ahead and create that. Give me a nice
    prototype so I can preview it here."
   Configuracion visible en el compositor: modelo Opus 5, esfuerzo "high".

EL MOLDE DEL PROMPT, que es el hallazgo:
  a. nombra un PRODUCTO REAL como referencia estetica en vez de adjetivos ("what Uber does
     aesthetically"). Delega el estilo en algo que el modelo ya conoce.
  b. dice el DISPOSITIVO y el TEMA (movil, light theme)
  c. da una regla de color en lenguaje humano, no en hex
  d. pide ESCONDER lo innecesario en cada paso — o sea, define jerarquia por sustraccion
  e. nombra UNA interaccion concreta (el desplegable del auto elegido)
  f. acota el flujo a 2-3 pasos
  g. cierra pidiendo un prototipo previsualizable

Tarea:
1. Armá el generador de briefs como Artifact: dos ranuras (tipo de pantalla x rubro), con los
   rubros REALES que vendemos en Bolivia. La ruleta con frenado escalonado y blur direccional.
   Una tarde, costo cero.
2. Escribí la plantilla de prompt con los 7 puntos de arriba, para reusar en cada practica.
3. Corré el bucle UNA vez de punta a punta y guardá el resultado en la galeria interna
   (web-factory/data/references/design-sources/gallery-examples/). Cargá `impeccable` y
   `web-design-guidelines` ANTES de generar, y `ui-ux-pro-max` para juzgar el resultado.
4. Exigí las >=4 Required Qualities de la regla anti-template. Si no las cumple, no entra a la
   galeria.

Esto NO es una prioridad de venta: es entrenamiento y banco de referencias. Si hay algo de
web-factory que convierta (G4, C1, J1), va primero. Deci que dejaste de lado por hacer esto.

LISTO = el generador existe como Artifact con nuestros rubros, la plantilla de prompt escrita, y
UNA pieza completa en la galeria que pase las >=4 Required Qualities.
```

---

## I2 · Usarlo primero para nosotros — la lista real de lo que se le pide a un cliente de web

```text
Contexto: se especifico un modulo de onboarding de cliente que reemplaza perseguir por WhatsApp:
hermes-content/references/video-intake/2026-08-19-portal-cliente-onboarding-spec.md
El modulo lo construye la sesion onia-plattform (prompt I1). Esta tarea es la otra mitad: SIN
LA LISTA REAL DE REQUERIMIENTOS, el modulo es una tabla vacia.

Y web-factory es quien mas sufre el problema: cada web de cliente necesita logo, textos, fotos,
acceso al dominio, acceso a las redes -- y hoy todo eso se persigue a mano.

Tarea:
1. Escribi la lista COMPLETA de lo que se le pide a un cliente para una web, sacada de los
   proyectos REALES que ya hicimos, no inventada. Por cada item:
     - tipo: documento / respuesta / firma / acceso
     - en que fase del proyecto se pide (no todo al principio: eso abruma y frena)
     - si bloquea o no bloquea el avance
     - como se verifica que esta bien (un logo en JPG de 200px no sirve, y eso hay que decirlo
       ANTES, no despues)
2. Para los de tipo ACCESO, escribi el instructivo por plataforma: que tiene que hacer el
   cliente, paso a paso, para darnos acceso DELEGADO sin pasarnos su contrasena. Uno por
   plataforma: dominio, hosting, Google Business, Instagram/Meta, y lo que aparezca.
   Este instructivo es lo que reemplaza la boveda de credenciales. Es lo mas valioso de la tarea.
3. Escribi el Cuestionario Maestro de una web: las preguntas que de verdad cambian el resultado.
   Referencia del video: el suyo tarda 45-60 min y se guarda solo entre sesiones.
   REGLA DE CLAUDE.md que esto hace cumplir: "No fabricar. Si falta dato del cliente, no
   inventar -- pedirlo o marcarlo". Este cuestionario ES el mecanismo de pedirlo.
4. Ordena las preguntas por cuanto cambian el diseno. Las que no cambian nada, sacalas.

NO construyas la UI. Esta tarea entrega el CONTENIDO que el modulo va a servir. Si I1 todavia
no corrio, igual sirve: la lista y los instructivos valen solos, y hoy se pueden mandar por
correo mientras tanto.

Cuidado con dos cosas:
- Nunca le digas al cliente que usamos plantillas. Es regla.
- El dominio y el hosting van a nombre del CLIENTE. El instructivo tiene que reforzar eso, no
  pedirle que nos los transfiera.

LISTO = la lista completa con tipo/fase/bloqueante/verificacion, un instructivo de acceso
delegado por plataforma, y el cuestionario ordenado por impacto en el diseno.
```

---

## G4 · La escalera de popups, del 0 al 10 — con las capturas reales

```text
Contexto: un reel puntua 8 popups de captura de email de tiendas reales, del 0 al 10, y dice
por que en cada caso. Verbatim completo:
hermes-content/references/video-intake/transcripciones/Instagram-DcEITCmoSHX.txt

La escalera, textual del video:
  0/10 -- "no te da nada a cambio del correo y tiene demasiados campos que llenar"
  1/10 -- "demasiado copy innecesario"
  3/10 -- buena oferta y pregunta que quiere el cliente, "pero no esta bien configurado"
  5/10 -- "es simple y la oferta esta super clara"
  6/10 -- "la tecnica de la ESCALERA DE SI: primero le preguntas al cliente si quiere la
          oferta y LUEGO le pides el correo"
  7/10 -- engagement: "rascas para revelar cual es tu oferta y le da un toque divertido"
  9/10 -- consigue "una tasa de suscripcion increible si eres una marca dispuesta a probarlo"
 10/10 -- MULTI-PASO: "la oferta super clara, en el primer paso hacemos una PREGUNTA, luego
          pedimos el correo y luego el numero de telefono, y en base a los datos que
          recogimos podemos hacer correos personalizados"

Lo que hay que entender, y es el eje entero: el paso 1 NO pide datos, pide un CLIC. Ese clic
segmenta (te dice que quiere el cliente) y ademas es un microcompromiso que sube la
conversion del paso 2. El email recien viene despues.

Tarea:
1. Verifica que tiene HOY web-factory en materia de captura: hay popup? de que nivel de la
   escalera es? Abri la pantalla, no el codigo.
2. Construi el de 10/10 como bloque reusable: paso 1 pregunta con 2-3 opciones -> paso 2
   contacto -> guardar la respuesta del paso 1 junto al lead, porque sin eso la
   personalizacion posterior no existe y el multi-paso no sirve de nada.
3. ADAPTACION BOLIVIA: pedimos WHATSAPP, no SMS. Es el canal real del comprador aca.
4. NADA de confirmshaming (el "no gracias, prefiero pagar precio completo"). No va con la
   marca y es de las cosas que el propio video castiga.
5. Respeta lo que ya existe: si hay atribucion de leads con ?src= viva en produccion, el
   popup tiene que alimentar ESE circuito, no crear uno paralelo.
6. Accesibilidad no es opcional: foco atrapado dentro del dialogo, cierre con Escape,
   aria-label en cada opcion. Usa <dialog> nativo con showModal().
   OJO con prefers-reduced-motion: poner transition-duration: 0.01ms ROMPE las propiedades
   discretas y el dialogo queda abierto en opacity 0 (invisible pero capturando clics). Va
   transition: none. Esto ya nos paso.

LISTO = el popup de 2 pasos existe en web-factory, probado en pantalla, guardando la
respuesta del paso 1 junto al lead, y con teclado y lector de pantalla verificados.
```

---

## G5 · Secuencia de scroll con GSAP — el patrón de Apple

```text
Contexto: un tutorial en espanol recrea la animacion de scroll de los AirPods Pro de Apple y
muestra el CODIGO literal en pantalla. Ficha y verbatim:
hermes-content/references/video-intake/2026-08-18-sintesis-lote-17.md
hermes-content/references/video-intake/transcripciones/Instagram-Db8hFCFFTZg.txt

La tecnica: NO es un video. Es una secuencia de PNGs dibujada en un <canvas>, con el numero
de frame atado al scroll por GSAP ScrollTrigger. Parametros que se ven en pantalla:
  snap: "frame"   ease: "none"   scrub: 0.5   onUpdate: render

Verificado en el repo: GSAP ya esta autorizado y las skills gsap-* estan instaladas. El
patron NO existe todavia (grep de drawImage da 0).

EL BLOQUEANTE REAL ES EL PESO, no el codigo: ~69 KB por frame. Una secuencia de 150 frames
son ~10 MB, y el presupuesto de una landing es 150 KB de JS. Si no resolves esto, no lo
construyas.

Tarea:
1. Antes de codear, resolve el peso. Opciones a evaluar con numeros, no a ojo: menos frames
   con interpolacion, WebP/AVIF en vez de PNG, resolucion menor con escalado en canvas,
   carga progresiva por tramos, y un tope duro de peso total.
2. Recien con el numero decidido, arma el bloque reusable de web-factory. Carga las skills
   gsap-scrolltrigger y gsap-core primero -- no improvises la API.
3. prefers-reduced-motion: sin scrub, se muestra un frame fijo. Obligatorio.
4. Medi Core Web Vitals antes y despues. Si empeora LCP o CLS, no entra.

Esto es un TECHO visual, no una prioridad de venta. Si hay algo de la lista de web-factory
que convierta (G4, C1), va primero. Deci explicitamente que dejaste de lado por hacer esto.

LISTO = el bloque existe con el peso resuelto y medido, reduced-motion cubierto, y CWV que no
empeoran. O la decision escrita de NO hacerlo, con el numero que la justifica.
```

---

## C1 · Indexabilidad — cerrar la casa antes de auditar la ajena

Sale de [20 senales de web vibecodeada](../2026-08-12-20-senales-web-vibecodeada.md)
(`MEJORA LO ACTUAL`). Verificado en este worktree hoy: `web-factory/apps/onia-platform/src/app/`
tiene `icon.svg` y `apple-icon.png`, pero **no tiene** `robots.ts`, `sitemap.ts` ni `not-found.tsx`.
Toca la caja de dos formas: una landing no indexable no trae un solo prospecto organico, y la
misma lista se convierte en auditoria gratis al prospecto — pero solo si nosotros la pasamos.

```text
Sesion: web-factory. git branch --show-current primero.
TAREA UNICA: cerrar los huecos de indexabilidad en las dos webs propias que salen a la calle
(apps/onia-platform y apps/dentalgest-landing), y dejar el checklist como gate de pre-entrega.
Lo que falta, verificado: robots.ts · sitemap.ts · not-found.tsx · metadataBase + canonical.
Y en dentalgest-landing, favicon (no tiene ninguno de los tres archivos de icono).
Despues: escribir el checklist de pre-entrega (17 items validos de los 20) al lado del gate
actual, que hoy verifica que compile (tsc --noEmit + e2e + code-reviewer) y no que sea indexable.
LISTO = las 4 cosas andando en las dos apps, verificadas en el sitio construido (no en el codigo):
/robots.txt y /sitemap.xml responden, una URL inexistente da 404 propio, y el canonical sale en
el HTML servido. Mas el checklist commiteado.
NO HAGAS: NO inventes la OG image — la regla del layout es esperar captura real del sistema, y
un mockup ahi es fabricar. NO copies los 3 items de opinion de la lista ("Vite + React" no es
falla, `robots.txt` contra bots de IA es decision de negocio, `llms.txt` esta a verificar).
NO uses la lista como argumento de venta hasta que estas dos webs la pasen: es bumeran.
```

---

## B1 · Construir `packages/blocks` (va PRIMERO)

```text
Sesion: web-factory. git branch --show-current primero.
TAREA UNICA: construir los bloques que el catalogo de learned models ya pidio. Nada mas.
El catalogo `web-factory/docs/WEB_FACTORY_LEARNED_MODELS.md` lista 22 tipos de bloque que los
5 modelos necesitan, y `packages/blocks` no los tiene. Sin esto, generar un sitio desde un
modelo no produce nada: es la lista de compras y esta sin comprar.
EMPEZA por los que aparecen en 2+ modelos (el catalogo los ordena por frecuencia): footer-brand,
benefit-strip, editorial-statement.
Cada bloque: props tipadas, tokens ONIA (no colores literales), reduced-motion, y el spec de
`motion` que el modelo ya trae escrito por seccion (entrance, trigger, easing, duracion,
stagger, scrollLinked, hover, reducedMotion).
LISTO = 3 bloques construidos + renderizados en una pagina de prueba + tsc --noEmit verde.
NO HAGAS: no construyas los 22. Tres que se usen valen mas que veintidos a medias.
NO inventes bloques que ningun modelo pidio.
```

---

## B2 · Generar un sitio desde un learned model (depende de B1)

```text
Sesion: web-factory. git branch --show-current primero.
TAREA UNICA: generar UNA landing real desde el modelo `find-realestate-editorial`.
Esta en `web-factory/data/references/reels/models/` con confianza ALTA y sin estrenar: 7
secciones, motionLevel 3, entra comodo en el presupuesto de 150 kb de JS. Trae el orden de
secciones, los roles de color, la tipografia y el motion por seccion, ya escritos.
LISTO = la landing generada, corriendo en local, con tokens ONIA (no la paleta del modelo) y
placeholders honestos donde falten assets reales del cliente.
NO HAGAS: no uses la paleta literal del modelo — los hex son ROLES (bg, accent, text), se
reemplazan por los tokens del cliente. No inventes propiedades, precios ni articulos: donde
falte dato real va placeholder marcado, nunca proof fabricado.
Si el cliente pidiera la version cinematografica, compara contra `lecercle-realestate` antes
de decidir: mismo rubro, objetivo opuesto.
```

---

## `web-factory`

Sale del [antes/después del 9-ago](../2026-08-09-web-antes-despues-find-real-estate.md)
(`SIRVE YA`, ya encolado como V-1) más una variante que aportó
[el portafolio de emails](../2026-08-11-portafolio-emails-preventa-curso.md).

```text
Sesión: web-factory. git branch --show-current primero.
TAREA ÚNICA: producir 3 piezas verticales antes/después de webs YA entregadas.
Formato: 0-4 s wireframe gris de NUESTRO diseño con rótulo "Cliente: necesito una web de X";
5-17 s scroll de la web final, mismo encuadre, rótulo "Después:". Sin voz, sin cara, 9:16.
Variante que salió de la tanda: una cuarta pieza agrupando VARIOS proyectos en un mismo reel,
cerrando con la oferta. Sirve cuando ya hay 3 casos.
Por qué importa: el precio está en 790 / 1.500 Bs porque no hay portafolio publicado. La
línea premium (2.000 / 4.500) pide 3-5 casos mostrables. Las webs ya existen.
LISTO = 3 mp4 listos + una línea por pieza diciendo de qué cliente es. Sin publicar.
NO HAGAS: no muestres la plantilla base ni menciones que usamos plantillas. No uses como
"antes" la web vieja real de un cliente sin su OK — usá wireframe propio.
NO construyas nada con scroll 3D todavía (2026-08-11-web-3d-scrollytelling-united-carriers.md):
la técnica es real pero choca con el presupuesto de 150kb de JS por landing y con el precio
actual. Queda como referencia de techo.
```

---

---

## `web-factory` — segunda tarea: la capa de skills que falta

Sale del [mapa de 42 skills](../2026-08-11-mapa-42-skills-diseno-claude.md) (`SIRVE YA`). Es el
único video de los 26 que ataca un problema **ya documentado por nosotros**: que los diseños
salen genéricos.

```text
Sesión: web-factory. git branch --show-current primero.
TAREA ÚNICA: cerrar la capa VISUAL de skills que falta, y medir si sirve.
Instalar SOLO estas 5 (son las ausentes de la capa 1 del mapa de 42):
    refactoring-ui · web-typography · microinteractions · ux-heuristics · top-design
Después: rehacer UNA landing ya existente con ellas cargadas y comparar contra la versión
actual, lado a lado.
LISTO = la comparación hecha y una decisión escrita: se quedan o se desinstalan.
NO HAGAS: NO instales las 18 que faltan de golpe. Más skills no es mejor diseño — es más
contexto compitiendo entre sí. Las otras 13 se evalúan después, si estas 5 demuestran algo.
VERIFICÁ de dónde sale cada colección y con qué licencia antes de instalar: esto corre en el
entorno que toca código de clientes.
Ya están instaladas (no las busques): ui-ux-pro-max, design-html, taste-design, frontend-design,
canvas-design, brand-guidelines, theme-factory, image, video, cro, signup, onboarding, popups,
ab-testing, social, copywriting, copy-editing, content-strategy, review, qa, codex,
security-review, verification-loop, ship.
```

---

---


---

# Lote del 2026-08-23 — 4 prompts

> Fuente: [`PROMPTS_LOTE_2026-08-23.md`](../PROMPTS_LOTE_2026-08-23.md). Si cambia una regla,
> se edita allá, no acá.
>
> ⚠️ Antes de tocar `MOTION_PATTERN_BANK_2026.md`, leer
> [`2026-08-23-patrones-de-motion-deduplicados.md`](../2026-08-23-patrones-de-motion-deduplicados.md):
> las 18 fichas propusieron ~25 entradas y son 7 patrones reales.

## O1 · Portar los 4 mecanismos de OYLA al pattern bank y probarlos en un index.html de una pieza

- **Ficha:** [OYLA — el index.html suelto que no parece hecho con IA](../2026-08-23-oyla-index-html-que-no-parece-ia.md)
- **Qué falta:** Nada para portar los cuatro mecanismos y armar la pagina: son CSS + GSAP en un archivo suelto, sin credencial, sin permiso y sin gasto. Dos salvedades honestas: (a) para replicar el hero con imagineria propia hacen falta fotos reales del cliente o permiso explicito de gasto en generacion paga (Higgsfield), que por regla es caso por caso; (b) la 'free guide' del autor NO esta en el post — no hay link ni contenido, asi que se le copia el RESULTADO leido del render, no su workflow.

```text
OBJETIVO UNICO DE ESTA SESION: dejar bancados y PROBADOS los 4 mecanismos de scroll del sitio OYLA (referencia: hermes-content/references/video-intake/, ficha DaVV7JjIY9I), en un unico archivo HTML abierto y MIRADO renderizado.

Contexto: es un reel de Instagram que filma una laptop mostrando un sitio de joyeria. El dato clave esta en la barra de URL del navegador: `file:///Users/dmitry/Downloads/oyla/index.html`. O sea el 'sitio' entero es UN archivo HTML estatico suelto, sin framework, sin build, sin deploy. Reproducilo igual: un solo index.html.

ANTES de codear, cargar (no es opcional): skill `impeccable` + la galeria/tokens internos, y `gsap-scrolltrigger`. Direccion de estilo declarada: editorial de lujo claro, NO minimal generico.

LOS 4 MECANISMOS A CONSTRUIR

1. SPLIT STICKY (el mas valioso, y el unico VERIFICADO por comparacion directa de fotogramas). Grid de 2 columnas. La columna izquierda (titulo serif + 3 parrafos cortos + un boton de texto con un ⊕) queda CONGELADA con `position: sticky; top: 0` mientras la derecha desfila por 4 paneles apilados en flujo normal. Cada panel: un numero o frase grande en serif display + una linea de apoyo en sans chica. Sin JS.

2. HERO PINNEADO CON MEDIA QUE ESCALA. Titular en versalitas serif clavado abajo-izquierda, mas un boton `DISCOVER ⊕`. Detras, media a pantalla completa que va de plano general a macro atado al progreso de scroll (`transform: scale()` sobre la media, o un <video> scrubbeado). El titular NO se mueve nunca. (Mecanismo reconstruido del render, no declarado por el autor.)

3. REVELADO DE TITULAR CON DUPLICADO DESENFOCADO. Cada titular serif entra con una copia fantasma borrosa y desplazada que se le va alcanzando. Dos copias apiladas, la de atras con `filter: blur()` + `translateY` animando a 0. Aplicar SOLO a los titulares serif, nunca al sans — en el original el sans esta nitido y eso es lo que prueba que es animacion y no artefacto de camara.

4. GRILLA DE 3 COLUMNAS CON FILETES DE 1px. Fondo hueso, filetes verticales de 1px como unica separacion (cero cards, cero sombras, cero bordes redondeados), producto flotando al centro ocupando ~15% de su celda, nombre + precio debajo en sans chica caja alta. La celda del medio se abre a media a sangre desbordando por arriba y por abajo a sus vecinas (hover-expand). Ademas crossfade entre dos sets de producto.

TOKENS (hex leidos del fotograma, aproximados — ajustar con criterio, no clavar a ciegas)
--bg: #F2EFEA; --surface: #F8F6F3; --ink: #1C1A18; --muted: #6E6A65; --rule: #DAD5CE; --accent: #7E1F2A
REGLA DURA DE PALETA: el acento aparece UNA sola vez en toda la pagina (el logo). Todo lo demas es hueso, tinta y filete. Si aparece un segundo elemento con color, esta mal.

TIPOGRAFIA: serif display de alto contraste (Didone/transicional) para titulares, versalitas con tracking ~0.04em. Grotesca neutra para micro-labels a ~10-11px CAJA ALTA con tracking ~0.14em, y para cuerpo a ~14-15px con interlineado 1.55 y medida ~55 caracteres. Dos familias, nada mas.

MOTION: sin rebotes ni elasticos. Desaceleracion larga, `cubic-bezier(0.16, 1, 0.3, 1)`. Animar solo `transform`, `opacity`, `filter`. Respetar `prefers-reduced-motion`.

VERIFICACION (regla del proyecto: verificar es MIRAR, no suponer)
- Abrir el archivo renderizado en Chromium headless via Playwright y LEER las capturas. Un 200 y un grep no son verificacion.
- Capturar 4 estados: hero al inicio, hero al final del scrub, split sticky con la derecha a mitad de camino (la izquierda TIENE que estar identica), y la grilla con la celda del medio abierta.
- Comprobar que el body no scrollea en horizontal a 375, 768 y 1440.

AL CERRAR
- Los 4 patrones documentados en `web-factory/docs/MOTION_PATTERN_BANK_2026.md`, cada uno con su mecanismo en una linea y el snippet minimo.
- El estilo (paleta, pairing tipografico, grilla de filetes) en `hermes-content/references/ui-patterns/editorial-hairline-joyeria/` junto al HTML probado.
- Handoff del carril en `.claude/handoff/<rama-con-guiones>.md` con los 7 campos, incluido intentos fallidos.

NO HACER: no inventar el prompt original (no aparece escrito en ningun fotograma del reel — todo esto es reconstruido leyendo el render). No usar imagineria generada paga sin permiso explicito: para probar, placeholders o fotos que ya tengamos.

LISTO = existe un unico index.html que, abierto en Chromium headless y MIRADO en captura, muestra los 4 mecanismos funcionando (columna izquierda identica pixel a pixel entre dos posiciones de scroll distintas; titular del hero inmovil mientras la media cambia de escala; titulares serif con el duplicado desenfocado y el sans nitido; celda del medio abriendose a sangre), sin scroll horizontal a 375/768/1440, con el acento #7E1F2A apareciendo UNA sola vez en la pagina, y con los 4 patrones escritos en MOTION_PATTERN_BANK_2026.md.
```

## O2 · Patron 'canvas fijado + scrub amortiguado' con escalera de degradacion — al banco de motion y a una demo

- **Ficha:** [Fable 5 vs GPT 5.6 Sol — la misma landing 3D de producto, y el patrón que se roba](../2026-08-23-fable5-vs-gpt56-landing-3d-dial.md)
- **Qué falta:** Para el patron portable, NADA: el sticky + scrub + estados por seccion + la escalera de degradacion se ejecutan hoy con GSAP y sprites/video, sin 3D, sin credenciales y sin pedirle nada a Sergio. Lo que falta es solo para la version 3D literal: (a) decidir si abrimos el frente R3F, que no tenemos skill y ningun cliente actual pide (vendemos a clinicas, comercio e importadoras, no a fabricantes de hardware); (b) un modelo 3D del producto, que ningun cliente nuestro tiene.

```text
OBJETIVO DE ESTA SESION: dejar en el repo el patron de scroll de landing de producto que aprendimos del reel DbBUMU2qjfW, escrito en el banco y DEMOSTRADO funcionando, sin abrir el frente 3D.

CONTEXTO — el mecanismo, ya reconstruido (no hace falta volver a mirar el video):

1. Canvas/visual FIJADO con ScrollTrigger.pin. El producto no se mueve de su sitio; lo que entra y sale son los bloques de texto y el color de fondo. Principio literal del autor original: 'el dispositivo esta fijo, el mundo cambia'.
2. Scrub AMORTIGUADO: scrub con valor numerico (arrancar en 0.8-1.2), NUNCA scrub:true. Sumar Lenis para el smooth scroll. Esta mezcla es la que produce la sensacion cara, mas que el modelo 3D.
3. Estados por seccion sobre UNA sola pieza: la pantalla del producto cambia de contenido por seccion (no son N imagenes sueltas, es el mismo elemento con la capa de pantalla cambiando).
4. Exploded view scrubbeada: las capas se separan sobre un eje vertical en funcion del progreso, con riel numerado 01..05 a la derecha (filete hairline + bajada de 2 lineas por item).
5. Crossfade de fondo claro<->oscuro entre secciones.
6. ESCALERA DE DEGRADACION (esto es lo que mas vale, y lo que desbloquea el 3D-look en nuestro presupuesto de performance): movil + prefers-reduced-motion + dispositivos debiles + WebGL por software reciben RENDERS ESTATICOS capturados de la escena real, 55-70 KB en WebP, con la maquetacion reordenada a 'texto arriba, producto abajo'. No es un fallback pobre: es la misma escena, congelada.

SISTEMA TIPOGRAFICO que acompana (portarlo igual): eyebrow diminuto en ladrillo #B5514B sobre el titular; titular en grotesca pesada de display, 2-3 lineas, interlineado ~0.95, sentence case CON punto final; cuerpo gris #6B6B6B de 2-3 lineas maximo; pie de seccion en micro-tipografia con separadores de punto medio. Papel #F4F4F2, tinta #111111, seccion oscura #0A0A0A, acento naranja #E8641E usado SOLO dentro de la pantalla del producto y en el CTA (color semantico, no decorativo). Los hex son aproximados: ajustalos a los tokens de la marca del proyecto donde lo apliques.

QUE HACER, en este orden:

A. Cargar la skill 'gsap-scrolltrigger' y 'gsap-core' ANTES de escribir codigo. No improvisar el pin ni el scrub.
B. Agregar el patron a web-factory/docs/MOTION_PATTERN_BANK_2026.md como entrada nueva, respetando el formato de las entradas que ya estan ahi. Incluir SI O SI la escalera de degradacion del punto 6 — es la parte que hace que este patron entre en nuestro presupuesto de performance (rules/web/performance.md: landing <=150 kb JS gzipped, LCP <2.5 s), y es exactamente lo que le faltaba a la ficha anterior 2026-08-11-web-3d-scrollytelling-united-carriers.md, que quedo en FUTURO por no tener respuesta de performance. Citar esa ficha y corregir su veredicto si corresponde: NO reescribirla al lado.
C. Construir UNA demo de una sola pagina que pruebe el patron SIN 3D: producto = una secuencia de imagenes/sprite o un <video> con currentTime scrubbeado, pinneado, con 4 secciones de texto y crossfade de fondo. Mas la ruta degradada real (prefers-reduced-motion + un breakpoint movil) sirviendo el estatico.
D. Verificar MIRANDO: abrir la demo renderizada con Playwright + Chromium headless y leer las capturas. Un 200 y un grep NO son verificacion. Capturar en 375 y 1440, y capturar tambien con prefers-reduced-motion forzado para probar que la ruta degradada se ve bien y no rota.
E. Medir peso y tiempo reales del bundle, no solo que responda.

LIMITES DUROS:
- NO abrir el frente R3F / three.js. No tenemos skill de 3D en web y ningun cliente actual lo pide. Si te sale al paso, anotalo como pendiente y segui.
- NO tocar main con WIP parcial: si un archivo nuevo importa otro archivo nuevo, van los dos o ninguno.
- Rama propia, commits conventional, gates (tsc --noEmit, tests, code-reviewer) antes de mergear.
- Si algo queda a medias, escribir el handoff en .claude/handoff/<rama-con-guiones>.md con los 7 campos de hermes-content/docs/HANDOFF_DE_SESION.md.

LISTO = la entrada del patron esta en web-factory/docs/MOTION_PATTERN_BANK_2026.md con la escalera de degradacion incluida y citando la ficha de united-carriers; existe una demo que corre; y hay capturas hechas con Playwright a 375 y 1440 MAS una con prefers-reduced-motion, las tres miradas y descritas, mostrando el pin, el scrub y la ruta degradada funcionando — con el peso del JS gzipped medido y por debajo de 150 kb.
```

## O3 · Teaser de 15 s con filtro-como-transicion (HyperFrames)

- **Ficha:** [ASCII Magic v2: el filtro como transicion (teaser de lanzamiento)](../2026-08-23-ascii-magic-v2-filtro-como-transicion.md)
- **Qué falta:** Nada bloqueante: no hace falta credencial, permiso ni gasto (HyperFrames corre local y gratis). Faltan dos decisiones nuestras: (a) que material propio se procesa — capturas de la plataforma YA vivas, no mockups; (b) cortar el cierre 'coming soon', que viola la regla 'la venta nunca exhibe obra' del CLAUDE.md; se cierra en el nombre o en algo encendido en produccion.

```text
OBJETIVO: construir en HyperFrames un teaser de producto de ~15 s, 16:9, que use el patron 'filtro-como-transicion': UNA sola toma continua de camara, cero cortes a negro, cero fundidos, y las 'escenas' se separan cambiando el FILTRO aplicado encima del mismo movimiento.

REFERENCIA: reel de ASCII Magic v2 (https://www.instagram.com/p/DbvxMwghtkA/). Ficha completa en hermes-content/references/video-intake/ascii-magic-v2-filtro-como-transicion.md. El estilo es RECONSTRUIDO a partir de 31 fotogramas: nadie publico el codigo ni el proyecto.

ANTES DE CODEAR (obligatorio):
1. Cargar las skills: hyperframes (entrada), hyperframes-core, hyperframes-animation, motion-doctrine, seam-craft, cut-the-curve.
2. Buscar en el repo si YA existe un preset/filtro ASCII o halftone (grep por 'ascii', 'halftone', 'dither', 'scanline' en web-factory/ y en las skills de hyperframes). Si existe, reusarlo. Si no, recien ahi escribirlo.
3. Leer web-factory/docs/MOTION_PATTERN_BANK_2026.md para no duplicar un patron que ya este anotado.

QUE CONSTRUIR:

A) Pipeline de filtros — un <canvas> que muestrea cada frame de un <video>/<img> de fondo y lo re-dibuja en una grilla de celdas de ~8x8 px. Cinco modos, todos sobre la misma grilla:
   - ascii: luminancia media por celda -> caracter de la rampa '@M#x+0es. ' dibujado en monoespaciada blanca sobre negro.
   - halftone: circulo por celda con radio proporcional a la luminancia. Dos variantes: dura (blanco sobre negro, sin glow) y con bloom radial (ambar #FFC24D -> #FF8A1F -> #E03A00).
   - dither: Bayer 4x4, blanco y negro puro.
   - edges: Sobel + umbral. Variante 1: contorno blanco de 1 px sobre negro. Variante 2 'blueprint': mismos bordes blancos sobre fondo azul plano #1533E0.
   - glitch: desplazamiento horizontal aleatorio de bandas + separacion de canales RGB.
   Encima de TODOS: scanlines con repeating-linear-gradient(0deg, rgba(0,0,0,.35) 0 1px, transparent 1px 3px).

B) Capa de collage 3D (solo en 2 momentos): 8-12 paneles de captura colocados con transform: perspective() rotateX/rotateY translateZ sobre una superficie curva, sangrando por los cuatro bordes. La camara empuja hacia adentro. CSS 3D, NO WebGL.

C) Capa HUD de falsa deteccion (solo sobre el collage): divs con border:1px solid #FF2B2B, punto #2BFF5C de 4 px en el centro de cada caja, etiqueta monoespaciada 'x: NNN y: NNN' pegada arriba-izquierda, y un SVG con stroke-dasharray de 1 px conectando cajas con curvas punteadas.

D) Texto — LA REGLA MAS IMPORTANTE: el texto NO SE MUEVE NUNCA. Se revela caracter por caracter (typewriter a 10-12 caracteres/s) en su posicion final y se queda clavado en el eje vertical del centro (y = 50%) mientras los cinco fondos pasan por detras. El texto es el ancla; el fondo es lo que muta. Sobre fondo ruidoso, respaldarlo con una caja SOLIDA ceñida al texto (negra o blanca) — nunca degradado, nunca sombra. Tipografia: UNA monoespaciada blanca, regular, tracking 0.05em, ~5-6% del alto de cuadro, para todos los kickers; una grotesca semibold solo para el dato duro.

E) Guion, 8 estados (adaptar los textos a lo que este VIVO en produccion, sin inventar cifras):
   1. (0-2 s) una cifra sola, grande, negra sobre blanco, contando hacia arriba. Sin palabra que la explique.
   2. (2-4 s) segunda cifra que sube la apuesta, sobre el collage 3D + HUD.
   3. (4-5 s) el denominador de tiempo ('en N meses').
   4. (5-7 s) una frase partida en DOS planos, que cruza el cambio de filtro.
   5-7. tres kickers de 2-3 palabras, uno por plano, ~0,8-1 s cada uno, cada uno DEMOSTRADO por el fondo y no explicado.
   8. (13-15 s) el nombre. Se cierra AHI.

PROHIBIDO (regla dura del CLAUDE.md, 'La venta nunca exhibe obra'): no escribir 'coming soon', 'proximamente', 'muy pronto', 'beta', 'en construccion' ni ninguna palabra de estado de obra. El video se cierra en el nombre o en algo YA encendido en produccion. La referencia si lo hace; nosotros no.

TAMBIEN PROHIBIDO: inventar cifras. Si no hay un numero real y verificable en produccion, el estado 1 y 2 se reemplazan por otra cosa; no se fabrica.

AL TERMINAR: anotar los dos patrones en web-factory/docs/MOTION_PATTERN_BANK_2026.md ('filtro-como-transicion' y 'texto ancla / fondo mutante'), con el link a la ficha.

LISTO = un MP4 renderizado por HyperFrames, 16:9, entre 14 y 16 s, verificado ABRIENDO el archivo y mirando fotogramas concretos: (a) al menos 4 de los 5 filtros aparecen, uno por escena; (b) el texto esta en la misma coordenada Y en los 8 estados; (c) no hay ningun fotograma completamente negro ni completamente blanco de transicion; (d) grep del HTML no encuentra 'soon', 'proximamente', 'beta' ni 'muy pronto'; (e) los dos patrones estan escritos en MOTION_PATTERN_BANK_2026.md.
```

## O4 · Auditoría anti-vibecoded — 30 señales

- **Ficha:** [30 señales de sitio vibecoded](../2026-08-23-30-senales-sitio-vibecoded.md)
- **Qué falta:** Para el checklist: NADA. Es leer los 30, escribirlos en design-quality.md y correrlo contra onia.com.bo y onia-platform; se cierra en una sesión. Para el reel: dos decisiones de Sergio, ninguna técnica. (a) La voz: Sergio a cámara (gratis, y el formato PIDE cara real) o Lucía por ElevenLabs (gasto → permiso explícito caso por caso). (b) La lista propia: los 30 de este video son tells del mercado gringo y varios no aplican — 'em dashes' es un tell de texto en inglés, 'inter/geist/space grotesk' es un tell del stack Vercel. Hay que escribir los ~20 que sí aplican a lo que se ve en Bolivia.

```text
Sos auditor de diseño. Vas a revisar la superficie web que te indique y decidir si delata que fue generada por IA sin criterio ('vibecoded').

REGLA DE ENTRADA: verificás MIRANDO. Abrí la página renderizada con Playwright + Chromium headless, sacá capturas a 375, 768 y 1440 de ancho, y LEÉ las capturas. Un HTTP 200 y un grep NO son verificación. Un grep sirve para descartar, nunca para confirmar que algo se ve bien.

Revisá estas 30 señales, una por una. Para cada una respondé SÍ (está presente) / NO / N-A, y si es SÍ citá el archivo y la línea o el selector exacto donde vive:

 1. Gradientes duros (saltos de tono agresivos, arcoíris de fondo)
 2. Íconos de la librería lucide sin retocar
 3. Fondo blanco puro (#FFF) sin capa ni temperatura
 4. Coloreado arcoíris (cada tarjeta un color distinto porque sí)
 5. Drop shadows genéricas en todo
 6. Tres feature cards en fila, iguales, sin jerarquía
 7. Emojis usados como íconos
 8. Liquid glass / glassmorphism sin profundidad real
 9. Rayas em (—) en el copy [ADAPTAR: en español el tell equivalente es el guion largo suelto y el 'no es X, es Y']
10. Tipografía Inter, Geist o Space Grotesk usada por defecto y sin razón
11. Franja de color al borde izquierdo de las tarjetas
12. Testimonios inventados (nombre + cargo + empresa que no existen)
13. Bento grid decorativo, sin contenido que lo justifique
14. Ventana de terminal falsa mostrando un npx que nadie corre
15. Construcción "no es X, es Y" en el copy
16. Bullets con tilde verde ✓
17. Tres planes de precio, siempre tres
18. Cero demos reales del producto (mockups vacíos, 'coming soon')
19. Border-radius suave y uniforme en absolutamente todo
20. Paleta violeta + negro (ojo #8B5CF6 / #6D28D9 / #0A0A0A / #18181B, o sea violet-500/700 + zinc-900/950 de Tailwind)
21. Sin skeleton loaders (spinner + 'Cargando...' en vez de esqueleto)
22. Orbes radiales de fondo
23. Retículas de puntos decorativas
24. Íconos de chispita ✨ en los botones de IA
25. Flechas → animadas en cada link
26. Sin Términos y Condiciones enlazados en el footer  ← DEUDA LEGAL, no estética
27. Sin Política de Privacidad enlazada en el footer  ← DEUDA LEGAL, no estética
28. Animación de hover en absolutamente todo (típico: translateY(-16px) + scale(1.05))
29. Colores neón
30. Pastel básico (baby blue / blush pink / mint green / butter yellow)

DESPUÉS de la tabla, entregá:
- El CONTEO: cuántos SÍ sobre 30.
- Los 26 y 27 aparte, marcados como bloqueantes legales si dan SÍ.
- Para cada SÍ estético, UNA corrección concreta con el archivo y el cambio exacto. Nada de consejos genéricos.
- Lo que NO pudiste verificar y por qué.

NO inventes hallazgos. Si no lo viste en la captura, decí que no lo viste.

LISTO = existe la tabla de 30 filas con archivo:línea citado en cada SÍ, las capturas a 375/768/1440 están guardadas en disco y referenciadas por ruta absoluta, los ítems 26 y 27 dan NO (o están abiertos como bloqueantes), y el conteo total de SÍ estéticos es ≤ 6.
```

---

# Lote cosechado del DM — 2026-08-23 — 5 prompts

> Fuente: [`PROMPTS_LOTE_2026-08-23-COSECHA.md`](../PROMPTS_LOTE_2026-08-23-COSECHA.md).
> Sin transcripción de audio: Speaches falló. Texto en pantalla + caption + cortes medidos.

## P1 · Evaluar e instalar genjutsu y motion-design-skill (los 2 hallazgos que no tenemos)

- **Ficha:** [Cinco skills de animación: dos son skills de verdad, tres son librerías de siempre](../2026-08-23-cosecha-cinco-skills-animacion-genjutsu-motion-design.md)
- **Qué falta:** Para web-factory, NADA: los dos repos son públicos y MIT, y la evaluación es leer el código antes de instalar (con una precaución concreta: la barra de lenguajes de Genjutsu dice Python 95,1% + Shell 4,9%, o sea que trae scripts ejecutables, no solo markdown — eso se revisa ANTES de instalarlo, no después). Para marketing, tampoco falta credencial ni permiso de gasto: el circuito comentario→DM está vivo y el destino ya está decidido desde el 23-ago. Lo único que falta ahí es elegir el TEMA del roundup propio, porque Onia no vende skills de animación.

```text
Objetivo único de la sesión: decidir, con evidencia leída, si las skills públicas `AThevon/genjutsu` y `lottiefiles/motion-design-skill` entran a nuestro stack de motion o se descartan por duplicación.

De dónde sale: ficha de video-intake `cinco-skills-animacion-genjutsu-motion-design` (carrusel de @sujeitoprogramador, IG Db--nmlFmqR). El carrusel lista 5 "skills de animación". Ya verifiqué por grep sobre todo el repo que TRES de las cinco ya las tenemos y NO hay que tocarlas:
- GSAP → plugin `gsap-skills` instalado, 8 skills (gsap-core, gsap-timeline, gsap-scrolltrigger, gsap-plugins, gsap-react, gsap-frameworks, gsap-performance, gsap-utils).
- Three.js → adapter en `.claude/skills/hyperframes-animation/adapters/three.md`.
- Motion / Framer Motion → ya en uso en web-factory, documentado en `hermes-content/references/ui-patterns/APRENDIZAJE_WEBS.md`.
Las dos que NO existen en el repo (cero coincidencias de grep) son las dos de este encargo.

Pasos:

1) Worktree propio con ruta explícita, `git branch --show-current` antes de tocar nada. Carril web-factory.

2) Clonar los dos repos FUERA del repo (a un temp), no instalarlos todavía:
   - https://github.com/AThevon/genjutsu
   - https://github.com/lottiefiles/motion-design-skill

3) REVISIÓN DE SEGURIDAD ANTES DE INSTALAR — no es opcional. Dato leído en pantalla en la lámina s02 del carrusel: el repo de Genjutsu declara `Python 95,1% · Shell 4,9%`. Una skill de diseño de movimiento que es 95% Python + 5% shell tiene SCRIPTS EJECUTABLES, no es solo markdown. Antes de instalar:
   - listar todo archivo `.py`, `.sh`, y todo hook declarado;
   - leer qué hacen: si escriben fuera del cwd, si hacen red, si leen credenciales o `.env`, si tocan configuración de Claude;
   - si algo hace red o toca settings/credenciales, PARAR y reportarlo sin instalar.
   Mismo chequeo para motion-design-skill (su README se declara "philosophy-first, implementation-agnostic", así que probablemente sea markdown puro — verificarlo, no asumirlo).

4) SOLAPAMIENTO. Leer el SKILL.md / README de cada uno contra lo que ya tenemos y responder por escrito, skill por skill:
   - ¿Qué dice que hace que `.claude/skills/motion-doctrine/` NO cubra ya?
   - ¿Qué dice que hace que `.claude/skills/cut-the-curve/` y `seam-craft` NO cubran ya?
   - ¿Qué aporta sobre `web-factory/docs/MOTION_PATTERN_BANK_2026.md`?
   - ¿Contradice alguna regla de motion-doctrine? (motion-doctrine se declara superior a guías de motion upstream — si hay choque, gana motion-doctrine y hay que decirlo explícito).
   Genjutsu además dice cubrir Android (Jetpack Compose) y Apple (SwiftUI) — eso NO nos sirve hoy, no lo cuentes como valor.

5) VEREDICTO POR SKILL, uno de tres: INSTALAR / DESCARTAR-POR-DUPLICACIÓN / DESCARTAR-POR-RIESGO. Con la razón en una línea y el archivo concreto que la respalda.

6) Solo las que den INSTALAR se instalan, y se prueban de verdad, no por grep: aplicar la skill a UN componente real de web-factory y MIRAR el resultado renderizado (Playwright + captura, y leer la captura). Un 200 y un grep no son verificación.

7) Escribir el resultado donde corresponde: si una skill entra, se anota en la skill nuestra que corresponda (editar la existente, NO crear doc suelto en la raíz). Si las dos se descartan, se anota el descarte con su razón en la ficha de video-intake para que nadie las vuelva a evaluar en tres semanas.

8) Cerrar el carril: commits conventional explicando el POR QUÉ, gates (`tsc --noEmit`, tests, code-reviewer), y handoff en `.claude/handoff/<rama-con-guiones>.md` con los 7 campos, incluyendo intentos fallidos.

No hagas: no instales nada sin haber leído sus scripts; no reabras la Landing v3 (aprobada, base clara); no toques los 4 archivos raíz de web-factory sin avisar; no persigas el otro frente que salió de esta ficha (el molde de carrusel para marketing) — ese va en otra sesión, anótalo y seguí.

LISTO = existe un veredicto escrito (INSTALAR / DESCARTAR-POR-DUPLICACIÓN / DESCARTAR-POR-RIESGO) para cada una de las dos skills, cada veredicto citando el archivo leído que lo respalda; y si alguna dio INSTALAR, hay una captura renderizada de un componente real de web-factory hecho con ella, mirada y comentada.
```

## P2 · Reconstruir el toggle que conmuta la grilla entera de productos

- **Ficha:** [El toggle "Lights" que enciende toda la grilla de productos](../2026-08-23-cosecha-toggle-luces-grilla-producto.md)
- **Qué falta:** Para el patron web: NADA. Se hace hoy, sin credencial, sin gasto y sin decision pendiente. Para el molde de video faltan dos decisiones chicas y una prohibicion: (i) elegir la palabra clave del comentario en espanol (el equivalente de LEAK); (ii) que la pieza mande a agendar demo en cal.onia.com.bo y no a un PDF (decidido el 23-ago); (iii) PROHIBIDO copiar el overlay de heatmap - inventar un mapa de calor es fabricar dato y choca con la regla de no fabricar.

```text
Trabajas en el repo onia-hermes. Objetivo unico de la sesion: agregar un patron nuevo a la biblioteca de UI reconstruidos.

CONTEXTO
En https://www.instagram.com/p/DbEHFJjjd6y/ (@andrew.plerdy) una tienda de iluminacion tiene, en la barra de herramientas de la coleccion (a la derecha de "View"), un toggle etiquetado "Lights". Al accionarlo, las 8 fichas de producto visibles cambian su foto AL MISMO TIEMPO: pasan de la version con la lampara apagada (pared clara, fondo gris frio) a la version encendida (bulbo emitiendo, halo ambar, entorno oscurecido). No es hover por ficha ni carrusel: es UN control a nivel de coleccion que conmuta la imagen primaria de TODA la grilla. El video no muestra codigo - se reconstruye, no se copia.

QUE HACER
1. Lee primero hermes-content/references/ui-patterns/README.md y respeta sus reglas al pie de la letra (un index.html autocontenido y sin dependencias, fuente anotada en comentario arriba del archivo, solo transform y opacity salvo justificacion escrita, prefers-reduced-motion con `transition: none` y NO con 0.01ms).
2. Crea hermes-content/references/ui-patterns/toggle-luces-grilla/index.html con:
   - Una grilla de 8 fichas de producto (nombre + "Desde Bs X"), responsive, que no desborde a 320px de ancho.
   - Una barra de herramientas arriba con el toggle etiquetado. Usa un input[type=checkbox] con label (o un button con aria-pressed) - debe ser operable con teclado y anunciar su estado a un lector de pantalla.
   - Cada ficha con DOS imagenes apiladas en el mismo contenedor (position:absolute), la de estado A abajo y la de estado B arriba con opacity:0. El toggle escribe el estado UNA sola vez en el contenedor de la grilla y las fichas lo leen por selector descendiente: UN evento, N imagenes. Prohibido un listener por tarjeta y prohibido cambiar src.
   - Crossfade de opacity entre ambas imagenes, ~250-350ms, con la misma curva para las 8.
   - Como no tenemos fotos reales de lampara encendida/apagada, genera los dos estados con gradientes CSS inline o SVG data-uri dentro del mismo archivo (fondo gris frio ~#D8D2C8 vs halo ambar ~#E8913A). No descargues nada ni referencies assets externos: el archivo tiene que abrir solo.
   - Un parrafo corto de nota al pie del HTML (en comentario) explicando por que el apilado evita el parpadeo del primer clic: ambas imagenes ya estan en el DOM.
3. En el mismo archivo, en el comentario de cabecera, anota: la fuente (URL + cuenta), que se reconstruyo sin ver codigo, y que el valor real del patron es fotografico (dos assets del MISMO encuadre, mismo angulo y mismo lente, cambiando solo el estado) - sin eso el gesto se lee como "cambio la foto" y no como "encendi la luz".
4. Agrega el patron a la tabla/indice de hermes-content/references/ui-patterns/README.md si el README lleva indice; si no lleva, no inventes uno.
5. Agrega a web-factory/docs/MOTION_PATTERN_BANK_2026.md una entrada corta para el gesto "crossfade de grilla completa disparado por un toggle de coleccion", respetando el formato que ya usa ese archivo.
6. Abre el index.html con Chromium headless y MIRA la captura en los dos estados (no basta con que el archivo exista). Verifica ademas que con prefers-reduced-motion forzado el cambio sea instantaneo y que las 8 fichas efectivamente esten en el estado B.
7. Commit conventional en tu propia rama, explicando el POR QUE.

NO HAGAS
- No copies el overlay de heatmap del video ni ninguna cosa parecida a un mapa de calor: inventar dato de usuarios viola la regla de no fabricar de este repo.
- No metas GSAP, framer-motion ni ninguna libreria: son dos opacity y un :checked.
- No toques nada fuera de hermes-content/references/ui-patterns/ y web-factory/docs/MOTION_PATTERN_BANK_2026.md.

LISTO = existe hermes-content/references/ui-patterns/toggle-luces-grilla/index.html, abre sin errores de consola y sin ninguna peticion de red externa, y una captura de Chromium headless muestra las 8 fichas en estado apagado y otra captura las muestra a las 8 en estado encendido tras un solo clic en el toggle.
```

## P3 · Plantilla 'guia de una pagina': el patron de documento-lead-magnet extraido del reel Db6y_ypvWbF

- **Ficha:** [El documento como lead magnet: la guía de una página de @ianlee.js](../2026-08-23-cosecha-guia-una-pagina-prd-ianlee.md)
- **Qué falta:** Nada. No hace falta credencial, permiso ni gasto. El CONTENIDO del metodo PRD ya esta cubierto por make-plan, superpowers:writing-plans y el comando prp-prd; lo que se copia aca es la FORMA, no el fondo.

```text
Objetivo unico de la sesion: construir la plantilla HTML reutilizable de 'guia de una pagina' de ONIA, portando el MECANISMO de diseno de un documento de referencia. No es un rediseno de nada vivo: es un archivo nuevo en el banco de patrones.

Carril: web-factory. Worktree con ruta explicita; correr `git branch --show-current` antes de tocar nada.

ANTES de codear, cargar: skill `impeccable`, skill `ui-ux-pro-max`, y la galeria interna `hermes-content/references/ui-patterns/`. Regla del proyecto: nada de plantilla generica de Tailwind/shadcn — hay que cumplir >=4 de las Required Qualities de rules/web/design-quality.md.

REFERENCIA (extraida a mano de 58 fotogramas de https://www.instagram.com/p/Db6y_ypvWbF/ de @ianlee.js; los fotogramas estan en el intake de video, ficha `guia-una-pagina-prd-ianlee`). El documento original es en espanol, se llama 'Escribe tu maldito PRD' y es una pagina HTML renderizada en navegador. NO lo copies literal: porta el MECANISMO, con contenido nuestro.

El mecanismo, pieza por pieza:
1. Titulo corto y contundente + una sola linea de subtitulo que promete el beneficio en tres palabras ('claridad, control y velocidad'). Regla horizontal de 1px debajo.
2. Secciones numeradas con el simbolo de seccion (§1, §2, §3). El titulo de la seccion es corto y su definicion va EN LA MISMA LINEA, en gris, no debajo. Esto ahorra media pantalla por seccion.
3. Bloque de dos columnas contrapuestas: 'CONTIENE' (azul) vs 'NUNCA CONTIENE' (rojo). Cada item es un chip con borde de 1px y relleno tenue. Los chips de la columna roja van TACHADOS. El tachado hace el trabajo que haria un parrafo entero de 'no incluyas'.
4. Bloque de comparacion 'ASI NO' / 'ASI SI': la caja mala en gris con los items tachados, la caja buena en rojo con una cita real entre comillas angulares. Sin iconos de check ni de cruz.
5. Parrafo de cierre de seccion con negrita A COLOR sobre las 3-4 frases clave, para que el resumen se lea sin leer el parrafo.
6. Tabla de tres columnas donde la columna del medio es una BARRA de ancho creciente y la barra ES el dato: sin eje, sin numero, sin leyenda. La columna derecha dice el veredicto en negrita + la explicacion en gris.

Tokens (hex aproximado, leido de pantalla; ajustalos a la paleta viva de ONIA si ya existe una en el repo, y si existe MANDA la de ONIA):
- papel #FDFDFC, tinta #1A1A1A
- acento primario ~#2B4C9B sobre relleno ~#F4F7FE
- acento de prohibicion ~#B3261E sobre relleno ~#FDF4F3
- descarte ~#F2F2F0 con texto tachado ~#8A8A85
Tipografia: UNA sola grotesca geometrica en dos pesos. Etiquetas de seccion en versalitas espaciadas. Cero sombras, cero degradados, cero radios grandes, cero texturas. Plano y editorial.

QUE CONSTRUIR:
- `hermes-content/references/ui-patterns/guia-una-pagina/plantilla.html` — autocontenido, sin CDN, tokens CSS en `:root`, responsive real (sin scroll horizontal a 390px), y con los seis bloques de arriba marcados con comentarios HTML para que se puedan borrar los que no se usen.
- `hermes-content/references/ui-patterns/guia-una-pagina/README.md` — que dice de donde salio el patron (la URL y la cuenta), que hace cada bloque y CUANDO usar cada uno.
- Un ejemplo relleno con contenido REAL de ONIA en la misma carpeta (`ejemplo-dental.html`), usando el rubro dental que es el unico vivo.

REGLAS DURAS DE ONIA que aplican al ejemplo relleno:
- Prohibido escribir una cifra de precio a mano. Los precios se LEEN de onia-platform/lib/pricing.ts (add-ons) y onia-platform/lib/subscription-plans.ts (planes). Si el ejemplo necesita un precio, dejalo como un placeholder marcado, no lo inventes.
- Prohibido exhibir obra: ni 'muy pronto', ni 'beta', ni 'proximamente', ni listas de lo que falta. Solo se nombra lo que esta vivo.
- Prohibido fabricar: cero testimonios, cero logos de clientes, cero metricas. Hay cero clientes pagando.
- El unico CTA final es agendar una demo en https://cal.onia.com.bo (decision del 2026-08-23). No es un PDF, no es un lead magnet descargable.

VERIFICAR MIRANDO, no suponiendo: abrir los dos HTML en Chromium headless con Playwright y GUARDAR las capturas al lado del archivo. Un grep no confirma que se vea bien.

LISTO = existen `hermes-content/references/ui-patterns/guia-una-pagina/plantilla.html`, `README.md` y `ejemplo-dental.html`; hay cuatro capturas PNG guardadas en esa carpeta (plantilla y ejemplo, cada uno a 1440x900 y a 390x844) tomadas con Chromium headless y MIRADAS; ninguno de los dos HTML produce scroll horizontal a 390px; `grep -iE 'muy pronto|beta|proximamente|próximamente'` sobre la carpeta no devuelve nada; el ejemplo no contiene ningun numero de precio escrito a mano; y el unico href de CTA del ejemplo es https://cal.onia.com.bo.
```

## P4 · P23 + P24 en el banco de motion: el eje que gira y el velocimetro por scroll (y corregir la ficha de United Carriers del 11-ago)

- **Ficha:** [United Carriers: el eje de scroll que gira y el velocímetro por scroll](../2026-08-23-cosecha-review-united-carriers-eje-de-scroll-y-velocimetro.md)
- **Qué falta:** Nada para lo que declaro SIRVE YA: el velocimetro y el giro de eje son CSS + JS puro, sin credencial, sin gasto y sin cliente. Lo unico que falta y NO se puede resolver desde este material es medir el peso real de unitedcarriers.com (LCP, KB de JS gzipped) para confirmar o desmentir la afirmacion del caption de que carga muy liviano — eso exige abrir y medir el sitio, y hoy solo tengo el juicio escrito de un tercero. Ese dato es el que decide si la ficha del 11-ago tenia razon al descartarlo por presupuesto de performance.

```text
Carril web-factory. Objetivo unico de la sesion: meter en el banco de motion los dos patrones que sacamos del reel https://www.instagram.com/p/Db9L8EDhf5H/ (@oproductdesigner reseñando unitedcarriers.com), dejarlos con demo que se pueda MIRAR, y corregir la ficha de intake que ya teniamos de ese mismo sitio.

Contexto que no tenes que volver a investigar:
- El sitio ya estaba en el banco. Lee PRIMERO hermes-content/references/video-intake/2026-08-11-web-3d-scrollytelling-united-carriers.md. Esa ficha analizo el MISMO sitio desde otro reel el 11-ago, lo dejo en FUTURO, y dejo abierta esta verificacion textual: "A VERIFICAR: que unitedcarriers.com siga online y sea el sitio real en produccion (no un mockup de portafolio armado para el reel)". Tambien afirma "no se nombra herramienta ni framework".
- El reel nuevo aporta datos que aquella ficha no tenia. En el footer, leido en pantalla: "© 2026 UNITED CARRIERS APAC PTY LTD · CRAFTED BY BEAMPLUS ... POWERED BY STRIPE"; HEAD OFFICE 2A International Square, Tullamarine VIC 3043, Australia; EMAIL contact@unitedcarriers.com; HOTLINE 1300 000 082; OPERATING ACROSS Australia / New Zealand / Hong Kong / China; SECURE PAYMENTS con pasarela PCI-DSS. La agencia SI esta nombrada (BEAMPLUS); el framework sigue sin nombrarse.
- El caption (portugues) afirma que el sitio carga muy liviano y usa muy poco video, y que tapar escenas elaboradas con videos ya renderizados "funciona, si, pero pesa" y sale caro en infra y experiencia. Eso es JUICIO DE UN TERCERO, no una medicion nuestra. No lo escribas como hecho.

HACE ESTO, en este orden:

1. Corregi (no dupliques, no crees archivo nuevo con fecha de hoy) hermes-content/references/video-intake/2026-08-11-web-3d-scrollytelling-united-carriers.md: reemplaza el bloque "A VERIFICAR" por lo que este reel efectivamente muestra (sitio navegado en vivo, con datos de empresa, direccion fisica, hotline y pasarela de pagos — consistente con produccion), corregi la linea "no se nombra herramienta ni framework" para reflejar que la AGENCIA si esta nombrada (CRAFTED BY BEAMPLUS) aunque el framework no, y dejá escrito como pendiente explicito que NADIE midio todavia el peso real del sitio. Cita el reel Db9L8EDhf5H como fuente de la correccion. El veredicto FUTURO del sitio completo se mantiene: no lo cambies.

2. Agrega dos patrones a web-factory/docs/MOTION_PATTERN_BANK_2026.md, siguiendo EXACTAMENTE el formato de los P1-P22 que ya estan ahi (el banco va por P22; ojo que P18 BleedWordmark ya cubre la palabra gigante sangrada, no lo repitas):
   - **P23 — Eje que gira (V->H->V) con costura fisica.** El scroll cambia de eje vertical a horizontal y vuelve, y la transicion entre secciones es la continuacion del MISMO objeto portador, nunca un fundido. En el sitio de referencia: un contenedor pasa a camion, la carretera dobla 90 grados y el eje vuelve a vertical; la atmosfera del globo se blanquea y ES el fondo blanco de la seccion siguiente; la franja de carretera desemboca en la cubierta de un barco; las nubes pasan a ser el suelo del avion. Regla dura que tiene que quedar escrita: el portador se dibuja POR ENCIMA de la capa de texto en al menos una seccion — eso es lo que hace que se lea como un unico espacio 3D y no como fondo decorativo. Implementalo con GSAP ScrollTrigger (skill gsap-scrolltrigger) y respeta las reglas duras de la seccion 1 del banco, incluido prefers-reduced-motion.
   - **P24 — Lectura derivada de velocidad de scroll.** Un contador NN KM/H en una esquina, derivado de la VELOCIDAD del scroll (no de la posicion), suavizado y formateado a dos digitos, que cae a 00 cuando el usuario se detiene. Es el detalle mas barato y mas impresionante del sitio entero: cero 3D, cero WebGL, cero assets. Dejalo generico (unidad configurable), no atado a logistica.

3. Crea hermes-content/references/ui-patterns/scroll-velocity-readout/ con una demo autocontenida (mismo formato que las carpetas hermanas: chat-widget/, checkout-card/, floating-cart/, etc.) que muestre P24 vivo y P23 al menos en su version minima de un giro de eje.

4. Anota en web-factory/docs/DESIGN_LEARNED_2026.md el truco tipografico de titular en dos tonos: primera linea en gris, resto en casi-negro (WE MOVE FREIGHT gris / WE OWN THE OUTCOME negro). Una linea, con su porque.

REGLAS DE LA CASA que aplican aca:
- Verificar es MIRAR. Abri la demo con Playwright + Chromium headless y LEE la captura. Un 200 y un grep no son verificacion.
- Un tema = un archivo sin fecha. No crees un doc nuevo al lado de la ficha del 11-ago: corregila.
- No fabriques. Lo que el reel no dice, no lo escribas. En particular: NO afirmes con que framework esta hecho el sitio (no se dice en ningun lado) y NO afirmes que carga liviano como si lo hubieramos medido.
- Metodo correcto desde el primer intento: carga las skills impeccable, motion-doctrine, seam-craft y gsap-scrolltrigger ANTES de escribir codigo.
- Rama propia, commits conventional, gates (tsc --noEmit si aplica, tests, code-reviewer) antes de mergear.

NO HAGAS en esta sesion: no arranques una landing 3D completa estilo United Carriers. Ese frente sigue cerrado por presupuesto de performance y de precio, tal como lo dejo la ficha del 11-ago. Si te tienta, anotalo como pendiente y segui.

LISTO = (a) MOTION_PATTERN_BANK_2026.md contiene las secciones `### P23` y `### P24` con codigo ejecutable y su nota de prefers-reduced-motion; (b) hermes-content/references/ui-patterns/scroll-velocity-readout/ existe y una captura de Playwright en tres posiciones de scroll distintas muestra TRES valores de KM/H distintos, con 00 en la captura sin movimiento, y el cambio de eje visible entre dos de ellas; (c) 2026-08-11-web-3d-scrollytelling-united-carriers.md ya no contiene la cadena "A VERIFICAR" ni la afirmacion "no se nombra herramienta ni framework" sin matizar, y si contiene "BEAMPLUS" y el pendiente explicito de medir el peso del sitio; (d) grep de marcadores de conflicto `<<<<<<<` en los archivos tocados devuelve cero.
```

## P5 · Crear el Design System de Onia en claude.ai/design con DesignSync (sin Figma, sin gasto)

- **Ficha:** [Claude Design: cargar la marca una vez y que todas las piezas salgan alineadas](../2026-08-23-cosecha-claude-design-sistema-de-diseno-de-marca.md)
- **Qué falta:** Nada bloqueante, y menos de lo que el post sugiere. No hay ningun .fig en el repo (find -iname '*.fig' = 0 resultados) y no hace falta: el formulario de Claude Design declara los insumos 'all optional' y acepta codigo local, repo de GitHub, o directamente fuentes/logos/assets por drag. Los tres insumos ya existen: hermes-content/brand/tokens.css (9 colores + 2 familias), onia-logo-horizontal.svg + onia-logomark.svg, y hermes-content/brand/fonts/. Sin gasto, sin credencial nueva, sin permiso. Unica decision pendiente (no bloqueante): si el sistema se genera con la marca actual o si primero se resuelve la pareja tipografica — hoy display y body son ambas sans, y el post demuestra que el contraste serif/sans es lo que da el aire.

```text
OBJETIVO UNICO DE LA SESION: dejar publicado el Design System de Onia en claude.ai/design, generado desde los archivos de marca que YA existen en el repo, para que toda pieza futura (landing, propuesta, carrusel, deck) herede la identidad sin re-describirla en cada prompt.

De donde sale esto: analisis del carrusel https://www.instagram.com/p/DbZHuAuIDhh/ (@vison.studios), ficha en hermes-content/references/video-intake/. El post ensena el flujo Figma -> .fig -> Claude Design. NO copies ese paso: el formulario de Claude Design declara sus insumos 'all optional' y acepta codigo local, repo de GitHub o simplemente fuentes/logos/assets. No tenemos ni necesitamos un .fig.

INSUMOS QUE YA EXISTEN (verificados, no los busques de nuevo):
- hermes-content/brand/tokens.css — 9 colores (--onia-green #10C26B, --onia-green-deep #0B8F4F, --onia-green-soft #D6F5E5, --onia-ink #0A0F0D, --onia-ink-2 #1C2622, --onia-surface #F4F5F2, --onia-white, --onia-muted #6B756F, --onia-muted-dark #9FB0A8) + 2 familias (--font-display Space Grotesk, --font-body Inter) + canvas 1080x1350 y radios.
- hermes-content/brand/onia-logo-horizontal.svg y onia-logomark.svg
- hermes-content/brand/fonts/
- hermes-content/brand/ONIA_BRAND_IDENTITY.md

PASOS

1. Lee hermes-content/brand/ONIA_BRAND_IDENTITY.md y tokens.css enteros antes de tocar nada. Carga la skill design-md.

2. DECISION A RESOLVER PRIMERO (y a preguntarle a Sergio si no es obvia desde ONIA_BRAND_IDENTITY.md): hoy --font-display y --font-body son AMBAS sans (Space Grotesk / Inter). El carrusel analizado demuestra que el contraste serif-display / sans-body es lo que da aire y jerarquia. Propone la pareja, mostrala renderizada en un HTML de una pantalla, y espera OK antes de hornearla en el sistema. Si Sergio prefiere quedarse con la pareja sans, se respeta y se sigue — no reabras el tema.

3. Construi el bundle local del sistema de diseno en web-factory/design-system/onia/ con, como minimo: escala tipografica (display/H1/H2/subtitulo/cuerpo/caption), los 9 colores con su rol semantico (no solo el hex: cuando se usa cada uno), escala de espaciado, radios, ambos logos con sus reglas de uso, estados de boton (default/hover/focus/active/disabled) y una tarjeta de superficie. Un archivo HTML de preview por componente, cada uno con el marcador de primera linea <!-- @dsCard group="..." --> para que la Design System pane arme el indice sola.

4. Publica con DesignSync, EN ESTE ORDEN OBLIGATORIO: list_projects -> (si no hay uno de tipo design system) create_project name="Onia Design System" -> get_project para VERIFICAR que type es PROJECT_TYPE_DESIGN_SYSTEM (ese tipo es inmutable al crearse; empujar a un proyecto normal nunca lo convierte en sistema de diseno) -> finalize_plan con localDir en web-factory/design-system/onia y los writes como globs -> write_files usando localPath (no data inline: asi los contenidos no entran al contexto).

5. VERIFICA MIRANDO, no suponiendo (regla del proyecto): abri el proyecto publicado y mira las tarjetas renderizadas. Un write_files con exito NO es verificacion. Si alguna tarjeta sale vacia, rota o sin estilos, arreglala antes de cerrar.

6. PRUEBA REAL DE QUE EL SISTEMA SIRVE: genera UNA pieza nueva heredando el sistema — una seccion de landing de Onia — y compara sus colores y tipografias contra tokens.css. Si no coinciden, el sistema esta mal armado, no la pieza.

PROHIBIDO
- No inventes colores, fuentes ni valores que no esten en tokens.css o ONIA_BRAND_IDENTITY.md. Si falta un valor, preguntá; no lo rellenes con criterio propio.
- No fabriques testimonios, logos de clientes ni cifras en ninguna pieza de ejemplo (cero clientes pagando).
- No escribas 'beta', 'muy pronto', 'en construccion' ni ningun estado de obra en material que pueda ver un cliente.
- No hardcodees hex fuera de tokens.css. tokens.css es la fuente unica.
- No toques archivos fuera de web-factory/design-system/onia/ y hermes-content/brand/ sin avisar.

AL CERRAR: escribi el handoff en .claude/handoff/<rama-con-guiones>.md con los 7 campos de hermes-content/docs/HANDOFF_DE_SESION.md — y no te saltees 'intentos fallidos'.

LISTO = existe un proyecto de tipo PROJECT_TYPE_DESIGN_SYSTEM llamado "Onia Design System" en claude.ai/design, confirmado por DesignSync get_project; sus tarjetas se ven renderizadas correctamente al abrirlo (verificado MIRANDO, con captura, no con un codigo de respuesta); y una pieza nueva generada desde ese sistema usa colores y tipografias que coinciden exactamente con hermes-content/brand/tokens.css.
```

---

# Lote del 2026-08-24 — 1 prompts

> Fuente: [`prompts-lote-2026-08-24/`](../prompts-lote-2026-08-24/README.md). **Sin audio**:
> Speaches falló en todo el lote.

## Q01 · Cinco paletas de lujo con sus hex — recuperadas, no reconstruidas

- **Ficha:** [Cinco paletas de lujo con sus hex — recuperadas, no reconstruidas](../2026-08-24-cinco-paletas-de-lujo-hex-recuperados.md)
- **Qué falta:** Nada.

```text
Objetivo único: incorporar las 5 paletas de lujo al banco de patrones como tokens usables, y contrastarlas contra la regla de color que el corpus ya había deducido.

De dónde sale: ficha `cinco-paletas-de-lujo-hex-recuperados` (IG DbvmsWlDKo6). Los hex están ESCRITOS en pantalla: esto es recuperado, no reconstruido. No hace falta muestrear ni adivinar.

Las 5 paletas, literales:
1. Racing: Alabaster Grey #D9D9D9 · Racing Red #DD0200 · Black Cherry #55100D · Coffee Bean #1A0706
2. Gold & Slate: Warm Gold #F4B044 · Burnt Orange #E0680E · Light Slate Blue #88A5B7 · Dark Blue #112532
3. Rosewood: Alabaster Cream #F1ECE6 · Warm Greige #DDD5CD · Vintage Rosewood #7D4047 · Charcoal Espresso #2E2E2E
4. Terracotta: Terracotta Clay #B5543A · Olive Accent #6F7F5F · Soft Limestone #F0E6D8 · Deep Rust #5A2E25
5. Earth: Beige #C29B72 · Terracotta #8D321F · Olive #3A4027 · Charcoal #2B2D31

Pasos:

1) Crear hermes-content/references/ui-patterns/paletas-lujo/ con las 5 paletas como custom properties CSS, siguiendo la convención de tokens que ya usa web-factory (mirar cómo están escritos los tokens existentes antes de inventar un formato nuevo).

2) Para cada paleta, declarar el ROL de cada color: fondo, superficie, acento, texto. No alcanza con listar hex: sin rol, nadie la usa bien.

3) Verificar CONTRASTE de cada combinación texto/fondo contra WCAG AA. Si alguna combinación no llega, decirlo en el archivo — una paleta linda que no pasa contraste es una trampa para el próximo que la use.

4) Contrastar contra la regla que el corpus ya había deducido por su cuenta: "un solo acento saturado, y siempre sobre el sujeto o el producto, nunca sobre la interfaz" (síntesis del lote del 23-ago, punto 6, ocho fichas coincidiendo). ¿Las cinco paletas la cumplen? Si alguna no, es la excepción interesante y hay que anotarla.

5) Decir cuál de las cinco, si alguna, sirve para Onia. Hoy la marca es verde. Ninguna de estas lo es, así que lo más probable es que sirvan para webs DE CLIENTE, no para nosotros. Ser explícito al respecto.

LISTO = la carpeta paletas-lujo/ con los 5 sets de tokens, cada color con su rol, el resultado del chequeo de contraste anotado, y un párrafo diciendo cuáles sirven para clientes y por qué ninguna reemplaza la marca de Onia.
```
