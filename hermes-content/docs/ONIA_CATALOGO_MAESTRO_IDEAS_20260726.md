# ONIA — Catálogo maestro de TODAS las ideas (2026-07-26)

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

| # | Idea | Estado | Nota |
|---|---|---|---|
| 4.1 | **Nuvia** (skincare B2C, 315 productos) | 🟡 congelada a demo/dogfood | Solo si Arthur la opera con margen >40% sin horas de Sergio |
| 4.2 | **Importación de productos ganadores** | 🟡 | Bloqueo real = riel de pago (tarjeta ~USD 100/día) → LLC o gestor, decisión de Sergio |
| 4.3 | **Copiloto de sourcing** (radar productos + RFQ, gate humano) | 🟡 specado v1 | NUNCA comprador autónomo |
| 4.4 | **Tienda tipo Nuvia como línea propia** | 🔴 | Plegada como template e-commerce de Web Factory |
| 4.5 | **Live selling IA / TikTok Shop** | 🔴 en Bolivia | TikTok Shop no opera acá |

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

## 8. Canales de venta y modelos comerciales

| # | Idea | Estado | Nota |
|---|---|---|---|
| 8.1 | **Contadores como canal B2B2B** (1 contador = 10-30 negocios) | 🟡 AHORA | 35% de 1ª mensualidad + Contador Pack gratis con referido |
| 8.2 | **Colaboradores por resultado** (Arthur; Camila cierre; Jerónimo en banca) | 🟢 reconfigurado hoy → ver §10 | |
| 8.3 | **Onia se vende con sus propios agentes** (dogfood Vendedor) | 🟡 AHORA | "Este agente que te vendo es el que te atendió" |
| 8.4 | **Cohorte fundador** (precio congelado primeros N) | 🟡 método ratificado | ⚠️ nunca "de por vida": cláusula de ajuste semestral |
| 8.5 | **Gradiente self-serve** (concierge → asistido → self-serve) | 🟢 decidido | `provisionOrganization()` = misma función las 3 etapas |
| 8.6 | **ONIA Empresarial E1-E3** (USD, ancla TR4) | 🟡 | Se calibra al cerrar BE fase 1 |

## 9. Descartadas (que no vuelvan sin razón nueva)

Plataforma horizontal por créditos (Dapta clone) · granja de celulares · TikTok Shop Bolivia · Nuvia como retail operado · compra autónoma de importación · OpenClaw · Fanvue · canal genérico de IA · contenido kids · diagnóstico IA sobre radiografías (YMYL) · simulador facial AR · servidor de correo propio · GPU comprada de entrada · LLM local de chat en el VPS · marca doble sin motivo (⚠️ REABIERTO hoy por colisión Oniya — research en curso).

---

## 10. NUEVA división de trabajo (decisión Sergio 2026-07-26)

> "No quiero que Arthur trabaje en el Onia Platform… prefiero que él se encargue de
> Higgsfield, de la creación de contenido, y yo me encargo de lo otro."

### Sergio + sesión de control (agentes/subagentes)
- **Onia Platform completo**: DentalGest, plataforma, agentes, fiscal/SIAT, infra/VPS, webs propias, pricing.
- **Ventas**: warm leads, demos, cierres, contadores-canal. (Camila entra SOLO en cierre cuando haya volumen.)
- **Decisiones de negocio**: naming, precios, gasto, contratos.

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

**Pago de Arthur (PROPUESTA, decidís vos):** mantener el modelo por resultado ya firmado, cambiando la métrica a su carril: la producción de contenido se mide en **demos agendadas atribuibles** (la métrica ya decidida para Higgsfield-como-canal) + bono por hito de producción aprobada. Nunca sueldo fijo. Alternativa: % de ventas cerradas con material suyo en el funnel.

---

## 11. Reglas para ideas nuevas (para que este catálogo no vuelva a perderse)

1. Toda idea nueva se ANOTA acá (una fila, con doc fuente si crece) — no se persigue en la sesión donde nace.
2. Toda idea se clasifica contra el filtro §1: si no acerca un pago en semanas, nace 🟡 con gatillo explícito.
3. Las 🔴 descartadas no se reabren sin un hecho NUEVO (cliente pagando, ley nueva, capital nuevo).
4. Este doc se actualiza al cerrar cada sesión que toque estrategia (el detalle va al doc fuente, acá solo estado).
