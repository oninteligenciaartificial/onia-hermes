# Psicología de precios de la competencia — y qué hacemos con eso en Onia

Cómo arman sus precios y cómo organizan a sus usuarios los constructores de web y SaaS
grandes: Hostinger, Wix, Squarespace, Shopify, Framer, Webflow, Lovable y Lety.ai.

**Todas las cifras ajenas de este documento fueron leídas de la página de precios pública
del propio proveedor el 2026-08-20**, renderizada en navegador (no grep, no memoria). Lo
que no pude ver está marcado `a verificar` y listado al final. Precios en USD, sin
impuestos, salvo aclaración.

> **Alcance.** Este doc es el ÍNDICE de la psicología de precios ajena. No define precios
> de Onia. Los montos de Onia mandan desde el código (§4.1). El *método* de subir precios
> sin perder clientes ya vive en `hermes-content/propuestas/ONIA_PRICING_ESTRATEGIA_ESCALADA_2026.md`
> y este doc no lo reemplaza: lo alimenta.

> **Sobre "Lety".** Sergio dictó "Lety" por voz. Existen DOS candidatos y cubro los dos:
> **Lovable** (constructor de apps con IA, el que estaba en la lista de rubro) y
> **Lety.ai**, que **es real** — plataforma white-label de agentes IA para agencias,
> `lety.ai/pricing`, leída el 2026-08-20. Lety.ai es el más cercano a lo que Onia ya vende
> (chatbot de WhatsApp con IA) y por eso queda dentro.

---

## 1. Tabla comparativa de precios

Leído 2026-08-20. "Anual" = precio mensual cuando pagás el año entero por adelantado.

| Proveedor | Gratis | Escalón 1 | Escalón 2 | Escalón 3 | Techo / ancla | Se cobra por |
|---|---|---|---|---|---|---|
| **Hostinger** (web hosting) | no (30 días devolución) | Premium **$2.99/mo** a 48 meses → renueva **$10.99** | Unlimited **$3.99** → renueva **$16.99** | Cloud Startup **$7.99** → renueva **$25.99** | el precio tachado ($11.99 / $18.99 / $27.99) | sitio + plazo prepagado |
| **Wix** | sí, $0 (dominio wix) | Light **$17** | Core **$29** | Business **$39** ← "RECOMMENDED" | Business Elite **$159** | sitio (colaboradores por plan) |
| **Squarespace** | no, prueba 14 días | Basic **$12** anual / $19 mensual | Core **$17** anual / $27 ← "Recomendado" | Advanced **$25** anual / $36 | "Planes premium" sin precio (contactar ventas) | sitio + % de tus ventas |
| **Shopify** | no; **3 días gratis y después $1/mes × 3 meses** | Basic **$22** anual ($25 mensual) | Grow **$58** | Advanced **$359** | Plus **desde $2,300** | tienda + % si no usás su pasarela |
| **Framer** | sí, $0 (dominio framer, 1 GB, 500 créditos) | Basic **$10** | Pro **$30** | — | Enterprise (custom) | **sitio** + asiento ($20/editor) + créditos |
| **Webflow** | sí, Starter $0 (webflow.io, 2 páginas, 50 formularios) | Basic **$15** anual / $25 mensual | Premium **$25** anual / $39 mensual | — | **Team $2,500/mo**, contrato anual obligatorio | **sitio** × workspace (dos ejes) + add-ons por uso |
| **Lovable** | sí, $0 (5 dominios lovable.app, badge Lovable) | Pro **$25** — 100 créditos/mes | Business **$50** — **los mismos 100 créditos** | — | Enterprise ("platform fee", volumen) | crédito (uso) + gobernanza |
| **Lety.ai** | no; prueba 7 días con tarjeta | Starter **$97** — 2 subcuentas, **4.9%** de comisión | Standard **$297** ← "MOST POPULAR" — 10 subcuentas, **2.9%** | Unlimited **$497** — subcuentas ilimitadas, **1.9%** | — | cliente final (subcuenta) + % transaccional |

