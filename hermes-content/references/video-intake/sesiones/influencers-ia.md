# Sesión `INFLUENCERS IA` / Higgsfield / Lucía

> **Este archivo es la raíz de la sesión `INFLUENCERS IA`.** Todo lo que esta sesión tiene que hacer
> de lo que salió del análisis de reels está acá, completo. No hace falta abrir otro archivo.
>
> Orden: **E9 primero (es el que produce) → E6 → A4 → el resto**
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

## M1 · Bloques con nombre, sobrecobertura y la regla de texto

```text
Contexto: un reel de 12 s muestra su prompt ENTERO en pantalla. Es plantilla CINE pura (nadie
habla, impresiona) y trae tres cosas que el banco no tenia. Ficha y prompt literal completo:
hermes-content/references/video-intake/analisis/2026-08-22-items.json (item DcMX7O8i6CZ)

LA ARQUITECTURA: siete bloques con NOMBRE EN MAYUSCULAS ENTRE CORCHETES, y cada uno es una
REGLA, no una descripcion:
  [STYLE]                   camara + stock + set + paleta + TRES PROHIBICIONES explicitas
  [MODE — READ THIS FIRST]  como quiere el material entregado
  [THE OBJECT]              el sujeto, con un nivel de detalle textil
  [DISTRESS RULE]           la transformacion que tiene que verse ocurrir
  [TEXT RULE — MANDATORY]   que hacer con el texto en cuadro
  [HANDS RULE]              que se ve y que no de las personas
  [BEATS]                   los planos

TRES PALANCAS NUEVAS:

1. LA CAMARA SE ESPECIFICA, NO SE ADJETIVA: "Arri Alexa 35 and a Laowa 24mm f/14 probe lens".
   Un lente probe es exactamente el que produce esos macros volando sobre la tela. Nombrar el
   equipo real es mas preciso que cualquier adjetivo.

2. SOBRECOBERTURA A PROPOSITO, literal del prompt:
   "Fast-cut montage. I am cutting it myself in post. Deliberately overload it — more shots than
    fit, extra angles I did not ask for, alternate coverage of every beat, inserts, overshoots,
    impact frames. Every beat is a new shot. Nothing holds."
   Es lo CONTRARIO de pedir la toma exacta: se pide una hoja de contactos y se corta despues.
   Con un tope de 30 s por generacion, esto multiplica lo aprovechable por corrida.

3. LA REGLA DE TEXTO, que resuelve el defecto mas conocido de la IA:
   "Abstract invented serif forms and a numeral in an oval, not any existing brand name, city
    name or wordmark. They read as typographic shapes, never as language. Legibility not required
    at any point. Never garble or change. No other text anywhere."
   En vez de pelear porque el modelo no sabe escribir, se le pide que NO ESCRIBA: formas
   tipograficas, no lenguaje. Esto tambien explica el garabato del libro que vimos en otro item.

VERIFICADO EN LA CUENTA el 2026-08-22 (re-verificalo vos, tiene fecha de vencimiento):
seedance_2_5, modo omni_reference, 4-30 s, 9:16, hasta 1080p, generate_audio. El reel se hizo con
UNA sola imagen de referencia, UNA sola generacion de 12 s. unlim.available = false: gasta.

Tarea:
1. Incorpora los siete bloques con nombre a la plantilla CINE que ya tenemos. NO armes una
   plantilla nueva al lado: la de 5 bloques del 16-ago es la misma cosa con menos estructura.
   Esto la reemplaza o la absorbe; decidilo y decilo.
2. Anota las tres palancas como REGLAS en LUCIA.md y en la receta de video. Sobre todo la de
   texto: nos ahorra el defecto mas visible.
3. Escribi UN prompt completo con la arquitectura para una pieza real nuestra — producto de
   cliente o pieza de marca.

GASTO: no generes. Entrega el prompt, el modelo, la config exacta y el costo estimado.

LISTO = la plantilla CINE actualizada con los bloques con nombre (una sola plantilla, no dos),
las tres palancas anotadas como reglas, y un prompt de ejemplo escrito. Cero generaciones.
```

---

## L1 · El esqueleto de prompt UGC, regalado entero

