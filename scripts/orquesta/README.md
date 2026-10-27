# Orquesta ONIA

Un programa fijo reparte el trabajo; los modelos solo trabajan. Por qué así y no un coordinador de IA:
`hermes-content/docs/research/harness-orquestacion-autonomia.md` (secciones v2 y v3).

## Stack v3 (19-oct): dónde corre cada cosa

| Pieza | Dónde | Qué hace |
|---|---|---|
| Cerebro | Hermes de la PC (desde el 26-oct) | Planifica: carga issues solo con `scripts/orquesta/cargar-issue.mjs` (siempre `origen:hermes` + `necesita-ok`; sección «Cómo carga Hermes de la PC», abajo) y verifica las entregas. El Hermes del VPS solo carga lo que Sergio Urcullo le dicta por Telegram (`scripts/loops/orquesta-hermes.sh`); su revisión de cada 3 h queda por pausar. Mapa completo: `hermes-content/docs/ONIA_HARNESS.md` |
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
5. Revisión con contexto limpio: otro Claude, de otra familia que el trabajador (`revisor`, `revisor_alterno` y `revisor_respaldo` en `carriles.json`, en ese orden; si uno no tiene cupo, revisa el siguiente), solo con lectura, juzga
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
`carril:marca`, `carril:comunidad`, `carril:video`, `carril:investigacion`. Los de la recomendada por silencio
(`ok-por-silencio`, `salio-por-silencio`, `frenada`) hay que crearlos una vez: comandos en la sección «Opciones y la
recomendada por silencio». Carril nuevo = entrada en
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
cada 3 h de 8 a 23 con la PC prendida). Primero trae `main`; si el pull falla, esa pasada no corre y el motivo queda
en `pasadas.log`:

```powershell
schtasks /Create /F /TN "ONIA Orquesta" /SC DAILY /ST 08:00 /RI 180 /DU 15:00 /TR "cmd /c cd /d C:\dev\proyectos\onia-hermes && (git pull --ff-only -q origin main && set ORQUESTA_TELEGRAM=1&& node scripts\orquesta\orquesta.mjs --donde pc) >> %USERPROFILE%\.onia-orquesta\pasadas.log 2>&1"
```

`=1&&` va pegado a propósito: con un espacio antes de `&&`, cmd guarda «1 » (medido) y `orquesta.mjs`, que pide
`=== '1'`, no manda el resumen a Telegram.

**La tarea instalada hoy hay que reinstalarla** (medido el 26-oct con `schtasks /Query /TN "ONIA Orquesta" /V /FO LIST`).
Corre `… && git pull --ff-only -q origin main & set ORQUESTA_TELEGRAM=1 && node …`: con `&`, si el pull falla (el
checkout principal con cambios sin commitear) la orquesta corre igual sobre código viejo y el error no llega al log;
y el espacio antes de `&&` la deja sin Telegram. La reinstala Sergio Urcullo pegando el comando de arriba en una
PowerShell (`/F` reemplaza la tarea existente).

La nube corre sola: al etiquetar o comentar un issue de la orquesta y cada 3 h de 8 a 23 (La Paz).
Necesita el secreto `CLAUDE_CODE_OAUTH_TOKEN` (lo crea Sergio Urcullo con `claude setup-token`).

`ORQUESTA_TELEGRAM=1` manda el resumen de la pasada al resumen diario de Hermes (aduana, sin interrumpir).

## Cómo carga Hermes de la PC (26-oct)

El Hermes Agent de la PC carga tareas **solo** con `scripts/orquesta/cargar-issue.mjs`; `gh issue create*` está
bloqueado en su config. Por qué: un issue `orquesta` sin `necesita-ok` lo toma el workflow al instante (el autor es la
cuenta de Sergio Urcullo, que está en `autores`) y su `check: cmd …` corre con shell y sin sandbox en la PC. Es el
port en Node de `--crear` de `scripts/loops/orquesta-hermes.sh` (el del VPS, que no corre en Windows).

```powershell
node scripts/orquesta/cargar-issue.mjs --archivo pedido.txt --titulo "Comparar precios de Dapta y Lety" --dry   # primero, para mostrárselo
node scripts/orquesta/cargar-issue.mjs --archivo pedido.txt --titulo "Comparar precios de Dapta y Lety"
```

El pedido entra **solo por `--archivo`**, en UTF-8 (con o sin BOM); la entrada estándar no se lee (sale 64). Medido el
26-oct en Windows PowerShell 5.1: `Get-Content pedido.txt | node …` lee el archivo como ANSI y llega «acciÃ³n», y con el
`$OutputEncoding` de fábrica (ASCII) cada tilde llega como «?», que no se puede detectar: la tarea se cargaba
desfigurada con salida 0. Un archivo que no está en UTF-8 trae U+FFFD y se rechaza.

`pedido.txt`: sin `--titulo`, la primera línea es el título (con o sin `titulo:` delante, como el formato del VPS).
Después, la cabecera y el texto:

```
carril: investigacion
nivel: normal
donde: nube
check: urls
salida: hermes-content/docs/orquesta/investigacion/precios.md

Qué hay que hacer.
Hecho cuando: cómo se comprueba.
```

