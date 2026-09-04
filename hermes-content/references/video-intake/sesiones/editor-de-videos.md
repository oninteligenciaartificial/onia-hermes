# Sesión `editor de videos`

> **Este archivo es la raíz de la sesión `editor de videos`.** Todo lo que esta sesión tiene que hacer
> de lo que salió del análisis de reels está acá, completo. No hace falta abrir otro archivo.
>
> Orden: **cualquiera de los dos nuevos primero; ambos cuestan cero créditos**
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

## M2 · Editar metraje real por prompt — y dónde se esconde el corte

```text
Contexto: un reel muestra edicion VIDEO-A-VIDEO sobre metraje propio: la misma toma de espejo
con celular, y por prompt le cambian la ropa, decoran el cuarto, y despues reemplazan el
escenario entero por una tribuna de estadio. Ficha:
hermes-content/references/video-intake/analisis/2026-08-22-items.json (item DZGa5cbJT3n)

LA PRUEBA DE QUE ES EDICION Y NO GENERACION NUEVA, y es lo que hay que saber mirar: entre
variantes, el mobiliario secundario NO SE MUEVE (el aparador, la lampara, la mesita, la alfombra
son identicos) y SE CONSERVA EL TEMBLOR DE LA MANO. Si fuera generacion nueva, todo eso cambiaria.

EL OFICIO, y es lo que se copia: EL CORTE ENTRE GENERACIONES SE ESCONDE EN UN WHIP PAN. Hay un
barrido de camara borroso justo donde cambia el material. No hay disolvencias, no hay cortes
secos visibles. Es la costura, y esta tapada con movimiento.

VERIFICADO HOY 2026-08-22 contra el catalogo: seedance_2_5 tiene mode `video_edit`, 4-30 s,
480p/720p/1080p. Y AVISA que en video_edit SE FACTURA POR LA DURACION DEL VIDEO FUENTE, y que
duration y aspect_ratio se ignoran. Alternativas con rol video_references hoy: gemini_omni
(4-10 s, supports_unlim), wan2_6 (5/10/15 s), seedance_2_0 y _mini (supports_unlim).
NO hay Runway Aleph en el catalogo.

CONSECUENCIA DE COSTO, y es la regla operativa: se filma CORTO. Un plano de 30 s cuesta cuatro
veces uno de 8. Se graban tomas de 5-8 s y se montan despues.

Tarea:
1. Escribi el procedimiento: que se filma (una toma fija, celular, 5-8 s), que se pide cambiar,
   y como se encadenan las variantes.
2. Deja la plantilla de montaje con el WHIP PAN como transicion entre variantes. Ese es el
   entregable tecnico: sin eso, se ven las costuras.
3. Probalo con material que YA tengamos, aunque las variantes queden como placeholder.
4. NO reinventes el motor: revisá .claude/skills/ (editor-videos, talking-head-recut,
   embedded-captions, media-use).

Esto se cruza con el prompt G3 (el cliente real con la pantalla sustituida), que usa el MISMO
modo video_edit. Si G3 ya corrio, esto lo extiende; si no, este procedimiento le sirve.

GASTO: video_edit gasta y se factura por el fuente. Entrega el procedimiento y el costo
estimado por plano; no generes.

LISTO = el procedimiento escrito, la plantilla de montaje con whip pan probada con material
propio, y el costo por plano calculado.
```

---

## M3 · El carrusel que vende — molde A/B

```text
Contexto: un carrusel en espanol ataca justo nuestro error: "la mayoria de los carruseles no
consiguen ventas porque los hacen 100% para informar, no para convertir. Si tu contenido parece
un folleto corporativo aburrido, la gente hace scroll en 0.1 segundos."
Ficha: hermes-content/references/video-intake/analisis/2026-08-22-items.json (item DcNIJtpltiI)

EL MOLDE: 7 laminas. Cinco de ellas son PARES A/B — "ABURRE vs VENDE" — con LA MISMA FOTO de los
dos lados y solo cambia la palabra. Un nicho por lamina.

Tarea:
1. Armalo como plantilla de HyperFrames: 7 laminas 1080x1350, las 5 gemelas generadas desde un
   ARRAY de datos, no maquetadas a mano. Es el uso mas barato del motor: cero creditos, cero
   render de video.
2. Escribi los 5 pares para NUESTROS rubros, con las skills copywriting y marketing-psychology.
3. EL BLOQUEO REAL NO ES TECNICO: es no fabricar. El original usa un caso ficticio. Nosotros no
   inventamos clientes ni resultados. Los 5 pares tienen que apoyarse en algo que sea cierto:
   una capacidad real del producto, un dolor real del rubro, o nada.

LISTO = plantilla parametrizada por array + los 5 pares escritos sobre hechos, no sobre casos
inventados.
```

---

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

## H3 · El molde de anuncio en 6 actos, medido

```text
Contexto: el analisis escena por escena de un anuncio real dio, gratis, una taxonomia de funcion
narrativa que no teniamos. Los labels que devuelve la herramienta:
  Opening Hook · Product Information · Product Selling Points · Real Experience ·
  Usage Scenarios · Call to Action
Ordenados, son el molde completo de una pieza de 46 s. Tiempos medidos en
hermes-content/references/video-intake/analisis/DcMW3Coi6BN-escenas.md

Lo contraintuitivo del reparto, y es lo que hay que respetar:
- el gancho dura DOS segundos
- el producto "bonito" en estudio se lleva 7 s
- la persona hablando a camara se lleva 8 s y trae TRES frases, no un monologo
- hay un SEGUNDO escenario (9 s) que muestra el producto EN USO, distinto del primero
- la prueba social va casi al final, no al principio
- el CTA son 2 segundos y son tres logos

Tarea:
1. Convertilo en plantilla de HyperFrames parametrizable: 6 tramos con su duracion objetivo y
   que va en cada uno. Que se pueda cambiar el reparto de segundos sin rehacer nada.
2. Los tramos que NO necesitan generacion (Opening Hook con el producto sobre fondo blanco,
   Product Information con capturas de pantalla, el CTA de logos) se arman con HyperFrames a
   costo cero. Dejalos resueltos.
3. Render de prueba con material que YA tengamos, aunque los tramos de video queden como
   placeholder. La idea es ver el RITMO.
4. NO reinventes el motor: revisá .claude/skills/ (talking-head-recut, embedded-captions,
   captions-overlay, media-use) y usá lo que existe.

Dos gates que no se saltean:
- La REGLA DE ORO: tabla de cortes + preview 360p a Sergio ANTES de aplicar cualquier corte.
- El gate de ortografia en subtitulos quemados: el SRT se revisa a ojo antes de quemarlo, con
  foco en enyes y acentos. En el corpus hubo un reel con DOS faltas quemadas en 10 fotogramas.

LISTO = plantilla de 6 tramos parametrizable, con los tramos de costo cero ya resueltos y un
render de prueba que deje ver el ritmo.
```

---

## G2 · El molde de anuncio UGC para un rubro nuestro

```text
Contexto: la receta completa del anuncio UGC esta en
hermes-content/references/video-intake/2026-08-18-ugc-auto-receta-completa.md
El arco del reel de origen: publicacion muerta ("Listed 30+ days ago, 2 views") -> anuncio UGC
generado con IA -> ficha del vendedor. El gancho de apertura es un DM entrante de un cliente
preguntando el precio.

Tarea:
1. Adapta el molde a UN rubro nuestro (comercio/gastronomia es el que mas material tiene).
   Escribi el prompt completo con la plantilla UGC de 6 mecanismos, con beats cronometrados y
   el dialogo entre comillas -- porque sale literal.
2. Deja los insumos listos: que fotos de referencia hacen falta y de donde salen.
3. Estima el costo en creditos y ponelo al lado del prompt.

DOS GATES QUE NO SE SALTEAN:
- La REGLA DE ORO: tabla de cortes + preview 360p a Sergio ANTES de aplicar cualquier corte.
- ORTOGRAFIA EN SUBTITULOS QUEMADOS. En este lote un reel publico DOS faltas quemadas en 10
  fotogramas ("A GENERADO" por "HA GENERADO", "ARANA" sin enye) -- salidas del
  auto-transcriptor sin revisar. En B2B boliviano una falta quemada cuesta la credibilidad que
  el video intenta construir. El SRT se revisa a ojo antes de quemarlo, con foco en enyes y
  acentos. Esto entra como paso fijo del pipeline de embedded-captions, no como recordatorio.

NO GENERES. Entrega prompt + insumos + costo. Sergio aprueba caso por caso.

LISTO = prompt completo del rubro, lista de insumos, costo estimado, y el gate de ortografia
agregado al pipeline de subtitulos.
```

---

## E8 · El formato slate/cara, como plantilla de HyperFrames

```text
Contexto: el reel del algoritmo de X usa la composicion mas eficiente que vimos para
explicar algo con numeros, y cuesta cero. Ficha con el detalle visual:
hermes-content/references/video-intake/2026-08-16-x-algoritmo-publico.md

La composicion, verificada en fotogramas:
- Pantalla partida ~40/60: arriba el slate, abajo la cabeza parlante.
- Slate: fondo crema plano, tarjetas minimalistas con UN glifo grande y una etiqueta chica
  debajo en mayusculas espaciadas ("↻ +1 / RETWEET" contra "🚩 / UN REPORTE"), esquinas
  redondeadas, sombra suave.
- Titular en naranja de peso alto sobre el slate, para el numero que importa.
- Abajo: cabeza parlante con subtitulos karaoke, y LA PALABRA CLAVE RESALTADA EN EL MISMO
  NARANJA del titular. El color ata el slate con lo que se esta diciendo en ese segundo.
  Ese es el truco: no es decoracion, es sincronizacion.

Tarea:
1. Armá esto como plantilla reusable de HyperFrames (HTML -> MP4): los slates se renderizan
   y se componen sobre el video de la cabeza. Los subtitulos karaoke ya los hace
   embedded-captions; el resaltado en color debe poder marcarse por palabra.
2. NO reinventes el motor. Revisá primero .claude/skills/ (talking-head-recut,
   embedded-captions, captions-overlay, media-use) -- las mismas viven tambien en
   .agents/skills/ -- y usá lo que ya existe.
3. Parametros minimos de la plantilla: proporcion del corte, color de acento, y una lista de
   slates con {glifo, etiqueta, titular, segundo de entrada}.
4. Probala con 3 slates de ejemplo y dejá el MP4 de prueba.

REGLA DE ORO: la tabla de cortes y el preview 360p se le muestran a Sergio ANTES de aplicar
nada. Nunca cortar a ciegas.

LISTO = plantilla en el repo, MP4 de prueba de 3 slates renderizado y visto, documentada
donde ya viven las plantillas del editor.
```

