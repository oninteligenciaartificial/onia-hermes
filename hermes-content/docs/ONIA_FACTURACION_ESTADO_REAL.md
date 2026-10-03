# Onia — Facturación SIAT: decisión, estado real y plan

**Responde las tres preguntas de Sergio Urcullo (3-oct-2026):** ¿nos conviene hacer las facturas
SIAT?, ¿cómo lo hacemos legalmente? y ¿cómo hacemos para que los clientes facturen con nuestro
sistema?

**Fuente única del tema facturación.** No tiene fecha en el nombre a propósito: se EDITA, no se
duplica. El marcador del trámite, etapa por etapa, sigue en `ONIA_SIAT_ESTADO_HOMOLOGACION.md`; el
diseño del emisor, en `hermes-content/integrations/siat/README.md`.

**Medido el 3-oct-2026** contra el texto de las normas del SIN, `onia-platform` `origin/master`
`13b67dda` y el VPS (solo lectura: bitácora del runner, `/health` del emisor y nombres de variables, sin
valores). El portal del SIAT no se abrió: lo abre solo Sergio Urcullo.

**Pasada crítica del 3-oct** contra las fuentes primarias: lo que cambió está marcado «corregido por el
crítico» o «agregado por el crítico». Lo más grave: la **RND 102600000038 (30-sep)** dejó sin efecto la
obligación del 1-oct de los grupos 9-12, y la **RND 102600000034** con la nota de prensa del SIN pone en
duda que convenga autorizar el 9473 con el formato de 2021 (§2.6).

> No es asesoría contable definitiva. La actividad económica y las obligaciones del padrón las
> confirma un contador matriculado (skill `onia-contabilidad-bolivia`).

> **Antes (18-ago) este archivo era la auditoría del producto** («¿el sistema ya factura?»). Lo que
> encontró se corrigió en gran parte (§4.3) y el texto viejo quedó en el historial de git de este
> archivo, antes del 3-oct.

---

## 1. Decisión recomendada

| Pregunta | Respuesta |
|---|---|
| ¿Onia tiene que facturar lo que cobra? | **Sí, no es opcional.** Cada cobro de suscripción se factura el día en que el dinero se acredita (§2.2). |
| ¿Con qué factura Onia HOY? | **A mano, en el Portal Web en Línea del SIN.** Es gratis, no pide firma digital ni certificación y el NIT ya lo tiene habilitado. Cumple desde el primer cliente lo que prometen el checkout y los Términos: «Te emitimos factura por cada pago». |
| ¿Y después? | Cuando el SIN autorice el sistema 9473, la factura de Onia sale sola al aprobar el pago, en **computarizada** (no pide certificado). |
| ¿Nos conviene que los CLIENTES facturen con Onia? | **Sí, como proveedor autorizado** (un solo trámite que sirve para todos los clientes). Cada cliente se asocia con su NIT, en computarizada en línea. |
| ¿El trámite se sostiene? | **Sí, con dos pasos ya:** el CAFC del piloto para cerrar la Fase 1 y la **prórroga de 60 días**, porque el plazo del 04-nov incluye la inspección y la plataforma todavía no está lista para ella. **Y una llamada al SIN antes de invertir en el bloque C** *(corregido por el crítico)*: el SIN anunció que todos los sistemas propios y de proveedor hacen pruebas y autorización con el formato nuevo (IVA separado) entre el 1-oct y el 16-nov (§2.6). |

**Por qué conviene ser proveedor:**
- La competencia ya pone la factura dentro del sistema y cobra Bs 85-280/mes por ella (§3.5).
- Sin factura dentro del sistema, comercio y servicios no compiten. Así lo fija el orden de empuje
  (CLAUDE.md, «ONIA Core»).
- La Fase 1 de pruebas va al **96 %** (conteo local del 2-oct). Si el trámite se deja vencer, se
  cancela solo y vuelve a cero, con otro código de sistema.
- El desarrollo lo hacen las sesiones, no Sergio Urcullo. Lo que se le pide a él ahora es **~1 hora**
  (§6).

**Lo que cuesta:**
- ~15 minutos de Sergio Urcullo por cada cliente nuevo: la asociación se registra en el portal y la
  hace el proveedor (§3.3). Sale una vez por cliente, no todos los meses.
- Obligaciones de proveedor: garantizar la continuidad del servicio, avisar al SIN cualquier cambio
  en 15 días, y el riesgo de que inhabiliten el sistema (§3.4).
- Unas **185-265 horas de desarrollo** en total, sumando A3 y los bloques B a E de §5 *(corregido por
  el crítico: suma B7)*. Si hay que pasar al anexo de la Ley 1733, C se rehace sobre él (§2.6).

**Cómo encaja con la etapa vigente** (Etapa 1: dental, hasta 5 clientes): para la clínica, la
factura no es el dolor de entrada (`ONIA_CLIENTE_IDEAL.md`). Por eso el SIAT **no se nombra en la
venta** hasta que la primera factura real esté validada y se haya mirado (catálogo §7). Se sigue
igual porque el trámite tiene reloj, y porque Sergio Urcullo decidió el 1-oct: **«se termina el
SIAT»**.

**Decisión abierta (es de Sergio Urcullo):** si la factura del SIN va incluida en los planes o
como add-on. La recomendación es **incluida**: el mercado la regala dentro del sistema y para Onia
cuesta casi nada por factura. El precio, si lo hubiera, vive en `onia-platform/lib/pricing.ts`.

---

## 2. Onia como contribuyente

### 2.1 Datos fiscales

| Dato | Valor |
|---|---|
| NIT | `5371375010`, Régimen General (IVA, IT, IUE) |
| Titular | **Leslie Mercado Moreno**, unipersonal «OniaAgency». Sergio Urcullo no es titular: los actos fiscales (declaraciones juradas, tokens de producción, certificado) los firma ella |
| Dependencia | Gerencia Distrital Santa Cruz II |
| Vencimiento mensual | día **13** (NIT termina en 0): F-200 IVA, F-400 IT y F-608, que figura recurrente |
| Portal Web en Línea | **HABILITADO** (Oficina Virtual vista el 27-ago, homologación §3): Compra Venta, Nota Crédito/Débito, Ventas del Día |
| Cuenta del QR | a nombre de la titular (coincide con el NIT) |
| Grupo obligado a facturar en línea | **ninguno encontrado**: el NIT no figura en los anexos de los grupos 2-4, 6 y 8-12 (búsqueda de texto en los PDF oficiales, 3-oct). Grupos 1, 5 y 7: sin revisar completos. *(Corregido por el crítico:)* los grupos 9-12 ya no existen como obligación: la RND 102600000038 (30-sep-2026) abrogó esas cuatro designaciones (§2.6) |

### 2.2 La obligación

