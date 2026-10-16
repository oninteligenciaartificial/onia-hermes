# Avisos de la comunidad · PRUEBAS (lun 12) y BRIEF (mié 14) · 11-oct-2026

Pedido de la MADRE MARKETING, 11-oct: los dos carruseles agendados cerraban con una palabra sin aviso (lo detectó el validador `marca-M2`). Formato de `AVISOS-COMUNIDAD-8-16-OCT.md`: **Aviso** corto (se pega primero) + **Recurso** (después, en otro mensaje) + tabla «Datos y fuentes» que **no se pega**. Voseo; sin «Comentá».

| Palabra | Carrusel | Sale | Hay que pegarlo antes de | Antes de pegar |
|---|---|---|---|---|
| PRUEBAS | K4 v2 «5 pruebas antes de activar tu bot» | lun 12 · 16:00 La Paz (20:00 UTC) | **lun 12 · 16:00 La Paz** | Nada más que este texto |
| BRIEF | K7 v2 «Carruseles por código en 5 pasos» | mié 14 · 16:00 La Paz | mié 14 · 16:00 La Paz | Nada más que este texto |

**Dos cosas que cambian en los carruseles ya agendados** (detalle al final, §«Lo que hay que cambiar en los carruseles»): la lámina 4 de K4 dice que **Chatwoot** reentrega el aviso y el código de Chatwoot no lo respalda (el que reintenta es **WhatsApp**); y los dos cierran con «Comentá X», que la regla del 10-oct reemplazó por «Buscá X en Avisos».

---

## PRUEBAS · 5 pruebas antes de activar tu bot de WhatsApp

**Antes de pegar:** nada más que este texto.

**Aviso** (se pega primero):

```
🧪 *PRUEBAS* · *5 pruebas antes de activar tu bot de WhatsApp*

En el carrusel te muestro las 5 pruebas que le hago a un bot antes de dejarlo hablar con clientes. La que más importa es la 3: si inventa un precio, no se activa.

Abajo: la lista para copiar, con el mensaje exacto que mandás en cada prueba y cuándo pasa o falla.

Contame en General: ¿ya tenés un bot en WhatsApp o lo estás armando?
```

**Recurso** (se pega después, en otro mensaje):

~~~
*PRUEBAS* · *Las 5 pruebas, lista para copiar*

Regla de oro: escribí las pruebas ANTES de ver qué contesta el bot. Si una falla, se arregla el bot. Nunca aflojes la prueba para que pase.

*1 · Como escribe tu cliente*
Mandá: «cuanto sale?» · «ya» · «hola buenas tardes precio» · «hablo con una persona?» · un mensaje sin tildes y con errores.
Pasa: entiende y contesta lo que corresponde.
Falla: te pide que escribas bien, o contesta otra cosa.

*2 · El mismo aviso dos veces*
Mandá la MISMA notificación dos veces a tu servidor, con el mismo id de mensaje (un curl con el mismo archivo .json, dos veces).
Pasa: sale UNA sola respuesta.
Falla: salen dos. Arreglo: guardá el id de cada mensaje y filtrá por id antes de contestar.
Por qué: si tu servidor no le contesta bien a WhatsApp, WhatsApp reintenta y puede mandarte el mismo aviso duplicado.
https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/overview

*3 · Lo que no sabe* (la que más importa)
Preguntale algo que NO le diste: stock, plazo, precio de algo que no cargaste.
Pasa: dice que no lo sabe y avisa a una persona.
Falla: contesta un dato. Si contesta un dato que no está en su información, lo inventó; y ese dato se lo prometiste vos. Si inventa, no se activa.

*4 · Un audio*
Mandale una nota de voz.
Pasa: la entiende, o avisa a una persona.
Falla: no contesta, o contesta como si no hubieras mandado nada.

*5 · Pedir una persona*
Mandá: «quiero hablar con una persona» · «me atiende alguien?».
Pasa: alguien se entera de verdad (una notificación, no solo la respuesta del bot).
Falla: el bot contesta y nadie se entera.

Guardá esta lista para el día que lo actives.

Contame en General: ¿ya tenés un bot en WhatsApp o lo estás armando?
~~~

**Datos y fuentes** (no se pega · leídas el 11-oct-2026):

