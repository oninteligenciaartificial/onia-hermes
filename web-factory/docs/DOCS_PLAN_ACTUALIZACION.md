# PLAN DE ACTUALIZACION — docs del carril web-factory

Base: 41 hallazgos verificados. Todo lo de abajo cita archivo y linea. Lo que no verifique yo mismo va marcado.

---

## 1. Los 5 arreglos de mayor impacto (en orden)

**1. Marca: el doc "canonico" manda reinstalar tipografia y prohibir el verde que estan VIVOS en produccion.**
`web-factory/docs/ONIA_BRAND_IDENTITY_2026.md` — editar §0.3, §1.2, §2, §3.3, §4, §5 y el encabezado (lineas 3-6).
Por que primero: es el unico doc de marca sin fecha, se autodeclara canonico y dice "doc y codigo dicen lo mismo" — hoy es falso. §2 ordena Bricolage + DM Sans + Spline Mono; `apps/onia-platform/src/app/layout.tsx:3` carga **solo** `{ Archivo, Geist_Mono }` y `globals.css:86-88` mapea los tres roles a esas dos. §1.2/§3.3 prohiben la familia lima/neon; `--senal: #00D26A` (globals.css:48) es el fondo del `.btnPrimary` (landing.module.css:194-197), del `.signalBlock` de `(sitio)` y del `src/app/icon.svg`. §4 apunta a `components/brand-wordmark.tsx`, que **no existe** (el vivo es `components/brand-logo.tsx:25-26` sirviendo `/brand/v2/onia-logo.svg`).
El daño no es cosmetico: una sesion que aplique "gana el que no tiene fecha" reinstala las 4 fuentes que `layout.tsx:11-16` documenta haber retirado, y arranca del codigo un verde que Sergio ratifico y esta publicado desde el 27-jul.
Precauciones al editar: **no borrar el trio** — sigue vivo y legitimo en video (`hermes-content/brand/fonts/` + 8 composiciones HyperFrames que citan "§2"). §2 se parte por superficie: web = Archivo + Geist Mono; video/assets = el trio. Y el verde entra como **excepcion nombrada** (`--senal`/`--tinta` para CTA y tile), no como reescritura de la escala esmeralda.

**2. El radar diario esta encendido y roto hace 8 semanas, y dos docs dicen "listo".**
Arreglo de CODIGO + 2 docs. `harvester/vision/scrape_gallery_examples.mjs:10` hardcodea `DEFAULT_CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe"` y solo se pisa con el flag `--chrome`, sin env var. En el VPS Linux Playwright nunca lanza el navegador: ~55 corridas seguidas con `ok:false` ("Fallo references-harvest con exitCode=1"), la ultima 2026-08-29. Como `scripts/web-factory-vps-automation.mjs:70-73` hace throw en el primer paso, `references-intelligence` **no corre nunca**: `docs/WEB_FACTORY_DESIGN_INTELLIGENCE_LATEST.md` dice "Generated: 2026-07-18".
Docs a corregir: `docs/WEB_FACTORY_OPERATING_RUNBOOK_20260625.md:141-142` (dos filas dicen "listo" → "encendido y roto en VPS") y `docs/WEB_FACTORY_VPS_AUTOMATION_20260630.md:215-224` ("Bloqueos actuales" → "Estado en produccion": workflow `aHFLqEtzqvq6SE3e` activo desde 2026-07-04, cron `10 7 * * 1-6`, credencial `ONIA VPS SSH`, notificacion de exito `disabled:true`). Agregar en el mismo doc lo que NO documenta: `/opt/onia-hermes` es un **symlink a `/opt/onia-center-src`, sin git**, desempacado de un tarball — su `packages/templates/src/` tiene 3 archivos contra 9 locales; falta el paso de actualizacion. Barrer tambien `apps/site/src/app/onia-center/web-factory/source.ts:935` ("Activar workflow n8n…" ya activado).
Por que segundo: mientras siga roto, todo aprendizaje automatico del carril esta congelado desde el 18-jul y el operador lee "listo" en el panel.
No tocar: la ruta `/opt/onia-hermes/web-factory` — `hermes-content/deploy/n8n/workflows/web-factory-vps-radar.workflow.js:33-34` depende del symlink.

