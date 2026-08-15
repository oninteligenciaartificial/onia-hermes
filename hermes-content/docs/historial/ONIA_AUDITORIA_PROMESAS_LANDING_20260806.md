# Auditoría promesas landing vs producto — 2026-08-06

> 60 promesas extraídas de onia.com.bo (+ /comparativa) y verificadas contra el código
> del producto por 6 agentes. Veredicto: 26 SE_VE · 25 PARCIAL · 6 EXISTE_PERO_NO_SE_VE ·
> 3 NO_EXISTE. Origen: pedido de Sergio 2026-08-06 — "hay varias cosas que no veo y que
> están friísimas". Los fixes aplicados hoy se marcan al pie.

## NO EXISTE — la landing promete algo que no hay (3)

### hero-mockup-agente-hueco
**Promesa:** Hueco — el agente ya propuso a quién mover (aria: 'un hueco que el agente ya propuso llenar')
**Evidencia:** AGENT_KINDS en lib/onia-core/modules/agents-runtime.ts:57-77 define SOLO recall (reactivación de pacientes sin volver hace 180 días) y cobrador (saldos vencidos). Ningún agente lee la agenda, detecta huecos ni propone mover/reprogramar pacientes. La landing va más lejos: agent-story.tsx:41 narra 'Propongo reprogramar a María P. al hueco de las 15:00' y hero.tsx:44 'Onia busca a quién mover a ese hueco' — cero respaldo en código (grep de hueco/gap/mover en agents-runtime y agents-logic: nada).
**Fix sugerido:** Camino más barato: reescribir la maqueta del hero y agent-story a lo que Recall SÍ hace ('paciente sin volver hace 6 meses — el agente ya redactó el mensaje, vos aprobás'). Si se quiere sostener el hueco: agente nuevo 'huecos' que lea citas canceladas del día + pacientes sin próxima cita y genere la propuesta por el mismo runtime de /pending (el pipeline de propuestas ya existe entero).

### pricing-garantia-mes1
**Promesa:** Si al primer mes no te sirve, te devolvemos lo pagado.
**Evidencia:** Solo existe como copy de landing (web-factory/apps/onia-platform/src/lib/pricing.ts:273). En el producto: cero menciones de devolución/garantía en app/checkout/CheckoutClient.tsx y app/terms/page.tsx (el único 'reembolso' de terms es sobre costos de terceros); no hay política ni flujo de reembolso
**Fix sugerido:** 1 línea de garantía junto al bloque de pago QR en app/checkout/CheckoutClient.tsx ('Primer mes con garantía: si no te sirve, te devolvemos lo pagado') + cláusula corta en app/terms/page.tsx

### honesty-factura-tramite
**Promesa:** Nuestra factura fiscal está en trámite ante el SIN.
**Evidencia:** grep de 'factura fiscal', 'recibo', 'en tramite' sobre app/, components/ y lib/ no devuelve NADA en el flujo de pago de la suscripcion: /checkout cobra por QR y comprobante sin ninguna mencion de que documento recibe el cliente (recibo vs factura). La disclosure honesta existe solo en la landing (otro repo); el producto, donde el cliente PAGA, calla.
**Fix sugerido:** 1 linea en el paso de comprobante de /checkout (CheckoutClient.tsx): 'Hoy te emitimos recibo; nuestra factura fiscal esta en tramite ante el SIN'. Misma frase que la landing, cero riesgo.

## EXISTE PERO NO SE VE — lo friisimo enterrado (6)

### hero-lead-agentes-247
**Promesa:** agentes que trabajan 24/7 con tu aprobación
**Evidencia:** Runtime completo: C:/dev/proyectos/onia-platform/lib/onia-core/modules/agents-runtime.ts (recall+cobrador, solo PROPONEN), pantalla C:/dev/proyectos/onia-platform/app/(dashboard)/agents/page.tsx, aprobación en app/(dashboard)/pending/, ítem 'Agentes' en components/layout/navigation.ts. PERO un cliente real nunca lo ve: module.agents solo se otorga en demo (lib/platform/demo-provisioning.ts:52); el alta real (app/api/auth/register/route.ts → provisionOrganization) no lo incluye; triple gate AGENTS_RUNTIME+PLATFORM_LAYER+entitlement (agents-runtime.ts:104-112); y el cron app/api/cron/onia-agents/route.ts NO está agendado en vercel.json (solo 3 crons, ninguno de agentes).
**Fix sugerido:** 3 cambios chicos: (1) otorgar module.agents en provisionOrganization para planes professional+ (o en includedFeatures del pack dental en lib/platform/vertical-pack.ts), (2) agregar /api/cron/onia-agents a vercel.json crons, (3) setear AGENTS_RUNTIME=1 en prod. La nav ya pinta 'Agentes' sola (navigation.ts lo tiene con requiresFeature).

### pricing-pro-agente-propone
**Promesa:** No se te escapa un cliente: el agente propone, vos aprobás.
**Evidencia:** El circuito propone→aprobás existe: agents-runtime.ts genera drafts que caen a /pending (OniaCoreApprovalRequest, 'Propuesta de agente' en pending-client.tsx:59) y nada se envía sin aprobación. PERO el plan Pro NO lo otorga: lib/subscription-plans.ts no menciona agentes, PlanClient.tsx no lista 'agente' en ninguna card de plan (grep: cero resultados), y module.agents no se concede en el alta ni en el upgrade — solo en demo. Un cliente Pro que pague hoy no ve ningún agente.
**Fix sugerido:** Atar module.agents al plan professional+ (grant en provisioning/upgrade) y agregar la línea 'Agente propone, vos aprobás' a la card Pro en PlanClient.tsx. Mismo destrabe que hero-lead-agentes-247 (cron + flags).

### features-agentes-noche
**Promesa:** Agentes con IA — Trabajan de noche; nada sale sin tu OK.
**Evidencia:** Runtime completo: lib/onia-core/modules/agents-runtime.ts (Recall+Cobrador), cron app/api/cron/onia-agents/route.ts, página app/(dashboard)/agents/page.tsx y aprobación humana en /pending (el 'nada sale sin tu OK' SÍ está implementado: solo drafts, envío externo gateado). Pero TODO detrás de AGENTS_RUNTIME=1 + PLATFORM_LAYER + entitlement module.agents, apagados por default (lib/onia-core/modules/agents-flags.ts, lib/platform/api-guard.ts:8 'apagado default hoy'): sin eso la página redirige a /dashboard y el cron responde skipped:flags_off — un cliente del trial no ve ningún agente
**Fix sugerido:** Encender AGENTS_RUNTIME + entitlement module.agents para orgs trial (es seguro: solo genera propuestas a /pending, cero envío externo) y sumar una card 'Agentes esta noche' en /dashboard con última corrida y propuestas pendientes

