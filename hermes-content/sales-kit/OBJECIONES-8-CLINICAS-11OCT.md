# LISTA PARA MOSTRAR: objeciones

> **11-oct-2026 · Ventas y pauta · encargo de la MADRE MARKETING.** **BORRADOR para Sergio Urcullo: nada se envió, nadie fue contactado.** Respuestas de usted, cortas, a las 5 objeciones más probables de las clínicas que contesten el primer mensaje (`PRIMER-MENSAJE-8-CLINICAS-11OCT.md`). Cada frase se cruzó con `ONIA_CATALOGO_DE_VENTA.md` y con las filas de `ONIA_PROMESA_VS_PRODUCTO.md`; **lo que no está en ✅ queda marcado y no se dice hasta que lo esté**. Este archivo lo genera `.claude/skills/onia-ventas-pauta/scripts/objeciones-8-clinicas.mjs` desde su `.json`.
> **La factura SIAT no se promete ni se nombra como futura** (catálogo §7). Los **precios se leen de `onia-platform`** al generar, no se escriben a mano.

## 0. Resumen: qué se puede decir hoy y qué espera

| # | Objeción | Se puede decir |
|---|---|---|
| 1 | ¿Cuánto cuesta? | ✅ se puede decir hoy |
| 2 | Ya tengo un sistema / llevo todo en un cuaderno | ✅ se puede decir hoy |
| 3 | No tengo tiempo | ✅ se puede decir hoy |
| 4 | ¿Emite factura? | ✅ se puede decir hoy |
| 5 | ¿Mis datos dónde quedan? | ✅ se puede decir hoy |

## 1. Las 5 respuestas

### 1. «¿Cuánto cuesta?»

**Hoy (solo lo que está en ✅):**

> Depende de cuántas personas lo usen, entre profesionales y recepción. Con {{N}} personas le corresponde el plan {{PLAN}}, Bs {{PRECIO}} al mes: precio final en bolivianos, con impuestos incluidos, sin costo de implementación y sin contrato de permanencia. Y puede probarlo 14 días sin tarjeta.

- **Se puede decir:** ✅ se puede decir hoy. Filas de `ONIA_PROMESA_VS_PRODUCTO.md`: K-01 ✅ visto · K-03 ✅ visto · K-04 ✅ visto · K-05 ✅ visto · K-07 ✅ visto · A-04 ✅ visto. Catálogo: §3 (planes y prueba).
- **Cómo se usa:** Se cotiza UN plan: el más chico que alcanza para la cantidad de personas que dijo en la pregunta 1. No se abre con la lista y la tarifa no se baja. La tarjeta de Completo en /precios lo describe con el agente de WhatsApp (K-13 ❌): no se lo describe así, se dice solo plan y precio.
- **No se dice:** descuentos; el precio del agente de WhatsApp (J-07 ❌); que Completo incluye el agente (K-13 ❌); «gratis» a secas: la prueba son 14 días y termina.

**Qué se pone en los marcadores** (precios leídos de `onia-platform` `lib/subscription-plans.ts`, nombres de `lib/pricing.ts`, usuarios de `lib/plan-catalogo.ts`):

| Si dice… | {{N}} | {{PLAN}} | {{PRECIO}} (Bs/mes) | Tope de usuarios del plan |
|---|---|---|---|---|
| hasta 4 personas | 4 | Crece | 550 | 4 |
| 5 personas | 5 | Profesional | 890 | 5 |
| 6 o más personas | 6 | Completo | 1.290 | sin tope |

⚠️ **Crece = 4 usuarios** está en el código publicado; el catálogo anota que el release de producción pudo traer 3: antes de cotizar Crece para 4 personas, mirar `onia.com.bo/precios` ese día.

### 2. «Ya tengo un sistema / llevo todo en un cuaderno»

**Hoy (solo lo que está en ✅):**

> Entiendo, y no le pido que lo cambie. Si le interesa, puede probarlo 14 días sin tarjeta y sin costo de implementación, y usted decide si le sirve.
>
> *Pregunta de vuelta:* ¿Cómo lleva hoy la agenda y las fichas: cuaderno, Excel u otro sistema?

