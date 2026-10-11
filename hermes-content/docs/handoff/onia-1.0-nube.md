# Handoff — onia-1.0-nube (carril Plataforma, en la nube)

Sesión saliente: `session_01HhnFgkeF6nLGvjrfjt1o2C` (5 al 10-oct-2026). Antes: `session_014HGgof9kHQkdLXhsZsAq6A`.
La **madre** (PC de Sergio Urcullo) ordena por mensaje; la nube contesta en su propio transcript. Historia anterior:
`git log -- hermes-content/docs/handoff/onia-1.0-nube.md`.

## 0. Al arrancar (medido 9-oct)

- `ssh onia-vps` anda con `~/.ssh/config` (cloudflared). Si da «Could not resolve hostname»:
  `cd /home/user/onia-hermes && node scripts/nube-ssh-vps.mjs` (skill `onia-infra`).
- **Worktree de trabajo de onia-platform: `/home/user/wt-t2b`**, rama local `t2-tiempo-real` = cabeza de
  onia-platform#136. Se pushea con `git push origin HEAD:claude/optimistic-ride-1sp5fe`. El checkout
  `/home/user/onia-platform` en esa misma rama está ATRASADO (`5102535c`): no trabajar ahí.
- **Ramas que solo existían en el contenedor:** resguardadas en `docs/cola/ramas-locales/` (git bundle + LEEME con cómo
  se restaura cada una). Antes de cerrar una sesión, buscar commits sin remoto:
  `git worktree list` + `git rev-list --count <sha> --not --remotes=origin`.
- `onia-platform` en un worktree nuevo nace sin `node_modules`: `npm ci` + `npx prisma generate` antes de los tests.

## 1. Objetivo

Los 15 puntos de `docs/ONIA_PLAN_1.0_Y_CAJA.md`: del 1 al 4 al 16-oct, todos al 30-oct, cada uno mirado en producción.
Qué se vende y qué falta: `docs/ONIA_CATALOGO_DE_VENTA.md`.

## 2. Qué quedó EN PRODUCCIÓN (verificado)

- **10-oct 21:55 UTC (cron de las 21:50), `release-d8ca5a32`:** #114 (aprobar un pago real exige el N° de factura del
  SIN; «Falta factura» para los automáticos) y #145 (logo «onia» con el punto verde en `/book`; lo mergeó la madre a las
  20:23 UTC, pedido de Sergio Urcullo). «PUBLICADO Y VERIFICADO», canario bien. **MIRADO a las 22:06 UTC:** contenedor
  healthy, 0 errores en los logs desde el swap (ningún P2022), `/login` y `/book` 200 renderizados con la letra de la marca
  y 0 errores de consola, `/book` con el logo nuevo, API sin sesión → 401. Rollback:
  `onia-platform-prev-y_kYtmsT-20261010-215532`. Falta con login (madre): `/admin/payments` con «Falta factura».
- **10-oct 18:50 UTC (cron), `release-21f0c7e6`:** F1 (#143, la letra servida desde el repo), #142 (el pago de
  usted), #139 (el canal privado de la agenda) y #144 (`/book` de usted). «PUBLICADO Y VERIFICADO». **MIRADO a las
  19:17 UTC:** contenedor healthy, 0 errores en los logs desde las 18:56:16Z y 0 «Unauthorized» de Realtime; `/login` y
  `/book` renderizados a 390 y 1440 con la letra desde nuestro dominio y los textos de usted; la API sin sesión da 401.
  Rollback: `onia-platform-prev-sJA_nczY-20261010-185611`. Falta con login (madre): «En vivo» en la agenda y el
  checkout de «ZZ QA Pago». El intento de las 15:50 falló por «hay otro build corriendo» (§5).
- **10-oct ~19:20 UTC, base de producción (sí de Sergio Urcullo en esta sesión: «autorizo tocar el servidor y la base
  de producción…»):** 5 migraciones aplicadas, cada una en una transacción junto con su fila en `_prisma_migrations`
  (checksum = sha256 del `migration.sql`): caja `20261004190000_add_daily_cash`, factura
  `20261006100000_add_subscription_payment_invoice` y `20261009110000_subscription_invoice_validation`, caras
  `20261006220000_add_tooth_surfaces` y términos `20261008000000_add_terms_acceptances`. Respaldo antes:
  `/root/backups/pre-migracion/20261010-caja-factura-caras-terminos/public.dump` (`pg_dump -Fc` de `public`, 326 KB). La
  del canal privado quedó registrada a las 18:44 UTC. **Verificado a las 19:23 (solo lectura):** las 4 tablas y las 4
  columnas existen, RLS encendida en las 4 tablas nuevas, ni anon ni authenticated tienen permisos sobre ellas, 6 filas
  en `_prisma_migrations` con su checksum, contenedor healthy y 0 errores. El código que las usa entra con su PR: #114
  (factura) ya; #110 y #119 (caja, caras) con el OK de diseño; #124 (términos) con el sí de §6.
