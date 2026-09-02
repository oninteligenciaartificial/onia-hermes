# Bitácora de perfección — por qué salió bien, y por qué salió mal

**Cuando una pieza sale impecable, el valor no es la pieza: es saber por qué salió bien.**
Y al revés: **tres fallas con la misma causa valen más que treinta piezas juzgadas de a una.**

Acá van los veredictos de la rúbrica (`RUBRICA-IMPOLUTO.md`) y, sobre todo, los **patrones**.

---

## Patrones — lo que hay que leer primero

### P1 · El ancla vigente sostiene una cara que NO es la del banco

**Evidencia:** `prueba-motor-20260813/CONTACTO-primeros-planos.jpg` muestra dos familias de
cara nítidamente distintas dentro del mismo test (detalle y tabla en `BANCO-OFICIAL.md` §3).
La que quedó adoptada —cejas rectas y gruesas, mandíbula ancha, gesto neutro, 30 y pico— **no
es** la que domina `INVENTARIO-caras.jpg`.

**Por qué importa más que cualquier pieza suelta:** la deriva **no empezó en el lote del
28/08**. Ya estaba el 13/08, dentro de la prueba que eligió el método. Cada pieza nueva se
corre igual y en la misma dirección porque el ancla es la misma. **No es azar del modelo: es
el ancla.** Juzgar pieza por pieza nunca lo iba a encontrar — sólo se ve comparando contra el
banco.

**Qué lo destraba:** la decisión de método (Soul vs Element ancla) que hoy está contradicha
entre dos documentos. Es de Sergio.

### P2 · "Verificada mirándola" no alcanza si se mira sólo la cara

`G06-peluqueria.jpg` se commiteó con *"Verificada mirándola: pecas, tono parejo, argolla
dorada y la cadenita visible"*. Todo eso es cierto. Y aun así la pieza no pasa: **el defecto
estaba en la tijera**, el objeto que define la escena entera.

**La lección operativa:** una verificación que sólo recorre la lista de rasgos de identidad
tiene un punto ciego del tamaño de la mitad del cuadro. Por eso la rúbrica separa el Bloque 2
(anatomía y objetos) y por eso exige **recortar y ampliar** — al 100 % la tijera parecía bien.

### P3 · La escena cargada compite con el ancla — y la cara pierde

`PRODUCCION_MES_1.md` fija, entre las reglas que aplican a **todas** las piezas:
*"fondo simple **cuando la cara tiene que ser reconocible**; escenario cargado sólo si la cara
no es el punto."*

En `G06-peluqueria.jpg` la cara **es** el punto —está centrada, de frente, ocupando el tercio
medio— y el fondo es lo más cargado del banco entero: espejo, estante con una docena de
envases, ventilador, calendario, azulejos, una segunda persona. **Se rompió la regla en el eje
exacto que protege la identidad.**

Esto le da a P1 una segunda causa candidata, y **conviene no confundirlas**: la deriva de la
cara puede venir del ancla (P1) y/o de que la escena cargada le robe capacidad al parecido.
Son distinguibles con una prueba barata: **la misma ancla, el mismo prompt, fondo simple.** Si
la cara vuelve al banco, el culpable era la escena; si no vuelve, es el ancla. Queda propuesto
en "Lo que necesita a Sergio", sin disparar.

### P4 · El pelo mojado no es deriva

Contra-patrón, para no acusar de más: en G06 el pelo se lee casi negro, muy lejos del castaño
con puntas acarameladas del banco. **Pero la escena es una peluquería y el pelo está mojado**,
que oscurece de verdad. No cuenta como falla de identidad. Lo que **no** explica el agua es la
forma de la ceja ni el ancho de la mandíbula — y ahí sí hay deriva. Anotado como ítem 1.4 de
la rúbrica con su salvedad.

---

## Veredictos

### `generadas-20260828/G06-peluqueria.jpg` — **NO PASA**

- **Lote / fecha:** `generadas-20260828`, commit `12ea2219` del 2026-08-30. Lote de **una sola
  pieza**.
