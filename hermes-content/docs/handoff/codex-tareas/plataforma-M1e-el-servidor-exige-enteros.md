estado: pendiente
modelo: gpt-6.1-sol
carril: plataforma
origen: MEDIUM M4 de la revisión de #162 (M1c) dentro de onia-platform #171, 15-oct (comentario de revisiones en #171). Escrita el 15-oct por Plataforma (session_01HhnFgkeF6nLGvjrfjt1o2C); líneas medidas en `claude/optimistic-ride-1sp5fe` `37560f53`. Va después de que #171 entre a `master`. El nombre M1d ya es el contrato de los montos dentales (Hermes E30).
decisión: la regla «unidad entera → cantidad entera» de M1b/M1c también la aplica el servidor. Se valida donde se carga la variante (la lógica de dominio), no solo en la ruta, así la cubren todos los que llaman.

# M1e · El servidor tampoco acepta 1,5 bolsas

Sos Codex. Carpeta `C:/dev/proyectos/onia-platform-codex-m1e`. La madre la prepara desde `origin/master` con #171 adentro y te pasa el SHA
base. No hagas git: la madre revisa, corre `tsc` y la suite completa, commitea y abre el PR.

## META
M1b y M1c hacen que el navegador rechace «1,5» en una unidad entera (unidad, caja, pieza, bolsa…). El servidor no lo sabe: las tres APIs
validan solo `qty: z.number().positive()` y la lógica revisa `Number.isFinite(qty) && qty > 0`. Una pestaña vieja en caché, una
integración o una llamada directa pueden cotizar, vender o traspasar 1,5 bolsas, y el kardex queda con stock fraccionario en algo que se
cuenta por unidad.
- Venta: `app/api/comercio/ventas/route.ts:32` y `lib/comercio/ventas.ts:186`.
- Traspaso: `app/api/comercio/transfers/route.ts:21`, `lib/comercio/transfers.ts:61` y `lib/comercio/kardex.ts:86`.
- Cotización: `app/api/importadora/cotizaciones/route.ts:31` y `lib/importadora/cotizaciones.ts`.

## Qué hacer
1. En la lógica de cada flujo, donde ya se carga la variante (para el stock o el precio), rechazar una cantidad no entera si
   `unidadEntera(variante.unit)` (de `lib/comercio/leer-cantidad.ts`) es verdadero. Una sola función compartida, no tres copias.
2. El rechazo es un error tipado que la ruta convierte en **400** con un mensaje de usted, por ejemplo: «La cantidad de «Cable THW 12
   AWG» se cuenta en rollos: escriba un número entero.» (con la forma plural que ya arma `lib/comercio/cantidades.ts`). Nada se escribe
   en la base cuando una línea falla: la venta, el traspaso o la cotización entera se rechaza.
3. Peso, volumen y unidades desconocidas siguen aceptando decimales, igual que hoy.
4. El mensaje entra al gate de usted (`__tests__/m1c-de-usted.test.ts` o el que cubra esas rutas).

## PRUEBA DE HECHO
Primero en rojo con el código de `master`; anotá cuáles fallaron.
- Venta, traspaso y cotización: `qty: 1.5` en una variante en bolsas → 400 con el mensaje y **cero** escrituras (venta, movimientos de
  kardex, cotización); `qty: 1.5` en kg → se acepta como hoy; `qty: 3000` en bolsas → se acepta.
- Una venta con dos líneas, una válida y una con 1,5 bolsas, no deja nada a medias.
- Multi-tenant: la variante se busca con `organizationId`; una variante de otra organización sigue dando el error de hoy (no un 400 nuevo
  que revele la unidad).
- `npx tsc --noEmit` 0, eslint de lo tocado 0 y `npx vitest run` completo en verde.

## REGLA DE PARADA
- **Sin migraciones** ni cambios de esquema. No se tocan montos, precios ni cobros.
- **Veredictos del navegador fijos:** las pruebas de M1, M1b, M1c y la caja no cambian. Si una se pone roja, pará y anotalo.
- **Dos intentos:** si después de dos intentos algo sigue rojo por una causa fuera de esta lista, pará y anotalo.

## Entrega
Sección «PARA LA MADRE:» con los archivos, los números de tsc, eslint y vitest, las pruebas que se pusieron rojas con `master` y el texto
final del mensaje.
