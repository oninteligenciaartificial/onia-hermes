# Handoff — carril CANARIO VISUAL

Estado del carril que abre y MIRA las pantallas de cliente. Un archivo por carril, sin fecha:
esto es lo vigente. Las fotos de cada día van a `hermes-content/docs/historial/canario-visual/`.

---

## Objetivo

Pasar la lista de 10 pantallas de `scripts/canario_visual.mjs`, mirar cada captura, y convertir
toda diferencia en ítem con evidencia en la cola del carril dueño.

## Qué quedó en producción

**Nada.** Este carril no despliega: mide y escribe ítems. Las 10 pantallas siguen como estaban.

**Corrida del 2026-09-02 16:41 UTC — las 10 abrieron con status 200. UN ítem rojo nuevo:
el widget de chat de `/chatbot` responde 429 y dejó de cargar.** La página cayó de 2.231 KB
(medidos a las 10:41 UTC, misma jornada, con el widget vivo) a **449 KB**: son ~1,8 MB del bundle
que ya no bajan. **La ventana de rotura es angosta y conocida: entre las 10:41 y las 16:41 UTC
del 2026-09-02** — quien lo arregle sabe exactamente qué mirar. Tres `curl` planos al endpoint
confirman el 429 fuera del navegador. Ítem con evidencia en `COLA.md`.
Detalle: una caída de peso **no dispara umbral** (sólo se comparan subidas > +40 %); se encontró
mirando. Las otras nueve, sin novedad.

**Corrida del 2026-09-02 10:41 UTC — las 10 abrieron con status 200, cero disparos mecánicos.**

| pantalla | peso | ms | mirada |
|---|---|---|---|
| home | 2857 KB | 349 | ⚠️ captura ciega (ver abajo) |
| precios | 2108 KB | 288 | OK |
| empezar | 2253 KB | 133 | OK |
| rubros | 2588 KB | 83 | ⚠️ captura ciega |
| chatbot-landing | 2231 KB | 103 | OK |
| contacto | 324 KB | 136 | ⚠️ captura ciega (banda verde vacía) |
| register | 705 KB | 91 | OK |
| login-plataforma | 699 KB | 91 | OK |
| login-chat | 3500 KB | 824 | OK |
| panel-chatbot | 702 KB | 92 | **no medida** — redirige a `/login`, sin sesión |

**`panel-chatbot` no está verde: está sin mirar.** Sin sesión no se puede afirmar otra cosa.

### Dos verificaciones que la máquina no hace y esta vuelta sí

1. **Los precios de `/precios` coinciden con la fuente de verdad.** Comparado contra
   `onia-platform/lib/subscription-plans.ts` (`DEFAULT_PLAN_AMOUNTS`) y `onia-platform/lib/pricing.ts`:
   Básico 320/mes · 89/sem · 3.200/año ✓, Pro 750 · 199 · 7.500 ✓, Full 1.500 · 15.000 ✓,
   chatbot add-on **Bs 390/mes** ✓ (`WHATSAPP_ADDON.entryMonthly`). Sin contradicción.
   Es el fallo mejor documentado del proyecto (cuatro precios vivos del mismo chatbot): hoy, sano.
2. **Los iconos se ven como iconos, no como su nombre**, en `register`, `login-plataforma` y
   `login-chat` — el bug que originó este carril. Sano.

## Qué quedó a medias, y dónde

**El instrumento quedó ciego en las páginas con scroll-driven / sticky, y las baselines de esas
páginas ya no sirven para comparar.**

- **Síntoma.** La captura `fullPage` de `home`, `rubros`, `precios` y `contacto` devuelve las
  secciones de abajo como **bandas de color vacías**. En `home` salen en blanco las tarjetas de
  precios, la banda de add-ons (Bs 390), las FAQ y el CTA final. En `rubros` sale vacía casi toda
  la página **y el header queda pisando el hero** — firma clásica de `position: sticky` bajo
  `fullPage`.
- **El sitio está SANO — esto es un defecto MÍO, no de la web.** Verificado, no supuesto:
  - Sondeo del DOM: las 11 secciones de la home existen, con `opacity: 1`, `visibility: visible`
    y altura real (la de precios mide 1232 px, las FAQ 1035 px). Los textos `320`, `750`,
    `1.500`, `390`, `permanencia`, `preguntan` y `Sin tarjeta` están todos en `body.innerText`.
  - Capturas de **viewport** (lo que ve un humano) a la altura de cada sección: renderizan
    perfecto. Evidencia: `hermes-content/docs/historial/canario-visual/2026-09-02-home-precios-viewport-OK.png`
    — las tres tarjetas de precio, completas y legibles.
  - Comparar con `hermes-content/docs/historial/canario-visual/2026-09-02-home.png` (la misma
    página, misma corrida, `fullPage`): esas tarjetas no están.
- **Por qué importa.** La home y `/rubros` son las dos pantallas que más acercan la venta, y el
  canario ya no puede ver la mitad de abajo de ninguna. Un icono roto o una promesa falsa en la
  banda de precios pasaría **verde para siempre**. Es exactamente el fallo que este carril existe
  para no cometer, ahora del lado del que mide.
- **Intento fallido — no repetirlo.** El arreglo obvio ("scrollear toda la página antes de
  capturar") **ya está implementado** en `scripts/canario_visual.mjs:169-178` y **no alcanza**:
  recorre la página, vuelve a `scrollTo(0, 0)` y recién ahí captura. `fullPage` redimensiona el
  viewport internamente y las secciones atadas al scroll se vuelven a pintar en su estado
  "todavía no llegué". Agregar más `waitForTimeout` no lo va a resolver.
- **Camino que parece correcto (sin implementar, no lo di por bueno).** Capturar por
  **viewport y coser** (scroll de a `innerHeight`, un `screenshot` por tramo, concatenar) en vez
  de un `fullPage`. Es el método que sí funcionó en el sondeo de esta vuelta. Cambia el formato de
  las baselines, así que hay que rehacer las de las 4 páginas afectadas **después** de que el
  método nuevo esté verde — no antes.

**Las baselines NO se actualizaron a propósito.** Pisarlas con un instrumento que se sabe ciego
es la única forma de romper este carril: dejaría el verde falso grabado como punto de partida.

## Archivos

- `scripts/canario_visual.mjs` — la herramienta y la lista `PANTALLAS` (fuente única).
  El scroll previo insuficiente está en las líneas 169-178; la captura, en la 181.
- `hermes-content/references/canario-visual/<pantalla>/baseline.{png,json}` — sin tocar.
- `hermes-content/docs/historial/canario-visual/2026-09-02-*.png` — evidencia de esta vuelta.

## Qué depende de Sergio

Nada nuevo. La línea de "las pantallas de `onia.com.bo` no tienen dueño" ya está en el radar
(`ONIA_RADAR_DECISIONES_PRODUCTO.md`, línea 629 y siguientes) desde el 2026-09-01: **no se repite**.

## Próximos pasos

1. Reemplazar el `fullPage` por captura cosida por viewport en `scripts/canario_visual.mjs`, y
   correr `node scripts/canario_visual.mjs --self-check` (13 casos) antes de dar nada por bueno.
2. Con el método nuevo verde, **rehacer** las baselines de `home`, `rubros`, `precios` y
   `contacto`, y decir en esa vuelta que son baselines nuevas — una baseline nueva no es una
   verificación, es el punto de partida de la próxima.
3. `panel-chatbot` sigue sin poder mirarse sin sesión. Mientras siga así, se reporta **no medida**
   todas las vueltas; no se lo cuenta como verde.
