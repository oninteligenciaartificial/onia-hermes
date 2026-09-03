# Handoff — carril `supervisor`

Audita a los otros loops: que ninguno cobre por trabajo que no sirve. Rama `claude/supervisor`.
No mergea a `main` (eso es de `onia-cola`) y no arregla carriles ajenos: deja la tarea en el tablero.

**Última vuelta: 2026-09-03 18:29 UTC.**

---

## Objetivo de la vuelta

Auditar a fondo el carril **menos mirado**. **Fallé en elegirlo** —volví a `tendencias`, que el
handoff anterior marcaba como "no re-auditar"— y el hallazgo de la vuelta terminó siendo **el
error de selección en mi propio prompt**, que ya lo había cometido la vuelta anterior.

**Hecho =** decir si el trabajo de un carril sirve o no, con evidencia **medida**, no leída.

## Qué quedó en producción

Nada desplegado — este carril no despliega. Lo que quedó:

- **`scripts/loops/prompts/supervisor.md` corregido** (abajo el porqué). Se enciende solo en la
  próxima vuelta: `onia-loops-sync.sh` copia desde `main` cada hora al minuto 44, así que
  **necesita que `onia-cola` mergee esta rama primero**.
- **`tendencias` confirmado SIRVE**, ahora con 4 de 4 fuentes verificadas en vivo (antes 1).
- **Un ítem fantasma medido** en la cola de `tendencias` (no lo toqué: no es mi zona).

## El hallazgo de la vuelta: mi prompt me mandaba a elegir mal, y ya había fallado igual

`scripts/loops/prompts/supervisor.md:221` decía: *"el que menos se haya auditado; **mirá tus
commits** para saber cuál"*.

**Tus commits miden actividad, no cobertura.** La mitad se llaman `fix(canario)` o
`merge(chatbot)` y hablan del trabajo, no de a quién auditaste. Entrando por ahí se elige **el
carril con más commits** — casi siempre uno ya auditado. Pasó dos vueltas seguidas:

| vuelta | eligió | por qué | lo que decía el handoff |
|---|---|---|---|
| 16:29 | `web-venta` | volumen de commits | *"ya auditado"* — lo confesó: *"fue suerte, no método"* |
| 18:29 | `tendencias` | 19 commits en 24 h | **"No re-auditar `tendencias`"**, tres líneas más arriba |

La lista curada de **ya auditados / nunca auditados** existe y vive en la sección *Próximos
pasos* de este mismo archivo. El prompt **nunca la nombraba**. Corregido: ahora el primer
comando de la vuelta, antes de mirar ninguna rama, es

    sed -n '/## Próximos pasos/,/^---/p' hermes-content/docs/handoff/supervisor.md

**Probado antes de escribirlo en el prompt** (exit 0, devuelve la lista entera).

## `tendencias` SIRVE — y es el único carril cuyo producto puede auditar un tercero

Su receta de gancho de ads (`d3dec5004`) cita **8 anuncios reales con su `Library ID`** de la
Biblioteca de Anuncios de Meta. **Abrí 4, con el chromium que el propio documento nombra:**

| Library ID | Qué declaraba | Qué devolvió el DOM |
|---|---|---|
| `1449643883671583` | Sinergya (BO) · *¿TODAVÍA MANEJAS VENTAS, INVENTARIO…?* | ✅ exacto |
| `2278391992977905` | Skyia (AR) · *Turnos desordenados, historias clínicas sueltas…* | ✅ exacto |
| `984827984515873` | Easysocio · alta 27 may 2026 | ✅ `Started running on May 27, 2026`, `Active` |
| `28387590097593386` | Omnia Salud · 17 dígitos (los demás tienen 16) | ✅ real, resuelve a `Omnia` |

El de Easysocio importa aparte: sostiene la **única** afirmación cercana a rendimiento del
documento (*"más de tres meses de gasto continuo"*), y el documento ya la marca como **inferencia,
no métrica**. La ruta de reproducción (`chromium-1234`) **existe y corre**; no era un placeholder.

**Lo que NO verifiqué, y no lo voy a escribir como verificado:** el agregado *"16 de 30 anuncios
abren nombrando la herramienta vieja"*. Comprobé los átomos auditables (los `Library ID`), no el
recuento — habría que rehacer las 4 búsquedas enteras.

## Ítem fantasma en la cola de `tendencias` — anotado, NO tocado

`hermes-content/docs/cola/tendencias.md`, sección *"Visto fuera de mi zona"*, afirma:

> *"Hay 5 loops en `crontab -l` del VPS que NO figuran en la tabla de `docs/cola/loops.md`:
> `tendencias`, `recorrido-cliente`, `web-factory-dev`, `calidad-generado` y `supervisor`."*

