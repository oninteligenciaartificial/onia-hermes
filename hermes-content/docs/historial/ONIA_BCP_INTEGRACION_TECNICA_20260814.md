# Onia Platform ↔ BCP — Documento de integración técnica

> **Documento externo.** Es el papel que se entrega o se envía por correo a los
> ingenieros de integración de BCP Bolivia. Está escrito para que ellos sepan
> exactamente qué habilitar y qué respondernos.
>
> **Versión 1.0 — 2026-08-14.**
> Emisor: **OniaAgency** (Onia Platform) · NIT **5371375010** · Santa Cruz de la Sierra, Bolivia.
> Contacto técnico: Sergio Mercado — oninteligenciaartificial@gmail.com
> Firma del contrato: **Leslie Mercado Moreno**, titular (ver §4.4).
>
> **Regla de este documento:** lo que está en §1, §4 y §5 son **datos nuestros**,
> verificables. Lo que está en §2 y §3 son **pedidos y preguntas**. No afirmamos
> ningún endpoint, comisión ni plazo de BCP que no nos hayan confirmado por escrito.
>
> Documentos internos que lo respaldan (no se envían): `ONIA_REUNION_BCP_PREP_20260812.md` ·
> `ONIA_BCP_REUNION_20260805.md` · `ONIA_PAGOS_ARQUITECTURA_20260730.md` ·
> `ONIA_CHECKOUT_TARJETA_VERIFICACION_20260812.md` · `ONIA_CHECKOUT_Y_REUNION_BCP_20260802.md`.

---

## 0. En una página — qué pedimos

Somos una empresa boliviana de software. Vendemos **Onia Platform**, un sistema de
gestión por suscripción para empresas bolivianas (clínicas, comercios, importadoras,
servicios). Precios en bolivianos: **Bs 320 / 750 / 1.500 / 2.900 al mes**, con opción
semanal y anual. El sistema está **en producción** en `app.onia.com.bo`.

Hoy el cobro funciona así: el cliente paga a un **QR estático**, sube una **foto del
comprobante**, y una persona de Onia lo aprueba a mano. Funciona, pero no escala y no
es self-service.

**Lo que le pedimos al banco, en orden de importancia:**

| # | Qué | Para qué |
|---|---|---|
| 1 | **Generar QR dinámico por API**, con monto exacto, vencimiento y **una referencia nuestra** | Es lo que permite saber *quién* pagó antes de que pague |
| 2 | **Aviso automático de acreditación** (webhook firmado a una URL nuestra) | Convierte "en unas horas" en "al instante" |
| 3 | **Consulta de movimientos / estado de cobro** por API | Es el respaldo que hace que el sistema funcione igual si el webhook falla o no existe |
| 4 | **Ambiente de pruebas (sandbox)** con credenciales propias | Sin esto, la primera prueba se hace con dinero real |

**Lo que NO pedimos:** crédito ni financiamiento · custodia de fondos de terceros ·
exclusividad · procesamiento de tarjetas (si el QR resuelve).

---

## 1. Qué somos ante el banco

**Onia opera bajo la modalidad FACILITADOR, no Agregador** — en el vocabulario del
art. 4 inciso a) del *Reglamento de Servicios de Pago* (Resolución de Directorio BCB
N° 079/2022): proveemos la infraestructura tecnológica que enruta el pago, y **los
recursos se transfieren directamente a la cuenta del aceptante**. Onia nunca recibe,
agrupa ni transfiere dinero de terceros, de modo que las obligaciones del agregador
del art. 37 (segregación de cuentas propias y de terceros, liquidación a comercios en
48 horas) no nos aplican: no hay fondos de terceros que segregar ni que liquidar.

Esto define dos planos que conviene no mezclar, porque tienen contrapartes distintas:

| Plano | Quién cobra | De quién es el dinero | Nuestra figura | Estado |
|---|---|---|---|---|
| **A — Suscripción de Onia** | Onia cobra su propio software a sus clientes | **De Onia.** Es el precio de nuestro producto | **Aceptante** (un comercio más). No hay dinero de terceros | **Es lo que se integra ahora** |
| **B — Cobro de nuestros clientes** | Cada cliente de Onia cobra a *sus* clientes desde nuestro software | **Del cliente.** Cae directo en **su** cuenta | **Facilitador** (art. 4 a) | Diseñado y ya implementado así; se habilita después |

