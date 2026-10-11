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
- [x] **Q4 El resumen de las 06:30 dice lo que nadie empuja.** — `9105f031` (#190) y `2ea796ea` (#192) (**código en `main`,
  inerte hasta que `aplicar` instale su cron: Q1**; el «hecho» de esta línea es el del rol, pruebas y una mañana impresa).
  Va en dos PRs, porque (c) toca el crontab de `aplicar`
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

- [x] **E1 Mirar la publicación de las 06:50 UTC** (#118, #119, #110 y los títulos de usted): confirmar la imagen nueva
  y MIRAR con sesión la agenda del día, el odontograma, la caja diaria y /login, a 390 y 1440 px. No se arregla nada.
  - [x] Antes (04:53 UTC): /login a 390 y 1440 se ve bien. Íconos como glifos (ninguna ligadura como texto), todo
    de usted, sin obra. Huella del build: `webpack-2a706587264c6b91.js`. Capturas y script en
    `hermes-content/docs/research/qa-publicacion/2026-10-11/`. modelos: ninguno (script propio).
  - [x] Antes también de /book (05:10 UTC): 200, «Reservas en línea | Onia», todo de usted, íconos como glifos, sin
    desborde a 390. El script ahora es `mirar-publico.mjs` (cualquier ruta pública; `BASE=` para otro dominio).
  - [x] **Después (06:58 UTC, latido; `modelos: ninguno (script propio)` · `codex: ninguno`).** Capturas en
    `hermes-content/docs/research/qa-publicacion/2026-10-11/despues-0650-{login,book}-{390,1440}.png` y `despues-0650-publico.json`.
    - **La imagen nueva está viva.** `app.onia.com.bo/manifest.json` y `/sw.js` dan el mismo SHA-1 que `onia-platform` `master` en `a7d8c1ed`
      (`577e425e…` y `84634c4e…`) y distinto del de `282ae3ab^` (antes de #136); `Last-Modified` 06:55:58 GMT. Es decir: #136
      (agenda del día, odontograma, caja diaria, app instalable, bandeja) y #146 (títulos de usted) están en producción desde ~06:56 UTC.
    - **Corrección de mi propio método:** el `webpack-2a706587264c6b91.js` fue el MISMO antes y después. Esa huella NO prueba un build nuevo; la
      skill decía que sí. Corregida en `onia-hermes-jarvis/SKILL.md` y en el encabezado de `mirar-publico.mjs`.
    - `/login` y `/book`, a 390 y 1440 px: 200, sin desborde horizontal, íconos dibujados como glifos, sin textos de obra, sin tuteo visible, de usted.
      El título, la tarjeta al compartir y la descripción pasaron de «tu negocio» a «su negocio» (#146). Tiempos 2,5-4,1 s. Capturas miradas una por una.
    - **Release:** no se pudo leer el tag `release-<sha>` (sin SSH al VPS). Por la huella de `public/` corre `master` `a7d8c1ed` (o uno con los mismos `manifest.json` y `sw.js`).
    - LOW: el campo de correo de `/login` trae el ejemplo `tucorreo@ejemplo.bo`, que se lee como «tu correo» en una pantalla de usted.
    - El «[SW] registration failed» de la consola es del interceptor de mi Chromium (ya anotado), no de la app.
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

- [x] **E3 Revisión de #136 y #146, y relectura de #162, #191 y #172** (11-oct, 05:00-05:50 UTC; heads 1fd14770,
  b0e021f2, 5d5a11ce sin cambios, f84f9c8f, 00106d76). Nada se mergeó ni se comentó en GitHub. #136: 4 lentes sonnet
  (caja y pagos · backend de la bandeja · PWA, proxy y odontograma · UI y textos); cada HIGH lo verificó un haiku que
  cita líneas. #146, #191 y #172 los leí yo. modelos: sonnet ×4, haiku ×5. codex: ninguno.

  | PR | Veredicto | HIGH verificados |
  |---|---|---|
  | onia-platform #136 (5 pantallas) | **CAMBIOS** | 2 (+ 1 compuerta que no se puede medir desde la nube) |
  | onia-platform #146 (títulos de usted) | APROBAR | 0 (3 LOW) |
  | onia-hermes #162 (bot) | **BLOQUEAR**, igual que en E2 | 3 (la cabeza no cambió: `5d5a11ce`) |
  | onia-hermes #191 (Ventas) | CAMBIOS, sin HIGH | 0 |
  | onia-hermes #172 (Marca) | CAMBIOS, sin HIGH | 0 |

  **#136 (CAMBIOS).** Seguridad entre organizaciones, webhook, SSE, service worker, proxy y XSS: sin hallazgo grave.
  La firma HMAC va con `timingSafeEqual` y falla cerrada; el service worker no guarda nada autenticado; las 26 páginas
  `/dev` dan 404 en producción; ningún texto de mensaje llega a HTML.
  - HIGH (verificado): **en la caja diaria, escribir «1.500» cierra la caja con Bs 1,50 y no hay vuelta.**
    `CajaDiariaClient.tsx:40-44` (`parseMoney`): «1.500» → 1,5; «1,500» → 1,5; «1.500,50» → NaN y el botón queda
    apagado sin decir por qué (corrido con node). El esquema acepta 1,5 (`caja-diaria/route.ts:35`:
    `min(0).multipleOf(0.01)`). El botón no pide confirmación (`CajaDiariaClient.tsx:704-707`, `:726`) y no existe
    reabrir (`caja-diaria/route.ts:39` solo admite open, correctOpeningFund, expense, close; segundo cierre: 409 en
    `:316`). Quien cierra con el rol de caja no ve el esperado (`:152` lo pone en null sin `approvals.decide`;
    `lib/onia-core/roles.ts:37`), así que no nota el error. Desde el cierre, `POST /api/payments` del día responde
    409 (`payments/route.ts:73`, `:172-173`): los cobros manuales de hoy se frenan hasta la medianoche. Los webhooks
    de PagosNet y Circle siguen grabando (por eso «cobros manuales», no «todos»).
    Arreglo: leer el monto en formato es-BO (el punto de miles se quita si le siguen 3 dígitos; la coma es decimal) o
    rechazar «1.500» ambiguo; mostrar bajo el campo el monto leído; paso de confirmación «Se cerrará con Bs X. No se
    puede reabrir»; `disabledReason` en los tres botones (`:359`, `:643`, `:726`); y una acción `reopen` solo para
    `approvals.decide`, con auditoría.
  - HIGH (verificado): **borrar un paciente borra sus caras del odontograma sin avisar.** `schema.prisma:938`
    (`ToothSurfaceRecord`, `onDelete: Cascade`) y la migración `20261006220000…/migration.sql:21`. El borrado
    se frena con `lib/platform/borrado-bloqueado.ts:126-131`, que lista `toothRecord` y otros con `expediente: true`
    (RM 0090/2008 art. 31) pero no las caras. `/api/teeth/surfaces` crea una cara sin `ToothRecord`
    (`teeth/surfaces/route.ts:52-53`, `:65`; el editor también, `odontogram-editor.ts:33-35`). Un ADMIN que borra
    un paciente que solo tiene caras (`patients/[id]/route.ts:164-178`) las pierde en cascada. El CI **no** lo
    atrapa: el test deriva solo relaciones sin cascada (`borrado-bloqueado.test.ts:73-74`, `continue` si hay
    `onDelete:`) y su lista `EXPEDIENTE` (`:119-125`) es manual. Arreglo: sumar `toothSurfaceRecord.patientId` con
    `expediente: true` y que el test derive también los hijos con cascada.
  - **Compuerta que no se mide desde la nube:** el PR trae dos migraciones (`20261004190000_add_daily_cash`,
    `20261006220000_add_tooth_surfaces`) que `master` no tiene. Su descripción dice que se aplicaron el 10-oct, con
    respaldo, y que están en `_prisma_migrations`; el CHANGELOG del PR todavía dice «NO merge sin migración previa».
    Si no estuvieran, la publicación de master las pide: sin `payments.userId` falla toda lectura de pagos y sin
    `tooth_surface_records` cae el odontograma. Lo mide la madre en el VPS, solo lectura:
    `docker exec supabase-db psql -U postgres -c "select migration_name, finished_at from _prisma_migrations where
    migration_name in ('20261004190000_add_daily_cash','20261006220000_add_tooth_surfaces')"`.
  - MEDIUM (verificado, bajaron de HIGH):
    - Cobro y cierre se cruzan: `payments/route.ts:69-75` lee `closedAt` sin lock y el cierre bloquea la fila con
      `FOR UPDATE` (`caja-diaria/route.ts:314`) y lee los cobros sin ver el que no se commiteó (`:319`). La ventana es de
      milisegundos y no pierde plata: deja un cobro en efectivo en un día cerrado y un sobrante falso. Arreglo: `FOR SHARE`
      sobre la fila de la caja en payments, antes de leer `closedAt`.
    - `DELETE /api/payments/[id]` (`[id]/route.ts:21-37`) borra cualquier pago de un día cerrado, sin chequear la caja
      y sin auditoría (el archivo no importa `lib/audit`); el `GET` recalcula el efectivo con los pagos vivos
      (`caja-diaria/route.ts:131-154`) y el descuadre del dueño deja de coincidir con el cierre guardado. Los
      webhooks (`pagosnet:118`, `circle:116`) crean pagos «OTRO» en día cerrado: no tocan el efectivo.
    - Reenvío de plantilla paga: si la red se corta después de que el servidor envió, o un 502 de Traefik llega sin JSON,
      el botón queda libre (`InboxClient.tsx:380-392`; solo `:383` activa `plantillaIncierta`) y un segundo clic manda
      la misma plantilla (`PlantillasBandeja.tsx:161`, `:197`). `NuevaConversacion.tsx:52-55` ya marca «incierto» ante
      cualquier fallo sin respuesta; falta lo mismo aquí. El tope es 10 por hora por persona
      (`envio-pagado.ts:33`) y la plantilla la paga el cliente en su propia cuenta de Meta.
    - Backend de la bandeja: el aviso en vivo no invalida el cache de 30 s, así que el detalle vuelve viejo
      (`webhooks/chatwoot/eventos/route.ts:65-68`, `conversation-ownership-cache.ts:12-15`); «en vivo» se declara por
      tener la variable de entorno y no porque lleguen eventos, así que un secreto viejo deja todas las bandejas a 60 s
      y sin aviso (`bandeja/eventos/route.ts:33-34`, `InboxClient.tsx:340`); un inbox reclamado por dos organizaciones
      sigue abierto a las dos (`bandeja/eventos/route.ts:32`, `bandeja/[id]/route.ts:63-77`).
    - Textos: errores en inglés (`Failed to fetch`, `Load failed`) en la bandeja y la caja
      (`InboxClient.tsx:392`, `PlantillasBandeja.tsx:113-119`, `CajaDiariaClient.tsx:62-99`); cartel rojo que no se
      borra al recuperarse (`InboxClient.tsx:287`, `:700`, `:727`); Enter envía una plantilla paga sin confirmar
      (`PlantillasBandeja.tsx:159-164`); la fecha de un cobro la escribe el usuario y define el día de la caja
      (`payments/route.ts:20,65`); solo se puede cerrar la caja de HOY (`caja-diaria/route.ts:230`).
  - LOW: la baja de la suscripción push no ocurre al cerrar sesión, y en una PC compartida de recepción el siguiente
    usuario ve las alertas de cita del anterior (`Sidebar.tsx:137-145`, `lib/push.ts:26-60`; preexistente). Versión del
    service worker a mano (`sw.js:5`, `:38-43`). `PLATFORM_LAYER` apagado dejaría `/api/teeth` sin guard de rubro
    (`teeth/route.ts:26`, `:68`; producción lo tiene en «1»). Avatar roto con nombres que empiezan con emoji
    (`PropuestaCard.tsx:62-68`). El script `chatwoot-webhook-eventos.mjs:16-18` no valida que la URL sea https.
  - Dos citas de línea de las lentes no existían (`teeth/surfaces/route.ts` tiene 89 líneas, no 147; `NuevaConversacion.tsx`
    tiene 132): los verificadores las corrigieron arriba. Una lente afirmó que «el CI lo atraparía» y era falso.

  **#146 (APROBAR).** Solo textos, sin lógica ni migración; CI en verde; se mergea limpio con #136 (probado con
  `git merge-tree`). Tres LOW:
  - `public/manifest.json:4` sigue diciendo «…que maneja tu negocio» y es lo que lee el cuadro de instalación de la app. El
    gate no lo mira (`titulos-publicos-de-usted.test.ts:12` solo lista `layout.tsx` y el portal). #136 reescribe ese
    archivo y deja la línea igual.
  - `titulos-publicos-de-usted.test.ts:14`: la expresión usa `\b` de JavaScript, que no reconoce la tilde, así que «tú
    decides» no se detecta (probado). Con lookarounds de letras, como el trinquete de voseo, y sumando `tú` queda cerrado.
  - Las otras páginas con título propio (`book/layout.tsx`, `presupuesto/[token]/page.tsx`, `checkout/page.tsx`) hoy ya son
    de usted pero no están bajo el gate.

  **#191 y #172 (solo seguridad y datos; el contenido es de la madre de Marketing).** Sin secretos en lo agregado de
  ninguno (barrido de patrones). En #191, los números largos que parecen teléfonos son ids de la Biblioteca de
  anuncios; el único teléfono es el del bot, que es público (`+591 75414930`). Los scripts nuevos de #191
  (`anuncio-render.js`, `biblioteca-*.mjs`) no leen rutas externas. **En #172 el hallazgo de E2 sigue vivo:** los dos
  commits nuevos solo tocan JSON, PNG y un `.md`; `captura-editor.py` sigue sin guarda: `:49` (`b['archivo']`), `:69`
  (`arch`), `:83` y `:86` (`{ruta:…}`, `{n:…}`) leen cualquier ruta del JSON de la lámina, `.env` incluido, y la
  pintan en una imagen que se publica.

- [x] **Q7 La web promete hoy lo que el catálogo deja (11-oct, madre v4).** Volver a mirar la §3 de
  `ONIA_PROMESA_VS_PRODUCTO.md` (lo que `onia.com.bo` prometía el 8-oct y el catálogo no deja) contra la web de hoy,
  renderizada y con captura de cada frase. **Hecho:** la §3 al día, con fecha, captura por fila en
  `hermes-content/docs/research/promesas-web/` y lo que sigue mal en «Hallazgos para otros» con su dueño. Solo lectura:
  páginas públicas.
  - **Hecho (11-oct, 05:20-05:45 UTC):** §3 de `ONIA_PROMESA_VS_PRODUCTO.md` al día, con una columna «11-oct» y la
    captura de cada fila en `hermes-content/docs/research/promesas-web/2026-10-11/`. 8 de 9 filas siguen igual; cambió
    `/register` paso 1 (ya es de usted). Filas nuevas: la web de vos contra el alta de usted, el `manifest.json` y la
    pestaña de /login. Script: `research/qa-publicacion/2026-10-11/mirar-publico.mjs`.
- [x] **Q8 Los precios de la web contra los que cobra la plataforma.** `/precios`, `/` y `/chatbot` contra
  `onia-platform/lib/subscription-plans.ts` (`DEFAULT_PLAN_AMOUNTS`) y `lib/pricing.ts` de `master`. CLAUDE.md: dos
  precios vivos del mismo plan es el fallo del 15-ago. **Hecho:** tabla web/código por plan y ciclo, con captura, y
  cada diferencia en «Hallazgos para otros».
  - **Hecho (11-oct):** §3.1 del mismo doc. Cero diferencias: los 5 planes por ciclo (mensual, anual, semanal), los 4
    add-ons y los topes de fichas, usuarios y recordatorios coinciden con `subscription-plans.ts`, `pricing.ts` y
    `plan-catalogo.ts` de `master` `d8ca5a32`. No se pudo comparar `/checkout` (pide sesión): lo hace Q5.
- [x] **Q9 La venta no exhibe obra.** Todas las páginas públicas de `onia.com.bo` y `/login` y `/register` de la app, a
  390 y 1440 px: ni «muy pronto», «beta», «próximamente» o «en construcción» (CLAUDE.md, «La venta nunca exhibe obra»),
  ni vos y usted mezclados en un mismo flujo. **Hecho:** barrido con captura de cada caso y los arreglos en
  «Hallazgos para otros».

- [x] **L1 El chequeo de la web contra el producto, como script (Codex Luna, 11-oct, madre DESARROLLO-INFRA).** Q7 y Q8
  costaron ~40 min a mano. Contrato: `hermes-content/docs/handoff/codex-tareas/hermes-L1-web-vs-producto.md`. Lo lanza la
  madre. **Hecho:** su prueba en verde y el script reproduciendo la §3 y la §3.1 de `ONIA_PROMESA_VS_PRODUCTO.md`; después
  se corre contra la web en vivo y se compara con lo escrito a mano. La madre lo corre en la rama
  `codex/hermes-qa-web-vs-producto`, que sale de esta (`claude/adoring-ramanujan-7sjzwv`), y avisa con el PR (11-oct ~06:20 UTC).
  **Revisado el 11-oct ~06:35 UTC** (commit `782dd348`, `modelos: ninguno (226 líneas, las leí y las corrí yo)` · `codex: hermes-L1b`):
  la prueba da 6/6 (en mi copia dio 1/6 hasta que le puse la carpeta de textos; la prueba la lee de la raíz del repo) y, contra el código REAL
  de `onia-platform` `master`, el script da 0 diferencias de precio, 0 textos de obra, 8 promesas que siguen y 1 manual: igual que mis Q7 y Q8
  a mano. Los seis extractores de add-ons caen hoy en el campo correcto. **Pero no está listo para un latido:**
  - **Verde falso (medido):** sin `--platform` compara contra `fixtures/` (línea 197). Con Crece mensual 550→560 en el código: con
    `--platform` da «web 550, código 560» y exit 1; sin la bandera da «0 diferencias de precio» y exit 0.
  - `--base` no corre completo: `/register` en `onia.com.bo` da 404 (medido) y un solo fallo tumba las nueve páginas; `fetch` sin tope de tiempo.
  - Los extractores toman la primera coincidencia del archivo: `setupFrom` está dos veces en `pricing.ts` (3500 y 4500) y acierta por orden.
  - Los topes se comparan con números fijos del propio script, no con `plan-catalogo.ts` (lo que la madre ya dijo); hoy coinciden
    (300/2/200 · 800/4/400 · 1500/5/800 · sin tope).
  - La prueba no corre en el CI (ni en `package.json` ni en el workflow).
  Contrato de arreglos: `handoff/codex-tareas/hermes-L1b-web-vs-producto-arreglos.md`. **No lo copio a #194** (lo agrandaría y no es Q2 ni Q5):
  `782dd348` es un solo commit; la madre lo pone sobre `main` cuando #194 entre, junto con L1b.
  **Cerrado el 11-oct 10:00 UTC (`modelos: ninguno (lo corrí yo)` · `codex: hermes-L1b y L1c`).** Los tres huecos de arriba los cerraron L1b (verde falso, `--base-web` con tope de tiempo, topes desde `plan-catalogo.ts`, prueba en el CI) y L1c (HTML real). **Corrida en vivo, con el HTML que sirve `onia.com.bo` ahora** (`--base-web https://onia.com.bo`)
  **y el código de `onia-platform` `master` `fd72cd55`** (los tres archivos de `lib/` sacados con `git show`): exit 0, 0 diferencias de precio, los cuatro topes «coincide» (300/2/200 · 800/4/400 · 1500/5/800 · sin tope), 0 textos de obra y 7 promesas «sigue»; `registro-nombre` queda informativa («no medible sin navegador»): la medí aparte en E11 y el paso 2 de `/register` sigue con «Nombre de tu clínica».
  Igual que mis Q7 y Q8 a mano. Entra a `main` con #194.
- [x] **L1b Arreglos del chequeo web-vs-producto (Codex Luna).** Contrato `handoff/codex-tareas/hermes-L1b-web-vs-producto-arreglos.md`; commit
  `6f64e094` en `codex/hermes-qa-web-vs-producto`. **Revisado el 11-oct ~07:05 UTC** (`modelos: ninguno (409 líneas, las leí y corrí yo)` · `codex: hermes-L1c`),
  en un directorio aparte con el código REAL de `onia-platform` `master`: la prueba da **13/13**; sin `--platform` sale 2 con «NO MEDIDO: falta --platform»;
  con `--platform` y los textos del 11-oct, exit 0 y los cuatro topes «coincide» (300/2/200, 800/4/400, 1500/5/800, sin tope); mutación de precio (Crece 550→560) → exit 1;
  mutación de tope (`crece.users` 4→5) → «DIFIERE», exit 1; un `setupFrom: 9999` agregado antes de `ENTERPRISE_PLAN_PRICE` no mueve el resultado, y sin esa
  constante da NO MEDIDO, exit 2. **Los cuatro puntos que yo había medido están cerrados.** Lo que NO funciona:
  - **`--base-web` con las páginas reales** (las bajé con `curl`, las serví en local): exit 2, «no se pudo ubicar el plan Básico…», los topes «no medida» y
    **`whatsapp-24h: no está`, que es falso** (la frase está). `htmlATexto` no equivale al `innerText` que usan los extractores (títulos y precios en la misma línea, espacios dobles). La prueba
    de L1b pasaba porque su HTML era inventado: **el mismo error de método que C3, y también de mi contrato**. Falla cerrado salvo por ese «no está» falso.
  - Menores: `--base-app` se acepta y no se usa; con exit 2 la última línea sigue diciendo «0 diferencias de precio» (la sección PRECIOS sí avisa «no medidos por completo»).
  Contrato: `CODEX-CONTRATO: hermes-content/docs/handoff/codex-tareas/hermes-L1c-web-vs-producto-html-real.md` (Luna, `estado: pendiente`); fixtures: el HTML real de las ocho
  páginas en `research/promesas-web/2026-10-11/html/`. **Integración:** la madre pidió cherry-pick de `782dd348` + `6f64e094` a #194; **lo hago cuando vuelva L1c, con los tres commits juntos**: así
  no entra a #194 un modo roto, y nada consume L1 todavía, así que no se pierde tiempo. Choca con #196 (C1-C3) en `package.json` y en la lista del workflow: dos líneas, se juntan sumando los dos nombres.

- [ ] **Q9b El alta de usted.** ~~Contrato `handoff/codex-tareas/plataforma-Q9-alta-de-usted.md`~~ **No se lanza** (aviso de la madre
  DESARROLLO-INFRA, 11-oct ~06:20 UTC): U4 (Codex, commit `a024292d`, rama `codex/usted-registro-y-entrada`) ya pasó `SignupForm.tsx`
  a `voc.negocioSu` en las tres líneas. **Lo que yo pude comprobar desde la nube:** esa rama NO está en `origin` (solo en la PC de la
  madre) y `master` `c94b9daa` sigue con `voc.negocio` en `:362`, `:403` y `:630`; el cambio no se vio. **Se cierra** cuando, después
  de publicar, el paso 2 de `/register` no diga «tu» (`mirar-publico.mjs` más el clic en «Clínica dental»). Si dice «tu», el contrato
  Q9 se relanza.
- [x] **C1-C3 Tres contratos Codex del diagnóstico y el QA diario** (11-oct, madre DESARROLLO-INFRA; `estado: pendiente`,
  los lanza la madre **después del merge de #194**, porque tocan lo que #194 agrega). Ninguno toca Plataforma ni el VPS.
  - `CODEX-CONTRATO: hermes-content/docs/handoff/codex-tareas/hermes-C1-latidos-mudo-test.md` (Luna): la frontera exacta
    de la regla MUDO de la sección 15, con reloj controlado y tres mutaciones. Solo agrega un archivo de pruebas.
  - `CODEX-CONTRATO: hermes-content/docs/handoff/codex-tareas/hermes-C2-main-guard-test.md` (Luna): ejecuta el paso
    «Solo desde main» de `hermes-qa-diario.yml` y comprueba el orden de los pasos (la guarda va antes de la llave SSH).
  - `CODEX-CONTRATO: hermes-content/docs/handoff/codex-tareas/hermes-C3-modelo-por-job.md` (Sol): sección 16 de
    `diagnostico.sh`: por cada trabajo de Hermes y del crontab, su cadencia y su modelo escritos en el VPS, sin llamar
    a ningún modelo. La sesión de la nube queda «no medible desde acá». La madre lo revisa fuerte (corre como root).
  - Los cinco contratos de este carril (con L1 y Q9b) llevan ya la cabecera de `codex-tareas/README.md`. **Hecho:**
    cada prueba en verde en la rama de Codex tras el merge de #194. modelos: ninguno (los escribe este carril).
  - **Revisado el 11-oct ~06:50 UTC (PR #196, head `67009d70`; `modelos: ninguno (lo leí y lo corrí yo)` · `codex: hermes-C3b`).** Apliqué el diff a mi
    árbol limpio y corrí en Linux: `test:jarvis-diagnostico` 6/6, `test:qa-diario-guarda` 10/10, `test:jarvis-modelo` 10/10, `test:jarvis-aplicar` 48/48,
    `test:jarvis-resumen` 63/63, `herramientas-desplegadas` 10/10, `docs-hygiene` 18/18; el árbol quedó como estaba. **C1 y C2: bien** (frontera ±58/62 s con tres
    mutaciones; la guarda se ejecuta y se comprueba el orden con cuatro mutaciones). **C3: no se junta como está.** Es solo lectura y la lista blanca del modelo
    está bien, pero con el crontab REAL no cumple su propósito: `aplicar.sh` instala los seis trabajos envueltos en `onia-latido.sh '<comando>'` y la parte B toma
    siempre `onia-latido.sh` (el comando de adentro es una sola palabra con espacios). Corrí la sección 16 con esas líneas: seis renglones
    `onia-latido.sh | cada … | modelo sin modelo declarado`, y el resumen de las 06:30, que declara `gpt-5-mini`, sale «sin modelo declarado». La prueba no lo vio porque usa
    líneas directas: **el ejemplo mal puesto era el de mi contrato C3**, no un error de Codex. También: la parte A imprime tal cual un `schedule` o un `model` que sea objeto
    (sin lista blanca, a diferencia de la B), y el silencio (sin trabajos, `crontab` vacío) no se distingue de «todo bien».
    Contrato de arreglos: `CODEX-CONTRATO: hermes-content/docs/handoff/codex-tareas/hermes-C3b-modelo-con-latido.md` (Sol, `estado: pendiente`).
    **Sobre el merge:** #196 tiene como base mi rama; el orden natural es #194 y después #196 (C1 y C2 pueden entrar ya, C3 con C3b). No lo junto a #194: lo agranda y C3 corre como root.
  - **C3b revisado el 11-oct ~07:12 UTC (#196, head `7766e875`; `modelos: ninguno (lo corrí yo)` · `codex: ninguno`): ACEPTADO.** Corrí la sección 16 con las seis líneas de cron
    **sacadas de `aplicar.sh`** (no escritas a mano): salen seis trabajos con su nombre y su script de adentro (`resumen-manana → …/onia-jarvis-resumen.sh | cada 30 10 * * * | modelo gpt-5-mini`,
    igual `resumen-noche`; `aduana-soltar`, `agenda-bloques`, `respuestas-pedidos` y `qa-release` con «sin modelo declarado»). Un `schedule` y un `model` que son objetos salen como `(estructura)` y
    la clave de prueba `SECRETO-KEY` no aparece. Con el diff aplicado a mi árbol limpio: `test:jarvis-modelo` 17/17, `jarvis-diagnostico` 6/6, `qa-diario-guarda` 10/10, `jarvis-aplicar` 48/48,
    `jarvis-resumen` 63/63, `herramientas-desplegadas` 10/10, `docs-hygiene` 18/18, `bash -n` sin errores; el árbol quedó como estaba. El texto de la sección 16 no trae `curl`, `wget`, `urllib`, `requests`, `http`, `eval`
    ni `os.system`; el único proceso que lanza es `crontab -l`. **#196 puede mergear cuando entre #194** (base: mi rama).
- [x] **E5 Revisar los PRs abiertos de onia-platform** (latido del 11-oct, paso 2; 06:05-06:30 UTC; heads `2ee1dcfe` #124,
  `a8def40f` #113, `f981cd4a` #140, contra `master` `d8ca5a32`). Cuatro lentes, y cada HIGH verificado. Nada se mergeó ni se
  comentó en GitHub. modelos: sonnet ×4 (revisión), haiku ×1 (verificación de #140). codex: ninguno.

  | PR | Veredicto | HIGH |
  |---|---|---|
  | #140 widget de chat público (W1-W1e) | **CAMBIOS: no publicar todavía** | 2, uno verificado en el código y otro con indicio medido |
  | #113 C13 gracia de 7 días y dejar de renovar | CAMBIOS | 0 (6 MEDIUM) |
  | #124 aceptación de términos en el alta | CAMBIOS | 0 (4 MEDIUM) |

  **#140 (widget público).** Rutas, respuestas, HMAC, Redis cerrado y el script del widget están bien (lista cerrada,
  segmentos validados, solo se devuelven `source_id`/`id`/mensajes públicos, `textContent`, sin cookies, todo de usted).
  Lo que no cierra es la infraestructura, que el propio PR ya dice que falta:
  - HIGH (verificado): los topes por IP no valen nada. `lib/http/client-ip.ts:12-13` da `cf-connecting-ip` tal cual,
    sin comprobar que el pedido vino de Cloudflare (`:23-25` solo corrige el caso IPv6). La clave se usa en
    `app/api/chat-publico/[...ruta]/route.ts:85` y `:105-106`, y el origen se alcanza sin Cloudflare
    (`app/api/auth/register/route.ts:219`). Los topes por organización (`:124`, `:126`, `:130`) siguen valiendo, pero una
    sola máquina los agota: con el id de la organización del snippet, 30 altas de contacto dejan sin chat a esa
    clínica una hora. `route.test.ts:44,69` prueba con IP rotativa. Arreglo: aceptar el encabezado solo si el pedido
    prueba venir de Cloudflare (Traefik que lo borre salvo desde sus rangos, o un encabezado secreto), y un tope por
    organización antes de las consultas.
  - HIGH (indicio medido, no prueba): la API cliente de Chatwoot sigue alcanzable en el host del chat. Un GET a
    `chat.onia.com.bo/public/api/v1/inboxes/<inexistente>/contacts/x` dio 404 en JSON de la aplicación
    (`{"status":404,"error":"Not Found"}`), no el texto de Traefik: llega a Chatwoot. Si es así, un visitante con un
    `source_id` escribe directo y cada tope del PR queda de adorno. Comprobar con el POST que describe el PR y bloquear
    `/public/api/` en Traefik.
  - MEDIUM: dos IPs reales agotan los 600/h de la organización y cada mensaje aceptado llega al bot (gasto de OpenAI)
    (`route.ts:124-126`, `:156`); el descuento del cupo se salta si el cliente corta el pedido (`:147-156`).
  - MEDIUM (verificado parcial): `inboxPublico` no comprueba que la bandeja sea de esa organización
    (`lib/chatbot/inbox-publico.ts:8-13`, sin `orgDelInbox`; `schema.prisma:1237` sin `@unique`). Solo hace falta si dos
    organizaciones ya tienen la misma bandeja cargada; desde afuera no se puede provocar.
  - MEDIUM: el filtro de notas privadas descansa en un contrato de Chatwoot 4.12.1 que nadie midió (fixtures
    reconstruidos; tests «escritos, no ejecutados»). No hay camino de fuga, pero si `after` es exclusivo cada
    conversación pierde su primer mensaje.
  - Al mergear: cualquier organización con el add-on podría encender el canal; ponerlo detrás de una variable apagada.
  - Merge con `master`: limpio (`merge-tree` sin conflictos). #131 y #137 quedan absorbidos por este PR.

  **#113 (C13).** El endpoint es correcto: `requireAdmin` + `config.write` (solo el rol «dueño»), organización solo de la
  sesión, cuerpo de Zod sin asignación masiva, ruta fuera de las públicas y bloqueada en solo lectura, el cron conserva su
  secreto, el correo escapa HTML, y todas las puertas de acceso usan el corte nuevo. Lo que falta:
  - MEDIUM: la guarda de «baja ya vigente» solo existe para `renovar: true` (`app/api/organization/renovacion/route.ts:38-46`).
    Con `renovar: false`, una baja ya efectiva se reescribe a una fecha futura si el operador alargó `planEnd`
    (`admin/clinics/route.ts:242-244`): la cuenta vuelve a escribir gratis hasta esa fecha. Hoy solo la frena
    `proxy.ts:292`, que falla abierto si cae la base. Arreglo: 409 si hay baja vigente, sea cual sea `renovar`.
  - MEDIUM: una baja se pierde frente a una aprobación concurrente (`route.ts:51` compara y escribe sin el candado
    `subscription-plan:<org>`; `activation.ts:201` escribe sin comparar): la ruta responde 200 con auditoría y la
    activación la sobrescribe con `planCanceledAt: null`. Repetir `renovar:false` audita dos veces.
  - MEDIUM: un plan semanal pagado en gracia nace vencido (`plan-state.ts:185-193`: base = `max(planEnd, ahora-7d)`): sale
    «Su plan venció… le quedan 7 días» recién pagado y el cron manda el aviso de vencido horas después. Los tests lo fijan
    como esperado. Pedido a Sergio Urcullo: decidir la gracia del plan semanal.
  - MEDIUM: el aviso de vencimiento sale una sola vez (`renewal-reminders.ts:37,87`); no hay aviso el día 6 ni al cortar,
    y `VENCIDO_MAX_DIAS=7` es un literal aparte de `PAID_GRACE_DAYS`. El corte cae a la hora de la aprobación, pero el
    correo dice «hasta el 8 de noviembre» (`plan-state.ts:88-94`, `email.ts`).
  - MEDIUM (decisión de Sergio Urcullo): renovar fuera de la gracia cuenta desde `hoy - 7 días` y no «desde hoy» como pide
    C13: pagar el día 30 da 24 días más, no 31 (≈ Bs 208 en Profesional mensual). La descripción del PR dice lo
    contrario.
  - MEDIUM: pruebas débiles. El bloque «C13c» pasa también en `master` y `activation.test.ts:512` es circular. El CAS
    está simulado y no hay prueba de ruta contra activación.
  - La descripción del PR está desactualizada: lista voseo («Tu plan venció: renovalo», «seguís») que el código ya no
    tiene (un grep sobre las líneas añadidas dio 0), y «fuera de la gracia cuenta desde hoy». Reescribirla antes de que
    Sergio Urcullo apruebe sobre texto viejo.
  - Merge con `master`: un solo conflicto, `lib/subscription/activation.test.ts` (los dos agregan un `describe` al final:
    «C15b reserva de factura» y «C13c»). Se resuelve dejando los dos. Sin reversiones silenciosas en código.
  - Sin barrer: `docs/ONIA_V1_COBRO_RENOVACION_2026-09-27.md:13`, `docs/ONIA_V1_OFERTA_PUBLICA_2026-09-22.md:164-166`,
    y en la web `faq-datos.ts:62` y `terminos.md` §3.4 (esperan el OK de Sergio Urcullo).
  - Ya está de usted: `voseo-ratchet.linea-base.json` solo baja (PlanClient 14→0).

  **#124 (términos aceptados).** Los tipos coinciden con las tablas (`id`, `organizationId`, `profileId` son TEXT), la
  migración coincide con `schema.prisma`, todo va calificado con `public.`, y la RLS sigue el patrón del repo (`ENABLE` +
  `REVOKE ALL` a `PUBLIC`, `anon` y `authenticated`; el repo no usa `FORCE`). Las dos altas (correo y Google) convergen en
  `provisionOrganization`, con el insert dentro de su `$transaction` (`provisioning.ts:299-308`). Lo que conviene cerrar
  **antes** de aplicarla, porque después cuesta otra migración:
  - MEDIUM: el cascade desde `profiles` borra la evidencia (`migration.sql:23,27`, `ON DELETE CASCADE`): si un segundo
    ADMIN quita al que se registró (`lib/auth.ts:240`, `team/[id]/route.ts:82`), la fila desaparece con la organización
    viva. Arreglo: `profileId` nullable con `SET NULL` y una copia del correo.
  - MEDIUM: `@unique profileId` (`migration.sql:15`) no deja registrar una versión nueva de los términos sin otra
    migración: `@@unique([profileId, version])`.
  - MEDIUM: la IP sale de `clientIp()` sin `isIP` ni tope de largo (`app/api/auth/register/route.ts:354`) y la guarda como
    evidencia legal; es el encabezado que el propio repo considera falsificable. Arreglo: `isIP(ip) ? ip : null`, máximo 45.
  - MEDIUM: el encabezado de la migración dice solo «APLICAR MANUALMENTE» (`migration.sql:1`): si el código sale antes
    que la tabla, cada alta da 500 y borra el usuario de Auth. Las migraciones anteriores dicen «APLICAR ANTES DEL SWAP».
  - LOW: el sello `20261008000000` ordena antes de `20261009110000_subscription_invoice_validation`, ya en `master`
    (el deploy es manual y no rompe, pero `migrate deploy` ve el orden fuera de secuencia); `x-real-ip` se pierde respecto de
    `getRequestMeta`; los tests no prueban el rollback ni el 500; la política de privacidad no dice que guarda la IP.
  - Merge con `master`: sin conflicto.

  Sin mirar todavía: #70 (documentación de septiembre) y, en este repo, los docs de #195 (sus scripts están en E7), #143 y #40. (#132 está en E6.)
- [x] **E6 Revisar #132 (K1, la respuesta al recordatorio: confirmar / cancelar / reprogramar)** (latido del 11-oct, 06:12-06:25 UTC;
  head `0abc65d5`, base `master` `32c7e0e8`, que ya se movió: `master` va en `c94b9daa`). `modelos: ninguno (113 líneas de código, las leí yo)`
  · `codex: ninguno`. Solo lectura, sin merge ni comentario en el PR.
  - CI verde en ese head (Lint, Typecheck, Tests & Build; Secret scan; Supabase Preview se saltó). Hay que re-correrlo sobre el `master` de hoy antes de mergear.
  - Lo que está bien, comprobado en el código: dos funciones puras y una que persiste; la lista de frases es cerrada y no decide por
    subcadenas (`no confirmo`, `no quiero cancelar`, `sí pero no puedo` dan desconocido); un `buttonId` desconocido no cae al texto;
    la organización viene del llamador y se compara en las dos funciones y en el `where`; el `updateMany` compara id, organización, estado
    **y horario**, así que una respuesta a la hora vieja no confirma una cita que el equipo ya movió; los enum existen en `schema.prisma:1288`.
  - **MEDIUM — «no puedo» cancela** (`interpretar-respuesta-recordatorio.ts:26`, fijado por un test). Decir «no puedo» a un recordatorio puede
    ser «no puedo a esa hora». Cancelar libera el horario en silencio; reprogramar no escribe nada y le deja el caso a una persona. El costo
    de equivocarse no es simétrico. Arreglo: que `no puedo` y `no puedo asistir` no cancelen (a `reprogramar`, o a desconocido para que el
    bot pregunte «¿cancelamos o buscamos otro día?»). Es una regla de negocio: la decide Sergio Urcullo con Plataforma, no esta lane.
  - **MEDIUM — `aplicarRespuestaRecordatorio` se salta lo que hace la cancelación de hoy.** El PATCH y el DELETE de
    `app/api/appointments/[id]/route.ts` hacen `logAudit` (líneas 142 y 249), `avisarCambioDeCita` (164 y 247) y `publicarCita` (167 y 257).
    K1 solo hace el `updateMany`: al conectarlo, una cancelación por WhatsApp no deja rastro en la auditoría, la recepción no se entera y la
    agenda en vivo sigue mostrando el horario ocupado. El PR avisa que no manda notificaciones, pero no que falta la auditoría ni el evento en
    vivo, y el backlog tampoco. El PR que lo conecte tiene que sumarlos, con un test que falle sin ellos.
  - LOW: «ok» y 👍 confirman si el llamador no probó que la respuesta es a ESE recordatorio (el contrato lo exige, pero nada lo verifica
    hasta que alguien lo llame). Y hoy **nadie lo llama**: `CLAUDE.md` «Construido ≠ terminado». Sin cablear no hay valor ni riesgo.
  - Pregunta para quien lo cablee: ¿una cuenta en solo lectura (C13) puede cancelar por respuesta? El PR no lo dice.
  - Veredicto: el código no tiene HIGH. Se puede mergear con los dos MEDIUM anotados como condición del PR que lo conecte.
- [x] **E7 Revisar los scripts de #195 (madre v4)** (latido del 11-oct, 06:25-06:35 UTC; head `a235f213`). `modelos: ninguno (180 líneas, las
  leí yo)` · `codex: ninguno`. Solo leí `scripts/billetera-tokens.mjs`, `codex-worktree.sh` y `codex-cupo.mjs`; **no miré los otros ~50
  archivos del PR (docs, imágenes)**, salvo la regla del 10-oct que se cita abajo. Corrí lo que se podía correr desde la nube.
  - `codex-cupo.mjs --self-test`: «self-test OK», exit 0. Solo lee, no escribe.
  - Descartado midiendo: que `billetera-tokens.mjs` cuente de menos los tokens de salida por tomar la primera línea de cada `message.id`.
    En mi transcript (1.010 ids, 669 con más de una línea) el `output_tokens` es igual en todas las líneas del mismo id.
  - LOW: sin el id de sesión, `billetera-tokens.mjs` imprime igual «contexto actual madre v4 ≈ 211k» (medido acá). `p.includes('')` es
    siempre verdadero, así que toma el último uso del último archivo leído, que no es el de la madre. Debería imprimir `?` si falta el id.
  - LOW: `codex-worktree.sh liberar` borra `*.<slug>`; con ramas que llevan punto, `liberar x` también suelta `ejecutor.foo.x`.
    Mejor prefijar `ejecutor.` y `verificador.`.
  - LOW: el cupo se toma al final (paso 5), después de crear el worktree: dos lanzamientos a la vez pasan los dos el chequeo del paso 1.
    Y si `mklink` o `sha1sum` fallan con `set -e`, el worktree queda creado y sin cupo; el siguiente intento da «ya existe» (exit 5).
  - LOW: el junction elige el `node_modules` por el hash de `package-lock.json`, no por `prisma/schema.prisma`. Tres PRs de onia-platform
    (#113, #137 y #140) dicen que su typecheck falla «por el cliente Prisma compartido». El script automatiza esa causa; al menos que avise
    «el typecheck local puede dar falsos rojos por Prisma; el CI manda».
  - LOW: `codex-cupo.mjs` ejecuta `main()` al importarse (exporta `lastRateLimits` y `describe`) y su `--self-test` no está en ninguna suite del CI.
  - **MEDIUM (docs, para la madre):** `handoff/madre-local.md:21` trae una regla del 10-oct («todo lo que sale afuera se le MUESTRA antes a
    Sergio Urcullo y sale con su OK») que **no está en `CLAUDE.md`**. Este dice (9-oct y «Contenido en redes», 8-oct) «se sube nomás». Toda
    sesión nueva lee `CLAUDE.md`, no el handoff de la madre: publicaría sin mostrar. Hay que decidir cuál rige y editar el otro en origen.
    Misma línea: pide no pushear a onia-platform «de :20 a :10», y `equipo-de-agentes` dice «de :20 a :55»; una de las dos tiene un typo.
  - Veredicto: nada que bloquee el merge de los scripts. La contradicción de reglas sí merece resolverse antes de que lo lea otra sesión.
- [ ] **E1b Las pantallas con sesión de la publicación de las 06:50 UTC** (agenda del día, odontograma, caja diaria y la bandeja `/inbox`): **bloqueado** para este carril.
  Las pantallas nuevas ya están en producción (E1) y nadie las vio con login. Las destraba la madre desde la PC
  (`node /root/onia-mirar.js oninteligenciaartificial+qapago@gmail.com /agenda`, `/caja-diaria`, `/inbox`, `/patients/<id>/odontogram`) o Q5 (#194) cuando
  entre y corra `aplicar` (necesita el «sí, aplicar» de Sergio Urcullo en esta sesión). **Hecho:** tres capturas a 390 y 1440 con sesión, miradas.
- [x] **E11 La publicación de las 09:50 UTC** (desde las 09:58 UTC): confirmar que hubo build nuevo por el `buildId` (antes: `D5DzLXxrhp8Sx1o0cQhQs`, medido a las 08:20 UTC; `mirar-publico.mjs` lo imprime; **corrección:** el BUILD_ID SÍ está en el HTML, en `\"b\":\"<id>\"`, y cambia con cada build), mirar `/login`, `/book` y `/register` a 390 y 1440 con `mirar-publico.mjs` (etiqueta `despues-0950`),
  y decir si entró #147 (F136) y #148 (U4): el paso 2 de `/register` sin «tu» cierra Q9b. **Estado del 11-oct 08:58 UTC (latido):** #147 está en `master` desde las 08:17:56 UTC (`fd72cd55`, el merge lo hizo otra sesión), así que entra en el build de las 09:50 si el publicador toma el HEAD de `master`; #148, #149, #150, #152, #153, #154 y #155 NO están en `master`
  (así que el paso 2 de `/register` seguirá con «tu» y Q9b no se cierra con esta publicación); el `buildId` de producción sigue siendo `D5DzLXxrhp8Sx1o0cQhQs`. **Lo que la nube NO puede medir de #147** (pedido de la madre, 11-oct 08:15: «caja con «1.500» → Bs 1.500» y «borrado de paciente con caras frenado»): el código de la caja diaria y el borrado están detrás del login
  (`/caja-diaria` redirige 307 a `/login` y su chunk no aparece en ninguna página pública), y un `buildId` nuevo prueba que hubo build, no qué commit trae. Hace falta una sesión: la madre desde la PC con `onia-mirar.js` (escribir «1.500» en el campo del arqueo y mirar el monto leído SIN cerrar la caja), o Q5 después de `aplicar`. Un borrado de paciente de prueba es una escritura en producción: no se hace sin permiso. Sin escribir ni enviar nada. (**Corrección del 11-oct 07:58 UTC:** esta tarea y E12 y E13 las había dado por escritas en la cola el 07:22 y no lo estaban, porque el ancla donde las insertaba ya había cambiado; se escriben ahora.)
  **Hecho el 11-oct 09:58 UTC (`modelos: ninguno (lo corrí yo)` · `codex: ninguno`).** (1) **Hubo build nuevo:** `buildId` `FTdbJ5YopG9Ll4v0Yivrq` (antes `D5DzLXxrhp8Sx1o0cQhQs`); runtime de webpack `webpack-2a706587264c6b91.js`. (2) **`/login`, `/book` y `/register` a 390 y 1440, miradas** (`despues-0950-*.png`, `despues-0950-publico.json`): HTTP 200 en 2,5-3,9 s,
  sin desborde horizontal, sin iconos dibujados como texto (`ligadurasComoTexto` vacío en las seis), sin precios ni textos de obra, sin voseo ni tuteo en lo visible del primer paso; el login dice «Ingrese a su cuenta», «¿Todavía no tiene cuenta?» y «Cree su cuenta · 14 días gratis», y el título y los textos son los mismos que a las 06:50. (3) **Q9b NO se cierra:** el paso 2 de `/register` (un clic en la tarjeta «Clínica dental», sin escribir ni enviar: `mirar-registro-paso2.mjs`)
  sigue con **«Nombre de tu clínica»** (`despues-0950-register-paso2-390.png` y `-1440.png`), porque #148 no está en `master` (la punta de `master` sigue siendo `fd72cd55`, el merge de #147 de las 08:17 UTC). (4) **#147:** está en `master` desde las 08:17 UTC, antes de la publicación, y el `buildId` cambió, pero eso no prueba qué commit trae el build.
  **Lo que la nube no puede medir** (caja con «1.500» → Bs 1.500 y el borrado de paciente con caras frenado): sigue detrás del login; lo cierra la madre desde la PC con `onia-mirar.js` o Q5 después de `aplicar`. Próxima medición: la publicación de las 12:50 UTC; si #148 entra antes a `master`, el paso 2 de `/register` debe dejar de decir «tu» (`mirar-registro-paso2.mjs`, etiqueta `despues-1250`).
- [x] **E12 Cherry-pick de L1, L1b y L1c a #194** (11-oct ~07:58 UTC; L1c = `fded1ff0` en `codex/hermes-l1c-html-real`; `modelos: ninguno (lo corrí yo)` · `codex: ninguno`). **L1c revisado y aceptado.** Con el HTML real de `onia.com.bo` que bajé **a las 07:53 UTC** (no solo el guardado), servido en local con `--base-web` y el código real de `master`:
  exit 0, 0 diferencias de precio, los cuatro topes «coincide», 7 promesas «sigue» y `registro-nombre` informativa; con las fixtures del repo (`research/promesas-web/2026-10-11/html/`), lo mismo; mutación del HTML real (Básico mensual 320→330): «Básico · mensual: web 330, código 320» y exit 1.
  16/16 pruebas en Linux (en la rama de Codex dan 13/16 hasta que se suma mi carpeta `html/`, que está en mi rama y no en la suya). Los tres commits (`782dd348`, `6f64e094`, `fded1ff0`) entraron a #194 sin conflictos. **Dos daños de L1c que arreglé yo en un commit aparte:** el script traía un BOM al inicio y varias cadenas con los acentos cambiados por `?`
  (`c?digo`, `conversi?n`, `auditor?a`, `d?a`, y `→` y `—` en la línea de topes): la salida decía «c?digo 300/2/200 ? coincide». El editor de Windows de Codex regraba mal los caracteres que no son ASCII; vale para toda tarea que pase por esa PC (mirar `git diff` por `?` y por BOM).
  **Pendiente menor:** las frases ancla (`ANCLAS`) son titulares de la web («UN SOLO SISTEMA PARA TU NEGOCIO», «…que Bolivia no tenía»): si el texto pasa a usted o se reescribe, la página sale NO MEDIDO (exit 2), no verde; conviene anclar a algo estructural.
  Suites con el árbol final: `web-vs-producto` 16/16, `jarvis-aplicar` 48/48, `jarvis-resumen` 63/63, `herramientas-desplegadas` 10/10, `docs-hygiene` 18/18, `qa-release` 35/35. Choca con #196 en `package.json` y en la lista del workflow (dos líneas, se juntan sumando los dos nombres).
- [x] **E13 Delta de los PRs que avanzaron desde mi revisión** (07:22 UTC; `modelos: ninguno` · `codex: ninguno`): #144, #145, #172, #191 y #195 se movieron con commits del auto-sync de sus carriles. #145 no cambió nada bajo `hermes-content/integrations/siat` desde `2f3db8fd` (mi MEDIUM del cursor CAFC sigue como estaba);
  #162 sigue en `5d5a11ce` (BLOQUEAR, 3 HIGH); #195 suma una línea de estado. Nada nuevo que revisar.
- [x] **E16 Pasada sobre onia-platform #152 (C1-C6, las pantallas del video de venta de usted) y #153 (U3, /agents y el Inicio de usted)** (11-oct ~08:10 UTC; heads `d8c486f5` y `d60b0b09`, base `master` `a7d8c1ed`; `modelos: sonnet ×1, verificación de los hallazgos citados: yo` · `codex: ninguno`). Nada se mergeó ni se comentó en GitHub.
  **Veredicto: OK para mergear los dos, sin HIGH.** El agente comparó el AST de todos los `.ts` y `.tsx` contra `master` (no pudo correr vitest ni tsc: no hay `node_modules`): solo cambian literales de texto, con tres excepciones esperadas (`v.negocio`→`v.negocioSu` en `AgendaClient.tsx`, que existe en `master`, y dos regex de test). Ningún id, clave, enum, condición ni `href` cambió; los 5 literales de `agents-runtime.ts` son el `nextAction` que ve el dueño: no se tocó ningún mensaje al
  paciente, ninguna plantilla de WhatsApp ni el prompt del sistema. Ningún código o test parsea los textos viejos. Línea base del voseo, recalculada: `master` 580, #152 540, #153 570; solo baja y los archivos nuevos quedan en 0.
  - **MEDIUM, voz incompleta (los gates no lo ven, porque el detector solo mira imperativos acentuados):** #153 `agents/agentes-pantalla.tsx:94` («Acá vas a ver lo que propongan y cuánto aprobaste», el vacío de /agents, en un archivo que el PR edita; verificado). #152 `lib/agenda/crear-cita.ts:126` («Por favor elige otro.», tuteo sin tilde, lo muestra la Agenda; verificado; el mismo texto está en `reprogramar-cita.ts:33`, fuera del PR).
    El Inicio de #153 queda a medias: `dashboard/textos-del-dia.ts:33,36` («Hoy tenés N citas», el titular; verificado, ningún PR lo toca), `dashboard/page.tsx:324,342,394,413,502`, `comercio-hoy.tsx` e `importadora-hoy.tsx`, junto a «Esperan su aprobación».
    Los textos que devuelve el servidor y la UI muestra tal cual siguen en voseo: `api/onia-core/approvals/route.ts:27,69,197` («No tenés permiso para decidir aprobaciones», visible en Pendientes; verificado, #152 no lo toca), `api/onia-core/agents/encendido/route.ts:45,67`, `agents/plantilla/route.ts:18-30`, `api/comercio/clientes/[id]/route.ts:57`.
  - LOW: `lib/clientes/baja.ts:469` («quedan para su contabilidad», en la confirmación del borrado irreversible, justo después de viñetas con «su» de la persona: se lee como la contabilidad de la persona; propuesta «la contabilidad de su negocio»); `FichaVista.tsx:205` («Cuando la agende») y `:417` («Todavía no le cobró nada») ambiguos con usted; las filas que ya están en la base (`Notification.title/message`, `dispatch.lastError`) siguen con voseo; #152 dice «su OK» y #153 «su aprobación».
  - **Solapes (`git merge-file`, los cuatro parten de `a7d8c1ed`):** #149×152 y #152×153 conflictúan **solo** en `__tests__/voseo-ratchet.linea-base.json` (líneas contiguas); #148×149, #148×152, #148×153 y #149×153 mezclan limpio. Los archivos fuente de #148, #149, #152 y #153 son disjuntos. Mezclados los cuatro a mano, uniendo el JSON, la línea base da 0 errores. Orden: #152 al final, o resolver ese JSON por unión.
  - **Idea de fondo (para Plataforma):** el detector de voseo no ve «tu», «vas», «aprobaste», «elige» ni los enclíticos («reactivala»); por eso cuatro PRs seguidos de «usted» dejan restos que los gates dan por buenos. Un barrido con una lista de formas (no solo imperativos con tilde) sobre lo que ve el cliente cerraría la clase; es la misma idea que `web-vs-producto` para la web.
- [x] **E17 C1 a C3b dentro de #194** (11-oct ~08:25 UTC; `modelos: ninguno` · `codex: ninguno`). La madre avisó que su control de permisos frena el merge de PRs de otra sesión y que se lo pregunta a Sergio Urcullo: **con dos PRs (#194 y #196) eran dos preguntas; con uno, una.** Cherry-pick de `67009d70` y `7766e875` (los dos commits de #196, ya revisados en E-C1-C3 y E-C3b) sobre #194, con los conflictos de `package.json` y de la lista del workflow resueltos por unión
  (ahora la lista trae `test:jarvis-diagnostico`, `test:qa-diario-guarda`, `test:jarvis-modelo` y `test:web-vs-producto`). Sin daño de codificación en lo que trae (los únicos `?` son los `file:%s?mode=ro` de sqlite). **Las 13 suites de la lista del CI, sobre el árbol final:** `pedidos` 90, `jarvis-aplicar` 48, `jarvis-diagnostico` 6, `qa-diario-guarda` 10, `jarvis-modelo` 17, `web-vs-producto` 16, `jarvis-resumen` 63, `aduana` 30,
  `agenda` 22, `qa-release` 35, `herramientas-desplegadas` 10, `herramientas-del-cron` 39 y `docs-hygiene` 18, todas en verde. **#196 queda redundante** (sus dos commits están en #194 con otro SHA): cerrarlo es decisión de la madre.
- [x] **C4 La sección 17 del diagnóstico: lo que dejó `onia-qa-release`** (11-oct 09:25 UTC, a pedido de la madre: «1-2 contratos Codex de tu carril»). `CODEX-CONTRATO: hermes-content/docs/handoff/codex-tareas/hermes-C4-diagnostico-qa-release.md` (Luna, `estado: pendiente`, lo lanza la madre con #194 en la base): estado en `/var/lib/onia-qa-release/` (release visto, ROTO o SIN MEDIR, ventanas del publicador, tareas abiertas, capturas)
  y las últimas 15 líneas del log, todo por `redactar`, solo lee, con los formatos copiados de `qa-release.sh` (no inventados) y mutaciones. **Hecho:** su prueba en verde en la rama de Codex y yo la reviso con el diff aplicado a mi árbol y la sección corrida contra un estado generado por el `qa-release.sh` real. `modelos: ninguno (lo escribe este carril)`.
  **Hecho y revisado el 11-oct ~09:55 UTC (Codex Luna, commit `11d05aa2`, draft PR #197, base mi rama; `modelos: ninguno (lo corrí yo)` · `codex: hermes-C4`).** Aplicado a mi árbol limpio: `test:jarvis-qa-release` 10/10, `jarvis-aplicar` 48/48, `jarvis-diagnostico` 6/6, `jarvis-modelo` 17/17, `docs-hygiene` 18/18, `bash -n` sin errores; sin BOM ni acentos dañados (los únicos `?` son los `file:%s?mode=ro` de sqlite). Corrí la sección 17 contra un estado con los formatos reales
  de `qa-release.sh` (con ruido y un secreto): sale `ROTO desde 08:50Z — /dashboard: pantalla vacía token=***`, `SIN MEDIR`, ventanas, tareas con `(id inválido)` donde corresponde, capturas solo contadas, 15 líneas de log y la larga cortada a 200; `corriendo-desde` no aparece. **Un hallazgo mío, arreglado en `de4e95f1`:** la sección cortaba **antes** de redactar (`cut -c 1-200 | redactar`), y un secreto de largo fijo que cae en el
  límite del corte se escapaba a medias (medido: 20 de 40 hexadecimales a la vista). Ahora redacta y después corta (`redactar | cut`), en los motivos de ROTO y en el log; la prueba 3 de Codex esperaba el orden viejo (142 «x» después de `*** `, ahora 156) y agregué una prueba que falla sin el arreglo: 11/11. **Los dos commits entran a #194** (cherry-pick sin conflictos), como pidió la madre; #197 queda redundante.

- [ ] **V1 Un segundo gate de voseo para la segunda persona (onia-platform)** (11-oct 09:25 UTC). `CODEX-CONTRATO: hermes-content/docs/handoff/codex-tareas/plataforma-V1-detector-voseo-segunda-persona.md` (Sol, `estado: pendiente`, la lanza la madre sobre `onia-platform`): el gate actual solo ve voseo con tilde y dejó restos en cuatro PRs seguidos de «de usted» (E10, E16): `tu`, `vas`, `aprobaste`, `elige`.
  Un detector aparte con listas explícitas, su propia línea base que solo baja, positivos tomados de líneas reales de #148, #149, #152 y #153 y negativos de falsos positivos conocidos («el sistema guarda…», «tuvo», «intuición»). No cambia texto de producto ni el gate actual. **Hecho:** sus pruebas en verde y la línea base generada por el contador; yo reviso los diez archivos con más cuenta.
- [x] **E18 A las 10:15 UTC: revisión de dinero de M1 (PR de las 10:12: cambia cómo se leen «1.50», «1500.5» y la importación CSV) y re-revisión de #155** (pedido de la madre, 11-oct 09:12 UTC). Para #155: los tres puntos de E15 (el HIGH de `PAYMENT_DELETED` en `AuditAction`, la ventana de 7 días al cerrar, y `close` de días viejos con `finance.write`). Para M1: batería de montos reales con el código de la cabeza, el CSV
  con las filas reales de `lib/comercio/import-productos.ts`, y el efecto sobre `leerMonto` de #147 (`1,500` y `1.50` tienen que seguir rechazados o mostrar el monto leído para confirmar). Sonnet ×2 (dinero y seguridad) y yo verifico cada HIGH.
  **Línea base medida el 11-oct 10:03 UTC con `master` `fd72cd55`** (la batería de 37 textos, con las dos funciones reales cargadas desde `git show`, en mi carpeta de trabajo): `parseNumero` del CSV (`lib/comercio/import-productos.ts:115`) lee **«1.500» como 1,5, «1.000» como 1, «100.000» como 100 y «1.5000» como 1,5**, sin avisar, y «1.500.000» da NaN; en cambio «1,500», «1,500,000» y «99,999» los lee como miles y «1e3» como 1000. `leerMonto` de la caja (`lib/dinero/leer-monto.ts`) lee «1.500» como 1500 y rechaza «1,500», «1.50», «1500.5» y «1e3».
  O sea que **hoy un CSV con precio «1.500» deja el producto en Bs 1,5** y la caja leería ese mismo texto como Bs 1.500: son las dos convenciones del producto en un solo archivo de Excel es-BO. M1 tiene que cerrar eso sin abrir el caso contrario («1,500» como 1,5 o «1.50» como 150). Con la cabeza de M1 corro la misma batería y comparo fila por fila.
  **Hecho el 11-oct ~10:20 UTC (`modelos: ninguno (lo revisé yo, con las funciones reales corridas desde `git show`)` · `codex: ninguno`).** Nada se mergeó ni se comentó en GitHub. Heads: #155 `8ac7eb3f` (2 commits sobre `master` `fd72cd55`), M1 = #156, rama `codex/m1-una-sola-lectura-de-montos` `10615fb8` (1 commit sobre `fd72cd55`). El CI de los dos estaba en cola a las 10:14.
  - **#155: OK para mergear; mis tres puntos de E15 quedan cerrados** (leí `route.ts`, `payments/[id]/route.ts`, `lib/audit.ts` y los nombres de las pruebas). (1) `PAYMENT_DELETED` y `DAILY_CASH_CLOSED` están en `AuditAction` (la columna `AuditLog.action` es `String`: no hay migración) y cada cierre y cada borrado de cobro se audita **en la misma transacción** (si falla la auditoría, se revierte). (2) `close` no tiene tope inferior y `reopen` sí (siete días, por calendario civil de la zona del negocio), y el GET trae `pendingOpenSession` para que una caja olvidada hace más de siete días se pueda cerrar. (3) cerrar un día anterior exige `approvals.decide` (no solo `finance.write`) y la interfaz solo ofrece el botón con ese permiso.
    El rebase no cambió nada de F136b: el parche de `7adad4f6` contra `4bd9da9c` y el de `bd4aa806` contra `fd72cd55` son idénticos línea por línea. LOW: `if (!invoice) return null` pasó a `throw new Error("INVOICE_NOT_FOUND")`, que ningún `catch` mapea y sale como 500 con Sentry (no puede pasar con las claves foráneas; conviene un 404).
  - **M1 (#156): sin HIGH. Mejora lo que dice (medido) y deja cuatro cosas, dos de ellas MEDIUM.** Batería de 37 textos con `leerMonto` real de la cabeza: «1.50» → 1,50, «1.5» → 1,5, «1500.5» → 1.500,50, «815.50» → 815,50, «1.500» → 1.500; «1,500», «1,500.50», «1.5000», «1e3», «.5» rechazados. El patrón de punto decimal (1-2 dígitos) y el de miles (exactamente 3) **no se solapan**, así que no hay texto con dos lecturas válidas. En el CSV, precio y costo pasan de leer «1.500» como 1,5, «1.000» como 1 y «100.000» como 100 a leer 1.500, 1.000 y 100.000. Los formularios deshabilitan el botón mientras hay motivo y muestran «Se registrará Bs …». Y el corte de caja de comercio dejaba de mandar **0** con el campo vacío (`Number("")`): ahora exige el monto.
    - **MEDIUM A, el CSV rechaza los precios con cuatro decimales** (`lib/comercio/import-productos.ts:186,194`): «10.0000», «1500.0000», «12.3456» y «25,5000» daban 10 / 1500 / 12,35 / 25,5 en `master` y ahora dan error **en cada fila** («Precio invalido: Escriba el monto como 1.500,50…», un texto pensado para un formulario). `master` documentaba justo ese caso («el precio con 4 decimales del ERP viejo»); M1 cambió la prueba a propósito («rechaza exceso de decimales»). Un archivo de un ERP viejo no entra. Arreglo de pocas líneas: quitar ceros sobrantes más allá del segundo decimal antes de `leerMonto` y dejar el error solo para decimales distintos de cero. «1.125» pasa ahora a Bs 1.125 sin avisar (convención es-BO; el CSV no tiene vista previa).
    - **MEDIUM B, cantidades y montos en la misma fila con dos convenciones:** `parseNumero` (stock del CSV), `leerNumero` (cantidad de «Ajustar stock» y punto de reposición), `Number()` (stock inicial del alta) y `num()` (cantidad, peso y volumen del costeo) siguen leyendo «1.500» como 1,5, a propósito (la prueba nueva «conserva la lectura de cantidades fraccionarias» lo fija; hay kilos con tres decimales). Pero en `master` con la fila `price 1.500 · stock 1.500 · cost 1.500` el kardex valorizaba 1,5 × 1,5; ahora 1,5 × 1.500: **la cantidad queda 1.000 veces corta y el costo bien**, sin ninguna línea que confirme la cantidad. Propuesta: mostrar la cantidad leída («Se registrarán 1,5») y, para unidades enteras (unidad, caja), rechazar «1.500».
    - **LOW C, «una sola lectura en toda la plataforma» no es cierto todavía:** `app/onboarding/pasos/paso-servicios.tsx:185` (precio de cada servicio del alta, `Number()`: «1.500» → 1,5 y el campo se reescribe a «1.5»; «1,500» → sin precio) y `importadora/reprecio/page.tsx:39` (el TCO: «6.960» → 6,96 mientras el costeo lo lee como 6.960). No es peor que `master`; es el siguiente M. Además `tcoBcb` no tiene tope razonable: «6.960» en el costeo muestra «Se registrará Bs 6.960,00 por USD» y calcula con eso.
    - **LOW D (forma):** texto nuevo con voseo sin tilde que el gate no ve (`VentaForm.tsx`, «registrala al contado»); los campos obligatorios vacíos muestran en rojo «Escriba el monto.» antes de escribir (`CorteForm`, `CompraForm`, `AbonoForm`, FOB y TCO del costeo); en `AbonoForm` y `PagoCompraForm` el aviso queda bajo un campo de `w-24` dentro de una fila `flex-wrap` (no se puede mirar sin sesión); el `import` nuevo de `import-productos.ts` quedó entre el JSDoc de `COLUMNAS_IMPORT` y la constante.
    **Orden:** M1 entra aunque A y B sigan abiertos, porque sin M1 el CSV deja precios 1.000 veces cortos sin avisar; A se arregla en el mismo PR si se alcanza antes de las 12:20 UTC, si no va en un M1b. Entra antes de la publicación de las 12:50 UTC.

- [x] **E4 Volver a mirar #136 cuando entren sus arreglos.** Los dos HIGH de E3 y el comando de las migraciones. **Hecho:**
  cada HIGH cerrado con su prueba, leído en el código de la cabeza nueva. **Aviso de la madre DESARROLLO-INFRA (11-oct ~06:20 UTC):** a las
  07:12 UTC sale el draft PR de F136 (caja y odontograma, toca plata) y llega el pedido de revisión con **dos lentes: seguridad y dinero**.
  Plan: un sonnet por lente sobre el diff, un haiku que verifica cada HIGH citando líneas, y los dos HIGH de E3 como lista de control.
  **Hecho el 11-oct ~07:25 UTC (onia-platform #147 = F136, head `4bd9da9c`, base `master` `a7d8c1ed`):** `modelos: sonnet ×2 (seguridad y dinero), verificación de mis propios hallazgos: yo` · `codex: ninguno`.
  **Veredicto: OK para mergear; ningún HIGH.** Lista de control de E3:
  - Lectura del monto: `lib/dinero/leer-monto.ts:6-17` acepta «1.500» como 1500 y rechaza lo ambiguo (`1,500`, `1.50`, `1.5`, `1500.5`, `.5`, `1e3`, `1 500`, `Bs 1.500`); 8,3 millones de montos
    por `leerMonto`, JSON y `multipleOf(0.01)` sin un rechazo falso (el agente usó zod v3 de `n8n-mcp-server/node_modules`; el repo declara 3.25.76).
  - Confirmación del cierre: `CajaDiariaClient.tsx:711` exige mismo monto y nota; el botón (`:745-749`) envía el monto confirmado, no relee el texto; editar lo reinicia (`:732`, `:741`).
  - `reopen`: `approvals.decide` en el servidor (`route.ts:224-227`), sin IDOR (la caja sale de `{organización de la sesión, hoy}`), `FOR UPDATE` (`:294`) y `updateMany` (`:298`) por organización, SQL parametrizado,
    auditoría en la misma transacción que relanza si falla (`audit.ts:129`; `audit_logs.action` es `String`: sin migración), y reabrir libera los cobros (`payments/route.ts:73`).
  - Caras del odontograma: `borrado-bloqueado.ts:132-138` correcto; los 7 hijos con cascada de `Patient` coinciden con lo declarado; el único `patient.delete` está detrás del helper (`patients/[id]/route.ts:178`).
  - **MEDIUM (condición para el siguiente PR, no bloquea):** (1) `reopen` y `close` solo operan sobre **hoy** (`route.ts:233`, `:290`): si se reabre y no se vuelve a cerrar antes de las 00:00 de La Paz (04:00 UTC), la caja queda
    abierta sin forma de cerrarla, y los cierres erróneos de días anteriores no se pueden reabrir (seguirían dando 409 en `payments/route.ts:73`). (2) Reabrir no pide motivo ni confirmación (`route.ts:39`, `CajaDiariaClient.tsx:690`); la auditoría guarda
    quién, cuándo e IP, pero no el porqué ni los totales por método (`route.ts:324-332`). (3) Reabrir solo permite recontar: `correctOpeningFund` no tiene pantalla, no hay editar o borrar salidas, y el fondo y la salida se envían sin confirmar (`CajaDiariaClient.tsx:346`, `:640`).
  - LOW: sin `.max` en los montos (`route.ts:19`, `:24`, `:29`, `:35`) contra `Decimal(10,2)`: más de 99.999.999,99 da un 500 genérico; `leer-monto.ts:10` acepta ceros a la izquierda y el mensaje de «12,345» dice «use coma» cuando sobran decimales; el `updateMany` de reopen no repite `closedAt: {not: null}` (lo cubre el lock);
    `route.ts:325-326` llama `.toISOString()` sobre filas de `$queryRaw` y el test las mockea como `Date`: **pedir un smoke con base real** (`onia-mirar.js` sobre `/caja-diaria` tras publicar).
  - **Fuera del PR, ya en producción (para Plataforma):** `DELETE app/api/payments/[id]/route.ts:37` borra cobros en efectivo de un día cerrado; los webhooks de PagosNet y Circle crean pagos sin mirar `closedAt`; el servidor sigue aceptando `close` con `countedCash: 1.5` (no puede saber que fue un error de tecleo).
  - **MEDIUM de producto (otro dueño):** dos convenciones de monto en la misma app. Los formularios de comercio leen texto con `Number()` y su ejemplo es `815.00` (`comercio/caja/CorteForm.tsx:23` y `:58`, `fiados/AbonoForm.tsx:25`, `caja/VentaForm.tsx:124`, `PagoCompraForm.tsx:22`, `CompraForm.tsx:29`,
    `NewProductForm.tsx:59-61`, `importadora/costeo/CosteoForm.tsx:80-82`, `lib/comercio/formulario-producto.ts:34-38`, `lib/comercio/import-productos.ts:115-137`): ahí «1.500» vale 1,5. En la caja diaria, con `leerMonto`, vale 1.500. Quien pasa de una pantalla a otra recibe dos lecturas.
    La decisión de convención es de Sergio Urcullo; la función única ya existe.
  - **Cuándo hay riesgo real:** el cierre erróneo necesita un negocio abierto. #136 está en producción desde ~06:56 UTC (02:56 en La Paz) y la publicación de las 09:50 UTC son las 05:50 en La Paz, antes del horario de atención. Si #147 está mergeado antes de las 09:20 UTC, lo más probable es que ningún cliente haya cerrado una caja con el error. No lo pude medir (sin acceso a la base).
- [x] **E9b #150 con el arreglo P-01b (`dcc3090f`)** (11-oct ~07:40 UTC; `modelos: ninguno (lo corrí yo, en Linux)` · `codex: ninguno`). **Veredicto: OK, el HIGH queda cerrado.** `node --test scripts/verificacion/b22-anon.test.mjs` en Linux: **27/27, 0 omitidos**
  (en Windows se omiten los dos casos de symlink; el CI de `onia-platform` no ejecuta `scripts/**/*.test.mjs`, y el RUNBOOK lo dice). Mi repro: `env -i node` por el archivo, por un symlink de archivo y por un symlink de directorio da lo mismo, «NO MEDIDO: falta NEXT_PUBLIC_SUPABASE_URL, …» y exit 3
  (antes: silencio y exit 0). El punto de entrada ya no tiene la guarda `import.meta.url` (`b22-anon.mjs` solo llama a `ejecutar()` de `b22-anon-lib.mjs`). También quedaron cerrados mis MEDIUM y LOW: control positivo `GET /auth/v1/settings` con la misma clave (si no da 200, ambas tablas
  `NO MEDIDO` sin consultarlas, `b22-anon-lib.mjs:64-77`), la clave debe ser `role: "anon"` (`:4-16`), solo HTTPS (HTTP solo en `localhost` y `127.0.0.1`) y sin credenciales ni query en la URL (`:53-61`), `select=id` (`:83`), tiempo máximo de 15 s incluido el cuerpo (`:18-33`).
  LOW que queda: el control positivo prueba que la puerta (Kong) acepta la clave, no que PostgREST la acepte; con una clave aceptada por Kong y rechazada por PostgREST (por ejemplo un secreto JWT distinto tras rotar) las tablas darían 401 y el informe diría PASA. Un segundo control, `GET /rest/v1/` con la misma clave, que debe dar 200, lo cierra. No lo pude medir contra un servidor.
- [x] **E14 Revisar onia-platform #154 (S2, la IP del cliente solo sale de Cloudflare cuando el pedido viene de Cloudflare)** (11-oct ~07:50 UTC; head `bf1e761c`, base `master` `a7d8c1ed`; `modelos: sonnet ×1 (seguridad), verificación y pruebas propias: yo` · `codex: ninguno`). Nada se mergeó ni se comentó en GitHub.
  **Veredicto: el código está bien; NO se publica hasta medir una cosa en el VPS.**
  - Comprobado con el `client-ip.ts` real (`node --experimental-strip-types`): los 38 casos de sus tests pasan; mis 20 casos y 400.000 IPv6 al azar contra una referencia independiente, sin una diferencia; un `x-forwarded-for` con valores falsos al frente se ignora (cuenta el último, `client-ip.ts:25`); un `cf-connecting-ip` que llega de un par que no es de Cloudflare se ignora
    (`:35-37`); `cf-connecting-ipv6` solo se mira con `cf-connecting-ip` de clase E y par de Cloudflare (`:47-53`); las IPv4 mapeadas (`::ffff:1.2.3.4` y su forma hexadecimal) se normalizan; las IPv6 de una misma red /64 comparten clave. Coma final, `[::1]`, `ip:80`, 5.000 valores y cabeceras repetidas dan «unknown» (fallan cerrado).
    Los 22 rangos de Cloudflare del archivo (`:7-14`) son idénticos hoy a `ips-v4` e `ips-v6` oficiales (los bajé con `curl` y comparé: 22 de 22). Los 20 llamadores pasan por `clientIp` o `claveDeIp`; ninguna otra lectura de cabecera de IP decide seguridad. `lib/audit.ts` ya no cae a `x-real-ip`.
  - **HIGH condicional, bloquea publicar (`client-ip.ts:24-27`, `:35-37`):** todo depende de que el par TCP que ve Traefik sea la IP real (el borde de Cloudflare o el cliente). Si Traefik ve el gateway de Docker o el ingress de Swarm (172.x o 10.x), nadie queda reconocido como Cloudflare, se ignora `cf-connecting-ip` y **todos los visitantes comparten
    una sola clave** (repro mío: `x-forwarded-for: 172.18.0.1` con dos `cf-connecting-ip` distintos da la misma clave `172.18.0.1`). Con eso los topes `public-api` (30/min), registro (10/min), reserva (5/min) y el bloqueo de login por `correo|IP` pasan a ser comunes: cinco intentos fallidos de cualquiera bloquean el login de cualquier correo, y nada avisa.
    El repo no trae la configuración de Traefik (solo indicios: el Traefik de Easypanel en `/etc/easypanel/traefik`, la red `easypanel`, `docker-proxy` en el host). **A medir en el VPS, solo lectura:** (1) `docker service inspect traefik --format '{{json .Endpoint.Spec.Ports}}'` (modo de publicación `host` o `ingress`; si es `ingress` la IP real se pierde),
    y `/etc/docker/daemon.json` (`userland-proxy`, `ip6tables`); (2) el registro de acceso de Traefik con una consulta por Cloudflare por IPv4 y otra por IPv6: el cliente que ve Traefik debe ser una IP de Cloudflare, no 172.x ni 10.x; (3) `forwardedHeaders` y `proxyProtocol` en la configuración de Traefik; (4) un pedido directo al IP del VPS con `--resolve` y cabeceras falsas:
    el último valor de `x-forwarded-for` debe ser mi IP y dos líneas de cabecera deben unirse en una; (5) si Pseudo-IPv4 está activo en Cloudflare.
  - **MEDIUM de infraestructura (`:29-32`, `:37-40`):** «el par es de Cloudflare» no autentica TU zona: un cliente de Cloudflare con su propia zona apuntada a la IP del VPS llega con par de Cloudflare. El caso del origen directo (E5) queda resuelto, porque el par pasa a ser la IP real del atacante. Cierre: Authenticated Origin Pulls (mTLS) en Traefik, un túnel, o una cabecera secreta que ponga Cloudflare y valide Traefik.
  - LOW: sin `x-forwarded-for` (n8n, cron, canario en `127.0.0.1:3101`) todos comparten «unknown» y `n8nLimiter` (20/h), `bcpWebhookLimiter` (120/h) y `chatbotBotLimiter` (300/min) quedan en un solo cubo por límite (no es fail-open); si Cloudflare agrega un rango, falla cerrado y sin aviso (falta un chequeo periódico y un registro cuando llegue `cf-connecting-ip` desde un par que no es de Cloudflare);
    `:40` devuelve `cf-connecting-ip` sin canonizar y `login/route.ts:61,78` guarda el texto «unknown» en la auditoría, contra `audit.ts:135`; `docker-compose.selfhost.example.yml:19-20` publica 3000:3000 (sin Traefik el cliente elige el último valor); `onia-seguridad/SKILL.md:154-168` quedó desactualizado.
  - **Idea para este carril (sin hacerla todavía):** un chequeo diario en el diagnóstico que compare los rangos del archivo con `ips-v4` e `ips-v6` oficiales, y que cuente en el registro de Traefik los pares 172.x/10.x. Va a la cola después de #194.
- [x] **E15 Revisar onia-platform #155 (F136b: cerrar y reabrir hasta 7 días atrás con motivo; DELETE de cobros de un día cerrado = 409)** (11-oct ~07:55 UTC; head `7adad4f6`, apilado sobre #147 `4bd9da9c`; `modelos: sonnet ×2 (dinero y seguridad), verificación del HIGH y del MEDIUM: yo` · `codex: ninguno`). Nada se mergeó ni se comentó en GitHub.
  **Veredicto: CAMBIOS. Un HIGH de una línea que rompe el typecheck; lo demás se puede mergear.** Las dos lentes encontraron el mismo HIGH por separado.
  - **HIGH (verificado por mí, bloquea el CI):** `app/api/payments/[id]/route.ts:91` llama a `logAudit` con `action: "PAYMENT_DELETED"` y ese valor no está en la unión `AuditAction` (`lib/audit.ts:5-99`; `AuditEntry.action` es de ese tipo, `:104`; solo existe `PAYMENT_RECORDED`, `:34`). Ni #155 ni `master` ni #147 lo agregan; solo lo usan la ruta y su test.
    `npm run typecheck` es un paso del CI (`ci.yml:51`) y `next.config.ts:127` tiene `ignoreBuildErrors: false`, así que el CI y el build fallan; las 10.550 pruebas pasan porque mockean `logAudit`. Arreglo: sumar `| "PAYMENT_DELETED"` a la unión.
  - **MEDIUM (verificado en `route.ts:66-70` y `:165-166`): la condición 1 de E4 sigue abierta en el borde de la ventana.** Los 7 días se cuentan desde la fecha de la caja y `rangoParaCierre` rechaza con 400 (`DATE_OUT_OF_RANGE`) todo lo anterior a hoy−7, también al cerrar. Se reabre el día D (hoy−6 o hoy−7), pasa la medianoche, y D ya no se puede cerrar;
    el aviso de caja pendiente solo mira dentro de la ventana (`:165-166`), así que ese día queda abierto para siempre y sin aviso. Reabrir borra el cierre original (`route.ts:343-361`; queda solo en la auditoría). Arreglo: que `close` acepte cualquier fecha ≤ hoy cuando la sesión está abierta, limitar a 7 días solo `reopen` y quitar el límite inferior del aviso.
  - **MEDIUM de seguridad:** `close` de días viejos exige solo `finance.write` (`:271`, `:275-277`), igual que hoy, pero `reopen` exige `approvals.decide` (`:266-269`). Tras un reopen del dueño, cualquier persona con `finance.write` puede volver a cerrar ese día con un `countedCash` libre, y `close` no deja auditoría (`:420-476`);
    el «cierre a ciegas» no protege porque el GET entrega fondo, efectivo y egresos. Arreglo: pedir `approvals.decide` para `close` con fecha anterior a hoy, o auditar `DAILY_CASH_CLOSED`.
  - Lo que sí quedó cerrado, comprobado: la fecha del cliente (regex ASCII e ida y vuelta por `toISOString`: rechaza `2026-02-30`, `-13-`, saltos de línea, dígitos anchos, futuro, `null` y vacío; ventana correcta en La Paz, Kiritimati, Pago_Pago, Madrid y São Paulo; «hoy» sale de la zona de la organización, no de UTC);
    la caja se busca por la organización de la sesión y con plantillas parametrizadas (sin `Unsafe`); `reopen` exige `approvals.decide` también para días viejos y audita en la misma transacción (motivo de 3 a 180 caracteres, totales por método, fondo y `closedBy`); el DELETE de cobros usa el mismo día que el POST y el cierre, bloquea la sesión antes que la factura (sin deadlock) y no existe PATCH ni PUT de cobros.
  - LOW: el DELETE bloqueado con 409 **no deja auditoría** (`route.ts:48` lanza dentro de la transacción y el test exige que `auditLog.create` no se llame): solo se audita el borrado exitoso; un cobro de un día cerrado de hace más de 7 días queda sin salida (409 y `reopen` ya no llega); `expense` y `correctOpeningFund` solo operan sobre hoy y la pantalla las oculta en otro día, así que reabrir un día viejo solo permite recontar;
    `POST /api/payments` lee la caja sin candado (`payments/route.ts:69-75`) y puede perder una carrera contra `close`; los webhooks de PagosNet y Circle crean cobros en un día cerrado (método OTRO) y los totales guardados en el cierre quedan distintos de los que recalcula el GET; el 409 del DELETE dice «Reábrala» y ninguna pantalla llama a ese DELETE; «Solo un administrador puede reabrirla» es en realidad `approvals.decide`;
    no comprobado: `date = ${dayStart}` en SQL crudo (`payments/[id]/route.ts:41-47`) se prueba solo con `$queryRaw` mockeado, y la igualdad es exacta si cambia la zona horaria de la organización.
- [x] **E10 Pasada sobre #148 (U4, alta y entrada de usted) y #149 (U5, onboarding de usted) de onia-platform** (11-oct ~07:30 UTC; heads `a024292d` y `5475d1e7`, base `master` `a7d8c1ed`;
  `modelos: sonnet ×1, verificación de los dos MEDIUM: yo` · `codex: ninguno`). Nada se mergeó ni se comentó en GitHub. **Veredicto: OK para mergear los dos, sin HIGH.** El agente no pudo correr vitest ni tsc (no hay `node_modules`):
  replicó con node y typescript los tests de voseo y los dos tests nuevos de cada PR, y comparó el AST de cada archivo con `master`.
  - Solo cambian cadenas, con tres excepciones comprobadas: `voc.negocio`→`voc.negocioSu` (en `SignupForm.tsx` y `tour-pasos.ts`; la clave ya existe en los 8 vocabularios), y `includes("Registrá")`→`includes("Registre")` en
    `route.ts:82` del onboarding, coherente con `lib/onia-core/onboarding.ts:92` y con su test. Ninguna clave ni id cambió. Rate limit, validaciones, MFA, códigos de recuperación y la anti-enumeración de cuentas: idénticos salvo el texto.
    El login decide por `code`, no por el texto. La línea base del voseo solo baja (10 y 14 bajadas, las 14 entradas nuevas de #148 en 0).
  - Con esto **el contrato Q9 queda cubierto por #148** (`SignupForm.tsx` pasa a `negocioSu`), pero sigue sin estar en `master`: Q9b se cierra mirando `/register` paso 2 después de publicar.
  - **MEDIUM:** `lib/platform/provisioning.ts:47`, `:50` y `:52` siguen en voseo («Probá con otro», «Iniciá sesión en vez de crear una nueva», «Revisalos y probá de nuevo») y el 409 de `register/route.ts` devuelve ese texto al cliente (el caso más común: nombre de negocio repetido; verificado con `git grep` en la cabeza de #148).
    El test nuevo no mira `lib/platform` y la línea base lo deja en 3.
  - **MEDIUM:** ningún PR toca `e2e/` y el CI (`ci.yml`) no corre Playwright (solo lint, typecheck, check de `onia-core` y build): `e2e/guia-inicio.spec.ts:67`, `:93`, `:165` y `e2e/v1/cinco-rubros.spec.ts:66,71,78` siguen con los textos de voseo (el segundo ya estaba
    desfasado en `master`). No verifiqué si esos textos coinciden hoy con la app.
  - LOW: `app/api/me/mfa/recovery/consume/route.ts:23` (`MENSAJE_OK` en voseo; su test fija `/volvé a entrar/i`); `AccessRequestForm.tsx:112` «Ingresa con su usuario listo» ambiguo; siguen en voseo y fuera de ambos diffs `app/update-password/page.tsx`, `proxy.ts:232-289` y el correo de bienvenida `lib/email.ts:870-902`.
  - Solapes (con `git merge-file`): #148 y #149 comparten solo la línea base y mezclan sin conflicto; #124 mezcla limpio con #148; **#113 conflicta con #149 en la línea base** (esa rama está desfasada: tiene `Odontogram.tsx: 2` y `master` 0).
- [x] **E9 Pasada sobre #150 (P-01) y #151 (P-02) de onia-platform** (11-oct ~07:20 UTC; heads `52d77b0d` y `05dd4ecc`; `modelos: sonnet ×1` · `codex: ninguno`). Nada se mergeó ni se comentó en GitHub.
  - **#150 CAMBIOS.** Solo lectura (dos GET con la clave anon, sin escrituras ni `child_process`), 15/15 pruebas locales. **HIGH (verificado por mí):** la guarda de la línea 76-78 (`import.meta.url === pathToFileURL(process.argv[1]).href`) falla si el script
    se llama por un symlink: no mide nada, no imprime nada y sale con **0**, que el RUNBOOK (línea 357) define como «las dos tablas PASA». Repro: `env -i node real/b22-anon.mjs` → «NO MEDIDO», exit 3; `node enlace/b22.mjs` y `node enlace/dir/b22-anon.mjs` → silencio y exit 0.
    En Windows puede pasar con una letra de unidad en otra mayúscula (sin verificar). Arreglo: comparar con `realpathSync` o separar el punto de entrada. MEDIUM: 401/403 da PASA sin control positivo (una clave rota o rotada también da PASA);
    el script no exige que la clave sea `anon` (con una `service_role` y una fila da FALLA y baja una fila real). LOW: acepta `http:` y cualquier host; `select=*` en vez de `select=id`; ~~el RUNBOOK cita `cola/loop/plataforma.md`, que no existe~~ (**retractado:** el RUNBOOK lo cita como ruta de onia-hermes y sí existe en `main`; el agente lo buscó en el repo equivocado); el mensaje del commit dice «lista vacía = PASA» y el código dice SIN APLICAR.
  - **#151 OK con notas LOW.** Un solo `SELECT` por `psql`, el correo pasa por una regex estricta y va como variable de `psql`, 7/7 pruebas locales, nunca imprime un id ante ambigüedad. LOW: salida vacía se informa como «no hay ninguna org» (exit 1) aunque la consulta no se haya ejecutado;
    `ONIA_PSQL` ejecuta lo que traiga y no está documentado; un administrador puede editar el correo de su organización (`app/api/organization/route.ts:50-74`) y poner el de la demo, lo que bloquea el refresco (falla seguro).


## Hallazgos para otros

(Lo que este carril encuentra y le toca a otro dueño. La madre lo reparte en su ronda.)

- **Madre / Plataforma (URGENTE, plata)** · **Producción corre #136 con sus dos HIGH sin arreglar, desde ~06:56 UTC.** `master` `a7d8c1ed`:
  `CajaDiariaClient.tsx:40-44` (`parseMoney`): «1.500» → 1,5 y «1,500» → 1,5; sin paso de confirmación ni «reabrir», y desde el cierre los cobros
  manuales del día dan 409. Evidencia: `research/qa-publicacion/2026-10-11/caja-parsemoney-master-a7d8c1ed.txt` (corrido con node sobre la función
  de `master`). Y `lib/platform/borrado-bloqueado.ts` sigue sin `toothSurfaceRecord`: borrar un paciente borra sus caras del odontograma.
  #136 entró a `master` a las 05:46 UTC y E3 lo había dejado en CAMBIOS (los dos arreglos «van antes del merge»). Lo que sigue: F136 sale a las 07:12 UTC; la
  siguiente publicación es la de las 09:50 UTC, así que F136 tiene que estar mergeado antes de las 09:20 UTC (regla de no pushear de :20 a :55) o espera a las 12:50.
  Decide la madre si hay que apagar la ruta de la caja diaria mientras tanto; yo no pude comprobar si algún negocio la usa.
- **Madre** · Dos reglas opuestas sobre publicar: `CLAUDE.md` (9-oct) «se sube nomás» y `handoff/madre-local.md:21` (#195, 10-oct 20:25 UTC)
  «todo lo que sale se le MUESTRA antes a Sergio Urcullo». Solo la segunda es posterior, pero solo la primera la lee cada sesión. Detalle en E7.
- **Sergio Urcullo (decisión)** · La web `onia.com.bo` está de vos/tú de punta a punta («Creá tu cuenta», «tu negocio») y el
  clic lleva al alta de la app, que ya es de usted. Es un solo flujo con dos tratos. `CLAUDE.md` deja esa decisión a él.
  `/terminos` y `/privacidad` también: los textos legales van por Leslie Mercado Moreno.
- **Plataforma** · `SignupForm.tsx:630`, `:362` y `:403` usan `voc.negocio` («tu clínica») en vez de `voc.negocioSu`. Contrato
  Codex listo: `handoff/codex-tareas/plataforma-Q9-alta-de-usted.md`.
- **Plataforma** · onia-platform#136: los dos HIGH de E3 (cierre de caja con «1.500» y caras del odontograma sin bloqueo de
  borrado) van antes del merge, y la madre mide las dos migraciones en el VPS (comando en E3).
- **Plataforma** · onia-platform#146: una línea más, `public/manifest.json:4`, y el gate con lookarounds para «tú».
- **Madre** · `ONIA_CATALOGO_DE_VENTA.md` no cambia desde el 2-oct: §5 sigue diciendo que el agente «entiende fotos y audios»
  y §8 que no se puede decir; la web sigue prometiendo el agente de WhatsApp y el «tratamiento a medias» (3 veces en `/rubros`).
- **Madre** · Los mensajes de §6.9 de `ONIA_PROSPECTOS_DENTAL_SCZ.md` ofrecen una demo de 20 minutos y `/contacto` dice 30.

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

  - **Hecho (11-oct):** barrido de las 14 páginas de `onia.com.bo` y de `/login`, `/register` y `/book`, a 390 y 1440
    (`research/promesas-web/2026-10-11/barrido-*.json`). Cero «muy pronto», «beta», «próximamente» o «en
    construcción»; las «borrador» de `/privacidad` y `/terminos` son los borradores de la IA. Sin desborde a 390 ni
    ligaduras como texto en ninguna. **Lo que sí falla es el trato:** la web habla de vos o de tú y el alta, de usted
    (decide Sergio Urcullo, ver «Hallazgos para otros»); y el paso 2 del alta dice «Nombre de tu clínica». Ese arreglo
    va a Codex: `hermes-content/docs/handoff/codex-tareas/plataforma-Q9-alta-de-usted.md`.
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
