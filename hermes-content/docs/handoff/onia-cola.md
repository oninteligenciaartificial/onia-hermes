# Handoff — carril `onia-cola` (el integrador)

**Última vuelta: 2026-09-03 04:33–04:55 UTC.**

## Objetivo de la vuelta

Tarea del tablero `t_0e929acc`: el integrador no enumeraba 6 carriles vivos, 14 commits varados,
y los arreglos de prompt no se encendían. **Cerrada.**

## Qué quedó EN PRODUCCIÓN (`main`, pusheado)

**11 de los 13 carriles integrados — 25 commits.** `supervisor`, `lucia-vps`, `recorrido-cliente`,
`web-factory-dev`, `tendencias`, `web-venta`, `investigacion`, `docs-auditoria`,
`chatbots-platform-review-0d1d09`, `canario-visual`, `marca-personal-loop`.

**El efecto medido, no supuesto:** el sync de las 04:44 copió los prompts desde `main` y
`/root/bin/loops/lucia.md:69` pasó de la forma rota a la correcta. Verificado leyendo el archivo
vivo después del sync, no antes.

## Qué quedó a medias, y dónde

**Dos carriles NO se mergearon, los dos por la misma causa** (radar ítem 36):

| rama | commits | choca en |
|---|---|---|
| `claude/calidad-generado` | 2 | `RUBRICA-IMPOLUTO.md`, `BANCO-OFICIAL.md`, `BITACORA-PERFECCION.md` (add/add) |
| `claude/git-status-935f47` | 2 | `LUCIA.md` — **118 KB** de conflicto |

`references/modelos/lucia/` lo escriben tres manos sin dueño declarado. **Los dos merges van a
seguir abortando en cada vuelta** hasta que Sergio diga quién manda. Ninguna rama perdió trabajo.

## Archivos tocados

- `scripts/loops/prompts/onia-cola.md` — lista de 13 ramas sin duplicados; síntesis lista-vs-comando;
  el corredor (`RAMA=` de cada `case`) como mapa loop→rama; recuadro de `lucia-vps` corregido.
- `hermes-content/docs/ONIA_RADAR_DECISIONES_PRODUCTO.md` — ítems 36, 37 y 38.

## Intentos fallidos y trampas (lo que casi cuesta caro)

1. **Una advertencia `NO mergees` vencida vara un carril para siempre.** El prompt decía no mergear
   `lucia-vps` por "+88,2 MB en 59 binarios". Era cierto al medirse (09-02 17:30). Recontado hoy:
   **4 commits, 1,3 MB, 14 archivos** — porque el álbum ya había entrado directo a `main` el 09-02
   a las **03:24**, catorce horas ANTES de que se escribiera la advertencia. Protegía una puerta
   con el caballo adentro. **Un `NO mergees` es una medición con vencimiento: recontá antes de
   obedecer.** Cuesta un `git diff --shortstat`.
2. **Dos carriles pueden arreglar lo mismo y sacar conclusiones opuestas.** `supervisor` y
   `docs-auditoria` corrigieron los dos la lista de ramas; uno concluía "gana el comando", el otro
   "se mantiene la lista". Pegar ambos habría dejado el prompt contradiciéndose. **Se sintetizó.**
3. **Resolver un conflicto con regex deja el marcador de apertura huérfano.** Borrar el bloque
   `=======…>>>>>>>` no borra el `<<<<<<< HEAD`. Verificar SIEMPRE con grep después.
4. **Un merge limpio puede duplicar contenido igual.** `docs-auditoria` agregó las mismas 6 ramas
   en otro lugar del archivo: git las mergeó sin conflicto y la lista quedó con **19 entradas y 6
   duplicados**. Sin conflicto ≠ correcto.
5. **`docs-auditoria` tenía razón y `main` estaba mal** en una fecha (13:38 vs 18:33 UTC).
   Se verificó con `git log -S` contra el commit real (`9d8e23e07`), no eligiendo la más nueva.

## Qué depende de Sergio

1. **Radar 36 — quién es dueño de `references/modelos/lucia/`.** Una línea. Destraba 4 commits y
   deja de romper dos merges por vuelta.
2. **Radar 38 — 761,7 MB de assets de Lucía en `main`** (87 videos), que todo clon se lleva. Se
   recomienda **B** (dejar de agregar; 20 min, reversible).
3. **Radar 31 — `onia.com.bo` se puede publicar ya.** La condición ("cuando `onia-cola` mergee")
   se cumplió. **Un reinicio NO alcanza: hay que rebuildear.**

## Próximos pasos

- Con la respuesta al 36: mergear `calidad-generado` y `git-status-935f47`.
- Sin ella: **no reintentar esos dos merges a ojo** — abortan por diseño.
- `claude/onia-core-adoption-sprint5` (onia-platform) sigue siendo decisión de Sergio (radar 26).
