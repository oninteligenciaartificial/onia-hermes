# ONIA vs. Dapta — ¿Unificar todo en una sola plataforma? Documento de decisión

> **Carril I (research/estrategia).** Fecha: 2026-07-23. No codea — entrega decisión.
> Disparador: Sergio sigue a Dapta (startup colombiana) y quiere evaluar si ONIA
> debería empaquetar todo (chatbots, SaaS/ERPs, automatización, webs) en UNA sola
> plataforma. Método: 5 lentes independientes (decoder-dapta · inventario-onia ·
> arquitecto-plataforma · pricing-packaging · escéptico) + síntesis.
>
> **Leyenda de anclaje:** `[Dapta]` dato real de dapta.ai · `[ONIA]` dato real del
> monorepo/CLAUDE.md/memoria · `[Sup]` supuesto a validar · `[?]` dato faltante que
> bloquea la decisión.

---

## 1. Qué vende Dapta, en una foto

Dapta **no construyó 15 productos: construyó un motor y 15 vidrieras**. El motor es un runtime de agentes conversacionales (voz + texto) con automatización de workflows y 300+ integraciones `[Dapta]`. Todo lo demás —AI Voice, Notetaker, Dapti, las páginas por industria (Education, Law, Real Estate…) y por departamento (Sales, HR, Cobranzas)— es **marketing y configuración sobre la misma primitiva**, no producto nuevo. La palanca que lo sostiene sin explotar en complejidad es una sola: **el crédito como moneda universal de consumo**. La página de precios tiene un eje (créditos), toda capacidad nueva se enchufa al mismo medidor sin retarifar, y regalan lo que el cliente teme que le limiten ("agentes y flujos ILIMITADOS") mientras cobran lo que escala con el valor entregado (ejecución).

La escalera esconde el truco final: **abajo pagás consumo, arriba pagás humanos**. Pro $99 y Scale $499 dan 100k→500k créditos `[Dapta]`, pero de Scale a Prime ($1.499) el precio 3x compra sobre todo **relación** (account manager, solutions engineer, Slack en vivo). El tope de la escalera es un negocio de servicios vestido de SaaS. Sus dos talones —que ONIA no debe heredar— son **la opacidad del consumo (bill shock)** y **la dependencia de humanos arriba (dilución de margen)**. Y ojo: los "30-50k clientes" `[Dapta]` casi seguro cuentan signups free — es vanity metric, no benchmark de retención.

---

## 2. El insight transferible a ONIA

Hay que separar **la mecánica (robable) del hype (trampa)**. Lo transferible, en orden de valor:

1. **Vendé un motor, comercializá N soluciones.** Desacoplá la superficie de producto de la de go-to-market. Construí horizontal (una vez), posicioná vertical (infinitas veces). Las páginas por industria/departamento son baratas; el motor es el activo. **ONIA ya hace la mitad de esto**: tracks verticales sobre un solo `contract.json`, nunca forks `[ONIA]`.
2. **Encontrá LA unidad de consumo y medí todo por ahí** — pero (ver §4 y §6) en ONIA esa unidad **mide costo interno y topa fair-use, NO es la unidad de venta**. Esta es la primera divergencia grande con Dapta.
3. **Hacé ilimitada la creación, medí el uso.** Regalar "agentes y flujos ilimitados" es honesto solo donde crear cuesta ≈0. En ONIA eso vale **para la capa de agentes**, no para los ERPs.
4. **Time-to-value obsesivo.** El "agente en 2 min" ES el embudo. ONIA puede ganarle en concreto porque arranca con **datos reales del cliente** (import de pacientes/deudores → primer cobro sugerido), no con un agente en blanco.
5. **Las integraciones son el moat, no la IA.** El modelo se comoditiza (OpenAI/Anthropic entran a agentes + voz). Lo defendible es estar cableado a las herramientas del cliente. En Bolivia el moat no son 300 integraciones: son **las ~12 que importan** (WhatsApp, SIAT, calendario, pasarela local, TR4).

**Lo que NO se transfiere:** el crédito como unidad de venta, el "ilimitado" aplicado a todo el catálogo, y el SLA <3min con humanos dedicados. Por qué, en §4.

---

## 3. ONIA hoy: qué ya es plataforma y qué está suelto

