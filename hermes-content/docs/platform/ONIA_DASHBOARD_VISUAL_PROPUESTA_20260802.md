# Dashboard visual de Onia Platform — research + propuesta (2026-08-02)

Pedido de Sergio: "el dashboard tiene que ser visual, animaciones, estadísticas
visuales — mirá dashboards y sistemas ganadores que ya funcionen y extraé lo usable".

Estado actual (captura real de `app.onia.com.bo/dashboard`): tarjetas de texto
planas, cero gráficos, cero tendencia, cero jerarquía entre números. Todo pesa
igual, nada dice "esto va bien / esto atendé ya".

Usuarios reales: dueños de clínica dental y de comercio en Bolivia, mayormente en
Android de gama media. Restricción dura: **lindo pero liviano y legible** — no un
panel de trading.

---

## Parte 1 — Research: lo usable de los que ya ganaron

### 1.1 Patrones extraídos (no catálogo — solo lo que aplica)

**Stripe — la tarjeta KPI canónica.** Cada métrica es: número grande + delta vs
período comparable (flecha + %) + sparkline inline. La tendencia SIEMPRE va al
lado del valor, nunca el valor solo. Cero elementos decorativos: el home de Stripe
balancea KPIs, un gráfico de ingresos y actividad reciente sin un solo adorno.
Números absolutos para la métrica héroe ("Bs 2.840" se procesa más rápido que
"104% de la meta").
→ *Usable:* nuestra fila de KPIs adopta exactamente este patrón (hoy tenemos el
número solo, sin delta ni sparkline — por eso se siente muerto).

**Shopify Home — el "hoy" del negocio chico (el MÁS relevante para nuestro
público).** La landing del admin no es un panel de análisis: es "cómo va el día +
qué tengo que hacer ahora" — resumen de ventas del día, próximos pasos con los
pedidos, actividad reciente. Las métricas son cards personalizables con gráficos
CHICOS; el análisis profundo vive en otra pestaña (Analytics). Dato de contraste:
cuando Shopify le quitó al Home las métricas de un vistazo (rollout Plus), los
comerciantes reclamaron en masa — la gente QUIERE los números del día apenas entra.
→ *Usable:* el dashboard es "Hoy" + acciones, no un reporte. Los gráficos son
contexto del día (7 días), no series históricas configurables.

**Mercury — un solo número líder.** El dashboard abre con UN número (saldo /
runway), nunca una pared de datos. Superficies calladas, números legibles, la
marca deja que el dato hable. La moderación ES la señal de confianza en fintech.
→ *Usable:* "Ventas de hoy" (comercio) / "Ingresos de hoy" (dental) es EL número:
más grande que todo lo demás, con jerarquía tipográfica real (34px vs 15px).

**Linear — insights sin chartjunk.** Progreso y tendencias con el mínimo de
tinta: barras simples, sin ejes cargados, sin leyendas cuando el color ya lo dice.
→ *Usable:* nuestros gráficos no llevan ejes ni grillas: barra + valor + label.

**Vercel — sparklines y barras de uso.** Uso y observabilidad como mini-gráficos
inline junto al número, no como pantallas aparte.
→ *Usable:* sparkline de 7 días DENTRO de la tarjeta héroe.

Síntesis (regla de diseño del dashboard Onia):
1. Un número líder por rubro, jerarquía tipográfica fuerte.
2. Todo número lleva contexto: delta vs período comparable o mini-tendencia.
3. Gráficos sin ejes/grillas/leyendas — barra + valor.
4. La mitad del dashboard no son gráficos: son **acciones** ("qué hago ahora"):
   stock crítico, pacientes por reactivar, cuentas por cobrar.
5. Comparar contra el período COMPARABLE: un sábado se compara con el sábado
   pasado, no con ayer (el ciclo del comercio es semanal).

### 1.2 Librerías de charts — licencias y estado VERIFICADOS

Verificado contra la API de GitHub el 2026-08-02 (licencia | stars | último push):

