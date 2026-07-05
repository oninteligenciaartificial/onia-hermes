# Spec — Landing demo vertical dental (captación de pacientes)

- Fecha: 2026-07-05
- Carril: Web Factory (`web-factory/`)
- Estado: diseño aprobado por Sergio (arranca implementación)
- Fuente de calidad: `web-factory/WEB_FACTORY_PATTERN_BANK_2026.md` (playbook Clinic/Health)

## Objetivo

Construir la plantilla demo del **vertical dental** orientada a **captar pacientes**
(B2C): que el visitante agende una cita por WhatsApp. Debe quedar reutilizable para
clonar por cada clínica real. No es la landing del producto SaaS DentalGest.

## Criterios de éxito

1. Alcanza el piso del Pattern Bank para Clinic/Health (recipe "Fast Landing":
   hero, trust, offer, process, FAQ, CTA; design read "calm trust", densidad 4,
   motion 2).
2. Quality bar universal: primer viewport muestra negocio + oferta + acción; un
   solo intent de CTA; ≥4 familias de layout en las secciones; mobile-first;
   sin métricas falsas; reduced-motion; CWV.
3. Gates verdes: `pnpm test` (unit), `pnpm e2e` (a11y + visual + performance),
   `pnpm factory:smoke`.
4. Tokenizado y data-driven: cero color hardcodeado; todo sale del JSON del cliente.

## Decisiones

- **Approach A**: extender el sistema de bloques + template del vertical (no
  reusar `landing-focus` crudo, que queda bajo el piso; no hand-code fuera de la
  fábrica).
- **Marca demo**: clínica ficticia "Clínica Dental Aura", slug `dental-demo`,
  datos placeholder marcados como demo. Evita colisión con el producto DentalGest.
- **Template nuevo** `landing-clinic`: no se tocan `landing` ni `landing-focus`
  (no arriesga sitios existentes).
- **Reviews omitidas en la demo**: el Pattern Bank exige reseñas solo si son
  reales y aprobadas. El bloque queda disponible para el cliente real.
- **Sin fabricar**: sin números inventados como reales, sin retratos de doctor
  falsos. Asset de hero = SVG sintético dental marcado demo (patrón `clinic-demo`).

## Estructura de la página

1. Hero (focus, sin nav) — ambiente de consultorio (asset demo), tagline dental,
   CTA único "Agendar cita" → WhatsApp. Panel de confianza alimentado por datos
   reales del perfil (credenciales/beneficios), no copy hardcodeado.
2. Trust strip — credenciales/garantías (matrícula, esterilización, urgencias).
3. Servicios por problema del paciente — grid dental (limpieza, ortodoncia,
   implantes, blanqueamiento, endodoncia, urgencias).
4. Proceso — 3-4 pasos verb-led (agendás → evaluación → plan → tratamiento).
5. FAQ — dudas típicas (dolor, precios, urgencias, pago, primera consulta).
6. CTA final + botón WhatsApp sticky (móvil).
7. Footer minimal — contacto, ubicación, horarios.

## Cambios en el sistema

### Schema (`web-factory/data/schema.ts` + `packages/blocks/src/types.ts`)
Agregar campos **opcionales** con default `[]` (no rompen clientes existentes):
- `credenciales: string[]`
- `proceso: Array<{ titulo: string; desc: string }>`
- `faq: Array<{ pregunta: string; respuesta: string }>`

### Bloques nuevos (`web-factory/packages/blocks/src/`)
- `trust.ts` — strip de credenciales/beneficios.
- `process.ts` — pasos numerados.
- `faq.ts` — lista pregunta/respuesta accesible (`<details>`/semántica).
- `sticky-cta.ts` — botón WhatsApp flotante (visible en móvil, reduced-motion ok).
- Enriquecer `hero.ts`: panel de confianza usa `credenciales`/`beneficios` del
  data en vez de texto fijo.
- Registrar en `packages/blocks/src/index.ts`.

### Template (`web-factory/packages/templates/src/landing-clinic.ts`)
Compone: hero(focus) + trust + features + process + faq + finalCTA + stickyCTA +
footer(minimal). Reusa `renderLandingCss` + CSS propio de los bloques nuevos.
Registrar en `packages/templates/src/index.ts`.

### Generador (`web-factory/generate/generate.ts`)
- Agregar `"landing-clinic"` al tipo `GenerateOptions.template`, a la validación
  (línea ~41) y al switch de render html/css (líneas ~51-64).

### Datos demo
- `data/intakes/dental-demo.json` (intake) → `pnpm client:new` genera perfil.
- `data/clients/dental-demo.json` + `.context.md` (marca demo + pendientes).
- `data/clients/dental-demo.assets/` — hero SVG sintético dental.
- Paleta dental (azul confianza + teal/menta + fondo claro), motion bajo.

### Tests / gates
- Unit (vitest): extender `generate.test.ts` para `landing-clinic`; test de que
  los bloques nuevos rinden secciones y escapan HTML.
- e2e (Playwright): cubrir la ruta demo con a11y (`a11y.spec.ts`), estructura
  (hero + CTA real, secciones presentes) y performance (`perf.spec.ts`).
- `factory:smoke`: sumar `pnpm generate dental-demo --template landing-clinic`.

## Guardrails

- No tocar los 4 archivos raíz de web-factory (`next.config.ts`, `layout.tsx`,
  `globals.css`, `package.json`) sin avisar.
- No tocar `src/app/onia-center/**` ni la tienda Nuvia.
- Bloques leen solo tokens CSS; nada de color hardcodeado.
- Commits conventional, por carpeta.

## Pendientes para cliente real (no demo)

- Foto real de consultorio/equipo y credenciales visibles (matrícula).
- Política de datos personales / disclaimers de salud.
- Dominio + hosting a nombre del cliente.
- Reseñas reales aprobadas (activar bloque reviews).
