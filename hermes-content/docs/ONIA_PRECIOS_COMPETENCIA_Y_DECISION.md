# Precios: competencia relevada y decisión

> ⛔ **ESTE DOCUMENTO NO ES FUENTE DE VERDAD DE NINGÚN PRECIO.** Es un análisis de
> competencia con fecha. Los precios se leen SIEMPRE de los dos archivos que manda
> CLAUDE.md: planes en `onia-platform/lib/subscription-plans.ts`, add-ons en
> `onia-platform/lib/pricing.ts`. Si un número de acá contradice a esos archivos, ganan
> ellos y este doc está viejo.
>
> El candado no es burocracia: este mismo relevamiento encontró **seis precios vivos del
> chatbot, cinco falsos**, y dos documentos que se autodeclaran "fuente única" compitiendo
> con la regla. Un séptimo empeora el problema que el doc denuncia.

---

# Decisión de precios de Onia

**Fecha:** 2026-08-28 · **Para:** Sergio · **Estado:** documento de decisión, no material de cliente

> ⚠️ **Revisado el 2026-08-30 — Emizor.** El relevamiento original lo daba como "no publica
> precio" en cuatro lugares y lo llamaba *el dato que más falta*. **Es falso.** Emizor publica
> USD 49/99/299 desde 2022; lo que pasa es que su ruta `/precios-2` da 404 y el precio quedó
> sólo en archive.org. El tipo de cambio no se tocó: sigue Bs 11,83/USD en todo el documento.

**Tipo de cambio usado en todo el documento: Bs 11,83/USD** (oficial BCB al 28-ago-2026). Triangulado por tres fuentes independientes el mismo día: dolarbolivia.net, la tabla de hosting de Sintic (que divide sus propios precios a 11,83 exacto) y la página de tipo de cambio de Xmart, que cita al BCB. El paralelo está en Bs 11,95 venta / 12,00 compra: **la brecha oficial-paralelo es ~1%, prácticamente cerrada.**

> ⚠️ **El brief traía 11,37 y está viejo.** No es un detalle: con 11,37 un SaaS de USD 100 son Bs 1.137 y con 11,83 son Bs 1.183. Si algún doc interno sigue con 11,37, hay que corregirlo antes de usarlo en una cuenta.

---

## 1. Tabla comparativa — Bs/mes para un negocio de 3 usuarios

### 1.a — Competencia LOCAL (cobra en Bs, sin exposición cambiaria)

| Proveedor | Qué es | Bs/mes (3 usuarios) | Pago inicial | Notas |
|---|---|---|---|---|
| **Growing Cloud** Básico | Facturación SIAT en línea | **100** | no publicado | Usuarios ilimitados. 700 facturas/mes. **Sin firma digital** (esa es Premium Bs 200). Anual: Bs 85,71/mes efectivo (14 por 12). |
| **Sintic** Cloud SIAT Básico | Facturación | **85** | no publicado | Solo 10 productos, solo computarizada. Jaula. |
| **Sintic** MonoBusiness Negocio | Inventario + POS + facturación | **200** | no publicado | El plan de Bs 150 **no factura**. Precio congelado desde 2019. |
| **Sinergya CODEX** Plus | Facturación SIAT + inventario | **208** | no publicado | Solo se vende **anual**: Bs 2.500 de una vez. Core (Bs 83/mes) topea en 2 usuarios → 3 obliga a Plus. ⚠️ El mismo dueño publica Bs 129/mes en codexerp.software. Dos listas vivas. |
| **Xmart Cloud** Facturación | API + panel SIAT | **236** | — | 100 facturas/mes, extra Bs 0,25. |
| **Xmart Cloud** Bot WhatsApp QR | Chatbot sin API oficial | **177** | 0 | Conecta por QR, **sin costo de Meta**. No es API oficial. |
| **Xmart Cloud** Bot Meta API | Chatbot API oficial | **296** | 414 | + consumo de Meta al cliente. |
| **Rimay** Básico | Bandeja multicanal | **290** | no publicado | **Sin chatbot y sin SIAT** en este plan. |
| **Rimay** Pro | Bandeja + chatbot + SIAT | **590** | no publicado | ⚠️ Su checkout cobra en USD (Professional $79) convertido a **6,96**. A 11,83 son Bs 935 reales. |
| **Chicha** (oviwool) Profesional | WhatsApp-tienda | **399** | 0 | ⚠️ **Sitio no operativo**: el formulario tiene `// Simulate submission`, los 19 CTA son `href="#"`, sin contacto. Precio publicado, no precio cobrado. Facturación SIN solo en el plan de Bs 799. |
| **CUCU** Odoo SaaS Junior | Odoo + SIAT | **720** (648 anual) | **4.500** | 1.000 facturas/mes. |
| **CUCU** API SIAT Junior | Solo timbrado | **280** | **2.800** | **0 facturas incluidas**, Bs 0,98 c/u. A 300 facturas = Bs 574/mes real. |
| **Sintic** POS escritorio + SIAT | Licencia mono-PC offline | **1.900 pago único** (≈53/mes a 3 años) | — | Solo 2 documentos sector. App móvil con costo extra sin precio. |
| **Sintic** componentes SIAT sueltos | Librería/gateway/API | **850 a 4.500 pago único** | — | Su copy vende el argumento anti-suscripción textual. |
| **Emizor** PYME | Facturación certificada por el SIN | **580** | **0** (sin costo de alta) | ⚠️ **Cobra en USD: 49/mes.** Facturas, tipos de documento, sucursales y usuarios **ilimitados**, un solo NIT. **Sólo se vende semestral → USD 294 = Bs 3.478 por adelantado.** Precio leído del snapshot del 27-abr-2025; hoy `/precios-2` da 404. |
| **Citalo** (dental) | Turnos | 🔴 **NO PUBLICA PRECIO** | — | WhatsApp uruguayo (+598). |
| **Wirevet** (veterinaria) | Ficha clínica | 🔴 **NO PUBLICA PRECIO** | — | Operación chilena. |
| **LiveConnect Bolivia** | WhatsApp API | 🔴 **NO PUBLICA PRECIO** | — | Solo "escala a USD 1 por agente" sin base. `/bo/precios` = 404. |
| **ADSIB** (no es competidor) | Certificado firma digital | **Bs 70 pago único** | — | Lo paga el cliente de cualquier proveedor, incluido el nuestro. |

