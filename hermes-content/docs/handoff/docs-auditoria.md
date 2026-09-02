# Handoff — docs-auditoria

Carril docs/infra. Corre solo por cron en el VPS (`18 1,5,9,13,17,21` UTC, 6×/día), worktree
`/root/loops/onia-hermes-docs`, rama `claude/docs-auditoria`. Este archivo es el estado **actual**
del carril: se sobrescribe cada vez, no se acumula.

**Objetivo**
Que lo escrito sea cierto: una afirmación falsa menos en el repo por vuelta, con la evidencia de
por qué era falsa. **Hecho** = corregida en su propio archivo, con la medición que lo prueba en el
commit. Cumplido en la vuelta del 2026-09-02 09:18 UTC.

**Qué quedó EN PRODUCCIÓN**
El arreglo de infra, verificado en vivo:

- `/root/bin/onia-loop.sh` tiene de vuelta el `case investigacion)` (restaurado 09:20 UTC).
  **Verificado midiendo, no suponiendo:** a las **09:26:01Z** el log
  `/var/log/onia-loop-investigacion.log` registró `ARRANCA investigacion — rama
  claude/investigacion — HEAD a7a28f63 — tope 2400s`. Es la primera vez que ese loop arranca
  **desde su cron** en toda su vida; la línea inmediatamente anterior del log es el `uso:` mudo de
  la corrida fallida.
- Commits en `claude/docs-auditoria`: `ea8f10eb` (el arreglo + la corrección de `loops.md`) y
  `a2328ee7` (el README del corredor). **Todavía no están en `main`** — los mergea `onia-cola`,
  no este carril.

**Qué quedó a medias, y dónde**
Nada a medias de esta vuelta. Lo que queda vivo es la **causa**, no el síntoma: el corredor se
sigue editando a mano en el VPS y el repo se atrasa solo. Está cotizado en el radar (ítem 18) y
depende de Sergio elegir. Mientras tanto la única defensa son los pasos 3 y 8 de *"Cómo se agrega
o se saca un loop"* en `loops.md`, que ya fallaron dos veces en un día.

**Archivos y cambios**
- `hermes-content/docs/cola/loops.md` — se agregaron `web-venta` e `investigacion` a la tabla; se
  reemplazó la sección *"docs-auditoria — TODAVÍA sin horario"* (falsa y contradictoria con la
  tabla del propio archivo) por *"Un loop puede morir con su cron INTACTO"*; se corrigió el
  "todo fallo sale por Telegram"; se agregó el paso 8 (mirar el log al día siguiente).
- `scripts/loops/onia-loop.sh` y los 7 prompts — sincronizados con lo que **realmente corre**.
  Estaban atrás.
- `scripts/loops/README.md` — misma corrección del "todo fallo avisa", los dos prompts que
  faltaban en el bloque de instalación, y una guarda de `diff` antes de pisar el corredor.
- `hermes-content/docs/ONIA_RADAR_DECISIONES_PRODUCTO.md` — ítem 18, con 4 opciones cotizadas.
- `/root/bin/onia-loop.sh` (VPS, fuera del repo) — backup en
  `onia-loop.sh.bak-antes-restaurar-investigacion-20260902`.

**Intentos fallidos**
- **Buscar el `case` perdido en los backups del corredor no sirvió de nada.** Los tres
  (`.bak-20260902`, `.bak2`, `.bak-agregar-marca-personal-20260901`) son **anteriores** a la única
  vuelta de `investigacion`: `grep -l investigacion` no devuelve ninguno. El `case` se había
  perdido del todo. Los valores se reconstruyeron del **log de la propia vuelta** (`rama
  claude/investigacion — tope 2400s`) y de `git worktree list`. Si vuelve a pasar con otro loop,
  **empezá por el log, no por los backups.**
- **Hipótesis descartada:** que `investigacion` nunca hubiera estado registrado. Falso — corrió
  bien a las 03:00:20Z e hizo trabajo real (`a7a28f63`). El `case` existió y se perdió después, en
  la reescritura de las 05:44.
- **No se tocó el bloque de "Chequeo de arranque" de los 7 prompts**, aunque ahí está el agujero
  de fondo: sólo compara tabla→cron, nunca cron→tabla, y por eso tres loops vivos estuvieron
  ausentes de `loops.md`. El bloque dice explícitamente *"No lo optimices"* y tocarlo son 7
  archivos de 7 carriles distintos. Queda en el radar 18 para que lo decida Sergio, no para
  hacerlo de prepo en una vuelta.

**Qué depende de Sergio**
Radar ítem 18 — cómo blindar que un loop muerto avise. Cuatro opciones, todas Bs 0:
**(A)** que el corredor avise su propia divergencia con el repo — *recomendada*;
**(B)** un chequeo diario de `ARRANCA` faltante en los logs — el único que cubre un loop que
arranca y se cuelga; **(C)** mover el `exit 64` después de `avisar()` — parche de 10 min;
**(D)** nada. A y B no compiten. Aparte, decidir si se arregla el chequeo de arranque en una
sola dirección (toca los 7 prompts).

**Próximos pasos**
1. Que `onia-cola` mergee `ea8f10eb` y `a2328ee7` a `main`. **Listo** = `git log origin/main` los
   muestra.
2. Mirar `/var/log/onia-loop-investigacion.log` en la corrida de las 15:26 UTC. **Listo** = hay un
   `ARRANCA` con esa hora. Si no lo hay, el arreglo no aguantó y hay que volver a mirar el `case`.
3. Próximas vueltas de este carril: rotar a **Foco B** (trabajo pisado) o **Foco C** (ítems
   fantasma en las colas) — las dos últimas vueltas fueron Foco A.
