# Auditoría del harness, accesos y skills · 25-oct-2026

Estado: **auditoría terminada y verificada**. Evidencia local, contraste GitHub y cobertura de las 60 skills comprobados. Se entregan decisiones propuestas, no una activación ni una limpieza ejecutada.

## META, PRUEBA DE HECHO y REGLA DE PARADA

- **META:** comprobar el esquema contra fuentes primarias y el host real, separar capacidad de autenticación e inventariar skills para decidir qué usar o consolidar.
- **PRUEBA:** evidencias JSON/CSV completas del alcance declarado, pruebas locales del dispatcher, dictámenes independientes y propuesta de skills sin borrar.
- **PARADA:** cerrar cuando las afirmaciones tengan evidencia o una limitación explícita. No ampliar a reparar OAuth, instalar herramientas, activar colas o ejecutar tareas históricas.

## Veredicto local

El núcleo Hermes está instalado y funciona: esta sesión usa herramientas, escribe/lee archivos y delega trabajo. **No está comprobado un operador universal de todas las apps.** La configuración y la documentación no sustituyen una prueba autenticada por cada app. Tampoco hay una prueba actual end-to-end de todas las sesiones externas o de operación 24/7.

La arquitectura local vigente es **Hermes planifica → `scripts/orquesta/` reparte → trabajadores acotados → revisión → aprobación reservada**. El piloto Orca es otra vía local supervisada, no una segunda cola que deba correr en paralelo sobre la misma tarea. Fuente: `COORDINATION_MANIFEST.md:3–15`, `scripts/orquesta/README.md:6–16,55–86`.

Instalación inspeccionada: Hermes v0.22.2, commit `d923a5eb487a17c0a68801bba9ef0f56c81040a8`; Orca 1.4.238. La CLI anuncia actualización disponible, pero **no se instaló ni se afirma estar en la versión más reciente**. La documentación actual se contrasta por separado con el código instalado.

## Qué acceso tengo realmente

| Frente | Evidencia de esta auditoría | Límite |
|---|---|---|
| PC/terminal | Comandos locales ejecutados y checkout identificado. | Permisos del usuario/proceso y de las herramientas; no sandbox universal. |
| Archivos | Prueba de escribir y leer un archivo propio en scratch; retirada después. | No se abrieron secretos ni documentos personales. |
| Escritorio | `computer_use` enumeró apps y capturó controles de Chrome. | Listar una app no prueba que se pueda completar cualquier operación. No se probaron clics arbitrarios. |
| Navegador automatizado | Abrió la página pública oficial de seguridad y evaluó su título/origen. | No equivale a heredar la sesión del Chrome OnIA personal. |
| GitHub | API autenticada; repo `oninteligenciaartificial/onia-hermes` accesible con permiso ADMIN. | Solo lecturas; no issues, pushes, PRs ni cambios de permisos. |
| Google por CLI | `gws auth status`: OAuth y refresh token presentes, `token_valid=false`. | Estado de ese cliente, no prueba sobre todas las sesiones web. No se solicitó login ni se exportaron credenciales. |
| Google Drive por navegador automatizado | Redirigió a `accounts.google.com/.../signin/identifier`. | Requiere autenticación para esa ruta; no se rellenó ni se consintió nada. |
| Notion/Higgsfield por navegador automatizado | Home pública con control de inicio de sesión, sin workspace acreditado. | No prueba que las sesiones del Chrome personal estén cerradas. |
| Conectores alojados | El listado de `manage_connections status` no reportó cuentas conectadas. | No diagnostica por sí solo integraciones locales o el navegador personal. |
| MCP nativo Hermes | `hermes mcp list`: no hay servidores configurados. | Los MCP de Claude/Codex no se heredan automáticamente. |
| Bóveda | No existe la ruta propuesta `C:/Users/PC/BovedaPrivada/Agentes.kdbx`; el puente `browser_vault list` no ofreció entradas para el login Google actual. | Una extensión KeePassXC visible en Chrome no acredita bóveda, desbloqueo o puente autorizado. No se buscó ni leyó otra bóveda. |
| n8n/Supabase | CLI n8n presente; conector Supabase alojado no conectado. | Acceso a cuentas/workflows/proyectos por otras vías sin verificar; no se concluye que no existan. |
| Telegram | Proceso desktop observado. | No se revalidó entrega por el gateway ni se enviaron mensajes. |
| SIAT/Impuestos | Deliberadamente no abierto. | Acceso exclusivamente manual según `hermes-content/skills/seguridad-credenciales.md:8–14`. |

Evidencia: `estado-accesos-20261025.json`, `accesos-cli-20261025.json`, `accesos-browser-20261025.json`, `discovery-nativo-20261025.json`. El acceso a cuentas no autoriza gasto, publicaciones, contacto con terceros ni producción.

