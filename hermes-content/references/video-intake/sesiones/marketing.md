# Sesión marketing

> **Este archivo es la raíz de la sesión `marketing`.** Todo lo que esta sesión tiene que hacer
> de lo que salió del análisis de reels está acá, completo. No hace falta abrir otro archivo.
>
> Orden: **A1 primero (toca la caja más rápido) → E7 → D4 → C2 → A2/A3/A5/A6 · E11 queda esperando cliente real**
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

## M5 · La escalera 0→10, otra vez — ahora sobre correos de bienvenida

```text
Contexto: el MISMO molde que ya fichamos con los popups, aplicado a correos de bienvenida: se
puntuan 6 ejemplos ajenos de 0 a 10 y se dice por que. Ficha:
hermes-content/references/video-intake/analisis/2026-08-22-items.json (item DcS3tJno9ZT)

Que el molde aparezca DOS VECES en el corpus, en temas distintos, es el dato: es un formato
reusable, no un video suelto. Sirve para cualquier cosa que se pueda mostrar y puntuar —
correos, popups, landings, fichas de producto, carritos.

LA COMPOSICION: dos columnas. Captura escalada a la izquierda, video de cara a la derecha, badge
de puntaje absoluto fijo. Es HTML: sale de HyperFrames a costo cero.

EL BLOQUEO ES EL MATERIAL, no la tecnica: hacen falta 6 correos de bienvenida REALES,
ordenables de 0 a 10. Costo cero y medio dia: suscribirse con un mail limpio a 6 negocios y
esperar. NO se inventan capturas.

Tarea:
1. Junta los 6 correos reales. Preferí negocios del rubro que vendemos y de Bolivia si se puede.
2. Puntualos con criterio propio y escribi el POR QUE de cada uno en una linea. El valor del
   formato esta ahi, no en el numero.
3. Armá la plantilla de dos columnas en HyperFrames, parametrizada, para reusarla con popups,
   landings o lo que venga.
4. Cuidado con exponer marcas de terceros: se puede mostrar y criticar, pero sin inventar datos
   y sin ensanar. Si un correo es de un cliente potencial, no lo uses.

LISTO = plantilla de dos columnas reusable + 6 correos reales puntuados con su motivo escrito.
```

---

## G3 · El cliente real con la pantalla sustituida — la prueba que ningún demo consigue

```text
Contexto: un reel sustituyo un auto barato por un deportivo DENTRO del mismo plano filmado
con celular, conservando a la persona real, su ropa, sus gestos, el fondo, la luz y el
movimiento de camara. Sintesis tecnica:
hermes-content/references/video-intake/2026-08-18-sintesis-lote-17.md (tecnica T1)

Por que importa mas que cualquier otra cosa del lote: la tecnica elimina el problema mas caro
de la IA de video -- sostener una cara entre planos -- simplemente NO GENERANDO al humano. Y
eso, traducido a lo nuestro, es el antes/despues de software EN UN SOLO PLANO:

  filmamos al cliente real en su negocio real, con su realidad de HOY (el mostrador con
  papeles, el cuaderno, la planilla impresa, la pantalla vieja) y sustituimos SOLO la
  pantalla / el escritorio por el panel de ONIA corriendo.

Mismo dueno, mismo local, misma luz, mismo movimiento de camara. La comparacion es
irrefutable porque no hay nada actuado. Para venderle software a un dueno de negocio en
Bolivia, eso pega mas fuerte que cualquier demo grabada.

VERIFICADO contra la cuenta (no lo repitas, usalo):
- seedance_2_5, modo video_edit: "edit one reference video (billed by that video's duration;
  'duration' and 'aspect_ratio' are ignored)". 480p/720p/1080p, 9:16.
- El creador afirma, verbatim: "Ya no hace falta que tengamos el celular en un tripode, lo
  podemos agarrar con la mano y moverlo naturalmente y la camara entiende como se esta
  moviendo." Eso es AFIRMADO, no verificado por nosotros. Probalo antes de prometerlo.
- CUIDADO DE GASTO: video_edit se factura por la duracion del video FUENTE. Filma plantillas
  CORTAS (5-8 s) y monta despues. Un plano de 30 s cuesta 4 veces uno de 8.

Y la segunda mitad, que es montaje puro y cuesta cero: el BARRIDO SPLIT-SCREEN vertical.
Izquierda la situacion real del cliente, derecha el mismo plano con ONIA, con la misma mano
del que filma visible en las dos mitades. Sale con editor-videos / HyperFrames. Sirve igual
para web-factory: la web vieja del cliente y la nueva, en el mismo plano.
El truco de oficio en toda comparacion de un solo cuadro: la jerarquia, no el copy. El
ganador va mas grande y mas arriba; el perdedor achicado y hundido. El ojo decide antes de leer.

Tarea:
1. Escribi el guion de rodaje: que 3 planos se le piden al cliente (5-8 s cada uno), en que
   orden, y que se sustituye en cada uno. Sin jerga: el cliente filma con su celular.
2. Deja el prompt de video_edit escrito y listo para cada plano.
3. Deja la plantilla del barrido split-screen armada en HyperFrames, con un render de prueba
   hecho con material que YA tengamos.
4. Estima el costo en creditos de los 3 planos y ponelo al lado.

NO GENERES NADA. Generar video = permiso explicito de Sergio, caso por caso. Entrega el
guion, los prompts y el costo; el aprueba.

PRECONDICION HONESTA: necesita un cliente real con el sistema andando. Si hoy no lo hay,
marcalo como bloqueado por eso y NO lo simules -- fabricar un caso esta prohibido.

LISTO = guion + prompts + plantilla split-screen con render de prueba + costo estimado. Cero
generaciones pagas.
```

---

## A1 · Portafolio antes/despues — la que mas rapido toca la caja

```text
Sesion: marketing. git branch --show-current primero.
TAREA UNICA: 3 piezas verticales antes/despues de webs YA entregadas. Nada mas.
Formato (de hermes-content/references/video-intake/2026-08-09-web-antes-despues-find-real-estate.md):
  0-4 s wireframe gris de NUESTRO diseno, rotulo "Cliente: necesito una web de X"
  5-17 s scroll de la web final, mismo encuadre, rotulo "Despues:"
  Sin voz, sin cara, musica, 9:16.
POR QUE IMPORTA: el precio esta en Landing 790 / Web Pro 1.500 Bs porque no hay portafolio.
La linea premium (2.000 / 4.500) pide 3-5 casos mostrables. Las webs ya existen.
LISTO = 3 mp4 + una linea por pieza diciendo de que cliente es. SIN publicar.
NO HAGAS: no muestres la plantilla base ni digas que usamos plantillas. No uses como "antes"
la web vieja real de un cliente sin su OK — usa wireframe propio. Cero gasto de creditos:
esto es grabacion de pantalla y montaje.
```

---

## E7 · La demo de 17 segundos que vende un rubro

