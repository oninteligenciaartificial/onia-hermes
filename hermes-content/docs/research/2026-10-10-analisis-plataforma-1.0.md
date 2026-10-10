# Onia Platform 1.0 - estado real al 10-oct-2026, 15:10 UTC

Corregido por verificador Opus y actualizado por la madre, 10-oct ~15:45 UTC.

Foto de un día (no es fuente de verdad). Fuentes: `docs/ONIA_PLAN_1.0_Y_CAJA.md`, handoff `onia-1.0-nube.md` en
`origin/claude/optimistic-ride-1sp5fe`, `docs/cola/loop/plataforma.md`, `gh pr list/view` de onia-platform (leído a las
15:09 UTC) y `gh api compare` para saber qué merge entró en cada versión publicada.

- `master` = `32c7e0e8` (#143 F1, #142 pago de usted y #139 canal privado). El cron lo publica a las 15:50 UTC.
  Publicar es seguro: la migración de #139 es idempotente y el deploy no corre `prisma migrate`; falta solo su registro
  en `_prisma_migrations`.
- `app.onia.com.bo/login`: 200 en 0,96 s (curl, 15:09 UTC).
- Lo publicado el 8-oct (`b37e1182`, #128) ya contiene #122 y #123: `9fa85668` (#123) y `b2d9d315` (#122) son
  ancestros de `b37e1182`. También contiene #112 (`5102535c`).
- Actualizado por la madre después del análisis (15:45 UTC): #114, #132, #110 y #119 quedaron integrados con master;
  #124 ya no guarda una IP falsificable; #113 tiene los conflictos resueltos; `/book` en usted está hecho en la nube.
  Cada fila lo dice.

## Los 15 puntos

| # | Punto | Estado | Evidencia | Bloqueo | Dueño | Siguiente |
|---|---|---|---|---|---|---|
| 1 | Cobro completo con QR del BCP | Flujo EN PROD; #142 (usted) EN MASTER SIN PUBLICAR; prueba de punta a punta SIN HACER | Handoff: 0 pagos de suscripción (SQL, 9-oct); «ZZ QA Pago» en prueba hasta el 19-oct, con el correo sin confirmar. #142 mergeado 13:15 UTC | Que Sergio Urcullo apruebe el pago de prueba; antes, la madre confirma el correo `+qapago`. Las cuentas QA tienen una contraseña aleatoria sin guardar | madre + Sergio Urcullo | Pasos del handoff §3: «Recuperar acceso», abrir `app.onia.com.bo/checkout` directo (Mi plan no se muestra a cuentas internas, medido 9-oct), checkout Básico semanal, QR escaneado con la app del BCP solo para ver que abre la cuenta de Onia (SIN pagar), imagen cualquiera como comprobante de prueba, aprobación en `/admin/payments` y SQL de solo lectura (1 pago aprobado, plan activo). No necesita #114. Un pago real mueve plata y necesita el sí de Sergio Urcullo (no figura en sus decisiones) |
| 2 | Checkout sin factura automática y titular del QR explicado | EN PROD (#111, 5-oct, `97fe3061`) + #142 EN MASTER SIN PUBLICAR | #111: «la factura llega después de verificar el pago, y el titular del QR se explica». El handoff da el 5-oct como publicado con los puntos 2 y 12 | Sergio Urcullo: resolver con el BCP el nombre del titular del QR (plan §5.3) y confirmar que OniaAgency puede facturar en el Portal Web del SIN (madre-local §6b; el checkout promete factura por correo, así que toca también el punto 15). No hay evidencia de que ninguno esté cerrado | madre + Sergio Urcullo | Mirar `/checkout` con login después de las 15:50 UTC (es el mismo paso que el punto 1) |
| 3 | Datos clínicos fuera del canal de la agenda y de la clave pública | EN MASTER SIN PUBLICAR (#139, `32c7e0e8`); migración aplicada en prod a las 13:29 UTC | Medido el 9-oct: el canal solo lleva `{id}`, anon tiene 0 funciones ejecutables, los buckets son privados y hay RLS en todo. 10-oct: política `onia_citas_lee_su_organizacion` solo SELECT. La migración es idempotente y el deploy no corre `prisma migrate`: publicar es seguro | La migración no está registrada en `_prisma_migrations` (el control de permisos frenó a la nube; no hay evidencia de que la madre pueda escribir en la base de prod) | madre | Insertar la fila (checksum `dd03a439...be43`). Después de las 15:50, mirar «En vivo» con login y que los logs de realtime no tengan «Unauthorized». El punto se cierra con las dos cosas, no con la publicación sola |
| 4 | Respaldos fuera del VPS con restauración probada | Código y runbook EN MASTER; NO ACTIVO en el VPS | Handoff 9-oct: en el VPS no hay `respaldo-afuera.sh`, ni cron, ni clave | Bucket R2, token y frase de cifrado (runbook §1) | Sergio Urcullo, después la madre | Sergio Urcullo hace el §1, la madre instala el §2 y se prueba una restauración |
| 5 | Agenda con una columna por profesional y confirmar en 1 clic | 1 clic EN PROD (#128, 8-oct); columnas: PR #118 draft, CLEAN | #128 publicado el 8-oct a las 23:12 UTC (`b37e1182`). #118 con CI verde y sin migración; el diseño v3 está en `wip/c118`, sin subir | OK de diseño de Sergio Urcullo | Sergio Urcullo, después Plataforma | Con el OK: subir el v3 a #118, mergear y mirar. El 1 clic se mira con login (madre) |
| 6 | Ficha «ver todo» y odontograma de 5 zonas | «Ver todo» EN PROD (#116 C6a, vía #122); odontograma: PR #119 draft, integrado con master (`3e0575ef`) | `b2d9d315` (#122) es ancestro de `b37e1182`. #119 integrado con master en `3e0575ef` (la línea base de voseo bajó a 0); suite 10.026 en verde y 0 en rojo salvo ese test, ya arreglado. Trae la migración `20261006220000_add_tooth_surfaces` | OK de diseño + migración | Sergio Urcullo, después Plataforma | Con el OK: migración con backup, merge y mirar |
| 7 | Presupuesto por fases y tratamientos ya empezados | EN PROD (#123, 8-oct) | `9fa85668` (#123) es ancestro de `b37e1182`, publicado el 8-oct. Sergio Urcullo lo aprobó | Nada | madre | Mirarlo con login |
| 8 | Caja diaria con apertura, cierre y descuadre | PR #110 draft, integrado con master (`1c5112a9`) | Suite 9.965 en verde y 0 en rojo (madre). Trae la migración `20261004190000_add_daily_cash`; el v3 está en `wip/c110` | OK de diseño + migración | Sergio Urcullo, después Plataforma | Con el OK: migración antes del swap, merge y mirar |
| 9 | Demo: el recall propone pacientes en «Clínica Demo Onia» | EN PROD (medido por SQL, sin mirar con login) | 9-oct, después del cron de las 11:00: el recall dejó 4 propuestas (4 personas). `module.agents` no hace falta en el plan Profesional | Para el VSL las fechas quedaron viejas: refrescar la demo espera el sí de Sergio Urcullo | madre (Sergio Urcullo para el refresco) | Mirar las tarjetas con login. Con el sí, `reset=2` solo de lunes a jueves entre las 07:00 y las 11:00 UTC (hoy es sábado: la primera ventana es el lunes 12-oct) |
| 10 | Botón «Enviar por WhatsApp» por cita y conexión sin promesas falsas | EN PROD (#128 y #112, ambos desde el 8-oct a las 23:12 UTC) | Release `b37e1182` dio «PUBLICADO Y VERIFICADO» y contiene a #112. #112 se mergeó el 5-oct a las 21:45 UTC (`5102535c`), DESPUÉS del release del 5-oct `97fe3061` (#111), que no lo contiene; no hubo release entre ambos. Falta mirarlo con login | Nada | madre | Mirar «Hoy» con WhatsApp y la tarjeta de conexión |
| 11 | Agenda que no miente: reprogramar, feriados y aviso de reserva online | EN PROD (#115 C11a, y C11b vía #122; #121 figura CLOSED, no MERGED) | #122: «reprogramar y días cerrados (#117 #120 #116 #115 #121)», ancestro de `b37e1182`. El head de #121 (`7d3495e8`) es ancestro de `b2d9d315` (#122), así que C11b está en prod por #122. #115 y #116 figuran como draft MERGED por la misma vía | Nada | madre | Mirarlo con login. `/book` en usted ya está hecho por Codex en la nube: `8db1e8e4` en `codex/book-usted`, suite corriendo (fuera de los 15 puntos) |
| 12 | Importar CSV con «;» y WhatsApp de soporte en `/help` | EN PROD (#109, 5-oct) | El handoff da el 5-oct (`97fe3061`) como publicado con los puntos 2 y 12 | Nada | madre | Probar un CSV con «;» en prod |
| 13 | 7 días de gracia y «no renovar» | PR #113 draft; conflictos con master resueltos por Codex (merge `a8def40f`), suite corriendo | Antes del merge: tsc 0, suite 9.930 en verde (`a65a0cba`, C13c). Cambia §3.3 y §3.4 de los Términos publicados. Los choques con #142 en `renewalCopy` y en `planesDe` los resolvió Codex en `a8def40f` | OK de Sergio Urcullo a los Términos y a la gracia del plan semanal; suite en verde | Sergio Urcullo, después Plataforma | Con el OK y la suite verde: entrar después de #124, mergear y mirar |
| 14 | Aceptación de términos guardada (fecha y versión) | PR #124 draft, CLEAN; IP falsificable ya corregida (`2ee1dcfe`), suite corriendo | Tabla `TermsAcceptance` dentro de la transacción del alta. Ahora usa `clientIp` de `lib/http/client-ip.ts` en vez del primer `x-forwarded-for` (antes `11bbaf60`, CI verde). La migración `20261008000000_add_terms_acceptances` no está aplicada | Suite verde + migración con backup + revisión de la RLS | Plataforma + madre | Suite verde, migración, merge y mirar |
| 15 | Checklist de factura manual al aprobar cada pago | PR #114 draft, CLEAN (`5c5beaf8`, integrado con master) | Suite 10.026 en verde y 0 en rojo (madre). Revisado con lente de plata. Las migraciones `20261006100000_add_subscription_payment_invoice` y `20261009110000_subscription_invoice_validation` no están aplicadas | Las 2 migraciones van ANTES del merge: si no, toda lectura de organización da P2022. Hay que aplicarlas y además registrarlas en `_prisma_migrations` (mismo control de permisos que frenó a #139) | madre + Plataforma | Backup, las 2 migraciones (aplicar y registrar), merge fuera de los minutos :30-:50 y mirar `/admin/payments` |

Fuera de los 15 puntos: #132 (K1) integrado en `0abc65d5`, suite 10.010 en verde y 0 en rojo (madre), nadie que lo llame
todavía. `/book` en usted: `8db1e8e4` en `codex/book-usted`, suite corriendo. #136 (bandeja) está DIRTY otra vez.
#140 (widget) está CLEAN y espera el OK de diseño de W1f.

## Camino crítico al 16-oct (puntos 1 a 4)

1. **Hoy, 15:50 UTC:** el cron publica `32c7e0e8` (seguro: la migración de #139 es idempotente y el deploy no corre
   `prisma migrate`). La madre mira el contenedor, los logs, `/login` sin pedidos a `fonts.gstatic.com` y «En vivo» en la
   agenda con login. Con eso se verifica lo publicado, pero el punto 3 se cierra recién después del paso 2.
2. **Madre:** registra #139 en `_prisma_migrations`. Ojo: no hay evidencia de que la madre pueda escribir en la base de
   prod. Su propio control de permisos frenó un «Remote Shell Writes» en el VPS ese mismo día (Lucía G1, madre-local v3),
   y el handoff de Plataforma dice que decide Sergio Urcullo si esa sesión registra migraciones en producción. Este
   paso puede quedar trabado igual que en la nube; si pasa, se le pide la decisión. Cierra el punto 3.
3. **Madre + Plataforma (punto 15):** #114 ya está CLEAN. Backup, las 2 migraciones (aplicadas y registradas en
   `_prisma_migrations`, con el mismo control de permisos que el paso 2) y merge de #114 en el siguiente cron. Después se
   mira. **No es requisito del punto 1:** los pasos mínimos del punto 1 no necesitan #114. Atar el punto 1 (vence el
   16-oct) a #114 es una decisión, no una dependencia técnica medida; si el 16-oct aprieta, el paso 4 va sin esperar al 3.
4. **Madre:** confirma el correo `+qapago`, usa «Recuperar acceso» (la contraseña aleatoria de la cuenta QA no se
   guardó) y abre `app.onia.com.bo/checkout` directo. En el checkout (Básico semanal) escanea el QR con la app del BCP
   solo para ver que abre la cuenta de Onia, SIN pagar, y sube una imagen cualquiera como comprobante de PRUEBA.
   **Sergio Urcullo** lo aprueba en `/admin/payments`. **Plataforma** lo mide con SQL de solo lectura. Así se cierran los
   puntos 1 y 2 (el 2 además espera lo del titular del QR y la factura, abajo). Si #114 ya entró, la misma aprobación
   prueba el 15. Un pago real mueve plata de verdad: necesita el sí de Sergio Urcullo.
5. **Sergio Urcullo:** bucket R2, token y frase. **Madre:** lo instala y prueba una restauración (punto 4).

Los pasos 1, 2 y 5 no dependen entre sí. El 4 va después de que el cron publique (paso 1) para ver #142; no necesita el 3.

## Lo que solo destraba Sergio Urcullo

- Bucket R2, token y frase de cifrado para el respaldo afuera (punto 4).
- Aprobar el pago de prueba de «ZZ QA Pago» en `/admin/payments` (punto 1). Y decir si quiere un pago real (mueve
  plata) en vez del comprobante de prueba.
- Resolver con el BCP el nombre del titular del QR (punto 2, plan §5.3) y confirmar que OniaAgency puede facturar en el
  Portal Web del SIN (madre-local §6b; toca también el punto 15). No hay evidencia de que estén cerrados.
- OK textual para correr en prod el SQL del B22 (`prisma/migrations/20261003230000_revoke_anon_onia_sends`, REVOKE a
  anon). Medido el 9-oct: sigue SIN APLICAR. El handoff lo pone «solo con el OK textual de Sergio Urcullo» (§3 y §6
  punto 7).
- OK al cambio de Términos (gracia de 7 días y solo lectura) y decidir la gracia del plan semanal (punto 13).
- OK de diseño: agenda por profesional, odontograma y caja (puntos 5, 6 y 8). Fuera de los 15 puntos también esperan la
  bandeja (#136) y el chat de la web (W1f).
- Sí o no a refrescar la demo en prod para el VSL (punto 9). Solo corre de lunes a jueves, 07:00-11:00 UTC: hoy es
  sábado, la primera ventana es el lunes 12-oct.
- Quién registra migraciones en prod: la sesión de la nube o la madre (el control de permisos frenó a la nube y también
  frenó una escritura remota de la madre en el VPS, 10-oct). Afecta a #139 y a las 2 migraciones de #114.
- Apagar o no `onia-platform-qa`, que usa la misma base y el mismo Auth que prod (cierre del B22).

## Riesgos

1. **Qué corre hoy en prod no está claro.** La madre dice que corre lo anterior a #141. El handoff dice que #141 está
   publicado desde el 9-oct a las 18:50 (`release-c94b9daa`, mirado a las 19:16). Además, la de las 15:50 es la primera
   publicación con F1 y con una migración aplicada pero sin registrar. Se resuelve mirando el contenedor y el
   `build.log` después de las 15:50.
2. **Mergear #114 antes de sus migraciones tira producción:** el cron publica master cada 3 h y toda lectura de
   organización daría P2022. #114 ya está CLEAN, así que el riesgo es mergearlo apurado.
3. **El punto 4 depende solo de Sergio Urcullo** y además necesita una restauración probada. Si el bucket llega el
   15-oct, no queda margen para el 16-oct.
4. **El registro de migraciones en prod puede quedar trabado** (#139 y las 2 de #114): la madre no tiene evidencia de
   permiso de escritura en la base de prod y el handoff deja la decisión en Sergio Urcullo. Sin el registro de #139 no
   hay riesgo de caída (es idempotente), pero el punto 3 no cierra; y #114 queda sin su paso previo.
5. **Para el 30-oct, el cuello de botella es el diseño:** los puntos 5, 6 y 8 esperan el OK de Sergio Urcullo. Los
   conflictos de #119, #110 y #113 con master ya están resueltos hoy, pero master se mueve y se vuelven a ensuciar;
   además se acumulan migraciones (#114 trae 2, #124, #119 y #110 una cada una) antes de un mismo swap. Cuanto más tarde
   llegue el OK, más rebase y más migraciones juntas.
6. **Resuelto en código, falta la suite: #124 guardaba como prueba legal una IP falsificable** (primer
   `x-forwarded-for`). Ya usa `clientIp` de `lib/http/client-ip.ts` (`2ee1dcfe`). No mergear hasta que la suite esté en
   verde.
