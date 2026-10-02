# Reglas UI de Onia · v2

29-sep-2026, para Sergio Urcullo. Junta las 32 reglas de `REGLAS_UI_ONIA.md` (v1) con lo que
enseñan los expertos de `EXPERTOS_UI.md`. Quedaron **40 reglas en 9 grupos** y un **checklist de
12 puntos**. No toqué ningún repo.

**Marcas**
- **[NUEVA]**: sale de los expertos, no estaba en v1.
- **[AMPLIADA]**: regla de v1 con algo agregado.
- **[v1]**: igual que v1. Acá queda resumida; las capturas de evidencia siguen en v1.

Las abreviaturas de rutas (`P/`, `H/`, `UP/`, `VI/`, `DS/`) y los tipos de gate (**AUTO**,
**RATCHET**, **MIRAR**) son los mismos de v1. Ningún gate necesita instalar nada.

## La idea que ordena todo

> **Simplicidad no es minimalismo: cada elemento se gana su lugar.** (Apple, WWDC26)

Sergio Urcullo pidió que la web esté "aprovechada al 100%". Eso **no** significa llenar cada
hueco. Significa que cada espacio tiene un trabajo: mostrar el dato que decide o la acción que
toca. Un espacio que no tiene trabajo queda como aire. Un espacio ocupado por texto de relleno o
una tarjeta repetida está desperdiciado, aunque esté lleno. Refactoring UI lo dice así: "no hace
falta llenar toda la pantalla".

---

## A. Qué va en la pantalla