- Onia presta servicios → es sujeto del IVA (Ley 843, Art. 3 d).
- En una suscripción, la obligación nace **al cobrar**, si se cobra antes de prestar el servicio
  (Ley 843 Art. 4 b; DS 21530 Art. 4, con los párrafos del DS 4541: «servicios continuos con
  precios preestablecidos… **debiéndose emitir la factura correspondiente**»).
- La factura es obligatoria en todo cobro de Bs 5 o más (RND 102100000011, Art. 25.I y VI). Ningún
  plan está por debajo de ese monto. La prueba gratis no se factura porque no hay cobro.
- **Se factura cuando el dinero ya está acreditado**, no cuando llega la captura del comprobante.
- No facturar se sanciona con clausura de 6 a 48 días; la primera vez va con el mínimo, 6 días (Ley
  2492, Art. 164.I-II). Esa primera vez, la clausura se puede convertir en una multa de 10 veces lo no
  facturado (Art. 170, último párrafo; no es el 164). *Corregido por el crítico: leído el 3-oct en la
  compilación del SIN al 31-07-2026 (§8).*
- *(Agregado por el crítico.)* La obligación no se puede pasar a otro mes: «en ningún caso procederá el
  traslado de la obligación de emitir la Factura… a periodos posteriores» (RND 102100000011, Art. 25.XIV).
  Un cobro acreditado el 31 se factura el 31.

### 2.3 Impuestos de cada cobro

- **IVA 13 %**, incluido en el precio y no discriminado en la factura (Ley 843 Arts. 5 y 15). **IT 3 %**
  sobre lo cobrado (Arts. 74-75). Juntos: **16 % de cada cobro**, antes de restar el crédito fiscal de
  las compras facturadas a nombre de Onia. Ejemplo: por un cobro de Bs 1.000 van Bs 130 de IVA y
  Bs 30 de IT. El IUE pagado se descuenta del IT de los meses siguientes (Art. 77).
- No hay exención ni tasa cero para software (Art. 14).
- **Cobrar con QR no cambia la factura.** La bancarización obligatoria recién empieza en Bs 50.000
  por operación (DS 27310 Art. 37, modificado por el DS 0772).
- **Ley 1733 (27-may-2026), «IVA transparente»** *(corregido por el crítico, leído en el texto de la
  ley publicado por el SIN)*: la ley ya rige (condonación, Código Tributario, Ley 060). Lo que todavía
  no rige es su **Disposición Adicional Segunda**, la que reescribe el Art. 5 de la Ley 843: el IVA pasa
  a ser 13 % **sobre el precio neto** y se muestra **separado** en la factura. Entra el primer día del
  mes siguiente a la publicación de su decreto reglamentario (Disposición Final Única). La RND
  102600000038 (30-sep) todavía la trata como futura, y un buscador no encontró el decreto; **que no se
  haya publicado no se verificó en la Gaceta**. Hasta la RND que implemente el cambio, la RND
  102100000011 sigue plenamente vigente (RND 102600000034, disposición adicional única).
  - *Inferencia, para Sergio Urcullo y el contador:* si los precios siguen siendo «finales, impuestos
    incluidos» (Términos §3.1), con el cambio un cobro de Bs 1.000 lleva Bs 115 de IVA y no Bs 130
    (1.000 ÷ 1,13 de neto). Es una decisión de precio, no se toca sola.

### 2.4 Las opciones para facturar las ventas de Onia

| | **Portal Web en Línea** (recomendado hoy) | Sistema propio 9473, computarizada | Sistema propio 9473, electrónica |
|---|---|---|---|
| Base | RND 11 Art. 9: habilitado para todo contribuyente de IVA que se suscriba | RND 11 Art. 17 b: el sistema del proveedor «podrá ser utilizado por el proveedor para emisión de sus Documentos Fiscales» | Igual, más el Art. 21 a: hace falta firma digital vigente |
| Firma digital | No | No | Sí (certificado de AGETIC a nombre de Leslie) |
| Costo | Bs 0 | Bs 0 al SIN (no encontré ningún arancel) | más el certificado (Bs 70 por año según el repo y el extracto del buscador de la página de tarifas de firmadigital.bo; la página no abrió: no verificado) |
| ¿Sirve hoy? | **Sí** | **No.** Está en pruebas, y la norma prohíbe facturar ventas reales en el piloto (Art. 20 a) | No |
| Trabajo | 3-5 min por factura a mano (estimado, no medido). Los planes semanales generan ~4 facturas por cliente al mes | Automático al aprobar el pago | Igual |

**Cuándo se pasa al sistema propio:** con la autorización en mano y la «Solicitud de Inicio de
Facturación» (Art. 20 e). Que la norma lo permite está verificado. **Cómo se hace en el portal** (si
Onia se asocia a su propio sistema) no está confirmado: es una de las preguntas al SIN (§7).

### 2.5 El día del cobro (procedimiento hasta tener el sistema propio)

1. Confirmar que el dinero **está acreditado** en la cuenta del QR. La captura sola no alcanza.
2. Aprobar el pago en `/admin/payments` (con eso se activa el plan).
3. Ese mismo día, en el Portal Web en Línea (`pweb.impuestos.gob.bo`): «Emisión Factura Compra
   Venta» → sucursal 0 → la actividad que confirme el contador → NIT/CI y razón social del cliente →
   descripción «Suscripción Onia — plan X, ciclo, del dd/mm al dd/mm» → cantidad 1 → precio = lo
   cobrado. Mandar el PDF y el XML al correo del cliente desde el mismo portal (Art. 26.II).
4. Anotar el número de factura y el CUF (el código único que el SIN le da a cada factura) en las
   notas del pago (`adminNotes`), y registrar el ingreso.

**Cada mes:**
- F-200 y F-400 hasta el día 13.
- Las ventas del Portal Web **no** se cargan al Registro de Compras y Ventas (Art. 45.IV). Las
  **compras** sí: se confirman hasta el día 9 para usar el crédito fiscal (Art. 46).
- Una factura mal hecha se anula hasta el día 9 del mes siguiente (Art. 38.II). *(Corregido por el
  crítico:)* pasado el día 9 ya no se anula sola: se pide en plataforma de la Gerencia Distrital, o por
  nota si el mes ya se declaró, y el SIN tiene hasta 6 meses para responder (RND 102600000025, 13-jul-2026,
  que agregó esos párrafos al Art. 38.II).

**Quién emite:** usar las credenciales es responsabilidad de la titular (Art. 9). Si opera Sergio
Urcullo, que Leslie lo autorice.

**Lo que faltaba en este procedimiento** *(agregado por el crítico)*:
- **Antes del 30-oct-2026:** el servicio «Suscripción Onia» tiene que estar homologado con una actividad
  económica **del clasificador nuevo del RNC** (RND 102500000018, plazo prorrogado al 30-oct-2026 por la
  RND 102600000028). La RND lo ata al Art. 11.I.a: sin eso, el SIN puede trabar la autorización para
  generar facturas. Los códigos de A2 (4651200, 6209920) salen de una plantilla interna anterior al
  clasificador de mayo-2025: confirmar en el portal que sigan existiendo. Entra en el ensayo A1.
