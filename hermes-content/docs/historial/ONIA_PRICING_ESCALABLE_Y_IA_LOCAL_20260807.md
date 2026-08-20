# ONIA — Pricing escalable + IA local como producto

**Fecha:** 2026-08-07
**Estado:** PROPUESTA. Nada de este documento está ratificado. Toda tabla de precios lleva la marca `[PROPUESTA]` y requiere decisión explícita de Sergio antes de publicarse.
**Doc previo:** `hermes-content/docs/research/ONIA_BENCHMARK_INDUSTRIA_20260807.md`
**Fuente de verdad de tiers en código:** `onia-core/business-tiers.json` (v0.1.0, precios lista v2 del 2026-07-04)

Convención de este doc: todo dato lleva fuente y fecha. Lo que no tiene fuente pública va marcado `[inferencia]`. Fuentes de terceros (no oficiales del vendor) van con †. Los números que salen de una cuenta propia van con `[cálculo propio]`.

---

## 0. Los cuatro hechos que mandan sobre todo lo demás

1. **La arquitectura ya es la correcta.** `business-tiers.json` define tiers como datos (`limits` + `coreCapabilities` + `modules` + `unlockedExternalGates`) y **una sola familia de precios sirve a 9 tracks verticales**. El rubro NO es dimensión de precio. Meter un rubro nuevo hoy cuesta cero cambios de pricing. No romper eso.
2. **Falta una sola capa y es la que bloquea todo lo que se pidió: consumo (créditos).** Nada mide mensajes de WhatsApp, acciones de agente, minutos de voz ni renders de video. Sin esa capa, IA local / marketing / video / influencers entran como add-ons sueltos y en 6 meses la grilla es un catálogo ilegible.
3. **Hay canibalización aritmética YA, computable con los números de hoy:** Básico 320 + chatbot 350 = **670 < Pro 750**. Con lista: 390 + 350 = **740 < 890**. El add-on más deseado hace que nadie suba de escalón, y el escalón medio es justo donde viven los agentes IA (la ventaja defendible).
4. **Se está generando deuda de precios legacy antes de tener clientes.** El core dice que el lanzamiento 320/750/1500 se congelaba para quien cerrara **antes del 31-jul-2026**; esa fecha ya pasó y `business-tiers.json` sigue en v0.1.0 con la nota vieja. Arreglarlo hoy cuesta Bs 0; con 50 clientes cuesta una migración.

Y el dato de contexto que ordena la urgencia: **el 75% de las empresas de software cambió precio o packaging en el último año** (Growth Unhinged, *2026 State of B2B SaaS and AI Monetization*, n=230, encuesta abr-may 2026). La grilla se va a tocar sí o sí. Lo que se diseña acá es **cuán barato sale tocarla**.

---

## 1. La grilla que aguanta crecer

### 1.1 Cinco capas, cinco métricas independientes

La regla es una sola: **cada capa tiene su propia métrica y su propio lugar en los datos.** Un producto nuevo entra en UNA capa y no toca las otras.

| # | Capa | Qué es | Métrica | Dónde vive | Cada cuánto se toca |
|---|------|--------|---------|------------|---------------------|
| 0 | **Plan** | Recurrente base. La promesa. | Escalón (4 niveles) | `business-tiers.json` → `tiers` | Cada 12-18 meses. Casi nunca |
| 1 | **Capacidad** | El plan crece con el cliente | usuario · sucursal · puesto operativo | `tiers.limits` + precio por unidad extra | Nunca (la unidad ya existe) |
| 2 | **Módulos** | Capacidad on/off sin costo marginal | flag por rubro/plan | `tiers.modules` + `vertical-extensions.json` | **Rubro nuevo entra acá. Cero precio nuevo** |
| 3 | **Créditos Onia** | Consumo con costo variable real | 1 crédito = unidad de consumo | rate card público + saldo por tenant | Se agrega una línea al rate card |
| 4 | **Servicios** | Trabajo humano, una vez | precio fijo por entrega | catálogo de servicios | Se agrega un ítem |

Y una capa 0,5 entre plan y capacidad: **add-ons** — recurrentes que se compran aparte, cada uno con su métrica y su **tier mínimo**.

Esto no es una teoría: es el patrón que usan los verticales que ya escalaron. Jane App metió AI Scribe (CAD 15/mes por profesional), Payroll (CAD 40/mes + CAD 6 por empleado) y Websites (CAD 59/mes por clínica) **sin tocar sus planes de CAD 54/79/99** (jane.app/pricing, accedido 2026-08-07). Cada línea entró con la unidad que le correspondía. Toast hizo lo mismo con módulos y llevó un core de $69 a $300-400/mes de ARPU típico (posusa.com †, 2026-06-23).

### 1.2 REGLA ESCRITA — dónde entra un producto nuevo

Bajar por esta lista y parar en la primera que aplica. **No hay una sexta opción.**

1. **¿Tiene costo marginal por uso** (tokens, mensajes, minutos, renders, llamadas a API paga)? → **CAPA 3, créditos.** Se publica cuántos créditos cuesta la acción. **Nunca entra al precio de un plan.**
2. **¿Es una capacidad on/off, sin costo marginal, que sirve a un rubro o a todos?** → **CAPA 2, módulo.** Se prende por plan y/o por track vertical. **Cero precio nuevo.**
3. **¿Crece con el tamaño del cliente** (usuarios, sucursales, sillones, cajas, boxes)? → **CAPA 1, capacidad.** Precio por unidad extra. Se reutiliza una unidad existente; **no se inventa una unidad nueva salvo que el rubro la exija**.
4. **¿Requiere trabajo humano una vez y termina?** → **CAPA 4, servicio.** Precio fijo por entrega.
5. **¿Nada de lo anterior, es recurrente y el cliente quiere comprarlo aparte?** → **add-on**, con su métrica y su **tier mínimo** declarados en `business-tiers.json`.
6. **Prohibido:** crear un plan nuevo. Prohibido: hacer del rubro una dimensión de precio. Prohibido: un precio que no viva en los datos.

**Regla dura de canibalización (ejecutable por validador):**
> Un add-on solo puede venderse en un tier igual o superior a aquel donde aparece por primera vez la capacidad que define a ese add-on.

Traducción mecánica: cada add-on declara `minTier`. El validador falla si `minTier` es menor que el tier donde vive la capacidad estrella que el add-on entrega. Ejemplo: los agentes IA definen a Pro → el chatbot WhatsApp (que entrega el mismo tipo de valor) no puede venderse en Básico. Es exactamente cómo Jane gatea Insurance Billing a Practice/Thrive (jane.app/pricing).

**Regla dura de listas vivas:** máximo **dos** listas de precios vigentes a la vez (la actual y la que se está retirando). Una tercera = migración obligatoria antes de publicar nada nuevo.

