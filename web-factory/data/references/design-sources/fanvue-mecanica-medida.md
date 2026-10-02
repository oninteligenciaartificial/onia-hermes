# Fanvue — mecánica MEDIDA con F12 (fanvue.com, 2026-08-18)

> Sergio: "es la mejor web que he visto; aprendé cómo se hace y usá esas tipografías".
> Esto NO es opinión: son valores leídos del DOM en vivo con `getComputedStyle`.
> Regla de la casa: se toma la MECÁNICA, nunca la identidad ni el rubro.

## 1. Tipografía — los números exactos

| Elemento | Tamaño | Peso | Line-height | Tracking | Ratio lh/fs |
|---|---|---|---|---|---|
| H1 hero | 49,79 px | **500** | 49,79 px | −0,2 px | **1,00** |
| H2 sección | 49,79 px | 500 | 49,79 px | −0,2 px | 1,00 |
| H2 grande | **80 px** | 500 | 72 px | **−1,6 px (−2 %)** | **0,90** |
| H2 "FAQ" | 106,6 px | 400 | 85,3 px | normal | **0,80** |
| Nav / meta | 13,31 px | 500 | 13,31–19,97 px | −0,1 px | 1,0–1,5 |
| Nombre en card | 28,8 px | 500 | 28,8 px | −0,576 px (−2 %) | 1,00 |

**Las 4 leyes que se extraen:**
1. **Line-height ≤ 1,0 en display.** Cuanto más grande el titular, MÁS apretado: 1,00 a
   50 px → 0,90 a 80 px → 0,80 a 106 px. Eso es lo que hace que un titular gigante se
   lea como un bloque sólido y no como líneas sueltas.
2. **Tracking negativo que ESCALA con el tamaño**: ≈ −0,4 % a 50 px y **−2 % a 80 px**.
   No es un valor fijo: es proporcional.
3. **Peso 500, jamás 700/800.** El impacto sale del TAMAÑO y del apretado, no del grosor.
   Su display más grande (106 px) usa peso 400.
4. **El texto de cuerpo no es negro puro**: `rgba(22, 22, 19, 0.75)` — off-black al 75 %
   de opacidad. Baja el contraste del párrafo para que el titular mande.

**Sus fuentes**: `Medium AG Next` (Akzidenz Grotesk Next) + `Akzidenz Grotesk Pro Med`.
⚠️ **Son de pago (Berthold): NO se pueden usar sin licencia.** Onia ya tiene el
sustituto correcto elegido y medido: **Archivo** (Google, gratis) con el tracking −2 %,
que es exactamente el "efecto Apple" que ya estaba documentado en nuestra medición
previa. **Lo que se copia es la mecánica de arriba, no el archivo de fuente.**

> **29-sep-2026: Sergio Urcullo eligió Instrument Sans + IBM Plex Mono como la letra de
> la marca, estilo Fanvue; Archivo queda superado.** Instrument Sans va en texto y
> titulares (peso 500-600, tracking −2 %, nunca 700); IBM Plex Mono en micro-etiquetas,
> números y horas. Las dos entran por `next/font/google` (auto-hospedadas) en
> `apps/onia-platform/src/app/layout.tsx`. La medición de arriba sigue valiendo: cambia
> la familia, no la mecánica.

## 2. Color

- Fondo negro puro `rgb(0,0,0)` + **verde brillante de señal** `rgb(73,242,100)` y
  `rgb(161,255,98)` como acento único (mismo terreno que el verde de Onia).
- Superficies: blanco/hueso al **15 % de opacidad** (`rgba(239,238,236,0.15)`) — no
  grises opacos: transparencias sobre el negro. Da profundidad sin bordes.
- Un azul (`rgb(56,152,236)`) como segundo acento puntual, nada más.

## 3. Densidad visual — el hallazgo grande

**132 imágenes y 10 videos en UNA página.** No es una landing de texto con adornos: es
una landing de MEDIA con texto encima. Ahí está la diferencia con la nuestra, que es casi
toda tipografía + mockups dibujados.

