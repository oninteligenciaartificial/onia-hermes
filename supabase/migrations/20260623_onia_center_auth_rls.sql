-- ONIA Center authenticated RLS and role/rank policies.
-- Forward-only security layer. Keeps existing locked-by-default tables, then
-- opens only authenticated access that matches ONIA memberships and scopes.

grant usage on schema onia_center to authenticated;
grant select, insert, update, delete on all tables in schema onia_center to authenticated;
grant execute on all functions in schema onia_center to authenticated;

alter default privileges in schema onia_center
grant select, insert, update, delete on tables to authenticated;

alter default privileges in schema onia_center
grant execute on functions to authenticated;

create or replace function onia_center.normalize_role_key(input_role text)
returns text
language sql
immutable
as $$
  select case
    when input_role = 'area' then 'area_responsible'
    else input_role
  end;
$$;

create or replace function onia_center.current_user_key()
returns text
language sql
stable
security definer
set search_path = onia_center, auth, public
as $$
  select p.user_key
  from onia_center.user_profiles p
  where p.auth_user_id = auth.uid()
    and p.status = 'active'
  limit 1;
$$;

create or replace function onia_center.current_role_key()
returns text
language sql
stable
security definer
set search_path = onia_center, auth, public
as $$
  select p.primary_role_key
  from onia_center.user_profiles p
  where p.auth_user_id = auth.uid()
    and p.status = 'active'
  limit 1;
$$;

create or replace function onia_center.is_sergio()
returns boolean
language sql
stable
security definer
set search_path = onia_center, auth, public
as $$
  select coalesce(onia_center.current_role_key() = 'sergio', false);
$$;

create or replace function onia_center.can_read_visibility(scope text)
returns boolean
language sql
stable
security definer
set search_path = onia_center, auth, public
as $$
  select case
    when auth.uid() is null then false
    when onia_center.current_role_key() = 'sergio' then true
    when scope = 'sergio_private' then false
    when onia_center.current_role_key() = 'area_responsible'
      then scope in ('internal_restricted', 'collab_safe', 'seller_basic', 'freelancer_task', 'client_workspace')
    when onia_center.current_role_key() = 'arthur'
      then scope in ('internal_restricted', 'collab_safe', 'seller_basic')
    when onia_center.current_role_key() = 'seller'
      then scope in ('seller_basic', 'collab_safe')
    when onia_center.current_role_key() = 'freelancer'
      then scope = 'freelancer_task'
    else false
  end;
$$;

create or replace function onia_center.has_org_access(target_organization_key text)
returns boolean
language sql
stable
security definer
set search_path = onia_center, auth, public
as $$
  select onia_center.is_sergio()
    or exists (
      select 1
      from onia_center.organization_memberships m
      join onia_center.user_profiles p on p.user_key = m.user_key
      where p.auth_user_id = auth.uid()
        and p.status = 'active'
        and m.status = 'active'
        and m.organization_key = target_organization_key
    );
$$;

create or replace function onia_center.can_act_as_role(target_role text)
returns boolean
language sql
stable
security definer
set search_path = onia_center, auth, public
as $$
  select onia_center.is_sergio()
    or onia_center.normalize_role_key(target_role) = onia_center.current_role_key();
$$;

create or replace function onia_center.can_view_project(target_project_key text)
returns boolean
language sql
stable
security definer
set search_path = onia_center, auth, public
as $$
  select exists (
    select 1
    from onia_center.projects p
    where p.project_key = target_project_key
      and (
        onia_center.is_sergio()
        or (
          p.private_strategy = false
          and onia_center.has_org_access(p.organization_key)
        )
      )
  );
$$;

-- Base identity and org policies.
drop policy if exists onia_center_roles_read_authenticated on onia_center.roles;
create policy onia_center_roles_read_authenticated
on onia_center.roles for select to authenticated
using (onia_center.is_sergio() or role_key <> 'sergio');

drop policy if exists onia_center_profiles_read_self_or_sergio on onia_center.user_profiles;
create policy onia_center_profiles_read_self_or_sergio
on onia_center.user_profiles for select to authenticated
using (onia_center.is_sergio() or auth_user_id = auth.uid());

