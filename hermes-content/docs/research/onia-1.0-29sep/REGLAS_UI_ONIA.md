# Reglas UI de Onia

Borrador del 29-sep-2026 para Sergio Urcullo. Son 32 reglas y cada una se puede verificar. Salen de
las galerías internas, los reels (video-intake), las galerías externas y la auditoría de las
capturas de la 1.0. No toqué ningún repo.

**Abreviaturas de rutas**
- `H/` = `C:/dev/proyectos/onia-hermes-v1-remoto-20260928/`
- `P/` = `C:/dev/proyectos/onia-platform-v1-integracion-20260927/`
- `UP/` = `H/hermes-content/references/ui-patterns/`
- `VI/` = `H/hermes-content/references/video-intake/`
- `DS/` = `H/web-factory/data/references/design-sources/`
- `revision-1.0/` y `pulido-final/` = carpetas de capturas que citó la auditoría visual del 29-sep.

**Cómo leer la columna Gate**
- **AUTO**: se puede volver un test. La plataforma ya tiene `@playwright/test` y `vitest`
  (`P/package.json`) y un precedente del estilo: `P/app/(dashboard)/cta-primario-legible-en-movil.test.ts`.
- **RATCHET**: un grep en CI que falla si el conteo **sube** respecto de la línea base. No obliga a
  migrar todo de golpe, pero congela la deuda.
- **MIRAR**: revisión de la captura a 375 y 1440 px. No se puede automatizar sin mentir.

No hace falta instalar nada para ningún gate. El de contraste se calcula en JS dentro de
Playwright, sin axe-core (que no está instalado).

---

## A. Jerarquía y densidad

**R1. El Inicio responde a tres preguntas y nada más: qué tengo hoy, cuánta plata, qué me toca decidir.**
Arriba va UNA frase que resume el día.
- **Por qué:** el dueño compra si en la primera semana ve la agenda del día y cuánto le deben (`P/PRODUCT.md`).
- **Bien:** saludo, frase del día, 2 botones (Nueva cita / Cobrar), agenda, bloque de plata y 1-3 decisiones.
- **Mal:** hoy "Lo que te dejó Onia" usa ~12 líneas de texto para mostrar 2 cifras (`revision-1.0/b-dashboard-375.png`).
- **Fuente:** `UP/dashboard-minimal/README.md` + `panel-hoy-mobile.png`.
- **Gate:** MIRAR.

**R2. Una sola hoja protagonista (raised) por pantalla.**
- **Por qué:** ley de Von Restorff, resaltar UNA cosa (`UP/20-leyes-ux.png`). También lo dice `P/DESIGN.md` §Sombras.
- **Bien:** una hoja con la cifra del día y el resto plano.
- **Mal:** dos propuestas con estilos distintos (una con degradado, otra plana) en una grilla de 3 columnas (`revision-1.0/b-dashboard.png`).
- **Gate:** AUTO. Con Playwright, contar `[data-surface="raised"]` visibles ≤ 1. Requiere que `components/ui/card.tsx` emita ese atributo.

**R3. Un solo CTA primario por pantalla, y en celular va fijo en la zona del pulgar.**
- **Por qué:** leyes de Hick y Fitts (`UP/20-leyes-ux.png`, `DS/skill-uiux-y-movil.md` Fuente 1).
- **Bien:** "Nueva cita" fija abajo.
- **Mal:** Nueva venta, Hacer corte y Ver inventario con el mismo peso (`pulido-final/5-comercio-panel-375.png`).
- **Gate:** AUTO. `[data-variant="primary"]` visibles ≤ 1 por ruta a 375 px.

**R4. Un dato se muestra en un solo lugar.**
Sin badges duplicados, sin subtítulos que repiten la tabla, y chip solo en las filas que piden acción. Lo que se quita se muda al panel donde vive: no se borra.
- **Por qué:** es la pasada sustractiva V5 que pidió Sergio Urcullo ("tablas más sencillas").
- **Bien:** "Completada" como texto quieto con un punto.
- **Mal:** en Pendientes, el título repetido en "Pedido por… · Recall: Lucía Mendoza — …" (`revision-1.0/d-pending.png`).
- **Fuente:** `UP/panel-claro-premium/index-v5.html` (notas b).
- **Gate:** MIRAR.

