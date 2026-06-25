# Auto Design Recipe - Luma Skin Demo

Generated: 2026-06-25T20:31:23.711Z

## Decision

- Slug: `skincare-demo`
- Template: `store`
- Rubro inferido: Ecommerce skincare / beauty (skincare-ecommerce)
- Confianza vertical: 1
- Objetivo: Vender productos con claridad, confianza y asistencia antes de compra.
- Direccion visual: Editorial de producto, superficies limpias, packshots grandes, comparacion simple y CTA comercial persistente.
- Tesis de conversion: La persona no compra por decorar la pagina; compra cuando entiende producto, uso, precio y canal de asistencia.
- Riesgo generico a evitar: Caer en una tienda beige generica con tres cards iguales, fotos rotas y claims cosmeticos vagos.

## Dials

- Conversion: high
- Densidad visual: medium
- Motion: medium
- Tono de confianza: comercial claro con cuidado experto, sin prometer resultados medicos

## Referencias Seleccionadas

| Rol | Fuente | Titulo | URL | Licencia | Por que | Screenshots |
|---|---|---|---|---|---|---|
| client-reference | Glossier | Glossier | https://www.glossier.com | client-provided-reference-review-required | referencia exacta entregada en el brief; usar: claridad de producto, aire visual y CTA directo; evitar: copiar identidad, tono o claims | sin screenshot |
| client-reference | The Ordinary | The Ordinary | https://theordinary.com | client-provided-reference-review-required | referencia exacta entregada en el brief; usar: jerarquia de producto y explicacion funcional; evitar: estetica demasiado clinica | sin screenshot |
| motion | Lapa Ninja | Hero Studios - Landing Page Design \| Lapa Ninja | https://www.lapa.ninja/post/hero-studios/ | inspiration-only | tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; fuente fuerte para patrones web | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/lapa-ninja/149-hero-studios-572d5ecf/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/lapa-ninja/149-hero-studios-572d5ecf/mobile.png |
| conversion | SaaSFrame Landing Pages | Slite UX/UI Design and Copywrinting Examples - SaaSFrame | https://www.saasframe.io/saas/slite | inspiration-only | tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; aporta links o bloques de codigo para estudiar; fuente fuerte para patrones web | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/saasframe-landing-pages/285-landing-page-4197935a/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/saasframe-landing-pages/285-landing-page-4197935a/mobile.png |
| conversion | SaaS Landing Page | Mobbin page - SaaS Landing Page | https://saaslandingpage.com/mobbin/ | inspiration-only | tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; fuente fuerte para patrones web | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/saaslandingpage/023-mobbin-041ae462/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/saaslandingpage/023-mobbin-041ae462/mobile.png |
| structure | Landingfolio | HeadshotPro Landing Page Inspiration and More \| Landingfolio | https://www.landingfolio.com/inspiration/post/headshotpro-1 | inspiration-only | tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; aporta links o bloques de codigo para estudiar; fuente fuerte para patrones web | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/landingfolio/091-headshotpro-a3943c9a/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/landingfolio/091-headshotpro-a3943c9a/mobile.png |
| typography | Fontpair | Icons Library — Free Open-Source SVG Icon Sets \| Fontpair | https://fontpair.co/icons | typography-reference | tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; aporta links o bloques de codigo para estudiar | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/fontpair/088-fontpair-8ba6d672/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/fontpair/088-fontpair-8ba6d672/mobile.png |
| component | Magic UI | Magic UI | http://magicui.design/ | mit-open-source-reference | tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; aporta links o bloques de codigo para estudiar; fuente fuerte para patrones web; tiene pista de codigo reusable con review | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/magic-ui/242-magicui-design-6edb6ee7/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/magic-ui/242-magicui-design-6edb6ee7/mobile.png |

## Codigo Referencial Permitido

| Repo | Archivo | Licencia | Senales | Por que |
|---|---|---|---|---|
| ibelick__motion-primitives | components/core/accordion.tsx | MIT | react-component, motion, shadcn | licencia MIT; patron shadcn revisable; motion reusable con reduced-motion check; match de componente: accordion |
| shadcn-ui__ui | apps/v4/registry/bases/base/blocks/dashboard-01/components/section-cards.tsx | MIT | react-component, tailwind, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; match de componente: card |
| tremorlabs__tremor | src/components/Accordion/accordion.stories.tsx | MIT | react-component, tailwind, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; match de componente: accordion |
| ibelick__motion-primitives | components/core/carousel.tsx | MIT | react-component, tailwind, motion | licencia MIT; compatible con Tailwind/tokenizacion; motion reusable con reduced-motion check; match de componente: carousel |
| harshjdhv__componentry | packages/ui/src/components/circuit-board.tsx | MIT | react-component, tailwind, motion, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; motion reusable con reduced-motion check |
| harshjdhv__componentry | packages/ui/src/components/collection-surfer.tsx | MIT | react-component, tailwind, motion, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; motion reusable con reduced-motion check |
| markmead__hyperui | .agents/skills/building-components/references/polymorphism.mdx | MIT | react-component, tailwind, motion, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; motion reusable con reduced-motion check |
| nolly-studio__cult-ui | apps/www/components/cli-registry-snippet.tsx | MIT | react-component, tailwind, motion, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; motion reusable con reduced-motion check |
| serafimcloud__21st | apps/web/components/features/studio/ui/studio-header.tsx | MIT | react-component, tailwind, motion, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; motion reusable con reduced-motion check |
| ibelick__motion-primitives | components/website/card-example-landing.tsx | MIT | react-component, tailwind | licencia MIT; compatible con Tailwind/tokenizacion; match de componente: card |

