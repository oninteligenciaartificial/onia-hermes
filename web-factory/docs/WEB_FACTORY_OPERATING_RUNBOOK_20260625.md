# Web Factory Operating Runbook - 2026-06-25

## Objetivo

Que ONIA pueda entregar solo datos clave, referencias y assets/permisos, y que
Web Factory produzca un perfil validado, contexto operativo y preview estatico
sin depender de memoria del chat.

## Modulo ONIA Center

Ruta operativa:

```text
/onia-center/web-factory
```

El modulo debe servir como centro visible para Sergio, Arthur y responsables de
area:

- explicar que datos alimentan una web automatica;
- cargar un intake y producir JSON compatible con `data/intakes/<slug>.json`;
- detectar faltantes criticos antes de prometer entrega;
- generar mensaje para pedir recursos al cliente;
- registrar el brief como nota y tarea en ONIA Center cuando el runtime este
  conectado;
- mostrar comandos canonicos, recetas existentes, referencias, codigo
  revisable, assets pendientes y automatizaciones disponibles.

Contrato operativo:

- Arthur puede preparar datos, referencias, assets y tareas de preview.
- ONIA puede automatizar captura, recetas, previews, QA y radar de referencias.
- Sergio conserva aprobacion sobre precio, descuentos, promesas sensibles,
  entrega client-facing, deploy, gastos externos y derechos de uso.
- El modulo no publica, no contacta clientes y no hace deploy por si solo.

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

## Funciones automatizables

Automatizar primero lo que reduce tiempo sin aumentar riesgo legal/comercial:

| Funcion | Estado | Trigger | Comando/base | Aprobacion |
|---|---|---|---|---|
| Guardar brief desde ONIA Center | preparado | formulario completo o parcial | `/api/onia-center/runtime` nota+tarea | Interno; no publica |
| Radar diario de referencias | listo | n8n en VPS -> worker | `pnpm automation:vps:daily` | Revisar licencias antes de usar codigo |
| Inteligencia de diseno | listo | termina radar VPS | `pnpm automation:vps:references` | Interno |
| Receta automatica | listo | existe intake/perfil | `pnpm design:auto -- <slug> --template <landing|store> --force` | Arthur prepara, Sergio aprueba entrega |
| Preview interno | listo | receta generada | `pnpm factory:build -- <slug> --template <landing|store> --force` | No enviar sin QA |
| Pedido de assets | preparado | faltantes criticos | mensaje generado por formulario | No inventar datos |
| QA de fabrica | listo | cambios en factory | `pnpm factory:smoke`, lint y build | Bloquea si falla |
| Watcher Nuvia/catalogo | listo | n8n en VPS -> worker | `pnpm automation:vps:nuvia-check` | No exponer proveedor/costos |
| Deploy/entrega | revision manual | preview aprobado y pago/alcance claro | runbook por tipo de hosting | Solo Sergio |

Automatizacion recomendada en n8n:

1. n8n corre en VPS y dispara el worker por SSH; no depende de la laptop.
2. Ejecutar `pnpm automation:vps:daily` una vez al dia con lock y limite de tiempo.
3. El worker corre `references:harvest:daily`, `references:intelligence` y `nuvia:prices:check`.
4. Guardar reporte en `/var/log/onia/web-factory/latest-web-factory-vps-automation.json`.
5. Alertar si falla Playwright, GitHub, licencia, screenshot, build o Nuvia.
6. No crear, publicar, pushear ni enviar webs a clientes sin aprobacion humana.

Runbook VPS/n8n:

```text
web-factory/docs/WEB_FACTORY_VPS_AUTOMATION_20260630.md
```

Automatizacion recomendada desde el modulo:

1. Arthur completa intake.
2. Boton `Guardar en ONIA Center` crea nota auditada y tarea de preview.
3. ONIA/Codex toma la tarea, guarda `data/intakes/<slug>.json`, ejecuta
   `factory:build` y adjunta evidencia.
4. Sergio revisa precio, alcance, derechos y entrega.

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

## Politica de motion

- `motion` esta instalado en `apps/site` para componentes React/Next internos,
  ONIA Center y futuras superficies Web Factory con interacciones controladas.
- Las webs estaticas generadas por `packages/templates` deben seguir usando CSS
  e IntersectionObserver liviano; no depender de React solo para animar una
  landing exportada.
- Usar motion solo cuando mejora jerarquia, foco, confianza o conversion:
  reveal de secciones, estados de cards, transiciones de paneles, filtros o
  vistas de producto.
- Todo motion debe respetar `prefers-reduced-motion` o `useReducedMotion`,
  ejecutarse una sola vez cuando sea scroll reveal y evitar loops decorativos
  pesados.
- Evitar shader/canvas/hero animation pesado sin aprobacion y sin prueba de
  performance. Si el hero ya usa video, priorizar poster y carga diferida.
- Para copiar patrones de galerias o repos, retokenizar y registrar la fuente;
  no copiar identidad, assets, claims ni layouts reconocibles.

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
