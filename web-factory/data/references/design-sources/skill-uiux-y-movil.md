# skill-uiux-y-movil — ui-ux-pro-max + patrones móviles 2026

Cosecha 2026-08-16. Grupo: skill UI/UX instalada + research de patrones móviles para el
dashboard móvil de Onia Platform.

---

## Fuente 1: nextlevelbuilder/ui-ux-pro-max-skill

**Estado:** ya cubierta como puntero en `SOURCES.md` §2b y `DESIGN_STACK.md` (repo clonado
en `C:\Users\PC\.codex\design-stack\repos\nextlevelbuilder__ui-ux-pro-max-skill`), pero los
docs solo decían "global design rules" sin el contenido. Aquí se extraen las reglas para
que la factory las cite sin abrir la skill. Instalada LOCAL en
`C:\Users\PC\.claude\skills\ui-ux-pro-max\SKILL.md` (leída completa).

### Qué es

Skill de Claude Code con base de datos buscable de diseño: 50+ estilos, 161 paletas,
57 pairings tipográficos, 161 tipos de producto con reglas de razonamiento, 99 guidelines
UX y 25 tipos de chart en 10 stacks. Incluye CLI Python
(`scripts/search.py "<query>" --design-system`) que genera un design system completo
(patrón + estilo + colores + tipografía + anti-patterns) y lo persiste como
`design-system/MASTER.md` + overrides por página.

### Qué ofrece concretamente

- **10 categorías de reglas priorizadas** (Accessibility y Touch = CRITICAL; Performance,
  Style, Layout, Navigation = HIGH; Typography/Color, Animation, Forms = MEDIUM;
  Charts = LOW).
- **Generador de design system por query** (`--design-system -p "Nombre"`) y búsquedas por
  dominio: `product`, `style`, `color`, `typography`, `chart`, `ux`, `google-fonts`, `react`.
- **Checklist pre-entrega** (visual, interacción, light/dark, layout, accesibilidad).

### Reglas clave a citar por la factory (destiladas del SKILL.md)

Numéricas y verificables — sirven como gates de QA:

1. Contraste texto normal >= 4.5:1 (grande 3:1); en dark mode primario >= 4.5:1,
   secundario >= 3:1. Ambos temas se prueban antes de entregar.
2. Touch targets >= 44x44pt (iOS) / 48x48dp (Android), con >= 8px de separación entre sí.
3. Feedback visual al tap en <= 100ms (pressed state 80-150ms); botón async se deshabilita
   con spinner.
4. Microinteracciones 150-300ms, animación compleja <= 400ms; animar solo
   transform/opacity; respetar `prefers-reduced-motion`; toda animación expresa
   causa-efecto (nada decorativo).
5. Body >= 16px en móvil (evita el auto-zoom de iOS), line-height 1.5-1.75, nada de body
   < 12px; breakpoints sistemáticos 375/768/1024/1440; cero scroll horizontal; nunca
   deshabilitar zoom en el viewport meta.
6. Bottom nav máximo 5 ítems con icono + label; back predecible que preserva scroll/estado;
   toda pantalla clave accesible por deep link.
7. UN solo CTA primario por pantalla.
8. Prohibido emoji como icono estructural — solo SVG (Lucide/Heroicons) de UNA familia,
   con tamaños tokenizados (icon-sm/md/lg).
9. Forms: label visible (no placeholder-only), error debajo del campo afectado, mensaje
   con causa + cómo arreglarlo, progressive disclosure.
10. Color por tokens semánticos por tema — cero hex crudo en componentes; el color nunca
    es el único indicador; en charts evitar pares rojo/verde solos, leyenda siempre visible.
11. Performance: WebP/AVIF + srcset + lazy load, `font-display: swap`, reservar espacio
    (CLS < 0.1), virtualizar listas de 50+ ítems.
12. Safe areas respetadas en headers/tab bars/CTA bars fijos; el scroll nunca queda
    tapado por barras sticky; validar en teléfono chico, grande y tablet.

