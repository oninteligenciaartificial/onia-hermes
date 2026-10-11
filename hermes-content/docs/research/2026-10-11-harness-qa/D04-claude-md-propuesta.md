# D04 - CLAUDE.md: lineas que chocan con el reparto de dos madres

Fecha: 2026-10-11. Archivo medido: `CLAUDE.md` (686 lineas) del worktree `onia-madre-v2-pr-review-2d85bb`.
Version 2, corregida tras el verificador. Solo propuesta: CLAUDE.md no se edito.

## Estado medido

Comando (grep extendido, corregido): `grep -niE "la madre|madre unica|UNA madre|Sesion MADRE|orquestador|dos orquestadores" CLAUDE.md`

Lineas con texto de madre y su estado con el reparto nuevo:

| Linea | Texto (corto) | Estado |
|---|---|---|
| 46 | `UNA madre local, varios carriles` | Choca: una sola madre. |
| 48 | `Codex ejecuta el encargo cerrado de la madre.` | Choca: Codex solo para la madre, no para todas las sesiones. |
| 50 | `en un encargo Codex sin Git, la madre verifica rama` | Sin area. Cambiar. |
| 170 | `La madre orquesta con un modelo por rol` | Singular, sin area. |
| 172 | `la madre commitea` | Sin area. |
| 175 | `## Sesion MADRE local + carriles en la nube` | Titulo de madre unica. |
| 181 | `La MADRE corre en la PC ... es la unica que ordena` | Choca. |
| 183-184 | `Reemplaza a la vieja sesion de Control ... dos orquestadores se pisan` | Choca: la regla prohibe dos orquestadores; el reparto tiene dos (por area). |
| 190 | `solo la MADRE manda mensajes` | Choca: cada madre manda a su area. Antes se marcaba como "no choca": error corregido. |
| 192 | `la madre lo lee desde alla` | Sin area. Cambiar. |
| 195 | `tampoco la madre` | Sin area. Cambiar. Antes no estaba listado: error corregido. |
| 440 | `solo la madre y el integrador lo mueven directo` | No dice cual madre. |
| 480-481 | `la **madre** en la PC (ONIA_AUTOSYNC_MAIN=1 ...)` | Ambigua: permiso de push directo a main. |
| 501 | `(hoy, solo en la madre y el integrador` | Ambigua. |
| 528 | `la madre/carril mira capturas a 390/1440` | Sin area. Cambiar. Antes no estaba listado: error corregido. |
| 621 | `los creativos los captura la madre.` | Pauta es de MADRE MARKETING. |

Citas literales de la madre que NO se cambian (son historia): linea 178 (cita 2026-10-01, «creemos la madre y que ordene a todas») y linea 480 (cita 2026-10-05, «sigue directo»).

Fuentes del reparto (medido):
- `hermes-content/docs/handoff/madre-local.md:25-29`: arranque de MADRE DESARROLLO-INFRA; Lucia, Marca y Ventas son de MADRE MARKETING; «no les escribas».
- `madre-local.md:41`: reparto nuevo (11-oct ~05 UTC). Ventas paso a MADRE MARKETING por orden de Sergio Urcullo, transmitida por la otra madre (no es una cita directa suya).
- `madre-local.md:63`: falla reconocida (11-oct 04:55 UTC): la madre v4 hizo con subagentes propios trabajo de Lucia y Marca sin delegar a sus sesiones duenas; regla: código cerrado a Codex.

No encontrado en ninguna fuente del repo: la frase «hace que todas las sesiones usen Codex». Esa cita NO va en CLAUDE.md. La regla de Codex para todas las sesiones se describe sin cita literal, y su fuente escrita queda UNKNOWN.

Medido en otras fuentes: UNKNOWN si `onia-sesion-madre` y `hermes-content/docs/cola/loop/madre.md` ya dicen dos madres (no leidos en este punto). UNKNOWN si la MADRE MARKETING corre en el mismo checkout que la MADRE DESARROLLO-INFRA; si lo comparte, el permiso de `ONIA_AUTOSYNC_MAIN` (linea 482-483) le llega tambien.

## Brecha

1. CLAUDE.md dice una sola madre y prohibe dos orquestadores. El reparto de 2026-10-11 tiene dos madres, una por area. Una sesion que lea CLAUDE.md puede tratar a MADRE MARKETING como violacion.
2. La regla de Codex dice «encargo cerrado de la madre». No cubre todas las sesiones.
3. Siete lugares dicen "la madre" sin area (lineas 50, 170, 172, 192, 195, 440, 501, 528 y 480-481). Con dos madres, quien hace push directo a main o usa `ONIA_AUTOSYNC_MAIN` queda ambiguo.
4. Sin historia de la regla (caso y fecha), el texto nuevo se desobedece. La regla de CLAUDE.md (seccion 1) pide el caso real y la fecha. El caso de este diff tiene fuente: `madre-local.md:63` (falla de 11-oct 04:55 UTC) y `madre-local.md:41` (reparto).

