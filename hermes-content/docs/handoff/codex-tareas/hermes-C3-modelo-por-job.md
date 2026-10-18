---
id: hermes-C3
carril: hermes
estado: pendiente   # pendiente | lanzada | PR | hecha | bloqueada
modelo: gpt-6.1-sol # cambia un script que corre como root en el VPS (solo lee): la madre lo revisa fuerte
repo: onia-hermes
rama: codex/hermes-c3-modelo-por-job
base: main          # con #194 ya mergeado: `diagnostico.sh` cambia ahí y esta tarea parte de esa versión
pr:
escrita: 2026-10-11 por Hermes-Jarvis (nube)
actualizada: 2026-10-11 por Hermes-Jarvis (nube)
nota: Se lanza DESPUÉS del merge de #194 (#194 también cambia `diagnostico.sh`) y, si se puede, después de C1 (C1 solo agrega pruebas).
---
# C3 · El diagnóstico dice qué modelo usa cada trabajo y cada cuánto corre, sin llamar a ningún modelo

Sos Codex. Trabajás SOLO en esta carpeta: un worktree de `onia-hermes` que creó la madre, en la rama `codex/hermes-c3-modelo-por-job`.
- No uses git: ni consultas, ni cambio de rama, ni commits. La madre verifica la rama y revisa el diff.
- Si ya hay cambios en la carpeta, una corrida anterior se cortó: revisá los archivos y seguí desde ahí.
- Nadie contesta preguntas mientras corrés. Decidí con este documento y el código; lo que no puedas decidir, anotalo en el resumen final.
- Sin push, sin `npm install`, sin producción, sin red. NO commitees: la madre revisa el diff y commitea.

## META
Hoy nadie sabe, sin entrar al VPS, **qué modelo gasta cada trabajo** de Hermes ni cada cuánto corre. Es el dato que falta para decidir qué modelo conviene en cada pieza (la regla de la casa es: no bajar la calidad donde importa ni gastar un modelo grande donde no hace falta). El diagnóstico diario (`hermes-content/deploy/hermes-jarvis/diagnostico.sh`) ya corre todos los días y **solo lee**. Se le agrega una sección que, para cada trabajo, imprime su **cadencia** y su **modelo** tal como están escritos en el VPS. **Nunca llama a un modelo ni a la red**: lee archivos.

## Qué se agrega
Una sección nueva, **justo antes de `sec "fin"`**, con este título exacto:
`sec "16. Modelo y cadencia por trabajo — lo que está escrito, sin llamar a ningún modelo (11-oct)"`
(Si al abrir el archivo la última sección numerada no es la 15, usá el número siguiente y decilo en el resumen. **No renumeres ni cambies las secciones existentes.**)

La sección tiene tres partes, cada una con su subtítulo `echo "--- …"`:

### A. Los trabajos del gateway de Hermes (`/root/.hermes/cron/jobs.json`)
Leelo con `python3` como lo hace la sección 2 de este mismo archivo (mismo manejo de formas: lista, o diccionario con `jobs`, o diccionario de trabajos). Por **cada trabajo**, **una línea**:
```
<nombre> | cada <horario tal cual está en el archivo> | modelo <model, o «(el del gateway)» si está vacío> | <habilitado: sí / no>
```
- El horario sale de la primera clave no vacía entre `schedule_display`, `schedule`, `cron`, `expr`. **Se imprime tal cual: no calcules huecos.**
- La habilitación sale de `enabled` (`true` → `sí`, `false` → `no`, ausente → `?`).
- **No imprimas el `prompt` ni ninguna otra clave** (pueden traer datos del cliente o secretos): solo esos cuatro datos.
- Si el archivo no existe o no se puede leer: una línea `no pude leer <ruta>: <motivo corto>` y la sección **sigue** con la parte B (exit 0).

### B. Los trabajos del crontab que usan un script instalado
Del `crontab -l` de root, por cada línea activa (sin comentarios ni variables) que nombre un script instalado en `/root/bin/` (por ejemplo `/root/bin/onia-jarvis-resumen.sh`), **una línea**:
```
<script> | cada <horario de la línea> | modelo <modelo declarado, o «sin modelo declarado»>
```
- El **modelo declarado** se saca leyendo el texto del script instalado (no ejecutándolo) y buscando la **primera** expresión `${VARIABLE:-valor}` donde `VARIABLE` contiene `MODEL` (por ejemplo `MODELO="${ONIA_JARVIS_MODELO:-gpt-5-mini}"` → `gpt-5-mini`). Si la línea del crontab antepone la variable (`ONIA_JARVIS_MODELO=otro /root/bin/…`), gana lo que dice la línea del crontab. Si no hay nada: `sin modelo declarado` (que significa «no llama a un modelo, o no lo dice»: **no afirmes que no usa uno**).
- Si el script no existe en `/root/bin`: `no instalado`.

### C. Lo que NO se puede medir desde acá
Una línea fija: `sesión de la nube de Hermes-Jarvis: modelo no medible desde el VPS (lo lee la madre en la consola de la sesión)`.

Toda la salida de la sección pasa por `| redactar`, como las demás.

