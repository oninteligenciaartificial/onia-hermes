# ONIA — Fichas de las modelos IA (roster, rubros, requisitos, precios)

> **Qué es esto:** la ficha operativa consolidada de cada modelo IA de ONIA — quiénes son,
> qué rubro cubren, qué venden, qué requieren y qué cuesta operarlas. Pedido por Sergio
> el 2026-08-01 ("arma las estructuras para las modelos").
>
> **Qué NO es:** un plan nuevo. Las decisiones operativas viven en sus fuentes y este doc
> las apunta: cuentas/API/compliance → `ONIA_INFLUENCERS_MULTICUENTA_CURSOS_20260725.md` ·
> veredicto y gates → `ONIA_LLUVIA_IDEAS_SERGIO_ARTHUR_20260801.md` §3.6-3.7 ·
> Mara Vale (identidad + prompts) → `AI_ECOMMERCE_MODEL_SYSTEM_2026.md` ·
> stack de video → `references/VIDEO_MODEL_STACK_DECISION_2026.md`.
>
> ⚠️ **Docs pendientes de push (otro dispositivo):** la investigación granja/clipping
> (`ONIA_GRANJA_CONTENIDO_MULTICUENTA_INVESTIGACION_20260801.md`) y el análisis de stack
> open-source (`ONIA_STACK_OPEN_SOURCE_PUBLICACION_COSTOS_20260801.md`) del 2026-08-01
> NO están en origin/main (verificado en ramas remotas). Sus conclusiones están
> incorporadas en §7; correr el autosync en ese dispositivo para no perder los fuente.

---

## 0. Estado verificado (2026-08-01, en la cuenta Higgsfield)

- Plan **Ultra**, ~**2.996 créditos**. Imagen Soul 2k ≈ **0,12 cr**; video ≈ **6-58 cr/clip**.
- Souls entrenados y `ready`: **`LUCIA-REAL-v2-clean`** (`36305a9b-af24-4390-959b-885082dddd5d`)
  y **`Mara BO v2`** (`6c94bbf0-bc71-4fe1-841e-f366bdb00b6e`) + Souls de Sergio.
- Test de consistencia de Lucía 2026-08-01: OK (job `4b47c0b8-5603-49e8-a456-96fb7c22b589`).
- TikTok en Higgsfield: 0 cuentas conectadas (existe `tiktok_connect` para publicar directo).
- **Dato de mercado:** Bolivia NO tiene influencer IA (Perú y Argentina ya tienen la suya).
  El claim "primera influencer virtual de Bolivia" está libre → es el gancho de prensa del
  lanzamiento de Lucía. Beauty = vertical #1 mundial en adopción de influencers virtuales.

## 1. Roster y orden de activación

| # | Modelo | Rubro | Estado | Gate de activación |
|---|---|---|---|---|
| 1 | **Lucía Antelo** (@lucia.antelo.oficial) | ~~Skincare / beauty UGC~~ → **Servicios ONIA a negocios** (corregido 2026-08-06, ver §2) | Construida; perfil y 6 posts listos; **no publica** | Alta manual de la cuenta [S] + app Meta/token (~1h, **sin App Review para cuentas propias**) + PVP productos + regla de gasto |
| 2 | **Mara Vale** | Modelo ecommerce / ads | Identidad + workflow listos | Lucía publicando con tracción, O primer cliente que pague ads/creatives con modelo IA |
| 3 | *(slot futuro, sin nombre)* | A definir por demanda real | No existe (correcto) | **NUNCA** antes de validar 1 y 2 (regla "no las 5 de golpe", doc 25-jul §4) |

**Regla de coherencia con el runway (11 semanas, 0 clientes):** este roster no compite con
vender la plataforma — Lucía corre por el carril H con gasto acotado y gates; el resto es papel
hasta que sus gates se abran.

## 2. Ficha — Lucía Antelo

**Identidad.** Latina, 26, cruceña, pecas, piel real (no plástica). "Amiga que sabe de piel".
Soul: `LUCIA-REAL-v2-clean`. Imagen base oficial: job `e2d0df73-922d-4073-aaad-1a082f7e8d04`.
Voz: la voz oficial ElevenLabs ya definida (ver catálogo §6.4-6.6). Español boliviano sutil
("harto", "¿no ve?"), sin caricatura.

> ⚠️ **CORREGIDO 2026-08-06 — lo de abajo quedó superado.** Lucía **no vende skincare**: vende
> **servicios ONIA a negocios** y es el caso vivo del producto "tu influencer IA". Motivo: el
> skincare sigue bloqueado en el gate de PVP + stock + envío, y el funnel B2B ya está probado.
> El SPF y el limpiador, si algún día salen, van con **Mara** (beauty/e-commerce). Detalle y
> razones: `ONIA_MODELOS_PERFILES_ALTA_20260806.md` §0. El párrafo original se conserva abajo
> porque el material de producto (medias, código LUCIA10) sirve igual cuando se reactive.

