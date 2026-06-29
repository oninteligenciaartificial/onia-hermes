# ONIA Cal.com / Cal.diy self-host runbook 2026

Estado: activo en dominio final y validado publicamente, agenda comercial
configurada, event types iniciales activos, webhook Cal -> n8n creado.
Pendiente: prueba SMTP real, Google Calendar directo en Cal y flujo Telegram de
aceptar/cancelar antes de abrirlo como canal masivo.
Fecha: 2026-06-29.

## Decision

Decision operativa actual 2026-06-26: usar Cal.com self-hosted como camino
principal de agenda ONIA. El link gratis de Cal.com hosted queda solo como
fallback si el self-host bloquea una reserva comercial real por SMTP, Google
Calendar, DNS o webhook.

Estado self-host:

- Produccion activo y validado: `https://cal.onia.com.bo`
- Temporal anterior: `https://onia-calcom.hqdqgh.easypanel.host`

Conectarlo a:

1. Cal booking page.
2. Webhook n8n `calcom-booking`.
3. Google Calendar.
4. Telegram para aviso a Sergio.
5. Supabase privado compartido de ONIA para auditoria y seguimiento.

## Diagnostico

- `cal.onia.com.bo` resolvio durante la revision del 2026-06-28 a
  `187.77.16.63`.
- Se uso la llave local `onia_hermes_vps_ed25519` para activar el servicio en el
  VPS.
- Cal.com `v6.2.0`, Postgres y Redis quedaron activos en `/opt/onia-calcom`.
- Traefik/Easypanel enruta el dominio temporal
  `onia-calcom.hqdqgh.easypanel.host`.
- Validacion publica 2026-06-26:
  - `http://onia-calcom.hqdqgh.easypanel.host` devuelve `308` a HTTPS.
  - `https://onia-calcom.hqdqgh.easypanel.host` devuelve `307` a `/auth/login`.
  - `https://onia-calcom.hqdqgh.easypanel.host/auth/login` devuelve `200`.
  - `GET https://onia-calcom.hqdqgh.easypanel.host/api/auth/session` devuelve
    `200 {}`; no usar `curl -I` en este endpoint porque HEAD responde `400`.
- Backup de Traefik antes del ultimo fix:
  `/etc/easypanel/traefik/config/main.yaml.bak-onia-calcom-fix-20260626212232`.
- Backup de Traefik antes de activar dominio final:
  `/etc/easypanel/traefik/config/main.yaml.bak-onia-calcom-final-domain-20260628203654`.
- Env backup antes de dominio final:
  `/opt/onia-calcom/.env.bak-final-domain-20260628203654`.
- Env backup antes de corregir remitente:
  `/opt/onia-calcom/.env.bak-email-from-20260628203856`.
- Ruta Traefik persistente 2026-06-29:
  `/etc/easypanel/traefik/config/onia-manual-routes.yaml`.
  Se usa archivo separado porque Easypanel puede regenerar `main.yaml` y borrar
  rutas manuales. Rutea `cal.onia.com.bo` a `http://onia-calcom:3000/` y
  `center.onia.com.bo` a `http://onia-center:3012/`.
- Backup Cal DB previo a configurar agenda:
  `/root/backups/calcom/calcom-pre-onia-agenda-20260629-151221.sql.gz`.
- El setup inicial ya fue completado con admin bootstrap. La API
  `/api/auth/setup` ahora responde `400 No setup needed` ante nuevos intentos.
- La credencial bootstrap quedo fuera del repo:
  `C:\Users\PC\.onia\calcom-admin-bootstrap.txt` y
  `/root/.hermes/calcom-admin-bootstrap.txt` en el VPS.
- ONIA ya tiene VPS y Supabase self-hosted privado:
  `/opt/onia-supabase/supabase/docker`.
- Supabase es la capa privada compartida de datos para proyectos ONIA, no una
  base creada solo para Cal.
- Supabase esta local-only segun `COORDINATION_MANIFEST.md`; no debe exponerse
  publicamente para una pagina de reservas ni desde codigo de navegador.
- n8n ya tiene flujo documentado para `ONIA - Agenda: Cal.com Booking`.
- Cal.com/Cal.diy cambio su modelo: Cal.diy es comunidad/MIT, pero sus docs
  recomiendan uso personal/no-productivo bajo responsabilidad propia. Para ONIA
  interna puede servir; para ofrecerlo como infraestructura comercial a clientes,
  revisar Cal.com comercial/on-prem antes.

## Arquitectura recomendada

```text
Cliente/prospecto
  -> cal.onia.com.bo
  -> Cal booking
  -> webhook n8n /calcom-booking
  -> Google Calendar
  -> Telegram Sergio
  -> Supabase privado onia_ops.booking_events
```

Cal debe usar su propio Postgres/Redis operativo. Supabase sigue siendo la
plataforma privada compartida de ONIA para proyectos, operaciones y
automatizaciones; para Cal solo recibe el espejo de bookings via n8n.

