# Cinco formatos de anuncio estático para Meta — "S-Tier Ads"

- **Fuente:** https://www.instagram.com/p/DblcFzIt9UL/ · 32 s · talking-head con locución (inglés)
- **Visto:** 2026-08-12 (Gemini nativo + Whisper/Speaches)
- **Archivo:** `Instagram-DblcFzIt9UL.mp4` (no versionado)
- **Lectura completa + transcripción literal:** [transcripciones/2026-08-12-Instagram-DblcFzIt9UL.md](transcripciones/2026-08-12-Instagram-DblcFzIt9UL.md)

## Qué dice realmente

Enumeración a un ítem cada ~5 segundos: cinco formatos de **anuncio estático** (imagen, no
video) para Meta, cada uno con un ejemplo real en pantalla y una sola regla dicha en voz:

1. **[00:02-00:07] News headline** — pieza con formato de nota de prensa. Ejemplo: la marca
   Frive anunciando un premio gastronómico. Regla: *"top of funnel"*, se lee como publicación
   de medio, *"so people don't realise this is an ad"*.
2. **[00:07-00:12] Problem / solution** — ejemplo AG1 (síntoma vs solución nutricional).
   Regla: *"the clearest mid-funnel static there is, but make sure you name the exact pain
   point or pay double the CPA"*.
3. **[00:12-00:17] Text on skin** — frase emotiva superpuesta sobre el cuerpo del modelo
   (hombrera ortopédica). Regla: *"unique yet personal"*, un thumb-stop.
4. **[00:17-00:22] The receipt** — la oferta completa maquetada como ticket de compra.
   Regla: *"your whole offer is line items. Feels native to the user"*.
5. **[00:22-00:27] Censored ad** — fondo borroso + etiqueta de advertencia sobre el texto
   *"Get Better Skin"*. Regla: *"a blur, a warning label, and curiosity does the rest.
   Top of this list for CTR"*.

Cierre **[00:27-00:31]:** CTA de palabra clave — comentar `RECEIPT` para recibir *Adscore.ai*,
una extensión de Chrome que promete ver los anuncios ganadores de cualquier marca con su gasto.

**Las cifras son rótulos, no prueba.** Cada formato lleva en pantalla un par vistas·gasto
(`5.5M views · $82k`, `5.6M · $83.9k`, `3.8M · $57.6k`, `4.3M · $64.3k`, `6.9M · $102.8k`)
— **a verificar**: son la salida de la herramienta que el propio video vende, sin cuenta ni
captura de resultados detrás, y gasto alto sólo indica que la marca dejó el anuncio corriendo,
no que haya vendido. No repetir ninguna como dato propio.

**El texto en pantalla manda sobre el audio** (regla del corpus): Whisper transcribió
*"S tier adds engineer to break"* y *"foam stops"*; el rótulo dice `S-Tier Ads (BREAK the meta
algorithm)` y el término real es *thumb stop*.

## Veredicto: MEJORA LO ACTUAL

Cero capacidad nueva: son cinco moldes de dirección de arte para imagen estática, y las
producimos hoy con lo instalado (pipeline propio brief→HTML/CSS→PNG on-brand con brand kits,
o imagen Higgsfield a 0,12 créditos). Nada que comprar, nada que aprender.

No llega a `SIRVE YA` por dos razones concretas:

- **Como anuncios no se pueden ejecutar.** El motor de Meta Ads está deployado en DRY (cero
  gasto), la verificación de negocio está en pausa (bloqueo S5) y la cuenta publicitaria no
  tiene método de pago. Un catálogo de formatos de pauta no destraba nada de eso.
- **No tapa el hueco que la síntesis le adjudicó.** Los cinco ejemplos son ecommerce DTC
  gringo (comida, suplemento, hombrera, skincare). Ninguno le habla al dueño de negocio formal
  boliviano. Sigue vacío el hueco #1 del corpus (primer cliente B2B pagando en Bolivia).

Lo que sí cambia algo: **2 de los 5 formatos son transferibles tal cual a lo orgánico**, que es
lo único que podemos publicar hoy. `The receipt` es el más directo — nuestros paquetes ya están
itemizados en el generador de propuestas, maquetarlos como ticket es una pieza sin cara, sin
voz y sin créditos. `Problem / solution` con la regla dura (*nombrar el dolor exacto*) sirve de
gate de copy para cualquier estático nuestro.

Los otros tres no se copian y conviene dejarlo escrito: `text on skin` pide cuerpo o producto
físico (no aplica a software B2B); `news headline` exige un hecho noticiable real y hoy no
tenemos ninguno — fabricarlo está prohibido; `censored ad` es cebo de curiosidad que quema
credibilidad justo con el comprador al que hay que verse formal.

## Para qué nos sirve

| Frente | Acción concreta |
|---|---|
| Marketing con IA (orgánico) | Producir el estático `recibo`: los paquetes del generador de propuestas maquetados como ticket, con el pipeline HTML/CSS→PNG que ya existe. Cero créditos |
| Marketing con IA (copy) | Adoptar la regla `problem/solution` como gate: si el estático no nombra el dolor exacto del rubro, no sale. Vale para los seis rubros vendibles |
| Meta Ads | Banco de formatos para cuando se destrabe S5 + método de pago. Hoy no se ejecuta: motor en DRY, cero gasto |
| INFLUENCERS IA / video | No aplica: son estáticos. No gastar Higgsfield video en esto |
| Herramientas | Adscore.ai queda **descartado**: es plataforma paga externa sin permiso de gasto, y sirve para espiar pauta ajena que hoy no corremos |

## Riesgo

Tres, en orden:

1. **Citar las cifras.** Los pares vistas·gasto vienen de la herramienta que el video promociona
   y no tienen fuente. No entran en ninguna propuesta, pitch ni doc interno.
2. **Copiar `news headline` sin hecho real.** Maquetar un premio, un ranking o una mención de
   prensa que no existe es fabricar — prohibido por regla dura, y con el comprador B2B
   boliviano es exactamente el error que nos saca de la mesa.
3. **`Censored ad` con audiencia equivocada.** El borroso + etiqueta de advertencia funciona en
   skincare DTC; en venta de software a un dueño de negocio formal lee como clickbait. Además,
   el formato "parece contenido, no anuncio" que el propio video celebra (*"people don't
   realise this is an ad"*) roza la política de Meta sobre publicidad engañosa — verificar antes
   de usarlo si algún día se paga pauta.