---

## E10 · El formato gemelo — comparación sin decir una palabra

```text
Contexto: un reel de 14 segundos compara dos formas de trabajar sin una sola palabra
hablada, y no usa IA. Ficha:
hermes-content/references/video-intake/2026-08-16-carril-a-como-se-hicieron.md (seccion 3)

Como esta hecho: camara fija en tripode, DOS TOMAS de la misma persona en el mismo sillon,
mascara vertical al medio en el montaje. Izquierda frustrado, derecha tranquilo. Encima,
texto en tres niveles: los dos titulos, la situacion en el medio ("Cliente nuevo:"), y el
resultado de cada lado -- rojo a la izquierda, verde a la derecha.

Por que importa: se entiende con el sonido apagado, que es como se ve la mayoria de los
reels. Y el tema es literalmente nuestro argumento: rehacer todo por cliente vs duplicar y
personalizar. O sea ONIA Platform con modulos contra el desarrollo a medida.

Tarea:
1. Armá la plantilla de composicion gemela: dos clips de la misma toma fija, mascara
   vertical, y las tres capas de texto parametrizadas (titulo izq/der, situacion, resultado
   izq en rojo / der en verde).
2. Documentá el procedimiento de grabacion en una linea, porque de eso depende que funcione:
   tripode que NO se mueve entre tomas, misma luz, mismo encuadre.
3. Dejá un render de prueba con material que ya tengamos.

Costo: cero. Sin generacion, sin creditos.

LISTO = plantilla parametrizada + render de prueba + las tres lineas de como grabarlo.
```

---

---

## `editor de videos`

Sale de [32 plantillas de HyperFrames](../2026-08-11-hyperframes-32-plantillas-microanimacion.md)
(`MEJORA LO ACTUAL`) y de un gap real que encontró el análisis de
[Open Carrusel](../2026-08-11-open-carrusel-claude-vs-canva.md) (`HUMO`, pero con hallazgo útil).

```text
Sesión: editor de videos. git branch --show-current primero.
TAREA ÚNICA: dos cosas chicas sobre lo que YA tenemos, ninguna herramienta nueva.
  1. Ampliar el uso de HyperFrames de "editar video hablado" a "animar interfaz": producir
     3-4 tarjetas de micro-animación con los elementos reales de ONIA Platform (factura
     emitida, cobro confirmado, alerta del agente, contador de ingresos con su delta).
  2. Agregar export cuadrado (1080x1080) y story (1080x1920) a scripts/carousel_render.js:
     hoy los 4 packs están fijos en 1080x1350.
LISTO = las tarjetas renderizadas a mp4 + el render de carrusel emitiendo los 3 formatos.
NO HAGAS: NO adoptes Raylight.app ni Open Carrusel — las dos duplican lo que ya está
instalado y son gasto sin permiso. Si usás alguna de las "32 plantillas" de terceros en
material comercial, revisá licencia primero; si hay duda, se replica con nuestro HyperFrames.
```

---

---

---