### 1.3 Dónde entra cada producto que Sergio nombró

| Producto futuro | Capa(s) | Qué NO es |
|---|---|---|
| **IA local ("Onia Privado")** | Capa 4 (fierro + instalación, one-off) + add-on mensual de soporte + Capa 3 (mismos créditos, distinta tarifa interna) | **NO es un plan nuevo.** Si entra como plan rompe la escalera de 4 niveles |
| **Webs (landing / web pro)** | Capa 4 (Bs 790 / 1.500, precio de lanzamiento vigente en CLAUDE.md) + add-on Cuidado Web mensual | No es módulo: no es una capacidad del SaaS |
| **Marketing / pauta** | Capa 4 (setup de campaña) + Capa 3 (créditos por pieza generada). **La pauta la paga el cliente directo a Meta, nunca pasa por la caja de Onia** | No es add-on de precio fijo: el gasto es del cliente y variable |
| **Influencers IA** | Capa 3 (créditos: imagen, video, voz) + Capa 4 (paquete de producción con guion) | No es plan ni módulo |
| **Live commerce** | Capa 2 (módulo del track comercio) + Capa 3 (créditos por minuto de stream / mensajes) | No es un producto aparte |
| **Rubro nuevo (nº 7, 8, 9…)** | Capa 2, `vertical-extensions.json` | **Cero cambios de precio.** Esto ya funciona hoy |

### 1.4 La capa 3 en concreto (lo único que hay que construir)

Es el mecanismo que responde literalmente el pedido (a): que la estructura aguante crecer sin re-hacerla.

**1 crédito Onia = Bs 0,10** `[inferencia — no hay medición de WTP]`. Anclas del mercado: Salesforce Flex Credits **$500 por 100.000 créditos = $0,005/crédito**, con rate card por acción publicado (acción estándar de agente = 20 créditos = $0,10; acción de voz = 30) — help.salesforce.com art. 005197697 + salesforce.com/blog/flex-credits. HubSpot Credits: **$10 por 1.000 = $0,010/crédito** en pay-as-you-go †.

Reglas duras de la capa 3, no negociables:

1. **El rate card se publica.** Es lo que separa "créditos" de "factura sorpresa" — y la factura sorpresa es el ataque nº 1 de Onia contra Intercom Fin y Agentforce (benchmark previo §3.3). Adoptar créditos sin publicar el rate card sería tirar esa ventaja.
2. **La bolsa incluida sube con el tier.** Es la razón económica para subir de escalón que hoy no existe.
3. **Tope de gasto configurable + aviso al 80%.** Nunca corte silencioso.
4. **Los "extras de 100-150" del chatbot se disuelven en créditos.** Menos SKUs, misma plata.
5. **El plan semanal (Bs 89) NO compra créditos ni add-ons.** Es herramienta de adquisición para microcomercio y nada más. Equivale a Bs 385,6/mes (89 × 4,333) = +20,5% sobre 320 `[cálculo propio]`; el premium por conveniencia está bien puesto, pero extenderlo a consumo multiplica por ~4,3 los eventos de cobro y de churn `[inferencia]`.

Por qué esto importa ahora y no en 6 meses: **desde el 1-oct-2026 Meta cobra todos los mensajes de servicio salientes** (verificado en el benchmark previo). Los agentes Recall y Cobrador —lo diferencial— pasan a tener costo marginal creciente dentro de un plano sin medidor. Hoy Onia no puede calcular su margen bruto por cliente porque no mide. El mercado apunta a **50% de margen bruto mediano en AI** y solo 12% apunta a 80%+ (Growth Unhinged 2026); 54% cita costos internos como factor nº 1 de pricing.

---

## 2. Tabla de precios propuesta hoy

> **[PROPUESTA — a ratificar por Sergio. Nada de esto se publica hasta que él lo apruebe.]**
> Base de partida: lanzamiento 320 / 750 / 1.500 (lista 390 / 890 / 1.990), chatbot 350/mes + 1.000 instalación.
> Lo que cambia respecto de hoy: (a) aparece un 4º nivel, (b) el chatbot se gatea a Pro+, (c) aparecen capacidad extra y créditos como líneas propias.

### 2.1 Capa 0 — Planes

| Plan | Bs/mes lanzamiento | Bs/mes lista | Usuarios | Sucursales | Bolsa de créditos/mes | Capacidad que lo define |
|---|---|---|---|---|---|---|
| **Básico** | **320** | 390 | 3 | 1 | 0 | Estar ordenado: agenda, clientes, caja, **facturación SIAT** |
| **Pro** | **750** | 890 | 8 | 1 | 3.000 | **Agentes IA** (Recall, Cobrador) + módulo completo del rubro |
| **Full** | **1.500** | 1.990 | 20 | 3 | 10.000 | **Escala**: multi-sucursal, multi-caja, reportes, instalación de chatbot sin costo |
| **Grupo** `[NUEVO]` | **2.900** | 3.600 | ilimitado | 8 | 30.000 | **Consolidación** multi-sucursal + gerente de cuenta |
| Empresarial E1/E2/E3 | ya existe en USD | USD 4.900 impl + 490/mes (E1) | ∞ | 3 → ∞ | a definir | Puentes/integraciones (`maxBridges` > 0) |

Notas de diseño:
- **Facturación SIAT va incluida en TODOS los planes.** No es diferencial: el SIN tiene Portal Web gratis y está prohibido vender "obligatorio por ley" (memoria `siat-pitch-portal-gratis`). Emitir tiene costo marginal ~0; el costo real fue la homologación, que es una vez.
- **El 4º nivel (Grupo) existe para tapar el agujero entre Full y Empresarial USD** y para que el cliente que abre sucursales tenga a dónde subir sin pasar a cotización. Toast y ServiceTitan tienen medio catálogo en "custom quote"; eso es exactamente lo que rompe el self-service.
- `maxBridges: 0` en toda la familia pyme se mantiene. Integraciones = Empresarial. Frontera limpia.

### 2.2 Capa 1 — Capacidad extra (comprable desde el panel)

| Ítem | Bs/mes | Tier mínimo | Tope |
|---|---|---|---|
| Usuario adicional | 45 | Básico | +5 (más que eso = subir de plan) |
| Sucursal adicional | 350 | **Full** | +5 sobre las incluidas |
| Puesto operativo extra (sillón / caja / box) | 60 | Pro | según rubro |

Chequeo de la regla de canibalización `[cálculo propio]`: Básico 320 + 5 usuarios extra = 545 < Pro 750, y **no** entrega la capacidad que define a Pro (agentes IA) → válido. Sucursal adicional gateada a Full porque multi-sucursal **es** la capacidad que define a Full → si se vendiera en Pro, Pro 750 + 350 = 1.100 < 1.500 entregando lo de Full → violación.

