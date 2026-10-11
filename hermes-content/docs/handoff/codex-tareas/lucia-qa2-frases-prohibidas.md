---
id: LUCIA-QA2
carril: lucia
estado: pendiente
modelo: gpt-6-luna  # mecánico; la madre lo lanza con esfuerzo low: scripts/codex-tarea.sh <esta tarea> <carpeta> gpt-6-luna low
repo: onia-hermes
rama: codex/lucia-qa2  # la crea la madre al lanzar
base: main
pr:
escrita: 2026-10-11 por Lucía (nube, session_01XSzFcs1k18ijqjSHGjnzD4)
actualizada: 2026-10-11 por Lucía (nube, session_01XSzFcs1k18ijqjSHGjnzD4) — v2: suma «agenda llena» (LUCIA.md §0, línea 20), que Codex detectó con su regla de parada
nota: Paso 7 de la orden S03 (hermes-content/docs/research/2026-10-11-harness-qa/S03-orden-lucia.md, rama origin/claude/arranque-nueva-madre-ba386e, commit 2b059484). La lista ya está contrastada con LUCIA.md §0 (ver abajo); v2 suma «agenda llena», que estaba en la línea 20 y quedó fuera de la v1.
---
# LUCIA-QA2 · Frases prohibidas de Lucía y de la venta, en cualquier texto

Sos Codex. Trabajás SOLO en esta carpeta: un worktree de `onia-hermes` que creó la madre, en la rama `codex/lucia-qa2`.
- No uses git: ni consultas, ni cambio de rama, ni commits. La madre verifica la rama y revisa el diff.
- Si ya hay cambios en la carpeta, una corrida anterior se cortó: revisá los archivos y seguí desde ahí.
- Nadie contesta preguntas mientras corrés. Decidí con este documento y el código; lo que no puedas decidir, anotalo en el resumen final.
- Sin push, sin `npm install`, sin producción, sin red. NO commitees: la madre revisa el diff y commitea.

## META
Las frases que Lucía nunca puede decir (que es del rubro, que tiene pacientes, un testimonio) y los carteles de «obra» que la venta nunca exhibe viven repartidos en tres documentos y en un `grep-prohibidas.mjs` por cada pieza de video.
Hace falta un escáner de texto, de una sola lista con su fuente, que se pueda correr sobre cualquier guion, pie o documento y diga archivo y línea de cada coincidencia. Solo Node (≥ 22) y su librería estándar.

## La lista (única, en una constante al principio del script, cada entrada con su `fuente`)
Contrastada el 11-oct con `hermes-content/references/modelos/lucia/LUCIA.md` §0 (líneas 18-20), `hermes-content/docs/LUCIA_COMO_SE_USA.md` §6 y la regla «La venta nunca exhibe obra» de `CLAUDE.md`. **La lista de la orden S03 era una parte:** LUCIA.md §0 suma cinco frases más (las cuatro de la primera mano y «agenda llena», línea 20). Es la unión:

| Frase (se detectan también sus variantes de mayúsculas, tildes y plural) | Fuente |
|---|---|
| «soy odontóloga», «hoy soy odontóloga», «como odontóloga» | LUCIA.md §0; LUCIA_COMO_SE_USA §6 |
| «soy doctora» | LUCIA.md §0 |
| «mis pacientes» | LUCIA.md §0; LUCIA_COMO_SE_USA §6 |
| «mi consultorio» | LUCIA.md §0; LUCIA_COMO_SE_USA §6 |
| «mi estudio» | LUCIA.md §0 |
| «testimonio» (y «testimonios») | LUCIA.md §0; LUCIA_COMO_SE_USA §6 |
| «agenda llena» (resultado prometido) | LUCIA.md §0, línea 20 («Tampoco … resultados prometidos («agenda llena»)») |
| «muy pronto», «en construcción», «beta», «próximamente» | CLAUDE.md, «La venta nunca exhibe obra» |

Reglas de coincidencia: sin distinguir mayúsculas ni tildes (normalizar con `String.prototype.normalize('NFD')` quitando marcas diacríticas, en el texto y en la lista); con uno o más espacios entre las palabras de una frase (`agenda   llena` coincide) y con límite de palabra, de modo que **«beta» no coincida dentro de «alfabeta»** ni «testimonio» dentro de otra palabra.
No se agregan palabras sueltas como «paciente» o «clínica»: los documentos del rubro las usan legítimamente. Los gates de pantalla, pie y voz de cada pieza (`videos/lucia-g*-v2/scripts/grep-prohibidas.mjs`, que traen además «el mejor», «recomiendo» y los nombres de herramientas permitidos) son otra cosa y **no se tocan**.