## PRUEBA DE HECHO
1. `node --test scripts/loops/diagnostico-modelo.test.mjs` en verde, y `npm run test:jarvis-modelo` (lo creás en `package.json`) hace lo mismo.
2. La prueba **extrae la sección 16 del `diagnostico.sh` real** (hasta el siguiente `sec "`) y la corre en un directorio temporal: reemplazá `/root/.hermes` y `/root/bin` por rutas del directorio temporal en el texto de la sección, y pasá un `crontab` falso por `PATH`. Copiá el patrón de `diagnosticoLatidos()` de `scripts/loops/hermes-jarvis-aplicar.test.mjs` (~líneas 943-975) **sin importar ese archivo**.
3. Casos:
   - a. `jobs.json` con 3 trabajos (uno con `model: "gpt-5-mini"`, uno sin modelo, uno con `enabled: false`) → 3 líneas, con `gpt-5-mini`, `(el del gateway)` y `no`.
   - b. `jobs.json` como diccionario `{ "jobs": [...] }` y como lista simple: ambos andan.
   - c. El `prompt` de un trabajo trae la palabra `SECRETO-DE-PRUEBA`: **no aparece en la salida**.
   - d. `jobs.json` inexistente → la línea `no pude leer …` y la parte B igual se imprime; código de salida 0.
   - e. Crontab con `30 10 * * * /root/bin/onia-jarvis-resumen.sh …` y el script falso instalado con `MODELO="${ONIA_JARVIS_MODELO:-gpt-5-mini}"` → `gpt-5-mini` y `cada 30 10 * * *`.
   - f. Línea del crontab con `ONIA_JARVIS_MODELO=gpt-5 /root/bin/onia-jarvis-resumen.sh` → gana `gpt-5`.
   - g. Script instalado sin ninguna variable de modelo → `sin modelo declarado`. Script que no está en `/root/bin` → `no instalado`.
   - h. La línea C aparece siempre, tal cual.
4. **Sin llamar a ningún modelo ni a la red:** la prueba pone en `PATH` falsos de `curl`, `wget`, `hermes`, `codex` y `claude` que, si se ejecutan, escriben un archivo marcador y salen con 1; al final el marcador **no existe**. Además comprueba que el texto de la sección 16 **no contiene** `curl`, `wget`, `urllib`, `requests`, `http://`, `https://`, `api.openai`, `LITELLM` ni `hermes cron`.
5. **Las pruebas que ya existen siguen en verde:** `npm run test:jarvis-aplicar`, `npm run test:docs-hygiene` y `npm run test:herramientas-desplegadas`. Atención: la prueba de la sección 15 en `hermes-jarvis-aplicar.test.mjs` corta el texto con `diag.slice(diag.indexOf('sec "15.'), diag.indexOf('sec "fin"'))`: con tu sección 16 ese corte **la incluiría**. Cambiá **solo** ese corte para que termine en el siguiente `sec "` después de `sec "15.` (es el único cambio permitido en ese archivo). Si hay otras pruebas que cortan hasta `sec "fin"`, hacé lo mismo y listalas en el resumen.
6. `bash -n hermes-content/deploy/hermes-jarvis/diagnostico.sh` sin errores.

## REGLA DE PARADA
- **El script solo lee.** Nada de `systemctl restart`, `crontab -e`, escrituras fuera de `/tmp`, `docker`, `curl`, ni llamadas a `hermes` o a cualquier modelo. Si una parte te lo pide, **pará** y reportalo.
- **No toques las secciones 1 a 15** de `diagnostico.sh` salvo lo que dice el punto 5 de la prueba (que es de la prueba, no del script).
- **No imprimas** el `prompt` de un trabajo, ninguna clave de API ni ningún valor de variable de entorno: solo los nombres de modelo (`gpt-…`, `claude-…`) y los horarios.
- Si en `jobs.json` la clave del modelo tiene otro nombre que `model`, **no adivines**: imprimí `(el del gateway)` y anotalo en el resumen. La forma exacta del archivo en el VPS no se midió desde la nube.
- Sin dependencias nuevas. `python3` y `bash` que ya usa el archivo.
- Este script corre como root en producción: la madre lo revisa con revisión fuerte antes de commitear. Entregá el diff chico y legible.

## ARCHIVOS
Puede editar: `hermes-content/deploy/hermes-jarvis/diagnostico.sh` (solo agregar la sección 16 antes de `sec "fin"`), `scripts/loops/hermes-jarvis-aplicar.test.mjs` (solo el corte de la sección 15, punto 5), `package.json` (solo agregar `"test:jarvis-modelo": "node --test scripts/loops/diagnostico-modelo.test.mjs"` junto a `test:jarvis-aplicar`) y `.github/workflows/hermes-jarvis-pruebas.yml` (solo agregar `test:jarvis-modelo` a la lista de `for s in …`).
Puede crear: `scripts/loops/diagnostico-modelo.test.mjs`.
Todo lo demás, prohibido.

## Contexto mínimo
- Onia (Bolivia) vende un sistema de gestión por rubro. **Hermes** es su asistente por Telegram y corre en un VPS; tiene un gateway con trabajos programados (`/root/.hermes/cron/jobs.json`) y el VPS tiene además un `crontab` de root con scripts en `/root/bin/` (el resumen de las 06:30 usa un modelo barato por la variable `ONIA_JARVIS_MODELO`).
- `diagnostico.sh` lo ejecuta GitHub Actions todos los días por SSH (`hermes-qa-diario.yml`) y una sesión en la nube lee su registro. Por eso **todo lo que imprime queda en un log de Actions**: nada secreto.
- Las secciones del archivo empiezan con `sec "N. …"`; la salida de cada una va por `| redactar` (una función de `comun.sh` que tapa secretos).
- Estilo: bash y python como en el resto del archivo; comentarios en español que explican el **porqué**, como los de la sección 15.
