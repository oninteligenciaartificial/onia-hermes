-- SOLO LECTURA. Correr: ssh ... "docker exec -i supabase-db psql -U postgres -d postgres -At -F '|' -v ON_ERROR_STOP=1" < trials.sql
SET default_transaction_read_only = on;
BEGIN READ ONLY;
SET LOCAL search_path TO public;

-- 0) Confirmar columnas vivas (el schema Prisma puede no coincidir con prod)
SELECT table_name, string_agg(column_name, ',' ORDER BY ordinal_position)
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('organizations','profiles','subscription_payments','onia_trial_drip_sends')
GROUP BY table_name;

-- 1) Orgs con prueba que vence 2026-10-01..03 o que vencio 2026-09-10..18
WITH target AS (
  SELECT o.*
  FROM public.organizations o
  WHERE o."trialEnd" >= '2026-10-01' AND o."trialEnd" < '2026-10-04'
     OR o."trialEnd" >= '2026-09-10' AND o."trialEnd" < '2026-09-19'
)
SELECT
  t.id, t.name, t.slug, t."verticalTrackId", t.plan,
  t."createdAt"::date AS alta, t."trialStart", t."trialEnd", t."planEnd", t."planCanceledAt",
  CASE WHEN t."planCanceledAt" <= now() THEN 'canceled'
       WHEN t."planEnd" IS NOT NULL THEN CASE WHEN t."planEnd" >= now() THEN 'active' ELSE 'past_due' END
       WHEN t."trialEnd" IS NOT NULL THEN CASE WHEN t."trialEnd" >= now() THEN 'trialing' ELSE 'past_due' END
       ELSE 'active' END AS estado_derivado,
  t.email AS org_email, t.phone AS org_phone, t."contactPhone", t.city, t."discoverySource",
  t."onboardingCompletedAt",
  (SELECT string_agg(p.role || ':' || coalesce(p.email, u.email) || ' tel=' || coalesce(u.phone, '-')
                     || ' last_login=' || coalesce(u.last_sign_in_at::text, 'nunca'), ' ; ')
     FROM public.profiles p LEFT JOIN auth.users u ON u.id::text = p."userId"
    WHERE p."organizationId" = t.id) AS usuarios,
  (SELECT count(*) FROM public.profiles p WHERE p."organizationId" = t.id) AS n_usuarios,
  (SELECT count(*) FROM public.patients x WHERE x."organizationId" = t.id) AS n_pacientes_clientes,
  (SELECT count(*) FROM public.appointments x WHERE x."organizationId" = t.id) AS n_citas,
  (SELECT count(*) FROM public.invoices x WHERE x."organizationId" = t.id) AS n_facturas_dental,
  (SELECT count(*) FROM public.onia_commerce_products x WHERE x."organizationId" = t.id) AS n_productos,
  (SELECT count(*) FROM public.onia_commerce_orders x WHERE x."organizationId" = t.id) AS n_ventas,
  (SELECT count(*) FROM public.onia_commerce_payments x WHERE x."organizationId" = t.id) AS n_cobros,
  (SELECT count(*) FROM public.subscription_payments x WHERE x."organizationId" = t.id) AS n_pagos_suscripcion,
  (SELECT string_agg(step::text || (CASE WHEN "sentOk" THEN 'ok' ELSE 'X' END), ',' ORDER BY step)
     FROM public.onia_trial_drip_sends d WHERE d."organizationId" = t.id) AS drip_enviado,
  (SELECT max(a."createdAt") FROM public.audit_logs a WHERE a."organizationId" = t.id) AS ultima_actividad_audit
FROM target t
ORDER BY t."trialEnd";

ROLLBACK;
