# Research (Carril I) — Agente autónomo de importación para Nuvia (2026-07-05)

**Veredicto:** construir un **copiloto de sourcing con gate humano**, NO un
comprador autónomo. Alcanza **Hermes + browser-use + n8n**; **OpenClaw es
redundante con Hermes → SKIP**. La compra 100% autónoma está **bloqueada por el
riel de pago boliviano**, no solo por riesgo.

## 1. Agentes que navegan (browser agents)
- **browser-use** (Python, agent-first, líder WebVoyager 89,1%, tiene MCP y se
  integra con n8n) → **buscar/ver productos**, navegación adaptativa en
  Alibaba/AliExpress. OSS self-host.
- **Skyvern** (por visión: screenshot → ve botones/forms como humano, fuerte en
  formularios 85,85%, self-host OSS) → **llenar carritos/forms** en portales feos.
- **Playwright-MCP** (Microsoft, determinista, gratis, ya lo tenés vía MCP) → capa
  barata para pasos estables. **computer-use por pixeles = frágil/caro, solo fallback.**
- Fuentes: [Framework Wars](https://dev.to/stevengonsalvez/browser-tools-for-ai-agents-part-2-the-framework-wars-browser-use-stagehand-skyvern-4gn), [Skyvern](https://www.skyvern.com/blog/browser-use-vs-stagehand-which-is-better/), [Playwright-MCP](https://github.com/microsoft/playwright-mcp).

## 2. Sourcing de productos ganadores
- **Las APIs oficiales de Alibaba/AliExpress requieren aprobación** (ISV/Dropshipping
  Center) — NO contar con ellas para descubrir catálogo.
- Sí sirve: **señales de tendencia** (AliExpress Dropshipping Center gratis, Google
  Trends, TikTok, ad libraries; spy tools Ecomhunt/Dropship Spy/ZIK) + **scraping
  dirigido** con browser-use/Skyvern (read-only, respetando ToS) + **filtro
  ONIA-Bolivia** (peso/flete, arancel, demanda local) = el verdadero valor.
- Fuentes: [Alibaba Open API](https://developer.alibaba.com/docs/doc.htm?treeId=684&articleId=118416&docType=1), [AliExpress API](https://zuplo.com/learning-center/aliexpress-api-guide), [spy tools](https://www.spocket.co/blogs/aliexpress-product-research-tools).

## 3. Contacto a proveedores
- B2B-proveedor ≠ cold email de venta (intención legítima). Aun así: **DMARC/DKIM/SPF
  obligatorio** (Gmail rechaza sin DMARC desde nov-2025), volumen bajo (~20/día),
  **dominio separado** (nunca el de ONIA). **Priorizar el RFQ/chat interno de
  Alibaba** sobre email externo. El agente redacta; **el envío lo aprueba Sergio**.
- Fuentes: [Google spam B2B](https://outboundrepublic.com/blog/what-googles-spam-changes-mean-for-b2b-cold-email-in-2025/), [safe limits](https://www.topo.io/blog/safe-sending-limits-cold-email).

## 4. Compra autónoma — límite real (crítico)
- **Bloqueo operativo en Bolivia:** por escasez de dólares, las compras
  internacionales con tarjeta están **capadas (~USD 100/día, ~USD 500/15 días** en
  algunos bancos). La importación real se paga por **transferencia/LLC/gestor**
  (verificación humana intrínseca). No hay "checkout de un click" que automatizar.
- La industria (Visa/Mastercard) recién habilita compra agéntica y **advierte fraude
  escalando**; es consumer-checkout EE.UU., no compra mayorista B2B China→Bolivia.
- **Gate humano duro:** el agente busca/compara/redacta/arma OC en borrador y deja el
  carrito listo. **Sergio aprueba antes de: (a) mensaje de negociación, (b) confirmar
  términos/precio, (c) cualquier pago.** Sin excepción en el pago.
- Fuentes: [pagar Alibaba desde Bolivia](https://www.topboxbolivia.com/post/c%C3%B3mo-pagar-a-tu-proveedor-en-alibaba-desde-bolivia-sin-complicarte), [Visa threats agentic commerce](https://corporate.visa.com/en/sites/visa-perspectives/security-trust/the-threats-landscape-of-agentic-commerce.html).

## 5. Arquitectura para ONIA + v1
```
Hermes (n8n gateway) ── comando / aprobaciones ──► Sergio (WhatsApp)
      │
      ▼
n8n (orquestador + cron + estado en Supabase)
      ├─ Sourcing: browser-use/Skyvern (read-only) + señales tendencia
      ├─ Scoring ONIA-Bolivia (flete, arancel, demanda local)
      ├─ Draft OC + draft mensaje proveedor
      └─ ►► GATE HUMANO (Sergio aprueba) ◄◄ → recién aquí enviar RFQ / preparar carrito
      · Nunca mover dinero sin humano
```
**v1 mínimo (2-3 semanas, sin gastar):** (1) radar de productos = cron n8n con
browser-use sobre AliExpress Dropshipping Center + tendencias → top-N a Supabase con
score ONIA-Bolivia (read-only); (2) ficha + comparación por producto vía Hermes a
Sergio; (3) draft de RFQ, Sergio aprueba envío (empezar por RFQ interno de Alibaba,
no email); (4) órdenes = solo borrador + carrito listo, pago 100% manual.

**Todo OSS self-host (browser-use, Skyvern, Playwright-MCP, n8n) → encaja en el VPS;
no hace falta comprar herramientas nuevas para el v1.**
