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
        catálogo (`lib/platform/types.ts`) y **no la lee nadie**: es una llave duplicada y muerta. La
        que trabaja es `addon.whatsapp`, derivada del booleano `whatsappAddon` **o** de un
        entitlement, con su helper ya escrito: `isWhatsAppAddonActive()` en
        `lib/plan-limits.ts:396`.
      - **La mitad del chatbot SÍ está gateada.** `GET /api/chatbot-knowledge/published`
        chequea el add-on desde el 2026-08-18: sin add-on, el bot no atiende con el
        conocimiento del cliente.
      **Lo que sí está abierto:** la **bandeja**. `/inbox` no tiene `requiresFeature`,
      `app/(dashboard)/inbox/page.tsx` sólo chequea sesión, y `bandejaProfile()` (`lib/chatbot/bandeja-auth.ts`)
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
      **2282 tests verdes**. Commit `6d8b6b7` (rama fix/requerimientos-alcanzable, ya mergeada).

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

- [x] **`ONIA_PRECIOS_COMPETENCIA_Y_DECISION.md` corregido en los 4 lugares** donde decía que
      Emizor no publica precio — uno de ellos lo llamaba *"el dato que más falta en todo el
      relevamiento"*. Verificado en vivo el 2026-08-30 contra dos capturas de archive.org
      (29-nov-2022 y 27-abr-2025, **idénticas**): PYME USD 49 · EMPRESA USD 99 · CORPORATIVO
      USD 299 = **Bs 580 / 1.171 / 3.537** a 11,83. Nuestros números se leyeron de
      `subscription-plans.ts` (320/750/1.500/2.900), no de un doc.
      **Tres cosas que la nota de la cola no tenía y sí cambian el pitch:**
      (1) los tramos de Emizor son **por facturación anual del cliente**, no por usuarios;
      (2) el plan PYME **sólo se vende semestral** — USD 294 ≈ **Bs 3.478 por adelantado**
      contra Bs 320/mes, y ésa es la barrera real para el negocio chico, no los Bs 260 de
      diferencia mensual; (3) Emizor da facturas, sucursales **y usuarios ilimitados** sin
      costo de alta, así que contra ellos **no se compite por el precio de la facturación**,
      se compite por todo lo demás que viene en el mismo plan.
      **Queda abierto (menor):** `/precios-2` da 404 en vivo y la última captura es de
      abr-2025 — es el mejor dato disponible, no el precio de hoy confirmado. Se cierra con
      una cotización por su formulario. **Lección anotada en el doc:** un 404 en `/precios`
      no prueba que no publiquen precio, prueba que esa ruta no responde.
