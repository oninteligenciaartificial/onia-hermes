# Cómo funcionan por dentro los programas de la competencia — resumen

Fuente única del tema. Detalle con la fuente de cada dato: `DENTALINK_TEARDOWN.md`, `DOCTOCLIQ_TEARDOWN.md`,
`TUDOC_TEARDOWN.md`, `AGENDAPRO_CITALO_TEARDOWN.md`, todos en esta carpeta.
Medido el 1-oct-2026 con páginas públicas, centros de ayuda y capturas. Sin cuentas propias todavía. No se pudieron
ver videos: YouTube bloquea la nube; los ids quedan anotados en cada teardown.

## ¿Alguien recupera al paciente que dejó el tratamiento a medias?

| Competidor | Respuesta |
|---|---|
| Dentalink / Medilink | **No.** Su seguimiento automático cubre la falta, el presupuesto sin arrancar, el control y la cobranza; el «2 de 4 sesiones y no volvió» queda afuera. |
| Doctocliq | **Manual y pago aparte.** Filtro «abandonaron el tratamiento» + campaña que alguien arma, en el add-on Marketing (contrato semestral o anual). |
| AgendaPro | No (su asistente de marketing pago solo manda correos). |
| Citalo | No. |
| Dapta (agentes de IA, no sistema de gestión) | **No.** No tiene vertical de salud: confirma, recuerda y agenda dentro del chat, pero no ve tratamientos ni fichas por rubro (`DAPTA_TEARDOWN.md`, 2-oct). |
| TuDoc | No. Además no se ve el producto, no tiene precio y sus botones no funcionan. |

**El hueco de Onia sigue en pie:** el agente lo detecta solo todos los días y viene incluido desde Crece.

## Lo que tienen ellos y a Onia le falta (orden de impacto para una clínica de 2-6 profesionales)

1. **Recordatorio por WhatsApp con botones** (Confirmar / Cancelar / Reprogramar), que cambia el estado de la cita.
   Lo tienen 4 de 5. Onia hoy solo avisa por correo; el canal WhatsApp existe en el código y falta la primera
   conexión real de un número de cliente.
2. **Presupuesto / plan de tratamiento** armado desde el odontograma, con fases, alternativas, estados (aceptado,
   abandonado…) y envío por WhatsApp. Es lo que vende el tratamiento y lo que alimenta el recall.
3. **Hueco liberado que se revende:** cancelación del paciente dentro de una política y lista de espera avisada sola.
4. **Caja completa:** abonos parciales, cuotas, pago dividido, caja por usuario con apertura y cierre, comisiones por
   doctor.
5. **Campañas a la base** (cumpleaños, «hay huecos esta semana», reactivación).
6. Plan gratis para siempre (Doctocliq, Citalo), app móvil, odontograma con periodontograma y ortodoncia.

## Lo que Onia hace mejor

1. **Detecta el tratamiento a medias solo**, sin costo extra.
2. **Te registrás solo, ves el precio y probás 14 días** (Dentalink y TuDoc exigen vendedor; AgendaPro y Doctocliq dan 7).
3. **Hecho para Bolivia:** bolivianos, QR del BCP y SIAT en camino. Ninguno factura en Bolivia ni cobra online acá.
4. **Sistema completo:** contabilidad, planilla, gastos e inventario incluidos; varios competidores son solo agendas con caja.

## Precio frente a frente (clínica de 3 doctores + recepción)

- Doctocliq cobra por doctor (USD 19/29/49 al mes) y da 8 usuarios gratis para recepción.
- Onia Crece trae 4 usuarios por un precio fijo en bolivianos (`subscription-plans.ts`).
- Comparar el monto exacto antes de usarlo en la venta.
