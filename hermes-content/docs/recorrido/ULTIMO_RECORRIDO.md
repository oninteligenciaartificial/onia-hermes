# El recorrido de cliente — último estado

**Un tema = un archivo sin fecha. Este archivo se EDITA, no se duplica.** Las fotos con fecha
van en `capturas/`.

Cómo se reproduce, y es un comando, no una intención:

    cd /root/loops/onia-hermes-recorrido && node scripts/recorrido_cliente.mjs

Sin `--escribir` el recorrido llega hasta el paso 2 y se detiene: no crea cuenta, y sin cuenta
no hay nada detrás. Para recorrerlo entero, ver *"Cómo se corre entero"* al final.

---

## Medido el 2026-09-04 16:11 La Paz — **los CINCO rubros recorridos; cuatro enteros y uno ROTO**

| Rubro | Resultado | Dónde está la prueba |
|---|---|---|
| Clínica dental | **9 de 9** | `capturas/` |
| Comercio / tienda | **8 de 8** (el paso 7 no le corresponde) | `capturas/comercio/` |
| Estética y spa | **9 de 9** | `capturas/estetica/` |
| **Servicios profesionales** | **6 de 9 — ROTO en el paso 7** | `capturas/servicios/` |
| Importadora / distribuidora | **9 de 9** (el paso 7 no le corresponde) | `capturas/importadora/` |

Los cinco con `--escribir` y **cero filas de este carril** en la base al cerrar.

### Importadora / distribuidora: entera, sin agujeros

Misma forma que comercio: la tarjeta de `/register` no promete agenda («Catálogo, cotizaciones
B2B y costeo de importación»), así que el paso 7 sale `no-aplica` y no cuenta como agujero.
Alta con confirmación de correo, onboarding en 6 pantallas, dato cargado y encontrado de vuelta
en el storefront `/comercio`, pantalla de cobro (`/comercio/fiados`) vista y frenada ahí a
propósito.

Un detalle sin gravedad, anotado para no perderlo: el dato cargado (`...-paciente`) queda visible
en el storefront pero **no aparece en los widgets de `/dashboard`** — no es un agujero del
recorrido (el dato SÍ persiste y SÍ se ve en su pantalla propia), pero si otro carril audita el
panel de importadora, esta es la pista.

> ⚠️ La única fila `zz-qa-` que queda en producción es **ajena** (`zz-qa-recall-demo-1`, fixture
> del agente Recall de otro carril). Aparece en `resumen.json` como `zzQaAjenas` y **no se toca**:
> el chequeo de cierre «`count(*) LIKE 'zz-qa-%'` = 0» hoy da **1** y eso NO es basura mía.

### Servicios profesionales: promete agendar y no puede agendar nunca

Es el hallazgo de la vuelta, y es de los caros: **la venta promete lo que el producto no entrega.**

- La tarjeta del rubro en `/register` promete, textual: **«Agenda, citas, cobros y contabilidad»**.
- El menú tiene *Citas* y *Agenda de hoy*, y la **primera** acción rápida del botón `+` es
  **«Nueva cita»**. El producto vende agendar como lo primero que hace ese rubro.
- El formulario de la cita exige **«Cliente \*»** y ese desplegable tiene **CERO opciones**.
  No es que no se eligió: **no hay nada para elegir.**
- Causa, leída en la fuente y no supuesta: `SERVICIOS_NAV_ITEMS` (`lib/platform/vertical-pack.ts`)
  **no tiene ninguna entrada de clientes**. Dental sí (`/patients` → «Pacientes»). En ese pack no
  existe la pantalla donde crear el cliente que la cita pide — aunque el vocabulario del rubro sí
  define `clientes` y el buscador de arriba dice **«Buscar clientes…»**.

Prueba: `capturas/servicios/paso-07c-cita-enviada.png` — el desplegable vacío con el globo de
validación del navegador, y todo el resto del formulario lleno. Reportado en el tablero como
`t_2b03ea3d` (prioridad 1) al carril `onia-cola`: **este carril mide, no toca el producto.**

### Dos falsos rojos MÍOS que se cazaron en el camino

Los dos son del instrumento, no del producto, y los dos habrían acusado a un producto sano:

1. **El paso 6 daba ROJO en servicios profesionales** («el menú no ofrece ninguna pantalla donde
   cargar un dato») porque mi mapa buscaba sólo *cliente*/*paciente*. Ese pack carga su dato en
   `/comercio`, que ahí se llama **«Servicios»** — igual que comercio lo carga en «Catálogo». El
   patrón de clientes quedó primero, así que el día que aparezca esa pantalla, gana ella.
2. **La evidencia de cada rubro apuntaba a las capturas de DENTAL.** La ruta del `resumen.json`
   estaba escrita a mano; las capturas se guardaban en la carpeta del rubro y se reportaban en la
   de dental, **donde vive un PNG con el mismo nombre**. Medido: **17 de 17** rutas de comercio y
   estética apuntaban al archivo equivocado, **y las 17 existían**. Un chequeo de «¿existe la
   captura?» daba verde sobre las 17. Este carril entrega una sola cosa —la prueba de dónde se
   rompe— y la estaba entregando de otro rubro.

Gates del instrumento: `scripts/recorrido_cliente.test.mjs` (6 casos, verificados en rojo
inyectando el defecto real antes de arreglarlo).

### Por qué comercio cierra en 8 y eso NO es un agujero

Una tienda no tiene citas: su menú ofrece Catálogo, Inventario y Caja, y está bien que sea así.
Hasta hoy el paso 7 salía `no-medido` y contaba como agujero, así que comercio daba **6 de 9** —
un rojo permanente contra un producto sano, y **2 de los 5 rubros que se venden quedaban
imposibilitados de completar el recorrido para siempre**.

El escape fácil («si no hay agenda, no aplica») era peor: el día que dental *pierda* su agenda,
saldría verde. Así que quién debe tener agenda no lo decide una tabla escrita a mano —se vence—,
lo decide **la promesa de venta del propio rubro**, leída de su tarjeta en `/register`:

| Tarjeta viva en `/register` | ¿Promete agenda? | Paso 7 |
|---|---|---|
| Clínica dental — «Pacientes, **citas**, tratamientos y cobros» | sí | obligatorio |
| Estética y spa — «**Agenda**, clientas, tratamientos y caja» | sí | obligatorio |
| Servicios profesionales — «**Agenda**, **citas**, cobros y contabilidad» | sí | obligatorio |
| Comercio / tienda — «Catálogo, inventario, caja y clientes» | no | `no-aplica` |
| Importadora — «Catálogo, cotizaciones B2B y costeo de importación» | no | `no-aplica` |

- promete y no está → **ROJO**, y del caro: la venta ofrece lo que el producto no entrega.
- no promete y no está → `no-aplica`, y se **nombra** en el veredicto (no desaparece).
- no promete y sí está → se mide igual: probar de más nunca miente.
- no se pudo leer la tarjeta → **se exige la agenda**. Este paso falla cerrado.

Estética es la prueba de que el gate no se rindió: promete «Agenda», la tiene, y la cita entró
(POST 201, id `cmtmt5zjv003j01rw6koicr3k`) y se vio en el calendario.

### 🔴 El prefijo `zz-qa-` dejó de ser de este carril

Apareció en producción la cita **`zz-qa-recall-demo-1`** («zz-qa- control anual (dato de prueba,
agente Recall)», creada 2026-09-04 08:37 UTC en la organización `ZZ QA Clinica Chatbot`): un dato
de prueba que **otro carril** sembró para su agente.

Mi limpieza borraba por `LIKE 'zz-qa-%'` a secas. **Zafó de casualidad**: el fixture ajeno puso el
texto en `reason` y yo borraba por `notes`. El día que uno use `notes`, un `DELETE FROM appointments
WHERE notes LIKE 'zz-qa-%'` se lo lleva puesto, sin aviso y sin forma de saber que existió.

Arreglado: el borrado va por la **forma** `zz-qa-AAAA-MM-DD-HHMM…`, que es la que llevan mis filas
—y cubre también a los huérfanos de una corrida mía que se haya caído a la mitad—. Lo que lleva el
prefijo y no tiene esa forma se **cuenta, se informa y jamás se toca** (`zzQaAjenas` en el resumen).

Verificado en vivo, no supuesto: corrida completa de dental → `0` filas mías y la fila ajena
**sigue existiendo** después de la limpieza.

⚠️ **Ojo con el chequeo de cierre `count(*) … LIKE 'zz-qa-%' = 0`**: hoy da 1 y eso **no es basura
sin limpiar**. Lo que hay que exigir en 0 es lo que tiene mi forma.

### La corrida de dental, en detalle

Cuenta `zz-qa-2026-09-04-0717@onia.com.bo` creada desde `onia.com.bo`, correo confirmado con el
enlace del mail, alta completa (rubro → negocio → horarios lun-vie 09-13 y 15-19 → equipo con el
rol **Profesional** → listo), paciente cargado y encontrado de vuelta en la lista, **cita agendada
el lunes 7-sep 09:00 (POST `/api/appointments` → 201, id `cmtmmj13d001601rwl6g31e42`) y VISTA en el
calendario**, pantalla de cobro a la vista y frenado ahí a propósito.

Prueba que se mira, no que se supone: `capturas/paso-07d-cita-en-agenda.png` — el bloque
`9:00 zz-qa-…` en el día 7 del calendario.

**Todo lo escrito se borró en la misma corrida.** Verificado por fuera del script, que no puede ser
juez de su propia limpieza: `appointments`, `organizations` y `auth.users` con `zz-qa-%` → **0, 0, 0**,
y la cita `cmtmmj13d001601rwl6g31e42` ya no existe.

### 🟠 Lo que este carril acusó y era MENTIRA: el paso 4 y el desplegable de profesional

Dos veredictos rojos de la vuelta anterior eran del instrumento, no del producto. Los dos acusaban
a pantallas que funcionan bien, y uno llegó al tablero con prioridad 1 (`t_2f5a96b6`, ya cerrada
con la prueba).

**1. «Rebotó en /login — sin mensaje visible».** La captura del mismo paso muestra un cartel rojo
enorme: *"Tu cuenta está creada, pero falta verificar tu correo. Revisá tu bandeja y volvé a
iniciar sesión."* Y la pantalla anterior ya lo había dicho entero: *"Verificá tu correo — Tu cuenta
ya fue creada."* **El producto avisa bien en las dos pantallas.** El ciego era el recorrido, y
fallaron sus dos sondas a la vez por motivos distintos:

- `page.on('response')` sobre `/token` **no puede ver nada**: el login de la app se resuelve en el
  **servidor** de Next. El `400 email_not_confirmed` de Supabase salió de `172.19.0.10`, una IP
  interna — esa respuesta nunca pasa por el navegador.
- el cartel no trae ninguna de las clases CSS que se buscaban (`[role=alert]`, `.text-red-500`…).

Y como el motivo llegaba vacío, el patrón `sinConfirmar` no matcheaba y el paso **ni intentó** la
confirmación por enlace que ya sabía hacer. Arreglado con una tercera sonda que no depende de
adivinar clases ni de que el error viaje por el navegador: *lo que apareció en pantalla después de
apretar y no estaba antes es lo que el producto te contestó*. Y el patrón ahora reconoce
`verificar`, no sólo `confirm`, que era la única forma en que el mensaje llegaba.

**2. «El desplegable de profesional está siempre vacío».** Hoy se llena y la cita entra. La
diferencia está en el alta: la versión que midió aquello llenaba la pantalla *"¿Quién más trabaja
con vos?"* escribiendo en todos los campos de texto, **sin elegir el rol**; la de `main` aprieta el
botón **Profesional** antes de terminar, y con el rol elegido `/api/team` crea los
`doctor_schedules` que llenan el desplegable.

⚠️ **Queda una pregunta abierta, y es legítima:** si el dueño aprieta *"Saltar por ahora"* en la
pantalla de equipo, **nadie comprobó** que pueda agendar después. La causa raíz que se describe
abajo —el alta guarda los horarios en `clinicSettings.oniaCoreOnboarding` y nunca escribe
`doctor_schedules`— puede seguir siendo cierta **para ese camino**. Es el próximo escalón del carril.

**La lección, que vale más que los dos arreglos:** esa causa raíz estaba *"verificada en el código"*,
con archivo y línea, y era una explicación plausible construida sobre una medición hecha con un
instrumento defectuoso. Más evidencia la hacía más convincente, no más cierta.

### ⚠️ El mismo carril corría en DOS árboles y el instrumento se bifurcó

`main` tenía `9e21a15e7` (carga horarios, elige el rol, mide el POST y **borra lo suyo** con
`limpiarProduccion`) y la rama tenía una versión paralela más pobre del mismo trabajo, con
`contarCitasQA` como única verificación y **sin borrado automático** — cada vuelta dejaba basura
`zz-qa-` en producción para que alguien la borrara a mano. Resuelto convergiendo con `main`:
verificar por `201`+id y volver a VER la cita en la agenda recargada es más fuerte que contar filas.

---

## Medido el 2026-09-04 01:24 UTC — rubro DENTAL, con el paso que faltaba: AGENDAR

> ⚠️ **Corregido el 2026-09-04 07:30, arriba.** Los dos rojos de esta sección eran del instrumento:
> el producto avisa que falta verificar el correo, y el desplegable de profesional se llena cuando
> el alta elige el rol. Se deja el texto porque la causa raíz que describe sigue abierta para el
> camino "Saltar por ahora", y porque muestra cómo se construye una acusación falsa bien documentada.

El recorrido nunca había enviado una cita. Por eso el carril no vio lo que sigue.

### 🔴 Un negocio nuevo no puede agendar NI UNA cita (paso 7, roto)

Cuenta creada hoy, alta completa **sin saltear nada** —horarios cargados y una persona cargada en
"¿Quién más trabaja con vos?"—. En `/appointments`, el modal **Agendar Cita** muestra
`Profesional *` con una sola opción vacía y el botón **apagado**: no hay forma de agendar, y la
pantalla no dice qué falta. Para el paciente ofrece "+ Nuevo paciente"; para el profesional, nada.

Captura: `capturas/paso-07b-cita-formulario.png` — el paciente elegido, el profesional vacío.

**Causa raíz, leída en el código y confirmada en la base:** el desplegable se llena desde
`/api/doctor-schedules` (`appointments/page.tsx:152-159`), o sea de la tabla `doctor_schedules`.
El alta guarda los horarios en el JSON `clinicSettings.oniaCoreOnboarding`
(`lib/onboarding/aplicar.ts:236`) y **nunca escribe en `doctor_schedules`**. En cambio `/api/team`
sí crea horarios al dar de alta a alguien (`api/team/route.ts:108-109`): el producto sabe hacerlo
por un camino y no lo hace por el otro. Medido en la org de prueba: `profiles` = 2 (ADMIN dueño +
DOCTOR cargado en el alta), `doctor_schedules` = **0** para los dos.

El producto promete esto DOS veces durante el alta —"La agenda no va a aceptar citas fuera de este
horario" y **"Con al menos una persona cargada ya podés agendar"**— y las dos son falsas hoy.
Reportado al dueño del producto: tarea **`t_2f5a96b6`**, prioridad 1.

### 🟠 Y el primer veredicto de ese paso fue una acusación FALSA mía

La primera corrida dijo *"el formulario no ofrece a quién citar"* **sobre un modal que listaba al
paciente**. La pantalla tiene **dos** `role=dialog` y `getByRole('dialog').first()` agarra el
**menú lateral** (0 selects), no el modal (3 selects). Medido con un diagnóstico aparte antes de
reportar nada; el diálogo ahora se elige por el botón que **envía**, igual que `acotarFormulario`.

**Es la tercera acusación falsa de este carril, y las tres tienen la misma forma:** el instrumento
mira el pedazo de pantalla equivocado y le echa la culpa al producto. Lo único que las frenó las
tres veces fue **abrir la captura antes de escribir el informe**.

### Lo que cambió en el instrumento

- **Paso 7 nuevo: agenda.** Elige paciente y profesional, prueba hasta 7 días buscando un horario
  libre (elegir uno solo y encontrarlo cerrado reportaría "no se puede agendar" sobre un producto
  sano), escribe la marca `zz-qa-` en las notas y envía. Verifica **doble**: cuenta la fila en
  `appointments` *y* vuelve a la agenda a buscarla en pantalla. Una sola de las dos ya mintió antes
  (el bot decía "Listo, agendado" con la reserva en NULL).
- **El alta ya no saltea horarios ni equipo.** Los salteaba "como alguien apurado", y ese salto era
  justo el que dejaba sin medir la agenda. Si el producto no deja avanzar, saltea y lo dice en la traza.
- **El cobro pasó al paso 8**, junto con el panel: los dos últimos son miradas, ninguno envía nada.
- **Estado `no-aplica`**, para el rubro que no vende agenda (comercio, importadora): no cuenta como
  agujero, pero se imprime siempre con el menú con el que se dedujo, para poder discutirlo.

**Producción:** 9 filas `zz-qa-` de las dos corridas impresas antes de borrar y borradas por
prefijo en una transacción. Recuento posterior: **0**. Lo real intacto (5 orgs · 2 pacientes ·
3 solicitudes).

---

## Medido el 2026-09-03 19:14 UTC — rubros ESTÉTICA e IMPORTADORA

### 🟢 Estética y spa: los 8 pasos, tercer rubro entero

    RECORRIDO_RUBRO='Estética y spa' node scripts/recorrido_cliente.mjs --escribir

Sin una sola sorpresa. El vocabulario del rubro está bien puesto de punta a punta: el menú dice
**Clientas**, el buscador "Buscar clientas…", el botón "Clienta" y el pie del panel
"1 clienta(s) nuevas este mes". El dato se cargó en Clientas (`/patients`), se encontró de vuelta
en la lista, y el panel **contó la clienta nueva**: `paso-06-menu.png` decía "0 clienta(s) nuevas
este mes" y `paso-08-bandeja.png`, después del alta, dice "1". La pantalla de cobro es
**Facturación** (`/billing`) y se vio entera.

### 🔴 Importadora: el recorrido cantó COMPLETO sobre un paso que nunca midió

    RECORRIDO_RUBRO='Importadora / distribuidora' node scripts/recorrido_cliente.mjs --escribir

Los pasos 1-6 y el 8 salieron verdes; **el 7 salió `no-medido`** —"pedí `/billing` y terminé en
`/dashboard`"— y aun así el script imprimió **"RECORRIDO COMPLETO: los 8 pasos"**, con
`corte: null` en el `resumen.json`. **Ese fue el hallazgo de la vuelta, y era del instrumento, no
del producto.**

La causa: el veredicto miraba `ultimoOk`, que guarda el **último** paso verde y no hasta dónde se
llegó de corrida. Con el 7 en agujero y el 8 en verde valía 8, la comparación contra los 8 pasos
daba verdadero, y `corte` salía null porque busca un fallo con `n > ultimoOk` y no hay paso
después del 8. **El agujero desaparecía hasta del JSON.** Es la misma familia de falso verde que
este script ya tuvo en los pasos 5-8, con otra forma: antes por confiar en un 200, ahora por
confiar en el último verde.

Arreglado (`17aaec727`). Rojo antes, con los datos reales de esa corrida: `RECORRIDO COMPLETO:
los 8 pasos`. Verde después: `LLEGÓ HASTA EL PASO 6 de 8 de corrida` + `AGUJERO en el paso 7`.
Ahora "completo" exige que **no haya ni un paso fuera de OK**, y el agujero **tapado por un verde
posterior** —el único que el veredicto viejo borraba— se enumera aparte.

### Y el paso 7 de importadora tampoco era culpa del producto

Antes de acusar al producto miré su código: **el pack de importadora no trae Caja ni Facturación
a propósito** (`onia-platform/lib/platform/vertical-pack.ts:155-156`). Ese rubro cobra por
**Créditos** (`/comercio/fiados`) y **Cotizaciones** (`/importadora/cotizaciones`) — se ve en
`capturas/paso-07-cobro.png`, que muestra el menú completo sin Facturación por ningún lado.

El patrón que busca la pantalla de cobro en el menú (`caja|cobro|facturación|billing|pagos`) no
conocía esos nombres, se cayó al `/billing` de dental y el producto redirigió al panel. Corregido
en el mismo carril: ahora busca en tres tandas, en el orden en que un rubro cobra —donde entra la
plata (caja, facturación, créditos/fiados) y recién después el paso previo (cotizaciones)—.
Verificado contra los cuatro menús reales: importadora→Créditos, comercio→Caja,
dental→Facturación, estética→Facturación.

**Falta volver a correr importadora** para medir su paso 7 de verdad. Queda en la cola.

---

## Medido el 2026-09-03 16:14 UTC — rubro COMERCIO

### 🟢 Los 8 pasos, y por primera vez en un rubro que no es dental

    RECORRIDO_RUBRO='Comercio / tienda' node scripts/recorrido_cliente.mjs --escribir

| # | paso | estado | qué se vio |
|---|---|---|---|
| 1 | Entrar a `onia.com.bo` y que se VEA | ✔ OK | cargó en 2.150 ms, 6.977 caracteres visibles |
| 2 | Encontrar el camino de alta | ✔ OK | 7 botones; el camino es "Creá tu cuenta", **2 clics** |
| 3 | Registrarse con datos `zz-qa-` | ✔ OK | cuenta creada; el alta pide confirmar el correo antes del primer login |
| 4 | Entrar a la plataforma | ✔ OK | entró tras abrir el enlace de confirmación, como el cliente con el mail |
| 5 | Elegir rubro y terminar el onboarding | ✔ OK | 6 pantallas del asistente; `/dashboard` dejó de rebotar |
| 6 | Cargar un dato del rubro | ✔ OK | creó el producto `zz-qa-…-paciente` en **Catálogo** (`/comercio`) y lo encontró de vuelta en la lista |
| 7 | Pantalla de cobro (mirar y FRENAR) | ✔ OK | la pantalla de cobro de comercio se llama **Caja** (`/comercio/caja`); **frenado ahí a propósito** |
| 8 | Abrir la bandeja / el panel | ✔ OK | el producto **sí figura** en el panel, en *Stock crítico* |

**Un comercio recorre el producto entero igual que una clínica.** Las capturas de los 8 pasos se
miraron una por una: `paso-06c` muestra "1 producto(s) en el catálogo" con la fila cargada, y
`paso-08` lo muestra otra vez en el panel. Nada del producto se rompió en esta vuelta.

Dos diferencias reales entre rubros, que el recorrido antes no podía ver porque navegaba a rutas
fijas de dental: la pantalla del dato es **Catálogo (`/comercio`)** y no `/patients`, y la de
cobro es **Caja (`/comercio/caja`)** y no `/billing`. Pedir `/billing` con una cuenta de comercio
rebota — y eso se leía como "el producto no tiene pantalla de cobro" cuando la tiene, con otro
nombre. Ahora las dos se **descubren del menú** que el producto le muestra a ese rubro.

⚠️ **Lo que el paso 6 NO prueba en comercio:** carga el nombre del producto y nada más. Precio y
stock quedan vacíos (se ven como `—` y `0 unidad` en la captura) porque el instrumento no
inventa cifras. Que el producto guarde un precio **no está medido**.

### 🔴 El falso ROJO que se arregló esta vuelta: el instrumento cerraba el formulario que abría

La vuelta anterior dejó el paso 6 en rojo con este texto:

    el formulario de alta de "storefront Catálogo" no tiene botón de guardar

**Era mentira, y la culpa era del instrumento.** Medido en vivo entrando con una cuenta ya
creada: al apretar «Nuevo producto» el modal abre bien, con sus campos y con el botón
**«Guardar producto»** — está en `capturas/evidencia-06-modal-comercio-abierto.png`. Lo que pasaba
después es que el paso llamaba a `despejar(page)`, que aprieta los botones **«Cerrar por ahora»** y
**«Cerrar»** para sacarse de encima el tour de bienvenida… y el botón de cancelar de ese modal se
llama **exactamente «Cerrar»**. El instrumento cerraba el formulario que acababa de abrir.

Y entonces venía la segunda mitad del daño: con el modal cerrado, el relleno buscaba "el primer
campo de texto de la página" y encontraba el **buscador** de la lista (`Buscar productos…`).
Escribía el `zz-qa-…` ahí —se veía en la captura, arriba, en la lupa— y el alta se enviaba vacía.

En dental nunca se notó: ahí el alta es una **página** (`/patients/new`), no un modal, así que no
había ningún «Cerrar» que apretar. **Un instrumento afinado a un solo rubro acusa al producto en
todos los demás.**

Tres arreglos, y el orden importa:

1. **Se quitó el `despejar()` de adentro del paso 6.** No hace falta: el tour ya lo sacó
   `llegar()` en esa misma pantalla, y apretar un botón no puede invocarlo de nuevo.
2. **El formulario se ACOTA antes de llenarlo** (`acotarFormulario`), y la raíz se deduce del
   **botón de guardar hacia arriba** — no de `role=dialog`, que este modal no declara, ni de una
   clase CSS. Es la única definición que sirve en los 7 rubros: el formulario es lo que rodea al
   botón que lo envía. Fuera de esa raíz no se escribe una letra.
3. **Nunca se llena un buscador** (`buscar|search|filtrar` o `type=search`), aunque sea el primer
   campo de texto que aparezca.

Y el paso ahora distingue dos fallos que antes se reportaban con el mismo texto: *"apreté el
camino de alta y no apareció ningún formulario"* (con la lista de botones a la vista) es distinto
de *"el formulario no tiene botón de guardar"*. El primero acusa al camino; el segundo al
formulario.

> **La lección, que vale para cualquier carril que maneje un navegador:** una rutina que cierra
> overlays por el TEXTO del botón acabará cerrando algo que hacía falta. `despejar` se escribió
> para un tour y terminó apretando el cancelar de un alta. Un cierre a ciegas es una acción
> destructiva con cara de higiene.

### Lo que se escribió en producción esta vuelta, y cómo quedó

Se borraron **tres** cuentas, no una: además de la de esta corrida quedaban **dos de la vuelta
anterior**, que murió por tiempo antes de limpiar (`zz-qa-2026-09-03-1317` y `-1320`). Impresas
antes de tocarlas, borradas en una transacción **por prefijo `zz-qa-`**, nunca por fecha ni por
rango:

```
auth.users                        3   zz-qa-2026-09-03-{1317,1320,1614}@onia.com.bo
auth.identities                   3
profiles                          3
organizations                     3   zz-qa-2026-09-03-{1317,1320,1614}
organization_entitlements         3   module.agents
onia_commerce_products            1   zz-qa-2026-09-03-1614-paciente
onia_commerce_product_variants    1
```

Recuento posterior: **0 filas `zz-qa-`** en las cinco tablas. Lo real intacto: **4
organizaciones · 6 perfiles · 1 paciente · 3 productos · 3 solicitudes**. Los 6 perfiles que
quedan son todos del 16 al 31 de agosto — ninguno de hoy, o sea que no quedó basura anónima.

⚠️ **Las columnas de estas tablas son camelCase de Prisma y van entre comillas dobles**:
`"organizationId"`, `"productId"`, `"featureKey"`. Un `WHERE organization_id = …` no falla en
silencio —da `ERROR: column does not exist`—, pero dentro de un heredoc largo ese error pasa
desapercibido y el borrado queda a medias.

---

## Vuelta anterior — 2026-09-03 10:18 UTC, rubro dental

### 🟢 Los 8 pasos — y esa vez el paso 3 PODÍA salir rojo

| # | paso | estado | qué se vio |
|---|---|---|---|
| 1 | Entrar a `onia.com.bo` y que se VEA | ✔ OK | cargó en 1.476 ms, 6.977 caracteres visibles |
| 2 | Encontrar el camino de alta | ✔ OK | 7 botones; el camino es "Creá tu cuenta", **2 clics** |
| 3 | Registrarse con datos `zz-qa-` | ✔ OK | cuenta creada; **el alta pide confirmar el correo antes del primer login** |
| 4 | Entrar a la plataforma | ✔ OK | entró tras abrir el enlace de confirmación, como el cliente con el mail |
| 5 | Elegir rubro y terminar el onboarding | ✔ OK | 6 pantallas del asistente; `/dashboard` dejó de rebotar |
| 6 | Cargar un dato del rubro | ✔ OK | creó `zz-qa-2026-09-03-1018-paciente` y lo encontró de vuelta en `/patients` |
| 7 | Pantalla de cobro (mirar y FRENAR) | ✔ OK | `/billing` a la vista; **frenado ahí a propósito** |
| 8 | Abrir la bandeja / el panel | ✔ OK | `/dashboard` abrió; el paciente no figura ahí — el panel no lista pacientes |

**El recorrido se completó entero, y ahora eso significa algo.** Hasta esta vuelta el paso 3 no
podía salir rojo bajo ninguna circunstancia (abajo el detalle), así que "8 de 8" incluía un paso
que nunca se midió. Este es el primer recorrido completo con los ocho pasos capaces de fallar.

### Lo que el alta hace de verdad, medido en vivo

`ONIA_ALTA_AUTOMATICA=abierta`. `/register` crea la cuenta, pero **no deja entrar sola**:
`GOTRUE_MAILER_AUTOCONFIRM=false`, así que el primer login rebota con `email_not_confirmed`
hasta que el cliente hace clic en el enlace del correo. Verificado que ese correo **sale y lo
aceptan**: `postfix/smtp: to=<zz-qa-…@onia.com.bo>, relay=route2.mx.cloudflare.net, status=sent
(250 2.0.0 Ok)`. El enlace también funciona: con `token=` el endpoint procesa y redirige.

Eso significa que **el camino del cliente pasa por su casilla de correo**. No es un fallo, pero
es el único tramo que el producto no controla — y hasta hoy el recorrido lo confundía con un
login roto.

---

## Lo que se arregló esta vuelta: el paso 3 no podía fallar

Tarea del tablero `t_bffb91fb`, encontrada por el supervisor abriendo la captura.

El estado del paso 3 era `estado: crearCuenta ? 'ok' : 'no-medido'`: dependía de si el
formulario **era** de crear cuenta, nunca de si el envío **funcionó**. No existía forma de que
saliera rojo. Y su único detalle era la URL —que en este alta no se mueve ni al salir bien ni al
salir mal—, con lo que el reporte decía literalmente *"la URL pasó de /register a /register"* y
lo llamaba éxito.

**Reproducido en vivo a las 10:10 UTC** con el script viejo: paso 3 **OK**, paso 4 roto, cuenta
inservible. El verde tapaba el corte y se lo colgaba al login.

Ahora el paso 3 **mira la pantalla**, como ya hacía el paso 4: texto de éxito → OK; error
visible → roto; ni una cosa ni la otra → roto (el fallo mudo, que es el más caro). Probado en
rojo antes de darlo por bueno: con el correo ya registrado devolvió
`ROTO — envié el alta y la pantalla no dijo nada`.

### Tres trampas medidas, que valen más que el arreglo

1. **El correo `zz-qa-<fecha>` hacía chocar las corridas del mismo día.** Ahora lleva la hora
   (`zz-qa-<fecha>-<hhmm>`). Sin eso, la segunda corrida del día se registra con un correo que
   ya existe — y ahí aparece la trampa siguiente.
2. **Registrarse con un correo ya existente no muestra NADA.** El API devuelve **200** y reenvía
   la confirmación; la pantalla no muestra ni éxito ni error, y el cliente queda mirando el
   formulario lleno. Después el login rebota con `Invalid login credentials` y la cuenta ya no
   está en `auth.users`. **Es un hallazgo del producto, no del instrumento** — anotado en la cola
   de la plataforma.
3. **`token_hash=` no es `token=`.** El enlace de confirmación con `token_hash` contesta
   `400 "Verify requires a token or a token hash"`, que se lee exactamente igual que un proxy
   comiéndose la query — y estuvo a un paso de reportarse como "ningún cliente puede confirmar su
   cuenta". Con `token=` funciona. Se descartó con `curl` contra el endpoint real **antes** de
   escribir una línea del hallazgo.

---

## Vueltas anteriores: dos pasos dejaron de ser verdes y vacíos

Ayer el recorrido llegó entero por primera vez, pero **tres pasos daban OK sin haber probado
nada**. Al mirar las capturas aparecía el motivo, y no era del producto: era del instrumento.

### 1. Los pasos 6, 7 y 8 fotografiaban un modal, no el producto

`paso-06` y `paso-07` mostraban el modal **"Primeros pasos"** —`fixed inset-0 z-[60]`, 1440×900,
el **100 % del viewport**— cubriendo toda la pantalla. El script las declaraba OK igual, porque
`llegar()` comparaba la URL y ahí se detenía. Estar en `/billing` y no ver un píxel de `/billing`
pasaba por éxito.

Es el mismo pecado del falso verde anterior, una capa más arriba: antes no se miraba **dónde** se
estaba; ahora no se miraba **si se ve algo**.

Dos funciones nuevas, y la distinción entre ellas es el punto:

- **`despejar(page)`** aprieta el botón que ofrece el propio producto (**"Cerrar por ahora"**).
  No borra el nodo por JS: esconder un overlay con `display:none` probaría que sé usar JS, no que
  el cliente pueda salir de ahí.
- **`queTapa(page)`** cuenta lo que quede cubriendo ≥50 % del viewport. Sólo `fixed`: los
  `sticky` (cabecera, menú lateral) son parte del producto y no tapan nada.

Y `llegar()` ahora exige las dos cosas: `llego = (URL correcta) && !tapa`. Una pantalla que no se
ve **no cuenta como visitada**.

**El modal NO es un bug del producto** — `GuiaInicio.tsx:69` lo abre una vez por usuario y al
cerrarlo queda cerrado (`localStorage`). Lo ve siempre este script porque arranca con un contexto
de navegador limpio en cada corrida. Se verificó **antes** de reportarlo.

### 2. El paso 6 se llamaba "cargar un dato" y sólo abría la pantalla

Nunca creó nada. Y como no había dato, el paso 8 —*"¿aparece el dato del paso 6?"*— tampoco
comprobaba nada: abría el panel y reportaba OK. **Dos pasos de ocho, verdes sobre el vacío.**

Ahora el paso 6 carga un paciente de verdad y **la verificación no es haber apretado "Guardar"**:
vuelve a `/patients` y **lo busca en la lista**. Un formulario que se vacía y no dice nada se
parece muchísimo a uno que guardó.

Detalles que costaron un sondeo en vivo y que no se adivinan:

- El alta de paciente es una **página** (`<a href="/patients/new">`), no un modal. Se navega por
  el enlace que ofrece la pantalla, no por `goto` a la URL: si el producto mueve el botón, el que
  tiene que fallar es este paso, y un `goto` siempre acierta.
- **Los campos no tienen `name` ni `id`: sólo `placeholder`.** El único obligatorio es el nombre
  (`placeholder="Ej: Juan Carlos Mamani"`). Un relleno que busque por `name` no llena nada y
  envía el formulario vacío. Es la misma trampa que ya tenía `/register`.
- El botón es `save Guardar Paciente` (`type=submit`).

### 3. El aviso de limpieza enumeraba de menos

Decía sólo el correo. Desde que el paso 6 crea un paciente, un aviso que nombra sólo la cuenta
deja **basura anónima** en producción — y basura anónima ya no se puede borrar, porque no hay
cómo distinguirla de un dato real. Ahora lista cuenta · organización · paciente.

## El paso 8 dice algo que antes no podía decir

`/dashboard` **no muestra** el paciente. Eso **no es un fallo** y así se reporta: el panel no
lista pacientes, muestra otra cosa. El dato quedó guardado y visible en su propia lista, que es
lo que había que probar. Se distingue a propósito de un fallo real: si el paciente no apareciera
**en ninguna** de las dos, el paso 6 corta en rojo con "el producto no lo guardó, o no lo muestra".

## Lo que se escribió en producción, y cómo quedó

Estado antes: **4 organizaciones, 6 perfiles, 3 solicitudes reales, 0 filas `zz-qa-`**.
Seis filas creadas, impresas antes de tocarlas:

```
auth.users                 0de546e6-8912-44dd-95d0-ea9f8e022f19  zz-qa-2026-09-03@onia.com.bo
auth.identities            e193ed34-682d-4af2-a8b2-de8cb6ed9250  email
profiles                   cmtl6qkyd000e01khpbtj34y7             zz-qa-2026-09-03@onia.com.bo
organizations              cmtl6qky2000d01khy09fvmps             zz-qa-2026-09-03-negocio
organization_entitlements  cmtl6qkzy000g01kh497vu4m7             module.agents
patients                   cmtl70gds000l01khqp4cwigk             zz-qa-2026-09-03-paciente
```

Borradas **por id exacto**, en una transacción: `DELETE 1` seis veces, `COMMIT`. Recuento
posterior: **0 filas `zz-qa-`** en las cuatro tablas; **4 orgs / 6 perfiles / 3 solicitudes
reales** intactas. Nada quedó sin limpiar.

⚠️ El recuento dejó a la vista **1 paciente que NO es `zz-qa-`**: es preexistente y de otra
organización. **No se toca** — la regla es no tocar jamás una fila sin el prefijo.

El correo se confirmó a mano sobre **la fila `zz-qa-` y sólo esa**
(`update auth.users set email_confirmed_at=now() where email like 'zz-qa-%'` → `UPDATE 1`).
Queda dicho porque es un **salteo deliberado del instrumento**, no algo que haga un cliente: el
doble opt-in funciona y sin confirmar no se entra.

## Cómo se corre entero

**Una sola corrida**, y el rubro se elige por variable de entorno:

    node scripts/recorrido_cliente.mjs --escribir                          # dental (por defecto)
    RECORRIDO_RUBRO='Comercio / tienda' node scripts/recorrido_cliente.mjs --escribir

⚠️ **Acá decía que hacían falta DOS corridas** con un `update auth.users set email_confirmed_at`
en el medio. Ya no: el script abre **el mismo enlace de confirmación que se le manda al cliente**
(`confirmarComoElCliente`), que es lo que hace un cliente de verdad. Tocar `email_confirmed_at` a
mano sería fingir el paso que se está midiendo — y dejaría el doble opt-in sin medir nunca.

Y después **se borra en la misma vuelta**, por prefijo `zz-qa-` y contando lo que se borró:

    docker exec -i supabase-db psql -U postgres -d postgres   # ver el bloque de limpieza de arriba

⚠️ `docker exec` **va con `-i`**: sin él el heredoc no llega a psql, no borra nada y **sale sin
error**. Contar las filas después de borrar no es opcional.

⚠️ **La limpieza tiene que cubrir el rubro que se corrió.** El paso 6 crea un paciente en dental
pero un **producto + su variante** en comercio (`onia_commerce_products`,
`onia_commerce_product_variants`). Un borrado escrito para dental deja el producto vivo.

## Trampas del instrumento que siguen vigentes

1. **Los nombres de iconos en el texto NO son el bug del login.** El DOM de `/register` devuelve
   `dentistry`, `credit_card_off` como texto. Es una fuente de ligaduras: en la captura se ven
   los dibujos. El DOM sirve para sospechar; sólo la imagen confirma.
2. **El único campo con `name` es el honeypot** (`sitioWeb`). Los campos reales sólo tienen
   `placeholder` — en `/register` **y** en `/patients/new`.
3. **La segunda corrida vuelve a intentar el alta** con el mismo correo y el paso 3 dice OK
   igual (sólo mira que el formulario pida contraseña). Es ruido conocido, no un hallazgo.

## Estado del instrumento

`scripts/recorrido_cliente.mjs`. Lo que ya sabe hacer:

- **Despeja lo que tape la pantalla y falla si no puede.** Una pantalla cubierta no cuenta como
  visitada.
- **Carga un dato de verdad** en el paso 6 y lo busca de vuelta en la lista.
- **Completa el onboarding** y lo verifica por el efecto, no por los clics.
- **Exige llegar a donde pidió** (`llegar()`): un redirect no puede pasar por éxito.
- **Entra con la cuenta que acaba de crear**, no con una llave aparte.
- **Lee el motivo del rebote en la pantalla** cuando el login falla.
- **El corte es el paso que frenó el avance**, no el primero que no dio OK.
- **Enumera todo lo que creó** al terminar, para que la limpieza no deje nada anónimo.
- Captura con **scroll real** y con el **Chromium completo** (`channel: 'chromium'`), no el
  `headless_shell` que le inventó texto roto al canario durante tres días.
- Sale con código 0 aunque el recorrido se corte: "se corta en el paso 5" es el **reporte**.

**Lo que le falta, y es lo próximo:** correr el mismo recorrido con **otro rubro** (el alta
ofrece cinco; el script ya acepta `RECORRIDO_RUBRO="Comercio / tienda"`, pero nunca se probó — un
rubro encendido que rompe el onboarding es exactamente el fallo que nadie ve).
