# Emisor SIAT — `@onia/siat-emitter`

Servicio fiscal compartido de la factory ONIA (Bolivia). Emite facturas
electronicas ante el SIN por todos los verticales (DentalGest, GestiOS,
ProveeGest) como un solo servicio multi-tenant. Es el `external_gate: siat` del
contrato: **el core nunca factura por si mismo** — el emisor emite y el producto
persiste el resultado (CUF/XML/respuesta) en sus entidades del core (`Document`
adjunto a la venta, `WorkItem` para factura observada, `ApprovalRequest` para
anulacion, `ActivityEvent` para todo).

Diseno completo: `onia-core/ONIA_SIAT_CERTIFICACION_PLAN_2026.md` (tramite,
arquitectura, cronograma). Esto es el arranque tecnico del servicio.

## Estado (2026-07-08) — arranque, NO produccion

**Listo (offline, sin depender del NIT ni del Anexo Tecnico):**
- `src/constants.mjs` — constantes SIAT verificables (estados SIN 901/904/908,
  modalidades, plazos legales, limites de paquete, ambientes piloto/prod). Lo no
  confirmado contra el Anexo oficial esta marcado `[VERIFICAR]`.
- `src/emission-state.mjs` — maquina de estados de la emision (el corazon
  operativo de la cola): `draft -> queued -> sent -> validated|observed|rejected`,
  anulacion con plazo (dia 9 del mes siguiente), reversion por unica vez,
  deteccion de envio offline vencido (48h). Pura, inmutable, 19 tests.

**Pendiente (necesita NIT / ambiente piloto / Anexo Tecnico oficial):**
- Cliente SOAP al SIN (CUIS por sistema, CUFD diario, recepcion, validacion,
  anulacion) contra `pilotosiatservicios.impuestos.gob.bo`.
- Builder XML por tipo de documento sector + validacion XSD + hash SHA-256
  (computarizada) / firma XMLDSig (electronica). **Reusa el CUF del core**
  (`onia-core/modules/invoicing.logic.mjs`: `buildCuf`/`mod11CheckDigit`/
  `buildQrUrl`) — que HOY tiene advertencias explicitas: el ancho de
  `invoiceNumber` (8 vs 10 segun la fuente) y el algoritmo exacto de Modulo 11
  no estan 100% confirmados contra `GENERACION-CUF.pdf`. NO usar para emitir un
  CUF real sin verificar el Anexo. Portarlo con la receta anti-drift
  (`ONIA_CORE_LOGIC_PORTING_RECIPE_2026.md`).
- Tenant registry (NIT, tokens delegados cifrados, sucursales, puntos de venta,
  catalogo homologado por organizacion) + scheduler CUFD/CUIS + contingencia.

## Bloqueo #1 (Sergio) — AVANZANDO 2026-07-08

- **NIT ONIA: ✅ obtenido** (ante Impuestos Nacionales / SIN).
- **Matricula SEPREC: ⏳ en tramite** (esperando aceptacion, aun no aprobada).

Con el NIT activo probablemente YA se pueden pedir las credenciales SIAT en
linea y acceder al piloto; si el registro del sistema como PROVEEDOR requiere el
SEPREC aprobado o solo el NIT esta EN VERIFICACION (subagente de investigacion
2026-07-08, tema de tramite boliviano — no asumir sin fuente). Ver el plan
`onia-core/ONIA_SIAT_CERTIFICACION_PLAN_2026.md` (checklist §4) para el detalle.

TODO el desarrollo tecnico de arriba (constantes, maquina de estados, builder
XML, cliente SOAP contra el piloto con specs publicas) avanza en paralelo sin
depender de ninguno de los dos.

## Regla de secretos

NIT, tokens delegados y credenciales SIAT viven SOLO en el env/vault del VPS
(ver `.env.example`), nunca en git ni en el core. El token delegado es por
organizacion (lo genera el cliente en SIAT) y se guarda cifrado.

## Correr

```bash
node --test hermes-content/integrations/siat/test/*.test.mjs
```
