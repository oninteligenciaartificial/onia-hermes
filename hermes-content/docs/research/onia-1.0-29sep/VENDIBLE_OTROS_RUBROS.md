# Onia fuera de dental: ¿es vendible y funcional en los otros rubros?

Para Sergio Urcullo. 29-sep-2026. Solo lectura y fuentes públicas: no creé ninguna cuenta y no gasté nada.
Complementa `VENDIBLE_VS_COMPETENCIA.md` (dental) y usa las mismas marcas: **[V]** verificado en el código o en la fuente citada, **[I]** inferido, **[D]** cuenta propia hecha con esos datos.
Producción = `origin/master` c3b92067. Candidato = `codex/v1-integracion-20260927` 637ceca3 (79 commits por delante). **SIN PUBLICAR** = está en el candidato y no en producción.

**Lo que dice el diff, en una línea [V]:** las pantallas de comercio (`app/(dashboard)/comercio/**`, `lib/comercio/**`) y de importadora (`app/(dashboard)/importadora/**`, `lib/importadora/**`) son **idénticas** en producción y en el candidato. El candidato solo les suma agentes (Reprogramador, Tratamiento a medias), el panel "Lo que te dejó Onia", la plantilla de recordatorio por WhatsApp y `/mi-web`.

---

## 1. Veredicto en 7 líneas

1. **Los cuatro rubros funcionan en producción, pero no con la misma profundidad.** Estética es el dental con otros rótulos: completo, salvo paquetes de sesiones. Servicios es agenda + caja + contabilidad. Comercio es caja + kardex + fiado. Importadora es catálogo + un costeo de importación muy bueno + cotizaciones que **no salen del sistema** [V].
2. **El hueco que comparten los cuatro es la factura SIAT** (`SIAT_EMISSION` apagado) [V]. En comercio y servicios decide la venta: los rivales bolivianos que la emiten entran por Bs 167-270 al mes [V][D] (tuGerente ≈ 171; Codex 167; Nitro 150 + 120 del add-on de factura). Es menos que el Básico de Onia (Bs 320), que no factura.
3. **Vendible hoy:** estética = **piloto** (en las mismas condiciones que el dental); importadora = **piloto** con una sola importadora que valore el costeo; comercio = **no**; servicios = **no**.
4. **Promesas rotas en la web:** el titular de estética ("con el control ya en la agenda") depende de un agente **SIN PUBLICAR** que además no agenda. "Proveedores" en importadora es un nombre dentro de una compra. "Cuál se envió" en cotizaciones: el sistema no envía nada.
5. **Donde Onia gana de verdad fuera del dental:** el costeo de importación a la boliviana con alerta de reprecio por devaluación (ningún rival local verificado lo tiene completo), y en todos los rubros, el cobro en Bs + QR + soporte presencial en SCZ.
6. **Segundo rubro: estética,** porque comparte el 100 % de las pantallas y 4 agentes con el dental. Todo el 1.0.1 dental la cierra también, y lo propio que le falta son los paquetes de sesiones (1-2 semanas [I]). **Después, importadora como piloto medido** (la v1.2 de la estrategia). Comercio y servicios, recién cuando SIAT emita.
7. **Otros rubros encendidos en el código y NO ofrecidos:** ganadería (el catálogo de comercio con otro nombre, promete un offline que no existe) y veterinaria (la factura saldría a nombre de la mascota) [V].

---

## 2. Parte A: qué funciona de verdad en cada rubro

Fuente del menú de cada rubro: `lib/platform/vertical-pack.ts` (ELECTRICO_NAV_ITEMS, GESTIOS_NAV_ITEMS, SERVICIOS_NAV_ITEMS, `navClinicaDe` para estética). El gate `lib/platform/route-access.ts` arma la lista blanca **desde ese menú**, así que lo que no está en el menú de un rubro tampoco se abre escribiendo la URL [V].
✔ = sí · parcial = con límite (va en la celda) · ✘ = no. Todo **[V] prod**, salvo lo marcado SIN PUBLICAR.

### 2.1 Pantallas y funciones por rubro