**3. `web-factory/README.md`: la puerta de entrada del carril describe otra fabrica.**
Cuatro defectos en un solo archivo: (a) `## Stack` (lineas 7-11) vende Next+Tailwind+shadcn cuando `FACTORY.md:34-38` decide (2026-08-29, con Sergio) que el default de cliente es HTML+CSS estatico y `generate/generate.ts:83-89` escribe solo `index.html` + `site.css`; (b) linea 162 dice 3 bloques, `packages/blocks/src/index.ts` exporta 24; (c) linea 163 dice 1 template "composed from the three seed blocks", `data/schema.ts:8-16` declara 7 y `landing.ts` importa 6 bloques; (d) tres snippets llaman codigo borrado en `d243f4b0`: `addRegistryComponent` (186), `searchUnsplash` (205-209) y el importador `harvester/blocks-html/` (211-216).
Edicion: partir Stack en los dos niveles de FACTORY.md (nivel 1 default, nivel 2 = `apps/site` — **no borrar** Next/Tailwind/shadcn, existen y son lo que corren `pnpm dev`/`pnpm build`); reemplazar las listas por punteros a `packages/blocks/src/index.ts` y `packages/templates/src/index.ts` (no hardcodear "24" y "7", se pudren igual que el "3"); borrar el snippet del registry dejando `pnpm dlx shadcn@latest add`, y reemplazar el de Unsplash por la llamada HTTP real que ya documenta `SOURCES.md:290`. Barrer los hermanos: `SOURCES.md:67` y `FACTORY.md:66-71` (arbol de `harvester/` con 3 carpetas inexistentes; faltan `product/` y `reels/`, cableadas a 14 scripts).
Aviso de carril: README.md y FACTORY.md son archivos raiz de web-factory — avisar antes segun `COORDINATION_MANIFEST.md`.

**4. `docs/MOTION_PATTERN_BANK_2026.md:468` — un renglon que viola tres reglas duras y es gate obligatorio.**
La regla 8 dice: `"proximamente" honesto para lo que no existe` (choca con "La venta nunca exhibe obra"; su hermano `docs/WEB_FACTORY_FORMULA_2026.md:184` ya dice lo correcto), `precios solo "DentalGest desde Bs 320/mes"` (un doc no define precio — manda `onia-platform/lib/subscription-plans.ts`) y usa **DentalGest**, nombre viejo de pack, como sujeto del copy que ve el cliente.
Es el gate anti-IA que toda landing de cliente atraviesa (`.claude/skills/onia-web-factory/SKILL.md:126` y `onia-router` rutean a el): cada landing nueva hereda las tres violaciones. Costo del arreglo: una linea. Reemplazo: "lo que no existe NO SE NOMBRA (la demanda futura se captura sin admitir obra); precios solo 'modulo dental desde Bs <basic.monthly>/mes — precios de lanzamiento', leyendo el monto de subscription-plans.ts; add-ons de lib/pricing.ts".
Pendiente separado detectado de paso: `docs/ONIA_WIZARD_EMPEZAR_SPEC_2026.md:59,72,116,317` tiene copy de cliente con "proximamente" y literal "Este rubro esta en construccion" — misma regla, violacion mas directa.

**5. `docs/DASHBOARD_PATTERN_BANK_2026.md` manda deshacer trabajo ya terminado, con la paleta equivocada.**
Su §5 y el item 1 del "Checklist de cierre" marcan `[CRITICO] Sacar SERIES_COLORS de la marca`. Ya se hizo: `packages/templates/src/dashboard.ts:336` dice "la tinta de dato NO sale de la marca" y `:352` compone `var(--wf-series-N)` desde `SERIES_THEME` (6 pares light/dark, commit `8fa44440`, orden validado con el validador de dataviz contra los surfaces reales — peor delta-E adyacente 13.2, gate 8). Quien obedezca el doc rehace el fix Y pisa la paleta validada con el orden crudo de `references/palette.md`.
Edicion: `[FIX CRITICO]` → `[OK] preservar`, con el snippet de HEAD y el porque son vars y no hex; mover el item 1 del checklist a "[PRESERVAR]"; corregir anclas corridas (`dashboard.ts:337` → `:352`; `:606` → `:608-611`).
**Ojo:** no usar los hex del hallazgo (`#0e7c66,#c98a3b,#3d6fa5,#9d4e86,#7a9a3e,#c05a48`) — son del commit intermedio `03a892f6` y ya no existen. Los de HEAD son `#1baf7a #2a78d6 #eb6834 #4a3aa7 #eda100 #e87ba4` (light).

---

## 2. Consolidaciones — un tema, un archivo sin fecha

