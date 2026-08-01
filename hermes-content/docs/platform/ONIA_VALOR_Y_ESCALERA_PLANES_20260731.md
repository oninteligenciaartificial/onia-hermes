# Cuánta plata le genera Onia a un cliente — y la escalera de planes que sale de ahí

> **2026-07-31.** Sergio: *"quiero que hagas un cálculo de cuántas ventas le ayudarías a una
> persona, o sea, lo vamos a calcular en base al valor que le vamos a dar"*.
>
> Este doc **extiende** `ONIA_PRICING_MODELO_20260730.md` (que fija el método y el eje de cobro)
> con el número: cuántos bolivianos al mes, con qué supuestos, y qué escalera aguanta ese número.
>
> **Reglas de honestidad aplicadas.** Cada cifra es una de tres cosas:
> `[FUENTE]` dato verificable con URL · `[SUPUESTO]` estimación mía declarada como tal ·
> `[CONFIRMAR]` no lo puedo estimar sin inventar. **Onia tiene cero clientes pagando: no hay
> ni un caso real que citar, y está prohibido fabricarlo.**

---

## 0. El resumen, antes de los cálculos

1. **Para la clínica objetivo (2 sillones, ~800 pacientes en ficha, ~220 citas/mes), Onia
   produce ~Bs 3.500/mes de margen adicional.** Contra el plan de Bs 750, es **4,7x**.
2. **El escenario conservador NO llega a 3x contra Bs 750 (da 1,2x).** Eso no es un problema del
   precio: es que **el argumento de valor no aplica a una clínica chica**. A esa se le vende
   orden, y se le vende barato. De ahí sale el escalón de entrada.
3. **El plan de Bs 1.500 tampoco llega a 3x en el escenario medio (2,4x).** Necesita una clínica
   de 3+ sillones. Hoy se lo estamos ofreciendo a quien no lo puede justificar.
4. **La palanca más grande del modelo es la que menos respaldo tiene.** La reactivación de
   pacientes dormidos no tiene UN SOLO estudio publicado — solo blogs de vendedores de software
   dental, que venden exactamente lo que esas cifras justifican. Se mide con el cliente 1 o no
   se afirma.
5. **El valor no depende de WhatsApp.** Que el envío automático esté bloqueado (S3) no mata el
   argumento: el valor está en **saber a quién llamar**, no en quién aprieta enviar. Eso es
   entregable hoy y hay que venderlo así.

---

# PARTE 1 — El cálculo del valor, en bolivianos

## 1.1 Los precios de referencia — lo que sí se pudo verificar

Investigación 2026-07-31. Precios públicos de clínicas de Santa Cruz.

