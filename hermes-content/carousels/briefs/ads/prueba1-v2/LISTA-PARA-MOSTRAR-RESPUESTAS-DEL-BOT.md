# LISTA PARA MOSTRAR: respuestas del bot prueba 1

> **11-oct-2026 · Ventas y pauta · encargo de la MADRE MARKETING.** Las respuestas del bot que recibe quien escribe el precargado de **D7, D9, D10 y D11** (y D8, igual), **frase por frase**, contra `ONIA_CATALOGO_DE_VENTA.md` y `ONIA_PROMESA_VS_PRODUCTO.md` (con el «Código:» de V01, de `onia-platform` a7d8c1ed, **que no se pudo abrir desde aquí**).
> **No se tocó el bot ni su conocimiento.** Una fuente del bot lleva la firma humana de Sergio Urcullo (`FIRMA_HUMANA`): lo de abajo son **propuestas**. Medido con el motor real (`bot-engine.mjs`) y la config del repo, no con producción: `scripts/simular-bot.mjs`. La primera columna es **el texto literal del bot** y un test (`campana-lista.test.mjs`) falla si esa frase deja de ser la que el bot dice.
> Los cinco códigos reciben **la misma respuesta**: el código solo etiqueta el origen (`pieceKey = anuncio-Dn`).

## 1. El conteo (21 frases)

| ✅ sin problema | 🟡 a medias | ⬜ sin verificar | ❌ el catálogo no deja decirlo |
|---|---|---|---|
| **8** | **2** | **9** | **2** |

**Lo que sí frena:** dos frases de la respuesta al **precio** (14 y 15) venden el agente de WhatsApp, que el catálogo §5 marca ⏸ y la tabla marca ❌ (J-01, J-07, K-13). **Un lead de pauta que pregunta «¿cuánto cuesta?» las recibe hoy.** El detector de promesas no las ve porque son precio, no «promete». **Lo demás no frena la prueba:** son frases que pasan a ✅ cuando Plataforma mire las filas con la cuenta demo, o decisiones de Sergio Urcullo.

## 2. Frase por frase

**Estados:** ✅ coincide con una fila ✅ o no promete nada · 🟡 la fila está a medias · ⬜ la fila sigue sin verificar, falta la cuenta o la fuente · ❌ la fila dice que no se puede prometer.

### Al escribir el precargado (dos mensajes: `M0_PERSONA` y `R_CAMPANA`)

| # | Frase del bot | Fila(s) · «Código:» de V01 | Estado | Corrección propuesta |
|---|---|---|---|---|
| 1 | «¡Hola! Soy el asistente automático de Onia. Sí, un bot.» | Regla D2 del bot (se declara bot). Sin fila de promesa | ✅ | — |
| 2 | «Onia es una plataforma por módulos para que su negocio trabaje adentro: agenda, cobros y clientes en un solo lugar.» | **B-01** agenda ⬜ (`AgendaClient.tsx:180`, `crear-cita.ts:80`) · **E-01** cobros ⬜ (`NewInvoiceClient.tsx:31`, `api/payments/route.ts:36`) · **C-01** clientes ⬜ (`patients/page.tsx:119`, `FichaVista.tsx:99`) · catálogo §4 ✅ sale | ⬜ | Ninguna de texto: pasa a ✅ cuando Plataforma mire B-01, E-01 y **C-01** con la demo. **C-01 no estaba entre las filas exigidas: se suma** |
| 3 | «Le muestro cómo quedaría en SU negocio en 30 minutos por videollamada.» | **L-04** 🟡 (30 contra 20 minutos) · **L-05** ❌ (sin cuenta demo no hay «cómo quedaría en su negocio») | 🟡 | «Le muestro cómo funciona Onia en una videollamada y vemos si le sirve a su negocio.» (sin minutos hasta que Sergio Urcullo decida 20 o 30; sin «cómo quedaría en SU negocio» hasta que exista la demo) |
| 4 | «El horario lo coordina directo con Sergio: le escribe por este mismo chat.» | Sin fila: es el compromiso de Sergio Urcullo (fila 6 del go/no-go) | ⬜ | Ninguna de texto. Depende de que conteste |
| 5 | «Gracias por escribir desde el anuncio.» | Sin fila | ✅ | — |
| 6 | «Para que Sergio llegue a la demo con el caso de su clínica, cuénteme dos cosas: ¿cuántos profesionales atienden y quién agenda las citas?» | Preguntas 1 y 2 de `ONIA_CLIENTE_IDEAL.md` §9. No dice «clínica de ejemplo» (L-05) | ✅ | — |
| 7 | «Y si en realidad busca atención dental como paciente, por acá no damos turnos: escríbale directo a su clínica.» | Catálogo §1: Onia no es una clínica. Sin fila de promesa | ✅ | — |
| 8 | «Estoy respondiendo automático fuera de horario de atención. Sergio le confirma apenas vuelva: lun-vie 14:00-17:00 y 20:00-22:00, sáb 9:00-15:00.» | Sin fila: horario de oficina del bot (`horario-vivo.mjs`). Fila 6 del go/no-go | ⬜ | Si Sergio Urcullo decide contestar el sábado de tarde o el domingo, cambiar el horario; hoy la espera llega a ~47 h |

