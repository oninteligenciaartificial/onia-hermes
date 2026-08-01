# ONIA — Estado y Rumbo (doc vivo)

> **Fecha:** 2026-07-26 · **Dueño:** Sergio · **Propósito:** LA página que responde de una vez
> "¿cómo estamos, es rentable, quién compite, es viable, qué hay en cartera y cómo seguimos?".
> Se ACTUALIZA (no se duplica) cuando cambie el estado. Sintetiza y NO reemplaza:
> `ONIA_VISION_ROADMAP_20260723.md` · `ONIA_PLATAFORMA_UNICA_BRIEF_DECISION_20260723.md` ·
> `research/ONIA_DENTALGEST_FISCAL_MERCADO_PRICING_20260725.md` ·
> `research/ONIA_RESEARCH_PACK_TOOLING_MODELOS_STARTUPS_20260726.md` ·
> `ONIA_MAPA_PRODUCTOS_POR_RUBRO_2026.md` · `ONIA_VPS_DB_MIGRACION_RUNBOOK_20260726.md` ·
> `ONIA_ACUERDO_ARTHUR_FUENTES_60_DIAS_2026.md`.
> Marcas: **[Sup]** = supuesto propio, no cifra verificada.

---

## LA PÁGINA EJECUTIVA

### 1. Foto hoy

**Construido (mucho):** la una-app Onia (blanco/negro/verde, logo v1 entregado, wizard `/empezar`,
legales en borrador) con **DentalGest completo en código** encima (core v1.0.0, 18 entidades,
503 tests; capa plataforma C1 + fiscal SIAT mock + agentes Recall/Cobrador en borrador C2);
los productos son **tracks de configuración**, no apps separadas (los nombres
DentalGest/GestiOS/ProveeGest son módulos/packs — `ONIA_MAPA_PRODUCTOS_POR_RUBRO_2026.md`).
Además: webs (onia-platform + landing dental), identidad, sales kit, runbook de migración al VPS
**listo sin ejecutar** (GO condicional de capacidad), 11 workflows n8n vivos, panel ONIA Center.

**Vendido (nada):** **0 clientes pagando.** Toda la competencia real de ONIA es de OFERTA;
el cuello de botella es DEMANDA (brief de decisión §2). 0 facturas SIAT reales emitidas.

**Runway honesto:** caja Bs 15.000 (aporte papá) − deuda Bs 4.000 = **Bs 11.000 netos**.
Al piso de Bs 4.000/mes → **~2,7 meses ≈ 11 semanas** (se acaba ~mediados de octubre 2026).
Peor en la práctica: parte de los costos (VPS, IA, tools) es en USD y el TC pasó de 6,96 a
**11,37 Bs/USD (+63%)** — cada gasto en dólares come runway un 63% más rápido que en mayo.
**El runway y la ventana SIAT (1-oct) mueren casi el mismo día.** Eso ordena todo lo demás.

### 2. Rentabilidad (unit economics, del doc de pricing 2026-07-25)

- **Precios ratificados (lanzamiento):** Básico 320 / **Pro 750 (el que se cotiza)** / Full 1.500 Bs/mes.
  Post-portafolio (3-5 casos): 390/890-990/1.990. SIAT incluido en los 3; lo que sube de tier es la
  automatización. Implementación regalada (vale Bs 2.274-9.096 de mercado, cuesta ~0).
- **Blended realista: ~Bs 1.000/mes por cuenta [Sup]** (base + 1-2 toggles). La cuenta expansora
  llega a 1.500-1.900 (NRR >100%: mes 1 = 750 → mes 12 = ~1.840).
- **Breakeven negocio: ~18 clínicas @ Bs 1.000 blended** (nut ~Bs 16.000/mes [Sup], incluye retiro
  Sergio 12k). **Breakeven supervivencia: ~4-5 cuentas blended** cubren el piso de Bs 4.000/mes.
- **Dónde vive el margen:** recurrente de software (~90-100% bruto, costo marginal ≈ encender un flag).
  Costo marginal de IA/agentes por cliente activo: **~Bs 50-200/mes según intensidad [Sup]**
  (ruteo litellm 2 carriles: clasificación ~$0.0002/acción, redacción sensible ~$0.004; presupuesto
  total <$10/mes hasta 50k acciones — research pack §4). Los peligrosos son los medidos
  (WhatsApp/pauta): pass-through estricto o metering, nunca fair-use absorbido.
- **Regla de contrato:** cláusula de ajuste semestral indexada TC BCB o IPC INE (el mayor).
  Nunca "precio de por vida". Cobrar trimestral adelantado por QR.

### 3. Competencias y competencia

**Lo que sabemos hacer que gana:** (1) **ingeniería con palanca IA** — 1 persona produce a velocidad
de equipo (la superpotencia); (2) **foso Bolivia fiscal** — SIAT sin re-tipear, IVA/IT/IUE, planilla,
Bs, QR — real pero **no probado en prod** (0 emisiones vivas); (3) **agentes human-in-the-loop**
sobre el ERP (el Cobrador ve la deuda real y emite la factura — Darwin AI no puede);
(4) WhatsApp-first (validado: ~60% de la población lo usa). Lo que NO tenemos: músculo de venta
B2B probado. Regla: muchos frentes de oferta en paralelo, **una sola motion de demanda a la vez**.