- **Las declaraciones de Onia al día, aunque sean en cero.** Para la autorización del sistema y su
  inicio de uso, el SIN mira la presentación regular de las declaraciones de los **últimos 3 periodos** y
  que no haya marcas de control (Art. 11.I.b y d, Art. 11.II.b, Art. 19.I.d). Incluye el F-608 mientras
  figure como recurrente (§6).
- **Exhibir el «Exhibición NIT – EMITE FACTURA»** en el domicilio fiscal, que es la casa matriz (Art.
  66.I). No hacerlo es incumplimiento de deberes formales (Art. 67).
- **El pago de prueba de punta a punta** (catálogo §6.1) es un cobro real si entra plata a la cuenta del
  QR: se factura igual. Si después se devuelve, la factura se anula hasta el día 9 del mes siguiente,
  porque la operación no se realizó (Art. 38.II).

### 2.6 Normas nuevas que se leyeron mal o que están en riesgo

- **RND 102600000007 (23-mar-2026) — ABROGADA en lo que importa** *(corregido por el crítico)*. Decía
  que desde el 01-oct-2026 los NIT de los grupos 9 a 12 emiten solo en su modalidad en línea asignada.
  **La RND 102600000038 (30-sep-2026, publicada el mismo día) abrogó las cuatro RND que designaban a esos
  grupos** (102400000004, 005, 012 y 025) y «deja sin efecto los plazos de incorporación» de los grupos
  9-12; según su considerando, para que la Ley 1733 (IVA sobre el neto y separado) se aplique de forma
  «automatizada, uniforme y verificable». Su Par. II: el SIN **asignará
  periódicamente** una modalidad en línea a quien a esa fecha todavía no haya implementado ninguna.
  - Para Onia no cambia nada: ya tiene el Portal Web, que es una modalidad en línea.
  - **Cambia la web:** `onia.com.bo/facturacion` y `/guia-facturacion` siguen diciendo, hoy en
    producción, que desde el 1-oct los grupos 9-12 emiten solo en línea. Ya no es así (§9).
  - La skill `onia-contabilidad-bolivia` («obligatoria 30-sep-2026») queda doblemente mal (§9).
- **RND 102600000034 (01-sep-2026), el riesgo más grande del plan.** Su Art. 2: todos los
  contribuyentes **que cuenten con** sistemas propios o de proveedor «deberán cumplir con las
  especificaciones del Anexo Técnico Ley N° 1733 (En construcción) para el inicio de pruebas en ambiente
  piloto y posterior autorización, desde el 01 de octubre hasta el 16 de noviembre de 2026». *(Agregado
  por el crítico:)* la nota de prensa del SIN del 7-sep lo dice sin matices: «todos los contribuyentes con
  sistemas informáticos propios o de proveedores iniciarán las pruebas en ambiente piloto. Luego, el
  proceso de autorización comenzará el 1 de octubre y concluirá el 16 de noviembre de 2026». El anexo
  nuevo trae XSD, servicios SOAP, reglas de validación, emisión, anulación, **autorización** y
  **asociación** propias (está público en siatanexo, versión 0.0).
  - **Lectura literal (inferencia, se confirma con el SIN, pregunta 1):** alcanza también a los sistemas
    ya autorizados. O sea: aunque el 9473 se autorice con los XSD de 2021, el formato nuevo exige una
    versión nueva con pruebas (Art. 20 b), y el 96 % de la Fase 1 vieja puede no contar para el anexo nuevo.
  - **Qué cambia en el plan:** antes de meter horas en C, bajar el anexo nuevo y medir cuánto cambia (B7).
    Si el SIN confirma que hay que pasar por el anexo nuevo, el bloque C se construye directo sobre él.
  - El Portal Web no depende de esto.

---

## 3. Cómo factura el cliente con Onia

### 3.1 Los tres modelos

| | **1. Onia proveedor; cada cliente se asocia** (recomendado) | 2. Cada cliente certifica su sistema «propio» | 3. El cliente factura en el Portal Web del SIN |
|---|---|---|---|
| Base | RND 11 Arts. 17 b, 18, 20 b-e | Arts. 17 a, 19 II, 20 c: el sistema propio es «de uso exclusivo» y no se asocia a terceros | Art. 9 |
| Trámite | Uno solo (el 9473, ya en curso). Por cliente: asociación y pruebas piloto | El trámite entero por cliente (~5.700 pruebas, inspección, 90 días) | Ninguno |
| Escala | Sí | No | Sí, pero el cliente tipea todo dos veces |
| Responsabilidad de Onia | La de proveedor (§3.4) | La de mantener N sistemas | Ninguna sobre la emisión |

El modelo 3 queda como puente y como contingencia del modelo 1, que exige prever la continuidad del
servicio (Art. 20 b).

### 3.2 Computarizada, no electrónica

- **Tienen la misma validez legal** (Art. 53).
- La computarizada **no pide certificado por cliente**, y Onia no tiene que guardar llaves privadas
  ajenas. En la electrónica, el cliente tendría que «ceder su firma digital» (siatinfo, Asociación), y
  un certificado vencido corta la facturación ese día (Art. 21 a, Art. 52 V).
- **La electrónica, solo para el cliente que ya la tenga o al que el SIN se la asigne.** *(Corregido por
  el crítico:)* acá decía «RND 102600000007»; esas asignaciones de los grupos 9-12 quedaron abrogadas el
  30-sep, y ahora el SIN asigna modalidad «periódicamente» a quien no tenga ninguna (RND 102600000038,
  Par. II). Por eso el 9473 conserva las dos modalidades: la etapa VIII, la de firma, ya está 690/690.

### 3.3 Qué pasa con cada cliente (después de la autorización)