**Rubro y qué vende (versión original del 1-ago, PARQUEADA).** Skincare/beauty UGC, mercado
SOLO Bolivia (ángulo sol de altura + piel grasa por clima). Vende **productos propios de
Sergio**: protector solar (media
`fe6ed358-45d0-4b51-9bad-8e3beba259d8`) y limpiador facial (media `69196a1a-c2e9-434f-9a4b-0de752dc8255`).
CTA: link en bio → landing propia (web-factory) con captura de email → WhatsApp. Código de
atribución propio: **LUCIA10**. Cuando el curso exista, Lucía es su **caso vivo** (pilar 1 del
curso "Granja de Contenido IA") — pero el curso no se cobra hasta 1.000 emails (doc 25-jul §3).

**Contenido.** 5 pilares vigentes (problema→solución, rutina, mitos, antes/después, educación
rápida) + 6º pilar aprendido de Lil Miquela: **"vida" del personaje** (opiniones, mini-historias).
Cadencia objetivo al encender la cuenta: 4-5 posts/semana + stories diarias. Formatos: reels Seedance 2.0
(9:16, 15s, audio ON, sin trípode/zoom brusco/sobreactuación), carruseles (sistema propio),
fotos Soul. Captions y música en CapCut/editor-videos DESPUÉS de Higgsfield.

**Reglas duras propias.**
- Bio declara IA: *"Personaje digital creado con IA por Onia · Santa Cruz"* + label "AI creator"
  (opt-in IG) + `is_aigc` en TikTok. Es marca declarada, no persona falsa.
- **FTC:** Lucía presenta y demuestra; **NO testimonia como usuaria** ("yo lo uso y me encanta" = no).
- **No se alquila a terceros** (regla branded content IG, doc 25-jul §4): vende ONIA y productos
  de ONIA/Sergio, punto.
- Prohibido para siempre: comprar seguidores, pods, automatizar likes/follows/DMs, interactuar
  con las otras modelos de ONIA.

**Requisitos para encender (checklist completo en doc 25-jul §1).**
1. Email dedicado Zoho `lucia@…` — [S+C]
2. Chip boliviano real (solo si la plataforma lo exige; IG arranca con email) — [S], Bs 10-25
3. Alta IG **a mano desde teléfono real** → Professional/Creator — [S] (paso 100% humano)
4. Bio IA + label + 3-5 posts manuales — [S+C]
5. App Meta (Instagram Login, Standard Access) + token — [S], ~1h. **Publica HOY en cuentas
   propias** (+hasta 25 cuentas tester); el App Review de ~20 días es SOLO para publicar en
   cuentas de terceros/clientes. "S6" deja de ser bloqueo de semanas: es un trámite corto.
6. n8n publicación + cola de aprobación en Onia Center (gate humano) — [C]
7. TikTok: manual los primeros meses (la API propia exige audit que rechaza tools internas)
8. Lanzamiento con nota de prensa "primera influencer virtual de Bolivia" (El Deber, La Razón,
   Unitel, Red Uno) — palanca gratis que usaron Aitana (España) y Lola Santander (Perú)

## 3. Ficha — Mara Vale

**Identidad.** Modelo IA original para **ecommerce y anuncios sociales**, 28 años. NO es
celebridad, no copia creadoras reales, **no simula ser cliente real**: modela productos y
presenta demos con energía humana limpia (ficha completa y prompts en
`AI_ECOMMERCE_MODEL_SYSTEM_2026.md` §4-5, 3 rutas visuales). Soul: `Mara BO v2`.
Voz: `Mara Voice v1` (ElevenLabs, provisional). Workflow de video propio:
`MARA_VIDEO_GENERATION_WORKFLOW_2026.md` (+ dashboard Mara Pond Video Lab).

**Rubro y qué vende.** Modelo comercial "for hire" interna:
- **Creatives para clientes de ONIA** (web-factory / plataforma / ads): Mara aparece en los
  anuncios y fotos de producto DEL cliente, publicados en las cuentas/pauta del cliente.
  Se cobra como **add-on "videos IA"** de las propuestas (usar el add-on vigente del generador;
  no inventar tarifa nueva acá).
- **Nuvia** (tienda propia) cuando se destrabe el riel de importación/pago — hoy parqueada.
- Su cuenta propia (si se abre) es **portfolio/vitrina**, no canal de venta a terceros — misma
  regla de branded content que Lucía.