```text
Contexto: un competidor de comandas vende su producto entero en 17 segundos. Ficha con la
transcripcion y la evidencia de pantalla:
hermes-content/references/video-intake/2026-08-16-comandas-competidores.md

La estructura, cronometrada: promesa en el primer segundo ("Asi de simple podes organizar
todas las comandas de tu negocio") -> entra un pedido y se ve la tarjeta completa -> se
arrastra la tarjeta y cambia de estado -> el beneficio en una linea ("menos caos, pedidos
mucho mas organizados") -> CTA a la web. Nada mas. No hay logo animado, no hay musica epica,
no hay "hola que tal".

Un detalle que copiamos sin costo: las fotos del catalogo de demo son generadas con IA (hay
hamburguesas de pan azul y rosado). No hace falta sesion de fotos para que el catalogo se
vea profesional. Imagen generada = permitido y gratis; video generado NO.

Tarea:
1. Escribi el guion de 17 segundos para el modulo de comercio/gastronomia de ONIA con esa
   misma estructura, cronometrado segundo a segundo.
2. Prepará los datos de demo: catalogo con fotos generadas, un pedido de ejemplo con
   direccion boliviana real de una zona conocida, y precios en bolivianos.
3. NO inventes metricas, ni clientes, ni testimonios. La demo muestra el producto
   funcionando; no afirma resultados que no tenemos.
4. NO digas nunca al cliente que usamos plantillas.

Precondicion: hace falta que el modulo tenga las pantallas que el guion muestra. Si el
prompt E3 (en onia-plattform) todavia no corrio, el guion se escribe igual pero se marca
que pantallas faltan.

LISTO = guion cronometrado + datos de demo listos + lista explicita de las pantallas que
faltan para poder grabarlo.
```

---

# D4 · Espiar la pauta de la competencia — con lo gratis que ya tenemos

Sale de un reel que muestra **Spyglass** (`app.spyglass.so`): una herramienta paga que lista
todos los anuncios que corre una marca, con el peso de cada creativo y su clasificacion por
formato ([ficha](../2026-08-15-vision-en-el-celular-y-espionaje-de-pauta.md)).

La capacidad es real y util. Pero **la Biblioteca de Anuncios de Meta es publica y gratis, y ya
la tenemos conectada por MCP** (`ads_library_search`). Antes de evaluar nada pago, hay que
agotar lo que ya esta.

```text
Sesion: marketing. git branch --show-current primero.
TAREA UNICA: ver que anuncios estan corriendo 3 competidores, con la herramienta que YA tenemos.
Usar `ads_library_search` del MCP de Meta (gratis, publico, sin dar de alta nada).
  1. Elegir 3 competidores REALES y verificables — agencias o SaaS que le vendan al mismo
     comprador en Bolivia. Si no hay locales, tomar 3 regionales que sirvan de referencia.
  2. Por cada uno: que anuncios corre hoy, desde cuando, y que formato usa cada creativo.
  3. Clasificar los creativos por tipo (el molde que usa Spyglass: GRWM, text overlay,
     brand story, demo de producto, testimonio).
LISTO = una tabla por competidor + UNA conclusion: que formato repiten mas, y que hueco dejan
que nosotros podamos ocupar.
NO HAGAS: NO des de alta Spyglass ni ninguna herramienta paga hasta que esta pasada demuestre
que la biblioteca de Meta no alcanza. NO copies sus creativos: se mira el FORMATO y el hueco.
NO inventes competidores: si no encontras 3 verificables, decilo y trae los que si existan.
```

---

---

## C2 · Kit de venta por rubro — el pitch en el idioma del comprador

Sale de [8 industrias = 8 agentes](../2026-08-12-ocho-industrias-ocho-agentes-ia.md) y de
[5 formatos de anuncio estatico](../2026-08-12-cinco-formatos-anuncio-estatico-meta.md), las dos
`MEJORA LO ACTUAL`. Las dos aportan **molde de copy**, no capacidad: la placa *4 dolores concretos
+ 1 agente con nombre*, y el estatico `recibo` (la oferta itemizada maquetada como ticket), que sale
del generador de propuestas que ya existe. Cero creditos, cero plataformas, cero token bloqueado.

```text
Sesion: marketing / ventas. git branch --show-current primero.
TAREA UNICA: escribir el material de venta de los SEIS rubros vendibles con dos moldes ajenos
verificados, sin abrir rubros nuevos ni generar video.
  1. Una placa por rubro (dental · comercio minorista · importadora · estetica · veterinaria ·
     servicios): 4 dolores en segunda persona, escritos desde la silla del dueno y terminando en
     plata, + UN agente con nombre, de los que el modulo de agentes YA tiene.
  2. Un estatico "recibo": los paquetes del generador de propuestas maquetados como ticket de
     compra, con el pipeline propio brief -> HTML/CSS -> PNG on-brand.
  3. Un gate de copy de una linea, para todo estatico nuestro: si no nombra el dolor EXACTO del
     rubro, no sale.
LISTO = 6 placas escritas + 1 estatico recibo renderizado + el gate escrito donde vive el
sistema de carruseles. Sin publicar, para que Sergio apruebe.
NO HAGAS: NO copies una sola cifra de esos videos (482 leads, 91%, 3.7x, 5,5M vistas · $82k) —
ninguna tiene fuente y ninguna es nuestra. Con cero clientes pagando, la placa va SIN metricas.
NO inventes un agente para llenar una placa: si el rubro no tiene agente, la placa dice lo que hay.
NO copies el dolor telefonico del original ("llamada perdida"): nuestro canal es WhatsApp/Chatwoot;
vender un agente de voz es vender una capacidad que no tenemos. Reescribi cada dolor a ese canal.
NO uses los otros 3 formatos estaticos: `news headline` sin hecho real es fabricar, `text on skin`
no aplica a software, `censored ad` quema credibilidad con el comprador formal.
El copy original es rioplatense: reescribir en uso boliviano antes de que lo vea un cliente.
```

---

## A2 · Motor comentario->DM, arrancando a mano

```text
Sesion: marketing. git branch --show-current primero.
TAREA UNICA: montar UN ciclo completo de captacion por comentario, manual.
Hallazgo que lo justifica: 4 de 6 reels analizados cierran igual — "comenta X y te mando la
guia". Convierte contenido en lead con nombre, no en like. Y varios de los recursos que ellos
prometen NOSOTROS ya los tenemos escritos.
PASOS: (1) elegir UN recurso que ya exista en el repo (los 10 puntos de seguridad, el checklist
de release, el pipeline de video); (2) armar UNA pieza que lo ensene y cierre pidiendo una
palabra clave; (3) responder los DMs a mano y anotar cada lead en el CRM.
LISTO = la pieza lista para que Sergio apruebe + el recurso empaquetado para mandar + donde se
anota el lead. Medir: comentarios, DMs respondidos, leads con nombre.
NO HAGAS: no automatices el DM — necesita permisos de mensajeria de la Graph API y el token de
IG esta bloqueado (S6). Manual funciona desde hoy y no depende de nada.
OJO PLAZO: la ventana gratuita de 24 h de WhatsApp se cierra el 1-oct-2026; cualquier embudo
que termine en WhatsApp cambia de costo ese dia.
```

---

## A3 · Carruseles con el pipeline propio (y cerrar el gap de formatos)

