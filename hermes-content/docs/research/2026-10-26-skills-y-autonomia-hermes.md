# Hermes de la PC listo para operar: skills y autonomía (26-oct-2026)

Pedido de Sergio Urcullo, 26-oct a la noche:
- Saber qué skills hay instaladas y dónde, y cuáles se le ponen y se le sacan a Hermes, sin repetidas, contradicciones
  ni basura.
- Revisar si la etiqueta `necesita-ok` es la forma correcta, y cómo Hermes puede decidir con su criterio cuando él no
  contesta a tiempo.

Este documento es la foto del análisis. Lo que se decida va a sus fuentes: `AGENTS.md`, `onia-router`,
`hermes-content/deploy/hermes-pc/config.onia.yaml` y `scripts/orquesta/`.

## 1. La etiqueta `necesita-ok`: cómo funciona hoy

- Hermes de la PC carga con `scripts/orquesta/cargar-issue.mjs`. Todo issue sale con `necesita-ok`, sin excepción
  (`cargar-issue.mjs:136`).
- `orquesta.mjs` no toma un issue con `necesita-ok`, `en-curso`, `bloqueada` o `espera-ok` (`orquesta.mjs:68`). Arranca
  recién cuando Sergio Urcullo le saca la etiqueta en GitHub.
- El Hermes del VPS ya tiene una excepción: lo de `donde: nube` con `check: urls` arranca sin la etiqueta
  (`scripts/loops/orquesta-hermes.sh:222`).
- Por qué existe: el token de GitHub es de la cuenta de Sergio Urcullo, así que la orquesta le cree todo lo que se
  carga. Además, un `check: cmd` corre sin sandbox en su PC.

**¿Es la forma correcta?** Como barrera, sí. La aplica un programa fijo, no un modelo, y Hermes no puede saltarla: su
lista de bloqueos le prohíbe `gh issue edit` y `gh api`. El problema es otro: frena todo igual, también lo que no tiene
riesgo. Con un solo humano que aprueba, la cola se para cuando él no mira.

**Lo que aclaró Sergio Urcullo (26-oct):** la etiqueta no es solo «sí o no». Hay cosas en las que él decide **cómo** se
hacen, y por eso Hermes le da opciones. La etiqueta es el momento de elegir.

Entonces el pedido de Hermes trae, en el issue:
- **2 o 3 opciones**, cada una con lo que cuesta y lo que entrega;
- **una marcada como recomendada**, con el porqué: la etapa vigente, sus decisiones anteriores (`AGENTS.md`, los
  handoffs) y lo que pide el plan de supervivencia.

Sergio Urcullo contesta en el issue con la letra («b»), o con «no» para frenarlo. `orquesta.mjs` ya lee sus
respuestas (`decidirRespuesta`, `orquesta.mjs:153`): habría que sumar la letra. La opción elegida pasa al trabajador
como parte del pedido.

**Si no contesta a tiempo:** sale la recomendada, pero solo en el nivel B de abajo. En el C espera siempre.

## 2. Propuesta: tres niveles, y la recomendada por silencio solo en el del medio

El nivel lo calcula `cargar-issue.mjs` con los campos del pedido. No lo elige Hermes: él solo puede pedir más
control, nunca menos. Ese es el «criterio de Sergio Urcullo» escrito en código, no en la memoria de un modelo.

| Nivel | Qué entra | Cuándo arranca |
|---|---|---|
| **A · Solo lee** | `donde: nube`, `check: urls`, carril investigación. Entrega un `.md` en un PR | Sin etiqueta, al instante. Es la misma excepción que ya tiene el VPS, con un tope de 3 por día |
| **B · Recomendada por silencio** | `donde: nube`, sin `check: cmd`, sin `ok: sergio`. Entrega un PR que no se mergea solo: docs, borradores, guiones, briefs, investigación | Con `necesita-ok`, las opciones y una hora límite. Le llega el aviso («sale la opción A a las HH:MM si no elegís otra; para frenar, “no”»). Pasada la hora sin respuesta, `orquesta.mjs` saca la etiqueta y corre la recomendada |
| **C · Siempre con él** | `donde: pc`, todo `check: cmd`, carril plataforma o video, `ok: sergio` (lo visible), gasto, terceros, producción y mergear | Solo cuando él saca la etiqueta. Nunca por silencio |

Por qué el nivel B no tiene riesgo grande:
- Lo peor que puede pasar es gastar cupo en una tarea que él no quería, y eso lo acota el tope diario.
- Nada se publica ni se mergea solo: el PR igual espera su OK.
- No corre nada en su PC.

