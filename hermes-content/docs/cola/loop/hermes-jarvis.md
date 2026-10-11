# Cola · Hermes-Jarvis

## QA de Onia y turno de noche (desde el 10-oct)

Rol: `hermes-content/docs/HERMES_ROL_QA.md` (madre, PR #187). Sergio Urcullo, 10-oct: *«pasalo a QA pero dale un uso»*.
Un PR por tarea, con el CI en verde y revisión antes de mergear. En el VPS, solo lectura: lo que cambie el crontab,
n8n, el SOUL o `/root/.hermes` va por PR y lo aplica la madre. Orden de la madre: **Q4 primero** entre las que este
carril puede hacer solo. Q1 espera `aplicar` (ver «Bloqueado»).

- [ ] **Q1 Verificar el encendido.** La madre corre `diagnostico` y después `aplicar` desde la PC, entre las 06:30 y las
  22:00 de La Paz (runbook en `TELEGRAM_COMMAND_CENTER.md` §8). Este carril lee los dos logs de Actions con el MCP de
  GitHub y los verifica sección por sección contra la tabla «Qué mirar». Sergio Urcullo escribe las pruebas P2-P5 en
  su Telegram cuando la madre se lo pide. **Hecho:** el log de `aplicar` sin ❌, P2-P5 en verde, y el resumen de las
  06:30 y el cierre de las 21:30 entregados.
- [ ] **Q2 El VPS visible cada día sin la PC.** Un workflow nuevo, `hermes-qa-diario.yml`: `schedule` a las 10:00 UTC,
  el mismo `concurrency: hermes-jarvis` y el runner propio del VPS. Corre SOLO `diagnostico.sh`, sin input;
  `aplicar` y `revertir` siguen manuales. Además, `diagnostico.sh` suma una sección «latidos»: cada línea del crontab
  con su log y la última vez que escribió, y marca MUDO lo que pasó más de dos veces su cadencia. Con esos datos se
  contestan cuatro preguntas:
  1. ¿`claude-guardia` avisa de verdad (credencial de 36 días)?
  2. ¿`vps-backup.sh` respalda `dentalgest-staging-supabase-db` en vez de `supabase-db`?
  3. ¿Dónde escribe el publicador de las :50?
  4. ¿Cuál es la cadencia real de `vigia-aprobaciones`?

  **Hecho:** la primera corrida programada en verde con la tabla, y las cuatro respuestas en «Hallazgos para otros»
  con su dueño. Lo mergea la madre.
  - [x] Código: el workflow y la sección 15, con pruebas. Va en un PR **para que lo mergee la madre** (lo dice el rol).
  - [ ] La primera corrida programada (10:00 UTC del día después del merge) y las cuatro respuestas.
  - **Bloquea (11-oct): el merge de #194, que es de la madre** (el rol lo dice: agrega un workflow programado que entra al
    VPS). No falta ningún secreto ni ningún permiso: el CI está en verde desde el 10-oct a las 21:38 UTC y no tiene
    conflictos. Este carril pushea a una sola rama: mientras #194 no entre, todo lo que pushee va en ese PR.
- [ ] **Q3 Fase 2 de la aduana: que nada le avise por fuera.** Pasan por `onia-tg.sh` los avisos de n8n «Vigia lead sin
  respuesta», «Chatbot: seguimiento» y «Monitor de Salud n8n», y el aviso de «Backup diario» (el respaldo sigue
  corriendo). Los canarios de caída esperan los 30 min de la interrupción 4. **Hecho:** 24 h medidas en su Telegram
  con solo el resumen, el cierre y las cuatro interrupciones, contadas por el diagnóstico programado. Los flujos de
  n8n los cambia la madre, con respaldo.