| Librería | Licencia | Stars | Último push | Veredicto para nuestro stack |
|---|---|---|---|---|
| recharts/recharts | **MIT** | 27.4k | 2026-07-31 | ✅ Activa. Base de shadcn charts. SVG, declarativa, theming por CSS vars → encaja con Tailwind v4 + tokens Onia. ~150 kB: solo donde haga falta interactividad. |
| shadcn-ui/ui (charts) | **MIT** | 120k | 2026-07-31 | ✅ Wrapper de recharts con estilos por CSS variables (`--chart-1..5` ya existen en nuestro globals.css). Copy-paste, no dependencia de diseño. |
| tremorlabs/tremor | Apache-2.0 | 3.5k | **2025-10-10** | ❌ Comprada por Vercel (ene 2025) y el repo lleva ~10 meses sin push; la comunidad ya preguntaba por el mantenimiento en 2025. Riesgo Origin-UI-style: no adoptar. |
| plouc/nivo | MIT | 14k | 2026-07-21 | ❌ Pesada (500 kB+ full) para lo que necesitamos. |
| airbnb/visx | MIT | 21k | 2026-06-22 | ⚠️ ~15 kB modular pero es un toolkit: mucho código propio para poco chart. Overkill acá. |
| chartjs/Chart.js | MIT | 67.6k | 2026-05-27 | ❌ Canvas, client-only (dynamic import obligatorio con RSC), theming por JS y no por CSS vars. No encaja con Tailwind v4 tokens. |

**Decisión (dos niveles):**

1. **Nivel 0 — SVG/CSS a mano (0 kB): el default.** Sparkline = un `<path>` de
   7 puntos. Barras 7 días = divs con `height` %. Barras horizontales = divs con
   `width` %. Anillo de ocupación = un `<circle>` con `stroke-dasharray`. Todo lo
   propuesto abajo se hace así — cero dependencia nueva, tema claro/oscuro gratis
   vía tokens, y en un Android de gama media no pagás 150 kB de JS por 4 barras.
2. **Nivel 1 — shadcn charts (recharts, MIT)** SOLO cuando aparezca necesidad
   real de tooltips/hover/series comparadas (ej: la vista "Reporte" futura).
   Client component con code-split a esa ruta; el "Hoy" no lo carga.

Lección Origin UI aplicada: licencia verificada en el repo (no en el sitio de
marketing) + señal de mantenimiento (último push) antes de adoptar. Tremor pasó
de "la opción para SaaS" a riesgo en 10 meses.

### 1.3 Animación — qué sí y qué no

**Sí (una sola vez, al entrar la vista):**
- **Count-up del número líder**: 0 → valor en ~600 ms ease-out. Es EL efecto que
  hace sentir "vivo" un dashboard, y es un `requestAnimationFrame` de 8 líneas.
- **Barras que crecen**: `transform: scaleY/scaleX` desde 0, stagger de ~45 ms
  por barra. Compositor-friendly (transform, no height/width animados).
- **Sparkline que se dibuja**: `stroke-dashoffset` 0.7 s. Pinta poco (path chico).
- **Entrada de tarjetas**: opacity + translateY 10px, stagger 60 ms.

Presupuesto total: todo termina antes de ~1 s. 300–500 ms por elemento máximo —
más largo se siente lento (regla estándar de micro-interacciones).

**No (ruido para un ferretero, y caro en gama media):**
- Loops infinitos (pulsos, shimmer permanente, "breathing").
- Parallax, glow, blobs, 3D, partículas.
- Animar en cada actualización de dato (solo al entrar; los refetch actualizan
  sin re-animar).
- Animar propiedades de layout (width/height/top/margin).

**Reduced motion (obligatorio):** patrón opt-in — los estilos base son estáticos
y la animación se agrega solo dentro de
`@media (prefers-reduced-motion: no-preference)`; el count-up chequea
`matchMedia('(prefers-reduced-motion: reduce)')` y pinta el valor final directo.
Así el usuario con reduced motion nunca ve flash ni movimiento.

---

## Parte 2 — Propuesta concreta por rubro

