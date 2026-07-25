# Checklist de capturas — completar el kit en 30 minutos

> Qué falta capturar del sistema para que el kit quede completo (respaldo de demo + material de WhatsApp).
> Hacerlas todas en UNA sesión de ~30 min cuando el ambiente demo esté cargado.
> Kit de venta v1 · 2026-07-25

---

## Preparación del ambiente (5 min, antes de capturar)

- [ ] Ambiente demo con **datos 100% ficticios** — nunca pacientes reales. Clínica demo: "Clínica Dental Los Tajibos" (o similar creíble de Santa Cruz), pacientes con nombres bolivianos verosímiles.
- [ ] Agenda de la semana cargada: ~15 citas repartidas, mínimo **1 cita en estado "faltó"** (genera el hueco que usa toda la narrativa).
- [ ] 1 paciente estrella completo: odontograma con tratamientos marcados, historial de 3+ atenciones, 1 consentimiento subido, saldo pendiente visible.
- [ ] 1 propuesta del agente viva en /pending (reprogramación del paciente que faltó).
- [ ] Navegador limpio: sin bookmarks personales, sin otras pestañas, zoom 100%, ventana maximizada. Ocultar cualquier dato interno de ONIA.
- [ ] Celular demo con WhatsApp listo para recibir el mensaje del agente.

## Las capturas (en orden del guion de demo)

| # | Pantalla | Qué DEBE verse | Formato | Se usa en |
|---|---|---|---|---|
| 1 | **Agenda semanal** | Semana con citas por sillón, colores por estado, y el hueco de la cita "faltó" bien visible | PNG 1920×1080 | Guion §2 · one-pager |
| 2 | **Agendar cita** (grabación) | Crear una cita nueva de punta a punta en <15 segundos | MP4 ≤20s | Guion §2 |
| 3 | **Ficha de paciente + odontograma** | Odontograma con piezas marcadas, plan de tratamiento, datos del paciente | PNG 1920×1080 | Guion §3 · one-pager |
| 4 | **Historial del paciente** | Lista de atenciones con fecha, profesional, tratamiento, pagado/debe | PNG 1920×1080 | Guion §3 |
| 5 | **Documentos/consentimientos en la ficha** | Al menos 1 consentimiento colgado | PNG 1920×1080 | Guion §3 |
| 6 | **/pending con la propuesta del agente** ⭐ | La propuesta de reprogramación: qué paciente, qué propone el agente, botón de aprobar. LA captura más importante del kit | PNG 1920×1080 | Guion §4 · one-pager · WhatsApp |
| 7 | **Aprobación → WhatsApp saliendo** (grabación) | Click en aprobar en /pending → el mensaje llegando al celular demo. El momento "wow" completo | MP4 ≤30s | Guion §4 · WhatsApp |
| 8 | **Chat de WhatsApp del paciente** (foto de celular o screenshot) | El mensaje de reprogramación recibido, con los horarios propuestos | PNG vertical (celular) | Guion §4 · scripts WhatsApp |
| 9 | **Panel del dueño** | Pendientes del día con responsable — "tu clínica en 30 segundos cada mañana" | PNG 1920×1080 | Guion §4 · one-pager |
| 10 | **Cierre de atención → factura** | El flujo atención→factura; si el emisor SIAT aún no está homologado, capturar la venta lista para facturar SIN simular una factura SIAT real (honestidad: no mostrar como vivo lo que está en homologación) | PNG 1920×1080 | Guion §5 |
| 11 | **Roles** (vista de recepcionista) | La misma clínica vista como recepción: agenda sí, historia clínica no | PNG 1920×1080 | Guion §3 · objeción 6 |
| 12 | **Recorrido completo** (grabación) | Agenda → ficha → /pending → aprobar → factura, corrido, sin audio | MP4 ≤90s | Respaldo si falla internet en la demo · post-demo por WhatsApp |

## Reglas de las capturas

- **Nada ficticio presentado como real**: las capturas muestran el sistema demo, no "clientes actuales". Si se comparten por WhatsApp, jamás decir que es una clínica cliente.
- **SIAT honesto**: mientras la homologación esté en trámite, ninguna captura debe simular una factura SIAT emitida como si ya estuviera vivo (captura #10).
- **Sin datos internos**: ni URLs internas de ONIA, ni nombres de herramientas propias, ni paneles de administración nuestros.
- Guardarlas en `hermes-content/sales-kit/capturas/` con el número de esta lista (`01-agenda.png`, `07-aprobar-whatsapp.mp4`, …).
- Al terminar: reemplazar los `[PENDIENTE: captura]` de `02-GUION-DEMO.md` por la referencia al archivo.

## Extra si sobra tiempo (no bloquea el kit)

- [ ] Captura del wizard /setup (para mostrar lo simple del arranque — refuerza "implementación regalada").
- [ ] Versión 9:16 (recorte vertical) de las capturas 1, 6 y 9 para mandar por WhatsApp sin que se vean chicas.
