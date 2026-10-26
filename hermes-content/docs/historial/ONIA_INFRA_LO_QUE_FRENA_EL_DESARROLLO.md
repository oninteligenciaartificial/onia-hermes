# Infra — lo que frena el desarrollo por loops

> **Doc vivo, sin fecha: se EDITA.** Escrito el 2026-09-06 desde la sesión de producto
> (carril usuarios/pricing → marca → asistente), después de un día entero desplegando a
> mano y chocando cinco veces con la misma infraestructura.
>
> Todo lo de acá está **medido en el VPS y en GitHub hoy**, no recordado. Cada afirmación
> lleva el comando o el archivo del que salió, para que la sesión de infra pueda
> verificarla antes de tocar nada.

---

## 1. Cómo funciona hoy, en una página

### Los loops

`/root/bin/onia-loop.sh <carril>` (543 líneas) corre por cron en el VPS. Cada carril:

- Su **rama propia** (`claude/<algo>`) y su **worktree propio**.
- `claude -p --model <modelo> --effort <e> --max-turns <n>` con `timeout`, usando la
  **suscripción** (`/root/.claude/.credentials.json`), no una API key.
- El modelo se elige por carril: `claude-opus-5` por defecto, `claude-sonnet-5` en los
  menos exigentes.

**Activos hoy — cuatro** (`crontab -l | grep onia-loop.sh`):

| Cron | Carril | Qué hace |
|---|---|---|
| `3 * * * *` | `chatbot-cola` | cola del chatbot |
| `33 * * * *` | `onia-cola` | **el integrador** |
| `48 */2 * * *` | `web-venta` | web de venta |
| `9 1,4,7,…` | `recorrido-cliente` | recorre el producto como cliente |

**Pausados o congelados — nueve.** Y el motivo está escrito en el propio crontab:
`# PAUSADO 2026-09-04 (foco: vender; cuota escasa)` y `# CONGELADO 2026-09-05 (foco v1.0)`.
Son `docs-auditoria`, `investigacion`, `kpis-semanal`, `lucia`, `tendencias`,
`web-factory-dev`, `calidad-generado`, `supervisor`, `contenido-cola`.

### Quién puede tocar `master`

Sólo el integrador. `.githooks/pre-push` es un **cerrojo mecánico**: rechaza cualquier
push a `main`/`master` salvo que `ONIA_LOOP_ID=onia-cola`. Los loops de carril empujan su
rama; `onia-cola` hace fetch + merge + gates + push.

⚠️ Ese hook **no protege mi sesión**: en el checkout de Windows `git config core.hooksPath`
viene vacío, así que el hook no corre. Yo empujo a master directo. No es un bug del hook
—está pensado para los clones del VPS— pero explica por qué hoy hubo dos autores
empujando a la misma rama sin saberlo.

### El corredor se auto-despliega

`onia-loops-sync.sh` (`44 * * * *`) copia el corredor y los prompts **desde `origin/main`**
a `/root/bin`. Tiene dos guardas explícitas contra que `main` DEGRADE lo desplegado: si el
corredor de `main` no conoce un caso que el cron sigue llamando, o si le falta una
capacidad que el desplegado ya tiene, **rechaza el sync y avisa por Telegram**. Nació de un
día perdido mirando cinco pantallas mientras `main` tenía diez.

### Hermes

Vivo, dos procesos: `hermes_cli.main gateway run` y `hermes_cli.main dashboard --port 9119`
(cron cada 10 min lo revive si se cae). **Hermes PRIORIZA, no programa.** El que escribe
código es Claude Code dentro de `onia-loop.sh`.

### El deploy

**No es automático, y no es que falte: está esperando aprobación.** Los loops **encolan
pedidos de deploy** y esperan un `ok` por Telegram. `onia-vigia-aprobaciones.sh` corre cada
30 min y le manda las preguntas a Sergio Urcullo. Del log del integrador de hoy 21:45:

> *«los tres pedidos de deploy siguen esperando un `ok` y no toqué producción»*

### El CI

GitHub Actions, dos workflows sobre push a `main`/`master`:

- **CI** — `check:onia-core`, `lint`, `typecheck`, `test`, **`build`**.
- **Security** — gitleaks.

---

## 2. Lo que me frenó hoy, con la evidencia

### 🔴 2.1 El workflow `Security` está rojo en TODOS los commits

Medido con `gh run list`: cada SHA tiene dos corridas, `CI=success` y `Security=failure`.
Sin excepción, hasta donde mira el historial.

La causa son **dos falsos positivos** de gitleaks:

```
RuleID:  curl-auth-header
File:    app/(dashboard)/settings/api/ApiKeysClient.tsx
Line:    279  y  284
```

