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

- Hay pocos perfiles reales. `demo` y `nuvia` no alcanzan para probar muchos
  rubros sin sesgo.
- `store` estatico todavia carga video de hero directamente con autoplay; para
  performance deberia adoptar poster/lazy loading como la version optimizada de
  Nuvia.
- `data/schema.ts` no incluye `heroPoster`, aunque Nuvia ya necesita poster para
  video optimizado.
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
