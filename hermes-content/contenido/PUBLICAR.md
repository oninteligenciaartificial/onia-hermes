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
- Si aun así no está: **avisar antes de publicar.** Se cambia la lámina 3 (el texto vive en el
  brief, se re-renderiza) o se sube el carrusel de 6 láminas sin ella. Lo que no se hace es
  subir las 7 con la etiqueta apagada.

Origen de la instrucción: [`LUCIA.md`](LUCIA.md) §1.

---

## Paso 0-bis — el enlace de la bio (1 min, en la MISMA pantalla del Paso 0)

La bio de Lucía termina en **👇**, y hoy esa flecha no apunta a nada: el campo *Enlaces* está
vacío. Un desconocido abre el perfil el día 0, lee "te muestro cómo la IA hace vender a tu
negocio 👇" y no hay dónde tocar.

Ya estás en **Editar perfil** por el switch de IA. Aprovechá el viaje:

1. **Enlaces** → *Agregar enlace externo* → pegar:

```text
https://onia.com.bo/?src=lucia-bio
```

2. Título del enlace: `Onia — IA para tu negocio`
3. Verificar que la **bio** sea exactamente esta (elegida por Sergio el 08-ago, 84 de 150
   caracteres — no cambiarla, solo confirmar que está):

```text
Creada con IA por @oniahq 🤖
Bolivia
Te muestro cómo la IA hace vender a tu negocio 👇
```

**Por qué ese `?src=`:** la web captura el parámetro `src` tal cual venga (sin lista blanca) y
lo pega al lead en el pipeline de atribución, así que las visitas desde la bio quedan separadas
de las que llegan por los DM (`lucia-ig-sistema`, `onia-ig-sistema`). Verificado el 31-ago:
`https://onia.com.bo/?src=lucia-bio` → **200**, 87.754 B, 0,72 s.

Origen del texto: `hermes-content/docs/ONIA_MODELOS_PERFILES_ALTA_20260806.md` (bio definitiva y
campo *Enlace*).

---

## Paso 0.5 — pasar los archivos al teléfono (5 min, una sola vez)

Los renders viven en la PC (`C:\dev\proyectos\onia-hermes`). Son **12 MB** las 7 láminas y
**19,7 MB** el reel: entra por cualquier lado.

**Cómo (Telegram, el más limpio):** Telegram en la PC → chat **"Mensajes guardados"** →
adjuntar → **enviar como ARCHIVO, no como foto** (como foto, Telegram recomprime). Mandar los
7 `.png` y el `.mp4`. En el teléfono: descargar cada uno y **guardarlo en la galería** — si no
está en la galería, el selector de Instagram no lo ve.

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

## Paso 2 — Día 1: el reel de lanzamiento (10 min)

**Archivo:** `hermes-content/references/modelos/lucia/reel-lanzamiento-20260822/final/lucia-lanzamiento-v7.mp4`
· 22 s · 1080×1920 · subtítulos ya quemados · audio −14,3 LUFS.

⚠️ En esa carpeta hay **dos** archivos. Sube **`lucia-lanzamiento-v7.mp4`**, no
`lucia-lanzamiento.mp4` (v6, con el clip de playa que perdía las pecas — ver
[`TABLA-DE-CORTES.md`](../references/modelos/lucia/reel-lanzamiento-20260822/TABLA-DE-CORTES.md)).

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