Descuentos por plazo tal como los presentan:

| Proveedor | Cómo lo dice | Descuento real medido |
|---|---|---|
| Hostinger | "75% off" / "Special offer • 79% off" / "71% off" | sobre un precio tachado que **no** es el de renovación (ver §2.1) |
| Squarespace | "Paga anualmente para ahorrar hasta un 36 %" | Basic 12 vs 19 = **37%**; Core 17 vs 27 = **37%**; Advanced 25 vs 36 = **31%** |
| Webflow | "Yearly (Save up to 40%)" | Basic 15 vs 25 = **40%**; Premium 25 vs 39 = **36%** |
| Lovable | "2 months free" | **~17%** (10 meses por 12) |
| Shopify | Basic $22 anual vs $25 mensual | **12%** |
| Wix / Framer | no anuncian %: **muestran directamente el precio anual** como número principal | `a verificar` |

---

## 2. Los 6 mecanismos, con el ejemplo real que los muestra

### 2.1 El acantilado de renovación

El precio de entrada y el precio real son dos números distintos, y el cliente firma mirando
el primero.

**Hostinger, leído 2026-08-20.** Premium se anuncia a **$2.99/mo**, se cobran **48 meses
por adelantado** ($143.52 de una vez) y al mes 49 **renueva a $10.99/mo**. Multiplicador
exacto: **3.67x**. Los otros dos: Unlimited $3.99 → $16.99 = **4.26x**; Cloud Startup
$7.99 → $25.99 = **3.25x**. La página lo dice, en letra pequeña bajo el botón: *"Get 48
months for $143.52 (regular price $575.52). Renews at $10.99/mo."*

El detalle fino que casi nadie mira: **el precio tachado no es el de renovación**.
$575.52 ÷ 48 = $11.99/mo tachado, contra $10.99/mo de renovación real. Lo mismo en los
otros dos: $18.99 tachado vs $16.99 real, $27.99 tachado vs $25.99 real. **Exactamente $2
de diferencia en los tres.** El ancla tachada es una construcción, no un precio que alguien
pague nunca.

Refuerzo: *"All plans are paid upfront."* No hay mensual visible en la página. Y en vez de
prueba gratis hay **30 días de devolución** — que exige poner la tarjeta primero.

### 2.2 El ancla de la escalera (el plan caro que nadie compra)

Un escalón muy por encima del resto no está para venderse: está para que el de al lado
parezca razonable.

- **Wix:** Business Elite **$159** al lado de Business $39, que es el que lleva el cartel
  "RECOMMENDED". **4.1x**. Los tres primeros escalones están comprimidos ($17 → $29 → $39,
  saltos de $12 y $10) y después se abre un abismo de $120.
- **Webflow:** el plan **Team a $2,500/mo** aparece en la misma fila que Premium a $25/mo.
  **100x.** Después de leer $2,500, $25 no es un gasto.
- **Shopify:** Advanced **$359** entre Grow $58 (6.2x) y Plus "desde $2,300". Advanced no
  compite con Grow: hace que Grow parezca barato y que Plus parezca alcanzable.

### 2.3 El señuelo: mismo tanque, distinto candado

El escalón que existe para empujar al de al lado, no para ser elegido.

**Lovable, leído 2026-08-20.** Pro **$25/mo** = 100 créditos mensuales. Business **$50/mo**
= **100 créditos mensuales**. El doble de precio por **cero** capacidad extra. Lo que
cambia es gobernanza: team workspace, SSO, security center, roles, soporte prioritario. El
encabezado de la página dice *"Upgrade to get the capacity that exactly matches your team's
needs"* — y el salto que cobra más caro **no es capacidad**. Tienen hasta una pregunta
frecuente titulada "Why is the Business plan more expensive?".

