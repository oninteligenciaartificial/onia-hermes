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

### P7 · 🔴 La deriva no es entre lotes: es DENTRO del mismo lote

**El hallazgo más caro del 2026-09-03, y contradice cómo veníamos buscando.** Hasta acá la deriva
se buscaba comparando lote contra lote (P1, P5). Montada la tira de las seis caras de
`posts-20260807` —el lote que cuatro documentos declaran *"listas para subir"*— **las seis no son
la misma mujer**, y son del **mismo día**.

Evidencia: `docs/research/calidad-generado/evidencia-posts-20260807/TIRA-6-caras.png`
(las seis caras recortadas a la misma altura, una al lado de la otra).

| | Cara | Contra el canon |
|---|---|---|
| P1, P2, P6 | Óvalo suave, pecas densas, 25–27 | **coinciden entre sí y con el banco** |
| P3 | Óvalo, pero **piel manchada de rojo** en pómulos y nariz | el artefacto del `soul_2` (P6) |
| P4, P5 | **Cara larga y angosta, mandíbula marcada, 28–32** | **otra cara** |

**Por qué importa más que la deriva del ancla:** arreglar el UUID (P5) corrige la dirección en la
que se corre la cara, **pero no esto**. Seis escenas generadas por separado no comparten identidad
aunque salgan del mismo ancla el mismo día — y ninguna comparación lote-contra-lote lo iba a ver,
porque el promedio del lote sí da parecido al banco. **La consistencia hay que medirla dentro del
lote, no solo contra el banco.**

⚠️ Salvedad honesta: P4 está de perfil 3/4 con el pelo tirante y P5 se está riendo fuerte; las dos
cosas alargan cualquier cara. Lo que **no** explican el ángulo ni el gesto es la mandíbula ni el
puente de la nariz, y son los dos rasgos estructurales que la rúbrica pone primero (1.2). Con eso
alcanza para no publicar; no alcanza para decir cuánto es ángulo y cuánto es modelo.

### P8 · 🔴 Una auditoría que elige la muestra siempre se da la razón

**Lo que hizo que estas seis piezas parecieran aprobadas.** En la misma carpeta vive
`_AUDITORIA-CARAS.jpg`: una hoja de auditoría de caras, hecha en su momento para verificar
justamente la consistencia. **Compara dos cuadros: P1 y P6.** Son —abierta la tira— exactamente
**las dos que sí coinciden entre sí**. P3, P4 y P5 no entraron a la hoja.

Una auditoría de 2 sobre 6, con la muestra elegida a ojo, **no puede fallar**: informa
"consistente" y deja el lote marcado como verificado. Después cuatro documentos lo heredaron como
*"listas para subir"* sin volver a abrir nada.

**La regla que sale de acá, y va a la rúbrica:** la comparación de identidad es **de todas las
piezas del lote a la vez**, en una sola tira, o no es. Elegir cuáles comparar es elegir el
resultado. Es el mismo modo de falla que el canario visual: *cuando una verificación no puede
refutar su hipótesis, más evidencia la vuelve más convincente, no más cierta.*

### P9 · El texto prohibido entra por los props, no por el cartel

Tres piezas del mismo lote traen texto legible inventado y **ninguna lo pone como protagonista**:
está en las teclas de una notebook (P2), en envases y calendario (G06). Nadie lo puso ahí — lo
puso el modelo, en el objeto de utilería.

`[TEXT RULE — MANDATORY] No legible text anywhere in frame` se lee como una regla sobre carteles,
y por eso se da por cumplida cuando la pieza "no tiene texto". **Se cumple o no en los props**, y
los props no se miran al 100 %: hay que recortar. En P2 el defecto ocupa 400 px de 1080 y es
invisible en el feed — hasta que alguien mira de cerca una pieza de una marca que vende software.

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

### `posts-20260807/` P1–P6 — **el lote NO se publica: 4 de 6 NO PASAN**

Las seis abiertas y miradas una por una el 2026-09-03, más recortes a 2× de manos, props y texto.
**Son las piezas que Onia estaba a punto de publicar**: `ONIA_AUDITORIA_MARKETING_LUCIA_20260812.md`
las da *"listas para subir"* y `ONIA_PLAN_CONTENIDO_Y_ADS_20260820.md` *"publicables"*. Nunca habían
pasado por esta rúbrica. Todas 1080×1350 (4:5), > 200 KB, nítidas → **Bloque 5 ✓ en las seis**.
Bloque 4 ✓ en las seis en lo juzgable de la imagen (la etiqueta de IA se verifica al publicar).