| # | Paso | Quién | Tiempo |
|---|---|---|---|
| 0 | Precalificar. NIT activo en Régimen General, **declaraciones y libro de compras y ventas al día en los últimos 3 periodos, sin marcas de control** (Art. 11). Si no cumple, el SIN no le da curso. Ver qué modalidad en línea tiene implementada; si no tiene ninguna, el SIN se la va a asignar (RND 102600000038) *(corregido por el crítico)* | el cliente mira; Onia pregunta | 10 min |
| 1 | **Asociación** en el portal: NIT del cliente, sistema, modalidad, tipo de servicio («Licencia»), sectores | **Sergio Urcullo, a mano** (solo él abre el portal) | ~15 min |
| 2 | Confirmar la asociación y generar el token delegado de **piloto** (la llave con la que Onia factura en su nombre) | el cliente | 10 min |
| 3 | Sucursal, punto de venta, catálogos y **homologación de sus productos** al catálogo del SIN | Onia (con la lista del cliente) | 30-60 min |
| 4 | **Pruebas piloto del cliente** (Art. 20 c). El SIN no las cuenta, pero sin ellas no se pasa al paso 5 | Onia, automático con el runner | 1-2 h de máquina |
| 5 | **Inicio de Operaciones**: una declaración jurada del cliente y de Onia. Después, el token de **producción**, que es distinto del de piloto | el cliente | 10 min |
| 6 | Primera factura **mirada**: estado 908 (validada) y QR consultado en la página del SIN | Onia | minutos |
| 7 | *(Agregado por el crítico)* **Portal Web como contingencia**: el cliente lo pide en la opción «Autorización de Portal Web como Contingencia». No viene solo: sin ese pedido, el respaldo del §3.4 no existe | el cliente | 5 min |

De punta a punta, 1 a 3 días por cliente. No encontré ninguna tasa del SIN por asociar ni por el
token. El runbook `integrations/siat/ONBOARDING_CLIENTE.md` dice que la asociación la hace el cliente,
y está mal (§9).

### 3.4 Qué responsabilidad legal asume Onia

- **El cliente sigue siendo quien responde por su impuesto** (Art. 25.I y Art. 20 d). Si el sistema se
  modifica o se usa mal, la responsabilidad es «exclusiva del Sujeto Pasivo». Igual, el SIN puede
  actuar contra el proveedor y/o el cliente (Art. 20 d). *(Corregido por el crítico: acá también se
  citaba el Art. 34 III, que es de la «Emisión por Terceros», no del modelo con licencia; es el mismo
  error que §9 le marca a `ONBOARDING_CLIENTE.md`.)*
- Onia tiene que **garantizar la continuidad del servicio** (Art. 20 b): contingencia automática, con
  el Portal Web como respaldo. *(Agregado por el crítico:)* ese respaldo lo autoriza el SIN a pedido de
  cada cliente (§3.3, paso 7). La otra vía, las facturas manuales de contingencia con CAFC, exige
  talonarios **pedidos e impresos en una imprenta autorizada** (siatinfo, «Facturas Manuales de
  Contingencia»): costo y trámite por cliente. Para un SaaS, el Portal Web es el respaldo barato.
- *(Agregado por el crítico)* **La autorización dura 3 años.** Antes de que venza se pide una nueva,
  con las pruebas que estén vigentes en ese momento (Art. 20 b).
- Tiene que **avisar al SIN cualquier cambio en 15 días**, y el SIN puede inhabilitar el sistema
  (Arts. 23-24). **Un cambio al sistema ya autorizado obliga a repetir las pruebas** (Art. 20 b).
- **Tipo de servicio que se declara: «Licencia».** Es para el sistema cedido mediante un acuerdo que
  tenga un documento de respaldo (siatinfo, Asociación). Los otros dos no convienen:
  - «Facturación por terceros» convierte a Onia en Tercero Emisor, que responde por la no emisión
    (Art. 34 III). *(Agregado por el crítico:)* y además, el emisor que presta facturación por terceros
    tiene que facturar **sus propias ventas solo en electrónica** (Art. 34 II, último párrafo): Onia
    necesitaría certificado de firma para sus facturas, y se cae el «computarizada, sin certificado» de §1.
  - «Prestación de servicio» obliga al cliente a ceder su firma y un usuario de la Oficina Virtual.

  Que «Licencia» es el tipo correcto para un SaaS es **inferencia: se confirma con el SIN** (§7). Ojo
  *(crítico)*: el ejemplo que da siatinfo de «Facturación por terceros» es un colegio que le cede su token
  delegado al proveedor, y en el SaaS el cliente también le cede el token a Onia. El SIN podría leerlo así.
- **Hace falta una cláusula de licencia y facturación en los Términos.** Es el documento de respaldo
  que pide «Licencia». Como es texto legal, pasa por Sergio Urcullo antes de publicarse. *(Agregado por
  el crítico:)* los Términos vigentes (v1.3, §1.2) dicen hoy lo contrario: «toda… emisión ante el SIN la
  hacés vos… con tus propias credenciales, de cuyo uso y custodia sos el único responsable». En el
  modelo 1, Onia guarda el token delegado del cliente: ese párrafo se reescribe en la misma cláusula (E5).
- El token delegado de cada cliente es su identidad fiscal: se guarda cifrado, por organización y
  fuera de git.

### 3.5 Qué cobra la competencia por la factura

Relevado el 29 y el 30 de agosto (`ONIA_PRECIOS_COMPETENCIA_Y_DECISION.md`; no re-verificado hoy):
- Portal Web y sistema de escritorio del SIN: **Bs 0**.
- Por mes: Sintic Cloud Bs 85 · Growing Cloud Bs 100 (Bs 200 con firma) · tuGerente ≈Bs 171 ·
  CODEX Bs 167-208 · Sintic MonoBusiness Bs 200 · Xmart Bs 236 · Nitro Bs 150 + 120 de factura ·
  CUCU API Bs 280 + Bs 0,98 por factura · Emizor ≈Bs 580.

Casi todos la ponen **dentro** del sistema de gestión.

---

## 4. Estado técnico hoy (medido el 3-oct)

### 4.1 El trámite (solicitud 9473, «Onia Platform v1.00», PROVEEDOR)

- **Fase 1, conteo local del 2-oct: 5.552/5.732 (96 %)**, con 0 rechazos. IX ya está en 160/160 y VI
  en 380/560. **Falta solo VI, motivos 5-7: 180 casos**, que necesitan el **CAFC del piloto**. El CAFC
  es el código que da el SIN para las facturas manuales que se hacen cuando el sistema cae. No está
  cargado: `SIAT_PILOT_CAFC` no existe en `siat-piloto.env`.
- **El portal todavía no lo confirma.** La última captura (01-oct) daba VI 152/560, IX 60/160 y 80 %
  general. Falta una captura nueva del «Listado de Etapas».
- **Plazo: 04-nov-2026** (quedan 32 días), **con la inspección incluida** (Art. 18.III). Hay una sola
  prórroga de 60 días, hasta el ~03-ene-2027. Si vence, se cancela solo. *(Verificado por el crítico:)*
  los 90 días son corridos, no hábiles (Ley 2492, Art. 4.2: los plazos de más de 10 días se cuentan
  corridos), y coincide con lo que mostró el portal el 27-sep (37 días restantes). **El ~03-ene-2027
  supone que los 60 días se suman al 04-nov; si el SIN los cuenta desde el día del pedido, pedirla
  temprano acorta el plazo** (no verificado: pregunta 7 de §7).

### 4.2 El producto

- **El emisor HTTP corre en el VPS desde el 13-sep, en piloto** (`/health` responde ok), pero **nunca
  emitió** y escucha solo en `127.0.0.1:8517`: la plataforma no llega a él.
