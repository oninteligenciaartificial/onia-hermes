# CARRUSEL "Fable 5.1" — listo para pegar

**Piezas:** `carousels/out/apple-fable-inter/lamina-01..08.png` (**8** láminas, 1080×1350).
Paquete: `carousels/out/1-IG-FABLE-para-publicar.zip` · hoja:
`carousels/out/HOJA-1-IG-FABLE-para-publicar.png`. Patrón `apple-editorial`, layouts
**D + E + G**. Cuenta: **`@sergiourcullo`**.

Entra por **§2 de `BASE_CONTENIDO`** — herramientas y modelos que se cuentan.

> ⏰ **Es la PRIMERA de la cola y caduca.** Es noticia de un producto ajeno y ya lleva
> cuatro días rendida: **sale hasta el domingo 14-sep o se tira.** Republicarla en un mes
> es hablar de algo viejo, y peor: construye la autoridad de Anthropic, no la de él.
> (Lección para el backlog, en `AUDITORIA-8-CARRUSELES.md`: en una cola con ocho piezas,
> la de noticia va primera o no va.)

> 🔴 **Corregido el 10-sep — el gráfico de la lámina 06 estaba MINTIENDO.** La barra de
> **22,4% rendía más alta que la de 24,7%**: la altura iba en porcentaje de la columna
> entera y un rótulo de dos líneas (`GPT-5.6 / SOL`) levantaba su barra. En la pieza que
> presume de datos verificados, el gráfico es la afirmación más fácil de desmentir — se
> compara con una regla en la pantalla. **Ya está arreglado y re-rendido** (altura en px,
> bases alineadas). Trampa #18 de la FICHA. Ningún gate lo medía: se vio MIRANDO el PNG.

## Orden de las 8 láminas

| # | Layout | Qué dice |
|---|---|---|
| 01 | D | icono de Claude · **El modelo más avanzado de Anthropic** · **FABLE 5.1** · adelanto **7 de 7 · casi 2× · hasta −45%** |
| 02 | **G** | **Le das el trabajo entero y lo termina** · 1 de cada 3 veces, antes 1 de cada 6 |
| 03 | D | **Usa la computadora** — abre programas, hace clic, completa |
| 04 | D | **Trabaja solo** — aguanta trabajos largos y sin supervisión |
| 05 | D | Antes parchaba ~~el síntoma~~, **ahora busca la causa** |
| 06 | **G** | **Y no es sólo trabajo de oficina** · 1 de cada 4 → más de la mitad |
| 07 | E | **Y encima bajó** — hasta 45% menos tenerlo trabajando todo el día |
| 08 | D | **CTA**: ¿Claude, ChatGPT o Gemini? — pide un nombre en comentarios |

## 🔴 Tercera versión: se fue toda la jerga de benchmarks

Sergio Urcullo, 07-sep: *"aún no me gusta la info que das en el de Fable… colocá info
relevante que se entienda"*. Tenía razón, y el problema era de fondo, no de redacción: la
pieza estaba escrita con **los nombres de las pruebas** —AutomationBench, CursorBench,
Terminal-Bench-Science, OSWorld— y a un dueño de negocio boliviano eso no le dice nada.
Un titular que hay que googlear no es información: es ruido con aspecto de dato.

**La regla nueva de esta pieza: en la lámina no aparece ningún nombre de benchmark.** Cada
número se dice por lo que **significa**, y el nombre de la prueba baja al pie chiquito del
layout G, que es donde va la trazabilidad sin estorbar la lectura.

| Antes | Ahora |
|---|---|
| "Flujos de trabajo de un negocio · 31,4%" | "**Le das el trabajo entero y lo termina.** Hoy lo logra 1 de cada 3 veces. Antes, 1 de cada 6" |
| "Y ahora usa una computadora · 77,9%" | "**Usa la computadora.** Abre los programas, hace clic donde va y completa la tarea" |
| "Investigación científica, hecha sola · 52,6%" | "**Y no es sólo trabajo de oficina.** Pasó de resolver 1 de cada 4 casos a más de la mitad" |
| "Ficha: Fable 5.1 · $0,25 por millón · antes $1" | "**Y encima bajó.** Tener algo suyo trabajando todo el día cuesta hasta 45% menos" |
| "Y programar, que es lo suyo · 73,4%" | *(se cayó: la carrera era pareja y no aportaba nada que las otras dos no dijeran mejor)* |

