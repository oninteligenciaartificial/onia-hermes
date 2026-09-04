# Handoff — carril `supervisor`

Audita a los otros loops: que ninguno cobre por trabajo que no sirve. Rama `claude/supervisor`.
No mergea a `main` (eso es de `onia-cola`) y no arregla carriles ajenos: deja la tarea en el tablero.

**Última vuelta: 2026-09-04 14:29 UTC** (10:29 La Paz — la franja del reporte diario a Sergio).

---

## Objetivo de la vuelta

Medir el avance de los 15 loops, mandar el reporte diario, y auditar el carril menos mirado.

**Hecho =** decir si el trabajo de un carril sirve o no, con evidencia **medida**, no leída.

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

## Próximos pasos

1. **Auditar `marca-personal`.** Es el próximo de los nunca mirados.
   **Ya auditados:** `web-venta`, `chatbot`, `lucia`, `onia-cola`, `recorrido-cliente`,
   `calidad-generado`, `tendencias`, `docs-auditoria`, `web-factory-dev`.
   **Nunca auditados:** `marca-personal`, `canario-visual`, `investigacion`.
2. **`kpis-semanal` sigue sin correr**: 0 vueltas en 24 h y su última es del 2026-09-03 12:31,
   anterior al despliegue del prompt. `loops_avance.sh` lo clasifica en *"aún no vio el prompt"*,
   que es un descarte legítimo **pero se vuelve una excusa permanente si nadie lo mira**: un loop
   de cadencia larga puede esconderse ahí para siempre. Listo = saber si su cron dispara.
   Relacionado con el punto 4, que lleva cinco handoffs abierto.
3. **`loops.md` quedó atrás del `crontab` en 5 loops** (`canario-visual`, `docs-auditoria`,
   `investigacion`, `marca-personal`, `supervisor`): las cadencias se bajaron el 2026-09-03 16:23
   y la tabla versionada sigue con las viejas. **No lo toqué** —es zona de `docs-auditoria`— pero
   tiene un filo: el chequeo de arranque de los 15 prompts manda a *"volver a poner la línea
   exactamente como dice la columna `cron`"*, así que un loop podría **restaurar la cadencia alta
   que Sergio bajó a propósito**. No probé que haya pasado; medirlo antes de abrir tarea.
4. Sigue abierto de cinco handoffs atrás: la rama de `kpis-semanal`
   (`claude/marca-personal-loop`) no figura en `loops.md`. Listo = saber si debe estar.
5. **Observación sin daño probado** (no re-medida): la enumeración `--no-merged` del integrador
   devuelve ~30 ramas y sólo 6 están vivas. No abrir tarea hasta poder demostrar el daño.

---
