# El motor semanal — un tema, seis días, tres puertas

> 📍 **Índice del carril, con qué documento manda sobre qué:**
> [`ONIA_CIRCUITO_DE_CONTENIDO.md`](ONIA_CIRCUITO_DE_CONTENIDO.md) — y la misma
> estructura para consultar de un vistazo en
> <https://claude.ai/code/artifact/fb52b4b9-4504-4b8a-afca-46cf2a8f9586>

> Sergio Urcullo, 2026-09-08. Dos decisiones tomadas:
> **1.** «La semana construye la guía».
> **2.** *"Todos los días, un repo, una skill, una habilidad, curiosidades… ¿eso es aparte
> a la comunidad o cómo lo podemos hacer que sirva para los dos?"*
>
> Este documento contesta la segunda. Fuente única del **ritmo de producción**.
>
> 🔴 **Dónde se publica cada cosa y qué queda exclusivo de la comunidad manda desde**
> [`ONIA_DONDE_VA_CADA_COSA.md`](ONIA_DONDE_VA_CADA_COSA.md). Si algo de acá lo
> contradice, gana ése.
>
> 👉 **De dónde sale lo que se graba** —el backlog de temas, con cuáles dan para una
> semana y cuáles para una sola pieza— en [`ONIA_MAPA_DE_TEMAS.md`](ONIA_MAPA_DE_TEMAS.md).
> Ahí está también el papel de **YouTube**, que no estaba contemplado acá.

## La cuenta que hay que mirar primero

Un video por día son **30 videos al mes**. Una guía completa —como la del stack o la del
homelab— cuesta **horas**, no minutos. Así que **no puede haber una guía por video**, y
tampoco hace falta: son dos cosas de tamaño distinto.

**La salida es que haya dos tipos de video, y que sólo uno prometa un recurso.**

| | Video diario | Video de la semana |
|---|---|---|
| **Cuántos** | 6 por semana | 1 |
| **Qué muestra** | un repo, una skill, una curiosidad | el tema entero, resuelto |
| **CTA** | «entrá a la comunidad» | **«comentá PALABRA»** |
| **Deuda que genera** | ninguna | una guía, que **ya tiene que existir** |

El video diario no promete nada descargable, así que **nunca te deja debiendo**. El único
que promete es el de la semana, y para ese momento la guía ya está publicada.

---

## Cómo se mueve una semana

Un solo tema por semana. Los seis días son **ángulos distintos del mismo tema**, no seis
temas sueltos — y ahí está el truco: seis piezas sobre lo mismo **se suman solas** en una
guía el domingo.

```
        VIDEO (Instagram)          DROP (comunidad)              WEB
        30 seg, el qué             el cómo, con el comando       ─
LUN     el repo que encontré   →   qué es + cómo se instala
MAR     la skill que hice      →   la skill entera, para copiar
MIÉ     el error que cometí    →   por qué pasa y cómo se evita
JUE     el segundo paso        →   el paso con sus detalles
VIE     una curiosidad         →   de dónde sale y para qué sirve
SÁB     lo que preguntaron     →   las respuestas, una por una
                                                          ─────────
DOM                                                       la GUÍA
                                                          (todo junto,
                                                           ordenado)

LUN siguiente ── video que promete la guía del domingo ──► «comentá X»
```

**El video de la semana va el lunes siguiente, no el domingo.** Cuando sale, la guía lleva
un día publicada y el link funciona. Es imposible que se repita lo del homelab.

## Por qué el drop no es el video con otras palabras

Es la pregunta que hiciste: *si el video ya lo cuenta, ¿para qué el drop?*

Porque **son la misma cosa a dos profundidades**, y la de abajo no entra en un video:

| El video muestra | El drop entrega |
|---|---|
| «este repo te arma un panel del servidor» | **el `docker-compose` armado**, para pegar |
| «Claude puede armar PDFs solo» | **la habilidad escrita entera**, para copiar |
| «casi rompo todo con esto» | qué salió mal, cómo se ve el error y cómo se sale |

🔴 **El drop entrega el ARCHIVO, no un resumen.** Ésa es la parte que no va nunca a la web
abierta y es lo que hace que estar adentro valga. Un drop que sólo explica es un video con
más letras. Ver [`ONIA_DONDE_VA_CADA_COSA.md`](ONIA_DONDE_VA_CADA_COSA.md).

Un video de treinta segundos no puede dar un comando: nadie lo tipea del video. El drop sí.
**Nadie tiene que producir dos contenidos — hay que contar lo mismo dos veces, a distinta
profundidad**, y eso es media hora, no otro día de trabajo.