**Diferencia clave con Lucía:** Lucía es *influencer con audiencia propia* (marca-persona);
Mara es *modelo de producción* (asset comercial que aparece en piezas de otros). Por eso el
gate de Mara no es prensa ni seguidores: es **el primer cliente que pague creatives con IA**.

**Requisitos para encender.** Los mismos pasos 1-6 de Lucía SOLO si se decide abrirle cuenta
pública. Para el uso "modelo en ads de clientes" no necesita cuenta: solo Soul (ya está) +
workflow (ya está) + el add-on cotizado en la propuesta del cliente.

## 4. Costos de operación (por modelo activa)

| Ítem | Una vez | Mensual |
|---|---|---|
| Chip prepago (Tigo/Entel/Viva) | Bs 10-25 | — |
| Email Zoho (catch-all existente) | 0 | 0 |
| Créditos Higgsfield — banco 30 fotos Soul | ~4 cr | — |
| Créditos Higgsfield — 15-20 reels/mes | — | **300-600 cr** (≈ USD 15-30 a valor de mercado del crédito; sale del Ultra ya pagado) |
| ElevenLabs (voz) | — | 0-5 USD según plan/uso |
| Publicación (Postiz self-hosted / Upload-Post free) | 0 | **0** (Blotato USD 29 solo si hiciera falta) |
| Metricool (analítica, opcional) | — | USD 20-25 |
| VPS / n8n / Business Portfolios | ya existen | 0 |
| **Total por modelo** | **~Bs 25** | **USD 0-55 + créditos** (doc 25-jul §2.3) |

Con el plan Ultra actual (~3.000 cr) alcanza para **2 modelos publicando fuerte** sin comprar
créditos extra. La granja de celulares queda descartada para siempre (ahorro USD 3.100-4.500/año
y cero riesgo de contagio al Business Manager comercial — lluvia §3.7).

### 4.1 Protocolo de chips (los SIMs son llaves, no dispositivos)

1. **Compra:** Sergio compra 2 chips prepago (Tigo o Entel, ~Bs 10-15 c/u) en persona.
   En Bolivia el chip se registra con CI (norma ATT) → registrarlos al CI de Sergio. Eso es
   correcto, no un problema: las cuentas son marcas declaradas de ONIA, nada que esconder.
   NUNCA SMS virtuales, VoIP ni números prestados de terceros.
2. **Asignación:** chip #1 = Lucía · chip #2 = reserva/Mara. Un número = una modelo, sin
   reciclar entre cuentas. Las cuentas de ONIA usan el número normal de Sergio.
3. **Uso:** el chip entra al slot 2 del teléfono de Sergio (o a un teléfono viejo) SOLO en el
   momento de verificación: IG arranca con email (Zoho) y quizá nunca lo pida; TikTok
   probablemente sí. Se recibe el SMS, se verifica, listo.
4. **Blindaje inmediato post-verificación:** activar 2FA por app (authenticator) + guardar
   códigos de respaldo en el vault interno; **donde la plataforma lo permita, QUITAR el número
   de la cuenta** (IG lo permite con email confirmado). Esto elimina el riesgo real del
   "chip en el cajón": si la línea muere por inactividad, la telefónica recicla el número y
   quien lo reciba podría recibir SMS de recuperación de la cuenta.
5. **Mantenimiento:** si el número queda vinculado a alguna cuenta, la línea debe seguir viva:
   recarga mínima (~Bs 10) cada 2-3 meses con recordatorio en calendario (las prepago
   bolivianas se suspenden por inactividad; verificar plazo exacto del operador al comprar).
   Etiquetar el chip físico (modelo + número) y registrar número↔cuenta en el vault, no en
   docs públicos.
6. **Costo total real:** ~Bs 30 de chips + ~Bs 40-60/año de recargas de mantenimiento.
   No se compra ningún teléfono.

## 5. Precios (lo que generan las modelos)

| Fuente de ingreso | Modelo | Precio | Estado |
|---|---|---|---|
| SPF + limpiador (productos propios) | Lucía | **PENDIENTE: Sergio fija PVP en Bs** | Gate: cuenta creada + PVP fijado |
| Add-on "videos IA" en propuestas de clientes | Mara | El vigente del generador de propuestas (setup + mensual) | **Vendible YA** — no depende de redes |
| Reto pagado 14 días "Tu primera modelo IA publicando sola" | Lucía como caso vivo | USD 39 (Bs ~458) | Gate: 1.000 emails (Fase 0 gratis primero) |
| Comunidad mensual "Granja de Contenido IA" | ambas como casos | USD 29/mes → 49 en el miembro 300 | Gate: reto validado |
| Implementación acompañada (grupo de 8, 6 sem.) | — | USD 497-997 | Gate: comunidad andando (mes 9+) |
| Servicio "tu influencer IA" para empresas (modelo The Clueless/Magalu) | nueva por cliente | A tarifar cuando toque | **GATEADO**: nunca agencia-para-terceros antes de 3-5 clientes de plataforma pagando (lluvia §3.9) |