| Capacidad | Comercio / tienda (`gestios-general`) | Importadora (`proveegest-electrico`) | Estética y spa (`esteticagest-clinical`) | Servicios profesionales (`gestios-servicios-profesionales`) |
|---|---|---|---|---|
| **De dónde sale el rubro** | Menú propio bajo `/comercio` | Menú propio: reusa `/comercio` + `/importadora` | **El menú dental entero** con 2 rótulos cambiados ("Clientas", "Tratamientos") | Menú de comercio + la agenda dental + `/patients` |
| Clientes | ✔ `/comercio/clientes`, ordenados por deuda | ✔ `/comercio/clientes` | ✔ `/patients` = "Clientas", con ficha clínica (alergias, alertas) | ✔ `/patients` = "Clientes", **sin** ficha clínica (`fichaClinica()`) |
| Catálogo | ✔ productos con variantes + importar CSV (`/comercio/importar`) | ✔ el mismo + importar | ✔ `/treatments` = "Tratamientos" | ✔ `/comercio` = "Servicios", sin SKU ni stock (`llevaInventario()` = false) |
| Inventario | ✔ kardex, lotes con vencimiento FEFO, varios almacenes y transferencias (`lib/comercio/lots.ts`, `transfers.ts`) | ✔ el mismo | parcial: `/inventory`, el inventario simple del dental | ✘ a propósito (vende horas) |
| Caja / venta | ✔ carrito, corte de caja, recibo **no fiscal** (`lib/comercio/recibo.ts`). El método de pago (efectivo, tarjeta, transferencia, QR) **se anota**: no hay cobro integrado [I] | ✔ la misma caja con el rótulo "Ventas" | ✔ `/billing` "Cobros" + recurrentes + reportes | ✔ caja "Nuevo cobro" |
| Fiado (CxC) / deuda a proveedores (CxP) | ✔ "Fiados": las dos | ✔ "Créditos": las dos | parcial: saldo por cobro en `/billing` [I] | ✔ "Por cobrar" |
| Compras a proveedor | parcial: monto + NIT + factura → crédito fiscal. **No carga stock** (`lib/comercio/compras.ts` no toca el kardex) | igual: no hay orden de compra por producto | ✘ | ✘ |
| Agenda y citas | ✘ | ✘ | ✔ `/agenda`, `/appointments` | ✔ `/agenda`, `/appointments` |
| Reserva pública `/book` | ✘ | ✘ | ✔ desde Crece; Bs 150/mes en Básico | ✔ igual. El profesional es un usuario DOCTOR o ADMIN (`lib/agenda/roles-agenda.ts`) |
| Recordatorio de cita | — | — | ✔ correo 24 h y 2 h antes (cron). Por WhatsApp: plantilla **SIN PUBLICAR** | ✔ igual |
| Cotizaciones B2B | ✘ | parcial: se arman con precios del catálogo y pasan de borrador a enviada, aceptada y pedido. **No salen del sistema**: no hay PDF, correo, WhatsApp ni link; solo se guarda el nombre del cliente (`importadora/cotizaciones/page.tsx:16-20`) | ✘ | ✘ |
| Listas de precio por cliente | ✘ la tabla `OniaCommercePriceList` existe, pero solo se usa "Lista General" [V grep] | ✘ lo mismo | ✘ | ✘ |
| Costeo de importación | ✘ | ✔ landed cost según DS 5646 (valor en aduana, GA por subpartida e IVA de importación como crédito). El TCO del BCB se carga a mano y los gastos del embarque se prorratean por FOB, peso o volumen. Aplica el costo y el precio al catálogo (`lib/importadora/costeo.ts`) | ✘ | ✘ |
| Alerta de reprecio por devaluación | ✘ | ✔ `/importadora/reprecio`, solo lectura | ✘ | ✘ |
| Moneda | Bs | Costeo en USD → Bs. **Ventas y cotizaciones solo en Bs** | Bs | Bs |
| Contabilidad Bolivia (IVA 13 %, IT 3 %, RCV, vencimientos por NIT) + planilla + gastos | ✔ transversal | ✔ | ✔ | ✔ |
| Factura SIAT | ✘ `SIAT_EMISSION` apagado (`lib/fiscal/flags.ts`) | ✘ | ✘ | ✘ |
| Bot de WhatsApp (add-on Bs 390) | parcial: lee **su** catálogo (`lib/whatsapp/catalogo-del-negocio.ts`) y no ofrece citas; sigue un guion | parcial: igual | parcial: igual que el dental | parcial: igual |
| Pedir documentos al cliente (`/requerimientos`, con portal) | ✔ | ✔ | ✔ | ✔ (el que más lo usa: el contador que pide papeles) |
| Documentos y notas internas en la ficha del cliente | ✘ la ficha de comercio es otra pantalla | ✘ | ✔ imagen o PDF: consentimiento, presupuesto firmado, comprobante (`components/patients/PatientCollab.tsx`) | ✔ la misma: es lo más parecido a un expediente |
| Reportes `/reports` y cobros recurrentes | ✘ el rubro no los declara | ✘ | ✔ | ✘: **sin igualas mensuales** |
| Cuenta de prueba con datos de ejemplo | ✔ seeder de ferretería | ✔ seeder de importadora | ✘ **nace vacía** | ✘ **nace vacía** (`lib/platform/demo-provisioning.ts`) |
| "Lo que te dejó Onia" (plata recuperada) | **SIN PUBLICAR** | **SIN PUBLICAR** | **SIN PUBLICAR** | **SIN PUBLICAR** |
| Lo que **no** tiene ese rubro y el rival sí | lector de código de barras (no hay campo) [I], POS offline, multi-sucursal (ONIA_CATALOGO_DE_VENTA §7) | enviar la cotización, precio por cliente, orden de compra, multimoneda en la venta | paquetes, bonos y sesiones prepagadas; cabinas; comisión por profesional (grep sin resultados: las "comisiones" de `/empresa` son a colaboradores por resultado, otra cosa). Las fotos se pueden adjuntar sueltas, pero no hay un antes/después | casos con estado (hay documentos y notas por cliente, no un expediente), horas facturables, igualas recurrentes |

### 2.2 Agentes que corren en cada rubro

Fuente: `lib/onia-core/modules/agents-por-rubro.ts` (`rolCorreEnTrack`), `agents-runtime.ts` (AGENT_KINDS). Se encienden desde el plan **Crece (Bs 550)**. Todos proponen y un humano aprueba en `/pending`. Si se aprueba con "Enviar yo mismo", el sistema arma un link `wa.me` que la persona tiene que tocar (`agents-envio-humano.ts`) [V].

| Agente (rol) | Qué lee | Comercio | Importadora | Estética | Servicios | Estado |
|---|---|---|---|---|---|---|
| Recall: el que no volvió en 180 días | `patient` + citas | ✘ | ✘ | ✔ | ✔ | prod |
| Tratamiento a medias (va dentro del Recall) | tratamiento EN_PROGRESO y 21 días sin venir | ✘ | ✘ | ✔ | ✘ | **SIN PUBLICAR** |
| Cobrador ("Recuerda cobros") | facturas; en comercio e importadora, fiados | ✔ | ✔ | ✔ | ✔ | prod |
| Reponedor ("Avisa stock bajo") | stock bajo el punto de reorden | ✔ | ✔ | ✘ | ✘ | prod |
| Confirmador | citas de mañana | ✘ | ✘ | ✔ | ✔ | prod |
| Seguidor de cotizaciones | enviadas hace más de 3 días | ✘ | ✔ **pero sin teléfono**: la cotización solo guarda el nombre y el agente busca `phone` en el cliente (`agents-runtime.ts:801`) | ✘ | ✘ | prod |
| Reprogramador | faltas y turnos liberados | ✘ | ✘ | ✔ | ✔ | **SIN PUBLICAR** |
| Captador (add-on) | leads del intake | ✔ | ✔ | ✔ | ✔ | prod, sin encender en ninguna org (CATALOGO §7) |

**Cuenta [D]:** de los 6 roles que enciende el plan, estética y servicios corren 4 (estética suma además el Tratamiento a medias), importadora 3 y comercio 2. **Comercio no tiene ningún agente que traiga una venta**: el Cobrador cobra lo que ya se vendió y el Reponedor avisa stock. En importadora, el único que persigue una venta (el Seguidor) no tiene a quién escribirle.

### 2.3 Lo que la venta promete y el rubro no cumple