Qué valida, igual que el del VPS: `carril` de `carriles.json`, `nivel` (rapido|normal|profundo) y `donde` (pc|nube)
obligatorios; `check` obligatorio y solo `urls`, `cmd npm run test:<x>`, `cmd npm test` o `cmd node --test <ruta>`,
sin un caracter de shell, sin opciones, sin `..` ni unidad (`C:`); `salida` solo en `hermes-content/docs/` (`docs/` en
plataforma); `base` un nombre de rama; `ok: sergio`; `opciones: si` (con su sección `## Opciones`, abajo); `motor` claude|codex; nada de `modelo:` ni campos desconocidos;
título de una línea y hasta 120 caracteres; texto de hasta 4000 con `Hecho cuando:`; sin caracteres invisibles, de
control ni letras de otros alfabetos; sin HTML ni comentarios `<!-- -->` en título ni texto (un `<` pegado a una
letra, `/`, `!` o `?`), porque GitHub los esconde y el trabajador los lee. Siempre pone `orquesta`, `carril:<x>`,
`origen:hermes` y `necesita-ok` (`necesita-ok: no` se acepta y no cambia nada; con opciones, en el nivel B suma además
`ok-por-silencio`: sección siguiente). Tope: 10 issues `origen:hermes` por
día de La Paz, contados en GitHub (entran las del VPS); si no puede contar, no crea. Rechaza la misma tarea (título,
carril y texto) de las últimas 24 h. Una carga a la vez: contar, crear y confirmar los labels van dentro de un
candado (`%TEMP%\onia-cargar-issue.lock`, creado en exclusiva); con otra carga en curso (candado de menos de 2 min)
sale 75 sin hacer nada, y uno más viejo se toma (la carga que lo tenía murió). Llama a `gh` sin shell, con argumentos
en array y el cuerpo por `--body-file`; si el issue quedara sin `necesita-ok`, lo cierra. `--dry` muestra título,
labels y cuerpo sin llamar a `gh` (no mira el tope ni toma el candado).

Salidas: 0 cargada · 64 uso (sin `--archivo` o el pedido como argumento, por ejemplo) · 65 pedido inválido · 75 tope,
repetida u otra carga en curso · 1 `gh` falló o no se sabe si se cargó (lo dice). Pruebas:
`node --test scripts/orquesta/cargar-issue.test.mjs`.

## Opciones y la recomendada por silencio (27-oct)

Pedido de Sergio Urcullo (27-oct-2026): Hermes le da opciones con una recomendada; si no contesta en **al menos 6
horas**, sale la recomendada, **solo en el nivel B**, y eso se mide para analizarlo. Diseño:
`hermes-content/docs/research/2026-10-26-skills-y-autonomia-hermes.md` §1 y §2. Regla corta: `AGENTS.md` §1.

**Cómo se pide.** En `pedido.txt`, `opciones: si` en la cabecera y en el texto una sección `## Opciones` con 2 o 3
renglones `- A: …`, `- B: …` (letras en orden) y **uno solo** que termine en `(recomendada)`:

```
carril: investigacion
nivel: normal
donde: nube
check: urls
opciones: si

Comparar los planes de Dapta y Lety.

## Opciones
- A: Solo una tabla de precios con enlace. Media hora de cupo.
- B: Tabla más qué incluye cada plan. Una hora de cupo. (recomendada)
- C: Informe completo con casos de uso. Dos horas de cupo.

Hecho cuando: hay una tabla con plan, precio y enlace que abre.
```

Sin la sección bien armada (falta, 1 o 4 renglones, ninguna o dos recomendadas) el pedido es inválido: sale 65.
`opciones: si` no viaja en el issue (la sección sí) y `ok-por-silencio` no es un campo: Hermes no lo pide.

**Nivel B** = todo esto junto, lo calcula el código con los campos del pedido (`esNivelB` en `orquesta.mjs`; no tiene
que ver con `nivel:`, que elige el modelo): `donde: nube`, `check: urls`, **ninguna línea `ok:`** (ni `ok: sergio` ni
`ok: Sergio`) y un carril que no sea `plataforma` ni `video`. Solo en el nivel B y con opciones, `cargar-issue.mjs`
suma `ok-por-silencio` (además de `necesita-ok`) y su mensaje final dice la hora límite en La Paz. Fuera del nivel B no
hay silencio nunca: corre cuando Sergio Urcullo saca `necesita-ok`.

**Qué hace `orquesta.mjs`.** En cada pasada, antes de elegir tareas (`atenderSilencio`, que usa `silencioVencido`), con
cada issue que tiene `necesita-ok` y `ok-por-silencio`. Vuelve a calcular el nivel B y las opciones: una etiqueta
puesta a mano en un issue de la PC (`donde: pc`), con `check: cmd` o sin opciones válidas no sale. Y un issue con
`salio-por-silencio` se vuelve a comprobar como nivel B cada vez que se elige una tarea: si después alguien editó el
cuerpo (`donde: pc`, `check: cmd`, una línea `ok:`), no corre.

