# Cola — carril recorrido de cliente

Estado del carril: [`../recorrido/ULTIMO_RECORRIDO.md`](../recorrido/ULTIMO_RECORRIDO.md).
Instrumento: `scripts/recorrido_cliente.mjs`.

> Antes de trabajar un ítem de acá, **reproducilo en vivo**. Medido en este repo: entre el 25 %
> y el 46 % de lo que las colas declaraban pendiente ya no existía.

## Cerrado — era el instrumento, no el sitio

- **Portal del paciente ya SÍ deja cancelar una cita — era mi instrumento, no el producto.**
  Reportado 2026-09-19 (`t_7bb28d06`, dueño onia-cola); arreglado ese mismo día (duplicada de
  `t_69a580c9`, commit `a5be7d45`). Reverificado en vivo el 2026-09-24 07:12 La Paz: tanto
  `/book/confirm/[token]` como `/book/my-appointments/[token]` ya muestran el botón "No voy a
  poder ir", y `PATCH .../api/booking/appointments action:cancel` sigue devolviendo 200 con la
  fila en `CANCELADA`. Mi `scripts/probar_cancelar_cita.mjs` seguía marcando "hallazgo" porque su
  regex sólo buscaba la palabra literal "cancel" en el texto del botón — el producto lo dice en
  español ("No voy a poder ir"), nunca iba a matchear. Arreglado el regex
  (`/cancel|no voy a poder|no podr[eé]/i`); corrida limpia da `RESULTADO: ... sin hallazgo`,
  exit 0, 0 filas `zz-qa-` al cerrar.

- **`/servicios/webs`: el botón "Armar mi web →" quedaba `disabled`** — mapeado paso a paso
  el 2026-09-18 10:15 La Paz. **Era mi selector, no un bug**: la página tiene DOS inputs con
  placeholders parecidos — el mini-asistente de arriba ("¿Cómo se llama tu negocio?",
  placeholder `Ej. Clínica Amanecer`, es el que controla ESE botón) y el formulario detallado
  de más abajo, paso 01 ("Nombre del negocio *", placeholder `Ej. Casa Norte`). Llenaba el
  segundo y el primero — que es el que el botón valida — quedaba vacío, así que el hint
  "Empezá por el nombre." era correcto. Rellenando el campo de arriba (`Ej. Clínica Amanecer`)
  con la elección de rubro por defecto ya puesta, el botón habilita solo:
  `{disabled:false, hint:"Con esto alcanza. Podés contestar el resto o armarla ya."}`.
  Confirmado además que el clic **no manda nada a un backend** (solo Cloudflare RUM):
  el envío real queda para cuando el usuario abre el link de WhatsApp, que este carril no
  toca. Sin hallazgo. Las secciones de abajo (objetivo, alcance/plan, estilo, tipografía,
  color) ya vienen con un default `pressed=true` cada una — no hacía falta elegirlas para
  habilitar el botón, así que "Minimalista" no encontrado por selector tampoco era un bug.

## Reportado a otro carril (nuevo)





- **`/guia-facturacion`: el badge "Plazo · 30-09-2026" contradice a su propia bajada** —
  reportado el 2026-09-17 14:26 La Paz (`t_c53fe39c`, prioridad 2, para el dueño del sitio).
  Escalón 3 (promesa vs. entrega), superficie nueva no auditada antes por este carril. El
  `Kicker` de esa página (`src/app/(sitio)/guia-facturacion/page.tsx:125`) es un string tipeado
  a mano — el único texto de plazo en `/facturacion` y `/guia-facturacion` que NO sale de
  `lib/siat.ts`, pese a que el comentario de ese mismo archivo asegura que "el texto sale
  entero de `lib/siat.ts`... si el SIN mueve la fecha se corrige ese archivo y las dos páginas
  se enteran solas". Dos líneas más abajo, `SIAT_GUIA_BAJADA` (que sí sale de la fuente) dice
  "cómo saber si te toca el **1 de octubre**" — el mismo dato, en la misma pantalla, con dos
  fechas distintas como si fueran la misma cosa. Captura:
  `../recorrido/capturas/hallazgo-plazo-guia-facturacion.png`.

## Abierto