**R5. Lo vacío se llena con UN gráfico protagonista, no con más tarjetas.**
Está prohibida la grilla de tarjetas idénticas.
- **Bien:** una cifra en peso fino y una barra código de borde a borde con Hoy/7/30 (V4 "libro mayor").
- **Mal:** los 5 KPIs idénticos en Bs 0,00 de Caja (`revision-1.0/h-comercio-caja.png`).
- **Fuente:** `UP/panel-claro-premium/index-v4.html`; `P/DESIGN.md` §Prohibido.
- **Gate:** MIRAR (squint test, R31).

**R6. Todo número se puede tocar y lleva a su evidencia.**
El camino es métrica → desglose → registro.
- **Bien:** "Por cobrar Bs 3.860" abre la lista de deudores.
- **Mal:** una cifra muerta sin link.
- **Fuente:** `H/web-factory/docs/DESIGN_LEARNED_2026.md` §3b.
- **Gate:** AUTO. En el tipo de `KpiTile`, la prop `href` es obligatoria, así que `tsc` lo hace cumplir.

---

## B. Texto contra dato

**R7. El subtítulo de pantalla tiene 1 línea (70 caracteres o menos). Ningún párrafo del panel pasa de 2 líneas.**
Las definiciones van detrás de un "¿qué es?" (popover o desplegable).
- **Por qué:** la escalera RUIM/BOM/EXCELENTE dice que se borra ~70% del texto y queda título + 2 líneas + acción (`VI/2026-08-23-cosecha-escalera-ruim-bom-excelente.md`).
- **Mal:** el subtítulo del add-on ocupa 9 líneas a 375 px (`pulido-final/7-addon-titulo-zoom-375.png`). Cada agente lleva un párrafo de 3 a 5 líneas (`revision-1.0/c-agents.png`).
- **Gate:** AUTO. En Playwright a 375 px, para cada `main p`, `el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight) ≤ 2`, salvo los que tengan `data-long-ok`.

**R8. Un aviso que se repite va una sola vez, como banner descartable arriba de la lista.**
- **Mal:** "Conectá tu número en Configuración→…" dentro de cada propuesta (`revision-1.0/d-pending.png`). "Meta te cobra los mensajes" aparece 3 veces en el add-on (`revision-1.0/f-addon-chatbot.png`).
- **Gate:** AUTO. En Playwright, ningún texto de 30 caracteres o más aparece dos veces dentro de `main`.

**R9. Se usa el vocabulario del dueño y del rubro.**
Nada de "Recall", "Add-on", fechas con segundos, códigos hex a la vista ni URLs largas crudas. Los tiempos son relativos ("hace 2 h") y la fecha completa va en un tooltip.
- **Mal:** "29/9/2026, 1:26:51 a. m." y "propuestas 2 · auto 0 · descartadas 0" (`revision-1.0/c-agents.png`). "Colores: Papel y verde (#079E68)" en Mi web (`revision-1.0/g-mi-web.png`).
- **Fuente:** `H/CLAUDE.md` §3 (vocabulario por rubro); `P/lib/onboarding/vocabulario.ts`.
- **Gate:** AUTO. En el texto renderizado de `main`, fallan la regex `/\d{1,2}:\d{2}:\d{2}/`, la regex `/#[0-9A-Fa-f]{6}\b/` y la lista negra `Recall|Add-on|Loading`.

**R10. Bajo el KPI va una frase narrativa que sale del MISMO cálculo que el delta.**
- **Bien:** "Cobraste Bs 380 más que el jueves pasado".
- **Mal:** una frase escrita a mano, o un sparkline de 40 px sin lectura.
- **Fuente:** `DS/2026-08-30-como-se-hace-un-dashboard.md` §2.5.
- **Gate:** AUTO. Test unitario de la función que devuelve `{delta, frase}`: los dos salen del mismo número.

---

## C. Celular

**R11. La barra inferior tiene 5 destinos como máximo, cada uno con ícono y texto, 48 dp o más, en una sola línea.**
- **Propuesta:** Inicio · Agenda · [Asistente] · Pacientes/Clientes · Más.
- **Mal:** hoy son 6 ítems con etiquetas `text-[10px]`, y "Agenda de hoy" se parte en dos (`P/components/layout/BottomNav.tsx:78,92`).
- **Fuente:** `DS/skill-uiux-y-movil.md` Fuente 2; `VI/2026-08-16-nutriapp-modulo-vertical.md`.
- **Gate:** AUTO. Test de `BottomNav`: ≤ 5 ítems por rubro y ninguna etiqueta que haga wrap a 375 px.

