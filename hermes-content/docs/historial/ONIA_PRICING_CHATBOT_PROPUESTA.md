# Propuesta de pricing — add-on Chatbot de Onia

> **Este documento es un INSUMO para que Sergio decida. No cambia ningún precio por sí
> solo.** Los precios de Onia se LEEN de `onia-platform/lib/pricing.ts` (add-ons) y
> `onia-platform/lib/subscription-plans.ts` (planes). Si Sergio elige una opción, el
> cambio se hace ahí y este doc se edita para reflejarlo.
>
> Pedido de Sergio (2026-08-30): "armá tus propuestas mirando otros competidores y me
> volvés a preguntar; recordá el trabajo que es hacer una web y después conectarlo;
> mirá Sendy que es una de nuestras mayores competencias y qué nos hace mejores que
> ellos, para el mercado boliviano."
>
> **Tipo de cambio usado: 1 USD ≈ Bs 11,4** (devaluación 2026; el oficial pasó de 6,96
> a ~11,37). Todos los Bs de competidores salen de esa conversión.

---

## 1. Tabla comparativa — qué paga de verdad un negocio boliviano

Punto de partida vigente de Onia: **add-on chatbot Bs 390/mes** (decisión 21-ago: solo
mensualidad, sin costo de instalación, el cliente paga a Meta directo por sus
conversaciones de WhatsApp). El add-on se vende sobre un plan del sistema (planes
390/890/1990, lanzamiento 320/750/1500) — la comparación de abajo es honesta con eso:
los competidores venden el chat suelto; Onia vende el chat **dentro** de un sistema.

Las tarifas de Meta por conversación de WhatsApp API son **neutras**: las paga el
cliente en TODOS los caminos oficiales (Onia incluido, por diseño). Solo el QR
no-oficial de Sendy las evita — a cambio del riesgo de baneo del número.

| Competidor | Plan de entrada real | Costo mensual TOTAL estimado (Bs) | Qué NO incluye |
|---|---|---|---|
| **Sendy** (mirado en vivo, cuenta de Sergio, 2026-08-30) | Plan 0 $19 = Bs 217. Pero la IA es **BYOK**: el cliente crea SU cuenta de OpenAI, pone tarjeta internacional en USD y paga su consumo aparte. Y el plan 0 topa a **150 chats IA/día**. El primer nivel sin límite es $39 = Bs 445. 21 niveles hasta ~$800 | **Bs 240–560+** (217 + consumo IA estimado Bs 25–115 + o saltar a 445 para sacarse el límite) | IA incluida (BYOK), canal web propio (es WhatsApp-only), sistema de gestión (su CRM es aparte del negocio), visión de fotos no vista, línea QR = no-oficial con riesgo de baneo, guardrails deterministas |
| **Leadsales** (leadsales.io/en/pricing, oficial, 2026-08-30) | Basic $97/mes (3 usuarios, 5.000 conversaciones, SIN difusiones) = **Bs 1.106**. Professional $133 = Bs 1.516 | **Bs 1.106+** | Es CRM+bandeja con auto-respuestas (Leadbot), no un asistente IA que agenda; cero ERP (agenda, caja, inventario); usuario extra $13 = Bs 148 c/u |
| **Cliengo** (cliengo.com/pricing, oficial, 2026-08-30) | Starter $45/mes (500 conversaciones, 2 usuarios) = **Bs 513** — y **SIN WhatsApp API**: la API oficial recién aparece en Business $259 = **Bs 2.953** | **Bs 513** solo-web con tope de 500 conv.; **Bs 2.953** si querés WhatsApp oficial | WhatsApp API en los planes accesibles; sistema de gestión; el alta de WhatsApp es asistida por ejecutivo (días). ⚠️ El tope de 500 conv. NO se le reprocha: es el mismo que el nuestro |
| **Treble.ai** | **Sin precio público** — venta por sales call. Terceros (review Hack'celeration 2026) reportan base SMB ~$399/mes = **Bs ~4.550** | **Bs ~4.550+** (no verificable en su web) | Precio transparente; foco es marketing masivo enterprise, no atención de un negocio chico; cero ERP |
| **ManyChat** (manychat.com bloqueó el fetch directo; roundups 2026 consistentes: chatbot.com, flowgent.ai, setsmart.io) | Pro $39/mes mensual ($29 anual) con 2.500 contactos; WhatsApp exige Pro; **AI es add-on aparte: +$29/mes** | **Bs 775** (39+29 = $68) + recargos por contactos extra ($0,018–0,10 c/u) que crecen solos con la lista | Bandeja de equipo seria, IA en el precio base, soporte en español local, sistema de gestión; el costo real reportado a un año: $200–350/mes |
| **Onia — add-on chatbot** | **Bs 390/mes** todo incluido (equiv. $34) | **Bs 390** — la IA va adentro (gpt-4.1-mini vía LiteLLM propio, costo medido: Bs 0,008/foto; centavos/chat), **500 conversaciones al mes incluidas** (recarga de 200 por Bs 190, vence con el mes) | Nada de lo de arriba falta. Lo que sí: el add-on vive sobre un plan del sistema (desde Bs 390, lanzamiento 320) — el total de un cliente nuevo con sistema + bot es Bs 780 (710 en lanzamiento), y eso incluye el ERP entero |

**Lectura en una línea**: incluso sumando el plan base del sistema, Onia con chatbot
(Bs 780) cuesta menos que Leadsales solo (Bs 1.106), que Cliengo con WhatsApp oficial
(Bs 2.953) y que ManyChat con IA (Bs 775, y este sin bandeja seria ni sistema) — y es
el único donde la bandeja del bot vive DENTRO del sistema que ya tiene la agenda, la
ficha y la caja, sin una segunda herramienta que pagar y conectar.

> ⚠️ **Corregido el 2026-08-31.** Acá decía *"es el único donde la cita cae en la agenda y
> el cobro en la caja del mismo sistema"*. **Es falso hoy y era el argumento que sostenía
> el precio:** el bot NO agenda ni carga nada — un pedido de cita lo ESCALA a una persona
> (`bot/recepcionista.mjs:232`), el canal `whatsapp_chatwoot → lead_conversacion` de
> `lib/onia-core/intake.ts:15` **no lo llama nadie** y `bot_conversations` no existe en el
> schema. Es el mismo defecto que ya se corrigió en `lib/pricing.ts` (commit `f47d615`, punto
> 2 de `ONIA_DEFINICION_DE_TERMINADO.md`): la copia sobrevivió acá. El escalón barato que lo
> volvería cierto está cotizado en `ONIA_NIVEL_REFERENTES_BRECHA.md` §"agenda".)

