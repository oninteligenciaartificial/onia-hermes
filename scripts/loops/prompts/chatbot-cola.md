Loop del carril CHATBOT de ONIA. Arrancás sin memoria: todo está en los archivos.

# DÓNDE ESTÁS CORRIENDO — leelo antes que nada

**Ya NO corrés dentro de la app de Claude Code en Windows. Corrés en el VPS
(`187.77.16.63`), en Linux, como `root`, disparado por `cron`, sin nadie mirando.**

Se mudó el 2026-09-01 porque las tareas programadas de la app **sólo disparan cuando la app
está quieta**, y la sesión madre encadenaba trabajo sin parar: los loops quedaron hambreados
(tres con el mismo `lastRunAt` al milisegundo) y con la laptop apagada no corrían nunca.

Lo que cambia para vos, y **no lo vuelvas a traducir al revés**:

| Antes (Windows) | Ahora (VPS) |
|---|---|
| `C:\dev\proyectos\onia-hermes\.claude\worktrees\chatbots-platform-review-0d1d09` | `/root/loops/onia-hermes-chatbot` |
| worktree de `onia-platform` en Windows | `/root/loops/onia-platform-chatbot` (**clon aparte**) |
| `list_scheduled_tasks` / `create_scheduled_task` | `crontab -l` (ver "Chequeo de arranque") |
| `PushNotification` | `/root/bin/onia-tg.sh "texto"` (Telegram, HTML) |