### comparativa-onia-agentes-solos
**Promesa:** Agentes que trabajan solos: sí
**Evidencia:** lib/proof.ts:104 marca agentes:'si' para Onia, pero en el producto el runtime (agents-runtime.ts + cron onia-agents) está apagado por default (AGENTS_RUNTIME + PLATFORM_LAYER + entitlement module.agents; app/(dashboard)/agents/page.tsx redirige a /dashboard sin entitlement) y el envío real está gateado (solo drafts a /pending). Un cliente que entre hoy no ve ningún agente trabajando solo — la tabla afirma 'sí' donde SIAT, en la misma fila, honestamente dice 'trámite'
**Fix sugerido:** O encender el runtime para orgs trial (drafts a /pending son seguros, cero envío externo) o cambiar estados.agentes de Onia a 'tramite' en lib/proof.ts — coherente con el criterio que la propia tabla ya usa para SIAT

### features-cola-aprobacion
**Promesa:** Cola de aprobación: 'Reprogramar a P. Suárez → hoy 11:15' con botones Aprobar / Descartar y mensaje redactado por el agente.
**Evidencia:** La mecanica esta COMPLETA en codigo: app/(dashboard)/pending/pending-client.tsx:216-223 (botones 'Aprobar y enviar' / 'Rechazar' + texto exacto antes de aprobar), app/(dashboard)/agents/page.tsx (lista agentes + 'Borrador: ...'), lib/onia-core/modules/agents-runtime.ts (agentes recall y cobrador que redactan borradores). PERO un cliente real nunca lo ve: module.agents solo se otorga en lib/platform/demo-provisioning.ts:52 (el register self-service no lo pasa — app/api/auth/register/route.ts no envia extraEntitlements), /agents redirige a /dashboard sin el entitlement, y el runtime entero esta tras AGENTS_RUNTIME=1 (lib/onia-core/modules/agents-flags.ts). Sin agentes corriendo, /pending queda vacio.
**Fix sugerido:** Otorgar module.agents en el provisioning estandar del register (1 linea: extraEntitlements) + AGENTS_RUNTIME=1 en prod. Aun mas barato para que se VEA: sembrar 1 propuesta demo del agente Recall al crear la org de trial.

### pricing-implementacion-cero
**Promesa:** Migración e implementación en cero durante esta fase.
**Evidencia:** Es cierto en codigo por omision: el checkout valida y cobra SOLO el monto del plan (lib/subscription-plans.ts + subscription-payment-validation), no existe ningun fee de setup/implementacion en ninguna ruta de pago, y la migracion (import CSV en /patients/import) es gratis. Pero ninguna pantalla lo AFIRMA: el cliente que llega del landing no puede confirmar el 'en cero' en la UI.
**Fix sugerido:** 1 linea de letra chica en el resumen de pago de /checkout: 'Implementacion y migracion: Bs 0 durante esta fase'.

## PARCIAL — a medias o gateado (25)

### hero-titulo
**Promesa:** El sistema de gestión con IA para tu negocio en Bolivia.
**Evidencia:** Gestión SE_VE completa (/dashboard, /agenda, /patients, /comercio, /contabilidad Bolivia con IVA/IT y NIT). La IA existe pero está gateada: app/(dashboard)/agents/page.tsx redirige a /dashboard sin entitlement module.agents, y el ítem de nav 'Agentes' (components/layout/navigation.ts:39) es fail-closed con PLATFORM_LAYER apagado por default (lib/platform/api-guard.ts:8 'apagado (default hoy)'). El chatbot IA (lib/whatsapp-ai.ts) tampoco tiene pantalla propia y depende de Meta.
**Fix sugerido:** Encender PLATFORM_LAYER=1 en prod + otorgar entitlement module.agents en los planes Pro/Full (o en trial): con eso la nav 'Agentes' y la pantalla /agents aparecen sin escribir código. Barato alternativo: card 'Agentes IA' en /dashboard con estado 'se activa con tu plan'.

### hero-chip-migramos
**Promesa:** Migramos tus datos
**Evidencia:** Existe import CSV self-service SOLO de pacientes: app/(dashboard)/patients/import/page.tsx (wizard con mapeo de columnas y sample CSV) + app/api/patients/import/route.ts, con botón visible 'Importar CSV' en app/(dashboard)/patients/page.tsx:98-102. Comercio/importadora NO tienen import de productos, clientes ni fiados (nada en app/(dashboard)/comercio ni app/api/comercio). Ningún flujo de 'nosotros te migramos' como servicio.
**Fix sugerido:** Lo más barato: card en el onboarding/setup '¿Traés datos de otro sistema? Mandanos tu Excel' con link WhatsApp (click-to-chat) — copy puro. Segundo paso: botón 'Importar CSV' en /comercio/inventario reutilizando el wizard de patients/import.

### como-captura-rubros
**Promesa:** Clínica dental y comercio o tienda están disponibles; importadora, veterinaria, estética, gastronomía, construcción, educación, turismo, servicios profesionales y ganadería figuran como muy pronto.
**Evidencia:** app/(auth)/register/page.tsx:42-77 — RUBROS_ACTIVOS son TRES: dental, comercio/tienda E 'Importadora / distribuidora' (proveegest-electrico, con módulo real: app/(dashboard)/importadora + lib/importadora). RUBROS_PRONTO ya no incluye importadora. La captura de la landing está desactualizada: muestra importadora como 'muy pronto' cuando ya es un rubro activo elegible en el registro.
**Fix sugerido:** Re-tomar la captura /capturas/rubros-onia.webp del /register actual (muestra 3 rubros activos) y actualizar el alt. Costo: un screenshot.

