-- ONIA — `bot_messages.delivery_status` acepta 'reserved'.
--
-- POR QUE: el barrido del recordatorio (M9, reminder-run.mjs) escribe la fila ANTES de mandar —
-- ahi la reserva ES el insert, asi que el estado honesto es 'reserved', no 'sent' (que seria mentir
-- si el envio falla despues). El CHECK original no lo contemplaba, y `buildMessageRow` degradaba
-- el valor desconocido A SILENCIO: lo convertia en 'simulated'. Resultado: todo recordatorio
-- utility REAL se guardaba como simulacion, y el medidor de mensajes — que solo cuenta lo que
-- salio — no lo veia. Se pagaba a Meta un mensaje que nuestra base decia que nunca ocurrio.
--
-- Se descubrio al construir el medidor (2026-08-13), no leyendo el codigo: el bug no rompe nada
-- visible, solo hace que la cuenta de menos.
--
-- Ampliar un CHECK no toca ninguna fila existente: los cuatro valores viejos siguen siendo validos.
alter table onia_center.bot_messages
  drop constraint if exists bot_messages_delivery_status_check;

alter table onia_center.bot_messages
  add constraint bot_messages_delivery_status_check
  check (delivery_status in ('simulated', 'skipped', 'sent', 'failed', 'reserved'));
