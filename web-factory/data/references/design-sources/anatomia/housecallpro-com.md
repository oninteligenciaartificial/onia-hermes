# Anatomia medida — https://www.housecallpro.com

> Generado por `harvester/vision/extract_web_anatomy.mjs` el 2026-08-20.
> Criterios y por que cada uno importa: `docs/ANATOMIA_DE_UNA_WEB.md`.
> Todo lo de aca son valores LEIDOS del sitio vivo. Lo que no se pudo medir esta al final.

## 1. Arquitectura de pagina

- **Largo**: 8.5 pantallas en escritorio · 14.2 en movil
- **Secciones**: 11
- **Desborde horizontal**: no · movil: no
- **Encabezados**: 82 (1 h1, 6 saltos de nivel)

| # | alto (pantallas) | titular | CTA | medios |
|---|---|---|---|---|
| 0 | 6.9 | Everything to run and grow your business | Start Free Trial | 127 |
| 1 | 6.9 | Everything to run and grow your business | Start Free Trial | 127 |
| 2 | 1.4 | - | Features | 5 |
| 3 | 1 | - | × | 0 |
| 4 | 0.4 | - | × | 0 |
| 5 | 1 | - | × | 3 |
| 6 | 0.9 | - | × | 3 |
| 7 | 1 | - | × | 3 |
| 8 | 0.9 | - | × | 3 |
| 9 | 0.3 | - | - | 1 |
| 10 | 0.3 | - | - | 0 |

## 2. Tokens medidos

**Escala tipografica** (tamano / interlineado / tracking / peso — juntos, que es como funciona):

| valor | veces |
|---|---|
| 16px / lh 1.50 / ls normal / w 400 | 188 |
| 14px / lh 1.71 / ls normal / w 700 | 68 |
| 14px / lh 1.43 / ls normal / w 400 | 54 |
| 11px / lh 1.64 / ls normal / w 400 | 45 |
| 18px / lh 1.20 / ls normal / w 700 | 39 |
| 18px / lh 1.56 / ls normal / w 400 | 15 |
| 12px / lh 1.33 / ls normal / w 400 | 15 |
| 16px / lh 1.00 / ls normal / w 400 | 14 |
| 18px / lh 1.50 / ls normal / w 400 | 13 |
| 14px / lh 1.71 / ls normal / w 400 | 10 |

**Familias**: Open Sans (562)

**Espaciado** (los que de verdad se repiten): 8px×614 · 16px×110 · 2px×66 · 24px×44 · 12px×30 · 30px×21 · 20px×20 · 32px×18 · 15px×15 · 10px×10

**Radios**: 18 valores distintos (contar valores finales NO mide el sistema: shadcn tiene 19 y todos salen de un `--radius` con calc()) · **Sombras**: 10 distintas

**Unidad del ritmo**: 50 `em` · 68 `rem` · 2730 `px` · 12 `clamp()` · 25 `vw`
→ ritmo mixto o en px/rem: cada token escala por su cuenta.

**Breakpoints reales** (de las media queries): 768px · 576px · 992px · 1200px · 767px · 1024px · 376px · 380px · 600px · 1440px

## 3. Movimiento

- **Transiciones distintas**: 24 · **@keyframes declarados**: 4
- **`transition: all`**: 51 veces ⚠️ anima todo, incluido layout
- **prefers-reduced-motion en el CSS**: si
- **Con la preferencia PUESTA**: 0 elementos siguen animando, 490 con transicion > 50ms
- **Movimiento atado al scroll**: no — anima al entrar, no al dedo del scroll

Transiciones mas usadas:
- `0.3s` (167)
- `0.2s ease-in-out` (96)
- `opacity 0.3s` (79)
- `0.1s ease-in` (70)
- `0.25s` (54)
- `0.2s` (22)

## 4. Scroll