| Dato | Fuente | Estado |
|---|---|---|
| WhatsApp reintenta la entrega si tu servidor no responde 200, «con frecuencia decreciente, hasta 7 días», y los reintentos «pueden producir notificaciones duplicadas» | https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/overview | ok |
| Cada mensaje entrante trae un `id` (empieza con `wamid.`) | https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/reference/messages (ejemplo del payload) | ok |
| Filtrar por ese `id` para no contestar dos veces | la página de Meta **no** dice cómo deduplicar; es práctica común | consejo mío |
| **Chatwoot reentrega el aviso si tu servidor tarda** (lámina 4 de K4 v2) | `lib/webhooks/trigger.rb` de Chatwoot (rama `develop`): el tiempo de espera es de **5 s** (`WEBHOOK_TIMEOUT`) y un timeout **no** se reintenta (va a `handle_failure`); solo los *agent bots* con respuesta 429 o 500 levantan un error reintentable. `webhook_job.rb` no declara `retry_on` | **no respaldado**: se corrige a «WhatsApp» (ver abajo). La versión de Chatwoot desplegada en el VPS no se leyó |
| Las 5 pruebas y su orden; «si inventa, no se activa»; «nunca aflojes la prueba» | láminas 2, 5 y 7 de K4 v2 (`hermes-content/carousels/briefs/marca-personal/sergio-k4v2-cinco-pruebas-bot-20260929.json`) | del carrusel |
| «Ocho de las mías fallaron así», «62 mensajes» del banco de pruebas, «cada una tiene hoy su prueba automática» | láminas 2 y 3 y caption de K4 v2; datos del bot de ONIA (repo `onia-platform`), medidos el 29-sep | **no re-verificado hoy** desde esta sesión (el repo del producto es otro) |
| Los mensajes de ejemplo de cada prueba, el curl y el criterio de «pasa/falla» | míos, a partir de las láminas | consejo mío |

---

## BRIEF · Carruseles por código: el brief en JSON y el comando

**Antes de pegar:** nada más que este texto. **Nota:** la auditoría del 10-oct marcó este carrusel como flojo («no muestra el JSON, ni un comando»); este recurso lo arregla entregando las tres cosas. Si se prefiere cambiarlo por K5 v2 VENTANA, esta pieza queda guardada.

**Aviso** (se pega primero):

```
🧩 *BRIEF* · *El JSON de este carrusel y el comando para sacar las láminas*

Este carrusel salió de un archivo de texto y un navegador. Abajo está el archivo (el JSON de las 7 láminas), el pedido que le hago a Claude Code y el comando de Chrome para sacar cada captura.

Copialo y cambiale el texto por el de tu tema.

Contame en General: ¿qué carrusel te gustaría armar así?
```

**Recurso** (se pega después, en otro mensaje):

~~~
*BRIEF* · *Carruseles por código*

*1 · El brief: un JSON con el texto de cada lámina*
{
  "title": "Carruseles por código en 5 pasos",
  "slides": [
    {"headline": "Carruseles por código en 5 pasos"},
    {"headline": "La IA de imagen escribe mal", "body": "El 29 de septiembre el modelo inventó letras en una taza. Texto en la imagen es texto sin control."},
    {"headline": "Paso 1: el brief", "body": "un JSON: cada lámina con headline y body"},
    {"headline": "Paso 2: la IA pinta solo la imagen", "body": "Un objeto simple sin nada impreso: piedra, planta, madera. Tazas y pantallas no: ahí inventa letras. Describilo en positivo."},
    {"headline": "Paso 3: las fuentes necesitan 10 segundos", "body": "Un script arma cada lámina en HTML de 1080×1350 y Chrome sin ventana le saca una captura. Con 4 segundos, una lámina salió con una letra y la siguiente con otra."},
    {"headline": "Pasos 4 y 5: mirar y cotizar", "body": "antes de publicar y antes de gastar"},
    {"headline": "Cierre", "body": "Buscá BRIEF en Avisos de la comunidad. Link en mi perfil."}
  ]
}
Regla del brief: portada = el problema en una frase · segunda = lo que está en juego · las del medio = una idea por lámina · cierre = una sola acción.

*2 · El pedido para Claude Code*
«Por cada lámina de brief.json armá un HTML de 1080x1350 con mi fuente y mi color, y sacale captura con Chrome.»