| # | Dónde | Qué promete | Qué hay de verdad | Gravedad |
|---|---|---|---|---|
| 1 | Portada, conmutador de Estética (`web-factory/.../(sitio)/switcher.tsx`) | «La clienta que dejó el tratamiento a medias y no volvió, con el control ya en la agenda.» | El agente Tratamiento a medias está **SIN PUBLICAR**. Además, aun publicado, **no agenda**: propone un mensaje con el link de `/book` (`conEnlaceDeAgenda`) y la clienta tiene que reservar sola | **Alta**: es el titular del rubro |
| 2 | `/rubros`, Importadora | «Depósito, lotes, proveedores y costos de importación» | "Proveedores" es un nombre y un NIT dentro de una compra a crédito: no hay ficha de proveedor ni orden de compra, y la compra no carga stock | Media |
| 3 | Portada, conmutador de Importadora | «cuál se aprobó, cuál se envió y cuál espera respuesta» | "Enviada" la marca el dueño a mano: el sistema no envía nada. El producto ya lo dice honestamente ("Enviada por vos") y la web no | Media |
| 4 | `/rubros`, Servicios | «Llegás al cierre de mes con el IVA y el IT ya armados» | Es cierto **solo** para lo que se cobra por la caja de Onia. Sin SIAT, la factura se emite en otro lado y no entra sola a la contabilidad [I] | Media |
| 5 | Web en general + tarjeta de `/register` | Estética "Agenda, clientas, tratamientos y caja" | Es el sistema dental con otros rótulos. Faltan los paquetes de sesiones, la pieza más cobrada en estética [I, se confirma en la Parte B] | Media: no es falso, pero se nota en la demo |
| 6 | Cuenta de prueba de estética y de servicios | "Probá 14 días" | La cuenta nace vacía, sin un solo dato de ejemplo, mientras que comercio e importadora traen datos | Baja-media: pesa en la primera impresión |

**Lo que se promete bien [V]:** la tarjeta de plan de producción le dice "Agente Cobrador" a comercio (vende de menos, no de más), y el candidato ya deriva la lista de agentes por rubro (`bulletDeAgentes`). La agenda pública se vende "en rubros con agenda". El bot ya no le ofrece citas a una ferretería.

### 2.4 Rubros encendidos en el código que NO se venden

| Rubro | Estado [V] | Por qué no se vende |
|---|---|---|
| Ganadería (`ganadero-offline`) | Pack encendido: las organizaciones que ya existen siguen andando | Es el catálogo de comercio con otro nombre. No hay hacienda ni sanidad, y el nombre promete un modo offline que no existe (`rubros-activos.ts`, CATALOGO §2) |
| Veterinaria (`vetgest-clinical`) | Pack encendido, fuera del alta desde el 13-ago | `Invoice.patientId` es obligatorio: la factura saldría a nombre de la mascota y no del dueño |
| Onia interna (`onia-interna`) | Pack propio | Es la operación de Onia, no un producto |

---

## 3. Parte B: la competencia de cada rubro

Precios de Onia: Bs 320 / 550 / 890 / 1.290 al mes **por negocio** (Básico / Crece / Profesional / Completo), según `lib/subscription-plans.ts`. En dólares son ≈ USD 28 / 48 / 78 / 113 al tipo de cambio de referencia 11,37 de `lib/pricing.ts` [D].
**Descartados por no vender en Bolivia [V]:** Alegra (su selector de país no incluye Bolivia) [AL1], Bsale (solo Chile, México y Perú) [BS1] y YoFacturo (Bolivia "en lista de espera") [YF1]. Los tres estaban en la lista pedida; en su lugar entran rivales bolivianos.

### 3.1 Comercio / tienda

| Capacidad | Onia | Loyverse | Kyte | Odoo POS | tuGerente (SCZ) | Kraken (BO) |
|---|---|---|---|---|---|---|
| Precio público | ✔ Bs 320-1.290 por negocio [O1] | ✔ USD 0; add-ons de inventario avanzado USD 25/mes por tienda y de empleados USD 5 por empleado [LV1] | ✔ USD 0 / 9,99 / 13,99 / 19,99 [KY1] | ✔ USD 0 con 1 sola app; Standard USD 7,25-11,20 por usuario [OD1] | ✔ Bs 514 / 1.315 / 1.842 por trimestre (≈ Bs 171 / 438 / 614 al mes), usuarios ilimitados [TG1] | parcial: "empezás sin costo" y "6 meses sin costo", sin tabla de precios [KR1 I][KR2 I] |
| Cobro en Bs / QR | ✔ Bs + QR del BCP para pagar Onia [O9]. En la caja, el QR solo se anota como método [O11] | ✘ USD [I] | ? [KY1] | ✘ USD [I] | ✔ Bs [TG1] | parcial: QR validado en tiempo real [KR1 I] |
| Factura SIAT | ✘ [O8] | ✘ [I] | ✘ [I] | parcial: solo con módulo de partner (Sintic, Onixia, Kyohei) [SI1][ON1][KH1] | ✔ en integraciones [TG2] | ✔ en línea y offline [KR1 I] |
| WhatsApp | parcial: bot add-on Bs 390 que lee el catálogo; el recibo no se manda por WhatsApp [O12] | ✘ recibo por email [LV3] | ✔ comprobante y venta por WhatsApp [KY1] | ✔ app oficial: PDF, factura y recibo [OD3] | parcial: "WhatsApp Business" en la lista de integraciones [TG2] | ? |
| Inventario / caja | ✔ kardex, lotes FEFO, multialmacén, corte de caja [O11] | ✔ multitienda; lo avanzado es pago [LV2] | parcial: inventario desde GROW [KY1] | ✔ [I] | ✔ por almacén o sucursal [TG2] | ✔ kardex, turnos de caja [KR1 I] |
| Fiado (CxC) | ✔ con ficha del deudor [O11] | ? | ? | ✔ [I] | ? | ? |
| Precio por cliente | ✘ [O11] | ✘ [LV5] | ? | ✔ listas de precio [I] | ✔ [TG5 I] | ✔ multiprecios [KR1 I] |
| App / offline | parcial: PWA, sin offline [O9] | ✔ offline [LV3] | ✔ multiplataforma [KY2] | ✔ offline con Kyohei [KH1] | ✔ app de ventas [TG2] | ✔ facturación offline [KR1 I] |
| Contabilidad IVA/IT | ✔ [O13] | ✘ | ✘ | ✔ con localización [I] | ? | ? |
| Prueba gratis | ✔ 14 días en `/register`, con datos de ejemplo [O10] | ✔ gratis para siempre, sin tarjeta [LV1] | ✔ 7 días sin tarjeta [KY1] | ✔ sin tarjeta [OD5] | ✘ solo demo agendada [TG2] | ✔ [KR1 I] |
| Presencia en Bolivia | ✔ SCZ, Sergio Urcullo | ✘ global [LV4] | ? | ✔ 19 partners, 1 Gold [OD4] | ✔ SCZ, "+1.000 empresas" [TG3][TG4 I] | ✔ "soporte local" [KR1 I] |
| Rating | ✘ 0 clientes | 4,8 (458 reseñas) [LV5] | ? | 4,2 (1.332 reseñas) [OD6] | ? | ? |

### 3.2 Importadora / distribuidora

