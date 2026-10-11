# LISTA PARA MOSTRAR: objeciones

> **11-oct-2026 · Ventas y pauta · encargo de la MADRE MARKETING.** **BORRADOR para Sergio Urcullo: nada se envió, nadie fue contactado.** Respuestas de usted, cortas, a las 5 objeciones más probables de las clínicas que contesten el primer mensaje (`PRIMER-MENSAJE-8-CLINICAS-11OCT.md`). Cada frase se cruzó con `ONIA_CATALOGO_DE_VENTA.md` y con las filas de `ONIA_PROMESA_VS_PRODUCTO.md`; **lo que no está en ✅ queda marcado y no se dice hasta que lo esté**. Este archivo lo genera `.claude/skills/onia-ventas-pauta/scripts/objeciones-8-clinicas.mjs` desde su `.json`.
> **La factura SIAT no se promete ni se nombra como futura** (catálogo §7). Los **precios se leen de `onia-platform`** al generar, no se escriben a mano.

## 0. Resumen: qué se puede decir hoy y qué espera

| # | Objeción | Se puede decir |
|---|---|---|
| 1 | ¿Cuánto cuesta? | ✅ se puede decir hoy |
| 2 | Ya tengo un sistema / llevo todo en un cuaderno | ⬜/🟡 después de la compuerta (G-04, G-01) |
| 3 | No tengo tiempo | ⬜/🟡 después de la compuerta (L-04) y datos sin fila |
| 4 | ¿Emite factura? | ⬜/🟡 después de la compuerta (E-01) |
| 5 | ¿Mis datos dónde quedan? | 🟡 en parte: las filas están en ✅, pero 3 datos no tienen fila (ver abajo) |

## 1. Las 5 respuestas

### 1. «¿Cuánto cuesta?»

> Depende de cuántas personas lo usen, entre profesionales y recepción. Con {{N}} personas le corresponde el plan {{PLAN}}, Bs {{PRECIO}} al mes: precio final en bolivianos, con impuestos incluidos, sin implementación ni migración y sin contrato de permanencia. Y puede probarlo 14 días sin tarjeta.

- **Se puede decir:** ✅ se puede decir hoy. Filas de `ONIA_PROMESA_VS_PRODUCTO.md`: K-01 ✅ visto · K-03 ✅ visto · K-04 ✅ visto · K-05 ✅ visto · K-07 ✅ visto · A-04 ✅ visto. Catálogo: §3 (planes y prueba).
- **Cómo se usa:** Se cotiza UN plan: el más chico que alcanza para la cantidad de personas que dijo en la pregunta 1. No se abre con la lista y la tarifa no se baja.
- **No se dice:** descuentos; el precio del agente de WhatsApp (J-07 ❌); que Completo incluye el agente (K-13 ❌); «gratis» a secas: la prueba son 14 días y termina.

**Qué se pone en los marcadores** (precios leídos de `onia-platform` `lib/subscription-plans.ts`, nombres de `lib/pricing.ts`, usuarios de `lib/plan-catalogo.ts`):

| Si dice… | {{N}} | {{PLAN}} | {{PRECIO}} (Bs/mes) | Tope de usuarios del plan |
|---|---|---|---|---|
| hasta 4 personas | 4 | Crece | 550 | 4 |
| 5 personas | 5 | Profesional | 890 | 5 |
| 6 o más personas | 6 | Completo | 1.290 | sin tope |

⚠️ **Crece = 4 usuarios** está en el código publicado; el catálogo anota que el release de producción pudo traer 3: antes de cotizar Crece para 4 personas, mirar `onia.com.bo/precios` ese día.

### 2. «Ya tengo un sistema / llevo todo en un cuaderno»

> Entiendo, y no le pido que lo cambie. Si le interesa, le muestro una sola cosa: cada mañana, a quién escribirle y con qué mensaje, para que usted decida si le sirve. Probarlo son 14 días sin tarjeta, sin implementación ni migración.
>
> *Pregunta de vuelta:* ¿Cómo lleva hoy la agenda y las fichas: cuaderno, Excel u otro sistema?

- **Se puede decir:** ⬜/🟡 después de la compuerta (G-04, G-01). Filas de `ONIA_PROMESA_VS_PRODUCTO.md`: A-04 ✅ visto · K-04 ✅ visto · G-04 ⬜ sin verificar · G-01 ⬜ sin verificar. Catálogo: §8 frase 3 (a quién escribirle, nada sale sin aprobación).
- **Cómo se usa:** Sin hablar mal de su sistema ni compararlo: la competencia no se nombra. La pregunta de vuelta es la 3 de ONIA_CLIENTE_IDEAL.md §9.
- **No se dice:** que se importa su Excel o su sistema solo (no hay fila que lo sostenga); nada de la competencia; «reemplaza a su sistema».