### Ideas transferibles a nuestras webs/dashboards

1. **Adoptar las reglas numéricas como QA gate de la factory**: la checklist pre-entrega
   de la skill se puede correr tal cual sobre cada sitio generado (contraste, targets,
   timings, ambos temas) — complementa el "verificar es MIRAR" con números medibles.
2. **`--design-system` como primer paso de cada proyecto de cliente**: query
   `"<rubro> <industria> <keywords>"` genera paleta + tipografía + estilo + anti-patterns
   ANTES de codear; encaja con la regla de onia-web-factory de cargar diseño primero.
3. **Patrón MASTER.md + overrides por página** para los sitios de la factory: un design
   system global commiteado y desviaciones por página documentadas, en vez de tokens
   sueltos re-decididos por sección.
4. **Regla "un CTA primario por pantalla"** aplicada a landings de propuestas y al
   dashboard: cada vista de Onia Platform define SU acción primaria (agendar, cobrar,
   registrar) y el resto baja a secundario.
5. **Búsqueda por dominio `chart`** para el dashboard: mapear tipo de dato → tipo de
   chart (tendencia → línea, comparación → barra) antes de elegir librería, con paletas
   accesibles.
6. **Tokens de iconografía** (icon-sm/md/lg) en `packages/tokens`: hoy la factory tokeniza
   color/espaciado pero no tamaños de icono — agregarlo elimina los tamaños arbitrarios.