```text
Sesion: marketing. git branch --show-current primero.
TAREA UNICA: producir 2 carruseles con el sistema que YA tenemos
(hermes-content/carousels/CAROUSEL_SYSTEM.md + scripts/carousel_render.js + skill carruseles-onia),
y de paso cerrar un gap real: los 4 packs estan fijos en 1080x1350; faltan cuadrado (1080x1080)
y story (1080x1920).
Temas con material ya escrito: los 10 errores de seguridad · que mide un panel que sirve
(LTV:CAC, ROAS, AOV) · antes/despues de una web.
LISTO = 2 carruseles renderizados on-brand + el render emitiendo los 3 formatos.
NO HAGAS: NO adoptes "Open Carrusel" ni Canva ni ninguna plataforma de terceros — el pipeline
propio es mas completo (brief -> HTML/CSS -> PNG on-brand -> publicacion) y adoptar otra es
gasto y duplicacion. Analizado y descartado en 2026-08-11-open-carrusel-claude-vs-canva.md.
```

---

## A5 · Meta Ads — dejar todo listo sin encender nada

```text
Sesion: marketing. git branch --show-current primero.
TAREA UNICA: dejar preparadas creatividades y publicos para la primera campana. SIN lanzar.
LISTO = un set de creatividades (copy + imagen, imagen es gasto cero) y la definicion de
publico escrita, todo revisable por Sergio.
NO HAGAS: NO enciendas campanas. La cuenta no tiene metodo de pago y la verificacion de negocio
esta en pausa. El motor corre en DRY a proposito — mantenerlo asi.
NO uses PrimeBoard ni ninguna herramienta de "farmear" cuentas con un Android: viola los ToS de
Meta y TikTok y con el token de IG ya bloqueado es el riesgo que no conviene tocar
(2026-08-11-primeboard-autopilot-farming-redes.md).
NO repitas cifras de terceros ("$1M en 4 meses" y similares) en ninguna creatividad: no tienen
fuente. Prueba real o no se dice.
```

---

## A6 · Los patrones reconstruidos SON contenido

Esto responde a la pregunta de Sergio: si, sirve ahora. Reconstruir un reel de UI viral es en
si mismo material publicable, y es el mas barato que tenemos — sin cara, sin voz, sin creditos.

```text
Sesion: marketing. git branch --show-current primero.
TAREA UNICA: 3 piezas verticales a partir de los patrones ya reconstruidos en
hermes-content/references/ui-patterns/ (upload-button, checkout-card, floating-cart,
dropzone-progress, chat-widget, sidebar-nav).
Formato por pieza (grabacion de pantalla, 9:16, sin voz, sin cara):
  0-3 s   el patron funcionando, en loop limpio
  3-8 s   una linea de por que esta bien hecho, con el dato concreto
  8-12 s  cierre pidiendo la palabra clave
Los datos concretos que YA tenemos y que casi nadie dice (usarlos, son el diferencial):
  - "el original usa React + framer-motion; esto es CSS puro, 0 kb de libreria"
  - "el <dialog> nativo te da Escape, foco atrapado y devolucion del foco gratis"
  - "reduced-motion con 0.01ms deja el modal abierto e INVISIBLE; va transition: none"
  - "las etiquetas apiladas hacen que el lector lea 'Upload Uploading Completed'"
LISTO = 3 mp4 listos + su copy, para que Sergio apruebe. SIN publicar.
NO HAGAS: no digas que inventamos el patron — se reconstruyo mirando el reel, y eso se dice.
Citar la fuente cuando corresponda; nunca reusar el video, la musica ni el copy del creador.
No prometas el codigo por DM si despues no lo vas a mandar.
POR QUE ESTE FUNCIONA: le habla al comprador tecnico y demuestra capacidad real en vez de
afirmarla. Es prueba, no promesa.
```

---

---

## E11 · La demo en una toma, con el cliente usándolo

```text
Contexto: un reel de hardware hace la mejor demo del corpus con cero produccion. Ficha:
hermes-content/references/video-intake/2026-08-16-descartados-y-formato.md (seccion 2)

El formato: una sola toma, camara en mano, sin cortes ni musica. Alguien pregunta fuera de
cuadro "que es esto?" y a partir de ahi es puro HACER. Nunca dice "es rapido de armar": lo
arma en camara. Y al final contesta la objecion real con el gesto -- "lo mejor es lo rapido
que se arma, pero mejor todavia, lo rapido que se desarma" -- y lo desarma.

Traduccion para nosotros: se filma en el local de un cliente. Alguien pregunta, y EL DUENO
usa el sistema: entra un pedido, mueve la tarjeta, imprime la comanda. Nada de pantalla
grabada con voz en off. La credibilidad viene de que el que lo usa no somos nosotros.

Tarea:
1. Dejá el guion de preguntas listo (3 o 4, no mas) y la lista de acciones que el dueno
   tiene que hacer en camara, en orden.
2. Anotá cual es la objecion real del rubro y con que GESTO se contesta, no con que frase.
3. Guardalo en el plan de contenido como pieza PREPARADA Y EN ESPERA.

PRECONDICION HONESTA: necesita un cliente real usando el sistema. Hoy no lo hay. Esta pieza
NO se puede simular sin fabricar un caso, y fabricar esta prohibido. Queda lista para el dia
que exista el primer cliente; no se fuerza antes.

LISTO = guion guardado y marcado como bloqueado por "primer cliente real", con la condicion
de desbloqueo escrita.
```

---

---

---