- [x] **Organizaciones de prueba limpiadas en la base LOCAL — y el ítem escondía una trampa.**
      Hecho el 2026-08-30: eran **10**, no 9. Se borraron **8** con un solo
      `DELETE FROM organizations` (los 42 FK que apuntan a `organizations` son `ON DELETE
      CASCADE`, verificado en `pg_constraint`), y con ellas sus 8 `profiles` y sus 8
      `auth.users`. Quedan **2 a propósito**, porque son la evidencia que esta cola cita en su
      propio "Estado": `fiscal-local` (la única factura, la del circuito fiscal con CUF/QR/RCV)
      y `ferreteria-circuito-completo-exu53` (el único `subscription_payment`, los **Bs 320**).
      Borrarlas dejaba la cola afirmando un resultado sin nada que lo reproduzca.
      Backup previo del schema `public` en el scratchpad de la sesión (218 KB).

      **La trampa, y por qué importa más que la limpieza:** el ítem decía *"sólo local —
      producción no se toca"*, pero **la base local NO es la que configura `.env.local`.**
      - `.env.local` → `postgresql://…@127.0.0.1:54329/postgres?schema=dentalgest`. Ese 54329
        **no es una base local**: lo escucha un `ssh.exe` (PID 17716) con
        `-L 54329:127.0.0.1:54329 root@187.77.16.63`. Es un **túnel al VPS**, y del otro lado
        está `supabase-db`, que efectivamente **corre en el puerto 54329** (`show port`) y
        responde al alias de red `db` — el mismo `DATABASE_URL` que tiene adentro el contenedor
        `onia-platform` **en producción**.
      - O sea: una sesión que hubiera corrido "la limpieza local" cargando `.env.local`
        **borraba producción**. Hoy no lo hizo por accidente: el túnel está muerto (en el VPS
        el 54329 no está publicado al host, sólo 54321 y 54322), así que la conexión da
        `ECONNRESET`. La próxima vez que alguien reviva el túnel, no falla.
      - **La base local de verdad** es el stack `fiscal-mock` de Supabase CLI:
        `supabase_db_fiscal-mock`, puerto **55322**, tablas en `public`.
      - Producción, leída sin tocar nada, tiene **3** organizaciones: `zz-qa-ferreteria-tornillo`,
        `zz-qa-clinica-chatbot` y `onia-interna`. **Ninguna** se llama "Prueba". El ítem nunca
        habló de producción, pero su config sí.
      **Dos errores míos, anotados porque los dos son de método:** busqué la tabla como
      `"Organization"` (PascalCase, el nombre del modelo Prisma) y concluí "no existe base
      local" — en la base se llama `organizations`, y el `@@map` no se ve en el nombre del
      modelo. Y corrí el `DELETE` con `docker exec` **sin `-i`**: el heredoc nunca entró, psql
      no recibió nada, y salió sin una sola línea de output. **Un comando que no imprime nada
      no es un comando que funcionó** — se vio sólo porque después conté las filas.
- [x] **Los dos agujeros de `chore/sacar-dentalgest` — y debajo había uno peor, vivo en
      producción.** Leí el journal `wf_7449df59-54c` antes de tocar, como pedía el ítem.
      **El agujero grande no era ninguno de los dos:** el carril declaró haber arreglado que
      dos pantallas ofrecieran WhatsApp contra el placeholder `59177000000`, y el bug siguió
      vivo. Verificado EN VIVO contra el bundle que sirve el contenedor `onia-platform` del
      VPS (no contra Vercel): `NEXT_PUBLIC_DENTALGEST_WA=59177000000` — **la env var de
      producción TRAE el placeholder**, y el número real de `lib/contact.ts` (59178491375) no
      aparece **en ni un solo chunk**. Mover el placeholder de dos componentes a un módulo
      compartido no arregla nada mientras el valor que gana siga siendo el inventado.
      **Por qué los tests no lo vieron, que es la lección:** `lib/contact.test.ts` cubría la
      AUSENCIA de la env var, nunca una env var **presente-y-basura**. Tenía hasta un test
      llamado "cae al nombre VIEJO, que es el que hoy está cargado en producción" — y pasaba
      en verde justamente con el valor roto. **Un `??` distingue undefined, no distingue basura.**
      - **Agujero 2 (real, cerrado):** `admin/plans/PlansClient.tsx` escribía un CUARTO número a
        mano (`wa.me/59177711991`), lo que hacía FALSA la frase "lib/contact.ts queda como fuente
        única". Ahora pasa por `oniaWaHref()`, con una guarda nueva que prohíbe cualquier
        `wa.me/<dígitos>` literal fuera de `lib/contact.ts` (los `wa.me/${telefono}` del despacho,
        las solicitudes y las reservas son el número DEL CLIENTE y siguen permitidos).
      - **Agujero 3 (NO se toca, y está bien así):** los `contacto@dentaGest.bo` de
        `FaqAyuda.tsx` y `lib/ayuda/faq.ts` viven **dentro de comentarios** que explican por qué
        ese contacto falso se retiró. Borrar esa historia es lo que hace que la regla se vuelva
        a desobedecer. El `dentagest-clinical` es el trackId del rubro: renombrarlo es migración
        de datos, y el escéptico ya había dictaminado que dejarlo es correcto.
      - De paso: `__tests__/escanear-fuente.ts` sólo miraba la línea que ABRE un `{/* ... */}`,
        así que las del medio pasaban como código vivo. Lo delató la guarda nueva señalando ese
        comentario de `FaqAyuda.tsx`. Arreglado para las guardas que usan el escáner.
      **Las dos cifras:** no estaban escritas en ningún lado del repo (murieron con el reporte
      del subagente), así que no había nada que corregir — se deja acá el número verdadero para
      que nadie vuelva a citar una base vieja: **origin/master corría 2283**; con esta rama,
      **2291 pasan + 5 skip (2296) en 184 archivos**. Las cifras del reporte (2136 / 2134) medían
      el commit del que ramificó, no master.
      Gates: tsc 0 · eslint 0 errores · 2291 verdes. Commit `34e3d29`, **ya en master**.

