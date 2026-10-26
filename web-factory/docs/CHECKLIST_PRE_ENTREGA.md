# Checklist de pre-entrega — indexabilidad

> El gate que ya existe (`tsc --noEmit` + `pnpm test` + `pnpm e2e` + `code-review`) verifica
> que **compile**. No verifica que sea **encontrable**. Una web que compila perfecto y no la
> indexa nadie es una web que no sirve. Este checklist va **al lado** de ese gate, no lo
> reemplaza.

**Regla dura: esto se corre sobre el SITIO CONSTRUIDO Y SERVIDO, nunca leyendo el código.**
La mitad de estos ítems se ven bien en el fuente y salen mal en el HTML servido. Un `grep`
sirve para descartar, jamás para confirmar.

Fuente de los ítems: los 17 válidos de la lista "20 señales de web vibecodeada"
(`.claude/skills/onia-web-factory/SKILL.md` §"Checklist de pre-entrega"). Este documento es
la versión ejecutable: cada ítem con el comando que lo prueba.

---

## Cómo se corre

```bash
cd web-factory
pnpm --filter <app> build
pnpm --filter <app> exec next start -p 4311
# en otra terminal: los comandos de cada ítem contra http://127.0.0.1:4311
```

Si el build de una app con `output: "standalone"` corta en *Collecting build traces* con
`EPERM ... symlink` estás en Windows sin permiso de symlink: las páginas ya se generaron y
`next start` sirve igual. En Linux (VPS y Vercel) no pasa.

---

## Los 17 ítems

### Rastreo y descubrimiento

- [ ] **1. `/robots.txt` responde 200 y anuncia el sitemap.**
  `curl -s -w "\n[%{http_code}]\n" http://127.0.0.1:4311/robots.txt`
  Tiene que salir la línea `Sitemap: https://<dominio-real>/sitemap.xml` — con el dominio de
  producción, no `localhost`.

- [ ] **2. `/sitemap.xml` responde 200 y es XML válido.**
  `curl -s -w "\n[%{http_code} | %{content_type}]\n" http://127.0.0.1:4311/sitemap.xml`
  `content_type` debe ser `application/xml`.

- [ ] **3. Toda página publicada está en el sitemap, y las internas/demo quedan fuera.**
  El sitemap se saca del árbol real de `src/app/`, nunca de memoria. Dos fallas simétricas:
  - Ruta en el sitemap que no existe → el buscador cobra 404s.
  - Ruta publicada que no está en el sitemap → la encuentra tarde o no la encuentra.

  Barrer las dos direcciones:
  ```bash
  # a) toda URL del sitemap responde 200
  curl -s http://127.0.0.1:4311/sitemap.xml | grep -o '<loc>[^<]*</loc>'
  # b) toda page.tsx del árbol está en el sitemap o es noindex a propósito
  find src/app -name 'page.tsx'
  ```
  Lo excluido a propósito (demos, borradores, comparativas) tiene que llevar
  `robots: { index: false }` **y verse en el HTML servido** como
  `<meta name="robots" content="noindex...">`. Excluir del sitemap sin noindex no lo saca de
  Google: solo lo hace más lento de encontrar.

- [ ] **4. Una URL inexistente da 404 propio, no la pantalla por defecto de Next.**
  `curl -s -w "\n[%{http_code}]\n" http://127.0.0.1:4311/ruta-que-no-existe-xyz`
  Debe dar **404** (no 200) y NO contener `This page could not be found`. El default de Next
  está en inglés, sin marca y sin salida: el lead que llega con la URL mal escrita se va.
  El 404 propio lleva `robots: { index: false, follow: true }`.

### Identidad de cada página

- [ ] **5. `<link rel="canonical">` sale en el HTML SERVIDO de cada página.**
  ```bash
  curl -s http://127.0.0.1:4311/<ruta> | grep -o '<link rel="canonical" href="[^"]*"'
  ```
  Correr esto **por cada ruta del sitemap**, no solo en el home.

- [ ] **6. `metadataBase` configurado.** Sin él, canonical y Open Graph salen relativos o
  contra `http://localhost:3000`. Se prueba con el ítem 5: si el `href` del canonical es
  absoluto y con el dominio de producción, `metadataBase` está bien.

  ⚠️ **El `canonical` NO va en el layout raíz.** Puesto ahí, toda ruta hereda `/` como
  canonical y se desindexa el sitio entero (y el 404 hereda el canonical del home). En el
  layout va `metadataBase`; el `alternates.canonical` se declara **por página**.

- [ ] **7. `<title>` único por página.** Dos páginas con el mismo título compiten entre sí.
  ```bash
  for p in <rutas>; do printf '%s ' "$p"; curl -s "http://127.0.0.1:4311$p" | grep -o '<title>[^<]*</title>'; done
  ```
  Revisar que no haya repetidos.

- [ ] **8. `<meta name="description">` única por página.** Mismo barrido que el 7.

- [ ] **9. Favicon presente y sirviendo 200.**
  `curl -s -o /dev/null -w "%{http_code} %{content_type}\n" http://127.0.0.1:4311/icon.svg`
  Con `src/app/icon.svg` (o `favicon.ico` / `icon.png`) alcanza: Next inyecta el
  `<link rel="icon">` solo. Verificar además que el tag salga en el HTML.

- [ ] **10. Open Graph con `title`, `description`, `url` y `type`.**
  `curl -s http://127.0.0.1:4311/ | grep -o '<meta property="og:[^>]*>'`
  **La imagen NO se inventa.** Si no hay captura real del producto, va sin imagen: un mockup
  ahí es fabricar (regla de la casa). OG sin imagen es correcto y deliberado, no un pendiente.

