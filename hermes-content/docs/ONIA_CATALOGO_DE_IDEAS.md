# ONIA — Catálogo maestro de TODAS las ideas

> ⚠️ **Este archivo vivía en `historial/` con fecha en el nombre** (`ONIA_CATALOGO_MAESTRO_IDEAS_20260726.md`).
> Por la regla de `CLAUDE.md` §2, un doc en `historial/` es la foto de un día y **no es fuente de
> verdad** — o sea que el catálogo escrito para que las ideas no se pierdan estaba guardado
> justo donde se pierden. Se promovió a `hermes-content/docs/` sin fecha el 2026-08-23, con su
> historia de git intacta y las 8 referencias entrantes actualizadas. **Un tema = un archivo sin
> fecha: si cambia, se EDITA este.** Contenido original del 2026-07-26; los estados de abajo son
> de esa fecha salvo donde diga otra cosa.

> 🧭 **Ideas evaluadas con el test de tres preguntas (desde el 2026-09-05): viven en
> `ONIA_ESTRATEGIA_DE_EMPRESA.md` §14, no acá.** Al 2026-09-30: tarjeta de fidelidad en Wallet (pasa) ·
> MCP del dueño (falla la 1) · **Recall de tratamiento a medias** (pasa, y es el hueco de la v1.0) ·
> **agentes que hablan con agentes** (pasa solo como plataforma, falla la etapa) · **marketplace tipo
> Uber / Yango / PedidosYa** (falla las tres; su ruta realista es una red de clínicas que nace del SaaS,
> con gatillos medibles). Antes de reabrir cualquiera de esas, leer su entrada allá.

---

## Decisión abierta — los 3 candidatos (anotada 2026-08-23, NO perseguida)

Sergio los puso sobre la mesa a mitad de la sesión del carril de la web y decidió
**no cambiar de objetivo**: primero se cierra la web. Queda acá para retomarlo entero.

| # | Candidato | Sección | Por qué está en la lista | Qué lo frena |
|---|---|---|---|---|
| 1 | **ONIA Motor Local** | §3.2 | Paquete de agencia (presencia + GBP + landing + CRM + n8n + reporte) en niveles Starter/Growth/Pro. Break-even ya calculado: **5 clientes Growth = Bs 9.500/mes = Onia se sostiene sola.** Reusa Web Factory y n8n: cero código nuevo. | Nada técnico. Desapareció de los planes **sin decisión explícita** — el catálogo lo marca 🔵 "olvidada, definida completa". |
| 2 | **Tablero con alertas por umbral** | §7.5-bis | **La única con demanda observada, no supuesta**: dos personas distintas, de rubros distintos, pidieron lo mismo la misma semana. | Es producto dentro de Onia Platform: compite por las MISMAS horas de la cola de v1.0 que ya está en vuelo. No es "además", es "en vez de". |
| 3 | **Landed cost / reprecio FX** | §2.14 | Marcado PERSEGUIR. Venture #1 para importadoras, con Bolivian Electric como caso 0. | Bloqueado por S4 (columnas TR4). No es un "ya" hoy, decida lo que decida. |

**El agujero de la comparación** (lo que hay que resolver ANTES de elegir): los tres se están
evaluando como si fueran la misma clase de apuesta y no lo son. **Motor Local cambia cómo
cobrás** — es servicio, factura sin esperar que el producto avance. **Los otros dos cambian qué
vendés.** Elegir entre ellos es primero decidir si el problema de este mes es **caja** o
**producto**. Mientras esa pregunta no se conteste, la tabla no ordena nada.

Ojo con la regla de §11 y con la de "nada a medias": abrir cualquiera de los tres **no** es
compatible con dejar la cola de v1.0 por la mitad.

---

> Pedido de Sergio: "documentame todas las ideas que hemos tenido hasta el momento…
> miles de ideas que tal vez no recuerdo". Este doc es el resultado de barrer los
> ~190 docs de `hermes-content/docs/**` (incluido `_archive/`), los 64 archivos de
> memoria persistente, canales, propuestas y skills. **Es el índice maestro: cada
> idea con su estado y su gatillo de reapertura.** El detalle vive en el doc fuente
> citado — no duplicar acá.
>
> Incluye además la **nueva división de trabajo con Arthur** (§10, decisión de hoy).

**Leyenda:** 🟢 en ejecución · 🔵 construido, sin vender/activar · 🟡 parqueado CON gatillo · 🔴 descartado (con razón)

---

## 0. Mapa rápido — las que preguntaste y las más olvidadas

| Idea que recordabas | Dónde está | Estado |
|---|---|---|
| Importación de productos | §4.2–4.3 | 🟡 bloqueada por riel de pago, no por tecnología |
| E-commerce propio / dropshipping | §4.1–4.7 → [`ONIA_ECOMMERCE_Y_DROPSHIPPING.md`](ONIA_ECOMMERCE_Y_DROPSHIPPING.md) | 🟡 anotado como proyecto futuro (2026-09-04). Lo internacional está 🔴 sin riel; lo realista es contra pedido con proveedor local |
| Home labs para empresas | §5.1 | 🟡 ahorro interno sí; venderlo = prohibido por ahora |
| Agencia de marketing | §3.5–3.7 | 🟡 "NUNCA agencia-para-terceros antes de validar la plataforma" |
| Canal de YouTube | §6.1–6.3 | 🟡 2 canales planificados en pausa + 2 archivados |
| Influencers automatizados | §6.4–6.6 | 🟡 infra lista, no publica (token IG + gasto) |

