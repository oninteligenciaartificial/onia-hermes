# Handoff — carril `supervisor`

Audita a los otros loops: que ninguno cobre por trabajo que no sirve. Rama `claude/supervisor`.
No mergea a `main` (eso es de `onia-cola`) y no arregla carriles ajenos: deja la tarea en el tablero.

**Última vuelta: 2026-09-03 20:29 UTC.**

---

## Objetivo de la vuelta

Auditar a fondo el carril **menos mirado**. Esta vez **el handoff sí eligió**: entré por
*"Próximos pasos"* (la corrección de prompt de la vuelta anterior funcionó) y me tocó
**`docs-auditoria`** — nunca auditado, y el más parecido a mí: su trabajo es que lo escrito sea
cierto.

**Hecho =** decir si el trabajo de un carril sirve o no, con evidencia **medida**, no leída.

## Veredicto: `docs-auditoria` SIRVE — pero hace 7 h no puede entregar nada

Las dos mitades importan y son independientes:

**Su trabajo es bueno.** Spot-check de su commit `68540a6cb`: afirmaba que
`ONIA_CATALOGO_DE_VENTA.md` decía *"se venden 3"* rubros y son **5**. Verificado contra el
producto, no contra su prosa:

    git -C /root/loops/onia-platform show origin/master:lib/platform/rubros-activos.ts | grep -cE "^\s+\{"   # → 5

Cita las tres fuentes (`rubros-activos.ts` = 5, `SUPPORTED_VERTICAL_TRACK_IDS` = 7,
`contract.json` = 11 tracks) y explica **por qué importaba**: el barrido del 30-ago arregló la
prosa y la tabla y se olvidó de la línea de resumen, que es la que se lee cuando se busca el
número — le sacaba dos rubros a la venta. Es exactamente su definición de hecho, y la última
vuelta (17:24) además **retiró un bloqueo vencido** y **corrigió una evidencia muerta** en el
tablero, dejando bloqueado lo que no era su decisión. Nada de las seis señales de basura.

**Y no llega a nadie.** `git push` de `claude/docs-auditoria` viene **rechazado por
non-fast-forward** desde la vuelta de las 13:24 UTC:

    cd /root/loops/onia-hermes-docs && git push --dry-run origin claude/docs-auditoria
    # ! [rejected]  claude/docs-auditoria -> claude/docs-auditoria (non-fast-forward)

La rama remota **se reescribió debajo suyo**: `origin/…` (`68540a6cb`) no es ancestro del HEAD
local (`6c81192b4`), y la prueba de la reescritura es que el commit local `6716983f5` y el remoto
`68540a6cb` tienen **contenido idéntico y sha distinto** (`diff` de los dos `show` → vacío).
Divergencia: `git rev-list --left-right --count origin/claude/docs-auditoria...HEAD` → `1 34`.

**Se perdió 1 commit, no 34.** `6c81192b4` (34 líneas en
`hermes-content/references/modelos/lucia/BITACORA-PERFECCION.md`) **no existe en ninguna rama
publicada** — buscado con `git grep` del texto del arreglo sobre las 40 refs de `origin`: cero.
Los otros 33 ya están publicados por otras ramas (32) o son el duplicado de contenido (1).

**Barrido a los 17 worktrees del VPS: `docs-auditoria` es el único atrapado.** (`onia-hermes`
está 12 detrás de `main`, que es fast-forward, no divergencia.)

## La alerta grita 34 cuando el daño es 1

`/root/bin/onia-loop.sh:371` cuenta con `git log @{u}..HEAD`, que **incluye todo lo ya publicado
por otras ramas**. El número honesto es `git log HEAD --not --remotes=origin`:

| lo que cuenta | resultado |
|---|---|
| `@{u}..HEAD` — lo que grita el aviso | **34** |
| `HEAD --not --remotes=origin` — huérfanos reales | **2** |
| trabajo genuino perdido (el otro es duplicado) | **1** |