- [ ] 🔴 **DECIDE SERGIO — hay CUATRO números de WhatsApp de Onia circulando.** El commit de
      arriba **no elige**: sólo impide que gane el que no existe. Hoy conviven:

      | Número | Dónde vive | Qué es |
      |---|---|---|
      | `59177000000` | env var de producción del VPS | **el placeholder — no es un teléfono** |
      | `59178491375` | `lib/contact.ts` (el que sirve tras el fix) | "confirmado por Sergio" en el handoff del 26-jul; es el del portfolio de Meta |
      | `59177711991` | `SUPERADMIN_WHATSAPP` + los mails al cliente de n8n (WF-01, WF-04) | el que los correos de trial y de mora le dan al cliente |
      | `59175414930` | **lo que publica onia.com.bo hoy** | el de la calle |

      **Lo que hace falta: una línea de Sergio diciendo cuál es el número bueno.** Con eso se
      edita `lib/contact.ts` (1 línea), se carga `NEXT_PUBLIC_ONIA_WA` en el VPS y se alinean
      los JSON de n8n y la landing. Sin esa línea no lo elijo yo: mandar al cliente a un número
      equivocado es peor que el placeholder, porque nadie se entera.

## Después

- [ ] 🔴 **DECIDE SERGIO — `DELETE /api/payments/[id]` sobre un mes ya declarado.** El hueco es
      real y verificado el 2026-08-30: borrar el último pago devuelve la factura a BORRADOR
      (`app/api/payments/[id]/route.ts`), BORRADOR está en `RCV_EXCLUDED_STATUSES`, y ese mes
      pierde la venta del CSV sin nota de crédito de por medio. **No existe NINGÚN concepto de
      cierre de período** en el repo — cero `fiscal_period`, cero tabla de cierre — y el RCV se
      regenera on demand para cualquier mes. No es un bug suelto: falta el modelo, y por eso no
      lo elijo yo.
      **Las tres salidas, cotizadas:**
      - **(a) Guarda barata** — bloquear la salida del RCV si el mes de la factura no es el
        corriente. ~1 día, un guard dentro del helper que ya existe. Pero **inventa la
        política**: "mes corriente" no es "mes declarado", y de paso bloquea la corrección
        legítima del día 2 del mes siguiente.
      - **(b) Cierre de período de verdad** — tabla `fiscal_periods` (org, año, mes, cerradoEn);
        el RCV la lee, y toda salida del RCV sobre un período cerrado exige nota de crédito.
        ~3-4 días. Es lo contablemente correcto y lo que el SIN asume.
      - **(c) No hacer nada todavía.** Verificado EN VIVO en el contenedor `onia-platform` del
        VPS: `SIAT_EMISSION` **no está seteada**, o sea la emisión ante el SIN está apagada
        (`lib/fiscal/flags.ts` exige `=== "1"`). Con eso y cero clientes pagando, el costo real
        de hoy es **cero**; aparece el día que se enciendan los gates fiscales.
      **Recomendación: (c) ahora, (b) el día que se encienda el emisor.** (a) cuesta casi lo
      mismo que (b) en discusión y deja escrita una política que después hay que desandar.