> **Agregado 2026-08-22, segunda tanda.** Sale de
> [DbT8hWPsyjN](https://www.instagram.com/reels/DbT8hWPsyjN/) ·
> [ficha](../2026-08-22-handoff-context-rot.md).
> Independiente del resto de marketing. Escribir es gratis.

## N3 · El molde de 6 actos — y el acto 2 es el más largo

```text
Sesion: marketing.

Contexto: un reel educativo de 66 s en espanol usa una estructura que NO tenemos en el banco de
moldes, y lo contraintuitivo es donde gasta el tiempo. Medido escena por escena:
hermes-content/references/video-intake/2026-08-22-handoff-context-rot.md seccion 5

EL MOLDE, con las duraciones reales:
  1. SINTOMA               0-4 s    nombra el dolor con una palabra fuerte
  2. MATAR LA SOLUCION     4-17 s   <-- EL MAS LARGO, 13 s, un cuarto del video
     FALSA                          "lo que ya haces no lo arregla, y aca esta por que"
  3. GIRO                  17-23 s  "pero tranquila" + nombra la solucion
  4. EL METODO             23-45 s  los pasos, uno por beat, con la demo corriendo en paralelo
  5. CIERRE DEL CICLO      45-61 s  que haces despues + el beneficio en tres palabras
  6. CTA                   61-66 s  comenta una palabra

POR QUE IMPORTA EL ACTO 2: los cinco moldes que ya tenemos en BANCO_DE_REPLICABLES.md abren
mostrando la solucion. Este gasta 13 segundos enterrando la alternativa que el espectador YA
usa. Sin ese acto el metodo suena a una opcion mas; con el, suena a la unica. Es la diferencia
entre "mira esta herramienta" y "lo que haces esta mal".

Tarea:
1. Agregá el molde como el SEXTO a BANCO_DE_REPLICABLES.md, con las duraciones. Editá ese
   archivo, no crees uno nuevo al lado.
2. Escribí DOS guiones con el molde, de 60-70 s, para dos publicos distintos:
   (a) Onia B2B, en el rubro que mejor conocemos. El acto 2 tiene que matar la solucion que el
       cliente boliviano YA usa — la planilla de Excel, el cuaderno, el grupo de WhatsApp — y
       matarla con respeto, explicando por que deja de servir al crecer, no burlandose de quien
       la usa. Un dueno de negocio que se siente tonto no compra.
   (b) La capa de marca personal de Sergio (contenido de IA en espanol). Ahi el molde entra
       casi tal cual, porque el tema es el mismo tipo de tema.
3. Marcá cual de los dos se produce primero y por que.

DOS REGLAS QUE NO SE NEGOCIAN, las dos del CLAUDE.md:
- NO FABRICAR: cero clientes pagando hoy, asi que ningun guion afirma resultados, testimonios
  ni cifras que no tengamos.
- LA VENTA NO EXHIBE OBRA: ningun guion nombra algo que no este vivo. Nada de "muy pronto".

Y una del corpus: el original cierra con comentario->DM. Eso YA esta documentado como hallazgo
transversal desde el 09-ago y sigue BLOQUEADO por el token de IG (S6). Manual funciona desde el
primer dia. Los guiones pueden cerrar asi, sabiendo que la respuesta se manda a mano.

LISTO = el sexto molde en BANCO_DE_REPLICABLES.md + dos guiones escritos con los seis actos
marcados y cronometrados, y cual va primero.
```

---

# Lote del 2026-08-23 — 7 prompts

> Fuente: [`PROMPTS_LOTE_2026-08-23.md`](../PROMPTS_LOTE_2026-08-23.md). Si cambia una regla,
> se edita allá, no acá.
>
> ⚠️ Antes de tocar `MOTION_PATTERN_BANK_2026.md`, leer
> [`2026-08-23-patrones-de-motion-deduplicados.md`](../2026-08-23-patrones-de-motion-deduplicados.md):
> las 18 fichas propusieron ~25 entradas y son 7 patrones reales.

## O5 · Plantilla de guion 'Hito con prueba externa' + preset de subtitulo ancla, renderizada en HyperFrames

- **Ficha:** [Prueba primero, claim despues: el molde del anuncio con validador externo](../2026-08-23-molde-anuncio-prueba-externa-astrocat.md)
- **Qué falta:** Para el estilo y la plantilla: NADA. Se hace hoy, sin credenciales, sin gasto y sin permisos. Para DISPARAR el molde falta el unico insumo que no se puede fabricar: un hito verificable declarado por un tercero con nombre. ONIA no tiene hoy ningun equivalente a un 'featured by Apple'; lo mas cercano documentado es el primer registro real que entro por Instagram el 21-ago, y esa cuenta se borro el 22. Advertencia dura: el molde entero se apoya en un documento real mostrado verbatim, asi que rellenarlo con un logro inventado no seria licencia creativa sino romper de frente la regla de 'No fabricar' y la de que la venta nunca exhibe obra. Se construye la plantilla ahora y se deja cargada esperando el hito. Segundo requisito operativo, facil de pasar por alto: el molde no exige rodaje pero SI exige un archivo de b-roll ya acumulado (proceso, escritorio, cuadernos, fotos viejas). Sin ese archivo no se puede ejecutar por rapido que llegue el hito, asi que empezar a acumularlo es tarea de hoy tambien.

```text
OBJETIVO UNICO DE LA SESION: dejar construida y RENDERIZADA una plantilla reutilizable de reel vertical llamada 'hito-con-prueba-externa', portada de un reel real que analizamos (ficha en hermes-content/references/video-intake/, fuente https://www.instagram.com/p/Daz0cVMBuD8/). No es un video para publicar: es un molde parametrizado que se dispara el dia que ONIA tenga un hito verificable.

ANTES DE CODEAR, leer en este orden: la skill .claude/skills/hyperframes/ (es la entrada obligatoria para cualquier video), despues hyperframes-core y captions-overlay. HyperFrames es el motor (Remotion esta jubilado por decision de Sergio del 21-ago). No reinventes el motor.

QUE CONSTRUIR

1) La composicion HyperFrames, 1080x1920, 30 fps, 11,2 s, 11 planos con 10 CORTES SECOS (cero transiciones, cero fades, cero whip, cero zoom). Cortes en: 1,53 / 2,33 / 3,23 / 4,10 / 5,33 / 6,30 / 7,30 / 8,00 / 9,20 / 10,23 s. Media de 1,02 s por plano. Respetalos: la cadencia casi metronomica es el patron, no un detalle.

2) El preset de subtitulo, que es la pieza mas reutilizable:
   - Sans geometrica Bold (Poppins Bold o equivalente disponible), blanco #FFFFFF con contorno negro solido de 5 px, SIN sombra difusa y SIN caja de fondo.
   - Dos lineas centradas, caja de 75% del ancho, interlineado 1.05, mayuscula de ~5% del alto del cuadro.
   - POSICION FIJA arrancando al 20% del alto, identica en los 11 planos. NO se mueve nunca. Con la imagen cortando cada segundo, este texto es la unica ancla estatica: es lo que hace legible el montaje.
   - SIN ANIMACION DE ENTRADA. Aparece y desaparece con el corte. Esto es deliberado y contradice a proposito nuestra skill motion-doctrine, que gobierna el motion graphics autoral y NO este carril. No le agregues easing 'para mejorarlo'.

3) Los 6 slots de texto parametrizados (6 bloques sobre 11 planos, ratio 1:2, el texto dura mas que el plano):
   A 0,00-1,53  {{GANCHO_DOCUMENTO}}   ej. 'Got this email this morning'
   B 1,53-2,60  {{CLAIM}}               ej. 'My Game got featured by Apple again!'
   C 2,60-4,10  {{CIFRA}}               ej. 'In 40+ different countries'
   D 4,10-8,00  {{PROCESO}}             ej. 'Me and my dad built this from scratch'  (4 planos, el bloque mas largo)
   E 8,00-9,20  {{COSTO}}               ej. 'Took a huge risk on this project'
   F 9,20-11,24 {{CIERRE_EMOCIONAL}}    ej. 'But I know she would be proud of me'

4) Los 11 slots de media, con su ROL escrito en el codigo (el rol es el activo, no el clip):
   1 persona a camara, contrapicado, con VACIO en el tercio superior para el texto
   2 {{DOCUMENTO_PRUEBA}} screenshot a sangre, legible, sin recortar el remitente ni la fecha
   3 y 4 {{ACTIVO_DEL_VALIDADOR}} arte oficial del tercero que valida
   5 producto funcionando
   6 proceso feo (escritorio real, cables, casa)
   7 artefacto de diseño a mano (cuaderno)
   8 boceto a mano, plano corto de textura
   9 producto funcionando otra vez
   10 y 11 archivo personal analogico
   Encuadre: todos los slots deben dejar cielo o espacio negativo en el tercio superior. En el reel original el UNICO error de layout aparece justo en el plano cuyo fondo no fue encuadrado para el texto.

5) Renderizar con placeholders OBVIAMENTE falsos (cartones de color con el rol escrito encima, 'SLOT 2: DOCUMENTO DE PRUEBA'). PROHIBIDO rellenar con un hito de ONIA inventado, con un logo de un tercero, o con una cifra que no exista: el molde entero se apoya en mostrar un documento real verbatim, y fabricarlo rompe la regla de 'No fabricar' del proyecto. El placeholder tiene que verse como placeholder.

6) Antes de renderizar el final, MOSTRAR A SERGIO la tabla de cortes y un preview 360p. Es regla de oro del carril de video: nunca cortar a ciegas.

7) Documentar en dos lugares, editando lo que ya existe en vez de crear docs sueltos:
   - el patron de ritmo (ancla de texto estatica + corte metronomico de 1,0 s) en web-factory/docs/MOTION_PATTERN_BANK_2026.md
   - el preset de subtitulo en .claude/skills/captions-overlay/
   Y dejar una nota en .claude/skills/motion-doctrine/ aclarando que la doctrina de continuidad de vector gobierna el motion graphics autoral y NO el montaje UGC de prueba social, donde el corte seco es correcto.

LO QUE NO HAY QUE HACER: no publicar nada, no inventar el hito, no agregar CTA (el molde original no pide nada y convierte por follow, con el arco abierto en el caption), no cambiar la cadencia 'para que respire', no agregar transiciones.

LISTO = existe un MP4 renderizado de 1080x1920 y ~11,2 s con 11 planos y 10 cortes secos verificados por deteccion de escena (ffmpeg select=gt(scene,0.3)) dentro de +/-0,1 s de los timestamps listados; el subtitulo se lee al 20% del alto sin moverse en ningun plano; los 6 slots de texto y los 11 de media estan parametrizados en la composicion; los placeholders se ven como placeholders; y el pattern bank mas la skill captions-overlay quedaron editados con el patron.
```

## O6 · Portar el molde 'plano fijo + N laminas' y el comment-to-DM a un reel de Onia

- **Ficha:** [Reel de 10 laminas sobre plano fijo, con gancho comment-to-DM](../2026-08-23-reel-10-laminas-plano-fijo-comment-to-dm.md)
- **Qué falta:** Para el video, nada bloqueante: HyperFrames esta instalado y probado y el comment-to-DM esta encendido. Falta UNA decision de Sergio: cual es el iman. Onia vende software, no plantillas para freelancers, asi que copiar 'te regalo plantillas' seria copiar el contenido en vez del molde. El equivalente honesto y ya existente sale del generador de propuestas (hermes-content/propuestas/generador/) o del catalogo de venta. Esa decision es suya, no mia.

```text
OBJETIVO DE ESTA SESION (uno solo): producir UN reel vertical de ~12 s con el molde extraido del reel IG Db9jbZtumB7, renderizado con HyperFrames, y dejarlo listo para que Sergio lo MIRE antes de publicar. No publicar nada.

CONTEXTO: la ficha completa esta en hermes-content/references/video-intake/reel-10-laminas-plano-fijo-comment-to-dm.md. Leela primero. El original NO es de IA: es b-roll casero + laminas + musica, y por eso es barato de copiar.

EL MOLDE, exacto:
1) 0:00-0:03 GANCHO POR DOLOR CITADO. Tres quejas entre comillas tipograficas, con emoji, escritas como si fueran mensajes reales de terceros. Cada una un dolor DISTINTO del dueno de negocio boliviano (ej.: se le pierden las citas, no sabe cuanto vendio, la factura la hace a mano). El bloque de texto queda INMOVIL mientras corta el b-roll debajo (3 tomas, una cada ~1,3 s).
2) 0:04-0:11 LISTA NUMERADA, ~1 s por item, CERO cortes de camara. Un solo plano fijo continuo de fondo. Cada item: titulo en MAYUSCULAS bold (numero + punto + nombre) y una bajada en italica bold de max 3 lineas. El valor esta en el VOLUMEN y en que obliga a re-ver, no en que se lea entero.
3) SIN CTA en pantalla. El CTA entero va en el caption y es comment-to-DM: pedir comentar UNA palabra a cambio del iman.

EL MECANISMO VISUAL (esto es lo que hay que respetar, no el tema):
- El fondo es UNA sola toma, camara totalmente estatica, escena a oscuras con una unica fuente de luz lateral. Es el elemento portador: NUNCA se mueve.
- Cada lamina es un rectangulo flotante centrado, ~55-60% de la altura, anclado por debajo del centro, que hace SCROLL VERTICAL INTERNO (translateY lineal, velocidad constante) mientras el titulo de arriba queda fijo. Ese scroll es todo el movimiento del video.
- Nada respira, nada oscila, nada flota. Cero idle motion. Entradas por corte o disolvencia corta, sin easing dramatico.
- Paleta: monocromo oscuro con UN solo acento calido. Base #0B0B0C, superficie de lamina #1C1C1E, texto #FFFFFF puro, acento #FF4A17. Si aparece un logo de tercero, que sea el UNICO color saturado del video.
- Tipografia: 2 niveles y basta. Grotesca geometrica bold MAYUSCULAS para titulo, la misma familia en italica bold para la bajada. Sin cajas ni divisores.
- Textura: grano y vineteado REALES por luz baja, no filtro.

QUE HACER, en orden:
1. Leer la ficha y cargar la skill hyperframes (es la puerta de entrada de video) + motion-doctrine antes de escribir una linea de composicion.
2. PREGUNTAR A SERGIO cual es el iman antes de escribir el caption. Onia vende software, no plantillas de freelancer: copiar 'te regalo plantillas' seria copiar el contenido, no el molde. Candidatos honestos y ya existentes: algo que salga de hermes-content/propuestas/generador/ o del catalogo de venta. NO inventar un iman ni prometer nada que no exista.
3. Escribir el guion: 3 quejas + N items numerados (N entre 7 y 10, todos REALES y vivos en produccion; prohibido nombrar lo que no esta encendido — regla 'la venta nunca exhibe obra').
4. Componer en HyperFrames: video de fondo fijo + una sub-composicion por lamina con su data-* de timing y su translateY lineal.
5. Renderizar y MOSTRAR el preview a Sergio. No publicar. Construir y publicar son dos permisos distintos.

NO HACER:
- No usar 'muy pronto', 'beta', 'proximamente' ni ningun estado de obra en pantalla.
- No inventar cifras, testimonios ni logos de clientes: hay cero clientes pagando.
- No publicar ni programar el post.

APARTE, sin desviar esta sesion: anotar como pendiente para el carril onia-core que los 10 documentos del original son los estados del ciclo de vida de un cliente (acuerdo -> onboarding -> factura -> alcance -> entrega -> reporte -> cobro -> cierre -> feedback -> re-venta) y que vale contrastarlos contra las entidades y capabilities del core. Anotarlo, NO perseguirlo aca.

LISTO = existe un MP4 vertical de ~12 s renderizado con HyperFrames, con un plano fijo sin cortes durante la lista, N laminas con scroll interno lineal, dos niveles tipograficos y un solo acento de color; el caption con el comment-to-DM esta escrito y su iman fue elegido por Sergio; y Sergio VIO el preview renderizado y dio el OK sobre esa pieza. Nada publicado.
```

## O7 · Meme de dos cartas — setup vivo / remate congelado

- **Ficha:** [Meme de dos cartas: setup vivo, remate congelado](../2026-08-23-meme-dos-cartas-setup-vivo-remate-congelado.md)
- **Qué falta:** (1) El plano A propio: no tenemos metraje de 'sala llena de gente laburando de noche' — hay que grabarlo (30 s de teléfono alcanzan) o cambiar el motor interno por otro que sí tengamos. (2) El ángulo, que es lo delicado: el motor del chiste es la auto-burla sobre la propia competencia, y apuntado a Onia rompe de frente 'la venta nunca exhibe obra'. Sólo es portable si el dolor es el DEL CLIENTE ('yo no sé nada de sistemas' → remate: el negocio funcionando), nunca nuestra entrega. (3) La música: no está en el video (0 palabras) y no se puede identificar — hay que elegir una de la biblioteca de Instagram, y la carta B congelada sin música es un cuadro muerto de 2,8 s.

```text
Armá un reel vertical de 6,6 s (720x1280, 30 fps) con la mecánica de dos cartas medida en el reel DcPwVniOEKB.

CARTA A — 0,000 a 3,800 s (114 fotogramas). Plano fijo, metraje VIVO: gente moviéndose dentro del cuadro, cámara sin reencuadre y sin push-in. Encima, texto quemado de 3 líneas centradas en el tercio superior (bloque del 23% al 37% de la altura), caja al 84% del ancho del cuadro, grotesca pesada casi condensada, blanco puro con contorno negro fino y sombra suave. El texto NO se anima: entra en el fotograma 0 y no se mueve más — cero fade, cero escala, cero typewriter. Contenido: la objeción del CLIENTE, en primera persona y entre comillas tipográficas.

CORTE DURO en 3,800 s. Sin cortinilla, sin fade, sin whip, sin cross-dissolve.

CARTA B — 3,800 a 6,600 s (84 fotogramas). Una imagen FIJA, congelada, cero movimiento. Tiene que INVERTIR la temperatura de color de la carta A (si A es cálida/magenta, B es fría/azul): esa inversión es el remate, no un adorno. Texto de 2 líneas, mismo tratamiento, pero ~1,5x más grande que el de la carta A. Contenido: el remate.

Reglas duras:
- Cero animación de texto en las dos cartas.
- Cero movimiento de cámara dentro de cada carta.
- Un solo corte en todo el video.
- Cama musical continua y fuerte de punta a punta, sin voz.
- El chiste apunta al dolor DEL CLIENTE, nunca a la entrega de Onia (regla "la venta nunca exhibe obra"). Prohibido cualquier gag que insinúe que no sabemos aterrizar lo que construimos.
- Antes de publicar, revisar los hashtags letra por letra: el original perdió alcance con un `#develeporlife` mal escrito.

LISTO = `ffprobe` reporta 198±3 fotogramas a 30 fps; `ffmpeg -i out.mp4 -vf "select='gt(scene,0.08)',metadata=print:file=-" -f null -` devuelve EXACTAMENTE 1 corte y su pts_time cae entre 3,6 y 4,0 s; y el PSNR entre el primer y el último fotograma de la carta B es >= 38 dB (prueba medida de que el remate está congelado, no sólo quieto).
```

## O8 · Molde de 6 movimientos: gancho falso -> prueba cruda -> metodologia -> comentario

- **Ficha:** Seedance 2.5 al estilo Batman: el gancho falso, la prueba cruda y el CTA que crece 3x
- **Qué falta:** 1) Seedance 2.5 NO esta en nuestro stack: no lo tenemos ni lo probamos, y no se si aguanta consistencia de estilo animado entre planos. Hay que medir el analogo (Higgsfield/kling) antes de prometer nada; gasto = permiso explicito. 2) El preset de textura 'pantalla filmada' (halftone + viñeta + franja cromatica) no existe en editor-videos: es la pieza que mas unifica y la mas barata de agregar. 3) La config de karaoke actual no contempla grupos de 1-4 palabras con '...', ni el salto de escala del CTA, ni la regla de apagado cuando el grafico ya dice la palabra: tres parametros nuevos en captions-overlay. 4) El prompt de Seedance no esta en ningun lado del post; si queremos el estilo animado hay que RECONSTRUIRLO con la skill sacar-prompt y decir que es reconstruido.

```text
Escribi y produci un reel vertical de 60-75 s para ONIA usando este molde, recuperado literal del reel https://www.instagram.com/p/DcYiAvqsjij/ (70,8 s medidos, 234 palabras, ~198 ppm, ~95% del tiempo con voz).

GUION — seis movimientos, en este orden y con estas duraciones:
1) 0-4 s GANCHO FALSO: una afirmacion grande con marca conocida y numero concreto. Formato: 'Acaban de <verbo fuerte> a <numero> <rol> de <marca grande> por esta herramienta'.
2) 4-11 s RETRACTACION INMEDIATA + REENCUADRE: desmentite vos mismo en la frase siguiente ('bueno, realmente no lo se, pero...') y bajalo al espectador ('personas normales y corrientes como tu y como yo'). La retractacion compra la credibilidad que el gancho gasto. NO se saltea.
3) 11-16 s PRUEBA CRUDA: 5 s del entregable corriendo SOLO, con su propio audio, SIN voz en off encima. Si tiene remate, dejale 1-1,5 s de silencio antes.
4) 17-30 s ATRIBUCION + COSTO: que era, con que se hizo, cuanto tardo. Mostra un recibo visual (lamina/collage tipo scrapbook, presentada como captura de la app Fotos, no como grafico pulido).
5) 30-48 s MANEJO DE OBJECION (el corazon): poné la objecion en boca del espectador ('pero esto es todo gracias a la herramienta'), respondé que no, y resolvela con una analogia fisica (la de la camara: cualquiera puede tener la mejor camara del mundo). Cerra con la tesis: la diferencia NO es la herramienta, es la metodologia. Respaldalo con archivo B/N de oficio real.
6) 48-70 s AUTORIDAD -> CTA: quien lo hizo y con que cargo, prueba en pantalla, y cierre 'ponme la palabra <PALABRA> en los comentarios y te envio <entregable> gratis'.

