# Handoff — carril `claude/git-status-935f47` (plataforma · infra · integración)

> Formato: `hermes-content/docs/handoff/README.md`. Se sobrescribe; es el estado ACTUAL.
> Última escritura: **2026-08-31 ~23:40 La Paz** (03:40 UTC del 1-sep).
>
> ⚠️ Las horas de este archivo van en **La Paz**, no UTC. Sergio corrigió el 31-ago:
> *"arregla tus horas, aqui somos america/la paz"*. El VPS y los logs son UTC-4 respecto de
> lo que él lee, y entre las 20:00 y las 24:00 **cambia el día**.

---

## 1. Objetivo

Que el producto sea **usable por un negocio de verdad**: que lo que está roto se arregle en
la misma vuelta que se encuentra, y que el trabajo llegue a producción.

Sergio, textual: *"TERMINA LAS COSAS PORQUE DEJAS A MEDIAS… SI DECIS QUE UN CLIENTE NO PUEDE
CONECTAR WHATSAPP, ENTONCES HACE QUE SEA POSIBLE"*, y *"SI NO TIENES CREDENCIALES NO TE
QUEDES PENSANDO, DESARROLLA HASTA DONDE PUEDAS"*.

**LISTO =** cada defecto encontrado, cerrado y verificado por un refutador independiente que
corre los gates él mismo y muta la implementación para probar que el test se pone rojo.

**Estado: cumplido en lo cerrado; tres frentes quedan en rama esperando a Sergio.**

## 2. Qué quedó EN PRODUCCIÓN

- **El 404 de los correos de recuperación: arreglado y probado en vivo.** `supabase-auth2` se
  recreó con los cuatro `GOTRUE_MAILER_URLPATHS_*` apuntando a `/supabase/auth/v1/verify`.
  Llegó un correo real (`status=sent (250 2.0.0 Ok)`, evento `user_recovery_requested`), login
  200 en 0,66 s, canario OK. **Rompía la recuperación de contraseña Y la confirmación de correo
  de todo cliente nuevo desde que se abrió el alta el 29-ago.**
- **`main` de `onia-hermes` integrada**: 30 commits de los carriles chatbot y web-factory, que
  llevaban días sin llegar. El último commit de `main` era un `chore: auto-sync`, no un merge.
  Gates verdes (`tsc` 0 · vitest 277 · `npm run lint` 0 errores · `npm test` raíz con 728 del
  bot). Cero marcadores de conflicto.
- **`onia-platform` master**: PR #66 (movimiento del dashboard), #67 (un solo WhatsApp),
  **#68 (pantallas de sistema en marca)** y **#69 (correos de auth en castellano)**.
- **Los seis loops, auditados uno por uno y reconfigurados** (ver §6).

## 3. Qué quedó en rama, esperando a Sergio

