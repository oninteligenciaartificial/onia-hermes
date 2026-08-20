# Onia — Facturación: estado REAL (auditoría verificada en producción)

**Pregunta que responde:** *¿el sistema ya factura de verdad?*

Auditoría hecha MIRANDO producción (`https://app.onia.com.bo`), no leyendo código.
Flujo corrido punta a punta con la cuenta QA real de la clínica
(`oninteligenciaartificial+qachatbot@gmail.com`, org `ZZ QA Clinica Chatbot`, plan
professional) más lecturas directas a la base de producción (`supabase-db` en el VPS) y
al entorno del contenedor `onia-platform`.

Capturas: `…/946633e2-5c52-475c-9d6a-565e4b92c3c0/scratchpad/facturacion/`

> **Tres cosas distintas que NO son lo mismo.** Este documento las separa a propósito
> porque mezclarlas es lo que produce promesas de venta falsas:
> 1. **Factura INTERNA** — el documento de cobro que el cliente de Onia le da a SU cliente.
> 2. **Factura FISCAL boliviana (SIAT)** — el documento con CUF autorizado por el SIN.
> 3. **Cobro de Onia a sus propios clientes** (suscripciones).

---

## 1. FACTURA DE VERDAD (probado E2E en producción, con captura)

Todo lo de esta sección se **abrió, se ejecutó y se miró renderizado** hoy, 18-ago-2026,
contra `app.onia.com.bo`. Es la **factura interna de cobro del rubro DENTAL**.

| Paso probado | Resultado | Captura |
|---|---|---|
| Login QA clínica | OK, entra a `/dashboard` | `01`, `02` |
| `/billing` listado vacío → con factura | OK, KPIs Cobrado / Por Cobrar / Total | `41`, `53-listado-final` |
| Crear factura desde `/billing/new` | **OK sólo con fecha de vencimiento** (ver bug abajo) | `20-form-completo` |
| Factura creada `#2026-0001`, Bs 100,00, estado Borrador | OK, numeración correlativa por org | `40-detalle-factura` |
| Abrir PDF (`/print/invoice/<id>`) | **OK, renderiza bien**: logo Onia, datos de la org, cliente con CI, tabla de ítems, subtotal/total, pie con fecha | `42-print.png` + `42-print.pdf` |
| Marcar como **Enviada** | OK, cambia estado y se refleja en listado y RCV | `50-tras-enviada` |
| **Registrar pago** (Bs 100 efectivo) | OK, aparece en "Pagos Registrados" y **auto-marca PAGADA** con "Pagado completo" | `60`, `61-pagada` |
| **Nota de crédito** (anulación de una pagada) | Se crea `NC-2026-0001` por Bs −100,00 — **con reserva, ver sección 2** | respuesta 201 de `/api/invoices/<id>/credit-note` |
| `/contabilidad` con datos reales | **OK, números REALES, no placeholders**: Ventas Bs 100 · Débito IVA 13% Bs 13 · IT 3% Bs 3 · Saldo IVA a pagar Bs 13; RCV con la fila real; Balance de comprobación cuadrado Bs 100 / Bs 100 y **Caja y Bancos pasó de Bs 0 a Bs 100 al registrar el pago** | `54-contabilidad`, `63-contabilidad-final` |
| Export CSV RCV (`/api/fiscal/rcv-export?month=2026-08`) | OK, HTTP 200 `text/csv` con la fila real | verificado |

**Veredicto de esta sección:** el circuito **crear → listar → PDF → cobrar → contabilizar**
funciona de punta a punta en producción, con datos reales. La contabilidad **no tiene
placeholders**: cada cifra se deriva de la operación (`lib/fiscal/rcv-export.ts`,
`iva-summary.ts`, `balance-comprobacion.ts` leen `Invoice` / `onia_commerce_payments` con
scope de tenant).

### 🔴 Bug bloqueante encontrado en producción (headline)

