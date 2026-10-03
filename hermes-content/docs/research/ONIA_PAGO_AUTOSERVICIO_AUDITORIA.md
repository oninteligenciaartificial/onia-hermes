# Auditoría: cobro automático y autoservicio de Onia Platform

> 3-oct-2026 · madre v2, por pedido de Sergio Urcullo vía madre v1. Solo lectura, sin código.
> Alimenta los puntos 1 y 2 de `ONIA_PLAN_1.0_Y_CAJA.md` (cobro con QR y checkout).
> **META:** saber qué falta para que una clínica pruebe, pague y renueve sin que intervenga una persona.
> **PRUEBA DE HECHO:** cada fila cita una URL o un `archivo:línea` de `onia-platform` en `origin/master` @13b67dda.
> **REGLA DE PARADA:** lo que no tiene fuente dice «sin dato» o «no confirmado». No se rellena.

## Resumen

- **Hoy el autoservicio se corta en el pago.** Alta, prueba de 14 días, elección del plan y subida del comprobante
  funcionan solos. **Cada pago lo aprueba un superadmin a mano** y la renovación repite QR + comprobante.
- **El único bloqueo legal es la factura:** cada cobro necesita factura en línea, y cobrar sin factura arriesga
  una clausura de 6 a 48 días. El Portal Web en Línea del SIN ya está activo: se puede facturar a mano.
- **La palanca más barata ya está escrita:** el QR dinámico del BCP y su webhook existen en el código, apagados.
  Solo faltan las credenciales del banco (trámite en curso). Con ellos, el pago se aprueba solo.
- Los competidores cobran todos dentro del panel, con mora escalonada y reactivación automática. En Bolivia no
  existe débito automático a tarjeta: lo equivalente es un QR por período con la misma escalera.

## (a) Cómo cobran y dan de alta sin humanos los mejores

| Producto | Prueba | Checkout | Recurrente | Si falla el pago | Factura | Baja |
|---|---|---|---|---|---|---|
| Alegra | 15 días, sin tarjeta | En la app; tarjeta | Mensual/anual, automático | Aviso 3 días antes; 4 reintentos; suspende; reactiva al pagar | Sí, descargable | Por formulario; queda solo lectura |
| Siigo | Sin prueba (demo) | Tienda: tarjeta, PSE, Efecty; o asesor | Anual, se renueva sola | Suspende; puede borrar a los 30 días | Electrónica, automática | Aviso escrito; 30 días para exportar |
| Holded | 14 días, sin tarjeta | Autoservicio; solo tarjeta | Mensual/anual | Bloquea hasta pagar ("Pay now") | En Suscripción | Autoservicio |
| Odoo | ~14 días, sin tarjeta | "Buy now"; medios sin dato | Mensual/anual, se renueva | 3 recordatorios; corta a los 21 días | Sí | Aviso 30 días antes |
| Bind ERP | Hasta 15 días | Tarjeta, SPEI, MSI | Anual/trimestral | Cancela al día siguiente | sin dato | Correo a soporte |
| AgendaPro | 7 días, sin tarjeta | En el panel; tarjeta | Mensual o anual | 20 días; después suspende | Mensual, automática | Formulario; fin de ciclo |
| Doctocliq | 7 días, sin tarjeta | "Contrata un plan"; medios sin dato | Mensual/semestral/anual | sin dato | sin dato | Baja a plan Gratis sin perder datos |
| Dentalink | Solo por ventas | Asesor → portal: tarjeta (dLocal/Webpay) | Mensual/semestral/anual | Día 8 alertas; día 15 suspende; día 30 borra | Comprobante + factura al día siguiente | Por el ejecutivo |

Fuentes: ayuda.alegra.com/col/como-pagar-tu-plan · Condiciones Siigo Nube v7-02-2024 §8-9 · help.holded.com
(art. 7902399) · odoo.com/documentation/19.0/legal/terms/enterprise.html §6.6 · ayuda.bind.com.mx (art. 360007626733,
confianza baja: anti-bot) · agendapro.com/cl/terminos-y-condiciones · doctocliq.com/planes-y-precios +
`hermes-content/research/competencia/DOCTOCLIQ_TEARDOWN.md` · ayuda.softwaredentalink.com (art. 9488175).

**Patrones para copiar:** prueba sin tarjeta y pago dentro del panel · mora con días fijos y reactivación automática
al pagar · una factura por cobro, descargable · en vez de cancelar, bajar a solo lectura o a gratis sin borrar datos.

## (b) Normas de Bolivia que aplican

