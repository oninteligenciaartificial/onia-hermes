# ONIA — Plan de 155 días (1-ago → 31-dic-2026): crítica y rediseño

> 2026-07-27. Sergio pidió un consejo directivo (CEO, CTO, PM, arquitecto, creador de
> contenido, inversionista, cliente) sobre su plan de documentar públicamente la
> construcción de ONIA. Este doc critica el plan actual y lo rediseña.
>
> Contexto duro que usa este análisis: **0 clientes pagando** · runway **≈11 semanas
> (a ~mediados de octubre)** · pricing ratificado Bs 390/890/1.990 (lanzamiento
> 320/750/1.500) · USD/BOB **11,37** post-flotación · **SIAT obligatorio 30-sep-2026**
> con la homologación bloqueada por el NIT · Onia Dental ~90% construido · competencia
> boliviana viva (CUCU Bs 252-1.200, Rimay desde Bs 290) · Sergio tiene **16 años** y la
> empresa está a nombre de su madre.
>
> Fuentes: [[ONIA_ARQUITECTURA_MARCA_Y_RUTA_GLOBAL_20260727]] ·
> `PRICING_RATIONALE_INTERNO.md` · `ONIA_DEFINICIONES_NAMING_RUBROS_WOW_20260726.md`.

---

## 1. Crítica del plan

### 1.1 El error aritmético que invalida dos objetivos a la vez

**"$5.000 MRR" y "30 clientes" no pueden ser verdad juntos.**

$5.000 USD × 11,37 = **Bs 56.850/mes**. Dividido entre 30 clientes = **Bs 1.895 por cliente
por mes**. El plan más caro del catálogo es **Bs 1.990**. O sea: para que ese par de números
cierre, **casi todos los clientes tendrían que estar en el plan tope**, sin uno solo en los
planes de entrada.

Con un mix realista a precios de lanzamiento (60% plan 1, 30% plan 2, 10% plan 3):

```
0,60 × 320  =  192
0,30 × 750  =  225
0,10 × 1.500 = 150
                ---
ARPU        =  Bs 567/cliente/mes
× 30 clientes = Bs 17.010/mes = USD 1.496
```

**Para $5.000 MRR harían falta ~100 clientes, no 30.** Uno de los dos números está mal, y
apostaría a que el equivocado es el de $5.000 — porque 100 clientes en 5 meses con un
fundador solo es imposible de soportar, no solo de vender.

### 1.2 El plan requiere tres personas full-time y hay una, de 16 años, en el colegio

Sumemos las horas honestamente:

| Frente | Carga real |
|---|---|
| Vender 30 clientes | Si cierra 1 de cada 5 demos → **150 demos** en 5 meses = **1,5 demos por día hábil**, más prospección, propuestas y seguimiento |
| Soportar los que ya entraron | Cada cliente nuevo suma soporte. Al cliente 20 esto solo ya es medio día |
| TikTok diario sin fallar | Guion + grabación + edición + publicación = **1-2 h/día** aunque se batchee |
| YouTube semanal | 4-6 h/semana |
| Aprender Python y desarrollar el SaaS | 10-15 h/semana para que sirva de algo |
| Homologación SIAT, contabilidad, Meta, infra | el trabajo invisible que igual hay que hacer |

Eso son **tres personas**. El plan no falla por ambición; falla porque **no tiene un modelo
de capacidad**. Y el primer frente que se cae cuando hay sobrecarga siempre es el que no
tiene deadline externo: la venta.

### 1.3 "Clientes en 3 países" destruye valor en vez de crearlo

Contradice lo que verificamos el 27-jul con fuentes:

- **Bolivia es el mercado MENOS saturado de la región**: Alegra ❌, Bsale ❌, Siigo ❌.
- **Bolivia sostiene precios 2 a 10 veces más altos**: ~$25-105/mes acá vs **$8-14 en Ecuador**
  (donde Quipuy cobra $6 al AÑO).
- Cada país es **otro régimen fiscal**: el emisor SIAT no se transfiere. Paraguay es SIFEN,
  Perú SUNAT, Ecuador SRI. Es reconstruir el módulo que más cuesta, tres veces.
