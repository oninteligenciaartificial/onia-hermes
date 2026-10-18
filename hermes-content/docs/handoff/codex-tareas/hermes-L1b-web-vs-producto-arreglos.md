---
id: hermes-L1b
carril: hermes
estado: hecha   # pendiente | lanzada | PR | hecha | bloqueada
modelo: gpt-6-luna  # cerrado y verificable: un script, su prueba y dos líneas de CI
repo: onia-hermes
rama: codex/hermes-l1b-arreglos
base: codex/hermes-qa-web-vs-producto   # tiene L1 (782dd348); si ya entró a main, base: main
pr:
escrita: 2026-10-11 por Hermes-Jarvis (nube)
actualizada: 2026-10-11 por Hermes-Jarvis (nube)
nota: commit 6f64e094; revisado y juntado a #194 el 11-oct
---
# L1b · El chequeo web-vs-producto no puede dar verde con datos de mentira

Sos Codex. Trabajás SOLO en esta carpeta: un worktree de `onia-hermes` que creó la madre, en la rama `codex/hermes-l1b-arreglos`.
- No uses git: ni consultas, ni cambio de rama, ni commits. La madre verifica la rama y revisa el diff.
- Si ya hay cambios en la carpeta, una corrida anterior se cortó: revisá los archivos y seguí desde ahí.
- Nadie contesta preguntas mientras corrés. Decidí con este documento y el código; lo que no puedas decidir, anotalo en el resumen final.
- Sin push, sin `npm install`, sin producción. NO commitees: la madre revisa el diff y commitea.
- Red: **ninguna** durante el desarrollo. Las pruebas usan textos y carpetas locales.

## META
`.claude/skills/onia-hermes-jarvis/scripts/web-vs-producto.mjs` (L1) compara los precios y los topes que muestra `onia.com.bo/precios`
con el código de `onia-platform`, busca textos de obra ("muy pronto", "beta"…) y dice si siguen ocho promesas. Es un instrumento de QA: su
valor es que **un verde signifique algo**. La revisión del 11-oct midió tres formas en que hoy no lo significa. Esta tarea las cierra.

## Qué falla hoy (medido, no supuesto)
1. **Verde falso con datos de mentira.** Sin `--platform`, el script compara la web contra `fixtures/platform/lib/*` (línea 197:
   `args.platform ?? …/fixtures/platform`). Se cambió Crece mensual de 550 a 560 en una copia del código real: con `--platform` da
   «Crece · mensual: web 550, código 560» y exit 1; **sin `--platform` da «0 diferencias de precio» y exit 0**. Un precio que cambia en
   `onia-platform` no se ve nunca si alguien corre el comando sin la bandera.
2. **`--base` no puede correr completo.** Una sola base para las nueve páginas; `app-register-paso2.txt` es `/register`, que en
   `onia.com.bo` da 404 (medido), y el paso 2 del alta aparece al hacer clic, no en el HTML. Con `--base https://onia.com.bo` la corrida
   entera termina en `NO MEDIDO: falló /register: HTTP 404` y se pierden los resultados de las otras ocho (que sí se pueden leer: `/precios`
   es HTML del servidor y trae «Crece» y «550»). Además `fetch` no tiene tiempo máximo.
3. **Los extractores de add-ons toman la primera coincidencia del archivo**, sin anclarse a la constante. Hoy dan bien, y por casualidad:
   `setupFrom` aparece dos veces en `lib/pricing.ts` (3500 en `ENTERPRISE_PLAN_PRICE`, línea 363; 4500 en `SERVER_DEPLOYMENT_ADDON_PRICE`,
   línea 371) y `precio:` / `entryMonthly:` / `annualTotal:` no están atados a `RECARGA_CONVERSACIONES` / `WHATSAPP_ADDON`. Si alguien agrega
   un campo igual antes, compara contra otro precio y sigue en verde.
4. **Los topes no se contrastan con el código.** El script exige que el texto de la web coincida con números escritos a mano en el propio
   script (líneas 113-119) y imprime «web coincide con referencia manual §3.1». No lee `lib/plan-catalogo.ts`.
5. **La prueba de L1 no corre en ninguna parte:** no hay script en `package.json` ni línea en `.github/workflows/hermes-jarvis-pruebas.yml`.

