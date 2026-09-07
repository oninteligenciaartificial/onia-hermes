# CARRUSEL "Fable 5.1" — listo para pegar

**Piezas:** `carousels/out/apple-fable-inter/lamina-01..09.png` (9 láminas, 1080×1350).
Hoja: `carousels/out/HOJA-apple-fable.png`. Patrón `apple-editorial`, layouts **D + E + G**.

Entra por **§2 de `BASE_CONTENIDO`** — herramientas y modelos que se cuentan.

## Orden de las 9 láminas

| # | Layout | Qué dice |
|---|---|---|
| 01 | D | icono de Claude · **El modelo más avanzado de Anthropic** · **FABLE 5.1** · adelanto 31,4 / 52,6 / 73,4 |
| 02 | D | Antes parchaba el síntoma, **ahora busca la causa** |
| 03 | **G** | **Flujos de trabajo de un negocio** · barras · 31,4% vs 26,9 / 19,6 / 17,1 |
| 04 | **G** | **Investigación científica, hecha sola** · barras · 52,6% vs 29,0 / 22,4 / 24,7 |
| 05 | **G** | **Y programar, que es lo suyo** · barras · 73,4% vs 70,0 / 67,2 / 70,5 |
| 06 | D | Y ahora **usa una computadora** · 77,9% |
| 07 | E | Ficha: **Fable 5.1** · caché **$0,25** por millón (antes $1) |
| 08 | D | Y encima **−75%** en caché |
| 09 | D | **CTA**: ¿Claude, ChatGPT o Gemini? — pide un nombre en comentarios |

## La pieza va vestida de Claude, no de gris

Sergio Urcullo, 07-sep: *"colocá más cosas de Claude, más visuales, más colores, que
resalte; el inicio del carrusel se ve muy triste"*. Era cierto y era doble problema: la
portada no tenía **ni el logo del producto del que habla ni un solo color**, y el carrusel
entero en gris no se distinguía de las otras cinco piezas del patrón en la grilla del
perfil.

| | |
|---|---|
| **Fondo** | crema **#F3E9D7** en las 9 láminas |
| **Acento** | coral **#D97757** — barras ganadoras, cifras, chips, el "5.1" del título |
| **Portada** | icono de Claude a 244 px + **adelanto de las tres cifras** |
| **Lámina 02** | "el síntoma" **tachado** en coral: se ve el cambio antes de leerlo |

**Los dos colores no son inventados ni elegidos a ojo**: salen **sampleados del PNG oficial
del icono de Claude** que ya estaba vendorizado en `logos/` — son literalmente sus dos
colores más frecuentes. Vestir la pieza con los colores de la marca de la que habla es lo
mismo que hace Apple con cada producto que presenta.

⚠️ **El coral reemplaza al verde de Onia sólo en esta pieza.** El verde es el color de la
casa y este carrusel habla de un producto ajeno: pintar a Anthropic de verde Onia confunde
de quién es el logro. La regla vale también al revés — la lámina 10 de "Mi stack" sí lleva
verde, porque ahí quien habla es él.

**El adelanto de la portada** (31,4% · 52,6% · 73,4%) es el mismo truco que la tira de
iconos de "Mi stack": la portada deja de **enunciar** y pasa a **prometer**. El ojo ve tres
números que todavía no entiende y desliza para saber de qué son — y son exactamente las
láminas 03, 04 y 05. De paso llena el tercio inferior, que con sólo título y chip quedaba
muerto y era la otra mitad de lo que la hacía ver triste.

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
para programar y trabajar con conocimiento. Miré la tabla entera y
estas son las tres cosas que de verdad cambiaron.

Uno. Dejó de parchar. Antes te arreglaba el síntoma con algo que
funcionaba hoy y explotaba el martes; ahora va a la raíz en vez de
tomar el atajo.

Dos. En flujos de trabajo de un negocio —tareas de oficina completas,
de punta a punta— saca 31,4%. Su versión anterior sacaba 17,1%. Casi
el doble, en una sola actualización, y arriba de Opus 5 y de GPT-5.6
Sol. De toda la tabla, ésa es la prueba que más se parece a lo que
hace un negocio de verdad.

Tres. Y en investigación científica hecha sola, 52,6% contra el 29%
del segundo. Ahí no está compitiendo: está en otra categoría.

Ah, y cuesta menos. Leer el caché bajó de $1 a $0,25 por millón: es
justo lo que más se repite cuando algo trabaja solo. Hasta 45% menos
si el agente corre todo el día.