- [x] **El guardia de `invoice-status` ya caza lo que prometía.** Las dos evasiones eran reales
      —`const facturas = tx.invoice` y `data: { invoices: { update: … } }` son Prisma normal, no
      rebusques— y **ninguna de las tres existe hoy en el repo** (verificado el 2026-08-30: las
      tres formas dan 0 resultados). Así que esto no cerró un agujero abierto: cerró la puerta
      por la que iba a entrar la séptima, que es como volvió tres veces este mismo defecto.
      **Lo que más importa del arreglo:** los casos se prueban contra código **sintético**, no
      contra el repo. Un guardia nuevo probado sólo contra un árbol limpio pasa en verde sin
      detectar nada — que es exactamente cómo se escribe un guardia que no guarda. Van 5 patrones
      con **4 casos negativos** (leer una factura, incluirla en un `select`, una FILA llamada
      `invoice`, y crearla), porque un guardia que ladra sobre código legítimo se termina
      desactivando y ahí vuelve la séptima.
      **`invoice.create` NO se prohibió, y ésa es la decisión del ítem:** los 5 `create` del repo
      son NACIMIENTOS, y un documento que acaba de nacer no puede tener una NC apuntándole (la NC
      se busca por `notes contains #<número>`, y ese número no existía hasta el INSERT).
      Prohibirlo obligaba a una **lista de excepciones**, que es justo lo que este guardia se
      prohíbe tener. Lo que el nacimiento SÍ puede romper —una NC que nace fuera del RCV, el
      PRIMER bug de la serie— dejó de ser un literal suelto dentro de la ruta y pasó a ser un
      invariante con nombre: `ESTADO_INICIAL_NC` en `lib/fiscal/credit-note.ts`, con su test de
      que no está en `RCV_EXCLUDED_STATUSES`.
      **Una trampa anotada:** ese test pasaba en VERDE con la constante todavía sin exportar,
      porque `not.toContain(undefined)` es cierto y no afirma nada. Lleva un `typeof === "string"`
      para que no pueda pasar vacío. Es la misma forma del test que cubría la AUSENCIA de una env
      var y se tragaba la basura.
      Gates: tsc 0 · eslint 0 errores sobre los archivos tocados · **2301 pasan + 5 skip (2306)**,
      contra 2291 de la medición anterior. Commit `2849be0`, **ya en master**.

      ⚠️ **Ojo para la próxima sesión:** mientras corría esto, **otra sesión estaba escribiendo en
      el MISMO árbol** `onia-platform` (master): aparecieron solos `InboxClient.tsx`,
      `lib/chatbot/push-te-escribieron.ts`, el webhook de Chatwoot y `public/sw.js`. El commit se
      hizo **con rutas explícitas** para no llevarse trabajo ajeno a medias. Y `npx vitest run`
      reescribió dos `.snap` **sólo con CRLF** (diff vacío): se revirtieron, no se commitearon.
- [x] **Las organizaciones de prueba de la base LOCAL: no eran ~9, eran 2 — y las dos son
      evidencia.** Contadas en vivo el 2026-08-31. Primero hubo que dar con la base correcta:
      el `DIRECT_URL` de `.env.local` apunta a `127.0.0.1:54329`, que **acepta TCP y no habla
      Postgres** (ECONNRESET) — la que responde es el contenedor `supabase_db_fiscal-mock`,
      puerto 55322, schema `public`. Ahí hay **dos** organizaciones, ninguna sobrante:
      `Clinica Prueba Fiscal` sostiene la única factura ENVIADA (Bs 500), que es el circuito
      fiscal mock declarado cerrado el 2026-08-29; y `Ferreteria Circuito Completo` sostiene
      el pago **Bs 320,00 APPROVED** en `subscription_payments` — literalmente la cifra que el
      encabezado de este archivo cita como prueba de que el circuito cierra.
      **Borrarlas borraba la evidencia de dos ítems ya cerrados.** No se tocó nada.
      **Lección:** el ítem heredaba un número ("~9") que nadie había contado. Contarlo costó
      cinco minutos y el ítem se dio vuelta entero.