> **Agregado 2026-08-22, segunda tanda.** Sale de
> [DbT8hWPsyjN](https://www.instagram.com/reels/DbT8hWPsyjN/) ·
> [ficha](../2026-08-22-handoff-context-rot.md).
> **Va DESPUES de M2 y M3 y nunca en paralelo con ellos:** los tres tocan la capa de
> sobreimpresion. Cuesta cero creditos.

## N2 · El kit de sobreimpresión — terminal falsa, chip de glosario y subtítulos en dos registros

```text
Sesion: editor de videos. git branch --show-current primero.

Contexto: un reel de cabeza parlante de 66 s sostiene todo el interes visual con TRES capas de
sobreimpresion, ninguna generada con IA. Las tres son reproducibles con HyperFrames hoy y
cuestan CERO creditos. Reconstruccion detallada, con los valores leidos de pantalla:
hermes-content/references/video-intake/2026-08-22-handoff-context-rot.md seccion 4

ANTES DE CODEAR: la skill hyperframes vive en .agents/skills/ y es regla de CLAUDE.md
revisarla antes de tocar video. No reinventes el motor.

--- PIEZA 1: LA VENTANA DE TERMINAL FALSA (la principal) ---
Ventana estilo macOS sobre el tercio inferior, SEMITRANSPARENTE, que persiste ~25 s mientras
su contenido se escribe, se borra y se reescribe.
Valores recuperados de pantalla:
  - tres semaforos rojo/amarillo/verde arriba a la izquierda
  - titulo centrado en monoespaciada chica y gris (en el original decia "Claude Code")
  - linea separadora de 1 px bajo el titulo
  - fondo oscuro TRANSLUCIDO: se ve la mano de la persona a traves del panel
  - esquinas redondeadas ~14 px
  - el signo mayor-que del prompt en verde
  - los argumentos tipo nombre-de-archivo en naranja ambar, el resto del texto en blanco
  - salida de herramienta: vineta naranja + Write(archivo), y debajo la linea de resultado en
    gris apagado con el caracter de rama
  - cursor de bloque lleno, sin parpadeo

DOS COSAS QUE SON EL OFICIO Y NO SE VEN A PRIMERA VISTA:
  (a) NO esta trackeado a la escena. La mano pasa POR DETRAS del panel y el panel no se mueve
      aunque la camara tiembla. Es una capa pegada al cuadro. Por eso es facil.
  (b) NO es una ventana por beat. Es UNA sola ventana cuyo contenido se vacia a
      prompt-mas-cursor entre bloques (verificable en el segundo 49 del original). Eso da
      continuidad: se siente una sesion, no una secuencia de laminas. Si haces una ventana por
      beat, perdiste el efecto entero.

--- PIEZA 2: EL CHIP DE GLOSARIO ---
Pastilla chica, oscura, monoespaciada, arriba del cuadro:  termino_en_ingles = traduccion
El termino en rojo, la traduccion en blanco. Entra cuando la palabra se dice y sale cuando el
tema cambia. Resuelve un problema que tenemos identico: explicar en espanol algo cuya jerga
esta en ingles, sin gastar locucion en la definicion ni dejar a nadie afuera.

--- PIEZA 3: SUBTITULOS EN DOS REGISTROS ---
No es un solo estilo, son dos y la eleccion es deliberada:
  - GANCHO (0-3 s): blanco pesado con contorno negro grueso, SIN fondo, estilo sticker. Mas
    ruidoso, porque compite por la atencion.
  - CUERPO: pastilla oscura translucida, esquinas redondeadas, blanco pesado, dos lineas
    centradas.
Y LA REGLA DE COLOR, que es lo que ata todo: UNA sola palabra coloreada por tarjeta, y el
color sale de la paleta de la terminal (el mismo rojo, el mismo verde). No es decoracion:
hace que las dos capas se lean como un solo diseno en vez de dos plugins encima del video.

Tarea:
1. Buscá primero si el kit de subtitulos quemados que ya tenemos cubre la pieza 3. Si lo cubre,
   solo agregá la regla de una-palabra-coloreada y el estilo de gancho; NO escribas un segundo
   sistema de subtitulos.
2. Construí la ventana de terminal como componente PARAMETRIZADO: recibe el titulo, una lista
   de bloques, y por bloque el texto y si se escribe letra por letra o aparece de golpe.
   Que soporte vaciarse entre bloques sin desmontarse.
3. Construí el chip de glosario como componente: termino, traduccion, entrada y salida.
4. Probalo renderizando 15 s reales con los 5 campos del handoff como contenido. Ese es el
   caso de prueba y ademas es una pieza que podemos publicar.
5. MIRÁ EL MP4 RENDERIZADO antes de decir que funciona. Un render que termina sin error no es
   verificacion — regla de CLAUDE.md.

COSTO: cero creditos, todo es HyperFrames. No hay nada que aprobar.

LISTO = los dos componentes parametrizados en el repo + un mp4 de 15 s renderizado y MIRADO,
con la ventana persistiendo entre bloques y una sola palabra coloreada por tarjeta.
```

---

# Lote del 2026-08-23 — 3 prompts

> Fuente: [`PROMPTS_LOTE_2026-08-23.md`](../PROMPTS_LOTE_2026-08-23.md). Si cambia una regla,
> se edita allá, no acá.
>
> ⚠️ Antes de tocar `MOTION_PATTERN_BANK_2026.md`, leer
> [`2026-08-23-patrones-de-motion-deduplicados.md`](../2026-08-23-patrones-de-motion-deduplicados.md):
> las 18 fichas propusieron ~25 entradas y son 7 patrones reales.

## O16 · Molde: pantalla filmada en diagonal (prueba de trabajo sin testimonio)

- **Ficha:** [POV: el timeline como prueba de trabajo](../2026-08-23-pov-timeline-como-prueba-de-trabajo.md)
- **Qué falta:** Tres cosas, la primera es bloqueo real. (1) NO tenemos testimonio de cliente: cero clientes pagando y la regla prohibe inventarlos, asi que el payload debe cambiar. La version honesta reemplaza el testimonial por una pantalla viva del producto (un alta de clinica, el chatbot contestando, el pipeline moviendose); el molde aguanta el cambio porque no depende del contenido, depende de que haya algo reproduciendose. (2) Falta decidir el end card: el original es solo un dominio en texto plano sobre negro; el nuestro seria onia.com.bo con el tile verde ya decidido. Decision de cinco minutos que nadie tomo. (3) Hay que reescribir el gancho: 'POV: trying to make X look cool' + 'How'd I do?' funciona en la cuenta de un editor freelance, pero en la cuenta de Onia 'como me salio?' suena a producto no terminado y choca con la regla de no exhibir obra. El gancho tiene que ir en afirmativo y sobre algo VIVO.

```text
Arma un reel vertical de 30 a 40 segundos que use el molde 'pantalla filmada en diagonal'. La idea entera es no producir nada nuevo: se filma trabajo que YA existe reproduciendose en una pantalla.

REGLAS DEL MOLDE (no negociables, son lo que hace que funcione):

1. UNA SOLA TOMA CONTINUA de telefono. Nada de cortes en la capa de afuera. Deriva de mano lenta, sin zoom, sin barrido. El paralaje entre el rotulo fijo y la pantalla viva es todo el movimiento que necesitas.

2. FILMA EL MONITOR, no hagas captura de pantalla. El muare, el brillo del LCD y el grano de poca luz son la textura que dice 'esto es real'. Una captura limpia mata el efecto.

3. EL DISPOSITIVO VA GIRADO 15 a 20 grados, nunca de frente. La pantalla tiene que cruzar el cuadro como una cinta en diagonal que se aleja en perspectiva. De frente es una captura aburrida; en angulo es un objeto.

4. ENCUADRE 9:16: tercio superior para la pared y el rotulo, dos tercios inferiores para el dispositivo. Lo cercano desenfocado, lo importante al centro y a foco.

5. UN SOLO ROTULO DE TEXTO, FIJO LOS 35 SEGUNDOS. Sans geometrica bold, dos lineas maximo, interlineado apretado, mayuscula solo inicial, sombra oscura suave. CERO animacion de texto. Nada de segundo bloque, nada de revelacion.

6. FILMA DE NOCHE con una fuente calida en el fondo (lampara, neon, luz de cocina). La regla de color es CALIDO AFUERA, FRIO ADENTRO: la habitacion ambar, la pantalla gris azulada. Ese contraste de temperatura convierte la pantalla en una ventana sin ningun efecto.

7. DOS SILENCIOS. Los primeros ~5 segundos sin audio del contenido, para que se lea el rotulo. Los ultimos ~3.5 segundos en negro con el end card, tambien en silencio.

8. END CARD: onia.com.bo en texto blanco chico centrado sobre negro, mas el tile verde. Texto plano, sin animacion, sin claim.

QUE SE REPRODUCE EN LA PANTALLA (esto es lo que cambia respecto del original):
El original mete un testimonial de cliente sonando dentro del preview. NOSOTROS NO PODEMOS: cero clientes pagando, prohibido inventar testimonios. Reemplazalo por una pantalla VIVA del producto en produccion. Opciones, elegi una y una sola:
  - el alta de una clinica en onia.com.bo, de principio a fin
  - el chatbot de WhatsApp contestando una consulta real
  - el pipeline de leads de ONIA Center moviendo una tarjeta
  - el editor de conocimiento del chatbot guardando una fila

EL GANCHO: escribilo en AFIRMATIVO y sobre algo que este VIVO en produccion. Nada de 'como me salio?', nada de 'estamos probando', nada de estado de obra. Prohibido 'muy pronto', 'beta', 'proximamente'.

EL CAPTION: una sola pregunta corta que sea barata de contestar, mas nada. Sin hashtags de relleno.

ANTES DE APLICAR CUALQUIER CORTE: mostrale a Sergio la tabla de cortes y un preview en 360p. Regla de oro del carril, no se saltea.

HERRAMIENTAS: telefono para la toma; HyperFrames / editor-videos para el rotulo y el end card; ver-videos para revisar la pieza renderizada; Postiz o la ruta de Instagram para publicar. Cero gasto pago, cero Higgsfield, cero ElevenLabs.

LISTO = existe un MP4 vertical 9:16 de entre 30 y 40 segundos, renderizado en disco, que cumple las 8 reglas del molde verificadas UNA POR UNA mirando la pieza renderizada (no el codigo, no un log): (a) cero cortes en la capa de afuera, (b) el dispositivo esta girado y la pantalla se lee en diagonal, (c) hay exactamente un rotulo de texto y no se mueve, (d) la pantalla reproduce una superficie de Onia que esta VIVA en produccion hoy, (e) el gancho no contiene ninguna palabra de estado de obra, (f) hay silencio al principio y al final, (g) el end card dice onia.com.bo, (h) Sergio vio la tabla de cortes y el preview 360p y dio OK explicito sobre ESA pieza.
```

## O17 · Reel 'lista densa contra reloj' — formato Onia, 58 s en una toma

- **Ficha:** ["$70 millones de consejos de venta en 60 segundos" — el cronómetro está DENTRO del plano y no hay un solo corte](../2026-08-23-70-millones-consejos-venta-cronometro-en-plano.md)
- **Qué falta:** (a) EL GUION, que no existe: ~24 frases-consejo en espanol boliviano sobre vender software a duenos de negocio, densas y sin relleno, que quepan en 58 s a 3,4 palabras/s (~200 palabras exactas). Ese es el trabajo real. (b) Decidir el par tipografico propio de Onia (una geometrica ligera + una didone) y fijarlo como tokens: copiar Futura+Playfair tal cual es copiar el estilo de otra marca. (c) EL NUMERO DEL GANCHO: Onia NO tiene un '$70 millones' y por la regla de no fabricar esta prohibido inventarlo — el banner debe apoyarse en la promesa de densidad o en una cifra sostenible. (d) EL CUELLO DE BOTELLA REAL: Sergio delante de camara 58 s sin cortarse. Una sola toma no perdona, y es la unica parte que no se automatiza.

```text
Armá un reel vertical de 58 segundos para Onia con el formato 'lista densa contra reloj'. Reproducí estas reglas EXACTAS, todas medidas de una pieza real, no estimadas:

GRABACIÓN
1. UNA SOLA TOMA, cero cortes. Nada de cortar silencios, nada de jump cuts, nada de b-roll. Si la toma se traba, se repite entera.
2. Cámara fija, plano medio a la altura de una mesa/barra, la persona en el TERCIO DERECHO del cuadro mirando a lente.
3. En el TERCIO INFERIOR IZQUIERDO va un portátil apoyado, reproduciendo a pantalla completa un video de cronómetro de 1 minuto (buscá '1 minute timer black background' en YouTube). En el primer segundo la persona SEÑALA el reloj con la mano: ese gesto es la apertura, no hay locución de arranque.
4. Fondo oscuro y cálido, desenfocado, con un acento de luz cálida. Un solo color saturado en el cuadro (la ropa). Lavalier a la vista, no lo escondas.
5. Voz sola: NADA de música de fondo. Normalizá la voz fuerte (~-18 dBFS RMS).

GUION
6. ~200 palabras exactas, habladas a 3,4 palabras por segundo. Eso es ~24 frases-consejo, una cada 2,4 segundos. Sin relleno, sin 'como les decía', sin transiciones.
7. Estructura: 0-5 s tesis que descalifica el instinto del espectador · 5-9 s reencuadre emocional · 9-17 s UNA TAXONOMÍA (tipos de comprador) — es el tramo que la gente guarda · 17-27 s mecánica · 27-46 s objeciones · 46-58 s cierre con un remate que se CONTRADICE con el ritmo que acabás de ejecutar.
8. CERO CTA. Nada de 'seguime', 'guardalo', 'comentá'. La conversión es la densidad: imposible retener todo en un pase, así que se rebobina.

TEXTO EN PANTALLA
9. BANNER FIJO desde el fotograma 0 hasta el último, nunca sale: versalitas negras en grotesca pesada sobre píldora blanca redondeada, dos líneas, centrado arriba (x 0,29-0,71 · y 0,216-0,270 del cuadro). Terminá el banner en DOS PUNTOS: prometen una lista. El número del banner tiene que ser VERDADERO — si no tenemos cifra, la promesa es de densidad, no de plata. Prohibido inventar.
10. SUBTÍTULO: bloques de 4-5 palabras, mediana 1,30 s por bloque (rango 0,50-2,95 s). Dentro de cada bloque las palabras APARECEN DE A UNA siguiendo el habla real. Total: ~46 bloques en 58 s.
11. CERO ANIMACIÓN. Cada palabra y cada bloque aparecen y desaparecen en UN SOLO FOTOGRAMA. Sin fundidos, sin pop, sin escalado, sin resaltado karaoke de la palabra activa. Si le ponés easing, arruinaste la pieza: a 0,29 s por evento el movimiento es ruido.
12. DOS TIPOGRAFÍAS que se turnan por bloque, sin regla fija: una geométrica ligera en minúscula y una serif display en VERSALITAS. Blanco puro (#FBF7FA aprox.) con halo mínimo. Elegí el par propio de Onia y fijalo como token; no copies Futura+Playfair tal cual.
13. ESCALERA: cada línea nueva del bloque se centra ~6% del ancho de cuadro más a la derecha que la anterior.
14. El bloque vive en la banda y 0,33-0,40 del alto, en el vacío oscuro. NUNCA pisa la cara, NUNCA pisa el portátil, NUNCA pisa el banner.

CIERRE
15. Cortá con el reloj entre 0:01 y 0:03, NUNCA en 0:00. Sin outro, sin tarjeta final, sin CTA. El bucle queda abierto a propósito.

Antes de aplicar cualquier corte o de renderizar, mostrale a Sergio la tabla de bloques + un preview 360p. Regla de oro del carril: nunca cortar a ciegas.

LISTO = el mp4 exportado pasa las SEIS verificaciones medidas con ffmpeg/ffprobe sobre el archivo final, no sobre la intención: (1) `ffmpeg -vf "select='gt(scene,0.10)',showinfo"` devuelve 0 eventos de escena; (2) la duración está entre 55 y 60 s; (3) contando píxeles blancos en la región del subtítulo a 30 fps hay entre 40 y 50 caídas de tinta (bloques) con mediana entre 1,1 y 1,5 s; (4) ninguna caída ni subida de tinta tarda más de 1 fotograma (cero fundidos); (5) el piso de audio en su ventana de 100 ms más callada está por debajo de -45 dBFS (sin cama musical); (6) el último fotograma muestra el cronómetro entre 0:01 y 0:03. Y Sergio dio el OK explícito sobre ESA pieza renderizada, no sobre el plan.
```

## O18 · Carrusel-prueba de 4 láminas: el número que sube es el único argumento

- **Ficha:** [TYCHS — el contador que sube es todo el argumento (carrusel de 4 láminas, conteo de papas con YOLO11 Nano + SAM 2)](../2026-08-23-tychs-contador-papas-yolo11-sam2.md)
- **Qué falta:** Tres cosas concretas. (1) Un video fuente de 13-15 s de una pantalla real de ONIA con un número que suba solo — citas agendadas, mensajes respondidos por el agente, ítems procesados — en toma única con captura fija. (2) Definir el par de verdes: el verde de marca de Onia más un 'verde máquina' distinto para la salida del sistema; hoy ese segundo verde no existe. (3) Datos que se muevan: el alta está CERRADA hasta v1.0 y la cuenta de clinica klein se borró, así que hace falta un tenant demo con datos sembrados, y por la regla de no fabricar ese material se rotula demo. Lo que NO falta: el motor, el formato ni el permiso de gasto — es render local y gratis, no toca Higgsfield ni ElevenLabs.

```text
Armá un carrusel de Instagram de 4 láminas en 4:5 (1080x1350) que demuestre que [MÓDULO DE ONIA] funciona, sin una sola palabra hablada y sin exhibir obra.

REGLAS DURAS
- Prohibido "muy pronto", "beta", "en construcción", "próximamente", banners de borrador o listas de lo que falta.
- Prohibido inventar testimonios, logos o cifras. Si es demo, se rotula demo.
- Si aparece un precio, se LEE de onia-platform/lib/pricing.ts (add-ons) o lib/subscription-plans.ts (planes). No se escribe a mano.

LÁMINA 1 — LA PRUEBA (video, 13-15 s, TOMA ÚNICA, cero cortes)
- Captura de pantalla real de ONIA con UN número que sube solo (citas agendadas, mensajes respondidos por el agente, ítems procesados). Captura fija, sin paneo.
- El número va en VERDE MÁQUINA (#00FF00 puro), posición FIJA, sin animación, sin easing, sin odómetro: se redibuja el entero crudo cada fotograma. El número ES el motion design. No agregues transiciones, zoom, parallax ni entradas de texto.
- Si hay un estado o una región que importa, marcala con un polígono de trazo magenta (#FF00FF) y relleno traslúcido oscuro (#4A0F45 al ~55%), y cambiá el color de los elementos al entrar: un color fuera (violeta #6A3BC0), otro dentro (ámbar #C8873C).
- Al pie: banda NEGRA SÓLIDA (#000000, NO degradado) ocupando ~28% del alto, con el titular QUEMADO en grotesca condensada black, TODO MAYÚSCULAS, tracking apretado, interlineado apretado, 4 líneas.
- El titular alterna VERDE DE MARCA y BLANCO por BLOQUE DE SENTIDO, nunca por palabra suelta.
- En la costura entre video y banda negra: el logo centrado, flanqueado por dos hairlines que llegan a los bordes.
- Franja inferior fina: "DESLIZÁ PARA VER MÁS" en versalitas tracked-out + chip verde con ▶.
- Audio: cama instrumental, sin voz, ~-16 dB medios. El post tiene que funcionar con el sonido apagado.

LÁMINA 2 — EL MECANISMO, CON NOMBRES REALES
- Imagen del cómo: la pantalla o el diagrama que muestra el mecanismo.
- Titular en verde de marca, condensada black, máximo 2 líneas.
- Debajo, banda negra con el cuerpo en ITÁLICA sentence-case (contraste deliberado contra el titular): UNA sola oración que NOMBRA las herramientas de verdad. Nada de "IA avanzada" ni "tecnología de punta": nombres propios o nada.

LÁMINA 3 — LA PRUEBA OTRA VEZ, LIMPIA
- El MISMO video de la lámina 1, mismo render del contador, pero SIN titular.
- Metelo en una tarjeta de esquinas redondeadas con borde hairline blanco, centrada sobre un fondo oscuro que es el mismo video escalado y desenfocado. Logo arriba a la derecha.
- Sirve para que quien ya leyó el titular pueda MIRAR sin texto encima.

LÁMINA 4 — EL CIERRE
- Foto ambiente amplia del contexto de uso.
- Titular al pie alternando BLANCO y VERDE DE MARCA, condensada black, mayúsculas, 3 líneas.
- UN solo pedido. Sin link, sin precio, sin lista de features.

PALETA (ajustá el verde de marca al de Onia; el verde máquina queda como está)
- Negro banda #000000 · Blanco #FFFFFF
- Verde de marca ≈ #8CC63F (voz editorial)
- Verde máquina #00FF00 (salida del sistema)
- NUNCA usar el mismo verde para las dos cosas: esa separación es todo el truco.

RENDER
HyperFrames (HTML→MP4). El contador, el polígono, el titular y el chip de swipe son HTML/CSS sobre el video: no hace falta OpenCV ni ningún modelo de visión.

LISTO = las 4 láminas exportadas en 4:5 (1080x1350); `ffmpeg -i sX.mp4 -vf "select=gt(scene\,0.15),showinfo" -f null -` devuelve CERO cortes en las láminas 1 y 3; el contador se lee con un valor en el primer fotograma y uno MAYOR y distinto en el último; un grep sobre todos los textos devuelve cero coincidencias de pronto|beta|construcción|próximamente; y las 4 láminas fueron ABIERTAS Y MIRADAS renderizadas (no solo exportadas) antes de publicar.
```

---

# Lote cosechado del DM — 2026-08-23 — 7 prompts

> Fuente: [`PROMPTS_LOTE_2026-08-23-COSECHA.md`](../PROMPTS_LOTE_2026-08-23-COSECHA.md).
> Sin transcripción de audio: Speaches falló. Texto en pantalla + caption + cortes medidos.

## P9 · Portar el patron 'overlay dibujado que golpea la UI' a un reel de 7 s de Onia Platform

- **Ficha:** [El látigo sobre la terminal: un overlay dibujado que golpea una captura de pantalla](../2026-08-23-cosecha-latigo-dibujado-sobre-captura-de-terminal.md)
- **Qué falta:** Nada bloqueante: cero gasto, cero credencial, cero permiso. Solo dos insumos nuestros: (a) una captura de pantalla de Onia Platform ya restilada — la memoria de la landing v3 dice explicitamente que los dashboards se restilan ANTES de las capturas, ese es el orden; (b) decidir que accion concreta dramatiza el gesto. ADVERTENCIA DE MARCA: si portamos el molde hay que agregarle el cierre que este post NO tiene (agendar demo en cal.onia.com.bo), y jamas copiar la mecanica del titular — el post afirma una capacidad que su propia pantalla desmiente (todos los Web Search salen Interrupted y Claude termina respondiendo de memoria), que es justo lo que la regla de no fabricar prohibe.

```text
Sos la sesion del carril editor-de-videos. Objetivo unico: producir UN reel vertical de ~7 segundos que porte el patron de motion documentado en la ficha de video-intake `Day9oS2ClDu` (latigo dibujado sobre captura de terminal), aplicado a una pantalla real de Onia Platform.

ANTES DE CODEAR, cargar en este orden: la skill `hyperframes` (entrada), `hyperframes-core` (contrato de composicion), `motion-doctrine` (ley de continuidad y prohibicion de wobble ocioso), `cut-the-curve` (curva del golpe), `oversized-cursor` (el patron hermano: elemento grafico fuera de escala sobre una UI real) y `hyperframes-animation` + `hyperframes-keyframes`. NO reinventar el motor: HyperFrames vive en `.agents/skills/`, revisarlo antes de escribir nada.

EL PATRON A REPRODUCIR (medido con ffprobe sobre el original, no estimado):
- 6.9 s aprox, 30 fps, formato 9:16.
- CERO cortes. Un solo plano continuo. Todo el ritmo lo pone el elemento animado, no el montaje.
- Lienzo negro puro #000000 con letterbox arriba y abajo; la captura de pantalla FLOTA en el centro al ancho del area util, NO se recorta a pantalla completa.
- UN solo titular estatico, presente el 100% del tiempo, en el tercio superior negro: sans humanista peso regular (NO bold), blanco #FFFFFF, caja baja, centrado, 3 lineas maximo, interlineado ~1.25, ancho ~78%. Sin sombra, sin caja de fondo, sin contorno, sin emoji.
- Encima de la captura: un elemento grafico SOBREDIMENSIONADO en trazo de contorno blanco #FFFFFF de 3-4 px, SIN relleno, blend normal. Entra fuera de cuadro, describe un arco en S, 'golpea' cerca del punto de interes de la UI, sale de cuadro. ~3 pasadas en los 7 s.
- SMEAR FRAMES obligatorios en el pico de cada pasada: 3-5 copias del mismo path desfasadas con opacidad decreciente, encendidas SOLO en los fotogramas del pico. Esto es lo que hace que el golpe se sienta rapido sin un solo corte. Implementacion: <svg> con <path> animado por stroke-dasharray + transform keyframeado; las copias son paths hermanos con opacity keyframeada a 0 fuera del pico.
- El elemento NO deforma la UI. La ilusion de impacto es solo trayectoria + smear + SFX sincronizado al frame del restallo.

QUE DRAMATIZAR (elegir UNO y no mezclar): una accion real y VIVA de Onia Platform. Ejemplo valido: la agenda del modulo dental donde una cita se confirma sola. Prohibido dramatizar algo que no este encendido en produccion.

INSUMOS QUE TENES QUE CONSEGUIR VOS ANTES DE RENDERIZAR:
1. La captura de pantalla de Onia Platform. Grabar la pantalla REAL, no un mockup — la mugre autentica (barra del navegador, datos reales de demo) es lo que hace creible el patron. OJO CON EL ORDEN: si la pantalla no esta restilada segun la linea de la landing v3, se restila ANTES de capturar. No capturar una pantalla vieja.
2. El SVG del gesto, en trazo de contorno sin relleno.

REGLAS DE MARCA — NO NEGOCIABLES:
- El original NO tiene CTA. El nuestro SI: cierra mandando a agendar demo en cal.onia.com.bo. Ese es el lead magnet decidido; no es un PDF.
- PROHIBIDO copiar la mecanica del titular del original. Ese post afirma 'hace que Claude funcione mas rapido' mientras su propia pantalla muestra que cancela todas las busquedas. No fabricamos capacidades.
- PROHIBIDO todo estado de obra en pantalla: nada de 'muy pronto', 'beta', 'proximamente', 'en construccion'.
- Cero cifras, cero testimonios, cero logos de clientes: no hay clientes pagando.

GASTO: cero. Todo con HyperFrames local. NO usar Higgsfield ni ElevenLabs sin permiso explicito caso por caso.

REGLA DE ORO DEL CARRIL: la tabla de cortes y el preview 360p se le MUESTRAN a Sergio antes de dar nada por bueno. Nunca cortar ni publicar a ciegas. Construir y publicar son dos permisos distintos.

Al cerrar, escribir el handoff del carril en `.claude/handoff/<rama-con-guiones>.md` con los 7 campos de hermes-content/docs/HANDOFF_DE_SESION.md, incluido el campo de intentos fallidos.

LISTO = existe un MP4 renderizado en el arbol de trabajo que ffprobe reporta como 1080x1920, 30 fps, entre 6.0 y 8.0 s; `ffmpeg` con filtro de escena a umbral 0.3 reporta 0 cortes; y abriendo con Read el fotograma del segundo 3 se ve simultaneamente el titular estatico, la captura de Onia Platform y el trazo blanco del overlay con sus smear frames.
```

## P10 · Marco HUD de cuatro esquinas + cierre por elemento portador, como composicion reutilizable de HyperFrames

- **Ficha:** [El marco HUD de cuatro esquinas y el cierre que invierte el wordmark](../2026-08-23-cosecha-marco-hud-y-cierre-en-wordmark.md)
- **Qué falta:** Para el COMPONENTE: nada. Se construye y renderiza hoy con metraje de prueba, sin credencial, sin permiso, sin gasto. Para el REEL COMPLETO de ONIA: falta metraje real — alguien filmando a Sergio trabajando (no es credencial ni permiso, es una filmacion). Y falta corregir el formato: este video es 16:9 y en Reels eso es una franja chica con bandas negras; nuestra version tiene que nacer 1080x1920 con el HUD dentro del area segura, no portar el 16:9 tal cual.

```text
Objetivo unico de la sesion: dejar en el repo una composicion de HyperFrames reutilizable que le ponga a CUALQUIER metraje nuestro un marco HUD de cuatro esquinas, una placa de apertura y un cierre por elemento portador, y renderizarla a MP4 para verla.

ANTES DE CODEAR NADA, leer en este orden (regla del proyecto: no reinventar el motor de video):
1. .agents/skills/hyperframes/ (skill de entrada, rutea)
2. .agents/skills/hyperframes-core/ (contrato de composicion, atributos data-*, class="clip", tracks, reproduccion de media que maneja el framework)
3. .agents/skills/motion-doctrine/ (elemento portador, seam gate, prohibicion del wobble ocioso)
4. .agents/skills/hyperframes-cli/ (check, preview, render)
Si alguna de esas rutas no existe, listar .agents/skills/ y usar la que corresponda antes de escribir codigo.

De donde sale esto: analisis del reel https://www.instagram.com/p/DaAjqtugWF_/ de @formd.designs, fichado en hermes-content/references/video-intake/. Medido con ffprobe: 16.739 s, 1276x718, 29.97 fps, 31 cortes. Leer la ficha si hace falta contexto.

QUE HAY QUE CONSTRUIR — tres piezas en UNA composicion parametrizable:

1. HUD DE CUATRO ESQUINAS
   - Cuatro rotulos en mayusculas, grotesca bold, tamano ~1.3% de la altura del cuadro, tracking ~0.05em. Parametrizables por variable: arribaIzq, arribaDer, abajoIzq, abajoDer. Valores por defecto para ONIA: "PRODUCTO" / "ONIA" / "<rubro>" / "2026(c)".
   - Color: blanco puro con mix-blend-mode: difference. Ese es el punto de todo el ejercicio — sobre metraje oscuro se lee blanco, sobre un fondo blanco se lee NEGRO solo, y sobre altas luces quemadas se apaga en vez de pelearse con la imagen. NO hardcodear dos versiones de color.
   - El HUD NO aparece en el primer plano. Entra recien en el primer corte. Dejarlo como parametro (retrasoHud, default 1.4 s).

2. PLACA DE APERTURA
   - Titular a dos lineas, centrado en el eje horizontal, blanco, grotesca pesada, sobre metraje a sangre completa y SIN HUD.
   - Cero animacion de texto: aparece y desaparece. Nada de entrada, salida, rebote ni fade elaborado. Es deliberado y es la mitad del efecto (camara salvaje + tipografia inmovil).
   - Duracion por defecto 1.4 s, parametrizable.

3. CIERRE POR ELEMENTO PORTADOR
   - El wordmark aparece en pantalla, en su posicion y tamano FINALES, mientras detras todavia siguen cambiando planos de metraje.
   - Despues el fondo se blanquea (#F5F4F2) y el wordmark queda quieto, sin moverse un pixel, invirtiendose a negro por el mismo mix-blend-mode: difference.
   - Duracion del cierre por defecto 1.6 s.

FORMATO — esto es una CORRECCION al original, no una copia:
   - Salida primaria 1080x1920 (9:16), con el HUD dentro del area segura de Reels/TikTok (nada de rotulos pegados al borde absoluto: dejar margen para la UI de la app).
   - Salida secundaria 1920x1080 (16:9) desde la MISMA composicion, via variable de formato.
   - El original es 16:9 y en Reels se ve como una franja chica entre bandas negras. No portar ese error.

GRADE Y RITMO (si tocan el metraje de prueba, con ffmpeg o el paso de grade que ya tengamos en editor-videos):
   - Teal & orange disciplinado, DOS temperaturas y nada mas: sombras a turquesa (~#1E9C9E), medios y piel a ambar (~#E08A3C), negros aplastados. Sin tercer color.
   - Cadencia de referencia medida del original: plano 1 = 1.43 s, plano 2 = 1.41 s, luego 0.50/0.16/0.30/0.47, rafaga de TRES cortes de 0.10 s (3 fotogramas), pulso sostenido de media ~0.47 s, frenada de 0.97 s, cierre de 1.59 s. Regla: el plano mas largo es el primero, el segundo mas largo es el ultimo.

LIMITES DEL PROYECTO QUE APLICAN:
   - Regla de oro de video: la tabla de cortes + preview 360p se le MUESTRAN a Sergio ANTES de aplicar ningun corte sobre metraje real. En esta sesion se trabaja con metraje de prueba, asi que no aplica todavia, pero dejarlo escrito en el README del componente.
   - Gasto: cero. Nada de Higgsfield ni ElevenLabs aca. HyperFrames + ffmpeg y listo.
   - No inventar clientes, testimonios ni cifras en el metraje de prueba ni en los textos por defecto.
   - Un carril, un worktree, rama propia, commits conventional, y gates antes de mergear.

DONDE VA: la composicion en la carpeta de composiciones de HyperFrames que corresponda segun hyperframes-core; los dos patrones nuevos anotados en web-factory/docs/MOTION_PATTERN_BANK_2026.md con los nombres "HUD de cuatro esquinas por diferencia" y "cierre por elemento portador".

LISTO = existen dos MP4 renderados desde la MISMA composicion (uno 1080x1920 y uno 1920x1080) donde, mirando las capturas: (a) el HUD se lee blanco sobre el metraje oscuro Y negro sobre la placa final blanca, sin que exista ninguna version de color hardcodeada en el codigo; (b) el HUD esta ausente en el primer plano y presente desde el primer corte; (c) el wordmark aparece sobre metraje y termina quieto en la placa blanca en identica posicion y tamano, verificable comparando dos fotogramas; y (d) MOTION_PATTERN_BANK_2026.md tiene los dos patrones nuevos escritos.
```

## P11 · Plantilla HyperFrames: 3 laminas de paso con hilo continuo y subtitulo palabra-a-palabra

- **Ficha:** [Explicador de servicio en 3 pasos con hilo continuo](../2026-08-23-cosecha-explicador-servicio-3-pasos-hilo-continuo.md)
- **Qué falta:** Ninguna credencial, permiso ni gasto: HyperFrames ya corre. Faltan DOS decisiones de Sergio. (1) Con que se llenan los tres huecos de prueba: el molde apoya todo su peso en cifras de cliente (400->11.000 seguidores, 12.005 impresiones, 'VPs now DM him', capturas de DM) y Onia tiene CERO clientes pagando — la regla 'no fabricar' prohibe inventarlas, asi que hay que decidir si se llenan con demo del producto en vivo (pantallas reales y verificables) o si el molde se recorta a 4 bloques. (2) Formato: el original es 16:9 (1276x718) y nuestro carril de reels es vertical; decidir si la plantilla nace 9:16, 16:9 o ambas. Nota heredada: el CTA 'Link in Bio' porta directo pero el objeto que mandamos es agendar demo en cal.onia.com.bo, no un PDF.

```text
Objetivo unico de la sesion: dejar en el repo UNA composicion HyperFrames reutilizable que reproduzca el sistema de motion del reel https://www.instagram.com/p/Dax0R-atz8d/ (@metromedia.house), analizado en hermes-content/references/video-intake/. NO es un video de Onia terminado: es la PLANTILLA con contenido de relleno, para que despues cualquier explicador se arme cambiando textos e imagenes.

Antes de codear, cargar en este orden: skill hyperframes (entrada), hyperframes-core (contrato de composicion), hyperframes-animation, motion-doctrine y seam-craft. HyperFrames vive en .agents/skills/ — revisarlo ANTES de escribir nada, no reinventar el motor.

QUE TIENE QUE HACER LA PLANTILLA (los 4 mecanismos, medidos del original):

1) HILO BEZIER CONTINUO ENTRE ESCENAS. Una curva blanca de 2-3px que entra por abajo-izquierda de la lamina azul, sube y termina en la pildora 'Step N'. Se DIBUJA con stroke-dashoffset (en el original se ve la punta suelta a media pantalla antes de que llegue el titulo). Las tres laminas de paso llevan la MISMA curvatura y el MISMO punto de salida, aunque esten separadas por otras escenas: tienen que leer como un solo trazo que atraviesa el video. Es el elemento portador de seam-craft.

2) SUBTITULO PALABRA-POR-PALABRA SOBRE LINEA PRE-MAQUETADA. La linea completa se compone de entrada y cada palabra ocupa su posicion final desde el primer fotograma; lo unico que cambia es la opacidad de cada <span>. Criterio duro: las palabras ya visibles NO se mueven al aparecer las siguientes (nada de append de texto, nada de reflow). Eso es lo que produce los huecos grandes e irregulares que caracterizan el estilo.

3) PALABRA FUTURA PRE-PINTADA EN GRIS. La palabra que todavia no se dijo ya esta visible pero al ~45% de opacidad, y se enciende a blanco al pronunciarse. Tiene que ser un parametro por palabra, porque el original tambien lo usa INTERCALADO a mitad de frase como recurso de jerarquia (apagar el relleno para que salte la palabra que importa), no solo como progresion lineal. Antes de escribirlo: verificar si captions-overlay ya soporta este modo. Si ya existe, usarlo y no duplicar.

4) COLLAGE QUE SE ENSAMBLA. Recortes que entran de a uno (2 -> 4 -> 5), cada uno con sombra suave y 2-5 grados de rotacion, escalonados en Z, terminando de aterrizar despues de que el titulo termine de escribirse.

TOKENS DE ESTILO (hex APROXIMADOS, leidos de pantalla — dejarlos como variables CSS, no hardcodeados): fondo azul ultramar #1436C8 con halo radial #2A4FE0 al centro y vineta en bordes; texto activo #FFFFFF; gris del 'aun no dicho' #B9C6EE; negro de contraste #0A0A0A; lamina papel #F2F2F0 con grilla #D8D8D6. Una grotesca de palo seco, dos pesos conviviendo en la misma linea (Black para la palabra que carga el sentido, Regular para el resto), tracking negativo en titulares. Pildora 'Step N': borde 1px, radio completo, texto chico — es el unico elemento con contorno.

RITMO A RESPETAR (medido con ffprobe sobre el original, NO estimar): 48 cortes en 60,857 s; 65% de los planos por debajo de 1 s; rafaga de apertura de 15 cortes en 7,47 s con un parpadeo de 4 cortes en 0,29 s; DOS mesetas de explicacion sin ningun corte, de 5,22 s y 5,00 s; y una cola de CTA de 3,93 s sin corte. La plantilla tiene que exponer esas tres velocidades como beats nombrados (rafaga / meseta / cola), no como duraciones sueltas.

PROHIBIDO EN ESTA PLANTILLA:
- Archivo de terceros. El original se apoya en The Social Network, The Office, keynotes de Jobs y Benioff, archivo de Bezos y Musk, todo sin licencia declarada. En la plantilla van placeholders neutros o capturas de onia-platform.
- Cifras, testimonios o logos inventados. Onia tiene cero clientes pagando. Los slots de prueba del molde van VACIOS y marcados como <PRUEBA_PENDIENTE>: los llena Sergio, no esta sesion.
- Cualquier texto de estado de obra ('muy pronto', 'beta', 'proximamente') en el contenido de relleno.

FORMATO: 9:16 vertical (1080x1920) como default. Si el layout aguanta 16:9 sin rehacer nada, dejar la variante; si no, no forzarla.

CIERRE DE CARRIL: worktree con ruta explicita, `git branch --show-current` primero, commits conventional, gates antes de mergear, y handoff en .claude/handoff/<rama>.md con los 7 campos de hermes-content/docs/HANDOFF_DE_SESION.md.

LISTO = `hyperframes check` pasa sin errores sobre la composicion nueva Y `hyperframes render` produce un MP4 de 1080x1920 en el que, MIRANDO el render (no un grep, no un exit code 0): (a) el hilo blanco cruza las tres laminas de paso con la misma curvatura y punto de entrada, (b) al menos una linea de subtitulo muestra una palabra en gris que se enciende a blanco sin que se mueva ninguna palabra vecina, (c) el collage entra de a un recorte por vez, y (d) el plano final del CTA dura mas de 3 s sin corte. Adjuntar 4 capturas del render, una por criterio.
```

## P12 · Plantilla HyperFrames: escalera comparativa RUIM/BOM/EXCELENTE, parametrizada por rubro

- **Ficha:** [Escalera RUIM / BOM / EXCELENTE: un brief, tres niveles](../2026-08-23-cosecha-escalera-ruim-bom-excelente.md)
- **Qué falta:** Solo el talking-head: o Sergio graba 16 s de corrido, o se usa a Lucía (ElevenLabs = gasto, requiere permiso explícito caso por caso). Y una decisión chica: la palabra-gatillo del comentario — por la decisión del 2026-08-23 el objeto que mandamos por DM es agendar demo en cal.onia.com.bo, no un PDF, así que 'COMENTA GPT' se porta como 'COMENTA DEMO'. Nada más está bloqueado. Advertencia al portarlo: la regla 'la venta nunca exhibe obra' obliga a que el escalón RUIM sea una pieza genérica de rubro, NUNCA material propio con marca Onia encima.

```text
Construí en HyperFrames una plantilla de video vertical reutilizable llamada `escalera-comparativa`, portada del reel https://www.instagram.com/p/Db60O6OxWU5/ (@tiagolemosx). Antes de codear leé la skill `hyperframes` (entrada), después `hyperframes-core` y `hyperframes-cli`. NO reinventes el motor.

QUÉ ES EL PATRÓN (medido con ffprobe sobre el original, no estimado): 15,810 s · 720x1280 · 30 fps · **0 cortes** al umbral de escena 0,3. Es UNA sola toma continua con cámara fija; todo el ritmo lo hacen overlays que aparecen. Estructura: 4 bloques temáticos de ~3,95 s; dentro de cada bloque entran 3 láminas de izquierda a derecha (~1,3 s cada una) etiquetadas RUIM / BOM / EXCELENTE; los últimos ~3 s son CTA.

LO QUE TENÉS QUE ENTREGAR:

1. Una composición HyperFrames con:
   - Banda gráfica FIJA en el tercio superior: fila de hasta 3 piezas verticales ratio 4:5, separación regular, etiqueta centrada debajo de cada una en mayúsculas, blanco #FFFFFF con sombra suave (usá una grotesca geométrica pesada; la del original no se declara, elegí Poppins o Montserrat SemiBold).
   - Los dos tercios inferiores son una PISTA VACÍA reservada para el talking-head. Dejala declarada como track con su hueco documentado — todavía no tenemos la toma, y no la inventes.
   - Aparición DURA de cada lámina (sin fade, sin slide): así es el original.
   - Pill de CTA al final: border-radius total, blanco sólido, sombra difusa, dos pesos tipográficos dentro. Texto: `COMENTA` / `"DEMO"`. NO uses "GPT" — nuestro lead magnet decidido el 2026-08-23 es agendar demo en cal.onia.com.bo.

2. Parametrización por rubro: un solo JSON de entrada con `{ rubro, bloques: [ { titulo, laminas: [ruim, bom, excelente] } ] }`. Cambiar de dental a comercio o gastronomía debe ser editar ese JSON y volver a renderizar, nada más.

3. Tres láminas de ejemplo del módulo dental, hechas en HTML/CSS (NO con generador pago — no hay permiso de gasto en este prompt), siguiendo esta rúbrica que es el hallazgo del post:
   - RUIM: todo el brief impreso encima, 12-18 elementos de texto, 5+ colores saturados peleando, jerarquía plana, el producto tapado por sus claims.
   - BOM: se borra ~70% del texto; queda título + 2 líneas + CTA; UNA familia tipográfica con título 5-6x el cuerpo; 2-3 colores; producto con aire.
   - EXCELENTE: mismo copy que BOM, pero con UNA idea visual fuerte. El texto no baja más, sube el concepto.
   REGLA DURA: el escalón RUIM debe ser una pieza GENÉRICA de rubro, nunca material con la marca Onia encima. La regla "la venta nunca exhibe obra" prohíbe mostrar trabajo propio etiquetado como malo.

4. Registrá el patrón en `web-factory/docs/MOTION_PATTERN_BANK_2026.md` bajo el nombre "escalera comparativa", anotando el mecanismo: N estados del mismo objeto, aparición secuencial sin transición, sobre plano fijo sin cortes, animación cue-ada por gesto y no por beat.

NO HAGAS: no generes imágenes con Higgsfield ni ElevenLabs (gasto = permiso explícito de Sergio, caso por caso). No grabes ni sintetices el talking-head. No inventes testimonios, logos ni cifras de clientes (cero clientes pagando).

LISTO = existe un MP4 renderizado por HyperFrames a 1080x1920 de ~13 s con los 4 bloques de láminas y el pill `COMENTA "DEMO"`, verificado ABRIENDO el archivo y mirando 3 capturas (t=2 s, t=8 s, t=12 s) — no un exit code 0; más el JSON de rubro y una línea de comando documentada que re-renderiza el mismo video cambiando `rubro: dental` por `rubro: comercio`.
```

## P13 · Plantilla HyperFrames: listicle sobre toma continua

- **Ficha:** [Nueve formatos de anuncio en 9,8 s sin un solo corte](../2026-08-23-cosecha-nueve-formatos-anuncio-sin-cortes.md)
- **Qué falta:** Para la plantilla del reel: NADA, se hace hoy. Para producir los 9 formatos con IA: permiso explicito de gasto de Sergio caso por caso (Higgsfield es pago). Y una decision de Sergio: cuales de los 5 formatos limpios (Claymation, Fake Podcast, Skeleton Story, Hyper Motion, Crochet) sirven para vender software B2B en Bolivia — los otros 4 se apoyan en IP de Pixar/Disney o en el estilo de un creador y no se pueden publicar en material de cliente.

```text
Construí una plantilla de composición HyperFrames reutilizable para el patrón "listicle sobre toma continua", extraído del reel https://www.instagram.com/p/DblhPOux1YP/ (@davidaistar). La ficha completa está en hermes-content/references/video-intake/.

ANTES DE CODEAR: leé la skill `hyperframes` (entrada), después `hyperframes-core` (contrato de composición y atributos data-*) y `editor-videos`. HyperFrames vive en `.agents/skills/` y es el motor por defecto — NO reinventes el motor de video ni uses Remotion (jubilado por decisión de Sergio el 21-ago).

EL PATRÓN, medido con ffprobe/ffmpeg sobre el original (9,866 s · 720x1280 · 30 fps · 292 fotogramas · 0 cortes con umbral scene 0.3):

Es UNA sola toma continua del presentador. No hay un solo corte. Todo el ritmo se produce sustituyendo overlays encima de un plano que nunca corta. La plantilla tiene que reproducir eso: un `<video>` de fondo que corre entero, y overlays que se sustituyen por encima.

Capas, de arriba hacia abajo, todas en posiciones FIJAS:
1. Card de título anclado a ~15% del borde superior. Rectángulo blanco #FFFFFF, esquinas redondeadas, padding generoso, texto negro #000000, grotesca muy pesada, 2 líneas, interlineado apretado, centrado. NO cambia nunca durante los ítems. Es el contrato de retención: "son N, vas a llegar al N".
2. El `<video>` del presentador, toma continua, sin cortes.
3. Rótulo del ítem `N) Nombre`: relleno blanco con contorno negro duro (`-webkit-text-stroke: 3px #000` o equivalente), SIN caja de fondo, centrado, apoyado justo encima del inset. La ausencia de caja es deliberada: lo deja flotar sobre el pecho sin tapar la cara.
4. Inset 9:16 dentro de 9:16, ~35% del ancho del cuadro, centrado horizontalmente, en la mitad inferior. Tiene que aceptar un `<video>` (los ejemplos se REPRODUCEN, no son capturas fijas). Compuesto ENCIMA sin máscara: las manos del presentador pasan por detrás, y eso es lo que hace que se lea como una imagen viva y no como un collage.
5. Dos stickers estáticos en la columna derecha del inset, para el CTA. Presentes durante todos los ítems.

