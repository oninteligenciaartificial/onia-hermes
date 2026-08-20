# Anatomia medida — https://www.fanvue.com

> Generado por `harvester/vision/extract_web_anatomy.mjs` el 2026-08-19.
> Criterios y por que cada uno importa: `docs/ANATOMIA_DE_UNA_WEB.md`.
> Todo lo de aca son valores LEIDOS del sitio vivo. Lo que no se pudo medir esta al final.

## 1. Arquitectura de pagina

- **Largo**: 13.4 pantallas en escritorio · 10.2 en movil
- **Secciones**: 10
- **Desborde horizontal**: no · movil: no
- **Encabezados**: 16 (1 h1, 0 saltos de nivel)

| # | alto (pantallas) | titular | CTA | medios |
|---|---|---|---|---|
| 0 | 13.4 | Earn from your fanbase faster with the No1 AI monetisation platform for creators. | - | 154 |
| 1 | 1 | Earn from your fanbase faster with the No1 AI monetisation platform for creators. | Become a creator | 2 |
| 2 | 0.3 | - | - | 20 |
| 3 | 2.2 | Powering over $500m in creator payouts | Become a creator | 11 |
| 4 | 1.2 | Chosen by the creators redefining what’s possible. | - | 50 |
| 5 | 1.2 | The Creator-AI Economy has arrived, and Fanvue hands you the tools to lead it. | Join the movement | 3 |
| 6 | 6 | Built for every niche. Trusted by icons. | Join the movement | 37 |
| 7 | 1.7 | FAQ | Become a creator | 17 |
| 8 | 1 | - | - | 0 |
| 9 | 1 | - | - | 0 |

## 2. Tokens medidos

**Escala tipografica** (tamano / interlineado / tracking / peso — juntos, que es como funciona):

| valor | veces |
|---|---|
| 15px / lh 1.20 / ls normal / w 500 | 64 |
| 28px / lh 1.00 / ls normal / w 500 | 32 |
| 14px / lh 1.00 / ls normal / w 500 | 25 |
| 15px / lh 0.96 / ls -0.14976px / w 400 | 24 |
| 11px / lh 2.67 / ls normal / w 500 | 20 |
| 15px / lh 1.00 / ls -0.1px / w 500 | 13 |
| 32px / lh 1.00 / ls -0.648px / w 500 | 12 |
| 21px / lh 1.10 / ls -0.1px / w 500 | 8 |
| 15px / lh 0.90 / ls normal / w 500 | 8 |
| 12px / lh 1.50 / ls -0.1px / w 500 | 7 |

**Familias**: Medium AG Next (216) · Akzidenz Grotesk Pro Med (58) · Akzidenz Grotesk Pro (6) · Akzidenz Grotesk Next (4)

**Espaciado** (los que de verdad se repiten): 8.64px×33 · 7.488px×32 · 2.88px×32 · 4.86px×24 · auto×17 · 52.56px×12 · 5.76px×12 · 3px×12 · 39.6px×12 · 21.6px×12

**Radios**: 14 valores distintos ⚠️ tantos radios distintos = no hay sistema · **Sombras**: 0 distintas

**Unidad del ritmo**: 1428 `em` · 1001 `rem` · 2492 `px` · 7 `clamp()` · 109 `vw`
→ sistema anclado a `em`: cambia un font-size y reescala la pagina entera en proporcion.

**Breakpoints reales** (de las media queries): 479px · 767px · 991px · 1920px · 768px · 1440px

## 3. Movimiento

- **Transiciones distintas**: 7 · **@keyframes declarados**: 3
- **`transition: all`**: 22 veces ⚠️ anima todo, incluido layout
- **prefers-reduced-motion en el CSS**: NO
- **Con la preferencia PUESTA**: 2 elementos siguen animando, 68 con transicion > 50ms
- **Movimiento atado al scroll**: SI (5 estados distintos en 5 posiciones)