*3 · La captura, a mano (Chrome sin ventana)*
chrome --headless=new --hide-scrollbars --force-device-scale-factor=1 --window-size=1080,1350 --virtual-time-budget=10000 --screenshot=slide-01.png file:///C:/ruta/slide-1.html
El --virtual-time-budget=10000 son los 10 segundos para que carguen las fuentes: con 4, una lámina salió con una letra y la siguiente con otra.

*4 · La imagen, solo si la necesitás*
Un objeto simple, sin nada impreso, descrito en positivo («una piedra lisa sobre madera»). Tazas, cuadernos y pantallas no: ahí el modelo inventa letras. El texto lo pone el código, nunca la imagen.

*5 · Antes de publicar*
Mirá todas las láminas juntas, y cotizá antes de generar imágenes.

Contame en General: ¿qué carrusel te gustaría armar así?
~~~

**Datos y fuentes** (no se pega · leídas el 11-oct-2026):

| Dato | Fuente | Estado |
|---|---|---|
| El comando de Chrome y sus 5 banderas (`--headless=new`, `--hide-scrollbars`, `--force-device-scale-factor=1`, `--window-size`, `--virtual-time-budget=10000`, `--screenshot`) | `scripts/carousel_render.js` líneas 1311-1324: es lo que usa a diario el renderer de este repo. **Las banderas no figuran** en https://developer.chrome.com/docs/chromium/headless (leída el 11-oct: solo muestra `google-chrome --headless`) | probado en nuestro renderer; sin página oficial que las describa |
| «Con 4 segundos, una lámina salió con una letra y la siguiente con otra» | medición propia del 1-oct (`diseno-contenido-onia`, trampa de la fuente) | medición mía |
| «La IA de imagen inventó letras en una taza» (29-sep) | observación mía de esa fecha; la sesión de diseño la dejó en la skill `diseno-contenido-onia` | medición mía |
| 1080×1350 (formato vertical 4:5 de feed) | es el formato `feed` de nuestro renderer y el que publicamos; la guía oficial de Instagram no se re-leyó hoy | medido; sin fuente oficial leída hoy |
| El JSON de ejemplo | **es el texto de las 7 láminas** de K7 v2, palabra por palabra y sin los asteriscos de énfasis, reducido a `headline` y `body` (la lámina de cierre lleva el cierre nuevo «Buscá BRIEF»); el brief completo (con `layout`, `theme`, etc.) está en `hermes-content/carousels/briefs/marca-personal/sergio-k7v2-carruseles-por-codigo-20260929.json` y solo lo lee el renderer de ONIA | del carrusel (abreviado) |
| El pedido para Claude Code | caption de K7 v2 | del carrusel |
| «Mirar todas juntas, cotizar antes de generar» | lámina 6 de K7 v2 | del carrusel |

---

## Lo que hay que cambiar en los carruseles ya agendados

Los carruseles de lunes y miércoles están en el VPS (`pub-car-20261012` y `pub-car-20261014`) con sus láminas y su caption ya armados. **No toqué el VPS** (escritura externa). Dejo en el repo las versiones corregidas, renderizadas y miradas:

| Qué | Dónde | Qué cambia |
|---|---|---|
| K4 **v3** (PRUEBAS) | `hermes-content/carousels/out/sergio-k4v3-cinco-pruebas-bot-20261012/` y su brief `…/briefs/marca-personal/sergio-k4v3-cinco-pruebas-bot-20261012.json` | Lámina 4: «WhatsApp lo vuelve a entregar» en vez de «Chatwoot»; caption con lo que dice Meta (reintenta hasta 7 días, pueden llegar duplicados); cierre «Buscá PRUEBAS en Avisos · link en mi perfil» |
| K7 **v3** (BRIEF) | `hermes-content/carousels/out/sergio-k7v3-carruseles-por-codigo-20261014/` y su brief | Cierre «Buscá BRIEF en Avisos · link en mi perfil»; caption igual |

**Cierre alternativo sin palabra**, si el aviso no está pegado a tiempo: «Lo que probé está en mi comunidad. Link en mi perfil.» (la variante que ya usan N06 y S2-D07-A). Sirve para los dos; cambia solo la lámina de cierre y la última línea del caption.

**Decide la madre o Sergio Urcullo:** reemplazar en el VPS `slide-04.png`/`slide-08.png` y `caption.txt` de K4 antes del lun 12 16:00 La Paz (la corrección de «Chatwoot» no puede esperar: es un dato que el código de Chatwoot no respalda), y las de K7 antes del mié 14.