- **Pegados** (sticky/fixed): 12
  - header.hcp-site-header — sticky, alto 104px, top 0px
  - div.dialog-wrapper — fixed, alto 900px, top 0px
  - a.close-dialog — fixed, alto 32px, top 0px
  - div.dialog-wrapper — fixed, alto 900px, top 0px
  - div.hcp-product-tour-widget hcp-widget collapsed position-bottom — fixed, alto 64px, top 820px
  - div.exit-intent-popup — fixed, alto 0px, top 0px
- **Nav fija al scrollear**: si

## 5. Conversion

- **CTAs distintos**: 159 · **Formularios**: 6 · **`<dialog>`**: 0
- **CTA mas repetido**: "Start free trial" ×4 · "Start Free Trial" ×4 · "858-330-6696" ×4 · "Privacy Policy" ×3
- Formulario → 1 campos (email*) · boton "Start Free Trial"
- Formulario → 1 campos (email*) · boton "Start Free Trial"
- Formulario → 1 campos (email*) · boton "Start Free Trial"
- Formulario → 1 campos (email*) · boton "Start Free Trial"
- Formulario → 9 campos (text*, text*, tel*, email*, text*, select-one*, select-one*, checkbox, select-one) · boton "Book a Demo"
- Formulario → 9 campos (text*, text*, tel*, email*, text*, select-one*, select-one*, checkbox, select-one) · boton "Book a Demo"

## 6. Rendimiento

- **Peso total**: 8521.1 KB en 489 pedidos
- **Por tipo**: document 548.4 KB · script 4990.4 KB · stylesheet 648.3 KB · image 1308.6 KB · other 628.7 KB · fetch 2.3 KB · xhr 1.3 KB · font 393.1 KB · ping 0 KB
- **Terceros**: 46 hosts · app.spara.co, analytics.tiktok.com, segment-tracking-proxy.housecallpro.com, www.google.com, www.gstatic.com
- **Fuentes cargadas**: 14 (Oswald 400 normal · Open Sans 400 normal · Open Sans 500 normal · Open Sans 600 normal · Open Sans 700 normal)

Contra el presupuesto de la casa (150 KB JS / 30 KB CSS en una landing): **JS 4990.4 KB · CSS 648.3 KB**.

## 7. Accesibilidad

- **Imagenes**: 70 · sin `alt`: 3 · sin dimensiones: 40 · lazy: 58 · con `srcset`: 9
- **Objetivos tactiles < 44px**: 121 de 274 interactivos
- **Idioma**: en-US · **Landmarks**: {"header":1,"nav":1,"main":1,"footer":1}
- **Contraste** (pares mas frecuentes, resueltos a sRGB y con el texto compuesto sobre su fondo):
  - rgb(255, 255, 255) sobre rgb(255, 255, 255) → **1:1** ⚠️ bajo el minimo AA para texto normal
  - rgb(255, 255, 255) sobre rgb(222, 240, 255) → **1.17:1** ⚠️ bajo el minimo AA para texto normal
  - rgb(255, 255, 255) sobre rgb(10, 36, 67) → **15.6:1**
  - rgb(0, 41, 66) sobre rgb(255, 255, 255) → **15.04:1**
  - rgb(0, 41, 66) sobre rgb(222, 240, 255) → **12.91:1**
  - rgb(0, 41, 66) sobre rgb(10, 36, 67) → **1.04:1** ⚠️ bajo el minimo AA para texto normal
  - _(4 fondos translucidos omitidos: no se puede juzgar un fondo sin saber que hay detras.)_

## 8. SEO / indexabilidad

- title: Home Services Business Management Software - Housecall Pro
- description: 154 caracteres
- canonical: https://www.housecallpro.com/ · OG: 8 · datos estructurados: 8

## 9. Tecnologia detectada

- no detectada

## 10. Lo que NO se pudo medir

- nada: las tres vistas cargaron

Y lo que ninguna medicion automatica alcanza:
- Intencion de diseno: por que eligieron ESTA direccion visual y no otra.
- Calidad del copy: si la promesa es creible y si los numeros estan respaldados.
- Contenido detras de login, muro de cookies o interaccion (paso 2 de un popup, estados de error).
- Si el movimiento AYUDA a entender o solo decora: eso se juzga mirando, no midiendo.