PRODUCCION — reglas duras:
- Tres registros de imagen alternados y NINGUNA transicion: talking head camara en mano que nunca se detiene / b-roll a pantalla completa / clip generado SIEMPRE inserto, chico, letterboxed sobre campo oscuro (nunca a pantalla completa: esconde artefactos y da lectura de archivo).
- Textura obligatoria sobre TODO lo prestado o generado: halftone + viñeta + leve franja cromatica. Es lo que unifica material de origenes distintos.
- Karaoke quemado: una sola familia grotesca pesada, grupos de 1 a 4 palabras (NO palabra suelta), puntuacion conservada, sufijo '...' cuando el grupo no termino, cuerpo constante, ANCLAJE FIJO a ~52% del alto en los tres registros, color invertido segun fondo. Si un grafico en pantalla ya dice la palabra, apaga el subtitulo.
- Unico quiebre tipografico permitido: la palabra del CTA a ~3x el cuerpo, entre comillas tipograficas. Es el ultimo beat.
- Sin dead air: apuntar a >=90% del tiempo con voz. Un solo silencio, y que sea narrativo.
- Prohibido exhibir obra: nada de 'muy pronto', 'beta' ni 'en construccion'.
- Antes de cortar: tabla de cortes + preview 360p a Sergio. Nada de cortar a ciegas.
- Nada de gasto en generacion paga sin permiso explicito caso por caso.

