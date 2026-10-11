# M2 · Validador del calendario de posteo (Marca personal)

Modelo: `gpt-6.1-sol` · esfuerzo `medium`. Carril: Marca personal de Sergio Urcullo. Lo lanza la madre desde la PC. Pedido de la MADRE MARKETING, 11-oct.

Repo: onia-hermes. Antes de tocar nada leé `hermes-content/docs/cola/plan-3-semanas/ORDEN-DE-POSTEO-11-17-OCT.md` (es el calendario único: la tabla «Calendario» y la tabla «Hora de cada red»), y `hermes-content/docs/cola/plan-3-semanas/AVISOS-COMUNIDAD-8-16-OCT.md` (mirá cómo empiezan los avisos: `## PALABRA · título`). Para el estilo de un test del repo mirá `scripts/carousel_render.test.js` (Node, `node:assert`, función `test(nombre, fn)`, se corre con `node scripts/<x>.test.js`).

No ejecutes git, ni siquiera consultas: no commitees; dejá los cambios sin commitear y el mensaje propuesto en el resumen. No publiques ni agendes nada. No instales nada (solo Node, sin dependencias). No toques el calendario ni los avisos: el validador los LEE.

## META
Un script de Node que lee el calendario y devuelve **rojo** (código de salida 1 y un renglón por falla) cuando se rompe una de las cuatro reglas, y **verde** (código 0) si no. Archivos nuevos:

- `scripts/marca-personal/validar-calendario.js` (CommonJS, sin dependencias; exporta `validar(texto, opciones)` y corre como CLI)
- `scripts/marca-personal/validar-calendario.test.js`
- un script en `package.json`: `"test:calendario": "node scripts/marca-personal/validar-calendario.test.js"` (**no** lo agregues a la cadena de `npm test`: el calendario real tiene fallas reales y volvería roja la CI; el test usa solo fixtures)

CLI: `node scripts/marca-personal/validar-calendario.js [ruta-del-calendario]` (por defecto, el `ORDEN-DE-POSTEO-11-17-OCT.md`). Imprime `ERROR`/`AVISO` por renglón y un resumen. Opciones de `validar`: `{ raiz, avisosTexto, existeCommit(sha), existeArchivo(ruta) }` (inyectables para que el test no dependa del repo; por defecto `existeCommit` corre `git cat-file -e <sha>^{commit}` con `execFileSync` y `existeArchivo` usa `fs.existsSync` desde la raíz del repo).

### Cómo se lee la tabla «Calendario»
Columnas: `| Día | Hora | Pieza | Palabra | Estado | Falta para publicar |`. Una fila por hueco. El `Día` es «Dom 11», «Lun 12»… (día de octubre de 2026); la `Hora` es La Paz (`HH:MM`); `Palabra` es la palabra del cierre o `—` si no tiene. Ignorá los asteriscos de énfasis. Si falta una columna o la hora no es `HH:MM`, es un ERROR de formato con el número de renglón.

Tipo de pieza: si `Pieza` empieza por «Carrusel» es **carrusel**; si no, es **video** (también BA814C81).

### Cómo se expande cada fila a (red, hora) — tabla «Hora de cada red» del calendario
- Video (hora `h`, siempre `12:30` o `18:30`): Instagram a `h`; TikTok, YouTube Shorts y LinkedIn a `h`+5 min.
- Carrusel (hora `h`, siempre `16:00`): Instagram a `h`; LinkedIn a `h`+1 min; TikTok a `h`+2 min.
- Los yaps no son filas y no se expanden.
Una hora que no sea ninguna de esas es un ERROR («hora fuera de los huecos fijos»).

## LAS CUATRO REGLAS (cada una con su mensaje)
1. **Choque.** Dos filas que, expandidas, caen en la **misma red, el mismo día y el mismo minuto** → ERROR `choque: <red> <día> <hh:mm> · <piezaA> y <piezaB>`. Las dos filas que comparten Día y Hora sin red común (no existe hoy) no chocan.
2. **Cupo de Buffer.** Contá, por red de Buffer (TikTok, YouTube Shorts, LinkedIn), las filas cuyo `Estado` empieza por `agendada` o `master listo` (esas son las que ya están en la cola). Más de **10** en una red → ERROR `cupo: <red> tiene <n> agendados (máx. 10)`. El tope es `opciones.cupo` (por defecto 10). YouTube Shorts solo cuenta para filas de **video**; un carrusel no va a Shorts.
3. **Lista sin archivo o SHA.** Si el `Estado` empieza por `corte listo`, `borrador listo` o `master listo` (o es exactamente `lista`), tiene que traer **al menos un SHA** entre comillas invertidas de 7 a 40 caracteres hexadecimales **y al menos una ruta** entre comillas invertidas que contenga `/`. Falta uno → ERROR `lista sin sha: <pieza>` o `lista sin archivo: <pieza>`. Además, cada SHA debe existir (`existeCommit`) y cada ruta debe existir (`existeArchivo`); si no → ERROR `sha inexistente: <sha>` / `archivo inexistente: <ruta>`.
4. **Palabra sin aviso.** Si `Palabra` no es `—`, tiene que existir un encabezado `## <PALABRA> ·` (o `## <PALABRA>` solo) en el texto de **algún** `hermes-content/docs/cola/plan-3-semanas/AVISOS-COMUNIDAD-*.md` (en el test se inyecta con `avisosTexto`). La comparación no distingue mayúsculas de minúsculas. Gravedad según el `Estado` de la fila:
   - `agendada`, `corte listo`, `borrador listo`, `master listo`, `lista` → **ERROR** `palabra sin aviso: <PALABRA> (<pieza>)`.
   - `falta grabar`, `falta editar`, `propuesta`, `falta capturas…` y cualquier otro → **AVISO** (no cambia el código de salida): todavía no sale, pero el aviso tiene que estar antes.
   - Aunque el aviso exista, si su bloque (desde su encabezado hasta el siguiente `## `) contiene `[CONFIRMAR]` → **AVISO** `aviso en borrador: <PALABRA>`.