> **La escalera completa de Emizor** (verificada el 2026-08-30 en dos capturas de
> archive.org, 29-nov-2022 y 27-abr-2025, **idénticas**): **PYME USD 49 = Bs 580** ·
> **EMPRESA USD 99 = Bs 1.171** · **CORPORATIVO USD 299 = Bs 3.537**. Los tramos no son por
> usuarios sino **por facturación anual del cliente**: menos de Bs 1,2 M → PYME, menos de
> Bs 10 M → EMPRESA, menos de Bs 35 M → CORPORATIVO. Va en la tabla local porque es una
> empresa boliviana certificada por el SIN, pero **es el único local que cobra en dólares**,
> así que la cabecera "sin exposición cambiaria" no le aplica.

### 1.b — Competencia EXTRANJERA en USD/EUR (convertida a 11,83)

| Proveedor | Plan con 3 usuarios | Etiqueta | **Bs/mes** | Costo extra |
|---|---|---|---|---|
| **Odoo** Standard | 3 × USD 8,95 (lista anual) | USD 26,85 | **318** | ⚠️ **No factura SIAT.** El comparable real es Custom (3 × USD 13,60 = **Bs 483**) + módulo de partner + Success Pack desde USD 977,50 = **Bs 11.564** |
| **Bitrix24** Basic | plano, 5 usuarios incl. | USD 49 | **580** | Sin contabilidad ni fiscal |
| **Siigo/Contífico** Plus (Ecuador) | 3 usuarios + contador | USD 591/año lista | **583** | **No vende a Bolivia** (no está en su selector) y es SRI, no SIAT |
| **Nubox** Pro (Chile) | 3 usuarios | 2,18 UF | **~1.149** | + IVA. Sin SIAT |
| **Doctocliq** Avanzado (dental) | 3 profesionales | USD 147 | **1.739** | **Cobra por cabeza.** No resuelve SIAT |
| **Defontana** Pro más (Chile) | 3 usuarios | 6,99 UF | **~3.685** | + IVA + implementación sin precio |
| **Zoho One** flexible | 3 usuarios | USD 270 | **3.194** | ⚠️ **No verificado en fuente primaria** — su página sirve el precio vacío |

### 1.c — Chatbots de WhatsApp (el add-on que Onia cobra Bs 390)

| Proveedor | Plan | Etiqueta | **Bs/mes** | Alta |
|---|---|---|---|---|
| **Xmart** QR (BO) | sin API oficial | USD 14,99 | **177** | 0 |
| **Xmart** Meta API (BO) | API oficial | USD 24,99 | **296** | 414 |
| **ONIA** | 500 conv/mes | Bs 390 | **390** | **0** |
| **ManyChat** Pro | 3 usuarios, 2.500 contactos | USD 39 | **461** | + **USD 25/mes** por asiento extra de Inbox |
| **Rimay** Pro (BO) | chatbot + SIAT | Bs 590 | **590** | no publicado |
| **360dialog** Regular | solo acceso API, **sin bandeja** | EUR 49 | **672** | 0 |
| **Chatwoot Cloud** Startups | 3 agentes | USD 57 | **674** | 0 |
| **Wati** Growth | 3 usuarios, 500 MAC | USD 59 | **698** | 0 |
| **Respond.io** Starter | 5 usuarios | USD 99 | **1.171** | 0 |
| **Landbot** Professional | 3 asientos | USD 110 | **1.301** | + add-on WhatsApp 🔴 **sin precio publicado** |
| **Zenvia** Specialist (BR) | 10 usuarios | R$ 600 | **~1.368** | + canal + **R$ 649 alta** |
| **Botmaker** Standard | 3.000 conv | USD 149 | **1.763** | **USD 99** alta |