**No se puede crear una factura sin llenar "Fecha de vencimiento".** El campo se ve
opcional y el botón "Crear Factura" está habilitado, pero el POST devuelve **HTTP 400
"Datos inválidos"** y la pantalla no explica cuál campo falló.

```
REQ  POST /api/invoices  {"patientId":"…","items":[…],"notes":"","dueDate":null,"isRecurring":false}
RES  400  {"error":"Datos inválidos","details":[{"code":"invalid_type","expected":"string",
           "received":"null","path":["dueDate"],"message":"Expected string, received null"}]}
```

Causa raíz (una línea de desajuste cliente/servidor):
- `app/(dashboard)/billing/new/NewInvoiceClient.tsx:75` manda `dueDate: dueDate || null`
- `app/api/invoices/route.ts:23` declara `dueDate: z.string().optional()` — **no acepta `null`**

Arreglo: `.optional().nullable()` en el schema (o que el cliente omita la clave).
**No lo apliqué**: soy auditor y el fix vive en otro carril (`onia-platform`, rama
`feat/importar-catalogo-dropzone`) y requiere build+deploy en el VPS. Queda para Sergio
decidir cuándo entra.

> Impacto de venta: un cliente que crea su primera factura sin poner vencimiento ve
> "Datos inválidos" y se le cae la demo. Es el primer clic del módulo que estamos vendiendo.

### Otros hallazgos de esta sección (no bloquean, pero condicionan lo que se promete)

1. **El documento dice "FACTURA" pero no es una factura fiscal.** El PDF titula
   **FACTURA** y muestra "Impuesto IT (3%)". No lleva CUF, ni número de autorización, ni
   QR del SIN. Para el SIN eso es un **recibo/nota de cobro**, no una factura. Ver el
   asterisco al final.
2. **El impuesto siempre es Bs 0,00.** `app/api/invoices/route.ts:65` fija `tax: 0` duro.
   El PDF y el detalle igual imprimen la etiqueta "Impuestos (IT 3%)" al lado de un cero
   — línea que confunde y contradice a `/contabilidad`, que sí calcula IT 3% y débito IVA
   13% sobre el mismo total.
3. **La nota de crédito nace BORRADOR y no descuenta nada.** `NC-2026-0001` queda en
   `BORRADOR` con total −100, la factura original sigue `PAGADA`, y el RCV **excluye los
   borradores** (`RCV_EXCLUDED_STATUSES`). Resultado: la anulación **no baja el débito
   fiscal** hasta que alguien cambie a mano el estado de la NC. Es un agujero contable
   silencioso.
   **Verificado mirando la pantalla** (`80-contabilidad-con-NC.png`): después de crear
   `NC-2026-0001` por Bs −100, el RCV sigue mostrando **una sola fila de Bs 100 con débito
   Bs 13** y el balance sigue en Bs 100 / Bs 100. La nota de crédito no descontó nada.
4. **El crédito fiscal de compras es siempre 0 para una clínica.** Sale de
   `onia_accounting_rcv_records kind="compra"`, que **no tiene ninguna fila en producción**
   y sólo se escribe desde gastos de empresa (`lib/empresa/gastos.ts`) o compras de
   comercio (`lib/comercio/compras.ts`). Una clínica dental no tiene por dónde cargar sus
   facturas de compra → su IVA a pagar sale **siempre inflado**.
5. **El rubro COMERCIO no tiene factura.** Con la cuenta QA de la ferretería, `/billing`
   **redirige a `/comercio`**: `billing` no está en `COMMON_SEGMENTS`
   (`lib/platform/route-access.ts:51`), es un segmento sólo del pack dental. La ferretería
   cobra por caja y su venta llega a `/contabilidad` como pago, con la **referencia** del
   pago en la columna "Nro / Ref." — **no hay documento de venta imprimible**. Captura
   `71-comercio-billing`, `72-comercio-contabilidad`.
