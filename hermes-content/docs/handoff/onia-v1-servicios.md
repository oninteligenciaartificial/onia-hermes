# Handoff — carril `claude/onia-v1-servicios-98acde` (paso 1 del alcance 1.0)

> Formato: `hermes-content/docs/handoff/README.md`. Se sobrescribe; es el estado ACTUAL.
> Última escritura: **2026-09-04 ~19:45 La Paz** (23:45 UTC). Horas en La Paz.

---

## Objetivo

Cerrar el paso 0/1 del alcance: **que el rubro Servicios profesionales entregue lo que su
propia tarjeta de `/register` promete** — «Agenda, citas, cobros y contabilidad» — o que el
alta deje de prometerlo.

**Hecho** = un dueño solo hace el recorrido entero mirando la pantalla. **Cumplido**, y
verificado dos veces contra producción con cuenta nueva.

---

## Qué quedó EN PRODUCCIÓN

**Dos despliegues, los dos con gates 5/5 y 0 errores en el log.**

| sha | BUILD_ID | Hora (La Paz) | Qué |
|---|---|---|---|
| `70d3250` | `t5-KwVFrE3FZrh0jB6mwv` | 19:06 | el arreglo + «Opciones avanzadas» |
| `3e20395` | `9X-BgT5SOWNyPCCHLUWvH` | 19:33 | 🔴 la regresión que el primero metió |

Backups vivos: `runtime-next.bak-20260904T230653Z` (el build viejo `3606c46`) y
`runtime-next.bak-…T2333xxZ`. Rollback = `mv` del backup a `runtime-next` + `docker restart`.

Lo que ahora funciona, medido MIRANDO cada pantalla en `app.onia.com.bo`:

- **Cobrar un servicio.** `POST /api/comercio/ventas` → **201**, «Venta registrada:
  Bs 1.200,00 en Efectivo». Antes: **422 «Stock insuficiente: disponible 0, solicitado 1»**.
- **Pantalla de Clientes** en el menú del rubro, con lista, alta, ficha y edición.
- **El alta del catálogo habla de servicios**: nombre y precio, SKU derivado del nombre.
- **El panel dejó de mentir**: «0 PRODUCTO(S) SIN STOCK», «Stock crítico 0», y
  «Lo más vendido hoy · Auditoría interna · 1 servicio».
- **La ficha del cliente no pide tipo de sangre** ni ofrece alertas médicas, alergias,
  contacto de emergencia, historia clínica ni tratamientos a un estudio contable.

Suite **2954** (35 tests nuevos), typecheck limpio. Datos QA borrados; las 5 orgs reales
intactas (+ `zz-qa-2026-09-04-2209-negocio`, que **no es mía**: la crea el loop
`recorrido-cliente`).

---

## Qué quedó a medias, y dónde

**Nada de este carril.** La rama `claude/onia-v1-servicios-98acde` está mergeada a `master`
por fast-forward y desplegada.

Sigue en pie, de otros carriles: **`feat/panel-tres-renglones` espera el «ok panel» de
Sergio** — no se tocó y no se desplegó.

---

## Archivos y cambios

- **`lib/comercio/servicios.ts`** (nuevo) — `UNIDAD_SERVICIO`, `esServicio(unit)` y
  `unidadDelAlta(...)`. **Es el corazón**: una fila del catálogo con `unit = "servicio"` no
  mueve stock. Cero migración: `unit` ya existía y ya viajaba en todas las consultas.
- **`lib/platform/vertical-pack.ts`** — dos predicados DERIVADOS del pack, misma doctrina que
  `usaPanelComercio`: `llevaInventario` (el rubro que maneja stock declara
  `/comercio/inventario` en su nav) y `fichaClinica` (el rubro clínico declara `/treatments`).
  Más la entrada `/patients` con label «Clientes» e icono `group` en `SERVICIOS_NAV_ITEMS`.
- **`lib/comercio/ventas.ts`** — `registrarVenta` salta `registerStockMovement` en las líneas
  de servicio. **El control de stock de la mercadería no se toca**: un producto en cero sigue
  frenando la venta, con test.
- **`lib/platform/api-route-registry.ts`** — `patients/*` pasa a `CON_AGENDA`. La unidad del
  gate es el SEGMENTO, así que abrir la pantalla obliga a declarar todo lo que cuelga de
  `patients`; el test de coherencia lo exige.