- Cada país es **otro régimen de marca**: Bolivia no está en el Protocolo de Madrid.

Expandirse ahora es **mudarse a un mercado más barato, más lleno y más caro de construir**.
Este objetivo no es ambicioso: es autolesivo.

### 1.4 "Aprender Python y desarrollar partes reales del SaaS" es la trampa más cara

Tres problemas, en orden de gravedad:

1. **Es el lenguaje equivocado.** El SaaS está en **TypeScript/Next.js**. Aprender fundamentos
   de Python para escribir partes reales de *este* producto significa o bien no usarlo, o bien
   introducir un segundo stack que después hay que mantener.
2. **Compite contra el cuello de botella real.** Los docs propios lo dicen: **el cuello es la
   DEMANDA, no el código.** Onia Dental está ~90% construido. Cada hora de fundamentos de
   programación es una hora que no se usa para conseguir el cliente #1.
3. **El framing es el problema, no el aprendizaje.** Aprender a programar a los 16 es de las
   mejores inversiones que existe. Pero "aprender fundamentos" y "desarrollar el SaaS que
   sostiene el runway" son dos actividades distintas, y mezclarlas hace las dos mal.

### 1.5 "Alquilar la primera oficina" es un objetivo de vanidad con riesgo legal

- Es **costo fijo mensual con cero impacto en ingresos** para un fundador solo que vende
  puerta a puerta en Santa Cruz.
- Es un **contrato de alquiler** que tendría que firmar Leslie, no Sergio (16 años). Estás
  comprometiendo legalmente a otra persona por un símbolo.
- Una oficina vacía en video comunica lo contrario de lo que buscás: no dice "empresa seria",
  dice "gastó el dinero en la foto".

**Un segundo par de manos vale más que un cuarto.** Ese sí es el hito.

### 1.6 Las metas de seguidores van a desviar el contenido hacia la audiencia equivocada

Este es el punto más importante de toda la crítica.

**La audiencia que construye una serie de "construyendo mi startup" NO es la audiencia que
te compra.** Quien sigue build-in-public en TikTok en español son: otros builders,
estudiantes, gente que quiere emprender, curiosos de IA. Tu comprador es **el dueño de una
clínica dental o de una ferretería en Santa Cruz, de 40 a 55 años**, que está en WhatsApp y
en Facebook, y que no sabe qué es un MRR.

Poner "5.000 seguidores en TikTok" como objetivo hace que optimices para el primero. Y en tres
meses vas a tener una audiencia que te aplaude y no te compra — el fracaso más frustrante que
existe, porque parece éxito.

**Eso no significa no hacer la serie.** Significa ser explícito en que la serie sirve a
**otros objetivos** (talento, credibilidad, alianzas, inversores, la expansión regional del
2027, y con el tiempo un activo de distribución propio) y que **las ventas salen de otro
motor**. Confundirlos es lo que mata estas series a los 60 días.

### 1.7 "Documentar absolutamente todo" tiene riesgos concretos, no teóricos

- **Fiscal:** mostrar ingresos públicamente en Bolivia, con la empresa recién matriculada y
  la facturación en línea entrando en vigencia, es invitar escrutinio en el peor momento.
- **Personal:** un chico de 16 mostrando dinero en cámara en Santa Cruz. No hace falta
  explicarlo más.
- **Comercial:** mostrar precios negociados, márgenes y objeciones de clientes le entrega el
  playbook a CUCU y Rimay gratis.
- **De cliente:** ningún dentista quiere que su facturación aparezca en TikTok. **Necesitás
  consentimiento escrito antes de grabar en un consultorio**, no después.

### 1.8 Métricas mal elegidas

- **MRR como estrella polar con 0 clientes es un error de fase.** El MRR es un indicador
  *rezagado*: no lo podés mover directamente. Con 0 clientes, lo que se mide es
  **conversaciones con dueños de negocio**.
- **Falta churn.** Un SaaS con 30 clientes y 20% de churn mensual está muerto y el MRR tarda
  tres meses en avisarte.
