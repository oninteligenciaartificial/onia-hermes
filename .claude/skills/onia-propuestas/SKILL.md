---
name: onia-propuestas
description: Invocar cuando Sergio pida crear, cotizar, perfeccionar o enviar una propuesta comercial, cotización, presupuesto o pitch a un cliente de Onia (web, tienda, sistema/SaaS, automatización, add-on). Aplica el generador oficial y las reglas de pricing/valor de Onia; nunca escribir HTML de propuesta a mano.
---

# Onia — Propuestas comerciales

Fuente de verdad completa: `hermes-content/skills/propuestas-comerciales-onia.md`.
El subagente `onia-propuestas` se retiró el 18-ago: para armar en paralelo se delega un encargo cerrado (`equipo-de-agentes`).

## Leer primero
- `hermes-content/propuestas/generador/README.md`
- `hermes-content/propuestas/PRICING_RATIONALE_INTERNO.md` (§0 = hoja de lanzamiento; ver «Pricing» abajo)
- `hermes-content/propuestas/PLAYBOOK_CONSTRUCCION_INTERNO.md`
- `hermes-content/propuestas/ESTRATEGIA_PLANTILLAS_WEB_INTERNO.md`

## Regla base — NUNCA HTML a mano
Toda propuesta se genera con el sistema en `hermes-content/propuestas/generador/`:
```bash
node generar-propuestas.js <slug> --pdf   # un cliente
node generar-propuestas.js --pdf          # todos
node generar-propuestas.test.js           # verificar ANTES de publicar
```
Cliente nuevo = agregar objeto a `clientes.json` y correr el generador.

## Cada propuesta DEBE cumplir (resumen; detalle en la fuente)
1. **Niveles diferenciados por VALOR, no por páginas:** N1 presencia · N2 convertir · N3 automatizar.
   Cada plan lleva `resultado` + `limite` (ventaja y desventaja). Feature no liberada = marcar disponibilidad.
2. **Resultado por paquete** concreto (no solo qué incluye).
3. **`valor[]` = ROI real** (automatización, más clientes, ahorro de tiempo, autoridad). Vender resultado, no "una web".
4. **Dominio + hosting a cargo del cliente**, a su nombre — nunca en el precio.
5. **Costos de terceros excluidos:** dominio, hosting, comisión pasarela, créditos IA, WhatsApp pagado, pauta.
6. **WhatsApp:** botón click-to-chat INCLUIDO; el add-on pago es el **chatbot IA**.
7. **Plantillas internas = confidencial.** Nunca decir al cliente que usamos plantillas.
8. **No fabricar.** Falta dato del cliente → pedirlo o marcarlo. Personalizar con datos reales.
9. **Benchmark visual:** Bench, Garabato, HSB Engineers (jerarquía/limpieza/seriedad), sin copiar literal.

## Pricing (acá no se escribe ninguna cifra: se LEE)
- **Webs:** `web-factory/apps/onia-platform/src/content/webs.ts` (`WEB_STACKS`, lo que la web publica) y
  `hermes-content/propuestas/PRICING_RATIONALE_INTERNO.md` §0 (hoja de lanzamiento; remite a
  `hermes-content/propuestas/ONIA_CATALOGO_PRECIOS_2026.md` para cotizar). ⚠️ **Las dos fuentes no dicen lo mismo hoy:** §0
  presenta como objetivo con portafolio la línea que `webs.ts` ya usa como vigente. Antes de cotizar una web, se
  pregunta a Sergio Urcullo cuál rige (`CLAUDE.md` «Una sola fuente de verdad»); no se elige la más linda.
- **SaaS Onia (planes y add-ons): NO se escriben acá.** Se LEEN del código del producto:
  planes en `onia-platform/lib/subscription-plans.ts` (`DEFAULT_PLAN_AMOUNTS`; nombres visibles en
  `lib/pricing.ts`, p.ej. `clinic` = «Completo») y add-ons en `onia-platform/lib/pricing.ts`
  («Agente conversacional de WhatsApp»). Anual = 10 meses. Una cifra copiada acá vence sola: el
  28-sep-2026 esta línea todavía decía 390/890/1.990 y 750/1.500, precios que ya no existían.
- El margen vive en lo recurrente (Cuidado Web / Onia Comercio / videos). Cobrar automatización y resultado.

## Enviar = acción externa → requiere aprobación
Generar y preparar es libre. **ENVIAR** una propuesta a un cliente necesita OK explícito de Sergio
(mensaje y canal exactos). Precios de producto (dentalgest/onia-empresarial): Sergio valida antes de enviar (ítem S1).
Tras enviar: registrar la oportunidad en el CRM (subagente `onia-crm-prospeccion`).
