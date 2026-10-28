---
name: onia-web-factory
description: Invocar al construir o rediseñar cualquier superficie web en onia-hermes — landings de cliente, tiendas/storefronts o secciones de marketing (el panel onia-center está abandonado desde el 31-ago: no se rutea trabajo ahí). Impone el flujo real del generador de Web Factory (intake → cliente → receta → out/), el stack de diseño anti-template de ONIA y los gates antes de main.
---

# ONIA — Web Factory (construir webs anti-template)

Aplica al carril B (landings/sitios cliente). El carril A, el panel `onia-center`, está **abandonado desde el 31-ago**
(decisión de Sergio Urcullo): no se rutea trabajo ahí. Objetivo: que el output
NO salga genérico. ⚠️ El subagente `web-factory-builder` fue retirado el 2026-08-18 y borrado el
2026-09-29: el trabajo lo hace la sesión con esta skill.

## Lo primero: la web de cliente NO se escribe a mano

`web-factory/` es un **generador de HTML+CSS estático**. Un sitio de cliente sale de
`data/clients/<slug>.json` + un template de `packages/templates/src/`, y se escribe en
`out/<slug>/`. Escribir React/Next a mano para un cliente es trabajar por fuera del motor.

Capas (no confundirlas):
- `data/clients/<slug>.json` — perfil del cliente (marca, colores, contacto, servicios, productos).
- `packages/blocks/src/` — bloques (hero, features, footer, faq, process, trust, clinic-*).
- `packages/templates/src/` — composición por template.
- `packages/tokens/src/` — tokens CSS que recibe el cliente.
- `out/<slug>/` — el entregable: `index.html` + `site.css` (+ `productos/**` en store).

## Flujo real, punta a punta (comandos verificados)

Todo desde `C:\dev\proyectos\onia-hermes\web-factory`.

```powershell
pnpm install                                  # una vez

# 1) Intake → perfil de cliente
#    (plantilla: data/intakes/client-intake.template.json; el formulario del panel,
#     /onia-center/web-factory, ya no se usa: el panel está abandonado desde el 31-ago)
pnpm client:new -i data/intakes/<archivo>.intake.json
#    → data/clients/<slug>.json + <slug>.context.md

# 2) Receta de diseño (infiere vertical, elige referencias, propone tokens)
pnpm design:auto <slug> -t <template>
#    → data/clients/<slug>.design.json + <slug>.design.md

# 3) Render del sitio
pnpm generate <slug> --template <template>
#    → out/<slug>/index.html + site.css

# 0) Pedido del CONFIGURADOR de onia.com.bo/servicios/webs (el mensaje de WhatsApp, pegado
#    tal cual en un .txt) → intake → perfil → receta → out/, en UN comando (2026-09-17):
pnpm from-configurador <mensaje.txt> --build [--force] [--slug x]
#    Parsea NUESTRO formato (etiqueta: valor). Lo que el mensaje no trae (fotos, logo,
#    dominio, una frase por servicio) sale como «pendientes que se le piden al cliente».
#    No inventa: la bajada y las descripciones son hechos (oferta, rubro, ciudad).

# Todo lo anterior de una pasada (acepta intake o slug ya existente):
pnpm factory:build <slug> -t <template> [--force]
pnpm factory:build --input data/intakes/<archivo>.intake.json [--force]
pnpm factory:build <slug> --dry-run           # valida y lista "pending inputs" sin escribir

# 4) Ver el resultado
node scripts/serve-out.mjs 4319               # sirve out/ → http://localhost:4319/<slug>/

# 5) Gates
pnpm test                                     # unit (vitest)
pnpm images:check <slug>                      # política de formato/peso de imágenes
pnpm e2e                                      # Playwright: regenera los demos y testea out/
pnpm factory:smoke                            # test + regenerar los 8 demos
```

Templates válidos (`data/schema.ts` → `WEB_FACTORY_TEMPLATES`):
`landing` · `store` · `dashboard` · `landing-focus` · `landing-clinic` ·
`landing-realestate` · `landing-logistics`.
El de más calidad hoy es `landing-clinic` (dental-demo); `landing` es el más genérico.

