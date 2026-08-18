# BCP Api Market — Ficha técnica de las APIs de Pago QR (OpenBanking)

> **Fuente de verdad** de la integración técnica con el BCP. Basado en la
> documentación oficial que el banco envió a Sergio (2026-08):
> 5 especificaciones técnicas "APIs de Pago - OpenBanking" (18/10/2024),
> "01 APIs OpenBanking - Flujo interacción QR" (21/08/2025), la infografía
> "Integración API QR" y el PPTX de journey ("Api Market BCP – Generación Código QR").
>
> **Este doc NO redefine la decisión de pasarelas.** La decisión vive en:
> memoria `onia-pasarelas-pago-bolivia` · `historial/ONIA_BCP_REUNION_20260805.md`
> · `historial/ONIA_BCP_INTEGRACION_TECNICA_20260814.md` (nuestro doc de preguntas
> al banco). Resumen de esa decisión: **modelo Facilitador** (RD BCB 079/2022 art. 4a),
> el dinero de los clientes finales JAMÁS pasa por cuentas de Onia, **cada cliente
> cobra en SU cuenta**; para la suscripción propia, Onia es un aceptante más.
>
> Regla de lectura: todo lo afirmado aquí sale de los PDFs del banco. Lo que el
> banco NO dijo está marcado como **PREGUNTAR AL BANCO** (§7).

---

## 1. Qué es — el flujo en cristiano

El BCP expone por internet un juego de APIs REST ("Open Banking" / "Api Market")
para que una empresa cobre por **QR dinámico interoperable**:

1. **La empresa genera el QR** llamando a la API de Generación (monto, moneda,
   glosa, vencimiento, único uso o no). El banco devuelve un `id` único y la
   **imagen del QR en Base64**.
2. **El cliente paga desde la app de CUALQUIER banco boliviano** (el QR es
   interoperable; `enableBank: ALL` por defecto — la spec lista ~60 entidades).
3. **La plata cae directo en la cuenta recaudadora de la empresa** en el BCP.
   Dos modalidades de abono (infografía): **abono directo por operación** o
   **abono único diario** con toda la recaudación del día anterior.
4. **La empresa se entera en línea**: el BCP hace `POST` (callback/webhook) a una
   URL que la empresa expone en internet, con todos los datos del pago —
   incluida **nuestra referencia (`IdCorrelation`) tal como la enviamos** y los
   `Collectors` (metadata propia que viaja de ida y vuelta).
5. Respaldo: API de **Consulta de estado** por QR individual (explícitamente NO
   para uso masivo), API de **Reportes** por rango de fechas (conciliación en
   lote), y un **reporte diario TXT por correo** con todas las operaciones.

```
Onia crea el cobro ──POST /Qr/Generated──▶ BCP        (id + imagen QR + vencimiento)
Cliente escanea    ──app de su banco────▶ paga        (cualquier banco, ALL)
BCP acredita       ──▶ cuenta recaudadora de la empresa
BCP notifica       ──POST callback──────▶ nuestra URL (IdCorrelation + monto + pagador)
Onia responde      ──{State:"000", Data:{id}}──▶ BCP  (si falla: 3 reintentos)
Respaldo           ──/Qr/Consult · /Qr/Report/Detail · TXT diario por correo
```

**Lo que el flujo NO hace:** el callback **solo notifica pagos procesados
correctamente**. Un QR vencido no genera notificación — la app del pagador
muestra error y no deja pagar; el vencimiento lo detectamos nosotros (por
`expirationDate` local, Consulta o Reportes). Tampoco hay débito automático ni
devoluciones por API en estos documentos.

---

## 2. Autenticación — igual en las 4 APIs del banco

| Capa | Detalle |
|---|---|
| **Transporte** | HTTPS + **certificado cliente `.pfx` con contraseña** (mTLS), provisto por el BCP. Las guías de Postman deshabilitan TLS 1.0/1.1/1.3 → el servidor negocia **TLS 1.2** |
| **Header `Authorization`** | **Basic Auth**: `Basic base64(Username:Password)` asignados por el BCP a la empresa |
| **Header `Correlation-Id`** | Alfanumérico **ÚNICO por petición**, generado por nosotros (ej. `0001-001-123456`). Es el que vuelve como `IdCorrelation`/`correlationId` en callback, consulta y reportes → **es nuestra referencia externa de conciliación** |
| **Header `Content-Type`** | `application/json` |
| **Cuerpo** | Además viajan `appUserId`, `publicToken`, `businessCode` y `serviceCode` (050 = Pagos QR) — identifican a la empresa a nivel aplicación |

