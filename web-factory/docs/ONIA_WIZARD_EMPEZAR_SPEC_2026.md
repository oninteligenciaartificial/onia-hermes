# ONIA — Wizard de entrada `/empezar` · SPEC + COPY v1 (2026-07-25)

> **Estado: SPEC aprobable — NO es build.** Este doc especifica el flujo, el copy completo,
> la lógica de recomendación, los datos y el motion del wizard "al entrar a la plataforma,
> preguntas te hace la web". Lo implementa otra sesión en
> `web-factory/apps/onia-platform/src/app/empezar/**`.
>
> Fuentes que manda este spec (no duplicar — editar la fuente):
> - Identidad: `hermes-content/docs/historial/web-factory/ONIA_BRAND_2026.md` (blanco/negro/verde, verde = encendido).
> - Motion: `web-factory/docs/MOTION_PATTERN_BANK_2026.md` + kit `src/motion/` (se REUSA, cero librería nueva).
> - Constantes: `src/lib/site.ts` (`waLink`, `APP_URL`, `DENTALGEST_URL`).
> - Compliance C7: nunca "por ley" · portal del SIN gratis de frente · el agente REPROGRAMA
>   con aprobación · cero cifras/testimonios inventados · precio SOLO "desde Bs 320/mes —
>   precios de lanzamiento".
>
> **Fuera de alcance de este spec:** todo lo de chatbot/WhatsApp/envíos como FUNCIONALIDAD
> (lo desarrolla otra sesión). Acá WhatsApp aparece solo como link `wa.me` con texto
> prellenado — igual que en el resto del sitio — y el módulo "Chatbot" se menciona como
> copy, referenciando la sección Módulos existente.

---

## 0. Qué es y qué no es

- **Es** el gradiente self-serve: el visitante responde 3 preguntas, la web le arma una
  recomendación honesta (plan + módulos que le faltan) y le abre 2 puertas: WhatsApp con
  sus respuestas ya escritas, o la demo. Hoy el cierre es humano por WhatsApp; mañana el
  mismo wizard provisiona solo (TODO §4).
- **No es** un registro: **cero datos personales** — no se pide nombre, correo ni teléfono.
  El único dato libre es la URL de su web (opcional), y viaja solo dentro del mensaje de
  WhatsApp que el propio usuario decide mandar.
- **No es** un formulario largo: 3 pantallas de UNA pregunta + 1 pantalla de resultado.

