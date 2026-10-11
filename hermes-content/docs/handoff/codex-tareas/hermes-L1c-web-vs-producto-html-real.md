---
id: hermes-L1c
carril: hermes
estado: pendiente   # pendiente | lanzada | PR | hecha | bloqueada
modelo: gpt-6-luna  # cerrado y verificable: un script, su prueba y fixtures de texto
repo: onia-hermes
rama: codex/hermes-l1c-html-real
base: codex/hermes-qa-web-vs-producto   # tiene L1 (782dd348) y L1b (6f64e094)
pr:
escrita: 2026-10-11 por Hermes-Jarvis (nube)
actualizada: 2026-10-11 por Hermes-Jarvis (nube)
nota: Cierra lo que L1b no puede: el modo --base-web con el HTML REAL de onia.com.bo. Mismo error de método que C3: el ejemplo de la prueba de L1b era HTML inventado.
---
# L1c · `--base-web` tiene que leer las páginas que de verdad sirve onia.com.bo

Sos Codex. Trabajás SOLO en esta carpeta: un worktree de `onia-hermes` que creó la madre, en la rama `codex/hermes-l1c-html-real`.
- No uses git: ni consultas, ni cambio de rama, ni commits. La madre verifica la rama y revisa el diff.
- Si ya hay cambios en la carpeta, una corrida anterior se cortó: revisá los archivos y seguí desde ahí.
- Nadie contesta preguntas mientras corrés. Decidí con este documento y el código; lo que no puedas decidir, anotalo en el resumen final.
- Sin push, sin `npm install`, sin producción, **sin red**: todo con los archivos del repo. NO commitees: la madre revisa el diff y commitea.

## META
`.claude/skills/onia-hermes-jarvis/scripts/web-vs-producto.mjs` compara `onia.com.bo` con el código de `onia-platform`. Con `--texto-dir` (texto que sacó un navegador) **ya funciona y está
bien probado** (L1b). Con `--base-web` (el script baja el HTML) **no funciona con las páginas reales**. Esta tarea lo arregla sin volver a dar un verde falso.

## Qué falla hoy (medido el 11-oct con el HTML real, no supuesto)
Se bajaron las ocho páginas de `https://onia.com.bo` con `curl`, se sirvieron en un servidor local y se corrió
`node web-vs-producto.mjs --base-web http://127.0.0.1:<puerto> --platform <código real de master>`. Resultado: **exit 2**, «no se pudo ubicar el plan Básico / Crece / Profesional / Completo en precios.txt»,
«no se pudo leer Agente WhatsApp mensual en texto web», los cuatro topes «no medida» y **`whatsapp-24h · chatbot.txt: no está`** (esa frase SÍ está en la página).
Con `--texto-dir` y el mismo código, el resultado correcto es **exit 0**: 0 diferencias de precio, 0 textos de obra, cuatro topes que coinciden y 8 promesas que siguen.

Causa: `htmlATexto` no es lo mismo que el `innerText` de un navegador. Las extracciones dependen de saltos de línea que el HTML crudo no trae:
```
HTML crudo → htmlATexto:   "…01  ·  Ordenar  Básico\\n320  Bs / mes\\n3.200  Bs/año  · 89 Bs/sem…"
innerText (referencia):    "…01 · ORDENAR\\nBásico\\n320\\nBs / mes\\n\\n3.200 Bs/año · 89 Bs/sem…"
chatbot, HTML crudo:       "Tu WhatsApp responde las  24 horas ."      (dos espacios y un espacio antes del punto)
```
Los títulos de plan comparten línea con otras cosas, el precio y «Bs / mes» están en la misma línea, y los espacios se duplican. Y `evaluarPromesas` dice «no está» cuando no encuentra la frase, aunque lo que falló fue la conversión.

## Qué se cambia
### A. Fixtures con el HTML real
Están en el repo: `hermes-content/docs/research/promesas-web/2026-10-11/html/` (`home`, `precios`, `chatbot`, `rubros`, `contacto`, `comparativa`, `servicios-webs`, `nosotros`; `.html`, sin `<script>` ni `<style>`). El texto de referencia equivalente
(`innerText` de un navegador, mismo día) está en `…/2026-10-11/texto/` (`*.txt`). **No cambies ni muevas ninguno.**

### B. Extractores que no dependan del salto de línea
- Normalizá el texto del modo web igual para todos los extractores: todo espacio en blanco consecutivo (incluidos saltos de línea) → **un espacio**, `Bs / mes` y `Bs/mes` equivalentes, y un espacio antes de `.`, `,` o `:` no cuenta.
  Los regex de precios, add-ons, topes, obra y promesas se escriben sobre ese texto (`Básico\\s+320\\s+Bs\\s*/\\s*mes`, etc.).
