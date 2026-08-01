# ONIA — Definiciones: naming del sistema, rubro de GestiOS y catálogo WOW por rubro

> **Carril I (research/estrategia).** Fecha: 2026-07-26. Doc de DECISIÓN — una recomendación firme por pregunta, no menú.
> Contexto ya decidido (no se reabre): una-app Onia (blanco/negro/verde, logo v1), DentalGest completo en código, productos = tracks de config, runway corto, 0 clientes pagando, vender-primero, foso = SIAT sin tipear + agentes human-in-the-loop + WhatsApp-first, done-for-you ahora / self-serve destino.
> Docs ancla: `ONIA_VISION_ROADMAP_20260723.md` · `ONIA_PLATAFORMA_UNICA_BRIEF_DECISION_20260723.md` · `research/ONIA_DENTALGEST_FISCAL_MERCADO_PRICING_20260725.md` · `research/ONIA_RESEARCH_PACK_TOOLING_MODELOS_STARTUPS_20260726.md` · `ONIA_MAPA_PRODUCTOS_POR_RUBRO_2026.md`.

---

## 0. Las tres decisiones en una línea

1. **Naming:** empresa = producto = **Onia**. Una sola marca. El dentista dice "entro a Onia". Los nombres -Gest se degradan a nombres de track/campaña, nunca más a marcas.
2. **Rubro de GestiOS:** **comercio minorista formal, cuña de entrada: ferreterías y tiendas de materiales/repuestos** (Santa Cruz). Comercialmente sale como "Onia Comercio", no como "GestiOS".
3. **Catálogo WOW:** una función-firma por rubro = **la visualización del objeto central del negocio conectada a la plata** (diente→presupuesto, estante→quiebre, auto 3D→proforma, mesa→comanda, cara→sesión, animal→venta). Se construye recién con el primer cliente pagando del vertical — salvo la dental, que puede adelantarse si cierra una venta.

---

## 1. Nombre del sistema: Onia = empresa = producto (una sola marca)

### La decisión

**Todo se llama Onia.** No hay modelo Anthropic→Claude. La empresa es Onia, la plataforma es Onia, la app donde entra el cliente es Onia. Los verticales se nombran con descriptor, no con marca: **"Onia Dental", "Onia Comercio", "Onia Distribución", "Onia Campo"**. El usuario final dice **"entro a Onia"** — un dominio, un login, una app (eso ya lo decidió la arquitectura de la plataforma única; dos marcas pelearían contra la propia arquitectura).

### Pros/contras reales para un fundador solo pre-ingreso

| Criterio | Una marca (Onia = todo) | Dos niveles (Onia → "Claude" propio) |
|---|---|---|
| **Costo de construir marca** | Cada post, video Higgsfield, demo, referido y factura suma al MISMO nombre. La marca se compone. | Cada marca exige su dominio, logo, redes, contenido, registro y repetición propios. Con las horas de Sergio como recurso más escaso (el brief lo dice: el cuello es DEMANDA), partir la atención en 2-4 marcas divide el interés compuesto por N. |
| **Claridad del pitch** | "Soy de Onia, el sistema con IA para tu negocio; para clínicas se llama igual: Onia." Una frase. | "Somos Onia y hacemos DentalGest, y también GestiOS, y ProveeGest…" — impuesto de confusión en cada conversación de venta, y la venta en Bolivia es cara a cara. |
| **Land-and-expand** | El expand es natural: el cliente ya está EN Onia, se le enciende otro módulo. | Si compró "DentalGest", venderle "GestiOS" suena a segundo producto de otra empresa → fricción exactamente donde vive el margen. |
| **Futuro internacional** | "Onia" es corto, pronunciable en es/pt/en, sin categoría pegada. | "DentalGest" encierra la categoría; como marca madre no escala a comercio ni a otro país. |
| **Riesgo** | Un vertical que fracasa mancha la marca madre. A esta escala (0 clientes) el riesgo es teórico; se gestiona con la regla de revisión. | Aislar riesgo de marca es lujo de empresa con capital, no necesidad de pre-ingreso. |

