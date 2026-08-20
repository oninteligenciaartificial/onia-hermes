# Prompts del lote del 2026-08-20 — J1 a J4

13 items (7 reels + 6 carruseles) con las **cuatro reconstrucciones**.
Síntesis técnica: [2026-08-20-sintesis-lote-13.md](2026-08-20-sintesis-lote-13.md) ·
datos crudos: [analisis/2026-08-20-items.json](analisis/2026-08-20-items.json)

**Antes de pegar cualquiera:** los tres gates del preámbulo de
[PROMPTS_POR_SESION.md](PROMPTS_POR_SESION.md).

## Dónde se pega cada uno

| Sesión | Prompt | Orden |
|---|---|---|
| **`onia-plattform`** | **J4** los 6 tiers construidos y apagados | **primero de todo** — es un defecto en producción, no una idea |
| **`web-factory`** | **J1** DESIGN.md por cliente · **J2** el bucle de práctica de diseño | J1 primero |
| **`editor de videos`** | **J3** el anuncio sin cara ni voz | independiente |

---

## El hallazgo transversal que atraviesa dos items

**Delegar el estilo a una referencia nombrada, en vez de describirlo con adjetivos.** Apareció
dos veces, en items independientes y en medios distintos:

- Imagen: la instrucción de estilo entera es `"show me the AD magazine photography version of
  image 1."` — ni lente, ni f-stop, ni esquema de luz.
- Web: `"I want you to go towards the theme of what Uber does aesthetically."`

En los dos casos, un **nombre propio que el modelo ya conoce** reemplaza un párrafo de adjetivos.
Es lo contrario de la plantilla de 8 bloques largos del lote anterior — **y las dos funcionan,
para cosas distintas**: bloques largos cuando generás desde cero, referencia nombrada cuando
editás sobre algo que ya existe o cuando querés un *sistema* de estilo, no una imagen.

---

# ONIA PLATFORM

## J4 · Los 6 tiers construidos y apagados

```text
Contexto: analizando un reel sobre empaquetado de precios B2B, el analisis fue a verificar
contra nuestro repo si teniamos la entidad, y encontro un defecto de produccion:

  business-tiers.json tiene 6 tiers definidos.
  tierMeetsLimits() esta implementada y probada con tests y validador propio.
  Y tiene CERO callers fuera de onia-core.
  Mientras tanto, la landing usa un CAMPO DE TEXTO LIBRE para el mismo dato.

Sintesis donde salio: hermes-content/references/video-intake/2026-08-20-sintesis-lote-13.md

Esto es, textual, la definicion de "construido != terminado" del CLAUDE.md, y es la SEGUNDA vez
que se encuentra el mismo patron (la primera fue la capa multi-rubro con PLATFORM_LAYER vacio en
produccion). No es una idea de un video: es trabajo hecho con valor cero.

Tarea:
1. VERIFICALO VOS PRIMERO. Abri business-tiers.json, contá los tiers, y buscá los callers de
   tierMeetsLimits() en todo el repo, no solo en onia-core. Si el analisis se equivoco, decilo
   y pará ahi. Si tiene razon, seguí.
2. Segui el dato en produccion: cuando alguien se registra por la landing, ¿donde termina lo que
   escribe en ese campo de texto libre? ¿Se mapea a un tier o queda como string suelto?
   Verificalo en la base de produccion, no en el codigo.
3. Conecta el campo libre al tier. La landing tiene que ofrecer los tiers que EXISTEN, y lo que
   el usuario elige tiene que ser el mismo dato que tierMeetsLimits() lee.
4. Si algun tier de los 6 no corresponde a nada vendible hoy, sacalo o marcalo. Seis tiers
   definidos y ninguno usado es peor que dos usados.

OJO CON LOS PRECIOS: hay varias listas conviviendo en el repo (memoria
pricing-dentalgest-ratificado menciona 10). Esta tarea NO decide precios: conecta la entidad.
Si te topas con contradicciones de precio, anotalas y seguí; el precio lo decide Sergio.

LISTO = el registro por la landing escribe un tier real, verificado abriendo la pantalla y
mirando la fila en la base. Con la lista de callers antes y despues. Si queda detras de un flag
apagado, NO cuenta como hecho y hay que decirlo.
```

---

# WEB FACTORY

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

# EDITOR DE VIDEOS

## J3 · El anuncio sin cara y sin voz — el formato más barato que tenemos

