# Mapa de 42 skills en 6 capas para que Claude deje de diseñar genérico

- **Fuente:** https://www.instagram.com/p/DavhSnZDP4x/ · carrusel de 7 láminas · español
- **Visto:** 2026-08-11 — láminas leídas **con visión propia**, sin Gemini. Caption completo.
- **Cobertura:** 5 de 7 láminas (las 5 que contienen las 42 skills) + caption íntegro

## Qué dice realmente

Abre con una frase que es literalmente nuestro problema documentado:
*"Claude por defecto diseña horrible. Interfaces genéricas, todas iguales, con olor a IA."*

Su respuesta es un mapa de 42 skills en 6 capas. Las láminas listan cada una con su nombre
exacto y una línea de función:

| Capa | Skills |
|---|---|
| **1 · Frontend y UI** (10) | `frontend-design` `ui-ux-pro-max` `refactoring-ui` `top-design` `web-typography` `taste-skill` `microinteractions` `ux-heuristics` `design-html` `canvas-design` |
| **2 · Imagen, gráficos y video** (8) | `gpt-image` `image` `image-enhancer` `brand-guidelines` `theme-factory` `excalidraw-diagram` `content-studio` `video` |
| **3-4 · Producto e interacción** (10) | `page-cro` `signup-flow-cro` `onboarding-cro` `form-cro` `popup-cro` `hooked-ux` `improve-retention` `design-everyday-things` `lean-ux` `ab-test-setup` |
| **5 · Comportamiento y prompts** (8) | `voice-jcb` `humanise-text` `copywriting` `copy-editing` `storybrand-messaging` `made-to-stick` `content-strategy` `social-content` |
| **6 · Confianza y evaluación** (6) | `review` `qa` `codex` `security-review` `verify-work` `ship` |

Dice explícitamente que no las inventó: son colecciones gratuitas que circulan más un par
propias. CTA: comentar `DISEÑO`.

## Veredicto: SIRVE YA — es el único de los 26 que ataca un problema ya documentado por nosotros

En la memoria de este proyecto está escrito hace tiempo que **mis diseños salen genéricos**,
y la regla que se sacó de ahí fue "cargar `impeccable` + galería interna antes de codear".
Este carrusel dice lo mismo pero con una tesis más útil: el problema no se arregla con una
skill, se arregla con **capas** — visual, producto, texto, verificación.

Lo hice verificable en vez de creerle. Crucé las 42 contra lo que está instalado acá:

- **Instaladas con el mismo nombre (12):** `ui-ux-pro-max` `design-html` `image` `video`
  `copywriting` `copy-editing` `content-strategy` `review` `qa` `codex` `security-review` `ship`
- **Instaladas con otro nombre (≈12):** `frontend-design` `canvas-design` `brand-guidelines`
  `theme-factory` (vienen por plugin) · `taste-skill`→`taste-design` · `page-cro`→`cro` ·
  `signup-flow-cro`→`signup` · `onboarding-cro`→`onboarding` · `popup-cro`→`popups` ·
  `ab-test-setup`→`ab-testing` · `social-content`→`social` · `verify-work`→`verification-loop`
- **Ausentes de verdad (≈18):** `refactoring-ui` `top-design` `web-typography`
  `microinteractions` `ux-heuristics` `gpt-image` `image-enhancer` `excalidraw-diagram`
  `content-studio` `form-cro` `hooked-ux` `improve-retention` `design-everyday-things`
  `lean-ux` `voice-jcb` `humanise-text` `storybrand-messaging` `made-to-stick`

El dato que importa: **de las 18 ausentes, cinco son justo la capa visual**
(`refactoring-ui`, `web-typography`, `microinteractions`, `ux-heuristics`, `top-design`).
Es decir, la capa que falta es exactamente la del problema que ya teníamos anotado.

## Para qué nos sirve

| Frente | Acción concreta |
|---|---|
| web-factory | Instalar y probar las 5 de capa visual que faltan, en UNA landing real, y comparar contra el resultado sin ellas. Si no mejora, se desinstalan |
| onia-plattform | `form-cro`, `hooked-ux` e `improve-retention` apuntan al producto, no a la web. Evaluar después de la capa visual |
| propuestas / marketing | `storybrand-messaging` y `made-to-stick` son de mensaje, y las propuestas ya tienen reglas propias de valor. Solo si no chocan con `onia-propuestas` |

## Riesgo

Instalar 18 skills de golpe. Más skills no es mejor diseño: es más contexto compitiendo y
más chance de que se ignoren entre sí. **Se instalan las 5 visuales, se prueban contra un
caso real, y recién ahí se decide el resto.**

Y a verificar antes de instalar nada: de dónde sale cada colección y con qué licencia. El
autor dice que son gratis y que da la fuente al comentar — no se instala un repo de terceros
a ciegas en el entorno que toca el código de clientes.
