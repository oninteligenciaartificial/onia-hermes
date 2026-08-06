# Análisis de alcance — Módulo/track INMOBILIARIO de Onia (fuera de toda sociedad C21)

**Fecha:** 2026-08-06 · **Marco:** regla N6 tercera pasada ("Onia vende software, nunca horas"; track inmobiliario NO se construye sin piloto pago), regla WOW-con-cliente-pagando, insight rescatado = herramientas B2C a asesores individuales self-service.

---

## a) ALCANCE — mercado alcanzable en Bolivia

### Números con fuente

| Dato | Valor | Fuente / año |
|---|---|---|
| Inmobiliarias en Santa Cruz | ~600 (mayoría informales, pequeñas o directamente estafas) | [CasasenBolivia](https://casasenbolivia.com/cuales-son-las-mejores-inmobiliarias-de-santa-cruz/), dato ~2020 |
| Asesores Century 21 en Bolivia | ~1.670 agentes, ~40 oficinas, 8 de 9 departamentos | [LinkedIn C21 Bolivia](https://bo.linkedin.com/company/century-21-bolivia) / [El Deber](https://eldeber.com.bo/te-puede-interesar/century-21-se-consolida-como-la-red-inmobiliaria-mas-grande-de-santa-cruz_293447/) |
| Asesores C21 solo en Santa Cruz | de 300 (fin 2020) a 600 (fin 2021); de 16 a 30 oficinas | [El Deber](https://eldeber.com.bo/te-puede-interesar/century-21-se-consolida-como-la-red-inmobiliaria-mas-grande-de-santa-cruz_293447/) |
| Asesores RE/MAX en Bolivia | 63 oficinas, +1.300 agentes (creció 27 franquicias y +300 agentes recientemente) | [Activos Bolivia](https://activosbolivia.com/boom-inmobiliario-re-max-bolivia-suma-franquicias-agentes-y-liderazgo-en-la-region/), 2025 |
| Empresas agrupadas en gremios La Paz + Cochabamba | +300 empresas unipersonales y sociedades | [Economy.com.bo](https://www.economy.com.bo/articulo/business/proyecto-ley-servicios-inmobiliarios-apunta-formalizar-sector/20210804144347001254.html), 2021 |
| Gremios en SCZ | CAINCRUZ (fundada 2010) y CICRUZ coexisten; CNIB a nivel nacional | [CAINCRUZ LinkedIn](https://bo.linkedin.com/company/caincruzbo) / [CICRUZ](http://cicruz.org/) / [CNIB](https://cnib.bo/) |
| Oferta publicada en portales | InfoCasas: +20.000 propiedades, dice cubrir "97% de la oferta del país" | [InfoCasas Bolivia](https://www.infocasas.com.bo/) |
| Regulación | Sector NO regulado; proyecto de ley de formalización presentado en 2021, sin evidencia de promulgación | [Economy.com.bo](https://www.economy.com.bo/articulo/business/proyecto-ley-servicios-inmobiliarios-apunta-formalizar-sector/20210804144347001254.html) |

### Lo que NO tiene dato duro (explícito, no estimado)

- **Número total de asesores independientes fuera de franquicias en Bolivia**: no existe cifra pública. No hay registro estatal ni padrón gremial publicado. No se estima.
- **Penetración real de CRMs (Wasi/Tokko) en Bolivia**: sin dato público de clientes por país.
- **Ticket/comisión promedio por operación en SCZ**: sin fuente pública (mismo problema que D1 dental).

### Lectura del alcance

Solo las dos franquicias grandes suman **~3.000 asesores** en Bolivia — y esas franquicias **imponen su stack** (el hallazgo de la tercera pasada N6: C21 ya tiene plataforma propia). O sea: el segmento más contable del mercado es el **menos alcanzable** para un CRM. El mercado alcanzable real es el residuo: las ~600 inmobiliarias mayormente informales de SCZ + asesores sueltos sin franquicia, cuyo tamaño exacto **no está documentado**. Es un mercado real pero de tamaño no verificable hoy — eso solo ya es un argumento contra construir grande de antemano.

**Inferencia (marcada como tal):** la mayoría de ese segmento informal opera con WhatsApp + Facebook Marketplace + Excel, no con un CRM. El competidor #1 no es Tokko: es "no usar nada". Consistente con que UltraCasas permita [publicar gratis](https://www.ultracasas.com/publicar) — el mercado está acostumbrado a costo cero.

---

## b) FIT con el core de Onia — específico contra `vertical-pack.ts` / `types.ts`

### Lo que YA existe y se reusa directo

| Necesidad inmobiliaria | Capacidad existente | Estado |
|---|---|---|
| Interesados / propietarios | Clientes/contactos + `partnerTypes` del vocabulary del pack | ✅ en prod |
| Agenda de visitas + recordatorios | Agenda + booking público (`public_booking` ya es `PRODUCT_LOCAL_MODULE_IDS` y se cobra) | ✅ en prod |
| Pipeline captación→visita→reserva→cierre | Work items (el `vocabulary.workItemTypes` del pack define los tipos por rubro) | ✅ en prod |
| Agente que persigue leads | Runtime de agentes propone→cola→aprueba (recall/cobrador ya viven en 2 rubros) | 🟡 encendida, mismo circuito |
| WhatsApp | Add-on `whatsapp`/`chatbot` (ya en `ADDON_IDS` de types.ts) | 🟡 gateada por Meta S5/S6 |
| Cotización/reserva por escrito | `quotes_b2b` portada 2026-08-02 para importadora | ✅ en prod |
| Cobro del asesor, ciclo semanal | Checkout QR + plan semanal 89/199 (C5) | ✅ en prod |
| Mini-web con cartera | Decisión B1: mini-web automática en plan Pro | ✅ ratificada |
| Multi-tenant, trial, roles | provisionOrganization + roles finos | ✅ en prod |

### Lo que NO existe (nuevo de verdad)

1. **Entidad Propiedad/Listing** — fotos, ubicación, precio USD/Bs, operación venta/alquiler/**anticrético** (figura boliviana que ni Tokko ni EasyBroker modelan de primera clase). El catálogo actual es kardex valorado FEFO: sirve para tornillos, no para listings con media y estados de publicación. Forzar "propiedad = producto" aguanta un demo, no un producto.
2. **Matching interesado↔propiedad** — búsqueda por criterios + alertas. No hay nada análogo en el core.
3. **Publicación multi-portal** — el feature estrella de Tokko/Wasi. UltraCasas/InfoCasas **no tienen API pública documentada** (existe hasta un [scraper de terceros en Apify](https://apify.com/qoqa/ultracasas-bolivia-scraper), señal de que no hay API). Sería scraping/frágil o acuerdos comerciales — caro y fuera de control.

### El costo estructural que nadie ve en la superficie

`types.ts`: `SUPPORTED_VERTICAL_TRACK_IDS ... satisfies readonly CoreVerticalTrackId[]`. Un track nuevo **exige primero que el contrato del core lo declare** (contract.json + tabla en base-schema + 3 adapters, gate del validador), y el core está **CONGELADO** (v1.0.0). El contrato v1.0.0 tiene 11 rubros e **inmobiliario no es uno de ellos**. Un track inmobiliario completo = descongelar el core. En cambio, `types.ts` ofrece dos escotillas baratas que NO tocan el core:
- `ADDON_IDS` (product-local): `chatbot`/`whatsapp` ya existen; un addon nuevo es una línea.
- `PRODUCT_LOCAL_MODULE_IDS` (precedente `public_booking`): un módulo local entra "solo con algo que ya se vende y con la propuesta al contrato escrita" — la regla escrita en el propio archivo.

### Porcentaje de fit (estimación propia contra el feature-set de Wasi/Tokko, no dato duro)

- **CRM básico del asesor** (contactos, seguimiento, agenda, WhatsApp, cobros, mini-web): **~65-70% ya existe**.
- **CRM inmobiliario completo** (con listings, matching, multi-portal): **~40-50% existe** — y el 50% faltante incluye lo más caro (multi-portal sin APIs) y un cambio de contrato en un core congelado.

---

## c) TRES formas de entrar

### Opción 1 — Track completo B2B para oficinas/inmobiliarias
Pack `inmobiliaria` con listings, matching, multi-portal, equipo, comisiones.
- **Costo: ALTO.** Descongelar el core (entidad nueva + 3 adapters + validador), UI media-heavy, integración con portales sin API.
- **Riesgo: ALTO.** Compite frontal contra Wasi ([opera en Bolivia](https://wasi.co/app-planes_precios.htm), [desde ~US$30/mes](https://blog.wasi.co/precios-de-wasi/) con apps móviles y años de producto) y contra el stack impuesto de las franquicias. Las ~600 inmobiliarias informales de SCZ son mayormente **no-pagantes por definición**. Cero clientes pagando hoy en este rubro. Es exactamente el escenario que la regla WOW prohíbe.

### Opción 2 — Herramienta B2C self-service para asesores individuales (el insight N6)
Plan individual en Bs (el ciclo semanal 89 Bs ya existe): cartera de propiedades **simple** (versión mínima de la entidad, sin multi-portal), seguimiento de interesados, agenda de visitas, mini-web con cartera, agente IA de seguimiento.
- **Costo: MEDIO.** Reusa ~70%; la entidad propiedad nace mínima como módulo product-local (escotilla `PRODUCT_LOCAL_MODULE_IDS`, con propuesta al contrato escrita, sin descongelar core hoy).
- **Riesgo: MEDIO.** El técnico es bajo; el comercial no: el embudo self-service de Onia todavía tiene **0 pagantes probados** en cualquier rubro, y el asesor suelto es un cliente de ticket chico y churn alto. **Ventaja cambiaria real (inferencia sobre dato propio):** Wasi cobra en USD (~US$30 ≈ Bs 340+ al cambio real post-flotación); Onia cobra en Bs con QR local. Anticrético de primera clase + WhatsApp-first son diferenciadores genuinos que ningún CRM regional tiene.

### Opción 3 — Add-on "captación de leads inmobiliarios" (sin entidad propiedad)
Vender el **agente**, no el CRM: capta interesados desde IG/portales/formulario del asesor, califica (zona, presupuesto, tipo de operación), agenda la visita y deja todo en contactos + work items existentes. Human-in-the-loop, mismo circuito propone→cola→aprueba ya vivo.
- **Costo: BAJO.** Casi todo existe: runtime de agentes, cola sembrada (C3), contactos, agenda, `addon.chatbot`/`addon.whatsapp` ya declarados en `ADDON_IDS`. Es un rol de agente nuevo + copy, del tamaño del "cobrador de comercio" (C10, que fue un día).
- **Riesgo: BAJO técnico / MEDIO comercial.** El envío real de WhatsApp sigue bloqueado por Meta (D3: S5/S6) — ese es el gate real, y es transversal, no de este rubro. Además esto es literalmente lo que N6 rescató: "su oficina como cliente de lo COMPLEMENTARIO (agente de leads)".

---

## d) VEREDICTO

**Entrar por la Opción 3, ahora, con la oficina C21 Acero como primer cliente pagando. Opción 2 solo tras señal. Opción 1 nunca como greenfield.**

1. **Ahora (Opción 3):** el add-on de leads cumple WOW-con-cliente-pagando sin construir nada especulativo — el candidato a primer pagante ya existe (la oficina de la reunión N6, como cliente de lo complementario, jamás como socio). Prerequisito duro: destrabar Meta S5/S6, que ya bloquea a los otros rubros igual. Costo hundido si fracasa: casi cero, porque todo lo construido (rol de agente, calificación de leads) sirve a cualquier rubro.
2. **Señal que gatilla la Opción 2:** **5+ asesores individuales pagando el add-on de leads por 2+ meses** (o la oficina piloto renovando). Ese número prueba a la vez el canal de adquisición y la disposición a pagar — las dos incógnitas sin dato. Recién ahí se construye la entidad propiedad mínima y el plan asesor en Bs.
3. **Opción 1 solo bajo la regla N6:** si una inmobiliaria u oficina quiere el track completo, es **desarrollo pagado por adelantado + licencia + mantenimiento** — nunca a riesgo propio, nunca a comisión.

**Sobre la regla WOW:** cuestionada contra los datos, **los datos la confirman**. Hay un incumbente barato ya operando en Bolivia (Wasi), el segmento contable (franquicias) está capturado por stacks impuestos, y el segmento libre (informales) no tiene tamaño verificable ni cultura de pago. Construir el track de antemano sería apostar el core congelado contra un mercado sin un solo dato de demanda pagada. El único matiz honesto: para la Opción 3 la regla es casi gratis de cumplir, así que no hay excusa para esperar — el "cliente pagando" puede cerrarse este mes.

---

## e) Competencia directa — la verdad aunque duela

- **Wasi ya está en Bolivia.** Su [página de precios lista Bolivia](https://wasi.co/app-planes_precios.htm) entre sus 20 países, [desde ~US$30/mes](https://blog.wasi.co/precios-de-wasi/), con apps iOS/Android, web del asesor incluida y años de madurez. En CRM inmobiliario puro, Onia llega tarde y con menos producto.
- **Tokko Broker no lista Bolivia** entre sus mercados activos (México, Argentina, Perú, Ecuador; [planes desde ~MX$480/mes](https://www.comparasoftware.com/tokko-broker)). [EasyBroker](https://www.easybroker.com/mx/planes) (US$29–89/mes) es México-céntrico. Amenaza baja hoy, pero cualquiera entra a Bolivia con un click de configuración.
- **Los portales ya resolvieron la vidriera:** [UltraCasas](https://www.ultracasas.com/) (#1, publicación base gratuita) e [InfoCasas](https://www.infocasas.com.bo/) (20.000 propiedades, 2-10x más barato que UltraCasas según [CasasenBolivia](https://casasenbolivia.com/ultracasas-vs-infocasas-servicios-precios-comparacion-definitiva/)). Competirles en publicación sería suicida; sin API pública, integrarse tampoco es viable hoy.
- **Dónde NO domina nadie (el hueco real):** el seguimiento automatizado del lead por WhatsApp en español boliviano, cobrado en Bs con QR, con anticrético nativo y un agente que trabaja solo. Wasi es un CRM que el asesor tiene que operar; el add-on de Onia es un empleado que el asesor aprueba. Ese es el único terreno donde Onia entra con ventaja y con lo que ya tiene construido.