⚠️ Trampas aprendidas construyendo el cliente de prueba (2026-08-28):
- **El intake SÍ mapea `trustProofs→credenciales`, `heroImage→imagenSecundaria` (si hay
  heroPoster distinto), `content.proceso` y `content.faqs`** desde el fix de esta fecha.
  Antes esos campos se tiraban en silencio y el template clinic salía sin feature, sin
  proceso y sin FAQ — la página quedaba a la mitad y parecía culpa del template.
- **Capturas fullPage mienten dos veces**: las imágenes `loading="lazy"` fuera del primer
  viewport no cargan (pase de scroll antes de capturar) y las animaciones scroll-driven
  (`animation-timeline: view()`) quedan congeladas a 0% fabricando huecos (capturar con
  `reducedMotion: "reduce"`; el template tiene corto-circuito).
- **El CSS del clinic pide `font-weight: 820`**: cargar la tipografía como rango variable
  `wght@300..900` (un `<link>` por familia), no como escalera estática 400-700 — si no,
  el hero cae al fallback del sistema y la receta de marca no existe en pantalla.

`--dry-run` de `factory:build` imprime los **pending inputs** (logo, asset de hero, canal
de conversión, dominio): ese listado es el checklist que se le pide al cliente, no se inventa.

## Lo que el motor todavía NO hace (no prometerlo)

- **No hay deploy.** No existe script `deploy` en `web-factory/package.json`; el pipeline
  termina en `out/`. Publicar es manual hasta que exista (F0.2 del plan de upgrade).
- **La receta no gobierna el render.** `design/auto-designer.ts` calcula `sectionPlan`,
  `tokenDirection` y guardrails, pero `generate/generate.ts` sólo copia el `.design.json`
  a `out/`: ningún template lo lee todavía (F1.4). Sirve como guía para el humano/agente,
  no como input del render.
- **Un solo layout por bloque.** No hay variantes; dos clientes del mismo template salen
  con la misma forma. Si hace falta otra forma, se decide con Sergio, no se improvisa.

Plan y estado real: `hermes-content/docs/historial/ONIA_WEB_FACTORY_UPGRADE_PLAN_20260807.md`.

## Regla Sergio (por qué existe esta skill)

Mis diseños salen genéricos. ANTES de construir: usar la galería interna
(design-stack cache, `data/references`, Pattern Bank) + skills de diseño, y exigir
**≥4 Required Qualities** (bento, depth/layering, editorial, motion, jerarquía por escala).

## Biblioteca de patrones propia (mirar ANTES de inventar)

`hermes-content/references/ui-patterns/` — patrones de interfaz **vistos en video y
reconstruidos en código por nosotros**. Cada uno es un `index.html` autocontenido, sin
dependencias, que se prueba en 2 s (`npx serve hermes-content/references/ui-patterns` o la
config `ui-patterns` de `.claude/launch.json`).

Nace de una corrección de criterio (2026-08-11): descartar un patrón visual bueno porque el
autor no regala el código es exactamente lo que produce diseño genérico. **Se mira el video
fotograma por fotograma y se rehace.** Cómo se ven los videos: skill `ver-videos`
(`fetch-video.mjs` para reels, `ig-carousel.mjs` para carruseles de imágenes).

Reglas de motion que salieron de reconstruirlos, y que aplican a TODA web nueva:
- Solo `transform` y `opacity`. Si se anima algo layout-bound (`width`), se deja comentado por qué.
- **Lento y visible**: 0.6-0.9 s en las transiciones grandes. Sergio observó que 0.4 s "no se ve".
- Curva `cubic-bezier(0.16, 1, 0.3, 1)` como default para entradas.
- `prefers-reduced-motion: reduce` siempre.
- Casi nada necesita librería: los originales usan framer-motion y salen igual en CSS puro.

**Dónde vive cada nivel** (no armar estructuras paralelas):
- Web entera vista en un reel → **learned model** en `web-factory/data/references/reels/models/`,
  catálogo `web-factory/docs/WEB_FACTORY_LEARNED_MODELS.md`. Proceso ya escrito:
  `web-factory/REELS_INTELLIGENCE_RUNBOOK.md` + `harvester/reels/{ACQUIRE,ANALYZE}.md`.
- Componente suelto → reconstruido en `ui-patterns/` (= lista de compras de `packages/blocks`).
- Patrón de movimiento → `web-factory/docs/MOTION_PATTERN_BANK_2026.md`.
- Corpus transversal de la tanda: `hermes-content/references/ui-patterns/APRENDIZAJE_WEBS.md`.