Lo que hay que decidir:
1. Si se adopta el nivel A para Hermes de la PC.
2. Si se adopta el nivel B, y con qué plazo: 12 horas, o «hasta las 9 del día siguiente».
3. Por dónde le llega el aviso: el Telegram de Hermes (ya existe `ORQUESTA_TELEGRAM=1` en la tarea de la PC) o el
   cierre de las 21:30.

Cambios en el código si se aprueba, en un PR con pruebas:
- `cargar-issue.mjs`: aceptar las opciones (una sola recomendada), calcular el nivel y poner
  `ok-por-silencio:<hora>` en los del nivel B.
- `orquesta.mjs`: tomar la letra de su respuesta, y en el nivel B correr la recomendada vencida la hora, si no hay
  respuesta suya ni etiqueta `frenada`.
- El SOUL de Hermes de la PC: cómo arma las opciones y cómo elige la recomendada.
- `AGENTS.md` §1: la regla nueva.

## 3. Leer X (medido el 26-oct)

- `WebSearch` no trae posts de X.
- **El MCP `exa` sí los trae**, a través de sitios que copian posts: kitrank.dev, agihunt.info, techtwitter.com y
  xitter. Con una búsqueda volvieron 8 publicaciones de octubre con autor, fecha y enlace a x.com. No es X en vivo ni
  la lista de tendencias, pero alcanza para seguir lo que se comparte. Hoy lo tiene Claude y no lo tiene Hermes.
- **Claude in Chrome** leería x.com con la sesión de Sergio Urcullo, pero el 26-oct no había ningún Chrome conectado
  (`list_connected_browsers` vacío).
- **Grok** tiene búsqueda nativa en X. Pide The X Subscription desde USD 8/mes (`2026-10-26-grok-y-aislamiento.md`),
  y Hermes ya trae el proveedor `xai-oauth`. Es un gasto: lo decide él.

Lo que se vio en X del 9 al 22-oct coincide con el diseño de ONIA:
- un agente planifica y escribe los tickets;
- otros los construyen en paralelo;
- revisa un modelo distinto;
- todo termina en un PR que mergea un humano.

Ejemplos: EXM7777 (Claude como «cofundador» y una flota de Codex), Triglav (Staff, Seniors, tablero común y panel de
revisión; 34 de 41 tareas cerradas en 10 días), Orchevia (aprobación humana del plan, revisión de Claude y Codex en
paralelo, a lo sumo 2 arreglos y PR en borrador) y una tabla de ruteo de modelos por tipo de tarea (Colby Hill).

## 4. Skills

### 4.1 Dónde hay skills (contado el 26-oct)

| Lugar | Cuántas | Quién las lee |
|---|---|---|
| `.claude/skills/` del repo | 65 | Claude (si no hay una personal con el mismo nombre) y Hermes de la PC (`external_dirs`) |
| `.agents/skills/` del repo | 30 | Codex (`~/.agents/skills` es un enlace a esta carpeta) |
| `hermes-content/skills/*.md` | 17 | El Hermes del VPS |
| `~/.claude/skills` (personales) | 98 | Claude en la PC, y **le ganan** a las del repo con el mismo nombre |
| `~/.codex/skills` | 61 | Codex en la PC |
| `onia-platform/.claude/skills` | 6 | Sesiones del producto |
| `~/.claude/commands` y `~/.claude/agents` | 72 y 43 | Claude en la PC |
| Hermes, de fábrica | 51 (48 apagadas) | Hermes de la PC |

Hay 208 nombres distintos. 54 están en dos o más lugares, y 21 de esos tienen contenido distinto según dónde se lean
(13 de HyperFrames y video, más impeccable, entre el repo y `~/.codex/skills`).

### 4.2 Repo: lo que hace trabajar mal (revisor aparte, 26-oct)

45 de las 65 de `.claude/skills/` están vigentes. Las tres contradicciones más graves:
1. **«La madre» sigue dando órdenes.** Aparece en onia-ventas-pauta (18 veces), onia-hermes-jarvis (26),
   edicion-referentes (12), aprender-de-todo, diseno-contenido-onia, onia-continuidad, editor-videos y
   `pedir-a-claude.md`. Mandan a pedirle cosas o a esperar su aprobación, y ya no existe.
2. **higgsfield-generate dice «no pre-estimar costo»** (`:72` y `:75`, en las dos carpetas). La regla dura de
   `CLAUDE.md` exige cotizar antes de cada generación y pedir el OK para video.
3. **`planificar-orquesta.md` le dice al Hermes del VPS que planifique solo**, con la revisión de cada 3 h. Está
   pendiente en el paso 5 de `ONIA_HARNESS.md` §7.