**Las 3 más olvidadas con MÁS trabajo hecho:**
1. **"ONIA Motor Local"** (§3.2) — el "caballito de batalla" recurrente con precios y matemática de break-even completa (5 clientes Growth = Bs 9.500/mes = ONIA existe). Desapareció de los planes de julio sin decisión explícita.
2. **StockCam** (§2.9) — inventario con cámara; tiene entradas en la DB del panel y specs, cero código.
3. **"Atlas AI Media Holding"** (§6.3) — un negocio de media entero (2 canales + newsletter + afiliados + templates, proyecciones hasta USD 70k/mes) archivado en `_archive/`.

---

## 1. El filtro que ordena todo (no cambió)

- **Runway ≈11 semanas** (~mediados de octubre) y muere el mismo día que la ventana SIAT (1-oct).
- **0 clientes pagando** → el cuello de botella es DEMANDA, no oferta. Hay demasiada oferta construida.
- **Regla habitación #1:** no se construye la habitación #2 (2º vertical, LatAm, cursos, media) hasta que la #1 (DentalGest) tenga inquilino pagando.
- **Devaluación**: ingresos en Bs, costos en USD (+63%) → toda idea nueva se evalúa contra "¿acerca un pago en las próximas semanas?".
- **Regla de gasto**: plataformas pagas (Higgsfield, fal, OpenAI images) solo con permiso explícito por caso.

---

## 2. Producto / SaaS