6. **Ninguna organización de producción tiene NIT.** Las 3 orgs vivas
   (`ZZ QA Ferreteria Tornillo`, `Onia (interna)`, `ZZ QA Clinica Chatbot`) tienen `nit`
   vacío, así que `/contabilidad` no puede calcular el vencimiento IVA/IT y el PDF sale
   sin la insignia de NIT.

---

## 2. CONSTRUIDO PERO NO EMITE (con el flag / bloqueo exacto)

### 2.1 La emisión fiscal SIAT dentro del producto: **apagada, y debajo es un mock**

**Estado del flag en producción (verificado, no supuesto):**

```
$ docker exec onia-platform env | grep -iE 'SIAT|PLATFORM_LAYER|FISCAL'
PLATFORM_LAYER=1
```

`SIAT_EMISSION` **no existe en el entorno de producción**. `lib/fiscal/flags.ts` sólo
enciende con el string exacto `"1"` → **la emisión fiscal está OFF, fail-closed**.

Consecuencia en cadena, tal como la escribe el código:
- `maybeEmitFiscalInvoice()` (`lib/fiscal/emission-service.ts:55`) **retorna `null` antes
  de tocar la base**. El PATCH de la factura a ENVIADA nunca intenta emitir.
- `/print/invoice/[id]` (línea 59) ni consulta la tabla fiscal → el PDF sale sin CUF ni QR.

**Prueba dura, no lectura de código:** marqué la factura `#2026-0001` como **ENVIADA en
producción** — que es exactamente el disparador de `maybeEmitFiscalInvoice` — y después
consulté la base: **`onia_invoicing_invoices` sigue en 0 filas**. La emisión no corrió, ni
siquiera en modo mock. (También verifiqué que no hay ningún `.env` dentro del contenedor
que reintroduzca la variable: `grep -ic siat` sobre el entorno del PID 1 devuelve 0.)

**Y aunque se encendiera el flag, hoy NO emitiría de verdad.** `lib/fiscal/siat-client.ts`
está en **modo mock deliberado**: sin `SIAT_SERVICE_URL` devuelve un CUF simulado
(FNV-1a), un QR SVG inventado, `codigoEstado: 908` y `mock: true`, con **cero llamadas de
red**. No hay ninguna variable `SIAT_SERVICE_URL` ni `SIAT_SERVICE_TOKEN` en producción, y
**no existe ningún contenedor `siat` corriendo en el VPS** (verificado con
`docker ps -a | grep -i siat` → vacío).

**Las tres llaves que faltan, en orden:**

| # | Llave | Estado hoy | Quién |
|---|---|---|---|
| 1 | Desplegar el emisor compartido como servicio y setear `SIAT_SERVICE_URL` + `SIAT_SERVICE_TOKEN` | ⬜ el emisor existe (`hermes-content/integrations/siat/`, 14 módulos: CUF verificado contra el Anexo oficial, SOAP real, contingencia, scheduler) pero **no está deployado ni el producto lo llama** | dev |
| 2 | Encender `SIAT_EMISSION=1` en el contenedor | ⬜ ausente | dev |
| 3 | Entitlement `module.invoicing` por organización | ⬜ gate per-org, además del flag global | dev |

### 2.2 El bloqueo real del SIAT **ya no es el NIT** — corrección importante

El bloqueo que veníamos arrastrando en memoria ("falta el NIT") **está desactualizado**.
Contra `hermes-content/docs/ONIA_SIAT_HABILITAR_FACTURACION_CHECKLIST_2026.md`:

- ✅ **NIT `5371375010` ACTIVO**, Régimen General, IVA vigente, razón social LESLIE MERCADO
  MORENO. Actividades de software confirmadas (4651200 / 6209920 / 6312000).
- ✅ **Sistema REGISTRADO ante el SIN como proveedor** — solicitud N° 9473, código
  `228474DC226A215DD26BF` (06-ago-2026).