```text
Contexto: un reel en espanol muestra como se crea un avatar UGC de cero ("Carla") y REGALA el
metodo completo en laminas. Ficha y datos:
hermes-content/references/video-intake/2026-08-21-sintesis-lote-9.md
hermes-content/references/video-intake/analisis/2026-08-21-items.json (item DcQvRrGM-wm)

EL ESQUELETO DE 6 BLOQUES, literal de la lamina:
  "El orden importa. El modelo lee de arriba abajo y da mas peso a lo primero. Este es el
   esqueleto que uso siempre, tanto en imagen como en video."

  SUJETO       "Edad, tono de piel, pelo, expresion, que esta haciendo con las manos.
                Concreto y corto."
  VESTUARIO    "Prenda, tejido, brillo, color y estampado. Si es campana, aqui va el bloqueo
                para que no cambie entre planos."
  LOCALIZACION "Que hay delante, que hay detras y a que distancia. El fondo es la mitad de la
                credibilidad."
  CAMARA       "Aqui es donde se gana o se pierde el UGC. Optica, altura, distancia y quien
                sujeta el movil."
  LUZ Y TEXTURA "Hora del dia, dureza de la sombra, altas luces quemadas, ruido en las sombras."
  NEGATIVOS    "Lo que no quieres ver. En UGC casi siempre es el propio movil, tripodes, palos
                de selfie y reflejos."

LOS 10 CHIPS QUE ACTIVAN EL MODO MOVIL, literales:
  iPhone front camera · wide angle lens · handheld, slight tremor · arm's length selfie ·
  focus hunting · blown highlights · crushed shadows · sensor noise · high dynamic range ·
  no stabilisation
  Y la lamina cierra: "Y estas las quitas siempre. Son las que te devuelven un anuncio en vez
  de un video de alguien."

PINTEREST ES TU DIRECTOR DE FOTOGRAFIA — esta es la parte que casi nadie escribe:
  "No inventes el encuadre. Buscalo. Escribe beach selfie, mirror selfie, get ready with me o
   instagram story aesthetic en Pinterest y tienes miles de fotos reales que la gente ya
   publica todos los dias.
   Lo que buscas en cada pin: donde esta el sol, como cae la sombra en la cara, a que altura
   esta el movil, que se ve de fondo, que ropa lleva puesta. Eso lo traduces a prompt
   LITERALMENTE. Cuanto mas aburrida y cotidiana sea la referencia, mejor funciona."

VERIFICADO en la cuenta el 2026-08-21 (volve a consultarlo vos, tiene fecha de vencimiento):
seedance_2_5 con duration 4-30 s, generate_audio true por defecto, y mode omni_reference con
role image_references — que es exactamente el "bloqueo de personaje" que promete la lamina.

Tarea:
1. Cruza los 6 bloques del reel con los 8 de nuestra skill sacar-prompt. Son un SUBCONJUNTO:
   no hay que cambiar de metodo. Lo que SI agregamos es (a) los 10 chips como lista fija y
   (b) Pinterest como fuente de encuadres.
2. Escribi el bloque de CAMARA de Lucia usando los chips. Es el bloque que el reel senala como
   "donde se gana o se pierde el UGC" y el que hoy tenemos mas flojo.
3. Agrega a LUCIA.md la fuente de referencias: que se busca en Pinterest y como se traduce.
   OJO: LUCIA.md ya tiene un molde de 11 bloques con 4 colas de camara. Esto se SUMA, no lo
   reemplaza. Si algo choca, gana LUCIA.md.
4. NO crees un doc nuevo al lado. Es el error mas caro del preambulo.

GASTO: no generes. Entrega los bloques escritos y el costo estimado si se fuera a probar.

LISTO = los 10 chips y la fuente Pinterest incorporados a LUCIA.md sin duplicar el molde que ya
existe, y el bloque de camara de Lucia reescrito.
```

---

## L2 · Las 9 escenas de vida cotidiana — el pilar que Lucía no produce

