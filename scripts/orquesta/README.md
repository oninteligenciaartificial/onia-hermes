# Orquesta ONIA

Un programa fijo reparte el trabajo; los modelos solo trabajan. Por qué así y no un coordinador de IA:
`hermes-content/docs/research/harness-orquestacion-autonomia.md` (secciones v2 y v3).

## Stack v3 (19-oct): dónde corre cada cosa

| Pieza | Dónde | Qué hace |
|---|---|---|
| Cerebro | Hermes en el VPS | Planifica, carga issues `origen:hermes` con `scripts/loops/orquesta-hermes.sh` y los revisa cada 3 h (skill `planificar-orquesta`; apagado hasta que esté el token de Issues en el VPS) |
| Manos 24/7 | GitHub Actions (`.github/workflows/orquesta.yml`) | `orquesta.mjs --donde nube` con Claude Code y el token de Max (`CLAUDE_CODE_OAUTH_TOKEN`) |
| Manos con logins | PC de Sergio Urcullo | `orquesta.mjs --donde pc`: lo que usa sus sesiones o archivos (video, Meta, Instagram, Higgsfield, Buffer) |

Cada carril tiene `donde` en `carriles.json` (hoy `plataforma` y `video` → `pc`; `marca`, `comunidad`,
`investigacion` → `nube`), y un pedido lo cambia con `donde: pc|nube`. Cada lado ve solo sus issues: la
PC no suelta el `en-curso` ni contesta el «ok» de una tarea que está en la nube, y al revés.

En la nube: clon sin blobs, cada worktree sin media (`sin_media`, `ORQUESTA_SIN_MEDIA=1`), sin
`dirs_extra`, y los agentes corren sin `GH_TOKEN` (solo el orquestador pushea y comenta).

Blindaje (revisión del 19-oct): el trabajador no tiene `Read`/`Write` sin ruta (con ellos escribía fuera
de su carpeta, medido); su carpeta y `--add-dir` le alcanzan. No puede tocar `scripts/orquesta/`,
`.claude/settings*.json` ni `.mcp.json` (los cargaría el intento siguiente). El orquestador corre git
sin hooks, el `check: cmd` corre sin el token de Max, y solo valen comentarios del dueño de la cola.
Sin cupo de Max o sin login la tarea se suelta sin comentar ni gastar el reintento (⏸ en el resumen). Comenta como
`github-actions[bot]`; los PRs que abre no disparan el CI. Para abrirlos hace falta «Allow GitHub
Actions to create and approve pull requests» (Settings → Actions → General).

## Cómo se pide una tarea

Un issue en `oninteligenciaartificial/onia-hermes` con dos labels: `orquesta` y `carril:<área>`.
Lo puede abrir Sergio Urcullo desde el celular, cualquier sesión o Hermes (con `scripts/loops/orquesta-hermes.sh`, abajo). Solo se toman
issues de los autores en `carriles.json` → `autores`.

```
nivel: normal          # rapido | normal | profundo (elige el modelo)
check: urls            # opcional: urls | cmd <comando que debe salir 0>
motor: codex           # opcional: cambia el motor del carril
salida: ruta/archivo.md  # opcional: dónde escribe el resultado
base: codex/mi-rama    # opcional: trabaja sobre esa rama (p. ej. la de un PR) y entrega contra ella
ok: sergio             # opcional: al terminar no cierra; espera el OK de Sergio Urcullo con capturas
donde: nube            # opcional: pc | nube (si no, el del carril)

Qué hay que hacer.
Hecho cuando: cómo se comprueba.
```

## Áreas y modelos (`carriles.json`)

| Carril | Motor | rapido | normal | profundo |
|---|---|---|---|---|
| plataforma | Codex | gpt-6-luna | gpt-6.1-sol | gpt-6-astra |
| marca, comunidad, video, investigacion | Claude | haiku | claude-sonnet-5-5 | claude-opus-5-5 |

## Qué hace una pasada

1. Toma la tarea abierta más vieja de cada carril (máx. `paralelo` a la vez) y le pone `en-curso`.
2. Crea un worktree limpio desde `origin/<base>` en `E:/onia-orquesta/<carril>-<n>` (en E: porque cada copia de onia-hermes pesa ~5,5 GB y C: tiene poco libre; en la nube, `ORQUESTA_TRABAJO`).
3. Corre el agente sin pantalla. Claude: hooks y plugins ruidosos apagados, credenciales y `git push`
   negados (`trabajador.settings.json`, un tercio del costo de arranque), y herramientas por área
   (solo `investigacion` navega la web; solo `video` corre scripts y ffmpeg). Codex: sandbox
   `workspace-write`.
