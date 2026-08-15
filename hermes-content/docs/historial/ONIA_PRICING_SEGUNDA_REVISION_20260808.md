# ONIA — Pricing: segunda revisión adversarial

**Fecha:** 2026-08-08
**Qué es:** veredicto de síntesis sobre `ONIA_PRICING_ESCALABLE_Y_IA_LOCAL_20260807.md` (propuesta) y `research/ONIA_BENCHMARK_INDUSTRIA_20260807.md` (benchmark), tras cuatro ataques independientes (cliente boliviano · competencia local · aritmética/márgenes · ejecución contra el código real).
**Estado:** propuesta de ratificación. La tabla del §3 es la que se somete a Sergio.
**Tipo de cambio usado:** Bs 11,1/USD (paralelo verificado 6-ago-26; el doc previo usó 11,37).

Convención: `[cálculo propio]` = cuenta hecha acá. (†) = fuente de tercero, no oficial del vendor. Todo lo que sale del código lleva ruta y archivo.

---

## 1. Los 3 agujeros que hay que tapar antes de publicar precios

### Agujero 1 — Dos líneas de la tabla venden algo que no tiene modelo de datos: sucursal y créditos

**El número:** cero ocurrencias de `branchId` y cero de ledger/saldo/balance de créditos en `C:\dev\proyectos\onia-platform\prisma\schema.prisma` (rama `master`, tip `6b8f152`). No es que estén incompletos: no existen.

Consecuencias exactas:

- **Sucursal.** Hoy una segunda sucursal es una segunda `Organization`, o sea **otra suscripción de Bs 1.500 sin vista consolidada**. La tabla propone venderla a **Bs 350/mes**: desfase de **4,3x** contra el costo real que el cliente va a pagar. Y la fila "Grupo 2.900 = consolidación multi-sucursal" promete precisamente lo único que ese modelo no puede entregar.
- **Créditos.** La bolsa de Grupo (30.000 créditos) vale **Bs 3.000 al rate card del propio documento** (Bs 100 por 1.000), dentro de un plan de **Bs 2.900**. Ratio bolsa/precio por tier: Pro 40% · Full 67% · **Grupo 103%**. El software sale gratis y sobran Bs 100. Cualquier cliente que consuma créditos compra Grupo y consume; el pack de Bs 100/1.000 pasa a ser ficción.
- Y el rate card uniforme (Bs 0,10/crédito) se aplica sobre costos que varían **166x** según en qué los gaste el cliente. Voz: 15 créditos/min = **Bs 1,50 vendido** contra **Bs 2,20-3,00 de costo** ElevenLabs `[cálculo propio: USD 22/100k chars, español ~900 chars/min]` = margen **-47%**. Los 30.000 créditos de Grupo gastados en voz = 2.000 minutos = **Bs 4.400 de costo sobre Bs 2.900 de ingreso**.

**Cambio concreto:** borrar de la tabla que se publica las 4 celdas de sucursales, el add-on de sucursal (Bs 350), las 4 celdas de bolsa de créditos y el rate card de créditos entero. La fila "Grupo `[NUEVO]`" no es nueva: es `enterprise` (2.900/29.000), shippeado el 2026-07-09, **fuera del checkout** (`CHECKOUT_PLANS = ["basic","professional","clinic"]`) y con `setupFrom: 3500` que la propuesta omite. Se publica como lo que es (se cotiza) o se saca.

---

### Agujero 2 — Hay cuatro listas de precios vivas, y la que se propone contradice a la que cobra

El propio documento fija la regla: **máximo dos listas vigentes**. Hoy hay cuatro y ninguna comparte fuente con otra:

| Lista | Dónde vive | Qué dice |
|---|---|---|
| Core (catálogo) | `onia-core/business-tiers.json` | 390/890/1.990 · usuarios 3/8/? · `invoicing` y `whatsapp` **solo en `empresa`** |
| **La que cobra** | `onia-platform/lib/subscription-plans.ts` + `plan-limits.ts` | 320/750/1.500/2.900 · usuarios **2 / 5 / ∞ / ∞** |
| **La que cotizan los vendedores** | `web-factory/apps/site/src/app/vendedores/cotizador-data.ts` | escalera por rubro (Comercio 350/530/800/1.250) · usuario extra **Bs 70** |
| La propuesta | doc del 2026-08-07 | usuarios 3/8/20/∞ · usuario extra **Bs 45** · chatbot **350 + 1.000** |