**El patrón del mercado confirma:** los SaaS pyme/verticales que ganaron LatAm operan con UNA marca — Alegra, Bsale, AgendaPro, Siigo, Odoo (research pack §3); y los verticales globales igual (Veeva, Toast, ServiceTitan). Anthropic→Claude funciona porque separa dos audiencias distintas (labs/inversores vs usuarios del asistente); Onia tiene UNA audiencia: el dueño de PyME boliviana. Las casas multi-marca reales (Intuit, Constellation) son producto de M&A post-escala, nunca una elección de pre-ingreso. Darwin AI enseña la excepción correcta: los que llevan nombre propio son los **empleados IA** ("tu recepcionista IA", "tu cobrador IA"), no el producto — el nombre vende adentro del producto, no compite con él.

### Qué pasa con los nombres existentes (costo ~0, sin rebrand-proyecto)

- **DentalGest** ya vive (`dentalgest.app`, landing hecha): se conserva como **puerta de campaña dental** durante la ventana de venta — convierte en búsquedas "software dental" y no se tira trabajo hecho. La landing pasa a decir **"DentalGest · el sistema dental de Onia"** y el login/app viven en Onia. Cero horas nuevas de marca DentalGest: no más logo propio, no redes propias, no inversión de marca separada. Es un nombre de puerta, no una marca.
- **GestiOS y ProveeGest** mueren como nombres comerciales antes de nacer (no tienen clientes ni landing que perder). Quedan como ids de track (`gestios-general`, `proveegest-electrico`). Comercialmente: "Onia Comercio" y "Onia Distribución".
- **Verticales nuevos** nacen SIEMPRE como "Onia + rubro". Prohibido acuñar otro "-Gest".

### Regla de revisión ("si X, revisar")

Revisar sub-marca SOLO si ocurre una de estas tres:
1. Aparece un producto con **comprador distinto** al dueño de PyME (ej. academia para builders) → sub-marca descriptiva ("Onia Academy"), nunca marca desconectada.
2. Al entrar a un **país nuevo**, "Onia" tiene conflicto de registro/marca local → se resuelve ahí, no antes.
3. Hay **capital y equipo de marketing** capaces de sostener dos marcas a la vez (post levantamiento o >50 cuentas pagando). Hasta entonces: una marca, sin excepción.

---

## 2. Rubro de GestiOS: comercio minorista formal — cuña ferreterías

### La decisión

**El segundo vertical es comercio minorista de mostrador en régimen general, y la cuña de entrada son las ferreterías y tiendas de materiales/repuestos de Santa Cruz.** Sale al mercado como **"Onia Comercio"** (pack `gestios-general` + skin comercio; datos, no código de core). El **tercer vertical** —cuando toque— es **estética** vía EsteticaGest (track ya roadmapped): reusa casi 1:1 el playbook y el código dental (agenda + no-show + recall + paquetes), es la habitación más barata de encender. **ProveeGest queda como está** (importadoras/distribuidoras, validado vía Bolivian Electric).

### Por qué ferreterías — el criterio "mismo playbook que dental"