drop policy if exists onia_center_profiles_write_sergio on onia_center.user_profiles;
create policy onia_center_profiles_write_sergio
on onia_center.user_profiles for all to authenticated
using (onia_center.is_sergio())
with check (onia_center.is_sergio());

drop policy if exists onia_center_memberships_read_self_or_sergio on onia_center.organization_memberships;
create policy onia_center_memberships_read_self_or_sergio
on onia_center.organization_memberships for select to authenticated
using (onia_center.is_sergio() or user_key = onia_center.current_user_key());

drop policy if exists onia_center_memberships_write_sergio on onia_center.organization_memberships;
create policy onia_center_memberships_write_sergio
on onia_center.organization_memberships for all to authenticated
using (onia_center.is_sergio())
with check (onia_center.is_sergio());

drop policy if exists onia_center_organizations_read_member_scope on onia_center.organizations;
create policy onia_center_organizations_read_member_scope
on onia_center.organizations for select to authenticated
using (
  onia_center.is_sergio()
  or (
    onia_center.has_org_access(organization_key)
    and onia_center.can_read_visibility(visibility_scope)
  )
);

drop policy if exists onia_center_organizations_write_sergio on onia_center.organizations;
create policy onia_center_organizations_write_sergio
on onia_center.organizations for all to authenticated
using (onia_center.is_sergio())
with check (onia_center.is_sergio());

-- Client, project, task and collaboration policies.
drop policy if exists onia_center_clients_read_member_safe on onia_center.clients;
create policy onia_center_clients_read_member_safe
on onia_center.clients for select to authenticated
using (
  onia_center.is_sergio()
  or (
    onia_center.has_org_access(organization_key)
    and sensitivity = 'normal'
  )
  or (
    onia_center.can_act_as_role(owner_role_key)
    and sensitivity <> 'private'
  )
);

drop policy if exists onia_center_clients_write_sergio on onia_center.clients;
create policy onia_center_clients_write_sergio
on onia_center.clients for all to authenticated
using (onia_center.is_sergio())
with check (onia_center.is_sergio());

drop policy if exists onia_center_contacts_read_member_approved on onia_center.contacts;
create policy onia_center_contacts_read_member_approved
on onia_center.contacts for select to authenticated
using (
  onia_center.is_sergio()
  or (
    contact_permission = 'approved'
    and exists (
      select 1
      from onia_center.clients c
      where c.client_key = contacts.client_key
        and c.sensitivity = 'normal'
        and onia_center.has_org_access(c.organization_key)
    )
  )
);

drop policy if exists onia_center_contacts_write_sergio on onia_center.contacts;
create policy onia_center_contacts_write_sergio
on onia_center.contacts for all to authenticated
using (onia_center.is_sergio())
with check (onia_center.is_sergio());

drop policy if exists onia_center_projects_read_member_safe on onia_center.projects;
create policy onia_center_projects_read_member_safe
on onia_center.projects for select to authenticated
using (
  onia_center.is_sergio()
  or (
    private_strategy = false
    and onia_center.has_org_access(organization_key)
  )
);

drop policy if exists onia_center_projects_write_sergio on onia_center.projects;
create policy onia_center_projects_write_sergio
on onia_center.projects for all to authenticated
using (onia_center.is_sergio())
with check (onia_center.is_sergio());

drop policy if exists onia_center_project_modules_read_visible_project on onia_center.project_modules;
create policy onia_center_project_modules_read_visible_project
on onia_center.project_modules for select to authenticated
using (onia_center.is_sergio() or onia_center.can_view_project(project_key));

drop policy if exists onia_center_project_modules_write_sergio on onia_center.project_modules;
create policy onia_center_project_modules_write_sergio
on onia_center.project_modules for all to authenticated
using (onia_center.is_sergio())
with check (onia_center.is_sergio());

