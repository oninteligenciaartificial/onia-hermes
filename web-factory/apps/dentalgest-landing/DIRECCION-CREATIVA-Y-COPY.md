# DentalGest Landing — Dirección creativa + copy completo (para el builder)

> Carril Arthur. Este doc es la fuente de verdad de diseño y copy. El builder implementa FIEL:
> no rediseña, no reescribe copy, no agrega secciones. Dudas → volver acá.
> Base: README-CARRIL.md + research C7 (`hermes-content/docs/research/ONIA_DENTALGEST_FISCAL_MERCADO_PRICING_20260725.md`).

---

## 0. Referencias internas exploradas (resumen)

- **Tokens de la casa** (`apps/site/src/app/globals.css`): Tailwind v4 + oklch. Fondo crema cálido
  `oklch(0.985 0.008 94)`, tinta azulada `oklch(0.165 0.015 250)`, primario teal profundo
  `oklch(0.42 0.13 169)`, acento ámbar `oklch(0.89 0.11 73)`, arcilla destructivo `oklch(0.56 0.18 28)`.
  Esta landing HEREDA esa familia cromática (coherencia de casa) pero define sus propios tokens locales
  (no importa nada de apps/site — regla del carril).
- **Pattern bank** (`WEB_FACTORY_PATTERN_BANK_2026.md`): DentalGest cruza dos rubros —
  *Clinic/Health* (calma, confianza alta, motion 2) y *SaaS/AI* (product proof, estructura, motion 5).
  Receta elegida: **Fast Landing** (hero → prueba → oferta → proceso → FAQ → CTA) con proof de producto real.
  Regla dura del bank: nunca screenshots "hechos de divs", nunca métricas inventadas.
- **Benchmarks de calidad ONIA**: Bench, Garabato, HSB Engineers (piso de jerarquía, ritmo y seriedad).
  `data/clients/dental-demo.*` existe pero es B2C (clínica captando pacientes); esta landing es **B2B**
  (venderle a la dentista) — se toma la calma clínica, no la estructura.
- **Motion standard de la casa**: `IntersectionObserver` + `data-reveal`, solo opacity/transform,
  `prefers-reduced-motion` obligatorio, smooth anchors. Sin librerías de animación.

---

## 1. Dirección visual: **"Libro de citas, no folleto de software"** (editorial-ledger clínico)

Concepto: la landing se ve como el cruce entre una **revista editorial seria** y el **talonario/recibo**
que la dentista conoce de memoria. Números grandes en tabular, bloques tipo "recibo" para la aritmética,
papel cálido, tinta profunda, un solo acento de plata (ámbar) y un solo acento de urgencia (arcilla).
Cero glow de IA, cero gradiente morado, cero ilustración 3D genérica.

**Por qué NO es genérica (3 líneas):**
1. El sistema visual sale del objeto real del rubro (el talonario de citas y la factura), no de un template SaaS: la aritmética se compone como recibo con tipografía tabular, no como "cards de features".
2. Pareja tipográfica con carácter (serif óptica display + grotesca humanista + mono tabular para Bs) en lugar del sans único de todo template.
3. El color es semántico y escaso — teal = producto/acción, ámbar = plata, arcilla = deadline — nunca decorativo; un template usa el acento en todo.

### 1.1 Paleta (tokens CSS locales de la app)

Light — "consultorio de día" (tema por defecto):

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `oklch(0.985 0.008 94)` | fondo papel cálido |
| `--bg-raised` | `oklch(1 0 0)` | cards/recibos |
| `--bg-inverse` | `oklch(0.20 0.02 220)` | secciones de tinta (aritmética, SIAT) |
| `--ink` | `oklch(0.17 0.015 250)` | texto principal |
| `--ink-soft` | `oklch(0.45 0.018 250)` | texto secundario |
| `--teal` | `oklch(0.42 0.13 169)` | primario: CTAs, links, plan Pro |
| `--teal-strong` | `oklch(0.35 0.12 169)` | hover primario |
| `--amber` | `oklch(0.78 0.13 78)` | SOLO plata: cifras Bs, bloque aritmética |
| `--clay` | `oklch(0.56 0.18 28)` | SOLO deadline SIAT (chip 1-oct) |
| `--line` | `oklch(0.86 0.015 250)` | bordes, filas de recibo (línea punteada) |