- **Falta caja.** Con 11 semanas de runway, la métrica más importante del plan es
  **semanas de runway restantes**, y no aparece por ningún lado.

### 1.9 Lo que falta y nadie puso

- **La homologación SIAT** — es la ruta crítica real, está bloqueada por el NIT, y **caduca
  el 30-sep-2026**. Si no está, no hay producto vendible.
- **Un segundo humano.** Sergio es un punto único de falla: si se enferma una semana, se
  detienen ventas, soporte, desarrollo y contenido a la vez.
- **Retención.** No hay un solo objetivo sobre que los clientes se queden.
- **Qué pasa si no funciona.** No hay criterio de corte. Un plan sin condición de fracaso no
  es un plan, es un deseo.

### 1.10 El choque de fechas que nadie vio, y que es el mejor material de la serie

**La ventana del SIAT (30-sep) y el fin del runway (~mediados de octubre) caen casi el mismo
día.** El momento de mayor tensión dramática de la serie coincide exactamente con el momento
de mayor riesgo real de la empresa. Eso es oro narrativo — **pero solo si está planificado**.
Si te agarra por sorpresa, es el capítulo donde se acaba la serie.

---

## 2. Qué cambiaría

| # | Cambio | Por qué |
|---|---|---|
| 1 | **Un solo país: Bolivia.** Segundo país solo tras cumplir el gate | Es el mercado más caro y menos disputado; irse es bajar de precio |
| 2 | **Un solo vertical: dental.** Ferreterías queda gateado | Onia Dental está ~90% listo; abrir dos verticales duplica soporte y no duplica ventas |
| 3 | **MRR pasa de objetivo a resultado.** El objetivo es *clientes que renuevan* | Con 0 clientes, MRR es rezagado; lo que se controla son las conversaciones |
| 4 | **Objetivos en tres escenarios** (base / bueno / excelente), no un número único | Un número único te hace mentir o rendirte. Tres te hacen aprender |
| 5 | **De TikTok diario a 4-5/semana con un día libre por diseño** | Un día libre planificado deja de ser un fracaso; el "sin fallar" garantiza culpa |
| 6 | **Aprender programando sobre el stack real, no fundamentos de Python** | Aprendés más shippeando una feature de Next que haciendo ejercicios |
| 7 | **La oficina se reemplaza por la primera contratación** | Un par de manos multiplica; un cuarto vacío no |
| 8 | **Consentimiento escrito antes de grabar a cualquier cliente** | Sin esto, el primer episodio con un cliente real puede costarte el cliente |

---

## 3. Objetivos que eliminaría

| Eliminado | Motivo |
|---|---|
| ❌ **$5.000 MRR** | Aritméticamente incompatible con 30 clientes. Reemplazado por escenarios |
| ❌ **Clientes en 3 países** | Destruye valor: mercados más baratos, más llenos, otro régimen fiscal cada uno |
| ❌ **Alquilar oficina** | Costo fijo sin impacto en ingresos + compromiso legal de un tercero |
| ❌ **5.000 seguidores TikTok** | Métrica de vanidad que desvía el contenido hacia quien no compra |
| ❌ **1.000 suscriptores YouTube** | Igual. El objetivo de YouTube es profundidad, no volumen |
| ❌ **"Aprender fundamentos de Python"** *(como objetivo del semestre)* | Lenguaje equivocado para este stack y compite contra la venta. Vuelve, acotado, en §4 |
| ⚠️ **"TikTok todos los días sin fallar"** | Se conserva la disciplina, se elimina el "sin fallar" |

---

## 4. Objetivos que añadiría