- ✅ **Fase 1 COMPLETA**: 1.968 operaciones reales contra el piloto del SIN, cero
  bloqueadas. CUIS obtenido, CUF verificado contra el algoritmo oficial, transporte SOAP
  real funcionando.

**El bloqueo exacto hoy son cuatro cosas, ninguna es el NIT:**

1. **Fase 2 — inspección del SIN**, que agenda el SIN. **Fecha límite dura: 04-nov-2026**
   (Art. 18.III, el reloj corre desde el registro del 06-ago).
2. **El producto no está conectado al emisor real** — `siat-client.ts` sigue siendo el
   mock (ítem 2.1 arriba). El enchufe por país (`emission-service.ts`) ya existe y está
   testeado; falta el cable.
3. **Fase 3 — piloto por cliente**, con el token delegado que genera cada cliente
   (runbook ya escrito: `integrations/siat/ONBOARDING_CLIENTE.md`).
4. **Ninguna org tiene NIT cargado en el sistema** (0 de 3) — sin NIT del cliente no hay
   emisión por organización, aunque todo lo anterior esté verde.

**Qué del checklist se cerró y qué no:**

| Carril | Paso | Estado real |
|---|---|---|
| A (facturar las ventas DE ONIA, cero dev) | 1. NIT activo en Oficina Virtual | ✅ cerrado |
| A | 2. Habilitar modalidad **Portal Web en Línea** | ⬜ **abierto** — el padrón figura "Computarizada — PENDIENTE" |
| A | 3. Casa matriz + punto de venta | ⬜ abierto |
| A | 4. Registrar servicios y sincronizar catálogos | ⬜ abierto |
| A | 5. Emitir factura de prueba, validar PDF/XML | ⬜ abierto |
| B (que el PRODUCTO emita) | Registro como proveedor + Fase 1 | ✅ cerrado (06-ago-2026) |
| B | Fase 2 inspección SIN | ⬜ abierto, límite 04-nov-2026 |
| B | Conectar producto ↔ emisor compartido | ⬜ abierto (mock) |
| B | Fase 3 piloto por cliente + encender por org | ⬜ abierto |

*No pude verificar en pantalla el carril A* (requiere entrar a la Oficina Virtual del SIN
con las credenciales del NIT — no lo hago, es un portal de gobierno y no ingreso
credenciales). Lo del carril A se reporta como lo dice el checklist, no como verificado
por mí hoy.

### 2.3 Otras piezas construidas y no encendidas

- **Tablas fiscales del core dormidas pero YA migradas en producción**:
  `onia_invoicing_invoices`, `onia_invoicing_invoice_lines`,
  `onia_invoicing_credit_debit_notes`, `onia_accounting_*` (9 tablas). Existen, con 0
  filas. Encender el flag no requiere migración.
- **Callback n8n de estado de factura** (`/api/n8n/callback/invoice-status`) construido y
  **cerrado por el mismo flag**: devuelve `409 "SIAT_EMISSION esta apagado"`.
- **Envío de la factura por correo** (`/api/email/invoice/[id]`, botón "Enviar por correo"
  visible en la pantalla): existe. **No lo probé** — mandaría un correo real.

---

## 3. NO EXISTE

- **Emisión fiscal real desde el producto.** Cero facturas con CUF emitidas, nunca. No es
  "está apagado": debajo del flag hay un simulador, no un cliente SOAP.
- **Factura para el rubro comercio.** No hay documento de venta imprimible en la
  ferretería: `/billing` ni siquiera es accesible para ese pack.
- **Carga de facturas de compra en una clínica.** No hay pantalla que escriba
  `onia_accounting_rcv_records kind="compra"` desde el pack dental → crédito fiscal
  estructuralmente 0.
