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

## Ahora — plan de features (revisado 2026-08-30, con Gate 1 corrido)

> **Cuatro de los seis ítems del plan de la mañana murieron al verificarlos.** No estaban
> hechos "más o menos": estaban hechos, o estaban decididos, o el costo era otro. Queda
> escrito acá para que ninguna sesión los vuelva a abrir.

- [ ] 🔴 **F2 · BLOQUEADO EN SERGIO — el chatbot se cobra y medio chatbot es gratis.**
      Verificado en vivo el 2026-08-30, y la primera versión de este ítem estaba mal en dos
      cosas, así que ojo con lo que se lee acá:
      - **La llave NO es `addon.chatbot`, es `addon.whatsapp`.** `addon.chatbot` está en el
        catálogo (`types.ts:73`) y **no la lee nadie**: es una llave duplicada y muerta. La
        que trabaja es `addon.whatsapp`, derivada del booleano `whatsappAddon` **o** de un
        entitlement, con su helper ya escrito: `isWhatsAppAddonActive()` en
        `lib/plan-limits.ts:396`.
      - **La mitad del chatbot SÍ está gateada.** `GET /api/chatbot-knowledge/published`
        chequea el add-on desde el 2026-08-18: sin add-on, el bot no atiende con el
        conocimiento del cliente.
      **Lo que sí está abierto:** la **bandeja**. `/inbox` no tiene `requiresFeature`,
      `inbox/page.tsx` sólo chequea sesión, y `bandejaProfile()` (`lib/chatbot/bandeja-auth.ts`)
      gatea por rol, no por add-on. La tenencia sale de `clinicSettings.chatwootInboxId`.
      **Y la raíz:** el alta crea un inbox de Chatwoot para **TODA** org automáticamente
      (`app/api/admin/clinics/route.ts:99`, `createInbox` + `addAgentToInbox`), sin mirar el
      add-on. O sea: toda org nace con bandeja funcionando y `whatsappAddon` en `false`.

      **Por qué no lo cierro solo:** cualquiera de los dos arreglos **baja una superficie
      viva**, y eso está en la lista de "nunca" del loop.
      - **(a) Gatear `/inbox` con `requiresFeature: "addon.whatsapp"`** — una línea, y alcanza
        para nav Y ruta (la lista blanca se deriva del nav). Pero **hoy ninguna org tiene el
        add-on**, así que todas pierden la bandeja de golpe.
      - **(b) Dejar de crear el inbox salvo que el add-on esté activo** — ataca la raíz y **no
        apaga nada de lo que ya existe**, sólo cambia lo que recibe una org nueva. Más seguro,
        pero cambia lo que ve un cliente el día uno (hoy la bandeja vacía funciona de gancho).
      **Decide Sergio.** Con cero clientes pagando el costo real de hoy es cero; el costo
      aparece con el primer cliente que pague el add-on y vea que el de al lado lo tiene igual.

- [x] **F3 · `/requerimientos` ya es alcanzable.** Estaba en `COMMON_SEGMENTS` —el gate la
      dejaba pasar para todos los packs— y no tenía **un solo `href`** en `app/`,
      `components/` ni `lib/`. El arreglo no fue sólo el enlace: **que el gate deje pasar un
      segmento no significa que exista un camino para entrar**, y esa brecha no la cubría
      ninguna guarda. Ahora hay un test que hace imposible el próximo huérfano — cada segmento
      común o entra a algún nav, o se declara en `SIN_NAV_A_PROPOSITO` **con el motivo**. La
      guarda tiene su recíproco (un segmento ya enlazado no puede quedarse en la lista de
      excepciones), y eso cazó **dos entradas mías de más** en el mismo commit en que las
      escribí. Entró a los 4 navs porque es transversal, con roles SUPERADMIN/ADMIN/STAFF:
      perseguir papeles es de recepción, no del profesional. Gates: tsc 0, eslint 0 errores,
      **2282 tests verdes**. Commit `6d8b6b7` en `fix/requerimientos-alcanzable`.