---

## 2. El costo real de la alternativa: armarlo por partes

Es el argumento que pidió Sergio ("recordá el trabajo que es hacer una web y después
conectarlo"). Todo competidor de la tabla **asume que el negocio YA tiene dónde vivir
el chat** y alguien que lo conecte. Armar por partes lo que el add-on trae junto:

| Pieza | Por partes (rangos conservadores, estimados) | En Onia |
|---|---|---|
| Una web donde viva el widget | Builder tipo Wix/Squarespace: ~$16–29/mes = **Bs 180–330/mes**, o pagar una web a un freelance (pago único variable, más el mantenimiento) | El canal web del bot es self-service: botón "Encender mi canal web" + snippet para pegar. Y si el cliente no tiene web, Onia se la vende como línea aparte (`ONIA_WEB_COMO_SE_VENDE.md`) |
| La plataforma del bot | **Bs 217–1.106/mes** (tabla de arriba) | Incluida en el add-on |
| La IA | BYOK estilo Sendy: cuenta OpenAI + **tarjeta internacional en USD** (fricción real para un dueño de negocio boliviano) + consumo variable estimado **Bs 25–115/mes** sin tope propio | Incluida en el add-on, hasta 500 conversaciones al mes, con el gasto de IA controlado por Onia (sin tarjeta en USD del cliente) |
| Conexión WhatsApp oficial | Verificación de negocio en Meta + configuración técnica: horas propias o pagadas; en Cliengo la API aparece recién a Bs 2.953/mes con alta asistida "de días" | Alta guiada (Embedded Signup); el cliente paga a Meta directo sus conversaciones, como en todos lados |
| Bandeja para atender lo que el bot deriva | Incluida a medias (ManyChat básica) o en el plan caro | Bandeja nativa en el sistema, con candado bot-humano (el bot se aparta cuando contesta el dueño y vuelve al resolver) |
| Alguien que lo configure y lo retoque | Cada cambio de horario, precio o guion = tocar flujos o pagarle a quien sepa | El dueño lo edita **conversando** ("atendé también los domingos") con validador que no deja publicar nada roto; guion visible en pasos numerados |
| Dónde cae lo que el bot levanta | El bot de terceros anota en SU CRM: la cita y el cobro se re-digitan en otra herramienta, que además hay que pagar aparte | **Hoy también se cargan a mano** — el bot deriva y una persona anota — pero se anotan **en el mismo sistema** que ya tiene agenda, ficha y caja (QR BCP en mock listo), sin una segunda suscripción ni una segunda base. ⚠️ **No se vende que el bot agende solo: no lo hace** |

**Suma por partes**: **Bs 420–1.550+/mes** en suscripciones sueltas, más el trabajo de
pegarlas y mantenerlas — para terminar con un bot que vive en una herramienta aparte de
tu agenda y tu caja.
Los rangos son estimaciones conservadoras marcadas como tales; los precios duros son
los de la tabla 1.

---

## 3. Tres opciones de pricing para decidir

### Opción A — Bs 390 plano, todo incluido (statu quo)

- **Pro**: un solo número, la venta más simple posible; el argumento anti-Sendy es
  directo ("IA incluida sin límite, sin cuenta de OpenAI, sin 150 chats/día"); el
  costo variable real es trivial (centavos por chat, Bs 0,008/foto) así que el margen
  aguanta.
- **Contra**: no captura al que solo quiere el widget web barato, y no deja escalón
  para cobrar más cuando existan difusiones o multi-número.

### Opción B — dos escalones: solo-web más barato + completo Bs 390

Ej.: "Chat web" Bs 190–240 (solo widget en la web, misma IA) y "Completo" Bs 390
(+ WhatsApp). Responde la pregunta que quedó abierta en el handoff del carril
(escalón sin WhatsApp).

- **Pro**: puerta de entrada más barata para el que duda; el upgrade a WhatsApp es
  natural cuando ve que funciona.
- **Contra**: con 0 clientes pagando es complejidad sin demanda probada — dos SKUs que
  explicar y mantener, y el escalón barato compite contra nuestro propio 390 antes de
  que nadie haya pagado ninguno. Riesgo de anclar bajo.

### Opción C — Bs 390 + nivel "Pro" Bs 590–690 (futuro)

El 390 queda como está; se crea un nivel superior recién cuando haya features vivas
que lo justifiquen (difusiones/broadcast, multi-número, frase activadora por anuncio
— las copias de Sendy que ya están en el plan del carril).

- **Pro**: ancla el 390 como estándar y deja el camino de upsell listo sin tocar el
  precio de hoy ni frenar ventas.
- **Contra**: hoy no existe ninguna feature viva que justifique el Pro — crearlo ya
  sería vender futuro, y la regla del proyecto lo prohíbe (la venta no exhibe obra).

### Recomendación: A hoy, con C como camino ya decidido

Mantener **Bs 390 plano** mientras haya 0 clientes pagando: un número simple vende
más fácil, ya es más barato que todo lo comparable CON IA incluida, y el equilibrio
del add-on son 3 clientes. Cuando difusiones o multi-número estén **vivos y
verificados**, se enciende el nivel Pro (C) sin tocar el 390. B se archiva: si en la
calle aparece repetido "solo quiero el chat de la web", se reabre con demanda real,
no antes.

---

## 4. El pitch de una frase contra Sendy (mercado boliviano)

> **"Sendy te alquila un vendedor que anota en un cuaderno aparte y te hace pagar la
> IA de tu bolsillo, en dólares y con tarjeta internacional; en Onia son Bs 390 con la
> IA adentro y en bolivianos, y la bandeja adentro del mismo sistema donde ya están
> tu agenda, tus fichas y tu caja."**

⚠️ **El volumen NO es nuestro argumento y no se usa como tal: Sendy da chats ilimitados
a $39 y nosotros atendemos 500 conversaciones al mes.** Si el prospecto lo pregunta, la
respuesta honesta ya está escrita en el §3 de `ONIA_SENDYPRO_ANALISIS.md`: el 1-oct-2026
Meta empieza a facturar también las respuestas, así que prometer ilimitado sobre un costo
que sube es firmar un pasivo abierto — 500 + Meta al costo es más feo de vender y más
honesto de sostener. Para dimensionar: 500 conversaciones/mes son ~16 por día.

Variante corta para material de venta: *"Con otros, el bot atiende en una herramienta que
pagás aparte. Con Onia, atiende adentro de tu sistema."*

> ⚠️ **Corregido el 2026-08-31.** El pitch decía *"cada cita queda EN tu agenda y cada cobro
> EN tu caja"* y la variante corta *"tu sistema ya lo tiene anotado"*. **El bot no anota
> nada** — ver la corrección de §1. Prometerlo en la frase de cierre es donde más caro sale:
> es lo primero que un prospecto prueba en la demo.

---

## Fuentes

- **Sendy**: teardown en vivo desde la cuenta de Sergio, 2026-08-30
  (`hermes-content/research/competencia/SENDYPRO_TEARDOWN.md`) — 21 niveles $19–~$800,
  BYOK de IA, 150 chats IA/día en plan 0, 3 tipos de conexión, cobro Hotmart/Yape.
- **Leadsales**: https://leadsales.io/en/pricing/ (página oficial, consultada
  2026-08-30) — Basic $97 / Professional $133 / Advanced $247.