| # | Objetivo | Por qué es el que faltaba |
|---|---|---|
| **1** | **Homologación SIAT completada antes del 15-sep** | Es la ruta crítica. Sin esto no hay producto vendible y la ventana caduca el 30-sep |
| **2** | **Desbloquear el NIT en las próximas 2 semanas** | Bloquea el objetivo 1, que bloquea todo lo demás |
| **3** | **Churn mensual < 5% con al menos 8 clientes** | Un SaaS que no retiene no es un SaaS, es una consultora con recibos mensuales |
| **4** | **Llegar a caja neutra personal** (ingreso mensual ≥ gasto mensual) | Convierte "runway" en "tiempo infinito". Es el hito que de verdad cambia la vida de la empresa |
| **5** | **Contratar o asociar a la primera persona antes del 30-nov** | Elimina el punto único de falla. Reemplaza a la oficina como hito de "ya somos empresa" |
| **6** | **10 entrevistas grabadas con dueños de clínica que NO te compraron** | La mina de oro del producto y el mejor contenido de YouTube que vas a tener |
| **7** | **Escribir código de producción todas las semanas, en el stack real** | Aprender programando lo que se vende, no ejercicios. Track de Python acotado a 3 h/semana para datos y automatizaciones |
| **8** | **Criterio de corte escrito antes del 1-ago** | "Si al 31-oct no tengo N clientes pagando, hago X." Decidilo con la cabeza fría |

### Los objetivos, en tres escenarios

| | Base (esto es éxito) | Bueno | Excelente |
|---|---|---|---|
| Clientes pagando al 31-dic | **8** | 15 | 25 |
| MRR | ~Bs 4.500 (~$400) | ~Bs 8.500 (~$750) | ~Bs 14.000 (~$1.230) |
| Churn mensual | <10% | <5% | <3% |
| Homologación SIAT | ✅ | ✅ | ✅ |
| Segunda persona | — | ✅ | ✅ |
| Países | 1 | 1 | 1 (+ 1 validado en papel) |

> **8 clientes que renuevan valen más que 30 que se van.** Con 8 clientes pagando y churn
> bajo tenés un negocio real y una máquina que se puede repetir. Con 30 y churn del 20%
> tenés un trabajo agotador que se apaga solo.

---

## 5. Métricas diarias

Todas son **acciones que controlás**, no resultados que esperás. Cinco, no más — si no se
llenan en 2 minutos, no se llenan.

| # | Métrica | Meta diaria |
|---|---|---|
| 1 | **Conversaciones nuevas con dueños de negocio** (WhatsApp, llamada o visita) | **5** |
| 2 | **Demos agendadas** | 1 |
| 3 | **Minutos de material grabado** | 10 |
| 4 | **Bloques de 90 min en código de producción** | 1 |
| 5 | **Tickets de soporte abiertos** *(cuando haya clientes)* | 0 al cerrar el día |

**Prohibido en el tablero diario:** vistas, likes, seguidores, MRR. No los podés mover hoy y
mirarlos todos los días arruina el criterio.

---

## 6. Métricas semanales

| # | Métrica | Por qué |
|---|---|---|
| 1 | **Semanas de runway restantes** | La métrica más importante del semestre. Va primero |
| 2 | **Clientes pagando** (alta y baja, por separado) | El neto esconde el churn |
| 3 | **Churn** | Un cliente que se va vale -3 que entran |
| 4 | **MRR** | Semanal, no diario. Es rezagado |
| 5 | **Tasa de conversión demo → cliente** | Te dice si el problema es el pitch o el volumen |
| 6 | **Horas de soporte por cliente** | El predictor #1 de si esto escala o te ahoga |
| 7 | **CAC en horas** (horas invertidas por cliente cerrado) | Tu costo real no es dinero, es tiempo |
| 8 | **Leads que llegaron por contenido** | La ÚNICA métrica que conecta la serie con el negocio |
| 9 | Retención a 30 s en TikTok · retención media en YouTube | Calidad, no volumen |

---

## 7. Qué mostraría en TikTok

TikTok es el **anzuelo**: tensión, cifras, decisiones y errores. Formato vertical, 20-60 s.