Dark — "guardia nocturna" (intencional, no invertido automático):

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `oklch(0.16 0.02 220)` | azul-verdoso profundo (no gris neutro) |
| `--bg-raised` | `oklch(0.21 0.022 220)` | cards |
| `--bg-inverse` | `oklch(0.985 0.008 94)` | las secciones de tinta se INVIERTEN a papel (el recibo brilla de noche) |
| `--ink` | `oklch(0.93 0.01 95)` | texto blanco cálido |
| `--ink-soft` | `oklch(0.68 0.015 240)` | secundario |
| `--teal` | `oklch(0.72 0.11 169)` | primario aclarado (contraste AA sobre bg) |
| `--amber` | `oklch(0.82 0.12 80)` | plata |
| `--clay` | `oklch(0.68 0.16 30)` | deadline |
| `--line` | `oklch(0.32 0.02 220)` | bordes |

Regla: verificar contraste AA (4.5:1 texto, 3:1 UI) en AMBOS temas. El toggle usa
`prefers-color-scheme` + clase manual opcional; ambos temas se diseñan, ninguno sale "por defecto".

### 1.2 Tipografía (via `next/font/google`, self-hosted, subset latin)

| Rol | Fuente | Uso |
|---|---|---|
| Display | **Fraunces** (variable, optical sizing, `soft` 0, wonk 0) | H1/H2, cifras protagonistas. Peso 550–640. |
| UI/Body | **Instrument Sans** (variable) | body, botones, nav, cards. 400/500/600. |
| Números/recibo | **JetBrains Mono** (solo peso 500, `font-variant-numeric: tabular-nums`) | precios Bs, filas del recibo, chips de fecha |

Máx. 2 familias cargadas con precarga (Fraunces + Instrument Sans); la mono se carga con
`display: swap` y un solo peso. Escala: `--text-hero: clamp(2.6rem, 1.4rem + 5.2vw, 5.2rem)`;
H2 `clamp(1.9rem, 1.2rem + 2.4vw, 3rem)`; body `clamp(1rem, 0.95rem + 0.3vw, 1.125rem)`.
Line-height display 1.05, body 1.6. Interletrado display −0.02em.

### 1.3 Espaciado y ritmo

- Base 4px. Secciones: `--space-section: clamp(4.5rem, 3rem + 6vw, 9rem)` — pero NO uniforme:
  el bloque aritmética y el SIAT (tinta) van pegados entre sí (mitad de espacio) para leerse como
  un solo "momento de plata y plazo"; el resto respira completo.
- Contenedor: max 1120px; el recibo de aritmética rompe a full-bleed con fondo `--bg-inverse`.
- Grid editorial: hero y planes usan 12 columnas; los bloques de producto usan bento desigual (ver wireframe).

### 1.4 Required Qualities exigidas (6 de la lista — mínimo 4)

1. **Jerarquía por contraste de escala** — H1 5.2rem Fraunces vs. body 1rem; las cifras Bs en el recibo a 3rem mono.
2. **Ritmo intencional de espaciado** — alternancia papel/tinta/papel con el par aritmética+SIAT comprimido a propósito.
3. **Profundidad/capas** — screenshots reales dentro de un marco de browser con sombra cálida doble (`0 1px 2px` + `0 16px 40px oklch(... / 0.12)`) y una tarjeta-chip de WhatsApp superpuesta (−12px overlap) sobre la esquina del screenshot del hero.
4. **Tipografía con carácter** — Fraunces óptica + Instrument Sans + mono tabular; ningún template usa esta pareja.
5. **Color semántico** — teal solo acción, ámbar solo plata, arcilla solo deadline. Prohibido usar el acento "porque queda lindo".
6. **Estados hover/focus diseñados** — CTA WhatsApp: fondo `--teal`→`--teal-strong` + la flecha `→` se desplaza 4px (transform, 200ms); links: subrayado grueso 2px que crece desde la izquierda; focus visible: ring 2px `--teal` con offset 2px en TODO elemento interactivo.
7. **Composición editorial/bento** — sección "qué hace" en bento 2×2 desigual (una celda doble con screenshot, tres celdas simples).
8. **Motion que clarifica** — reveal con IntersectionObserver (fade + 12px rise, stagger 60ms), contador NO animado en cifras de plata (los números fiscales no bailan: aparecen firmes), `prefers-reduced-motion` desactiva todo.

