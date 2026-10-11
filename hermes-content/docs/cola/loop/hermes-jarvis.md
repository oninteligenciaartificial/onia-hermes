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

## Encargos de la madre DESARROLLO-INFRA (11-oct, van antes que Q7-Q9)

- [ ] **E1 Mirar la publicación de las 06:50 UTC** (#118, #119, #110 y los títulos de usted): confirmar la imagen nueva
  y MIRAR con sesión la agenda del día, el odontograma, la caja diaria y /login, a 390 y 1440 px. No se arregla nada.
  - [x] Antes (04:53 UTC): /login a 390 y 1440 se ve bien. Íconos como glifos (ninguna ligadura como texto), todo
    de usted, sin obra. Huella del build: `webpack-2a706587264c6b91.js`. Capturas y script en
    `hermes-content/docs/research/qa-publicacion/2026-10-11/`. modelos: ninguno (script propio).
  - [ ] Después (desde las 06:57, con el latido): la huella nueva confirma desde afuera que cambió el build, y /login
    a 390 y 1440 otra vez.
  - **Bloqueado para este carril: las pantallas con sesión y «la imagen en el VPS».** `onia-mirar.js` lee la clave
    service role con `docker exec` en el VPS, y la sesión de la nube no entra por SSH (rol, §3). El MCP de GitHub no
    despacha workflows (403), así que tampoco puedo pedirle el `docker inspect` al diagnóstico. Lo hace la madre desde la
    PC: `node /root/onia-mirar.js oninteligenciaartificial+qapago@gmail.com /agenda` (y `/patients/<id>/odontogram`
    y `/caja-diaria`, la ruta que trae onia-platform#110), o Q5 (#194), que lo hace solo cuando entre y corra `aplicar`.
  - Trampa medida (11-oct): el Chromium de la nube no valida el certificado del proxy de salida
    (`ERR_CERT_AUTHORITY_INVALID`). Funciona si cada pedido lo hace Node, con `context.route("**/*", r =>
    r.fulfill({ response: await r.fetch() }))` y `NODE_EXTRA_CA_CERTS`. La verificación TLS sigue entera. El
    «[SW] registration failed» que aparece así es del interceptor, no de la app.
- [x] **E2 Revisión de PRs sin mergear:** #191 (Ventas), #162 (bot C16c), #145 (SIAT CAFC), #172 (Marca), #144 (Lucía).
  Una lente por PR, dos en #162 y #145, y cada HIGH verificado en el código por un segundo subagente (11-oct, 04:50-05:20
  UTC; heads 255fced9, 5d5a11ce, 2f3db8fd, a9c11f31, 66f17096). Nada se mergeó ni se comentó en GitHub.
  modelos: sonnet ×7 (revisión), haiku ×4 (verificación de cada HIGH). codex: ninguno.

  | PR | Veredicto | HIGH verificados |
  |---|---|---|
  | #162 bot C16c | **BLOQUEAR** | 3 |
  | #145 SIAT CAFC + publicador | **CAMBIOS** | 2 (+1 que bajó a MEDIUM) |
  | #191 Ventas | CAMBIOS | 0 |
  | #172 Marca | CAMBIOS | 0 |
  | #144 Lucía | CAMBIOS | 0 |

  **#162 (bot, BLOQUEAR).** Lo que promete no llega a producción, y arreglado a medias calla clientes.
  - HIGH: el silencio de la bandeja huérfana nunca dispara con Chatwoot y la base conectada. `bot-engine.mjs:729` pide
    `channel === "whatsapp"` o `channelType`, pero `chatwoot-adapter.mjs:215` manda `"chatwoot"` y `channelType` no se
    guarda (`persistence.mjs:92-130` y `512-524`; `run-turn.mjs:278-285` no lo copia). Repro: tres turnos contestan; calla
    solo con la base caída (`bot-engine.mjs:95`). Los tests pasan con `channel:"whatsapp"` y el store en memoria.
  - HIGH (latente, se activa al arreglar el anterior): un 404 que no es JSON (proxy, Traefik en el swap) marca la
    bandeja como huérfana y calla a todos los WhatsApp por los 5 min del cache (`knowledge.mjs:784`, `790-799`, `812`,
    `905`/`945`). Arreglo: huérfana solo con el JSON `{"error":"Inbox sin organización"}` de
    `onia-platform/app/api/chatbot-knowledge/published/route.ts:74`.
  - HIGH: la guarda de la bandeja de ventas de Onia (`knowledge.mjs:691-694`, usada en `:787`) lee
    `ONIA_WHATSAPP_INBOX_ID`, que no llega al bot. No la pasan ni `webhook-server.sh:294-344` ni `run-turn.sh:71-78`, y
    `ADMINISTRAR_PARA_VENDER.md:314` dice que no está en el contenedor. No se midió el `--env-file` del VPS.
  - MEDIUM: «siempre vende» exige `ONIA_KNOWLEDGE_URL`, vacía por defecto (`webhook-server.sh:308`). El silencio solo
    deja `audit_logs`, sin aviso. Preexistente: con el cache frío, un 5xx o un timeout en la bandeja de un cliente
    deja pasar el guion de venta de Onia (`knowledge.mjs:1287-1319`), una fuga hacia el cliente final.
  - Merge limpio: `main` no tocó `vps-ops/bot` desde `d3ea768`. Tests: 257/257.

  **#145 (SIAT + publicador, CAMBIOS).** Separar el publicador (3 archivos, corre como root) del resto.
  - HIGH: el reintento nuevo del publicador se salta la guarda de precio y venta. `correr_con_reintento`
    (`publicar-solo.sh:525-535`, llamado en `:621`) reintenta `publicar.sh` hasta 3 × 900 s, pero la guarda (`:540`
    precio, `:585` venta) corre una sola vez. Cada reintento publica el `origin/master` de ese momento
    (`deploy-vivo.mjs:431-433`, `publicar.sh:94`). Un cambio de `lib/pricing.ts` que entre en esos ~30 min sale sin firma.
  - HIGH: un paquete rechazado por el SIN quema su bloque de números CAFC. Se reserva en `fase1-runner.mjs:1955` antes
    del POST, sin devolución. Los reintentos reservan otra vez (`:1361-1375`). El README pide 15.060 números por
    sector con un rango de 1-15100: 40 de margen.
  - MEDIUM (era HIGH, verificado como parcial): el cursor CAFC vive solo en el checkpoint (`:1827-1838`, sin él en
    `emptyState`, escritura no atómica en `:989-990`). Falla cerrado sin conciliación (`:1136-1144`, `:2242`). Repite
    números solo con una copia vieja del checkpoint que tenga conciliación y no tenga cursor.
  - MEDIUM: el cursor va por código y no por rango (`:1828`, `:779-805`) y no se ajusta a `desde`. `SIAT_PILOT_CAFC`
    suelto como respaldo (`:814-819`). `validarInmediata` bloquea el caso por un error de red (`:1183-1189`).
  - MEDIUM: 10 bundles de onia-platform (~364 KB cada uno, 8 de 10 no se verifican solos) y ~25,6 MB de PNG en
    `docs/cola/`. Mejor no mergear los bundles a `main`. El parche del presupuesto público (`proxy.ts`, `token.ts`)
    necesita `security-reviewer` en su PR de onia-platform.
  - LOW: `publicador-reintento-build.test.mjs` no está en `package.json` (el CI no lo corre). Confirmar que el
    teléfono 71654992 del bundle w1-integrado es de prueba.
  - Tests: SIAT 458/458, publicador 3/3, freno de precio 29/29. Sin secretos. Merge limpio.

  **#191 (Ventas, CAMBIOS, sin HIGH).** Las cifras cuadran: 271/62 y 417/41 recalculadas, y las 18 fichas se
  regeneran idénticas. El detector de promesas da 0 y no hay voseo ni competidores en lo visible.
  - MEDIUM: la clase «control / agenda / orden» suma 3 anuncios de Doctocliq que no son de control
    (`biblioteca-estadisticas.mjs:27`). Son 9/3, no 12/5, aunque sigue fuerte (p = 0,0005). Huli figura
    `lista_completa` con 16 de 20 (`BIBLIOTECA-10OCT.json:1732-1736`).
  - MEDIUM: falta barrer en `ADQ:566` (titular viejo de A1) y en `ONIA_PLAN_1.0_Y_CAJA.md:94` (el «20 %» que §5.7
    corrigió). N3 muestra agenda, fichas y cobros, pero solo pide A-04 y A-08 de la tabla de promesas.
  - LOW: renders de A1/A2 con voseo y «Enviar yo mismo» (compuerta declarada en CAMPANA-1); N2 con precios en la
    imagen. 31 nombres de profesionales en el JSON. Detalles de los scripts.

  **#172 (Marca, CAMBIOS, sin HIGH).**
  - MEDIUM: `scripts/marca-personal/captura-editor.py:56,61,92-96` pinta cualquier ruta (`.env`, `/etc/...`) en una
    imagen que se publica. Probado con un `.env` falso. Arreglo: `realpath` + `commonpath` + `git ls-files
    --error-unmatch`, y negar `.env*`, `*.pem` y `*.kdbx`.
  - MEDIUM: la lámina 4 dice «44 en total» y hoy son 64. Hay PNG de un borrador con `[X]`/`[Y]` en `out/` y
    `carousel_publish.js` no frena borradores. Quedan 2 `[CONFIRMAR…]` dentro del bloque para pegar de los avisos.
  - LOW: «17 archivos» sigue en `CLAUDE.md:497` y `git-autosync.js:71` (son 19). Ruta absoluta en
    `cuadro-prueba-tramo-03.html:6`.
  - Tests: `carousel_render` 45 ok.

  **#144 (Lucía, CAMBIOS, sin HIGH).** Los publicadores no retroceden (`--selftest` ok; la compuerta `--publicar` y la
  cuenta, iguales; el token no se filtra).
  - MEDIUM: si Instagram no confirma `is_ai_generated`, `ig-reel.mjs:~64-70` sale 0 con solo un `console.error`, y
    Lucía puede salir sin la etiqueta IA y sin aviso. `ig-carrusel.mjs` ahora importa de `ig-reel.mjs`: copiar uno
    solo rompe los carruseles de @sergiourcullo.
  - MEDIUM: el gasto del 8-oct (86,5 cr; ~47 de video y 27,75 de `sync_so`, que no se pudo cotizar) se hizo con un tope
    que puso la sesión. CLAUDE.md pide aprobar cada video. «Cada generación se cotizó» no vale para `sync_so`, y
    16,59 cr de otra mano quedan sin atribuir. Rumbo: 0 de 8 piezas venden Onia, contra la instrucción del 10-oct.
  - MEDIUM-LOW: `videos/lucia-entrega/` trae las v1 marcadas «NO publicar» (51 MB). LOW: el `payload=` de ElevenLabs en
    `_urls.tsv`. `face-gate.sh` hace `pip install` sin versión fija y baja ~280 MB (insightface es de uso no comercial).
  - Peso: +193,6 MB (3 % del repo).

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
    dominio público. Medido el 11-oct: `app.onia.com.bo` responde `server: cloudflare`, así que Cloudflare la ve. Conviene apuntarlo a la dirección interna de
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
