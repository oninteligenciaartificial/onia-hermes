# Reunión BCP (miércoles 2026-08-12) — Guion, preguntas y qué es real de "leer el banco"

**Objetivo de la reunión:** salir con (1) credenciales/sandbox de la API de QR
dinámico, (2) respuesta escrita sobre comisiones, (3) el modelo multi-cuenta
aclarado, y (4) la vía oficial para leer movimientos (conciliación automática).

**Modelo de Onia (no negociable, ya decidido con base legal):** FACILITADOR, nunca
Agregador — la plata de los clientes finales JAMÁS pasa por cuentas de Onia; cada
comercio cobra en SU cuenta; Onia es el software que genera el QR y concilia.
(Reglamento de Servicios de Pago BCB Res. 079/2022; ser Agregador es figura
regulada ASFI que un unipersonal no puede ejercer.)

---

## 1. "Scrapear la página del banco" — qué tan real es (respuesta honesta)

**Scraping de la banca en línea con usuario y contraseña: NO.** Razones duras:

1. **Seguridad inaceptable:** habría que guardar credenciales bancarias de
   clientes (o nuestras) en el sistema — exactamente la categoría de dato que
   nunca debe tocarse. Un incidente ahí mata la empresa.
2. **Frágil:** 2FA, captchas, cambios de HTML — se rompe cada mes.
3. **Contractual:** los términos de banca por internet lo prohíben; el banco
   puede bloquear cuentas. Y en Bolivia NO existe open banking regulado que lo
   ampare.

**Lo que logra EXACTAMENTE lo mismo, sin riesgo (en orden de preferencia):**

| Vía | Qué es | Estado |
|---|---|---|
| **Webhook de la API QR** | cada cobro QR confirmado notifica al sistema → conciliación automática en tiempo real | Es LA pregunta 2 al banco; la arquitectura ya lo contempla |
| **API/archivo de movimientos para empresas** | muchos bancos ofrecen extracto por API o archivo periódico (H2H/SFTP) a clientes empresa | Preguntar el miércoles (pregunta 6) |
| **Import de extracto oficial** | el cliente baja su extracto (CSV/Excel) de la banca en línea y el sistema lo parsea y concilia solo | **Implementable YA, sin permiso del banco, sirve para CUALQUIER banco** — este es el plan B garantizado |
| OpenBCB | API del BCB, acceso para SaaS privado por confirmar | Pendiente de respuesta del BCB |

**Conclusión:** "leer el banco" SÍ es real y va al producto — pero por extracto e
API, no por scraping. Consultarlo el miércoles tal cual (pregunta 6).

## 2. Las preguntas para el miércoles (llevar impresas, pedir respuestas por escrito)

**Pasarela / QR dinámico:**
1. ¿Qué necesitamos para **sandbox y producción** de la API de QR dinámico
   (requisitos, contrato, plazos)? ¿Hay documentación técnica completa?
2. ¿La confirmación de pago llega por **webhook/notificación push**, o solo por
   consulta (polling)? ¿Latencia de acreditación?
3. **Comisión real por cobro vía API** — el "QR comisión 0" publicado es del QR
   de cuenta de ahorros: ¿aplica también a la integración API empresa? Pedirlo
   **por escrito**. (Ojo interno: art. 36 — la comisión no se puede trasladar
   como recargo al pagador; se absorbe en el precio.)
4. **La pregunta multi-tenant (la más importante):** ¿una sola integración de
   Onia puede generar QRs que acrediten en las cuentas de MUCHOS comercios
   clientes (cada uno con su cuenta BCP), o cada comercio debe firmar su propio
   convenio/credencial? ¿Qué figura contractual usan para el "proveedor
   tecnológico" que no toca fondos?
5. ¿Qué requisitos debe cumplir la **cuenta empresa de cada cliente** para
   habilitar cobros QR por API (tipo de cuenta, documentos, costo)?

**Conciliación / movimientos:**
6. ¿Ofrecen a empresas un **servicio de extracto/movimientos automatizado**
   (API, H2H, archivo SFTP periódico)? ¿Formato y costo? Si no: ¿el export CSV
   de la banca por internet es estable para parsearlo nosotros?

**Cumplimiento:**
7. RD 079/2022 art. 27.I — ¿exigen acreditar sistema de facturación autorizado
   por el SIN antes de habilitar el servicio de cobro? **Nuestra respuesta lista:
   el sistema "Onia Platform" YA está registrado ante el SIN** (tipo Proveedor,
   código `228474DC226A215DD26BF`, solicitud 9473, Fase 1 de homologación
   completa — llevar el PDF `ONIA_SIAT_SOLICITUD_9473_20260806.pdf`).
8. Reversiones/contracargos de QR: ¿proceso y plazos?
9. Titularidad: la cuenta y el convenio van a nombre de **OniaAgency
   (matrícula 5371375010; firma Leslie Mercado Moreno)** — ¿algún requisito
   adicional por ser unipersonal?

## 3. Qué tenemos listos para mostrar (si piden ver el sistema)

- Checkout con slot del QR dinámico ya en el código (esperando la API).
- onia.com.bo (landing multi-página) + app.onia.com.bo (producto, 6 rubros).
- Registro SIAT (PDF solicitud 9473) — responde el art. 27.I en el acto.

## 4. Después de la reunión (según lo que den)

- Con sandbox → integrar QR dinámico + webhook en el flujo de suscripciones
  (activación automática del plan al confirmarse el pago = self-service completo).
- Con vía de movimientos → módulo de conciliación/gastos del producto (sirve a
  Onia interna primero — pagos a colaboradores, gastos — y luego a cada cliente).
- Sin API de movimientos → construir igual el **import de extracto CSV** (plan B
  que no depende de nadie).
