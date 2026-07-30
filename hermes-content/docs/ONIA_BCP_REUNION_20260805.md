# Reunión BCP — miércoles 5 de agosto de 2026

> **Kit de reunión. Preparado 2026-07-30.**
> Contraparte: banco **BCP Bolivia** + ingenieros de La Paz que integran la pasarela.
> Objetivo de Onia: **cobrar la suscripción mensual de Onia Platform y dar de alta la
> cuenta automáticamente al acreditarse el pago.** Self-serve: paga → entra.
>
> ### Regla de uso de este documento
> Todo lo que dice **`[PREGUNTAR AL BANCO]`** es una pregunta, **no un dato**. La
> documentación técnica de las APIs de QR de BCP **no es pública** (verificado el
> 2026-07-30, ver §7). No se afirma una comisión, un endpoint, un tiempo ni un nombre
> de API que no esté en §7 con su fuente. Un dato inventado frente a ingenieros de un
> banco quema la credibilidad en el primer minuto y no se recupera.
>
> Compañero técnico: `ONIA_PAGOS_ARQUITECTURA_20260730.md`.

---

## 0. Las 5 preguntas que más cambian el producto

Si la reunión se corta a los 10 minutos, que sean estas cinco. Cada una cambia **qué se
construye**, no solo **cómo**.

| # | Pregunta | Si la respuesta es A… | Si es B… |
|---|---|---|---|
| **1** | **¿Hay webhook / notificación push al acreditarse el pago?** (§2.B1) | **Sí** → el alta es automática; la web puede prometer acceso inmediato. | **No** → hay que construir un reconciliador por consulta, el producto promete "en unos minutos", y queda un costo de soporte permanente. |
| **2** | **¿Onia puede cobrar a nombre propio, o cada cliente necesita su cuenta?** (§2.A1) | **A nombre propio** → self-serve real. | **Cuenta por cliente** → deja de ser self-serve: hay un trámite bancario antes de que el cliente pueda pagarnos. |
| **3** | **¿Podemos mandar un identificador propio que vuelva en la notificación?** (§2.C1) | **Sí** → sabemos exactamente qué suscripción se pagó. | **No** → hay que identificar por monto y hora, que es frágil; el alta automática se vuelve insegura. |
| **4** | **¿Hay débito automático mensual, o hay que generar un cobro cada mes?** (§2.E1) | **Débito automático** → la renovación es invisible y la retención sube. | **Cobro por mes** → hay que construir avisos, recordatorios y gracia; es cobranza recurrente permanente. |
| **5** | **¿Hay sandbox, y en cuántos días reales se llega a producción?** (§2.F1, F3) | **Sandbox + semanas** → se puede integrar ya. | **Sin sandbox / meses** → hay que cobrar la primera camada a mano y no bloquear la venta esperando al banco. |

**Objetivo mínimo de la reunión:** salir sabiendo en cuál de los escenarios de §4 estamos,
y con el nombre y correo de un contacto técnico.

> 🔴 **Y una sexta, que no es una pregunta de producto sino un posible bloqueo previo:**
> el reglamento del BCB (RD 079/2022, **art. 27.I**) obliga al banco a **verificar que la
> empresa tenga un Sistema Informático de Facturación autorizado por el SIN** antes de
> habilitarle el cobro electrónico. Si el banco lo aplica literalmente, **la homologación
> SIAT es prerrequisito del cobro, no un trámite paralelo**. Hay que preguntarlo (H7) y
> hay que llegar sabiendo en qué estado está lo nuestro. Detalle y cita en §7.6.

---

## 1. Qué le pedimos al banco — una página

**Para leer o entregar tal cual al ingeniero de BCP.**

### Quiénes somos y qué vendemos

Onia es una empresa boliviana de software. Vendemos **Onia Platform**, un sistema de
gestión por suscripción mensual para empresas bolivianas (hoy: clínicas dentales; luego
comercio minorista). El precio está en bolivianos: **Bs 320 / 750 / 1.500 / 2.900 al mes**
según plan, con opción anual.

### Qué necesitamos que pase, en una frase

> Un cliente elige su plan en nuestra web, paga, y **su cuenta queda habilitada sola**,
> sin que nadie de Onia intervenga.

### El flujo que queremos construir

```
1. El cliente elige plan          →  Onia genera un cobro con un identificador propio
2. Onia pide el cobro a BCP       →  BCP devuelve un QR (o un enlace de pago)
3. El cliente paga desde su banca →  (cualquier banco, red QR interoperable)
4. BCP nos avisa que se acreditó  →  ← ESTE PASO ES EL QUE DEFINE TODO
5. Onia habilita la cuenta        →  el cliente entra, mismo minuto
```

### Las tres cosas concretas que le pedimos al banco

1. **Un aviso automático de que el pago se acreditó** (notificación push / webhook a una
   URL nuestra, firmada). Sin eso, el paso 5 no puede ser automático.
2. **Poder enviar un identificador propio** en el cobro (el id de la suscripción) y que
   **vuelva** en ese aviso. Sin eso sabemos que alguien pagó, pero no quién.
3. **Un ambiente de pruebas** con credenciales, para integrar y certificar antes de tocar
   dinero real.

Y, antes que las tres: **saber si Onia puede cobrar a nombre propio** (una sola cuenta
recaudadora de Onia para todas las suscripciones) o si el modelo exige otra figura.
Eso define el producto entero — ver §2.A.

### Qué NO le pedimos

- No pedimos crédito ni financiamiento.
- No pedimos procesar tarjetas si el QR resuelve (pero queremos saber el costo de cada uno).
- No pedimos exclusividad: Onia integra el banco que dé webhook e identificador propio.

### Qué le damos al banco

- Volumen de cobros recurrentes en bolivianos, creciente, de empresas formales con NIT.
- Cada cliente nuestro es además un candidato a integrar **su propio** cobro por QR
  (nuestros clientes le cobran a sus pacientes/clientes) — ese es el volumen grande.

---

## 2. Preguntas para el banco, agrupadas y priorizadas

**Cómo usar:** las **P0** hay que responderlas sí o sí en la reunión; sin ellas no se
puede ni estimar. Las **P1** definen costo y plazo. Las **P2** se pueden resolver por
correo después.

---

### 🔴 A. Modelo comercial — P0 (la primera pregunta de la reunión)