**El número que lo prueba:** `business-tiers.json` tiene **cero referencias** en todo `onia-platform` (verificado por grep en el repo completo). La propuesta copió los límites del archivo que nadie ejecuta. Publicar "Pro = 8 usuarios" significa que el cliente de Pro se traba en el 6º con el texto literal de `plan-limits.ts:259`: *"Tu plan permite hasta 5 usuarios. Tienes 5."* Y para desbloquear los 3 que faltan el doc dice Bs 135; el código cobra **Bs 210 (+56%)**.

Dos consecuencias más, del mismo origen:

1. **El chatbot de "350/mes + 1.000 instalación" no existe desde el 2026-07-09.** `lib/pricing.ts:1`, textual: *"Reemplaza el add-on unico anterior (setup 650 + 350/mes)"*. Lo vigente es una escalera de tres: **N1 Recordatorios 300 + 200/mes (sin IA) · N2 IA responde y capta 1.500 + 550/mes · N3 IA opera 3.500 + 900/mes**.
2. **Con esos números, la canibalización del "hecho nº 3" no existe.** Básico 320 + N2 (el nivel que entrega valor de agente IA) = **Bs 870 > Pro 750**. Y N1 tiene `ai: false`, o sea que por la regla propia del documento (un add-on vive en el tier donde aparece la capacidad que lo define) N1 en Básico es legítimo. **El gate a Pro no hace falta, y aplicarlo mata el add-on de Bs 200 — el único que un cliente de Bs 320 puede comprar.**

**Cambio concreto:** publicar los números que el código cobra (2/5/ilimitado, usuario extra 70, chatbot 200/550/900), y sincronizar las cuatro listas el mismo día. Un prospecto que pide cotización a la vendedora y mira la web tiene que ver el mismo número.

---

### Agujero 3 — El ancla de precio está mal medida hacia abajo, y el costo de Meta en Bolivia es el caro de LatAm

El benchmark cierra con *"no hay competidor local boliviano con precio publicado más bajo (no hay precio publicado local, punto)"* y de ahí deriva *"ningún dato relevado justifica bajar precios"*. **Es falso, verificado hoy:**

**Growing Cloud (Cochabamba), precios públicos en Bs:** 100 / 200 / 300 / 450 por mes · **usuarios ilimitados en los cuatro planes** · facturación SIAT en línea · 700 / 1.400 / 2.400 / ilimitadas facturas · casa matriz + 0/1/3/5 sucursales · firma digital desde Premium · **2 meses gratis pagando anual**.

- Onia Básico **Bs 320 con 2 usuarios** contra **Bs 100 con usuarios ilimitados**: **3,2x más caro por menos**. Una clínica de 6 personas: Onia 320 + 4×70 = **Bs 600** contra **Bs 100**.
- **Usuarios ilimitados es la norma local** (Growing Cloud y Sintic no cobran por asiento). Cobrar Bs 45-70/asiento pelea en la única dimensión donde el mercado local ya ganó.
- Corrección al ataque de competencia: **YoFacturo NO es ancla de SIAT hoy** — publica USD 12/30/45/90 pero su soporte de facturación boliviana está en **lista de espera** (verificado en yo-facturo.com/bo). El ancla dura es Growing Cloud.

**Y el dato bloqueante nº 1 del doc ya está, y rompe las bolsas:** Bolivia cae en **"Rest of Latin America"** del rate card de Meta vigente 1-jul-2026 — **marketing USD 0,074 · utility/auth/service USD 0,0113** (†, confirmar contra el CSV oficial antes de publicar).

| | USD/mensaje | Bs/mensaje | Créditos a Bs 0,10 solo para cubrir costo |
|---|---|---|---|
| Marketing (Recall: "hace 8 meses que no venís") | 0,074 | **0,82** | **8,2** |
| Utility (recordatorio de cita, cobranza sobre cita existente) | 0,0113 | **0,125** | 1,25 |

