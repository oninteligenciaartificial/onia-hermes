# Qué hace valer la comunidad si el contenido es público

> 📍 **Índice del carril, con qué documento manda sobre qué:**
> [`ONIA_CIRCUITO_DE_CONTENIDO.md`](ONIA_CIRCUITO_DE_CONTENIDO.md) — y la misma
> estructura para consultar de un vistazo en
> <https://claude.ai/code/artifact/fb52b4b9-4504-4b8a-afca-46cf2a8f9586>

> Sergio Urcullo, 2026-09-08: *"necesito que diferenciemos el valor que damos a la
> comunidad porque si subimos todo a la web, no se va a ver el valor… y también los videos
> que no se pierdan los recursos"*.
>
> La preocupación es correcta y hay que contestarla bien, porque **es la pregunta que
> alguien va a hacer en voz alta adentro del grupo**. Complementa
> [`ONIA_RECURSOS_UN_RECURSO_TRES_PUERTAS.md`](ONIA_RECURSOS_UN_RECURSO_TRES_PUERTAS.md).
>
> 👉 **El ritmo de producción** —un tema por semana, seis días, y la guía del domingo—
> está en [`ONIA_MOTOR_SEMANAL_CONTENIDO.md`](ONIA_MOTOR_SEMANAL_CONTENIDO.md).

## El error de fondo, y por qué guardar contenido no es la salida

La reacción natural es **guardarse lo bueno**: publicar la mitad afuera y la otra mitad
adentro. Tiene tres problemas y los tres se pagan:

1. **Cuesta el doble.** Hay que producir dos versiones de todo, con una sola persona.
2. **Regala el buscador.** Lo que no se publica, Google no lo encuentra. Y el que llega por
   Google es justo el que todavía no te sigue.
3. **Se nota.** Una guía recortada a propósito se lee como recortada, y el que la lee
   entiende que le están escondiendo algo para venderle. Eso quema la confianza que la
   guía venía a construir.

**La salida no es partir el contenido. Es que la comunidad dé algo de otra naturaleza.**

> **La web te explica CÓMO SE HACE. La comunidad te ayuda a hacer EL TUYO.**

Son dos cosas distintas, no dos porciones de la misma cosa. Un libro de recetas no compite
con alguien que cocina al lado tuyo.

## Las seis cosas que sólo puede dar la comunidad

En orden de **cuánto cuesta producirlas**. Las tres primeras salen gratis y ya alcanzan.

| # | Qué | Por qué la web no puede darlo | Costo |
|---|---|---|---|
| 1 | **Llega primero** | La web publica días después. Estar adentro es enterarse antes, y eso se siente cada vez | ninguno |
| 2 | **Los archivos listos** | La guía dice cómo escribirlo; adentro está escrito. `docker-compose`, plantillas, workflows para importar | ninguno |
| 3 | **Lo que salió mal** | En público un error propio envejece mal y expone. Adentro es lo más útil que hay, porque es lo único que no se puede googlear | ninguno |
| 4 | **El diagnóstico** | *"Decime qué máquina tenés y te digo qué ponerle"*. Una web no puede mirar tu caso | tu tiempo |
| 5 | **El video explicando** | La guía es texto. El video con tu cara mostrando la pantalla es otra cosa, y **no va a la web** | grabarlo |
| 6 | **Preguntar y que te contesten** | En la web nadie responde | tu tiempo |

### Las dos que valen más son las que menos cuestan

**#3, lo que salió mal.** Todo el mundo publica lo que funcionó; casi nadie publica el
callejón sin salida, la config que rompió todo, la tarde perdida. Es la información más
cara de conseguir y a vos no te cuesta nada porque **ya la viviste**. Un mensaje por semana
contando un error tuyo vale más que tres tutoriales.

**#4, el diagnóstico.** Es lo único que convierte una lista de herramientas en una decisión.
Y es lo que hace que alguien se quede: no volvés a un grupo por el material, volvés porque
ahí adentro alguien te contestó.

## La frase para cuando lo pregunten adentro