> Los cinco rubros que `RUBROS_ACTIVOS` ofrece hoy (`onia-platform/lib/platform/rubros-activos.ts`)
> ya están recorridos y confirmados 9/9 (o 8/8 cuando el paso 7 no le corresponde): dental,
> comercio, estética, importadora y servicios profesionales — este último ya NO está roto: el
> arreglo de `t_2b03ea3d` sostiene desde el 2026-09-06 y se reverificó 9/9 el 2026-09-07 19:13 y
> otra vez con dental el 2026-09-08 05:09. Ganadero y veterinaria **no están a la venta** (el
> propio archivo lo dice: ganadero `pending_adoption`, veterinaria retirada el 2026-08-13 por el
> modelo de facturación) — no son un rubro pendiente de este carril, medido el 2026-09-05.
>
> Ítem nuevo, chico: verificado el 2026-09-08 que la tarjeta de "Servicios profesionales" en
> `/register` promete «Agenda, citas, cobros y **contabilidad**» y esa pantalla SÍ está en el nav
> del pack (`SERVICIOS_NAV_ITEMS`, `/contabilidad`, `vertical-pack.ts:405`) — no es un hallazgo,
> queda anotado porque nadie lo había cruzado.

> **Cerrado (2026-09-08 21:26):** `RECORRIDO_MOVIL=1` ya corrió en los 5 rubros de
> `RUBROS_ACTIVOS` (dental, comercio, estética, importadora, servicios profesionales) — todos
> limpios, ver `ULTIMO_RECORRIDO.md`. No apareció ningún selector del script que asumiera el
> layout de escritorio.

## Cerrado

- **`DELETE /api/admin/users/[id]` bloqueaba sacar un ADMIN aunque hubiera 2 — arreglado y
  confirmado en vivo.** Reportado el 2026-09-19 06:15 La Paz (`t_24758d5a`). El fix
  (`removeUserFromOrganization` en `lib/auth.ts`, DG-043) llegó a producción con `BUILD_ID`
  `AUiuQ9c0SmcJnuF37_qTo` el 2026-09-19: `scripts/probar_coadministrador.mjs` contra
  producción real da **200** donde antes daba 403. Cerrado y verificado, no solo mergeado.

- **`/precios`: "Reservas online" dice "Incluida en Pro y Full" y omite Crece** — reportado el
  2026-09-13 14:20 La Paz al dueño del sitio (`t_5ad92d30`, prioridad 2). Verificado en vivo con
  `reducedMotion:'reduce'`: todos los montos de `/precios` (planes, add-on chatbot, reservas,
  usuario extra) coinciden con `subscription-plans.ts`/`pricing.ts`. El único desajuste es esa
  frase: la tarjeta de Crece, más arriba en la misma página, ya dice que trae reservas online
  incluidas, y el propio comentario del código (`pricing.ts:34-35`) documenta
  `publicBookingIncluded desde crece` — la copy del add-on no lo refleja. Detalle en
  `../recorrido/ULTIMO_RECORRIDO.md`.

- **`t_3f352044` (cruce de tenant en Importadora) — REFUTADO, no era del producto.** Verificado el
  2026-09-12: `/api/patients` escribe `audit_logs` siempre y no hubo ningún `PATIENT_CREATED` en
  48h para esa fila — nadie la creó por UI. La sembró otro carril (chatbot-cola) con un `INSERT`
  directo usando la MISMA forma sellada de este carril (`zz-qa-AAAA-MM-DD-HHMM`), así que mi
  barredor se la llevó y la reportó como propia. El producto quedó re-auditado con
  `npm run qa:sin-rastro` (74 tablas, 0 rastros en orgs reales). Comentario completo en la tarea.
  No repetir esta alarma sin evidencia nueva: la forma del prefijo no basta para atribuir un dato.

