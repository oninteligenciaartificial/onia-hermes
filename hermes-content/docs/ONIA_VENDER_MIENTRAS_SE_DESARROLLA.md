<!-- Fuente de verdad, sin fecha: se EDITA, no se reemplaza. Playbook operativo de
"desarrollar y vender AL MISMO TIEMPO". Construye ENCIMA de
ONIA_TEMAS_CHARLA_CONTESTADOS.md (grupos A y E, que ya traen su evidencia — acá no
se repite) y de ONIA_ESTRATEGIA_DE_EMPRESA.md (etapa 1 vigente: cerrar 5 clientes
con la 1.0; el techo son horas). Los precios NO viven acá: se leen de
onia-platform/lib/subscription-plans.ts y lib/pricing.ts. -->

# Vender mientras se desarrolla — el playbook operativo

**La tesis en una línea:** construir ya sobra; lo que falta es vender. Entonces el reparto
es total: **Sergio Urcullo vende con el 100% de sus horas de Onia, y la IA desarrolla con
el 100% de las suyas.** Ni una hora humana en código, ni un mensaje de venta escrito por
un bot sin revisar.

**El canon que respalda esto no es opinión:** YC reduce la etapa temprana a dos
actividades — escribir código y hablar con usuarios; todo lo demás es distracción
(https://www.michaelseibel.com/blog/yc-s-essential-startup-advice). Paul Graham agrega que
las startups no despegan solas: los fundadores las arrancan a manivela, reclutando
usuarios **a mano, uno por uno**, aunque no escale
(https://paulgraham.com/ds.html). Onia tiene una ventaja que ninguno de esos ensayos
contempló: acá "escribir código" lo hace la IA. Eso libera a la única persona del equipo
para hacer lo único que la IA no puede: **que un dueño de negocio boliviano confíe y pague.**

**Estado de partida (2026-09-12, medido, no recordado):** 1.0 publicada
(`app.onia.com.bo` + `onia.com.bo`), escalera C viva en
`onia-platform/lib/subscription-plans.ts` (`DEFAULT_PLAN_AMOUNTS`: básico 320 · crece 550 ·
profesional 890 · clínica 1.290 Bs/mes, chatbot incluido en el plan alto; add-on suelto
Bs 390/mes en `lib/pricing.ts`), cobro por QR probado punta a punta el 10-sep (fila
`APPROVED` real), WhatsApp del bot funcionando (probado sintético 10-sep), **0 clientes
pagando y 7 leads sin respuesta** (`ONIA_LEADS_ESPERANDO.md`).

---

## 1. El principio del reparto — quién hace qué, sin zona gris

| | **Sergio Urcullo (100% venta)** | **La IA (100% desarrollo)** |
|---|---|---|
| Hace | Demos, WhatsApp con leads, seguimiento, cerrar, cobrar, escuchar objeciones | Código, fixes, colas, deploy, contenido de soporte (capturas, respuestas modelo, knowledge del bot), material de venta NUEVO cuando Sergio lo pida |
| NO hace | Codear, revisar PRs, escribir docs técnicos, "mejorar una cosita" del producto | Hablar con un cliente, mandar un mensaje de venta, prometer nada |
| Su unidad de medida | conversaciones, demos, pagos | ítems de cola cerrados y verificados en producción |

**Las tres reglas de la interfaz entre los dos:**

1. **Sergio Urcullo no arregla: reporta.** Un bug visto en demo o un pedido de cliente va
   a la cola del carril (`hermes-content/docs/cola/`) con la cita textual — nunca se mete
   él a tocarlo. La tentación de "lo arreglo yo rapidito" es la más cara del sistema:
   cada hora suya de código es una hora menos del único vendedor del país.
2. **La IA no improvisa con clientes.** El bot responde SOLO desde su conocimiento
   versionado (regla ya escrita en `ONIA_TEMAS_CHARLA_CONTESTADOS.md`, grupo B: el bot
   que "aprende solo" es el bot que inventa precios, y Air Canada pagó lo que su bot
   prometió). Todo mensaje humano lo manda Sergio Urcullo.
3. **El techo del negocio son las horas humanas** (`ONIA_ESTRATEGIA_DE_EMPRESA.md` §9:
   una persona topa en 30-50 clientes por soporte). Vender también las consume — por eso
   la venta va en **bloques fijos** (§2), no "cuando haya un rato". Lo que no cabe en los
   bloques, no se hace esa semana.

**Por qué el que vende es el fundador y no se delega:** en el relevamiento de Lenny
Rachitsky sobre cómo las B2B de más rápido crecimiento consiguieron sus primeros 10
clientes, la constante es una sola — el CEO en persona hizo el contacto, la comunidad y
la relación; ninguno lo delegó
(https://www.lennysnewsletter.com/p/how-to-win-your-first-10-b2b-customers). La regla de
la casa ya lo fijó: no hay equipo de ventas (`hermes-content/sales-kit/README.md`).

---

## 2. La semana tipo de Sergio Urcullo — 6 a 8 horas, compatible con estudiar

El benchmark de un founder vendiendo solo es **~10 demos al mes (2-3 por semana)**, con
revisión semanal del pipeline desde el día uno aunque tenga 5 tratos adentro
(https://www.dorianbarker.com/blog/founder-led-sales). Esta semana tipo cabe en eso:

| Bloque | Cuándo | Cuánto | Qué se hace |
|---|---|---|---|
| **Ventana WhatsApp 1** | lun-vie, mediodía | 30 min | Responder TODO lo entrante. Ningún lead pasa de 24 h sin respuesta humana |
| **Ventana WhatsApp 2** | lun-vie, 19:00-19:30 | 30 min | Segundo barrido + confirmar demos del día siguiente |
| **Demos** | mar y jue, 18:00-19:30 | 2×90 min | 2-3 demos de 20 min c/u con el guion (`sales-kit/02-GUION-DEMO.md`), colchón entre una y otra |
| **Seguimiento** | viernes | 45 min | Recorrer la lista completa: toque 2 y 3 a los fríos, mover estados |
| **Prospección** | sábado | 60-90 min | 10 contactos nuevos (clínicas dentales/estéticas de Santa Cruz) con `sales-kit/03-SCRIPTS-WHATSAPP.md` |
| **Revisión semanal** | domingo | 20 min | Anotar los 3 números (§3) y las objeciones repetidas (§4). Pasarle la lista a la IA |

**Total: ~6,5-8 h/semana.** Todo lo demás de la semana es estudio y vida — y desarrollo
de la IA, que no le pide horas a nadie.

**Las dos reglas de velocidad que más pagan en WhatsApp:**

- **Responder rápido vale más que responder perfecto.** Contestar en menos de 5 minutos
  hace ~21x más probable calificar al lead que contestar a los 30
  (https://www.trysetter.com/blog/whatsapp-business-statistics); el 80% de los mensajes de
  WhatsApp se leen en los primeros 5 minutos
  (https://searchlab.nl/en/statistics/whatsapp-business-statistics-2026). Si suena en una
  ventana, se contesta en la ventana. Fuera de ventana, el bot sostiene (para eso está) y
  Sergio Urcullo remata en la siguiente.
- **Tres toques y a la lista fría.** Contacto → +2 días → +7 días. Sin respuesta al tercer
  toque, el lead queda en frío y se deja de perseguir (Meta además exige plantilla pagada
  pasadas 24 h de la última respuesta del cliente — perseguir cuesta plata). La lista fría
  se recalienta con novedad real (un rubro nuevo encendido, un caso), no con "¿viste mi
  mensaje?".

---

## 3. El embudo mínimo — con lo que YA existe, pieza por pieza

Nada de este embudo hay que construirlo. Cada eslabón está vivo y verificado:

```
lead entra (web / WhatsApp / prospección de Sergio)
   │  el BOT contesta 24/7, califica y junta datos      ← vivo (probado 10-sep)
   ▼
Sergio Urcullo responde humano en su ventana            ← sales-kit/03-SCRIPTS-WHATSAPP.md
   ▼
DEMO de 20 minutos (video-llamada o presencial)         ← sales-kit/02-GUION-DEMO.md
   │  objeciones: sales-kit/04-OBJECIONES.md
   │  capturas listas: sales-kit/05-CHECKLIST-CAPTURAS.md
   ▼
TRIAL 14 días — se registra SOLO en app.onia.com.bo     ← alta abierta, asistente 2 pasos
   │  seguimiento al día 3 y al día 10 (¿cargó datos? ¿creó una cita?)
   ▼
COBRO por QR                                            ← E2E probado 10-sep, APPROVED
   ▼
fila APPROVED en subscription_payments = CLIENTE
```

**El ciclo esperable, para no desesperar ni dormirse:** en SMB con tickets chicos
(<US$15K anuales — y el de Onia es MUY menor) el ciclo mediano es de **14 a 40 días** del
primer contacto al cierre (https://getboomerang.ai/glossaries/b2b-sales-cycle-benchmarks-2026,
https://optif.ai/learn/questions/sales-cycle-length-benchmark/). Con trial de 14 días en el
medio: **el primer pago realista está a 2-6 semanas de la primera demo.** Si a la semana 8
de vender en serio no hay ni un pago, el problema es real y se diagnostica — no se tapa
con más features.

### Los 3 números de la revisión del domingo — y ninguno más

| # | Número | Qué pregunta responde | Dónde se lee |
|---|---|---|---|
| 1 | **Conversaciones de venta trabajadas** (nuevas + seguimientos hechos) | ¿entró combustible al embudo? | WhatsApp + Chatwoot, contadas a mano (2 min) |
| 2 | **Demos hechas** | ¿el embudo avanza? | agenda de la semana |
| 3 | **Pagos APPROVED** | ¿existe el negocio? | `subscription_payments` (comando en `ONIA_ESTRATEGIA_DE_EMPRESA.md` §17) |

La aritmética de referencia del canon: un motor founder-led típico convierte
~10 demos → 2 pilotos → 1 cliente pago
(https://www.dorianbarker.com/blog/founder-led-sales). A 2-3 demos/semana eso es **~1
cliente nuevo al mes vendiendo a puro frío** — y mejor con leads calientes, que es
exactamente lo que hay esperando. Para el break-even la fórmula es la de
`ONIA_ESTRATEGIA_DE_EMPRESA.md` §4 (`gasto mensual ÷ precio del plan`), recalculada con
los precios leídos hoy de `DEFAULT_PLAN_AMOUNTS`: Bs 3.650 ÷ 890 ≈ **5 clientes
profesional**, ÷ 550 ≈ 7 crece, ÷ 320 ≈ 12 básico. Si los precios cambian, se recalcula —
no se corrige este párrafo a mano.

**Los primeros 3-5 clientes se tratan como design partners — pero PAGANDO.** El formato
design partner (acceso directo al fundador, influencia real en el roadmap, arranque
acompañado) es la vía más corta a product-market fit en B2B
(https://www.unusual.vc/field-guide/build-a-sales-motion-with-design-partners-for-a-b2b-product/).
Lo que NO se copia es regalarlo: el que no paga nada no valida nada — pedir plata desde el
inicio es la única señal de demanda que no miente; las cartas de intención y los pilotos
gratis son el camino clásico a la validación falsa
(https://leanb2bbook.com/blog/the-3-approaches-to-selling-your-first-product/). El trial de
14 días ya es toda la gratuidad que ofrece Onia.

**Y el precedente regional de que esto funciona así:** Leadsales (México) arrancó
bootstrapped viendo que los negocios chicos se pasaban a vender por WhatsApp sin
herramienta, y llegó a 1.400 clientes y US$1,6M de ARR antes de tocar capital
(https://techcrunch.com/2023/08/28/whatsapp-leadsales-conversational-commerce/). El canal
de Onia es el mismo y el comprador es el mismo. En LatAm el WhatsApp no es un canal más:
es EL canal (https://abreu.substack.com/p/the-potential-of-whatsapp-native).

---

## 4. La venta manda el roadmap — el circuito objeción → cola

**La regla:** una objeción o un pedido que aparece **2 veces en leads distintos** deja de
ser anécdota y se vuelve ítem de cola. Una vez = ruido; dos veces = patrón.

El circuito, paso a paso:

1. En la revisión del domingo (§2), Sergio Urcullo anota las objeciones de la semana
   **con la cita textual del cliente** — no la interpretación ("quiere reportes" no; *"¿me
   avisa solo si un paciente canceló y no reprogramó?"* sí).
2. La repetida 2 veces entra a `hermes-content/docs/cola/` del carril que corresponda,
   con las citas y de qué lead vienen. **La prioriza la venta, no la elegancia técnica.**
3. La IA la desarrolla, la verifica en producción y avisa. Recién ahí Sergio Urcullo
   vuelve al lead: "ya está, mirá" — que es el mejor mensaje de seguimiento que existe.

**El ejemplo ya está vivo y es oro:** las 6 preguntas del lead 35 (clínica odontológica de
4 doctores, `ONIA_LEADS_ESPERANDO.md`) son una spec escrita por el mercado — lista de
pacientes con tratamiento pendiente y sin próxima cita, por períodos, con alerta
automática. Nadie adentro habría priorizado eso con esa precisión. Así se ve "la venta
manda el roadmap" cuando funciona.

**La cara B de la regla — cómo NO prometer:** cuando un lead pide algo que el producto no
tiene, la respuesta tiene exactamente dos partes y ninguna más:

> "Hoy el sistema hace [lo que SÍ hace, concreto]. Lo que me pedís lo anoto y te aviso
> yo si sale."

- **Ni "está en camino", ni "el mes que viene", ni "estamos trabajando en eso".** La regla
  de la casa es absoluta: la venta nunca exhibe obra (`CLAUDE.md` §3) — y prometer
  fechas de features es exhibir obra con agravante, porque convierte el roadmap en deuda
  con terceros y cada demo siguiente en una rendición de cuentas.
- Se vende lo VIVO. Si lo pedido 2 veces se construye y verifica, el aviso al lead es una
  alegría, no el pago de una promesa vencida.

---

## 5. Los primeros 14 días — empezando mañana, día por día

Arranque: **domingo 13-sep-2026** (el día después de AgenTICs). Cada día dice qué hace
Sergio Urcullo y qué hace la IA. Lo de la IA se pide como ítems de cola, no se supervisa
línea por línea.

**El gate previo — "el chatbot perfecto", en versión medible.** Sergio Urcullo puso la
condición: a los 3 leads de agosto no se les escribe hasta que el chatbot esté perfecto.
"Perfecto" no es una sensación; es esta checklist, toda verificable MIRANDO:

- [ ] Knowledge del bot publicado con la **escalera C vigente** (320/550/890/1.290) — la
      memoria del carril registra que el knowledge vivo quedó en agosto y se publica a
      mano: es la primera tarea de la IA.
- [ ] El bot responde bien las **6 preguntas del lead 35** en el probador (son el examen
      más duro que el mercado le tomó hasta hoy).
- [ ] Barrido del embudo: cero plantillas rotas, cero respuestas que inventen precios o
      capacidades, horarios de demo no vencidos.
- [ ] WhatsApp real: probado (10-sep ya pasó sintético) + regla de >24 h por plantilla
      operando.
- [ ] Sergio Urcullo lo usó él mismo como si fuera un dueño de clínica y no lo hizo
      quedar mal. **Su ojo es el gate final, no un test automático.**

| Día | Sergio Urcullo (venta) | IA (desarrollo) |
|---|---|---|
| **D1 · dom 13** | 1 h: releer `sales-kit/01-ONE-PAGER-OFERTA.md`, `02-GUION-DEMO.md` y `04-OBJECIONES.md`. Fijar en su calendario las ventanas y los bloques de demo del §2 | Actualizar y publicar el knowledge del bot con escalera C; preparar respuestas a las 6 preguntas del lead 35 |
| **D2 · lun 14** | Arrancan las 2 ventanas WhatsApp diarias. Mensaje post-AgenTICs a los embajadores (Lira de la Vega, Florida) con el bot vivo — el grupo E ya lo mandó: HACER YA esta semana | Barrido completo del embudo del bot; capturas frescas según `sales-kit/05-CHECKLIST-CAPTURAS.md` |
| **D3 · mar 15** | **El gate:** probar el bot de punta a punta como cliente. Si pasa → escribir a los **3 leads de agosto** (`access_requests`) con `03-SCRIPTS-WHATSAPP.md`, empezando por Maximo Romano (clinica klein, 21-ago: el primer registro real y el que más esperó). Marcar `contactedAt` | Si el gate falla en algo, arreglarlo HOY; el gate se repite D4 |
| **D4 · mié 16** | Responder al **lead 35** (clínica de 4 doctores) contestando sus 6 preguntas por escrito — esa respuesta ES la demo. Escribir también a los leads 37 (mariohassen) y 36 (el del correo dentro del mensaje) | Ítems de cola que salgan del gate; nada nuevo |
| **D5 · jue 17** | Primer bloque de demos (2 slots ofrecidos a los que contestaron). Toque 2 a los que no | Lo que las demos revelen, a la cola |
| **D6 · vie 18** | Bloque de seguimiento: estados al día, objeciones anotadas con cita textual | — |
| **D7 · sáb 19** | Prospección: 10 clínicas dentales/estéticas de Santa Cruz, primer contacto por WhatsApp/IG. Dom 20: **revisión semanal 1** — los 3 números | Primer ítem "objeción repetida", si ya lo hay |
| **D8-D12 · lun 21-vie 25** | Semana tipo completa (§2): ventanas diarias, demos mar/jue, toque 3 a los fríos, seguimiento a trials activos (día 3: ¿cargó datos?) | Cola ordenada por lo que la venta trajo, no por lo pendiente técnico |
| **D13 · sáb 26** | Prospección: 10 contactos nuevos más | — |
| **D14 · dom 27** | **Revisión de la quincena** contra las metas de abajo. Lo que no se cumplió se dice explícito, con causa | — |

**Metas medibles de la quincena** (pipeline, no milagros — el ciclo SMB no cierra en 14
días y prometer un pago sería mentirse):

- **17 leads trabajados**: los 7 que esperan + ~10 nuevos de prospección.
- **≥ 4 demos hechas.**
- **≥ 1 trial activo con datos reales cargados** (no un registro vacío).
- **0 leads con más de 24 h sin respuesta humana** en días hábiles.
- **Toda objeción repetida convertida en ítem de cola** con su cita.

---

## 6. Qué NO hacer — las cinco trampas, con nombre y fuente

1. **La trampa de los servicios.** Cerrar una venta prometiendo "te lo adapto", "te lo
   configuro yo", "te hago también la web" convierte el SaaS en una consultora con
   disfraz: cada cliente nuevo obliga a re-construir la empresa, y el margen del 99% se
   evapora en horas del fundador
   (https://www.startupfolsom.org/blog/service-as-a-software-the-startup-trap-that-looks-like-saas-but-scales-like-consulting,
   https://www.entrepreneur.com/starting-a-business/what-building-both-a-services-firm-and-saas-taught-me-about/504188).
   El filtro ya existe y es de la casa: el test de las tres preguntas
   (`ONIA_ESTRATEGIA_DE_EMPRESA.md` §10). Si la venta exige horas de Sergio Urcullo por
   cliente, no es una venta: es un empleo nuevo.
2. **Vender humo.** El "sell before you build" honesto existe: es cobrar por lo que está
   VIVO y dejar que lo pedido repetido mande el roadmap (§4). El deshonesto es vaporware:
   cobrar o prometer sobre lo que no existe — la palabra nació justamente de startups
   cobrando pre-ventas de software en fase de concepto
   (https://en.wikipedia.org/wiki/Vaporware). La línea de Onia ya está trazada dos veces:
   no fabricar (cero testimonios ni cifras inventadas, `sales-kit/README.md`) y la venta
   nunca exhibe obra (`CLAUDE.md` §3). Entre las dos queda el único terreno permitido:
   **hablar solo de lo que se puede mostrar en pantalla hoy.**
3. **Regalar para "validar".** Piloto gratis de 3 meses, descuento fundador del 50%,
   carta de intención "para cuando esté listo" — todo eso es validación falsa: el que no
   pone plata no dijo que sí, dijo que no le molesta
   (https://leanb2bbook.com/blog/the-3-approaches-to-selling-your-first-product/). El
   trial de 14 días es la única gratuidad. Precio de lista, sin excepciones — la regla de
   la etapa 2 (`ONIA_ESTRATEGIA_DE_EMPRESA.md` §7) empieza a practicarse desde el cliente 1.
4. **Delegar o automatizar la venta antes de tiempo.** Ni contratar vendedor (regla de la
   casa: no hay equipo de ventas), ni mandar cold email masivo, ni prender ads: en el
   relevamiento de Lenny los primeros 10 clientes salieron de red directa, outbound
   personal del founder y comunidad — canales de confianza, trabajados a mano
   (https://www.lennysnewsletter.com/p/how-to-win-your-first-10-b2b-customers,
   https://www.lennysnewsletter.com/p/how-todays-fastest-growing-b2b-businesses). Un
   vendedor se contrata cuando el fundador ya cerró suficientes tratos como para
   entregarle un proceso repetible — no antes.
5. **Dejar que un lado se coma al otro.** Si Sergio Urcullo "ayuda un poquito" con el
   código, la semana de venta desaparece (es el patrón medido en el reel del 3-sep: 7% de
   commits al producto, 46% de vueltas vacías). Si la IA se pone a construir lo que nadie
   pidió, la cola de la venta espera. El reparto del §1 es binario a propósito: cada uno
   su 100%, y el domingo se cruzan en la revisión.

---

## Documentos relacionados

`ONIA_ESTRATEGIA_DE_EMPRESA.md` (etapa vigente, break-even, techo de horas, test de 3
preguntas) · `ONIA_TEMAS_CHARLA_CONTESTADOS.md` (grupos A y E: pricing, plan anual,
contador de valor, embajadores — con su evidencia) · `ONIA_LEADS_ESPERANDO.md` (los 7,
con datos de contacto) · `hermes-content/sales-kit/` (01 oferta · 02 guion demo · 03
scripts WhatsApp · 04 objeciones · 05 capturas) · `ONIA_CATALOGO_DE_VENTA.md` (qué está
🟢) · precios: `onia-platform/lib/subscription-plans.ts` + `lib/pricing.ts`.

## Fuentes externas (consultadas 2026-09-12)

- Paul Graham, *Do Things That Don't Scale* — https://paulgraham.com/ds.html
- YC, *Essential Startup Advice* (código + usuarios, nada más) — https://www.michaelseibel.com/blog/yc-s-essential-startup-advice
- First Round Review, founder-led sales — https://review.firstround.com/articles/founder-led-sales/
- Lenny Rachitsky, *How to win your first 10 B2B customers* — https://www.lennysnewsletter.com/p/how-to-win-your-first-10-b2b-customers · casos: https://www.lennysnewsletter.com/p/how-todays-fastest-growing-b2b-businesses
- Unusual Ventures, design partners para B2B — https://www.unusual.vc/field-guide/build-a-sales-motion-with-design-partners-for-a-b2b-product/
- LeanB2B, las 3 formas de vender el primer producto (pre-venta honesta; LOI = validación falsa) — https://leanb2bbook.com/blog/the-3-approaches-to-selling-your-first-product/
- Cadencia founder-led (200 cuentas → 10 demos → 2 pilotos → 1 cliente) — https://www.dorianbarker.com/blog/founder-led-sales · https://thegtmnewsletter.substack.com/p/founder-led-sales-playbook-repeatable-motion
- Ciclo de venta SMB (14-40 días en tickets chicos) — https://getboomerang.ai/glossaries/b2b-sales-cycle-benchmarks-2026 · https://optif.ai/learn/questions/sales-cycle-length-benchmark/
- WhatsApp: apertura ~98%, lectura en 5 min ~80%, responder <5 min ≈ 21x — https://searchlab.nl/en/statistics/whatsapp-business-statistics-2026 · https://www.trysetter.com/blog/whatsapp-business-statistics · https://raiontech.io/blog/whatsapp-response-rate-benchmarks-by-industry
- Caso LatAm: Leadsales, bootstrapped a 1.400 clientes y US$1,6M ARR vendiendo WhatsApp CRM a pymes — https://techcrunch.com/2023/08/28/whatsapp-leadsales-conversational-commerce/ · WhatsApp-native en LatAm — https://abreu.substack.com/p/the-potential-of-whatsapp-native
- La trampa de los servicios — https://www.startupfolsom.org/blog/service-as-a-software-the-startup-trap-that-looks-like-saas-but-scales-like-consulting · https://www.entrepreneur.com/starting-a-business/what-building-both-a-services-firm-and-saas-taught-me-about/504188
- Vaporware (definición y origen) — https://en.wikipedia.org/wiki/Vaporware
