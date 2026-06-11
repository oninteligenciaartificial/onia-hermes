# Estrategia de plantillas web — INTERNO (NO mostrar al cliente)

Última actualización: 2026-06-10
Documento interno ONIA. Confidencial. Nunca decir al cliente "es plantilla".

---

## Objetivo

Armar webs casi automático con una **librería de plantillas reutilizables** para
**maximizar producción**: más clientes cerrados por semana sin subir horas. La
web es commodity; lo que se cobra es velocidad + automatización + resultado.

---

## Las dos capas de automatización

| Capa | Qué automatiza | Estado |
|---|---|---|
| **Propuestas** | Cotización HTML/PDF desde JSON | ✅ Hecho (`generador/`) |
| **Webs** | Sitio del cliente desde plantilla base | 🔜 En construcción |

Este documento cubre la capa de **webs**. La de propuestas ya está operativa.

---

## Librería de plantillas web (a construir)

Una base reutilizable por tipo de proyecto. Cada cliente nuevo se arma encima y
solo se personaliza marca + contenido + integraciones.

| Plantilla | Para | Reusa |
|---|---|---|
| `landing` | Landing de captación / venta de 1 producto | hero, CTA, form, sección precio |
| `web-pro` | Web multipágina profesional | nav, secciones, casos, contacto |
| `catalogo` | Tienda con catálogo + carrito + checkout | grid productos, carrito, checkout BCP |
| `crm-captacion` | Web + formularios → CRM/embudo | forms, integración GestiOS/n8n |

### Tokens de diseño (igual que las propuestas)

Reusar el sistema de `:root { --accent, --ink, --muted, ... }` para reskin por
marca cambiando solo el acento y el logo. Mismo enfoque que `generar-propuestas.js`.

### Bloques de automatización reutilizables (n8n)

| Flujo base | Hace | Clientes |
|---|---|---|
| `pago→orden→mensaje` | Webhook pasarela → genera orden → email/WhatsApp | Garabato, Lia |
| `form→crm` | Formulario/WhatsApp → registra prospecto + estado | Ingeniería |
| `entrega-digital` | Pago confirmado → link de descarga del producto | Lia (libro) |

Cada flujo se guarda como plantilla n8n y se clona por cliente cambiando
credenciales y plantillas de mensaje.

---

## Próximos pasos (capa webs)

1. Elegir stack base (mismo para todas las plantillas) — definir con Sergio.
2. Construir `landing` primero (es el gancho de cierre más usado).
3. Parametrizar marca/contenido vía un `sitio.json` (igual que `clientes.json`).
4. Script `generar-web.js` análogo al de propuestas.
5. Guardar flujos n8n base como plantillas exportables.

---

## Reglas

- **Confidencial.** El cliente compra un sitio a medida, no "una plantilla".
- Cada cliente nuevo mejora la librería (componentes, flujos, copy).
- Mantener la librería como activo versionado en el repo.
- Dominio y hosting siempre a nombre y cuenta del cliente.
