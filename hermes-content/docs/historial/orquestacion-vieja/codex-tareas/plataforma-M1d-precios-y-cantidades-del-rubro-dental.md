---
id: plataforma-M1d
carril: plataforma
estado: pendiente   # pendiente | lanzada | PR | hecha | bloqueada
modelo: gpt-6.1-sol # la decisión de lectura ya está tomada (M1/M1b); aquí solo se cablea en las pantallas que faltan
repo: onia-platform
rama: codex/m1d-precios-y-cantidades-dental
base: master        # DESPUÉS de que entren M1b (#159) y M1c: usa `leerCantidad`, `<CantidadLeida>`, `leerMonto` y `<MontoLeido>`
pr:
escrita: 2026-10-11 por Hermes-Jarvis (nube), hallazgo E30 de la cola de hermes-jarvis, medido sobre master 54eedf10
actualizada: 2026-10-11 por Hermes-Jarvis (nube)
nota: Mismo error que Sergio Urcullo encontró en la caja («1.500» → Bs 1,50), en las pantallas del rubro dental (el primero en el orden de empuje) que M1 y M1b no cubrieron. Toca plata: revisión de dinero de Hermes antes de mergear.
---
# M1d · Precios y cantidades del rubro dental se leen una sola vez, como en la caja

Sos Codex. Trabajás SOLO en esta carpeta: un worktree de `onia-platform` que creó la madre, en la rama `codex/m1d-precios-y-cantidades-dental`.
- No uses git: ni consultas, ni cambio de rama, ni commits. La madre verifica la rama, corre `tsc` y la suite completa y abre el PR.
- Nadie contesta preguntas mientras corrés. Decidí con este documento y el código; lo que no puedas decidir, anotalo en el resumen final.
- Sin push, sin `npm install`, sin producción, sin red. **UTF-8 sin BOM y ningún carácter que no sea ASCII cambiado por `?`.**

## META (qué se midió, no qué se supone)
M1 y M1b hicieron que la caja, los productos y las compras lean «1.500» una sola vez. **Cinco campos de dinero o cantidad del rubro dental
siguen con `type="number"` y `parseFloat`/`Number`**, sin `leerMonto` ni `leerCantidad`.

Medido el 11-oct en Chromium con el idioma del navegador en español (el de un cliente en Bolivia), sobre un `<input type="number" step="0.01">`:

| Escribe | `input.value` | `Number()` / `parseFloat()` |
|---|---|---|
| `1.500` | `"1.500"` | **1,5** |
| `1,500` | `"1.500"` | **1,5** (el navegador cambia la coma por punto: se pierde lo que escribió) |
| `3.000` | `"3.000"` | **3** |
| `1,5` | `"1.5"` | 1,5 |

Sin avisos ni error: `min="0"` y `step="0.01"` aceptan 1,5. El punto de miles sale en pantalla en todos lados (`formatCurrency` muestra «Bs 1.500,00»), así que es
lo que el dueño escribe. **Y como `type="number"` normaliza lo escrito, la coma y el punto llegan iguales: no se puede leer bien un campo así.
El arreglo empieza cambiando el tipo del campo a texto con `inputMode="decimal"`**, como ya hacen `VentaForm` y `NuevaCotizacionForm`.

Los campos (líneas medidas en `master` `54eedf10`), de más a menos grave:
1. **Precio del tratamiento** — `app/(dashboard)/treatments/TreatmentsClient.tsx:94` (`price: parseFloat(form.price)`; el campo `servicio-precio` es `type="number"`,
   `:191-200`). Es el precio que usa cada factura de la clínica. Hoy la API recibe 1,5 y lo guarda; el dueño lo ve en la lista como «Bs 1,50».
2. **Línea manual de una factura** — `app/(dashboard)/billing/new/NewInvoiceClient.tsx:76` (cantidad) y `:78` (precio); los campos `cobro-manual-cantidad` y
   `cobro-manual-precio` son `type="number"` (`:232-250`).
3. **Ítem de inventario** — `app/(dashboard)/inventory/InventoryClient.tsx:98` (stock actual), `:99` (mínimo) y `:100` (costo), formulario de alta del ítem.
4. **Movimiento de inventario** — mismo archivo, `:132` (`quantity: Number(movement.quantity)`; el campo «Cantidad»/«Nuevo stock» es `type="number" min="0.01" step="0.01"`, `:374`).

Fuera de esta tarea (anotado, no se toca): `app/(dashboard)/rrhh/RrhhClient.tsx:154` (sueldo mensual) y `app/(dashboard)/empresa/EmpresaClient.tsx:70`, `:228`, `:345`
(montos y porcentaje de comisión): son los módulos Empresa y RRHH, no el corte comercial del rubro. Si una prueba existente los usa, no los cambies.

## Qué hacer
1. **Precio del tratamiento.** El campo pasa a `type="text"` con `inputMode="decimal"`. El valor se lee con `leerMonto(form.price)` (`lib/dinero/leer-monto.ts`); debajo del campo se muestra
   `<MontoLeido lectura={...} />` (`components/ui/monto-leido`), igual que en `EditarProducto.tsx:130`. Con motivo, el botón de guardar queda apagado con ese motivo y el campo
   marca `aria-invalid`. El placeholder pasa de `150.00` a `150,00` (el formato de Bolivia). Al **editar**, `price: String(t.price)` (`:58`) debe rellenar un texto que `leerMonto` lea igual:
   dos decimales como máximo con coma o punto (revisá que «1500.5» y «1500.55» se lean bien, y que un precio de 1000 o más no se quede con punto de miles).
   Al guardar se manda a la API el **número leído** (nunca `NaN`, nunca 0 salvo que el campo lo permita hoy). La API no cambia.
