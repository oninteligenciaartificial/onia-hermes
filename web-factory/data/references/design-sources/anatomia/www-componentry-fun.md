# Anatomia medida — https://www.componentry.fun/

> Generado por `harvester/vision/extract_web_anatomy.mjs` el 2026-08-19.
> Criterios y por que cada uno importa: `docs/ANATOMIA_DE_UNA_WEB.md`.
> Todo lo de aca son valores LEIDOS del sitio vivo. Lo que no se pudo medir esta al final.

## 1. Arquitectura de pagina

- **Largo**: 3.8 pantallas en escritorio · 6 en movil
- **Secciones**: 3
- **Desborde horizontal**: no · movil: no
- **Encabezados**: 7 (2 h1, 0 saltos de nivel)

| # | alto (pantallas) | titular | CTA | medios |
|---|---|---|---|---|
| 0 | 3.8 | Beautiful Animated UIComponents for React | COMPONENTRY | 127 |
| 1 | 3.8 | Beautiful Animated UIComponents for React | COMPONENTRY | 127 |
| 2 | 1.5 | Beautiful Animated UIComponents for React | Backed byVercel OSSProgram | 13 |

## 2. Tokens medidos

**Escala tipografica** (tamano / interlineado / tracking / peso — juntos, que es como funciona):

| valor | veces |
|---|---|
| 16px / lh 1.53 / ls normal / w 400 | 40 |
| 14px / lh 1.29 / ls normal / w 600 | 40 |
| 12px / lh 1.33 / ls normal / w 400 | 40 |
| 96px / lh 1.00 / ls -4.8px / w 900 | 16 |
| 16px / lh 1.50 / ls normal / w 400 | 14 |
| 10px / lh 1.50 / ls normal / w 700 | 12 |
| 15px / lh 1.60 / ls normal / w 400 | 11 |
| 14px / lh 1.43 / ls normal / w 400 | 8 |
| 13px / lh 1.54 / ls normal / w 500 | 7 |
| 18px / lh 1.56 / ls normal / w 400 | 4 |

**Familias**: Geist (222) · JetBrains Mono (2)

**Espaciado** (los que de verdad se repiten): 16px×89 · 6px×66 · 4px×60 · 12px×46 · 2px×41 · normal 14px×40 · 8px×29 · 10px×12 · 24px×9 · 14px×5

**Radios**: 10 valores distintos ⚠️ tantos radios distintos = no hay sistema · **Sombras**: 3 distintas

**Unidad del ritmo**: 87 `em` · 176 `rem` · 981 `px` · 38 `clamp()` · 81 `vw`
→ ritmo mixto o en px/rem: cada token escala por su cuenta.

**Breakpoints reales** (de las media queries): 640px · 1024px · 768px · 1280px · 1536px

## 3. Movimiento

- **Transiciones distintas**: 16 · **@keyframes declarados**: 7
- **`transition: all`**: 0 veces
- **prefers-reduced-motion en el CSS**: si
- **Con la preferencia PUESTA**: 4 elementos siguen animando, 143 con transicion > 50ms
- **Movimiento atado al scroll**: SI (5 estados distintos en 5 posiciones)

Transiciones mas usadas:
- `background-color 0.3s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.3s ` (40)
- `opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)` (40)
- `color 0.15s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.15s cubic` (17)
- `color 0.2s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s cubic-b` (7)
- `box-shadow 0.3s cubic-bezier(0.23, 1, 0.32, 1), transform 0.3s cubic-b` (7)
- `0.15s cubic-bezier(0.4, 0, 0.2, 1)` (6)

## 4. Scroll

- **Pegados** (sticky/fixed): 5
  - div.pointer-events-none fixed inset-y-0 z-[60] hidden w-px bg-li — fixed, alto 900px, top 0px
  - div.pointer-events-none fixed inset-y-0 z-[60] hidden w-px bg-li — fixed, alto 900px, top 0px
  - div.pointer-events-none fixed top-14 z-[61] hidden size-2.5 -tra — fixed, alto 10px, top 56px
  - div.pointer-events-none fixed top-14 z-[61] hidden size-2.5 tran — fixed, alto 10px, top 56px
  - header.fixed top-0 left-0 right-0 z-50 w-full border-b border-line  — fixed, alto 57px, top 0px
- **Nav fija al scrollear**: si

## 5. Conversion

- **CTAs distintos**: 33 · **Formularios**: 0 · **`<dialog>`**: 0
- **CTA mas repetido**: "“very nice stuff!”Pasquale Vitiello@paco" ×4 · "“what is going on @shadcn? In just a few" ×4 · "“updated my portfolio 404 page with @har" ×4 · "“Top notch work.”Mikhan@mmikhan_" ×4


## 6. Rendimiento

- **Peso total**: 2014.5 KB en 123 pedidos
- **Por tipo**: document 186.8 KB · stylesheet 260.7 KB · font 82.8 KB · script 1367.7 KB · image 106.4 KB · fetch 10.1 KB
- **Terceros**: 7 hosts · componentry.dev, unavatar.io, cdn.shadcnblocks.com, cloud.umami.is, api.github.com
- **Fuentes cargadas**: 6 (Geist 100 900 normal · Geist Fallback normal normal · JetBrains Mono 100 800 normal · JetBrains Mono Fallback normal normal · Instrument Serif 400 normal)

Contra el presupuesto de la casa (150 KB JS / 30 KB CSS en una landing): **JS 1367.7 KB · CSS 260.7 KB**.

## 7. Accesibilidad

- **Imagenes**: 29 · sin `alt`: 0 · sin dimensiones: 29 · lazy: 0 · con `srcset`: 0
- **Objetivos tactiles < 44px**: 29 de 60 interactivos
- **Idioma**: en · **Landmarks**: {"header":1,"nav":1,"main":1,"footer":1}
- **Contraste** (pares mas frecuentes, resueltos a sRGB y con el texto compuesto sobre su fondo):
  - lab(98.26 0 0) sobre rgb(18, 18, 18) → **17.95:1**
  - lab(98.26 0 0) sobre lab(15.7305 0.613764 -2.16959) → **14.27:1**
  - lab(98.26 0 0) sobre rgb(22, 22, 22) → **17.34:1**
  - color(srgb 0.50631 0.506393 0.506368) sobre rgb(18, 18, 18) → **4.81:1**
  - color(srgb 0.50631 0.506393 0.506368) sobre lab(15.7305 0.613764 -2.16959) → **3.82:1** ⚠️ bajo el minimo AA para texto normal
  - color(srgb 0.50631 0.506393 0.506368) sobre rgb(22, 22, 22) → **4.65:1**
  - _(9 fondos translucidos omitidos: no se puede juzgar un fondo sin saber que hay detras.)_

## 8. SEO / indexabilidad

- title: Componentry — Beautiful Animated UI Components for React
- description: 136 caracteres
- canonical: https://componentry.dev/ · OG: 11 · datos estructurados: 5

## 9. Tecnologia detectada

- no detectada

## 10. Lo que NO se pudo medir

- nada: las tres vistas cargaron

Y lo que ninguna medicion automatica alcanza:
- Intencion de diseno: por que eligieron ESTA direccion visual y no otra.
- Calidad del copy: si la promesa es creible y si los numeros estan respaldados.
- Contenido detras de login, muro de cookies o interaccion (paso 2 de un popup, estados de error).
- Si el movimiento AYUDA a entender o solo decora: eso se juzga mirando, no midiendo.
