# Handoff — cobro E2E y orquestación 1.0

> ## CIERRE FINAL (10-sep noche) — leer esto primero
>
> Sergio Urcullo pidió: *"ordename todo, arma handoff, vamos punto por punto en la nueva
> sesión, me das demasiados datos y no entiendo dónde estamos"*. **Dónde estamos, en 5
> líneas:**
>
> 1. **El cobro FUNCIONA** (probado E2E con capturas) y **la cuenta bancaria YA EXISTE**:
>    BCP de Leslie, guardada SOLO en el VPS (`/root/.config/onia/cuenta-bancaria-cobros.txt`,
>    600) — jamás al repo ni a la página; se pasa al cliente por WhatsApp. Falta solo el
>    primer cliente real.
> 2. **El bot de WhatsApp recibe pero ENMUDECE en conversaciones viejas** — Sergio Urcullo
>    mandó "hola" y no le contestó (rama `MUDO`, etapa `esperando_calificacion`, conv 11;
>    diagnóstico completo y fix definido en `cola/chatbot.md` arriba de todo). Conversación
>    NUEVA sí responde (probado mismo día). Probable causa de los 3 silencios de agosto.
> 3. **Alta+login sanos**: reenvío de confirmación desde el login VIVO (E2E fotografiado);
>    su cuenta gmail confirmada a mano; queda reputación de correo (fue a Spam — "spam
>    check" solo significa: buscar "Confirmá tu correo · Onia" en Spam de su Gmail).
> 4. **La máquina corre sola**: 4 loops desarrollando la cola, publicador cada 3h con
>    guarda de precio, vigías a Telegram. Cero commits pendientes en los dos repos.
> 5. **Espera SU decisión**: `ok/no t_43868cdb` (3 prospectos, en su Telegram) · trámite
>    SIAT (PdV 1) · rotar la SUPABASE_SERVICE_ROLE_KEY.
>
> **Plan punto por punto para la sesión nueva (UN punto por vez, en este orden):**
> 1. Arreglar el motor mudo (`cola/chatbot.md` ítem 🔴) y probarlo con el "hola" de
>    Sergio Urcullo — su conversación (inbox 5, conv 11) es el caso de prueba real.
> 2. Si dio `ok t_43868cdb`: mandar la plantilla a los 3 prospectos y atender lo que
>    respondan.
> 3. Primer cobro real: cliente real → transferencia a la cuenta BCP → aprobar en
>    `/admin/payments` → captura.
> 4. Entregabilidad del correo (ítem 🔴 en `plataforma-v1.md`).
> 5. SIAT por donde el código permita sin el trámite.
>
> Reglas de la sesión nueva: UN objetivo, canario «Sergio Urcullo» estricto, modelos según
> `hermes-content/docs/historial/ONIA_MODELOS_CLAUDE_Y_CUOTA.md`, reportes CORTOS (máx 5 líneas de estado — el exceso de
> datos lo pierde, lo dijo él).

> **Parte 2 (10-sep tarde), pedido nuevo de Sergio Urcullo:** *"orquestá tus loops… dame una
> definición de todo lo que va a tener la 1.0… dejá de estancarte en documentación vieja"*.
> Lo hecho: **Definición 1.0 de nueve puntos medibles escrita en
> [`cola/plataforma-v1.md`](../cola/plataforma-v1.md)** (sección «Definición 1.0») con estados
> medidos ese día. **WhatsApp del bot: FUNCIONA** — probado con evento sintético al inbox 5
> (turno completo, respuesta de venta, 404 esperado al postear a una conversación inventada);
> los silencios de agosto eran las caídas viejas del webhook. **3 prospectos de agosto sin
> respuesta** → tarea de aprobación `t_43868cdb` (kanban onia, needs_input → Telegram; >24h de
> Meta = solo plantilla aprobada). **Panel Hostinger: la estructura está VIVA en prod**
> (grupos colapsables + guía Primeros pasos + fecha La Paz + banner 2FA, capturado con la org
> QA onboardeada); los lotes 1-4 del 3-sep ya estaban deployados y el loop `chatbot-cola`
> viene cerrando la punch-list solo (`f05b2fc` topes, `ba2270b` reservas de cuenta apagada,
> `e843507` estética/dental). Falsa alarma propia cerrada en la cola: el welcome que "no sale"
> es un skip deliberado con confirmación pendiente. Los 4 loops vivos volvieron solos tras el
> límite semanal (recorrido 13:12 exit 0).

> Rama `claude/onia-payment-approval-e2e-40d70a`, worktree
> `.claude/worktrees/bolivian-community-manager-search-d2ffb2`. Sesión 2026-09-08 → 2026-09-10
> (cortada 36 h en el medio por el límite semanal de la suscripción — el mismo que tumbó a los
> loops de casa a las 03:00 UTC del 10-sep).

**Objetivo**

Declarado al abrir: *"que Onia le cobre a un cliente REAL de punta a punta; hecho = una fila de
`subscription_payments` llega a APPROVED y el plan se activa solo, verificado mirando la
pantalla"*. Sergio Urcullo lo amplió dos veces a mitad de sesión: primero a "operadora de todo"
(SIAT, bot, usuarios/pricing), después a *"orquestá tus loops y órdenes para trabajar y lanzar
la 1.0"*. Se cerró el cobro completo y la orquestación; SIAT/bot/usuarios quedaron medidos a
medias porque los tres subagentes murieron con el límite semanal.

**Qué quedó EN PRODUCCIÓN**

- **El circuito de cobro, probado entero por pantallas el 2026-09-10** (build vigente, cero
  deploys nuevos — ya estaba todo deployado, lo que faltaba era RECORRERLO):
  `/api/auth/register` (org QA `zz-qa-cobro-e2e`) → `/checkout` con comprobante subido → fila
  `PENDING` → `/admin/payments` como superadmin → **`APPROVED` 12:07:31 UTC** → org pasa de
  trial a `basic`, `planEnd = 2026-10-10` calculado solo, cliente ve **"Plan activo hasta el
  10 de octubre de 2026"**. Capturas: `shot-admin-pendiente.png` y `shot-cliente-activo.png`
  (enviadas a Sergio Urcullo por el chat; los .png viven en el VPS en `/root/`).
- **La fila QA sigue en la base a propósito** para que Sergio Urcullo la vea en
  `/admin/payments` → pestaña Aprobado. Borrarla cuando la haya visto (borra la org y el FK
  cascada se lleva el pago): ver "Próximos pasos".
- **Confirmación reenviada a `sergio.urcullo.m@gmail.com`** (12:08:37 UTC, Gmail `250 OK`) —
  su cuenta llevaba 10 días sin poder entrar (alta 31-ago con el enlace PKCE viejo, quemado).
- **Órdenes nuevas en las colas** (`COLA.md` estado 10-sep + 2 ítems en
  `cola/plataforma-v1.md`): entregabilidad real del correo de confirmación (🔴) y la guarda
  `RESEND_API_KEY` que dice `not_configured` con SMTP andando (🟡).
- **Publicador automático confirmado**: `/var/log/onia-publicar-solo.log` corrió solo hasta el
  09-sep 23:50 "plataforma: al dia" — el punto 4 del handoff anterior queda cerrado.

**Qué quedó a medias, y dónde**

- **SIAT / bot de WhatsApp / auditoría usuarios-pricing**: tres subagentes lanzados el 08-sep
  murieron por el límite semanal con resultados parciales: SIAT "PdV 1 sigue bloqueado hoy,
  medido en vivo"; bot "confirmado por diseño, falta ver si llegan callbacks de Meta a Chatwoot
  hoy". Ninguno llegó a reporte. Las colas ya cubren lo esencial (SIAT tiene ítem abierto en
  `plataforma-v1.md:1850`).
