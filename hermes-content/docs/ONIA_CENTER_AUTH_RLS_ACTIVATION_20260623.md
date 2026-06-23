# ONIA Center Auth and RLS Activation 2026-06-23

Estado: implementado en repo, pendiente de aplicar en Supabase real y crear
usuarios Auth.

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
- `web-factory/apps/site/src/lib/onia-center-auth.ts`
- `web-factory/apps/site/src/app/api/onia-center/auth/login/route.ts`
- `web-factory/apps/site/src/app/api/onia-center/auth/logout/route.ts`
- `web-factory/apps/site/src/app/api/onia-center/auth/status/route.ts`
- `web-factory/apps/site/src/app/onia-center/login/page.tsx`

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

## Mapeo de usuarios

Ejemplo de actualizacion despues de crear Auth users:

```sql
update onia_center.user_profiles
set auth_user_id = '<uuid-auth-sergio>'
where user_key = 'sergio';

update onia_center.user_profiles
set auth_user_id = '<uuid-auth-arthur>'
where user_key = 'arthur';
```

Para vendedores y freelancers, crear primero el perfil:

```sql
insert into onia_center.user_profiles (
  auth_user_id,
  user_key,
  display_name,
  primary_role_key,
  status,
  access_note
) values (
  '<uuid-auth-vendedor>',
  'seller_001',
  'Vendedor 001',
  'seller',
  'active',
  'Acceso comercial basico: leads y tareas asignadas.'
);

insert into onia_center.organization_memberships (
  organization_key,
  user_key,
  role_key,
  permission_scope,
  can_view_sensitive,
  status
) values (
  'onia',
  'seller_001',
  'seller',
  'seller_basic',
  false,
  'active'
);
```

## Reglas aplicadas

- Sergio ve todo y aprueba pagos, gastos, descuentos, premium y cierres.
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
   - ve tareas/leads propios y no ve Nuvia lotes, calendario Sergio ni capital.
4. Vendedor:
   - ve leads propios y no ve finanzas internas.
5. Freelancer:
   - ve solo entregables/tareas asignadas.

## Pendiente

- Crear usuarios Auth reales.
- Aplicar migracion en VPS.
- Cargar `ONIA_CENTER_SUPABASE_ANON_KEY` en entorno seguro.
- Crear UI de administracion de miembros despues de validar RLS.
- Agregar refresh token automatico si las sesiones largas lo requieren.