**Costo subyacente de Meta que pagan todos** (Bolivia cae en "Rest of Latin America", sin tarifario propio): marketing Bs 0,88–1,01 y utility/auth Bs 0,13–0,15 por mensaje entregado. **Las dos fuentes que publican estos números no coinciden entre sí y ninguna es el rate card oficial** — ver sección 6.

---

## 2. Dónde queda Onia hoy

**Precios canónicos:** `subscription-plans.ts` → Básico Bs 320/mes (2 usuarios), Profesional Bs 750 (5 usuarios), Completo Bs 1.500, Empresa Bs 2.900. `pricing.ts` → chatbot Bs 390/mes sin instalación, usuario extra Bs 70/mes.

**Para 3 usuarios el plan de entrada de Onia cuesta Bs 390** (320 + 70 del tercer usuario).

### Contra facturadores: Onia está 2 a 4 veces caro

| | Bs/mes 3 usuarios | Onia vs |
|---|---|---|
| Sintic Cloud Básico | 85 | **4,6x** |
| Growing Cloud Básico | 100 | **3,9x** |
| Sintic MonoBusiness Negocio | 200 | **2,0x** |
| Sinergya CODEX Plus | 208 | **1,9x** |
| Xmart Facturación | 236 | **1,7x** |
| **ONIA Básico (3 usuarios)** | **390** | — |

### Contra ERP con SIAT: Onia está barato

| | Bs/mes | Pago inicial | Onia vs |
|---|---|---|---|
| **ONIA Básico** | 390 | **0** | — |
| **ONIA Profesional** (5 usuarios) | 750 | **0** | — |
| CUCU Odoo Junior | 720 | **4.500** | Onia Pro empata en mensual y ahorra Bs 4.500 de entrada |
| Odoo Custom (el que sí factura) | 483 | **11.564** (Success Pack mínimo) | Onia Pro cuesta más al mes y Bs 11.564 menos al arrancar |
| Doctocliq Avanzado (dental) | 1.739 | 0 | **4,5x Onia Básico**, y no factura SIAT |

**El veredicto, sin adjetivos: el precio no está mal. El encuadre sí.**

Bs 390 leído como "facturación" es 3,9x el piso del mercado. Bs 390 leído como "el sistema del rubro con facturación adentro" es la mitad de CUCU y un cuarto de Doctocliq, sin pago inicial. **El mismo número gana o pierde según con qué lo compare el cliente**, y hoy nada del material fuerza la comparación correcta.

### El chatbot está caro contra el ancla local

Bs 390 vs Xmart QR Bs 177 (2,2x) y Xmart Meta API Bs 296 (1,3x). Xmart es boliviano, cobra al oficial del BCB, con QR local. Contra ManyChat (Bs 461 + USD 25 por asiento), Wati (Bs 698) y todo lo demás, Bs 390 está bien. **El competidor a mirar es Xmart, no ManyChat.**

### Dos defectos de estructura, no de nivel

1. **Cobrar Bs 70 por usuario es el único eje donde Onia se comporta como el extranjero.** Ningún local cobra por cabeza: Growing Cloud da usuarios ilimitados, Sintic no cobra asientos, CUCU no menciona usuarios, Chicha cobra por número de WhatsApp, Xmart por canal. CODEX es el único que escalona, y por bloques. El mercado boliviano tarifa por **facturas, sucursales, productos o canales** — no por gente. El cargo de Bs 70 convierte un "Bs 320" competitivo en un "Bs 390" que el cliente lee como letra chica.

2. **El SIAT en la cabeza del cliente es pago único, no mensualidad.** Sintic publica librería SIAT Bs 850, módulo Bs 1.100–1.250, gateway Bs 1.800, y su add-on SIAT sobre POS a Bs 1.200 una vez. El copy de su módulo Odoo dice textual que evitar intermediarios "no incurre en costos extras, mensuales o anuales". **El competidor local ya está vendiendo el argumento anti-suscripción para la parte fiscal.** Si Onia vende "facturación por Bs X al mes para siempre", pelea contra un ancla de Bs 1.200 pagados una vez.

---

## 3. La devaluación, en números

### El daño real: +70%, y no lo produjo ningún proveedor

USD 6,96 → 11,83 = **+69,97%**. El extranjero no tocó su lista y aun así se encareció así:

