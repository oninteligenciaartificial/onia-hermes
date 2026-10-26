# ONIA — Plan de upgrade de Web Factory (2026-08-07)

Pedido de Sergio: *"las webs las tendremos que hacer nosotros, mejora la web-factory para ir desarrollando webs"*. Objetivo: producir **más rápido y mejor**, sin romper la regla anti-genérico ([[web-factory-disenos-genericos]]).

Base: tres auditorías del mismo worktree (`estado real`, `calidad de diseño`, `velocidad/benchmark`) corridas hoy sobre `claude/git-status-935f47`. Todo lo que sigue cita ruta real del repo.

Producto que se vende: Landing Bs 790 / Web Pro Bs 1.500 (lanzamiento) + Cuidado Web mensual. Dominio y hosting los paga el cliente, a su nombre.

---

## 1. Estado real hoy (10 líneas honestas)

1. **Es un generador de HTML estático, no una app.** `web-factory/generate/generate.ts` (136 líneas) toma `data/clients/<slug>.json` y escribe `out/<slug>/index.html` + `site.css`. Sin React, sin build de Next en el entregable. Eso está bien y hay que conservarlo.
2. **Los tests son de verdad.** 97 unit / 18 archivos verdes en 1,5 s; 45 E2E Playwright con axe WCAG 2.2 AA y presupuesto de Core Web Vitals (`web-factory/tests/e2e/perf.spec.ts`, `a11y.spec.ts`). El `global-setup.ts` regenera los demos antes de testear: se testea el artefacto real.
3. **La QA diaria está viva.** Workflow n8n `GFeCZKr1zQT6CVN8` corrió hoy 12:00 UTC, success, 17 s; `aHFLqEtzqvq6SE3e` (radar VPS) hoy 11:10 UTC, success.
4. **Hay 5 templates pero una sola forma.** `packages/blocks/src/hero.ts` (80 líneas) tiene **un** layout; features y footer lo mismo. `landing.ts` (462) produce **la misma página** para dental, restaurante, SaaS e ingeniería: sólo cambia el hue.
5. **El único template a la altura es dental.** `landing-clinic.ts` + `clinic-css.ts` (122 + 617) cumple 6-7 de las 10 Required Qualities — pero fue escrito a mano para un dentista y lleva el copy hardcodeado (`packages/blocks/src/clinic-services.ts:25`).
6. **El cerebro de diseño está apagado.** `design/auto-designer.ts` (1.791 líneas) calcula `sectionPlan`, `tokenDirection` y `antiGenericGuardrails` (`:72-97`, `:779-783`) y `generate/generate.ts:96-115` **sólo lo copia** a `out/`. Ningún template lo lee. Es el patrón "construido ≠ terminado" del CLAUDE.md.
7. **No hay deploy.** Cero script `deploy` en `web-factory/package.json`. El único workflow de CI es `deploy-onia-center.yml`, para el panel interno. El pipeline muere en `out/`.
8. **El sistema de diseño existe, pero es sólo para nosotros.** `apps/onia-platform/src/app/globals.css` (419 líneas) tiene rampa de 9 pasos, escala tipográfica con clamp, `--space-section`, sombras y dark con criterio escrito. `packages/tokens/src/index.ts` (130) — lo que recibe el cliente — son 5 hex planos y `--radius: 0.75rem`. **Onia se diseña mejor a sí misma que a quien le paga.**
9. **Tres intakes incompatibles.** `web-factory/intake-cliente.html` (manda un Telegram, workflow n8n `w3vgUCV1yMkv70TW`), `apps/site/src/app/onia-center/web-factory/intake-form.tsx` (descarga un JSON, `:98,106-111`) y escribirlo a mano. Ninguno dispara un build.
10. **Cero clientes pagantes pasaron por el generador.** `data/clients/` tiene 9 slugs: 8 `*-demo` y `nuvia`, que además en producción corre una implementación Next paralela hecha a mano (`apps/site/src/app/nuvia/**`) que no importa `@onia/templates`.

