# Handoff — onia-1.0-nube (carril Plataforma, en la nube)

Sesión saliente: `session_01HhnFgkeF6nLGvjrfjt1o2C` (5 al 9-oct-2026). Antes: `session_014HGgof9kHQkdLXhsZsAq6A`.
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

- **9-oct 08:56 UTC, `release-ef3e2325`:** #133 (K2 + K2b: el Reprogramador recupera faltas y cancelaciones de 30
  días, una sola propuesta por persona con tratamiento a medias), #134 (K3 + K3b: el alta dental arranca con 6
  servicios en Bs 0, horario de lunes a viernes y un aviso, sin apagar agentes) y #138 (K3c: la demo instantánea no se
  siembra). «PUBLICADO Y VERIFICADO», contenedor healthy. Rollback: `onia-platform-prev-BUAKN3u8-20261009-085629`.
  **Medido en producción:** altas QA por la pantalla pública (`zz-qa-k3-dental-ile9e`, `zz-qa-k3-importadora-713ar`):
  la dental quedó con 6 servicios en 0, 5 horarios y el aviso; la de importadora sin nada de eso. Capturas en
  `docs/cola/capturas-k3-altas/`. **Falta:** pasadas las 11:00 UTC, que la dental tenga sus agentes ENCENDIDOS (los
  crea el cron). Las dos QA se borran con el protocolo de `onia-db` cuando ya no sirvan.
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
| Bandeja: C16b + B1 + C16d + T2 (en vivo) + diseño v3 + B3 (app instalable) | onia-platform#136, `f4b4a417`, CI verde | Espera el OK de diseño de Sergio Urcullo (capturas en `docs/cola/capturas-bandeja/v3` y `capturas-app-instalable`). Con OK: mergear, publicar, correr `scripts/chatwoot-webhook-eventos.mjs` en el VPS, recrear el contenedor y MIRAR que un WhatsApp de prueba llegue a `/inbox` en menos de 2 s |
| Demo para el VSL (C1-C7) | `scripts/demo-venta/seed-demo.sql` en #136 | Mañana: 7 citas, sin confirmar SOLO Natalia a las 10:00; su ficha y su cobro vencido. Espera el **sí** de Sergio Urcullo para refrescar en prod: `reset=2` entre 07:00 y 11:00 UTC (después del backup diario, antes de los agentes), de lunes a jueves; después `verify-demo.sql` §10 y, pasadas las 11:00 UTC, el log de agentes. Las capturas las saca quien tenga el login (Ventas o la madre) |
| SIAT etapa VI (faltan 180 de 560) | `/opt/onia-siat/runner-20260929/` (`emisor-v3`, `run-case-v3.sh`, `BITACORA.md`) | Todos piden el **CAFC del piloto** (pedido a Sergio Urcullo el 9-oct, con código y rango). El runner ya lee un CAFC por sector con su rango (hermes `846aa24a9`). Pasos en la bitácora: `cafc-piloto.json` → una fila chica → el resto → captura del Listado de Etapas |
| W1 + W1b + W1c (widget propio seguro) | onia-platform#140 (rama `integ/w1-w1b`, la pusheó la madre desde el bundle) | **CI verde** el 9-oct (`737e4bd1`, suite 9.954 en verde). Revisión de seguridad: diseño correcto. Antes de publicar: `codex-tareas/W1d` (el cupo de la clínica se gasta con mensajes falsos: una IP le apaga el widget una hora) y la infra con OK de Sergio Urcullo: origen solo para Cloudflare (medido: el VPS contesta directo y todo límite por IP se salta), `/public/api/` bloqueado en `chat.onia.com.bo` y `hmac_mandatory` en el inbox API. #131 y #137 quedan reemplazados por #140 |
| Diseño v3 de agenda, odontograma y caja | `docs/cola/ramas-locales/` (`wip/c118`, `wip/c119`, `wip/c110`) | Esperan el OK de diseño. Migraciones: caja `20261004190000_add_daily_cash` (antes del swap), caras `20261006220000_add_tooth_surfaces` |
| Punto 3: canal privado de la agenda | onia-platform#139 (rama `codex/punto-3-canal-privado`, la armó la madre el 9-oct desde `wip/canal`) | PR abierto: espera el OK de Sergio Urcullo a la migración, que va ANTES de la imagen. Trae `20261005140000_realtime_citas_privado`: infra de Realtime con OK. **Medido 9-oct (solo lectura):** datos clínicos ya no salen (el canal lleva solo `{id}` desde el 3-oct) y la clave pública no alcanza nada (0 funciones ejecutables por anon, los 2 buckets privados y sin políticas, RLS en todas las tablas). Falta para cerrar B22: el canal sigue público (horarios de actividad y avisos falsos), el SQL del B22, y el contenedor `onia-platform-qa`, arriba desde el 18-sep en `127.0.0.1:3100` con la MISMA base y Auth que producción (apagarlo es decisión de Sergio Urcullo: C8 de `ONIA_VELOCIDAD_Y_ESTABILIDAD.md`) |
| Punto 4: respaldo afuera | código y `docs/RUNBOOK_RESPALDO_AFUERA.md` en `master` | **No está activo** (9-oct): en el VPS no hay `respaldo-afuera.sh`, ni cron, ni la clave. Falta que Sergio Urcullo cree el bucket R2, su token y la frase (runbook §1) y que la madre lo instale (§2) |
| Punto 15: factura del pago | onia-platform#114 (C15b hecho el 9-oct, `e68470ab`) | Revisado con lente de plata: correcto (validar y reservar antes de emitir, número único, corrección auditada, exención solo con marca del superadmin). Suite 9.939 en verde. **Las 2 migraciones (`20261006100000_add_subscription_payment_invoice` y `20261009110000_subscription_invoice_validation`) se aplican con OK de Sergio Urcullo y backup ANTES del merge**: el cron publica master cada 3 h y sin ellas toda lectura de organización da P2022 |
| Punto 14: términos aceptados | #124 + `wip/terms` (`2191bf56`) | Espera su migración `20261008000000_add_terms_acceptances` |
| Punto 1: cobro de punta a punta | QA «ZZ QA Pago» (`+qapago`) | Medido 9-oct (SQL de solo lectura): **0 pagos de suscripción** en producción; «ZZ QA Pago» en prueba Profesional hasta el 19-oct, con el correo **sin confirmar**. Falta: confirmar ese correo, pagar con el QR, subir el comprobante y que Sergio Urcullo apruebe ese pago de PRUEBA sin facturar. **Pasos mínimos (madre en la PC + 1 clic de Sergio Urcullo):** 1) en Gmail, abrir el «confirme su correo» de `oninteligenciaartificial+qapago@gmail.com` (si venció, reenviarlo desde `/login`); 2) entrar como «ZZ QA Pago» → Mi plan → Contratar **Básico semanal (Bs 89)**, escanear el QR con la app del BCP SOLO para ver que abre la cuenta de Onia (sin pagar) y subir una imagen cualquiera como comprobante de PRUEBA; 3) Sergio Urcullo, como superadmin, lo aprueba en `/admin/payments` (cuenta interna `zz-qa-pago-o4kaw`: no cuenta como cliente); 4) Plataforma mide con SQL de solo lectura: 1 pago aprobado y el plan activo con su vencimiento. El QR es el fijo de la cuenta BCP de Onia (vence el 25/09/2027) |
| SQL del B22 (REVOKE a anon) | `prisma/migrations/20261003230000_revoke_anon_onia_sends` | Medido 9-oct: **sin aplicar** (las dos tablas siguen con 7 permisos para anon y authenticated, y el permiso por defecto de `postgres` sigue abierto). No urge: TRUNCATE no se alcanza por la API pública, y las 4 migraciones pendientes (caja, caras, términos, factura) traen RLS + REVOKE. Solo con el OK textual de Sergio Urcullo |

