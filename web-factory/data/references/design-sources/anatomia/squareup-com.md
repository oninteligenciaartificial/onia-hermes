# Anatomia medida — https://squareup.com

> Generado por `harvester/vision/extract_web_anatomy.mjs` el 2026-08-20.
> Criterios y por que cada uno importa: `docs/ANATOMIA_DE_UNA_WEB.md`.
> Todo lo de aca son valores LEIDOS del sitio vivo. Lo que no se pudo medir esta al final.

## 1. Arquitectura de pagina

- **Largo**: 10.5 pantallas en escritorio · 14.1 en movil
- **Secciones**: 3
- **Desborde horizontal**: no · movil: no
- **Encabezados**: 27 (1 h1, 1 saltos de nivel)

| # | alto (pantallas) | titular | CTA | medios |
|---|---|---|---|---|
| 0 | 9.2 | Local legend or global icon. Make it big on your block. | Get started | 133 |
| 1 | 9.2 | Local legend or global icon. Make it big on your block. | Get started | 133 |
| 2 | 1.3 | - | Products | 4 |

## 2. Tokens medidos

**Escala tipografica** (tamano / interlineado / tracking / peso — juntos, que es como funciona):

| valor | veces |
|---|---|
| 18px / lh 1.50 / ls normal / w 500 | 238 |
| 16px / lh 1.50 / ls normal / w 500 | 79 |
| 14px / lh 1.50 / ls normal / w 500 | 58 |
| 14px / lh 1.50 / ls 0.14px / w 400 | 46 |
| 40px / lh 1.13 / ls -0.8px / w 400 | 44 |
| 14px / lh 1.50 / ls 0.14px / w 500 | 41 |
| 16px / lh 1.50 / ls normal / w 400 | 38 |
| 28px / lh 1.30 / ls normal / w 500 | 25 |
| 12px / lh 1.00 / ls normal / w 500 | 20 |
| 14px / lh 1.50 / ls 1.4px / w 500 | 15 |

**Familias**: Cash Sans (401) · Square Sans Text VF (194) · Exact Block (62) · Cash Sans Mono (15) · Square Sans Display VF (6)

**Espaciado** (los que de verdad se repiten): 2px×428 · 10px×393 · 20px×243 · 3px×229 · 12px×47 · 40px×36 · 15px×34 · 5px×26 · 60px×23 · 32px×16

**Radios**: 11 valores distintos (contar valores finales NO mide el sistema: shadcn tiene 19 y todos salen de un `--radius` con calc()) · **Sombras**: 4 distintas

**Unidad del ritmo**: 8 `em` · 4 `rem` · 408 `px` · 0 `clamp()` · 0 `vw`
→ sistema anclado a `em`: cambia un font-size y reescala la pagina entera en proporcion.

**Breakpoints reales** (de las media queries): 640px · 740px · 1024px

## 3. Movimiento

- **Transiciones distintas**: 49 · **@keyframes declarados**: 2
- **`transition: all`**: 6 veces ⚠️ anima todo, incluido layout
- **prefers-reduced-motion en el CSS**: NO
- **Con la preferencia PUESTA**: 171 elementos siguen animando, 58 con transicion > 50ms
- **Movimiento atado al scroll**: no — anima al entrar, no al dedo del scroll

Transiciones mas usadas:
- `background-color 0.15s cubic-bezier(0, 0, 0.2, 1)` (34)
- `transform 0.15s cubic-bezier(0, 0, 0.2, 1)` (25)
- `opacity 0.25s` (21)
- `background-size 0.3s cubic-bezier(0, 0, 0.2, 1)` (17)
- `opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)` (14)
- `opacity 0.6s cubic-bezier(0, 0, 0.2, 1)` (10)

## 4. Scroll

