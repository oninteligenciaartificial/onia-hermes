# Web Factory Functionality Audit - 2026-06-25

## Diagnostico ejecutivo

Web Factory es funcional como fabrica interna para generar landings y tiendas
estaticas desde perfiles JSON, y como base real para operar Nuvia en Next.js.
No esta todavia en nivel "producto turnkey" para crear webs de clientes sin
intervencion tecnica: requiere normalizar mejor el intake, ampliar templates,
automatizar deployment y cubrir con pruebas end-to-end los flujos comerciales.

Calificacion practica:

- Fabrica interna para ONIA: 7/10.
- Sistema productizado para varios clientes: 5/10.
- Nuvia como tienda real de referencia: 7/10, condicionado por credenciales de
  pago, contenido final y performance de media.

## Que esta construido

- `data/schema.ts`: contrato Zod para perfiles de cliente, servicios, productos,
  SEO, CTA, contacto, redes y datos visuales.
- `data/clients/`: perfiles reales o demo. Actualmente existen `demo.json` y
  `nuvia.json`; Nuvia es el caso fuerte.
- `packages/tokens/`: convierte colores y tipografias del cliente en variables
  CSS reutilizables.
- `packages/templates/`: renderiza `landing` y `store` estaticos.
- `generate/`: CLI `pnpm generate <slug>` que valida JSON, copia assets y crea
  `out/<slug>/`.
- `apps/site/`: app Next.js con rutas publicas, Nuvia, catalogo, productos,
  paneles internos y APIs.
- `apps/site/src/app/api/nuvia/*`: checkout y estado de pagos para Nuvia.
- `harvester/`: herramientas para referencias, assets, fuentes de diseno y
  licencia.
- Docs canonicos: `README.md`, `FACTORY.md`, `INTAKE_CLIENTE.md`,
  `WEB_FACTORY_PATTERN_BANK_2026.md`, `NUVIA_PAYMENT_SYSTEM.md`.

## Validacion ejecutada

Comandos ejecutados desde `web-factory/`:

```bash
pnpm generate demo
pnpm test
pnpm --filter site lint
pnpm --filter site build
```

Resultado observado:

- Generacion estatica de demo correcta: `out/demo/index.html` y `site.css`.
- Tests correctos: 3 archivos, 9 tests.
- Lint de `site` correcto.
- Build de Next correcto, con 319 paginas generadas, incluyendo `/nuvia`,
  `/nuvia/catalogo`, productos de Nuvia y APIs principales.

## Datos minimos para crear una web

Para una landing simple:

- Nombre comercial exacto.
- Slug de proyecto.
- Rubro y oferta principal.
- Tagline y descripcion corta.
- Logo o autorizacion para crear uno temporal.
- Colores, tipografia o referencias visuales.
- Fotos/videos reales o autorizacion para generar imagenes.
- 3 a 6 servicios principales.
- CTA principal: WhatsApp, formulario, reserva, compra o llamada.
- Datos de contacto: telefono, WhatsApp, correo, direccion, horarios.
- Redes sociales.
- SEO basico: titulo, descripcion, palabras clave, imagen OG.
- Dominio/hosting: dominio actual o dominio deseado.

Para ecommerce:

- Categorias.
- Productos con nombre, precio, descripcion, imagen, alt text y stock si aplica.
- Beneficios, modo de uso, ingredientes/especificaciones segun rubro.
- Politicas de envio, cambios, garantia y devoluciones.
- Metodos de pago.
- Datos legales/fiscales cuando corresponda.
- Cuenta bancaria o credenciales de pasarela.
- Canal de confirmacion: WhatsApp, email, panel o CRM.

Para webs premium:

- Referencias exactas de estilo y anti-referencias.
- Casos, testimonios o prueba de confianza.
- Media por seccion: hero, producto, proceso, equipo, instalaciones, resultados.
- Copy comercial aprobado.
- Reglas de marca y tono.

## Estructura disponible

La estructura esta bien separada:

- Datos: perfiles JSON y contexto por cliente.
- Contratos: schema Zod.
- Presentacion: tokens, bloques y templates.
- Generacion: CLI estatica.
- Runtime: Next.js para experiencias dinamicas.
- Comercio: carrito, checkout server-side y estado de pago.
- Investigacion: banco de patrones, fuentes, referencias y harvester.

Esto es una buena base para ONIA porque permite vender mas rapido: se puede
tomar un intake, convertirlo a JSON, generar una primera web y luego decidir si
queda estatica o pasa a Next.js con funcionalidades reales.

## Gaps y riesgos

- Hay pocos perfiles reales. Las demos ya cubren clinica, ingenieria,
  restaurante, SaaS y skincare, pero no reemplazan validacion con clientes.
- `store` estatico ya usa `data-src`, `preload="none"` y poster para video de
  hero; el riesgo pendiente es mantener posters livianos y no subir videos
  pesados sin compresion.
- `data/schema.ts` ya incluye `heroPoster`; el riesgo pendiente es exigir
  permisos de uso y reemplazo de placeholders antes de entrega profesional.
- La cobertura de pruebas valida schema, generador y licencia, pero no cubre
  UI real de Next, checkout, carrito runtime, paneles internos ni E2E movil.
- Checkout real depende de variables de entorno de Supabase y BNB. Sin eso, el
  sistema queda en modo cotizacion/configuracion pendiente.
- Todavia falta un flujo cerrado intake -> JSON -> preview -> deploy -> entrega.
- Faltan plantillas fuertes por rubro: skincare/ecommerce, restaurantes,
  servicios locales, clinicas, ingenieria, SaaS, educacion y portfolio premium.