---

## 2. El cuello de botella real

> **Cada web que no puede salir genérica cuesta escribir un template nuevo a mano. El render no tiene variación, y la receta que ya la calcularía no gobierna nada.**

No es el deploy (falta, pero se resuelve en una tarde). No es el motor (renderiza en segundos). Es que **la fábrica sólo sabe hacer una forma por template**, y la casa prohíbe entregar esa forma.

Cadena de evidencia:

| Hecho | Ruta / medición |
|---|---|
| Un solo layout por bloque | `packages/blocks/src/hero.ts` = 80 líneas, un layout. Idem `features.ts`, `footer.ts`. |
| Copy de plantilla hardcodeado | `packages/blocks/src/features.ts:21-22` emite `<h2>Servicios claros desde la primera visita</h2>` **para todo cliente**. La clínica y el SaaS muestran el mismo titular. |
| El workhorse saca 1/10 | 5 de 8 demos usan `landing`; `demo`, `saas-demo` y `restaurant-demo` son idénticos salvo el tono. Cero `:hover`, cero `:focus-visible`, cero `transition` en 462 líneas. |
| La única salida buena no es reusable | `landing-clinic` dice "Todo lo que tu sonrisa necesita" (`clinic-services.ts:25`) y "Manos expertas, trato humano" (`clinic-feature.ts:27`). Para un veterinario hay que **editar el código fuente**. |
| Escalar un rubro cuesta un monolito | `store.ts` = **3.426 líneas** (viola la regla de <800), con la palabra "Nuvia" 14 veces en copy, `--nuvia-*` hardcodeados en `:1339-1347` y el H1 de Nuvia en `:80`. Un segundo cliente de ecommerce recibe la marca de Nuvia. |
| La inteligencia ya calculada se tira | `auto-designer.ts:779-783` produce `sectionPlan` + `tokenDirection` + guardrails; `generate.ts:100` los `cp` a `out/` como archivos sueltos. |
| Resultado medible | 1 mes de existencia, 0 webs de cliente pagante. |

**Consecuencia económica:** a Bs 790 la landing, si cada web anti-genérica exige escribir 400-3.400 líneas de template, el margen es negativo. Todo lo demás (deploy, CMS, imágenes IA) sólo acelera la entrega de webs que no queremos entregar.

---

## 3. Plan por fases

### F0 — Esta semana. Destrabar y limpiar. (1-2 días)

Nada de esto es diseño. Es sacar la basura y poder publicar lo que ya existe.

| # | Qué | Dónde | Tamaño |
|---|---|---|---|
| F0.1 | Agregar `"landing-clinic"` al parser y al tipo (hoy el mejor template está fuera del comando de una pasada) | `generate/factory-build.ts:191`, `design/auto-designer.ts:6` | 2 líneas |
| F0.2 | `pnpm deploy <slug>` → `wrangler pages deploy out/<slug> --project-name <slug>`, token del cliente leído de `data/clients/<slug>.deploy.json` | nuevo `generate/deploy.ts` + script en `web-factory/package.json` | ~40 líneas |
| F0.3 | **Antes de F0.2**: agregar `*.deploy.json` al `.gitignore` raíz. Hoy no está y el autosync commitea solo | `.gitignore` | 1 línea |
| F0.4 | Slug opcional en `images:check` (hoy `pnpm images:check` sin argumento tira `error: missing required argument 'slug'`) | `generate/check-images.ts`, `package.json:32` | 5 líneas |
| F0.5 | 6 bugs de diseño de una línea cada uno: `.wf-proof-points` sin CSS (sale con viñetas de Times) · `features.ts:9` usa iniciales `"SP"/"PH"` en vez del `renderIcon()` que ya existe en `blocks/src/icons.ts` · `store.ts:1694` `overflow-wrap: anywhere` → `break-word` (hoy corta "PROMOCIONE / S LISTAS") · contraste del CTA coral `#ff6b6b` = 2,73:1, 18 nodos que fallan axe · sticky CTA tapando el chip a 390px en `clinic-css.ts` · `.wf-feature-number { margin-top: auto }` desalinea 27px la 3ª tarjeta | `packages/templates/src/`, `packages/blocks/src/` | ~10 líneas |
| F0.6 | Borrar muerto: `harvester/assets/unsplash.ts`, `harvester/github/clone.ts`, `harvester/registry/add.ts`, `harvester/blocks-html/import.ts` (nadie los importa), `web-factory/landing-demo-newsakura.html`, `data/hero-presets/securify-video-security.json`, workflow n8n duplicado `iqsnnQXlJyypiew8` (`active:false`) | — | borrado |
| F0.7 | Actualizar `.claude/skills/onia-web-factory/SKILL.md` (36 líneas): hoy **no menciona** `pnpm generate`, `factory:build`, templates ni intake — describe construir React a mano. Por eso los agentes trabajan por fuera del motor | `.claude/skills/onia-web-factory/SKILL.md` | ~20 líneas |