Cobro desde Bolivia: Hotmart (internacional) + QR Simple 0% (bolivianos). Stripe/PayPal NO
operan en Bolivia (doc 25-jul §3.3).

## 6. Decisiones pendientes de Sergio (las que abren gates)

1. Crear app Meta + token (checklist §1 pasos 12-15 del doc 25-jul; ~1h, sin App Review
   para cuentas propias). Destraba a Lucía y a la cuenta de ONIA el mismo día.
2. **Alta manual de la cuenta IG de Lucía** desde tu teléfono (paso humano, nadie más puede).
3. **PVP en Bs del SPF y el limpiador** + stock/logística de envío. Sin esto Lucía publica pero no vende.
4. **Presupuesto de créditos/mes por modelo** (propuesta: tope 600 cr/mes Lucía; Mara solo
   contra pedido de cliente). Regla de gasto vigente: generación paga con OK caso por caso.
5. OK a la **nota de prensa** "primera influencer virtual de Bolivia" (borrador lo hace Claude).
6. (Ya decidido, solo ejecutar: 2 Business Portfolios separados Personas/Comercial — doc 25-jul §2.2.)

## 7. Cómo se complementa con la investigación granja/clipping (2026-08-01)

La investigación de la granja de contenido **no compite con las modelos: las confirma y las
destraba.** Síntesis de encaje:

**Lo que la investigación valida del roster.** El "modelo que funciona" según la evidencia
(clipping/Whop/Forbes) es **distribuido**: cuentas de personas reales, en sus teléfonos, con
contenido genuino. La capa centralizada (cuentas agregadoras en nómina, granjas con racks) fue
la única suspendida (caso Stake.com) o quebrada (Icon). Las modelos de ONIA son exactamente la
arquitectura ganadora en miniatura: **2 cuentas propias declaradas como IA, contenido original,
API oficial, cola de aprobación.** Nada que cambiar en las fichas.

**Lo que la investigación destraba.** Standard Access publica en cuentas propias sin App
Review → el gate de Lucía baja de "semanas de S6" a "~1h de trámite + alta manual". Corregido
en §1, §2 y §6 de este doc.

**Lo que queda prohibido para las modelos (con base textual, no opinión):**
- Warming automatizado, bots de scroll/likes/follows: prohibido literal en TikTok ("bots o
  scripts para aumentar likes") y Meta ("interactuar con contenido... manual o automáticamente,
  a frecuencias muy altas"). Además el warming automático PRODUCE la señal que dispara el ban.
- Teléfono-por-cuenta / granja física: no hace falta (el SMS de verificación se recibe una vez,
  en cualquier teléfono). **SIMs reales para las modelos: 1-2 chips en total, Bs 50-100 una vez.**
- Riesgo confirmado en fuente primaria: Meta puede restringir el **Business Manager** por
  vinculación con cuentas que violan políticas → nunca arriesgar `act_1073680778314945` ni el
  futuro WhatsApp API por cuentas de contenido.

**El mecanismo rescatable — pago por resultado — y dónde se enchufa a las modelos:**
El clipping monetiza VISTAS; el negocio de clínicas no las necesita (150 clínicas listadas por
nombre), pero **Lucía (skincare B2C) y el curso (B2C LatAm) SÍ son negocios de audiencia.** La
versión legítima del clipping para ONIA, cuando toque:
- **Fase producto (post-lanzamiento de Lucía):** micro-afiliados bolivianos independientes —
  SUS cuentas, SUS teléfonos — pagados por venta atribuida (código de descuento propio por
  afiliado). Cero cuentas nuestras, cero granja. Es el acuerdo de Arthur (pago por demo
  atribuible) aplicado al skincare.
- **Fase curso (gate 1.000 emails intacto):** programa de clippers para el contenido del curso
  al estilo marketplace (pagar por vistas/leads a creadores independientes). Recién ahí el
  mecanismo de vistas tiene sentido económico.
- **Engagement de las modelos mientras tanto:** manual y dirigido (15-20 min/día), nunca
  automatizado.

**Veredicto operativo:** las modelos SE HACEN (nada de esta investigación las frena — al
contrario, acorta su camino). Lo único que NO se hace, para siempre, es la granja centralizada
con warming/auto-likes — y eso las fichas nunca lo necesitaron.

---
*Relacionado: memoria de sesión [[influencer-ia-skincare]] · investigación mundial de
influencers IA 2026-08-01 (Lu do Magalu, Aitana, Lola Santander) en la memoria del proyecto.*
