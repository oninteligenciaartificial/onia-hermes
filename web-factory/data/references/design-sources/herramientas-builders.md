# Herramientas / Builders — Google Stitch · 10x App Builder · Haikei

Grupo: `herramientas-builders` · Cosecha: 2026-08-16
Contexto previo: Stitch ya figura en `SOURCES.md` §5 como "stitch MCP — primario" del
pipeline visión (ref → código), y `10x.app` ya figura en §5b como referencia de ritmo
de landing ("estructura solamente"). Este doc profundiza lo NO cubierto: qué flujo
concreto de la factory sirve Stitch vía MCP, qué ES realmente el 10x App Builder (y su
licencia), y el estado de licencia de Haikei.

---

## 1. Google Stitch (stitch.withgoogle.com)

### Qué es

Generador de UI de Google Labs impulsado por Gemini. Texto → pantalla de alta
fidelidad; también acepta sketches/screenshots como input. Gratis: ~350
generaciones/mes en modo Standard (Gemini Flash) y ~50/mes en modo Experimental
(Gemini Pro); corre Gemini 3 desde dic-2025. Exporta a Figma y a HTML/CSS.

**Ya cubierta parcialmente** en `SOURCES.md` §5 (stub de visión). Lo nuevo: tenemos el
MCP conectado con herramientas concretas y 8 skills `stitch-*` instaladas — hay que
asignarle flujos, no solo listarlo.

### Qué ofrece concretamente (vía nuestro MCP)

- `create_project` / `generate_screen_from_text` — texto → pantalla.
- `edit_screens` — iteración conversacional sobre pantallas existentes.
- `generate_variants` — N direcciones visuales divergentes de una misma pantalla.
- `create_design_system` / `create_design_system_from_design_md` /
  `apply_design_system` — design system central aplicado a todas las pantallas.
- `upload_design_md` / `get_screen` — subir/extraer la especificación de diseño.
- Skills instaladas: `stitch-loop`, `stitch-generate-design`,
  `stitch-extract-design-md`, `stitch-extract-static-html`, `stitch-code-to-design`,
  `stitch-design-taste`, `stitch-manage-design-system`, `stitch-upload-to-stitch`.
- Producto web además: Annotate (feedback visual que la IA implementa), Prototypes
  (coser pantallas en flujos), export Figma.

### Para qué flujo de la factory sirve (evaluación pedida)

| Flujo | Sirve | Cómo |
|---|---|---|
| **Intake visual** (screenshot/Pinterest/sketch de Sergio o cliente → estructura) | ✅ primario | screenshot → screen editable → `stitch-extract-design-md` → tokens → shadcn. Cierra el stub de `harvester/vision/`. |
| **Divergencia barata pre-código** | ✅ | `generate_variants` da 3-5 direcciones por pantalla ANTES de codear; se elige 1 y se porta. Ataca el anti-pattern "primer draft genérico". |
| **Preview para propuestas** | ✅ | pantallas de dirección visual para que Sergio/cliente aprueben sin gastar horas dev. Ojo: la propuesta en sí sigue saliendo del generador oficial. |
| **Coherencia multi-página** | ✅ | design system central (`apply_design_system`) sobre todas las pantallas de un sitio. |
| **Código final de cliente** | ❌ nunca | su HTML/CSS exportado no es shadcn/token-native; siempre retokenizar a mano. |

### Ideas transferibles

1. **Variantes divergentes como paso formal del pipeline**: 3 direcciones por hero
   generadas en Stitch, elegir 1, portar a shadcn — en vez de iterar sobre un único
   draft mediocre.
2. **design.md como formato puente**: extraer especificación de diseño en markdown
   estructurado (paleta, tipografía, spacing) y de ahí alimentar tweakcn /
   `packages/tokens` — nunca copiar el CSS exportado.
3. **Annotate-loop para revisiones**: marcar feedback SOBRE la captura renderizada y
   que la IA lo implemente — mismo patrón para nuestras rondas con Sergio
   (screenshot anotado > lista de cambios en texto).
4. **Prototype de flujo antes de construir**: coser pantallas (onboarding, checkout,
   dashboard) para validar el FLUJO con el cliente antes de escribir una ruta Next.
5. **Screenshot→screen editable** para referencias con ToS restrictivo (Pinterest):
   se extrae estructura/jerarquía sin tocar el asset original.
6. **Design system primero, pantallas después**: crear el sistema desde design.md y
   aplicarlo a cada pantalla — refleja nuestro orden tokens→componentes→páginas.

