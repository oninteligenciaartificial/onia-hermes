# Anatomia medida — https://sales.vagaro.com

> Generado por `harvester/vision/extract_web_anatomy.mjs` el 2026-08-20.
> Criterios y por que cada uno importa: `docs/ANATOMIA_DE_UNA_WEB.md`.
> Todo lo de aca son valores LEIDOS del sitio vivo. Lo que no se pudo medir esta al final.

## 1. Arquitectura de pagina

- **Largo**: 11.3 pantallas en escritorio · 12.6 en movil
- **Secciones**: 7
- **Desborde horizontal**: no · movil: no
- **Encabezados**: 19 (1 h1, 1 saltos de nivel)

| # | alto (pantallas) | titular | CTA | medios |
|---|---|---|---|---|
| 0 | 1 | - | Close Cookie Preferences | 1 |
| 1 | 9.5 | The #1 software & appfor beauty, wellness, and fitness | Start Free Trial | 30 |
| 2 | 9.5 | The #1 software & appfor beauty, wellness, and fitness | Start Free Trial | 30 |
| 3 | 1.6 | - | - | 15 |
| 4 | 1.2 | - | - | 14 |
| 5 | 1 | - | - | 0 |
| 6 | 1 | - | - | 0 |

## 2. Tokens medidos

**Escala tipografica** (tamano / interlineado / tracking / peso — juntos, que es como funciona):

| valor | veces |
|---|---|
| 16px / lh 1.50 / ls normal / w 400 | 85 |
| 18px / lh 1.56 / ls normal / w 400 | 35 |
| 14px / lh 1.43 / ls normal / w 400 | 33 |
| 14px / lh 1.43 / ls normal / w 600 | 19 |
| 16px / lh 1.50 / ls normal / w 600 | 12 |
| 15px / lh 1.00 / ls normal / w 600 | 9 |
| 20px / lh 1.40 / ls normal / w 600 | 9 |
| 14px / lh 1.71 / ls normal / w 600 | 6 |
| 16px / lh 1.00 / ls normal / w 400 | 4 |
| 60px / lh 1.00 / ls normal / w 700 | 4 |

**Familias**: figtree (235) · Helvetica (8) · instrumentSerif (6)

**Espaciado** (los que de verdad se repiten): 8px×59 · 16px×43 · 24px×41 · 32px×15 · 14px×14 · 12px×13 · 20px×13 · 4px×11 · -1px×9 · 6px×6

**Radios**: 8 valores distintos · **Sombras**: 5 distintas

**Unidad del ritmo**: 183 `em` · 290 `rem` · 1856 `px` · 0 `clamp()` · 24 `vw`
→ ritmo mixto o en px/rem: cada token escala por su cuenta.

**Breakpoints reales** (de las media queries): 768px · 1024px · 640px · 1536px · 1280px · 480px · 2499px · 2048px · 481px · 600px

## 3. Movimiento

- **Transiciones distintas**: 21 · **@keyframes declarados**: 32
- **`transition: all`**: 10 veces ⚠️ anima todo, incluido layout
- **prefers-reduced-motion en el CSS**: si
- **Con la preferencia PUESTA**: 12 elementos siguen animando, 88 con transicion > 50ms
- **Movimiento atado al scroll**: SI (5 estados distintos en 5 posiciones)

Transiciones mas usadas:
- `0.3s cubic-bezier(0.4, 0, 0.2, 1)` (41)
- `transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), translate 0.3s cubic-bezi` (9)
- `color 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s cubic-b` (4)
- `opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1)` (4)
- `color 0.15s cubic-bezier(0.4, 0, 0.2, 1) 0.15s, background-color 0.15s` (3)
- `0.3s cubic-bezier(0.2, 0.9, 0.3, 1.5)` (3)

## 4. Scroll