Parámetros que la plantilla debe exponer como variables:
- `titulo` (el card fijo)
- `items[]`: array de `{ rotulo, insetSrc, duracionMs }` — duración POR ÍTEM, no uniforme. En el original los tiempos son desiguales: el ítem cuyo inset necesita más tiempo para leerse (un build por capas) recibe más aire. Default 950 ms.
- `stickers[]`: hasta 2, opcionales
- `cierreMs`: duración del cierre limpio. Default 1300 ms.

DOS REGLAS DE MOVIMIENTO, y son las que hacen que funcione:
- Los overlays NO se animan. Cero entrada, cero salida, cero fade, cero escala en el rótulo, el card y los stickers. Es sustitución dura. El movimiento lo aportan el inset (que es video) y el presentador. No agregues wobble ni "respiración": leé `motion-doctrine`, la prohibición de movimiento ocioso aplica.
- El cierre limpia TODOS los overlays a la vez (card, rótulo, inset, stickers) y deja la cara sola durante `cierreMs`. Es la señal visual de que viene el CTA hablado. No lo omitas: es el remate del patrón.

ENTREGABLES:
1. La composición HTML de la plantilla, en el lugar que indique `hyperframes-core`.
2. Un render de demostración con 3 ítems de prueba (usá clips o placeholders que YA existan en el repo; no generes nada pago — Higgsfield y ElevenLabs requieren permiso explícito de Sergio caso por caso).
3. Registrá el patrón en `web-factory/docs/MOTION_PATTERN_BANK_2026.md` bajo el nombre "listicle sobre toma continua", citando la ficha de video-intake como fuente.