### Cuando el lead cuenta su clínica (`M0b_SIN_HORARIOS`)

| # | Frase del bot | Fila(s) | Estado | Corrección propuesta |
|---|---|---|---|---|
| 9 | «el resto lo vemos en la demo.» | Sin fila | ✅ | — |
| 10 | «Sergio le coordina el horario personalmente y le escribe por este mismo chat.» | Igual que la 4 | ⬜ | Ninguna de texto |

### Si es un paciente (`M1_PACIENTE`) y si pide hablar con Sergio (`M5`)

| # | Frase del bot | Fila(s) | Estado | Corrección propuesta |
|---|---|---|---|---|
| 11 | «Onia no es una clínica: hacemos el sistema con el que las clínicas organizan su agenda y sus pacientes, así que por acá no le puedo dar un turno ni atenderle.» | **B-01** ⬜ y **C-01** ⬜ (mismos «Código:» que la 2) | ⬜ | Ninguna de texto: pasa a ✅ con B-01 y C-01 |
| 12 | «Ya le pasé su consulta con todo lo que me contó.» | Sin fila: comportamiento propio del bot (el traspaso lo cubre `bot-engine.test.mjs` y `handoff-sin-humano-no-es-silencio.test.mjs`) | ✅ | — |

### Si pregunta el precio (`M4_BODY`, la FAQ «precios»)

| # | Frase del bot | Fila(s) | Estado | Corrección propuesta |
|---|---|---|---|---|
| 13 | «el sistema arranca en Bs 320 al mes con el plan Básico, Bs 550 el Crece, Bs 890 el Profesional y Bs 1.290 el Completo» | **K-01** ✅ visto, **K-03** ✅ (precios finales en Bs). Los ata `precios-publicos.test.mjs` a `subscription-plans.ts` | ✅ | — |
| 14 | «que ya trae el chatbot de WhatsApp adentro.» | **J-01** ❌ · **K-13** ❌ · **K-14** ❌ · catálogo §5: agente de WhatsApp ⏸ «hasta conectar el WhatsApp de un cliente real» | ❌ | **Quitar la cláusula.** «…y Bs 1.290 el Completo.» |
| 15 | «En el Básico, el Crece y el Profesional el chatbot va aparte, Bs 390 al mes.» | **J-07** ❌ («Precio del agente: Bs 390/mes») · **J-01** ❌ | ❌ | **Quitar la oración.** Lo que el catálogo no tiene listo no se nombra en la venta (CLAUDE.md, «La venta nunca exhibe obra») |
| 16 | «la lista completa y al día está en onia.com.bo/precios.» | **K-01** ✅ | ✅ | — |
| 17 | «Sergio se lo muestra funcionando con SUS números en una demo.» | **L-04** 🟡 · **L-05** ❌ | 🟡 | «Sergio se lo muestra funcionando en una demostración.» |

### Si pregunta por el SIAT o la facturación en línea (FAQ «siat»)