LISTO = existe un MP4 vertical de 60-75 s renderizado con HyperFrames/editor-videos que cumple, verificado MIRANDO el render (no por grep ni por exit code): (1) los seis movimientos ocurren en las ventanas de tiempo indicadas, comprobado contra su propia transcripcion con timestamps; (2) el subtitulo aparece al mismo anclaje vertical (+/-3% del alto) en al menos un fotograma de cada uno de los tres registros; (3) la palabra del CTA mide >=2,5x el cuerpo del subtitulo normal, medido en pixeles sobre el ultimo fotograma; (4) la transcripcion del render cubre >=90% de la duracion total con voz; y (5) la tabla de cortes + el preview 360p fueron mostrados a Sergio y tienen su OK explicito sobre ESA pieza.
```

## O9 · Carrusel Onia de 4 laminas con el molde gancho-ecuacion-comenta

- **Ficha:** [Carrusel de playa: el molde gancho-ecuacion-comenta CLASE](../2026-08-23-carrusel-playa-ecuacion-comenta-clase.md)
- **Qué falta:** Nada tecnico bloqueante. Faltan tres DECISIONES de contenido, no credenciales: (a) cual es el lead magnet real — que 'clase 1' mandamos por DM, hoy no existe; (b) que cifras usamos — Onia tiene 0 clientes pagando, asi que la ecuacion $200 = $10,000 NO se puede copiar: seria fabricar, y ademas 'la venta nunca exhibe obra' y '0 Humanos' contradice nuestro propio posicionamiento de agentes human-in-the-loop; (c) las capturas de onia-platform hay que restilarlas ANTES de fotografiarlas (ya decidido en la memoria landing-v3-aprobada). Postiz sigue sin credenciales de proveedor cargadas — NO VERIFICADO si publica carrusel hoy.

```text
Arma un carrusel de Instagram de 4 laminas para Onia portando el MOLDE de este referente (ficha en hermes-content/references/video-intake/, item Db1b33RAh_H). Portas la ESTRUCTURA y el DISENO, no el contenido ni las cifras.

