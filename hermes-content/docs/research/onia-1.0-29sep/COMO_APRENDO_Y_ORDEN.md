# Cómo aprendo patrones, y el orden propuesto

Borrador del 29-sep-2026 para Sergio Urcullo. Es solo lectura: no se movió ni se borró nada. Las rutas están abreviadas igual que en `REGLAS_UI_ONIA.md`. Las cifras son las que midió el inventario del 29-sep (platform en `6656e76c`).

---

## (a) Cómo aprende patrones el sistema

### El circuito real, paso a paso

| # | Paso | Dónde vive | Estado |
|---|---|---|---|
| 1 | **Entrada.** Un reel o una URL que me pasás | skill `ver-videos` → `VI/` (INDEX.md, 131 fichas con fecha) | ✅ funciona |
| 2 | **Análisis.** Se reconstruye lo que muestra: si es web, el mecanismo (propiedad CSS, evento, librería); si es SaaS, las entidades y la máquina de estados, comparadas contra ONIA Core. Cada ficha cierra con 3 preguntas: qué frente toca, con qué lo reproducimos y qué falta | `VI/METODO_DE_ANALISIS.md` §"Las cuatro reconstrucciones" | ✅ funciona |
| 3 | **Reconstrucción visual.** Si trae UI, se arma un `index.html` autocontenido mirando cuadro por cuadro, con la fuente citada | `UP/<patrón>/` (16 patrones + `20-leyes-ux.png`) | ✅ funciona, pero sin índice completo |
| 4 | **Medición.** Los sitios se miden con `extract_web_anatomy.mjs`. Algo pasa a ser ley solo si lo repiten 3 o más sitios; con 1 o 2 es estilo | `DS/anatomia/SINTESIS.md` | ✅ buen método, poco usado |
| 5 | **Deduplicación.** Una regla vale cuando varias fichas la encuentran por separado. Ejemplos: el acento único aparece en 8 fichas; las ~25 propuestas de motion se redujeron a 7 patrones | `VI/2026-08-23-patrones-de-motion-deduplicados.md`, `VI/2026-08-23-sintesis-lote-18.md` | ✅ funciona |
| 6 | **Regla escrita.** Van a los bancos `*_PATTERN_BANK_2026.md`, a DESIGN_LEARNED y a las leyes de dashboard | `H/web-factory/docs/`, `DS/2026-08-30-como-se-hace-un-dashboard.md` | ⚠️ queda del lado de web-factory |
| 7 | **Skill / DESIGN.md del producto.** La regla se vuelve instrucción para la sesión que toca el SaaS | `P/.claude/skills/onia-frontend/SKILL.md`, `P/DESIGN.md` | 🔴 **acá se corta** |
| 8 | **Componente.** La regla se vuelve una primitiva que la aplica sola | `P/components/ui/` | 🔴 no pasa |
| 9 | **Gate.** Un test o grep que falla si alguien la rompe | `P/e2e/`, `P/app/(dashboard)/*.test.ts` | 🔴 casi no hay de UI |
| 10 | **Revisión mirando.** Capturas a 375/768/1440 px y con reduced-motion. Decidís vos mirando: tu veredicto le gana al A/B interno | `UP/spec-sheet-editorial/FICHA.md` (caso marco) | ✅ funciona cuando se hace |

### Qué funciona

- **La entrada y el análisis son buenos.** Los reels se ven de verdad, se reconstruyen y se citan.
- **El criterio para distinguir ley de gusto es sólido:** 3 sitios o varias fichas independientes.
- **El veredicto final es tuyo y se respeta.**

### Qué falla hoy (por qué ves el panel "vacío y con mucho texto" aunque hay muchas referencias)

1. **La cadena no llega al producto.**
   - Ni `onia-frontend` ni los docs de platform nombran `ui-patterns` ni `DASHBOARD_PATTERN_BANK_2026.md`. Ese banco solo lo citan los docs de web-factory.
   - La sesión que toca el SaaS nunca ve las galerías.