| Capacidad | Onia | Odoo (Inventario + Compras + Ventas) | Zoho Inventory | tuGerente | Nitro Pro (BO) | Sintic MonoBusiness (La Paz) |
|---|---|---|---|---|---|---|
| Precio público | ✔ Bs 320-1.290 [O1] | ✔ USD 7,25-11,20 por usuario; Custom 13,40-20,40 [OD1] | ✔ Free (50 pedidos); USD 29 / 79 al mes por organización [ZI1] | ✔ ≈ Bs 171-614/mes [TG1] | ✔ Bs 150 (Negocio) / 400 (Profesional) al mes [NI1] | ✔ Bs 150 / 200 / 400 al mes [SM1] |
| Cobro en Bs / QR | ✔ [O1][O9] | ✘ USD [I] | ✘ USD [I] | ✔ Bs [TG1] | ✔ Bs; QR API como add-on de Bs 100 [NI1] | ✔ Bs [SM1] |
| Factura SIAT | ✘ [O8] | parcial: partner y plan Custom [OD1][SI1 I] | ✘ [I] | ✔ [TG2] | ✔ "conectada al SIN" [NI1] | ✔ SFV y SIAT v2 [SM1] |
| Costeo de importación | ✔ DS 5646, GA, IVA de importación como crédito, TCO del BCB, reparto por FOB, peso o volumen, alerta de reprecio [O14] | ✔ 5 métodos de reparto; exige FIFO o AVCO [OD2] | parcial: reparto por valor o cantidad [ZI3] | ? | parcial: "costo landed + DIM" en su blog; carga masiva de DIM [NI1][NI2] | ✘ [SM1] |
| Cotizaciones B2B | parcial: **no se envían** (sin PDF ni WhatsApp) [O15] | ✔ + PDF por WhatsApp [OD3] | ✔ [ZI2] | ✔ [TG5 I] | ? [NI1] | ✔ generador desde Business [SM1] |
| Listas de precio por cliente | ✘ [O11] | ✔ [I] | ✔ [ZI4] | ✔ [TG5 I] | ? | ? |
| Multialmacén / lotes | ✔ [O11] | ✔ [I] | ✔ 2-10 ubicaciones según plan [ZI1] | ✔ [TG2] | ? | ✔ desde Business [SM1] |
| Multimoneda en la venta | ✘ solo Bs [O15] | ✔ [I] | parcial: solo Enterprise [ZI1] | ? | ? | ? |
| WhatsApp | parcial: bot add-on [O12] | ✔ [OD3] | ✔ "WhatsApp Commerce" desde Premium [ZI2] | parcial: integración listada [TG2] | parcial: "Walter", IA por WhatsApp que se vende como producto aparte (soywalter.com) [NI1] | ✘ [SM1] |
| Contabilidad IVA/IT | ✔ [O13] | ✔ con localización [I] | ✘ | ? | ✔ es su origen [NI1] | ? |
| Prueba gratis | ✔ 14 días, con datos de importadora [O10] | ✔ sin tarjeta, ~14-15 días [OD5][OD7 I] | ✔ 14 días + plan Free [ZI5] | ✘ solo demo [TG2] | parcial: demo con credenciales compartidas [NI1] | parcial: demo con credenciales [SM1] |
| Rating | ✘ 0 clientes | 4,2 (1.332) [OD6] | 4,5 (422) [ZI6] | ? | ? | ? |

**Lectura de comercio e importadora**
- **Globales baratos (Loyverse, Kyte, Zoho):** son gratis o cuestan menos de USD 30 y no tienen SIAT. Los **locales** (tuGerente, Kraken, Nitro, Sintic) tienen SIAT y cobran Bs 150-614/mes. **Onia queda arriba en precio (Bs 320-1.290) y abajo en lo que el comerciante mira primero: la factura** [D].
- **Cuánto pesa no tener SIAT [V RTS1][I RTS2][D]:** el comercio que no necesita facturar es el del Régimen Simplificado: capital de hasta Bs 60.000 y ventas de hasta Bs 184.000 al año, o sea hasta ≈ Bs 15.300 al mes. Para él, Onia Básico (Bs 320) es **≥ 2,1 % de todo lo que vende**, contra Loyverse gratis. El comercio del Régimen General sí necesita la factura, y Onia no la emite. Ninguno de los dos segmentos es cómodo hoy.
- **Rival más peligroso en comercio: tuGerente.** Está en SCZ, cobra en Bs, tiene usuarios ilimitados desde ≈ Bs 171/mes y trae SIAT [TG1][TG2]. Kraken ofrece "6 meses sin costo" con SIAT offline [KR2 I].
- **Importadora: el costeo de Onia es de verdad lo mejor del rubro.** DS 5646, GA por subpartida, IVA de importación como crédito, TCO y alerta de reprecio por devaluación [O14]. Ningún rival local verificado lo iguala: Nitro lo nombra en un blog y Sintic no lo tiene. Odoo lo tiene genérico (5 métodos de reparto), sin la aritmética boliviana ni SIAT nativo [OD2].
- **Rival más peligroso en importadora:** para las PYMES, **Nitro Pro** (Bs 400/mes con SIAT, POS e inventario; su bot "Walter" es un producto aparte) [NI1]. Para las medianas, **Odoo a través de partners locales** [OD4].
- **El hueco que Onia sí puede ocupar [D]:** "costeo boliviano + reprecio por devaluación + cotización que sale por WhatsApp + agente que la persigue", en Bs y con soporte en SCZ. Hoy Onia tiene la primera mitad; a la segunda le faltan el envío de la cotización y el teléfono del cliente.

### 3.3 Estética y spa

**Advertencias:**
- Fresha mostró precios en **BOB** a una conexión desde Bolivia: es precio por país y conviene confirmarlo con un navegador.
- AgendaPro publica tres listas de precios distintas. Uso la oficial vigente [AP1]; la de Bolivia es una página vieja [AP8].
- Reservo no publica precios.