En el plano B, la arquitectura ya está construida de esa forma y no por conveniencia
regulatoria: cada cliente configura **su propia** cuenta y sus propias credenciales, y
el dinero va directamente a su banco. Onia no intermedia pagos en ningún punto del
código.

**Consecuencia práctica para el banco:** lo que se habilita ahora es una cuenta
recaudadora de **Onia**, para **su propio** cobro. La discusión de figura de pasarela
aplica al plano B, y cuando llegue, cada cliente firma con el banco, no nosotros.

---

## 2. Qué necesitamos técnicamente

### 2.1 Ambientes

| Ambiente | Para qué | Necesidad |
|---|---|---|
| **Sandbox** | Integrar y certificar sin dinero real | Credenciales propias, datos ficticios, y que **coexista con producción** (que salir a producción no nos deje sin ambiente de pruebas) |
| **Producción** | Cobro real | Credenciales separadas, con procedimiento de rotación |

Necesitamos poder tener **las dos activas al mismo tiempo**. Si el paso a producción
invalida el sandbox, cada cambio posterior se prueba contra dinero real.

### 2.2 Credenciales

Necesitamos saber **qué forma tienen** para resolver dónde viven y cómo se rotan:
API key · usuario/contraseña · OAuth (client credentials) · **certificado cliente**
(hay indicios de terceros de que BCP usa certificado con contraseña, pero no es
documentación del banco y no lo damos por cierto).

De nuestro lado:
- Las credenciales de plataforma se guardan **cifradas en base (AES-256-GCM)**, nunca
  en código ni en variables de entorno en claro.
- Ya tenemos implementado el mismo esquema para otros proveedores, con prueba de
  conexión y ambiente sandbox/producción por credencial.
- Necesitamos poder **rotar sin cortar el servicio**: que se acepten dos credenciales
  válidas durante la ventana de rotación.

### 2.3 Endpoints que necesitamos

Nombrados por lo que hacen, no por el nombre comercial de BCP (que es parte de lo que
preguntamos en §3.4):

| # | Operación | Entrada mínima | Salida mínima |
|---|---|---|---|
| **E1** | **Crear cobro / generar QR** | monto, moneda (BOB), glosa, **referencia externa nuestra**, vencimiento | id del cobro en BCP, **payload del QR** (cadena EMVCo) y/o imagen, vencimiento efectivo |
| **E2** | **Consultar estado de un cobro** | id del cobro (de BCP) o nuestra referencia externa | estado (pendiente / pagado / vencido / reversado), monto, fecha-hora de acreditación |
| **E3** | **Listar movimientos / recaudaciones** | rango de fechas, cuenta | por movimiento: monto, fecha-hora, referencia, origen |
| **E4** | *(deseable)* **Anulación o devolución** | id del cobro, monto | resultado, id de la devolución |

**E1 y E2 son el mínimo viable.** **E3 es lo que nos permite conciliar solos aunque el
webhook no exista o falle** — por eso lo pedimos explícitamente y no como extra.

**Sobre el QR (E1), lo que necesitamos que devuelva:**
- La **cadena del QR** (payload EMVCo / QR BCB Bolivia), no solo una imagen: la
  renderizamos nosotros, con nuestro diseño y en el tamaño correcto para móvil.
- El **vencimiento**, y que sea **configurable**. Un QR que no vence puede pagarse dos
  veces; uno que vence en 60 segundos obliga a regenerarlo en pantalla.
- Confirmación de si el QR es **de monto fijo** (el pagador no puede alterarlo) —
  para nosotros es requisito: el monto lo define el plan, no el pagador.
- Si es **interoperable** (pagable desde la app de cualquier banco boliviano). Nuestros
  clientes no son todos del BCP.

### 2.4 Notificación del pago

**Preferencia: webhook.** `POST` a una URL nuestra, en cuanto el pago se acredita.
Lo que necesitamos que traiga:

| Campo | Por qué |
|---|---|
| **id de evento** estable y único | Para deduplicar. Sin esto, un reenvío puede acreditar dos veces |
| id del cobro | Para cruzarlo con lo que creamos en E1 |
| **nuestra referencia externa**, tal cual la enviamos | Es lo que ata el pago a la suscripción |
| monto y moneda | Para validar contra el plan |
| fecha-hora de la acreditación | Para calcular el período del plan |
| tipo de evento | Necesitamos también los **fallidos, vencidos y reversados**, no solo los aprobados. Sin evento de vencimiento, los cobros pendientes quedan colgados para siempre |
| **firma** | Ver §5.3 |