- [ ] **11. `<html lang>` correcto.** `es` para Bolivia, no el `en` que viene por defecto.
  `curl -s http://127.0.0.1:4311/ | grep -o '<html lang="[^"]*"'`

### Estructura y contenido

- [ ] **12. Una sola `<h1>` por página.**
  `curl -s http://127.0.0.1:4311/<ruta> | grep -c '<h1'`  → tiene que dar `1`.

- [ ] **13. Imágenes con `width` y `height` explícitos.** Sin eso el layout salta y el CLS se
  dispara. Aplica también a `<img>` sueltos, no solo a `next/image`.

- [ ] **14. Imágenes con `alt` real; las decorativas con `alt=""`.**
  `alt` ausente ≠ `alt=""`. El primero es una falla de accesibilidad; el segundo es una
  decisión declarada.

- [ ] **15. Cero enlaces internos rotos.** Extraer los `href` internos del HTML servido y
  pedir cada uno:
  ```bash
  curl -s http://127.0.0.1:4311/ | grep -o 'href="/[^"]*"' | sort -u
  ```
  Cada uno debe dar 200. Un enlace a una ruta que se renombró es un 404 que nadie ve hasta
  que lo pisa un cliente.

- [ ] **16. HTTPS sin contenido mixto.** Un `http://` colado bloquea el candado.
  `curl -s http://127.0.0.1:4311/ | grep -o 'src="http://[^"]*"\|href="http://[^"]*"'`
  → no debe devolver nada. Ojo especial con lo que quedó de un `.env.local`: nunca buildear
  producción con `.env.local` presente, Next hornea los `NEXT_PUBLIC_*` en el bundle y
  publica `127.0.0.1`.

- [ ] **17. El contenido está en el HTML servido, no solo después de hidratar.**
  Si el rastreador lee la página sin ejecutar JS, tiene que ver el texto.
  ```bash
  curl -s http://127.0.0.1:4311/ | grep -c "<frase real del hero>"
  ```
  Este es el que más se rompe al meter `"use client"` de más o `force-dynamic` donde no va.
  Recordatorio de render modes: **nunca `force-dynamic` en el layout raíz**, y
  `useSearchParams` necesita `Suspense`.

---

## Los 3 ítems que quedaron AFUERA (y por qué)

La lista original tenía 20. Tres no entran porque son **opinión, no falla**:

| Ítem descartado | Por qué no es una falla |
|---|---|
| "Usa Vite + React" | Es una elección de stack, no un defecto. Nuestras webs son Next porque necesitamos SSR e indexabilidad; eso no convierte a Vite en un error. |
| "No bloquea bots de IA en `robots.txt`" | Decisión **comercial**, no técnica. Bloquear o dejar pasar a los rastreadores de IA se decide por negocio, no por checklist. |
| "No tiene `llms.txt`" | Sin verificar como estándar real. No se exige lo que no está confirmado que sirva. |

---

## Regla de uso comercial

**No usar esta lista como argumento de venta hasta que nuestras propias webs la pasen.**
Reprocharle a un prospecto lo que tenemos roto es un bumerán.

---

## Estado de nuestras dos webs propias

Verificado **sobre el sitio servido** (build de producción + `next start` + `curl`), no
leyendo código.

| App | Dominio | Ítems 1-6, 9, 11 | Ítems 7, 8, 10, 12-17 |
|---|---|---|---|
| `apps/onia-platform` | `onia.com.bo` | ✅ 2026-08-18 | sin auditar |
| `apps/dentalgest-landing` | `dentalgest.app` (`src/lib/constants.ts`) | ✅ 2026-08-18 | sin auditar |

Detalle de lo verificado el 2026-08-18:

- `robots.txt` 200 en las dos, anunciando el sitemap con el dominio de producción.
- `sitemap.xml` 200 y `application/xml` en las dos. Las **14 rutas** del sitemap de
  onia-platform responden 200; el sitemap de dentalgest tiene la única página que existe.
- `/patrones` y `/v2` (excluidas a propósito del sitemap de onia-platform) sirven
  `<meta name="robots" content="noindex, nofollow">`.
- Ruta inexistente → **HTTP 404** con el 404 propio en las dos
  (`Esta página no existe`, no el default de Next).
- `<link rel="canonical">` absoluto y correcto en el HTML servido de las 14 rutas de
  onia-platform y del home de dentalgest.
- Favicon: `icon.svg` 200 en las dos; `apple-icon.png` 200 en onia-platform.
- `<html lang="es">` verificado en dentalgest.

⚠️ El dominio de dentalgest-landing (`dentalgest.app`) sale de `src/lib/constants.ts`, que a
su vez lo toma de `DENTALGEST_URL` en `apps/onia-platform/src/lib/site.ts`. **Confirmar antes
de publicar**: si la landing termina colgada de otro dominio o de un subdirectorio, se cambia
en esa constante y las tres salidas (canonical, sitemap, robots) siguen solas.

⚠️ **Apex vs `www` — sin resolver.** La constante declara el apex (`https://dentalgest.app`),
pero varias referencias del repo apuntan a `www.dentalgest.app`
(`hermes-content/deploy/n8n/workflows/dentalgest-email-intake.json`,
`docs/historial/DENTALGEST_EMAIL_INTAKE_CONNECTOR_2026.md`). No está verificado cuál de los dos sirve la
landing hoy. **Importa para indexabilidad**: si el sitio vive en `www` y el canonical apunta al
apex (o al revés) sin redirección 301 de uno al otro, se parte la señal entre dos hosts.
Resolver antes de publicar: elegir un host, redirigir el otro con 301, y que la constante
declare el que gana.