- [ ] 🔴 **Los otros dos agujeros del escéptico: la fuente se perdió.** El ítem mandaba leer el
      journal del workflow `wf_7449df59-54c` antes de tocar, y ese journal **no existe en
      disco** — buscado el 2026-08-31 bajo `.claude` y bajo el temp de sesión, cero resultados.
      Los journals mueren con su sesión. Sin él no se sabe cuáles eran los dos agujeros ni
      cuáles las dos cifras mal. **Se reabre sólo si alguien los vuelve a encontrar:**
      reconstruirlos de memoria sería inventar, que es justo lo que esta cola persigue.

## Después

- [x] 🔒 **La mina de `page_location` en GA — CERRADA EN `master` el 2026-08-31, y estaba
      declarada cerrada dos veces sin estarlo.** El ítem figuraba `[x]` más abajo en este mismo
      archivo citando *"PR #59 mergeado"*. El PR existe (`4dce75e`) pero
      `git branch --contains` lo ubica **sólo** en `feat/ui-dashboard-piloto` y
      `fix/aviso-leads-canal-propio`: **nunca entró a `master`**, y `GoogleAnalytics.tsx:64`
      seguía mandando `window.location.href` completo, anulando el allowlist `safeQueryParams`
      que la línea de arriba aplica a `page_path`. **Mismo patrón que el WhatsApp placeholder:
      un carril declara el arreglo y la superficie que importa no cambia.**
      **Lección de método: "PR mergeado" no es evidencia — `git branch --contains <sha>` sí.**
      Un ítem se cierra contra la rama que se despliega, no contra la que lo escribió.
      Se trajo el trabajo de #59 tal cual en vez de duplicarlo, porque es más fuerte que el
      parche de una línea: extrae `components/analytics/page-view-params.ts` como módulo puro
      con sus 3 tests, y **estrecha el tipo del parámetro a `{ origin }`** — el regreso lo frena
      `tsc`, no la buena voluntad. Encima queda la guarda de fuente nueva
      (`__tests__/url-cruda-fuera-de-analytics.test.ts`), que persigue la LECTURA de la URL cruda
      (`location.href`, `document.URL`) en `app/`, `components/` y `lib/` y **permite la
      asignación** (redirigir es idioma normal; una guarda que ladra sobre código legítimo se
      termina desactivando). Se vio en ROJO señalando la línea 64 antes del fix.
      Gates: tsc 0 · eslint 0 · **2326 pasan + 5 skip** (188 archivos). Commits `6edfab6` y
      `a15c82f`, **ya en `master`**.
      ⚠️ Cuando `feat/ui-dashboard-piloto` se mergee, estos 3 archivos ya están en `master`.

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