```text
Contexto: bluuu.ai publico "CAUGHT LIVING", 9 escenas de vida cotidiana, y declara en el caption:
  "9 AI prompts built around the moments you actually live. No sets. No studios. Just real
   scenes, relit with editorial light. Every prompt is tuned for HIGGSFIELD SOUL 2.0."
Soul es el motor que YA usamos para Lucia. Los prompts estan gateados detras de un cebo, asi
que estan RECONSTRUIDOS desde las laminas en:
hermes-content/references/video-intake/analisis/2026-08-21-items.json (item DcI9w9GEnZH)

Las escenas, del caption literal: "Caught at the desk. On the rooftop. In the mirror. At the
night market. In the lobby. At the pool's edge."

POR QUE IMPORTA: el plan de Lucia tiene 4 pilares y el de vida cotidiana es el que NO produce.
Estas 9 escenas son exactamente ese pilar, y estan pensadas para nuestro motor.

Tarea:
1. Adapta las 9 a Lucia: mismo tipo de momento, pero en SU mundo — Santa Cruz, no Nueva York.
   El mercado nocturno, el lobby y la azotea existen aca; el resto se sustituye por lo que ella
   si habitaria.
2. Escribi cada una como fragmento concatenable al prompt base de Lucia, con el bloque de camara
   usando los 10 chips del prompt L1.
3. Respeta lo fijado en LUCIA.md y NO lo rediscutas: pecas inamovibles, argollas + cadenita,
   algo terracota en cuadro, la paleta hex, el ancla que genera, y los 3 vestuarios del feed.
4. Marca cuales de las 9 NO van para Lucia y por que.

DOS REGLAS QUE SALEN DEL PROPIO CORPUS Y APLICAN ACA:
- La consistencia de cara SE DEGRADA en las tomas de escenario y aguanta en las de fondo simple.
  Cuando la escena manda mas que la referencia, la cara se pierde. Priorizar fondos simples
  donde la cara tiene que ser reconocible.
- En las laminas de bluuu.ai el TEXTO DE UN LIBRO SALE GARABATO. No poner texto legible en
  cuadro salvo que se controle.

GASTO: escribir es gratis. La tanda de prueba con la cara de Lucia necesita OK explicito de
Sergio, caso por caso.

LISTO = las 9 escenas adaptadas a Santa Cruz como fragmentos concatenables, sumadas a LUCIA.md,
con las que se descartan y el motivo. Cero generaciones.
```

---

## J6 · La biblioteca de encuadres — nueve angulos con su uso comercial

```text
Contexto: un carrusel muestra NUEVE angulos de camara sostenidos sobre la MISMA modelo, y cada
uno viene emparejado con su USO COMERCIAL. Los prompts estan detras del cebo, pero la taxonomia
esta entera en las laminas -- y la taxonomia es la mitad que casi nadie escribe.

LOS NUEVE PARES angulo -> uso, leidos de las laminas:
  low angle         -> poder / lujo    (contrapicado desde escalon inferior, lineas de
                                        arquitectura convergiendo)
  high angle        -> lifestyle       (picado 45 grados sobre mesa, sujeto mirando desde abajo)
  over-the-shoulder -> narrativa       (sujeto de espaldas 3/4, la MESA es la protagonista)
  extreme close-up  -> belleza         (media cara, poro y textura visibles)
  eye-level         -> editorial       (simetria frontal, fondo neutro)
  dutch             -> streetwear      (horizonte inclinado ~15 grados, neon mojado)
  wide              -> campana         (figura entera chica dentro de un interior grande)
  side profile      -> perfume         (perfil puro 90 grados sobre color plano saturado)
  bird's-eye        -> editorial       (cenital cerrado, la clavicula abre el encuadre)

DOS OBSERVACIONES QUE VALEN MAS QUE LA LISTA:
1. El EXTREME CLOSE-UP es la toma que DELATA al generador. Si vas a usarla, es donde mas hay que
   mirar el resultado antes de publicar.
2. La consistencia de cara SE SOSTIENE EN LAS TOMAS DE ESTUDIO Y SE DEGRADA EN LAS DE ESCENARIO.
   En las de fondo neutro la cara aguanta; en la escalera y en la calle la estructura del rostro
   y la edad aparente se corren. Regla: CUANDO LA ESCENA MANDA MAS QUE LA REFERENCIA, LA CARA SE
   PIERDE. Para Lucia, priorizar fondos simples cuando la cara tiene que ser reconocible.

METODO DEL CARRUSEL, que tambien se copia: la lamina 2 fija el CANON (retrato frontal, fondo
blanco liso, blazer negro) y recien despues vienen las variaciones. La referencia primero, las
derivadas despues.

Tarea:
1. Escribi la biblioteca de encuadres: los 9, cada uno como un FRAGMENTO DE TEXTO fijo listo para
   concatenar al prompt base de Lucia, con su caso de uso al lado. Guardala donde ya vivan las
   recetas -- candidata: junto al molde de 11 bloques que ya esta en LUCIA.md. NO crees carpeta
   nueva y NO armes un doc al lado del que manda.
2. Anota las dos observaciones de arriba como reglas, sobre todo la de escena vs referencia.
3. Marca cuales de los 9 NO convienen para Lucia y por que.

OJO, ANTES DE ESCRIBIR: el archivo que manda sobre Lucia es
hermes-content/references/modelos/lucia/LUCIA.md y su §6 ya tiene un molde de 11 bloques con 4
colas de camara (R1 Feed / R2 Copy-space / R3 UGC / R4 Beauty). Los 9 encuadres se suman a ESO,
no lo reemplazan. Si algo choca, gana LUCIA.md.

Consistencia de cara: el unico metodo verificado sigue siendo el ancla + Element. Nada de este
lote lo reemplaza.

GASTO: no generes. La biblioteca es texto y sale gratis. La tanda de prueba con la cara de Lucia
necesita OK explicito de Sergio, caso por caso.

LISTO = los 9 encuadres escritos como fragmentos concatenables con su uso comercial, sumados al
molde que ya existe en LUCIA.md, las dos reglas anotadas, y la lista de cuales no van para Lucia.
```