| Norma | Qué le exige a Onia | Fuente |
|---|---|---|
| Ley 453 (consumidor) | Cubre a personas jurídicas que usan el servicio como destinatarias finales (art. 5): una clínica entra. Precio total en Bs con impuestos (art. 14.4); aviso previo de cambio de tarifa (14.5); devolver lo cobrado por error (30); atender reclamos directo (DS 2130 art. 33). **No hay derecho de retracto.** | Ley 453 arts. 5, 13, 14, 26, 30; DS 2130 (lexivox.org, compilador) |
| Contrato de adhesión | T&C claros, en castellano, con medios de pago y sin remitir a documentos no entregados (art. 21). Las cláusulas abusivas se tienen por no puestas (art. 22): cambiar el contrato por cuenta propia, eximirse de responsabilidad, el silencio como aceptación de pagos extra, compartir datos. | Ley 453 arts. 19-22; DS 2130 art. 11 |
| Aceptación en línea | El contrato electrónico es válido (art. 86), pero sin firma digital vale como indicio (art. 87): **registrar cada aceptación** (versión, fecha, cuenta, IP). | Ley 164 arts. 78, 86, 87 |
| Factura SIAT (IVA) | En servicios, el IVA nace al cobrar: **una factura por cada cobro**. Desde el 01-oct-2026 los grupos 9-12 facturan solo con la modalidad asignada; el Portal Web en Línea de Onia cumple, pero es manual. Automatizar = sistema propio certificado (Fase 1 en curso). | Ley 843 art. 4 b); RND 102600000007 (23-mar-2026); RND 102100000011 (impuestos.gob.bo) |
| Cobrar sin factura | Clausura de 6 a 48 días, que se duplica si se reincide; la primera vez se puede convertir en una multa de 10 veces el monto. | Ley 2492 arts. 164 y 170 |
| IUE-BE | Pagos a Anthropic, hosting o Meta: se retiene el **12,5 % de lo pagado** (Form. 530). Pagando con tarjeta, lo pone Onia de su bolsillo (interpretación). | Ley 843 arts. 44 b y 51; DS 24051 art. 34 |
| ASFI / BCB (QR) | Cobrar en la cuenta propia del BCP por el servicio propio **no requiere licencia** (interpretación: no se mueve plata de terceros). Si Onia cobrara por cuenta de sus clientes y después les liquidara, pasaría a ser una pasarela. | Ley 393 art. 19; BCB RD 079/2022 y RD 111/2024; ASFI/418/2024 (fuente secundaria: emba.com.bo) |
| Datos personales | No hay ley integral. Rigen CPE arts. 21.2 y 130 y el Reglamento del DS 1793, art. 56: consentimiento previo, finalidad y seguridad; art. 57: dejar darse de baja de los correos. | CPE; DS 1793 (lexivox.org); misdatos.internetbolivia.org |

**Bloquea:** solo la factura por cobro. **Riesgo bajo:** ASFI, retracto, datos (con los mínimos de arriba).
**No confirmado:** si la autoridad aplica la Ley 453 a un SaaS B2B · si hay que registrar el contrato de adhesión ·
si el art. 56 del DS 1793 vale en general · el vencimiento del Form. 530 · si en 2026 hay ley de datos o IVA a servicios
digitales. ⚠️ `ONIA_OPTIMIZACION_FISCAL_PROPIA_2026.md` §7 cita el DS 4732 como IVA digital y es falso: ese decreto trata
la venta de inmuebles a futuro.

## (c) El flujo real hoy (onia-platform, `origin/master` @13b67dda)