### Qué NO copiar y por qué

- **No shippear su HTML/CSS exportado como código de cliente**: sin tokens shadcn,
  estilo genérico Google/Material-ish (viola la anti-template policy), a11y no
  garantizada.
- **No volverlo paso obligatorio del pipeline**: es Google Labs (experimento, sin
  SLA, puede morir), con cuota mensual (350/50). Es acelerador, no dependencia.
- **No usarlo para dashboards de datos complejos**: su fuerte es marketing/app
  screens; los dashboards salen de Tremor + shadcn.

### Licencia / costo

Gratis (Google Labs), login Google, cuotas mensuales. Output usable; el código
generado igual se retokeniza siempre, así que la licencia del export no es
bloqueante para nuestro flujo (nunca llega literal al cliente).

### Veredicto: **ADOPTAR** (ya cableado como MCP; rol fijo: intake visual + variantes + preview. Nunca código final.)

---

## 2. "10x App Builder" (10x.app · github.com/10x-app-builder/10x)

### Qué es (identificación pedida)

**No es una herramienta web.** Es un builder open-source de apps iOS NATIVAS para
macOS: describís la app en lenguaje natural y genera código SwiftUI de calidad
producción, arma el proyecto Xcode (XcodeGen) y la compila y previsualiza en el iOS
Simulator. Corre un loop agéntico client-side contra la API de Claude: plan mode
(investiga y planifica) → build mode (escribe SwiftUI con file tools) → compila →
lanza en el Simulator → **captura screenshot que vuelve a la UI como verificación**.
Requiere macOS 14+ y Xcode 16+.

Aclaración de inventario: el `10x.app` que ya está en `SOURCES.md` §5b como "ritmo de
landing SaaS/producto" es la LANDING de este producto — esa referencia estructural ya
está cubierta; no re-cosechar.

### Qué ofrece concretamente

- Pipeline plan→build conversacional para apps SwiftUI.
- Integración xcodebuild + simctl (compilar y controlar el Simulator por CLI).
- Loop de verificación visual automático (screenshot del Simulator de vuelta al chat).
- Auth por tokens con Supabase.

### Ideas transferibles

1. **Loop screenshot-de-vuelta como cierre de cada build**: compilar → levantar →
   capturar → LEER la captura antes de declarar hecho. Es exactamente nuestra regla
   "verificar es MIRAR" — acá está automatizada como paso del pipeline, no como
   disciplina manual. Vale portarla al generador de sitios: todo sitio generado
   termina con captura Playwright leída por visión.
2. **Plan mode separado de build mode** con gate explícito entre ambos: el agente no
   escribe código hasta que el plan existe — mismo patrón para encargos grandes de
   la factory.
3. **Agentic loop client-side con file tools acotados**: el agente solo puede tocar
   archivos vía tools declaradas, no shell libre — patrón de sandboxing para
   nuestros subagentes generadores.
4. **Simulator/preview como parte del contrato de "hecho"**: el build no reporta
   éxito por compilar, sino por correr y verse.

### Qué NO copiar y por qué

- **Nada de código**: licencia **PolyForm Noncommercial 1.0.0** — explícitamente en
  nuestra lista de licencias RECHAZADAS para trabajo de cliente (`SOURCES.md`).
  Solo lectura de arquitectura (study-only).
- **El producto en sí no aplica**: genera SwiftUI/iOS; nuestra factory es
  Next.js/shadcn/Tailwind. Cero solapamiento de output.

### Licencia / costo

PolyForm Noncommercial 1.0.0 (repo). App gratuita en beta (trae API de Claude vía
proxy propio). **Prohibido copiar código para cliente.**

### Veredicto: **DESCARTAR** como herramienta y como fuente de código. **Inspirar** solo en su loop plan→build→verify-con-screenshot (patrón, no código). Su landing sigue cubierta en §5b.

---

## 3. Haikei (haikei.app)

### Qué es

Web app gratuita de SVG generativos: fondos y shapes paramétricos exportables como
SVG/PNG. Sin login para uso básico; tier Pro con exports ilimitados.

### Qué ofrece concretamente (generadores)

- **Layered Waves / Stacked Waves / Wave** — divisores de sección ondulados.
- **Blob / Blob Scene** — formas orgánicas para heroes y decoración.
- **Blurry Gradient** — fondos de gradiente difuso (mesh-gradient-like).
- **Low Poly Grid** — malla poligonal (lee "tech/ingeniería").
- **Layered Peaks / Stacked Steps** — montañas/escalones para fondos de stats.
- **Circle Scatter / Circle Packing** — texturas de puntos.
- Cada uno con randomize + control de paleta, complejidad y contraste; export SVG
  liviano (típico < 10 KB).