**Set completo de credenciales que entrega el BCP** (se piden al buzón de
Arquitectura y Estándares TI, §5): `Username` · `Password` · `AppUserId` ·
`PublicToken` · `BusinessCode` · `Certificado.Pfx` · password del certificado.

**Para el callback (sentido banco→empresa)** la autenticación se invierte: el BCP
llama a nuestra URL con `Basic base64(Username:PublicToken)`. **No hay firma
HMAC ni firma asimétrica documentada** — ver riesgo en §6.

Kit de herramientas: el banco tiene ejemplos de código en **C#, Node.js y PHP**,
a solicitud.

---

## 3. Las 5 APIs, una por una

Solo se publican **URIs de sandbox** (`sandbox.openbanking.bcp.com.bo`). La URL
de producción no aparece en ningún documento → PREGUNTAR AL BANCO.

### 3.1 Generación de QR (v4.0.0)

`POST https://sandbox.openbanking.bcp.com.bo/Web_ApiQr/api/v4/Qr/Generated`

**Request (JSON):**

| Campo | Detalle |
|---|---|
| `appUserId` | string — clave de usuario de la empresa |
| `currency` | `BOB` o `USD` |
| `amount` | decimal, punto y 2 decimales (`150.69`). **`0` = QR de importe editable** (el pagador elige el monto). Para suscripciones: monto fijo SIEMPRE |
| `gloss` | glosa, **máx 60 caracteres, sin caracteres especiales** (`@,$,%,#,&`…). **Vacía `""` = glosa editable** |
| `serviceCode` | código de servicio asignado (ej. `050`) |
| `businessCode` | código de empresa asignado (ej. `0001`) |
| `singleUse` | bool — `true` = QR de único uso (para cobros: **siempre `true`**, evita doble pago) |
| `enableBank` | banco(s) habilitado(s) para pagar; **default `ALL`** (interoperable). Tabla de ~60 códigos en la spec (BCP, BNB, BIS/BISA, BME/BMSC, BUN, BGA, BSOL, cooperativas, IFDs…) |
| `expiration` | formato **`día/hora:minutos`** (`01/02:00` = 1 día 2 h). **Default `00/00:00` = vence a las 23:59 del mismo día. Máximo 2 años (`730/00:00`)** |
| `city` · `branchOffice` · `teller` · `phoneNumber` | sucursal/caja/celular — informativos, vuelven en callback y reportes |
| `publicToken` | token público único de la empresa (UUID) |
| `collectors` | `array[{name, parameter, paremeter (sic), value}]` — **metadata libre nuestra**, se guarda atada al QR y **vuelve en Consulta y Callback** |

**Response:** `{ data: { id, qrImage, expirationDate }, state, message }`

| Campo | Detalle |
|---|---|
| `data.id` | **int, único por petición** — es el identificador del QR en el BCP (en reportes aparece como `nroAuthorization`) |
| `data.qrImage` | imagen del QR **en Base64**. ⚠️ No entregan la cadena EMVCo, solo imagen |
| `data.expirationDate` | `yyyy-MM-dd HH:mm` |
| `state` / `message` | `"00"` / `"COMPLETADO"` si ok |

**Códigos de respuesta** (comunes a Generación/Consulta/Actualización):
`00` correcto · `01` canal inválido · `02` password inválido · `03` sin acceso a
la transacción (HTTP 401 en el diagrama) · `09` error en validación · `12`
transacción inválida · `13` monto inválido · `30` error de formato · `51` sin
fondos · `52`/`53` cuenta corriente/ahorro no encontrada · `61` límite excedido ·
`79` cuenta no válida · `80` transacción denegada · `97` error de comunicación ·
`99` error general.

### 3.2 Consulta de estado QR (v3.0.0)

`POST https://sandbox.openbanking.bcp.com.bo/Web_ApiQr/api/v3/Qr/Consult`

**Request:** `appUserId`, `id` (el int de Generación), `serviceCode` (050),
`businessCode`, `publicToken`.