```text
Contexto: un reel de 33 s es un anuncio de marca completo SIN UNA SOLA CARA y SIN LOCUCION.
Reconstruccion beat por beat en
hermes-content/references/video-intake/2026-08-20-sintesis-lote-13.md

POR QUE IMPORTA MAS QUE CUALQUIER OTRO FORMATO DEL CORPUS: sin cara = SIN EL PROBLEMA DE
CONSISTENCIA DE ROSTRO, que es exactamente lo que mas nos frena en video generativo. En 30 items
analizados, ninguno resolvio sostener una cara IA entre planos. Este formato lo esquiva por
diseno.

EL MOLDE, 7 beats en 33 s:
  0-5 s   GANCHO CINETICO: contrapicado pegado al piso, plano PARCIAL (piernas, torso), un
          objeto cruzando el cuadro en whip con motion blur. Sin cara, sin producto, sin texto.
          El gancho es MOVIMIENTO, no informacion.
  5-10 s  BEAT SURREAL: una imagen imposible pero fisica (lee como prop practico, no como
          generado). Es el "wait, what" que compra los segundos siguientes.
  10-14 s LA ACCION DE PRODUCTO: una sola en toda la pieza. Un vertido, un encendido, un clic.
  14-19 s ASPIRACION: vende el MUNDO, no el producto. Gente, lugar, luz.
  19-24 s HERO A CONTRALUZ: el producto a hora dorada, con flare.
  24-29 s BODEGON CENITAL: el producto terminado rodeado de los objetos del mundo.
  29-33 s PLACA: el logo, translucido, sobre el ultimo plano.

LAS 5 REGLAS PORTABLES:
  1. NINGUN plano muestra una cara. Solo manos, piernas, torso y objetos.
  2. La marca aparece UNA vez, en el ultimo segundo. El producto recien al tercio.
     Orden: mundo -> producto -> marca.
  3. La cohesion NO viene de un relato ni de un personaje: viene de un HILO DE COLOR repetido
     plano a plano. Un color se pasa de objeto en objeto como una posta.
  4. CARRIER ELEMENT: un mismo elemento grafico cruza el encuadre en varios planos (en el
     original, la sombra de una red). Es el pegamento entre tomas que no comparten nada mas.
  5. Sin voz. La musica lleva el ritmo y los cortes caen con ella.

Tarea:
1. Adaptá el molde a UN producto nuestro o de un cliente. Escribí los 7 beats con su duracion y
   que se ve en cada uno.
2. Defini el HILO DE COLOR y el CARRIER ELEMENT antes de escribir un solo prompt. Sin esos dos,
   los 7 planos no van a pegar.
3. Deci que planos se pueden filmar de verdad (manos y objetos con un celular es barato) y cuales
   necesitan generacion. Cuantos menos generados, mejor.
4. Estimá el costo en creditos de los generados y ponelo al lado.

NO GENERES. Entrega el guion de 7 beats, el hilo de color, el carrier element y el costo.

Dos gates que no se saltean:
- La REGLA DE ORO: tabla de cortes + preview 360p a Sergio ANTES de aplicar cualquier corte.
- Si lleva texto en pantalla, el gate de ortografia antes de quemarlo.

LISTO = guion de 7 beats con hilo de color y carrier element definidos, la division entre filmado
y generado, y el costo estimado. Cero generaciones.
```

---

# CONTENIDO

## K1 · Radar de ganchos — herramienta INTERNA, decidido por Sergio el 2026-08-20

```text
Contexto: un reel muestra un panel de marca personal con un modulo "Radar Viral" que rastrea
ganchos que estan funcionando y los sugiere. Ficha y datos:
hermes-content/references/video-intake/2026-08-20-sintesis-lote-13.md (item DcKABGBRkdY)

DECISION DE SERGIO, ya tomada, no la vuelvas a abrir: ES UNA HERRAMIENTA INTERNA DEL CARRIL DE
CONTENIDO. NO es un modulo de ONIA Platform, no va al core, no se le vende a nadie. Eso simplifica
todo: no necesita entidad en el core, ni RLS multi-tenant, ni pantalla de producto.

LO PRIMERO, Y ES UNA ADVERTENCIA SOBRE LA FUENTE: el video afirma "5 veces mas alcance" y su
PROPIA CAPTURA lo contradice — muestra 43 mil vistas en el titulo descriptivo contra 11,2 mil en
el titulo con el gancho copiado, o sea 3,8x MENOS, con un asterisco "2 dias despues" sin fechas
ni linea de base. NO REPITAS ESA CIFRA NI NINGUNA PARECIDA. Copiar un gancho no multiplica nada
por si solo; lo unico que sabemos es que el gancho es UNA de las variables.

QUE TIENE QUE HACER, en su version mas chica que sirva:
1. Juntar ganchos que ya funcionaron, de fuentes que YA TENEMOS y son gratis:
   - los reels que Sergio manda (ya estan analizados: hermes-content/references/video-intake/)
   - nuestras propias publicaciones y sus numeros reales
   - la biblioteca de anuncios de Meta, que es publica y gratis (ver prompt D4)
2. Guardar por gancho: el texto literal, el formato en el que aparecio, la fecha, y la fuente.
   NADA de metricas ajenas sin fuente verificable. Si no podes verificar el numero, no lo guardes:
   guarda el gancho igual, sin numero.
3. Poder buscarlo por tema y por formato cuando toca escribir una pieza.

QUE NO HAGAS:
- NO construyas un panel. Un archivo estructurado en el repo alcanza y es lo que se mantiene solo.
  Si termina siendo una tabla en markdown o un JSON, mejor.
- NO scrapees Instagram con automatizacion que viole ToS. La biblioteca de anuncios de Meta es
  publica y tiene API; los reels que analizamos ya estan en el repo.
- NO inventes metricas. Un gancho sin numero sigue sirviendo; un numero inventado envenena todo.
- NO lo llames "viral". Se llama radar de ganchos.

BUSCA PRIMERO DONDE VIVE: el carril ya tiene el corpus analizado y una sintesis por lote. Si el
radar se puede armar leyendo lo que YA esta escrito en video-intake/, no hace falta una fuente
nueva. Ese es el camino barato y es el que hay que probar primero.

LISTO = existe un archivo con los ganchos que ya tenemos identificados del corpus, cada uno con
su texto literal, formato, fecha y fuente, y se puede buscar por tema. Sin panel, sin metricas
inventadas, y con el metodo escrito para agregarle uno nuevo cuando aparezca.
```

---