### 1.5 Reglas de assets

- **Screenshots: SOLO capturas reales de DentalGest** (repo DentaGest, app real). Nunca UI falsa hecha de divs, nunca mockup inventado.
- Si al momento de buildear no hay captura real disponible para una celda: usar un marco vacío con la etiqueta `Captura real del sistema — pendiente` (borde punteado `--line`). Honesto > bonito.
- Imágenes con `width`/`height` explícitos, hero `fetchpriority="high"`, resto `loading="lazy"`, AVIF/WebP.
- Sin fotos stock de dentistas sonriendo. Sin retratos generados.

### 1.6 Performance / técnica (gates)

- < 150 kb JS gzip. Sin framer-motion, sin librería de UI. CSS puro + un `IntersectionObserver` inline.
- `npx tsc --noEmit` y `pnpm build` verdes en esta app. Responsive 375/768/1440 verificado.
- Semántica: `header/nav/main/section[aria-labelledby]/footer`. Un solo H1.

---

## 2. COPY COMPLETO (ES boliviano, voseo — implementar textual)

> Reglas de compliance ya aplicadas (research C7): nunca "por ley tenés que comprarnos";
> el agente REPROGRAMA (no "recuerda"); datos regionales marcados como regionales;
> cero testimonios/cifras de clientes inventados; cero SLA; portal gratis del SIN dicho de frente.

### Constantes

```
WHATSAPP_URL = https://wa.me/PLACEHOLDER?text=Hola%2C%20quiero%20una%20DEMO%20de%20DentalGest
APP_URL      = APP_URL  (placeholder hasta tener URL real)
```

### (a) HERO

- **Etiqueta superior (eyebrow, mono, chip):** `Software de gestión dental · Bolivia`
- **H1:** `Tu agenda llena no sirve si la silla queda vacía.`
- **Subtitular:** `DentalGest maneja tu clínica dental completa: agenda, historias clínicas, facturación SIAT y un agente que reprograma a los pacientes que te fallan — todo por WhatsApp, sin planillas ni cuaderno.`
- **CTA primario (botón teal, WhatsApp):** `Quiero una demo por WhatsApp →`
- **CTA secundario (botón fantasma):** `Entrar a la app`
- **Microcopy bajo los CTAs (mono, chico):** `Precios de lanzamiento · Implementación y migración incluidas`
- **Visual:** screenshot real de la agenda de DentalGest en marco browser; chip superpuesto estilo mensaje de WhatsApp con el texto: `✓ Reprogramado: María P. pasó del jue 15:00 al vie 10:30` (es copy de UI ilustrativo del flujo, no un caso real — mantenerlo como está, sin nombre completo ni datos reales).

### (b) EL PROBLEMA — "Lo que te está costando plata hoy"

- **H2:** `Tres agujeros por donde se te va la plata`
- **Intro (1 línea):** `No es falta de pacientes. Es lo que pasa entre una cita y la siguiente.`

Tres columnas numeradas (estilo ledger: número mono grande + título + texto):

1. **`01 · La silla vacía`**
   `Un paciente de ortodoncia que no llega son Bs 300–350 que no entran — y una hora que nadie más ocupa. En odontología de la región se pierde entre el 10% y el 30% de las citas (datos de Colombia y Chile; en Bolivia todavía no hay estudio publicado).`
2. **`02 · El cuaderno`**
   `La agenda en cuaderno, las historias en carpetas y los saldos en la cabeza. Cuando la asistente falta un día, la clínica queda ciega.`
3. **`03 · Perseguir cobros`**
   `Tratamientos largos, cuotas que nadie anota, pacientes a los que da vergüenza cobrarles por tercera vez. Lo que no se cobra a tiempo, casi nunca se cobra.`

### (c) QUÉ HACE DENTALGEST — bento 4 bloques

- **H2:** `Una sola herramienta para operar tu clínica`
- **Intro:** `DentalGest no es "un sistema más para llenar". Es el que trabaja mientras vos atendés.`

