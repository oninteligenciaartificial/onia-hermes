# Anatomia medida — https://www.fresha.com

> Generado por `harvester/vision/extract_web_anatomy.mjs` el 2026-08-20.
> Criterios y por que cada uno importa: `docs/ANATOMIA_DE_UNA_WEB.md`.
> Todo lo de aca son valores LEIDOS del sitio vivo. Lo que no se pudo medir esta al final.

## 1. Arquitectura de pagina

- **Largo**: 6.4 pantallas en escritorio · 6.8 en movil
- **Secciones**: 8
- **Desborde horizontal**: no · movil: no
- **Encabezados**: 171 (1 h1, 0 saltos de nivel)

| # | alto (pantallas) | titular | CTA | medios |
|---|---|---|---|---|
| 0 | 6.4 | Book local selfcare services | Fresha | 475 |
| 1 | 6.4 | Book local selfcare services | Fresha | 475 |
| 2 | 2.2 | Book local selfcare services | Search | 165 |
| 3 | 0.9 | Download the Fresha app | - | 5 |
| 4 | 0.6 | Reviews | Previous | 172 |
| 5 | 0.7 | The top-rated destination for selfcare | - | 0 |
| 6 | 0.8 | Fresha for business | Find out more | 9 |
| 7 | 0.6 | Browse by City | Previous | 112 |

## 2. Tokens medidos

**Escala tipografica** (tamano / interlineado / tracking / peso — juntos, que es como funciona):

| valor | veces |
|---|---|
| 14px / lh 1.43 / ls normal / w 400 | 469 |
| 16px / lh 1.38 / ls normal / w 600 | 128 |
| 22px / lh 1.00 / ls normal / w 600 | 127 |
| 13px / lh 1.23 / ls normal / w 600 | 80 |
| 16px / lh 1.15 / ls normal / w 400 | 79 |
| 16px / lh 1.38 / ls normal / w 500 | 56 |
| 19px / lh 1.26 / ls normal / w 600 | 28 |
| 16px / lh 1.38 / ls normal / w 400 | 28 |
| 28px / lh 1.29 / ls normal / w 600 | 6 |
| 24px / lh 1.33 / ls normal / w 500 | 5 |

**Familias**: RoobertPRO (1020)

**Espaciado** (los que de verdad se repiten): 2px×224 · 8px×146 · -1px×104 · 12px×81 · 32px×69 · 4px×36 · 16px×34 · 19px×33 · 0px 12px×28 · normal 0px×10

**Radios**: 8 valores distintos · **Sombras**: 5 distintas

**Unidad del ritmo**: 21 `em` · 11 `rem` · 2640 `px` · 0 `clamp()` · 18 `vw`
→ sistema anclado a `em`: cambia un font-size y reescala la pagina entera en proporcion.

**Breakpoints reales** (de las media queries): 768px · 1024px · 1440px · 512px · 1280px · 1920px · 767px · 2px · 22px

## 3. Movimiento

- **Transiciones distintas**: 11 · **@keyframes declarados**: 55
- **`transition: all`**: 12 veces ⚠️ anima todo, incluido layout
- **prefers-reduced-motion en el CSS**: si
- **Con la preferencia PUESTA**: 2 elementos siguen animando, 31 con transicion > 50ms
- **Movimiento atado al scroll**: SI (5 estados distintos en 5 posiciones)

Transiciones mas usadas:
- `transform 0.3s cubic-bezier(0.85, 0, 0.15, 1)` (48)
- `background-color 0.1s cubic-bezier(0, 0.55, 0.45, 1), border-color 0.1` (33)
- `opacity 0.1s cubic-bezier(0.85, 0, 0.15, 1)` (27)
- `max-inline-size 0.2s cubic-bezier(0.85, 0, 0.15, 1)` (6)
- `transform 0.05s linear` (4)
- `transform 0.15s` (2)

## 4. Scroll

- **Pegados** (sticky/fixed): 1
  - div.Navigation-module-scss-module__zsnzra__self Navigation-modul — sticky, alto 72px, top 0px
- **Nav fija al scrollear**: no

## 5. Conversion

- **CTAs distintos**: 1037 · **Formularios**: 1 · **`<dialog>`**: 1
- **CTA mas repetido**: "Previous" ×32 · "Next" ×32 · "Fresha" ×2 · "Get the app" ×2
- Formulario → 3 campos (text, text, text) · boton "Search"

## 6. Rendimiento

- **Peso total**: 8657.7 KB en 335 pedidos
- **Por tipo**: document 1144.7 KB · font 292.9 KB · stylesheet 793 KB · script 4635.4 KB · media 460.8 KB · image 895.1 KB · fetch 123.4 KB · ping 0 KB · other 312.4 KB
- **Terceros**: 15 hosts · images.fresha.com, www.google.com, analytics.tiktok.com, www.gstatic.com, www.googletagmanager.com
- **Fuentes cargadas**: 10 (AktivGroteskVF 100 900 normal · Changa 200 800 normal · PlayfairDisplay 400 900 normal · RoobertPRO 700 normal · RoobertPRO 500 normal)

Contra el presupuesto de la casa (150 KB JS / 30 KB CSS en una landing): **JS 4635.4 KB · CSS 793 KB**.

## 7. Accesibilidad

- **Imagenes**: 81 · sin `alt`: 0 · sin dimensiones: 81 · lazy: 81 · con `srcset`: 48
- **Objetivos tactiles < 44px**: 93 de 509 interactivos
- **Idioma**: en-US · **Landmarks**: {"header":0,"nav":1,"main":1,"footer":2}
- **Contraste** (pares mas frecuentes, resueltos a sRGB y con el texto compuesto sobre su fondo):
  - rgb(13, 13, 13) sobre rgb(242, 242, 242) → **17.36:1**
  - rgb(13, 13, 13) sobre rgb(255, 255, 255) → **19.44:1**
  - rgb(13, 13, 13) sobre rgb(13, 13, 13) → **1:1** ⚠️ bajo el minimo AA para texto normal
  - rgb(118, 118, 118) sobre rgb(242, 242, 242) → **4.06:1** ⚠️ bajo el minimo AA para texto normal
  - rgb(118, 118, 118) sobre rgb(255, 255, 255) → **4.54:1**
  - rgb(118, 118, 118) sobre rgb(13, 13, 13) → **4.28:1** ⚠️ bajo el minimo AA para texto normal
  - _(4 fondos translucidos omitidos: no se puede juzgar un fondo sin saber que hay detras.)_

## 8. SEO / indexabilidad

- title: Fresha - Instantly book salons and spas nearby
- description: 87 caracteres
- canonical: https://www.fresha.com/ · OG: 4 · datos estructurados: 1

## 9. Tecnologia detectada

- next

## 10. Lo que NO se pudo medir

- nada: las tres vistas cargaron

Y lo que ninguna medicion automatica alcanza:
- Intencion de diseno: por que eligieron ESTA direccion visual y no otra.
- Calidad del copy: si la promesa es creible y si los numeros estan respaldados.
- Contenido detras de login, muro de cookies o interaccion (paso 2 de un popup, estados de error).
- Si el movimiento AYUDA a entender o solo decora: eso se juzga mirando, no midiendo.
