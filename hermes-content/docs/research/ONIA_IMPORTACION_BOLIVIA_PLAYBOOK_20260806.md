# Importar productos a Bolivia — playbook operativo + caso base cargadores EV (2026-08-06)

**Carril:** I (research/estrategia) + fiscal Bolivia.
**Objetivo de la sesión:** dejar el camino completo de importación documentado, verificado
con fuentes y accionable, con caso base = cargadores eléctricos para condominios en Santa Cruz.
**Complementa** (no reemplaza) a `ONIA_RESEARCH_AGENTE_IMPORTACION_NUVIA_20260705.md`,
que cubre el lado agente/sourcing y el bloqueo del riel de pago.

---

## 0. Veredicto en 5 líneas

1. **Inscribirse como importador es barato, rápido y no compromete plata.** Hacerlo ya
   (Formulario 170, Aduana Nacional). No hay razón para esperar.
2. **El cargador EV entra con Gravamen Arancelario 0%** por el DS 4539 (partida
   8504.40.90.10). El único tributo real de frontera es el **IVA 14,94%, que es crédito
   fiscal recuperable** si facturás. El producto es fiscalmente casi ideal.
3. **El negocio NO está en vender la caja.** La tarifa de recarga en Bolivia está
   **regulada por la AETN** (Bs 1,01–2,15/kWh). El margen recurrente está en el **software
   que reparte y cobra el consumo por departamento** dentro del condominio.
4. **No importar un contenedor todavía.** Vender e instalar 2–3 condominios primero con
   muestra aérea/compra local. Recién con demanda probada, importar volumen.
5. **Trampa a verificar antes de comprar:** cargadores con WiFi/4G pueden requerir
   **homologación ATT**. Un contenedor parado en aduana por eso te mata el flujo.

---

## 1. La maquinaria: cómo se importa a Bolivia

### 1.1 Quién tiene que estar inscrito

| Registro | Dónde | Para qué |
|---|---|---|
| **NIT / Padrón Biométrico Digital** | SIN | Existir fiscalmente. Ya lo tenés (NIT 5371375010, OniaAgency). |
| **Matrícula de Comercio** | SEPREC | Requisito del registro aduanero. Ya la tenés (5371375010). |
| **Registro de Importador — Formulario 170** | Aduana Nacional, Unidad de Servicio a Operadores (USO) | Habilita a importar. Se inicia **online por el portal SUMA** y se cierra **presencial** con originales. |
| **Agencia Despachante de Aduana (ADA)** | Privada, se contrata | Hace la DUI. La Ley 1990 permite despacho directo por el importador, pero en la práctica todo el mundo usa ADA. |

