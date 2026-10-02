# Onia Todo Incluido: propuesta de paquete único para aprobar

**Para:** Sergio Urcullo · **Fecha:** 28-sep-2026 · **Estado:** propuesta, no está aplicada. No se tocó ningún importe del código.

Si la aprobás, los montos se escriben en `lib/subscription-plans.ts` (planes) y `lib/pricing.ts` (extras), que siguen siendo la fuente única. Hasta entonces, ningún número de este documento es un precio real.

**Cómo leer los números**

| Marca | Qué significa |
|---|---|
| **[M]** medido | Sale de gasto real registrado (LiteLLM SpendLogs, facturas) |
| **[O]** oficial | Página oficial del proveedor, consultada el 28-sep-2026 |
| **[C]** código | Valor vigente en el repo `onia-platform-v1-integracion-20260927` |
| **[D]** derivado | Cuenta explícita a partir de [M], [O] o [C] |
| **[S]** supuesto | No hay dato: con 0 clientes no se puede medir |

- **Tipo de cambio base:** 12,05 Bs/USD. Es el TCO del BCB vigente del 26 al 28-sep [O], pero se leyó con WebFetch y **hay que confirmarlo a ojo**.
- **Sensibilidad:** a 11,37 Bs/USD (el que usa `pricing.ts:34`) los costos en Bs bajan un 5,6%. Para el estrés se usa 15 Bs/USD [S]. El 6,96 ya no vale, porque el tipo de cambio flota desde el 29-jun-2026.

---

## 1. Recomendación

1. Vender **un solo paquete por rubro**, «Onia Todo Incluido», en dos tamaños con checkout y uno cotizado. **S (2-3 profesionales): Bs 940/mes.** **M (4-6): Bs 1.290/mes.** **Empresa: desde Bs 2.900.** Ningún precio es nuevo: S = Crece 550 + chatbot 390; M = el Completo actual.
2. Todo en **un pago a Onia**: gestión, agentes, chatbot recepcionista, recordatorios y contenido IA de texto. Cada consumo con costo tiene un cupo mensual, con aviso al 80% y al 100%. Al tope, el servicio **se degrada sin cobrar**. Las ampliaciones son voluntarias y se muestran con su precio antes de pagar.
3. **Meta WhatsApp queda aparte en la 1.0**: el cliente lo paga en su propia cuenta. Onia se lo estima en Bs antes de comprar y lo acota con topes de plantillas. No es por gusto: como Tech Provider, Onia no puede facturar Meta, y absorberlo baja el margen de M de 72,9% a 42,4%.
4. **La IA no limita el precio.** Con el cupo lleno cuesta Bs 25 (S) y Bs 43 (M) al mes. El techo real son **las horas de soporte**, y hoy no se miden. El margen neto de impuestos es ~71% en S y ~73% en M. En el escenario de estrés baja a 66% y 59%.
5. **Break-even: 6 clientes S o 4 clientes M** después de IVA e IT. **Condición para vender:** WhatsApp (Embedded Signup + una plantilla aprobada) tiene que estar encendido y verificado en producción, porque hoy está en `SIN_CONFIGURAR`.

---

## 2. Paquetes

El precio es **igual en los 5 rubros**. El rubro solo cambia qué agentes se activan: en dental y estética, Reactivador, Cobrador y Confirmador; en comercio, Cobrador y Reponedor; en importadora, Cobrador, Reponedor y Seguidor. En comercio e importadora, el cupo de recordatorios de cita se convierte en avisos de cobro o de cotización, que cuestan lo mismo en Meta. Anual = 10 meses, la regla vigente de `subscription-plans.ts`.