**Competencia (1 línea por rival, con su hueco):**

| Rival | Su hueco (donde ONIA gana) |
|---|---|
| **Alegra** (líder regional fiscal-pyme) | **NO opera en Bolivia** (selector verificado 2026-07-25); sin agentes ni WhatsApp-first |
| **Dentalink** (líder dental LatAm) | Caro en USD (29-100/mes = Bs 330-1.137, +63% por devaluación); cero SIAT Bolivia |
| **Dentiqa / Doctocliq / Citalo** | Ninguno resuelve SIAT boliviano; compiten por agenda, no por cumplimiento |
| **YoFacturo** (sí apunta a Bolivia) | Soporte SIAT **todavía en lista de espera** (verificado 22-jun-2026) |
| **Portal Web del SIN (gratis)** | Cumple la ley tipeando factura por factura — se dice DE FRENTE: "nosotros hacemos que no tengas que tipear" |
| **Siigo/Aspel** (roll-up contable) | Tampoco Bolivia; soporte colapsa en picos fiscales; su lección es el canal contadores, no su producto |
| **Odoo** | En Bolivia = proyecto a medida vía integradores, inviable para pyme sin informático |
| **AgendaPro / Darwin AI** | Agenda sin fiscal / agentes sin sistema de registro — ninguno tiene ERP+fiscal+agentes en una app |

**No existe competidor dental boliviano con precio en Bs publicado.** El hueco es real y
**caduca el 1-oct-2026** (después, todos habrán resuelto SIAT de alguna forma).

### 4. Viabilidad

**Funciona si — las 3 condiciones (las 3, no 2 de 3):**
1. **Vender YA con los warm leads** que ya escribieron: 3-5 clínicas pagando y renovando en 60 días,
   cobro a mano, cotizando el Pro (750). Retención valida; signups no.
2. **SIAT homologado antes del 1-oct** (NIT + certificación Fase 1). Es la única demanda forzada
   Y de alto margen; sin ella vendemos vitamina. Mientras tanto, pitch honesto: "operás con
   DentalGest y emitís por Portal Web hasta que nuestro emisor esté homologado".
3. **Disciplina de foco 60 días:** 100% de las horas no automatizables de Sergio en cerrar
   DentalGest. Todo lo adyacente subordinado a go-to-market, nunca P&L propio.

**Lo matan — los 3 riesgos:**
1. **Dispersión** (el asesino silencioso): cada frente adyacente se disfraza de progreso. Señal dura:
   si en una semana la mayoría de horas fue a Nuvia/video/cursos/arquitectura y no a prospectos, ya perdimos.
2. **Runway + descalce cambiario:** ingresos futuros en Bs, costos en USD a TC 11,37 y subiendo;
   si a las ~11 semanas no hay caja entrando, no hay segunda oportunidad. (Sub-riesgo: una 4ª
   prórroga del SIN desinfla la urgencia — por eso se vende timing, no ultimátum.)
3. **Techo de horas-fundador:** si 1-2 clientes saturan a Sergio y la prospección se frena, la
   unidad económica no cierra (breakeven 18 > techo de atención de 1 persona sin colaboradores).

### 5. Proyectos en cartera (parqueados, con gatillo de reapertura)

| Proyecto | 1 línea | Gatillo para reabrir |
|---|---|---|
| **Cursos / capacitadora** | Info-product real pero es OTRO negocio; hoy solo taller gratis lead-magnet ("cumplí facturación 2026") | Plataforma validada + 3-5 casos reales desde los cuales enseñar |
| **Nuvia retail** | Congelada a grado demo/dogfood: banco de pruebas SIAT+QR+checkout sobre NIT propio (capital 50/50 con Arthur, contabilidad separada) | Nunca como retail operado por Sergio; escala solo si Arthur la opera con margen >40% sin horas de Sergio |
| **Higgsfield servicio / Onia Studio** | Hoy = canal de adquisición PROPIO (se mide en demos agendadas, no views) | Vuelve como MÓDULO facturable (no agencia) cuando haya clientes pagando que lo pidan |
| **Canales YouTube** (onia-automatiza, ciencia-cuerpo) | Activos ONIA Media de maduración larga; planes escritos, producción mínima | Caja verde sostenida, o un operador (Arthur) que cumpla calendario completo; revisión cada 30 días |
| **Lucía influencer** | Producción en onia-system pausada por gasto (Sergio decidió solo texto) | Token IG (S6) + presupuesto de generación aprobado caso por caso |
| **LatAm / Argentina** | El socket queda listo (countryPack + FiscalEmitter); multi-país es MOAT, no wedge | Un lead de ese país PAGANDO — recién ahí se construye el país |
| **GPU local** | El VPS sin GPU no corre nada serio; APIs ruteadas cuestan centavos | Gasto API sostenido >$200-300/mes por 3 meses o cliente on-premise; primero ALQUILAR 4090, nunca comprar de entrada |