**Definición de hecho de F0:** una web (aunque sea `dental-demo`) **publicada en Cloudflare Pages y abierta desde el celular**. Sin eso, F0 no está hecho — está construido.

---

### F1 — El salto de calidad de diseño. (2-3 semanas reales, es la fase grande)

Esto es lo que ataca el cuello de botella. Cinco piezas, en este orden.

**F1.1 — Subir el sistema que ya tenemos a los tokens del cliente.**
Copiar y parametrizar `apps/onia-platform/src/app/globals.css` (419 líneas) dentro de `packages/tokens/src/`: rampa de 9 pasos, escala `--text-display/hero/h2/h3/body` con clamp, `--space-section`, `--radius` + `--radius-lg`, `--shadow-card`/`--shadow-pop`, dark con criterio. **No se diseña nada nuevo, se muda lo que ya funciona.** Hoy los templates ni usan los 5 tokens que tienen: `var(--radius)` aparece 8 veces contra **once radios hardcodeados distintos** (`999px` ×28, `14px` ×6, `8px` ×5…).
Archivos: `packages/tokens/src/index.ts`, nuevo `packages/tokens/src/scale.ts`.

**F1.2 — Variantes por bloque. La variante buena ya está escrita.**
Cada función de `packages/blocks/src/` gana un parámetro `variant`. Clave: los bloques `clinic-*` **ya son la segunda variante** de cada sección — hay que generalizarles el copy a data, no inventarlas.

| Sección | variante A (existe) | variante B (existe, hay que generalizar) | variante C (nueva) |
|---|---|---|---|
| hero | `hero.ts` split | `clinic-hero.ts` full-bleed + scrim | editorial (título desbordado) |
| servicios | `features.ts` 3 cards | `clinic-services.ts` bento | lista numerada editorial |
| proof | `trust.ts` (**muerto, nadie lo llama**) | — | marquee de logos |
| proceso | `process.ts` (**muerto**) | `clinic-process.ts` timeline | — |
| faq | `faq.ts` (**muerto**) | `clinic-faq` 2 columnas | — |
| cta | `sticky-cta.ts` | panel con gradiente (en `landing-clinic.ts`) | — |

Nota: `renderFaq`, `renderProcess` y `renderTrust` están exportados en `packages/blocks/src/index.ts:6-8`, **tienen tests unitarios** y ningún template los llama. El schema pide `faq[]`, `proceso[]`, `credenciales[]` (`packages/blocks/src/types.ts:26-30`) y `landing` los tira. Recuperar eso es gratis.

**F1.3 — Packs de dirección de arte.**
Nuevo `packages/tokens/src/art-direction.ts`: 5 packs, cada uno = tipografía + escala + densidad + radio + sombra + motion **como unidad**. Propuesta: `editorial`, `swiss`, `warm-local`, `bento-saas`, `luxury-dark`. Este es el eje que ni Tailwind ni shadcn tocan y la razón por la que todo se ve a plantilla.
Incluye **cargar webfont**: hoy no hay un solo `@font-face` ni `<link>` a fuentes (`landing.ts:45-62`), y heading = body en 9 de 10 clientes. En el celular del visitante cae a `system-ui` y la web se ve distinta de la que aprobó Sergio.