**Response `data`:** `status` + `description` + eco del QR (`qrImage`,
`expirationDate`, `gloss`, `serviceCode`, `businessCode`, `currency`, `amount`,
`collectors`) + **`correlationId`** (el nuestro) y, si fue pagado:
`operationNumber` (nro de operación), `receiverAccount`, `receiverName`,
`receiverDocument` (datos del pagador — la spec los llama "remitente").

**Estados del QR:**

| Código | Estado | Significado |
|---|---|---|
| `C` | EN COLA | estado inicial, aún no pagado |
| `P` | PROCESADO | pagado y acreditado |
| `V` | VENCIDO | expiró sin pagar |
| `A` | ANULADO | anulado por la empresa (vía API 3.4) |
| `U` | PROCESADO POR LA EMPRESA | marcado por la empresa (vía API 3.4) |

⚠️ **Regla del banco (doc de flujo):** esta API **no reemplaza al callback** y
**no debe usarse de forma masiva**. No publican el rate limit numérico.

### 3.3 Notificación de pago — Callback (v4.0.0) — **la expone Onia, no el banco**

Es un endpoint **nuestro**, método `POST`, expuesto a internet. Se registra ante
el BCP entregando: la **URL**, y ellos asignan `Username` + `PublicToken` con los
que nos llamarán (`Authorization: Basic base64(Username:PublicToken)`).

**Solo notifica transacciones procesadas exitosamente.** Body que envía el BCP
(ejemplo real de la spec con `Amount: 15.05`):

| Campo (los que importan) | Detalle |
|---|---|
| `IdCorrelation` / `CorrelationId` | **nuestro Correlation-Id de la generación, tal cual** — la llave de conciliación |
| `Id` | int — el `id` que nos devolvió Generación |
| `IdQr` | id de respuesta ACH (ej. `10059002307060013682`) |
| `Amount` / `Currency` / `Gloss` | monto abonado, moneda, glosa |
| `Account` | cuenta de la empresa donde cayó el abono |
| `ReceiverAccount` / `ReceiverName` / `ReceiverDocument` / `ReceiverBank` | datos del pagador (cuenta, nombre, CI, banco origen — ej. `BCP`) |
| `Status` / `Description` | `"P"` / `"PROCESADO"` (único estado que notifica) |
| `OperationNumber` | nro de operación del abono |
| `RequestDate` | fecha-hora de la notificación |
| `ResponseCode` | `"000"` |
| `SingleUse` / `GenerateType` / `Version` / `EnableBank` / `ExpirationDate` | eco de la generación |
| `City` / `BranchOffice` / `Teller` / `PhoneNumber` / `Collectors` | eco de la metadata nuestra |

**Respuesta que DEBEMOS devolver** (contrato del banco):

```json
{ "State": "000", "Mensaje": "COMPLETADO", "Data": { "Id": "<mismo Id recibido>" } }
```

- `State: "000"` = ok. `003` = credenciales incorrectas. **Cualquier otro código
  de 3 dígitos = error** (los definimos nosotros).
- Si NO es exitoso, `Data.id` debe ser **un valor aleatorio con prefijo `E-`**.
- **Reintentos: 3** si respondemos con error o no respondemos (diagrama del doc
  de flujo: "Callback reception error – Number of retries: 3"). Intervalo entre
  reintentos y qué pasa después del 3.º: no documentado.

### 3.4 Actualización de estado QR (v2.0.0)

`POST https://sandbox.openbanking.bcp.com.bo/Web_ApiQr/api/v2/Qr/Updated/Status`

Cambia el estado de un QR generado, **del lado de la empresa**:

**Request:** `appUserId`, `id`, `status` (`A` = ANULADO · `U` = PROCESADO POR LA
EMPRESA), `detail` (motivo, **máx 400 caracteres**, ej. "Anulado por
duplicidad"), `serviceCode` (050), `businessCode`, `publicToken`.

**Response:** `status`, `description`, eco del QR (`expirationDate`, `gloss`,
`currency`, `amount`, `collectors`…), `state`/`message`.

Usos para Onia: **anular** un QR emitido por error o reemplazado (el cliente
cambió de plan antes de pagar), y **marcar `U`** como flag de "ya conciliado por
nuestro sistema" para que Reportes lo distinga. ⚠️ Esto NO es una devolución de
fondos: opera sobre el QR, no sobre dinero ya acreditado.

### 3.5 Reportes (v3.0.0)

`POST https://sandbox.openbanking.bcp.com.bo/Web_ApiQr/api/v3/Qr/Report/Detail`

**Request:** `appUserId`, `currency`, `serviceCode` (050), `businessCode`,
`publicToken`, `startDate` y `finalDate` (**formato `aaaaMMdd`**, ej.
`20190909`), `statusPayment`:

- `P` = QRs ya procesados (pagados)
- `C` = QRs que no fueron pagados **o que ya están vencidos**
- `A` = QRs anulados por la empresa
- `U` = QRs con estado "procesado por la empresa"

**Response `data[]`** (por operación): `businessName`, `paymentMethod` (`QR`),
`amount`, `currency`, `gloss`, **`idCorrelation`** (el nuestro),
`originAccount`/`originName`/`originDocument`/`originBank` (pagador — solo si
procesado; vacíos si en cola/vencido), **`operationNumber`** (nro de operación
de abono en la cuenta), **`nroAuthorization`** (el `id` del QR de
`/Qr/Generated`), **`destinationAccount`** (cuenta con la que se generó el QR),
`date`, `status`/`description`, `serviceCode`, `branchOffice`, `branchCity`,
`stationName`, `businessCode`, `collectors`.

Códigos de respuesta propios (subset): `00`, `01`, `02`, `09`, `30`, `97`, `99`.

**Ésta es la API de conciliación en lote** — la que en nuestro doc de preguntas
llamábamos E3. Además, fuera de API (infografía): **reporte diario en TXT por
correo** con todas las operaciones (a los correos que se soliciten), y
reportería web opcional en **Credinet Web** / plataforma **Multiplica QR**
(esta última "sin costo", afiliación por Credinet Web o planilla).

---

## 4. Paso a paso del alta (onboarding)

Proceso de implementación según la infografía del banco, en 4 pasos:

| # | Paso | Detalle |
|---|---|---|
| 1 | **Documentación técnica** | El banco la envía (ya la tenemos — es este material). La revisa TI de la empresa y arranca el desarrollo |
| 2 | **Elaboración del contrato** | Requisitos documentales: **NIT** · **matrícula de comercio** · **poderes de los representantes legales** · **documentos de identidad de los representantes legales** · **número de cuenta con la que se hará la recaudación** |
| 3 | **Pruebas en sandbox** | El banco **envía los certificados** para iniciar pruebas en ambiente controlado |
| 4 | **Pase a producción** | Una vez **firmado el contrato y concluidas las pruebas en sandbox**, comparten las credenciales del ambiente productivo. Luego: soporte y acompañamiento |

**Implicaciones para Onia:**

- Hace falta **cuenta recaudadora** (el "número de cuenta con la que se hará la
  recaudación") — es decir, cuenta empresa en el BCP a nombre de OniaAgency.
- Quien firma es la **titular Leslie Mercado Moreno** (empresa unipersonal —
  ver `historial/ONIA_BCP_INTEGRACION_TECNICA_20260814.md` §4.4). El requisito
  "poderes de los representantes legales" abre la puerta a formalizar un poder
  para que Sergio opere el trámite técnico.
- La infografía clasifica la Integración API QR como servicio **con comisión**
  ("Comisión — implica desarrollo por parte de la empresa y firma de un
  contrato") — **el monto no aparece en ningún documento**.

**Contactos publicados por el banco:**

| Rol | Contacto |
|---|---|
| Buzón Arquitectura y Estándares TI (credenciales) | BolArqEstaTI@bancred.com.bo |
| Equipo técnico | Daniel Torrez — DTorrez@bcp.com.bo · Jhon Quisbert — JQuisbert@bcp.com.bo · Diego Tarquino — DTarquino@bcp.com.bo · Braian Espejo — BEspejo@bcp.com.bo · Jose Zurita — JZurita@bcp.com.bo |
| Equipo de Recaudación (comercial) | Nayra Rocha — NRocha@bcp.com.bo · Sarai Arias — SArias@bcp.com.bo |

**Lo que el alta NO especifica** → va a la lista de PREGUNTAR AL BANCO (§7):
plazo real en días, costo de la cuenta/habilitación, si sandbox sigue vivo tras
el pase a producción, vigencia y renovación del certificado, y cómo se registra
o cambia la URL del callback.

---

## 5. Encaje en Onia

### 5.a Nuestro checkout (suscripciones de la plataforma) — plano A

Hoy: QR estático + el cliente sube foto del comprobante + aprobación manual
(`onia-platform/app/api/subscription-payment`, validación en
`lib/subscription-payment-validation.ts`). Esta API lo vuelve automático:

1. Checkout crea el cobro → `POST /Qr/Generated` con `amount` del plan (leído de
   **`onia-platform/lib/pricing.ts`**, la única fuente de precios),
   `singleUse: true`, `expiration` corta (ej. `00/01:00`), `Correlation-Id` =
   `onia_sub_<idSuscripción>_<período>` y `collectors` con la misma referencia.
2. Mostramos `qrImage` (Base64) en pantalla con cuenta regresiva del vencimiento.
3. Callback en `https://app.onia.com.bo/api/webhooks/platform/bcp` (URL ya
   propuesta al banco): valida Basic auth, deduplica por
   `(proveedor, OperationNumber)` con unicidad en base, responde
   `{State:"000",…}` en <2 s, y encola la activación del plan.
4. **Antes de activar, confirmar con `/Qr/Consult`** (mitiga la falta de firma
   del callback, §6) — y validar `Amount` contra el plan.
5. Red de seguridad: job diario contra `/Qr/Report/Detail` (P del día) para
   atrapar callbacks perdidos; `V` para expirar cobros colgados.

**Esfuerzo estimado:** bajo en código, largo en trámite. El patrón de proveedor
ya existe (`onia-platform/lib/gateway.ts` + `app/api/gateway-config` +
credenciales cifradas AES-256-GCM). Lo nuevo: cliente HTTPS con certificado
`.pfx` (mTLS + TLS 1.2 forzado), el adaptador BCP (generar/consultar/anular),
el endpoint callback con el contrato de respuesta del banco, y el job de
conciliación. **~3–5 días de desarrollo + pruebas sandbox**; el camino crítico
es el alta bancaria (contrato, cuenta, certificados), no el código.

### 5.b Capacidad para clientes (módulo de cobros) — plano B

Coherente con la decisión **Facilitador / "cada cliente su cuenta"**: el módulo
de cobros genera QRs del BCP **del cliente**, contra **su** cuenta recaudadora y
**sus** credenciales. Onia nunca toca el dinero.

- Cada cliente firma **su propio contrato** con el BCP y recibe su set completo
  (Username/Password/AppUserId/PublicToken/BusinessCode/certificado). El alta
  del §4 se repite **por cliente** — eso convierte el onboarding bancario en
  parte del servicio "done-for-you" de Onia.
- La plataforma guarda las credenciales **por organización** (cifradas, patrón
  ya existente) y el callback se resuelve por `BusinessCode`/URL por cliente.
- `destinationAccount` en Reportes permite verificar que cada QR salió contra la
  cuenta correcta.

**Esfuerzo estimado:** reutiliza el 80 % del adaptador de 5.a. Lo nuevo:
credenciales multi-tenant (incluye almacenar un `.pfx` por organización), UI de
configuración/prueba de conexión, callback multi-tenant y el runbook de alta
guiada con el banco. **~1–2 semanas de desarrollo** después de que 5.a esté
probado en producción. El cuello de botella real: **un trámite bancario por
cliente** (velocidad de venta = velocidad del banco).

Orden recomendado: **5.a primero** (nos hace expertos del trámite con nuestro
propio caso), 5.b después como add-on de cobros.

---

## 6. Riesgos y límites detectados en los documentos

| # | Riesgo/Límite | Detalle y mitigación |
|---|---|---|
| 1 | **El callback no viene firmado** | Solo Basic auth con `Username:PublicToken` (credenciales estáticas). Quien las obtenga puede simular pagos. Mitigación nuestra: secreto fuera de logs, allowlist de IP de origen si el banco la publica (preguntar), y **regla dura: ningún plan se activa sin confirmar por `/Qr/Consult`** |
| 2 | **Solo se notifican pagos exitosos** | Vencidos/anulados no generan callback. Los cobros pendientes se expiran localmente por `expirationDate` + barrido con Reportes (`statusPayment: C`) |
| 3 | **Comisión sin cifra** | La infografía marca "Comisión" para Integración API QR pero ningún doc da el número. No fijar precios de add-on de cobros hasta tenerla por escrito (ya era la pregunta 23 del doc del 14-08) |
| 4 | **No hay recurrencia/débito automático** | La suscripción mensual implica generar un QR nuevo por período y empujar al cliente a pagarlo (cobranza recurrente operativa) |
| 5 | **No hay devolución por API** | La Actualización de estado anula QRs, no devuelve fondos acreditados. La garantía de devolución del primer mes seguiría siendo manual |
| 6 | **Solo entregan imagen Base64, no la cadena EMVCo** | No podemos renderizar el QR con nuestro diseño ni regenerarlo client-side; se muestra la imagen tal cual (preguntar si existe la cadena) |
| 7 | **Consulta con uso restringido** | "No debe ser usado de forma masiva" sin número. El polling agresivo como reemplazo de callback está explícitamente prohibido — el diseño DEBE descansar en el callback + Reportes |
| 8 | **Certificado `.pfx` como secreto adicional** | Vive cifrado en base (nunca en repo/env en claro); vigencia y proceso de renovación no documentados |
| 9 | **Reintentos del callback = 3** (diagrama) | Sin intervalo documentado ni reenvío manual conocido. Tras 3 fallos, el pago solo se recupera por Consulta/Reportes — el job diario no es opcional |
| 10 | **TLS 1.2 fijo** | Las guías deshabilitan TLS 1.0/1.1/**1.3**. El cliente HTTP debe negociar TLS 1.2 con cert cliente (en Node: `https.Agent({ pfx, passphrase, minVersion/maxVersion: 'TLSv1.2' })`) |
| 11 | **`Correlation-Id` sin contrato de formato** | Alfanumérico y único por petición; largo máximo y charset no publicados. Validar en sandbox antes de fijar el formato `onia_sub_…` |
| 12 | **Estados A/U con semántica fina** | `U` ("procesado por la empresa") lo escribe la empresa vía API 3.4; en Reportes su descripción es ambigua ("anulados y que están con estado procesado por la empresa"). Confirmar la semántica exacta en sandbox |

---

## 7. PREGUNTAR AL BANCO — lista explícita

Lo que la documentación **no** responde (numeración nueva; las preguntas 1–53 del
doc del 14-08 siguen vigentes donde no se marquen respondidas en §8):

1. **URL base de producción** de las 4 APIs (solo publican sandbox).
2. **Comisión por operación** de la Integración API QR, por escrito — y si hay
   costo de habilitación, mensualidad o mínimos. (Era la pregunta 23.)
3. **Plazo real en días** desde la firma del contrato hasta credenciales de
   producción. (Era la 33.)
4. ¿**Sandbox sigue activo** después del pase a producción? ¿Credenciales de
   ambos ambientes conviven? (Era la 35.)
5. `Correlation-Id`: **largo máximo, charset permitido** y si exigen unicidad
   global o por día. (Era la 19, ahora acotada.)
6. Callback: **intervalo entre los 3 reintentos**, ventana total, y si existe
   **reenvío manual** de una notificación perdida.
7. Callback: ¿publican **rangos de IP de origen** del BCP para allowlist?
   ¿Ofrecen alguna firma adicional (HMAC/mTLS entrante) además del Basic? (Era la 9/49.)
8. ¿Cómo se **registra y se cambia la URL del callback**? ¿Se pueden tener dos
   (sandbox y producción) a la vez? (Era la 15.)
9. ¿Existe forma de obtener la **cadena EMVCo** del QR además de la imagen Base64?
10. **Modalidad de abono** (por operación vs. unificado diario): ¿cómo se elige,
    se puede cambiar, y cuál es el plazo de disponibilidad del dinero (T+0/T+1)?
    (Era la 42.)
11. **Rate limit real** de `/Qr/Consult` y de Reportes — qué es "uso masivo".
12. **Certificado `.pfx`**: vigencia, proceso y anticipación de renovación, y si
    aceptan dos certificados válidos durante la rotación. (Era la 39/51.)
13. **Devoluciones**: confirmar que no hay devolución de fondos por API y cuál es
    el procedimiento manual (plazo, costo). (Era la 45.)
14. **QR en USD**: ¿es pagable interoperablemente hoy, o solo BOB?
15. **Cuenta recaudadora**: tipo de cuenta exigido, costo, y si puede abrirse en
    paralelo al contrato. (Era la 7.)
16. **Firma del contrato**: empresa unipersonal — ¿basta la titular con CI o
    exigen poder notarial para que un tercero opere? (Era la 5.)
17. **Reporte diario TXT**: formato/layout exacto y si sirve como conciliación
    contractual (¿a qué hora llega?).
18. Los **límites por transacción** (código de error 61 "Límite Excedido"
    existe): montos mínimo/máximo por QR y topes diarios. (Era la 44.)
19. Plano B (clientes de Onia): confirmar que el modelo es **un contrato por
    cliente** con sus propias credenciales, y si existe algún alta simplificada
    para clientes presentados por un integrador. (Era la 3.)

---

## 8. Qué preguntas del doc del 14-08 quedaron RESPONDIDAS por estos documentos

| Pregunta (doc 2026-08-14) | Respuesta encontrada |
|---|---|
| 8 — ¿Hay webhook? | **Sí**: API Callback, POST a URL nuestra, solo pagos exitosos, 3 reintentos |
| 19 — ¿Referencia propia que vuelve? | **Sí**: `Correlation-Id` → `IdCorrelation`/`correlationId` en callback, consulta y reportes. Además `collectors` para metadata libre |
| 31 — ¿Hay sandbox? | **Sí**: `sandbox.openbanking.bcp.com.bo`, con certificados propios para pruebas |
| 34 — ¿Forma de las credenciales? | **Basic Auth (user/password) + certificado cliente `.pfx` + AppUserId/PublicToken/BusinessCode**. Se confirma el indicio del certificado con contraseña |
| 21 — ¿Vencimiento configurable y monto fijo? | **Sí**: `expiration` de minutos a 2 años (default: mismo día 23:59); monto fijo salvo `amount: 0`; `singleUse` configurable |
| 12 — ¿Id de evento estable para deduplicar? | Parcial: no hay "eventId", pero `OperationNumber` + `Id` + `IdQr` son estables por operación |
| 14 — ¿Notifican fallidos/vencidos? | **No** — solo procesados correctamente (respuesta negativa explícita) |
| 17 — ¿Listado por rango de fechas? | **Sí**: API de Reportes (`startDate`/`finalDate` + `statusPayment`) + TXT diario por correo |
| 26 — ¿Botón/enlace de pago además del QR? | No aparece en estos docs (solo QR) |
| 28 — ¿Débito automático por API? | No aparece en estos docs — confirmar la negativa por escrito |
| 22 — ¿"APIs Pagos QR Simple" vs "Recaudaciones QR"? | Este paquete se llama **"Integración API QR"** (Api Market / OpenBanking). La infografía lista como productos hermanos: **Multiplica QR** (web, sin costo) y **Recaudación** (canales físicos/electrónicos, con comisión, por intercambio de archivos/web service) |

---

## Referencias

- Decisión de pasarelas (NO se redefine aquí): memoria `onia-pasarelas-pago-bolivia`
  · `hermes-content/docs/historial/ONIA_BCP_REUNION_20260805.md`
  · `hermes-content/docs/historial/ONIA_BCP_INTEGRACION_TECNICA_20260814.md`
  · `hermes-content/docs/historial/ONIA_PAGOS_ARQUITECTURA_20260730.md`
- Precios: `onia-platform/lib/pricing.ts` (única fuente que cobra de verdad).
- Código relacionado: `onia-platform/lib/gateway.ts` ·
  `onia-platform/lib/subscription-payment-validation.ts` ·
  `onia-platform/app/api/subscription-payment` · `onia-platform/app/api/gateway-config`.
- PDFs fuente (copia local): scratchpad `banco-qr/APIs de Pago - OpenBanking/`
  (5 specs, 18/10/2024) · `Downloads/01 APIs OpenBanking - Flujo interacción QR.pdf`
  (21/08/2025) · `Downloads/Infografia API QR 1.pdf` · PPTX de journey.
  ⚠️ El scratchpad es temporal: si estos PDFs importan a futuro, moverlos a un
  lugar permanente fuera del repo (contienen material "Uso Interno" del banco —
  no commitearlos).