**Bloque 1 (celda doble, con screenshot real de agenda/odontograma):**
- **Título:** `Agenda + odontograma en un solo lugar`
- **Texto:** `Citas, historias clínicas y odontograma digital por paciente. Abrís la ficha y ves todo: qué se hizo, qué falta, cuánto debe. Sin carpetas, sin buscar en el cuaderno.`

**Bloque 2:**
- **Título:** `Facturá al SIAT sin tipear`
- **Texto:** `Terminás el tratamiento, apretás un botón y la factura sale al SIN con los datos que ya están en el sistema. Nada de re-tipear paciente por paciente en otra página.`

**Bloque 3:**
- **Título:** `Un agente que reprograma y cobra`
- **Texto:** `Cuando un paciente cancela o no confirma, el agente de DentalGest le ofrece otro horario y llena el hueco. Y cuando hay una cuota pendiente, manda el cobro con QR — sin que vos tengas que perseguir a nadie. Vos aprobás, él ejecuta.`

**Bloque 4:**
- **Título:** `Todo por WhatsApp`
- **Texto:** `Tus pacientes ya viven en WhatsApp — es la app número 1 de Bolivia. Confirmaciones, reprogramaciones y cobros llegan por donde la gente sí responde. Vos también: consultale al sistema tu día sin abrir la computadora.`

### (d) LA ARITMÉTICA — recibo full-bleed (fondo tinta, tipografía mono)

- **H2 (en el recibo):** `Hacé la cuenta, no la fe`
- **Cuerpo del recibo (filas con línea punteada, cifras en ámbar tabular):**

```
Ajuste de ortodoncia que no llegó .......... Bs 300–350
Segundo ajuste perdido en el mes ........... Bs 300–350
                                             ----------
Dos ausencias al mes ....................... Bs 600–700

DentalGest Pro, por mes .................... Bs 750
```

- **Remate (Fraunces, grande):** `El plan Pro (Bs 750) cuesta menos que dos ausencias de ortodoncia (Bs 300–350 cada una). Si el agente te salva dos citas al mes, ya se pagó.`
- **Línea secundaria (chica):** `¿Trabajás casos grandes? Una sola endodoncia multirradicular recuperada (Bs 2.100) paga el plan Full (Bs 1.500) y te sobran Bs 600.`

### (e) BLOQUE SIAT — timing honesto (pegado al recibo, mismo fondo tinta, chip arcilla)

- **Chip (mono, arcilla):** `30-SEP-2026 · fin del plazo`
- **H2:** `Desde el 1 de octubre, solo se factura en línea`
- **Texto:** `El SIN fijó el 30 de septiembre de 2026 como plazo para pasarse a la facturación en línea. Dejalo resuelto antes — no en la última semana, con todos haciendo el mismo trámite.`
- **Disclaimer honesto (destacado en caja con borde, NO letra chica):** `Hablando claro: podés cumplir gratis con el Portal Web del SIN, tipeando cada factura a mano en su página. DentalGest existe para que no tengas que hacerlo — la factura sale sola, con los datos que ya cargaste una vez.`
- **CTA (repetición, botón teal):** `Dejalo resuelto — hablemos por WhatsApp →`

### (f) PLANES — 3 cards, Pro destacado

- **H2:** `Elegí cuánto querés que trabaje solo`
- **Intro:** `La facturación SIAT viene incluida en los tres planes. Lo que sube de nivel es cuánto se automatiza tu clínica.`
- **Chip global (mono):** `Precios de lanzamiento`

**Card 1 — BÁSICO · Bs 320/mes**
- **Tagline:** `Ordenar la clínica`
- Incluye:
  - `Agenda de citas y ficha por paciente`
  - `Historia clínica y odontograma digital`
  - `Facturación SIAT integrada`
  - `Registro de pagos y saldos por tratamiento`
  - `Botón de WhatsApp para tus pacientes`
- **Nota de cierre:** `Bs 320 = lo que cobrás por tres consultas.`

**Card 2 — PRO · Bs 750/mes — DESTACADA (borde teal, chip "El plan recomendado", escala +4%)**
- **Tagline:** `Cobrar y no perder pacientes`
- **Todo lo del Básico, más:**
  - `Agente que reprograma: cancelación o silencio → ofrece otro horario y llena el hueco`
  - `Confirmación de citas por WhatsApp`
  - `Cobranza con QR: cuotas y saldos reclamados solos, con tu aprobación`
  - `Reactivación de pacientes que dejaron el tratamiento a medias`