- **En producción la emisión está apagada:** el contenedor no tiene `SIAT_EMISSION`,
  `SIAT_SERVICE_URL` ni `SIAT_SERVICE_TOKEN`. Sin URL, `lib/fiscal/siat-client.ts` simula.
- Lo que la inspección miraría y hoy está mal:
  - El ambiente está fijo en «piloto» (`lib/fiscal/emission-service.ts:157`).
  - La factura impresa mostraría un número que el SIN no conoce.
  - Se emite al pasar la factura a ENVIADA, antes de cobrar.
  - Todo sale como pagado en efectivo, con el receptor como CI y una sola leyenda fija.
  - La anulación y la nota de crédito no llegan al SIN, y nada reintenta las facturas en cola.
  - El correo no adjunta el XML.
- **Es de un solo contribuyente:** NIT, token, CUIS y actividad salen del env del emisor. El gancho de
  emisión existe **solo en la factura del pack dental**: la venta de caja de comercio, servicios e
  importadora no dispara nada.
- Los tests del emisor en `main`: 446/446. La rama `wip/siat-validar-cada-paquete` (la que corrió
  en el VPS) **no está mergeada**.

### 4.3 Lo que se corrigió desde la auditoría del 18-ago

- Crear una factura sin vencimiento ya no da «Datos inválidos»: `dueDate` acepta null.
- La nota de crédito nace EMITIDA y baja el débito fiscal. Antes nacía en BORRADOR y no descontaba
  nada.
- El imprimible sin CUF se titula **«NOTA DE VENTA»** y lleva «Documento sin valor fiscal - no válido
  para crédito fiscal» (`lib/cobros.ts`). Ya no dice «FACTURA».
- `/billing` está disponible para todos los rubros (catálogo §4).
- Sigue igual: el impuesto de la nota interna se guarda en 0 (`app/api/invoices/route.ts:86`).

---

## 5. Qué falta (en orden, con dueño y horas)

Las horas son de desarrollo de una sesión, con tests y revisión, y son estimaciones. «S» es Sergio
Urcullo; «L», Leslie (la titular).

**A. Que Onia facture desde el primer cobro, sin desarrollo grande.** Hacerlo antes del primer pago.

| # | Qué | Dueño | Horas |
|---|---|---|---|
| A1 | Ensayo en el Portal Web **sin emitir** (toda factura emitida es real): confirmar la sucursal 0, el punto de venta y que esté cargado el servicio «Suscripción Onia» con su código del catálogo. *(Crítico:)* **antes del 30-oct-2026**, con el producto homologado a una actividad del clasificador nuevo del RNC (§2.5) | S | 10 min |
| A2 | Elegir con el contador la actividad de la suscripción: 4651200 (venta de programas, la de la plantilla) o 6209920 (servicios en la nube, que parece encajar mejor). *(Crítico:)* confirmar que esos códigos existan en el clasificador del RNC vigente desde mayo-2025 (RND 102500000018) | S + contador | — |
| A3 | Checkout: pedir **a nombre de quién va la factura** (razón social y NIT/CI del negocio) y a qué correo se manda. Hoy solo pide los datos de quien paga | dev (Plataforma) | 2-3 |
| A4 | Cada cobro: el procedimiento de §2.5 | S | ~5 min por factura |

**B. Cerrar la Fase 1 y sostener el trámite.**

| # | Qué | Dueño | Horas |
|---|---|---|---|
| B1 | **Sacar el CAFC del piloto** para los sectores 1 y 17, sucursal 0, y mandar captura con el código y el rango. El menú exacto no está verificado. *(Crítico:)* el CAFC se pide «por actividad económica, sucursal, casa matriz o punto de venta» (siatinfo): si el portal lo pide por punto de venta, sacarlo para el 0 y el 1, porque las filas de VI usan los dos | S | 30 min |
| B2 | **Pedir la prórroga de 60 días** (Autorización de Sistemas → Solicitud de Prórroga), antes del 04-nov. *(Corregido por el crítico; decía «ya»:)* primero preguntar al SIN desde cuándo corren los 60 días (pregunta 7). Si corren desde el pedido, pedirla en la semana del 26-oct; si se suman al 04-nov, da igual cuándo. La guía de siatinfo la describe como algo que se pide «al cabo» de los 90 días | S | 5 min |
| B3 | Cargar el CAFC, adaptar el runner si el SIN da uno por sector y mergear `wip/siat-validar-cada-paquete` | dev | 2-4 |
| B4 | Correr VI motivos 5-7 (120 envíos + 60 validaciones, ~30.000 XML), con respaldo previo (`run-case-v2.sh`, bitácora) | dev | 2-3 |
| B5 | Captura nueva del «Listado de Etapas» para ver el 100 % | S | 10 min |
| B6 | Llamar al SIN con las preguntas de §7 | S | 30 min |
| B7 | *(Agregado por el crítico)* Bajar el «Anexo Técnico Ley 1733» v0.0 (público en siatanexo) y medir el cambio contra los XSD de 2021 y contra lo que pide C: campos nuevos, servicios SOAP y reglas de autorización y asociación. **Antes de arrancar C** | dev | 2-3 |

**C. Dejar la plataforma lista para la inspección.** Se trabaja en un contenedor QA contra el piloto,
nunca prendiendo `SIAT_EMISSION` en producción, porque es un flag global. **Puede arrancar ya**, en
paralelo con B: no depende del CAFC. *(Corregido por el crítico:)* sí depende de B6 y B7. Si el SIN
confirma que todos los sistemas pasan por el anexo de la Ley 1733 (§2.6), C se construye sobre ese
anexo y no sobre el de 2021. Conviene terminarlo antes de la inspección, porque cambiar el
sistema después de autorizado obliga a repetir pruebas (Art. 20 b).

| # | Qué (los puntos que revisa la inspección) | Dueño | Horas |
|---|---|---|---|
| C1 | Conectar la plataforma con el emisor en QA; el ambiente pasa a configuración | dev | 4-6 |
| C2 | Número de factura del SIN en la base y en el impreso; guardar el XML y la respuesta | dev | 4-6 |
| C3 | Comprador: tipo de documento, complemento, verificación del NIT, consumidor final | dev | 6-8 |
| C4 | Medios de pago reales y combinados, tarjeta enmascarada, **emitir al cobrar** | dev | 8-12 |
| C5 | Leyenda de Ley 453 al azar, leyenda en línea / fuera de línea, QR como imagen | dev | 6-8 |
| C6 | XML + PDF al correo del comprador (Art. 26.I b) | dev | 6-8 |
| C7 | Anulación y reversión ante el SIN, hasta el día 9 del mes siguiente, con aviso al comprador | dev | 10-14 |
| C8 | Paso automático a fuera de línea: evento significativo y paquetes de hasta 500 en 48 h | dev | 16-24 |
| C9 | Contingencia manual con CAFC: transcribir las facturas y mandarlas en 72 h | dev | 12-16 |
| C10 | Cron que reintenta las facturas en cola | dev | 4-6 |
| C11 | Nota de crédito-débito fiscal (sector 24) | dev | 10-14 |
| C12 | Sector 17 (clínicas con quirófano), solo si el SIN se lo asigna a las clínicas | dev | 6-8 |
| C13 | Ensayo de los 15 puntos de la inspección, mirado renderizado | dev | 4-6 |
| C14 | Pedir la Fase 2 (inspección), virtual, con el 100 % en el portal y el ensayo aprobado | S | 15 min |
| | **Subtotal C** | | **96-136** |