NO HAGAS: no produzcas contenido de cliente con este molde en esta sesión, no generes nada pago, y no uses los nombres de formato "Pixar Character" ni "Disney Character" en ningún ejemplo — son IP ajena y Onia no publica material de cliente que imite marcas de estudios.

LISTO = existe un MP4 renderizado por HyperFrames, de 3 ítems con duraciones distintas entre sí, verificado con ffprobe en 0 cortes (`ffmpeg -i <salida> -vf "select='gt(scene,0.3)'" -f null -` devuelve cero detecciones), en el que el card de título permanece idéntico durante los 3 ítems y desaparece junto con el rótulo, el inset y los stickers durante el cierre limpio final — todo confirmado MIRANDO fotogramas extraídos del render, no por grep ni por que el comando haya salido con código 0.
```

## P14 · Pack de overlays 'recorte vertical ONIA' en HyperFrames

- **Ficha:** [Recorte de podcast que retiene sin cortar](../2026-08-23-cosecha-recorte-de-podcast-que-retiene-sin-cortar.md)
- **Qué falta:** Para CONSTRUIR el pack, nada: cero gasto, cero credencial, cero permiso, HyperFrames es local y gratis. Para USARLO falta metraje propio de talking-head — ONIA no tiene podcast ni archivo de camara equivalente. Y una decision chica de Sergio: la placa de cierre nuestra pide una demo en cal.onia.com.bo, que es un agendamiento 1:1, no una cita recurrente como la de ellos; el molde se porta, el objeto cambia.

```text
Objetivo unico de la sesion: construir en HyperFrames un pack de overlays de marca ONIA, reutilizable, para recortes verticales de talking-head, copiando el MECANISMO (no el color) de un reel de @niidea.tv analizado el 2026-08-23 (ficha en hermes-content/references/video-intake/, id DbJy34KhdyM).