### features-titulo-rubros
**Promesa:** Módulos para clínicas dentales, comercios y servicios.
**Evidencia:** Dental SE_VE (nav completa dental en components/layout/navigation.ts) y comercio SE_VE (app/(dashboard)/comercio con caja, fiados, inventario + nav propia en lib/platform/vertical-pack.ts:220+). 'Servicios' NO existe como rubro: 'Servicios profesionales' figura en RUBROS_PRONTO (register/page.tsx:75). El tercer track real es importadora, no servicios.
**Fix sugerido:** Cambiar el h2 de la landing a 'clínicas dentales, comercios e importadoras' — coincide con los 3 tracks activos. Copy puro, cero código.

### features-chatbot-whatsapp
**Promesa:** Chatbot de WhatsApp — Responde y califica mientras vos atendés.
**Evidencia:** Lógica completa y real: lib/whatsapp-bot.ts (menú, confirmar/cancelar cita, deriva a humano vía Chatwoot) + lib/whatsapp-ai.ts (IA GPT con contexto de clínica, multilenguaje es/aymara/quechua, botPrompt configurable). UI: card 'Chatbot WhatsApp' con badge Activo/Add-on en /settings Mi Plan (PlanClient.tsx:633-672). PERO el envío real está gateado por Meta (getWhatsAppConfig exige phoneNumberId+accessToken) — sin credenciales Meta el bot no responde a nadie.
**Fix sugerido:** Simulador de chat en /communications o /settings: un preview que llame a la misma lib/whatsapp-ai.ts (generateBotReply) sin pasar por Meta — el cliente VE y prueba su chatbot hoy, con badge 'conexión a tu número: en activación'.

### features-reserva-confirma-wa
**Promesa:** Confirmamos por WhatsApp
**Evidencia:** La reserva pública confirma por token/link (app/api/booking/appointments/route.ts PATCH confirm + app/(public)/book/confirm/[token]), no por WhatsApp. WhatsApp solo entra en recordatorios 24h/2h del cron (app/api/cron/appointment-reminders/route.ts, con fallback a email) y en el bot (opción '2 Confirmar cita' en whatsapp-bot.ts) — ambos exigen addon WhatsApp + credenciales Meta (gateado).
**Fix sugerido:** En la pantalla de confirmación de reserva (book/confirm), agregar botón wa.me click-to-chat 'Confirmá por WhatsApp' hacia el número de la clínica — funciona hoy sin Meta, un href.

### pricing-export-datos
**Promesa:** Tus datos son tuyos: los exportás cuando quieras.
**Evidencia:** El export CSV existe (app/api/reports/export, app/api/fiscal/rcv-export, app/api/rrhh/planilla-export) PERO csvExportEnabled es false en free, basic Y professional (lib/plan-limits.ts:62,74,86) — solo clinic/enterprise. En Básico (320) y Pro (750) el export de reportes devuelve 403 'Plan no permite exportar CSV'. 'Cuando quieras' es falso para 2 de los 3 planes vendidos.
**Fix sugerido:** O se cumple la promesa: csvExportEnabled:true en basic y professional (2 booleanos en lib/plan-limits.ts) al menos para exportar SUS datos crudos; o se corrige la letra chica a 'export CSV completo en plan Full'. Lo primero es más coherente con 'tus datos son tuyos'.

### honesty-riesgo-nuestro
**Promesa:** Por eso el riesgo lo ponemos nosotros: 14 días gratis y devolución del primer mes.
**Evidencia:** 14 días gratis: SE_VE — TRIAL_DAYS=14 (lib/subscription/plan-state.ts:22), visible en /register ('Crear mi cuenta — 14 dias gratis'), AuthShell ('14 dias gratis, sin tarjeta'), footer y checkout ('Prueba gratis hasta el {fecha}'). Devolución del primer mes: NO_EXISTE — cero menciones de garantía/devolución/reembolso de suscripción en app/terms/page.tsx ni en checkout ni en settings.
**Fix sugerido:** Añadir la cláusula de devolución del primer mes en app/terms/page.tsx + una línea en el checkout ('Si el primer mes no te sirve, te lo devolvemos'). Solo copy, pero necesario: hoy la promesa no está respaldada en ningún término del producto.

### hero-lead-funciones
**Promesa:** Agenda, clientes, cobros y agentes... Una sola cuenta, un solo precio.
**Evidencia:** Agenda SE_VE (app/(dashboard)/agenda + /appointments), clientes SE_VE (app/(dashboard)/patients), cobros SE_VE (app/(dashboard)/billing), todo en una cuenta con un plan (lib/subscription-plans.ts). PERO 'agentes' esta enterrado: /agents (app/(dashboard)/agents/page.tsx) exige entitlement module.agents que NINGUN plan ni el registro otorgan — solo demos (lib/platform/demo-provisioning.ts extraFeatures) o grant manual; ademas flags globales AGENTS_RUNTIME y PLATFORM_LAYER fail-closed (lib/onia-core/modules/agents-flags.ts, lib/platform/flags.ts). La card 'propuestas del agente' del dashboard (app/(dashboard)/dashboard/page.tsx:631-666) se ve pero queda vacia para siempre sin entitlement.
**Fix sugerido:** Otorgar module.agents en el trial: agregar extraFeatures ['module.agents'] en provisionOrganization desde app/api/auth/register/route.ts (o a includedFeatures del pack dental) + AGENTS_RUNTIME=1 en prod. Con eso la card del dashboard se llena sola y 'Agentes' aparece en la nav sin escribir UI nueva.

### features-chatbot-agenda-solo
**Promesa:** El chatbot cierra la cita solo: '¿Tienen espacio esta semana?' → 'Sí — hoy 11:15. Te lo reservo.' → 'Listo, quedó agendado.'
**Evidencia:** El bot existe y esta cableado (app/api/webhooks/whatsapp/route.ts + lib/whatsapp-bot.ts + IA multilenguaje lib/whatsapp-ai.ts) pero NO reserva citas nuevas: solo ver/confirmar/cancelar; lib/whatsapp-bot.ts:107 responde literalmente 'Puedes agendar una nueva llamando a la clínica' y whatsapp-ai.ts:65 instruye derivar al menu. No consulta disponibilidad ni crea appointments. Ademas el envio real de WhatsApp esta gateado por Meta (contexto conocido). El dialogo exacto del landing es imposible hoy.
**Fix sugerido:** Cablear al bot el endpoint que YA existe (/api/booking/slots + creacion de appointment como en app/(public)/book): flujo 'opcion 4: agendar' que lista 3 horarios libres y crea la cita al elegir numero. La logica de slots y conflictos ya esta escrita; es solo el puente. Mientras tanto, rebajar la maqueta del landing a confirmar/recordar citas.