- **Nota de cierre (ámbar):** `Menos que dos ausencias de ortodoncia al mes.`

**Card 3 — FULL · Bs 1.500/mes**
- **Tagline:** `La clínica opera sola`
- **Todo lo del Pro, más:**
  - `Varios profesionales y sillones en la misma agenda`
  - `Agentes 24/7 sobre toda la operación: agenda, cobros y seguimiento`
  - `Reportes de producción por profesional y tratamiento`
  - `Acompañamiento prioritario de ONIA`
- **Nota de cierre:** `Media endodoncia multirradicular al mes.`

- **Franja bajo las cards:** `Implementación y migración de tus datos: incluidas, sin costo de setup. Pagás por QR; si preferís, trimestral adelantado.`
- **CTA (repetición, centrado):** `Quiero una demo por WhatsApp →` + secundario `Entrar a la app`
- **Letra chica (una sola línea, honesta):** `Precios de lanzamiento en bolivianos, sujetos a ajuste con preaviso. Sin permanencia forzada.`

### (g) FAQ — 5 preguntas (acordeón accesible, `<details>` nativo)

**1. ¿Necesito comprar un software para cumplir con el SIN?**
`No. El SIN tiene un Portal Web gratuito donde podés emitir tus facturas tipeándolas una por una. DentalGest te sirve si querés que la factura salga sola desde la ficha del paciente, sin re-tipear nada — y que además la clínica entera (agenda, historias, cobros) viva en el mismo lugar.`

**2. ¿Mis datos y los de mis pacientes están seguros?**
`Sí. Tus datos viven en una base de datos cifrada con respaldos automáticos, y cada clínica accede solo a lo suyo con usuario y contraseña. Las historias clínicas son tuyas: si un día te vas, te llevás tus datos.`

**3. ¿Qué pasa si se corta el internet en el consultorio?**
`DentalGest funciona desde cualquier dispositivo con conexión — computadora, tablet o tu celular. Si el wifi del consultorio se cae, seguís operando con los datos del teléfono. Y las citas y mensajes de tus pacientes se procesan en la nube, así que nada se pierde mientras tanto.`

**4. ¿Cuánto cuesta empezar? ¿Hay costo de instalación?**
`No. La implementación y la migración de tus datos (pacientes, historias, saldos) están incluidas en cualquier plan. Pagás la mensualidad y nada más. Empezás con una demo por WhatsApp, sin compromiso.`

**5. ¿El agente responde solo? ¿Y si dice algo que no quiero?**
`El agente trabaja con tu aprobación: propone la reprogramación o el cobro, y vos decidís con un toque si sale o no. Nada se envía a un paciente sin que lo hayas autorizado. Con el tiempo, vos elegís qué cosas puede hacer solo.`

### (h) FOOTER

- **Bloque CTA final (arriba del footer, fondo teal, texto papel):**
  - **Título (Fraunces):** `¿Cuántos pacientes te fallaron este mes sin avisar?`
  - **Texto:** `Hacé la cuenta a Bs 300 el ajuste. DentalGest cuesta menos que dos de esas ausencias.`
  - **CTA:** `Quiero una demo por WhatsApp →` + `Entrar a la app`
- **Footer propiamente:**
  - Columna 1: logotipo `DentalGest` (wordmark Fraunces) + línea: `Gestión de clínicas dentales, hecho en Bolivia.`
  - Columna 2 — Contacto: `WhatsApp` (link click-to-chat) · `Entrar a la app` (APP_URL)
  - Columna 3 — Legal: `Un producto de ONIA · Santa Cruz de la Sierra, Bolivia` · `© 2026 ONIA`
  - Línea inferior (mono, chica): `Los datos de inasistencia citados son de estudios de Colombia y Chile; en Bolivia no existe aún un estudio publicado. Precios de lanzamiento sujetos a ajuste con preaviso.`

---

## 3. WIREFRAME TEXTUAL (orden + layout por sección)

Mobile-first. Anotado para 375 / 768 / 1440.

