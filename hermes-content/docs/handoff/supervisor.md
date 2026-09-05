# Handoff — carril `supervisor`

Audita a los otros loops: que ninguno cobre por trabajo que no sirve. Rama `claude/supervisor`.
No mergea a `main` (eso es de `onia-cola`) y no arregla carriles ajenos: deja la tarea en el tablero.

**Última vuelta: 2026-09-04 18:29 UTC** (14:29 La Paz — la franja del reporte diario a Sergio).

---

## Objetivo de la vuelta

Medir el avance de los 15 loops, mandar el reporte diario, y auditar el carril menos mirado.

**Hecho =** decir si el trabajo de un carril sirve o no, con evidencia **medida**, no leída.

## Vuelta 2026-09-04 18:29 UTC: el horario del reporte diario volvió a apuntar a una vuelta muerta

El cron de `supervisor` se bajó otra vez el mismo día, de `29 2,8,14,20` (4/día) a `29 6,18`
(2/día). El prompt seguía condicionando el reporte diario a «14:29 UTC (10:29 La Paz)» — la misma
vuelta que YA se había corregido una vez por el mismo motivo (antes decía «12:29 UTC»). Con la
nueva cadencia esa hora no existe: el reporte habría vuelto a callarse sin avisar. Corregido a
`18:29 UTC (14:29 La Paz)`, la única de las dos vueltas que quedan que cae en horario de Sergio
(la otra es `2:29 La Paz`). Esta misma vuelta ES esa franja, así que el reporte salió con el
mensaje corregido — ver commit de esta vuelta y `scripts/loops/prompts/supervisor.md`.

Además: se resolvió un conflicto de merge con `origin/main` en `package.json` (dos carriles
agregaron cada uno un gate a la cadena `test`, la misma trampa ya documentada en la memoria
compartida) — resuelto por unión, ambos eslabones quedaron.

- `recorrido-cliente` cortó su última vuelta a los 212s con "Esperando a que avance el
  recorrido..." y sin línea `OBJETIVO:` (no está muerta por cupo, commiteó capturas). Primera vez,
  no es patrón — tarea `t_36ef26c2` para su dueño con la reproducción exacta.
- 0 tareas `needs_input` pendientes al momento del reporte.
- `patrones_error` de hoy son los 3 ya conocidos (cupo compartido de Claude). `tablero_rebloqueadas`
  trae `t_43947a6a` (ya con veredicto en el handoff anterior) y `t_54ff72b5`, que sigue con
  comentarios activos de `carril-web-venta` — no está congelada, no amerita lección nueva.

## Veredicto: el que no servía era MI PROPIO INSTRUMENTO

`loops_avance.sh` marcó a **`investigacion`** como `DESOBEDIENTE` en la vuelta de las 09:26 UTC —
la misma en la que ese loop midió bien, bajó su número de 20 a 14 con un criterio honesto y dejó
escritas su `RAZÓN:` y su `LECCIÓN:`.

La causa: la limpieza del prefijo markdown era una **lista de inclusión** de caracteres,
`[*_#> -]`. `investigacion` escribió su medición entre backticks —`` `OBJETIVO: abiertas 25 …` ``—
y el backtick no estaba en la lista, así que el `grep -q "^OBJETIVO:"` no la vio.

**Es la segunda vez que la misma lista deja pasar un adorno.** La negrita (`**OBJETIVO:**`) rompió
igual el 2026-09-03. Agregar el backtick habría dejado la tercera esperando, así que la lista se
fue entera: se limpia todo lo que no sea alfanumérico (`s/^[^[:alnum:]]*//`).

El falso positivo va en la **dirección cara**: la única salida de un "desobediente" es una tarea a
su dueño, o sea gastarle la vuelta a un carril sano. Este loop existe justamente para no hacer eso.

⚠️ **La memoria compartida seguía recomendando la regex rota** (entrada del 04-sep 04:39, que
manda a limpiar con `sed -E 's/^[*_#> -]*//'`). Corregida con `onia-aprender.sh` en esta vuelta:
la trampa no era el markdown, era **enumerar** los adornos.

## Veredicto: `web-factory-dev` SIRVE

Primer carril de la lista de nunca auditados. Su medición se mueve sola entre vueltas —ítems
abiertos **6 → 5 → 3**, First Load **192 → 148 kB**, y *"publicable con un comando"* pasó de **no**
a **sí**— y al abrir los commits hay **código de producto real**, no comentarios: un `postbuild`
que copia `.next/static` dentro del standalone (sin eso el árbol servía HTML sin CSS), y un hero
que escalaba sólo con el ancho y dejaba el botón que convierte **14 px bajo el pliegue a
1366x768**. Ninguna de las seis señales de basura.

## Veredicto: `marca-personal` SIRVE