### 2.3 Add-ons comprables

| Add-on | Precio | Tier mínimo | Métrica | Por qué ahí |
|---|---|---|---|---|
| **Chatbot WhatsApp IA** | **350/mes + 1.000 instalación** (instalación **Bs 0 desde Full**) | **Pro** | por WABA (número) | Entrega valor de agente IA → no puede vivir en Básico |
| Reservas online | 120/mes | Básico | por negocio | Sin costo marginal, no canibaliza nada |
| Cuidado Web | 250/mes | Básico | por sitio | Servicio recurrente, métrica propia |
| Onia Privado (IA local) | cotización | **Full** | por instalación | Ver §4 |
| Paquete de créditos | **100 por 1.000 créditos** | Pro | consumo | Capa 3 |

**El arreglo de la canibalización es el gate a Pro.** Con eso, la entrada efectiva al chatbot pasa de Bs 670 a **Bs 1.100** y Básico queda como escalón de software puro. Se evaluaron dos alternativas y se descartan por complejidad: precio del add-on decreciente por tier, y chatbot incluido en Full. El gate es un solo mecanismo y es el patrón verificado de Jane.

### 2.4 Capa 3 — Rate card propuesto

> **[PROPUESTA + BLOQUEADO]** — los números de crédito por mensaje no se pueden fijar hasta bajar el rate card de Meta (ver §6, dato faltante nº 1).

| Acción | Créditos | Bs equivalente |
|---|---|---|
| Mensaje WhatsApp template saliente | **pendiente** | pendiente |
| Acción de agente (borrador Recall / Cobrador) | 5 | 0,50 |
| Minuto de voz | 15 | 1,50 |
| Imagen IA | 10 | 1,00 |
| Segundo de video renderizado | 4 | 0,40 |
| Factura SIAT emitida | **0** | incluida |

Sanity check `[cálculo propio]`: la bolsa de Pro (3.000 créditos) da 600 acciones de agente al mes. Para una clínica con ~300 conversaciones/mes es holgado.

### 2.5 Capa 4 — Servicios (una vez, con nuestra mano)

| Servicio | Bs |
|---|---|
| Instalación de chatbot WhatsApp | 1.000 (Bs 0 desde Full) |
| Migración de datos histórica | 800 |
| Capacitación del equipo (2 h) | 450 |
| Landing | 790 (precio de lanzamiento vigente) |
| Web Pro | 1.500 (precio de lanzamiento vigente) |
| Onia Privado — instalación | ver §4 |

---

## 3. Grandfathering y subidas

### 3.1 Qué se congela exactamente

La promesa vigente es **precio congelado 12 meses**. Escribirla con precisión antes del primer cliente, porque la ambigüedad se paga después:

1. **Se congela el PRECIO del plan contratado. No se congela el CONTENIDO.** Límites, módulos y bolsa de créditos siguen la versión vigente del tier. Si mañana Pro pasa de 3.000 a 4.000 créditos, el cliente viejo los recibe; si Pro pasa a 8 usuarios desde 6, también.
2. **Los add-ons, la capacidad extra y los créditos NO se congelan.** Siguen la lista vigente al momento de comprarlos. Si no, el rate card queda congelado y el margen se hunde el día que Meta suba el precio del mensaje.
3. **El congelamiento dura 12 meses desde la firma**, no "de por vida". Prohibido usar la frase "precio de por vida" (memoria `bolivia-devaluacion-2026-impacto`).
4. **Solo se grandfatherea el plan base**, y solo por esos 12 meses. Pasado ese plazo, el cliente pasa a lista vigente con 60 días de aviso.

### 3.2 Cómo se migra un plan viejo

Datos que fijan el método:
- Cambiar precios **sin** grandfathering dispara picos de churn de **10-15%** entre clientes existentes (ProfitWell, citado por getmonetizely †).
- Una transición **bien ejecutada** igual pierde **5-15%** de la cohorte legacy afectada †.
- El costo real no es el churn, es la **fragmentación operativa**: mantener varias lógicas de facturación para una cohorte que se achica. "Grandfatherear a todos indefinidamente crea un sistema de dos clases que socava la integridad del pricing" †.

Procedimiento:

| Paso | Regla |
|---|---|
| 1 | El cambio se anuncia con **60 días** de aviso, por escrito, a toda la cohorte afectada |
| 2 | La migración se ejecuta **en la renovación**, nunca a mitad de ciclo |
| 3 | Ventana de migración: **6-12 meses** desde el anuncio |
| 4 | Incentivo: quien migra dentro de los primeros 60 días paga la lista nueva con **2 meses al precio viejo** |
| 5 | Se grandfatherea indefinidamente **solo** a las cuentas de mayor valor y antigüedad, caso por caso y por escrito |
| 6 | Al cerrar la ventana, **la lista vieja se borra del código.** Máximo dos listas vivas |

Práctica recomendada por Poyar 2026 + monetizely †: grandfatherear solo lo alto valor, migrar al resto con incentivo, ejecutar en la renovación. Y el aviso operativo de Poyar: *"antes podías revisar precios cada 18 meses; ahora pueden quedar obsoletos en 6"*.

### 3.3 Cláusula de ajuste cambiario

Contexto verificado: flotación del 26-jun-2026, USD **6,96 → 11,37 Bs** (+63%). Los costos de Onia en dólares (VPS, Supabase, Meta, modelos) no bajan; los precios están en Bs.

**Cláusula propuesta `[PROPUESTA]`:**

> Los precios se expresan en bolivianos. Si el tipo de cambio de referencia publicado por el BCB para el dólar estadounidense acumula una variación **superior al 15%** respecto del vigente a la fecha de firma, Onia podrá ajustar la tarifa **en la proporción del componente en dólares del servicio** (declarado: hasta el 40% del precio), con aviso previo de **30 días** y efecto en la siguiente renovación. El ajuste no puede exceder el porcentaje de variación cambiaria acumulada. El cliente puede rescindir sin penalidad dentro de los 30 días de aviso.

Tres razones de por qué así y no de otra forma:
- **Se declara el componente en dólares (40%)** en vez de ajustar el 100%: ajustar todo el precio por un costo que es parcial es abusivo y se nota.
- **Umbral del 15%** en vez de ajuste continuo: evita renegociar por ruido.
- **Salida sin penalidad**: es lo que hace la cláusula defendible ante un cliente que la lee.

Esta cláusula aplica a **planes, add-ons y créditos por igual**. Es el único mecanismo por el cual un precio congelado puede moverse dentro de los 12 meses.

---

## 4. IA local como producto

### 4.1 El veredicto primero

