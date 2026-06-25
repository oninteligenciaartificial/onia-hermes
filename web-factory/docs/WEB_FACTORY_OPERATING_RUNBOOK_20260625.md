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

5. Generar preview:

```powershell
pnpm generate <slug> --template landing
```

Para ecommerce:

```powershell
pnpm generate <slug> --template store
```

6. Revisar salida:

```text
data/clients/<slug>.json
data/clients/<slug>.context.md
out/<slug>/index.html
out/<slug>/site.css
```

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

- `data/intakes/skincare-demo.json` -> ecommerce skincare.
- `data/intakes/restaurant-demo.json` -> restaurante.
- `data/intakes/clinic-demo.json` -> clinica.
- `data/intakes/engineering-demo.json` -> ingenieria.
- `data/intakes/saas-demo.json` -> SaaS B2B.

Cada uno genera su perfil en `data/clients/` y su contexto `.context.md`.

## Validacion de fabrica

```powershell
pnpm factory:smoke
pnpm --filter site lint
pnpm --filter site build
```

`factory:smoke` corre tests y genera previews para los cinco rubros demo.

## Politica de media

- Si hay video de hero, debe existir `heroPoster` o `heroImage`.
- El template `store` no carga el video con `src` inmediato; usa `data-src`,
  `preload="none"` y carga diferida para no afectar el inicio.
- Si el cliente no entrega assets, usar `media.assetPermission=generate-ai` y
  registrar en contexto que el asset queda pendiente de producir.

## Criterio de "listo para cliente"

Una web esta lista para entregar cuando:

- `pnpm client:new` no reporta pendientes criticos;
- `pnpm generate <slug>` termina sin errores;
- no hay imagenes rotas conocidas;
- CTA apunta a un canal real;
- SEO basico esta completo;
- referencias y derechos de media estan documentados;
- para ecommerce, pagos/politicas/envios estan definidos o queda claro que es
  cotizacion asistida.