MOLDE DE GUION, una idea por lamina, cero relleno:
1. GANCHO ABSURDO visual. Un contexto donde 'no se deberia poder trabajar' + la herramienta funcionando igual. Texto minusculas, coloquial, dos bloques: setup arriba-izquierda, remate abajo-derecha.
2. ESCALADA + DATO CURIOSO. Sube el absurdo y mete un dato real que la gente no sabe. Una cifra gigante manda la lamina.
3. LA PRUEBA, en layout de ECUACION horizontal: [etiqueta chica] cifra + [etiqueta chica] cifra = [etiqueta chica] resultado, y abajo a la derecha el remate del beneficio.
4. CTA COMENTARIO. 'Comenta <PALABRA>' gigante + que recibe la persona + lista de 4 bullets con flecha -> y divisoria de 1px entre items, en MAYUSCULAS.

DISENO, obligatorio:
- Vertical 3:4 (1080x1440). Foto de telefono real, grano natural, SIN filtro de agencia.
- Una sola grotesca neutra, dos pesos: Light para el contexto, Black para el gancho. Escala del gancho 4-6x el cuerpo. Interlineado ~0.9em en los bloques grandes.
- Texto 100% BLANCO, sin caja, sin sombra dura. El color lo pone la foto, nunca la tipografia.
- WRAP alrededor del sujeto: el sujeto al centro-bajo, el texto en las esquinas libres, apoyado en zonas desenfocadas. El texto NUNCA pisa cara ni pantalla.
- Alineacion segun el borde: bloque izquierdo alineado a izquierda, bloque derecho a derecha.

PROHIBICIONES DURAS de este encargo (nacen de reglas del repo, no las negocies):
- PROHIBIDO copiar la ecuacion '$200 + 0 Humanos = ~$10,000' ni inventar ninguna cifra de ahorro: Onia tiene 0 clientes pagando y no tenemos un caso medido. Si no hay numero verificable, la lamina 3 usa una prueba NO numerica (una capacidad concreta que si esta viva en produccion).
- PROHIBIDO decir '0 humanos' o equivalente: nuestros agentes son human-in-the-loop y venderlos como reemplazo total es fabricar.
- PROHIBIDO cualquier senal de obra: 'muy pronto', 'beta', 'proximamente'. Solo se nombra lo que esta ENCENDIDO en produccion.
- Las pantallas de laptop van con CAPTURAS REALES de onia-platform (restiladas antes), no con dashboards generados por IA.

CIRCUITO DE CONVERSION: cablea el 'Comenta <PALABRA>' contra el circuito comentario IG -> DM que ya esta vivo en produccion (memoria ig-comentario-dm-vivo, probado 18-ago). Antes de publicar, verificalo MIRANDO: comentario de prueba en la cuenta, y captura del DM que llega.

ANTES de publicar: mostrale las 4 laminas renderizadas a Sergio y espera OK explicito sobre ESAS piezas. Construir y publicar son dos permisos distintos.

LISTO = las 4 laminas renderizadas en 1080x1440 existen en disco, cero cifras sin fuente verificable en ellas, cero palabras de estado de obra (verificado con grep sobre el HTML fuente), el circuito comentario->DM devolvio un DM en una prueba real con captura, y Sergio dio OK explicito sobre las laminas renderizadas.
```

## O10 · Carrusel Onia de 15 laminas: molde BuilderCult portado al pack por rubro

- **Ficha:** [El carrusel de 15 láminas: molde de autoridad con CTA de comentario (BuilderCult)](../2026-08-23-carrusel-15-laminas-repos-nichados-buildercult.md)
- **Qué falta:** Poco y nada bloqueante para producir. (a) Elegir el rubro del primer carrusel: decision de Sergio, no tecnica. (b) Credenciales de proveedor en Postiz si se publica desde ahi (dato heredado de memoria, RE-VERIFICAR en vivo antes de ejecutar); si no, se publica por el canal IG ya cableado. (c) Reemplazar la lamina 2: no tenemos case study con cifras y esta prohibido fabricarlo, va demo del producto vivo en su lugar.

```text
Construi un carrusel de Instagram de 15 laminas para Onia, portando el molde estructural y visual del carrusel de BuilderCult analizado en hermes-content/references/video-intake/ (id DcBWzXQF1_q). NO copies el contenido: copia la ARQUITECTURA y el SISTEMA VISUAL.

TEMA: por que un negocio de <RUBRO> (arranca por dental, que es el unico rubro con producto vivo y verificado en produccion) no necesita un software a medida sino un sistema que ya resuelve su rubro.

ARQUITECTURA OBLIGATORIA (15 laminas, roles fijos):
1. Portada: cifra o promesa concreta enorme + imagen que detenga el scroll. Sin parrafo explicativo.
2. Prueba: PROHIBIDO inventar cifras de facturacion o testimonios (cero clientes pagando). En su lugar va una CAPTURA REAL del producto vivo en produccion resolviendo un trabajo del rubro.
3. Reencuadre de la creencia del lector.
4. Anti-patron: que NO hacer (filtra al lector equivocado).
5-9. CINCO laminas con TITULAR IDENTICO y FONDO IDENTICO. Solo cambian el kicker numerado y la tarjeta de contenido. Es lo guardable del post.
10. El giro: lo que todos se pierden.
11. Playbook numerado 1-8, verbos en imperativo, una linea cada uno.
12. La herramienta: Onia. UNA sola lamina de producto, con captura de UI real.
13-14. Como se pone en marcha, 6 puntos con subtitulo bold + parrafo.
15. CTA de palabra clave unica. Repetila en la PRIMERA linea del caption, porque en el feed se ve junto a la portada.