| | **S** · 2-3 profesionales | **M** · 4-6 profesionales | **Empresa** · 7+ o varias sedes |
|---|---|---|---|
| **Precio mensual / anual** | **Bs 940 / 9.400** | **Bs 1.290 / 12.900** | **desde Bs 2.900 / 29.000** + implementación desde Bs 3.500 |
| **De dónde sale** | Crece 550 (`subscription-plans.ts:41`) + chatbot 390 (`pricing.ts:72-77`) [C] | Completo 1.290 (`subscription-plans.ts:43`), que ya trae el chatbot [C] | `subscription-plans.ts:44`, `pricing.ts:330-339` [C] |
| **Incluye** | Gestión del rubro con agenda pública; agentes del rubro con aprobación humana; Redactor IA; chatbot recepcionista; recordatorios; contenido IA etapa 1 (texto); configuración asistida después del primer pago | Todo lo de S + reportes completos, facturas recurrentes y varios administradores | Todo lo de M + asesoría; los cupos se fijan al cotizar |
| **Usuarios / fichas / correos** | 4 (3 prof. + recepción, sin cobrar el 4.º) / 800 / 400 [C, salvo el 4.º usuario] | **A fijar (decisión 3)**. Hoy son ilimitados (-1) | A cotizar |
| **Conversaciones del chatbot/mes** | 500 [C] | 800 [S] (hoy el código da 500 a todos) | ref. 1.500 [S] |
| **Fotos + min de audio del bot/mes** (tope por org, **nuevo**) | 500 + 500 | 800 + 800 | ref. 1.500 + 1.500 |
| **Redacciones IA (Redactor)/mes** | 50 [C] | 400 [C] | 400 [C] |
| **Citas recordadas por WhatsApp/mes** | 350 [S: ~110 citas por profesional] | 700 [S] | a medida |
| **Reactivaciones enviadas/mes** | 60 [S] | 120 [S] | a medida |
| **Textos de contenido/mes** | 60 | 120 | ref. 200 |
| **Ediciones del conocimiento del bot/mes** | 20 | 40 | ref. 60 |
| **Almacenamiento por org** (**nuevo**) | 2 GB [S] | 5 GB [S] | 10 GB [S] |
| **Costo IA con el cupo lleno** [D] | USD 2,07 = **Bs 24,97** | USD 3,60 = **Bs 43,38** | USD 6,40 = **Bs 77,17** |
| **+ soporte** [S: Bs 100/h] | 1 h = Bs 100 | 1 h = Bs 100 (con 2 h: Bs 200) | 3 h = Bs 300 |
| **Costo variable con el cupo lleno** | **Bs 124,97** | **Bs 143,38** | **Bs 377,17** |
| **Margen bruto** (sobre el precio) | 86,7% | 88,9% | 87,0% |
| **Margen neto de IVA 13% + IT 3%** [S: precio con IVA incluido] | **70,7%** | **72,9%** | **71,0%** |
| **Margen neto, anual** | 68,0% | 70,7% | — |
| **Margen neto con estrés** (ver abajo) | **65,7%** | **59,2%** | 66,1% |
| **Margen neto con estrés, anual** | 62,1% | 54,3% | — |
| **Horas de soporte/mes que llevan el margen a cero** (neto / estrés anual) | 7,6 h / 5,9 h | 10,4 h / 7,8 h | — |

**Cómo se calcula el costo de IA [D].** Se usan techos, no promedios:
- Redacción: USD 0,00065 (techo de salida).
- Conversación: el texto cuesta USD 0, porque el recepcionista no usa LLM (`recepcionista.mjs:19-20`). Lo que cuesta son los adjuntos: foto USD 0,0007 [M] y minuto de audio USD 0,003 [O].
- Texto de contenido: USD 0,0012, con 1.000 tokens de entrada y 500 de salida en gpt-4.1-mini.
- Edición del conocimiento: USD 0,0059.
- Los tokens salen de contar caracteres a 3,7 por token. **No se pasó un tokenizador.**

S, por ejemplo: 50×0,00065 + 500×(0,003+0,0007) + 60×0,0012 + 20×0,0059 = USD 2,0725 × 12,05 = Bs 24,97.

**Estrés, solo para uso interno.** Se calcula así:
- Tipo de cambio de 15 Bs/USD [S].
- Costos en USD × 1,125, por el IUE-BE [S, a confirmar con el contador].
- Ingreso × 0,84, por IVA e IT [S, a confirmar con el contador].
- Chatbot costeado **como si respondiera con LLM en cada mensaje**, al pico de USD 2,17 cada 500 conversaciones [D, con los tamaños del módulo retirado `whatsapp-ai.ts`].
- En M se suman 2 h de soporte.