### 6. Cómo seguimos (la secuencia vigente, en orden)

1. **Corte VPS** — ejecutar el runbook de migración (Supabase Cloud → VPS; backups + R2 PRIMERO,
   higiene de swap obligatoria, ventana 60-90 min, rollback a cloud 7-14 días). Necesita **GO de Sergio**.
2. **Publicar webs** — onia-platform (con wizard `/empezar` + legales) y dentalgest-landing en vivo
   con dominio. Es la cara que ven los warm leads.
3. **Vender / demos** — warm leads primero; 5 llamadas de campo a clínicas de Santa Cruz (cierran
   competencia local + no-show + pipeline); demo tenant instantáneo; cotizar SOLO el Pro (750);
   cerrar regalando implementación, jamás bajando lista. Arthur empuja prospección/contenido
   bajo el acuerdo de 60 días (metas: 35 leads, 8 llamadas, 3 demos/semana).
4. **SIAT homologación** — NIT + certificación Fase 1 ante el SIN. Ruta crítica de ingeniería+trámite
   de las ~9 semanas; corre EN PARALELO a 1-3 desde hoy, no después.

**Bloqueos humanos S\* vivos (solo Sergio los destraba):**
**S2 NIT + homologación SIAT** (el #1 — convierte la oferta de vitamina en aspirina) ·
**S5/S6 verificación Meta + token WhatsApp/IG** (gate del chatbot add-on y de Lucía) ·
**S3 secreto intake n8n** · **S8 fiscal propio** (declaración de junio; NIT vence el día 13) ·
**OpenBCB** (acceso API QR del BCB, cobro cero-comisión — bloqueo nuevo tipo S\*).
S1 (precios) está **CERRADO**: 320/750/1.500 ratificados, no se toca ni un boliviano esta semana.

---

## ANEXOS CORTOS

### A. Qué está construido, con precisión (para no re-preguntarlo)

- **Una-app Onia:** capa cuenta/rubro/entitlements (C1) sobre DentalGest; wizard `/empezar` 3 pasos;
  identidad blanco/negro/verde + logo v1; términos/privacidad en borrador (validar con abogado).
- **DentalGest:** EN VIVO (`www.dentalgest.app`), core 9/9 entidades, commerce/invoicing/accounting
  portados aditivos; fiscal SIAT en mock (emisión real gateada por S2); agentes Recall/Cobrador
  generan borradores human-in-the-loop. Prod DB detrás del código (apply quirúrgico pre-corte).
- **GestiOS / ProveeGest / Ganadero:** tracks de config del mismo core. GestiOS = Sprint 0 pendiente
  (reconciliar DB↔código, RLS OFF crítico); ProveeGest sin repo propio; Ganadero sin git.
  **Ninguno se toca hasta que la habitación #1 tenga inquilino pagando.**
- **Infra:** VPS 4c/16GB (Easypanel) con stack Supabase staging ya corriendo; runbook de corte listo;
  n8n 11 workflows; ONIA Center reconstruido en componentes; Meta Ads engine en DRY.
- **Marketing/venta:** sales kit dental, generador de propuestas, motion pattern bank,
  acuerdo Arthur firmable (Fondo ONIA 40%, escala de intervención, CRM obligatorio en ONIA Center).

### B. Aritmética de venta (usar textual en demos)

- Pro Bs 750 = **dos ajustes de ortodoncia** (Bs 300-350 c/u): dos ausencias evitadas al mes y se pagó.
- Full Bs 1.500 = media endodoncia multirradicular (Bs 2.100). Un implante recuperado (Bs 3.000) = 2 meses de Full.
- Frase autorizada no-show: "en la región se pierde 10-30% de citas (datos Colombia/Chile; en Bolivia
  no hay estudio)" — nunca presentarlo como dato boliviano. El agente **reprograma**, no recuerda.
- Prohibido: "por ley tenés que comprarnos" (el Portal Web del SIN es gratis y el dentista lo googlea).
  Decirlo primero nosotros ES el pitch de confianza.

### C. Test de realidad (criterios de corte, del brief de decisión)

- **Va bien si:** ≥3 clínicas pagando Y usándolo a 30-60 días; una cuenta enciende un 2º módulo;
  la 2ª clínica se onboardea más rápido que la 1ª.
- **Parar y corregir si:** demos sin plata ("pagaría si construís X"); 1-2 clientes saturan a Sergio
  y frenan la venta; el calendario deriva a los proyectos parqueados.

### D. Mantenimiento de este doc

Actualizar al cambiar: # clientes pagando · estado SIAT (S2) · caja/runway · precios · un parqueado
que gatilla. Cambios de fondo van primero al doc ancla correspondiente; acá solo la síntesis.