- Falta una politica clara de derechos de imagen para assets generados,
  descargados o entregados por cliente.

## Siguiente recomendacion

Convertir Web Factory en un flujo vendible de ONIA:

1. Crear un `client-profile` generator desde intake validado.
2. Agregar `heroPoster` al schema y al template estatico.
3. Crear 5 perfiles demo por rubro con imagenes placeholders licenciadas o IA.
4. Agregar Playwright smoke tests para home, catalogo, producto, carrito y CTA.
5. Definir comandos canonicos: crear cliente, preview, build, deploy y rollback.
6. Mantener Nuvia como referencia ecommerce premium y no mezclar datos internos
   de proveedor con la tienda publica.

## Actualizacion 2026-06-26

Quedo cerrado el frente de demos internas:

- `demo`, `clinic-demo`, `engineering-demo`, `restaurant-demo`, `saas-demo` y
  `skincare-demo` tienen intake, perfil, contexto, receta `.design` y preview
  generable.
- Las demos tienen assets SVG locales para evitar imagenes rotas y mostrar
  estructura visual desde el primer viewport.
- El template landing pinta `heroPoster` en el hero; antes el dato existia pero
  no se veia en landings.
- ONIA Center lee `label/objective/generationRequests` de las recetas actuales,
  no solo nombres antiguos.
- Se agrego `pnpm build:stable` para cerrar previews locales y evitar builds
  rotos por manifests incompletos de `.next`.

Pendiente real que no debe inventarse: datos finales de cliente como dominio,
politicas, credenciales profesionales, precios reales, fotos propias,
testimonios, pasarelas de pago y aprobacion de assets.

## Actualizacion 2026-07-03

Se cerraron dos gaps de mayor impacto en el flujo vendible (intake -> preview),
verificados contra el codigo y con tests del paquete:

- `generate/factory-build.ts` (orquestrador del flujo cerrado) pasa de 0 a
  cobertura con `generate/factory-build.test.ts`: flujo completo intake ->
  perfil -> receta -> preview, modo dry-run y validacion de slug/intake.
- Bug corregido: `factory:build --input <intake> --dry-run` crasheaba con
  ENOENT porque el paso de intake no escribe el perfil en dry-run, pero la
  receta de diseno intentaba cargarlo. Ahora dry-run desde intake se detiene en
  la validacion del intake y devuelve rutas + warning claro, sin escribir nada.
- Bug sistemico corregido: los comandos canonicos documentados con la forma
  `pnpm <script> -- <args>` (`client:new`, `design:auto`, `factory:build`,
  `generate`) fallaban en pnpm 10.x porque el separador `--` se reenviaba al
  argv del script y commander lo rechazaba ("too many arguments" / "required
  option not specified"). Se agrego `generate/argv.ts` (`sanitizeCliArgv`) con
  tests y se conecto a los cuatro entrypoints CLI. La forma documentada del
  runbook ahora funciona verbatim.

Validacion ejecutada desde `web-factory/`: `pnpm test` (22 tests, 8 archivos),
`pnpm --filter site lint`, `pnpm factory:smoke` y los tres comandos `--`
documentados en modo `--dry-run`.

Gaps de mayor esfuerzo que siguen abiertos: E2E Playwright real (home,
catalogo, producto, carrito, CTA) sobre el runtime Next; plantillas fuertes
adicionales por rubro mas alla de `landing`/`store`; y flujo deploy/rollback
(manual por diseno, requiere aprobacion humana).

## Actualizacion 2026-07-03 (segunda tanda)

- **E2E de previews estaticos cerrado** (recomendacion #4 del audit para el
  artefacto que se entrega al cliente): suite Playwright sobre `out/<slug>` en
  chromium + mobile que cubre home, hero, CTA, catalogo, pagina de producto y
  carrito con persistencia en localStorage. Corre con `pnpm e2e`; usa un server
  estatico propio (`scripts/serve-out.mjs`) y regenera los previews con el mismo
  generador de fabrica. `vitest.config.ts` separa unit (`*.test.ts`) de E2E.
  Sigue abierto solo el E2E sobre el runtime Next (checkout/carrito de Nuvia),
  que depende de credenciales Supabase/BNB.
- **Rubro dashboard agregado a la "red neuronal" de diseno**: nuevo vertical
  `dashboard-analytics` en `design/auto-designer.ts` (KPIs, grid de charts, tabla
  operativa; densidad visual alta, motion bajo) con test; 5 fuentes con licencia
  verificada en el harvester (Tremor Apache-2.0, Tabler MIT, shadcn charts +
  dashboard-01 MIT, Hugging Face Spaces per-Space); playbook en el pattern bank y
  doc `WEB_FACTORY_DASHBOARD_INTELLIGENCE_20260703.md`.
- **Template estatico de dashboard construido** (`packages/templates/src/dashboard.ts`,
  tercer template junto a `landing`/`store`): shell con nav lateral, KPIs con delta
  semantico, graficos SVG inline calculados de los datos (barras + linea), tabla con
  estado vacio, filtro y reveal con `prefers-reduced-motion`. Datos en
  `client.dashboard` (schema Zod opcional). Demo `dashboard-demo`; cubierto por unit
  tests y E2E (chromium+mobile) y QA visual. Pendiente: mapear `dashboard.*` en el
  intake para generar paneles desde intake (hoy el demo es client json a mano).

Validacion: `pnpm test` (23 tests), `pnpm e2e` (8, chromium+mobile),
`pnpm --filter site lint`, y verificacion de que `saas-demo` sigue infiriendo
SaaS/B2B (sin regresion del vertical existente).
