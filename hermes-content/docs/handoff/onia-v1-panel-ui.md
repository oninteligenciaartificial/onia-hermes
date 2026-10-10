# Handoff — carril panel / UI / usuarios / pricing de la 1.0

> Última edición: **2026-09-05**, cierre de la sesión de *usuarios y pricing*.
> Rama `feat/panel-saludo-botones` en `onia-platform` (worktree `master-panel-temp`).
> **19 commits, todos pusheados. Nada en vuelo.**
>
> Un archivo por carril, sin fecha en el nombre: esto se EDITA, no se duplica.
> El cierre anterior (16 commits de panel/lienzo/asistente) está en el §7.

---

## 1. Objetivo de esta sesión

**Cerrar usuarios y pricing de la 1.0**, con tres condiciones que puso Sergio Urcullo
al arrancar y que esta vez sí se cumplieron:

1. Invocar `onia-router` primero, y después `onia-backend` (lib/ y rutas),
   `onia-seguridad` (permisos, pricing, cobros) y `onia-chatbot` (cupo).
2. Pasar **`security-reviewer`** sobre los cinco archivos que la sesión anterior
   escribió sin revisar.
3. Leer el §3 (lo que no se cumplió) y el §7 (lo medido) del handoff anterior.

**Definición de "hecho" que se usó:** los hallazgos de seguridad triados y los
CRITICAL/HIGH arreglados · el número de usuarios cuenta UNA sola historia entre
copia pública, panel y enforcement · las decisiones de precio que dependen de
Sergio Urcullo listadas con su medición, sin volver a investigarlas · suite y
typecheck verdes.

---

## 2. ⚠️ Qué quedó en producción: **NADA**

Se dice primero porque es la regla que más caro sale olvidar. La rama tiene 19
commits pusheados y **no está mergeada a `master`**, y aunque se mergeara todavía
haría falta el deploy al VPS. Con el criterio del repo — *encendido en producción
y verificado ahí* — el valor entregado a un cliente hoy es **cero**.

Lo que sí está: el trabajo terminado, con gates verdes, esperando la decisión de
mergear (§6).

---

## 3. Seguridad: la revisión que faltaba, y qué salió

`security-reviewer` sobre `lib/ayuda/datos-query.ts`, `app/api/ayuda/route.ts`,
`lib/comercio/{clientes,recibo}.ts` y `lib/asientos.ts`.

**Cero CRITICAL.** El scoping por `organizationId` y el permiso de finanzas
estaban bien hechos. `lib/comercio/recibo.ts` salió citado como buen ejemplo de
defensa en profundidad contra IDOR (repite el filtro de organización aunque los
ids ya vengan de registros escopados, y un `pagoId` ajeno devuelve `null` sin
distinguir "no existe" de "no es tuyo").

Los cuatro hallazgos, **todos arreglados** en `f05b2fc`:

| Sev | Qué | Arreglo |
|---|---|---|
| HIGH | `POST /api/ayuda` sin rate limit. Pedía sesión y nada más, y cada pregunta dispara varias queries (sumas de facturas y pagos, conteo de citas, inventario). Cualquier usuario autenticado podía repetirlo en loop contra la base compartida entre organizaciones. | Límite por organización, 30/min — mismo eje y patrón que `checkChatbotOrgLimit` |
| MEDIUM | La rama `stock_bajo` traía el inventario ENTERO de la org y filtraba en JS | La comparación la hace Postgres con una referencia de campo de Prisma (los dos son `Decimal(10,2)`). Sin `take` arbitrario, así que tampoco se pierden ítems |
| MEDIUM | El `catch` relanzaba todo lo que no fuera Zod ni Auth: no llegaba a Sentry y la respuesta no tenía la forma `{ error }` del resto de la API | `captureSentryError` + 500 |
| LOW | La pregunta sin respuesta se logueaba tal cual, y es texto libre que puede traer un teléfono o un monto de un tercero | Se redactan las corridas de 4+ dígitos |

⚠️ **Un dato del informe estaba mal y no se copió:** dice que `lib/asientos.ts`
"no está conectado a ningún route handler" porque su `grep` solo lo encontró en
el test. Es falso — `components/plan/AsientosCard.tsx` lo importa y
`app/(dashboard)/team/page.tsx` lo renderiza. No cambia el veredicto (es una
calculadora pura), pero **el informe de un subagente también se verifica**.

---

## 4. Usuarios: el mismo número contado de tres formas distintas

Este era el defecto de fondo, y es la regla que más se rompe en el repo — una
sola fuente de verdad por tema.

**`basicMaxSeats: 3` cuenta asientos EXTRA, no el total.** `lib/asientos.ts`
(nuevo, sin revisar) lo leyó como total. Resultado, tres lecturas vivas a la vez:

