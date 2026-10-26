# CARRUSEL "Mi stack" — listo para pegar · 🔒 **COMUNIDAD, no Instagram**

> ⚠️ **Reescrito el 10-sep. Cambió el DESTINO y la pieza se recortó de 11 láminas a 5.**
> Sergio Urcullo: *«'Mi stack' NO va al perfil público — va a la comunidad»*. El porqué
> completo está en [`AUDITORIA-8-CARRUSELES.md`](AUDITORIA-8-CARRUSELES.md) §«El reparto,
> cerrado»; la regla que salió de ahí vive en
> [`../ONIA_DONDE_VA_CADA_COSA.md`](../ONIA_DONDE_VA_CADA_COSA.md).

**Piezas:** `carousels/out/apple-mi-stack-inter/lamina-01..05.png` (5 láminas, 1080×1350).

**Dónde va:** canal **Announcements** de Onia Community (WhatsApp), **lunes 14-sep**,
abriendo la semana «Mi stack» del motor semanal.

**Qué trabajo hace:** es el **mapa de la semana**. El de adentro ve el stack entero el
lunes; el de afuera lo recibe dosificado en seis videos de Instagram, uno por día. Eso es
exclusividad sin esconder conocimiento — la guía `/stack` sigue pública en la web.

## Por qué NO va al perfil público

No es que la pieza esté mal: es que **el calendario ya la tenía ocupada**. La semana 1 del
motor es exactamente este tema, con seis videos en `@sergiourcullo`. Publicar el carrusel
en el perfil **antes** spoilea la semana entera; **después**, es un resumen de lo que todos
ya vieron — y la vara del carril dice que un resumen no es una pieza. Además su CTA viejo
(«Comentá STACK») prometía entrega a mano con `palabras: {}` sin cablear en n8n: 200
comentarios eran 200 DMs manuales.

## Las 5 láminas

| # | Lámina | Qué dice |
|---|---|---|
| 01 | **Portada** | 16 años, una empresa en Bolivia, **$200** al mes es todo lo que paga · tira con los 7 iconos |
| 02 | Claude Max | La capa que piensa · **$200/mes** · la única que se paga |
| 03 | **Las cinco gratis, juntas** | Homelab · n8n · WhatsApp Business · HyperFrames · Hermes → **$0** |
| 04 | Onia Platform | Lo que está construyendo · **Próximamente** |
| 05 | **Cierre** | Siete herramientas, una factura · **$200** · y esta semana, un archivo por día acá adentro |

### Qué se recortó y por qué

- **Las cinco fichas individuales → una sola lámina.** Eran cinco pantallas con la misma
  estructura y el mismo `$0`: a partir de la tercera el lector ya entendió y desliza
  rápido. El dato se conserva entero y se cuenta en la mitad del tiempo.
- **Fuera «quién soy» (foto a sangre + Seguime).** Adentro ya saben quién es y ya lo
  siguen. Pedir seguimiento en Announcements es ruido.
- **Fuera el CTA «Comentá STACK».** Su promesa —la lista con el paso a paso— la cumplen
  **los seis drops de la semana**, que entregan el archivo real, no una lista.

Las láminas retiradas están en git antes de este commit, con sus comentarios de decisión,
por si la pieza vuelve alguna vez al perfil.

## Mensaje de Announcements (copiar tal cual)

Arranca la semana del stack.

Todo mi negocio corre con siete herramientas. Cinco no me cuestan nada.
La única factura que pago es Claude, y es para CONSTRUIR el sistema —
no para que el negocio siga andando. Eso ya no me cuesta.

Acá va el mapa completo, de una: las siete, con lo que cuesta cada una.

Esta semana, uno por día, les dejo el archivo de cada una: el que ya
está armado y probado. Hoy arranca con las seis respuestas de WhatsApp.

Afuera voy a contar de a una por video. Acá lo tienen entero.

## De dónde sale cada cosa que afirma (revisar antes de mandar)

| Lámina | Afirmación | Fuente |
|---|---|---|
| 01, 05 | **$200/mes**, una sola factura | `ONIA_ESTRATEGIA_DE_EMPRESA.md` §8.1 (US$200 ≈ Bs 2.304). La 02 es la única con costo |
| 01 | "16 años, una empresa en Bolivia" | [[sergio-menor-de-edad-quien-firma]] — la unipersonal está a nombre de Leslie; él la opera |
| 03 | Homelab **$0** | Sergio Urcullo, 06-sep: *"es una pc vieja que tengo"*. **NO lleva specs**: las de §8.1 son del VPS alquilado |
| 03 | n8n **open source**, corre en su servidor | licencia pública del proyecto |
| 03 | HyperFrames | `heygen-com/hyperframes`, de terceros. La lámina no reclama autoría |
| 03 | Hermes | `NousResearch/hermes-agent` — público, MIT. ⚠️ **NO es código suyo**: lo suyo es el `SOUL.md`, la memoria y la config |
| 04 | agenda y clientes | `ONIA_CATALOGO_DE_VENTA.md`: los dos 🟢. El chatbot es 🟢 en §5. **Sin precio de producto** |

## Lo que NO dice, y por qué

- **Ni un precio de Onia Platform.** Es contenido, no venta.
- **Chatwoot no aparece**, aunque está en el stack real: es la infraestructura del chatbot
  que se vende desde Onia Platform, y mostrarla con "$0" al lado le enseña al lector el
  camino para saltearse el producto.
- **Notion salió** el 06-sep: *"gratis, aunque ni lo uso"*. Una herramienta que no se usa
  vuelve mentira una pieza cuyo valor entero es que todas son reales.
- **"Próximamente" en la lámina 04** es una excepción explícita a `CLAUDE.md` §*La venta
  nunca exhibe obra*, ratificada por Sergio Urcullo el 06-sep con la regla delante.
  Registrada en la trampa #14 de la FICHA para que nadie la "corrija". ⚠️ Adentro de la
  comunidad esa palabra además **no choca con nada**: la regla protege la superficie de
  VENTA, y `ONIA_MARCA_PERSONAL_TRES_CARRILES.md` §3 dice que en la comunidad sí se puede
  mostrar obra en curso.

## ⚠️ Antes de mandarlo

- 👀 **Sergio Urcullo tiene que mirar las 5 láminas.** Van con su nombre y con su cara
  fuera de la pieza: la que queda es su cifra.
- **Los seis drops de la semana ya están escritos** (`cola/drops/2026-09-14..19.md`) y
  cada uno entrega su archivo. La pieza los promete: si un drop no sale, la promesa se
  rompe adentro, que es donde más caro cuesta.