Son los ejemplos de `curl -H "Authorization: …"` que esa pantalla le muestra al cliente
para enseñarle a usar la API. No hay ningún secreto.

**Por qué importa más de lo que parece:** este repo YA publicó una clave de verdad (la de
Resend, al commitear un export de n8n). El escáner que tendría que avisar de la próxima
está gritando todos los días por algo que no es — y un canario que suena siempre no suena.

**Pedido:** un `.gitleaksignore` con esos dos fingerprints, o un `allowlist` por regla en
la config de gitleaks. Diez minutos. Después, `Security` en verde tiene significado.

### 🔴 2.2 Nadie mira el CI

`grep -rl "gh run\|actions/runs\|workflow_run" /root/bin/*.sh` → **vacío**. Hay ~20 vigías
en el crontab (embudo, leads, disco, aprobaciones, loops remotos, sin-respuesta…) y
**ninguno mira el CI de GitHub**.

Hoy rompí `master` con un `.ico` guardado en RGB (Next lo exige en RGBA). **El CI lo
atajó** —`5eff7a8 → CI=failure`, así que la red funciona— pero **nadie me avisó**. Me
enteré ~10 minutos después, cuando el build del VPS falló en mis manos. Si en vez de mí
hubiera sido un loop a las 3 de la mañana, `master` quedaba roto hasta que alguien mirara.

**Pedido:** un vigía que lea el estado del último run de `master` y avise por Telegram
cuando pase de verde a rojo, con el nombre del workflow y el commit. Un `gh run list
--branch master --limit 1 --json` y el `onia-tg.sh` que ya existe.

### 🟠 2.3 `master` se mueve debajo de la sesión, sin aviso

Hoy me rechazó el push **tres veces**. Entre las 22:15 de anoche y las 21:37 de hoy, el
integrador metió **28 commits** a `master`. Cada rechazo son un fetch, un rebase, una
re-verificación de que lo que medí sigue valiendo — y en un caso valía menos de lo que
pensaba: los loops tocaron `Sidebar.tsx`, `LayoutShell.tsx` y `QuickActionsFab.tsx`, que
eran **los tres elementos cuya geometría yo estaba midiendo** para arreglar la barra del
asistente.

No pido que dejen de empujar. Pido **saberlo**:

**Pedido:** que el integrador avise por Telegram cuando mergea a `master` (cuántos commits
y qué archivos), o que exponga un archivo/endpoint con `sha` + `timestamp` del último merge
que una sesión pueda consultar antes de empezar a medir algo.

### 🟠 2.4 Dos caminos de deploy que se pisan

Hoy desplegué **cuatro veces** a mano, autorizado por Sergio Urcullo en la sesión. En una de
esas, el swap se llevó **28 commits de los loops** — que era exactamente lo que estaba en
sus tres pedidos de deploy pendientes de `ok`. Publiqué su trabajo sin que su circuito se
enterara, y sus pedidos quedaron pidiendo algo que ya está en producción.

No se rompió nada, pero es coordinación por casualidad.

**Pedido:** que el circuito de aprobaciones **lea el estado real** en vez de su propia cola
— comparar el `BUILD_ID` vivo contra `origin/master` y cerrar solo los pedidos que ya
quedaron satisfechos. Hoy la verdad de qué está publicado vive en
`/opt/onia-platform/runtime-next/.next/BUILD_ID` y nadie la cruza con la cola.

### 🟠 2.5 El guard de "un build a la vez" tiene un falso positivo

`onia-loop.sh` y el runbook usan `pgrep -f "next build"` para no encimar builds — regla que
nació el 2026-08-22, cuando tres builds encimados **tumbaron el VPS entero**.

El problema: el patrón está escrito **literal en la línea de comando** que lo ejecuta, así
que `pgrep` matchea su propio `bash -c`. Hoy me abortó un build con `ABORTO: build vivo`
sin que hubiera ninguno. Verificado con `ps -eo pid,cmd`.

**Arreglo:** el truco del corchete — `pgrep -f "next[ ]build"`. El patrón `next[ ]build`
matchea `next build`, y la línea que lo contiene (con corchetes) no se matchea a sí misma.
Una línea, y el guard vuelve a ser confiable.

### 🟡 2.6 Cada deploy se hace copiando un script con `sed`

El runbook real es: `sed "s/^COMMIT=<viejo>$/COMMIT=<nuevo>/" build-<viejo>.sh >
build-<nuevo>.sh`. Hay **doce** `build-<sha>.sh` en `/opt/onia-platform/`, todos copias del
anterior con una línea cambiada. El swap después es cinco comandos a mano (backup, `cp -a`,
gate de `server.js`, restart, verificar).

