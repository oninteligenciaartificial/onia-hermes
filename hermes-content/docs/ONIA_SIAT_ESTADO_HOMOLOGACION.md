# SIAT — estado de la homologación del sistema

> **Fuente de verdad del trámite.** Sin fecha en el nombre a propósito: se EDITA, no se
> duplica. Si un doc con fecha lo contradice, gana este.
>
> El diseño técnico del emisor vive en `hermes-content/integrations/siat/README.md`.
> El plan original del trámite, en `onia-core/ONIA_SIAT_CERTIFICACION_PLAN_2026.md`.

---

## 1. Qué está pasando, en una línea

El sistema **Onia Platform v1.00** está registrado ante el SIN como **Proveedor**, en
estado **INICIADO**, con **24,8% de la Fase 1** hecho (última lectura del portal,
2026-08-27) y un límite de pruebas que vence el **04/11/2026**. El NIT no bloquea nada:
está limpio. **Desde el 2026-09-03 los tres documentos sector emiten, anulan y revierten
contra el piloto** (§7); lo que sigue trabado es el **Punto de Venta 1**, que lo crea Sergio.

---

## 2. Los datos del trámite

| Campo | Valor |
|---|---|
| NIT | `5371375010` |
| Razón social | LESLIE MERCADO MORENO (unipersonal `OniaAgency`) |
| Dependencia | Gerencia Distrital Santa Cruz II |
| Usuario del portal | `business@onia.com.bo` |
| Solicitud | N° **9473** |
| Código de sistema | `228474DC226A215DD26BF` |
| Sistema | Onia Platform **v1.00**, tipo **PROVEEDOR** |
| Modalidades | **COMPUTARIZADA EN LÍNEA** + **ELECTRÓNICA EN LÍNEA** |
| Documentos sector | 1 (compra-venta) · 17 (hospitales/clínicas) · 24 (nota crédito-débito) |
| Fecha de solicitud | 06/08/2026 16:20 |
| **Fecha límite de pruebas** | **04/11/2026** (Art. 18.III) |
| Estado | **INICIADO** |

**Portales** (son tres distintos, y confundirlos cuesta tiempo):

| Para qué | URL |
|---|---|
| Oficina Virtual / situación tributaria | `siat.impuestos.gob.bo/v2/launcher/` |
| **Autorización de sistemas** (el trámite) | `fman.impuestos.gob.bo/facturacionv2/` |
| Portal Web en Línea (facturar tipeando, gratis) | `pweb.impuestos.gob.bo/solicitud/` |

---

## 3. El NIT está limpio — no es el bloqueo

Verificado **mirando** la Oficina Virtual el 2026-08-27, no por grep ni por memoria:

- Sin deudas pendientes · sin obligaciones pendientes de presentación · sin obligaciones
  determinadas por pagar · sin condonaciones · sin facilidades de pago.
- **Portal Web en Línea HABILITADO**: Emisión Factura Compra Venta · Factura Educativo ·
  Nota Crédito/Débito · Ventas del Día. **Onia puede facturar gratis hoy**, tipeando —
  que es exactamente lo que promete la página `/facturacion` del sitio.
- **Vencimiento de declaraciones: día 13.** F-200 (IVA), F-400 (IT) y F-608 (RC-IVA)
  vencen el 13. NIT terminado en 0. **Esto desbloquea el `tax_posture.vencimiento_dia`
  que estaba en `null` esperando el RND.**
- F-500 (IUE) vence 30/04/2027 → cierre diciembre, régimen general con registros contables.

**Tres cosas del padrón a decidir** (no bloquean el trámite, pero cuestan multas):

| Obligación | Qué pasa |
|---|---|
| **F-608 RC-IVA agentes de retención** | Figura **recurrente**, no N/A. O se presenta en cero cada mes o se da de baja en el RNC |
| **F-772 Impuesto al Juego – Promociones Empresariales** | En el padrón de una empresa de software. Depurar |
| **F-530 IUE-Beneficiarios del Exterior** | Disponible y sin usar. Es el formulario para deducir Claude/ElevenLabs/Higgsfield |