## Flujo de skills (en orden)
1. **Intake + dirección:** `brainstorming` → definir estilo concreto (no "clean minimal").
2. **Investigar patrones:** **primero `ui-patterns/` (propio)**, después browser
   (Awwwards/referencias) + `data/references` internas.
3. **Taste & sistema:** `taste-design` · `ui-ux-pro-max` · `impeccable` (reglas duras de calidad).
   **El conocimiento ordenado vive en `web-factory/DESIGN_STACK.md` §"Mapa del
   conocimiento"** — skills → pattern banks → aprendizaje crudo → packages. Leerlo
   ANTES de diseñar; el aprendizaje nuevo sigue esa cadena, nunca doc suelto.
4. **Construcción:** para sitios de cliente = editar bloques/templates del generador.
   Para superficies Next (onia-platform): `frontend-design` · `frontend-patterns` ·
   `react-components` · `shadcn-ui` · `ui-styling` · `nextjs-turbopack`.
5. **Copy:** todo texto que generamos (titulares por rubro, bajadas de fallback, servicios sin
   descripción) pasa por `humanizer` o `stop-slop` antes de quedar. `web-factory/generate/slop.test.ts`
   vigila una lista en español. El motor escribe `data/clients/<slug>.DESIGN.md` (tokens con rol,
   contraste medido, componentes, voz): es lo que lee cualquier agente para repetir el estilo.
6. **Revisión:** `design-review` + preview en navegador (verificar en vivo, no pedirle a
   Sergio que revise a mano).

## Piso de calidad / benchmark

Bench · Garabato · HSB Engineers — tomar su jerarquía, limpieza, ritmo y seriedad como piso,
sin copiar literal. Anti-template: nada de card-grid uniforme, hero genérico, defaults de
librería sin tocar. Copy hardcodeado del template en el HTML final = defecto, no estilo.

## Gates antes de main (regla dura)

- **`tsc --noEmit` verde en `web-factory/apps/site`** antes de que el avance llegue a `main`
  (Linux distingue casing de imports; `deploy-onia-center.yml` es SOLO MANUAL desde el 31-ago y publica `onia.com.bo`; `center.onia.com.bo` está bajado desde el 29-ago).
- `pnpm test` + `pnpm e2e` (los E2E incluyen axe WCAG 2.2 AA y presupuesto de Core Web Vitals).
- No filtrar WIP parcial: si un archivo nuevo importa otro nuevo, van los dos o ninguno.
- `code-review` antes de mergear.
- ⚠️ **`tsc` verde en tu máquina NO es `tsc` verde en el VPS** (`apps/onia-platform`, 3-oct): el
  `prebuild` del VPS corre `tsc --noEmit` con pnpm, que NO expone dependencias transitivas. Un
  `/// <reference types="vite/client" />` en `src/app/html-servido.ts` (vite llega por vitest)
  compiló acá con node_modules plano y en el VPS dio TS2688: «ERR: el build falló, no publico», y la
  web quedó en la versión anterior. Ningún archivo de `src/` referencia tipos de un paquete que no
  esté en `package.json`; el tipo de `import.meta.glob` vive en `src/import-meta-glob.d.ts`.

## Checklist de pre-entrega — indexabilidad (17 ítems)

> El gate de arriba verifica que **compile**. No verifica que sea **encontrable**: una web
> que compila perfecto y no la indexa nadie es una web que no sirve. Esto se corre **sobre
> el sitio construido y servido**, nunca leyendo el código — la mitad de estas cosas se ven
> bien en el fuente y salen mal en el HTML servido.

1. `/robots.txt` responde 200 y **anuncia el sitemap**.
2. `/sitemap.xml` responde 200 y es XML válido.
3. **Toda** página publicada está en el sitemap (y las internas/demo, fuera).
4. Una URL inexistente da **404 propio**, no la pantalla por defecto de Next.
5. `<link rel="canonical">` sale en el **HTML servido** de cada página, no sólo en el código.
6. `metadataBase` configurado — sin él, canonical y Open Graph salen relativos y rotos.
7. `<title>` único por página (dos páginas con el mismo título compiten entre sí).
8. `<meta name="description">` única por página.
9. Favicon presente y sirviendo 200.
10. Open Graph con `title`, `description`, `url` y `type`. **La imagen NO se inventa:**
    si no hay captura real del producto, va sin imagen — un mockup ahí es fabricar.
