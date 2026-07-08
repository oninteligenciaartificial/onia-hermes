# Spec — Landing demo vertical inmobiliario (agencia multi-propiedad)

- Fecha: 2026-07-08
- Carril: Web Factory (`web-factory/`)
- Estado: diseño aprobado por Sergio
- No toca: `store.ts` (tienda Nuvia), `src/app/onia-center/**`

## Objetivo

Segunda vertical de landing (después de dental), con **UI completamente
distinta** — para probar que `WEB_FACTORY_LANDING_STANDARD.md` describe un
piso de calidad realmente agnóstico de rubro, no solo la forma en que se armó
el dental. Escenario: agencia inmobiliaria con múltiples propiedades
(catálogo/búsqueda), no un desarrollo único.

## Investigación (grounding real, no inventado)

Playbook interno ya existente: `WEB_FACTORY_PATTERN_BANK_2026.md` sección
"Real Estate / Property / Architecture" — design read "visual proof, location,
availability, qualified inquiry", densidad 5, motion 5 (vs. clinic: densidad
4, motion 2 — señal fuerte de que debe sentirse más denso/vivo).

Sin cache local de referencias inmobiliarias — investigación fresca vía
Awwwards ("Best Real Estate websites") + capturas Playwright headless
(mismo método que el vertical dental), 3 sitios reales premiados:

- **Eleos** (eleos.la) — foto de propiedad enmascarada *dentro* de tipografía
  display gigante (se ve a través de las letras, no detrás). Copy en
  monoespaciada técnica.
- **Duos** (duoswynwood.com) — hero cinematográfico full-bleed (render
  fotorrealista, cielo de atardecer), nav mínima centrada; secciones
  siguientes alternan a fondo crema cálido con wordmark grande en outline.
- **Aretè** (areteimmobiliare.com) — campo de color plano (verde salvia) +
  wordmark negro gigante recortado, tono póster editorial.

Ningún patrón se parece al hero dental (full-bleed con scrim + split-editorial
+ typographic con capa liviana). El denominador común real: tipografía display
mucho más grande/agresiva, paletas cálidas/tierra o de color plano (nunca
azul-teal clínico), y una **ruptura tipográfica editorial a media página**
(wordmark recortado) que el sistema dental no tiene.

## Decisiones

- **Escenario**: agencia demo ficticia multi-propiedad, marcada como demo en
  `.context.md` (mismo criterio que dental — sin fabricar datos reales).
- **No se reutiliza la mecánica de Nuvia** (`store.ts`, carrito/PDP): acá la
  acción es consulta/lead, no compra. No se toca ese archivo.
- **Se reutiliza lo genérico ya probado**: timeline de proceso
  (`process.ts`/`renderProcess`), marquee de confianza (`marquee.ts`), footer,
  sticky CTA, sistema de tokens. No reinventar lo que no es parte de la
  identidad visual distintiva.
- **Nuevo, no reskin**: hero con buscador flotante, listado foto-primero con
  card destacada, y el bloque de ruptura tipográfica (wordmark recortado) son
  composición y CSS genuinamente nuevos — no una reconfiguración del sistema
  `clinic-hero-*`.
- **Paleta propia**: terracota/arena/carbón (no azul-teal).

## Estructura de la página

1. **Hero** — foto cinematográfica full-bleed de propiedad (mismo patrón
   full-bleed técnico que el dental: `<img>` + scrim, parallax scroll-driven
   progresivo) + **panel de búsqueda flotante** (zona / tipo / operación) en
   vez del panel de reserva del dental. Titular grande, CTA WhatsApp.
2. **Trust strip** — credenciales de la agencia (años operando, propiedades
   gestionadas, zonas cubiertas) — reutiliza el patrón de marquee.
3. **Ruptura tipográfica** — wordmark de la agencia gigante y recortado
   (técnica Eleos/Aretè), con 2-3 cifras/beneficios superpuestos. Bloque
   nuevo, sin equivalente en el sistema dental.
4. **Listado de propiedades** — foto-primero: card grande "destacada" (2x) +
   grid de cards regulares (foto, precio, zona, tipo, dormitorios). Nunca
   ícono+texto. Datos de ejemplo, marcados demo.
5. **Proceso** — cómo funciona (contactás → visita → oferta → cierre).
   Reutiliza `renderProcess`/timeline tal cual.