> **El vocabulario correcto ya existe en la norma boliviana. Usarlo bien es lo que hace
> que el banco tome la conversación en serio.** El **Reglamento de Servicios de Pago,
> Instrumentos Electrónicos de Pago, Compensación y Liquidación**, aprobado por
> **Resolución de Directorio BCB N° 079/2022 (6-sep-2022)**, art. 4 inciso a), define
> **Administradora de Pasarela de Pagos (APP)** con **dos modalidades**:
>
> - **Agregador:** *"reciben, agrupan y transfieren los pagos a los establecimientos en un
>   plazo determinado"* — la plata pasa por la pasarela.
> - **Facilitador:** *"provee infraestructura tecnológica para enrutar y facilitar el
>   procesamiento de una transacción de pago en línea. En el proceso, los recursos se
>   transfieren directamente a la cuenta del aceptante"* — la plata **nunca** pasa por la
>   pasarela.
>
> Fuente: [RD 079/2022, BCB](https://www.bcb.gob.bo/webdocs/01_resoluciones/RD%20079%202022.pdf).
> Ver §7.6 para el detalle y las advertencias de uso.

> **A1. Para cobrar nuestra propia suscripción, ¿nos consideran simplemente un aceptante
> (un comercio más), o entra alguna figura de pasarela?** `[PREGUNTAR AL BANCO]`

- **Nuestra lectura, para plantearla y que la confirmen:** cuando Onia cobra **su propia**
  suscripción a sus propios clientes, **el dinero es nuestro** — es el precio de nuestro
  software. No estamos agrupando ni transfiriendo plata de terceros, así que no somos
  agregador: somos un aceptante, como cualquier comercio. **Plantearlo como lectura a
  confirmar, no como afirmación.**
- **Por qué importa:** si el banco lo trata como comercio, el camino es corto. Si asume
  "plataforma = agregador", se activan obligaciones que no nos corresponden y el trámite
  se alarga meses.
- **Dato útil para sostenerlo:** el reglamento pone las obligaciones duras del agregador
  en el **art. 37** — *"segregación de cuentas para manejo de recursos propios y de
  terceros"* y *"liquidación de fondos a comercios […] en un plazo máximo de cuarenta y
  ocho (48) horas"*. Nada de eso aplica si el dinero es propio.

> **A2. ¿Onia puede recibir todas las suscripciones en una sola cuenta propia, o el banco
> exige otro esquema?** `[PREGUNTAR AL BANCO]`

- **Por qué importa:** es lo que define si el producto es self-serve. Ver los escenarios
  en §4.

> **A3. Para el otro caso de uso —que nuestros clientes cobren a SUS clientes desde
> nuestro software— ¿qué figura corresponde: facilitador, agregador, o simplemente cada
> cliente con su propio contrato?** `[PREGUNTAR AL BANCO]`

- **Nuestra postura actual, ya documentada y ya implementada así:** la cuenta y el
  contrato son **del cliente, no de Onia** (`BCP_PASARELA_CREDENCIALES_INTERNO.md`). El
  propio diseño del software lo dice: *"cada clínica configura su propia cuenta. El dinero
  va directamente al banco del cliente; DentalGest no intermedia pagos"* (`docs/GATEWAY.md`
  del repo del producto).
- **Esto es una carta fuerte en la reunión.** En el vocabulario de la norma, eso se parece
  a la modalidad **facilitador** (los recursos van directo a la cuenta del aceptante), que
  es la de menor fricción regulatoria. Si el banco teme que estemos intermediando plata de
  terceros, la arquitectura ya demuestra lo contrario.

> **A4. ¿Nos afecta el nuevo régimen de Empresas de Tecnología Financiera (ETF)?**
> `[PREGUNTAR AL BANCO]` — **la pregunta regulatoria más importante y la más nueva.**