**Alternativa si no hay webhook: polling.** Consultamos E2/E3 con backoff. Funciona,
pero cambia lo que el producto puede prometer ("tu acceso se activa en pocos minutos"
en lugar de "al instante") y deja un costo de soporte permanente. **Preferimos webhook;
aceptamos polling; necesitamos al menos uno de los dos con certeza.**

### 2.5 Conciliación — cómo sabemos que ESE pago corresponde a ESA suscripción

Éste es el punto técnico que decide si el alta es automática o no.

**El mecanismo que pedimos: una referencia externa nuestra, que viaje de ida y vuelta.**

```
Onia crea el cobro  →  envía  externalRef = "onia_sub_<idSuscripción>_<período>"
BCP genera el QR    →  el QR queda atado a esa referencia
El cliente paga     →  desde la app de cualquier banco
BCP nos avisa       →  la notificación DEVUELVE la misma externalRef
Onia concilia       →  referencia → suscripción → activa el plan
```

**Necesitamos que nos confirmen del campo:** nombre exacto · **largo máximo** ·
juego de caracteres permitido (¿acepta guiones bajos?, ¿solo numérico?) · si debe ser
**único por cobro** o puede repetirse · y si vuelve **sin alterar** en la notificación
y en la consulta.

**Por qué no sirve conciliar por monto:** dos clínicas que pagan Bs 750 el mismo día
son indistinguibles. Hoy lo resolvemos pidiéndole al usuario que tipee el número de
transacción a mano — que es exactamente lo que queremos eliminar.

**Si el campo de referencia no existe**, necesitamos saberlo explícitamente: el plan de
contingencia (identificar por monto + hora, o generar montos únicos con centavos) es
frágil y nos obliga a mantener la confirmación manual.

**De nuestro lado, la conciliación es idempotente por diseño:** guardamos el evento con
restricción de unicidad sobre `(proveedor, idEvento)`, de modo que una notificación
repetida **no puede** procesarse dos veces aunque llegue en paralelo. Pueden reintentar
sin miedo a doble acreditación.

---

## 3. Qué preguntamos — lista para la reunión

Prioridades: **P0** = sin esta respuesta no podemos ni estimar · **P1** = define costo
y plazo · **P2** = se puede responder por correo después.

### 3.1 Modelo y habilitación — P0

| # | Pregunta | Por qué importa |
|---|---|---|
| **1** | Para cobrar **nuestra propia** suscripción, ¿nos consideran simplemente un **aceptante** (un comercio más), o entra alguna figura de pasarela? | Si es aceptante, el camino es corto. Si asumen "plataforma = agregador", se activan obligaciones que no nos corresponden y el trámite se alarga meses |
| **2** | ¿Onia puede recibir **todas** las suscripciones en **una sola cuenta propia**? | Define si el producto puede ser self-service o si hay un trámite bancario por cliente antes de que pueda pagarnos |
| **3** | Para el plano B (que nuestros clientes cobren a **sus** clientes desde nuestro software): ¿qué figura corresponde — facilitador, agregador, o cada cliente con su propio contrato? | Define si el add-on de cobro se puede vender con **una** integración o si cada cliente firma su propio convenio |
| **4** | ¿Nos alcanza el régimen de **Empresa de Tecnología Financiera (ETF)** (DS 5384 / Resolución ASFI 540/2025) si solo cobramos nuestras propias suscripciones? ¿Y si además integramos el cobro de nuestros clientes? | Hasta 2024 las pasarelas no tenían licencia propia. Si nuestro modelo cayera en la categoría "Pagos", habría un requisito de licencia que hoy no tenemos |
| **5** | ¿Hay algún límite o condición por ser Onia una **empresa unipersonal**? ¿Quién debe firmar el contrato de cobros electrónicos? | Ver §4.4 — la titular no es quien lleva la parte técnica |
| **6** | 🔴 **¿BCP exige acreditar un Sistema Informático de Facturación autorizado por el SIN antes de habilitar el cobro electrónico** (art. 27.I del reglamento del BCB)? ¿Cómo se acredita y en qué momento del trámite? | **Puede convertir la homologación SIAT en prerrequisito del cobro, no en trámite paralelo.** Cambia el orden de todo el trabajo posterior. Nuestro estado: sistema **registrado ante el SIN** (tipo Proveedor, código `228474DC226A215DD26BF`, solicitud 9473) con **Fase 1 de homologación completa** — 1.968 operaciones enviadas, cero bloqueadas |
| **7** | ¿Qué requisitos debe cumplir **la cuenta empresa** para habilitar cobros QR por API (tipo de cuenta, documentos, costo)? ¿Abrirla es requisito previo o va en paralelo? | Define si el trámite arranca hoy o después |