| Tipo | Ejemplo concreto tuyo |
|---|---|
| **La cifra incómoda** | "Me quedan 11 semanas de plata y 0 clientes. Esto es lo que voy a hacer" |
| **El error caro** | "Puse el nombre de mi empresa en Facebook y me bloqueó 60 días" |
| **Producto en 30 s** | El odontograma que arma el presupuesto solo mientras el dentista hace clic |
| **Decisión en vivo** | "Verifiqué 15 nombres para mi startup. Los 15 estaban tomados. Miren" |
| **El país de fondo** | "Bolivia obliga a facturar electrónico desde el 30 de septiembre. Nadie está listo" |
| **La objeción real** | "Un dentista me dijo que no. Esto fue lo que dijo" |
| **Detrás del código** | Pantalla, un bug, el fix, el resultado. Sin explicar la sintaxis |
| **La edad** | Usala sin pedir permiso ni pedir lástima: mostrá el trabajo, la edad se nota sola |

---

## 8. Qué mostraría en YouTube

YouTube es la **profundidad**: 8-15 min, capítulo de documental, no vlog.

- **El mes completo** — qué se prometió, qué pasó, los números reales, qué se aprendió.
- **Anatomía de una venta** — de la primera conversación al contrato firmado, con el "no"
  incluido.
- **Cómo está construido** — arquitectura real, decisiones técnicas, por qué ONIA Core y no
  un fork por cliente.
- **La entrevista con el que NO compró** — el formato más valioso y el que nadie hace.
- **El país como personaje** — el SIAT, la devaluación del 63%, vender software en un mercado
  donde el dólar se movió de 6,96 a 11,37.
- **El episodio técnico** — reconstruir en vivo algo que se rompió en producción.

---

## 9. Qué NO mostraría

Regla dura. Escribila y no la negocies a mitad de camino.

| Nunca | Por qué |
|---|---|
| **Datos de clientes** — nombres de pacientes, facturación, historia clínica | Legal, y te cuesta el cliente |
| **Grabar en un local sin consentimiento escrito** | Firmá antes de encender la cámara |
| **Ingresos exactos en tiempo real** | Riesgo fiscal y personal. Mostrá tendencias y porcentajes |
| **Tu domicilio, el de tu familia, tu rutina, tu colegio** | Sos menor de edad y público |
| **Los datos legales de tu madre** | Es la titular; no es personaje público |
| **Credenciales, claves, `.env`, paneles con tokens** | Un frame de 1/30 s alcanza para que te vacíen la cuenta |
| **Precios negociados y márgenes reales** | Se los regalás a CUCU y a Rimay |
| **Peleas con clientes o proveedores** | Contala como aprendizaje, sin nombre |
| **Prometer funciones que no existen** | Lo peor que podés hacer: es un contrato público que después no cumplís |

---

## 10. Estructura de los TikToks

**20-45 segundos. Un video, una idea.**

```
0-2 s   GANCHO — la frase más incómoda o el número más raro.
        Sin saludar. Sin "hola, soy Sergio". Sin intro.
        "Me quedan 11 semanas de plata."

2-6 s   CONTEXTO — una sola oración. Qué se está jugando.

6-25 s  DESARROLLO — mostrar, no contar.
        Pantalla, producto, calle, cliente, código.
        Subtítulos SIEMPRE (se ve sin audio).

25-38 s GIRO — el dato que no esperaban, o el error.
        Esto es lo que hace que compartan.

38-45 s CIERRE ABIERTO — la próxima tensión, no un CTA.
        "Mañana voy a la primera clínica. Veremos."
```

**Reglas:** nada de "sígueme"; el cierre abierto retiene más que cualquier CTA. Un formato
recurrente ancla la serie: **"Día 47 de 155"** en pantalla desde el primer video — convierte
videos sueltos en una serie que da ansiedad no seguir.

---

## 11. Estructura de los videos de YouTube

**8-15 minutos. Estructura de documental, tres actos.**

```
0:00-0:40  COLD OPEN
           El momento más tenso del episodio, fuera de orden cronológico.
           Después el título. Nunca arrancar por el saludo.

0:40-1:30  LO QUE ESTÁ EN JUEGO
           Qué se prometió, qué pasa si no sale. Cifras reales.

1:30-4:00  ACTO I — el plan
4:00-8:00  ACTO II — lo que salió mal (este es el acto largo, siempre)
8:00-11:00 ACTO III — la decisión y el resultado

11:00-13:00 LOS NÚMEROS
           En pantalla, sin adornos. Clientes, churn, runway.
           Los buenos y los malos. Especialmente los malos.

13:00-14:00 QUÉ SIGUE
           Un compromiso verificable para el próximo episodio.
           Eso es lo que los trae de vuelta.
```

