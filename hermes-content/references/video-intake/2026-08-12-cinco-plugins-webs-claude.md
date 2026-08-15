# 5 plugins para hacer webs con Claude — 4 de los 5 ya están instalados acá

- **Fuente:** https://www.instagram.com/reel/Dby5fKZvglj/ · 106.7 s · con voz (español)
- **Visto:** 2026-08-12 (Gemini nativo + Whisper)
- **Archivo:** `Instagram-Dby5fKZvglj.mp4` (no versionado)
- **Lectura completa + transcripción literal:** [transcripciones/2026-08-12-Instagram-Dby5fKZvglj.md](transcripciones/2026-08-12-Instagram-Dby5fKZvglj.md)

## Qué dice realmente

Talking-head en español, formato partido: el presentador abajo, la pantalla compartida arriba.
Rótulo de apertura: *"5 plugins para crear webs increíbles con Claude 🤔"*. Enumera cinco
herramientas, todas presentadas como gratuitas y de código abierto:

1. **[00:03-00:16] Taste Skill** — *"The Anti-Slop Frontend Framework for AI Agents"*. Repositorio
   con sub-habilidades para que Claude se aleje del diseño genérico. Afirma **"más de 70.000
   estrellas en GitHub"** — sin fuente en pantalla, **a verificar, no repetir**.
2. **[00:16-00:34] Impecable** — *"el vocabulario de diseño que falta para los agentes"*. Dice que
   incluye un `design.md` **basado en el sistema Stitch de Google** (a verificar) y *"un editor de
   video que podés usar directamente en tu navegador"*. Lo que Gemini describe en pantalla es una
   **demostración de edición en el navegador**, no de video: probable error de dicción o de
   transcripción, **a verificar antes de repetirlo**.
3. **[00:34-01:00] Playwright CLI** — su tesis es que no sirve solo para automatizar navegadores
   sino para **probar el front-end**: conectarlo a Claude Code y que abra *"3, 5 o hasta 10
   navegadores al mismo tiempo"* para testear un formulario. Lo dice; no lo muestra corriendo.
4. **[01:00-01:29] Awesome DESIGN.md / getdesign.md** — lista de archivos `design.md` extraídos de
   sitios reales. **Es lo único concreto que se ve en pantalla:** mete Binance y devuelve el
   análisis de su design system (paleta, tipografías, botones) en bloques separados. Su argumento:
   *"no estás copiando la página tal cual, estás obteniendo los bloques por separado"*.
5. **[01:29-01:41] img2threejs** — de una foto (una bicicleta BMX) genera un renderizado 3D por
   código.

Cierre: *"comentá PLUGIN y te las paso"* (rótulo en pantalla `Comenta 'PLUGIN'`).

**Nota de lectura:** Whisper escribe "Cloud" por Claude, "AIS-Lob" por *AI slop*, "de sign.md" por
`design.md` y *"comentad plus y ni te las paso"* por *"comentá PLUGIN y te las paso"*. El texto en
pantalla manda sobre el audio.

## Veredicto: HUMO

No porque las herramientas sean malas — porque **cuatro de las cinco ya están instaladas en este
repo**, y el video no aporta ni una técnica ni una configuración que no tengamos:

| Lo que nombra el video | Qué hay hoy acá |
|---|---|
| Taste Skill | skill `taste-design` instalada (el mapeo de nombre ya está escrito en [42 skills](2026-08-11-mapa-42-skills-diseno-claude.md)) |
| Impecable | skill `impeccable` instalada — y cargarla antes de codear UI **ya es regla del proyecto** |
| Playwright CLI | Playwright ya es dependencia del repo (`web-factory/playwright.config.ts` + `playwright.next.config.ts`, gate `pnpm e2e`), más las skills `e2e`, `e2e-testing`, `webapp-testing` y el browser MCP |
| Awesome DESIGN.md / getdesign.md | skills `design-md`, `design-dna` y `stitch-extract-design-md` instaladas |
| img2threejs | **no lo tenemos** — y no hay caso de uso: la web 3D ya quedó archivada como `FUTURO` en [web 3D scrollytelling](2026-08-11-web-3d-scrollytelling-united-carriers.md) |

Cae limpio en el filtro §5 de la [síntesis](SINTESIS_CORPUS.md): *roundup de herramientas que
duplican lo instalado → `HUMO`*. Y es la pieza n.º 21 con CTA palabra clave→DM, patrón catalogado
desde el 9-ago.

El detalle que lo vuelve un espejo y no una fuente: el video recomienda **`impeccable`** como la
cura del diseño genérico de la IA. Acá `impeccable` está instalada **y es obligatoria por regla**,
y la memoria del proyecto sigue anotando que los diseños salen genéricos. El problema no es que
falte la herramienta: es que no se usa. Exactamente el §1 del corpus — **el cuello de botella es
ejecución, no información**.

## Para qué nos sirve

| Frente | Acción concreta |
|---|---|
| web-factory | **Ninguna acción nueva.** La tarea abierta sigue siendo la de [42 skills](2026-08-11-mapa-42-skills-diseno-claude.md): instalar las 5 skills de capa visual que faltan y probarlas en UNA landing real. Este video no la mueve |
| web-factory (verificación barata, opcional) | Mirar `getdesign.md` **solo** como catálogo de vocabulario de tokens si hace falta comparar. Verificar autor y licencia antes de bajar nada |
| Marketing con IA | Nada. CTA palabra clave, ya es ruido y sigue gateado por el token de Instagram (S6) |

## Riesgo

**El riesgo real es el punto 4.** Extraer el design system de una marca ajena (Binance en el video)
y llevarlo a la web de un cliente no deja de ser la identidad visual de otro por venir "en bloques
separados": es riesgo de marca y choca de frente con la regla 8 del CLAUDE.md — un design system
ajeno es una plantilla con otro nombre.

Segundo riesgo, ya escrito en la ficha de 42 skills y vigente igual acá: no se instalan cinco
repositorios de terceros en el entorno que toca código de clientes por un reel de 106 s, sin autor
ni licencia verificados. Ninguna de las cinco herramientas se probó al escribir esta ficha.
