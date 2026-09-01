# Cosecha de los rubros FLACOS: wellness y estética/skincare (2026-08-31)

Cierra **B2** de `docs/LOOP_COLA.md`. El playbook recetaba §2 (Estética/Wellness)
con **N=1 real por sub-eje**: wellness colgaba de frequencybreathwork (+ joindawn,
que además se reusaba como análogo dental) y el sub-eje estética/skincare de un
único sitio, ONSKN, con la línea escrita al lado: *"N=1 real todavía — cosechar
2-3 skincare más para hacerlo ley"* (`2026-08-29-vertical-playbooks.md:67`).
Evidencia re-verificada antes de tocar: la línea seguía viva y §2 seguía sin
segunda ancla.

**Método** — el mismo de B1, sin inventar uno nuevo: Scrapling
`Fetcher.get(impersonate="chrome")` sobre el HTML servido + **seguir el
`<link rel=stylesheet>`** (hasta 12 hojas) para leer las variables de marca. Se
cita el **token declarado**, no el hex más frecuente. Saturación en **HSV** y
declarado, como corrigió B1. Además se leyó qué familia gobierna `h1..h6`, en vez
de suponerlo del ranking de `font-family`.

## Lo cosechado (5 sitios vivos)

| Sub-eje | Sitio | HTTP | bytes | h1 / title real |
|---|---|---|---|---|
| Wellness | othership.us | 200 | 421.319 | "Otherworldly sauna and ice bath experiences for human beings to feel good now" |
| Wellness | remedyplace.com | 200 | 428.693 | "Self-Care Made Social" |
| Estética (clínica) | alchemy43.com | 200 | 325.909 | "Medical Aesthetics + Wellness" |
| Estética (clínica) | skinlaundry.com | 200 | 472.540 | "Laser Skin Resurfacing & Facial Rejuvenation — SKIN LAUNDRY" |
| Skincare (producto DTC) | us.typology.com | 200 | 244.796 | "Our formulations are concise, concentrated, made in France" |

### Descartados — y por qué un 200 sigue sin ser un ancla

- **peachystudios.com**: 200 con **136 bytes**. Ni CSS ni h1: no se computa nada.
- **ever-body.com**: 200 con 31.834 bytes y h1 **"We're getting things ready"** —
  página de espera. Nuevo modo de falla para la regla de B1: **un 200 CON h1
  tampoco alcanza si el h1 es el holding**. Sus hexes (`#ff6b6b`, `#4a9eff`) son
  del template de mantenimiento, no de la marca.
- **heydayskincare.com**: sirve de verdad (681.054 bytes) pero su señal cromática
  dominante (`#0f2a59` x38, `#025C85`) sale de tokens de sección de Shopify
  (`--pagination-color`, `--title-color`, `--border-color`), no de marca
  declarada. Se deja fuera antes que computar ruido.

## 🔴 Corrección 1 — wellness NO es un régimen, son dos

§2 recetaba *"acento tierra desaturado — o **sin pop** (sat 5-15%)"*. Con los dos
anclajes nuevos, esa regla describe **la mitad del rubro**:

- **remedyplace.com CUMPLE**: greige cálido `#b9b2aa` (HSV S **8,1%**), `#403b36`
  (15,6%), `#8a8580` (7,2%), tinta `#1a1817`. Calma neutra, cero pop. Es el
  régimen que el playbook ya tenía.
- **othership.us LO REPRUEBA, y no por poco**: tokens de marca declarados
  `--os-plum: #372338` (H 297°, el hex no-neutro más usado del sitio, **116
  usos**), `--os-lime: #dbf572` (HSV S **53,5%**, V 96,1, 45 usos) y
  `--os-cream: #ece8e3`. Más `--base-color-brand--pink #cb72c4`, `--teal #a7cfc9`,
  `--dark-orange #a24e2b`. Es crema, sí — pero **dominada por una tinta ciruela y
  con un pop lima a más del triple del techo escrito**.

**El mismo modo de falla que B1 encontró en el `<15%` dental**: se escribió el
piso de la muestra como si fuera ley. La regla honesta es que wellness elige
**régimen antes que paleta**, igual que ya hace inmobiliaria (§5):

- **(a) Crema monástica / sin pop** — frequencybreathwork, joindawn,
  remedyplace. Sat HSV <16%. Vende quietud.
- **(b) Crema + tinta profunda + UN pop saturado** — othership. Vende ritual con
  energía (sauna/hielo, social), no silencio.

**Motion**: othership trae **gsap + ScrollTrigger** en el servido → sostiene el
"PREMIUM" que §2 ya recetaba. remedyplace es Next sin librería de motion
detectada: el régimen (a) puede ser sereno **sin** stack pesado.

## 🔴 Corrección 2 — el sub-eje estética apuntaba al negocio equivocado

