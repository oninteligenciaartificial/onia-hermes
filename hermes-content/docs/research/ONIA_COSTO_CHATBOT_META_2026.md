# Costo real del agente de WhatsApp (Bs 390) con las tarifas de Meta de oct-2026

> 4-oct-2026 · madre v2, por pedido de Sergio Urcullo vía madre v1. Solo lectura: `pricing.ts` no se tocó (lo decide él).
> **META:** saber si Bs 390 cubre el costo y deja margen desde que Meta cobra las respuestas del bot.
> **PRUEBA DE HECHO:** tarifas de la página oficial de Meta + `lib/pricing.ts` de onia-platform (`origin/master`).
> **REGLA DE PARADA:** si dos fuentes oficiales se contradicen, se muestran las dos y no se elige la más linda.

## Lo que cambia decisiones

1. **A Onia, Meta no le cuesta nada.** Con Embedded Signup el cliente conecta SU número y carga SU tarjeta: un Tech
   Provider no tiene línea de crédito (developers.facebook.com/documentation/business-messaging/whatsapp/solution-providers/overview).
   Así está hecho en el producto (`lib/pricing.ts`: «Onia sale de la cadena de pago de los mensajes»).
2. **Bs 390 cubre de sobra el costo de Onia:** la IA cuesta de Bs 0,002 a 0,011 por conversación (medido en LiteLLM el
   10-sep, `pricing.ts`, comentario de `RECARGA_CONVERSACIONES`). El margen es de ~99 %.
3. **Lo que sí sube es lo que paga el CLIENTE a Meta, pero menos de lo que se temía:** los primeros 1.000 mensajes de
   servicio del mes son gratis por cada número. Una clínica chica (300 conversaciones) paga entre Bs 0 y 103; una de
   800, entre Bs 180 y 488. Hay que decírselo en la venta.
4. **Las conversaciones que llegan por un anuncio de clic a WhatsApp no le cuestan nada al cliente durante 7 días.**
   Eso sirve directo para nuestra pauta.

## (a) Tarifas de Meta para Bolivia («Rest of Latin America», por mensaje entregado, desde el 1-oct-2026)

| Categoría | USD | Bs (11,37) | Gratis cuándo |
|---|---|---|---|
| Servicio (respuesta libre dentro de las 24 h, de una persona o del bot) | 0,0113 | 0,128 | **Los primeros 1.000 del mes por número**, sin acumular; y en la ventana del anuncio |
| Utility (plantilla: recordatorio, confirmación) | 0,0113 | 0,128 | Desde el 1-oct ya NO es gratis dentro de la ventana de 24 h; baja por volumen; gratis en la ventana del anuncio |
| Authentication | 0,0113 | 0,128 | Igual que utility |
| Marketing | 0,0740 | 0,841 | Solo en la ventana del anuncio |

Fuente: developers.facebook.com/documentation/business-messaging/whatsapp/pricing («Updated: 30 sep 2026»; CSV «Tarifas
en USD»), mirada renderizada en Chrome por la madre v1 el 4-oct. El mensaje que manda el paciente no se cobra.

- **Tramo gratis de servicio:** 1.000 por número y por mes, se reinicia a medianoche (zona de la cuenta), desde el
  1-oct-2026; Meta cobra desde el 1.001. Sin método de pago, entrega los 1.000 y después deja de entregar: la tarjeta
  hay que cargarla igual. ⚠️ El aviso del panel (`lib/chatbot/meta-cobra-el-servicio.ts`) y `pricing.ts` dicen que
  NO hay tramo gratis, porque leyeron «Volume tiers: None» (que significa descuento por volumen) en otra página el 28-sep.
  Exageran el costo: Plataforma tiene que corregirlos con esta fuente.
- **Ventana del anuncio (FEP):** si el paciente llega desde un anuncio de clic a WhatsApp y se le responde dentro de la
  ventana, se abren hasta **7 días** (antes eran 72 h) sin cobro de marketing, utility, authentication ni servicio.
- **Política de «AI Providers»:** el cambio del 1-oct no se les aplica, porque tienen una política propia
  (.../pricing/ai-providers, del 16-feb-2026, actualizada el 12-may-2026). Esa política define como «AI Provider» a
  quien provee o desarrolla IA (modelos de lenguaje, asistentes de propósito general). **No hay una frase explícita que
  excluya a un negocio que contesta a sus propios clientes con un bot**, pero hoy esa política solo cobra en Brasil (desde
  el 11-mar-2026; Europa dejó de cobrarse el 13-may-2026). Para Bolivia no cambia nada hoy. Se vuelve a mirar si Meta
  la extiende a otros países.

## (b) Cuánto cuesta por mes una clínica de 2-6 profesionales

Supuestos: 3 a 6 mensajes del bot por conversación (`pricing.ts`); 1.000 gratis por mes; Bs 0,128 cada uno a partir
del 1.001; el plan trae 500 conversaciones y cada recarga son 200 por Bs 190. No se cuentan los recordatorios (utility),
que se suman aparte, ni las conversaciones que vienen de un anuncio (gratis 7 días).

| Conversaciones/mes | Mensajes del bot | Meta → lo paga el CLIENTE | Onia cobra | A Onia le cuesta (IA) |
|---|---|---|---|---|
| 300 | 900 – 1.800 | Bs 0 – 103 | Bs 390 | Bs 1 – 3 |
| 800 | 2.400 – 4.800 | Bs 180 – 488 | Bs 390 + 2 recargas = 770 | Bs 2 – 9 |
| 1.500 | 4.500 – 9.000 | Bs 450 – 1.028 | Bs 390 + 5 recargas = 1.340 | Bs 3 – 17 |

Lo que paga el cliente en total por mes: **Bs 390-493 · Bs 950-1.258 · Bs 1.790-2.368**.
La infraestructura fija (Chatwoot en el VPS) se reparte entre todos los clientes y no cambia con el volumen.

## (c) ¿Bs 390 alcanza? Recomendación para Sergio Urcullo

- **Mantener Bs 390.** Cubre el costo de Onia con ~99 % de margen, y sigue por debajo de los planes con IA de la
  competencia (USD 45-99 o más; ver `research/competencia/WATI_FICHA.md`, `LEADSALES_FICHA.md`).
- **No cobrar el consumo de Meta.** Onia no puede facturarlo (sin línea de crédito) y meterse en la cadena de pago
  agrega riesgo sin margen.
- **Decirle al cliente cuánto le va a cobrar Meta, ANTES de que contrate:** una línea en /precios y en la demo, por
  ejemplo «una clínica con 300 conversaciones al mes casi no paga a Meta: los primeros 1.000 mensajes son gratis».
  Hoy el texto de `pricing.ts` dice que lo cobra Meta, pero no cuánto.
- **Para clínicas de mucho volumen:** con 1.500 conversaciones, el cliente paga Bs 950 en recargas. Hay que decidir si
  le conviene más un plan que incluya el agente (`CHATBOT_DESDE_EL_PLAN`). Es una decisión de precio, de Sergio Urcullo.
- **Detalle para Plataforma:** `pricing.ts` tiene `utilityBob: 0.113`, que no coincide con la cuenta derivada
  (0,0113 × 11,37 = Bs 0,128). Parece un resto del tipo de cambio viejo.
