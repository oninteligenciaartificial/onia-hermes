# Skill: seguimiento-prospectos-onia

## Cuando usar
Cuando un prospecto ya fue contactado (con aprobacion) y hay que sostener el
seguimiento hasta cerrar, agendar o descartar. Complementa a
`prospeccion-onia` (que encuentra) y a `propuestas-comerciales-onia` (que
vende): esta skill cubre el medio, donde se pierden la mayoria de ventas.

## Comandos
- `Seguimiento ONIA` — estado de todos los prospectos activos con proxima accion.
- `Seguimiento: <empresa>` — historial y proxima accion de un prospecto.
- `Actualiza prospecto: <empresa> | <nuevo estado o nota>` — registrar avance.

## Estados del pipeline
```text
nuevo -> contactado -> en_conversacion -> reunion_agendada_pendiente
      -> propuesta_enviada -> negociacion -> cerrado_ganado / cerrado_perdido
      -> dormido (sin respuesta, reintentar mas adelante)
```
- Todo prospecto guardado por `prospeccion-onia` entra como `nuevo`.
- `reunion_agendada_pendiente`: una reunion sin prospecto registrado no cuenta (ver `agenda-calendario`).
- `cerrado_perdido` y `dormido` siempre con motivo anotado.

## Cadencia de seguimiento
- `contactado` sin respuesta: tocar a los 3 dias, luego a los 7. Tras 2 toques
  sin respuesta -> `dormido` (reintentar en 30-45 dias con angulo nuevo).
- `en_conversacion`: nunca dejar pasar mas de 2 dias habiles sin responder.
- `propuesta_enviada`: seguimiento a las 48h, luego a los 5 dias.
- `negociacion`: proxima accion SIEMPRE con fecha; sin fecha no hay negociacion.
- Cada toque aporta valor (dato util, caso, respuesta a su dolor), nunca solo
  "para hacer seguimiento". Los mensajes al prospecto van de usted.

## Reglas
- Todo mensaje nuevo a un prospecto sigue requiriendo aprobacion de Sergio
  (`Apruebo contactar: <empresa>` cubre la conversacion iniciada; un canal
  nuevo o un reinicio tras `dormido` requiere nueva aprobacion).
- WhatsApp automatico bloqueado hasta verificacion Meta: los seguimientos por
  WhatsApp los envia un humano.
- No inventar avances: si no hubo respuesta, el estado no cambia.
- Registrar cada toque con fecha, canal y resultado.

## Formato de respuesta

### Vista pipeline (`Seguimiento ONIA`)
```text
Pipeline ONIA ([fecha]):

EN NEGOCIACION
- [Empresa] | ultima accion [fecha] | proxima: [accion] [fecha]

PROPUESTA ENVIADA
- ...

EN CONVERSACION / CONTACTADOS
- ...

ATRASADOS (accion vencida)
- [Empresa] | vencio [fecha] | accion pendiente

Resumen: X activos, Y atrasados, Z dormidos.
Siguiente comando sugerido: [comando exacto]
```

### Vista prospecto (`Seguimiento: <empresa>`)
- Estado actual y desde cuando.
- Historial de toques (fecha, canal, resultado).
- Dolor principal y producto ONIA que encaja.
- Proxima accion con fecha y borrador de mensaje si aplica.
- Aprobacion necesaria (texto literal) o `ninguna`.

## Integraciones
- Reportes de pipeline y alertas de atrasados van a Sergio Urcullo
  por Telegram.
- `reunion_agendada_pendiente` se gestiona con `agenda-calendario`.
- Al pasar a `propuesta_enviada`, la propuesta se genera solo con el sistema de
  `propuestas-comerciales-onia` (nunca HTML a mano).