---

## H2 · El primer `ad_reference` — que la herramienta replique el escenario

```text
Contexto: Marketing Studio tiene ad_reference_id, que "follows the analyzed scenario of an
existing reference video (scene composition, pacing, hook, narration) instead of inventing a
structure from the prompt alone". Hoy tenemos CERO referencias creadas (la lista vuelve vacia).

Y ya hay un anuncio analizado escena por escena, con su estructura medida:
hermes-content/references/video-intake/analisis/DcMW3Coi6BN-escenas.md

Su molde, en 6 actos y 46 segundos:
  0:00-0:02  Opening Hook           -- el producto sobre fondo blanco, logos flotando
  0:02-0:12  Product Information    -- la herramienta funcionando, capturas de pantalla
  0:12-0:19  Product Selling Points -- el producto en estudio: revelado, detalles, texturas
  0:19-0:27  Real Experience        -- la persona hablando a camara, 3 beats de dialogo
  0:27-0:36  Usage Scenarios        -- SEGUNDO escenario, el producto EN USO
  0:36-0:46  Real Experience -> CTA -- la prueba social (chat con "delivered") y los logos

Tarea, en este orden:
1. Crea el ad_reference a partir de ese anuncio (show_marketing_studio con type='ad_reference').
   Crear la referencia es GRATIS. Verificá el balance antes y despues y anotá el numero.
2. Prepara la generacion de UNA pieza nuestra con ese escenario: elegi el rubro, el producto y
   el avatar. RECORDA, esta en la doc del propio parametro: avatar y producto NO se heredan de
   la referencia, van explicitos SIEMPRE (avatars / product_ids).
3. ad_reference_id es MUTUAMENTE EXCLUYENTE con hook_id y setting_id. Un camino, nunca los dos.
4. Estima el costo en creditos de esa generacion y PARA. No generes.

GASTO: generar video = permiso explicito de Sergio, caso por caso. La referencia es gratis; el
video no.

Un limite honesto que hay que verificar y no asumir: no esta probado si ad_reference acepta un
video que NO generamos nosotros, ni si hay restriccion por derechos. Averigualo antes de subir
material ajeno; si no queda claro, usá material propio.

LISTO = el ad_reference existe (la lista ya no vuelve vacia), la llamada de generacion esta
escrita con avatar y producto explicitos, el costo estimado al lado, y NO se genero nada.
```

---

## G1 · Las dos plantillas de prompt, separadas — y Marketing Studio

