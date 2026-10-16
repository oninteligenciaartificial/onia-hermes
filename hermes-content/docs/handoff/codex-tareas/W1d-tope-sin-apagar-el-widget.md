# W1d · Los topes de W1c no se pueden usar para apagar el widget de una clínica (antes de publicar #140)

Sos Codex. SOLO `onia-platform`, rama `integ/w1-w1b` (onia-platform#140). `git branch --show-current` primero.

## META
Revisión de Plataforma (9-oct) sobre W1c (`737e4bd1`): los topes por organización (600/h) y por conversación
(30/10 min) se descuentan ANTES de que Chatwoot confirme que el `source_id` y la conversación son de verdad
(`app/api/chat-publico/[...ruta]/route.ts`, bloque «Cupos compartidos por tenant»). Con el tope por IP en 60/min,
**una sola IP** manda 600 POST con un `source_id` inventado en 10 minutos: Chatwoot los rechaza (404), pero el cupo de
la clínica ya se gastó y su widget contesta 429 a los visitantes reales durante una hora. Y con el id de una
conversación (números chicos, se adivinan) se le traba esa conversación a un visitante real.

## Lo que se hace
- La clave del tope por conversación incluye el `source_id`: `${organizationId}:${ruta[4]}:${ruta[6]}`. Un
  `source_id` inventado gasta su propio balde, nunca el del visitante real.
- El tope por organización cuenta SOLO los mensajes que Chatwoot aceptó: antes de mandar, se consulta sin descontar
  (si no queda cupo, 429 como hoy); después de una respuesta 2xx de Chatwoot, recién ahí se descuenta. Un pedido que
  Chatwoot rechaza no gasta cupo. Se acepta un desborde chico por pedidos simultáneos (anotarlo en el comentario).
- Si Redis falla en cualquiera de los dos pasos, sigue fallando cerrado (429), como `limitCerrado`.

## PRUEBA DE HECHO
- Test: 700 POST con `source_id` falso (Chatwoot responde 404) no gastan el cupo de la organización; un visitante
  real manda su mensaje después y pasa.
- Test: 31 mensajes del visitante real en su conversación dan 429 en el 31; 31 con un `source_id` falso en el mismo
  número de conversación no le afectan al real.
- Test: con el cupo de la organización agotado por mensajes ACEPTADOS, el siguiente da 429 con `Retry-After`.
- `npx tsc --noEmit` 0 · eslint de lo tocado 0 · `npx vitest run` COMPLETO en verde, con números reales.

## REGLA DE PARADA
Sin infraestructura, producción ni migraciones. No cambies el widget ni los textos.