6. **Zonas que cubre la agencia** — lista/chips de zonas, sin mapa
   interactivo real (no fabricar un mapa falso; placeholder textual honesto).
7. **CTA final + WhatsApp sticky** — reutiliza el patrón existente.
8. Footer minimal — reutiliza el patrón existente.

## Cambios en el sistema

### Schema (`data/schema.ts` + `packages/blocks/src/types.ts`)

Campos **opcionales**, default `[]`, no rompen clientes existentes:

```ts
const listingSchema = z.object({
  titulo: z.string().min(1),
  precio: z.string().min(1),
  zona: z.string().min(1),
  tipo: z.string().min(1), // "Casa", "Departamento", "Terreno"...
  operacion: z.enum(["venta", "alquiler"]).default("venta"),
  dormitorios: z.number().int().min(0).optional(),
  banos: z.number().int().min(0).optional(),
  imagen: optionalAssetSchema,
  imagenAlt: z.string().default(""),
  destacado: z.boolean().default(false),
});
```

- `listings: z.array(listingSchema).default([])`
- `zonas: z.array(z.string().min(1)).default([])`
- `wordmarkBreak: z.string().default("")` (texto del wordmark recortado;
  si vacío, usa `nombre` del cliente)

Reflejado en `SiteClient` (`packages/blocks/src/types.ts`) con los mismos
tipos opcionales.

### Bloques nuevos (`packages/blocks/src/realty-*.ts`)

- `realty-hero.ts` — hero full-bleed + panel de búsqueda flotante.
- `realty-listings.ts` — card destacada + grid foto-primero.
- `realty-wordmark-break.ts` — wordmark recortado con cifras superpuestas.
- `realty-zones.ts` — chips de zonas cubiertas.

Todos con test unitario propio (render + escape HTML + caso vacío), mismo
patrón que `clinic-hero.test.ts`/`marquee.test.ts`.

### Template (`packages/templates/src/landing-realty.ts`)

Compone: `realty-hero` → `renderTrust`/marquee → `realty-wordmark-break` →
`realty-listings` → `renderProcess` → `realty-zones` → CTA final + sticky →
footer. CSS propio (`realty-css.ts`) con la paleta terracota/arena/carbón,
tokens-only.

### Generador (`generate/generate.ts`)

Agregar `"landing-realty"` al union `GenerateOptions.template`, a la
validación, y a los switches de render html/css — mismo patrón que
`landing-clinic`.

### Datos demo

- `data/intakes/realty-demo.json` (brief).
- `data/clients/realty-demo.json` + `.context.md` (marca demo, ej. "Terra
  Propiedades", datos de contacto placeholder, listings de ejemplo marcados).
- `data/clients/realty-demo.assets/` — fotos de propiedades: stock libre
  (Unsplash License) marcado como placeholder en `.context.md`, mismo
  criterio que `dental-demo`.

### Tests / gates

- Unit: tests de cada bloque nuevo + caso en `generate.test.ts` para
  `landing-realty`.
- e2e: `tests/e2e/global-setup.ts` genera `realty-demo`; agregar a
  `a11y.spec.ts` (light+dark) y `perf.spec.ts` (medir peso real con fotos,
  igual que se hizo con dental, y fijar budget honesto); spec de estructura
  dedicado (`landing-realty.spec.ts`) cubriendo hero+buscador, wordmark break,
  listado con destacada, zonas.
- `factory:smoke`: sumar `pnpm generate realty-demo --template landing-realty`
  (toca `package.json` raíz — mismo patrón ya avisado y usado con dental).

## Guardrails

- No tocar `store.ts` ni archivos de la tienda Nuvia.
- No tocar `src/app/onia-center/**`.
- Bloques leen solo tokens CSS; nada de color hardcodeado.
- Sin mapa interactivo falso, sin disponibilidad de propiedades inventada
  como si fuera real (Pattern Bank: "Avoid: fake availability").
- Fotos de propiedades: stock libre marcado, nunca presentado como fotos
  reales de la agencia.
- Commits conventional, por carpeta.

## Pendientes para cliente real (no demo)

- Fotos reales de las propiedades y de la agencia.
- Listings reales (no inventados) y disponibilidad verificada.
- Zonas/cobertura reales verificadas.
- Dominio + hosting a nombre del cliente.