## Configuracion propuesta

Diff minimo. Cada bloque: OLD y NEW exactos, listos para pegar. Las lineas 178 y 480 quedan como estan (historia).

### 1. Lineas 46-48 (regla de madre y Codex)

OLD:
```
- **UNA madre local, varios carriles y subagentes.** Corrección 2026-10-09: se evita
  tener varios orquestadores; los carriles independientes sí trabajan en paralelo
  según `equipo-de-agentes`. Codex ejecuta el encargo cerrado de la madre.
```
NEW:
```
- **Una madre por área, varios carriles y subagentes.** Reparto del 2026-10-11: dos madres
  locales, una por área (ver «Madres locales + carriles en la nube»). Dentro de cada área hay
  UN solo orquestador; los carriles independientes trabajan en paralelo según `equipo-de-agentes`.
  Desde el 2026-10-11 el código cerrado de las sesiones va a Codex (`madre-local.md`, línea 63).
```

### 2. Linea 50

OLD: `  Corrección 2026-10-09: en un encargo Codex sin Git, la madre verifica rama y hace`
NEW: `  Corrección 2026-10-09: en un encargo Codex sin Git, su madre verifica rama y hace`

### 3. Lineas 170-172

OLD: `- **La madre orquesta con un modelo por rol** (Sergio Urcullo, 10-oct-2026): subagentes con \`model\` por rol (Haiku`
NEW: `- **Cada madre orquesta con un modelo por rol** (Sergio Urcullo, 10-oct-2026): subagentes con \`model\` por rol (Haiku`

OLD: `transcript de cada sesión de la nube y le manda UNA línea con su próxima tarea. Codex no hace git; la madre commitea`
NEW: `transcript de cada sesión de la nube y le manda UNA línea con su próxima tarea. Codex no hace git; su madre commitea`

### 4. Linea 175 (titulo)

OLD: `## Sesión MADRE local + carriles en la nube (REGLA)`
NEW: `## Madres locales + carriles en la nube (REGLA)`

### 5. Lineas 181-184 (reparto de las dos madres)

OLD:
```
- **La MADRE corre en la PC de Sergio Urcullo** y es la única que ordena. Reparte las tareas a cada sesión
  **por mensaje** y hace ella misma lo que exige la PC: paneles con su login (Meta, Cloudflare, Hostinger),
  capturas, mirar pantallas. Reemplaza a la vieja sesión de «Control» como orquestadora: dos orquestadores
  se pisan.
```
NEW:
```
- **Dos MADRES corren en la PC de Sergio Urcullo, una por área** (reparto del 2026-10-11, `madre-local.md`
  línea 41). **MADRE DESARROLLO-INFRA** ordena Plataforma, Hermes-Jarvis (QA), VPS, infra y harness.
  **MADRE MARKETING** ordena Lucía, Marca personal, Ventas y pauta. Cada madre reparte tareas a sus nubes
  **por mensaje** y hace lo que exige la PC: paneles con su login (Meta, Cloudflare, Hostinger), capturas,
  mirar pantallas. Ninguna madre escribe a las nubes de otra área. La vieja sesión «Control» ya no orquesta.
  Dos orquestadores para la MISMA área se pisan: por eso cada área tiene una sola madre.
```

### 6. Lineas 190-192 (canal de mensajes)

OLD: `- **Cómo se manda (medido el 1-oct):** solo la MADRE manda mensajes, con \`SendMessage\`, y le llegan al`
NEW: `- **Cómo se manda (medido el 1-oct):** solo cada MADRE manda mensajes, con \`SendMessage\`, a las nubes de su área, y le llegan al`

OLD: `  cannot message other sessions yet»): contesta **en su propio transcript** y la madre lo lee desde allá.`
NEW: `  cannot message other sessions yet»): contesta **en su propio transcript** y su madre lo lee desde allá.`

### 7. Linea 195 (SIAT)

OLD: `- **El portal del SIAT no lo abre ninguna sesión, tampoco la madre.** Lo abre solo Sergio Urcullo a mano; la`
NEW: `- **El portal del SIAT no lo abre ninguna sesión, tampoco ninguna madre.** Lo abre solo Sergio Urcullo a mano; la`

### 8. Linea 440 (main)

OLD: `- \`main\` avanza por PR revisado; solo la madre y el integrador lo mueven directo (regla`
NEW: `- \`main\` avanza por PR revisado; solo la MADRE DESARROLLO-INFRA y el integrador lo mueven directo (regla`

### 9. Lineas 480-481 (permiso de autosync)

