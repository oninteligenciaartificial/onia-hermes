# Límites de la fórmula — veredicto del crítico adversarial (2026-08-29)

El workflow que destiló el corpus (36 sitios) terminó con un agente crítico que
verificó CADA afirmación contra los HTML crudos. Este archivo guarda lo que
encontró, para que ninguna sesión futura trate la fórmula como ley donde no lo es.
Los dos hallazgos peligrosos ya están corregidos en los docs; el resto queda
como advertencia y cola de cosecha.

## Fabricaciones cazadas (anti-invento)

1. ✅ **CORREGIDO — fuente inventada.** `vertical-playbooks §1 Dental` decía par
   tipográfico "PP Fragment Glare (serif con ink-traps, corpus)". Ese nombre NO
   existe en ningún HTML del corpus. Reemplazado por "Fraunces (derivado, SIN
   ancla)". Es el tipo exacto de invento que la disciplina anti-plantilla debe
   frenar, y se coló porque 11 sitios vinieron con `fonts:[]` (fuentes en CSS
   externo no seguido) y se rellenó por analogía.
2. **Ease canónica sobre N=1.** "34 usos de `(.19,1,.22,1)` del corpus" → los 34
   están TODOS en un solo archivo (floema). Es literal pero NO es validación
   transversal. La ease sigue siendo buena, pero está anclada en un sitio, no en
   el corpus.
3. **Cifras imprecisas** (menores): mintlify "121 transition transform" no
   reproduce (real: adyacencia=44, "transition" a secas=512); readily "canvas×5"
   real=2. No cambian conclusiones, pero no citarlas como exactas.
4. **motion.dev prescripto, no observado.** El reparto de librería mapea
   motion.dev con la misma autoridad que GSAP, pero motion.dev NO aparece en
   ningún sitio del corpus. Lo observado es GSAP (4), Webflow-nativo (12),
   Framer (4). motion.dev es dirección de Sergio (válida), pero es prescripción,
   no evidencia — marcarlo como tal fila por fila.

## Anclas que el crítico verificó CORRECTAS (calibración)

frequency: three×27 / gsap×22 / lenis×6 / scrolltrigger×5 / webgl×3 / video×14 →
exactos. the1: sticky×14 / will-change×59 → exactos. magnetlover will-change×122
→ exacto. readily grid-cols-20 → real. PP Hatton (elevatehome), Scout Sans
(scoutmotors), PP Pangaia (daphne) → presentes en crudo. dashboard.ts=1281
líneas, SERIES_COLORS línea 337 → exactos. **El cuerpo está bien anclado; los
inventos son puntuales.**

## Rubros SIN ancla — NO usar como ley, cosechar (P0)

- 🔴 **Ganadero/campo** — rubro VIVO en producción, y su receta web es 100%
  analogía (cero sitios agtech/ganadero en el corpus). El mayor hueco.
- 🔴 **Importadora/B2B** — próximo vertical; §7 hoy se apoya en scoutmotors
  (automotor) y huts (hospitality) como proxy. Cero importadora real.
- 🔴 **Dental adulto** — rubro insignia encendido, pero el bucket "clínica" es
  N=3 y son salud-mental/wellness (joindawn), no una clínica dental. La demo
  dental-amanecer se deriva de salud mental, no de dental real.
- **IA/agentes** — 3 sitios etiquetados (sutera, cleo, matic) pero sin receta
  propia; ONIA vende agentes 24/7 y el rubro quedó huérfano.
- **Portfolio** — N=1 legible (josh-taylor vino vacío).

## Veredicto

**LISTA para vender en 5 buckets sólidos**: SaaS (N=5), ecommerce (N=5),
cálido-premium/gastronomía/hospitality, editorial/moda, brutalist/agencia — con
la disciplina anti-plantilla del Paso 8 aplicada.

**NO lista como fórmula universal** hasta cosechar ganadero, importadora, dental
real e IA. Cola de cosecha en `docs/LOOP_COLA.md`.