| Proveedor | Etiqueta (sin cambios) | Bs/mes a 6,96 | Bs/mes a 11,83 | **Sobrecosto/año** |
|---|---|---|---|---|
| Doctocliq Avanzado, 3 profesionales | USD 147 | 1.023 | **1.739** | **+Bs 8.591** |
| Zoho One flexible, 3 usuarios | USD 270 | 1.879 | **3.194** | +Bs 15.780 |
| Botmaker Standard | USD 149 | 1.037 | **1.763** | +Bs 8.708 |
| Respond.io Starter | USD 99 | 689 | **1.171** | +Bs 5.785 |
| Wati Growth | USD 59 | 411 | **698** | +Bs 3.449 |
| ManyChat Pro | USD 39 | 271 | **461** | +Bs 2.280 |
| Siigo/Contífico Plus | USD 591/año | 343/mes | **583/mes** | +Bs 2.880 |

El caso Doctocliq es el que se cuenta: **una clínica de 3 dentistas paga hoy Bs 716 más por mes que hace dos años por exactamente el mismo software** — Bs 8.591 al año, y encima ese software no le resuelve el SIAT, que es lo obligatorio.

### 🔴 Corrección obligatoria: la fricción de tarjeta internacional ya NO existe

El brief dice que el boliviano necesita tarjeta internacional o dólares racionados. **Eso dejó de ser cierto en abril de 2026**: ASFI/MEFP levantaron las restricciones de tres años — crédito sin límite adicional según capacidad de pago, débito con piso habilitado de USD 500/mes para compras y plataformas del exterior.

**No verificado en fuente primaria** (la resolución en asfi.gob.bo dio ECONNRESET), sí en titulares de MEFP, ASFI, Infobae y Bloomberg Línea del 07-abr-2026. **Hasta confirmarlo, "el boliviano no puede pagarle a un proveedor extranjero" queda PROHIBIDO en material de cliente.** Es el tipo de afirmación que un dentista con tarjeta Visa desmiente en la demo, y ahí se cae todo lo demás que dijimos.

### Contra los locales, la ventaja cambiaria es CERO

Growing Cloud, Sintic, Sinergya, CUCU, Chicha, Xmart y Rimay (en la landing) cobran en bolivianos. Usar el argumento del dólar contra ellos es un error que el cliente detecta.

**Peor: Sintic se abarató en términos reales.** Sus Bs 200 nominales congelados desde 2019 pasaron de USD 28,74 a **USD 16,91**. El piso del mercado local, medido en dólares, cayó 41%.

### Lo que SÍ es ventaja, y es más chico de lo que dice el brief

**Certeza de precio, no acceso a divisas.** Un SaaS en USD tiene mensualidad flotante en bolivianos: Xmart lo dice explícito, cobra "al tipo de cambio del día". Si el oficial pasa de 11,83 a 13,00, ese cliente paga ~10% más sin que nadie le cambie el plan ni le avise. Un precio de Onia clavado en Bs es presupuestable.

Ejemplo cotizable: **USD 100/mes hoy son Bs 1.183. Si el oficial toca 13,00, son Bs 1.300 — Bs 1.404 más por año, por nada.**

Y un caso puntual atacable: **Rimay convierte a 6,96 en su checkout.** Su plan Professional de USD 79 le muestra al cliente Bs 550 y le cuesta Bs 935 reales. Bs 385/mes de diferencia oculta. Vale saberlo; no vale construir el pitch encima, porque se les corrige solo.

---

## 4. Recomendación de precio

Antes de los números, lo que estas recomendaciones **no** son: no hay ningún cliente pagando, así que ninguna es "el precio que el mercado validó". Son el precio defendible contra la competencia relevada. La validación llega con los primeros tres clientes, no antes.

### 4.1 — Plan de entrada: **Bs 320/mes, hasta 3 usuarios incluidos**

Mantener el número. **Eliminar el cargo de Bs 70 hasta el tercer usuario.**

Por qué: hoy el precio real de entrada es Bs 390 y lo comparable del mercado es Bs 320. **Ningún competidor local cobra por cabeza.** Cobrar Bs 70 al tercer empleado nos hace parecer Doctocliq justo cuando el argumento es que no somos Doctocliq, y se pierden Bs 70 a cambio de la peor objeción posible en una demo ("¿y si sumo a la recepcionista?"). El cargo por usuario se conserva a partir del cuarto.

Costo: Bs 70/mes por cliente que llegue a 3 usuarios. Beneficio: el precio de portada baja 18% sin tocar ningún plan.

### 4.2 — Plan medio: **Bs 750/mes, sin cambios**

Es el número correcto y el argumento está armado: **CUCU cobra Bs 720/mes + Bs 4.500 de pago inicial. Odoo Custom sale Bs 483/mes pero arranca con Bs 11.564 de implementación.** Onia Profesional entra a Bs 750 con Bs 0 de entrada.

El diferencial que hay que decir en voz alta y hoy no se dice: **cero pago inicial**. Sintic pide Bs 1.900, CUCU Bs 4.500, CUCU API Bs 2.800, Odoo Bs 11.564. Ese es un argumento de flujo de caja que le importa más a un negocio chico que Bs 30/mes de diferencia.

### 4.3 — Chatbot: **Bs 390/mes, condicionado**

Se sostiene **si va vendido con la plataforma**. Contra ManyChat (Bs 461 + USD 25/asiento), Wati (Bs 698) y Chatwoot Cloud (Bs 674) está bien puesto.

