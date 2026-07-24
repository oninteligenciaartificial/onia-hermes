# ONIA — Pasarelas de pago multi-tenant en Bolivia: decisión y arquitectura (2026)

Fecha: 2026-07-24. Estado: DECISIÓN + research con fuentes. Owner: ONIA.
Responde a Sergio: cómo hacer que cada clínica cobre en SU cuenta desde el sistema, sin que ONIA sea intermediario ni pague/cobre comisiones. Investigado con subagentes (fuentes citadas abajo).

> Esto NO es asesoría legal/fiscal definitiva. Los puntos ASFI y LLC/EE.UU. deben
> confirmarse con abogado/contador (Bolivia + US). Marcado `[CONFIRMAR]` donde aplica.

---

## 0. La decisión (TL;DR)

- **Modelo: "Facilitador", NO "Agregador".** ONIA nunca toca el dinero de los pacientes. Cada clínica cobra en SU propia cuenta; ONIA solo es el software que dispara el cobro y cobra su suscripción mensual. Base legal: Reglamento de Servicios de Pago del BCB (Res. **079/2022**).
- **Riel de cobro comisión-cero: QR Simple interoperable** (normado por BCB, Res. 137/2019). El QR lleva la cuenta del receptor → la plata cae directo en la cuenta de la clínica, en segundos. Comisión Bs 0 al comercio (`[CONFIRMAR]` número exacto por banco).
- **Arquitectura técnica: multi-tenant "connected accounts / BYO".** DentalGest guarda una credencial de cobro POR CLÍNICA (cifrada) y la usa al generar cada QR. Comisión de plataforma para ONIA = 0.
- **Cuenta que abre ONIA:** en **BNB** (único con sandbox confirmado) para (a) cobrar la suscripción del SaaS y (b) acceso developer para construir/probar la integración. En paralelo pedir doc a BCP y preguntar al BCB por OpenBCB.
- **Lo que abre cada CLÍNICA:** cuenta empresa + "Cobros QR / QR Simple para empresas" en BNB o BCP (mismo banco que ONIA integra = QR dinámico + conciliación automática). Si ya tiene otro banco, funciona con QR estático (interoperable, comisión 0, sin automatización).
- **Stripe/LLC EE.UU.: SOLO para clientes GLOBALES.** Bolivia no está soportado por Stripe y Stripe Connect no paga a cuentas bolivianas. La LLC tiene sentido cuando haya volumen internacional real, no para pagos de clínicas bolivianas.

---

## 1. Por qué Facilitador y no Agregador (lo legal)

| | Agregador (EVITAR) | Facilitador (ONIA) |
|---|---|---|
| Flujo del dinero | Entra a la cuenta de ONIA, se agrupa y se remite a la clínica menos fee | Va DIRECTO a la cuenta de la clínica; ONIA no lo toca |
| Regulación | Figura REGULADA por ASFI (Res. BCB 079/2022); solo personas jurídicas autorizadas — un unipersonal NO califica | Proveedor de software; no retiene fondos |
| Riesgo fiscal | IT 3% sobre TODO el bruto que fluye + posible IVA/IUE + UIF | ONIA solo factura su suscripción (su única base imponible) |

`[CONFIRMAR con abogado/banco]` si ONIA debe registrarse como Administradora de Pasarela de Pago (Facilitador) ante ASFI, o basta ser integrador técnico sobre el convenio banco↔clínica. La figura "Facilitador" (fondos directos al comercio) es la del Reglamento; el detalle de registro no se verificó en texto oficial completo.

## 2. El habilitador técnico: QR Simple interoperable
- Interoperable entre TODOS los bancos/billeteras (paga uno de cualquier banco, cobra el de cualquier banco).
- El QR incluye monto, nombre del titular, cuenta y entidad del receptor → acredita directo a esa cuenta. Existe QR dinámico (monto + vencimiento por transacción).
- Comisión por transacción Bs 0 al comercio en QR Simple (`[CONFIRMAR]` por banco; Banco Ganadero publicita "sin comisiones").

## 3. Bancos con API (confirmado por research)

