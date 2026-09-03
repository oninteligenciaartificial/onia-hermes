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

**Qué lo destraba:** ✅ **encontrado el 2026-09-03 — ver P5. No era el método: era el UUID.**

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

### P5 · Hay DOS anclas Element, y la que quedó escrita es la que deriva

**El hallazgo que cierra P1, y no costó un crédito.** P1 quedó abierto porque se miró la hoja de
contacto —que no rotula— y se concluyó *"no se puede saber qué cuadro es qué método"*. **Los
cuadros sueltos sí traen el método en el nombre.** Abiertos el 2026-09-03; tabla y evidencia en
`BANCO-OFICIAL.md` §3 y en `docs/research/calidad-generado/evidencia-anclas-20260903/`.

El test del 13/08 no comparaba dos métodos sino **tres fuentes de identidad**:

| | Cara | Micro-detalle |
|---|---|---|
| Soul `36305a9b…` | Familia A | ✗ pastosa, piel manchada |
| Element **`452d8375…`** ← **la vigente** | **Familia B (la deriva)** | ✓ |
| Element `902eeebb…` (`lucia-surgical-anchor`) | **la del canon** | ✓ **la mejor** |

**La causa raíz de toda la deriva es una línea de `ORDEN-DE-DISPARO-L3-L4-L7-L8.md`** que fijó
`452d8375…` como ancla vigente el 23/08. Con esa se generó G06 el 28/08. **Arreglarlo es cambiar
un UUID en el prompt: cero créditos.**

**Por qué nadie lo vio antes:** el A/B original preguntó *"¿Soul o Element?"* y esa pregunta no
tiene la respuesta adentro — **hay dos Elements y la pregunta binaria los mete en la misma
bolsa.** Se eligió bien la familia y mal el miembro. Toda la evidencia estaba en disco desde el
13/08.

**La lección transferible:** cuando una comparación se escribe como A-contra-B, verificar
primero que A y B sean *uno* cada uno. Un A/B con tres brazos reportado como dos oculta al
tercero — y acá el tercero era el ganador.

### P6 · Un defecto del generador se puede canonizar como rasgo de la cara

`BANCO-OFICIAL.md` §3 listaba **"rubor marcado en pómulos y nariz"** como rasgo discriminante de
la Familia A. Mirado a tamaño real en `B-soul-closeup.jpg`, ese rubor **no es rubor**: es la piel
manchada de rojo del `soul_2` en plano cerrado — falla ya registrada en agosto tras 11 avatares
malos. Y los cuadros 3–5 del propio `INVENTARIO-caras.jpg` la tienen.

**El banco de referencia puede traer el artefacto horneado adentro.** Por eso los rasgos que
valen son los estructurales (cejas, mandíbula, edad), y por eso la rúbrica los pone primero.
Un rasgo que sólo aparece en piezas de un mismo generador es sospechoso de ser del generador.

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

**1 · Cambiar el ancla vigente de `452d8375…` a `902eeebb…` — GRATIS, es editar un UUID.**
Es la decisión que destraba el carril entero, y ya no necesita comprar información: los tres
brazos del test están medidos (P5). `452d8375…` sostiene la Familia B; `902eeebb…`
(`lucia-surgical-anchor`) sostiene la cara del banco **y** tiene el mejor micro-detalle de los
tres. Toca `ORDEN-DE-DISPARO-L3-L4-L7-L8.md`, que **no es zona de este loop**.

⚠️ Lo que hace falta que firme Sergio es que **los dos papeles se contradicen**:
`ONIA_MODELOS_RAIZ.md` (sin fecha ⇒ manda por `CLAUDE.md`) rotula `452d8375…` como *"PRIMER
PLANO"*; `ONIA_MODELOS_PERFILES_ALTA_20260806.md` prescribe `902eeebb…` para primer plano, con
motivo. **Los píxeles le dan la razón al segundo, la regla de precedencia al primero.** Este
loop no rompe el empate solo.

**2 · Confirmar el cambio con UNA imagen — 2 créditos.** Después de cambiar el UUID: mismo
prompt de G06 con `902eeebb…`. Confirma en un solo disparo que la cara vuelve al banco. Costo
de referencia: G06 costó **2 cr** de un saldo de ~2.100.

**3 · Separar ancla de escena — 2 créditos, y bajó de prioridad.** Era la pregunta cara cuando
no sabíamos si el culpable era el ancla o el fondo cargado (P3). Con P5 medido, el ancla ya
explica la deriva; este test sólo diría **cuánto suma además** la escena cargada. Vale la pena
sólo si después del cambio de UUID la cara todavía no cierra.

---

## Lo que todavía no se puede afirmar

- **No se puede medir tendencia de deriva con n=1.** El lote más nuevo tiene una imagen. La
  deriva de P1 está probada *contra el banco*, no como pendiente entre lotes.
- ~~No está resuelto qué cuadro corresponde a qué método.~~ ✅ **Resuelto el 2026-09-03 (P5)**,
  abriendo los cuadros sueltos en vez de la hoja de contacto.
- **No está confirmado en una pieza nueva que `902eeebb…` devuelva la cara del banco.** Está
  probado sobre el material del 13/08, no sobre una generación hecha para comprobarlo. Es una
  hipótesis fuerte con evidencia en disco, **no un arreglo verificado** — y confirmarla cuesta
  2 cr que este loop no puede gastar.
- **No se puede medir tendencia de deriva con n=1** (el lote más nuevo tiene una imagen).
- **Ninguna pieza de este carril fue generada por este loop.** Acá no se dispara nada pago.
