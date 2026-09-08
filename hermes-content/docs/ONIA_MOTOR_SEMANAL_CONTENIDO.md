# El motor semanal — un tema, seis días, tres puertas

> Sergio Urcullo, 2026-09-08. Dos decisiones tomadas:
> **1.** «La semana construye la guía».
> **2.** *"Todos los días, un repo, una skill, una habilidad, curiosidades… ¿eso es aparte
> a la comunidad o cómo lo podemos hacer que sirva para los dos?"*
>
> Este documento contesta la segunda. Fuente única del **ritmo de producción**.

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
| «este repo te arma un panel del servidor» | el comando exacto, dónde pegarlo, y qué mirar si falla |
| «Claude puede armar PDFs solo» | la habilidad escrita entera, para copiar |
| «casi rompo todo con esto» | qué hice mal, cómo se ve el error, cómo se sale |

Un video de treinta segundos no puede dar un comando: nadie lo tipea del video. El drop sí.
**Nadie tiene que producir dos contenidos — hay que contar lo mismo dos veces, a distinta
profundidad**, y eso es media hora, no otro día de trabajo.

## Y la guía del domingo tampoco se escribe de cero

**Es el pegado de los seis drops, ordenados y limpiados.** El trabajo duro ya está hecho de
lunes a sábado; el domingo se junta, se le agrega el bloque de «qué no hace» de cada cosa y
se publica.

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
