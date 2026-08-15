# UI/UX trending en GitHub — decisión para Onia (2026-08-01)

Carril I (research). Pedido de Sergio: "mirá en GitHub qué está funcionando ahora mismo en UI/UX/frontend para mejorar nuestra UI".
Método: `gh search repos` + `gh api repos/<r>` (estrellas y actividad verificadas HOY, 2026-08-01) + READMEs de los 12 más relevantes. Cero fuentes web: GitHub alcanzó.

Contexto propio: landing `onia.com.bo` (Next 15.5, CSS modules + tokens, Archivo, verde/tinta, rediseño estilo Fanvue, budget <150kb) · app `app.onia.com.bo` (Next 16, Tailwind v4 + tokens Onia, shadcn parcial) · regla anti-template.

---

## 1. Top 5 patrones UI/UX que HOY funcionan

1. **Componentes por registry: copiar el código, no instalar el kit.** shadcn/ui (120.287★, activo hoy) se redefine como "code distribution platform"; magicui, kibo, animate-ui y coss distribuyen igual (CLI `shadcn add` + MCP). → En el app: todo componente nuevo entra por registry-copy y se re-tokeniza a paleta Onia; NUNCA un npm UI-kit como dependencia. Es exactamente nuestra regla anti-template, ahora es EL estándar del ecosistema.
2. **Tema profundo sobre variables, no defaults.** tweakcn (jnsahaj/tweakcn, 10.223★, Apache-2.0) existe porque "websites made with shadcn/ui famously look the same" (su README). → Valida nuestro re-skin Tailwind v4→tokens Onia; usar tweakcn UNA vez para exportar la paleta verde/tinta como theme completo (charts, sidebar, radii) en vez de mapear variables a mano.
3. **Números que se mueven = percepción de producto vivo.** number-flow (barvian/number-flow, 7.597★, MIT) es el patrón dominante en pricing y dashboards SaaS 2025-26. → Precios de la landing (790/1.500 animándose al cambiar de paquete) y KPIs del panel/app.
4. **Motion con presupuesto: entradas reveal + springs, solo transform/opacity.** motion (motiondivision/motion, ex Framer Motion, 33.042★, MIT) es el estándar; react-bits (44.625★) y motion-primitives (5.788★) son los catálogos de referencia. → El carrusel de funciones estilo Fanvue de la landing se hace con springs de Motion (LazyMotion ~5kb) o CSS scroll-driven; compositor-friendly, cabe en el budget.
5. **Bloques de marketing componibles (bento, marquee de logos, beam).** magicui (21.765★, MIT, "UI library for design engineers") y kibo (shadcnblocks/kibo, 3.886★, MIT) empaquetan los bloques que hoy usan todas las landings SaaS. → Robar la ESTRUCTURA (bento de funciones, marquee de clientes, sección de precios) y portarla a nuestros tokens/Archivo; no importar su estética.

## 2. Top 3 librerías a ADOPTAR

| Lib | Estrellas (verif. 2026-08-01) | Licencia | Peso | Para qué exacto |
|---|---|---|---|---|
| `motion` (motiondivision/motion) | 33.042★ | MIT | ~5,8kb con LazyMotion | Carrusel landing + transiciones del app; reemplaza JS de scroll a mano |
| `number-flow` (barvian/number-flow) | 7.597★ | MIT | ~4kb | Precios landing, contadores panel, KPIs app |
| `sonner` (emilkowalski/sonner) | 12.747★ | MIT | ~5kb | Toasts del app (default de shadcn; hoy tenemos feedback pobre) |

Suplente: `vaul` (8.526★, MIT) para drawers móviles del app — último push oct-2025, estable pero mantenimiento lento; adoptar solo si el drawer nativo de shadcn no alcanza.