- **`app/(dashboard)/comercio/NewProductForm.tsx`** — modo servicio + «Opciones avanzadas».
- **`app/(dashboard)/patients/[id]/page.tsx`, `new/`, `[id]/edit/`** — los bloques clínicos
  detrás de `esClinico`.
- **`capturas-servicios/recorrido.mjs`** (en el worktree, sin commitear) — el recorrido entero
  automatizado. `BASE_URL=https://app.onia.com.bo node capturas-servicios/recorrido.mjs <sello>`
  deja 9 PNG. Necesita `.env.local` con `DIRECT_URL` por túnel SSH.

---

## Intentos fallidos — lo que NO hay que repetir

- 🔴 **El grep del bundle dio verde sobre código que no funcionaba.** El gate post-swap
  confirmó «`esServicio` presente», «`Opciones avanzadas` presente»… y el cobro seguía dando
  422. El símbolo estaba; la lógica no corría. **Un grep prueba que el código viajó, nunca
  que hace lo que dice.** Lo cazó correr el recorrido entero CONTRA PRODUCCIÓN después del
  swap — no el gate.
- 🔴 **La causa de esa regresión: un campo con valor por defecto gana un `||`.**
  `unit: form.unit.trim() || (esServicio ? …)` no marcaba NUNCA, porque `form.unit` arranca
  precargado en `"unidad"` y jamás es vacío. Por eso la decisión salió del JSX a una función
  pura con tabla de verdad (`unidadDelAlta`): **una decisión escrita dentro de un ternario en
  JSX no tiene dónde probarse.**
- 🔴 **Verificar contra el dev server local puede mentir por los DATOS, no por el código.**
  El servicio de prueba local lo había creado la versión anterior del formulario, así que ya
  tenía `unit = "servicio"` y el cobro pasaba. En producción, con una cuenta nueva, no.
  **Cuenta nueva o no es verificación.**
- **El parte de entrada tenía un dato vencido:** «la cita abre con 0 opciones y frena con un
  globo del navegador en inglés» ya estaba arreglado por el deploy `3606c46` (14:12 del
  4-sep); la medición se hizo antes de ese swap. La agenda funcionaba. Lo que sí estaba roto
  —y no figuraba en la lista— era el **cobro**.
- **Un `required` dentro de un `<details>` cerrado da «An invalid form control is not
  focusable»**: el botón no hace nada y no se ve por qué. Es la misma familia que el globo del
  navegador del modal de citas. Por eso el SKU es `required={!modoServicio}`.
- **`setsid nohup … &` sobre SSH corta la sesión antes de devolver.** El build se lanza igual
  y sigue solo; se confirma con `pgrep -af build-<sha>` y el log, no con la salida del comando.
- **No hace falta backfill.** Se midió: ninguna org real tiene productos de comercio cargados.
  Si aparece una cuenta vieja de servicios, la sentencia es una sola y está probada:
  `update onia_commerce_products set unit='servicio' where unit='unidad' and organizationId
  in (…rubro sin inventario…) and not exists (…stock_items con quantity <> 0…)`.
- **`.env.local` local es seguro; en el VPS es la trampa.** El build corre de un `git archive`
  y el script aborta si encuentra cualquier `.env*`. Igual se borró al terminar.

---

## Qué depende de Sergio

1. 🔴 **«ok panel»** — `feat/panel-tres-renglones` sigue esperando. Sin eso no se publica.
2. Mergear y desplegar `fix/venta-honesta` (repo `onia-hermes`), o decir que no.
   **Hasta entonces no se le escribe a ningún lead.**
3. Los 7 mensajes a leads · conectar su WhatsApp (1 clic) · credenciales del BCP ·
   Punto de Venta 1 en el SIN.

---

## Próximos pasos, en orden

1. **Comercio tiene el mismo agujero de clientes.** Su tarjeta de `/register` promete
   «Catálogo, inventario, caja y **clientes**» y no tiene la pantalla. Ojo: su gente vive en
   `OniaCoreBusinessPartner` (los fiados), no en `Patient` — no es copiar y pegar lo de
   servicios. *Listo = el recorrido se hace solo, o la tarjeta deja de prometerlo.*
