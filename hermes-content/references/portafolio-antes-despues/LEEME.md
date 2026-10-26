# Portafolio antes/después — estado real (2026-08-15)

Tarea: 3 piezas verticales antes/después de **webs de cliente ya entregadas**, formato P02
del manual (`hermes-content/docs/ONIA_MANUAL_DE_FORMATOS_20260813.md`, Bloque A, ~línea 114),
mismo criterio del ejemplar `hermes-content/references/video-intake/2026-08-09-web-antes-despues-find-real-estate.md`.

## Hallazgo primero: no hay 3 webs de cliente entregadas. Hay CERO.

Verificado antes de producir nada (`web-factory/data/clients/`, `web-factory/apps/*`,
`COORDINATION_MANIFEST.md`, grep de "bolivian electric" y de dominios propios):

- `web-factory/data/clients/` solo tiene **verticales demo internas** (`clinic-demo`,
  `dashboard-demo`, `dental-demo`, `engineering-demo`, `restaurant-demo`, `saas-demo`,
  `skincare-demo`, `demo`). Cada `*.context.md` dice literalmente **"DEMO INTERNA"**,
  con WhatsApp placeholder (`+59170000000`), nombre de negocio ficticio (ej. "Clínica
  Dental Aura (demo)") y una sección **"Pendientes antes de entrega (cliente real)"**
  que sigue sin marcar. Usar cualquiera de estas como "Cliente: X" habría sido
  inventar un cliente — prohibido explícito de la tarea.
- El único sitio real, en producción, que no es demo es **Nuvia** — pero es
  **negocio propio de Onia** (Sergio+Arthur 50/50, `nuvia-store.vercel.app`), no un
  cliente que nos contrató. Fuente: memoria `web-factory-nuvia-architecture`,
  `hermes-content/docs/ONIA_NUVIA_DOMINIO_PROPIO_20260706.md`,
  `hermes-content/docs/historial/research/ONIA_LLUVIA_IDEAS_SERGIO_ARTHUR_20260801.md` línea 236.
  `dentalgest-landing` y `onia-platform` son, del mismo modo, productos propios de
  Onia, no webs de un cliente externo.
- `PRICING_RATIONALE_INTERNO.md` §0 lo dice con esas palabras: **"fase sin portafolio"**
  (2026-07-03). Seis semanas después el estado no cambió: no hay ningún caso de cliente
  para mostrar. La premisa del prompt A1 ("las webs ya existen") era incorrecta.

**Decisión:** no fabricar 3 piezas con nombres inventados. Se produjo **1 pieza real**,
con Nuvia, **rotulada explícitamente como proyecto propio de Onia, no cliente** — sirve
para validar que la receta técnica del manual funciona de punta a punta (nunca se había
corrido; el propio manual marca `capture-web.mjs` como "no existe todavía", §7). Las
otras 2 piezas **no se produjeron** porque no hay 2 clientes reales más que mostrar.

## Entregable

| Archivo | Resultado | De qué es |
|---|---|---|
| `final/nuvia-antes-despues.mp4` | Renderizado, 1080×1920, 30fps, 8,0 s, H.264, **sin audio** | **Nuvia — proyecto propio de Onia (ecommerce skincare), NO es un cliente.** No cuenta como caso para la línea premium (2.000/4.500); es prueba de pipeline, no prueba de entrega a cliente. |

Cobertura real: **1 de 3** piezas pedidas. 0 de 3 son de un cliente externo porque
ninguno existe entregado hoy en el repo.

## Cómo se hizo (receta P02 del manual, seguida al pie de la letra)

1. **Después:** captura full-page de `https://nuvia-store.vercel.app/nuvia` (viewport
   1440×900, scroll en pasos de 600px para despertar imágenes lazy, `fixed`/`sticky`
   → `static`). `renders/despues.png` (1444×4554).
2. **Antes:** misma captura, mismo DOM, con CSS inyectado
   (`filter: grayscale(1)` global + `img/video/picture/svg` lavados a bloque casi blanco
   vía `contrast(0.06) brightness(2.15)` + tipografía del sistema) → **mismo layout por
   construcción**, exactamente como pide el manual. `renders/antes.png` (1440×4484).
3. Rótulos con `make-mockup.mjs --template quote` (única palabra que cambia: `ANTES` →
   `DESPUÉS`), texto adaptado a la verdad ("Nuvia: ecommerce propio de Onia", no
   "Cliente: necesito una web de X" — porque no hay cliente).
4. `px_por_segundo` por la fórmula del manual: antes 2,0 s a 200 px/s (fijo, como indica
   la receta) · después 6,0 s a 386,3 px/s calculado — **no** los 4,5 s/12 s del ejemplar
   original, porque esos números eran del alto de página de FIND real estate, no de
   Nuvia; usar los literales habría violado la regla dura "el antes no pasa de un
   cuarto del video" (con esta página, 4,5 s hubiera sido 43% del total). Con 2,0/6,0 s
   el antes queda en el 25% exacto (ratio 1:3) y el después cae dentro de la velocidad
   sana (300-600 px/s).
5. ffmpeg `crop` con el filtro exacto del manual + corte seco por `concat -c copy`.

**Ajuste técnico necesario, no estaba en el manual:** `make-mockup.mjs` emite el rótulo
a **2x** a propósito (nítido al escalar, ver el propio script línea 448). El
`filter_complex` del manual superpone el rótulo sin escalarlo — a 2x se sale del
lienzo. Se agregó `scale=900:-1` antes del `overlay` final. Vale para toda pieza P02
futura.

## Lo que falta y no se resolvió acá (fuera del alcance de esta tarea)

- **`scripts/capture-web.mjs` sigue sin existir en el repo.** Esta tarea solo puede
  escribir dentro de `hermes-content/references/portafolio-antes-despues/**`, así que
  el script de captura usado es un temporal fuera del repo (scratchpad de la sesión).
  Alguien del carril de contenido (H) tiene que escribirlo de verdad en `scripts/`
  siguiendo `ONIA_MANUAL_DE_FORMATOS_20260813.md` §7 (~50 líneas, ya probado acá que
  la lógica funciona) para que quede reusable sin repetir este trabajo.
- **Sin música.** La receta del manual no trae paso de audio (igual que P03/P12); se
  publica muda y la música se agrega en la plataforma al momento de subir (biblioteca
  con licencia de TikTok/IG), no se sale a buscar una pista acá.
- **Cero créditos gastados** (captura de pantalla + ffmpeg, como pedía la tarea).

## Lo que depende de Sergio

- Elegir y cerrar la entrega de **al menos 1 cliente real** (Landing o Web Pro) para
  poder correr esta misma receta y producir la primera pieza que sí cuenta para subir
  de 790/1.500 a la línea premium (2.000/4.500). Sin eso, este formato no puede avanzar
  más — no es un bloqueo técnico, es que no hay material.
- Decidir si vale la pena publicar la pieza de Nuvia como contenido de "cómo construimos"
  (sería honesto: es real, es de Onia) o dejarla solo como prueba de pipeline sin publicar.
  Por regla del repo, nada de esto se publica sin aprobación explícita de Sergio.
