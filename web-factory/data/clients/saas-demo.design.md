# Auto Design Recipe - PulseOps Demo

Generated: 2026-06-26T21:50:14.502Z

## Decision

- Slug: `saas-demo`
- Template: `landing`
- Rubro inferido: SaaS / B2B software (saas-b2b)
- Confianza vertical: 0.67
- Objetivo: Explicar producto, valor y prueba para pedir demo.
- Direccion visual: Producto visible, flujo de problema a resultado, features agrupadas, prueba y CTA de demo.
- Tesis de conversion: El SaaS vende cuando el usuario ve el producto y entiende el antes/despues operativo.
- Riesgo generico a evitar: Hero abstracto con gradientes y features genericas que no muestran el sistema.

## Dials

- Conversion: high
- Densidad visual: medium
- Motion: medium
- Tono de confianza: moderno, operativo y orientado a decision

## Referencias Seleccionadas

| Rol | Fuente | Titulo | URL | Licencia | Por que | Screenshots |
|---|---|---|---|---|---|---|
| client-reference | Stripe | Stripe | https://stripe.com | client-provided-reference-review-required | referencia exacta entregada en el brief; usar: claridad de producto y CTA; evitar: copiar gradientes o identidad | sin screenshot |
| client-reference | Linear | Linear | https://linear.app | client-provided-reference-review-required | referencia exacta entregada en el brief; usar: sensacion de software pulido y foco en workflow; evitar: oscurecer demasiado la UI | sin screenshot |
| structure | SaaSFrame Landing Pages | Slite UX/UI Design and Copywrinting Examples - SaaSFrame | https://www.saasframe.io/saas/slite | inspiration-only | coincide con rubro: saas; tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; aporta links o bloques de codigo para estudiar; fuente fuerte para patrones web | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/saasframe-landing-pages/285-landing-page-4197935a/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/saasframe-landing-pages/285-landing-page-4197935a/mobile.png |
| structure | Landingfolio | HeadshotPro Landing Page Inspiration and More \| Landingfolio | https://www.landingfolio.com/inspiration/post/headshotpro-1 | inspiration-only | coincide con rubro: software; tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; aporta links o bloques de codigo para estudiar; fuente fuerte para patrones web | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/landingfolio/091-headshotpro-a3943c9a/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/landingfolio/091-headshotpro-a3943c9a/mobile.png |
| structure | Recent Design | Web Design Inspiration — Recent | https://recent.design/websites | inspiration-only | coincide con rubro: app; tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; fuente fuerte para patrones web | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/recent-design/003-websites-cd2e1db3/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/recent-design/003-websites-cd2e1db3/mobile.png |
| structure | Awwwards Winning Websites | Sui - Awwwards SOTD | https://www.awwwards.com/sites/sui | inspiration-only-high-overdesign-risk | coincide con rubro: app; tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; fuente fuerte para patrones web; requiere simplificar para ONIA | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/awwwards-winning-websites/479-holographik-99c60348/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/awwwards-winning-websites/479-holographik-99c60348/mobile.png |
| typography | Magic UI | Kinetic Text \| React Components & Templates | https://magicui.design/docs/components/kinetic-text | mit-open-source-reference | tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; aporta links o bloques de codigo para estudiar; fuente fuerte para patrones web; tiene pista de codigo reusable con review | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/magic-ui/007-introducing-kinetic-text-fbd94463/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/magic-ui/007-introducing-kinetic-text-fbd94463/mobile.png |
| component | shadcn/ui | Building Blocks for the Web - shadcn/ui | https://ui.shadcn.com/blocks/sidebar | mit-repo-available | coincide con rubro: app; tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; aporta links o bloques de codigo para estudiar; fuente fuerte para patrones web; tiene pista de codigo reusable con review | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/shadcn-ui/034-browse-more-blocks-11813c15/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/shadcn-ui/034-browse-more-blocks-11813c15/mobile.png |

## Codigo Referencial Permitido