| Criterio del playbook | Cómo lo cumple la ferretería |
|---|---|
| **Dolor claro** | Inventario de miles de SKUs descuadrado + caja + **fiado** a maestros y contratistas que no se cobra. Dolor nombrable en una frase en la primera visita. |
| **SIAT (demanda forzada)** | Es donde el "no tipear" es MÁS agudo que en dental: un mostrador emite decenas de facturas al día — tipearlas una a una en el Portal Web gratis del SIN es físicamente inviable. En dental son pocas facturas/día; en comercio el Portal gratis deja de ser alternativa real. Mismo gancho honesto: "podés cumplir gratis tipeando; nosotros hacemos que no tengas que hacerlo" ([SIAT — Portal Web](https://siatinfo.impuestos.gob.bo/index.php/informacion/modalidades-facturacion/facturacion-portal-web) · deadline 30-sep-2026, [SIN RND 102600000007](https://www.impuestos.gob.bo/index.php/nota_prensa/el-sin-amplia-hasta-el-30-de-septiembre-el-plazo-para-la-implementacion-de-la-facturacion-en-linea/)). |
| **WhatsApp-first** | El maestro albañil YA cotiza mandando foto de una lista escrita a mano por WhatsApp. No hay que cambiar el hábito del cliente final — solo responderlo mejor (WhatsApp = app #1 de Bolivia, [DataReportal 2025](https://datareportal.com/reports/digital-2025-bolivia)). |
| **Agente con ROI directo** | El **Cobrador IA** persigue el fiado con aprobación humana: ROI medible en Bs recuperados el primer mes — el mismo patrón del Recall dental ("reprograma, no recuerda" → acá "cobra, no recuerda"). |
| **Evidencia de mercado** | **Bsale** probó el modelo exacto (dominar UN flujo: vender + emitir comprobante + inventario) hasta 20.000+ empresas en CL/PE/CO/MX — y no está en Bolivia. **Alegra tampoco** (selector de países verificado 2026-07-25). El hueco del líder regional está abierto justo en comercio. |
| **Costo de construir** | El módulo `commerce` del core ya existe (catálogo, multi-almacén, listas USD/BOB, kardex, caja) y lo usan 11/11 rubros. GestiOS es config + Sprint 0, no producto nuevo. Bonus: el conocimiento de catálogo/costos de Bolivian Electric (ProveeGest) alimenta el mismo dominio. |

**Matiz Bolivia que define la cuña:** la tienda de barrio chica suele estar en el **Régimen Tributario Simplificado** — no emite factura ([SIN — regímenes especiales](https://www.impuestos.gob.bo/)), o sea que el gancho SIAT no existe para ella y además no paga Bs 750/mes. Por eso la cuña NO es "tiendas de barrio": es el comercio **formal en régimen general** con volumen de facturas y ticket para pagar — ferreterías, materiales de construcción, repuestos, insumos. Ese recorte convierte "PyMEs genérico" (que no vende) en un comprador con cara.

### Por qué NO los otros candidatos

- **Gastronomía:** el dolor existe pero la operación es brutal para un fundador solo — velocidad de mostrador, impresoras/comandas, turnos, delivery, hardware, churn alto del rubro y soporte en horario nocturno/fin de semana. Es el vertical que más rápido rompe la regla "el soporte es sobrevivible en solitario" (brief §6). Queda como skin futuro (`gastronomia` ya tiene pack), no como segundo vertical.
- **Servicios profesionales:** emiten pocas facturas al mes → el Portal Web gratis les alcanza y el gancho SIAT se desinfla; el dolor es difuso ("organizarme mejor") = venta lenta. El que le habla a todos no le vende a nadie — y este rubro es "todos".
- **Estética/salud no-dental:** es el playbook dental REPETIDO, no un segundo leg del negocio — no prueba nada nuevo de la tesis y no es el rubro de GestiOS. Correcto como TERCER vertical barato (EsteticaGest), no como segundo.

### Cuándo (gate — no se toca hasta que se cumpla)

La regla de la visión sigue intacta: **la habitación #2 no se construye hasta que la #1 (DentalGest) tenga 3-5 clínicas pagando y al menos una haya encendido un segundo módulo.** Lo único que esta decisión habilita YA, gratis: (a) apuntar el research de campo y el canal de **contadores** (jugada Siigo) también a ferreterías, (b) que todo material nuevo diga "Onia Comercio" y no "GestiOS", (c) capturar leads de comercio que lleguen solos, sin perseguirlos.

---

## 3. Catálogo de funciones WOW por rubro ("locas pero vendedoras")

### Las reglas del catálogo

1. **Gate de construcción:** la WOW de un rubro se construye recién cuando ese vertical tiene su **primer cliente pagando**. Única excepción: las dentales marcadas YA, si una demo concreta las necesita para cerrar (DentalGest es la habitación #1 y su WOW es herramienta de cierre).
2. **La fórmula de la WOW:** visualizar el **objeto central del negocio** (diente, estante, contenedor, auto, mesa, cara, animal) y conectarlo **a la plata** (presupuesto, cobro, factura SIAT). Una WOW que no termina en plata es decoración.
3. **Toda WOW corre sobre datos del core** (work items, commerce, evidence, scheduling) — nunca una feature huérfana con su propia data.
4. **Toda WOW debe poder verse en el demo-tenant instantáneo** del rubro ("probá un negocio de ejemplo en 2 min") — es donde más vende.
5. Etiquetas: **[UTIL]** utilidad real diaria · **[MAGIA]** demo-magia (impresiona en demo, uso diario menor) · **[MIXTA]** ambas.

### 🦷 Dental (DentalGest — habitación #1)

| Función | Qué comunica en la demo | Esfuerzo | Tipo | Cuándo |
|---|---|---|---|---|
| **Odontograma interactivo con presupuesto en vivo** — click en diente/superficie → estado, tratamiento propuesto, y el presupuesto en Bs se arma solo al lado | "Tu clínica en una pantalla: tocás el diente y sale el presupuesto" — es LA feature que el dentista espera ver | M (ToothRecord ya existe; falta superficie + conexión a presupuesto) | **[UTIL]** | **YA** (excepción dental: cierra ventas) |
| **Plan de tratamiento por fases con antes/después visual** — marcar dientes → plan fase 1/2/3 → odontograma proyectado "cómo queda" | "Cerrás presupuestos grandes en la misma consulta: el paciente VE el resultado" (cierra el gap `treatment_plan`) | M | **[UTIL]** | YA si una demo lo pide; si no, cliente #3 |
| **Timeline del paciente** — tratamientos + fotos + pagos + mensajes del Recall en una sola línea de tiempo | "La historia completa del paciente sin buscar en carpetas" | S-M | **[MIXTA]** | Primer cliente pagando |

*No construir:* diagnóstico IA sobre radiografías — YMYL/responsabilidad médica, mata la confianza que es el activo (regla de honestidad del pitch).

### 🏪 Comercio (Onia Comercio — ferreterías)

| Función | Qué comunica en la demo | Esfuerzo | Tipo | Cuándo |
|---|---|---|---|---|
| **Cotizador WhatsApp desde foto** — el cliente manda la foto de su lista manuscrita; el sistema la lee (visión IA) y arma la cotización borrador; el dueño aprueba y responde | "El maestro te manda su lista a las 7am y a las 7:05 ya tiene proforma — sin que tipees nada" | M (visión por carril `volumen` de litellm + human-in-the-loop ya patrón) | **[MIXTA]** — magia alta en demo Y uso diario real | Primer cliente pagando |
| **Radar de inventario** — heatmap del kardex: qué vuela, qué está muerto, qué se agota antes de reponer | "Este estante te está comiendo plata; este otro se te acaba el jueves" | S-M (kardex del módulo commerce ya existe) | **[UTIL]** | Primer cliente pagando |
| **Fiado con Cobrador IA** — cuenta corriente por cliente + el agente persigue deudas por WhatsApp con aprobación | "Tu cobrador IA recuperó Bs 2.400 este mes — miralo en /pending antes de que salga" | M (patrón Cobrador dental ya draftado) | **[UTIL]** — es el ROI del pitch | Primer cliente pagando |

### ⚡ Importadoras/distribuidoras (ProveeGest — vía Bolivian Electric)

| Función | Qué comunica en la demo | Esfuerzo | Tipo | Cuándo |
|---|---|---|---|---|
| **Calculadora de costo puesto en Bolivia** — CIF → GA → IVA importación → logística → margen, con slider de tipo de cambio | "Movés el dólar y ves al instante qué margen te queda en cada producto" — brutal post-devaluación +63% | M (`landed_cost_calculation` ya especificada como extensión) | **[UTIL]** | BE como cliente de validación = primer WOW habilitado del catálogo |
| **Timeline del contenedor** — puerto → aduana → almacén, con costos acumulándose en cada hito | "Sabés cuánto te costó el contenedor ANTES de que llegue, no cuando el contador te lo dice" | M | **[MIXTA]** | Primer cliente pagando |
| **Selector técnico del catálogo** — el cliente B2B filtra por specs/homologación y arma su pedido solo | "Tus clientes se cotizan solos a las 11 de la noche" (módulo `knowledge` ya existe) | M | **[UTIL]** | Primer cliente pagando |

### 🔧 Taller mecánico (rubro futuro — hoy sin track; primero pack, después WOW)

| Función | Qué comunica en la demo | Esfuerzo | Tipo | Cuándo |
|---|---|---|---|---|
| **Auto 3D para marcar daños** (la idea de Sergio) — modelo glTF low-poly + three.js: click en el panel → daño marcado + foto adjunta → entra a la proforma | "Marcás el rayón en el auto 3D, le sacás foto, y la proforma se arma sola — y nadie te discute después 'ese rayón ya estaba'" | M (three.js + raycasting + modelo genérico gratis; sin modelado propio) | **[MIXTA]** — la demo-magia más alta del catálogo, con utilidad legal real (evidencia de recepción) | Primer cliente taller pagando — nunca antes (el rubro ni track tiene) |
| **Check-in con fotos + firma en el celular** — recepción del vehículo: fotos 360, checklist, firma del cliente → PDF | "El cliente firma el estado del auto en SU celular; cero pelea a la entrega" | S | **[UTIL]** | Primer cliente pagando |
| **Historial por placa + mantenimiento por WhatsApp** — todo lo hecho al vehículo; el agente avisa "a tu auto le toca cambio de aceite" | "El taller que te llama antes de que te acuerdes — el cliente vuelve solo" | S-M | **[UTIL]** | Primer cliente pagando |

### 🍽️ Gastronomía (skin futuro de Onia Comercio)

| Función | Qué comunica en la demo | Esfuerzo | Tipo | Cuándo |
|---|---|---|---|---|
| **Mapa de mesas vivo** — plano del salón, estado por mesa en tiempo real, comanda al toque | "Ves tu salón desde el celular: qué mesa espera, cuál pidió la cuenta" | M-L (realtime) | **[UTIL]** — obligatoria del rubro, no diferencial | Primer cliente pagando |
| **Ingeniería de menú semáforo** — margen × popularidad por plato, con costo de ingredientes actualizado (inflación 9,23% a 12 meses) | "Este plato te pierde plata desde junio y no lo sabías" | S-M | **[UTIL]** — la más vendedora del rubro en Bolivia 2026 | Primer cliente pagando |
| **Menú QR que se actualiza solo** — plato agotado (86) desaparece del QR al instante | "Nunca más 'de eso no hay' delante del cliente" | S | **[MIXTA]** | Primer cliente pagando |

### 💆 Estética (EsteticaGest — tercer vertical)

| Función | Qué comunica en la demo | Esfuerzo | Tipo | Cuándo |
|---|---|---|---|---|
| **Mapa facial interactivo** — el "odontograma de la cara": zonas tratadas, unidades por zona, historial por región | "Tocás la zona y ves qué se aplicó, cuánto y cuándo — cero cuaderno" | S-M (reusa el patrón odontograma) | **[UTIL]** | Primer cliente pagando |
| **Antes/después con slider por sesión** — galería comparativa (`treatment_progress_photo` ya roadmapped) | "Tu mejor vendedor es la foto: mostrás el resultado, no lo contás" | S | **[UTIL]** — LA feature de venta del rubro | Primer cliente pagando |
| **Tarjeta de paquete de sesiones** — "sesión 6 de 10" con anillo de progreso + WhatsApp automático "te quedan 2" | "El paquete se cobra solo y la clienta vuelve sola" (`session_package`) | S | **[UTIL]** | Primer cliente pagando |

*No construir:* simulador facial AR "cómo vas a quedar" — **[MAGIA] pura**, esfuerzo L, y genera expectativas de resultado médico que después cobran. Descartada.

### 🐄 Ganadería (Ganadero OS — offline-first)

| Función | Qué comunica en la demo | Esfuerzo | Tipo | Cuándo |
|---|---|---|---|---|
| **Timeline visual del animal** — por caravana: nacimiento → destete → vacunas PRONEFA → movimientos → venta | "La vida entera del animal en una línea — y lista para SENASAG" | M | **[UTIL]** | Primer cliente pagando |
| **Mapa de potreros con hato** — croquis del campo, drag & drop de lotes entre potreros (`herd_pasture_assignment`) | "Movés el lote en la pantalla como lo movés en el campo" | M-L (offline-first lo complica) | **[MIXTA]** — WOW alto; utilidad depende de la rotación real del productor | Primer cliente pagando |
| **Campaña de vacunación en un botón** — plan PRONEFA + guías de movimiento pre-llenadas | "La burocracia de la campaña, resuelta en 5 minutos" | M | **[UTIL]** | Primer cliente pagando |

### Lectura transversal (para no dispersarse)

- **Hoy solo se construye WOW dental** (odontograma+presupuesto), y solo si empuja un cierre. Todo lo demás es catálogo capturado — se cita en la venta ("cuando entres, tu rubro tendrá su función estrella"), no se codea.
- Las WOW **[MAGIA]** valen exactamente una cosa: abrir la boca del prospecto en la demo. Las que no tienen pata **[UTIL]** detrás (simulador AR) no entran ni con cliente pagando.
- El catálogo es también material comercial: cada "Onia + rubro" tiene su promesa visual diferencial que ningún ERP genérico (Odoo sin partner, Alegra ausente, Bsale sin Bolivia) va a mostrar en una demo local con SIAT incluido.

---

## 4. Fuentes

- SIAT plazo 30-sep-2026 y Portal Web gratis: [SIN — RND 102600000007](https://www.impuestos.gob.bo/index.php/nota_prensa/el-sin-amplia-hasta-el-30-de-septiembre-el-plazo-para-la-implementacion-de-la-facturacion-en-linea/) · [SIAT — Portal Web en Línea](https://siatinfo.impuestos.gob.bo/index.php/informacion/modalidades-facturacion/facturacion-portal-web)
- Bsale (caja+inventario+comprobante, 20.000+ empresas, sin Bolivia), Alegra ausente de Bolivia (verificado 2026-07-25), AgendaPro, Siigo (contadores como canal), Darwin AI (empleados IA con nombre): `research/ONIA_RESEARCH_PACK_TOOLING_MODELOS_STARTUPS_20260726.md` §3
- WhatsApp app #1 Bolivia (~85% de internautas): [DataReportal Digital 2025 Bolivia](https://datareportal.com/reports/digital-2025-bolivia)
- Devaluación +63% (6,96→11,37 Bs/USD) e inflación 9,23% a 12 meses: `research/ONIA_DENTALGEST_FISCAL_MERCADO_PRICING_20260725.md` §3.5 ([BCB](https://www.bcb.gob.bo/) · [INE vía La Razón](https://larazon.bo/economia-y-empresa/2026/07/03/bolivia-acumula-una-inflacion-de-482-hasta-junio-segun-el-ine/))
- Régimen Tributario Simplificado (contribuyentes que no emiten factura): [SIN — impuestos.gob.bo](https://www.impuestos.gob.bo/) (régimen especial RTS)
- Capas producto/track, módulo commerce 11/11, extensiones ya especificadas (landed_cost, treatment_progress_photo, session_package, herd_pasture_assignment): `ONIA_MAPA_PRODUCTOS_POR_RUBRO_2026.md`
- Gate "habitación #2 recién con inquilino pagando + 2º módulo encendido": `ONIA_VISION_ROADMAP_20260723.md` §2-3 · `ONIA_PLATAFORMA_UNICA_BRIEF_DECISION_20260723.md` §5