- Bolivia es **2,4x México (0,0305)** y **5,9x Colombia (0,0125)** en marketing. Ningún benchmark regional de "chatbot a USD 31/mes" aplica acá.
- Una clínica con 800 pacientes corriendo Recall una vez al mes consume **Bs 657 de costo puro** `[cálculo propio]` = **6.570 créditos**, contra una bolsa de Pro de 3.000 (valor facial Bs 300). Excedente ≈ **Bs 356 sobre un plan de Bs 750: +47% de factura**. Eso es exactamente la "factura sorpresa" que el benchmark declaró como el ataque nº 1 de Onia contra Intercom Fin y Agentforce.
- Los **mismos** 800 mensajes categorizados como utility cuestan **Bs 100**: diferencia **6,5x**, y la decide quien redacta la plantilla. Es una regla de producto que hoy no está escrita en ningún lado.
- El add-on flat no tiene 86-96% de margen (eso mide solo el LLM). Con transporte de Meta adentro, tiene **29-48%**.

**Cambio concreto:** no publicar bolsa de créditos ni tarifa por mensaje hasta bajar el CSV oficial de Meta y escribir la regla de categorización de plantillas (utility por defecto; marketing solo con OK explícito). Y el pitch de Básico deja de ser "estar ordenado + facturación" — eso es commodity a Bs 100 y gratis en el Portal Web del SIN. El producto es Pro; Básico es la rampa.

---

## 2. Qué sobrevivió del diseño original

Sin re-argumentar. Todo esto se ratifica tal como está.

| Pieza | Por qué queda |
|---|---|
| Precios base 320 / 750 / 1.500 + semanal 89/199 + anual x10 | Coinciden **exacto** con `DEFAULT_PLAN_AMOUNTS` en producción. Nada que migrar |
| Regla de las 5 capas (§1.1) y dónde entra un producto nuevo (§1.2) | Buena arquitectura. El problema es dónde vive el archivo, no qué dice la regla |
| Veredicto de IA local: SKU premium por privacidad, no ahorro (§4.1) + gatillos medibles (§4.4) + §4.5 y §4.6 | Impecable y bien fundado. No tocar |
| Prohibir "precio de por vida" / "la ley te obliga" / "te ahorra plata" | Correcto. Evita repetir el error del pitch SIAT |
| "Si no está 100% automatizado punta a punta, el botón cobra Bs 0" (§5.4) | Es la regla que salva la promesa de self-service |
| Rate card público + tope de gasto + aviso al 80% | Correcto — cuando exista el medidor |
| Grandfathering como política: 60 días, migrar en la renovación, máximo dos listas (§3.2) | Política correcta. Falta la columna que la haga cobrable (§4) |
| Hallazgo Libélula (§5.2) | Es la pieza que destraba el cobro recurrente. Verificación de mayor ROI de la lista |
| Videos de 60-90 s por capacidad + demo multi-flujo ungated por rubro (§5.3) | Datos sólidos y el motor (HyperFrames) ya existe |
| Precio público en todo, contra Dentrix/Dentalink/Doctoralia/Siigo | Diferencial verificado. No perderlo por un módulo |

---

## 3. La tabla de precios CORREGIDA (para ratificar)

**Conclusión de fondo: los precios base no se cambian. Lo que se cambia es lo que se publica.** Los tres números centrales ya están en el código, coinciden con la mediana de entrada LATAM y no hay dato que justifique moverlos con cero clientes. Lo que estaba mal eran las columnas, no las filas.

### 3.1 Planes

| Plan | Bs/mes | Semanal | Anual (total) | Usuarios (lo que el sistema enforcea) | Qué lo define en el pitch |
|---|---|---|---|---|---|
| **Básico** | **320** | 89 | 3.200 | **2** | Rampa: agenda, clientes, caja, historial, export de tus datos |
| **Pro** | **750** | 199 | 7.500 | **5** | **El producto**: agentes IA (Recall, Cobrador) + reportes + reservas online incluidas |
| **Full** | **1.500** | — | 15.000 | **ilimitado** | **Techo**: sin límite de usuarios ni de pacientes |
| **Grupo / Empresarial** | 2.900 | — | 29.000 | ilimitado | **Se cotiza** (fuera del checkout) + setup desde 3.500 |