### features-web-conectada
**Promesa:** Página web — Conectada al sistema, no huérfana. 'Los horarios salen de tu agenda'.
**Evidencia:** La mitad 'horarios salen de tu agenda' es real y visible: app/(public)/book/[orgSlug]/page.tsx consume /api/booking/slots (disponibilidad real por doctor/fecha) y crea la cita. Pero 'pagina web del negocio' NO es feature del producto: app/(public) solo tiene /book (reserva), no hay web por cliente ni builder — las webs se construyen fuera (web-factory) y son un servicio aparte. La conexion prometida existe solo como pagina de reservas.
**Fix sugerido:** Card 'Tu pagina publica' en /settings con el link /book/[orgSlug] + QR descargable (todo ya existe, es exponerlo). En la landing, si la web es servicio aparte, decir 'tu web la hacemos nosotros y se conecta a esta reserva'.

### pricing-full-opera-solo
**Promesa:** El negocio opera solo y vos decidís en vez de perseguir.
**Evidencia:** La mitad 'vos decidís' existe: runtime de agentes Recall/Cobrador (lib/onia-core/modules/agents-runtime.ts, 801 lineas) genera propuestas que caen a /pending (human-in-the-loop) via cron app/api/cron/onia-agents/route.ts. La mitad 'opera solo' NO: (1) el plan Full/clinic NO otorga module.agents — ningun mapeo plan→entitlement existe, solo demo-provisioning o grant manual; (2) AGENTS_RUNTIME y PLATFORM_LAYER default OFF; (3) cero envio externo real (comentario en el cron: 'SIN ningun envio externo (S6 pendiente)') — el agente propone drafts, jamas ejecuta solo. Un cliente que pague Bs 1.500 hoy no ve operar nada.
**Fix sugerido:** Mapear plan clinic → grant module.agents (entitlement source 'plan') en el flujo de pago/upgrade + AGENTS_RUNTIME=1. Hasta destrabar S6 (envio real), cambiar el copy del plan Full a 'el sistema detecta y propone; vos aprobás con un clic' — que es exactamente lo que el codigo hace.

### pricing-no-incluye
**Promesa:** No incluye: dominio/hosting, comisión pasarela, créditos de IA sobre el uso incluido, conversaciones WhatsApp sobre el cupo — implica IA y cupo WhatsApp incluidos en el plan.
**Evidencia:** Dominio/hosting y pasarela: consistente (no estan en el producto, correcto). Pero lo implicado NO existe: (1) cero metering de 'creditos de IA' en todo el repo (ninguna tabla, contador ni limite de uso IA por plan); (2) WhatsApp NO viene incluido en ningun plan — es add-on pago aparte (lib/pricing.ts WHATSAPP_ADDON: 3 niveles desde Bs 200/mes + Meta por consumo, flag Organization.whatsappAddon) con cupo tecnico de 200 msgs/mes (lib/plan-limits.ts checkWhatsAppLimit). La letra chica vende cupos incluidos que el plan base no incluye ni mide. Lo unico medido por plan son emails (emailsPerMonth).
**Fix sugerido:** Lo mas barato es corregir la letra chica: 'Chatbot WhatsApp es add-on (desde Bs 200/mes; Meta por consumo)' y quitar 'creditos de IA' hasta que exista metering. En producto: exponer en /settings el consumo del cupo WhatsApp cuando el add-on esta activo (el contador ya existe en plan-limits.ts, solo falta pintarlo).

### comparativa-hueco
**Promesa:** No existe un solo software vendido en Bolivia que cruce agenda + ficha del cliente + factura SIAT.
**Evidencia:** Como promesa implicita ('Onia cruza los tres'): agenda+ficha+cobro SI se cruzan y SE VEN (appointments↔patients↔billing comparten el paciente). Factura SIAT real NO: lib/fiscal/emission-service.ts existe pero detras de SIAT_EMISSION=off (lib/fiscal/flags.ts, fail-closed), socket mock sin credenciales, tablas OniaInvoicing dormidas y CERO referencias SIAT en app/(dashboard)/billing (grep vacio). La propia landing lo confiesa (lib/proof.ts: Onia siat='tramite' + TODAVIA_NO). Como claim de mercado, no verificable desde el repo (fuente: ONIA_PRECIOS_COMPETENCIA_20260730.md).
**Fix sugerido:** Badge honesto en /billing: 'Formato SIAT listo — emisión en homologación ante el SIN' reusando lib/fiscal/print-model.ts para mostrar la factura en formato SIAT aunque la emision real espere el NIT. Una linea de UI, cierra la brecha entre el claim y lo que el cliente ve.

### como-paso3-modulos
**Promesa:** Encendé módulos. Chatbot, web, agentes. Un interruptor, no un sistema nuevo.
**Evidencia:** En /settings (app/(dashboard)/settings/PlanClient.tsx:633-713) se ven add-ons WhatsApp (chatbot), agenda pública e inventario avanzado con badge Activo/Add-on y botón 'Activar add-on' — pero la activación es mandar un WhatsApp a Onia, no un interruptor. 'Web' no existe como módulo en ninguna pantalla del producto. 'Agentes' no aparece en /settings ni en el wizard /setup (grep en setup-client.tsx: nada); su entitlement solo se enciende por DB (lib/platform/entitlements.ts), sin UI ni siquiera para el superadmin (app/(dashboard)/admin/ no gestiona entitlements).
**Fix sugerido:** Sección 'Módulos' en /settings con cards Chatbot/Web/Agentes + estado (Activo/Disponible) + CTA de activación reusando el patrón waHref que PlanClient ya usa para los add-ons. Una card estática por módulo alcanza para que el cliente VEA el catálogo encendible.