### 3.2 Confirmación del pago — P0 (la que decide el producto)

| # | Pregunta | Por qué importa |
|---|---|---|
| **8** | Cuando un pago se acredita, ¿BCP **notifica automáticamente** a una URL nuestra (webhook/push), o la única forma de enterarse es **consultando** (polling)? | **Con webhook el alta es automática. Sin webhook, no lo es** — el cliente paga y espera, o alguien confirma a mano. Se ve en el producto, en el costo de soporte y en lo que podemos prometer en la web |
| **9** | ¿Cómo se **firma** la notificación? (HMAC, firma asimétrica, mTLS, token compartido) | Sin firma verificable, cualquiera que conozca la URL puede activar cuentas gratis. Es un agujero de dinero |
| **10** | ¿Cuál es la **latencia** típica entre el pago y la notificación? | Define si la web dice "entrás al instante" o "en unos minutos" |
| **11** | ¿Hay **reintentos** si nuestro servidor no responde? ¿Cuántos, con qué espera, hasta cuándo? | Sin reintentos, un minuto de caída nuestra = un cliente que pagó y no entró |
| **12** | ¿La misma notificación puede llegar **más de una vez**? ¿Trae un **id de evento** estable? | Es el insumo de la deduplicación (§2.5) |
| **13** | ¿Qué **código de respuesta** espera BCP para darla por entregada? ¿Hay timeout? | Define si procesamos en background o hay que responder sincrónico |
| **14** | ¿Se notifican también los **fallidos, vencidos y reversados**, o solo los aprobados? | Sin evento de vencimiento, los cobros pendientes quedan colgados |
| **15** | ¿Se puede configurar **más de una URL** (producción y pruebas), y cambiarla sin trámite presencial? | Si cambiar la URL es un trámite, cada despliegue es un problema |
| **16** | *(si no hay webhook)* ¿Cuál es la **frecuencia máxima de consulta** permitida? ¿Hay límite de llamadas? | Define cuánto tarda el alta y si el rate limit nos deja consultar seguido |
| **17** | *(si no hay webhook)* ¿La consulta es **por cobro individual** o hay **listado de movimientos por rango de fechas**? | Un listado permite conciliar en lote; consulta individual no escala |
| **18** | ¿Hay **otro canal** de aviso — correo, archivo, SFTP, extracto automatizado? ¿Formato y costo? | A veces el "webhook" existe con otro nombre y otro equipo |

### 3.3 Identificación del pago — P0

| # | Pregunta | Por qué importa |
|---|---|---|
| **19** | ¿Podemos enviar **un identificador propio** al generar el cobro y que **vuelva tal cual** en la notificación y en la consulta? Nombre del campo, largo máximo, caracteres permitidos, unicidad | **Sin esto no se sabe quién pagó** (§2.5). Es la pregunta técnica más importante de la reunión |
| **20** | ¿La notificación trae **datos del pagador** (nombre, documento, banco de origen)? ¿Qué podemos **almacenar** y por cuánto tiempo? | Sirve para conciliar y facturar, pero son datos personales: queremos guardar lo mínimo y con la retención correcta |
| **21** | ¿El QR generado tiene **vencimiento configurable**? ¿Y monto fijo no alterable por el pagador? | Si vence en minutos hay que regenerarlo en pantalla; si no vence nunca, se puede pagar dos veces |

### 3.4 Producto y comisiones — P1