drop policy if exists onia_center_tasks_read_assigned_or_project on onia_center.tasks;
create policy onia_center_tasks_read_assigned_or_project
on onia_center.tasks for select to authenticated
using (
  onia_center.is_sergio()
  or onia_center.can_act_as_role(assigned_role_key)
  or onia_center.can_act_as_role(reviewer_role_key)
  or (sensitive = false and onia_center.can_view_project(project_key))
);

drop policy if exists onia_center_tasks_insert_assigned_or_sergio on onia_center.tasks;
create policy onia_center_tasks_insert_assigned_or_sergio
on onia_center.tasks for insert to authenticated
with check (
  onia_center.is_sergio()
  or (
    onia_center.can_act_as_role(assigned_role_key)
    and reviewer_role_key = 'sergio'
    and sensitive = false
  )
);

drop policy if exists onia_center_tasks_update_assigned_or_sergio on onia_center.tasks;
create policy onia_center_tasks_update_assigned_or_sergio
on onia_center.tasks for update to authenticated
using (onia_center.is_sergio() or onia_center.can_act_as_role(assigned_role_key))
with check (
  onia_center.is_sergio()
  or (
    onia_center.can_act_as_role(assigned_role_key)
    and reviewer_role_key = 'sergio'
    and status in ('todo', 'in_progress', 'review', 'blocked')
  )
);

drop policy if exists onia_center_task_events_read_visible_task on onia_center.task_events;
create policy onia_center_task_events_read_visible_task
on onia_center.task_events for select to authenticated
using (
  onia_center.is_sergio()
  or exists (
    select 1
    from onia_center.tasks t
    where t.task_key = task_events.task_key
      and (
        onia_center.can_act_as_role(t.assigned_role_key)
        or onia_center.can_act_as_role(t.reviewer_role_key)
        or (t.sensitive = false and onia_center.can_view_project(t.project_key))
      )
  )
);

drop policy if exists onia_center_task_events_insert_actor on onia_center.task_events;
create policy onia_center_task_events_insert_actor
on onia_center.task_events for insert to authenticated
with check (onia_center.can_act_as_role(actor_role_key));

drop policy if exists onia_center_collaborators_read_self_or_sergio on onia_center.collaborators;
create policy onia_center_collaborators_read_self_or_sergio
on onia_center.collaborators for select to authenticated
using (onia_center.is_sergio() or user_key = onia_center.current_user_key());

drop policy if exists onia_center_collaborators_write_sergio on onia_center.collaborators;
create policy onia_center_collaborators_write_sergio
on onia_center.collaborators for all to authenticated
using (onia_center.is_sergio())
with check (onia_center.is_sergio());

drop policy if exists onia_center_deliverables_read_owner_or_sergio on onia_center.deliverables;
create policy onia_center_deliverables_read_owner_or_sergio
on onia_center.deliverables for select to authenticated
using (
  onia_center.is_sergio()
  or exists (
    select 1
    from onia_center.collaborators c
    where c.collaborator_key = deliverables.collaborator_key
      and c.user_key = onia_center.current_user_key()
  )
);

drop policy if exists onia_center_deliverables_insert_owner_or_sergio on onia_center.deliverables;
create policy onia_center_deliverables_insert_owner_or_sergio
on onia_center.deliverables for insert to authenticated
with check (
  onia_center.is_sergio()
  or (
    status <> 'approved'
    and exists (
      select 1
      from onia_center.collaborators c
      where c.collaborator_key = deliverables.collaborator_key
        and c.user_key = onia_center.current_user_key()
    )
  )
);

drop policy if exists onia_center_deliverables_update_owner_or_sergio on onia_center.deliverables;
create policy onia_center_deliverables_update_owner_or_sergio
on onia_center.deliverables for update to authenticated
using (
  onia_center.is_sergio()
  or exists (
    select 1
    from onia_center.collaborators c
    where c.collaborator_key = deliverables.collaborator_key
      and c.user_key = onia_center.current_user_key()
  )
)
with check (
  onia_center.is_sergio()
  or (
    status <> 'approved'
    and reviewed_by_role_key is null
  )
);