**R12. Nada fijo tapa un botón primario, y hay como máximo UNA capa flotante.**
- **Mal:** a 812 px de alto, ~206 px (25%) son barras fijas. La barra del asistente tapa "Continuar", "Conectar mi WhatsApp" y "2 decisiones esperando" (`revision-1.0/f-chatbot.png`, `f-chatbot-whatsapp.png`, `b-dashboard-375.png`; `P/components/layout/LayoutShell.tsx:128-137`).
- **Gate:** AUTO. En Playwright, para cada botón visible después de `scrollIntoView({block:'end'})`, `document.elementFromPoint(centro)` tiene que ser el botón o un hijo suyo.

**R13. Los targets táctiles miden 44 px o más, con 8 px de separación.**
- **Mal:** los botones `text-xs px-3 py-1.5` de Agentes y Pendientes miden ~28 px (`P/app/(dashboard)/pending/pending-client.tsx:341-373`).
- **Bien:** `.dv2-btn` con min-height 44px (`P/app/(dashboard)/dashboard/dashboard-v2.css:132`).
- **Gate:** AUTO. En Playwright a 375 px, `button, a[role=button], input, select` tienen altura ≥ 44.

**R14. Los inputs tienen 16 px o más en celular (así iOS no hace zoom), y el texto de cuerpo tiene interlineado de 1,5 o más.**
- **Fuente:** `DS/skill-uiux-y-movil.md` reglas 1-12.
- **Gate:** AUTO. `getComputedStyle(input).fontSize ≥ 16px` a 375 px.

**R15. Cero scroll horizontal, y toda fila de botones hace wrap o se apila.**
- **Mal:** "Rechazar" queda cortado a 375 px porque la fila es `flex gap-2` sin `flex-wrap` (`pulido-final/3-pending-375.png`, `pending-client.tsx:341`).
- **Gate:** AUTO. `document.documentElement.scrollWidth ≤ innerWidth` a 375 y 390 px en cada ruta.

**R16. En celular, los formularios suben como hoja inferior, no como modal centrado.**
Los modales usan `<dialog>` nativo.
- **Por qué:** así se tienen gratis Escape, foco atrapado y devolución del foco. Además, el pulgar llega a los botones.
- **Fuente:** `UP/checkout-card`, `UP/floating-cart`; https://ui.shadcn.com/docs/components/drawer (se apoya en `@base-ui/react`, que ya está instalado).
- **Gate:** MIRAR, más un grep RATCHET de modales centrados nuevos (`fixed inset-0 flex items-center`).

**R17. En celular, una tabla se vuelve lista de tarjetas de 2 líneas.**
Nombre, estado con ícono + texto (nunca solo color), y el monto a la derecha con `tabular-nums`.
- **Fuente:** https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (checklist); `DS/2026-08-30-como-se-hace-un-dashboard.md` Ley 11.
- **Gate:** AUTO parcial. Todo nodo con `data-money` tiene `font-variant-numeric: tabular-nums`.

**R18. El celular no pierde trabajo.**
- Autoguardado del formulario a medio llenar (la recepcionista atiende el teléfono y vuelve).
- Al volver, se conserva el scroll y los filtros.
- Un aviso abre la cita o el cobro exacto (enlace profundo).
- Los permisos se piden recién cuando se activa la función.
- **Fuente:** `DS/2026-08-29-ux-rules-agenticmatt.md` (reglas 6-15).
- **Gate:** AUTO. Un e2e que llena la mitad de "Nueva cita", recarga y encuentra los valores.

---

## D. Componentes

**R19. Toda superficie se arma con `components/ui/card.tsx` (flat/raised/inset). Se prohíbe la tarjeta a mano.**
- **Por qué:** hoy `card.tsx` y `StatCard.tsx` tienen 0 importadores y hay 199-317 tarjetas `rounded-xl border` hechas a mano. Por eso cada pantalla se ve distinta.
- **Fuente:** inventario del 29-sep (commit `6656e76c`); `P/.claude/skills/onia-frontend/SKILL.md:59-76`.
- **Gate:** RATCHET. `grep -rE 'rounded-(xl|2xl|3xl)[^"]*border' app components | wc -l` no puede subir de la línea base.

**R20. Todo input pasa por `components/ui/Field.tsx`: label + control + error, 44 px de alto.**
- **Mal:** 28 `const inputClass` locales con 8 variantes (por ejemplo `comercio/caja/VentaForm.tsx:41`).
- **Gate:** RATCHET. `grep -r "const inputClass" app | wc -l` ≤ 28 y bajando.