### Ideas transferibles

1. **Divisor de sección con layered waves recoloreado por tokens**: reemplazar el
   corte recto entre secciones con un SVG cuyo `fill` es `var(--color-surface)` —
   asset theme-aware, no hardcodeado.
2. **Hero atmosférico a costo casi cero**: blurry gradient SVG de fondo (< 10 KB) en
   vez de imagen/video pesado — directo a nuestro presupuesto de LCP < 2.5s.
3. **Low-poly grid para el rubro ingeniería/industrial** del pattern bank: textura de
   fondo en dark sections sin stock photos.
4. **Circle scatter como grain sutil** detrás de cards de testimonios/stats — cubre
   la Required Quality "texture/atmosphere" sin JS.
5. **Stacked steps como fondo de pricing**: refuerza visualmente la escalera de
   niveles de nuestras propuestas (estar online → convertir → automatizar).
6. **Regla de integración**: todo SVG de Haikei entra al repo inline o como
   componente, con colores reemplazados por CSS vars ANTES de commitear — nunca el
   export crudo con hex hardcodeados.
7. **Mejor aún — generarlos nosotros**: blobs/waves son matemática simple
   (ruido + curvas Bézier). Un script propio en `packages/` los hace paramétricos
   por brand tokens y elimina la dependencia de licencia. Haikei queda como
   herramienta de exploración manual.

### Qué NO copiar y por qué

- **No usar blobs/waves por defecto en todo sitio**: son estética template-2021 muy
  reconocible; la anti-template policy los permite solo con moderación y
  recoloreados al theme. Un blob genérico multicolor grita "plantilla".
- **Ojo con la licencia del output**: el marketing dice "uso personal y comercial",
  pero sus ToS (haikei.app/terms) NO otorgan explícitamente licencia sobre los
  assets generados — solo hablan de contenido que el usuario sube. Riesgo real bajo
  (geometría generada), pero para assets centrales de un sitio de cliente preferir
  el script propio (idea 7).
- **No PNG**: siempre SVG; el PNG pierde la recoloración por CSS vars y pesa más.

### Licencia / costo

Gratis con límites de export; Pro pago para ilimitado. Uso comercial afirmado en su
marketing pero no explicitado en ToS → tratar como "allowed-after-review": OK para
fondos secundarios, regenerar con script propio si el asset es central.

### Veredicto: **INSPIRAR / adoptar con cautela** — útil ya para fondos SVG theme-aware; a mediano plazo reemplazar por generador propio paramétrico por tokens.

---

## Resumen de veredictos

| Fuente | Veredicto | Rol en la factory |
|---|---|---|
| Google Stitch (MCP) | **Adoptar** | Intake visual + variantes divergentes + preview de dirección. Nunca código final. |
| 10x App Builder | **Descartar** (PolyForm NC, iOS-only) | Solo inspiración del loop plan→build→verify-screenshot. |
| Haikei | **Inspirar** (cautela de licencia) | Fondos/divisores SVG recoloreados por tokens; migrar a script propio. |

---

## 4. Swishy.ai y Replit (reel IG `DdZZmsQtr2-`, 2026-09-18)

**Swishy.ai** — «AI motion designer»: texto → motion graphics, tipografías animadas, export
MP4/MOV/GIF (su galería: Instagram logo animation, Mario game, clock, scattered text, iOS
notification). Veredicto **Diferir**: la IA dibuja el visual, y la regla de la casa es que la
interfaz nunca la dibuja la IA. Único uso posible: piezas para redes del carril marca-personal,
nunca UI de cliente.

**Replit** — «What will you build? Turn ideas into apps in minutes». Builder agéntico por prompt
(Website · Mobile · Design · Slides · Animation). Veredicto **Descartar**: no es galería ni fuente
de diseño; el pipeline es Claude Code + Web Factory. Su caja única de entrada ya está medida
contra Durable/Hostinger/Wix/10Web en
`hermes-content/docs/historial/research/competencia/configuradores-web-ia-2026-09-17.md`.

| Fuente | Veredicto | Rol en la factory |
|---|---|---|
| Swishy.ai | **Diferir** | Solo motion graphics para redes; fuera de UI de cliente. |
| Replit | **Descartar** | Builder, no galería. |