Sale de la tabla: sucursales, bolsa de créditos, la etiqueta `[NUEVO]` en Grupo, "20 usuarios" en Full, "facturación SIAT incluida en todos los planes".

### 3.2 Add-ons (los que el sistema tiene, no los que el doc propuso)

| Add-on | Precio | Tier mínimo | Nota |
|---|---|---|---|
| Chatbot WhatsApp **N1 Recordatorios** | 300 setup + **200/mes** | Básico | `ai: false`. No entrega la capacidad que define a Pro → no canibaliza |
| Chatbot WhatsApp **N2 IA responde y capta** | 1.500 setup + **550/mes** | Básico | 320 + 550 = **870 > 750**. Aritméticamente no canibaliza: **el gate a Pro no hace falta** |
| Chatbot WhatsApp **N3 IA opera** | desde 3.500 setup + **900/mes** | Pro | + consumo Meta a cargo del cliente |
| Reservas online | **150/mes** | Básico | Incluida desde Pro. No venderla dos veces |
| Usuario adicional | **70/mes** | Básico | Contra un mercado local con asientos ilimitados: es la línea más floja de la grilla |
| Inventario avanzado | desde **180/mes** | Básico | |
| Instancia privada gestionada ("Onia Privado") | **4.500 setup + 900/mes** | Full | Ya publicado en el panel. Los "Bs 450/mes" y los "35.000" del doc quedan sin efecto |

### 3.3 Servicios (una vez)

Migración de datos 800 · Capacitación 2 h 450 · Landing 790 · Web Pro 1.500. Sin cambios.

### 3.4 Las tres decisiones que van con la tabla

1. **El anual es la palanca principal, no el descuento secundario.** Ya existe en el código (x10, 2 meses gratis). 10 clientes Pro anuales = **Bs 75.000 hoy** contra Bs 7.500 `[cálculo propio]`. Con runway corto y QR concentrando el 92% de los pagos digitales del país, un cobro al año elimina 11 eventos de cobranza y 11 de churn por cliente. Vale más que la capa de créditos y el cuarto tier juntos.
2. **La cláusula cambiaria sale del plan base pyme.** El "40% de componente en dólares" no encaja con ninguna fila: la exposición real es **10% en Básico** (Bs 33 de infra sobre 320) y **hasta 100% en un Full credit-heavy**. A Bs 750 la cláusula habilita **+Bs 90/mes = Bs 1.080/año**, mientras el descuento anual regala **Bs 1.500/año**: se arriesga la firma de cada deal para proteger menos de lo que ya se regala. Queda **solo** en Empresarial USD y en el consumo (cuando exista el rate card).
3. **No se crea un quinto tier todavía.** Básico 320 es el escalón más débil de la grilla (3,2x contra Growing Cloud) y tres de los cuatro ataques pidieron un "Onia Solo" de Bs 150-190. Con cero clientes, agregar un SKU antes de vender uno es la antinorma. **Gatillo escrito:** se crea el escalón de Bs 190 (1 usuario) cuando **3 prospectos digan que no explícitamente por el precio de 320**, no antes. Mientras tanto, Básico solo cierra si es **100% self-serve con cero minutos humanos**: con 2-4 h de onboarding a Bs 100/h, el primer mes de Básico ya está en pérdida.

---

## 4. Lo que hay que construir SÍ o SÍ antes de cobrar

Ordenado por lo que desbloquea, con tamaño real.

