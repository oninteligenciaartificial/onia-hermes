# LISTA PARA MOSTRAR: respuestas del bot prueba 1

> **11-oct-2026 · Ventas y pauta · encargo de la MADRE MARKETING.** Las respuestas del bot que recibe quien escribe el precargado de **D7, D9, D10 y D11** (y D8, igual), **frase por frase**, contra `ONIA_CATALOGO_DE_VENTA.md` y `ONIA_PROMESA_VS_PRODUCTO.md` (con el «Código:» de V01, de `onia-platform` a7d8c1ed, **que no se pudo abrir desde aquí**).
> **No se tocó el bot ni su conocimiento.** Una fuente del bot lleva la firma humana de Sergio Urcullo (`FIRMA_HUMANA`): lo de abajo son **propuestas**. Medido con el motor real (`bot-engine.mjs`) y la config del repo, no con producción: `scripts/simular-bot.mjs`. La primera columna es **el texto literal del bot** y un test (`campana-lista.test.mjs`) falla si esa frase deja de ser la que el bot dice.
> Los cinco códigos reciben **la misma respuesta**: el código solo etiqueta el origen (`pieceKey = anuncio-Dn`).

## 1. El conteo (21 frases)

| ✅ sin problema | 🟡 a medias | ⬜ sin verificar | ❌ el catálogo no deja decirlo |
|---|---|---|---|
| **10** | **1** | **8** | **2** |

**Lo que sí frena:** dos frases de la respuesta al **precio** (14 y 15) venden el agente de WhatsApp, que el catálogo §5 marca ⏸ y la tabla marca ❌ (J-01, J-07, K-13). **Un lead de pauta que pregunta «¿cuánto cuesta?» las recibiría según el repo (no se verificó producción).** El detector de promesas no las ve porque son precio, no «promete». **Pisan una decisión anterior del dueño** (ver bajo la tabla del precio): la decide Sergio Urcullo, no esta lista. **Lo demás no frena la prueba:** son frases que pasan a ✅ cuando Plataforma mire las filas con la cuenta demo, o decisiones de Sergio Urcullo.

## 2. Frase por frase

**Estados:** ✅ coincide con una fila ✅ o no promete nada · 🟡 la fila está a medias · ⬜ la fila sigue sin verificar, falta la cuenta o la fuente · ❌ la fila dice que no se puede prometer.

### Al escribir el precargado (dos mensajes: `M0_PERSONA` y `R_CAMPANA`)

| # | Frase del bot | Fila(s) · «Código:» de V01 | Estado | Corrección propuesta |
|---|---|---|---|---|
| 1 | «¡Hola! Soy el asistente automático de Onia. Sí, un bot.» | Regla D2 del bot (se declara bot). Sin fila de promesa | ✅ | — |
| 2 | «Onia es una plataforma por módulos para que su negocio trabaje adentro: agenda, cobros y clientes en un solo lugar.» | **B-01** agenda ⬜ (`AgendaClient.tsx:180`, `crear-cita.ts:80`) · **E-01** cobros ⬜ (`NewInvoiceClient.tsx:31`, `api/payments/route.ts:36`) · **C-01** clientes ⬜ (`patients/page.tsx:119`, `FichaVista.tsx:99`) · catálogo §4 ✅ sale | ⬜ | Ninguna de texto: pasa a ✅ cuando Plataforma mire B-01, E-01 y **C-01** con la demo. **C-01 no estaba entre las filas exigidas: se suma** |
| 3 | «Le muestro cómo quedaría en SU negocio en 30 minutos por videollamada.» | **L-04** 🟡 (la web y el bot dicen 30 —decidido el 6-ago, `config.mjs`—; la agenda `/llamada`, el VSL y los mensajes salientes de Sergio Urcullo dicen 20). «Cómo quedaría en SU negocio» no tiene fila | 🟡 | «Le muestro cómo funciona Onia en 30 minutos por videollamada y vemos si le sirve a su negocio.» (**se conserva «30 minutos»**: quitarlos no unifica nada, lo que hay que cambiar es el 20 de los otros materiales; se saca «cómo quedaría en SU negocio», que promete personalización sin cuenta demo) |
| 4 | «El horario lo coordina directo con Sergio: le escribe por este mismo chat.» | Sin fila: es el compromiso de Sergio Urcullo (fila 6 del go/no-go) | ⬜ | Ninguna de texto. Depende de que conteste |
| 5 | «Gracias por escribir desde el anuncio.» | Sin fila | ✅ | — |
| 6 | «Para que Sergio llegue a la demo con el caso de su clínica, cuénteme dos cosas: ¿cuántos profesionales atienden y quién agenda las citas?» | Preguntas 1 y 2 de `ONIA_CLIENTE_IDEAL.md` §9. «Con el caso de su clínica» es la misma personalización de la 3 y no tiene fila | ⬜ | Ninguna de texto: es el compromiso de Sergio Urcullo de preparar el caso. Si se quiere sacar: «Para que Sergio llegue a la demo sabiendo de su clínica, …» |
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
| 11 | «Onia no es una clínica: hacemos el sistema con el que las clínicas organizan su agenda y sus pacientes, así que por acá no le puedo dar un turno ni atenderle.» | **B-01** ⬜ y **C-01** ⬜ (mismos «Código:» que la 2). «Las clínicas organizan» suena a uso real y el catálogo §8 no deja decir «que ya lo usan clínicas» | ⬜ | «…hacemos el sistema con el que una clínica organiza su agenda y sus pacientes, …». Pasa a ✅ con B-01 y C-01 |
| 12 | «Ya le pasé su consulta con todo lo que me contó.» | Sin fila de promesa: es un hecho del propio bot, que solo prueban sus tests (`bot-engine.test.mjs`, `handoff-sin-humano-no-es-silencio.test.mjs`); no se verificó en producción | ✅ | — |

