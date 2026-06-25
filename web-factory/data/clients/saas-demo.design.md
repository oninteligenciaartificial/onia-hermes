# Auto Design Recipe - PulseOps Demo

Generated: 2026-06-25T20:30:20.947Z

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
| motion | Lapa Ninja | Hero Studios - Landing Page Design \| Lapa Ninja | https://www.lapa.ninja/post/hero-studios/ | inspiration-only | coincide con rubro: saas; tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; fuente fuerte para patrones web | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/lapa-ninja/149-hero-studios-572d5ecf/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/lapa-ninja/149-hero-studios-572d5ecf/mobile.png |
| structure | SaaSFrame Landing Pages | Slite UX/UI Design and Copywrinting Examples - SaaSFrame | https://www.saasframe.io/saas/slite | inspiration-only | coincide con rubro: saas; tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; aporta links o bloques de codigo para estudiar; fuente fuerte para patrones web | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/saasframe-landing-pages/285-landing-page-4197935a/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/saasframe-landing-pages/285-landing-page-4197935a/mobile.png |
| structure | SaaS Landing Page | Mobbin page - SaaS Landing Page | https://saaslandingpage.com/mobbin/ | inspiration-only | coincide con rubro: saas, app; tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; fuente fuerte para patrones web | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/saaslandingpage/023-mobbin-041ae462/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/saaslandingpage/023-mobbin-041ae462/mobile.png |
| structure | Mobbin Web | Beautiful SaaS Dashboards Collection by @alexbarreto | https://mobbin.com/collections/e9ede7f5-31ff-4ca1-acda-771fee465ed9/web/screens | flow-reference-only | coincide con rubro: saas, dashboard, app; tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; fuente fuerte para patrones web | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/mobbin-web/021-view-collection-beautiful-saas-dashboards-44e47f62/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/mobbin-web/021-view-collection-beautiful-saas-dashboards-44e47f62/mobile.png |
| typography | Fontpair | Icons Library — Free Open-Source SVG Icon Sets \| Fontpair | https://fontpair.co/icons | typography-reference | tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; aporta links o bloques de codigo para estudiar | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/fontpair/088-fontpair-8ba6d672/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/fontpair/088-fontpair-8ba6d672/mobile.png |
| component | shadcn/ui | Building Blocks for the Web - shadcn/ui | https://ui.shadcn.com/blocks/sidebar | mit-repo-available | coincide con rubro: app; tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; aporta links o bloques de codigo para estudiar; fuente fuerte para patrones web; tiene pista de codigo reusable con review | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/shadcn-ui/034-browse-more-blocks-11813c15/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/shadcn-ui/034-browse-more-blocks-11813c15/mobile.png |

## Codigo Referencial Permitido

| Repo | Archivo | Licencia | Senales | Por que |
|---|---|---|---|---|
| serafimcloud__21st | apps/web/components/features/studio/ui/studio-header.tsx | MIT | react-component, tailwind, motion, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; motion reusable con reduced-motion check; match de componente: feature |
| ibelick__motion-primitives | components/core/accordion.tsx | MIT | react-component, motion, shadcn | licencia MIT; patron shadcn revisable; motion reusable con reduced-motion check; match de componente: accordion |
| nolly-studio__cult-ui | apps/www/components/block-copy-button.tsx | MIT | react-component, tailwind, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; match de componente: button |
| shadcn-ui__ui | apps/v4/registry/bases/base/blocks/dashboard-01/components/section-cards.tsx | MIT | react-component, tailwind, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; match de componente: dashboard |
| tremorlabs__tremor | src/components/Accordion/accordion.stories.tsx | MIT | react-component, tailwind, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; match de componente: accordion |
| tremorlabs__tremor | src/components/Button/button.stories.tsx | MIT | react-component, tailwind, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; match de componente: button |
| tremorlabs__tremor | src/components/Button/Button.tsx | MIT | react-component, tailwind, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; match de componente: button |
| harshjdhv__componentry | packages/ui/src/components/circuit-board.tsx | MIT | react-component, tailwind, motion, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; motion reusable con reduced-motion check |
| harshjdhv__componentry | packages/ui/src/components/collection-surfer.tsx | MIT | react-component, tailwind, motion, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; motion reusable con reduced-motion check |
| markmead__hyperui | .agents/skills/building-components/references/polymorphism.mdx | MIT | react-component, tailwind, motion, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; motion reusable con reduced-motion check |

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
- Senales de fuentes: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif, Montserrat, sans-serif, Inter, Inter_Fallback, Outfit, Outfit_Fallback, saans, "saans Fallback", sans-serif, Geist, sans-serif, Geist, system-ui, -apple-system, sans-serif
- Paleta: primary #2563eb, secondary #111827, accent #22c55e, bg #f9fafb, fg #111827

## Media

### Requerida
- Screenshot real, mock aprobado o video corto con poster

### Opcional
- Logos/testimonios con permiso
- Animacion de flujo

### Pedidos De Generacion
- Pedir o generar asset hero para PulseOps Demo: visual real del rubro, limpio, con espacio para copy y sin logos de terceros.

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
- Faltan assets visuales; pedirlos o generarlos antes de entrega profesional.