> «Todo lo que enseño está afuera y va a seguir estando: no me guardo nada.
> Acá adentro está lo otro — te llega antes, con los archivos hechos, y podés
> preguntar por lo tuyo. La guía es para cualquiera; esto es para vos.»

Decirlo así, sin vueltas, es más fuerte que inventar un contenido secreto que después hay
que sostener todas las semanas.

---

# Los videos: que no se pierda ningún recurso prometido

## 🔴 El caso que originó esto

El **07-sep** salió el reel *"¿Qué es un homelab?"* con la promesa **«Comentá HOMELAB y te
envío la guía paso a paso»**. Quince horas después ya había **tres comentarios pidiéndola**
y la guía **no existía**: se escribió el 08-sep, a las corridas, con gente esperando.

No pasó nada grave por suerte. Pero es exactamente lo que la regla del carril dice que no se
haga, y salió al revés: **primero la promesa, después el recurso.**

## La regla, en una línea

> **Un video con promesa no se publica hasta que el recurso está en la web y el link
> funciona.** La promesa es una deuda; el recurso es la plata para pagarla.

## El registro de videos

Cada video que promete algo entra acá **antes** de publicarse. Sin fila en esta tabla, no
sale.

| Fecha | Video | Palabra | Promete | Recurso | Estado |
|---|---|---|---|---|---|
| 07-sep | ¿Qué es un homelab? | `HOMELAB` | "la guía paso a paso para construir el tuyo en tu casa" | [`/homelab`](https://sergiourcullo.vercel.app/homelab) | 🟢 **ya existe** (se escribió después: ver arriba) |
| — | Mi stack | `STACK` | "la lista de las siete con el paso a paso" | [`/stack`](https://sergiourcullo.vercel.app/stack) | 🟢 listo, el carrusel todavía no salió |

### Cómo se llena una fila nueva

1. **Se decide la promesa antes de grabar.** Qué palabra y qué recibe exactamente el que
   comenta. Escribir eso primero cambia el guion del video para bien: sabés hacia dónde va.
2. **Se escribe el recurso** y se publica en la web. Estado 🟡.
3. **Recién ahí se publica el video.** Estado 🟢.
4. **La palabra se contesta a mano** hasta que se cablee n8n — hoy `palabras: {}` en el
   workflow activo de private-reply, así que un "Comentá X" **no dispara nada**.

### Qué se le responde a quien comenta

Un mensaje corto con el link. No el contenido: el link. El texto listo para pegar vive en
`historial/cola/marca-personal-sep/PARA-PUBLICAR-DM-STACK.md` y el mismo molde sirve para cualquier palabra.

## Y los videos, guardados

**Los recursos no se pierden porque viven en la web** — ése era el punto de tenerla. Pero el
**video** también es un activo y hoy vive sólo en Instagram, que es prestado.

Lo que corresponde, y todavía no está hecho:

- **Bajar cada reel publicado** y guardarlo en el repo, junto al guion y a la promesa que
  hizo. Si mañana la cuenta se cae, el trabajo sigue existiendo.
- **Embeber el video en su página de la web.** El reel del homelab explicando qué es,
  arriba de la guía escrita, es mejor página que sólo el texto — y hace que el video siga
  trabajando meses después de que el algoritmo lo soltó.
- 🔴 **Depende de Sergio Urcullo:** decidir si los reels se re-suben a la web o se embeben
  desde Instagram. Embeber es gratis y no duplica, pero se rompe si el post se borra.

## Lo que NO hay que hacer

- **Prometer una palabra sin recurso.** Ya está dicho arriba, y es la única regla de este
  documento que no tiene excepción.
- **Prometer "te lo mando por privado" sin decir que lo contestás a mano.** La cuenta no
  tiene la automática cableada: si alguien espera un DM instantáneo y no llega, se pierde
  a esa persona y encima no queda registro de que pasó.
- **Cambiar el slug de un recurso ya prometido.** Los links repartidos por DM quedan vivos
  para siempre; si el slug cambia, todos mueren juntos.