Variante en **Squarespace**: entre Core ($17) y Advanced ($25) lo único que cambia de
verdad es la comisión sobre productos digitales, 5% → 0%. Advanced solo tiene sentido si
vendés más de ~$160/mes en digital. Debajo de eso, Advanced existe para que Core se vea
suficiente.

### 2.4 El impuesto sobre tu propia facturación

El plan barato se vuelve caro **solo si te va bien**. Es un upgrade automático sin vendedor.

- **Squarespace:** Basic cobra **2%** de la tienda online y **7%** de productos digitales;
  Core **0%** y **5%**; Advanced **0%** y **0%**.
- **Shopify:** comisión por usar una pasarela de terceros: Basic **2%**, Grow **1%**,
  Advanced **0.6%**, Plus **0.2%**. No te cobran por vender: te cobran por **no** usar
  Shopify Payments, y el castigo se achica a medida que subís.
- **Lety.ai:** **4.9% / 2.9% / 1.9%** de comisión transaccional según plan.

El cliente que crece se auto-vende el escalón siguiente haciendo una división.

### 2.5 La marca de agua: el plan gratis no limita el trabajo, limita la dignidad

Ninguno de los planes gratis está recortado por volumen de negocio. Están recortados por
**lo que se ve cuando se lo mostrás a alguien**.

- **Wix free:** dominio de Wix. El FAQ lo dice sin vueltas: *"With a Premium plan you can
  connect your own domain, remove Wix branding from your site"*.
- **Framer free:** dominio framer, 1 GB de ancho de banda, 500 créditos "to try". La
  respuesta oficial: *"To connect a custom domain, you'll need to upgrade to a paid plan."*
- **Webflow Starter:** dominio webflow.io, 2 páginas estáticas, 50 formularios.
- **Lovable:** "Remove the Lovable badge" está listado como **feature del plan Pro**. El
  badge es el producto que te venden por $25.

El gratis deja trabajar todo lo que quieras. Cobra el día que lo publicás con tu nombre.

### 2.6 El precio grande de la página no es el precio del mes

Cuatro de siete muestran por defecto el **precio anual prorrateado** como número grande, y
el mensual real vive detrás de un interruptor o de una nota.

- **Wix** muestra $17 / $29 / $39 / $159 y aclara al pie: *"Displayed prices are for yearly
  subscriptions, paid in full at the time of purchase."*
- **Framer** abre en "Yearly billing".
- **Webflow** dice "billed yearly" debajo de cada precio y el mensual real es 40% más caro
  (Basic $15 → $25, Premium $25 → $39).
- **Squarespace** llega directo con "Pagar anualmente" activo: $12 vs los $19 reales.

La variante agresiva es de **Shopify**: *"Try 3 days free, then $1/month for 3 months."*
No es un descuento por plazo, es un **precio de centavo** que mueve el momento de la
decisión real al mes 4, cuando la tienda ya tiene productos cargados y no se muda.

---

## 3. Cómo organizan al usuario adentro del producto

### 3.1 La unidad de trabajo (y quién paga por ella)

| Proveedor | Unidad que se cobra | Cómo se agrupa lo de un mismo dueño | Equipo |
|---|---|---|---|
| Hostinger | plan de hosting con N sitios | hPanel con lista de sitios | Premium 3 sitios; Unlimited/Cloud ilimitados |
| Wix | **el sitio** | cuenta con varios sitios | "site collaborators": 2 / 5 / 10 / **100** por plan |
| Squarespace | **el sitio** | cuenta | 2 colaboradores en Basic, **ilimitados** desde Core |
| Shopify | **la tienda** | una tienda = una suscripción | staff accounts: 5 (Grow) / 15 (Advanced) / ilimitados (Plus); POS Pro **+$89/mo por local** |
| Framer | **el sitio**, dentro de un workspace | workspace → proyectos | editores **$20/mes c/u**, editores de contenido **$10/mes**, **viewers gratis**; 10 asientos en Pro |
| Webflow | **dos ejes**: Site plan (publicar/hostear, "All prices in USD, per site") **×** Workspace plan (asientos) | Workspace contiene sitios | los asientos se pagan en el otro eje |
| Lovable | **el crédito**, dentro de un workspace | workspace → proyectos | colaboradores **ilimitados incluso en el gratis**; roles y **límites de crédito por miembro** en Pro/Business |
| Lety.ai | **la subcuenta de cliente** | la agencia agrupa a SUS clientes | 2 / 10 / ilimitadas |