| Lo que contestó Sergio Urcullo | Qué pasa |
|---|---|
| Una letra (`b`, `B: más corto`, `a, y agregá el precio`) | Saca `necesita-ok` y `ok-por-silencio`, comenta «Elegiste B» y la opción llega al trabajador y al revisor dentro del pedido |
| `ok`, `dale`, `sí` (solos, o hechos solo de palabras de aprobación: `esOk`) | Es aceptar la recomendada: lo mismo que una letra, con la recomendada, y comenta «Elegiste B (la recomendada)» |
| `no` | Pone `frenada`, saca `ok-por-silencio` y deja `necesita-ok` |
| Nada, y pasaron `silencio_horas` desde la creación | Pone `salio-por-silencio`, saca `necesita-ok` y `ok-por-silencio`, y comenta «Salió la recomendada (Y) por silencio, a las 6 h» |
| Otra cosa (una duda, «ok pero cambiá el título») | Nada: no se sabe qué quiso, no sale por silencio y queda con `necesita-ok` hasta que él lo saque |

- La respuesta tiene que ser de un autor de `autores`: no cuentan el orquestador (firma `<!-- orquesta -->`), un bot ni
  otra cuenta. Si dice varias cosas, vale lo último que fue una letra, «no» u «ok»; un comentario neutro después no lo
  borra. Límite: Hermes y Sergio Urcullo usan la misma cuenta de GitHub, y un comentario de Hermes por esa cuenta pasa
  por suyo (el riesgo de la sección «Lo que carga Hermes»; con una cuenta aparte para Hermes se cierra).
- **La opción queda fijada cuando se decide.** El primer comentario firmado de la orquesta («Elegiste…», «Salió la
  recomendada…») es ese momento. Vale la última letra (u «ok») que escribió antes, o la recomendada si salió por
  silencio. Después solo la cambia un comentario que sea **exactamente** una letra (`a`, `A.`, `b)`), y ese gana sobre
  `salio-por-silencio`; «A la tabla le falta el precio» o «a ver cómo va» no la mueven. Así el trabajador y el revisor
  ven la misma opción en cada reintento.
- Un «no» a lo que ya salió por silencio (la tarea quedó `bloqueada`, o `espera-ok`) la vuelve a frenar: pone
  `necesita-ok` y `frenada` y saca `bloqueada`, en vez de seguir con el «no» como indicación. El informe no la cuenta.
- Un `a` suelto seguido de texto («a ver…») se lee como la opción A **antes** de decidirse.
- `silencio_horas` está en `carriles.json` (hoy 6). El código rechaza menos de 6: con un valor menor `cargar-issue`
  no carga pedidos del nivel B y `orquesta.mjs` no suelta nada por silencio (lo dice en el log).
- La hora límite es un piso, no un reloj: lo suelta la próxima pasada de la nube (8, 11, 14, 17, 20 y 23 en La Paz) o el
  comentario de Sergio Urcullo. Un plazo que vence a las 00:30 sale a las 08:00.
- Nada se publica ni se mergea solo: el PR sigue esperando su OK. `salio-por-silencio` y `frenada` no frenan nada.

**Cómo cambia los labels.** `gh issue edit` no es atómico: cada `--add-label` y `--remove-label` es una mutación aparte,
en paralelo. Si fueran un solo edit y fallara el agregado, se sacarían los frenos y el issue saldría sin la medición.
Por eso van dos edits, en este orden: **primero lo que se agrega** (`salio-por-silencio`; `frenada`), y **solo si salió
bien, lo que se saca** (`necesita-ok`, `ok-por-silencio`). Si falla uno, el issue queda con `necesita-ok` y la próxima
pasada lo reintenta (queda dicho en el log). El comentario va al final: sin los labels no se suelta nada.

**Labels, una sola vez.** Sin `ok-por-silencio`, `cargar-issue` no carga pedidos del nivel B. Sin `salio-por-silencio`, el
primer edit falla y la orquesta no suelta nada por silencio (lo dice en el log). Sin `frenada`, el «no» no alcanza a
marcarla, pero la tarea sigue frenada por `necesita-ok`:

```powershell
gh label create ok-por-silencio -R oninteligenciaartificial/onia-hermes -d "Sale la recomendada si Sergio Urcullo no contesta (nivel B)"
gh label create salio-por-silencio -R oninteligenciaartificial/onia-hermes -d "Salió la recomendada por silencio: es la medición"
gh label create frenada -R oninteligenciaartificial/onia-hermes -d "Sergio Urcullo contestó no a las opciones"
```

**Medición.** `node scripts/orquesta/orquesta.mjs --silencio-informe` solo lee: cuenta los issues con
`salio-por-silencio` y de sus PR (rama `orquesta/<carril>-<n>`) cuántos se mergearon, cuántos se cerraron sin mergear y
cuántos siguen abiertos. No cuenta los que todavía tienen `necesita-ok` (la marca está, pero el freno no se sacó, o un
«no» los volvió a frenar): esos no salieron. Pide `gh`; sin él sale 1 con el motivo. Con `--dry`, una pasada muestra qué soltaría por silencio
(`silencio  #n  accion  letra`) sin escribir.