**A. MARCA (6 archivos, el bloque mas roto).** Ganador: **`web-factory/docs/ONIA_BRAND_IDENTITY_2026.md`** (sin fecha, ya se autodeclara canonico, ya lo citan `hermes-content/brand/fonts/README.md:4` y `scripts/hyperframes/README.md:90`).
Absorbe: `ONIA_MARCA_SISTEMA_20260726.md` §3 (tipografia real Archivo+Geist Mono — es lo que cita `globals.css:80` como "regla dura"), `ONIA_MARCA_ESTRATEGIA_20260727.md` §2.3/§2.4/§4-bis (verde #00D26A, tile, paleta que emite el codigo) y `TIPOGRAFIA_SISTEMA_20260727.md` §1/§3 (escala + presupuesto de familias, corregido a DOS).
Punteros a actualizar en el MISMO commit: `apps/onia-platform/src/components/brand-logo.tsx:7` (cita ESTRATEGIA §4-bis), `apps/onia-platform/scripts/generate-brand-icons.mjs:4` (cita LOGO_SPEC y genera desde el favicon v1 mientras `src/app/icon.svg` ya es v2), `ONIA_BRAND_IDENTITY_2026.md:5,99`, `WEB_FACTORY_OPERATING_RUNBOOK_20260625.md`, `TIPOGRAFIA_SISTEMA_20260727.md:127`.
Remanente a decidir, no a ignorar: `packages/templates/src/landing-logistics.ts:264-268` y `landing-realestate.ts:231-236` cargan Bricolage+DM Sans de Google Fonts llamandolas "The two ONIA families" y citando el doc que va a decir lo contrario.

**B. OPERACION VPS.** `WEB_FACTORY_OPERATING_RUNBOOK_20260625.md` + `WEB_FACTORY_VPS_AUTOMATION_20260630.md` son el mismo tema (el segundo se cita desde el primero, linea 162). Ganador: **`web-factory/docs/WEB_FACTORY_RUNBOOK.md`** (sin fecha), con la automatizacion como seccion.
**Renombre atomico obligatorio**: `apps/site/src/app/onia-center/web-factory/source.ts:1102` imprime esa ruta al usuario bajo "Fuentes canonicas". Mover sin tocar `source.ts` deja el panel de ONIA Center mostrando un archivo inexistente.

**C. ENTRADA DEL MOTOR.** `README.md` y `FACTORY.md` se pisan en Stack y en estructura de carpetas. No fusionar (uno es onboarding, otro decision), pero **FACTORY.md manda sobre stack y estructura** y el README apunta a el en vez de repetirlo. Ninguno de los dos vuelve a enumerar bloques ni templates a mano.

**D. DASHBOARD (3 archivos).** Ganador: **`docs/DASHBOARD_PATTERN_BANK_2026.md`** (sin fecha, anclado al codigo linea por linea). Absorbe la §Dashboard de `WEB_FACTORY_PATTERN_BANK_2026.md` (lineas 482-583, hoy contradictoria consigo misma) y lo poco vivo de `WEB_FACTORY_DASHBOARD_INTELLIGENCE_20260703.md`.

**E. NUVIA.** No fusionar — los 4 (`NUVIA_PAYMENT_SYSTEM.md`, `NUVIA_ROUTINES_HUB_SPEC.md`, `NUVIA_LOCAL_PREVIEW_RUNBOOK.md`, `ECOMMERCE_PURCHASE_REFERENCES.md`) ya son sin fecha y de temas distintos. Solo actualizar. **No renombrar** `NUVIA_PAYMENT_SYSTEM.md` aunque hoy describa un checkout que no cobra: 6 docs lo referencian por ruta; se corrige el contenido y se agrega "pago BNB dormido a la espera de credenciales".

---

## 3. Que mover a `hermes-content/docs/historial/`

**Mover (seguro, con los punteros atados):**
- `web-factory/docs/ONIA_LOGO_SPEC_20260726.md` — `ONIA_MARCA_SISTEMA_20260726.md:3` ya lo declara reemplazado ("candidatos A-G, todos descartados"); describe `brand-wordmark.tsx`/`.module.css` que no existen y afirma que `src/app/icon.svg` == `public/brand/favicon.svg` (son distintos: v2 `#00D26A/#12100E` vs v1 `#0C110F/#3EA639`). Conservar como historia la anatomia y los colores medidos del raster original de Sergio. Atar: `generate-brand-icons.mjs:4` y `ONIA_BRAND_IDENTITY_2026.md:5,99`.
- `web-factory/docs/ONIA_BRAND_2026.md` — ya dice "SUPERSEDED (2026-07-25)" en su linea 3. Sacarlo del listado vivo para que nadie lo abra.

**NO mover (fechados, pero el codigo o un handoff los usa como fuente):**
- `WEB_FACTORY_VPS_AUTOMATION_20260630.md` y `WEB_FACTORY_OPERATING_RUNBOOK_20260625.md` → van al renombre de la consolidacion B, no a historial (siguen siendo el unico runbook del tema).
- `ONIA_MARCA_ESTRATEGIA_20260727.md` → es el unico que describe la marca que el codigo emite; se absorbe (bloque A), no se archiva.
- `WEB_FACTORY_ROADMAP_20260703.md` → referenciado por ruta desde `onia-core/ONIA_PENDIENTES_HANDOFF_20260704.md:182`. Editar: borrar los tres conteos podridos de "Como validar todo" (27 unit / 20 E2E / 7 demos; reales: 194 unit, 96 instancias E2E listadas en 8 archivos, 10 demos). Borrar el numero, no reemplazarlo — se pudre solo.
- `WEB_FACTORY_DASHBOARD_INTELLIGENCE_20260703.md` → 2 de 3 pendientes cerrados (intake→dashboard mapeado en `data/intake-schema.ts:93/321/420/459`; charts ricos hechos), pero el tercero (cache de repos MIT/Apache para `references:code-index`) sigue abierto y los `ingredientes` de `nuvia.json` estan vacios. Editar y rescatar ese pendiente antes de archivar nada.

**Decision de directorio pendiente para Sergio:** `web-factory/docs/` tiene 21 archivos con fecha en el nombre. O se hace el barrido (2 pases: marca ahora, ops despues) o se exceptua explicitamente esa carpeta en CLAUDE.md. Hoy la regla "gana el que no tiene fecha" se aplica mal ahi y ya causo el conflicto #1.

---

## 4. Contradicciones vivas — quien gana y por que

| Tema | Los que pelean | Gana | Por que |
|---|---|---|---|
| Tipografia | BRAND_IDENTITY §2 (3 familias) vs MARCA_SISTEMA §3 (2) vs TIPOGRAFIA_SISTEMA (4) | **MARCA_SISTEMA: Archivo + Geist Mono** | `layout.tsx:3` carga exactamente 2 y `globals.css:83` documenta que `--font-display-cnd` "se retiro: no habia tal cosa". El sin-fecha es el MAS VIEJO (25-jul) contra codigo del 10 y 18-ago: aca la regla de fecha falla y manda el codigo. Excepcion: el trio sigue vigente en video. |
| Verde de marca | BRAND_IDENTITY §1.2/§3.3 (solo escala esmeralda) vs `--senal #00D26A` vivo vs ESTRATEGIA §2.4 | **Codigo + ratificacion de Sergio (27-jul)**, como excepcion nombrada | El verde esta publicado (CTA, favicon, avatar IG) y §2.4 dice "no re-litigar". Matiz: ESTRATEGIA §2.3 solo lo autoriza para tile y boton Aprobar, asi que la reconciliacion es a TRES bandas — documentar el uso real, no ceder al fechado sin mirarlo. |
| Dashboard | PATTERN_BANK §"libro mayor editorial" (KPI sin caja, jerarquia solo tipografica) vs sus propias lineas 524-583 vs `dashboard.ts` vs barrido 26 dashboards | **Barrido 2026-08-29 + codigo** | El bloque del 17-ago se apilo sobre el del 16-ago sin reconciliar y el propio doc (L580-583) le ordena al template la celda KPI de acento solida que el otro bloque prohibe. Fix: acotar "libro mayor" al panel de Onia, no al template de cliente. |
| Stack | README §Stack vs FACTORY.md §Stack | **FACTORY.md** | Decision fechada con Sergio 2026-08-29 y el generador la respalda: `generate.ts:83-89` escribe solo HTML+CSS; el `package.json` raiz no tiene next, react ni tailwind. |
| Exhibir obra | MOTION_PATTERN_BANK:468 vs CLAUDE.md + FORMULA_2026:184 | **CLAUDE.md** | Regla dura de Sergio (20-ago). FORMULA ya la aplica; MOTION quedo sin barrer aunque se edito el 23-ago. |
| Radar "listo" | RUNBOOK tabla "listo" vs 55 reportes `ok:false` | **La evidencia del VPS** | "Construido != terminado": encendido y roto no es listo. |
| Checkout Nuvia | NUVIA_PAYMENT_SYSTEM (modos `payment`/`quote`, cobra por BNB QR) vs `nuvia-order.ts:74` | **Codigo** | `NuviaCheckoutMode = "whatsapp" \| "configuration_pending" \| "invalid_request"`; `createBnbQrPayment` y `persistPayment` tienen **cero llamadores** ("Dormido: se reactiva cuando lleguen credenciales BNB"). El checkout no cobra: entrega por WhatsApp. |
| Checklist 17 puntos | FACTORY.md:107-110 ("todo sitio", verificar con `next build`) vs el default estatico del mismo doc | **Hay que partirlo** | Items 1,2,3,4,5,7 y el metodo de verificacion solo existen en el carril Next; un sitio de `out/` no puede pasarlos (`grep robots\|sitemap\|canonical` en `generate/` y `packages/` = 0). Y `.claude/skills/onia-web-factory/SKILL.md:157-185` tiene el mismo checklist con la misma forma: se corrigen juntos. |

---

## 5. Huecos — aprendizaje del 2026-08-29 que nunca entro a los docs vivos

1. **Barrido de 26 dashboards reales** (`data/references/design-sources/2026-08-29-dashboards-aprendidos.md:11-16`): "KPI = numero grande + chip de tendencia + sparkline DENTRO de la tarjeta… es el patron mas fuerte y el que mas nos faltaba mostrar" + "una celda KPI HERO (card oscura de acento solido)". **Ningun doc vivo lo incorpora** y `WEB_FACTORY_PATTERN_BANK_2026.md:482-493` sigue mandando lo contrario ("KPIs como celdas de pelo, sin caja"). Destino: §Dashboard consolidada (bloque D).
2. **Metodo de cosecha de galerias** (`2026-08-29-barrido-lista-curada.md:119-126`): el 403 de Cloudflare cae con `Fetcher.get(stealthy_headers=True, impersonate="chrome")` de Scrapling — httpx puro, **sin navegador**; el `StealthyFetcher` NO arranca en esta maquina (`spawn UNKNOWN`). `docs/DESIGN_LEARNED_2026.md:207` y su pendiente #1 (lineas 353-355) siguen mandando "Playwright con navegador real": un callejon verificado. Ademas ya hay cosecha hecha: `2026-08-29-lapa-health-fitness.json` (12 landings, 6 con tokens medidos, 83 slugs de categoria). Falta: ecommerce, food-drinks, business, beauty. Destino: editar el pendiente #1 (metodo + hecho/falta), no borrarlo.
3. **Como se eligio la paleta de series** (commit `8fa44440`): 720 permutaciones enumeradas y validadas con el validador de dataviz contra los surfaces reales del template (cream `#f6f2ea` / oscuro `#161c22`), en ambos modos, ganador con peor delta-E adyacente 13.2 sobre un gate de 8. **No esta escrito en ningun doc.** Sin eso, la proxima sesion "la elige a ojo" o la reordena segun `references/palette.md`. Destino: `DASHBOARD_PATTERN_BANK_2026.md` como `[PRESERVAR]` con el porque.
4. **Segunda forma del circuito de leads** (commit `470a2140`, 29-ago): `apps/dental-premium/src/app/api/lead/route.ts` es un proxy server que recibe **JSON**, valida nombre+whatsapp en el borde y reenvia leyendo `ONIA_LEAD_WEBHOOK` y `ONIA_N8N_API_KEY`. `docs/CONEXION_WEB_SISTEMA_API.md` se declara "fuente de verdad de ESTE carril" y no lo registra en ninguna de sus dos listas; ninguna de las dos env vars aparece en ningun doc ni `.env.example` del repo. Encima el paso 1 del diagrama dice "POST multipart" y el bloque emite `<form method="post">` sin `enctype` (`packages/blocks/src/inline-quote-form.ts:86`), o sea **x-www-form-urlencoded**. El carril n8n construye el webhook leyendo eso: hoy documentamos un content-type que no es, y ocultamos una segunda forma que si existe.
5. **Hueco estructural que causa los otros:** la inteligencia de diseno automatica esta congelada en `WEB_FACTORY_DESIGN_INTELLIGENCE_LATEST.md` "Generated: 2026-07-18" porque el radar falla (arreglo #2). Todo aprendizaje posterior al 18-jul entro a mano, a `data/references/design-sources/`, y por eso ninguno llego a los docs vivos. Hasta que el radar corra, **incorporar el barrido manual es parte del cierre de cada sesion de referencias**, no un extra.

---

**Orden de ejecucion sugerido:** 4 (una linea, tres reglas duras) → 5 (evita que alguien deshaga trabajo hoy) → 1 (marca, el mas grande) → 2 (codigo + docs, desbloquea el aprendizaje) → 3 (README/FACTORY, avisar por archivos raiz). Los huecos del punto 5 se cierran dentro de los arreglos 1, 4 y 5.