**NO adoptar aunque esté de moda:**
- **coss / Origin UI** (cosscom/coss, 10.369★): Origin UI fue absorbido por Cal.com y el repo es **AGPL-3.0**. Prohibido copiar componentes de ahí a productos propietarios — gotcha real de licencia 2026.
- **react-bits como dependencia** (44.625★, MIT + Commons Clause): OK copiar componentes a NUESTRAS apps y webs de clientes; prohibido revenderlos como kit/plantilla. Usar como catálogo de inspiración, portar a mano.
- **heroui (30.273★) / daisyui (41.905★)**: kits completos = look de template instantáneo. Contra nuestra regla anti-template; además duplican lo que ya tenemos con shadcn+tokens.
- **canvas-ui (DavidHDev, 2.880★, nuevo 2026) y paper-design/shaders (3.238★)**: WebGL/shaders sobre el DOM. Lindo, pero revienta el budget <150kb y el GPU de un Android de gama media en Bolivia.
- **lenis smooth-scroll (15.192★)**: scroll-jacking castiga INP móvil y no vende nada a un dentista.
- **Base UI (mui/base-ui, 10.516★, MIT)**: los ex-Radix hicieron primitivas nuevas; Radix (19.110★) sigue activo. Observar, no migrar — shadcn ya nos abstrae.

## 3. Micro-interacciones que marcan diferencia y CABEN en el budget

- **number-flow en precios** al alternar Landing/Web Pro — la micro-interacción con mejor ROI/kb del año.
- **Hover/focus states diseñados** (translate-y 2px + shadow en cards, subrayado animado en nav): CSS puro, 0kb, es lo primero que separa template de producto.
- **Reveal por sección con CSS scroll-driven animations** (`animation-timeline: view()`, nativo, 0 JS) con fallback a IntersectionObserver — para el rediseño Fanvue de la landing.
- **Springs de Motion en el carrusel de funciones** (drag + snap): un solo import LazyMotion.
- **sonner** en cada acción del app (guardado, cita creada, factura emitida) — feedback = confianza para el comprador B2B.
- Trend observado pero NO para nosotros: gooey-toast (anl331/goey-toast, 1.169★, nuevo — toasts que "morfan" en blob). Divertido, cero valor para gestión de clínicas.

## 4. Honesto: qué del trending es RUIDO para un SaaS B2B boliviano

El público (dentistas, ferreteros) entra desde Android de gama media con datos móviles y decide por claridad + precio + botón de WhatsApp. Es ruido para nosotros:
- Heros con shaders/WebGL/3D (canvas-ui, spline, unicorn-studio) — costo en kb y GPU, cero conversión B2B local.
- Smooth-scroll y scroll-jacking cinematográfico (lenis) — frustra en móvil.
- Efectos cursor-follow / spotlight — no existen en touch, que es el 90% de nuestro tráfico.
- Chat-widget IA en la landing "porque todos lo tienen" — nuestro canal ES WhatsApp; duplicar confunde.
- Dark mode por default — la moda dev no es el gusto del dueño de negocio; nuestro verde/tinta claro diferencia más.

Lo que SÍ importa del trending y adoptamos: registry + tokens propios (§1.1-1.2), 3 libs chicas MIT (§2), micro-interacciones baratas (§3). Todo lo demás se mira, no se compra.

---
Fuentes: cifras vía `gh api repos/<repo>` el 2026-08-01. Repos citados: shadcn-ui/ui 120.287★ · react-bits 44.625★ · daisyui 41.905★ · motion 33.042★ · heroui 30.273★ · GSAP 27.285★ (licencia propia, gratis post-Webflow) · magicui 21.765★ · radix-ui/primitives 19.110★ · react-spectrum 15.744★ · lenis 15.192★ · shadcn-admin 12.783★ · fumadocs 12.760★ · sonner 12.747★ · base-ui 10.516★ · coss 10.369★ (AGPL) · tweakcn 10.223★ · vaul 8.526★ · number-flow 7.597★ · motion-primitives 5.788★ · kibo 3.886★ · paper-shaders 3.238★ · canvas-ui 2.880★ · goey-toast 1.169★.
