# Requisitos legales, fiscales y de pagos en Bolivia — INTERNO

Última actualización: 2026-06-15
Documento interno ONIA. Fuentes verificadas (jun 2026): seprec.gob.bo,
impuestos.gob.bo, bcp.com.bo/Desarrollo, libelula.bo, tigomoney. Confidencial.

> **Propósito.** Dejar documentado, para automatizar y para incluir como
> requisitos en las propuestas, **qué necesita un negocio boliviano** para
> (a) operar formalmente, (b) facturar y (c) **cobrar online con QR/pago
> automático**. Complementa `BCP_PASARELA_CREDENCIALES_INTERNO.md`.

> **Importante (corrige doc anterior):** lo que antes se llamaba **FUNDEMPRESA**
> ahora es **SEPREC** (Servicio Plurinacional de Registro de Comercio). El
> registro de comercio se tramita en SEPREC, no en FUNDEMPRESA.

---

## Regla de oro (igual que pasarela)

**Toda la titularidad es del CLIENTE, no de ONIA.** NIT, matrícula SEPREC,
cuenta bancaria, contrato de cobros y credenciales de pasarela van **a nombre del
cliente**. ONIA solo hace la **integración técnica y la automatización**. Nunca
poner cuentas de cobro ni registros a nombre de ONIA.

---

## 1. ¿Cuándo se necesita cada cosa? (árbol de decisión)

| Tipo de web | SEPREC | NIT | Facturación | Pasarela/QR |
|---|---|---|---|---|
| **Presencia** (institucional, catálogo sin cobro) | recomendable | recomendable | no obligatorio para la web | no |
| **Captación de leads** (formularios, WhatsApp) | recomendable | recomendable | no | no |
| **E-commerce / cobro online** | **sí** | **sí** | **sí** (si emite factura) | **sí** |

→ Una landing o web de captación **no bloquea** por temas fiscales. El bloqueo
solo aparece cuando la web **cobra dinero en línea**.

---

## 2. SEPREC — Registro de Comercio (matrícula de comercio)

Portal: **https://tramites.seprec.gob.bo** (acceso con **Ciudadanía Digital**).

- **Qué es:** inscripción que da existencia legal comercial al negocio y emite el
  **Certificado de Matrícula de Comercio** (con código QR de validación).
- **Trámite 1:** "Inscripción de Comerciante Individual o Empresa Unipersonal"
  — 100% virtual: formulario con carácter de declaración jurada + control de
  homonimia + pago en línea.
- **Costos (2026):**
  - Inscripción empresa unipersonal: **Bs 130**
  - Renovación de matrícula (unipersonal): **Bs 260**
  - (Sociedades SRL/SA tienen aranceles mayores y requisitos adicionales.)
- **Plazo:** certificado disponible en ~**24 h** desde el día hábil siguiente al
  pago.
- **Requisitos clave:** Ciudadanía Digital del propietario, formulario virtual,
  pago. Si el rubro es regulado, adjuntar autorización del ente regulador.

> Para ONIA: si el cliente **no** tiene matrícula SEPREC y la web va a vender,
> ese trámite es **previo** y lo hace el cliente. Lo marcamos como requisito.

---

## 3. NIT y facturación — SIN (Servicio de Impuestos Nacionales)

Portal: **https://www.impuestos.gob.bo** (Oficina Virtual / SIAT).

- **NIT:** número de identificación tributaria. Se obtiene en el SIN (con
  Ciudadanía Digital / biometría). Obligatorio para emitir factura.
- **Facturación en Línea (obligatoria):** el SIN migró todo a **facturación en
  línea**. Tres modalidades:
  1. **Electrónica en Línea** — requiere **certificado de firma digital**; para
     volumen alto / integración por software (genera CUFD/CUF, firma digital).
  2. **Computarizada en Línea** — software propio homologado.
  3. **Portal Web SIN** — **gratuita**, sin software, ideal para negocios
     pequeños: se emiten facturas desde formularios en impuestos.gob.bo.
- **Plazo 2026:** prórroga hasta **30/09/2026** para los grupos 9–12; desde el
  **01/10/2026** la emisión es **exclusivamente** por la modalidad en línea
  asignada.

> Para ONIA: si el cliente quiere **factura automática** al vender por la web,
> hay dos caminos:
> - **Simple:** la web cobra y notifica; el cliente emite la factura por el
>   **Portal Web SIN** (manual, gratis). Recomendado para pequeños.
> - **Avanzado (add-on):** integrar emisión vía **Facturación Electrónica en
>   Línea** (requiere firma digital del cliente + proveedor SIAT). Mayor costo,
>   se cotiza aparte. **Confirmar con contador del cliente** — no asumir.

---

## 4. Cobros online con QR / pago automático

