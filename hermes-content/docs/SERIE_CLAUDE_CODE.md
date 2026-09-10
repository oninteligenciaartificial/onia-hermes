# Serie «Claude Code de cero»

Fuente de verdad de la serie de YouTube. **Sin fecha en el nombre a propósito**: si algo
cambia, se edita este archivo, no se crea otro.

Los decks viven en `hermes-content/carousels/out/yt-*/`, uno por video, cada uno con su
`README.md` y su `deck.html` autocontenido.

---

## La regla que ordena todo

**Cada video entrega UNA capacidad nueva y verificable.** Si al terminar el espectador no
puede hacer algo que antes no podía, el video no existe: es relleno.

Y el orden no es por dificultad técnica, es por **confianza**. Nadie suelta una
herramienta que no sabe verificar. Por eso el nivel 2 no es "más difícil": es el que
permite que el nivel 3 no sea una temeridad.

---

## El arco

| # | Video | Nivel | Al terminar, el espectador… | Estado |
|---|---|---|---|---|
| 01 | Qué es Claude y Claude Code | **0 · Entender** | sabe cuál de los dos necesita | ✅ deck listo |
| 02 | Instalarlo y tu primera skill | **1 · Usarlo** | lo tiene andando y escribió una skill | ✅ deck listo |
| 03 | Que trabaje sin vos | **1 · Usarlo** | sabe qué es un hook, un subagente y un conector | ✅ deck listo |
| 04 | Cómo saber que no te mintió | **2 · Confiar** | verifica el resultado en vez de creerle | ⬜ |
| 05 | Reglas que se cumplen | **2 · Confiar** | escribe un CLAUDE.md que no se desobedece | ⬜ |
| 06 | Los errores del primer mes | **2 · Confiar** | reconoce los cinco que hacen abandonar | ⬜ |
| 07 | Hooks y subagentes de verdad | **3 · Escalar** | escribe su primer hook y su primer subagente | ⬜ |
| 08 | Conectalo a tu negocio | **3 · Escalar** | le enchufa una herramienta que ya usa | ⬜ |
| 09 | En paralelo sin romper nada | **3 · Escalar** | corre varias tareas sin pisarse | ⬜ |
| 10 | Lo que cuesta y cómo se baja | **3 · Escalar** | mide su gasto y le pone techo | ⬜ |
| 11 | Mi empresa entera corre con esto | **Cierre** | ve el sistema completo funcionando | ⬜ |

**Duración:** 5–7 min los del nivel 0 y 1. 7–9 min los tutoriales del 2 y 3. El 11 puede
ir a 12 y está bien: es el caso, no una lección.

---

## Qué entrega cada uno, y qué NO

### 04 · Cómo saber que no te mintió
> **Promesa:** que diga "listo" no prueba nada. Acá aprendés a comprobarlo.

Es **el video más importante de la serie** y el que ningún canal hace, porque no vende.
Sale de la regla propia: *verificar es MIRAR, no suponer*. El caso real: una pantalla de
producción mostraba los nombres de los iconos como texto, "verificada" varias veces con
un 200 y un grep, sin abrirla nunca. La encontró Sergio Urcullo mirándola.

- **Prerequisito:** 02.
- **Repara:** el hueco que deja el 03 — ahí ya se enseñó a soltarlo, y soltar algo que no
  sabés verificar es el error caro.
- **NO va:** herramientas de testing. Es un video sobre el hábito, no sobre frameworks.

### 05 · Reglas que se cumplen
> **Promesa:** escribir un CLAUDE.md que de verdad se respeta.

La lección propia: **una regla sin su historia se desobedece; con el caso real que la
originó, no.** Y la trampa que la acompaña: una sola fuente de verdad por tema. El caso:
cuatro precios vivos del mismo producto conviviendo en el mismo repo.

- **Prerequisito:** 02 (ya tiene un CLAUDE.md creado con `/init`).
- **NO va:** skills. Ya fueron en el 02; acá es solo el archivo de reglas.

### 06 · Los errores del primer mes
> **Promesa:** los cinco que hacen abandonar, y cómo se sienten desde adentro.

Material propio y medido: en una sola sesión el sistema anotó **doce** errores, once los
encontró él mismo revisando. El patrón que los atraviesa: *verificaciones que no
verificaban, y lecciones escritas que nadie cargó*.

