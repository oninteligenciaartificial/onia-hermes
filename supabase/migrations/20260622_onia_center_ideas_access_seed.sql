-- ONIA Center access policy seed.
-- No fake ideas are inserted; ideas must come from real saved references.

insert into onia_center.access_policies (
  policy_key,
  role_key,
  entity_type,
  visible_scopes,
  can_create,
  can_update_assigned,
  can_approve,
  operating_rule
) values
  (
    'access-sergio-idea-all',
    'sergio',
    'idea',
    '["sergio_private", "assigned_only", "team_safe"]'::jsonb,
    true,
    true,
    true,
    'Sergio ve todas las ideas, aprueba importaciones y audita actividad del equipo.'
  ),
  (
    'access-arthur-idea-assigned',
    'arthur',
    'idea',
    '["assigned_only", "team_safe"]'::jsonb,
    true,
    true,
    false,
    'Arthur crea y trabaja ideas asignadas o seguras; no ve ideas privadas Sergio.'
  ),
  (
    'access-seller-idea-basic',
    'seller',
    'idea',
    '["assigned_only", "team_safe"]'::jsonb,
    true,
    true,
    false,
    'Vendedor solo ve ideas comerciales necesarias para vender o prospectar.'
  ),
  (
    'access-freelancer-idea-task',
    'freelancer',
    'idea',
    '["assigned_only"]'::jsonb,
    false,
    true,
    false,
    'Freelancer ve solo ideas asignadas a un entregable concreto.'
  ),
  (
    'access-arthur-finance-blocked',
    'arthur',
    'finance',
    '[]'::jsonb,
    false,
    false,
    false,
    'Arthur no ve capital Sergio, deuda exacta, caja real completa ni utilidad interna.'
  ),
  (
    'access-seller-finance-blocked',
    'seller',
    'finance',
    '[]'::jsonb,
    false,
    false,
    false,
    'Vendedor no ve datos privados ni utilidad interna.'
  )
on conflict (policy_key) do update set
  visible_scopes = excluded.visible_scopes,
  can_create = excluded.can_create,
  can_update_assigned = excluded.can_update_assigned,
  can_approve = excluded.can_approve,
  operating_rule = excluded.operating_rule,
  updated_at = now();