**F1.4 — Cablear la receta al render (el tramo que falta).**
`AutoDesignRecipe` gana `variants: Record<Section, VariantId>` y `artDirection: PackId`. `generate/generate.ts` lee `data/clients/<slug>.design.json` y se lo pasa al compositor en vez de invocar un template fijo. La inferencia de vertical, la selección de referencias y `tokenDirection` **ya están calculadas** en `auto-designer.ts:779-783`: es conectar, no construir.

**F1.5 — Retirar los monolitos.**
Cuando el compositor cubra las 3 secciones de `landing`, jubilar `landing.ts`. Des-Nuvializar `store.ts`: sacar el H1 (`:80`), las 14 menciones a "Nuvia", el FAQ dermatológico y `--nuvia-*` (`:1339-1347`) a `data/clients/<slug>.json`. Es el trabajo con más ROI del repo: convierte la mejor pieza de la fábrica en algo vendible dos veces.

**F1.6 — Gate de diseño en el E2E que ya corre.**
Extender `web-factory/tests/e2e/` (no crear suite nueva): `:focus-visible` presente en todo control, contraste ≥4,5 en CTAs, cero slots de imagen vacíos (hoy `clinic-feature.ts:8` deja una caja blanca de 280px si falta `imagenSecundaria`), cero copy hardcodeado del template en el HTML final, y el check de repetición de §4.

**Definición de hecho de F1:** dos clientes de **rubros distintos** generados sin tocar código, ambos pasando el gate de diseño, y visiblemente distintos entre sí puestos lado a lado.

---

### F2 — Automatizar brief → publicada. (1 semana, después de F1)

**F2.1 — Un solo intake.** Matar `web-factory/intake-cliente.html` y el workflow n8n `w3vgUCV1yMkv70TW` (hoy sólo manda un Telegram; alguien transcribe a mano). Queda el del panel, `apps/site/src/app/onia-center/web-factory/intake-form.tsx`, que ya arma el JSON correcto: en vez de descargarlo (`:106-111`), que lo POSTee a un endpoint que escriba `data/intakes/<slug>.json` y dispare `factory:build`.

**F2.2 — Preview aprobable desde el celular.** `apps/site/src/app/factory/page.tsx` ya monta un preview; publicar `out/<slug>` a un subdominio de preview del VPS. La regla de la casa es aprobar el mockup antes de portar, no rediseñar a ciegas: el preview es ese punto de aprobación.

**F2.3 — Deploy en el flujo.** El comando sale de F0.2. Aquí se le suma el checklist de dominio: el cliente compra el `.com` en Cloudflare Registrar con **su** tarjeta (≈$10,44/año, sin markup) y crea un API token con permiso **sólo** `Account → Cloudflare Pages → Edit`. Si nos despide, revoca el token. Nunca tocamos su medio de pago. `.com.bo` cuesta $40-80/año: se vende `.com` salvo que el cliente exija `.bo`.

**F2.4 — Imágenes con presupuesto fijo.** Donde hoy está `harvester/assets/unsplash.ts` muerto: Flux Schnell/Dev ($0,015-0,025) para fotografía y Recraft vector ($0,08, el único que devuelve SVG) para iconos de marca. **Una web completa con 12 imágenes cuesta <$1.** Aplica `gasto-plataformas-validar-primero`: se pide OK **una vez por presupuesto de sitio**, no imagen por imagen.

**F2.5 — CMS: NO todavía.** Keystatic o Decap (git-based, sin DB, gratis) convierte el Cuidado Web de "hacer cambios" a "monitoreo + mejoras". Se agrega cuando haya **≥3 clientes con mensual activo**, no antes.

**Definición de hecho de F2:** de un formulario enviado a una URL en vivo sin que nadie abra la terminal, salvo el paso de aprobación de Sergio.