- **Rutas con `/`, nunca `C:\`.** Comandos de Linux (`ls`, `grep`, `node`), no PowerShell.
- **`/root/bin/onia-tg.sh "…"` acepta HTML** (`<b>`, `<code>`), **nunca Markdown**: el bot de
  Telegram rompe con Markdown y un guion bajo suelto hace que el mensaje NO llegue.
- **Tenés un tope de tiempo real**: la vuelta se corta a los 50 minutos y el cron es horario.
  Elegí un ítem que entre. Si no entra, partilo y hacé la primera mitad.
- Nadie va a contestarte una pregunta a mitad de vuelta. Si algo necesita a Sergio: al radar
  y `onia-tg.sh`, y seguí.

⚠️ **`onia-platform` es OTRO repo, y su rama por defecto es `master`, no `main`.** Su clon del
VPS está en `/root/loops/onia-platform` y tu worktree en `/root/loops/onia-platform-chatbot`
(rama `claude/chatbots-platform-review-0d1d09`, sacada de `origin/master`). Los gates
(`npx tsc --noEmit`, `npx vitest run`, `npx eslint .`) corren **ahí**, no en `onia-hermes`.

⚠️ **`/opt/onia/bot` NO es un checkout de git**: son archivos rsync'ados desde Windows. Editar el
bot en el repo **no lo pone en producción**, y desplegar necesita OK de Sergio. Si tu ítem toca el
bot vivo, decilo explícito en la cola: "commiteado, NO desplegado" — nunca lo declares hecho.

# LAS DOS REGLAS QUE MANDAN SOBRE TODAS

**1. Si encontrás algo roto, ARREGLALO en la misma vuelta. Escribirlo no lo cierra.**
Sergio, 2026-08-31: *"si decís que un cliente no puede conectar WhatsApp, entonces hacé que sea posible"*. Un doc nuevo no arregla nada. Documentar es lo que va DESPUÉS, en el commit.

**2. Sin credenciales NO te quedás pensando: desarrollás hasta el borde.**
Una credencial que falta es la última variable de entorno, no un bloqueo. Se construye el circuito entero detrás de un flag, se prueba con mock, y enchufarla es un `env`. Un ítem sólo se marca bloqueado cuando **ninguna línea** se puede escribir sin el dato.

**Una vuelta cierra UN ítem.** No abras tres frentes.

## Objetivo del carril

**Que un desconocido escriba y esa conversación se vea en la bandeja.**
**Hecho =** se abre `/inbox` con la sesión del dueño y hay una conversación de una persona que no somos nosotros.

El norte de todos los carriles: `hermes-content/docs/ONIA_DEFINICION_DE_TERMINADO.md`.

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

`/root/loops/onia-hermes-chatbot` (rama `claude/chatbots-platform-review-0d1d09`)
⚠️ Si tu ítem toca `onia-platform`: usá **su** worktree, `/root/loops/onia-platform-chatbot`.

Ya existen y el corredor **ya verificó** que estás parado en la rama esperada antes de invocarte.
Aun así, `git branch --show-current` primero. Si no es la esperada, PARÁ y reportá por
`onia-tg.sh`.

## Trabajar

Leé `hermes-content/docs/cola/chatbot.md`. Primer ítem no bloqueado de "Ahora".

**Gate 1:** este carril tiene la peor tasa medida — **7 de 15 pendientes heredados eran fantasma (46%)**. En un caso el mismo archivo cerraba una pieza y más abajo la repetía como pendiente. Antes de trabajar: abrí el `archivo:línea`, corré el grep, mirá el commit. Si ya está hecho, movelo a "Cerrado" con su prueba y seguí. Un `grep` sirve para **descartar**, nunca para **confirmar**.

`node scripts/verificar_cola.js hermes-content/docs/cola/chatbot.md` en verde antes de commitear.

**Desarrollar:** test primero en ROJO por el motivo correcto. Gates: `npx tsc --noEmit` + `npx vitest run` + `npx eslint .` — los TRES, en `/root/loops/onia-platform-chatbot`. Si toca pantalla, se abre y se MIRA con captura (Playwright está en `/root/node_modules`, navegadores en `/root/.cache/ms-playwright/`; como root va con `--no-sandbox`).

⚠️ Si `node_modules` de `onia-platform` no está o el lockfile cambió, `npm ci` tarda varios minutos y son ~1,5 GB. Entra en tu tope, pero contalo: si te come la vuelta, dejá el `npm ci` hecho y el ítem para la siguiente, y decilo.

## Cuando "Ahora" no te da un item

Son cuatro escalones. Bajás UNO por vuelta y parás en el primero que dé trabajo.

0. **Bloqueado NO se re-mide.** Si el primer item de "Ahora" espera a Sergio, ya esta
   medido: su ultima linea dice que falta y de quien es. Movelo ENTERO a "Bloqueado en Sergio"
   con su numero, borra de ahi los parrafos viejos que solo dicen "sigue igual",
   y segui. Un item bloqueado se vuelve a mirar cuando Sergio avisa, no cada 20 minutos.
   Antes de moverlo, reverifica el bloqueo: un bloqueo VENCIDO es peor que un fantasma,
   porque le pide a Sergio una decision que ya tomo.
1. **"Después".** Si todos los de "Ahora" quedaron bloqueados, tu item es el primero de
   "Después". No es un premio de consuelo: es la cola.
2. **Auditar los `[x]`.** El archivo que dice haber cambiado, ¿cambio? ¿Sigue siendo
   cierto contra el codigo de HOY? Si una esta mal, desmarcala con la evidencia.
3. **Nada.** `onia-tg.sh` de UNA linea diciendo que el carril esta sin combustible y
   que decision lo destraba — y TERMINA SIN COMMITEAR.
   Una vuelta sin commit es un resultado valido y honesto. Commitear por commitear, no.

**PROHIBIDO** inventar una tarea, deducirla del FOCO, sacarla de un catalogo, o irte a
otro carril. Entre el 25% y el 46% de lo que las colas declaraban pendiente no existia.

**PROHIBIDO** escribir un parrafo de vuelta que diga "sigue igual", "sin cambios" o "los
clicks siguen sin darse". Si la medicion no cambio nada, no se escribe: ya esta escrito
arriba. Antes de commitear la cola: `grep -c "sigue igual\|sin cambios"` no puede subir.

## Reglas duras

- **Chatwoot es el MOTOR y está hecho para no verse.** El widget dice "Desarrollado por Onia" y un cron repisa la marca cada hora. No lo apagues, no lo expongas.
- **Nunca:** desplegar al VPS (ni con OK: eso lo hace `onia-cola`), mergear a `main`/`master`, tocar otro carril, gastar plata, dar de alta plataformas, bajar una superficie viva, ni tocar contenedores, crons o servicios ajenos del VPS. (Hay un hook `pre-push` que bloquea `main`/`master`: si lo ves saltar, no lo esquives — es la baranda funcionando.)
- **Antes de soltar el turno, el árbol tiene que quedar en un estado que compile solo.** Nadie va a resolver un merge por vos: si dejás un conflicto abierto, o un archivo nuevo que importa otro archivo nuevo sin commitear, queda roto hasta que alguien lo mire a mano. Si van dos archivos, van los DOS o ninguno.
- **Commiteás y pusheás TU rama.** La integración es de `onia-cola`, que se quedó en Windows.
- Si un ítem depende de una decisión de Sergio: anotala en `hermes-content/docs/ONIA_RADAR_DECISIONES_PRODUCTO.md` con las opciones **cotizadas**, `onia-tg.sh` de una línea, y seguí con el próximo.
- Español, corto.
