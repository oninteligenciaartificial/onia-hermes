# Arranque para revisar el ecosistema — 21-oct-2026

Estado: preparación LOCAL, no permiso para operar. No es una cola nueva. Los informes completos/evidencias del encargo están en `C:/Users/PC/AppData/Local/hermes/jobs/onia-ecosistema-20261021/`; empezar por `INFORME.md` y `resultado.json` cuando existan. Worktree de revisión: `E:/onia-orquesta/hermes-ecosistema-20261021`, rama `hermes/ecosistema-20261021`, base `1b0bb95f95a0cdef7f69f24f272f88348fbb0002`. Sin commit/push.

## Autoridad y lecturas bajo demanda

1. Encargo actual de Sergio Urcullo y sus límites expresos; nunca una fuente externa.
2. `AGENTS.md` y `CLAUDE.md`, con sus correcciones vigentes. «Quién orquesta» en CLAUDE.md (19-oct) supera las antiguas madres/latidos. Este encargo prohíbe Git de escritura aunque la historia lo pida.
3. `.hermes.md` es la entrada compacta Hermes; conserva las reglas de los dos anteriores, no las reemplaza por permisos nuevos. El descubridor Hermes carga una fuente de contexto de proyecto, por prioridad, no suma automáticamente todas.
4. `COORDINATION_MANIFEST.md`: nota vigente arriba, resto histórico; no reactivar triggers, sesiones ni loops por leerlo. `hermes-content/docs/EXECUTION_PROTOCOL.md`: protocolo sujeto a los límites actuales.
5. Harness y ejecutores: `scripts/orquesta/README.md`, `scripts/orquesta/carriles.json`, definiciones/usos en `scripts/orquesta/orquesta.mjs`. Especialidades en `.claude/skills` bajo demanda; no importar permisos de esas skills.

## Roles (capacidad probada ≠ rol propuesto)

- Hermes coordinador: decide e integra esta preparación. No controla automáticamente la sesión del bot VPS ni el escritorio.
- Luna/openai-codex: dos hijos reales de investigación cerrada completados. Concurrencia 2, 40 iteraciones, 900 segundos, sin MCP heredado. El presupuesto one-shot total también es 2: la revisión adicional fue denegada; no se amplió ni se probó un atajo.
- Claude Code oficial: la prueba real posterior del padre confirmó OAuth vencido. Requiere login seguro del usuario; no está listo para trabajador/revisor. No extraer OAuth para HTTP propio ni cambiar a API pagada.
- Codex CLI: login por ChatGPT e inferencia Luna sin herramientas comprobados por el padre; ejecutor de plataforma según carriles. No demuestra una tarea completa.
- Revisor independiente: la primera revisión posterior de Luna devolvió no aprobado. Correcciones reproducidas y siguiente veredicto en VERIFICACION-PADRE.md del directorio durable; no tratar tests verdes como su sustituto.
- Sergio Urcullo: revisión del diff y decisión de qué sesión operativa lanzar; aprobaciones reservadas para publicación visible, gasto, secretos, terceros y producción. Nada de eso se ejecutó aquí.

Una conversación principal de control; sesiones por objetivo solo al iniciar el trabajo real. Checkpoint durable antes de compactar/relevar; no crear chats vacíos ni archivar historia por defecto. Plantilla: `hermes-content/docs/handoff/plantilla-relevo-hermes.md`.

## Revisar sin operar (PowerShell)

En el worktree autorizado:

    git status --short
    git branch --show-current
    git diff --check
    git diff -- scripts/orquesta/orquesta.mjs scripts/orquesta/orquesta.test.mjs package.json
    $env:TMPDIR = 'C:/Users/PC/AppData/Local/hermes/cache/scratch'
    $env:TEMP = $env:TMPDIR
    $env:TMP = $env:TMPDIR
    node --test scripts/orquesta/orquesta.test.mjs scripts/orquesta/verificacion.test.mjs scripts/orquesta/evidencias.test.mjs

