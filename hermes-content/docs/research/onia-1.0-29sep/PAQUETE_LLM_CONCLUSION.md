# Paquete Onia + LLM en la nube: conclusión

Para: Sergio Urcullo · 28-sep-2026 · solo lectura, sin gasto, sin tocar repos.

Etiquetas: **[O]** oficial (página del proveedor, consultada 28-sep-2026) · **[M]** medido en código o en producción · **[D]** derivado (cuenta propia sobre O/M) · **[S]** supuesto · **[F]** foro o reseña de usuarios.
Tipo de cambio base: **11,37 Bs/USD** (`lib/pricing.ts:34`), con estrés a **15**. La propuesta anterior usaba 12,05: los Bs de un documento y del otro no se comparan uno a uno. Confirmá vos cuál manda.

---

## 1. La respuesta en 6 líneas

1. **Qué vendemos:** un solo paquete por rubro. Gestión, recepcionista de WhatsApp/web y agentes que proponen y vos aprobás. Onia lo deja configurado.
2. **A qué precio:** S Bs 940/mes (9.400/año), M Bs 1.290/mes (12.900/año), Empresa desde Bs 2.900. Son los precios que ya están en código, ninguno es nuevo.
3. **Con qué LLM:** gpt-6-luna (OpenAI, vía el LiteLLM del VPS), solo para lo que el guion no cubre. Respaldo: gpt-4.1-mini, y después Claude Haiku 4.5. Se activa recién cuando pase evals en voseo.
4. **Qué margen:** con LLM real y el cupo lleno, neto de IVA+IT y con 1 h de soporte, el margen queda en 60-70% en S y 60-73% en M [D]. El LLM no mueve el margen; las horas de soporte sí.
5. **Qué paga aparte el cliente:** Meta, en su propia tarjeta en USD. Desde el 1-oct-2026 no hay tramo gratis. Típico: S Bs 288-380/mes, M Bs 499-659/mes [D]. Con Onia, S sale Bs 1.228-1.320 y M Bs 1.789-1.949 en total.
6. **Qué NO prometemos:** «agenda por vos» (hoy manda el link), «agentes que manejan tu negocio», agentes de llamadas, soporte 24/7, «un solo pago» con Meta incluido ni «IA» antes de encender el LLM.

---

## 2. Paquete final por tamaño

| | **S** · 2-3 profesionales | **M** · 4-6 profesionales | **Empresa** · 7+ o sedes |
|---|---|---|---|
| Precio mensual / anual (10 meses) | **Bs 940 / 9.400** | **Bs 1.290 / 12.900** | desde **Bs 2.900 / 29.000** + implementación desde Bs 3.500 |
| Incluye | Gestión del rubro con agenda pública; recepcionista WhatsApp/web; agentes del rubro con tu aprobación; Redactor IA; recordatorios; contenido de texto; configuración hecha por Onia después del primer pago | Todo S + reportes completos, facturas recurrentes y varios administradores | Todo M + asesoría; cupos al cotizar |
| Conversaciones del recepcionista/mes | 500 | 800 [S] (hoy el código da 500 a todos) | ref. 1.500 [S] |
| Respuestas del bot/mes (tope duro) | 3.000 | 4.800 | a cotizar |
| Recordatorios / reactivaciones por mes | 350 / 60 | 700 / 120 | a medida |
| Fotos + min de audio / Redactor / textos | 500+500 / 50 / 60 | 800+800 / 400 / 120 | ref. 1.500+1.500 / 400 / 200 |
| Usuarios / fichas / correos | 4 / 800 / 400 | 8 / 2.000 / 1.600 [S, propuesta D3] | a cotizar |
| **Costo IA a cupo lleno, con LLM real** [D] | Bs 28-98 (a 11,37) · Bs 37-129 (a 15) | Bs 48-160 · Bs 63-211 | Bs 85-296 · hasta Bs 390 (a 15) |
| + soporte [S: Bs 100/h] | 1 h = Bs 100 | 1 h = Bs 100 | 3 h = Bs 300 |
| **Margen neto** (IVA 13% + IT 3%, mensual) | **59,6-70,4%** | **59,9-72,6%** | **60,2-70,7%** |
| Margen neto, anual | 54,7-67,7% | 55,1-70,3% | - |
| Horas de soporte que dejan el margen en cero (peor caso) | 6,6 h/mes | 8,7 h/mes | - |
| Meta aparte, típico / máximo (lo paga el cliente) [D] | Bs 288-380 / 481-634 | Bs 499-659 / 808-1.066 | a medida |

