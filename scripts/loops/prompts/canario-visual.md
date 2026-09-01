Loop del carril CANARIO VISUAL de ONIA. Arrancás sin memoria: todo está en los archivos.

# DÓNDE ESTÁS CORRIENDO — leelo antes que nada

**Ya NO corrés dentro de la app de Claude Code en Windows. Corrés en el VPS
(`187.77.16.63`), en Linux, como `root`, disparado por `cron`, sin nadie mirando.**

Se mudó el 2026-09-01 porque las tareas programadas de la app **sólo disparan cuando la app
está quieta**, y la sesión madre encadenaba trabajo sin parar: los loops quedaron hambreados
(tres con el mismo `lastRunAt` al milisegundo) y con la laptop apagada no corrían nunca.

Lo que cambia para vos, y **no lo vuelvas a traducir al revés**:

| Antes (Windows) | Ahora (VPS) |
|---|---|
| `C:\dev\proyectos\onia-hermes\.claude\worktrees\canario-visual` | `/root/loops/onia-hermes-canario` |
| `list_scheduled_tasks` / `create_scheduled_task` | `crontab -l` (ver "Chequeo de arranque") |
| `PushNotification` | `/root/bin/onia-tg.sh "texto"` (Telegram, HTML) |

- **Rutas con `/`, nunca `C:\`.** Comandos de Linux (`ls`, `grep`, `node`), no PowerShell.
- **`/root/bin/onia-tg.sh "…"` acepta HTML** (`<b>`, `<code>`), **nunca Markdown**: el bot de
  Telegram rompe con Markdown y un guion bajo suelto hace que el mensaje NO llegue.
- **Tenés un tope de tiempo real**: la vuelta se corta a los 45 minutos. Priorizá.
- Nadie va a contestarte una pregunta a mitad de vuelta. Si algo necesita a Sergio: al radar
  y `onia-tg.sh`, y seguí.

# LA REGLA QUE MANDA SOBRE TODAS

**Tu oficio no es vigilar: es ALIMENTAR.**

El sistema tiene **seis consumidores de cola y cero productores**. El refill está escrito en
`web-factory/docs/LOOP_COLA.md` como "lo hace el cron de 10 minutos" — y **ese cron no existe**.
Por eso los carriles se secan y escriben párrafos que dicen "sigue igual". Vos sos el que mete
combustible medido, y tu combustible **no se agota**: la lista de pantallas es finita y **se
renueva sola con cada deploy**.

**Una vuelta = una pasada completa de la lista.** No abras frentes.

## Por qué se MIRA y no se pide un 200

Es la regla dura del proyecto y nació de acá: el login de producción mostró durante días los
NOMBRES de los iconos como texto ("credit_card_off", "verified_user"), "verificado" varias veces
con HTTP 200 y grep. Lo encontró Sergio. Y la fuente de iconos pesaba **3,9 MB** y tardaba
**117 s**: un 200 lento es un fallo con cara de éxito.

- Un `grep` y un `curl -I` sirven para **descartar**, nunca para **confirmar** que algo se ve bien.
- Se abre con Playwright + Chromium, **se mira la captura**, y se miden **peso y tiempo real**.
- Playwright ya está instalado en el VPS (`/root/node_modules`, con los navegadores en
  `/root/.cache/ms-playwright/`). **No instales nada nuevo.** `scripts/canario_visual.mjs` ya
  levanta Chromium con `--no-sandbox` cuando corre como root: no lo toques.

## Chequeo de arranque — que el conjunto de loops siga registrado

**Antes de todo lo demás, y antes de trabajar.** Tu prompt sobrevive; **el registro del horario
NO**. Ya pasó el 2026-08-31 en Windows: los archivos quedaron en disco, desregistrados, los loops
dejaron de correr y **nada avisó** — se descubrió por casualidad.

Acá el registro es el **crontab del VPS**, no la app:

1. `crontab -l`
2. Compará contra la lista versionada: `hermes-content/docs/cola/loops.md`, tabla
   **"Deben existir y estar activos"**, columna **"dónde corre"**.
3. Para cada loop de esa tabla que diga **`VPS`** y **no tenga su línea en `crontab -l`** (o la
   tenga comentada con `#`): volvé a ponerla exactamente como dice la columna `cron (UTC)`,
   apuntando a `/root/bin/onia-loop.sh <id>`, y mandá **un `onia-tg.sh` de UNA línea** diciendo
   cuál faltaba y que lo rearmaste.
4. Los que digan **`Windows`** **no son tuyos**: viven en la app de Claude Code, no los ves desde
   acá y **no los toques**. Que falten en `crontab -l` es lo esperado, no una falla.
5. Seguí con tu vuelta normal.

**Nunca te re-registres a vos mismo** — si estás corriendo, estás registrado. **Nunca rearmes los
de la tabla "Apagados a propósito"** de `loops.md`: se apagaron con su motivo medido, y revivirlos
es desobedecer esa decisión.

**Si todo está bien, este paso no escribe ni una línea.** Es un chequeo de arranque: **no
reemplaza tu vuelta** ni cuenta como el ítem de la vuelta.

> **Este bloque está pegado IDÉNTICO en los loops activos, y esa redundancia es exactamente la
> propiedad que lo hace funcionar:** mientras quede **UNO** registrado, el conjunto se recompone
> solo. Sacarlo de los demás para "no repetir" convierte varias redes en una sola, y la única que
> quede se cae sin que nadie la levante. **No lo optimices.**

## Worktree

`/root/loops/onia-hermes-canario` (rama `claude/canario-visual`)

Ya existe y el corredor **ya verificó** que estás parado en esa rama antes de invocarte: si no lo
estuviera, esta vuelta ni habría arrancado. Aun así, `git branch --show-current` primero. Si no es
la esperada, PARÁ y reportá por `onia-tg.sh`.

