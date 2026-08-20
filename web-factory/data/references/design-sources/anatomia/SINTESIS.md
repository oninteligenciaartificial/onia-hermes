# Síntesis cruzada — 6 sitios medidos con el mismo instrumento

> Generada el 2026-08-20 desde los 6 reportes de esta carpeta, todos producidos por
> `harvester/vision/extract_web_anatomy.mjs`. Contrato: [`docs/ANATOMIA_DE_UNA_WEB.md`](../../../docs/ANATOMIA_DE_UNA_WEB.md).
>
> **La regla que gobierna este archivo: un sitio hace algo; TRES sitios haciendo lo mismo
> es una ley.** Lo que aparece en 1 o 2 es una decisión de estilo, y decirle "ley" es
> exactamente el error que nos hizo escribir cosas falsas en el pattern bank.

Los 6: `fanvue.com` · `10x.app` · `ui.shadcn.com` · `motion-primitives.com` ·
`componentry.fun` · `efferd.com/blocks`.

⚠️ **No son la misma clase de sitio.** Fanvue y 10x son landings comerciales; shadcn,
motion-primitives, componentry y efferd son sitios de sistema de diseño / documentación,
que son aplicaciones React con cientos de ejemplos vivos. Eso no invalida las leyes de
tipografía, color y movimiento — sí invalida comparar sus pesos con los de una landing.

---

## A. LEYES (3 o más de 6)

### A1. El cuerpo: 14–16 px, interlineado 1,43–1,53, peso 400 — 5 de 6

| sitio | tamaño / lh / peso más repetido | veces |
|---|---|---|
| efferd | 16 px / 1,50 / 400 | 67 |
| 10x | 14 px / 1,50 / 400 | 64 |
| shadcn | 14 px / 1,43 / 400 | 57 |
| componentry | 16 px / 1,53 / 400 | 40 |
| motion-primitives | 16 px / 1,50 / 400 | 30 |
| **fanvue** | **15 px / 1,20 / 500** | 64 |

Fanvue es el único fuera de rango, y por eso **su interlineado apretado es una ley de
DISPLAY, no de cuerpo**. Nuestro canon lo tomó del titular y estuvo bien; aplicarlo al
párrafo sería copiar la excepción.

### A2. El display va con `line-height: 1,00` — 3 de 6

componentry `96px / lh 1,00 / ls −4,8px (−5 %) / w 900` · efferd `48px / lh 1,00 / w 800` ·
fanvue `32px / lh 1,00 / ls −0,648px (−2 %) / w 500`.

El **tracking negativo** acompaña en los dos que lo declaran (−5 % y −2 %). El **peso NO
es ley**: 500, 800 y 900 conviven. Ver contradicción D2.

### A3. Cero `transition: all` — 5 de 6

shadcn 0 · motion-primitives 0 · componentry 0 · efferd 0 · 10x 1 · **fanvue 889**.
Fanvue es el defecto, no el ejemplo. Nuestra prohibición queda confirmada por mayoría.

### A4. La micro-interacción dura 0,15 s con `cubic-bezier(0.4, 0, 0.2, 1)` — 5 de 6

Es la transición más frecuente en 10x (151 elementos), shadcn (46), componentry, efferd (7)
y motion-primitives. Color, fondo y sombra a 0,15 s. Las entradas suben a 0,3 s.

### A5. La escala de breakpoints es 640 / 768 / 1024 / 1280 / 1536 — 5 de 6

Idéntica en shadcn, motion-primitives, componentry, efferd y 10x. Fanvue usa la de Webflow
(479 / 767 / 991). Es la escala de Tailwind y se volvió el estándar de hecho: un diseño que
corta en otros anchos se rompe justo donde el resto funciona.

### A6. Una o dos familias tipográficas — 5 de 6

10x 1 (system) · shadcn 1 (Geist) · motion-primitives 2 · componentry 2 · efferd 3 ·
fanvue 4+. **Geist aparece en 3 de 6.**

### A7. Tres sombras distintas o menos — 6 de 6

fanvue 0 · shadcn 1 · efferd 1 · motion-primitives 2 · 10x 3 · componentry 3.
Unánime. La profundidad sale de superficies y contraste, no de un catálogo de sombras.

### A8. El ritmo cuelga de UN ancla, y `clamp()` es marginal — 5 de 6

`clamp()`: fanvue 7 · shadcn 3 · 10x 0 · motion-primitives 0 · efferd 0 · componentry 38.
Cinco de seis lo usan casi nada. El ancla es `rem` en 4 (10x, shadcn, componentry, efferd)
y `em` en 2 (fanvue 1.428 vs 7 clamp; motion-primitives 86 em / 239 px). Ver D1.

### A9. El movimiento atado al scroll es mayoría — 4 de 6

Sí: fanvue, 10x, motion-primitives, componentry. No: shadcn, efferd. Ver D3.

---

## B. DECISIONES DE ESTILO (1 o 2 de 6 — son opciones, no reglas)

- **`em` en vez de `rem`** como ancla (fanvue, motion-primitives). Las dos anclan igual de
  bien; `em` hereda por sección, `rem` por documento.
- **Display pesado** (componentry 900, efferd 800) contra **display liviano** (fanvue 500).
  Son direcciones opuestas y las dos funcionan; hay que ELEGIR, no promediar.
- **Página larga** (fanvue 13,4 pantallas; motion-primitives 8,4) contra **corta**
  (efferd 1,6; shadcn 2,1). El largo es del argumento, no del gusto.
- **`clamp()` intensivo** (componentry 38): único caso.

---

## C. DEFECTOS QUE NO SE COPIAN