- **Fuentes:** precios de `subscription-plans.ts:41-44` y `pricing.ts:72-77`. Cupos de `PROPUESTA_PAQUETE_UNICO.md` §3. Costo IA y margen de la economía unitaria de este trabajo: el rango va de 3 respuestas con nano a 6 respuestas con gpt-4.1-mini y el conocimiento duplicado. En Empresa, el costo se escaló desde M [D].
- **Ampliación:** +200 conversaciones a Bs 190 (`pricing.ts:199-225`), avisada al 80% del cupo. Nunca se cobra excedente automático.
- **Break-even** [D]: con gasto de Bs 3.650/mes, 6-7 clientes S o 4-5 M. Con el VPS a US$40 y el dominio (gasto Bs 3.908-4.053), 6-8 S o 5-6 M. **No son «~5».** Además, los Bs 3.650 están desactualizados: tienen el VPS a US$21 y no incluyen Claude Max.

---

## 3. LLM: modelo, respaldo, enrutamiento y guardarraíles

**Principal: gpt-6-luna** [O], con `reasoning_effort="none"`, temperatura 0,2 y hasta ~200 tokens de salida.
- **Precio:** USD 0,10 entrada / 0,01 cacheada / 0,50 salida por 1M tokens. Tiene function calling, structured outputs, cache y visión.
- **Fuente:** developers.openai.com/api/docs/models/gpt-6-luna y /pricing.
- **Por qué `none`:** en Chat Completions, el function calling solo funciona con `none`. En esfuerzo máximo, Artificial Analysis midió 94 s hasta el primer token [O/F].
- **Ojo, salió el 22-sep-2026:** tiene 6 días. No hay latencia publicada con `none`, no está verificado que el LiteLLM del VPS lo reconozca y no hay benchmark en español. Por eso **no se activa sin pasar antes `evals/evals.test.mjs` y `bench.mjs`**, comparando luna, 4.1-mini y Haiku.

**Respaldos:**
1. **gpt-4.1-mini:** 0,40/0,10/1,60 [O]. Ya está configurado y medido en producción (lee fotos) [M].
2. **Claude Haiku 4.5:** 1,00/0,10/5,00 [O]. La clave ya está en el contenedor y cubre una caída entera de OpenAI.

**Descartados:**
- **gpt-6-sol** como escalamiento: cuesta 20 veces más. Ante una duda, se escala a una persona, no a un modelo más grande.
- **Gemini:** sus términos exigen 18 años o más y prohíben el consejo médico [O].
- **DeepSeek:** manda datos de pacientes a China.
- **Groq con Llama:** no tiene precio público.
- **Ollama Cloud:** abajo.

**«M Goat LLM Cloud»: no lo identifiqué.** No existe ningún producto con ese nombre (la búsqueda solo devuelve AIGoat/LLMGoat, que son laboratorios locales de seguridad).
- **Mejor candidato, con confianza media: Ollama Cloud.** Encaja con «nube, no local», y el LiteLLM del VPS ya tiene `OLLAMA_API_KEY`.
- **Recomendación: no usarlo como principal.** Cobra por token lo mismo que ir directo al proveedor (gpt-oss:120b 0,15/0,60) [O, ollama.com/pricing]. El plan Pro acepta 3 peticiones a la vez. En 2026 hubo issues públicos de «95% failure rate» y errores 503 [F, github.com/ollama/ollama/issues/15453 y /14673].
- Si era otro producto, pasame el link y lo evalúo con la misma tabla.

