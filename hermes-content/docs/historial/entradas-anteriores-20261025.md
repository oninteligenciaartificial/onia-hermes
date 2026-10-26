# Entradas anteriores del repo · 25-oct-2026

HISTORIA, NO ESTADO VIVO NI PERMISOS. Se preservan los textos anteriores completos; sus precios, cuentas, servicios, rutas y porcentajes no se declaran vigentes.

## README.md anterior

# Hermes VPS Tools for Onia

This repo contains deployment helpers and operating docs for the Onia Hermes agent running on the VPS at `187.77.16.63`.

## Current state
- Hermes lives on the VPS and is used from Telegram.
- Hermes dashboard is expected on the VPS at `localhost:9119` via SSH tunnel.
- Instagram Graph API is configured and validated.
- `ig-publish healthcheck` returned `ok: true`.
- Local and VPS Instagram tokens validate as Meta `PAGE` tokens.
- n8n instance-level MCP is configured for Codex and validates with
  `npm run health:n8n-mcp`.
- A real Instagram carousel test was published with `published_id=18126144559620893`.
- Public asset hosting is available at `http://187.77.16.63:8099`.
- The asset server returns real image files from `/var/www/html/hermes-assets`.
- `carousel-generator` was validated on the VPS and returns structured JSON.

## Architecture
- **Telegram**: fast control channel for Hermes.
- **Hermes dashboard**: native Hermes UI, reached through an SSH tunnel.
- **VPS**: source of truth for scripts, docs, skills, env vars, and asset hosting.
- **Instagram Graph API**: publishing layer through `ig-publish`.
- **OpenAI**: content brief generation through `carousel-generator`.
- **Pinterest references**: inspiration notes only; do not copy third-party assets.
- **n8n**: scheduled orchestration and approval flows, not the main brain.

## Local commands
Run these from Windows PowerShell in this repo:

```powershell
cd C:\dev\Expermimentos\Hermes
```

Deploy Instagram publisher:
```powershell
npm run deploy:instagram
```

Deploy Hermes docs, skills, references, and carousel generator:
```powershell
npm run deploy:hermes-content
```

Prepare public asset hosting on the VPS:
```powershell
npm run setup:assets
```

Upload one image or video:
```powershell
$env:ASSET_FILE="C:\path\to\asset.jpg"
npm run upload:asset
```

Rotate Notion token on the VPS:
```powershell
$env:NOTION_TOKEN_NEW="new-token"
npm run rotate:notion
```

Validate n8n MCP:

```powershell
$env:N8N_MCP_URL=[Environment]::GetEnvironmentVariable("N8N_MCP_URL","User")
$env:N8N_MCP_TOKEN=[Environment]::GetEnvironmentVariable("N8N_MCP_TOKEN","User")
npm run health:n8n-mcp
```

## Quick carousel flow
1. Generate or choose 2 to 10 original images.
2. Upload each image with `npm run upload:asset`.
3. Copy the printed public URLs.
4. SSH into the VPS.
5. Publish:

```bash
ig-publish carousel_publish --image-urls "URL_1,URL_2" --caption "Caption"
```

Generate the content brief first:

```bash
carousel-generator --topic "IA para clinicas dentales" --objective "generar leads" --audience "clinicas dentales en Bolivia" --slides 3
```

## Dashboard
Open an SSH tunnel:

```powershell
ssh -L 9119:localhost:9119 root@187.77.16.63
```

Then open:

```text
http://localhost:9119
```

## Security
Secrets were pasted during setup. Rotate them after validation:
- VPS root password.
- Meta long-lived token.
- Notion token.
- Any OpenAI key shared outside a secure shell or env var.

Do not paste tokens in chat. Use environment variables in PowerShell or store secrets directly in `/root/.hermes/.env` on the VPS.


## LEEME-PRIMERO.md anterior

# Empezá acá

> **390 documentos.** Casi ninguno hace falta para decidir hoy. Esta hoja dice cuáles sí.
> Si estás perdido, leé los de acá y ninguno más.
>
> **Un tema = un archivo sin fecha.** Si un doc tiene `YYYYMMDD` en el nombre, es la foto de
> un día: es historia, no fuente. Cuando un doc con fecha contradice a uno sin fecha, **gana
> el que no tiene fecha.**