drop policy if exists onia_center_collab_ingestion_read_author_or_sergio on onia_center.collab_ingestion_items;
create policy onia_center_collab_ingestion_read_author_or_sergio
on onia_center.collab_ingestion_items for select to authenticated
using (
  onia_center.is_sergio()
  or (
    author_user_key = onia_center.current_user_key()
    and sensitivity in ('public_safe', 'internal')
  )
);

drop policy if exists onia_center_collab_ingestion_insert_author on onia_center.collab_ingestion_items;
create policy onia_center_collab_ingestion_insert_author
on onia_center.collab_ingestion_items for insert to authenticated
with check (
  onia_center.is_sergio()
  or (
    author_user_key = onia_center.current_user_key()
    and status = 'queued'
    and sensitivity in ('public_safe', 'internal')
  )
);

drop policy if exists onia_center_collab_ingestion_update_sergio on onia_center.collab_ingestion_items;
create policy onia_center_collab_ingestion_update_sergio
on onia_center.collab_ingestion_items for update to authenticated
using (onia_center.is_sergio())
with check (onia_center.is_sergio());

drop policy if exists onia_center_review_queue_read_reviewer on onia_center.review_queue;
create policy onia_center_review_queue_read_reviewer
on onia_center.review_queue for select to authenticated
using (
  onia_center.is_sergio()
  or (
    sensitive = false
    and onia_center.can_act_as_role(reviewer_role_key)
  )
);

drop policy if exists onia_center_review_queue_write_sergio on onia_center.review_queue;
create policy onia_center_review_queue_write_sergio
on onia_center.review_queue for all to authenticated
using (onia_center.is_sergio())
with check (onia_center.is_sergio());

-- Knowledge, content, inventory and adapters.
drop policy if exists onia_center_knowledge_read_scope on onia_center.knowledge_items;
create policy onia_center_knowledge_read_scope
on onia_center.knowledge_items for select to authenticated
using (
  onia_center.is_sergio()
  or (
    onia_center.has_org_access(organization_key)
    and onia_center.can_read_visibility(sensitivity_scope)
  )
);

drop policy if exists onia_center_knowledge_write_sergio on onia_center.knowledge_items;
create policy onia_center_knowledge_write_sergio
on onia_center.knowledge_items for all to authenticated
using (onia_center.is_sergio())
with check (onia_center.is_sergio());

drop policy if exists onia_center_content_read_public_or_project on onia_center.content_assets;
create policy onia_center_content_read_public_or_project
on onia_center.content_assets for select to authenticated
using (
  onia_center.is_sergio()
  or public_safe = true
  or onia_center.can_view_project(project_key)
);

drop policy if exists onia_center_content_write_sergio on onia_center.content_assets;
create policy onia_center_content_write_sergio
on onia_center.content_assets for all to authenticated
using (onia_center.is_sergio())
with check (onia_center.is_sergio());

drop policy if exists onia_center_inventory_read_org on onia_center.inventory_items;
create policy onia_center_inventory_read_org
on onia_center.inventory_items for select to authenticated
using (onia_center.is_sergio() or onia_center.has_org_access(organization_key));

drop policy if exists onia_center_inventory_write_sergio on onia_center.inventory_items;
create policy onia_center_inventory_write_sergio
on onia_center.inventory_items for all to authenticated
using (onia_center.is_sergio())
with check (onia_center.is_sergio());

drop policy if exists onia_center_inventory_events_read_org on onia_center.inventory_events;
create policy onia_center_inventory_events_read_org
on onia_center.inventory_events for select to authenticated
using (
  onia_center.is_sergio()
  or (
    sensitive = false
    and exists (
      select 1
      from onia_center.inventory_items i
      where i.inventory_key = inventory_events.inventory_key
        and onia_center.has_org_access(i.organization_key)
    )
  )
);

drop policy if exists onia_center_inventory_events_write_sergio on onia_center.inventory_events;
create policy onia_center_inventory_events_write_sergio
on onia_center.inventory_events for all to authenticated
using (onia_center.is_sergio())
with check (onia_center.is_sergio());

