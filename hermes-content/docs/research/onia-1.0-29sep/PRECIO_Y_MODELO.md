# Precio y modelo: cierre

Para: Sergio Urcullo · 28-sep-2026 · solo lectura, sin gasto de API.

Etiquetas: **[O]** oficial (página del proveedor, 28-sep-2026) · **[D]** derivado (cuenta propia, `modelos_cost.py` sobre precios oficiales) · **[S]** supuesto.
Tipo de cambio de las cuentas: 11,37 Bs/USD (`pricing.ts:35`). El BCB publicó 12,05 del 26 al 28-sep [O, bcb.gob.bo, leído con resumen automático]: a 12,05 el costo de IA sube un 6%, y los márgenes de abajo bajan menos de 1 punto.

Lo que no prometemos (agendar por vos, agentes de llamadas, 24/7) queda anotado para **después de la 1.0**. Primero se lanza la 1.0.

---

## 0. Abogado del diablo: lo que estaba flojo

**Precio**
1. **«Bs 940 ya está en código» es falso.** `subscription-plans.ts:39-44` tiene 320 / 550 / 890 / 1.290 / 2.900. S = Crece 550 + chatbot 390 (`pricing.ts:87`) es una suma y no existe como plan. Además, Profesional (Bs 890) queda Bs 50 por debajo de S, sin bot. Para vender S hay que cambiar el catálogo: es el paso 2 de la propuesta, de 1-2 días, y hoy no está hecho.
2. **La hora de soporte a Bs 100 y «1 h/mes por cliente» son supuestos** [S]. Son el costo que más pesa: con 6,6 h/mes en S la contribución llega a cero. No hay ni un minuto medido.
3. **El valor para la clínica se apoya en un 50% de margen clínico sin fuente** [S]. La comparación contra una recepcionista (Bs ~4.400) no vende: el cliente ideal ya tiene recepción y la mantiene.
4. **El gasto de Bs 3.650 está viejo:** tiene el VPS a US$21 y no incluye Claude Max. Con Claude Max el break-even casi se duplica (ver §2).
5. **Dos tipos de cambio mezclados** (11,37 en CONCLUSION y modelos, 12,05 en precio). El precio en Bs no cambia; lo que cambia es el total con Meta que ve el cliente.
6. **IVA incluido sin confirmar con el contador.** Si el precio fuera sin IVA, el cliente paga 13% más y el margen sube; hay que decidirlo antes de publicar.
7. **Disposición a pagar: 0 entrevistas.** Nadie probó que una clínica pague Bs 1.245-1.343 al mes en total con Meta.

**Modelo**
1. **gpt-6-sol se recomendó solo con el caso típico con cache.** Con el conocimiento al techo, aunque haya cache, el margen de M cae a **42,2%**, y sin cache a **-22,9%** [D]. El techo que puso el análisis de precio (≤ USD 0,03 por conversación para sostener 50%) lo rompe sol en ambos casos: USD 0,044 y 0,136.
2. **sol con `reasoning_effort=none` apaga justo lo que lo distingue** («Reasoning Highest» [O]). En Chat Completions el function calling solo anda con `none` [O]. Así que pagás 4,5 veces lo de gpt-4.1-mini por un modelo sin razonar, y la mejora de calidad no está medida.
3. **El cache no está garantizado.** OpenAI lo guarda 30 min [O] y Claude 5 min [O]. Una clínica con 500 conversaciones al mes tiene ~2 por hora en horario hábil [D]: el cache va a estar caliente a veces, no siempre. Sin cache, sol cuesta 2,6 veces más.
4. **Haiku 4.5 no sirve de respaldo:** retiro «no antes del 15-oct-2026» (en 17 días) [O], y su cache exige 4.096 tokens, así que el conocimiento típico no entra.
5. **Sonnet 5.5 salió hoy y Opus 5.5 hace 6 días** [O]. No hay benchmark en español ni en voseo de ninguno.
6. **Opus 5.5 es «económico» solo frente a Opus 5** (-20% en entrada y salida [O]). Además siempre piensa, rechaza el `tool_choice` forzado y no deja cambiar la temperatura [O].

---

## 1. Precio final recomendado