Transiciones mas usadas:
- `opacity 0.3s, transform 0.3s` (32)
- `transform 0.2s linear` (12)
- `0.2s` (9)
- `opacity 0.4s` (6)
- `opacity 0.2s` (6)
- `transform 0.2s` (2)

## 4. Scroll

- **Pegados** (sticky/fixed): 10
  - div.nav-w — fixed, alto 63px, top 0px
  - div.en-sticky hdn-old — sticky, alto 0px, top 135px
  - div.en-sticky — sticky, alto 630px, top 135px
  - div.faq — sticky, alto 612px, top 0px
  - div.go2933276541 go2369186930 — fixed, alto 900px, top 0px
  - div.go2933276541 go1348078617 — fixed, alto 0px, top 900px
- **Nav fija al scrollear**: no

## 5. Conversion

- **CTAs distintos**: 21 · **Formularios**: 0 · **`<dialog>`**: 0
- **CTA mas repetido**: "Become a creator" ×4 · "Fanvue AI" ×3 · "Support" ×3 · "Blog" ×3


## 6. Rendimiento

- **Peso total**: 29232.9 KB en 272 pedidos
- **Por tipo**: document 120.6 KB · script 4992.6 KB · stylesheet 526.7 KB · font 150.1 KB · image 3717.9 KB · media 19711.5 KB · fetch 13.3 KB · xhr 0.1 KB · ping 0 KB
- **Terceros**: 39 hosts · cdn.prod.website-files.com, cdn.jsdelivr.net, analytics.tiktok.com, www.googletagmanager.com, fonts.gstatic.com
- **Fuentes cargadas**: 20 (webflow-icons normal normal · Space Grotesk 700 normal · Space Grotesk 600 normal · Space Grotesk 400 normal · Space Grotesk 500 normal)

Contra el presupuesto de la casa (150 KB JS / 30 KB CSS en una landing): **JS 4992.6 KB · CSS 526.7 KB**.

## 7. Accesibilidad

- **Imagenes**: 132 · sin `alt`: 1 · sin dimensiones: 131 · lazy: 130 · con `srcset`: 46
- **Objetivos tactiles < 44px**: 23 de 67 interactivos
- **Idioma**: en · **Landmarks**: {"header":0,"nav":4,"main":0,"footer":0}
- **Contraste** (pares mas frecuentes, resueltos a sRGB y con el texto compuesto sobre su fondo):
  - rgb(255, 255, 255) sobre rgb(0, 0, 0) → **21:1**
  - rgb(255, 255, 255) sobre rgb(73, 242, 100) → **1.48:1** ⚠️ bajo el minimo AA para texto normal
  - rgb(255, 255, 255) sobre rgb(204, 204, 204) → **1.61:1** ⚠️ bajo el minimo AA para texto normal
  - rgba(255, 255, 255, 0.5) sobre rgb(0, 0, 0) → **5.32:1**
  - rgba(255, 255, 255, 0.5) sobre rgb(73, 242, 100) → **1.18:1** ⚠️ bajo el minimo AA para texto normal
  - rgba(255, 255, 255, 0.5) sobre rgb(204, 204, 204) → **1.29:1** ⚠️ bajo el minimo AA para texto normal
  - _(5 fondos translucidos omitidos: no se puede juzgar un fondo sin saber que hay detras.)_

## 8. SEO / indexabilidad

- title: Fanvue
- description: 92 caracteres
- canonical: https://www.fanvue.com/ · OG: 4 · datos estructurados: 0

## 9. Tecnologia detectada

- webflow
- gsap
- swiper

## 10. Lo que NO se pudo medir

- nada: las tres vistas cargaron

Y lo que ninguna medicion automatica alcanza:
- Intencion de diseno: por que eligieron ESTA direccion visual y no otra.
- Calidad del copy: si la promesa es creible y si los numeros estan respaldados.
- Contenido detras de login, muro de cookies o interaccion (paso 2 de un popup, estados de error).
- Si el movimiento AYUDA a entender o solo decora: eso se juzga mirando, no midiendo.
