# El DM de cada palabra clave — @oniahq y Lucía

> **La fuente de verdad real es el mapa de palabras del workflow `1jS4jwmNmvcQpqqH`** — eso es
> lo que corre y lo que le llega a la gente. Esta página lo ESPEJA: si difieren, gana el
> workflow y esta página está rota. Antes de creerle a un cartel rojo de acá, leé el workflow
> vivo y probá la URL. La marca personal de Sergio tiene los suyos en
> [`ONIA_SERGIO_DM_PALABRAS.md`](ONIA_SERGIO_DM_PALABRAS.md); el circuito y sus límites, en
> `ONIA_CIRCUITO_COMENTARIO_DM.md`. Qué entrega cada palabra y si está viva:
> `scripts/recompensas.json`.

---

## Las tres reglas que le dan forma a estos textos

No son de estilo: salen de la documentación de Meta y condicionan todo.

1. **UN solo mensaje por comentario, para siempre.** *"Only one message can be sent to the
   commenter."* No hay segundo DM, no hay secuencia. Todo lo que se quiera decir entra acá.
2. **Solo texto.** Nada de audio ni adjuntos en la private reply. El recurso va como link.
3. **La respuesta de la persona es la llave.** Recién cuando contesta se abre una ventana de
   24 h donde sí se puede mandar el audio y el resto.

De ahí sale la forma de todos: **entregar primero lo prometido — sin condiciones, sin pedir
nada a cambio — y recién después dar un motivo para responder.** Al revés (retener el recurso
hasta que responda) convierte el DM en un peaje, y quien comentó ya cumplió su parte.

⚠️ **El código no debe exigir una frase exacta.** "Respondeme" es buena instrucción de copy,
pero cualquier respuesta abre la ventana: quien escriba "dale", "me interesa" o un "si" tiene
que recibir lo mismo que quien escriba la frase completa.

---

## SISTEMA · dos textos distintos, uno por cuenta

✅ Verificado el 2026-08-31 contra el mapa VIVO del workflow `1jS4jwmNmvcQpqqH` (activo).
Ambos entregan un link a la home, **no un PDF**, y responden 200.

⚠️ **Corregido el 2026-08-31.** Acá había un solo texto compartido que entregaba
`onia.com.bo/recursos/6-tareas-para-delegar.pdf`, con un cartel rojo de "no encender hasta
publicar el PDF". Las dos cosas eran falsas: ese PDF **no aparece en ningún lado del circuito
vivo**, la palabra entrega un link para agendar que responde 200, y SISTEMA tiene **un texto
por cuenta**, no uno solo. El error costó caro — el cartel rojo resucitó tres veces como
pendiente "publicar el PDF de SISTEMA" en la cola del carril, y la última vez entró a «Ahora»
con fecha límite. Una fuente de verdad desactualizada fabrica trabajo que no existe.

Los textos van **verbatim del workflow**, sin tildes: así están cargados y así salen.

### @oniahq

```
Hola! Vi tu comentario. Te dejo el link para agendar el diagnostico de 20 minutos: miramos tu operacion y te decimos que conviene automatizar primero, y que no vale la pena todavia.

https://onia.com.bo/?src=onia-ig-sistema

Si preferis, contame en una linea a que se dedica tu negocio y te adelanto algo por aca.
```

### @lucia.antelo.oficial

Entrega **"el mapa de tu negocio"** — exactamente lo que prometen las piezas L6 y L10.

```
Hola! Soy Lucia. Te muestro como se ve todo junto: aca agendas 20 minutos y el equipo de @oniahq te arma el mapa de tu negocio, con tus numeros.

https://onia.com.bo/?src=lucia-ig-sistema

Y si preferis chusmear primero, en @oniahq esta el detras de todo lo que muestro.
```

## HUMO · @lucia.antelo.oficial

✅ Verificado el 2026-08-28: 200, 306 KB, application/pdf.

```
Hola! Vi que comentaste HUMO 👋

Te dejo las cinco herramientas que uso de verdad, con lo que cuesta cada una
y las tres que descartamos con su motivo:

https://onia.com.bo/recursos/5-herramientas-ia-bolivia.pdf

Tres de las cinco son gratis, así que se puede empezar hoy sin pagar nada.

Contame en qué andás y te digo cuál te sirve primero — no todas sirven para
todos los rubros.

(Soy Lucía y soy IA. No lo escondo: el equipo que contesta del otro lado es humano.)
```

## LISTA · @oniahq

✅ Verificado el 2026-08-28: 200, 258 KB, application/pdf.

```
Ey! Vi que comentaste LISTA 👋

Acá está: por dónde empezar si querés ordenar tu negocio sin comprar nada
todavía.

https://onia.com.bo/recursos/lista-por-donde-empezar.pdf

El primer paso no es un sistema, es saber qué se te está escapando.

Si me contás qué vendés, te digo cuál de los pasos te va a doler más — que
suele ser el que más plata devuelve.
```

## FACTURA · @oniahq

🔴 **La palabra todavía no está cargada** en el mapa de @oniahq. El recurso ya está vivo
(`/guia-facturacion`, verificado 200); falta solo el circuito.

```
Ey! Vi que comentaste FACTURA 👋

Acá está la hoja para saber si te toca facturar en línea, con los 6 pasos para
habilitarte:

https://onia.com.bo/guia-facturacion

Lo importante primero: el trámite en la Oficina Virtual del SIN es GRATIS y no
hace falta comprarle un sistema a nadie, ni a nosotros. Cualquiera que te diga
lo contrario te está vendiendo humo.

Si te trabás en algún paso, respondeme y te saco la duda.
```

---

## Por qué cada uno pide una respuesta

No es para "engagement": es el único mecanismo que abre la ventana de 24 h, y sin esa ventana
no se puede mandar nada más — ni el audio, ni el link de la comunidad. Por eso el pedido es
concreto y fácil de contestar ("contame qué vendés", "en qué andás"), no un genérico
"¿te gustó?" que nadie responde.

Y por eso el recurso va **antes** del pedido: quien ya recibió lo que le prometieron responde
mucho más que quien todavía está esperando.

## Lo que falta para que esto funcione entero

| Qué | De quién |
|---|---|
| 🔴 Cargar la palabra FACTURA en @oniahq | circuito n8n |
| 🔴 Cargar palabras en la cuenta de Sergio | circuito n8n — hoy su mapa está vacío y ya se perdieron dos leads reales |
| Respuesta pública al comentario ("Enviado ✅") | circuito n8n — es otra API (`POST /{comment_id}/replies`), nunca se construyó |
| Suscribirse al webhook `messages` | circuito n8n — sin esto no nos enteramos si responden, y la ventana de 24 h no se puede usar |

Los textos de esta página no dependen de nada de eso: se cargan tal cual en la tabla
`media_id · palabra · mensaje` cuando el circuito esté listo.