| Banco | API pública | Notas |
|---|---|---|
| **BNB** | ✅ `PortalBNB/Api` (BNBCommerce) **+ Sandbox** | Recomendado para construir/probar. QR dinámico, alertas, reportes |
| **BCP** | ✅ `bcp.com.bo/Desarrollo` "APIs Pagos QR Simple" | Doc tras formulario |
| **Banco Ganadero** | ✅ "Cobros QR Empresas" (web service) | "Abono directo a tu cuenta, sin comisiones"; requiere ser cliente |
| **BISA** | ✅ "BISA QR para Empresas" (API Key) | — |
| **OpenBCB** (Banco Central) | ⚠️ API **gratis** (oct-2025) | Neutral; acceso real de SaaS privado `[CONFIRMAR]` con BCB |
| Mercantil SC / Unión / Económico / FIE | ❌ no confirmada | QR sí; API por convenio directo |

⚠️ Trampa: `apiportal.mercantilbanco.com` es de **Mercantil de Venezuela**, NO del Mercantil Santa Cruz de Bolivia.

## 4. Alternativas con comisión (para tarjeta / cobertura multi-banco rápida)
- **Libélula** (`libelula.bo`, de Todotix): 1 API RESTful (tarjeta + QR), **2.5%** que paga la CLÍNICA, sin cuota mensual, onboarding ~24h/comercio. NO es marketplace/split (no existe uno boliviano). Útil para cubrir clínicas de cualquier banco sin integrar uno por uno.
- PagosNet (Síntesis SA) ~3-3.5% + integración. Payme 3.89%+1Bs (solo tarjeta).
- Tarjeta SIEMPRE tiene comisión (red + banco): inevitable, la paga la clínica si la quiere.

## 5. Stripe + LLC EE.UU. (solo global)
- Bolivia NO soportado por Stripe (LatAm: solo Brasil/México). Stripe Connect no paga a cuentas bolivianas (payouts solo US/UK/EEE/Canadá/Suiza).
- Rutear pagos bolivianos por LLC/Stripe choca con escasez de dólares + restricciones cambiarias + doble carga fiscal. NO hacerlo.
- LLC US (vía Stripe Atlas ~USD 500 + ~USD 100/año; Form 5472 obligatorio) tiene sentido para clientes GLOBALES cuando haya volumen. `[CONFIRMAR fiscal US + Bolivia con contador]`.

## 6. Las 7 preguntas para la reunión con BCP / BNB
1. ¿Un SaaS puede generar QR en nombre de MUCHAS clínicas (cada una su cuenta) bajo UNA sola integración, o convenio por clínica? *(la pregunta clave del multi-tenant)*
2. ¿El dinero de cada QR cae directo en la cuenta de la clínica, sin cuenta puente? *(Facilitador)*
3. ¿Comisión por transacción del QR al comercio + costo mensual del servicio/cuenta?
4. ¿Webhook/notificación en tiempo real por pago? *(sin esto no hay conciliación automática)*
5. ¿QR dinámico (monto por cobro) o solo estático?
6. ¿Qué necesita la clínica para activar el Cobro QR (requisitos, tiempos)?
7. ¿ONIA debe registrarse ante ASFI como pasarela/Facilitador, o basta integrador técnico?

## 7. Impacto en DentalGest (código)
- Ya existe QR **estático** por clínica (comisión 0, funciona hoy). Es el fallback universal.
- Upgrade: capa "proveedor de cobro QR" abstraída (adapter por banco/pasarela) + tabla de credencial de cobro por tenant (cifrada) + QR dinámico + webhook de conciliación.
- Hoy la pasarela automática está DESHABILITADA en el código (`gatewayEnabled=false`); este es el plan para encenderla bien.

---

## Fuentes (research 2026-07-24)
- Reglamento Servicios de Pago BCB Res. 079/2022 — Ferrere, Compliance Latam, EMBA/Moreno Baldivieso, Abel Abogados.
- QR interoperable / Facilitador vs Agregador — ASFI (doc "El uso del QR ha dinamizado el sistema de pagos"), BCB Res. 137/2019.
- APIs: bcp.com.bo/Desarrollo/ApiPagosQR · bnb.com.bo/PortalBNB/Api/BNBCommerce · bg.com.bo/canales-digitales/cobros-qr · bisa.com/empresas/bisa-QR · bcb.gob.bo OpenBCB (CP-44/2025).
- Agregadores: libelula.bo · pagosnet.com.bo.
- Stripe: stripe.com/global · docs.stripe.com/connect/cross-border-payouts · Stripe Atlas.
- Ley 393 de Servicios Financieros (art. 151, ASFI competencia). IT: impuestos.com.bo.
