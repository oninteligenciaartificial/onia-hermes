# Auto Design Recipe - Mesa Norte Demo

Generated: 2026-06-25T20:30:18.826Z

## Decision

- Slug: `restaurant-demo`
- Template: `landing`
- Rubro inferido: Restaurant / hospitality (restaurant-hospitality)
- Confianza vertical: 0.67
- Objetivo: Convertir apetito e intencion local en reserva, pedido o visita.
- Direccion visual: Fotografia protagonista, menu corto, horarios visibles, ubicacion y CTA de reserva sin friccion.
- Tesis de conversion: El visitante decide rapido si quiere ir o pedir; la web debe mostrar comida, precio relativo, horario y canal.
- Riesgo generico a evitar: Usar textos gourmet vacios y no mostrar platos, horarios ni direccion.

## Dials

- Conversion: medium
- Densidad visual: high
- Motion: low
- Tono de confianza: cercano y sensorial, con informacion practica primero

## Referencias Seleccionadas

| Rol | Fuente | Titulo | URL | Licencia | Por que | Screenshots |
|---|---|---|---|---|---|---|
| client-reference | Sweetgreen | Sweetgreen | https://www.sweetgreen.com | client-provided-reference-review-required | referencia exacta entregada en el brief; usar: menu visual, ritmo limpio y CTA visible; evitar: look corporativo frio | sin screenshot |
| motion | Lapa Ninja | Hero Studios - Landing Page Design \| Lapa Ninja | https://www.lapa.ninja/post/hero-studios/ | inspiration-only | coincide con rubro: menu; tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; fuente fuerte para patrones web | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/lapa-ninja/149-hero-studios-572d5ecf/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/lapa-ninja/149-hero-studios-572d5ecf/mobile.png |
| structure | SaaSFrame Landing Pages | Slite UX/UI Design and Copywrinting Examples - SaaSFrame | https://www.saasframe.io/saas/slite | inspiration-only | tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; aporta links o bloques de codigo para estudiar; fuente fuerte para patrones web | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/saasframe-landing-pages/285-landing-page-4197935a/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/saasframe-landing-pages/285-landing-page-4197935a/mobile.png |
| structure | SaaS Landing Page | Mobbin page - SaaS Landing Page | https://saaslandingpage.com/mobbin/ | inspiration-only | coincide con rubro: menu; tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; fuente fuerte para patrones web | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/saaslandingpage/023-mobbin-041ae462/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/saaslandingpage/023-mobbin-041ae462/mobile.png |
| structure | Landingfolio | HeadshotPro Landing Page Inspiration and More \| Landingfolio | https://www.landingfolio.com/inspiration/post/headshotpro-1 | inspiration-only | tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; aporta links o bloques de codigo para estudiar; fuente fuerte para patrones web | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/landingfolio/091-headshotpro-a3943c9a/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/landingfolio/091-headshotpro-a3943c9a/mobile.png |
| structure | Mobbin Web | Beautiful SaaS Dashboards Collection by @alexbarreto | https://mobbin.com/collections/e9ede7f5-31ff-4ca1-acda-771fee465ed9/web/screens | flow-reference-only | coincide con rubro: bar; tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; fuente fuerte para patrones web | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/mobbin-web/021-view-collection-beautiful-saas-dashboards-44e47f62/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/mobbin-web/021-view-collection-beautiful-saas-dashboards-44e47f62/mobile.png |
| typography | Fontpair | Icons Library — Free Open-Source SVG Icon Sets \| Fontpair | https://fontpair.co/icons | typography-reference | coincide con rubro: menu; tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; aporta links o bloques de codigo para estudiar | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/fontpair/088-fontpair-8ba6d672/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/fontpair/088-fontpair-8ba6d672/mobile.png |
| component | shadcn/ui | Building Blocks for the Web - shadcn/ui | https://ui.shadcn.com/blocks/sidebar | mit-repo-available | coincide con rubro: menu, bar; tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; aporta links o bloques de codigo para estudiar; fuente fuerte para patrones web; tiene pista de codigo reusable con review | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/shadcn-ui/034-browse-more-blocks-11813c15/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/shadcn-ui/034-browse-more-blocks-11813c15/mobile.png |

## Codigo Referencial Permitido