SISTEMA VISUAL (portar exacto):
- Formato 4:5 vertical. Tarjeta blanca (#FCFCFB) flotante al ~92% del ancho, radio ~48px, margenes de fondo visibles por los 4 lados, sombra minima o nula.
- Firma de marca ONIA centrada al tope, IDENTICA en las 14 laminas interiores.
- Titular encajonado entre DOS reglas horizontales finas; tercera regla al pie espejando la de arriba. Este tic se repite en las 15.
- Titular en grotesque geometrica extendida, peso MEDIUM (no bold), tamano enorme, interlineado ~0.9.
- Enfasis = cambio de COLOR + peso a la vez (color de marca regular -> negro bold). Cero subrayado, cero cajas de resaltado, CERO emoji.
- Fondo degradado CON GRANO, y cambia POR BLOQUE TEMATICO, nunca por lamina. Las 5 de la lista comparten fondo. Las 3 finales comparten fondo. El grano es obligatorio: sin el, se ve plantilla de Canva.
- Maximo 6-9 bloques de texto por lamina, parrafos separados por linea en blanco completa.
- Bullets con vineta redonda e indent marcado.

REGLAS DE ONIA QUE MANDAN SOBRE EL MOLDE:
- Precios: se LEEN de onia-platform/lib/subscription-plans.ts (planes) y onia-platform/lib/pricing.ts (add-ons). No inventes ni un numero.
- Que se vende: se lee de hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md. Solo lo VIVO.
- PROHIBIDO exhibir obra: nada de 'muy pronto', 'beta', 'en construccion', 'proximamente'. Lo que no esta listo no se nombra.
- PROHIBIDO fabricar: cero testimonios, cero logos de clientes, cero cifras de facturacion.
- Los nombres DentalGest / GestiOS / Ganadero OS / ProveeGest NO son productos. Al cliente se le nombra el rubro ('modulo dental').

EJECUCION: escribi las 15 laminas como composicion HyperFrames (HTML), renderizalas a PNG 4:5, y ABRI las 15 imagenes para MIRARLAS. Un exit code 0 no es verificacion. Mostrale a Sergio la tira completa ANTES de publicar nada: construir y publicar son dos permisos distintos.

LISTO = 15 archivos PNG en 4:5 renderizados y ABIERTOS Y MIRADOS uno por uno, verificando en cada uno que (a) el titular esta entre dos reglas, (b) las laminas 5 a 9 comparten titular y fondo, (c) el fondo tiene grano visible, (d) no aparece ninguna palabra de estado de obra ni cifra de facturacion inventada, y (e) todo precio que aparezca coincide con el archivo fuente que le corresponde. La tira completa mostrada a Sergio, sin publicar.
```

## O11 · Carrusel "lo que cuesta operar" — molde de anclaje de precio con ficha de catalogo

- **Ficha:** [Carrusel de gastos: anclaje de precio con ficha de catálogo estilo Apple](../2026-08-23-carrusel-gastos-anclaje-precio-ficha-catalogo.md)
- **Qué falta:** Tres cosas. (a) Los packshots recortados de cada item — si se generan con Higgsfield es gasto pago y necesita permiso explicito caso por caso. (b) La decision de que numeros de Onia entran, y esos se LEEN de onia-platform/lib/subscription-plans.ts (DEFAULT_PLAN_AMOUNTS) para planes y de onia-platform/lib/pricing.ts para add-ons — nunca se escriben a mano. (c) Nada mas: el molde y el motor de render ya existen.

```text
Construi un carrusel de 9 laminas para Instagram (1080x1350, 4:5) portando el molde de anclaje de precio documentado en hermes-content/references/video-intake/ (ficha: carrusel-gastos-anclaje-precio-ficha-catalogo).

EL MOLDE, sin desviarse:
- Lamina 1: gancho tipografico SIN imagen. Una frase entre comillas curvas en Black gigante, y debajo en gris un pie de nota con asterisco que reencuadra la frase y termina en flecha (ese asterisco hace dos trabajos: el chiste y la instruccion de swipe). Ej.: "Todo esto lo paga mi negocio" / *todo esto ->
- Laminas 2-8: SIETE fichas de estructura IDENTICA, cuatro campos y nada mas:
  1. objeto recortado sin fondo, flotando centrado en el tercio superior-medio, con sombra de contacto eliptica muy difusa debajo
  2. nombre propio, Bold/Black ~115px, tracking -0.02em, color #101010
  3. descripcion de 2-3 lineas en #8C8C8C ~46px, centrada, saltos de linea BALANCEADOS a mano. Dice que TRABAJO hace, nunca que categoria es
  4. precio, mismo peso y tamano que el nombre, SOLO en su renglon con aire arriba y abajo
- Lamina 9: ROMPE la plantilla. Titular arriba-izquierda a bandera con jerarquia invertida (nombre grande + promesa en bold mas chica pegada debajo, sin gris), figura o objeto grande abajo. Es la unica lamina con marca personal. Sin "comenta X", sin "guarda esto".

LA MECANICA (lo que hace que venda):
El orden de precios NO es ascendente. Abri con los dos items mas BARATOS que son los que hacen el trabajo, metele dos techos brutales intercalados en el medio, y cerra con gastos cotidianos. El lector fabrica solo la conclusion — el post NUNCA la enuncia. Ese es el punto entero: el argumento se entrega como aritmetica, no como afirmacion, y por eso no se discute.

ESTILO (identico en las 9):
- Fondo #F3F2F0 plano, sin gradiente ni textura ni grano, IGUAL en todas
- Una sola familia grotesca neo-suiza. Solo DOS roles: nombre+precio en Black, descripcion en gris. No inventes un tercer nivel
- Cero color propio: el unico color lo aporta cada objeto
- Los iconos de app van como squircle 3D con relieve, NO planos (es lo que los iguala visualmente a un packshot fotografiado)
- Sin cajas, sin lineas divisorias, sin numeracion, sin watermark en las fichas

REGLAS DURAS DE ESTE REPO:
- Los precios de Onia se LEEN, no se escriben a mano: planes en onia-platform/lib/subscription-plans.ts (DEFAULT_PLAN_AMOUNTS), add-ons en onia-platform/lib/pricing.ts. Si un numero no esta ahi, no va en la lamina
- PROHIBIDO cualquier estado de obra: nada de "muy pronto", "beta", "proximamente". Solo se nombra lo que esta vivo
- Prohibido fabricar: cero testimonios, cero logos de clientes, cero cifras inventadas
- Generacion paga (Higgsfield, ElevenLabs) requiere permiso explicito de Sergio caso por caso. Por defecto usa assets que ya tengamos o recortes gratuitos
- Antes de aplicar, MOSTRALE a Sergio las 9 laminas renderizadas. No publiques nada

COMO SE RENDERIZA:
Una sola composicion HyperFrames (skills hyperframes-core + slideshow): las 7 fichas son UN template HTML alimentado por un array de datos, no 7 disenos. Guarda la plantilla reutilizable en hermes-content/references/ui-patterns/ficha-producto-catalogo/.

LISTO = los 9 PNG de 1080x1350 existen en disco renderizados por HyperFrames, la plantilla quedo guardada en hermes-content/references/ui-patterns/ficha-producto-catalogo/, y cada cifra de Onia que aparece en las laminas coincide caracter por caracter con su valor en subscription-plans.ts o pricing.ts (verificado con grep del numero contra el archivo fuente).
```