La nota de §2 decía **"estética/skincare = nude cálido + blush + charcoal"** desde
ONSKN (N=1). Onia vende **clínica** en ese rubro (esteticagest). Las dos clínicas
reales cosechadas **no son nude ni blush**:

- **alchemy43.com** (cadena de medicina estética, "Medical Aesthetics + Wellness"):
  `--highlight-color: #e5ad5a` — oro cálido, HSV S **60,7%**, **182 usos**, el hex
  no-neutro más frecuente del sitio — sobre `--accent-color: #27494e` (teal
  profundo, S 50%) y `--body-color: #12181f`. Crema `#f0e7de` solo como respiro.
- **skinlaundry.com** (láser/rejuvenecimiento): tinta cálida casi-negra `#1a1312`
  (S 30,8%, V 10,2) con pop **lima `#cdf765`** (S 59,1%) y `#3c201d`.

El nude **sí se sostiene — pero en producto DTC**, que es de donde salió ONSKN:

- **us.typology.com**: `#f6e7d8` (S 12,2%), `#f1d7c3` (19,1%), `#e8c4a8` (27,6%) —
  la misma familia nude/arena que ONSKN (`#F2CDA0`, `#E8BD8B`). Confirmado, N=2.

**La regla se parte en dos y cada mitad tiene su ancla:**

| Sub-eje | Régimen | Anclas |
|---|---|---|
| Skincare **producto/DTC** | nude cálido desaturado (S 12-34%) + blush + charcoal | ONSKN, typology |
| Estética **clínica** (lo que vende Onia) | tinta oscura/casi-negra + **UN** acento saturado (S ~55-61%): oro o lima | alchemy43, skinlaundry |

Recetarle nude a una clínica era importar la paleta del sub-eje que Onia **no**
vende. Los dos pops medidos (60,7% y 59,1%) coinciden en magnitud — no en hue —,
así que lo que se porta es **"un acento saturado sobre tinta oscura"**, no el hex.

## Tipografía — medida en `h1..h6`, no en el ranking de familias

- **alchemy43**: `h1,h2,h3,h4,h5,h6 → freight-neo-pro` (fallback declarado
  `serif`) + cuerpo **work-sans**. Es **display serif + grotesca de cuerpo**: el
  par que Onia recomienda, en una clínica estética real que factura.
- **skinlaundry**: `h1..h6 → "Apris"` + cuerpo **Manrope** (y `articulat-cf`).
- **othership**: `h1/h2 → Lido Condensed` + cuerpo **Founders Grotesk** (con
  `DM Serif Display` en la sección de membresía). Display condensado, no crema fina.
- **remedyplace**: **Beausite Slick** en headings y **Beausite Classic** en el
  heading chico — **una sola familia para todo**. Es el **segundo caso real** del
  mono-sans que `MOTION_PATTERN_BANK:462` prohíbe (el primero fue smilebar con
  Satoshi, B1). Dos de dos veces que aparece, es en un sitio vivo y vendiendo: la
  prohibición sigue siendo **decisión de diferenciación de Onia**, no observación
  del mercado. Escribirla como observación es lo que hay que dejar de hacer.
- **typology**: **Post Grotesk** + **Lettera**; no declara reglas por `h1` (todo
  utilitario Tailwind), así que no se le atribuye jerarquía tipográfica.

## 🧪 Ruido de scraper nuevo (extiende el hallazgo `#4285F4` de B1)

En **remedyplace** y **typology**, los hexes **más frecuentes** del CSS no son de
marca — son defaults del framework:

- **Tailwind**: `--tw-ring-color: #2563eb` (blue-600) y la escala `--tw-prose-*`
  (`#111827`, `#374151`, `#4b5563`, `#6b7280`, `#9ca3af`). Leído por frecuencia,
  **remedyplace parecería una marca azul**; su marca real es greige cálido.
- **Shopify Polaris** en glowbar: `--color-critical: #d72c0d`,
  `--color-success: #008060`, `#007bff`. Y `--color-reviews: #ff502d` (x11) es el
  widget de reseñas, no el acento.

**Regla operativa: descartar por NOMBRE del token, no por frecuencia.** Prefijos
que nunca son marca: `--tw-*`, `--color-critical|success|warning`, `--*-reviews`,
`--ss-*`, `--payment-*`, `--termly-*`. Es el mismo error que el badge de Google
Reviews en B1, pero peor: acá el ruido **gana** el ranking.

## Estado de anclas después de esta cosecha

- **Wellness**: N=1 útil → **N=3** (frequencybreathwork, remedyplace, othership),
  con los dos regímenes separados y cada uno anclado.
- **Estética/skincare**: N=1 → **N=4**, partido en dos sub-ejes de N=2 cada uno.
- Sigue sin ancla y queda para B: **portfolio (N=1 legible)**.