Siguiente de la lista de nunca auditados. Su último commit real (`7cb293c79`, antes de que la
sesión de control lo pausara hoy por foco-vender) no fue una migración más de generador: al ir a
migrar el 4º de 12, encontró que la FICHA de `statement-3d-minimal` —el archivo que copia CADA
pieza nueva del patrón— seguía mandando `Archivo 900 / wdth 62`, los dos ejes que Sergio rechazó
el 02-sep. Arregló la plantilla, no sólo la instancia (la trampa opuesta ya está en la memoria
compartida: "arreglar instancias sin subir el arreglo a la plantilla deja el defecto
reapareciendo para siempre"). Además encontró y midió tres defectos reales que no movían el peso
del PNG y habrían sido publicables: un "3 COSAS" sobre un lienzo con 4 iconos, un sticker que
cortaba "CONTRATAR" en los dos bordes (medido 186px de texto en un círculo de 166px, no a ojo), y
una cinta adhesiva tapada detrás de un bloque verde. Ninguna de las seis señales de basura.

## Qué quedó en producción

- **`loops_avance.sh` arreglado y con gate** — commit `e27537cc2`. Rojo antes por el motivo
  correcto (2 de 7, los dos casos con backtick), verde después (7/7). Contra los logs reales,
  *sin medir* pasó de **1 de 15 a 0 de 15**.
- **`scripts/loops_avance.test.sh`**, cableado a la cadena `npm test` como `test:loops-avance`
  (30 eslabones). Fija las tres formas reales —plana, negrita, backtick— **y la dirección
  contraria**: un loop que no midió sigue saliendo desobediente, y mencionar la palabra en una
  frase no cuenta como medir. Sin ese segundo lado, un gate que sólo afloja diría "todos miden"
  para siempre.
- **Reporte diario enviado** (10:29 La Paz), con la línea de pulso: 1 lección · 0 prompts · 1
  decisión suya.

## Qué quedó a medias y dónde

**Dos preguntas para Sergio quedaron en `status=todo` con `kind=needs_input`: nunca le llegaron.**
Es el fallo que mide el OBJETIVO 2 (`tablero_rebloqueadas`), y las dos tenían la evidencia
**congelada**. Recontadas en vivo, dejé el resultado como comentario en cada una (no las reclamé,
no son de mi zona):

- **`t_43947a6a`** (2 días trabada) — **vencida**. Pide autorizar un deploy "para que se construya
  la tarjeta de conexión WhatsApp", y la tarjeta **ya está viva**:
  `docker exec onia-platform grep -rl chatwootWhatsappInboxId /app/.next/server` → 3 chunks, en el
  build que corre (`mIi3zy_CtrcMhV8tRV2LF` = `build-b5e23d4`). No hay nada que autorizar: falta
  mirarla renderizada y cerrar. Su padre `t_e476aaf9` sigue `blocked`, así que `promote --force`
  no la destraba.
- **`t_54ff72b5`** (18 h trabada) — **1 de sus 3 decisiones ya no hace falta**. (A) el hero **ya
  está arreglado**: el `h1` es "Cerrás vos. El negocio no.", el `title` dice "Software de gestión
  Bolivia" y la `description` arranca por el sistema, con el asistente detrás. (B) y (C) **siguen
  vivos**: 4 CTA "Creá tu cuenta" van a `/empezar` en vez del registro, y `/comparativa` sigue en
  el nav. Reducida a B y C, es la decisión que fue en el reporte de hoy.

## Archivos

- `scripts/loops_avance.sh` — el instrumento (arreglado, y ahora testeable vía `ONIA_LOGDIR` /
  `ONIA_LOOPS`).
- `scripts/loops_avance.test.sh` — su gate.
- `package.json` — eslabón `test:loops-avance`.

## Intentos fallidos — lo que NO era

- **`investigacion` no era un loop desobediente.** Era mi grep. Si esta vuelta le hubiera abierto
  la tarea que "correspondía", le habría gastado una vuelta a un carril que trabajó bien.
- **Agregar el backtick a la lista `[*_#> -]` no era el arreglo**: es el mismo defecto una vez
  más, esperando al próximo adorno. Se descarta enumerar caracteres.
- **Las dos preguntas trabadas no eran preguntas pendientes**: una estaba vencida entera y la otra
  a un tercio. Mandárselas a Sergio tal como estaban habría sido pedirle que decida sobre datos
  muertos — lo que la memoria ya avisa de las tareas bloqueadas.
- **No auditar por volumen de commits.** El carril con más actividad de las últimas 24 h es
  `chatbot-cola` (25 vueltas); el que tocaba por cobertura era `web-factory-dev`. Entré por la
  lista, no por lo llamativo.

## Qué depende de Sergio

- **`ok B` / `no B`** — que "Creá tu cuenta" vaya derecho al registro (hoy son 3 clics). 20 min.
- **`ok C` / `no C`** — sacar `/comparativa` del menú de arriba; sigue publicada. 20 min.

Las dos ya le fueron por Telegram en el reporte de las 10:29.

## El circuito de auto-conocimiento — PERMANENTE, no es de una vuelta

> Sergio, 2026-09-04: *"revisá el apartado de auto knowledge para aprender qué fallas y seguir
> mejorando… recordá no perdernos y seguir mejorando de los errores, mirá tus loops"*.
>
> Antes de esto el supervisor **reportaba** qué loop no avanza, pero nadie comparaba una vuelta
> con la anterior: el mismo fallo se pagaba todos los días y nunca se convertía en regla.

**Quién aprende:** el loop `supervisor`, en su vuelta (cron `29 2,8,14,20` UTC). Nadie más. Ni
Sergio ni la sesión de control leen logs para esto.

**Cómo, en cuatro pasos:**

1. `/root/bin/onia-extraer-fallos.sh` — sin modelo, sin red, ~0,1 s. Lee los 15 logs de
   `/var/log/onia-loop-*.log` (24 h) y el tablero, y emite **un JSON**: por loop `vueltas`,
   `sin_commit` y `perdidas_por_limite`; los mensajes de error agrupados **por firma**
   (normaliza rutas, SHAs, relojes y números antes de contar); y las tareas con
   `block_recurrences >= 2`. **Umbral: 2** — una vez es mala suerte, dos es un patrón.
2. Por cada patrón nuevo, **una sola** salida: lección (`onia-aprender.sh`), corrección del
   prompt del loop culpable (`scripts/loops/prompts/<id>.md`, una línea con el porqué), o **UNA**
   tarea bloqueada si exige una decisión de Sergio.
3. `onia-consolidar-memoria.sh` funde la bandeja en `MEMORY.md` **con cerrojo y dedup**: escribir
   dos veces la misma lección deja una sola entrada.
4. El corredor (`onia-loop.sh`) inyecta `MEMORY.md` arriba del prompt de los 15 loops en cada
   vuelta. Ahí se cierra: lo que un carril aprende, los otros catorce lo leen sin repetir el error.

**Cómo se verifica** (probado de punta a punta el 2026-09-04):

```
/root/bin/onia-extraer-fallos.sh --autotest                     # el extractor se prueba solo
grep -c '^§$' /root/.hermes/memories/MEMORY.md                  # entradas antes
ONIA_LOOP_ID=supervisor /root/bin/onia-aprender.sh "<hecho>"    # deja en la bandeja
/root/bin/onia-consolidar-memoria.sh                            # "N agregado(s), M repetido(s)"
grep -c '<frase de la lección>' /root/.hermes/memories/MEMORY.md # tiene que dar 1, nunca 2
```

**Qué NO hace este circuito**, y es a propósito:

- **No cambia código de producto.** Sólo lecciones, prompts de loops y tareas.
- **No decide por Sergio.** Un patrón que exige plata, marca o contactar personas se convierte en
  UNA tarea bloqueada, no en un arreglo.
- **No cuenta `perdidas_por_limite` como falla de nadie.** Son vueltas muertas por el cupo
  compartido de Claude (25 de 128 en las 24 h del 2026-09-04, sobre 9 carriles). Diagnosticarlas
  como carril seco manda a arreglar loops sanos.
- **No toca el corredor ni el sincronizador.** El extractor se despliega solo por
  `sincronizar.sh` (cron `:44`) a `/root/bin/onia-extraer-fallos.sh`; la fuente es
  `scripts/loops/extraer-fallos.sh` y se edita **ahí**, nunca a mano en el VPS.

## Próximos pasos

1. **Auditar `canario-visual` o `investigacion`.** `marca-personal` quedó auditado esta vuelta
   (SIRVE, ver arriba).
   **Ya auditados:** `web-venta`, `chatbot`, `lucia`, `onia-cola`, `recorrido-cliente`,
   `calidad-generado`, `tendencias`, `docs-auditoria`, `web-factory-dev`, `marca-personal`.
   **Nunca auditados:** `canario-visual`, `investigacion`. Los dos están hoy `PAUSADO` en cron
   (foco vender), así que se audita su ÚLTIMA vuelta real antes de la pausa, no una vuelta nueva.
2. ~~`kpis-semanal` sigue sin correr~~. **CERRADO**: su cron es semanal (`7 13 * * 1`, lunes) y hoy
   es viernes — no está escondido en el descarte "aún no vio el prompt", simplemente no le tocó
   correr todavía. Se vuelve a mirar el próximo lunes después de las 13:07 UTC.
3. Sigue abierto de handoffs atrás: la rama de `kpis-semanal` es `claude/marca-personal-loop`,
   la MISMA que usa `marca-personal` a propósito (mismo worktree, corridas a distinta hora — está
   documentado en `onia-loop.sh:100-109`). No es un agujero de `loops.md`: la tabla de esa columna
   no lista ramas compartidas por diseño. Cerrado sin acción.
4. **Observación sin daño probado** (no re-medida): la enumeración `--no-merged` del integrador
   devuelve ~30 ramas y sólo 6 están vivas. No abrir tarea hasta poder demostrar el daño.

---