### Si pregunta el precio (`M4_BODY`, la FAQ «precios»)

| # | Frase del bot | Fila(s) | Estado | Corrección propuesta |
|---|---|---|---|---|
| 13 | «el sistema arranca en Bs 320 al mes con el plan Básico, Bs 550 el Crece, Bs 890 el Profesional y Bs 1.290 el Completo» | **K-01** ✅ visto, **K-03** ✅ (precios finales en Bs). Los ata `precios-publicos.test.mjs` a `subscription-plans.ts` | ✅ | — |
| 14 | «que ya trae el chatbot de WhatsApp adentro.» | **J-01** ❌ · **K-13** ❌ · **K-14** ❌ · catálogo §5: agente de WhatsApp ⏸ «hasta conectar el WhatsApp de un cliente real» | ❌ | **Quitar la cláusula.** «…y Bs 1.290 el Completo.» |
| 15 | «En el Básico, el Crece y el Profesional el chatbot va aparte, Bs 390 al mes.» | **J-07** ❌ («Precio del agente: Bs 390/mes») · **J-01** ❌ | ❌ | **Quitar la oración.** Lo que el catálogo no tiene listo no se nombra en la venta (CLAUDE.md, «La venta nunca exhibe obra») |
| 16 | «la lista completa y al día está en onia.com.bo/precios.» | **K-01** ✅ | ✅ | — |
| 17 | «Sergio se lo muestra funcionando con SUS números en una demo.» | «Con SUS números» es la misma personalización de la 3 y no tiene fila (**L-05** habla de «clínica de ejemplo», no de esto) | ⬜ | «Sergio se lo muestra funcionando en una demostración.» |

**Lo que las frases 14 y 15 pisan.** El bot nombra el chatbot cuando preguntan el precio **por una decisión del 3-sep de la sesión de control «en nombre de Sergio Urcullo»** (`precios-publicos.mjs`, líneas 2-6; `config.mjs`, líneas 259-260; `CLAUDE.md`: «el chatbot es un add-on»). El catálogo del 1-oct (§5: agente de WhatsApp ⏸) y las filas J-01, J-07 y K-13 son **posteriores** y dicen lo contrario, y `PROMESA` §3 deja la decisión a Sergio Urcullo. **Esta lista no la toma: la propone.** Si Sergio Urcullo la acepta: (1) `precios-publicos.test.mjs` (línea 211) exige «390» y se pondrá rojo, hay que actualizarlo; (2) **hay que arreglar antes `/precios`** (`precios/page.tsx` sigue vendiendo el add-on y la frase 16 apunta ahí), si no el bot dice una cosa y la página la contraria.

### Si pregunta por el SIAT o la facturación en línea (FAQ «siat»)