Cuenta de S: (4,2425 USD × 1,125 × 15 = Bs 71,59) + Bs 100 → contribución (789,6 − 171,59) = Bs 618,0 → 65,7%. El estrés deja espacio para que el bot use IA de verdad más adelante sin romper el margen.

**Qué sale del checkout.** Básico, Crece y Profesional sueltos, el ciclo semanal y el chatbot como add-on aparte. Profesional + chatbot suman Bs 1.280, casi el mismo precio que Completo: eran dos escalones iguales. Básico es parte de la decisión 1.

**Primer mes.** La configuración asistida lleva 3 h en S y 5 h en M [S]. Aun restándolas, el primer mes S deja Bs 364,6 de contribución neta, así que no pierde plata. Para que eso se cumpla, la configuración arranca **después del primer pago**. Durante la prueba de 14 días solo corre el asistente de alta en autoservicio. Si no, cada prueba que no convierte son horas sin ingreso.

---

## 3. WhatsApp y Meta: cómo se cobra y por qué

**Decisión propuesta para la 1.0:** Meta se paga aparte, se avisa en Bs antes de comprar y queda acotado por los topes de Onia. Es la **única** excepción al pago único.

**Por qué no puede ir dentro del precio**
- Onia conecta a los clientes como **Tech Provider con Embedded Signup**. En ese modelo, Meta exige que el negocio cargue **su** medio de pago en **su** cuenta. Solo un Solution Partner con línea de crédito puede facturarle Meta a un cliente [O: developers.facebook.com, páginas de embedded-signup y solution-providers, 28-sep].
- Absorberlo con el número y el WABA de Onia tiene dos problemas: el paciente vería el número de Onia y no el de su clínica, y un cliente que hace spam arrastraría a todos los demás.
- Absorber el Meta típico baja el margen neto de S de 70,7% a 52,7% y el de M de 72,9% a 42,4%, y sube el break-even de S a 8 clientes [D].

**Tarifas para Bolivia** (región «Resto de Latinoamérica»; no cambian el 1-oct-2026) [O]

| Tipo de mensaje | USD por mensaje entregado | Bs a 12,05 |
|---|---|---|
| Utilidad (recordatorio, aviso de cobro) | 0,0113 | 0,136 |
| Marketing (reactivación, si Meta la clasifica así) | 0,074 | 0,892 |
| Servicio (respuestas del bot): **desde el 1-oct-2026, 1.000 gratis por número al mes**, después | 0,0113 | 0,136 |
| Utilidad dentro de la ventana de 24 h | gratis hasta el 30-sep; se cobra desde el 1-oct | |

**Estimado que se le muestra al cliente antes de activar** [D]. Supone 1 recordatorio por cita y la reactivación como marketing:

| | Típico: 3 respuestas por conversación [S] | Máximo con los topes de Onia: 6 respuestas por conversación [S] | Mínimo: reactivación como utilidad y bot dentro del cupo gratis |
|---|---|---|---|
| **S** | 350×0,0113 + 60×0,074 + 500×0,0113 = USD 14,05 = **Bs 169/mes** | USD 31,00 = **Bs 374** | USD 4,63 = Bs 56 |
| **M** | 700×0,0113 + 120×0,074 + 1.400×0,0113 = USD 32,61 = **Bs 393/mes** | USD 59,73 = **Bs 720** | USD 9,27 = Bs 112 |

Meta cobra en USD, así que a 15 Bs/USD el típico de S sería Bs 211.