> QR Simple (interbancario, normado por el BCB) es **la vía e-commerce más
> adoptada en Bolivia**. Para tarjeta Visa/Mastercard se necesita procesador
> aparte (VisaNet Bolivia / Fiserv).

### Opciones documentadas

| Opción | Qué es | Automatización (webhook/API) | Notas |
|---|---|---|---|
| **BCP – APIs Pagos QR Simple** | QR interbancario directo del banco del cliente | Sí: Generación QR + notificación/Consulta Pagos QR | Vía más directa. Cliente firma contrato BCP. Ver `BCP_PASARELA_CREDENCIALES_INTERNO.md` |
| **Libélula (pasarela multicanal)** | Agregador: QR, tarjetas, Tigo Money | Sí: API + webhooks de confirmación | Útil si quieren varios métodos en un solo checkout |
| **PagosNet / Red Enlace (ASOBAN)** | Agregador bancario; QR + tarjetas | Sí: plugins WooCommerce/Shopify + API | Bueno si la tienda usa WooCommerce/Shopify |
| **Tigo Money** | Billetera móvil, QR; alcance en no bancarizados | Cobro QR; integrable vía libélula | Complemento, no reemplaza QR bancario |

### Flujo de pago automático (lado ONIA — n8n `pago→orden→mensaje`)
1. Checkout llama a la **API de generación de QR** (monto + referencia de orden).
2. Cliente paga escaneando el QR desde su banca/billetera.
3. El proveedor notifica el pago aprobado vía **webhook** (o se consulta por API).
4. **n8n** valida el pago → genera la orden → dispara **confirmación + mensaje**
   (WhatsApp/email) → (opcional) gatilla emisión de factura.

> Credenciales: guardar como **credencial segura en n8n** / variables de entorno.
> Nunca en el repo ni en el código. Las credenciales **las consigue el cliente**.

### Requisitos del cliente para activar QR/pasarela
- Cuenta **empresa/comercial** en su banco.
- **NIT** + **Matrícula SEPREC**.
- Documento del representante legal.
- Contrato de cobros electrónicos firmado por el **dueño** (responsabilidad
  legal del cliente, exigido por ASFI).

---

## 5. Checklist por cliente (operativo)

**Formalización (si vende online):**
- [ ] Matrícula de Comercio **SEPREC** vigente
- [ ] **NIT** activo
- [ ] Modalidad de **facturación en línea** definida (Portal Web gratis / Electrónica)
- [ ] Cuenta **empresa** en banco

**Pagos:**
- [ ] Proveedor QR/pasarela elegido (BCP / libélula / PagosNet / Tigo Money)
- [ ] Contrato de cobros firmado por el cliente
- [ ] Credenciales API recibidas por el cliente y compartidas seguro a ONIA
- [ ] Webhook de confirmación probado (pago aprobado / rechazado)

**Automatización (add-on Nivel 3):**
- [ ] Flujo n8n `pago→orden→mensaje` configurado
- [ ] (Opcional) emisión de factura automática vía SIAT

---

## 6. Bloque para PROPUESTAS (texto al cliente — copiar/pegar)

> Pegar en la sección de requisitos/alcance de la propuesta cuando el proyecto
> incluya **cobros online**. Redactado para el cliente (no menciona temas
> internos). Ajustar según paquete.

```
Requisitos a cargo del cliente (cobros en línea)

Para habilitar los pagos en línea en su sitio, el negocio deberá contar con la
siguiente documentación a su nombre (lo acompañamos en cada paso):

• Matrícula de Comercio vigente (SEPREC).
• NIT activo y modalidad de facturación en línea definida ante el SIN
  (existe un Portal Web gratuito del SIN para negocios pequeños).
• Cuenta empresarial en su banco.
• Contrato de cobros electrónicos / credenciales de la pasarela de pago QR
  (BCP QR Simple u otra), firmado por el titular del negocio.

ONIA se encarga de toda la integración técnica: checkout con QR, confirmación
automática del pago, generación de la orden y envío de mensaje al cliente
(WhatsApp/email). Los costos de terceros (comisión de la pasarela, dominio,
hosting) corren por cuenta del cliente y no están incluidos en este precio.
```

---

## 7. Por confirmar / no asumir

- Aranceles SEPREC exactos para SRL/SA y rubros regulados.
- Si el cliente requiere **factura automática integrada**: confirmar proveedor
  SIAT y firma digital con su contador (se cotiza como add-on).
- Sandbox y formato de credenciales de cada pasarela (ver doc BCP).
- Comisiones de cada proveedor QR (las paga el cliente).

Fuentes: seprec.gob.bo (trámite 1, costos), impuestos.gob.bo / SIN (facturación
en línea, plazos grupos 9–12), bcp.com.bo/Desarrollo (APIs QR Simple),
libelula.bo (pasarela multicanal), Red Enlace/PagosNet, Tigo Money.
