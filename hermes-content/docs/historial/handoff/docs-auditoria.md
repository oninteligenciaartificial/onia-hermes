# Handoff — docs-auditoria

Carril docs/infra. Corre solo por cron en el VPS (`18 1,5,9,13,17,21` UTC, 6×/día), worktree
`/root/loops/onia-hermes-docs`, rama `claude/docs-auditoria`. Este archivo es el estado **actual**
del carril: se sobrescribe cada vez, no se acumula.

**Objetivo**
Que lo escrito sea cierto: una afirmación falsa menos en el repo por vuelta, con la evidencia de
por qué era falsa. **Hecho** = corregida en su propio archivo, con la medición que lo prueba en el
commit. Cumplido en la vuelta del 2026-09-02 17:18 UTC (**Foco B**, la rotación que pedía el
handoff anterior: las vueltas previas habían sido A, A y C).

**Qué quedó EN PRODUCCIÓN**

- Commit en `claude/docs-auditoria`, pusheado. **Todavía NO está en `main`** — lo mergea
  `onia-cola`, no este carril.
- **Hallazgo: `origin/claude/lucia-vps` lleva 17 commits que nunca llegan a `main`** (90 archivos,
  +4780/−894). Lo último de Lucia que sí llegó fue `12ea2219`, del **2026-08-30** — tres días.
  La rama está pusheada y su árbol limpio: **no hay nada perdido**, hay trabajo que no se integra.
- **La causa, que vale más que el hallazgo — fallaron las DOS defensas, y la segunda por diseño.**
  El integrador enumeraba siete ramas de carril y ésta es la octava; y su regla de rescate decía
  que una rama sin listar es carril *"si su loop existe en `loops.md`"*. **Lucia no tiene loop:**
  la mueven `lucia-ugc.sh` (`37 */3 * * *`) y `lucia-cierre.sh` (`10 11 * * *`), dos crons pelados
  que no son `onia-loop.sh`, así que `loops.md` no los lista ni los va a listar nunca. El filtro
  la excluía **por construcción**. Y su árbol `/root/loops/lucia-contenido` es un **clon aparte**,
  no un worktree: tampoco sale en `git worktree list`. Tres formas de mirar, tres puntos ciegos.
- Corregido en el prompt del integrador: la rama figura en la lista con su dueño y con **NO la
  mergees**, y la regla de rescate ya no filtra por `loops.md` — *toda* rama que salga del
  `--no-merged` y no esté listada es carril hasta que se demuestre lo contrario.
- Corregidas dos fechas falsas en el mismo archivo: decía *"hasta el 2026-09-02 **18:33** UTC"* y
  *"al 2026-09-02 **18:33** UTC"*, escritas por el commit `9d8e23e0`, cuyo committer date es
  **13:38:56Z** — un sello **cinco horas en el futuro** de cuando se escribió, y todavía futuro al
  cierre de esta vuelta. Una foto vieja que se lee como recién tomada.
- Radar **§29** nuevo, con 3 opciones cotizadas (ver *"Qué depende de Sergio"*).

**Qué quedó a medias, y dónde**
Nada a medias de esta vuelta. Lo que queda vivo es la decisión de la rama, cotizada en el radar
§29 — este carril tiene prohibido mergear (eso es de `onia-cola`) y prohibido decidir la frontera
del carril de contenido (eso es de Sergio).

**Archivos y cambios**
- `scripts/loops/prompts/onia-cola.md` — `claude/lucia-vps` agregada a la lista de carriles;
  recuadro nuevo con la medición y el **NO la mergees**; regla de rescate corregida; los dos
  `18:33 UTC` → `13:38 UTC`.
- `hermes-content/docs/ONIA_RADAR_DECISIONES_PRODUCTO.md` — §29 nuevo.
- Este handoff.

**Intentos fallidos**
- 🔴 **Casi reporto un hallazgo falso, y por no hacer lo que este mismo archivo mandaba.** El
  chequeo de arranque encontró `kpis-semanal` corriendo en `crontab -l` y **ausente** del repo:
  sin fila en `loops.md`, sin prompt en `scripts/loops/prompts/`, sin `case` en
  `scripts/loops/onia-loop.sh`. Encajaba perfecto con el modo de falla que `loops.md` documenta
  (*"el loop invisible: existe, corre, gasta"*) y llegué a construir la teoría de que el sync
  horario le iba a borrar el `case`. **Era todo falso: está íntegramente versionado en
  `origin/main`** — prompt, `case` y fila en la tabla. Mi rama estaba **18 commits atrás**.
  El paso 2 del handoff anterior decía textualmente *"arrancar con `git fetch` y medir la
  distancia antes de leer nada"*; lo hice **después** de empezar a investigar. Se salvó por
  comparar contra `origin/main` antes de escribir, otra vez por reflejo y no por método.
  **La regla no se cumple sola por estar escrita: `git fetch && git rebase origin/main` es el
  PRIMER comando después de `branch --show-current`, antes del chequeo de arranque.**
- **Hipótesis descartada:** que hubiera trabajo ajeno en riesgo de perderse. Medido: los **6**
  worktrees tienen el árbol limpio (`status --porcelain` vacío) y las 6 ramas están al día con su
  remoto. Las borradas recientes de `main` (`--diff-filter=D`, 20 commits) son todas
  intencionales y explicadas en su mensaje. **Nada en riesgo por esa vía** — el trabajo varado de
  Lucia también está pusheado; el problema es de integración, no de pérdida.
- **No se tocó `/root/bin/loops/onia-cola.md`** (la copia desplegada), a propósito: la despliega
  `onia-loops-sync.sh` desde `main` al minuto 44. Editarla a mano es exactamente el drift que el
  radar §22 pide blindar.

**Qué depende de Sergio**
- **Radar §29** (nuevo) — qué hacer con `claude/lucia-vps`. **(a)** mergearla entera: **cero
  conflictos** (medido: ni un archivo tocado por los dos lados), pero **+88,2 MB** en 59 binarios
  a un repo que todo clon se lleva entero; **(b)** mergear sólo la herramienta compartida
  (`scripts/carousel_render.js` +329 y `scripts/carousel_pack_solido.js`) y dejar el banco de
  video en la rama — *recomendada*; **(c)** declararla fuera del juego como `carril-contenido`,
  pero eso deja el render de carruseles bifurcado para siempre. Todas Bs 0.
- **Radar §25** — que los carriles sincronicen con `main` al arrancar. **Sigue abierto, y esta
  vuelta volvió a pagar su costo** (ver *Intentos fallidos*): es el segundo carril que arranca
  con una foto vieja y casi audita ficción.
- **Radar §22** — cómo blindar que un loop muerto avise y que el corredor del VPS no diverja del
  repo. Sigue abierto.

**Próximos pasos**
1. Que `onia-cola` mergee este commit a `main`. **Listo** = `git log origin/main` lo muestra.
2. **`git fetch && git rebase origin/main` como PRIMER comando de la vuelta**, antes del chequeo
   de arranque. Dos vueltas seguidas se salvaron de casualidad; a la tercera no.
3. Rotar a **Foco A** (docs falsos) o **Foco C** (ítems fantasma en las colas) — esta fue Foco B.
4. Chequeo de arranque de esta vuelta: las **8** filas `VPS` de `loops.md` estaban todas en
   `crontab -l` (`kpis-semanal` incluida). Nada que rearmar.