11. `<html lang>` correcto (`es` para Bolivia, no el `en` que viene por defecto).
12. Una sola `<h1>` por página.
13. Imágenes con `width` y `height` explícitos (si no, el layout salta y el CLS se dispara).
14. Imágenes con `alt` real; decorativas con `alt=""`.
15. Cero enlaces internos rotos.
16. HTTPS sin contenido mixto (un `http://` colado bloquea el candado).
17. El contenido está **en el HTML servido**, no sólo después de hidratar: si el rastreador
    lee la página sin ejecutar JS, tiene que ver el texto.

**Tres ítems de la lista original quedaron AFUERA a propósito** — son opinión, no falla:
"Vite + React" no es un defecto; bloquear bots de IA en `robots.txt` es decisión comercial,
no técnica; y `llms.txt` está sin verificar como estándar real.

**No usar esta lista como argumento de venta hasta que nuestras propias webs la pasen.**
Reprocharle a un prospecto lo que tenemos roto es un bumerán. Estado 2026-08-13: los ítems
1-6 y 9 están **verificados sobre el sitio servido** en `apps/onia-platform` y
`apps/dentalgest-landing`; el resto de la lista todavía no se auditó en esas dos.

## Primera pantalla sin esperar JS — `apps/onia-platform` (medido 2026-10-02)

- **El hero NUNCA va en `<Reveal>`.** El Reveal de motion sale del servidor con
  `style="opacity:0;transform:…"` y recién se ve al hidratar + bajar las features de LazyMotion:
  /precios, /empezar y otras 11 páginas tenían el titular transparente (auditoría 2-oct: LCP
  3,4-3,7 s en producción). Para lo que está en pantalla al abrir va **`<Entrada>`** de `@/motion`
  (componente de servidor, CSS puro); `<Reveal>` queda para lo que entra al scrollear.
  Gate: `src/app/titular-visible-sin-js.test.ts` renderiza con `react-dom/server` cada ruta del
  sitemap + `/terminos` y exige el bloque del `<h1>` sin `opacity:0`/`visibility:hidden` en línea.
- ⚠️ **Una entrada CSS que arranca en `opacity: 0` FALSEA el LCP.** Chrome descarta para siempre un
  elemento cuyo primer paint es transparente, aunque la animación lo muestre 16 ms después: con el
  fundido, /precios «medía» 408 ms porque el LCP pasaba a ser el botón del header, no el titular.
  Experimento mínimo (mismo HTML, 3 variantes): desde `opacity:0` → LCP = `A`; desde `0.01` o solo
  `transform` → LCP = `H1`. Por eso `<Entrada>` solo SUBE (24 px), no funde. Si un número de LCP
  «mejora» mucho, mirar QUÉ elemento reporta antes de creerle.
- Medido con build local (`next build` + `next start`), Playwright 390×844, CPU 4×, mediana de 3:
  /precios 1.752 → 484 ms · /empezar 1.640 → 388 · /rubros 1.216 → 440 (con red «Slow 4G»:
  2.844 → 1.100 · 2.840 → 1.032 · 2.908 → 832). El LCP pasó a ser el `H1` en las cuatro, = FCP.
- **Renderizar páginas en vitest** necesita `oxc: { jsx: { runtime: "automatic" } }` en
  `vitest.config.ts` (el tsconfig dice `"jsx": "preserve"` por Next y vite muere leyendo `.tsx`) y
  `/// <reference types="vite/client" />` si el test usa `import.meta.glob`.
- **El render de las páginas va en un `beforeAll(…, 60_000)`, nunca dentro del `it()`** (3-oct).
  Importar una página en frío transforma toda su cadena de módulos y eso cuenta contra los 5 s por
  defecto de vitest: con la CPU estrangulada (`taskset -c 0`, 6 workers) «/» se cayó 2 de 2 veces con
  «Test timed out in 5000ms», y `prebuild` corre esta suite antes de `next build` en el VPS. Helper
  único: `src/app/html-servido.ts` (`renderizarPublicadas`), que comparten los dos gates que renderizan.
- **Capturas `fullPage` de esta app dejan secciones en blanco** (los Reveal de abajo no alcanzan a
  entrar): pasa igual antes y después de cualquier cambio. Para mirar una sección, `scrollTo` +
  1,5 s + captura del viewport.

