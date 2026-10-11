# S03 · Orden de trabajo de Lucía (para MADRE MARKETING)

Fecha: 2026-10-11. Lectura sola: sin git, sin Codex, sin SSH al VPS, sin Meta. No se leyó ni imprimió ningún token.
Para: la madre de marketing, que lo pasa al carril Lucía. Máximo 7 pasos.

Correcciones respecto a la versión anterior (verificador: WRONG):
- D4 (voz) SÍ tiene decisión de SU: `madre.md:75`. Antes decía que no había registro.
- Codex va con `gpt-6-luna low` (antes decía "Luna", que no es un identificador).
- La opción A del token (bajar `postgres:17-alpine`) exige el sí de SU antes de cualquier descarga.
- G5 tiene una advertencia: la 3.ª pasada no tuvo revisión de cuadros.
- `face_identity_qa.py` no tiene umbral: el campo y el 0,70 se fijan en el contrato.
- Se agrega el checkpoint del cron `ig-refrescar` (lunes 12-oct 09:00 La Paz).

## Estado medido

| Dato | Evidencia | Valor medido |
|---|---|---|
| Cola del carril | `hermes-content/docs/cola/loop/lucia.md` (11 líneas) | G1 «con la captura real de Pendientes de la demo» (línea 1). G2 y G3 según plan v5 (#144). Publicar lo que pase control de identidad. Solo SU: generaciones pagas de video (línea 8) |
| Estado de G1 | `cola/loop/madre.md:62-63` (11-oct ~04 UTC) | Video v2 de 20 s en `.madre-ver/lucia-g1-v2.mp4`. SU: «publicá G1 de Lucía». Bloqueo: no existe `/root/.config/onia-publicar/ig-lucia.env`. No verificable desde aquí (sin acceso al VPS) |
| Dos versiones de G1 | `cola/loop/lucia.md:1` vs `madre.md:63` | La cola pide captura de Pendientes; la madre tiene el video que SU aprobó. Son piezas distintas y la cola no lo dice |
| Token de IG de Lucía | `hermes-content/docs/LUCIA_COMO_SE_USA.md:40-45` | Vence entre el 13 y el 18-oct. Postiz leyó 13/17/18 y el documento asume el 13 (línea 42). Fecha exacta: UNKNOWN (Access Token Debugger de Meta no consultado) |
| Script de renovación | `hermes-content/deploy/vps-ops/publicar/ig-refrescar.sh` | Recorre `ig-*.env` e imprime `<cuenta> renovado` por cada uno. Cron lunes 09:00 La Paz, próximo 12-oct. Si `ig-lucia.env` no existe, no imprime «ig-lucia renovado». Existencia en el VPS: UNKNOWN (LUCIA_COMO_SE_USA.md:46 dice que puede no existir) |
| Opciones de token | `madre.md:63` | A: bajar `postgres:17-alpine` (no está en el VPS) y sacar el token del volumen de Postiz sin verlo. B: token nuevo en developers.facebook.com, pegado en el VPS. Elección de SU: UNKNOWN (no hay registro posterior) |
| Voz | `madre.md:75` (D9, 11-oct, SU): «D4 = voz Marcela queda». `madre.md:62` (G1 con voz Marcela) | Decisión registrada en madre.md, no en `lucia.md` ni en `PLAN.md`. `PLAN.md:126` y `handoff/higgsfield-lucia.md:40` recomendaban sin voz (acento colombiano) |
| Decisiones D1-D6 | `handoff/higgsfield-lucia.md:17, 38-42` (estado del 5-oct) | D1 decidida (3-oct). D2 reel primero, D3 WhatsApp pendiente, D5 canon de 10 datos y D6 «Comentá DEMO»: sin cierre registrado después del 5-oct. D4 ya cerrada en madre.md:75 |
| G4 y G5 | `cola/lucia-diario/VALIDACION-G4-G5-MADRE.md:14-15` (SHA `ec4c450f…` y `6eed3ade…`); sección «Lo que no verifiqué» | Aprobados por la madre el 10-oct. `videos/lucia-entrega/` NO existe en este worktree. El documento dice que vive en `origin/claude/zealous-babbage-fvtjck`. La 3.ª pasada de G5 no tuvo revisión independiente de cuadros |
| Control de identidad | `scripts/face_identity_qa.py` (líneas 228-252); `cola/lucia-diario/FLUJO.md:28` | El script NO tiene umbral ni veredicto. Emite JSON con `scores.<imagen>.{centroid, mean_ref, min_ref, max_ref}`, `refs_internal.leave_one_out_min` y `negatives_max`. El 0,70 es regla operativa de FLUJO.md:28 («≥ 0,70»). Existen `references/modelos/lucia/LUCIA.md` y `v4/PROCEDENCIA.jsonl` |
| Skill del carril | `.claude/skills/lucia` | No existe en este worktree (`ls` sin resultado) |
| Gasto de Higgsfield | `handoff/higgsfield-lucia.md:29` (52,5 de 150 cr, estado del 5-oct); `:146` (22/150, 2-oct) | Último dato con fecha: 5-oct. Actual: UNKNOWN |
| Pantallas reales K1-K4 | `handoff/higgsfield-lucia.md:19-32` | Esperan la pantalla real de Onia. No hay cuenta demo |
| Transcript de `session_01XSzFcs1k18ijqjSHGjnzD4` | No re-medido en esta pasada. En la pasada anterior no estaba en local | UNKNOWN |
| Ejecutor Codex | `scripts/codex-tarea.sh` (rama normal): modelo por defecto `gpt-6.1-sol`, esfuerzo `medium`. `hermes-content/docs/AI_MODEL_ROUTING_2026.md:12`: Luna = `gpt-6-luna`, esfuerzo `low` | Hay que pasar modelo y esfuerzo explícitos en cada encargo |

## Brecha

1. G1 aprobado por SU no sale: falta el token de IG de Lucía. Vence entre el 13 y el 18-oct. Sin renovación no hay publicación de Lucía.
2. La elección de token (A o B) no está registrada en ninguna cola.
3. D4 (voz) tiene decisión de SU en `madre.md:75`, pero no está en `lucia.md` ni en `PLAN.md`, y `PLAN.md:126` recomendaba lo contrario. Hay que registrarla. No se reabre salvo pedido de SU.
4. Dos versiones de G1 en la cola (captura de Pendientes vs video v2). La cola no dice cuál es.
5. G4 y G5 están aprobados, pero sus renders no están en este árbol. G5 (3.ª pasada) no tuvo revisión de cuadros: hay que hacerla antes de publicar.
6. D2, D3, D5 y D6 sin cierre registrado desde el 5-oct. Bloquean K1-K4, WhatsApp, el canon y el CTA.
7. El carril no tiene skill propia (`.claude/skills/lucia` no existe; CLAUDE.md la exige).
8. Gasto de Higgsfield sin dato vigente. Antes de cualquier generación de video: `higgsfield generate cost` y OK de SU.
9. El contrato del control de identidad no fija el campo a comparar ni el umbral: sin eso, el lector tiene que adivinar.

## Configuración propuesta

Orden de trabajo (7 pasos como máximo). El texto entre comillas es para pegar.

1. **Token de IG de Lucía, antes del lunes 12-oct 09:00 La Paz.** Decide SU (A o B). Ejecuta madre-dev, en el VPS.
   - Checkpoint 12-oct: madre-dev comprueba con `ls -l` que existe `/root/.config/onia-publicar/ig-lucia.env` con modo 600, sin imprimir su contenido. Y que el log de `ig-refrescar.sh` dice «ig-lucia renovado». Si falta el archivo, parar y avisar a SU.
   - Texto para madre-dev (opción B): «SU elige el token B. SU crea el token en developers.facebook.com y lo pega en `/root/.config/onia-publicar/ig-lucia.env` (`IG_USER_ID=`, `IG_TOKEN=`, modo 600). Después correr `/root/bin/ig-refrescar.sh`; debe imprimir "ig-lucia renovado". No imprimir el token en logs ni en el chat.»
   - Texto para madre-dev (opción A): «Opción A solo con el sí de SU por chat: bajar `postgres:17-alpine` y sacar el token del volumen de Postiz sin mostrarlo. Hasta ese sí, no descargar nada.»
2. **Registrar las decisiones en `cola/loop/lucia.md`.** Ejecuta madre-marketing.
   - Anotar: «D4 = voz Marcela queda (SU, madre.md:75, 11-oct). PLAN.md:126 recomendaba sin voz; no se reabre salvo pedido de SU.»
   - Anotar: «G1 = video v2 de 20 s aprobado por SU. La captura de Pendientes es pieza aparte.»
   - Pedido a SU en una sola hoja: «Lucía: ¿D2 reel primero (sí/no)? ¿D3 WhatsApp (sí/no)? ¿D5 canon de 10 datos (sí/no)? ¿D6 «Comentá DEMO» (sí/no)? Y el token: A o B.»
3. **Mostrar G1 y publicar.** Muestra madre-marketing (captura + video en el tablero, D7). Publica madre-dev con `ig-reel.mjs` en `@lucia.antelo.oficial`, con etiqueta de IA, cuando exista el token renovado.
   - Texto para SU: «G1 listo: video de 20 s en el tablero. Se publica en @lucia.antelo.oficial con etiqueta de IA cuando el token esté renovado.»
   - Las piezas siguientes: mostrar primero. Si la regla D7 pide OK después de mostrar o solo mostrar, es pregunta abierta para SU (madre.md:75 la deja pendiente).
4. **Traer G4 y G5 a la rama de publicación.** Ejecuta la sesión Lucía (nube).
   - Antes: revisión de cuadros del render final de G5 (3.ª pasada). Es la advertencia de `VALIDACION-G4-G5-MADRE.md`.
   - Después: en la rama de publicación deben existir `videos/lucia-entrega/g4-final-1080x1920.mp4` y `g5-final-1080x1920.mp4`, con los SHA de la validación.
5. **Skill propia del carril.** Ejecuta la sesión Lucía: `.claude/skills/lucia/SKILL.md`, que apunta a `references/modelos/lucia/LUCIA.md`, `cola/lucia-diario/FLUJO.md` y las reglas de este documento, sin copiar contenido. Madre-marketing la revisa y la suma a `onia-router`.
6. **Contrato Codex L-QA1 (tabla de identidad).** Escribe y lanza madre-marketing.
   - Lanzamiento: `scripts/codex-tarea.sh <tarea.md> <carpeta> gpt-6-luna low`.
   - Script `scripts/lucia-qa-tabla.mjs`: lee el JSON que devuelve `scripts/face_identity_qa.py` (archivo o stdin), sin red. Imprime una tabla markdown con `scores.<imagen>.centroid` por imagen y marca las que quedan debajo de 0,70 (umbral de `FLUJO.md:28`). Las imágenes de referencia usan el centroide leave-one-out; se muestra también `refs_internal.leave_one_out_min`. Sale con código 1 si alguna queda debajo.
   - Prueba: `scripts/lucia-qa-tabla.test.mjs` con fixtures inventados (sin caras reales), `node --test`.
   - Parada: si la estructura del JSON real no coincide con lo descrito, parar y reportar.
   - Archivos: esos dos. Nada más. Codex no hace git; la madre revisa el diff y commitea.
7. **Contrato Codex L-QA2 (frases prohibidas).** Escribe y lanza madre-marketing, con el mismo comando y modelo que el paso 6.
   - Script `scripts/lucia-prohibidas.mjs`: recorre `hermes-content/docs/cola/lucia-diario/` (y los textos que se le pasen por argumento) y devuelve cada coincidencia con archivo y línea. La lista sale de `LUCIA_COMO_SE_USA.md` §6 («soy odontóloga», «mis pacientes», «mi consultorio», «testimonio») y de la regla de venta de CLAUDE.md («muy pronto», «en construcción», «beta», «próximamente»). No hay `pie.txt` en este árbol.
   - Antes de correrlo: contrastar la lista con `references/modelos/lucia/LUCIA.md` §0. Si no coincide, parar y reportar.
   - Prueba: `scripts/lucia-prohibidas.test.mjs` con fixtures, `node --test`. Después correr el script sobre `cola/lucia-diario/` y reportar el resultado.
   - Archivos: esos dos. Nada más.

Gasto: ninguna generación de video sin `higgsfield generate cost` y sin OK de SU. Las imágenes de prueba de menos de ~5 créditos por lote siguen la regla de CLAUDE.md (consolidada el 2026-10-09). La excepción es de gasto, no de publicación.

## Quién la aplica

| Paso | Quién | Por qué |
|---|---|---|
| 1 | SU decide (A o B); madre-dev ejecuta en el VPS | Tokens e infra. La sesión Lucía no maneja tokens (regla de secretos y `madre.md:63`) |
| 2 | madre-marketing escribe; SU responde | Es la cola del carril y las decisiones de contenido son de SU. Una sola hoja evita preguntas de a una |
| 3 | madre-marketing muestra; madre-dev publica | Mostrar es de la madre de marketing (D7). El publicador y el token están en el VPS |
| 4 | sesión Lucía (nube) | Render y archivos del carril |
| 5 | sesión Lucía crea; madre-marketing revisa | La skill es del carril; el enrutado lo suma la madre en `onia-router` |
| 6 y 7 | madre-marketing lanza Codex; la madre revisa y commitea | Scripts y verificación, no contenido. Codex corre desde la PC (`codex-tarea.sh`) |

## Prueba de hecho

1. Paso 1: el log de `ig-refrescar.sh` dice «ig-lucia renovado»; `ls -l` muestra `ig-lucia.env` con modo 600; el Access Token Debugger de Meta muestra expiración posterior al 18-oct. No copiar el token ni la fecha de expiración en el chat.
2. Paso 2: `grep -n "D4" cola/loop/lucia.md` muestra «voz Marcela queda» con la fuente `madre.md:75`; D2, D3, D5 y D6 aparecen con su estado.
3. Paso 3: el post aparece en `@lucia.antelo.oficial` con la etiqueta de IA. Su id queda anotado en `cola/loop/lucia.md`.
4. Paso 4: `git ls-tree` en la rama de publicación lista `videos/lucia-entrega/g4-final-1080x1920.mp4` y `g5-final-1080x1920.mp4`. Los SHA empiezan por `ec4c450f` y `6eed3ade`. La revisión de cuadros de G5 queda registrada.
5. Paso 5: `.claude/skills/lucia/SKILL.md` existe y `onia-router` la lista.
6. Paso 6: `node --test scripts/lucia-qa-tabla.test.mjs` en verde. Una corrida real sobre el JSON de `face_identity_qa.py` no falla por estructura.
7. Paso 7: `node --test scripts/lucia-prohibidas.test.mjs` en verde. El script sobre `cola/lucia-diario/` devuelve su resultado sin errores.

## Sin medir (UNKNOWN)

- Fecha exacta de vencimiento del token de IG.
- Si `ig-lucia.env` existe en el VPS.
- Elección A o B del token.
- Gasto actual de Higgsfield.
- Transcript de `session_01XSzFcs1k18ijqjSHGjnzD4`.