| | Veredicto | Motivo concreto |
|---|---|---|
| **P1** `hace-un-ano` | **PASA** | Cara del banco, pecas y argolla dorada correctas; overlay en castellano bien escrito. La más cerrada del lote y aguanta el zoom |
| **P2** `martes-10-manana` | **NO PASA** | **Bloque 3 ✗**: las teclas del MacBook dicen letras inventadas y **espejadas** — se lee "Confirm" al revés y dos cadenas ilegibles donde va la fila inferior |
| **P3** `tres-sistemas` | **NO PASA** | **Bloque 1 ✗ (1.7)**: manchones rojos en los dos pómulos y la nariz. Es el artefacto del `soul_2`, el mismo que la rúbrica marca ✗ aunque el banco lo tenga |
| **P4** `no-soy-real` | **NO PASA** | **Bloque 1 ✗ (1.2, 1.3)** cara larga y mandíbula marcada, aparenta 30+ · **Bloque 2 ✗ (2.1)** los dedos apoyan planos sobre el dorso del celular con las uñas hacia el espejo, y el que cruza el logo mide casi el ancho del teléfono |
| **P5** `nadie-escribio` | **NO PASA** | **Bloque 2 ✗ (2.2, 2.3)** sostiene un filamento metálico doblado que no es ninguna herramienta y no se apoya en nada · **Bloque 1** misma cara larga que P4 |
| **P6** `cuanto-tardas` | **PASA con reserva** | Cara del banco. La mano de la falda es blanda y de bajo contraste: dedos parejos sin nudillos visibles. **No es concluyente y no se declara falla** — es zona oscura y desenfocada, y acusar sobre eso sería el error del canario |

> **Motivo en una línea:** el lote que estaba por publicarse tiene dos caras distintas, texto
> inventado en las teclas de una notebook y una mano imposible — y su propia hoja de auditoría
> sólo miró las dos piezas que coinciden.

**Lo que sí hizo bien, y conviene conservar:** P1 y P6 son la mejor cara del banco entero fuera de
las anclas, y las dos tienen **el fondo fuera de foco y la cara como punto** — lo que pide
`PRODUCCION_MES_1.md` y lo que G06 rompió (P3 de esta bitácora). Las cuatro que fallan son las
cuatro de fondo nítido y cargado: café con seis personas, calle, gimnasio, cocina. **6 sobre 6 en
el mismo sentido, y encima las fallas de Bloque 2 y 3 están todas en el fondo o en un prop, nunca
en la cara.** No prueba causalidad con n=6, pero es la tercera vez que el fondo cargado aparece
del lado de las piezas que no pasan (P3, G06, y ahora este lote).

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

Este loop **no genera nada**. Las cosas que destraban el carril son decisiones suyas:

**0 · 🔴 LO URGENTE, Y NO CUESTA UN CRÉDITO: no publicar `posts-20260807` como está.**
Cuatro documentos lo declaran *"listas para subir"* / *"publicables"* y es el arranque previsto de
la cuenta de Lucía. **Cuatro de las seis no pasan** (tabla arriba). Publicables hoy: **P1 y P6**,
que además son las dos que sostienen la cara del banco. Con dos piezas no se arranca una cuenta,
así que la decisión real es: **arrancar con P1 + P6 y regenerar las otras cuatro, o esperar.**
Los cuatro documentos que dicen "listas" viven en `hermes-content/docs/`, que **no es zona de este
loop** — la corrección la hace el carril de docs o Sergio.

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

- ~~No se puede medir tendencia de deriva con n=1.~~ ✅ **Medida el 2026-09-03 con n=6**, pero no
  donde se la buscaba: el lote `posts-20260807` da **dos caras dentro del mismo día** (P7). La
  deriva *entre* lotes sigue sin cuantificarse; la de *dentro* del lote ya está probada, y es la
  que manda para publicar.
- **No se sabe si arreglar el ancla (P5) arregla también P7.** Son dos fallas distintas: el ancla
  fija hacia dónde se corre la cara, la generación escena-por-escena hace que cada pieza se corra
  por su cuenta. **Cambiar el UUID no tiene por qué resolver la segunda.** Medirlo cuesta un lote
  de 6 con el ancla nueva — está cotizado abajo, no disparado.
- ~~No está resuelto qué cuadro corresponde a qué método.~~ ✅ **Resuelto el 2026-09-03 (P5)**,
  abriendo los cuadros sueltos en vez de la hoja de contacto.
- **No está confirmado en una pieza nueva que `902eeebb…` devuelva la cara del banco.** Está
  probado sobre el material del 13/08, no sobre una generación hecha para comprobarlo. Es una
  hipótesis fuerte con evidencia en disco, **no un arreglo verificado** — y confirmarla cuesta
  2 cr que este loop no puede gastar.
- **No se puede medir tendencia de deriva con n=1** (el lote más nuevo tiene una imagen).
- **Ninguna pieza de este carril fue generada por este loop.** Acá no se dispara nada pago.