**No se sostiene vendido suelto contra Xmart** (Bs 177 QR / Bs 296 Meta API, boliviano, sin instalación). Ahí Onia está 1,3x a 2,2x arriba y la respuesta tiene que estar preparada: la ruta QR de Xmart **no es la API oficial de Meta** y arrastra riesgo de bloqueo del número; su ruta oficial cuesta Bs 296 + Bs 414 de integración y no trae ni bandeja ni sistema.

**Lo urgente no es el número, es octubre.** El 1-oct-2026 Meta termina las respuestas gratis dentro de la ventana de servicio de 24 h: **cada respuesta del bot pasa a cobrarse** al precio de utility del país. Con la tarifa de hoy, un cliente con 300 conversaciones/mes y 5 respuestas del bot por conversación suma **Bs 200–231/mes que hoy son cero** — sobre una mensualidad de Bs 390 eso es **+50% en la factura total del cliente**, por algo que no depende de Onia.

Tres decisiones que hay que tomar antes del 1-sep (cuando Meta publica las tarifas finales):
1. Cómo se comunica el cambio a los clientes que se firmen en septiembre. Si se firma sin decirlo, en octubre hay una conversación fea.
2. Si el modelo sigue siendo pass-through puro (el cliente le paga a Meta directo) o si Onia absorbe un tramo. Pass-through es el modelo de 360dialog, que lo publicita como "sin markup"; Botmaker cobra 20% encima y Zenvia revende con el margen escondido. **La transparencia sobre Meta es el argumento más fuerte que hoy no se está usando.**
3. Verificar que la WABA de Onia tenga método de pago activo antes del **30-sep-2026** o Meta deja de entregar mensajes facturables. Faltan 33 días.

### 4.4 — Lo que NO puedo recomendar con fundamento

**No puedo fijar el precio de la parte fiscal (SIAT) hasta saber si el Portal Web del SIN es gratuito.** Fuentes secundarias dicen que la modalidad Portal Web en Línea es gratis para el Régimen General; la página oficial confirma que la modalidad existe pero **no dice si cuesta, ni sus límites**. Si es gratis sin tope relevante, el piso del mercado no es Bs 85–100/mes: es **cero**, y todo el pitch fiscal deja de ser "te damos facturación" y pasa a ser "te sacamos el doble tipeo entre tu sistema y el portal". Eso cambia el argumento entero, no el número. **Cerrarlo es P0 y es una tarde de trabajo en el SIN.**

**No puedo recomendar subir ningún precio.** Con cero clientes pagando no hay un solo dato de disposición a pagar. Cualquier suba sería un número elegido a dedo.

**SÍ se puede comparar contra Emizor, y la comparación es favorable.** ⚠️ Acá decía que
Emizor "no publica un solo número" y que era *el dato que más falta en todo el relevamiento*.
**Era falso**: el número está publicado desde 2022 y sólo dejó de estar a la vista cuando la
página empezó a dar 404. Verificado el 2026-08-30 (detalle en la tabla 1.a).

- **Onia Básico Bs 320 entra por debajo del piso de Emizor** (PYME Bs 580) — y por debajo con
  margen: 45% menos. La comparación de arriba de la escalera también cierra: **Enterprise
  Bs 2.900 vs CORPORATIVO Bs 3.537**. En el medio Emizor gana un tramo: **EMPRESA Bs 1.171
  queda entre Profesional (750) y Clínica (1.500)**.
- **El argumento más fuerte no es el precio de lista, es la moneda.** Emizor cobra en USD y
  **no tocó su lista en 2 años y 5 meses**: mismos 49/99/299 en nov-2022 y abr-2025. Pero el
  dólar pasó de 6,96 a 11,83, así que **su cliente boliviano paga hoy 70% más en bolivianos
  sin que ellos hayan subido un centavo** — el plan PYME pasó de Bs 341 a Bs 580. Onia cobra
  en Bs: el mismo número el mes que viene. Eso se dice así, sin adjetivos, y se sostiene solo.
- **El desembolso inicial pega más que la mensualidad.** El plan PYME **sólo se vende
  semestral**: son **USD 294 ≈ Bs 3.478 por adelantado** contra Bs 320 al mes. Para el negocio
  chico que es nuestro comprador, esa es la barrera real, no los Bs 260 de diferencia mensual.
- **Lo honesto de la otra vereda**, que hay que saber antes de que lo diga el cliente: Emizor
  da facturas, tipos de documento, sucursales **y usuarios ilimitados**, sin costo de alta, y
  está certificado por el SIN hace años. Es facturación sola — sin agenda, sin inventario,
  sin bandeja ni bot — pero en su carril no tiene jaulas. **Contra Emizor no se compite por
  precio de facturación: se compite por todo lo demás que viene en el mismo plan.**

### 4.5 — Un movimiento que no cuesta plata

