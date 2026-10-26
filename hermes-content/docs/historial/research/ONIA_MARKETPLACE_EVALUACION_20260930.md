> **Foto de investigación del 2026-09-30 (carril Mercado, sesión «Análisis de mercado Onia Platform»).** No es fuente de verdad: lo vigente está en `ONIA_ADQUISICION_Y_PAUTA.md`, `ONIA_CLIENTE_IDEAL.md` y `ONIA_ESTRATEGIA_DE_EMPRESA.md` §14. Los avisos de este texto sobre "cambios sin commitear" en otros docs se refieren al árbol durante la sesión y ya quedaron resueltos en esos docs.

# Informe C — ¿Un marketplace para ONIA? Panorama Bolivia, economía real y qué es realista

> **Fecha:** 2026-09-30 · **Pedido de:** Sergio Urcullo (*"me encantaría ser dueño tal vez de un
> marketplace, como lo que es Uber, Yango, PedidosYa"*) · **Tipo:** investigación de solo lectura; no
> se tocó nada del repo `onia-hermes`.
> **Etapa vigente de ONIA:** Etapa 1 (0 → 5 clientes, salida = Bs 3.750/mes cobrado) — `ONIA_ESTRATEGIA_DE_EMPRESA.md` §7 [R1].

---

## 0. Veredicto en seis líneas

1. **Un marketplace general tipo Uber / Yango / PedidosYa no es realista para ONIA, ni hoy ni con 50 clientes.**
   Falla las tres preguntas del test, pide capital en la escala de cientos de millones de USD, y los
   incumbentes en Bolivia son superapps con respaldo global. Ninguna métrica interna de ONIA lo destraba.
2. **Sí existe un marketplace realista: una red de clínicas de Santa Cruz que nace de Onia Platform**
   ("vení por la herramienta, quedate por la red"). Es el camino de AgendaPro, Mindbody, Toast y OpenTable.
3. **Esa red tiene un orden, y no se puede saltar.** Primero va el **modo de un solo jugador**, que ya existe:
   la reserva pública y el bot de cada clínica. Después vienen las **funciones de red B2B** (derivaciones y
   laboratorio), que no obligan a salir a buscar pacientes. **Al final** llega el directorio para pacientes.
4. **Los comparables obligan a ser humildes.** AgendaPro sacó su marketplace después de 11 años y 22.000
   negocios, y todavía mueve **~1,8% de sus reservas**, unas **~3,4 reservas por negocio al mes** [inferencia
   sobre 55]. Mindbody, con 40.000 negocios, tuvo que **comprar** ClassPass para tener lado consumidor.
5. **Condición numérica.** Las funciones B2B de red se abren con **≥5 clientes pagando** (v1.3) y **≥10
   clínicas pagando en Santa Cruz con ≥3 especialidades**. El directorio para pacientes se abre con **≥50
   clínicas pagando y activas en Santa Cruz**, y además **con el soporte ya fuera de Sergio Urcullo** (etapas
   3 → 4).
6. **Hoy no se construye nada de esto.** Coincide con lo que ya decía el repo (2026-08-01: "la anti-idea";
   "Plataforma tipo Uber → CONGELAR" [R3][R4]). Lo nuevo de este informe es la ruta vertical, con gatillos
   medibles, para anotarla en §14.

---

## 1. Método, etiquetas y límites

- **Etiquetas:**
  - **[primaria]**: la URL es la fuente original (empresa, regulador, SEC). **[secundaria]**: prensa,
    blog o agregador. **[inferencia]**: cálculo o razonamiento mío, con los supuestos a la vista. **[repo]**:
    doc interno, leído directamente.
- ⚠️ **Ninguna página web se abrió.** WebFetch devolvió `EGRESS_BLOCKED` en todos los dominios que probé:
  urgente.bo, eldeber.com.bo, vision360.bo, atb.com.bo, bloomberglinea.com, en.wikipedia.org,
  docplanner.com e investor.uber.com. **Todo dato web sale del extracto del buscador sobre esa URL.** Por
  la regla "verificar es MIRAR", **nada de este informe llega a "verificado"**: [primaria] quiere decir
  "la fuente es primaria", no "la miré renderizada".
- ⚠️ **El presupuesto de búsqueda de la sesión se agotó (200/200)** a mitad del trabajo. El mercado B2B dental,
  los laboratorios y el e-commerce boliviano quedaron **sin investigación web** (§9).
- Las fuentes van numeradas en §10: [n] es web y [Rn] es repo.

---

## 2. Lo que ya decía el repo (para no repetir ni contradecir)

| Doc | Qué dice | Estado |
|---|---|---|
| `research/ONIA_LLUVIA_IDEAS_SERGIO_ARTHUR_20260801.md` §3.12 [R3] | "App marketplace estilo Uber/PedidosYa — 🔴 la anti-idea": huevo-gallina, B2C masivo, guerra de subsidios. Matiz: si un **cliente paga** por construirle un marketplace, es un proyecto de Web Factory | Vigente. ⚠️ El matiz **también está congelado hoy**: Web Factory queda fuera de Etapa 1 [R1 §7] |
| `ONIA_TEMAS_CHARLA_CONTESTADOS.md` [R4] | "Plataforma tipo Uber → CONGELAR": "exige capital que subsidie ambos lados durante años… falla las tres preguntas" | Vigente; este informe le agrega evidencia |
| `ONIA_CATALOGO_DE_IDEAS.md` [R2] | **No hay** ninguna idea de marketplace, directorio ni Doctoralia | Hueco. La ruta vertical de §8 no está anotada en ninguna parte |
| `historial/ONIA_BENCHMARK_INDUSTRIA_20260807.md` [R8] | Doctoralia: *"El marketplace TRAE demanda — motivo #1 por el que pagan"*; *"Onia no tiene directorio ni marketplace; vende gestión, no demanda"* | Foto de un día, no es fuente. El dato sirve para §7 |
| `ONIA_CATALOGO_DE_VENTA.md` §5 [R5] | **Agenda pública** ("link de reserva sin llamadas") 🟢. La clave `module.public_booking` no gatea nada | Es la semilla "single-player" de la red. **No verificado en producción en esta sesión** |
| `ONIA_CLIENTE_IDEAL.md` §2 [R6] | La reserva pública existe desde el plan **Crece** | — |
| `historial/ONIA_DENTALGEST_FISCAL_MERCADO_PRICING_20260725.md` [R7] | En Santa Cruz habría del orden de **1.000–3.000 consultorios dentales**. Es **estimación propia, no censo** (base de ~15.000 colegiados, dato de ~2019) | Es la única cifra de universo que hay |

---

## 3. Panorama de marketplaces en Bolivia (2025-2026)

### 3.1 Transporte por app

| Actor | Desde | Dónde | Datos | Fuente |
|---|---|---|---|---|
| **Uber** | ~2016 (cumplió 5 años en SCZ y LPZ en oct-2021) | SCZ, LPZ, CBBA | Una guía de 2026 dice que funciona, pero que **"inDrive suele ganar"** por precio y por la cultura QR | [4] [secundaria] · [5] [secundaria, débil] |
| **inDrive** | ~2019 | SCZ, Tarija, Oruro, Sucre, CBBA, LPZ, El Alto | Encuesta propia a >900 personas, ~2024: **9 viajes/mes** en promedio (SCZ **11**); **9 de cada 10 pasajeros pagan en efectivo**; 69% elige la tarifa económica. Primera app con licencia municipal en La Paz (abr-2023) | [6] [secundaria; autodeclarado] · [7] [secundaria] |
| **Yango** (Yango Group) | **dic-2022**, entró por SCZ | SCZ, LPZ, CBBA, Tarija | Superapp: viajes, envíos, comida y navegación de transporte público (sep-2025). **Tarifa moto primero en SCZ** | [1] [secundaria] · [2] [secundaria] · [3] [secundaria] |
| **Locales** | 2024-2025 | LPZ / El Alto | **Chukuta Móvil** (Asociación de Transporte Libre + Sercod), **Ñee**, **Chek** | [10] [11] [secundaria] |

**Cuotas de mercado: no encontré ninguna publicada.** Lo único cuantitativo son encuestas de las propias
empresas y ranking de descargas.

### 3.2 Regulación del transporte por app

| Fecha | Qué pasó | Fuente |
|---|---|---|
| 2024-04-15 | Los mototaxistas de Santa Cruz bloquean la alcaldía y exigen regular las apps. El alcalde se compromete a hacer cumplir la normativa y a exigirle respuesta a la ATT | [12] [secundaria] |
| 2024-08-14 | **DS 5199**: crea el Registro Nacional de Aplicación Digital para Transporte de Pasajeros (ATP) en la ATT. Las apps se tienen que **constituir en Bolivia** (domicilio, NIT, registro de comercio, tarjetas y antecedentes de los conductores), con **30 días de plazo**. Según la prensa, se aprobó **"a solicitud del sector de transporte sindicalizado"** | [8] [secundaria] |
| 2024-10-17/18 | La ATT aprueba el reglamento del registro | [9] [secundaria] |
| 2025-01-13 | Hay **cuatro apps registradas: Yango, Ñee, Chukuta Móvil y Chek.** Uber e inDrive **no figuraban** en esa lista en ese momento | [10] [secundaria] |

Lectura [inferencia]: **en Bolivia la regulación del transporte por app reacciona a la presión de los
sindicatos.** Un entrante nuevo arranca con trámite en la ATT, empresa local y conflicto gremial incluidos.

### 3.3 Delivery

| Actor | Datos | Fuente |
|---|---|---|
| **PedidosYa** (Delivery Hero) | Entró **comprando NetComidas** (SCZ, 2015, bootstrapped) el **15-mar-2018**: la compra "más importante de una startup boliviana", de 7 cifras en USD. Primer pedido: 28-jul-2018, en SCZ. Hoy dice estar en los 9 departamentos, con ">800 restaurantes y comercios" (sin fecha), Plus, Market y Créditos. Promoción de entrada en Bolivia: **10% de comisión los primeros 30 días**. En Argentina la comisión es de 25-35% | [13] [14] [15] [16] [primaria, extracto] · [17] [secundaria] |
| **Yango Comida** | SCZ 2024 → CBBA 2025 → **LPZ sep-2026, con 206 restaurantes al lanzar**. Desde jul-2026 tiene la exclusiva de **MrBeast Burger** (5 dark kitchens en SCZ) | [19] [20] [secundaria] |
| **Uber Eats** | Llegó el 3-4 de abril de 2019 a LPZ y SCZ, con >200 restaurantes. **No pude confirmar si sigue operando en 2026** | [23] [secundaria] |
| **Locales** | **Yaigo** (may-2019, los 9 departamentos) → **comprada por Yummy (Venezuela) en nov-2021**. **EGX Turbo** (SCZ, 2024). PatioService | [22] [18] [secundaria] |
| Tamaño | Statista estima **USD 578 M** de delivery online en 2025, con un CAGR del 15% a 2030. **Es un modelo, no un censo** | [21] [secundaria] |
| Descargas | En el 3T-2025, PedidosYa lidera el ranking de descargas de delivery. El ranking incluye apps que no operan en Bolivia (Blinkit, Zepto), así que tiene ruido | [24] [primaria, dato de proveedor] |

**Patrón local [inferencia sobre 13, 14 y 22]:** los marketplaces bolivianos que funcionaron (NetComidas y
Yaigo) **terminaron vendidos a un jugador extranjero**. La "salida" realista de un marketplace local es que
lo compre el global, y eso exige tracción primero.

### 3.4 Salud: directorios y reserva online (lo relevante para ONIA)

| Actor | Qué es | Fuente |
|---|---|---|
| **Docplanner / Doctoralia** | Opera en **13 países**: MX, PL, BR, ES, IT, DE, TR, CO, CZ, PT, CL, PE y AR. **Bolivia no está.** Tiene >100 M visitas/mes, 20 M citas/mes y >300.000 profesionales | [25] [primaria, extracto] · coincide con [R8] |
| **SaludBO** | Marketplace boliviano: +30 especialidades, consultas **desde Bs 100**, pago con **QR del BNB**, verificación de médicos con IA, castellano y quechua | [30] [primaria, extracto] |
| **Doctor XD** | Santa Cruz, 2020 (Orange Group SRL), sin financiamiento según Tracxn | [31] [secundaria] |
| **Agendas gratis/baratas** | **ReservaSimple**: gratis hasta 30 citas/mes, sin comisión; dice tener "4.800 negocios" (autodeclarado). **Turnito**: gratis + 5% si cobra en línea. **Citalo**: plan gratis y no publica precio. **TuDoc**: gestión + **facturación SIAT**, según el blog de Turnito. **Saluta360** (CBBA). **AgendaPro** vende en Bolivia (USD 49/79/129) | [32] [33] [primaria/secundaria, autointeresados] · [R9] [repo] |
| **Directorios estáticos** | DoctorBolivia, MedicoEspecialista.com.bo, TuGuiaTuSalud, BoliviaEnTusManos (sin reserva) | [34] |
| **Sector público** | Plataforma del Ministerio de Salud: **336 centros conectados y 673.803 fichas digitales** entre dic-2025 y jul-2026 (red pública) | [35] [primaria/secundaria] |

Lectura [inferencia]: **el lugar de "Doctoralia boliviano" está desocupado por el jugador global, pero no
vacío.** Hay al menos un marketplace local con cobro QR (SaludBO), varias agendas gratis y un competidor
regional con marketplace propio que ya vende en Bolivia (AgendaPro). **No encontré evidencia de que
alguno domine.** Lo más probable es que la demanda del paciente siga pasando por WhatsApp, Facebook y
Google Maps [inferencia; no verificado].

### 3.5 E-commerce y clasificados (poco dato: sin presupuesto de búsqueda)

- Inmuebles: InfoCasas dice cubrir "97% de la oferta del país" con +20.000 propiedades. **UltraCasas, el #1,
  estaba "en pausa" al 2026-08-08** [R10] [repo, verificado ese día]. Es otro marketplace local que se detuvo.
- Facebook Marketplace + WhatsApp como canal dominante del comercio informal: está en el repo como
  **inferencia** [R10]. No encontré estadísticas.

### 3.6 Pagos, dólares y macro 2026 (cambia la cuenta de cualquier marketplace)

| Dato | Valor | Fuente |
|---|---|---|
| Pagos QR en 2025 | **891 M de transacciones, USD 51.293 M**, +131% contra 2024 | [36] [secundaria sobre datos del BCB] |
| Billeteras móviles | Al menos 8 (Tigo Money dominante, más Bille, Yape, Yasta y Yolo); ASFI: 3,1 M habilitadas a 2024 | [37] [secundaria] |
| Efectivo en apps de transporte | 9 de cada 10 pasajeros (encuesta de inDrive, ~2024) | [6] [secundaria] |
| Tipo de cambio | Paridad fija en 6,96 desde 2011 → **flotación administrada desde el 29-jun-2026** → **~Bs 12/USD** a fines de sept-2026 (12,22 al 25-sep; 12,02 al 29-sep, según la fuente) | [38] [39] [secundaria] |
| Combustible | Fin de los subsidios en dic-2025: diésel de 3,72 a 9,80 y especial de 3,74 a 6,96 Bs/L. **DS 5716 (19-sep-2026): diésel a Bs 17,95** (+83%). Protestas del 1-may al 23-jun-2026 | [38] [40] [secundaria] |
| Pagar al exterior con tarjeta | Tope de ~USD 100/día en algunos bancos | [R11] [repo; dato del 2026-07-05, no recontado] |

Lectura [inferencia]: **cobrar adentro de Bolivia está resuelto** con el QR. Lo difícil de un marketplace
es otra cosa: **pagarle a miles de conductores o repartidores y manejar efectivo**. Encima, 2026 es el
peor año posible para un marketplace de movilidad o delivery subsidiado. El combustible de quien trabaja
se duplicó, y los costos en USD (nube, mapas, SMS) valen casi el doble en bolivianos.

---

## 4. Economía real de un marketplace tipo Uber / PedidosYa

### 4.1 Cuánto se quedan (take rate)

| Plataforma | Take rate / comisión | Fuente |
|---|---|---|
| Uber Mobility | **29,9%** (4T-2025) | [41] [secundaria sobre release de Uber] |
| Uber Delivery | **19,2%** (4T-2025) | [41] [secundaria] |
| PedidosYa | 10% de promoción en Bolivia; **25-35%** en Argentina | [16] [17] |
| Fresha | Software gratis + **20% del primer turno** que llega por el marketplace (mínimo USD 6) | [59] [primaria/secundaria] |
| Booksy | USD 29,99/mes + **30% de la primera visita** con Boost | [60] [primaria, extracto] |
| Zocdoc | **USD 35–110 por paciente nuevo** (dentistas: 110) desde 2019; antes cobraba USD 3.600/año | [57] [secundaria] |

### 4.2 Cuánto tardan y cuánto queman

| Empresa | Años hasta ganar plata | Capital / pérdidas | Fuente |
|---|---|---|---|
| **Uber** | Primera ganancia operativa anual en **2023**, ~14 años después | **USD 31.500 M** de pérdidas operativas acumuladas. En 2025: bookings USD 193.500 M, ingresos USD 52.000 M, ganancia operativa USD 5.600 M | [42] [secundaria] · [41] [primaria, extracto] |
| **Rappi** (entidad Colombia) | Primera utilidad en **2024** (COP 97.250 M), "tras casi una década de pérdidas" | **COP 1,2 billones** de pérdidas acumuladas hasta 2023. SoftBank puso ~USD 1.000 M en una ronda | [44] [secundaria] |
| **Docplanner** | Fundada en 2012 → **EBITDA positivo en el 2S-2025** (~13 años) | Recaudó entre USD 139 M y 434 M según la fuente; unicornio en 2021 | [25] [26] [27] [28] |
| **Zocdoc** | Fundada en 2007 → se declaró "rentable" en 2021 (~14 años) | Recaudó entre USD 376 M y 569 M según la fuente | [56] [58] |
| **Delivery Hero Américas** (PedidosYa) | — | GMV **€4.080 M** en 2025; **1 M de pedidos diarios** en el 4T-2025 | [43] [primaria, extracto] |

(Los años de fundación de Uber, 2009, y de Rappi, 2015, son conocimiento general que no verifiqué en esta sesión.)

### 4.3 Salidas en LatAm (hasta los gigantes se van donde no son #1 o #2)

| Quién | Qué | Cuándo | Fuente |
|---|---|---|---|
| Uber Eats | Sale de Uruguay, Honduras y Perú (may-2020), y de Argentina y Colombia (nov-2020). Motivo declarado: quedarse sólo donde lidera | 2020 | [46] [secundaria] |
| Glovo | Vende toda LatAm (8 países) a Delivery Hero por **€230 M** | sep-2020 | [45] [secundaria] |
| iFood | Cierra en México (2020) y en Colombia (21-nov-2022) | 2020-22 | [47] [secundaria] |
| Beat (Free Now) | Sale de 5 países y le pasa **17 M de pasajeros y 1 M de conductores** a Cabify | nov-2022 | [48] [secundaria] |
| NetComidas, Yaigo (Bolivia) | Compradas por jugadores extranjeros | 2018, 2021 | [14] [22] |

**Por qué fallan:** por liquidez, no por software. Oferta o demanda demasiado finas, el capital se acaba
antes de llegar a masa crítica, y la dispersión geográfica deja todo vacío [49] [secundaria, débil] ·
[R4]. **La parte tecnológica es la barata**, y es la única que ONIA tiene.

### 4.4 Qué haría falta para competir en Santa Cruz contra Yango / PedidosYa

| Requisito | Qué tiene el incumbente | Qué tiene ONIA |
|---|---|---|
| Legal | Empresa local, registro ATP en la ATT (DS 5199), licencias municipales | Sociedad sí; la firma depende de un tercero [R1 §15] |
| Oferta | Yango abrió La Paz con **206 restaurantes el día 1** [19]; flota de conductores y motos | 0 |
| Demanda | Superapp (viaje + comida + envíos + transporte público), suscripción Plus, promociones | 0 |
| Subsidios | Promociones de entrada, envío gratis y exclusivas (MrBeast) | Gasto total de **Bs 3.650/mes** [R1 §4] |
| Operación 24/7 | Soporte, seguridad, fraude, pagos a conductores, efectivo | 1 persona, con techo de soporte de **30-50 clientes B2B** [R1 §9] |
| Tecnología | Sí | **Sí** (lo único que coincide) |

**Aritmética ilustrativa [inferencia; los supuestos NO son datos de mercado]:** subsidiar **Bs 10 por pedido
× 1.000 pedidos/día** cuesta **Bs 300.000 al mes = 82 meses del gasto actual de ONIA.** Cambiar el
supuesto no cambia la conclusión: la escala de capital es de otro orden.

---

## 5. El camino alternativo: marketplace nacido del SaaS vertical

**La tesis** ("come for the tool, stay for the network", Chris Dixon, 2015): primero se gana un lado con
una herramienta útil sola, y **con escala** se le suma el otro lado. OpenTable lo hizo así: empezó en San
Francisco en 1998 con el libro de reservas del restaurante, y creció **ciudad por ciudad** [50] [51]
[secundaria]. Hay críticas publicadas a la tesis (TechCrunch, 2016-12-01) y está la versión inversa, "come
for the network, stay for the tool", que es lo que hizo Docplanner [50].

### 5.1 Comparables

| Empresa | Qué vino primero | Tamaño cuando el lado consumidor "sirvió" | Cómo cobra la red | Lección para ONIA |
|---|---|---|---|---|
| **AgendaPro** (Chile, 2014) | SaaS | **22.000 negocios en 17 países** y ~50 M reservas/año. Marketplace de prueba en 2025, oficial en 2026: **14.000 → 75.000 reservas/mes** (ene → jun 2026) [55] | — | El comparable más cercano, y **ya vende en Bolivia** [R9]. Tras 11 años, su marketplace es **~1,8% de sus reservas, ~3,4 por negocio al mes** [inferencia: 75.000 ÷ (50 M ÷ 12); 75.000 ÷ 22.000] |
| **Mindbody** | SaaS | App Connect en 2013; **40.517 negocios** en 2014; >42.000 y 24 M consumidores en la IPO (jun-2015) [53]. Aun así **compró ClassPass** en oct-2021 [54] | — | **Tener decenas de miles de negocios en el SaaS no crea el lado consumidor solo** |
| **Docplanner / Doctoralia** | Directorio de opiniones (2012), después agenda | Perfiles gratis; según el extracto, **se puede aparecer sin registrarse** (a verificar). Premium en España: **€89–129/mes** [29] | Suscripción por visibilidad | Se sembró la oferta **listando a todos** y se pagó con capital: 13 años hasta el EBITDA [25] [26] |
| **Zocdoc** | Marketplace (NYC, 2007, **dentistas de Manhattan** al lanzar) [56] | — | Por paciente nuevo, USD 35-110 [57] | Cobrar por paciente **enojó a los médicos**: "hits a nerve" [57] |
| **Fresha / Booksy** | SaaS + marketplace | — | 20-30% del **primer** turno [59] [60] | El marketplace **monetiza** un SaaS barato o gratis, pero exige riel de pagos y escala |
| **Toast Local** | SaaS (POS) | — | **Sin comisión** [61] | La app de consumidor como **defensa y retención** frente a los agregadores, no como línea de ingreso |

### 5.2 ¿Qué densidad mínima necesita un paciente? Lo que se sabe y lo que no

- **No encontré ninguna fuente pública con "N negocios por ciudad"** para OpenTable, Mindbody, AgendaPro ni
  Doctoralia. Lo que existe es cualitativo: la "red atómica" de Andrew Chen se construye **una ciudad y una
  categoría a la vez** [52] [secundaria].
- Hay dos formas documentadas de resolver el arranque. (a) **Listar a todos** (Doctoralia, Zocdoc): el
  directorio se ve lleno, pero cuesta moderación, riesgo legal y mucho capital en SEO y marca. (b) **SaaS
  primero y paciencia** (AgendaPro, Mindbody): décadas de miles de negocios, y aun así el lado consumidor
  es chico.

### 5.3 El umbral para ONIA (derivado; cada supuesto a la vista) [inferencia]

1. **Universo:** de 1.000 a 3.000 consultorios dentales en SCZ [R7] (estimación, no censo).
2. **Cómo busca el paciente:** zona + necesidad + "turno pronto". Supuestos: SCZ se divide en **~8-10 zonas**
   relevantes, y el paciente necesita **≥3 opciones con turno en ≤48 h en su zona**. Si no las tiene,
   vuelve a Google Maps o a WhatsApp.
3. **Cuenta:** para odontología general hacen falta de **24 a 30 clínicas** bien repartidas. Con las
   especialidades (ortodoncia, endodoncia, implantes) → **piso de ~50 clínicas activas**; lo cómodo es ~100.
4. **Contraste con la estrategia:** 50 clientes es justo la **Etapa 4** [R1 §7], y una persona sola **topa
   en 30-50 clientes B2B** [R1 §9]. **El directorio suma soporte B2C encima**, así que sólo es viable
   **después** del contratado de soporte (salida de la Etapa 3).
5. **Señal adelantada que se puede medir desde el cliente 1:** qué parte de los pacientes nuevos de las
   clínicas de ONIA **ya reserva por el link o el bot**. Propongo **≥20%** como umbral inicial, a calibrar.
   Si el paciente cruceño no reserva en línea con **su propia** clínica, no lo va a hacer en un directorio.

### 5.4 La economía del directorio a escala ONIA [inferencia; supuestos a la vista]

- Si ONIA cobrara como Fresha o Booksy (20-30% del primer turno), sobre una consulta de ~Bs 100 (el piso
  de SaludBO [30]), serían **Bs 20-30 por paciente nuevo**.
- Con el rendimiento que tiene hoy AgendaPro (**~3,4 reservas por negocio al mes** [55]), **50 clínicas
  darían ~170 reservas/mes → Bs 3.400–5.100/mes**. Eso es **aproximadamente un mes del gasto actual**, y
  alrededor de un 10% de lo que pagarían esas mismas clínicas por suscripción (el doc de estrategia estima
  del orden de Bs 45.000/mes para 40 clientes a plan completo [R1 §8.3]).
- **Conclusión:** a la escala de ONIA, el directorio **no es un motor de ganancia**. Es una **herramienta
  de retención y diferenciación**, como Toast Local. Se justifica si hace que las clínicas **no se vayan**,
  no por la comisión.

---

## 6. Candidatos para ONIA: test de tres preguntas + etapa

### 6.1 El test (§10 de la estrategia)

| # | Candidato | ¿Mismo cliente que ya paga? | ¿Deja de tener sentido sin el núcleo? | ¿Sin horas de Sergio Urcullo por cliente? | Veredicto |
|---|---|---|---|---|---|
| a | **Marketplace general** (viajes / delivery) | ❌ consumidores, conductores y restaurantes | ❌ funciona sin Onia | ❌ operación 24/7 | 🔴 **negocio nuevo, el más caro de todos** |
| b | **Directorio de clínicas de SCZ con reserva**, alimentado por las agendas de ONIA | ⚠️ la clínica paga, pero el paciente es un **cliente nuevo que hay que ir a buscar** (marketing B2C) | ✅ la disponibilidad en tiempo real sólo existe gracias a la agenda de ONIA | ⚠️ perfiles automáticos sí; reseñas y reclamos de pacientes no | 🟡 **como "single-player" (link + bot de cada clínica) pasa y ya existe. Como portal para pacientes, falla la 1ª hasta que haya densidad** |
| c | **Marketplace B2B de insumos dentales** (clínica ↔ importadora), alimentado por el inventario | ⚠️ la clínica sí; **la importadora es otro cliente** | ✅ la señal de reposición sale del kardex | ❌ logística, crédito, disputas, precios con el TC flotante, factura por venta | 🔴 **como marketplace** · 🟢 **como función** "pedido sugerido a tu proveedor de siempre por WhatsApp" |
| d1 | **Red de derivaciones** (general ↔ especialista, entre clínicas de ONIA) | ✅ | ✅ agenda + ficha + estado de la derivación | ✅ autoservicio | 🟢 **pasa las tres: es la primera función de red** |
| d2 | **Red clínica ↔ laboratorio dental** (órdenes de trabajo: prótesis, coronas) | ✅ si el lado del laboratorio es **gratis** | ✅ la orden cuelga del paciente y del tratamiento | ✅ si el portal del laboratorio es autoservicio | 🟢/🟡 pasa, con riesgo de adopción |
| d3 | **App de despacho white-label para una asociación de transporte** (la versión realista de "estar en movilidad": vender la pala, como Sercod con Chukuta Móvil [11]) | ❌ | ❌ | ❌ proyecto a medida + soporte | 🔴 **otra línea de negocio**. Anotada sólo porque es la **única** forma de "Uber" al alcance de una persona |

### 6.2 Inversión, tiempo, riesgo principal y condición de arranque [inferencia salvo donde se cita]

| # | Inversión | Tiempo | Riesgo principal | Condición de arranque (medible) | ¿Cuándo? |
|---|---|---|---|---|---|
| a | Cientos de millones de USD, a juzgar por los comparables [41-48]; equipo de operación 24/7 | >10 años hasta ganar plata (Uber ~14, Docplanner ~13, Zocdoc ~14) | Liquidez + subsidios contra superapps + regulación empujada por sindicatos | **Ninguna condición interna de ONIA lo destraba.** Haría falta capital externo de otra escala, que contradice §4 de la estrategia | **Nunca, dentro de la estrategia vigente** |
| b | Construir: **semanas** (la agenda pública y el bot ya existen [R5]). **El costo real es la adquisición de pacientes** (SEO lento o anuncios pagos), sin estimar | 12-24 meses después del gatillo para saber si el lado paciente responde | **Directorio vacío**, y **conflicto con la clínica que paga**, que no quiere aparecer al lado de su competencia. Además compite con herramientas gratis y con AgendaPro | **≥50 clínicas pagando y activas en SCZ**, en ≥8 zonas, con la reserva pública encendida **Y** ≥20% de los pacientes nuevos reservando en línea **Y** el soporte ya fuera de Sergio Urcullo | **Etapa 4** (50+) |
| c | Construir la función: semanas. Si ONIA intermedia el pago o el crédito, necesita **capital de trabajo** | Largo | Margen B2B fino + **TC flotante desde el 29-jun-2026** + facturación SIAT por venta (el emisor de ONIA sigue en mock [R1 §6]) | **≥50 clínicas con kardex activo** (movimientos semanales) **Y** ≥3 distribuidores que **pidan** entrar sin que se los busque | Después de b |
| d1 | Días a semanas; Bs 0 de caja | Corto | **Privacidad:** compartir datos clínicos entre clínicas exige consentimiento del paciente. Si hay dinero por derivar, puede caer en **"dicotomía"** (a verificar con el Colegio de Odontólogos) | **≥10 clínicas pagando en SCZ con ≥3 especialidades cubiertas**, **o** que un cliente que paga lo pida | **v1.3** (después de 5 clientes y de bajar las horas de soporte) |
| d2 | Semanas; Bs 0 de caja; algunas horas para sumar laboratorios | Corto a medio | Los laboratorios son chicos y viven en WhatsApp. **Además es un posible canal de adquisición**: si un laboratorio atiende a muchas clínicas, las arrastra [inferencia, sin dato de SCZ] | **1 laboratorio que atienda ≥10 clínicas** acepta recibir órdenes por ONIA, **y** ≥3 clínicas de ONIA que pagan trabajan con él | v1.3+ |
| d3 | Proyecto a medida (semanas a meses) + soporte permanente | — | Otro cliente, otro soporte, conflicto gremial | Sólo como proyecto **pagado por adelantado**, y Web Factory está congelado en Etapa 1 [R1 §7] | No en Etapas 1-2 |

**Descartadas al evaluarlas** (una línea cada una): un marketplace de reemplazos de odontólogos falla la
2ª (es una bolsa de trabajo que funciona sin ONIA). El turismo dental falla la 1ª y la 3ª. Las compras
agrupadas de insumos son una variante de c y comparten su gatillo.

---

## 7. Abogado del diablo: tres agujeros, ordenados por cuánto duelen

**1. El supuesto que, si es falso, tira todo abajo: "ONIA ya tiene un lado de la red".**
Tiene **0 clientes pagando** [R1 §2]. Un marketplace que nace del SaaS **presupone una base instalada**
[R1 §10]. Sin el primer lado, "marketplace" es **dos problemas de adquisición en vez de uno**. Y aun con
el primer lado resuelto, AgendaPro (22.000 negocios) mueve ~1,8% de sus reservas por el marketplace, y
Mindbody (40.000) tuvo que comprar su lado consumidor [53] [54] [55].

**2. Quién dice que no, y con qué palabras.**
- **El dueño de la clínica**, que es el que paga: *"¿Me vas a poner al lado de mi competencia?"* y *"¿Me
  vas a cobrar por pacientes que ya eran míos?"* [inferencia; objeción típica, no es una cita]. La segunda
  es exactamente la pelea documentada de los médicos con Zocdoc en 2019 [57]. Hay algo más de fondo: hoy
  la promesa de ONIA es **retener** ("el paciente con tratamiento a medias que no volvió", [R6]). Un
  directorio promete **captar**, y esa promesa la clínica la mide todos los meses [R8].
- **El paciente cruceño:** *"Le escribo al WhatsApp del dentista que me recomendaron"* [inferencia; el repo
  ya define a WhatsApp como el canal del boliviano, R12].
- **Para (a), el sindicato de transporte:** el DS 5199 salió "a solicitud del sector de transporte
  sindicalizado" [8], y los mototaxistas bloquearon la alcaldía de SCZ en 2024 [12].

**3. Qué se rompe si sale bien.**
Si el directorio funciona, ONIA pasa a ser **un negocio B2C**: reclamos de pacientes, reseñas que moderar,
inasistencias y datos de salud de terceros. Eso **rompe el techo de soporte de una persona** [R1 §9]
justo cuando la base B2B lo estaba llenando. Y puede **enemistar a ONIA con su propio cliente**: el que
paga el sistema ve que ONIA le manda pacientes a la clínica de enfrente. En (a), el éxito trae además la
responsabilidad por la seguridad y la situación laboral de conductores y repartidores.

**Si la idea es buena, se dice:** **la aspiración de fondo es buena.** Tener una red con efectos de red es
el foso más fuerte que existe, y el SaaS vertical de ONIA es la semilla correcta; AgendaPro, Toast y
Mindbody lo confirman. Lo que está mal es la **categoría** (movilidad y delivery) y el **momento** (con 0
clientes).

**Veredicto:**
- **(a) Frená, sin gatillo**, mientras la estrategia sea no levantar capital.
- **(b/d) Avanzá cambiando X**: cambiá "marketplace" por **"red"**, y **no construyas nada nuevo ahora**. Lo
  que ya existe (reserva pública + bot) funciona como modo single-player para los primeros 5 clientes.
  **Medí** desde el cliente 1 qué parte de los pacientes nuevos reserva en línea, y cuántas derivaciones
  pide una clínica.
- **(b) Frená hasta verificar** ≥50 clínicas activas en SCZ con el soporte fuera de Sergio Urcullo.

---

## 8. Conclusión

**Qué marketplace es realista para ONIA:** una **red de clínicas de Santa Cruz nacida de Onia Platform**.
Primero es **B2B**: derivaciones entre profesionales y órdenes al laboratorio, sin salir a buscar
consumidores. Después viene un **directorio con reserva para pacientes**, idealmente **por WhatsApp**,
donde el bot de ONIA ya es una ventaja real. **No** un Uber, un Yango ni un PedidosYa.

**Cuándo, y qué número lo destraba:**

| Paso | Condición numérica | Etapa |
|---|---|---|
| 0. Modo single-player (link de reserva + bot por clínica) | Ya existe [R5]. Sólo **medir**: % de pacientes nuevos que reserva en línea | **Hoy** (Etapa 1), sin construir nada |
| 1. Red de derivaciones (d1) | **≥5 clientes pagando** + horas de soporte medidas **y** ≥10 clínicas pagando en SCZ con ≥3 especialidades (o que un cliente lo pida) | v1.3 |
| 2. Red con laboratorios (d2) | 1 laboratorio con ≥10 clínicas + ≥3 clínicas de ONIA que trabajen con él | v1.3+ |
| 3. Directorio para pacientes (b) | **≥50 clínicas pagando y activas en SCZ**, ≥20% de pacientes nuevos reservando en línea, **y el soporte ya fuera de Sergio Urcullo** | **Etapa 4** |
| 4. B2B de insumos (c) | ≥50 clínicas con kardex activo + ≥3 distribuidores que piden entrar | Después del 3 |
| ✗ Marketplace general (a) | **No existe umbral interno** | Fuera de la estrategia |

**El número que resume todo es 50 clínicas activas en Santa Cruz.** No es casualidad que coincida con la
Etapa 4: una red necesita base instalada, y una persona sola no puede atender dos lados.

**Sugerencia para Sergio Urcullo** (este informe no toca el repo): anotar en §14 de
`ONIA_ESTRATEGIA_DE_EMPRESA.md` una entrada **"Red Onia (marketplace vertical)"** con los gatillos de la
tabla. La idea queda guardada con fecha y no compite con los 5 primeros clientes. Encaja con la regla de
§14: "sí, y va anotada acá con su fecha".

---

## 9. Qué no pude verificar

1. **Ninguna página se abrió** (egress bloqueado); todo sale de extractos del buscador. **Nada** cumple
   "verificar es MIRAR".
2. **Presupuesto de búsqueda agotado (200/200).** Quedaron sin investigar:
   - el mercado de insumos dentales en Bolivia (importadoras, márgenes, cuántas hay en SCZ);
   - cuántos laboratorios dentales hay en SCZ y a cuántas clínicas atiende cada uno;
   - estadísticas de e-commerce y Facebook Marketplace en Bolivia.
3. **Transporte por app:** no encontré cuotas de mercado; la lista actual de la ATT (si Uber e inDrive se
   registraron después de ene-2025); los conflictos gremiales de 2025-2026 en SCZ; ni cuánto invirtió Yango
   en Bolivia.
4. **Uber Eats en Bolivia hoy:** las fuentes son débiles y se contradicen.
5. **Densidad:** no hay cifra pública por ciudad para OpenTable, Mindbody ni AgendaPro. **El umbral de 50
   clínicas y el de 20% son derivaciones mías** (§5.3), a calibrar con datos propios.
6. **Si el marketplace de AgendaPro funciona en Bolivia:** sé que vende el SaaS en Bolivia [R9], pero no si
   tiene lado consumidor acá.
7. **"Dicotomía"** (reparto de honorarios por derivar) en el código de ética odontológica boliviano, y el
   marco legal para compartir datos de pacientes entre clínicas: sin fuente.
8. **Doctoralia "lista sin registrarse":** sale del extracto del buscador; no confirmado.
9. **Números con fuentes que se contradicen:** el tipo de cambio de fines de septiembre (12,02 vs 12,22); lo
   recaudado por Docplanner y Zocdoc (rangos amplios); la cifra de Rappi es de la **entidad colombiana**, no
   del grupo; el tamaño del delivery (USD 578 M) es un **modelo de Statista**.
10. **El estado real de la Agenda pública en producción** ([R5] dice 🟢): no se miró en esta sesión (fuera de
    alcance, sin acceso al VPS).
11. **Colateral, fuera de alcance:** según el blog de Turnito [33], **TuDoc** ofrecería gestión médica con
    **facturación SIAT** en Bolivia. Si es cierto, toca el foso de ONIA ("nadie más tiene SIAT"). Conviene
    verificarlo en otra sesión.

---

## 10. Fuentes

**Web** (fecha de la publicación; "s/f" = sin fecha visible en el extracto):

1. economy.com.bo, 2022-12-20 — Yango llegó a Santa Cruz — https://www.economy.com.bo/articulo/business/Yango-app-internacional-servicio-transporte-urbano-lleg%C3%B3-Santa-Cruz/20221220185429008863.html
2. ATB, 2025-09-23 — Yango lanza navegación de transporte público; ciudades — https://www.atb.com.bo/2025/09/23/yango-bolivia-lanza-navegacion-de-transporte-publico-con-seguimiento-de-buses-en-tiempo-real/
3. Construmarket, s/f — Yango lanza tarifa moto en SCZ — https://construmarket.com.bo/actualidad/yango-lanza-tarifa-de-moto-en-santa-cruz/
4. Opinión, 2021-10-29 — Uber celebra cinco años en SCZ y LPZ — https://www.opinion.com.bo/articulo/tecnologia/uber-celebra-anos-operacion-santa-cruz-paz/20211029124414841072.html
5. Wanderwallet, guía 2026 — "Does Uber work in Bolivia?" — https://wanderwallet.io/guides/bolivia/does-uber-work-in-bolivia/
6. El Deber / Bolivia Emprende, s/f (~2024) — inDrive 5 años, encuesta a >900 personas — https://eldeber.com.bo/te-puede-interesar/indrive-celebra-5-anos-en-bolivia-con-un-estudio-de-tendencias-de-aplicaciones-de-movilidad_375126/ · https://boliviaemprende.com/estudio/indrive-celebra-5-anos-en-bolivia-con-un-estudio-de-tendencias-de-aplicaciones-de-movilidad
7. Tecnopymes, 2023-04-26 — inDrive, primera plataforma con licencia en La Paz — https://tecnopymes.bo/2023/04/26/indrive-es-la-primera-plataforma-de-movilidad-con-licencia-de-operacion-en-la-paz-bolivia/
8. Los Tiempos, 2024-08-15 / Opinión, 2024-08-14 — DS 5199, registro en la ATT — https://lostiempos.com/actualidad/pais/20240815/apps-transporte-estan-obligadas-registrarse-att · https://www.opinion.com.bo/articulo/pais/gobierno-establece-que-aplicaciones-digitales-transporte-registren-att-sera-encargada/20240814124310953003.html
9. Los Tiempos, 2024-10-18 / Opinión, 2024-10-19 — reglamento de la ATT — https://www.lostiempos.com/actualidad/economia/20241018/att-aprueba-reglamento-registro-apps-transporte-publico · https://www.opinion.com.bo/articulo/pais/att-emite-reglamento-apps-transporte-deberan-constituirse-legalmente-bolivia/20241019085839958223.html
10. Los Tiempos, 2025-01-13 — Yango, Ñee, Chukuta Móvil y Chek registradas — https://www.lostiempos.com/actualidad/economia/20250113/yango-nee-chukuta-movil-chek-transporte-pasajeros-ya-estan-registradas · listado de la ATT: https://www.att.gob.bo/listado-atp
11. lapaz.bo, s/f — lanzamiento de Chukuta Móvil — https://lapaz.bo/lanzan-chukuta-movil-una-aplicacion-de-transporte-seguro-y-alcalde-destaca-que-es-un-producto-boliviano/
12. El Día, 2024-04-15 — mototaxistas exigen regular las apps (SCZ) — https://www.eldia.com.bo/2024-04-15/santa-cruz/mototaxistas-exigen-regulacion-de-aplicaciones-de-transporte-y-el-alcalde-se-compromete-a-mediar.html
13. eju.tv, 2020-08 — PedidosYa: dos años en Bolivia (primer pedido, 28-jul-2018) — https://eju.tv/2020/08/pedidosya-dos-anos-entregando-lo-mejor-en-bolivia-y-transformando-el-delivery-online/
14. Crunchbase / LinkedIn, s/f — NetComidas adquirida por PedidosYa (15-mar-2018) — https://www.crunchbase.com/organization/netcomidas-com · https://www.linkedin.com/company/netcomidas.com
15. Centro de socios de PedidosYa, s/f — >800 restaurantes y comercios — https://centrodesocios.pedidosya.com/blog/como-funciona-pedidosya-para-restaurantes-y-negocios-de-comida/
16. Centro de socios de PedidosYa Bolivia, s/f — 10% los primeros 30 días + Plus — https://centrodesocios.pedidosya.com/bo/blog/tres-formas-en-que-pedidosya-impulsa-el-crecimiento-de-tu-restaurante-socios-creditos-y-plus/
17. Chejefe, 2026 — comisión de PedidosYa en Argentina, 25-35% — https://www.chejefe.com/blog/independencia-de-las-apps/comision-pedidosya-argentina-2026
18. economy.com.bo, 2024-11-07 y 2024-03-26 — tablero del delivery; EGX Turbo — https://www.economy.com.bo/articulo/business/mueve-tablero-delivery-sector-hace-mas-competitivo/20241107092450015834.html · https://www.economy.com.bo/articulo/business/lanzan-app-delivery-egx-turbo-grandes-sorpresas-dinnova-2024/20240326235609012798.html
19. Vision360, 2026-09-22 / La Razón, 2026-09-23 — Yango Comida llega a La Paz con 206 restaurantes — https://www.vision360.bo/noticias/2026/09/22/68941-yango-comida-llega-a-la-paz-y-expande-su-servicio-de-delivery-en-bolivia · https://larazon.bo/espacio-empresarial/2026/09/23/yango-comida-llega-a-la-paz-y-expande-su-servicio-de-delivery-en-bolivia/
20. economy.com.bo, 2026-07-13 — MrBeast Burger por Yango Comida — https://www.economy.com.bo/articulo/business/mrbeast-burger-llega-bolivia-modelo-100-digital-proyecta-expandirse-todo-pais/20260713223404023251.html
21. La Razón, 2025-06-08 — el delivery moverá USD 578 M (Statista) — https://larazon.bo/economia-y-empresa/2025/06/08/comida-rapida-negocio-del-delivery-movera-unos-us-578-mm-en-2025/
22. Rest of World, 2022 / CAINCO, 2021-10-29 — Yummy compra Yaigo — https://restofworld.org/2022/yaigo-yummy-founder-delivery-startup/ · https://www.cainco.org.bo/empresaydesarrollo/2021/10/29/la-transnacional-yummy-compra-yaigo-la-exitosa-startup-boliviana-de-delivery/
23. Peru Retail, 2019 — Uber Eats llega a Bolivia — https://www.peru-retail.com/uber-eats-bolivia-con-mas-de-200-restaurantes-aliados/
24. Sensor Tower, 3T-2025 — top de apps de delivery en Bolivia — https://sensortower.com/blog/2025-q3-unified-top-5-food%20delivery%20services-units-bo-63da96fbe1714cfff1c1e5a1
25. Prensa de Doctoralia, jun-2026 — década de la fusión; 13 mercados; 300.000 profesionales — https://press.doctoralia.es/460266-doctoralia-y-docplanner-celebran-una-decada-desde-su-fusion-evolucionando-hacia-el-ecosistema-de-salud-impulsado-por-ia-mas-grande-del-mundo
26. El Financiero, 2026-01-27 — Docplanner alcanza la rentabilidad — https://www.elfinanciero.com.mx/mundo-empresa/2026/01/27/docplanner-alcanza-la-rentabilidad-y-consolida-su-apuesta-por-la-inteligencia-artificial-en-salud/
27. multiples.vc / bulldogjob, s/f — Docplanner: 2012, plataforma de opiniones — https://multiples.vc/private-comps/docplanner · https://bulldogjob.com/companies/profiles/102-docplanner-znanylekarz
28. Tracxn / startupfundraising / unquote — financiamiento de Docplanner — https://tracxn.com/d/companies/docplanner/__KCgaS_DKPvV6f0BwaWANO3K9sQcOAkKjrEj8rMmxGfs/funding-and-investors · https://startupfundraising.com/how-much-has-a-company-raised/docplanner · https://www.unquote.com/cee/news/3024909/docplanner-raises-finance-valuing-business-at-usd-1bn
29. Doctoralia Pro España, 2026 — precios Premium; perfil gratuito — https://pro.doctoralia.es/precios/para-especialistas · https://pro.doctoralia.es/productos/funcionalidades/perfil-gratuito
30. SaludBO, s/f — https://saludbo.com/
31. Tracxn, 2025/2026 — Doctor XD — https://tracxn.com/d/companies/doctorxd/__XGowyW3E_h-jxqjMGrhQ3Ke8EK1djytMHOw05Jiwhl4
32. ReservaSimple, 2026 — https://www.reservasimple.com/app-citas-dentista-bolivia · https://www.reservasimple.com/app-citas-medicos-bolivia
33. Blog de Turnito, 2026 (autointeresado) — https://turnito.app/blog/las-mejores-apps-de-turnos-para-medicos-en-bolivia-2026/
34. Directorios — https://doctorbolivia.com/odontologos-santa-cruz/ · https://www.medicoespecialista.com.bo/directorio-medico/medicos-santa-cruz/odontologos-en-santa-cruz · https://tuguiatusalud.com.bo/4-santa_cruz/5-santa_cruz_de_la_sierra/4-odontologos · https://www.boliviaentusmanos.com/guiamedica/7/odontologia.html
35. FM Bolivia, 2026 / Opinión, 2025-11-11 — plataforma del Ministerio de Salud — https://fmbolivia.com.bo/nacional/ministerio-de-salud-registra-673-803-fichas-digitales-y-336-centros-conectados-a-nueva-plataforma-sanitaria-20527 · https://www.opinion.com.bo/articulo/pais/salud-anuncia-sistema-electronico-programacion-citas-hospitales/20251111111542983360.html
36. Correo del Sur, 2026-02-12 / Red Uno, 2026-02 / La Razón, 2026-05-17 — QR 2025 — https://correodelsur.com/economia/20260212/bolivia-transacciones-con-qr-superan-los-us-51-2-millones-en-2025.html · https://www.reduno.com.bo/economia/bolivia-consolida-el-uso-del-qr-891-millones-de-transacciones-movieron-us-51-293-millones-en-2025-202621211959 · https://larazon.bo/economia-y-empresa/2026/05/17/pagos-con-qr-crecen-131-en-bolivia-y-consolidan-digitalizacion-financiera/
37. Vision360, 2025-10-07 / eju.tv, 2026-09 — billeteras móviles; pagos digitales — https://www.vision360.bo/noticias/2025/10/07/32771-billeteras-moviles-en-auge-existen-al-menos-8-en-bolivia-y-crecen-las-operaciones · https://eju.tv/2026/09/casi-la-mitad-de-los-pagos-en-bolivia-ya-son-digitales/
38. Wikipedia, "2026 Bolivian protests" (leída vía buscador el 2026-09-30) — https://en.wikipedia.org/wiki/2026_Bolivian_protests
39. Diario de Cuba / Mercado Herald, 2026 — flotación del 29-jun-2026 — https://diariodecuba.com/internacional/1784658022_68125.html · https://www.mercadoherald.com.mx/bolivia-dlar-oficial-vs-mercado-paralelo-en-2026/
40. Al Jazeera, 2026-05-07 / NPR, 2026-05-20 — protestas — https://www.aljazeera.com/economy/2026/5/7/protests-in-bolivia-escalate-amid-economic-turmoil-and-policy-demands · https://www.npr.org/2026/05/20/nx-s1-5828203/bolivia-capital-protests-crisis
41. Uber, 8-K 4T/año 2025, 2026-02-04 (take rate vía FourWeekMBA) — https://www.sec.gov/Archives/edgar/data/1543151/000154315126000011/uberq425earningspressrelea.htm · https://fourweekmba.com/uber-revenue-breakdown/
42. Irish Times, 2023-08-01 — Uber, primer beneficio operativo tras USD 31.500 M de pérdidas — https://www.irishtimes.com/business/2023/08/01/uber-makes-first-operating-profit-after-racking-up-315bn-of-losses/
43. Delivery Hero, resultados 2025 (2026) — https://www.deliveryhero.com/newsroom/delivery-hero-reports-adj-ebitda-up-30-in-2025-as-quick-commerce-and-key-markets-gain-momentum/
44. La República / Portafolio, 2026 — Rappi Colombia — https://www.larepublica.co/empresas/rappi-gano-210-176-millones-en-2025-y-tuvo-utilidad-por-segundo-ano-consecutivo-4437171 · https://www.portafolio.co/negocios/empresas/rappi-alcanza-la-rentabilidad-en-colombia-dejando-atras-casi-una-decada-de-perdidas-498279 · https://lexlatin.com/noticias/softbank-invierte-usd-1000-millones-en-rappi
45. Infobae, 2020-09-16 — Glovo vende LatAm a Delivery Hero — https://www.infobae.com/america/agencias/2020/09/16/delivery-hero-compra-las-operaciones-de-glovo-en-america-latina-por-230-mln-euros-2/
46. Cronista, 2020-10-22 / Milenio, 2020 — salidas de Uber Eats — https://www.cronista.com/infotechnology/it-business/Uber-Eats-descontinua-su-servicio-en-la-Argentina-y-Colombia-20201022-0002.html · https://www.milenio.com/negocios/uber-eats-sale-uruguay-honduras-5-paises
47. El Heraldo, 2022-10-21 — iFood sale de Colombia — https://www.elheraldo.co/economia/2022/10/21/ifood-se-va-de-colombia-cerrara-su-operacion-el-21-de-noviembre/
48. Forbes Colombia, 2022-11-08 / Bloomberg Línea, 2022-11-14 — Beat sale de LatAm — https://forbes.co/2022/11/08/negocios/termina-historia-de-beat-en-colombia-cierra-operaciones-en-latinoamerica · https://www.bloomberglinea.com/2022/11/14/beat-traspasa-pasajeros-y-conductores-a-cabify-tras-su-salida-de-latinoamerica/
49. lowcode.agency, 2026 / raftlabs (citado en [R4]) — fallas por liquidez — https://www.lowcode.agency/blog/liquidity-network-effects-in-two-sided-marketplaces · https://www.raftlabs.com/blog/two-sided-marketplace-failure-rate
50. Point Nine (Medium) / TechCrunch, 2016-12-01 — la tesis y su crítica — https://medium.com/point-nine-news/come-for-the-network-stay-for-the-tool-5206c5736b11 · https://techcrunch.com/2016/12/01/come-for-the-tool-stay-for-the-network-reconsidered/
51. OpenTable — https://en.wikipedia.org/wiki/OpenTable · https://yespress.io/opentable
52. Lenny's Newsletter / Stripe Atlas — la red atómica de Andrew Chen — https://www.lennysnewsletter.com/p/atomic-network · https://stripe.com/guides/atlas/andrew-chen-marketplaces
53. IPO de Mindbody, 2015 — https://www.renaissancecapital.com/Profile/MB.XX/MINDBODY/IPO · https://vator.tv/2015-05-12-fitness-business-software-firm-mindbody-files-for-ipo/
54. Mindbody, 2021-10-15 — completa la compra de ClassPass — https://www.mindbodyonline.com/company/press/mindbody-completes-acquisition-of-classpass
55. ex-ante.cl / Ecosistema Startup, 2026 — marketplace de AgendaPro; YC (fundada en 2014) — https://www.ex-ante.cl/negocios/agendapro-firma-chilena-gestiona-reservas/ · https://ecosistemastartup.com/agendapro-50m-reservas-y-22k-comercios-en-17-paises/ · https://www.ycombinator.com/companies/agendapro
56. Zocdoc, 2007 — lanzamiento en TechCrunch40 — https://www.zocdoc.com/about/news/zocdoc-launches-at-techcrunch40-conference-service-delivers-real-time-appointment-scheduling-for-doctors-and-patients/
57. CNBC, 2019-01-29 / Medscape, 2019 — Zocdoc pasa a cobrar por reserva — https://www.cnbc.com/2019/01/29/zocdoc-moves-ahead-with-its-new-business-model-change.html · https://www.medscape.com/viewarticle/912267
58. Tracxn / Fierce Healthcare, 2021 — financiamiento de Zocdoc; "rentable" — https://tracxn.com/d/companies/zocdoc/__u7y5XuU5yOA5ksSSVJuZbA3Hr6K34cRPdXvFgiNGep8/funding-and-investors · https://www.fiercehealthcare.com/tech/zocdoc-banks-150m-new-funding-as-it-expands-into-virtual-care-vaccine-scheduling
59. Fresha / Pabau, 2026 — https://www.fresha.com/pricing · https://pabau.com/blog/fresha-pricing/
60. Booksy, 2026 — https://biz.booksy.com/features/boost · https://biz.booksy.com/pricing
61. Toast Local — https://pos.toasttab.com/products/toast-local

**Repo** (`/home/user/onia-hermes/`, leído el 2026-09-30):

- R1 `hermes-content/docs/ONIA_ESTRATEGIA_DE_EMPRESA.md` (§2, §4, §6, §7, §8.3, §9, §10, §12, §14, §15)
- R2 `hermes-content/docs/ONIA_CATALOGO_DE_IDEAS.md`
- R3 `hermes-content/docs/research/ONIA_LLUVIA_IDEAS_SERGIO_ARTHUR_20260801.md` §3.12
- R4 `hermes-content/docs/ONIA_TEMAS_CHARLA_CONTESTADOS.md`
- R5 `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md` §5
- R6 `hermes-content/docs/ONIA_CLIENTE_IDEAL.md` §1-3
- R7 `hermes-content/docs/historial/ONIA_DENTALGEST_FISCAL_MERCADO_PRICING_20260725.md`
- R8 `hermes-content/docs/historial/ONIA_BENCHMARK_INDUSTRIA_20260807.md`
- R9 `hermes-content/docs/historial/ONIA_PRICING_SEGUNDA_REVISION_20260808.md`
- R10 `hermes-content/docs/historial/ONIA_MODULO_INMOBILIARIO_SPEC_20260808.md` · `…ALCANCE_20260806.md`
- R11 `hermes-content/docs/ONIA_ECOMMERCE_Y_DROPSHIPPING.md`
- R12 `hermes-content/docs/historial/ONIA_DENTALGEST_ESTRUCTURA_ULTIMA_MILLA_2026.md`