**"1 de cada 3" en vez de "31,4%"** no es un adorno: es el mismo dato dicho de forma que no
se lea como nota escolar. 31,4% suena a examen reprobado; 1 de cada 3 suena a lo que es —el
mejor de la tabla en una prueba durísima—. La cifra exacta sigue en la barra, para quien la
quiera.

**Entró una lámina que no estaba: "Trabaja solo".** Anthropic lo publica como
característica y no como puntaje (*"more comfortable with long, unattended work"*), y para
el lector de esta cuenta es **la** diferencia práctica: algo que trabaja de noche sin que
nadie lo mire. Es la diferencia entre una respuesta y un empleado.

## El color de Claude entra como acento, no como fondo

Sergio Urcullo, 07-sep: *"colocá más cosas de Claude, más visuales, más colores, que
resalte; el inicio del carrusel se ve muy triste"*. Era cierto: la portada no tenía **ni el
logo del producto del que habla ni un solo color**.

| | |
|---|---|
| **Portada** | icono de Claude a 244 px + **adelanto de tres datos** |
| **Acento** | coral **#D97757** — barras ganadoras, cifras, chips, el "5.1" del titular |
| **Lámina 02** | "el síntoma" **tachado** en coral: se ve el cambio antes de leerlo |
| **Fondo** | el gris del patrón, sin cambios |

**El coral no está elegido a ojo**: sale **sampleado del PNG oficial del icono de Claude**
ya vendorizado en `logos/` — es su color más frecuente después del fondo.

⚠️ **Esto llegó a pintar también el fondo entero de crema `#F3E9D7`, y él lo rechazó el
mismo día**: *"mejor que todos sean blancos nomás, pero está bien que uses ahí los colores
naranjas de Claude"*. La superficie es del patrón; el color de la marca invitada entra como
acento y nada más. El token `--claude-crema` sigue definido pero **hoy no lo usa nadie**:
si vuelve a hacer falta, es ése — no reactivarlo sin pedírselo.

⚠️ **El coral reemplaza al verde de Onia sólo en esta pieza.** El verde es el color de la
casa y este carrusel habla de un producto ajeno: pintar a Anthropic de verde Onia confunde
de quién es el logro. Al revés vale igual — la lámina 10 de "Mi stack" sí lleva verde,
porque ahí quien habla es él.

### 🔴 El adelanto de la portada se rehízo, y el error valía la pena anotarlo

La primera versión ponía los tres puntajes crudos —**31,4% · 52,6% · 73,4%**— apostando a
que la falta de contexto diera curiosidad. Sergio Urcullo la miró y preguntó: *"¿qué son
esos números de abajo?"*.

Ésa es la prueba que importa: **si el dueño del contenido no entiende su propia portada, un
desconocido menos**. Un porcentaje sin unidad no intriga, confunde. Y "31,4%" encima **suena
mal**: el lector lo lee como nota escolar, no como el mejor puntaje de una tabla.

Los tres de ahora se entienden solos y sin saber qué es un benchmark:

| Cifra | Etiqueta | De dónde sale |
|---|---|---|
| **7 de 7** | pruebas ganadas | gana **las 7 pruebas** de la tabla oficial: Terminal-Bench-Science, Terminal-Bench 4.0, GDPval-AA, OSWorld 2.0, Humanity's Last Exam, AutomationBench y CursorBench |
| **casi 2×** | en tareas de oficina | AutomationBench: 17,1% → 31,4% = **1,84×** |
| **−75%** | lo que cuesta operarlo | lectura de caché de $1 a $0,25 por millón |

## Layout G — el que faltaba

Sergio Urcullo, 07-sep: *"el de claude siento que está muy pobre, intentá colocarle más
cosas de valor y más visuales"*. Tenía razón y el diagnóstico era medible: la versión
anterior eran 7 láminas y **6 eran texto centrado**. Un porcentaje escrito se lee; un
porcentaje dibujado **se compara**, que es exactamente lo que esta pieza necesita hacer.

Tres decisiones del layout, para que nadie las "corrija" después:

- **La altura es proporcional al valor desde CERO** (`valor / máximo`). Recortar la base
  para que se note más la diferencia es el gráfico mentiroso más común que existe, y en una
  pieza que presume de datos verificados sería el peor lugar posible para usarlo.
- **El orden de los modelos es el mismo en las tres láminas.** Por eso Fable 5 va cuarto
  aunque en CursorBench le gane a Opus 5: si el orden cambia por puntaje, la comparación
  entre láminas deja de servir.
- **El ganador va en el coral de Claude, no en el verde de Onia.** Pintar a Anthropic con
  el color de la casa confunde de quién es el logro.

**Y AutomationBench va primera de las tres a propósito**: es la única prueba de toda la
tabla que mide flujos de trabajo de oficina, que es literalmente el negocio de Sergio
Urcullo. Es el dato más útil de la página y no estaba en la versión anterior.

## Caption (IG · copiar tal cual)

Anthropic sacó Fable 5.1 y lo llama el modelo más avanzado del mundo
para programar y trabajar con conocimiento. Dejo los benchmarks de
lado y te cuento las tres cosas que cambian en la práctica.

Uno. Le das el trabajo entero y lo termina. No un pedacito: la tarea
completa, de principio a fin, sin que se la vuelvas a explicar en el
medio. Hoy lo logra 1 de cada 3 veces. Su versión anterior, 1 de
cada 6.

Dos. Usa la computadora. Abre los programas, hace clic donde va y
completa la tarea en la pantalla, igual que lo harías vos. Ya no hay
que dictarle todo.

Tres. Aguanta el turno largo. Anthropic dice que se maneja mejor que
la versión anterior en trabajos largos y sin supervisión. Ésa es la
diferencia entre una respuesta y un empleado.

Y encima bajó de precio: tener algo suyo trabajando todo el día
cuesta hasta 45% menos que hace un mes.

Mejor y más barato al mismo tiempo. Eso no pasaba hace dos años.

¿Cuál usás vos: Claude, ChatGPT o Gemini? Escribí el nombre abajo y te
digo para qué me sirve mejor cada uno. Contesto a todos.

## Versión X / LinkedIn

Salió Claude Fable 5.1. Dejo los benchmarks de lado: esto es lo que cambia en la
práctica.

Le das el trabajo entero y lo termina — la tarea completa, sin que se la vuelvas a
explicar en el medio. Hoy lo logra 1 de cada 3 veces; su versión anterior, 1 de cada 6.

Usa la computadora: abre los programas, hace clic y completa la tarea en la
pantalla.

Y aguanta el turno largo, sin supervisión. Ésa es la diferencia entre una respuesta
y un empleado.

Encima, tenerlo trabajando todo el día cuesta hasta 45% menos que hace un mes.

## Alt text

> Carrusel de ocho láminas sobre fondo gris claro, con acentos en el coral de Claude. La
> primera muestra el icono de Claude y anuncia Fable 5.1 como el modelo más avanzado de
> Anthropic, con tres datos debajo: siete de siete pruebas ganadas, casi el doble en tareas
> de oficina y hasta cuarenta y cinco por ciento menos de costo. La segunda es un gráfico
> de barras titulado "le das el trabajo entero y lo termina". Siguen tres láminas de texto:
> usa la computadora, trabaja solo, y ahora busca la causa en vez de parchar el síntoma,
> que aparece tachado. La sexta es otro gráfico de barras sobre investigación científica.
> La séptima muestra el logo de Claude con una baja del setenta y cinco por ciento. Cierra
> preguntando qué modelo usa el lector.

## De dónde sale cada cifra

**Fuente única, tabla completa releída el 2026-09-07:** la página oficial de Anthropic,
<https://www.anthropic.com/claude-fable-and-mythos-5-1>. Ninguna cifra sale de memoria ni
de notas de prensa de terceros.