**Enrutamiento:**
1. **Guion primero.** Botones, horarios y link de agenda no gastan tokens.
2. **Fuera de guion, va a luna.** Se le pasa el conocimiento completo del dueño en el prompt, cacheado. El esquema limita el conocimiento a unos 9.700 tokens [D, `knowledge.mjs:102-238`], así que no hace falta base vectorial. Devuelve JSON `{respuesta, faq_ids_usados[], producto_id, derivar, motivo}`.
3. **Si falla:** error, timeout de 8 s o JSON inválido → 4.1-mini. Si cae el proveedor entero → Haiku 4.5. Si todo falla → texto seguro y derivar a una persona en Chatwoot.
4. **Cuándo deriva a humano, sin escalar de modelo:** si `faq_ids_usados` viene vacío, si el guardarraíl bloquea la respuesta, a los 2 malentendidos (la regla ya existe) o si el paciente pide una persona.
5. **Precios desde el catálogo, no desde el LLM.** El LLM devuelve solo `producto_id`; el código pega el precio literal que cargó el dueño. Así se contesta «¿cuánto sale?», la pregunta #1 que hoy se deriva siempre (`recepcionista.mjs:273`). Si el dueño no cargó el precio, deriva.

**Guardarraíles:**
- `guardrails.mjs` en modo estricto: cualquier cifra de plata escrita por el LLM tira la respuesta [M].
- Agregar un regex de diagnóstico, receta y dosis.
- Responder solo con hechos del conocimiento; si el dato no está, derivar.
- No pasarle datos de salud más allá del turno actual. Aviso al paciente en el primer mensaje.
- Una sola burbuja por respuesta: Meta cobra cada mensaje.

**Topes, antes de encender el LLM:**
- Máximo 8 llamadas al LLM por conversación.
- 10 respuestas por contacto y por hora, con detección de mensajes entrantes repetidos (corta loops entre bots).
- Clave virtual de LiteLLM por organización, con presupuesto propio.
- Subir el tope global de USD 50: hoy un solo cliente puede apagar el bot de todos [S, no verificado en vivo].

**Costo por conversación** [D, tokens a 3,7 car/token, sin tokenizador]:

| Caso | gpt-6-luna | gpt-4.1-mini (respaldo) |
|---|---|---|
| 3 respuestas, conocimiento típico, con cache | USD 0,00054 (Bs 0,006) | USD 0,0021 (Bs 0,024) |
| 6 respuestas, típico, sin cache | USD 0,0021 (Bs 0,023) | USD 0,0081 (Bs 0,092) |
| 6 respuestas, conocimiento al techo, sin cache | USD 0,0068 (Bs 0,077) | USD 0,027 (Bs 0,31) |
| **Meta por cada respuesta** (utility, desde el 1-oct) | **USD 0,0113** | **USD 0,0113** |

- **Por mes, M típico:** con luna, 800 conversaciones de 6 respuestas cuestan Bs ~7,4 con cache (USD 0,65 a 11,37) [D].
- **El LLM pesa poco:** sale entre el 1% y el 19% de lo que Meta cobra por esa misma respuesta. Lo que decide el costo es la cantidad de mensajes, no el modelo.

---

## 4. Competencia: cómo cobran y dónde queda Onia

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

## 5. Qué dicen los usuarios y cómo lo usamos

**Lo que se repite** [F]:
- **La plata y la salida hacen cancelar más que un bot tonto.** Trustpilot, consultado 28-sep-2026: Wati 3,0/5, Manychat 2,1/5, Kommo 1,9/5, Tidio 3,7/5. Las quejas de 1 estrella son cobros inesperados, cancelación difícil y soporte automatizado o lento. Weave (clínicas) en Capterra: siguieron cobrando al terminar el contrato.
- **En LatAm, el costo por mensaje de WhatsApp molesta cuando la clínica lo ve aparte.** Reseñas de AgendaPro en Capterra: «PLANTILLAS MUY CARA PARA COBRAR CADA VEZ QUE ENVIAS» (Eddie J., dic-2024).
- **Configurar Meta Business Manager es lo que más cuesta.** En Hacker News lo llaman «nightmarish» (news.ycombinator.com/item?id=48504753).
- **Las alucinaciones son patrón, pero menos frecuente.** HighLevel tiene un pedido de 48 votos sobre esto (ideas.gohighlevel.com). Air Canada fue condenada a pagar por lo que inventó su bot (tribunal de BC, 14-feb-2024) [O].
- **El paciente prefiere un humano:** 64% no quiere IA en la atención (Gartner, 2024) y solo 15% vivió un traspaso a humano sin fricción (SurveyMonkey, 2026) [O].
- **Reddit y G2 no se pudieron leer** (bloqueados para el agente). No hay voz de usuarios bolivianos.