Funciona —y sus gates son buenos, hoy me salvaron de publicar un build fallado— pero cada
deploy es una oportunidad de escribir mal un sha.

**Pedido:** `onia-desplegar-platform.sh <sha>` que haga build + los gates que ya existen
(baseline de entorno, `server.js`, `node_modules`, `BUILD_ID`) + backup + swap + smoke, y
salga distinto de cero si algo falla. La lógica ya está escrita y probada: sólo hay que
juntarla y parametrizar el sha.

### 🟡 2.7 No hay dónde correr los tests del producto

El checkout principal de Windows **no tiene `node_modules`**: `npx vitest` se va al caché de
npx y muere. Para correr la suite tuve que pedirle prestado el `node_modules` a un worktree
viejo, y **la primera corrida dio 2 fallos falsos** porque ese worktree estaba detrás de
`master` y no tenía los archivos que el test lee.

**Pedido:** un `npm ci` en el checkout principal, o un worktree `verificacion/` mantenido en
`origin/master` con sus dependencias, cuyo único trabajo sea correr la suite. Hoy el gate
real es el build del VPS, que tarda tres minutos y llega tarde.

### 🟡 2.8 No hay con qué rasterizar un SVG, en ninguna parte

Para cambiar el logo tuve que generar PNGs y un `.ico`. Medido: **sin `sharp`, sin
`playwright`, sin `cairosvg`, sin `rsvg-convert`, sin Inkscape**, ni en el VPS ni en
Windows. Y el `convert` que está en el PATH de Windows es el **conversor FAT→NTFS de
Microsoft**, no ImageMagick — responde `Especificación de unidad no válida`.

Terminé escribiendo un parser de paths SVG y rasterizando con PIL a mano. Salió bien, pero
es 60 líneas de código que no deberían existir.

**Pedido:** `sharp` como devDependency de `onia-platform`, o `librsvg2-bin` en el VPS. Uno
de los dos.

### 🟡 2.9 La cuota de la suscripción es el techo real

Nueve de trece loops están pausados, y el crontab dice por qué: **`cuota escasa`**. No es
una decisión de foco solamente — es que no alcanza.

Esto no lo puede resolver infra sola: es una decisión de gasto de Sergio Urcullo. Pero es
**el único ítem de esta lista que cambia cuántos frentes se pueden atender a la vez**, así
que va acá para que se decida a la vista y no por omisión.

---

## 3. Los pedidos, en orden

| # | Pedido | Costo | Por qué primero |
|---|---|---|---|
| 1 | `.gitleaksignore` para los 2 falsos positivos | 10 min | Devuelve significado al escáner de secretos. Este repo ya filtró una clave real |
| 2 | Vigía de CI → Telegram al pasar a rojo | ~1 h | La red ya existe y funciona; sólo no avisa |
| 3 | `pgrep -f "next[ ]build"` | 1 línea | El guard que protege de tumbar el VPS hoy da falsos abortos |
| 4 | Aviso del integrador al mergear a `master` | ~1 h | Tres rebases hoy, y mediciones invalidadas sin saberlo |
| 5 | `onia-desplegar-platform.sh <sha>` | ~2 h | Junta lógica ya escrita y probada; saca el `sed` del camino |
| 6 | Cerrar pedidos de deploy contra el `BUILD_ID` vivo | ~2 h | Hoy la cola pide algo que ya está publicado |
| 7 | Entorno para correr la suite (npm ci o worktree fijo) | ~30 min | El gate llega tres minutos tarde |
| 8 | `sharp` o `librsvg2-bin` | 15 min | Lo escribí a mano una vez; no dos |
| 9 | Cuota | decisión de Sergio Urcullo | Es el techo de cuántos frentes hay |

---

## 4. Lo que NO hace falta construir

Para que nadie gaste el día en esto:

- **Un deployer automático sin aprobación.** El circuito de aprobación por Telegram existe,
  funciona y es deliberado. Lo que falla es que la cola no se entera de lo que ya se
  publicó (#6), no que falte el deployer.
- **Un CI nuevo.** El que hay corre lint, typecheck, tests y build, y hoy atajó un `master`
  roto. Sólo hay que hacer que avise (#2) y sacarle el ruido (#1).
- **Un sistema de branches nuevo.** Rama por carril + `pre-push` que sólo deja pasar al
  integrador es correcto y ya está. Lo que falta es visibilidad hacia afuera (#4).
- **Reescribir `onia-loops-sync.sh`.** Sus dos guardas contra que `main` degrade el corredor
  están bien pensadas y documentadas con el caso real que las originó.
