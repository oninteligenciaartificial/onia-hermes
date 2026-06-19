# ONIA Cal.com / Cal.diy self-host runbook 2026

Estado: activo en dominio temporal, admin bootstrap creado, pendiente SMTP,
event types, webhook Cal y DNS oficial.
Fecha: 2026-06-19.

## Decision

Usar booking self-hosted para ONIA. Estado actual:

- Temporal activo: `https://onia-calcom.hqdqgh.easypanel.host`
- Dominio final pendiente DNS: `https://cal.onia.ai`

Conectarlo a:

1. Cal booking page.
2. Webhook n8n `calcom-booking`.
3. Google Calendar.
4. Telegram para aviso a Sergio.
5. Supabase privado compartido de ONIA para auditoria y seguimiento.

## Diagnostico

- `cal.onia.ai` no resolvio en DNS durante la revision local del 2026-06-19.
- Se uso la llave local `onia_hermes_vps_ed25519` para activar el servicio en el
  VPS.
- Cal.com `v6.2.0`, Postgres y Redis quedaron activos en `/opt/onia-calcom`.
- Traefik/Easypanel enruta el dominio temporal
  `onia-calcom.hqdqgh.easypanel.host`.
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
  -> onia-calcom.hqdqgh.easypanel.host (temporal)
  -> cal.onia.ai (final, cuando DNS este listo)
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
cal.onia.ai -> VPS ONIA
```

Si el DNS se maneja donde esta `onia.ai`, agregar `A` hacia `187.77.16.63` o
`CNAME` segun el proveedor. No activar el link en Instagram hasta que:

```powershell
Resolve-DnsName cal.onia.ai
```

devuelva el destino esperado.

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

- `consulta-inicial`: 30 min, gratis, para prospectos nuevos.
- `demo-onia`: 45 min, DentalGest/Gesti-OS/Web.
- `reunion-proyecto`: 60 min, clientes activos.
- `auditoria-pagada`: 60 min, solo si ya pago auditoria.

Reglas base:

- Timezone: `America/La_Paz`.
- Buffer: 15 min minimo.
- No aceptar reuniones el mismo dia con menos de 4 horas de anticipacion.
- Consultas iniciales solo en bloques definidos; no abrir todo el calendario.

## n8n

Webhook:

```text
https://n8n-sergio-n8n.hqdqgh.easypanel.host/webhook/calcom-booking
```

Eventos iniciales:

- `BOOKING_CREATED`

Eventos posteriores:

- `BOOKING_RESCHEDULED`
- `BOOKING_CANCELLED`

Salida esperada del workflow:

1. Normalizar payload.
2. Crear/actualizar evento en Google Calendar.
3. Enviar Telegram a Sergio.
4. Insertar en `onia_ops.booking_events`.
5. Crear follow-up en `onia_ops.booking_followups` si aplica.

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
curl -I https://cal.onia.ai
curl -I https://cal.onia.ai/api/auth/session
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

- Falta DNS `cal.onia.ai`.
- Falta definir SMTP real para `agenda@onia.ai`.
- Falta crear event types y webhook dentro del panel de Cal.
- Falta revisar/confirmar licencia y eleccion final de imagen Cal.com/Cal.diy
  antes de uso publico sostenido.

## Activacion ejecutada 2026-06-19

- Directorio VPS: `/opt/onia-calcom`.
- Compose: Cal.com `v6.2.0`, Postgres `15-alpine`, Redis `7-alpine`.
- Red publica: Traefik/Easypanel sobre dominio temporal.
- Cal no expone puerto directo; Traefik entra por red `easypanel`.
- Supabase migration aplicada: `onia_ops.booking_sources`,
  `onia_ops.booking_events`, `onia_ops.booking_followups`.
- Admin bootstrap creado con `admin@onia.ai`; password guardado fuera del repo.
- Validacion setup: `POST /api/auth/setup` devuelve `400 No setup needed`.
- Validacion externa:
  `https://onia-calcom.hqdqgh.easypanel.host/auth/setup?step=1` devuelve HTTP
  200, pero ya no puede reclamar la instancia.

## Recomendacion

Para vender ya desde Instagram: usar el link solo cuando existan event types,
SMTP y una reserva de prueba end-to-end. Mientras tanto, se puede cerrar por DM
y agendar manualmente con el comando Telegram `agendar ...`.