**Cómo se acota**
1. **Tope duro de plantillas enviadas por Onia**, por tamaño: utilidad 350 en S y 700 en M; marketing 60 y 120.
2. **Tope de respuestas del bot por mes**: 3.000 en S y 4.800 en M (6 por conversación). Sin este tope, el «máximo» de arriba no queda garantizado por código.
3. **Segundo recordatorio (2 h antes) solo si la cita no se confirmó.** Hoy el cron siempre manda 2 (`appointment-reminders/route.ts:60-69`); este cambio corta esa parte de la factura a la mitad o menos.
4. **Al llegar al tope, el recordatorio sale por correo**, sin costo.
5. **Contador en el panel y reporte mensual en Bs** de lo que eso significa en Meta.
6. **Antes de cada envío masivo** (barrida inicial de reactivación) se muestra el costo en Bs y se pide aprobación. Ejemplo: 320 inactivos × 0,074 = USD 23,68 = Bs 285.

**Pendiente de verificar:** si Meta acepta tarjetas emitidas en Bolivia en USD, y con qué recargo. Sin tarjeta, las plantillas probablemente no salen nunca. Se califica antes de vender («¿tenés una tarjeta que pague en dólares?») y el plan B es correo sin costo.

**Después de la 1.0:** investigar requisitos, costo y plazo para ser Solution Partner o armar un esquema multi-socio con uno. Recién entonces Meta puede entrar al pago único, **y siempre con cupo en Bs, nunca ilimitado**.

---

## 4. Contenido IA por etapas

**Regla de entrada** (test de tres preguntas, ESTRATEGIA §10). Un editor genérico tipo Canva falla la pregunta 2 y es un negocio nuevo disfrazado. El contenido pasa el test solo si cumple las tres:
- Nace de los datos del núcleo: huecos de agenda, tratamientos, pacientes a reactivar.
- Es autoservicio: cero horas de Sergio Urcullo por pieza.
- Lo usa el mismo cliente que ya paga.

Onia elige el modelo. **La venta no anuncia etapas que no estén encendidas.**

| Etapa | Cuándo | Motor | Costo unitario | Cupo y costo/mes |
|---|---|---|---|---|
| **1. Texto** (posts, historias, mensajes de campaña) | **Entra en la 1.0**, dentro del paquete | gpt-4.1-mini, reusando la llamada del Redactor | USD 0,0012 por texto [D] (Bs 0,014) | S 60 = Bs 0,87 · M 120 = Bs 1,74 |
| 1b. Carruseles e historias en HTML con fotos del cliente | Opcional en la 1.0 | Render en Chrome headless, portado desde Hermes | 0 variable | sin cupo de costo |
| **2. Imagen** | 1.1, recién cuando la etapa 1 tenga uso medido | gpt-image-1-mini, vertical, **calidad media fija por código** | USD 0,015 por imagen [O] (Bs 0,18); en calidad alta 0,052, bloqueada | S 20 = Bs 3,6 · M 40 = Bs 7,2 |
| **3. Video corto** | 1.2 o después, **nunca incluido**: solo como pack prepagado | Veo 3.1 Lite | 720p USD 0,05/s; 1080p 0,08/s [O, ai.google.dev, actualizado 24-sep] | Pack de 4 clips de 8 s a 1080p = USD 2,56 (Bs 30,8; Bs 43,2 con estrés) |

**Descartados:** Sora 2 (OpenAI lo apagó el 24-sep-2026) e Higgsfield, que no publica cuánto vale un crédito en USD, cuyos créditos vencen y que `ONIA_ADDON_CONTENIDO.md:66-92` ya excluyó. Con las etapas 1 y 2 al tope, el contenido pesa menos del 1% del precio. El riesgo no está en los tokens: está en la calidad y en el cliente que pide rehacer.

**Antes de la etapa 2:** hace falta la cuota de almacenamiento por org (el disco del VPS estaba al 78%) y la aprobación de gasto para abrir el proveedor.

---

## 5. Ampliaciones avisadas

**Reglas para todas.** Son voluntarias y se ofrecen desde el 80% del cupo. El precio se muestra **antes** de pagar, se pagan por adelantado con QR y vencen a fin de mes sin acumularse. **Nunca hay excedente automático.**

**Regla de precio propuesta** [D]: precio ≥ costo con estrés ÷ 0,84 ÷ 0,25, o sea un margen neto de al menos 75%. Piso de **Bs 50**: aplicar una ampliación a mano lleva ~0,25 h, unos Bs 25 [S]. Se redondea a la decena de arriba.