Requisitos del Formulario 170 (Importador Habitual, persona jurídica):
certificado de registro en el Padrón del SIN, CI del titular/representante legal,
testimonio de poder si corresponde, Matrícula de Comercio del SEPREC.
Fuente: [Aduana Nacional — importador habitual](https://www.aduana.gob.bo/infosuma/operadores.php?op=2),
[IBCE — información para importar](https://ibce.org.bo/haga-negocios-informacion-para-importar.php).

> **Habitual vs. No Habitual:** existe un umbral de valor CIF anual que separa ambas
> categorías. **No pude verificar la cifra exacta** — la fuente secundaria la trae truncada
> ("Bs 37.-") y la página oficial de la ANB no la publica. **Preguntarlo en la USO al hacer
> el trámite.** Para un plan de importar contenedores, la categoría correcta es **Habitual**
> de todos modos.

### 1.2 Autorizaciones previas (matan operaciones si te enterás tarde)

Antes de embarcar, no antes de despachar. Se tramitan por la **VUCE** (vuce.gob.bo):

| Entidad | Qué controla |
|---|---|
| **ATT** | **Equipos de telecomunicaciones → homologación obligatoria.** Aplica a cualquier equipo con radio (WiFi, Bluetooth, 4G). |
| **IBMETRO** | Productos con Reglamento Técnico / etiquetado energético → Registro IBMETRO + **CRTM** (Certificado de Conformidad con Reglamento Técnico). |
| SENASAG | Alimentos, agro, madera. |
| Min. Salud | Fármacos, cosméticos, dispositivos médicos, productos para bebés. |
| ANH | Hidrocarburos y derivados. |
| Min. Obras Públicas | Vehículos y aeronaves. |

Fuentes: [IBCE](https://ibce.org.bo/haga-negocios-informacion-para-importar.php),
[ATT — homologación](https://www.att.gob.bo/en/homologacion),
[VUCE — certificado ATT](https://www.vuce.gob.bo/es/ATT_certificado_equipos_telecomunicaciones_requisitos),
[IBMETRO — CRTM](https://ibmetro.gob.bo/crtm).

### 1.3 El despacho, paso a paso

1. Proveedor embarca; llega factura comercial (FOB detallada), packing list, BL/AWB,
   certificado de origen si aplica, póliza de seguro, factura de flete internacional.
2. Mercadería entra a depósito aduanero → parte de recepción.
3. ADA presenta la **DUI** por el sistema SIDUNEA.
4. SIDUNEA asigna **canal**: **verde** (libre), **amarillo** (revisión documental),
   **rojo** (documental + aforo físico).
5. **Pago de tributos en Banco Unión dentro de 3 días hábiles** de aceptada la DUI.
6. Levante y libre circulación.

### 1.4 Fórmula de costos de frontera

```
CIF        = FOB + flete internacional + seguro
GA         = CIF × alícuota de la partida        (0 / 5 / 10 / 15 / 20 / 35 / 40 %)
Verificación ≈ 1 % – 1,75 % del FOB              (las fuentes discrepan; confirmar con la ADA)
Base IVA   = CIF + GA + verificación + otras erogaciones no facturadas
IVA        = Base IVA × 14,94 %                  ← CRÉDITO FISCAL si facturás
Honorarios ADA ≈ 0,5 % – 2 % del CIF             (tarifario, decreciente por monto)
+ almacenaje, ASPB, transporte interno, garantías de contenedor
```

Regla general: **GA 10%** para bienes de consumo; **5% / 0%** para bienes de capital.
Fuentes: [Bolivia Impuestos — impuestos para importación](https://boliviaimpuestos.com/impuestos-para-importacion-en-bolivia/),
[IBCE](https://ibce.org.bo/haga-negocios-informacion-para-importar.php).

**Lo importante que casi nadie dice:** el IVA de importación **no es costo**, es crédito
fiscal — siempre que vendas con factura en régimen general. Quien vende informal se come
el 14,94% entero. Eso es una ventaja competitiva estructural para nosotros.

### 1.5 Ventanas de arancel cero vigentes (hasta 31-dic-2026)

- **DS 5516** — GA 0% para maquinaria, equipos y unidades funcionales de industria
  alimentaria, agroindustria, textil, metalúrgica, minería, neumáticos, lubricantes,
  baterías y repuestos (Anexos 3 y 4).
  [Red Uno](https://www.reduno.com.bo/economia/arancel-cero-que-sectores-se-benefician-y-hasta-cuando-rige-la-medida-segun-el-ds-5516-202611474925) ·
  [Moreno Baldivieso](https://emba.com.bo/decreto-supremo-n5516/)
- **DS 5518** — GA 0% para celulares, computadoras, tablets y electrónicos.
  [Visión 360](https://www.vision360.bo/noticias/2026/01/14/38407-el-gobierno-libera-de-aranceles-a-celulares-computadoras-tabletas-y-otros-productos-tecnologicos)

Ambos **caducan el 31-dic-2026**. Si un producto tuyo cae ahí, la ventana de importación
barata es **este semestre**.

---

## 2. Ruta física y el riel de pago

### 2.1 Rutas hacia Santa Cruz

| Ruta | Tránsito | Comentario |
|---|---|---|
| **China → Arica (Chile) → Tambo Quemado → SCZ** | ~35–45 días + terrestre | Arica maneja >70% de la carga marítima boliviana. Corredor consolidado. |
| **China → Iquique / ZOFRI → SCZ** | similar | ZOFRI sirve para **consolidar, almacenar y reexportar** — útil para importar de a poco sin traer todo de golpe. |
| **China → Hidrovía Paraguay-Paraná → Puerto Aguirre / Quijarro** | 35–45 días | Único acceso con soberanía boliviana, y **está en el propio departamento de Santa Cruz**. Cotizar SIEMPRE contra Arica. |

Costos referenciales (a cotizar, no tomar como precio): contenedor 20' China→Chile
**USD 1.500–2.800**; las navieras piden **depósito de garantía de USD 1.000–2.000 por
contenedor** para liberarlo en Arica/Iquique.
Fuentes: [Delpa Group](https://www.delpagroup.com/es/guias/costo-flete-maritimo-china-chile),
[ch-shipping](https://ch-shipping.com/blog/es/importar-de-china-a-bolivia),
[Puerto Aguirre](https://es.wikipedia.org/wiki/Puerto_Aguirre_(Bolivia)).

Despachantes en Santa Cruz para cotizar: Procomex, Santa Cruz Dispatchers, Sincomex,
Oriental SRL, Grupo Empresarial Global.

### 2.2 Pagar al proveedor — el cuello de botella boliviano

Al **6-ago-2026** el tipo de cambio oficial BCB está en **~Bs 11,86/USD** y el paralelo
en **~Bs 11,62**: tras la flotación de junio, **la brecha prácticamente se cerró**
(≈ –3%). Fuente: [BCB](https://www.bcb.gob.bo/tco_reporte_detalle_historico.php),
[dolarbolivia.net](https://dolarbolivia.net/).

Qué significa para importar:
- **Buena noticia:** ya no hay que costear con dólar paralelo un 35–40% por encima del
  oficial. El costeo en USD volvió a ser predecible.
- **Mala noticia:** el dólar subió 63% respecto del viejo 6,96. **Todo importado cuesta
  63% más en bolivianos que en 2025.** El precio de venta tiene que llevar cláusula de
  ajuste; nunca "precio de por vida" (ver memoria `bolivia-devaluacion-2026-impacto`).
- **Sigue vigente:** tarjeta de crédito boliviana tiene topes bajos para compras
  internacionales. Los contenedores se pagan por **transferencia bancaria / L-C**, no por
  checkout. Presupuestar tiempo para conseguir la transferencia.

---

## 3. Caso base — cargadores EV para condominios en Santa Cruz

### 3.1 ¿Hay mercado? Sí, y el driver no es el que parece

- **>7.000 vehículos eléctricos y híbridos enchufables** circulando en Bolivia;
  **importaciones +226% entre 2024 y 2025**.
  [EnergyPress](https://www.energypress.com.bo/2026/05/30/electropoint-lanza-en-bolivia-la-primera-red-de-carga-super-rapida-para-vehiculos-electricos/)
- **Santa Cruz concentra >36% del parque automotor nacional** y 34,4% de la gama alta/SUV
  — que es exactamente el comprador de un EV.
  [Economy](https://www.economy.com.bo/articulo/economia/santa-cruz-lidera-crecimiento-parque-automotor-36-total-nacional/20250613120057018794.html)
- **El driver real es la escasez de combustible**, no la conciencia ambiental. Las colas de
  gasolina/diésel y el precio empujan la conversión. Eso hace la demanda mucho menos
  elástica de lo que parece.
  [La Razón](https://www.la-razon.com/economia/2025/03/20/electromovilidad-ascenso-autos-electricos-bolivia-electrificacion-del-transporte/)
- Proyección del sector: **20% del parque eléctrico al 2030** (~400.000 unidades).
  Tomarlo como techo optimista, no como plan.
- **El cuello de botella declarado del sector es la infraestructura de carga**, no los autos.
  [El Post — "electrolineras insuficientes"](https://elpost.com.bo/2026/02/07/electrolineras-insuficientes-el-freno-silencioso-del-auto-electrico/)

### 3.2 Marco legal específico — esto define el negocio

**(a) Arancel: DS 4539 (7-jul-2021) pone GA 0% a la infraestructura de carga.**

| Partida NANDINA | Producto | GA |
|---|---|---|
| **8504.40.90.10** | **Estaciones de carga (sistemas de recarga eléctrica)** | **0%** |
| 8504.40.90.20 | Inversores | 0% |
| 9028.30.90.10 | Medidores bidireccionales | 0% |
| 9028.30.90.20 | Medidores inteligentes | 0% |

El Anexo IV (infraestructura de carga) **no tiene fecha de caducidad**; los 5 años de
vigencia del DS aplican al **ICE de vehículos**, no a los cargadores.
Fuente: [DS 4539 — Lexivox](https://www.lexivox.org/norms/BO-DS-N4539.xhtml).

> **Verificar antes de comprar:** no pude abrir el AAI-2026 oficial (PDF del MEFP con
> error de certificado) para confirmar que el arancel vigente 2026 mantiene el 0% en esa
> subpartida. **Pedir a la ADA una clasificación arancelaria por escrito antes de embarcar.**
> Es gratis y elimina el riesgo.

**(b) Vehículos: DS 5653 (9-jul-2026)** fija ICE **0% para eléctricos puros** y 0%–20% para
híbridos, **hasta el 31-dic-2026**. Es sobre vehículos, no sobre cargadores, pero define
cuánto crece tu mercado este semestre.
[ABI](https://abi.bo/decreto-5653-fija-alicuotas-del-ice-para-la-importacion-de-vehiculos-electricos-e-hibridos-hasta-diciembre-de-2026/) ·
[La Razón](https://larazon.bo/economia-y-empresa/2026/07/10/gobierno-fija-alicuotas-impositivas-de-0-a-20-para-importacion-de-vehiculos-electricos/)

**(c) LA RESTRICCIÓN CLAVE: la tarifa de recarga está regulada por la AETN.**

Los tres reglamentos del DS 4539 establecen:
1. **Tarifa por kWh regulada: desde Bs 1,01 (carga lenta) hasta Bs 2,15 (carga rápida)**,
   con bloques horarios — bajo (00:01–07:00), medio (07:01–18:00 y 23:01–00:00), alto
   (18:01–23:00).
2. Requisitos técnicos y de seguridad de las estaciones.
3. **Requisitos para que un ciudadano o empresa instale una estación pública o privada**,
   derechos y obligaciones del propietario, y **sanciones** por incumplimiento.

Fuentes: [energiabolivia](https://energiabolivia.com/index.php?Itemid=172&catid=54&id=7966),
[Mobility Portal](https://mobilityportal.lat/bolivia-presenta-tarifas-y-requisitos-para-instalar-puntos-de-carga-de-vehiculos-electricos/),
[ABI](https://www.abi.bo/index.php/noticias/politica/36-notas/noticias/economia/12726).

**Traducción al negocio:** no podés inventar el precio del kWh. El spread entre lo que la
CRE te cobra y lo que podés cobrarle al usuario **está acotado por norma**. Cualquier
modelo que dependa de arbitrar el precio de la energía tiene techo legal.

**(d) Instalación:** rige la **NB 777** (diseño y construcción de instalaciones eléctricas
interiores <1000 V). Multifamiliares requieren proyecto eléctrico aprobado. La distribuidora
en Santa Cruz es la **CRE**, con tarifas fijadas por la AETN.
[CRE — tarifas](https://www.cre.com.bo/entender-mi-consumo/conoce-las-tarifas/)

### 3.3 Competencia — y por qué el condominio sigue libre

| Jugador | Qué hace | Solapamiento con condominios |
|---|---|---|
| **ElectroPoint (E2V)** | Red de carga **súper rápida DC**: estación de 240 kW, USD 300.000 de inversión, 6 vehículos simultáneos, 80% en <30 min. 5 estaciones en SCZ antes de sep-2026. Alianza NexoCorp / Farmacorp / Amarket. App propia. | **Bajo.** Es carga pública de paso, en retail de alto tráfico. |
| **Huawei + DMC** | Primera estación con tecnología integral Huawei de Latinoamérica, carga ultrarrápida. | **Bajo.** Mismo segmento que ElectroPoint. |

Ambos están peleando la **carga rápida pública** (capital intensivo, USD 300k por sitio).
**Nadie está atacando la carga lenta AC dentro del edificio donde el auto duerme 10 horas.**
Ese es el hueco. Y es el caso de uso dominante: el 80–90% de la carga de un EV particular
ocurre en casa.

Fuentes: [EnergyPress](https://www.energypress.com.bo/2026/05/30/electropoint-lanza-en-bolivia-la-primera-red-de-carga-super-rapida-para-vehiculos-electricos/),
[El Diario](https://www.eldiario.net/portal/2026/06/14/santa-cruz-ya-tiene-la-primera-electrolinera-privada-super-rapida/),
[ATB](https://www.atb.com.bo/2026/06/03/huawei-y-dmc-inauguran-la-primera-estacion-electrica-vehicular-con-tecnologia-integral-huawei-en-latinoamerica/).

### 3.4 El problema real del condominio (que el hardware no resuelve)

Un condominio con 40 parqueos y 3 autos eléctricos tiene tres problemas, en este orden:

1. **¿Quién paga la luz?** El medidor de áreas comunes es uno solo. Si Juan carga su auto,
   lo paga el edificio entero. **Ese es el conflicto que frena la instalación**, no el precio
   del cargador.
2. **¿Aguanta la acometida?** Si tres vecinos cargan a 7,4 kW simultáneamente son 22 kW
   extra sobre un tablero dimensionado en 1998. Sin **balanceo dinámico de carga**, salta
   el térmico general.
3. **¿Quién autoriza?** Asamblea de copropietarios. Ciclo de venta largo, decisión colectiva.

**El cargador con OCPP resuelve (1) y (2) por software.** Vender la caja sin la capa de
gestión es vender el problema, no la solución.

### 3.5 Modelo de negocio — tres opciones y la recomendación

| Modelo | Cómo | Veredicto |
|---|---|---|
| **A. Vender hardware** | Importás y revendés cargadores. | Margen de una vez, competible por precio, capital inmovilizado. **Necesario pero insuficiente.** |
| **B. Vender kWh (CPO)** | Ponés el cargador gratis y cobrás la recarga. | **Techo legal AETN (Bs 1,01–2,15/kWh)** + payback largo + te volvés operador regulado. **No con este runway.** |
| **C. Hardware + SaaS de gestión** ✅ | Vendés/instalás el equipo con margen, y cobrás **mensual por departamento** por la plataforma que mide, prorratea y cobra el consumo de cada residente, balancea la carga y reporta al administrador. | **Recomendado.** Es exactamente lo que ONIA sabe hacer, es recurrente, y no es replicable por un importador de cajas. |

**El modelo C es un vertical nuevo de ONIA Platform**, no un negocio aparte: cliente =
administrador de condominio, entidades = residentes / medidores / sesiones de carga /
facturación prorrateada. Encaja con el core existente. Coherente con la regla
`onia-vende-software-nunca-horas`.

### 3.6 Costeo ilustrativo (⚠️ ESTIMACIÓN, no cotización)

Escenario: 100 wallboxes AC 7,4 kW, Type 2, OCPP 1.6J, sin módulo celular.

| Concepto | USD | Nota |
|---|---|---|
| FOB China (100 × ~200) | 20.000 | **A cotizar.** Rango de mercado típico USD 100–250/u según MOQ. |
| Flete LCL China→Arica + terrestre a SCZ | 2.500 | ~2 m³, a cotizar |
| Seguro (~0,5% CIF) | 120 | |
| **CIF** | **22.620** | |
| GA 0% (DS 4539) | 0 | ← la ventaja |
| Verificación (1%–1,75% FOB) | 200–350 | |
| Honorarios ADA (0,5%–2% CIF) | 115–450 | |
| Almacenaje / ASPB / gastos | 300–600 | |
| **Subtotal costo real** | **~23.300–24.000** | **≈ USD 233–240/unidad** |
| IVA importación 14,94% | ~3.410 | **crédito fiscal, no costo** |

A un PVP instalado de USD 550–750 por punto de carga (equipo + instalación + puesta en
marcha), el margen bruto de hardware es sano — **pero el valor recurrente está en el
mensual del SaaS**, que no consume capital ni tiene riesgo de inventario.

### 3.7 Riesgos, sin maquillaje

| Riesgo | Severidad | Mitigación |
|---|---|---|
| **Homologación ATT** por WiFi/4G frena el contenedor | Alta | Comprar la variante **Ethernet/RS485 sin radio**, o iniciar homologación ANTES de embarcar. Consultar el listado de equipos sujetos a homologación de la ATT. |
| Clasificación arancelaria distinta a 8504.40.90.10 → GA 10% | Media | Pedir clasificación por escrito a la ADA antes de embarcar. |
| **Garantía / RMA a 12.000 km** | Alta | Exigir 3 años de garantía + **stock de repuestos en el mismo embarque** (3–5% de unidades). Elegir proveedor con RMA escrito, no el más barato. |
| Capital inmovilizado con runway corto (~11 semanas) | **Alta** | **No importar contenedor antes de vender.** Muestra aérea de 2–3 unidades para el primer piloto. |
| Ciclo de venta por asamblea de copropietarios | Media | Vender al **administrador de condominio**, no al residente. Un administrador maneja 5–15 edificios: es un canal, no un cliente. |
| Cambio normativo AETN sobre tarifas | Media | El modelo C (SaaS) no depende del spread del kWh. |
| Devaluación adicional | Media | Precios con cláusula de ajuste al TC del día. |

---

## 4. Proveedores — cómo elegir sin quemar plata

**Fabricantes chinos de wallbox AC con OCPP 1.6 identificados** (todos vía Made-in-China /
sitios propios; ninguno verificado por nosotros aún):
Sichuan Greentech YT New Energy · EVSPB Charge (Guangdong) · EVCOME · Estar ·
XTECK · Cedars · VSCHNEL (Nanjing) · Hengyi.

**Criterios de descarte, en orden:**
1. **OCPP 1.6J real y documentado** (no "compatible"). Sin esto no hay SaaS.
2. Certificaciones **CE + IEC 61851**, y que te manden el certificado, no una foto.
3. **Balanceo dinámico de carga** nativo o vía controlador. Sin esto no vendés en edificios viejos.
4. Variante **sin módulo de radio** disponible (riesgo ATT).
5. Garantía ≥3 años por escrito y política de RMA.
6. MOQ y precio — **último**, no primero.

**Antes de comprar:** una muestra pagada de 2 unidades por courier aéreo. Probarla contra
nuestro backend OCPP. Recién después, contenedor. Regla `gasto-plataformas-validar-primero`
aplicada a hardware.

**Alternativa regional a cotizar en paralelo:** proveedores de Brasil (WEG y similares)
entrando por Puerto Suárez/Quijarro — flete mucho más corto, garantía más manejable,
precio más alto. Vale la comparación para el piloto.

---

## 5. Plan de acción — 30 / 60 / 90 días

### Semana 1–2 — inscripción y validación (costo ~0, no compromete capital)
- [ ] Presentar **Formulario 170** en la USO de la Aduana Nacional (online SUMA + presencial).
      Preguntar ahí el umbral habitual/no habitual.
- [ ] Contratar/entrevistar **2 agencias despachantes** en Santa Cruz. Pedir tarifario escrito.
- [ ] Pedir a la ADA **clasificación arancelaria por escrito** de "estación de carga AC
      7,4 kW para vehículo eléctrico" y confirmación del GA vigente 2026.
- [ ] Consultar en la **ATT** si un wallbox con WiFi está en el listado de equipos sujetos
      a homologación, y el costo/plazo si lo está.
- [ ] Consultar en **IBMETRO** si existe reglamento técnico aplicable a EVSE.

### Semana 2–4 — validar demanda antes de gastar
- [ ] Listar administradoras de condominios de Equipetrol / Urubó / zona norte.
      Objetivo: **5 conversaciones**, no 50.
- [ ] Pregunta de validación (no pitch): *"¿algún propietario ya te pidió instalar un
      cargador? ¿cómo resolvieron quién paga la luz?"* — si nadie lo pidió, la demanda
      todavía no llegó y hay que esperar; si ya pasó, tenés el dolor exacto.
- [ ] Cotizar a 3 fabricantes chinos + 1 brasileño. Pedir ficha técnica, certificado CE/IEC
      y confirmación OCPP 1.6J.

### Mes 2 — piloto
- [ ] Muestra aérea de 2 unidades.
- [ ] **Un condominio piloto**, con instalación cobrada (no regalada).
- [ ] MVP del SaaS: medición por sesión, prorrateo por departamento, reporte al administrador.
      Reusar ONIA Core, no escribir un producto nuevo.

### Mes 3 — recién acá se importa
- [ ] Con ≥2 instalaciones pagadas y el SaaS funcionando, cotizar el primer embarque LCL.
- [ ] Comparar rutas **Arica vs. Hidrovía/Puerto Aguirre** con números reales.

---

## 6. Qué NO pude verificar (para no inventar)

1. **Umbral Bs de importador habitual vs. no habitual** — fuente truncada, la ANB no lo
   publica. Preguntar en la USO.
2. **GA vigente 2026 de la subpartida 8504.40.90.10** — el PDF oficial del AAI-2026 del MEFP
   no abrió (error de certificado TLS). El DS 4539 la fija en 0% y no hay indicio de cambio,
   pero **exigir clasificación escrita de la ADA**.
3. **Tasa de verificación**: las fuentes dan 1% del FOB (IBCE) y 1,75% del FOB
   (Bolivia Impuestos). Confirmar con la ADA.
4. **Precios FOB reales de wallboxes** — los rangos citados son de mercado, no cotizaciones.
5. **Si existe un reglamento técnico IBMETRO específico para EVSE** — no encontré uno;
   ausencia de evidencia, no evidencia de ausencia.
6. **Texto completo de los 3 reglamentos AETN del DS 4539** — sólo tengo la cobertura de
   prensa de su presentación. Bajar los originales de aetn.gob.bo antes de firmar contratos.

---

## 7. Push-back honesto

Con ~11 semanas de runway y cero clientes SaaS pagando, **importar hardware es la peor
forma posible de usar el capital**: inmoviliza plata en inventario, agrega riesgo cambiario,
riesgo aduanero y responsabilidad de posventa a 12.000 km — para vender una caja que
cualquiera puede importar el mes que viene.

Lo que **sí** vale hacer ahora, porque cuesta casi nada y abre la puerta:
**inscribirse como importador** y **validar la demanda con 5 administradores**.
Si la demanda está, el hardware es un medio para colocar el SaaS. Si no está, perdiste
dos semanas de trámites en lugar de un contenedor.

**El activo defendible no es el cargador. Es el software que le dice al administrador
cuánto le debe cobrar al departamento 7B.**

---

## Fuentes principales

- [Aduana Nacional — registro importador habitual](https://www.aduana.gob.bo/infosuma/operadores.php?op=2)
- [IBCE — información para importar en Bolivia](https://ibce.org.bo/haga-negocios-informacion-para-importar.php)
- [Bolivia Impuestos — impuestos para importación](https://boliviaimpuestos.com/impuestos-para-importacion-en-bolivia/)
- [Ley 1990 — Ley General de Aduanas](https://www.aduana.gob.bo/lga-view)
- [DS 4539 (electromovilidad, arancel 0% infraestructura de carga)](https://www.lexivox.org/norms/BO-DS-N4539.xhtml)
- [DS 5653 (ICE vehículos eléctricos/híbridos 2026) — ABI](https://abi.bo/decreto-5653-fija-alicuotas-del-ice-para-la-importacion-de-vehiculos-electricos-e-hibridos-hasta-diciembre-de-2026/)
- [DS 5516 (arancel cero sectores estratégicos) — Moreno Baldivieso](https://emba.com.bo/decreto-supremo-n5516/)
- [ATT — homologación de equipos](https://www.att.gob.bo/en/homologacion) · [VUCE — requisitos](https://www.vuce.gob.bo/es/ATT_certificado_equipos_telecomunicaciones_requisitos)
- [IBMETRO — CRTM](https://ibmetro.gob.bo/crtm) · [registro](https://www.ibmetro.gob.bo/obtencion-ibmetro)
- [AETN — reglamentos de estaciones de carga y tarifas](https://energiabolivia.com/index.php?Itemid=172&catid=54&id=7966) · [Mobility Portal](https://mobilityportal.lat/bolivia-presenta-tarifas-y-requisitos-para-instalar-puntos-de-carga-de-vehiculos-electricos/)
- [ElectroPoint / E2V — red de carga rápida](https://www.energypress.com.bo/2026/05/30/electropoint-lanza-en-bolivia-la-primera-red-de-carga-super-rapida-para-vehiculos-electricos/)
- [Huawei + DMC — estación integral](https://www.atb.com.bo/2026/06/03/huawei-y-dmc-inauguran-la-primera-estacion-electrica-vehicular-con-tecnologia-integral-huawei-en-latinoamerica/)
- [El Post — electrolineras insuficientes](https://elpost.com.bo/2026/02/07/electrolineras-insuficientes-el-freno-silencioso-del-auto-electrico/)
- [BCB — tipo de cambio oficial](https://www.bcb.gob.bo/tco_reporte_detalle_historico.php)
- [CRE — tarifas Santa Cruz](https://www.cre.com.bo/entender-mi-consumo/conoce-las-tarifas/)
- [Norma Boliviana NB 777](https://www.studocu.com/bo/document/universidad-autonoma-gabriel-rene-moreno/ing-industrial/457625643-324179963-la-norma-boliviana-nb-777-docx/88483533)