- **La bandeja real del correo**: Gmail aceptó con 250 pero nadie ABRIÓ una bandeja a mirar
  (el MCP de Gmail falló dos veces). Es el ítem 🔴 nuevo de `plataforma-v1.md`.

**Archivos**

| archivo | qué es |
|---|---|
| `scripts/onia-mirar.js` | abre cualquier pantalla de `app.onia.com.bo` con sesión real (magic link Admin API → `/auth/confirm`) y la fotografía; corre en el VPS (`/root/onia-mirar.js`) |
| `hermes-content/docs/handoff/cobro-e2e.md` | este handoff |
| `hermes-content/docs/COLA.md` | estado re-medido 10-sep |
| `hermes-content/docs/cola/plataforma-v1.md` | 2 ítems nuevos (correo) |
| en el VPS `/root/onia-{alta,pagar,aprobar}-qa*.js` | los scripts del recorrido QA (efímeros, no van al repo) |

**Intentos fallidos** — lo que más vale

1. 🔴 **"SMTP con credenciales vacías = correo roto" era FALSO.** `GOTRUE_SMTP_USER`/`PASS`
   vacíos son A PROPÓSITO: Postfix (`onia-mail`) relayea sin auth desde la red interna de
   docker. Medido disparando un resend real: DKIM firmado, Gmail `250 OK`, cola vacía. La
   variable vacía no prueba nada; el envío disparado sí.