| Capacidad | Onia | AgendaPro | Fresha | Booksy | Reservo | Citalo |
|---|---|---|---|---|---|---|
| Precio público | ✔ Bs 320-1.290 por negocio [O1] | ✔ USD 9 / 29 / 59 / 199, que sube según profesionales [AP1] | ✔ BOB 39,95 (1 persona) o BOB 26,95 por miembro [FR1] | ✔ USD 29,99 + USD 20 por miembro [BK1] | ✘ a cotizar [RS1] | ✔ USD 0 / 14,99 / 29,99 / 59,99 / 119,99 por negocio [CT1] |
| Bs / QR / Bolivia | ✔ Bs + QR del BCP [O1][O9] | ✘ USD; hay un cliente en SCZ [AP1][AP6] | parcial: precios en BOB, 29 locales de SCZ en su marketplace [FR1][FR4] | ✘ no opera en Bolivia [BK3 I] | parcial: Bolivia entre sus 12 países [RS1] | parcial: página /bo, suscripción en USD [CT1][CT2] |
| Factura SIAT | ✘ [O8] | ✘ "Próximamente" [AP1] | ✘ [I] | ✘ [I] | ✘ boleta de Chile [RS1] | ✘ [CT2] |
| Recordatorio por WhatsApp | parcial: el correo sale solo; por WhatsApp, con aprobación o con plantilla **SIN PUBLICAR** [O19] | ✔ + add-on desde USD 7 por 50 mensajes; IA "Charly" desde USD 55 [AP1][AP2] | ✔ 20 gratis por miembro, luego BOB 0,55-2 cada uno [FR1] | ✘ solo SMS y email [BK1] | parcial [RS4 I] | ✔ de 0 a 1.000 mensajes según plan [CT1] |
| Reserva online | ✔ `/book` [O16] | ✔ [AP9] | ✔ sin comisión [FR1] | parcial: la clienta tiene que bajar la app [BK4] | ✔ [RS1] | ✔ [CT2] |
| Caja / inventario / comisiones | parcial: caja e inventario simple; **sin comisión por profesional** [O18] | ✔ desde Básico [AP2] | ✔ [FR1][FR3] | ✔ [BK2] | parcial: comisiones y caja; inventario ? [RS2] | ✔ [CT2] |
| **Paquetes / bonos / sesiones** | ✘ [O18] | ✔ [AP2] | ✔ paquetes y membresías [FR1] | ✔ [BK2] | ✔ "cuántas sesiones le quedan" + gift cards [RS2] | ✘ no lo describe [CT3] |
| Fotos de antes y después | parcial: imágenes sueltas en la ficha [O18] | parcial: ficha con fotos en Premium [AP2][AP7 I] | ✘ [FR6 I] | ✘ solo portfolio público [BK2] | ? | ? |
| Reactivar a la clienta que dejó el tratamiento | parcial: agente que propone, **SIN PUBLICAR** [O17] | parcial: Charly [AP1] | ? | ? | ? | ? |
| App móvil | parcial: PWA [O9] | ✔ negocio y clienta [AP8] | ✔ [FR1] | ✔ [BK2] | ✘ [RS2] | ✘ [CT3] |
| Prueba gratis | ✔ 14 días, pero la cuenta **nace vacía** [O10] | ✔ 7 días sin tarjeta [AP3][AP4] | ✔ 7 días [FR2] | ✔ 14 días sin tarjeta [BK1] | ✘ solo demo [RS2] | ✔ gratis para siempre [CT1] |
| Soporte presencial en SCZ | ✔ | ✘ [I] | ✘ [I] | ✘ | ✘ [I] | ✘ soporte con número +598 [CT3 I] |
| Rating | ✘ 0 clientes | 4,8 (158) [AP5] | 4,8 (1.447) [FR5] | 4,4 (482) [BK4] | 4,8 (60) [RS3] | ? |

### 3.4 Servicios profesionales

| Capacidad | Onia | AgendaPro | Calendly | Nitro Pro (BO) | Codex de Sinergya (BO) |
|---|---|---|---|---|---|
| Precio público | ✔ Bs 320-1.290 [O1] | ✔ USD 9-199 [AP1] | ✔ USD 0 / 10 / 16 por asiento [CL1] | ✔ Bs 150 / 400 al mes [NI1] | ✔ Bs 167 / 208 al mes [CX1] |
| Bs / QR | ✔ [O1][O9] | ✘ USD [AP1] | ✘ cobra con Stripe o PayPal, y Stripe no acepta Bolivia [CL1][ST1] | ✔ + QR como add-on de Bs 100 [NI1] | ✔ genera QR [CX1] |
| Factura SIAT | ✘ [O8] | ✘ [I] | ✘ [I] | ✔ [NI1] | ✔ con modo contingencia [CX1] |
| Agenda online | ✔ `/book` + agenda por profesional [O16] | ✔ [AP9] | ✔ su núcleo [CL1] | ✘ [NI1] | ✘ [I] |
| Recordatorio / WhatsApp | parcial: correo; bot add-on [O12][O19] | ✔ [AP1] | parcial: por Zapier [CL4 I] | parcial: "Walter", producto aparte [NI1] | parcial: manda la factura por WhatsApp en Plus [CX1] |
| Cobros / caja | ✔ caja + por cobrar [O11] | ✔ [AP2] | parcial: con Stripe [CL1] | ✔ POS + conciliación [NI1] | ✔ [CX1] |
| Contabilidad Bolivia | ✔ IVA/IT, RCV, planilla [O13] | ✘ | ✘ | ✔ libro diario, estados financieros, LCV [NI1] | parcial: "módulo de contabilidad" [CX1] |
| Expediente / documentos por cliente | parcial: documentos y notas por cliente + pedido de papeles con portal [O20] | parcial: ficha clínica [AP2] | ✘ | ✘ [NI1] | ✘ [I] |
| Igualas mensuales recurrentes | ✘ el rubro no tiene `/billing/recurring` [O20] | ? | ✘ [I] | ? | ? |
| App móvil | parcial: PWA [O9] | ✔ [AP8] | ✔ [CL1] | parcial: navegador [NI1] | parcial: navegador [CX1] |
| Prueba gratis | ✔ 14 días, **cuenta vacía** [O10] | ✔ 7 días [AP4] | ✔ Free + 14 días de Teams [CL1][CL2 I] | parcial: demo pública con credenciales compartidas [NI1] | ✘ demo con ventas [CX1] |
| Rating | ✘ 0 | 4,8 (158) [AP5] | 4,7 (4.161) [CL3] | ? | ? |

Otros bolivianos que aparecieron: **Emizor** (facturación certificada, oficina en SCZ, sin precios públicos) [EM1] y **Xmart Cloud** (API para desarrolladores: USD 89,99 de integración + USD 34,99/mes) [XM1].

**Lectura de estética y servicios**
- **Estética:** nadie junta en Bs y con soporte en SCZ las piezas del rubro (paquetes de sesiones, fotos, WhatsApp con cupo holgado, SIAT) [investigación].
  - **Más peligroso por precio: Fresha.** Un spa de 4 personas paga ≈ BOB 108/mes (4 × 26,95), contra Bs 320-550 de Onia [D].
  - **Más peligroso por funciones: AgendaPro.** Tiene paquetes, ficha con fotos e IA por WhatsApp, y un cliente en SCZ. Su Básico (USD 29 ≈ Bs 330) cuesta lo mismo que el Básico de Onia [D].
  - **Onia pierde en la pieza que más se cobra en estética: el paquete de sesiones.** Los 4 rivales con ficha pública lo tienen [AP2][FR1][BK2][RS2].