## Qué hace el script `scripts/lucia-prohibidas.mjs`
- **Sin argumentos:** recorre `hermes-content/docs/cola/lucia-diario/` de forma recursiva, solo `.md` y `.txt`.
- **Con argumentos:** cada uno es un archivo o una carpeta (mismo recorrido recursivo) que se suma o reemplaza al recorrido por defecto: si se pasa al menos un argumento, **solo se recorren los argumentos**.
- Imprime una línea por coincidencia: `archivo:línea: «frase» → <la línea, recortada a 160 caracteres>`, y al final un resumen por frase y por archivo.
- Ignora `.git`, `node_modules` y los archivos que no se puedan leer como texto (los lista como «omitidos», no falla).

**Código de salida (decidido aquí, porque los documentos de reglas citan las frases para prohibirlas):**
- Recorrido por defecto (sin argumentos): **informativo**, sale `0` aunque haya coincidencias. Esos documentos (`PLAN.md`, `FLUJO.md`, los guiones) enuncian la regla y la citan, así que las coincidencias esperadas son de «regla citada», no de uso.
- Con argumentos (un pie, un guion, una pieza nueva): sale `1` si hay **alguna** coincidencia, `0` si no hay ninguna.
- `2` si un argumento no existe o no se puede leer.

La lógica en una función exportada (`escanear(texto, nombre)` → coincidencias) y el CLI como capa fina encima.

## PRUEBA DE HECHO
1. `node --test scripts/lucia-prohibidas.test.mjs` en verde, con fixtures **inventados** creados dentro del test (carpeta temporal con `fs.mkdtemp`, sin leer documentos reales). Casos:
   1. «Hoy soy odontóloga» en la línea 3 de un archivo: una coincidencia, con archivo y `:3`.
   2. «PRÓXIMAMENTE», «proximamente» y «Próximamente»: las tres coinciden (mayúsculas y tildes).
   3. «alfabeta» no coincide; «beta» suelta sí.
   4. «testimonios» coincide; «un testimonio de cliente» coincide.
   5. Un archivo limpio: cero coincidencias.
   6. El mismo archivo con una coincidencia, pasado como argumento: código 1; recorrido por defecto sobre una carpeta que lo contiene: código 0.
   7. Un argumento que no existe: código 2.
   8. Un `.json` o una imagen en la carpeta: se ignoran/omiten sin fallar.
   9. «Te dejo la agenda llena» y «AGENDA   LLENA» (espacios repetidos y mayúsculas): ambas coinciden, con la frase «agenda llena» y la fuente `LUCIA.md §0`; «agenda llenar» no coincide (límite de palabra).
2. Después del test, correr el script **sin argumentos** y **reportar el resultado completo** (no corregir los documentos). **Esperado, medido el 11-oct con grep (v2, con «agenda llena»):** 13 líneas con coincidencia repartidas en 11 archivos de `hermes-content/docs/cola/lucia-diario/` (una por archivo, salvo `FLUJO.md` y `PLAN.md` con dos cada uno: la de «agenda llena», FLUJO.md:83 y PLAN.md:44, ambas regla citada), todas en texto que enuncia la regla. Si el número difiere mucho o ves una que parece uso real (Lucía diciéndolo en primera persona), marcala en el resumen.
3. Correr el script **con** los cuatro pies de las v2 (`videos/lucia-g2-v2/pie.txt`, `videos/lucia-g3-v2/pie.txt`, `videos/lucia-g4-v2/pie.txt`, `videos/lucia-g5-v2/pie.txt`): **esperado, 0 coincidencias y código 0** (medido con grep el 11-oct). Esa corrida la repite la madre.

## REGLA DE PARADA
- Antes de correr nada, leé `hermes-content/references/modelos/lucia/LUCIA.md` §0 (líneas 14-20). Si hay una frase prohibida ahí que **no está en la tabla de arriba**, **parar y reportarla**. (Que LUCIA.md §0 tenga más frases que la orden S03 ya está resuelto aquí, incluida «agenda llena»: no es motivo de parada. Si encontrás otra que NO esté en la tabla, ahí sí.)
- Si un archivo del recorrido por defecto no se puede leer o es enorme (más de 2 MB), omitirlo y listarlo; no fallar.
- No agregues dependencias ni opciones de línea de comandos no pedidas. No corrijas ni edites ningún documento escaneado.
- No leas ni imprimas ninguna credencial.

## ARCHIVOS
Solo estos dos; todo lo demás, prohibido:
- `scripts/lucia-prohibidas.mjs`
- `scripts/lucia-prohibidas.test.mjs`

En el resumen final, para la madre: qué casos pasan, el resultado completo de la corrida sin argumentos, qué decisiones tomaste y qué no pudiste decidir.