### pricing-lanzamiento-12m
**Promesa:** Precio de lanzamiento, sostenido 12 meses para quien cierra ahora.
**Evidencia:** Los precios de lanzamiento SON los reales del producto: lib/subscription-plans.ts:28-30 (basic 320 / professional 750 / clinic 1500, comentario línea 3: 'early-bird congelado 12m') y se ven en /settings (PlanClient) y checkout. Pero el compromiso 'sostenido 12 meses' no existe en el producto: sin campo de price-lock en prisma/schema.prisma, sin texto 'lanzamiento' ni 'congelado' en ninguna pantalla (grep en PlanClient/checkout/billing: cero). Es solo un comentario de código.
**Fix sugerido:** Una línea de texto en PlanClient.tsx: 'Precio de lanzamiento — congelado 12 meses desde tu alta'. Opcional (más caro): campo priceLockedUntil en Organization para que el compromiso quede grabado por org.

### pricing-nota-fiscal
**Promesa:** Nuestro emisor está en trámite de homologación ante el SIN. Mientras tanto facturás en el Portal Web del SIN, que es gratuito y cumple la ley. No cobramos por algo que todavía no anda.
**Evidencia:** El código respalda la honestidad de la nota: lib/fiscal/siat-client.ts es mock, SIAT_EMISSION apagado fail-closed (lib/fiscal/flags.ts, 'True ONLY when SIAT_EMISSION === 1'), y ningún plan cobra por emisión SIAT (subscription-plans.ts). Pero DENTRO del producto ninguna pantalla dice 'mientras tanto facturá en el Portal del SIN': grep de 'Portal' en app/(dashboard) da cero resultados en UI — ni /billing ni /contabilidad lo mencionan, aunque /contabilidad ya arma el RCV del periodo que sirve justo para eso.
**Fix sugerido:** Banner chico en /billing y /contabilidad: 'Factura fiscal: emitila en el Portal Web del SIN (gratis) — Onia te deja el detalle listo' con link a impuestos.gob.bo. Es texto estático, cero lógica nueva.

### como-modulos-interruptores
**Promesa:** Módulos de tu cuenta con interruptores: Gestión, Agentes IA, WhatsApp, Página web, Reserva online, Automatizaciones.
**Evidencia:** /settings (app/(dashboard)/settings/PlanClient.tsx:628-720) muestra cards con badge Activo/Incluido/Add-on para WhatsApp chatbot, Agenda pública (reserva online), Inventario avanzado, self-hosted y usuarios extra — pero NO hay card ni interruptor para Agentes IA (gated por PLATFORM_LAYER+AGENTS_RUNTIME off), ni módulo 'Página web', ni 'Automatizaciones'; la activación es 'Solicitar por WhatsApp', no un toggle
**Fix sugerido:** Añadir 3 cards más a la sección 'Add-ons disponibles' de PlanClient.tsx (Agentes IA, Automatizaciones, Página web) con badge de estado 'Próximamente' o 'Solicitar activación' — mismo patrón que las cards existentes, ~30 líneas

### features-venta-lista-siat
**Promesa:** Cobros y facturación — la venta queda lista para el SIAT. Badge: 'En trámite SIAT'.
**Evidencia:** Venta visible en /billing y /comercio/caja; /contabilidad (app/(dashboard)/contabilidad/page.tsx) muestra IVA 13%/IT 3% y export RCV-like para el contador. Pero rcv-export.ts:6-8 admite que NIT_CLIENTE sale vacío o con CI (Patient no tiene campo NIT), y la emisión real es mock apagado (lib/fiscal/siat-client.ts MOCK MODE + lib/fiscal/flags.ts SIAT_EMISSION default off); el print fiscal con CUF/QR (app/print/invoice/[id]/page.tsx:419) solo aparece con flags on
**Fix sugerido:** Badge 'SIAT: en trámite' + link al export RCV de /contabilidad directamente en /billing (para que el cliente VEA que la venta queda lista), y campo NIT/razón social del cliente en la factura

### pricing-pago-trimestral-qr
**Promesa:** Trimestral por QR, o anual con 2 meses de regalo.
**Evidencia:** QR sí: checkout con comprobante y validación (app/checkout/CheckoutClient.tsx:206,317). Anual con 2 meses gratis sí: annual = 10x mensual (lib/subscription-plans.ts:28-32) y el checkout muestra el ahorro (línea 237). Pero NO existe ciclo trimestral: los ciclos son weekly/monthly/annual y el catálogo es fail-closed (un env var no puede crear un ciclo)
**Fix sugerido:** Lo más barato: corregir la letra chica de la landing (web-factory .../src/lib/pricing.ts:301) a 'Semanal o mensual por QR, o anual con 2 meses de regalo' — los ciclos que el checkout realmente ofrece

### comparativa-cruce-posicion
**Promesa:** Los que facturan al SIN no agendan. Los que agendan no facturan en Bolivia. Ese cruce es el lugar donde estamos.
**Evidencia:** Texto vivo en sections/proof.tsx:107-108. El lado agenda es real y visible (/agenda, /appointments, /book/[slug] público). El lado 'facturamos en Bolivia' hoy no: emisor mock apagado (lib/fiscal/flags.ts SIAT_EMISSION off, siat-client.ts MOCK MODE) — la propia fila Onia en lib/proof.ts lo marca siat:'tramite' y el veredicto lo admite, pero la frase h2 afirma el cruce en presente
**Fix sugerido:** Sufijo de una línea en proof.tsx bajo el h2: '— con el emisor fiscal en trámite de homologación', apuntando al ledger TODAVIA_NO que ya está en la misma sección

### como-paso1-multirubro
**Promesa:** Elegí tu rubro. Dental, comercio, importadora o servicios. Onia se arma para el tuyo.
**Evidencia:** app/(auth)/register/page.tsx:42-77: paso 1 es el picker de rubro con 3 ACTIVOS (dentagest-clinical, gestios-general 'Comercio / tienda', proveegest-electrico 'Importadora / distribuidora') que arman vocabulario + pantallas via lib/platform/vertical-pack.ts. 'Servicios profesionales' esta en RUBROS_PRONTO (linea 75): no se puede elegir. 3 de 4 rubros prometidos cumplen; servicios no.
**Fix sugerido:** Cambiar el copy de la landing a 'Dental, comercio o importadora (servicios: pronto)' — 1 linea en how-it-works.tsx. Alternativa mas cara: activar un track generico de servicios en RUBROS_ACTIVOS.