**Publicar el precio es diferencial en este mercado.** Citalo, Wirevet y LiveConnect venden por formulario y WhatsApp sin mostrar un número. **Emizor es otro caso:** publicó 49/99/299 durante años y hoy su página de precios da 404 — el número existe, dejó de estar a la vista. La mitad del mercado esconde el precio. Onia ya lo publica; conviene decirlo explícitamente en la landing, no darlo por sentado.

---

## 5. Qué hacer con las listas contradictorias

El diagnóstico del 2026-08-15 hablaba de cuatro precios vivos del chatbot. **Hoy hay seis, y cinco son falsos.** El problema empeoró.

### Chatbot — seis precios vivos

| Precio | Dónde | Estado |
|---|---|---|
| **Bs 390/mes, sin instalación** | `pricing.ts` | ✅ Canónico |
| Bs 1.500 inst. + 1.490/mes | `/vendedores/cotizador` | 🔴 3,8x el real, indexable |
| Bs 1.500+490 / 2.900+890 / 5.900+1.890 | mismo archivo del cotizador | 🔴 Tres niveles más, hasta 20x |
| Bs 650 inst. + 350/mes | onia-center + catálogo de propuestas | 🔴 Retirado el 09-jul |
| "desde Bs 990 setup" | catálogo de propuestas, §3 | 🔴 Contradice a §4 del mismo doc |
| incluido en Empresa Bs 1.990 | `onia-core/business-tiers.json` | 🔴 Regala el add-on |

### Planes — cinco escaleras simultáneas

Canónica 320/750/1.500/2.900 · core 390/890/1.990 · "Onia Comercio" 350/530/800/1.250 · fundador 400/675 y 700/1.350 · tiers en USD 490/790/1.190.

**Tres de esas escaleras son infacturables.** El checkout valida contra `subscription-plans.ts` con tolerancia Bs 0,01: cotizar Bs 530 significa que el cliente no puede pagar. Es el mismo defecto que ya mató a los tres niveles de chatbot.

Y una trampa concreta: **Bs 390 significa el chatbot en `pricing.ts` y un plan completo en `business-tiers.json`.** Dos productos, mismo número, dos archivos.

### Orden de ejecución

**P0 — hoy, no mañana**

1. **Bajar o corregir `/vendedores/cotizador`.** Un archivo con cuatro precios muertos de chatbot, que además resucita el markup sobre Meta que `pricing.ts` prohíbe con todas las letras. Es una página pública e indexable, para un puesto de vendedor que no existe. **La decisión de bajarla es de Sergio y hace falta ahora.** Verificar mirando la pantalla si sigue servida: es un dato heredado y nadie lo contó de nuevo.
2. ✅ **HECHO — "Inventario avanzado desde Bs 180/mes" salió de la landing.** Estaba servido en vivo en la portada y en `/precios`, las dos alimentadas por la misma fila de `ADDONS` en `web-factory/apps/onia-platform/src/lib/pricing.ts`. Se sacó la fila y el inventario pasó al `incluye` del plan Básico (lo heredan Pro y Full): la capacidad existe y no se cobra, así que se cuenta como valor incluido en vez de dejar el hueco. Barridos también `historial/ONIA_PRICING_2026.md`, `historial/ONIA_QUE_SE_VENDE_Y_A_QUE_PRECIO.md` §4.3, `ONIA_PSICOLOGIA_PRECIOS_COMPETENCIA.md`, `ONIA_VENDOR_MANUAL_2026.md`, `historial/ONIA_VENDOR_SALES_PLAYBOOK_2026.md`, `ONIA_VERTICAL_SERVICE_MATRIX_2026.md` y `PROJECTS_ORCHESTRATION.md`. Guarda: `scripts/venta-honestidad.test.mjs`.
3. **Sacar "Insumos dental Bs 80/mes".** No existe en el código y sigue cotizable en dos superficies.

**P1 — esta semana**

4. `onia-center/source.ts`: chatbot 650+350 → 390; escalera Onia Comercio → borrar.
5. `ONIA_CATALOGO_PRECIOS_2026.md`: borrar la línea 5 que se autodeclara fuente de verdad (contradice a CLAUDE.md), corregir los dos precios de chatbot contradictorios, borrar la escalera 350/530/800/1.250.
6. `WHATSAPP_ADDON_COSTS.md`: tiene el aviso correcto arriba y 80 líneas calculando márgenes contra el precio muerto. Recalcular o marcar el cuerpo entero como histórico.
7. Webs: la línea vieja 790/1.500/2.900 sigue viva en seis lugares, incluido el one-pager que Sergio usa en la calle (`sales-kit/01-ONE-PAGER-OFERTA.md:54`). La ratificada es 2.000/4.500/desde 7.500. **Vender una Web Profesional a Bs 1.500 en vez de Bs 4.500 es un tercio del precio.**
8. Propuestas HTML vivas: `propuesta-dentalgest.html` con Bs 490/mes huérfano; `propuesta-dental-smile-*.html` con Bs 1.490.