---

## 4. El sistema de variación (que no salgan todas iguales)

Tres ejes que se combinan. Si sólo varía el color, salen sitios gemelos pintados distinto — exactamente lo que pasa hoy.

| Eje | Valores | Dónde vive |
|---|---|---|
| Pack de dirección de arte | 5 (`editorial`, `swiss`, `warm-local`, `bento-saas`, `luxury-dark`) | `packages/tokens/src/art-direction.ts` (F1.3) |
| Variante por sección | hero ×3, servicios ×3, proof ×2, proceso ×2, faq ×2, cta ×2 | `packages/blocks/src/*.ts`, parámetro `variant` (F1.2) |
| Color | derivado del logo en OKLCH (perceptualmente uniforme: la rampa completa sale de un color sin retoque) | `packages/tokens/src/index.ts` (F1.1) |

**Combinatoria: 5 × 3 × 3 × 2 × 2 × 2 = 360 composiciones** desde ~30 archivos de 100-200 líneas. Hoy: 1 composición por template, desde archivos de 462 a 3.426 líneas.

**Cómo se define la dirección de arte de un cliente concreto** (4 pasos, ninguno inventado desde cero):

1. **El auto-designer propone.** `design/auto-designer.ts` ya infiere vertical con nivel de confianza (`inferVertical`, `:971`). Regla nueva: cada vertical mapea a una **shortlist de 2 packs compatibles**, nunca a uno solo.
2. **El intake desempata.** `data/schema.ts:51-58` ya guarda `brand.references[]` con `use` y `avoid` por referencia. Esas señales eligen entre los 2 packs y fijan la variante de hero.
3. **Sergio aprueba antes de generar.** Una pantalla con pack + variante de hero + paleta derivada. Aprobado eso, se porta fiel; no se rediseña después (regla de velocidad: método correcto al primer intento).
4. **Anti-clon automático.** Registro `data/clients/_art-direction-usage.json`: `{slug, vertical, ciudad, pack, heroVariant}`. El gate de F1.6 **falla el build** si la combinación pack+heroVariant ya se usó en el mismo vertical y ciudad. Un JSON y un check — no hace falta más.

---

## 5. Qué se le pide al cliente y qué hace el sistema solo

### Le pedimos al cliente (cerrable en una llamada de 20 minutos)

1. Logo (o el texto de la marca si no tiene).
2. 3 a 6 servicios: nombre + una frase de qué resuelve.
3. WhatsApp y/o email, dirección, horarios.
4. **2-3 webs que le gustan y 1 que no** — con una razón cada una. Es lo que alimenta el eje de variación (§4.2).
5. **Fotos reales** del local, el equipo o los trabajos. No negociable: `landing-clinic` con un placeholder de hero sale un puré gris ilegible. Si no hay fotos, se acuerda producirlas (F2.4) antes de empezar.
6. 5 preguntas que le hacen sus clientes de verdad (alimenta el bloque FAQ, hoy muerto).
7. **Dominio y hosting a su nombre**: compra el dominio con su tarjeta y nos pasa un API token de Cloudflare Pages limitado a `Pages:Edit`.

### Lo hace el sistema solo

Slug y perfil (`generate/create-client.ts`) · rubro inferido y referencias seleccionadas (`design/auto-designer.ts`) · pack + variantes + paleta derivada del logo (F1) · copy de secciones armado desde los datos del cliente · iconos SVG (`packages/blocks/src/icons.ts`, ya existe con 14 lucide) · dark mode · accesibilidad AA verificada · presupuesto de performance verificado (`tests/e2e/perf.spec.ts`) · preview compartible · deploy · **y el listado explícito de lo que falta**: `getMissingClientInputs` (`data/intake-schema.ts:364-405`) ya devuelve "logo o marca visual", "referencias visuales exactas", "asset principal del hero", "canal de conversión", "dominio". Eso se convierte en el checklist que se le manda al cliente.

---

## 6. Riesgos y qué NO hacer