- **Cliengo**: https://www.cliengo.com/pricing (página oficial, consultada 2026-08-30)
  — Starter $45 / Premium $119 / Business $259 (WhatsApp API solo desde Business).
- **Treble.ai**: sin pricing público en su web (venta por sales call). Referencia de
  terceros: review Hack'celeration 2026 (~$399/mes base SMB). **No verificable en
  fuente oficial — declararlo así si se usa en material de venta.**
- **ManyChat**: manychat.com/pricing bloqueó la consulta directa (403). Cifras de
  roundups 2026 consistentes entre sí (chatbot.com/blog/manychat-pricing,
  flowgent.ai/blog/manychat-pricing, setsmart.io/blog/manychat-pricing): Pro $39/mes
  mensual ($29 anual), WhatsApp exige Pro, AI add-on +$29/mes, overage por contactos.
- **Onia**: add-on Bs 390 (decisión 21-ago, memoria `precio-chatbot-390-sin-instalacion`);
  planes 390/890/1990 lanzamiento 320/750/1500 (`lib/subscription-plans.ts`); estado
  real del chatbot: `ONIA_CATALOGO_DE_VENTA.md` §5 y `handoff/chatbot.md`; costo de
  visión medido Bs 0,008/foto (memoria `onia-agentes-costo-api-cero` + handoff v5).
