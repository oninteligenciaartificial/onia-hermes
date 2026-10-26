# Cómo conseguir credenciales de pago BCP — INTERNO

Última actualización: 2026-06-10
Documento interno ONIA. Verificado con fuentes BCP (jun 2026). Confidencial.

---

## Regla de oro

**Las credenciales son del CLIENTE, no de ONIA.** En Bolivia, las entidades
financieras y ASFI exigen que el **dueño del negocio** firme directamente el
contrato de cobros electrónicos — él asume la responsabilidad legal de las
transacciones. ONIA solo hace la **integración técnica** una vez que el cliente
tiene sus claves API.

> Nunca poner la cuenta de cobro a nombre de ONIA. La cuenta, contrato y
> comisión BCP van a nombre del cliente (regla `hermes-content/docs/historial/ONIA_PRICING_2026.md`).

---

## Qué ofrece BCP (productos relevantes para e-commerce)

Portal de desarrolladores: **https://www.bcp.com.bo/Desarrollo** ("APIs Abiertas")

| Producto | Para qué | Notas |
|---|---|---|
| **APIs Pagos QR Simple** | Cobro por QR interbancario en la tienda | Generación QR · Consulta Pagos QR · Pagos QR (notificación) |
| APIs Públicas | Servicios generales | — |
| APIs Privadas Banca Empresas | Transferencias, pagos a proveedor, recaudaciones QR | requiere Credinet Web |
| Credinet Web | Banca empresa (token, roles, reportes) | base para empresas |

**QR Simple es la vía e-commerce más directa en Bolivia** (red QR normada por el
BCB, la más adoptada). Para **tarjeta** (Visa/Mastercard) se necesita un
procesador aparte: VisaNet Bolivia o Fiserv (Prisma/First Data) — confirmar con
el cliente si quiere tarjeta además de QR.

---

## Paso a paso para conseguir las credenciales

### Lo que el CLIENTE necesita tener antes
- Cuenta **empresa/comercial** en BCP (cuenta corriente o ahorro comercial).
- **NIT**.
- **Matrícula de Comercio (SEPREC)** — antes FUNDEMPRESA. Ver
  `REQUISITOS_LEGALES_BOLIVIA_INTERNO.md`.
- Documento del representante legal.

### Proceso
1. **Cliente** entra a https://www.bcp.com.bo/Desarrollo y llena el formulario
   de "Intégrate a nuestros servicios de APIs Abiertas" → BCP envía la
   documentación técnica. (Alternativa: pedirlo por su **ejecutivo de cuenta**
   BCP o Help Desk empresas 800 10 2244.)
2. **Cliente** solicita el servicio **APIs Pagos QR Simple** y firma el contrato
   de cobros electrónicos (presenta NIT + registro de comercio + cuenta).
3. BCP entrega al cliente: **credenciales API** (claves/cliente-id),
   documentación de endpoints y datos del comercio.
4. **El cliente nos comparte las credenciales** (de forma segura) para integrar.
5. ONIA integra: generación de QR en checkout + webhook de confirmación de pago.
6. Pruebas en ambiente de pruebas (confirmar con BCP si dan sandbox) → producción.

> ONIA acompaña y guía al cliente en cada paso, pero **no firma** el contrato ni
> pone la cuenta a su nombre. Si el cliente no tiene cuenta empresa/NIT, ese
> trámite es bloqueante y se hace primero.

---

## Cómo lo integramos (técnico, lado ONIA)

Flujo n8n base `pago→orden→mensaje` (ver `PLAYBOOK_CONSTRUCCION_INTERNO.md`):

1. Checkout genera el cobro vía **API Generación QR** (monto, referencia/orden).
2. Cliente paga escaneando el QR desde su banca móvil.
3. BCP notifica el pago aprobado → **webhook** (API Pagos QR / Consulta Pagos QR).
4. n8n valida el pago → genera la orden → dispara mensaje (email/WhatsApp).

Guardar credenciales como **credencial segura en n8n** / variables de entorno —
nunca en el código ni en el repo.

---

## Checklist credenciales BCP (por cliente)

- [ ] Cliente tiene cuenta empresa BCP + NIT + registro de comercio
- [ ] Formulario en bcp.com.bo/Desarrollo enviado (o vía ejecutivo)
- [ ] Servicio QR Simple solicitado + contrato firmado
- [ ] Credenciales API recibidas por el cliente
- [ ] Credenciales compartidas a ONIA de forma segura
- [ ] Endpoints + ambiente de pruebas confirmados con BCP
- [ ] Integración + webhook probados (pago aprobado / rechazado)

---

## Por confirmar con ejecutivo BCP (no asumir)

- ¿Hay ambiente sandbox de pruebas para QR Simple?
- Formato exacto de credenciales y endpoints de producción.
- Si requieren tarjeta: contratar VisaNet Bolivia o Fiserv aparte.
- Tiempos de aprobación del contrato y costos/comisiones (los paga el cliente).

Fuentes: bcp.com.bo/Desarrollo, bcp.com.bo/Desarrollo/ApiPagosQR,
viabcp.com/empresas/open-economy, prácticas de integración e-commerce Bolivia.
