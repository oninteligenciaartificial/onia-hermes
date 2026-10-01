# Plan de rediseño visual 1.0.1 (antes de vender)

Borrador del 29-sep-2026 para Sergio Urcullo. No es la 1.1: es la pasada visual sobre lo que ya
existe, para que la 1.0 deje de verse **vacía y con mucho texto**. La etapa vigente es cerrar 5
clientes (`H/hermes-content/docs/ONIA_ESTRATEGIA_DE_EMPRESA.md` §7, Etapa 1). Por eso este plan
no agrega funciones: saca ruido y pone jerarquía.

Rutas abreviadas como en `REGLAS_UI_ONIA.md` (R# = regla de ese doc).

**Esfuerzo**
- **S** = menos de medio día de un subagente.
- **M** = alrededor de 1 día.
- **L** = 2 a 3 días.

**Condiciones que vienen de CLAUDE.md**
- Cada pantalla terminada se muestra renderizada a Sergio Urcullo antes de publicarla. Construir
  y publicar son dos permisos distintos.
- En platform, el push lleva su OK.

---

## 0. Antes de tocar nada (S, bloqueante)

1. **Re-verificar mirando.** Capturar `/dashboard`, `/pending`, `/agents`, `/patients/[id]`, el checkout, `/settings/chatbot`, el panel de comercio y Caja, en claro y oscuro, a 375 y 1440 px. La brecha técnica del 30-ago viene de leer código, no de capturas (`DS/2026-08-30-como-se-hace-un-dashboard.md` §5).
2. **Tres posibles bugs de datos** que la auditoría vio en capturas:
   - La propuesta del Reprogramador para Jorge Rivas dice "Se envía por WhatsApp a Lucía Mendoza" (`pulido-final/3-pending-375.png`). Si el mapeo de destinatario está mal, es un envío al paciente equivocado: va primero.
   - "No se pudo cargar el hilo" y "Sin comentarios" aparecen a la vez (`pulido-final/6-ficha-documentos-375.png`).
   - Los botones del panel de comercio salen como texto plano en `pulido-final/5-comercio-panel-1280.png`, aunque el CSS existe (`dashboard-v2.css:132`). Puede ser la captura o puede ser una regresión.
3. **Anotar la base:** `BASE=$(git rev-parse origin/main)` del repo platform (`H/CLAUDE.md` §4, "main se mueve debajo tuyo").
4. **Dos decisiones que son de Sergio Urcullo** (ver §4). Sin ellas, el color del primario queda provisorio.

---

## 1. Lo transversal: lo que más cambia la percepción

Va primero porque arregla todas las pantallas a la vez.

### 1.1 Liberar el celular de barras que tapan (M) → R11, R12

- **Qué:** llevar el asistente al centro de la barra inferior y quitar la barra flotante "Preguntá por tu negocio" en celular. En celular, las acciones del botón (+) pasan a la hoja del asistente o a "Más"; en escritorio el (+) queda. La barra queda en 5 ítems: Inicio · Agenda · [Asistente] · Pacientes · Más. "Reportes" va a Más. El selector de tema pasa al perfil. Hay que reservar abajo el alto de la barra más 16 px.
- **Archivos:** `P/components/layout/LayoutShell.tsx:128-137`, `BottomNav.tsx`, `P/app/globals.css:1571-1600` (`.ba-raiz`).
- **Referencias:** https://ui.shadcn.com/docs/components/drawer ("Más" abre una hoja; se apoya en `@base-ui/react`, que ya está instalado); `VI/2026-08-16-nutriapp-modulo-vertical.md` (5 destinos con la acción al centro).
- **En el celular:** hoy ~206 de 812 px son cromo fijo. Después quedan ~120 px (header y barra), y ningún botón queda tapado.

### 1.2 Pasada de texto: las definiciones van a "¿qué es?" (M) → R7, R8, R9

- **Qué:**
  - Las definiciones de cada fila, agente o aviso de Meta pasan a un ícono "i" con popover.
  - El subtítulo queda en 1 línea y ningún párrafo pasa de 2.
  - Un aviso repetido se muestra una vez, como banner descartable.
  - Cambios de jerga: "Recall" pasa a "Volver a citar", "Add-on" a "Extra", la fecha con segundos a "hace 2 h" y el link largo a un chip "Link para reservar".
- **Referencias:** `VI/2026-08-23-cosecha-escalera-ruim-bom-excelente.md`; `UP/panel-claro-premium/index-v5.html` (pasada sustractiva).
- **En el celular:** el primer pantallazo del Inicio deja de ser texto gris y muestra una cifra.

### 1.3 Kit mínimo de componentes (L) → R19-R22, R29

Hay que crear o adoptar seis piezas en `P/components/ui/`:

| Pieza | Qué es | Referencia |
|---|---|---|
| `card.tsx` (ya existe, 0 importadores) | Hoja flat/raised/inset + CardHeader mono | `P/DESIGN.md` §Sombras |
| `button.tsx` (existe, 1 importador) | Primario sólido y oscuro, 44 px, 3 estados, deshabilitado gris con motivo | `UP/upload-button/index.html` |
| `Field.tsx` (nuevo) | label + input/select + error, 16 px de letra, 44 px de alto | reemplaza 28 `inputClass` |
| `KpiTile.tsx` (reemplaza a `StatCard`, que tiene 0 importadores) | Etiqueta mono, valor, delta con signo, frase narrativa, `Sparkline` y `href` obligatorio | `P/components/dashboard/Sparkline.tsx` (ya existe); https://efferd.com/blocks/dashboard |
| `EmptyState.tsx` (nuevo) | Ícono + 1 frase que dice cuándo se llena + 1 acción obligatoria | https://21st.dev/s/empty-state; `pulido-final/1-guia-control-se-abre-375.png` |
| `PropuestaCard.tsx` (nuevo) | Avatar con iniciales, nombre, motivo en 1 línea, tiempo relativo, primario "Revisar/Aprobar" y menú ⋯ | `UP/dashboard-minimal/README.md` (propone y espera) |

- **No se instala nada.** Recharts y motion quedan fuera: alcanza con el SVG de `Sparkline` y con `tw-animate-css`, que ya está instalado.
- **Gates:** hay que instalar los RATCHET de R19, R20 y R21 en el mismo PR, para que la deuda no crezca mientras se migra.

### 1.4 Estados vacíos en lugar de ceros (M) → R29, R30

- Si toda la grilla está en cero, se esconde y queda una sola acción.
- Cada lista vacía lleva un `EmptyState`.
- Se agrega `error.tsx` a las secciones de la barra inferior. Hoy solo existe el de la raíz de `(dashboard)`.
- **En el celular:** el panel de comercio sin ventas pasa de 2.329 px de ceros a un pantallazo con un botón.

---

## 2. Pantallas, en orden de impacto

### 2.1 Inicio dental `/dashboard`: M, prioridad 1

| Cambio | Referencia |
|---|---|
| Hoja protagonista con 2 `KpiTile`: "Pacientes que volvieron" y "Te pagaron (Bs)", cada una con frase narrativa y un "i" con la definición | `UP/dashboard-minimal/panel-hoy-mobile.png`; `DS/2026-08-30-como-se-hace-un-dashboard.md` §2.5 |
| "Todavía sin resultados" y el párrafo del asistente se vuelven 1 chip "Activá el asistente →" | R7 |
| Las propuestas dejan la grilla de 3 columnas y pasan a lista vertical de `PropuestaCard`; en celular, carrusel horizontal con snap | `VI/2026-08-20-sintesis-lote-13.md` T4 |
| "Facturas abiertas" se oculta si no hay ninguna | `P/app/(dashboard)/dashboard/panel-hoy.tsx:408-418` |
| La agenda es la protagonista: hora en mono a la izquierda y chip solo en lo que pide acción | `UP/dashboard-minimal/README.md` |

**En el celular (375 px):**
1. Saludo y frase del día.
2. Las decisiones pendientes (1 visible y el resto plegado).
3. Las 2 cifras.
4. La agenda.
5. "Nueva cita" fija abajo.

### 2.2 Pendientes `/pending`: S + M, prioridad 2

| Cambio | Esfuerzo |
|---|---|
| Arreglo inmediato: `flex-wrap` o columna en la fila de botones (`pending-client.tsx:341`) y `min-h-11` | S |
| `PropuestaCard` compacta: primario "Aprobar y enviar" de ancho completo en celular y "Rechazar" como texto; el mensaje colapsado a 2 líneas con "Ver mensaje" | M |
| El aviso "Conectá tu WhatsApp" pasa a un banner único arriba | S |
| Deslizar para aprobar o rechazar, con toast "Deshacer": **después**, solo si hay tiempo (patrón de bandeja) | M |

**En el celular:** cada propuesta ocupa ~120 px en vez de ~300, y "Rechazar" deja de quedar cortado.

### 2.3 Agentes `/agents`: M, prioridad 3

| Cambio | Referencia |
|---|---|
| Arriba, un resumen de una línea: "Este mes tus agentes prepararon 3 mensajes → 1 paciente volvió" (con datos reales; si es cero, `EmptyState`) | `UP/hero-onia/ui-viva/capturas/hero-375-v2.png` (línea de tiempo del agente) |
| Cada agente como tarjeta de "empleado": ícono, nombre con verbo ("Vuelve a citar"), interruptor Activo, última corrida en tiempo relativo y 2 cifras (propuestas / aprobadas); el párrafo pasa a "¿Qué hace?" | `revision-1.0/c-agents.png` |
| En escritorio, grilla de 2 columnas (hoy `max-w-3xl` deja ~160 px vacíos por lado) | `P/app/(dashboard)/agents/agents-view.tsx:149` |
| "Acciones propuestas" muestra las 3 últimas y "Ver todas en Pendientes"; el borrador aparece solo al abrir | R4 |

**En el celular:** una columna de tarjetas cortas, con el resumen arriba.

### 2.4 Checkout de plan: M, prioridad 4 (es donde se cobra)

| Cambio | Referencia |
|---|---|
| En celular, los planes pasan a un segmented o carrusel con el plan actual preseleccionado, para que el QR entre en el primer o segundo pantallazo (hoy la página mide 4.398 px) | `pulido-final/2y4-checkout-375.png` |
| Pago en 3 pasos numerados (Escaneá → Pagá Bs X → Subí la captura) en lugar del párrafo de 5 líneas | `VI/2026-08-19-portal-cliente-onboarding-spec.md` |
| Un solo monto grande con el botón "Copiar", en vez de 3 repeticiones | R4 |
| "Enviar comprobante" usa Button de 3 estados y, deshabilitado, va en gris con el motivo | `UP/upload-button`; R21 |
| En escritorio: los planes en 4 columnas y el formulario sticky junto al QR | `revision-1.0/a-checkout.png` |

Los montos se leen de `P/lib/subscription-plans.ts`. No se escriben a mano.

### 2.5 Ficha del paciente `/patients/[id]`: M, prioridad 5

| Cambio | Referencia |
|---|---|
| Un encabezado protagonista: avatar, nombre, teléfono con botón WhatsApp, próximo turno, saldo y 3 acciones (Agendar · Cobrar · Receta) | `revision-1.0/e-ficha-plan.png` |
| En celular, pestañas en vez de 6 tarjetas apiladas: Tratamiento · Odontograma · Cobros · Notas | `P/app/(dashboard)/patients/[id]/page.tsx:150,183,339` |
| El plan de tratamiento con barra de progreso ("1 de 3 sesiones") | `VI/2026-08-20-sintesis-lote-13.md` T4 (timeline con punto relleno/hueco) |
| Un solo estado de error, con "Reintentar" | R30 |

### 2.6 Agente conversacional `/settings/chatbot` y su extra: M, prioridad 6

| Cambio | Referencia |
|---|---|
| "Probá tu bot" con una conversación de ejemplo ya renderizada (burbujas y chips de preguntas sugeridas), armada con los datos que cargó el cliente | `VI/2026-08-11-checkout-tarjeta-animada-3d.md` (vista previa en vivo) |
| Los avisos de Meta pasan a 1 línea con "Ver detalle" | R8 |
| Los canales pasan a filas con estado (Conectado / Sin conectar) y un botón | `UP/sidebar-nav` / patrón Hostinger (`memory/ui-des-ia-sistema-instalado.md`) |
| En el extra: subtítulo de 1 línea, medidor "N / cupo conversaciones" y "Lo que hizo este mes" (con datos reales) | `H/web-factory/docs/DESIGN_LEARNED_2026.md` §3b (Billing & Usage); el cupo sale de `P/lib/pricing.ts` |

### 2.7 Comercio (panel Hoy y Caja): L, prioridad 7

El rubro vendible hoy es dental/estética (Etapa 1). Comercio va después.

- **Panel Hoy:** `EmptyState` si no hay ventas. Con datos: "Cobrado hoy" con delta y sparkline de 7 días, "Cómo te pagaron" como una sola barra apilada con tokens `--chart-*`, y "Nueva venta" sólida y fija abajo en celular. Se saca la plantilla "Bs 0,00 a 64 px".
- **Caja:** buscador y grilla de productos frecuentes que se agregan con un toque; los 4 métodos de pago como botones grandes con ícono; "Cobrar Bs X" fijo abajo con 56 px de alto; "Cerrar caja" en una hoja aparte. Referencia: `UP/floating-cart/index.html` (barra que aparece con el primer ítem).
- **Recapturar con fixtures coherentes.** Hoy dice "Sonrisa Norte" en un comercio (`pulido-final/5-comercio-panel-1280.png`).

---

## 3. Orden de ejecución sugerido

Los carriles de dos filas pueden correr en paralelo **si** no tocan los mismos archivos.

| # | Qué | Esfuerzo | Depende de |
|---|---|---|---|
| 1 | §0: verificación y bug del destinatario | S | — |
| 2 | §1.3: kit de componentes + gates RATCHET | L | 1 |
| 3 | §1.1: barras del celular | M | 1 |
| 4 | §2.2: arreglo inmediato de la fila de botones de Pendientes | S | — |
| 5 | §1.2 + §2.1: pasada de texto e Inicio | M | 2 |
| 6 | §2.2 + §2.3: Pendientes y Agentes | M | 2 |
| 7 | §1.4: estados vacíos y `error.tsx` | M | 2 |
| 8 | §2.4: checkout | M | 2 |
| 9 | §2.5, §2.6 | M + M | 2 |
| 10 | §2.7: comercio | L | 2, 7 |

**Hecho** quiere decir que se cumplen las cuatro cosas:
1. `e2e/v1/reglas-ui.spec.ts` pasa a 375, 390 y 1440 px, en claro y oscuro.
2. Los RATCHET no suben.
3. Las capturas se miraron.
4. Sergio Urcullo aprobó la pieza renderizada.

Recién después va el deploy, según la skill `onia-deploy`.

## 4. Decisiones que son de Sergio Urcullo (no las tomo yo)

1. **Color del acento del panel:** petróleo `#12616B` (`P/DESIGN.md`) o verde `#027650` (el checkout y la guía). Hoy conviven, y en celular el logo "ON" verde contradice el "onia" de escritorio.
2. **Ley tipográfica única:** Archivo + Geist Mono, que es la que corre en producción, contra las otras que aparecen en la galería. Detalle en `COMO_APRENDO_Y_ORDEN.md`.
