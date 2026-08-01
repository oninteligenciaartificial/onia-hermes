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

El vigente según CLAUDE.md y `PRICING_RATIONALE_INTERNO.md` §0 es el de lanzamiento
(**790 / 1.500**, desde 2026-07-03). El kit de agentes quedó con precios viejos.
**Decisión pendiente de Sergio: cuál manda — y el otro doc se corrige.** Un vendedor con
dos listas de precios es una discusión asegurada.

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
`KIT_VENTAS_AGENTE_IA_2026.md` (⚠️ precios viejos, corregir tras decisión §1) ·
`PRICING_RATIONALE_INTERNO.md` §0 (lanzamiento vs lista) ·
`ONIA_ARTHUR_CARRIL_CONTENIDO_Y_PAGO_20260801.md` (los % de Arthur).
