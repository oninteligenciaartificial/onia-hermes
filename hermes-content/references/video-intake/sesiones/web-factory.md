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