- [x] **Q4 El resumen de las 06:30 dice lo que nadie empuja.** — `9105f031` (#190) y `2ea796ea` (#192) Va en dos PRs, porque (c) toca el crontab de `aplicar`
  (root en el VPS, revisión fuerte):
  - [x] Q4a/b, solo lectura — `77d02e89` (mañana del 10-oct impresa con la tabla real: el SIN y el token de Lucía en NECESITO):
    - (a) los relojes que vencen en 72 h o menos, de `cola/loop/madre.md` §G. Un rango «13 al 18-oct» cuenta desde el
      13, «sin fecha» no sale, uno vencido sale en 🔴. Los de Sergio Urcullo van en NECESITO; los demás, junto a la
      línea de salud.
    - (b) las colas de `cola/loop/*.md` sin commit hace más de 24 h, en la línea de salud.

    **Hecho:** pruebas con un `madre.md` de ejemplo (el reloj de mañana aparece, uno a 10 días no, uno vencido sale
    en rojo), más una cola parada, y una mañana impresa con la sección.
  - [x] Q4c: un envoltorio de latido en cada línea del crontab que pone `aplicar`, que escribe la fecha y el código de
    salida en `/var/lib/onia-latido/<nombre>`; el resumen nombra los vigías mudos. **Hecho:** una prueba con un latido
    viejo que sale como mudo.
- [ ] **Q5 QA después de cada publicación.** Cada 15 min, un script del VPS compara el `release-<sha>` que corre
  `onia-platform` con el último que vio. Si cambió, abre /dashboard y /checkout con `onia-mirar.js` y la cuenta de
  prueba de QA, con el correo **fijo en el script**, nunca por argumento. Chequea sin LLM la respuesta, que no haya
  texto de error y el tiempo. Una ventana de las :50 sin release se anota; dos seguidas abren tarea para Plataforma y
  una línea en el resumen. Lo roto que no se arregla en 30 min es la interrupción 4. **Hecho:** en el VPS simulado,
  un release roto da un aviso y una ventana fallida da una línea; en vivo, la próxima publicación deja su renglón en
  el log.
  - [x] Código (va en #194 junto con Q2: la madre v4 pidió pushear el 11-oct, y otra rama no hay): `scripts/loops/qa-release.sh` (`/root/bin/onia-qa-release.sh`), su línea en `aplicar` con latido, y
    `onia-mirar.js` a `/root/bin` por el sincronizador. 35 pruebas en el VPS simulado, con la aduana de verdad; tres revisiones (código, seguridad y la revisión de los arreglos).
  - [ ] El diagnóstico muestra las últimas líneas de `/var/log/onia-qa-release.log`, para leer el renglón desde la
    nube. Va después de que entre #194, que cambia `diagnostico.sh`, para no pisarlo.
  - [ ] En vivo: después de `aplicar`, la primera corrida mira el release que corre (/dashboard y /checkout reales con
    la cuenta de QA), y después de la próxima publicación sale el renglón «nuevo».

- [x] **Q6 (madre v4, 10-oct) La prueba de la vía viva de `loops.md` en rojo en `main`.** No era la vía: el script
  que nombra existe y está versionado. `git ls-files` pasó de 1 MB y `execFileSync` cortaba con ENOBUFS, lo que dejaba
  también el gate del integrador en NO MEDIDO y rompía `herramientas-del-cron`. **Hecho:** la prueba en verde y PR.

- [ ] **Q7 La web promete hoy lo que el catálogo deja (11-oct, madre v4).** Volver a mirar la §3 de
  `ONIA_PROMESA_VS_PRODUCTO.md` (lo que `onia.com.bo` prometía el 8-oct y el catálogo no deja) contra la web de hoy,
  renderizada y con captura de cada frase. **Hecho:** la §3 al día, con fecha, captura por fila en
  `hermes-content/docs/research/promesas-web/` y lo que sigue mal en «Hallazgos para otros» con su dueño. Solo lectura:
  páginas públicas.
- [ ] **Q8 Los precios de la web contra los que cobra la plataforma.** `/precios`, `/` y `/chatbot` contra
  `onia-platform/lib/subscription-plans.ts` (`DEFAULT_PLAN_AMOUNTS`) y `lib/pricing.ts` de `master`. CLAUDE.md: dos
  precios vivos del mismo plan es el fallo del 15-ago. **Hecho:** tabla web/código por plan y ciclo, con captura, y
  cada diferencia en «Hallazgos para otros».
- [ ] **Q9 La venta no exhibe obra.** Todas las páginas públicas de `onia.com.bo` y `/login` y `/register` de la app, a
  390 y 1440 px: ni «muy pronto», «beta», «próximamente» o «en construcción» (CLAUDE.md, «La venta nunca exhibe obra»),
  ni vos y usted mezclados en un mismo flujo. **Hecho:** barrido con captura de cada caso y los arreglos en
  «Hallazgos para otros».

## Hallazgos para otros

(Lo que este carril encuentra y le toca a otro dueño. La madre lo reparte en su ronda.)

- **Madre** · `cola/loop/madre.md` §G tiene días de la semana mal: «lun 13-oct» es martes en 2026, y «jue 16-oct»
  es viernes. El resumen ya no los repite (usa la fecha), pero la tabla los muestra así a quien la lea.
- **Madre** · Hasta que `madre.md` llegue a `main` (PR #187), el resumen de las 06:30 va a decir «No pude leer los
  relojes de la madre». Con #187 mergeado, sale solo.
- **Madre / integrador** · En `main` falla `scripts/integrador_puede_mergear.test.mjs` › «la via viva de loops.md
  nombra un script que existe en el repo»: la vía de onia-platform desde casa en `cola/loops.md` no tiene script
  versionado. No está en el CI de Hermes (medido el 10-oct).

- **Madre** · Q5 usa la cuenta «ZZ QA Pago» (`oninteligenciaartificial+qapago@gmail.com`, dental, ADMIN de su
  org, creada por `/register` el 5-oct; `handoff/onia-1.0-nube.md`). El rol la deja «no verificada»: si es otra,
  se cambia la constante `CORREO_QA` de `qa-release.sh`. Su prueba vence el 19-oct; vencida igual lee
  /dashboard y /checkout (`proxy.ts`: «la cuenta vencida lee y exporta»). Necesita el correo confirmado para
  el magic link: si `generate_link` falla, el QA lo dice como NO MEDIDO, no como caída.
- **Madre** · Las ventanas de Q5 leen `/var/log/onia-publicar-solo.log` (lo leen también `deploy_sin_pedido.mjs`
  y el cerebro), pero la foto del crontab del 19-sep tiene `50 */3 * * * /root/bin/onia-publicar-solo.sh` sin
  `>>`. La pregunta 3 de Q2 lo contesta. Si no redirige, cada ventana dice «no puedo leer el log del publicador»
  y hay que agregarle `>> /var/log/onia-publicar-solo.log 2>&1` a esa línea.

- **Madre** · Revisión de seguridad de Q5 (10-oct), lo que ya existía y no es de este carril:
  - `onia-mirar.js` abre sesión con cualquier correo que reciba, y desde Q5 vive en `/root/bin`. Un loop
    de LLM con root podría pedirle una sesión de superadmin. Igual podría leer la clave con `docker exec`,
    así que no es una barrera nueva. Se puede atar a `oninteligenciaartificial+qa…@gmail.com`, pero eso
    rompe su uso a mano con otras cuentas: decide la madre.
  - `onia-mirar.js` manda la clave service role a `https://app.onia.com.bo/supabase/auth/v1/admin/...`, el
    dominio público. Si hay un proxy o CDN delante, la ve. Conviene apuntarlo a la dirección interna de
    Kong y cerrar `/auth/v1/admin` en el proxy (Plataforma).
  - No hay CODEOWNERS: lo que entra a `main` en `scripts/loops`, `scripts/onia-mirar.js` y
    `hermes-content/deploy` corre como root en una hora.
  - `poner` solo prueba la sintaxis de los `.sh`; un `.js` roto reemplaza al que anda. Para Q5 ya no es
    falsa alarma (sale NO MEDIDO), pero un `node --check` en `poner` lo frenaría antes.

## Hecho antes del 10-oct

- [x] P2 de #173: el aviso de rechazo se reintenta si Telegram falla (test fallo → recuperación → segunda corrida) — `31aebd95`, en `main` con el #173
- [x] Runbook de `aplicar` (#174) listo para que la madre lo corra desde la PC — `fecb4813` (§8 de `TELEGRAM_COMMAND_CENTER.md`)
- [x] Formato corto (Pasó · Necesito · Sigue) en lo que Hermes le manda: regla en el SOUL y en el resumen/cierre (`jarvis-resumen.sh`). Inerte hasta `aplicar` — `fa7702ef`
- [x] `diagnostico` muestra el log del recolector de respuestas (pendiente 6 del handoff) — `c0175671`
- [x] `herramientas-desplegadas` lee la fuente del `poner`, no la adivina por el nombre del archivo (pendiente 4 del handoff) — `aa3b6756`
- [x] `parte-diario.sh` fija UTF-8 él mismo: con el cron sin `LANG` (POSIX) su prueba da 5 rojos y se rompe el orden «🔴 primero». Hecho = la prueba verde corrida sin `LANG` ni `LC_ALL` — `2966e768`
- [x] Pendiente 5 del handoff: otras pruebas que miran «proceso vivo» con `kill(pid, 0)` o `kill -0` y darían el rojo falso del zombi en la nube. Hecho = barrido con el resultado anotado en el handoff, y arreglada la que aparezca — barrido del 9-oct: la única es `tandas-v1.test.mjs`, ya arreglada; nada más que arreglar
- [x] El resumen de las 06:30 lee qué sale y qué se graba hoy del plan VIGENTE (`CALENDARIO-PUBLICACION-*.md`, `GRABAR-*.md`), no solo de los `S*-GUIONES.md` (GOAL 8-oct: sale contenido todos los días). Hecho = mañana del 10-oct impresa con lo que dice el calendario, con prueba — `e6f0f970` (y los arreglos de la revisión del formato, `7b3250a9`)
- [x] La respuesta de la rutina de pedidos le llega en Pasó · Necesito · Sigue: prompt de §5 de `TELEGRAM_COMMAND_CENTER.md` y tabla «Qué mirar» de §8 al día (5c con la regla del formato; sección 0 exige el resumen en tres bloques). Hecho = mergeado; inerte hasta que exista la rutina — `f7f891e2`
- [x] El cierre dice qué salió de verdad hoy (los «PUBLICADO <link>» de `ig-reel`/`ig-carrusel`/Buffer), si esa fuente vive en el VPS; si no, anotar dónde vive y qué falta. Hecho = sección con prueba, o el hallazgo anotado en el handoff — `62e7abe1` (la fuente vive en el VPS: `/root/publicar/publicado.jsonl`)
- [x] Handoff del carril con el ESTADO del 9-oct (lo mergeado hoy, lo inerte hasta `aplicar`, lo que depende de Sergio Urcullo) y la skill al día — `bad81c5f`
- [x] Mergear el #176 con el CI en verde (criterio de hecho de todo lo de arriba) y reportar PUBLICADO — `a1aa6246` (CI verde, dos revisiones adversariales arregladas)
- [x] Después del último calendario (16-oct), la mañana no vuelve a los guiones del 29-sep: si hay calendarios y ninguno cubre el día, dice que no hay calendario para hoy. Hecho = prueba con el 17-oct — `5e177b43`
- [x] Las skills de Hermes (`pedir-a-claude`, `agenda-calendario`): los mensajes que le proponen a Sergio Urcullo en Pasó · Necesito · Sigue, sin perder el texto exacto que él aprueba. Inerte hasta `aplicar` — medido el 9-oct: ya cumplen. Sus mensajes son de UN bloque (el sí/no o el código, con el texto exacto) y el de `pedido-claude.sh` también; ponerles títulos sería ruido. Sin cambio
- [x] Diagnóstico: las publicaciones de la ventana (`/root/publicar/publicado.jsonl`, por día y con link) y los timers `pub-*` agendados, para ver desde GitHub si sale una pieza por día (GOAL 8-oct). Solo lectura, con prueba — `c182cbd0`
- [x] Diagnóstico: los títulos `##` del SOUL del VPS contra los del repo (qué secciones le faltan a Hermes), para decidir qué más copia `aplicar`. Solo lectura, con prueba — `2d1b13c4`
- [x] Handoff: ESTADO con el #176 en `main` (qué llega solo al VPS por el sincronizador y qué espera `aplicar`) — `c3dbf081`
- [x] Mergear el PR del diagnóstico 13 y 14 con el CI en verde y reportar PUBLICADO — `fce76971` (#177)

## Verificación de aprendizaje · 2026-10-09
- [x] En la próxima tarea del carril, cargar `equipo-de-agentes` y `aprender-de-todo`; aplicar los checkpoints de la ficha `2026-10-08-orquestacion-e-ingresos-5-posts.md` y registrar allí sesión, contrato, artefacto y verificación. No instalar Foreman ni activar otro orquestador. — aplicado sobre el runbook de `aplicar` (§8: correr `diagnostico` antes); registro en la ficha, «Prueba de uso por sesión», commit de esta línea

## Bloqueado
- **Q1 y las pruebas P2-P5 (`aplicar`).** El texto con que Sergio Urcullo arrancó esta sesión dice: «Nada se aplica en
  el VPS sin el «sí» de Sergio Urcullo en ESTA sesión». Desde el 10-oct, `equipo-de-agentes` §8 agrega que la
  autorización solo vale si él la escribe en la sesión que la usa; un mensaje de la madre o un latido no la
  reemplazan. Falta su línea acá (por ejemplo, «sí, aplicar»). Mientras tanto Q1 queda listo: runbook en §8 y lectura
  de los logs de Actions por el MCP de GitHub.
- «Hoy salió» que vea también lo que Sergio Urcullo sube a mano: leer los medios del día de la API de Instagram con el token de publicar (`/root/.config/onia-publicar/ig-<cuenta>.env`), solo lectura. Usa una credencial fuera de su tarea original: necesita su OK (`HERMES_ROL_QA.md` §6, punto 3).