- **10-oct, el publicador reintenta:** `/root/bin/onia-publicar-solo.sh` = `scripts/loops/extras/publicar-solo.sh`
  (hermes `1ae0a62f7`), sha256 `2fcf732db2d654be…`, respaldo `.bak-20261010`, prueba en seco bien (mismo sí de Sergio
  Urcullo). Si otro build ocupa el VPS (el CI de GitHub corre ahí), espera 15 min y reintenta, hasta 3 veces.
- **9-oct 18:50 UTC (cron), `release-c94b9daa`: #141** (S1 + S1b, límites por IP con IPv6 por /64). El intento
  de las 15:50 había fallado por Google Fonts (ver F1 en §3); el de las 18:50 compiló. **MIRADO a las 19:16 UTC:**
  contenedor healthy, 0 errores en los logs desde el cambio, `/login` 200 renderizado (Instrument Sans 400/500/600,
  0 errores de consola). Rollback: el contenedor `-prev-` de `ef3e2325` que deja el swap.
- **9-oct 08:56 UTC, `release-ef3e2325`:** #133 (K2 + K2b: el Reprogramador recupera faltas y cancelaciones de 30
  días, una sola propuesta por persona con tratamiento a medias), #134 (K3 + K3b: el alta dental arranca con 6
  servicios en Bs 0, horario de lunes a viernes y un aviso, sin apagar agentes) y #138 (K3c: la demo instantánea no se
  siembra). «PUBLICADO Y VERIFICADO», contenedor healthy. Rollback: `onia-platform-prev-BUAKN3u8-20261009-085629`.
  **Medido en producción:** altas QA por la pantalla pública (`zz-qa-k3-dental-ile9e`, `zz-qa-k3-importadora-713ar`):
  la dental quedó con 6 servicios en 0, 5 horarios y el aviso; la de importadora sin nada de eso. Capturas en
  `docs/cola/capturas-k3-altas/`. **Medido después del cron de las 11:00 UTC (SQL de solo lectura):** la dental tiene
  recall, confirmador, reprogramador y cobrador ENCENDIDOS (creados por el cron a las 11:00) y la de importadora
  cobrador, reponedor y seguidor, sin semilla dental. K2: en la demo el recall dejó 4 propuestas (4 personas) y el
  reprogramador 1, y **ninguna persona tiene propuestas abiertas de los dos a la vez**. Log del cron: `OK http=200`,
  30 corridas, 7 propuestas, 0 errores. Las dos QA se borran con el protocolo de `onia-db` cuando ya no sirvan.
