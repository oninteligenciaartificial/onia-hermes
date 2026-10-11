estado: pendiente
modelo: gpt-6.1-sol
carril: plataforma
origen: el MEDIUM y los tres LOW de Hermes E26 sobre #159 = M1b (onia-hermes `claude/adoring-ramanujan-7sjzwv`, docs/cola/loop/hermes-jarvis.md §E26). Pedido de la madre del 11-oct. Escrita el 11-oct por Plataforma (session_01HhnFgkeF6nLGvjrfjt1o2C); líneas medidas en `master` `0b25e289`. Va después de que #159 entre a `master`.
decisión: la de M1b, sin cambios. Una cantidad con dos lecturas posibles se rechaza con su motivo; con una sola, se acepta y se muestra. Se usan `leerCantidad` y `<CantidadLeida>` de M1b: no se escribe un lector nuevo.

# M1c · Las tres cantidades que quedaron con `Number()` se leen como el resto

Sos Codex. Carpeta `C:/dev/proyectos/onia-platform-codex-m1c`. La madre la prepara desde `origin/master` con #159 (M1b) adentro y te pasa
el SHA base. No hagas git: la madre revisa, corre `tsc` y la suite completa, commitea y abre el PR.

## META
M1b dejó una sola lectura de cantidades, pero tres formularios siguen con `Number()`. Ahí «3.000» pasa como 3 sin aviso. «1,500» da
`NaN` y se bloquea, pero «1.500» pasa en silencio:
1. **Cotización de importadora:** `app/(dashboard)/importadora/cotizaciones/NuevaCotizacionForm.tsx:52` y `:67`.
   - Es la cantidad de cada línea, y el total de la vista previa y de la cotización sale mil veces corto.
   - Importadora es el rubro que sigue en el orden de empuje (dental → importadora), y 3.000 unidades ahí es una cantidad normal.
   - En `:76`, los días de validez se leen igual.
2. **Traspaso entre almacenes:** `app/(dashboard)/comercio/almacenes-panel.tsx:153` y `:262`. «1.500» mueve 1,5.
3. **Línea de venta:** `app/(dashboard)/comercio/caja/VentaForm.tsx:100`.

Los LOW de E26:
4. **Coma con tres decimales:** «1,250» kg se rechaza con «La coma de miles no se usa en Bolivia…». En Bolivia, «1,250 kg» es
   1,25 kg, así que el rechazo es seguro pero el mensaje empuja a escribir «1250».
5. **Precio del alta por nombre:** `app/onboarding/pasos/paso-servicios.tsx` guarda el precio editado por **nombre** del servicio, así que
   dos servicios con el mismo nombre comparten el texto.
6. **TCO con cuatro decimales:** «6,9600» se rechaza con el mensaje de miles de `leerMonto`. Algunos bancos publican el tipo de cambio
   con cuatro decimales.

## Qué hacer
1. **Cotización:**
   - la cantidad de cada línea se lee con `leerCantidad(texto, unidad del producto)` y muestra `<CantidadLeida>` debajo;
   - los días de validez se leen como cantidad entera;
   - con motivo, el botón se apaga con `disabledReason`, y la cotización nunca se arma con `NaN` ni con 0;
   - el total de la vista previa usa la cantidad leída.
2. **Traspaso:** la cantidad se lee con la unidad de la variante elegida y muestra `<CantidadLeida>`. El botón se apaga con su motivo en
   vez de `!(Number(qty) > 0)`.
3. **Venta:** la cantidad de la línea se lee con la unidad del producto y muestra `<CantidadLeida>`.
4. **El rechazo de «coma con tres decimales»** en una unidad fraccionaria o desconocida usa el mismo formato de dos lecturas que el
   punto. Por ejemplo, para «1,250»: «Escriba 1250 si son mil doscientos cincuenta, o 1,25 si es uno coma veinticinco». Se sigue
   rechazando; solo cambia el mensaje. En unidades enteras queda como está.
5. **`paso-servicios`** guarda el precio editado por un identificador estable de la fila (índice o id), no por el nombre.
6. **TCO:** `leerTco` acepta hasta 4 decimales con coma o punto, sin miles, y redondea a 2 con la misma regla de enteros del CSV
   (`Math.round(unidades / 100)`). «6,9600» → 6,96; «6.9649» → 6,96; «6.9650» → 6,97. El tope de 1 a 100 Bs por USD no cambia.

## PRUEBA DE HECHO
Primero en rojo con el código de `master`; anotá cuáles fallaron.
- **Render de `NuevaCotizacionForm`:**
  - «3.000» en un producto con unidad entera manda 3000 y el total lo refleja;
  - «3.000» con unidad desconocida apaga el botón con el motivo de las dos lecturas;
  - la validez «1.000» no pasa como 1.
- **Render de `almacenes-panel`:** «1.500» de una variante en bolsas manda 1500; «1,5» en bolsas apaga el botón con su motivo.
- **Render de `VentaForm`:** «1.500» en unidad entera suma 1500 a la línea, y se ve «Se registrarán 1500 …».
- **`leer-cantidad.test.ts`:** «1,250» en kg da el mensaje de dos lecturas; «0,250» en kg sigue aceptándose.
- **`paso-servicios`:** dos servicios con el mismo nombre guardan precios distintos.
- **`leerTco`:** «6,9600» → 6,96; «6.9650» → 6,97; «6.960» se sigue rechazando con el motivo del tope.
- El gate de usted y el trinquete del voseo en verde.
- `npx tsc --noEmit` 0, eslint de lo tocado 0 y `npx vitest run` completo en verde.

## REGLA DE PARADA
- **Sin cambios de servidor:** ni migraciones ni APIs. Los esquemas del servidor siguen recibiendo `number`.
- **Veredictos fijos:** no cambies los de `leerMonto` en bolivianos, ni los de `leerMontoUsd`, ni la tabla de M1b. Si una prueba de M1,
  M1b o la caja se pone roja, pará y anotalo.
- **Dos intentos:** si después de dos intentos algo sigue rojo por una causa fuera de esta lista, pará y anotalo.

## Entrega
Sección «PARA LA MADRE:» con:
- los archivos;
- los números de tsc, eslint y vitest;
- las pruebas que se pusieron rojas con `master`;
- cómo quedaron la unidad de cada formulario y el mensaje de la coma.