- Lo mismo vale para `--texto-dir`: el texto de referencia **debe seguir dando exactamente el mismo resultado de hoy**. Los 13 tests de L1b siguen en verde sin cambiar una expectativa.
- Si para un plan no se puede ubicar la sección de forma única (hoy se ubica por una línea que es solo el nombre), usá el orden de aparición de «Básico → Crece → Profesional → Completo» sobre el texto normalizado y cortá cada sección en el nombre siguiente.

### C. «No está» solo si la página se leyó bien
Para cada página, una **frase ancla** que prueba que la conversión funcionó (por ejemplo `precios`: «Planes» y «Bs / mes»; `chatbot`: «Agente conversacional»; `contacto`, `rubros`, `home`, `comparativa`, `servicios-webs`, `nosotros`: una frase propia, elegila de la página real y anotala).
Si falta el ancla, esa página es `NO MEDIDO` (bloquea el verde, exit 2) y sus promesas pasan a **`no medida`**, nunca a `no está`.

### D. Un solo resultado, dos orígenes
Una prueba compara **los dos orígenes con los mismos datos reales**: `auditar` sobre el texto de `…/html/*.html` (por `htmlATexto`) y sobre `…/texto/*.txt` dan el mismo `diferenciasPrecio`, los mismos `topes` (cuatro «coincide»), el mismo `obra` y las mismas promesas (en modo web `registro-nombre` queda «no medible sin navegador»).

## PRUEBA DE HECHO
1. `npm run test:web-vs-producto` en verde: los 13 de L1b **más**:
   - a. **Equivalencia con datos reales:** con la carpeta `…/html/` servida por un `http.createServer` local (puerto libre, solo en la prueba) y `--platform` apuntando a las fixtures del código (`fixtures/platform`): exit **0**, 0 diferencias de precio, 0 textos de obra, los cuatro topes «coincide», 7 promesas «sigue» y `registro-nombre` informativa.
   - b. **El mismo resultado que `--texto-dir`** con `…/texto/` (comparar los objetos de `auditar`, salvo `registroSoloInformativo`).
   - c. **Mutación en el HTML real:** cambiar en `precios.html` «320» por «330» (Básico mensual) → «Básico · mensual: web 330, código 320», exit 1. Y quitar de `chatbot.html` la frase de las 24 horas (con el ancla presente) → `whatsapp-24h: no está`, sin tocar el exit.
   - d. **Ancla ausente:** `precios.html` reducido a `<html><body>hola</body></html>` → `NO MEDIDO` (exit 2), los precios y los topes «no medida», **ninguna promesa de esa página dice `no está`**.
   - e. Espacios y saltos extra en el HTML (`Bs&nbsp;/&nbsp;mes`, dos espacios, un salto de línea entre `Básico` y `320`) no cambian el resultado.
2. Pegá en el resumen la salida de la corrida de (a) con `--json` (solo `resumen` y `codigoSalida`).
3. `npm run test:jarvis-aplicar` y `npm run test:docs-hygiene` siguen en verde.

## REGLA DE PARADA
- Solo lectura: nada de red real, ni siquiera a `onia.com.bo`. Los servidores de prueba son locales y mueren con la prueba.
- Sin dependencias nuevas.
- No cambies las frases de las promesas, la lista de páginas, los códigos de salida (0 / 1 / 2) ni el comportamiento sin `--platform`.
- Si una frase del texto real no se deja extraer con certeza en modo web, **no la adivines**: esa medida pasa a `NO MEDIDO` y la anotás en el resumen con la línea del HTML.

## ARCHIVOS
Puede editar: `.claude/skills/onia-hermes-jarvis/scripts/web-vs-producto.mjs` y `.claude/skills/onia-hermes-jarvis/scripts/web-vs-producto.test.mjs`.
Todo lo demás, prohibido (los `.html` y `.txt` de `hermes-content/docs/research/promesas-web/2026-10-11/` se **leen**).

## Contexto mínimo
- Onia (Bolivia) vende un sistema de gestión por rubro. Este script lo usa el QA para ver si lo que promete y cuesta la web coincide con el producto. **Los precios se leen del código**, no de un documento.
- Convención del carril: **ROTO/diferencia** solo con evidencia; si falla el instrumento es **NO MEDIDO** y sale con 2. Un instrumento que no midió no puede decir «no está» ni «0 diferencias».
- Lección que esta tarea corrige (la segunda en el día): **el ejemplo de una prueba sale del sistema real** (HTML real, crontab real), no de uno inventado. Con HTML inventado, `--base-web` pasó sus 13 pruebas y no sirve con las páginas de verdad.
- Estilo: módulos ES, sin dependencias, funciones chicas, nombres en español, comentarios que explican el porqué.