Regla transversal: máx. 4 visualizaciones por pantalla "Hoy" + 2 bloques de
acción. Todo con tokens Onia (verde #089868 / #027650, tinta, fondos cálidos,
washes) y ambos temas vía las mismas CSS vars que ya remapea el producto.

### 2.1 Comercio — "Hoy" (el ferretero)

| # | Visualización | Cómo | Por qué le sirve al FERRETERO |
|---|---|---|---|
| 1 | **Ventas de hoy** — número grande Bs con count-up + chip "▲ +12% vs sábado pasado" + sparkline 7 días | Card héroe (más ancha), SVG inline | Es LA pregunta al entrar: "¿cómo voy?". El delta vs mismo día de la semana pasada respeta el ciclo semanal del comercio (un sábado no se compara con un martes). |
| 2 | **Cómo te pagaron hoy** — barras horizontales Efectivo / QR / Tarjeta con Bs y % | Divs con width %, verde en 3 opacidades | Cuadre de caja: le dice cuánto efectivo DEBERÍA haber en el cajón al cierre. Uso diario real, no analítica. |
| 3 | **Últimos 7 días** — barras verticales, hoy resaltada en verde, monto encima | Divs con height %, sin ejes | Contexto de la semana en 2 segundos: "¿el bajón del martes fue normal?". Alimenta la decisión de compra semanal. |
| 4 | **Lo más vendido hoy** — top 5 con barra + cantidad + Bs | Barras horizontales | Lo que más rota es lo primero a reponer. Conecta venta → reposición. |
| A | **Stock crítico** — lista con badge rojo/ámbar ("Quedan 7 · vendés ~12/semana") + CTA "Armar pedido" | Lista, NO gráfico | La alerta más valiosa: quedarse sin cemento un sábado es plata perdida. Es acción, no visualización. |
| A | **Por cobrar** — Bs + n cuentas abiertas (KPI chico) | Card KPI | El fiado es el agujero clásico del comercio de barrio. |

### 2.2 Dental — "Hoy" (la dueña de clínica)

| # | Visualización | Cómo | Por qué le sirve |
|---|---|---|---|
| 1 | **Ingresos de hoy/mes** — número grande + count-up + chip delta + sparkline 7 días | Misma card héroe que comercio (mismo componente) | El número que la dueña mira primero. Reusa 100% el componente de comercio. |
| 2 | **Agenda de hoy como timeline** — columna con hora, paciente, tratamiento y dot de estado (verde=confirmada, ámbar=sin confirmar, gris=atendida) | HTML/CSS (lista con rail vertical), NO librería de calendario | La recepción vive de esto. El dot ámbar dispara la llamada de confirmación — hoy la lista plana no distingue nada. |
| 3 | **Ocupación de hoy** — anillo % de slots ocupados ("14 de 20 turnos") | SVG `<circle>` con stroke-dasharray, animado 1 vez | Capacidad ociosa = plata perdida. Un anillo al 60% grita "llamá a la lista de espera" sin leer nada. |
| 4 | **Pacientes por reactivar** — contador + 3 nombres (6+ meses sin visita) + CTA "Enviar recordatorio" | Lista con avatar-iniciales | Reactivación es el ingreso más barato de la clínica; conecta directo con el agente Recall ya construido. |
| A | **Por cobrar** — Bs en tratamientos con saldo | Card KPI | Igual que comercio: mismo componente. |

### 2.3 Componentes (una sola familia, dos rubros)

Todo Nivel 0 (SVG/CSS propio, 0 dependencias nuevas):

- `<KpiCard>` — label + valor tabular-nums + unidad + foot; variante `hero` con
  slot sparkline. Sirve a los 6 KPIs de ambos rubros.
- `<Sparkline points={…}>` — `<path>` + fill wash + dot final. ~30 líneas.
- `<BarRow>` (horizontal) y `<WeekBars>` (vertical 7 días) — divs + tokens.
- `<OccupancyRing value={…}>` — un `<circle>`. ~20 líneas.
- `<DayTimeline items={…}>` — lista con rail; dots con los tonos semánticos ya
  existentes (verde acento / ámbar gate / neutro).
