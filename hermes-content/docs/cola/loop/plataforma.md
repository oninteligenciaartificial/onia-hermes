# Cola · Plataforma Onia 1.0

Orden: lo que destraba cobrar primero. Cada PR: integrar con master, suite completa, mergear, `publicar.sh`, MIRAR en prod.

- [ ] #141 S1+S1b (IPv6 por /64)
- [ ] #142 U2+U2b (pago de usted)
- [ ] #136 bandeja v3 (incluye #127, #129 y #135) + B3 #130 (PWA)
- [ ] #140 widget W1-W1d + infra: bloquear `/public/api/` en Chatwoot y `hmac_mandatory` en los inboxes API
- [ ] #139 canal privado: migración `20261005140000_realtime_citas_privado` primero, imagen después
- [ ] #114 factura C15b: migración `20261009110000_subscription_invoice_validation` antes del swap
- [ ] #124 términos (punto 14) y después #113 gracia C13 (actualizar `PlanClient.estado-real` y `vencimientos` al mergear)
- [ ] #118 agenda del día, #119 odontograma y #110 caja diaria, con sus migraciones
- [ ] #132 K1 (respuesta al recordatorio)
- [ ] Refrescar la demo dental en prod (`scripts/demo-venta/seed-demo.sql`) y sacar las capturas C1-C7 del VSL
- [ ] Mirar con login lo publicado el 8-oct (#128): agenda «Hoy» con WhatsApp, «sin confirmar», tarjeta del chatbot
- [ ] SQL del B22 (REVOKE a anon) aplicado y medido

## Bloqueado (solo Sergio Urcullo)
- Respaldo afuera (punto 4): bucket R2 (gasto).
- SIAT etapa VI: el CAFC del piloto.