Reescrito el **2026-08-27**. La versión anterior decía "163 documentos" (hay 390) y **5 de
sus 6 punteros iban a `historial/`**: quien empezaba por acá aterrizaba en historia y
reconstruía lo que ya estaba escrito. Por eso esta hoja se EDITA, no se reemplaza.

---

## 0. Los precios NO viven en ningún documento

Se leen del código del producto (`C:\dev\proyectos\onia-platform`). Es la regla que más se
rompió: llegamos a tener **cuatro precios vivos del mismo chatbot al mismo tiempo**, y un
one-pager que citaba la fuente correcta mientras escribía otro número.

| Qué | Dónde manda |
|---|---|
| **Planes de suscripción** | `onia-platform/lib/subscription-plans.ts` → `DEFAULT_PLAN_AMOUNTS`. **Es lo que valida el cobro:** si un doc dice otro monto, el pago se rechaza |
| **Add-ons** y los nombres visibles de los planes | `onia-platform/lib/pricing.ts` (`PLAN_LABELS`) |
| **Para vender** (precio + función, cruzado contra el código) | **`ONIA_QUE_SE_VENDE_Y_A_QUE_PRECIO.md`** |

Hoy: **Básico Bs 320 · Profesional Bs 750 · Completo Bs 1.500 · Empresa Bs 2.900** (anual =
10 meses) · **chatbot de WhatsApp Bs 390/mes, sin cargo inicial**. Si leés otra cosa en
cualquier lado, el otro lado está roto.

🔴 **Excepción, y hay que respetarla:** **webs, consultoría y automatización NO llevan lista
de precios.** Se cotizan caso por caso (decisión del 2026-08-24, `ONIA_WEB_COMO_SE_VENDE.md`).
`pricing.ts` **no cubre** esa línea: "corregir" un precio de web contra ese archivo es
romper, no ordenar.

⚠️ `ONIA_PRICING_2026.md` se autodeclaraba canónico y **quedó degradado**. Sirve por sus
reglas comerciales; no por sus cifras.

---

## 1. Los que mandan — venta y producto

| Doc | Responde |
|---|---|
| **`ONIA_ESTRATEGIA_DE_EMPRESA.md`** | **Por qué NO hace falta financiación ni equipo de desarrollo**, y las 4 etapas de freelancer a empresa. Ordena a los de abajo: si una tarea no sirve a la etapa vigente, se anota y no se hace |
| **`ONIA_QUE_SE_VENDE_Y_A_QUE_PRECIO.md`** | La tabla única: cada plan y add-on con su precio, su función y su **estado real** |
| `ONIA_CATALOGO_DE_VENTA.md` | Qué existe por rubro: vivo / construido sin probar / futuro |
| `ONIA_PLAN_DESARROLLO_Y_VENTA.md` | Qué se construye, en qué orden, y por qué ese orden lo dicta la venta |
| `ONIA_PLAN_DE_VERSIONES.md` | Qué se vende ya y qué entra por parche |
| `ONIA_PENDIENTES_PARA_LANZAR.md` | Qué está a medias y en qué orden se mata |
| `ONIA_PUEDO_VENDER_HOY.md` | Estado verificado: qué se puede prometer sin mentir |
| `ONIA_WEB_COMO_SE_VENDE.md` | La línea de webs — y por qué no tiene lista de precios |

## 2. Los que mandan — plata, fiscal y legal

| Doc | Responde |
|---|---|
| `ONIA_FECHAS_CRITICAS_PLAN.md` | Las fechas que corren solas (Meta 1-oct, SIAT, runway) |
| `ONIA_FACTURACION_ESTADO_REAL.md` | Facturación: qué emite de verdad y qué es mock |
| `ONIA_LEGAL_BOLIVIA_ESTADO.md` | Estado legal: SEPREC, NIT, marca |
| `ONIA_AGENTES_COSTO_API.md` | Cuánto cuesta de API cada agente y chatbot, y dónde está el margen real |
| `ONIA_PSICOLOGIA_PRECIOS_COMPETENCIA.md` | Qué hace la competencia con sus precios y qué copiamos |