- `<CountUp value>` — client component chiquito con rAF + reduced-motion check.

Colores: solo tokens existentes — verde acento para "vivo/positivo", ámbar SOLO
para "necesita acción", rojo solo stock/vencido. Los washes (`--green-wash`,
`--amber-wash`) para fondos de chips y fills. Ambos temas salen gratis porque
ningún componente hardcodea color.

### 2.4 Spec de animación (cerrada)

- Entrada única por visita a la vista; refetch NO re-anima.
- Stagger tarjetas 60 ms · barras 45 ms · todo termina < 1 s.
- Solo `transform` + `opacity` (+ `stroke-dashoffset` en sparkline/anillo).
- Todo dentro de `@media (prefers-reduced-motion: no-preference)`; count-up con
  check de `matchMedia`. Base estática = sin flash para reduced motion.

---

## Mockup para aprobación

- HTML (1 archivo, tokens Onia reales, claro + oscuro, animaciones incluidas):
  `scratchpad/dashboard-mockup/index.html` (sesión skills-setup-config-8d4674)
- Capturas Playwright: `mockup-1440.png` y `mockup-375.png` en la misma carpeta.

La pantalla mockupeada es Comercio "Hoy" completa: héroe con count-up + sparkline,
3 KPIs, 7 días, métodos de pago, top productos y stock crítico con CTA. En 375px
todo apila a 1 columna, tap targets ≥ 44px, texto ≥ 11.5px.

**Siguiente paso (tras OK de Sergio):** portar FIEL el mockup a componentes en el
repo del producto (carril del producto, no este) — Nivel 0 sin dependencias
nuevas; shadcn charts recién si aparece la vista "Reporte" con tooltips.

---

## Fuentes

- Stripe / patrón KPI + sparkline: [Fintech Dashboard Design: Patterns & Real Examples (Masterly)](https://www.themasterly.com/blog/fintech-dashboard-design-guide) · [Dashboard Design Visual Guide](https://how-to-dashboard.vercel.app/) · [925studios — 35 SaaS Dashboard Examples 2026](https://www.925studios.co/blog/saas-dashboard-design-examples-2026)
- Shopify Home / "today" del negocio chico: [Shopify Help — Home page](https://help.shopify.com/en/manual/shopify-admin/shopify-home) · [Shopify changelog — customize metrics](https://changelog.shopify.com/posts/customize-the-metrics-displayed-in-shopify) · [Reclamo de merchants al perder métricas del Home](https://community.shopify.com/t/why-did-the-admin-home-dashboard-remove-the-store-summary/248918)
- Mercury / un número líder: [Masterly — Fintech dashboard patterns](https://www.themasterly.com/blog/fintech-dashboard-design-guide)
- Librerías (comparativas): [LogRocket — Best React chart libraries 2026](https://blog.logrocket.com/best-react-chart-libraries-2026/) · [PkgPulse — Recharts vs Chart.js vs Nivo vs visx](https://www.pkgpulse.com/guides/recharts-vs-chartjs-vs-nivo-vs-visx-react-charting-2026) · [PkgPulse — Recharts v3 vs Tremor vs Nivo](https://www.pkgpulse.com/guides/recharts-v3-vs-tremor-vs-nivo-react-charting-2026)
- Licencias/estado: verificado vía GitHub API (`gh api repos/...`) el 2026-08-02 — valores en la tabla §1.2.
- Tremor/Vercel: [Vercel acquires Tremor](https://vercel.com/blog/vercel-acquires-tremor) · [Issue #140 — ¿seguirá mantenido?](https://github.com/tremorlabs/tremor/issues/140)
- Animación accesible: [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) · [web.dev — Motion & accessibility](https://web.dev/learn/accessibility/motion) · [CSS-Tricks — prefers-reduced-motion](https://css-tricks.com/almanac/rules/m/media/prefers-reduced-motion/)
