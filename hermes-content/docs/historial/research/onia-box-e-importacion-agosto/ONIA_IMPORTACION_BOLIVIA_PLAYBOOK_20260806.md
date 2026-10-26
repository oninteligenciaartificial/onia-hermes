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

### 3.5-bis Cómo se cobra, en concreto

**La Resolución AETN 479/2021 distingue tres tipos de instalación:** (a) particular en
vivienda, oficina o taller; (b) **en edificios o multifamiliares**; (c) autoservicio con
acceso público. La tarifa regulada por kWh es la de la **electrolinera de servicio al
público**. El condominio cae en la categoría (b), que es otra cosa.
[Bíptico AETN/MHE](https://www.studocu.com/bo/document/universidad-mayor-de-san-simon/ingenieria-automotriz/biptico-electrmovilidad/81168043) ·
[energiabolivia](https://energiabolivia.com/index.php?Itemid=172&catid=54&id=7966)

Tarifa de carga **lenta** en electrolinera pública, para referencia:
**Bs 1,01** bloque bajo (00:01–07:00) · **Bs 1,18** medio (07:01–18:00) · **Bs 1,86** alto
(18:01–23:00). La carga rápida llega a Bs 2,15.

#### Medición
Con OCPP 1.6J el cargador es un terminal de venta, no un enchufe:
1. El residente se identifica por **RFID** (lo más barato y confiable) o app.
2. El cargador consulta al backend si está autorizado → habilita.
3. Al terminar envía `StopTransaction` con los **kWh medidos por el medidor interno**.
4. Queda un registro por sesión: quién, cuándo, cuántos kWh, en qué bloque horario.

**Exigir medidor MID o equivalente IEC.** Con un medidor no certificado, cualquier
copropietario puede impugnar el cobro y el administrador queda en el medio.

#### Las tres formas de cobrar

| Modelo | Cómo funciona | Veredicto |
|---|---|---|
| **A. Prorrateo en la expensa** ✅ | Un solo medidor CRE. La plataforma calcula los kWh de cada residente y el administrador **agrega la línea a la expensa mensual**. | **Recomendado.** Nadie vende electricidad: es recuperación de gasto común entre copropietarios. No sos electrolinera, no entrás en la tarifa regulada, y **no hace falta ningún medio de pago nuevo** — la expensa ya se cobra. |
| **B. Prepago con QR** | El residente carga saldo por **QR Simple** (sin comisión ni para el comercio ni para el cliente); el saldo habilita el RFID. | Complemento útil para visitas y morosos. |
| **C. Cobrar vos el kWh (CPO)** | Vendés energía al usuario final. | **Evitar en condominios.** Te cae la tarifa regulada + obligaciones de estación de servicio. Sirve para estacionamiento comercial abierto. |

Base legal del modelo A: la **Ley de Propiedad Horizontal (30-dic-1949)** ya faculta al
administrador a recaudar de cada propietario lo que le corresponde en gastos comunes.
[resumen](https://casasenbolivia.com/ley-de-propiedad-horizontal-en-bolivia-todos-los-detalles/)

#### Quién factura qué
- **ONIA → condominio:** factura por el software (mensual) y por equipo + instalación (una
  vez). Con IVA e IT normales.
- **Condominio → residente:** no factura; **prorratea en la expensa** (reparto de gasto
  común, no venta).
- **CRE → condominio:** una sola factura, como siempre.

⚠️ **Facturación electrónica SIAT obligatoria desde el 30-sep-2026.** Lo que emitamos tiene
que salir por ahí. Ver `siat-emitter` y el carril fiscal.

#### Dónde está el ingreso
Un EV consume ~15 kWh/100 km: un residente que hace 1.000 km/mes carga ~150 kWh.
Esos kWh **pasan derecho al residente sin margen** — por eso el modelo es limpio.
El ingreso de ONIA es: **suscripción mensual por punto de carga activo** + hardware +
instalación. Es lo único sin techo regulatorio y sin convertirte en operador eléctrico.

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

## 4. Proveedores y canal de compra

> **REGLA (Sergio, 2026-08-06): se compra SIEMPRE directo de fábrica, nunca a distribuidor.**
> El margen del distribuidor tiene que quedar de nuestro lado; comprar a un distribuidor nos
> deja compitiendo contra nuestro propio proveedor. Ver [[feedback-comprar-siempre-de-fabrica]].
> Única excepción admitida: **una muestra de validación (2 unidades)**, nunca el volumen.

### 4.1 Consecuencia inmediata: Huawei queda descartado como fuente de compra

Huawei vende su FusionCharge AC residencial en Bolivia **sólo a través de distribuidores
autorizados**, y a nuestro volumen no abre cuenta directa de fábrica. Bajo la regla, **no es
proveedor** — a lo sumo, una unidad para probar contra nuestro backend OCPP.
[Los Tiempos](https://www.lostiempos.com/mostrador/mostrador/20241009/huawei-revoluciona-electromovilidad-bolivia-cargadores-ultra-rapidos) ·
[Urgente.bo](https://www.urgente.bo/noticia/huawei-la-vanguardia-presenta-innovadores-cargadores-para-autos-el%C3%A9ctricos-en-bolivia)

Sirve, eso sí, como **señal de mercado**: si Huawei ya puso producto residencial en Bolivia,
alguien vio la demanda antes que nosotros.

### 4.2 El producto que mejor calza: WEG WEMOB Parking G2 (Brasil)

Está **diseñado exactamente para el caso de uso**: recarga en entornos compartidos —
condominios, empresas, estacionamientos.

| Característica | Detalle |
|---|---|
| Potencia | Hasta 22 kW (7,4 kW monofásico / 22 kW trifásico) |
| Vehículos | **2 simultáneos** por equipo |
| Protocolo | **OCPP 1.6J abierto** → libertad de elegir la plataforma de gestión ← clave para nosotros |
| Identificación | **RFID** integrada, app, o acceso libre |
| Conectividad | WiFi, **Ethernet** o 4G (LTE Cat M1 / NB1) |
| Protección | IP55/IP65 — instalable en parqueo abierto |
| Gestión | Split de costos para condominios, con generación automática del monto por usuario |
| Actualizaciones | OTA remotas |

WEG tiene material comercial y **programa de canales específico para condominios**
("WEMOB — Eletrifique o seu condomínio"). La línea incluye además **WEMOB Wall** (7,4 kW,
RFID + WiFi) y **WEMOB Station**.
[WEG WEMOB](https://www.weg.net/catalog/weg/TZ/pt/WDC_CRITICAL_POWER_WEMOB2) ·
[canal condominios](https://materiais.wegdigital.weg.net/weg-digital-wemob-condominios-canais) ·
[catálogo PDF](https://static.weg.net/medias/downloadcenter/hd1/h5e/WEG-WEMOB-50105757-pt.pdf)

**Que tenga Ethernet importa:** permite pedir la variante sin radio y esquivar el riesgo de
homologación ATT.

**Corrección honesta al análisis anterior:** WEMOB ya trae split de costos por usuario. Eso
**achica la ventaja funcional cruda** de nuestro software. El foso real no es "medir y
dividir" — eso ya existe — sino la **integración local**: expensa del condominio,
facturación SIAT, cobro por QR Simple, soporte y contrato en Bolivia. Hay que decirlo así,
no vender un moat que no es.

### 4.3 La ventaja arancelaria de comprar en Brasil

Bolivia y MERCOSUR tienen el **ACE-36**, vigente desde 1997, con programa de liberalización
que completaba la **zona de libre comercio en 2014**. Con **certificado de origen** válido,
la mercadería de origen brasileño accede a preferencia arancelaria.
[Aduana Nacional — ACE-36](https://www.aduana.gob.bo/index.php/acuerdo-de-complementaci%C3%B3n-econ%C3%B3mica-n%C2%BA-36-bolivia-%E2%80%93-mercosur) ·
[Senavex](https://senavex.gob.bo/ace-n-36-bolivia-mercosur/) ·
[IBCE](https://ibce.org.bo/documentos/informacion-mercado/acuerdos-comerciales-bolivia-mercosur.pdf)

Sumado a la ruta corta **Corumbá → Puerto Suárez/Quijarro**, que está en el propio
departamento de Santa Cruz, Brasil compite de verdad contra China pese al precio unitario
más alto: menos flete, menos días, garantía manejable, y repuestos a un día de viaje.

> **Verificar con la despachante** la preferencia exacta para la partida y el certificado de
> origen requerido. La preferencia no es automática: se pide y se documenta.

### 4.4 Fabricantes chinos — perfil por tipo de compra

| Fabricante | Perfil |
|---|---|
| **BESEN** | Especializado en **AC**; explícitamente **MOQ chicos y lead times cortos**, vende a distribuidores y OEM. **El perfil correcto para un primer importador.** |
| **INJET New Energy** | AC/DC + almacenamiento; usado por 1.000+ marcas en 100+ países → capacidad **OEM/marca blanca**. |
| **Autel Energy** | Marca fuerte, **ya desplegando MaxiChargers en Latinoamérica** → candidato a acuerdo de distribución. |
| **Star Charge** | De los mayores fabricantes del mundo; para volumen, no para arrancar. |
| Otros vistos | EVSPB · EVCOME · Estar · XTECK · Cedars · VSCHNEL · Hengyi · Sichuan Greentech YT. |

[BESEN](https://www.besen-group.com/) · [INJET](https://www.injetenergy.com/) ·
[Autel Energy](https://autelenergy.com/) ·
[comparativa fabricantes](https://china-sourcing-agents.com/guides/ev-charger-manufacturers-china/)

### 4.5 Criterios de descarte, en orden

1. **OCPP 1.6J real y documentado** (no "compatible"). Sin esto no hay plataforma.
2. **CE + IEC 61851**, con el certificado en mano, no una foto.
3. **Balanceo dinámico de carga**. Sin esto no vendés en edificio viejo.
4. **Variante sin módulo de radio** (Ethernet/RS485) disponible → esquiva riesgo ATT.
5. Garantía ≥3 años por escrito y política de RMA.
6. MOQ y precio — **último**, no primero.

**Regla:** muestra pagada de 2 unidades por courier aéreo, probada contra nuestro backend
OCPP, antes de cualquier contenedor. `gasto-plataformas-validar-primero` aplicada a hardware.

### 4.6 Cómo distinguir una fábrica de un trader (obligatorio antes de cotizar)

Alibaba y Made-in-China están llenos de **trading companies que se presentan como fábrica**.
El sello "Verified Supplier" **no garantiza nada**: sólo confirma que la plataforma recibió
una copia del documento y le pasó un OCR. La verificación es responsabilidad del comprador.

| Prueba | Qué buscar |
|---|---|
| **Licencia comercial china (营业执照)** | Que el alcance diga manufactura, no 贸易/"trading". **No pedírsela al proveedor** (se photoshopea): sacarla del registro oficial **GSXT / NECIPS** con el Unified Social Credit Code. |
| **Certificado CE / TÜV / IEC 61851** | **Emitido a nombre de la fábrica.** Un trader no puede tenerlo a su nombre — esta es la prueba más difícil de falsear. |
| **ISO 9001** | Verificado contra el registro del organismo emisor, no la foto del PDF. |
| **Nombre en chino** | Que el del portón de la planta coincida con el de la licencia. Si no coincide, es híbrido o intermediario. |
| **Video en vivo de planta** | Línea de producción con **el modelo exacto** que cotizás, no un video genérico de stock. |
| **Capacidad de exportar** | Licencia de exportación propia. Si "usan un agente", el precio ya trae un intermediario adentro. |

Fuentes: [ChineseCheck — 12 métodos](https://chinesecheck.com/blog/identify-real-factory-vs-trading-company) ·
[Koi Sourcing](https://koisourcing.com/blog/how-to-avoid-fake-alibaba-suppliers) ·
[China Company Lookup](https://chinacompanylookup.com/china-supply-chain/how-to-spot-fake-alibaba-suppliers/)

### 4.7 Dónde ir — el mapa físico

#### Clusters de fabricación de EVSE en China
- **Delta del Río Perla — Guangdong** (Shenzhen, Dongguan, Zhongshan): electrónica de alto
  volumen, cadena de PCBA integrada. Es donde está la mayoría de los OEM de wallbox AC.
- **Delta del Yangtsé — Zhejiang y Jiangsu**: equipamiento industrial.
  **Changzhou (Jiangsu)** = sede de **Star Charge**, de los primeros fabricantes chinos y
  redactor de las normas nacionales de carga. **Ningbo y Wenzhou (Zhejiang)** = BESEN, BENY.
- Los costos de producción de estos polos corren 15–30% por debajo de sus pares occidentales.

[Cluster EVSE](https://www.accio.com/supplier/ev-charger-factory) ·
[Top fabricantes](https://anengjipower.com/china-ev-charger-manufacturer-top-10-ev-charging-station-suppliers/)

#### Ferias — dónde ves 20 fábricas en 3 días
| Feria | Cuándo | Dónde | Para qué |
|---|---|---|---|
| **Feria de Cantón, 140ª edición — Fase 1** | **15–19 oct 2026** | Canton Fair Complex, Guangzhou | **La correcta para nosotros.** Fase 1 = electrónica, electrodomésticos, maquinaria, **nueva energía y vehículos**. Amplitud: comparás decenas de fábricas en días. |
| **CPSE — Shanghai Charging Pile & Battery Swap Expo** | 13–15 may 2026 (ya pasó; próxima edición 2027) | Shanghai Automobile Exhibition Center | Monotemática de carga: 800+ expositores. Profundidad. |
| **EVSE / Asia PVSC** | **13–15 nov 2026** | Shenzhen World Exhibition & Convention Center | Equipamiento de carga, en pleno cluster de Guangdong. |

[Feria de Cantón 140ª](https://www.zhujianger.com/canton-fair-dates-2026) ·
[CPSE Shanghai](https://expolume.com/expo/shanghai-international-charging-pile-and-battery-swap-station-expo-cpse/) ·
[EVSE Shenzhen](https://10times.com/evse-shenzhen)

> **Ventana operativa:** Cantón (15–19 oct, Guangzhou) y EVSE Shenzhen (13–15 nov) están en
> la misma provincia con menos de un mes de diferencia. **Un solo viaje puede cubrir la feria
> grande + visitas a planta en Guangdong**, que es donde se cierra de verdad.

#### Visa — hay que gestionarla con tiempo
**Bolivia NO tiene exención de visado con China.** Desde el 24-mar-2025 la Embajada en La Paz
y el **Consulado General en Santa Cruz** usan solicitud **en línea + biometría presencial con
cita**. Para ir a Cantón en octubre, iniciar el trámite con meses de anticipación y con
**carta de invitación de la feria o de la fábrica** (visa M, de negocios).
[Consulado General en Santa Cruz](https://santacruz.china-consulate.gov.cn/esp/lsfw_4/qz/) ·
[Embajada en Bolivia](https://bo.china-embassy.gov.cn/esp/lsfw/qz/)

#### Brasil — la fábrica más cerca
**WEG** es fabricante, no distribuidor: se va **directo a la fábrica**. Planta y casa matriz
en **Jaraguá do Sul, Santa Catarina**, con programa de canales propio para la línea WEMOB de
condominios. Entrar como canal de WEG para Bolivia **es comprar de fábrica**, no a un
distribuidor.
Ventaja: sin visa, vuelo corto, **ACE-36** y ruta Corumbá → Puerto Suárez.

#### Si no se viaja todavía
Auditoría de planta y control de calidad de terceros (SGS, TÜV o firma QC local en China)
antes del primer pago fuerte. Cuesta cientos de dólares y evita perder decenas de miles.

---

## 4-bis. Qué necesitamos exactamente para importar — checklist

### A. Lo que ya tenemos
- [x] **NIT** activo — 5371375010 (OniaAgency).
- [x] **Matrícula de Comercio SEPREC** — 5371375010.
- [x] Objeto social que cubre la actividad.

> ⚠️ La propietaria registrada es **Leslie Mercado Moreno**, no Sergio. Todo trámite que pida
> titular o representante legal se resuelve con ella o con poder notariado. Ver
> [[onia-datos-legales-seprec]]. **Definir esto antes de ir a la Aduana**, o el trámite se cae.

### B. Registro (semana 1–2, costo bajo)
- [ ] **Formulario 170** — Registro de Importador, categoría **Habitual**, ante la Unidad de
      Servicio a Operadores (USO) de la **Aduana Nacional**. Inicio online por el portal
      **SUMA**, cierre presencial. Llevar: certificado del Padrón SIN, CI del
      titular/representante, testimonio de poder si corresponde, Matrícula SEPREC.
      **Dónde:** Gerencia Regional Santa Cruz de la ANB — **Doble Vía La Guardia, entre 5to y
      6to anillo, Edificio Da Vinci**, tel. **(3) 355-3937**. Llamar antes para confirmar la
      ventanilla de la USO y el horario.
      [Direcciones ANB](https://www.aduana.gob.bo/pagina-de-direcciones) ·
      [Gerencia Regional Santa Cruz](https://portal.aduana.gob.bo/aduana7/content/gerencia-regional-santa-cruz)
- [ ] Elegir y contratar **agencia despachante** (cotizar 2–3 en Santa Cruz: Procomex,
      Santa Cruz Dispatchers, Sincomex, Oriental SRL, Grupo Empresarial Global).

### C. Antes de embarcar — los que frenan contenedores
- [ ] **Clasificación arancelaria por escrito** de la despachante para "estación de recarga
      AC para vehículo eléctrico" (esperado: 8504.40.90.10, GA 0% por DS 4539).
- [ ] **Consulta a la ATT**: ¿el modelo elegido está en el listado de equipos sujetos a
      homologación? Si tiene WiFi/BT/4G, muy probablemente sí. Costo y plazo si aplica.
      **Mitigación: pedir la variante Ethernet.**
- [ ] **Consulta a IBMETRO**: ¿existe reglamento técnico aplicable? Si sí → registro IBMETRO
      + CRTM antes de importar.
- [ ] Si se compra en Brasil: **certificado de origen ACE-36** solicitado al proveedor.

### D. Documentos del embarque
- [ ] Factura comercial original, con FOB detallado
- [ ] Packing list
- [ ] BL (marítimo) o CRT (terrestre desde Brasil)
- [ ] Certificado de origen
- [ ] Póliza de seguro
- [ ] Factura del flete internacional
- [ ] Certificados ATT/IBMETRO si aplican

### E. Plata y plazos
- [ ] **Transferencia internacional** al proveedor — no tarjeta (topes bajos). Coordinar con
      el banco con anticipación; ver [[importacion-bolivia-y-cargadores-ev]].
- [ ] Prever **depósito de garantía de contenedor**: USD 1.000–2.000 (ruta Chile).
- [ ] **Pago de tributos en Banco Unión dentro de los 3 días hábiles** de aceptada la DUI.
      Tener el efectivo disponible: si no pagás, la mercadería no sale.

### F. Antes de vender (paralelo, no bloquea la importación)
- [ ] Verificar en la **Res. AETN 479/2021** qué obligaciones tiene la categoría "edificios o
      multifamiliares" (registro de instalación, inspección, reportes).
- [ ] Definir si hace falta **electricista/empresa habilitada por la CRE** para la conexión.
- [ ] Contrato modelo con el condominio (equipo + instalación + suscripción).

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

## 5-bis. Segundo candidato evaluado — paneles solares

Evaluado el mismo día a pedido de Sergio. **Veredicto: mercado más grande, peor negocio
para entrar importando. Sí hay un ángulo, pero no es el hardware.**

### 5-bis.1 El marco regulatorio existe y acaba de ampliarse

- **DS 4477 (25-mar-2021)** crea la **Generación Distribuida**, con tres escalas:
  **nanogeneración ≤10 kW · microgeneración >10–50 kW · minigeneración >50–350 kW**.
  [Lexivox](https://www.lexivox.org/norms/BO-DS-N4477.xhtml) ·
  [texto DS 4477 (CRE)](https://www.cre.com.bo/wp-content/uploads/2022/01/Decreto-Supremo-4477_Generaci%C3%B3n-Distribuida.pdf)
- **DS 5167 (5-jun-2024)** incorpora la retribución por autoproducción con GD.
  [Lexivox](https://www.lexivox.org/norms/BO-DS-N5167.xhtml)
- **DS 5549 (feb-2026)** abre la **GD de media escala, 1 a 6 MW** en media tensión, con
  esquema de remuneración de precio estabilizado. Despliegue escalonado: primero sector
  privado, después comercio y hogares.
  [pv magazine](https://www.pv-magazine-latam.com/2026/02/23/el-gobierno-de-bolivia-aprueba-crear-la-generacion-distribuida-de-media-escala-hasta-6-mw/) ·
  [Review Energy](https://www.review-energy.com/otras-fuentes/bolivia-aprueba-nuevos-reglamentos-y-tarifas-para-la-generacion-distribuida)

### 5-bis.2 EL DATO QUE MATA EL MODELO "INYECTAR A LA RED"

**La energía inyectada se paga al precio de nodo ponderado ≈ Bs 0,129/kWh.**
Es tan bajo que inyectar a la red **no es atractivo**.
[Fundación Solón, citando a la AETN](https://fundacionsolon.org/2021/12/15/como-avanza-la-generacion-distribuida-en-bolivia/)

Excepción relevante: si el usuario tenía un **consumo promedio ≤ 500 kWh/mes** al momento
de registrarse ante la distribuidora (límite de la categoría residencial del DS 4477), la
energía inyectada se valoriza **al mismo precio de la electricidad de su localidad**.

**Consecuencia:** en Bolivia el solar sólo cierra por **autoconsumo** — evitar comprar kWh,
no venderlos. Eso **acota el tamaño del sistema a la carga diurna del cliente** y por lo
tanto acota el ticket. Nada de "lleno el techo y vendo el excedente".

Y el ahorro se mide contra una tarifa **fuertemente subsidiada**: Bolivia tiene una de las
electricidades más baratas del continente, ~**USD 0,09/kWh** residencial, contra USD 0,16
en Brasil, 0,18 en Perú y 0,23 en Chile.
[El País Bolivia](https://elpais.bo/reportajes/20260509_energia-barata-salarios-bajos-el-costo-oculto-del-subsidio-electrico.html) ·
[CRE — tarifa escalonada](https://www.cre.com.bo/2024/10/21/el-precio-de-la-electricidad-en-bolivia-es-escalonado-a-menor-consumo-es-mas-barato/)

Payback declarado: **6–7 años** según la AETN; **3–5 años** según instaladores para GD
conectada a red. La tarifa escalonada implica que **el buen cliente es el de consumo alto**
(comercio, industria, condominio con áreas comunes grandes), no la casa chica subsidiada.
[El Diario](https://www.eldiario.net/portal/2026/07/19/crisis-energetica-abre-oportunidad-para-instalacion-de-paneles-solares/)

### 5-bis.3 Barrera de entrada: hay que estar certificado

El diseño y ejecución de proyectos de GD sólo lo pueden hacer **empresas instaladoras
especializadas**, que deben estar:
1. **Certificadas/inscritas ante la AETN** (Resolución 486/2022), y
2. **Registradas y habilitadas por la distribuidora** de la zona — en Santa Cruz, la **CRE**.

Resoluciones complementarias: **485/2022** (procedimiento técnico y comercial de registro e
incorporación de generadores distribuidos), **487/2022** (obligación de **reportar
información de los generadores distribuidos al regulador**), **488/2022** (determinación de
la retribución por energía inyectada).
[ELFEC](https://www.elfec.bo/noticias/elfec-registrara-y-habilitara-empresas-certificadas-por-la-aetn-para-la-instalacion-de) ·
[CRE — empresas GD](https://www.cre.com.bo/wp-content/uploads/2023/02/GD-EMPRESAS-WEB.pdf) ·
[AETN — GD](https://www.aetn.gob.bo/web/main?mid=1&cid=216)

Esto es a la vez **foso y peaje**: protege al que ya está adentro, y a nosotros nos cuesta
meses entrar.

### 5-bis.4 La competencia está consolidada (a diferencia del condominio EV)

- **Enersol** — 40 años en Bolivia, **+21.000 instalaciones**, **+20 MW instalados** en los
  9 departamentos, y **el centro de distribución con el stock de equipos solares más grande
  del país, en Santa Cruz**.
  [InfoRSE](https://www.inforse.com.bo/2026/06/11/enersol-40-anos-en-bolivia-liderando-la-transicion-energetica-del-pais/) ·
  [Enersol](https://www.enersol-sa.com/)
- **Solaria Bolivia**, **Lumina Solar** (SCZ), **ECOGUZ**, SolTech, EcoSolar, y **19+
  empresas instaladoras ya certificadas por la AETN**.
  [Diario Energético](https://diarioenergetico.com/autoridad-de-electricidad-certifica-a-19-empresas-instaladoras-de-generacion-distribuida/)

### 5-bis.5 La economía del flete condena al importador chico

Módulo Tier-1 TOPCon chino: **USD 0,085–0,095/W FOB**, y bajando.
[SurgePV](https://www.surgepv.com/blog/solar-module-price-forecast-2026-2028) ·
[Coule Energy](https://couleenergy.com/chinese-solar-panel-prices-your-2026-strategic-procurement-guide/)

Un panel de 550 W vale ~**USD 50 FOB** y pesa ~25 kg ocupando ~1,15 m². Es el peor ratio
valor/volumen que podés importar: **el flete y el manipuleo se comen el margen**, y sólo
gana quien mueve contenedores completos con frecuencia. Enersol ya lo hace hace 40 años y
tiene el stock puesto en Santa Cruz.

Comparalo con el wallbox: ~5 kg, ~USD 200 FOB. **40× mejor valor por kilo.**

### 5-bis.6 Comparación directa

| | Cargadores EV (condominio) | Paneles solares |
|---|---|---|
| Mercado hoy | Chico (>7.000 EV) pero **+226%/año** | Grande y activo |
| Competencia en el nicho | **Vacío** (todos en carga rápida DC pública) | **Saturado** (Enersol 40 años + 19 certificadas) |
| Barrera de entrada | Requisitos AETN de estación | **Certificación AETN + habilitación CRE** (meses) |
| Valor/peso para importar | **Excelente** (~USD 40/kg) | **Pésimo** (~USD 2/kg) |
| Techo regulatorio | Tarifa kWh regulada Bs 1,01–2,15 | **Inyección a Bs 0,129/kWh** → sólo autoconsumo |
| Ángulo de software propio | **Fuerte** (prorrateo por departamento) | Medio (monitoreo + reporte obligatorio a AETN) |
| Capital inmovilizado | Bajo | **Alto** |

### 5-bis.7 Recomendación

**No importar paneles.** Tres razones, en orden:
1. Es el producto más commoditizado del planeta y **no podés ganarle en costo ni en
   disponibilidad** a quien ya tiene el stock más grande del país en tu misma ciudad.
2. La inyección paga Bs 0,129/kWh contra una tarifa subsidiada: el ticket está acotado y el
   payback depende de un ahorro modesto.
3. Requiere certificación AETN + habilitación CRE: es un negocio de licencia y obra, no de
   software. Mano de obra, no producto.

**Lo que sí tiene sentido, si querés entrar al solar:**
- **No hace falta importar para vender solar.** Comprás el equipo local (Enersol tiene el
  stock en Santa Cruz), vendés **integración + software**, y no inmovilizás un peso ni
  asumís riesgo aduanero ni cambiario. Si escala, ahí sí importás.
- **El ángulo de software real:** la Res. 487/2022 **obliga a reportar información de los
  generadores distribuidos al regulador**. Monitoreo + balance energético + reporte
  automático a la AETN es una necesidad de compliance recurrente que hoy se resuelve a mano.
- **El DS 5549 (1–6 MW)** abre el segmento industrial/comercial, que es donde el ahorro
  es grande y el cliente paga por gestión.
- **Y sobre todo: solar y carga EV son el mismo producto en el mismo edificio.** Un
  condominio con paneles + cargadores + prorrateo por departamento es una sola plataforma de
  gestión energética. Ese es el producto ONIA. El panel y el cargador son insumos.

**Orden correcto: entrar por el cargador (nicho vacío, alto valor/kg, software
diferenciador) y sumar solar después como módulo de la misma plataforma, comprando local.**

---

## 5-ter. Regla de decisión — qué hardware vale la pena importar

Surgió al evaluar el tercer candidato (hardware para IA local, 2026-08-06). Es el filtro que
aplica a **cualquier** producto físico que ONIA considere:

> **¿El hardware crea una necesidad de software recurrente que sin él no existiría?**

| Candidato | ¿Crea SaaS recurrente? | Veredicto |
|---|---|---|
| **Cargador EV en condominio** | **Sí.** Alguien tiene que medir y cobrarle a cada residente todos los meses. El box es la razón por la que pagan el mensual. | Único que pasa el filtro |
| Panel solar | Débil. Monitoreo y el reporte obligatorio a la AETN (Res. 487/2022), pero el cliente puede vivir sin eso. | No justifica importar |
| **Hardware de IA local** (servidor GPU, edge) | **No.** El software corre igual —y más barato— en la nube. El fierro no genera un cobro mensual que no exista ya. | No pasa |

Contexto del caso IA local: el **DS 5518** (arancel 0% hasta 31-dic-2026) cubre "línea negra"
—laptops, tablets, teclados, impresoras, cámaras, monitores, audio, consolas, smartphones—
y **no menciona servidores, GPUs ni componentes**, así que la ventaja arancelaria
probablemente no aplica. Sumado a ticket alto (USD 5–15k por equipo), RMA a 12.000 km, y un
comprador objetivo ([[onia-enfoque-compradores]]: dueño de negocio formal boliviano) que no
compra servidores GPU.
[Aduana — guía DS 5518](https://www.aduana.gob.bo/todo-lo-que-debe-saber-sobre-el-nuevo-decreto-5518) ·
[lista de productos](https://www.reduno.com.bo/economia/atencion-gobierno-fija-arancel-cero-para-dispositivos-electronicos-conoce-la-lista-202611494243)

**Corolario:** el valor/kg, el arancel y la moda del producto son secundarios. Lo que decide
es si el fierro engancha un cobro mensual. Si no lo hace, importarlo es entrar a un negocio de
márgenes de comerciante, que no es el nuestro ([[onia-vende-software-nunca-horas]]).

---

## 6. Qué NO pude verificar (para no inventar)

1. ~~Umbral Bs de importador habitual vs. no habitual~~ — **RESUELTO 2026-08-06 contra el
   portal SUMA oficial. No es un umbral de monto.** Ver §8. Los blogs que hablan de una cifra
   en Bs están equivocados o desactualizados.
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
7. **GA de los paneles solares (partida 8541.43)** — no lo pude confirmar; los PDFs del AAI
   y los Anexos 3 y 4 del DS 5516 no abrieron. Pedirlo por escrito a la ADA.
8. **Cuántas empresas instaladoras de GD hay hoy certificadas por la AETN** — el PDF de la
   lista oficial (act. 30-abr-2026) no se pudo parsear. La prensa cita 19; el listado tiene
   17 páginas, así que probablemente sean más. Bajarlo a mano de aetn.gob.bo.
9. **Costo y plazo real de certificarse como empresa instaladora de GD** ante AETN + CRE.

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

## 8. RUNBOOK — PASO 1: registro como importador ← **paso activo**

Verificado el 2026-08-06 contra el **portal SUMA oficial** (`suma.aduana.gob.bo`, abierto y
funcionando) y la ficha de trámite de gob.bo. Esto reemplaza lo que dicen los blogs.

### 8.1 Corrección: habitual vs. no habitual NO es un monto

El portal oficial lo define por **tipo de persona y tipo de operación**, no por un umbral en Bs:

| Categoría | Quién | Qué puede importar |
|---|---|---|
| **Importador Habitual** | **Personas jurídicas o empresas unipersonales** (públicas o privadas), y naturales bajo Régimen Agropecuario Unificado (RAU) | Operaciones de importación comerciales, sin la lista cerrada |
| **Importador No Habitual** | Personas naturales con CI, o NIT bajo **Régimen Tributario Simplificado** | Sólo una **lista cerrada**: importaciones de menor cuantía, equipaje, encomiendas postales, courier, vehículos sin fines comerciales, menaje doméstico, implantes y equipos ortopédicos |

**OniaAgency es empresa unipersonal con NIT en régimen general → va a Importador Habitual.**
Sin ambigüedad. Las cifras en Bs que circulan en blogs no aplican a esta distinción.
[Portal SUMA](https://suma.aduana.gob.bo/portal/index.html) ·
[ANB — importador habitual](https://www.aduana.gob.bo/infosuma/operadores.php?op=2)

### 8.2 Marco normativo vigente
- **RD 01-085-24 del 13/09/2024** — Reglamento para la Regulación y Control de Operadores de
  Comercio Exterior ([PDF](https://www.aduana.gob.bo/sites/default/files/NormativaVigente/Reglamentos/Reglamento%20para%20la%20Regulaci%C3%B3n%20y%20Control%20de%20Operadores%20de%20Comercio%20Exterior.pdf))
- **DS 5340** · **RM 060/2025** y **RM 067/2025**
- Ficha oficial: [gob.bo — registro importador habitual](https://www.gob.bo/tramites/registro-operadores-de-comercio-exterior-importador-habitual)
  (trámite **virtual**, última actualización 27/02/2026)

### 8.3 Los 10 pasos oficiales

| # | Paso |
|---|---|
| 1 | Entrar a `aduana.gob.bo` → sección Servicios → enlace **SUMA**. Directo: **https://suma.aduana.gob.bo/portal/index.html** |
| 2 | Elegir **"Registro Nuevos Operadores"** |
| 3 | En **"1) Importadores / Exportadores Habituales"** → **"Registrar Nuevo Usuario"** → activar la cuenta por correo |
| 4 | Ingresar con las credenciales activadas |
| 5 | Seleccionar **Tipo de Persona** y marcar **Importador** como Tipo de Operador |
| 6 | Completar el formulario adjuntando **copias escaneadas** de los documentos |
| 7 | Enviar electrónicamente, **eligiendo la oficina aduanera** donde se cierra presencial → **Gerencia Regional Santa Cruz** |
| 8 | Recibir confirmación e instrucciones por correo |
| 9 | La ANB revisa; si observa, notifica por correo. Aprobado → **programa verificación de domicilio** |
| 10 | Presentarse con **originales**. Se emite **Certificado de Operador** + acceso al Portal de Gestión Aduanera |

⚠️ **Paso 9 — verificación de domicilio:** la Aduana va a ir a constatar el domicilio
declarado. Declarar uno donde efectivamente se pueda atender, con cartel o identificación.
Es causal frecuente de observación.

⚠️ Llenado el Formulario 170, hay **máximo 5 días hábiles administrativos** para apersonarse,
con **dos ejemplares llenados, sellados y firmados** más los respaldos.

### 8.4 Documentos a preparar

| Documento | Estado |
|---|---|
| Certificado de registro en el **Padrón del SIN** vigente | ✅ tenemos NIT 5371375010 — sacar el certificado actualizado |
| **CI del titular o representante legal** | ⚠️ ver 8.6 |
| **Testimonio de Poder** del representante legal, si corresponde | ⚠️ ver 8.6 |
| **Matrícula de Comercio SEPREC** | ✅ 5371375010 |
| Formulario 170 × 2 ejemplares, firmados y sellados | pendiente |

### 8.5 Firma digital — el requisito que frena a mitad de camino

Las operaciones aduaneras se firman digitalmente. El certificado lo emite **ADSIB** (única
entidad pública autorizada). Costos referenciales: **certificado Bs 70–80** + **token
Bs ~175**.

**Se tramita en la propia Gerencia Regional Santa Cruz de la ANB**, que es punto de registro
de firma digital — se puede resolver en la misma visita.
[ANB — puntos de registro](http://www.aduana.gob.bo/firmadigital/puntosregistro.php) ·
[firmadigital.bo](https://firmadigital.bo/) · [ADSIB](https://adsib.gob.bo/portal_frontend/contenidos/tramite-100percent-en-linea-certificados-para-firma-digital)

> Confirmar por teléfono si se exige **al registrarse** o recién **al operar**. Conviene
> sacarla igual en la misma vuelta.

### 8.6 Quién firma — Sergio es menor de edad

**Corrección al borrador anterior: la vía del "poder notariado a favor de Sergio" NO aplica.**
En Bolivia la mayoría de edad y la capacidad de obrar se adquieren a los **18 años**
(Código Civil, art. 4), y los actos civiles de quienes no tienen capacidad de obrar **se
realizan por sus representantes** (art. 5). Un menor no puede ser representante legal de la
empresa ante la Aduana.
[Código Civil art. 4](https://paradaabogados.com/codigo-civil-bolivia/art-4-mayoria-de-edad-y-capacidad-de-obrar/) ·
[Código Civil (PDF OEA)](https://www.oas.org/dil/esp/codigo_civil_bolivia.pdf)

**Esto no es un problema: la estructura correcta ya está armada.** Leslie Mercado Moreno es
la titular registrada en SEPREC ([[onia-datos-legales-seprec]]). Todo lo formal va por ahí.

| Acto | Quién |
|---|---|
| Formulario 170 / registro de importador | **Leslie** (titular) |
| Firma digital ADSIB | **Leslie** |
| Cuenta bancaria y transferencia internacional al proveedor | **Leslie** |
| Contratos con condominios y con la despachante | **Leslie** firma |
| Negociación con fábricas, especificación técnica, software, operación comercial, relación con la despachante | **Sergio** — nada de esto requiere capacidad civil plena |

**Matiz útil del art. 5 CC:** el menor **puede administrar y disponer libremente del producto
de su trabajo**. Sirve para definir cómo cobra Sergio, aunque no le da capacidad para obligar
a la empresa.

#### Viajar al exterior (feria de Cantón, visita a fábrica)
Para que un menor salga del país **se requiere orden de un Juzgado Público de la Niñez y
Adolescencia**, además de la visa. No es imposible, pero es un trámite judicial con plazos.
[Rigoberto Paredes](https://www.rigobertoparedes.com/es/permisos-de-viaje-para-menores-de-edad-en-bolivia/) ·
[gob.bo — permiso de viaje](https://www.gob.bo/tramites/formulario-de-permiso-de-viaje-para-menores-de-edad)

**Plan realista:** que viaje Leslie o un adulto de confianza; o resolver sin viajar con
**auditoría de fábrica de terceros (SGS/TÜV/QC local) + video en vivo de planta**, que ya
estaba en §4.7 como alternativa. La compra directa de fábrica no exige estar presente — exige
verificar bien.

#### Emancipación (sólo si Sergio tiene 16 o más)
La Ley 603 (Código de las Familias) permite **emancipación desde los 16 años** ante **Notario
de Fe Pública**, con acuerdo de quienes ejercen la autoridad parental; también opera de
derecho por matrimonio o unión libre. Efecto: **capacita para regir su persona y administrar
sus bienes**, pero **no habilita actos de disposición** sin las formalidades previstas para
bienes de menores.
[Ley 603 art. 106](https://editorialups.org/normas-actualizadas-bolivia-ley-603-codigo-familia-proceso-familiar/articulo-106-emancipacion-por-matrimonio-o-union-libre/) ·
[Ley 603 texto](https://www.lexivox.org/norms/BO-L-N603.html)

> **No venderlo como solución.** No está claro que la emancipación habilite a ser Operador de
> Comercio Exterior ante la ANB, y de todos modos no cubre actos de disposición. **Esto se
> consulta con abogado/notario, no se deduce.** Si falta poco para los 18, esperar es más
> simple que emancipar.

**Nada de esto se estructura para esquivar la ley.** Que todo esté a nombre de la adulta
titular es la forma correcta y limpia, no un rodeo.

### 8.7 Dónde y a quién llamar
- **Gerencia Regional Santa Cruz — ANB:** Doble Vía La Guardia, entre 5to y 6to anillo,
  **Edificio Da Vinci**. Tel. **(3) 355-3937**.
- **Línea de contacto del trámite:** 2184026 · **Soporte:** 63195237 ·
  soporte@agetic.gob.bo
- Llamar **antes** de ir: confirmar ventanilla de la USO, horario, si hay costo del registro
  y si la firma digital se saca en la misma visita.

### 8.8 ✅ RESUELTO contra el texto del reglamento (2026-08-06)

Se descargó y leyó el **Reglamento GNOA-REG-19 v3 (RD 01-085-24)** artículo por artículo.
Resultados que **corrigen** lo escrito arriba en 8.3–8.5:

| Punto | Respuesta oficial |
|---|---|
| **Requisitos** | **Art. 32:** sólo cuatro — Padrón SIN en **régimen general** · CI vigente del titular ante **SEGIP** · Testimonio de Poder registrado en SEPREC *si corresponde* · Registro ante **SEPREC**. Más un correo activo (Art. 15). |
| **¿Firma digital?** | **NO.** El **Art. 42 exceptúa al importador que despacha con Agencia Despachante de Aduana.** Se cae el trámite ADSIB y el token del paso 1. |
| **¿Garantía?** | **NO** para el importador común. La garantía de **UFV's 2.000** (FOB anual ≤ USD 85.000) es del régimen de **despacho directo**, Art. 68 — importar sin despachante. |
| **¿Costo?** | El reglamento **no fija arancel para el registro**. Las **UFV's 40** del Art. 73 son por **credencial** de acceso a recintos, que es otra cosa. |
| **¿Hay que ir a la oficina?** | **No según el reglamento.** El flujo es online + **la Aduana viene a verificar el domicilio**. (La infoSUMA vieja aún describe presentación presencial: llevar originales listos por las dudas.) |
| **Plazos (Arts. 40–41)** | Subsanar observaciones: **5 días hábiles**. Verificación de domicilio: dentro de **2 días hábiles** de la comunicación sin observaciones. Habilitación: **día hábil siguiente**. Total ≈ **una semana**. |
| **Verificación de domicilio (Art. 41)** | Toman **fotos del domicilio y del representante legal**. **No habilitan** si el domicilio no se encuentra, la dirección no coincide, se niega el ingreso, **el titular no está presente**, o no tiene **CI vigente** en mano. |
| **Vigencia (Art. 43)** | Se cae si **no se realiza al menos una operación cada 12 meses**, o si vencen NIT, matrícula, garantía o mandato. |
| **Contraseña SUMA** | Cambio obligatorio cada **60 días** (Art. 40.III). |
| **Sergio a los 18 (Art. 40.I.5)** | Representantes legales de **18 a 21 años** requieren consignar a **padres/tutores como terceros responsables solidarios** (Ley 2492, arts. 28/29/31), con CI vigentes, y la ANB lo verifica. |

**Plataformas de Atención en Santa Cruz** (se elige una al enviar el formulario):
Gerencia Regional — Av. La Salle esq. Claudio Peñaranda, Ed. "Don Uruguay", 3425 3333 int. 242 ·
Aduana Interior — Av. Virgen de Cotoca km 4½, 349 2923 · Viru Viru — carretera al Norte km 17,
385 2118 · Puerto Suárez — carretera a Puerto Quijarro km 6, 3978 2135 · ZF Winner — km 4½ a
Cotoca, 349 7782. **Línea gratuita 800 10 5001.**
[Plataformas de atención](https://www.aduana.gob.bo/plataforma-atencion)

⚠️ La página de *Direcciones* lista la Gerencia Regional en Doble Vía La Guardia (Ed. Da Vinci,
355-3937) y la de *Plataformas* en Ed. Don Uruguay. Una está desactualizada; como el trámite es
remoto, no bloquea.

**Runbook operativo con todo esto aplicado:** `ONIA_REGISTRO_IMPORTADOR_PAQUETE_20260806.md`.

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