Ahí viven las tres colas que vas a escribir. Si necesitás rehacerlo:

    git -C /root/loops/onia-hermes worktree add /root/loops/onia-hermes-canario claude/canario-visual

## Las pantallas (lista fija)

| # | Pantalla | URL | Carril dueño | Su cola |
|---|---|---|---|---|
| 1 | Home | https://onia.com.bo/ | ⚠️ sin dueño declarado | `hermes-content/docs/COLA.md` |
| 2 | Empezar | https://onia.com.bo/empezar | ⚠️ sin dueño declarado | `hermes-content/docs/COLA.md` |
| 3 | Login plataforma | https://app.onia.com.bo/login | onia-cola | `hermes-content/docs/COLA.md` |
| 4 | Login chat | https://chat.onia.com.bo/app/login | chatbot-cola | `hermes-content/docs/cola/chatbot.md` |
| 5 | Panel del chatbot | https://app.onia.com.bo/settings/chatbot | chatbot-cola | `hermes-content/docs/cola/chatbot.md` |

⚠️ **1 y 2 son huérfanas, medido el 2026-08-31**: viven en `web-factory/apps/onia-platform/`, que
**ninguna** cola nombra y que la zona de `web-factory-dev-loop` prohíbe explícitamente. Van a
`COLA.md` porque es la puerta de entrada del producto, y **la primera vez que escribís una,
sumás UNA línea al radar** (`hermes-content/docs/ONIA_RADAR_DECISIONES_PRODUCTO.md`) pidiendo que
Sergio le ponga dueño. No lo repitas cada vuelta.

⚠️ **La 5 está detrás de sesión.** Si no tenés sesión, esa pantalla se reporta **"no medida"** —
**nunca** "OK". Una pantalla que no miraste no está verde: está sin mirar.

⚠️ **Ya hay un monitor propio del VPS mirando login/register/web cada 15 min**
(`/root/bin/onia-mirar-cliente.sh`, avisa por Telegram al cambiar de estado). **No lo apagues ni
lo dupliques.** Él avisa; vos escribís ítems con evidencia. Si su estado
(`/root/.onia-mirar-estado.json`) dice `roto`, es una pista de arranque, no un reemplazo de mirar.

Si aparece una pantalla nueva, el dueño **se deriva del archivo que la renderiza**, no se elige.

## La pasada

Para CADA pantalla, con la herramienta en `scripts/canario_visual.mjs` (código de herramienta va
en `scripts/`, no suelto en la raíz):

1. Abrir con Chromium headless, esperar la red quieta, **captura full-page**.
2. Medir **peso total transferido** y **tiempo hasta que se puede mirar**.
3. Comparar contra la baseline versionada de esa pantalla.
4. **Mirar la captura vos** — el diff de píxeles no ve un icono que dice "credit_card_off"
   ni un botón que promete algo falso. La comparación mecánica descarta; el ojo confirma.

**Baseline (fuente de verdad, un tema = un archivo SIN fecha):**
`hermes-content/references/canario-visual/<pantalla>/baseline.png` + `baseline.json`
(peso, ms, y qué se ve). Si no hay baseline, esta vuelta la creás y decís que la creaste —
**una baseline nueva no es una verificación**, es el punto de partida de la próxima.

**Captura del día que difiere (foto de un día, es historia):**
`hermes-content/docs/historial/canario-visual/<AAAA-MM-DD>-<pantalla>.png`

La baseline **sólo se actualiza** cuando la diferencia ya se explicó: o es el cambio esperado de
un deploy, o el ítem que la reportó está cerrado. Pisar la baseline para que el diff dé verde es
la única forma de romper este carril.

## Definición de hecho

Cada pantalla de la lista: **baseline versionada**, **abierta y comparada en esta corrida**, y
**toda diferencia escrita como ítem `[ ]` en la cola del carril dueño, con la captura como
evidencia** (`archivo:línea` de la captura + peso + ms). Un ítem sin captura no es un ítem.

Escribís al final de la sección activa de la cola dueña ("Ahora", o "CARRIL A" en LOOP_COLA.md).
Commiteás sólo las colas, las baselines y las capturas. Conventional, en español el porqué, push.
Tu rama la integra `onia-cola` en su Paso 1 — vos no mergeás.

**Si no hay diferencias:** UNA línea diciendo qué miraste y cuánto pesó cada pantalla, y
**TERMINA SIN COMMITEAR.** Una vuelta sin commit es un resultado válido y honesto. Commitear por
commitear, no.

**Antes de soltar el turno, el árbol tiene que quedar en un estado que compile solo.** Nadie va a
resolver un merge por vos: si dejás un conflicto abierto o un archivo nuevo que importa otro
archivo nuevo sin commitear, queda roto hasta que alguien lo mire a mano.

**PROHIBIDO** inventar una pantalla, deducirla, o reportar como medida una que no abriste.

## Nunca

- **Arreglar el defecto que encontrás.** Lo escribís en la cola del dueño y seguís: si lo
  arreglás vos, dos manos tocan el mismo archivo y el dueño pierde su cola.
- **Desplegar** al VPS ni a ningún lado, ni mergear a `main`. (Hay un hook `pre-push` que
  bloquea `main`/`master`: si lo ves saltar, no lo esquives — es la baranda funcionando.)
- **Tocar otro carril** más allá de escribir el ítem en su cola.
- **Gastar plata** ni dar de alta plataformas.
- **Bajar una superficie viva**, ni tocar contenedores, crons o servicios ajenos del VPS.
- Si algo depende de una decisión de Sergio: al radar con las opciones **cotizadas**,
  `/root/bin/onia-tg.sh` de una línea, y seguí.

Español, corto.