Antes de codear: leer las skills hyperframes, hyperframes-core y hyperframes-animation. NO reinventar el motor (regla: revisar .agents/skills/ antes de escribir video). Cargar tambien editor-videos y captions-overlay.

Por que este molde importa, medido con ffprobe sobre el original: 65,364 s con 17 cortes detectados, pero 11 de esos 17 caen dentro de 0,7 s al final (la transicion a la placa). El cuerpo real son 58 s con 6 detecciones, probablemente 3 o 4 transiciones. Es casi un plano secuencia y aun asi retiene: la retencion la sostiene el TEXTO, no el montaje. Ese es el punto que copiamos.

Construir CINCO piezas como composiciones HTML independientes y parametrizables (texto por variable, nada hardcodeado):

1. BUG DE MARCA. Dos logos fijos en las esquinas superiores, uno a cada lado. Nunca se mueven, nunca se animan, viven todo el clip. Usar el tile verde de Onia ya decidido y publicado (memoria: onia-logo-tile-verde-decidido).

2. BARRA DE TITULO QUE SE CONSTRUYE. Caja blanca ~95% opaca con texto negro en grotesca pesada condensada, mayusculas, dos lineas centradas, ancho ajustado a la linea mas larga. Se arma en ~0,5 s en este orden: se traza una linea horizontal, aterriza la linea 1, aterriza la linea 2 y la caja crece hacia abajo. Entra a los 0,5 s, sale a los ~5,8 s. Va en una ranura a ~70% de altura. Motivo: un recorte no controla su primer segundo de audio, asi que la promesa va ESCRITA. El copy debe ser tres verbos en imperativo voseo con promesa doble; en el original era 'LOS PANELES SOLARES: GENERA, VENDE AL SISTEMA Y PAGA MENOS'.

