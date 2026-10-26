# Servicios por caso — precios de hoy, propuesta de subida y lo que enseña el mercado

> 2026-08-01. Pedido de Sergio: definir los servicios por caso con precio actual y
> posibilidad de subir, mirando el mercado. Disparador: reel de @cashflow.automations
> ("6 Agents every Automation agency Needs", 417 likes en 1 día).
>
> **Los precios los decide Sergio (bloqueo S1). Esto es propuesta con números únicos —
> nunca rangos (regla anti-discusión 2026-08-01).**

---

## 0. Lo que vi en el reel (cobertura: 8 frames de 15 s + caption completo)

@cashflow.automations vende **workflows n8n con nombre de agente**, uno por dolor:

| # | Agente | Qué es por dentro |
|---|---|---|
| 1 | Lead-Gen Agent | Google Maps Lead Scraper (n8n) |
| 2 | Marketing Agent | Generador IA de video + carrusel que postea a TikTok/IG |
| 3 | Voice Agent | Recepcionista de voz IA |
| 4 | Follow-up Agent | Campañas de Gmail automatizadas |
| 5 | *(no capturado — el frame no cayó)* | |
| 6 | Service + Follow-up Agent | Company News Scraper + reuniones del día |
| CTA | "Comment AGENTS and I'll send you all of them" | Lead magnet por comentario → DM |

**Las tres lecciones, en orden de valor:**

1. **Se vende el dolor con nombre propio, no la tecnología.** Ellos cobran por "Lead-Gen
   Agent"; nosotros cotizamos "automatización simple n8n Bs 790". El mismo n8n por dentro.
   El nombre es el precio.
2. **Todo lo del reel ya lo tenemos construido.** Scraper de prospectos (harvester),
   chatbot que agenda (BE), agentes Recall/Cobrador/Vendedor, content engine, briefing
   diario. No hay nada que construir — hay que re-empaquetar.