**P2 — la causa raíz**

9. **El precio no vive en dos archivos como dice CLAUDE.md: vive en seis definiciones de código independientes.** Dos de ellas (`chatbot-precios.ts:1` y el catálogo de propuestas) se autodeclaran "fuente única" compitiendo con la regla. Las que hoy coinciden lo hacen **por disciplina humana, no por import**. Mientras el precio se copie a mano entre repos, cada corrección se hace en una superficie y se olvida en cinco — que es exactamente lo que pasó el 21 de agosto. La solución es un paquete compartido o un JSON generado, no otra ronda de grep.
10. Los tiers en USD de `business-tiers.json` (490/790/1.190/mes) se encarecieron 70% en bolivianos sin que nadie los tocara. O se pasan a Bs o se les pone cláusula de ajuste explícita.
11. Hay **81 docs sin fecha** en `hermes-content/docs/` que mencionan montos en Bs. Por la regla del repo, un archivo sin fecha se lee como fuente de verdad. El conteo del 15-ago era 95: **el orden de magnitud no bajó.**

---

## 6. Lo que no se pudo verificar

**Bloquea decisiones de precio:**

- 🔴 **Si el Portal Web del SIN es realmente gratuito, y con qué límites.** El dato competitivo más importante de todo el relevamiento. Fuentes secundarias dicen que sí; la página oficial confirma que la modalidad existe pero no publica costo, tope de facturas ni elegibilidad. Si es gratis, el piso del mercado es cero, no Bs 85.
- 🟡 **Emizor: si los USD 49/99/299 siguen vigentes hoy.** ⚠️ Acá decía "no hay ni un número" y **estaba mal**: el número está y se verificó el 2026-08-30. Lo que queda abierto es más chico: `/precios-2` da 404 en vivo y **la última captura es del 27-abr-2025**, o sea 16 meses de antigüedad. Es el mejor dato disponible, no el precio de hoy confirmado. Para cerrarlo hace falta una cotización por su formulario. **Lección:** un 404 en `/precios` no prueba que no publiquen precio — prueba que esa ruta no responde.
- 🔴 **Tarifa de Meta para Bolivia.** Las dos fuentes halladas se contradicen (marketing USD 0,0851 vs 0,0740; utility USD 0,0130 vs 0,0113) y **ninguna es el rate card oficial**. Meta confirma que Bolivia está en "Rest of Latin America" pero sirve los números como descarga por moneda que no se pudo bajar. Antes de poner un número en material de cliente, bajar el rate card desde el WhatsApp Business Manager.
- 🔴 **Tarifa del mensaje de servicio post 1-oct-2026.** Meta la publica el 1-sep-2026. Los Bs 200–231/mes de la sección 4.3 son una **ilustración** con la tarifa utility actual, no un dato.
- 🔴 **El levantamiento de restricciones de tarjeta internacional (abr-2026).** Confirmado por titulares de MEFP, ASFI, Infobae y Bloomberg Línea; la resolución primaria no se pudo abrir. **Hasta confirmarla, el argumento "no podés pagarle a un extranjero" no se usa.**

**Debilita comparaciones:**

- **Sinergya CODEX publica dos listas vivas y contradictorias**: Bs 2.500/año en sinergyasoftware.com vs Bs 129/mes con usuarios ilimitados en codexerp.software, mismo teléfono. Y su tabla dice que el plan Plus (más caro) trae **menos** documentos/mes que el Core — errata evidente. No usar sus límites como dato firme.
- **Zoho One**: su página oficial sirve el precio vacío en el HTML, cuatro rutas probadas. Los USD 90/37 vienen de un blog. No usar en material comercial.
- **Bind ERP**: bloquea la lectura con anti-bot. Las secundarias dan siete precios distintos.
- **Siigo Colombia**: no publica precio.
- **Landbot**: el add-on de WhatsApp no tiene precio publicado, así que su factura total no se puede cerrar.
- **Chatwoot Cloud**: solo publica el precio facturado anual. El mensual es inferencia.
- **Defontana**: implementación existe, monto no publicado. Su conversión encadena UF→CLP→USD→Bs.
- **CUCU**: no publica cuántos usuarios incluye. La comparación "por 3 usuarios" no es estricta.
- **Sintic MonoBusiness**: no declara límite de usuarios. El cálculo de 3 usuarios asume que no hay tope, y eso no está confirmado.
- **Chicha y Rimay**: precios publicados, ningún indicio de que alguien los esté pagando. Chicha directamente no puede recibir un lead.

**Del lado de Onia:**