| Lámina | Prueba | Fable 5.1 | Opus 5 | GPT-5.6 Sol | Fable 5 |
|---|---|---|---|---|---|
| 02 | AutomationBench — *"le das el trabajo entero"* | **31,4%** | 26,9% | 19,6% | 17,1% |
| 03 | OSWorld 2.0 — *"usa la computadora"* (parcial) | **77,9%** | 75,4% | — | 72,9% |
| 03 | OSWorld 2.0 (estricta) | **41,7%** | 39,6% | — | 36,1% |
| 06 | Terminal-Bench-Science 0.1 | **52,6%** | 29,0% | 22,4% | 24,7% |
| 01 | Terminal-Bench 4.0 | **55,8%** | 52,3% | 37,3% | 42,0% |
| 01 | GDPval-AA v2 (trabajo de conocimiento) | **1853** | 1824 | 1711 | 1723 |
| 01 | Humanity's Last Exam (con herramientas) | **65,0%** | 63,6% | — | 63,8% |
| 01 | CursorBench 3.2.0 | **73,4%** | 70,0% | 67,2% | 70,5% |

Las cuatro últimas filas no tienen lámina propia: están para sostener el **"7 de 7"** de la
portada. Fable 5.1 queda primero en las siete pruebas de la tabla, y las columnas vacías
son filas donde Anthropic no publicó puntaje de GPT-5.6 Sol.

| Lámina | Otra afirmación | Verificado (cita textual) |
|---|---|---|
| 01 | "el modelo más avanzado de Anthropic" | *"They're the world's most advanced models for coding and knowledge work"* |
| 04 | "trabajos largos y sin supervisión" | *"Claude Fable 5.1 is more comfortable with long, unattended work than Fable 5"* |
| 05 | arregla la raíz en vez de tomar atajos | descripción de comportamiento de la misma página |
| 07 | **−75%** en lo que más se repite | *"Cache reads: $0.25 per million tokens (75% reduction)"* |
| 01 · 07 | **hasta 45%** menos si trabaja solo | *"up to approximately 45% for highly agentic work"* |

### ⚠️ Los dos matices que la pieza sí admite

- **El 77,9% de OSWorld es su medición PERMISIVA.** La estricta da 41,7%.
  La estricta da 41,7%. Publicar sólo el número lindo sería elegir la vara que conviene,
  así que **la lámina 03 ya no muestra el porcentaje**: dice lo que se sostiene con las dos
  varas —que le gana a Opus 5 y a su versión anterior en ambas—. Las dos filas están arriba.
- **La lámina de CursorBench se cayó**, y por eso: la carrera ahí es pareja (67,2 a 73,4),
  las barras salían casi iguales y no aportaba nada que las otras dos no dijeran mejor. Su
  fila sigue en la tabla de arriba porque sostiene el "7 de 7" de la portada.

## Lo que NO dice, y por qué

- **Nada de proteínas ni de kernels de GPU.** Son logros de **Mythos 5.1**, no de Fable. La
  versión del 06-sep se los atribuía a Fable y estuvo a un render de publicarse; la página
  se los atribuye a Mythos explícitamente. Si alguna vez se cuentan, con el nombre correcto.
- **Ni una palabra de Mythos 5.1.** Es el mismo modelo con otros resguardos y sólo se
  entrega a organizaciones verificadas de EE.UU. para ciberseguridad y ciencias de la vida.
  Nombrarlo abre una pregunta que Sergio Urcullo no puede responder ni ofrecer.
- **No dice que sea el modelo que él usa.** Sergio Urcullo, 07-sep: *"no pongas que es el
  modelo que yo uso, enfocate en sus mejoras y cosas que hace"*. La portada anterior hacía
  que la noticia dependiera de que al lector le importe quién la cuenta, y en la lámina 1
  todavía no le importa.
- **Ninguna promesa de que Onia sea más barata por esto.** Los precios de Onia los fija
  `subscription-plans.ts` / `pricing.ts`, no un modelo.
- **Ningún "comentá PALABRA".** La cuenta tiene `palabras: {}` en el workflow n8n activo de
  private-reply: una palabra clave hoy no entrega nada y no deja registro. El CTA igual
  obliga a comentar —pregunta cerrada, respuesta de un nombre— pero contesta a mano.

## ⚠️ Caducidad

Esta pieza tiene fecha de vencimiento: es noticia, y **los benchmarks envejecen más rápido
que los precios** — ahora hay cinco láminas colgadas de una tabla comparativa, así que
envejece más rápido que la versión anterior. Si pasa más de un mes sin publicarla, revisar
la página de Anthropic antes: manda ella, no este documento.