3. **El CTA por comentario es replicable con lo nuestro.** "Comentá AGENTE" y responde
   nuestro propio chatbot = dogfood del catálogo §8.3 ("Onia se vende con sus propios
   agentes"). Pieza para Arthur, formato calcado, con HyperFrames gratis.

---

## 1. ⚠️ Antes de subir nada: hay DOS precios vigentes en los docs

| Servicio | `ONIA_CASH_ENGINE_SERVICE_CATALOG` | `KIT_VENTAS_AGENTE_IA` |
|---|---:|---:|
| Landing | **Bs 790** | **Bs 1.490** |
| Flujo aprobación n8n | Bs 1.200 | Bs 1.800 |

**RESUELTO 2026-08-01:** manda el canónico ya declarado en CLAUDE.md →
`PRICING_RATIONALE_INTERNO.md` §0: **lanzamiento 790 / 1.500** (desde 2026-07-03). No era
una decisión nueva — era aplicar la existente. `historial/KIT_VENTAS_AGENTE_IA_2026.md` quedó
corregido con nota al tope apuntando al canónico.

**Y los precios de la plataforma (320/750/1.500) son PROVISIONALES** — Sergio 2026-08-01:
"aún está en veremos". Se usan como referencia de trabajo (comisiones de Arthur, simulaciones)
pero no se publican como definitivos hasta la decisión post-BCP.

---

## 2. La tabla: caso → servicio → precio hoy → propuesta

Regla de la escalera: **cada servicio abre un mensual**; la web sola sin mensual no
compone. Y todo servicio empuja hacia la suscripción de plataforma.

### Entrada (cierran en días)

| Caso del cliente | Servicio (nombre de venta) | Hoy | Propuesta | Nota |
|---|---|---:|---:|---|
| "No sé qué me falta" | Auditoría Express | 250 | **250** | Gancho, no se toca |
| "Estoy desordenado" | Diagnóstico + Plan de Acción | 690 | **690** | Convierte confusión en propuesta pagada |
| "No me encuentran en Google" | Landing de Captación | 790 | **790 lanzamiento** | Sube a 1.500 con 3 casos en portafolio (regla ya escrita en PRICING_RATIONALE §0) |
| "Mi web da vergüenza" | Web Profesional | 1.500 | **1.500 lanzamiento** | Sube a 2.900 con portafolio |
| "Quiero vender online" | Web Pro Onia | 2.900 | **2.900** | Ya tiene margen sano |

### Agentes (la subida real — el reel es la prueba de mercado)

Mismo n8n de siempre, empaquetado por dolor con nombre. **Siempre setup + mensual.**

| Caso del cliente | Hoy se vende como | Hoy | Nombre propuesto | Propuesta |
|---|---|---:|---|---:|
| "Pierdo consultas de WhatsApp" | (chatbot add-on, sin precio suelto) | — | **Agente Recepcionista** — responde, califica, agenda 24/7 | **1.500 setup + 350/mes** |
| "No sé qué pasa en mi negocio" | Briefing diario n8n | 1.800 + 350/mes | **Agente Reportero** — resumen diario al celular | **1.800 + 350/mes** (solo renombrar) |
| "Necesito más clientes" | (no existe como servicio) | — | **Agente Prospectador** — lista viva de prospectos del rubro + primer contacto aprobado | **1.900 setup + 590/mes** |
| "Copio y pego entre sistemas" | Automatización simple n8n | 790 | **Conector a medida** | **990** |
| "Nada avanza sin que yo apruebe" | Flujo de aprobación n8n | 1.200 | **Agente de Aprobaciones** — pide tu OK por WhatsApp/Telegram | **1.500** |
| "Mis clientes no vuelven" / "me olvido de cobrar" | — | — | **Recall / Cobrador** | **NO se venden sueltos.** Son EL argumento de la suscripción de plataforma |

Por qué Recall y Cobrador no se venden sueltos: son lo único que el competidor local no
tiene. Venderlos como servicio de 1.500 canibaliza la suscripción de 750/mes × para
siempre. El que los quiere, compra la plataforma.

### Contenido (carril de Arthur)

| Caso | Servicio | Hoy | Propuesta |
|---|---|---:|---:|
| "No tengo tiempo de publicar" | Pack 8 videos/mes | 2.200/mes | **2.200** |
| | Pack 16 videos/mes | 3.900/mes | **3.900** |
| "Quiero delegar mis redes" | Contenido mensual gestionado | cotizado | **Fijar: 1.900/mes** (calendario + piezas + reporte) |

### Recurrentes chicos

| Caso | Servicio | Hoy | Propuesta |
|---|---|---:|---:|
| "No quiero tocar mi web nunca" | Cuidado Web | 190/mes | **290/mes para clientes nuevos** — 190 quedó abajo del valor (mercado local cobra 300+ por mantenimiento) |
| "Que nada se caiga" | Monitoreo automatizaciones | 350/mes | **350/mes** |

---

## 2-bis. Infraestructura y costos de terceros, servicio por servicio

> Pedido de Sergio 2026-08-01: "poner en precios la infraestructura que haga falta —
> VPS, Meta cobra, y todo lo extra de cada cosa."
>
> Regla vigente que esto cuantifica: **los costos de terceros van EXCLUIDOS del precio y
> a nombre del cliente** (dominio, hosting, pasarela, créditos IA, WhatsApp pagado, pauta).
> ⚠️ Casi todos son en **USD con TC flotante (~Bs 11,9 hoy)** — cotizar con el TC del día
> y contrato con cláusula de ajuste, nunca "precio fijo de por vida".

### Los números base

| Insumo | Costo real | Quién paga | Fuente |
|---|---|---|---|
| **VPS Onia** (Easypanel, corre n8n + chatbot + Speaches + Cal.com + Chatwoot) | fijo mensual `[FALTA DATO: factura real]` — costo **marginal por cliente ≈ 0** hasta saturar RAM | Onia (Fondo) | infra propia |
| **WhatsApp API — respuestas** (ventana de servicio 24 h) | **GRATIS** | — | Meta, jul-2026 |
| **WhatsApp API — utility** (recordatorios, confirmaciones) | USD 0,0119/msg ≈ **Bs 0,14** | cliente (dentro del mensual, con tope) | Meta "Rest of Latin America" (incluye Bolivia), jul-2026 |
| **WhatsApp API — marketing** (reactivación, promos) | USD 0,0777/msg ≈ **Bs 0,92** | **cliente, SIEMPRE aparte** | ídem |
| **IA del chatbot** (gpt-4o-mini vía LiteLLM) | medido: centavos de USD/día → ≈ **Bs 5-15/mes** por cliente activo `[ESTIMADO sobre uso real propio]` | dentro del mensual | litellm-db |
| **Dominio .com** | ≈ USD 12/año ≈ **Bs 145/año** | **cliente, a su nombre** (regla dura) | registradores |
| **Hosting web cliente** | Bs 0 (Vercel free / VPS Onia) hasta que el sitio pese | Onia mientras sea 0 | — |
| **Transcripción (Speaches)** | Bs 0 (VPS propio) | — | — |
| **ElevenLabs voz** (si un servicio la usa) | starter ≈ USD 5/mes ≈ **Bs 60** | cliente del servicio que la use | plan actual |
| **Higgsfield / generación** | por pieza, con OK previo | el proyecto que la usa | regla de gasto |
| **Pauta Meta Ads** | presupuesto del cliente | **cliente, SIEMPRE aparte** | — |
| **Pasarela QR (cobrar al cliente)** | comisión 0 (QR simple) | — | acuerdo BNB/BCP en curso |

### Qué infra carga cada servicio (y el margen real del mensual)

| Servicio | Infra que consume | Costo/mes estimado | Mensual | Margen |
|---|---|---:|---:|---|
| Landing / Web | hosting 0 + dominio del cliente | ~0 | — | setup puro |
| Cuidado Web 290/mes | hosting + monitoreo (VPS) | ~0 | 290 | ~100% |
| **Agente Recepcionista** 350/mes | respuestas gratis + IA Bs 10 + ~200 utility Bs 28 | **~Bs 40** | 350 | **~88%** |
| **Agente Reportero** 350/mes | n8n (0) + IA Bs 5 + utility Bs 15 | ~Bs 20 | 350 | ~94% |
| **Agente Prospectador** 590/mes | harvester (VPS) + IA Bs 15 | ~Bs 15 | 590 | ~97% |
| Conector / Aprobaciones | n8n (0) + utility del flujo | ~Bs 10 | 350 monitoreo | ~97% |
| Packs de video | Higgsfield por pieza (visible en la cotización) | variable | — | fijar por pack |
| Plataforma (provisional) | VPS compartido + IA + utility del tenant | ~Bs 30-60/tenant | 320-1.500 | alto |

**Las tres reglas que salen de esta tabla:**

1. **El mensual de cada agente incluye un TOPE de mensajes utility** (propuesta: 300/mes).
   Pasado el tope, se factura el excedente a Bs 0,25/msg (0,14 de Meta + margen). Sin tope,
   un cliente con volumen te come el margen y no te enterás.
2. **Marketing por WhatsApp NUNCA va incluido** en ningún mensual: Bs 0,92/msg lo convierte
   en un servicio aparte con presupuesto propio (igual que la pauta). El Recall de la
   plataforma manda utility (recordatorio de cita = Bs 0,14), no marketing.
3. **El VPS es costo fijo de Onia, no del cliente** — pero cada servicio nuevo que corre en
   él debe declararlo (RAM/proceso). El día que un cliente necesite VPS propio (on-premise
   o dedicado), ese VPS va **a nombre y cuenta del cliente** desde el día 1, igual que el
   dominio.

## 3. Cuándo sube cada precio (gatillos, no fechas)

| Gatillo | Qué sube |
|---|---|
| 3 casos reales en portafolio | Landing 790→1.500 · Web 1.500→2.900 (ya estaba decidido; acá solo queda junto) |
| 3 Agentes Recepcionista vendidos | Recepcionista 1.500→2.400 setup |
| El primer Prospectador con testimonio | Prospectador 1.900→2.900 setup |
| Verificación Meta lista (S5) | El Recepcionista pasa de "respuesta en horario" a 24/7 real → +200 al mensual |

Regla que no cambia: **el precio nuevo es para clientes nuevos.** Al cliente existente
nunca se le sube en medio de un contrato; se le sube en la renovación con aviso.

---

## 4. Qué puede vender Arthur de esta tabla (con su número único)

| Servicio | Arthur si solo trae | Arthur si vende y entrega |
|---|---:|---:|
| Auditoría / Diagnóstico | 10% | — (la entrega es de Sergio) |
| Landing / Web | 12% | 50% |
| Conector / Agente de Aprobaciones | 12% | 50% |
| Agente Recepcionista / Reportero / Prospectador | 12% | 30% (la entrega es técnica; 50% solo si algún día la domina completa) |
| Packs de video | 12% | 50% |
| Suscripción plataforma | 20% × 6 meses | 25% × 6 meses (si acompañó el cierre) |

---

## 5. La pieza que sale de este reel (para la semana 2 de Arthur)

Formato calcado, stack gratis (HyperFrames `browser` + `keyword` + `tag`):

> **"5 agentes que todo negocio boliviano necesita"**
> 1. Recepcionista (WhatsApp que responde solo) · 2. Reportero (tu negocio cada mañana en
> el celular) · 3. Recall (el paciente que no volvió) · 4. Cobrador (la cuenta que nadie
> siguió) · 5. Prospectador (clientes nuevos mientras dormís).
> CTA: **"Comentá AGENTE y te muestro los 5"** → responde nuestro propio chatbot (dogfood).

Diferencia con el original: ellos regalan los workflows (venden audiencia); nosotros
vendemos la implementación y la suscripción. No regalamos los JSON.

---

Relacionado: `ONIA_CASH_ENGINE_SERVICE_CATALOG_2026.md` (catálogo por estado) ·
`historial/KIT_VENTAS_AGENTE_IA_2026.md` (⚠️ precios viejos, corregir tras decisión §1) ·
`PRICING_RATIONALE_INTERNO.md` §0 (lanzamiento vs lista) ·
`ONIA_ARTHUR_CARRIL_CONTENIDO_Y_PAGO_20260801.md` (los % de Arthur).