- **Pegados** (sticky/fixed): 12
  - div.Scrim svelte-1ryqd2h — fixed, alto 900px, top 0px
  - div.mobile-global-nav-cta-button-container svelte-rrwz9 — fixed, alto 0px, top auto
  - div.cta-subnav-container svelte-1lguc4e hiddenUntilScrolled useT — fixed, alto 72px, top 0px
  - div.cta-button-container svelte-1ll27mu disableLeftCtaIcon subna — fixed, alto 0px, top auto
  - div.hero-wrapper svelte-14vhzde — sticky, alto 956px, top 0px
  - div.HomePageV3AudienceMoment__wrapper svelte-m4qava — sticky, alto 540px, top 20px
- **Nav fija al scrollear**: no

## 5. Conversion

- **CTAs distintos**: 199 · **Formularios**: 3 · **`<dialog>`**: 0
- **CTA mas repetido**: "Learn more" ×15 · "Overview" ×8 · "Switch to Square" ×8 · "Take payments" ×8
- Formulario → 1 campos (text) · boton ""
- Formulario → 1 campos (text*) · boton "Submit"
- Formulario → 5 campos (text*, text*, tel*, text*, checkbox*) · boton ""

## 6. Rendimiento

- **Peso total**: 42675 KB en 1208 pedidos
- **Por tipo**: document 3874.9 KB · font 616.7 KB · script 9515.8 KB · image 10757.7 KB · stylesheet 66.3 KB · media 12898.6 KB · fetch 4943.4 KB · xhr 1.7 KB · ping 0 KB
- **Terceros**: 44 hosts · pw-renderer-production-c.squarecdn.com, images.ctfassets.net, browser-intake-datadoghq.com, www.google.com, www.googletagmanager.com
- **Fuentes cargadas**: 20 (Square Sans Text 400 normal · Square Sans Text 400 italic · Square Sans Text 500 normal · Square Sans Text 500 italic · Square Sans Text 600 normal)

Contra el presupuesto de la casa (150 KB JS / 30 KB CSS en una landing): **JS 9515.8 KB · CSS 66.3 KB**.

## 7. Accesibilidad

- **Imagenes**: 125 · sin `alt`: 0 · sin dimensiones: 70 · lazy: 67 · con `srcset`: 0
- **Objetivos tactiles < 44px**: 102 de 473 interactivos
- **Idioma**: en-US · **Landmarks**: {"header":5,"nav":6,"main":1,"footer":1}
- **Contraste** (pares mas frecuentes, resueltos a sRGB y con el texto compuesto sobre su fondo):
  - rgb(0, 0, 0) sobre rgb(255, 255, 255) → **21:1**
  - rgb(0, 0, 0) sobre rgb(0, 0, 0) → **1:1** ⚠️ bajo el minimo AA para texto normal
  - rgb(0, 0, 0) sobre rgb(247, 246, 245) → **19.46:1**
  - rgb(255, 255, 255) sobre rgb(255, 255, 255) → **1:1** ⚠️ bajo el minimo AA para texto normal
  - rgb(255, 255, 255) sobre rgb(0, 0, 0) → **21:1**
  - rgb(255, 255, 255) sobre rgb(247, 246, 245) → **1.08:1** ⚠️ bajo el minimo AA para texto normal
  - _(3 fondos translucidos omitidos: no se puede juzgar un fondo sin saber que hay detras.)_

## 8. SEO / indexabilidad

- title: Power your entire business | Square
- description: 126 caracteres
- canonical: https://squareup.com/us/en · OG: 7 · datos estructurados: 0

## 9. Tecnologia detectada

- no detectada

## 10. Lo que NO se pudo medir

- nada: las tres vistas cargaron

Y lo que ninguna medicion automatica alcanza:
- Intencion de diseno: por que eligieron ESTA direccion visual y no otra.
- Calidad del copy: si la promesa es creible y si los numeros estan respaldados.
- Contenido detras de login, muro de cookies o interaccion (paso 2 de un popup, estados de error).
- Si el movimiento AYUDA a entender o solo decora: eso se juzga mirando, no midiendo.