| # | Pregunta | Por qué importa |
|---|---|---|
| **22** | ¿Cuál es la diferencia entre **"APIs Pagos QR Simple"** (Generación QR · Consulta Pagos QR · Pagos QR) y **"Recaudaciones QR"** de Banca Empresas? ¿Cuál corresponde a nuestro caso? | Son dos productos distintos en su portal y no sabemos cuál aplica |
| **23** | 🔴 **"QR Simple" con comisión 0: el portal de BCP publica que cobrar por QR "no tiene ninguna comisión adicional" — pero eso corresponde al QR de cuenta de ahorros. ¿Aplica lo mismo a la integración por API para empresas? Pedimos la respuesta por escrito.** | **No lo damos por cierto ni lo prometemos.** Ninguna norma establece comisión cero: es política comercial del banco (el art. 8.I del reglamento permite al BCB fijar topes, no gratuidad). Sobre una suscripción de Bs 320/mes, cada punto porcentual pesa. Y el tarifario público de empresas cobra **por operación** (Bs 4,00 recaudación; Bs 2,00 débito automático), lo que sobre Bs 320 es 1,25% y sobre Bs 2.900 es 0,14% — **el costo fijo castiga al plan barato**. Necesitamos el número real antes de fijar precios |
| **24** | ¿Hay **costo de habilitación, mensualidad o mínimo** por usar la API? | El tarifario público no tiene línea de QR ni de API |
| **25** | ¿Podemos trasladar la comisión al pagador como **recargo por pagar con QR**? | Entendemos que **no**: el art. 36 d) y e) prohíbe al aceptante establecer recargos por pago con instrumento electrónico y montos mínimos de compra. Preguntamos para confirmarlo — si es así, **la comisión la absorbemos en el precio del plan**, y nunca aparece como línea extra en el checkout |
| **26** | ¿Existe **botón de pago / enlace de pago** además del QR? | Un enlace es más simple de integrar y funciona bien por WhatsApp, que es nuestro canal de venta |
| **27** | Si en el futuro quisiéramos **tarjeta** (Visa/Mastercard): ¿BCP lo provee o hay que ir a un procesador aparte? ¿Con qué comisión? **¿Y la captura del dato de la tarjeta ocurre del lado del banco?** | Define si podemos vender fuera de Bolivia — y, sobre todo, si entramos o no en alcance PCI-DSS. Ver §5.4 |

### 3.5 Recurrencia — P1

| # | Pregunta | Por qué importa |
|---|---|---|
| **28** | ¿Existe **débito automático mensual** accesible **por API**, o hay que generar un cobro nuevo cada mes? | Nuestro negocio es una suscripción mensual. Con débito automático la renovación es invisible y la retención sube. Sin él, cada mes hay que generar QR, avisar y esperar: eso es cobranza recurrente permanente, un costo operativo real |
| **29** | Si existe: ¿el cliente autoriza **una sola vez**? ¿Cómo se **revoca**? ¿Qué pasa si no hay fondos — hay reintentos? ¿Nos notifican el fallo? | El art. 7 e) del reglamento exige consentimiento expreso **renovable o revocable en todo momento**. Consecuencia de diseño de nuestro lado: cancelar la suscripción tiene que ser fácil y no puede depender de nuestra aprobación |
| **30** | Si **no** tienen cobro recurrente por API, ¿nos lo confirman explícitamente? | Necesitamos saberlo para evaluar alternativas del mercado local. Es información igual de útil que un sí |

### 3.6 Ambientes, credenciales y plazos — P1

| # | Pregunta | Por qué importa |
|---|---|---|
| **31** | **¿Hay ambiente sandbox / de pruebas**, con credenciales propias y datos ficticios? | Sin sandbox, la primera prueba se hace con dinero real. Su portal público no menciona sandbox en ninguna parte |
| **32** | ¿Qué se necesita exactamente para habilitarse: NIT, cuenta empresa, matrícula SEPREC, contrato, Credinet Web? | Define si el trámite arranca el mismo día |
| **33** | **¿Cuántos días reales pasan desde que se firma hasta tener credenciales de producción?** | Es el dato de planificación más importante de la reunión. Pedimos el plazo real, no el de folleto |
| **34** | ¿Qué **forma** tienen las credenciales — usuario/contraseña, API key, OAuth, certificado? | Si hay certificado, hay que resolver dónde vive y cómo se rota |
| **35** | ¿Sandbox y producción tienen credenciales distintas? ¿Se pueden tener **las dos activas**? | Define si podemos seguir probando después de salir a producción |
| **36** | **¿Quién es nuestro contacto técnico** después de esta reunión? ¿Hay canal de soporte para desarrolladores y SLA? | Salir con un nombre y un correo vale más que casi cualquier otra respuesta |

### 3.7 Documentación — P1

| # | Pregunta |
|---|---|
| **37** | ¿Nos entregan la **especificación de la API** (OpenAPI/Swagger o PDF)? ¿Para cuándo? |
| **38** | ¿Hay **colección de Postman** o ejemplos de request/response? |
| **39** | ¿Hay **certificados** que instalar, y cómo se renuevan? |
| **40** | ¿Existe **versionado** de la API y política de cambios/deprecación? ¿Cómo nos avisan? |
| **41** | ¿Hay proceso de **certificación** de la integración antes de producción? ¿Cuánto tarda? |