## Promesas de la web contra el producto — `apps/onia-platform` (barrido 2-oct, revisado 3-oct)

- **Una promesa se arregla con su gate, no solo con la frase.** El «con el control ya en la
  agenda» de estética se corrigió el 29-sep (`3cf50229f`) sin test, y el barrido del 2-oct
  encontró a sus hermanas vivas en otras pantallas: «entiende las fotos» (/chatbot y
  `pricing.ts`), «Agentes con IA que cada mañana revisan tus datos» (descripción de /agentes),
  «lo que te sirve sale por tu WhatsApp» (envío automático con 0 números conectados), «agenda
  por profesional» (no hay vista ni filtro por profesional) y «…a medias no se pierde» (un
  resultado). El 3-oct salieron dos más que el gate no veía: «Los agentes te devuelven clientes
  que se estaban yendo» (tarjeta del Crece en /precios, la página a la que el bot manda a cada
  lead) y «La IA te propone el texto y vos lo aprobás» (descripción de /agentes: se lee como que
  redacta cada mensaje; va «el texto de cada agente… lo aprobás una vez»).
- **Las formas viven en UN lugar para las dos superficies:**
  `scripts/promesa-que-el-producto-cumple.mjs`. Lo usan `src/app/promesa-que-el-producto-cumple.test.ts`
  (el sitio) y `scripts/venta-honestidad.test.mjs` de la raíz (el kit de venta). ⚠️ El barrido del
  2-oct quedó solo en la web y el one-pager que Sergio Urcullo manda a las clínicas siguió diciendo
  las cuatro promesas: una lista por superficie se afloja en una y no en la otra. La raíz importa de
  `web-factory/`; al revés no (el stage del publicador solo lleva `web-factory/`). Para un borrador
  suelto (copy nuevo, un anuncio, un mensaje): `npm run promesas:revisar -- <archivo>` (sale 1 si promete).
- **El gate lee lo que se LEE, no el código, en tres pasadas:** (1) la fuente de `src/` sin
  comentarios, sin etiquetas y sin `{" "}`; (2) el HTML que el servidor manda de cada ruta publicada
  (`src/app/html-servido.ts`, con el JSON-LD incluido); (3) los comentarios: uno que nombra una promesa
  prohibida tiene que contar que se sacó («decía hasta…», «§8», «Sin «…» desde…»).
- ⚠️ **Trampas medidas el 3-oct, cada una pasaba en verde:** `agenda <em>por profesional</em>`,
  `sale por tu{" "}<strong>WhatsApp</strong>` (prettier mete `{" "}` al cortar junto a un elemento);
  el voseo con tilde («Recuperás», «Recuperá»: la «á» rompe el prefijo `recupera` y en JS no es letra
  para `\b`) y el plural («recuperan»). Y al revés: la forma «el sistema agenda solo» prohibía en todo
  el sitio «se agendan solos desde tu link» o «entra en la agenda como una cita más», que son
  CIERTAS (el link de reserva hace `tx.appointment.create`, incluido desde Crece). Lo que hace falsa
  la frase es el SUJETO (el agente, la IA, el sistema, Onia), y la forma ahora lo exige.
- **Fuente para medir:** catálogo §2, §5, §7 y §8 + `docs/research/ONIA_INVENTARIO_IA_20261002.md` §4,
  y el código de `onia-platform` `origin/master` (no la memoria ni otra pantalla del sitio).
- ⚠️ **El catálogo se contradice en las fotos:** §5 describe el agente de WhatsApp «entiende fotos
  y audios»; §8 (2-oct) dice que NO se puede decir. Se aplicó lo más conservador (§8) y el gate
  viejo `nombre-del-addon.test.ts`, que EXIGÍA «entiende las fotos», se dio vuelta. Si una
  sesión vuelve a ver el §5, no restaura la frase sin una prueba real con un negocio conectado.
