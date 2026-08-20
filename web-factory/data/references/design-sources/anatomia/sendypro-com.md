# Anatomia medida — https://sendypro.com/

> Generado por `harvester/vision/extract_web_anatomy.mjs` el 2026-08-20.
> Criterios y por que cada uno importa: `docs/ANATOMIA_DE_UNA_WEB.md`.
> Todo lo de aca son valores LEIDOS del sitio vivo. Lo que no se pudo medir esta al final.

## 1. Arquitectura de pagina

- **Largo**: 4.5 pantallas en escritorio · 6.9 en movil
- **Secciones**: 9
- **Desborde horizontal**: no · movil: no
- **Encabezados**: 22 (1 h1, 2 saltos de nivel)

| # | alto (pantallas) | titular | CTA | medios |
|---|---|---|---|---|
| 0 | 1 | - | - | 0 |
| 1 | 0.7 | WhatsApp API Oficial + IA que vende por ti | ✨ Empezar Gratis | 1 |
| 2 | 0.7 | Potenciado por Inteligencia Artificial | 🤖 Chatbot IA | 0 |
| 3 | 0.3 | Automatiza en minutos | - | 0 |
| 4 | 0.9 | WhatsApp API Oficial + IA incluida | Elegir Plan | 0 |
| 5 | 0.4 | +500 empresas confian en nosotros | - | 0 |
| 6 | 0.5 | Preguntas frecuentes | - | 0 |
| 7 | 0.3 | - | ▶ Disponible en Google Play | 1 |
| 8 | 0.4 | Listo para automatizar? | ✨ Comenzar Gratis | 0 |

## 2. Tokens medidos

**Escala tipografica** (tamano / interlineado / tracking / peso — juntos, que es como funciona):

| valor | veces |
|---|---|
| 13px / lh 1.60 / ls normal / w 400 | 57 |
| 14px / lh 1.60 / ls normal / w 400 | 31 |
| 14px / lh 1.60 / ls normal / w 600 | 26 |
| 16px / lh 1.60 / ls normal / w 400 | 24 |
| 12px / lh 1.60 / ls normal / w 400 | 22 |
| 12px / lh 1.60 / ls normal / w 600 | 9 |
| 32px / lh 1.60 / ls normal / w 700 | 8 |
| 18px / lh 1.60 / ls normal / w 600 | 6 |
| 18px / lh 1.60 / ls normal / w 400 | 6 |
| 14px / lh normal / ls normal / w 600 | 5 |

**Familias**: Inter (247) · Arial (7)

**Espaciado** (los que de verdad se repiten): 12px×99 · 8px×49 · 24px×31 · 16px×31 · 20px×29 · 4px×24 · 6px×20 · 10px×16 · 32px×14 · 14px×7

**Radios**: 9 valores distintos (contar valores finales NO mide el sistema: shadcn tiene 19 y todos salen de un `--radius` con calc()) · **Sombras**: 12 distintas

**Unidad del ritmo**: 0 `em` · 0 `rem` · 0 `px` · 0 `clamp()` · 0 `vw`
→ ritmo mixto o en px/rem: cada token escala por su cuenta.

**Breakpoints reales** (de las media queries): no detectados

## 3. Movimiento

- **Transiciones distintas**: 5 · **@keyframes declarados**: 0
- **`transition: all`**: 0 veces
- **prefers-reduced-motion en el CSS**: NO
- **Con la preferencia PUESTA**: 17 elementos siguen animando, 64 con transicion > 50ms
- **Movimiento atado al scroll**: SI (5 estados distintos en 5 posiciones)

Transiciones mas usadas:
- `0.3s` (27)
- `0.5s ease-out` (20)
- `color 0.3s` (6)
- `transform 0.3s` (6)
- `0.2s` (5)

## 4. Scroll

- **Pegados** (sticky/fixed): 8
  - div.bg-mesh — fixed, alto 900px, top 0px
  - div.particle particle-1 — fixed, alto 6px, top 135px
  - div.particle particle-2 — fixed, alto 4px, top 225px
  - div.particle particle-3 — fixed, alto 5px, top 405px
  - div.particle particle-4 — fixed, alto 4px, top 585px
  - div.particle particle-5 — fixed, alto 6px, top 765px
- **Nav fija al scrollear**: si

## 5. Conversion

- **CTAs distintos**: 26 · **Formularios**: 0 · **`<dialog>`**: 0
- **CTA mas repetido**: "Probar gratis →" ×5 · "Caracteristicas" ×2 · "Precios" ×2 · "App Android" ×2


## 6. Rendimiento

- **Peso total**: 710.7 KB en 12 pedidos
- **Por tipo**: document 46.8 KB · script 1.2 KB · image 601.1 KB · stylesheet 14.5 KB · font 47.1 KB
- **Terceros**: 3 hosts · fonts.googleapis.com, fonts.gstatic.com
- **Fuentes cargadas**: 6 (Inter 400 normal · Inter 500 normal · Inter 600 normal · Inter 700 normal · Inter 800 normal)

Contra el presupuesto de la casa (150 KB JS / 30 KB CSS en una landing): **JS 1.2 KB · CSS 14.5 KB**.

## 7. Accesibilidad

- **Imagenes**: 4 · sin `alt`: 0 · sin dimensiones: 4 · lazy: 0 · con `srcset`: 0
- **Objetivos tactiles < 44px**: 16 de 34 interactivos
- **Idioma**: es · **Landmarks**: {"header":1,"nav":1,"main":0,"footer":1}
- **Contraste** (pares mas frecuentes, resueltos a sRGB y con el texto compuesto sobre su fondo):
  - rgb(255, 255, 255) sobre rgb(124, 58, 237) → **5.7:1**
  - rgb(255, 255, 255) sobre rgb(6, 182, 212) → **2.43:1** ⚠️ bajo el minimo AA para texto normal
  - rgb(255, 255, 255) sobre rgb(236, 72, 153) → **3.53:1** ⚠️ bajo el minimo AA para texto normal
  - rgba(255, 255, 255, 0.6) sobre rgb(124, 58, 237) → **3.01:1** ⚠️ bajo el minimo AA para texto normal
  - rgba(255, 255, 255, 0.6) sobre rgb(6, 182, 212) → **1.68:1** ⚠️ bajo el minimo AA para texto normal
  - rgba(255, 255, 255, 0.6) sobre rgb(236, 72, 153) → **2.12:1** ⚠️ bajo el minimo AA para texto normal
  - _(10 fondos translucidos omitidos: no se puede juzgar un fondo sin saber que hay detras.)_

## 8. SEO / indexabilidad

- title: SendyPro - WhatsApp API Oficial + IA con audios realistas | Partner Oficial de Meta
- description: 139 caracteres
- canonical: NO · OG: 5 · datos estructurados: 0

## 9. Tecnologia detectada

- no detectada

## 10. Lo que NO se pudo medir

- nada: las tres vistas cargaron

Y lo que ninguna medicion automatica alcanza:
- Intencion de diseno: por que eligieron ESTA direccion visual y no otra.
- Calidad del copy: si la promesa es creible y si los numeros estan respaldados.
- Contenido detras de login, muro de cookies o interaccion (paso 2 de un popup, estados de error).
- Si el movimiento AYUDA a entender o solo decora: eso se juzga mirando, no midiendo.