## 4. Layout

- **Medida de línea angosta para texto**: contenedores de **819 / 823 / 896 px** máx.
  El texto nunca cruza la pantalla entera aunque la sección sea de 2000 px.
- **Gaps generosos**: 46,7 · 71,2 · 115,6 px. El aire es parte del diseño, no sobra.
- Flex sobre grid para casi todo; secciones con padding 0 y contenedor interno.

## 5. Movimiento

- **Marquesina infinita**: `35s linear infinite scrolllogo` — logos/pruebas desplazándose
  para siempre, sin controles. Transform en X (medido: `matrix(1,0,0,1,−52,0)`).
- Transiciones de color: `0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)` (easeOutQuad).
  Cortas y suaves; cero animación de layout.

## 6. Qué portar a Onia (y qué no)

| Se porta | Cómo |
|---|---|
| lh ≤ 1,0 en display con escala inversa | tokens: `--lh-display: .9` a partir de 64 px, `.8` a partir de 96 px |
| tracking −2 % proporcional | `letter-spacing: -0.02em` en display, `-0.004em` en subtítulos |
| peso 500 para titulares | Archivo 500, nunca 700 — desde el 29-sep-2026, Instrument Sans 500-600 |
| cuerpo a 75 % de opacidad | token de texto secundario sobre el fondo |
| superficies por transparencia (15 %) | reemplaza los grises opacos de nuestras tarjetas |
| medida de línea ≤ 900 px | contenedor de texto propio, independiente del de sección |
| marquesina 35 s de prueba social | solo con material REAL (capturas del producto), nunca logos inventados |
| densidad de media | usar las capturas reales del dashboard/pantallas, no mockups dibujados |

| NO se porta | Motivo |
|---|---|
| AG Next / Akzidenz | fuentes de pago sin licencia → Archivo (superado el 29-sep-2026: Instrument Sans + IBM Plex Mono) |
| Testimonios de creadores con caras | no tenemos clientes; fabricarlos está prohibido |
| Fondo negro total | la dirección de Onia es claro premium (decisión de Sergio) — el negro se usa como ANCLA de sección, no como base |


## 7. MOVIMIENTO — la receta completa, medida (F12, 2026-08-18)

Sorpresa: su motion es **mínimo y repetido**, no una orgía de scroll. En TODO el sitio
hay **solo 2 @keyframes**:

```css
@keyframes scrolllogo { 0% { transform: translateX(0) }
                        100% { transform: translateX(calc(-100% - 5.56em)) } }
@keyframes spin { 0% { rotate(0) } 100% { rotate(360deg) } }
```

| Patrón | Valor medido | Dónde |
|---|---|---|
| **Marquesina infinita** | `35s linear infinite scrolllogo` + `will-change: transform` | banda de logos/prueba social |
| **Revelado al entrar** | `transition: opacity .3s, transform .3s` (32 elementos) | secciones al hacer scroll |
| **Hover de tarjeta/imagen** | `transform .2s linear` (12-13 elementos) | media y cards |
| **Hover de texto/link** | `color .3s cubic-bezier(.25,.46,.45,.94)` | nav y links |
| **Secciones pegadas** | `position: sticky` (clases `en-sticky`, `faq`) | el relato scrollytelling |
| **Parallax en imágenes** | ❌ **NINGUNO** — transform medido antes/después de scrollear 2400px: `none` | — |

**Las 3 lecciones:**
1. **Cero scrub de scroll y cero parallax.** El movimiento se dispara al ENTRAR (una
   vez) o al hacer hover. Nada atado al dedo del scroll: por eso se siente rápido y
   nunca "pesado".
2. **Duraciones cortas y fijas**: 0,2 s hover · 0,3 s revelado. El único movimiento
   largo es la marquesina (35 s), que es ambiental, no un evento.
