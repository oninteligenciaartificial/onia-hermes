---
id: plataforma-V1
carril: plataforma
estado: pendiente   # pendiente | lanzada | PR | hecha | bloqueada
modelo: gpt-6.1-sol # hay que decidir falsos positivos con ejemplos reales; no es puramente mecánico
repo: onia-platform
rama: codex/voseo-segunda-persona
base: master        # medido sobre master fd72cd55 (11-oct); si #148, #149, #152 y #153 ya entraron, parte de ahí
pr:
escrita: 2026-10-11 por Hermes-Jarvis (nube)
actualizada: 2026-10-11 por Hermes-Jarvis (nube)
nota: Contrato de Plataforma escrito por el carril QA tras revisar cuatro PRs seguidos de «de usted» (#148, #149, #152, #153). Solo agrega un segundo gate de pruebas con su propia línea base: no cambia texto de producto ni la línea base actual.
---
# V1 · El gate de voseo no ve «tu», «vas», «aprobaste» ni «elige»: un segundo gate para la segunda persona

Sos Codex. Trabajás SOLO en esta carpeta: un worktree de `onia-platform` que creó la madre, en la rama `codex/voseo-segunda-persona`.
- No uses git: ni consultas, ni cambio de rama, ni commits. La madre verifica la rama y revisa el diff.
- Si ya hay cambios en la carpeta, una corrida anterior se cortó: revisá los archivos y seguí desde ahí.
- Nadie contesta preguntas mientras corrés. Decidí con este documento y el código; lo que no puedas decidir, anotalo en el resumen final.
- Sin push, sin `npm install` (usá el `node_modules` que la madre te dejó enlazado), sin producción, sin red. NO commitees.
- **Escribí los archivos en UTF-8 sin BOM y no cambies ningún carácter que no sea ASCII por `?`.** La edición en Windows ya rompió así acentos en dos tareas del 11-oct. Al terminar, buscá `?` entre letras y un BOM al inicio en cada archivo que tocaste.

## META
`__tests__/voseo-ratchet.ts` cuenta, por archivo de `app/`, `components/` y `lib/`, las formas de **voseo con tilde** (`tenés`, `probá`, `elegí`… y `vos`) dentro de textos que ve el cliente, y `__tests__/voseo-ratchet.test.ts` exige que ese número solo pueda bajar (`__tests__/voseo-ratchet.linea-base.json`). El producto le habla de **usted** al dueño del negocio. Cuatro PRs seguidos que pasaron textos a usted (#148, #149, #152, #153) dejaron restos que el gate da por buenos, **porque no son voseo con tilde**. Casos reales, medidos el 11-oct sobre esos PRs (archivo:línea en la cabeza del PR):
```
app/(dashboard)/agents/agentes-pantalla.tsx:94   "Todavía nada este mes. Acá vas a ver lo que propongan y cuánto aprobaste."   → «vas», «aprobaste»
lib/agenda/crear-cita.ts:126                     "Ese horario ya no está disponible. Por favor elige otro."                     → «elige» (tuteo sin tilde)
app/(dashboard)/dashboard/page.tsx:324           "Tu agente"                                                                    → «Tu»
app/(dashboard)/dashboard/textos-del-dia.ts:33   `Hoy no tenés ${citas} agendadas.`                                              → ya lo ve el gate actual
lib/clientes/baja.ts:469 / FichaVista.tsx:417    «quedan para su contabilidad» / «Todavía no le cobró nada»                     → ambiguos con usted (NO son de este gate)
```
Esta tarea agrega **un segundo gate**, con su propia línea base, para la segunda persona que el primero no ve. **No se toca el primero.**

## Qué se agrega
Archivos nuevos (junto a los del primero):
- `__tests__/voseo-ratchet-segunda-persona.ts` — la lógica.
- `__tests__/voseo-ratchet-segunda-persona.test.ts` — las pruebas del gate.
- `__tests__/voseo-ratchet-segunda-persona.linea-base.json` — la deuda actual por archivo (solo archivos con cuenta > 0; el mismo formato y la misma regla «solo puede bajar» que el primero: reutilizá `compararLineaBase`, `contarArchivos`-estilo y el recorrido de `app/`, `components/` y `lib/`, que excluye `app/dev`, `node_modules` y `*.test.*`).

### Qué cuenta (y qué NO)
Se cuenta solo dentro de los mismos nodos que el primero (cadenas, texto JSX y fragmentos de plantilla), nunca en comentarios, identificadores ni expresiones regulares. Tres listas, **explícitas** (nada de regex genéricas por terminación):
1. **Posesivos y pronombres de tú** (en cualquier lugar de la cadena, con límites de palabra Unicode como el primero: `(?<![\p{L}\p{N}_])…(?![\p{L}\p{N}_])`): `tu`, `tus`, `tuyo`, `tuya`, `tuyos`, `tuyas`, `contigo`, `para ti`, `a ti`.
2. **Formas de segunda persona que no existen en usted** (también en cualquier lugar): `vas`, `eres`, `tienes`, `puedes`, `quieres`, `sabes`, `haces`, `estás`, `necesitas`, `debes`, `verás`, `podrás`, `tendrás`, `recibirás`, `aprobaste`, `pagaste`, `agregaste`, `creaste`, `enviaste`, `guardaste`, `hiciste`, `elegiste`, `abriste`, `cargaste`, `borraste`, y los enclíticos de voseo `reactivala`, `reactivalo`, `avisame`, `decime`, `mostrame`, `mandame`, `ayudame`, `contame`, `escribime`, `llamame`, `dejame`.
3. **Imperativo de tú, solo al INICIO de una frase**, porque en medio de una frase la misma palabra suele ser tercera persona («el sistema guarda los cambios» es correcto): la cadena, o el texto que sigue a `. `, `: `, `¡`, `¿`, o a un salto de línea, empieza (ignorando espacios y un `Por favor `) con una de estas formas, seguida de un espacio o del fin: `elige`, `ingresa`, `revisa`, `escribe`, `selecciona`, `agrega`, `guarda`, `confirma`, `completa`, `abre`, `cierra`, `sube`, `baja`, `pulsa`, `haz`, `ve`, `pon`, `mira`, `busca`, `usa`, `prueba`, `intenta`, `espera`, `verifica`, `corrige`, `cambia`, `descarga`, `elimina`, `cancela`, `crea`, `marca`, `toca`, `activa`, `desactiva`, `edita`, `importa`, `envía`, `acepta`, `continúa`, `inicia`, `compra`, `paga`, `reserva`, `recarga`, `vuelve`, `regístrate`, `inténtalo`, `revísalo`.
**No** cuentes nunca: `está`, `esta`, `usted`, `su`, `sus`, `le`, `te` (demasiado ambiguos), ni nada dentro de una palabra más larga (`tuvo`, `intuición`, `atún`, `estudio`, `vasto`, `evasión`, `ti` suelto).

### Línea base
Generala **corriendo el propio contador sobre el árbol actual** (un script de una vez, `scripts/voseo-segunda-persona-linea-base.mjs`, que escribe el JSON ordenado igual que el primero; después de generarla, lo dejás en el repo: lo usa la madre para actualizarla hacia abajo cuando un PR pase textos a usted). No edites la línea base a mano. **Orden de las claves (medido el 11-oct, E29):** «ordenado igual que el primero» es el orden de `localeCompare(b, "en")` de `contarArchivos` (`__tests__/voseo-ratchet.ts:55`), no el ASCII de `Object.keys().sort()`; el script debe reutilizar esa misma función para ordenar. Si el segundo gate entra mientras otro PR regenera la primera línea base, un orden distinto vuelve a hacerlos chocar.

## PRUEBA DE HECHO
1. `npx vitest run __tests__/voseo-ratchet-segunda-persona.test.ts` en verde (si el entorno no corre vitest, decilo y corré las funciones con `node --experimental-strip-types` como sustituto, anotando la salida). La suite completa del repo sigue como estaba: **no cambia ningún otro archivo de prueba ni la línea base del primer gate**.
2. **Positivos reales** (cada uno cuenta 1 con su forma indicada, como cadena y como texto JSX): los cinco primeros ejemplos de arriba (sin el de `textos-del-dia`, que ya cuenta el primer gate), más `"Elige un horario."`, `"Por favor elige otro."`, `"Ingresa con su correo"`, `"Hola, ¿qué quieres hacer hoy?"`, `"Revisa tus datos"` (cuenta 2: `Revisa` al inicio y `tus`).
3. **Negativos que NO deben contar** (falsos positivos conocidos): `"El sistema guarda los cambios."`, `"La agenda confirma la cita."`, `"Este espacio está libre."`, `"Su cita se canceló."`, `"El negocio tuvo 3 ventas."`, `"Introducción a la intuición"`, `"Atún y estudio"`, `"Revise sus datos"`, `"Elija un horario"`, `"Ingrese con su correo"`, y los mismos textos dentro de un comentario `// Elige otro`, un identificador `const elige = 1` y una expresión regular `/vas a/`.
4. **El gate funciona:** una copia del árbol de prueba (en `os.tmpdir()`) con un archivo nuevo que trae `"Por favor elige otro."` hace fallar `compararLineaBase` con «SUBIÓ»; bajar una cuenta exige actualizar la línea base («BAJÓ»); un archivo nuevo con cuenta 0 pasa. Igual que las pruebas 1-6 del primer gate (`__tests__/voseo-ratchet.test.ts`): leelas y copiá su estilo, sin importarlo.
5. **El gate real pasa sobre el árbol actual** (la línea base recién generada coincide con el conteo). Pegá en el resumen: cuántos archivos tienen cuenta > 0, la suma total y los diez archivos con más cuenta.
6. **Los 5 casos de arriba aparecen en la línea base** con cuenta ≥ 1 en sus archivos (`agentes-pantalla.tsx`, `crear-cita.ts`, `dashboard/page.tsx`) **si la rama que te dejó la madre incluye #152 y #153**; si no, anotá cuáles faltan.
7. **Mutación:** quitá `vas` de la lista 2 y la prueba de «Acá vas a ver…» tiene que fallar; quitá el límite de inicio de frase de la lista 3 y la prueba del negativo `"El sistema guarda los cambios."` tiene que fallar. Comprobalo y anotalo.

## REGLA DE PARADA
- **No cambies ni una línea de texto de producto**, ni la línea base ni el código del primer gate. Si un archivo del primer gate tiene que cambiar para reutilizar algo, **exportá** lo que necesites desde tu archivo nuevo copiándolo; no lo modifiques.
- Si el detector da más de ~1.500 cuentas en total en `master`, **pará**: seguramente una lista captura demasiado; revisá los diez archivos con más cuenta y quitá la forma que los explica **antes** de generar la línea base (y anotalo).
- Sin dependencias nuevas (`typescript` ya está).
- Nada de red ni de producción.

## ARCHIVOS
Puede crear: `__tests__/voseo-ratchet-segunda-persona.ts`, `__tests__/voseo-ratchet-segunda-persona.test.ts`, `__tests__/voseo-ratchet-segunda-persona.linea-base.json` y `scripts/voseo-segunda-persona-linea-base.mjs`.
Todo lo demás, prohibido.

## Contexto mínimo
- Onia (Bolivia) vende un sistema de gestión por rubro. **Regla de la casa:** a los clientes y prospectos se les habla de **usted** (el dueño de la clínica o del comercio); en el chat con el dueño de la empresa y en su marca personal sigue el voseo.
- El gate actual (`voseo-ratchet`) tiene el mismo diseño que se repite: una lista explícita y una línea base que solo baja. Este segundo gate **no** pretende detectar todo el español de tú; pretende cerrar los restos que ya aparecieron en PRs reales.
- Lección del día (dos veces): el ejemplo de una prueba sale del sistema real. Por eso los casos positivos salen de archivos y líneas reales de #148, #149, #152 y #153.