- **Servicios:** nadie une agenda, cobro, contabilidad y SIAT en Bs. Onia tiene 3 de las 4; la que falta es SIAT.
  - Los rivales de agenda (Calendly, AgendaPro) no facturan ni llevan libros. Calendly ni siquiera cobra desde Bolivia.
  - Los bolivianos (Nitro, Codex) facturan y contabilizan, pero no agendan.
  - **Más peligroso: Nitro Pro.** Entra por Bs 150, trae SIAT y QR, y tiene llegada a contadores por el blog Bolivia Impuestos [NI1][NI3 I]. Si le suma agenda, cierra el hueco.

### 3.5 Fuentes de la Parte B

**Código de Onia** (candidato `C:/dev/proyectos/onia-platform-v1-integracion-20260927`; todo está también en `origin/master` salvo lo marcado)

| Código | Fuente |
|---|---|
| O1 | `lib/subscription-plans.ts` (DEFAULT_PLAN_AMOUNTS), `lib/pricing.ts` (PLAN_LABELS, TIPO_CAMBIO_REFERENCIA 11,37), `lib/plan-catalogo.ts` |
| O8 | `lib/fiscal/flags.ts` (`SIAT_EMISSION === "1"`); ONIA_CATALOGO_DE_VENTA §7 |
| O9 | `public/manifest.json` (PWA); QR del BCP para cobrar el plan (memoria `decisiones-sergio-25-sep-qr-icono-destrabe.md`); memoria `cuentas-plataforma-todas-de-prueba.md` (0 clientes) |
| O10 | `app.onia.com.bo/register`, `lib/platform/demo-provisioning.ts` (seed null en estética y servicios) |
| O11 | `lib/comercio/caja.ts` (CAJA_PAYMENT_METHODS), `lots.ts`, `transfers.ts`, `compras.ts` (sin kardex), `onboarding.ts` (solo "Lista General"), `recibo.ts` |
| O12 | `lib/whatsapp/catalogo-del-negocio.ts`, `lib/pricing.ts` (add-on Bs 390); grep `wa.me` en comercio sin resultados |
| O13 | `lib/platform/route-access.ts` (COMMON_SEGMENTS: contabilidad, rrhh, empresa) |
| O14 | `lib/importadora/costeo.ts`, `reprecio.ts`, `lib/onia-core/modules/imports-logic.ts` |
| O15 | `app/(dashboard)/importadora/cotizaciones/page.tsx:16-20`, `AccionesCotizacion.tsx:7-15`, `lib/importadora/cotizaciones.ts` |
| O16 | `app/(public)/book/[orgSlug]`, `app/api/booking/doctors/route.ts`, `lib/agenda/roles-agenda.ts` |
| O17 | `lib/onia-core/modules/agents-por-rubro.ts`, `agents-runtime.ts`; `agents-tratamiento-a-medias.ts` y `agents-reprogramador.ts` **solo en el candidato** |
| O18 | `lib/platform/vertical-pack.ts` (`navClinicaDe`), `components/patients/PatientCollab.tsx` (acepta jpeg/png/webp/pdf); grep de bono/paquete/cabina/sesiones sin resultados de producto |
| O19 | ONIA_CATALOGO_DE_VENTA §5 (cron de correo 24 h y 2 h); `lib/whatsapp/plantilla-recordatorio.ts` **solo en el candidato** |
| O20 | `vertical-pack.ts` SERVICIOS_NAV_ITEMS (sin `/billing/recurring` ni `/reports`; comentario de `entregaLaPantalla`), `PatientCollab.tsx`, `app/(dashboard)/requerimientos` |

**Competencia**

| Código | URL |
|---|---|
| AL1 | https://www.alegra.com/ y https://www.alegra.com/bolivia/ (Bolivia no está en el selector de país) |
| BS1 | https://www.bsale.com/ |
| YF1 | https://yo-facturo.com/bo/ |
| LV1 | https://loyverse.com/pricing |
| LV2 | https://loyverse.com/advanced-inventory |
| LV3 | https://help.loyverse.com/help/offline-work-of-pos |
| LV4 | https://loyverse.com/ |
| LV5 | https://www.capterra.com/p/150632/Loyverse-POS/reviews/ |
| KY1 | https://www.kyteapp.com/pricing |
| KY2 | https://www.kyteapp.com/ |
| OD1 | https://www.odoo.com/pricing |
| OD2 | https://www.odoo.com/documentation/18.0/applications/inventory_and_mrp/inventory/product_management/inventory_valuation/landed_costs.html |
| OD3 | https://www.odoo.com/app/whatsapp |
| OD4 | https://www.odoo.com/partners/country/bolivia-28 |
| OD5 | https://www.odoo.com/trial |
| OD6 | https://www.capterra.com/p/135618/Odoo/reviews/ |
| OD7 | https://www.odoo.com/forum/help-1/how-long-the-free-trial-lasts-enesp-250558 |
| SI1 | https://sinticbolivia.net/productos/facturacion-electronica-siat-odoo/ |
| ON1 | https://www.onixia.com.bo/modulo-de-facturacion-siat |
| KH1 | https://www.kyohei.bo/en/blog/noticias-2/facturacion-electronica-para-punto-de-venta-6 |
| TG1 | https://tugerente.bo/pricing/ (vuelto a leer hoy: Bs 514 / 1.315 / 1.842 por trimestre, usuarios ilimitados) |
| TG2 | https://tugerente.bo/ |
| TG3 | https://tugerente.com/ |
| TG4 | https://impactalpha.com/impaqto-capital-provides-revenue-based-financing-for-tugerente-in-bolivia/ |
| TG5 | https://www.tugerente.com/new-ventas (texto del buscador; la página dio 404) |
| KR1 | https://kraken.bo/ (el contenido se carga con JavaScript; texto del buscador) |
| KR2 | https://kraken.bo/main/sales (texto del buscador: "6 meses sin costo", "certificado por SIAT") |
| NI1 | https://nitro.com.de/ (vuelto a leer hoy: Bs 150 / 400 al mes; SIAT add-on Bs 120 en Negocio; Walter en soywalter.com) |
| NI2 | https://boliviaimpuestos.com/como-contabilizar-importacion-bolivia/ |
| NI3 | https://nitro.boliviaimpuestos.com/ |
| SM1 | https://sinticbolivia.net/productos/monobusiness-2-0/ |
| ZI1 | https://www.zoho.com/inventory/pricing/ |
| ZI2 | https://www.zoho.com/us/inventory/pricing-comparison/ |
| ZI3 | https://www.zoho.com/us/inventory/kb/bill/landed-cost.html |
| ZI4 | https://www.zoho.com/us/inventory/help/items/price-list.html |
| ZI5 | https://www.zoho.com/inventory/signup/ |
| ZI6 | https://www.capterra.com/p/146241/Zoho-Inventory/ |
| AP1 | https://agendapro.com/es/planes |
| AP2 | https://agendapro.com/cl/planes |
| AP3 | https://go.agendapro.com/lp/agendapro-mx-precios |
| AP4 | https://agendapro.com/es/signup |
| AP5 | https://www.capterra.com/p/218709/AgendaPro/ |
| AP6 | https://depilaserbolivia.agendapro.com/bo (hoy redirige; dato del índice del buscador) |
| AP7 | https://agendapro.com/blog/software-para-clinica-estetica/ |
| AP8 | https://agendapro.co/bo/planes (página vieja) |
| AP9 | https://agendapro.com/?locale=bo |
| FR1 | https://www.fresha.com/pricing |
| FR2 | https://www.fresha.com/for-business |
| FR3 | https://www.fresha.com/help-center/knowledge-base/team/98-set-up-commissions-for-team-members |
| FR4 | https://www.fresha.com/lp/en/bo-santa-cruz-de-la-sierra |
| FR5 | https://www.capterra.com/p/142138/Shedul-com/ |
| FR6 | https://pabau.com/blog/fresha-review/ (reseña de un competidor) |
| BK1 | https://biz.booksy.com/en-us/pricing |
| BK2 | https://biz.booksy.com/en-us/features |
| BK3 | https://help.booksy.com/hc/en-us/articles/21594778319122-Can-I-use-Booksy-outside-of-my-country |
| BK4 | https://www.capterra.com/p/142741/Booksy/reviews/ |
| RS1 | https://reservo.cl/precios |
| RS2 | https://reservo.cl/estetica/ |
| RS3 | https://www.capterra.com/p/235899/Reservo/reviews/ |
| RS4 | https://reservo.cl/ |
| CT1 | https://www.citalo.app/bo/precios |
| CT2 | https://www.citalo.app/bo/software-reservas-peluquerias |
| CT3 | https://www.citalo.app/ |
| CL1 | https://calendly.com/pricing |
| CL2 | https://help.calendly.com/hc/en-us/articles/4421436573207-What-to-expect-after-your-trial-period |
| CL3 | https://www.capterra.com/p/148036/Calendly/reviews/ |
| CL4 | https://community.calendly.com/how-do-i-40/sending-whatsapp-messages-for-reminders-and-event-details-2092 |
| ST1 | https://stripe.com/global |
| CX1 | https://sinergyasoftware.com/codex-facturacion |
| EM1 | https://www.emizor.com/ |
| XM1 | https://xmart.cloud/pricing/invoice |
| RTS1 | https://boliviaimpuestos.com/regimen-simplificado-en-bolivia/ (capital de hasta Bs 60.000, ventas de hasta Bs 184.000 al año) |
| RTS2 | https://ibce.org.bo/principales-noticias-bolivia/noticias-nacionales-detalle.php?id=92888 (el Régimen Simplificado no emite factura: texto del buscador) |