## Inventario: números que sí significan algo

| Alcance | Manifiestos encontrados | Interpretación |
|---|---:|---|
| Perfil Hermes default | 60 | Archivos instalados, no todos ofrecidos en Windows/esta configuración. |
| CLI Hermes `--enabled-only` | 53 | Filas de la lista nativa; no confirma prerrequisitos ni aplicación. |
| Repo ONIA Hermes `.claude/skills` | 66 | Fuente canónica de las skills ONIA. |
| Repo ONIA Hermes `.agents/skills` | 32 | Hay solapamiento con `.claude`, no sumar como capacidades nuevas. |
| Producto `.claude/skills` | 6 | Skills específicas de frontend/backend/DB/seguridad/deploy/verificación. Conservar. |
| Producto `.agents/skills` | 16 | Paquete de diseño/frontend; distinto de las 6 skills de producto. |
| Usuario Claude, entrada directa `<skill>/SKILL.md` | 113 | No confundir con todos los archivos de repos anidados. |
| Usuario Codex, búsqueda recursiva declarada | 66 | Inventario de archivos, no certificación del discovery de Codex. |
| Markdown heredado `hermes-content/skills` | 40 | Procedimientos locales; no llamarlos automáticamente skills nativas Hermes. |

La enumeración ampliada cubrió las diez raíces declaradas: 1.546 entradas contando aliases, 1.514 rutas físicas de manifiesto y 445 nombres distintos, sin errores de lectura. **No son 1.546 skills activas.** En el global Claude, 525 archivos pertenecen al checkout `gstack`, 429 a `everything-claude-code`, 127 a `.trash` y 75 a `synced`; muchos son documentación, traducciones, copias o respaldos. Las versiones de otros perfiles Hermes, caches de plugins, commands y copias de worktrees están fuera del alcance, explícitamente; no se propone borrarlas sin revisarlas.

`C:/Users/PC/.agents/skills` resuelve al `.agents/skills` del repo: es un enlace, no otra copia a eliminar. El inventario no ejecutó cuerpos, preprocessors ni setup de las skills. El frontmatter se extrajo estáticamente; no se certifica validación YAML completa.

Inventario completo: `inventario-skills-20261025.json` y `.csv`. El script `inventariar-skills.py` conserva el procedimiento; no reemplaza un snapshot previo automáticamente.

## Stack observado frente a stack necesario

Snapshot del ledger del perfil default durante esta auditoría:

| Skill | Cargas/vistas registradas |
|---|---:|
| hermes-agent | 123 |
| onia-operar-harness | 73 |
| onia-relevo-sesion | 17 |
| requesting-code-review | 16 |
| systematic-debugging | 14 |
| claude-code | 13 |
| github | 9 |
| test-driven-development | 9 |

**Es telemetría de carga, no de tareas resueltas ni calidad.** `tools/skill_usage.py:492–508` separa vista y carga/referencia. El registro no cuenta lecturas de skills de proyecto mediante `read_file`, ni mide todas las sesiones Claude/Codex. Los números cambian al consultar referencias; no son una factura ni una ventana universal de uso.

El foco observado en harness/operación es desproporcionado respecto de producción; es una lectura de distribución de cargas, no una medición causal del tiempo perdido. No se arregla borrando contenido útil.

Stack propuesto, cargado por tarea y no todo junto:

- **Base ONIA:** router, equipo-de-agentes y aprender-de-todo, según las reglas del repo; Hermes usa onia-operar-harness para contratos/evidencia.
- **Investigación:** grounded-citations + aprender-de-todo; referencia técnica pertinente. No repetir auditorías generales.
- **Desarrollo:** skill de producto correspondiente + TDD/debugging + revisión antes de cerrar.
- **Marca/contenido:** diseno-contenido-onia, edicion-referentes, ver-videos/editor-videos cuando corresponda, copywriting/humanizer.
- **Herramientas de trabajo:** github, computer-use o google-workspace únicamente cuando la vía de acceso esté disponible y la tarea lo necesite.

## Consolidación posible, todavía sin borrar

### Clasificación de las 60 skills del perfil Hermes

| Categoría propuesta | Cantidad | Acción recomendada |
|---|---:|---|
| Núcleo transversal | 12 | Conservar; la categoría NO significa cargarlas todas en cada tarea. |
| Por tarea | 39 | Conservar disponibles y cargar solo la especialidad pertinente. |
| Solo macOS | 4 | Ya quedan fuera del catálogo Windows observado; no hace falta borrarlas. |
| Baja prioridad actual | 5 | Candidatas a desactivar visibilidad, no a borrar automáticamente. |

