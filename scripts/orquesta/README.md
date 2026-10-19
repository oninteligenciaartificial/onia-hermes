# Orquesta ONIA

Un programa fijo reparte el trabajo; los modelos solo trabajan. Corre en la PC de Sergio Urcullo,
donde están las skills, los plugins, la memoria, Chrome, los videos y los logins de Claude y Codex.
Por qué así y no un coordinador de IA: `hermes-content/docs/research/harness-orquestacion-autonomia.md`.

## Cómo se pide una tarea

Un issue en `oninteligenciaartificial/onia-hermes` con dos labels: `orquesta` y `carril:<área>`.
Lo puede abrir Sergio Urcullo desde el celular, cualquier sesión o Hermes (con `gh`). Solo se toman
issues de los autores en `carriles.json` → `autores`.

```
nivel: normal          # rapido | normal | profundo (elige el modelo)
check: urls            # opcional: urls | cmd <comando que debe salir 0>
motor: codex           # opcional: cambia el motor del carril
salida: ruta/archivo.md  # opcional: dónde escribe el resultado
base: codex/mi-rama    # opcional: trabaja sobre esa rama (p. ej. la de un PR) y entrega contra ella

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
2. Crea un worktree limpio desde `origin/<base>` en `E:/onia-orquesta/<carril>-<n>` (en E: porque cada copia de onia-hermes pesa ~5,5 GB y C: tiene poco libre).
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

Nunca publica, gasta, escribe a terceros, toca producción ni mergea. Los PRs quedan para el gate.
Las ramas `orquesta/*` no adelantan `main` aunque corra el autosync (`scripts/git-autosync.js`).

Labels que usa (ya creados el 18-oct): `orquesta`, `en-curso`, `bloqueada`, `carril:plataforma`,
`carril:marca`, `carril:comunidad`, `carril:video`, `carril:investigacion`. Carril nuevo = entrada en
`carriles.json` + `gh label create carril:<nombre>`.

Trampa medida (18-oct): una sesión de Claude Code en modo auto NO puede lanzar estos trabajadores (el
control de permisos lo bloquea como «Create Unsafe Agents»). La pasada la corre la tarea programada
de Windows o Sergio Urcullo desde una terminal.

## Correr

```bash
node scripts/orquesta/orquesta.mjs --dry      # qué tomaría y con qué modelo
node scripts/orquesta/orquesta.mjs            # una pasada
node --test scripts/orquesta/orquesta.test.mjs
```

Automático (Windows, cada 3 h de 8 a 23 con la PC prendida):

```powershell
schtasks /Create /TN "ONIA Orquesta" /SC DAILY /ST 08:00 /RI 180 /DU 15:00 /TR "cmd /c cd /d C:\dev\proyectos\onia-hermes && set ORQUESTA_TELEGRAM=1 && node scripts\orquesta\orquesta.mjs >> %USERPROFILE%\.onia-orquesta\pasadas.log 2>&1"
```

`ORQUESTA_TELEGRAM=1` manda el resumen de la pasada al resumen diario de Hermes (aduana, sin interrumpir).