3. KARAOKE DE UNA PALABRA. Misma ranura vertical que la barra de titulo (compiten a proposito: mientras el titular esta, el karaoke se OCULTA, no se corre). Una palabra por vez, centrada, reemplazo DURO sin fundido. Relleno naranja/acento con contorno-sombra oscura para leerse sobre cualquier fondo. Regla dura: cuando no hay voz, la ranura queda VACIA, jamas repite la ultima palabra.

4. ZOCALO TEMPORIZADO. Barra chica con degradado y texto blanco, ~4 s, y se dispara MONTADA SOBRE UN CORTE de camara: el corte justifica el grafico. En el original decia 'E$B 21:00 Mie'; el nuestro lleva la marca y el llamado.

5. PLACA DE CIERRE. Entra con un flash-cut estroboscopico de 0,7 s (la unica transicion fuerte de todo el video, reservada para el momento en que se pide la accion), se queda ~7 s en fijo y termina con fundido de salida. Degradado de marca con grano encima. Contenido: logo Onia + 'Agenda tu demo' + cal.onia.com.bo. Es un agendamiento 1:1, NO una cita recurrente: el molde se porta, el objeto cambia (decision 2026-08-23, el lead magnet es la demo).

Ademas del pack, dejar un push-in continuo lentisimo aplicable al plano fijo (scale progresivo, la unica fuente de movimiento durante decenas de segundos). Cero wobble, cero movimiento ocioso.

Prohibiciones: la placa y la barra NO pueden decir 'muy pronto', 'beta', 'proximamente' ni nada de estado de obra (regla: la venta nunca exhibe obra). NO inventar testimonios, logos ni cifras de clientes (regla: no fabricar, cero clientes pagando). Nada de gasto: HyperFrames es local y Apache 2.0, no tocar Higgsfield ni ElevenLabs.

RENDER Y VERIFICACION: renderizar a 1080x1920 sobre un clip de prueba propio; si no hay metraje de talking-head disponible, generar una placa de color con temporizador como base y decirlo explicito, no simularlo con material ajeno. Antes de aplicar cualquier corte sobre metraje real, mostrar a Sergio la tabla de tiempos y un preview a 360p (REGLA DE ORO: nunca cortar a ciegas). Guardar las piezas donde corresponda segun la tabla de CLAUDE.md y NO dejar nada suelto en la raiz. Al cerrar, escribir el handoff en .claude/handoff/<rama-con-guiones>.md con los 7 campos, incluido 'intentos fallidos'.

LISTO = existe un MP4 de 1080x1920 renderizado con HyperFrames que, abierto y MIRADO (no un grep, no un exit code 0), muestra las cinco piezas funcionando: bugs fijos en ambas esquinas superiores durante todo el clip, barra de titulo de dos lineas que se construye linea por linea y sale a los ~5,8 s, karaoke de una palabra con reemplazo duro y ranura vacia en los silencios, zocalo temporizado disparado sobre un corte, y placa de cierre que entra por flash de 0,7 s y dice cal.onia.com.bo; mas las cinco composiciones HTML parametrizables commiteadas y el patron 'barra de titulo que se construye linea por linea' agregado a web-factory/docs/MOTION_PATTERN_BANK_2026.md.
```

## P15 · Patrón «contador escalado»: overlay reutilizable de 13 s para reels de Onia

- **Ficha:** [Contador escalado en una sola toma](../2026-08-23-cosecha-contador-escalado-una-sola-toma.md)
- **Qué falta:** Técnicamente nada — la herramienta existe y está probada. Faltan dos cosas de contenido y una es bloqueo real: (1) un presentador HUMANO que sostenga 13 s en una sola toma con progresión de energía; Lucía/Higgsfield NO sirve (clips de 5-10 s, sin control de micro-actuación progresiva), esto va con Sergio a cámara o no va; (2) decidir QUÉ cuenta el contador: con cero clientes pagando, la regla «no fabricar» prohíbe mostrar métricas propias o de cliente, así que hay que usar placeholders o una magnitud verificable y neutra (segundos de una tarea, cantidad de pasos, minutos de agenda). Decisión de Sergio antes de grabar.

```text
Objetivo único de esta sesión: dejar construido y documentado el patrón de overlay «contador escalado + stack acumulativo», portado del reel https://www.instagram.com/p/DcJivjZOOth/ (@bastian.xu), para que cualquier reel de Onia lo use sin volver a diseñarlo. No abras ningún otro frente.