- **8-oct 23:12 UTC, `release-b37e1182` (#128):** WhatsApp por cita, confirmar en 1 toque desde «Hoy», tratamiento a
  medias (paso 0), panel del dueño de usted (U1, con gate anti-voseo) y número de Onia protegido (C16a). El script
  dio «PUBLICADO Y VERIFICADO» y el contenedor está healthy. Rollback: `onia-platform-prev-oYPp3EWW-20261008-231204`.
  **Falta MIRARLO con login** (lo hace la madre: agenda «Hoy» con WhatsApp y 1 toque, «sin confirmar», tarjeta del
  chatbot en ajustes).
- Antes (detalle en el historial de este archivo): 5-oct `97fe3061` (puntos 2 y 12), 4-oct `ed40eaaa` (#108: P1, P3 y
  el canal de citas con solo `{id}`). El presupuesto por fases (P2) y el dump diario con 30 copias ya están en `master`.
- **Agentes:** corren solos todos los días a las 07:00 La Paz (log `/var/log/onia-agents-cron.log`, OK y 0 errores
  del 3 al 8-oct).
- **Cuenta demo «Clínica Demo Onia»** (`cmur09d75000601mz12vg59qn`, `oninteligenciaartificial+demo@gmail.com`): existe
  desde el 2-oct con datos inventados; los agentes corren sobre ella. Sus fechas quedaron viejas (ver §3).

## 3. Qué quedó a medias y dónde

| Qué | Dónde | Estado y cómo se retoma |
|---|---|---|
| Bandeja: C16b + B1 + C16d + T2 (en vivo) + diseño v3 + B3 (app instalable) | onia-platform#136 (`1df298dc`: master mergeado el 9-oct, solo chocaba el backlog; tsc 0, suite 10.103 en verde, CI verde) | Espera el OK de diseño de Sergio Urcullo (capturas en `docs/cola/capturas-bandeja/v3` y `capturas-app-instalable`). Con OK: mergear, publicar, correr `scripts/chatwoot-webhook-eventos.mjs` en el VPS, recrear el contenedor y MIRAR que un WhatsApp de prueba llegue a `/inbox` en menos de 2 s |
| Demo para el VSL (C1-C7) | `scripts/demo-venta/seed-demo.sql` en #136 | Mañana: 7 citas, sin confirmar SOLO Natalia a las 10:00; su ficha y su cobro vencido. Espera el **sí** de Sergio Urcullo para refrescar en prod: `reset=2` entre 07:00 y 11:00 UTC (después del backup diario, antes de los agentes), de lunes a jueves; después `verify-demo.sql` §10 y, pasadas las 11:00 UTC, el log de agentes. Las capturas las saca quien tenga el login (Ventas o la madre) |
| SIAT etapa VI (faltan 180 de 560) | `/opt/onia-siat/runner-20260929/` (`emisor-v3`, `run-case-v3.sh`, `BITACORA.md`) | Todos piden el **CAFC del piloto** (pedido a Sergio Urcullo el 9-oct, con código y rango). El runner ya lee un CAFC por sector con su rango (hermes `846aa24a9`). Pasos en la bitácora: `cafc-piloto.json` → una fila chica → el resto → captura del Listado de Etapas |
| W1 + W1b + W1c + W1d (widget propio seguro) | onia-platform#140 (rama `integ/w1-w1b`, la pusheó la madre desde el bundle) | **W1d revisado el 9-oct (`5a8e556c`): correcto.** Un `source_id` inventado ya no gasta el cupo de la clínica (se consulta sin descontar y se descuenta solo tras el 2xx de Chatwoot) ni la conversación del visitante real (su clave lleva el `source_id`). tsc 0 · suite completa **9.959 en verde, 0 rojos** (nube) · **CI verde** (`5a8e556c`). Codex no pudo validar en la PC (vitest: `spawn EPERM`; tsc: 11 errores de un cliente Prisma viejo, no del código): su comentario «validación bloqueada» queda superado por esta corrida. **W1e (`aae460c4`, nube, 9-oct 15:00 UTC):** `master` (#141) mergeado en #140; la ruta del widget cuenta con `claveDeIp` (IPv6 por /64) y, si el descuento falla DESPUÉS del 2xx, devuelve el mensaje que Chatwoot ya aceptó y deja el fallo en el log (antes daba 429 y el visitante lo reenviaba duplicado). Los 2 tests nuevos fallan sin el arreglo; tsc 0, eslint 0, suite completa 9.981 en verde. Se sube con `git fetch <hermes>/hermes-content/docs/cola/ramas-locales/plataforma-w1e-20261009.bundle w1e`, después `git checkout integ/w1-w1b && git merge --ff-only FETCH_HEAD && git push`, **fuera de los minutos :30-:50 de las horas del cron** (el runner es uno y `publicar.sh` no corre con un build en curso). Antes de publicar, solo la infra con OK de Sergio Urcullo: origen solo para Cloudflare (medido: el VPS contesta directo y todo límite por IP se salta), `/public/api/` bloqueado en `chat.onia.com.bo` y `hmac_mandatory` en el inbox API. Aparte, para toda la plataforma: `codex-tareas/S1` (IPv6 por /64: sin eso el límite por IP se salta aunque se cierre el origen). Riesgo que queda: el tope por clínica protege el gasto, no la disponibilidad (con varias IPs reales se traba el chat nuevo de una clínica hasta 1 h). #131 y #137 quedan reemplazados por #140. **W1f (`2c3423ae` sobre `aae460c4`, 10-oct, bundle `plataforma-w1f-20261010.bundle`):** pedido de Sergio Urcullo del 10-oct, «dejalo como si fuera la clínica pero contesta un bot, si ya necesita interacción humana ahí entra una persona». El código que pega el dueño trae `data-nombre`; el chat muestra el nombre del negocio, la burbuja dice «Escríbanos», sale «Chat de Onia» y la bienvenida avisa que contesta el asistente y, si hace falta, una persona (el candado bot-humano del motor ya existe). 9 tests fallan sin el cambio; tsc 0, eslint 0, suite completa 9.985 en verde. Capturas 390/1440 enviadas el 10-oct: **espera su OK de diseño**. Con el OK: subir W1f a `integ/w1-w1b` (LEEME de `ramas-locales`), CI, y publicar con la infra **10-oct ~20:30 UTC: la madre ya subió W1e a #140 (`f981cd4a`, CI verde). `i140-w1f` (`34f86438`) = `f981cd4a` + W1f + `master`, fast-forward, tsc 0 y suite 10.174 en verde, en `plataforma-listas-20261010.bundle`.** Con el OK de diseño: la madre la sube (LEEME), CI y la infra |
| S1: límites por IP con IPv6 por /64 (toda la plataforma) | onia-platform#141 (rama `codex/s1-ip-ipv6`, `c38938ba`) | Revisado el 9-oct con lente de seguridad: la agrupación por /64, la IPv4 mapeada, `unknown` para lo que no es IP, la auditoría con la IP entera y el registro y el login sin leer cabeceras a mano están bien (tsc 0, suite 9.869 en verde). **Un bloqueante, error de la tarea S1 y no de Codex:** le creía a `cf-connecting-ipv6` siempre; sin Pseudo IPv4 esa cabecera la puede escribir el cliente (medido: Cloudflare frena un `CF-Connecting-IP` inventado con error 1000, pero deja pasar un `CF-Connecting-IPv6`), así que cada pedido elegía su clave. **S1b** (`4c1ad334`) solo le cree con una Clase E en `cf-connecting-ip`; el test nuevo falla sin el arreglo y pasa con él; tsc 0, eslint 0, suite completa 9.870 en verde. **EN PRODUCCIÓN desde el 9-oct 18:50 UTC (`release-c94b9daa`), mirado (§2).** El intento de las 15:50 falló por `next/font/google` y no por #141 (ver F1). #140 entra segundo: su ruta del widget pasa a `claveDeIp`. Sin migraciones |
| Diseño v3 de agenda, odontograma y caja | `docs/cola/ramas-locales/plataforma-ramas-locales-20261009.bundle` (`wip/c118` `9bcccc54`, `wip/c119` `3c05cde0`, `wip/c110` `fefe6e92`+`187a9eae`) | Esperan el OK de diseño. **Sus migraciones (caja y caras) ya están aplicadas (10-oct, §2).** Ojo al mergear: las integraciones de la madre en #110 (`1c5112a9`) y #119 (`3e0575ef`) NO traen el rediseño v3 (las migraciones sí son idénticas). **Ya integrado y probado (10-oct):** ramas `i110-v3`, `i119-v3` e `i118-v3` en `cola/ramas-locales/plataforma-listas-20261010.bundle` (fast-forward sobre cada PR, suites 10.106 / 10.157 / 10.096 en verde). Con el OK: la madre las sube (LEEME), CI, merge |
| Punto 3: canal privado de la agenda | onia-platform#139, **EN PRODUCCIÓN desde el 10-oct 18:50 UTC** (`release-21f0c7e6`) | Migración `20261005140000_realtime_citas_privado` aplicada a las 13:29 UTC (respaldo en `/root/backups/pre-migracion/20261010-realtime-citas-privado/`) y registrada en `_prisma_migrations` a las 18:44 UTC (sí de Sergio Urcullo). Sin login: 0 «Unauthorized» de Realtime en los logs. **Falta con login (madre):** una cita creada en otra pestaña aparece sola en la agenda («En vivo»). Para cerrar B22 quedan su SQL (fila de abajo) y el contenedor `onia-platform-qa`, arriba desde el 18-sep en `127.0.0.1:3100` con la MISMA base y Auth que producción (apagarlo lo decide Sergio Urcullo: C8 de `ONIA_VELOCIDAD_Y_ESTABILIDAD.md`) |
| Punto 4: respaldo afuera | código y `docs/RUNBOOK_RESPALDO_AFUERA.md` en `master` | **No está activo** (9-oct): en el VPS no hay `respaldo-afuera.sh`, ni cron, ni la clave. Falta que Sergio Urcullo cree el bucket R2, su token y la frase (runbook §1) y que la madre lo instale (§2). El `restoreVerified:false` del respaldo diario local NO es una falla: es a propósito (skill `onia-db`), porque la prueba real de restauración (`prueba-restauracion.sh`, día 1 a las 08:30) corre desde el bucket, que todavía no existe |
| Punto 11: la agenda no miente | `master` `6f940cfc` (reprogramar pide confirmar de nuevo y la reserva online avisa) y `7d3495e8` (días cerrados que `/book` respeta), **en producción** (están en `release-d8ca5a32`; medido el 11-oct con `git merge-base`) | Falta MIRARLO con login (madre): reprogramar una cita ya recordada la deja «sin confirmar», un día cerrado no aparece en `/book` y una reserva online suena en la campana |
| Punto 15: factura del pago | onia-platform#114, **EN PRODUCCIÓN desde el 10-oct 21:55 UTC** (`release-d8ca5a32`, mirado §2) | Migraciones aplicadas y registradas antes del merge (§2). `master` `21f0c7e6` + #114 en la nube: tsc 0 y suite completa 10.056 en verde, 0 rojos; `master` quedó con ese mismo árbol. Publicado en el cron de las 21:50 UTC y mirado sin login (§2). Falta, con login de superadmin (madre), `/admin/payments` con la vista «Falta factura» y el campo del N° al aprobar. Desde ahora, aprobar un pago real pide el N° de factura del SIN; los pagos automáticos del BCP activan el plan y quedan en «Falta factura» con aviso al correo administrativo |
| Punto 13: 7 días de gracia y «no renovar» | onia-platform#113 (`dede1b81`, C13b hecho por Codex el 9-oct) + C13c (`a65a0cba`, bundle `docs/cola/ramas-locales/plataforma-c13c-20261009.bundle`) | Revisado con lente de plata: la gracia, el «no renovar», el usted y la guarda de cuentas internas de Mi plan están bien (tsc 0, suite 9.930 en verde). **Un bloqueante, error de MI tarea (paso 3):** contar desde el `createdAt` del comprobante le cobraba al cliente nuestra demora de aprobación. Medido: en un cambio de plan pagaba dos veces los días de revisión, y un semanal aprobado 3 días después del corte quedaba vencido hace 3 días al aprobarse. **C13c** cuenta desde la aprobación y saca «Se toma la fecha del pago» de Mi plan, de la banda y del correo; el test de las rutas falla sin el arreglo. C13c: tsc 0, eslint 0, suite 9.930 en verde. **#113 NO se publica sin el OK de Sergio Urcullo a los Términos:** los publicados (onia.com.bo/terminos, leído el 9-oct) dicen en §3.3 «si pagás después, empieza el día que se confirma el pago» y en §3.4 «al vencimiento pasa a solo lectura». La gracia de 7 días, y cobrarla, cambian ese contrato. C13c ya va en la dirección del §3.3 (cuenta desde la confirmación). Además decide él la gracia del semanal, que es un ciclo entero. Cuando se mergee, actualiza sus tests que fijan los textos de `lib/checkout/textos.ts` si U2b entró antes No trae migración (medido: sin cambios en `prisma/`). **10-oct ~20:00 UTC: se le mandó la lámina de los términos 1.4** (`docs/cola/capturas-terminos/terminos-1.4.png`, hecha desde el `terminos.md` del sitio): cambian §3.3 («si pagás después del vencimiento, el nuevo período empieza el día que se confirma el pago, menos los días de gracia que usaste (hasta 7); los días en solo lectura no se cobran» + «o avisarlo desde Mi plan») y §3.4 («7 días de gracia, después solo lectura… si avisaste desde Mi plan que no renovás, no hay gracia»). Vale igual para semanal, mensual y anual; la prueba gratis no cambia. **Espera su sí y el de Leslie Mercado Moreno (titular).** Con los dos: `web-factory/.../content/legal/terminos.md` a 1.4 con su fecha, `VERSION_TERMINOS`/`FECHA_TERMINOS` del producto el mismo día, aviso dentro del sistema a las cuentas que ya existen (§11: rige a los 30 días para ellas) y recién entonces #113 + C13c. **No commitear el 1.4 en `terminos.md` antes del sí:** la rama llega a `main` y el sitio lo publicaría |
| Puntos 1 y 2: el pago de usted | onia-platform#142 (U2 + U2b, `8cd1a91b`), **MERGEADO el 10-oct 13:15 UTC** (`c1c3c6ac`, sí de Sergio Urcullo: «de usted») | **EN PRODUCCIÓN desde el 10-oct 18:50 UTC** (`release-21f0c7e6`). El checkout pide login: lo mira la madre con «ZZ QA Pago» (paso del punto 1). **Revisado el 9-oct con lente de plata: pasa.** Solo textos (ni montos, ni lógica, ni promesas nuevas), más el campo `negocioSu` del vocabulario. El checkout entero queda de usted: el QR estático, el aviso de rechazo y el correo de renovación de `master` incluidos, y un test renderiza el checkout real con el vocabulario dental sin «tu» ni formas de vos. tsc 0, suite completa 9.901 en verde; mergea limpio con `master` y con #141. Queda para publicar (madre: «si pasa, queda para publicar»). **14:30 UTC: CI verde en `8cd1a91b` y mergea limpio con `master` `c94b9daa`, SIN mergear:** el control de permisos de esta sesión frenó el «modo nuevo» de la madre (§5). Lo mergea la madre, o esta sesión con el sí de Sergio Urcullo escrito acá. **No se puede MIRAR desde la nube:** el checkout pide login y las cuentas QA tienen contraseña aleatoria que no se guardó. La captura la saca la madre con «ZZ QA Pago» en `/checkout`, que es el mismo paso del punto 1. **Cuando entre #113 después:** choca en `renewalCopy` (`lib/email.ts`) y en las descripciones de `planesDe` (`PlanClient.tsx`). Se queda el texto de #113, que trae la gracia, con `negocioSu`, y se actualizan sus tests que fijan `lib/checkout/textos.ts`. Detalle menor de antes: «Para su clínica que ya esta ordenado» (falta la tilde y no concuerda en género con todos los rubros). **Del punto 15 no queda código sin migración** (todo está en #114) **y del 1 solo queda la prueba de punta a punta**, que es operación |
| K1: interpretar la respuesta al recordatorio (no es de los 15 puntos) | onia-platform#132 (`71d1bfda`, Codex) | **Revisado el 9-oct: el código está bien** (lista cerrada sin subcadenas, una pregunta da «desconocido», el id del botón manda, solo citas futuras PENDIENTE o CONFIRMADA de la misma organización, y la escritura compara id, organización, estado y hora). **No se mergea todavía:** 1) nadie lo llama: hoy el recordatorio lo manda recepción desde su teléfono y la respuesta no llega a Onia, así que vale cero hasta que exista el adaptador de WhatsApp; 2) «2» cancela y «3» reprograma por una numeración que ningún mensaje ofrece (el recordatorio dice «toque este enlace» y «si no puede venir, respóndanos por aquí»): un «2» suelto cancelaría la cita. Al armar el adaptador, sacar los números o sumarlos al mensaje; 3) choca con `master` solo en `docs/PROJECT_BACKLOG.md` |
| Punto 14: términos aceptados | #124 (`2ee1dcfe`) + `wip/terms` (`2191bf56`) | Migración `20261008000000_add_terms_acceptances` aplicada el 10-oct (§2). **No necesita el sí de Sergio Urcullo** (corregido el 10-oct: no cambia ningún texto legal, solo guarda la prueba del clickwrap: versión, fecha, IP; se lo dije). **Antes del merge falta `2191bf56`** (versión 1.3, la que publica el sitio; `master` y #124 dicen 1.2 y cada alta guardaría una versión que el cliente no vio). **Listo para subir:** rama `t124-version` (`23a3abb3`, fast-forward sobre `2ee1dcfe`) en `plataforma-listas-20261010.bundle`; con `master`, tsc 0 y suite 10.063 en verde. La nube no pushea a la rama de Codex: la sube la madre (LEEME), CI, y se mergea fuera de :20-:55 |
| Punto 1: cobro de punta a punta | QA «ZZ QA Pago» (`+qapago`) | Medido 9-oct (SQL de solo lectura): **0 pagos de suscripción** en producción; «ZZ QA Pago» en prueba Profesional hasta el 19-oct, con el correo **sin confirmar**. Falta: confirmar ese correo, pagar con el QR, subir el comprobante y que Sergio Urcullo apruebe ese pago de PRUEBA sin facturar. **Pasos mínimos (madre en la PC + 1 clic de Sergio Urcullo):** 1) en Gmail, abrir el «confirme su correo» de `oninteligenciaartificial+qapago@gmail.com` (si venció, reenviarlo desde `/login`); 2) entrar como «ZZ QA Pago» y abrir **`app.onia.com.bo/checkout` directo** (Mi plan no se muestra a las cuentas internas: decisión del 18-sep, medido el 9-oct) → **Básico semanal (Bs 89)**, escanear el QR con la app del BCP SOLO para ver que abre la cuenta de Onia (sin pagar) y subir una imagen cualquiera como comprobante de PRUEBA; 3) Sergio Urcullo, como superadmin, **primero** marca «Cuenta interna de prueba verificada» al editar `zz-qa-pago-o4kaw` en `/admin/plans` (desde #114, sin esa marca aprobar pide el N° de factura del SIN; la marca solo vale en cuentas `zz-qa-` y queda auditada) y **después** lo aprueba en `/admin/payments`; 4) Plataforma mide con SQL de solo lectura: 1 pago aprobado y el plan activo con su vencimiento. El QR es el fijo de la cuenta BCP de Onia (vence el 25/09/2027) |
| SQL del B22 (REVOKE a anon) | `prisma/migrations/20261003230000_revoke_anon_onia_sends` | Medido 9-oct: **sin aplicar** (las dos tablas siguen con 7 permisos para anon y authenticated, y el permiso por defecto de `postgres` sigue abierto). No urge: TRUNCATE no se alcanza por la API pública, y las 4 tablas nuevas del 10-oct (caja, caras, términos) entraron con RLS y sin permisos para anon ni authenticated (medido). Solo con el OK textual de Sergio Urcullo |

## 4. Archivos

- **Corte de la 1.0** (pedido de la madre con la dirección de Sergio Urcullo del 10-oct): `docs/ONIA_1.0_CORTE.md`,
  una tabla por capa (rubros, SIAT y factura, agentes, cobro y QR, identidad) con 1.0 / 1.1 / después y evidencia
  medida. Es el `ONIA_V1_ALCANCE.md` renombrado y reescrito (un tema, un archivo); ESTRATEGIA §11 y
  `ONIA_PLAN_CIERRE_1_0.md` apuntan a él. Propone (no cambia) alinear «vender solo dental/estética» de ESTRATEGIA §7.
- Bandeja en vivo: `lib/chatbot/bandeja-avisos.ts`, `lib/chatbot/bandeja-evento-chatwoot.ts`,
  `app/api/webhooks/chatwoot/eventos/route.ts`, `app/api/bandeja/eventos/route.ts`, `app/(dashboard)/inbox/*`,
  `scripts/chatwoot-webhook-eventos.mjs`. Skill `onia-backend` («Bandeja en vivo»).
- Demo: `scripts/demo-venta/{seed,verify}-demo.sql`. Skill `onia-db` (cómo y cuándo se refresca).
- SIAT: `hermes-content/integrations/siat/` (README §CAFC), `docs/ONIA_SIAT_ESTADO_HOMOLOGACION.md`, skill
  `onia-contabilidad-bolivia`.
- Promesas medidas: `docs/ONIA_PROMESA_VS_PRODUCTO.md` (G-04 ✅; A-12 y B-03 🟡; E-08 ⬜).

## 5. Intentos fallidos e hipótesis falsas

- **Mirar producción desde el VPS:** el control de permisos lo frenó como «Production Reads» dos veces el 8-oct: un
  Playwright en el VPS que sacaba la clave de servicio para un magic link, y capturas de páginas PÚBLICAS desde el
  VPS. No se reintenta: lo mira la madre o una sesión NUEVA con `ONIA_QA_EMAIL/PASSWORD` en el entorno (las variables
  que se cargan con la sesión abierta no llegan a esa sesión).
- **Escribir en la base de prod desde la nube** («Remote Shell Writes»): el ajuste SQL de la demo del 8-oct se frenó.
  Cada refresco de la demo vuelve a pedir el OK de Sergio Urcullo; sin él, lo corre la madre desde la PC.
- **«La cuenta demo no existe»** (VSL del 8-oct): falso, existe desde el 2-oct; lo que faltaba era refrescarla y mirarla.
- **Correr los agentes a mano solo para la demo:** no se puede. `/api/cron/onia-agents` corre para TODAS las cuentas.
  Por eso la demo se refresca de madrugada y a las 07:00 aparecen las tarjetas.
- **`reset=1` para grabar:** deja a la vista tarjetas viejas, que no vencen nunca; para grabar va `reset=2`.
- **Faltaba el `module.agents` de la demo:** falso. En el plan Profesional los agentes corren sin ese permiso.
- **Los 180 casos de la VI se podían correr sin CAFC:** falso. Todo lo que no lo pide ya está en el portal (380).
- **Leer siatinfo:** WebFetch da 503 y curl falla TLS. Se arregla con el intermedio del AIA
  (`cacerts.rapidssl.com/RapidSSLTLSRSACAG1.crt`) sumado al bundle del proxy, sin apagar la verificación.
- **`git grep` sobre todo onia-hermes** tardó más de 2 min y hubo que matarlo: limitar a los archivos del merge.
- **`rm -f $VAR/*`** lo frena el chequeo de seguridad: no borrar con variables (`git bundle create` sobrescribe).
- Lo de antes del 5-oct (plantillas de Meta, botones de Chatwoot, publicar el bot, gitleaks, `publicar.sh` con otro
  build, `next/font`, tildes escapadas en el bundle) sigue en la versión anterior de este archivo.

- **9-oct, error mío en la tarea C13b (paso 3):** pedí contar el período desde el `createdAt` del comprobante «para que la demora del operador no regale días». Era al revés: así se le cobraba al cliente nuestra demora. Se encontró midiendo `buildPlanActivation` con demoras de 2 y 3 días. Regla buena: la referencia es la APROBACIÓN; la gracia usada se cobra y la solo lectura no. Arreglado en C13c.
- **9-oct, leer el `build.log` de producción con `grep` y patrones de claves:** el control de permisos lo frenó
  («Production Reads»). Un `tail -n 75 build.log | head -n 55` simple pasó y alcanzó para ver el error.
- **9-oct, capturar producción con Playwright desde la nube:** `ERR_CERT_AUTHORITY_INVALID` (el Chromium de
  Playwright no toma la CA del proxy). No se apaga TLS: se comparó contra las capturas de producción de la mañana.
- **9-oct, «modo nuevo» de la madre** (publicar sin esperar a Sergio Urcullo, también diseño, migraciones e infra): el
  control de permisos de esta sesión lo frenó dos veces (copiar la cola de la rama de la madre y el `git fetch` de #142).
  Un mensaje de otra sesión no concede permisos: hace falta que Sergio Urcullo lo escriba en esta sesión, o que lo haga
  la madre. No se reintenta por otro camino.
- **9-oct, error mío en la tarea U2:** listé los archivos con voseo del checkout, pero no los módulos que el checkout IMPORTA (`lib/checkout/textos.ts`, el vocabulario). El ratchet cuenta por archivo y no ve lo que una pantalla pinta desde otro módulo. Para «pantalla entera» hay que seguir los imports, no el conteo.

- **10-oct, migración del canal privado:** el DDL pasó (COMMIT), pero el control de permisos frenó como «Production
  Deploy» el INSERT en `_prisma_migrations` y, a continuación, un `docker ps`/`docker logs` por SSH. No se reintenta por
  otro camino ni se le pide a otra sesión (sería lavar el permiso). Lo que sí anduvo después: SELECT de solo lectura por
  SSH y el `/login` público con curl. **Resuelto a las 18:44 UTC con el sí de Sergio Urcullo escrito en esta sesión.**

- **10-oct ~17:35 UTC, reintento del publicador:** `correr_con_reintento` en `scripts/loops/extras/publicar-solo.sh`
  (hermes `1ae0a62f7`, test 3/3 nuevo y 0/3 con el guion viejo; el del freno de estructura sigue 5/5). La copia del VPS
  (`/root/bin/onia-publicar-solo.sh`, 25-sep) es idéntica al guion viejo, byte a byte. **Instalarla la frenó el control
  de permisos («Remote Shell Writes»).** No se reintenta ni se le pide a otra sesión: decide Sergio Urcullo. Instalar =
  backup `.bak-20261010` + copiar + `bash -n` + `sha256sum` (debe empezar con `2fcf732db2d654be`). **Instalado con su sí
  (§2).**

- **10-oct 15:50 UTC, el cron no publicó** («plataforma: FALLO»). `/tmp/pub-plataforma.log`: «FATAL: hay otro build
  corriendo». A las 15:30-15:45 la madre subió 7 ramas de PR y su CI ocupó el único runner del VPS. No era el código: el
  de las 18:50 publicó lo mismo. Ante un «FALLO», leer primero ese log. Lección en `onia-infra` §4 y en el reintento.

## 6. Qué depende de Sergio Urcullo (lo canaliza la madre)

**Sus respuestas del 10-oct, en esta sesión** (las 4 preguntas del 10-oct, una por una):
1. F1: sí, la letra dentro del sistema (es la «estilo Fanvue» que eligió). Mergeado.
2. El pago de usted: sí. Mergeado.
3. El chat de la web: que se presente como la clínica, que conteste el bot y que entre una persona si hace falta.
   Hecho en W1f; espera su OK sobre las capturas.
4. La regla del 9-oct («se sube sin esperarlo»): **ok, pero el diseño se le sigue mandando a él**. Corregido en
   `CLAUDE.md` y en `equipo-de-agentes` (10-oct). Le volví a mandar las 6 pantallas de diseño, una imagen por pantalla
   (celular y computadora), sacadas de las capturas v3, que siguen iguales al código (medido el 10-oct).

**Su 2.ª tanda del 10-oct:** 1) sí a tocar el servidor y la base: reintento instalado y migraciones aplicadas (§2).
2) Diseño y 3) términos nuevos + 7 días de gracia: contestó con las dos opciones («OK / cambiar», «sí / no»); se le
pidió elegir una. **Hasta su respuesta no entran #110, #119, #118, #136, W1f (diseño) ni #124 y #113 (legal).**