| Ampliación | Precio | Costo con estrés | Estado |
|---|---|---|---|
| +200 conversaciones del chatbot | **Bs 190** [C, `pricing.ts:199-225`; el código dice que espera tu confirmación] | Bs 12,5 (solo adjuntos) → margen neto 77%. Con LLM en cada mensaje: Bs 27,1 → 70% | Existe; hoy la aplica el superadmin a mano. Alcanza hasta ~5 clientes |
| Pasar de S a M a mitad de mes | Diferencia prorrateada, Bs 350/mes | — | Se sugiere cuando algún cupo pasa el 80% dos meses seguidos. Nunca se hace sola |
| Usuario extra (S, desde el 5.º) | **Bs 70/mes** [C, `pricing.ts:282-295`] | ~0 | Existe |
| +100 min de audio | **Bs 50** (piso) | Bs 5,06 | Nueva |
| +20 imágenes (etapa 2) | **Bs 50** (piso) | Bs 5,06 | Solo cuando la etapa 2 esté encendida |
| Pack de 4 clips de video (etapa 3) | **Bs 210** (regla) | Bs 43,2; cada intento descuenta del pack | Solo cuando la etapa 3 esté encendida y el gasto esté aprobado |

**Lo que no se vende**
- **Recarga del Redactor.** 100 redacciones cuestan USD 0,065; si alguien llega al tope, se sube el cupo del plan.
- **Horas de soporte.** Onia vende software, no horas.
- **Agente Captador.** Sigue con habilitación manual (`addon.captador`), sin precio.
- **Más plantillas de Meta** no es una ampliación de Onia. Subir el tope pide que el cliente confirme la estimación de lo que Meta le va a cobrar.

---

## 6. Qué cambia en el producto, en orden

**Condición previa, fuera del código:** WhatsApp con Embedded Signup y una plantilla `appointment_reminder` aprobada, encendidos y verificados de punta a punta en producción. Hoy están en `SIN_CONFIGURAR`. Sin esto no se venden cupos de WhatsApp. El plazo depende de Meta y de tu tramo en el navegador.