- **Libro de compras (RCV compras).** Sólo existe el registro de VENTAS.
- **Anulación fiscal ante el SIN** (con plazo del día 9 del mes siguiente): está
  modelada en el emisor compartido, no en el producto.
- **Declaración F-200 / F-400.** El sistema es insumo para el contador; no declara. Está
  correctamente dicho en pantalla.
- **Factura fiscal de Onia a sus propios clientes** — ver sección 4.

---

## 4. Cobro de Onia a SUS clientes (una línea, ya sabido)

Sigue siendo **comprobante manual**: el cliente paga por QR/transferencia, sube la captura
en `/checkout` y un humano la revisa y activa el plan (`lib/subscription/activation.ts` —
"un comprobante subido no activa el plan por sí solo"). **Onia no emite factura fiscal a
sus clientes**; eso depende del carril A del checklist (Portal Web en Línea del SIN, paso
de Sergio, cero dev).

---

## ¿Se le puede decir a un cliente "Onia te factura"?

# NO — pero SÍ "Onia te cobra, te lleva la cuenta y te deja lista la declaración"

**El asterisco, en la frase exacta que se puede usar en venta:**

> *"Onia te emite el documento de cobro con tu logo y tus datos, te lleva el registro de
> ventas y te calcula IVA 13% e IT 3% listos para tu contador. La factura fiscal con CUF
> ante el SIN todavía la emitís por el portal del SIN — la emisión automática está en
> certificación."*

**Lo que está PROHIBIDO decir hoy:**
- ❌ "Onia emite tu factura ante Impuestos" / "facturación electrónica SIAT incluida"
- ❌ "Cumplís con la facturación en línea del 30-sep-2026 con Onia"
- ❌ Cualquier promesa de factura para una **ferretería/comercio** — ahí ni siquiera hay
  documento de venta imprimible

**Lo que SÍ está probado y se puede prometer (rubro dental, plan Basico+):** documento de
cobro con PDF, cobros y saldos, registro de ventas exportable en CSV, resumen IVA/IT del
mes, balance de comprobación y calendario de vencimiento por terminación de NIT.

**Y una advertencia interna:** el PDF actual titula **"FACTURA"** sin ser un documento
fiscal. Antes de ponerlo delante de un cliente real conviene retitularlo
("Nota de cobro" / "Recibo") o el propio documento contradice lo que la venta debe aclarar.

---

## Qué NO pude verificar

1. **La Oficina Virtual del SIN** (carril A del checklist) — requiere ingresar credenciales
   del NIT en un portal de gobierno. Lo reporto como lo dice el checklist, no verificado
   por mí.
2. **El envío de la factura por correo** (`/api/email/invoice/[id]`) — mandaría un correo
   real a una casilla real.
3. **La emisión con el flag encendido** — no encendí `SIAT_EMISSION=1` en producción (es
   un cambio de configuración de producción, no una lectura). Lo que sí verifiqué es que
   el flag está ausente y que debajo hay un mock.
4. **Facturas recurrentes** (`/billing/recurring`, cron `recurring-invoices`) — fuera del
   alcance de esta pasada.
5. **El comportamiento con una org que SÍ tenga NIT** — ninguna de las 3 orgs de
   producción tiene NIT cargado, así que la insignia de NIT del PDF y el cálculo del
   vencimiento IVA/IT no se pudieron ver funcionando con datos reales.

---

## Rastro de datos dejado en producción (limpiar si molesta)

En `ZZ QA Clinica Chatbot`: paciente `Paciente Auditoria Facturacion` (CI 12345678),
factura `#2026-0001` Bs 100 PAGADA con un pago en efectivo de Bs 100, y nota de crédito
`NC-2026-0001` en borrador. Antes de esta auditoría la base **no tenía ninguna factura**.

---

*Auditoría: 18-ago-2026. Método: Playwright headless contra `app.onia.com.bo` con lectura
de las capturas, más `psql` en `supabase-db` y `docker exec env` en el VPS de producción.*
