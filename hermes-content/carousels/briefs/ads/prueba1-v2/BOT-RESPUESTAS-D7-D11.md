# Lo que ve el lead después del clic: las respuestas del bot a D7, D8, D9, D10 y D11, contra el catálogo

> **11-oct-2026 · Ventas y pauta · tarea 1 de las tres «destrabadas» que pidió la MADRE MARKETING** (conseguir dueños de clínica sin gastar). **Solo lectura: no se tocó el bot ni su conocimiento** (una fuente del bot lleva la firma humana de Sergio Urcullo, `FIRMA_HUMANA`; abajo van **propuestas**, no cambios).
> **Cómo se midió:** el motor real (`bot-engine.mjs`) con la config «como producción» del repo, por `.claude/skills/onia-ventas-pauta/scripts/simular-bot.mjs`, y cada respuesta fija pasada por el detector de promesas de la web (`promesasEn`). **No se midió:** la rama del LLM (sale `[[LLM_PENDIENTE]]`), la primera respuesta de la plantilla de Chatwoot (ADQ §5.5) ni los horarios reales del VPS.

## 1. Qué código es qué pieza (para leer el aviso «Origen: anuncio-D10»)

| Código | Pieza | Qué es | Entra a la prueba 1 |
|---|---|---|---|
| `D7` | G1-1 | Selfie sentado de 28 s (copia a Dt.Dental) | Sí |
| `D8` | G1-2 | «Paciente que hace meses no vuelve», 33 s (copia a CitaPro) | **Solo si G-05 ✅ antes de crear** |
| `D9` | G1-3 | Imagen 1:1 «¿Quién de mañana no confirmó?» (copia a CitaPro y AgendaPro) | Sí |
| `D10` | G1-4 | Sergio Urcullo explica, 31 s (copia a Doctocliq) | Sí |
| `D11` | G1-5 | Micro-video de 10 s (copia a Doctocliq) | Sí |

El aviso a Sergio Urcullo dice solo `Origen: anuncio-D10.` (`bot-engine.mjs`, línea 329): **sin esta tabla no sabe qué anuncio trajo al lead.** Propuesta (carril chatbot): que el aviso diga la pieza («anuncio-D10 · Sergio explica»).

## 2. Lo que recibe cualquier lead que escribe el precargado (los cinco códigos dan lo mismo)

El código solo **etiqueta el origen** (`pieceKey = anuncio-Dn`, lo cuida `campana-lista.test.mjs`); la respuesta es la misma. Son **dos mensajes**:

1. **`M0_PERSONA`**: «¡Hola! Soy el asistente automático de Onia. Sí, un bot. · Onia es una plataforma por módulos para que su negocio trabaje adentro: agenda, cobros y clientes en un solo lugar. · Le muestro cómo quedaría en SU negocio **en 30 minutos** por videollamada. El horario lo coordina directo con Sergio: le escribe por este mismo chat.»
2. **`R_CAMPANA`**: «Gracias por escribir desde el anuncio. Para que Sergio llegue a la demo con el caso de su clínica, cuénteme dos cosas: ¿cuántos profesionales atienden y quién agenda las citas? Y si en realidad busca atención dental como paciente, por acá no damos turnos: escríbale directo a su clínica.» + el aviso de fuera de horario.

**Contra el catálogo (§4, §7, §8):** sin promesas (detector de promesas: 0 en los dos). Dice «un bot» (D2, no se negocia), nombra solo módulos que el catálogo marca ✅ (agenda, cobros, clientes), no habla de IA, de WhatsApp automático, de SIAT ni de tratamiento a medias, y despide con cortesía al paciente.

## 3. Lo que encontré (en orden de peso)