- **Pegados** (sticky/fixed): 12
  - div.osano-cm-window__dialog osano-cm-dialog osano-cm-dialog--pos — fixed, alto 92px, top 808px
  - button.osano-cm-window__widget osano-cm-widget osano-cm-widget--pos — fixed, alto 0px, top auto
  - div.osano-cm-window__info-dialog osano-cm-info-dialog osano-cm-i — fixed, alto 900px, top 0px
  - div.osano-cm-info-dialog__info osano-cm-info osano-cm-info--posi — fixed, alto 900px, top 0px
  - div.osano-cm-info__info-dialog-header osano-cm-info-dialog-heade — sticky, alto 52px, top 0px
  - p.osano-cm-info-dialog-header__header osano-cm-header — sticky, alto 48px, top 0px
- **Nav fija al scrollear**: si

## 5. Conversion

- **CTAs distintos**: 116 · **Formularios**: 0 · **`<dialog>`**: 0
- **CTA mas repetido**: "Start Free Trial" ×4 · "Beauty" ×4 · "Salon" ×4 · "Barber" ×4


## 6. Rendimiento

- **Peso total**: 10944 KB en 543 pedidos
- **Por tipo**: document 362.5 KB · stylesheet 65.2 KB · font 108.2 KB · image 4783.4 KB · script 3508.1 KB · fetch 1 KB · xhr 2113.4 KB · texttrack 2.2 KB · ping 0 KB
- **Terceros**: 48 hosts · www.vagaro.com, us-west-2.graphassets.com, www.google.com, analytics.tiktok.com, px.ads.linkedin.com
- **Fuentes cargadas**: 6 (figtree 300 900 normal · figtree 300 900 italic · figtree Fallback normal normal · instrumentSerif 400 normal · instrumentSerif 400 italic)

Contra el presupuesto de la casa (150 KB JS / 30 KB CSS en una landing): **JS 3508.1 KB · CSS 65.2 KB**.

## 7. Accesibilidad

- **Imagenes**: 25 · sin `alt`: 0 · sin dimensiones: 22 · lazy: 8 · con `srcset`: 9
- **Objetivos tactiles < 44px**: 108 de 162 interactivos
- **Idioma**: en · **Landmarks**: {"header":1,"nav":3,"main":0,"footer":1}
- **Contraste** (pares mas frecuentes, resueltos a sRGB y con el texto compuesto sobre su fondo):
  - rgb(255, 255, 255) sobre rgb(204, 71, 68) → **4.61:1**
  - rgb(255, 255, 255) sobre rgb(255, 255, 255) → **1:1** ⚠️ bajo el minimo AA para texto normal
  - rgb(255, 255, 255) sobre rgb(51, 51, 51) → **12.63:1**
  - rgb(51, 51, 51) sobre rgb(204, 71, 68) → **2.74:1** ⚠️ bajo el minimo AA para texto normal
  - rgb(51, 51, 51) sobre rgb(255, 255, 255) → **12.63:1**
  - rgb(51, 51, 51) sobre rgb(51, 51, 51) → **1:1** ⚠️ bajo el minimo AA para texto normal
  - _(5 fondos translucidos omitidos: no se puede juzgar un fondo sin saber que hay detras.)_

## 8. SEO / indexabilidad

- title: Vagaro Pro - Salon, Spa, & Fitness Business Software
- description: 115 caracteres
- canonical: https://www.vagaro.com/pro · OG: 7 · datos estructurados: 3

## 9. Tecnologia detectada

- no detectada

## 10. Lo que NO se pudo medir

- nada: las tres vistas cargaron

Y lo que ninguna medicion automatica alcanza:
- Intencion de diseno: por que eligieron ESTA direccion visual y no otra.
- Calidad del copy: si la promesa es creible y si los numeros estan respaldados.
- Contenido detras de login, muro de cookies o interaccion (paso 2 de un popup, estados de error).
- Si el movimiento AYUDA a entender o solo decora: eso se juzga mirando, no midiendo.
