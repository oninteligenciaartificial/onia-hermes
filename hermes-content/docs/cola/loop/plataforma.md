# Cola · Plataforma Onia 1.0

Orden: lo que destraba cobrar primero. Cada PR: integrar con master, suite completa, mergear, `publicar.sh`, MIRAR en prod.

- [x] #141 S1+S1b (IPv6 por /64): en producción desde el 9-oct 18:50 UTC (`release-c94b9daa`), mirado.
- [x] #143 F1 (la letra dentro del sistema) y #142 U2+U2b (pago de usted): en producción desde el 10-oct 18:50 UTC (`release-21f0c7e6`), mirados a las 19:17 (el checkout con login lo mira la madre).
- [x] #144 `/book` de usted: en producción desde el 10-oct 18:50 UTC, mirado a 390 y 1440.
- [ ] #136 = las 5 pantallas (bandeja v3, app, agenda del día #118, odontograma #119, caja #110), `1fd14770`, suite 10.501 en verde. Sergio Urcullo: «publica la pantalla» (11-oct ~04:40 UTC, en esta sesión). Con CI verde: merge fuera de :20-:55, cron, mirar; después la infra de la bandeja.
- [ ] #140 widget W1-W1e + W1f (se presenta con el nombre de la clínica, bundle del 10-oct) + infra: origen solo para Cloudflare, bloquear `/public/api/` en Chatwoot y `hmac_mandatory` en los inboxes API. Espera el OK de diseño de Sergio Urcullo a W1f.
- [x] #139 canal privado (punto 3): en producción desde el 10-oct 18:50 UTC, migración registrada a las 18:44. Falta solo MIRAR «En vivo» con login (madre).
- [x] #114 factura (punto 15) y #145 logo de `/book`: en producción desde el 10-oct 21:55 UTC (`release-d8ca5a32`), mirados sin login (`/admin/payments` lo mira la madre).
- [ ] #124 términos (punto 14, migración ya aplicada) y después #113 gracia C13 (actualizar `PlanClient.estado-real` y `vencimientos` al mergear): esperan el sí de Sergio Urcullo (legal).
- [ ] (#118, #119 y #110 van dentro de #136.)
- [ ] #146 títulos públicos de usted (pedido de la madre v4): CI en cola; con verde, merge (textos).
- [ ] Demo del lunes 12-oct (07-11 UTC): plan `reset=2` + lista C1-C7, pedido de la madre v4.
- [ ] #132 K1 (respuesta al recordatorio)
- [ ] Refrescar la demo dental en prod (`scripts/demo-venta/seed-demo.sql`) y sacar las capturas C1-C7 del VSL
- [ ] Mirar con login lo publicado el 8-oct (#128): agenda «Hoy» con WhatsApp, «sin confirmar», tarjeta del chatbot; y el punto 11 (reprogramar, días cerrados en `/book`, aviso de reserva online)
- [ ] SQL del B22 (REVOKE a anon) aplicado y medido (no entró en el sí del 10-oct)

## Bloqueado (solo Sergio Urcullo)
- Respaldo afuera (punto 4): bucket R2 (gasto).
- SIAT etapa VI: el CAFC del piloto.

## Verificación de aprendizaje · 2026-10-09
- [ ] En la próxima tarea técnica pertinente, cargar `equipo-de-agentes` y `aprender-de-todo`; usar la regla de contexto verificable de la ficha «cinco archivos antes de vibe code» y registrar sesión, fuentes canónicas, artefacto y prueba en esa ficha. No crear documentos duplicados ni abrir otro frente para demostrarlo.