```text
Contexto: dos reels mostraron prompts COMPLETOS en pantalla, y son estructuras DISTINTAS que
no hay que mezclar. Fichas:
hermes-content/references/video-intake/2026-08-18-ugc-auto-receta-completa.md
hermes-content/references/video-intake/2026-08-16-carril-a-como-se-hicieron.md

PLANTILLA A -- CINE (una sola toma, sin cortes, sin dialogo):
  1. tipo de toma, una linea   2. entorno y atmosfera
  3. RECORRIDO DE CAMARA -- la mitad del prompt, paso a paso en el espacio
  4. detalles de movimiento (inercia, microcorrecciones, "speed contrast")
  5. luz y color al final

PLANTILLA B -- UGC (muchas tomas, cortes duros, el dialogo es el eje):
  1. cabecera tecnica global: formato, duracion, que camara finge ser
  2. DEFECTOS PEDIDOS A PROPOSITO: "grain, compression, wobble, autofocus hunts, no filters
     or grading" -- se le pide fealdad al modelo, que por defecto tira a pulido
  3. NEGATIVOS DEL FORMATO: "phone never in frame, reflections, or her hands"
  4. anclas de consistencia INLINE, inyectadas en el punto del texto donde importan
  5. realismo de piel con atributos concretos: "matte real skin -- pores, redness, baby
     hairs, no glare, no retouch; natural blinks, micro-expressions"
  6. beats con timestamp + referencia + DIALOGO LITERAL ENTRE COMILLAS

  VERIFICADO: el dialogo entre comillas sale palabra por palabra en el video generado. Se
  comparo el prompt con el audio del resultado y coincide literal. El guion se escribe en el
  prompt, no se corrige despues.

REGLA: si el video HABLA, es UGC. Si IMPRESIONA, es cine. Se elige antes de escribir.

Y LA TERCERA VIA, que evita escribir el prompt: marketing_studio_video.
  26 presets (ugc, ugc_direct_to_camera, ugc_selfie_testimonial, product_showcase,
  ugc_before_and_after, ugc_how_to, tv_spot, wild_card...), 12-15 s.
  hook_id = el "que" (la mecanica que frena el scroll) · setting_id = el "donde"
  avatar_ids (max 1) · product_ids
  ad_reference_id = le pasas un anuncio existente y REPLICA SU ESCENARIO (escenas, ritmo,
    gancho, narracion). Es mutuamente excluyente con hook_id/setting_id.
  OJO: avatar y producto NO se heredan de la referencia. Van explicitos SIEMPRE.

Tarea:
1. Guarda las dos plantillas como archivos separados donde ya viven las recetas de video
   (hermes-content/docs/). Si ya hay un doc de prompts de video, EDITALO.
2. Escribi un prompt de ejemplo completo con cada plantilla, para una pieza real nuestra.
3. Actualiza el catalogo de modelos: consultalo vos mismo, no copies los datos de aca.
4. Documenta cuando conviene Marketing Studio y cuando el prompt a mano.

LO QUE ESTE LOTE NO RESUELVE, y hay que decirlo: en 17 items NINGUNO resolvio consistencia de
cara generada. Las dos tecnicas que parecen resolverla usan METRAJE REAL -- no generan al
humano. Para Lucia sigue valiendo Soul+texto; nada de este lote lo reemplaza.

GASTO: no generes NADA. unlim.available = false. Entrega los prompts listos con el modelo y
el costo estimado al lado, para que Sergio apruebe.

LISTO = dos plantillas guardadas y separadas, un ejemplo de cada una, catalogo re-consultado
por vos, y la nota de que Lucia sigue con Soul+texto. Cero generaciones.
```

---

## G6 · La plantilla de foto realista — 8 bloques y la palanca de la suciedad