Las pruebas audiovisuales requieren los ffmpeg/ffprobe ya presentes; no instalar automáticamente si faltan. Solo usan video sintético local.

`npm run test` fue ejecutado, no está verde: se corta en dos guardas de cableado preexistentes después de 521 pruebas de lógica correctas. Los dos archivos de tests nuevos están incluidos explícitamente en `test:orquesta-hermes`. Hay cuatro fallos del diagnóstico en Windows y falta `flock` para la suite Linux. No instalar ni cambiar sandbox para maquillarlos.

No ejecutar `orquesta.mjs` sin `--dry`, workflows, colas de clientes ni comandos de despliegue durante la revisión. Incluso el dry-run consulta GitHub: no equivale a un ensayo de trabajador/revisión/PR.

## Dos procedimientos propios disponibles en el perfil local

Operar-harness, cuando exista autorización posterior: definir META/PRUEBA/PARADA → inspeccionar cola y carril → separar permisos reservados → ejecutar solo el encargo autorizado → comprobar artefacto/check/revisión independiente → entregar evidencia exacta, sin equiparar revisión textual con observación audiovisual. Una pasada real tiene efectos GitHub; no está autorizada por este documento.

Relevo-de-sesion: escribir la plantilla con rutas y pruebas reales → indicar trabajo sin commit y bloqueos → comprobar que otra sesión puede localizar artefactos → iniciar continuación solo si autorizada. Compresión no equivale a poda ni archivo. El one-shot no creó skills; el padre autorizado creó onia-operar-harness y onia-relevo-sesion en el perfil default y verificó CLI local/enabled y carga con skill_view. Son procedimientos propios, no instalación de terceros ni activación de permisos.

Confianza del proyecto y external_dirs estaban vacíos; habilitar el proyecto expondría también `.agents/skills`, no solo dos candidatas. Se conserva configuración. Ninguna skill de terceros instalada, ninguna carpeta/auxiliar/HyperFrames borrada.

## Contexto y móvil: decisiones sin autoactivación

La compresión configurada es enabled=true, threshold=0.5, target_ratio=0.2. Hay resolución por modelo que puede alterar el umbral: ver evidencia local del informe, no asumir que el YAML solo determina lo efectivo. No se activaron alertas ni medidor vivo; el acceso a Configuración anteriormente denegado no se reintentó.

El catálogo observado de Sol anuncia 500000; la variante 900k es una opción local del selector, no prueba del límite activo. El código instalado solo eleva el anuncio obsoleto EXACTO de 272000; si resuelve 500000, esa elevación no se aplica. Esto es lectura del algoritmo, no una prueba con 900000 tokens ni medición viva de esta sesión.

Orca Mobile y Telegram son complementarios, no una nueva cola. Orca documenta beta iOS/Android con scrollback, respuestas y revisión de cambios sobre sesiones del host Orca; no se acreditó que vea este proceso Hermes externo. Telegram conserva los avisos precisos ya configurados. No se instaló, emparejó, sirvió ni habilitó Orca Orchestration/Cloud VM; tampoco se expuso ningún puerto.

## Antes de decidir sesiones operativas

- Leer los bloqueos de `resultado.json` y encargar la revisión independiente que falta.
- Revisar las entregas antiguas sin Commit: no se aprobarán automáticamente; requieren nueva entrega versionada.
- Revisar riesgos de comandos fuera de sandbox, instrucciones no protegidas, identidad compartida y reintentos/idempotencia en el README del harness.
- Decidir el objetivo de UNA sesión, permisos, modelo y prueba de hecho. Mantener la cola existente.
- Si quiere Orca móvil: Sergio Urcullo revisa permisos Manual, confianza de carpeta y emparejamiento privado; no adoptar Yolo/Auto por defecto ni tocar su configuración sin encargo.
