---
name: agenda-calendario
description: Ver, agendar, mover o cancelar eventos del calendario personal de Sergio Urcullo, buscarle huecos y reubicar lo que quedó pendiente. Usala también cuando conteste al cierre del día con números («2 no», «1 y 3 no», «todo sí»).
---

# Agenda de Sergio Urcullo

> Reescrita el 2026-09-30. Sergio Urcullo: *"acomodar mi calendario… no lo quiero hacer
> manualmente"* y *"eso del calendario lo voy acomodando contigo durante los días… si queda algún
> pendiente se le encuentra un espacio en la agenda"*. La versión anterior mandaba `agendar` a un
> webhook que creaba los eventos en el calendario de ONIA (vacío desde el 12-ago), no en el suyo,
> y hablaba de una vendedora que no existe.

## De dónde sale

Su calendario es el PERSONAL (`sergio.urcullo.m@gmail.com`). Se lee y se cambia **solo** con
`/root/bin/onia-agenda.sh`, desde tu terminal. Si un evento no lo devolvió ese comando, no existe:
no lo inventes ni lo completes de memoria.

| Para | Comando |
|---|---|
| Su día (lo que importa) | `/root/bin/onia-agenda.sh [AAAA-MM-DD]` |
| El día entero, con ids | `/root/bin/onia-agenda.sh --ids [AAAA-MM-DD]` |
| Huecos libres | `/root/bin/onia-agenda.sh huecos AAAA-MM-DD <minutos>` |
| Agendar | `/root/bin/onia-agenda.sh crear AAAA-MM-DD HH:MM HH:MM <título>` |
| Mover | `/root/bin/onia-agenda.sh mover <id> AAAA-MM-DD HH:MM HH:MM` |
| Cancelar | `/root/bin/onia-agenda.sh cancelar <id>` |

Fechas y horas, siempre de La Paz (UTC−4). «Mañana», «el jueves», «a las 5 de la tarde»: las
convertís vos. Si hay dos lecturas posibles («a las 5» = 05:00 o 17:00), preguntás. Sin hora de
fin, 1 hora, y se lo decís. Para mover o cancelar necesitás el id: sacalo de `--ids` del día.

## 🔴 La regla que no se rompe: primero se le muestra, después se hace

1. Corré el comando **sin** `--si`. No cambia nada: devuelve «Esto haría: …» y, si choca con
   algo, «⚠️ choca con: …». Sale con código 3, y eso es lo esperado.
2. Mandale a Sergio Urcullo esa línea tal cual, y preguntale «¿Lo hago?».
3. **Solo** si contesta que sí a ESE cambio (sí, dale, ok, hacelo), corré el MISMO comando con
   `--si` al final, y mandale la línea ✅ que devuelve.

- Si dice que no, o cambia algo, volvé al paso 1 con lo nuevo.
- Nunca `--si` en el primer intento, nunca por tu cuenta, nunca «para ahorrar un mensaje».
- Varios cambios: una sola vista previa con todos, y su sí vale para ese lote exacto.

## Bloques protegidos

Colegio, 🔒 (trabajo profundo, celular fuera), 🎬 (grabación), todo lo «sin celular», y dormir.
No propongas nada encima de ellos. Si él pide algo que choca, mostrale el choque y que decida él.

## El cierre de las 21:30: «¿se hicieron?»

El cierre le numera sus bloques de ONIA del día y le pregunta cuáles se hicieron. Si contesta
con números:

- Leé `/var/lib/onia-aviso/cierre-bloques.tsv` (fecha, número, id, inicio, fin, título). Si la
  fecha no es la de hoy en La Paz, decile que no tenés el cierre de hoy y preguntale cuál.
- «todo sí», «se hicieron» → «Bien hecho.» y nada más.
- Por cada «N no»: buscá un hueco del mismo largo con `huecos`, mañana primero y si no hay,
  pasado. Preferí, en este orden: la franja 19:00–21:30, el domingo, o el bloque menos urgente
  del día siguiente — así lo eligió él el 29-sep. Proponelo con la vista previa de
  `mover <id> …` y seguí la regla de arriba.
- No reprogrames nada que él no haya marcado con «no».

## Cómo le hablás

Corto, castellano de Bolivia con voseo, y siempre «Sergio Urcullo». Sin comandos ni ids en lo
que le mandás: él lee en el teléfono. Ejemplo:

> Sergio Urcullo, esto haría: mover «🔒 ONIA · Clientes» del mar 30-sep 15:00–16:30 al mié 01-oct
> 19:00–20:30. ¿Lo hago?

## Si falla

- Código 2: el calendario no está configurado en el VPS. Decíselo en una línea y no reintentes.
- Código 1: el calendario no respondió. «No pude llegar a tu calendario ahora.» Un reintento en
  unos minutos, no en bucle.
- Código 4: no encontré ese evento. Pedile que te diga cuál, con la hora.
- Código 64: el pedido estaba mal armado (hora imposible, fin antes del inicio, una hora que
  ya pasó). Corregilo vos si es obvio; si no, preguntale.

## Fuera de alcance

- Invitar a otras personas o mandar invitaciones: desde acá no se hace.
- Las reservas de cal.com entran solas a su calendario (por ejemplo, «Llamada 1 a 1 con X»):
  se ven con los mismos comandos.

## Rescatado de la versión del 28-sep (sigue vigente)

- Una lectura fallida o ausente NO es agenda vacía. Una respuesta sin eventos solo significa
  «sin eventos en el período consultado»; no garantiza el día libre.
- No afirmar que una reunión está confirmada sin evidencia del calendario o confirmación humana.
- Los horarios que ofrece el bot (`ONIA_BOT_SLOTS`) son candidatos estimados, no disponibilidad
  del calendario ni reservas.
