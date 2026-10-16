estado: pendiente
modelo: gpt-6-astra (plata)
carril: plataforma
origen: los LOW de Hermes E18 y E19 sobre #156 = M1 (onia-hermes `claude/adoring-ramanujan-7sjzwv`, docs/cola/loop/hermes-jarvis.md §E18 y §E19) y la revisión de Plataforma de la cabeza `4dd41d1c`. Pedido de la madre del 11-oct. Escrita el 11-oct por Plataforma (session_01HhnFgkeF6nLGvjrfjt1o2C); líneas medidas en `4dd41d1c`.
decisión: Plataforma, 11-oct. Es la misma regla de M1, llevada a las cantidades: «un texto con dos lecturas posibles se rechaza con su motivo; uno con una sola lectura se acepta y se muestra». Si Sergio Urcullo prefiere otra convención, se cambia solo `lib/comercio/leer-cantidad.ts` y `lib/dinero/`.

# M1b · Ninguna cantidad se lee de dos maneras, y la lectura de montos llega a toda la plataforma

Sos Codex. Carpeta `C:/dev/proyectos/onia-platform-codex-m1b`. La madre la prepara desde `origin/master` con #156 (M1) ya mergeado y te
pasa el SHA base. No hagas git: la madre revisa, corre `tsc` y la suite completa, commitea y abre el PR.

## META
M1 dejó una sola lectura para los montos en bolivianos y en dólares. Quedan cinco cosas que Hermes y Plataforma midieron:
1. **Cantidades con dos lecturas.** `lib/comercio/leer-cantidad.ts` rechaza «1.500» solo en `unidad`, `caja` y `pieza`. En cualquier otra
   unidad lo lee como 1,5 y solo lo muestra:
   - «bolsa», la unidad del cemento de la demo (`lib/comercio/demo-seed.ts:32`), y también «paquete», «par», «docena», «botella» o «saco»;
   - en el costeo, antes de elegir el producto la unidad está vacía y «3.000» de cantidad pasa a 3. El costo unitario sale 1.000 veces
     más alto en pantalla;
   - el peso «1.200» kg pasa a 1,2 kg: si una línea escribe «1.200» y otra «800», el reparto por peso sale mal.
2. **Dos lectores fuera de M1:**
   - `app/onboarding/pasos/paso-servicios.tsx:185` (`aPrecio`, el precio de cada servicio del alta) usa `Number()`: «1.500» → 1,5 y
     «1,500» → sin precio;
   - `app/(dashboard)/importadora/reprecio/page.tsx:39` (`parsearTco`) lee el TCO «6.960» como 6,96, mientras el costeo lo lee como
     6.960.
3. **TCO sin tope.** En el costeo, «6.960» muestra «Se registrará Bs 6.960,00 por USD» y calcula con eso.
4. **Redondeo del CSV.** «1.0050» da Bs 1,00 y no 1,01: `Math.round((unidades / 10000) * 100) / 100` cae en ,4999…
   (`lib/comercio/import-productos.ts`, `leerMontoCsv`).
5. **Forma:**
   - **Rojo antes de escribir.** Varios campos obligatorios vacíos muestran el motivo en rojo antes de que se escriba nada: Ajustar
     stock (`CantidadLeida` sin la guarda de `.trim()`), `CorteForm`, `CompraForm`, `AbonoForm`, y el FOB y el TCO del costeo.
   - **Stock mínimo viejo.** En Editar producto, un stock mínimo viejo con fracción en una unidad entera se ve en rojo, aunque se puede
     guardar.
   - **Aviso angosto.** En `AbonoForm.tsx:63` y `PagoCompraForm.tsx:60` el aviso queda bajo un campo `w-24`, dentro de una fila
     `flex-wrap`.
   - **Plural fijo.** «Se registrarán 1 unidad».
   - **Import fuera de lugar.** El `import` de `import-productos.ts` quedó entre el JSDoc de `COLUMNAS_IMPORT` y la constante.
   - **Voseo.** En los archivos que toca este contrato:
     - «Elegí el producto…» y «Elegí el producto del catálogo…» (`CosteoForm.tsx:486` y `:609`; el costeo es 1.0);
     - «Escribí la cantidad, por ejemplo 12.» y «Contá el motivo: queda en el historial.» (`formulario-producto.ts:137` y `:139`);
     - «registrala al contado» y «Elegí un …» (`VentaForm.tsx:85`, `:93` y `:145`).