4. Comprueba el "hecho": existe el archivo de salida, tiene contenido, no dice `BLOQUEADO`, y pasa
   el `check` del pedido.
5. Revisión con contexto limpio: otro Claude (`revisor` en `carriles.json`), solo con lectura, juzga
   si cumple el "Hecho cuando" y si inventa algo. El que revisa nunca es el que hizo.
6. Si pasa: commit, push de la rama `orquesta/<carril>-<n>`, PR y cierra el issue con el resumen y
   las notas del revisor. Si no: label `bloqueada` y el motivo en el issue. Para reintentar, sacar
   `bloqueada`: el motivo del rechazo vuelve al trabajador en el intento siguiente.
7. Registro de cada corrida: `~/.onia-orquesta/registro.jsonl`.

## Ciclo con el OK de Sergio Urcullo (19-oct)

Pedido de Sergio Urcullo: «que me mande una captura y yo digo sí, me gustó, continúa; y si no me
gustó, hacemos estos cambios y continúa trabajando».

- **Nada se pierde.** Si un intento no cierra (tiempo agotado, check o revisor), lo hecho se sube a
  `orquesta/<carril>-<n>` y el próximo intento sigue desde ahí con el motivo. La primera falla se
  reintenta sola; la segunda seguida deja `bloqueada`.
- **Con `ok: sergio`**, al terminar el issue queda con `espera-ok`, las capturas y la entrega.
- **Él contesta en el issue, desde el celular.** «ok», «sí», «dale», «me gustó» → se cierra. Cualquier
  otra cosa es una indicación: la próxima pasada sigue en la misma rama con ese comentario como
  orden, y el revisor comprueba que esté aplicada. Comentar en una tarea `bloqueada` la destraba.
- El orquestador firma sus comentarios con ✅ ⛔ 👀; lo demás del hilo se lee como de Sergio Urcullo.

Nunca publica, gasta, escribe a terceros, toca producción ni mergea. Los PRs quedan para el gate.
Las ramas `orquesta/*` no adelantan `main` aunque corra el autosync (`scripts/git-autosync.js`).

Labels que usa (creados el 18 y 19-oct): `orquesta`, `en-curso`, `bloqueada`, `espera-ok`, `carril:plataforma`,
`carril:marca`, `carril:comunidad`, `carril:video`, `carril:investigacion`. Carril nuevo = entrada en
`carriles.json` + `gh label create carril:<nombre>` + el carril en `CARRILES` de `scripts/loops/orquesta-hermes.sh`
(una prueba los compara).

## Lo que carga Hermes (20-oct)

Hermes no usa `gh` (el VPS no lo tiene): `scripts/loops/orquesta-hermes.sh` va con curl y un token fine-grained de
la cuenta de Sergio Urcullo (solo Issues de `onia-hermes`, en `/root/.config/onia/gh-issues-token`, 600). Lo que crea
lleva `origen:hermes` (label creado el 20-oct) y pasa los guardarraíles de la sección «v2» del doc de investigación:
10 por día, `check:` solo `urls`, `cmd npm run test:<x>`, `cmd npm test` o `cmd node --test …` (corre sin sandbox),
`salida:` solo a `hermes-content/docs/`, y `necesita-ok` (label creado el 20-oct) si publica, gasta, contacta, toca
producción o mergea, **y siempre si corre en la PC o su check es un `cmd`**: lo único que arranca solo es `nube` +
`urls`. **Con `necesita-ok` el orquestador no la toma**: Sergio Urcullo la suelta sacándole el label (el workflow no
escucha `unlabeled`: la toma la próxima pasada o el próximo comentario); le aparece en NECESITO del resumen y del
cierre. Hermes solo cierra sin hacer (`not_planned`) lo suyo que todavía está en cola. Un trabajador no puede tocar
`scripts/loops/` ni `hermes-content/{deploy,skills}/` (`PROTEGIDAS`): eso corre como root en el VPS.

