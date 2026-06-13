# SOURCES — Catálogo de fuentes de ONIA Web Factory

Catálogo vivo de las fuentes cableadas en el harvester. Cada fuente tiene: para qué sirve,
licencia, y cómo se importa. **No agregar fuentes fuera de esta lista sin aprobación.**

Regla de licencia: para sitios de cliente solo se usa MIT / Apache-2.0 / dominio público.
GPL/AGPL queda **rechazado**.

---

## 1. Base (siempre)

| Fuente | Para | Licencia | Cómo se usa |
|---|---|---|---|
| shadcn/ui | componentes base | MIT | `npx shadcn@latest add <comp>` |
| Tailwind CSS v4 | estilos | MIT | dependencia del proyecto |
| Lucide | iconos default | ISC | `import { X } from "lucide-react"` |
| Tabler Icons | iconos extra | MIT | `import { IconX } from "@tabler/icons-react"` |
| tweakcn | generar theme/tokens shadcn | web | copiar theme manual → `packages/tokens` |

---

## 2. Registries shadcn (vía `npx shadcn add`)

Instalan dentro de `apps/site`. Confirmar URL exacta de cada componente en
https://registry.directory o en las docs del registry. No inventar endpoints.

| Registry | Fuerte en | Licencia | Patrón de install |
|---|---|---|---|
| Magic UI | animaciones marketing (Framer Motion) | MIT | `npx shadcn@latest add "https://magicui.design/r/<comp>.json"` |
| Aceternity UI | heroes / efectos wow | MIT (free) | `npx shadcn@latest add "https://ui.aceternity.com/registry/<comp>.json"` |
| Origin UI | forms, dialogs, timeline (serios) | MIT | `npx shadcn@latest add "https://originui.com/r/<comp>.json"` |
| Cult UI | toques premium (dock, cards Apple-style) | MIT | `npx shadcn@latest add "https://cult-ui.com/r/<comp>.json"` |

Descartados por ahora (redundan): Kibo UI, Neobrutalism, Origin extras no usados.

---

## 3. Bloques HTML (copy-paste → re-tokenizar)

Se importan con `fetch` + cheerio en `harvester/blocks-html/`. Extraer `<section>`,
guardar en `packages/blocks/`, reemplazar colores por CSS vars del sistema.

| Fuente | Para | Licencia | URL |
|---|---|---|---|
| shadcnblocks.com | secciones shadcn-native | mix free/pro (usar free) | https://www.shadcnblocks.com |
| efferd.com/blocks | bloques Tailwind | free | https://efferd.com/blocks |

Descartados (otro sistema de estilos, rompen consistencia shadcn): Preline, Flowbite, DaisyUI.

---

## 4. Plantillas completas (GitHub — SOLO MIT)

Clonar con `simple-git` o `gh` a tmp, leer LICENSE, si MIT/Apache copiar a
`packages/templates/`. Si GPL/AGPL → descartar.

| Repo | Para | Licencia | Comando |
|---|---|---|---|
| nexi-launch/finwise-landing-page | SaaS / landing | MIT | `gh repo clone nexi-launch/finwise-landing-page` |
| desgy nextjs landing | agencia | MIT | (GetNextjsTemplates/desgy-...) |
| vercel/commerce | ecommerce | MIT | `gh repo clone vercel/commerce` |
| shadcn-ui/taxonomy | app + marketing | MIT | `gh repo clone shadcn-ui/taxonomy` |
| Precedent (steven-tey/precedent) | starter Next | MIT | `gh repo clone steven-tey/precedent` |

RECHAZADO: cruip/open-react-template (GPL) — no usar para cliente.

---

## 5. Visión: ref/screenshot → código (stub)

Codex NO tiene estos MCP. Dejar `harvester/vision/` como stub documentado. El pipeline
se corre desde el lado Claude cuando haga falta convertir una referencia (ej. Pinterest)
en bloque.

| Tool | Estado | Acceso |
|---|---|---|
| stitch MCP | primario | MCP (lado Claude) |
| image-to-code (skill) | fallback | skill (lado Claude) |
| v0.dev | manual | web (Vercel) |
| screenshot-to-code (OSS) | alternativa self-host | github |

Pinterest = solo referencia visual (su ToS bloquea scraping). Nunca copia literal de layout.

---

## 6. Assets

| Tipo | Fuente | Licencia | Cómo se llama |
|---|---|---|---|
| Fotos | Unsplash API | libre comercial | `GET https://api.unsplash.com/search/photos?query=Q&per_page=N` + header `Authorization: Client-ID ${UNSPLASH_ACCESS_KEY}` |
| Fotos (alt) | Pexels API | libre comercial | `GET https://api.pexels.com/v1/search?query=Q` + header `Authorization: ${PEXELS_API_KEY}` |
| Iconos | Lucide / Tabler | ISC / MIT | npm import (sin API) |
| Ilustraciones | unDraw / DrawKit / Reshot | libre | descarga manual SVG |

---

## Llaves requeridas (.env en web-factory, nunca commitear)

```
UNSPLASH_ACCESS_KEY=    # unsplash.com/developers
PEXELS_API_KEY=         # pexels.com/api (opcional)
GITHUB_TOKEN=           # github.com/settings/tokens, scope public_repo (opcional; o `gh auth login`)
```