3. **Solo `transform` y `opacity`** (compositor). Cero animación de layout.
   ⚠️ Detalle honesto: tienen **940 elementos con `transition: all`** — default de
   Webflow, es descuido, NO se copia (`all` obliga al navegador a vigilar todo).

### Estado en Onia: el vocabulario YA está construido

`web-factory/apps/onia-platform/src/motion/` ya tiene: `marquee.tsx` (32 s linear —
prácticamente el 35 s de Fanvue), `reveal.tsx` (opacity+transform con whileInView, sin
scrub), `sticky-scene.tsx`, `coverflow.tsx`, `split-text.tsx`, `stagger-grid.tsx`,
`magnetic.tsx`, `count-up.tsx`. La landing ya los usa (chatbot-cta, etc.).
**No hay que construir motion nuevo para verse como Fanvue: hay que USAR el que existe
con estos tiempos y no inventar parallax.**


## 8. EL SISTEMA DE MEDIDAS — el hallazgo mayor (CSS real, 2026-08-18)

Extraje las REGLAS CSS del sitio, no solo los valores computados. Conteo de unidades en
sus clases de layout: **98 `em` · 14 `rem` · 160 `px` · 1 `vw` · CERO `clamp()`**.

### Todo el ritmo vertical está en `em`

```css
.section        { padding: 4em 2em 5.5em;  background: rgb(236,237,238); }
.section-hero   { padding: 0 2em 8.1em; }
.section-full   { padding: 9.5em 0 5.5em; min-height: 100vh; }
.section-footer { padding: 5.5em 2em 2.5em; }
.section.dark   { background: rgb(20,20,20); }     /* modificador, NO base */
.nav-button     { padding: .7em 1.7em; border-radius: 10em;
                  transition: box-shadow .4s cubic-bezier(.165,...); }
```

### Y el `em` se ancla en UN solo número que cambia por breakpoint

```
body/section font-size: 12.8px  (base)
  @min-width 1440px → 15px
  @min-width 1920px → 16px
  @min-width 2000px → 20px
```

**Consecuencia: cambian UN valor y toda la página reescala en proporción** — padding,
gaps, radios y tipografía a la vez, sin tocar nada más. Por eso su espaciado se siente
tan coherente en cualquier pantalla.

### Comparación honesta con lo que hacemos en Onia

| | Fanvue | Onia hoy |
|---|---|---|
| Ritmo | `em` anclado a un font-size por breakpoint | `clamp()` por token, cada medida independiente |
| Fluidez | Escalones (4 breakpoints) | Continua |
| Coherencia | **Total: todo escala junto** | Cada token puede desincronizarse del otro |
| Riesgo | Saltos entre escalones | Combinaciones raras en anchos intermedios |

Ninguno es "el correcto". Pero **el de ellos garantiza proporción y el nuestro no**:
si un token usa `5.6vw` y otro `4vw`, a 1100 px la relación entre título y espacio no es
la misma que a 1600 px. Ahí nace parte del "se ve raro" que no se sabe explicar.

**Regla adoptada para Web Factory**: dentro de una SECCIÓN, el espaciado interno va en
`em` (relativo a su propio font-size). El `clamp()` se reserva para el font-size de la
sección y para el ancho de los contenedores. Así se hereda la proporción de Fanvue sin
perder nuestra fluidez.

### Otros detalles del CSS que valen

- **El fondo base es CLARO** `rgb(236,237,238)` y `.dark` es un modificador de sección:
  exactamente la decisión que Sergio ya había tomado para Onia (claro premium con anclas
  oscuras). Confirmado por su código, no por opinión.
- **Hover de botón = `box-shadow .4s`**, no `transform`: el botón no se mueve, se
  levanta. Más sobrio que el escalado típico.
- **Radio de píldora `10em`** (no `999px`): también escala con el sistema.
- Marcado de la marquesina: `.banner > .banner-cont-wrap > .banner-cont-w` con una fila
  de `img.banner-logo` — es un contenedor con `overflow:hidden` y una pista duplicada.