### 3.8 Liquidación, devoluciones y cumplimiento — P1

| # | Pregunta | Por qué importa |
|---|---|---|
| **42** | ¿En cuánto tiempo el dinero está **disponible** en la cuenta — T+0, T+1, T+n? | Es flujo de caja directo |
| **43** | ¿Hay **retenciones**, garantías o reservas sobre lo recaudado? | Una reserva es capital inmovilizado |
| **44** | ¿Hay **montos mínimo y máximo** por transacción, y topes diarios/mensuales? | Un tope bajo frena el crecimiento sin aviso |
| **45** | **¿Cómo se hace una devolución?** ¿Por API o solo por mostrador? ¿Plazo? ¿Costo? | Cobro duplicado o baja anticipada. Ofrecemos garantía de devolución el primer mes: sin devolución por API, cada caso es trabajo manual |
| **46** | ¿Qué pasa ante un **contracargo o reclamo**? ¿Qué evidencia nos piden y por cuánto tiempo hay que conservarla? | Define qué guardamos y con qué retención |
| **47** | El banco emite comprobante del cobro, pero **la factura fiscal la emitimos nosotros**, ¿correcto? | Cobrar y facturar son cosas distintas; queremos que quede explícito |
| **48** | ¿Hay obligación de reporte o conservación de información por normativa que debamos diseñar desde el principio? | Puede imponer retención que hay que resolver antes de escribir código |

### 3.9 Seguridad — P2 (se puede responder por correo)

| # | Pregunta |
|---|---|
| **49** | ¿Hay **allowlist de IPs** — las nuestras hacia el banco, y las del banco hacia nuestro webhook? ¿Publican sus rangos de origen? |
| **50** | ¿Se exige **mTLS** o basta TLS estándar? |
| **51** | ¿Cada cuánto **rotan llaves/certificados**? ¿Se puede rotar sin cortar servicio (dos llaves válidas en la ventana)? |
| **52** | ¿Hay requisitos de **auditoría, logs o retención** que el banco imponga? |
| **53** | ¿A quién se avisa ante un **incidente de seguridad**, y en qué plazo? |

---

## 4. Qué damos nosotros

### 4.1 Infraestructura y red

| Dato | Valor |
|---|---|
| **Dominio del producto** | `app.onia.com.bo` (sitio institucional: `onia.com.bo`) |
| **IP pública fija — entrada y salida** | **187.77.16.63** (servidor propio, IP estática). Es la misma para las llamadas que hacemos hacia el banco y para recibir las notificaciones del banco: sirve para allowlist en ambos sentidos |
| **URL de webhook propuesta** | `https://app.onia.com.bo/api/webhooks/platform/bcp` |
| **TLS** | HTTPS con certificado válido, TLS 1.2+. Podemos implementar **mTLS** si el banco lo exige (necesitamos saberlo antes: pregunta 50) |
| **Disponibilidad** | Servidor propio con monitoreo activo. Podemos comprometer un objetivo de disponibilidad para el endpoint de webhook si el banco lo requiere en contrato |

Si BCP prefiere que la URL siga otro patrón (por ejemplo un identificador de comercio
en la ruta), la ajustamos: solo necesitamos saberlo antes de registrarla.

### 4.2 Formato de callback que podemos recibir

Somos flexibles en el formato; lo que necesitamos son los **campos** de §2.4. Como
referencia, éste es el contrato que nuestro endpoint acepta de forma nativa — si el de
BCP difiere, escribimos el adaptador (es un archivo, no un rediseño):

```
POST https://app.onia.com.bo/api/webhooks/platform/bcp
Content-Type: application/json
X-Signature: <firma sobre el cuerpo crudo>
X-Timestamp: <epoch o ISO-8601>

{
  "eventId":     "<id único y estable del evento>",
  "eventType":   "charge.paid | charge.failed | charge.expired | charge.refunded",
  "chargeId":    "<id del cobro en BCP>",
  "externalRef": "onia_sub_<idSuscripción>_<período>",
  "amount":      1500.00,
  "currency":    "BOB",
  "occurredAt":  "2026-08-14T15:04:05-04:00",
  "payer":       { "name": "...", "bank": "...", "document": "..." }
}
```

**Garantías de nuestro lado:**

