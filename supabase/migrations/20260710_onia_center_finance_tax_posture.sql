-- ONIA Center — Postura fiscal en finance_summary (ADITIVO, no rompe el contrato actual).
-- Agrega SOLO la columna tax_posture jsonb. El Agente Finanzas (finance-fund-agent.mjs) la llena
-- con la estimacion fiscal del mes (IVA a pagar / saldo a favor, IT, IUE estimado, credito fiscal
-- perdido, retenciones IUE-BE por pagos al exterior). READ-ONLY / estimacion (validar con contador).
-- Contrato: hermes-content/docs/ONIA_FINANCE_SUMMARY_CONTRACT.md (seccion "Postura fiscal").
-- Aplicado 2026-07-10 en la DB onia_center (contenedor supabase-db).

alter table onia_center.finance_summary
  add column if not exists tax_posture jsonb not null default '{}'::jsonb;

notify pgrst, 'reload schema';
