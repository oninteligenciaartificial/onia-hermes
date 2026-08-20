# Práctica 2026-08-20 — Cotizador para una importadora (Bolivia)

Pieza del bucle de práctica (PLANTILLA_PROMPT_PRACTICA.md). Entrenamiento y banco de
referencias, NO material de venta. Todo dato es de ejemplo y está marcado como tal.

## El brief

- **Sorteo**: "un cotizador para una importadora en Bolivia".
- **Modo loco**: "que cierre la venta en menos de 60 segundos".
- Respuesta al modo loco: el flujo entero son **2 clics + 1 botón**, cero campos de
  texto. Paso 1 pide un CLIC (qué traés), paso 2 un CLIC (cuánto pesa), y el paso 3 es
  el recibo ya armado con un solo CTA que lleva el monto adentro. Nadie tipea nada.
- Escena que forzó el tema claro: importador en su tienda a plena luz del día, celular
  en mano, clientes esperando: quiere UN número ya.

## Referencia: Stripe Checkout — las 3 mecánicas robadas

Miradas en la página pública del producto (stripe.com/payments/checkout) y el panel de
configuración del demo (checkout.stripe.dev). Solo estructura, cero assets.

1. **Resumen siempre visible con total vivo.** El pedido y el total están en pantalla
   todo el tiempo y se recalculan con cada elección. Acá: recibo sticky en desktop,
   barra inferior con total en móvil.
2. **La vía rápida primero.** Stripe pone wallets/Link (un clic) ANTES del formulario
   de tarjeta y pide datos solo al final. Acá: el flujo entero es de clics; el dato de
   contacto ni se pide (el CTA abre WhatsApp).
3. **UN solo botón primario con el monto adentro** ("Pay $128.40") y las señales de
   confianza pegadas al botón. Acá: "Pedir esta cotización · Bs 4.264" + "Sin registro ·
   Respuesta por WhatsApp · Precios de ejemplo" debajo.
   Refinamiento sobre la mecánica 1: la barra móvil se esconde cuando el recibo está en
   pantalla (IntersectionObserver): el resumen colapsado desaparece cuando ves el
   completo.

## Required Qualities (design-quality.md) — pasó 5 de 10, listón ≥4

| # | Quality | Veredicto |
|---|---|---|
| 1 | Jerarquía por escala | ✅ h1 2.8em/lh1 vs cuerpo; el total (1.7em mono) es lo más grande del recibo |
| 2 | Ritmo intencional | ✅ 3.5em → 3em → 1.1em → 0.7em: el espacio se aprieta con la densidad; todo en em |
| 5 | Color semántico | ✅ verde SOLO = elegido/CTA/foco (regla de marca "verde = estado") |
| 6 | Estados diseñados | ✅ hover/active/checked/focus-visible distintos en filas, chips y CTA |
| 9 | Motion que aclara | ✅ todo movimiento es causal: detalle al elegir, barra solo cuando sirve |
| 3, 4, 8 | Capas / tipografía / textura | a medias (recibo dentado, mono-para-plata; stack de sistema por la regla "sin fonts externas"): no se contaron |
| 7 | Editorial grid-breaking | ❌ no lo intenta: layout documental |
| 10 | Dataviz | n/a |

Prohibidos: ninguno (sin card grid idéntico, sin hero-metric, sin modal, sin
side-stripe, sin gradient text, sin glassmorphism).

## Leyes del pattern bank aplicadas (verificadas con grep/cálculo, no estimadas)

- **Ritmo anclado (ley Fanvue, ANATOMIA_DE_UNA_WEB §3)**: TODO el espaciado en `em`
  colgado de UN `font-size` por breakpoint (16px móvil / 17px ≥768px). `clamp()` = 0.
- **`transition: all` = 0**; toda transición nombra su propiedad; hover a 0.15s.
- **`prefers-reduced-motion` → `transition: none`** (el fix real del pattern bank
  contra el bug de propiedades discretas, no 0.01ms).
- **`line-height: 1` en display** (h1, total del recibo, total de la barra).
- **Escalera de popups**: el paso 1 pide un CLIC, no datos. Los datos: ninguno.
- Contraste medido (script WCAG): peor par ink-faint/verde-50 = 4.59:1 (AA ✓);
  blanco/verde-600 = 5.66:1 (AA ✓). Tokens de ONIA_BRAND_2026.

## Interacción nombrada (punto 5 del molde)

La carga elegida **se despliega ahí mismo** mostrando vía, tarifa, tránsito y qué
incluye. Sin animar layout: aparece con fade de 0.2s.

## Capturas

- `captura-desktop-inicial.png` / `captura-desktop.png` — 1440, vacío y con selección.
- `captura-movil-inicial.png` — 390, fullPage.
- `captura-movil-barra.png` — 390, arriba de página con barra de total viva.
- `captura-movil-recibo.png` — 390, recibo en pantalla (la barra se escondió).

## Qué NO se pudo verificar

- El interior del checkout real de Stripe (iframe cross-origin de js.stripe.com): las
  3 mecánicas salen de la página pública del producto y del panel del demo, no de leer
  el DOM del formulario final.
