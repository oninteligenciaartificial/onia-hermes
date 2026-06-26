# Web Factory Operating Runbook - 2026-06-25

## Objetivo

Que ONIA pueda entregar solo datos clave, referencias y assets/permisos, y que
Web Factory produzca un perfil validado, contexto operativo y preview estatico
sin depender de memoria del chat.

## Flujo canonico

1. Copiar `data/intakes/client-intake.template.json`.
2. Crear `data/intakes/<slug>.json`.
3. Completar datos clave:
   - `project.slug`
   - `project.template`: `landing` o `store`
   - `business.name`
   - `business.industry`
   - `business.offer`
   - `business.description`
   - `brand.references[]` con URLs exactas y que se debe tomar/evitar
   - `media.assetPermission`: `client-owned`, `generate-ai`, `stock-licensed` o `pending`
   - `conversion.primaryCtaText`
   - `contact.whatsapp`, `contact.email` o `conversion.primaryCtaUrl`
4. Generar el perfil:

```powershell
cd C:\dev\proyectos\onia-hermes\web-factory
pnpm client:new -- --input data/intakes/<slug>.json
```

5. Generar receta de diseno razonada:

```powershell
pnpm design:auto -- <slug> --template landing
```

Para ecommerce:

```powershell
pnpm design:auto -- <slug> --template store
```

La receta lee `latest-design-intelligence.json`,
`latest-component-code-examples.json`, referencias exactas del cliente y
contexto operativo. Escribe:

```text
data/clients/<slug>.design.json
data/clients/<slug>.design.md
```

Debe incluir rubro inferido, referencias seleccionadas, URLs, screenshots,
hashes, fuentes, CTAs, motion, codigo permitido, plan de secciones, media
faltante, guardrails y QA.

6. Generar preview:

```powershell
pnpm generate <slug> --template landing
```

Para ecommerce:

```powershell
pnpm generate <slug> --template store
```

7. Revisar salida:

```text
data/clients/<slug>.json
data/clients/<slug>.context.md
data/clients/<slug>.design.json
data/clients/<slug>.design.md
out/<slug>/index.html
out/<slug>/site.css
out/<slug>/<slug>.design.json
out/<slug>/<slug>.design.md
```

Flujo directo si ya hay intake:

```powershell
pnpm factory:build -- --input data/intakes/<slug>.json --force
```

Flujo directo si ya existe el perfil:

```powershell
pnpm factory:build -- <slug> --template landing --force
```

Si el build de Next falla con manifests incompletos como `Cannot find module
for page` o falta `.next/server/edge-runtime-webpack.js`, primero cerrar
previews locales y compilar con limpieza controlada:

```powershell
pnpm preview:stop
pnpm build:stable
```

`build:stable` detiene procesos locales de `next`/`pnpm`/`postcss` que esten
apuntando a `apps/site`, borra solo `.next` dentro de ese sitio y reintenta una
vez si Next deja un manifest parcial.

## Contrato de referencias

Cada referencia debe explicar el uso permitido:

```json
{
  "title": "Nombre de referencia",
  "url": "https://example.com",
  "type": "visual",
  "use": "jerarquia, ritmo, CTA, estructura o tratamiento visual",
  "avoid": "identidad, copy, claims, imagenes o assets reconocibles"
}
```

No se copia identidad, texto, imagenes, claims, gestos, branding ni estructura
reconocible. Solo se extraen patrones: jerarquia, layout, ritmo, densidad,
CTA, uso de producto, confianza y flujo de conversion.

## Datos que bloquean entrega profesional

`pnpm client:new` reporta pendientes. Los bloqueantes habituales son:

- logo o marca visual;
- referencias visuales exactas;
- asset principal de hero o permiso para generarlo;
- canal de conversion;
- productos con precio/descripcion/imagen para `store`;
- metodos de pago y politicas comerciales para ecommerce;
- dominio o decision de hosting;
- campos legales/fiscales si hay pagos.

## Perfiles demo disponibles

Estos intakes validan rubros y estructura:

- `data/intakes/demo.json` -> clinica dental base.
- `data/intakes/skincare-demo.json` -> ecommerce skincare.
- `data/intakes/restaurant-demo.json` -> restaurante.
- `data/intakes/clinic-demo.json` -> clinica.
- `data/intakes/engineering-demo.json` -> ingenieria.
- `data/intakes/saas-demo.json` -> SaaS B2B.

Cada uno genera su perfil en `data/clients/` y su contexto `.context.md`. Las
demos incluyen assets SVG sinteticos y livianos en
`data/clients/<slug>.assets/`; sirven para preview interno y deben reemplazarse
por fotos, screenshots o packshots aprobados cuando el cliente real lo requiera.

## Validacion de fabrica

```powershell
pnpm factory:smoke
pnpm design:auto -- skincare-demo --template store --force
pnpm factory:build -- skincare-demo --template store --force
pnpm --filter site lint
pnpm build:stable
```

`factory:smoke` corre tests y genera previews para los rubros demo canonicos.

`design:auto` valida que la fabrica pueda razonar sobre rubro, referencias,
capturas, codigo permitido y media faltante. `factory:build` valida el flujo
completo sin pedir informacion al usuario si el intake ya tiene datos clave.

## Politica de media

- Si hay video de hero, debe existir `heroPoster` o `heroImage`.
- El template `store` no carga el video con `src` inmediato; usa `data-src`,
  `preload="none"` y carga diferida para no afectar el inicio.
- Si el cliente no entrega assets, usar `media.assetPermission=generate-ai` y
  registrar en contexto que el asset queda pendiente de producir.
- Para demos internas se permiten SVGs sinteticos versionados; para entrega
  profesional se reemplazan por assets propios, generados/aprobados o
  licenciados.

## Criterio de "listo para cliente"

Una web esta lista para entregar cuando:

- `pnpm client:new` no reporta pendientes criticos;
- `pnpm design:auto` genera receta con referencias y screenshots suficientes o
  deja warnings concretos;
- `pnpm generate <slug>` termina sin errores;
- no hay imagenes rotas conocidas;
- CTA apunta a un canal real;
- SEO basico esta completo;
- referencias y derechos de media estan documentados;
- para ecommerce, pagos/politicas/envios estan definidos o queda claro que es
  cotizacion asistida.