| Repo | Archivo | Licencia | Senales | Por que |
|---|---|---|---|---|
| nolly-studio__cult-ui | apps/www/components/block-copy-button.tsx | MIT | react-component, tailwind, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; match de componente: button |
| shadcn-ui__ui | apps/v4/registry/bases/base/blocks/dashboard-01/components/section-cards.tsx | MIT | react-component, tailwind, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; match de componente: card |
| tremorlabs__tremor | src/components/Button/button.stories.tsx | MIT | react-component, tailwind, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; match de componente: button |
| tremorlabs__tremor | src/components/Button/Button.tsx | MIT | react-component, tailwind, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; match de componente: button |
| ibelick__motion-primitives | components/website/card-example-landing.tsx | MIT | react-component, tailwind | licencia MIT; compatible con Tailwind/tokenizacion; match de componente: card |
| magicuidesign__magicui | apps/www/components/ui/calendar.tsx | MIT | react-component, tailwind, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; match de componente: calendar |
| harshjdhv__componentry | packages/ui/src/components/button.tsx | MIT | react-component, shadcn | licencia MIT; patron shadcn revisable; match de componente: button |
| ibelick__motion-primitives | components/ui/button.tsx | MIT | react-component, shadcn | licencia MIT; patron shadcn revisable; match de componente: button |
| launch-ui__launch-ui | components/ui/button.tsx | MIT | react-component, shadcn | licencia MIT; patron shadcn revisable; match de componente: button |
| launch-ui__launch-ui | components/ui/link-button.tsx | MIT | react-component, shadcn | licencia MIT; patron shadcn revisable; match de componente: button |

Regla: usar estos archivos solo como referencia compatible despues de review, retokenizacion, accessibility check y responsive QA.

## Plan De Secciones

| Seccion | Objetivo | Patron | Datos necesarios |
|---|---|---|---|
| Hero con plato real | Hacer que la oferta se entienda visualmente en segundos. | Imagen full bleed o stage editorial con CTA reservar/pedir. | foto hero, horario, CTA |
| Menu corto | Mostrar platos estrella sin subir un PDF pesado. | Categorias reducidas con precios si existen. | platos, categorias, precios |
| Visita | Resolver direccion, horarios y contacto. | Bloque compacto con mapa/link, WhatsApp y redes. | direccion, horarios, telefono |

## Tokens

- Heading: Onest
- Body: Onest
- Senales de fuentes: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif, Montserrat, sans-serif, Inter, Inter_Fallback, Outfit, Outfit_Fallback, "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", saans, "saans Fallback", sans-serif, Geist, sans-serif
- Paleta: primary #b42318, secondary #1f2937, accent #f5a524, bg #fffaf2, fg #18181b

## Media

### Requerida
- Foto hero propia o generada con permiso
- 3 a 6 fotos de platos o ambiente

### Opcional
- Video corto de cocina o ambiente con poster

### Pedidos De Generacion
- Pedir o generar asset hero para Mesa Norte Demo: visual real del rubro, limpio, con espacio para copy y sin logos de terceros.

## Implementacion
- Abrir screenshots desktop y mobile seleccionados antes de tocar layout.
- Elegir una referencia para estructura, una para tipografia/densidad, una para motion o componentes.
- Reconstruir patrones con tokens de ONIA; no pegar HTML/CSS cerrado de referencias inspiration-only.
- Usar solo codigo de repos `allowed-after-review` y registrar archivo exacto usado.
- Mapear cada seccion del plan a datos reales del cliente; eliminar secciones sin dato util.
- Validar hero, servicios, prueba/confianza y CTA principal.
- Aplicar direccion del rubro: Fotografia protagonista, menu corto, horarios visibles, ubicacion y CTA de reserva sin friccion.

## Guardrails
- No copiar identidad, copy, imagenes, videos, logos, claims ni estructura reconocible de terceros.
- No usar tres cards iguales si no cambian la decision del cliente.
- No usar gradientes genericos ni paletas de un solo tono como solucion visual principal.
- Primer viewport debe tener una senal real del negocio: producto, lugar, equipo, dashboard, proyecto o resultado.
- Todo video debe tener poster, carga diferida y respeto a `prefers-reduced-motion`.
- Cada bloque debe justificar venta, confianza, entendimiento de alcance o siguiente paso.
- No inventar metricas, clientes, testimonios ni resultados.
- Riesgo especifico: Usar textos gourmet vacios y no mostrar platos, horarios ni direccion.

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