2. 🔴 **Mi propio `sed` de redacción convertía `PASS=` (vacío) en `PASS=REDACTED`** — un
   instrumento que fabrica el dato que busca. Se reemplazó por medir `wc -c` del valor.
3. **El `action_link` del magic link NO sirve para automatizar**: va a `/auth/callback` con
   `?code=` PKCE que solo canjea el navegador que tiene la cookie `code_verifier` — terminaba
   en `/login` con el token quemado. Lo que sirve es `hashed_token` + `/auth/confirm?token_hash=…&type=magiclink` (verifyOtp, sin cookie previa). Mismo bug que la app ya
   había arreglado para los mails el 1-sep.
4. **Dos trampas de quoting por SSH**: `'…'` dentro del argumento single-quoted del ssh corta
   el comando (el heredoc con `-d '${body}'` mandó `-d` vacío Y VOLCÓ la service-role key al
   log); `Authorization:Bearer X` sin comillas se parte en dos args. Solución: nada de curl —
   `fetch` nativo de Node en un archivo subido por stdin (`ssh "cat > f.js" < f.js`).
5. **El clic en "Aprobar" con `name: /^Aprobar$/` no matchea**: el nombre accesible del botón
   incluye la ligadura del icono ("check Aprobar"). Sin anclas funciona.
6. **Tres subagentes Opus en paralelo + loops de casa = límite semanal en horas.** Los loops
   ya habían drenado el pool durante la noche; mis tres agentes lo remataron. El pool es UNO
   para toda la suscripción (loops + sesiones + subagentes). Antes de fan-out grande: mirar
   cuánto queda, y los loops de casa avisan solos en sus logs ("You've hit your weekly limit").
7. **"Primera fila de la historia" era impreciso**: `COLA.md` registra una corrida QA APPROVED
   el 1-sep cuya org fue borrada después (cascada se llevó la fila). Lo de hoy es la única fila
   viva y la re-prueba con capturas; un pago REAL sigue sin existir.

**Qué depende de Sergio Urcullo**

- 🔴 **La cuenta bancaria** (hoy: la personal, solo por mensaje privado — la página ya lo hace
  bien: no muestra cuenta, dice "Escribinos y te pasamos los datos"). Es lo ÚNICO entre el
  circuito probado y el primer cobro real.
- 🔴 **Rotar la `SUPABASE_SERVICE_ROLE_KEY`**: apareció en claro en los logs de esta sesión
  (dos veces, por el error de quoting). No quedó en ningún archivo ni commit, pero la clave
  maestra que ya se mostró se rota. Es regenerar el JWT secret/service key del stack Supabase
  del VPS y recrear los contenedores que la usan.
- **Revisar su bandeja de `sergio.urcullo.m@gmail.com`** (y spam): tiene el correo "Confirmá tu
  correo · Onia" del 10-sep; con ese clic su cuenta de Bolivian electricidad por fin entra.
- **El `ok` pendiente del arreglo de la landing que toca `pricing.ts`** (ítem
  `plataforma-v1.md:886`) — sigue frenado a propósito esperando su firma.
- **Borrar la org QA del cobro cuando la haya visto** en `/admin/payments`.

**Próximos pasos**

1. El ítem 🔴 del correo en bandeja real (`plataforma-v1.md`) — lo toma `chatbot-cola` en su
   plato de plataforma, o la próxima sesión de control.
2. Primer cobro REAL: cliente real + transferencia real + aprobar en `/admin/payments`. El
   circuito ya no es la incógnita.
3. Limpieza QA cuando Sergio Urcullo haya mirado la pestaña Aprobado:
   `DELETE FROM organizations WHERE slug='zz-qa-cobro-e2e';` (cascada) + borrar
   `auth.users` de `oninteligenciaartificial+qacobro@gmail.com` + los `/root/onia-*-qa*.js` y
   `/root/COMPROBANTE-QA-*.png` del VPS.
4. Re-lanzar las tres mediciones muertas (SIAT / bot / usuarios-pricing) con presupuesto:
   UN agente por vez, no tres Opus en paralelo.