**Principios de «el cliente no hace nada»:**
1. **Factura sin sorpresas.** Precio fijo a Onia y **techo de Meta garantizado en Bs**, firmado en los términos: tope de código × tarifa × tipo de cambio de estrés. Aviso al 80%, nunca excedente automático, cancelar en un clic.
2. **Onia hace la configuración, con una lista cerrada:** Meta Embedded Signup, plantillas, carga del conocimiento desde un formulario de 1 página y migración solo desde la plantilla Excel de Onia. Arranca después del primer pago y tiene tope de horas.
3. **Traspaso a humano visible y con contexto.** «Te paso con recepción» ante cualquier duda. Nunca diagnostica, nunca inventa precios: el precio sale del catálogo.
4. **Solo API oficial y solo con consentimiento.** Casilla de consentimiento en la ficha, reactivación en lotes chicos y vigilar la calidad del número. Los baneos documentados vienen de APIs no oficiales o de mensajes sin opt-in [F].
5. **Soporte humano por WhatsApp en horario hábil,** con tiempo de respuesta prometido. No 24/7: sos una sola persona.

---

## 6. Agente de llamadas: costo de referencia y cuándo

**IA de voz por minuto** [O/D]:
- ElevenAgents: USD 0,08 + LLM (el LLM no publica precio).
- Vapi: 0,082-0,129.
- Retell: 0,118-0,159.
- Bland: 0,12-0,14.
- gpt-realtime-mini: ~0,02-0,05 [S]. Obliga a construir y operar nuestro propio puente de telefonía.

Fuentes: elevenlabs.io/pricing/agents, vapi.ai/pricing, retellai.com/pricing, bland.ai/pricing.

**En Bolivia lo caro es la telefonía:**
- Twilio a un celular boliviano: **USD 0,414/min** [O, twilio.com/en-us/voice/pricing/bo]. 100 llamadas salientes de 3 min salen Bs ~1.790-1.960, más que el plan S entero.
- Troncal SIP de Entel: Bs 0,80/min, pero con piso de Bs 1.700/mes y enlace VPN/Metro Ethernet [O, PDF de tarifas de Entel]. No sirve hoy.
- **La vía viable es la llamada de WhatsApp que inicia el paciente:** Meta no la cobra («all user-initiated calls are free») [O]. 100 llamadas de 3 min cuestan Bs ~290-575, el 31-61% del plan S [D].

**Latencia:** mediana de 1,3 a 1,7 s en llamadas reales, según un benchmark independiente (openbenchmarks.com). No hay mediciones en español ni desde Bolivia.

**Cuándo tiene sentido:** después de tener clientes pagando con el recepcionista de texto funcionando y medido.
- Formato: add-on por **bloques de minutos con tope**, solo llamadas entrantes por WhatsApp, empezando con ElevenAgents o Vapi.
- Antes de ponerle precio: medir latencia en español desde Santa Cruz y el costo real del LLM por minuto.
- **Hasta entonces no se nombra en la venta** (regla «la venta nunca exhibe obra»).

---

## 7. Riesgos y cómo se cierran