---

## 4. Parte C: veredicto por rubro

Los esfuerzos son **[I]** y están pensados para una persona con agentes, igual que en el análisis dental.

### Comercio / tienda
- **Funcional:** sí. Caja con carrito y corte, kardex con lotes, multialmacén, fiados, clientes y contabilidad, todo en producción [V].
- **Vendible hoy:** **no**. No emite factura (SIAT) y cuesta 1,9 veces lo que tuGerente, que sí factura (Bs 320 contra ≈ Bs 171) [D]. Además, sus 2 agentes no traen ninguna venta.
- **A quién sí / a quién no:** sí a la ferretería o tienda de barrio que vive del fiado y ya factura por el portal del SIN (o no factura), y que quiere kardex y soporte presencial. No al que factura cada venta (tuGerente, Kraken, Nitro), a la microtienda (Loyverse gratis) ni al que necesita lector de código de barras u offline.
- **Hueco de mercado real:** POS con SIAT, QR conciliado, WhatsApp, alta en autoservicio y soporte en SCZ. Nadie reúne las cinco [investigación]; **Onia tiene 2**.
- **Los 3 huecos más caros:**
  1. SIAT emitiendo desde la caja: semanas, trámite + homologación, con fecha dura el 04-nov.
  2. QR cobrado y conciliado en la caja: depende de la API del BCP, en trámite.
  3. POS offline + lector de código de barras: 2-3 semanas.

### Importadora / distribuidora
- **Funcional:** parcial. El costeo de importación y el reprecio son de verdad lo mejor del rubro [V O14]. Las cotizaciones **no salen del sistema** y el agente que las sigue no tiene teléfono [V O15].
- **Vendible hoy:** **piloto**, con una sola importadora que hoy costee en Excel y a la que la devaluación le mueva el precio.
- **A quién sí / a quién no:** sí a la importadora PYME de SCZ que compra en USD y vende en Bs. No a la distribuidora que cotiza con PDF, maneja precio por cliente o vende en USD, ni a la que factura cada venta.
- **Hueco de mercado real:** costeo boliviano (DIM, GA, IVA como crédito, TCO) con reprecio por devaluación, en Bs y con soporte local. Odoo lo resuelve genérico y caro; ningún local verificado lo tiene completo [OD2][NI2][SM1].
- **Los 3 huecos más caros:**
  1. SIAT.
  2. Una cotización que salga: PDF + WhatsApp + teléfono del cliente, 3-5 días.
  3. Listas de precio por cliente + multimoneda en la venta + orden de compra que cargue el stock: 1-2 semanas.

### Estética y spa
- **Funcional:** sí. Es el sistema dental con "clientas": agenda, reserva pública, ficha con documentos, cobros, recordatorio por correo y 4 agentes en producción [V]. El Tratamiento a medias está **SIN PUBLICAR**.
- **Vendible hoy:** **piloto**, en las mismas condiciones que el dental, porque corre sobre el mismo código. La estrategia vigente ya lo pone en la Etapa 1 junto al dental ("dental/estética", ESTRATEGIA §7).
- **A quién sí / a quién no:** sí al centro de SCZ con 2-6 profesionales y recepción, cuyas clientas hacen tratamientos de varias sesiones y dejan de venir. No al que vende paquetes o bonos prepagados (todavía no hay), al que agenda por cabina o paga comisión por servicio, ni a la profesional sola (Fresha a BOB 39,95 o Citalo gratis).
- **Hueco de mercado real:** Bs + QR + soporte presencial + reactivar a la clienta que dejó el tratamiento. Ningún rival lo junta en SCZ, y ninguno emite SIAT [investigación].
- **Los 3 huecos más caros:**
  1. Paquetes de sesiones prepagadas con saldo por clienta: 1-2 semanas.
  2. Publicar el Tratamiento a medias + el recordatorio por WhatsApp con el número de la clienta. Es el mismo trabajo que el dental 1.0.1, así que el costo extra es cero.
  3. Cabinas como recurso de agenda + comisión por profesional: 1-2 semanas.
  - Sumar además los datos de ejemplo (1 día) y corregir la frase de la portada (2 h).