- **No se verificó mirando la pantalla si `/vendedores/cotizador` y `/vendedores/webs` siguen servidas en producción.** La lente interna fue solo-lectura sobre el repo. CLAUDE.md las declara "superficie huérfana viva", pero es un dato heredado. **Si están caídas, el hallazgo P0 número 1 baja de gravedad.** Hay que abrirlas.
- ✅ Verificado después: el "Inventario avanzado · Desde Bs 180/mes" **sí estaba renderizado** en el HTML servido de `onia.com.bo/` y de `onia.com.bo/precios` (bloque `sitio_offerItem`), no solo en el código. Ya se sacó de la fuente; falta el deploy para que baje de producción.
- Se abrieron 2 de ~20 HTML de propuesta. Puede haber más precios muertos firmables.
- No se revisaron los 117 docs de `historial/` (por regla no son fuente de verdad) ni se leyeron los 81 docs sin fecha completos — solo los que matchearon los patrones de grep.

**Dos trampas de Google que hay que no pisar:**

- **facturacion-facil.com.bo** aparece primero para "facturación electrónica Bolivia" y publica $199/$599/$1.499. Su contenido es **mexicano** (CFDI, DIOT, complemento REP 2.0, addendas, Contpaq). Nada de eso existe en el régimen boliviano. **Si alguien lo cita como benchmark local, el número es falso.**
- **yo-facturo.com/bo** rankea bien para SIAT y publica precios en **pesos argentinos**, declarando que su soporte boliviano está en lista de espera. No es competidor vivo hoy — pero llega con SEO ya posicionado, así que conviene monitorearlo.

---

## Relevamiento 28/29-sep-2026: cómo cobra la competencia y dónde queda Onia

> Traído de `research/onia-1.0-29sep/PAQUETE_LLM_CONCLUSION.md` §4 (un tema, un archivo: pedido de la sesión de Mercado, 30-sep). Estudios por dentro del 29-sep, con cuenta de Sergio Urcullo: `research/onia-1.0-29sep/COMPETENCIA_SENDYPRO.md`, `COMPETENCIA_MANYCHAT.md`, `COMPETENCIA_DOCTOCLIQ.md` (si ya está) y el público `COMPETENCIA_BOTS_WHATSAPP.md`. Los precios de Onia NO salen de acá: se leen de `subscription-plans.ts` y `pricing.ts`.

| Quién | Cómo cobra (oficial, 28-sep-2026) | IA | Meta | Gestión clínica |
|---|---|---|---|---|
| Kommo | USD 25-45 por usuario al mes, compromiso de 6 meses | Créditos (~150 respuestas por usuario en Pro) | A costo, en el Billing Hub de Meta | No |
| Respond.io | USD 79-279 | Créditos desde Growth | Aparte | No |
| Leadsales | USD 97-247 + Lead Agent desde 87 | Add-on | No lo publica | No |
| HighLevel | USD 97 + AI Employee 50/97 + WhatsApp 10 = ~USD 204 por un negocio | Add-on | Revendible con recargo | No |
| Botmaker | USD 149-499 por conversaciones + 99 único | Incluida | +20% en notificaciones | No |
| Manychat | USD 14-139 por contactos | Desde Pro | Facturado por Manychat [tercero] | No |
| Dapta | USD 99-1.499 en créditos | Incluida | No lo publica | No |
| Lety.ai | USD 97-497, **solo agencias** | Tokens al costo; la agencia recarga | Al costo | No |
| Dentalink / Medilink | A cotizar; Contact Center IA por demo | Sin precio | No lo publica | **Sí** |
| AgendaPro (Julia) | USD 9-199 + WhatsApp desde 7; Julia por demo | Sin precio | Aparte | **Sí** (estética) |
| Doctocliq (Soyla) | USD 0-49; IA como add-on sin precio | Sin precio | Por país | **Sí** |
| **Onia** | **S ~USD 83 · M ~USD 113** (a 11,37), por negocio | Cupo en conversaciones | Aparte, con techo en Bs | **Sí** |

Fuentes: kommo.com/pricing, respond.io/pricing, leadsales.io/precios, gohighlevel.com/pricing, botmaker.com/es/precios, manychat.com/pricing, dapta.ai/pricing, lety.ai/pricing, softwaredentalink.com/es/planes, agendapro.com/es/planes, doctocliq.com/planes-y-precios. Treble.ai tiene la página de precios con contraseña; en Wati los montos no se renderizaron.

**Lectura** [D]:
- Nadie mete a Meta dentro de la mensualidad. Onia, como Tech Provider, ya cobra igual que el mercado.
- Solo la capa conversacional con IA de un generalista ya cuesta más que Onia S (Kommo con 3 usuarios USD 135, HighLevel USD 204, Botmaker USD 149), y ninguno trae gestión clínica.
- Los verticales de clínica (Dentalink, AgendaPro) venden la IA por demo, sin precio público, y configuran ellos. Onia puede ganar mostrando el precio.
- **El precio no es el problema; la brecha es de producto.** Todos responden con un LLM y Dentalink y AgendaPro agendan dentro del chat. Onia hoy responde con guion y manda un link.
- **Ojo con la comparación:** tu cliente real no compara contra Kommo. Compara contra Excel + WhatsApp gratis + su recepcionista. Eso solo lo contestan entrevistas (§7, punto 8).

---