```text
Contexto: un carrusel regalo OCHO prompts completos de foto fotorrealista, todos con la misma
estructura. Estan transcritos literales en:
hermes-content/references/video-intake/2026-08-18-sintesis-lote-17.md (seccion 2)

La estructura, identica en las 8 laminas:
  1. apertura fija: "Ultra-realistic vertical [genero] photo of..."
  2. sujeto con una ACCION concreta, no un adjetivo
  3. rasgos fisicos enumerados (pelo, piel, maquillaje, expresion, direccion de la mirada)
  4. vestuario prenda por prenda, con material y color
  5. pose explicita, miembro por miembro
  6. fondo como LISTA DE OBJETOS
  7. bloque tecnico de camara/pelicula + una frase de referencia de genero
  8. "Negative prompt:" -- bloque casi constante: CGI, cartoon, plastic skin, beauty filter,
     over-retouched, bad anatomy, extra fingers, HDR, studio lighting, over-sharpening,
     blurry subject, text, watermark + 2-3 terminos especificos del sujeto

LA PALANCA DEL REALISMO, y es contraintuitiva: se PIDE SUCIEDAD y se PROHIBE LO PULIDO.
Los prompts piden "scratches and dirt marks", "stained plush fur", "peeling paint, rust
marks", "harsh direct camera flash", "slight film grain", "muted colors". Y el negative
ataca justo lo contrario: "beauty filter", "clean costume", "perfect background",
"studio lighting". Un modelo dejado solo tira a catalogo; hay que empujarlo a lo contrario.

Dos atajos mas, leidos de las imagenes de otros dos carruseles del mismo lote:
- seis ejes de realismo que funcionan sin tocar el prompt: imperfeccion de piel, luz dura de
  sol, encuadre de selfie torcido, contexto banal verificable, marcas reales, defectos de camara.
- el mas barato de todos: elegir caras con EDAD Y TEXTURA REAL en vez de modelos jovenes
  perfectas. La cara vieja se ve real sin pelear con el modelo.

Tarea:
1. Guarda la plantilla de 8 bloques donde ya vivan las recetas de imagen. No crees carpeta nueva.
2. PRIMERO verifica, con una consulta GRATIS al catalogo, cuales de nuestros motores de imagen
   aceptan un campo "Negative prompt" SEPARADO. Varios lo ignoran o exigen meterlo en el
   positivo, y la plantilla cambia segun eso. No asumas.
3. Escribi 3 prompts de ejemplo con la plantilla, para necesidades reales nuestras (catalogo
   de producto de un cliente, foto de ambiente para una web, imagen de campana).
4. Anota la palanca de la suciedad como REGLA, no como dato suelto.

Generacion de IMAGEN esta permitida y es barata. Aun asi: si vas a generar mas de unas pocas,
avisa el costo antes.

LISTO = plantilla guardada, campo negative verificado motor por motor, 3 ejemplos escritos, y
la regla de la suciedad anotada.
```

---

## E9 · Los cinco bloques del prompt, y por qué el 3D estilizado gana