Tres modelos distintos y vale distinguirlos:

1. **Por sitio** (Wix, Squarespace, Framer, Webflow): el que tiene 5 clientes paga 5 veces.
2. **Por asiento** (Framer, Webflow, Shopify): el que crece en gente paga más.
3. **Por cliente final** (Lety.ai): la unidad no es el trabajo, es a quién se lo revendés.

Framer y Webflow cobran los tres a la vez (sitio + asiento + uso). Lovable llegó al mismo
ARPU sin cobrar asientos: cobra el crédito y regala los colaboradores.

### 3.2 El primer minuto

- **Wix:** entrada por prompt de IA — *"Create your site from a single prompt"* — o
  plantilla (+2000). La página de precios enumera el arranque en **5 pasos** antes de
  pedir plata.
- **Shopify:** guía de configuración pública en el Help Center, *"Getting set up to start
  selling"*, con 14 secciones. No es un checklist descartable sino un hub permanente.
  Dentro del producto suma **Sidekick**, asistente de IA integrado. (El checklist que se
  ve dentro del admin no lo pude verificar: requiere cuenta.)
- **Framer:** plantillas + agentes; academia y guías públicas.
- **Lety.ai:** *"Launch your first agent through 7 simple steps inside the platform. No
  support tickets, no scheduling calls"*. El onboarding es un producto, no un servicio.