---

## 4. Fase 1 — el marcador real del SIN

Leído del "Listado de Etapas" del portal el 2026-08-27. **No coincide con lo que decían
nuestras notas** (`fase1-state.json` local y la memoria hablaban de "1.968 operaciones OK,
Fase 1 completa"):

| # | Etapa | Requiere | Enviados OK | Falta |
|---|---|---:|---:|---:|
| I | Obtención de CUIS | 2 | 1 | 1 |
| II | Sincronización de Catálogos | 1.800 | 900 | 900 |
| III | Obtención CUFD | 200 | 100 | 100 |
| IV | Emisión individual | 750 | 125 | 625 |
| V | Eventos Significativos | 70 | 35 | 35 |
| VI | Emisión de paquetes | 560 | 20 | 540 |
| VII | Anulación | 750 | 125 | 625 |
| **VIII** | **Firma Digital** | **690** | **0** | **690** |
| IX | Emisión masiva | 160 | 20 | 140 |
| XI | Reversión | 750 | 98 | 652 |
| | **TOTAL** | **5.732** | **1.424** | **4.308** |

**Porcentaje General del portal: 0%** (ninguna etapa cerrada al 100%).

> La etapa **X (emisión masiva IEHD)** no figura para nuestro perfil: es del sector
> hidrocarburos. Son 10 etapas, no 11.

---

## 5. LA LECCIÓN: el SIN cuenta cobertura, no volumen

La corrida del 6-ago mandó **750 emisiones** en la etapa IV y el portal contabilizó
**125**. No fue un error del SIN: las 750 eran **la misma combinación repetida**.

El "Listado de Pruebas" de la etapa IV (entrar por el `→` de la columna Opciones) muestra
**6 casos de 125 cada uno**:

| Caso | `codigoPuntoVenta` | `tipoFacturaDocumento` | `codigoDocumentoSector` | Estado |
|---:|:---:|:---:|:---|---|
| 1 | 1 | 1 | 1 · FACTURA COMPRA-VENTA | 0% |
| **2** | **0** | **1** | **1 · FACTURA COMPRA-VENTA** | **100%** ← el único |
| 3 | 1 | 1 | 17 · FACTURA DE HOSPITALES/CLÍNICAS | 0% |
| 4 | 0 | 1 | 17 · FACTURA DE HOSPITALES/CLÍNICAS | 0% |
| 5 | 1 | 3 | 24 · NOTA DE CRÉDITO-DÉBITO | 0% |
| 6 | 0 | 3 | 24 · NOTA DE CRÉDITO-DÉBITO | 0% |

**Los dos ejes:**

1. **`codigoPuntoVenta` 0 y 1.** CUIS y CUFD se piden por sucursal+PdV. El runner corría
   todo en el PdV 0 — por eso las etapas I, II, III y V quedaron clavadas en **exactamente
   50%** (1/2, 900/1800, 100/200, 35/70).
2. **`codigoDocumentoSector` 1, 17 y 24**, que son los tres de la solicitud 9473. La nota
   crédito-débito va como documento de **ajuste** (`tipoFacturaDocumento` 3).

La causa estaba en `src/fase1-runner.mjs`: una constante `PILOT` con **un solo combo
hardcodeado**. Corregido — ver §7.

### Hipótesis descartada

Primero se atribuyó el 50% a haber registrado **dos modalidades** (computarizada +
electrónica). **Falso**: el campo del request dice `codigoModalidad = su modalidad de
Facturación`, una sola. La modalidad no multiplica nada.

Lo único que cuesta la modalidad electrónica es **la etapa VIII entera (690 casos)**, que
exige certificado digital.

---

## 6. La etapa VIII y el certificado

690 casos de emisión firmada. Necesita un certificado del **sujeto pasivo emitido por
AGETIC** (ADSIB fue cerrada por el DS 5519 y sus competencias pasaron a AGETIC el
15-ene-2026) o por DIGICERT SRL. Para las pruebas: generar el CSR con los campos de AGETIC
y enviarlo al SIN por correo, que devuelve certificados de prueba.

**Dos salidas, y la barata es la primera:**

| Camino | Qué implica |
|---|---|
| **Reducir la solicitud a Computarizada en Línea** | Elimina los 690 casos. La electrónica **no agrega capacidad vendible**: solo suma la firma XMLDSig. Queda para una v2.00 del sistema — cada versión se autoriza aparte |
| Conseguir el certificado | CSR → SIN → certificados de prueba → correr la etapa VIII. Sin el certificado real de AGETIC no se opera en producción |

Sin resolver esto, el sistema **no puede llegar al 100%** de la Fase 1.

---

## 7. El runner, corregido

`hermes-content/integrations/siat/src/fase1-runner.mjs`

**Antes** — una constante, un combo:

```js
export const PILOT = {
  codigoSucursal: 0,
  codigoPuntoVenta: 0,
  codigoDocumentoSector: 1,
  tipoFacturaDocumento: 1,
};
```

**Ahora** — `PILOT` guarda solo lo invariante (ambiente, modalidad, sucursal) y los ejes
que el SIN exige son una matriz explícita:

```js
export const PUNTOS_VENTA = [0, 1];

export const DOC_SECTOR_CASES = [
  { codigoDocumentoSector: 1,  tipoFacturaDocumento: 1 }, // COMPRA-VENTA
  { codigoDocumentoSector: 17, tipoFacturaDocumento: 1 }, // HOSPITALES/CLINICAS
  { codigoDocumentoSector: 24, tipoFacturaDocumento: 3 }, // NOTA CREDITO-DEBITO
];

export const EMISION_CASES = /* 6 combos */;
```

Cambios de fondo:

- **`this.combo`** es el combo en curso; `baseParams()` y `recepcionBase()` lo leen. Las
  etapas lo cambian con **`withCombo()`**, que restaura el anterior aunque el callback
  lance.
- **CUIS y CUFD pasan a ser por punto de venta**: `state.cuisByPv` / `state.cufdByPv` en
  vez de un valor suelto. `migrateState()` sube el checkpoint del 6-ago sin perderlo.
- **Cada factura recuerda su combo.** Sin eso, la anulación (VII) y la reversión (XI)
  tomaban una factura de otro combo y el caso del SIN nunca cerraba.
- **`STAGE_TARGETS` pasa a ser por caso**, no total. `STAGE_TOTALS` guarda lo que muestra
  el portal, y un test verifica que `target × casos == total` en las 9 etapas.
- **`summary()`** reporta avance contra el total del SIN, para cotejar contra el portal
  sin hacer cuentas.
- **El gate** ahora emite/anula/revierte **una por combo**: si un documento sector está
  mal, revienta en 6 operaciones y no a las dos horas.

**333 tests verdes** (eran 311). Los 22 nuevos cubren la matriz de casos, la migración del
checkpoint y —lo que de verdad importa— que las etapas IV/VII/XI recorran los 6 combos y
que anular sin haber emitido en ese combo falle claro en vez de tomar la factura de otro.

### Cómo se corre

```bash
node src/fase1-runner.mjs --etapa gate     # humo: 1 por combo, primero esto
node src/fase1-runner.mjs                  # todas las etapas en orden
node src/fase1-runner.mjs --etapa IV       # una sola etapa
/opt/onia-siat/run-fase1-volumen.sh        # (VPS) IV -> VII -> XI con los targets del SIN
```

Con `/opt/onia-siat/siat-piloto.env` cargado en el ambiente. El estado vive en
`fase1-state.json` (checkpoint/resume) y el log por operación en `fase1-log.ndjson`.
La copia del VPS se despliega con `tar` por ssh desde el repo (no hay rsync en Windows):
`tar -cf - src test xsd package.json | ssh root@VPS "cd /opt/onia-siat/emisor && tar xf -"`.

### Lo que reveló correrlo (2026-08-27)

Se corrió contra el piloto y **cada combo devolvió un error distinto y útil**. Eso es el
valor del cambio: antes un fallo mataba la etapa entera y no se sabía de cuál caso venía.

| Combo | Qué dijo el SIN / el runner | Estado |
|---|---|---|
| `pv0-ds1-tf1` | — | **funciona** (125/125, el único que el SIN ya contaba) |
| `pv1-*` (3 combos) | **`933 · EL PUNTO DE VENTA ES INEXISTENTE O INVALIDO`** | bloqueado: **falta crear el PdV 1** |
| `pv0-ds17-tf1` | `995 · SERVICIO NO DISPONIBLE` → resuelto → `EL PARAMETRO ARCHIVO ES INVALIDO … cvc-elt.1.a` | **resuelto 2026-09-03** (ver abajo) |
| `pv0-ds24-tf3` | `995 · SERVICIO NO DISPONIBLE` → resuelto → operaciones sin mapear | **resuelto 2026-09-03** (ver abajo) |

**Tres hallazgos que no se sabían:**

1. **`933 · EL PUNTO DE VENTA ES INEXISTENTE O INVALIDO`.** El PdV 1 no existe. Confirmado
   por el SIN, no inferido. **La mitad de la matriz depende de crearlo.**

2. **Cada documento sector tiene su PROPIO servicio SOAP.** Mandarlos todos a
   `ServicioFacturacionCompraVenta` devuelve `995 · SERVICIO NO DISPONIBLE: Para la
   modalidad 2 y/o sector N`. Los nombres salen del PDF de la solicitud 9473 y se
   confirmaron pidiendo el `?wsdl` de cada uno (los 4 responden 200):

   | Sector | Servicio | Operación de emisión |
   |---|---|---|
   | 1 · compra-venta | `ServicioFacturacionCompraVenta` | `recepcionFactura` |
   | 17 · hospitales/clínicas | `ServicioFacturacionComputarizada` | `recepcionFactura` |
   | 24 · nota crédito-débito | `ServicioFacturacionDocumentoAjuste` | **`recepcionDocumentoAjuste`** |

   El de ajuste **no comparte los nombres de operación**: son
   `recepcionDocumentoAjuste`, `anulacionDocumentoAjuste`,
   `reversionAnulacionDocumentoAjuste`, `verificacionEstadoDocumentoAjuste`.

3. **El CUFD caduca a las 24h y el estado sobrevive días.** El guardado era del 6-ago y el
   SIN respondía `CUFD FUERA DE TOLERANCIA`. Ahora `ensureCufd()` lo renueva solo antes de
   emitir/anular/revertir, sin contarlo como prueba de la etapa III. **Verificado en vivo:
   `cufd_refresh → ok=true`.**

### Lo que reveló correrlo (2026-09-03, noche)

Los dos combos que faltaban del PdV 0 **emiten, anulan y revierten** contra el piloto.
Evidencia: `fase1-log.ndjson` del 2026-09-04T02:38Z al 02:46Z.

| Combo | IV | VII | XI |
|---|---|---|---|
| `pv0-ds17-tf1` | `recepcionFactura` → **908 VALIDADA** | `anulacionFactura` → 905 | `reversionAnulacionFactura` → 907 |
| `pv0-ds24-tf3` | `recepcionDocumentoAjuste` → **908 VALIDADA** | `anulacionDocumentoAjuste` → 905 | `reversionAnulacionDocumentoAjuste` → 907 |

Qué hizo falta, y de dónde salió cada cosa:

1. **Los XSD oficiales, en el repo** (`integrations/siat/xsd/`, 6 archivos, ver. 23/08/2021).
   El sector 17 usa la raíz `facturaComputarizadaHospitalClinica`: cabecera de compra-venta +
   `modalidadServicio`, y en cada línea del detalle **quirófano y médico obligatorios**
   (`nroQuirofanoSalaOperaciones`, `nombreApellidoMedico`, `nitDocumentoMedico`) sin
   `numeroSerie`/`numeroImei`. El sector 24 usa `notaFiscalComputarizadaCreditoDebito`: sin
   pago ni moneda; identifica la factura original (`numeroFactura`, `numeroAutorizacionCuf` =
   su CUF, `fechaEmisionFactura`) y exige **mínimo 2 líneas** de detalle: las de la factura
   original (`codigoDetalleTransaccion` 1) y las devueltas (2). Reglas del SIN
   (`…/validaciones-documentos-sector/validaciones`): `montoTotalOriginal = Σ subTotal(1)`,
   `montoTotalDevuelto = Σ subTotal(2) − montoDescuentoCreditoDebito`,
   `montoEfectivoCreditoDebito = montoTotalDevuelto × 0,13`.
   El test del repo **lee los XSD** y coteja campos, orden, nillables, raíz y `minOccurs`;
   además los tres XML validaron con `lxml` contra su XSD.
2. **El servicio de ajuste tiene wrappers propios** (WSDL del piloto,
   `?wsdl=ServicioFacturacion.wsdl`): `SolicitudServicioRecepcionDocumentoAjuste`,
   `SolicitudServicioAnulacionDocumentoAjuste`, `SolicitudServicioReversionAnulacionDocumentoAjuste`.
   Mismo DTO base que la factura.
3. **El servicio de ajuste tarda 36-43 s en responder**, hasta a un archivo basura (vuelve
   con `920` a los 42,8 s). Con el timeout default de 30 s los 3 reintentos morían en
   `network` y parecía que el SIN colgaba. `TIMEOUT_MS_POR_SERVICIO` lo sube a 120 s solo para
   ese servicio.
4. **La nota necesita una compra-venta original del mismo PdV** con fecha, receptor e items
   guardados. Las 500 facturas viejas del estado no los tienen: el runner emite una nueva
   cuando hace falta y marca la original como `ajustada` (una nota por factura).

**Corrida de volumen lanzada** (IV → VII → XI, 125 por combo) con
`/opt/onia-siat/run-fase1-volumen.sh`. A los 3 minutos `pv0-ds17-tf1` ya estaba en 125/125
en la etapa IV. Si completa, suma hasta **777 casos** (≈ +13 puntos: de 24,8 % a ~38 %). El
marcador del portal hay que leerlo después (login de Sergio).

### Lo que falta para desbloquear cada combo

| Combo | Qué falta | Quién |
|---|---|---|
| `pv1-*` (3) | Crear el **Punto de Venta 1** en SIAT. El código ya los recorre; hoy cada uno bloquea con `sin CUIS para el punto de venta 1` | **Sergio** |
| `pv0-ds17-tf1` | Nada: emite/anula/revierte (2026-09-03). Falta que la corrida de volumen cierre VII y XI en 125 | corriendo |
| `pv0-ds24-tf3` | Nada: emite/anula/revierte (2026-09-03). Falta que la corrida de volumen llegue a 125 (~1,5 h a 36 s por nota) | corriendo |

---

## 8. Credenciales — ya las tenemos

`/opt/onia-siat/siat-piloto.env` en el VPS, `chmod 600`, **fuera del repo**:

| Variable | |
|---|---|
| `SIAT_ENV` | `piloto` |
| `SIAT_CODIGO_SISTEMA` | `228474DC226A215DD26BF` |
| `SIAT_NIT` | *(set)* |
| `SIAT_PILOT_TOKEN` | JWT, **vence 2027-08-06** |

Se generan en el portal: **`Gestor Token Delegado Piloto`**, último ítem del menú de
`fman.impuestos.gob.bo/facturacionv2/`.

> **Regla:** el token nunca entra al repo, nunca se loggea, nunca viaja en el SOAP. Va en
> el header HTTP `apikey: TokenApi <token>` — verificado en vivo; el `Authorization: Token`
> que sugiere la documentación devuelve *"EL SERVICIO REQUIERE API KEY"*.

---

## 9. Para que Onia Platform facture de verdad

El código de la plataforma ya tiene la capa fiscal (`onia-platform/lib/fiscal/`), pero la
cadena está **cortada en dos puntos**:

```
Onia Platform ──POST {SIAT_SERVICE_URL}/fiscal/invoices──▶  ??? nadie sirve esto
  lib/fiscal/siat-client.ts                                   ▲
  lib/fiscal/emission-service.ts                              │
                                                              │
/opt/onia-siat/emisor/  emitInvoice() existe y funciona ──────┘
                        pero es una LIBRERIA .mjs: sin HTTP,
                        sin contenedor, sin systemd
```

Con `SIAT_SERVICE_URL` vacía la plataforma corre en **modo mock**: CUF determinístico,
`codigoEstado` 908 simulado, QR data-URI, **cero red**, todo marcado `mock: true`.

| # | Falta | Quién | Bloquea |
|---|---|---|---|
| 1 | **Autorización del sistema** (INICIADO → AUTORIZADO) | Sergio + SIN | todo |
| 2 | Wrapper HTTP del emisor (`POST /fiscal/invoices` → `emitInvoice()`) | dev | 3 |
| 3 | Deployar el servicio (contenedor + `--env-file` + red interna) | dev | 4 |
| 4 | Token de **producción** (`codigoAmbiente` 1; el del vault es 2 = piloto) | Sergio | 5 |
| 5 | Encender los flags en `app.env` | dev | — |
| 6 | Fase 3 (pruebas piloto por cliente) + declaración jurada | ambos | operar |

Los flags del paso 5:

```bash
SIAT_EMISSION=1
SIAT_SERVICE_URL=http://onia-siat:8080
SIAT_SERVICE_TOKEN=$(openssl rand -hex 32)
PLATFORM_LAYER=1
```

Más el entitlement `module.invoicing` por organización. Los gates son **fail-closed**: si
falta cualquiera, el flujo viejo de `Invoice` corre intacto y las tablas `OniaInvoicing`
ni se consultan.

### El 1 de octubre no se llega, y está bien

| Fecha | Qué es |
|---|---|
| **01/10/2026** | Deadline comercial (grupos 9°-12° solo facturan en línea) |
| **04/11/2026** | Límite de pruebas del sistema 9473 |

La autorización llega **después** del rush. Lo que se vende para el 1-oct es lo que la
landing ya dice y es cierto: *"emitís por el portal gratuito — sin re-tipear, porque el
sistema te los da listos"*. Eso **no depende de la autorización**.

Prohibido vender "por ley tenés que comprarnos": el Portal Web en Línea del SIN es
gratuito y se refuta con un Google.

---

## 10. Contactos del SIN

| | |
|---|---|
| Línea gratuita | **800 10 3444**, 8:30–16:30 |
| Soporte SIAT | **siat.soporte@impuestos.gob.bo** |
| Dependencia | Gerencia Distrital Santa Cruz II |

---

## 11. Lo que falta verificar

- ~~Que exista el Punto de Venta 1~~ → **RESUELTO: no existe.** El SIN devuelve
  `933 · EL PUNTO DE VENTA ES INEXISTENTE O INVALIDO`. Hay que **crearlo** — bloquea la
  mitad de la matriz.
- **El desglose de las etapas VI y IX.** Sus totales (560, 160) se dividen limpio por 2
  puntos de venta, pero no abrimos su "Listado de Pruebas". Están marcadas `[VERIFICAR]`
  en `STAGE_PLAN`. El contador del portal es el árbitro.
- **Si se puede reducir la solicitud a una sola modalidad** conservando los casos ya
  enviados, o si hay que registrar un sistema nuevo y re-correr. Es la pregunta al SIN.
- **Los 3 botones de la columna Opciones** del Seguimiento, y el menú `≡ ▾` de "Datos de
  Autorización": ahí debería estar el paso que mueve el estado y/o modifica la solicitud.