| Comportamiento | Detalle |
|---|---|
| **Respuesta** | `200 OK` en menos de 2 segundos. Validamos firma y persistimos el evento de forma sincrónica; el resto (activar el plan, avisar al cliente) va a cola |
| **Idempotencia** | Restricción de unicidad en base sobre `(proveedor, eventId)`. Una notificación repetida **no puede** procesarse dos veces, ni siquiera si llega en paralelo desde dos instancias. **Pueden reintentar sin riesgo** |
| **Reintentos** | Los aceptamos y los queremos. Si respondemos con error o no respondemos, reenvíen |
| **Orden** | No asumimos orden de llegada: cada evento trae su `occurredAt` y lo resolvemos por estado, no por secuencia |
| **Sin sesión** | La ruta de webhook no depende de sesión ni de cookies |
| **Verificación de firma** | HMAC-SHA256 sobre el **cuerpo crudo** (sin re-serializar), comparación en tiempo constante, y ventana anti-replay sobre el timestamp. Ya lo tenemos implementado y funcionando para otros proveedores; si BCP usa firma asimétrica o mTLS, lo adaptamos |

### 4.3 Estado del software (dicho sin adornos)

**Lo que ya está construido y funcionando:**
- Producto en producción en `app.onia.com.bo`, con clientes usándolo.
- Checkout de suscripción con QR y catálogo de precios único **validado en el
  servidor**: un monto que no coincide con el plan se rechaza.
- Capa de proveedor de pago con interfaz común (crear cobro / consultar / probar
  conexión) y dos proveedores ya escritos. **Enchufar BCP es agregar un adaptador, no
  rehacer el sistema.**
- Almacenamiento de credenciales cifrado en base (AES-256-GCM), con ambiente
  sandbox/producción y prueba de conexión.
- Endpoints de webhook con verificación de firma HMAC-SHA256 y procesamiento
  idempotente.
- **Registro del sistema ante el SIN** (SIAT) con Fase 1 de homologación completa.

**Lo que NO está, y por eso venimos:**
- El QR es hoy una **imagen estática** y la confirmación del pago es **manual**: el
  cliente sube una captura del comprobante y una persona la aprueba.
- **No estamos integrados con ningún banco todavía.**
- Hoy tenemos **0 clientes pagando por pasarela**. No prometemos volumen: prometemos
  que el circuito de nuestro lado está listo para cerrarse el día que haya
  credenciales y aviso de acreditación.

**Lo que le damos al banco:** volumen de cobros recurrentes en bolivianos, creciente,
de **empresas formales con NIT**. Y cada cliente nuestro es además candidato a integrar
**su propio** cobro por QR con BCP — ése es el volumen grande, y es negocio que le
traemos formalizado.

### 4.4 Datos legales y quién firma

| Dato | Valor |
|---|---|
| **Denominación (SEPREC)** | **OniaAgency** — matrícula de comercio 5371375010 |
| **Titular legal — quien firma** | ⚠️ **LESLIE MERCADO MORENO** (empresa unipersonal) |
| **NIT** | **5371375010** — Régimen General, ACTIVO, Gerencia Distrital Santa Cruz II |
| **Actividad registrada** | 4651200 venta de programas de informática (primaria) · 6209920 servicios en la nube · 6312000 portales web |
| **Contraparte técnica** | Sergio Mercado — lleva la integración, **no es el titular y no firma** |
| **Registro SIAT** | Sistema registrado, tipo Proveedor, código `228474DC226A215DD26BF`, solicitud 9473, Fase 1 de homologación completa |

**Punto a resolver con el banco:** el contrato de cobros electrónicos lo firma
**Leslie Mercado Moreno**, titular de la unipersonal. Necesitamos saber de antemano si
se exige su presencia física, si sirve un **poder notarial**, y qué alcance debe tener
(pregunta 5). Resolverlo antes evita perder un ciclo entero de trámite.

**Documentación que llevamos:** certificado de inscripción al padrón (NIT) · matrícula
SEPREC de OniaAgency · documento de identidad de la titular · PDF de la solicitud SIAT
9473.

---

## 5. Seguridad — qué datos tocamos y cuáles no

### 5.1 Datos que SÍ procesamos

| Dato | Origen | Tratamiento |
|---|---|---|
| Id del cobro y del evento | BCP | En base, sin cifrar (no es sensible) |
| Referencia externa nuestra | Generada por Onia | En base, con unicidad |
| Monto, moneda, fecha-hora, estado | BCP | En base |
| Nombre del pagador, banco de origen, documento | BCP (si lo envían) | **Mínimo necesario**, con retención definida. Preguntamos qué se puede almacenar y por cuánto tiempo (pregunta 20) |
| Cuerpo crudo de la notificación | BCP | **Cifrado en reposo.** Nunca se escribe en claro en logs |
| Credenciales de API | BCP | **Cifradas con AES-256-GCM** en base, con rotación. Nunca en código ni en repositorio |

