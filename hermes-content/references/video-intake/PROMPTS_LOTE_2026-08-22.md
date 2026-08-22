# Prompts del lote del 2026-08-22 — M1 a M5

14 items. **9 salieron `SIRVE YA`** — el mejor rendimiento del corpus.
Síntesis: [2026-08-22-sintesis-lote-14.md](2026-08-22-sintesis-lote-14.md) ·
datos: [analisis/2026-08-22-items.json](analisis/2026-08-22-items.json)

| Sesión | Prompt | Orden |
|---|---|---|
| **`INFLUENCERS IA`** | **M1** la arquitectura de bloques con nombre + la sobrecobertura | **primero** |
| **`editor de videos`** | **M2** editar metraje real por prompt · **M3** el carrusel que vende | M2 primero |
| **`web-factory`** | **M4** los 5 estilos de footer | independiente |
| **marketing** | **M5** la escalera 0→10 sobre correos de bienvenida | independiente |

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