**La IA local NO es un ahorro de costo para Onia. Es un SKU premium que se vende por privacidad, no por precio.** Los números lo dicen sin ambigüedad:

- Costo real de API por clínica/mes con el perfil de uso de Onia: **USD 1,17 (GPT-5.4 Nano) a 4,32 (Mini)** = Bs 13 a 49, contra un add-on de chatbot de Bs 350 `[cálculo propio, supuesto: 300 conversaciones/mes × 8 turnos, 1.500 tok in / 150 tok out por turno]`. El margen bruto ya es 86-96%. **No hay nada que ahorrar.**
- Punto de equilibrio publicado contra APIs baratas de peso abierto: **2.500-7.000M tokens/mes**, *"effectively unreachable for solo builders"* (Cloudzy, 2026-07-08). Contra API frontera: 160-256M tokens/mes con GPU al 60-70% de utilización. **Onia con 20 clínicas está en ~79M tokens/mes** `[cálculo propio]`.
- Recuperar el fierro más barato viable (~USD 2.500 nacionalizado = Bs 28.400) con 20 clínicas hoy en Nano tomaría **107 meses** `[cálculo propio]`; en Mini, 29 meses. Y ese fierro **no aguanta 20 clínicas concurrentes** (§4.5).
- Umbral que repiten varias fuentes: on-premise empieza a tener sentido a partir de **USD ~2.000/mes** de gasto en IA (select-interactive †). Onia está en USD 23-86/mes con 20 clínicas.

Lo que **sí** es vendible: *"el dato de tu paciente no sale de tu consultorio"*. Eso es verdad, es defendible, y ya tiene anclas de precio públicas.

### 4.2 Qué se vende exactamente

**Nombre: "Onia Privado".** No "IA local" — al cliente no le importa dónde corre el modelo.

**Promesa (una frase, textual para el pitch):** *"El historial de tu paciente está protegido por secreto médico. Hoy ese texto viaja a un servidor de un tercero en el exterior. Con Onia Privado, no sale."*

**Qué incluye:**
- Modelo de peso abierto **Apache 2.0 o MIT** corriendo en la infraestructura acordada (Qwen 3.5 35B MoE o Gemma 4 26B MoE; Gemma 4 pasó a Apache 2.0 este año — tech-insider †).
- Los mismos agentes (Recall, Cobrador) y el mismo chatbot, con el modelo ruteado a la instancia privada.
- Certificado escrito de residencia de datos + registro de que ninguna consulta sale a API de terceros.
- Soporte y actualización de modelo con SLA.

**Qué NO incluye:** la base de datos. En los escenarios A y B el SaaS sigue en la nube; solo la inferencia es privada. **Decirlo así, explícito, en la propuesta.**

### 4.3 Tres escenarios de despliegue

> **[PROPUESTA — precios sin validar contra ninguna cotización real]**

| | **A — Onia Privado Nube-BO** | **B — Onia Privado Box** | **C — Onia Privado Empresarial** |
|---|---|---|---|
| **Dónde corre** | GPU de Onia (VPS/cloud), no API de terceros | Appliance en el consultorio del cliente | Servidor multi-tenant en el cliente grande |
| **Runtime** | vLLM sobre GPU discreta | Ollama / llama.cpp | vLLM, obligatorio |
| **Costo Onia** | RunPod RTX 4090 on-demand desde **USD 0,34/h** = ~**USD 245/mes** 24/7 `[cálculo propio]`; o hardware propio ~USD 2.500 | Fierro nacionalizado ~**USD 2.500 = Bs 28.400** (GMKtec EVO-X2 128 GB, USD 1.999-2.200 + CIF/flete; GA 0% por DS 5518, IVA import 14,94% recuperable con NIT) | Servidor **USD 8.000-15.000** † + licencias (NVIDIA AI Enterprise ~USD 4.500/GPU/año †) |
| **Precio sugerido** | Add-on **Bs 450/mes** sobre Full | Instalación **Bs 35.000-45.000** + soporte **Bs 1.200-1.800/mes** encima de Full | **USD 14.900 implementación + USD 990/mes** (familia empresarial existente) |
| **Anclas de mercado** | Zedly AI: instancia privada gestionada **USD 149/mes** † | eRacks: llave en mano **USD 7.695-11.082** † | ServiceTitan/enterprise pattern |
| **Para quién** | Cualquier cliente Full que quiera "no va a OpenAI" | 1 cliente que lo pida y **lo pague por adelantado** | Solo familia `empresarial` (ya en USD, ya con `implementationUsd`) |
| **Honestidad requerida** | **No es local del cliente.** Es aislamiento + no-terceros. Decirlo | La DB sigue en la nube | Único donde "todo on-prem" es real, y multiplica el costo operativo |

**Recomendado: A primero, siempre.** No requiere producto nuevo en la grilla — es un cambio del lado del costo (dónde corre el modelo) más un add-on de Bs 450. Con la capa 3 construida: **mismo crédito, distinta tarifa interna. Cero cambios en la grilla de planes.**

**Escenario B solo con plata adelantada.** El fierro para 1 consultorio es el fierro equivocado para multi-tenant y viceversa: vLLM (lo único que aguanta concurrencia) exige GPU discreta con VRAM, y los equipos "128 GB baratos" (Strix Halo, DGX Spark, Mac) son de memoria unificada y no lo aprovechan. **No se puede empezar barato y "escalar": es reemplazar todo.**

### 4.4 Gatillo medible para lanzarlo

**Fase 0 — hoy, y hasta que se cumpla el gatillo: no comprar nada.** Ruteo en LiteLLM (Nano para clasificar/extraer/rutear, Mini solo para conversación) + prompt caching sobre el system prompt fijo (−75 a −90% sobre el prefijo repetido, Morph). Eso baja el gasto más que cualquier fierro y cuesta cero.

**Gatillo para pasar a Fase 1 (escenario A):** se dispara cuando se cumplen las DOS:
- **≥3 prospectos** lo piden por escrito en el proceso de venta, Y
- el gasto agregado de IA de Onia supera **USD 300/mes** (donde una GPU dedicada a USD 245/mes empieza a competir) `[cálculo propio]`.

**Gatillo para Fase 2 (escenario B):** se dispara cuando se cumplen las DOS:
- **1 cliente firma y paga el 50% por adelantado**, Y
- se verificó la subpartida arancelaria del equipo contra el anexo del DS 5518 (la lista publicada por Aduana menciona *"laptops, tablets, teclados, impresoras"*; **no confirma servidores ni GPU**).

**Gatillo para Fase 3 (escenario C):** ≥5 clientes en Fase 2, o un cliente `empresarial` que lo exija por contrato. Con vLLM y GPU discreta, no con el fierro de Fase 2.

