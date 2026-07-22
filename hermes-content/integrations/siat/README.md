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
  29 tests.
- `src/emission.mjs` — **ensamblador de emision (la glue)**: `assembleEmission`
  orquesta el flujo COMPLETO payload -> CUF -> XML -> gzip+base64 -> `hashArchivo`
  SHA-256 -> request de recepcion, reusando cuf/xml-builder/soap-client/
  tenant-registry. Prueba que las piezas encajan punta a punta; fechas como
  parametro (el `fechaHora` del CUF y el `<fechaEmision>` del XML calzan por
  construccion). 17 tests.
- `src/soap-transport.mjs` — **transporte HTTP** con `fetch` INYECTABLE (testeable
  sin red): `postSoap` (POST + `Authorization: Token` + timeout + reintentos/backoff
  ante red/5xx, NO ante 4xx/fault de negocio) + `classifyResponse`
  (ok/network/server/soap_fault/business). 19 tests.
- `src/catalog-store.mjs` — **store puro de las parametricas** sincronizadas (11
  catalogos: productos/unidades/tipos doc/leyendas/motivos de anulacion...) +
  `isStale` (resync diario). El store es un contenedor; los valores llegan del SIN.
  34 tests.
- `ONBOARDING_CLIENTE.md` — runbook operativo: los pasos EXACTOS del cliente para
  asociar el sistema + generar su token delegado + configurar sucursales/PdV +
  homologar catalogo (modelo Proveedor; se ata a las funciones del tenant registry).
- `src/emitter.mjs` — **el ORQUESTADOR (API publica del emisor)**: `emitInvoice`
  ata TODO en una sola llamada — valida el tenant -> ensambla (CUF+XML+archivo) ->
  POSTea (transporte INYECTABLE) -> mapea el `codigoEstado` del SIN (908 validada /
  904 observada / 901 pendiente / error rechazada) a la transicion de la maquina
  de estados; si el transporte cae, la factura sigue en cola (no entregada). Es lo
  que un producto llama. Testeado de punta a punta con un SIN simulado; listo para
  el fetch real + token del piloto. 8 tests. **Total emisor: 262 tests.**

**Pendiente (necesita NIT / ambiente piloto / Anexo Tecnico oficial):**
- **Ejecutar contra el piloto real.** El transporte (`postSoap`, con fetch +
  reintentos + auth) ya esta construido y testeado con mock; falta correrlo de
  verdad contra `pilotosiatservicios.impuestos.gob.bo/v2` con el **token delegado
  real del piloto (S2)** e inyectarle el `fetch` de Node. Ahi se cierra el ciclo
  CUIS -> CUFD -> recepcion -> validacion contra el SIN.
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