| Repo | Archivo | Licencia | Senales | Por que |
|---|---|---|---|---|
| serafimcloud__21st | apps/web/components/features/studio/ui/studio-header.tsx | MIT | react-component, tailwind, motion, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; motion reusable con reduced-motion check; match de componente: feature |
| harshjdhv__componentry | packages/ui/src/components/flight-status-card.tsx | MIT | react-component, tailwind, motion, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; motion reusable con reduced-motion check |
| ibelick__motion-primitives | components/core/accordion.tsx | MIT | react-component, motion, shadcn | licencia MIT; patron shadcn revisable; motion reusable con reduced-motion check; match de componente: accordion |
| nolly-studio__cult-ui | apps/www/components/block-copy-button.tsx | MIT | react-component, tailwind, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; match de componente: button |
| serafimcloud__21st | apps/web/components/ui/bookmark-button.tsx | MIT | react-component, tailwind, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; match de componente: button |
| shadcn-ui__ui | apps/v4/registry/bases/base/blocks/dashboard-01/components/section-cards.tsx | MIT | react-component, tailwind, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; match de componente: dashboard |
| tremorlabs__tremor | src/components/Accordion/accordion.stories.tsx | MIT | react-component, tailwind, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; match de componente: accordion |
| tremorlabs__tremor | src/components/Button/button.stories.tsx | MIT | react-component, tailwind, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; match de componente: button |
| tremorlabs__tremor | src/components/Button/Button.tsx | MIT | react-component, tailwind, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; match de componente: button |
| harshjdhv__componentry | packages/ui/src/components/dither-prism-hero.tsx | MIT | react-component, tailwind, motion | licencia MIT; compatible con Tailwind/tokenizacion; motion reusable con reduced-motion check; match de componente: hero |

Regla: usar estos archivos solo como referencia compatible despues de review, retokenizacion, accessibility check y responsive QA.

## Plan De Secciones

| Seccion | Objetivo | Patron | Datos necesarios |
|---|---|---|---|
| Hero con producto | Mostrar la interfaz o un mock real desde el inicio. | Copy de problema, screenshot de producto, CTA demo. | screenshot, CTA, beneficio principal |
| Workflow | Conectar features con operaciones reales. | Tres pasos: capturar, automatizar, medir. | features, roles, integraciones |
| Plan y demo | Reducir friccion comercial. | Pricing simple o CTA demo si precio no esta definido. | precio, paquetes, contacto |

## Tokens

- Heading: Onest
- Body: Onest
- Senales de fuentes: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif, Montserrat, sans-serif, "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "Inter Tight", Geist, sans-serif, "Geist Mono", monospace, Geist, "Geist Fallback"
- Paleta: primary #2563eb, secondary #111827, accent #22c55e, bg #f9fafb, fg #111827

## Media

### Requerida
- Screenshot real, mock aprobado o video corto con poster

### Opcional
- Logos/testimonios con permiso
- Animacion de flujo

### Pedidos De Generacion
- No hace falta pedir generacion ahora.

## Implementacion
- Abrir screenshots desktop y mobile seleccionados antes de tocar layout.
- Elegir una referencia para estructura, una para tipografia/densidad, una para motion o componentes.
- Reconstruir patrones con tokens de ONIA; no pegar HTML/CSS cerrado de referencias inspiration-only.
- Usar solo codigo de repos `allowed-after-review` y registrar archivo exacto usado.
- Mapear cada seccion del plan a datos reales del cliente; eliminar secciones sin dato util.
- Validar hero, servicios, prueba/confianza y CTA principal.
- Aplicar direccion del rubro: Producto visible, flujo de problema a resultado, features agrupadas, prueba y CTA de demo.

## Guardrails
- No copiar identidad, copy, imagenes, videos, logos, claims ni estructura reconocible de terceros.
- No usar tres cards iguales si no cambian la decision del cliente.
- No usar gradientes genericos ni paletas de un solo tono como solucion visual principal.
- Primer viewport debe tener una senal real del negocio: producto, lugar, equipo, dashboard, proyecto o resultado.
- Todo video debe tener poster, carga diferida y respeto a `prefers-reduced-motion`.
- Cada bloque debe justificar venta, confianza, entendimiento de alcance o siguiente paso.
- No inventar metricas, clientes, testimonios ni resultados.
- Riesgo especifico: Hero abstracto con gradientes y features genericas que no muestran el sistema.

## QA
- Correr `pnpm test`.
- Generar preview con `pnpm generate <slug> --template <landing|store>` o `pnpm factory:build`.
- Revisar desktop y mobile con screenshot antes de enviar a cliente.
- Confirmar que no hay imagenes rotas ni videos con carga inmediata pesada.
- Confirmar contraste, foco visible, labels en forms y CTA accesible.
- Confirmar que cada URL externa abre y que WhatsApp/email funcionan.
- Probar nav, CTA primario y secciones de servicio/contacto.

## Warnings
- Sin warnings.