Inventario honesto (sin venta interna). Nota de drift documental real: el `contract.json` dice `v1.0.0 stable`, el `README` encabeza `v0.7.1 beta`, y el módulo `agents.json` está `v0.1.0 draft` `[ONIA]` — conviven tres números, y **la pieza que se vende como diferenciador (agents) es la menos terminada**.

| Capa | Qué hay | Estado real | ¿Plataforma o suelto? |
|---|---|---|---|
| **Motor horizontal** | onia-core (18 entidades, 9 módulos, 11 tracks, 4 adapters), Hermes (Python/VPS), n8n (11 workflows vivos), emisor SIAT | Core `stable` pero **congelado** (`installInProductRepos=false`); los productos **portan la lógica a mano** (mjs→ts) con anti-drift sha256. Hermes + n8n + agent runtimes SÍ corren 24/7 | **Plataforma en el PAPEL** (un contrato, tracks no forks). **NO en RUNTIME**: no hay servicio ni DB compartida |
| **Verticales/tracks** | DentalGest, GestiOS, ProveeGest, Ganadero + 7 rubros definidos | DentalGest `beta activa` (~90% vendible). GestiOS + Bolivian Electric `installing`. Ganadero `on hold`. Los 7 rubros nuevos son solo definición (vocabulario/KPIs), sin repo | **Suelto**: repos + DB separados, unidos por contrato, no por código corriendo |
| **Servicios** | Web Factory (+ Nuvia), generador de Propuestas, chatbots WhatsApp/Telegram | Vivos, atados a mano | **Suelto/atado**: comparten infra y cerebro, no producto |
| **Superficie de control** | ONIA Center ("sala de agentes" + cola de aprobación) | Monolito ~14k líneas en rebuild | **Emergente**: candidato natural a "cara única", hoy no gobierna los verticales |

**La primitiva núcleo de ONIA está partida en dos** — esto es clave para todo lo que sigue:
- **Sistema de registro = el `WorkItem`** (intake normalizado → WorkItem → `owner_dashboard`). Estable, probado, ya en un producto real. **Es lo que TODOS los verticales reúsan por construcción** (`requiredCapabilityIds`) `[ONIA]`.
- **Sistema de acción = el "agente"** (módulo `agents`: Recall, Cobrador). Es la cara vendible y el margen recurrente, PERO su contrato está `draft`, no adoptado en ningún producto, y **su ejecución corre en Hermes/cron bespoke, no productizada** `[ONIA]`.

A diferencia de Dapta —donde el agente ES la primitiva vendible, ejecutable y con metering— en ONIA lo que de verdad se reúsa en todos los productos **no es el agente, es el WorkItem**. El agente es la promesa; el WorkItem es la realidad.

**Huecos vs. Dapta:** metering (no existe; `business-tiers.json` define límites como dato, sin runtime que los cobre), self-serve unificado (parcial, por producto), billing (no existe, agravado por BCP/no-Stripe), integraciones (un puñado y las 3 clave —WhatsApp, SIAT, TR4— están `external_gate` + bloqueadas) `[ONIA]`.

---

## 4. La asimetría clave (por qué ONIA NO es Dapta)

Esta es la sección que evita el autoengaño. **Dapta = 1 producto horizontal empacado N veces. ONIA = N productos heterogéneos con una capa común debajo + una capa de agentes.** No es lo mismo, y la diferencia es de **naturaleza, no de grado**.

| | Dapta | ONIA |
|---|---|---|
| Qué es "todo" | Una **feature del mismo motor** | Un **catálogo de productos** con capa común |
| Costo de agregar el caso de uso N | ≈0 (config, prompt, integración) | **Construir y mantener un ERP entero** (dominio distinto: agenda clínica ≠ control de hato ≠ cuentas por pagar) |
| Escala del costo | Créditos = opex marginal (cómputo) | Ingeniería de dominio = capex de producto recurrente (personas) |
| Unidad de medida común | El crédito (producto homogéneo) | **No hay unidad común honesta** (asiento clínico ≠ proyecto web ≠ factura ≠ SKU) |
| "Ilimitado" | Honesto (crear es barato) | Mentira estructural si se aplica al catálogo de ERPs |

**El corolario que se come el margen:** si ONIA copia "todo en un plan" con precio de crédito, **subsidia productos caros de mantener (ERPs) con un precio pensado para config barata**. Y el margen de ONIA vive en lo recurrente `[ONIA]` — exactamente lo que un plan único barato canibaliza.