- **Método:** Element ancla `452d8375-fb67-4df7-9ae0-8f1b257aa51f` (`lucia-ancla-2026-08`),
  según `ORDEN-DE-DISPARO`. **2 créditos.**
- **Bloque 1 Identidad — ✗ falla 1.1, 1.2 y 1.3.** Cejas rectas, gruesas y bajas donde el
  banco tiene arqueadas de grosor medio; mandíbula más ancha y cara más larga que el óvalo
  canónico; aparenta unos 30 contra los 25–27 del banco. Pecas ✓, piel ✓, aros ✓, cadenita ✓.
  1.4 (pelo) **no se cuenta**: está mojado (ver P4).
- **Bloque 2 Anatomía — ✗ falla 2.2.** Ampliada la zona de manos a 2×: la tijera tiene **una
  sola argolla**, las dos hojas no comparten un pivote coherente, y la mano de abajo tiene los
  **dedos fundidos en una manopla** sin entrar en la argolla. Es el objeto sobre el que se
  apoya toda la escena.
- **Bloque 3 Texto — ✗.** Hay texto legible en los envases del estante, en el calendario y en
  la hoja de la tijera, y dice letras inventadas. `PRODUCCION_MES_1.md` §"Reglas que aplican a
  **TODAS**" incluye `[TEXT RULE — MANDATORY] No legible text anywhere in frame`, y el
  checklist de `LUCIA.md` lo vuelve **obligatorio justamente "si hay props con letras"**. Una
  peluquería es props con letras de punta a punta: era el caso de manual. **No se aplicó.**
- **Bloque 4 Marca — ✓** en lo que se puede juzgar de la imagen sola (sin obra exhibida, sin
  prueba social). La etiqueta de IA se verifica al publicar, no acá.
- **Bloque 5 Técnico — ✓.** 407 KB, 1792×2400 (3:4), nítida.

> **Motivo en una línea:** la tijera es mecánicamente imposible y la cara no es la del banco
> — la pieza es linda y aun así no se puede publicar.

**Lo que sí hizo bien, y conviene conservar:** el encuadre. El prompt pedía *"mirá al espejo,
no a la cámara"* y el modelo compuso la foto **desde** el espejo, volviendo las dos cosas la
misma. En una peluquería es lo natural. **Ese hallazgo de composición es reutilizable y no
depende del ancla** — sirva o no la pieza.

---

## Lo que necesita a Sergio — cotizado, sin disparar

Este loop **no genera nada**. Las dos cosas que destraban el carril son decisiones suyas:

**1 · La contradicción de método (gratis, es sólo decidir).** `ORDEN-DE-DISPARO` dice que se
usa el **Element ancla** y que el Soul *"NO se usa: probado A/B, no le gana al Element"*. La
doctrina del carril de calidad dice que el aprobado es **Soul + texto** y que es el único que
da consistencia de cara. Las dos no pueden ser ciertas y cada sesión nueva elige mal. El dato
que el A/B original no miró: el Element gana en nitidez, pero **la cara que sostiene no es la
del banco**.

**2 · El test que separa ancla de escena — 2 créditos.** Una sola imagen: **misma ancla, mismo
prompt de G06, fondo simple**. Si la cara vuelve al banco, el culpable era la escena cargada
(P3) y se arregla escribiendo prompts, gratis. Si no vuelve, es el ancla (P1) y hay que
rehacerla. Costo de referencia: G06 costó **2 cr** de un saldo de ~2.100. **Es la pregunta más
barata que se puede comprar en este carril** — pero el permiso de gasto es de Sergio, así que
queda propuesto, no ejecutado.

---

## Lo que todavía no se puede afirmar

- **No se puede medir tendencia de deriva con n=1.** El lote más nuevo tiene una imagen. La
  deriva de P1 está probada *contra el banco*, no como pendiente entre lotes.
- **No está resuelto qué cuadro de la hoja de contacto corresponde a qué método.** Los nombres
  de archivo lo sugieren; la hoja no lo rotula. No se afirma lo que no se puede leer.
- **Ninguna pieza de este carril fue generada por este loop.** Acá no se dispara nada pago.