drop policy if exists onia_center_adapters_read_visible on onia_center.external_adapters;
create policy onia_center_adapters_read_visible
on onia_center.external_adapters for select to authenticated
using (
  onia_center.is_sergio()
  or (
    write_allowed = false
    and (
      organization_key is null
      or onia_center.has_org_access(organization_key)
    )
    and (
      project_key is null
      or onia_center.can_view_project(project_key)
    )
  )
);

drop policy if exists onia_center_adapters_write_sergio on onia_center.external_adapters;
create policy onia_center_adapters_write_sergio
on onia_center.external_adapters for all to authenticated
using (onia_center.is_sergio())
with check (onia_center.is_sergio());

drop policy if exists onia_center_adapter_events_read_visible on onia_center.adapter_events;
create policy onia_center_adapter_events_read_visible
on onia_center.adapter_events for select to authenticated
using (
  onia_center.is_sergio()
  or sensitive = false
);

drop policy if exists onia_center_adapter_events_write_sergio on onia_center.adapter_events;
create policy onia_center_adapter_events_write_sergio
on onia_center.adapter_events for all to authenticated
using (onia_center.is_sergio())
with check (onia_center.is_sergio());

drop policy if exists onia_center_audit_read_actor_or_sergio on onia_center.audit_logs;
create policy onia_center_audit_read_actor_or_sergio
on onia_center.audit_logs for select to authenticated
using (
  onia_center.is_sergio()
  or (
    actor_user_key = onia_center.current_user_key()
    and sensitivity_scope <> 'sergio_private'
  )
  or (
    actor_user_key is null
    and onia_center.can_act_as_role(actor_role_key)
    and sensitivity_scope <> 'sergio_private'
  )
);

drop policy if exists onia_center_audit_insert_actor on onia_center.audit_logs;
create policy onia_center_audit_insert_actor
on onia_center.audit_logs for insert to authenticated
with check (
  onia_center.is_sergio()
  or (
    actor_user_key = onia_center.current_user_key()
    and onia_center.can_act_as_role(actor_role_key)
    and sensitivity_scope <> 'sergio_private'
  )
);

-- Financial, sales, evidence and premium policies.
drop policy if exists onia_center_centers_read_role_safe on onia_center.accounting_centers;
create policy onia_center_centers_read_role_safe
on onia_center.accounting_centers for select to authenticated
using (
  onia_center.is_sergio()
  or center_key in ('onia_services', 'onia_media', 'arthur_variable')
  or visibility_scope = 'seller_basic'
);

drop policy if exists onia_center_centers_write_sergio on onia_center.accounting_centers;
create policy onia_center_centers_write_sergio
on onia_center.accounting_centers for all to authenticated
using (onia_center.is_sergio())
with check (onia_center.is_sergio());

drop policy if exists onia_center_services_read_sellable on onia_center.services;
create policy onia_center_services_read_sellable
on onia_center.services for select to authenticated
using (onia_center.is_sergio() or status = 'sellable');

drop policy if exists onia_center_services_write_sergio on onia_center.services;
create policy onia_center_services_write_sergio
on onia_center.services for all to authenticated
using (onia_center.is_sergio())
with check (onia_center.is_sergio());

drop policy if exists onia_center_leads_read_owner_or_sergio on onia_center.leads;
create policy onia_center_leads_read_owner_or_sergio
on onia_center.leads for select to authenticated
using (
  onia_center.is_sergio()
  or onia_center.can_act_as_role(owner_role_key)
  or onia_center.can_act_as_role(origin_role_key)
);

drop policy if exists onia_center_leads_insert_owner_or_sergio on onia_center.leads;
create policy onia_center_leads_insert_owner_or_sergio
on onia_center.leads for insert to authenticated
with check (
  onia_center.is_sergio()
  or (
    onia_center.can_act_as_role(owner_role_key)
    and onia_center.can_act_as_role(origin_role_key)
    and contact_permission in ('approved', 'pending', 'no_contact')
  )
);

drop policy if exists onia_center_leads_update_owner_or_sergio on onia_center.leads;
create policy onia_center_leads_update_owner_or_sergio
on onia_center.leads for update to authenticated
using (
  onia_center.is_sergio()
  or onia_center.can_act_as_role(owner_role_key)
)
with check (
  onia_center.is_sergio()
  or onia_center.can_act_as_role(owner_role_key)
);

