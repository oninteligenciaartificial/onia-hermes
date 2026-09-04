# Los 7 patrones de motion del lote del 23-ago — deduplicados

> **Por qué existe este archivo.** Las 18 fichas del lote propusieron **~25 entradas nuevas** para
> [`web-factory/docs/MOTION_PATTERN_BANK_2026.md`](../../../web-factory/docs/MOTION_PATTERN_BANK_2026.md).
> Ninguna ficha leyó a las otras. Escritas tal cual, el banco quedaba con **el mismo patrón bajo
> cinco títulos distintos** — exactamente lo que prohíbe la regla "una sola fuente de verdad por
> tema" del `CLAUDE.md`.
>
> Acá están reducidas a **7 patrones reales**. Este archivo **no es el banco**: es la propuesta
> deduplicada que el carril reparte. **Quien escribe en el banco es la sesión web-factory**, y
> debe leer esto antes de agregar una sola línea.

---

## P1 · Texto ancla — el texto NO se anima

**El mecanismo.** El rótulo entra por corte duro en un fotograma y **no se mueve más**: cero fade,
cero escala, cero rebote, cero typewriter, cero easing perceptible. Lo que cambia es todo lo demás
— el plano, el fondo, el filtro, la lámina. El texto es el punto quieto.

**Lo encontraron 10 de 14 videos, por separado:** `DZurBtZiT9X` (overlay fijo los 35 s),
`Dax5wGigc30` (karaoke acumulativo, entrada por corte de opacidad), `Daz0cVMBuD8` (subtítulo
estático sobre corte metronómico), `Db9jbZtumB7`, `DbvxMwghtkA`, `DcEJDHBTyPY`, `DcPwVniOEKB`,
`DcYiAvqsjij` (karaoke a corte duro, 1 frame), `Dbyx3bwE6Mp` (headline quemado 13,536 s),
`DcWOss3RxMq` (bloques de 2–4 palabras).

**Variantes que sí vale distinguir:**
- *acumulativa* — la línea crece y no se reemplaza hasta llenar dos líneas (`Dax5wGigc30`)
- *sustitutiva* — el bloque se reemplaza entero en el corte (`Daz0cVMBuD8`, `DcWOss3RxMq`)
- *lista que se llena* — el número ya está en pantalla, aparece el texto al lado (`DcEJDHBTyPY`)

> ⚠️ **Esto choca de frente con nuestra
> [`motion-doctrine`](../../../.agents/skills/motion-doctrine/SKILL.md), que prohíbe
> el corte sin arrastre y exige continuidad de vector.** No es una excepción al margen: son **9 de
> 14 videos** contradiciendo la doctrina. La lectura honesta es que la doctrina está escrita para
> **motion graphics autoral** y se está aplicando a **montaje UGC**, que es otro oficio. La
> doctrina tiene que declarar qué régimen gobierna cuál. **Esa decisión no es de este carril.**

---

## P2 · Toma única con motor interno — cero cortes, y aun así hay ritmo

**El mecanismo.** Una sola toma continua, sin un corte. El ritmo no lo da el montaje: lo da algo
que pasa **dentro del plano**. Es el patrón más repetido del lote y el más fácil de copiar mal
(se copia "sin cortes" y se olvida el motor, y queda un plano muerto).

**El motor, según la pieza:**

| Motor | Pieza | Medido |
|---|---|---|
| Contador ascendente 0 → 444 | `Dbyx3bwE6Mp` | 13,536 s, **0 cortes** (re-medido con `-hide_banner`, umbral 0,3 y 0,15) |
| Aceleración de escala (dolly-out + zoom interno a la vez) | `DbtH7_nNRF0` | ~8 s |
| Filtro que cambia sobre la misma toma | `DbvxMwghtkA` | ~18 s, 13 estados |
| Lista que se llena, ~1 ítem/s | `DcEJDHBTyPY` | ~29,4 s |
| Cronómetro diegético (el reloj vive en la escena, no es overlay) | `Dax5wGigc30` | 58,307 s |
| Pantalla filmada en diagonal (el ritmo está **prestado** del contenido de la pantalla) | `DZurBtZiT9X` | 35,365 s |

---

## P3 · Corte metronómico ≈1 s

**El mecanismo.** Cortes secos a cadencia casi fija, sin una sola cortinilla ni whip.

- `Daz0cVMBuD8` — **1,02 s de media**, rango 0,70–1,53 s, 11 planos en 11,24 s (medido por
  detección de escena, no estimado)
- `DcYiAvqsjij` — 1,5–2,5 s sostenido, ningún plano pasa de ~4 s
- `DcWOss3RxMq` — ~2 s, sin excepción

