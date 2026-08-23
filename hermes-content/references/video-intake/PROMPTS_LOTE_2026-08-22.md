# Prompts del lote del 2026-08-22 — M1 a M5, y N1 a N3

**Dos tandas.** La primera, 14 items (**9 `SIRVE YA`**, el mejor rendimiento del corpus) → M1–M5.
La segunda, un item suelto mandado aparte → **N1–N3, al final de este archivo**.

Síntesis de la primera: [2026-08-22-sintesis-lote-14.md](2026-08-22-sintesis-lote-14.md) ·
datos: [analisis/2026-08-22-items.json](analisis/2026-08-22-items.json)

| Sesión | Prompt | Orden |
|---|---|---|
| **`pendiente`** (método) | **N1** el estándar `HANDOFF.md` en el repo | **primero de todo el día** — cierra una regla del CLAUDE.md sin artefacto |
| **`INFLUENCERS IA`** | **M1** la arquitectura de bloques con nombre + la sobrecobertura | primero de la tanda M |
| **`editor de videos`** | **M2** editar metraje real por prompt · **M3** el carrusel que vende · **N2** el kit de sobreimpresión | M2 → M3 → N2, **nunca en paralelo entre sí** |
| **`web-factory`** | **M4** los 5 estilos de footer | independiente |
| **marketing** | **M5** la escalera 0→10 sobre correos de bienvenida · **N3** el molde de 6 actos | independientes |

---

## Los dos hallazgos que cambian cómo escribimos prompts de video

**1 · Bloques con NOMBRE, y cada uno es una REGLA — no una descripción.** Un prompt recuperado
literal de pantalla usa siete: `[STYLE]` · `[MODE — READ THIS FIRST]` · `[THE OBJECT]` ·
`[DISTRESS RULE]` · `[TEXT RULE — MANDATORY]` · `[HANDS RULE]` · `[BEATS]`. Los nombres en
mayúsculas entre corchetes ordenan la lectura del modelo.

**2 · Pedir SOBRECOBERTURA a propósito.** Esto no estaba en el banco:

> *"Fast-cut montage. I am cutting it myself in post. **Deliberately overload it — more shots
> than fit, extra angles I did not ask for, alternate coverage of every beat, inserts,
> overshoots, impact frames. Every beat is a new shot. Nothing holds.**"*

Es **lo contrario** de pedir la toma exacta: se pide una hoja de contactos y se corta después.

**Y el arreglo del texto en IA:** en vez de pelear porque el modelo no sabe escribir, se le pide
que **no escriba**:

> *"`[TEXT RULE — MANDATORY]` Abstract invented serif forms and a numeral in an oval, not any
> existing brand name… **They read as typographic shapes, never as language. Legibility not
> required at any point.**"*

---

# INFLUENCERS IA

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

# EDITOR DE VIDEOS

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

# WEB FACTORY

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

# MARKETING

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
---

# Segunda tanda del 22-ago — N1 a N3

