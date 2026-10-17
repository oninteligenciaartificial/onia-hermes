# Repaso de la Biblioteca de anuncios de Meta: qué replicar (16-oct-2026)

> Pedido de Sergio Urcullo (16-oct, punto 3 de `docs/cola/loop/hermes-jefa.md`). Hilo Ventas y pauta.
> **Método y límite:** conector `ads_library_search` (solo lectura). Trae título, fecha de inicio y moneda; **no trae imagen ni texto**. Facebook no abre desde la nube, así que **los creativos no se vieron**: lo que sigue sale de títulos y de días al aire. La única señal pública es **la antigüedad del anuncio**, y **no prueba rendimiento**: puede ser una campaña siempre activa o descuidada. Se usa como **hipótesis a probar** (qué formatos vale la pena ensayar), no como prueba de que a esos anunciantes les rinda. Días contados al 16-oct, hora de La Paz.
> Complementa a `FORMATOS-QUE-SOSTIENEN.md` (8-oct, 39 anuncios capturados el 1-2 oct). No lo reemplaza.

## 1. Lo que se leyó hoy

| Anunciante | Anuncios activos hoy | Lo que sostiene (30+ días) | Lo nuevo (menos de 3 días) |
|---|---|---|---|
| **Doctocliq** (22 en BO/PE/CO/MX/EC) | «Dejá de perder citas» 63 d · «¿Tu consultorio crece o solo sobrevive?» 59 d · «Todos ven lo mismo. Tú tienes el control.» 52 d · «El éxito no es casualidad» 51 d · «¿Tu consultorio funciona sin tu asistente?» y «Toda tu clínica en un solo lugar» 33 d | Los títulos **de dolor y de duda** (cita perdida, crece o sobrevive, sin asistente) duran más que los de función | «Doctor, deje de depender de una sola persona» (15-oct) y uno sin título (14-oct): **pasaron al tratamiento de usted** |
| **CitaPro** (leído el 16-oct, más temprano en la sesión) | «Cabinas llenas, agenda bajo control» 91 d · «Tu WhatsApp en piloto automático» 71 d | Beneficio concreto + WhatsApp | «Pautar no basta: el seguimiento convierte» (14 d), «asistente con IA» (17 d) |
| **Dt.Dental** | Selfie F1 sobre una obligación con fecha, 107 d | Formato barato de una persona a cámara | Anuncios sobre normativa |
| **Dentalink** (472 anuncios) | Tienen descuento y urgencia hoy («25% OFF Plan Semestral») y títulos de IA | No hay ancla de duración en este repaso | Descuento con fecha; **no replicar** |
| **AgendaPro** | Lote del 15-16 oct: el mismo concepto partido por rubro (clínica, barbería, gimnasio) | Sin días aún | «Chau carpetas», «¿Cómo va el tratamiento?», «Seguimiento de pacientes sin caos» |

⚠️ Dos anuncios del grupo que más duraba (Doctocliq `1014591764512827` y `1952892278698712`, 91 y 85 d en la lectura anterior) **no aparecen en la consulta de hoy** (otros países o ya cortados). La captura confirma si siguen.

## 2. Qué se replica y qué no

### Replicar como hipótesis a probar (salen de lo que dura, que no prueba rendimiento)

1. **Titular de dolor o de duda en vez de función.** Lo más antiguo de Doctocliq son preguntas («¿crece o solo sobrevive?») y una orden de dolor («Dejá de perder citas»). Versión Onia: «¿Quién de mañana no confirmó?» (F4 de `FORMATOS-QUE-SOSTIENEN.md`, ya hecho en código).
2. **Una persona a cámara, voz natural, una sola idea** (Dt.Dental 107 d). Es el formato más barato de sostener. Versión Onia: el selfie de Sergio Urcullo, guion F1/F3 ya escrito. Encaja con el funnel de `sales-kit/09`.
3. **Pasar al «usted» en el titular.** Doctocliq lo hizo el 15-oct («Doctor, deje de depender de una sola persona»). Onia ya lo usa con clientes; la señal confirma que el mercado de clínicas lo tolera en pauta.
4. **Un concepto, muchas variantes** (AgendaPro por rubro; Doctocliq repite el mismo título 3-4 veces con tomas distintas). Versión Onia: un gancho, tres rubros (dental, estética, importadora), distintos fotogramas. Cuesta poco y mide más.
5. **La obligación de dueño como tema** (delegar, depender de una persona). «Sin tu asistente» aguanta 33 d: habla del miedo del dueño, no del paciente. Versión Onia: «Si hoy falta su recepcionista, ¿quién avisa a los pacientes de mañana?», **solo si Pendientes está en ✅** (ver 3).

### No replicar