```text
Contexto: dos videos hechos con IA analizados a fondo. Ficha con las siete preguntas
contestadas video por video:
hermes-content/references/video-intake/2026-08-16-carril-a-como-se-hicieron.md

HALLAZGO 1 — un reel mostro el prompt COMPLETO en pantalla. La estructura, en orden fijo:
  1. Tipo de toma, una linea      ("Single continuous FPV drone shot, no cuts.")
  2. Entorno y atmosfera
  3. RECORRIDO DE CAMARA — ~120 palabras, la mitad del prompt, paso a paso en el espacio:
     de donde arranca, hacia donde acelera, donde se inclina, que curva describe, donde
     termina
  4. Detalles de movimiento — la fisica: inercia, microcorrecciones, particulas, y
     "speed contrast" (sujeto en camara lenta, camara rapida)
  5. Luz y color, al final — grado, contraste, grano, aberracion
  El insumo fue UNA IMAGEN FIJA + ese texto. Una sola generacion, sin cortes.

  Lo que estamos haciendo mal: describimos la escena y le pedimos a la camara "movimiento
  cinematografico". Por eso sale generico. La camara se COREOGRAFIA.

HALLAZGO 2 — el otro reel es un sketch narrativo con dialogo, en 3D estilizado, NO
  fotorrealista. Tiene defectos de IA a la vista (una mano fundida, logos manchados) y no
  importan: en animacion se leen como estilo. En fotorrealismo se leerian como error.
  Regla: para contenido narrativo con IA, estilizado 3D antes que fotorrealista. Lo
  fotorrealista se reserva para Lucia, que es la unica cara que lo necesita.

VERIFICADO YA contra la cuenta (no lo repitas, usalo):
  - flux_3_video: 5-20 s, 1080p, audio sincronizado por defecto, acepta start/end image,
    referencias y CONTINUACION de video. Es el mejor para narrativa.
  - veo3 (variantes preview/fast), wan2_7 (2-15 s, consistencia de personaje), gemini_omni
    (4-10 s) tambien tienen audio nativo.
  - CORRECCION al corpus: el tope de 15 s era de seedance_2_0. flux_3_video llega a 20 s
    y seedance_2_5 a 30 s. Y con seedance_2_5 mode=video_extension se encadena SIN TOPE:
    devuelve solo el tramo nuevo y se pega con ffmpeg (probado, 10 s continuos).
  - unlim.available = false: HOY no hay generaciones ilimitadas. Cada generacion cuesta.
  - ⚠️ CORRECCION 2026-08-16: este prompt decia que "Seedance 2.5 NO existe en la cuenta".
    ES FALSO. Verificado con models_explore action=list el 15-ago: seedance_2_5 ESTA, con
    modos t2v / omni_reference / video_edit / video_extension y hasta 30 s. Se usaron
    video_edit y video_extension y se pagaron creditos por ellos. Lo que NO existe es el
    preset "Show Cinema". No descartes seedance_2_5: hoy es la capacidad mas util que hay.
  - video_edit re-renderiza un video real conservando movimiento y camara (cambiarle la ropa
    a la persona salio identico, y reescalo 496x864 -> 726x1266). Es el pitch de "grabalo
    con tu celular, yo lo convierto", ya probado.
  - Para b-roll vertical barato: veo3_1_lite da 720x1280 REAL a 1 cr/s (8 s = 8 cr). Ojo,
    con start_image + end_image la duracion tiene que ser exactamente 8.
  - kling3_0 IGNORA aspect_ratio y copia el 3:4 de la foto de entrada. Tarifario medido
    completo en references/modelos/lucia/prueba-lipsync-20260815/LEEME.md.
  - LECCION QUE SE QUEDA (18-ago): volve a consultar el catalogo vos mismo antes de usar
    cualquier dato de modelo de aca. Una verificacion tiene fecha de vencimiento.

Tarea:
1. Reescribi la plantilla de prompt de video que usemos hoy con los 5 bloques en orden, con
   el bloque 3 obligatoriamente largo. Si no existe plantilla, creala donde ya viven las
   recetas de video (hermes-content/docs/), no en carpeta nueva.
2. Escribi UN prompt completo de ejemplo para una pieza real nuestra, con los 5 bloques.
3. Anota la regla del 3D estilizado en la guia de contenido generativo.
4. Actualiza el catalogo de modelos con los datos verificados de arriba.

GASTO: no generes NADA. Generar video = permiso explicito de Sergio, caso por caso. Entregá
el prompt listo para que el lo apruebe, con el modelo y el costo estimado al lado.

LISTO = plantilla de 5 bloques guardada, un prompt de ejemplo escrito, la regla del 3D
anotada, y el catalogo corregido. Cero generaciones.
```

---

## E6 · Qué dispara la etiqueta de "contenido IA" — leer el código, no el reel

```text
Contexto: X abrio su algoritmo. VERIFICADO con fuente, no con el reel: el repo es
github.com/xai-org/x-algorithm, Apache 2.0, publicado el 20-ene-2026, con un directorio
visibility-filtering; y el 13-ago-2026 se le agregaron los pesos con que se combinan las
acciones predichas en el score final. Ficha con el analisis y las trampas del video:
hermes-content/references/video-intake/2026-08-16-x-algoritmo-publico.md

Lo que NO hay que hacer: creerle a la tarjeta de codigo que muestra el reel. Esta dibujada
(comentarios en espanol, no es una captura de GitHub). Los numeros que da -- retweet +1,
reporte -200, link copiado = 40 likes -- son AFIRMADOS, sin fuente.

Lo que SI importa para nosotros, y no es "como hacerse viral":
Lucia es una influencer IA DECLARADA. Si una red grande esta etiquetando y sancionando
contenido generado con IA a nivel de CUENTA ENTERA -- no del post -- eso pega de lleno en
toda nuestra produccion generativa. Y esas senales tienden a copiarse entre plataformas.

Tarea:
1. Leé visibility-filtering en el repo publico y contesta con evidencia: existe una
   etiqueta de contenido generado con IA, que la dispara, y que efecto tiene (alcance
   reducido, invisible para no-seguidores, cuenta entera o solo el post).
2. Cita archivo y linea de cada afirmacion. Si algo no esta en el codigo, deci que no esta;
   no rellenes con lo que dice el reel.
3. Contrasta con las politicas publicadas de Instagram y TikTok sobre contenido generado
   con IA y su etiquetado obligatorio.
4. Concluí en una tabla: que practica nuestra es segura, cual es riesgosa, y que cambiamos.

Regla que NO cambia: la etiqueta de IA en el contenido de Lucia se mantiene. No la sacamos
para esquivar un filtro; eso es exactamente el fraude que descartamos en otros videos.

LISTO = tabla de practicas con archivo:linea del repo como respaldo, y la lista de cambios
concretos a como publicamos.
```