---

## P4 · Elemento fijado + scrub amortiguado (web, no video)

**El mecanismo.** Un objeto queda clavado en viewport mientras el scroll mueve todo lo demás; el
avance de la animación va **amortiguado**, no atado 1:1 al scroll.

- `DbBUMU2qjfW` — canvas fijado, el dispositivo no se mueve y entran/salen bloques de texto y color
  de fondo. **Con escalera de degradación** para cuando el dispositivo no aguanta.
- `DaVV7JjIY9I` — tres mecanismos hermanos: split sticky (columna izquierda congelada), hero
  pinneado con media escalando, revelado de titular con duplicado desenfocado.

> ⚠️ **Lo que NO está probado:** `DbBUMU2qjfW` nombra **Lenis**, **WebGL** y `ScrollTrigger.pin` con
> scrub numérico. Eso es **reconstrucción, no lectura**: no hay DOM, ni bundle, ni caption que lo
> diga. Se porta el **mecanismo**; los nombres de librería son una hipótesis a verificar.

---

## P5 · Tarjeta de puntuación a pantalla completa

**El mecanismo.** Una tarjeta de una sola línea, a pantalla completa, que cae **en el remate de un
beat — nunca entre dos ideas**. No es una transición: es un signo de puntuación.

- `DcWOss3RxMq` — tarjetas hueso (`NOT REAL`, `THE AD IN MINUTES`, `SIGN UP NOW FOR FREE`)
- `DcPwVniOEKB` — el remate se resuelve invirtiendo cálido/frío en el corte, sin transición

> **Medido, y con una corrección de método que vale más que el dato:** el corte de `DcPwVniOEKB`
> **existe y está en `pts_time` 3,800 s exactos** (score 0,485, igual a umbral 0,3 · 0,15 · 0,08).
> La primera medición de esta sesión dijo "cero cortes" y era **falsa por un error de método**:
> se corrió `ffmpeg -v error … showinfo`, y `-v error` **silencia la salida de `showinfo`**, con lo
> que *cualquier* video devuelve cero. Lo detectó el agente de la ficha al re-medirlo en vez de
> aceptar la cifra heredada.
>
> **La regla que deja:** `-v error` sirve para que ffmpeg no ensucie la salida, pero mata los
> filtros que reportan por log. Para contar cortes va `-hide_banner`, nunca `-v error`. Y una
> cifra "ya medida" que te pasan sigue siendo un dato heredado: se re-mide.
>
> Lo que sí quedó corregido de la ficha vieja: la duración de **video** es 6,600 s (198 fotogramas
> a 30 fps); los 6,731 s son la pista de **audio**. Y el "push-in ~3% en ~2 s" no existe: PSNR de
> 31,8 dB entre el fotograma 2 y el 110 en la banda de techo — cámara clavada.

---

## P6 · Repetición estricta de plantilla como ritmo — **NO va al banco de motion**

**El mecanismo.** En carrusel no hay curva de easing que copiar: el ritmo es el **orden** y la
**repetición**. Cuando la plantilla se repite sin variar, para la tercera lámina el ojo ya no lee
la estructura y va directo al dato que cambia.

- `DcWPKNoIEUE` — 1 gancho + **7 fichas de estructura idéntica** + 1 quiebre de firma
- `DcBWzXQF1_q` — **5 láminas seguidas** con titular y fondo idénticos: da la ilusión de que la
  tarjeta se queda quieta y solo rota el contenido
- `DcJbUL6CCp3` — gancho → **4 láminas mudas de puro material** → CTA
- `Db1b33RAh_H` — 4 láminas, una idea por lámina, cero relleno

**Va a `hermes-content/references/ui-patterns/`, no al banco de motion.** La ficha de `Db1b33RAh_H`
fue la única que lo dijo bien y tiene razón: no hay motion que registrar.

---

## P7 · Cambio de gramática como puntuación

**El mecanismo.** Un bloque entero cambia de tratamiento óptico para marcar un giro narrativo. No
es un efecto por plano: es un **régimen** que dura un bloque y después vuelve.

- `DcYNrdROAyg` — un bloque completo en ojo de pez dentro de un falso documental de 2:44
- `DcYiAvqsjij` — trama CRT sobre el inserto letterboxed, con la regla madre **"presentador limpio
  / mundo tramado"**

---

## Lo que este archivo NO hace

- **No escribe en el banco.** Eso es de la sesión web-factory.
- **No resuelve el conflicto con `motion-doctrine`** (ver P1). Es una decisión de dueño de skill.
- **No confirma los nombres de librería de P4.** Están marcados como hipótesis.