| Fuente | Qué decía de Básico |
|---|---|
| `pricing.ts` — copia pública y de admin | "hasta **3 usuarios extra**" → 5 en total |
| `plan-limits.ts` + `checkUserLimit` | `2 + extraUserSeats (máx 3)` = **5 en total** |
| `asientos.ts` → tarjeta de `/team` | tope **3 en total** → vendía 1 extra |

O sea: la página de precios le vendía 5, el sistema se las dejaba crear, y el
panel nuevo le avisaba "llegaste al máximo" en la 4ta **mientras le cobraba un
extra en la misma tarjeta**. El archivo nuevo era el único equivocado, así que se
corrigió ese y no la promesa (`3a32dc9`).

Y había dos huecos más, del mismo número:

- **`PlanClient.tsx` tenía su propia copia a mano de la tabla de límites** — la
  que dibuja la barra "Usuarios activos 4 / 5". Existía porque es `"use client"` y
  `lib/plan-limits.ts` importa prisma. Se sacó el catálogo puro a
  `lib/plan-catalogo.ts` (sin prisma) y ahora las dos leen de ahí; `plan-limits.ts`
  lo reexporta, así que ningún importador se tocó (`a48a720`).
- **El tope se mostraba y no se aplicaba al OTORGAR.** El operador podía darle 10
  asientos a un Básico desde `/admin/plans` y `checkUserLimit` los aceptaba. Ahora
  `maxAsientosExtra()` es el único lugar que dice cuántos vende cada plan, y lo
  consumen los tres lados: la API lo valida y **rechaza con el número del plan**
  (no recorta en silencio, y no toca lo ya otorgado), el input del panel lo usa
  como `max` — tenía un `max={20}` inventado —, y la barra de uso muestra
  exactamente lo que aplica el enforcement (`f05b2fc`).

Quedaron dos guards que antes no existían: el tope mostrado se compara contra el
que aplica `checkUserLimit`, y otorgar el máximo tiene que dejar a la
organización justo en el tope que ve en `/team`.

---

## 5. Pricing: qué se tocó y qué NO

**No se cambió ni un precio.** Se barrió la superficie buscando la clase de bug
de los "cuatro precios vivos" y **no hay divergencias**: los únicos `390` sueltos
son anchos de viewport y los `1500` son topes de pacientes.

### El hallazgo nuevo, y por qué no lo cambié solo

`lib/subscription/plan-state.ts` — el docstring de `planAccessLevel` promete:

> *«`past_due` conserva acceso completo mientras dure la gracia — un pago que
> entra un día tarde no puede dejar a la clínica sin agendar.»*

**El código no hace eso para el que paga.** `graceDeadline()` devuelve `planEnd`
tal cual: la gracia de `GRACE_PERIOD_DAYS = 1` es **sólo del trial**. Un contrato
pago pasa a solo-lectura **el mismo instante** en que vence.

Y está **testeado a propósito** (`plan-state.test.ts`): *«la gracia es SOLO del
trial: un contrato pago corta el día que vence… no se le regala un día extra a
quien deja de pagar teniendo contrato»*. Es una decisión tomada, no un descuido —
por eso **no la toqué**.

Pero choca de frente con lo que ya está medido en este mismo carril: **el QR del
BCP es `singleUse` y no sostiene recurrencia**, así que la suscripción es cobro
*asistido* — cada mes el cliente tiene que hacer algo. La política está escrita
para un cobro automático, donde no pagar significa intención de irse. Con QR
manual, atrasarse unas horas es **el caso normal**, no la excepción. Y
`ONIA_PSICOLOGIA_PRECIOS_COMPETENCIA.md` §3.3 dice que ninguno de los siete
competidores corta en seco sin aviso (Framer da un mes; Lovable hace rollover).

⚠️ **El handoff anterior apuntaba al sujeto equivocado.** Decía "falta el mes de
gracia" en el párrafo del **cupo del chatbot** — y el cupo no corta el producto,
deriva la conversación a una persona. El que sí corta en seco es el **contrato
pago**, y corta la escritura del sistema entero.

---

## 6. Lo que depende de Sergio Urcullo

Lo de arriba está cerrado. Esto no, y **ninguna de las cinco se puede decidir sin
él** — las tres primeras ya venían de la sesión anterior, con su medición hecha:

1. **Mergear `feat/panel-saludo-botones` a `master`** (19 commits pusheados,
   3.010 tests verdes, typecheck limpio) y después deployar. Hasta eso, §2: nada
   en producción.
2. **Confirmar o cambiar la recarga de Bs 190.** Sigue **sin ancla de mercado**:
   ningún competidor vende recargas de conversaciones. Lo fundado es la relación
   (22 % más cara que lo incluido, para que el excedente recurrente empuje a
   escalar); el monto exacto, no.
