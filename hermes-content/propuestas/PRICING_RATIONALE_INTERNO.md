# Pricing — Razonamiento interno (NO mostrar al cliente)

Última actualización: 2026-07-03
Clientes en pipeline: Garabato, Ingeniería, Lia Albertengo
Documento interno Onia. No incluir en propuestas ni decks client-facing.

---

## 0. Precios OFICIALES de lanzamiento (fase sin portafolio) — 2026-07-03

> Hoja de precios completa y canónica (webs + SaaS/Core + servicios de Arthur +
> add-ons + comisiones): `ONIA_CATALOGO_PRECIOS_2026.md`. Esta sección es el
> resumen; el catálogo manda para cotizar.

Decisión Sergio: mientras Onia no tenga 3-5 casos en portafolio, los precios de
web de arranque son bajos para CERRAR y abrir el mensual. La línea premium
(Landing 2.000 / Web Pro 4.500) es el OBJETIVO con portafolio, no el precio de
ahora. Estos precios mandan sobre cualquier otra tabla de este documento para
clientes nuevos.

**Web / pago único (lanzamiento):**

| Producto | Precio Bs |
|---|---:|
| Auditoría Express (entrada fría) | 250 |
| Diagnóstico + Plan de acción | 690 |
| Landing | 790 |
| Web Pro | 1.500 |
| Web Pro Onia (web mayor) | 2.900 |
| Automatización n8n simple | 790 |
| Flujo n8n (orden + WhatsApp) | 1.200 |
| Tienda con pago (BCP + carrito) | 2.500 |

**Recurrente (acá vive el margen — NO regalar):**

| Producto | Precio Bs/mes |
|---|---:|
| Cuidado Web | 190 – 690 |
| Onia Comercio | 350 – 1.250 |
| Onia Dental | 320 – 1.500 |
| Videos IA (8/mes) | 2.200 |

Lógica: la web barata es el gancho, no el negocio. Con plantillas una landing
toma ~5h, así que a Bs. 790 el margen sigue siendo alto. El dinero real se acumula
en los mensuales. Regla de cierre: cerrar la web → activar el mensual en la misma
firma. Cuando haya 3-5 casos, subir a línea premium (secciones 3-4).

Los decks ya cotizados de Garabato / Ingeniería / Lia quedaron en línea premium
(sección 4); no se re-cotizan. Los precios de lanzamiento aplican a clientes
nuevos desde 2026-07-03.

---

## 1. De dónde salieron los precios v1

Los precios iniciales de los 3 decks salieron de `hermes-content/docs/historial/ONIA_PRICING_2026.md`
(Landing 1,490 / Web Pro 2,900 / Web Pro IA 5,900 / Conector 900 / Flujo n8n 1,800).
Encima apliqué los anclajes que dio Sergio: Landing Bs 2,000, Web Pro Bs 4,500.

**Problema de esa v1:** sumaba componentes a precio de lista sin pensar
(a) cuánto nos toma realmente con plantillas, (b) que cerrar estos 3 importa
más que exprimir margen, (c) que el dinero real es recurrente, no la web única.

---

## 2. Principios de pricing (este pipeline)

1. **Cerrar > exprimir.** Son 3 leads tibios. Una web cerrada que arranca un
   mensual vale más que una cotización cara que no firma.
2. **Plantillas = costo marginal bajo.** Construimos una librería de plantillas
   para armar webs casi automático. Eso es ventaja INTERNA. El cliente paga por
   resultado y velocidad, no por horas. Nunca decir "es plantilla".
3. **Precio por valor, no por píxeles.** La web es commodity; la automatización
   (BCP + n8n + WhatsApp + CRM) es lo que se cobra.
4. **El margen vive en lo recurrente.** Cuidado Web, Onia Comercio, videos IA mensuales.
   La web única se precia para GANAR el trato y abrir la puerta al mensual.
5. **Dominio + hosting + comisión pasarela los paga el cliente.** Nunca entran en
   nuestro precio (regla ONIA_PRICING_2026). Reafirmado en cada deck.

---

## 3. Tiempo real de producción (CON librería de plantillas)