2. **El recibo imprimible.** `/print/receipt` lee la tabla `Payment` del pack dental; comercio
   usa `OniaCommercePayment`. Es una ruta nueva. *Listo = una venta de caja se imprime.*
3. **El cliente del fiado no aparece en la cita.** Dos tablas de clientes conviviendo
   (`Patient` y `OniaCoreBusinessPartner`). Unificarlo es una pieza propia, y hoy nadie choca
   con ella porque el recorrido no pasa por fiado. *Listo = el que fía aparece en el selector.*
4. Seguir el alcance: paso 2 (panel de inicio), 3 (cobros), 4 (contabilidad), 5 (velocidad).

---

## Anotado, no perseguido (pedidos que llegaron a mitad de sesión)

Sergio: *"en caso de que te empiece a tirar demasiadas cosas… solo anótalas, pero vamos por una
versión cien por ciento funcional"*. Van acá y no al código:

- **Agentes y conexiones de recursos** → escrito en `hermes-content/docs/ONIA_AGENTES_Y_CONEXIONES.md`.
  Dos supuestos suyos resultaron falsos al medirlos, y cambian el plan: **el chatbot SÍ funciona
  hoy** (una sola clave de OpenAI, la de Sergio, para todos los clientes — es un costo que crece
  con cada venta, no una función que falte), y **los agentes ya existen y son deterministas**
  (SQL + plantilla, cero IA) — lo que falta es que propongan algo: 40 corridas, 0 propuestas.
  De todo eso, a la 1.0 entran **tres cosas** y ninguna es construir un agente nuevo.
- **`recorrido-cliente` y `lucia-cierre` siguen gastando OpenAI** (8 y 1 corridas por día).
  Se le preguntó si se apagan también; sin respuesta todavía.
- **`web-factory-dev` figura pausado pero su log se toca.** Puede ser el sincronizador. Sin
  perseguir.

---

## Notificaciones de Hermes — APAGADAS el 2026-09-04 ~21:50 La Paz

Pedido de Sergio: *"cancelemos las notificaciones de Hermes, me está quemando tokens de OpenAI"*.

- **Los 15 trabajos programados de Hermes → `pause`.** Eran las notificaciones: 13 entregaban
  por Telegram solos (estado operativo diario, plan de video, agenda de la semana, prospección
  del martes…). Cada uno levantaba un agente con skills contra OpenAI vía el proxy `litellm`.
  Nada borrado: `hermes cron resume <id>` los devuelve. ⚠️ **`hermes cron list` sin `--all` no
  muestra los pausados y dice "No scheduled jobs"** — parece que se borraron y no.
- **`hermes-vigia.sh` (cron horario) → comentado**, con el motivo al lado. Llamaba al LLM y ya
  no tiene trabajos que vigilar. Se reactiva JUNTO con los jobs.
- **NO se tocó** el gateway de Telegram entrante (es su canal, responde cuando él escribe) ni la
  clave del producto (el chatbot que se vende; 0 llamadas en 24 h, no era el gasto).

🔴 **Error propio, y cómo terminó:** al comentar la línea del vigía, un `sed` con `#` de
delimitador Y `#` en el reemplazo falló, y como el pipe siguió, **`crontab -` recibió vacío y
borró las 82 líneas**. Se detectó en la verificación siguiente y se restauró del respaldo hecho
un segundo antes; ninguna corrida se perdió (01:50 UTC, la próxima tarea era 04:09). La segunda
vez: construir el crontab en un archivo, **verificar antes de instalar** (líneas, loops activos,
línea apagada) y recién ahí `crontab archivo`. **Nunca `algo | crontab -` sin comprobar la
salida del `algo`.**

Estado de los loops de Claude: **7 activos, 8 pausados**, intactos.

---

## Regla nueva que salió de esta sesión

**Simple primero, avanzado OPCIONAL — esconder no es borrar.** Dicho por Sergio Urcullo
corrigiendo el primer intento, que había ELIMINADO SKU, unidad, stock, costo y lote del alta
de servicios: *«que siempre sea lo más fácil y simple de entender, opcionales funciones
avanzadas»*. Un estudio que además vende un libro se quedaba sin poder llevarle stock.
Ahora van detrás de un `<details>` cerrado — mismo patrón que «Configuración avanzada».