- **Qué cambió:** el **DS 5384 (7-may-2025)** creó la figura de **Empresa de Tecnología
  Financiera (ETF)**, e incluye **"Pagos"** entre sus categorías de servicio; ASFI lo
  reglamentó por **Resolución ASFI/540/2025 (3-jul-2025)**, con plazo de adecuación desde
  el **31-dic-2025** para empresas que ya prestaban estos servicios. Fuentes:
  [DS 5384](https://www.lexivox.org/norms/BO-DS-N5384.xhtml) ·
  [comunicado ASFI](https://www.asfi.gob.bo/index.php/node/1176).
- **Por qué importa:** hasta 2024 las pasarelas **no** tenían licencia propia — se
  regulaban indirectamente por su contrato con el banco. El régimen ETF puede haber
  movido esa línea. Si nuestro modelo cayera en la categoría "Pagos", habría un requisito
  de licencia que hoy no tenemos.
- **Cómo preguntarlo sin sonar alarmista:** *"¿el régimen ETF nos alcanza si solo cobramos
  nuestras propias suscripciones? ¿Y si además integramos el cobro de nuestros clientes?"*
- **Ojo:** no afirmar que nos alcanza ni que no. **No está verificado para nuestro caso**
  y requiere confirmación de ASFI o de un abogado de regulación financiera — ver §7.6.

> **A5. ¿Hay algún límite o condición por ser Onia una empresa unipersonal?**
> `[PREGUNTAR AL BANCO]` — ver el bloqueo de titularidad en §6.

---

### 🔴 B. Conciliación automática — P0 (**LA pregunta que decide el producto**)

> **B1. Cuando un pago se acredita, ¿BCP notifica automáticamente a una URL nuestra
> (webhook / push), o la única forma de enterarse es consultando (polling)?**
> `[PREGUNTAR AL BANCO]`

- **Por qué importa:** **con webhook, el alta es automática. Sin webhook, no lo es** —
  el cliente paga y espera, o alguien confirma a mano. Esa diferencia se ve en el producto,
  en el precio del soporte y en lo que podemos prometer en la web.
- **Ojo:** el portal público de BCP **no menciona webhook en ninguna parte** (verificado,
  §7). Existe una librería de terceros que sí describe un webhook, pero **no es
  documentación de BCP** y no se puede usar como afirmación en la reunión.

Si la respuesta es **sí, hay webhook**, entonces:

| Pregunta | Por qué importa |
|---|---|
| **B2.** ¿Cómo se firma la notificación? (HMAC, firma asimétrica, mTLS, token compartido) `[PREGUNTAR]` | Sin firma verificable, cualquiera que conozca la URL puede dar de alta cuentas gratis. Es un agujero de plata. |
| **B3.** ¿Cuál es la **latencia** típica entre que el cliente paga y llega la notificación? `[PREGUNTAR]` | Define si la web dice "entrás al instante" o "en unos minutos". |
| **B4.** ¿Hay **reintentos** si nuestro servidor no responde? ¿Cuántos, con qué espera, hasta cuándo? `[PREGUNTAR]` | Si no hay reintentos, un minuto de caída nuestra = un cliente que pagó y no entró. |
| **B5.** ¿La misma notificación puede llegar **más de una vez**? ¿Trae un **id de evento** estable para deduplicar? `[PREGUNTAR]` | Sin id de evento, un reenvío puede dar de alta dos veces o contar el pago doble. |
| **B6.** ¿Qué **código de respuesta** espera BCP de nuestro lado para considerarla entregada? ¿Hay timeout? `[PREGUNTAR]` | Define si podemos procesar en background o hay que responder sincrónico. |
| **B7.** ¿Se notifican también los **fallidos, vencidos y reversados**, o solo los aprobados? `[PREGUNTAR]` | Sin eventos de vencimiento, los cobros pendientes quedan colgados para siempre. |
| **B8.** ¿Se puede configurar **más de una URL** (producción y pruebas), y cambiarla sin trámite? `[PREGUNTAR]` | Si cambiar la URL es un trámite presencial, cada deploy es un problema. |

Si la respuesta es **no hay webhook**, entonces:

| Pregunta | Por qué importa |
|---|---|
| **B9.** ¿Cuál es la **frecuencia máxima de consulta** permitida? ¿Hay límite de llamadas? `[PREGUNTAR]` | Define cuánto tarda el alta y si el rate limit nos deja consultar seguido. |
| **B10.** ¿La consulta es **por cobro individual** o hay un listado de movimientos por rango de fechas? `[PREGUNTAR]` | Un listado permite conciliar en lote; consulta individual no escala. |
| **B11.** ¿Hay algún otro canal de aviso — correo, archivo, SFTP, extracto? `[PREGUNTAR]` | A veces el "webhook" existe con otro nombre y otro equipo. |

---

### 🟠 C. Identificación del pago — P0

> **C1. ¿Podemos enviar un identificador propio al generar el cobro (el id de la
> suscripción) y que vuelva tal cual en la notificación o en la consulta?**
> `[PREGUNTAR AL BANCO]`

- **Por qué importa:** **sin esto no se sabe quién pagó.** Dos clínicas pagando Bs 750 el
  mismo día son indistinguibles por monto. Hoy resolvemos esto pidiéndole al usuario que
  tipee el número de comprobante a mano — que es exactamente lo que queremos eliminar.
- **Preguntar en concreto:** nombre del campo, **largo máximo**, caracteres permitidos
  (¿acepta guiones bajos?, ¿solo numérico?), y si es **único por cobro** o se puede repetir.
- **Qué cambia:** si no existe ese campo, hay que identificar por monto + hora, que es
  frágil, o generar un monto único con centavos — un parche feo que hay que evitar.

> **C2. ¿La notificación trae datos del pagador** (nombre, documento, banco de origen)?
> `[PREGUNTAR]` — sirve para conciliar y para la factura, pero **ojo con datos personales**:
> preguntar qué se puede almacenar y por cuánto tiempo.

> **C3. ¿El QR generado tiene vencimiento configurable?** `[PREGUNTAR]` — si vence en
> minutos, el checkout tiene que regenerarlo; si no vence nunca, se puede pagar dos veces.

---

### 🟠 D. Producto: QR vs botón de pago vs tarjeta — P1

> **D1. ¿Cuál de estos productos aplica a nuestro caso y qué comisión tiene cada uno?**
> `[PREGUNTAR AL BANCO]`

Lo que el portal de BCP lista públicamente (nombres literales, ver §7):
- **APIs Pagos QR Simple:** `Generación QR` · `Consulta Pagos QR` · `Pagos QR`
- **APIs Privadas Banca Empresas:** `Recaudaciones QR`, `Saldos y Movimientos`, entre otras

Preguntas concretas:

| # | Pregunta | Por qué importa |
|---|---|---|
| **D2** | ¿Cuál es la diferencia entre **"APIs Pagos QR Simple"** y **"Recaudaciones QR"** de Banca Empresas? ¿Cuál corresponde a nuestro caso? `[PREGUNTAR]` | Son dos productos distintos en el portal y no sabemos cuál aplica. Preguntarlo demuestra que hicimos la tarea. |
| **D3** | **¿El QR interoperable sigue sin comisión para el comercio?** `[PREGUNTAR]` | BCP publica que el QR **de cuenta de ahorros** no tiene comisión adicional (§7.4), **pero eso no es la integración por API**. 🔴 Y **ninguna norma establece comisión cero** — es política comercial del banco, no un derecho (§7.6). No asumirlo ni prometerlo. Si hay comisión, entra directo al margen: sobre Bs 320/mes, cada punto porcentual importa. |
| **D3b** | ¿Podemos **trasladar la comisión al cliente** como recargo por pagar con QR? `[PREGUNTAR]` | **Casi seguro que no:** el art. 36 d) y e) del reglamento del BCB prohíbe al aceptante establecer recargos por pagos con instrumento electrónico y montos mínimos de compra (§7.6). O sea que la comisión **la absorbemos nosotros** — hay que meterla en el precio, no en el checkout. |
| **D4** | ¿Hay **costo de habilitación, mensualidad o mínimo** por usar la API? `[PREGUNTAR]` | El tarifario público de empresas cobra **por operación** en recaudación (§7); no hay línea de QR ni de API. |
| **D5** | Si en el futuro queremos **tarjeta** (Visa/Mastercard), ¿BCP lo provee o hay que ir a un procesador aparte? ¿Comisión? `[PREGUNTAR]` | Define si podemos venderle a clientes de fuera de Bolivia y si entramos en alcance PCI. |
| **D6** | ¿Existe **botón de pago / link de pago** además del QR? `[PREGUNTAR]` | Un link de pago es más simple de integrar y funciona bien en WhatsApp, que es nuestro canal de venta. |

---

### 🟠 E. Recurrencia — P1

> **E1. ¿Existe débito automático mensual, o hay que generar un cobro nuevo cada mes?**
> `[PREGUNTAR AL BANCO]`

- **Por qué importa:** nuestro negocio es una suscripción mensual. Con débito automático,
  la renovación es invisible y la retención sube. Sin él, cada mes hay que generar un QR,
  avisarle al cliente y esperar que pague — eso es trabajo de cobranza recurrente, y es un
  costo operativo real, no un detalle técnico.
- **El tarifario público sí tiene una sección de débito automático** con costo por
  operación (§7), pero **no dice si es accesible por API** ni si sirve para nuestro caso.
  `[PREGUNTAR]`
- **Preguntar además:** ¿el cliente autoriza el débito una sola vez? ¿Cómo se revoca?
  ¿Qué pasa si no hay fondos — hay reintentos? ¿Nos notifican el fallo?
- 🔴 **Restricción normativa que ya conocemos y hay que respetar en el producto:** el
  art. 7 e) del reglamento del BCB prohíbe débitos automáticos *"salvo que cuenten con el
  consentimiento y autorización expresa, la cual en todo momento será **renovable o
  revocable** a solicitud del ordenante"* (§7.6). **Consecuencia de diseño:** cancelar la
  suscripción tiene que ser fácil y no puede depender de nuestra aprobación. Nada de
  "escribinos para dar de baja".
- **Ojo:** no existe en Bolivia un reglamento de domiciliación de pagos para suscripciones
  (§7.6). Todo lo demás lo define el contrato con el banco — razón de más para preguntarlo
  bien acá.

---

### 🟡 F. Ambientes, credenciales y habilitación — P1