Regla: usar estos archivos solo como referencia compatible despues de review, retokenizacion, accessibility check y responsive QA.

## Plan De Secciones

| Seccion | Objetivo | Patron | Datos necesarios |
|---|---|---|---|
| Hero de producto | Mostrar oferta, categoria principal y CTA antes del primer scroll. | Hero split con producto real o poster ligero, bullets de compra y CTA a catalogo/WhatsApp. | heroPoster o heroImage, CTA, categorias, 2 productos destacados |
| Catalogo escaneable | Permitir comparar productos sin repetir informacion en secciones secundarias. | Grid con filtros simples, imagen estable, precio, categoria, beneficios y accion. | productos, imagenes, precios, categorias |
| Guia de rutina | Ayudar a elegir segun necesidad sin convertir la pagina en blog. | Tres pasos maximo: elegir, consultar, comprar. Si hay rutina real, ordenar por paso. | beneficios, uso, ordenRutina |
| Confianza y FAQ | Reducir dudas comerciales y legales antes de escribir. | Preguntas compactas sobre disponibilidad, precios, envio, asistencia y limites. | politicas, metodos de pago, contacto |
| CTA final | Cerrar con accion directa y sin repetir todo el catalogo. | Bloque corto con carrito/cotizacion o WhatsApp. | canal de conversion |

## Tokens

- Heading: Onest
- Body: Onest
- Senales de fuentes: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif, Montserrat, sans-serif, Inter, Inter_Fallback, Outfit, Outfit_Fallback, "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", Geist, sans-serif, Geist, system-ui, -apple-system, sans-serif
- Paleta: primary #0f766e, secondary #263238, accent #e2a86b, bg #fbfaf7, fg #151716

## Media

### Requerida
- Hero poster liviano o imagen principal con permiso de uso.
- Imagen por producto o placeholder aprobado para cada producto publicado.
- 2 producto(s) sin imagen en catalogo.

### Opcional
- Micro video de uso del producto con poster
- Fotos de textura o detalle

### Pedidos De Generacion
- Pedir o generar asset hero para Luma Skin Demo: visual real del rubro, limpio, con espacio para copy y sin logos de terceros.
- Pedir fotos o generar placeholders aprobados para: Gel limpiador suave, Crema barrera hidratante.

## Implementacion
- Abrir screenshots desktop y mobile seleccionados antes de tocar layout.
- Elegir una referencia para estructura, una para tipografia/densidad, una para motion o componentes.
- Reconstruir patrones con tokens de ONIA; no pegar HTML/CSS cerrado de referencias inspiration-only.
- Usar solo codigo de repos `allowed-after-review` y registrar archivo exacto usado.
- Mapear cada seccion del plan a datos reales del cliente; eliminar secciones sin dato util.
- Validar catalogo, carrito/cotizacion, productos sin imagen, precios y CTA de WhatsApp.
- Aplicar direccion del rubro: Editorial de producto, superficies limpias, packshots grandes, comparacion simple y CTA comercial persistente.

## Guardrails
- No copiar identidad, copy, imagenes, videos, logos, claims ni estructura reconocible de terceros.
- No usar tres cards iguales si no cambian la decision del cliente.
- No usar gradientes genericos ni paletas de un solo tono como solucion visual principal.
- Primer viewport debe tener una senal real del negocio: producto, lugar, equipo, dashboard, proyecto o resultado.
- Todo video debe tener poster, carga diferida y respeto a `prefers-reduced-motion`.
- Cada bloque debe justificar venta, confianza, entendimiento de alcance o siguiente paso.
- No publicar producto sin imagen o precio/estado comercial claro salvo que sea cotizacion asistida.
- Riesgo especifico: Caer en una tienda beige generica con tres cards iguales, fotos rotas y claims cosmeticos vagos.

## QA
- Correr `pnpm test`.
- Generar preview con `pnpm generate <slug> --template <landing|store>` o `pnpm factory:build`.
- Revisar desktop y mobile con screenshot antes de enviar a cliente.
- Confirmar que no hay imagenes rotas ni videos con carga inmediata pesada.
- Confirmar contraste, foco visible, labels en forms y CTA accesible.
- Confirmar que cada URL externa abre y que WhatsApp/email funcionan.
- Probar agregar producto, abrir carrito, quitar producto y checkout/cotizacion.

## Warnings
- Faltan assets visuales; pedirlos o generarlos antes de entrega profesional.