| # | Frase del bot | Fila(s) | Estado | Corrección propuesta |
|---|---|---|---|---|
| 18 | «la RND 102600000038 dejó sin efecto el plazo del 1 de octubre de 2026 de los grupos 9.º al 12.º de contribuyentes.» | **L-10** ✅ visto. La fuente de la web (`siat.ts`) dice: verificada el 3-oct contra el texto del PDF del SIN por dos verificadores; `ONIA_FACTURACION_ESTADO_REAL.md` §2.6: «texto leído el 3-oct». Mi lectura desde aquí no fue posible (el servidor del SIN devolvió su página en vez del PDF, 4 intentos); la lista oficial confirma el título del 30-sep | ✅ | — *(salvedad: la RND 102600000039, del 9-oct, no se miró)* |
| 19 | «Esa norma dice que el SIN asignará periódicamente una modalidad en línea, sin fecha fija, a los contribuyentes del IVA que no habían implementado ninguna» | **L-10** ✅; coincide con el Par. II que citan `siat.ts` y `ONIA_FACTURACION_ESTADO_REAL.md` §2.6 | ✅ | — *(misma salvedad: RND 039)* |
| 20 | «el Servicio de Impuestos tiene un portal gratuito para facturar.» | **L-10** ✅; `siat.ts` («¿Puedo cumplir gratis? Sí… Portal Web») y `ONIA_SIAT_ESTADO_HOMOLOGACION.md`: «el portal gratuito no depende de nuestra autorización» | ✅ | — |
| 21 | «Onia le ordena ventas y compras; la factura fiscal se emite aparte, en ese portal.» | **E-10** ⬜ («registro de ventas y compras con detalle»; sin `Código:` de V01). Que la factura fiscal se emite aparte coincide con el catálogo §7 y `ONIA_SIAT_ESTADO_HOMOLOGACION.md` («la emisión en el Portal Web del SIN sigue siendo manual») | ⬜ | Ninguna de texto: pasa a ✅ con E-10 |

## 3. Los textos corregidos, listos para la firma de Sergio Urcullo

Cada uno es el texto actual **menos** lo que está en ❌ o lo que promete personalización sin fila, sin agregar nada (`{{humano}}` es la variable que el bot reemplaza por «Sergio»). Un test (`campana-lista.test.mjs`) los pasa por el detector de promesas y exige que no tengan voseo ni minutos ni el agente de WhatsApp.

**Línea 3 de `M0_PERSONA`:**

> Le muestro cómo funciona Onia en 30 minutos por videollamada y vemos si le sirve a su negocio.

**FAQ «precios» (`knowledge.onia.json`):**

> Se los paso derecho, son públicos: el sistema arranca en Bs 320 al mes con el plan Básico, Bs 550 el Crece, Bs 890 el Profesional y Bs 1.290 el Completo.
>
> Cuál le sirve depende de cuántos son y de qué módulos active, así que la lista completa y al día está en onia.com.bo/precios. Si quiere, {{humano}} se lo muestra funcionando en una demostración.

**FAQ «siat»:** sin cambios (las frases 18 a 20 están ✅ por L-10). Salvedad: mirar la RND 102600000039 del 9-oct.

**Mismo archivo, misma firma:** `knowledge.onia.json` (línea 7), en la respuesta a «Hola, quiero conocer Onia» (la web, no el anuncio), dice «hay agentes que contestan por WhatsApp, como le estoy contestando yo»: otro caso de **J-01 ❌**. Se firma junto con lo de arriba.

**Si se decide, en `R_CAMPANA`/M7:** el horario de oficina con el sábado de tarde y el domingo (decisión de Sergio Urcullo; no hay texto que proponer sin saber qué decide).

## 4. Qué depende de quién

| Qué | Quién |
|---|---|
| **Firmar y publicar** los tres textos de §3 (una fuente del bot lleva firma humana: `publicar-solo.sh`, `FIRMA_HUMANA`) | **Sergio Urcullo** y el carril chatbot (hoy sin sesión viva) |
| **PEDIDO PC:** abrir en Chrome la RND 102600000039 del 9-oct (`impuestos.gob.bo/index.php/rnd-2026/`) y pegar el texto — *para ver si cambia algo de lo que dicen las frases 18 a 20 (la 038 ya la leyó el carril fiscal el 3-oct)* | **La madre** (desde la PC) |
| B-01, C-01, E-01 y E-10 en ✅ con la cuenta demo; **L-05** si se vuelve a ofrecer «una clínica de ejemplo» | **Plataforma**; **Sergio Urcullo** en L-04 (20 o 30) |
| 20 o 30 minutos (hoy: web y bot 30; `/llamada`, VSL y mensajes salientes 20); contestar el sábado de tarde y el domingo | **Sergio Urcullo** |

## 5. Lo que esta lista no sabe

La respuesta del LLM (solo reformula la pregunta pendiente y los guardrails descartan promesas), el primer mensaje de la plantilla de Chatwoot (ADQ §5.5), que producción sirva hoy este mismo conocimiento (`knowledge.onia.json` 2026-10-03.2) ni los horarios reales del VPS. **Los «Código:» de V01 son de otro repo y no se verificaron desde aquí.** Hallazgos del flujo (botones de la bienvenida de Meta, espera de ~47 h, «¿puedo probarlo gratis?»): `BOT-RESPUESTAS-D7-D11.md`.
