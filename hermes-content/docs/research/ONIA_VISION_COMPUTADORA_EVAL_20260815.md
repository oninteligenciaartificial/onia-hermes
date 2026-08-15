# Vision por computadora en Onia - evaluacion de 4 casos

Fecha: 2026-08-15 · Estado: EVALUACION. Nadie construye nada con este documento todavia.

**Premisa fija (decidida, no se re-investiga):** corre EN EL DISPOSITIVO (telefono del cliente),
con modelos gratuitos tipo COCO-SSD / YOLO, sobre la camara del propio equipo. Sin servidor, sin
subir video, sin costo por minuto.

**Advertencia de lectura.** El video que motivo esta evaluacion muestra deteccion de vehiculos a
plena luz: autos grandes, contrastados, sobre fondo fijo, sin oclusion. Ese es el caso FACIL. Todo
lo que sigue mide que pasa cuando el objeto es chico, esta tapado, se mueve, o la camara la sostiene
una persona.

**Regla que gobierna todo el documento:** precision de DETECCION (¿hay un casco en este cuadro?) no
es precision de la TAREA DE NEGOCIO (¿cuantas personas entraron sin casco hoy?). Un detector con 90%
por cuadro puede dar un reporte diario pesimo si el seguimiento entre cuadros es malo. Cada vez que
existe el dato, estan separados.

---

## 1. Los 4 casos