- **Fuera de este carril, todavía la dicen (3-oct)** — para que nadie dé el barrido por cerrado:
  - **Plataforma** (onia-platform `origin/master` `8de7f025`): `lib/pricing.ts:102` y `:376`, y
    **`lib/ayuda/faq.ts:314`** (la Ayuda dentro de la app: `app/(dashboard)/help`). Las exige el
    gemelo `lib/pricing-honestidad.test.ts:193-194`, que hay que dar vuelta en el mismo commit; los
    comentarios `lib/pricing.ts:81` y `app/layout.tsx:66` mandan a decirla. Comando:
    `git -C onia-platform grep -nE "entiende (las )?fotos" origin/master -- ':!docs/**'`.
  - **Marca personal:** `scripts/marca-personal/generar-carrusel-atender.py:104` y
    `generar-carrusel-chatbot.py:94` dibujan «Entiende fotos y audios».
- ⏸ **Decisión pendiente de Sergio Urcullo, NO verificado:** /chatbot vende como disponible el
  agente conversacional, que el catálogo §5 tiene en ⏸ («después de la prueba real»: nunca se
  conectó el WhatsApp de un cliente). JSON-LD con «contesta 24/7» y `availability: InStock`
  (`chatbot/page.tsx:47-57`), hero «Tu WhatsApp responde las 24 horas» y botón «Pedir el agente
  conversacional» (:102-111, :216), portada (`(sitio)/page.tsx:111`), menú (`nav.ts:38`) y pie
  (`site-footer.tsx:44`). El kit se contradice igual: el guion §0.3 dice que no se ofrece, y el
  one-pager y `04-OBJECIONES.md` lo venden. No se corrige con texto (no se exhibe obra ni
  «pronto»): o se saca de menú y portada hasta la prueba con el chip, o él acepta el riesgo.

## Una norma de un tercero cambia sola — `/facturacion` y `/guia-facturacion` (3-oct)

- **Caso:** el 30-sep la RND 102600000038 dejó sin efecto el plazo del 1-oct de los grupos 9° a 12°, y
  el h1 de `/facturacion` siguió diciendo «Desde el 1 de octubre de 2026, miles de negocios en Bolivia
  facturan únicamente en línea» tres días, igual que la meta description y el JSON-LD. Ningún gate lo
  veía: `plazo-que-vence.test.ts` pide PRESENTE y la frase estaba en presente. Lo encontró el crítico
  leyendo el PDF del SIN.
- **El texto fiscal vive SOLO en `src/lib/siat.ts`**; las páginas tipean nada más que su metadata. El
  arreglo fue cambiar ese archivo y la metadata de las dos páginas (y la de `/v1/funciones/…`, que no se
  sirve pero repetía la frase). Diseño y estructura, intactos.
- **Gate:** `src/app/(sitio)/plazo-sin-efecto.test.ts` lee lo que se SIRVE —texto visible, JSON-LD (aparte,
  para que la pregunta del FAQ no se pegue a su respuesta) y `metadata` de cada ruta publicada— más
  cada texto de `lib/siat.ts`, y pone en rojo la oración que nombra el plazo viejo, habla de facturar, lo
  afirma en presente y no dice en la misma oración que quedó sin efecto. Probado en las dos direcciones
  (con el `siat.ts` viejo: 3 rojos). Las preguntas y la historia en pasado no acusan.
- **Fuente de la norma:** `hermes-content/docs/ONIA_FACTURACION_ESTADO_REAL.md` §2.6 y la skill
  `onia-contabilidad-bolivia`. Fecha nueva que el SIN no publicó, no se escribe.
- **Segunda pasada (dos verificadores, mismo día) — lo que el primer arreglo dejó:**
  - Parafrasear la norma también es fabricar: «asigna… a quien no la tiene… figura en tu Oficina
    Virtual» no es lo que dice el Par. II (ver la skill `onia-contabilidad-bolivia`). Copiar sus límites.
  - **La urgencia sin fecha** («en la última semana», h2 «Las tres formas de no llegar», «dejarlo para
    cuando te asignen») no la ve un gate que busca la fecha. `INSINUA_UN_PLAZO` en el mismo test la caza en
    lo servido de las dos páginas y en `lib/siat.ts`; probado volviendo a poner las dos frases (rojo).
  - **Un ancla que mezcla visible y JSON-LD no prueba que se leyó el JSON-LD**: la respuesta del FAQ también
    se pinta. El ancla mira el JSON-LD solo (`const [visible, ...jsonLd] = textosDelHtml(…)`).
  - **El title se lee cortado** (~60 caracteres en un resultado): la corrección va antes del corte. «…en
    Bolivia: el plazo del 1 de octubre quedó sin efecto» (87) se leía como la obligación vieja.
  - Un botón que nombra el destino también es copy: «Qué exige la norma» → «Qué cambió en la norma».

