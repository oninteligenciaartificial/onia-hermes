# La cola — qué se hace ahora

> **Este archivo es la memoria del trabajo.** Vive en el repo a propósito: los loops de una
> sesión mueren cuando se cierra Claude Code, y con ellos se perdía la cola entera.
> Cualquier sesión lo lee, lo ejecuta y lo actualiza. Sergio también lo puede editar.

**Objetivo vigente (elegido por Sergio, 2026-08-29):** que alguien pueda entrar solo, elegir
plan, pagar, y que esa plata aparezca en métricas. Con eso se venden los 7 rubros que ya existen.

**Estado:** el circuito **cierra**, verificado de punta a punta en local — alta 200 → checkout con
precios de la fuente → comprobante PENDING → aprobación → **Bs 320,00 en la serie de agosto**.
En producción el alta está **abierta** con verificación de correo probada.

---

## Cómo se trabaja esta cola

1. Se toma **el primer ítem no bloqueado**. Uno por vuelta.
2. Se **analiza antes de desarrollar**: Gate 1 — ¿ya está hecho? ¿el bloqueo existe de verdad?
   ¿el dato sigue vigente? ¿ya vive en el repo? Un "ya está hecho" heredado es hipótesis.
3. Se **desarrolla** con test primero, verificado en ROJO por el motivo correcto.
4. **Gates completos: `tsc --noEmit` + `vitest` + `eslint`.** Los tres. El 2026-08-29 se rompió
   CI dos veces por correr sólo los dos primeros: lint es lo que CI verifica y lo que caza
   `react/no-children-prop`.
5. Si toca pantalla, **se abre y se MIRA** con captura. Un 200 no es verificación.
6. Se marca acá con `[x]` y una línea de qué quedó. **Lo tachado no se rehace.**
7. Si algo se bloquea con una decisión de Sergio: `PushNotification` de una línea **y seguir con
   lo desbloqueado**. Un ítem trabado no frena la cola.

**Nunca:** desplegar al VPS, tocar worktrees o ramas de otras sesiones, gastar plata, ni bajar una
superficie viva. Mergear a master **sí** está pre-autorizado con gates verdes (Sergio, 2026-08-29)
— avisar después, no antes.

---

## Ahora

- [ ] **Mergear el PR #56** (la demo en el registro) cuando CI pase. Ojo: el check de Vercel va a
      fallar con `api-deployments-free-per-day` hasta el 2026-08-30 — **no es del código y no es
      obligatorio**. Se mergea igual si Lint/Typecheck/Tests y Secret scan están verdes.
- [ ] **Actualizar `ONIA_PRECIOS_COMPETENCIA_Y_DECISION.md`**: dice que Emizor *no publica
      precio* y es **falso**. Están en archive.org, sin cambios en 2,5 años: USD 49/99/299 =
      **Bs 580 / 1.171 / 3.537** al cambio real. Eso cambia el argumento de venta: **Onia Básico
      a Bs 320 queda por debajo del piso de Emizor**, y ellos cobran en dólares, así que la
      devaluación les pegó 70% sin que tocaran la lista.
- [ ] **Limpiar las organizaciones de prueba** que quedaron en la base **LOCAL** (nombres con
      "Prueba", ~9). Sólo local — producción no se toca.
- [ ] **Los otros dos agujeros** que el escéptico marcó en `chore/sacar-dentalgest` y las dos
      cifras del reporte que dijo que estaban mal. Están en el journal del workflow
      `wf_7449df59-54c`. Leerlo antes de tocar.

## Después

- [ ] **`DELETE /api/payments/[id]` sobre un mes ya declarado** devuelve la factura a BORRADOR y
      ese mes pierde la venta del CSV, sin nota de crédito de por medio. **No existe cierre de
      período**: el RCV se regenera on demand para cualquier mes. Borra débito real, no inventa
      crédito. Es un hueco conceptual, no un bug suelto.
- [ ] **El guardia de repo de `invoice-status` es evadible** por alias (`const f = prisma.invoice`)
      y por nested write, y no cubre `invoice.create`. Hoy no existe ninguno de los tres en el
      repo, pero el guardia promete más de lo que da.
- [ ] **La nota de crédito no pasa por `maybeEmitFiscalInvoice`**: el día que se enciendan los
      gates queda declarada en el CSV interno y no ante el SIN.
- [ ] **Los ítems I1 y E1** de `TODOS_LOS_PENDIENTES.md` siguen sin resolver. Para decidirlos hay
      que **abrir la pantalla con sesión y mirarla**: un 307 no prueba nada, hay un redirect
      atrapa-todo que responde igual para rutas que no existen.

## Bloqueado — necesita a Sergio

- **Credenciales del BCP.** Sin ellas no hay QR. El checkout ya no lo promete (PR #54), pero el
  cobro sigue siendo manual: el cliente transfiere y alguien aprueba.
- **Recorrer el circuito en producción.** Crea una cuenta real y manda un correo real.
- **Vercel al tope**: más de 100 publicaciones diarias del plan gratis. Hasta el 2026-08-30 no se
  puede publicar. Los merges a master entran igual.
- **Desplegar al VPS** (es distinto de mergear: `onia.com.bo` lo sirve un contenedor).
- **`dentalgest.app`** y el **schema de producción**, que sigue llamándose `dentalgest`.
- **Dar de baja a `arthur` y `seller_001`** en `onia_center.user_profiles`: siguen activos.
- **GA4**: encenderlo o sacar el código muerto.
- **UI/UX del dashboard** — lo lleva la sesión de web-factory, no esta.

## Cerrado hoy (2026-08-29) — no rehacer

- [x] Circuito fiscal en mock, verificado en pantalla: CUF, QR, leyenda, RCV.
- [x] **La nota de crédito**, en 5 vueltas y 4 escépticos. Cerró con un invariante escrito, un
      punto compartido para las 6 rutas que escriben estado, y un test que caza cualquier
      escritura nueva sin guarda.
- [x] El 403 que la caja se tragaba en silencio.
- [x] **Métricas del panel** — no existía ni una agregación de plata en todo `/admin`.
- [x] Los dos bugs de alcance que le mentían al superadmin (`/admin/audit` y `/admin/users`).
- [x] `/vendedores` fuera de circulación en los dos hosts, sin reiniciar el chatbot.
- [x] **El alta self-service abierta en producción**, con verificación de correo **probada**
      (GoTrue nunca había enviado un correo: 0 envíos en 7 días).
- [x] El checkout ya no promete un QR que no existe ni una activación que no ocurre.
- [x] DentalGest fuera del código, y el WhatsApp que apuntaba a un número inventado.
- [x] CI de master destrabada: venía roja hacía más de un día.

## Rechazado, con motivo — no volver a proponerlo

- **Graphify / grafo de conocimiento.** El grafo de este repo proyecta ~1,2 M tokens: no es caro
  leerlo, es imposible. Y su detector de obsolescencia miente. Ver
  `ONIA_GRAFO_DE_CONOCIMIENTO_DECISION.md`.
- **Sumar veterinaria al registro.** `Invoice.patientId` es obligatorio y la factura toma los
  datos **del paciente**: una veterinaria no puede facturarle al dueño. Es el modelo, no un texto.
- **Sumar ganadería.** No hay entidades de hacienda ni sanidad — es el catálogo de comercio con
  otro nombre. El core la marca `pending_adoption`.
- **Renombrar el schema de producción.** Migración de datos vivos a cambio de prolijidad que
  ningún cliente ve.
- **Borrar el contenedor `onia-center`.** Adentro corre el motor del chatbot, que es el único
  webhook que Chatwoot tiene configurado.