- **El paso 8 ya factura de verdad, no mira más el cobro vacío** — cerrado el 2026-09-05. Antes
  llegaba a `/billing` y esa pantalla siempre dice "0 facturas · Cobrado Bs 0,00": "OK" sólo
  probaba que la pantalla abra, nunca que cobrar funcione. Ahora, si hay un paciente `zz-qa-` del
  paso 6, el script entra a `/billing/new`, lo elige en el desplegable, carga un ítem manual
  `zz-qa-...-item` (Bs 10) y **envía la factura de verdad**: llega a `/billing/<id>`, la pantalla
  de cobro real con el ítem a la vista, y **ahí FRENA** — nunca la marca pagada. Medido 3 veces
  seguidas en producción (dental), 9/9 completo cada vez y 0 filas `zz-qa-` al cerrar (la factura
  cuelga de la organización, que cascadea en `invoices.organizationId` — `prisma/schema.prisma:832`
  —, y ahora también se IMPRIME antes de borrar, como toda fila `zz-qa-`). Trampa cazada en el
  camino: `page.locator('div', {hasText:'Ítem manual'})` matcheaba la tarjeta del CATÁLOGO, no la
  del ítem manual, porque ese texto también aparece en un párrafo suyo ("Podés cobrar igual con un
  ítem manual, abajo") que sale antes en el DOM — el filtro ahora mira el `<h3>`, no el div entero.
  Ver `scripts/recorrido_cliente.mjs` `facturarZzQa()`.

- **Los CINCO rubros activos, recorridos** — importadora / distribuidora cerró 9/9 el 2026-09-04
  (era el último de la lista). Ganadero y veterinaria no cuentan como pendiente: `RUBROS_ACTIVOS`
  no los ofrece (medido el 2026-09-05 en `onia-platform/lib/platform/rubros-activos.ts`). No queda
  ningún rubro sin recorrer.

- **DENTAL vuelve a cerrar 9 de 9 con la agenda arreglada** — verificado el 2026-09-04 13:09 La
  Paz (`node scripts/recorrido_cliente.mjs --escribir`). El desplegable "Profesional" ya no está
  vacío: la cita `2026-09-07 09:00` entró con **201** (`id cmtmz4d57000m01rwgfxezgt1`) y se VIO
  en `/appointments`. Cerraba el ítem que esperaba la tarea `t_2f5a96b6`, que ya está `done`.

- **El recorrido entero en SERVICIOS PROFESIONALES, el cuarto rubro** — corrido el 2026-09-04
  13:25 La Paz. Llega a **6 de 9** y corta en el paso 7: el formulario de la cita exige
  **"Cliente \*"** y ese desplegable tiene **CERO opciones**, porque ese pack no tiene ninguna
  pantalla donde crear un cliente (`SERVICIOS_NAV_ITEMS`, `lib/platform/vertical-pack.ts`) —
  mientras su tarjeta de venta promete «Agenda, citas, cobros y contabilidad». **Reportado a
  `onia-cola` en el tablero: `t_2b03ea3d`, prioridad 1.** Detalle y captura en
  [`../recorrido/ULTIMO_RECORRIDO.md`](../recorrido/ULTIMO_RECORRIDO.md).
  En el camino se cazaron **dos falsos rojos del propio instrumento** (el mapa del paso 6 y la
  ruta de las capturas), los dos con gate propio en `scripts/recorrido_cliente.test.mjs`.

- **El veredicto cantaba "RECORRIDO COMPLETO" sobre un paso que nunca midió** — cerrado el
  2026-09-03 (`17aaec727`). En importadora el paso 7 salió `no-medido` y el 8 verde; como el
  veredicto miraba `ultimoOk` (el **último** paso verde, no hasta dónde se llegó de corrida),
  valía 8 y el script imprimió "RECORRIDO COMPLETO: los 8 pasos", con `corte: null` en el
  `resumen.json`: el agujero desaparecía hasta del JSON. Ahora "completo" exige que no haya ni un
  paso fuera de OK, y el agujero **tapado por un verde posterior** se enumera aparte. Rojo antes /
  verde después, con los datos reales de esa corrida, en `../recorrido/ULTIMO_RECORRIDO.md`.

- **El recorrido entero en ESTÉTICA Y SPA, el tercer rubro** — cerrado el 2026-09-03 19:09 UTC,
  8 de 8 (`RECORRIDO_RUBRO='Estética y spa' node scripts/recorrido_cliente.mjs --escribir`).
  Vocabulario del rubro correcto de punta a punta ("Clientas", "Buscar clientas…", botón
  "Clienta"), dato cargado y encontrado de vuelta, y el panel **contó la clienta nueva**: pasó de
  "0 clienta(s) nuevas este mes" a "1" entre `paso-06-menu.png` y `paso-08-bandeja.png`. Nada del
  producto se rompió.

- **El recorrido entero en COMERCIO, el segundo rubro** — cerrado el 2026-09-03 16:14 UTC, 8 de 8
  (`RECORRIDO_RUBRO='Comercio / tienda' node scripts/recorrido_cliente.mjs --escribir`). Producto
  cargado en Catálogo, encontrado de vuelta en la lista y visible en el panel; capturas miradas
  una por una. En el camino se cazó un **falso rojo del propio instrumento**: `despejar()` cerraba
  el modal de alta —su botón de cancelar se llama «Cerrar», igual que el del tour— y el relleno
  terminaba escribiendo en el buscador de la lista, así que el informe acusaba al producto de no
  tener botón de guardar teniéndolo. Detalle y evidencia en `../recorrido/ULTIMO_RECORRIDO.md`.

- **Los pasos 6, 7 y 8 cantaban "pantalla a la vista" sobre una pantalla TAPADA** — cerrado el
  2026-09-03. El modal "Primeros pasos" (`fixed inset-0 z-[60]`, el 100 % del viewport) cubría
  `/patients` y `/billing`, y `llegar()` daba OK porque sólo comparaba la URL. Ahora
  `despejar()` cierra el overlay con el botón del propio producto ("Cerrar por ahora") y
  `queTapa()` mide lo que quede cubriendo ≥50 %; `llegar()` exige URL correcta **y** pantalla
  visible. Prueba: `../recorrido/capturas/paso-08b-cobro.png`, que por primera vez muestra
  Facturación y no el modal.
- **El paso 6 no CARGABA ningún dato** — cerrado el 2026-09-03. Ahora crea el paciente
  `zz-qa-<fecha>-paciente` por el camino que ofrece la pantalla (`<a href="/patients/new">`) y
  **vuelve a la lista a buscarlo**. La lista dice "1 paciente". Prueba:
  `../recorrido/capturas/paso-06c-dato-en-la-lista.png`. Con eso el paso 8 tiene por primera vez
  algo que buscar: reporta que el paciente **no** figura en `/dashboard` y que eso no es un fallo
  (el panel no lista pacientes), pero cortaría en rojo si no apareciera en ninguna de las dos.
- **Completar el onboarding para medir los pasos 6, 7 y 8** — hecho el 2026-09-03. El instrumento
  ya camina el asistente entero (pregunta → negocio → horarios → servicios → equipo → listo) y el
  **recorrido llegó a los 8 pasos por primera vez**. La verificación no es haber apretado los
  botones: es que `/dashboard` deje de rebotar, y en la base `onboardingCompletedAt` quedó con
  hora. `/patients`, `/billing` y `/dashboard` fueron vistas renderizadas por primera vez.
- **Crear una cuenta `zz-qa-` de verdad y ver hasta dónde llega** — hecho el 2026-09-03. El alta
  **funciona entera**: crea `auth.users` + `organizations` + `profiles` (ADMIN) + entitlement
  `module.agents` en trial por 14 días, y **manda el correo de confirmación de verdad**
  (`status=sent (250 2.0.0 Ok)` en el log de `onia-mail`, con DKIM). Las filas se borraron en la
  misma vuelta; producción volvió a 4 orgs / 6 perfiles. Detalle en `ULTIMO_RECORRIDO.md`.
- **El falso verde del instrumento** — el script cantaba `RECORRIDO COMPLETO: los 8 pasos` porque
  los pasos 5-8 se daban por buenos con un 200, sin mirar que el producto redirigía las cuatro
  rutas al onboarding. Arreglado con `llegar()`, que compara la URL de llegada con la pedida.

## Reportado a otro carril

- **La documentación miente sobre el alta** — `CLAUDE.md` y los prompts de loop dan por cerrado
  el alta ("`/register` dejó de crear cuentas, `/empezar` es un formulario de «Pedí tu
  acceso»"). Medido el 2026-09-02: `/empezar` tiene **0 campos** y `/register` es un asistente
  vivo de 2 pasos que crea cuentas. Prueba: `../recorrido/capturas/paso-03-pedir-acceso.png`.
  Reproducción: `node scripts/recorrido_cliente.mjs` y mirar el paso 2 del `resumen.json`.
  → carril docs/auditoría. Anotado en el tablero.

## Procedimiento vigente para correr el recorrido entero

Es **UNA sola corrida**:

    node scripts/recorrido_cliente.mjs --escribir     # los 8 pasos de punta a punta

⚠️ **Acá decía "son DOS corridas, y no se puede evitar"**, y mandaba a correr a mano un
`update auth.users set email_confirmed_at=now()`. Las dos cosas son falsas desde que el
instrumento tiene `confirmarComoElCliente()`: lee el `confirmation_token` con un **SELECT**
acotado a `zz-qa-` y **abre el enlace real del mail en el mismo navegador**, igual que el
cliente. Escribir `email_confirmed_at` a mano sería fingir justo el paso que se está midiendo —y
dejaría de avisar el día que el correo no salga—, así que **no se hace**. Un procedimiento
vencido que manda a escribir en `auth.users` es de los peores docs que puede tener este carril.

⚠️ **Todo esto escribe en la base de PRODUCCIÓN** (`supabase-db` del VPS, schema `public`).
Reglas que no se negocian:

- Todo con prefijo `zz-qa-` (el script ya lo hace, incluido el paciente del paso 6).
- **Se borra en la MISMA vuelta**, imprimiendo la fila ANTES de borrarla.
- **Ningún `DELETE` sin `zz-qa-` en el `WHERE`.** Nunca por rango ni por fecha. En
  `access_requests` viven 3 solicitudes reales, y en `patients` hay 1 paciente que **no es
  nuestro**: jamás se toca una fila sin el prefijo.
- **`docker exec` va con `-i`.** Sin `-i` el heredoc nunca llega a psql: **no borra nada y no
  da error**, el comando parece exitoso. Contar las filas después de borrar.
- **Jamás se completa un pago.** Paso 7: se mira la pantalla de cobro, se captura y se FRENA.

Un recorrido entero crea **seis** filas y las seis hay que deshacerlas (medido el 2026-09-03):
`auth.users`, `auth.identities`, `organizations`, `profiles`, `organization_entitlements` y
`patients`. El script las enumera al terminar.