2. **Hay reglas escritas que nadie hace cumplir.**
   - `onia-frontend` manda usar `Card` desde el 17-sep, y hoy `card.tsx` sigue con **0 importadores**.
   - Hay 199-317 tarjetas hechas a mano.
   - Las 28 copias de `inputClass` son las mismas que ya había el 21-sep.
   - Una regla sin componente y sin gate no existe.
3. **Las galerías no tienen índice.**
   - `hermes-content/references/` tiene 23 carpetas y no tiene README.
   - El README de `ui-patterns` lista 6 de ~16 patrones.
   - Mezcla material de producto, de venta y de redes.
   - `WEB_FACTORY_DESIGN_INTELLIGENCE_LATEST.md` es un auto-generado del 18-jul que nunca se actualizó.
4. **Hay tres leyes tipográficas y dos direcciones de color vivas al mismo tiempo**, sin marcar cuál es historia:
   - Archivo + Geist Mono (`P/DESIGN.md`).
   - Bricolage + Schibsted (`UP/panel-claro-premium/README.md`, DESIGN_LEARNED §4).
   - Bricolage + DM Sans + Spline (`MOTION_PATTERN_BANK §3`).
   - Color petróleo `#12616B` contra verde de marca.

   Cada sesión elige distinto.
5. **Hay demasiados routers de skills que se pisan.** Son 7 documentos que dicen qué skill usar, con conteos viejos (196/33/9 contra 212/37/10 reales). Además, `impeccable` y `hyperframes` existen en 4 copias distintas.

### El circuito corregido (propuesta)

Se agrega un paso obligatorio entre el 6 y el 9. Toda regla de UI aprobada termina en las **tres** cosas:

- **(a)** una línea en `onia-frontend` o en `P/DESIGN.md`, con la fuente;
- **(b)** si se puede, una primitiva en `P/components/ui/`;
- **(c)** un gate AUTO o RATCHET (ver `REGLAS_UI_ONIA.md`).

Una ficha nueva queda "cerrada" recién cuando dice en cuál de las tres terminó, o por qué no aplica al producto.

---

## (b) Orden: mapa único y qué se fusiona o archiva

### Dónde vive cada cosa (una fuente por tema)