| # | Cambio | Dónde | Esfuerzo |
|---|---|---|---|
| 1 | **Topes de gasto en el borde.** Adjuntos (fotos y min) por org y por mes, tope de respuestas del bot, audio pasado por LiteLLM (hoy va directo a OpenAI, `audio-transcribe.mjs:52-53`), bot y editor con clave virtual en vez de la maestra, y topes globales de LiteLLM escalados (el de US$10 corta a ~4 clientes M si hay LLM en cada mensaje) | Bot en el VPS (`hermes-content/deploy/vps-ops/bot`); necesita dueño único de infra | 2-3 días + ventana de infra |
| 2 | **Catálogo S/M.** `crece` → S (whatsappIncluded, 4 usuarios, Bs 940/9.400); `clinic` → M con números fijos; sacar los planes sueltos y el semanal del checkout. Barrer los tests que citan esos planes (`capacidad-en-el-plan-correcto`, `faq-promesas`, `como-lo-paga-el-dueno`) y el espejo `alta.ts` | `subscription-plans.ts`, `plan-catalogo.ts`, `pricing.ts` | 1-2 días |
| 3 | **Cupo del chatbot por plan (500/800).** Refactorizar `cuotaDe()`, que hoy ignora el plan (`cupo.ts:100-107`), y `hayNivelConMasCupo`; el test `cupo-no-ofrece-un-nivel-que-no-existe` cambia de sentido | `lib/chatbot/cupo.ts` | 1 día |
| 4 | **Checkout único.** Rubro → tamaño → mensual/anual → QR, que cubre plan y chatbot en un solo cobro, con la línea de Meta en Bs | reusar el flujo de Completo | 1-2 días |
| 5 | **Recordatorios.** Cupo por tamaño (350/700) en lugar del `operationalMonthlyLimit: 200` (`pricing.ts:111`), 2.º recordatorio condicional, paso a correo al tope y tope de plantillas | `appointment-reminders/route.ts` | 1-2 días |
| 6 | **Panel «Tu mes».** Un medidor por cupo en unidades del negocio, avisos al 80% y 100% en el panel y por correo (hoy el Redactor responde 429 sin aviso previo) y contador estimado de Meta | reusar el patrón de `cupo.ts:291-306` | 2-3 días |
| 7 | **Meta y tipo de cambio.** Estimador en Bs; `utilityBob`/`marketingBob` (0,113/0,74, calculados a 10 Bs/USD, `pricing.ts:120-121`) derivados del tipo de cambio de referencia; 11,37 → 12,05 cuando lo confirmes; barrer `PRICING.md`, `PLAN_LIMITS.md` y `WHATSAPP_ADDON_COSTS.md` | `pricing.ts` + docs | 1-2 días |
| 8 | **Medición y guardas chicas.** Registro interno de minutos de soporte por org (no se vende), cuota de almacenamiento por org y reserva atómica del cupo del Redactor (`agents-plantilla-servicio.ts:104-105`) | Platform | 2-3 días |
| 9 | **Alta.** Asistente de alta en autoservicio durante la prueba; la configuración asistida arranca después del primer pago | Platform | 2-3 días |
| 10 | **Contenido etapa 1 (texto).** Anclado a agenda, tratamientos y reactivación, con cupo y registro previo | sobre la llamada del Redactor | 3-5 días (1b: +3-5, opcional) |
| 11 | **Copy.** Cambiar «Chatbot de WhatsApp con IA que contesta, califica…» (`pricing.ts:358`) por «recepcionista con guion que deriva a una persona», porque hoy es una promesa falsa. Además: web, /empezar, sales-kit y bot de venta, con un precio por tamaño y Meta explicado. **Publicar requiere tu OK sobre la pieza renderizada** | Platform + web-factory | 1-2 días |
| 12 | **Términos del servicio.** Cupos, sin excedentes, vencimiento de las ampliaciones, Meta aparte con tope y cláusula de revisión si el tipo de cambio pasa de 15. Precio con IVA incluido y factura SIAT, a confirmar con el contador | texto, no código | 1 día |

**Total para la 1.0:** ~18-29 días-persona, más QA y deploy (skills `onia-deploy` y `onia-verificacion`).

**Después de la 1.0:**
- Imagen: 3-8 días.
- Video: 4-6 días + aprobación de gasto.
- Recarga en autoservicio: cuando haya más de 5 clientes.

**Ojo con la fecha:** el cambio de Meta del 1-oct-2026 llega antes que los pasos 1, 5 y 6. Hasta entonces, `pricing.ts` sigue cortando a 200 mensajes.

---

## 7. Riesgos y agujeros que quedan

