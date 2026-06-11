# Playbook de construcción — INTERNO (cómo armamos cada proyecto)

Última actualización: 2026-06-10
Documento interno ONIA. Confidencial. Paso a paso real de entrega por cliente.

> Regla transversal: todo se arma sobre la librería de plantillas
> (ver `ESTRATEGIA_PLANTILLAS_WEB_INTERNO.md`). El cliente NUNCA sabe que es
> plantilla. Dominio + hosting + pasarela = cuenta del cliente.

---

## Fase 0 — Común a todos (antes de tocar código)

1. **Discovery** (30–60 min): qué vende, marca, colores, logo, textos, ejemplos.
2. **Anticipo 50%** confirmado. Sin anticipo no se arranca.
3. **Accesos del cliente**: dominio, hosting, cuenta pasarela/BCP, correo, redes.
4. **Crear carpeta de proyecto** + branch + tablero de tareas.
5. **Elegir plantilla base** según tipo (landing / web-pro / catalogo / crm).

---

## GARABATO — Tienda online (catálogo + BCP + orden automática)

Tiempo objetivo con plantilla: ~4 días (paquete Tienda Automática).

### Paso 1 — Catálogo (Día 1)
- Clonar plantilla `catalogo`.
- Reskin de marca (acento, logo, tipografía).
- Cargar productos: foto, nombre, precio, categoría, stock.
- Armar grid + ficha de producto + carrito.

### Paso 2 — Checkout + BCP (Día 2)
- Verificar afiliación del cliente al **botón de pago BCP** (si no la tiene, se tramita — bloqueante).
- Integrar checkout → botón de pago BCP (tarjeta / QR).
- Configurar URL de retorno + URL de notificación (webhook) de BCP.
- Probar en ambiente de pruebas BCP (pago aprobado / rechazado).

### Paso 3 — Flujo orden automática (Día 3) — n8n
- Clonar flujo base `pago→orden→mensaje`.
- Webhook recibe confirmación de BCP.
- Validar pago aprobado → generar registro de orden (nº, productos, total, cliente).
- Disparar mensaje automático: email (siempre) + WhatsApp (add-on).
- Sin chatbot: es transaccional, solo dispara al confirmarse el pago.

### Paso 4 — WhatsApp + cierre (Día 4)
- Plantilla de mensaje de orden (requiere verificación Meta del número).
- Pruebas end-to-end: compra real de prueba → orden → mensajes.
- Capacitación corta al cliente + entrega.
- Activar **Cuidado Web mensual** (hosting, respaldos, cambios).

### Checklist de entrega Garabato
- [ ] Catálogo cargado y navegable en móvil
- [ ] Pago BCP funciona (prueba aprobada)
- [ ] Webhook BCP → orden generada
- [ ] Email de orden automático
- [ ] WhatsApp de orden (si add-on)
- [ ] Dominio apuntando + SSL
- [ ] Cliente capacitado

---

## INGENIERÍA — Web profesional + sistema de captación

Tiempo objetivo con plantilla: ~5 días (paquete Captación).

### Paso 1 — Web de autoridad (Días 1–2)
- Clonar plantilla `web-pro`.
- Secciones: servicios, proyectos/casos, sobre la empresa, contacto.
- Diseño de autoridad técnica (serio, confianza).
- Formularios de captación en cada sección clave.
- SEO básico (títulos, meta, velocidad, móvil).

### Paso 2 — Consultoría de publicidad (Día 3)
- Diagnóstico: cómo llegan hoy los clientes, qué canales, qué se pierde.
- Plan de pauta: dónde invertir, mensajes, segmentación.
- Entregable: documento de diagnóstico + plan (no garantiza ventas).

### Paso 3 — CRM + embudo (Días 4–5) — GestiOS + n8n
- Configurar GestiOS (o CRM) con estados del embudo.
- Clonar flujo base `form→crm`: formulario web / WhatsApp → registra prospecto.
- Asignar estados, responsables y recordatorios de seguimiento.
- Reportes de conversión (cuántos entran, dónde se traban).

### Checklist de entrega Ingeniería
- [ ] Web publicada + móvil + SSL
- [ ] Formularios capturan y notifican
- [ ] Prospecto entra automático al CRM con estado
- [ ] Recordatorios de seguimiento activos
- [ ] Documento de diagnóstico + plan entregado
- [ ] Cliente capacitado en el CRM
- [ ] Mensual activo (GestiOS / Cuidado Web)

---

## LIA ALBERTENGO — Web + libro de fisioterapia digital

Tiempo objetivo con plantilla: Landing 4–6 h · Web Pro ~2 días.

### Paso 1 — Página (Landing o Web Pro)
- Clonar plantilla `landing` (gancho) o `web-pro`.
- Reskin cálido/profesional, móvil primero.
- Secciones: sobre Lia, servicios/especialidades, agenda/contacto.

### Paso 2 — Página de venta del libro
- Portada del libro, descripción, beneficios, botón de compra.
- Definir precio y formato del archivo (PDF protegido / link).

### Paso 3 — Pago + entrega automática — n8n
- Integrar pasarela de pago (add-on).
- Clonar flujo base `entrega-digital`: pago confirmado → genera link de descarga → envía al comprador (email + WhatsApp).
- El link puede ser de un solo uso / con expiración.

### Paso 4 — Cierre
- Pruebas: compra de prueba → recibe el libro automático.
- (Opcional) maquetación del libro digital como add-on.
- Capacitación + entrega + Cuidado Web mensual.

### Checklist de entrega Lia
- [ ] Web/landing publicada + móvil + SSL
- [ ] Página de venta del libro
- [ ] Pago en línea funciona (prueba)
- [ ] Entrega automática del libro tras pago
- [ ] Dominio + SSL
- [ ] Mensual activo (Cuidado Web)

---

## Flujos n8n base (reutilizables — clonar por cliente)

| Flujo | Trigger | Acción | Clientes |
|---|---|---|---|
| `pago→orden→mensaje` | Webhook pasarela | Genera orden → email/WhatsApp | Garabato |
| `form→crm` | Formulario / WhatsApp | Registra prospecto + estado | Ingeniería |
| `entrega-digital` | Pago confirmado | Link de descarga → comprador | Lia |

Cada flujo se guarda como plantilla exportable; clonar y cambiar credenciales +
plantillas de mensaje por cliente.

---

## Orden de prioridad de cierre

1. **Lia — Landing Libro** (4–6 h, margen altísimo, cierra rápido).
2. **Garabato — Tienda Automática** (ticket medio, automatización vendible).
3. **Ingeniería — Captación** (ticket alto + doble mensual, ciclo más largo).
