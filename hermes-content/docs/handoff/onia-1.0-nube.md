# Handoff — onia-1.0-nube (carril Plataforma, en la nube)

Sesión saliente: `session_01HhnFgkeF6nLGvjrfjt1o2C` (5 al 11-oct-2026). Antes: `session_014HGgof9kHQkdLXhsZsAq6A`.
Escrito el 11-oct ~04:55 UTC, cuando Sergio Urcullo pidió handoff y «clean». La versión anterior (más detalle de cada
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
  Con login no se puede: las cuentas QA no tienen contraseña guardada. Mira la madre, o una sesión nueva con
  `ONIA_QA_EMAIL/PASSWORD` en el entorno, nunca por chat.
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
| 1 | Cobro completo con QR | Checkout de usted en producción. Falta la prueba de punta a punta: la hacen la madre y Sergio Urcullo. Antes de aprobar el pago de prueba hay que marcar «Cuenta interna de prueba verificada» en `zz-qa-pago-o4kaw` (`/admin/plans`) |
| 2 | Checkout sin promesa falsa y titular del QR | En producción (#142, 10-oct). Falta mirarlo con login |
| 3 | Datos clínicos no salen | En producción (#139, canal privado). Faltan «En vivo» con login, el SQL del B22 (con su OK) y el contenedor `onia-platform-qa` (lo decide él) |
| 4 | Respaldo afuera con restauración probada | **Bloqueado:** falta el bucket R2 de Sergio Urcullo. El `restoreVerified:false` del diario local es a propósito |
| 5 | Agenda por profesional y confirmar en 1 toque | El toque ya está en producción (#128). La agenda por profesional (#118) **sale con #136** |
| 6 | Odontograma de 5 caras y «ver todo» en la ficha | El odontograma (#119) **sale con #136**. «Ver todo» ya está en producción desde el 6-oct (`970bdb1e`): el enlace se llama «Ver historia completa» y abre `/patients/[id]/records`, paginada. Por eso no lo encontraba buscando «ver todo». Falta mirarlo con login. Lo que queda: la lista de citas de la ficha corta en 10 (1.1, no traba) |
| 7 | Presupuesto por fases y tratamientos ya empezados | En producción (`1f09936a` P2 y el paso 0 del 8-oct) |
| 8 | Caja diaria | **Sale con #136** (`i110-v3`) |
| 9 | Demo que propone pacientes | Los agentes corren. Falta refrescarla: el lunes 12-oct entre 07 y 11 UTC, con las capturas C1-C7 (§7) |
| 10 | «Enviar por WhatsApp» en cada cita | En producción (#128). Falta mirarlo con login |
| 11 | La agenda no miente | En producción (`6f940cfc` y `7d3495e8`). Falta mirarlo con login |
| 12 | CSV con «;» y WhatsApp de soporte | En producción (`97fe3061`) |
| 13 | 7 días de gracia y «no renovar» | #113 construido. Espera los términos 1.4: la lámina está en `cola/capturas-terminos/` y necesita el sí de Sergio Urcullo y de Leslie Mercado Moreno |
| 14 | Aceptación de términos guardada | #124 construido, migración aplicada. Su arreglo de versión (`t124-version`) está en un bundle. La madre lo retiene («espera texto legal»), aunque no cambia ningún texto |
| 15 | Factura al aprobar el pago | En producción (#114, 10-oct 21:55) |

## 3. Qué quedó EN PRODUCCIÓN (verificado)

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

| Qué | Dónde | Cómo se retoma |
|---|---|---|
| **Las 5 pantallas** (bandeja v3, app sin internet, agenda del día, odontograma, caja) | **Mergeado** `282ae3ab` (11-oct 05:46 UTC) junto con #146 `a7d8c1ed`; el árbol de master es idéntico al probado con 10.505 en verde. #118, #119, #110, #127, #129 y #130 quedaron mergeados solos; #135 cerrado como incluido | Sale a las 06:50 UTC: mirar sin login (release, `/offline.html`, `sw.js`, `manifest.json`, el webhook que pasa de 404 a 401, logs) y con login la madre. **Entró con 2 HIGH** de la revisión E3 de Hermes (caja: «1.500» = Bs 1,50, sin confirmar ni reabrir; borrar un paciente borra sus caras): el arreglo es F136 (Codex Astra, de la madre), PR después de las 07:10, mergear antes de las 09:20. La línea de Sergio Urcullo se leyó en el transcript (04:41:42 UTC, después hubo dos clear) |
| **Pantallas del video (C1-C7) de usted** | `claude/optimistic-ride-1sp5fe` `f28e15af` (onia-platform), sin PR | Lo empezó esta sesión entre los dos clear y quedó solo en `wt-mezcla`; se subió a la rama a las 05:57 UTC para no perderlo. tsc 0, 10.503 en verde y **38 tests viejos** que afirman el vos: contrato U3b (`bloqueada` hasta que entren U3 y F136). Se pisa con U3 en `/agents`: al juntar, queda lo de U3 |
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

## 7. Qué depende de Sergio Urcullo

1. **Términos 1.4 y 7 días de gracia:** sí o no, con el OK de Leslie Mercado Moreno (titular).
2. **OK de diseño de W1f** (el chat de la web con el nombre de la clínica).
3. **Sí al refresco de la demo** el lunes 12-oct entre 07 y 11 UTC.
4. **CAFC del piloto** (SIAT etapa VI: 180 casos; plazo del SIN 04/11).
5. **Bucket R2** (punto 4).
6. **Punto 1:** marcar la cuenta interna y aprobar el pago de prueba.
7. El SQL del B22 y apagar el contenedor `onia-platform-qa`.
8. **Infra de la bandeja en tiempo real** (una línea, §4), o que la corra la madre.

## 8. Próximos pasos (en orden)

0. **#136:** con CI verde → listo y merge (su línea ya está, ver §4) → cron → mirar. Después, la infra de la bandeja.
1. **#146:** con CI verde → listo y merge.
0a. **F136** (los 2 HIGH de #136): revisar el PR de la madre (después de las 07:10) con la revisión de Hermes, integrar, mergear antes de las 09:20.
0b. **U3** (PR a las 07:12) y después **U3b**: juntar master en `claude/optimistic-ride-1sp5fe`, pasar U3b a `pendiente`.
1a. **U4 y U5** (registro, entrada y alta guiada de usted, 1.0): los lanza la madre; al llegar el PR, revisar, integrar con master, suite completa, mergear y mirar `/login`, `/register` y `/onboarding` sin login. **U6** (correos y avisos del plan) espera a #113.
1b. **U3** (`codex-tareas/U3-usted-agentes-e-inicio.md`, 11-oct): `/agents` y el Inicio de usted antes de las capturas. Lo lanza la madre; el mensaje al paciente y `/pending` ya son de usted (leído en el código y en las 7 tarjetas del demo).
2. **Demo del lunes** (pedido de la madre v4): el plan está en `docs/cola/demo-venta-refresco.md` (11-oct): `reset=2`
   entre 04 y 11 UTC de lun a jue, tarjetas a las 11:00 UTC, capturas de la madre a 390 y 1440. Correrlo pide el sí de
   Sergio Urcullo en esta sesión.
3. Punto 6: «ver todo» resuelto (es «Ver historia completa», en producción desde el 6-oct). Queda mirarlo con login (madre).
4. Lo que destraben sus respuestas (§7), en el orden del corte (`ONIA_1.0_CORTE.md`).
5. 1.1 de identidad: los textos de tú del panel («No se envía nada hasta que lo apruebes») y las 594 formas de vos.
   Hacerlo después de los merges de hoy, para no chocar con las ramas.
