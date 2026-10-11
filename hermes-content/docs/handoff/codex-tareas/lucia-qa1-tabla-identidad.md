---
id: LUCIA-QA1
carril: lucia
estado: pendiente
modelo: gpt-6-luna  # mecánico; la madre lo lanza con esfuerzo low: scripts/codex-tarea.sh <esta tarea> <carpeta> gpt-6-luna low
repo: onia-hermes
rama: codex/lucia-qa1  # la crea la madre al lanzar
base: main
pr:
escrita: 2026-10-11 por Lucía (nube, session_01XSzFcs1k18ijqjSHGjnzD4)
actualizada: 2026-10-11 por Lucía (nube, session_01XSzFcs1k18ijqjSHGjnzD4)
nota: Paso 6 de la orden S03 (hermes-content/docs/research/2026-10-11-harness-qa/S03-orden-lucia.md, rama origin/claude/arranque-nueva-madre-ba386e, commit 2b059484). Campo y umbral fijados abajo.
---
# LUCIA-QA1 · Tabla de identidad desde el JSON de ArcFace

Sos Codex. Trabajás SOLO en esta carpeta: un worktree de `onia-hermes` que creó la madre, en la rama `codex/lucia-qa1`.
- No uses git: ni consultas, ni cambio de rama, ni commits. La madre verifica la rama y revisa el diff.
- Si ya hay cambios en la carpeta, una corrida anterior se cortó: revisá los archivos y seguí desde ahí.
- Nadie contesta preguntas mientras corrés. Decidí con este documento y el código; lo que no puedas decidir, anotalo en el resumen final.
- Sin push, sin `npm install`, sin producción, sin red. NO commitees: la madre revisa el diff y commitea.

## META
`scripts/face_identity_qa.py` imprime un JSON que hoy cada sesión lee a ojo y el piso de 0,70 vive solo en `hermes-content/docs/cola/lucia-diario/FLUJO.md:28` («≥ 0,70»).
Hay que dar una herramienta que lea ese JSON, imprima una tabla markdown con el veredicto de cada imagen y salga con un código que sirva de gate. Solo Node (≥ 22) y su librería estándar.

## Entrada: el JSON real (medido el 11-oct; fuente: `scripts/face_identity_qa.py` líneas 228-252)
Se lee de un archivo (primer argumento) o de stdin (sin argumento o con `-`). Estructura:
- `model` (texto), `arcface_mean_std` (`[media, desvío]`).
- `refs_internal`: `{ pairwise_mean, pairwise_min, leave_one_out_min, matrix }`.
- `negatives_max`: número **o `null`** (null cuando el manifest no trae caras negativas: no es un error).
- `images`: `{ "<nombre>": { group: "refs" | "tests", faces, det_score, face_px, img, flip_self } }`. Una imagen sin cara detectada puede traer `error` y no tener entrada en `scores`.
- `scores`: `{ "<nombre>": { centroid, mean_ref, min_ref, max_ref } }`.

**El campo que se compara es `scores.<imagen>.centroid`. El umbral es 0,70 y va en una constante nombrada `PISO = 0.70`** (sin opción de línea de comandos: está fijado, no se discute por corrida).
Un valor **igual** a 0,70 está bien (se compara `>=`).

## Salida (stdout, markdown)
1. **Cabecera:** `Piso: 0,70 (FLUJO.md:28)`, `refs_internal.leave_one_out_min` y `negatives_max` (o «sin negativas» si es `null`).
2. **Tabla de las imágenes del grupo `tests`**, en el orden del JSON: `| Imagen | Parecido (centroid) | Cara (px) | Veredicto |`.
   Veredicto: `OK` si `centroid >= 0.70`; `BAJO` si es menor; `SIN CARA` si la imagen no tiene `scores` o trae `error`. Cuando `face_px < 200`, se agrega « · cara < 200 px: poco confiable»
   (es la regla de `.claude/skills/lucia/scripts/face-gate.sh` y de la skill `lucia`: bajo ~200 px el puntaje es indicativo y se mira a ojo; la nota **no cambia el veredicto**).
3. **Tabla aparte, informativa, de las imágenes del grupo `refs`.** El `centroid` de una referencia es **leave-one-out** (se mide contra las otras 7). Se listan con su valor y la marca
   `ref bajo el piso` si es < 0,70. **No cuentan para el código de salida.** Medido: `R4_casi_perfil` da 0,698, o sea debajo del piso contra sus compañeras (es el perfil); si contara, la
   herramienta saldría siempre en rojo.
4. **Resumen:** `N tests · B bajo el piso · S sin cara`.

Números con 3 decimales y punto, como en el JSON.

## Código de salida
- `0`: ningún test queda `BAJO` ni `SIN CARA`.
- `1`: al menos un test queda `BAJO` o `SIN CARA`.
- `2`: la entrada no sirve (JSON inválido, o falta `images` o `scores`). Mensaje a stderr con la clave que falta.

Estructura y salida separadas: la lógica en una función exportada (`armarTabla(json)` → `{ markdown, codigo }`) y el CLI como una capa fina encima.

## PRUEBA DE HECHO
`node --test scripts/lucia-qa-tabla.test.mjs` en verde, con fixtures **inventados** escritos dentro del test (sin caras reales, sin imágenes, sin URLs). Casos numerados:
1. Dos tests con 0,79 y 0,82 y una referencia: salida con las dos filas `OK`, código 0.
2. Un test con 0,356: aparece `BAJO`, el resumen dice `1 bajo el piso`, código 1.
3. Un test con `face_px: 150` y 0,78: `OK` con la nota de cara chica, código 0.
4. Un test cuyo nombre está en `images` pero no en `scores` (o trae `error`): `SIN CARA`, código 1.
5. Una referencia con 0,698 y todos los tests ≥ 0,70: se lista con `ref bajo el piso` y el código es 0.
6. `negatives_max: null`: la cabecera dice «sin negativas» y no falla.
7. Un test con exactamente 0,700: `OK`.
8. JSON inválido, y JSON sin `scores`: código 2 y mensaje a stderr.
9. Entrada por stdin (un caso que lance el CLI con `child_process`).

Corrida real (la hace la madre después, no Codex, porque el JSON real vive en el repo y Codex no lo necesita para el test):
`node scripts/lucia-qa-tabla.mjs videos/lucia-g5-v2/qa/arcface-madre-11oct.json`. **Resultado esperado:** 18 tests; 6 `BAJO` (las 6 imágenes `f-e3`, el café de Kling O1 Image que perdió la cara, ≈ 0,35: está bajo el piso a propósito);
0 `SIN CARA`; código de salida **1**; las 6 imágenes del gancho (181 a 186 px) llevan la nota «cara < 200 px»; las 8 referencias se listan aparte y `R4_casi_perfil` lleva `ref bajo el piso`. Que salga 1 ahí **no es un fallo de la herramienta**.

## REGLA DE PARADA
- Si la estructura de un JSON real no coincide con la de arriba (claves distintas, `scores` en otro lugar), **parar y reportar** qué clave no coincide, en vez de adivinar.
- No agregues dependencias (`package.json`, `node_modules`) ni opciones de línea de comandos no pedidas (el umbral está fijo).
- No toques `scripts/face_identity_qa.py` ni ningún JSON del repo.
- No leas ni imprimas ninguna credencial.

## ARCHIVOS
Solo estos dos; todo lo demás, prohibido:
- `scripts/lucia-qa-tabla.mjs`
- `scripts/lucia-qa-tabla.test.mjs`

En el resumen final, para la madre: qué casos pasan, qué decisiones tomaste y qué no pudiste decidir.