| # | Riesgo | Evidencia | Cierre |
|---|---|---|---|
| 1 | **Las horas de Sergio Urcullo por cliente** son el único costo que supera el precio, y «que el cliente no haga nada» las multiplica | Margen cero con 6,6 h/mes en S y 8,7 h en M [D] | Configuración con lista cerrada y tope de horas, solo después del primer pago. Registrar minutos por organización desde el cliente 1; si el promedio pasa de 3 h/mes, sube el precio o baja la promesa |
| 2 | El plan M (`clinic`) no tiene topes | `subscription-plans.ts:36-38` «quita todos los topes»; `cupo.ts` ignora el plan [M] | Topes en el borde **antes** de encender el LLM o el audio |
| 3 | Un loop entre bots le dispara Meta al cliente y el tope global de LiteLLM a todos | 5.760 respuestas en 8 h = USD 65 (Bs ~739) en una noche [D] | Tope por contacto y por hora, detección de repetidos, clave LiteLLM por organización |
| 4 | El bot de ventas de Onia ahora paga cada mensaje | `config.mjs:634` todavía dice «texto libre gratis» [M] | Contar los mensajes de los barridos de n8n, ponerles tope diario y corregir el comentario |
| 5 | La «1.000 gratis» sigue en el código y en las cuentas | `pricing.ts:189-191` [M]; las páginas oficiales de Meta no la mencionan [O]; Andina (tercero) sí | Corregir el comentario y las cuentas; no vender contando con ese tramo |
| 6 | Sin una tarjeta que pague en USD no salen las plantillas | [S, no verificado] | Preguntarlo al calificar; verificar con 1-2 bancos de Santa Cruz; plan B: correo |
| 7 | La recepcionista pierde el WhatsApp de su celular | [S] coexistencia no verificada | Verificar si Embedded Signup admite coexistencia; si no, decirlo antes de vender |
| 8 | Nadie probó que la clínica pague Bs 1.228+ en total | 0 clientes, 0 datos | 5 conversaciones con clínicas del perfil mostrando el total con Meta |
| 9 | Cuentas a nombre de un menor | Gemini exige 18+ [O]; OpenAI, Meta y Hostinger no se verificaron | Todas las cuentas y contratos a nombre de Leslie u Onia |
| 10 | Sin factura SIAT la clínica pierde el crédito de IVA (~13%) | SIAT al 24,8%, límite 04-nov-2026 [M, memoria del proyecto] | Portal gratis del SIN mientras tanto; confirmar con el contador si el precio lleva IVA |
| 11 | Un solo VPS corre todo | [M] | Monitoreo externo con alerta + respuesta automática mínima en Meta (por verificar) |
| 12 | Copy falso hoy: «Chatbot WhatsApp con IA» | `pricing.ts:80,82,157,358` [M]; el recepcionista no usa LLM | Cambiar el copy ya, o encender el LLM primero |
| 13 | Cinco rubros al mismo precio multiplican el soporte | [D] | Vender activamente solo dental y estética |

**Orden:** topes (2, 3, 4) → copy honesto (5, 12) → cuentas a nombre de Leslie (9) → techo de Meta y calificación (6, 7) → precio desde catálogo y consentimiento → LLM después de las evals → 5 entrevistas (8). Todo lo demás queda anotado como pendiente.

---

## 8. Lo que tenés que aprobar (3 decisiones)

**D1. Meta: ¿aparte con techo garantizado en Bs, o absorbido?**
- **Recomendada: aparte, con techo firmado en Bs** (tope de código × tarifa × 15 Bs/USD), estimado mostrado en la primera conversación y total mensual en Bs en la cotización. Es como cobra todo el mercado, y el techo responde a la queja #1 de los foros.
- Alternativa: absorberlo con el número de Onia. La clínica pierde su número y el margen de M cae a ~42% [D, propuesta].

**D2. LLM: ¿gpt-6-luna como principal, solo fuera de guion y activado después de evals?**
- **Recomendada: sí.** Luna con `none`, con 4.1-mini y Haiku 4.5 de respaldo. Precios desde el catálogo por código. No se promete «IA» en la venta hasta pasar `evals` y `bench` en voseo. Cuesta Bs ~7-8 al mes por cliente M típico.
- Confirmame qué era **«M Goat LLM Cloud»**. Si era Ollama Cloud, la recomendación es no usarlo como principal (mismo precio, 3 peticiones a la vez, fallas públicas).

**D3. «Que el cliente no haga nada»: ¿con qué alcance?**
- **Recomendada: configuración hecha por Onia, con lista cerrada y tope de 3 h en S y 5 h en M**, solo después del primer pago e incluida en el anual. El cliente aporta 4 cosas: tarjeta para Meta, aprobación en Meta, formulario de 1 página y su Excel en la plantilla de Onia.
- Si pasa de 3 h/mes promedio con los primeros 3 clientes, se revisa el precio.
- Alternativa: «no hacés nada» sin tope. Choca con la pregunta 3 del test de negocio (entregar sin horas de Sergio Urcullo por cliente) y es el único costo que puede superar el precio.

**Chequeos de 10 minutos antes de publicar precios:** qué tipo de cambio manda (11,37 o 12,05, mirado en bcb.gob.bo), el IVA incluido y la factura SIAT con el contador, y la tarifa utility de Bolivia desde el 1-oct en la tabla oficial de Meta (acá se usó USD 0,0113 del encargo, sin releerla).
