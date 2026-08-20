# ONIA Web Factory

Fábrica de plantillas web para clientes de ONIA. Plantillas pre-hechas donde solo se
inyectan los datos de cada empresa (marca, colores, copy, logo, contacto) y sale el sitio
listo. Incluye un "harvester" que importa bloques y diseños de fuentes externas curadas.

---

## REGLA DE FRONTERA (CRÍTICO)

Esta carpeta vive dentro de `onia-hermes/` para heredar el contexto de quiénes son los
clientes de ONIA, pero es un mundo **estrictamente separado**:

- **`onia-hermes/` (raíz)** = brain de operaciones. Markdown, n8n, content, CRM, video lab.
  NO es código web. NO se toca desde la factory.
- **`onia-hermes/web-factory/` (aquí)** = código web (Next.js). Mundo aparte, deps propias.
  NO toca nada fuera de esta carpeta.

Cuándo usar cada cosa:
- ¿Operaciones, contenido, automatización, prospección, CRM? → brain (raíz).
- ¿Construir/generar un sitio para un cliente? → web-factory (aquí).

El contexto de clientes se **lee por referencia** desde `data/clients/`, no se duplica el
brain dentro de la factory.

---

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- shadcn/ui
- pnpm (workspaces)
- zod (validación de datos de empresa)
- commander (CLI de generación)

---

## Estructura

```
web-factory/
├── FACTORY.md                 # este archivo (frontera + cómo usar)
├── SOURCES.md                 # catálogo vivo de fuentes (URL + licencia + import)
├── apps/site/                 # Next.js 15 — motor de render
├── packages/
│   ├── tokens/                # design tokens (CSS vars) por cliente
│   ├── blocks/                # bloques tokenizados (hero, pricing, footer...)
│   └── templates/             # composiciones completas (landing, agencia, ecommerce)
├── harvester/
│   ├── registry/              # wrapper sobre `npx shadcn add <url>`
│   ├── blocks-html/           # fetch + cheerio de bloques Tailwind
│   ├── github/                # clone + filtro de licencia (rechaza GPL)
│   ├── vision/                # ref/screenshot -> código (stub; se corre desde Claude/MCP)
│   └── assets/                # APIs Unsplash + iconos Lucide/Tabler
├── data/
│   ├── schema.ts              # schema zod de empresa
│   └── clients/               # un .json por cliente
└── generate/                  # CLI: template + cliente -> out/<slug>/
```

---

## Flujo de uso

1. Elegir una plantilla de `packages/templates/`.
2. Crear/editar `data/clients/<slug>.json` con los datos de la empresa.
3. Ejecutar `pnpm generate <slug>`.
4. El sitio sale en `out/<slug>/` con los colores, copy y logo del cliente inyectados
   vía design tokens.

Los bloques y templates **nunca hardcodean color**: leen los tokens en `packages/tokens`,
que se generan desde el JSON del cliente.

---

## Checklist de pre-entrega (gate)

Ningún sitio — de cliente o propio — se declara "listo" sin pasar estos 17 puntos.
Complementa los gates automatizados del e2e (a11y, visual, performance CWV) y los gates
por carril (`tsc --noEmit` + build verde). Se verifica sobre el sitio **construido**
(`next build` + servir), no sobre el dev server.

1. [ ] `robots.txt` responde y anuncia el sitemap (`app/robots.ts`).
2. [ ] `sitemap.xml` responde y lista TODAS las páginas publicadas (página nueva sin
       entrada = página que el buscador encuentra tarde o nunca).
3. [ ] 404 propio (`app/not-found.tsx`): con marca, en español y con salida (link al
       inicio / CTA). Nunca la pantalla por defecto de Next.
4. [ ] `canonical` por página (`alternates.canonical` en cada `page.tsx`, nunca en el
       layout: puesto ahí, el 404 y toda ruta heredan el canonical del home).
5. [ ] Favicon presente (`app/icon.svg` o `favicon.ico`) y visible en la pestaña.
6. [ ] OG tags (title, description, type, locale, siteName) — **SIN inventar la imagen**:
       `og:image` solo cuando exista una captura REAL del producto. Nunca mockups falsos.
7. [ ] `metadataBase` declarado en el layout (sin él, Next arma canonical y OG contra
       `http://localhost:3000`).
8. [ ] `<html lang="...">` correcto (es / es-BO según el sitio).
9. [ ] `title` y `description` propios POR página (no heredar el del home en todas).
10. [ ] Viewport correcto (default de Next o `export const viewport`), sin
        `maximum-scale=1` ni `user-scalable=no`.
11. [ ] `theme-color` declarado (light y dark si el sitio tiene ambos temas).
12. [ ] Manifest (`app/manifest.ts`) si el sitio se instala como PWA — si no aplica,
        marcar N/A consciente, no olvidado.
13. [ ] Toda imagen con `alt` (vacío `alt=""` solo si es decorativa).
14. [ ] Cero links rotos: internos (rutas que existen) y externos (responden).
15. [ ] Headings jerárquicos: un solo `h1` por página, sin saltos de nivel.
16. [ ] URLs absolutas siempre en `https://` (nunca `http://` en canonical, OG, sitemap
        ni links).
17. [ ] Cero `console.log` en el código que se entrega.

---

## Reglas de fuentes

- Solo se cablean las fuentes listadas en `SOURCES.md`. No agregar otras sin avisar.
- GitHub: leer `LICENSE` antes de clonar. GPL/AGPL → RECHAZAR para sitios de cliente.
- Registries shadcn: confirmar la URL exacta de install en registry.directory o en las
  docs del registry. No inventar endpoints.
- Bloques HTML: importar el markup y re-tokenizar los colores a las CSS vars del sistema.