| Riesgo | Cómo se mitiga |
|---|---|
| **El soporte es el único costo capaz de superar al precio**, y no se mide. El punto de contribución cero está en 5,9 h/mes (S anual, con estrés) | Registro interno de minutos (paso 8), asistente de alta, configuración solo después de pagar. Revisar el supuesto de 1 h/mes con los primeros 3 clientes |
| **Los volúmenes son escenarios** (0 clientes): ~110 citas por profesional, 3-6 respuestas por conversación, adjuntos por conversación. Las citas salen de un doc de `historial/` | Los cupos son techos, así que el costo no depende del escenario. Medir los primeros 3 meses y ajustar los cupos |
| **Hoy el gasto de IA no tiene techo por código**: el audio va fuera de LiteLLM, el bot y el editor usan la clave maestra, y no hay tope de fotos ni de audio | Paso 1 antes de vender |
| **Meta queda fuera del «un solo pago»**, y el típico suma entre 18% y 30% sobre la mensualidad (Bs 169 en S, Bs 393 en M) | Decírselo en la primera conversación, no en la factura. Estimador, topes y 2.º recordatorio condicional. Solution Partner, después |
| **Tarjeta boliviana en USD** no verificada | Calificar antes de vender; plan B por correo |
| **Categoría de la plantilla de reactivación** desconocida: como marketing cuesta 6,5 veces más que como utilidad | Mostrarla como rango hasta que Meta apruebe la plantilla; pedirla como utilidad si es seguimiento de un tratamiento ya pactado |
| **El valor del paquete no está medido.** En el escenario conservador, S rinde 0,97x lo que cuesta (historial VALOR §1.3, sin fuente para la tasa de reactivación) | En la demo, contar con los datos del cliente cuántos pacientes tiene a medias antes de prometer plata |
| **«Agente conversacional con IA» vs. un recepcionista sin LLM** | Corregir el copy (paso 11). El estrés ya cubre reintroducir el LLM sin romper el margen, con un tope de turnos |
| **Impuestos no confirmados** (IVA incluido, IT, IUE-BE) | Validar con el contador antes de publicar precios. Los márgenes de este documento ya los descuentan |
| **El anual (10 meses = 16,7% de descuento)** es el caso con menos colchón | No sumar descuentos encima del anual |
| **Retirar Básico achica el embudo** (el consultorio de 1 profesional es el que más rápido contesta) | Decisión 1: dejarlo como «solo gestión», fuera de la promoción |
| **Competidores** que ya venden IA + WhatsApp: Dentalink, AgendaPro/Julia, HighLevel | La diferencia se demuestra con el recorrido completo funcionando, no con la lista de features |
| **Tipo de cambio 12,05** leído con un resumen automático | Confirmarlo a ojo en bcb.gob.bo antes del paso 7 |
| **Disco del VPS al 78%** y sin copia de respaldo fuera del VPS | Cuota por org (paso 8); R2 queda pendiente de tu token |

---

## 8. Costos con su fuente

| Concepto | Costo | Tipo | Fuente |
|---|---|---|---|
| gpt-4.1-mini (texto, visión) | USD 0,40 entrada / 1,60 salida por 1M tokens | [O] | developers.openai.com/api/docs/pricing, 28-sep |
| gpt-4o-mini-transcribe (audio) | ~USD 0,003 por min | [O] | ídem |
| gpt-6-luna (posible reemplazo, no integrado) | USD 0,10 / 0,50 por 1M | [O] | ídem |
| Redacción del Redactor | USD 0,000304 típico; 0,00065 techo | [D] | `agents-plantilla.ts:185-253`, a 3,7 caracteres por token |
| Conversación del chatbot recepcionista (texto) | USD 0 | [C] | `recepcionista.mjs:19-20` |
| Foto leída por el bot | USD 0,0007 | [M] | `pricing.ts:180`, SpendLogs del 10-sep |
| Edición del conocimiento | ~USD 0,0036 típico; 0,0059 techo | [D] | `editor-sugerir.mjs`, con el conocimiento de Onia como tamaño de referencia |
| LLM en cada mensaje (hipotético) | USD 0,44 típico; 2,17 pico cada 500 conversaciones | [D] | ONIA_AGENTES_COSTO_API.md:159-163 (módulo retirado) |
| Imagen gpt-image-1-mini, 1024×1536, calidad media / alta | USD 0,015 / 0,052 | [O] | developers.openai.com/api/docs/models/gpt-image-1-mini |
| Video Veo 3.1 Lite, 720p / 1080p | USD 0,05 / 0,08 por segundo | [O] | ai.google.dev/gemini-api/docs/pricing (actualizada el 24-sep) |
| Meta, plantilla de utilidad / marketing / servicio (Bolivia) | USD 0,0113 / 0,074 / 0,0113; 1.000 mensajes de servicio gratis por mes desde el 1-oct | [O] | developers.facebook.com/docs/whatsapp/pricing y updates-to-pricing |
| Gasto real de IA, 30 días | US$12,20 en total, de los cuales US$11,93 son Hermes interno y ~0,27 el producto | [M] | memoria agentes-ia-sin-llm-auditoria-24-sep |
| Topes de LiteLLM | US$5 agentes + US$10 bot cada 30 días, globales | [C] | handoff codex-continuar-1.0.md:212-213 |
| VPS KVM 4 | US$40/mes = Bs 482 | [S/M] **Tres cifras en conflicto** (US$21, US$40 y Bs 220); la renovación del 24-sep no quedó anotada | ONIA_AGENTES_COSTO_API.md:36; renovación oficial en Hostinger: US$28,99 [O] |
| Dominio onia.com.bo | Bs 280/año = Bs 23,33/mes | [O] | nic.bo |
| DNS, correo, Supabase, Chatwoot, n8n, LiteLLM | 0 en licencias (van dentro del VPS) | [S] | memoria onia-correo-propio; ESTRATEGIA §8.1 |
| Operar el producto (fijo) | **Bs 505,33/mes** | [D] | VPS + dominio |
| Gasto total de la empresa | Bs 3.650/mes (Bs 2.950 base + Bs 700 caja chica) | [S] desactualizado (junio, sin Claude Max) | ESTRATEGIA §4, FINANCE_LOG |
| Hora de soporte | Bs 100 | [S] | ESTRATEGIA §9 |
| Tipo de cambio | 12,05 Bs/USD | [O], leído con resumen automático | bcb.gob.bo, 26-28 sep |