**Medido en producción (11-oct 13:16 UTC, `release-0b25e289`, cuenta QA «ZZ QA K3 Importadora», sin enviar nada):**
- en el costeo, «3.000» de cantidad sin producto elegido muestra «Se registrarán 3», y el costo unitario de la línea sale Bs 6.124,80
  (USD 880,00) en vez de 6,12;
- «1.200» de peso muestra «Se registrarán 1,2 kg»;
- debajo de «Aplicar al catálogo (0)» se lee a la vez «Elegí el producto del catálogo…» (vos) y «Elija el producto del catálogo…» (usted).
Captura: `scratchpad` de Plataforma, `mirar-costeo/mirar-costeo-1440.png`.

## Qué hacer
1. **`leerCantidad` aplica la regla de las dos lecturas.** Hay tres grupos de unidades, en constantes con nombre:
   - **Enteras.** Las de hoy más `bolsa`, `paquete`, `par`, `docena`, `botella`, `saco`, `frasco`, `lata`, `sobre`, `juego` y `kit`, con
     sus plurales.
   - **Fraccionarias conocidas.** `kg`, `g`, `l`, `ml`, `m`, `m²`, `m³` y sus nombres largos (kilo, gramo, litro, metro).
   - **Desconocida o vacía.** Todo lo demás.

   La tabla manda; los tests la cubren fila por fila:

   | Texto | Entera | Fraccionaria conocida | Desconocida o vacía |
   |---|---|---|---|
   | «1500» | 1500 | 1500 | 1500 |
   | «1.500» | 1500 (la única lectura entera) | rechazo con motivo (1500 o 1,5) | rechazo con motivo (1500 o 1,5) |
   | «12.500.000» | 12500000 | 12500000 (con dos puntos solo cabe la lectura boliviana) | 12500000 |
   | «1,500» | rechazo: la coma de miles no se usa en Bolivia, igual que en M1 | rechazo | rechazo |
   | «1,5» y «1.5» | rechazo (entera) | 1,5 | 1,5 |
   | «0,125» y «0.125» | rechazo | 0,125 | 0,125 |
   | «1.234,5» | rechazo | 1234,5 | 1234,5 |

   - El motivo del rechazo por doble lectura dice: «Escriba 1500 si son mil quinientos, o 1,5 si es uno y medio.», con los números del
     texto.
   - Un rechazo en una unidad entera explica por qué: «… es una cantidad entera».
2. **Peso y volumen del costeo** usan `kg` y `m³`, así que «1.200» kg se rechaza y «1200» o «1,2» pasan. Si la unidad de la línea está
   vacía, rige la columna «desconocida»: «3.000» se rechaza. Cambiá el aviso «se admiten fracciones hasta elegir el producto» para que
   diga eso.
3. **Los dos lectores fuera de M1 pasan a `leerMonto`:**
   - el precio del alta (`aPrecio`) muestra lo leído como en los formularios de M1;
   - el TCO de reprecio usa la misma lectura que el costeo.
4. **Tope del TCO,** en los dos lugares: un valor fuera de `TCO_MIN_BS_POR_USD = 1` a `TCO_MAX_BS_POR_USD = 100` se rechaza con el motivo
   «Revise el tipo de cambio: {leído} Bs por USD no parece correcto.». Las constantes van en `lib/dinero/`, no sueltas en el componente.