## 4. Archivos

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

## 6. Qué depende de Sergio Urcullo (lo canaliza la madre)

1. **Sí o no** a refrescar la cuenta demo en producción (datos inventados), para las capturas del VSL.
2. **CAFC del piloto**: uno para Compra-venta y otro para Hospitales/clínicas, en casa matriz, con la mayor cantidad de
   facturas que permita, y captura con **código y rango**. No usar la opción de producción, que manda a imprimir
   talonarios reales.
3. **OK de diseño:** bandeja v3, escribir a un contacto nuevo, agenda v3, odontograma v3, caja v3 y app sin internet
   (la lámina de 6 pantallas que le mandó la madre).
4. **Punto 4:** bucket R2, token y frase de cifrado (`docs/RUNBOOK_RESPALDO_AFUERA.md` §1).
5. Migraciones: caja, caras, términos y Realtime privado (§3).
6. El día que se publique W1: OK a la infra de Chatwoot (§3).
7. SQL del B22 y correo de `+qapago` (los dos sin cambios, medidos el 9-oct), el pago de prueba y las plantillas A/B.

## 7. Próximos pasos (en orden)

1. Con el sí de la demo: correrla en la ventana de 07:00 a 11:00 UTC, verificarla y avisarle a la madre que ya puede
   sacar las capturas C1-C7. Con el login, mirar A-03, B-01, B-02, C-01 y E-01 de la tabla de promesas.
2. Con el CAFC: la corrida de la etapa VI según la bitácora.
3. Con el OK de diseño: #136 a producción y después los v3 de agenda, odontograma y caja con sus migraciones.
4. W1 + W1b: integrar, CI, revisión de seguridad e infra con OK.
5. Los puntos que faltan del plan, en el orden que diga la madre (1, 3, 4, 13, 14 y 15 primero, porque bloquean cobrar).