**Mantener S Bs 940/mes, M Bs 1.290/mes y Empresa desde Bs 2.900; el anual vale 10 meses; sin descuento de lanzamiento.**
- **Por qué:** con Meta, S le cuesta a la clínica Bs 1.245-1.343/mes [D], más barato que armarlo por partes en Bolivia (Bs ~680-780 + Meta, sin ficha ni agentes [D]) y que Doctocliq con 3 profesionales (Bs 1.771, sin bot [D]).
- **Margen y etapa:** deja un margen neto del 59-68% con el modelo recomendado. Con 4 clientes S se alcanza la salida de la etapa 1 (Bs 3.750/mes). Un 30% de descuento la llevaría a 6 clientes.
- **Condición:** el precio aguanta solo si el soporte real queda en 3 h/mes o menos por cliente. Se mide desde el cliente 1.

---

## 2. Tabla de precios

IVA 13% + IT 3% incluidos en el precio [S]. Soporte a Bs 100/h [S]. IA = base + LLM recomendado (4.1-mini + 20% sol) [D]. El margen va de «típico con cache» a «techo con cache». Break-even con un gasto de Bs 3.650/mes.

| Plan | Precio | Neto (-16%) | Costo IA + soporte | Margen neto | Break-even (gasto 3.650) | Con Claude Max (gasto ~6.460) |
|---|---|---|---|---|---|---|
| S mensual | Bs 940 | Bs 789,6 | Bs 162-235 | **59,1-66,7%** | 6-7 clientes | 11-12 |
| S anual | Bs 9.400 (= 783/mes) | Bs 658/mes | Bs 162-235 | 54,1-63,3% | 8-9 | 14-16 |
| M mensual | Bs 1.290 | Bs 1.083,6 | Bs 203-318 | **59,4-68,3%** | 5 | 8-9 |
| M anual | Bs 12.900 (= 1.075/mes) | Bs 903/mes | Bs 203-318 | 54,4-65,1% | 6-7 | 10-12 |
| Empresa | desde Bs 2.900 + implementación desde Bs 3.500 | Bs 2.436 | Bs 385-596 [D, CONCLUSION §2 con luna/4.1-mini] | 60,2-70,7% | 2 | 4 |

- **Fuente de los precios:** `subscription-plans.ts:43-44` (M, Empresa) y la suma Crece 550 + chatbot 390 (S, que todavía no está en código).
- **Empresa:** el LLM nuevo no está recosteado. Se recalcula al cotizar.
- **Peor caso** (conocimiento al techo, sin cache, enrutamiento): S 38,1%, M 34,9% [D].
- **Lanzamiento, sin tocar el precio:**
  - Precio de fundador congelado 12 meses para los primeros 5 (`subscription-plans.ts:3`).
  - 14 días de prueba.
  - Configuración hecha por Onia después del primer pago, con tope de 3 h en S y 5 h en M (ya aprobado).
- **No crear un S más barato:** el negocio de 1 profesional no es cliente ideal. Básico (Bs 320) se queda como la opción de «solo gestión».

---

## 3. Modelo recomendado

Costo por conversación de 6 respuestas, con el conocimiento típico y cache. M = 800 conversaciones al mes a cupo lleno. El margen de M va de «típico con cache» a «techo con cache» y a «techo sin cache» [D]. Los precios son USD por 1M de tokens: entrada / salida [O].

| Modelo | USD/1M | USD/conv. | M/mes (Bs) | Margen M | Latencia [O] | Notas |
|---|---|---|---|---|---|---|
| Claude Opus 5.5 | 4 / 20 | 0,040 (0,064 con thinking) | 362 (580) | 45,0 / 1,6 / **-181** | «Moderate» | Siempre piensa. Para sostener 70% necesita S a ~Bs 2.500 |
| Claude Sonnet 5.5 | 2 / 10 | 0,022 | 200 | 57,6 / 32,2 / -54,1 | «Fast» | Salió hoy. +30% de tokens por el tokenizador |
| Claude Haiku 4.5 | 1 / 5 | 0,024 | 215 | 56,4 / 57,0 / 23,0 | «Fastest» | Retiro desde el 15-oct-2026; el cache no aplica |
| gpt-6-sol | 2 / 10 | 0,016 | 147 | 61,7 / 42,2 / **-22,9** | «Fast» | Con `none` pierde el razonamiento |
| gpt-6-luna | 0,10 / 0,50 | 0,0008 | 7 | 72,5 / 71,5 / 68,3 | «Fast» | No te convence; queda como opción de ahorro |
| gpt-4.1-mini | 0,40 / 1,60 | 0,0036 | 33 | 70,5 / 65,5 / 54,0 | «low latency», sin razonamiento | Ya configurado y medido en producción |
| **4.1-mini + 20% sol** | - | 0,0068 | 62 | **68,3 / 59,4 / 34,9** | - | Recomendado |