**Dónde SÍ aplica la lógica Dapta (y es la única parte válida):** la **capa de agentes** (Recall, Cobrador, 24/7 human-in-the-loop) es genuinamente horizontal, config-barata y metrable. El Cobrador sirve a dental, a proveedores, a PyME. Ahí "todo en uno" es honesto.

**La trampa mortal —y el error central a evitar— es extrapolar la lógica de esa capa (que sí se parece a Dapta) a TODO el catálogo (que no se parece en nada).** Confundir "tenemos una capa horizontal" con "somos una plataforma horizontal".

**Pero —push-back al escéptico, que aquí se queda corto:** ONIA tiene una ventaja que Dapta NO tiene, y es real, no cosmética. El agente de Dapta es un chatbot pegado por fuera; el ERP es del cliente. **El agente de ONIA lee `work_items`, `business_partners` y `schedule_events` reales y actúa contra ellos.** Ese acoplamiento agente↔ERP-propio es el foso. No cambia el veredicto de timing, pero sí cambia el *norte*: la jugada ganadora a 18 meses no es "otro Dapta", es "**el ERP vertical con agentes que actúan sobre tu propia data**", que es más defendible que cualquiera de los dos por separado.

---

## 5. Diseño propuesto: "ONIA OS" (si se hiciera bien)

**Tesis en una frase:** *ONIA OS es el sistema operativo con IA para negocios de Bolivia — un solo lugar donde tu ERP vertical (clientes, cobros, inventario, facturación SIAT), tus agentes 24/7 (que atienden, cobran y agendan con tu visto bueno) y tu presencia web viven sobre un mismo motor: se instala en minutos, funciona offline y se paga por lo que produce.*

Esto es el **norte a 18 meses, no lo que se construye este trimestre** (ver §7-8). El diseño no inventa motor: reúsa onia-core completo y agrega el plano comercial que falta.

**Las 3 capas, mapeadas al core real:**

- **(a) MOTOR horizontal — onia-core + runtime.** Cuatro primitivas ya existentes: datos (18 entidades tenant-scoped), agentes + automation (con cola de aprobación HITL; ejecución real sale por `external_gate` → Hermes), intake/gateway (`intakePolicy`: todo canal externo → WorkItem normalizado; n8n como conector), y fiscal Bolivia (invoicing CUF/QR, accounting IVA/IT/IUE, payroll, imports + integrations/siat). Regla dura mantenida: lo que cuesta dinero o riesgo (WhatsApp, SIAT, TR4) es `external_gate` — fuera del motor, solo empuja intake. **Eso es lo que hace seguro venderlo metered.**
- **(b) TRACKS verticales = config, no forks.** Los 11 tracks ya en el contrato. Un track nuevo = una entrada JSON, nunca código de core. **Eje industria: resuelto.**
- **(c) SERVICIOS a la misma cuenta.** Web Factory → alimenta el `web_form` como canal de intake de la misma org (la web deja de ser entregable muerto, se vuelve boca del embudo). Chatbot IA → un `agent` más, metered. Propuestas → motor de venta que provisiona la cuenta al cerrar.

**El segundo eje de empaque que falta (casi sin código): departamento.** Dapta empaca por industria Y por departamento. ONIA tiene el eje industria listo; el de departamento es marketing + preset: Cobranzas (Cobrador), Ventas (Vendedor, ya vivo), Recepción (Recall), Ops, RRHH (payroll).

**Unidad de metering — "Acción ONIA":** se metra **el efecto lateral que cuesta dinero real o representa valor entregado**, no el clic. Clasificación/borrador IA interno = 1 crédito (litellm ~$0.006 `[ONIA]`). Corrida de agente que llega a la cola = 3-5. **Mensaje WhatsApp saliente = 5** (el único costo variable duro: Meta cobra por conversación). Factura SIAT = 2. **CRUD humano, dashboard, WorkItem manual, trabajo de campo offline = 0 (gratis)** `[Sup]`. Esto respeta offline-first solo: Ganadero en el campo consume ~0. Y **litellm-db ya es el medidor** `[ONIA]`; solo hay que extenderlo a WhatsApp + agente + factura.

