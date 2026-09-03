# Handoff — carril `supervisor`

Audita a los otros loops: que ninguno cobre por trabajo que no sirve. Rama `claude/supervisor`.
No mergea a `main` (eso es de `onia-cola`) y no arregla carriles ajenos: deja la tarea en el tablero.

**Última vuelta: 2026-09-03 10:29 UTC.**

---

## Objetivo de la vuelta

Auditar a fondo **un** carril de los nunca mirados, abriendo su trabajo de verdad.
Elegido: **`calidad-generado`** — 3 vueltas, nadie lo había auditado, y su último commit
hace una afirmación falsable (*"las 6 piezas que íbamos a publicar tienen dos caras"*).

**Hecho =** decir si su trabajo sirve o no, con evidencia mirada, no leída.

## Qué quedó en producción

Nada desplegado — este carril no despliega. Lo que quedó:

- **Tarea `t_ea19e42c` abierta en el tablero** (prioridad 1, sin reclamar, para `lucia` +
  `calidad-generado` + `onia-cola`): dos carriles escriben los **mismos tres archivos** de
  calidad de Lucía y el merge choca en `add/add`.
- **Veredicto sobre `calidad-generado`: SIRVE.** Verificado abriendo las imágenes.

## El veredicto, con la evidencia

`calidad-generado` frenó un lote que cuatro documentos daban por publicable. **Su carril está
más cerca de su definición de hecho que ayer**: su trabajo es que Onia no publique una pieza
mala, y evitó exactamente eso.

Lo verifiqué **mirando**, no leyendo el commit:

- Abierta `TIRA-6-caras.png`: **P3 tiene manchones rojos inequívocos** en pómulos y nariz;
  **P4 y P5 son visiblemente otra cara** (más larga y angulosa) que P1/P2/P6.
- Abierta `_AUDITORIA-CARAS.jpg` (la hoja vieja, original en disco, **no** su recorte):
  está rotulada literalmente **P1** y **P6** — comparó 2 de 6, y justo las dos que coinciden.
  P3, P4 y P5 nunca entraron. El hallazgo estructural es cierto y se ve de un vistazo.

Lo que además hace bien y conviene no romper: declina fallar P6 por ser zona oscura y
desenfocada (*"acusar sobre eso sería el error del canario"*), y marca la salvedad de que
el ángulo 3/4 de P4 y la risa de P5 alargan cualquier cara. **Se limita a lo que la evidencia
aguanta.** Cero créditos gastados: todo estaba en disco.

## Qué quedó a medias y dónde

- **El veredicto no llegó a `main`.** Los 3 commits (`d8f370c35`, `aa6ceb3fe`, `525f0f09d`)
  siguen sólo en `origin/claude/calidad-generado`. Quien lee `main` sigue viendo el lote como
  publicable. **No lo mergeé: no es mi zona** — y además choca (ver `t_ea19e42c`).
- La causa del choque **no está decidida** y la decisión no es mía: hay que elegir un dueño
  único de los tres archivos, o separarlos por nombre.

## Archivos

- `hermes-content/docs/handoff/supervisor.md` — este archivo.
- Auditado (sin tocar): `origin/claude/calidad-generado`, y en `main` los tres archivos de
  `hermes-content/references/modelos/lucia/`.

## Intentos fallidos — lo que NO era

Tres hipótesis mías que la medición mató. Las tres habrían sido un reporte falso:

1. **"`kpis-semanal` corrió en 7 segundos, es un éxito falso."** Falso: el log dice
   *"No es lunes en La Paz (es miércoles). Termino sin hacer nada, según la regla del loop"*.
   Es una salida correcta. **Queda cerrado el ítem 3 del handoff anterior.** (De paso: ese
   ítem decía "jueves"; era miércoles.)
2. **"La fila de `contenido-cola` en `loops.md` miente: dice Windows y corre en el VPS."**
   Ya estaba corregida en `main` (VPS, `11 */3`) por la tarea `t_77b6c270`. Lo viejo era **mi
   worktree**, no el doc. Rebasé antes de seguir. *Auditar con un checkout viejo fabrica
   hallazgos falsos sobre trabajo ajeno ya hecho.*
3. **"El carril de contenido está por publicar las 6 piezas que calidad reprobó."** Falso:
   `ads-creatividades-publicos` trabaja los **carruseles** de esa carpeta (L2, L6, L08, L09,
   `render-l10/11`, `FIJADO`), no las fotos P1–P6. Casi lo reporto como riesgo inminente.

Y una del método: **empecé a leer la bitácora en vez de mirar las imágenes.** El texto estaba
tan bien argumentado que convencía solo — que es justo la condición en la que hay que cambiar
de instrumento. El hallazgo era cierto, pero eso se supo al abrir el PNG, no al leerlo.

## Qué depende de Sergio

**Nada de esta vuelta.** `t_ea19e42c` la resuelven los carriles dueños; no necesita decisión
suya. No se anotó nada en el radar.

## Próximos pasos

1. **No re-auditar `calidad-generado`** hasta que `t_ea19e42c` esté cerrada. Listo = el merge
   simulado no devuelve conflictos:
   `git -C /root/loops/onia-hermes merge-tree --write-tree --name-only origin/main origin/claude/calidad-generado`
2. Auditar el siguiente carril menos mirado. **Ya auditados:** `web-venta`, `chatbot`, `lucia`,
   `onia-cola`, `recorrido-cliente`, `calidad-generado`. **Nunca auditados: `tendencias`,
   `web-factory-dev`, `marca-personal`, `canario-visual`, `investigacion`, `docs-auditoria`.**
   `tendencias` es el que menos vueltas lleva (1) y el más barato de mirar.
3. Sigue abierto del handoff anterior: la rama de `kpis-semanal` (`claude/marca-personal-loop`)
   no figura en `loops.md`. Listo = saber si debe estar en la tabla.
4. Ninguna tarea `ready` del tablero era de esta zona (`t_8baa5891`, `t_13eaa0ae`,
   `t_a906491b`): no se reclamaron a propósito.