### como-onboarding-nosotros
**Promesa:** Te lo dejamos andando nosotros: cargamos tus datos y capacitamos a tu equipo.
**Evidencia:** Lo automatico existe y se ve: app/onboarding (alta con extraccion automatica de datos — 'salimos a buscar el resto', lib/onboarding/extraccion/) y /patients/import (CSV). Pero el 'nosotros' humano no tiene presencia en el producto: 'onboarding dedicado' solo aparece como texto en app/(dashboard)/help/page.tsx:182 y solo para plan Clinic; no hay CTA para pedir que Onia cargue datos o capacite al equipo.
**Fix sugerido:** Card con CTA WhatsApp en el paso final del alta (app/onboarding/pasos/paso-listo.tsx): '¿Querés que lo dejemos andando nosotros? Te cargamos los datos y capacitamos a tu equipo — escribinos'. 1 componente chico.

### comparativa-sin-portal
**Promesa:** El Portal Web del SIN — Bs 0, gratis, y cumple la ley. 'Es un emisor de facturas, no un sistema... Cada factura se tipea a mano.'
**Evidencia:** La fila es factualmente honesta, pero el contraste implicito ('con Onia no tipeas') solo se cumple a medias en el producto: /contabilidad (app/(dashboard)/contabilidad/page.tsx) SI deriva IVA/RCV/balance automaticamente de las ventas (lib/fiscal/iva-summary, rcv-export) con disclaimers correctos ('no reemplaza la declaracion en el SIAT', linea 111). Pero Onia NO emite facturas hoy: SIAT_EMISSION esta OFF (lib/fiscal/flags.ts, mock en emission-service.ts, bloqueado por NIT) y no hay boton de emision en ninguna pantalla — el cliente sigue tipeando cada factura en el portal del SIN.
**Fix sugerido:** Badge/card en /contabilidad: 'Factura electronica SIAT: en homologacion' — hace visible el roadmap sin prometer emision que no existe.

### comparativa-no-comercio-servicios
**Promesa:** Comercio y servicios no tienen pantallas propias. La base común da de alta la cuenta, pero el pack del rubro se está construyendo. Por eso no tienen precio publicado. (Contradice el tab 'Comercio andando · Importadora andando' de features.tsx.)
**Evidencia:** La fila TODAVIA_NO quedo VIEJA en la direccion opuesta: comercio SI tiene pantallas propias hoy (app/(dashboard)/comercio: catalogo 91 lineas, caja 129, inventario 161, fiados 221, con lib/comercio/ testeado) e importadora tambien (costeo 101, cotizaciones 130), ambos rubros ACTIVOS y elegibles en /register (RUBROS_ACTIVOS). Ademas SI tienen precio publicado en el producto: /checkout usa el mismo catalogo Bs para todos los tracks. Lo unico cierto de la fila es 'servicios' (rubro Pronto, sin pantallas). La contradiccion con el tab de features.tsx es real pero al reves: features.tsx tiene razon y proof.ts miente en contra del producto.
**Fix sugerido:** Actualizar la fila en lib/proof.ts de la landing: 'Comercio e importadora ya tienen pantallas propias (catalogo, caja, fiados, costeo de importacion) con el mismo precio publicado; servicios todavia no'. 1 edicion de texto que ademas resuelve la contradiccion con features.tsx.

## SE VE — cumplido y visible (26)

### pricing-basico-320
**Promesa:** Básico · 01 Ordenar · 'Tu negocio deja de vivir en el cuaderno.' · Bs 320/mes
**Evidencia:** lib/subscription-plans.ts:28 basic monthly:320 (fuente única). Visible en /checkout (CheckoutClient) y /settings tab Mi Plan (PlanClient). El copy coincide: plan-display.ts:43 'Dejás el cuaderno y el WhatsApp suelto'. También en /help: 'Basic (Bs. 320/mes)'.

### pricing-full-1500
**Promesa:** Full · 03 Automatizar · Bs 1.500/mes
**Evidencia:** lib/subscription-plans.ts:30 clinic monthly:1500; se muestra como 'Full' en tracks no dentales y 'Clínica' en dental (lib/subscription/plan-display.ts:77), con salto 'El sistema trabaja de noche: cobra, agenda y responde' — visible en /checkout y /settings Mi Plan. Nota menor: el cliente dental lo ve como 'Clínica', no 'Full' (intencional).

### comparativa-facturadores
**Promesa:** Sintic · administraTe · Emizor — Bs 85 – 1.000/mes. 'Ninguno tiene agenda ni ficha del paciente.'
**Evidencia:** Lo verificable en el producto (la contraparte implícita: Onia SÍ tiene agenda y ficha) existe y es visible: /agenda (AgendaClient), /appointments, y ficha del paciente en /patients/[id] (app/(dashboard)/patients/[id]/). Los precios de competidores son dato de mercado de lib/proof.ts de la landing, no verificables en este repo.

### comparativa-onia-veredicto-siat
**Promesa:** Cruza los dos lados — y la factura fiscal todavía no: nuestro emisor está en trámite de homologación ante el SIN.
**Evidencia:** La afirmación es honesta y coincide con el código: los dos lados son visibles (operación: /agenda,/patients,/comercio; fiscal: /contabilidad con IVA 13%/IT 3%, RCV y vencimientos por NIT D.S. 25619), y la factura fiscal efectivamente todavía no — lib/fiscal/siat-client.ts es mock determinístico ('ZERO network calls', mock:true) y el flag SIAT_EMISSION default off (lib/fiscal/flags.ts). CONTRADICCIÓN a corregir: lib/subscription/plan-display.ts:82 vende 'Facturación electrónica SIAT' a secas en la card del plan Full del checkout, contradiciendo el 'todavía no' de la landing.

### hero-chip-desde-320
**Promesa:** Desde Bs 320/mes
**Evidencia:** lib/subscription-plans.ts:28 basic monthly=320 (fuente unica). Visible al cliente en /checkout (app/checkout/page.tsx via getPlanCatalog) y en /settings (app/(dashboard)/settings/PlanClient.tsx: 'mensual (Bs. 320/mes)'). Precio de landing = precio real cobrado.