OLD: `  directo»*). El hook ya no hace fast-forward de \`main\`, salvo con permiso: la **madre** en la PC`
NEW: `  directo»*). El hook ya no hace fast-forward de \`main\`, salvo con permiso: la **MADRE DESARROLLO-INFRA** en la PC`

Nota: este diff no cambia el permiso real (`ONIA_AUTOSYNC_MAIN`, config local). Solo nombra a quien lo tiene. Ver «Quien la aplica».

### 10. Linea 501

OLD: `- ⚠️ **El hook Stop puede publicar el estado A MEDIAS de un subagente** (hoy, solo en la madre y`
NEW: `- ⚠️ **El hook Stop puede publicar el estado A MEDIAS de un subagente** (hoy, solo en la MADRE DESARROLLO-INFRA y`

### 11. Linea 528 (publicacion sin preguntar)

OLD: `  la madre/carril mira capturas a 390/1440 y verifica los gates; lo revisado se publica`
NEW: `  el carril o su MADRE mira capturas a 390/1440 y verifica los gates; lo revisado se publica`

### 12. Linea 621 (pauta)

OLD: `    un pack nuestro. Desde la nube Facebook no abre: los creativos los captura la madre.`
NEW: `    un pack nuestro. Desde la nube Facebook no abre: los creativos los captura la MADRE MARKETING.`

### 13. Historia de la regla (insertar tras la linea 196, al final de la seccion «Madres locales»)

```
> Sergio Urcullo, 2026-10-11 (reparto en `hermes-content/docs/handoff/madre-local.md`, línea 41): dos
> madres locales, una por área. MADRE DESARROLLO-INFRA: Plataforma, Hermes-Jarvis (QA), VPS, infra y
> harness. MADRE MARKETING: Lucía, Marca personal, Ventas y pauta. Caso que la originó (línea 63, 11-oct
> 04:55 UTC): la madre anterior, con subagentes propios, hizo trabajo de Lucía y Marca sin delegar a sus
> sesiones dueñas; Ventas pasó a MADRE MARKETING por orden de Sergio Urcullo, transmitida por la otra
> madre (línea 41, ~05:10 UTC). Sustituye la regla de una sola madre (2026-10-01 y 2026-10-09).
```

## Quien la aplica

- **MADRE DESARROLLO-INFRA**: aplica el diff en su rama, con commit. Es dueña de harness y de CLAUDE.md. Por que: el cambio es documentacion de gobierno, sin gasto, sin contacto con terceros ni publicacion externa.
- **Sergio Urcullo**: confirma el reparto antes del merge. Por que: cambia quien ordena y quien tiene el permiso de `main`; es una decision suya, no del texto. Sergio solo ve lo publicado, con enlace.
- **Integrador (onia-cola)**: revisa que el diff toque solo los 13 bloques y mergea. No cambia el permiso de `ONIA_AUTOSYNC_MAIN`: eso es config local, fuera de este diff.
- **MADRE MARKETING**: no aplica nada. Debe leer los bloques 5, 12 y 13 al arrancar, porque nombran su area.
- **Fuera de este diff** (no lo toca D04): `onia-sesion-madre`, `madre.md` y cualquier skill que diga «madre unica». Hace falta un punto aparte.
- **Pendiente sin decision**: si MADRE MARKETING comparte checkout con MADRE DESARROLLO-INFRA, hereda el permiso de autosync. Decide Sergio Urcullo. UNKNOWN hoy.

## Prueba de hecho

Comandos (grep, desde el worktree, tras el merge):

1. `grep -nE "UNA madre local|es la única que ordena|Reemplaza a la vieja sesión|Sesión MADRE local|dos orquestadores se pisan" CLAUDE.md` debe salir vacio.
2. `grep -c "MADRE DESARROLLO-INFRA" CLAUDE.md` debe dar al menos 5 (bloques 5, 8, 9, 10 y la historia).
3. `grep -c "MADRE MARKETING" CLAUDE.md` debe dar al menos 3 (bloques 5, 12 y la historia).
4. `grep -niE "la madre" CLAUDE.md | grep -vE "DESARROLLO-INFRA|MARKETING"` debe devolver solo las dos citas literales de historia (2026-10-01 y 2026-10-05). Cualquier otra linea es fallo.
5. `grep -n "2026-10-11" CLAUDE.md` debe devolver las lineas nuevas, incluida la historia.
6. `git diff --stat` debe mostrar solo `CLAUDE.md`. Lo corre el integrador, no esta sesion.

Criterio de hecho: los 5 comandos dan lo esperado y el integrador confirma que `main` no cambio otra cosa.

Pendiente medido: UNKNOWN si la skill `onia-sesion-madre` y `madre.md` ya dicen dos madres (no leidos aqui). UNKNOWN la fuente escrita de «Codex para todas las sesiones».