**El "aha" de time-to-value: "tu negocio operando con un agente 24/7 en 10 minutos".** Signup → `organization` → elige rubro (se aplica el `verticalPack` automático) → wizard `/setup` (el de DentalGest generalizado) → `import_batch` con dry-run del Excel de pacientes/deudores → `owner_dashboard` se enciende con data verdadera → un agente dispara y deja su primera sugerencia en la cola: *"Bs 4.200 vencidos en 5 clientes — ¿envío aviso de cobro?"*. El momento mágico no es "creé un agente", es **"el sistema ya entendió mi negocio y me trajo la primera plata a cobrar"** — con mi propia data, en minutos.

**Push-back al arquitecto —su punto más débil:** llama a billing + signup + multi-tenant "plomería, no producto… el 80% ya está commiteado". **Falso, y peligroso creerlo.** Billing cross-producto en Bs sin Stripe + metering que corre con ERP offline + multi-tenant con **RLS OFF en 15 tablas de GestiOS (riesgo real de datos)** `[ONIA]` + provisioning de tenant instantáneo NO es plomería: es la parte más difícil y la que menos existe. El diseño es correcto como destino; el cronograma implícito ("casi gratis") es donde el arquitecto peca de optimismo y el escéptico tiene razón.

---

## 6. Cómo se cobraría (packaging Bolivia)

**Recomendación: HÍBRIDO con jerarquía estricta — Dapta al revés.** Dapta vende "agentes ilimitados, escalan los créditos". ONIA vende **"plan fijo por vertical con IA incluida"** y el crédito es el **techo invisible que solo topa al 1% que abusa**. Por qué, anclado a la realidad boliviana (no es pereza, es restricción real):

1. **El margen vive en lo recurrente `[ONIA]`** → el producto es la suscripción fija, no el ingreso variable.
2. **BCP/pasarela local, no Stripe `[ONIA]`** → facturar consumo variable a fin de mes es **operativamente inviable**. Todo lo que exceda la bolsa se **pre-compra por QR, nunca se factura por sorpresa**.
3. **Offline-first `[ONIA]`** → no se puede medir el ERP en tiempo real. Solo se mide lo que **toca el LLM/WhatsApp online**. El crédito queda medible sin depender de la conexión del cliente.
4. **Poder adquisitivo menor `[ONIA]`** → **predecibilidad > flexibilidad**. El cliente boliviano paga tranquilo un monto cerrado; huye de "depende de cuánto uses".

**Resolución de la contradicción metering (los 3 lentes que chocan):** arquitecto dice "metrá la Acción ONIA", pricing dice "el crédito NO es unidad de venta", escéptico dice "no hay unidad común, forzarla regala margen". **Los tres tienen razón a la vez si separás dos funciones del crédito:** (a) **medir costo interno** (ya lo hace litellm-db) y (b) **topar fair-use dentro de un plan fijo** (bolsa incluida + recarga pre-pago por QR). Nunca (c) **cobrar por consumo post-pago**. Con esa separación, el diseño del arquitecto, la cautela del pricing y la objeción del escéptico dejan de contradecirse.

**Esquema de planes — reúsa TAL CUAL la escalera DentalGest que ya existe** `[ONIA]`. El "vertical" es el track; el nivel define bolsa + asientos + sedes + soporte. Interpreto los mensuales como **Bs/mes** y las webs como **USD one-time** `[Sup]`; si la moneda difiere, se reescala proporcional (la estructura no cambia).

| Plan | Precio lanzamiento `[ONIA]` | Salto de valor | Incluye | Bolsa IA/mes `[Sup]` | Gatillo de upgrade |
|---|---|---|---|---|---|
| **Base** (Presencia) | 390 (320) Bs ≈ $56 | Estar operando | Track vertical, módulos base, botón WhatsApp incluido, offline | 2.000 | Agota bolsa · +3er user · quiere chatbot |
| **Pro** (Convierte) | 890 (750) Bs ≈ $128 | Captar/convertir | Base + agentes internos (Recall/Cobrador) + intake/leads + reportes | 8.000 | Agota · +6º user · 2ª sede |
| **Full** (Automatiza) | 1.990 (1.500) Bs ≈ $286 | Motor 24/7 | Pro + **chatbot IA de atención incluido** + automatizaciones + prioridad | 25.000 | >3 sedes · SLA/on-prem |
| **Grupo** (Multi-negocio) | desde ~3.900 Bs `[Sup]` | Empresa multi-vertical | Full + varios tracks + on-prem + soporte por colaborador certificado | 75.000+ | techo |