Mejor y más barato el mismo mes. Eso no pasaba hace dos años.

¿Cuál usás vos: Claude, ChatGPT o Gemini? Escribí el nombre abajo y te
digo para qué me sirve mejor cada uno. Contesto a todos.

## Versión X / LinkedIn

Salió Claude Fable 5.1. Anthropic lo llama el modelo más avanzado del mundo para
programar y trabajar con conocimiento. Tres cosas de la tabla:

En AutomationBench —flujos de trabajo de oficina, de punta a punta— saca 31,4%
contra 17,1% de su versión anterior. Casi el doble, y arriba de Opus 5 (26,9%) y
de GPT-5.6 Sol (19,6%). Es la prueba que más se parece a lo que hace un negocio.

En investigación científica autónoma, 52,6% contra 29,0% del segundo. Ahí no
compite: está en otra categoría.

Y leer el caché bajó de $1 a $0,25 por millón — hasta 45% menos de costo cuando
algo trabaja solo todo el día.

Mejor y más barato el mismo mes.

## Alt text

> Carrusel de nueve láminas sobre el fondo crema de la marca Claude, con acentos en coral.
> La primera muestra el icono de Claude y anuncia Fable 5.1 como el modelo más avanzado de
> Anthropic, con un adelanto de tres cifras: 31,4 por ciento, 52,6 y 73,4. La segunda dice
> que ahora busca la causa en vez de parchar el síntoma, que aparece tachado. Las tres siguientes son gráficos de barras que comparan cuatro
> modelos en flujos de trabajo de negocio, investigación científica y programación, con
> Fable 5.1 en barra coral y primero en las tres. La sexta dice que ahora usa una
> computadora, con un 77,9 por ciento. La séptima muestra el logo de Claude con el precio
> de 0,25 dólares por millón de tokens de caché, y la octava un menos 75 por ciento.
> Cierra preguntando qué modelo usa el lector.

## De dónde sale cada cifra

**Fuente única, tabla completa releída el 2026-09-07:** la página oficial de Anthropic,
<https://www.anthropic.com/claude-fable-and-mythos-5-1>. Ninguna cifra sale de memoria ni
de notas de prensa de terceros.

| Lámina | Prueba | Fable 5.1 | Opus 5 | GPT-5.6 Sol | Fable 5 |
|---|---|---|---|---|---|
| 03 | AutomationBench (flujos de negocio) | **31,4%** | 26,9% | 19,6% | 17,1% |
| 04 | Terminal-Bench-Science 0.1 | **52,6%** | 29,0% | 22,4% | 24,7% |
| 05 | CursorBench 3.2.0 | **73,4%** | 70,0% | 67,2% | 70,5% |
| 06 | OSWorld 2.0 (uso de computadora, parcial) | **77,9%** | 75,4% | — | 72,9% |
| 06 | OSWorld 2.0 (estricta) | **41,7%** | 39,6% | — | 36,1% |

| Lámina | Otra afirmación | Verificado (cita textual) |
|---|---|---|
| 01 | "el modelo más avanzado de Anthropic" | *"They're the world's most advanced models for coding and knowledge work"* |
| 02 | arregla la raíz en vez de tomar atajos | descripción de comportamiento de la misma página |
| 07 · 08 | caché **$0,25** por millón, antes **$1**, **−75%** | *"Cache reads: $0.25 per million tokens (75% reduction)"* |
| 08 | **hasta 45%** menos en trabajo agéntico | *"up to approximately 45% for highly agentic work"* |

### ⚠️ Los dos matices que la pieza sí admite

- **El 77,9% de la lámina 06 es la medición PERMISIVA de OSWorld.** La estricta da 41,7%.
  Publicar sólo el número lindo sería elegir la vara que conviene, así que la lámina no
  afirma el porcentaje a secas: dice lo que se sostiene **con las dos varas** —que le gana
  a Opus 5 y a su versión anterior en ambas—. Las dos filas están en la tabla de arriba.
- **En CursorBench la carrera es pareja** (67,2 a 73,4) y las barras salen casi iguales.
  La lámina lo dice en voz alta: *"acá la carrera es pareja, y aun así queda arriba"*. Una
  pieza que presume de datos pierde más por disimular un empate que por admitirlo — y
  admitirlo es lo que hace creíbles a las otras dos.

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