| # | Pregunta | Por qué importa |
|---|---|---|
| **F1** | **¿Hay ambiente sandbox / de pruebas?** ¿Con credenciales propias y datos ficticios? `[PREGUNTAR]` | Sin sandbox, la primera prueba se hace con plata real. El portal público **no menciona sandbox en ninguna parte** (§7). |
| **F2** | ¿Qué se necesita exactamente para habilitarse: NIT, cuenta empresa, matrícula de comercio, contrato, Credinet Web? `[PREGUNTAR]` | Nada de esto está publicado (§7). Es lo que define si Sergio puede arrancar el trámite el mismo día. |
| **F3** | **¿Cuánto tarda, en días reales, desde que se firma hasta tener credenciales de producción?** `[PREGUNTAR]` | Es el dato de planificación más importante de la reunión. Pedir el plazo **real**, no el del folleto. |
| **F4** | ¿Qué forma tienen las credenciales? ¿Usuario/contraseña, API key, OAuth, **certificado**? `[PREGUNTAR]` | Si hay certificado, hay que resolver dónde vive y cómo se rota. Una librería de terceros menciona un "Certificate Password" (§7) — **es indicio, no dato**; confirmarlo. |
| **F5** | ¿Las credenciales de sandbox y producción son distintas? ¿Se puede tener las dos activas? `[PREGUNTAR]` | Define si podemos seguir probando después de salir a producción. |
| **F6** | ¿Quién es nuestro **contacto técnico** después de la reunión? ¿Hay canal de soporte para desarrolladores y SLA? `[PREGUNTAR]` | El portal **no publica correo de desarrolladores** (§7). Salir de la reunión con un nombre y un correo vale más que cualquier otra respuesta. |

---

### 🟡 G. Documentación — P1

| # | Pregunta |
|---|---|
| **G1** | ¿Nos entregan la **especificación de la API** (OpenAPI/Swagger o PDF)? ¿Cuándo? `[PREGUNTAR]` |
| **G2** | ¿Hay **colección de Postman** o ejemplos de request/response? `[PREGUNTAR]` |
| **G3** | ¿Hay **certificados** que instalar, y cómo se renuevan? `[PREGUNTAR]` |
| **G4** | ¿Existe **versionado** de la API y política de cambios/deprecación? ¿Cómo nos avisan? `[PREGUNTAR]` |
| **G5** | ¿Hay proceso de **certificación** antes de producción (que el banco valide nuestra integración)? ¿Cuánto tarda? `[PREGUNTAR]` |

> Contexto útil para justificar G1: de las 14 APIs que BCP lista públicamente, **solo 2
> tienen documentación abierta** — y ninguna de las de QR (§7). Es legítimo pedir la
> documentación como primer entregable de la reunión.

---

### 🟡 H. Requisitos legales y liquidación — P1

| # | Pregunta | Por qué importa |
|---|---|---|
| **H1** | ¿Qué contrato se firma y **quién debe firmarlo**? `[PREGUNTAR]` | Ver el bloqueo de titularidad en §6. |
| **H2** | **¿En cuánto tiempo el dinero está disponible en la cuenta — T+0, T+1, T+n?** `[PREGUNTAR]` | Es flujo de caja directo. Con runway ajustado, T+3 y T+0 no son lo mismo. |
| **H3** | ¿Hay **retenciones**, garantías o reservas sobre lo recaudado? `[PREGUNTAR]` | Una reserva del banco es capital inmovilizado. |
| **H4** | ¿Hay **montos mínimo y máximo** por transacción y topes diarios/mensuales? `[PREGUNTAR]` | Un tope mensual bajo frena el crecimiento sin aviso. |
| **H5** | **¿Cómo se hace una devolución?** ¿Por API o solo por mostrador? ¿Plazo? ¿Costo? `[PREGUNTAR]` | Cobro duplicado o baja anticipada. Sin devolución por API, cada caso es trabajo manual. |
| **H6** | ¿Qué pasa ante un **contracargo o reclamo**? ¿Qué evidencia nos piden? `[PREGUNTAR]` | Define qué tenemos que guardar y por cuánto tiempo. |
| **H7** 🔴 | **¿BCP exige que acreditemos un Sistema Informático de Facturación autorizado por el SIN antes de habilitarnos el cobro electrónico?** ¿Cómo se acredita y en qué momento del trámite? `[PREGUNTAR]` | **Es la pregunta que puede convertir la homologación SIAT en prerrequisito.** El art. 27.I del reglamento del BCB obliga al banco a verificarlo (§7.6). Si la respuesta es sí, la ruta crítica no es el webhook: es el SIAT. |
| **H7b** | ¿El banco emite algún comprobante, o **la factura fiscal la emitimos nosotros**? `[PREGUNTAR]` | Cobrar y facturar son cosas distintas. Nuestra facturación SIAT todavía es un bloqueo abierto (§6). |
| **H8** | ¿Hay obligación de reporte o de conservación de información por normativa? `[PREGUNTAR]` | Puede imponer retención de datos que hay que diseñar desde el principio. |

---

### 🟢 I. Seguridad — P2

| # | Pregunta |
|---|---|
| **I1** | ¿Hay **allowlist de IPs** — nuestras hacia el banco, y las del banco hacia nuestro webhook? ¿Publican sus rangos? `[PREGUNTAR]` |
| **I2** | ¿Se exige **mTLS** o basta TLS estándar? `[PREGUNTAR]` |
| **I3** | ¿Cada cuánto **rotan las llaves/certificados**? ¿Se puede rotar sin cortar el servicio (dos llaves válidas en la ventana)? `[PREGUNTAR]` |
| **I4** | Si en algún momento hay tarjeta: ¿la captura de datos es del lado del banco (fuera de nuestro alcance PCI) o nuestro? `[PREGUNTAR]` |
| **I5** | ¿Hay requisitos de auditoría, logs o retención que el banco imponga? `[PREGUNTAR]` |
| **I6** | ¿A quién se le avisa ante un incidente de seguridad, y en qué plazo? `[PREGUNTAR]` |

---

## 3. Qué llevamos nosotros a la mesa

**Los 5 puntos para decir en voz alta:**

1. **Ya existe una capa de pasarela en el producto**, con proveedor enchufable: hay una
   interfaz común (`crear pago` / `probar conexión`) con dos proveedores ya escritos
   (PagosNet y Circle). Enchufar BCP es agregar un adaptador, no rehacer el sistema.
2. **Ya hay una tabla de configuración de pasarela por cliente**, con la API key **cifrada
   en base (AES-256-GCM)**, ambiente sandbox/producción y prueba de conexión.
3. **Ya hay endpoints de webhook escritos y funcionando**, con **verificación de firma
   HMAC-SHA256 sobre el cuerpo crudo**, comparación en tiempo constante, y **procesamiento
   idempotente** (lock transaccional en base + control de duplicados), de modo que una
   notificación repetida no cobra ni acredita dos veces.
4. **Ya hay un checkout con QR** en producción y un catálogo de precios único y validado
   en servidor, que rechaza montos que no coincidan con el plan. La pantalla de
   configuración incluso **muestra la URL del webhook lista para copiar** y pegarla en el
   panel del proveedor — o sea que si BCP entrega credenciales y una URL para registrar,
   el circuito de configuración ya está.
5. **Lo que falta es exactamente el lado del banco:** el QR es una imagen estática y la
   confirmación es manual (el usuario sube una captura y alguien la aprueba). En cuanto
   haya credenciales y aviso de acreditación, el circuito se cierra.

**Lo que NO hay que decir** (porque no es cierto y se cae con una pregunta):