**Fecha límite externa:** el GA 0% del DS 5518 **vence el 31-dic-2026** (Aduana Nacional; firmado 13-ene-2026, vigente 17-19 ene). Un producto cuya economía depende de eso tiene fecha de vencimiento conocida.

### 4.5 Qué NO prometer todavía

| No decir | Por qué |
|---|---|
| **"La ley te obliga"** | Bolivia **no tiene ley de protección de datos personales**; hay solo un anteproyecto de AGETIC. Lo que sí obliga es la **Ley 3131 del Ejercicio Profesional Médico** y su reglamento **DS 28562** (secreto médico, incluso después de la muerte). El argumento honesto es **deber profesional y reputación**, no cumplimiento. Repetir el error del pitch SIAT sería imperdonable |
| **"Funciona sin internet"** | Falso mientras la DB esté en Supabase. Si se cae el internet, se cae el producto entero, no solo la IA. Solo es cierto en un on-prem completo (escenario C) |
| **"Te ahorra plata"** | El costo real es Bs 13-49/clínica/mes. No hay ahorro que mostrar |
| **"Escapás del dólar"** | El fierro se importa **en dólares** y se deprecia. Es cambiar un gasto chico en USD por un CAPEX grande en USD |
| **Cotización con validez > 15 días** | DRAM contrato **+95% en Q1 2026** y proyección +63% adicional en Q2 (The Register, 2026-02-02); spot DDR5 16Gb +298% en un trimestre (Tom's Hardware). Mini-PC ya reportan +60% sobre el precio de lanzamiento † |
| **Paridad de calidad** | Ver abajo |

### 4.6 Dónde un modelo local es PEOR (decirlo antes de vender)

1. **Concurrencia — el riesgo técnico nº 1.** Ollama/llama.cpp **se caen entre 4 y 8 concurrentes**. El paper de LLM privados para PyMEs mide, en RTX 5090 con Qwen3-30B-A3B: 1 usuario = 192,4 tok/s; **4 usuarios concurrentes = 47 tok/s cada uno**; *"per-request throughput efficiency collapses dramatically from 1 to 2 users, falling 75%"* (arXiv 2512.23029). vLLM da 16-20× el throughput de Ollama en concurrencia (particula.tech †) pero exige GPU discreta. Un box vendido como "sirve a tu clínica" que se atore un martes con 3 recepcionistas es una devolución garantizada. **Dimensionar por pico, no por promedio, y probarlo con carga.**
2. **Utilización baja mata la economía.** Al 60% de utilización el costo/token es 1,7× el de carga plena; al 25%, 4×; **al 10%, 10×** (Cloudzy). Un box de consultorio corre al 2-5%.
3. **Tool-calling.** Los agentes de Onia dependen de tool-calling confiable. La brecha de benchmark se achicó, pero la cola larga de fallos con modelos chicos cuesta más que la diferencia de MMLU `[inferencia — no hay benchmark público que separe limpio estos modelos en tool-calling]`. Cada cambio de modelo obliga a re-probar todos los prompts.
4. **Mantenimiento lineal con la cantidad de cajas.** Cada 2-3 meses sale un modelo mejor; alguien tiene que bajarlo, cuantizarlo, probarlo y desplegarlo en N cajas distribuidas. Es lo contrario de lo que un SaaS debe hacer.
5. **Soporte físico.** No hay RMA de NVIDIA en Bolivia `[inferencia]`; cortes de luz exigen UPS; y la pregunta que ninguna propuesta contesta es **quién va a las 2 am cuando el box no arranca**. Si es Sergio, ese costo va en el soporte mensual.
6. **Licencias.** Llama 4 usa Community License con umbral de 700M MAU y obliga a que los derivados fine-tuned se distribuyan bajo la misma licencia. **Para un SKU que se revende: solo Apache 2.0 / MIT**, verificado contra el texto primario de la licencia, no contra un blog.

**Lo único que ya ganó en local y sirve de prueba de concepto: Speaches (Whisper).** Y no es casualidad — el audio se cobra por minuto, no por token, así que la economía es completamente distinta a la de un LLM.

**Nota de infraestructura:** el VPS actual (4 cores / 16 GB, RAM ajustada) **no puede correr un LLM**. Un modelo de 3-4B a Q4 en CPU da 10-15 tok/s — 10-15 segundos para una respuesta de WhatsApp de 150 tokens. Inaceptable, y no hay RAM libre igual.

---

## 5. Self-service total

Objetivo del pedido (c): **el cliente compra TODO desde el pricing, con videos y tutoriales que muestren cada cosa antes de comprar.**

### 5.1 Qué tiene que existir para comprar solo

| Pieza | Estado | Qué falta |
|---|---|---|
| Alta de cuenta + trial 14 días sin tarjeta | **existe** | agregar el camino alternativo **con** tarjeta (ver 5.3) |
| Compra / upgrade / downgrade de plan | parcial (registro 2 pasos en prod) | checkout de cambio de plan con prorrateo |
| Compra de capacidad extra (usuario, sucursal, puesto) | **no existe** | UI + precios en datos |
| Activación de módulo | **no existe** como compra | los módulos ya viven en `business-tiers.json`; falta el botón |
| Compra de add-ons | **no existe** | catálogo de add-ons en `business-tiers.json` con métrica y `minTier` |
| **Compra de créditos + saldo + tope** | **no existe** | la capa 3 completa |
| Cobro recurrente automático | **no existe** | ver 5.2 |

**Dato de arquitectura que ahorra tiempo:** el Customer Portal de Stripe **no puede modificar una suscripción con múltiples productos** — textual en docs.stripe.com/customer-management: si la suscripción usa multiple products, usage-based billing o cobro por factura, "el cliente puede cancelarla en el portal, pero no actualizarla". Conclusión: **todo SaaS que vende add-ons construye su propia UI de add-ons de todos modos.** Nadie se salva. Lo que sí conviene copiar es el modelo de datos de Stripe: 1 suscripción con N items (cada add-on = un item con `price` + `quantity`), 1 factura, prorrateo automático, `transform_quantity` para vender por bloques ("cada 1.000 créditos"), y **los setup fees únicos (los Bs 1.000 de instalación del chatbot) como invoice item aparte, no como item recurrente** (docs.stripe.com/billing/subscriptions/quantities).

### 5.2 El cobro — hallazgo que desbloquea el self-service en Bolivia

Stripe **no opera en Bolivia**. El supuesto que se venía manejando era que sin card-on-file no hay renovación automática y todo el self-service necesitaba un ciclo de QR por período.

**Verificado hoy (libelula.bo, accedido 2026-08-07):** Libélula (servicio de **Todotix SRL**, en el mercado boliviano desde 2009) declara explícitamente:
- *"Débito automático y tarjetas tokenizadas"*
- *"Automatiza pagos recurrentes"*
- *"Número máximo de pagos configurable"*
- *"Integración REST-API"*
- **8 canales**: QR Simple, Google Pay, Visa/Mastercard, Lula, BNB, Tigo Money, PIX, Débito.

Si eso se confirma en la integración real, **la renovación automática en Bs es viable sin Stripe**, y con eso el self-service total deja de tener un agujero estructural. Es el camino a evaluar antes que cualquier construcción de ciclo QR manual. La pasarela BCP en trámite sigue su curso; **no son excluyentes** (Libélula para recurrente, QR/BCP para pago único).

**Fallback si no se confirma:** QR de un solo pago que activa el add-on por N meses, con recordatorio → link de pago → conciliación → activación. Funciona, pero multiplica los puntos de churn.

### 5.3 Videos y tutoriales en el pricing

Datos que fijan el formato (no opinión):

- **Wistia, *2026 State of Video Report*** (22-abr-2026; 900+ profesionales, 13 millones de videos, 79 millones de horas): **la duración media de video B2B se desplomó de 168 s (2024) a 76 s (2026)**. Videos <1 min ≈ 52% de engagement. **Los CTA al FINAL del video tienen 2-3× más clics que a mitad.** Play rate más alto en homepage, galería y páginas de producto. 40% de las empresas gastó menos de USD 5.000 en producción en 2025 — el listón es bajo.
- **Navattic, *State of the Interactive Product Demo 2026*** (+40.000 demos): **demos multi-flujo (el visitante elige el camino) se completan 48% más que las lineales**; demos por persona generan **6,6× más MQLs**. **66% de los top performers NO pide formulario**, y ungated da 6% más engagement. Estructura óptima: **5-13 pasos por flujo, ~25-30 palabras por diálogo, ~5 CTAs** repartidos (no todos al final). CTR: 29% mediana vs **71% top 1%**. Adopción de demos interactivos: **18% de ~5.000 sitios B2B SaaS** — todavía es diferenciador, no estándar. En móvil el tiempo cae a 1,2 min vs 2,7 desktop → el demo móvil debe ser la mitad de largo.

**Diseño concreto:**

1. **Un video de 60-90 s por capacidad, no por plan.** El comprador no compara "Pro vs Full", compara "¿esto me cobra solo?". El video va embebido **junto a la fila de la tabla de precios** que menciona esa capacidad. CTA al final del video, no a mitad.
2. **Un demo interactivo multi-flujo con selector de rubro, ungated, en la página de precios.** Un flujo por rubro (dental / comercio / importadora / estética / veterinaria / servicios profesionales) = exactamente el patrón multi-flujo y por-persona que rinde +48% y 6,6×. **Onia ya tiene los 6 rubros vivos: el activo más caro de construir ya está hecho.** 5-13 pasos por flujo, ~5 CTAs.
3. **El motor de video ya existe** (HyperFrames + skill `editor-videos`). Costo marginal ~0. Es la ventaja injusta acá.
4. **Trial 14 días sin tarjeta se mantiene**, con expectativa realista: mediana de conversión trial-sin-tarjeta → pago = **8,9%** (ChartMogul 2026, 200 productos, vía Growth Unhinged), contra **~30-31%** con tarjeta. **Agregar el camino con tarjeta** con incentivo (crédito de bienvenida), sin quitar el sin-tarjeta.
5. **Anti-patrón a evitar:** Toast y ServiceTitan tienen medio catálogo en "custom quote" — es el mecanismo exacto que hace imposible el self-service. Onia hoy tiene precio público en todo, y eso **ya es diferencial verificado** contra Dentrix, Dentalink, Doctoralia, Cliniweb, Siigo y Sierra (benchmark previo §3.5). No perderlo por un módulo.

### 5.4 Mapa de lo que queda inevitablemente manual

Y por qué está bien cobrarlo como servicio (capa 4).

| Manual | Por qué no se automatiza | Dueño |
|---|---|---|
| **App Review de Meta** para Onia (advanced access a `whatsapp_business_messaging` y `whatsapp_business_management`, 2 videos demostrativos, business verification) | Proceso de Meta, **plazo no publicado**. Es la ruta crítica del add-on chatbot | Onia, una vez |
| **Business verification del CLIENTE** en su Business Manager | Meta exige documentos legales del cliente | Cliente |
| **Aprobación del display name** por Meta | Asíncrona, puede rechazarse | Meta |
| **Aprobación de cada template** de mensaje | Meta | Meta |
| **Límites de mensajería** | Portfolios nuevos arrancan en **250 destinatarios/24 h**; escalan 250 → 2.000 → 10.000 → 100.000 → ilimitado por calidad y volumen | Meta |
| **Método de pago de Meta** | Como **Tech Provider**, el cliente pone su propia tarjeta y Meta le factura directo. Solo el **Solution Partner** tiene línea de crédito y puede facturar el consumo. Existe la **multi-partner solution** (Tech Provider asociado a un Solution Partner que comparte su línea) | **Bloqueo real**: exigirle tarjeta internacional a una ferretería de Santa Cruz rompe el self-service `[inferencia]` |
| **Homologación SIAT** del cliente / su NIT | SIN | Cliente |
| **Migración de datos histórica** | Cada cliente trae un Excel distinto | Onia, cobrable |
| **Instalación de Onia Privado** | Fierro físico | Onia, cobrable |
| **Diseño de web** | Trabajo creativo | Onia, cobrable |

**Por qué cobrarlo como servicio está bien:** es trabajo humano con costo marginal real y latencia externa que Onia no controla. Meterlo dentro del plan lo convierte en pérdida oculta que aparece recién cuando hay volumen. Cobrarlo aparte deja el plan limpio, comprable y comparable — que es la condición del self-service.

**Regla dura para no romper la promesa:**
> Si la instalación de un add-on **no** está 100% automatizada punta a punta, el botón self-service **cobra Bs 0** y abre un pendiente con SLA. El cobro se dispara al quedar operativo.

Vender self-service lo que la operación no puede entregar sola es lo único del pedido (c) que puede quemar clientes.

### 5.5 Chatwoot — decisión pendiente que afecta el self-service del chatbot

Chatwoot ya corre en el VPS con 0 inboxes. Dato que decide: **el issue chatwoot/chatwoot#13426 (abierto 2026-02-03, sin respuesta de maintainers)** documenta que Chatwoot **no rutea internamente por `phone_number_id`**, y Meta permite **una sola callback URL por App**. Los workarounds son: una App de Meta por cliente (inviable, cada una requiere App Review) o **un proxy externo que inspeccione el `phone_number_id` y rutee al inbox correcto** — n8n ya está en el VPS.

Además, el white-label de Chatwoot está en el tier pago: **USD 19/agente/mes** (Premium Support, incluye custom branding) ≈ **Bs 216/agente/mes**. Un cliente de 3 agentes = **Bs 648/mes de licencia, más que el plan Pro entero de Bs 750.** Matemática que mata el modelo si se paga la licencia. La Community Edition es **MIT** (rebrandear un fork es legal), pero el costo real es mantener el fork sincronizado `[inferencia]`.

**Lectura:** si los agentes IA human-in-the-loop (Recall, Cobrador) proponen y el humano aprueba **en el panel de Onia** —que es lo que Onia vende—, entonces Chatwoot queda como transporte de mensajes y el fork rebrandeado es deuda. Decisión para otra sesión; se anota acá porque cambia el costo del add-on chatbot.

---

## 6. Datos faltantes que bloquean decisiones

Ninguno se resuelve leyendo más.

1. **Rate card de Meta para Bolivia / "Rest of Latin America".** Verificado hoy en developers.facebook.com/docs/whatsapp/pricing: la página **no publica las tarifas en HTML**; están en rate cards descargables por moneda (CSV/PDF), *"effective July 1, 2026"*. **Hay que bajar el CSV de USD.** Sin ese número no se puede fijar el crédito por mensaje ni conocer el margen de Recall/Cobrador.
2. **Confirmar Libélula en integración real**: tokenización + cobro recurrente iniciado por el comercio, comisiones, y si el débito automático aplica a tarjetas o solo a cuentas. Es lo que decide si el self-service tiene renovación automática o ciclo QR.
3. **WTP real de 3-5 prospectos bolivianos.** Todos los números de capacidad y de créditos (Bs 45/usuario, Bs 350/sucursal, Bs 0,10/crédito) son `[inferencia]` sin esto.
4. **Plazo real de App Review de Meta.** No lo publica. Ruta crítica del add-on chatbot.
5. **Solution Partner regional dispuesto a multi-partner solution.** Es lo que permite cobrar el consumo de mensajes en Bs sin pedirle tarjeta internacional al cliente.
6. **Costo real de inferencia en el VPS/GPU** (tok/s por modelo, consumo eléctrico) para poner precio al escenario A de Onia Privado. Medible hoy.
7. **Subpartida arancelaria** del equipo de Onia Privado contra el anexo del DS 5518 (la lista publicada no confirma servidores ni GPU).
8. **Fecha firme de homologación SIAT** y **precio de la competencia local** (YoFacturo, Sintic) — sigue sin publicarse.

---

## 7. Orden de ejecución (costo hoy vs costo en 12 meses)

| # | Acción | Costo hoy | Costo si se posterga 12 meses |
|---|---|---|---|
| 1 | Fijar la lista vigente y actualizar `business-tiers.json` + `ONIA_CATALOGO_COMERCIAL_2026.md` **el mismo día** | Bs 0 | migración de planes legacy |
| 2 | Escribir la política de grandfathering (§3) antes del primer cliente | Bs 0 | negociación cliente por cliente; churn 10-15% † |
| 3 | Gatear el chatbot a Pro+ | 1 decisión | escalón medio muerto |
| 4 | Meter add-ons y capacidad en `business-tiers.json` + regla de canibalización en el validador | ~1 día | catálogo disperso, imposible de vender self-service |
| 5 | **Construir la capa de créditos** (rate card + saldo + tope) | ~1-2 semanas | **rehacer los planes** para meter IA local / video / marketing |
| 6 | Bajar el rate card de Meta y cerrar el precio del crédito por mensaje | 1 hora | margen desconocido desde el 1-oct-2026 |
| 7 | Demo interactivo multi-flujo por rubro + videos de 60-90 s por capacidad | usa motor propio | seguir vendiendo con llamada |
| 8 | Confirmar Libélula (recurrente + tokenización) | 1 llamada | self-service sin renovación automática |

**La nº 5 es la que convierte "IA local", "web", "marketing", "influencers IA" y "live commerce" de *cambio de pricing* en *entrada de rate card*.** Sin ella, cada producto nuevo obliga a abrir la grilla — que es exactamente lo que se pidió evitar.

---

## 8. Fuentes

Todas accedidas 2026-08-07 salvo indicación. (†) = fuente de tercero / secundaria, no oficial del vendor.

**Mercado y modelos de pricing**
- [Growth Unhinged — 2026 State of B2B SaaS and AI Monetization (n=230, abr-may 2026)](https://www.growthunhinged.com/p/the-state-of-b2b-monetization-in-2026)
- [Flexprice — Hybrid Pricing Guide 2026](https://flexprice.io/blog/hybrid-pricing-guide)
- † [SaaSMag — Hybrid Pricing 2026](https://www.saasmag.com/hybrid-pricing-saas-growth-2026/)
- † [Cityshift Finance — SaaS packaging cost structure](https://cityshiftfinance.com/insights-saas-packaging-cost-structure/)

**Verticales comparables**
- [Jane App — Pricing](https://jane.app/pricing)
- † [POS USA — Toast pricing (2026-06-23)](https://www.posusa.com/toast-pos-pricing/)
- † [Projul — ServiceTitan pricing 2026](https://projul.com/blog/servicetitan-pricing-analysis-2026/)
- [Odoo — Pricing](https://www.odoo.com/pricing)
- [Shopify 10-Q FY2025 (SEC EDGAR)](https://www.sec.gov/Archives/edgar/data/1594805/000159480525000089/shop-20250930.htm)
- [Wati — Pricing (add-ons self-service)](https://www.wati.io/pricing/)

**Créditos como moneda interna**
- [Salesforce Help — Einstein Request & Flex Credit Rate Card FAQ (art. 005197697)](https://help.salesforce.com/s/articleView?id=005197697&language=en_US&type=1)
- [Salesforce — Flexible Pricing / Flex Credits](https://www.salesforce.com/blog/flex-credits/)
- † [eesel — HubSpot credits 2026](https://www.eesel.ai/blog/hubspot-credits)

**Grandfathering y migración de precios**
- † [Monetizely — Sunset legacy pricing without losing customers](https://www.getmonetizely.com/articles/how-to-sunset-legacy-pricing-without-losing-customers-a-step-by-step-migration-guide)
- † [Monetizely — Grandfathering strategies](https://www.getmonetizely.com/articles/grandfathering-strategies-managing-legacy-pricing-gracefully-in-the-saas-world)
- † [Parseur — Grandfathering en B2B SaaS](https://parseur.com/blog/grandfathering-b2b-saas)

**Self-service, demos y video**
- [Navattic — State of the Interactive Product Demo 2026 (+40.000 demos)](https://www.navattic.com/report/state-of-the-interactive-product-demo-2026)
- [Wistia — 2026 State of Video Report (22-abr-2026)](https://wistia.com/learn/marketing/video-marketing-statistics)
- [Growth Unhinged — 2026 free-to-paid conversion report (ChartMogul, 200 productos)](https://www.growthunhinged.com/p/free-to-paid-conversion-report)
- † [GrowthSpree — trial-to-paid benchmarks 2026](https://www.growthspreeofficial.com/blogs/b2b-saas-trial-to-paid-conversion-rate-benchmarks-2026-by-trial-type-acv-length-credit-card)

**Facturación y cobro**
- [Stripe — Customer portal (limitación multi-producto)](https://docs.stripe.com/customer-management)
- [Stripe — Multiple products / quantities / transform_quantity](https://docs.stripe.com/billing/subscriptions/quantities)
- [Libélula (Todotix SRL) — sitio oficial: "Débito automático y tarjetas tokenizadas", "Automatiza pagos recurrentes", "Integración REST-API", 8 canales](https://libelula.bo/)
- [BCB — Pagos QR Bolivia](https://www.bcb.gob.bo/?q=pagos_qr_bcb_bolivia)
- [BCP Bolivia — Débito Automático](https://bcp.com.bo/Empresas/ServicioRecaudacion/DebitoAutomatico)

**WhatsApp Business Platform (Meta, docs oficiales)**
- [Meta — WhatsApp Business Platform Pricing (rate cards descargables, effective 1-jul-2026)](https://developers.facebook.com/docs/whatsapp/pricing)
- [Meta — Get started for Tech Providers](https://developers.facebook.com/documentation/business-messaging/whatsapp/solution-providers/get-started-for-tech-providers)
- [Meta — Embedded Signup implementation (v4; v2 se deprecia 15-oct-2026)](https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/implementation)
- [Meta — Solution Partner vs Tech Provider (multi-partner solution)](https://developers.facebook.com/documentation/business-messaging/whatsapp/solution-providers/overview)
- [Meta — Messaging limits](https://developers.facebook.com/documentation/business-messaging/whatsapp/messaging-limits)

**Chatwoot**
- [Chatwoot issue #13426 — Multi-tenant WhatsApp Embedded (abierto 2026-02-03)](https://github.com/chatwoot/chatwoot/issues/13426)
- [Chatwoot — Self-hosted pricing (Premium USD 19/agente/mes)](https://www.chatwoot.com/pricing/self-hosted-plans)
- [Chatwoot — Developers API](https://developers.chatwoot.com/introduction)

**IA local — economía, hardware y runtimes**
- [arXiv 2512.23029 — Private LLM Server for SMBs (RTX 5090, concurrencia)](https://arxiv.org/html/2512.23029v1)
- [arXiv 2509.18101 — Cost-Benefit On-Premise LLM (9 modelos, 54 escenarios)](https://arxiv.org/html/2509.18101v1)
- † [Cloudzy — Self-hosting open-weight LLM vs API (2026-07-08)](https://cloudzy.com/blog/self-hosting-open-weight-llm-gpu-vps-cost/)
- † [particula.tech — Ollama vs vLLM](https://particula.tech/blog/ollama-vs-vllm-comparison)
- † [runaihome — vLLM vs Ollama, when each wins 2026](https://runaihome.com/blog/vllm-vs-ollama-when-each-wins-2026/)
- † [Joshua Schultz — Open-Weight Models Cheatsheet v3.0 (14-abr-2026)](https://joshuaschultz.com/cheatsheets/open-weight-models-2026/)
- † [tech-insider — Llama 4 vs Qwen vs Mistral 2026 (licencias)](https://tech-insider.org/llama-4-vs-qwen-vs-mistral-2026/)
- [Morph — OpenAI API pricing 2026 (GPT-5.4 Nano/Mini, caching)](https://www.morphllm.com/openai-api-pricing)
- [RunPod — RTX 4090 pricing](https://www.runpod.io/gpu-models/rtx-4090)
- † [eRacks — SMB AI Server (USD 7.695-11.082)](https://eracks.com/smb-ai-server/)
- † [Zedly AI — Private LLM for small businesses (USD 149/mes)](https://zedly.ai/blog/private-llm-for-small-businesses)
- † [Select Interactive — What does on-premise AI actually cost (umbral USD 2.000/mes)](https://www.select-interactive.com/news/what-does-on-premise-ai-actually-cost)
- † [IntuitionLabs — NVIDIA DGX Spark review](https://intuitionlabs.ai/articles/nvidia-dgx-spark-review)
- † [promptquorum — Best CPU-only LLM](https://www.promptquorum.com/local-llms/best-cpu-only-llm)

**Bolivia — normativa y contexto**
- [Aduana Nacional — DS 5518, GA 0% electrónicos (vigente 17-19 ene 2026, vence 31-dic-2026)](https://www.aduana.gob.bo/todo-lo-que-debe-saber-sobre-el-nuevo-decreto-5518)
- [El Día — Arancel 0% para importación de equipos electrónicos (14-ene-2026)](https://eldia.com.bo/2026-01-14/economia/el-ejecutivo-decreta-arancel-de-0-para-importacion-de-equipos-electronicos.html)
- [Lexivox — DS 28562, reglamento de la Ley 3131 del Ejercicio Profesional Médico (secreto médico)](https://www.lexivox.org/norms/BO-DS-28562.html)
- [AGETIC — Anteproyecto de Ley de Protección de Datos Personales](https://agetic.gob.bo/sites/default/files/2025-06/DATOS-PERSONALES-PRESENTACION-ANTEPROYECTO-DE-LEY-2024-firmado.pdf)
- † [boliviaimpuestos — Impuestos para importación (IVA import 14,94%)](https://boliviaimpuestos.com/impuestos-para-importacion-en-bolivia/)
- † [speedgeo — Estadísticas de internet Bolivia](https://www.speedgeo.net/statistics/bolivia)

**Hardware — volatilidad de precios**
- [The Register — DRAM prices expected to double (2026-02-02)](https://www.theregister.com/2026/02/02/dram_prices_expected_to_double/)
- † [Tom's Hardware — RAM price index 2026](https://www.tomshardware.com/pc-components/ram/ram-price-index-2026-lowest-price-on-ddr5-and-ddr4-memory-of-all-capacities)

**Internas del repo (leídas 2026-08-07)**
- `onia-core/business-tiers.json` (v0.1.0, precios lista v2 2026-07-04)
- `onia-core/vertical-extensions.json`
- `hermes-content/docs/research/ONIA_BENCHMARK_INDUSTRIA_20260807.md`
- `hermes-content/propuestas/PRICING_RATIONALE_INTERNO.md` (§0, precios de lanzamiento vigentes)
- `CLAUDE.md` (reglas de propuestas, pricing y carriles)
