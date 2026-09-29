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

> **Estado del TRAMITE (solicitud 9473, avance de la Fase 1, que falta para que
> Onia Platform facture): `hermes-content/docs/ONIA_SIAT_ESTADO_HOMOLOGACION.md`.**
> Ese doc es la fuente de verdad; este README es el diseno del codigo.

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
  SHA-256. Auth por header HTTP `apikey: TokenApi X` (NO en el SOAP) —
  **verificado EN VIVO 2026-08-06 contra el piloto** (CUIS obtenido, leyendas
  sincronizadas): el `Authorization: Token X` que sugiere la doc devuelve Fault
  "EL SERVICIO REQUIERE API KEY". El
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
  sin red): `postSoap` (POST + `apikey: TokenApi` + timeout + reintentos/backoff
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
- ~~Validacion del XML contra el XSD oficial~~ **hecho 2026-09-03**: los 6 XSD del
  SIN viven en `xsd/` (sectores 1, 17 y 24, computarizada y electronica);
  `DOC_SECTOR_SCHEMAS` en `xml-builder.mjs` sale de ahi y el test los coteja
  leyendo los archivos. Los tres sectores emiten 908 en el piloto. La **firma
  XMLDSig** de la modalidad electronica esta implementada (`src/xml-signer.mjs`,
  node:crypto puro, verificada contra SignatureSchema + referencia Java del SIN)
  y cableada en la etapa VIII del runner; falta solo el certificado de prueba de
  AGETIC (tramite de Leslie). El XML se arma con el **CUF verificado del emisor**
  (`src/cuf.mjs`), no con el `buildCuf` de referencia del core.
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

## Runner de la Fase 1 — la matriz de casos

`src/fase1-runner.mjs` corre las pruebas de homologacion contra el piloto.

**El SIN cuenta COBERTURA, no volumen.** La corrida del 6-ago mando 750 emisiones
en la etapa IV y el portal contabilizo 125: las 750 eran el mismo combo. El
"Listado de Pruebas" de cada etapa muestra los casos que exige, y son el producto
de dos ejes:

- **`PUNTOS_VENTA = [0, 1]`** — CUIS y CUFD se piden por sucursal+PdV. Correr
  solo el PdV 0 deja las etapas I/II/III/V clavadas en 50%.
- **`DOC_SECTOR_CASES`** — los 3 documentos sector de la solicitud 9473:
  1 (compra-venta), 17 (hospitales/clinicas) y 24 (nota credito-debito, que va
  como documento de AJUSTE: `tipoFacturaDocumento` 3).

De ahi salen los **6 combos** de `EMISION_CASES`. Las etapas IV, VII y XI iteran
sobre los 6. VI e IX tienen matrices propias por sector, PdV, motivo y cantidad;
el detalle actualizado esta en [el estado de homologación](../../docs/ONIA_SIAT_ESTADO_HOMOLOGACION.md#4-fase-1--el-marcador-real-del-sin) §4.

Consecuencias de diseno:

- `PILOT` guarda solo lo invariante (ambiente, modalidad, sucursal). El combo en
  curso es `this.combo`, y se cambia con `withCombo()` (restaura el anterior
  aunque el callback lance).
- El estado guarda **`cuisByPv` / `cufdByPv`**, no un CUIS y un CUFD sueltos.
  `migrateState()` sube un checkpoint viejo sin perderlo.
- **Cada factura recuerda su combo.** La anulacion y la reversion buscan una
  factura del MISMO combo; si no hay, fallan con un mensaje que dice cual falta
  en vez de anular la de otro caso (que no le suma a ningun contador del SIN).
- `STAGE_TARGETS` es **por caso**; `STAGE_TOTALS` es lo que muestra el portal.
  Un test verifica que `target x casos == total` en las 10 etapas: si el SIN
  cambia un volumen, se caza antes de quemar una corrida.

**Lectura real del portal, 2026-09-27:** 80 % general, VI 150/560 e IX 60/160.
El checkpoint viejo `pv0/pv1` marcaba ambas como completas porque el runner
mandaba lotes de 2 para todas las filas, no separaba sectores/motivos ni
comprobaba `908 VALIDADA`. Esas claves se conservan como `legacyCases` pero no
cuentan en el informe. VI tiene 28 recepciones de 10 (14 exigen exactamente
500 XML; 14 exigen menos de 500) y 4 validaciones de 70. IX tiene 8
recepciones de 10 (4 exigen 1.000 XML; 4 exigen menos de 1.000) y 4
validaciones de 20. El snapshot del 27-sep esta en `portal-fase1-20260927.json`.
**No aplicar ese archivo sin volver a leer el portal el dia de la corrida.**

Para VI/IX, el runner exige `portalReconciledAt` y bloquea el envio si falta.
`--portal-snapshot` importa el marcador de una copia JSON, guarda un respaldo
`<state>.pre-portal-<timestamp>` y no necesita credenciales ni hace SOAP:

```bash
node src/fase1-runner.mjs --state /ruta/checkpoint-copia.json \
  --portal-snapshot portal-fase1-20260927.json
node src/fase1-runner.mjs --state /ruta/checkpoint-copia.json --solo-informe
```

Antes de cualquier envio real, verificar el checkpoint activo del VPS, el
marcador actualizado del portal y la etapa VIII (sus 690 validaciones viven en
un checkpoint separado). No ejecutar el orquestador de todas las etapas hasta
resolver esa fusion: podria repetir VIII. El primer caso controlado propuesto,
**solo despues de autorizar trafico al piloto**, es un evento y un paquete de
dos facturas del sector 1, PdV 0, motivo 2 (más renovación CUFD si venció):

```bash
node src/fase1-runner.mjs --state /ruta/checkpoint-conciliado.json --etapa VI \
  --case recepcion-ds1-motivo2-pv0-menor500 --count 1
```

`--case` requiere `--count` positivo y `--etapa VI|IX`; evita que el primer
ensayo recorra decenas de filas. El caso debe estar en cero antes del envio;
despues se coteja **esa fila** en el portal. Completar todo VI/IX requeriria,
desde la lectura del 27-sep, **330 recepciones, 270 eventos, 180 validaciones,
110.300 XML y al menos 780 solicitudes SOAP**. Los motivos 5/6/7 necesitan un
CAFC valido del piloto (`SIAT_PILOT_CAFC`); sin él se bloquean por caso. Su
alcance para los PdV/sectores debe verificarse antes de usarlos.

Etapa **VIII (firma digital, 690 casos)**: los mismos 6 combos en modalidad
**electronica** (codigoModalidad 1), con el XML **firmado XMLDSig**
(`src/xml-signer.mjs`, estandar verificado contra la doc del SIN — no XAdES).
Cableada en el runner el 2026-09-12: combos `*-m1`, servicios del mapa
`SERVICIO_POR_DOC_SECTOR_ELECTRONICA`, y el certificado entra por env como
RUTAS: `SIAT_FIRMA_KEY_FILE` + `SIAT_FIRMA_CERT_FILE` (en el VPS bajo
`/opt/onia-siat/certs/`, chmod 600, jamas en git). Sin esos env la etapa se
**salta con log** (la corrida de volumen no revienta); pedirla explicita sin
certificado corta con error. ⚠️ El piloto exige el certificado **de prueba
emitido por la certificadora** ("el otorgado por nosotros para pruebas", pagina
de firma invalida de siatinfo): uno autofirmado sirve para probar el circuito
pero el SIN lo rechaza — el de prueba es gratis en
`desarrollo.adsib.gob.bo/desa_solicitudes` (tramite de Leslie; pasos exactos en
`docs/ONIA_SIAT_TU_PARTE_DEL_TRAMITE.md`). Etapa **X** (masiva IEHD) no aplica
a nuestro perfil.

```bash
node src/fase1-runner.mjs --solo-informe     # solo lectura, sin SOAP
node src/fase1-runner.mjs --etapa gate       # humo: 1 por combo, solo si corresponde
node src/fase1-runner.mjs --etapa IV         # una sola
node src/fase1-runner.mjs --etapa gate-viii  # humo etapa VIII: 1 emision firmada por combo
```

Flags: `--pace ms` (default 500) · `--state file` · `--log file` ·
`--retry-blocked`. **Para trafico al piloto siempre se exige `--etapa`: invocar
el runner sin ella aborta antes de credenciales, checkpoint o SOAP.** El script
historico `run-fase1-pdv1.sh` y el barrido `run-fase1-volumen.sh` quedan
retirados: ambos abortan antes de leer credenciales. VIII vive en un checkpoint
separado; repetir todas las fases no es una forma de completar VI/IX. Requiere
`/opt/onia-siat/siat-piloto.env` en el ambiente.
La conciliacion guarda los contadores iniciales del portal y archiva recibos
anteriores. Al retomar una validacion parcial, el indice de recibos nuevos
descuenta lo que el portal ya habia contado. `general` suma casos locales;
`alcanceGeneral` recuerda que no es el porcentaje general oficial del SIN.
Con `--case`, `--count` es la **meta acumulada de esa fila**, incluidas las
operaciones ya conciliadas: si figura 5 y se busca una mas, usar `--count 6`.
Repetir la misma meta no reenvia lo completado. En una fila de validacion no
se multiplica la meta por los siete motivos ni por los dos tamanos de lote.
El sector 24 (nota de credito-debito) va por `ServicioFacturacionDocumentoAjuste`,
que **tarda 36-43 s por respuesta** (timeout propio de 120 s en
`TIMEOUT_MS_POR_SERVICIO`) y necesita una compra-venta original del mismo PdV:
el runner la emite solo si no hay una libre con `datos`.

## Wrapper HTTP — lo que Onia Platform llama (F1.4 del plan 1.0)

`src/http-wrapper.mjs` sirve el emisor por HTTP con el contrato que YA espera
`onia-platform/lib/fiscal/siat-client.ts` (el contrato lo define el caller):

```
POST /fiscal/invoices
  Authorization: Bearer <SIAT_WRAPPER_TOKEN>      # el SIAT_SERVICE_TOKEN del producto
  Idempotency-Key: invoice:<id>                   # obligatorio (sin el, 400)
  { organizationId, invoice, environment }        # invoice = NormalizedInvoicePayload
→ 200 { estado, cuf, cufd, controlCode, authorizationNumber, codigoRecepcion,
        codigoEstado, qrUrl, leyenda, delivered }
GET /health                                       # sin auth
```

Semantica de status calzada con el caller: **5xx** = el producto deja la factura
`queued` y reintenta (SIN caido, CUFD no disponible) · **4xx sin codigoEstado** =
`rejected` (entrada invalida, fail-closed) · **200** = estado derivado de
`codigoEstado` (908 validada / 904 observada / 901 pendiente / null rechazo del
SIN, con el motivo en `leyenda`).

Que hace por dentro: mapea el payload del producto al normalizado (la
homologacion sale de env: `SIAT_ACTIVIDAD_ECONOMICA` / `SIAT_CODIGO_PRODUCTO_SIN`
/ `SIAT_UNIDAD_MEDIDA`; `lineTotal < cantidad*precio` se traduce a `descuento`;
`taxId` va como CI del receptor — el producto manda `patient.ci` —, sin `taxId`
es consumidor final), renueva el **CUFD** solo (FacturacionCodigos, con el reloj
del SIN via `sincronizarFechaHora`), lleva el **correlativo** (no quema numeros
si el SIN no vio la factura) y persiste la **idempotencia** en
`wrapper-state.json` (una misma Idempotency-Key nunca emite dos veces, ni tras
reinicio; los rechazos NO se cachean para permitir reintentar con datos
corregidos). El ambiente es SIEMPRE `SIAT_ENV` (default `piloto`; el
`environment` del request debe coincidir o es 400) — nada de produccion
hardcodeada.

**Deploy (lo corre la sesion de control, NO esta deployado):**

```bash
# 1. Copiar el codigo al VPS (mismo rsync que el emisor) y crear el env:
rsync -a hermes-content/integrations/siat/ root@VPS:/opt/onia-siat/emisor/
#    /opt/onia-siat/siat-wrapper.env con el bloque del wrapper de .env.example
#    (CUIS y homologacion salen del checkpoint: comandos jq en .env.example).
# 2. Probar a mano:
ssh root@VPS 'cd /opt/onia-siat/emisor && ./run-wrapper.sh'   # Ctrl+C tras ver "escuchando"
# 3. Dejarlo como servicio (systemd):
#    /etc/systemd/system/onia-siat-wrapper.service
#      [Unit]
#      Description=Onia SIAT wrapper (emisor fiscal)
#      After=network-online.target
#      [Service]
#      ExecStart=/opt/onia-siat/emisor/run-wrapper.sh
#      Restart=always
#      RestartSec=5
#      [Install]
#      WantedBy=multi-user.target
systemctl daemon-reload && systemctl enable --now onia-siat-wrapper
# 4. Verificar MIRANDO: curl -s http://127.0.0.1:8517/health
# 5. El dia de la autorizacion, en onia-platform (recrear el contenedor):
#    SIAT_SERVICE_URL=http://<ip-alcanzable-desde-el-contenedor>:8517
#    SIAT_SERVICE_TOKEN=<el mismo SIAT_WRAPPER_TOKEN>
#    SIAT_EMISSION=1
#    ⚠️ el firewall del VPS corta contenedor→host: probar el puerto DESDE el
#    contenedor antes de dar por conectado (memoria: vps-firewall-bloquea-3000).
```

Pendiente conocido (documentado, no bloquea el piloto): un receptor con NIT
viaja como CI porque el contrato del producto no distingue el tipo de documento;
cuando el producto lo mande, el mapeo se extiende aca.

## Regla de secretos

NIT, tokens delegados y credenciales SIAT viven SOLO en el env/vault del VPS
(ver `.env.example`), nunca en git ni en el core. El token delegado es por
organizacion (lo genera el cliente en SIAT) y se guarda cifrado.

## Correr

```bash
node --test hermes-content/integrations/siat/test/*.test.mjs
```

407 tests, todos sin red: transporte y `fetch` son inyectables. (En Windows
falla 1 solo test del runner que crea un symlink — EPERM sin modo developer;
en el VPS pasa completo.)