| Rubro | Dato que entrega | Precision esperada | Donde corre |
|---|---|---|---|
| **1. Seguridad laboral / EPP** (constructoras e industria, Santa Cruz) | Registro fechado y con foto de cada evento "persona sin casco / sin chaleco" en el acceso, con conteo diario por turno. Es evidencia para el registro que la ley YA exige, no medicion de productividad. | **Por cuadro, persona cerca (2-5 m): 85-88%** — ESTIMACION por transferencia entre datasets ajenos (caida medida de 4,2 a 6,5 puntos al cruzar de obra: 92,4% -> 85,9-88,2%, [PMC12297540](https://pmc.ncbi.nlm.nih.gov/articles/PMC12297540/)); ninguno de esos datasets es boliviano. **Persona lejana o chica: ~61% AP** (AP_S 61,22 vs AP_L 91,51, misma fuente). **Evento de negocio (el ingreso quedo bien registrado): SIN MEDIR.** Lo unico publicado es seguimiento MOTA 90,5% / IDF1 84,2% sobre 3 videos ([PMC12568081](https://pmc.ncbi.nlm.nih.gov/articles/PMC12568081/)) = ~1 de cada 6 identidades se confunde. **En telefono: SIN MEDIR** (todas las cifras son de GPU de escritorio). | Telefono o tablet FIJO en tripode en el acceso, 2-4 m, on-device, sin subir video. **Exige modelo entrenado propio: COCO no tiene clase casco ni chaleco**, solo `person` ([COCO](https://docs.ultralytics.com/datasets/detect/coco/)). |
| **2. Importadora - conteo de bultos** | Bultos descargados por contenedor y diferencia contra el packing list, en el momento de la descarga. | **Cinta transportadora, camara fija, GPU: 94,2% de conteo; baja a 85,1% con 50-70% de oclusion** ([Springer ICCIES 2026](https://link.springer.com/chapter/10.1007/978-3-032-21625-0_24)). **Descarga real de contenedor con telefono en mano: SIN MEDIR** — cero publicaciones, academicas o de proveedor con metodologia. ESTIMACION honesta: por debajo del 85% (apilamiento permanente + camara en movimiento, que degrada la asociacion de identidades, [UCMCTrack arXiv 2312.08952](https://arxiv.org/pdf/2312.08952)). | On-device, camara EN MANO = el peor caso para el seguimiento. **Exige modelo propio: COCO no tiene clase caja/bulto**; el dataset publico que llega a 89 mAP necesito 16.136 imagenes y 250.000 mascaras ([Sensors 22:3617](https://doi.org/10.3390/s22103617)). |
| **3. Comercio minorista - aforo y dwell** | Visitas por franja horaria y segundos por zona de gondola, para calcular conversion (tickets/visitas) y hora sin personal. Entrega numeros, nunca video. | **Deteccion de personas en tienda real: 81,59% AP** — y es sobre Jetson TX2, no telefono ([arXiv 2007.04942](https://arxiv.org/pdf/2007.04942)); los autores lo llaman proof-of-concept y admiten que pierde gente cuando se cruza o pasa detras del mostrador. **Aforo (tarea de negocio): SIN MEDIR.** **Dwell time frente a gondola: SIN MEDIR** — cero estudios revisados por pares con error en segundos; los 92-97% que circulan son blogs de proveedores. Los 95-99% de fabricantes son de sensores CENITALES dedicados, sin auditoria independiente. | On-device, tripode, angulo oblicuo (la industria usa cenital = mejor geometria). **Unico caso que usa `person` de COCO sin entrenar nada.** |
| **4. Ganadero - conteo de hacienda** | Cabezas por evento de manejo (embarque, recepcion, aparte) con video de respaldo, para conciliar contra inventario. No identidad del animal. | **Dron a 30 m, campo real: 97,4% precision/recall por cuadro PERO -5,5% de subconteo acumulado** (935 de 989 reales; peor imagen -20 animales); ternero dentro de grupo se cuenta 71% de las veces vs 99% aislado ([Sensors 20:2126](https://pmc.ncbi.nlm.nih.gov/articles/PMC7181249/)). **En manga (animal de a uno): 91-96%, ESTIMACION** por analogia con cerdos en pasillo (96,58% promedio, cae a 91,3% cuando los animales se apiñan por estres, [PMC11047650](https://pmc.ncbi.nlm.nih.gov/articles/PMC11047650/)); no hay medicion publicada en bovinos en manga. **Telefono a nivel del suelo: SIN MEDIR** — todo el corpus es dron, satelite o camara fija. | On-device, OFFLINE TOTAL, montado sobre la manga o corral de embarque. Nunca barriendo el potrero (F1 cae a 0,14 al bajar resolucion, [ISPRS 2025](https://www.sciencedirect.com/science/article/pii/S2667393225000250)). Clase `cow` de COCO existe pero no entrenada en ganado boliviano ni polvo. |

Nota transversal de hardware que aplica a las 4 filas: en NAVEGADOR, coco-ssd medido en telefonos
reales da 20 FPS (iPhone 13) a 2-4 FPS (Galaxy Tab A), y **no sigue la gama** — un Pixel 6a de 2022
da 5 FPS y un Galaxy S21 de 2021 da 14-18
([OpenDataCam](https://github.com/opendatacam/demo-object-detection-browser/)). El navegador es
15,8x mas lento que nativo en CPU movil ([ACM TOSEM, arXiv 2402.05981](https://arxiv.org/abs/2402.05981)).
Y sostenido cae a la mitad: 51,7% de estabilidad tras 20 min de carga continua en un iPhone 11 Pro
([3DMark Wild Life Stress Test](https://benchmarks.ul.com/news/using-3dmark-to-measure-sustained-performance)).
**No se puede prometer FPS sin probar EL modelo exacto de telefono.**

---

## 2. Recomendacion (una sola)

### Se prototipa PRIMERO el Caso 1: EPP en el acceso de obra. Como instrumento de medicion, no como producto vendible.

**Por que este y no los otros - el criterio es el dolor mas caro HOY, y la tolerancia al error.**

El dolor mas caro con cifra verificada no es el mas grande en numeros absolutos: el abigeato en Santa
Cruz movio USD 4 millones en 2023 segun Fegasacruz
([La Razon](https://larazon.bo/economia/2024/02/09/en-2023-el-abigeato-ocasiono-un-dano-de-us-4-millones-en-santa-cruz/)),
mas que cualquier cifra de los otros tres casos. **Pero el producto no alivia ese dolor:** con -5,5%
de subconteo acumulado, sobre un lote de 200 cabezas el sistema erra ~11 animales, mas que muchos
robos individuales, y un conteo por vision no es prueba legal — el registro que vale ante el Estado
es la caravana DIIO en el sistema de SENASAG
([REGENSA cap. 3.16](https://www.senasag.gob.bo/index.php/tramites-y-servicios/convocatorias/regensa-en-linea/479-capitulo-3-16-trazabilidad)).
Vender contra ese dolor seria vender algo que no lo resuelve.

En EPP el dolor tambien esta verificado y ademas el producto SI produce lo que falta:

- La obligacion existe hoy y se incumple por falta de dato: DL 16998 art. 6 num. 26 obliga a "llevar
  un registro y estadisticas de enfermedades y accidentes de trabajo", y el art. 6 num. 14 a dotar
  EPP ([Lexivox](https://www.lexivox.org/norms/BO-DL-16998.html)). La RM 992/23 con la NTS 009/23
  suma un PGSST obligatorio con inspecciones y dotacion de EPP documentadas.
- El subregistro es el problema reconocido: Bolivia registra al menos 7.000 accidentes laborales al
  año (22.847 entre 2010 y 2012), tasa de mortalidad 21,9 por 100.000 trabajadores, y las empresas
  gastaron mas de Bs 430.000 al año por sus accidentados — la propia fuente admite que la cifra real
  es mayor "porque no tienen datos oficiales actualizados"
  ([IBCE](https://ibce.org.bo/principales-noticias-bolivia/noticias-nacionales-detalle.php?id=46592)).
- El costo por evento es ilimitado hacia arriba y ya recae en el contratista: bajo Ley 1155 / DS 4058
  (SOATC), quien contrata o subcontrata sin verificar el seguro vigente ASUME las indemnizaciones del
  accidentado ([Ley 1155](https://www.lexivox.org/norms/BO-L-N1155.html)).

**Y la razon tecnica que decide el orden: es el unico de los cuatro donde un 85% sirve.**

- Caso 2 es CONCILIACION BINARIA: cuadra o no cuadra. "300 mas o menos 15 bultos" no se puede anotar
  en el recibo de entrega, y el reclamo por faltante exige la excepcion exacta y firmada al momento
  ([ATS Logistics](https://atslogistics.com/what-are-freight-claims-and-what-you-need-to-know-about-them/));
  ademas no hay tolerancia aplicable a carga contada por piezas
  ([NorthStandard](https://north-standard.com/insights-and-resources/resources/archive/press-releases/bulk-carriers-can-no-longer-rely-on-customary-shortage-says-north-pi-club)).
  Un dato impreciso ahi no ayuda: puede CREAR el problema, porque la diferencia entre lo declarado y
  lo verificado configura contravencion aduanera (Ley 1990, arts. 186 y ss.).
- Caso 3 tiene la trampa peor: el arreglo tecnico del doble conteo (re-identificar al cliente que
  vuelve a pasar) es exactamente lo que crea una huella que identifica personas y devuelve todo al
  regimen de consentimiento EXPRESO Y POR ESCRITO del DS 1793 art. 56 num. 2
  ([Lexivox](https://www.lexivox.org/norms/BO-RE-DSN1793.html)) — inviable para gente que entra a una
  tienda. Sin ReID, el aforo se infla; con ReID, el producto queda expuesto. Ademas el dato estrella
  (dwell time) no tiene una sola medicion publicada.
- Caso 4 ya estaba ultimo y la evidencia lo respalda.

En EPP no hay conciliacion binaria y hoy el registro esta VACIO o se llena a mano. Un registro
parcial, con hora y foto, de una muestra de incumplimientos, vale mas que ninguno — siempre que se
venda como **muestreo de incumplimientos detectados**, jamas como "todos los que pasaron".

**Como se vende (y como NO).** No se puede decir "es obligatorio por ley" ni "te evita la multa": la
ley exige el EPP y el registro, no exige camaras ni deteccion automatica, y la multa se evita
cumpliendo, no comprando el producto. El pitch es el mismo que con SIAT: *no tengas que tipear el
registro que ya estas obligado a llevar*.

**Tres condiciones duras del prototipo, o no se hace:**

1. **Kit homologado ALQUILADO, no el telefono del cliente.** El equipo queda ocupado todo el dia en
   el acceso, y el FPS en navegador es loteria por modelo. Alquilado y no vendido para no cargar
   garantia con la devaluacion encima (USD 6,96 -> 11,37) y poder retirarlo si el piloto falla. El
   hardware no es el obstaculo economico: telefono nuevo mas barato en tienda formal boliviana
   Bs 1.119 (ZTE Blade A36, Tienda Amiga) contra un portero a Bs 3.300/mes de salario minimo
   ([DS 5516](https://unitel.bo/noticias/economia/decreto-el-salario-minimo-sube-a-bs-3300-su-aplicacion-es-obligatoria-y-rige-desde-el-2-de-enero-de-2026-CM18639182)).
   El obstaculo es que el equipo barato da 2-5 FPS y se calienta.
2. **La camara solo mira el ACCESO, a 2-4 m.** El degradador numero uno es la distancia: 61% AP en
   objetos chicos contra 91% en grandes. Vigilar la obra entera desde un poste no funciona y no se
   ofrece.
3. **Nunca se guarda el cuadro, solo el evento.** El video no sube a ningun lado y el frame no se
   archiva "para auditar el modelo". Es lo unico que mantiene la exposicion legal baja hoy y ante el
   anteproyecto de proteccion de datos de AGETIC, que aun no es ley
   ([DLA Piper](https://www.dlapiperdataprotection.com/guide.pdf?c=BO)). Excepcion: la foto del
   evento de incumplimiento, que ES el producto, requiere consentimiento del trabajador — ver NO
   VERIFICADO, punto de videovigilancia laboral.

---

## 3. Que hay que MEDIR antes de prometerle precision a un cliente

Ninguna cifra de este documento sirve para prometer nada: todas son de GPU de escritorio, dataset
curado y obras asiaticas. **Lo que se le promete a un cliente es el numero del piloto de ESE cliente,
medido en SU acceso.** El plan produce ese numero.

### Fase 0 - Dataset (1 semana, costo Bs 0 fuera de horas)
COCO no tiene casco ni chaleco: sin dataset propio no hay nada que probar. Etiquetar 500-800 fotos
del acceso de UNA obra en Santa Cruz, en las tres franjas reales (07:00 con contraluz del este,
mediodia, salida de turno), incluyendo cascos sucios y de colores raros — el color mueve la precision
20 puntos entre azul (80,76%) y rojo (91,91%) en el mismo modelo
([PMC8156681](https://pmc.ncbi.nlm.nih.gov/articles/PMC8156681/)).

### Fase 1 - Hardware sostenido (2 dias)
Antes de medir precision, medir si el equipo aguanta. Sobre el modelo exacto de telefono del kit:
- FPS del minuto 1 contra FPS del minuto 20 y del minuto 45, con la camara abierta y pantalla
  encendida, al sol de Santa Cruz. La referencia es -48% en 20 minutos.
- Temperatura de superficie y porcentaje de bateria por hora, enchufado y sin enchufar.
- Si sobrevive un turno de 8 h enchufado (el README de la app Android IP Camera advierte que dejar el
  telefono al 100% permanente puede hinchar la bateria:
  [DigitallyRefined](https://github.com/DigitallyRefined/android-ip-camera)).
- Comparar navegador contra app nativa en el MISMO equipo. La brecha publicada es 15,8x en CPU.

### Fase 2 - Ground truth, 2 semanas, minimo 300 ingresos
Un observador humano anota cada ingreso y si la persona llevaba casco y chaleco, en paralelo y sin
ver la pantalla del sistema. Se comparan cuatro numeros, no uno:

| Metrica | Que responde | Por que decide |
|---|---|---|
| **Recall por EVENTO** | de los N ingresos sin casco que vio el humano, ¿cuantos registro el sistema? | Es el numero que decide si el producto sirve, y hoy NO EXISTE publicado para ninguna obra. |
| **Falsos positivos por hora** | ¿cuantas alertas invento? | Es el numero que decide la ADOPCION. Si el capataz recibe 40 alertas falsas por turno, apaga el sistema en dos dias. |
| **Error de atribucion** | ¿el evento quedo pegado al ingreso correcto? | Con IDF1 84,2% publicado, ~1 de cada 6 identidades se confunde: dos incumplimientos de una persona pueden figurar como dos personas. |
| **Casco en la mano** | ¿cuantas veces conto como "con casco" a alguien que lo llevaba colgado del brazo? | El detector ve una CAJA de casco, no el USO. Los propios papers lo admiten ([PMC12568081](https://pmc.ncbi.nlm.nih.gov/articles/PMC12568081/), [PMC12467545](https://pmc.ncbi.nlm.nih.gov/articles/PMC12467545/)). Si este numero es alto, el registro miente a favor del cliente, que es el peor error posible en evidencia de seguridad. |

Partir todos los resultados por condicion: franja horaria, lluvia, polvo, grupo de 3+ personas
entrando juntas, persona de espaldas. Lo que se promete despues se promete POR CONDICION, no en
promedio.

### Fase 3 - Segunda obra sin reentrenar (1 semana)
Mismo modelo, otra obra, sin tocar nada. Mide el domain shift REAL en Bolivia. La literatura da 4 a
6,5 puntos de caida entre datasets ya parecidos entre si; con un modelo entrenado en una sola obra
puede ser mucho peor. **Si cae fuerte, el producto no es "instalar una app": es re-entrenamiento por
cliente, y eso cambia el precio y el modelo de negocio, no solo la ficha tecnica.**

### Criterio de corte, declarado ANTES de empezar
Propuesta (es decision comercial, no dato de la literatura): se sigue solo si recall por evento >= 80%
y falsos positivos <= 2 por hora en la franja de entrada, en la Fase 2, y la caida de Fase 3 es menor
a 10 puntos. Si no, se abandona y se escribe por que. Fijar el umbral despues de ver el resultado es
como no tener umbral.

---

## 4. NO VERIFICADO

Lo que sigue no tiene fuente y por lo tanto no se dice en una propuesta ni en una reunion.

**Del caso recomendado (EPP)**
- **Tasa de falso negativo en obra real: NO VERIFICADO.** Lo unico publicado es recall 89,0% sobre
  dataset curado. Ningun paper responde "¿cuantas personas sin casco pasaron sin ser detectadas en un
  mes de obra?". Es el numero que decide el producto y hay que medirlo (Fase 2).
- **Precision de un modelo NANO en un telefono: NO VERIFICADO.** Todas las cifras citadas son
  YOLOv5x / Swin+YOLOv10 en GPU de escritorio.
- **Cero datos de campo bolivianos o latinoamericanos.** Los datasets (CHV, SHWD, SHCVP, SHD, HHWD)
  son mayormente asiaticos.
- **Escala de multas VIGENTE en bolivianos** por incumplir higiene y seguridad: el art. 53 del
  DL 16998 esta en pesos de 1979. Sin este dato NO se le puede decir a un cliente "te ahorras X".
- **Texto oficial de la RM 992/23 y la NTS 009/23:** leido solo en resumen de una consultora privada,
  no en fuente del Ministerio de Trabajo.
- **Capitales del SOATC** (Bs 7.000 gastos medicos / Bs 70.000 muerte o incapacidad): vistos en
  resumen de busqueda, no en el PDF de la APS.
- **Que exige la normativa laboral boliviana sobre videovigilancia de trabajadores y consentimiento:
  NO VERIFICADO.** Critico, porque la foto del evento SI identifica a una persona.
- **Boletin Estadistico 2024 del Ministerio de Trabajo:** existe, no fue abierto; podria reemplazar
  el dato 2010-2012 que hoy es lo mejor disponible.

**De los casos descartados**
- **Conteo de bultos en descarga real de contenedor: cero cifras publicadas**, ni con camara fija ni
  con telefono. El despliegue mas grande del mundo en el nicho (Kargo) publica volumen, nunca error
  de conteo. Los ">99%" de proveedores son marketing sin metodologia.
- **Costo real en Bolivia de un faltante de contenedor** y **montos de multa por contravencion
  aduanera**: NO VERIFICADO (se confirmo la figura legal, no la escala).
- **Dwell time frente a gondola: cero estudios revisados por pares.** Es el hueco mas grande del caso
  retail.
- **Cero mediciones de aforo hechas con un TELEFONO** contra conteo manual en tienda real.
- **Cero jurisprudencia o resolucion boliviana** que aplique el DS 1793 art. 56 a videovigilancia
  analitica en un local. La lectura del articulo es interpretacion de texto, no precedente.
- **Conteo de bovinos en manga con vision, medido:** no existe publicado. El 91-96% de la tabla es
  inferencia desde cerdos en pasillo, no medicion en bovinos.
- **Conteo de bovinos con camara de telefono a nivel del suelo:** cero cifras. Todo el corpus es dron
  a 30 m o camara fija.
- **Degradacion por polvo, lluvia y contraluz en porcentaje:** ningun estudio con cifra, en ninguno de
  los 4 casos. Solo menciones cualitativas de que la robustez ante iluminacion extrema y oclusion
  sigue siendo problema abierto.

**De hardware**
- **FPS medido de COCO-SSD/YOLO en un telefono de gama baja NUEVO vendido en Bolivia** (Unisoc T7200,
  T606, Helio G): no existe entrada en el benchmark ncnn. El "2-5 FPS" es estimacion por clase de CPU.
- **Energia por cuadro y autonomia real en un telefono MODERNO con NPU:** el unico dato medido
  (5,2-5,5 J/cuadro) es de un Nexus 6 de 2014 sin NPU. La cifra moderna es seguramente mejor y no la
  tenemos.
- **Minutos exactos de autonomia y grados de temperatura** con deteccion continua sobre camara.
- **Precio de tripode, soporte y cargador en Bolivia:** el costo del kit (Bs 1.300-1.600) lleva ese
  componente sin verificar.
- **Estado real de WebNN** (acceso a NPU desde el navegador) en Chrome Android y Safari en 2026.

---

## Fuentes

Precision y modelos: [PMC8156681](https://pmc.ncbi.nlm.nih.gov/articles/PMC8156681/) ·
[PMC12297540](https://pmc.ncbi.nlm.nih.gov/articles/PMC12297540/) ·
[PMC12568081](https://pmc.ncbi.nlm.nih.gov/articles/PMC12568081/) ·
[PMC12467545](https://pmc.ncbi.nlm.nih.gov/articles/PMC12467545/) ·
[PMC11280984](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11280984/) ·
[Sensors 22:3617](https://doi.org/10.3390/s22103617) ·
[Springer ICCIES 2026](https://link.springer.com/chapter/10.1007/978-3-032-21625-0_24) ·
[arXiv 2007.04942](https://arxiv.org/pdf/2007.04942) ·
[arXiv 2405.14458](https://arxiv.org/html/2405.14458v1) ·
[arXiv 2508.14370](https://arxiv.org/html/2508.14370v1) ·
[arXiv 1906.10490](https://arxiv.org/pdf/1906.10490) ·
[arXiv 2308.02935](https://arxiv.org/pdf/2308.02935) ·
[PMC8321743](https://pmc.ncbi.nlm.nih.gov/articles/PMC8321743/) ·
[Sensors 20:2126](https://pmc.ncbi.nlm.nih.gov/articles/PMC7181249/) ·
[Remote Sensing 16:2929](https://www.mdpi.com/2072-4292/16/16/2929) ·
[ISPRS Open J. 2025](https://www.sciencedirect.com/science/article/pii/S2667393225000250) ·
[PMC11047650](https://pmc.ncbi.nlm.nih.gov/articles/PMC11047650/) ·
[UCMCTrack arXiv 2312.08952](https://arxiv.org/pdf/2312.08952) ·
[PMTrack ACCV 2024](https://openaccess.thecvf.com/content/ACCV2024/papers/Guo_PMTrack_Multi-object_Tracking_with_Motion-Aware_ACCV_2024_paper.pdf) ·
[COCO classes](https://docs.ultralytics.com/datasets/detect/coco/) ·
[YOLO11](https://docs.ultralytics.com/models/yolo11/)

Hardware: [ncnn benchmark](https://github.com/Tencent/ncnn/blob/master/benchmark/README.md) ·
[OpenDataCam device table](https://github.com/opendatacam/demo-object-detection-browser/) ·
[ACM TOSEM arXiv 2402.05981](https://arxiv.org/abs/2402.05981) ·
[CoreML/Ultralytics](https://docs.ultralytics.com/integrations/coreml/) ·
[ejtech RPi4](https://www.ejtech.io/learn/tflite-object-detection-model-comparison) ·
[3DMark sustained](https://benchmarks.ul.com/news/using-3dmark-to-measure-sustained-performance) ·
[arXiv 2011.13075 energia](https://arxiv.org/abs/2011.13075) ·
[Android IP Camera](https://github.com/DigitallyRefined/android-ip-camera) ·
[WebGPU](https://web.dev/blog/webgpu-supported-major-browsers) ·
[Wake Lock](https://caniuse.com/wake-lock) ·
[Tienda Amiga](https://www.tiendaamiga.com.bo/celulares/smartphone) ·
[Dismac tablets](https://www.dismac.com.bo/categorias/54-electronica/computacion/tablets.html) ·
[SISC camara IP](https://siscbolivia.com/producto/camara-ip/)

Legal y mercado Bolivia: [DL 16998](https://www.lexivox.org/norms/BO-DL-16998.html) ·
[Ley 1155](https://www.lexivox.org/norms/BO-L-N1155.html) ·
[DS 4058](https://www.lexivox.org/norms/BO-DS-N4058.html) ·
[NTS 009/23 (resumen SIAC)](https://siacbolivia.com/elaboracion-de-programas-de-gestion-de-seguridad-y-salud-en-el-trabajo-nts/) ·
[IBCE accidentes](https://ibce.org.bo/principales-noticias-bolivia/noticias-nacionales-detalle.php?id=46592) ·
[Boletin MinTrabajo 2024](https://mintrabajo.gob.bo/wp-content/uploads/2025/10/Boletin-Estadistico-2024.pdf) ·
[DS 1793](https://www.lexivox.org/norms/BO-RE-DSN1793.html) ·
[Ley 264](https://www.lexivox.org/norms/BO-L-N264.html) ·
[DS 1436](https://www.lexivox.org/norms/BO-DS-N1436.html) ·
[DLA Piper Bolivia](https://www.dlapiperdataprotection.com/guide.pdf?c=BO) ·
[Anteproyecto AGETIC](https://agetic.gob.bo/sites/default/files/2025-06/DATOS-PERSONALES-PRESENTACION-ANTEPROYECTO-DE-LEY-2024-firmado.pdf) ·
[Ley 1990 Aduanas](https://www.ait.gob.bo/wp-content/uploads/2023/04/Ley-1990-Ley_General_de_Aduanas.pdf) ·
[ATS Logistics reclamos](https://atslogistics.com/what-are-freight-claims-and-what-you-need-to-know-about-them/) ·
[NorthStandard](https://north-standard.com/insights-and-resources/resources/archive/press-releases/bulk-carriers-can-no-longer-rely-on-customary-shortage-says-north-pi-club) ·
[SENASAG REGENSA 3.16](https://www.senasag.gob.bo/index.php/tramites-y-servicios/convocatorias/regensa-en-linea/479-capitulo-3-16-trazabilidad) ·
[Fegasacruz USD 4 MM](https://larazon.bo/economia/2024/02/09/en-2023-el-abigeato-ocasiono-un-dano-de-us-4-millones-en-santa-cruz/) ·
[Fegasacruz 348 casos 2025](https://eldia.com.bo/2025-08-13/economia/fegasacruz-insiste-en-endurecer-penas-por-abigeato-este-ano-ya-van-348-casos.html) ·
[Salario minimo Bs 3.300](https://unitel.bo/noticias/economia/decreto-el-salario-minimo-sube-a-bs-3300-su-aplicacion-es-obligatoria-y-rige-desde-el-2-de-enero-de-2026-CM18639182) ·
[Perdikaki et al. MSOM 2012](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=1778644) ·
[Chuang et al. POM 2016](https://onlinelibrary.wiley.com/doi/abs/10.1111/poms.12403)