## Qué se cambia
### A. Sin `--platform` → NO MEDIDO
- Sin `--platform <carpeta>` (con `lib/pricing.ts`, `lib/subscription-plans.ts` y `lib/plan-catalogo.ts`) el script imprime
  `NO MEDIDO: falta --platform <carpeta con lib/pricing.ts, lib/subscription-plans.ts y lib/plan-catalogo.ts>` y sale con **2**. No hay carpeta por defecto.
- Las fixtures se quedan en `fixtures/platform/` **solo para las pruebas**, que las pasan con `--platform` o por la función `auditar`.
- Exit: **1** si hay una diferencia de precio o un texto de obra (evidencia); **2** si no se pudo medir algo y no hay evidencia;
  **0** solo si todo se midió y no hay diferencias. Si hay evidencia y algo sin medir, sale **1** y lista también lo no medido.

### B. `--base-web` y `--base-app`, y cada página por su cuenta
- Se reemplaza `--base` por `--base-web https://onia.com.bo` (las ocho páginas del sitio) y `--base-app https://app.onia.com.bo`.
- Una página que falla (HTTP no 2xx, red, tiempo) se anota como `NO MEDIDO: <ruta> — <motivo corto>` y **la corrida sigue** con las demás. Las
  comparaciones que dependen de esa página se marcan «no medida»; no se inventa un valor.
- `app-register-paso2.txt` no se puede leer con `fetch` (el paso 2 aparece con un clic): en modo `--base-*` se informa
  `registro-nombre: no medible sin navegador (usar --texto-dir)` y **no cambia el exit**. Con `--texto-dir` se evalúa como hoy.
- Cada `fetch` lleva `AbortSignal.timeout(20000)`. Sin reintentos.
- Ya existe `--texto-dir`: se mantiene. Se pueden combinar (texto local de una página, red para el resto) solo si es simple; si no, no.

### C. Extractores atados a su constante
En `lib/pricing.ts` cada valor se busca **dentro del bloque de su constante**, no en todo el archivo:
- Agente WhatsApp mensual y anual → `WHATSAPP_ADDON` (`entryMonthly`, `annualTotal`).
- Recarga de 200 conversaciones → `RECARGA_CONVERSACIONES` (`precio`).
- Reservas online → `BOOKING_ADDON_PRICE.monthly`; Usuario extra → `EXTRA_USER_ADDON_PRICE.monthly` (ya van por bloque: no los empeores).
- Implementación Grupo → **`ENTERPRISE_PLAN_PRICE.setupFrom`** (no `SERVER_DEPLOYMENT_ADDON_PRICE`).
Una función chica `bloqueDe(source, 'NOMBRE')` que devuelve el texto entre `export const NOMBRE = {` y el `} as const;` siguiente. Si no encuentra la
constante: `NO MEDIDO: no se encontró NOMBRE en lib/pricing.ts` (exit 2), nunca un número de otro lado.

### D. Topes contra `lib/plan-catalogo.ts`
- Se lee `PLAN_LIMITS` de `lib/plan-catalogo.ts` (`basic`, `crece`, `professional`, `clinic`; campos `patients`, `users`, `emailsPerMonth`; `-1` = sin tope).
- Del texto de `precios.txt` se extraen los números de cada línea «Topes: …» (fichas · usuarios · recordatorios; «sin tope» para Completo) **en vez** de los
  regex con números fijos. Se comparan con el código. Salida por plan: `Tope Crece: web 800/4/400, código 800/4/400 → coincide` o
  `Tope Crece: web 800/4/400, código 800/5/400 → DIFIERE` (cuenta como diferencia, exit 1).
- Si la línea no se puede leer o el plan no está en el código: `NO MEDIDO`, no un «coincide».
- Fixture nueva: `fixtures/platform/lib/plan-catalogo.ts` con **solo** las entradas `basic`, `crece`, `professional` y `clinic` de `PLAN_LIMITS` copiadas
  tal cual de `onia-platform` (`master`), más la interfaz `PlanLimits` mínima si el extractor la necesita.
- Hoy los valores son: basic 300/2/200 · crece 800/4/400 · professional 1500/5/800 · clinic -1/-1/-1, y coinciden con la web.

### E. La prueba corre en el CI
- `package.json`: `"test:web-vs-producto": "node --test .claude/skills/onia-hermes-jarvis/scripts/web-vs-producto.test.mjs"` junto a `test:jarvis-aplicar`.
- `.github/workflows/hermes-jarvis-pruebas.yml`: agregar `test:web-vs-producto` a la lista de `for s in …`, y la ruta `.claude/skills/onia-hermes-jarvis/scripts/**` al filtro de rutas si tiene uno.
- La prueba actual lee `hermes-content/docs/research/promesas-web/2026-10-11/texto/*`: esa carpeta está en la rama; no la muevas ni la borres.