- [ ] **F5 · Veterinaria — COTIZADA el 2026-08-30, decide Sergio.** El bloqueo es real pero
      **el costo estaba inflado**. No es "migrar datos vivos":
      - La factura toma el CI del paciente en **un solo lugar**: `lib/fiscal/rcv-export.ts:148`
        (`invoice.patient?.ci` → `nitCliente`).
      - El arreglo mínimo son **columnas anulables** de responsable en `Patient` + una lectura
        con fallback (`responsable?.ci ?? patient.ci`). **Cero backfill**: las filas que ya
        existen se comportan igual que hoy.
      - Superficie: `patientId` aparece 24 veces en `schema.prisma` y 49 archivos lo tocan,
        **pero ninguno se toca en esta versión** — el fallback los deja intactos.
      - Falta: el bloque "responsable / quién paga" en el alta de paciente, mostrado por
        vocabulario sólo en el track veterinaria.
      **Riesgo real: bajo.** Es una migración aditiva. Lo que hay que decidir no es el riesgo,
      es si el 6to rubro vale la semana antes de estrenar los cinco que ya se venden.

## Rechazado hoy con motivo (2026-08-30) — no volver a abrirlo

- **F1 · Sumar `/patients` al nav de servicios profesionales.** Lo intenté, escribí el test,
  lo vi en rojo, hice el cambio — y **dos guardas del repo lo cazaron como regresión.**
  El bug YA estaba arreglado el 2026-08-30, y **a propósito de otra forma**: la ficha
  (`patients/[id]`, `medical-alerts`, `records`) es de los packs **clínicos**, así que abrir
  el segmento le daba la ficha clínica a un estudio contable con sus APIs en 403. El arreglo
  real es **alta inline del cliente en el modal de nueva cita** contra `/api/patients`
  (`app/(dashboard)/appointments/page.tsx:129-143`). Revertido, árbol limpio.
  **Lección:** hice grep del nav —que es estructura— y concluí sobre la capacidad. Es el
  mismo error de "contar menciones de archivo en vez de capacidad" que ya me marcaron.
- **F2 · Gatear `addon.inventory_advanced`.** Sergio ya lo decidió el 2026-08-27: *"no se
  cobra"*. El add-on se retiró de la oferta y las funciones quedaron gratis para todos. Que
  la clave no la lea nadie es ahora **lo correcto**. Está escrito en `lib/pricing.ts:120`.
- **F2 · Gatear `addon.web`.** La web del cliente la entrega **web-factory**, otro repo. No
  tiene ni debería tener pantalla en la plataforma. La clave es decorativa.
- **F4 · Encender el agente `captador`.** Está apagado **por diseño**, no por olvido.
  `agents-runtime.ts:1152` lo dice: *"Sin esto, cada clínica dental y cada veterinaria
  estrenaría una fila 'captador inmobiliario'"*. Es un add-on con `requiresFeature`, y su
  copy es **inmobiliario** ("nunca inventa datos del inmueble") — un rubro que ni siquiera
  se ofrece. `kind_not_enabled` en 14 días de log = nadie lo compró. Funciona como debe.

### Arrastre de la cola anterior

- [ ] **Actualizar `ONIA_PRECIOS_COMPETENCIA_Y_DECISION.md`**: dice que Emizor *no publica
      precio* y es **falso**. Están en archive.org, sin cambios en 2,5 años: USD 49/99/299 =
      **Bs 580 / 1.171 / 3.537** al cambio real. Eso cambia el argumento de venta: **Onia
      Básico a Bs 320 queda por debajo del piso de Emizor**, y ellos cobran en dólares, así
      que la devaluación les pegó 70% sin que tocaran la lista.
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

## Cerrado (2026-08-30) — no rehacer

- [x] **Corregido el catálogo de venta en 5 puntos** — todos porque estaba viejo, y cuatro de
      los cinco **subvendían** el producto: los cinco rubros ofrecidos ya se venden (decía
      tres), servicios profesionales está arreglado (decía "en arreglo"), el add-on de
      inventario está retirado por decisión de Sergio (decía "en revisión"), veterinaria es
      mucho más barata de lo que decía, y los agentes corren solos (decía que no).

- [x] **PR #56 mergeado** (`14fa528`): el registro ofrece demo al que no sabe configurarlo.
      Lint/Typecheck/Tests/Build y Secret scan en verde; el check de Vercel falló por
      `build-rate-limit`, que no es del código. Cero PRs abiertos en `onia-platform`.
- [x] **Corregido el catálogo de venta: los agentes SÍ corren solos.** Decía que "nadie los
      dispara" mirando `vercel.json` — pero la plataforma la sirve el VPS, no Vercel. El
      crontab del host los corre todos los días a las 07:00 La Paz, con 14 días de `http=200`
      en el log. Se estaba **subvendiendo** una capacidad que funciona.

## Cerrado (2026-08-29) — no rehacer

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