| # | Hallazgo | Por qué importa | Quién / propuesta |
|---|---|---|---|
| 1 | **Dos botones de la bienvenida de Meta caen al LLM.** «Tengo una clínica y quiero ver cómo funciona» y «Trabajo en una clínica» dan `llm_freeform`. Solo «Busco atención dental» tiene salida fija (`M1_PACIENTE`, cortés). Los botones del propio bot (`Horarios`, `Servicios`, `Hablar con Sergio`) también: `Servicios` cae al LLM | El filtro del dueño (ADQ §5.2) son esos tres botones. El LLM solo reformula la pregunta pendiente y los guardrails descartan promesas (`run-turn.mjs`, `guardrails.mjs`), así que **no es un riesgo de promesa**, pero el dueño que toca su botón recibe una frase reformulada en vez de seguir el embudo | **Carril chatbot, con firma de Sergio Urcullo:** dos reglas fijas. «Tengo una clínica…» → pasa a las dos preguntas de `R_CAMPANA`; «Trabajo en una clínica» → «¿Es usted quien decide o quien agenda?» y deja anotado el rol |
| 2 | **El bot dice «30 minutos»; el anuncio no dice minutos** y el VSL, el CTA de la web y los mensajes a prospectos dicen **20** | Es L-04 🟡. Ya está en el go/no-go (fila 6); acá se ve en la primera respuesta que lee el lead | Sergio Urcullo: 20 o 30 |
| 3 | **El horario de oficina tiene una espera de hasta ~47 h:** «lun-vie 14:00-17:00 y 20:00-22:00, sáb 9:00-15:00», sin domingo. Un clic el sábado a las 15:01 espera hasta el lunes a las 14:00 | La recomendación de la fila 6 es contestar **antes de 24 h** (abre la ventana gratis de 72 h de Meta: la espera de 47 h cabe dentro de las 72, pero la prueba mide dueños y un dueño que escribe un sábado de tarde espera dos días). El bot **sí** le avisa cuándo le contestan | Sergio Urcullo: si contesta el sábado de tarde o el domingo, o acepta la espera |
| 4 | **El bot no contesta fijo «¿puedo probarlo gratis?»** (cae al LLM) aunque A-04 y A-08 («14 días sin tarjeta», «si no le sirve, no paga nada») están ✅ vistos en la web | Un dueño que pregunta eso es el que más cerca está de crear la cuenta. Hoy recibe la frase segura («eso prefiero no contestárselo yo… se lo confirma Sergio») | **Propuesta (firma de Sergio Urcullo):** una respuesta fija con el texto de la web («14 días del plan Profesional, sin tarjeta; si no le sirve, no paga nada») y el link de registro **solo cuando la persona lo pregunta**. No cambia el destino de los anuncios (§5.11: «no se prueban destinos») |
| 5 | La pregunta «¿los mensajes salen solos por WhatsApp?» también cae al LLM | Es la que el catálogo §7 no deja prometer. El guardrail la protege (no hay promesa posible), pero la respuesta segura no dice la verdad corta | Propuesta: respuesta fija «Onia deja el mensaje listo y usted lo aprueba; hoy no sale solo por WhatsApp» (G-03 🟡). Firma de Sergio Urcullo |

## 4. Lo que está bien (probado con el motor real)

| El lead escribe | El bot contesta | Contra el catálogo |
|---|---|---|
| El precargado de D7 a D11 | `M0_PERSONA` + `R_CAMPANA`, con `pieceKey = anuncio-Dn` | ✅ sin promesas |
| «Busco atención dental» / «Quiero un turno para una limpieza» | `M1_PACIENTE`: «Onia no es una clínica… por acá no le puedo dar un turno» | ✅ despide con cortesía |
| «Hablar con Sergio» | `M5`: «Ya le pasé su consulta… Si es urgente, dígame "urgente"» | ✅ |
| «¿Cuánto cuesta?» | `M4_BODY` con los planes públicos (Bs 320 · 550 · 890 · 1.290; chatbot aparte Bs 390 salvo en el Completo) | ✅ coincide con `subscription-plans.ts` y `pricing.ts` (lo ata `precios-publicos.test.mjs`); **el anuncio no lleva precio, el bot lo dice solo si preguntan** |
| «¿Emite factura electrónica del SIAT?» | `M_SIAT_BODY`: solo lo público de la RND; «la factura fiscal se emite aparte, en ese portal» | ✅ no promete SIAT (catálogo §7) |
| «¿Recupera pacientes con tratamiento a medias?» | `M0b_SIN_HORARIOS`: anota «pacientes que no vuelven» y manda a la demo | ✅ no promete D-03 (❌) |

## 5. Lo que depende de quién

| Qué | Quién |
|---|---|
| Firmar y publicar las reglas de §3 (1, 4 y 5) | **Sergio Urcullo** (la firma) y el **carril chatbot** (hoy no hay sesión viva de ese carril: ADQ §6, bloqueo 5) |
| 20 o 30 minutos; contestar el sábado de tarde y el domingo | **Sergio Urcullo** |
| La prueba con un teléfono ajeno, mirando la respuesta real, el primer mensaje de Chatwoot y el LLM | **Sergio Urcullo** (2 minutos; fila 5 del go/no-go) |

## 6. Lo que este documento no prueba

La respuesta del LLM, el primer mensaje de la plantilla de Chatwoot, que producción sirva hoy este mismo conocimiento (`knowledge.onia.json` 2026-10-03.2) y los horarios reales del VPS. Para repetir la medición: `node .claude/skills/onia-ventas-pauta/scripts/simular-bot.mjs "<precargado>" "<mensaje del lead>"`.