## Y la guía del domingo tampoco se escribe de cero

**Es el pegado de los seis drops, ordenados y limpiados.** El trabajo duro ya está hecho de
lunes a sábado; el domingo se junta, se le agrega el bloque de «qué no hace» de cada cosa y
se publica.

⚠️ **Con una diferencia, y es la que sostiene a la comunidad:** a la guía pública le entran
el qué, el porqué y el orden — **no los archivos armados**. Ésos se juntan en
`/tema/archivos`, cuyo link se pasa sólo en Announcements. La guía enseña a hacerlo; los
archivos lo tienen hecho.

Ésa es la razón de que los seis días sean del mismo tema. Seis temas sueltos no se pegan.

## Ejemplo de una semana entera

Tema: **el panel del servidor** (lo que sigue naturalmente a la guía del homelab).

| Día | Video | Drop |
|---|---|---|
| Lun | «tu servidor sin escribir un comando» | qué es Dockge y por qué no Portainer |
| Mar | el comando de instalación, en pantalla | el `docker-compose`, para pegar |
| Mié | «esto casi me borra un contenedor» | qué botón no tocar y por qué |
| Jue | ver los registros sin terminal | dónde mira uno cuando algo falla |
| Vie | curiosidad: cuánta RAM se come | cómo medirlo en tu máquina |
| Sáb | respondiendo lo que preguntaron | las respuestas, una por una |
| **Dom** | — | **`/panel` publicada en la web** |
| Lun+1 | **«comentá PANEL y te la paso»** | ya existe: el link funciona |

## Los tres tipos de pieza, y cuál puede prometer

Sergio Urcullo, 08-sep: *"el contenido para la comunidad que quede fijado, el de los videos
que yo improvise lo hacemos y lo subimos a la web, y decimos por historias que se unan a la
comunidad"*. Eso cierra bien, con una condición.

| Pieza | ¿Se planifica? | ¿Promete recurso? | CTA |
|---|---|---|---|
| **Video de la semana** | sí | **sí** — y ya está publicado | «comentá PALABRA» |
| **Video improvisado** | no | 🔴 **NO** | «entrá a la comunidad» |
| **Historia** | no | no | «entrá a la comunidad» |

🔴 **Lo improvisado no puede prometer.** Si grabás algo sin planear y decís *"comentá X y te
lo paso"*, el recurso no existe — que es exactamente lo que pasó con el homelab. Un video
improvisado se puede hacer todos los días, pero su cierre es **la comunidad**, no una
palabra.

**Y el improvisado que funciona, asciende.** Si un video suelto explota, ése es el tema de
la semana siguiente: se escriben los seis drops, sale la guía el domingo, y recién ahí se
graba el video con palabra que la promete. El improvisado descubre el tema; el planificado
lo cobra.

## El carril personal y el B-roll no rompen el tema semanal

> Sergio Urcullo, 2026-09-21: además de enseñar, la cuenta necesita videos personales
> sobre problemas reales de las redes, motivación con sustancia y espacios planificados
> para B-roll.

El tema técnico semanal organiza la investigación, los drops, la guía y YouTube. **No
obliga a que toda la personalidad de la cuenta hable de lo mismo.** Cada día se reserva un
Trial V2 para una pieza personal o de criterio. Esa pieza puede partir de algo vivido esa
semana aunque no pertenezca al tutorial técnico.

### Fórmula del video personal

1. **Situación concreta:** qué pasó o qué problema apareció.
2. **Tensión honesta:** qué costó, confundió o salió mal.
3. **Criterio propio:** qué entendió Sergio Urcullo y por qué.
4. **Acción:** qué puede hacer hoy quien lo mira.

Ejemplos de territorio: medir progreso por vistas en vez de habilidades · ser joven y
tener que demostrar con trabajo · publicar aunque una pieza falle · vender IA sin prometer
imposibles · diferenciar disciplina de entusiasmo · construir una red antes de necesitarla.

### Biblioteca de B-roll

Una sesión presencial o una jornada de trabajo debe dejar **12–20 planos verticales** de
5–12 segundos: llegada, preparación de sala, laptop, pantalla de n8n/Claude, manos,
pizarra, conversación, reacción del público, cierre y desmontaje. Esos planos alimentan
la semana siguiente con voz en off técnica o personal.

- El B-roll muestra trabajo o relación real; no simula reuniones ni éxito.
- Toda persona reconocible da permiso antes de usarse públicamente.
- El audio principal se graba aparte; el plano no tiene que cargar toda la explicación.
- Después de tres piezas de B-roll, el cuarto espacio del feed se reemplaza por carrusel.
- El B-roll y el video personal no prometen una palabra clave salvo que el entregable ya
  exista.