### Servicios profesionales
- **Funcional:** parcial. Tiene agenda, clientes con documentos, cobros, pedido de papeles, contabilidad y 4 agentes [V]. Al 6-sep no había ninguna organización de este rubro en producción (CATALOGO §8, ítem 1), y la cuenta de prueba nace vacía.
- **Vendible hoy:** **no**, salvo un piloto con un consultorio conocido.
- **A quién sí / a quién no:** sí al consultorio chico (psicólogo, nutricionista) que agenda por WhatsApp y cobra en efectivo o QR. No al contador (necesita SIAT y contabilidad de varios clientes: Nitro), al abogado con expedientes ni al que cobra igualas mensuales.
- **Hueco de mercado real:** agenda + cobro + contabilidad + SIAT en Bs. Nadie lo tiene [investigación]; **Onia tiene 3 de 4** y Nitro, 3 de 4 en sentido contrario.
- **Los 3 huecos más caros:**
  1. SIAT.
  2. Igualas recurrentes. `/billing/recurring` ya existe para la familia clínica y a este rubro le falta la ruta y el modelo de cobro: 3-5 días.
  3. Casos con estado + horas facturables: 1-2 semanas.

### Cierre: qué rubro empujar después del dental, con la cuenta

**Estética. Y no como rubro nuevo, sino como la otra mitad del mismo pack clínico** [D]:

| | Estética | Importadora | Servicios | Comercio |
|---|---|---|---|---|
| Pantallas que comparte con el dental [V] | **todas** (`navClinicaDe` = el menú dental) | ninguna | agenda y clientes | ninguna |
| Agentes del plan que ya le corren [V] | 4 + Tratamiento a medias | 3 (el Seguidor sin teléfono) | 4 | 2 |
| Trabajo propio del rubro para venderlo [I] | 1-2 semanas (paquetes) + 1 día | 2-3 semanas + SIAT | 1-2 semanas + SIAT | 2-3 semanas + SIAT + API del BCP |
| Precio del rival directo (Bs/mes) [D] | AgendaPro ≈ 330-671; Fresha ≈ 108 para 4 personas | Nitro 400; Odoo por usuario | Nitro 150-400; Codex 167-208 | tuGerente ≈ 171; Loyverse 0 |
| Plan de Onia que calza | Crece 550 / Profesional 890 | Profesional 890 | Básico 320 / Crece 550 | Básico 320 |
| Clientes para la salida de la Etapa 1 (Bs 3.750/mes) | **7** en Crece o **5** en Profesional | **5** en Profesional | 7-12 | **12** en Básico, peleando contra precios de Bs 171 |

- **Por qué estética:** cada hora que se invierte en el dental 1.0.1 (publicar Recall, Tratamiento a medias y "Lo que te dejó", el recordatorio por WhatsApp, la UI de la demo) **también cierra estética** sin costo extra. Lo único propio del rubro son los paquetes de sesiones. Es el mismo cliente ideal, con otra camilla.
- **Después, la v1.2 de la estrategia: importadora, con un piloto medido.** Es el único rubro donde Onia tiene algo que ningún rival local verificado tiene (el costeo con reprecio por devaluación). Le faltan 2-3 semanas y el SIAT, y su mercado es más chico [I]. Existe una organización de importadora en producción, `bolivian-electricidad-e6t21`, con 10 corridas de agentes (`agents-por-rubro.ts`). Si se usa de piloto, vale la memoria `bolivian-electric-es-familia-vinculada`: facturar a valor de mercado.
- **Comercio y servicios: no se empujan hasta que SIAT emita.** Sin la factura, compiten contra rivales bolivianos de Bs 167-270 que sí la emiten.
- **Esto no cambia la etapa vigente** (la decide Sergio Urcullo): estética ya está dentro de la Etapa 1. Lo que agrega es la cuenta para no abrir comercio ni servicios antes de tiempo.

---

## 5. Cuentas de prueba que valdría crear (una por rubro)

Esto lo hacés vos: yo no puedo crear cuentas ni ingresar contraseñas. Creá cada una con un correo de prueba, **sin cargar tarjeta**, y dejala abierta en el grupo de pestañas **"Claude"** de tu Chrome. Así la recorro después en solo lectura.

| Rubro | Competidor | Cómo se entra | URL | Qué mirar (con cronómetro) |
|---|---|---|---|---|
| Comercio | **Loyverse** | Gratis para siempre, sin tarjeta [LV1] | https://loyverse.com/en/signup | Minutos hasta la primera venta desde el celular; cómo se cierra la caja; si hay fiado; el recibo. Comparar con `/comercio/caja` a 375 px |
| Importadora | **Odoo** (activar Inventario, Compras y Ventas) | Prueba sin tarjeta, ~14-15 días [OD5][OD7] | https://www.odoo.com/trial | Armar el costeo de un contenedor con 3 productos (landed cost) y mandar una cotización en PDF por WhatsApp. Contar clics contra `/importadora/costeo`. Alternativa más simple: Zoho Inventory (14 días + Free) https://www.zoho.com/inventory/signup/ |
| Estética | **AgendaPro**, creada como "centro de estética" | 7 días sin tarjeta [AP3][AP4] | https://agendapro.com/es/signup | Vender un paquete de 6 sesiones y ver cómo se descuenta; la ficha con fotos; cuánto cuesta de verdad el WhatsApp. Si ya la creaste para el dental, hacé un segundo negocio |
| Servicios | **Calendly** | Free permanente + 14 días de Teams sin tarjeta [CL1][CL2] | https://calendly.com/signup | Clics hasta que un cliente reserva y cómo reparte entre profesionales. Contrastar con `/book` |
| (opcional) SIAT local | **Nitro Pro** | Demo pública con credenciales compartidas: la abrís vos [NI1] | https://nitro.com.de/ | Cómo emite la factura SIAT y el libro de compras y ventas. Es el modelo de lo que les falta a comercio y a servicios |
| (opcional) comercio local | **Kraken** | "Empezás sin costo" / "6 meses sin costo" [KR1][KR2], sin verificar | https://kraken.bo/ | Solo si no pide tarjeta: cómo factura desde la caja y cómo concilia el QR |

**Qué anotar en cada una (lo mismo para todas):**
1. Minutos desde el registro hasta la primera venta, cita o cotización.
2. Si emite factura SIAT y cuántos clics lleva.
3. Qué pide para WhatsApp.
4. El total real del mes para 4 usuarios, en Bs.
5. Una captura a 375 px de la pantalla principal.