**D. Onia factura desde su sistema** (después de la autorización).

| # | Qué | Dueño | Horas |
|---|---|---|---|
| D1 | Pruebas piloto con el NIT de Onia e **Inicio de Operaciones**, que es una declaración jurada | L + dev | 3-5 |
| D2 | Token delegado de **producción** y CUIS de producción (el código que habilita a cada punto de venta por un año) | L/S + dev | 1 |
| D3 | Configuración de producción; mirar la primera factura real (908 y QR en el SIN) | dev | 3-4 |
| D4 | Factura automática al aprobar el pago en `/admin/payments`. Desde acá se deja el Portal Web | dev | 8-12 |
| D5 | Guardar el XML y la respuesta del SIN en la base, con respaldo fuera del VPS | dev | 4-6 |
| | **Subtotal D** | | **19-28** |

**E. Los clientes facturan con Onia.**

| # | Qué | Dueño | Horas |
|---|---|---|---|
| E1 | Emisor por organización: configuración fiscal, token cifrado, CUIS y CUFD (el código diario que exige el SIN) y correlativo por punto de venta | dev | 24-32 |
| E2 | Pantalla «Facturación SIN» en Ajustes. Es diseño nuevo: se le muestra a Sergio Urcullo antes de publicar | dev + S | 10-14 |
| E3 | Homologación de productos y servicios al catálogo del SIN | dev | 8-12 |
| E4 | Factura desde la caja de comercio, importadora y servicios | dev | 16-24 |
| E5 | Cláusula de licencia y facturación en los Términos (texto legal) | dev redacta, S aprueba | 1-2 |
| E6 | Por cliente: los pasos de §3.3 | S 15 min + cliente ~1 h + dev 3-5 h | — |
| E7 | Recién con la primera factura de un cliente validada y mirada: nombrar la factura en la venta y barrer el catálogo §7, la web y `/facturacion` | dev | 1-2 |
| | **Subtotal E** | | **~60-86 + 3-5 por cliente** |

**Calendario (estimado, sin plazos publicados por el SIN):**
- **C:** 3-4 semanas de un carril. Termina a fines de octubre o principios de noviembre.
- **Inspección:** se pide en la primera quincena de noviembre. El plan interno calcula 1 a 3 semanas
  hasta la autorización.
- **Onia factura desde su sistema:** diciembre.
- **Primer cliente facturando:** diciembre o enero.
- **Límite duro:** 03-ene-2027, con la prórroga.
- *(Agregado por el crítico)* **Todo este calendario cae si el SIN confirma la lectura literal de la RND
  102600000034**: la ventana de autorización con el anexo nuevo cierra el **16-nov-2026**, antes que la
  prórroga. Se rehace con la respuesta a la pregunta 1.

Si el SIN dice que lo multi-cliente (E1) cuenta como cambio del sistema, conviene meterlo antes de la
inspección, siempre que no corra el pedido de inspección más allá de mediados de noviembre.

---

## 6. Qué depende de Sergio Urcullo

**Ahora (en total, ~1 hora):**
1. **El CAFC del piloto** (sectores 1 y 17, sucursal 0), con captura del código y el rango (B1).
2. **Llamar al 800 10 3444** con las preguntas de §7 (B6). Primero la 1 (anexo nuevo) y la 7 (prórroga).
3. **La prórroga de 60 días** del trámite 9473 (B2), con la respuesta de la pregunta 7 y antes del 04-nov.
   *(Orden cambiado por el crítico: la llamada va antes que la prórroga.)*

**Antes del primer cobro:**
4. El ensayo de 10 minutos en el Portal Web, sin emitir (A1), **antes del 30-oct** (homologación de
   productos con el RNC, §2.5).
5. La actividad de la suscripción, con el contador (A2).
6. Que Leslie autorice a quien vaya a operar el portal (§2.5).

**Cuando toque:**
7. La captura del «Listado de Etapas» después de correr VI 5-7 (B5).
8. Pedir la inspección (C14).
9. Con Leslie, el Inicio de Operaciones y el token de producción (D1-D2).
10. Por cada cliente, la asociación en el portal (~15 min).
11. Decidir si la factura va incluida o como add-on (§1).
12. Aprobar la cláusula de los Términos (E5) y ver la pantalla nueva (E2).

**Con el contador** *(corregido por el crítico; decía «sin apuro»)*: el F-608 figura como recurrente.
Mientras figure, se presenta cada mes aunque sea en cero, o se da de baja: una declaración omitida en los
últimos 3 periodos traba la autorización y el inicio de uso del sistema (Art. 11 y 19.I.d, §2.5). El
F-772 (promociones empresariales) quizás ya no corresponda: la Ley 1733 dejó el Impuesto al Juego solo
para «juegos de azar y sorteos» (Disposición Adicional Tercera, III; leído en la ley). Que eso permita
dar de baja el F-772 es inferencia.

**El pago de prueba de punta a punta** *(agregado por el crítico)*: si entra plata real, se factura
por el Portal Web (§2.5).

---

## 7. Preguntas al SIN (800 10 3444 · siat.soporte@impuestos.gob.bo · comitedefacturacion@impuestos.gob.bo)

1. ¿El sistema 9473, que empezó las pruebas el 06-ago, se autoriza con los XSD de 2021, o tiene que
   pasar al Anexo Técnico Ley 1733 (RND 102600000034)? *(Crítico: la nota de prensa del 7-sep dice que
   «todos» los sistemas propios y de proveedor hacen pruebas y autorización con el anexo nuevo entre el
   1-oct y el 16-nov.)* ¿Qué pasa con un sistema que no se autoriza con el anexo nuevo antes del 16-nov?
   ¿Las pruebas de la Fase 1 vieja cuentan?
2. ¿Cómo usa Onia su propio sistema de proveedor para sus facturas? ¿Se asocia a sí misma? (El
   Art. 17 b lo permite; falta el procedimiento.)