**R21. Hay un solo botón, `components/ui/button.tsx`.**
- El primario es sólido y oscuro con texto blanco.
- El deshabilitado es gris neutro y dice por qué en 1 línea ("Falta la captura").
- Tiene 3 estados: reposo → proceso → resultado.
- **Mal:** hoy Button tiene 1 importador contra 427 `<button>` sueltos. El primario "Nueva venta" es menta `--dv2-senal #86d3ad` y se confunde con los deshabilitados (`P/app/globals.css:1505-1510`).
- **Fuente:** `UP/upload-button/index.html` (botón multiestado).
- **Gate:** RATCHET sobre `<button className=` y AUTO de contraste (R24).

**R22. El KPI (`KpiTile`) sigue una estructura fija.**
- Etiqueta mono chica arriba y valor grande abajo.
- El delta se muestra con signo y forma, no solo con color, y tiene un modo invertido para lo que es malo que suba.
- La cabecera es una grilla de 2×2, para que "Bs 1.250.000,00" no empuje el chip.
- Se pliega según el `@container`.
- **Fuente:** `DS/2026-08-30-como-se-hace-un-dashboard.md` §1 (Leyes 1-3), §2.4 y §2.6.
- **Gate:** AUTO. Test de render: con delta negativo aparece el signo "−" en el DOM, no solo una clase roja.

---

## E. Color y tipografía

**R23. El verde señal `#00D26A` va solo en formas y en CTAs con texto oscuro.**
- Si el verde tiene que leerse como texto, se usa verde-700 `#016141`.
- El verde de marca dentro del panel queda para "ganaste / éxito" (las cifras de lo que dejó Onia), nunca para el cromo.
- **Por qué:** 8 fichas lo encontraron por separado: un solo acento saturado y siempre sobre el dato.
- **Fuente:** `VI/2026-08-23-sintesis-lote-18.md` §6; `UP/hero-onia/LENGUAJE.md` §1-4 (9,43:1 con texto oscuro contra 2,01:1 con blanco).
- **Gate:** AUTO (R24).

**R24. Todo par texto/fondo pasa AA (4,5:1 en cuerpo, 3:1 en texto grande), en claro y en oscuro.**
- **Mal (según el diagnóstico del 30-ago, falta re-verificarlo):** `bg-green-50` casi blanco sobre `#0C110F` en tema oscuro.
- **Fuente:** `VI/2026-08-20-sintesis-lote-13.md` T5 (en el repo no hay gate de contraste); `DS/2026-08-30-como-se-hace-un-dashboard.md` §3.1.
- **Gate:** AUTO. En Playwright se recorren los nodos de texto, se calcula la luminancia relativa del color contra el fondo efectivo y falla si da < 4,5. Se corre en las dos combinaciones de `prefers-color-scheme`.

**R25. Hay dos familias: Archivo y Geist Mono.**
- La mono va solo en etiquetas, montos, hora, NIT y número de factura. Nunca en párrafos.
- El peso máximo es 650.
- **Fuente:** `P/DESIGN.md` §Tipografía; `P/app/layout.tsx`; `UP/hero-onia/LENGUAJE.md`.
- **Gate:** AUTO. El conjunto de `font-family` computados en `main` ⊆ {Archivo, Geist Mono}.
- **Aviso:** conviven otras leyes (Bricolage/Schibsted, DM Sans) en `UP/panel-claro-premium/README.md` y en `MOTION_PATTERN_BANK §3`. Ver `COMO_APRENDO_Y_ORDEN.md`.

**R26. La tinta de los datos usa tokens `--chart-1..n`, separados de la marca.**
- La serie 1 es la marca, la comparativa va en gris o punteada, y nunca se usan varios verdes para distinguir categorías.
- **Mal:** los métodos de pago con 4 verdes (diagnóstico del 30-ago, falta re-verificarlo).
- **Fuente:** `DS/2026-08-30-como-se-hace-un-dashboard.md` Leyes 4-5.
- **Gate:** RATCHET. Grep de `bg-green-(100|200|300|400)` dentro de componentes de gráfico.

---

## F. Movimiento