DATOS MEDIDOS — usalos, no los re-estimes:
- Original: 13,116 s · 720x1280 · 30 fps · 390 frames · 0 cortes detectados (umbral scene 0.3). Cámara fija, una sola toma.
- Mapa de beats leído del muestreo denso a 4/s:
  0,00-1,50 s  → "24 Views"
  1,50-3,25 s  → "384 Views"  + "+ postura"
  3,25-4,75 s  → "1,685 Views" + "+ postura" / "+ cara"
  4,75-7,25 s  → "84,284 Views" + "+ postura" / "+ cara" / "+ tono"
  7,25-9,75 s  → "335,284 Views" + "+ postura" / "+ cara" / "+ tono" / "+ gestos"
  9,75-13,12 s → "1 View" (colapso; es el beat MÁS LARGO, ~3,4 s)
- La lista es ACUMULATIVA: cada ítem se apila debajo, nada se reemplaza.
- El texto entra por CUT-IN SECO. En un muestreo a 4/s no hay un solo fotograma de transición: sin fade, sin slide, sin escala, sin rebote. CERO motion gráfico. Si animás la entrada, rompiste el patrón.

LAYOUT (medido sobre fotograma 1080x1920):
- Número: blanco #FFFFFF, peso Bold, ~60 px de alto (~3,1% de la altura), centrado horizontalmente, línea base al ~56% de la altura del cuadro.
- Ítems: verde ~#2ECC2E, peso Regular/Medium, ~40 px (~2/3 del número), alineados a la IZQUIERDA con sangría de ~6% del ancho respecto del borde izquierdo del número. Interlineado ~1,2 em.
- Tipografía: neogrotesco (Inter / Helvetica Now Display / SF Pro Display). La del original no se declara.
- REGLA DE COLOCACIÓN: el bloque va sobre la ZONA OSCURA del torso del sujeto, nunca sobre el fondo claro. Por eso NO lleva caja, ni barra, ni sombra dura: el contraste lo da la ropa. Si el take no tiene zona oscura a esa altura, movés el bloque, no le ponés fondo.

QUÉ CONSTRUIR:
1. Composición HyperFrames `contador-escalado.html`, parametrizada por un array de beats `{ t_inicio, t_fin, numero, items[] }`, que renderice el overlay quemado sobre un clip vertical 1080x1920. Usá el timing por atributos `data-*`. LEÉ LAS SKILLS `hyperframes` (entrada), `hyperframes-core` y `hyperframes-cli` ANTES de escribir una línea de HTML — no reinventes el motor.
2. Documentá el patrón en `web-factory/docs/MOTION_PATTERN_BANK_2026.md` bajo el nombre «contador escalado + stack acumulativo», con el mapa de beats de arriba, la regla de colocación sobre zona oscura, y la nota de loop bait: la pose final del sujeto debe ser igual a la del fotograma 0 para que el autoloop de Instagram empalme sin salto.
3. Si el orquestador no la dejó ya, guardá la ficha de origen en `hermes-content/references/video-intake/`.

RESTRICCIÓN DURA DE ONIA — leela antes de elegir los números:
Onia tiene CERO clientes pagando. La regla «no fabricar» prohíbe inventar cifras, testimonios o resultados. El contador NO puede mostrar métricas de Onia ni de un cliente. Dejá `{{NUMERO}}` como placeholder en la plantilla, o usá una magnitud verificable y neutra (segundos que tarda una tarea, cantidad de pasos, minutos de agenda). Si dudás, dejá placeholders y preguntá a Sergio — no elijas vos.
REGLA DE ORO DE VIDEO: mostrá a Sergio la tabla de beats + un preview 360p ANTES de quemar nada definitivo.
No agregues "muy pronto", "beta" ni estado de obra en ninguna superficie que vaya a ver un cliente.

LISTO = `contador-escalado.html` renderiza con la CLI de HyperFrames un MP4 de 1080x1920 y ~13,1 s; los fotogramas extraídos con ffmpeg en t = 1,0 / 2,5 / 4,0 / 6,0 / 9,0 / 11,0 s muestran SEIS estados distintos del overlay (número + su stack de ítems acumulado, 0/1/2/3/4/0 ítems respectivamente), el último beat dura >= 3 s, y `web-factory/docs/MOTION_PATTERN_BANK_2026.md` contiene la entrada «contador escalado + stack acumulativo» con el mapa de beats y la regla de colocación sobre zona oscura.
```

---

# Lote del 2026-08-24 — 1 prompts

> Fuente: [`prompts-lote-2026-08-24/`](../prompts-lote-2026-08-24/README.md). **Sin audio**:
> Speaches falló en todo el lote.

## Q05 · El skill /watch: fotogramas + transcripción, y por qué el nuestro se rompió hoy

- **Ficha:** [El skill /watch: fotogramas + transcripción, y por qué el nuestro se rompió hoy](../2026-08-24-skill-watch-fotogramas-mas-transcripcion.md)
- **Qué falta:** Una API key de Groq (free tier). Nada más: yt-dlp y ffmpeg ya están.

```text
Objetivo único: que la transcripción del carril de video deje de depender de Speaches en el VPS, agregando Groq como respaldo automático.

POR QUÉ, con el fallo medido: el 2026-08-23 se transcribieron 26 videos de la cosecha del DM y `transcribe.sh` devolvió {"ok":false,"error":"fetch failed"} en TODOS — primero con 3 en paralelo y después de a uno. `curl /v1/models` en el VPS respondía OK. Resultado: un lote entero analizado sin audio. El camino actual hace scp del mp3 + ssh al VPS, así que cualquier hipo de red o de carga lo tumba.

Referencia externa (no copiar código, solo la decisión): el skill público `bradautometes/claude-video` resuelve lo mismo con yt-dlp + ffmpeg + Groq, y declara 5 horas de video transcritas por ~39 centavos, con free tier de 2 h por hora.

Pasos:

1) Worktree propio, `git branch --show-current` antes de tocar nada.

2) En `.claude/skills/ver-videos/scripts/transcribe.sh`, agregar un TERCER camino después de los dos que ya existen (host del VPS, y red interna de onia-center): si ambos fallan y hay `GROQ_API_KEY` en el entorno, mandar el audio a la API de Groq (modelo whisper-large-v3-turbo) por HTTPS directo, sin scp ni ssh.

3) Mantener el MISMO contrato de salida que ya consume el resto del carril: {ok, model, duration, n_segments, n_words, segments[], words[]}. Si cambia el shape, se rompen preparar.sh y las fichas.

4) Respetar la trampa ya registrada: NO forzar el idioma (va ONIA_AUDIO_STT_LANGUAGE=auto). Forzarlo hace que traduzca en vez de transcribir.

5) Agregar una guarda que ya nos costó caro: si la respuesta trae duration=0 y 0 segmentos, eso NO es "sin voz", es fallo — devolver ok:false con el error. Hoy 25 de 26 videos se reportaron como SIN_VOZ cuando en realidad la llamada había fallado, y la pista fue justamente duration=0.

6) Probar contra un video con voz confirmada y contra uno sin voz, y dejar los dos resultados escritos en el commit.

LISTO = `bash transcribe.sh <audio.mp3>` devuelve un JSON válido con segmentos aunque el VPS esté caído, y un video mudo devuelve ok:true con 0 segmentos y duration > 0 (no 0).
```

## R06 · Earshot: un teleprompter que corrige el tono, no solo pasa el texto

- **Ficha:** [Earshot: un teleprompter que corrige el tono, no solo pasa el texto](../2026-08-28-earshot-teleprompter-que-corrige-tono.md)
- **Qué falta:** Verificar la app: plataforma, precio, y si soporta español. Nada de eso se dice en pantalla.

```text
Objetivo único: resolver el cuello de botella de grabar a cámara — evaluar Earshot y, si no sirve, definir el sustituto.

De dónde sale: ficha `earshot-teleprompter-que-corrige-tono` (IG DchUUX3BNKn).

Lo que hace distinto y está leído de pantalla: las palabras del guion flotan alrededor de la cara y están coloreadas por función — palabra actual, subir tono, bajar tono, ya dicha, pausa acá. Controles de ritmo objetivo (215 WPM) y coaching en vivo ("Pace is right on the beat", "Lift the last word — more coming", "Land it, then breathe"). Óvalo punteado que guía el encuadre.

Contexto nuestro: el guion ya lo sabemos generar. Lo que falta es que Sergio suene natural leyéndolo, y eso es lo que ataca esta app.

Pasos:

1) Verificar la app, porque el reel NO dice nada de esto: plataforma (iOS/Android), precio, y sobre todo si funciona EN ESPAÑOL. Un teleprompter que corrige entonación en inglés no nos sirve.

2) Si no sirve o no existe en español, buscar dos alternativas con la misma característica clave: no basta con que pase texto, tiene que marcar ritmo y entonación.

3) Probarla de verdad con un guion nuestro. Grabar la misma pieza dos veces: una leyendo como siempre, otra con la app. Comparar cuántas tomas hicieron falta y cuál suena mejor. Sin esa comparación, es una opinión.

4) Si funciona, integrarla al flujo: el guionista entrega el guion YA marcado con las pausas y los énfasis que la app espera. Documentar el formato de entrega en la skill editor-videos.

5) Anotar el costo. Si es de pago, es gasto y va con permiso — pero es de los baratos y de los que se amortizan rápido.

LISTO = un veredicto escrito sobre la app (sirve / no sirve / no existe en español) con precio y plataforma verificados, la comparación de las dos grabaciones, y el formato de guion marcado documentado si se adopta.
```