3. **Decidir el eje del cargo de Bs 70 por usuario.** Ahora se VE bien y se aplica
   parejo, pero sigue vivo — y ningún competidor local cobra por cabeza (Growing
   Cloud: usuarios ilimitados; Sintic: no cobra asientos; Xmart: por canal).
   Mantenerlo, sacarlo, o cambiarlo por facturas / sucursales / canales.
4. **El chatbot a Bs 390 contra Xmart** (Bs 177 QR / Bs 296 Meta API). El ancla es
   Xmart, no ManyChat.
5. **La gracia del contrato pago (§5).** Hoy son 0 días para el que paga, con un
   rail de cobro que exige una acción manual cada mes. Si va a cambiar, el número
   es decisión suya.

---

## 7. Intentos fallidos y callejones de este cierre

- **Mi primer arreglo mentía para el otro lado.** En `PlanClient` puse
  `Math.min(incluidos + otorgados, tope)` para que la barra respetara el tope.
  Estaba mal: para una organización con más asientos otorgados que el tope, la
  barra habría mostrado un límite **más bajo** que el que el sistema realmente
  aplica. Se revirtió: **el número que se muestra es exactamente el que se
  aplica**, y el tope se hace valer donde se OTORGA, no donde se dibuja.
- **Se rechaza en vez de recortar.** La primera opción para el tope al otorgar era
  clampear en `checkUserLimit`. Se descartó: le sacaría asientos en silencio a una
  organización que ya los tenía. Rechazar en la API no toca nada de lo existente.
- **`take: 1000` en la query de stock bajo, descartado.** Era lo que sugería el
  informe, pero un catálogo grande habría perdido ítems sin avisar. Prisma compara
  columnas del mismo modelo con una referencia de campo, así que el filtro se fue
  a Postgres sin perder nada.
- **El handoff de este carril no estaba en `main`**: vivía sólo en la rama
  `claude/handoff-panel-ui`, sin mergear. Un handoff que no se puede encontrar
  desde `main` casi no existe. Este archivo ya está en la rama de la sesión.
- **Trampa de la sesión anterior que se pagó de nuevo:** `npm install` propio en
  el worktree `master-panel-temp` (Turbopack rechaza el junction de
  `node_modules`). Sigue siendo detached de `master`; **limpiarlo recién después
  del merge**.

### Del cierre anterior, que sigue valiendo

- `prefers-color-scheme` no cambia el tema: es la clase `.dark` (`globals.css:311`).
- El atajo `/` se pierde ~1 s tras cargar (lo instala un efecto de React); "la
  barra es visible" no sirve como señal de hidratación.
- **Un número que no reacciona a la variable que estás cambiando no es un
  resultado: es un bug de medición** (tres mediciones falsas del contraste antes
  de la buena).
- El panel es **el que ya está en producción**: `feat/panel-tres-renglones` y el
  mockup minimal quedaron descartados, y `ONIA_V1_ALCANCE.md` (hoy `ONIA_1.0_CORTE.md`) punto 3 quedó viejo
  por eso.

---

## 8. Defectos anotados y NO arreglados (fuera del objetivo)

Se anotan, no se persiguen — la regla del objetivo único.

- `run-turn.mjs:173` tiene `gpt-4o-mini` de default y producción corre
  `gpt-4.1-mini` por env: **un deploy sin esa variable cambia el modelo del bot en
  silencio.**
- El docstring de `planAccessLevel` **promete una gracia que el código no da al
  que paga** (§5). Aunque no se cambie la política, el comentario miente y manda
  al revés a la próxima sesión.
- El panel de inventario filtra el stock bajo en memoria igual que lo hacía
  `datos-query.ts`. Se arregló sólo el que estaba en revisión.
- `lib/pricing.ts` dice que las 500 conversaciones «ya no acotan ningún costo
  nuestro». Quedó **falso** con `lib/chatbot/cupo.ts`.
- `ONIA_AGENTES_COSTO_API.md`: Higgsfield figura **sin número** en el gasto fijo.
- El asistente promete «te enseño cómo hacer cualquier cosa dentro del sistema» y
  sabe 30 temas más 4 datos. Sergio Urcullo lo eligió sabiéndolo.
- Dos snapshots modificados sin commitear en el worktree `v1-panel` (otro carril).

---

## 9. Próximos pasos, en orden

1. Sergio Urcullo mergea (§6.1) y se deploya. Recién ahí el §2 deja de decir "nada".
2. Con el merge hecho, limpiar el worktree `master-panel-temp`.
3. Las cuatro decisiones de precio del §6 (2 a 5). Ninguna necesita más
   investigación: la medición ya está y está citada acá.
4. Si la gracia del §6.5 cambia, el único archivo a tocar es `graceDeadline()` en
   `lib/subscription/plan-state.ts`, y hay que dar vuelta el test que hoy fija el
   corte en seco.