### como-paso2-cuenta-lista
**Promesa:** Tu cuenta queda lista. Sin instalación ni proyecto de meses. Agenda, clientes y caja ya adentro.
**Evidencia:** Registro self-service con eleccion de rubro en app/(auth)/register/page.tsx → POST app/api/auth/register/route.ts → provisionOrganization (lib/platform/provisioning.ts) con TRIAL 14d sin tarjeta, ClinicSettings iniciales y email de bienvenida. El dashboard queda operable de entrada: dental con /agenda, /patients, /billing; comercio con /comercio (catalogo/inventario/caja/fiados). Wizard /setup existe (app/(dashboard)/setup).

### features-tabs-andando
**Promesa:** Dental (andando) · Comercio (andando) · Importadora (andando) · Servicios (pronto)
**Evidencia:** Los 3 tracks 'andando' son elegibles en el registro (app/(auth)/register/page.tsx RUBROS_ACTIVOS) y tienen pantallas reales: dental completo; comercio app/(dashboard)/comercio/{page,inventario,caja,fiados} (+APIs app/api/comercio); importadora app/(dashboard)/importadora/{cotizaciones,costeo} (+APIs). 'Servicios profesionales' figura en RUBROS_PRONTO (honesto). Matiz: profundidad desigual (dental >> comercio/importadora ~2.000 lineas de UI) y la nav por pack depende de PLATFORM_LAYER=1 en prod (encendido segun deploy 2026-08-01).

### pricing-pro-750
**Promesa:** Pro (El recomendado) · 02 Recuperar · Bs 750/mes
**Evidencia:** lib/subscription-plans.ts:29 professional monthly=750. Visible en /settings (PlanClient.tsx: 'Plan Profesional... Bs. 750/mes') y /checkout. El pilar 'Recuperar' tiene respaldo: cron de recordatorios app/api/cron/appointment-reminders + emails por plan (lib/plan-limits.ts). Matiz menor: el producto lo llama 'Profesional', no '02 Recuperar' — naming de landing, precio real.

### comparativa-dental-region
**Promesa:** Dentiqa · Doctocliq · Clinera.io — Bs 1.058 – 5.695/mes. 'Pero no facturan en Bolivia: Doctocliq lo dice en su propia web.'
**Evidencia:** Renderizado al cliente en /comparativa: web-factory/apps/onia-platform/src/lib/proof.ts:89-94 (fila con precios, nota de conversion USD 89-479 y veredicto Doctocliq) → components/sections/proof.tsx → app/comparativa/page.tsx, linkeado desde pricing y closing de la landing. Caveat: es un claim EXTERNO no verificable desde el repo (fuente citada: ONIA_PRECIOS_COMPETENCIA_20260730.md); conviene guardar screenshot/URL de la pagina de Doctocliq y re-verificar trimestral, porque si Doctocliq agrega Bolivia el claim se vuelve falso publicado.

### comparativa-no-clientes
**Promesa:** Clientes: cero. No hay testimonios... Serías de las primeras clínicas.
**Evidencia:** web-factory/apps/onia-platform/src/lib/proof.ts:127-129 (TODAVIA_NO[0] 'Clientes: cero.') renderizado en /comparativa via components/sections/proof.tsx:133. Consistente con la realidad conocida (0 clientes pagando). Honestidad publicada, no hueco.

### features-agenda-fichas
**Promesa:** Agenda y fichas — Todo tu día en una sola pantalla.
**Evidencia:** /agenda ('Agenda de hoy' en la nav para todos los roles, navigation.ts): app/(dashboard)/agenda/page.tsx trae las citas del día con paciente (nombre+teléfono) y doctor, renderiza AgendaClient.tsx. Fichas en /patients (nav 'Pacientes'). Ambas en sidebar y bottom-nav (bottomNavHrefs incluye /dashboard y /agenda).

### features-cobro-qr
**Promesa:** Cobrás con QR ('Cobrado con QR' en la maqueta de caja)
**Evidencia:** /comercio/caja: VentaForm.tsx ofrece método QR (CAJA_PAYMENT_METHODS = EFECTIVO/TARJETA/TRANSFERENCIA/QR en lib/comercio/caja.ts:11) y el corte de caja muestra totalQr (caja.ts:63-100). Dental: /billing/[id] PaymentModal.tsx registra pagos con método QR (METODOS_PAGO en lib/comercio/ventas.ts:11 y billing). Matiz fiel a la maqueta: registra el cobro hecho por QR (el QR lo genera el banco de la clínica); Onia no genera QR bancario propio — igual que dice la maqueta 'Cobrado con QR'.

### features-inventario-avisos
**Promesa:** Inventario — Sabés qué falta antes de que falte ('Anestesia — bajo mínimo' con aviso).
**Evidencia:** /inventory (nav 'Inventario simple'): InventoryClient.tsx tiene minStock por ítem, stat 'Stock bajo' con tono warning (línea 163) y filtro 'Bajo stock' (línea 189). Comercio: el dashboard /dashboard (comercio-hoy.tsx) muestra stock crítico calculado por velocidad de venta (stockCritico, línea 152) y conteo 'Producto(s) sin stock' — eso sí es 'antes de que falte'. En dental el aviso es por umbral mínimo, exactamente la maqueta 'bajo mínimo'.

### comparativa-precios-verificables
**Promesa:** Todos los precios de abajo son públicos... consultados el 30 de julio de 2026. Los en dólares convertidos a Bs 11,89 = USD 1 (TC oficial BCB al 29-jul-2026).
**Evidencia:** Renderizado en la home de la landing: web-factory/apps/onia-platform/src/components/sections/proof.tsx:118-122 pinta el pie con FECHA_CONSULTA ('30 de julio de 2026') y TC_NOTA ('Bs 11,89 = USD 1, BCB 29-jul-2026') desde src/lib/proof.ts:27-30; Proof se importa en src/app/page.tsx. Respaldo real: hermes-content/docs/platform/ONIA_PRECIOS_COMPETENCIA_20260730.md con 54 URLs y el mismo TC. Mejora opcional (no bloquea el veredicto): las filas no tienen links clickeables a cada fuente.

### comparativa-onia-precio
**Promesa:** Onia — Bs 320 – 1.500/mes, precio de lanzamiento.
**Evidencia:** Fila Onia en src/lib/proof.ts:100 ('Bs 320 – 1.500 / mes', 'precio de lanzamiento') coincide EXACTO con los precios reales cobrados por el producto: lib/subscription-plans.ts:28-30 (320/750/1500 mensual), visibles para el cliente en /settings (PlanClient.tsx usa DEFAULT_PLAN_AMOUNTS) y en el checkout. Landing y producto dicen el mismo número.

