# Con qué está hecho el mercado — 29 sitios premium medidos (2026-08-29)

Pregunta de Sergio: *"¿estás usando React o qué para las webs? tenés que
analizar eso"*. Se detectó el stack por firmas en el HTML servido de los sitios
del corpus (Scrapling). No es opinión: es lo que declara cada sitio.

## Conteo (29 sitios con firma detectable, de 36 del corpus)

| Tecnología | Sitios | Qué es |
|---|---:|---|
| **Webflow** | 12 (41%) | builder visual no-code → emite **HTML+CSS+JS estático** |
| Tailwind (util) | 8 | framework de utilidades CSS |
| **Next.js/React** | 6 (21%) | framework React — solo en productos/apps |
| Framer | 4 | builder visual no-code → estático |
| Shopify | 4 | plataforma ecommerce |
| GSAP | 4 | librería de animación (los de motion pesado) |
| Vite / WordPress / Astro | 2 c/u | bundler / CMS / framework de contenido |

## La lectura — y por qué VALIDA nuestra doctrina de dos niveles

1. **El mercado de landings premium NO se hace con React a mano.** 41% es
   **Webflow** y otro bloque es **Framer**: builders visuales que producen
   exactamente lo que produce nuestro motor — **HTML+CSS estático**, cero React
   en runtime. Nuestro nivel 1 está en la MISMA categoría de output que la
   herramienta líder del rubro, pero templatizado, automático y sin el costo
   mensual de Webflow.
2. **React/Next.js aparece justo donde nosotros usaríamos nivel 2**: los 6 son
   productos/SaaS/apps (Cleo, Dawn, Mintlify, Matic, Usefoulplay, Elevate) —
   sitios que SON una aplicación o necesitan estado dinámico. Es el corte
   web-vs-sistema que ya usamos para cotizar, confirmado en la calle.
3. **Shopify = ecommerce** (4, todos del rubro moda/tienda): el carrito serio
   es plataforma, no una landing. Coincide con nuestro nivel 2 / template store.
4. **GSAP marca los de motion pesado** (Clay, Infinite Machine, Frequency,
   Readily). Tenemos las skills gsap-* disponibles: candidato para nivel 2; el
   nivel 1 se mantiene CSS-only (transform/opacity) para no pagar peso.

## ⚠️ Corrección de dirección (Sergio, 2026-08-29)

*"queremos animaciones, no sitios estáticos, por eso next.js, css, react y
demás"*. La palabra "estático" se malinterpretó: **estático = sin runtime de
React / hosting simple, NO sin movimiento.** Un Webflow es "estático" y a la vez
está lleno de animación (GSAP apareció en los 4 más impactantes). Pero la
DIRECCIÓN de Onia es **animación primero**, y para el mejor techo de animación
el vehículo es **React/Next + librería de motion**, no HTML crudo.

## Doctrina corregida — animación primero

| Tier | Cuándo | Stack | Motion |
|---|---|---|---|
| **Premium animado (DEFAULT para vender)** | landing/sitio de cliente que quiere impacto | **Next.js 15 + React 19 + CSS** | **motion.dev (Framer Motion)** para reveals/orquestación + **GSAP + ScrollTrigger** para scroll-scrub/timelines. View Transitions donde aplique |
| Ligero/rápido | cliente que prioriza costo/velocidad, o micrositio | motor estático generado | CSS-only (transform/opacity, scroll-driven `animation-timeline`) + GSAP puntual |
| Producto/app/tienda | login, carrito, panel, datos | Next.js 15 + React 19 | motion.dev + GSAP |

**Ya lo tenemos montado**: `apps/onia-platform/src/motion` usa motion.dev con
reveals reales; hay skills `gsap-*` instaladas (core, scrolltrigger, react,
timeline). El techo de animación premium ya vive en el repo — se porta al
sitio de cliente, no se inventa.

**Lo que el mercado confirma**: los sitios más animados del corpus (Clay,
Infinite Machine, Frequency, Readily) usan **GSAP**; los productos usan
**Next/React**. Vamos por ese combo para el tier premium.

- Fuente cruda: `scratchpad/corpus/stack.json` (por sitio) + `stack-detect.py`.
