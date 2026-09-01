# PUBLICAR — Lucía, día 0 y día 1 (kit de teléfono)

> **Para qué existe:** la cola tenía tres pendientes de Sergio que decían *qué* hacer pero no
> el texto exacto ni el orden de las láminas. Este archivo es lo único que hay que abrir en el
> teléfono. Nadie tiene que volver a buscar el caption dentro de un JSON de brief.
>
> **Se publica A MANO, desde el teléfono.** No por API y no por Postiz, y no solo porque
> Postiz da 502: la decisión ya estaba tomada en el handoff del carril — *"una cuenta joven que
> empieza a publicar seguido por API se ve como un bot"*. Cuenta con 0 posts = manual.
>
> Cuenta: **`@lucia.antelo.oficial`** (IG id `28357585133845376`, tipo Creador).

---

## Paso 0 — la etiqueta de IA (2 min, ANTES del primer post)

Instagram tiene el campo nativo. Va **además** de decirlo en la bio, no en vez de.

1. Perfil → **Editar perfil**
2. Activar el switch **"Creador de IA"** (en algunas versiones aparece como *"Cuenta de IA"* /
   *"AI creator"*, dentro de Editar perfil o de Configuración → Tipo de cuenta).
3. Guardar, salir del perfil y volver a entrar: el rótulo tiene que **verse en el perfil**.

**Está hecho cuando se ve el rótulo en el perfil, no cuando se tocó el switch.**