1. **`prefers-reduced-motion` declarado y NO cumplido — los 6.** Cuatro lo declaran en el
   CSS (10x, shadcn, componentry, efferd) y con la preferencia PUESTA siguen animando:
   **shadcn 304 elementos**, componentry 143, 10x 74, fanvue 68. Los otros dos ni lo
   declaran. **Ninguno de los seis lo cumple de verdad.** Que exista la media query no
   prueba nada — hay que volver a medir con la preferencia activa, que es lo que hace
   nuestro extractor y lo que hicimos con el popup de 2 pasos.
2. **Contraste que reprueba AA** en 3 de 6: fanvue blanco sobre su verde **1,48:1** ·
   10x negro al 50 % sobre blanco **4:1** · motion-primitives un par a **2,58:1**.
   Un color de marca precioso puede ser ilegible; se mide antes de adoptarlo.
3. **Fanvue**: 131 de 132 imágenes sin `width`/`height` (CLS asegurado), **0 landmarks
   semánticos** (`header`, `main` y `footer` en cero), 23 de 67 objetivos táctiles bajo
   44 px.
4. **CTAs que compiten**: shadcn 60 distintos · 10x 55 · componentry 33 · efferd 29 ·
   fanvue 21. En un sitio de documentación se entiende; **en una landing que vende, cuando
   todo es un llamado a la acción, ninguno lo es.**

---

## D. CONTRA NUESTRO CANON

Se auditó `WEB_FACTORY_PATTERN_BANK_2026.md` afirmación por afirmación. Cinco no resisten:

### D1. "Ritmo en `em` — la ley que hace que una web NO parezca hecha por IA"
**Parcialmente falso.** 4 de 6 usan `rem`, no `em`. Lo que sí se sostiene es la propiedad
de fondo: **el espaciado cuelga de UN ancla y `clamp()` es marginal** (5 de 6 con ≤7 usos).
La ley es el *ancla única*, no la letra `em`. Escrito como está, manda a reescribir en `em`
un sistema en `rem` que ya cumple.

### D2. "peso 500, nunca 700/800" en display
**Falso como ley.** componentry usa 900 y efferd 800 en su display. Es un rasgo de Fanvue,
no una regla del campo. Lo correcto: **elegir un peso de display y sostenerlo**; el impacto
puede venir del tamaño (500) o del trazo (800–900), pero no se mezclan.

### D3. "el movimiento nunca se ata al dedo del scroll"
**No es lo que hace el campo.** 4 de 6 sí lo atan. Sigue siendo la elección correcta *para
nosotros* — cuesta menos, no marea y no se rompe bajo reduced-motion — pero hay que
declararla como decisión de la casa, no como práctica observada.

### D4. "Hover: `transform 0,2 s`"
**Medido: 0,15 s** es lo dominante en 5 de 6. Diferencia chica, pero es la que separa un
hover que se siente instantáneo de uno que se siente perezoso.

### D5. Nuestro easing `cubic-bezier(0.22, 1, 0.36, 1)` no aparece en NINGUNO de los 6
El dominante es `cubic-bezier(0.4, 0, 0.2, 1)`. Propuesta: mantener el nuestro para
**entradas** (es un ease-out expresivo y es marca) y adoptar `(0.4, 0, 0.2, 1)` para
**micro-interacciones** (hover, color, fondo), que es donde el estándar ya se fijó.

### D6. Bonus — un defecto del propio extractor
La heurística "más de 8 radios distintos = no hay sistema" marca a **shadcn con 19**, que
es *el* sistema de referencia: deriva sus radios de un token `--radius` con `calc()`, así
que el conteo de valores finales no dice nada. **Heurística mala, hay que sacarla o
reformularla.**

*(Lo que SÍ resistió: la prohibición de `transition: all` (A3), el interlineado ≤1 en
display (A2), `clamp()` reservado y no per-token (A8), y la corrección ya aplicada sobre
los keyframes y el parallax de Fanvue.)*

---

## E. Peso contra nuestro presupuesto

Presupuesto de la casa: **150 KB de JS · 30 KB de CSS** en una landing.

| sitio | JS | CSS | total | ¿cumple? |
|---|---|---|---|---|
| motion-primitives | 697 KB | 103 KB | 8,8 MB | ❌ |
| componentry | 1.368 KB | 261 KB | 2,0 MB | ❌ |
| efferd | 3.841 KB | 1.494 KB | 6,0 MB | ❌ |
| fanvue | 4.993 KB | 527 KB | 29,2 MB | ❌ |
| 10x | 5.508 KB | 276 KB | 32,2 MB | ❌ |
| shadcn | 38.185 KB | 664 KB | 40,9 MB | ❌ |

**Cero de seis cumplen.** El más liviano en JS (motion-primitives) está 4,6× por encima.

Esto **no** significa que el presupuesto esté mal: significa que estamos comparando cosas
distintas. Cuatro de los seis son aplicaciones React con cientos de componentes vivos, y
shadcn sirve su documentación entera. Nuestras landings son HTML estático con JS vanilla,
que es justamente por qué el presupuesto es alcanzable para nosotros y no para ellos.

Lo que sí se lleva: **se copia la mecánica, nunca el presupuesto.** Y el dato duro para el
cliente boliviano — 29 MB de Fanvue o 32 MB de 10x sobre un 4G de Santa Cruz son decenas
de segundos y datos que se pagan.

---

## Qué NO cubre esta síntesis

- Las capas 1 (dirección visual), 8 (estados), 9 (componentes) y 11 (copy) **no se midieron
  automáticamente**: piden una pasada humana con capturas. Están declaradas en cada reporte.
- Los pesos se midieron **una vez, sin caché y desde Santa Cruz**. Un segundo pase daría
  números algo distintos; el orden de magnitud no.
- shadcn, componentry, motion-primitives y efferd sirven documentación: sus cifras de
  conversión (CTAs, formularios) no son comparables con las de una landing que vende.