2. **Línea manual de factura.** Precio con `leerMonto` y `<MontoLeido>`. Cantidad con `leerCantidad(texto, "unidad")` (unidad entera) y `<CantidadLeida>`; **antes de decidir, leé `itemManual`**
   (`lib/cobros.ts:41`, lo importa el archivo): si hoy acepta cantidades no enteras, usá la unidad que conserve lo que hoy se acepta y anotá cuál. «Vacío» sigue siendo NaN, no 0 (el comentario de
   `:77` explica por qué: no colar una cortesía sin querer). El botón «Agregar» queda apagado con su motivo.
3. **Ítem de inventario (alta/edición).** Stock actual y mínimo con `leerCantidad(texto, unidad del ítem)`; costo con `leerMonto`. La unidad sale del propio ítem (`unit`, texto libre con «unidad» por defecto, `InventoryClient.tsx:97` y `:231`); la que `leerCantidad` no conozca cuenta
   como **desconocida** (un «N.NNN» se rechaza por ambiguo, igual que en M1b). `<CantidadLeida>` y `<MontoLeido>` debajo de cada campo.
4. **Movimiento de inventario.** La cantidad se lee con `leerCantidad(texto, unidad del ítem)`; «Nuevo stock» (ajuste) igual. El campo pasa a texto con `inputMode="decimal"`. El botón «Guardar» se apaga con el motivo.
5. **Un solo estilo de mensaje:** el que ya usan `leerMonto`/`leerCantidad` («Escriba 1500 si son mil quinientos, o 1,5 si es uno coma cinco»). No inventes textos nuevos de lectura.

## PRUEBA DE HECHO
Primero en **rojo con el código de `master`**; anotá cuáles fallaron.
- **Render de `TreatmentsClient`** con el formulario abierto: el campo `servicio-precio` es de texto (`type="text"`, `inputMode="decimal"`); «1.500» se lee 1500 y se ve «Se registrará Bs 1.500,00»;
  «1500,5» se lee 1500,50; «1.5» se lee 1,50; un texto con letras apaga el botón con su motivo. Y editar un tratamiento con precio 1500 abre el campo con «1500» (no «1.500» ni «1500.0»).
- **Render de `NewInvoiceClient`** (línea manual): «1.500» de precio manda 1500 al ítem; «3.000» de cantidad manda 3000; precio vacío no agrega (NaN, no 0).
- **Render de `InventoryClient`**: alta de un ítem con costo «1.500» manda 1500; stock «1.000» en unidad entera manda 1000; stock «1.000» con unidad desconocida apaga el botón con las dos lecturas;
  movimiento con cantidad «2.500» en una caja manda 2500.
- **Ninguna pantalla** de estas cuatro llama ya a `parseFloat` ni a `Number(` sobre el texto del campo (busca `parseFloat(form.` y `Number(form.`/`Number(manual.`/`Number(movement.` en los tres archivos).
- Los e2e que escriben en estos campos (`grep -rn "servicio-precio\|cobro-manual\|inventory" e2e`) siguen siendo válidos con campo de texto; si alguno hace `fill` de un número, anotá cuál.
- El trinquete del voseo en verde. **La línea base solo cambia en los VALORES: no reordenes ninguna clave** (el archivo está en el orden de `localeCompare("en")`; medido el 11-oct que tres PRs la reordenaron y chocaron entre sí).
- `npx tsc --noEmit` 0, eslint de lo tocado 0 y `npx vitest run` completo en verde.

## REGLA DE PARADA
- **Sin cambios de servidor:** ni migraciones ni APIs. Los esquemas siguen recibiendo `number`.
- **Veredictos fijos:** no cambies los de `leerMonto`, `leerMontoUsd` ni la tabla de `leerCantidad`. Si una prueba de M1, M1b o M1c se pone roja, pará y anotalo.
- No toques Empresa ni RRHH, ni el cálculo de facturas, ni lo que ya lee con `leerMonto` (caja, productos, compras, fiados).
- Dos intentos: si después de dos intentos algo sigue rojo por una causa fuera de esta lista, pará y anotalo.

## ARCHIVOS
Puede editar: `app/(dashboard)/treatments/TreatmentsClient.tsx`, `app/(dashboard)/billing/new/NewInvoiceClient.tsx`, `app/(dashboard)/inventory/InventoryClient.tsx`, sus pruebas (nuevas o existentes: solo el texto/valor esperado),
`__tests__/voseo-ratchet.linea-base.json` (solo valores) y, si hace falta, un helper de lectura **compartido** en `lib/` que reutilice `leerMonto`/`leerCantidad` (no un lector nuevo). Todo lo demás, prohibido.

## Entrega
«PARA LA MADRE:» con los archivos; los números de `tsc`, eslint y vitest; las pruebas que se pusieron rojas con `master`; la unidad elegida para la cantidad de la línea manual y por qué; y lo que no pudiste decidir.