| # | Qué | Por qué es bloqueante | Tamaño |
|---|---|---|---|
| 1 | **Columna de precio por organización** (`contractedAmount` + `priceLockedUntil`) leída en `lib/subscription-payment-validation.ts` | Hoy el validador rechaza cualquier monto que no sea el del catálogo global, con tolerancia de **Bs 0,01**. El cliente fundador con precio congelado en 320, el día que la lista suba a 390, recibe **400 "Monto invalido para basic/monthly"**: no puede pagar. El grandfathering de 12 meses es **incobrable por diseño** | 1 migración + 1 lectura. **Medio día** |
| 2 | **Columna `whatsappTier`** (N1/N2/N3) en `Organization` | `whatsappAddon` es un **Boolean**. La base no distingue un add-on de Bs 200 de uno de Bs 900. Sin esa columna, la escalera de tres niveles ya publicada es infacturable por nivel | 1 migración + el toggle del admin. **Medio día** |
| 3 | **Encender los agentes en producción** | `/api/cron/onia-agents` **no está en `vercel.json`** (solo hay 3 crons) y `AGENTS_RUNTIME` está vacío en todos los `.env`. **Se está vendiendo Pro por una capacidad que ningún reloj dispara** | 1 línea + 1 env var + verificar en prod. **Horas** |
| 4 | **Bajar el CSV oficial de Meta** + escribir la regla de categorización de plantillas | Es el **60-80% del COGS** del add-on estrella y define un factor 6,5x de margen | **1 hora** |
| 5 | **Cobro de add-ons** | `SubscriptionPayment.plan` solo acepta planes: **ningún add-on puede generar un pago**. Hoy son booleans que un SUPERADMIN prende, sin vencimiento, sin renovación, sin corte por impago. Con 20 clientes y 2 add-ons promedio son **40 cobros/mes que el sistema no conoce** | **1-2 semanas** |
| 6 | **Confirmar Libélula** (tokenización + recurrente iniciado por el comercio) | Hoy cada activación es un humano aprobando en el panel. 20 clientes con mitad en semanal = **~640 aprobaciones/año**, ~2,5 por día hábil | 1 llamada + integración |
| 7 | **4 contadores, no una moneda** | Con 4 SKUs de consumo (mensaje WA, acción de agente, minuto de voz, factura) no hace falta un ledger de créditos: hacen falta 4 números y un tope. Y el comprador boliviano entiende "1.500 mensajes incluidos", no "3.000 créditos" | Medir es lo que no se puede retrofitear. **Empezar por el contador de mensajes WA** |

**Lo que NO hay que construir ahora:** la capa 3 completa (6 medidores repartidos en 3 repos + saldo + tope + aviso). La estimación de "1-2 semanas" del doc alcanza para **un** medidor en **un** repo.

**Fuera del pricing pero sobre la misma caja (una línea):** el break-even está en **12-16 clientes** y el runway muere ~octubre-2026; 13 clientes cerrando 2/mes es marzo-2027, ~5 meses de brecha. Cancelar Higgsfield (Bs 1.443/mes, con el motor de video ya migrado a HyperFrames a costo ~0) y bajar Claude Max a Pro (Bs 1.998) libera **Bs 3.441/mes = la contribución de 12 clientes Básico**, hoy, sin vender nada ni tocar un precio.

---

## 5. Lo que hay que sacar de la venta HOY porque no existe

| Se vendía | Estado real |
|---|---|
| **Sucursales** (4 celdas + add-on Bs 350/mes) | Cero `branchId` en el schema. Una 2ª sucursal = otra suscripción de Bs 1.500 sin consolidación |
| **Bolsa de créditos** (0/3.000/10.000/30.000) + rate card de créditos | Cero ledger, cero saldo, cero tope. Lo único que mide algo es un `COUNT` contra 200 msg/mes |
| **"Grupo `[NUEVO]`" 2.900** | No es nuevo: es `enterprise`, shippeado el 2026-07-09, **fuera del checkout**, con `setupFrom: 3500` |
| **Usuarios 3 / 8 / 20** | El código enforcea **2 / 5 / ilimitado**. Publicar 20 en Full además es un *takeaway* sobre lo ya shippeado |
| **"Facturación SIAT incluida en TODOS los planes"** | `SIAT_EMISSION` apagado, emisor **mock** sin `SIAT_SERVICE_URL`, homologación abierta. Es la única línea marcada como incluida en Básico y la que menos existe |
| **Chatbot Bs 350/mes + 1.000 instalación** | Retirado el 2026-07-09. Vigente: N1 200 / N2 550 / N3 900 |
| **Onia Privado Bs 450/mes** (y los Bs 35.000 del escenario B) | Ya hay publicado en el panel: **4.500 setup + 900/mes**. Tres precios para la misma promesa |
| **Cuidado Web Bs 250/mes** | No vive en este producto (es web-factory). Vendible como servicio, pero el panel no puede activarlo, medirlo ni cortarlo |
| **Reservas online Bs 120** | El precio shippeado es **150**, y está **incluida** desde Pro |

