# Agenda maestra — TODAS las preguntas de Sergio, punto por punto

> **2026-08-02.** Sergio: *"las preguntas que he estado haciendo, estructurémoslas y
> toquémoslas punto por punto, porque son importantes"*. Este doc es esa estructura:
> cada pregunta con su estado real. Se actualiza al cerrar cada punto. Nada se
> considera cerrado sin su verificación.

## A. RESUELTO Y EN PRODUCCIÓN (verificado, no prometido)

| # | Pregunta | Dónde está la respuesta |
|---|---|---|
| 1 | ¿Self-service o manual? → trial 14 días sin tarjeta | en prod; `ONIA_PLANES_REQUISITOS_20260801.md` §4 |
| 2 | Estructura de dominios (¿por qué app./forms.?) | explicado + los 4 dominios en vivo |
| 3 | ¿En qué base estamos? ¿Docker/Easypanel obligatorios? | explicado; backup diario creado; renombrar contenedores = planificado con backup |
| 4 | Gestios → módulo comercio | en prod: kardex, caja, ventas UI, contabilidad |
| 5 | Registro multirubro con configuración previa | en prod: paso 0 "¿Qué tipo de negocio tenés?" |
| 6 | Landing recargada → rediseño estilo Fanvue | EN VIVO en onia.com.bo (aprobada por Sergio) |
| 7 | Tipografía de Fanvue exacta | medida del CSS real: AG Next Medium ancho normal → Archivo 600 |
| 8 | Marca: dental sin marca, logo por lámina | barrido completo + assets v2 oficiales |
| 9 | ¿Cómo funcionan los agentes? | propone→cola→aprobás→ejecuta; idempotencia+cupo |
| 10 | ¿Cómo conectan sus QRs? | explicado: su banco hoy; conciliación automática = reunión BCP |
| 11 | ¿Cuándo metemos mano? | tabla servicio-vs-automatización en el chat + docs |
| 12 | Repos que pasaste (ponytail, ScrapeGraphAI) | instalado / descartado con números |
| 13 | GitHub trending UI/UX | `ONIA_UI_TRENDS_GITHUB_20260801.md` (alerta AGPL incluida) |
| 14 | Funciones operativas y qué falta por rubro | `ONIA_FUNCIONES_OPERATIVAS_20260801.md` |
| 15 | Imágenes reales (Higgsfield autorizado) | 3 fotos generadas, en la landing viva |

## B. DECIDIDO POR MÍ — ESPERA TU RATIFICACIÓN (punto por punto AHORA)

| # | Punto | Decisión | Ratificado |
|---|---|---|---|
| B1 | **Webs de clientes** | 3 niveles: mini-web automática (Pro) · web completa nuestra (add-on) · NO builder | ✅ 2026-08-02 |
| B2 | **Agentes WhatsApp** | PRE-ARMADOS por rubro: cliente conecta su número + aprueba | ✅ 2026-08-02 |
| B3 | **Pricing/promos** | ✅ mensual + fundadores + referidos **Y ADEMÁS plan semanal** (negocios de caja diaria) **+ revisar montos contra el cálculo de valor** — Sergio juntó las opciones | ✅ con tarea |
| B4 | **Orden de rubros** | **IMPORTADORA primero** — ✅ EJECUTADO Y EN PRODUCCIÓN 2026-08-02: cotizaciones B2B completas + costeo DS 5646 + card en registro + demo (+56 tests, 1.026 total). Estética/vet después | ✅ hecho |
| B5 | **Landing: rubros a "andando"** | ✅ EJECUTADO 2026-08-02: Comercio E Importadora en vivo como "andando" (solo Servicios queda "pronto") | ✅ hecho |

## C. EN DESARROLLO (mío, con fecha de hoy)

