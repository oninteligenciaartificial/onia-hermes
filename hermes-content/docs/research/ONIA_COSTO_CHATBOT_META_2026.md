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
3. **Lo que sí sube es lo que paga el CLIENTE a Meta.** Una clínica con 800 conversaciones al mes puede pagarle a Meta
   tanto como a Onia. Si no se lo decimos en la venta, se entera con la factura.

## (a) Tarifas de Meta para Bolivia («Rest of Latin America», por mensaje entregado, desde el 1-oct-2026)

| Categoría | USD | Bs (11,37) | Gratis cuándo |
|---|---|---|---|
| Servicio (respuesta libre dentro de las 24 h, de una persona o del bot) | 0,0113 | 0,128 | Ver el conflicto de abajo; también gratis si la conversación llega por un anuncio de clic a WhatsApp |
| Utility (plantilla: recordatorio, confirmación) | 0,0113 | 0,128 | Desde el 1-oct ya NO es gratis dentro de la ventana de 24 h; baja por volumen |
| Authentication | 0,0113 | 0,128 | Igual que utility |
| Marketing | 0,0740 | 0,841 | Solo en la ventana del anuncio |

Fuente: developers.facebook.com/documentation/business-messaging/whatsapp/pricing (CSV «Tarifas en USD», sección
«Effective October 1, 2026»). El mensaje que manda el paciente no se cobra.

⚠️ **CONFLICTO sin resolver: ¿hay 1.000 mensajes de servicio gratis por mes?**
- **Sí, 1.000 por número y por mes, sin acumular:** lo leyó un subagente el 4-oct en la página de precios
  («Updated: 30 sep 2026», sección «Free tier of monthly service messages»). Wati dice lo mismo.
- **No, ninguno:** lo leyó la plataforma el 28-sep en la página `.../pricing/non-template-messages`
  («Volume tiers: None»). Así está en `pricing.ts` y en el aviso del panel (`lib/chatbot/meta-cobra-el-servicio.ts`).
- «Volume tiers» quiere decir descuento por volumen, no tramo gratis: puede que las dos sean ciertas y que el panel
  lea mal. **Se resuelve MIRANDO la página renderizada** (la versión markdown está desactualizada). Hasta entonces, el
  panel queda del lado seguro: decirle al dueño que cargue la tarjeta.

## (b) Cuánto cuesta por mes una clínica de 2-6 profesionales

Supuestos: 3 a 6 mensajes del bot por conversación (`pricing.ts`); Bs 0,128 por mensaje; el plan trae 500
conversaciones y cada recarga son 200 por Bs 190. No se cuentan los recordatorios (utility), que se suman aparte.

| Conversaciones/mes | Meta → lo paga el CLIENTE (sin tramo gratis) | Con 1.000 gratis | Onia cobra | A Onia le cuesta (IA) |
|---|---|---|---|---|
| 300 | Bs 116 – 231 | Bs 0 – 103 | Bs 390 | Bs 1 – 3 |
| 800 | Bs 308 – 617 | Bs 180 – 488 | Bs 390 + 2 recargas = 770 | Bs 2 – 9 |
| 1.500 | Bs 578 – 1.157 | Bs 450 – 1.028 | Bs 390 + 5 recargas = 1.340 | Bs 3 – 17 |

Lo que paga el cliente en total por mes, sin tramo gratis: **Bs 506-621 · Bs 1.078-1.387 · Bs 1.918-2.497**.
La infraestructura fija (Chatwoot en el VPS) se reparte entre todos los clientes y no cambia con el volumen.

## (c) ¿Bs 390 alcanza? Recomendación para Sergio Urcullo

- **Mantener Bs 390.** Cubre el costo de Onia con ~99 % de margen, y sigue por debajo de los planes con IA de la
  competencia (USD 45-99 o más; ver `research/competencia/WATI_FICHA.md`, `LEADSALES_FICHA.md`).
- **No cobrar el consumo de Meta.** Onia no puede facturarlo (sin línea de crédito) y meterse en la cadena de pago
  agrega riesgo sin margen.
- **Decirle al cliente cuánto le va a cobrar Meta, ANTES de que contrate:** una línea en /precios y en la demo
  («con 300 conversaciones, Meta te cobra unos Bs 120-230 al mes en tu tarjeta»), con el número que salga de
  resolver el conflicto. Hoy el texto de `pricing.ts` dice que lo cobra Meta, pero no cuánto.
- **Para clínicas de mucho volumen:** con 1.500 conversaciones, el cliente paga Bs 950 en recargas. Hay que decidir si
  le conviene más un plan que incluya el agente (`CHATBOT_DESDE_EL_PLAN`). Es una decisión de precio, de Sergio Urcullo.
- **Detalle para Plataforma:** `pricing.ts` tiene `utilityBob: 0.113`, que no coincide con la cuenta derivada
  (0,0113 × 11,37 = Bs 0,128). Parece un resto del tipo de cambio viejo.