| Lo que hacen | Por qué no |
|---|---|
| Descuentos con fecha (Dentalink 25 % OFF) | Onia no tiene motivo real para una cuenta regresiva (`07` §0, reglas de la skill §9.3) |
| «Hasta ChatGPT lo respalda», «+500 centros» y cifras sin fuente | Afirmaciones que Onia no mide; cero clientes, cero testimonios |
| Nombrar o mostrar a otro | Prohibido nombrar competidores |
| Tono de IA que lo hace todo | Onia **prepara el texto de cada agente y el dueño lo aprueba una vez**; no se vende como IA autónoma |
| Mandar directo a una demo o cuenta gratis desde un anuncio frío | Hoy el destino decidido es WhatsApp con el bot y los 3 botones; la hipótesis de `/llamada` directo queda para una segunda tanda (`ONIA_ADQUISICION_Y_PAUTA.md` §5.6) |

## 3. Lo que Onia puede decir hoy y lo que no (para no copiar de más)

Antes de usar cualquiera de las líneas anteriores, la fila correspondiente de `ONIA_PROMESA_VS_PRODUCTO.md` tiene que estar en ✅. Hoy: **ninguna fila de A1 lo está**; las piezas están preparadas, no suben. El plan Básico **no trae** la lista diaria de pendientes (viene desde Crece): un anuncio que muestre Pendientes no puede prometerlo a quien compra Básico.

## 4. Lista exacta de capturas para la sesión de la PC (unos 15 minutos)

Facebook no abre desde la nube. Se pide a la madre en la PC lo mismo que en `PEDIDO-CAPTURAS.md` (cómo capturar, dónde guardar y nombre de archivo siguen igual: `research/competencia/anuncios/<anunciante>/<id>.png`, tarjetas `-2`, `-3`; en video, tres cuadros y la duración).

**Prioridad 1 · lo que sostiene (verificar que sigue vivo y capturar el texto completo):**

| # | Anunciante | id | Título | Desde |
|---|---|---|---|---|
| 1 | Doctocliq | 895549733230235 | Dejá de perder citas. Mira cómo lograrlo. | 14-ago |
| 2 | Doctocliq | 1684698082830679 | ¿Tu consultorio crece o solo sobrevive? | 18-ago |
| 3 | Doctocliq | 2933585537003558 | Todos ven lo mismo. Tú tienes el control. | 25-ago |
| 4 | Doctocliq | 1456602893194865 | El éxito no es casualidad | 26-ago |
| 5 | Doctocliq | 1552115046722567 | ¿Tu consultorio funciona sin tu asistente? | 28-sep |
| 6 | Doctocliq | 1014591764512827 | La agenda que trabaja contigo (¿sigue vivo?) | 17-jul |
| 7 | Doctocliq | 1952892278698712 | Prueba Doctocliq ahora (¿sigue vivo?) | 23-jul |
| 8 | CitaPro | 1880949689530541 | Cabinas llenas, agenda bajo control | 17-jul |
| 9 | CitaPro | 2253602242100999 | Tu WhatsApp en piloto automático | 6-ago |
| 10 | Dt.Dental | 1064012876297472 | Selfie sobre obligación con fecha (F1) | 30-jun |

**Prioridad 2 · lo nuevo, para ver si cambia el estilo:**

| # | Anunciante | id | Título | Desde |
|---|---|---|---|---|
| 11 | Doctocliq | 1362626155947447 | Doctor, deje de depender de una sola persona | 15-oct |
| 12 | Doctocliq | 1835129801006001 | (sin título: ver imagen/video) | 14-oct |
| 13 | AgendaPro | pedir el id en la Biblioteca (página AgendaPro, lote 15-16 oct) | «¿Cómo va el tratamiento?» | 15-oct |
| 14 | AgendaPro | pedir el id (mismo lote) | «Seguimiento de pacientes sin caos» | 15-oct |
| 15 | AgendaPro | pedir el id (mismo lote) | «Chau carpetas» | 15-oct |
| 16 | CitaPro | pedir el id (página CitaPro) | Pautar no basta: el seguimiento convierte | 2-oct |
| 17 | Dentalink | pedir el id | 25% OFF Plan Semestral (solo para ver cómo presentan la urgencia) | hoy |

**Qué anotar de cada captura (una línea por anuncio, en `<anunciante>/<id>.txt`):** gancho de los primeros 3 segundos · quién habla (persona real, sintética, solo pantalla) · si muestra el producto y cuánto tiempo · botón y destino · duración. **No** copiar guion ni imagen: se extrae la estructura.

**Para qué se usa:** (1) confirmar o corregir la tabla de la sección 1; (2) elegir el gancho de las primeras tres piezas del funnel (`sales-kit/09` §3.1); (3) decidir si la versión de usted en titular ya es común o es un caso de Doctocliq.

## 5. Lo que queda sin saber

- No se sabe cuánto rinde ninguno: solo cuánto dura.
- Los ids de AgendaPro, CitaPro nuevos y Dentalink hay que sacarlos de la propia Biblioteca; el conector de hoy devolvió otros anunciantes con el mismo nombre.
- Si Doctocliq pasó a «usted» como prueba o como cambio definitivo se ve en 7 días (¿siguen vivos los dos del 14-15 oct?). Repetir la lectura el 23-oct.