**Break-even** = gasto mensual ÷ contribución por cliente. La contribución es el ingreso neto de IVA e IT menos el costo variable con el cupo lleno.

| Escenario | S | M |
|---|---|---|
| Contribución neta (12,05 Bs/USD, 1 h de soporte) | Bs 664,6 | Bs 940,2 |
| Clientes para cubrir Bs 3.650 | 5,5 → **6** | 3,9 → **4** |
| Contribución con estrés | Bs 618,0 | Bs 764,3 |
| Clientes con estrés | 5,9 → **6** | 4,8 → **5** |
| Clientes para cubrir solo operar (Bs 505) | 1 | 1 |
| Clientes con Meta absorbido (típico) | 3.650 ÷ 495,4 → **8** | 3.650 ÷ 547,3 → **7** |

---

## 9. Decisiones que tomás vos

**D1. ¿Aprobás los tamaños y los precios?** S Bs 940 · M Bs 1.290 · Empresa desde Bs 2.900, con anual = 10 meses.
- **Recomendado:** sí. Crece, Profesional y el semanal salen del checkout. **Básico queda como «solo gestión» fuera de la promoción**, para no cerrarle la puerta al consultorio de 1 profesional.
- Alternativa: retirar Básico también. Es más simple, pero achica el embudo.

**D2. ¿Cómo va Meta en la 1.0?**
- **Recomendado: aparte, estimado en Bs antes de comprar y con topes de Onia.** Investigar Solution Partner después de la 1.0.
- Alternativas: (b) absorberlo con el número de Onia: la clínica pierde su número y el margen de M cae a 42%. (c) Investigar Solution Partner **antes** de lanzar: retrasa la 1.0 sin plazo conocido.

**D3. «Nada ilimitado» en M.** Hoy usuarios, fichas y correos están en -1.
- **Recomendado: 8 usuarios · 2.000 fichas · 1.600 correos/mes** [S]: 6 profesionales + recepción + dueño; el doble del correo de Profesional. Revisar con uso real.
- Alternativa: dejarlo ilimitado. Rompe tu regla, y los correos sin tope salen por la IP propia.

**D4. Contenido.** El add-on de contenido de Bs 390 (`ONIA_ADDON_CONTENIDO.md`) no está en `pricing.ts`.
- **Recomendado:** ese add-on se da de baja y la etapa 1 (texto) entra al paquete. La imagen entra en la 1.1 con cupo, y **el video existe solo como pack prepagado de Bs 210**.
- Alternativa: mantener el add-on como servicio «hecho por Onia». Falla la pregunta 3 del test, porque consume horas tuyas.

**D5. Confirmaciones que destraban el código:**
- (a) La recarga de +200 conversaciones a Bs 190.
- (b) La regla de precio de las ampliaciones: margen neto de al menos 75%, piso de Bs 50.
- (c) El tipo de cambio 12,05, mirado por vos en bcb.gob.bo.
- (d) Con el contador: si los precios se publican con IVA incluido y si Onia emite la factura por SIAT.
- **Recomendado:** sí a (a) y (b). (c) y (d) son chequeos de 10 minutos que van antes del paso 7 y de publicar precios.
