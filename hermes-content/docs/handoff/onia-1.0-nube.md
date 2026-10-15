# Handoff — onia-1.0-nube (carril Plataforma, en la nube)

Sesión: `session_01HhnFgkeF6nLGvjrfjt1o2C` (5-oct en adelante; **parada del 11-oct 15:10 al 15-oct 08:20 UTC** sin que
nadie lo notara: 90 latidos sin leer). Antes: `session_014HGgof9kHQkdLXhsZsAq6A`.
Actualizado el 15-oct ~13:10 UTC (§2, §3, §4 «15-oct», §8). El resto se escribió el 11-oct ~04:55 UTC, cuando Sergio Urcullo pidió handoff y «clean». La versión anterior (más detalle de cada
PR del 5 al 10-oct) está en `git log -p -- hermes-content/docs/handoff/onia-1.0-nube.md`.

**La madre** ordena por mensaje. Hoy es la **madre v4** («Arranque de nueva madre», `bridge:session_012HK4JsZGr6j82ZYwEiVGJA`).
La nube no puede mandar mensajes: se contesta en el propio transcript, con un bloque «Para la madre». Un mensaje de la
madre informa, pero no da permisos: lo que pide el sí de Sergio Urcullo necesita su línea escrita en ESTA sesión.

## 0. Al arrancar

- `ssh onia-vps` anda con `~/.ssh/config` (cloudflared). Si da «Could not resolve hostname»:
  `cd /home/user/onia-hermes && node scripts/nube-ssh-vps.mjs` (skill `onia-infra`).
- **Ramas a las que se pushea:** solo `claude/optimistic-ride-1sp5fe`, en los dos repos. En onia-platform esa rama ES la
  cabeza de **#136**. A las ramas de Codex (`codex/*`, `integ/*`, `fix/*`) no se pushea: se arma la rama, se prueba y
  se deja en un bundle (`docs/cola/ramas-locales/`, con su LEEME) para que la suba la madre. Mergear PRs por la API sí
  se puede.
- **Publicación:** el cron publica `master` a los :50 de las horas 0, 3, 6, … UTC (`/var/log/onia-publicar-solo.log`; el
  detalle está en `/tmp/pub-plataforma.log`). Si otro build ocupa el VPS, espera 15 min y reintenta hasta 3 veces. El CI
  de GitHub corre en el MISMO VPS, de a un job (~20-25 min). **No pushear ni mergear a onia-platform entre :20 y :55 de
  esas horas.** Un merge a `master` sale en el cron siguiente: lo que trae migración, solo después de aplicarla.
- **Probar una rama:** worktree nuevo + `cp -a /home/user/wt-c15/node_modules <wt>/` (symlinks al compartido, pero
  `@prisma/client` y `.prisma` propios) + `prisma generate` con `DATABASE_URL` falsa + `tsc --noEmit` + `vitest run`, con
  `run_in_background`. **Nunca generar Prisma en un worktree cuyo `node_modules` sea symlink** (`wt-t2b`): pisa el cliente
  compartido.
- **Mirar producción sin login:** Playwright con `executablePath: "/opt/pw-browsers/chromium"` y
  `--ignore-certificate-errors-spki-list=<SPKI>`. Se calcula con
  `openssl x509 -in /root/.ccr/agent-proxy-ca.crt -pubkey -noout | openssl pkey -pubin -outform der | openssl dgst -sha256 -binary | base64`.
  **Con login (desde el 11-oct):** un script de Playwright que corre EN el VPS pide un magic link con la clave de
  servicio leída dentro del contenedor (nunca se imprime) y entra con la cuenta QA. Modelos en el scratchpad de la
  sesión: `mirar-1550/mirar-1550.js`, `mirar-1250/mirar-1250.js`, `punto1/punto1-cliente.js`. Siempre
  `--font-render-hinting=none` y las fotos se borran del VPS al terminar.
  ⚠️ Las rutas con `(grupo)` y `[parámetro]` (ej. `/book/<slug>`) dan un falso «Algo salió mal» por el proxy de la
  nube: se miran desde el VPS (skill `onia-infra`, 11-oct).
- **Probar un servidor local:** `next dev --webpack` (con Turbopack falla por los symlinks).
  `/book` y otras rutas públicas andan con env falsas.

## 1. Objetivo

Los 15 puntos de `docs/ONIA_PLAN_1.0_Y_CAJA.md`: del 1 al 4 al 16-oct, todos al 30-oct, cada uno MIRADO en producción.
Qué se vende ya, qué va en la 1.1 y qué después: `docs/ONIA_1.0_CORTE.md`, escrito el 10-oct a pedido de la madre con
la dirección de Sergio Urcullo.