- **Latencia:** ningún proveedor publica milisegundos; solo etiquetas relativas.
- **Margen sin LLM:** M 73,1%.

**Recomendación:**
- **Principal: enrutamiento.** gpt-4.1-mini contesta primero, con salida JSON y el conocimiento cacheado. Si devuelve `faq_ids` vacío, un JSON inválido o baja confianza, escala a **gpt-6-sol** (tu «GPT-6»). Si sol tampoco resuelve, pasa a una persona en Chatwoot.
  - Es el único esquema con GPT-6 adentro que no cae por debajo de 34% en el peor caso.
  - En el caso típico pierde solo 4-5 puntos contra usar solo 4.1-mini.
- **Respaldo de otro proveedor** (si cae todo OpenAI): **Claude Sonnet 5.5** con effort `low`. Reemplaza a Haiku 4.5 por su retiro y su cache.
- **Si las evals muestran que 4.1-mini no alcanza en voseo:** sol solo, pero con un tope al conocimiento por organización (~2.700 tokens, el caso típico) y cache obligatorio. Sin esas dos cosas, M queda negativo en el peor caso.
- **Topes, igual que en CONCLUSION §3:** máximo 8 llamadas por conversación, 10 respuestas por contacto por hora y una clave LiteLLM por organización.
- **Términos:** avisar que es IA al inicio de cada sesión, nunca dar consejo médico, y las cuentas a nombre de Leslie u Onia [O, anthropic.com/legal/aup; políticas de OpenAI leídas vía buscador].

**Opus 5.5, dicho honesto:** es muy bueno y más barato que Opus 5, pero en WhatsApp cada respuesta cuesta el 59-94% de lo que cobra Meta, y en el peor caso el margen queda en -181%. **Sirve donde el volumen es bajo:** juez de las evals en voseo, editor del conocimiento (20-40 ediciones al mes) y redactor de las propuestas de los agentes que aprueba el dueño. **Nunca en primera línea.**

---

## 4. Qué falta medir antes de encender la IA (después de la 1.0)

1. **Evals en voseo con JSON:** correr `evals/evals.test.mjs` con 4.1-mini, sol (`none`), Sonnet 5.5 (`low`) y luna, con Opus 5.5 de juez. Gana el más barato que pase.
2. **Latencia real** desde el VPS con `bench.mjs`: tiempo al primer token y total. Ningún proveedor la publica.
3. **Qué fracción de mensajes llega al LLM** con el guion primero (hoy se supone 100%, así que los márgenes son un piso), y el **tamaño real del conocimiento** de cada clínica (típico o techo).
4. **Aciertos de cache reales**, por las pausas de WhatsApp de más de 30 min, y **tokens reales en español** con cada tokenizador.
5. **Que el LiteLLM del VPS** reconozca gpt-6-sol y claude-sonnet-5-5, y que pase `reasoning_effort` y el TTL del cache.
6. **Minutos de soporte por cliente** desde el primero. Es el costo que decide el precio.
7. **Antes de publicar el precio:** tipo de cambio a ojo en bcb.gob.bo, IVA con el contador y la tarifa utility de Meta para Bolivia desde el 1-oct.

---

## 5. Decisiones para vos (2)

**D1. Precio.** ¿Mantenemos S Bs 940, M Bs 1.290 y Empresa desde Bs 2.900, con el anual a 10 meses y sin descuento de lanzamiento?
- **Recomendada: sí.** Los 5 primeros con precio de fundador congelado 12 meses.
- La devolución del primer mes («si en 30 días no te mostramos tus pacientes con tratamiento a medias») solo si esa lista **ya funciona en producción en la 1.0**. Si no funciona, no se promete.

**D2. Modelo.** ¿Enrutamiento 4.1-mini → gpt-6-sol, o gpt-6-sol solo?
- **Recomendada: el enrutamiento.** En M da 68% típico y 35% en el peor caso; sol solo da 62% y -23%.
- Sonnet 5.5 queda de respaldo, Opus 5.5 fuera de la primera línea y luna como opción de ahorro.
- Lo confirman las evals antes de encender.

Cálculo reproducible: `modelos_cost.py` en esta misma carpeta.