### 5.2 Datos que NO tocamos — nunca

| Dato | Por qué no |
|---|---|
| **Número de tarjeta (PAN), CVV, fecha de vencimiento, PIN, datos de banda o chip** | **Regla dura, sin excepciones.** Ver §5.4 |
| **Credenciales de banca en línea** — de Onia, de nuestros clientes o de cualquiera | No hacemos scraping de banca por internet, y no lo vamos a hacer. Guardar credenciales bancarias de terceros es exactamente la categoría de dato que nunca debe tocarse; además es frágil (2FA, captchas) y contrario a los términos de banca por internet. Por eso pedimos API de movimientos (§2.3, E3) y no un atajo |
| **Fondos de terceros** | Modelo Facilitador (§1). El dinero de los clientes de nuestros clientes va directo a la cuenta de ellos |

### 5.3 Seguridad de la integración

- **Firma obligatoria en el webhook.** Sin firma verificable, cualquiera que descubra
  la URL puede activar suscripciones gratis. Si BCP no firma, necesitamos al menos un
  secreto compartido en cabecera **más** allowlist de IP de origen — y en ese caso
  confirmamos todo pago por consulta (E2) antes de activar nada.
- **Secreto de firma ≠ API key**, en campos separados, para poder rotar uno sin tocar
  el otro.
- **Anti-replay** por timestamp con ventana (5 minutos).
- **Allowlist de IP** del banco a nivel de proxy inverso, si publican sus rangos.
- **Rotación sin downtime**: aceptamos dos secretos válidos durante la ventana.
- **Sin payload crudo en logs en claro** — trae CI, nombre y monto.
- **Aislamiento de ambientes**: sandbox no escribe en la base de producción. Se
  verifica antes de la primera prueba, no después.

### 5.4 Tarjetas y alcance PCI-DSS — posición declarada

**Onia no captura, no transmite y no almacena datos de tarjeta.** Hoy el instrumento es
QR: la autenticación y la autorización ocurren **íntegramente dentro de la app bancaria
del pagador**. Nuestra página muestra el QR y espera la confirmación; no hay formulario
de tarjeta ni lo va a haber del lado nuestro.

**Si en el futuro entrara tarjeta, entra bajo una sola condición:** que la captura del
dato ocurra **del lado del banco o del proveedor** — redirect, o SDK/iframe que
**tokenice**. Guardamos el token, **nunca el PAN**. El número no toca nuestro servidor
ni nuestro navegador.

**Si la única forma disponible fuera capturar el número en nuestra propia página, no se
implementa.** Meter a Onia en alcance PCI-DSS — auditoría, certificación y
responsabilidad legal sobre datos de tarjeta — es un problema de otra magnitud, y no lo
asumimos por una funcionalidad que el QR ya resuelve. Por eso la pregunta 27 no es
académica: define si esa vía existe o queda descartada.

### 5.5 Restricción de interfaz que ya respetamos

Por el art. 36 d) y e) del reglamento del BCB, en nuestro checkout **no hay recargo por
pagar con QR ni monto mínimo de compra**. Si la integración tiene comisión, se absorbe
en el precio del plan; nunca aparece como línea extra frente al pagador.

---

## 6. Qué necesitamos llevarnos de la reunión

Tres cosas concretas. Con esto podemos empezar a integrar; sin esto, no:

1. **El nombre y el correo de un contacto técnico** de BCP.
2. **Una fecha comprometida para la documentación de la API.**
3. **El plazo real** — en días — desde la firma hasta tener credenciales de producción.

Y, de las preguntas, las cuatro que cambian **qué construimos** (no solo cómo):
**8** (¿webhook?) · **19** (¿referencia propia?) · **2** (¿una cuenta propia?) ·
**31** (¿sandbox?).

Si alguna pregunta no se puede responder en la reunión, nos sirve igual saber **a quién
se traslada y para cuándo**.

---

*Documento preparado por el equipo técnico de Onia. Las citas normativas
(RD BCB 079/2022, DS 5384, Resolución ASFI 540/2025) se incluyen para precisar el
vocabulario de las preguntas, no como interpretación regulatoria ni asesoramiento
legal.*