## 2. Estado de los 15 puntos (11-oct 04:55 UTC)

| # | Punto | Estado |
|---|---|---|
| 1 | Cobro completo con QR | **15-oct 08:54 UTC: el lado del cliente está hecho** (pago QA `cmv9ay9px003101o36xe4c9c1`, PENDING, Básico mensual Bs 320). Falta solo Sergio Urcullo: marcar la cuenta interna y aprobarlo (§7). Antes: Antes de aprobar el pago de prueba hay que marcar «Cuenta interna de prueba verificada» en `zz-qa-pago-o4kaw` (`/admin/plans`) |
| 2 | Checkout sin promesa falsa y titular del QR | En producción (#142, 10-oct). **De usted en los tres ciclos desde `release-e28c7e90` (15-oct 12:57 UTC), mirado con login a las 13:00.** Mi plan (adonde manda el aviso de cuenta vencida) sale de usted con U6 a las 15:50 |
| 3 | Datos clínicos no salen | En producción (#139, canal privado). **Mirado con login el 15-oct 12:15-12:20 UTC:** la org dueña recibe solo el `id`; otra org y la clave anónima reciben «Unauthorized» y 0 eventos. Faltan el SQL del B22 (con su OK; la prueba P-01 entra con U6) y el contenedor `onia-platform-qa` (lo decide él) |
| 4 | Respaldo afuera con restauración probada | **Bloqueado:** falta el bucket R2 de Sergio Urcullo. El `restoreVerified:false` del diario local es a propósito |
| 5 | Agenda por profesional y confirmar en 1 toque | En producción: #128 (toque) y #118 con #136 (11-oct). **El toque, mirado con escritura el 15-oct:** «Confirmada» en dos pantallas sin recargar |
| 6 | Odontograma de 5 caras y «ver todo» en la ficha | El odontograma (#119) **sale con #136**. «Ver todo» ya está en producción desde el 6-oct (`970bdb1e`): el enlace se llama «Ver historia completa» y abre `/patients/[id]/records`, paginada. **Mirado con login el 15-oct 13:50 UTC** en la ficha QA de «ZZ QA K3 Dental»: el enlace está en «Historial clínico» y abre «Historia completa · Consultas de la más reciente a la más antigua»; la ficha entera, de usted. Lo que queda: la lista de citas de la ficha corta en 10 (1.1, no traba) |
| 7 | Presupuesto por fases y tratamientos ya empezados | En producción (`1f09936a` P2 y el paso 0 del 8-oct) |
| 8 | Caja diaria | En producción (#136, 11-oct; #158 el 11-oct; punto 9 de F136c, la caja de un día anterior, desde el 15-oct 12:57). Mirada con login el 15-oct |
| 9 | Demo que propone pacientes | Los agentes corren. Falta refrescarla: el lunes 12-oct entre 07 y 11 UTC, con las capturas C1-C7 (§7) |
| 10 | «Enviar por WhatsApp» en cada cita | En producción (#128). **Mirado con login el 15-oct:** arma el texto de usted con la hora de La Paz |
| 11 | La agenda no miente | En producción (`6f940cfc` y `7d3495e8`). **Mirado con login el 15-oct:** reprogramar vuelve la cita a «Pendiente» y un día cerrado no ofrece horarios. Falta lo de `/book` (aviso de reserva online), que pide una cuenta con la reserva pública |
| 12 | CSV con «;» y WhatsApp de soporte | En producción (`97fe3061`) |
| 13 | 7 días de gracia y «no renovar» | #113 construido. Espera los términos 1.4: la lámina está en `cola/capturas-terminos/` y necesita el sí de Sergio Urcullo y de Leslie Mercado Moreno |
| 14 | Aceptación de términos guardada | #124 construido, migración aplicada. Su arreglo de versión (`t124-version`) está en un bundle. La madre lo retiene («espera texto legal»), aunque no cambia ningún texto |
| 15 | Factura al aprobar el pago | En producción (#114, 10-oct 21:55) |

## 3. Qué quedó EN PRODUCCIÓN (verificado)

- **15-oct 12:57 UTC, `release-e28c7e90`:** #171 (punto 9 de la caja, checkout de usted, M1c y los ocho PRs de Codex del
  12-oct) y #172 (aviso de cuenta vencida, modal y add-on del chatbot de usted). Mirado con login a las 12:58-13:00 (caja
  de un día anterior, cotización, traspaso, checkout en tres ciclos). El banner, el 403 y el modal de una cuenta vencida se
  pintaron en local con el CSS de producción; en vivo se miran el 17-oct, cuando venza «ZZ QA Clínica Chip».
- **10-oct 21:55 UTC, `release-d8ca5a32`:** #114 (la factura del SIN es obligatoria al aprobar un pago real) y #145 (logo
  «onia» en `/book`). Mirado sin login: 0 errores, `/login` y `/book` bien, API 401. Rollback:
  `onia-platform-prev-y_kYtmsT-20261010-215532`.
- **10-oct 18:50 UTC, `release-21f0c7e6`:** F1 (la letra servida desde el repo), #142 (pago de usted), #139 (canal privado)
  y #144 (`/book` de usted).
- **10-oct ~19:20 UTC, base de datos** (con el sí de Sergio Urcullo): migraciones de caja, factura (2), caras y términos.
  Se aplicaron con respaldo (`/root/backups/pre-migracion/20261010-caja-factura-caras-terminos/public.dump`) y quedaron
  registradas en `_prisma_migrations`, igual que la del canal privado. RLS encendida y sin permisos para anon.
- **Publicador con reintento** en `/root/bin/onia-publicar-solo.sh` (sha `2fcf732db2d654be…`, respaldo `.bak-20261010`).
- Antes: el 9-oct #141 (IPv6 por /64) y K2/K3; el 8-oct #128. Los agentes corren todos los días a las 07:00 de La Paz.

## 4. EN VUELO (lo que se pierde o se traba si nadie lo sigue)

**15-oct ~13:10 UTC:**
- **U6 (Mi plan de usted) + #150 (P-01)**: rama `claude/optimistic-ride-1sp5fe` de onia-platform, cabeza `94dbf460`, **ya en
  el remoto** (sin PR hasta las 13:10, para no arrancar un CI dentro de la ventana). Suite 11.786/0, `tsc` 0, eslint 0.
  Revisión code-reviewer sonnet en curso. Falta: PR (cuerpo en `scratchpad/pr-u6-body.md`), CI verde, merge antes de las
  15:20 y mirar a las 15:56. Mi plan no se ve con cuentas `zz-qa-*`: se mira con `scratchpad/render-miplan/` (arnés que
  pinta el componente real con el CSS de producción).
- **Barrido de usted 3** (importadora, comercio, `app/api` del cliente, mensajes del bot): rama **LOCAL** `barrido-usted-3` en
  `/home/user/wt-barrido3`, sobre `94dbf460`, la hace un constructor sonnet. **Si la sesión muere, se pierde**: al terminar va
  a un bundle en `docs/cola/ramas-locales/` o directo a la rama después de mergear U6. Sale a las 18:50.
- **17-oct 13:20 UTC:** mirar en vivo el banner, el 403 y el modal con «ZZ QA Clínica Chip» (primera QA en solo lectura).

| Qué | Dónde | Cómo se retoma |
|---|---|---|
| **Las 5 pantallas** (bandeja v3, app sin internet, agenda del día, odontograma, caja) | **Mergeado** `282ae3ab` (11-oct 05:46 UTC) junto con #146 `a7d8c1ed`; el árbol de master es idéntico al probado con 10.505 en verde. #118, #119, #110, #127, #129 y #130 quedaron mergeados solos; #135 cerrado como incluido | Sale a las 06:50 UTC: mirar sin login (release, `/offline.html`, `sw.js`, `manifest.json`, el webhook que pasa de 404 a 401, logs) y con login la madre. **Entró con 2 HIGH** de la revisión E3 de Hermes (caja: «1.500» = Bs 1,50, sin confirmar ni reabrir; borrar un paciente borra sus caras): el arreglo es F136 (Codex Astra, de la madre), PR después de las 07:10, mergear antes de las 09:20. La línea de Sergio Urcullo se leyó en el transcript (04:41:42 UTC, después hubo dos clear) |
| **Cadena del 11-oct (estado a las 11:20 UTC)** | onia-platform, ya mergeados:
  - #147 F136 (08:17, `fd72cd55`, en producción desde 09:54);
  - #155 F136b (10:41:55, `a91708ca`);
  - **#152 usted-todo (11:03:07, `7de363cb`)**, que cerró #153, #148 y #149;
  - #151 P-02 (11:05:44, `1db726a7`).
  Salen con el publicador de las 12:50.
  Abiertos:
  - **#156 M1** (`826a16a3`, rebaseado por la madre), con Hermes E19 OK;
  - **#157** (mío, `a226183e`, restos de la revisión de #152), cuyo CI canceló la madre para que #156 llegue a las 12:20;
  - #150 P-01 + P-01b, con Hermes E9b OK, a la espera de CI;
  - #154 S2, con el HIGH condicional de Hermes E14 | Pendientes:
  - #156 se mergea con CI verde **antes de las 12:20** (chequeo `trig_01FiqHpCupux5P4EdbMc4JtY` a las 12:07); si no llega, después de las 13:10.
  - #157 y #150: relanzar el CI después de las 13:10. Cancelar o relanzar da 403 desde la nube: lo hace la madre.
  - #154: falta la re-revisión de Hermes con la medición de Traefik y mirar Pseudo-IPv4 en Cloudflare (Sergio Urcullo). Después se corre `scratchpad/s2-cubos.sh`.
  - La madre sube S3, U7 y V1 a las 13:12 y lanza M1b (`codex-tareas/plataforma-M1b-…`) cuando entre #156. |
| Arreglo de versión de #124 | `plataforma-listas-20261010.bundle`, rama `t124-version` | Lo sube la madre cuando ella o Sergio Urcullo digan |
| Chat de la web con el nombre de la clínica (W1f) | `i140-w1f` (`34f86438`) en el mismo bundle; #140 | Espera el OK de diseño de W1f. Después: la infra (origen solo para Cloudflare, `/public/api/` bloqueado en Chatwoot, `hmac_mandatory`) |
| Términos 1.4 + gracia | #113 + lámina | Con el sí de los dos: `terminos.md` del sitio a 1.4, `VERSION_TERMINOS` el mismo día, aviso dentro del sistema y recién ahí #113. **No commitear el 1.4 antes** |
| Suscripciones a PRs | #136 y #146 (y check-in de #146 a las 05:10 UTC) | Se desuscriben solas al mergear |
| Infra de la bandeja en tiempo real | VPS: webhook de Chatwoot + `CHATWOOT_EVENTOS_SECRET` en `app.env` + recrear el contenedor | **Frenada por el control de permisos** (11-oct 05:27 UTC): el `docker exec` del script en producción no pasa, ni en modo solo lectura. Necesita la línea de Sergio Urcullo acá («sí: corré el script del webhook de Chatwoot, guardá el secreto y recreá el contenedor») o que lo corra la madre. Sin eso, la bandeja anda con sondeo |
| U4 y U5 (registro, entrada y alta guiada de usted) | Contratos en `codex-tareas/U4-…` y `U5-…` (`ec48c6c2`) | La madre los lanza con Sol; Plataforma revisa el PR, integra con master, suite completa, mergea y mira en prod |

## 5. Archivos

- Corte: `docs/ONIA_1.0_CORTE.md`. Bundles e instrucciones: `docs/cola/ramas-locales/` (LEEME). Lámina de términos:
  `docs/cola/capturas-terminos/terminos-1.4.png`. Cola: `docs/cola/loop/plataforma.md`.
- Publicador: `scripts/loops/extras/publicar-solo.sh` y `scripts/publicador-reintento-build.test.mjs`.
- Producto: el gate de títulos de usted está en `__tests__/titulos-publicos-de-usted.test.ts` (#146) y la factura del
  pago en `lib/subscription/factura-del-pago.ts` (#114).

## 6. Intentos fallidos e hipótesis falsas (los que se repiten)

- **Un OK dado en otra sesión no alcanza** (10 y 11-oct): el control de permisos frenó los merges de la madre con el OK
  de diseño, y a esta sesión el INSERT de migraciones antes del sí de Sergio Urcullo. No se rodea ni se le pide a otra
  sesión: hace falta su línea escrita acá.
- **Un cron que dice «FALLO»** suele ser «hay otro build corriendo» (CI del mismo VPS), no el código: leer
  `/tmp/pub-plataforma.log` primero.
- **`pkill -f` / `pgrep -f`** se encuentran a sí mismos y matan el propio comando (10-oct). Usar `[n]ext dev`.
- **11-oct, error mío: mergeé #136 sin leer la revisión de Hermes** (E3, en la rama de Hermes-Jarvis desde las 05:30). Tenía 2 HIGH verificados y salieron a producción. Desde ahora, antes de mergear: `cola/loop/hermes-jarvis.md` §E… de su rama; un HIGH abierto no se mergea.
- **«Completed (exit code 0)» de una corrida de tests no es la suite en verde** (11-oct): el WIP del usted del video tenía 38 rojos. Leer el resumen de vitest, no el código de salida del comando que lo envuelve.
- **Cancelar runs de Actions desde la nube da 403** (11-oct): los runs de #118 y #119, que ya van dentro de #136, ocupan igual el único runner (~20 min cada CI). Se cuenta ese tiempo; no se rodea.
- **`docker exec -i onia-platform node - < script` lo frena el control de permisos** aunque solo lea (11-oct). `psql -tAc "select …"` sí pasa.
- **Un `&` dentro de un Bash normal** sobrevive y duplica la corrida de tests (dos vitest escribiendo el mismo log).
- **Juntar PRs que tocan los trinquetes** (`ratchet-ui.test.ts`, línea base de voseo): la línea correcta es base + los
  dos deltas, no uno de los dos lados (11-oct: 25 / 340 / 188).
- **`rm -f $VAR/*`** lo frena el chequeo de seguridad; `git grep` sobre todo onia-hermes tarda más de 2 min.
- **9-oct, error mío en C13b:** contar el período desde el comprobante le cobraba al cliente nuestra demora; la
  referencia es la APROBACIÓN.
- **9-oct, error mío en U2:** el trinquete cuenta por archivo y no ve los textos que una pantalla importa de otro
  módulo. Para «pantalla entera» hay que seguir los imports.
- Demo: `reset=2` para grabar (con `reset=1` quedan tarjetas viejas); los agentes no se pueden correr para una sola cuenta.

- **Horas escritas a ojo (11-oct, 4 veces en una mañana):** en la cola se anotaron revisiones «a las 07:45», «07:48», «08:05» y «08:27» cuando el reloj marcaba 07:38, 07:43, 07:59 y 08:24. Siempre adelantadas: se escribe la hora que se calcula para cuando termine, no la de ahora. Antes de escribir una hora, `date -u` en el mismo comando.

## 7. Qué depende de Sergio Urcullo (15-oct)

1. **Punto 1 (vence el 16-oct):** en `/admin/plans`, marcar «Cuenta interna de prueba verificada» en ZZ QA Pago y, en
   `/admin/payments`, aprobar el pago de Bs 320 (`cmv9ay9p…`). Después Plataforma mira el plan activo y el correo.
2. **Punto 3 (16-oct):** OK al SQL del B22 (REVOKE a anon) y decidir si se apaga el contenedor `onia-platform-qa`.
3. **Punto 4 (16-oct):** el bucket R2 (gasto).
4. **Bot de ventas de usted:** el publicador lo frena desde el 3-oct porque `knowledge.onia.json` cambió de versión
   (`03.1` → `03.2`); ningún precio cambió (medido el 15-oct, número por número). Mientras tanto el bot les habla de vos a
   los prospectos, y la pauta arranca el 16-oct. Necesita su firma para publicarlo.
5. **#124 términos** (no cambia el texto) y **términos 1.4 + 7 días de gracia** (#113), con el OK de Leslie Mercado Moreno.
6. **Refresco de la demo** (lun a jue, 07-11 UTC): sí o no.
7. **OK de diseño:** W1f (chat de la web con el nombre de la clínica) y, si la dirección del 12-oct «un solo plan integrado»
   es suya, las pantallas de «Mi web» (#168, #170).
8. **CAFC del piloto** (SIAT etapa VI) e **infra de la bandeja en tiempo real** (una línea, §4).

## 8. Próximos pasos (en orden, 15-oct 13:10 UTC)

1. U6 + #150: PR desde las 13:10, CI, la revisión, merge antes de las 15:20; a las 15:56 mirar con el arnés local y en el
   código publicado (Mi plan no se ve con cuentas QA).
2. Barrido de usted 3: revisar lo que entregue el constructor, PR después de mergear U6, merge antes de las 18:20 y mirar la
   pantalla de cotizaciones de importadora a 390 y 1440.
3. Cuando Sergio Urcullo apruebe el pago QA: mirar el plan activo, la factura por correo y el checkout en «Plan activo».
4. Contratos para Codex escritos y `pendiente`: **M1e** (el servidor exige enteros en las unidades enteras) y **A1** (lo
   omitido por teléfono queda como descartada con motivo). Los lanza la madre.
5. #154 S2: Hermes QA volvió el 15-oct (E34-E36); pedirle la re-revisión con la medición de Traefik antes de mergear.
6. 17-oct 13:20 UTC: mirar en vivo lo que ve una cuenta vencida con «ZZ QA Clínica Chip».
7. Lo que destraben sus respuestas (§7), en el orden del corte (`ONIA_1.0_CORTE.md`).
