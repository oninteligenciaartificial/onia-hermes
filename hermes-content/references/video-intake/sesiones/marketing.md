# Sesión marketing (Arthur)

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

## A1 · Portafolio antes/despues — la que mas rapido toca la caja

```text
Sesion: marketing (Arthur). git branch --show-current primero.
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
Sesion: marketing (Arthur) / ventas. git branch --show-current primero.
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
Sesion: marketing (Arthur). git branch --show-current primero.
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
Sesion: marketing (Arthur). git branch --show-current primero.
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
Sesion: marketing (Arthur). git branch --show-current primero.
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
Sesion: marketing (Arthur). git branch --show-current primero.
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