| # | Qué | Estado |
|---|---|---|
| C1 | **Dashboard visual v2** | mockup APROBADO por Sergio → construyéndose en el producto real (panel conectado a la cola real del agente) |
| C2 | Salida de Vercel por fases | plan escrito; falta ejecutar fases + tu OK a los 16 irreversibles |
| C3 | Sembrar cola de aprobación | ✅ 2026-08-03: 8 agentes vivos (recall+cobrador × 4 orgs demo), 4 propuestas pending_approval REALES, cron diario 07:00 Bolivia en el VPS. Runbook: ONIA_AGENTES_SEED_RUNBOOK.md |
| C4 | Papercuts comercio | ✅ 2026-08-03 EN PROD: wizard sin roles dentales, Mi Plan multirubro, TrialBlockedModal → /checkout |

## C-bis. COLA DEL PRODUCTO (orden tras C1)

| # | Qué | Origen |
|---|---|---|
| C5 | Checkout visual + ciclo weekly | ✅ 2026-08-03 EN PROD (deploy #12): /checkout con semanal 89/199, pago QR+comprobante, tracker en vivo, vencido puede pagar. 15 tests |
| C6 | RRHH/planilla | ✅ 2026-08-03 EN PROD: /rrhh transversal, bono antigüedad DS 21060 + AFP 12,71% Ley 065 + RC-IVA, SMN configurable (DS 5516), migración aplicada. +45 tests. Patronales = "verificar con contador" (regla fiscal) |
| C7 | Fiados (CxC) + compras a crédito (CxP) | ✅ 2026-08-03 EN PROD (deploy #13): vender fiado desde caja, abonos, CxP con crédito fiscal IVA real, balance cuadrado. +35 tests |
| C10 | Roles de agente para comercio | ✅ 2026-08-03: el COBRADOR de comercio lee fiados vencidos (mismo circuito propone→cola); dental byte-idéntico. Rol "stock" queda como idea futura |
| C8 | **Drip de seguimiento del trial** (día 0/3/7/12/14/15 por email) — hoy solo se manda bienvenida | pregunta de Sergio 2026-08-02 |
| C9 | Recrear contenedor del producto para que tome `BREVO_SENDER_NAME=Onia` (ya corregido en app.env; el actual manda como "DentaGest") | hallazgo 2026-08-02 |

## E. NOTAS PARA DESPUÉS (registradas, NO se ejecutan)

| # | Nota |
|---|---|
| N1 | Meta: números de clientes vía Tech Provider + embedded signup (tras D3) |
| N2 | Webs: productizar "Quiero mi web" desde el panel como work item |
| N3 | Más funciones de empaquetado (RRHH, carpeta contador, docs con vencimiento, reuniones, notas) |
| N4 | **Internacional**: tax_argentina/tax_colombia como packs fiscales sobre el mismo core + versión GENÉRICA sin fiscal para cualquier país. NO antes de dominar Bolivia |
| N5 | **Planes por tamaño + configuración**: modo simple (sin IVA/fiscal) vs completo; el plan da el techo, la config elige qué se muestra |

## D. BLOQUEADO EN VOS (nada avanza sin esto)

| # | Qué | Qué destraba |
|---|---|---|
| D1 | **Ticket promedio por cita en SCZ** | el argumento de venta en plata ("una cita recuperada lo paga") |
| D2 | **NIT + homologación SIAT** (caduca 1-oct) | factura fiscal real — el diferenciador de la tabla comparativa |
| D3 | **Verificación de negocio en Meta (S5) + número (S6)** | envío real de WhatsApp; sin esto, tope de 2 números |
| D4 | **Cuál chatbot sobrevive** (lo revisás vos) | que no nazca un tercero |
| D5 | **Reunión BCP (miércoles 5-ago)** | QR dinámico + conciliación automática |
| D6 | ~~Aprobar dashboard v2~~ ✅ aprobado — construyéndose | — |
| D7 | **Crear OAuth Client de Google** (Google Cloud Console, cuenta de Sergio) → client ID+secret para GoTrue | HALLAZGO: el botón "Continuar con Google" está ROTO en prod — el GoTrue self-hosted no tiene GOTRUE_EXTERNAL_GOOGLE_* configurado |

---
Regla de trabajo desde ahora: **cada punto B se ratifica explícito, uno por uno, antes
de ejecutarse.** Los A no se reabren salvo que Sergio lo pida. Los C reportan al
cerrar. Los D se recuerdan en cada cierre de sesión.
