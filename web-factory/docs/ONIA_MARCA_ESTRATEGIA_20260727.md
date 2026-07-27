# Onia — Estrategia de marca desde el cuadrado

> 2026-07-27. Ejecutable por 1 persona, presupuesto ≈ 0.
> Complementa `ONIA_MARCA_SISTEMA_20260726.md` (sistema visual). Este doc responde
> **qué significa el gesto y cómo se convierte en venta**. Decisión de color pendiente
> de Sergio (ver §8).

---

## 1. La idea central

> ### **El cuadrado marca todo lo que se hizo sin que vos lo hicieras.**

Un cuadrado de color pegado a una letra ya significa algo antes de explicar nada:
*encendido, activo, en línea*. No hay que enseñarlo: **96,5% de las personas usan al
menos una app con indicadores de estado** ([CHI 2020](https://dl.acm.org/doi/fullHtml/10.1145/3313831.3376240)).
Onia no inventa un símbolo — se apropia de uno que el dentista ya sabe leer.

**Cómo se dice en una demo por WhatsApp (12 segundos):**

> "¿Ves ese cuadradito? Cada vez que aparece, es algo que se hizo solo: un recordatorio
> que salió, un paciente que confirmó, una factura que se emitió. Vos no tocaste nada.
> Eso es lo que te vendo — no el sistema, los cuadraditos."

**La consecuencia dura:** el color es una **promesa auditable**. Si aparece donde el
trabajo lo hizo una persona, la marca miente y el gesto se muere. Es criterio de
gobierno, no de gusto — aplica al producto, a los posts y a las propuestas por igual.

## 2. El cuadrado como sistema

### 2.1 Un significado, tres estados

| Forma | Significa | Dónde |
|---|---|---|
| **Lleno** | Ya se hizo, solo | Timeline, posts, reportes, resumen diario |
| **Hueco** (contorno 1,5px) | Listo, espera tu OK | Cola de aprobación, estados vacíos |
| **Pulsando** (100→40% opacidad, 1,2s) | Está corriendo ahora | Cargas, agente trabajando |

Regla no negociable: **el trabajo humano no lleva cuadrado.** La ausencia es tan
informativa como la presencia — es lo que hace visible el valor.

### 2.2 El cuadrado es la unidad de medida

**`1u` = el lado del cuadrado = el ancho del asta de la tipografía al mismo tamaño.**

- Separación cuadrado ↔ lo que marca: **1u exacto**.
- Grilla de toda pieza: márgenes **4u**, bloques **2u**, bullets = cuadrado hueco a 1u.
- Mínimo absoluto: **8px de lado en pantalla, 1,5mm impreso**.

Resultado: cualquier pieza se maqueta sin decidir nada. Una persona sola no necesita
criterio de layout, necesita una unidad.

### 2.3 Matemática de contraste (verde #00D26A)

| Combinación | Ratio | Veredicto |
|---|---|---|
| Verde sobre negro cálido #12100E | **8,1:1** | AAA |
| Verde sobre blanco | 1,9:1 | **Falla** el umbral 3:1 |
| Texto blanco sobre verde | 2,0:1 | **Prohibido** |
| Texto negro cálido sobre verde | 8,1:1 | Correcto |

**Consecuencia:** el lienzo por defecto de Onia (capturas, videos, portadas) es
**negro cálido**, no blanco. En claro el verde solo funciona como marca pequeña junto
a una palabra. **El botón "Aprobar" es verde con texto negro cálido**, nunca blanco.

### 2.4 El tile 1:1 — DECIDIDO: fondo verde, logo negro

> **Corrección 2026-07-27, ratificada por Sergio.** Esta sección decía antes lo
> contrario ("tile negro, nunca verde"). Ese texto hizo que se regeneraran los
> iconos en tinta, contra la marca que Sergio ya tenía publicada. Se revirtió.
> **Vale lo de abajo. No re-litigar.**

**Regla:** el tile 1:1 (avatar, favicon, perfil, app icon) es **fondo verde
`#00D26A` con el logo en negro cálido `#12100E`**.

Archivos: `onia-icon.svg` (cuadrado), `onia-icon-rounded.svg` (favicon, apple-touch),
`onia-icon-circle.svg` (avatares de redes). Los genera `scripts/export-icons.mjs`.

**Ya está en uso público:** es el avatar de Instagram desde el 2026-07-27. Cambiarlo
ahora rompería el reconocimiento que ya empezó a acumularse — que es justamente lo
único que un logo tiene que hacer.

**La objeción que existía, y por qué no gana:** `#00D26A` (matiz ~150°) y el verde de
WhatsApp `#25D366` (~142°) están a 8°, así que a 40px el tile puede leerse como
"un chat más". Es un riesgo real pero acotado: lo resuelve el contraste del logo negro
adentro, no cambiar el fondo. Si algún día se mide que el avatar no se distingue en la
lista de WhatsApp, la salida es **oscurecer o saturar el verde del tile**, no invertirlo.

### 2.5 Regla del 2%

**El color nunca ocupa más del 2% del área de una pieza.** Se verifica mirando.
Perplexity lo formuló así: *"los colores tenían que ser casi completamente invisibles"*.
Un acento que aparece en todas partes deja de ser acento.

### 2.6 Superficie por superficie

| Superficie | Dónde | Significa | Regla |
|---|---|---|---|
| Logo | Tittle de la i | El origen | Nunca se toca ni se recolorea |
| Avatar/favicon | **Tile verde, logo negro** (§2.4) | Presencia | Único lugar donde va solo |
| Post/carrusel | Inicio de cada línea de resultado | "Se hizo solo" | Máx. 5 por pieza |
| Video vertical | **Una sola vez**, en el resultado | El clímax | Nunca en la intro |
| Propuesta/PDF | Bullets de "qué hace Onia" | Automático vs manual | Lo manual va con guion |
| Producto | Ver §4 | Estado real | Solo si es verdad |
| WhatsApp texto | 🟩 al inicio de línea | "Hecho" | Ver abajo |

**WhatsApp, el caso especial.** El emoji 🟩 *es* un cuadrado de color: el único canal
donde el gesto viaja gratis dentro del mensaje. Con disciplina de sistema:
máximo uno por línea, siempre al inicio, **ningún otro emoji en el mensaje**, lo
pendiente con `▫️` o sin nada.

```
Clínica Sonrisa — martes 27

🟩 6 recordatorios enviados · 4 confirmaron
🟩 2 facturas emitidas
🟩 1 paciente reactivado (no venía desde marzo)

▫️ 3 mensajes esperan tu OK → [link]
```

## 3. Cinco formatos repetibles

Todos del mismo sistema: **lienzo negro cálido, la tipografía del logo, un cuadrado
donde está la verdad**. Se reconocen sin ver el logo.

| # | Formato | Qué es | Por qué vende | Costo |
|---|---|---|---|---|
| 1 | **"El registro de las 7:14"** | Captura del panel a hora real sobre negro. Una línea, un cuadrado. Serie diaria | El gremio no cree promesas, cree horarios. Muestra el producto trabajando con la clínica cerrada | 8-10 min · Bs 0 |
| 2 | **"Antes/después del cuadrito"** | Izq: tareas manuales con cuadrados huecos + tiempo. Der: la misma lista llena + total ahorrado | Convierte "IA" en "3 h 20 min por semana". El dentista compra tiempo de sillón | 10 min · Bs 0 |
| 3 | **"Un minuto, un cuadrito"** | Vertical ≤60s, grabación de pantalla, sin cara ni música stock. El cuadrado aparece **una vez**, al final | Es el activo reenviable: en Bolivia deciden dos personas, y la segunda recibe un video por WhatsApp | 20-30 min · Bs 0 |
| 4 | **"La factura que salió sola"** | Micro-serie de facturación. Encuadre honesto explícito: *"El portal del SIN es gratis. Lo que no es gratis es el tiempo de tipear factura por factura"* | El plazo corre hasta el 30-sep-2026 → ansiedad real en la ventana de runway. Ser el único que dice "existe la opción gratis" ES el posicionamiento | 15 min · Bs 0 |
| 5 | **"Pregunta de dentista"** | Tarjeta de objeción real + respuesta en 2 líneas + cuadrado **hueco**: *"Nada sale sin tu OK"* | El miedo #1 a los agentes es perder control ante el paciente. Convierte el human-in-the-loop en argumento de venta | 8 min · Bs 0 |

**Medición:** todo en **demos agendadas**, no likes. Mismo CTA de WhatsApp con parámetro
distinto por formato; a las 3 semanas se matan los que no traen reuniones.

**Regla dura:** hasta tener el primer cliente, toda captura se rotula "demo". Un dato
falso mata el sistema entero.

## 4. El gesto dentro del producto

Si el logo dice "hay algo encendido" y el software no lo muestra, el logo es publicidad.

| Lugar | Qué hace | Regla |
|---|---|---|
| Timeline "Hoy" | Cuadrado lleno por cada acción de agente | Lo que hizo una persona **no lleva cuadrado** |
| Cola de aprobación | Cuadrado hueco por pendiente | Al aprobar **se llena** (200ms). Ese micro-momento es la marca entera |
| Estado de carga | El cuadrado pulsa | **Onia no usa spinners. Nunca.** |
| Botón "Aprobar" | Fondo de color, texto negro cálido | Un solo botón primario por pantalla |
| Barra superior | Cuadrado + "3 agentes activos" | Es el "on" de la marca |
| Estados vacíos | Cuadrado hueco + "Todavía no hay nada encendido acá" | El vacío como promesa, no como fracaso |
| Login / carga | El tittle del logo pulsa | El logo *es* el indicador de estado |

**Dónde NO va:** íconos de navegación, encabezados de tabla, badges de conteo,
gráficos, bordes de tarjeta.

## 5. Claim — tres, uno por superficie

**A · Marca (hero de la web)**
> **Tu clínica sigue trabajando aunque vos cierres.**

Beneficio, no tecnología. Nombra un momento concreto y una tensión real. No envejece
al pasar a ferreterías: *"Tu negocio sigue trabajando aunque vos cierres."*

**B · Sistema (bajo el logo, en piezas y en la app)**
> **Cuando aparece el cuadrito, ya está hecho.**

Enseña a leer la marca. Hace que logo y UI cuenten la misma historia.

**C · Venta directa (WhatsApp, propuesta, bio)**
> **Menos tipear. Más pacientes que vuelven.**

Las dos únicas cosas que le duelen a un dentista. Sin metáfora, sin marca.

**Prohibido en todo claim:** "obligatorio por ley", "exigido por Impuestos", "el SIN te
va a multar". El SIN tiene portal gratuito. La honestidad acá es la diferencia entre ser
el proveedor de confianza o uno más de los que asustan para vender.

## 4-bis. Color del wordmark — qué versión va en cada fondo

**Los tres colores del sistema:**

| Color | Hex | Para qué |
|---|---|---|
| **Tinta** | `#12100E` | El wordmark. Negro cálido, nunca `#000000` |
| **Claro** | `#F4F6F4` | El wordmark en negativo |
| **Verde señal** | `#00D26A` | **Solo el punto.** Nunca el wordmark |

**La regla:** el wordmark es de **UN solo color**. Lo único que cambia es el punto.

| Fondo | Wordmark | Punto | Archivo |
|---|---|---|---|
| Blanco / crema / gris claro | tinta `#12100E` | verde | `onia-logo.svg` |
| Oscuro (tinta, negro) | claro `#F4F6F4` | verde | `onia-logo-dark.svg` |
| **Verde** `#00D26A` | tinta | **tinta** — el verde ya es el fondo | `onia-logo-mono.svg` |
| Foto o color medio | claro | verde | `onia-logo-dark.svg` (sobre zona oscura de la foto) |
| Una sola tinta (sello, bordado, grabado, serigrafía) | tinta | tinta | `onia-logo-mono.svg` |

**Prohibido:**
1. **El wordmark en verde.** Contraste 1,9:1 sobre blanco — ilegible, y es la marca visual del SaaS barato de LatAm.
2. **El punto en otro color.** El verde es el activo distintivo; cambiarlo lo anula.
3. **Punto verde sobre fondo verde.** El gesto desaparece; ahí va todo en tinta.
4. **Degradados, sombras, contornos o glow** en cualquier versión.

**Sobre fotos:** el logo va siempre sobre una zona lisa y oscura de la imagen, en versión
clara. Si no hay zona limpia, se pone una barra o un bloque de color sólido detrás —
nunca se baja la opacidad del logo.

## 5-bis. El juego ON·IA — cómo se arma (decisión Sergio, 2026-07-27)

**El nombre es "Onia". Una palabra, siempre.** El juego ON+IA es un **recurso
narrativo**, no una forma de la marca. Se explica hablando; no se escribe partido.

### La regla de una línea
> **Se dice partido. Se escribe junto. Siempre.**

### Las dos capas

| | **Capa marca** (lo que se registra y se firma) | **Capa relato** (lo que se cuenta) |
|---|---|---|
| Qué es | `Onia` — una palabra | "ON + IA: tu negocio encendido, con inteligencia artificial" |
| Dónde vive | Logo, dominio, handles, facturas, contratos, registro SENAPI, footer legal, app stores | Explicación del nombre en la web, guion de demo, video de marca, pitch, primer mensaje de WhatsApp |
| Se registra | **SÍ** — denominativa + mixta, clase 42 | **NO.** No se reclama, no se registra, no se defiende |
| Cómo se escribe | `Onia` / `onia` | En prosa: *"Onia viene de ON —encendido— y de IA."* |

### Prohibido escribir la marca como
`ON-IA` · `OnIA` · `on.ia` · `ON IA` · `Onia (ON+IA)` en el logo o en el nombre legal.
Cada una de esas formas rompe la búsqueda ("onia" deja de encontrarte), confunde el
registro y contradice el nombre legal **OniaAgency**.

**Única excepción controlada:** en UNA pieza de contenido dedicada a explicar el
nombre, se puede destacar tipográficamente el `ia` final del wordmark por un momento
—como recurso editorial de esa pieza— y volver al wordmark normal. Nunca en el logo
permanente.

### Por qué el juego vale (y por eso se conserva)
- `ON` es universal en inglés y ya significa *encendido* — el estado que vende el producto.
- `IA` es inteligencia artificial en español, portugués, francés e italiano.
- **El nombre lleva su propio pitch en los dos idiomas de los dos mercados** (LatAm hoy,
  global después). Eso resuelve gratis la pregunta "¿por qué se llama así?", que toda
  marca nueva tiene que contestar.
- Y encaja con el gesto de marca: el cuadrado es el indicador de *encendido*.

### El app icon "on" NO es la marca partida
Es una **abreviatura visual del wordmark**, igual que `nu` es Nubank o `fb` fue Facebook.
Regla operativa que se deriva de esto (co-presentación, Ehrenberg-Bass): **donde aparece
el ícono solo, el nombre "Onia" tiene que estar cerca en texto** — nombre de la app,
handle, firma, título de la ficha. Así se enseña la asociación ícono→marca. Si el ícono
viaja solo y sin nombre, la gente aprende "On", no "Onia".

⚠️ **Y por eso el ícono no puede ser negro con letra clara:** ese es exactamente el app
icon de **On (On AG, ONON en NYSE)**, marca notoria de calzado. Clase distinta (25 vs 42)
→ sin conflicto de registro, pero las marcas notorias tienen protección ampliada más allá
de su clase (art. 136-h Decisión 486) y, sobre todo, copiar el asset de una marca de esa
escala destruye la única palanca que tiene una marca desconocida: la unicidad.
**Solución: el mismo "on", con esquema de color propio** (On es monocromo estricto,
nunca usa color).

## 6. Qué NO hacer

1. **El color nunca decora.** Nada de fondos de sección, degradados, líneas, íconos ni
   texto de color. Es señal o no es.
2. **No lleva información sobre fondo claro, y nunca texto blanco encima.** Es matemática
   (§2.3), no opinión.
3. **El cuadrado no se modifica.** No se redondea, rota, degrada, ni se le pone glow o
   sombra. Un solo color, un solo cuadrado, un solo significado. *El "glow" es la firma
   visual del SaaS barato de LatAm.*
4. **El cuadrado no miente.** Nunca en una acción humana, un resultado proyectado, un caso
   de éxito inexistente o un dato demo sin rotular. Rota una vez, destruye todo lo demás.

**El pecado capital:** ninguna foto stock de dentistas con pulgares arriba, ninguna
mascota, ningún robot, ningún cerebro con circuitos, ninguna mano humana tocando una
mano digital. El sistema es negro, tipografía y un cuadrado. Su fuerza es lo que se
niega a poner.

## 7. Referencias estudiadas

| Marca | Lección | Fuente |
|---|---|---|
| **Reddit** (Pentagram) | La burbuja no quedó como ícono: se volvió el **contenedor compositivo**. Modelo del "cuadrado como unidad de medida" | [pentagram.com/work/reddit](https://www.pentagram.com/work/reddit) |
| **Perplexity** (Smith & Diction) | *"Los colores tenían que ser casi completamente invisibles"*. El símbolo se anima **dentro del producto**, no se repite en 40 lugares. Justifica la regla del 2% | [Medium](https://medium.com/smith-diction/branding-perplexity-ai-70eb2cb2ef48) |
| **Spotify** | Lista de prohibiciones dura + tamaños mínimos (ícono ≥21px). Su verde es el color de reposo, no de todo | [developer.spotify.com/documentation/design](https://developer.spotify.com/documentation/design) |
| **Cash App** | Precedente del cuadrado verde como contenedor; eligió verde cuando Venmo/Zelle se fueron a azul/violeta — el color como jugada competitiva | [BUCK](https://buck.co/work/cash-app-visual-identity) |
| **Nubank** | Sistema modular que crece a rubros nuevos sin rediseñarse — Onia pasa de dental a comercio con el mismo gesto | [Nu Brand System](https://building.nubank.com/nu-brand-system/) |
| **Ramp** (Red Antler) | El acento como *"highlight energizante"* dentro de *"contención sofisticada"* | [redantler.com/work/ramp](https://www.redantler.com/work/ramp) |
| **Attio** | Precedente directo del gesto: su tittle es un **cuadrado del ancho exacto del asta** (medido: 4,2346 vs asta 4,267) | asset propio de attio.com |

## 8. La decisión de color, abierta

`ONIA_MARCA_SISTEMA_20260726.md` propone **terracota #C4441F** en vez de verde, con dos
argumentos medibles:

1. **Saturación de categoría:** verde/teal está ocupado donde Onia vende — Jane #00C1CA,
   Doctoralia #006A59, Mindbody #008363, Tebra #003A43, Alegra #30ABA9, Jobber #012939.
2. **Falla en el canal de venta:** el verde desaparece en un avatar de 40px sobre el
   verde de WhatsApp.

**Lectura para decidir:**
- El punto 2 **queda resuelto** por §2.4 (tile negro, no verde). Deja de ser problema.
- El punto 1 es real pero se da vuelta: ninguno de esos seis usa el verde como *señal
  semántica*, lo usan como color corporativo de fondo. Un verde en el 2% de la superficie
  que significa "esto se hizo solo" no compite en el mismo plano.
- **A favor del verde:** ningún otro color hereda gratis el significado "encendido/activo",
  que es literalmente lo que vende el producto. Terracota tendría que enseñar su
  significado desde cero — lujo caro con 11 semanas de runway.
- **A favor del terracota:** diferenciación inmediata de categoría y contraste mucho más
  flexible (5,0:1 sobre blanco vs 1,9:1 del verde) — vive también en superficies claras.

**La pregunta es de negocio, no de diseño: ¿el color se entiende solo (verde) o se
recuerda distinto (terracota)?** Recomendación con este runway: **verde**, con todo el
sistema de arriba para que no se parezca al de nadie. La estructura del doc es idéntica
si se elige terracota: cambia el hex y §2.3, no cambia una sola idea.