🔴 **Y este paso SÍ bloquea el día 0.** Acá decía lo contrario ("no bloquea… anotarlo y
seguir"), y es falso: la **lámina 3 del carrusel afirma textualmente** *"Yo nací declarada:
etiqueta de IA activada desde el primer post"*. Publicar el día 0 sin el rótulo puesto deja esa
frase mintiendo, fijada al perfil, sobre lo único que la cuenta promete no esconder — declarar
que es IA. La lámina 1 y el caption declaran "soy IA", pero **ninguno de los dos afirma que la
etiqueta esté activada**; la lámina 3 sí.

Si el switch no aparece en esta versión de la app, hay dos salidas y ninguna es publicar igual:

- **Actualizar la app** y volver a buscarlo (Editar perfil, o Configuración → Tipo de cuenta).
- Si aun así no está: **ir al [Paso 1-bis](#paso-1-bis--plan-b-el-carrusel-de-6-láminas-si-la-etiqueta-no-se-puede-poner)
  y publicar el carrusel de 6 láminas.** Lo que no se hace es subir las 7 con la etiqueta apagada.

🟢 **Corregido el 31-ago: esta salida ya no es un freno.** Acá decía *"avisar antes de publicar.
Se cambia la lámina 3 (el texto vive en el brief, se re-renderiza) o se sube el carrusel de 6
láminas sin ella"* — y era un callejón: ofrecía un **re-render como primera opción** (horas de
trabajo, justo en el minuto de publicar) y el "carrusel de 6" no existía en ningún lado. El
Paso 1 es una tabla de 7 filas con su orden y su alt text; no había versión de 6. Al llegar a
esa rama con el teléfono en la mano, Sergio tenía que re-derivar el orden solo — y ya habría
mandado los 7 archivos. **Nadie había comprobado si el carrusel sobrevive sin la lámina 3.**
Se comprobó (ver Paso 1-bis): sobrevive. No hay que re-renderizar nada.

Origen de la instrucción: [`LUCIA.md`](LUCIA.md) §1.

---

## Paso 0-bis — el enlace de la bio ✅ YA ESTÁ (no hay que hacer nada)

🟢 **Corregido el 31-ago: este paso ya estaba hecho.** Acá decía que la bio "termina en 👇 y el
campo *Enlaces* está vacío", y era falso — nadie había mirado el perfil. Se abrió
`instagram.com/lucia.antelo.oficial` deslogueado el 31-ago y el enlace **está puesto y activo**:

```text
https://onia.com.bo/?src=lucia-bio
```

(`bio_links[0].link_type: "external"`, `link_id 18103663877269545`, se muestra en el perfil como
`onia.com.bo/?src=lucia-bio`.) La URL responde **200** (87.754 B, 0,72 s, medido el 31-ago).

La bio también está puesta, y con una diferencia de un carácter contra el doc de alta — lleva la
banderita, y así queda:

```text
Creada con IA por @oniahq 🤖
Bolivia 🇧🇴
Te muestro cómo la IA hace vender a tu negocio 👇
```

**Lo único que hay que hacer en Editar perfil es el switch del Paso 0.** No toques el enlace.

**Por qué ese `?src=`:** la web captura el parámetro `src` tal cual venga (sin lista blanca) y
lo pega al lead en el pipeline de atribución, así que las visitas desde la bio quedan separadas
de las que llegan por los DM (`lucia-ig-sistema`, `onia-ig-sistema`).

---

## Estado del perfil, medido el 31-ago (deslogueado, no supuesto)

| Qué | Cómo está hoy |
|---|---|
| Publicaciones | **0** — el feed sigue vacío, el día 0 no se subió |
| Seguidores / seguidos | 1 / 2 |
| Bio | ✅ puesta, la de arriba |
| Enlace de la bio | ✅ `https://onia.com.bo/?src=lucia-bio` |
| Etiqueta de IA | 🔴 **NO puesta** — `account_badges` viene vacío. Es el Paso 0, y es lo único que bloquea |

---

## Paso 0.5 — pasar los archivos al teléfono (5 min, una sola vez)

Los renders viven en la PC (`C:\dev\proyectos\onia-hermes`). Son **12 MB** las 7 láminas y
**19,7 MB** el reel: entra por cualquier lado.

**Cómo (Telegram, el más limpio):** Telegram en la PC → chat **"Mensajes guardados"** →
adjuntar → **enviar como ARCHIVO, no como foto** (como foto, Telegram recomprime). Mandar los
7 `.png`, el `.mp4` y **`portada-v7.jpg`** (la portada del reel, ver Paso 2). En el teléfono:
descargar cada uno y **guardarlo en la galería** — si no está en la galería, el selector de
Instagram no lo ve.

Si el selector igual no los encuentra: en la misma carpeta `FIJADO/` están los mismos 7 como
`.jpg`; esos se pueden mandar **como foto** y caen directo en la galería. Instagram recomprime
todo al subir, así que la diferencia no se ve en el feed.

⚠️ **WhatsApp no**: destroza la imagen y el video.

---

## Paso 1 — Día 0: el carrusel fijado "quién es Lucía" (15 min)

**Carpeta:** `hermes-content/references/modelos/lucia/posts-20260807/FIJADO/`

Subir los 7 `.png` **en este orden** (los `.jpg` de la misma carpeta son el respaldo del repo,
no la versión que se sube):

| # | archivo | de qué es la lámina | alt text |
|---|---|---|---|
| 1 | `slide-01.png` | ¿Lucía es real? | Lucia es real? |
| 2 | `slide-02.png` | un personaje digital | Personaje digital |
| 3 | `slide-03.png` | no lo escondo | IA declarada |
| 4 | `slide-04.png` | un equipo boliviano | Quien la hace |
| 5 | `slide-05.png` | IA sin humo | Que publica |
| 6 | `slide-06.png` | la pregunta abierta | Pregunta abierta |
| 7 | `slide-07.png` | esto recién empieza | Seguime |

⚠️ **NO subir `posts-20260807/render-fijado/`.** Es el render superado del 22-ago (serif); tiene
adentro su marcador `_NO-SUBIR.md`. La carpeta buena es `FIJADO`, sin prefijo `render-`.

**Caption** (copiar tal cual):

```text
Sí, soy IA. Y esta es toda la historia — quién me hace, por qué no lo escondo, y qué vas a ver acá. Guardalo para cuando alguien te pregunte si soy real.

#inteligenciaartificial #ia #influencervirtual #bolivia #santacruz #tecnologia
```

**Después de publicarlo: fijarlo al perfil.** (··· sobre el post → *Fijar en tu perfil*.) Es un
post fijado; no cuenta como el día 1 del calendario.

---

## Paso 1-bis — PLAN B: el carrusel de 6 láminas (si la etiqueta no se puede poner)

**Sólo si el Paso 0 falló** — el switch de "Creador de IA" no existe en esa versión de la app.
Si la etiqueta está puesta, ignorá esta sección y usá el Paso 1.

**Se saca la lámina 3 y se sube igual. No se re-renderiza nada.**

Por qué se puede: la lámina 3 es la única que afirma que la **etiqueta** está activada
(*"Yo nací declarada: etiqueta de IA activada desde el primer post"*). La declaración de que
Lucía es IA no depende de ella y queda dicha **dos veces más**, en las láminas que sí se suben:

- **Lámina 1** — *"¿LUCÍA ES real? / No. Y esa es la mejor parte."*
- **Lámina 2** — *"UN PERSONAJE digital / Creada con inteligencia artificial por el equipo de
  @oniahq, en Santa Cruz de la Sierra. Cada foto mía se genera — no existe una sesión, no
  existe una cámara."*

Sacando la 3, lo único que se pierde es la frase que sería falsa. Nada más la menciona:
verificado lámina por lámina el 31-ago sobre `FIJADO/_HOJA-DE-CONTACTO.jpg`.

**Y el carrusel sigue leyéndose.** Los rótulos verdes quedan encadenados sin hueco:
*LA PREGUNTA QUE TODOS HACEN → QUÉ SOY → QUIÉN ME HACE → QUÉ VAS A VER → LA PREGUNTA →
EL COMIENZO*. La lámina 2 termina en "DESLIZÁ →" y la 4 abre presentando a Onia; no se
referencian entre sí, así que el salto no deja frase colgada.

Orden a subir — **6 archivos, misma carpeta `FIJADO/`, salteando `slide-03`** (9,8 MB en total):

| # | archivo | de qué es la lámina | alt text |
|---|---|---|---|
| 1 | `slide-01.png` | ¿Lucía es real? | Lucia es real? |
| 2 | `slide-02.png` | un personaje digital | Personaje digital |
| 3 | `slide-04.png` | un equipo boliviano | Quien la hace |
| 4 | `slide-05.png` | IA sin humo | Que publica |
| 5 | `slide-06.png` | la pregunta abierta | Pregunta abierta |
| 6 | `slide-07.png` | esto recién empieza | Seguime |

**El caption sí cambia — se le saca tres palabras.** El del Paso 1 promete tres cosas: *"quién me
hace, **por qué no lo escondo**, y qué vas a ver acá"*. Ese beat del medio **es la lámina 3**: es
la única que lo contesta (rótulo *POR QUÉ DECLARADA*). Sin ella, el caption enumera algo que el
carrusel ya no entrega — y justo en la pieza cuya promesa es no esconder nada. Copiar este:

```text
Sí, soy IA. Y esta es toda la historia — quién me hace y qué vas a ver acá. Guardalo para cuando alguien te pregunte si soy real.

#inteligenciaartificial #ia #influencervirtual #bolivia #santacruz #tecnologia
```

Lo demás del caption queda igual, hashtags incluidos: "Sí, soy IA" no depende de la etiqueta y
sigue siendo cierto.

**Y avisale a Sergio igual**, no para frenar sino para que quede anotado: la lámina 3 hay que
re-escribirla en el brief antes de que la etiqueta se pueda poner, o el día que se pueda, se
re-renderiza y este post se puede volver a subir completo.

---

## Paso 2 — Día 1: el reel de lanzamiento (10 min)

**Archivo:** `hermes-content/references/modelos/lucia/reel-lanzamiento-20260822/final/lucia-lanzamiento-v7.mp4`
· 22,07 s · 1080×1920 a 30 fps · subtítulos ya quemados · audio medido: media −17,7 dB, pico −1,6 dB (acá decía «−14,3 LUFS», un número que nadie midió).

⚠️ En esa carpeta hay **dos** archivos. Sube **`lucia-lanzamiento-v7.mp4`**, no
`lucia-lanzamiento.mp4` (v6, con el clip de playa que perdía las pecas — ver
[`TABLA-DE-CORTES.md`](../references/modelos/lucia/reel-lanzamiento-20260822/TABLA-DE-CORTES.md)).

**Verificado el 31-ago mirándolo, no suponiéndolo:** hoja de contacto de los 22 s
(11 frames) + medición. El archivo es 1080×1920 a 30 fps, dura 22,07 s, el audio existe de
verdad (mean −17,7 dB / pico −1,6 dB — no es un video mudo con LUFS escrito en un doc), y los
subtítulos quemados dicen lo que promete el caption: *NO SOY REAL · NO EXISTO · SOY LUCÍA · UN
PERSONAJE DIGITAL · EL EQUIPO DE ONIA · …SIN HUMO · NO ESCONDO LO QUE SOY · LO QUE VIENE ·
¡SEGUIME!*. Los dos momentos que en miniatura parecen un defecto —la cara "partida" cerca del
seg. 18 y el mockup del navegador flotando sobre el clip del gimnasio— son las disolvencias
entre clips, ~0,7 s cada una. No hay nada que re-renderizar.

### La portada (esto sí faltaba)

Instagram pide **Portada** al subir un reel, y esa imagen es la que queda para siempre en la
grilla del perfil, al lado del carrusel fijado. El kit no decía cuál, y por defecto Instagram
agarra el primer frame: Lucía de perfil, mirando afuera, medio de espaldas — la peor de las 22
segundos para la grilla.

Ya está elegido y extraído:
**`hermes-content/references/modelos/lucia/reel-lanzamiento-20260822/final/portada-v7.jpg`**
(1080×1920, 258 KB) — el frame del **seg. 21**: cara centrada, sonrisa, mirando a cámara, luz
de atardecer. Lleva abajo el subtítulo *LO QUE VIENE.*, que en el recorte de la grilla queda
fuera o al borde.

Mandalo al teléfono junto con el `.mp4` (mismo viaje del Paso 0.5) y en la pantalla de portada
elegí **Agregar desde la galería**. Si preferís no pasar otro archivo: arrastrá el selector de
portada hasta el **segundo 21** de los 22, es el mismo frame.

**Caption** (copiar tal cual):

```text
No soy real. Y prefiero decírtelo yo antes de que lo adivines.

Soy Lucía: un personaje digital creado en Bolivia por el equipo de @oniahq. Acá vas a ver inteligencia artificial sin humo — herramientas que existen y cómo le sirven a un negocio de verdad.

Seguime y mirá hasta dónde llega.

#inteligenciaartificial #ia #influencervirtual #bolivia #santacruz #tecnologia
```

El reel ya declara "no soy real" en el primer segundo, hablado y subtitulado: doble
declaración con la etiqueta del Paso 0. Deriva a Onia **una sola vez**, y a propósito.

---

## Lo que NO se hace todavía

- **No contestar los DMs a mano.** El circuito comentario→DM del workflow de n8n solo está
  verificado de punta a punta para la palabra **HUMO**, y el día 0 y el día 1 no piden palabra.

  ⚠️ **Corregido el 31-ago: que la pieza no pida palabra NO significa que el bot esté callado
  el día 0.** Se leyó el workflow `1jS4jwmNmvcQpqqH` (activo) nodo por nodo: **no tiene ningún
  filtro de post ni de media**. Escucha *todos* los comentarios de la cuenta; lo único que decide
  si dispara es la **palabra dentro del texto del comentario**, no la pieza donde se comentó.

  Para Lucía — que entra por la rama `DESCONOCIDA` porque su `entry_id` sigue sin mapear — las
  palabras vivas son **SISTEMA** y **HUMO**, y el match es `texto.toUpperCase().includes(...)`:
  **subcadena, no palabra entera**. O sea que un comentario espontáneo como *«me gustaría ver
  cómo armas tu sistema de contenido»* contiene `SISTEMA` y **dispara el DM**. Y la lámina 6
  del día 0 pide justamente eso: *«Decime en los comentarios qué te gustaría ver acá»*.

  **No bloquea el día 0**, porque el daño está acotado y es on-brand: sale el DM de SISTEMA de
  Lucía (voz de ella, link `onia.com.bo/?src=lucia-ig-sistema`, verificado 200), hay freno de
  **24 h por persona** (`/opt/onia/ig-dm-token.sh`), y a Sergio le llega aviso por Telegram en
  cada disparo. Lo que sí cambia: **si en el día 0 llega un DM, no es un bug — es esto.** No
  hay que apagar nada a las apuradas.

  Si Sergio prefiere silencio total el día 0, la única palanca limpia es vaciar `palabras` de la
  rama `DESCONOCIDA` en el nodo *Parsear comentario* y volver a ponerlas antes del día 4 (L6, la
  primera pieza que SÍ pide palabra). Es tocar n8n en vivo — carril infra, un dueño a la vez —
  así que **no se hizo desde acá**: queda como opción suya, de un minuto.
- **No publicar `onia-6-tareas-para-delegar.pdf`** — no desbloquea ninguna pieza.
- Los días 2 a 6 (L09 → L6 → L10 → L08 → L11) van uno por día, en ese orden. Recién ahí
  aparece la primera pieza que pide algo por comentario.
