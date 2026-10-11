estado: hecha (PR #156, cabeza `4dd41d1c`; Hermes E19 OK; se mergea con CI verde). Los LOW siguen en M1b.
modelo: gpt-6-astra (plata)
carril: plataforma
origen: MEDIUM de producto de la revisión E4 de Hermes sobre #147 (onia-hermes `claude/adoring-ramanujan-7sjzwv` 687266e5, docs/cola/loop/hermes-jarvis.md §E4). Escrita el 11-oct por Plataforma (session_01HhnFgkeF6nLGvjrfjt1o2C); líneas medidas en `master` `fd72cd55`.
decisión: Plataforma, 11-oct. Regla: «un monto ambiguo nunca se lee en silencio» y todo campo muestra el monto leído. En bolivianos, formato es-BO más el punto decimal; en dólares, sin miles. Si Sergio Urcullo prefiere otra convención, se cambia solo `lib/dinero/`.

# M1 · Ningún formulario lee un monto ambiguo en silencio: bolivianos con `leerMonto`, dólares sin miles

Sos Codex. Carpeta `C:/dev/proyectos/onia-platform-codex-m1`. La madre la prepara desde `origin/master` (`fd72cd55` o
posterior) y te pasa el SHA base. No hagas git: la madre revisa, corre `tsc` y la suite completa, commitea y abre el PR.

## META
La misma app lee los montos de dos maneras:
- **La caja diaria** usa `leerMonto` (`lib/dinero/leer-monto.ts`, de #147). Ahí «1.500» vale 1.500 y lo ambiguo se rechaza con
  su motivo.
- **Comercio e importadora** leen con `Number()`. Ahí «1.500» vale **1,5** sin aviso, y «1.500,50» da `NaN`. Los lugares:
  - `comercio/caja/CorteForm.tsx:23`, `comercio/fiados/AbonoForm.tsx:25` y `comercio/caja/VentaForm.tsx:124`;
  - `comercio/fiados/PagoCompraForm.tsx`, `comercio/fiados/CompraForm.tsx` y `comercio/NewProductForm.tsx`;
  - `importadora/costeo/CosteoForm.tsx:81` y `:167`;
  - `lib/comercio/formulario-producto.ts:37` y `lib/comercio/import-productos.ts:135`.
- Los ejemplos de esos campos están escritos con punto decimal («815.00», «2400.00», «11.37»), y el costeo trabaja en USD.

El costeo de importadora entra en la 1.0 acotada (`docs/ONIA_1.0_CORTE.md` §1): un «1.500» leído como 1,5 da un costo puesto en
almacén falso y una alerta de reprecio falsa. Comercio es 1.1, pero comparte la función.

## Qué hacer
1. **Bolivianos: `leerMonto` y solo se agranda.** Todo lo que hoy acepta lo sigue leyendo igual: «1.500» → 1500 y «1.500,50» →
   1500,5. Suma el punto decimal sin miles, con 1 o 2 decimales: «815.50» → 815,5. En boliviano nadie escribe un punto seguido de
   dos dígitos como miles, así que no hay otra lectura. «1,500» y tres decimales se siguen rechazando con su motivo.
2. **Dólares: una función aparte, `leerMontoUsd(texto, decimales)`, sin separador de miles.**
   - Acepta «2400», «2400.50» y «2400,50», con hasta `decimales` lugares.
   - Rechaza con su motivo todo lo que traiga agrupación: «2.400», «2,400» y «1,500.50». Motivo: «Escriba el monto sin separador
     de miles, por ejemplo 2400 o 2400,50».
   - Razón: las facturas en USD traen precios unitarios con 3 o 4 decimales («0.235», «1.500» = 1,5). Por eso «1.500» no se puede
     leer como mil quinientos en un campo en dólares.
   - `decimales` sale de la columna de cada campo en `prisma/schema.prisma`: 2 para fletes y totales, la escala de la columna para
     los precios unitarios. Anotá cuál viste para cada campo.
3. **Cada campo de la META pasa a la función de su moneda** y muestra debajo el monto leído, como la caja («Se registrará Bs
   1.500,00», «USD 1,50 por unidad»). Ese texto es la última red ante lo que queda ambiguo.
   - Con motivo, el botón de enviar se apaga con `disabledReason`, y el campo nunca se envía como `NaN` ni como 0.
   - En `import-productos.ts` (CSV), un monto que no se puede leer marca la fila con su motivo; no la importa con un número inventado.
4. **Los ejemplos de los campos enseñan el formato que se acepta sin dudas:** en bolivianos «815,00»; en dólares, «2400.00» y
   «11.37» se quedan como están, porque no llevan miles.

## PRUEBA DE HECHO
Primero en rojo con el código de hoy; anotá cuáles fallaron.
- `leer-monto.test.ts`:
  - **Los casos que ya existen siguen igual**, salvo los que pasan de rechazo a monto: «1.50», «1.5» y «1500.5». Anotalos.
  - Prueba de propiedad en bolivianos: para todo entero de 0 a 10.000.000 y todo decimal de 0 a 99, la escritura boliviana
    (`1.234,56`), la sin miles con coma (`1234,56`) y la de punto (`1234.56`) dan el mismo monto.
  - «1,500» y «1,500.50» se rechazan con motivo.
- `leerMontoUsd`:
  - con 2 decimales, «2400.00» y «2400,00» → 2400; «2.400», «2,400», «1,500.50» y «1.500» → rechazo con motivo;
  - con 4 decimales, «0.235» → 0,235 y «1.500» → 1,5.
- Render de un formulario de comercio (CorteForm) y del costeo:
  - «1.500» en bolivianos manda 1500;
  - «1,500» apaga el botón con su motivo;
  - en dólares se ve el monto leído antes de enviar.
- `npx tsc --noEmit` 0, eslint de lo tocado 0 y `npx vitest run` completo en verde.

## REGLA DE PARADA
- Sin migraciones ni cambios en las APIs. Los esquemas zod del servidor siguen recibiendo `number`.
- No cambies el comportamiento de la caja diaria salvo lo que agranda la regla. Si un test de la caja se pone rojo por otra cosa,
  pará y anotalo.
- No toques montos guardados ni redondeos fuera de la lectura del texto.
- Si después de dos intentos algo sigue rojo por una causa fuera de esta lista, pará y anotalo.

## Entrega
Sección «PARA LA MADRE:» con:
- los archivos;
- los números de tsc, eslint y vitest;
- la lista de casos que cambiaron de veredicto;
- los campos que no pudiste pasar y por qué.