| Servicio | Bs | Fuente |
|---|---:|---|
| **Consulta** | **180** | [CRO — Clínica de Rehabilitación Odontológica, SCZ](https://www.cro.com.bo/) `[FUENTE]` |
| **Consulta** | **100** | [Losodontologos SCZ](https://losodontologos.com/bolivia/precios-santa-cruz/) `[FUENTE]` |
| Limpieza / profilaxis + flúor | 200–350 | Losodontologos SCZ `[FUENTE]` |
| Resina simple (1 superficie) | 150 | Losodontologos SCZ `[FUENTE]` |
| Extracción simple | 250–300 | Losodontologos SCZ / [boliviaconsulta](https://dental.boliviaconsulta.com/santa-cruz/) `[FUENTE]` |
| Endodoncia uni / multiradicular | 1.200 / 2.100 | Losodontologos SCZ `[FUENTE]` |
| Corona metal-porcelana / cerámica | 1.500 / 2.100+ | Losodontologos SCZ `[FUENTE]` |
| Blanqueamiento (3 sesiones) | 800 | Losodontologos SCZ `[FUENTE]` |
| Ortodoncia — control mensual | 300–350 | Losodontologos SCZ `[FUENTE]` |
| Brackets metálicos (total, SCZ) | desde 3.000 | [boliviaconsulta, feb-2026](https://dental.boliviaconsulta.com/blog/precio-brackets-bolivia/) `[FUENTE]` |
| Implante + corona | 5.500 | [boliviaconsulta SCZ](https://dental.boliviaconsulta.com/santa-cruz/implantes-dentales/) `[FUENTE]` |

**Hallazgo comercial del proceso:** las clínicas serias de Santa Cruz (CRO, DentisTree, Imagina,
Cortez, Nexo) **no publican tarifas** — cotizan por WhatsApp. CRO publica una sola cosa: la
consulta a Bs 180. Eso significa dos cosas: (a) el precio de consulta es el dato más sólido que
tenemos, (b) el resto descansa mayormente en **una sola lista sin fecha** (Losodontologos SCZ,
que se autodeclara "precios aproximados").

⚠️ **Lo que este cuadro NO dice: cuánto factura una silla ocupada en promedio.** Una cita puede
ser un control de ortodoncia de Bs 300 o una sesión de endodoncia dentro de un plan de Bs 1.200.
Ese promedio es el multiplicador de 3 de las 5 palancas y **es el número #1 a confirmar** (§1.7).

## 1.2 Los supuestos del modelo — todos declarados

**Perfil de la clínica objetivo:** 2 sillones, 1 recepcionista, Santa Cruz, mix general
(no solo ortodoncia).

| Parámetro | Conservador | Medio | Optimista | Origen |
|---|---:|---:|---:|---|
| Citas programadas/mes | 150 | 220 | 300 | `[SUPUESTO]` — 2 sillones × 22 días × 3,5–7 citas |
| **Ticket promedio por cita (Bs)** | **150** | **250** | **350** | `[CONFIRMAR]` — derivado de §1.1 |
| Pacientes en ficha (visita <24 meses) | 400 | 800 | 1.500 | `[CONFIRMAR con el cliente]` |
| Ciclo de recall (meses) | 6 | 6 | 6 | Estándar odontológico |
| % que toca recall y no reagenda solo | 50% | 50% | 50% | `[SUPUESTO]` |
| **Tasa de respuesta a reactivación** | **3%** | **5%** | **8%** | ⚠️ `[SUPUESTO SIN NINGUNA FUENTE]` — ver §1.3 |
| Valor del ciclo de retorno (Bs) | 250 | 450 | 800 | `[SUPUESTO]` — consulta + limpieza / + resina / + tratamiento |
| Tasa de no-show base | 15% | 20% | 25% | `[FUENTE]` — ver §1.4 |
| Reducción relativa por recordatorio | 12,5% | 20% | 33% | `[FUENTE]` — ver §1.4 |
| % de silla vacía que NO se rellena | 60% | 70% | 80% | `[SUPUESTO]` |
| Citas nuevas captadas fuera de horario/mes | 2 | 5 | 10 | `[SUPUESTO]` — ver §1.6 |
| Horas/día de recepción liberadas | 1,0 | 1,5 | 2,0 | `[SUPUESTO]` |
| Días hábiles/mes | 22 | 22 | 22 | Convención |
| Costo hora recepción (Bs) | 15,87 | 15,87 | 15,87 | `[FUENTE]` — ver §1.7 |
| **Margen de contribución** sobre facturación extra | 70% | 70% | 70% | `[SUPUESTO]` — ticket menos insumos/laboratorio |

> **Por qué aplico un margen de 70% y no cuento la facturación entera.** Una silla vacía que se
> llena no genera Bs 250 de ganancia: genera Bs 250 de facturación menos insumos y laboratorio.
> El tiempo del odontólogo ya está pagado (por eso la silla vacía duele), pero los materiales no.
> Para coronas e implantes el margen es menor (el laboratorio pesa); para consultas y limpiezas
> es mayor. **70% es mi supuesto de mezcla.** Vender el número bruto sin este descuento es
> exactamente el tipo de inflado que se cae en la primera demo.

## 1.3 Palanca 1 — Pacientes recuperados (recall)

**Cómo funciona:** el agente Recall detecta pacientes que cruzaron ~180 días sin volver y propone
contactarlos.

**⚠️ Advertencia de honestidad, la más importante de este documento.**

Busqué evidencia académica sobre la tasa de reactivación de pacientes dentales dormidos.
**No existe.** Lo único que aparece son blogs de proveedores de software dental
([dialoghealth](https://www.dialoghealth.com/post/patient-reactivation-statistics),
[clerri](https://clerri.com/blog/dental-patient-reactivation-statistics), y otros) que citan
"10-15%", "3-5% con un contacto", "15-25% multicanal" **sin publicar ni una fuente, ni un n, ni
una metodología**. Son piezas de SEO escritas por gente que vende exactamente el producto que
esas cifras justifican.

Tampoco hay dato del **% de la base de una clínica que está dormida**. El proxy poblacional que
sí es oficial: en EE.UU. solo el **45% de la población** tuvo una visita dental en 12 meses
([ADA Health Policy Institute, 2022](https://www.ada.org/resources/research/health-policy-institute/dental-care-market)),
y en Inglaterra el **40% de los adultos** vio a un dentista del NHS en 24 meses
([NHSBSA 2024/25](https://www.nhsbsa.nhs.uk/statistical-collections/dental-england/dental-statistics-england-202425)).
Eso sirve para argumentar que el mercado dormido es grande. **No sirve para prometer un % de
reactivación.**

**Consecuencia:** uso 3% / 5% / 8% como `[SUPUESTO]` explícito, deliberadamente por debajo de lo
que dicen los blogs. Y la conclusión operativa es que **esta cifra se mide con el cliente 1 y se
convierte en dato propio** — que además nadie más va a poder citar.

**Cálculo (estado estable, mensual).** Ojo: no se contacta toda la base cada mes; se contacta a
los que cruzan el umbral.

```
candidatos/mes  = base en ficha ÷ ciclo de recall × % que no reagenda solo
reactivados     = candidatos × tasa de respuesta
facturación     = reactivados × valor del ciclo de retorno
```

| | Conservador | Medio | Optimista |
|---|---:|---:|---:|
| Candidatos/mes | 33 | 67 | 125 |
| Reactivados/mes | 1,0 | 3,3 | 10,0 |
| **Facturación** | **Bs 250** | **Bs 1.500** | **Bs 8.000** |

**Extra de una sola vez — la barrida inicial.** El primer mes se contacta a TODA la base dormida
acumulada, no solo a los que cruzan el umbral. Con un 30/40/50% de base inactiva `[SUPUESTO]`:

| | Conservador | Medio | Optimista |
|---|---:|---:|---:|
| Inactivos acumulados | 120 | 320 | 750 |
| **Facturación del mes 1** | **Bs 900** | **Bs 7.200** | **Bs 48.000** ⚠️ |

⚠️ El optimista choca contra el techo físico: 60 pacientes extra en un mes necesitan 60 sillas
libres. **El techo del valor no es cuánta gente responde: es cuántos sillones tenés libres.**
Ese es un límite real que hay que decir en la demo, y que además es un argumento de upsell
(si no te entran, necesitás otro sillón — o el plan que gestiona dos).

## 1.4 Palanca 2 — Ausencias evitadas

**Esta es la palanca con evidencia de verdad.**

**Cuánto se falta.** La literatura da un rango amplio: **5% a 38%**
([Oliveira et al. 2025, Int. J. of Dentistry](https://onlinelibrary.wiley.com/doi/10.1155/ijod/2114933)).
Los extremos se explican por el contexto: **7,4%** en el servicio público finlandés sobre
2,5 millones de citas ([BMC Oral Health 2025](https://bmcoralhealth.biomedcentral.com/articles/10.1186/s12903-025-07045-4))
frente a **~31%** en una facultad de odontología saudí
([Cureus 2023](https://www.cureus.com/articles/193647-exploring-factors-associated-with-missed-dental-appointments-a-machine-learning-analysis-of-electronic-dental-records)).
**El dato LatAm más cercano a una clínica normal: 24% de inasistencia en Chile**
(Garrido et al., citado en [Rev. Estomatológica Herediana 2024](http://www.scielo.org.pe/scielo.php?script=sci_arttext&pid=S1019-43552024000100063)).
Uso **15% / 20% / 25%**.

**Cuánto lo baja un recordatorio.** El dato fuerte es la revisión Cochrane
(Gurol-Urganci et al. 2013, 8 ECAs, 6.615 participantes,
[Cochrane Library](https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD007458.pub3/full)):
la asistencia sube de **67,8% a 78,6%** con recordatorio por mensaje (RR 1,14; IC95% 1,03–1,26).
Traducido: el ausentismo baja de 32,2% a 21,4%, o sea **-33% relativo**. Y el mensaje **iguala a
la llamada telefónica** (RR 0,99) costando 55-65% menos.

**Pero hay que ser honesto con tres cosas:**

1. **Cochrane no es odontología** — es una mezcla de especialidades. En odontología
   específicamente la evidencia es **mixta**: Stormon et al. 2022 (Queensland, 118.266 citas)
   encontró un efecto parcial y contradictorio
   ([Health & Social Care in the Community](https://onlinelibrary.wiley.com/doi/abs/10.1111/hsc.13663)),
   y Bellucci et al. encontró que el SMS **no fue efectivo**.
2. **El dato LatAm es más chico:** en Chile el recordatorio telefónico bajó la inasistencia de
   24% a 21% (**-12,5% relativo**) — pero con un efecto lateral valioso: **40% menos de horas
   ociosas de sillón** (Garrido et al., vía Rev. Est. Herediana 2024).
3. **⚠️ WhatsApp específicamente NO tiene ensayo positivo.** El único ECA que encontré (Brasil,
   998 participantes, recordatorio 48h antes) dio **24% vs 25,5%, p=0,58 — no significativo**
   ([Rev. Cubana de Información en Ciencias de la Salud, 2020](https://www.redalyc.org/journal/3776/377665638014/html/)).

> **Regla para el kit de venta:** citar el efecto **del recordatorio** (Cochrane, probado), nunca
> "WhatsApp reduce el no-show un X%". WhatsApp se justifica como **canal** (es el que el paciente
> boliviano lee), no como intervención probada. Decir lo contrario es citar un estudio que no
> existe.

Uso **-12,5% (Chile, medido) / -20% (interpolado) / -33% (Cochrane)**.

```
no-shows/mes  = citas × tasa de no-show
recuperadas   = no-shows × reducción relativa
facturación   = recuperadas × ticket × % de silla que no se rellenaba sola
```

| | Conservador | Medio | Optimista |
|---|---:|---:|---:|
| No-shows/mes | 22,5 | 44,0 | 75,0 |
| Citas recuperadas/mes | 2,8 | 8,8 | 24,8 |
| **Facturación** | **Bs 253** | **Bs 1.540** | **Bs 6.930** |

## 1.5 Palanca 3 — Cobros recuperados: **Bs 0 hoy**

El agente Cobrador existe en el core, pero según `ONIA_PLATFORM_ESTRUCTURA_20260730.md` §3 la
cola de aprobación tiene **1 work item y 0 aprobaciones en producción, y aprobar no dispara
nada**. El módulo `agents` **ni siquiera tiene tabla en la base de producción**.

**No se cobra por lo que no existe. Esta palanca entra al cálculo en Bs 0** hasta que aprobar
dispare un envío real.

Cuando se destrabe, la fórmula es `saldo vencido mensual × tasa de recuperación con seguimiento
sistemático`. Ninguno de los dos números existe: no hay dato de morosidad odontológica boliviana
publicado. `[CONFIRMAR con el cliente: "¿cuánto tenés hoy en saldos que nadie persiguió?"]` — es
una pregunta que además abre la conversación de venta sola.

## 1.6 Palanca 4 — Citas fuera de horario (`/book`)

La reserva pública `/book` está **🟢 funcionando** (verificado en la estructura de plataforma:
ruta `app/(public)/book/` con confirmación por token). Un paciente puede agendar un domingo a
las 23:00.

**El dato de "llamadas perdidas" que circula NO es un estudio.** Lo mejor que existe es el caso
de una plataforma que vende justamente atención telefónica con IA: 38% de 4.280 llamadas sin
contestar en 26 clínicas dentales
([Peerlogic, feb-2026](https://www.peerlogic.com/post/peerlogic-dso-case-study)).
Es **dato de vendedor** con sesgo de selección brutal — las clínicas que contratan eso son las
que ya tenían el problema. Se puede mencionar citándolo literalmente como lo que es; **nunca
como "estudios muestran"**.

Por eso esta palanca va parametrizada con un supuesto deliberadamente bajo: **2 / 5 / 10 citas
nuevas al mes** captadas fuera de horario.

| | Conservador | Medio | Optimista |
|---|---:|---:|---:|
| **Facturación** | **Bs 300** | **Bs 1.250** | **Bs 3.500** |

**Ventaja de venta de esta palanca:** es la única que el cliente puede **verificar solo, gratis,
en la demo**. Se le pide que agenda una cita desde su propio celular. No hay que creerle a nadie.

## 1.7 Palanca 5 — Horas liberadas de recepción

**El único cálculo enteramente verificable del documento.**

El salario mínimo nacional es **Bs 3.300**, fijado por el **Decreto Supremo 5516**, publicado en
la Gaceta Oficial el 13-ene-2026 y vigente desde el 1-ene-2026
([Unitel](https://unitel.bo/noticias/economia/el-salario-minimo-de-bs-3300-rige-desde-el-1-de-enero-de-2026-estas-son-las-9-claves-de-su-reglamento-FI19116012) ·
[Pixilegal — DS 5516](https://www.pixilegal.com/normativa/decreto-5516-2026-01-13)) `[FUENTE]`.

Con jornada legal de 8 h/día y 48 h/semana → 208 h/mes → **Bs 15,87/hora**.

| | Conservador | Medio | Optimista |
|---|---:|---:|---:|
| Horas liberadas/mes | 22 | 33 | 44 |
| **Ahorro** | **Bs 349** | **Bs 524** | **Bs 698** |

> `[SUPUESTO]` El costo-empleador real es mayor que el salario base: aportes patronales,
> aguinaldo y cargas suman un factor que no verifiqué. **Uso el salario base como piso
> deliberado.** Y una recepcionista de clínica privada en Santa Cruz probablemente gane más que
> el mínimo — con lo cual esta línea está subestimada a propósito.

⚠️ **Advertencia que hay que decir en la demo:** las horas liberadas **solo son plata** si se
convierten en (a) más pacientes atendidos o (b) menos horas pagadas. En una clínica chica
normalmente no pasa ninguna de las dos: la recepcionista simplemente trabaja más tranquila. Es
valor real, pero es **valor percibido, no plata en el bolsillo**. Por eso esta palanca **no
puede ser el argumento principal** — es exactamente el error que ya señalaba
`ONIA_PRICING_MODELO_20260730.md` §4.2.

## 1.8 El total, y el múltiplo

| Palanca | Conservador | Medio | Optimista |
|---|---:|---:|---:|
| 1 — Recall (recurrente) | 250 | 1.500 | 8.000 |
| 2 — Ausencias evitadas | 253 | 1.540 | 6.930 |
| 3 — Cobros | **0** | **0** | **0** |
| 4 — `/book` fuera de horario | 300 | 1.250 | 3.500 |
| **Facturación adicional** | **803** | **4.290** | **18.430** |
| × margen de contribución 70% | 562 | 3.003 | 12.901 |
| 5 — Horas liberadas (ahorro puro) | 349 | 524 | 698 |
| **VALOR MENSUAL (margen)** | **Bs 911** | **Bs 3.527** | **Bs 13.599** |
| *(+ barrida inicial, una vez)* | *+630* | *+5.040* | *+33.600* |

*(La barrida inicial va también al 70% de margen.)*

### El múltiplo contra cada precio

| Plan (lanzamiento) | Conservador | Medio | Optimista |
|---|---:|---:|---:|
| **Bs 320** | **2,8x** ⚠️ | 11,0x ✅ | 42,5x ✅ |
| **Bs 750** ⭐ | **1,2x** 🔴 | **4,7x** ✅ | 18,1x ✅ |
| **Bs 1.500** | **0,6x** 🔴 | **2,4x** ⚠️ | 9,1x ✅ |

### Lectura honesta — y es la conclusión que manda sobre toda la Parte 2

> **En el escenario conservador el argumento de valor NO se sostiene: 1,2x contra el plan de
> Bs 750.** El pedido decía que si el múltiplo baja de 3x hay que decirlo. Lo digo.
>
> **Pero el problema no es el precio: es a quién se lo estamos ofreciendo.** El escenario
> conservador describe una clínica de ~400 fichas y 150 citas al mes. A esa clínica el plan de
> Bs 750 **legítimamente no le conviene**, y si se lo vendemos se va en el mes 3.
>
> Y hay un segundo hallazgo del mismo tipo: **el plan de Bs 1.500 tampoco llega a 3x en el
> escenario medio (2,4x).** Hoy se lo estamos ofreciendo a clínicas que no lo pueden justificar
> con números.

**El umbral de calificación, en datos duros:**

| Plan | Valor necesario para 3x | Perfil mínimo que lo alcanza |
|---|---:|---|
| Bs 190 (propuesto) | Bs 570 | 1 sillón, ~300 fichas |
| Bs 320 | Bs 960 | 1-2 sillones, ~400 fichas, ~150 citas/mes |
| **Bs 750** ⭐ | **Bs 2.250** | **2 sillones, ≥600 fichas, ≥200 citas/mes** |
| Bs 1.500 | Bs 4.500 | 3+ sillones, ≥1.000 fichas, ≥280 citas/mes — **o** mix de alto ticket (ortodoncia/implantes) |
| Empresa | Bs 13.500+ | 3+ sucursales o 6+ sillones |

**Esto es una herramienta de calificación de ventas, no una tabla decorativa.** Con tres
preguntas (¿cuántos sillones? ¿cuántos pacientes en ficha? ¿cuántas citas al mes?) se sabe qué
plan ofrecer — y cuál **no** ofrecer.

## 1.9 La frase de venta

Para la clínica objetivo (2 sillones, ~800 fichas, ~220 citas/mes):

> **"Onia te ayuda a recuperar alrededor de Bs 3.500 al mes. El plan cuesta Bs 750. Y el primer
> mes, cuando salimos a buscar a todos los pacientes que hace rato no vuelven, el número es más
> alto."**

Múltiplo: **4,7x**. Sano — un SaaS captura entre 10% y 25% del valor que crea; Bs 750 sobre
Bs 3.527 es **21%**, dentro de rango.

Para una clínica chica (1-2 sillones, ~400 fichas), la frase **es otra y el plan es otro**:

> *"Onia te ordena la clínica: la agenda, la ficha, el odontograma y la caja en un solo lugar, y
> los pacientes pueden reservarte turno un domingo a la noche. Bs 190 al mes."*

**Ahí no se promete plata recuperada.** Se promete orden. Y se cobra como orden.

## 1.10 ⚠️ Qué de todo esto se puede entregar HOY

Verificado contra `ONIA_PLATFORM_ESTRUCTURA_20260730.md` (2026-07-30).

| Palanca | Hoy | Cuando se destrabe |
|---|---|---|
| **1 — Recall** | 🟡 **El sistema identifica a quién llamar; llama la recepción.** El listado de inactivos es el valor; el envío automático está bloqueado (S3: número de WhatsApp + verificación Meta) | 🟢 Contacto automático |
| **2 — Ausencias** | 🟡 Igual: el sistema te dice a quién recordarle mañana; hoy se llama a mano. **La llamada tiene el mismo efecto probado que el mensaje** (Cochrane: RR 0,99) | 🟢 Recordatorio automático |
| **3 — Cobros** | 🔴 **No entregable.** Aprobar no dispara envío; el módulo `agents` no tiene tabla en producción | 🟢 Al conectar el disparo |
| **4 — `/book`** | 🟢 **Pleno hoy.** Verificable por el propio cliente en la demo | — |
| **5 — Horas** | 🟡 Parcial: se libera la agenda, se gasta tiempo llamando | 🟢 Pleno |
| **Facturación SIAT** | 🔴 **Mock.** Imprime *"SIMULACIÓN — SIN VALOR FISCAL"*. Bloqueado por NIT + homologación (caduca 1-oct-2026). **No se menciona en la demo como si funcionara** | — |

> **El giro que salva el pitch: el valor está en SABER a quién llamar, no en quién aprieta
> enviar.** Una recepcionista que abre el sistema y ve "estos 12 pacientes hace 7 meses que no
> vienen" y "a estos 8 hay que recordarles la cita de mañana" produce casi todo el valor de las
> palancas 1 y 2 — hoy, sin WhatsApp conectado. Lo que el envío automático agrega es **liberar
> las horas** (palanca 5), no crear el valor.
>
> Vendido así, el argumento **no depende de un bloqueo que no controlamos**. Y cuando WhatsApp se
> conecte, es una mejora que se anuncia, no una promesa que se estaba debiendo.

---

# PARTE 2 — La escalera de planes

## 2.1 El principio: el salto es de verbo, no de features

La regla de `CLAUDE.md` para propuestas dice que los niveles se distinguen por un **salto de
valor**, no por "más páginas". Aplicado acá, cada escalón cambia **lo que el sistema hace por
vos**, y eso se dice en un verbo:

| Escalón | Verbo | Qué significa para el dueño |
|---|---|---|
| 0 | **Ordena** | Dejás de perder información |
| 1 | **Recuerda** | Dejás de perder citas |
| 2 ⭐ | **Recupera** | Te trae de vuelta a los que se fueron |
| 3 | **Atiende** | Contesta y agenda sin vos |
| 4 | **Multiplica** | Lo mismo, por sucursal |
| 5 | **Es tu infraestructura** | Tu servidor, tu SLA, tus integraciones |

"Más usuarios" nunca es un escalón. "Exportar a Excel" tampoco. Si el gatillo de subir no se
puede decir en un verbo de esa lista, no es un escalón: es una pared para cobrar más.

## 2.2 La escalera propuesta

**Criterio de diseño:** conservar los tres precios ya publicados (320/750/1.500 lanzamiento;
390/890/1.990 lista) y **agregar los dos extremos que Sergio pidió**. Cambiar precios que ya
están en la landing tiene costo; agregar peldaños no.

---

### Escalón 0 — **Onia Consultorio** · Bs 190/mes *(lista Bs 250)* — NUEVO

**Para el que no se anima a empezar.**

- **Incluye:** agenda, ficha clínica, odontograma, tratamientos, cobros y caja, reportes básicos,
  reserva pública `/book`, 1 usuario administrador + 1 de recepción.
- **Límites:** 1 sillón · hasta 300 pacientes en ficha · **sin recordatorios ni recall**.
- **A quién:** el odontólogo solo, el que hoy trabaja con cuaderno, Excel o WhatsApp suelto.
  Es el que dice "yo soy chico, eso no es para mí".
- **Valor honesto:** Bs 350–570/mes (horas de recepción + 1-2 citas rescatadas por `/book`).
  Múltiplo **~1,8–3,0x**. **Acá NO se vende plata recuperada** — se vende que no se pierda una
  ficha y que el paciente pueda agendar solo.
- **Gatillo para subir:** *"quiero que el sistema le avise a los pacientes"* — o cruza los 300
  pacientes, o abre el segundo sillón.
- **Por qué existe:** con **cero clientes pagando**, el problema no es el margen: es que nadie
  quiere ser el primero. Un peldaño de Bs 190 llena el embudo y **crea la base de datos sobre la
  que después se vende el escalón 2** (sin pacientes cargados, el recall no tiene a quién
  reactivar). Es un producto de adquisición, y está bien que lo sea.
- **Riesgo — canibalización del plan de Bs 320.** Se controla con el límite duro: sin
  recordatorios ni recall, una clínica de 2 sillones no puede quedarse acá. **El límite tiene que
  ser real en el código, no una promesa.**
- Contra el mercado: el piso publicado boliviano es **Bs 85/mes** (Sintic, solo facturación).
  Bs 190 con agenda + ficha + odontograma es defendible.

---

### Escalón 1 — **Onia Clínica** · Bs 320/mes *(lista Bs 390)* — ya publicado

- **Suma:** recordatorios de cita · listado de pacientes inactivos (recall) · hasta 2 sillones ·
  hasta 800 pacientes · 3 usuarios con roles.
- **A quién:** clínica de 1-2 sillones, ~400 fichas, ~150 citas/mes.
- **Valor:** ~Bs 900/mes → **2,8x**. Justo en el borde. Es el primer peldaño donde el argumento
  de plata empieza a funcionar.
- **Gatillo para subir:** *"tengo más pacientes dormidos de los que puedo llamar a mano"*. Es un
  gatillo honesto y medible: cuando la lista de inactivos pasa de ~40 y la recepción no da abasto.

---

### Escalón 2 ⭐ — **Onia Profesional** · Bs 750/mes *(lista Bs 890)* — **el que queremos vender**

- **Suma:** recall gestionado (segmentación, seguimiento, medición de quién volvió) · **reporte
  mensual de valor recuperado** (§3.3) · usuarios sin límite con roles · hasta 4 sillones ·
  pacientes sin límite · soporte prioritario.
- **A quién:** 2-3 sillones, ≥600 fichas, ≥200 citas/mes. **Este es el perfil objetivo del kit
  de venta.**
- **Valor:** ~Bs 3.500/mes → **4,7x**. Captura el 21% del valor creado — dentro del rango sano
  de 10-25%.
- **El salto real contra el 320:** en el 320 el sistema **te dice** a quién llamar. En el 750 el
  sistema **gestiona la campaña y te muestra cuánto recuperaste**. La diferencia no es una
  feature: es que dejás de adivinar si funciona.
- **Gatillo para subir:** *"quiero que conteste sin que nadie esté"* — el volumen de consultas
  entrantes supera a la recepción.

---

### Escalón 3 — **Onia Clínica Plus** · Bs 1.500/mes *(lista Bs 1.990)* — ya publicado

- **Suma:** **chatbot de WhatsApp entrante** (responde, confirma y cancela citas contra la base,
  escala a humano por Chatwoot) · agenda multi-profesional · reportes avanzados.
- **A quién:** 3+ sillones, ≥1.000 fichas, ≥280 citas/mes, **o** mix de alto ticket (ortodoncia,
  implantes) donde el ticket promedio supera Bs 350.
- **Valor:** ~Bs 4.500+/mes → **3,0x** en ese perfil. ⚠️ **En una clínica media da 2,4x — ahí no
  se ofrece.**
- **⚠️ Estado real:** el chatbot **está construido y completo en código**, pero requiere el número
  de WhatsApp Business + verificación de Meta (bloqueo S3). **No se vende con fecha hasta que el
  número esté.** Si se vende antes, se vende con la aclaración explícita y sin cobrar el add-on
  hasta que funcione.
- **Gatillo para subir:** *"abrí otra sucursal"*.

---

### Escalón 4 — **Onia Grupo Clínico** · Bs 2.900/mes *(lista Bs 3.900)* — ya definido

- **Suma:** multi-sucursal en la nube · consolidado por sede · administración central.
- **Eje de cobro:** **por sucursal**, según ya decidió `ONIA_PRICING_MODELO_20260730.md` §5.
- **A quién:** 2-3 sedes.
- **Gatillo para subir:** *"los datos no pueden salir"* · *"necesito que se integre con mi
  sistema"* · *"si se cae, me cuesta plata por hora"*.

---

### Escalón 5 — **Onia Empresa** · **no se publica: se cotiza**

**Piso interno propuesto: desde Bs 4.500/mes + implementación desde Bs 12.000.**
`[DECISIÓN SERGIO — S1]`

Se apoya en los Modelos B y C ya definidos en `ONIA_DEPLOYMENT_OFFLINE_HA_PRICING_2026.md`
(VPS gestionado: setup Bs 3.500-7.000 + Bs 700-1.400/mes · on-premise: instalación
Bs 10.500-28.000 + licencia Bs 14.000-42.000/año + soporte Bs 8.400-25.000/año).

- **Incluye:** instalación en el servidor del cliente (o VPS dedicado a su nombre) · operación
  sin internet externo · integraciones con sistemas locales · módulos por rubro · usuarios y
  sucursales sin límite · **SLA de respuesta contractual** · backup gestionado con restore
  ensayado · ventana de actualización acordada · soporte dedicado.
- **A quién:** 3+ sucursales o 6+ sillones · o cualquier empresa cuyo directorio exija que los
  datos no salgan · o con un ERP local que integrar (el caso TR4 de Bolivian Electric).

**¿Qué justifica el salto?** Acá está la parte que hay que entender bien:

> **En los escalones 0-4 el cliente compra ingresos. En el escalón 5 compra riesgo evitado.**
>
> A una empresa de 6 sillones el recall le puede generar Bs 15.000/mes — pero eso no es lo que
> paga el salto. Lo que paga el salto es que **un día parado le cuesta más que el sistema entero**,
> que **una fuga de datos de pacientes es un problema legal**, y que **su internet se corta**.
> El on-premise es el único modelo que sigue operando sin internet externo.

`[CONFIRMAR]` **No puedo poner número al "cuánto te cuesta un día parado" ni al costo de una
fuga de datos.** No hay dato boliviano publicado y no lo voy a estimar. Es exactamente la
pregunta que se le hace al cliente en la reunión: *"¿cuánto facturás en un día? Si el sistema se
cae un día, eso es lo que perdés."* **Su respuesta es el ancla del precio, no la mía.**

**Por qué no se publica:** porque el precio depende de sucursales, integraciones y SLA, y porque
publicar un número alto al lado de Bs 190 en la misma página destruye los dos. Se cotiza después
de una reunión de relevamiento.

**Regla:** dominio, hosting, hardware, UPS, NAS y energía **son del cliente y a su nombre** —
nunca dentro de nuestro precio.

## 2.3 La escalera de un vistazo

| # | Nombre | Lanzamiento | Lista | Verbo | Perfil | Valor/mes | Múltiplo |
|---|---|---:|---:|---|---|---:|---:|
| 0 | **Onia Consultorio** 🆕 | **190** | 250 | Ordena | 1 sillón, ≤300 fichas | ~500 | ~2,6x |
| 1 | Onia Clínica | 320 | 390 | Recuerda | 1-2 sillones, ~400 fichas | ~900 | 2,8x |
| 2 | **Onia Profesional** ⭐ | **750** | 890 | **Recupera** | **2-3 sillones, ≥600 fichas** | **~3.500** | **4,7x** |
| 3 | Onia Clínica Plus | 1.500 | 1.990 | Atiende | 3+ sillones, ≥1.000 fichas | ~4.500 | 3,0x |
| 4 | Onia Grupo Clínico | 2.900 | 3.900 | Multiplica | 2-3 sedes | por sede | — |
| 5 | **Onia Empresa** 🆕 | **cotizado, desde 4.500 + 12.000 impl.** | — | Es tu infraestructura | 3+ sedes / datos adentro | riesgo evitado | — |

## 2.4 Lo que NO cambia: bajar el riesgo, no el precio

Sigue vigente `ONIA_PRICING_MODELO_20260730.md` §6, y **es más importante que toda esta tabla**.
Con cero clientes, lo que frena la compra no es la plata: es que nadie quiere ser el primero.

Setup bonificado · migración de pacientes incluida · 14 días de prueba sin tarjeta · **garantía
de devolución del primer mes** · anual 10 meses por 12 · cohorte fundador con precio congelado
12 meses **y fecha de corte explícita** (nunca "de por vida", con la devaluación de 2026) ·
cláusula de ajuste por tipo de cambio.

> *"Probalo 14 días. Si al primer mes no te sirve, te devolvemos. Y migramos tus pacientes
> nosotros."* — vende más que Bs 50 menos.

---

# PARTE 3 — Cómo se demuestra el valor ANTES de que pague

De nada sirve el cálculo si el dentista no lo ve con **sus** números.

## 3.1 La calculadora en la landing

**Concepto:** el dentista pone 4 datos y ve su resultado. No pide email para ver el número.

**Entradas** (4, no más — cada campo extra baja la conversión):
1. ¿Cuántos sillones? *(1 · 2 · 3 · 4+)*
2. ¿Cuántos pacientes tenés en tu registro? *(rangos: <300 · 300-800 · 800-1.500 · 1.500+)*
3. ¿Cuántas citas atendés por mes, más o menos? *(rangos)*
4. ¿Cuánto facturás en promedio por cita? *(Bs, con un botón "no sé" que precarga Bs 250 y lo
   dice)*

**Salidas:**
- Las 5 palancas desglosadas en bolivianos, **con la fórmula visible al hacer clic**.
- El total mensual y el múltiplo contra el plan recomendado.
- **El plan recomendado, calculado desde la tabla de calificación de §1.8.** Es
  auto-calificación: el propio cliente descubre a qué escalón pertenece, sin que se lo digamos.

**Cinco reglas de diseño, y las cinco importan:**

1. **Mostrar el escenario CONSERVADOR por defecto.** Con un botón "ver escenario optimista" al
   lado. Si el número conservador ya convence, la venta está hecha con margen de sobra. Si
   mostrás el optimista y en el mes 2 no se cumple, perdiste al cliente **y** la referencia.
2. **Los supuestos van a la vista y son editables.** "Asumimos que 1 de cada 20 pacientes
   dormidos vuelve con un mensaje" — y que lo pueda cambiar. Un dentista que baja el supuesto y
   **aun así ve un número que le sirve** ya se vendió solo.
3. **Marcar qué es estimación y qué es medición.** Un `~` al lado de cada línea estimada y una
   nota: *"esto es una estimación con supuestos declarados, no una promesa. El mes 1 lo medimos
   con tus datos reales."*
4. **Cobros y facturación SIAT no aparecen en la calculadora.** No existen todavía. Ponerlos
   infla el número y se cae en la primera semana.
5. **El email se pide DESPUÉS del resultado**, para "mandame este cálculo en PDF" — no antes.

**Impacto secundario:** cada uso de la calculadora es un dato de mercado real (sillones, fichas,
citas, ticket) de una clínica boliviana. Después de 50 usos tenemos **el dato que hoy nadie tiene
y que este documento tuvo que suponer**.

## 3.2 La demo de 15 minutos

**Regla madre: no se muestran features. Se muestra SU número.**

**Antes de la demo** — en el primer WhatsApp se piden tres datos: *"¿cuántos sillones, cuántos
pacientes tenés en registro, y cuántas citas atendés al mes?"*. Con eso se llega con el cálculo
**ya hecho para su clínica**. Es la diferencia entre una demo y una presentación.

| Min | Qué | Por qué funciona |
|---|---|---|
| **0-3** | **Que hable él.** *"¿Cuántos pacientes te faltaron sin avisar el mes pasado?"* | Si no sabe —y casi nunca sabe— **ese es el hallazgo**: no lo sabés porque nadie lo mide. La venta empieza ahí, no en la pantalla |
| **3-8** | **Su lista de dormidos.** Cargar su clínica en el demo (ideal: un export de su sistema actual) y mostrar la pantalla de pacientes inactivos con nombres | **Este es el momento que convierte.** No es una promesa: son sus pacientes, con nombre y apellido, que hace 7 meses que no vuelven. Nadie discute esa pantalla |
| **8-12** | **`/book` desde SU celular.** Que agende una cita él mismo, en ese momento | La demo más barata y la más creíble: **la ejecuta el cliente, no nosotros**. Y es 🟢 hoy |
| **12-15** | **El número y el plan.** Las 5 palancas con sus datos, el total, el múltiplo, el plan que le corresponde, y la garantía | Cierra con aritmética, no con entusiasmo |

**Lo que NO se muestra, y hay que ser disciplinado:**

- ❌ **Facturación SIAT.** Es un mock que imprime *"SIMULACIÓN — SIN VALOR FISCAL"*. Si aparece
  en pantalla, se vende solo y después no existe.
- ❌ **"Los agentes trabajan solos".** Aprobar no dispara envío. Se muestra como *"el sistema te
  arma la lista y el mensaje; hoy lo mandás vos con un clic"* — que además es verdad y suena bien.
- ❌ **El chatbot de WhatsApp con fecha**, hasta que el número esté conectado.

> Cada una de estas tres se descubre en la primera semana de uso. Mostrarlas no acelera la venta:
> acelera la cancelación.

## 3.3 El reporte de después — el que hace que renueve

**El reporte mensual es el producto de retención.** Sin él, en el mes 3 el cliente ve el cargo
y no ve el resultado.

### "Tu mes en Onia" — email + PDF, el día 1 de cada mes

```
TU MES EN ONIA — Clínica [X], julio 2026

  Pacientes que volvieron                      4       Bs 1.850
  (estaban inactivos, los contactamos, volvieron dentro de 30 días)

  Citas que no se perdieron                    9       Bs 1.575
  (recordadas y confirmadas; tu no-show fue 14% vs 21% en el mes 0)

  Reservas fuera de horario                    6       Bs 1.100
  (3 se agendaron después de las 20:00, 2 un domingo)

  ─────────────────────────────────────────────────────
  RECUPERADO ESTE MES                                  Bs 4.525
  Tu plan cuesta                                       Bs   750
  Acumulado desde que empezaste (4 meses)              Bs 14.200
```

### Las cuatro reglas que lo hacen creíble

1. **Solo se cuenta lo trazable.** Un paciente cuenta como recuperado si y solo si: (a) estaba
   marcado inactivo, (b) recibió el contacto, (c) volvió dentro de 30 días. **No se atribuyen los
   que hubieran vuelto igual.** Sub-contar es lo que hace que el número se crea.
2. **Baseline del mes 0, obligatorio en el onboarding.** Hay que medir el no-show y el tamaño de
   la base dormida **antes de encender nada**. Sin baseline no existe la palabra "recuperaste" —
   existe "tenés". **Esto es un ítem de onboarding, no opcional**, y hay que ponerlo en el
   checklist.
3. **Si un mes da mal, se muestra igual.** Un reporte que siempre da bien no lo cree nadie, y el
   primer mes flojo con el número real compra más confianza que seis meses de números lindos.
4. **Cada línea enlaza a la lista.** "4 pacientes volvieron" tiene que ser clickeable y mostrar
   los 4 nombres. Un total sin detalle es marketing; un total con detalle es contabilidad.

### Lo que hace falta en el producto para poder emitirlo

`[ÍTEM DE PRODUCTO]` **Atribución de origen en la cita.** Para separar "vino por el recall" de
"vino solo" hace falta un campo de origen (`recall` · `recordatorio` · `book` · `espontáneo`) que
se setee al crear la cita desde cada flujo. **Sin eso, el reporte no se puede emitir sin
inventar**, y el reporte es lo que sostiene la renovación. No es opcional.

### El ciclo completo, que además resuelve el agujero del §1.3

```
mes 0   →  baseline medido (no-show real, base dormida real)
mes 1-3 →  se opera y se mide
mes 3   →  Onia tiene su PRIMER DATO PROPIO de tasa de reactivación en Bolivia
mes 4+  →  ese dato reemplaza al [SUPUESTO] de este documento en la calculadora
```

**Ese es el activo que sale de todo esto.** Hoy la palanca más grande del cálculo se apoya en un
supuesto sin fuente. Con un cliente midiendo tres meses, pasa a ser **un dato propio y verificado
que ningún competidor puede citar** — igual que el cronómetro del Portal del SIN que propone
`ONIA_PRICING_MODELO_20260730.md` §4-bis.

---

# Los números que Sergio tiene que confirmar

## Los dos que bloquean el cálculo

### 1. **El ticket promedio por cita** de la clínica objetivo `[CONFIRMAR]`

**Estado:** el precio de **consulta sí lo resolví** con fuente pública — **Bs 180** en CRO
Santa Cruz, **Bs 100** en Losodontologos. Ese ya no hace falta preguntarlo.

**Lo que falta es distinto y es más importante:** cuánto factura **una silla ocupada en
promedio**, mezclando consultas, controles de ortodoncia (Bs 300-350), resinas (Bs 150) y
sesiones de tratamientos grandes (endodoncia Bs 1.200, corona Bs 1.500). Ese promedio multiplica
**3 de las 5 palancas** y hoy está en un rango de 150 a 350 — un factor de 2,3x de incertidumbre.

**Cómo se consigue, en una llamada, con dos preguntas:**
> *"¿Cuánto facturaste el mes pasado?"* ÷ *"¿Cuántas citas atendiste?"*

### 2. **La tasa de respuesta a un mensaje de reactivación** `[CONFIRMAR — MIDIÉNDOLA]`

**No existe en la literatura académica. Punto.** Solo hay blogs de vendedores de software dental
sin fuente, sin n y sin metodología. Es **la palanca más grande del modelo y la única sin ningún
respaldo**.

**No se consigue preguntando: se consigue midiendo.** Con el cliente 1, mes 1: se contacta la
base dormida, se cuenta cuántos vuelven en 30 días. Ese día Onia tiene un dato que nadie más
tiene.

**Mientras tanto, la regla de venta:** usar el supuesto conservador (3%), decir que es un
supuesto, y ofrecer medirlo juntos. *"No te voy a decir un número que no puedo probar. Te propongo
que lo midamos con tus pacientes el primer mes."* Eso vende mejor que una estadística inventada,
y no se cae nunca.

## Los tres que decide el negocio

| # | Qué | Por qué |
|---|---|---|
| **3** | **¿Se lanza el escalón de Bs 190?** | Llena el embudo con cero clientes, pero puede canibalizar el 320. Mi recomendación: **sí**, con límites duros aplicados en código (1 sillón, 300 fichas, sin recordatorios) |
| **4** | **Piso de Onia Empresa** — propuesto Bs 4.500/mes + Bs 12.000 de implementación | Es el bloqueo **S1** que `ONIA_DEPLOYMENT_OFFLINE_HA_PRICING_2026.md` dejó abierto desde el 2026-07-22 |
| **5** | **Fecha de corte del precio de lanzamiento** | Sin fecha no es lanzamiento: es el precio. Ya estaba pendiente en `ONIA_PRICING_MODELO_20260730.md` §8 |

---

## Lo que hay que hacer con este documento

1. **Cambiar el argumento del kit de venta** (`ONIA_KIT_VENTA_DENTAL_20260727.md`): de "te ahorra
   tiempo" a **"recuperás ~Bs 3.500 al mes"** — con las tres preguntas de calificación adelante,
   para no ofrecerle el plan equivocado a la clínica equivocada.
2. **Construir la calculadora** en la landing con las 5 reglas de §3.1. Es la pieza de mayor
   retorno de todo el documento: vende, califica y **produce el dato que hoy falta**.
3. **Agregar el campo de origen a las citas** — sin él no hay reporte mensual, y sin reporte
   mensual no hay renovación.
4. **Poner el baseline del mes 0 en el checklist de onboarding**, como paso obligatorio.
5. **Decidir los tres puntos de negocio** de arriba.

---

Relacionado: `ONIA_PRICING_MODELO_20260730.md` (método y eje de cobro) ·
`ONIA_PLATFORM_ESTRUCTURA_20260730.md` (qué existe de verdad) ·
`ONIA_PRECIOS_COMPETENCIA_20260730.md` (contra qué competimos) ·
`ONIA_DEPLOYMENT_OFFLINE_HA_PRICING_2026.md` (modelos B y C del escalón 5) ·
`ONIA_KIT_VENTA_DENTAL_20260727.md` (donde hay que cambiar el argumento).