- No decir que "la pasarela está funcionando". **No lo está**: hoy el endpoint de pago en
  línea devuelve `410 Gone`, la función que procesa pagos no tiene ningún llamador, y la
  pasarela está **apagada en los cinco planes**. Está *escrito*, no *encendido*.
- No decir que ya integramos con otro banco. No integramos con ninguno todavía.
- No prometer volúmenes. Hoy hay **0 clientes pagando** por pasarela.

**El encuadre honesto y fuerte, que es el que conviene:**

> "Tenemos el enchufe construido y probado del lado del software — cifrado de credenciales,
> firma de webhook e idempotencia incluidos. Lo que nos falta es del lado del banco:
> credenciales, un ambiente de pruebas, y el aviso de que el pago se acreditó. Por eso
> venimos con preguntas concretas y no con una idea."

---

## 4. Los 3 escenarios y qué implica cada uno

Salir de la reunión sabiendo **cuál de estos tres es**, es el objetivo mínimo.

### (a) Webhook + Onia cobra a nombre propio → **alta 100% automática**

- **Producto:** self-serve real. Paga → entra, en el mismo minuto. La web puede prometer
  "activá tu cuenta en 2 minutos". Vender no requiere que Sergio esté presente.
- **Qué se construye:** adaptador BCP · webhook firmado con idempotencia · entidad
  suscripción con estados · cobro con identificador propio · reconciliador de respaldo.
- **Costo aproximado:** el más barato de los tres, porque es el que el diseño ya asume.
  El grueso es la entidad suscripción, que hay que hacer en cualquier escenario.
- **Riesgo:** que el banco tarde en habilitar producción. Mitigación: exigir sandbox
  primero (F1) y arrancar el trámite el mismo día de la reunión.

### (b) Webhook + cada cliente con su propia cuenta → **automática, pero con onboarding bancario por cliente**

- **Producto:** el "paga → entra" se rompe. Cada cliente tiene que abrir cuenta empresa,
  firmar contrato con el banco y esperar credenciales **antes** de poder pagarnos. Eso no
  es self-serve: es una venta asistida con un trámite bancario en el medio.
- **Qué se construye:** todo lo de (a) **más** un flujo de onboarding bancario asistido
  (instructivo, seguimiento del trámite, carga segura de credenciales por cliente,
  prueba de conexión) y soporte humano para acompañarlo.
- **Costo:** notablemente mayor, y **el costo no es solo de construcción sino permanente**:
  cada cliente nuevo consume horas de acompañamiento. Con planes de Bs 320/mes, eso se
  come el margen.
- **Consecuencia comercial:** hay que decidir si el cobro de la suscripción se hace por
  otra vía (transferencia, QR propio, efectivo) y se reserva la integración por cliente
  solo para el Plano B (que el cliente le cobre a **sus** clientes).

### (c) Sin webhook → **el alta necesita polling o confirmación manual, y hay que decirlo**

- **Producto:** el mensaje cambia de "entrás al instante" a **"tu acceso se activa en
  pocos minutos"**. Es aceptable si el polling es de minutos; deja de serlo si es de horas.
- **Qué se construye:** todo lo de (a) **menos** el webhook, **más** un reconciliador que
  consulta el estado con backoff, poll desde el front mientras el modal está abierto, y un
  botón de confirmación manual para soporte.
- **Costo:** parecido a (a) en construcción, **pero agrega un costo operativo permanente**:
  alguien tiene que mirar los pagos que quedaron colgados, y cada uno es un cliente que
  pagó y no entró — el peor ticket de soporte que existe.
- **Mitigación de diseño:** que el camino con webhook y el de polling terminen en **la
  misma función de alta**, para que agregar el webhook después sea cambiar el disparador
  y no rehacer nada (`ONIA_PAGOS_ARQUITECTURA_20260730.md` §3.7).

### Y el escenario que no se puede descartar

**(d) El banco no puede en un plazo útil.** Si la habilitación se va a meses, el plan B es
cobrar la primera camada de clientes **manualmente** (QR propio + comprobante, que es lo
que ya está construido) y no bloquear la venta esperando al banco. Salir de la reunión con
un plazo realista (F3) es lo que permite decidir esto.

---

## 5. Cómo conducir la reunión

- **Primeros 5 minutos:** contexto (§1) + **A1** (modelo comercial) + **B1** (webhook).
  Con esas dos respuestas ya se sabe en qué escenario estamos.
- **Minutos 5-25:** C (identificador), D (producto y comisión), F (sandbox y plazos).
- **Minutos 25-40:** E (recurrencia), H (liquidación y devoluciones), G (documentación).
- **Cierre:** I se puede dejar por correo. **No irse sin:** (1) nombre y correo del
  contacto técnico, (2) compromiso de fecha para la documentación, (3) el plazo real de
  habilitación.
- **Tomar nota literal de las comisiones y los plazos.** No reconstruirlos de memoria
  después: si el número entra mal al modelo de precios, se propaga a las propuestas.
- **Si una pregunta no la saben responder**, pedir a quién se la trasladan y para cuándo.
  Es información igual de útil.

---

## 6. Checklist de Sergio — qué llevar y qué destrabar antes

### 🔴 Bloqueo a resolver ANTES de la reunión: quién firma

**Dato verificado en los documentos de Onia:**

| Dato | Valor | Fuente |
|---|---|---|
| Razón social / titular | **LESLIE MERCADO MORENO** (empresa unipersonal) | `ONIA_GASTOS_CAPTURA_CREDITO_FISCAL_2026.md`, `ONIA_SIAT_HABILITAR_FACTURACION_CHECKLIST_2026.md` |
| NIT | **5371375010** — Régimen General, ACTIVO, Gerencia Distrital Santa Cruz II | `ONIA_SIAT_HABILITAR_FACTURACION_CHECKLIST_2026.md` |
| Denominación SEPREC | **OniaAgency**, matrícula 5371375010 | `ONIA_MARCA_REGISTRO_RIESGO_20260727.md` |
| Actividad registrada | 4651200 venta de programas de informática (primaria) · 6209920 servicios en la nube · 6312000 portales web | `ONIA_TABLERO_20260709.md` |

**El problema:** la titular legal es **Leslie Mercado Moreno, no Sergio**. Si el banco
exige que el **titular** firme el contrato de cobros electrónicos y presente su documento
—que es lo habitual—, Sergio **no puede firmar solo**.

**Qué hacer ANTES del miércoles (no en la reunión):**

- [ ] **Llamar a BCP y preguntar quién debe firmar** un contrato de cobros electrónicos de
      una empresa unipersonal. Línea gratuita **800103060** (publicada, §7). Esto se puede
      hacer hoy y no cuesta nada.
- [ ] Confirmar **la disponibilidad de Leslie Mercado Moreno** para firmar (y si puede
      asistir a la reunión, mejor).
- [ ] Si no puede asistir, averiguar si sirve un **poder notarial** y qué alcance debe
      tener. Preguntarlo **antes** evita perder una semana después de la reunión.

> Descubrir esto en la reunión cuesta un ciclo entero de trámite. Saberlo antes convierte
> un bloqueo en un ítem de agenda.

### Documentación a llevar