**Falso hoy.** Los 5 están en la tabla y en el cron — medido en el chequeo de arranque de esta
misma vuelta, y de nuevo uno por uno:

    for l in tendencias recorrido-cliente web-factory-dev calidad-generado supervisor; do
      grep -c "^| \`$l\`" hermes-content/docs/cola/loops.md; done   # → 1,2,2,2,2 (nunca 0)

Era cierto cuando se escribió y lo cerró `docs-auditoria` después. **Es zona de `tendencias`: no
edité su archivo.** Cuesta poco (es una nota al pie, no un `[x]` falso), pero es el ítem que su
próxima vuelta debería borrar en 30 segundos.

## Archivos

- `scripts/loops/prompts/supervisor.md` — regla de selección de carril (línea 219+)
- `hermes-content/docs/handoff/supervisor.md` (este)

## Intentos fallidos — lo que NO era

1. **"El integrador está ciego a `tendencias`."** **Refutado midiendo**, y era la hipótesis
   atractiva: su receta lleva 6 h 30 sin llegar a `main`. Pero `origin/claude/tendencias` en el
   clon del integrador apunta a `d3dec5004` (ref **fresco**, igual que `ls-remote`), la rama
   **sí aparece** en su enumeración `--no-merged`, y el merge da **0 conflictos**. El integrador
   corrió 6 veces en esas horas, todas `exit 0`, mergeando otros carriles de a ~2 por vuelta con
   los gates completos. **No es un fallo: es cola.** Reportarlo como bug habría mandado a alguien
   a arreglar algo sano — el modo de falla que este carril existe para no cometer.
2. **"El archivo de la receta no existe."** Casi lo reporto en los primeros 2 minutos: `ls` daba
   *No such file or directory*. Es **mi worktree con `sparse-checkout`** (`supervisor` no está en
   la lista `NO_TOCAR` de `onia-aligerar-worktrees.sh`, y esa lista excluye
   `/hermes-content/references`). El contenido está en el objeto git y se lee con
   `git show <rama>:<ruta>`. **Un `ls` desde este worktree no prueba que un archivo no exista.**
3. **"El `chromium-1234` del comando documentado es un placeholder."** No: es un build real
   instalado (`chromium-1223` y `chromium-1234` conviven en `/root/.cache/ms-playwright/`).

## Qué depende de Sergio

**Nada nuevo.** No abrí tarea ni anoté en el radar: lo único vivo sigue siendo `t_68671bc3`
(publicar `onia.com.bo`), ya preguntada desde las 03:50 y con el precio corregido la vuelta
pasada. Repetirle una decisión ya hecha es peor que no preguntar.

## Próximos pasos

1. **Auditar `docs-auditoria`. Es el próximo, y no se negocia por volumen de commits.** Es el
   más valioso de los nunca mirados: su trabajo es el más parecido al mío (que lo escrito sea
   cierto), así que si produce basura, la produce **sobre la verdad del repo**.
   **Ya auditados:** `web-venta`, `chatbot`, `lucia`, `onia-cola`, `recorrido-cliente`,
   `calidad-generado`, `tendencias`.
   **Nunca auditados:** `docs-auditoria`, `web-factory-dev`, `marca-personal`, `canario-visual`,
   `investigacion`.
2. **No re-auditar `web-venta` ni `tendencias`.** Para `web-venta`, listo =
   `curl -s -o /dev/null -w '%{http_code}\n' https://onia.com.bo/favicon.ico` devuelve `200`.
   Mientras dé 404, todo lo que commitee ese carril sigue sin llegar al cliente.
3. **Observación sin daño probado, para no perderla:** la enumeración `--no-merged` del
   integrador devuelve **34 ramas y sólo 11 están vivas** (commit de hoy); las otras **23 llevan
   muertas desde julio/mediados de agosto** y arrastran 129 commits viejos. No probé que eso le
   cueste nada — el integrador acierta el carril igual. **No abrir tarea hasta poder demostrar
   el daño**, o se manda a alguien a limpiar por estética.
4. Sigue abierto de tres handoffs atrás: la rama de `kpis-semanal`
   (`claude/marca-personal-loop`) no figura en `loops.md`. Listo = saber si debe estar.
5. Ninguna tarea `ready` del tablero era de esta zona: `t_8baa5891` y `t_13eaa0ae` son pruebas,
   `t_ad2df41f` está reclamada por `carril-tendencias`. No se reclamaron a propósito.

---

## Chequeo de arranque — 2026-09-03 18:29 UTC

**Los 15 loops de `loops.md` tienen línea en `crontab -l`, y los 15 corrieron.** Verificado en
los dos pasos: registro (`crontab -l`) **y** ejecución (última línea `ARRANCA` de
`/var/log/onia-loop-<id>.log`). Comparadas **las dos direcciones** —cron→tabla y tabla→cron—
con `comm`: **cero diferencias**. Ninguno quedó atrás de su cadencia. Nada que rearmar.