**No hagas:** intro con música de 30 s, "no olvides suscribirte", ni recapitulación del
episodio anterior. Confiá en que el que llegó, llegó.

---

## 12. Cómo lograr que la sigan 155 días

Siete mecanismos, en orden de potencia:

1. **El contador visible.** "Día 47 de 155" en todos los formatos. Una serie con final
   anunciado se sigue; un feed infinito se abandona.
2. **Compromisos verificables.** Cerrá cada episodio con algo comprobable: *"para el 15 de
   agosto tengo que tener 3 clínicas en demo"*. Después mostrá si se cumplió o no. **La
   credibilidad se construye mostrando los incumplimientos, no los logros.**
3. **Un reloj real.** No es un reloj inventado: el SIAT vence el **30-sep** y el runway se
   acaba a mediados de octubre. **Poné el contador en pantalla desde el día 1.**
4. **Un antagonista honesto.** No una persona: el mercado. CUCU y Rimay ya están. El portal
   del SIN es gratis. El dólar pasó de 6,96 a 11,37. Nombrar al enemigo real da estructura.
5. **Arcos, no episodios sueltos.** "El arco del primer cliente" (5 videos), "El arco de la
   homologación" (4), "El arco de la contratación" (3). Un arco abierto obliga a volver.
6. **Mostrar la derrota rápido y sin adorno.** La serie se cae el día que empieza a parecer
   un caso de éxito. Publicá el "no" del cliente el mismo día que pasó.
7. **Los números en cada episodio, sin excepción.** Aunque sean malos. Sobre todo si son
   malos. Es lo que separa un documental de una campaña de marketing.

---

## 13. Cómo hacer que la serie traiga clientes y no solo seguidores

**Primero, la verdad incómoda:** los primeros 8 clientes **NO van a venir de TikTok**. Van a
venir de que golpeaste la puerta de clínicas en Santa Cruz. La serie no es tu canal de ventas
en 2026 — es tu canal de ventas en 2027.

Dicho eso, hay cinco formas de que aporte desde ya:

1. **Contenido de comprador, separado del contenido de builder.**
   Dos motores distintos, no dos audiencias mezcladas.
   - *Builder* (TikTok/YouTube/X): la serie. Sirve a talento, alianzas, credibilidad.
   - *Comprador* (Facebook, Instagram, WhatsApp, Google): **"Cómo facturar al SIAT sin
     tipear"**, "3 errores que te hacen perder pacientes que ya te conocen". Cero build-in-public.
     Este es el que vende en Bolivia hoy.
2. **La prueba social sale de la serie hacia la venta.** Cada episodio genera clips que van a
   la propuesta comercial, al WhatsApp del prospecto y a la web. *"Mirá cómo lo construimos"*
   convierte a un desconocido de 16 años en alguien verificable.
3. **Una llamada a la acción sola, y la misma siempre:** `onia.com.bo/demo`. Un link. Medido.
4. **Los episodios de cliente son ventas.** Filmar el proceso de una clínica es, para esa
   clínica, publicidad gratis. Ofrecelo como parte del trato: **descuento a cambio de
   aparecer**. Ganás caso de estudio, contenido y cierre en una sola operación.
5. **La métrica que importa:** *leads que llegaron por contenido*, no seguidores. Si al 31-oct
   son cero, la serie es marca — está bien, pero dejá de llamarla marketing.

---

## 14. Cómo posicionar a ONIA como empresa de software y no como agencia

Cinco decisiones, y son todas de fondo, no de estética:

1. **Mostrá arquitectura, no entregables.** Una agencia muestra el sitio que entregó. Una
   empresa de software muestra el sistema: ONIA Core, los módulos, el contrato de entidades,
   los tests. **Tu foso real es que ningún cliente es un fork.** Eso es un video entero.
2. **Hablá de producto, no de proyectos.** "Sacamos la versión 1.4" en vez de "terminamos el
   proyecto de tal cliente". Roadmap público. Changelog público.