### Qué NO hacer

- **NO migrar a Astro ni a Next para sitios de cliente.** El generador ya emite HTML+CSS estático, que es exactamente el artefacto que Cloudflare Pages quiere servir. Migrar sería reescribir el motor para llegar al mismo lugar. Astro se justificaría sólo con 50+ páginas y colecciones de contenido.
- **NO Vercel para sitios de cliente.** El plan Hobby **prohíbe el uso comercial**; Pro son $20/usuario/mes. Con landings de Bs 790 eso se come el margen.
- **NO hostear en nuestro VPS.** Contradice "a nombre del cliente", crea dependencia y costo de soporte. Coolify/Dokploy sirven para previews y staging, no para producción de cliente.
- **NO v0 / Lovable / Bolt como motor de producción.** Generan proyectos genéricos **fuera** de nuestro sistema de tokens: violan la regla anti-genérico y no acumulan — cada sitio arranca de cero. Claude Code sobre el motor propio sí acumula.
- **NO Relume + Webflow.** Excelente si fuéramos diseñadores no-devs. Tenemos motor propio: sumar Webflow es un stack paralelo más una suscripción por cabeza.
- **NO Payload multi-tenant ni ningún CMS con DB.** Es un servidor que mantener y rompe el modelo "hosting a nombre del cliente".
- **NO escribir un template monolítico más.** `store.ts` con 3.426 líneas ya viola la regla de <800 y es la razón de que un rubro nuevo cueste días.

### Riesgos

| Riesgo | Evidencia | Mitigación |
|---|---|---|
| F1 se estira semanas y no sale ninguna web | Es la fase grande y la más tentadora de perfeccionar | Orden estricto: F0 primero (poder publicar lo que hay) y F1 se corta **por pack**: el primero completo y usado en un cliente antes de tocar el segundo |
| El auto-designer decide con datos viejos | `latest-harvest-summary.json` dice `startedAt 2026-07-03`; `latest-design-intelligence.json` dice `generatedAt 2026-07-18`. El cron corre a diario y da success, pero escribe en `/opt/onia-hermes/web-factory` del VPS y el runbook prohíbe el push automático | Traer el resultado del radar al repo (o aceptar explícitamente que la inteligencia se refresca a mano y dejarlo escrito) |
| Los screenshots de referencia no viajan | Apuntan a `C:/Users/PC/.codex/design-stack/gallery-examples-full/...`, fuera del repo. La casa trabaja multi-dispositivo | Guardar en el repo sólo las referencias efectivamente usadas por cliente, no el caché completo |
| Token de cliente commiteado por el autosync | `.gitignore` **no tiene** regla para `*.deploy.json` y el hook `Stop` commitea solo | F0.3 antes que F0.2, sin excepción |
| Los agentes siguen construyendo por fuera del motor | `.claude/skills/onia-web-factory/SKILL.md` no menciona el generador; el subagente `web-factory-builder` dice "Next.js/TypeScript" y "superficie flagship: Nuvia" | F0.7 |
| Dos implementaciones de la misma tienda | La Nuvia viva (`apps/site/src/app/nuvia/**`) no importa `@onia/templates`; el `store.ts` del generador es otra cosa | Decidir en F1.5 cuál sobrevive. No mantener las dos |
| Límite de dominios custom en Cloudflare Pages free | Las fuentes secundarias se contradicen (5 por proyecto vs 1 por cuenta); la doc oficial sólo confirma 100k requests/día | Confirmar creando un proyecto de prueba **antes** de prometérselo a un cliente. 2 minutos |

---

## Orden de ejecución

```
F0 (1-2 días)  → termina con UNA web publicada y abierta desde el celular
F1 (2-3 sem)   → termina con DOS rubros distintos generados sin tocar código
F2 (1 sem)     → termina con formulario → URL en vivo, sin terminal
```

Regla de la casa que aplica a las tres: **construido ≠ terminado**. Una fase cierra cuando está encendida y verificada en producción, no cuando está commiteada.