- **Anual = 10 meses** `[ONIA]` (paga 10, usa 12): ancla retención y adelanta caja, clave sin capital.
- **Bolsas dimensionadas al revés de Dapta:** cubren ~120% del uso p90 real `[Sup]`, para que el upgrade lo dispare **crecimiento real, no nickel-and-diming**.

**Cómo convive el bundle con la venta vertical (la regla dura que resuelve toda la tensión):** *"Un cliente = un track vertical con su lenguaje. El resto del core queda latente y se activa por necesidad, nunca se cobra por adelantado."* — que es, literalmente, la arquitectura ONIA. El dentista compra **"DentalGest"**, no "una plataforma con 4 ERPs". Ganadero/Proveedores **ni aparecen** como features que paga y no usa. El pitch **"todo en una plataforma"** se reserva para (a) empresas multi-negocio reales, (b) el tier Grupo, (c) el marketing de ONIA-como-empresa — **nunca el pitch al dentista**. La web (Landing 790 / Web Pro 1.500 `[ONIA]`) es el **wedge one-time que abre el recurrente**, no se fusiona en el plan: **el bundle corona la venta por producto, no la reemplaza.**

**Distinción que evita la confusión `[ONIA]`:** botón click-to-chat WhatsApp = INCLUIDO (simple). Chatbot IA de atención (responde/califica/deriva solo) = ADD-ON pago (incluido de fábrica solo en Full+). Y **terceros a nombre del cliente, al costo, sin markup**: dominio, hosting, conversation fees de Meta, comisión de pasarela, créditos IA sobre la bolsa, pauta. Frase de venta: *"Plan cerrado + los consumos de terceros a tu nombre, al costo, sin que te marquemos un centavo."*

---

## 7. Riesgos y la versión mínima realista

**Los riesgos que levanta el escéptico (y que comparto):**
- **El que le habla a todos no le vende a nadie.** En fase sin portafolio, difuminar el posicionamiento horizontal mata la conversión vertical, que es lo único que hoy factura.
- **Vendés integración que aún no existe.** `installInProductRepos=false`: el core **no está adoptado en los repos producto**; GestiOS está "huérfano del código". "Todo integrado" hoy es **vaporware integrado**.
- **La expectativa supera la realidad.** DentalGest `installing`, ONIA Center en rebuild a medias, RLS OFF en GestiOS. En Santa Cruz (mercado chico + boca a boca) una promesa rota **se propaga sola**.
- **Desvía foco de un deadline legal con fecha:** facturación electrónica **obligatoria 30-sep-2026** `[ONIA]`. Perseguir la mega-plataforma le roba tiempo al SIAT emitter, que SÍ vende y es forzoso.

**La versión mínima realista — el 20% de Dapta que vale robar YA sin romper nada** (postura del escéptico, que suscribo, con una corrección):

1. **Cuenta única + workspace (SSO).** Un cliente, un login, un workspace ONIA. Aunque hoy compre solo DentalGest, mañana activa web o chatbot sin crear otra cuenta. Barato (auth compartido). Es lo que hace percibir a ONIA como **un proveedor, no cinco sueltos**.
2. **Agentes como capa transversal metered** (esto SÍ es Dapta-like y ya existe). El módulo AGENTS es genuinamente horizontal → activá el agente que quieras sobre tu vertical, consume tu bolsa. Es la **única** capa donde "todo en uno" es honesto.
3. **Un panel delgado (ONIA Center) como sala de control, no como el producto.** Terminá el rebuild como panel de agentes + cola de aprobación, no como monolito que hace todo.
4. **Robá el PACKAGING, no el producto.** Landing DentalGest para dentistas, landing GestiOS para PyME — mismo backend (core + agentes), distinta cara. Es marketing, no ingeniería de plataforma.

**Corrección al escéptico (push-back):** presenta el punto 1 y 4 como movida *defensiva*. No lo son. La cuenta única + packaging por departamento es **la palanca de ARPU más barata que tiene ONIA** (cross-sell chatbot/web al dentista ya adentro) y debe hacerse **con convicción, no timidez**. El 80% del beneficio comercial de "una plataforma" (proveedor único + upsell) con el 20% del costo, sí — pero es ofensivo, no un consuelo.