3. Para un sistema web (SaaS) donde el cliente emite desde la plataforma del proveedor y le cede su
   token delegado, ¿el tipo de servicio correcto es «Licencia» o «Facturación por terceros»? (Si es
   terceros, Onia factura lo suyo solo en electrónica: Art. 34 II.)
4. En el piloto, ¿hace falta un CAFC por sector (1 y 17) y por punto de venta (0 y 1), o alcanza uno?
5. ¿Qué cambios del sistema autorizado obligan a una versión nueva con pruebas? (Por ejemplo, pasar
   de un contribuyente a varios.)
6. Un cliente al que le asignaron electrónica, ¿puede emitir en computarizada?
7. *(Agregada por el crítico)* La prórroga de 60 días, ¿se suma al 04-nov o corre desde el día en que
   se pide? ¿Se puede pedir antes de que vengan los 90 días?

---

## 8. Fuentes

| Norma o fuente | Fecha | Qué se usó | Enlace | ¿Verificado? |
|---|---|---|---|---|
| Ley 843, texto ordenado (compilación del SIN) | al 31/08/2026 | Arts. 3 d, 4 b, 5, 14, 15, 74, 75 y 77 | [PDF SIN](https://www.impuestos.gob.bo/wp-content/uploads/2026/09/1.-LEY-N%C2%B0-843-08-26.pdf) | Sí, en el texto del SIN |
| DS 21530, Art. 4 (párrafos del DS 4541) | DS 4541: 14/07/2021 | Servicios continuos: la factura se emite al cobrar | en la misma compilación | Sí |
| DS 27310, Art. 37 (modificado por el DS 0772) | — | Bancarización desde Bs 50.000 | en la misma compilación | Sí |
| RND 102100000011 (compilada) | 11/08/2021 (compilada al 16/06/2025) | Arts. 9, 11, 17, 18.III, 20 a-e, 21, 23-26, 34, 38, 45, 46, 52, 53 y 66 | [PDF SIN](https://www.impuestos.gob.bo/wp-content/uploads/2025/10/RND11.pdf) | Sí (Arts. 17, 18.III y 20 a releídos el 3-oct; el crítico releyó todos los citados). *Ojo:* la compilación es anterior a las RND 102600000006, 012, 025 y 026 de 2026, que la modifican (traslado interno, gasolina en el Art. 46.II, anulación en el Art. 38.II y moneda extranjera en el Art. 25.IX). Ninguna toca los demás artículos usados acá; la 006 no se leyó |
| RND 102600000007 | 23/03/2026 | Grupos 9-12: solo la modalidad asignada desde el 01-oct-2026 | [PDF SIN](https://www.impuestos.gob.bo/wp-content/uploads/2026/03/RND-102600000007.pdf) | Sí. **Sin efecto desde el 30-sep** *(crítico)*: la RND 102600000038 abrogó las designaciones a las que remite su Par. II |
| Anexos de las RND 102400000004, 005, 012 y 025 | 2024 | El NIT 5371375010 no figura (0 coincidencias, con un control positivo) | [RND 2024](https://www.impuestos.gob.bo/index.php/rnd-2024/) | Sí (búsqueda de texto del 3-oct; el crítico la repitió: 0). Abrogadas el 30-sep |
| RND 102600000034 | 01/09/2026 | Anexo Ley 1733 para pruebas y autorización entre el 1-oct y el 16-nov; la RND 11 sigue vigente | [PDF SIN](https://www.impuestos.gob.bo/wp-content/uploads/2026/09/RND-1026000000034.pdf) | El texto, sí. Si alcanza al 9473, **no** |
| Nota de prensa del SIN sobre la RND 102600000034 *(crítico)* | 07/09/2026 | «Todos» los sistemas propios y de proveedor: pruebas en el piloto y autorización del 1-oct al 16-nov | [SIN](https://www.impuestos.gob.bo/index.php/nota_prensa/impuestos-construye-nuevo-sistema-informatico-de-facturacion-con-aportes-tecnicos/) | Sí (leída el 3-oct) |
| Anexo Técnico Ley 1733 v0.0 *(crítico)* | 2026 | Ocho bloques, incluidos autorización y asociación propias | [siatanexo](https://siatanexo.impuestos.gob.bo/index.php?id=255&option=com_content&view=article) | Solo la portada; el contenido no se leyó (B7) |
| RND 102600000038 *(crítico)* | 30/09/2026 | Abroga las designaciones de los grupos 9-12; el SIN asignará modalidad en línea periódicamente | [PDF SIN](https://www.impuestos.gob.bo/wp-content/uploads/2026/09/RND-102600000038-Abrogacio%CC%81n.pdf) | Sí (texto leído el 3-oct) |
| RND 102600000025 *(crítico)* | 13/07/2026 | Agrega al Art. 38.II la anulación fuera de plazo por trámite | [PDF SIN](https://www.impuestos.gob.bo/wp-content/uploads/2026/07/RND-102600000025.pdf) | Sí |
| RND 102500000018 y RND 102600000028 *(crítico)* | 22/04/2025 y 29/07/2026 | Clasificador nuevo de actividades del RNC; homologar productos hasta el 30-oct-2026 | [RND 18](https://www.impuestos.gob.bo/wp-content/uploads/2025/10/RND-102500000018.pdf) · [RND 28](https://www.impuestos.gob.bo/wp-content/uploads/2026/07/RND-No-1026000000028.pdf) | Sí |
| Ley 1733 | 27/05/2026 | Disp. Adic. Segunda (Art. 5 Ley 843, IVA sobre el neto y separado) rige desde el mes siguiente a su decreto; Disp. Adic. Tercera (Ley 060) | [PDF SIN](https://www.impuestos.gob.bo/wp-content/uploads/2026/05/L17332051NCPP.pdf) | Sí, leída el 3-oct *(corregido por el crítico; decía «parcial»)*. Que el decreto siga sin salir al 3-oct: **no** |
| Ley 2492, Arts. 4, 164 y 170 (compilación del SIN) | al 31/07/2026 | Plazos de más de 10 días: corridos (Art. 4.2). Clausura de 6 a 48 días (Art. 164). Multa de 10 veces, solo la primera vez (Art. 170; la Ley 317 modificó el 170, no el 164) | [PDF SIN](https://www.impuestos.gob.bo/wp-content/uploads/2026/08/2.-LEY-N%C2%B0-2492-07-26-1.pdf) | Sí *(corregido por el crítico; decía «solo secundaria»)* |
| siatinfo: Asociación de Sistemas | leída el 3-oct | Tipos de servicio; el proveedor registra y el cliente confirma | [siatinfo](https://siatinfo.impuestos.gob.bo/index.php/facturacion-en-linea/caracteristicas-sfvl/asociacion-de-sistemas) | Sí |
| siatinfo: Fase 2 (inspección) | leída el 3-oct | Los 15 puntos que revisa el SIN | [siatinfo](https://siatinfo.impuestos.gob.bo/index.php/facturacion-en-linea/autorizacion-de-sistemas/pruebas-para-la-autorizacion-del-sistema-de-facturacion/fase-ii-inspeccion) | Sí |
| siatinfo: Fase 3 e Inicio de Operaciones | leída el 3-oct | Pruebas piloto por cliente; declaración jurada; token de producción distinto | [Fase 3](https://siatinfo.impuestos.gob.bo/index.php/facturacion-en-linea/autorizacion-de-sistemas/pruebas-para-la-autorizacion-del-sistema-de-facturacion/fase-iii-pruebas-piloto) · [Inicio](https://siatinfo.impuestos.gob.bo/index.php/facturacion-en-linea/caracteristicas-sfvl/inicio-operaciones) | Sí |
| siatinfo: Prórroga | leída el 3-oct | 60 días, una sola vez | [siatinfo](https://siatinfo.impuestos.gob.bo/index.php/facturacion-en-linea/autorizacion-de-sistemas/guia-de-usuario-prorroga) | Sí |
| siatinfo: Emisión y envío (CAFC en el piloto) | leída el 3-oct | Un CAFC por documento y por sucursal que se prueba | [siatinfo](https://siatinfo.impuestos.gob.bo/index.php/facturacion-en-linea/emision-y-envio-de-facturas/emision-y-envio) | Sí |
| siatinfo: Facturas Manuales de Contingencia y Portal Web como contingencia *(crítico)* | leídas el 3-oct | Talonarios de imprenta autorizada; el Portal Web como contingencia se autoriza a pedido | [manuales](https://siatinfo.impuestos.gob.bo/index.php/facturacion-en-linea/casos-especiales/manuales-contingencia) · [portal web](https://siatinfo.impuestos.gob.bo/index.php/informacion/modalidades-facturacion/facturacion-portal-web) | Sí (copias locales de la investigación) |
| Certificado digital (AGETIC; el DS 5519 cerró ADSIB) | ene-2026 | Solo para electrónica; Bs 70 | [gob.bo](https://www.gob.bo/tramites/certificado-digital-para-facturacion-electronica) · [AGETIC](https://facturacion.firmadigital.bo/procedimientos/solicitar-certificado/) | **Parcial** *(crítico)*: el cierre de ADSIB por el DS 5519 y el traspaso a AGETIC desde el 15-ene-2026 lo dice la ficha oficial de gob.bo (actualizada el 27-feb-2026); el texto del DS no se leyó. Los Bs 70 por año: solo el extracto del buscador de firmadigital.bo/servicios/tarifa (la página da 503): **no verificado** |
| Precios de la competencia | 29 y 30-ago-2026 | §3.5 | `ONIA_PRECIOS_COMPETENCIA_Y_DECISION.md` | No re-verificado hoy |
| VPS: bitácora del runner, `/health`, nombres de variables | 2-oct / 3-oct | §4 | `/opt/onia-siat/runner-20260929/BITACORA.md` | Sí (solo lectura) |

**Trampa de método:** siatinfo falla la verificación TLS (el servidor no manda el certificado
intermedio de RapidSSL) y WebFetch devuelve 503. Se lee con `curl --cacert` y un bundle que suma ese
intermedio, sin apagar la verificación. Lo detalla la tarea B de la investigación del 3-oct.

---

## 9. Correcciones pendientes en otros archivos (las hace el orquestador)

- **URGENTE, web en producción** *(agregado por el crítico)*: `onia.com.bo/facturacion` y
  `/guia-facturacion` (fuente: `web-factory/apps/onia-platform/src/lib/siat.ts` y los tests que fijan el
  plazo) dicen hoy que «desde el 1 de octubre… los alcanzados emiten únicamente por su modalidad en línea
  asignada (RND 102600000007)». La RND 102600000038 del 30-sep abrogó esas designaciones. Es una
  afirmación legal falsa en una página pública y en la guía que capta leads (`guia-siat-*`). Barrer
  también `sales-kit/01-ONE-PAGER-OFERTA.md`, `sales-kit/04-OBJECIONES.md`,
  `ONIA_FECHAS_CRITICAS_PLAN.md`, `ONIA_LEAD_MAGNET_GUIA_UNA_PAGINA_PRD.md`, la landing de
  `dentalgest-landing` (`siat.tsx`) y los guiones de `cola/plan-3-semanas/` que citan el 1-oct.
- **Términos v1.3, §1.2** *(crítico)*: «toda… emisión ante el SIN la hacés vos… con tus propias
  credenciales» choca con el modelo 1 (Onia guarda el token delegado). Va en la cláusula E5. Texto legal:
  pasa por Sergio Urcullo.
- **Skill `onia-contabilidad-bolivia`:**
  - Corregir «facturación en línea obligatoria 30-sep-2026»: aplica solo a los NIT de los grupos 9-12,
    y el de Onia no figura. *(Crítico:)* y desde el 30-sep ni eso: la RND 102600000038 abrogó las
    designaciones. Sumar también la RND 102600000028 (homologación con el RNC hasta el 30-oct-2026) y la
    trampa de la URL de la RND 38 (el nombre del PDF lleva la «ó» descompuesta: `Abrogacio%CC%81n`).
  - Sumar la RND 102600000034, la regla «se factura al acreditarse el cobro» (DS 21530 Art. 4) y la
    trampa TLS de siatinfo.
- **`ONIA_SIAT_ESTADO_HOMOLOGACION.md`:**
  - §1 y §4 siguen en 80 % (27-sep): el conteo local es 96 % (2-oct).
  - §9 dice que el emisor «no está deployado»: corre desde el 13-sep, solo en 127.0.0.1.
  - Falta decir que los 90 días incluyen la inspección.
- **`integrations/siat/ONBOARDING_CLIENTE.md`:**
  - La asociación la registra el proveedor, no el cliente.
  - El reparto de roles está en el Art. 20 d, no en el 34.
  - Faltan las pruebas piloto por cliente, el Inicio de Operaciones, la precalificación del Art. 11 y
    el tipo «Licencia».
- **`integrations/siat/README.md`:** dice 407 tests; hoy son 446 (el crítico los corrió sobre
  `origin/main` 3dd6df18: 446/446). En la línea 94 dice además «Total emisor: 262 tests».
- **`LEEME-PRIMERO.md`** *(crítico)*: describe este archivo como «qué emite de verdad y qué es mock»;
  ahora es la decisión, el estado y el plan de facturación.
- **`ONIA_CATALOGO_DE_VENTA.md` §6.2:**
  - Dice «etapas VI y IX»: IX ya está completa en el conteo local.
  - Sumar que «factura por cada pago» se cumple hoy por el Portal Web.

Detalle de la investigación del 3-oct (tareas A, B y C, con citas): carpeta `siat-plan/` del
scratchpad de esa sesión. Lo que importa quedó en este archivo.