| Tema | Fuente única | Se deja de usar como fuente |
|---|---|---|
| Reglas de negocio | `H/CLAUDE.md` | copias en `P/CLAUDE.md:27-40` (canario, handoff) → reemplazarlas por 1 línea puntero |
| Reglas técnicas del producto | `P/CLAUDE.md` + sus 6 skills `onia-*` | `P/docs/SKILLS_BEFORE_ACTION.md` (268 líneas) → queda como puntero |
| Qué skill usar (hermes) | `onia-router` + `STACK-POR-DOMINIO.md` (con `VI/SKILLS_DEL_CARRIL.md` fusionado como "§por tema de video") | `H/hermes-content/docs/ONIA_SKILLS_STACK_Y_SUBAGENTES.md` → `historial/` |
| Qué skill usar (producto) | tabla "Skill routing" de `P/CLAUDE.md` | — |
| Galerías y referentes | **`H/hermes-content/references/README.md` (nuevo, índice único)** | los índices parciales quedan como hijos |
| Reglas UI aprendidas | `H/web-factory/docs/*_PATTERN_BANK_2026.md`; lo que aplica al SaaS se copia como regla corta en `onia-frontend` | `WEB_FACTORY_DESIGN_INTELLIGENCE_LATEST.md` → `historial/` |
| Tokens del panel | `P/app/globals.css` + `P/DESIGN.md` | — |
| Tokens de la marca | `H/web-factory/docs/ONIA_MARCA.md` | `H/hermes-content/brand/tokens.css` (#10C26B) → se actualiza a #00D26A/#12100E o se archiva; corregir la frase "única fuente" de `piezas-ui-patterns/LEEME.md` |
| Primitivas UI | `P/components/ui/` + una sección "Primitivas" en `P/DESIGN.md` (componente → cuándo → importadores, regenerada por script) | tarjetas y inputs hechos a mano (RATCHET) |
| Precios | `P/lib/subscription-plans.ts` (planes) y `P/lib/pricing.ts` (add-ons) | cualquier otro número |

### Stack de skills de diseño para el SaaS (máximo 3 por tarea)

- **Siempre:** `onia-frontend` + `impeccable` (crítica, jerarquía, "vacío / mucho texto") + `ui-ux-pro-max` (celular, touch, a11y).
- **Según la tarea:** `emil-design-eng` (pulido fino), `dataviz` (panel de lo que ganó), `onia-verificacion` (antes de decir "hecho").
- **Solo si hace falta:** `design-shotgun` (variantes para que elijas) y `redesign-existing-projects`.
- **No usar en el SaaS:** `gpt-taste` (landings con GSAP), `industrial-brutalist-ui` (choca con la marca), `taste-design` / `stitch-design-taste` (misma description), `imagegen-frontend-*` (pensadas para Codex).
- **Aviso de la ficha de 42 skills** (`VI/2026-08-11-mapa-42-skills-diseno-claude.md`): más skills no da mejor diseño, da más contexto compitiendo. El cuello de botella es la ejecución y los gates, no la herramienta (`VI/2026-08-12-cinco-plugins-webs-claude.md`).

### Qué se fusiona, mueve, archiva o corrige

**Todo esto es propuesta. Nada se ejecutó.** Al mover algo, se deja un stub con la ruta nueva o se actualizan los links con grep.

| Acción | Qué | Por qué |
|---|---|---|
| Corregir | `P/CLAUDE.md:3-6`: dice que "Onia" es el nombre viejo del pack dental → cambiarlo a "DentalGest" | Es la primera línea que lee toda sesión de producto, y hoy dice lo contrario que `H/CLAUDE.md` §3 |
| Corregir | `C:/Users/PC/.codex/AGENTS.md:32`: "ONIA agencia que vende de todo" → puntero a `ONIA_ESTRATEGIA_DE_EMPRESA.md` | Codex arranca con la tesis de agencia |
| Corregir | Política de push en los dos repos: "hermes: autosync por hook Stop; platform: push solo con OK de Sergio Urcullo" | Hoy se contradicen (`H/CLAUDE.md:334-360` contra `P/AGENTS.md:69-70,118`) |
| Borrar líneas | Rutas `C:/dev/proyectos/DentaGest/...` en `P/CLAUDE.md:73-87` (no existen). Marcar qué skills son solo de Codex | Mandan a lugares vacíos |
| Decidir (Sergio Urcullo) | Una sola ley tipográfica (propuesta: Archivo + Geist Mono, la que corre en producción) y un solo acento del panel. Las demás se marcan "historia" o "solo contenido" | Cada sesión elige distinto |
| Fusionar | `references/models/` → `references/modelos/<persona>/` | Lucía partida en dos lugares |
| Fusionar | `references/marca-personal-sergio/` → `references/marca-personal/` | Duplicado por nombre |
| Mover | `H/web-factory/WEB_FACTORY_PATTERN_BANK_2026.md` → `H/web-factory/docs/` | Los otros 5 bancos viven ahí |
| Una copia por skill | Las de terceros en `~/.claude/skills`, las de ONIA en `H/.claude/skills`. `.agents/skills` se regenera con un script y no se edita a mano. Primero decidir qué versión de `impeccable` y `hyperframes` queda | 14 de las 27 compartidas ya difieren |
| Sacar de skills/ | `~/.claude/skills/everything-claude-code` (clon de 65 MB) y `claude-token-eficiente` (clon) → `C:/Users/PC/src/`. Borrar `learned/` si sigue vacío. Si una skill ya viene por plugin, sacar la copia suelta | No son skills |
| Archivar | `~/.claude/rules/zh/` (17,6 KB, traducción al chino de `common/`) | ~4-5 mil tokens por sesión sin aportar nada |
| Recortar | `~/.claude/rules/token-eficiente/`: dejar solo `common/token-eficiente.md` + el perfil `coding`. El perfil `agents` ("no confirmation requests") no va global | Contradice plan, handoff y confirmación de ONIA |
| Mover | La sección n8n del CLAUDE.md global → skill `onia-infra`. Las credenciales quedan solo en global; `.codex/AGENTS.md` las importa por referencia | Hoy están copiadas en 2 o 3 lugares |
| Renombrar (a mediano plazo) | `H/hermes-content/skills/` → `hermes-content/bot-knowledge/`, o dejar un README fuerte | Tres carpetas "skills" con significados distintos |
| Reordenar | `ui-patterns/` en 3 carpetas: `producto/` (panel, listas, checkout, móvil), `venta-web/` (hero, landing) y `contenido-redes/` (carruseles, mascota). Ficha nueva para `20-leyes-ux.png` | Mezcla superficies |
| Conectar | `onia-frontend` §Referencias apunta al índice único y al banco de dashboards | Es la causa #1 del panel vacío |

---

## Índice único propuesto

**Ruta:** `H/hermes-content/references/README.md` (en el repo onia-hermes, sin fecha: es fuente de verdad).

**Contenido propuesto** (esqueleto; las filas se completan listando cada carpeta, no de memoria):

```markdown
# Referencias de Onia: índice único

Una fila por carpeta. "Estado": fuente vigente / historia / solo contenido.
Si una carpeta no está acá, no existe para las sesiones.

## Qué referente usar según la superficie
| Superficie | Referente vigente | Regla que se desprende |
|---|---|---|
| Panel del producto (SaaS) | onia-platform/DESIGN.md + ui-patterns/producto/panel-claro-premium (V4/V5) + web-factory/docs/DASHBOARD_PATTERN_BANK_2026.md | onia-frontend + REGLAS_UI_ONIA |
| Web de venta | lety.ai y dapta.ai DE HOY + ui-patterns/venta-web/hero-onia | CLAUDE.md §3 (se vende el sistema) |
| Pauta y carruseles | pack community-editorial (commit e9b80e22) | skills carruseles-onia, ugc-empresas-higgsfield |
| Propuestas | generador oficial (hermes-content/propuestas/generador) | skill onia-propuestas |
| Marca | web-factory/docs/ONIA_MARCA.md | — |

## Carpetas
| Carpeta | Qué contiene | Superficie | Estado | Doc de reglas que se desprende |
|---|---|---|---|---|
| ui-patterns/producto/ | reconstrucciones de UI de panel | SaaS | fuente | onia-frontend, REGLAS_UI_ONIA |
| ui-patterns/venta-web/ | hero, landing | web | fuente | ONIA_MARCA, LENGUAJE.md |
| ui-patterns/contenido-redes/ | carruseles, mascota | redes | solo contenido | CAROUSEL_PATTERN_BANK |
| video-intake/ | fichas de reels (INDEX.md) | todas | fuente del circuito | METODO_DE_ANALISIS.md |
| piezas-ui-patterns/ | capturas crudas de piezas | SaaS/web | insumo | LEEME.md |
| modelos/<persona>/ | Lucía, Mara, casting | influencers (congelada) | historia/solo contenido | LUCIA.md |
| sergio-approved-media/ | material aprobado | redes | fuente | — |
| (…una fila por cada una de las 23 carpetas…) | | | | |
| ../../web-factory/data/references/design-sources/ | 163 docs de diseño con fecha | SaaS/web | insumo; lo vigente sube a los bancos | DESIGN_LEARNED_2026.md |

## Circuito de aprendizaje
reel → ver-videos → video-intake (ficha) → ui-patterns (reconstrucción) → medición (3 sitios = ley)
→ banco de patrones → onia-frontend/DESIGN.md + componente + gate → captura mirada por Sergio Urcullo.
Una ficha está cerrada cuando dice dónde terminó.
```

### Orden de ejecución sugerido

1. **Primero lo que desbloquea la 1.1 visual:** conectar `onia-frontend` con las galerías, adoptar `Card`/`Field`/`Button` y poner los gates RATCHET. Ver `PLAN_REDISENO_1_0_1.md`.
2. **Después:** el índice único, las correcciones de los CLAUDE.md y AGENTS.md, y las decisiones de tipografía y color.
3. **Al final:** limpieza de lo global (`rules/zh`, clones, copias de skills) y fusiones de galerías.

Cada paso es su propio carril con su propio commit. Nada de esto abre una línea de negocio.