**R1 [AMPLIADA] Cada pantalla tiene UN trabajo, escrito en una frase antes de diseñarla. El Inicio responde tres preguntas: qué tengo hoy, cuánta plata, qué me toca decidir.**
- **Fuente:** v1 R1; Schoger, "Start with a feature, not a layout" (https://refactoringui.com); Saarinen, "reducir el alcance para subir la calidad" (https://www.figma.com/blog/karri-saarinens-10-rules-for-crafting-products-that-stand-out/).
- **Bien:** Pendientes = "decidir lo que prepararon los agentes". Se ve la propuesta y "Aprobar", nada más.
- **Mal:** el Inicio usa ~12 líneas para mostrar 2 cifras (`revision-1.0/b-dashboard-375.png`).
- **Gate:** MIRAR. La frase va en el PR. Si no entra en una línea, la pantalla hace dos cosas.

**R2 [NUEVA, absorbe v1 R4] Prueba de borrado: por cada elemento, ¿qué decisión o acción se pierde si lo quito? Si la respuesta es "ninguna", se va o se muda a donde vive. Un dato se muestra en un solo lugar.**
- **Fuente:** Apple WWDC26, Simplicity: "every element should earn its place" (https://developer.apple.com/videos/play/wwdc2026/250/); Rams, "menos, pero mejor" (https://www.vitsoe.com/us/about/good-design); Nielsen, heurística 8 (https://www.nngroup.com/articles/ten-usability-heuristics/).
- **Bien:** "Completada" como texto quieto con un punto. "Facturas abiertas" desaparece si está en 0.
- **Mal:** el título repetido en "Pedido por… · Recall: Lucía Mendoza — …" (`revision-1.0/d-pending.png`).
- **Gate:** MIRAR (checklist, punto 5).

**R3 [v1] Una sola hoja protagonista (raised) por pantalla.** Fuente: ley de Von Restorff (https://lawsofux.com/von-restorff-effect/).
- **Gate:** AUTO. `[data-surface="raised"]` visibles ≤ 1.

**R4 [AMPLIADA] Un solo botón primario por pantalla. Lo secundario se BAJA a texto o contorno; no se agranda lo primario. En celular, el primario va fijo en la zona del pulgar.**
- **Fuente:** v1 R3; Schoger, "De-emphasize to emphasize"; leyes de Hick y Fitts (https://lawsofux.com/hicks-law/); Wroblewski, "Obvious Always Wins" (https://www.lukew.com/ff/entry.asp?1945).
- **Bien:** "Nueva venta" sólido y fijo abajo. "Hacer corte" y "Ver inventario" como texto.
- **Mal:** los tres con el mismo peso (`pulido-final/5-comercio-panel-375.png`).
- **Gate:** AUTO. `[data-variant="primary"]` visibles ≤ 1 a 375 px.

**R5 [AMPLIADA] El espacio libre se llena con UN gráfico protagonista o se deja como aire. Nunca con más tarjetas.**
- **Fuente:** v1 R5; Schoger, "You don't have to fill the whole screen".
- **Bien:** una cifra grande con una barra de borde a borde y Hoy/7/30.
- **Mal:** 5 KPIs idénticos en Bs 0,00 (`revision-1.0/h-comercio-caja.png`).
- **Gate:** MIRAR (squint, R39).

**R6 [v1] Todo número se puede tocar y lleva a su evidencia:** métrica → desglose → registro.
- **Gate:** AUTO. `href` obligatorio en el tipo de `KpiTile`.

**R7 [NUEVA] Divulgación progresiva en 2 niveles como máximo. Lo de todos los días está a la vista; lo raro está un toque más abajo ("¿Qué es?", "Más opciones"). Nunca hay un tercer nivel.**
- **Fuente:** NN/g, Progressive disclosure (https://www.nngroup.com/articles/progressive-disclosure/); Apple WWDC26, "common path first, advanced one level deeper"; Benji Taylor, bandejas de un solo tema (https://benji.org/family-values).
- **Bien:** la tarjeta del agente muestra nombre, interruptor y 2 cifras; "¿Qué hace?" abre la explicación. La ficha usa pestañas.
- **Mal:** un párrafo de 3 a 5 líneas por agente (`revision-1.0/c-agents.png`), o un menú dentro de un menú dentro de Configuración.
- **Gate:** MIRAR.

## B. Texto

**R8 [AMPLIADA] Se escribe para escanear. El subtítulo tiene 1 línea (≤ 70 caracteres), ningún párrafo pasa de 2 líneas y la cifra o el verbo van primero.**
- **Fuente:** v1 R7; Nielsen: la gente lee ~20% del texto (https://www.nngroup.com/articles/how-little-do-users-read/); Apple WWDC26, "avoid redundancy and get straight to the point".
- **Bien:** "Bs 3.860 por cobrar · 4 pacientes".
- **Mal:** "En esta sección vas a poder ver los montos que tus pacientes todavía…"; el subtítulo del add-on ocupa 9 líneas (`pulido-final/7-addon-titulo-zoom-375.png`).
- **Gate:** AUTO. A 375 px, cada `main p` ocupa ≤ 2 líneas, salvo `data-long-ok`.

**R9 [NUEVA] Las etiquetas son el último recurso. Los botones dicen verbo + objeto.**
- **Fuente:** Schoger, "Labels are a last resort"; Vercel WIG, "Avoid ambiguity" (https://github.com/vercel-labs/web-interface-guidelines); Apple WWDC26, "direct, specific labels".
- **Bien:** "Bs 3.860 por cobrar". Botones "Guardar cita", "Aprobar y enviar", "Cobrar Bs 120".
- **Mal:** "Monto por cobrar: Bs 3.860", "Estado: Completada", o botones sueltos "Continuar", "Aceptar", "Enviar".
- **Gate:** RATCHET. No puede subir la cantidad de `<button>` cuyo texto exacto sea `Continuar|Aceptar|Enviar|OK|Siguiente|Confirmar`.

**R10 [v1] Un aviso que se repite va una sola vez, como banner descartable arriba de la lista.**
- **Gate:** AUTO. Ningún texto de 30 caracteres o más aparece dos veces en `main`.

**R11 [AMPLIADA] Se usa el vocabulario del dueño y los formatos de Bolivia.**
- Tiempos relativos ("hace 2 h"), con la fecha completa en un tooltip.
- Montos con `es-BO` ("Bs 1.250,00").
- **Dentro de un mismo bloque, todos los montos llevan 0 decimales o todos llevan 2, nunca mezclados.**
- Cantidades con cifras ("3 pacientes") y el carácter "…" en lugar de tres puntos.
- Nada de "Recall", "Add-on", segundos ni códigos hex.
- **Fuente:** v1 R9; Vercel WIG, Content ("Locale-aware formats") y Copywriting ("Consistent currency formatting", "Use numerals for counts").
- **Gate:** AUTO. Las regex de v1, y además: en un mismo `[data-money-group]` todos los montos tienen la misma cantidad de decimales.

## C. Celular y tacto

**R12 [AMPLIADA] La barra inferior tiene 5 destinos como máximo, cada uno con ícono y texto, 48 dp o más, en una línea, respetando `env(safe-area-inset-bottom)`.**
- **Fuente:** v1 R11; Vercel WIG, "Respect safe areas"; Wroblewski, navegación táctil (https://www.lukew.com/ff/entry.asp?1649).
- **Gate:** AUTO. Test de `BottomNav` (v1) y un grep de `safe-area-inset-bottom` en su CSS.

**R13 [AMPLIADA] Ninguna barra fija tapa un botón ni el elemento con foco. Hay como máximo UNA capa flotante.**
- **Fuente:** v1 R12; Vercel WIG, "Sticky headers… never cover the focused element".
- **Gate:** AUTO. El test `elementFromPoint` de v1, y además el mismo test al navegar con Tab.

**R14 [AMPLIADA] Los blancos táctiles miden 44 px o más, con 8 px de separación, y no hay zonas muertas: lo que parece tocable es tocable. La etiqueta y el check forman un solo blanco.**
- **Fuente:** v1 R13; Vercel WIG, "Match visual & hit targets" y "No dead zones".
- **Gate:** AUTO. Altura ≥ 44 a 375 px (v1).

**R15 [AMPLIADA] Cada input tiene 16 px de letra o más en celular y el `type`/`inputmode`/`autocomplete` que le corresponde. Nunca se bloquea el pegado ni el zoom.**
- **Bien:** WhatsApp con `type="tel"` y monto con `inputmode="decimal"`.
- **Fuente:** v1 R14; Vercel WIG, Forms ("Correct types & input modes", "Don't block paste") e Interactions ("Respect zoom").
- **Gate:** AUTO. El tamaño de letra de v1. Además, `meta[name=viewport]` sin `user-scalable=no` ni `maximum-scale=1`, y los campos de teléfono con `type=tel`.

**R16 [v1] Cero scroll horizontal. Toda fila de botones hace wrap o se apila.**
- **Gate:** AUTO. `scrollWidth ≤ innerWidth` a 375 y 390 px.

**R17 [AMPLIADA] En celular, los formularios suben como hoja inferior (`<dialog>`).**
- Se cierra arrastrando y se puede interrumpir a mitad de camino.
- Sale por donde entró.
- El fondo se oscurece solo si la tarea bloquea todo lo demás.
- **Fuente:** v1 R16; Apple, "Designing Fluid Interfaces" (https://developer.apple.com/videos/play/wwdc2018/803/); Rauno, "Spatial consistency" (https://rauno.me/craft/interaction-design); Vaul, de Emil Kowalski.
- **Gate:** MIRAR y el RATCHET de v1 para modales centrados.

**R18 [v1] En celular, una tabla se vuelve lista de tarjetas de 2 líneas.** El estado lleva ícono + texto y el monto va con `tabular-nums`.
- **Gate:** AUTO parcial. `data-money` tiene `tabular-nums`.

**R19 [AMPLIADA] El celular no pierde trabajo.**
- Autoguardado del formulario a medio llenar.
- **Filtros y pestaña en la URL**, así Atrás los restaura junto con el scroll.
- **Aviso al salir si hay cambios sin guardar.**
- Los avisos abren la cita o el cobro exacto.
- **Fuente:** v1 R18; Vercel WIG, "URL as state", "Deep-link everything", "Scroll positions persist" y "Unsaved changes".
- **Gate:** AUTO. El e2e de recarga de v1, y además: filtrar Pendientes, recargar y encontrar el mismo filtro.

## D. Formularios y acciones

**R20 [NUEVA] Buen valor por defecto: el formulario llega prellenado con lo más probable (hoy, la próxima hora libre, el profesional de siempre, el plan actual, el monto calculado). El usuario corrige, no tipea.**
- **Fuente:** ley de Tesler, la complejidad la absorbe el sistema (https://lawsofux.com/teslers-law/); Nielsen, heurística 6 (reconocer antes que recordar).
- **Bien:** "Nueva cita" desde la ficha trae al paciente y la próxima hora libre. El checkout trae preseleccionado el plan actual.
- **Mal:** Caja con el método de pago sin elegir, aunque casi todos pagan con QR.
- **Gate:** AUTO. Un e2e abre "Nueva cita" desde una ficha y encuentra fecha = hoy y el paciente cargado.

**R21 [NUEVA, corrige v1 R21] "Guardar" no se deshabilita de antemano. Se deja tocar, los faltantes se marcan junto a su campo y el foco va al primero. Solo se deshabilita mientras envía.**
- **Fuente:** Vercel WIG, Forms ("Don't pre-disable submit", "Error placement", "Submission rule"); Nielsen, heurística 9.
- **Bien:** en el checkout, se toca "Enviar comprobante" sin captura y aparece "Falta la captura" bajo el campo, con el foco ahí.
- **Mal:** un botón gris que no dice por qué. Hoy el primario menta además se confunde con uno deshabilitado.
- **Excepción:** si el motivo no se resuelve dentro del formulario (por ejemplo, el plan venció), se deshabilita y se dice por qué en 1 línea, como pedía v1.
- **Gate:** AUTO. Un e2e envía el formulario vacío y comprueba que `document.activeElement` es el primer campo inválido y que su error se ve.

**R22 [NUEVA] Deshacer antes que confirmar. Lo reversible se aplica al tocar y muestra un toast "Deshacer" durante 5 s. El diálogo de confirmación queda solo para lo irreversible: borrar un paciente, cerrar la caja, anular una factura.**
- **Fuente:** Apple WWDC26, Agency ("easy undo… confirmation only for destructive, used sparingly"); Vercel WIG, "Optimistic updates" y "Confirm destructive actions"; Nielsen, heurística 3.
- **Bien:** "Descartar" una propuesta la saca de la lista y ofrece "Deshacer".
- **Mal:** `confirm("¿Seguro?")` para descartar un borrador.
- **Ojo:** "Aprobar y enviar" con ventana de deshacer exige un envío diferido en la cola. Si no existe, esta regla aplica solo a Descartar. **Lo decide Sergio Urcullo**, porque cambia cuándo sale el WhatsApp.
- **Gate:** AUTO. `grep -rn "window.confirm\|[^.]confirm(" app components` = 0. RATCHET sobre los usos de `ConfirmDialog`.

## E. Componentes

**R23 [v1] Toda superficie sale de `components/ui/card.tsx`** (flat/raised/inset).
- **Gate:** RATCHET de tarjetas hechas a mano (`rounded-(xl|2xl|3xl)…border`).

**R24 [v1] Todo input pasa por `components/ui/Field.tsx`:** label, control y error, 44 px.
- **Gate:** RATCHET `const inputClass` ≤ 28.

**R25 [AMPLIADA] Hay un solo botón, `button.tsx`, con 3 estados.**
- Estados: reposo → "Guardando…" (conserva la etiqueta, suma un spinner y termina en "…") → resultado.
- **Responde al apoyar el dedo:** `:active { transform: scale(0.97) }` en 100-160 ms.
- El primario es sólido y oscuro, con texto blanco.
- **Fuente:** v1 R21; Emil Kowalski, "Buttons must feel responsive" (https://emilkowal.ski/ui/great-animations); Apple WWDC18, respuesta en pointer-down; Vercel WIG, "Loading buttons".
- **Gate:** RATCHET de `<button className=` (v1). AUTO: un test de render confirma que en `loading` el texto sigue presente y que la clase `active:scale-[0.97]` existe.

**R26 [AMPLIADA, absorbe v1 R10] El `KpiTile` sigue una estructura fija.**
- Etiqueta mono chica y valor grande.
- Delta con signo y forma, con un modo invertido para lo que es malo que suba.
- Cabecera en grilla de 2×2 y plegado por `@container`.
- La frase narrativa sale del **mismo** cálculo que el delta ("Cobraste Bs 380 más que el jueves pasado").
- **Gate:** AUTO. Test de render (el signo "−" aparece en el DOM) y test unitario de `{delta, frase}`.

## F. Color, tipografía y detalle

**R27 [v1] El verde señal `#00D26A` va solo en formas y en CTAs con texto oscuro.** Como texto se usa verde-700 `#016141`. En el panel, el verde es para "ganaste", nunca para el cromo.
- **Gate:** AUTO (R28).

**R28 [AMPLIADA] Todo texto pasa AA en claro y en oscuro. Los estados hover/active/focus SUBEN el contraste. Un estado nunca se comunica solo con color.**
- **Fuente:** v1 R24; Vercel WIG, Design ("Interactions increase contrast") y Content ("Redundant status cues"); Schoger, "Don't rely on color alone".
- **Gate:** AUTO. Luminancia en Playwright, en ambos temas (v1).

**R29 [AMPLIADA] Hay dos familias (Archivo y Geist Mono) y la jerarquía se arma con peso + tamaño + color, no solo con tamaño.**
- El tracking cambia con el tamaño: −0,02em en cifras y títulos grandes, 0 en el cuerpo.
- El interlineado va al revés: 1,05-1,2 en lo grande, 1,5 en el cuerpo.
- Lo secundario se aquieta con color, no achicándolo a 10 px.
- **Fuente:** v1 R25; Apple, "The details of UI typography" (https://developer.apple.com/videos/play/wwdc2020/10175/); Schoger, "Size isn't everything".
- **Gate:** AUTO. `h1` y `[data-kpi-value]` con `letter-spacing ≤ 0`. Ningún texto visible (en `main` y en las barras fijas) por debajo de 12 px a 375 px. Hoy fallarían las etiquetas `text-[10px]` de `BottomNav` (`P/components/layout/BottomNav.tsx:78,92`, según v1 R11).

**R30 [v1] La tinta de los datos usa `--chart-1..n`.** Nunca se usan varios verdes para distinguir categorías.
- **Gate:** RATCHET.

**R31 [NUEVA] Oficio en el detalle.**
- Radios concéntricos: el de adentro nunca supera al de afuera.
- Todo se alinea con algo.
- Los íconos tienen un solo trazo y un solo tamaño por contexto.
- `theme-color` y `color-scheme` coinciden con el fondo en los dos temas.
- **Fuente:** Vercel WIG, Design ("Nested radii", "Browser UI matches your background") y Layout ("Deliberate alignment", "Balance contrast in lockups"); Apple WWDC26, Craft ("nothing is random").
- **Bien:** una tarjeta de 16 px con un chip de 8 px adentro. La barra del navegador del celular se ve del mismo color que el header.
- **Mal:** un chip de 12 px dentro de una tarjeta de 8 px, o íconos rellenos mezclados con íconos de línea en la misma fila.
- **Gate:** AUTO. `meta[name=theme-color]` existe y coincide con `--background` en ambos temas. El resto es MIRAR.

## G. Movimiento

**R32 [AMPLIADA] La frecuencia decide si algo se anima.**
- **Lo que se hace cientos de veces al día no se anima:** cambiar de pestaña, abrir Agenda, tipear en Caja.
- Lo ocasional (una hoja, un toast, un cambio de estado) se anima corto.
- El deleite queda para lo raro: la primera venta, el plan activado, el primer paciente que volvió.
- Solo `transform`, `opacity` o `clip-path`. Sin rebote en UI ni loops ociosos.
- Nada se levanta en hover, y el hover solo existe bajo `@media (hover: hover)`.
- **Fuente:** v1 R27; Emil Kowalski, marco de decisión de animación (`C:/Users/PC/.claude/skills/emil-design-eng/SKILL.md`); Rauno, "Frequency & novelty"; Benji Taylor, curva deleite-frecuencia; Vercel WIG, "Necessity check" y "Never `transition: all`".
- **Gate:** RATCHET. `transition-all` ≤ 216 y bajando, 0 `hover:-translate-y` y 0 `hover:scale` (v1).

**R33 [NUEVA] Los tiempos y las curvas son fijos.**
- Toque: 100-160 ms. Tooltip: 125-200 ms. Menú: 150-250 ms. Hoja: 200-300 ms (máximo 500). **Toda animación de UI dura menos de 300 ms.**
- Para entrar se usa `--ease-out` (la curva de Onia `cubic-bezier(0.16,1,0.3,1)`), para moverse ease-in-out y **nunca ease-in**.
- **Nunca se aparece desde `scale(0)`:** se parte de 0,95 con opacidad.
- Los menús crecen desde su botón (`transform-origin`).
- La salida es más corta que la entrada.
- **Fuente:** Emil Kowalski (https://emilkowal.ski/ui/great-animations); Apple WWDC18, consistencia espacial; Vercel WIG, "Correct transform origin".
- **Gate:** RATCHET. En `app/(dashboard)` y `components` no pueden subir `duration-(500|700|1000)`, `ease-in` sin `-out`, ni `scale-0`. AUTO: los tokens `--dur-*` y `--ease-*` existen en `globals.css`.

**R34 [AMPLIADA] En reduced-motion, los desplazamientos pasan a un fundido corto: el feedback no se apaga.**
- Se usa `transition: none`, nunca `0.01ms`.
- En `<dialog>` o popover, `display` va solo en el estado abierto.
- **Fuente:** v1 R28; skill `apple-design` §14 (https://github.com/emilkowalski/skills).
- **Gate:** AUTO. `grep "0.01ms"` = 0.

## H. Estados y tiempos de respuesta

**R35 [AMPLIADA] Nunca "No hay datos".**
- El estado vacío lleva una ilustración chica o un ícono, 1 frase que dice cuándo se llena y 1 botón que lo llena.
- Si toda la grilla está en cero, se esconde y queda una sola acción.
- **La primera vez, una lista de arranque con avance ("2 de 5 listos").**
- **Fuente:** v1 R29; Schoger, "Don't overlook empty states"; efectos de gradiente de meta y Zeigarnik (https://lawsofux.com/goal-gradient-effect/).
- **Gate:** AUTO. `grep "No hay datos\|Sin datos"` = 0 y `EmptyState` exige la prop `action`.

**R36 [AMPLIADA] Carga y error, por sección.**
- **Se responde en menos de 400 ms.** Si no llega, aparece un skeleton con la forma exacta del contenido, **tras 150-300 ms y visible al menos 300-500 ms** para que no parpadee.
- Lo probable se muestra ya (actualización optimista).
- El error dice qué pasó y qué hacer, con "Reintentar". Error y vacío nunca aparecen juntos.
- **Fuente:** v1 R30; umbral de Doherty (https://lawsofux.com/doherty-threshold/); Vercel WIG, "Minimum loading-state duration", "Stable skeletons" y "Error messages guide the exit".
- **Gate:** AUTO. `loading.tsx` y `error.tsx` por sección (v1). RATCHET = 0 para "Ocurrió un error", "Error desconocido" y "Algo salió mal" sin botón al lado.

**R37 [NUEVA] Todo flujo termina en un final diseñado con el siguiente paso. Nunca en un toast que se va y deja la misma pantalla.**
- **Bien:**
  - Cita guardada → "Enviar recordatorio".
  - Venta cobrada → "Nueva venta".
  - Comprobante enviado → qué pasa ahora y cuándo, según el flujo real.
- **Fuente:** regla pico-final (https://lawsofux.com/peak-end-rule/); Apple WWDC26, feedback de "completion"; Vercel WIG, "No dead ends".
- **Gate:** AUTO. Un e2e de los 3 flujos críticos (cita, cobro, checkout) comprueba que, después de enviar, se ven un encabezado de éxito y un botón de siguiente paso.

## I. Ilustraciones, mockups y confianza

**R38 [NUEVA] Una ilustración o un mockup se usa cuando REEMPLAZA texto. Nunca de adorno.**
- **Panel:** ilustración solo en el vacío y en la primera vez, con un solo estilo (línea + 1 acento, ≤ 120 px de alto en celular). En las pantallas de trabajo, cero.
- **Web (onia.com.bo):** el mockup es UI **dibujada en código** (el panel de `ui.tsx`), con funciones que existen y datos de resultado: plata recuperada, paciente que volvió.
  - Cada mockup reemplaza un párrafo y muestra UN resultado.
  - Nunca una captura literal (decisión de Sergio Urcullo del 1-sep, en la memoria `landing-v3-aprobada-base-clara.md`).
  - Nunca una pantalla generada por IA ni una función que no existe (`H/CLAUDE.md`, "Producto visible o no sale").
- **Fuente:** Apple WWDC26, Simplicity ("is complex data better understood as a graphic?"); Refactoring UI, "Everything has an intended size".
- **Bien:** en Agentes, una línea de tiempo dibujada ("Detectó → Preparó → Esperó tu OK → Envió") en lugar del párrafo.
- **Mal:** un robot 3D decorativo sobre "Agentes", o una captura del panel real en la home.
- **Gate:** MIRAR. RATCHET: la cantidad de `<img` en `app/(dashboard)` (sin contar avatares y logos) no sube, y en el sitio hay 0 imágenes servidas desde carpetas `capturas/`.

**R39 [AMPLIADA] Squint test anti-IA antes de publicar, y diseño con opinión para la clínica, no para cualquiera.**
- Se revisan las 5 señales de v1: display en Inter o en una sola sans, hero centrado con gradiente, 3 o más tarjetas idénticas con iconito, acento de adorno, copy que le serviría a cualquier empresa.
- Si dos o más dan "sí", no se publica.
- **Fuente:** v1 R31; Saarinen, "design with strong opinions".
- **Gate:** MIRAR. RATCHET = 0 para `Sparkles`, `bg-clip-text` y `border-l-4 border-(green|emerald|teal)`.

**R40 [v1] La venta nunca exhibe obra, y el agente propone y espera.**
- Cero "muy pronto", "beta", "próximamente" o "en construcción".
- Cada propuesta dice "No se envía hasta que lo apruebes".
- Lo que "ganó" sale de datos reales.
- **Gate:** AUTO (v1).

---

## Checklist de 12 puntos para aprobar una pantalla

**Para el agente que revisa.** Abrí la captura a **375 px** y a **1440 px**, en claro y en oscuro.
Respondé cada punto con **Sí / No** y la evidencia: qué elemento es, dónde está y por qué. Los
puntos marcados con **(B)** bloquean: con un solo "No" en ellos, la pantalla no se aprueba. El
movimiento no se ve en una captura; va por los gates de R32-R34 y por un video en cámara lenta.

1. **(B) Trabajo claro.** ¿Se entiende en 3 segundos para qué es la pantalla? Escribilo en una frase. Si necesitás dos, marcá "No". (R1)
2. **(B) Una sola cosa destacada.** ¿Hay exactamente un botón primario y una hoja protagonista? Contalos. (R3, R4)
3. **Squint.** Mirando la captura desenfocada, ¿lo más visible es lo más importante? ¿Hay alguna grilla de tarjetas iguales? (R5, R39)
4. **(B) Texto.** ¿El subtítulo ocupa 1 línea y ningún párrafo pasa de 2? ¿Hay texto repetido, jerga ("Recall", "Add-on"), segundos o códigos hex? ¿Hay botones que dicen "Continuar" o "Aceptar"? (R8-R11)
5. **Borrado.** Señalá cada elemento y decí qué se pierde si se quita. Listá los que no pierden nada. (R2, R7)
6. **Números.** ¿Los montos están alineados, en formato Bs coherente y con los mismos decimales? ¿El delta tiene signo? ¿Cada cifra parece tocable? (R6, R11, R26)
7. **(B) Celular.** ¿Alguna barra fija tapa un botón? ¿Algo se sale del ancho o queda cortado? ¿Algún botón se ve más chico que un dedo, menos de 44 px? (R12-R16)
8. **(B) Estados.** ¿Aparece "No hay datos", una grilla de ceros o un error junto a un vacío? Si la pantalla está vacía, ¿dice cuándo se llena y ofrece una acción? (R35, R36)
9. **Color.** ¿Hay un solo acento y cumple una función? ¿Los estados llevan ícono o texto además del color? ¿Algún texto se lee con esfuerzo, en claro o en oscuro? (R27, R28)
10. **Tipografía y detalle.** ¿Hay 2 familias como máximo y la mono aparece solo en datos? ¿Hay algún texto de 10 px? ¿Los radios son concéntricos y los íconos parejos? ¿Todo está alineado con algo? (R29, R31)
11. **Ilustración o mockup.** Si hay, ¿reemplaza un párrafo y muestra algo real? Si es decorativo, es una captura literal o parece hecho con IA, marcá "No". (R38)
12. **(B) Confianza y final.** ¿Aparece "pronto", "beta" o una cifra inventada? ¿Las propuestas del agente dicen que esperan tu OK? Si la pantalla es el final de un flujo, ¿ofrece el siguiente paso? (R37, R40)

**Salida esperada:** una tabla `| # | Sí/No | Evidencia | Regla |` y un veredicto
**APROBADA / NO APROBADA**. Después de eso la pantalla todavía necesita el OK de Sergio Urcullo
sobre la pieza renderizada. Construir y publicar son dos permisos distintos.

---

## Qué cambió respecto de v1

| v1 | v2 | Cambio |
|---|---|---|
| R1, R2, R3, R5, R6 | R1, R3, R4, R5, R6 | R1, R4 y R5 se ampliaron con fuentes de expertos |
| R4 | R2 | Se fusionó con la prueba de borrado (nueva) |
| R7, R8, R9 | R8, R10, R11 | R8 suma "escribir para escanear"; R11 suma formatos es-BO |
| R10 | R26 | Pasó a ser parte del `KpiTile` |
| R11-R18 | R12-R19 | Se sumaron safe-area, foco, zonas muertas, `inputmode`, hoja que se arrastra y URL como estado |
| R19, R20, R22 | R23, R24, R26 | Sin cambios de fondo |
| R21 | R25 + R21 | **Corrección:** ya no se pre-deshabilita el primario (R21 v2). R25 suma el feedback en `:active` |
| R23-R26 | R27-R30 | R28 y R29 ampliadas (contraste en interacción; tracking e interlineado por tamaño) |
| R27, R28 | R32, R34 | R32 ahora decide por frecuencia |
| R29, R30 | R35, R36 | Lista de arranque; tiempos de skeleton; errores que guían |
| R31, R32 | R39, R40 | Se sumó la opinión fuerte (Saarinen) |
| (no estaba) | **R2, R7, R9, R20, R21, R22, R31, R33, R37, R38** | **Nuevas** |

## Conflictos que resolví (y uno que no es mío)

1. **El primario deshabilitado (v1 R21) choca con Vercel WIG.** Gana WIG, que es R21 v2: se deja
   tocar y se marca lo que falta. v1 queda como excepción cuando el motivo no se resuelve dentro
   del formulario.
2. **"Aprovechada al 100%" contra "más aire".** No se contradicen: el 100% se mide en trabajo por
   espacio, no en espacio ocupado. Está en la idea que ordena todo, arriba.
3. **"Más mockups" contra "nunca capturas del sistema".** Los mockups se dibujan en código con
   funciones reales (R38). La regla del 1-sep sigue en pie.
4. **Apple recomienda la fuente del sistema.** Onia mantiene Archivo + Geist Mono. Es la decisión
   tipográfica pendiente de Sergio Urcullo que figura en `PLAN_REDISENO_1_0_1.md` §4.
5. **No se copian de Vercel** ni el Title Case, ni "&", ni APCA. Son preferencias de su marca en
   inglés; para contraste se mantiene WCAG AA porque ya es medible.
6. **Lo decide Sergio Urcullo:** si "Aprobar y enviar" tiene una ventana de deshacer (R22),
   porque cambia cuándo sale el WhatsApp.

## Gates nuevos que se suman al spec de v1 (propuesta, no ejecutada)

- **`e2e/v1/reglas-ui.spec.ts`:**
  - R13 con Tab.
  - R15: viewport y `type=tel`.
  - R19: filtro en la URL.
  - R20: valores por defecto de "Nueva cita".
  - R21: foco al primer error.
  - R29: letra ≥ 12 px y tracking.
  - R31: `theme-color`.
  - R37: final con siguiente paso en cita, cobro y checkout.
- **`vitest` de RATCHET:**
  - R9: etiquetas genéricas.
  - R22: `confirm(`.
  - R33: `duration-500+`, `ease-in` y `scale-0`.
  - R36: mensajes de error sin salida.
  - R38: `<img` en el panel.
- **Quedan para MIRAR:** R1, R2, R5, R7, R17 y el squint de R39. Los cubre el checklist de 12 puntos.
