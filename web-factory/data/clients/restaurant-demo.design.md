# Auto Design Recipe - Mesa Norte Demo

Generated: 2026-06-26T21:50:13.561Z

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
| structure | SaaSFrame Landing Pages | Slite UX/UI Design and Copywrinting Examples - SaaSFrame | https://www.saasframe.io/saas/slite | inspiration-only | tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; aporta links o bloques de codigo para estudiar; fuente fuerte para patrones web | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/saasframe-landing-pages/285-landing-page-4197935a/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/saasframe-landing-pages/285-landing-page-4197935a/mobile.png |
| structure | Landingfolio | HeadshotPro Landing Page Inspiration and More \| Landingfolio | https://www.landingfolio.com/inspiration/post/headshotpro-1 | inspiration-only | tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; aporta links o bloques de codigo para estudiar; fuente fuerte para patrones web | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/landingfolio/091-headshotpro-a3943c9a/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/landingfolio/091-headshotpro-a3943c9a/mobile.png |
| structure | Recent Design | Web Design Inspiration — Recent | https://recent.design/websites | inspiration-only | tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; fuente fuerte para patrones web | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/recent-design/003-websites-cd2e1db3/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/recent-design/003-websites-cd2e1db3/mobile.png |
| structure | Awwwards Winning Websites | Wolverine Worldwide - Awwwards SOTD | https://www.awwwards.com/sites/wolverine-worldwide | inspiration-only-high-overdesign-risk | tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; fuente fuerte para patrones web; requiere simplificar para ONIA | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/awwwards-winning-websites/476-locomotive-040978f6/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/awwwards-winning-websites/476-locomotive-040978f6/mobile.png |
| component | Kibo UI | Gantt | https://www.kibo-ui.com/components/gantt | open-source-review-required | tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; aporta links o bloques de codigo para estudiar | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/kibo-ui/098-kibo-ui-com-components-gan-8008b377/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/kibo-ui/098-kibo-ui-com-components-gan-8008b377/mobile.png |
| typography | Magic UI | Kinetic Text \| React Components & Templates | https://magicui.design/docs/components/kinetic-text | mit-open-source-reference | coincide con rubro: menu; tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; aporta links o bloques de codigo para estudiar; fuente fuerte para patrones web; tiene pista de codigo reusable con review | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/magic-ui/007-introducing-kinetic-text-fbd94463/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/magic-ui/007-introducing-kinetic-text-fbd94463/mobile.png |
| component | shadcn/ui | Building Blocks for the Web - shadcn/ui | https://ui.shadcn.com/blocks/sidebar | mit-repo-available | coincide con rubro: menu, bar; tiene screenshot desktop; tiene screenshot mobile; aporta senales de fuente; aporta CTAs reales; aporta links o bloques de codigo para estudiar; fuente fuerte para patrones web; tiene pista de codigo reusable con review | desktop: C:/Users/PC/.codex/design-stack/gallery-examples-full/shadcn-ui/034-browse-more-blocks-11813c15/desktop.png<br>mobile: C:/Users/PC/.codex/design-stack/gallery-examples-full/shadcn-ui/034-browse-more-blocks-11813c15/mobile.png |

## Codigo Referencial Permitido

| Repo | Archivo | Licencia | Senales | Por que |
|---|---|---|---|---|
| serafimcloud__21st | apps/web/components/ui/copy-code-card-button.tsx | MIT | react-component, tailwind | licencia MIT; compatible con Tailwind/tokenizacion; match de componente: card, button |
| harshjdhv__componentry | packages/ui/src/components/flight-status-card.tsx | MIT | react-component, tailwind, motion, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; match de componente: card |
| nolly-studio__cult-ui | apps/www/components/block-copy-button.tsx | MIT | react-component, tailwind, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; match de componente: button |
| serafimcloud__21st | apps/web/components/ui/bookmark-button.tsx | MIT | react-component, tailwind, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; match de componente: button |
| shadcn-ui__ui | apps/v4/registry/bases/base/blocks/dashboard-01/components/section-cards.tsx | MIT | react-component, tailwind, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; match de componente: card |
| tremorlabs__tremor | src/components/Button/button.stories.tsx | MIT | react-component, tailwind, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; match de componente: button |
| tremorlabs__tremor | src/components/Button/Button.tsx | MIT | react-component, tailwind, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; match de componente: button |
| tremorlabs__tremor | src/components/Card/card.stories.tsx | MIT | react-component, tailwind, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; match de componente: card |
| harshjdhv__componentry | packages/ui/src/components/github-calendar.tsx | MIT | react-component, tailwind, motion, shadcn | licencia MIT; compatible con Tailwind/tokenizacion; patron shadcn revisable; match de componente: calendar |
| harshjdhv__componentry | packages/ui/src/components/interactive-hover-button.tsx | MIT | react-component, tailwind | licencia MIT; compatible con Tailwind/tokenizacion; match de componente: button |

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
- Senales de fuentes: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif, Montserrat, sans-serif, "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "Inter Tight", Geist, "Geist Fallback", Geist, sans-serif, "Geist Mono", monospace
- Paleta: primary #b42318, secondary #1f2937, accent #f5a524, bg #fffaf2, fg #18181b

## Media

### Requerida
- Foto hero propia o generada con permiso
- 3 a 6 fotos de platos o ambiente

### Opcional
- Video corto de cocina o ambiente con poster

### Pedidos De Generacion
- No hace falta pedir generacion ahora.

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
- Sin warnings.
