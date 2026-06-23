# ONIA Center Auth and RLS Activation 2026-06-23

Estado: implementado en repo y aplicado en Supabase self-hosted del VPS.
Pendiente: crear usuarios Auth reales, mapearlos a perfiles y cargar variables
de entorno en el deploy web.

## Objetivo

Convertir ONIA Center de panel interno con `service_role` server-side a sistema
multiusuario con rangos:

- Sergio: acceso completo.
- Responsable de area: operacion interna sin capital privado.
- Arthur: tareas, leads, briefs, entregables y evidencias revisables.
- Vendedor: leads/tareas propias y comisiones estimadas propias.
- Freelancer: entregables asignados.

## Archivos implementados

- `supabase/migrations/20260623_onia_center_auth_rls.sql`
- `scripts/onia_center_auth_admin.js`
- `web-factory/apps/site/src/lib/onia-center-auth.ts`
- `web-factory/apps/site/src/app/api/onia-center/auth/login/route.ts`
- `web-factory/apps/site/src/app/api/onia-center/auth/logout/route.ts`
- `web-factory/apps/site/src/app/api/onia-center/auth/status/route.ts`
- `web-factory/apps/site/src/app/onia-center/login/page.tsx`
- `web-factory/apps/site/src/app/onia-center/equipo/page.tsx`

## Variables necesarias

Solo nombres, no valores:

- `ONIA_CENTER_SUPABASE_URL`
- `ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY`
- `ONIA_CENTER_SUPABASE_ANON_KEY`
- `ONIA_CENTER_SUPABASE_SCHEMA=onia_center`

Regla: `SERVICE_ROLE_KEY` nunca va al navegador. Solo server-side.

## Orden de activacion

1. Hacer backup de Supabase.
2. Aplicar `20260623_onia_center_auth_rls.sql`.
3. Crear usuarios en Supabase Auth.
4. Actualizar `onia_center.user_profiles.auth_user_id` para cada usuario.
5. Confirmar `onia_center.organization_memberships`.
6. Cargar variables en entorno server-side.
7. Entrar por `/onia-center/login`.
8. Probar `/api/onia-center/auth/status`.
9. Probar `/api/onia-center/runtime`.
10. Dar acceso no sensible por `/onia-center/equipo`.

Aplicado en VPS el 2026-06-23:

- Backup previo: `/root/backups/supabase/onia-center-pre-auth-rls-20260623-212800.sql.gz`
- Validacion Postgres: `onia_center` quedo con 44 tablas y 87 policies.
- Funciones confirmadas: `onia_center.current_user_key()` y `onia_center.can_read_visibility(text)`.

## Mapeo de usuarios

El VPS ya tiene perfiles `sergio` y `arthur`, pero al 2026-06-23 no hay usuarios
en `auth.users` y ambos perfiles tienen `auth_user_id` vacio. No inventar emails
ni passwords. Crear y mapear usuarios con el script seguro:

```powershell
$env:ONIA_CENTER_SUPABASE_URL="http://127.0.0.1:54321"
$env:ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"
$env:ONIA_CENTER_SUPABASE_SCHEMA="onia_center"
$env:ONIA_CENTER_SERGIO_PASSWORD="<password-seguro-no-commitear>"

npm run onia-center:auth-user -- --email "sergio@dominio.com" --password-env ONIA_CENTER_SERGIO_PASSWORD --user-key sergio --display-name "Sergio" --role sergio
```

Arthur queda como colaborador operativo, arriba de vendedor y debajo de Sergio:

```powershell
$env:ONIA_CENTER_ARTHUR_PASSWORD="<password-seguro-no-commitear>"

npm run onia-center:auth-user -- --email "arthur@dominio.com" --password-env ONIA_CENTER_ARTHUR_PASSWORD --user-key arthur --display-name "Arthur" --role arthur
```

Para vendedores y freelancers, crear primero el perfil:

```powershell
$env:ONIA_CENTER_SELLER_PASSWORD="<password-seguro-no-commitear>"

npm run onia-center:auth-user -- --email "vendedor@dominio.com" --password-env ONIA_CENTER_SELLER_PASSWORD --user-key seller_001 --display-name "Vendedor 001" --role seller
```

El script crea el usuario en Supabase Auth, confirma email, enlaza
`onia_center.user_profiles.auth_user_id` y upsertea la membresia por
`organization_key,user_key`.

## Reglas aplicadas

- Sergio ve todo y aprueba pagos, gastos, descuentos, premium y cierres.
- `/onia-center` completo queda Sergio-only cuando Supabase Auth esta activo,
  porque aun importa fuentes privadas en el bundle cliente.
- `/onia-center/equipo` queda disponible para usuarios autenticados y usa solo
  APIs filtradas por rol, sin cargar fuentes privadas del panel completo.
- Arthur no ve capital Sergio, deuda exacta, caja completa ni utilidad interna.
- Vendedor solo ve leads/tareas propias.
- Freelancer solo ve entregables asignados.
- Nuvia lotes queda Sergio-only por contener capital y reparto.
- Calendario Sergio queda Sergio-only.
- Integraciones privadas quedan Sergio-only.
- Servicios sellable son visibles al equipo; borradores quedan Sergio-only.
- Ideas privadas solo Sergio; ideas `assigned_only` solo owner; `team_safe` equipo.

## Pruebas minimas

1. Sin login y con Supabase configurado:
   - `/api/onia-center/runtime` debe responder `401 auth_required`.
2. Sergio:
   - ve CEO, Nuvia, capital, calendario, integraciones privadas y auditoria.
3. Arthur:
   - entra a `/onia-center/equipo`, ve tareas/leads/ideas permitidas y no ve
     Nuvia lotes, calendario Sergio ni capital.
4. Vendedor:
   - ve leads propios y no ve finanzas internas.
5. Freelancer:
   - ve solo entregables/tareas asignadas.

## Pendiente

- Crear usuarios Auth reales cuando Sergio defina emails y passwords.
- Cargar `ONIA_CENTER_SUPABASE_ANON_KEY` en entorno seguro.
- Mover `source.ts` y `operating-source.ts` privados a APIs server-only por rol.
- Crear UI de administracion de miembros despues de validar RLS.
- Agregar refresh token automatico si las sesiones largas lo requieren.