- **Squarespace:** plantilla + prueba de 14 días **sin tarjeta** (*"No necesitas tarjeta de
  crédito"*), más seminarios web gratuitos.

Patrón común: **nadie te suelta en un lienzo vacío**. Se entra por plantilla, por prompt o
por lista numerada de pasos.

### 3.3 Cómo muestran el techo sin que se sienta castigo

Esto es lo más copiable de todo el documento.

- **Framer** — el techo blando, textual de su FAQ: *"When you reach certain limits, we
  will ask you to upgrade your plan in Framer. For other limits, like bandwidth, we allow
  you to exceed your limit for one month. You'll receive a notification via email so you
  can upgrade your plan accordingly."* Un mes de gracia y un mail. La tabla además dice
  "Monthly bandwidth **with overage alerts**": el aviso llega antes del choque.
- **Framer y Webflow** — el **deslizador dentro del plan**: en Basic los créditos van de
  1.000 a 15.000/mes y en Pro de 3.000 a 100.000; en Webflow Premium el ancho de banda va
  de 50 GB a 2.5 TB. Subís de capacidad **sin cambiar de plan**: no hay momento de
  "me quedé chico", hay una perilla.
- **Lovable** — el techo se compra en vez de cortar: *"Credit rollovers"*, *"On-demand
  credit top-ups"*, y *"Per-member credit limits"* para que el equipo no queme el saldo.
  Lo que sobra un mes no se pierde.
- **Webflow** — los add-ons (Optimize, Analyze, Localize) se cotizan con deslizador por
  page views / sesiones / idiomas. El precio sigue al uso sin renegociar el plan.

Ninguno de los siete corta en seco sin aviso.

### 3.4 Cuando el usuario se traba

| Proveedor | Qué hay |
|---|---|
| Wix | "24/7 customer care", Help Center, tutoriales, chat, y **marketplace de expertos** ("Hire a pro") |
| Squarespace | soporte 24/7 + **seminarios web gratuitos** en vivo |
| Shopify | chat en vivo 24/7 en todos los planes + **Sidekick**, asistente IA dentro del admin |
| Framer | Academy, guías, agentes dentro del editor; **Pro Experts** con acceso gratis a proyectos de cliente |
| Lovable | soporte escalonado por plan: community → email (Pro) → priority (Business) |
| Lety.ai | onboarding autoguiado; soporte por ticket, grupal (Standard) o 1-a-1 (Unlimited) |

Dos escuelas: **soporte humano escalonado como feature de plan** (Lovable, Lety, Hostinger
con "priority support") o **ayuda plana + IA en contexto** (Shopify, Wix). La segunda
escala sin contratar gente.

---

## 4. DECISIONES PARA ONIA

### 4.1 Lo que Onia cobra HOY (leído del código el 2026-08-20)

Esto no es opinión ni doc: es lo que el checkout valida.

**Planes base — `onia-platform/lib/subscription-plans.ts`** (el archivo se autodeclara
"FUENTE ÚNICA de los montos"):

| Plan | Mensual | Semanal | Anual (total) | Anual ÷ 12 |
|---|---|---|---|---|
| Básico (`basic`) | Bs. 320 | Bs. 89 | Bs. 3.200 | Bs. 267 |
| Profesional (`professional`) | Bs. 750 | Bs. 199 | Bs. 7.500 | Bs. 625 |
| Completo (`clinic`) | Bs. 1.500 | — | Bs. 15.000 | Bs. 1.250 |
| Empresa (`enterprise`) | Bs. 2.900 | — | Bs. 29.000 | Bs. 2.417 |

Anual = 10x el mensual (2 meses gratis, **~17% de descuento**). Semanal con prima (~20%
Básico, ~15% Pro) porque la flexibilidad se paga.

**Add-ons — `onia-platform/lib/pricing.ts`:** chatbot WhatsApp **Bs 390/mes o Bs 3.900/año,
sin cargo inicial** (500 conversaciones incluidas; el consumo de Meta lo paga el cliente en
su propia cuenta); agenda pública Bs. 150/mes (incluida en Pro y Completo); usuario extra Bs. 70/mes (máx. 3 en Básico); self-hosted desde Bs. 4.500 + Bs. 900/mes; Empresa desde Bs. 2.900 +
implementación desde Bs. 3.500.

**Techos — `onia-platform/lib/plan-limits.ts`:** free 30 clientes / 1 usuario / 0 emails;
Básico 300 / 2 / 200; Profesional 1.500 / 5 / 800; Completo y Empresa ilimitados. Trial
**14 días** en plan `professional`, gracia **1 día**.

### 4.2 Qué COPIAMOS

1. **El techo blando de Framer (§3.3).** Es el hueco más caro que tenemos. Hoy
   `checkPatientLimit` / `checkUserLimit` viven en `lib/plan-limits.ts` y **solo se llaman
   desde rutas API**: el cliente descubre su límite cuando le rebota una acción. Copiar,
   en orden: aviso al 80%, un mes de tolerancia por encima del techo, y el pedido de
   upgrade dentro del producto. Ya existe la estructura: `UsageCheckResult` devuelve
   `current` y `limit`, y nadie los muestra.
2. **La perilla en vez del salto.** Ya tenemos `EXTRA_USER_ADDON_PRICE` (Bs. 70/usuario,
   hasta 3 en Básico), que es exactamente esto: 320 + 3×70 = Bs. 530 antes de saltar a 750.
   Extender la misma lógica a clientes y emails en vez de forzar 320 → 750 de golpe.
3. **Mostrar el ancla.** `ENTERPRISE_PLAN_PRICE` (Bs. 2.900 + Bs. 3.500) existe en
   `pricing.ts` pero está fuera del checkout (`CHECKOUT_PLANS` = basic/professional/clinic).
   Ponerlo como cuarta columna "hablar con ventas" en la página de precios es el mismo
   movimiento de Webflow con Team $2,500 al lado de Premium $25: hace que Bs. 1.500 se lea
   barato, sin cambiar un solo precio.
4. **El descuento anual como número grande.** Nuestro anual ya es ~17% y no lo decimos.
   Squarespace y Webflow ponen el anual de titular y el mensual tachado al lado. Es la
   misma plata con mejor lectura, y baja el churn.
5. **Marca de agua en vez de recorte de capacidad** (§2.5). Aplicación concreta: dejar la
   **agenda pública** disponible en Básico con un "Powered by Onia" visible, y que el
   add-on de Bs. 150 compre **quitar la marca**. Hoy la agenda simplemente no existe en
   Básico (`publicBookingIncluded: false`); un techo invisible no vende nada, una marca
   visible sí.
6. **La subcuenta de cliente de Lety.ai** — anotada, no construida. Si Onia activa
   revendedores (`ONIA_COLABORADORES_COMERCIALES_SIN_INVERSION_2026.md`), la unidad de
   cobro no será el sitio ni el asiento sino **el cliente del colaborador**. Es un pendiente
   de diseño, no de esta sesión.

### 4.3 Qué NO copiamos, y por qué

1. **El acantilado de renovación de Hostinger (3.67x).** Con la devaluación boliviana
   (USD 6,96 → ~11,37) el cliente ya vive con la sensación de que todo sube solo. Un 3.7x
   al mes 49 quema lo único que Onia todavía no tiene: reputación. Y **contradice de frente
   la promesa de precio fundador congelado** de `ONIA_PRICING_ESTRATEGIA_ESCALADA_2026.md`,
   que ya está decidida.
2. **El prepago de 48 meses.** Un negocio boliviano de caja diaria no prepaga cuatro años
   — para eso existe el ciclo `weekly` en el catálogo. El plazo largo se **premia con
   descuento**, no se **exige**.
3. **El % sobre la facturación del cliente** (Squarespace, Shopify, Lety.ai). No es
   ejecutable: `gatewayEnabled: false` en **los cinco planes** de `plan-limits.ts` — Onia
   no procesa los pagos, así que no hay dónde retener nada. Venderlo sin poder cobrarlo es
   una promesa falsa. Y castigar el crecimiento del cliente es justo lo que prohíbe la
   regla 6 de la estrategia de escalada.
4. **Créditos como unidad de precio** (Lovable, Framer). El dueño de una ferretería en
   Santa Cruz no tiene idea de cuántos créditos cuesta agendar. Nuestra unidad ya está bien
   elegida: **la conversación** (500/mes). No la cambiamos por una abstracción.
5. **El señuelo de capacidad idéntica** (Lovable Pro $25 / Business $50, mismos créditos).
   `lib/subscription/plan-display.ts` ya lo prohíbe por escrito: *"no se distinguen por
   volumen sino por el salto"*, y exige que cada bullet sea cierto contra el código que
   corre hoy.

   🔴 **Corregido 2026-08-24: lo estamos haciendo.** Acá decía "en esto ya estamos por
   encima de Lovable" y es falso. `PLAN_LIMITS` le da a **Completo (Bs 1.500) y Empresa
   (Bs 2.900) límites IDÉNTICOS**: los dos con clientes, usuarios y correos ilimitados y
   todas las funciones encendidas. **Bs 1.400 de diferencia sin una sola diferencia
   funcional en el código.** Es exactamente el señuelo de Lovable, con peor relación.

   Y lo que Empresa promete para justificarse —*"multi-sucursal, contabilidad avanzada,
   instancia privada"*, de su `activationMessage`— se sostiene a medias: la contabilidad es
   transversal y la tienen todos los planes, y la instancia privada es el add-on self-hosted
   que se cobra aparte.

   ⚠️ **Corregido 2026-08-25:** acá decía **multi-sucursal NO EXISTE** (*branchId da cero
   coincidencias*). El grep era cierto y la conclusión falsa — `OniaCommerceWarehouse` ya
   existía con el stock indexado por depósito. **Varios depósitos + traspaso interno están
   VIVOS en producción desde el 2026-08-25**; lo que no existe es la **sucursal FISCAL ante el
   SIN**. Detalle en `historial/ONIA_QUE_SE_VENDE_Y_A_QUE_PRECIO.md` §4.2.

   **Empresa se vende por sus depósitos, nunca por sucursales ante Impuestos.** Mientras tanto sirve
   como ancla visible (§4.2.3) — mostrarlo hace que Bs 1.500 se lea barato — pero
   mostrarlo NO es lo mismo que venderlo.
6. **Cobrar en dólares.** Los siete comparables cotizan en USD (Wix incluso advierte
   *"Prices and currency vary by location"*). Con el boliviano devaluado, un precio atado
   al dólar **subió 63%** sin entregar nada nuevo. Cobrar en Bs es una ventaja competitiva
   concreta frente a Wix, Shopify y Squarespace en Bolivia: **el precio no se mueve solo**.
   Eso hay que **decirlo en la página de precios**, no dejarlo implícito.

### 4.4 Qué choca con `pricing.ts` tal como está HOY

Nueve hallazgos. Los cuatro primeros son los que romperían una venta.

1. 🔴 **Dos archivos se declaran fuente única.** La regla de la casa dice "manda
   `onia-platform/lib/pricing.ts`", pero **los precios de los planes NO están ahí**: están
   en `lib/subscription-plans.ts`, cuyo encabezado dice *"Catálogo de precios de suscripción
   Onia — FUENTE ÚNICA de los montos"*. `pricing.ts` solo tiene add-ons y Empresa. O
   `pricing.ts` re-exporta `DEFAULT_PLAN_AMOUNTS`, o la regla apunta al archivo equivocado.
   Es exactamente el problema de los cuatro precios vivos, en versión chica.
2. 🔴 **`ADMIN_ADDON_INFO` sigue publicando la escalera de 3 niveles retirada.**
   `label: "Chatbot WhatsApp (3 niveles)"`, `price: "N1 Bs. 200 · N2 Bs. 550 · N3 Bs. 900 /mes"`
   — precios retirados. ⚠️ **Corregido 2026-08-24:** el add-on son **Bs 390/mes sin cargo
   inicial** (`WHATSAPP_ADDON`), no los Bs 1.490 que decía este doc — esa cifra vivía en 24
   archivos y ninguno era la fuente. Un superadmin lee 200/550/900 mientras el checkout cobra 390.
3. ✅ **RESUELTO — verificado 2026-08-24.** Acá decía que había una contradicción interna:
   `markupPct: 20` en el código contra un `fullLabel` que promete el costo sin recargo.
   **Ya no existe.** `grep markupPct` da cero coincidencias, y el comentario de
   `lib/pricing.ts:45` dice literal *"las paga él en su cuenta. Por eso no hay markup"*.
   Se resolvió en el commit `f9873ae`, llamado *"el chatbot pasa a Bs 390/mes sin
   instalación, y salimos de la cadena de pago de Meta"* — la misma decisión que fijó los
   Bs 390. Este doc describía el estado anterior a ese commit.

   **Y eso convierte la debilidad en argumento.** Lety.ai vende *"0% markup"* como su tesis
   central; nosotros ya estamos ahí y además cobramos en bolivianos. Decirlo así en la
   página de precios: *"los mensajes te los cobra Meta directo en tu cuenta — nosotros no
   ponemos un peso encima."*
4. 🔴 **El plan `free` es un muro, no una demo.** 30 clientes, 1 usuario, 0 emails, sin
   agenda, sin reportes, sin agentes. **Ninguno de los siete comparables limita el gratis
   por volumen de datos del negocio** — limitan publicación y marca (§2.5). Un dentista con
   45 pacientes no puede ni cargar su cartera para ver si le sirve, y se va antes de
   entender el producto.
5. 🟠 **No hay contador de uso en ninguna pantalla.** `checkPatientLimit` y
   `checkUserLimit` se llaman solo desde `app/api/*`. La única página que muestra un techo
   es `app/(dashboard)/communications/page.tsx` (emails). Todo lo demás rebota sin aviso
   previo.
6. 🟠 **El ancla existe y está escondida.** `ENTERPRISE_PLAN_PRICE` fuera de
   `CHECKOUT_PLANS`: pagamos el costo de mantenerlo sin cobrar el beneficio psicológico de
   mostrarlo (§4.2.3).
7. 🟠 **La gracia de 1 día es la más dura del tablero.** `GRACE_PERIOD_DAYS = 1`. Squarespace
   da 14 días de prueba sin tarjeta, Wix 14 de devolución, Shopify amortigua con $1/mes
   durante 3 meses. Nuestro trial de 14 días está bien; el corte al día siguiente, no.
8. 🟡 **`PLAN_COMPARISON_ADDON_ROWS.whatsapp.label`** todavía dice *"(add-on, 3 niveles)"*
   con el valor al lado. ⚠️ El valor correcto es **Bs 390**, no 1.490 (corregido 2026-08-24).
9. 🟡 **Nada en el producto nombra el descuento anual.** El 17% (10x = 2 meses gratis) vive
   como comentario en `subscription-plans.ts` y no aparece como argumento de venta.

### 4.5 Los 3 movimientos más accionables

1. **Techo blando + contador visible** (Framer §3.3) — hoy el cliente choca con un 403 sin
   aviso, y el dato ya está calculado y sin usar.
2. **Empresa Bs. 2.900 como cuarta columna visible** (Webflow Team §2.2) — cero cambio de
   precio, Bs. 1.500 se lee barato.
3. **Marca de agua en vez de recorte** (§2.5) — la agenda pública en Básico con
   "Powered by Onia", y los Bs. 150 compran quitarla.

---

## 5. Lo que NO pude verificar

Marcado como tal para que nadie lo cite como cifra firme.

- **Precios mensuales de Wix.** La página muestra solo la vista anual; el pie aclara
  *"Displayed prices are for yearly subscriptions, paid in full"*. No pude accionar el
  cambio a mensual.
- **Precios mensuales de Shopify Grow, Advanced y Plus.** Solo Basic aparece con los dos
  valores en la tabla comparativa ($25 mensual / $22 anual). El interruptor "Pay monthly"
  no cambió los valores al accionarlo.
- **Precios mensuales de Framer Basic y Pro.** La página abre en "Yearly billing" y el
  cambio no respondió.
- **La escalera de plazos de Hostinger** (1, 12, 24 meses). El selector de la página solo
  ofrecía "48 months plan" y no pude abrir el desplegable. Los precios de plazos cortos
  quedan a verificar en el checkout.
- **El primer minuto DENTRO de cada producto.** Crear cuentas está prohibido, así que §3.2
  se apoya solo en documentación pública: la guía de Shopify sale del Help Center, la de
  Lety.ai de su propia página de precios. El checklist que se ve dentro de cada admin no lo
  vi renderizado.
- **Precio del top-up de créditos de Lovable** y **valor en USD de un crédito de Framer**.
- **Precios localizados para Bolivia.** Todo lo de arriba es la vista en USD. Wix advierte
  explícitamente que precio y moneda cambian por ubicación.
- **Precios mensuales de Lety.ai por plazo.** Su página muestra un único precio mensual sin
  opción anual visible.

---

*Fuentes, todas leídas en navegador el 2026-08-20:* `hostinger.com/web-hosting` ·
`wix.com/plans` · `es.squarespace.com/pricing` · `shopify.com/pricing` ·
`framer.com/pricing` · `webflow.com/pricing` · `lovable.dev/pricing` · `lety.ai/pricing`.
*Fuentes internas:* `onia-platform/lib/pricing.ts`, `lib/subscription-plans.ts`,
`lib/plan-limits.ts`, `lib/subscription/plan-state.ts`, `lib/subscription/plan-display.ts`.