### 3. «No tengo tiempo»

> Lo entiendo, por eso no le pido tiempo ahora. Dígame qué día y a qué hora le queda mejor y se lo muestro, sin compromiso; si no le sirve, se lo digo ahí mismo.

- **Se puede decir:** ⬜/🟡 después de la compuerta (L-04) y datos sin fila. Sin fila en el doc de promesas: mostrarlo necesita la cuenta demo con datos. Filas de `ONIA_PROMESA_VS_PRODUCTO.md`: L-04 🟡 a medias. Catálogo: §1 (prueba sin tarjeta); L-04 de ONIA_PROMESA_VS_PRODUCTO.md (demo sin compromiso).
- **Cómo se usa:** No se nombra una duración hasta que Sergio Urcullo decida 20 o 30 minutos (L-04). Mostrarlo necesita la cuenta demo con datos; sin ella, no se agenda.
- **No se dice:** minutos de llamada; «dos minutos» para crear la cuenta (sin fila que lo sostenga); «una clínica de ejemplo» (L-05 ❌).

### 4. «¿Emite factura?»

> Hoy Onia no emite la factura fiscal: esa la sigue emitiendo como lo hace ahora. Lo que sí hace es dejar cada cobro registrado, con su saldo.
>
> *Si insiste:* Si para usted es imprescindible que el mismo sistema la emita, hoy no le calza y prefiero decírselo ahora.

- **Se puede decir:** ⬜/🟡 después de la compuerta (E-01). Filas de `ONIA_PROMESA_VS_PRODUCTO.md`: E-01 ⬜ sin verificar. Catálogo: §7 (la factura electrónica SIAT no se promete ni se nombra como futura).
- **Cómo se usa:** Respuesta directa y sin adornos. No se dice «muy pronto», «estamos en certificación» ni se nombra el SIAT como plan: la venta no exhibe obra (CLAUDE.md).
- **No se dice:** que Onia emite o emitirá la factura SIAT; «estamos en certificación» o «muy pronto»; que cumple la RND de facturación.

### 5. «¿Mis datos dónde quedan?»

> Quedan en un servidor privado administrado por Onia, que hoy está en Estados Unidos. Cada clínica ve solo lo suyo y hay copias de seguridad diarias. Los datos son suyos: no se venden ni se usan para entrenar IA, y está escrito en la política de privacidad, en onia.com.bo/privacidad.
>
> *Si insiste:* Viajan cifrados (HTTPS). El cifrado del disco en reposo y las certificaciones como ISO 27001 no los afirmamos porque hoy no los tenemos: prefiero decírselo.

- **Se puede decir:** 🟡 en parte: las filas están en ✅, pero 3 datos no tienen fila (ver abajo). Sin fila en el doc de promesas: servidor privado de Onia, hoy en Estados Unidos (política de privacidad §4); cada clínica ve solo lo suyo (política §7, aislamiento por fila); copias de seguridad diarias (política §7; confirmar con el log del respaldo). Filas de `ONIA_PROMESA_VS_PRODUCTO.md`: L-02 ✅ visto. Catálogo: Política de privacidad (web-factory/apps/onia-platform/src/content/legal/privacidad.md) §4 dónde viven, §7 seguridad, §8 retención.
- **Cómo se usa:** Es la verdad de la política, incluida la parte incómoda (Estados Unidos, sin cifrado de disco ni certificaciones). «Copias de seguridad diarias» sale de la política §7 y no tiene fila: confirmarlo con el log del respaldo en el VPS antes de decirlo.
- **No se dice:** «servidores en Bolivia»; «100 % seguro» o «certificado»; «cifrado total»; que la IA no ve nada (la política lista a OpenAI como subprocesador).


## Verificación

_Pendiente: detector de promesas de la web y revisor `haiku` independiente._


## 2. Qué depende de quién

| Qué | Quién |
|---|---|
| Elegir cuándo usarlas y con qué clínica | Sergio Urcullo |
| Decidir 20 o 30 minutos (L-04) antes de nombrar una duración | Sergio Urcullo |
| Cuenta demo con datos y verificar E-01, G-01, G-04 | Plataforma (12-oct) y Ventas y pauta |
| Confirmar «copias de seguridad diarias» con el log del respaldo del VPS | Quien tenga el VPS (la madre) |