**Se agrega recién cuando G-04 (⬜ sin verificar) · G-01 (⬜ sin verificar):**

> Lo que le mostraría es una sola cosa: cada mañana, a quién escribirle y con qué mensaje, y nada sale sin que usted lo apruebe.

- **Se puede decir:** ✅ se puede decir hoy. Filas de `ONIA_PROMESA_VS_PRODUCTO.md`: A-04 ✅ visto · K-04 ✅ visto. Catálogo: §3 (prueba de 14 días); §8 frase 3 para la parte de «después».
- **Cómo se usa:** Sin hablar mal de su sistema ni compararlo: la competencia no se nombra. No se dice «migración» (puede leerse como «nadie me pasa los datos»: migrar datos es un onboarding cotizado, catálogo §5). La pregunta de vuelta es la 3 de ONIA_CLIENTE_IDEAL.md §9. «Mostrar» necesita la cuenta demo con datos (L-05 ❌): por eso va en «después».
- **No se dice:** que se importa su Excel o su sistema solo (no hay fila que lo sostenga); nada de la competencia; «reemplaza a su sistema».

### 3. «No tengo tiempo»

**Hoy (solo lo que está en ✅):**

> Lo entiendo, por eso no le pido tiempo ahora. Dígame qué día y a qué hora le queda mejor y lo conversamos.

**Se agrega recién cuando L-04 (🟡 a medias) · L-05 (❌ no se puede prometer hoy):**

> Y se lo muestro funcionando, sin compromiso; si no le sirve, se lo digo ahí mismo.

- **Se puede decir:** ✅ se puede decir hoy. Filas de `ONIA_PROMESA_VS_PRODUCTO.md`: . Catálogo: Ninguna afirmación de producto en la versión de hoy; «después»: L-04 de ONIA_PROMESA_VS_PRODUCTO.md (demo sin compromiso, duración sin decidir) y L-05 (demo con cuenta de ejemplo ❌).
- **Cómo se usa:** No se nombra una duración hasta que Sergio Urcullo decida 20 o 30 minutos (L-04). Mostrarlo necesita la cuenta demo con datos; sin ella, no se agenda.
- **No se dice:** minutos de llamada; «dos minutos» para crear la cuenta (sin fila que lo sostenga); «una clínica de ejemplo» (L-05 ❌).

### 4. «¿Emite factura?»

**Hoy (solo lo que está en ✅):**

> Onia no emite la factura fiscal de sus cobros a pacientes: esa la sigue emitiendo como lo hace ahora.
>
> *Si insiste:* Si para usted es imprescindible que el mismo sistema la emita, no le calza y prefiero decírselo ahora.

**Se agrega recién cuando E-01 (⬜ sin verificar):**

> Lo que sí hace es dejar cada cobro registrado, con su saldo.

- **Se puede decir:** ✅ se puede decir hoy. Filas de `ONIA_PROMESA_VS_PRODUCTO.md`: . Catálogo: §7 (la factura electrónica SIAT no se promete ni se nombra como futura); §4 «Cobros y facturas ✅ (la factura del SIAT, no)».
- **Cómo se usa:** Respuesta directa y sin la palabra «hoy» (abriría una factura futura). No se dice «muy pronto», «estamos en certificación» ni se nombra el SIAT como plan: la venta no exhibe obra (CLAUDE.md). Ojo: el pie de la web dice «EMITE FACTURA» (E-15 🟡): es el dato fiscal de la empresa por la factura de su suscripción, no la factura a sus pacientes; si el prospecto lo señala, se aclara eso.
- **No se dice:** que Onia emite o emitirá la factura SIAT; «estamos en certificación» o «muy pronto»; que cumple la RND de facturación.

### 5. «¿Mis datos dónde quedan?»

**Hoy (solo lo que está en ✅):**

> Quedan en un servidor privado administrado por Onia, que hoy está en Estados Unidos. Los datos son suyos: no se venden ni se usan para entrenar modelos de IA. El tráfico pasa por Cloudflare y algunas funciones usan proveedores externos, como OpenAI; todo está en la política de privacidad, en onia.com.bo/privacidad.
>
> *Si insiste:* La conexión entre su navegador y la plataforma va cifrada (HTTPS). El cifrado del disco en reposo y las certificaciones como ISO 27001 no los afirmamos porque hoy no los tenemos: prefiero decírselo.