- [ ] **NIT 5371375010** — certificado de inscripción al padrón
- [ ] **Matrícula de comercio SEPREC** de OniaAgency
- [ ] **Documento de identidad de la titular** (Leslie Mercado Moreno)
- [ ] Documento de identidad de Sergio
- [ ] **Datos de la cuenta BCP** de la empresa, si ya existe — y si no existe,
      preguntar si abrirla es requisito previo o se hace en paralelo `[PREGUNTAR]`
- [ ] Este documento impreso, o al menos §1 y §2 (A, B, C)

### Lo que conviene llevar preparado del lado técnico

- [ ] **El dominio y la URL** donde vivirá el webhook (aunque todavía no exista el endpoint).
      Si el banco pide registrarla en el momento, tenerla decidida ahorra un ida y vuelta.
      El patrón que ya usa el sistema es
      `https://<dominio>/api/webhooks/<identificador>/<proveedor>` — para el cobro de la
      suscripción de Onia habría que decidir un identificador de plataforma, porque el
      actual está pensado por cliente (ver `ONIA_PAGOS_ARQUITECTURA_20260730.md` §3.3).
- [ ] Los **rangos de IP de salida** de nuestro servidor, por si piden allowlist.
- [ ] Una descripción de una línea del volumen esperado (aunque hoy sea 0 — decirlo así).

### Preguntas que Sergio debe poder responder si el banco las hace

| El banco pregunta | Respuesta |
|---|---|
| ¿Qué vende Onia? | Software de gestión por suscripción para empresas bolivianas. Actividad registrada: venta de programas de informática y servicios en la nube. |
| ¿Cuánto esperan facturar por mes? | Ser honesto: hoy 0 clientes pagando por pasarela; planes de Bs 320 a 2.900/mes; el objetivo cercano es una primera camada de clínicas. |
| ¿El dinero es de ustedes o de terceros? | De Onia — es el precio de nuestro software. Distinto del otro caso de uso (que nuestros clientes cobren a los suyos), donde la cuenta sería del cliente. |
| ¿Ya tienen sistema? | Sí, en producción, con la capa de pasarela construida y esperando credenciales. |

### Bloqueos vecinos que conviene tener en la cabeza

- 🔴 **Facturación SIAT (bloqueo S2, caduca 1-oct-2026) — puede ser PRERREQUISITO, no
  bloqueo vecino.** El art. 27.I del reglamento del BCB obliga a las entidades financieras
  a verificar, **previo a la prestación del servicio de cobro**, que la empresa acredite un
  Sistema Informático de Facturación autorizado por el SIN (§7.6). Es decir: puede que el
  banco no nos habilite el cobro hasta que la homologación SIAT esté hecha.
  **Qué hacer antes del miércoles:** tener claro el estado real de nuestra homologación
  para poder responderlo en la reunión sin adornarlo, y hacer la pregunta H7 temprano.
  Si la respuesta es "sí, es requisito", el orden de trabajo posterior a la reunión cambia:
  primero SIAT, después pasarela.
- El **ambiente de desarrollo escribe en la base de producción**
  (`ONIA_PARQUEADO_20260730.md` §2). Eso hay que aislarlo **antes** de la primera prueba
  de sandbox, no después.

---

## 7. Anexo — lo que sí está verificado públicamente (con fuente)

> Investigado y verificado sobre el HTML de bcp.com.bo el **2026-07-30**. Esto se puede
> citar en la reunión. Todo lo demás es pregunta.

### 7.1 Lo que BCP lista públicamente

Portal: **https://www.bcp.com.bo/Desarrollo** ("Apis abiertas"), tres categorías:

| Categoría | APIs listadas (nombres literales del portal) |
|---|---|
| **APIs Públicas** ([link](https://www.bcp.com.bo/Desarrollo/ApiPublica)) | Tipo de Cambio · Agencias y Sucursales · Agentes BCP · Café BCP · ATMs BCP |
| **APIs Pagos QR Simple** ([link](https://www.bcp.com.bo/Desarrollo/ApiPagosQR)) | **Generación QR** ("Genera códigos QR para el uso de transacciones bancarias") · **Consulta Pagos QR** ("Obtiene información sobre pagos con codigos QR") · **Pagos QR** |
| **APIs Privadas Banca Empresas** ([link](https://www.bcp.com.bo/Desarrollo/ApiPrivada)) | Saldos y Movimientos · Transferencias · Pagos a proveedor · Abono de sueldos · Extractos · **Recaudaciones QR** |

### 7.2 El hallazgo más importante: la documentación de QR **no es pública**

De las 14 APIs listadas, **solo 2 tienen documentación abierta**: `Tipo de Cambio` y
`Agencias y Sucursales`. En las páginas de **Pagos QR** y de **Banca Empresas**, los
botones "Documentación" son enlaces vacíos (`href=""`) que no llevan a ningún lado.
Se verificó además que una ruta esperable de documentación de QR devuelve **HTTP 404**.

El propio portal lo confirma en su texto: *"Si tu deseas integrar tu negocio u empresa a
nuestro sistema de pagos, llena el siguiente formulario para que te enviemos la
documentación técnica de nuestros servicios."*

**Consecuencia práctica:** no existe forma pública de evaluar la integración antes de
hablar con el banco. Por eso **G1 (que nos entreguen la especificación) es un entregable
legítimo de esta reunión**, no un favor.

### 7.3 Lo que el portal NO menciona en ninguna parte

Verificado por búsqueda en el HTML de las cuatro páginas del portal:

| Concepto | Estado |
|---|---|
| `sandbox` / `ambiente de pruebas` | **Cero menciones** → F1 |
| `webhook` / `notificación` / `callback` | **Cero menciones** → B1 |
| Requisitos (NIT, cuenta empresa, contrato) | **No publicados** → F2 |
| Comisiones de la API | **No publicadas** → D3, D4 |
| Correo de contacto para desarrolladores | **No publicado** → F6 |

### 7.4 Lo que sí está publicado y hay que interpretar con cuidado

- **QR sin comisión — pero es OTRO producto.** https://www.bcp.com.bo/QR dice
  literalmente: *"No, pagar y/o cobrar mediante QR no tiene ninguna comisión adicional."*
  **Ese es el QR de cuenta de ahorros para personas, no la integración por API.**
  No afirmar en la reunión que la API es sin comisión. Preguntarlo (D3).
- **El QR personal es gratuito para titulares de cuenta de ahorros:** *"Pueden solicitar
  material QR totalmente gratuito todas las personas que tengan una cuenta de ahorros en
  el BCP."* (misma fuente).
- **Tarifario de Servicios para Empresas**
  ([link](https://www.bcp.com.bo/Tarifario/Servicios_Empresas_Tarifario)) — filas
  relevantes, vigentes desde 01/02/2010:

  | Ítem | Concepto | Monto |
  |---|---|---|
  | 5.1 Servicios de Recaudación | Solo Recaudación | Bs. 4,00 por operación |
  | 5.2 Servicios de Recaudación | Recaudación + Facturación | Bs. 4,80 por operación |
  | 6.1 Débito Automático | Solo Recaudación | Bs. 2,00 por operación |
  | 6.2 Débito Automático | Recaudación + Facturación | Bs. 2,80 por operación |

  **No hay ninguna línea de QR ni de API en ese tarifario.** Dos lecturas posibles: que
  el QR no esté tarifado ahí, o que aplique alguna de estas. **Preguntar cuál aplica (D4).**
  Dato para dimensionar: Bs 4,00 sobre una suscripción de Bs 320 es **1,25%**; sobre
  Bs 2.900 es 0,14%. El costo fijo por operación castiga al plan barato.

- **Contacto publicado:** línea gratuita **800103060** (24/7) · **2114141** (La Paz) ·
  **3114141** (Santa Cruz) · **4114141** (Cochabamba) · formulario en
  `/Desarrollo#RegistroForm` (campos: nombre completo, empresa, email, celular).

### 7.5 Fuentes de terceros — **NO OFICIALES, no citar como dato**

Existen proyectos públicos de terceros sobre QR de BCP. **No son documentación del banco**
y no se pueden usar como afirmación en la reunión. Sirven solo para **formular mejor las
preguntas**:

- `github.com/emizoripx/payment-bcp-qr` — librería de terceros, sin licencia declarada.
  Menciona un **webhook** para recibir respuestas de transacciones (→ refuerza B1 como
  pregunta, **no la responde**) y una lista de credenciales que incluye un
  **"Certificate Password"** (→ refuerza F4). **Todo esto es indicio, no dato.**
- `github.com/99Arrzel/BCP-ADB-BOLIVIA` — automatiza la app móvil por ADB para generar QR.
  Su existencia es señal de que conseguir acceso a la API oficial es difícil; no es una
  integración recomendable.

### 7.6 Marco regulatorio boliviano — verificado en fuente oficial

> **Cómo usar esto:** sirve para **hablar el idioma correcto** en la reunión, no para
> discutirle regulación al banco. Citar la norma cuando ayuda a precisar la pregunta;
> nunca para afirmar cómo nos clasifica ASFI. **Advertencia de método:** el PDF oficial
> de la RD 079/2022 es un escaneo sin capa de texto y las citas se leyeron por OCR. Son
> fieles hasta donde el escaneo permitió, pero **antes de usar una cita textual en un
> contrato o ante un regulador, contrastarla contra el PDF original.** Nada de esto es
> asesoramiento legal.

**La norma marco:** Resolución de Directorio **BCB N° 079/2022** (6-sep-2022), que aprueba
el *Reglamento de Servicios de Pago, Instrumentos Electrónicos de Pago, Compensación y
Liquidación*. Dejó sin efecto las RD 069/2021 y 129/2021, y **supera el antiguo "RIEP" del
BCB**. [PDF oficial](https://www.bcb.gob.bo/webdocs/01_resoluciones/RD%20079%202022.pdf) ·
[comunicado BCB CP63/2022](https://www.bcb.gob.bo/webdocs/11_comunicados/cp_pasarelas_pago.pdf).

| Artículo | Qué dice (resumen fiel) | Para qué nos sirve |
|---|---|---|
| **Art. 4 a)** | Define **APP** con dos modalidades: **Agregador** (*"reciben, agrupan y transfieren los pagos"*) y **Facilitador** (*"los recursos se transfieren directamente a la cuenta del aceptante"*). | El vocabulario exacto de A1/A3. |
| **Art. 37** | El contrato banco↔APP debe fijar **segregación de cuentas propias/de terceros** y **liquidación en máximo 48 horas** (salvo fines de semana y feriados). | Las obligaciones del agregador — que no aplican si el dinero es propio. |
| **Art. 38** | El banco *"asumirá la responsabilidad por la prestación del servicio"* y los daños por servicio deficiente. | Explica por qué el banco es exigente en el onboarding. |
| **Art. 11, 13.I** | Los **servicios de pago** los prestan entidades financieras o **ESP con licencia ASFI**. | Marca el perímetro de lo que necesita licencia. |
| **Art. 72 f)** | ASFI *"verificará si empresas no autorizadas […] estuvieran efectuando servicios de pago y/o realizando masivamente o de forma habitual actividades propias de las entidades financieras"*, y puede obligarlas a constituirse como empresa de servicios financieros complementarios. | El riesgo real está en **cobrar por cuenta ajena de forma masiva o habitual**, no en cobrar lo propio. |
| **Art. 8.I** | El BCB *"podrá aprobar tarifas, comisiones y otros cargos máximos"* aplicables a instrumentos electrónicos de pago. | Hay techos posibles, **no gratuidad automática**. |
| **Art. 36 d), e), f)** | El **aceptante** no puede establecer recargos por pagar con instrumento electrónico, ni montos mínimos de compra, ni eliminar descuentos por usarlo. | **Nos aplica a nosotros:** no podemos cobrar un extra por pagar con QR. |
| **Art. 4 ee) + 7 e)** | Débito automático definido; y *"No efectuar débitos automáticos […] salvo que cuenten con el consentimiento y autorización expresa, la cual en todo momento será renovable o revocable a solicitud del ordenante"*. | Ver §2.E. |
| **Disp. Transitoria Única** | Obliga a las entidades con banca móvil a habilitar pagos QR **interoperables** (90 días hábiles). | El QR interoperable es obligatorio para los bancos. |
| **Art. 27.I** | 🔴 Ver el recuadro de abajo. | **El hallazgo más accionable de todo el anexo.** |

#### 🔴 El artículo que hay que leer antes de la reunión: 27.I

> *"Las EIF, previo a la prestación de servicios de cobro que se procesen a través de
> banca electrónica, banca móvil o billetera móvil, deberán verificar que la empresa que
> requiere el servicio de cobro acredite la disposición de un **Sistema Informático de
> Facturación autorizado por el Servicio de Impuestos Nacionales (SIN)** que permita el
> envío de la información de la transacción en formato XML y la 'Representación gráfica
> del documento fiscal digital'…"* — RD 079/2022, art. 27.I

**Traducción:** el banco tiene **obligación normativa** de verificar nuestra facturación
SIAT **antes** de habilitarnos el cobro electrónico. La homologación SIAT (bloqueo S2)
no es un trámite paralelo — puede ser **prerrequisito del cobro**. Esto hay que preguntarlo
sí o sí (ver H7 y §6).

#### Sobre el nombre "QR Simple" y la comisión cero

- **El nombre oficial del esquema estatal es "QR BCB Bolivia"**, no "QR Simple"
  ([BCB](https://www.bcb.gob.bo/?q=pagos_qr_bcb_bolivia)). *"QR Simple"* es el nombre
  comercial que usa BCP en su portal. Los dos nombres conviven; usar el del banco cuando
  se habla con el banco.
- 🔴 **Corrección a un supuesto interno de Onia:** la idea de que *"QR Simple = comisión 0"*
  **no está respaldada por ninguna norma**. Se revisó la RD 079/2022 completa, la página
  oficial de QR del BCB y el documento de ASFI sobre QR: ninguno declara gratuidad para el
  cobrador. Lo que existe es el art. 7 x), que prohíbe cobrar **por el estándar y la
  interoperabilidad** — no fija en cero la comisión de la transacción. **La comisión cero
  que publica BCP es política comercial de ese banco, no un derecho exigible.**
  Consecuencia: **no prometer comisión cero en ninguna propuesta a cliente** sin
  confirmarlo banco por banco. → refuerza D3.
- ASFI ubica el origen regulatorio del QR en 2019 (RD 137/2019), hoy superada por la
  RD 079/2022 —
  [documento ASFI](https://www.asfi.gob.bo/sites/default/files/2025-07/El%20uso%20del%20QR%20ha%20dinamizado%20el%20sistema%20de%20pagos%20en%20Bolivia.pdf).

#### ¿Hay licencia para operar como pasarela?

- **Hasta 2024: no existía licencia propia de APP.** La pasarela se regulaba
  **indirectamente**, por el contrato con el banco: art. 7 y) obliga al banco a suscribir
  contrato específico, art. 37 fija su contenido mínimo, art. 38 pone la responsabilidad
  final en el banco. ASFI lo reglamentó por **Resolución ASFI/418/2024 / Circular
  ASFI/821/2024 (9-may-2024)**, incorporando la Sección 8 *"Contratos con Administradoras
  de Pasarelas de Pagos"* y su Anexo 1 —
  [Boletín ASFI N° 64](https://www.asfi.gob.bo/sites/default/files/2025-08/Bolet%C3%ADn%2064%20-%20Junio%202024.pdf).
  **El sujeto obligado es el banco, no la pasarela.**
- **Confirmación empírica:** en la lista oficial de *Empresas de Servicios Financieros
  Complementarios con Licencia de Funcionamiento* de ASFI (al 17-sep-2025)
  **no figura ninguna pasarela de pago** —
  [PDF ASFI](https://www.asfi.gob.bo/sites/default/files/2025-09/SIGLAS%20ESFC.pdf).
  Sí figuran: **E-FECTIVO S.A.** (Tigo Money, única ESPM), **ATC S.A.** y **LINKSER S.A.**
  (administradoras de tarjetas), **ACCL S.A.** y **UNILINK S.A.** (cámaras de compensación).
- 🟠 **Pero desde 2025 hay régimen ETF** (DS 5384 + Resolución ASFI/540/2025), con "Pagos"
  entre sus categorías y adecuación desde el 31-dic-2025. **Puede haber movido la línea.**
  → es exactamente la pregunta A4.
- **De las pasarelas que se nombran habitualmente:** solo **Tigo Money / E-FECTIVO** tiene
  figura licenciada confirmada (ESPM). **Libélula/Todotix** no figura en la lista de ASFI
  — lo más probable es que opere como APP regulada vía contrato, pero **no se pudo
  confirmar en fuente oficial**. De **Pagosnet** y **Kuskapay** no se encontró información
  oficial sobre su figura legal.

#### Lo que quedó sin verificar (no afirmarlo en la reunión)

- Articulado íntegro de la Resolución ASFI/418/2024 (solo se tiene el resumen oficial del
  Boletín ASFI N° 64).
- Articulado íntegro del reglamento ETF (Resolución ASFI/540/2025) y **si su categoría
  "Pagos" abarca expresamente a pasarelas y agregadores**. ← es lo que decide A4.
- Figura legal exacta de Pagosnet, Kuskapay y Libélula/Todotix.
- Cualquier norma que establezca gratuidad del QR para el cobrador: **no existe hasta
  donde se pudo verificar**.
- No hay reglamento boliviano específico de **domiciliación / mandato de débito recurrente**
  para suscripciones (equivalente a un débito directo europeo). Se instrumenta por contrato
  con el banco bajo el art. 7 e).

**Recomendación:** para el diseño definitivo del esquema de cobro —sobre todo si alguna
vez se cobra por cuenta de terceros— hace falta un abogado boliviano de regulación
financiera y, muy probablemente, una consulta formal a ASFI. **Esta reunión no reemplaza
eso.**

### 7.7 Contexto que no es de BCP

El **Banco Central (BCB)** publicó una iniciativa de APIs de pagos (OpenBCB) que, según
prensa especializada, incluye notificación automática de transacciones. **Es otra entidad
y otro producto** — no asumir que BCP lo ofrece. Si viene al caso, sirve como pregunta:
*¿BCP se conecta a esa infraestructura?* `[PREGUNTAR]`

---

## 8. Estado del código de Onia — resumen para el que prepare la demo

Verificado en `C:\dev\proyectos\DentaGest\dental-saas` el 2026-07-30. Detalle completo en
`ONIA_PAGOS_ARQUITECTURA_20260730.md`.

| Pieza | Dónde | Estado |
|---|---|---|
| Interfaz de pasarela | `lib/gateway.ts` | Escrita. Proveedores: `pagosnet`, `circle`. `processPayment()` **sin ningún llamador**. |
| Config por cliente | `prisma/schema.prisma:820` (`gateway_configs`) | Existe. API key cifrada AES-256-GCM. |
| Webhooks de pago | `app/api/webhooks/[tenantId]/{pagosnet,circle}/route.ts` | **Bien escritos**: firma HMAC-SHA256, comparación en tiempo constante, lock transaccional, reconciliación de montos. Devuelven 404 si no hay config — y hoy no hay ninguna. |
| Pago en línea de facturas | `app/api/invoices/[id]/pay/route.ts` | **410 Gone** — desactivado a propósito. |
| Pasarela por plan | `lib/plan-limits.ts` | `gatewayEnabled: false` en **los 5 planes**. |
| Cobro de la suscripción | `components/billing/QRPaymentModal.tsx` | **QR estático** (`/assets/qr-payment.png`) + captura + datos tipeados a mano. |
| Alta de la cuenta | `api/admin/subscription-payments` · `api/n8n/callback/subscription-approve` | Manual (SUPERADMIN) o n8n con `autoApprove`. Escribe `organization.plan` + `planEnd`. |
| Precios | `lib/subscription-plans.ts` | Bs 320 / 750 / 1.500 / 2.900 mensual · anual = 10× · override por env. |
| Documento de arquitectura | `docs/GATEWAY.md` | Marcado como **legacy**: *"PagosNet y Circle.bo no se ofertan como función comercial activa. El flujo vigente de venta usa pago manual por QR/comprobante y revisión en Super Admin."* Declara además que **el dinero va directo al banco del cliente y el sistema no intermedia pagos** — útil para A2. |

**Traducción a una frase:** el enchufe está construido y probado; falta el otro lado del
cable.

---

Relacionado: `ONIA_PAGOS_ARQUITECTURA_20260730.md` (diseño y brecha técnica) ·
`hermes-content/propuestas/BCP_PASARELA_CREDENCIALES_INTERNO.md` (credenciales por cliente,
Plano B) · `ONIA_PARQUEADO_20260730.md` (bloqueo de cobro y contexto) ·
`ONIA_SIAT_HABILITAR_FACTURACION_CHECKLIST_2026.md` (datos fiscales y bloqueo S2)
