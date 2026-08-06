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
| C8 | Drip del trial | ✅ 2026-08-04 EN PROD (deploy #14): secuencia 3/7/12/14/15 con idempotencia, migración aplicada, cron 09:00 La Paz instalado y probado ({evaluated:1,sent:0} correcto). HALLAZGO ARREGLADO: el producto JAMÁS había mandado un correo — faltaba EMAIL_PROVIDER/SMTP_*; cableado con las credenciales Brevo de GoTrue. +35 tests |
| C9 | Sender "Onia" + SMTP real | ✅ contenedor recreado 2×: sender Onia + SMTP transaccional funcionando |
| C11 | **Registro rediseñado + landing a prod** (pedido 2026-08-06 "el registro me parece horrible") | ✅ 2026-08-06 EN PROD (deploy #17): registro 2 pasos estilo SaaS — de 14 campos a 4 (Google 1-clic o nombre/correo/contraseña/negocio; el resto se difiere al onboarding, API opcional, DB ya nullable); AuthShell split-screen tinta+verde señal compartido con login; checkout con stepper/checks/QR-terminal + garantía visible. Landing con /comparativa deployada (daba 404) |
| C12 | **Auditoría promesas landing vs producto** | ✅ 2026-08-06: 60 claims verificadas por 6 agentes (26 SE_VE · 25 PARCIAL · 6 EXISTE-PERO-NO-SE-VE · 3 NO_EXISTE). Doc: `ONIA_AUDITORIA_PROMESAS_LANDING_20260806.md`. Fixes aplicados: **module.agents por PLAN (Pro+/trial) + entitlement al registrarse → la vitrina de agentes se VE desde el día 1** · export CSV en todo plan pago · garantía 1er mes en checkout+términos · "recibo mientras SIAT en trámite" · bienvenida decía 7 días (es 14) · maqueta del hero ahora muestra lo que Recall hace de verdad |
| C13 | **3 rubros nuevos: Estética + Veterinaria + Servicios profesionales** | ✅ 2026-08-06 (deploy #18): TOP 3 del ranking de alcance — clínicos reusan pantallas dentales (odontograma gateado a dental), servicios = comercio + agenda; vocabulario, planes, bienvenida, cobrador y panel por track. Demos nacen vacías (seeder por rubro = deuda anotada). Ranking: `docs/research/ONIA_RANKING_PROXIMOS_RUBROS_20260806.md` |

## E. NOTAS PARA DESPUÉS (registradas, NO se ejecutan)

| # | Nota |
|---|---|
| N1 | Meta: números de clientes vía Tech Provider + embedded signup (tras D3) |
| N2 | Webs: productizar "Quiero mi web" desde el panel como work item |
| N3 | Más funciones de empaquetado (RRHH, carpeta contador, docs con vencimiento, reuniones, notas) |
| N4 | **Internacional**: tax_argentina/tax_colombia como packs fiscales sobre el mismo core + versión GENÉRICA sin fiscal para cualquier país. NO antes de dominar Bolivia |
| N5 | **Planes por tamaño + configuración**: modo simple (sin IVA/fiscal) vs completo; el plan da el techo, la config elige qué se muestra |
| N6 | **C21 Acero / hub inmobiliario** (reunión 2026-08-03): NO firmar 50/50 — contraoferta: cliente fundador (precio congelado 12m) + partner comercial ESCALONADO (Sergio: 35% plano es demasiado): 15% primer año por presentación que Sergio cierra · 35% solo si él cierra completo · 0% por solo pasar nombres · pago mes a mes según pague el cliente, nunca adelantado · rol por escrito con número (N reuniones/mes) · prueba 60 días + exclusividad ACOTADA 6m SOLO si la máster franquicia firma piloto PAGO + marca blanca posible, IP 100% Onia. ESTRUCTURAS (2026-08-04): (A) dentro de Onia Platform con precio especial POR ASESOR + marca blanca = LA BUENA; (B) plataforma aparte "a comisión como desarrollador" = TRAMPA (todo el costo Sergio, ingreso dependiente de la operación de ellos, bifurca el código) — solo aceptable convertida en DESARROLLO PAGADO por adelantado + licencia + mantenimiento. Frase: "no desarrollo a comisión: ahí yo pongo todo el riesgo y vos toda la decisión". VERIFICAR antes de creer promesas C21-amplias: autoridad real dentro de la franquicia (máster de Bolivia). Tomar YA gratis: día de inmersión + discovery con asesores. El marketplace de oficios certificados (comisión por trabajo) = capacidad `partners` del core, transversal, entra a Onia con o sin él. Track inmobiliario NO se construye sin piloto pago (regla WOW-con-cliente-pagando)  SEGUNDA PASADA (2026-08-04): (i) autocrítica — su red SÍ vale si la activa (embudo self-service aún con 0 pagantes; asesores SCZ = buen ICP); (ii) instrumento nuevo EARN-IN: opción de COMPRAR hasta 5-10% a valuación de hoy SI trae N oficinas pagando en 6 meses — socio por resultados, nunca por promesas; (iii) tono: "tres formas de ganar conmigo" (fundador / comisión / earn-in), no "te bajo a comisionista".  TERCERA PASADA (2026-08-04, datos nuevos de Sergio): él exige PRESENCIA continua para desarrollo + plataforma cerrada solo-inmobiliarios + motivación real = BLINDAR al gremio; y C21 YA TIENE plataforma propia (franquicia impone stack → techo real = UNA oficina en uso complementario, no C21-wide). VEREDICTO ENDURECIDO: como él lo plantea NO conviene ni es negociable (0/4 contra el norte de Onia: ingresos sin presencia, muchas empresas, mercado abierto, multi-proyecto). REGLA NUEVA: Onia vende software, nunca horas. Se rescata: día de inmersión + su oficina como cliente de lo COMPLEMENTARIO (agente de leads, marketplace) + insight B2C: herramientas vendidas a ASESORES individuales self-service, sin franquicia. Salida elegante escrita en el chat 2026-08-04. |

| N8 | **Live commerce / TikTok Live (pedido 2026-08-06)** — apartado en el producto para que los clientes hagan LIVES y vendan en vivo (live → pedidos → caja/kardex existentes), + canal propio para vender productos de Onia por TikTok Live y TikTok Shop cuando llegue a Bolivia (supertendencia local hoy). Registrado en el Catálogo maestro de ideas §8.7 (reabre "TikTok Shop Bolivia" de las descartadas con razón nueva). NO se ejecuta — espera gatillo (cliente pagando que lo pida o priorización explícita) |
| N7 | **Módulo inmobiliario (pedido 2026-08-06)** — veredicto con fuentes: entrar por **add-on "agente de captación de leads"** (Opción 3, casi todo existe; la oficina C21 Acero como primer cliente PAGANDO de lo complementario); herramienta B2C para asesores (Opción 2) SOLO tras señal de 5+ asesores pagando 2+ meses; track completo (Opción 1) NUNCA como greenfield — Wasi ya opera en Bolivia desde ~US$30/mes y las franquicias imponen su stack. Doc completo: `docs/research/ONIA_MODULO_INMOBILIARIO_ALCANCE_20260806.md` |

## D. BLOQUEADO EN VOS (nada avanza sin esto)

| # | Qué | Qué destraba |
|---|---|---|
| D1 | **Ticket promedio por cita en SCZ** | el argumento de venta en plata ("una cita recuperada lo paga") |
| D2 | **Homologación SIAT — ✅ SISTEMA REGISTRADO 2026-08-06**: solicitud N° 9473, código de sistema `228474DC226A215DD26BF`, "Onia Platform" tipo PROVEEDOR v1.00, AMBAS modalidades, sectores compra-venta + nota crédito-débito + hospitales/clínicas. PDF: `ONIA_SIAT_SOLICITUD_9473_20260806.pdf`. Endpoints piloto (pilotosiatservicios.impuestos.gob.bo/v2) en el PDF. **🏁 FASE 1 COMPLETA LA MISMA NOCHE DEL REGISTRO (2026-08-06)**: las 9 etapas computarizadas pasadas y verificadas en checkpoint — 500 emisiones, 250 anulaciones, 98 reversiones, 35 eventos, 10 contingencia, 10 masivas, 900 sincronizaciones = **1.968 operaciones OK contra el SIN, cero bloqueados**. Queda: etapa VIII (firma — cert de prueba vía CSR + cert real AGETIC, solo modalidad Electrónica) → **Fase 2 = inspección del SIN** (coordinarla; límite 04/11/2026) → Fase 3 pilotos por cliente | Llamar AGETIC 2184026 + estar atento a la convocatoria de inspección del SIN |
| D3 | **Meta: ~~S5~~ APROBADA (verificado en vivo 2026-08-06)** — quedan los 4 clics de la Fase A: URLs de privacidad/términos/eliminación en Settings→Basic, verificar business@onia.com.bo, ícono 1024 (entregado), toggle Live. Con eso el bot atiende clientes reales y el tier sube a 2.000/día. S6 (números de clientes) = fase Tech Provider (2 screencasts + App Review + Access Verification), detallada en la guía | Los 4 clics de la guía §1 Fase A |
| D4 | **Cuál chatbot sobrevive** (lo revisás vos) | que no nazca un tercero |
| D5 | **Reunión BCP (miércoles 5-ago)** | QR dinámico + conciliación automática |
| D6 | ~~Aprobar dashboard v2~~ ✅ aprobado — construyéndose | — |
| D7 | **Crear OAuth Client de Google** (Google Cloud Console, cuenta de Sergio) → client ID+secret para GoTrue | HALLAZGO: el botón "Continuar con Google" está ROTO en prod — el GoTrue self-hosted no tiene GOTRUE_EXTERNAL_GOOGLE_* configurado |
| D8 | ~~QR de cobro DentalGest/vencido~~ **RESUELTO POR DECISIÓN 2026-08-06: el cobro va por la pasarela del BCP** (Sergio post-reunión). El slot del QR dinámico ya está en el código del checkout esperando la API. Nuevo ítem M: integrar API BCP (QR dinámico + webhook/extracto) cuando lleguen credenciales/sandbox. INTERIM pendiente de decidir: mientras no esté la API, el checkout muestra el QR viejo — propuesta: reemplazarlo por bloque "te mandamos el QR por WhatsApp" | Credenciales/sandbox del BCP cuando lleguen + OK al interim |

---
Regla de trabajo desde ahora: **cada punto B se ratifica explícito, uno por uno, antes
de ejecutarse.** Los A no se reabren salvo que Sergio lo pida. Los C reportan al
cerrar. Los D se recuerdan en cada cierre de sesión.