- **Prerequisito:** 02.
- **NO va:** consejos genéricos de productividad.

### 07 · Hooks y subagentes de verdad
> **Promesa:** escribir el primero de cada uno, con el archivo delante.

Es la parte técnica que el 03 dejó afuera a propósito. Incluye el caso del hook de cierre
que publicó 200 líneas antes de que existiera el código que las usaba.

- **Prerequisito:** 03 y 04.
- **NO va:** MCP. Tiene su video.

### 08 · Conectalo a tu negocio
> **Promesa:** enchufarle una herramienta que ya usás y pedirle algo real.

Caso propio: el chatbot que atiende clientes por WhatsApp, y las automatizaciones.

- **Prerequisito:** 03.
- **NO va:** construir un servidor MCP desde cero. Eso es otro nivel y otra audiencia.

### 09 · En paralelo sin romper nada
> **Promesa:** correr varias tareas a la vez sin que se pisen.

Reglas propias: un carril por carpeta, y `main` siempre compila. El caso: **28 commits
entraron mientras una sesión medía**, y tocaron justo los tres archivos que estaba
midiendo. La medición quedó inválida y nadie se enteró hasta el push.

- **Prerequisito:** 07.
- **NO va:** enseñar git desde cero.

### 10 · Lo que cuesta y cómo se baja
> **Promesa:** medir el gasto propio y ponerle techo.

La lección: **ante un techo, se baja el consumo, no se sube el tope.** Cuando el gasto se
disparó, el 74 % era un solo trabajo mal configurado.

- **Prerequisito:** 03.
- **NO va:** comparar precios de planes. Envejece en semanas.

### 11 · Mi empresa entera corre con esto
> **Promesa:** ver el sistema completo, sin cortes de edición que tapen los huecos.

Cruza con la serie del homelab: la PC de escritorio, los cuatro trabajos por horario, el
chatbot, la web. Es el video que justifica los diez anteriores.

- **Prerequisito:** toda la serie.
- **NO va:** vender Onia. Es contenido, no una demo comercial.

---

## Concordancia — lo que comparten los once

Un espectador tiene que reconocer un video de la serie sin leer el título.

| Elemento | Forma fija |
|---|---|
| Eyebrow de portada | `Claude Code de cero · 0N` |
| Firma | `@sergiourcullo`, abajo a la izquierda, en todas las láminas |
| Penúltima lámina | **«La parte honesta»** — siempre, sin excepción |
| Última lámina | eyebrow **«En una línea»**, y el remate anuncia el próximo video |
| Sección de prueba | **«Mi caso»**, con cifras medidas ese día |
| Comparativas | eyebrow **«Lado a lado»**, columnas del mismo peso salvo que un lado sea genuinamente menor |
| Patrón visual | `apple-editorial` — Inter + Instrument Serif, acento terracota, sin collage |
| Pedido de comentario | va **hablado** al cierre, no escrito en la lámina |

### «La parte honesta» no es un adorno de formato

Es lo que separa esto de un canal que vende humo, y **son fallas propias con su
consecuencia**, nunca advertencias genéricas. Va penúltima a propósito: después de la
prueba y antes del cierre, donde ya se ganó la credibilidad y todavía se puede usar.

Si un video no tiene una falla propia que contar, **el video está mintiendo o no se hizo
el trabajo**.

---

## Reglas de producción

- **Los números se recuentan antes de grabar, nunca se heredan.** Ya pasó: la versión de
  Claude Code cambió de `2.1.221` a `2.1.267` en tres días. Cada `README.md` de deck lleva
  la tabla de con qué comando se verificó cada dato.
- **Se graba acapela**, mirando el deck. Por eso cada lámina lleva su chuleta en
  `data-nota` y las cifras van escritas en pantalla: improvisando, un número es lo primero
  que se dice mal.
- **Nada de slang.** La audiencia son dueños de negocio y en YouTube el lenguaje fuerte
  cuesta alcance.
- **Ningún precio que envejezca.** Solo el que él paga hoy, y dicho como propio.
- **No se dibuja una interfaz que no se miró.** Si hay que mostrar una pantalla, se graba
  la real. Un mockup aproximado en una pieza pública lee como falsificación.
- **Un video que necesita dos horas está mal recortado.** Lo que sobra se anota en el «NO
  va» del siguiente, no se mete a presión.