El código de salida es 1 si hay al menos un ERROR; los AVISO no lo cambian.

## PRUEBA DE HECHO
1. `npm run test:calendario` → **verde**, con estos casos (todos con fixtures escritas en el propio test; el calendario real no se usa):
   - un calendario correcto (3 filas: un video, un carrusel, un video «falta grabar» con palabra y aviso) → 0 errores;
   - **un rojo por regla**, cada uno comprobado: (a) dos filas que expandidas coinciden en la misma red y minuto → falla con `choque:`; (b) 11 filas `agendada` de carrusel → falla con `cupo: TikTok tiene 11`, y 10 filas → verde; un video suma a YouTube Shorts y un carrusel no; (c) un `corte listo` sin SHA falla con `lista sin sha`, uno sin ruta falla con `lista sin archivo`, uno con SHA que `existeCommit` rechaza falla con `sha inexistente`; (d) una fila `agendada` con palabra sin aviso falla con `palabra sin aviso`, la misma palabra en una fila `falta grabar` da solo AVISO y la salida sigue verde, y un aviso con `[CONFIRMAR]` da AVISO;
   - una hora fuera de los huecos fijos (`17:45`) falla con `hora fuera de los huecos fijos`;
   - una tabla sin la columna `Palabra` falla con ERROR de formato (no revienta con una excepción).
2. **Un rojo comprobado sobre el calendario real:** `node scripts/marca-personal/validar-calendario.js` debe terminar con código **1** hoy, porque dos carruseles agendados cierran con avisos que no existen: **PRUEBAS** (lun 12) y **BRIEF** (mié 14). Pegá en el resumen la salida completa y el código de salida (`echo $?`). Debe listar, como AVISO y no como ERROR, `ANTIGRAVITY` (su aviso existe pero está en borrador, con `[CONFIRMAR]`). **Actualizado el 11-oct ~11:40 UTC:** los avisos de RUTINA, OPENCLAW, VAGO, SECRETOS, HYPERFRAMES e INVESTIGAR ya existen en `hermes-content/docs/cola/plan-3-semanas/AVISOS-COMUNIDAD-SI-11OCT.md` (el validador lee TODOS los `AVISOS-COMUNIDAD-*.md` de esa carpeta), así que **no** deben salir como faltantes: las únicas fallas reales son los dos ERROR de PRUEBAS y BRIEF y el AVISO de ANTIGRAVITY. Si salen otras, es un bug del lector de avisos (revisá que acepte `## PALABRA · título`). **No arregles esas fallas** (son reales y las cierra Marca).
3. Mostrá el comando y la salida de `npm run test:calendario` con la cuenta de casos y el código de salida 0.

## REGLA DE PARADA
- Si el calendario real no se puede parsear con las columnas de arriba, **no cambies el calendario**: pará y decí qué renglón y qué columna.
- Si `git cat-file` no está disponible en el sandbox, el valor por defecto de `existeCommit` pasa a «no verificable» (AVISO, no ERROR) y lo decís en el resumen; el test igual usa la versión inyectada.
- No cambies reglas ni umbrales por tu cuenta (10, los huecos, la gravedad). Si algo te parece mal, dejalo escrito en el resumen; no lo «arregles».
- No agregues dependencias, no toques `npm test`, no edites los archivos de avisos ni el calendario.

## Archivos
- Crear: `scripts/marca-personal/validar-calendario.js`, `scripts/marca-personal/validar-calendario.test.js`.
- Editar: `package.json` (solo la línea `test:calendario`).
- No tocar: `hermes-content/docs/cola/plan-3-semanas/ORDEN-DE-POSTEO-11-17-OCT.md`, `AVISOS-COMUNIDAD-*.md`.

Commit propuesto (lo hace la madre): `CODEX LISTO: marca-M2`.