Riesgo que queda (revisión de seguridad del PR #252): el token es de la cuenta de Sergio Urcullo, así que un Hermes
inyectado que use curl directo (sin el comando) crea issues, saca labels o comenta como si fuera él. Se cierra con
una cuenta de GitHub aparte para Hermes y que `orquesta.mjs` trate sus issues con menos confianza.

Trampa medida (18-oct): una sesión de Claude Code en modo auto NO puede lanzar estos trabajadores (el
control de permisos lo bloquea como «Create Unsafe Agents»). La pasada la corre la tarea programada
de Windows o Sergio Urcullo desde una terminal.

## Correr

```bash
node scripts/orquesta/orquesta.mjs --dry --donde pc   # qué tomaría la PC y con qué modelo
node scripts/orquesta/orquesta.mjs --donde pc         # una pasada de la PC
node --test scripts/orquesta/orquesta.test.mjs
gh workflow run orquesta.yml -R oninteligenciaartificial/onia-hermes   # una pasada de la nube
```

Sin `--donde`, la PC es `pc` y Actions es `nube` (`GITHUB_ACTIONS`). Automático en la PC (Windows,
cada 3 h de 8 a 23 con la PC prendida):

```powershell
schtasks /Create /TN "ONIA Orquesta" /SC DAILY /ST 08:00 /RI 180 /DU 15:00 /TR "cmd /c cd /d C:\dev\proyectos\onia-hermes && set ORQUESTA_TELEGRAM=1 && node scripts\orquesta\orquesta.mjs --donde pc >> %USERPROFILE%\.onia-orquesta\pasadas.log 2>&1"
```

La nube corre sola: al etiquetar o comentar un issue de la orquesta y cada 3 h de 8 a 23 (La Paz).
Necesita el secreto `CLAUDE_CODE_OAUTH_TOKEN` (lo crea Sergio Urcullo con `claude setup-token`).

`ORQUESTA_TELEGRAM=1` manda el resumen de la pasada al resumen diario de Hermes (aduana, sin interrumpir).

## Preparación del 21-oct: cambios locales pendientes de revisión

No se publicó ni lanzó una pasada real. Entrada para revisar: `hermes-content/docs/handoff/arranque-ecosistema-20261021.md`.

- Aprobación: un ok anterior a la entrega es una indicación histórica, nunca aprobación anticipada. Se exige comentario posterior a la creación/última edición de la entrega, autor autorizado, IDs/URLs/fechas reales y Commit SHA. El cierre conserva hashes de ambos comentarios e identidad de cuenta. `gh --json comments` no incluye updatedAt: en espera-ok se consultan comentarios REST paginados y se mapea updated_at. Se lee además el SHA actual de la rama remota antes de cerrar; si cambió, falta versión o falla la lectura, no se aprueba. Entregas antiguas sin Commit requieren nueva entrega versionada, no inventar su SHA.
- URLs: solo 2xx comprueba accesibilidad HTTP, no la veracidad del contenido. 401/403/429 o errores/timeout son no-verificables, los demás estados no exitosos fallan. Sin enlaces o con más de 60 se rechaza la comprobación; no se trunca la cobertura. Tipos desconocidos se rechazan. `cmd <comando>` conserva su camino heredado: no se añadieron comandos ni permisos.
- Video: el trabajador copia únicamente el preview necesario al worktree y escribe `<salida>.evidencias.json`, version=1, archivos con ruta relativa, bytes y sha256 reales. Solo extensiones media, hasta 20 archivos, 64 MiB por archivo, 128 MiB total; manifest hasta 64 KiB. Se comprueban realpath, tamaño, integridad y preview con ffprobe ya instalado (argumentos fijos, sin shell, protocolos/formatos acotados). El revisor no recibe --add-dir ni acceso global a brutos. La revisión textual/técnica NO demuestra haber visto el video ni aprueba estética/ritmo; el carril video siempre espera OK humano. La tabla de cortes puede quedar en el Markdown de entrega. Copiar el preview no concede derechos de publicación: inspeccionar privacidad/derechos antes de subirlo con una pasada futura.
- Fixture: clon local con --no-local y ruta nativa evita file:///C:/ interpretado por MSYS como /C:/. Conserva transporte/filtro parcial sin plataforma hardcodeada. Prueba real en Windows; Linux no fue ejecutado en este encargo.
- Pruebas: `node --test scripts/orquesta/orquesta.test.mjs scripts/orquesta/verificacion.test.mjs scripts/orquesta/evidencias.test.mjs`; los nuevos archivos están cableados en package.json. Requieren ffmpeg/ffprobe existentes; no autoinstalan. Los fixtures son sintéticos y los HTTP están doblados, sin red.

### Fronteras que NO quedaron resueltas

Estas reglas no son un sandbox de sistema operativo. La reparación no acredita autonomía ni permite operar material no confiable:

1. PROTEGIDAS ahora bloquea entradas AGENTS.md/CLAUDE.md/.hermes.md y los árboles .claude/.agents/.hermes; el aprendizaje se propone en la entrega para revisión, no se edita directamente. Es un guard posterior, NO aislamiento del ejecutor ni saneamiento de ramas antiguas ya contaminadas. Otros documentos consultados siguen siendo datos no confiables, no permisos nuevos.
2. guardarAvance conserva/sube cambios rechazados si no coinciden con PROTEGIDAS; prepararWorktree los carga en el siguiente intento. Revisión rechazada no significa árbol saneado. Diseñar cuarentena con referencias explícitas antes de tareas no confiables.
3. Los checks cmd heredados ejecutan shell/código del trabajador fuera de sandbox; quitar GH_TOKEN y un OAuth no elimina otras credenciales locales, acceso de red o clientes autenticados. El texto del pedido y las allowlists no constituyen aislamiento. No se ejecutó ningún cmd de tarea real aquí.
4. Trabajador, automatización y humano pueden compartir cuenta GitHub. Se preserva el login observado, NO se atribuye criptográficamente una intención humana. Las marcas y hashes no son una firma de Sergio Urcullo. Una cuenta separada/identidad de aprobador requiere decisión posterior.
5. Candado por host y etiquetas no dan exactamente-una-vez. Entre crear PR, comentar y cambiar labels puede morir el proceso; soltarHuerfanas y reintentar no tienen transacción distribuida ni acreditan ausencia de duplicados. La lectura de rama/comentarios previa al cierre tampoco elimina una carrera con cambios concurrentes. Revisar idempotencia con fixtures de fallos por etapa antes de producción.
6. ffprobe comprueba contenedor/streams/duración, no decodifica toda la secuencia ni juzga contenido, cortes, derechos o calidad. Sus límites técnicos no son una protección completa contra archivos multimedia maliciosos; usar aislamiento adicional para entradas hostiles.

Revisión independiente solicitada: bloqueada por presupuesto one-shot de dos hijos ya usados. No se elevó el límite ni se usó otro camino equivalente. Los logs y el informe distinguen revisión propia de independiente.

La revisión posterior de Luna no aprobó la primera versión. Se reprodujeron/corrigieron la entrada .hermes.md no protegida y enlaces intermedios; también se revalida manifest/medios contra blobs del commit inmutable antes de publicar y el push usa ese SHA explícito, no una rama/HEAD que pueda cambiar. El contrato JSON tolera formato/CRLF, los medios requieren identidad byte a byte; los ensayos solo crean repos y remotos bare locales sintéticos. No se publicó nada de ONIA.

Siguen abiertos: fetch con destino/redirecciones arbitrarios (ya estaba en la base, no lo introdujo esta reparación) y la no atomicidad entre leer una rama y cerrar el issue. No se declara SSRF resuelto ni una aprobación transaccional: requieren aislamiento de red/identidad y un protocolo de versión antes de operar con tareas no confiables. La nueva comprobación de blobs no convierte al host compartido en un sandbox ni revisa automáticamente todo el código de la entrega.

### Verificación posterior del coordinador padre

Se reejecutaron las pruebas y se contrastó el baseline de guardas en main, sin modificarlo. La prueba real de Codex CLI con Luna respondió; la de Claude CLI falló por `OAuth session expired and could not be refreshed`: el login almacenado no acreditaba inferencia. Se agregó una regresión RED/GREEN para que `sinMotor` reconozca OAuth session/token vencido como infraestructura, incluso si el JSON trae `subtype: success` e `is_error: true`. Esto no repara ni sustituye la autenticación del usuario. Informe vigente y revisión independiente: `VERIFICACION-PADRE.md` en el directorio durable del encargo.