drop policy if exists onia_center_evidence_read_actor_or_sergio on onia_center.evidence_items;
create policy onia_center_evidence_read_actor_or_sergio
on onia_center.evidence_items for select to authenticated
using (onia_center.is_sergio() or onia_center.can_act_as_role(actor_role_key));

drop policy if exists onia_center_evidence_insert_actor on onia_center.evidence_items;
create policy onia_center_evidence_insert_actor
on onia_center.evidence_items for insert to authenticated
with check (
  onia_center.can_act_as_role(actor_role_key)
  and status in ('pending', 'retained')
);

drop policy if exists onia_center_evidence_update_sergio_or_pending_actor on onia_center.evidence_items;
create policy onia_center_evidence_update_sergio_or_pending_actor
on onia_center.evidence_items for update to authenticated
using (onia_center.is_sergio() or onia_center.can_act_as_role(actor_role_key))
with check (
  onia_center.is_sergio()
  or (
    onia_center.can_act_as_role(actor_role_key)
    and status in ('pending', 'retained')
    and approved_by_role_key is null
  )
);

drop policy if exists onia_center_income_read_seller_or_sergio on onia_center.income_entries;
create policy onia_center_income_read_seller_or_sergio
on onia_center.income_entries for select to authenticated
using (onia_center.is_sergio() or onia_center.can_act_as_role(seller_role_key));

drop policy if exists onia_center_income_write_sergio on onia_center.income_entries;
create policy onia_center_income_write_sergio
on onia_center.income_entries for all to authenticated
using (onia_center.is_sergio())
with check (onia_center.is_sergio());

drop policy if exists onia_center_expenses_read_owner_or_sergio on onia_center.expense_entries;
create policy onia_center_expenses_read_owner_or_sergio
on onia_center.expense_entries for select to authenticated
using (onia_center.is_sergio() or onia_center.can_act_as_role(owner_role_key));

drop policy if exists onia_center_expenses_insert_owner_pending on onia_center.expense_entries;
create policy onia_center_expenses_insert_owner_pending
on onia_center.expense_entries for insert to authenticated
with check (
  onia_center.can_act_as_role(owner_role_key)
  and status = 'pending'
  and approved_by_role_key is null
);

drop policy if exists onia_center_expenses_update_sergio_or_owner_pending on onia_center.expense_entries;
create policy onia_center_expenses_update_sergio_or_owner_pending
on onia_center.expense_entries for update to authenticated
using (onia_center.is_sergio() or onia_center.can_act_as_role(owner_role_key))
with check (
  onia_center.is_sergio()
  or (
    onia_center.can_act_as_role(owner_role_key)
    and status = 'pending'
    and approved_by_role_key is null
  )
);

drop policy if exists onia_center_scorecards_read_actor_or_sergio on onia_center.scorecards;
create policy onia_center_scorecards_read_actor_or_sergio
on onia_center.scorecards for select to authenticated
using (onia_center.is_sergio() or onia_center.can_act_as_role(actor_role_key));

drop policy if exists onia_center_scorecards_write_sergio on onia_center.scorecards;
create policy onia_center_scorecards_write_sergio
on onia_center.scorecards for all to authenticated
using (onia_center.is_sergio())
with check (onia_center.is_sergio());

drop policy if exists onia_center_scorecard_items_read_parent on onia_center.scorecard_items;
create policy onia_center_scorecard_items_read_parent
on onia_center.scorecard_items for select to authenticated
using (
  onia_center.is_sergio()
  or exists (
    select 1
    from onia_center.scorecards s
    where s.scorecard_key = scorecard_items.scorecard_key
      and onia_center.can_act_as_role(s.actor_role_key)
  )
);

drop policy if exists onia_center_scorecard_items_write_sergio on onia_center.scorecard_items;
create policy onia_center_scorecard_items_write_sergio
on onia_center.scorecard_items for all to authenticated
using (onia_center.is_sergio())
with check (onia_center.is_sergio());