**R27. Se anima solo cuando cambia un estado: cita confirmada, cobro, alerta del agente.**
- Solo con `transform`, `opacity` o `clip-path`, y la curva `cubic-bezier(0.16,1,0.3,1)`.
- Sin rebote, sin loops ociosos y sin hover que levante la tarjeta.
- **Mal:** `transition-all` aparece 216 veces en `P/app` y `P/components` (conteo del 29-sep).
- **Fuente:** `P/DESIGN.md` §Movimiento; `VI/2026-08-23-30-senales-sitio-vibecoded.md` (#28).
- **Gate:** RATCHET. `transition-all` ≤ 216 y bajando, y 0 apariciones de `hover:-translate-y` o `hover:scale`.

**R28. En reduced-motion va `transition: none`, nunca `0.01ms`. En `<dialog>` o popover, `display` va solo en el estado abierto.**
- **Por qué:** con `0.01ms` el dialog queda abierto e invisible (es un bug ya aprendido).
- **Fuente:** `UP/README.md` §Reglas.
- **Gate:** AUTO. `grep -r "0.01ms" app components` = 0.

---

## G. Estados vacíos, de carga y de error

**R29. Nunca "No hay datos".**
- Un estado vacío lleva ícono + 1 frase que dice CUÁNDO se llena + 1 botón que lo llena.
- Si toda la grilla está en cero, se esconde y se muestra una sola acción: "Registrá tu primera venta".
- **Mal:** el panel de comercio sin ventas muestra ~14 ceros o guiones en 2.329 px (`pulido-final/5-comercio-panel-375.png`).
- **Fuente:** `DS/2026-08-30-como-se-hace-un-dashboard.md` §2.7; https://21st.dev/s/empty-state; el modelo propio ya existe en `pulido-final/1-guia-control-se-abre-375.png`.
- **Gate:** AUTO. `grep -rn "No hay datos\|Sin datos"` = 0 (hoy da 3), y `EmptyState` exige la prop `action`.

**R30. Cada sección tiene su skeleton (con la forma del contenido real, tras 300 ms) y su error con "Reintentar". Error y vacío nunca aparecen juntos.**
- **Mal:** "No se pudo cargar el hilo" junto a "Sin comentarios" (`pulido-final/6-ficha-documentos-375.png`).
- **Hoy:** `P/app/(dashboard)` tiene 1 `loading.tsx` y 1 `error.tsx`, los dos en la raíz. Ninguna sección tiene los suyos.
- **Gate:** AUTO. Un test que recorre `app/(dashboard)/*/` y exige `loading.tsx` y `error.tsx` en las secciones de la barra inferior.

---

## H. Confianza y venta

**R31. Se pasa el squint test anti-IA antes de publicar.**
Se revisan cinco señales:
- display en Inter o en una sola sans;
- hero centrado con gradiente;
- 3 o más tarjetas idénticas con iconito;
- acento usado como decoración;
- copy que le serviría a cualquier empresa.

Si dos o más dan "sí", no se publica. Además, están prohibidos los sparkles en los botones de IA, los emojis estructurales, el violeta, el texto con gradiente y la franja de color a la izquierda.
- **Fuente:** `H/web-factory/docs/MOTION_PATTERN_BANK_2026.md` §3; `VI/2026-08-23-30-senales-sitio-vibecoded.md`.
- **Gate:** MIRAR para el squint. RATCHET = 0 para `Sparkles`, `bg-clip-text` y `border-l-4 border-(green|emerald|teal)`.

**R32. La venta nunca exhibe obra, y el agente propone y espera.**
- Cero "muy pronto", "beta", "próximamente" o "en construcción".
- Toda propuesta de un agente dice "No se envía hasta que lo apruebes".
- Las cifras de "lo que ganó" salen de datos reales, nunca escritas a mano.
- **Fuente:** `H/CLAUDE.md` §3 (La venta nunca exhibe obra); `UP/dashboard-minimal/README.md`.
- **Gate:** AUTO. Grep de la lista de obra = 0 en `app/`, y un test que confirme que el bloque "lo que ganó" no recibe números literales.

---

## Cómo se instalan los gates (propuesta, no ejecutada)

1. Un solo spec, `P/e2e/v1/reglas-ui.spec.ts`. Recorre las rutas de la barra inferior a 375, 390 y 1440 px y en claro y oscuro, y aplica R2, R3, R7, R8, R9, R12, R13, R14, R15, R17, R24 y R25. Guarda capturas para MIRAR.
2. Un `vitest` de conteos RATCHET, al estilo de los `*.test.ts` que ya están en `P/app/(dashboard)/`. La línea base se guarda en un JSON y el test falla si un número sube: R19, R20, R21, R26, R27, R28, R29, R31 y R32.
3. Tests unitarios de componente para R6, R10, R22 y R30.

**Queda sin automatizar:** R1, R4, R5, R16 y el squint de R31. Esas se revisan mirando.