```
┌─ HEADER (sticky, papel translúcido + blur suave, borde inferior --line) ─┐
│ [DentalGest wordmark]        [Entrar a la app] [WhatsApp →] (botón teal) │
│ · 375: wordmark + botón WhatsApp solo (icono+texto corto "Demo")         │
└──────────────────────────────────────────────────────────────────────────┘

1. HERO (papel)
   · 1440: grid 12 col — copy 6 col izq / visual 6 col der
   · 375: apilado, copy primero, visual después
   [eyebrow chip mono]
   [H1 Fraunces 5.2rem]
   [subtitular 1.125rem, max 52ch]
   [CTA teal WhatsApp] [CTA fantasma app]
   [microcopy mono]
   → visual: screenshot real en marco browser, rotación 0 (serio),
     chip WhatsApp superpuesto esquina inferior izq (overlap -12px),
     sombra cálida doble. Reveal: fade+rise al cargar (no scroll).

2. EL PROBLEMA (papel, sin card ninguna — editorial puro)
   [H2 centrado] [intro centrada]
   · 1440/768: 3 columnas con separador vertical punteado --line
   · 375: apilado con separador horizontal
   Cada col: [01 mono 2.5rem ámbar] [título 600] [texto ink-soft]

3. QUÉ HACE (papel, bento)
   [H2 izq] [intro izq, max 52ch]
   · 1440: bento 2x2 desigual: fila 1 = celda A doble (8col, screenshot
     agenda/odontograma) + celda B (4col). fila 2 = celda C (5col) + celda D (7col).
   · 768: 2x2 parejo. · 375: apilado.
   Celdas: bg-raised, borde --line, radio 12px, hover: sombra sube 2px
   (transform), NUNCA cambia layout.

4. ARITMÉTICA (full-bleed, --bg-inverse "tinta")           ┐ par comprimido:
   [H2] [recibo mono con líneas punteadas, cifras ámbar]   │ mitad de
   [remate Fraunces 2rem] [línea endodoncia chica]         │ --space-section
5. SIAT TIMING (mismo fondo tinta, continúa)               │ entre 4 y 5
   [chip arcilla 30-SEP] [H2] [texto]                      ┘
   [caja disclaimer honesto — borde 1px papel, NO letra chica]
   [CTA teal]
   · recibo: max 560px centrado; 375: fuente mono baja a 0.8rem, sin overflow-x

6. PLANES (papel)
   [H2 centrado] [intro] [chip "Precios de lanzamiento"]
   · 1440: 3 cards en fila, Pro al centro +4% escala, borde teal 2px,
     chip "El plan recomendado" solapado arriba
   · 768: 3 cards apretadas o 2+1; · 375: apiladas, PRO PRIMERO
   [franja implementación incluida]
   [CTA repetido centrado]
   [letra chica 1 línea]

7. FAQ (papel)
   [H2] + 5 <details> nativos, borde inferior --line,
   icono +/− rotando (transform 200ms), max 720px centrado

8. CTA FINAL (full-bleed teal, texto papel)
   [Título Fraunces] [texto cuenta] [CTA blanco/papel + fantasma]

9. FOOTER (tinta en light / raised en dark)
   3 columnas → 375: apiladas. [línea inferior mono chica]
```

Motion global: `data-reveal` en secciones 2–8 (fade + 12px rise, stagger 60ms por hijo),
IntersectionObserver inline, `prefers-reduced-motion: reduce` lo apaga todo.
Anchors del header con `scroll-behavior: smooth` + `scroll-padding-top`.

---

## 4. Checklist de fidelidad para el builder

- [ ] Copy textual de la sección 2 — sin parafrasear (la aritmética y el disclaimer SIAT son legales/comerciales, van EXACTOS).
- [ ] Tokens y tipografías de la sección 1 (Fraunces + Instrument Sans + JetBrains Mono via next/font).
- [ ] Ambos temas diseñados (probar light y dark a mano, no solo el toggle).
- [ ] Screenshots REALES o placeholder honesto "pendiente" — jamás UI falsa.
- [ ] 3 CTAs WhatsApp (hero, tras SIAT, tras planes) + bloque final; href exacto de la sección 2.
- [ ] Gates: `tsc --noEmit` verde, `pnpm build` verde, responsive 375/768/1440, <150kb JS gzip.
- [ ] Prohibido: framer-motion, testimonios, cifras de clientes, SLA, "por ley tenés que comprarnos", chatbot IA como feature de la landing.