| Paso | Hoy | Detalle | archivo:línea |
|---|---|---|---|
| Alta | AUTO si `ONIA_ALTA_AUTOMATICA=abierta` | El valor por defecto en código es CERRADA (formulario de pedido). En prod se midió abierta el 3-sep; no se volvió a medir | `lib/registration.ts:20`, `app/(auth)/register/page.tsx:32` |
| Prueba | AUTO | 14 días, plan professional, sin tarjeta; correos los días 3/7/12/14/15 (cron del VPS) | `lib/subscription/plan-state.ts:22,29`, `app/api/cron/trial-drip/route.ts:22` |
| Elegir plan | AUTO | /checkout con montos de `getPlanCatalog()` (320/550/890/1290 Bs); Enterprise por WhatsApp | `lib/subscription-plans.ts:39-44`, `app/checkout/page.tsx:99` |
| QR | ESTÁTICO, monto abierto | El dinámico por monto está escrito pero apagado (sin `BCP_QR_*`) | `lib/checkout/qr-estatico.ts:1-25`, `lib/gateway/bcp-qr.ts:95` |
| Comprobante | MANUAL (cliente) | Sube una imagen; queda PENDING; el servidor valida el monto del catálogo | `app/api/subscription-payment/route.ts:110,165-209` |
| Aprobación | **MANUAL (superadmin)** | Mira el comprobante, lo compara con el banco y aprueba en /admin/payments | `app/api/admin/subscription-payments/route.ts:73-87` |
| Conciliación | NO EXISTE | `evaluateAutoApproval` aprueba solo con `bank_webhook`/`bank_statement`, y nada los entrega | `lib/subscription/activation.ts:246-275`, `app/api/webhooks/bcp/route.ts:1-20` |
| Activación | AUTO al aprobar | Plan, `planEnd` desde max(vencimiento, hoy); aviso al dueño | `lib/subscription/activation.ts:69,169` |
| Factura de Onia | NO EXISTE | `SIAT_EMISSION` apagado, y solo cubre las facturas del cliente a SUS clientes | `.env.example:242`, `lib/fiscal/flags.ts:15` |
| Renovación | AUTO el aviso, MANUAL el pago | D-7, D-3, D-1 y vencido; renovar = QR + comprobante otra vez | `lib/subscription/renewal-reminders.ts:11-14` |
| Mora | AUTO | 1 día de gracia solo al terminar la prueba; el plan pago corta el día que vence → solo lectura (403) | `plan-state.ts:32,85-91`, `proxy.ts:300` |
| Baja | MANUAL (operador) | El cliente no tiene botón; si no paga, queda en solo lectura | `app/api/admin/clinics/route.ts:250-256` |

## (d) Propuesta para automatizar al máximo, en orden

| # | Qué | Esfuerzo | Riesgo | META / PRUEBA / PARADA |
|---|---|---|---|---|
| 1 | **Factura por cada cobro, a mano en el Portal Web del SIN, al aprobar** (concierge, válido en la Etapa 1). Checklist en /admin/payments: «factura emitida N°». | Bajo | Bajo | META: 0 cobros sin factura. PRUEBA: n.º de factura junto a cada pago aprobado. PARADA: si no se puede emitir, no se aprueba el pago. |
| 2 | **QR dinámico del BCP + webhook → aprobación automática** (el código existe; faltan las credenciales del trámite del BCP). Saca el monto abierto y al superadmin del medio. | Bajo-medio | Medio (banco) | META: pago → plan activo sin humano. PRUEBA: un pago real de prueba se aprueba solo y queda en el log del webhook. PARADA: sin credenciales del BCP no se toca nada. |
| 3 | **Escalera de mora para el plan pago:** hoy corta el mismo día. Pasar a aviso D-7/D-3/D-1 (ya existe) + 7 días de gracia + solo lectura; reactivación automática al pagar (ya existe). | Bajo | Bajo | META: ningún cliente queda en solo lectura el día que vence. PRUEBA: test de `plan-state` con planEnd+3 → sigue escribiendo. PARADA: no borrar datos nunca (todos los competidores que borran lo avisan con 30 días). |
| 4 | **Baja en autoservicio:** botón «no renovar», que deja la cuenta en solo lectura al fin del período. | Bajo | Bajo | META: el cliente se da de baja sin escribirnos. PRUEBA: botón visible y probado en una cuenta de prueba. PARADA: sin borrar datos ni prometer reembolsos. |
| 5 | **T&C conforme a la Ley 453/164:** guardar versión, fecha, cuenta e IP de cada aceptación; mostrar el precio en Bs con impuestos; avisar los cambios de tarifa antes. | Bajo | Bajo | META: cada cuenta tiene su aceptación registrada. PRUEBA: fila en la base por alta nueva. PARADA: el texto legal nuevo pasa por Sergio Urcullo (regla «Qué se publica sin preguntar»). |
| 6 | **Vigilar `ONIA_ALTA_AUTOMATICA=abierta`** en prod: si vuelve al valor por defecto, el alta pasa a ser manual sin que nadie se entere. | Trivial | Bajo | META: alerta si cambia. PRUEBA: el chequeo corre en el vigía. PARADA: — |
| 7 | **Factura automática** (sistema propio certificado, Fase 1 SIAT) llamada al aprobar. | Alto | Alto (fiscal) | META: factura emitida sola por cobro. PARADA: hasta tener la certificación, se queda el punto 1. |
| 8 | Tarjeta por pasarela (dLocal, como Dentalink): **congelado**. Stripe no acepta Bolivia y el QR alcanza para la Etapa 1. | Medio | Medio | Se reabre con más de 20 clientes o si un cliente lo pide. |

**Orden recomendado:** 1 y 6 ya (sin código o casi), 3-4-5 en una tanda chica, 2 apenas lleguen las credenciales del
BCP, y 7 cuando termine la certificación. Con 1+2+3+4 el ciclo entero corre sin humanos, salvo la factura.