---

---

## A4 · Estructura de escenas para video IA — preparar, no generar

```text
Sesion: marketing. git branch --show-current primero.
TAREA UNICA: escribir UN guion con la estructura de escenas que encontramos, SIN generar nada.
Formato (de 2026-08-11-seedance-prompt-por-escenas-timestamps.md, sale de una sola foto):
    Scene N — <nombre> (Xs-Ys)
    <encuadre y angulo> · <camara> · <que queda en foco y que sale> · <luz>
Es lo que le falta a nuestras piezas: hoy se genera plano por plano y la consistencia entre
tomas se rompe. Aca la continuidad esta escrita en el prompt.
LISTO = un guion de 15-20 s por escenas con sus rangos de tiempo, listo para aprobar.
NO HAGAS: NO generes video — eso es credito y va con OK explicito de Sergio caso por caso.
Antes de proponer generar, verifica que Seedance 2.5 este en la cuenta y a cuanto sale la
generacion (consultar el catalogo es gratis).
NO copies el contenido del ejemplo (autos de lujo): se roba el esqueleto, no el auto.
```

---

## `INFLUENCERS IA`

Sale de [Seedance: prompt por escenas con timestamps](../2026-08-11-seedance-prompt-por-escenas-timestamps.md)
(`SIRVE YA`) — el hallazgo más útil de la tanda. Complementa el
[SOUL 2.0 del 9-ago](../2026-08-09-higgsfield-soul2-seedance25.md), que decía *"no es un prompt,
es arquitectura"* pero no mostraba la estructura. Ahora está a la vista y se puede copiar.

```text
Sesión: INFLUENCERS IA. Corré `git branch --show-current` primero.
TAREA ÚNICA: portar al brief de generación de Lucía la estructura de prompt por escenas.
Formato exacto a adoptar (viene de un anuncio real de Seedance 2.5, generado desde UNA sola
foto de referencia):
    Scene N — <nombre> (Xs–Ys)
    <encuadre y ángulo> · <comportamiento de cámara> · <qué queda en foco y qué sale>
    · <calidad y dirección de la luz>
Los tres campos que faltaban (lock de vestuario, raccord de luz, timestamps) salen de acá.
LISTO = la plantilla escrita en la skill de generación + UN guion de ejemplo de 15-20 s para
Lucía, dividido en escenas con sus rangos de tiempo. Sin generar todavía.
NO HAGAS: NO generes ningún video ni imagen — eso gasta créditos y necesita OK explícito de
Sergio caso por caso. Antes de proponer generar, verificá que Seedance 2.5 esté en la cuenta
y su costo por generación (tarea V-3 de PENDIENTES.md, consultar es gratis).
NO copies el contenido del ejemplo (autos de lujo): se roba el esqueleto, no el Aston Martin.
Y NO adoptes nada de PrimeBoard (ver 2026-08-11-primeboard-autopilot-farming-redes.md): su
función es farmear cuentas con un Android, viola los ToS de Meta y TikTok, y con el token de
IG ya bloqueado (S6) es exactamente el riesgo que no conviene tocar.
```

---

---

## Y además: la entrega completa de Higgsfield

Los 12 puntos de [ENTREGA_HIGGSFIELD_LUCIA.md](../ENTREGA_HIGGSFIELD_LUCIA.md) van enteros a esta sesión. Marcan qué está verificado contra la cuenta y qué es solo afirmado por un video.

---