También:
- La precedencia está escrita al revés (dice que gana la del repo) en onia-continuidad, el README de skills y
  `STACK-POR-DOMINIO.md`.
- onia-core está desactualizada: dice «beta» y «3 adapters» (hay 4), y da otro orden de rubros.
- onia-propuestas escribe precios a mano y nombra un subagente retirado.
- onia-web-factory y onia-router siguen mandando al panel onia-center, abandonado el 31-ago.
- embedded-captions y higgsfield-soul-id difieren entre `.claude` y `.agents`.
- `impuestos-bolivia-operaciones.md` y `recordatorios-fiscales-bolivia.md` se pisan.
- Candidatas a archivar: remotion-to-hyperframes, changelog-video, `brief-diario-onia.md` y
  `actas-reuniones-onia.md`.

Workshops y comunidad no tiene skill propia.

### 4.3 Fuera del repo: lo que pisa o sobra (revisor aparte, 26-oct)

Se midió el uso real: las invocaciones en las transcripciones locales de Claude Code del 26-sep al 26-oct (2.694
archivos).
- **Personales de Claude (98):**
  - 16 son idénticas a las del repo.
  - De las otras 82, solo 11 se usaron en 30 días: code-review-spec, community-marketing, design-dna,
    emil-design-eng, humanizer, lead-magnets, make-pdf, onboarding, stop-slop, taste-design y ui-ux-pro-max.
  - Las 18 de gstack (1,3 GB, cero usos) se pisan con los revisores propios.
- **Comandos (72):** cero usos en 30 días. 17 son de otros lenguajes (Go, Rust, Kotlin…) y 13 son multiagente, que
  chocan con la orquesta.
- **Agentes (43):** se usan 5 (general-purpose, code-reviewer, security-reviewer, Explore y claude-code-guide).
  28 no se usan nunca.
- **Plugins:**
  - Se usan solo superpowers y ponytail.
  - everything-claude-code y caveman están desactivados, pero sus copias sueltas siguen cargando desde `~/.claude`.
- **Codex (`~/.codex/skills`, 61) es lo más grave:**
  - 14 HyperFrames de septiembre pisan las de julio que el repo eligió el 2-oct.
  - impeccable es de mayo.
  - Hay 4 skills congeladas en `historial/`.
  - 7 skills le enseñan git, `gh` y deploy, que `AGENTS.md` le prohíbe.
  - Los plugins Remotion (jubilado), Vercel (54 skills; producción es el VPS) y una tercera copia de HyperFrames
    están activos. La copia buena para Codex es `~/.agents/skills`, que es un enlace al repo.
- **Peso en contexto:** las descripciones personales suman ~9,7 mil tokens por sesión, las de Codex ~5,8 mil, los
  agentes ~2,1 mil y los comandos ~1,5 mil.
- **Las copias de claude.ai** (`anthropic-skills:*`) tienen versiones viejas de 31 skills del repo, por ejemplo
  equipo-de-agentes con la madre. Llevan otro prefijo, así que no pisan a las del repo, pero se pueden cargar por
  error.

## 5. Plan de limpieza propuesto

1. **Repo, por PR.** Corregir las contradicciones de §4.2:
   - «madre» pasa a los actores vigentes;
   - higgsfield-generate cotiza antes de generar;
   - la precedencia, escrita como es;
   - onia-core, onia-propuestas, onia-web-factory y onia-router, al día;
   - igualar `.claude` y `.agents`;
   - fusionar las dos fiscales;
   - archivar las 4 sin uso.

   Sirve a todos los agentes a la vez, Hermes incluido.
2. **PC, con un script que mueve y no borra** (`*-archivadas-<fecha>`, como el 26-oct). Lo corre Sergio Urcullo,
   porque es config de agentes:
   - Codex queda solo con lo del repo;
   - en las personales quedan las 11 usadas y las idénticas al repo;
   - se archivan 47 comandos y 28 agentes;
   - las carpetas que no son skills salen de `skills/`;
   - se desinstalan los plugins desactivados.
3. **Hermes sabe lo mismo que Claude.**
   - Se le dejan todas las skills del repo (se descarta el recorte a 7).
   - Se le suma Exa, que hoy tiene solo Claude, y el lector de X con el perfil dedicado.
   - Lo vigente de la memoria de Claude, que vive fuera del repo, pasa a las skills o a los handoffs.
4. **Un solo método de sesión.** Hoy cargan superpowers, ponytail, las reglas de everything-claude-code y gstack, con
   órdenes que se contradicen. Elige Sergio Urcullo.