drop policy if exists onia_center_payments_read_actor_or_sergio on onia_center.payment_commissions;
create policy onia_center_payments_read_actor_or_sergio
on onia_center.payment_commissions for select to authenticated
using (onia_center.is_sergio() or onia_center.can_act_as_role(actor_role_key));

drop policy if exists onia_center_payments_write_sergio on onia_center.payment_commissions;
create policy onia_center_payments_write_sergio
on onia_center.payment_commissions for all to authenticated
using (onia_center.is_sergio())
with check (onia_center.is_sergio());

drop policy if exists onia_center_nuvia_lots_sergio_only on onia_center.nuvia_lots;
create policy onia_center_nuvia_lots_sergio_only
on onia_center.nuvia_lots for all to authenticated
using (onia_center.is_sergio())
with check (onia_center.is_sergio());

drop policy if exists onia_center_premium_read_actor_or_sergio on onia_center.premium_tool_usage;
create policy onia_center_premium_read_actor_or_sergio
on onia_center.premium_tool_usage for select to authenticated
using (onia_center.is_sergio() or onia_center.can_act_as_role(actor_role_key));

drop policy if exists onia_center_premium_insert_actor_pending on onia_center.premium_tool_usage;
create policy onia_center_premium_insert_actor_pending
on onia_center.premium_tool_usage for insert to authenticated
with check (
  onia_center.can_act_as_role(actor_role_key)
  and status = 'pending'
  and approved_by_role_key is null
);

drop policy if exists onia_center_premium_update_sergio_or_actor_pending on onia_center.premium_tool_usage;
create policy onia_center_premium_update_sergio_or_actor_pending
on onia_center.premium_tool_usage for update to authenticated
using (onia_center.is_sergio() or onia_center.can_act_as_role(actor_role_key))
with check (
  onia_center.is_sergio()
  or (
    onia_center.can_act_as_role(actor_role_key)
    and status = 'pending'
    and approved_by_role_key is null
  )
);

-- Ideas, access policy and private Sergio calendar.
drop policy if exists onia_center_ideas_read_scope on onia_center.idea_inbox;
create policy onia_center_ideas_read_scope
on onia_center.idea_inbox for select to authenticated
using (
  onia_center.is_sergio()
  or visibility_scope = 'team_safe'
  or (
    visibility_scope = 'assigned_only'
    and onia_center.can_act_as_role(owner_role_key)
  )
);

drop policy if exists onia_center_ideas_insert_actor on onia_center.idea_inbox;
create policy onia_center_ideas_insert_actor
on onia_center.idea_inbox for insert to authenticated
with check (
  onia_center.can_act_as_role(created_by_role_key)
  and onia_center.can_act_as_role(owner_role_key)
  and (
    onia_center.is_sergio()
    or visibility_scope in ('assigned_only', 'team_safe')
  )
);

drop policy if exists onia_center_ideas_update_owner_or_sergio on onia_center.idea_inbox;
create policy onia_center_ideas_update_owner_or_sergio
on onia_center.idea_inbox for update to authenticated
using (onia_center.is_sergio() or onia_center.can_act_as_role(owner_role_key))
with check (
  onia_center.is_sergio()
  or (
    onia_center.can_act_as_role(owner_role_key)
    and status in ('inbox', 'queued', 'reviewed', 'archived')
    and reviewed_by_role_key is null
  )
);

drop policy if exists onia_center_access_policies_read_role on onia_center.access_policies;
create policy onia_center_access_policies_read_role
on onia_center.access_policies for select to authenticated
using (onia_center.is_sergio() or onia_center.can_act_as_role(role_key));

drop policy if exists onia_center_access_policies_write_sergio on onia_center.access_policies;
create policy onia_center_access_policies_write_sergio
on onia_center.access_policies for all to authenticated
using (onia_center.is_sergio())
with check (onia_center.is_sergio());

drop policy if exists onia_center_sergio_schedule_sergio_only on onia_center.sergio_schedule_blocks;
create policy onia_center_sergio_schedule_sergio_only
on onia_center.sergio_schedule_blocks for all to authenticated
using (onia_center.is_sergio())
with check (onia_center.is_sergio());