7. **Gate anti-emoji**: grep de emojis en JSX/HTML generado como check automático del
   pipeline (la skill lo marca anti-pattern #1 de calidad visual).

### Qué NO copiar

- **No usar su generador como sustituto del criterio de marca**: produce combinaciones
  seguras tipo template; en ONIA el design system generado es punto de partida que pasa
  por `impeccable`/anti-template policy, no output final (choca con
  `web/design-quality.md` si se usa crudo).
- **No duplicar la base de datos** (paletas/fonts) dentro del repo: se consulta por CLI
  desde la skill instalada; copiarla crea una segunda fuente de verdad.
- **No adoptar su estructura de carpetas `skills/ui-ux-pro-max/scripts/...`** en comandos
  de docs de la factory: la ruta real local difiere (`C:\Users\PC\.claude\skills\ui-ux-pro-max`);
  citar siempre la ruta instalada.

**Licencia/costo:** MIT, gratis.
**Veredicto: ADOPTAR** (ya instalada; ahora citable por reglas concretas).

---

## Fuente 2: Patrones móviles 2026 — bottom sheet / navegación (research web)

### Qué es

Destilado de research 2026 sobre patrones de UI móvil, orientado al dashboard móvil de
Onia Platform (dueño de negocio operando desde el teléfono: agenda, cobros, clientes,
alertas). Fuentes: Muzli (trends 2026), GenDesigns (12 patrones), UXPin y
DesignStudio (navegación móvil 2026). Solo estructura y números — sin código ni assets.

### Qué ofrece concretamente

Consenso 2026: el bottom sheet es ya el contenedor estándar de contenido secundario
(Apple lo estandarizó con `UISheetPresentationController`); la navegación se concentra
en el tercio inferior (75% de las interacciones son con un pulgar — Hoober); Telegram,
Apple Maps y Spotify movieron búsqueda/filtros a sheets y chips inferiores; dark-first
optimizado para OLED (YouTube: -43% de energía); skeletons sobre spinners.

### 8 patrones móviles aplicables al dashboard de Onia

1. **Bottom tab bar de 4-5 destinos + "Más"**: Inicio · Agenda · Clientes (vocabulario
   por rubro vía `lib/onboarding/vocabulario.ts`) · Cobros · Más. Icono + label siempre,
   >= 48dp por ítem, safe area respetada. Re-tap del tab activo = scroll to top.
2. **Bottom sheet con detents (medio/completo) en vez de modal centrado**: filtros de
   listas, detalle rápido de un cliente/cita, confirmaciones y acciones de un registro.
   Drag handle visible, cierre por swipe-down o tap en el fondo dimmed. Nunca para forms
   largos ni tablas.
3. **Chip row horizontal dentro del sheet o bajo el header** (patrón Spotify Library)
   para filtrar listas: estado de cita, rubro, rango de fechas, estado de pago. Un tap =
   un filtro; el estado del filtro persiste en la URL.
4. **Barra de acción sticky inferior con EL CTA primario de la vista** (thumb-zone):
   "Nueva cita", "Registrar cobro", "Agregar cliente". Una sola acción primaria por
   pantalla; lo que exige estirar al tercio superior se baja o se mete al sheet.
5. **Swipe actions en filas de lista**: swipe corto revela 2-3 acciones (confirmar cita,
   cobrar, llamar/WhatsApp); swipe completo ejecuta la primaria. Acción destructiva =
   confirmación o undo, nunca directa.
6. **Skeleton screens + pull-to-refresh**: skeleton con el layout real de KPIs/listas
   (no spinner) al cargar; pull-to-refresh con haptic/indicador en listas de agenda y
   cobros. Spinner solo para esperas < 3s de estructura impredecible.
7. **Stack navigation lista → detalle con back predecible, máx 3-4 niveles**: el back
   preserva scroll y filtros; toda pantalla clave (cita, cliente, cobro) con deep link —
   crítico porque las alertas del bot de WhatsApp/agentes deben abrir la pantalla exacta.
8. **Empty states accionables**: ilustración/icono + explicación + CTA ("Aún no hay
   citas hoy — Agendar la primera"). Prohibido "No hay datos". Primer uso del dashboard
   por rubro recién encendido = todo empty states; venden o matan el onboarding.

### Ideas transferibles extra (web/dashboard desktop)

- El patrón sheet+chips aplica también al dashboard web responsive: en < 768px los
  paneles laterales de filtros colapsan a bottom sheet, no a dropdown.
- Dark-first con 4 niveles de superficie mínimo si el dashboard adopta dark mode — pero
  solo como tema opcional; los rubros de Onia (clínicas, comercio) operan de día en claro.

### Qué NO copiar

- **Glassmorphism en tablas/forms/datos**: los trends 2026 lo empujan; es anti-pattern
  explícito para data UI (GPU-intensivo, contraste pobre). Solo overlays puntuales, y con
  fallback sólido.
- **Interfaces adaptativas "AI-native" que reordenan el layout por sesión**: rompen la
  memoria espacial del dueño de negocio que entra 20 veces al día; el dashboard de Onia
  es utilitario — layout estable.
- **Gestos compuestos sin fallback visible** (multi-swipe estilo Telegram): audiencia no
  tech-savvy; todo gesto debe tener equivalente visible tocable.
- **Hamburger para navegación primaria** y tutorial overlays al primer uso: patrones
  marcados "avoid 2026"; el uso de lo escondido en drawer cae fuerte.
- **Copiar pantallas literales** de Telegram/Spotify/Apple Maps: solo la mecánica del
  patrón; nada de layout/identidad de terceros (política de referencias de la factory).

**Licencia/costo:** research gratuito; solo estructura, inspiración-only (misma política
que Lapa/Mobbin en SOURCES.md §5b).
**Veredicto: INSPIRAR** (patrones a implementar con shadcn/vaul + Tailwind propios;
ninguna fuente es proveedora de código).

Fuentes: [Muzli — Mobile App Design Trends 2026](https://muz.li/blog/whats-changing-in-mobile-app-design-ui-patterns-that-matter-in-2026/) ·
[GenDesigns — Mobile UI Patterns 2026](https://gendesigns.ai/blog/mobile-ui-patterns-2026) ·
[UXPin — Mobile Navigation 2026](https://www.uxpin.com/studio/blog/mobile-navigation-examples/) ·
[DesignStudio — Mobile Navigation UX](https://www.designstudiouiux.com/blog/mobile-navigation-ux/)