| Rama / PR | Qué cierra | Por qué no se mergeó |
|---|---|---|
| [PR #30](https://github.com/oninteligenciaartificial/onia-hermes/pull/30) `fix/lockfile-deploy-center` | El lockfile que tenía rojas dos superficies + el deploy pasa a manual | **Mergearlo podría publicar 77 commits en `onia.com.bo`.** Ver §5. **Es el único que quedó abierto** |
| `design/hero-{ui-viva,resultado,mecanica}` | Tres heroes sin capturas del sistema, ya en su **segunda** versión (pusheadas) | **Sergio elige uno.** Ver §7 |

**Mergeados antes de cerrar:** [#31](https://github.com/oninteligenciaartificial/onia-hermes/pull/31)
(el precio del inventario, tres vueltas de refutación) y
[#32](https://github.com/oninteligenciaartificial/onia-hermes/pull/32) (la auto-cura de los loops).

⚠️ **La laptop se apagó el 31-ago ~23:55 La Paz por pedido de Sergio.** Mientras esté apagada
**los cinco loops no corren**; los 18 crons del VPS sí. Al prender, la auto-cura del §6 rearma
lo que se haya desregistrado — pero **sólo si al menos un loop quedó registrado**. Si al abrir
no aparecen commits de carriles en unas horas, hay que rearmarlos a mano desde
`hermes-content/docs/cola/loops.md`.

## 4. Los defectos que se cerraron, y lo que enseñan

**Las pantallas de sistema salían en el tema equivocado.** `not-found`, `error` y `global-error`
eran las únicas superficies sin `public-light`. No eran "otros colores": eran los mismos tokens
en el tema oscuro. La peor no era la 404 sino **`/book`, la agenda pública**, con el titular casi
invisible sobre fondo blanco.

**Los correos de auth salían en inglés — y las plantillas ni se servían.** El middleware
devolvía **307 al login** para `public/correos-auth/*.html`: el matcher de `proxy.ts` excluye por
extensión y `.html` no estaba. GoTrue se habría traído la landing de login de 45 KB como
"plantilla", con cero `{{ .ConfirmationURL }}`. **El mismo agujero tenía muertos los dos PDF de
`/recursos/`** — los imanes de leads que nadie podía descargar.

**Una guarda que se aprobaba a sí misma.** El test leía el archivo crudo **con los comentarios
adentro**, y el comentario que explicaba el arreglo nombraba `public-light`. Borrando el arreglo
real de tres archivos, la suite seguía en `8 passed`. Es una trampa que puede estar en cualquier
guarda del repo que haga `grep` sobre fuente.

## 5. 🔴 Lo más caro que apareció, y no lo estábamos buscando

**`onia.com.bo` no se publica desde el 22-ago 21:19.**

El workflow publica **dos cosas seguidas**: `center.onia.com.bo` y después el sitio de venta. El
paso de center muere y **el del landing nunca corre**. **77 commits** acumulados, sin que la app
del landing tuviera nada roto: se la llevó puesta el vecino.

Y el primer fallo (24-ago) **ni siquiera fue el lockfile**: el deploy de center **funcionó**
(`DEPLOY_OK`, login 200) y el job murió después, en el paso cosmético `[6/6] maintenance
dry-run`, con `Broken pipe` → exit 255 bajo `set -e`. **Un paso decorativo convirtió un deploy
exitoso en un run rojo, y ese rojo tapó el sitio de venta nueve días.**

- `center.onia.com.bo` está **bajado a propósito desde el 29-ago 12:53** — firmado en el VPS:
  `onia-manual-routes.yaml.bak-bajar-center-20260829165348`. La palabra de Sergio y la medición
  coinciden.
- ⚠️ **El contenedor `onia-center` NO se apaga**: el auditor diario lo usa como runtime
  (`docker exec onia-center node`). Bajar el deploy y bajar el servicio son cosas distintas.
- El mismo lockfile tenía roja la producción de **Vercel `nuvia-store`**.
- 🔴 **`tsconfig.packages.json` es `include: ["packages/**/*.ts"]` — cero código de app.** Las 5
  apps tienen script `typecheck` y **4 no las llama ningún gate, incluida `onia-platform`, que es
  la que sirve `onia.com.bo`**. Decir "`main` compila" no dice nada sobre el sitio de venta.

## 6. Los loops: qué se hizo y por qué

Se auditaron los seis, uno por uno, **abriendo sus commits** en vez de contarlos.

**Se apagaron dos:** `web-factory-salud` (7 de 8 corridas fueron no-ops y cero rastro en el repo
en 48 h; sus 4 chequeos los absorbió el dev-loop, que corre 3× más seguido) y
`cerrar-y-revisar-web-factory` (corrió una vez, no tocó el repo, competía por el mismo plato con
un hermano 288× más rápido). Sus `SKILL.md` quedan en disco.

**Se corrigió el agujero que tenían cinco de los seis:** el prompt cubría "tomá el primer ítem"
y "si la cola se vacía", y el estado real no era ninguno — **"Ahora" agotado con la cola llena**.
Dos colas tenían 6 y 5 ítems en "Después" que el prompt no autorizaba a bajar a buscar. Por eso
`chatbot-cola` escribió **once párrafos** que dicen "sigue igual".

**Se sumó `canario-visual`**, y su oficio no es vigilar: **es alimentar**. El sistema tenía seis
consumidores de cola y **cero productores** — el refill estaba documentado como "lo hace el cron
de 10 minutos" y **ese cron no existe**.

**Se arregló el escalonado, que era ficción**: el `jitter` va de 70 a 517 segundos y se comía la
separación de 2 minutos; los cuatro loops de 20 min **colapsaban en dos pares en el mismo
minuto**. Ahora: `:03 · :17 · :31 · :41 · :45`.

**Auto-cura:** cada loop compara al arrancar contra `hermes-content/docs/cola/loops.md` y
**re-registra el que falte**. Es redundante a propósito: mientras quede **uno** vivo, el conjunto
se recompone solo.

### 2026-09-02 — la mudanza se completó, y lo que apareció al hacerla

Pedido de Sergio: *"arma tu loop y termina de desarrollar, acomoda tus loops y documentos para
que termines, **trabaja desde el vps**, sin eso no podemos avanzar"*.

Ahora corren **cinco loops en el VPS** (`crontab -l` en `187.77.16.63`) y **uno solo en Windows**
(`contenido-cola`, que Sergio maneja en su propia sesión y nadie toca).

**Lo que más dolía: `onia-cola` seguía en Windows.** Es el **único** loop que mergea ramas de
carril a `main`, y las tareas de Windows sólo disparan cuando la app está quieta — así que
llevaba días sin correr. `claude/chatbots-platform-review-0d1d09` acumulaba **7 commits** sin
llegar a `main`, que es lo que alimenta el deploy del VPS y el de Vercel. Peor: `loops.md`
**justificaba** dejarlo ahí ("dos publicadores sobre `main` es el conflicto que `CLAUDE.md`
prohíbe"). El razonamiento estaba mal — lo prohibido es que haya **dos integradores**, no que el
único corra en Linux. **Una regla mal escrita defendió el bloqueo durante días.**

**Se sumó `docs-auditoria`** (`/root/bin/loops/docs-auditoria.md`, rama del carril, cada 4 h): un
foco por vuelta entre *docs falsos · trabajo pisado · ítems fantasma*, siempre verificando en
vivo, y **prohibido inventar hallazgos**. Su combustible no se agota.

**🔴 `web-factory-dev-loop` NO se migró, a propósito.** Su cola está seca: `LOOP_COLA.md` tiene
`CARRIL A` y `CARRIL B` con **cero** ítems sin marcar (27 hechos), y los 2 que quedan están en
*"Bloqueadas (esperan a Sergio)"*, que no es cola. Un loop sin combustible no se planta:
**inventa trabajo**. Para revivirlo hay que **rellenar la cola, no rearmar el cron** — y eso es
decisión de Sergio.

**Dos defectos que sólo aparecieron al mudarse:**

1. **El canario corría un prompt viejo.** El repo tenía la versión de **diez pantallas con
   umbrales medidos** (commit `52e359c1`), ya mergeada a `main`; el VPS ejecutaba la de **cinco**
   y su worktree estaba **100 commits atrás de `main`**, con el script viejo de 4.572 bytes que ni
   siquiera acepta `--self-check`. Arreglado: FF limpio de la rama a `main` + prompt desplegado.
   Verificado: `node scripts/canario_visual.mjs --self-check` → *"ok — 13 casos de umbral + 10
   pantallas con cola existente"*. **Commitear una mejora no la enciende.**
2. **`marca-personal` fallaba cada vuelta por un `upstream` mal puesto.** Apuntaba a `origin/main`
   en vez de a su propia rama, así que `git push` se negaba y el corredor avisaba *"quedaron N
   commits SIN pushear"* — **una alarma falsa**, porque el trabajo ya estaba en el remoto.
   Además **nunca había estado escrito en `loops.md`**: el archivo existía y la lista contra la
   que se compara, no. Un loop fuera de esa tabla **no lo rearma nadie**.

**Cómo se agrega o se saca un loop** quedó escrito al final de
[`cola/loops.md`](../cola/loops.md), y los prompts versionados viven en
[`scripts/loops/prompts/`](../../../scripts/loops/prompts/) — **hay que copiarlos al VPS, o el
que corre queda huérfano**, que es exactamente lo que le pasó al canario.

## 7. Los tres heroes

Sergio pidió que el hero **no lleve capturas literales del sistema**. Se desarmó Lety y el dato
es contundente: **cero `<img>`, cero `<video>`, cero `<canvas>`** — su panel es un dashboard
**inventado** que muestra la plata que gana el cliente. No fotografían su software.

Los tres heroes cumplen (cero píxeles del producto, todo divs y CSS) y los tres sacaron **6/10**.
Y los tres cometieron **la misma mentira**: que el agente avisa, manda o cobra solo.
**No es casualidad — "agentes 24/7" se lee como "envía", y lo que hace es preparar un borrador y
dejarlo en la cola de aprobación.** Si tres diseñadores que intentaban no mentir mintieron igual,
cualquier material futuro lo va a repetir.

### Lo que quedó a mitad al apagar

Las tres piezas **ya tienen su segunda versión commiteada y pusheada** (matan la promesa falsa
del agente y dicen qué es Onia). Lo que NO alcanzó a terminar es la **pasada de los críticos**
que verificaba si llegaron a 10 — se cortó al cerrar la sesión.

**Al retomar:** no hay que rehacer los diseños. Sólo correr la crítica sobre las tres ramas ya
pusheadas, con el criterio duro: *una sola afirmación falsa tapa la nota en 7*, y el 10 exige que
un desconocido en tres segundos sienta que le resuelven algo que le duele **y** entienda qué es
Onia.

## 8. Intentos fallidos — lo que NO hay que repetir

1. **Usar `grep` para CONFIRMAR.** Otra vez. El caso nuevo: se declaró un conflicto de números de
   WhatsApp leyendo **el comentario** que explicaba el número viejo, no el código.
2. **`npm run lint` no existe en `onia-hermes`** — es de `onia-platform`. Escribirlo en el prompt
   de un loop de `onia-hermes` es darle un gate fantasma.
3. **Los gates NO corren desde la raíz de `onia-hermes`**: `npx tsc` cae en un paquete señuelo
   (*"This is not the tsc command you are looking for"*). Corren desde `web-factory/`.
4. **Arreglar el precio donde el cliente lo ve y dejar vivo el doc que manda a cobrarlo.**
   `ONIA_PLAN_DESARROLLO_Y_VENTA.md` tenía abierto *"Gatear lo que el add-on de inventario
   cobra"*, es doc sin fecha (= fuente de verdad) y está referenciado desde `LEEME-PRIMERO.md`.
5. **Sacar una fila de una grilla de 2 columnas** y no mirar la página: quedó la última fila con
   un solo ítem y la línea cortada a mitad de ancho.
6. **El disco llegó al 100%** (2,7 GB) y `git worktree add` empezó a fallar con *No space left*.
   Se liberó a 12 GB borrando `node_modules` y `.next` de worktrees mergeados. **Quedan ~19
   worktrees vivos y un worktree completo pesa 6,4 GB.**

## 9. Qué depende de Sergio

| # | Qué | Por qué no lo puedo hacer yo |
|---|---|---|
| S1 | **Publicar los 77 commits de `onia.com.bo`** (PR #30, después `workflow_dispatch`) | Publicar el sitio de venta sin que lo vea es lo que la regla prohíbe |
| S2 | **Elegir uno de los tres heroes** | Es la cara de la marca |
| S3 | **¿La prueba de 14 días pide tarjeta?** (radar) | Cambia lo que promete la superficie de venta |
| S4 | **Aplicar las 8 `GOTRUE_MAILER_*`** al contenedor | Recrear `supabase-auth2` exige conservar el alias `auth`; el runbook está en el repo |
| S5 | **Credenciales del BCP** | Son del banco |
| S6 | **Contestarle a Máximo (21-ago), Leonardo (23-ago) y Edwin (28-ago)** | Pidieron acceso y siguen sin respuesta |
| S7 | **Borrar el proyecto `dental-gest` de Vercel** | El MCP da 403 y no expone borrado |

## 10. Próximos pasos

1. **Cerrar el precio del inventario** (tercera vuelta) y ver si `main` lo integra.
2. **Los heroes a 10/10** y elegir uno.
3. **Sumar el typecheck de las 5 apps al gate** — hoy el sitio de venta no lo tiene.
4. **Limpiar worktrees**: 19 vivos, el disco al 98%.
5. **Medir qué queda vivo de ONIA Center** antes de tocar sus seis memorias.