## Al que comenta: el link Y la comunidad, en ese orden

La duda de Sergio Urcullo: *"¿les envío el enlace de la comunidad, pero también les envío el
link?"*. **Las dos cosas, en el mismo mensaje, y el orden no es un detalle.**

> **Primero se paga la deuda, después se ofrece.**

```
1 · el link del recurso      ← es lo que prometiste. Va primero, sin condiciones.
2 · la invitación            ← es lo que ofrecés. Va después, y es opcional.
```

🔴 **Lo que NUNCA hay que hacer: condicionar.** *"Entrá a la comunidad y ahí te paso la
guía"* convierte algo ya prometido en un peaje. El que comentó cumplió su parte; cobrarle
un paso más se lee como estafa chica, y esa persona no vuelve a comentar nunca.

Dando el link primero, la invitación funciona **mejor**, no peor: ya recibió algo y ya sabe
qué clase de material das.

### El mensaje, listo para pegar

```
Gracias por comentar. Acá está la guía completa:

[LINK]

Está todo: qué hace cada cosa, qué NO hace, y el paso a paso
para instalarla. Es gratis y no pido nada a cambio.

Una sola cosa: las guías las subo primero a mi comunidad de
WhatsApp, con los archivos ya armados y donde podés preguntar
por tu caso. También es gratis. Si querés entrar, decime
"comunidad" y te paso el enlace.
```

**Por qué "decime comunidad" y no el enlace directo:** un enlace de grupo que circula suelto
termina en cualquier lado. Pedir una respuesta más filtra a quien de verdad quiere entrar —
y son dos segundos, no una barrera.

### En historias, al revés

La historia **no está pagando ninguna deuda**, así que ahí sí el CTA es directo a la
comunidad: *"respondé COMUNIDAD y te paso el enlace"*. Es el molde que ya usan las piezas
verdes del lanzamiento (`comunidad/ESTADO_COMUNIDAD.md`, IMG-COM-002).

## Lo que hay que decidir antes de arrancar

- **El tema de la semana se elige el domingo anterior**, no el lunes a la mañana. Sin tema
  fijado, los seis días salen sueltos y el domingo no hay guía que armar.
- **La palabra de la semana se decide junto con el tema.** `PANEL`, `PROMPTS`, `HOMELAB`.
- **Los seis videos se pueden grabar en una sola sesión.** Es el mismo tema, la misma ropa
  y la misma pantalla: grabarlos de a uno por día cuesta seis veces más.

## ⚠️ Lo que hay que decir aunque no guste

**Seis videos por semana con una persona es mucho, y el que se cae primero es el drop.**
Cuando la semana se complica, lo que se salta es lo de la comunidad — que es justo lo que
nadie ve desde afuera y lo que más rápido se nota adentro.

Si hay que recortar, recortá videos, **no drops**. Cuatro videos y seis drops sostienen la
comunidad; seis videos y tres drops la vacían. La guía del domingo se arma igual con cuatro
piezas.

## Lo que NO hay que hacer

- **Prometer una palabra en un video diario.** Los diarios no prometen. Si todos prometen,
  todos generan deuda y ninguna se paga.
- **Cambiar de tema a mitad de semana.** El domingo no habría guía, y la semana entera se
  vuelve seis videos sueltos.
- **Publicar la guía antes del sábado.** Si sale antes, la comunidad pierde su ventaja de
  llegar primero — que es una de las tres cosas que la hacen valer
  ([`ONIA_COMUNIDAD_QUE_LA_HACE_VALER.md`](ONIA_COMUNIDAD_QUE_LA_HACE_VALER.md)).
- **Grabar sin haber escrito el drop.** El drop es el que tiene el detalle; si el video sale
  primero, el drop termina siendo un resumen del video en vez de su profundidad.

## Cómo encaja con lo que ya está andando

La serie **D0–D6** cierra el martes 08-sep y después hay puente hasta el domingo 13. La
**semana 2 arranca el lunes 14** con siete drops ya escritos en `ONIA_COMUNIDAD_CONTENIDO.md`
— ésa es la primera semana que puede correr con este motor, si se le elige un tema común y
se le arma la guía del domingo 20.

Los recursos ya publicados —[`/stack`](https://sergiourcullo.vercel.app/stack) y
[`/homelab`](https://sergiourcullo.vercel.app/homelab)— **sirven para prometerse otra vez**.
Una guía buena no se gasta en un solo video: se puede prometer desde ángulos distintos
durante meses.