- 🔴 **Bajar el deployment de Vercel que todavía sirve `dentalgest.app`.** No es otro
  producto: es el MISMO `onia-platform` publicándose en dos lados, contra una base que no es
  producción. El auto-deploy ya está cortado desde el repo (PR #58); bajar el deployment vivo
  y decidir el dominio son 2 minutos en el panel, y no los puedo hacer yo (sin token, CLI
  deslogueado, MCP con 403).
- 🔴 **Crear `recurring-invoices` y `onia-core-workitems` en el crontab del VPS.** Hoy sólo
  existen en `vercel.json`, o sea contra la base de la nube: **nunca corrieron contra
  producción**. `appointment-reminders` sí está (`*/15`).

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

## Bloqueado — recontado el 2026-08-30

> **Eran 10. Verificados uno por uno en vivo, quedan 4 que sólo puede hacer Sergio, 2 que
> necesitan una palabra suya y nada más, y 4 que NO eran bloqueos.** Mismo patrón que los
> features de la mañana: la lista se había llenado sin verificar.

### Sólo Sergio — nadie más puede

| # | Qué | Dónde | Cuánto |
|---|---|---|---|
| S1 | **Bajar el deployment de Vercel** que sigue sirviendo `dentalgest.app`. El auto-deploy ya está cortado (PR #58), pero el de las 16:22 quedó publicado y apunta al Supabase de la nube | panel de Vercel → `dental-gest` | 2 min |
| S2 | **Decidir el dominio `dentalgest.app`**: redirigir a `app.onia.com.bo` o dejarlo morir. El DNS vive en Vercel (`ns1/ns2.vercel-dns.com`) | mismo panel | 2 min |
| S3 | **Credenciales del BCP.** Sin esto no hay QR y el cobro sigue siendo manual | banco | — |
| S4 | **Recorrer el circuito en producción**: crear una cuenta real, que mande un correo real, pagar. Es la única verificación que no se puede simular | `app.onia.com.bo` | 10 min |

### Necesitan sólo un "dale" — después lo hago yo

| # | Qué | Por qué necesita permiso |
|---|---|---|
| D3 | **Desplegar al VPS** cuando haya algo que valga el swap. Runbook y gates en la skill `onia-deploy`. ⚠️ Hoy hay commits en `master` que **no están en producción** | toca producción |

### Ya NO son bloqueos — salieron de la lista

- ~~**Vercel al tope (rate limit)**~~ — expiraba hoy **y además ya no publicamos**. Muerto por dos vías.
- ~~**Renombrar el schema de producción**~~ — **ya estaba rechazado con motivo** en este mismo archivo (migración de datos vivos a cambio de prolijidad que ningún cliente ve). Estaba anotado como bloqueo y como rechazo al mismo tiempo.
- ~~**GA4**~~ — **cerrado 2026-08-30: no es código muerto, es una perilla apagada bien.**
  `GoogleAnalytics.tsx:96-99` hace early-return **antes** de montar el `<Script>` si falta
  `NEXT_PUBLIC_GA_ID` (cero red, cero `dataLayer`, cero cookie), y encima el hijo filtra por un
  allowlist de 6 rutas públicas, así que ni encendido rastrearía la app autenticada. La política
  de privacidad ya está escrita **en condicional** (`app/privacy/page.tsx:92-95`), la CSP ya lo
  contempla y `.env.example` lo trae vacío. **Encenderlo es UNA env var.** La entrada estaba mal
  planteada: no había nada que sacar.
- ~~**UI/UX del dashboard**~~ — no es un bloqueo, es una **asignación de carril**: lo lleva web-factory. Estar en otra sesión no es estar bloqueado.

## Cerrado (2026-08-31) — no rehacer

- [x] 🚀 **`main` INTEGRADA y DESPLEGADA.** 242 commits de 4 carriles (`onia-web-architecture`,
      `chatbots-platform-review`, `ads-creatividades-publicos`, `git-status`). Gates: `tsc` 0,
      **217 tests**, 28 archivos. Deploy de `e5c1ad3` con los 5 gates de
      `deploy-gates-swap.sh` (en el VPS) en OK.
      Backup: `runtime-next.prev-20260831-194424`. Verificado **mirando** el login y `/register`.
- [x] **`claude/pending-tasks-review-fb0694` descartada, no mergeada.** Su único commit es un
      auto-sync del 10-ago y sus 3 archivos son **más viejos** que los de `main`: mergearla
      hacía retroceder los tres. Una rama no es un carril por tener commits.
- [x] **`main` estaba ROJA y nadie lo sabía.** `scripts/carousel_render.test.js` fallaba: el
      renderer dice `square`, el test decía `cuadrado`. No está en ningún CI. El merge trajo el
      arreglo desde el carril de contenido.
- [x] **Había DOS carpetas de handoff** (`handoff/` y `handoffs/`). Consolidadas en la singular,
      que es la que usa el README y los otros 5 carriles.
- [x] **El aviso de pedidos de acceso: PROBADO en vivo, y mi diagnóstico anterior era falso.**
      Dije que "no suena nada" — existe desde el 21-ago (`lib/aviso-acceso.ts`), está cableado
      en `app/api/access-requests/route.ts` y **funciona**: pedido de prueba → 201 → cero
      `[aviso-acceso] Telegram falló` en los logs. Lo había buscado con grep en `app/api`.
      **Lo que sí falla es la señal**: el aviso va al MISMO chat que el guardián del VPS.

- [x] **D2 · Cuentas de más dadas de baja en `onia_center`.** `arthur`, `seller_001` (Camila)
      y `seller_002` (Jerónimo) → `status='blocked'`. Queda **sólo `sergio`** activo. Respaldo
      del estado previo tomado antes del `UPDATE`; se revierte poniendo `'active'`.
      **Cerrado por dos vías**: además del flag, `center.onia.com.bo` responde **404** — la
      superficie ya estaba dada de baja.
- [x] **D1 · Los 2 crons instalados en el VPS y PROBADOS.** Pre-chequeos del runbook en verde
      (`CRON_SECRET` presente, `NEXT_PUBLIC_APP_URL=https://app.onia.com.bo` — no localhost,
      `N8N_API_KEY` presente, sin duplicados). Crontab respaldado en
      `/root/crontab-backup-antes-de-2-crons-20260831.txt` (29 líneas → 36). Scripts en
      `/root/bin/` con permisos `700` y shebang sin CRLF. **Corridos a mano, los dos exit 0:**
      - `recurring-invoices` → `{"ok":true,"processed":0,"failed":0,"total":0}` (hay **0 filas**
        en `recurring_invoices`, así que era no-op garantizado — por eso se pudo probar sin
        riesgo)
      - `onia-core-workitems` → `{"ok":true,"organizations":3,"created":0,"deduped":0,"errors":0}`

## Cerrado (2026-08-30) — no rehacer

- [x] 🔒 **Dar de baja una cuenta del ONIA Center NO cerraba la puerta.** Apareció yendo a
      verificar que D2 sirviera de algo. El middleware hacía `find(active) ?? profiles[0]` y la
      consulta **no filtraba por status**: una cuenta dada de baja caía en el fallback, devolvía
      su rol, y como el normalizador hace `role ?? ""` salía *truthy* — el guard `if (!role)` la
      dejaba pasar. Test en rojo: `expected 'seller' to be ''`. Del otro lado
      `onia-center-auth.ts:252` **sí** filtraba: dos caminos, uno solo cerrado. La decisión salió
      a `lib/onia-center-perfil.ts` con 7 tests y es **fail-closed** (sin `status` no se asume
      activo). Commit `3cccbe67`.
- [x] 🔒 **La mina de `page_location`** — GA mandaba la URL entera y anulaba el allowlist que la
      línea de arriba aplicaba a `page_path`. Dormida (GA apagado) pero **a una env var de
      encenderse**. PR #59: se arma del mismo path ya filtrado, y **el tipo se estrechó
      a `{ origin }`** para que `tsc` frene el regreso.
      ⚠️ **Esta entrada decía "PR #59 mergeado" y era FALSO: el commit `4dce75e` estaba sólo en
      `feat/ui-dashboard-piloto` y `fix/aviso-leads-canal-propio`, nunca en `master`.** El bug
      siguió vivo hasta el 2026-08-31. Ver la entrada de "Después", que es la que vale.
- [x] **GA4: no era código muerto.** Early-return antes de montar el script, allowlist de 6 rutas
      públicas, política de privacidad ya escrita en condicional. Encenderlo es 1 env var.

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
