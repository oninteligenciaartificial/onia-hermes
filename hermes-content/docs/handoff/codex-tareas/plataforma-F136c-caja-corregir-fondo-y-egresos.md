estado: pendiente
modelo: gpt-6-astra (plata)
carril: plataforma
origen: lo que quedó abierto de la caja después de #147 (F136) y #155 (F136b). Son el MEDIUM 3 de Hermes E4 y los LOW de E4, E15 y E19 (onia-hermes `claude/adoring-ramanujan-7sjzwv`, docs/cola/loop/hermes-jarvis.md). Escrita el 11-oct por Plataforma (session_01HhnFgkeF6nLGvjrfjt1o2C); líneas medidas en `master` `0b25e289`.
decisión: Plataforma, 11-oct. Un error de caja se corrige después, con motivo y auditoría, y no con un paso más antes de cada envío: el campo ya muestra el monto leído antes de mandar (#147, M1), y la regla «menos pasos» de CLAUDE.md pesa más que una confirmación por egreso.

# F136c · La caja de un día abierto se corrige entera: fondo inicial, egresos y montos imposibles

Sos Codex. Carpeta `C:/dev/proyectos/onia-platform-codex-f136c`. La madre la prepara desde `origin/master` (`0b25e289` o posterior) y te
pasa el SHA base. No hagas git: la madre revisa, corre `tsc` y la suite completa, commitea y abre el PR.

## META
Desde F136b se puede reabrir un día de hasta siete días atrás, pero reabrirlo solo sirve para recontar el efectivo:
1. **El fondo inicial no se corrige desde la pantalla.**
   - La API ya existe: `correctOpeningFund`, en `app/api/caja-diaria/route.ts:301-330`. Pide `approvals.decide` y audita
     `DAILY_CASH_OPENING_FUND_CORRECTED` con el valor viejo y el nuevo.
   - No tiene pantalla, no pide motivo y solo opera sobre hoy (`getTodayRangeUTC`, `:277-279`).
2. **Un egreso mal cargado no se puede anular.**
   - `expense` (`:398-419`) solo crea y solo sobre hoy.
   - La lista «Salidas del día» (`CajaDiariaClient.tsx:628-662`) no tiene ninguna acción.
3. **Los montos no tienen tope.**
   - Los esquemas de `:23`, `:28`, `:33` y `:40` no tienen `.max`.
   - La columna es `Decimal(10,2)`, así que más de 99.999.999,99 da un 500 genérico en vez de un 400 con su motivo.
4. **Borrar un cobro cuya factura no existe da 500.** `app/api/payments/[id]/route.ts:65` lanza `INVOICE_NOT_FOUND` y ningún
   `catch` lo traduce (LOW de Hermes E15 y E19). En `app/api/payments/route.ts:163` el mismo error sí da 404.
5. **Un cobro puede ganarle al cierre.** `POST /api/payments` lee la caja del día sin candado (`app/api/payments/route.ts:69-75`) y puede
   registrar un cobro en efectivo en el mismo instante en que otro usuario cierra la caja.
6. **El aviso de cierre promete algo que no es cierto.** «Solo un administrador puede reabrirla» (`CajaDiariaClient.tsx:788`): en
   realidad reabre quien tiene `approvals.decide`.

## Qué hacer
1. **Corregir el fondo inicial.**
   - **API:** `correctOpeningFund` acepta `date` opcional, con la misma ventana y la misma zona horaria que `reopen` (hoy o hasta 7 días
     atrás), y exige `reason` (3 a 180 caracteres). Opera solo si la caja de ese día está abierta: si está cerrada, 409, como hoy. La
     auditoría suma `reason` y `date`.
   - **Pantalla:** «Corregir fondo», junto al fondo inicial, solo para quien tiene `approvals.decide` y solo con la caja de ese día
     abierta. El diálogo pide el monto nuevo con `leerMonto` (y muestra el monto leído, como el resto de la caja) y el motivo. Después
     de guardar, el resumen se recalcula.
2. **Anular un egreso.**
   - **API:** acción nueva `voidExpense` con `expenseId`, `date` opcional (la misma ventana) y `reason` (3 a 180 caracteres). Pide
     `approvals.decide` y opera solo con la caja abierta.
   - **Transacción:** borra el egreso filtrando por `organizationId` y por la caja del día, y en la misma transacción audita
     `DAILY_CASH_EXPENSE_VOIDED` con la fila completa (monto, motivo original, quién lo cargó y cuándo) más el motivo de la anulación.
     Un `expenseId` de otra organización o de otro día da 404, igual que uno que no existe.
   - **Sin migración:** el rastro queda en la auditoría, como `PAYMENT_DELETED` en F136b.
   - **Pantalla:** «Anular» en cada fila de «Salidas del día», con las mismas condiciones de permiso y caja abierta, y un diálogo que
     muestra el egreso y pide el motivo.
3. **Egresos en un día reabierto:** `expense` acepta `date` opcional con la misma ventana. Así, al reabrir un día viejo se puede cargar
   el egreso que faltó, no solo recontar.
4. **Montos imposibles:** todos los montos del POST de caja llevan `.max(99_999_999.99)`. Pasado ese tope, la respuesta es un 400 con un
   motivo que diga el máximo.
5. **`INVOICE_NOT_FOUND` da 404** en el DELETE de pagos, igual que en el POST.
6. **Cobro contra cierre:** en `POST /api/payments`, la lectura de la caja del día pasa a `SELECT … FOR UPDATE` dentro de la misma
   transacción, como ya hace el cierre (`caja-diaria/route.ts:100`).
7. **El aviso de cierre dice la verdad:** «Se cerrará la caja con Bs X. Para reabrirla hace falta el permiso de aprobar pagos.», o una
   frase equivalente, de usted.
8. **Las acciones de auditoría nuevas van en la unión `AuditAction`** (`lib/audit.ts`): `DAILY_CASH_EXPENSE_VOIDED` y lo que
   agregues. El HIGH de Hermes E15 en #155 fue justo eso: las pruebas pasaban porque mockean `logAudit` y `tsc` fallaba.

## PRUEBA DE HECHO
Primero en rojo con el código de `master`; anotá cuáles fallaron.
- **`app/api/caja-diaria/route.test.ts`:**
  - **`correctOpeningFund`:**
    - con fecha de ayer y la caja reabierta cambia el fondo y audita el motivo;
    - sin motivo da 400;
    - con la caja cerrada da 409;
    - sin `approvals.decide` da 403;
    - fuera de la ventana da 400.
  - **`voidExpense`:**
    - borra y audita la fila completa;
    - un egreso de otra organización o de otro día da 404 y no borra nada;
    - con la caja cerrada da 409;
    - sin `approvals.decide` da 403.
  - **`expense` con fecha:** en un día reabierto suma al resumen de ese día; en un día cerrado da 409.
  - **Tope:** `openingFund`, `amount` y `countedCash` en 100.000.000 dan 400 con el motivo del máximo, no 500.
- **`app/api/payments/[id]/route.test.ts`:** factura inexistente → 404 y sin auditoría de borrado.
- **`app/api/payments/route.test.ts`:** la lectura de la caja va dentro de la transacción y con `FOR UPDATE`. Comprobalo sobre la
  consulta, no solo sobre el mock de `findUnique`.
- **Render de `CajaDiariaClient`:**
  - «Corregir fondo» y «Anular» aparecen con `approvals.decide` y la caja abierta, y no aparecen sin el permiso ni con la caja cerrada;
  - el diálogo muestra el monto leído y apaga el botón sin motivo;
  - el aviso de cierre ya no dice «administrador».
- El gate de usted y el trinquete del voseo en verde.
- `npx tsc --noEmit` 0 **con el cliente de Prisma generado del schema actual**, eslint de lo tocado 0 y `npx vitest run` completo en
  verde.

## REGLA DE PARADA
- **Límites de alcance:**
  - Sin migraciones ni cambios en el schema.
  - Sin tocar los webhooks de PagosNet y Circle: un cobro en línea que llega después del cierre es otra decisión, va aparte y lo anotás.
  - No cambies las reglas de `close` y `reopen` de F136b (ventana, permisos, motivo), salvo lo que pide este contrato.
- **Solo la organización de la sesión:** toda consulta filtra por `organizationId`, y ninguna acción lee el `organizationId` ni el `id` de
  la caja desde el cuerpo del pedido.
- **Dos intentos:** si después de dos intentos algo sigue rojo por una causa fuera de esta lista, pará y anotalo.

## Entrega
Sección «PARA LA MADRE:» con:
- los archivos;
- los números de tsc, eslint y vitest;
- los tests que se pusieron rojos con `master`;
- las acciones de auditoría nuevas;
- qué quedó fuera y por qué (los webhooks, como mínimo).