### comparativa-no-factura-venta-cerrada
**Promesa:** La factura fiscal todavía no sale de Onia... Onia te deja la venta cerrada con paciente, monto y detalle, y la factura la emitís en el Portal Web del SIN — gratis y legal.
**Evidencia:** Las dos mitades son ciertas y visibles: (1) la factura fiscal NO sale — SIAT_EMISSION off, siat-client mock (lib/fiscal/); (2) la venta cerrada con paciente/monto/detalle está en /billing/new (quick action 'Nueva factura'), /billing/[id] con pagos, y /contabilidad arma el RCV de ventas del periodo (lib/fiscal/rcv-export.ts, detalle en plan professional+) listo para transcribir al Portal. Nota: el detalle RCV es professional+; el plan basic solo ve el resumen — y ninguna pantalla linkea al Portal (mismo fix barato que pricing-nota-fiscal).

### hero-cta-trial
**Promesa:** Probar gratis 14 días
**Evidencia:** app/(auth)/register/page.tsx:586 CTA 'Crear mi cuenta — 14 dias gratis'; app/api/auth/register/route.ts:185-188 crea trial 14d sin tarjeta (trialEndFrom); /settings muestra contador 'quedan X dias' (app/(dashboard)/settings/PlanClient.tsx:372) y al vencer bloquea con app/components/TrialBlockedModal.tsx

### como-titulo-un-dia
**Promesa:** Tu sistema de gestión, andando en un día.
**Evidencia:** Registro → redirect forzado a /onboarding (app/(dashboard)/layout.tsx:57-59) → wizard self-service en app/onboarding/alta-negocio.tsx (pasos pregunta→negocio→horarios→servicios→equipo→listo, con extracción IA en use-extraccion.ts); paso-listo.tsx cierra con servicios 'listos para facturar' y entra al dashboard operativo el mismo día

### features-modular-sin-cambiar
**Promesa:** Encendés lo que necesitás hoy y sumás el resto sin cambiar de sistema.
**Evidencia:** /settings sección 'Add-ons disponibles' (PlanClient.tsx:628+) con estados Activo/Incluido/Add-on y CTA de activación sobre la misma cuenta; los verticales dental/comercio/importadora corren sobre el mismo sistema (app/(dashboard)/comercio, /importadora, nav por vertical-pack). Matiz: la activación es asistida por WhatsApp, no self-serve

### honesty-cero-clientes
**Promesa:** Cero clientes pagando todavía: serías de los primeros.
**Evidencia:** Landing publicada: web-factory/apps/onia-platform/src/lib/proof.ts TODAVIA_NO[0] ('Clientes: cero... Serías de las primeras clínicas') renderizado por sections/proof.tsx, y repetido en sections/faq.tsx:47. Consistente con la realidad (0 clientes pagando). Nota: el archivo closing.tsx del lote no existe; el contenido vive en proof/faq

### comparativa-no-offline
**Promesa:** No hay modo offline. Onia vive en la nube... Lo que sí: seguís desde el celular con datos y no perdés nada.
**Evidencia:** Claim honesto y consistente con el código: no hay service worker (solo public/manifest.json standalone, cero registros serviceWorker en app/ ni next.config.ts) → efectivamente sin offline; la app es responsive con nav móvil dedicada (components/layout/BottomNav.tsx) → 'seguís desde el celular'; persistencia 100% server-side (Prisma) → 'no perdés nada'. Texto en lib/proof.ts:137 renderizado por proof.tsx

### hero-chip-sin-tarjeta
**Promesa:** Sin tarjeta
**Evidencia:** components/auth/AuthShell.tsx:17 ('14 dias gratis, sin tarjeta' en /register) + app/api/auth/register/route.ts:185-190 (trial 14d sin metodo de pago, plan TRIAL_PLAN) + app/checkout/CheckoutClient.tsx:207 ('Sin tarjeta, sin contratos'; el pago es QR + comprobante, nunca se pide tarjeta) + lib/subscription/plan-state.ts

### features-reserva-online
**Promesa:** Reserva online — Tu cliente se agenda solo, un domingo a las once.
**Evidencia:** app/(public)/book/[orgSlug]/page.tsx: pagina publica de reserva en 4 pasos (Doctor/Fecha/Horario/Datos) sin login. El dueno encuentra su link en /settings (app/(dashboard)/settings/PlanClient.tsx:696-720: 'Pacientes reservan sus citas directamente desde tu link publico' + href /book/{orgSlug}). Nota: es dental-only (elige Doctor) y en plan Basic es add-on pago (help/page.tsx:192); incluida desde Professional.

### pricing-titulo-publicados
**Promesa:** Precios en bolivianos, publicados acá.
**Evidencia:** lib/subscription-plans.ts:28-32 (fuente unica: basic 320, professional 750, clinic 1500, enterprise 2900 Bs/mes; semanal 89/199) y el cliente los ve en Bs en /checkout (CheckoutClient.tsx:250,306: 'Bs {monto}' formato es-BO), /settings (PlanClient.tsx) y /help. La landing vive en otro repo (onia.com.bo) — no se pudo verificar desde aca que sus numeros coincidan con este catalogo; si divergen, la fuente es subscription-plans.ts.

### pricing-anual-2-meses
**Promesa:** Anual: 2 meses gratis
**Evidencia:** lib/subscription-plans.ts:28-32: annual = 10x mensual en todos los planes (3200/7500/15000/29000) = 2 meses gratis exactos. Visible en /checkout (CheckoutClient.tsx:222 badge '2 meses gratis', :259 'O Bs X/año con 2 meses gratis') y /settings (PlanClient.tsx:530: '2 meses gratis al pagar anual — 17% menos').

### comparativa-onia-dental-hoy
**Promesa:** una plataforma, el rubro dental andando hoy
**Evidencia:** El rubro dental esta completo y navegable: app/(dashboard)/patients (+ components/odontogram), agenda, appointments, treatments, billing (facturas a pacientes + recurrentes), reports, reserva publica /book/[orgSlug], alta self-service con track dental en /register y trial operativo. Es la ruta mas madura del producto.