| Entregable | Tiempo c/plantilla | Notas |
|---|---|---|
| Landing | 4–6 h | plantilla + contenido + dominio del cliente |
| Web Pro (multipágina) | 1.5–2 días | secciones, casos, formularios |
| Catálogo + carrito | +1 día | carga de productos |
| Integración BCP | +1 día | botón de pago + pruebas sandbox |
| Flujo n8n orden + WhatsApp | +1 día | webhook BCP → orden → mensaje |
| CRM captación (Onia Comercio config) | 2 días | formularios + estados + recordatorios |
| Entrega automática libro | +0.5 día | link de descarga post-pago |
| WhatsApp add-on | +0.5 día | plantillas de mensaje + verificación Meta |

Valor-día objetivo efectivo (posicionamiento premium Onia): ~Bs 700–1,000.
Con plantillas, una Landing de 4–6 h a precio Bs 2,000 = margen muy alto.
Por eso la Landing es el mejor gancho de cierre: barata de producir, atractiva
de comprar, y abre el mensual.

---

## 4. Precios finales recomendados (client-facing)

Mantenemos la línea estándar Onia (Landing 2,000 / Web Pro 4,500) por coherencia
de marca, y bajamos los paquetes de automatización respecto a v1 porque las
plantillas nos dan velocidad — bajar el precio mid sube la tasa de cierre.

### GARABATO (tienda online)
| Paquete | Precio (Bs) | Tiempo | Por qué |
|---|---|---|---|
| Catálogo Esencial | 4,500 | ~2 días | catálogo + pago BCP + email |
| **Tienda Automática** ⭐ | **6,900** | ~4 días | + n8n orden + WhatsApp (bajado de 8,200) |
| Tienda Pro | desde 11,000 | ~7 días | + inventario, cupones, panel, videos IA |
| Recurrente | Cuidado Web 250/mes | — | **empujar — es el margen** |

### INGENIERÍA (web + captación)
| Paquete | Precio (Bs) | Tiempo | Por qué |
|---|---|---|---|
| Presencia | 4,500 | ~2 días | web + formularios + WhatsApp |
| **Captación** ⭐ | **8,900** | ~5 días | + consultoría + CRM (bajado de 10,490) |
| Crecimiento | desde 13,900 | ~8 días | + pauta + videos IA + mensual |
| Recurrente | Onia Comercio 530/mes + Cuidado Web | — | **doble mensual** |

### LIA ALBERTENGO (web + libro)
| Paquete | Precio (Bs) | Tiempo | Por qué |
|---|---|---|---|
| **Landing Libro** ⭐ | **2,000** | 4–6 h | gancho de cierre, margen altísimo |
| Web Pro | 4,500 | ~2 días | web completa |
| Web Pro + Marketing | desde 5,900 | ~3 días | + maquetación libro + videos IA + WhatsApp (bajado de 6,700) |
| Recurrente | Cuidado Web 190/mes | — | soporte continuo |

---

## 5. Add-ons (todos los clientes)

| Add-on | Setup (Bs) | Mensual (Bs) |
|---|---|---|
| WhatsApp (notificación / captación) | 900 | 80 |
| Pasarela de pago (BCP u otra) | 1,900 | — |
| Videos con IA | — | 2,200 (8/mes) |
| Cuidado Web | — | 190–690 |
| Conexión Instagram / TikTok | 900 | 150 |

---

## 6. Costos que paga el cliente (NUNCA en nuestro precio)

- Dominio (lo compra y paga el cliente a su nombre)
- Hosting
- Comisión y afiliación de la pasarela BCP
- Créditos de IA
- Mensajería WhatsApp pagada
- Pauta publicitaria

---

## 7. Ventaja interna — librería de plantillas

Construimos plantillas reutilizables (estructura, componentes, estilos, flujos
n8n base, config Onia Comercio base) para armar cada web casi automático.

- **Confidencial.** No mencionar al cliente que es plantilla.
- **Objetivo:** maximizar producción — más clientes cerrados por semana sin
  subir horas.
- Cada proyecto nuevo se arma sobre la plantilla y se personaliza marca/contenido.
- Mantener la librería como activo: cada cliente nuevo la mejora.

---

## 8. Guion de cierre

1. Mostrar el paquete ⭐ recomendado (mid) como default.
2. Anclar arriba con el Pro, abajo con el básico.
3. Cerrar la web → activar el mensual (Cuidado Web / Onia Comercio) en la misma firma.
4. Dominio: el cliente lo compra a su nombre (lo guiamos, no lo pagamos).
5. Precio reservado 30 días con anticipo (50/50).
