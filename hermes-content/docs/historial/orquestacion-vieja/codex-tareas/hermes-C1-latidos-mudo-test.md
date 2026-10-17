---
id: hermes-C1
carril: hermes
estado: pendiente   # pendiente | lanzada | PR | hecha | bloqueada
modelo: gpt-6-luna  # mecánico: un archivo de pruebas, sin tocar código de producción
repo: onia-hermes
rama: codex/hermes-c1-mudo-test
base: main          # con #194 ya mergeado: la sección 15 del diagnóstico vive ahí
pr:
escrita: 2026-10-11 por Hermes-Jarvis (nube)
actualizada: 2026-10-11 por Hermes-Jarvis (nube)
nota: Se lanza DESPUÉS del merge de #194 (la sección 15 de `diagnostico.sh` no está en main hasta entonces).
---
# C1 · La frontera de la regla MUDO del diagnóstico, con pruebas que la sostienen

Sos Codex. Trabajás SOLO en esta carpeta: un worktree de `onia-hermes` que creó la madre, en la rama `codex/hermes-c1-mudo-test`.
- No uses git: ni consultas, ni cambio de rama, ni commits. La madre verifica la rama y revisa el diff.
- Si ya hay cambios en la carpeta, una corrida anterior se cortó: revisá los archivos y seguí desde ahí.
- Nadie contesta preguntas mientras corrés. Decidí con este documento y el código; lo que no puedas decidir, anotalo en el resumen final.
- Sin push, sin `npm install`, sin producción, sin red. NO commitees: la madre revisa el diff y commitea.

## META
El diagnóstico diario del VPS (`hermes-content/deploy/hermes-jarvis/diagnostico.sh`, sección 15) marca **MUDO** a cada trabajo del cron cuyo log lleva más tiempo sin escribir que el que se perdió una corrida entera. Hoy una prueba cubre los casos grandes. Falta la **frontera exacta**: si alguien cambia el margen o la corrida que se compara, el diagnóstico deja de avisar de un vigía caído o empieza a gritar de uno sano, y ninguna prueba lo ve. Esta tarea agrega esas pruebas.

## La regla que se prueba (así está en el código, no la cambies)
En `diagnostico.sh`, de `sec "15.` hasta el siguiente `sec "`, un `python3` lee `crontab -l`. Para cada línea activa:
- `ahora` = la hora actual en UTC, sin segundos. `corridas(horario)` = todas las corridas programadas hasta `ahora` en los últimos 70 días, de la más vieja a la más nueva.
- **`cs[-2]` es la penúltima corrida programada.** El log es `ruta` tras `>>` o `>`.
- `estado = "MUDO" if mtime < penultima - 60 else "ok"`. Es decir: MUDO si el log es más viejo que la penúltima corrida menos 60 segundos.
- Un log que no existe es `MUDO (no hay log)`. Con menos de dos corridas en 70 días (un trabajo anual) es `no medible`. Un log que no es una ruta absoluta o lleva `$`, comillas o `(` es `sin log`: nunca MUDO.
- La salida va ordenada con lo MUDO primero y termina con `--- N línea(s): X MUDA(S), Y sin log, Z no medibles`.

## PRUEBA DE HECHO
1. `node --test scripts/loops/diagnostico-mudo.test.mjs` en verde, y el comando `npm run test:jarvis-diagnostico` (lo creás en `package.json`) hace lo mismo.
2. El archivo nuevo es **independiente**: su propio ayudante que extrae la sección 15 del `diagnostico.sh` real y la corre con un `crontab` de mentira. Copiá el patrón de `diagnosticoLatidos()` de `scripts/loops/hermes-jarvis-aplicar.test.mjs` (~líneas 943-975), pero **cortá la sección en el siguiente `sec "`**, no en `sec "fin"`: así sigue andando el día que se agregue la sección 16. **No importes ese archivo de pruebas** (ejecuta sus pruebas al importarlo) y **no lo modifiques**.
3. Casos con el reloj controlado. Los logs se escriben con `utimesSync` relativos a la penúltima corrida que la prueba calcula desde su propio reloj. Si el minuto UTC cambió entre calcular y correr, repetí (hasta 3 veces) en vez de fallar:
   - a. `*/5 * * * *`: log a `penúltima - 58 s` → `ok`; a `penúltima - 62 s` → `MUDO`.
   - b. `0 * * * *` (cada hora): lo mismo, con la penúltima de la hora. Y un log de `última + 1 s` → `ok`.
   - c. **Faltó una sola:** log tocado entre la penúltima y la última corrida → `ok`. Un trabajo que falló una vez todavía no es MUDO.
   - d. Diario `30 10 * * *`: la penúltima depende de si ya pasaron las 10:30 UTC; calculala con `Date.UTC`. Log a `penúltima - 58 s` → `ok`; `- 62 s` → `MUDO`.
   - e. Log inexistente → `MUDO (no hay log)`.
   - f. Anual `0 5 1 1 *` → `no medible`, tenga o no log.
   - g. Log con fecha de **mañana** → `ok`, y el diagnóstico sale con código 0 (no se rompe).
   - h. Dos líneas, una MUDA y una sana: la MUDA va **primero** y el resumen final dice `1 MUDA(S)`.
4. **Pruebas de mutación dentro del mismo archivo.** Un caso que corre la sección con una copia modificada del texto y exige que el veredicto de la frontera **cambie**:
   - `penultima - 60` → `penultima + 60`;
   - `penultima - 60` → `penultima`;
   - `cs[-2]` → `cs[-1]` (compararía con la última corrida, no con la penúltima).
   Cada mutación tiene que hacer que al menos uno de los casos a-d dé otro veredicto. Si alguna no cambia nada, la prueba de la frontera no sirve: reportalo.
5. `npm run test:jarvis-aplicar`, `npm run test:docs-hygiene` y `npm run test:herramientas-desplegadas` siguen en verde (no los tocaste).

## REGLA DE PARADA
- **No modifiques `diagnostico.sh`**, ni `hermes-jarvis-aplicar.test.mjs`, ni nada de `deploy/`. Si encontrás un error real en la regla, no lo arregles: describilo en el resumen con el caso que lo muestra.
- Sin red y sin tocar el crontab real: el `crontab` es un ejecutable falso en un directorio temporal que pasás por `PATH`.
- Dependencias nuevas: ninguna (`node:test`, `node:assert`, `node:fs`, `node:child_process`).
- Si la sección 15 no está en `diagnostico.sh` (la rama no tiene #194), **pará** y decilo: la tarea se lanzó antes de tiempo.
- Si una prueba es inestable por el reloj, no la silencies ni le subas la tolerancia: reportalo.

## ARCHIVOS
Puede crear: `scripts/loops/diagnostico-mudo.test.mjs`.
Puede editar: `package.json` (solo agregar `"test:jarvis-diagnostico": "node --test scripts/loops/diagnostico-mudo.test.mjs"` junto a `test:jarvis-aplicar`) y `.github/workflows/hermes-jarvis-pruebas.yml` (solo agregar `test:jarvis-diagnostico` a la lista de `for s in …`).
Todo lo demás, prohibido.

## Contexto mínimo
- Onia (Bolivia) tiene un VPS con un `crontab` de root. `diagnostico.sh` corre todos los días (workflow `hermes-qa-diario.yml`) y solo lee: ni escribe ni llama a ningún modelo.
- «MUDO» significa que el trabajo dejó de escribir y nadie se enteró; es lo que esta sección existe para ver.
- Estilo: JavaScript de módulos, sin dependencias, funciones chicas, nombres en español como en el resto de `scripts/loops/*.test.mjs`.
