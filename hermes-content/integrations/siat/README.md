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
  modalidades, plazos legales, limites de paquete, ambientes piloto/prod, tipo
  de doc sector, tipos de doc de identidad, consumidor final). Lo no confirmado
  contra el Anexo/catalogo oficial esta marcado `[VERIFICAR]`.
- `src/emission-state.mjs` — maquina de estados de la emision (el corazon
  operativo de la cola): `draft -> queued -> sent -> validated|observed|rejected`,
  anulacion con plazo (dia 9 del mes siguiente), reversion por unica vez,
  deteccion de envio offline vencido (48h). Pura, inmutable, 19 tests.
- `src/invoice-payload.mjs` — contrato del PAYLOAD NORMALIZADO (la API interna
  que un producto le manda al emisor: `POST /api/fiscal/invoices`). Diseño
  nuestro, NO depende de los WSDLs/XSD del SIN. `buildInvoicePayload` normaliza y
  deriva totales; `validateInvoicePayload` chequea presencia, items, homologacion,
  coherencia de totales y formato basico. Le da a los equipos de producto un
  objetivo concreto (que enviar). 13 tests.
- `src/cuf.mjs` — **generador del CUF VERIFICADO contra el Anexo Tecnico oficial**
  (siatinfo.impuestos.gob.bo, verificado 2026-07-22). Resuelve el flag que
  arrastraba el core: el numero de factura es de **10 digitos** (no 8) y el CUF
  final concatena el **codigo de control del CUFD**. Pasos oficiales: payload de
  53 digitos (NIT 13 + fechaHora 17 + sucursal 4 + modalidad 1 + tipoEmision 1 +
  tipoFactura 1 + tipoDocSector 2 + nroFactura 10 + PdV 4) -> digito Modulo 11
  (2..9 ciclico, `suma % 11`, 10->1/11->0) -> base 16 -> + codigoControl. El
  Modulo 11 esta anclado al **ejemplo oficial del SIAT** ("12345" -> 6) como test
  dorado. 13 tests.
- `src/xml-builder.mjs` — **builder del XML de la factura de compra-venta +
  huella SHA-256**. Estructura VERIFICADA 2026-07-22 contra la pagina oficial del
  XML/XSD: 30 campos de `<cabecera>` + 11 de `<detalle>` EN ORDEN (el XSD es
  sequence-sensitive), con manejo correcto de nillables (`<campo xsi:nil="true"/>`
  para opcionales vacios, gotcha del SIAT). `buildInvoiceXml` arma el documento
  por modalidad (raiz computarizada/electronica) y `sha256Hex` da la huella
  (anclada al vector conocido de "abc"). 12 tests.
- `src/tenant-registry.mjs` — **registro MULTI-TENANT** (por organizacion): NIT,
  codigoSistema, sucursales, puntos de venta, metadata del token delegado
  (referencia al vault, NUNCA el valor en claro) y catalogo homologado.
  `validateTenantReady` decide si un tenant puede emitir. Puro/inmutable. 40 tests.
- `src/scheduler.mjs` — renovacion de **CUFD** (diario, 24h) y **CUIS** (renovable
  5 dias antes de vencer); fechas siempre como parametro. 28 tests.
- `src/contingencia.mjs` — **modo offline**: caida del SIN -> evento significativo
  -> paquetes <=500 -> reenvio 48h; clasifica estados 901/904/908. 30 tests.
- `src/soap-client.mjs` — **capa PURA del cliente SOAP**: builders de envelope
  (CUIS/CUFD/recepcion/anulacion/verificarComunicacion) + parser de respuesta
  tolerante. Operaciones y codigos VERIFICADOS 2026-07-22 contra los **WSDL v2 del
  piloto** + doc oficial: `codigoAmbiente` 1=prod/2=piloto (al reves de lo
  intuitivo), `codigoModalidad` 2=computarizada, archivo gzip+base64, `hashArchivo`
  SHA-256. Auth por header HTTP `Authorization: Token X` (NO en el SOAP). El
  transporte HTTP real queda fuera (capa aparte, necesita credenciales del piloto).
  Los nombres exactos de wrapper/namespace van `[VERIFICAR]` contra el WSDL de tipos.
  29 tests. **Total emisor: 184 tests.**

**Pendiente (necesita NIT / ambiente piloto / Anexo Tecnico oficial):**
- **Transporte HTTP** del cliente SOAP (POST del envelope + header
  `Authorization: Token` + timeouts/reintentos) contra
  `pilotosiatservicios.impuestos.gob.bo/v2` — necesita el token delegado del
  piloto. La capa PURA (envelopes + parser de respuesta) ya esta lista en
  `src/soap-client.mjs`; solo falta enchufarle la red y las credenciales.
- Confirmar los `[VERIFICAR]` del SOAP (nombre exacto del wrapper del DTO,
  targetNamespace por servicio, SOAP 1.1 vs 1.2) contra el WSDL de tipos
  importado del piloto (`?wsdl=ServicioFacturacion.wsdl`) — devolvio 503
  intermitente en la investigacion; reintentar.
- Validacion del XML contra el **XSD oficial descargado** (confirmar el nombre
  exacto del elemento raiz computarizada vs electronica y los tipos por campo) +
  **firma XMLDSig** para la modalidad electronica en linea (la computarizada usa
  solo la huella SHA-256, ya lista). El XML se arma con el **CUF verificado del
  emisor** (`src/cuf.mjs`), no con el `buildCuf` de referencia del core.
  Descargar el XSD del piloto y correr una validacion real.
- **Store de catalogos sincronizados** (parametricas: productos/servicios,
  unidades de medida, tipos de documento, leyendas, motivos de anulacion) —
  sincronizacion diaria por web service (limite 1000 requests/dia). El tenant
  registry, el scheduler CUFD/CUIS y la contingencia YA estan listos (pura logica).

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
