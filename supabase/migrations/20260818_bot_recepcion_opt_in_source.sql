-- MODO RECEPCIONISTA (bot de un CLIENTE de Onia): el primer inbound atendido es el opt-in del
-- contacto y se registra como 'inbound_recepcion'. El CHECK original (20260725) solo conocia el
-- funnel de venta ('inbound_demo' | 'explicit_consent') y hacia fallar saveConversation ENTERO
-- con 23514 — la conversacion del cliente no persistia ni el handoff (descubierto en el E2E del
-- widget de la ferreteria, 2026-08-18). Aplicado a mano en prod ese mismo dia.
alter table onia_center.bot_conversations
  drop constraint bot_conversations_opt_in_source_check;

alter table onia_center.bot_conversations
  add constraint bot_conversations_opt_in_source_check
  check (opt_in_source in ('inbound_demo', 'explicit_consent', 'inbound_recepcion'));