---

## 8. Recomendación y decisiones que Sergio debe tomar

### Recomendación: unificación PARCIAL ahora, "ONIA OS" completo como norte a 18 meses gated por tracción.

**NO** unificar totalmente hoy (el escéptico gana en timing y alcance: la asimetría de §4 es real, no hay billing, y hay un deadline legal compitiendo por foco). **NO** "no hacer nada" tampoco (el arquitecto y el pricing ganan en dirección: el activo unificable existe y el packaging es casi gratis). **SÍ** ejecutar el mínimo del §7 con convicción, monetizado con el híbrido del §6.

**La síntesis en una frase — la línea de venta:** *Dapta vende "todo en un plan" porque su "todo" es un solo motor. ONIA vende **"un proveedor, una cuenta, tus agentes en todo"** — porque su "todo" son productos distintos. Robá la cuenta, los agentes, el packaging y el metering-como-fair-use. NO la plataforma horizontal.*

**Orden de ejecución (dependencias reales, no cupo de Claude):**
1. **Cerrar DentalGest vertical + SIAT emitter** (lo que factura + lo obligatorio 30-sep). El SIAT no es solo compliance: es el **wedge de adquisición** — toda PyME boliviana DEBE migrar a facturación electrónica; ONIA la engancha ahí y le vende agentes encima.
2. **Cuenta única (SSO) + panel delgado + packaging por industria/departamento** (barato, ofensivo, no toca el core).
3. **Metering-lite "Acción ONIA"** extendiendo litellm-db (medir + topar fair-use, pre-pago QR). NO billing metered post-pago.
4. **Solo si 1-3 muestran tracción vertical real:** evaluar signup self-serve + multi-tenant probado (RLS) + provisioning — la parte cara. La plataforma completa es **consecuencia de la tracción, nunca apuesta que la precede**.

**El punto que ningún lente resolvió porque falta el dato:** todo esto se sostiene sobre cuántos clientes PAGAN DentalGest hoy. Si es 0-2, la conversación "plataforma" es prematura por definición y el orden 1→4 es aún más obligatorio.

### Las 5 preguntas filosas que Sergio debe responder para avanzar

1. **¿Cuántos clientes están PAGANDO DentalGest hoy?** `[?]` — No tengo el dato y **gatilla todo**. Si es 0-2: prohibido hablar de plataforma; foco 100% en validar un vertical. Si es 5+: la cuenta única + agentes transversales se justifican ya.
2. **¿Moneda de los planes mensuales y tamaño de las bolsas de Acción ONIA?** (bloqueo **S1 precios** `[ONIA]`). Sin esto, el §6 es estructura sin números finales. También: precios de add-ons y del tier Grupo.
3. **¿Estás dispuesto a hacer UNA apuesta de infra —pay-rails en Bs (QR/BCP) + metering-lite— o preferís cobrar los primeros N clientes de agentes a mano** hasta validar? (define si el punto 3 del orden entra ahora o se difiere).
4. **¿Quién sostiene el soporte al escalar: los colaboradores certificados por resultado `[ONIA]`, o vos?** Corolario: **descartá el SLA <3min de Dapta** — es un claim de empresa con equipo dedicado, no de fundador + agentes. Prometerlo es reputación quemada asegurada.
5. **¿Tratamos el mandato SIAT 30-sep-2026 como el wedge de adquisición número uno** (meter a toda PyME en la facturación de ONIA → upsell agentes), sí o no? Si sí, reordena el roadmap alrededor de esa fecha y convierte un deadline legal en el mejor canal de distribución que ONIA va a tener este año.

---

*Nota de método: los 5 lentes convergen más de lo que parece. Inventario, pricing y escéptico coinciden en "vertical-first, no plataforma horizontal ahora". Arquitecto y decoder aportan el destino y la mecánica. La única contradicción dura —"construir ONIA OS ya" (arquitecto) vs. "no lo construyas" (escéptico)— se resuelve separando **diseño-destino** (arquitecto: correcto) de **secuencia-ejecución** (escéptico: correcto), y monetizando con el híbrido del pricing, que es compatible con ambos porque mantiene la venta vertical y solo agrega la capa de agentes metered como fair-use.*
