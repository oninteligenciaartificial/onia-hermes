# Anatomía de una web — qué se extrae cuando se scrapea, y por qué

> **Este doc es el contrato.** Cuando Sergio dice "scrapeá esta web", esto es lo que hay
> que traer. No es una lista de deseos: `harvester/vision/extract_web_anatomy.mjs` la
> implementa y la mide sola. Si agregás una capa acá, agregala al script o el doc miente.
>
> ```bash
> node harvester/vision/extract_web_anatomy.mjs --url https://ejemplo.com
> ```
> Salida: `data/references/design-sources/anatomia/<slug>.{json,md}`

## Por qué existe

Veníamos extrayendo **descripción** y no **mecánica**. El esquema de learned models
(`data/references/reels/models/`) nace de mirar un reel, así que dice "serif editorial",
"sans limpia", "motionLevel 3": alcanza para elegir dirección, no para reproducir nada.
Y `capture_reference_bank.mjs` saca titulares, CTAs y paleta.

Con eso se describe una web. No se construye.

La prueba de que faltaba: la primera pasada sobre Fanvue dejó escrito en nuestro pattern
bank que **"no tiene ningún parallax"** y **"2 keyframes en todo el sitio"**. Medido con
este script en 5 posiciones de scroll: **sí tiene movimiento atado al scroll**, y hay 3
`@keyframes` con 889 elementos arrastrando `transition: all`. Una medición floja no es
neutra — **envenena el canon**, y después construimos sobre eso.

## Las tres reglas que gobiernan toda extracción

1. **Se mide, no se estima.** Todo número sale de `getComputedStyle`,
   `getBoundingClientRect`, el CSSOM o la red. Lo que no se pudo medir se declara como
   "no medido", nunca se completa con lo que uno supone que hacen.
2. **Se guardan inventarios, no copias.** Cuántos radios distintos hay, qué duraciones se
   repiten, qué contraste da cada par. Nunca el HTML ni el CSS crudo de un tercero
   (regla de `harvester/vision/README.md`). El inventario es aprendizaje; la copia es otra
   cosa, y además se desactualiza.
3. **Los colores se guardan con su ROL.** `bg`, `superficie`, `texto`, `acento`, `borde` —
   para retokenizar contra `packages/tokens`, jamás para pegar el hex del otro.

## Las 15 capas

### 1. Dirección visual

Qué estilo es y qué lo hace reconocible en un segundo: editorial, brutalismo, glass,
lujo oscuro, suizo, bento, retro-futurismo. **Esta capa es la única que se juzga mirando**
— el script no la infiere. Va con al menos una captura.

*Por qué*: sin nombrar la dirección, todo termina en "limpio y minimalista", que es el
nombre técnico de no haber elegido nada.

### 2. Tokens de diseño

| Qué | Cómo se mide | Por qué importa |
|---|---|---|
| **Paleta** | frecuencia de `color` y `background-color` computados | los que MÁS se repiten son el sistema; el resto es ruido |
| **Escala tipográfica** | tamaño + interlineado + tracking + peso **juntos**, por frecuencia | separados no dicen nada: `28px` no significa nada, `28px / lh 1.00 / w 500` sí |
| **Familias** | `font-family` computado + `document.fonts` | delata si hay pareja tipográfica o una sola fuente estirada |
| **Escala de espaciado** | valores de `padding`/`margin`/`gap` que se repiten | los que aparecen 30 veces son la escala; los únicos son parches |
| **Unidad del ritmo** | conteo de `em` / `rem` / `px` / `clamp()` / `vw` en el CSS | **el dato que más delata si hay sistema.** Ver capa 3 |
| **Radios y sombras** | inventario de valores únicos | 14 radios distintos = no hay sistema, hay decisiones sueltas |
| **z-index** | niveles usados | si hay 9 niveles improvisados, cualquier overlay futuro rompe algo |

### 3. Ritmo y unidad — la ley anti-"parece IA"

Se cuenta en qué unidad está escrito el espaciado vertical. Fanvue: **1.428 `em` contra
7 `clamp()`**. Todo su ritmo cuelga de UN `font-size` que cambia por breakpoint.

*Por qué importa*: cuando cada token escala por su cuenta (`5.6vw` acá, `clamp()` allá),
la relación entre título, texto y aire **cambia según el ancho de la ventana**. Eso es
buena parte del "se ve raro / parece hecho por IA" que nadie sabe explicar. Es medible, y
por eso es corregible.

### 4. Arquitectura de layout

Anchos de contenedor por breakpoint · rejilla (columnas, gaps, grid vs flex, si la rompe a
propósito) · **breakpoints reales leídos de las media queries**, no los supuestos ·
densidad · desborde horizontal.

*Por qué los breakpoints reales*: Fanvue usa 479/767/991/1920 (los de Webflow), no
768/1024/1440. Copiar los tamaños sin copiar los cortes da un resultado que se rompe justo
donde el original funciona.

### 5. Arquitectura de la información

El **trabajo** de cada sección en orden (hero, prueba, problema, solución, cómo funciona,
precios, objeciones, cierre) · cuántas pantallas hasta el primer CTA · jerarquía de
encabezados y si tiene saltos de nivel · qué se repite.

*Por qué*: el orden ES el argumento de venta. Copiar la estética sin el orden da una web
linda que no convence.

### 6. Arquitectura de scroll