3. **Precio de producto, no de proyecto.** Precio mensual, planes, mismo precio para todos.
   Cotizar cada cliente distinto es la marca de agencia.
4. **Mostrá los tests y lo que se rompe.** Nada dice "empresa de software" como un episodio
   sobre un bug en producción, cómo se detectó y cómo se evitó que vuelva. Ninguna agencia
   hace eso.
5. **Sacá "agencia" de todas las superficies.** Ya se hizo en Facebook e Instagram; falta
   revisarlo en propuestas y catálogo. La razón social `OniaAgency` se queda **solo** en
   facturas y contratos.

---

## 15. Hitos que merecen episodio especial

| Hito | Por qué es especial | Cuándo, estimado |
|---|---|---|
| 🎬 **Episodio 0 — el punto de partida** | Cifras reales sobre la mesa: 0 clientes, 11 semanas, 16 años | 1-ago |
| 🔓 **El NIT se desbloquea** | Destraba la homologación y por lo tanto todo | ago |
| 💰 **Primer cliente pagando** | El único hito que cambia la naturaleza de la empresa | ago-sep |
| 📋 **Homologación SIAT aprobada** | De "software" a "software autorizado". Es el foso | sep |
| ⏰ **30 de septiembre — el día del SIAT** | La fecha límite del país. Filmalo como si fuera un final | 30-sep |
| 😰 **El día que casi se acaba la plata** | El episodio más honesto y probablemente el más visto | oct |
| 🔁 **Primer cliente que renueva** | Vale más que el primero que compra. Nadie lo festeja: festejalo | oct-nov |
| 🤝 **La primera contratación** | Reemplaza a la oficina como "ya somos empresa" | nov |
| 🦷 **El cliente #10 del mismo rubro** | Prueba que el modelo se repite. Es el hito que habilita el vertical #2 | nov-dic |
| 🌎 **Primer cliente fuera de Bolivia** | Si llega solo, es episodio. Si hay que salir a buscarlo, no es todavía | dic (si pasa) |
| 📊 **Episodio 155 — el cierre** | Todos los números, cumplidos e incumplidos | 31-dic |

---

## 16. Reutilización: grabar una vez, publicar en cinco lados

**Regla: nunca se graba para una plataforma. Se graba materia prima.**

### El sistema semanal

| Día | Qué |
|---|---|
| **Lunes-viernes** | **10 min de material crudo por día.** Celular, sin producción. Lo que pasó: la visita, el bug, la llamada, la decisión. Esto NO es grabar contenido, es llevar un diario en video |
| **Sábado (2 h)** | **Sesión de cámara.** Una sola grabación de 20-30 min hablando a cámara del arco de la semana. De acá salen todos los pedazos |
| **Domingo (3 h)** | **Corte.** 1 YouTube + 5 TikToks + los textos |

### La cascada, de largo a corto

```
YouTube (8-15 min)  ← la pieza madre, se edita primero
   ↓
TikTok / Reels / Shorts (5)  ← los 5 mejores momentos, verticales, con subtítulos
   ↓
LinkedIn  ← el aprendizaje del episodio en texto, 4-6 párrafos + 1 clip
   ↓
X (hilo)  ← los números de la semana + 1 clip. Formato tabla
   ↓
Instagram ← 1 carrusel con los números (ya tenés el generador) + los Reels
```

**Nada se escribe dos veces.** El guion del episodio de YouTube ES el post de LinkedIn ES el
hilo de X. Cambia el formato, no el contenido.

**Lo que ya tenés y hay que usar en vez de reinventar:**
- `editor-videos` — corta silencios y muletillas, subtítulos karaoke, censura de caras
- `scripts/carousel_render.js` — carruseles de Instagram con la marca
- HyperFrames — tarjetas de datos y overlays por código
- n8n — programación de publicaciones

**Tiempo total: ~7 h/semana.** Eso sí es sostenible con una persona. 15 h/semana no.

---

## 17. Roadmap 1-ago → 31-dic

