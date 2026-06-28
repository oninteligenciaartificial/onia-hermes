# ONIA Center Auth and RLS Activation 2026-06-23

Estado: implementado, aplicado en Supabase self-hosted y desplegado en dominio
publico con login por rol.
Pendiente: rotar/entregar credenciales iniciales por canal seguro y crear UI de
administracion de miembros.

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
- `hermes-content/docs/ONIA_VENDOR_ACCESS_AND_CALENDAR_RUNBOOK_2026.md`

## Variables necesarias

Solo nombres, no valores:

- `ONIA_CENTER_SUPABASE_URL`
- `ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY`
- `ONIA_CENTER_SUPABASE_ANON_KEY`
- `ONIA_CENTER_SUPABASE_SCHEMA=onia_center`

Regla: `SERVICE_ROLE_KEY` nunca va al navegador. Solo server-side.

## Deploy publico activo

ONIA Center ya no depende de `localhost` para Arthur ni vendedores.

Estado validado el 2026-06-28:

- URL publica: `https://center.onia.com.bo/onia-center/login`
- Ruta equipo: `https://center.onia.com.bo/onia-center/equipo`
- Contenedor: `onia-center`
- Runtime: Next standalone en `/opt/onia-center/runtime-next`
- Env runtime: `/opt/onia-center/.env` con permisos `600`.
- Redes Docker: `easypanel` para Traefik y `supabase_default` para Supabase
  privado.
- Supabase interno desde contenedor: `http://supabase-kong:8000`.
- Traefik route backup:
  `/etc/easypanel/traefik/config/main.yaml.bak-onia-center-20260628205227`.

Validacion:

```powershell
curl -I https://center.onia.com.bo/onia-center/login
curl -sS -i https://center.onia.com.bo/api/onia-center/auth/status
```

Resultado esperado sin sesion:

```text
/onia-center/login -> 200
/api/onia-center/auth/status -> 401 auth_required sin missingConfiguration
/onia-center/equipo -> redirect a login
```

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

El VPS ya tiene perfiles `sergio`, `arthur` y `seller_001` mapeados a Supabase
Auth. No registrar passwords en repo ni runbooks. Crear o resetear usuarios con
el script seguro:

```powershell
$env:ONIA_CENTER_SUPABASE_URL="http://127.0.0.1:54321"
$env:ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"
$env:ONIA_CENTER_SUPABASE_SCHEMA="onia_center"
$env:ONIA_CENTER_SERGIO_PASSWORD="<password-seguro-no-commitear>"

npm run onia-center:auth-user -- --email "sergio@dominio.com" --password-env ONIA_CENTER_SERGIO_PASSWORD --user-key sergio --display-name "Sergio" --role sergio
```

Si Sergio quiere entrar con usuario sin `@`, usar email tecnico interno y alias:

```powershell
$env:ONIA_CENTER_SERGIO_PASSWORD="<password-seguro-no-commitear>"

npm run onia-center:auth-user -- --email "sergio.urcullo.m@onia.local" --password-env ONIA_CENTER_SERGIO_PASSWORD --user-key sergio --display-name "Sergio" --role sergio --login-alias "sergio.urcullo.m"
```

Usuario Sergio activado en VPS el 2026-06-24:

- `sergio` creado en Supabase Auth con email tecnico `sergio.urcullo.m@onia.local`.
- Alias de login: `sergio.urcullo.m`.
- `onia_center.user_profiles.auth_user_id` enlazado.
- Membresia `onia / sergio / sergio_private` activa.
- Password no se registra en repo ni runbook.

Usuarios activados en VPS el 2026-06-28:

- Arthur: email tecnico `arthur@onia.com.bo`, alias `arthur`, rol `arthur`,
  scope `internal_restricted`.
- Vendedora inicial: email tecnico `vendedora@onia.com.bo`, alias `vendedora`,
  user key `seller_001`, rol `seller`, scope `seller_basic`.
- Archivo local con accesos iniciales: `C:\Users\PC\.onia\onia-center-access-20260628.txt`.
- Copia segura en VPS: `/root/.hermes/onia-center-access-20260628.txt`.

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

Vendedora inicial recomendada:

```powershell
$env:ONIA_CENTER_SELLER_PASSWORD="<password-seguro-no-commitear>"

npm run onia-center:auth-user -- --email "vendedora@onia.com.bo" --password-env ONIA_CENTER_SELLER_PASSWORD --user-key seller_001 --display-name "Vendedora ONIA" --role seller --login-alias "vendedora"
```

El script crea el usuario en Supabase Auth, confirma email, enlaza
`onia_center.user_profiles.auth_user_id` y upsertea la membresia por
`organization_key,user_key`.

Nota 2026-06-26: `/onia-center/equipo` ahora conserva `ownerUserKey`,
`assignedUserKey`, `actorUserKey` y `ownerUserKey` en `raw` para separar a
usuarios dentro del mismo rol. Sergio ve todo. Un vendedor ve registros
asignados a su `user_key`; registros antiguos sin `user_key` siguen usando el
fallback por rol.

## Reglas aplicadas

- Sergio ve todo y aprueba pagos, gastos, descuentos, premium y cierres.
- `/onia-center` completo queda Sergio-only cuando Supabase Auth esta activo,
  porque aun importa fuentes privadas en el bundle cliente.
- `/onia-center/equipo` queda disponible para usuarios autenticados y usa solo
  APIs filtradas por rol, sin cargar fuentes privadas del panel completo.
- Arthur no ve capital Sergio, deuda exacta, caja completa ni utilidad interna.
- Vendedor solo ve leads/tareas propias; si hay mas de un vendedor, usar
  `ownerUserKey`/`assignedUserKey` desde ONIA Center para evitar mezcla.
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

- Entregar credenciales iniciales por canal seguro y rotarlas si se comparten
  por chat o WhatsApp.
- Mover `source.ts` y `operating-source.ts` privados a APIs server-only por rol.
- Crear UI de administracion de miembros despues de validar RLS.
- Agregar refresh token automatico si las sesiones largas lo requieren.