## Rol de Supabase en ONIA

Supabase debe servir para mas que Cal:

- Web Factory y tiendas/proyectos de clientes.
- Reservas, reuniones y follow-ups de ONIA.
- CRM operativo y automatizaciones internas.
- Auditoria de flujos n8n.
- Registros de produccion de contenido/IA cuando aplique.
- Futuros dashboards internos de ONIA.

Regla: cada proyecto debe tener schema o tablas claramente separadas, RLS activo
y acceso desde servidor/n8n. No usar el Supabase privado como API publica de
frontend hasta definir politicas, gateway y limites.

## Archivos preparados

- `scripts/vps_install_calcom.js`: genera kit Docker Compose sin secretos.
- `hermes-content/deploy/calcom/docker-compose.yml`: compose preparado.
- `hermes-content/deploy/calcom/.env.example`: variables requeridas.
- `hermes-content/deploy/calcom/README.md`: instrucciones de deploy.
- `supabase/migrations/20260618_onia_booking_ops.sql`: schema privado para
  reservas y seguimientos.

## DNS requerido

Crear para dominio final:

```text
cal.onia.com.bo -> VPS ONIA
```

En el proveedor DNS de `onia.com.bo`, `cal` debe apuntar a `187.77.16.63`.
Validar con:

```powershell
Resolve-DnsName cal.onia.com.bo
```

devuelva `187.77.16.63` y no otros IPs.

## Variables y secretos requeridos

Generar en el VPS, no en chat:

```bash
openssl rand -base64 32 # NEXTAUTH_SECRET
openssl rand -base64 24 # CALENDSO_ENCRYPTION_KEY
```

Completar en `.env`:

- `POSTGRES_PASSWORD`
- `NEXTAUTH_SECRET`
- `CALENDSO_ENCRYPTION_KEY`
- `EMAIL_SERVER_USER`
- `EMAIL_SERVER_PASSWORD`
- `EMAIL_FROM`

Revisar si se usara Google Calendar directo desde Cal. Aunque n8n ya puede crear
eventos en GCal, Cal necesita calendario conectado para disponibilidad real y
evitar choques.

## Event types iniciales

Configurado en produccion el 2026-06-29:

- `https://cal.onia.com.bo/onia`: pagina publica de ONIA.
- `https://cal.onia.com.bo/onia/consulta-inicial`: 30 min, gratis, prospectos
  nuevos, minimo 4 horas de anticipacion, visible.
- `https://cal.onia.com.bo/onia/demo-onia`: 45 min, Web ONIA, DentalGest,
  GestiOS, automatizaciones y sistemas, minimo 8 horas de anticipacion, visible.
- `https://cal.onia.com.bo/onia/reunion-proyecto`: 60 min, clientes activos o
  propuestas en curso, minimo 24 horas de anticipacion, visible.
- `auditoria-pagada`: 60 min, preparada pero no publica. Queda oculta y sin
  relacion publica `_user_eventtype`, por lo tanto el link directo devuelve 404
  hasta que ONIA decida cobrar asesorias.

Reglas base:

- Timezone: `America/La_Paz`.
- Buffer: 15 min minimo.
- No aceptar reuniones el mismo dia con menos de 4 horas de anticipacion.
- Disponibilidad comercial base: lunes a sabado 14:00-20:00.
- Domingo cerrado.
- Ventana futura:
  - `consulta-inicial`: 14 dias.
  - `demo-onia`: 21 dias.
  - `reunion-proyecto`: 30 dias.
- Calendario operativo: `oninteligenciaartificial@gmail.com`.
- Cuenta/identidad publica Cal self-host: `business@onia.com.bo` como
  `ONIA | Agenda Comercial`.
- Usuario publico Cal: `onia`.
- Los tres eventos publicos tienen `requiresConfirmation=true`.
- Cada evento tiene 12 campos de calificacion: empresa/negocio, WhatsApp,
  ciudad, servicio de interes, problema principal, presupuesto aproximado,
  link web/redes, quien debe tomar la reunion, urgencia, rol en el negocio,
  origen del lead y autorizacion de contacto por WhatsApp.
- La ubicacion queda como `somewhereElse` para coordinar canal por WhatsApp
  despues de aceptar. No marcar Google Meet hasta conectar Google Calendar/Meet
  en Cal.
- El correo formal al cliente se envia desde `business@onia.com.bo` despues de
  aceptar la reserva. La prueba SMTP real sigue pendiente.
- La vendedora puede agendar para Sergio, Arthur o para ella, con disponibilidad
  propia separada.
- Arthur no comparte acceso a `oninteligenciaartificial@gmail.com`; se le asignan
  reservas por Telegram/ONIA Center.
- Consultas iniciales solo en bloques definidos; no abrir todo el calendario
  privado.

## n8n

Webhook:

```text
https://n8n-sergio-n8n.hqdqgh.easypanel.host/webhook/calcom-booking
```

Eventos iniciales:

- `BOOKING_CREATED`

No activar todavia:

- `BOOKING_RESCHEDULED`
- `BOOKING_CANCELLED`
- `BOOKING_REQUESTED`
- `BOOKING_REJECTED`

Razon: el workflow n8n activo `ONIA - Agenda: Cal.com Booking` actualmente
parsea el payload, crea un evento en Google Calendar y notifica por Telegram.
No tiene ramas para solicitud pendiente, cancelacion o reprogramacion. Si Cal
envia esos eventos ahora, el workflow puede crear eventos incorrectos en GCal.

Salida actual verificada del workflow:

1. Normalizar payload.
2. Crear evento en Google Calendar `oninteligenciaartificial@gmail.com`.
3. Enviar Telegram a dos chats internos.

Salida objetivo pendiente:

1. `BOOKING_REQUESTED` -> crear lead/reunion pendiente en ONIA Center y mandar
   Telegram con acciones aceptar/cancelar/reasignar.
2. Aceptar en Cal o via flujo seguro -> disparar/registrar `BOOKING_CREATED`.
3. `BOOKING_CREATED` -> crear evento definitivo en Google Calendar.
4. `BOOKING_CANCELLED` / `BOOKING_RESCHEDULED` -> actualizar GCal y estado en
   ONIA Center, no crear eventos nuevos.
5. Insertar auditoria en `onia_ops.booking_events` y follow-up en
   `onia_ops.booking_followups`.

## Supabase

Aplicar migracion:

```bash
psql "$SUPABASE_DB_URL" -f supabase/migrations/20260618_onia_booking_ops.sql
```

Tablas:

- `onia_ops.booking_sources`
- `onia_ops.booking_events`
- `onia_ops.booking_followups`

RLS queda activado sin politicas publicas. Solo escribir con service role o
conexion server-side controlada.

## Deploy seguro

Desde Windows, cuando haya credenciales:

```powershell
$env:VPS_HOST="187.77.16.63"
$env:VPS_USER="root"
$env:VPS_KEY_PATH="C:\path\to\key"
node scripts/vps_install_calcom.js --kit hermes-content/deploy/calcom
```

Subir kit:

```powershell
scp -r hermes-content/deploy/calcom root@187.77.16.63:/opt/onia-calcom
```

En VPS:

```bash
cd /opt/onia-calcom
cp .env.example .env
nano .env
docker compose pull
docker compose up -d
docker compose ps
```

Configurar dominio/SSL desde Easypanel o Nginx.

## Validacion

```bash
docker compose ps
docker compose logs --tail=120 calcom
curl -I https://cal.onia.com.bo
curl -sS -i https://cal.onia.com.bo/api/auth/session
```

Prueba funcional:

1. Entrar con el admin bootstrap y cambiar password.
2. Crear event type `consulta-inicial`.
3. Crear booking de prueba.
4. Confirmar evento en Google Calendar.
5. Confirmar Telegram.
6. Confirmar registro en Supabase:

```sql
select title, attendee_email, start_at, status
from onia_ops.booking_events
order by created_at desc
limit 5;
```

## Bloqueos actuales

- Falta probar SMTP real con `business@onia.com.bo`.
- Falta conectar Google Calendar directamente en Cal; `Credential` de Cal esta
  vacio al 2026-06-29. Sin eso, Cal no puede bloquear horas ocupadas en Google.
- Falta prueba end-to-end con un booking real de baja criticidad.
- Falta convertir el workflow n8n a modelo pendiente/aceptar/cancelar por
  Telegram y ONIA Center.
- Falta que n8n escriba auditoria en Supabase `onia_ops.booking_events`.
- Falta revisar/confirmar licencia y eleccion final de imagen Cal.com/Cal.diy
  antes de uso publico sostenido.

## Activacion ejecutada 2026-06-19

- Directorio VPS: `/opt/onia-calcom`.
- Compose: Cal.com `v6.2.0`, Postgres `15-alpine`, Redis `7-alpine`.
- Red publica: Traefik/Easypanel sobre dominio temporal.
- Cal no expone puerto directo; Traefik entra por red `easypanel`.
- Supabase migration aplicada: `onia_ops.booking_sources`,
  `onia_ops.booking_events`, `onia_ops.booking_followups`.
- Admin bootstrap historico creado con `admin@onia.ai`; password guardado fuera
  del repo. Cambiar o crear admin final con correo del dominio `onia.com.bo`
  despues de entrar.
- Validacion setup: `POST /api/auth/setup` devuelve `400 No setup needed`.
- Validacion externa:
  `https://onia-calcom.hqdqgh.easypanel.host/auth/setup?step=1` devuelve HTTP
  200, pero ya no puede reclamar la instancia.

## Recomendacion

Para vender ya desde DM/WhatsApp: usar `https://cal.onia.com.bo/onia` solo en
pruebas controladas hasta completar una reserva real end-to-end. Para anuncios o
alto volumen, primero cerrar SMTP, Google Calendar directo en Cal y workflow de
aprobacion por Telegram/ONIA Center.
