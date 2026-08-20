# Motion Toolkit

The animation primitives the factory uses to make generated webs feel
professional — the same movement observed in the learned reel models
(`data/references/reels/web-models.json` → `motionLibrary`).

Generated sites are static HTML with `wf-*` classes, so this ships as plain CSS +
a tiny vanilla runtime — **zero deps, zero React**. Source: `src/motion.ts`.
<<<<<<< HEAD

Live demo: run `pnpm blocks:demo` and open `out/blocks-demo/index.html`. Every
block in the gallery has the toolkit wired, and the primitives table is read from
`MOTION_PRIMITIVES` at build time. (It replaced `motion-demo.html`, a hand-kept
copy of `MOTION_CSS` that had already drifted from the source it mirrored.)
=======
Live demo (self-contained, no network): open `motion-demo.html` in a browser.
>>>>>>> origin/main

## Wire it once per generated page

```ts
import { renderMotionStyles, renderMotionScript } from "@onia/blocks";
// in <head>:  renderMotionStyles()
// before </body>:  renderMotionScript()
// or drop renderMotionAssets() once at the end of the body.
```

Then any block opts into motion by adding a class. That's it.

## Primitives (class → what it does)

| Add this class | Motion | Trigger |
|---|---|---|
| `wf-reveal` | fade + slide up | on scroll into view |
| `wf-clip-reveal` (on a `<figure>`) + `wf-zoom` (on the inner media) | cinematic clip-path wipe + slow zoom | in view |
| `wf-scale-in` | scale up + fade | in view |
| `wf-slide-left` / `wf-slide-right` | slide in from the side | in view |
| `wf-stagger` (on a parent) | children cascade in | in view |
| `wf-type-slam` (+ `wf-onload`) | headline slams in | on load |
| `wf-parallax` + `data-wf-parallax="0.2"` | media moves slower than scroll | scroll-linked |
| `wf-hover-lift` | card lifts + shadow on hover | hover |
| `wf-sticky` | sticky nav (+ `wf-scrolled` state) | scroll-linked |
<<<<<<< HEAD
| `data-wf-scrub` (on a tall track) + `wf-frame` / `wf-step` children | el scroll avanza la escena por etapas (sticky + scrub, patrón P3) | scroll-linked |
| `wf-count` + `data-wf-count="4200"` | la métrica cuenta hasta su valor real | in view |

**`data-wf-scrub`** — el track mide `100svh + (n-1) * 70svh` y adentro va una escena
`position: sticky`. El runtime le pone `data-wf-step` con la etapa activa y marca
`.wf-on` en el `.wf-frame` y el `.wf-step` correspondientes (`aria-current="step"`).
Sin JS se ve el primer frame; con reduced-motion no hay pin ni scrub. El track no
puede tener ningún ancestro con `overflow:hidden` o `transform` (mata el sticky).

**`wf-count`** — el HTML lleva SIEMPRE el número final (SEO, sin JS, reduced
motion); el runtime sólo anima hacia el valor que ya está escrito y lo restaura
exacto al terminar. Regla 7 del banco de patrones: montos y cifras fiscales no
bailan — el bloque decide qué es contable, la primitiva no adivina.
=======
>>>>>>> origin/main

Add `wf-onload` to any reveal class to fire it immediately instead of on scroll.
Tune per element with inline `--wf-dur` (duration) and `--wf-stag` (stagger step).

## Reduced motion is built in

Under `prefers-reduced-motion: reduce`, every element renders in its **final
state** — no transforms, no reveals, no parallax. The runtime also has a 3s safety
reveal so degraded webviews/prerenderers never leave content hidden.

## The loop: a learned model → these classes

Each learned model's sections carry a precise `motion` spec (entrance, trigger,
easing `cubic-bezier(0.22,1,0.36,1)`, duration, stagger, scroll-linked, hover,
reduced-motion). Build it by mapping that spec to a class here — for example the
Le Cercle hero (`media reveals via clip-path wipe + slow zoom; headline lines
stagger in`) becomes:

```html
<section class="wf-sticky">…nav…</section>
<div class="wf-stagger wf-onload">
  <h1 class="wf-type-slam wf-onload">Live Where the Sun Meets the Sea</h1>
  <p>…</p><div class="cta">…</div>
</div>
<figure class="wf-clip-reveal wf-onload"><img class="wf-zoom" …></figure>
…later sections use wf-reveal / wf-stagger / wf-parallax / wf-hover-lift…
```

`MOTION_PRIMITIVES` in `src/motion.ts` is the machine-readable version of this
mapping.