**Se agrega recién cuando aislamiento por clínica en producción (RLS: las migraciones no lo traen, skill onia-db; verificarlo en vivo) · copias de seguridad diarias: hoy están solo en el disco del VPS y la restauración nunca se probó (ONIA_PLAN_1.0_Y_CAJA.md punto 4, «A medias»):**

> Cada clínica ve solo lo suyo y hay copias de seguridad diarias.

- **Se puede decir:** ✅ se puede decir hoy. Sale de la política de privacidad publicada (no hay fila en el doc de promesas): servidor privado de Onia, hoy en Estados Unidos (política de privacidad §4); Cloudflare por donde pasa el tráfico y proveedores externos como OpenAI (política §5). Filas de `ONIA_PROMESA_VS_PRODUCTO.md`: L-02 ✅ visto. Catálogo: Política de privacidad (web-factory/apps/onia-platform/src/content/legal/privacidad.md) §4 dónde viven, §7 seguridad, §8 retención.
- **Cómo se usa:** Es la verdad de la política, incluida la parte incómoda (Estados Unidos, proveedores externos, sin cifrado de disco ni certificaciones). «Cada clínica ve solo lo suyo» y «copias de seguridad diarias» NO se dicen hasta verificarlos en producción: están en «después».
- **No se dice:** «servidores en Bolivia»; «100 % seguro» o «certificado»; «cifrado total»; «copias de seguridad diarias» (hoy solo en el disco del VPS, restauración sin probar); que la IA no ve nada o que «nada sale del servidor» (la política lista a OpenAI, Cloudflare y Telegram).


## Verificación

- **Detector de promesas de la web:** 0 promesas en las 5 respuestas (con los 3 casos de precio), sus preguntas de vuelta, «si insiste» y «después» (lo exige scripts/objeciones-8-clinicas.test.mjs).
- **Revisor independiente (`haiku`, 11-oct):** primera pasada: 4 problemas de fondo y 2 observaciones. Las respuestas decían cosas sin ✅ (mostrarlo sin cuenta demo, «cada cobro registrado con su saldo» E-01, «cada mañana a quién escribirle» G-04), «hoy» abría una factura SIAT futura, y la de datos afirmaba «copias de seguridad diarias» (hoy solo en el disco del VPS, restauración sin probar; ONIA_PLAN_1.0_Y_CAJA.md punto 4) y omitía a los proveedores externos. → Cada respuesta se partió en «hoy» (solo filas ✅ o la política publicada) y «después» (cuando sus filas pasen a ✅); se sacó «hoy» de la de factura y «migración» de la de sistema. Segunda pasada sobre las versiones de hoy: 4 de 5 OK; la de datos decía «algunas funciones usan … Cloudflare», y Cloudflare es la red por donde pasa todo el tráfico → se corrigió; además se acotó «la factura fiscal de sus cobros a pacientes» (el pie de la web dice «EMITE FACTURA» por la factura de la suscripción, E-15 🟡) y «HTTPS» quedó como «entre su navegador y la plataforma». **Sin cerrar:** el revisor leyó documentos y código, no el producto en vivo; la tarjeta de Completo en /precios sigue describiéndolo con el agente de WhatsApp (K-13 ❌; es de Plataforma); no se verificó un override `SUBSCRIPTION_PRICE_*` en producción.
- **Pruebas automáticas** (`scripts/objeciones-8-clinicas.test.mjs`): precios y planes iguales a los de `onia-platform`; de usted; cortas; sin SIAT como promesa, sin duración de llamada, sin «ejemplo».


## 2. Qué depende de quién

| Qué | Quién |
|---|---|
| Elegir cuándo usarlas y con qué clínica | Sergio Urcullo |
| Decidir 20 o 30 minutos (L-04) antes de nombrar una duración | Sergio Urcullo |
| Cuenta demo con datos y verificar E-01, G-01, G-04 | Plataforma (12-oct) y Ventas y pauta |
| Confirmar «copias de seguridad diarias» con el log del respaldo del VPS | Quien tenga el VPS (la madre) |