| # | Frase del bot | Fila(s) | Estado | Corrección propuesta |
|---|---|---|---|---|
| 18 | «la RND 102600000038 dejó sin efecto el plazo del 1 de octubre de 2026 de los grupos 9.º al 12.º de contribuyentes.» | **L-10** ✅ cubre el texto de la web, **no esta resolución**. Lista oficial del SIN (leída el 11-oct): RND 10-26-000000-38, 30-sep-2026, «Abrogación de las RND 102400000004, 102400000005, 102400000012 y 102400000025». **El título coincide; el texto no se pudo leer** (el servidor devolvió su página en vez del PDF en 4 intentos) | ⬜ | Hasta leer el PDF, sacar la frase (ver §3) |
| 19 | «Esa norma dice que el SIN asignará periódicamente una modalidad en línea, sin fecha fija, a los contribuyentes del IVA que no habían implementado ninguna» | Igual que la 18: **lo que «dice la norma» no se leyó del texto oficial** (skill `onia-ventas-pauta` §8.1, 9-oct: queda como dicho por un tercero). Además hay una **RND 102600000039 del 9-oct** que no se miró | ⬜ | Sacar la frase hasta leerlas |
| 20 | «el Servicio de Impuestos tiene un portal gratuito para facturar.» | **L-10** ✅ (web); no verificado por mí contra la fuente oficial. Lo mide el carril fiscal | ⬜ | Dejarla, atribuida al carril fiscal |
| 21 | «Onia le ordena ventas y compras; la factura fiscal se emite aparte, en ese portal.» | **E-10** ⬜ («registro de ventas y compras con detalle»; sin `Código:` de V01) · catálogo §7 coincide en que la factura fiscal se emite aparte (E-15 🟡) | ⬜ | Ninguna de texto: pasa a ✅ con E-10 |

## 3. Los textos corregidos, listos para la firma de Sergio Urcullo

Cada uno es el texto actual **menos** lo que está en ❌ o 🟡, sin agregar nada. Un test (`campana-lista.test.mjs`) los pasa por el detector de promesas y exige que no tengan voseo ni minutos ni el agente de WhatsApp.

**Línea 3 de `M0_PERSONA`:**

> Le muestro cómo funciona Onia en una videollamada y vemos si le sirve a su negocio.

**FAQ «precios» (`knowledge.onia.json`):**

> Se los paso derecho, son públicos: el sistema arranca en Bs 320 al mes con el plan Básico, Bs 550 el Crece, Bs 890 el Profesional y Bs 1.290 el Completo.
>
> Cuál le sirve depende de cuántos son y de qué módulos active, así que la lista completa y al día está en onia.com.bo/precios. Si quiere, Sergio se lo muestra funcionando en una demostración.

**FAQ «siat»** (mínima, hasta leer la RND):

> Sobre facturación en línea le contesto sólo lo que es público: el Servicio de Impuestos tiene un portal gratuito para facturar, y la factura fiscal se emite ahí, aparte de Onia. Cómo le aplica a usted, según su NIT, lo ve Sergio en la demo.

**Si se decide, en `R_CAMPANA`/M7:** el horario de oficina con el sábado de tarde y el domingo (decisión de Sergio Urcullo; no hay texto que proponer sin saber qué decide).

## 4. Qué depende de quién

| Qué | Quién |
|---|---|
| **Firmar y publicar** los tres textos de §3 (una fuente del bot lleva firma humana: `publicar-solo.sh`, `FIRMA_HUMANA`) | **Sergio Urcullo** y el carril chatbot (hoy sin sesión viva) |
| **PEDIDO PC:** abrir en Chrome la RND 102600000038 (`impuestos.gob.bo/index.php/rnd-2026/`, enlace «Abrogación») y la 102600000039 del 9-oct y pegar el texto — *para confirmar o corregir las frases 18 y 19, que hablan de una norma como si se hubiera leído* | **La madre** (desde la PC) |
| B-01, C-01, E-01, E-10, L-04 y L-05 en ✅ con la cuenta demo | **Plataforma**; **Sergio Urcullo** en L-04 (20 o 30) |
| 20 o 30 minutos; contestar el sábado de tarde y el domingo | **Sergio Urcullo** |

## 5. Lo que esta lista no sabe

La respuesta del LLM (solo reformula la pregunta pendiente y los guardrails descartan promesas), el primer mensaje de la plantilla de Chatwoot (ADQ §5.5), que producción sirva hoy este mismo conocimiento (`knowledge.onia.json` 2026-10-03.2) ni los horarios reales del VPS. **Los «Código:» de V01 son de otro repo y no se verificaron desde aquí.** Hallazgos del flujo (botones de la bienvenida de Meta, espera de ~47 h, «¿puedo probarlo gratis?»): `BOT-RESPUESTAS-D7-D11.md`.
