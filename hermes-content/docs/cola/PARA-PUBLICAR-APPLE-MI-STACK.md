# CARRUSEL "Mi stack" — listo para pegar

**Piezas:** `carousels/out/apple-mi-stack-inter/lamina-01..09.png` (9 láminas, 1080×1350).
Hoja para mirarlas juntas antes de subir: `carousels/out/HOJA-apple-mi-stack-inter.png`.

Primera pieza del patrón **`apple-editorial`** (referencias que mandó Sergio Urcullo el
06-sep; receta en `references/ui-patterns/apple-editorial/FICHA.md`). Tipografía **Inter**,
elegida por él mirando el A/B.

Objetivo: autoridad + guardable. **No se vende nada: la única lámina de producto va sin
precio.**

## Orden de las 9 láminas

| # | Lámina | Qué dice |
|---|---|---|
| 01 | Portada | Todo mi negocio corre con **SIETE COSAS**, y cinco cuestan $0 |
| 02 | Claude Max | La capa que piensa · **$200/mes** — lo único caro, y es para construir |
| 03 | Homelab | Una PC vieja que ya tenía · **$0** |
| 04 | n8n | Las automatizaciones · **$0** · open source |
| 05 | WhatsApp Business | Donde le escriben los clientes · **$0** |
| 06 | HyperFrames | Video desde HTML · **$0** |
| 07 | Hermes | Agente open source (MIT) con el alma escrita por él · **$0** |
| 08 | Onia Platform | Lo que está construyendo · **Próximamente** |
| 09 | Cierre | Siete herramientas, **una factura**, **$200** al mes |

**El arco:** arranca por lo caro (Claude), baja a cinco cosas que no cuestan nada, y cierra
con lo único que él construyó. La 08 es la que abre curiosidad antes del cierre.

## Caption (IG · copiar tal cual)

Todo mi negocio corre con siete herramientas. Cinco no me cuestan nada.

La única factura que pago es Claude, y es para CONSTRUIR el sistema —
no para que el negocio siga andando. Eso ya no me cuesta.

El servidor es una PC vieja que tenía guardada. Las automatizaciones,
la bandeja de mensajes y el motor de video corren ahí adentro y no
suman un peso. El agente que me avisa cuando algo se rompe es open
source: yo sólo le escribí el alma.

Si estás esperando "tener presupuesto" para automatizar tu negocio,
mirá otra vez la lista. Casi todo ya es gratis. Lo que falta es
sentarse a armarlo.

¿Cuál te falta a vos? Decímelo en los comentarios.

## Versión X / LinkedIn (mismo contenido, sin carrusel)

Tengo 16 años, una empresa en Bolivia, y todo el negocio corre con siete
herramientas. Cinco no me cuestan nada.

La única factura es Claude, y es para construir el sistema — no para que
funcione. El servidor es una PC vieja. Las automatizaciones, la bandeja de
mensajes y el motor de video viven ahí adentro. El agente que me avisa cuando
algo se rompe es open source.

Si estás esperando presupuesto para automatizar, mirá otra vez: casi todo ya
es gratis. Lo que falta es sentarse a armarlo.

## Alt text (accesibilidad · pegar en "Configuración avanzada")

> Carrusel de nueve láminas sobre fondo gris claro. Cada una muestra el ícono de una
> herramienta y su costo mensual: Claude Max 200 dólares, y luego Homelab, n8n, WhatsApp
> Business, HyperFrames y Hermes, todas en cero. La última es Onia Platform, marcada como
> próximamente. Cierra con el total: siete herramientas, una factura, 200 dólares al mes.

## De dónde sale cada cosa que afirma (revisar antes de publicar)

| Lámina | Afirmación | Fuente |
|---|---|---|
| 02 | Claude Max **$200/mes** | `ONIA_ESTRATEGIA_DE_EMPRESA.md` §8.1, tabla de estructura de costos (US$200 ≈ Bs 2.304) |
| 03 | "una PC vieja que ya tenía" | Sergio Urcullo, 06-sep: *"es una pc vieja que tengo"*. **NO lleva specs**: las "4 vCPU / 16 GB / 41 contenedores" de §8.1 son del VPS alquilado, no de esta máquina |
| 04 | n8n **open source** | licencia pública del proyecto; corre dentro de su servidor, sin costo adicional |
| 05 | Meta no le cobra el transporte | `ONIA_ESTRATEGIA_DE_EMPRESA.md` §8.1: "Transporte de Meta — Bs 0 para nosotros, desde el 2026-08-21 lo paga el cliente en SU cuenta" |
| 06 | el teaser se renderizó **en 30 segundos** | `ONIA_MARCA_PERSONAL_BASE_CONTENIDO.md` §1, fila HyperFrames |
| 07 | Hermes es **open source MIT** | `gh repo view NousResearch/hermes-agent` → público, MIT, Python. ⚠️ **NO es código suyo**: lo suyo es el `SOUL.md`, la memoria y la config. La lámina dice exactamente eso |
| 08 | agenda y clientes | `ONIA_CATALOGO_DE_VENTA.md`: los dos 🟢. El chatbot es 🟢 en su §5. **Sin precio de producto** |
| 09 | total **$200**, una factura | 02 es la única con costo. El VPS de §8.1 sigue vivo pero Sergio Urcullo decidió el 06-sep **no ponerlo** en la pieza |

## Lo que NO dice, y por qué

- **Ni un precio de Onia Platform.** Es contenido, no venta. La regla del carril: las piezas
  de contenido no llevan precio de producto.
- **Ningún "comentá PALABRA".** La cuenta `@sergiourcullo` tiene `palabras: {}` en el
  workflow n8n activo de private-reply (medido 04-sep): una palabra clave hoy sale con
  `palabra=null` y **quien comenta no recibe nada, sin dejar registro**. El CTA pide un
  comentario que Sergio Urcullo contesta él.
- **Chatwoot no aparece**, aunque está en el stack real. Es la infraestructura del chatbot
  que se vende desde Onia Platform: mostrarla con "$0" al lado le enseña al lector el camino
  para saltearse el producto.

## ⚠️ Pendiente antes de publicar

- **"Próximamente" en la lámina 08** es una excepción explícita a `CLAUDE.md` §*La venta
  nunca exhibe obra*, ratificada por Sergio Urcullo el 06-sep con la regla delante. Está
  registrada en la trampa #14 de la FICHA para que nadie la "corrija".