## Worktree en disco lleno (medido 3-oct)

- El checkout entero de `onia-hermes` pesa ~6 GB y el disco de la nube quedó con 765 MB libres:
  `git worktree add` murió con «No space left on device». Se hace **sparse**:
  `git worktree add --no-checkout <ruta> <rama>` → `git sparse-checkout init --cone` →
  `git sparse-checkout set web-factory/apps/onia-platform web-factory/packages web-factory/docs
  web-factory/scripts hermes-content/sales-kit hermes-content/docs hermes-content/deploy/vps-ops/bot
  .claude scripts docs hermes-scripts onia-core supabase video-factory out output` → `git checkout`.
  ~120 MB, y `node_modules` por symlink al de la copia principal.
- ⚠️ **`scripts/imports-que-viajan-al-stage.test.ts` mide los HERMANOS de `web-factory/` en el disco.**
  Sin `web-factory/docs`, `web-factory/scripts` y los directorios raíz (`supabase`, `docs`…) da 4 rojos
  falsos («expected [...] to not include 'scripts'», «alta-confirma-vivo.mjs» como entrada muerta). No es
  un defecto del código: es el sparse. Con la lista de arriba, 13/13.

## Ojo con los monolitos

- `onia-center` (~14k líneas): **abandonado desde el 31-ago**; no se rediseña ni se le agrega nada. Su contenedor
  no se apaga (el auditor diario lo usa como runtime de node).
- `packages/templates/src/store.ts` (~3.4k líneas) viola la regla de <800. No escribir otro
  template monolítico: un rubro nuevo sale de bloques, no de un archivo nuevo de 3.000 líneas.
- `apps/onia-platform/**` es la landing en producción: carril aparte, no tocar de paso.

## Fotos generadas por IA en una superficie de venta

Decisión, dirección fotográfica, shot list y gate completos →
**`hermes-content/docs/ONIA_WEB_IMAGENES_DE_CONTEXTO.md`**. Acá sólo lo que hace tropezar:

- **La interfaz NUNCA la dibuja la IA.** La captura es real; la IA genera **contexto y uso**
  (personas en su negocio). Una UI generada es *fabricar producto* y está prohibido. En la foto
  el dispositivo va **boca abajo, cerrado o girado hacia la palma**.
- **⚠️ En un modelo sin `negative_prompt`, la lista de "evitar" INVOCA lo que nombra.** `text2image_soul_v2`
  sólo acepta `quality` y `soul_id`: todo lo demás cae en el MISMO campo de texto. Un lote de 6
  con sección `Avoid: dashboards, blue neon, candlestick charts, man in a suit pointing at a
  whiteboard` devolvió exactamente eso — pantallas de datos azules, un gráfico de velas y el
  señor de traje señalando la pizarra. **6/6 rechazadas.** El prompt se escribe **100%
  afirmativo**: lo que no querés que aparezca no se nombra, se reemplaza por su opuesto descrito
  como hecho físico (`a closed laptop rests shut on the box`, no `no readable screen`).
- **Si el prompt describe ropa, el modelo le pone marca.** Ya pasó tres veces: logo de Nike,
  gorra de NY, y un uniforme bordado **"BOLVIA"** (marca inventada con falta de ortografía).
  Mirar pecho, gorra y taza de cada imagen antes de aprobar.
- **Un asset generado que no pasó el gate no se deja tirado en `public/`.** Los
  `public/fotos/*.webp` viejos (sonrisa a cámara, bata blanca, grade teal-naranja) sobrevivieron
  meses ahí y la sesión siguiente casi los cablea creyéndolos material bueno. Si no se pueden
  borrar porque algo los referencia, **queda escrito en el doc del tema por qué no sirven**.
- **Una imagen se juzga MONTADA al tamaño real** en que se va a ver, no abierta a pantalla
  completa. Un recorte nítido a 1434 px puede ser ilegible en una tarjeta de 290 px.
- **Gasto:** imagen en lote chico = trivial y ya validado (~0,12 cr por imagen 2k). **Video =
  permiso explícito de Sergio con `get_cost` por delante.** Registrar cada lote.