Es el modo de falla del vigía que ya nos costó caro: **un aviso inflado 34× se deja de leer**, y
éste va a repetirse cada 4 h para siempre porque la divergencia no se cura sola.
**No toqué el corredor**: la maquinaria de loops está congelada 7 días por decisión del 2026-09-03
16:23, y esto no es un loop muerto sino uno mudo. Queda escrito en la tarea.

## Qué quedó en producción

Nada desplegado — este carril no despliega.

- **`t_655483f6`** (prioridad 1, `ready`) para el integrador: la divergencia, el commit exacto
  que se perdió, y la recuperación **ya probada limpia** — la base del commit y la de `origin`
  son el mismo archivo de 582 líneas (`cmp -s`), así que el cherry-pick aplica sin conflicto.
- Aviso a Sergio por Telegram, una línea, en castellano llano.

## Archivos

- `hermes-content/docs/handoff/supervisor.md` (este)
- Tarea `t_655483f6` en el tablero (no es archivo del repo)

## Intentos fallidos — lo que NO era

1. **"El corredor sale exit 0 y por eso nadie se entera."** **Refutado.** Era la hipótesis
   atractiva —calca el caso `lucia-ugc.sh` de la memoria compartida— y es **falsa acá**:
   `onia-loop.sh:385` sí llama a `avisar` cuando `SINPUSH != 0`, y el aviso salió las dos veces.
   El defecto real no es el silencio sino **el número**. Reportarlo como "falla muda" habría
   mandado a alguien a arreglar un mecanismo que funciona.
2. **"Se perdieron 34 commits."** Lo que dice el log del corredor, y es el número que casi
   escribo. 32 ya estaban publicados por otras ramas y 1 es duplicado de contenido.
3. **"`docs-auditoria` está seco o inventa."** No: sus dos últimas vueltas produjeron un arreglo
   real sobre una fuente de verdad y una limpieza de evidencia vencida en el tablero, y la del
   17:24 **reportó honestamente "sin commit"** y confesó que su `merge --ff-only` había fallado.
   Una vuelta sin commit por rama trabada es honestidad, no basura.

## Qué depende de Sergio

**Nada nuevo.** `t_655483f6` es una decisión técnica, y por la regla del 2026-09-03 ésas las toma
la sesión de control y quedan escritas en la tarea: a Sergio sólo se le piden plata, marca y
contactar personas. Por eso quedó `ready`, **no** `needs_input`.

## Próximos pasos

1. **Auditar `web-factory-dev`.** Es el próximo de los nunca mirados.
   **Ya auditados:** `web-venta`, `chatbot`, `lucia`, `onia-cola`, `recorrido-cliente`,
   `calidad-generado`, `tendencias`, `docs-auditoria`.
   **Nunca auditados:** `web-factory-dev`, `marca-personal`, `canario-visual`, `investigacion`.
2. **Verificar que `t_655483f6` se ejecutó.** Listo =
   `git -C /root/loops/onia-hermes-docs log --oneline HEAD --not --remotes=origin` devuelve
   **vacío**. Mientras devuelva algo, ese carril sigue trabajando para nadie.
3. **`loops.md` quedó atrás del `crontab` en 5 loops** (`canario-visual`, `docs-auditoria`,
   `investigacion`, `marca-personal`, `supervisor`): las cadencias se bajaron el 2026-09-03 16:23
   y la tabla versionada sigue con las viejas. **No lo toqué** —es zona de `docs-auditoria`, y
   justo ese carril no puede pushear— pero tiene un filo: el chequeo de arranque de los 15
   prompts manda a *"volver a poner la línea exactamente como dice la columna `cron`"*, así que
   un loop podría **restaurar la cadencia alta que Sergio bajó a propósito**. No probé que haya
   pasado; medirlo antes de abrir tarea.
4. Sigue abierto de cuatro handoffs atrás: la rama de `kpis-semanal`
   (`claude/marca-personal-loop`) no figura en `loops.md`. Listo = saber si debe estar.
5. **Observación sin daño probado** (de la vuelta anterior, no re-medida): la enumeración
   `--no-merged` del integrador devuelve 34 ramas y sólo 11 están vivas. No abrir tarea hasta
   poder demostrar el daño.

---
