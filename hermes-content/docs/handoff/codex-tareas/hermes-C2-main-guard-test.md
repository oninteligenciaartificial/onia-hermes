---
id: hermes-C2
carril: hermes
estado: pendiente   # pendiente | lanzada | PR | hecha | bloqueada
modelo: gpt-6-luna  # mecánico: un archivo de pruebas sobre un workflow, sin tocar el workflow
repo: onia-hermes
rama: codex/hermes-c2-main-guard-test
base: main          # con #194 ya mergeado: `hermes-qa-diario.yml` vive ahí
pr:
escrita: 2026-10-11 por Hermes-Jarvis (nube)
actualizada: 2026-10-11 por Hermes-Jarvis (nube)
nota: Se lanza DESPUÉS del merge de #194 (el workflow no está en main hasta entonces).
---
# C2 · El QA diario falla ANTES de tocar el VPS si corre desde otra rama

Sos Codex. Trabajás SOLO en esta carpeta: un worktree de `onia-hermes` que creó la madre, en la rama `codex/hermes-c2-main-guard-test`.
- No uses git: ni consultas, ni cambio de rama, ni commits. La madre verifica la rama y revisa el diff.
- Si ya hay cambios en la carpeta, una corrida anterior se cortó: revisá los archivos y seguí desde ahí.
- Nadie contesta preguntas mientras corrés. Decidí con este documento y el código; lo que no puedas decidir, anotalo en el resumen final.
- Sin push, sin `npm install`, sin producción, sin red. NO commitees: la madre revisa el diff y commitea.

## META
`.github/workflows/hermes-qa-diario.yml` corre todos los días en el runner propio del VPS y entra por SSH como root a **leer** (`diagnostico.sh`). A mano también se puede disparar, pero **solo desde `main`**: desde otra rama correría un `diagnostico.sh` que alguien pudo cambiar. Esa defensa es un paso («Solo desde main») que tiene que ir **antes** del paso que escribe la llave SSH y del que se conecta. Hoy una prueba solo busca el texto del paso con una expresión regular. Esta tarea agrega una prueba que **ejecuta** ese paso y comprueba el **orden** de los pasos.

## Cómo está armado el workflow (no lo cambies)
Un solo job `vps` con estos pasos, en este orden: «Checkout …», «Solo desde main», «Llave SSH del VPS», «Ejecutar diagnostico (24 h)», «Borrar la llave». El paso «Solo desde main» es:
```
run: |
  [ "$GITHUB_REF" = refs/heads/main ] || { echo "el QA diario corre solo desde main (pediste $GITHUB_REF)"; exit 1; }
```
La llave (`secrets.ONIA_VPS_SSH_KEY`) se usa recién en los dos pasos siguientes.

## PRUEBA DE HECHO
1. `node --test scripts/loops/qa-diario-guarda.test.mjs` en verde, y `npm run test:qa-diario-guarda` (lo creás en `package.json`) hace lo mismo.
2. **El paso se ejecuta.** El archivo de prueba separa los pasos del YAML **sin librería de YAML** (el archivo es simple: cada paso empieza con `      - name: `), toma el `run:` del paso «Solo desde main» y lo corre con `bash -e` y el entorno que se le da:
   - `GITHUB_REF=refs/heads/otra-rama` → código 1, y la salida dice `el QA diario corre solo desde main (pediste refs/heads/otra-rama)`;
   - `GITHUB_REF=refs/heads/main` → código 0;
   - `refs/heads/main-2`, `refs/heads/main/x`, `refs/pull/7/merge`, `refs/tags/v1` → código 1 (nadie se cuela por un prefijo);
   - sin `GITHUB_REF` (variable ausente) o vacía → código 1.
3. **El orden.** Una función `revisar(textoDelWorkflow)` devuelve una lista de problemas (vacía = bien) y comprueba: (a) existe un paso «Solo desde main» con la comparación contra `refs/heads/main` y `exit 1`; (b) **ningún paso anterior a él** menciona `secrets.`, `ssh `, `vps_key`, `ONIA_VPS_SSH_KEY` ni `root@`; (c) los pasos que sí los usan vienen **después**; (d) el paso de la guarda no tiene `continue-on-error`, ni `if:` que lo pueda saltear.
4. `revisar()` sobre el workflow real devuelve `[]`.
5. **Mutación.** Cuatro copias en memoria del texto, cada una tiene que dar al menos un problema: (i) sin el paso «Solo desde main»; (ii) el paso movido **después** de «Llave SSH del VPS»; (iii) `|| { echo …; exit 1; }` cambiado por `|| true`; (iv) el paso con `continue-on-error: true`.
6. `npm run test:jarvis-aplicar` y `npm run test:docs-hygiene` siguen en verde. La prueba existente del workflow dentro de `hermes-jarvis-aplicar.test.mjs` **no se toca**: esta la complementa.

## REGLA DE PARADA
- **No modifiques `hermes-qa-diario.yml`**, ni ningún otro workflow salvo agregar el nombre de la prueba nueva a la lista de `hermes-jarvis-pruebas.yml`. Si encontrás un hueco real en la guarda (algo que `revisar()` debería marcar y el workflow tiene), **no lo arregles**: describilo en el resumen con la línea.
- No ejecutes nada que no sea el `run:` de ese único paso y `node`. Sin `ssh`, sin red, sin leer `secrets`.
- Sin dependencias nuevas.
- Si `hermes-qa-diario.yml` no existe en la rama (no está #194), **pará** y decilo.

## ARCHIVOS
Puede crear: `scripts/loops/qa-diario-guarda.test.mjs`.
Puede editar: `package.json` (solo agregar `"test:qa-diario-guarda": "node --test scripts/loops/qa-diario-guarda.test.mjs"` junto a `test:jarvis-aplicar`) y `.github/workflows/hermes-jarvis-pruebas.yml` (solo agregar `test:qa-diario-guarda` a la lista de `for s in …`).
Todo lo demás, prohibido.

## Contexto mínimo
- GitHub ejecuta cada `run:` con `bash -e {0}`: un comando que falla corta el paso y el trabajo no sigue. Por eso un `exit 1` en el segundo paso evita que se escriba la llave y que se abra el SSH.
- `GITHUB_REF` vale `refs/heads/<rama>` cuando corre desde una rama, `refs/pull/<n>/merge` en un pull request y `refs/tags/<tag>` en una etiqueta.
- El VPS es de producción y el SSH entra como root: por eso la prueba verifica el orden y no solo el texto.
- Estilo: JavaScript de módulos, sin dependencias, funciones chicas, nombres en español.