Las cinco candidatas son `ascii-video`, `manim-video`, `p5js`, `songsee` y `songwriting-and-ai-music`: formatos especializados sin prioridad actual registrada, no capacidades demostradas como inútiles. La propuesta no usa ausencia de contadores como criterio de baja.

Las cuatro de macOS son `apple-notes`, `apple-reminders`, `findmy` e `imessage`; sus plataformas se contrastaron directamente. Borrarlas no reduce un catálogo Windows que ya las filtra.

La revisión conserva `github` como utilidad por tarea, aunque figura entre las cargas frecuentes. El stack de proceso y el stack de herramientas no son la misma clasificación. Skills como `sdlc-review` o las de autoría se conservan, pero no se habilitan ni se cargan solo por figurar en el núcleo propuesto.

**Cobertura:** 60 filas, 60 nombres únicos, exactamente los 60 manifiestos inventariados; todas tienen categoría, motivo y evidencia. Las cantidades suman 60 y coinciden con el detalle. El conteo de 53 de la CLI sí fue medido por el coordinador; la limitación de PATH del hijo no invalida esa prueba local. Ver `validacion-clasificacion-20261025.json`.

Catálogo legible con todas las entradas y mapa por frente: `CATALOGO-SKILLS-20261025.md`. Detalle de máquina: `clasificacion-skills-hermes-20261025.json`. No se cambiaron activación, permisos, versiones ni archivos originales de skills en esta auditoría.

Comparación completa entre los 30 nombres compartidos de `.claude/skills` y `.agents/skills` del repo: **29 SKILL.md iguales** tras normalizar saltos de línea; **13 carpetas fuente iguales byte a byte**, incluyendo soportes y excluyendo `.git`, `node_modules` y `__pycache__`.

Las 13 carpetas iguales son: captions-overlay, cut-the-curve, higgsfield-generate, hyperframes, hyperframes-cli, hyperframes-core, hyperframes-keyframes, hyperframes-registry, oversized-cursor, seam-craft, slideshow, talking-head-recut y web-factory-intake-assets.

Esto habilita una **propuesta de consolidación**, no borrado automático. Conservar la fuente canónica y revisar discovery, rutas de scripts/referencias y compatibilidad de cada agente antes de retirar una copia. La ruta global `.agents` enlaza esta misma carpeta, por lo que tocarla puede afectar a otros ejecutores.

Un grupo del JSON `same_name_different_content` puede incluir dos copias de proyecto iguales y una global distinta: **no demuestra que el par de proyecto diverja**. La prueba exacta está en `duplicados-carpetas-20261025.json`.

No eliminar skills ONIA, video/diseño o producto por ausencia de contadores. El propio router registra que una limpieza anterior se revirtió por empeorar resultados. Las skills solo para macOS ya quedan fuera del listado Windows: borrarlas no demuestra ahorro de contexto.

## Prueba real del dispatcher

`node --test scripts/orquesta/orquesta.test.mjs` → exit0, **27 pruebas pasan, 0 fallan y 0 omitidas**. Log: `prueba-orquesta-20261025.txt`.

Se ejercitaron las pruebas existentes, incluyendo el clon/worktree temporal local sin media. TEMP/TMP/TMPDIR se dirigieron al scratch de Hermes. No se despacharon agentes, no se consultó/alteró la cola de negocio y no hubo pushes remotos. **No equivale a prueba E2E de todos los carriles, autenticación de todos los proveedores, despliegue ni suite completa npm.**

## Dictámenes independientes

- **Contraste GitHub/código instalado recibido y verificado:** seis hallazgos; los diez módulos citados se recuperaron del commit oficial inmutable y coinciden byte a byte con el checkout instalado. El esquema es consistente en lo central, pero no acredita por sí solo cuentas autenticadas ni operación end-to-end. El matiz sobre conectores se corrigió: son una vía, no la única. Evidencia: `CONTRASTE-GITHUB-20261025.md` y `github-fuentes-verificadas-20261025.json`.
- **Clasificación recibida y verificada:** `PROPUESTA-SKILLS-20261025.md` y `clasificacion-skills-hermes-20261025.json`; cobertura completa, cuatro categorías, motivos/evidencia presentes, plataformas macOS comprobadas y duplicados reconciliados contra la prueba del coordinador.

La auditoría termina con ambos dictámenes consumidos y verificados. No quedan trabajadores activos de este encargo. Permanecen sin cambiar las restricciones de apps y la falta de pruebas E2E de otros flujos. Los pendientes históricos del workshop, hooks, H09 y Anthropic quedan preservados, sin reabrirlos. La eliminación/desactivación de skills y la conexión o reparación de apps requieren un encargo concreto; no se ejecutaron como consecuencia del inventario.