### AGOSTO — Destrabar y vender a mano
**Prioridad: el NIT y el cliente #1. Todo lo demás es secundario.**

| | |
|---|---|
| **Empresa** | Desbloquear NIT · iniciar homologación SIAT · **50 conversaciones con clínicas** · 15 demos · **cliente #1 pagando** · escribir el criterio de corte |
| **Producto** | Nada nuevo. Solo lo que pide el cliente #1 para poder pagar. Onboarding en <2 h |
| **Contenido** | Episodio 0 · arranca el contador · 4 TikToks/semana · 2 YouTube |
| **Aprendizaje** | 1 feature real por semana en el stack (TypeScript/Next) |
| **NO se hace** | Segundo vertical · segundo país · oficina · rediseños |

### SEPTIEMBRE — El mes del SIAT
**Prioridad: homologación aprobada antes del 30. Es la ventana del país entero.**

| | |
|---|---|
| **Empresa** | **Homologación SIAT terminada** · 3-5 clínicas pagando · primer cobro recurrente cobrado de verdad |
| **Producto** | Emisión fiscal real punta a punta · el odontograma que arma presupuesto (la función WOW) |
| **Contenido** | Arco de la homologación (4 videos) · **episodio especial del 30-sep** |
| **Aprendizaje** | Automatizaciones propias — acá sí entra el track de Python, 3 h/semana |
| **Riesgo** | Si el NIT no salió, esto se cae. **Plan B decidido el 15-ago, no el 25-sep** |

### OCTUBRE — Sobrevivir y retener
**Prioridad: caja neutra personal y churn bajo. El mes más duro.**

| | |
|---|---|
| **Empresa** | 6-10 clientes · **churn <10%** · caja neutra personal · decidir seguir o corregir según el criterio escrito en agosto |
| **Producto** | Cero funciones nuevas. **Solo estabilidad y reducir horas de soporte por cliente** |
| **Contenido** | Episodio "el día que casi se acaba la plata" · primer cliente que renueva |
| **Aprendizaje** | Leer y arreglar código propio en producción |

### NOVIEMBRE — Hacer que se repita
**Prioridad: probar que el modelo repite sin vos en cada venta.**

| | |
|---|---|
| **Empresa** | 10-18 clientes · **primera contratación o socio comercial** · playbook de venta escrito para que lo use otro |
| **Producto** | Autoservicio en el alta · el segundo módulo encendido en un cliente existente |
| **Contenido** | Arco de la contratación · anatomía de una venta completa |
| **Aprendizaje** | Code review de lo que escribe el otro. Es donde más se aprende |

### DICIEMBRE — Consolidar y preparar 2027
**Prioridad: cerrar el año con un negocio que funciona sin heroísmo.**

| | |
|---|---|
| **Empresa** | 15-25 clientes · **cliente #10 del mismo rubro** (habilita el vertical #2) · Paraguay validado **en papel**, sin vender todavía |
| **Producto** | Onia Comercio listo para el primer piloto de ferretería en enero |
| **Contenido** | Episodio 155 con todos los números · plan público 2027 |
| **Decisión** | Con el gate cumplido: **vertical #2 (comercio) o país #2 (Paraguay)**. Uno, no los dos |

### Los tres gates que no se negocian

1. **No se abre el vertical #2** hasta 3-5 clínicas pagando y una con un segundo módulo encendido.
2. **No se abre el país #2** hasta que el vertical #1 tenga margen y el soporte sea sobrevivible.
3. **No se contrata** hasta que haya ingreso recurrente que cubra al menos la mitad del costo.

---

## 18. Lo único que importa de todo este documento

Si tuvieras que tirar el resto:

> **El objetivo de los próximos 155 días es conseguir 8 clientes que renueven en Santa Cruz,
> con la homologación SIAT aprobada. Nada más.**
>
> La serie documenta ese intento con honestidad, incluidos los fracasos.
> No lo reemplaza, no lo apura y no lo decora.
>
> Si al 31 de diciembre tenés 8 clientes que renuevan y 200 seguidores, ganaste.
> Si tenés 5.000 seguidores y 0 clientes, perdiste cinco meses de runway.