**Ruta:** `/empezar` en `web-factory/apps/onia-platform`.
**Puntos de entrada sugeridos** (mismo carril, follow-up chico): botón "Empezar" en
`site-header` y como tercer camino bajo las dos puertas de `doors.tsx` ("¿Ni uno ni otro?
Respondé 3 preguntas y te decimos qué encenderíamos"). No tocan apps ajenas.

**Layout de la ruta (modo foco):**
- Header mínimo: wordmark **onia** (placeholder `public/brand/wordmark-a.svg` — cuando
  Sergio pase SU logo se cambia solo el asset; los tokens ya están listos) + link ghost
  "← volver al sitio" (`/`).
- Barra de progreso pegada bajo el header (§5).
- Contenedor angosto (~640px), blanco dominante, una pregunta centrada verticalmente.
- Footer micro fijo: *"Sin registro. No te pedimos nombre, correo ni teléfono — hablás
  recién cuando vos quieras."*
- Tokens de color: los de `hermes-content/docs/historial/web-factory/ONIA_BRAND_2026.md` §1.3/§1.4 (verde `#027650` claro /
  `#4DBD8C` oscuro). El verde SOLO significa seleccionado/encendido/progreso — nunca decora.

---

## 1. Flujo paso a paso

```
/empezar
  │
  ├─ Paso 1/3 · RUBRO (radio, 4 opciones + escape "otro rubro")
  │     Dental = DISPONIBLE · Comercio/Servicios/Proveedores = PRÓXIMAMENTE
  │     (elegir un "próximamente" NO corta el flujo: sigue igual y el
  │      resultado cambia a la variante lista-de-espera)
  │
  ├─ Paso 2/3 · EQUIPO (radio, 4 rangos)
  │
  ├─ Paso 3/3 · ¿QUÉ TENÉS HOY? (checkboxes, multi)
  │     └─ si marca "Página web" → se revela input URL
  │        "pasanos tu web y la analizamos gratis" (análisis MANUAL,
  │        se entrega por WhatsApp en el día — se dice honesto)
  │
  └─ RESULTADO (no cuenta como paso — es el pago del wizard)
        ├─ Variante A (dental): plan sugerido + módulos que le faltan,
        │    con el patrón "se enciende" (cascada de Módulos + ensamblaje de Rubros)
        └─ Variante B (próximamente): lista de espera honesta, ensamblaje
             a medio armar (2/4 bloques fantasma, patrón de rubros.tsx)
        CTAs: [WhatsApp prellenado con SUS respuestas]  [Probar la demo]
```

**Reglas del flujo:**
- Una pregunta por pantalla. Avance con botón explícito **"Continuar"** (accesible por
  teclado; nada de auto-avance como comportamiento base — si se quiere auto-avance en
  click de mouse, es enhancement con flag, apagado por defecto).
- "← Atrás" (ghost) en pasos 2 y 3; las respuestas se conservan al volver.
- Paso 3 permite continuar con CERO checks (opción "Nada de esto todavía" es exclusiva:
  al marcarla desmarca el resto, y viceversa).
- El input de URL es opcional aun con "Página web" marcada (se puede continuar sin URL;
  la oferta de análisis solo aparece en el resultado si hay URL).
- Validación de URL: mínima y amable (acepta con o sin `https://`; se normaliza al armar
  el mensaje). Nunca bloquea con error técnico — si no parsea, se manda tal cual la tipeó.
- El resultado tiene "Volver a empezar" (resetea estado y va a paso 1).

---

## 2. Copy completo por pantalla

Tono: ES boliviano, voseo, directo, sin hype (reglas §4 de `hermes-content/docs/historial/web-factory/ONIA_BRAND_2026.md`).
Todos los textos van EXACTOS — no parafrasear al implementar.

### 2.0 Shell (todas las pantallas)

| Elemento | Copy |
|---|---|
| Link volver | `← volver al sitio` |
| Progreso (visual + aria) | `Paso {n} de 3` |
| Footer micro | `Sin registro. No te pedimos nombre, correo ni teléfono — hablás recién cuando vos quieras.` |

### 2.1 Paso 1 — Rubro

| Elemento | Copy |
|---|---|
| Kicker | `Empecemos` |
| H1 | `¿De qué es tu negocio?` |
| Sub | `Onia se configura según el rubro: sus fichas, su agenda, su forma de cobrar. Elegí el tuyo.` |
| Opción 1 | **Dental** — `Clínicas y consultorios dentales` — badge `DISPONIBLE` |
| Opción 2 | **Comercio** — `Tiendas y comercios` — badge `PRÓXIMAMENTE` |
| Opción 3 | **Servicios** — `Negocios de servicios` — badge `PRÓXIMAMENTE` |
| Opción 4 | **Proveedores** — `Distribuidores y proveedores` — badge `PRÓXIMAMENTE` |
| Nota al elegir un "próximamente" (inline, bajo la opción) | `Este rubro está en construcción — sin humo. Igual seguí: te avisamos apenas esté, con tu caso ya anotado.` |
| Escape | `¿Tu rubro no está en la lista? Contanos por WhatsApp` → `waLink("Hola, mi rubro no está en la lista de Onia. Mi negocio es: ")` |
| Botón | `Continuar` |

### 2.2 Paso 2 — Equipo

| Elemento | Copy |
|---|---|
| H1 | `¿Cuántos son en el equipo?` |
| Sub | `Contando a todos los que usarían el sistema.` |
| Opciones | `Solo yo` · `2 a 5` · `6 a 15` · `Más de 15` |
| Botones | `← Atrás` · `Continuar` |

### 2.3 Paso 3 — Qué tenés hoy

| Elemento | Copy |
|---|---|
| H1 | `¿Con qué manejás tu negocio hoy?` |
| Sub | `Marcá todo lo que aplique. Sin vergüenza — la mayoría arranca con el cuaderno.` |
| Check 1 | `Agenda en cuaderno o Excel` |
| Check 2 | `Página web` |
| Check 3 | `Chatbot que responde solo` |
| Check 4 | `Sistema de gestión (algún software)` |
| Check 5 | `Facturación electrónica` |
| Check 6 (exclusiva) | `Nada de esto todavía` |
| Al marcar "Página web" → label del input | `Pasanos tu web y la analizamos gratis` |
| Input placeholder | `tunegocio.com.bo` |
| Micro bajo el input (honestidad) | `El análisis lo hace una persona del equipo, no un robot — te lo mandamos por WhatsApp en el día.` |
| Botones | `← Atrás` · `Ver mi recomendación` |

### 2.4 Resultado — Variante A (rubro Dental, DISPONIBLE)

| Elemento | Copy |
|---|---|
| Kicker | `Tu recomendación` |
| H1 | `Esto es lo que encenderíamos para vos.` |
| Sub | `Armado con tus 3 respuestas — nada genérico.` |

**Card del plan** (aterriza con peso; badge `DISPONIBLE`):

| Tamaño elegido | Nombre del plan | Línea de precio |
|---|---|---|
| Solo yo / 2 a 5 | `DentalGest — Consultorio` | `Desde Bs 320/mes — precios de lanzamiento.` |
| 6 a 15 | `DentalGest — Clínica` | `Los planes arrancan desde Bs 320/mes (lanzamiento); el tuyo se cotiza según sillones y equipo.` |
| Más de 15 | `DentalGest — Grupo clínico` | `Precio a medida — lo armamos con vos.` |

| Elemento | Copy |
|---|---|
| Lista "incluye" (4 chips) | `Agenda` · `Historias clínicas` · `Facturación` · `Agente IA que reprograma — con tu aprobación` |
| Si marcó "Agenda en cuaderno o Excel" (línea dentro de la card) | `El cuaderno se jubila: agenda digital con recordatorios, sin pasar nada en limpio.` |
| Si NO marcó "Facturación electrónica" (línea dentro de la card) | `La facturación va incluida. Y sí: el portal del SIN es gratis y cumple igual — la diferencia es que acá la factura sale sola del cobro, sin tipeo.` |

**Bloque "Lo que te falta"** (solo aparece si hay ítems; cada módulo pasa de fantasma a
encendido en cascada):

| Condición | Módulo | Copy |
|---|---|---|
| NO marcó "Página web" | `Página web` | `Tu presencia online conectada al sistema: lo que publicás y lo que agendás viven en el mismo lugar.` — tag `módulo aparte, a cotizar` |
| NO marcó "Chatbot" | `Chatbot de WhatsApp` | `El botón de WhatsApp va gratis con la web. Esto es otra cosa: un bot que conversa por vos, responde consultas y te deriva los que valen la pena.` — tag `módulo aparte, a cotizar` |

**Bloque "Ya lo tenés"** (solo si aplica; ítems en tinta, check estático, SIN verde —
no está "encendido en Onia", simplemente ya existe):

| Condición | Copy |
|---|---|
| Marcó "Página web" (con URL) | `Tu web: {url}. Una persona del equipo la revisa y te manda el análisis gratis por WhatsApp en el día.` |
| Marcó "Página web" (sin URL) | `Tenés web. Si querés el análisis gratis, pasánosla por WhatsApp.` |
| Marcó "Chatbot" | `Chatbot: ya tenés uno andando.` |
| Marcó "Sistema de gestión" | `Ya usás un sistema. No te pedimos migrar a ciegas: probá la demo y compará con lo tuyo.` |
| Marcó "Facturación electrónica" | `Ya facturás electrónico.` |

| Elemento | Copy |
|---|---|
| CTA primario (WhatsApp, prellenado §4) | `Armar mi cuenta por WhatsApp` |
| CTA secundario | `Probar la demo` → `APP_URL` |
| Micro bajo CTAs | `Responde una persona, no un menú. La demo anda con datos de ejemplo, sin compromiso.` |
| Reset (ghost) | `Volver a empezar` |

### 2.5 Resultado — Variante B (rubro PRÓXIMAMENTE)

| Elemento | Copy |
|---|---|
| Kicker | `Tu recomendación` |
| H1 | `Tu rubro está en construcción — sin humo.` |
| Body | `{Comercio/Servicios/Proveedores} se está armando sobre el mismo motor que ya corre en DentalGest. No vendemos lo que no existe: anotate y te avisamos apenas esté — con tu caso ya anotado, para que no repitas nada.` |
| Ensamblaje (visual, reusa `rubros.tsx`) | Los 4 bloques del rubro elegido, 2 construidos + 2 fantasma con `en construcción` (mismos labels que `RUBROS[].blocks` de `rubros.tsx`) |
| Si marcó "Página web" con URL (bloque aparte) | `Mientras tanto, algo hoy: nos pasaste {url} — una persona del equipo la revisa y te manda el análisis gratis por WhatsApp en el día.` |
| CTA primario (WhatsApp, prellenado §4) | `Anotarme — avísenme cuando esté` |
| CTA secundario | `Ver el rubro que ya anda` → `DENTALGEST_URL` |
| Micro | `Responde una persona, no un menú.` |
| Reset (ghost) | `Volver a empezar` |

---

## 3. Lógica de recomendación (determinista, sin IA)

Tabla respuestas → salida. Sin fetch, sin modelo, sin aleatoriedad: misma entrada,
misma salida. Implementable en ~40 líneas en `src/app/empezar/recommend.ts`.

### 3.1 Tabla

| Entrada | Valor | Efecto en la salida |
|---|---|---|
| rubro | `dental` | `disponible: true` → Variante A |
| rubro | `comercio` \| `servicios` \| `proveedores` | `disponible: false` → Variante B (plan = null) |
| equipo | `solo` \| `2-5` | plan `consultorio` · precio `desde-320` |
| equipo | `6-15` | plan `clinica` · precio `cotizar` |
| equipo | `15+` | plan `grupo` · precio `a-medida` |
| tiene ∌ `web` | — | agrega `web` a `faltan` |
| tiene ∋ `web` | — | agrega `web` a `yaTenes`; si hay URL → `analisisWeb: true` |
| tiene ∌ `chatbot` | — | agrega `chatbot` a `faltan` |
| tiene ∋ `chatbot` | — | agrega `chatbot` a `yaTenes` |
| tiene ∋ `sistema` | — | agrega `sistema` a `yaTenes` (dispara copy "compará con la demo") |
| tiene ∋ `facturacion` | — | agrega `facturacion` a `yaTenes` |
| tiene ∌ `facturacion` | — | dispara la línea "portal del SIN gratis / sin tipeo" dentro de la card del plan (NO es add-on: va incluida) |
| tiene ∋ `cuaderno` | — | dispara la línea "el cuaderno se jubila" dentro de la card del plan |
| tiene ∋ `nada` | — | equivale a: cuaderno sí implícito no (solo copy neutro), `faltan = [web, chatbot]`, `yaTenes = []` |

Notas duras:
- `Agentes IA` y `Automatizaciones` NO se listan como "te falta": en dental van dentro
  de DentalGest ("Agente IA que reprograma — con tu aprobación" en el incluye). No
  inventar un add-on que el pricing no tiene.
- `Facturación` jamás se vende como obligación (compliance): si no la tiene, el copy es
  ahorro de tipeo con el portal gratis dicho DE FRENTE.
- Cero cifras fuera de "desde Bs 320/mes — precios de lanzamiento". Todo lo demás:
  "a cotizar" / "a medida".

### 3.2 Pseudocódigo de referencia (≤50 líneas)

```ts
type Rubro = "dental" | "comercio" | "servicios" | "proveedores";
type Equipo = "solo" | "2-5" | "6-15" | "15+";
type Tiene = "cuaderno" | "web" | "chatbot" | "sistema" | "facturacion" | "nada";

type Precio = "desde-320" | "cotizar" | "a-medida";

interface Recomendacion {
  disponible: boolean;
  plan: { id: string; nombre: string; precio: Precio } | null;
  faltan: ("web" | "chatbot")[];
  yaTenes: Tiene[];
  notas: ("cuaderno" | "facturacion-incluida" | "compara-demo")[];
  analisisWeb: boolean;
}

export function recomendar(
  rubro: Rubro,
  equipo: Equipo,
  tiene: ReadonlySet<Tiene>,
  webUrl?: string,
): Recomendacion {
  const disponible = rubro === "dental";
  const plan = !disponible
    ? null
    : equipo === "15+"
      ? { id: "grupo", nombre: "DentalGest — Grupo clínico", precio: "a-medida" as const }
      : equipo === "6-15"
        ? { id: "clinica", nombre: "DentalGest — Clínica", precio: "cotizar" as const }
        : { id: "consultorio", nombre: "DentalGest — Consultorio", precio: "desde-320" as const };

  const faltan: ("web" | "chatbot")[] = [];
  if (!tiene.has("web")) faltan.push("web");
  if (!tiene.has("chatbot")) faltan.push("chatbot");

  const yaTenes = [...tiene].filter(
    (t): t is Tiene => t !== "nada" && t !== "cuaderno",
  );

  const notas: Recomendacion["notas"] = [];
  if (tiene.has("cuaderno") || tiene.has("nada")) notas.push("cuaderno");
  if (!tiene.has("facturacion")) notas.push("facturacion-incluida");
  if (tiene.has("sistema")) notas.push("compara-demo");

  return { disponible, plan, faltan, yaTenes, notas, analisisWeb: tiene.has("web") && !!webUrl };
}
```

---

## 4. Datos: qué se guarda dónde

**Hoy: cero backend, cero DB, cero cookies de tracking.**

| Dato | Dónde vive | Cuándo muere |
|---|---|---|
| Respuestas (rubro, equipo, checks, URL) | Estado React del wizard | Al salir de la página |
| Copia de respaldo del estado | `sessionStorage` clave `onia.empezar.v1` (para sobrevivir un refresh a mitad de wizard) | Al cerrar la pestaña |
| **Única salida real** | El texto prellenado del link `wa.me` (lo manda el usuario si quiere) | — |

**Mensaje de WhatsApp prellenado** (se arma con `waLink()` de `src/lib/site.ts`; compacto,
sin saltos raros; solo incluye lo que el usuario marcó):

Variante A (dental):

```
Hola, vengo del asistente de Onia. Mi rubro: clínica dental. Equipo: {2 a 5}.
Hoy tengo: {cuaderno/Excel, página web (miweb.com.bo)} — o "nada todavía".
Me recomendó {DentalGest — Consultorio} y me faltarían: {página web, chatbot}.
Quiero armar mi cuenta.{ ¿Me mandan el análisis gratis de mi web?}
```

Variante B (próximamente):

```
Hola, vengo del asistente de Onia. Mi rubro: {comercio} (todavía en construcción).
Equipo: {6 a 15}. Hoy tengo: {sistema de gestión}. Anótenme para que me avisen
cuando esté.{ Mi web: {miweb.com.bo} — quiero el análisis gratis.}
```

Reglas del mensaje:
- La URL va tal cual la tipeó (normalizada sin `https://` para legibilidad).
- Nada del mensaje se manda a ningún servidor de ONIA: `wa.me` lo abre el usuario.
- El análisis de web es MANUAL (una persona del equipo) — por eso la promesa es
  "en el día", no "al instante". No automatizar la promesa antes que el proceso.

**TODO persistencia (NO en este build — anotado para el gradiente futuro):**
1. POST del intake a un webhook n8n (bloqueado por S3: secreto de intake) → tabla
   `wizard_intakes` en Supabase, para no depender de que el usuario mande el WhatsApp.
2. Cuando exista provisión self-serve: el resultado del wizard se convierte en el seed
   de la cuenta (rubro → vertical track, checks → módulos sugeridos).
3. Analítica: contador anónimo de pasos completados (sin PII). Nada de esto entra hoy.

---

## 5. Motion — cómo se anima (todo con el kit existente, 0 kb marginal)

Referencia de patrones: `MOTION_PATTERN_BANK_2026.md`. Reglas duras aplican enteras:
compositor-only, `viewport once`, reduced-motion apaga todo, presupuesto <150 kb gzip
(el kit ya está pagado: ~4.6 kb sync). **No se agrega ninguna librería.**

| Momento | Patrón del banco | Implementación |
|---|---|---|
| Barra de progreso | P11 (adaptado a pasos) | `m.div` con `scaleX` (`transformOrigin: left`) animado a `paso/3` con `springs.gentle`. Relleno `--verde` (progreso = encendido, semántico). NUNCA `width`. |
| Transición entre pasos | P10 `AnimatePresence mode="wait"` | Mismo patrón que el panel de `rubros.tsx`: entra `{opacity:0, y:16}` → `{1, 0}`, sale `{opacity:0, y:-10}`, `springs.gentle`. Con dirección: al ir "Atrás" se invierten los signos de `y`. `key` = id del paso (nunca índice). |
| Selección de opción (radio) | P6 + estado encendido | Card envuelta en `<PressableCta>` (hover/tap físico). Al seleccionar: borde y LED-dot pasan a verde con `springs.snappy` (mismo lenguaje que `rubroChipOn` de how-it-works). La selección ES el único elemento encendido de la vista. |
| Checkboxes paso 3 | `springs.snappy` | El cuadrito se llena verde con scale 0.6→1 spring snappy. Sin stagger de entrada agresivo: `StaggerGrid` con `staggerBase` para la lista completa, una vez. |
| Reveal del input URL | P10 + clip-path | Mismo recurso que `openDoor` de `doors.tsx`: `clipPath: inset(0 0 100% 0)` → `inset(0)` + opacity, `easeOutExpo` 0.4s. Al desmarcar, exit inverso. Compositor-only (nada de animar height). |
| **Resultado: la card del plan** | `springs.heavy` | "Aterriza" con peso: `{opacity:0, y:20, scale:0.96}` → `{1, 0, 1}` con `springs.heavy` (el mismo aterrizaje de los bloques de ensamblaje). El precio aparece FIRME, sin count-up (regla 7 del banco: cifras de precio no bailan). |
| **Resultado: módulos "te falta" que se encienden** | P7 cascada (patrón de `modules.tsx`) | Cada módulo entra apagado (gris fantasma) y se ENCIENDE en cascada: 350ms + i×420ms (`CASCADE_MS` de modules.tsx), reutilizando la mecánica `tileOn`/`ModulePower`. El visitante VE lo que le falta pasar de apagado a vivo — es el pitch hecho animación, y el patrón aprobado del sitio. |
| Resultado: "ya lo tenés" | estático | Sin animación de encendido (no está "vivo en Onia"): entra con `<Reveal>` simple, check en tinta. El contraste apagado/encendido es el mensaje. |
| Resultado variante B: ensamblaje a medio armar | Patrón de `rubros.tsx` | Reusar `aBlock`/`aGhost`: 2 bloques aterrizan con `springs.heavy`, 2 quedan al 55% de opacidad con nota `en construcción`. Honestidad hecha animación, igual que en la sección Rubros. |
| CTAs finales | P6 | `<PressableCta>` en ambos. El botón WhatsApp con su `btn-dot` LED verde ya existente. |

**Reduced motion:** `<MotionProvider>` ya cubre lo declarativo. La cascada del resultado
es imperativa (timers) → chequear `useReducedMotion()` y renderizar TODO encendido de
entrada, sin timers (exactamente como lo hace `modules.tsx`). Los timers con cleanup en
el `useEffect` y pausados fuera de viewport.

**A11y del wizard:**
- Pasos 1–2: `fieldset` + `role="radiogroup"`; flechas mueven foco (patrón tabs de rubros).
- Paso 3: checkboxes nativos estilizados (nunca divs clickeables).
- Al cambiar de paso: foco al `h1` del paso nuevo; `aria-live="polite"` anuncia "Paso n de 3".
- Resultado: `h1` recibe foco; la cascada es decorativa (`aria-hidden` en las escenas,
  el contenido textual siempre presente en el DOM).
- El botón "Continuar" deshabilitado hasta que haya selección en pasos 1–2 (en paso 3
  siempre habilitado — cero checks es una respuesta válida).

**Gates pre-merge (checklist del banco §4):** reduced-motion 100% legible y estático ·
solo Composite en DevTools Performance · first load de `/empezar` <150 kb gzip ·
reveals una sola vez · timers limpios · 320px sin desborde · precio sin count-up ·
gate anti-IA pasado (el wizard no es un form genérico: la pregunta es la escena, el
resultado se enciende).

---

## 6. Checklist de compliance C7 (verificación final del build)

- [ ] En ningún texto aparece "por ley", "obligatorio", ni miedo fiscal como argumento.
- [ ] El portal gratuito del SIN se menciona DE FRENTE cuando se habla de facturación
      ("el portal del SIN es gratis y cumple igual — te ahorramos el tipeo").
- [ ] El agente se describe como que REPROGRAMA / propone CON aprobación — nunca actúa solo.
- [ ] Cero testimonios, cero cifras de clientes, cero métricas inventadas.
- [ ] Única cifra de precio en todo el wizard: "desde Bs 320/mes — precios de lanzamiento"
      (solo en plan Consultorio). Todo lo demás "a cotizar" / "a medida".
- [ ] Rubros no disponibles: "PRÓXIMAMENTE" + "en construcción" explícitos; el CTA es
      anotarse, nunca comprar.
- [ ] Análisis de web: se dice que lo hace una persona y que llega "en el día" — no se
      promete automático ni instantáneo.
- [ ] El botón de WhatsApp (gratis) nunca se confunde con el chatbot (módulo pago).
- [ ] Cero datos personales pedidos en el wizard; la URL de la web solo viaja en el
      mensaje que el usuario decide mandar.