drop policy if exists onia_center_sergio_windows_sergio_only on onia_center.sergio_meeting_windows;
create policy onia_center_sergio_windows_sergio_only
on onia_center.sergio_meeting_windows for all to authenticated
using (onia_center.is_sergio())
with check (onia_center.is_sergio());

drop policy if exists onia_center_sergio_commands_sergio_only on onia_center.sergio_assistant_commands;
create policy onia_center_sergio_commands_sergio_only
on onia_center.sergio_assistant_commands for all to authenticated
using (onia_center.is_sergio())
with check (onia_center.is_sergio());

drop policy if exists onia_center_personal_automation_sergio_only on onia_center.personal_automation_rules;
create policy onia_center_personal_automation_sergio_only
on onia_center.personal_automation_rules for all to authenticated
using (onia_center.is_sergio())
with check (onia_center.is_sergio());

-- Integration readiness and operating agents.
drop policy if exists onia_center_connectors_read_scope on onia_center.integration_connectors;
create policy onia_center_connectors_read_scope
on onia_center.integration_connectors for select to authenticated
using (
  onia_center.is_sergio()
  or (
    visibility_scope <> 'sergio_private'
    and onia_center.can_read_visibility(visibility_scope)
  )
);

drop policy if exists onia_center_connectors_write_sergio on onia_center.integration_connectors;
create policy onia_center_connectors_write_sergio
on onia_center.integration_connectors for all to authenticated
using (onia_center.is_sergio())
with check (onia_center.is_sergio());

drop policy if exists onia_center_feature_readiness_read_scope on onia_center.feature_readiness_items;
create policy onia_center_feature_readiness_read_scope
on onia_center.feature_readiness_items for select to authenticated
using (
  onia_center.is_sergio()
  or (
    private_only = false
    and onia_center.can_act_as_role(owner_role_key)
  )
);

drop policy if exists onia_center_feature_readiness_write_sergio on onia_center.feature_readiness_items;
create policy onia_center_feature_readiness_write_sergio
on onia_center.feature_readiness_items for all to authenticated
using (onia_center.is_sergio())
with check (onia_center.is_sergio());

drop policy if exists onia_center_agents_read_scope on onia_center.operating_agents;
create policy onia_center_agents_read_scope
on onia_center.operating_agents for select to authenticated
using (
  onia_center.is_sergio()
  or (
    visibility_scope <> 'sergio_private'
    and onia_center.can_read_visibility(visibility_scope)
  )
);

drop policy if exists onia_center_agents_write_sergio on onia_center.operating_agents;
create policy onia_center_agents_write_sergio
on onia_center.operating_agents for all to authenticated
using (onia_center.is_sergio())
with check (onia_center.is_sergio());

drop policy if exists onia_center_agent_plans_read_scope on onia_center.agent_monthly_plans;
create policy onia_center_agent_plans_read_scope
on onia_center.agent_monthly_plans for select to authenticated
using (
  onia_center.is_sergio()
  or exists (
    select 1
    from jsonb_array_elements_text(visible_to) as visible_scope(scope)
    where visible_scope.scope <> 'sergio_private'
      and onia_center.can_read_visibility(visible_scope.scope)
  )
);

drop policy if exists onia_center_agent_plans_write_sergio on onia_center.agent_monthly_plans;
create policy onia_center_agent_plans_write_sergio
on onia_center.agent_monthly_plans for all to authenticated
using (onia_center.is_sergio())
with check (onia_center.is_sergio());

drop policy if exists onia_center_calendar_connectors_sergio_only on onia_center.calendar_connector_plans;
create policy onia_center_calendar_connectors_sergio_only
on onia_center.calendar_connector_plans for all to authenticated
using (onia_center.is_sergio())
with check (onia_center.is_sergio());

comment on function onia_center.current_user_key() is
  'ONIA Center Auth helper: maps Supabase auth.uid() to onia_center.user_profiles.user_key.';

comment on function onia_center.can_read_visibility(text) is
  'ONIA Center rank gate. Sergio sees all; Arthur/sellers/freelancers only see their allowed visibility scopes.';