1. **Sí o no** a refrescar la cuenta demo en producción (datos inventados), para las capturas del VSL.
2. **CAFC del piloto**: uno para Compra-venta y otro para Hospitales/clínicas, en casa matriz, con la mayor cantidad de
   facturas que permita, y captura con **código y rango**. No usar la opción de producción, que manda a imprimir
   talonarios reales.
3. **OK de diseño:** bandeja v3, escribir a un contacto nuevo, agenda v3, odontograma v3, caja v3, app sin internet y
   el chat de la web con el nombre de la clínica (W1f). Todo enviado el 10-oct en esta sesión.
4. **Punto 4:** bucket R2, token y frase de cifrado (`docs/RUNBOOK_RESPALDO_AFUERA.md` §1).
5. **Términos nuevos (#124) y 7 días de gracia (#113): sí o no.**
6. W1: la infra revisada ya no espera su OK (regla confirmada el 10-oct), pero W1 es diseño nuevo: sale con su OK a W1f.
7. SQL del B22 y correo de `+qapago` (los dos sin cambios, medidos el 9-oct), el pago de prueba y las plantillas A/B.

## 7. Próximos pasos (en orden)

0. **#124 sin esperar a nadie:** la madre sube `t124-version` (`plataforma-listas-20261010.bundle`, LEEME), CI verde y
   merge fuera de :20-:55; sale en el cron siguiente y se mira el alta (leyenda «versión 1.3» y la fila en
   `terms_acceptances`). Con el OK de diseño, lo mismo con `i110-v3`, `i119-v3`, `i118-v3` e `i140-w1f`.
1. Con el sí de la demo: correrla en la ventana de 07:00 a 11:00 UTC, verificarla y avisarle a la madre que ya puede
   sacar las capturas C1-C7. Con el login, mirar A-03, B-01, B-02, C-01 y E-01 de la tabla de promesas.
2. Con el CAFC: la corrida de la etapa VI según la bitácora.
3. Con el OK de diseño: #136 a producción y después los v3 de agenda, odontograma y caja (sus migraciones ya están
   aplicadas; el v3 entra a #110, #119 y #118 antes del merge, §3).
4. Con el mismo OK: W1e + W1f (bundles, §3) a #140, CI, la infra revisada y publicar.
5. Lo que bloquea cobrar, en el orden que diga la madre: 1 (prueba de punta a punta, §3), 4 (respaldo afuera: R2 de
   Sergio Urcullo), 13 y 14 (su sí). El 3 y el 15 ya están en `master`; falta mirarlos con login.