5. **Redondeo del CSV con enteros:** `Math.round(unidades / 100) / 100`. «1.0050» → 1,01 y «12.3456» → 12,35, con el aviso de redondeo
   de hoy.
6. **Forma:**
   - **Campos vacíos.** El motivo de un campo vacío no se pinta hasta que el campo tenga texto o se intente enviar. El botón sigue apagado
     con su `disabledReason`, como hoy.
   - **Stock mínimo viejo.** En Editar producto, el stock mínimo sin tocar se muestra en el color neutro. El rojo vuelve si se edita el
     campo o la unidad.
   - **Aviso angosto.** En `AbonoForm` y `PagoCompraForm`, el aviso ocupa el ancho de la fila (`basis-full` o equivalente), no el del
     campo.
   - **Plural.** «Se registrará 1 unidad» y «Se registrarán 2 unidades», con `plural()` de `lib/formato/plural`. Las abreviaturas (`kg`,
     `g`, `l`, `ml`, `m`, `m²`, `m³`, `und`, `u`) no llevan plural.
   - **Import.** Va arriba de todo en `import-productos.ts`.
7. **Voseo de los archivos que tocás:**
   - pasá a usted las frases de la META 5 y toda otra frase de vos o de tú en esos mismos archivos;
   - sumá `app/(dashboard)/importadora/costeo/CosteoForm.tsx` a la lista `ARCHIVOS` del gate
     `__tests__/pantallas-del-video-de-usted.test.ts`, con el comentario «el costeo es 1.0 (M1b)»;
   - bajá la línea base de `__tests__/voseo-ratchet.linea-base.json` donde el trinquete lo pida.

## PRUEBA DE HECHO
Primero en rojo con el código de `master`; anotá cuáles fallaron.
- **`leer-cantidad.test.ts`:**
  - la tabla completa, fila por fila y para los tres grupos;
  - prueba de propiedad: para todo entero de 0 a 10.000.000 en una unidad entera, la escritura boliviana («1.234.567») y la sin miles
    («1234567») dan el mismo número.
- **`import-productos.test.ts`:**
  - «1.0050» → 1,01 con aviso;
  - «1.500» de stock en «bolsa» → 1500;
  - «1.500» de stock en una unidad desconocida → fila rechazada con su motivo.
- **Render de los formularios:**
  - **Costeo.** «3.000» de cantidad sin producto apaga el botón con su motivo; «1.200» de peso también; «6.960» de TCO también, con el
    motivo del tope.
  - **Ajustar stock.** Al abrir, sin texto, no hay rojo y el botón está apagado. Con «1.500» en bolsas se ve «Se registrarán 1500
    bolsas».
  - **Alta de servicios.** «1.500» en el precio de un servicio se lee 1500 y se muestra.
  - **Reprecio.** «6,96» se lee 6,96 y «6.960» se rechaza.
- El gate de usted y el trinquete en verde.
- `npx tsc --noEmit` 0, eslint de lo tocado 0 y `npx vitest run` completo en verde.

## REGLA DE PARADA
- Sin migraciones ni cambios en las APIs: los esquemas zod del servidor siguen recibiendo `number`.
- **No cambies los veredictos de `leerMonto` en bolivianos ni de `leerMontoUsd`.** Son la decisión de M1. Si un test de la caja o de M1 se
  pone rojo, pará y anotalo.
- No toques montos guardados. Un stock mínimo viejo con fracción no se migra: solo cambia cómo se pinta.
- Los mensajes al cliente del negocio (WhatsApp, recibos) no se tocan.
- Si después de dos intentos algo sigue rojo por una causa fuera de esta lista, pará y anotalo.

## Entrega
Sección «PARA LA MADRE:» con:
- los archivos;
- los números de tsc, eslint y vitest;
- los tests que se pusieron rojos con `master`;
- la lista de unidades de cada grupo;
- las frases de vos que pasaste y las que no pudiste, y por qué.