## 3. Los que mandan — infra, chatbot y skills

| Doc | Responde |
|---|---|
| `ONIA_INFRA_LIMPIEZA_Y_ORDEN.md` | VPS y base: qué está encendido y qué hay que limpiar |
| `ONIA_CHATBOT_LINEA_DE_ENTREGA.md` | De contrato firmado a bot vivo, con tiempos |
| `ONIA_CHATBOT_ALTA_WHATSAPP_CLIENTE.md` | Las rutas de alta en Meta, comparadas y decididas |
| `ONIA_AGENTES_IA_DISENO_FUNCIONAL.md` | Cómo están diseñados los agentes 24/7 |
| `ONIA_WEB_FACTORY_Y_PRODUCTO_UI.md` | Qué comparten Web Factory y el producto, y qué falta |
| `ONIA_SKILLS_STACK_Y_SUBAGENTES.md` | Qué skill y qué subagente usar para cada carril |

## 4. El estado de cada carril, al día

**`handoff/<carril>.md`** — un archivo por carril, sin fecha, sobrescrito al cerrar. Siete
campos, y el que más sirve es **intentos fallidos**: es lo que evita repetir el callejón.
La plantilla está en `handoff/README.md`. **Es la única carpeta 100% en regla — copiá ese
modelo.**

## 5. Lo que hay que tener siempre presente

1. **Onia es UNA plataforma con módulos por rubro.** `DentalGest`, `GestiOS`, `Ganadero OS`
   y `ProveeGest` **no son productos ni marcas**: son nombres viejos de packs. Al cliente se
   le nombra el rubro ("módulo dental"). Todo doc que los trate como marcas separadas está
   desactualizado en lo comercial, aunque su contenido técnico sirva.
2. **El código del producto vive en `C:\dev\proyectos\onia-platform`.** Este repo,
   `onia-hermes`, es **el cerebro**: docs, memoria, core, propuestas y la landing. Están
   separados **por acceso**, no por desorden.
3. **Cero clientes pagando.** Ningún material —web, propuesta, demo— puede sugerir lo
   contrario: prohibido inventar testimonios, logos o porcentajes.
4. **La venta nunca exhibe obra.** Nada de "muy pronto", "en construcción" ni "beta" en una
   superficie que ve un cliente. Lo que no está listo **no se nombra**.
5. **Verificar es MIRAR.** Un HTTP 200 y un `grep` no son verificación. Un `grep` sirve para
   **descartar**, nunca para **confirmar**.

## 6. Abierto y cuesta plata

- 🟡 **La contraseña de la base de producción quedó commiteada** en el `.claude/settings.json`
  del repo del producto (mayo). El repo es privado, pero **hay que rotarla**.
  ⚠️ Dato heredado de la versión anterior de esta hoja: **contarlo de nuevo antes de actuar**,
  no repetirlo.
- ✅ **Cerrado:** `onia-core/logic/fx.logic.mjs` ya **no** cae en silencio a un tipo de cambio
  de 6,96 — `officialRate()` lanza si no le llega un TCO válido. Facturaba ~41% subvaluada
  sin avisar.

## 7. Dónde está el resto

- **`historial/`** — lo que fue verdad y ya no se consulta. No se borró nada.
- **`research/`** — investigación de fondo.
- **`handoff/`** — el estado al cerrar cada carril.
- **`../sales-kit/`** — material comercial listo para usar.
- **`../propuestas/`** — el generador. **Nunca escribir HTML de propuesta a mano.**

## 8. Regla para no volver a llenar esto de ruido

**Un doc nuevo se crea solo si alguien lo va a leer para decidir algo.** Si es el reporte de
algo ya ejecutado, va directo a `historial/`. Si reemplaza a otro, **se edita el que ya
existe** — no se crea uno nuevo con la fecha de hoy y se dejan los dos vivos diciendo cosas
distintas. Eso es exactamente lo que produjo los cuatro precios.