| # | Idea | Estado | Gatillo / nota |
|---|---|---|---|
| 2.1 | **Onia plataforma única** (una app, un login, rubro = config) | 🟢 arquitectura aprobada y construida (C1+C2) | ES el norte; DentalGest evoluciona en su lugar |
| 2.2 | **DentalGest** (vertical dental) | 🟢 completo en código, EN VIVO, 0 clientes | VENDER. Warm leads + sales kit listos |
| 2.3 | **Onia Comercio** (ex GestiOS; ferreterías SCZ) | 🟡 | 3-5 clínicas pagando + 2º módulo encendido |
| 2.4 | **Onia Distribución** (ex ProveeGest; importadoras B2B) | 🟡 | El CRM real de BE (doc `ONIA_CRM_BE_ANALISIS_20260726.md`) es el blueprint; BE = cliente candidato #1 |
| 2.5 | **Onia Campo** (ganadero offline-first) | 🟡 último de la fila | ⚠️ repo sin git — riesgo de pérdida |
| 2.6 | **Estética** (3er vertical, playbook dental 1:1) · Vet · Farma · Resto · Inmo · talleres (WOW auto 3D) | 🟡/⚪ | Cada rubro = pack de config, nunca fork. WOW solo con cliente pagando del rubro |
| 2.7 | **Agentes IA 24/7** (Recall, Cobrador, Vendedor — "empleados con nombre") | 🔵 construidos, drafts | Rollout tras 1er cliente; envío real = token S6 |
| 2.8 | **Chatbot WhatsApp** (escalera N1/N2/N3; base = chatbot BE) | 🔵 base construida en BE | Venta a terceros bloqueada por verificación Meta (S5/S6) |
| 2.9 | **StockCam** (inventario con cámara) | 🟡 olvidada, solo spec | Validar con el almacén de BE |
| 2.10 | **Facturador SIAT gratis** como cuña masiva | 🟡 "la jugada land-grab más potente" | Evaluar tras homologación SIAT; free limitado N facturas/mes |
| 2.11 | **Contador Pack** + "ONIA Contador gratis" (jugada Siigo) | 🔵/🟡 | Precio pendiente (S8); validar con 3-5 contadores reales |
| 2.12 | **Take-rate sobre pagos QR** (3ª capa de monetización) | 🟡 | Necesita API bancaria (trámite BNB/BCP en curso) |
| 2.13 | **Demo tenant instantáneo** | 🟢 **CONSTRUIDO HOY** (`provisionDemoOrganization` + endpoint, 501 tests) | Falta solo el botón de UI (carril aparte) |
| 2.14 | **Landed cost / reprecio FX automático** (importadoras) | 🟡 PERSEGUIR (venture #1) | Caso 0 = BE; bloqueado por S4 (columnas TR4) |
| 2.15 | **Meeting Intelligence** (audio→resumen→propuesta PDF) | 🔵 deployado, oculto | Activar cuando se use en ventas |
| 2.16 | **Jarvis por voz** (panel + Telegram) | 🟡 cableado, falta prueba en vivo | Cero costo |
| 2.17 | **LatAm multi-país** (socket listo) | 🟡 | Solo con lead extranjero PAGANDO. "Moat, no wedge" |
| 2.18 | **On-premise / VPS gestionado del cliente** (3 modelos de entrega) | 🔵 diseñado, probado con BE | Números finales = S1 |

## 3. Servicios de agencia (el cash engine)

| # | Idea | Estado | Nota |
|---|---|---|---|
| 3.1 | **Webs Web Factory** (790/1.500/2.900 + Cuidado Web mensual) | 🟢 vendible YA | Regla de oro: la web se cierra SIEMPRE con el mensual |
| 3.2 | **ONIA Motor Local** (Starter/Growth/Pro: presencia+GBP+landing+CRM+n8n+reporte) | 🔵 **olvidada** — definida completa | 5 Growth = break-even. Decidir si vuelve al pitch |
| 3.3 | **Automatizaciones n8n** (790–1.900) | 🟢 vendible YA | Upsell natural tras web |
| 3.4 | **Consultoría/implementación** (7 líneas, 250→9.500) | 🟢 | Auditoría/diagnóstico se regalan como gancho |
| 3.5 | **Onia Studio** (video/marketing IA a terceros) | 🟡 | Hoy Higgsfield = canal PROPIO (métrica: demos agendadas). Agencia para terceros = tras validar plataforma |
| 3.6 | **Modelo IA de marca para ecommerce** ("Mara Vale", packs 450→6.500) | 🟡 | v1 lista; no publicar sin OK |
| 3.7 | **"Te creamos tu influencer IA"** (B2B, ticket alto) | 🟡 | Lucía primero como demo viviente |
| 3.8 | **Meta Ads gestionados** (motor DRY ya deployado) | 🟡 | ⚠️ token USER vence 2026-09-05 → migrar a System User |
| 3.9 | **Auditor de webs gratis** (lead magnet unlighthouse) | 🟡 P1 | "La captación más barata del research" |
| 3.10 | **Capacitaciones IA a empresas** | ⚪ | Habilitada en el objeto social SEPREC; sin empaquetar |

## 4. Comercio físico e importación

> 📌 **El tema entero (e-commerce y dropshipping) tiene fuente única desde el 2026-09-04:
> [`ONIA_ECOMMERCE_Y_DROPSHIPPING.md`](ONIA_ECOMMERCE_Y_DROPSHIPPING.md).** Ahí están las
> cinco variantes ordenadas por realismo, el dato del riel de pago que las decide a todas, y
> los cuatro datos que faltan. Esta tabla es el índice; el porqué vive allá.

| # | Idea | Estado | Nota |
|---|---|---|---|
| 4.1 | **Nuvia** (skincare B2C, 315 productos) | 🟡 congelada a demo/dogfood | Solo si Arthur la opera con margen >40% sin horas de Sergio. = V2 del doc del tema, con 4 condiciones de despertar |
| 4.2 | **Importación de productos ganadores** | 🟡 | Bloqueo real = riel de pago (tarjeta ~USD 100/día) → LLC o gestor, decisión de Sergio |
| 4.3 | **Copiloto de sourcing** (radar productos + RFQ, gate humano) | 🟡 specado v1 | NUNCA comprador autónomo |
| 4.4 | **Tienda tipo Nuvia como línea propia** | 🔴 | Plegada como template e-commerce de Web Factory |
| 4.5 | **Live selling IA / TikTok Shop** | 🔴 en Bolivia | TikTok Shop no opera acá |
| 4.6 | **Dropshipping internacional** (AliExpress/CJ → Bolivia) | 🔴 **descartado CON gatillo** (anotado 2026-09-04, pedido de Sergio) | Sin riel: la tarjeta para pagarle al proveedor está capada, entrega de 30-60 días, aduana por pedido chico y cero operador de contraentrega. Reabre solo si se levanta el cap **o** aparece socio que ya importa y despacha |
| 4.7 | **Dropship contra pedido con proveedor LOCAL** | 🟡 **la más realista de las físicas** (anotado 2026-09-04) | Vender primero, comprar en Bs después. Esquiva el riel entero. Le faltan 2 cosas, ninguna es código: factura de proveedor que pruebe margen, y alguien que atienda y entregue que no sea Sergio. En categoría **no regulada** también cae el registro sanitario |

## 5. Infraestructura / hardware como negocio

| # | Idea | Estado | Nota |
|---|---|---|---|
| 5.1 | **Home lab** | 🟡 ahorro interno sí (bolsa Bs 800) | PROHIBIDO alojar servicios de clientes desde casa; como servicio externo solo con soporte claro |
| 5.2 | **Vender instalación on-premise** (el cliente pone el fierro) | 🔵 diseño completo + compose probado | Este SÍ es el producto vendible (no "vender servidores"); trigger fase 3 premium |
| 5.3 | **GPU propia / workstation** | 🔴 no comprar ahora | Gatillo: gasto API >$200-300/mes × 3 meses; primero ALQUILAR |
| 5.4 | **Stack self-hosted como ahorro** | 🟢 vivo (LiteLLM, Speaches, SearXNG…) | Pendiente: bajas de Fathom/Tavily; gate RAM VPS |

## 6. Contenido, canales e influencers

| # | Idea | Estado | Nota |
|---|---|---|---|
| 6.1 | **Canal YT "ONIA Automatiza"** (funnel a producto, ES) | 🟡 plan completo, PAUSA | Fase 0 = solo Sergio (canal + OAuth) |
| 6.2 | **Canal YT "Máquina Humana"** (CPM alto, salud/rendimiento) | 🟡 plan + piloto specado, PAUSA | YMYL guardrails; AdSense vía Payoneer resuelto; IVA = pregunta al contador |
| 6.3 | **"Atlas AI Media Holding"** (2 canales EN/ES + newsletter + afiliados + templates) | 🔴 archivado | Su conclusión útil sigue viva: "afiliados B2B + newsletter > AdSense" |
| 6.4 | **Lucía Antelo** (influencer IA que vende) + roster de 4 | 🟡 infra lista, NO publica | Bloqueos: token IG (ruta sin App Review identificada) + gasto generación. Lucía NUNCA testimonia (FTC) |
| 6.5 | **Serie Reels "Radar IA"** (ep.001 producido) | 🔵 | Espera TU aprobación: Path A (24s sin voz) vs B (62s con voz) |
| 6.6 | **"Clínicas Sin Pacientes Perdidos"** (autoridad vertical → DentalGest) | 🟢 decisión final de estrategia de contenido | Reemplaza al canal genérico de IA |
| 6.7 | **Marca personal de Sergio** (builder en público) | 🟢 activo, costo 0 | El activo que sirve a los 3 frentes; métrica = emails |
| 6.8 | **Motores**: Content Engine Remotion · Video Factory · Hyperframes (HTML→MP4) · Estudio de Contenido en panel | 🔵 construidos | Son la fábrica que §10 le entrega a Arthur |
| 6.9 | **Fútbol Lab IA** | 🔴 archivado | Superado por estrategia vertical |
| 6.10 | **Fanvue/adulto para las modelos** | 🔴 | Choca con posicionamiento; jamás Lucía |

## 7. Educación / cursos

| # | Idea | Estado | Nota |
|---|---|---|---|
| 7.1 | Cursos "operá tu negocio con IA" / "levantá tu SaaS con IA" / Higgsfield marketing | 🟡 parqueados | En esta ventana SOLO como taller gratis/lead-magnet |
| 7.2 | **Taller gratis "facturación en línea 2026"** | 🟡 "B1 = YA, sin rama" | El gancho SIAT; se pliega al marketing |
| 7.3 | **Escalera reto USD 39 → comunidad USD 29/mes → implementación 497-997** | 🟡 regla dura: no cobrar hasta 1.000 emails | Cobro desde Bolivia resuelto: Hotmart + QR Simple (Stripe/PayPal no operan) |
| 7.4 | **"Onia Academy"** (sub-marca) | 🟡 | Única excepción autorizada a la marca única, si aparece comprador distinto |
| 7.5 | **Consultoría de estructura comercial** — armarle a una empresa CÓMO vende: flujo de tienda, números, chatbot, seguimiento | 🟡 **parqueada, con gatillo** | Ver §7.5-bis. Nace de una reunión real (2026-07-31) |

### 7.5-bis · Consultoría de estructura comercial — el caso que la origina

**Reunión real (2026-07-31).** Un vendedor B2C con tienda **Shopify** le plantea a Sergio tres
problemas juntos: no logra manejar sus números, **no tiene chatbot**, y **su flujo de venta en
la tienda no está estructurado**.

**Por qué se anota y no se persigue todavía.** Es un servicio: se paga con horas de Sergio y
compite por el mismo tiempo que la plataforma, que es lo único que escala. Mientras haya cero
clientes de suscripción, sumar un frente de consultoría atrasa el objetivo. **Se anota, no se
arranca.**

**Pero trae una señal de producto que sí vale.** Los tres dolores que describió NO son de
Shopify: son de cualquiera que venda. Y dos de los tres ya existen en Onia:

| Su dolor | Qué tiene Onia hoy |
|---|---|
| "No manejo mis números" | 🟡 Reportes y caja existen; **falta el tablero con alertas por umbral** (el mismo que pidió el analista de CAINCO). **Es el mismo hueco para los dos** |
| "No tengo chatbot" | 🟢 Construido: entiende, responde y agenda. Solo falta conectarlo a un número |
| "Mi flujo de venta no está estructurado" | 🔴 No existe: falta **embudo/pipeline** — de dónde vino el cliente, en qué paso está, qué falta para que compre |

**Lo que confirma:** el **tablero con alertas** aparece pedido por dos personas distintas, de
rubros distintos, en una misma semana. Deja de ser una idea y pasa a ser demanda observada.
Es el candidato más fuerte a próximo módulo transversal.

**Lo que NO significa:** que haya que integrarse con Shopify. Onia tiene su propio módulo de
comercio; conectarse a Shopify es otro producto y otro comprador. Si aparecen tres pedidos más
de Shopify, se reevalúa.

**Gatillo para arrancar la consultoría:** cuando haya **3 clientes de plataforma pagando** y el
servicio se pueda vender como *acompañamiento del sistema* —no como consultoría suelta— con
techo de horas declarado. Antes de eso, es distracción cara.

## 8. Canales de venta y modelos comerciales

| # | Idea | Estado | Nota |
|---|---|---|---|
| 8.1 | **Contadores como canal B2B2B** (1 contador = 10-30 negocios) | 🟡 AHORA | 35% de 1ª mensualidad + Contador Pack gratis con referido |
| 8.2 | **Colaboradores por resultado** (Arthur; Camila cierre; Jerónimo en banca) | 🟢 reconfigurado hoy → ver §10 | |
| 8.3 | **Onia se vende con sus propios agentes** (dogfood Vendedor) | 🟡 AHORA | "Este agente que te vendo es el que te atendió" |
| 8.4 | **Cohorte fundador** (precio congelado primeros N) | 🟡 método ratificado | ⚠️ nunca "de por vida": cláusula de ajuste semestral |
| 8.5 | **Gradiente self-serve** (concierge → asistido → self-serve) | 🟢 decidido | `provisionOrganization()` = misma función las 3 etapas |
| 8.6 | **ONIA Empresarial E1-E3** (USD, ancla TR4) | 🟡 | Se calibra al cerrar BE fase 1 |
| 8.8 | **Publicidad con influencers IA como MÓDULO/apartado** (pedido Sergio 2026-08-06) | 🟡 ANALIZAR | Dos caras: (a) clientes ADQUIEREN publicidad sobre las influencers IA de Onia (Lucía/Mara — Souls listos, publicación gateada por token IG S6 + regla cara-IA-con-OK); (b) Onia les CONSTRUYE una influencer propia a la marca. Productizado self-service (media kit + tarifas + pedido desde el panel), NO agencia a medida (regla §3.5). Conecta con el add-on "videos IA" que ya existe en propuestas. Gates: S6 + validar demanda con 1 pedido pago. Research de cómo lo venden otros: en curso 2026-08-06 |
| 8.9 | **Sitio multi-página** (pedido Sergio 2026-08-06): apartados marketing-IA, consultoría/capacitación (el objeto social las cubre), "sobre nosotros", casos — con SEO/redirecciones, no todo en la landing | 🟡 PRÓXIMA SESIÓN | Research de sitemaps de startups comparables en curso; construir sobre la landing existente (web-factory) |
| 8.7 | **Live commerce / TikTok Live** (pedido Sergio 2026-08-06) | 🟡 PENDIENTE anotado | Dos caras: (a) **apartado en Onia Platform para que los clientes hagan lives y vendan productos en vivo** (el live como punto de venta: catálogo + pedidos del live a la caja/kardex existentes); (b) **canal propio**: vender productos de Onia/importación por TikTok Live, y TikTok Shop cuando llegue a Bolivia. Razón de reapertura: el TikTok Live es supertendencia en Bolivia hoy. Gatillo de ejecución: regla WOW — cliente pagando que lo pida, o decisión explícita de Sergio de priorizarlo |

## 9. Descartadas (que no vuelvan sin razón nueva)

Plataforma horizontal por créditos (Dapta clone) · granja de celulares · TikTok Shop Bolivia (⚠️ REABIERTO 2026-08-06 con razón nueva — supertendencia de TikTok Live en Bolivia → §8.7) · Nuvia como retail operado · compra autónoma de importación · OpenClaw · Fanvue · canal genérico de IA · contenido kids · diagnóstico IA sobre radiografías (YMYL) · simulador facial AR · servidor de correo propio · GPU comprada de entrada · LLM local de chat en el VPS · marca doble sin motivo (⚠️ REABIERTO hoy por colisión Oniya — research en curso).

---

## 10. NUEVA división de trabajo (decisión Sergio 2026-07-26)

> "No quiero que Arthur trabaje en el Onia Platform… prefiero que él se encargue de
> Higgsfield, de la creación de contenido, y yo me encargo de lo otro."

### Sergio + sesión de control (agentes/subagentes)
- **Onia Platform completo**: DentalGest, plataforma, agentes, fiscal/SIAT, infra/VPS, webs propias, pricing.
- **Ventas**: warm leads, demos, cierres, contadores-canal. (Camila entra SOLO en cierre cuando haya volumen.)
- **Decisiones de negocio**: naming, precios, gasto, contratos.

### El principio que define el carril de Arthur

Sergio construye la **oferta** (plataforma, producto, fiscal) y **cierra ventas**. El cuello de
botella real no es oferta — es **demanda** (0 clientes con todo construido). Entonces Arthur
no complementa construyendo más producto: **complementa generando demanda**. Su carril es el
motor que llena el embudo que Sergio cierra. Métrica única: **demos agendadas atribuibles**
(también es su forma de pago, decidida 2026-07-26).

### Arthur — carril CONTENIDO (Higgsfield + fábrica de video)
Paquete concreto (usa lo ya construido, no construye plataforma):
1. **Producción Higgsfield/Reels**: sacar adelante la serie "Radar IA" (ep.001 espera aprobación), banco de contenido para DentalGest ("Clínicas Sin Pacientes Perdidos") y material de demo.
2. **Operar la fábrica**: Estudio de Contenido del panel, Content Engine Remotion, Hyperframes, skills `ver-videos`/`editor-videos` — todo ya construido y documentado.
3. **Lucía/roster**: preparar contenido en cola (sin publicar) hasta token IG.
4. **Nuvia**: si él la opera (regla: margen >40% sin horas de Sergio), es su negocio lateral 50/50 — no de ONIA.

**Reglas duras del carril de Arthur:**
- Gasto de créditos (Higgsfield/ElevenLabs/etc.) = SOLO con OK explícito de Sergio, por pieza.
- NADA se publica sin aprobación de Sergio (regla vigente de contenido con cara/marca).
- No toca código ni repos de la plataforma; su carril son `hermes-content/references`, `channels/`, el Estudio del panel y las cuentas de contenido.
- Prompts/tareas que "terminan y paran" (mismo formato bounded de siempre).

**Pago de Arthur → DESARROLLADO 2026-08-01 en `ONIA_ARTHUR_CARRIL_CONTENIDO_Y_PAGO_20260801.md`.**
Tres capas sobre el acuerdo firmado (que no se reemplaza): bounty por demo atribuible (puente
antes de que exista una venta) + **20% de la base repartible durante 6 meses** de cada cliente
de plataforma atribuible (reemplaza al "35% del primer mes", que es el instrumento equivocado
para un ingreso recurrente) + bonos por hito, incluido uno del objetivo de la casa. La zanahoria
larga es el revenue-share del módulo "Onia te publica" (uso 2). Nunca sueldo fijo. Quedan 4
decisiones de plata para Sergio en §8 de ese doc.

---

## 11. Reglas para ideas nuevas (para que este catálogo no vuelva a perderse)

1. Toda idea nueva se ANOTA acá (una fila, con doc fuente si crece) — no se persigue en la sesión donde nace.
2. Toda idea se clasifica contra el filtro §1: si no acerca un pago en semanas, nace 🟡 con gatillo explícito.
3. Las 🔴 descartadas no se reabren sin un hecho NUEVO (cliente pagando, ley nueva, capital nuevo).
4. Este doc se actualiza al cerrar cada sesión que toque estrategia (el detalle va al doc fuente, acá solo estado).

---

## 12. Pedidos de Sergio Urcullo — 2026-09-06 (once en un mensaje)

> Entraron todos juntos, al final de la sesión que cerró el orden de trabajo de la 1.0.
> Se anotan acá por la regla §11.1 — **una idea no se persigue en la sesión donde nace** — y
> se clasifican contra el filtro §1: *¿acerca un pago en las próximas semanas?*
>
> **Lo único que se persigue ahora son los dos ítems marcados 🟢 EN CURSO**, porque son
> defectos de la 1.0 encontrados caminando el recorrido de comercio, no ideas nuevas.
> Todo lo demás espera a que la 1.0 esté lanzada. Él mismo lo dijo en el mismo mensaje:
> *«ya lancemos la versión uno punto cero»* — y nueve de estos once la empujan hacia atrás.

| # | Pedido | Clase | Estado | Qué lo frena / gatillo |
|---|---|---|---|---|
| 1 | Alta manual de cliente en comercio | defecto 1.0 | ✅ **HECHO 6-sep** (`31b1586`, en producción y probado ahí) | — |
| 2 | Reimprimir un recibo después de cobrar | defecto 1.0 | ✅ **HECHO 6-sep** (`fe4026e`, en producción y mirado ahí) | — |
| 3 | Layout que use el ANCHO, no solo scroll vertical | UX 1.0 | 🟡 anotado | Toca TODAS las pantallas. Es rediseño, no arreglo: entra después de lanzar o se come el lanzamiento |
| 4 | Sidebar colapsable a solo iconos | UX 1.0 | 🟡 anotado | Chico y contenido. Candidato a entrar con el #3, misma pasada |
| 5 | Revisión final de precios | decisión | 🔴 **DE SERGIO URCULLO** | Las 4 preguntas ya están medidas en `handoff/onia-v1-panel-ui.md` §6. No falta análisis: falta que él elija |
| 6 | Vender el chatbot SIN la plataforma | packaging | 🟢 **APROBADO 6-sep**, post-lanzamiento | Ver §12.1. Va junto con el **2º escalón de conversaciones**, del que depende el precio de la recarga |
| 7 | Organización interna de Onia (ingresos, usuarios activos, GA, SEO) | producto nuevo | 🟡 anotado | Ver §12.2 — es un tablero para NOSOTROS, no acerca ningún pago |
| 8 | Conectar páginas web / API de OpenAI | capacidad | 🟡 anotado | Ver §12.3 — el motor del chatbot HOY no llama a OpenAI directo |
| 9 | Mirar Sendy Pro (competidor de chatbots) | research | 🟡 anotado | Barato y útil. Entra con el #6, no antes |
| 10 | Pagos: cripto/Binance USDT por QR | rail de cobro | 🟡 anotado | Ver §12.4 |
| 11 | LLC en EE.UU. para facturar en otros países | estructura | 🔴 fuera de la 1.0 | La 1.0 es **solo Bolivia** porque factura al SIAT. Gatillo: primer cliente fuera de Bolivia |

### 12.1 · Vender el chatbot suelto — el único que ensancha el embudo

Sergio Urcullo: *«el Onia platform es el sistema, el chatbot es el agente conversacional; que se
pueda comprar uno o el otro, o los dos juntos… cada uno puede funcionar sin el otro, pero juntos
son mejores»*.

**Por qué vale más que el resto de la lista:** hoy el chatbot es un **add-on** (`pricing.ts`,
Bs 390/mes) y para comprarlo hay que contratar antes un plan de la plataforma (Bs 320 el más
barato). O sea el ticket de entrada al chatbot es **Bs 710, no Bs 390**. Contra Xmart —el ancla
real, Bs 177 QR / Bs 296 Meta API— eso es entre 2,4× y 4× más caro por lo mismo. Soltarlo baja
el ticket de entrada un 45 % sin tocar el precio de nada.

**Lo que hay que resolver, y no es de copy:**
- `Organization.whatsappAddon` es un **booleano sobre una organización que ya existe**. Un
  cliente de solo-chatbot igual necesita organización, plan y login. Hoy **no existe un "plan
  chatbot"** en `subscription-plans.ts`: los cuatro planes son de la plataforma.
- El gate `isWhatsAppAddonActive()` asume plan vigente. Un solo-chatbot con `plan: free` choca
  contra `checkPlanExpiry` y contra los topes de `plan-limits.ts`.
- Decidir si el solo-chatbot ve el panel completo con casi todo vacío (mal) o una vista
  recortada (trabajo).

**Gatillo:** después de lanzar la 1.0, junto con el #9 (mirar Sendy Pro) y el #5 (precios),
porque los tres contestan la misma pregunta.

### 12.2 · Organización interna de Onia — tablero propio

Pedido: una org de Onia con secciones **distintas a las de los rubros** (sin dental), que muestre
nuevos ingresos, usuarios activos, Google Analytics y SEO.

**Lo que ya existe y hay que mirar antes de construir:**
- `onia-interna` **ya existe** como organización (plan `free`, `verticalTrackId:
  dentagest-clinical` — o sea hoy le muestra pantallas de dentista, que es exactamente lo que
  él señala).
- Ya hay tarea abierta para sacarla del rubro dental (`t_3a60bfef`, candidato `gestios-general`).
- `/admin/metricas` ya existe con métricas de la empresa.
- 🔴 **ONIA Center está ABANDONADO** (decisión de Sergio Urcullo, 31-ago) y era exactamente
  esto: el tablero interno. Reabrirlo con otro nombre es reabrirlo.

**El riesgo:** es un producto para nosotros, con cero clientes pagando. Por el filtro §1 no
acerca ningún pago, y por §10 de `ONIA_ESTRATEGIA_DE_EMPRESA.md` falla el test de tres
preguntas — no se le vende al mismo cliente que ya paga.

**El camino barato, si igual se quiere:** un `verticalTrackId` propio en `vertical-pack.ts` con
su nav, reusando `/admin/metricas`. GA y SEO son **integraciones nuevas con terceros**: eso ya es
otro tamaño y va aparte.

### 12.3 · Conectar páginas web y la API de OpenAI

Sergio Urcullo: *«el tema de las APIs de OpenAI nunca lo hiciste»*.

**Estado medido, para que la discusión arranque desde lo real:** el motor del chatbot **no llama
a OpenAI directo**. Va por **LiteLLM** (gateway con tope de gasto) y hoy corre `gpt-4.1-mini` por
variable de entorno. O sea *sí* hay un LLM detrás; lo que no hay es integración directa ni clave
de OpenAI propia en el producto.

Lo de "conectar páginas web" hay que desarmarlo, porque son tres pedidos distintos:
- (a) que el bot **lea el sitio del cliente** para responder con su contenido → es la capa de
  conocimiento, **ya existe** y se edita desde `/settings/chatbot`;
- (b) meter el **widget** en el sitio del cliente → **ya funciona** por Chatwoot;
- (c) **alta por URL** → ya decidido y resuelto con Crawl4AI
  (`ONIA_EXTRACCION_WEB_DECISION.md`, que además dice **no instalar scrapers nuevos**).

Sin desarmarlo, esto no es un pedido: son tres, y dos ya están hechos.

### 12.4 · Cobrar en cripto (Binance / USDT por QR)

Idea de un amigo de Sergio Urcullo. Anotada con su límite:

- El comprador de la 1.0 es **un dueño de negocio boliviano que paga en bolivianos**. Pedirle
  USDT agrega fricción, no la saca — y el rail local (QR BNB/BCP, comisión 0) ya está construido
  y esperando **credenciales suyas**.
- Donde sí sirve es **fuera de Bolivia**, que es el mismo territorio del #11 (LLC).
- ⚠️ Cobrar cripto tiene tratamiento fiscal propio en Bolivia y **no está estudiado**. Antes de
  prometerlo hay que pasarlo por la skill `onia-contabilidad-bolivia` con fuente citada, como
  cualquier tema fiscal.

**Gatillo:** el mismo que el #11 — primer cliente fuera de Bolivia. Antes de eso es fricción.

### 12.5 · Lo que este bloque le hace al lanzamiento, dicho claro

En el mismo mensaje conviven *«ya lancemos la versión 1.0»* y nueve pedidos que la agrandan.
Con la regla de la casa —**nada a medias, cerrar antes de abrir**— la 1.0 se lanza con lo que hoy
está verificado, y estos nueve entran después, en el orden que Sergio Urcullo elija de esta tabla.
Anotarlos acá es lo que hace posible lanzar sin perderlos.

---

## 13. Rediseñar la landing con «Fincash» de referencia — 2026-09-07

Sergio Urcullo mandó una grabación de 14 s: *«quiero que tomes de referencia esta landing para
hacer nuestra landing pero con nuestros colores datos y alma de la empresa»*.

### 13.1 · Qué es exactamente la referencia (medido, no de memoria)

**Fincash**, template de pago de *tailgrids* publicado en `21st.dev` (**USD 199**). La grabación
es el preview del modal, con el botón «Buy $199» a la vista. Es un template de **fintech**, no de
software de gestión.

Su arco, en orden: header fijo (Home · Features · Pricing · Contact + CTA) → hero con mockups de
la app (tarjeta de crédito, lista de transacciones) → **«Our Journey in Numbers»** (métricas de
tracción) → features en tarjetas grandes, cada una con una captura de móvil → testimonios con
foto y rol (Freelancer, Student, Start-up Founder) → **«Simple, Transparent Pricing»** con toggle
Monthly/Annually −20 % y tres planes (Free · Starter · **Pro** destacado) → footer de cuatro
columnas + newsletter + wordmark gigante de marca de agua.

**Su lenguaje visual: fondo casi negro + un solo acento verde lima.**

### 13.2 · Las tres cosas que chocan con lo que ya está decidido

No son objeciones al pedido: son las decisiones vigentes que el pedido toca, y por eso hay que
elegir antes de codear.

1. **Nuestro lenguaje visual aprobado es BASE CLARA, cero sombras** (hero aprobado el 1-sep, ver
   [[landing-v3-aprobada-base-clara]]). La referencia es dark. Son opuestos: no se pueden tener
   los dos, y "nuestros colores" no resuelve cuál gana el FONDO.
2. **«Our Journey in Numbers» y los testimonios no se pueden portar.** Cero clientes pagando ⇒
   está prohibido inventar cifras de tracción, logos o testimonios (regla «No fabricar», y la
   memoria [[primer-registro-real-y-alta-cerrada]]). Fincash llena media página con eso.
   Portarlo honestamente significa **reemplazar esas dos secciones**, no traducirlas.
3. **Las capturas del sistema NO se usan** (decisión registrada en
   [[landing-v3-aprobada-base-clara]]: «NUNCA capturas del sistema»). La referencia apoya casi
   todo su peso visual en mockups de su app.

⚠️ Y la regla que este carril ya pagó caro: **una superficie viva no se reemplaza sin que Sergio
Urcullo VEA la pieza terminada**. El 2026-08-20 se publicó una landing v2 sin ese paso, la
rechazó entera al verla y hubo que revertir en producción.

### 13.3 · Lo que sí se porta, y es lo valioso

Estructura y ritmo, que es donde la referencia realmente gana:

- **Precios EN la landing**, con toggle mensual/anual y un plan destacado. Hoy Precios es otra
  página; el template lo pone en el camino de lectura.
- Features como **tarjetas grandes con una sola idea**, en vez de lista.
- **Un CTA único repetido** en header, mitad y cierre.
- Footer de cuatro columnas con Legal separado de Producto.

### 13.4 · Estado

🟡 **Anotado, esperando cuatro decisiones de Sergio Urcullo** (fondo claro vs oscuro; qué
reemplaza a métricas/testimonios; página nueva vs. reforma de la viva; y si entra antes o después
de lanzar la 1.0). Sin eso, cualquier cosa que se construya se rehace.

---

## 14. Revisión del guion del embudo y «que se configure desde la plataforma» — 2026-09-08

Pedido de Sergio Urcullo: *«revisá el guion del embudo, y que sea configurable desde la
plataforma, para eso está la plataforma»*.

### 14.1 · El guion está bien. Con un agujero.

Medido sobre `DEFAULT_CONFIG.script` del motor vivo: **47 mensajes**, y de esos **cero**
exhiben obra («muy pronto», «en construcción», «beta») y **cero** sueltan cifras de plata
fuera de la FAQ de precios. Tono honesto desde la primera línea («Sí, un bot»), y el embudo
cierra: saludo → calificación → demo con horarios → recordatorio → seguimiento.

🔴 **Lo que falta: hay UNA sola rama por rubro, y es dental.** `M1_RAMA_DENTAL` pregunta
*«¿cuántos sillones tenés?»* — la pregunta que demuestra que entendés el negocio del otro.
Los otros cuatro rubros que el alta vende (comercio, servicios profesionales, estética,
veterinaria) caen en la calificación genérica. Es el MISMO defecto que los loops estuvieron
arreglando toda la semana en la plataforma, pero en el bot: el dentista siente que le hablan
a él, la ferretería siente que le hablan a otro.

### 14.2 · Configurable desde la plataforma: por qué hoy no se puede, medido

| Dato | Valor |
|---|---|
| Mensajes del guion | **47** |
| Editables desde afuera | **3** (`siat`, `precios`, `negocio`) |
| De dónde lee el bot de Onia | **archivo** (`/tmp/onia-bot/knowledge.json` en el VPS) |
| De dónde lee el editor de la plataforma | **base** (fuente `"db"`, por organización) |

Los 3 editables no son un olvido: son un **candado deliberado**. La capa editable «elige el
TEXTO de una respuesta que YA EXISTE; no puede inventar un mensaje nuevo ni cambiar a qué
rama del embudo se contesta» (`knowledge.mjs`, diseño §4 candado 1). Eso es lo que impide
que una edición apurada haga que el bot prometa algo que el producto no hace.

**El nudo real es otro, y es de arquitectura:** el modo se decide por la FUENTE del
conocimiento. `bot-engine.mjs:504` — `if (config.modo === "recepcionista")` — y el modo
recepcionista se activa **cuando el conocimiento viene de la base**. El comentario lo dice
sin vueltas: *«todo el guion de leads de abajo queda EXCLUSIVO del modo venta»*.

O sea, hoy:
- **Fuente archivo** ⇒ modo VENTA ⇒ tiene el embudo (demo, horarios, seguimiento), **no se
  edita desde la plataforma**.
- **Fuente base** ⇒ modo RECEPCIONISTA ⇒ **se edita desde la plataforma**, pero *no hay demo
  de Onia que agendar*: pierde el embudo entero.

Pasar el bot de Onia a la plataforma tal como está hoy **le saca el embudo de venta**. No es
un flag: hay que **desacoplar «fuente = base» de «modo = recepcionista»**, para que el modo
venta pueda leer su conocimiento de la base como cualquier cliente.

### 14.3 · Qué haría falta, en orden

1. Separar el modo de la fuente: que el modo sea un campo explícito del documento publicado
   (`modo: "venta" | "recepcionista"`) en vez de derivarse de dónde vino el dato.
2. Dar de alta el bot de Onia como una organización más con su inbox, y publicar su
   conocimiento desde `/settings/chatbot` como cualquier cliente — comiendo nuestra propia
   comida, que es justo el argumento de Sergio Urcullo.
3. Recién ahí, ampliar `FAQ_TEMPLATE` con las claves del guion que se quieran abrir. **No
   las 47**: cada clave abierta es una promesa que alguien puede escribir sin revisión, y el
   guardrail sólo atrapa cifras y ofertas, no una capacidad inventada.

**Estado:** 🟡 anotado, no construido. El punto 1 toca el motor del bot y su suite de 503
tests; no es trabajo de una vuelta y no se empieza sin decidir el punto 3 primero.
