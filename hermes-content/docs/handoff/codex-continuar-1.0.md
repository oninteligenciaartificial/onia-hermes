# Handoff — la 1.0 de Onia (Codex → Claude, 28/29-sep)

> ## 🧭 EMPEZÁ ACÁ (Claude, 30-sep-2026 madrugada) — cierre del día; los bloques de abajo son historia
>
> **1. Objetivo.** Publicar la 1.0 usable y vendible (5 rubros) con el OK de Sergio Urcullo, y seguir
> estudiando competencia como IDEAS (no copiar). Sesión PAUSADA a pedido de Sergio: PC apagada.
>
> **2. En producción:** sin cambios de app (release-c3b92067). VPS: igual que el bloque de abajo + el
> vigía de crons ahora llama onia-tg.sh con ONIA_AVISO=sistema ONIA_AVISO_EMISOR=cron-clientes.
>
> **3. Candidato 1.0 (NO publicado):** platform `7d85b3d4` en `origin/wip/v1-integracion-20260928`
> (PR #90), suite completa 8.570 ok / 0 fallos. Web `codex/v1-hermes-20260928` en
> `origin/wip/v1-hermes-20260928`. Sobre lo de la noche anterior se sumó HOY: Confirmar/No asistió en la
> agenda; editar producto, precio y stock (permiso nuevo «Cambiar precios» = prices.write, solo dueño;
> el empleado de comercio carga y ajusta stock); Pendientes en el menú con contador; cotizaciones de
> importadora imprimibles, por WhatsApp (teléfono obligatorio) y «Entregar pedido»; origen del alta
> (signupOrigin) visible en /admin; web con utm/src/fbclid al registro, ?plan= y píxel liviano (política
> v1.3); servicios profesionales con Inicio de agenda, «Profesional» con agenda propia y cobros en la
> ficha; crear cita pide agenda.write; editar y dar de baja clientes en los 5 rubros (en clínica la
> historia no se borra); API de Caja con permisos. El aviso directo de «alta nueva» quedó APAGADO
> (ONIA_AVISO_ALTA_DIRECTO): lo emite la sesión de control por su aduana (pedido enviado 30-sep 03:06).
>
> **4. Publicar exige (con el OK):** respaldo + **5 migraciones aditivas** en este orden:
> 20260927050000_add_web_service_requests, 20260928010000_add_web_visual_selection,
> 20260928020000_add_subscription_payment_quotes, 20260929173000_add_organization_signup_origin,
> 20260929220000_add_patient_deactivated_at (las dos últimas ANTES del swap: sin ellas la app nueva no lee
> organizations/patients) · ONIA_WHATSAPP_INBOX_ID=5 en app.env · apagar el proveedor de teléfono de
> GoTrue · merge PR #90 · publicador · mirar · web wip→main · purgar/ver píxel en «Probar eventos» ·
> n8n wf-04/wf-05 (cobranza/cumpleaños) con `AND p."deactivatedAt" IS NULL` si están activos.
>
> **5. Competencia (research/onia-1.0-29sep/):** COMPETENCIA_SENDYPRO, _MANYCHAT, _DOCTOCLIQ (por dentro,
> solo lectura, con cuentas de Sergio) y _BOTS_WHATSAPP (web viva). Regla: ideas para evaluar, no copiar;
> web viva, no guías. SendyPro es cuenta de «Arthur Teles» con WhatsApp real NUVO conectado: nunca abrir
> chats/contactos. La pauta de Meta Ads ahora la arma la sesión «Análisis de mercado» (se le pasó el plan).
>
> **6. Intentos fallidos/trampas de hoy:** `next dev` con Turbopack rechaza node_modules por junction:
> usar `next dev --webpack` (worktrees en E: con junction a E:/onia-wt/_checkout-deps-20260929); dos
> agentes se cortaron por red (se retomaron); un agente se equivocó con permisos (le quitó cobros al
> empleado) y se corrigió separando prices.write.
>
> **7. Depende de Sergio / próximos pasos:** (1) «OK publicar 1.0» sobre https://claude.ai/artifact/RLKFmPwBxqaat4gpU1LyCW
> (falta sumarle las capturas de hoy); (2) decisiones chicas: /cita no debería aceptar cancelar una cita
> que ya pasó (recomendado sí); ¿/api/v1/patients oculta dados de baja?; ¿la baja libera cupo del plan?;
> ¿esconder la plata del Inicio de comercio a quien no tiene Caja? (recomendado sí); ¿panel de importadora
> pide finance.read?; (3) arreglos chicos pendientes: el 409 de «no se puede dar de baja» muestra el monto
> de deuda a quien no tiene Caja; /api/comercio/transfers y crear almacenes sin inventory.write;
> (4) cuentas de competencia (Lety y Dapta primero; ver memoria recordar-a-sergio-cuentas-competencia);
> (5) conector de Cloudflare, tarjeta de ONIA Ads, 3 leads sin contestar, SIAT Fase 1 (portal), leer
> privacidad v1.3; (6) mudanza a la nube solo con su orden «mudá la sesión a la nube».
>
> ## 🧭 EMPEZÁ ACÁ (Claude, 29-sep-2026 noche) — la sesión se mudó a la nube; el bloque de la madrugada queda abajo como historia
>
> **1. Objetivo.** Igual que antes: la 1.0 de Onia usable y vendible en los 5 rubros. Hoy se sumaron tres
> órdenes de Sergio Urcullo: (a) **rediseño visual primero** (nada vacío, poco texto, celular primero,
> que no parezca hecho con IA); (b) **velocidad y que NO se caiga** por encima de todo; (c) **no es solo
> dental**: 5 rubros, cada uno con sus funciones. Después: inventario de módulos, venta y Meta Ads.
>
> **2. En producción (sin cambios de app hoy).** Platform sigue en `release-c3b92067`. En el VPS, con OK
> de Sergio: runners de CI con prioridad baja (`onia-runner-platform` 1 CPU/cpu-shares 256, hermes 128;
> `/opt/onia-runner/instalar.sh` actualizado); `apt-mark hold` de docker-ce/cli/containerd/compose/buildx;
> los 6 crons de clientes envueltos en `/root/bin/onia-cron-vigilado.sh` (línea fechada por corrida y aviso
> por `onia-tg.sh` en modo tablero si fallan; respaldo `/root/crontab.bak-20260929-vigia`); borrados los 7
> `/opt/onia-platform/build-*` viejos (disco 87 → 76 %). Verificado: prod conecta directo a Postgres 15.8
> (`db:54329`, sin pooler) y `statement_timeout` por parámetro de arranque SÍ aplica (20 s).
>
> **3. Candidato 1.0 (NO publicado), empujado como respaldo.**
> | Qué | Dónde |
> |---|---|
> | Platform | rama `codex/v1-integracion-20260927` **`a76e7bf8`** → `origin/wip/v1-integracion-20260928` (PR borrador #90) |
> | Hermes (web + docs) | rama `codex/v1-hermes-20260928` → `origin/wip/v1-hermes-20260928` |
> | Suite | 7.927 pasan; 5 fallan SOLO por timeout bajo carga en Windows y pasan solos (82/82). Árbitro: CI Linux del PR #90 |
> Qué se sumó hoy: nombres honestos de agentes («Recuerda cobros», «Avisa stock bajo»); kit UI
> (`components/ui/*`, verde de marca #027650, acento #00D26A solo acento, **tipografía Instrument Sans +
> IBM Plex Mono** — decisión de Sergio, «la B, estilo Fanvue»); 6 carriles de rediseño (estabilidad:
> timeouts BD/externos, `/api/health`, app noindex; velocidad: íconos 250→75 KB, caché de fuentes 1 año,
> sesión 1 vez por request; Inicio/Agentes multi-rubro; Pendientes/Ficha/Agenda con primer dibujo del
> servidor; checkout con QR en el 2.º pantallazo y `?plan=` persistente; barra inferior de 5 lugares +
> agente conversacional); arreglo de revisión (un timeout de Meta/Chatwoot nunca reenvía un WhatsApp);
> integración UI. Página de revisión: https://claude.ai/artifact/RLKFmPwBxqaat4gpU1LyCW
>
> **4. Documentos de hoy (todo en `hermes-content/docs/research/onia-1.0-29sep/`):** reglas UI v2, plan de
> rediseño, vendible vs competencia (dental y otros rubros), SaaS real, paquete único, **INVENTARIO_POR_RUBRO**,
> **ADMINISTRAR_PARA_VENDER**, **CAMPANA_META_ADS** (página: https://claude.ai/artifact/7XetamLf8eEQLWtK9x1dro).
> Velocidad y estabilidad: `hermes-content/docs/ONIA_VELOCIDAD_Y_ESTABILIDAD.md` + `scripts/velocidad/`.
>
> **5. Intentos fallidos y trampas.**
> - El `node_modules` COMPARTIDO del candidato (junction de todos los worktrees) se borró a medias a las
>   10:41 (un agente limpiando su copia): se restauró con robocopy desde otro worktree con lockfile idéntico
>   + `prisma generate`. **Nunca** borrar un worktree con junction de forma recursiva (`cmd /c rmdir`).
> - `next dev` no arranca en worktrees de E: con `node_modules` en C:: los worktrees nuevos van en C:.
> - Presupuesto de JS del panel: según el script, las rutas miden 339-349 KB o 385-431 KB gz; unificar la
>   medición antes de usarla como gate (1.0.1).
> - Crear cuentas de terceros está prohibido aunque Sergio lo pida: se proponen alternativas en cuentas suyas.
>
> **6. Lo que depende de Sergio Urcullo.** (1) «OK publicar 1.0» sobre la página de revisión (necesita la
> laptop: VPS). (2) Decisiones de la página: Inicio de servicios profesionales, un primario por tarjeta en
> Pendientes, asistente vs formulario del agente conversacional, 2.º rubro (se recomienda estética).
> (3) Autorizar el conector de Cloudflare (vigía externo + copia R2 de la base, sin cuentas nuevas).
> (4) Meta Ads: cargar método de pago en ONIA Ads `act_1073680778314945`, vincular página/IG/WhatsApp,
> aprobar piezas y gasto. (5) Contestar los 3 leads que esperan. (6) SIAT: entrar al portal en la pestaña
> «Claude» para leer la Fase 1 (runner en `/opt/onia-siat/runner-20260929`).
>
> **7. Próximos pasos, en orden.**
> 1. Con el OK: publicar 1.0 (respaldo + 3 migraciones + `ONIA_WHATSAPP_INBOX_ID=5` + apagar proveedor de
>    teléfono de GoTrue + merge PR #90 + publicador + mirar) y la web (`wip/v1-hermes-20260928` → main).
> 2. Huecos que el inventario confirmó (verificado en código): agenda sin «Confirmar» ni «No asistió» (la API
>    los acepta, la pantalla no); comercio sin editar producto ni precio (no hay PATCH en
>    `app/api/comercio/products`); «Pendientes» fuera de todo menú; importadora: la cotización no se
>    imprime/envía; servicios: Inicio sin agenda. Ver INVENTARIO_POR_RUBRO §4.
> 3. Antes de pagar publicidad: recorrido con sesión sobre base DESCARTABLE (INVENTARIO §7), píxel/`?src=`
>    en el alta, aviso de alta nueva, frase de campaña en el bot.
> 4. 1.0.1: peso del panel, L1 fase 2 (sesión por proxy), recordatorios WhatsApp con botones, Caja comercio,
>    factura SIAT dentro del sistema.
> **Qué puede la sesión en la nube y qué no:** código, tests (Linux), revisiones, documentos y artifacts: sí.
> VPS (deploy, SIAT, crons), Chrome de Sergio y la memoria local de Claude (`~/.claude/projects/...`): NO;
> la llave del VPS no sale de la laptop (regla de Sergio). Los worktrees locales no existen en la nube:
> trabajar sobre las ramas `wip/*` de GitHub.
>
> ## 🧭 EMPEZÁ ACÁ (Claude, 29-sep-2026 madrugada) — lo de abajo es historia de apoyo
>
> **1. Objetivo.** Cerrar la 1.0: un cliente de los 5 rubros descubre, prueba, usa y paga Onia sin un
> humano de Onia y sin una promesa falsa. Codex (cuota agotada al 99 %) le pasó el candidato a Claude el
> 28-sep (traspaso: `onia-platform-v1-integracion-20260927/docs/ONIA_TRASPASO_CLAUDE_20260928.md`).
>
> **2. En producción y verificado (29-sep, 03:27-03:36 UTC).** Platform `release-c3b92067`
> (BUILD `Bro1EA6eJeLv3cvDtPZRs`, rollback `onia-platform-prev-PNIhLndY-20260929-032719`): pago con el
> **QR estático del BCP** en el checkout (`/pago/qr-bcp-onia.png` 200), **ícono verde con «on» negro**,
> aviso de Meta **sin tramo gratis** (fuente oficial: desde el 1-oct-2026 Meta cobra cada mensaje de
> servicio, «Volume tiers: None»). Web: «pagás con nuestro QR» (BUILD `5k0gr8iqCdGMnG_ZMnkze`).
> **CI gratis:** GitHub Free agotó sus 2.000 min; ahora corre en **runners propios en el VPS**
> (`onia-runner-platform` 1,5 CPU/6 GB, `onia-runner-hermes` 0,5/1,5 GB, actions/runner v2.337.0 con
> SHA verificado, sin socket Docker, usuario no root). Parche de disponibilidad de Hermes desplegado y
> el job de agenda de las 08:00 con la skill `agenda-calendario` (ya no inventa horarios).
>
> **3. Candidato 1.0 listo para aprobar (NO publicado).**
> | Qué | Dónde |
> |---|---|
> | Platform integrada (15 ramas + master) | `C:/dev/proyectos/onia-platform-v1-integracion-20260927`, rama `codex/v1-integracion-20260927`, **`cef98232`**, respaldo `origin/wip/v1-integracion-20260928`, PR borrador **#90** (CI en el runner) |
> | Hermes (web + configurador + kit + docs) | `C:/dev/proyectos/onia-hermes-v1-remoto-20260928`, rama `codex/v1-hermes-20260928`, respaldo `origin/wip/v1-hermes-20260928` |
> | Suite nativa del candidato | **7.695 pasan / 0 fallan** (CI=true, 29-sep) · tsc 0 · eslint 0 errores |
> Qué trae: todo lo de Codex (DG-088..099: Mi web + configurador, quote de pago inmutable, recurrentes,
> horarios); arreglos de 3 revisiones adversariales (cookie de Mi web, cadencia y doble emisión de
> recurrentes, cierre a medianoche, cambio de plan convertido por relación de precios mensuales, webhook
> BCP atado al pago, referencias de pago, permisos finos en APIs de plata/config/chatbot/suscripción
> —incluido el QR de cobro—, ventana de 24 h de WhatsApp, inbox de Onia excluido, choques entre agentes);
> **WhatsApp saliente desde el número del cliente** (Embedded Signup + plantilla en su WABA);
> **destrabe del aprobador único** (7 días); **Reprogramador**; **Recall de tratamientos a medias** +
> **Plan de tratamiento** en la ficha; panel **«Lo que te dejó Onia»** + botón **«Ya lo envié»**; copy
> honesto y nombre **«Agente conversacional de WhatsApp»**; kit de venta reescrito con gate.
>
> **4. Para publicar (con el «OK» de Sergio Urcullo sobre la página de revisión):**
> (a) aplicar las 3 migraciones aditivas (`20260927050000_add_web_service_requests`,
> `20260928010000_add_web_visual_selection`, `20260928020000_add_subscription_payment_quotes`) con
> backup previo (skill `onia-db`); (b) **`ONIA_WHATSAPP_INBOX_ID=5` en `/opt/onia-platform/app.env`
> ANTES del swap** (sin ella, en producción el resolver no presta ningún token de inbox: falla cerrado);
> (c) merge del PR #90 a `master` con CI+Security verdes → `publicar.sh` → «PUBLICADO Y VERIFICADO» →
> mirar las pantallas nuevas; (d) Hermes: push de la rama a `main` → publicador de la web → mirar
> `/agentes`, `/chatbot`, `/precios` y que `/v1` redirija 308.
>
> **5. Intentos fallidos y trampas (no repetirlos).**
> - Un veredicto sobre Meta con fuente de terceros («1.000 gratis») estuvo a punto de publicarse: la
>   página oficial no lo dice. Precios de proveedores SOLO de la fuente oficial.
> - El runner con 4 GB murió por memoria en `next build` (subido a 6 GB). Un checkout completo de hermes
>   en el runner dejó 11 GB en el disco del VPS: solo `repo-pulse` corre ahí con clon parcial.
> - Vitest en Windows: timeouts de tests que recorren el repo (`stock.test.ts` advisory lock,
>   `backup-onia-postgres`, `rango-gitleaks`) — pasan solos; el CI de Linux es el árbitro.
> - Los «falta mergear» de las colas viejas caducan: medir `origin/master` y la imagen que corre.
>
> **6. Lo que depende de Sergio Urcullo.**
> 1. **OK sobre la página de revisión de la 1.0** (y con eso, las 3 migraciones).
> 2. Probar «Conectar mi WhatsApp» con un número real (7 pasos en el informe de la rama wa-saliente) —
>    confirma que Chatwoot entrega el token y que la plantilla sale aprobada.
> 3. Compartir su calendario personal (`sergio.urcullo.m@gmail.com` → «Ver solo disponibilidad» a
>    `oninteligenciaartificial@gmail.com`) para que Hermes vea su agenda real.
> 4. Levantar WSL en la PC de casa (`DESKTOP-0GGGNMF`): el túnel `127.0.0.1:2222` está caído desde el
>    28-sep 16:00 UTC (propuesta de disparador cada 10 min, sin aplicar).
> 5. SIAT Fase 1 (80 %, VI 150/560, IX 60/160): manual por su procedimiento; pedir Fase 2 antes del 04-nov.
> 6. Decisión de la etapa post-1.0: modelo de IA para el agente (recomendado gpt-4.1-mini → GPT-6 Sol,
>    respaldo Sonnet 5.5, Opus 5.5 como juez; Sergio pidió revisarlo una vez más) y el paquete S/M.
>
> **7. Después de la 1.0 (decidido, en este orden sugerido):** IA en las respuestas del agente
> conversacional (con evals en voseo, topes por contacto/hora y clave LiteLLM por org); plantillas de
> Meta para los mensajes de agentes fuera de la ventana de 24 h; checkout del paquete único S/M con
> medidores de cupos y techo de Meta en Bs; agendar dentro del chat; campañas de marketing automatizadas
> con su pago; versiones a medida para empresas desde un archivo de configuración; agente de llamadas
> (solo llamadas entrantes de WhatsApp, por bloques de minutos). Documentos de decisión: artifacts
> «Onia Todo Incluido» (claude.ai/artifact/DVcDcZSXxo7SHXPPkCeKq3) y «Onia: IA y competencia»
> (claude.ai/artifact/49tFiGrgQ5FRETKjecSY5p).


> ## 🗂️ (historia) EMPEZÁ ACÁ de Codex, 27-sep-2026
>
> **1. Objetivo.** La 1.0 = un cliente de los 5 rubros **descubre, prueba, usa y paga** Onia sin un
> humano de Onia y sin una sola promesa falsa (`cola/plataforma-v1.md` §«Definición 1.0»). La etapa
> del negocio es **conseguir clientes** (`ONIA_ESTRATEGIA_DE_EMPRESA.md`): nada de líneas nuevas.
>
> **2. En producción y verificado.**
> - Correos con la marca real (logo PNG, tinta, Archivo; 13 de la app + 4 de GoTrue):
>   `release-d1ca514e`, 26-sep 20:45 UTC; logo y plantillas 200; rollback
>   `onia-platform-prev-DvBubiuO-20260926-204539`.
> - Bot de ventas (tarea `t_24fa76aa`, con el OK de Sergio): 25-sep 18:44 UTC, `espejo-check` exit 0.
>
> **3. A medias — TODO está commiteado y en GitHub; nada vive solo en la PC.**
> | # | Qué | Repo · rama · commit | Worktree | Respaldo | Falta |
> |---|---|---|---|---|---|
> | A | Pago con el QR estático del BCP, con la identidad de Onia (QR recortado de la tarjeta del banco) | platform · `claude/checkout-qr-estatico-20260925` · `f2dc9a7b` | `E:/onia-wt/checkout-qr` | `origin/wip/checkout-qr-estatico-20260925` | «OK pago» de Sergio + que escanee el QR con su banco |
> | B | Ícono de la app verde con «on» negro (el de Instagram) | platform · `claude/icono-app-verde-20260926` · `a700b4cb` | `E:/onia-wt/icono-app` | `origin/wip/icono-app-verde-20260926` | «OK ícono». Ojo: el logo del encabezado móvil y `/book` usan `public/icon.svg` y también cambian |
> | C | La web dice «pagás con nuestro QR» | hermes · `web/medio-de-pago-qr-estatico` · `481ff75d` | `E:/onia-wt/web-qr-estatico` | `origin/wip/web-medio-de-pago-qr-estatico` | se publica DESPUÉS de A: `medio-de-pago-vivo` exige 200 en `/pago/qr-bcp-onia.png` |
> - **Cómo se publica A/B:** rebase sobre `origin/master` (en A, conflicto chico esperado en
>   `lib/checkout/textos.ts`: conservar la versión del QR), suites + `tsc`, push `HEAD:master`, esperar
>   CI y Security verdes, `nohup bash /opt/onia-platform/_deploy/publicar.sh > /var/log/<nombre>.log`
>   en el VPS y seguir el log hasta «PUBLICADO Y VERIFICADO». Después mirar `/pago/qr-bcp-onia.png`
>   200 y la pantalla renderizada. Recién ahí C: push a `main` de hermes.
> - Páginas de revisión de Sergio: pago + ícono https://claude.ai/artifact/USZ5yuxFc8jpcrSGfuaMWq ·
>   correos (ya aprobados) https://claude.ai/artifact/LZ3SYuFEqMjEZoEMoh26gD.
>
> **4. Archivos clave.** platform: `lib/email-marca.ts` (envoltorios y piezas de todos los correos),
> `lib/email.ts`, `lib/checkout/qr-estatico.ts` (datos del QR, **vence 25/09/2027**),
> `lib/checkout/textos.ts` (única fuente de «cómo se le paga a Onia»: 3 medios),
> `components/billing/QrEstaticoOnia.tsx`, `app/checkout/checkout.css`, `public/pago/qr-bcp-onia.png`,
> `public/correo/onia-logo-banda.png` (`scripts/marca/generar-logo-correo.mjs`),
> `scripts/gen-app-icons.mjs`; guards `__tests__/lib/email-marca-real.test.ts`,
> `lib/checkout/medio-de-pago-derivado.test.ts`. hermes: `web-factory/apps/onia-platform/src/content/medio-de-pago.ts`,
> `docs/research/2026-09-26-web-estructura-yeezy-skims-y-push.md`.
>
> **5. Intentos fallidos y trampas (no repetirlos).**
> - **Empujar una rama `claude/*` = publicarla** en los DOS repos (`onia-cola.md` líneas 407 y 465 la
>   mergea sola). Respaldos con prefijo `wip/`. **Mergear a `master` de platform = publicar** (cron
>   cada 3 h, minuto 50).
> - `next dev` NO corre desde `E:` con `node_modules` en junction a `C:`. Renderizar desde
>   `git archive HEAD` a una carpeta en `C:` con junction a `C:\dev\proyectos\onia-platform\node_modules`.
>   Usar Playwright con `waitUntil: "load"` (con `networkidle` se cuelga por la recarga en vivo). Borrar la
>   junction con `cmd /c rmdir` ANTES de borrar la carpeta.
> - OpenCV NO decodifica el QR del BCP (modo 5); solo lo detecta. La prueba real es la app del banco.
> - Vitest reescribe 2 `.snap` a LF: `git checkout -- <snap>` antes de commitear. Fallan en Windows y
>   son conocidos: `sin-envoltorios-de-cron-del-vps` (git ENOENT) y `scripts/qa-v1/{schema,contract}` (CRLF).
> - El `ok <id>` de Telegram = `onia-tablero.sh unblock <id>` **+** `node /root/bin/onia-publicar-aprobado.mjs <id>`.
>   El `unblock` solo NO despliega.
> - El `node_modules` de la web en el checkout principal de hermes apunta a un worktree borrado
>   (`web-creator-personal-site-eed2f3`): en un worktree nuevo, crear junctions a `web-factory/node_modules/.pnpm`.
>
> **6. Lo que depende de Sergio Urcullo.**
> 1. «OK pago» (después de escanear el QR sin pagar) y «OK ícono».
> 2. Autorizar Cloudflare (`claude` → `/mcp` → cloudflare): copia de respaldo fuera del VPS en R2, con
>    la PC de casa como segunda copia.
> 3. Probar «Conectar mi WhatsApp» en la cuenta Clínica Sergio con su número nuevo, **nunca** el del bot.
> 4. SIAT: entrar al portal para ver el marcador y pedir la Fase 2 antes del 04/11. Leslie: certificado
>    de producción (Bs 70). **Sergio Urcullo le pasa a Codex el estado actual de la Fase 1** (27-sep):
>    partir de ese dato, no del 24,8 % viejo de la memoria.
> 5. Decidir: rehacer la web con estructura corta (research) y sacar «homologación en trámite» de la FAQ.
> 6. Factura de los primeros pagos: el sistema no puede emitir factura electrónica hasta que el SIN lo
>    autorice (Fase 2), y Sergio pidió «nada manual».
>
> **7. Próximos pasos, en orden.** (1) Con los OK: publicar A y B, y después C. (2) Destrabe del
> aprobador único: se destraba solo, con criterio, o se exige más de un admin (decisión de Sergio,
> memoria `decisiones-sergio-25-sep-qr-icono-destrabe`). (3) Respaldo en R2 + casa. (4) Segunda
> pasada de los correos, más breves y con más emoción (sugerencia de Sergio). (5) Web corta, si Sergio
> dice sí. (6) Menores: raya larga en «Enviar comprobante — Bs X», APIs por rol base (punto 2 de la
> cola vieja) y push del chatbot genérico (punto 3).

> ## 📌 25-sep (tarde) — lo que Sergio Urcullo pidió anotar, y el estado de cada cosa
>
> **En curso en esta sesión:** punto 1 de la cola, rediseño de correos con la marca real (worktree
> `E:/onia-wt/email-marca`, rama platform `claude/email-marca-20260925`). Se publica recién con el
> OK de Sergio Urcullo sobre la vista previa renderizada.
>
> **La app (en qué quedamos):** «Instalá Onia» está EN PROD desde el release `39aa965b` (Android y
> Windows con el aviso nativo del navegador; iPhone con instrucciones) y el aviso push funciona de
> punta a punta en Chromium. Falta: (1) que Sergio Urcullo la instale y reciba un aviso en un
> Android, un iPhone y una Windows reales (Task 9); (2) que elija UN ícono. Play Store / App Store
> quedó decidido para cuando haya clientes (D7 de `ONIA_AGENTE_DEL_NEGOCIO.md`).
>
> **MCP de Onia:** pasado por el test de tres preguntas → falla la primera (el cliente ideal no
> conecta asistentes de IA). Anotado con su veredicto en `ONIA_ESTRATEGIA_DE_EMPRESA.md` §14. No
> entra en la 1.0.
>
> **Respuestas de Sergio Urcullo (25-sep, 14:20 La Paz) — decisiones, no se vuelven a preguntar:**
> - Meta: **método de pago ya cargado**.
> - QR estático del BCP **recibido**: titular «Oniaagency De Mercado Moreno Leslie», cuenta
>   **701-5104427-3-05**, monto libre (Bs 0,00), **vence el 25/09/2027** (anotar recordatorio). Copia en
>   `E:/onia-wt/_insumos/qr-bcp-onia-20260925.jpeg` (vino por WhatsApp Desktop). Siguiente de la cola:
>   ponerlo en el checkout.
> - SIN: **no llamar**; seguir con la **Fase 2** del SIAT.
> - Facturación: **nada manual** (no facturar a mano por el Portal Web).
> - Ícono: **el verde con negro, el de Instagram**. Hay que aplicarlo a la app instalable.
> - Pruebas del agente del negocio: con el **número de WhatsApp de Onia, el que ya está puesto**.
> - Si «Solo el dueño» aprueba y desaparece: **se destraba solo, con criterio, o exigiendo más de un
>   admin**.
> - Correos: pidió verlos → página https://claude.ai/artifact/LZ3SYuFEqMjEZoEMoh26gD (espera «OK correos»).
> - Pidió investigar cómo darle acceso a sus cuentas y las novedades de IA: hecho. Conector oficial
>   donde exista (Cloudflare pendiente de autorizar con `/mcp`), token mínimo en el servidor para lo
>   que corre solo, su sesión de Chrome para el SIAT, y el banco afuera.
> - Aprobación del bot (S17→S18): el pedido vivo es `t_24fa76aa`; se aprueba con `ok t_24fa76aa` por
>   Telegram.
>
> **26-sep (tarde):** ✅ **Correos EN PROD** — Sergio Urcullo los aprobó («perfectos»; sugirió quizá
> más breves o con más emoción, anotado para una segunda pasada). `release-d1ca514e` (BUILD
> `PNIhLndYbrHxc_q0RFByG`, publicador oficial, 20:45 UTC; incluye el heredado `766a3a33` de
> `onia-cola`); CI+Security verdes; rollback `onia-platform-prev-DvBubiuO-20260926-204539`. Medido:
> `/correo/onia-logo-banda.png` 200 image/png; las 4 plantillas de GoTrue 200 con el logo y sin
> «Onia.»; `supabase-auth2` con sus 4 `MAILER_TEMPLATES`. Pago con QR **rehecho con la identidad de
> Onia** a pedido de Sergio (QR recortado de la tarjeta del BCP, `f2dc9a7b`) + **ícono verde/negro**
> (`claude/icono-app-verde-20260926`, `a700b4cb`, respaldo `origin/wip/icono-app-verde-20260926`;
> ojo: el logo del encabezado móvil y `/book` usan `public/icon.svg` y también pasan al tile verde).
> Los dos esperan «OK pago» / «OK ícono» en https://claude.ai/artifact/USZ5yuxFc8jpcrSGfuaMWq.
> Análisis Yeezy/SKIMS + push en la web: `research/2026-09-26-web-estructura-yeezy-skims-y-push.md`
> (push en la web: NO; propuesta de 7 cambios de estructura, sin aplicar; FAQ 6 «homologación en
> trámite» = obra en la venta, decide Sergio).
>
> **EN VUELO al cierre del 25-sep (tarde), nada publicado todavía:**
> | Qué | Dónde | Estado | Espera |
> |---|---|---|---|
> | Correos con la marca real (17: 13 de la app + 4 de GoTrue) | platform `claude/email-marca-20260925` en `E:/onia-wt/email-marca`, respaldo `origin/wip/email-marca-20260925` (`6d5b8757`) | revisión adversarial (5 lentes) aplicada, suite 0 fallos nuevos | «OK correos» de Sergio Urcullo → https://claude.ai/artifact/LZ3SYuFEqMjEZoEMoh26gD |
> | QR estático en el checkout y el add-on | platform `claude/checkout-qr-estatico-20260925` en `E:/onia-wt/checkout-qr`, respaldo `origin/wip/checkout-qr-estatico-20260925` (`93d76046`) | revisión (3 lentes) aplicada; renderizado y MIRADO claro/oscuro 375/1280 | «OK pago» + que Sergio escanee el QR con su banco (OpenCV no decodifica el modo del BCP) → https://claude.ai/artifact/USZ5yuxFc8jpcrSGfuaMWq |
> | Web: el medio de pago dice «QR» | hermes `web/medio-de-pago-qr-estatico` en `E:/onia-wt/web-qr-estatico` (`29ffb25f`), **solo local, sin upstream a propósito** | 40/40 | el deploy de la plataforma primero (`medio-de-pago-vivo` exige 200 en `/pago/qr-bcp-onia.jpg`) |
> - **Orden de publicación:** mergear las dos ramas de platform a `master` (conflicto chico esperado en `lib/checkout/textos.ts`: raya larga del correo) → publicador → verificar `/pago/qr-bcp-onia.jpg` 200, `/correo/onia-logo-banda.png` 200, GoTrue toma las plantillas (log `templatemailer`) → recién ahí push de la web. ⚠️ Mergear a `master` = publicar (cron cada 3 h).
> - **Bot publicado hoy** con el OK de Sergio (t_24fa76aa): 38 archivos, `espejo-check` exit 0, 18:44 UTC.
> - Anotado, no hecho: «Enviar comprobante — Bs X» del checkout lleva raya larga (anterior); `scripts/qa-v1/contract.test.ts` también falla por CRLF en Windows; el `node_modules` de la web en el checkout principal de hermes apunta a un worktree borrado (`web-creator-personal-site-eed2f3`).
>
> **Lo que depende de Sergio Urcullo, junto y en orden de urgencia:**
> 1. Método de pago de Meta **antes del 30-sep** (el 1-oct termina la ventana gratis de WhatsApp).
> 2. Imagen del QR estático del banco + titular exacto de la cuenta: sin eso el cliente no puede pagar.
> 3. SIN (800 10 3444): ¿la solicitud 9473 se autoriza con los XSD viejos o pasa al anexo de la
>    RND 102600000034? + pedir la Fase 2 antes del **04/11**. Para leer el % de la Fase 1: iniciar
>    sesión en la pestaña del grupo «Claude» de su Chrome (no se escriben contraseñas por él).
> 4. Decidir: facturar cada suscripción a mano por el Portal Web mientras el SIN no autoriza.
> 5. Elegir UN ícono (tile blanco con «on» verde de la app, o verde con «on» negro de la web e Instagram).
> 6. Probar la app instalada en celulares y PC reales (arriba).
> 7. Firma S17 para publicar el bot (lo frena el teléfono fijo) y probar el Embedded Signup con un +591.
> 8. D5: el número del WhatsApp del dueño para el agente del negocio.
> 9. Con «Solo el dueño» aprobando: si ese dueño desaparece, ¿destrabe automático o manual?
> 10. Web: el titular «Agentes con IA» (decisión de copy).
> 11. Token de Cloudflare R2 para la copia de respaldo fuera del VPS.
> 12. OK visual del rediseño de correos (esta sesión) antes de publicarlo.
> 13. Lo único que cierra el §11 de la 1.0: **clientes**.

> ## 🎯 GOAL VIGENTE (24-sep-2026) — «terminar la 1.0» — leer esto primero
>
> **Pedido de Sergio Urcullo, 24-sep:** *"corre un goal de finalizar la versión 1.0: agentes AI,
> chatbots, sistema, SIAT… anota, sigue tu claude.md, subagentes, hooks, loops, revisa"*.
> Lo ejecuta una sesión de Claude Code (orquestador + subagentes por carril).
>
> **Objetivo medible:** las 9 puertas de `cola/plataforma-v1.md` en verde medidas en vivo, y el
> criterio de cierre de `ONIA_ESTRATEGIA_DE_EMPRESA.md` §11 (un cliente real de los 5 rubros se
> registra solo, carga datos, usa un día real, paga y vuelve a paga). **Hoy §11 = 0/5**: 4 orgs en
> prod, ninguna cliente, 0 pagos. Las condiciones 2-5 NO las cierra el código: necesitan clientes;
> el código solo saca lo que haría fallar a ese cliente. Fecha mínima de cierre: ~30 días después
> del primer pago (condición 5).
>
> ### Hecho y verificado EN PRODUCCIÓN el 24-sep
> | Qué | Evidencia |
> |---|---|
> | Lote Codex (DG-055..085) + revisión Claude **commiteado y en `master`** | platform `9497a1a0`, `8c87aba4`, `7bcd0a83`; CI + Security verdes |
> | **Swap a la imagen Node 22** (`onia-platform:release-7bcd0a83`, BUILD `FU8j_OHPyRH1XCCr6-0uY`) | canario sin tráfico con cuenta ZZ QA: alta por pantalla → onboarding 5 pasos → 8 pantallas 200, 0 errores; post-swap mismo recorrido en `app.onia.com.bo` 200/0 errores; QA borrada 0/0/0. Rollback: contenedor `onia-platform-prev-9tuk-20260924` |
> | Respaldo diario v3 (alerta Telegram, candado viejo recuperado con aviso, identidad por repo) | copia supervisada 17:30Z exit 0, 1,97 MB, gzip OK; cron sin cambios |
> | 🔒 4 tablas `backup_*_20260904` que `anon` podía leer/modificar/borrar por la API pública | REVOKE + RLS; API ahora 401; copia root-only `/root/backups/security-20260924/` |
> | DG-085 (artefacto mirado en navegador aislado) | r3 pasa 8 vistas/12 capturas; la r1 de Codex había fallado sin registrarse (bug del arnés) |
>
> ### Decisiones de Sergio Urcullo del 24-sep (no se vuelven a pedir)
> VPS renovado · commit+push+merge del lote Codex · rebuild+canario+swap · instalar respaldo v3 ·
> cerrar las tablas expuestas · **receta de deploy ÚNICA = imagen Docker Node 22** · checkout con
> **QR estático** del banco (falta que él pase la imagen y el titular) · **quitar** el cartel
> «Documento base operativo» de Términos.
>
> ### ✅ Segundo release del día + publicador migrado (19:05-19:11 UTC)
> - Carril A en prod: platform `3986b807` (BUILD `VREeqNSncIqDIOTMbfLTQ`) — cartel de Términos fuera,
>   **guard de solo lectura como clase** en `proxy.ts` (canario: org QA vencida → POST/PUT 403
>   `PLAN_READ_ONLY`, GET 200), fiado anulado ya no cuenta como deuda, vencimientos sin cuentas
>   propias, «Aprobar y enviar» no se ofrece ni consume sin WhatsApp propio/cupo, Equipo sin
>   «Bs 0,00/mes». Suite 6.374/0. Rollback: `onia-platform-prev-FU8j-20260924`.
> - Carril D en `main` (`3a3677f4`, conciliado con el arreglo del loop `908057a6`): publicador,
>   `build-and-stage.sh`, `swap-imagen.sh` y `recreate-container.sh` sobre la IMAGEN; sincronizados
>   al VPS. Dry-run: «YA ESTA PUBLICADO — producción corre 3986b807». La trampa de la receta vieja
>   quedó cerrada. Skill `onia-deploy` actualizada (platform `99a403dc`).

> ### ✅ Tanda 2 instalada y publicada (24-sep, 20:15-20:36 UTC, con OK de Sergio Urcullo)
> - **Seguridad 2:** 5 tablas de `onia_center` (`cost_items`, `ai_radar_items`, `respaldo_reloj_20260919`,
>   `finance_entries`, `calcom_bookings`) que CUALQUIER usuario registrado podía leer/borrar por la
>   API → RLS + política `is_sergio()` como sus hermanas; respaldo revocado. Simulado: extraño ve 0,
>   borra 0. Copia `/root/backups/security-20260924/onia-center-5-tables.sql.gz`.
> - **Vigías:** comprobantes pendientes → Telegram cada 10 min (cron nuevo); `security-watch` reparado
>   y con alerta de CLASE (tabla sin RLS en esquema servido por la API). Corridos a mano: limpios.
> - **Web:** DG-072 + Términos §3.4 y Privacidad alineados con el producto (plan vencido = solo
>   lectura, nada se borra de inmediato; Completo = 500 conversaciones/mes). Gate de precios VERDE
>   (44 cifras), gate de privacidad OK. Publicado y verificado en onia.com.bo 20:28 UTC, mirado.
> - **Todas las cuentas de producción son de PRUEBA** (Sergio Urcullo): §11 = 0/5.
> - ⚠️ El integrador `onia-cola` mergea solo a `main` toda rama `claude/*` que se empuje: no empujar
>   ramas a medias.
> - **Restauración PROBADA (puerta 9), 20:58 UTC:** el respaldo real de las 17:30 restaurado en un
>   contenedor aislado (misma imagen `supabase/postgres:15.8.1.085`, red none): 171 tablas, 0
>   faltantes, 164 idénticas; las 7 que difieren son actividad posterior (prod tiene MÁS). Políticas y
>   RLS difieren exactamente en los cierres de seguridad posteriores al volcado. Evidencia:
>   `/root/backups/restore-test-20260924/`. Contenedor de prueba borrado.
> - **Respaldo de comprobantes (Storage):** `onia-backup-storage.sh` (hermes `b3f621cc`), cron 07:10
>   UTC, últimas 30 copias en `/root/backups/onia-storage-v1/`; primera copia OK (2 archivos).
> - **Tercer release del día, 22:48 UTC, por el PUBLICADOR OFICIAL migrado (primera corrida real):**
>   platform `39234c89` (BUILD `1fCNCDEJaOeFVV1KczGHP`): código muerto de OpenAI borrado + «Enséñale
>   conversando» con error honesto y Sentry. `OPENAI_API_KEY` fuera de `app.env` (backup
>   `app.env.bak-pre-sin-openai-20260924`). Build + 9 gates + canario + swap + verificación, solo.
> - **IA con tope:** claves LiteLLM `onia-platform-agentes` (US$5/30 d) y `onia-bot-motor` (US$10/30 d),
>   solo gpt-4.1-mini, en `/root/.config/onia/litellm-*.key`. El bot las usa recién con el próximo
>   deploy del bot (verifica la clave al arrancar y cae a la maestra si no sirve). Vigía de crédito de
>   IA cada 15 min (Telegram directo).
> - **Diseño del agente de cada negocio:** `hermes-content/docs/platform/ONIA_AGENTE_DEL_NEGOCIO.md`
>   (decisiones D1-D4 de Sergio; D5 = número del WhatsApp del dueño, pendiente). La redacción mensaje por
>   mensaje (`claude/v1-agentes-llm-20260924`, `56752b95`+`6292f750`) NO se publica: D2 la reemplaza por
>   plantilla por negocio; su cliente, validación y topes se reusan.
> - **Bot: fuga de procesos zombie cortada (21:21 UTC).** `onia-center` tenía 13.559 zombies (pids
>   13.581/19.092, +720/día): el `timeout` de busybox que el watchdog corría DENTRO del contenedor dejaba
>   un hijo huérfano por corrida que el PID 1 (`node`) nunca recoge; en ~7 días el bot no podía crear
>   procesos. Arreglo en `main` (`5dd54711`, test de clase), hotfix del watchdog instalado solo, contenedor
>   reiniciado: zombies 0, pids 22, bot sano y de vuelta en el conocimiento del panel (v4) en 20 s.
>   Pendiente de clase: recrear `onia-center` con `--init` junto con el próximo deploy del bot.
> - **Auditoría de IA (24-sep):** los 6 agentes NO usan ningún LLM (reglas + plantillas; se venden como
>   «Agentes con IA»). IA real = gpt-4.1-mini vía LiteLLM (reformular en el bot, fotos, «Enséñale
>   conversando») y gpt-4o-mini-transcribe directo (audios). Gasto IA 30 días: US$12,20, de los cuales
>   US$11,93 es Hermes (interno). Del 9 al 17-sep OpenAI sin crédito y nadie se enteró.
> - **PC:** 14 worktrees viejos de `onia-platform` archivados (ramas intactas; las 4 que solo vivían
>   en la PC, en GitHub como `archivo/*`; scripts sueltos en `E:/onia-wt/archivo-worktrees-20260924/`).
>   C: de 5,2 → 16,5 GB libres (+ cachés npm/pip). Queda compactar `docker_data.vhdx` (31 GB, necesita
>   admin + Docker apagado).

> ### ✅ 25-sep (madrugada, UTC 02:30-04:00): avisos de verdad + app instalable + redactor por plantilla
> Decisión de Sergio Urcullo sobre el canal del dueño: **primero avisos DENTRO de Onia**, WhatsApp
> «Onia Avisos» con clientes, tiendas de apps con clientes (`ONIA_AGENTE_DEL_NEGOCIO.md` D3/D5/D7).
> Planes TDD en `onia-platform/docs/superpowers/plans/2026-09-24-*` (A avisos, B correa, C redactor).
> - **Carril A en prod** (release `39aa965b`, publicador oficial): el web push NUNCA había funcionado
>   — la clave VAPID pública no se horneaba (0 suscripciones en la historia). Ahora: build pasa la
>   clave (hermes `03cdb790`, solo si el Dockerfile del commit declara el ARG, y exige las 3 claves),
>   cada aprobación avisa a quien puede decidir (UNA por corrida de agente), link directo a
>   `/pending?approval=<id>` resaltada, campana con link por tipo, «Instalá Onia» (Android/Windows con
>   prompt nativo; iPhone con instrucciones). **Verificado mirando + de punta a punta:** clave en 1
>   chunk de `.next/static` (0 en el release anterior); Chromium real se suscribió y quedó en
>   `push_subscriptions` (Google FCM); envío con las claves del servidor → HTTP 201. Suscripción de
>   prueba borrada (0). Falta: Sergio Urcullo en Android/iPhone/Windows reales (Task 9).
> - **Encontrado MIRANDO, no por test:** en oscuro el panel de la campana era `bg-white` con texto
>   claro (ilegible). Arreglado con guarda de fuente (platform `11df2613`), sale con el release del C.
> - **Carril C** (platform `2075575f`, hermes `9d89e4d1`): los agentes llenan una plantilla que la IA
>   escribe UNA vez por negocio y agente y el dueño aprueba; la IA nunca ve clientes; cupo mensual por
>   plan; Sentry si una aprobada deja de validar. Red PROPIA `onia_llm` (solo plataforma + LiteLLM; la
>   del stack admite 12 servicios que verían el :3000 sin Traefik). `app.env` con `AGENTS_LLM=1`,
>   `AGENTS_LLM_BASE_URL`, `AGENTS_LLM_KEY` (clave virtual US$5/30 d; backup
>   `app.env.bak-pre-agents-llm-20260925`). Suite completa A+C: 517 archivos / 6.478 tests, 0 fallas.
>   **EN PROD: `release-2075575f`** (publicador oficial, 23:03 La Paz). `onia_llm` = solo
>   `onia-platform` + `onia_selfhosted-litellm-1`; `nc` a LiteLLM OK. **Mirado en `/agents`**:
>   «Proponer un texto» (Recall, Clínica Sergio de prueba) devolvió un texto real de gpt-4.1-mini, vista
>   previa con el nombre de muestra fijo, contador «1 de 150», descartado después; campana en oscuro
>   legible; logs sin errores.
> - **Plan B (correa) EN PROD: `release-d3b24cbc`** (platform `d3b24cbc`, 25-sep 05:11 UTC, publicador
>   oficial). Quién aprueba se pregunta en UN lugar (`puedeDecidirAprobaciones`): rutas de aprobaciones,
>   `/pending`, inicio, inicio de comercio, `/agents`, la ruta de textos y los AVISOS de `collab.ts`, con
>   test de CLASE (toda pantalla que lee propuestas debe llamarlo). Selector «quién aprueba» en
>   `/team/roles` (solo en planes con coadministradores), con pedido que los otros aprobadores confirman.
>   Vigía de agentes (cartel en `/agents` + Sentry al caer y al volver), «Por qué» en cada propuesta.
>   Dos rondas adversariales de PERMISOS: 1 CRITICAL + 1 HIGH + 6 MEDIUM arreglados (entre ellos
>   `DELETE /api/doctors/[id]` borraba al dueño sin chequeo; `/api/onboarding/aplicar` creaba ADMIN
>   fantasma), con test de clase de puertas que borran/escriben un rol. Suite 6.650/0.
>   **Verificado en vivo:** gate pre-merge 0 admins pierden «dueño» (corrido 2 veces); Sentry encendido;
>   `/team/roles`, `/pending`, `/agents` 200 sin errores de consola, MIRADOS; corrida fallida de prueba en
>   la clínica de prueba → cartel rojo «Tus agentes fallaron el 25/9/2026…» + evento Sentry; corrida de
>   vuelta → cartel fuera + evento «volvieron a correr»; filas de prueba borradas.
>   **Pendiente de mirar:** la línea «Por qué» en `/pending` aparece recién con propuestas NUEVAS (cron
>   diario 07:00 La Paz): abrir `/pending` después de esa hora. Menores anotados: Sentry agrupa caída y
>   vuelta en un mismo issue (fingerprint); en inicio de comercio el staff sigue leyendo «0 propuestas
>   esperando tu aprobación»; `/team/roles` dice «Asigna/asignas» (tuteo, anterior a este carril).
>   **Decisión pendiente de Sergio Urcullo:** con «Solo el dueño», si ese dueño desaparece sin
>   entregar, hoy solo lo destraba Onia (SQL en la skill `onia-db`). ¿Automático por inactividad o
>   manual? (no hay señal fiable de último ingreso en `Profile`).
> ### ✅ 25-sep (mediodía): auditoría UI + legal Bolivia + open source, y sus arreglos
> Página para Sergio Urcullo: https://claude.ai/artifact/F2FnM54TK1M2iakwoatBG7 (62 agentes, 67
> hallazgos confirmados por verificación adversarial, 3 descartados; informe con archivo:línea en
> el scratchpad de la sesión `tasks/audit-report.md` y `audit-full.json`).
> - **Web EN PROD** (hermes `47afdc00`, publicador 12:35 La Paz, verificado con curl): Términos y
>   Privacidad **v1.2 del 25-sep** (titular Leslie Mercado Moreno + NIT, factura por cada pago,
>   cláusula de reclamos, precios finales con impuestos, renovación = solo lectura), privacidad declara
>   **OpenAI, Telegram y Cloudflare**, pie «Onia · NIT 5371375010 · EMITE FACTURA», comparativa con
>   fechas y sin absolutos.
> - **Plataforma EN PROD: `release-492e7155`** (12:39 La Paz, publicador oficial; merge de carriles
>   L/F/S, suite 6.809 + fallos conocidos de CRLF/Windows). `/terms` responde 200 con `meta refresh`
>   inmediato a la web (redirect de página estática de Next): para un 308 real, moverlo a `redirects()`
>   de `next.config.ts`. **Falta MIRAR** la reserva pública de una clínica de prueba y el checkout: `/terms` `/privacy` `/data-processing` redirigen a la web; alta registra versión 1.2
>   en el audit `USER_CREATED`; checkout dice factura y **sin garantía de devolución (decisión de
>   Sergio Urcullo 25-sep)**; FAQ sin «cifrado en reposo»; planes sin SLA/multisucursal; reserva
>   pública sin Términos B2B y con aviso de quién recibe los datos; «Nota de venta» + «sin valor
>   fiscal» donde no hay CUF (correo, impresión, pantallas); fuera la fila IT 3%; libro de ventas corta
>   el mes en hora de La Paz; correos sin «Sistema de Gestión Dental»; receta con el nombre de la
>   clínica; badge de push monocromo; push de citas SIN nombre completo ni motivo; no se borra un
>   paciente con historia clínica; recepción no «guarda» alergias; roles finos aplicados en las
>   PÁGINAS de plata/planilla/contabilidad/reportes/empresa/settings con test de clase.
> - **Pendiente, en orden (próxima sesión):**
>   1. **Rediseño de correos con la marca real** — Sergio vio «Bienvenido, Carla» (género fijo, emoji,
>      «Onia.» dibujado a mano con punto de oración, tipografía genérica): logo = `onia` minúscula con
>      el punto verde `#00D26A` como punto de la **i** (`web-factory/docs/ONIA_MARCA.md`, SVG en
>      `onia-platform/public/onia-logo.svg`, en correo va como PNG hosteado); tinta `#12100E`;
>      tipografía Archivo con la mecánica Fanvue (`web-factory/data/references/design-sources/
>      fanvue-mecanica-medida.md`: display peso 500, lh ≤1,0, tracking −2 %); saludo neutro («Hola,
>      Carla»). Revisar también pantallas con aspecto «IA» (skill `impeccable` + galería).
>   2. **APIs que siguen por rol base** (MEDIUM, fuga con coadmins): `/api/rrhh/planilla-export`,
>      `/api/rrhh/employees`, `/api/reports/export`, `/api/empresa/expenses/export`,
>      `/api/empresa/commissions`, `/api/settings/export`, `/api/settings/api-keys` y las subpáginas
>      `/settings/chatbot|api|addon-chatbot` → helper que exija `finance.read`/`config.write` + test de
>      clase en `app/api`.
>   3. Push del chatbot «te escribieron» genérico (sin nombre ni texto) y asunto del correo al
>      profesional sin nombre de paciente (`lib/chatbot/push-te-escribieron.ts`, `lib/email.ts` ~1045).
>   4. Ganancias fáciles Bolivia (informe §3.4): recordatorio RCV día 9 + IUE + F-608; exportar lo
>      clínico en «Exportar mis datos»; datos de facturación del comprador (NIT/CI/99001-3); bandeja «Por
>      facturar en el SIN»; consentimiento informado imprimible; compras en plantilla SIN 23 columnas;
>      auditoría clínica visible al dueño; odontograma con historial; régimen tributario en el alta.
> - **Lo de Sergio Urcullo:** Meta método de pago ANTES del 30-sep · preguntar al SIN (800 10 3444)
>   si la solicitud 9473 se autoriza con los XSD viejos o migra al anexo de la **RND 102600000034**
>   (pruebas 1-oct a 16-nov) · facturar cada suscripción por el Portal Web desde el primer cliente ·
>   elegir UN ícono (tile blanco/«on» verde de la app vs verde/«on» negro de web e Instagram) · SIAT:
>   iniciar sesión él en la pestaña del grupo «Claude» de su Chrome para que se lea el % de la Fase 1
>   (la pestaña que abre la extensión NO comparte su sesión; no se escriben contraseñas).
> - **Corrección de memoria:** el 30-sep NO obliga a todos a facturar en línea: solo grupos 9-12 por NIT
>   (RND 102600000007). Open source: ahorro máximo ~US$6/mes; las palancas son Codex (confirmar si
>   cobra US$100), bajar Claude Max al terminar la construcción, pausar Higgsfield.
> - **Intentos fallidos (25-sep mediodía):** `git checkout -q origin/master --` sin rutas DESPRENDIÓ el
>   HEAD del worktree (se recuperó volviendo a la rama; nunca usar checkout con `--` vacío); `npm test`
>   de la web sale 78 en Windows (el wrapper no lanza `.bin/vitest`): correr
>   `node node_modules/vitest/vitest.mjs run`; los 19 fallos de la web existen igual en `origin/main`.

> - **Intentos fallidos de la noche:** (1) `pgrep -f <script>` por ssh se encuentra A SÍ MISMO (el
>   `bash -c` remoto lleva el nombre en su línea): dijo «ya corre» y el release del C no se lanzó.
>   Esperar por el log, no por pgrep. (2) Push en headless: el contexto incógnito de Playwright no
>   soporta Push API; hace falta `launchPersistentContext` + `channel: "chromium"`. (3) El cartel
>   «Primeros pasos» tapa la campana en cualquier recorrido automático: cerrarlo primero.
> - **Heredado (no es de este carril):** el loop mergeó a master `/admin/diseno` («las dos
>   direcciones de diseño», `122ac28e`) y viajó en el mismo release.

> ### Cola que sigue (autónomo), en orden
> 1. Checkout: QR estático + datos de la cuenta BCP (cuando llegue la imagen) — bloquea «paga».
> 2. Vigía de comprobantes PENDING → Telegram (hoy el único aviso es un correo).
> 3. `security-watch.sh` ciego hace 41 días + alerta de clase «tabla en `public` sin RLS».
> 4. Backup de Storage (comprobantes) al respaldo diario; copia offsite (necesita token R2 de Sergio).
> 5. DG-072 (web pública: gracia real, «sin techos», inventario por rubro) portado desde el checkout
>    sucio de `onia-hermes` a una rama limpia de `main`.
> 6. Web: «Agentes con IA» (los agentes no llaman a ningún LLM) — decisión de Sergio.
> **No tocar (lo llevan loops):** recorridos de estética/importadora/servicios y trial vencido en
> prod (`recorrido-cliente`), publicación y embudo del bot (`chatbot-cola`), /terminos de la web
> (`web-venta`).
>
> ### Depende de Sergio Urcullo (lo que quedó sin respuesta)
> Imagen del QR + titular exacto de la cuenta · firma S17 para publicar el bot (el «precio» que lo
> frena es el teléfono fijo) · marcador del SIN y pedir Fase 2 antes del 04/11 · método de pago de
> Meta antes del 1-oct · probar Embedded Signup con un +591 · token R2 para offsite · decisión
> «facturar la suscripción a mano por el Portal Web mientras el SIN no autoriza» · y lo único que
> cierra §11: **clientes**.

> ## ACTUALIZACIÓN 2026-09-21 (tarde) — leer esto primero
>
> **Este archivo no estaba en `main`.** Vivía solo en la rama `claude/cobro-e2e-punto-1-25ba65`,
> así que Codex abriendo el repo no lo encontraba. Ya está en `main`. La regla de la casa dice
> «un handoff sin pushear no existe para la sesión nueva» — pushear a una rama de carril no
> alcanza: tiene que llegar a `main`.
>
> **Lo que cambió en el pedido.** Sergio Urcullo: *"tengo credinet, pero aún no la api del
> banco… los cobros si es necesario manuales"*. Traducido: el §6.2 (credenciales del API QR del
> BCP) **deja de ser bloqueante del trabajo** — su login de Credinet se destrabó, pero el API
> no llegó. El cobro sigue MANUAL y el objetivo pasa a ser que el circuito manual corra con la
> menor cantidad posible de clics de Sergio Urcullo. Nada de lo que venga ahora debe esperar al
> banco.
>
> **🔴 LO MÁS URGENTE NO ES TÉCNICO: el VPS vence el 24-sep-2026.** Faltan 3 días y sólo lo
> puede renovar Sergio Urcullo (hPanel, `srv1360183`). Si cae, se apaga TODO: panel, base, bot,
> n8n, correo. Nada de esta cola importa si eso no pasa.
>
> **Cerrado hoy, desplegado y verificado:** el punto 1 de la cola (§7). Los puntos 1 y 3
> estaban **mal diagnosticados** — el recuadro de §3 explica en qué, porque el error de
> diagnóstico es más caro que la tarea.

> Escrito el **2026-09-21** por la sesión de Claude Code que venía del bloque de UI
> (patrón Hostinger) y del deploy del 18/19-sep. **Se escribió porque se acaban los
> créditos de esta cuenta**: lo que sigue lo continúa Codex.
>
> Todo lo que dice este documento fue **verificado en vivo el 21-sep**, no recordado.
> Donde no se pudo verificar, dice NO VERIFICADO.

---

## 1. Objetivo

**Dejar la versión 1.0 vendible**: que un dueño de negocio boliviano se registre, pague,
y use el sistema por rubro + el chatbot de WhatsApp, sin que Sergio Urcullo tenga que
tocar nada por cada cliente.

**Definición de "hecho"**: el circuito registro → prueba → cobro → activación →
sistema + chatbot funciona punta a punta en producción, y un cliente puede conectar su
propio WhatsApp sin intervención nuestra.

**Estado: NO cumplido todavía.** Faltan las dos cosas del §6 (lo que depende de Sergio
Urcullo) y la cola del §7. Todo lo demás del circuito está vivo.

---

## 2. Qué quedó EN PRODUCCIÓN (verificado el 21-sep)

| Qué | Evidencia |
|---|---|
| **Panel vivo** en `app.onia.com.bo` | login HTTP 200; BUILD_ID vivo `9tuk1Qk2BjQ2j2HdJcL8u` (build `251f64c`) |
| **Navegación de secciones estilo Hostinger** en `/settings` y `/settings/chatbot` | commit `c51a33de`; `data-seccion` presente en el bundle vivo (`runtime-next/.next/static/chunks/`) y mirado renderizado con cuenta real |
| **Motor del chatbot** en `onia-center:3020` | `/health` → `ok:true`, `db.ok:true`, knowledge `v4` desde el panel (`source:"panel"`, 6 productos, 3 FAQ) |
| **14 commits del carril `chatbots-platform-review`** posteriores al mío, ya deployados | `git log c51a33de..origin/master` = 14; incluyen fixes de cupo, inbox, portal del paciente, equipo/coadmins y horarios que el motor rechazaba |
| 2FA obligatoria solo para SUPERADMIN; `/settings` sin venta para cuentas internas | desplegado el 18-sep, sigue vivo |

**Árboles limpios**: `onia-platform-v1-candidate` en `master` sin cambios sin commitear y
0 commits sin pushear. El worktree de `onia-hermes` (`claude/cobro-e2e-punto-1-25ba65`)
también limpio. **Nada en vuelo, nada se pierde.**

---

## 3. 🔴 Lo que se encontró CAÍDO hoy (y se arregló, pero la causa sigue viva)

**El motor del chatbot estaba MUERTO desde el 19-sep ~19:00 UTC.** Dos días sin
contestar WhatsApp. `webhook-server.sh status` devolvía `{"ok":false,"reason":"no responde"}`
y el puerto 3020 no escuchaba.

**Causa raíz**: un sync dejó los archivos del bot **anidados un nivel de más** dentro del
contenedor — `/tmp/onia-bot/bot/webhook-server.mjs` en vez de `/tmp/onia-bot/webhook-server.mjs`.
El arranque moría con `MODULE_NOT_FOUND` y, peor, el `.stamp` del 19-sep hacía creer al
script que ya estaba sincronizado, así que **no se volvía a copiar solo**.

**Arreglo aplicado hoy** (paliativo, el servicio está vivo):
```
docker exec onia-center sh -c "cp -a /tmp/onia-bot/bot/. /tmp/onia-bot/ && rm -rf /tmp/onia-bot/bot"
/opt/onia/bot/webhook-server.sh start
```

**El watchdog existía, detectó la caída, y no alcanzó.** Hay un cron cada 2 minutos
(`*/2 * * * * /opt/onia/bot/webhook-watchdog.sh`). Durante dos días escribió, cada 2 minutos:

```
[…] el webhook NO responde en :3020 — reiniciando
[…] ERROR: el webhook sigue caido despues del reinicio — mirar ./webhook-server.sh logs
```

**800 KB de log gritando en una habitación vacía.** Reiniciar no arregla un archivo que no
está. A las 19:34 del 21-sep, apenas se corrigió el anidamiento, su siguiente ciclo levantó
el servicio y cerró el incidente solo.

> ## ⚠️ CORREGIDO Y CERRADO el 2026-09-21 (leer antes de trabajar en esto)
>
> **Los tres puntos de abajo se cerraron, y dos de los tres estaban mal diagnosticados.**
> Se dejan escritos porque el error importa más que la tarea: los dos mandaban a construir
> algo que ya existía.
>
> **1. «El watchdog no avisa a nadie» era FALSO.** Medido en el VPS: `tg_error` aparece 9
> veces en el script desplegado y `TG_BOT_TOKEN`/`TG_CHAT_ID` están cargados en
> `/root/.config/onia/backup.env`. El watchdog detectó la caída al primer minuto y **mandó
> su alarma**. UNA. Un viernes a las 19:00, a un Telegram donde Sergio Urcullo ya tiene
> decenas de tareas abiertas. Después se calló 1.440 ciclos con el bot todavía muerto,
> porque el marcador que evita el spam evitaba también el segundo aviso, **para siempre**.
> No faltaba una sonda ni una alerta: **faltaba INSISTIR**.
> → Arreglado en `6037d83a`: las tres ramas (contenedor, webhook, camino a Chatwoot) comparten
> una escalada que re-avisa a los 15 min, 1 h, 6 h y después una vez por día, diciendo hace
> cuánto lleva así; la recuperación dice cuánto duró. Una caída corta sigue costando UN
> mensaje — hay caso que lo fija, porque un watchdog que manda 30 mensajes/hora se silencia
> igual, por el camino contrario. **Verificado en vivo**: 3 avisos de prueba llegaron al
> Telegram de Sergio Urcullo y los 2 que debían callarse se callaron.
>
> **2. «Encontrar qué sync anidó la carpeta» YA ESTABA ARREGLADO en `master`** (`525d282f`):
> el sync copia a `$DEST.new` y recién ahí hace el swap, así que el destino nunca existe
> cuando se copia. Y `sync-no-deja-al-bot-sin-archivos.test.mjs` lo cuida. La causa raíz,
> para el registro: `docker cp ORIGEN DESTINO` crea el destino si no existe pero mete ORIGEN
> **adentro** si ya existe, y el bloque de sync vivía duplicado en 8 scripts que corren por
> cron a horas que se solapan (:17, :32, :47, cada 30 min) mientras el watchdog reinicia cada
> 2 min. Dos syncs a la vez = anidado, y como ambos escriben el mismo `.stamp`, ningún sync
> posterior vuelve a copiar: **el daño era permanente y silencioso**.
> ⚠️ Esta sesión llegó a escribir su propia versión —peor— antes de mirar `origin/main`.
> **La lección: medir contra `origin/main` ANTES de arreglar, no después.** Este handoff
> estaba escrito sobre una base de 760 commits de atraso.
>
> **3. «Distinguir "no responde" de "no arranca"» sí era real y está hecho** (`6037d83a`,
> paso 3.bis): ante `MODULE_NOT_FOUND` borra el árbol del contenedor (y `.new`/`.old`, que usa
> el swap) y fuerza re-sync limpio, en vez de reintentar 1.440 veces un arranque al que le
> falta un archivo.
>
> **Y de paso: el gate del deploy del bot estaba ROJO desde el 15-sep sin que nadie lo viera.**
> `simulate.test.mjs` fijaba `ONIA_BOT_SLOTS` con fechas literales del 14 y 15 de septiembre;
> el motor descarta horarios vencidos, así que dos casos se pusieron rojos **solos**. Como
> `deploy-bot.sh` corre `node --test` antes de copiar, una fecha vencida en un instrumento
> **bloqueaba el despliegue del bot vivo**. (En `master` ya estaba corregido con fechas
> derivadas del reloj; se descubrió trabajando sobre la base vieja.) Lo que sí seguía roto y
> se arregló: `simulate.mjs` resolvía la llave SSH con `/root/.ssh/` **fija** — el escalón que
> nació el 7-sep para arreglar «un instrumento atado a una ruta absoluta deja de medir cuando
> el carril se muda» se había cableado a **otra ruta absoluta**. Tercera vuelta del mismo bug,
> ahora en Windows, y en silencio. Ahora se resuelve por `ONIA_VPS_KEY` → `$HOME/.ssh` →
> `/root/.ssh`, con guarda verificada por mutación.

---

## 3.bis — Inventario del 21-sep: qué falta REALMENTE para lanzar

Tres inventarios verificados contra el código y contra producción. Ordenados por lo que
cuesta la venta.

### 🔴 BLOQUEANTE 1 — el cliente que conecta su WhatsApp **recibe pero no envía con su número**

El Embedded Signup de Meta funciona y está montado sin flag en la pantalla del cliente
(`app/(dashboard)/settings/chatbot/CanalWhatsappCard.tsx:163`, API en
`app/api/chatbot-canal-whatsapp/route.ts`, canje en `lib/chatbot/canal-whatsapp.ts:79`),
con `META_APP_ID` y `META_CONFIG_ID` **cargados en producción** (verificado en el contenedor).

**Pero escribe SOLO `clinic_settings.chatwootWhatsappInboxId` (`canal-whatsapp.ts:92`) y
NUNCA `whatsappPhoneNumberId` / `whatsappAccessToken`.** Esas dos únicamente las escribe el
backoffice de superadmin (`app/api/admin/organizations/[id]/whatsapp/route.ts:63-64`).

Medido en la base de producción el 21-sep:
```
inbox por signup = 1     credenciales salientes = 0     inbox web = 1
```
**Consecuencia real**: el chatbot ENTRANTE contesta bien, pero todo lo SALIENTE —
recordatorios de cita, `/api/n8n/whatsapp/send`, despacho de agentes, relay agente→cliente —
cae al fallback global del número de Onia (`lib/whatsapp.ts:28-33`, comentado ahí mismo como
*"testing only — not for production with real clinics"*) o falla con 422.

*Listo cuando*: conectar por Embedded Signup deja también las credenciales de envío de esa
org, y un recordatorio de prueba sale **desde el número del cliente**. Es el trabajo más
importante de la cola: sin esto, cada cliente nuevo exige que un superadmin le pegue las
credenciales a mano.

### 🔴 BLOQUEANTE 2 — no hay checkout del add-on; cada alta la aprueba Sergio Urcullo a mano

El cliente pide los datos por WhatsApp (`AddonChatbotClient.tsx:416`), transfiere, sube el
comprobante, y **un SUPERADMIN aprueba** en `/api/admin/subscription-payments` para que
`isWhatsAppAddonActive` pase a `true`. Hasta entonces el POST de conexión da 403. Lo mismo
con las recargas de conversaciones (`/api/admin/organizations/[id]/recarga-chatbot`, **sin
test**). Se destraba con el API QR del BCP (§6.2): mientras no llegue, cada venta lleva un
clic tuyo — aceptable con los primeros clientes, no a escala.

### 🟡 El sistema de diseño está escrito y **nadie lo usa** (riesgo de venta ALTO)

`DESIGN.md` fija la dirección y `app/globals.css` tiene los tokens buenos (`font-label` en
`:793`, `--shadow-card`/`--shadow-raised` en `:785-786`). Pero:
- `components/ui/card.tsx` → **0 importadores**. `StatCard` → 0. `button.tsx` → 1.
- `--shadow-card` como clase → **0 usos**; `shadow-raised` → 8, y 6 escritos a mano.
- La superficie de tarjeta se sigue copiando a mano: **108 ocurrencias en 42 archivos**.
- **8 valores distintos de `inputClass` en 28 archivos** (`px-3 py-2 rounded-lg` vs
  `px-4 py-3 rounded-xl`, dos fondos distintos). Un prospecto que pasa de Configuración a
  Facturas ve tres alturas de campo: eso se lee como "no está terminado".
- **`app/(dashboard)/dashboard/` — la primera pantalla después del login — corre con su
  propio CSS** (`dashboard-v2.css`, tokens `--dv2-*` propios), fuera del sistema. Igual
  `app/checkout/checkout.css`.
- Kicker de zona: **9 de 24 rutas** lo tienen. Y hay 105 `uppercase tracking` improvisados en
  41 archivos contra 38 usos de `font-label`.
- `tailwind.config.ts` es **decorativo** y lo admite en su encabezado: en Tailwind 4 no se
  carga. Quien vaya a tocar tipografía ahí no cambia nada.

**Lo que SÍ salió limpio**: el vocabulario por rubro. 46 archivos lo consumen, la lista
`DEUDA` del test está vacía, y ninguna pantalla de cliente le dice "paciente" a un comercio.

### 🟢 Vivo y funcionando en producción (verificado el 21-sep)

- **Agentes ENCENDIDOS y trabajando**: `AGENTS_RUNTIME=1` y `PLATFORM_LAYER=1` en el
  contenedor; **93 corridas** en `onia_agents_runs`, la última el 21-sep 11:00 UTC. Seis
  agentes (`recall`, `cobrador`, `captador`, `reponedor`, `confirmador`, `seguidor`); los que
  contactan a un tercero pasan siempre por aprobación humana en `/pending`. Planes que los
  habilitan: crece/professional/clinic/enterprise.
  ⚠️ Solo **1 acción** generada en 93 corridas — corren, pero casi no tienen de qué hablar:
  hay 2 orgs con add-on y poca data real. No es un bug, es falta de clientes.
- **Alta automática ABIERTA** (`ONIA_ALTA_AUTOMATICA=abierta`): el registro crea la cuenta solo.
- **Cupo del chatbot**: 500 conversaciones/mes del add-on (`lib/pricing.ts:96`), conteo
  idempotente por conversación única, avisos al 80% y al agotarse, y `cuota.agotada` viajando
  al motor (fail-open: si el cupo no se puede leer, el bot sigue contestando).
- **Bandeja nativa**: el dueño ve y responde sin entrar a Chatwoot.
- **Editor de conocimiento**: publica y el motor lo sirve (`source:"panel"`, v4).

### Apagado a propósito (no bloquea, pero conviene saberlo)

- `META_PAGES_PUBLIC` ausente → Instagram/Messenger no se ofrece (espera App Review de Meta).
- `AGENT_RUNTIME_SECRET` ausente → el feed y las acciones para un runtime **externo** de
  agentes dan 503. El módulo interno funciona igual.
- `BCP_QR_*` ausentes → el cobro automático no se ofrece (§6.2).

### Sin test (deuda anotada)

`app/api/bandeja/[id]/route.ts` (responder y cerrar — la superficie que el dueño más toca),
`recarga-chatbot`, y las tres rutas del runtime de agentes.

---

## 4. Archivos y cambios que importan para retomar

**Producto** (`onia-platform`, branch `master`):
- `app/(dashboard)/settings/secciones.ts` — modelo puro de las 6 secciones de `/settings`.
  **Reemplazó a `avanzado.ts`** (borrado). Si agregás un ajuste, va acá y su bloque en el
  `switch` de `SettingsClient.tsx`; el test lo exige.
- `app/(dashboard)/settings/SettingsClient.tsx` — nav lateral (desktop) + chips (móvil),
  una sección visible por vez, deep-link `#hash`.
- `app/(dashboard)/settings/secciones.test.ts` — los guards de que nada se perdió.
- `app/(dashboard)/settings/chatbot/ChatbotClient.tsx` — barra 01/02/03 navegable.
  ⚠️ Las secciones quedan **montadas y ocultas por CSS** a propósito: `bloque-cita.test.ts`
  renderiza el HTML estático completo y desmontarlas lo rompe.

**Runbooks que se usaron y funcionan** (no reinventar):
- Deploy del panel: `/opt/onia-platform/build-and-stage.sh <ref>` (lanzar con
  `setsid nohup … </dev/null &`; log `build-<sha7>.log`) → gate del CI verde **verificado por
  RUN ID** (`gh run view <id> --json conclusion`; `gh run list --limit 1` agarra el run viejo
  y da falsos rojos) → `/opt/onia-platform/deploy-gates-swap.sh <sha7>` (5 gates + backup) →
  smoke (login 200, chunk viejo 404 con cache-buster contra el origen, `docker logs`).
- Bot: `/opt/onia/bot/webhook-server.sh start|stop|status|logs|knowledge`.
- Mirar el panel sin contraseñas: magic link por la Admin API de GoTrue **desde dentro del
  VPS** (`docker exec onia-platform sh -c "wget … http://auth:9999/admin/generate_link"`),
  luego `https://app.onia.com.bo/auth/confirm?token_hash=<X>&type=magiclink&next=/settings`.
  El link es de **un solo uso**: si se venció, se genera otro.

---

## 5. Intentos fallidos (para no repetir el callejón)

- **`next dev` con Turbopack no arranca en `onia-platform-v1-candidate`**: muere con
  *"Symlink [project]/node_modules is invalid, it points out of the filesystem root"* porque
  `node_modules` es un junction a `onia-platform`. **Se levanta con `npx next dev --webpack`**,
  y además hay que pasarle `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  (valores placeholder alcanzan) o `proxy.ts` tira 500 en toda ruta.
- **`setState` dentro de un `useEffect` lo rechaza el lint del CI** (`react-hooks/set-state-in-effect`).
  El salto automático a la sección con error se resolvió en el handler que recibe el rechazo,
  no en un efecto. Mismo espíritu que el bug de `useRef` leído en render de la semana pasada.
- **Los selectores de Playwright con `[data-seccion="x"]` agarran DOS elementos** (el chip móvil
  y el botón de la nav lateral). Hay que usar `.last()` o el móvil oculto rompe el click.
- **El SSH al VPS se corta solo en comandos largos** (`Connection reset`, exit 255). El comando
  suele haber corrido igual: **verificar el efecto antes de reintentar**, no relanzar a ciegas.
- **`docker exec -i` se traga el stdin de un heredoc por SSH** — usar sin `-i` y cerrar con
  `</dev/null`.

---

## 6. Qué depende de Sergio Urcullo (bloquea la venta)

1. 🔴 **RENOVAR EL VPS — vence el 24-sep-2026.** Visto en su hPanel (`srv1360183`, botón
   "Renovar"). Si cae, se apaga TODO: panel, base, bot, n8n, correo. Es lo más urgente de
   esta lista y no lo puede hacer nadie más.
2. 🔴 **Credenciales del API QR del BCP** (trámite con Jassir Chahin, pedido el 17-sep): usuario,
   contraseña, token público, `APP_USER_ID`, certificado `.pfx` y **la URL de producción**
   (hoy el banco solo publica sandbox). También sigue trabado su login de Credinet. Nuestro
   lado del cobro automático está construido y probado con mock (`lib/gateway/bcp-qr.ts`,
   `app/api/subscription-payment/bcp-qr/`, callback en `app/api/webhooks/bcp`): el día que
   lleguen, se cargan en `app.env` del VPS, **se RECREA el contenedor** (un `docker restart`
   no relee el env-file) y el checkout enciende solo.
   ⚠️ Sergio Urcullo **NO quiere la capacitación** que ofrece el banco: declinarla si insisten.
3. 🟡 **Conectar un número de WhatsApp de prueba** con el popup de Meta desde su cuenta, para
   vivir el flujo tal como lo verá un cliente. Es el único tramo del alta que exige un humano
   con navegador; después de eso se puede verificar el circuito entero E2E.

---

## 7. Próximos pasos, en orden (cola para Codex)

Cada uno con su criterio de "listo". **No abrir el siguiente sin cerrar el anterior.**

1. ~~**Que el watchdog avise cuando no puede arreglarlo** (§3.1).~~ ✅ **HECHO el 21-sep**
   (`6037d83a`, desplegado y verificado en vivo). El diagnóstico estaba mal: el watchdog sí
   avisaba — avisaba **una vez**. Ver el recuadro de §3.
2. **WhatsApp saliente por cliente** (§3.bis, BLOQUEANTE 1): que el Embedded Signup deje
   también `whatsappPhoneNumberId`/`whatsappAccessToken` de esa org. Sin esto, cada cliente
   nuevo exige que un superadmin pegue credenciales a mano, y mientras tanto los recordatorios
   salen del número de Onia. **← ES EL SIGUIENTE.**
3. ~~**Arreglar la causa del anidado del bot** (§3.2).~~ ✅ **Ya estaba hecho en `master`**
   (`525d282f`): el sync copia a `$DEST.new` y hace el swap. Ver el recuadro de §3.
4. **Adoptar el sistema de diseño que ya existe** (§3.bis): portar las 42 pantallas a la
   primitiva `Card`, unificar los 8 `inputClass` en un form kit, y meter
   `app/(dashboard)/dashboard/` dentro del sistema (hoy tiene CSS propio y es la PRIMERA
   pantalla que ve un prospecto en la demo). *Listo cuando*: `grep -c "rounded-xl border
   border-outline-variant"` baja de 108 a cerca de 0 y hay un solo estilo de campo.
5. **Limpiar el VPS**: disco al **78% (151G de 193G)** y subiendo; hay un contenedor
   `onia-platform-qa` (staging) levantado hace días, builds y tarballs viejos, y un log de
   watchdog de 800 KB. *Listo cuando*: el disco baja de 70%.
6. **Portar WF-05 y WF-11 al patrón SSH e importarlos a n8n** (hoy sus nodos de Postgres
   apuntan a hosts muertos; los JSON del repo ya llevan `idempotencyKey` y los nodos de Resend
   deshabilitados, commit `51328d91`). *Listo cuando*: importados y **dejados INACTIVOS** hasta
   que exista el primer cliente con `whatsappPhoneNumberId`.
7. **Tandas de UI que siguen abiertas** (del doc comparativo): form kit (Input/Field/Select —
   la mayor inconsistencia que queda), skeletons, DataTable, y breadcrumbs en las pantallas
   hondas del panel.
8. **Flakies locales de vitest en Windows** (rotativas: backup-onia-postgres, rango-gitleaks,
   cuentas-que-no-son-clientes, fechas-de-calendario). Verdes aisladas; **el CI de Linux es el
   árbitro**. No perseguirlas sin datos nuevos.

---

## 8. Reglas de esta casa que Codex debe respetar

- **Verificar es MIRAR**: una pantalla de cliente se abre renderizada y se lee la captura. Un
  200 y un `grep` no son verificación.
- **Construido ≠ terminado**: solo cuenta lo encendido en producción y verificado ahí.
- **Nada de precios escritos a mano**: planes desde `lib/subscription-plans.ts`, add-ons desde
  `lib/pricing.ts`.
- **Nada de sustantivos de dominio hardcodeados**: el producto vende 7 rubros; todo sale de
  `lib/onboarding/vocabulario.ts`. "Paciente" en una pantalla genérica rompe la venta a comercio.
- **La venta nunca exhibe obra**: prohibido "muy pronto", "beta", "en construcción" en cualquier
  superficie que vea un cliente.
- **Los secretos no salen del VPS**: se leen dentro de la shell remota y nunca se imprimen.
- **Un solo dueño a la vez** para VPS, n8n y Supabase.
