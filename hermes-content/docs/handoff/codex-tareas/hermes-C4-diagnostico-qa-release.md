---
id: hermes-C4
carril: hermes
estado: hecha   # pendiente | lanzada | PR | hecha | bloqueada
modelo: gpt-6-luna  # mecánico: una sección nueva que solo lee, con su prueba
repo: onia-hermes
rama: codex/hermes-c4-qa-release
base: main          # con #194 ya mergeado; si no, base: claude/adoring-ramanujan-7sjzwv (la rama de #194)
pr:
escrita: 2026-10-11 por Hermes-Jarvis (nube)
actualizada: 2026-10-11 por Hermes-Jarvis (nube)
nota: commit 11d05aa2 (PR #197); revisado y juntado a #194 el 11-oct con un arreglo (redactar antes de cortar)
---
# C4 · El diagnóstico diario muestra lo que dejó `onia-qa-release`

Sos Codex. Trabajás SOLO en esta carpeta: un worktree de `onia-hermes` que creó la madre, en la rama `codex/hermes-c4-qa-release`.
- No uses git: ni consultas, ni cambio de rama, ni commits. La madre verifica la rama y revisa el diff.
- Si ya hay cambios en la carpeta, una corrida anterior se cortó: revisá los archivos y seguí desde ahí.
- Nadie contesta preguntas mientras corrés. Decidí con este documento y el código; lo que no puedas decidir, anotalo en el resumen final.
- Sin push, sin `npm install`, sin producción, sin red. NO commitees: la madre revisa el diff y commitea.
- **Escribí los archivos en UTF-8 sin BOM y no cambies ningún carácter que no sea ASCII por `?`.** La edición en Windows ya rompió así `código`, `→` y `—` en dos tareas del 11-oct. Al terminar, buscá `?` entre letras y un BOM al inicio en cada archivo que tocaste.

## META
`hermes-content/deploy/hermes-jarvis/diagnostico.sh` corre todos los días en el VPS (por `hermes-qa-diario.yml`) y **solo lee**. `scripts/loops/qa-release.sh` (instalado como `/root/bin/onia-qa-release.sh`, cada 15 min) deja su estado en `/var/lib/onia-qa-release/` y su registro en `/var/log/onia-qa-release.log`. Hoy el diagnóstico no los muestra: la sección 15 solo dice si el log está mudo. Se agrega una **sección 17** que muestra ese estado, para que una persona (o una sesión de la nube que lee el registro de Actions) vea de un vistazo qué release miró el QA, si lo dio por roto, y qué dice su log.

## Los formatos reales (salen de `scripts/loops/qa-release.sh`; no inventes otros)
Directorio de estado `ESTADO` (por defecto `/var/lib/onia-qa-release`, línea 48 del script). Archivos que el script escribe o borra:
- `visto` — una línea: el sha corto del último release medido (`^[0-9a-f]{7,40}$`) (línea 227).
- `roto` — una línea: `<sha> <epoch> <motivos>` (línea 235). El `epoch` son segundos Unix de cuando empezó a estar roto; los motivos son texto libre (puede traer texto de la pantalla). Existe solo mientras el release está roto.
- `sin-medir` — archivo **vacío** que existe mientras el instrumento no pudo medir (líneas 215 y 221).
- `ventana` — una línea: el epoch de la última ventana :50 del publicador que se leyó (línea 342). `ventanas-seguidas` — un entero: ventanas seguidas sin publicar (líneas 348 y 356).
- `tarea-roto`, `tarea-medir`, `tarea-log`, `tarea-ventanas` — una línea cada uno: un id de tablero `t_` y 8 hexadecimales (`^t_[0-9a-f]{8}$`); existen solo mientras esa tarea está abierta (líneas 90-116).
- `capturas/` — carpeta con las capturas `.png` (línea 133). `corriendo-desde` y `.candado` — control interno: **no los muestres**.
El registro `/var/log/onia-qa-release.log` lo escriben la función `linea` del script y la salida de `onia-latido.sh`; cada línea es texto libre.

## Qué se agrega
Una sección nueva, **justo antes de `sec "fin"`** (después de la 16), con este título exacto:
`sec "17. QA después de cada publicación — lo que dejó onia-qa-release (11-oct, Q5)"`
(Si al abrir el archivo la última sección numerada no es la 16, usá el número siguiente y decilo en el resumen. **No renumeres ni cambies las secciones existentes.**)

Todo su texto va por `| redactar`. Imprime, en este orden, una línea por dato:
1. `--- estado: <ruta>` y, si la carpeta no existe, la línea `no existe <ruta>: qa-release todavía no corrió (¿falta aplicar?)` y **termina la sección** (exit 0).
2. `release visto: <sha>  (hace <N> min)` — el contenido de `visto` (solo si coincide con el formato; si no, `release visto: (formato inesperado)`) y la edad del archivo en minutos; si no existe: `release visto: nunca`.
3. `veredicto: sano` si no existe `roto` ni `sin-medir`; `veredicto: ROTO desde <HH:MMZ> — <motivos>` si existe `roto` (la hora sale del `epoch` en UTC; los motivos cortados a **160 caracteres**; si el `epoch` no es un número: `ROTO desde ?`); `veredicto: SIN MEDIR (el instrumento no pudo medir)` si existe `sin-medir`. Si existen los dos, imprimí las dos líneas (ROTO primero).
4. `ventanas del publicador: última leída <HH:MMZ>; seguidas sin publicar: <N>` (valores `?` si el archivo falta o su formato es inesperado).
5. `tareas abiertas: roto <id|—> · medir <id|—> · log <id|—> · ventanas <id|—>` — el id solo si cumple `^t_[0-9a-f]{8}$`; si el archivo existe con otro contenido, `(id inválido)`; si no existe, `—`.
6. `capturas: <N> archivo(s) .png; la más nueva hace <M> min` — solo cantidad y edad; **nunca** los nombres completos de ruta ni el contenido.
7. `--- últimas 15 líneas de <ruta del log>` y esas líneas, **cada una cortada a 200 caracteres**. Si el log no existe: `(no existe: qa-release todavía no escribió)`.

Reglas de implementación: bash y utilidades que el archivo ya usa (`stat`, `date`, `tail`, `cut`, `ls`, `wc`); sin `python` salvo que lo necesites; comentarios en español que expliquen el porqué, como los de las secciones 15 y 16. **Nunca** `cat` de `roto` o del log sin pasar por el corte de longitud y por `redactar`.

## PRUEBA DE HECHO
1. `node --test scripts/loops/diagnostico-qa-release.test.mjs` en verde, y `npm run test:jarvis-qa-release` (lo creás en `package.json`) hace lo mismo.
2. La prueba **extrae la sección 17 del `diagnostico.sh` real** (hasta el siguiente `\nsec "`) y la corre en un directorio temporal reemplazando `/var/lib/onia-qa-release` y `/var/log/onia-qa-release.log` por rutas del directorio temporal. Copiá el patrón de `diagnosticoLatidos()` de `scripts/loops/hermes-jarvis-aplicar.test.mjs` y el de `scripts/loops/diagnostico-modelo.test.mjs`, **sin importar esos archivos**. Para `redactar`, definí `REDACTAR_SED` como en esos tests, y en el caso de redacción usá uno que cambie `SECRETO-DE-PRUEBA` por `***`.
3. **Los archivos de estado de la prueba tienen los formatos de arriba** (el `roto` es `abc1234 1791700000 /dashboard: pantalla vacía`, la `ventana` un epoch, las tareas `t_0a1b2c3d`), no otros. Casos:
   - a. carpeta inexistente → la línea «no existe … todavía no corrió» y exit 0; no se imprime nada más de la sección.
   - b. solo `visto` → `release visto: abc1234 (hace N min)` y `veredicto: sano`.
   - c. `roto` con motivos de 400 caracteres → el motivo sale cortado a 160 y la hora `HH:MMZ` coincide con el epoch (calculala con `Date.UTC` en la prueba); con `SECRETO-DE-PRUEBA` en los motivos → no aparece.
   - d. `sin-medir` vacío → `SIN MEDIR`; con `roto` y `sin-medir` a la vez → las dos líneas, ROTO primero.
   - e. `ventana` y `ventanas-seguidas` con valores válidos y con basura (`xyz`) → la hora y el entero, o `?`.
   - f. `tarea-roto` con `t_0a1b2c3d` y `tarea-log` con `no-es-un-id` → el id y `(id inválido)`; las otras en `—`.
   - g. `capturas/` con tres `.png` (con mtimes distintos) → «3 archivo(s) .png» y la edad de la más nueva; ningún nombre de archivo en la salida.
   - h. log de 40 líneas, una de 500 caracteres y una con `SECRETO-DE-PRUEBA` → salen solo las últimas 15, la larga cortada a 200 y el secreto redactado.
   - i. `corriendo-desde` y `.candado` presentes → no aparecen en la salida.
4. **Solo lee:** la prueba calcula el hash de todos los archivos del directorio de estado antes y después de correr la sección y exige que sean iguales; pone en `PATH` falsos de `curl`, `wget`, `docker`, `hermes` y `ssh` que escriben un archivo marcador si se ejecutan, y al final el marcador **no existe**. El texto de la sección 17 no contiene `curl`, `wget`, `docker`, `ssh`, `http://`, `https://`, `rm `, `mv `, `touch ` ni `>>`.
5. **Mutación:** una copia del texto de la sección sin `| redactar` hace fallar el caso (c) o el (h); una con el corte de 15 líneas cambiado por 150 hace fallar el (h). La prueba lo comprueba.
6. Se suman `test:jarvis-qa-release` a `package.json` y a la lista `for s in …` de `.github/workflows/hermes-jarvis-pruebas.yml`.
7. Siguen en verde: `npm run test:jarvis-aplicar`, `test:jarvis-diagnostico`, `test:jarvis-modelo`, `test:qa-diario-guarda`, `test:jarvis-resumen` y `test:docs-hygiene`. Atención: las pruebas de las secciones 12 a 16 cortan el texto con `diag.indexOf('\nsec "', …)`; con una sección 17 nueva **no tienen que cambiar**. Si alguna corta hasta `sec "fin"`, hacé lo mismo que en C1 (cortar en el siguiente `\nsec "`) y listalas en el resumen. `bash -n hermes-content/deploy/hermes-jarvis/diagnostico.sh` sin errores.

## REGLA DE PARADA
- **El script solo lee.** Nada de `systemctl`, `crontab -e`, `docker`, `curl`, `ssh`, escrituras fuera de `/tmp`, ni llamadas a `hermes` o a cualquier modelo. Si una parte te lo pide, **pará** y reportalo.
- **No toques las secciones 1 a 16** ni el resto de `diagnostico.sh`.
- No imprimas el contenido de `corriendo-desde`, de `.candado`, de las capturas ni de otros archivos del directorio de estado, ni nombres de ruta de las capturas.
- Sin dependencias nuevas.
- Este script corre como root en producción: entregá un diff chico y legible.

## ARCHIVOS
Puede editar: `hermes-content/deploy/hermes-jarvis/diagnostico.sh` (solo agregar la sección 17 antes de `sec "fin"`), `package.json` (solo agregar `"test:jarvis-qa-release": "node --test scripts/loops/diagnostico-qa-release.test.mjs"` junto a `test:jarvis-modelo`) y `.github/workflows/hermes-jarvis-pruebas.yml` (solo agregar `test:jarvis-qa-release` a la lista de `for s in …`).
Puede crear: `scripts/loops/diagnostico-qa-release.test.mjs`.
Todo lo demás, prohibido (y `scripts/loops/qa-release.sh` se **lee**, no se cambia).

## Contexto mínimo
- Onia (Bolivia) vende un sistema de gestión por rubro. **Hermes** es su asistente por Telegram y corre en un VPS con un `crontab` de root; `aplicar.sh` instala el cron de `qa-release` (cada 15 min), que mira la app publicada con una cuenta de QA y avisa por la aduana si está rota.
- `diagnostico.sh` lo ejecuta GitHub Actions todos los días por SSH y su salida queda en un log: nada secreto. Cada sección pasa por `| redactar` (función de `comun.sh`).
- Convención del carril: **ROTO** solo con evidencia; si falla el instrumento es **NO MEDIDO** (exit 2). Esta sección no decide nada: muestra lo que el script dejó escrito.
- Lección del día (dos veces): el ejemplo de una prueba sale del sistema real. Por eso los formatos de arriba salen del script, y la prueba los reproduce tal cual.
