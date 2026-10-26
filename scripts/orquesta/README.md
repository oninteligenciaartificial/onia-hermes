# Orquesta ONIA

Un programa fijo reparte el trabajo; los modelos solo trabajan. Por qué así y no un coordinador de IA:
`hermes-content/docs/research/harness-orquestacion-autonomia.md` (secciones v2 y v3).

## Stack v3 (19-oct): dónde corre cada cosa

| Pieza | Dónde | Qué hace |
|---|---|---|
| Cerebro | Hermes de la PC (desde el 26-oct) | Planifica: carga issues con `gh issue create`, siempre con `origen:hermes` + `necesita-ok`, y verifica las entregas. El Hermes del VPS solo carga lo que Sergio Urcullo le dicta por Telegram (`scripts/loops/orquesta-hermes.sh`); su revisión de cada 3 h queda por pausar. Mapa completo: `hermes-content/docs/ONIA_HARNESS.md` |
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