Largo total en pantallas · qué está `sticky`/`fixed` y por cuánto scroll · si alguna
sección captura el scroll (pin), `scroll-snap` o scroll horizontal · **si hay movimiento
atado al scroll** (se muestrea el `transform` en 5 posiciones y se comparan las firmas) ·
comportamiento del nav.

*Por qué se muestrea en 5 posiciones*: mirar antes y después de un scroll da falso
negativo. Así fue como escribimos "Fanvue no tiene parallax", que era falso.

### 7. Movimiento

Inventario de `@keyframes` y de `transition` distintas (pocas = sistema) · duraciones y
easings con su frecuencia · **qué propiedades se animan** (si hay layout, es pecado) ·
disparo (on-load / in-view / scroll-linked / hover) · stagger · librería y su peso ·
**`transition: all`** contado.

*Y `prefers-reduced-motion` se verifica EJECUTANDO*: se vuelve a cargar con la preferencia
puesta y se cuentan los elementos que siguen animando. Que la media query exista no prueba
nada. Fanvue no la tiene: 68 elementos siguen con transición.

### 8. Interacción y estados

Hover, `focus-visible`, active, disabled, loading, vacío, error — por control. Cursor
propio. Si el foco de teclado se ve.

*Por qué*: los estados son la mitad de la sensación de "producto terminado", y son
justo lo que no aparece en una captura.

### 9. Componentes

Taxonomía y cuántas variantes de cada uno. Cuáles son reusables y cuáles de una sola vez.

### 10. Captura y conversión

Formularios (cuántos campos, cuáles obligatorios, tipos, validación) · popups y su nivel en
[la escalera](../WEB_FACTORY_PATTERN_BANK_2026.md) · CTAs: cuántos distintos y si compiten
entre sí · prueba social (logos, cifras, testimonios) y **si es verificable** · pasos hasta
convertir.

*Por qué "CTAs distintos"*: Fanvue tiene 21. Cuando todo es un llamado a la acción, nada lo es.

### 11. Contenido y copy

Estructura del titular (¿promete resultado o nombra categoría?) · medida de línea · tono y
persona · **qué números afirma y si están respaldados**.

⚠️ Regla de la casa: ninguna cifra ajena se repite como propia sin verificarla. Se marca
"a verificar" o no se menciona.

### 12. Rendimiento

Peso por tipo con cifras (JS, CSS, imágenes, fuentes, media) · nº de pedidos y terceros ·
formatos de imagen, dimensiones declaradas, `lazy`/`eager`, `srcset` · fuentes (cuántas
familias y pesos, `font-display`, preload).

**Siempre contra el presupuesto de la casa**: 150 KB de JS y 30 KB de CSS en una landing.
Fanvue mide 5 MB de JS y 29 MB en total: se le copia la mecánica, **nunca el presupuesto**.

### 13. Accesibilidad

Contraste real de los pares texto/fondo más frecuentes · landmarks semánticos y orden de
encabezados · `alt` · foco visible y navegación por teclado · objetivos táctiles ≥ 44 px.

*Por qué medir el contraste y no confiar en la referencia*: el verde de Fanvue con texto
blanco da **1.48:1**, muy por debajo del 4.5:1 de AA. Copiar ese par es heredar un defecto.

### 14. Indexabilidad

`title`, description, canonical, OG, datos estructurados, idioma, robots, sitemap, 404.

⚠️ El `canonical` va **por página**, nunca en el layout raíz: en el raíz todas las rutas
heredan `/` y se desindexa el sitio entero.

### 15. Responsive y tecnología

Qué cambia **de verdad** entre 390 / 768 / 1440 — no sólo que quepa · si hay contenido
duplicado por breakpoint (Fanvue mantiene `.desk` y `.mob` con el mismo texto: eso pesa) ·
desborde horizontal en cada uno · stack detectado (Next, Webflow, React, GSAP, Swiper).

## Qué NO puede medir el script

Se declara en cada reporte, no se simula:

1. **Intención de diseño**: por qué eligieron esta dirección y no otra.
2. **Calidad del copy**: si la promesa es creíble.
3. **Lo que está detrás de un login, un muro de cookies o una interacción** (el paso 2 de
   un popup, los estados de error).
4. **Si el movimiento ayuda a entender o sólo decora**: eso se juzga mirando.

Para 3 y 4 va una pasada humana con capturas. Un reporte que no dice qué le falta es peor
que uno incompleto: se lee como si estuviera completo.

## Cómo se usa lo extraído

1. **Medir** con el script → `anatomia/<slug>.{json,md}`.
2. **Comparar** contra lo que ya está en
   [`WEB_FACTORY_PATTERN_BANK_2026.md`](../WEB_FACTORY_PATTERN_BANK_2026.md). Si contradice
   una ley nuestra, **gana la medición** y se corrige el pattern bank citando el número.
3. **Consagrar** sólo lo que se repite en varias referencias. Un sitio hace algo; tres
   sitios haciendo lo mismo es una ley.
4. **Retokenizar** antes de que un bloque salga: colores a `packages/tokens`, ritmo a `em`,
   presupuesto al nuestro.
5. Si el patrón se vuelve bloque: va a `packages/blocks/src/` con test y aparece solo en la
   galería (`pnpm blocks:demo`).
6. **Si el sitio medido es un cliente entregado**: emitir su contrato visual con
   `node harvester/vision/emit_design_md.mjs --slug <slug>` →
   `data/clients/<slug>.design.md`. Es una vista generada de esta anatomía, no una
   tercera fuente — formato y prueba en [DESIGN_MD_CLIENTES.md](DESIGN_MD_CLIENTES.md).