## PRUEBA DE HECHO
1. `npm run test:web-vs-producto` en verde, con los 6 casos de L1 más estos, **cada uno falla sin su arreglo**:
   - a. Sin `--platform`: se ejecuta el script como proceso (`node web-vs-producto.mjs --texto-dir <carpeta>`) y sale **2** con el mensaje `NO MEDIDO: falta --platform`.
   - b. **Mutación de precio:** copia temporal de las fixtures con Crece mensual +10; con `--platform` esa copia → exit **1** y la línea «Crece · mensual: web 550, código 560».
   - c. **Mutación de tope:** copia con `crece.users: 5` → «Tope Crece … DIFIERE» y exit 1.
   - d. **Ancla:** una copia de `pricing.ts` donde se agrega un `setupFrom: 9999,` ANTES de `ENTERPRISE_PLAN_PRICE` no cambia el resultado (sigue comparando 3500); y una copia sin `ENTERPRISE_PLAN_PRICE` da `NO MEDIDO` (exit 2), no un número.
   - e. **`--base-web` con un servidor local** (`http.createServer` en un puerto libre, solo en la prueba) que sirve las ocho páginas desde los `.txt` envueltos en HTML mínimo, y devuelve 404 para una: la corrida **no se corta**, esa página sale `NO MEDIDO: <ruta> — HTTP 404` y las otras siete se evalúan.
   - f. Un servidor que no contesta (acepta y calla) con el tiempo máximo bajado por una variable de entorno de prueba (`WVP_TIMEOUT_MS`, por defecto 20000) → esa página sale `NO MEDIDO`, la prueba termina en < 5 s.
   - g. `registro-nombre` en modo `--base-*` sale «no medible sin navegador» y **no** cambia el exit; con `--texto-dir` sigue evaluándose.
2. Con la carpeta de textos del 11-oct y el código real de `onia-platform` (si la madre te lo deja en una ruta; si no, las fixtures): **0 diferencias de precio, 0 textos de obra, 8 promesas siguen, 1 manual**, y los cuatro topes «coincide». Pegá esa salida en el resumen.
3. `npm run test:jarvis-aplicar` y `npm run test:docs-hygiene` siguen en verde.

## REGLA DE PARADA
- Solo lectura sobre la web y el código: ninguna escritura fuera de `/tmp` y de los archivos de ARCHIVOS; ningún `POST`; nada de login ni cuentas.
- Sin dependencias nuevas (`node:*` y `fetch`/`http` del propio Node).
- Si el formato de `PLAN_LIMITS` o de `precios.txt` no permite extraer algo con certeza, **no adivines**: `NO MEDIDO` y anotalo en el resumen.
- Si una de las cinco fallas de arriba ya no se reproduce en la rama, decilo y salta ese punto.
- No cambies las frases de las promesas ni la lista de páginas.

## ARCHIVOS
Puede editar: `.claude/skills/onia-hermes-jarvis/scripts/web-vs-producto.mjs`, `.claude/skills/onia-hermes-jarvis/scripts/web-vs-producto.test.mjs`, `package.json` (solo el script nuevo) y `.github/workflows/hermes-jarvis-pruebas.yml` (solo la lista y el filtro de rutas).
Puede crear: `.claude/skills/onia-hermes-jarvis/scripts/fixtures/platform/lib/plan-catalogo.ts` y copias temporales dentro de las pruebas (en `os.tmpdir()`).
Todo lo demás, prohibido.

## Contexto mínimo
- Onia (Bolivia) vende un sistema de gestión por rubro. La regla de la casa: **los precios se leen del código**, no de un documento ni de una copia (`CLAUDE.md`, «Una sola fuente de verdad»): `lib/subscription-plans.ts` manda en los planes y `lib/pricing.ts` en los add-ons.
- Convención de los instrumentos de QA de este carril (`qa-release.sh`): **ROTO** solo con evidencia; si falla el instrumento es **NO MEDIDO** y sale con 2. Un instrumento que no midió no puede decir «0 diferencias».
- Estilo: módulos ES, sin dependencias, funciones chicas, nombres en español, comentarios que explican el porqué.
