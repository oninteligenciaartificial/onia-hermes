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