---

## 6. Fuentes nuevas (todas accedidas 2026-08-08)

**Competencia local boliviana con precio publicado (corrige el benchmark previo):**
- [Growing Cloud — Bs 100/200/300/450, usuarios ilimitados, SIAT, 2 meses gratis anual](https://growingcloud.net/sistema-de-facturacion-computarizada-electronica-en-linea-cochabamba/)
- [YoFacturo Bolivia — USD 12/30/45/90, **SIAT en lista de espera** (no es ancla de SIAT hoy)](https://yo-facturo.com/bo/)
- [Sintic MonoBusiness 2.0 — Bs 150/200/400 o compra única del sistema](https://sinticbolivia.net/productos/monobusiness-2-0/)
- [AgendaPro Bolivia — USD 49/79/129](https://agendapro.co/bo/planes)
- [Turnito (.bo) — plan gratis: 3 agendas, 100 reservas/mes, recordatorios WhatsApp](https://turnito.app/)
- [Citalo (/bo) — plan gratis con ficha clínica y recordatorios](https://www.citalo.app/bo/software-turnos-odontologos)
- [SIN — Portal Web en Línea, facturación fiscal gratis](https://siatinfo.impuestos.gob.bo/index.php/informacion/modalidades-facturacion/facturacion-portal-web)
- [ADSIB — certificado Bs 70 + token Bs 175](https://facturacion.firmadigital.bo/)

**WhatsApp / Meta:**
- † [flowcall — rate card 1-jul-2026: "Rest of Latin America" marketing 0,074 · utility 0,0113](https://www.flowcall.co/blog/whatsapp-business-api-pricing)
- [Meta — WhatsApp Business Platform Pricing (rate cards oficiales, descargables; bajar el CSV antes de publicar)](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing)

**Contexto boliviano:**
- [SEPREC — base empresarial sept-2025: 77,6% empresas unipersonales](https://www.seprec.gob.bo/wp-content/uploads/2025/11/Informacion-ESTADISTICA-WEB-SEP.pdf)
- [YoFacturo — RTS 2026: límites Bs 18.800 de capital / Bs 69.122 de ventas anuales](https://yo-facturo.com/blog/regimen-tributario-simplificado-rts-bolivia-2026/)
- [Ferrere — salario mínimo 2026 Bs 3.300 (DS 5516)](https://www.ferrere.com/es/novedades/salario-minimo-nacional-2026-disposiciones-y-aplicacion/)
- [Los Odontólogos — precios de referencia Santa Cruz](https://losodontologos.com/bolivia/precios-santa-cruz/)

**Código verificado (repo `C:\dev\proyectos\onia-platform`, rama `master`, tip `6b8f152`, solo lectura):**
- `lib/subscription-plans.ts` — `DEFAULT_PLAN_AMOUNTS` 320/750/1.500/2.900, semanal 89/199, anual x10; `CHECKOUT_PLANS` excluye `enterprise`
- `lib/plan-limits.ts` — usuarios 2/5/-1/-1; pacientes 300/1.500/-1; `agentsIncluded` desde `professional`; `checkWhatsAppAddon` sin condición de plan
- `lib/pricing.ts` — chatbot N1/N2/N3 200/550/900; usuario extra 70; reservas 150; inventario 180; instancia privada 4.500 + 900
- `lib/subscription-payment-validation.ts` — rechaza montos fuera del catálogo con tolerancia Bs 0,01
- `prisma/schema.prisma` — sin `branchId`, sin ledger de créditos, `whatsappAddon` es Boolean
- `vercel.json` — 3 crons, ninguno es `onia-agents`
- Grep: **cero ocurrencias de `business-tiers`** en todo `onia-platform`
- `onia-core/business-tiers.json` — `invoicing` y `unlockedExternalGates` solo en el tier `empresa`
- `web-factory/apps/site/src/app/vendedores/cotizador-data.ts` — escalera Comercio 350/530/800/1.250, usuario extra 70