Un item suelto, mandado aparte: [DbT8hWPsyjN](https://www.instagram.com/reels/DbT8hWPsyjN/) de
[@juanaia_](https://www.instagram.com/juanaia_/) — el documento `handoff.md`.
Ficha completa: [2026-08-22-handoff-context-rot.md](2026-08-22-handoff-context-rot.md) ·
[verbatim](transcripciones/Instagram-DbT8hWPsyjN.md).

**Es el primer item del corpus que no toca un producto: toca cómo trabajamos.**

| Sesión | Prompt | Orden |
|---|---|---|
| **`pendiente`** (método) | **N1** el estándar `HANDOFF.md` en el repo | **primero** — cierra una regla del CLAUDE.md que lleva semanas sin artefacto |
| **`editor de videos`** | **N2** el kit de sobreimpresión: terminal falsa + chip de glosario + subtítulos en dos registros | después de N1, no en paralelo con N2 de la primera tanda |
| **marketing** | **N3** el molde de 6 actos con el acto 2 largo | independiente |

---

# PENDIENTE — método

## N1 · El estándar `HANDOFF.md` — la regla que nunca se volvió archivo

```text
Sesion: pendiente (metodo). git branch --show-current primero.

Contexto: un reel ensena a cerrar la sesion de Claude Code escribiendo un handoff.md con 5
campos fijos, en vez de confiar en /compact. Ficha con el analisis y las verificaciones:
hermes-content/references/video-intake/2026-08-22-handoff-context-rot.md

LOS 5 CAMPOS, literales de la pantalla del video:
  1) Objetivo
  2) Estado en que termino
  3) Archivos y cambios
  4) Intentos fallidos        <- el que casi nadie escribe y el que mas vale
  5) Proximos pasos

POR QUE ESTO NO ES UNA IDEA NUEVA SINO UNA DEUDA NUESTRA:
CLAUDE.md linea 102 YA dice "Al cerrar la sesion, dejar el estado escrito: que quedo en
produccion, que quedo a medias y donde, y que depende de Sergio". Esa regla existe hace
semanas y NUNCA se convirtio en un archivo con plantilla. El video aporta exactamente la
plantilla que le falta.

LO QUE YA ESTA INSTALADO (verificado leyendo los archivos, confirmalo vos igual):
  - ~/.claude/commands/save-session.md  y  resume-session.md   -> escriben en ~/.claude/session-data/
  - ~/.claude/skills/context-save/      y  context-restore/    -> escriben en ~/.gstack/sessions/
Las CUATRO escriben FUERA del repo. Ese es el problema: el estado no se commitea, no viaja,
no lo ve otra maquina y no lo ve otro carril. El aporte del video es que el archivo vive EN EL
REPO.
Y `grep -i handoff` en onia-hermes hoy solo devuelve las skills de video (handoff de
movimiento entre escenas, otro sentido). No existe handoff de sesion.

Tarea:
1. VERIFICA VOS PRIMERO las 4 herramientas de arriba. Si alguna ya escribe dentro del repo,
   el analisis se equivoco: decilo y pará. Si confirmas que todas escriben afuera, seguí.
2. Decidi UNA sola cosa y escribila: reusamos save-session cambiandole el destino, o creamos
   HANDOFF.md propio. NO construyas un quinto mecanismo al lado de los cuatro que ya hay —
   ese es el error mas caro del preambulo y ya lo cometimos con otros temas.
3. Define el formato uniendo los 5 campos del video con los 3 de CLAUDE.md linea 102. No son
   incompatibles: los de CLAUDE.md son mas especificos de ONIA (que quedo EN PRODUCCION, que
   depende de Sergio) y los del video son mas completos sobre el trabajo (intentos fallidos).
   El resultado tiene que ser UNA lista, no dos pegadas.
4. RESOLVE EL CHOQUE DE CARRILES, que el video no tiene porque el es una persona sola: aca
   trabajamos con un worktree por carril y varios a la vez. Un HANDOFF.md en la raiz de cada
   worktree choca al mergear a main. Decidi donde vive para que dos carriles abiertos no se
   pisen, y respetá "nada suelto en la raiz" de la tabla de CLAUDE.md seccion 4.
5. Escribi el HANDOFF de ESTA tarea usando el formato que definiste. Si el formato no sirve
   para su propio cierre, esta mal.
6. Actualiza CLAUDE.md linea 102 para que apunte al artefacto, en vez de pedir "el estado
   escrito" en abstracto. Editá esa regla; no agregues una regla nueva abajo.

EVIDENCIA PROPIA QUE VALE MAS QUE EL VIDEO: la sesion de analisis de reels se compacto hoy.
El resumen que volvio traia el historial entero — cada error, cada correccion, cada metodo
descartado — con el mismo peso que el estado actual. Fiel y larguisimo. La diferencia con un
handoff no es el tamano: es que alguien ELIGE que importa. Un resumen no elige.

OJO CON LA AFIRMACION DEL VIDEO: el audio dice que /compact "arrastra toda la conversacion
vieja". Eso es FALSO — la compactacion resume y reemplaza. El caption del mismo post lo dice
bien: "comprime la basura, no la saca". No repitas la version del audio en ningun doc nuestro.

LISTO = un HANDOFF escrito con el formato nuevo, en la ubicacion decidida, que no choca entre
carriles; CLAUDE.md linea 102 apuntando a el; y la decision escrita de si reusa save-session o
no. Sin un quinto mecanismo huerfano.
```

---

# EDITOR DE VIDEOS

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

# MARKETING

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
