# La cola — carril `plataforma-v1`

> **Por qué existe este archivo, con fecha.** Sergio Urcullo, 2026-09-05: *"quiero que te
> enfoques en solo los loops que nos lleven a terminar de desarrollar la Onia Platform… tenemos
> unos objetivos nuevos que es, por lo menos, cerrar cinco clientes con la versión 1.0"*.
>
> Al recortar los loops a ese objetivo quedó a la vista un hueco: **ningún carril tenía como
> objetivo terminar `onia-platform`.** El único loop que escribe en ese repo es `chatbot-cola`, y
> su carril es el **chatbot**, que por `CLAUDE.md` es un **add-on, no la oferta**. Esta cola es
> el otro plato de ese loop, que pasa a tener dos: primero el chatbot, después esto.

## Qué es «v1.0» — decidido el 2026-09-05, no inferido

**Los cinco rubros que YA se venden hoy**, y nada más:

| rubro | track |
|---|---|
| Clínica dental | `dentagest-clinical` |
| Estética y spa | `esteticagest-clinical` |
| Comercio / ferretería / tienda | `gestios-general` |
| Importadora / distribuidora (acotado: cotizaciones B2B + costeo) | `proveegest-electrico` |
| Servicios profesionales | `gestios-servicios-profesionales` |

**Fuera de la v1.0:** veterinaria y ganadería. Los dos tienen bloqueo real y escrito en
[`ONIA_CATALOGO_DE_VENTA.md`](../ONIA_CATALOGO_DE_VENTA.md) §2; meterlos es desarrollo nuevo, no
pulido, y aleja el cierre.

## 🔴 Lo que este carril NO debe malinterpretar: `🟡` no es «a medias»

El catálogo lo dice explícito y hay que leerlo antes de tocar nada:

> *"Lo que le falta a un 🟡 es **kilometraje**, no código. La base de producción sigue con **0
> organizaciones de cliente**."*

**Doce módulos están en 🟡.** Ninguno pide que se los reescriba. Piden que alguien los recorra
con datos reales y los MIRE renderizados. Un loop que lea `🟡` como «falta construir» va a
reconstruir doce módulos que ya funcionan — y eso no acerca un cierre, lo aleja.

**Hecho de esta cola =** los cinco rubros de arriba se recorren de punta a punta sin que el
camino se rompa, y lo que un cliente ve nunca contradice lo que el producto hace.

## Ahora

El orden sale de `ONIA_CATALOGO_DE_VENTA.md` §8 *«Lo que hay que cerrar»*, que ya estaba escrito
y sin operar. Acá se opera, con verificación por ítem.

- [x] 🟢 **FANTASMA — el circuito de deploy YA EXISTE. Anotado y cerrado el mismo 2026-09-05,
      sin escribir una línea.** Este ítem decía *"construir el script que implemente los cinco
      pasos del runbook"*. **Falso.** El integrador `onia-cola` lo construyó ese mismo día
      (`81e66ed18`): una tarea puede llevar `DESPLEGAR: landing|plataforma` y el `ok` de Sergio
      Urcullo la ejecuta. Vive en `scripts/kanban/publicar-aprobado.mjs`, desplegado como
      `/root/bin/onia-publicar-aprobado.mjs`, con destino contra **lista blanca** (nunca una ruta
      ni un comando: el cuerpo lo escribe un LLM) y autotest que cubre `landing; rm -rf /`.

      **Cómo se coló el fantasma, porque la lección importa más que el ítem:** busqué `--como` y
      archivos con «deploy» en el nombre dentro de `/root/bin` y `onia-platform`. El publicador no
      se llama así y no vive ahí. **Buscar por el nombre que yo esperaba, y concluir «no existe»
      del vacío, es el mismo error que este carril ya tiene medido al 46%.** Un `grep` sirve para
      descartar, nunca para confirmar — y yo lo usé para confirmar una ausencia.

      Lo que NO es fantasma y sigue abierto es lo de abajo: el circuito existe y espera decisión.

- [ ] 🔴 **Hay arreglos verdes esperando UN `ok` de Sergio Urcullo, y no llegan al cliente.**
      Medido el 2026-09-05 17:5x UTC: dos tareas en `blocked`, creadas 14:43, sin contestar.

      | tarea | destino | lo más caro que destraba |
      |---|---|---|
      | `t_e05a44d7` | `landing` | la tarjeta que se ve al compartir `onia.com.bo` por WhatsApp era una captura con «MUY PRONTO» impresa adentro |
      | `t_8ac57b3f` | `plataforma` | el dueño con el add-on del chatbot **ya pagado** no puede conectar su WhatsApp: 3 de 4 orgs ven un cartel de venta en vez del botón |

      El propio integrador lo cuenta cada vuelta: **plataforma 5 · landing 32** commits sin
      desplegar. **Este loop NO vuelve a avisar de esto**: el integrador ya mide y ya creó el
      pedido; un segundo aviso del mismo hecho es el spam que hizo que nadie leyera el primero.
      Lo que sí hace este carril es **no dar por entregado** un arreglo suyo mientras su pedido
      siga en `blocked` — construido ≠ terminado.

      Evidencia: `hermes-content/docs/cola/plataforma-v1.md` (este archivo) y el runbook
      `onia-platform/.claude/skills/onia-deploy/SKILL.md`. Pedidos: `onia-tablero.sh show t_8ac57b3f`.

- [x] 🔴 **§8 ítem 1 estaba CUMPLIDO, no falso — y la vuelta del 2026-09-05 lo dio vuelta al
      revés. Corregido el mismo día, midiendo contra `origin/master`.** El pendiente decía
      *"terminar el arreglo de servicios profesionales (`/patients` en su nav)"*. **Ya estaba
      hecho:** entró el 2026-09-04 en `5b67bbf` («el rubro no podia cobrar ni tenia donde cargar
      un cliente»), está en `origin/master` y hoy
      `resolveRouteAccess("/patients", SERVICIOS, …)` → `{allowed:true}`.

      **Qué salió mal, que es lo único que vale de este ítem.** La vuelta anterior aplicó el
      método correcto —*medir haciendo el cambio, no razonándolo*— sobre el **árbol equivocado**:
      un worktree **109 commits detrás de `origin/master`**, o sea anterior al arreglo. Ahí
      agregar la entrada al nav sí ponía en rojo `lib/platform/api-route-registry.test.ts` y
      `app/(dashboard)/appointments/page.test.ts`, así que el veredicto salió **invertido**: escribió en el
      catálogo —fuente de verdad de qué se vende— que `/patients` **no debe** estar en ese nav.
      Obedecerlo le sacaba a un rubro vendible la única pantalla donde carga a sus clientes.
      Con el árbol al día los mismos gates dan **60/60 verdes con la entrada puesta**.

      ⚠️ **La lección, que es distinta de la que estaba escrita acá:** un árbol viejo no da un
      rojo obvio, da un **rojo coherente** — con nombres de test reales y un razonamiento que
      cierra solo. El Gate 1 de este carril («¿ya está hecho?») no alcanza si se corre sobre un
      fósil: primero `git merge origin/master`, y recién después medir.
      Verificable: `git rev-list --count HEAD..origin/master` debe dar **0** antes de juzgar.

      **Anclado en código, y todavía NO en `master`:** el gate `agenda-necesita-clientes` (suite
      `lib/platform` de `onia-platform`) exige que todo pack que ofrezca agenda pueda abrir la
      pantalla de sus clientes — sujetos derivados del disco, así que un rubro nuevo nace
      cubierto. Rojo probado sacando la entrada del nav (2 casos fallan, los otros 4 packs
      siguen verdes); verde con ella. Hoy vive en la rama del carril
      (`claude/chatbots-platform-review-0d1d09`) y llega a `master` con el merge de `onia-cola`:
      hasta entonces **no lo puede correr otro carril**, por eso no se cita como ruta.

- [x] 🟢 **FANTASMA — nació del error de arriba y murió con él. Medido el 2026-09-05, sin
      escribir una línea de producto.** Este ítem decía que en `gestios-servicios-profesionales`
      el panel invita a `/patients` con la tarjeta *"Completar contacto"* y el gate la rebota a
      `/dashboard`. **Las dos mitades son falsas**, y las dos se apoyaban en el veredicto
      invertido del ítem anterior:

      1. **Ese rubro nunca ve esa tarjeta.** El panel se ramifica por pack antes de armarla:
         `usaPanelComercio()` manda a servicios profesionales a `comercio-hoy.tsx`
         (`app/(dashboard)/dashboard/page.tsx:116`). La tarjeta vive en `page.tsx`, que sólo
         alcanzan los packs **clínicos** — y ahí `/patients` es suya.
      2. **El gate no rebota nada:** `resolveRouteAccess("/patients", SERVICIOS, …)` →
         `{allowed:true}` con `PLATFORM_LAYER=1`.

      **Cómo se midió, y por qué el instrumento importa:** se cruzaron **todas** las rutas
      internas literales de los tres paneles (`page.tsx`, `panel-hoy.tsx`, `comercio-hoy.tsx`,
      `importadora-hoy.tsx`) contra `allowedSegmentsForPack` de los **cinco** packs de la v1.0,
      derivando los sujetos del disco. Resultado: **cero destinos bloqueados** en los cinco.
      El primer intento usó un patrón estrecho (`href: "…"`) y también dio cero — un cero que no
      probaba nada. Se repitió con un patrón que capta cualquier literal de ruta antes de creerle.

      ⚠️ **Lo que queda anotado, porque el ítem tenía razón en una cosa:** hoy nada impide que
      mañana un panel emita un destino que el pack no puede visitar. No se construye el guard
      ahora —no hay defecto que arreglar y este carril no reescribe lo que funciona—, pero si
      alguna vez aparece uno, la forma correcta es filtrar por `allowedSegmentsForPack` en el
      armado, no caso por caso.

- [x] 🔴 **Add-ons sin consumidor. Medido el 2026-09-05: nada se cobra sin habilitar — pero la
      pantalla que ENTREGA lo cobrado dejaba otorgar las claves muertas. Arreglado ahí.**

      **La mitad «promesa rota cobrada» es FANTASMA, y se midió clave por clave** contra
      `lib/pricing.ts` (fuente única), sobre un árbol con cero commits de atraso respecto de
      `origin/master` — la lección de la vuelta anterior, aplicada antes de juzgar:

      | clave | ¿se cobra? | ¿habilita? |
      |---|---|---|
      | `addon.inventory_advanced` | **no** — dejó de cobrarse el 2026-08-27, la fila de comparación dice «Incluido» en los tres planes | — |
      | `addon.web` | **no** — no aparece en `pricing.ts` | — |
      | `addon.chatbot` | **no** — lo que se cobra es `WHATSAPP_ADDON` (Bs 390), cuya `key` comercial es `"chatbot"` pero cuya feature key es `addon.whatsapp` | sí, vía `addon.whatsapp` |
      | `addon.extra_seats` | sí (Bs 70) | **sí**, por columna: `plan-limits.ts:230` suma `org.extraUserSeats` |

      **Lo que sí estaba roto y nadie había medido: el botón.** `/admin/organizations/[id]/capacidades`
      mostraba el badge «Sin efecto todavía» **y al lado un botón "Otorgar" habilitado**. Sergio
      Urcullo vende el «Chatbot con IA», entra a entregarlo y encuentra dos claves parecidas:
      `addon.chatbot` —el nombre del producto que acaba de cobrar— y `addon.whatsapp`, que es la
      que trabaja. Apretar la primera escribía la fila y la pantalla contestaba **«Activa ·
      otorgada a mano»** con el cliente sin chatbot. **Entre un cartel que avisa y un botón que
      invita, gana el botón.**

      **Arreglado:** una capacidad sin efecto ya no se puede otorgar (12 claves), y **revocar
      sigue permitido** para no dejar atrapada una fila otorgada antes del cambio. La condición
      deriva de `CON_EFECTO_REAL` —ya guardado en las dos direcciones por
      `capacidades-con-efecto.test.ts`—, así que el día que alguien cablee `addon.web` su botón
      se habilita solo: no hay una segunda lista que mantener.

      ⚠️ **El caso que YA cumple cazó un bug en el propio test.** La primera versión buscaba la
      subcadena `disabled`, que aparece en las clases de Tailwind (`disabled:opacity-50`): los 12
      casos pasaban **en verde sin tocar la pantalla**. Lo delató el caso inverso («una capacidad
      con efecto sigue siendo otorgable»), que falló. Se pregunta por el atributo ` disabled=""`.

      Evidencia: `CapacidadesOrg.tsx` + `CapacidadesOrg.render.test.ts` (21 casos, rojo probado:
      12 fallan sin el arreglo). Gates en `/root/loops/onia-platform-chatbot`: `tsc` 0 errores de
      fuente, **3034 tests**, `eslint` 0 errores. Producción medida antes de tocar: cero filas de
      las tres claves (`select "featureKey", count(*) from organization_entitlements group by 1`
      → sólo `addon.whatsapp` 4 y `module.agents` 6), así que el cambio no atrapa ningún dato.

      **NO DESPLEGADO** — commiteado en `claude/chatbots-platform-review-0d1d09`; llega al cliente
      con el pedido de deploy de `plataforma` que ya existe.

      ⚠️ **El carril de la sesión de control midió lo MISMO el mismo día, por su cuenta**
      (rama `claude/onia-v1-servicios-98acde`, ítem de acá abajo). Los dos veredictos
      coinciden y el arreglo del botón es uno solo (`2b4db83`); lo que la duplicación cuesta
      es dos vueltas de dos carriles sobre el mismo pendiente. Se conservan las dos bitácoras
      porque cada una midió algo que la otra no —acá el bug del gate, allá la base de
      producción y el conteo de `/inbox`—, pero **el ítem está cerrado una sola vez**.

- [x] 🟢 **Gate 1 — CONTADO el 2026-09-05. El que mentía era §8, no §2.**
      El pedido original, tal cual estaba escrito:

      > 🔴 **Gate 1 sobre el propio §8: su ítem 1 se contradice con la tabla de rubros del mismo
      archivo.** §8 dice *"terminar el arreglo de servicios profesionales (`/patients` en su nav)
      — es lo único que separa a ese rubro de ser vendible"*, y la tabla de §2 dice del mismo
      rubro *"✅ sí — arreglado y verificado el 2026-08-30"*. **Uno de los dos miente y hay que
      contarlo de nuevo**, no elegir el que convenga: abrir el nav de
      `gestios-servicios-profesionales`, mirar si `/patients` está, y corregir el que esté mal.
      Este carril arrastra la peor tasa medida del sistema — 46% de pendientes fantasma — así que
      esto va primero.

      > Fuente que se contradice: `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md` (§2 contra §8).

      **Cómo se contó.** Ninguno de los dos era «el que convenía»: §8 estaba vencido y §2 estaba
      vencido **en su paréntesis**, no en su veredicto. `/patients` **sí** está en el nav de
      servicios profesionales, etiquetado «Clientes» — y no solo en el repo:

      | dónde | evidencia |
      |---|---|
      | fuente | `lib/platform/vertical-pack.ts:388`, dentro de `SERVICIOS_NAV_ITEMS` |
      | `master` | `git show master:lib/platform/vertical-pack.ts` → la misma línea |
      | **producción** | `{href:"/patients",icon:"group",label:"Clientes",roles:[...F]}` en el bundle de `/opt/onia-platform/runtime-next` (runtime del 2026-09-05 03:07 UTC) |
      | comportamiento | 69 tests verdes: `patients/ficha-por-rubro.test.ts` + `lib/platform/api-guard.test.ts` |

      §2 advertiía que abrirle `/patients` «le daría la ficha clínica a un estudio contable, con
      sus APIs devolviendo 403». **Las dos objeciones ya estaban resueltas**, así que corregir §2
      no fue borrar una advertencia viva: `fichaClinica()` esconde alertas médicas, alergias,
      tipo de sangre, historia clínica y tratamientos —y es **derivada** de si el nav declara
      `/treatments`, no una lista a mano—, y el segmento `patients/*` entero pasó a `CON_AGENDA`,
      así que no hay 403.

      **El conteo destapó un segundo fantasma en el mismo §8: su ítem 3.** Dice que a
      `/requerimientos` hay que «enlazarla desde el nav». Ya está enlazada en **tres**
      (`vertical-pack.ts:175,279,395`), con 12 apariciones en el bundle desplegado. El ítem de
      `/requerimientos` de más abajo arrastraba lo mismo y quedó reescrito.

      **La lección, que vale más que los dos ítems.** Los dos fantasmas eran del **mismo
      archivo**: §8 se escribió una vez como lista de trabajo y **nadie la volvió a contar**
      mientras §2 y el código sí avanzaban. Una lista de pendientes sin fecha de reconteo no
      envejece: **miente**. Y miente hacia el lado caro — manda a construir lo que ya está
      construido, que es exactamente el 46% que este carril tiene medido. Los dos ítems quedaron
      `~~tachados~~` en el catálogo con la fecha del reconteo al lado.

      **Cero cambios de código: no hacía falta ninguno.** El trabajo fue medir y corregir el
      documento.

- [x] 🟢 **Add-ons sin consumidor — CERRADO el 2026-09-05, y la premisa era falsa.**
      El pedido original:

      > 🔴 **Add-ons sin consumidor: o los consume algo, o salen del catálogo.**
      `addon.inventory_advanced`, `addon.chatbot` y `addon.web`. El catálogo ya midió que
      `addon.chatbot` **está muerta y la que trabaja es otra** (revisado 2026-08-30 y 2026-08-31:
      sólo aparece en tests). Un add-on que se cobra y no habilita nada es una promesa rota
      cobrada — el peor defecto posible con un cliente nuevo.

      > Medición previa en `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md` §5.

      **Lo primero, porque cambia el ítem entero: ninguna de las tres se cobra.** El ítem temía
      «un add-on que se cobra y no habilita nada». Contado en `lib/pricing.ts`, lo que se vende hoy
      son seis cosas (`PUBLIC_PRICING_ADDONS`) y **ninguna** está detrás de estas claves: el chatbot
      se cobra y se enciende con `addon.whatsapp`, e «Inventario avanzado» se retiró de la oferta el
      2026-08-27. **La promesa rota cobrada no existía.**

      **Y en la base de producción tampoco hay nada que limpiar** (2026-09-05):

      | clave | filas en producción |
      |---|---|
      | `addon.whatsapp` | 4 activas — Clínica Sergio, Onia interna y dos ZZ QA |
      | `module.agents` | 5 activas |
      | `addon.chatbot` · `addon.web` · `addon.inventory_advanced` | **cero** |
      | columna vieja `inventoryAddon` | `f` en las 6 organizaciones |

      **Lo que SÍ estaba roto, y no era lo que el ítem miraba.** El backoffice marcaba esas claves
      «Sin efecto todavía · Ninguna pantalla ni API lee esta capacidad» **y al lado dejaba apretar
      Otorgar igual**: escribía la fila, quedaba «activa» en la ficha del cliente, y no encendía
      nada. El cartel decía la verdad y el botón la desmentía. No eran tres claves sino **cinco**
      — las tres del ítem más `addon.extra_seats` y `module.public_booking`, que `types.ts` ya
      documentaba desde el 2026-09-01.

      **Arreglado donde está el borde, no donde se ve.** `PATCH
      /api/admin/organizations/[id]/entitlements` ya rechazaba una clave fuera del catálogo
      cerrado (400); ahora rechaza también la que está en el catálogo y no consume nadie (409,
      código distinto a propósito). El botón apagado es la capa de arriba. **Revocar sigue vivo**
      en las dos: cerrar la puerta no puede dejar encerrado lo que alguien otorgó antes.
      Commit `2b4db83` en `onia-platform`; 12 tests nuevos, suite 2979 verde, typecheck limpio.

      **La tercera vía, contra el «o/o» del ítem.** Las claves **no** salen del catálogo: borrarlas
      pierde el rastro de un otorgamiento viejo y rompería 31 usos de test, y `addon.chatbot` ya
      tenía una decisión escrita de no borrarla (`CapacidadesOrg.render.test.ts`: *«no se borró del
      catálogo a propósito»*). Se quedan visibles, marcadas, y **no otorgables**.

      ⚠️ **De paso, un dato de §5 estaba al revés y sostiene una decisión de Sergio Urcullo.**
      Decía que gatear `/inbox` con `addon.whatsapp` «baja una superficie viva — hoy ninguna org
      tiene el add-on». La tienen cuatro. Ninguna es de cliente pagante, así que la conclusión
      aguanta, pero el número no: hacerlo hoy apaga `/inbox` en las dos orgs propias. Corregido
      en §5 con el conteo por organización.

- [ ] 🟡 **`/requerimientos`: ~~huérfana~~ — no lo está. Lo que le falta es kilometraje.**
      ⚠️ Este ítem nació con el fantasma de §8.3 pegado: decía «no la enlaza ningún nav».
      **Falso, medido el 2026-09-05:** la enlazan tres —`proveegest-electrico`,
      `gestios-general` y `gestios-servicios-profesionales` (`vertical-pack.ts:175,279,395`)—
      con 12 apariciones en el bundle desplegado. No hay nada que enlazar ni nada que sacar
      del catálogo.

      Lo que **sí** queda, y es más chico: (a) recorrerla con datos reales, que cae dentro del
      ítem de kilometraje de abajo; y (b) decidir si los dos packs clínicos —dental, estética—
      también la llevan. Hoy no la tienen: un consultorio que quiera pedirle un estudio al
      paciente no tiene camino. Es una decisión de producto de una línea de nav cada una, no
      desarrollo.

      Está listada como módulo en `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md` §4.

- [ ] 🟡 **Recorrer cada módulo 🟡 con datos reales y MIRARLO renderizado**, rubro por rubro de
      los cinco de la v1.0. Es kilometraje, no código: lo que se busca es dónde se rompe el
      camino, no qué reescribir. Se cruza con el loop `recorrido-cliente`, que ya hace esto de
      punta a punta — **leer su cola antes de repetir su trabajo**:
      `hermes-content/docs/cola/recorrido-cliente.md`, la cola de ese loop.

      Los doce módulos 🟡 con su pantalla están en `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md` §4.

- [x] 🟡 **Los agentes de IA (`/agents`) — DECIDIDO Y ATADO el 2026-09-05: corren solos, con cron
      propio, UNA vez al día.** No hace falta una tercera corrección del catálogo: §7 ya dice la
      verdad y ahora hay un gate que la sostiene.

      **La decisión, medida contra producción — no contra el doc:**
      `crontab -l` → `0 11 * * * /root/bin/run-onia-agents-cron.sh` (07:00 La Paz), y
      `/var/log/onia-agents-cron.log` muestra corridas diarias con `http=200`, la última el
      2026-09-05 con `ran:6`. En el contenedor, `AGENTS_RUNTIME=1`. **Se venden como "corren
      todos los días sin que hagas nada", y es cierto.**

      **Y la pantalla NO decía exactamente eso — ese era el defecto real, no la indecisión.**
      `agents-view.tsx` pintaba la cadencia con `Math.round(intervalMinutes / 60)` leyendo el
      intervalo declarado del agente. Como al runtime lo despierta el cron **diario**, un
      `intervalMinutes` más corto no acelera nada: sólo evita el `not_due`. El caso caro es el
      **captador**, que declara `intervalMinutes: 30` → la pantalla mostraba **"corre cada 1 h"**,
      y es el **único rol detrás de un add-on de pago** (`addon.captador`): quien lo comprara leía
      una latencia **24× más rápida** que la que recibe.

      **Alcance medido antes de arreglar:** ninguna org tiene hoy `addon.captador`
      (`select … where "featureKey"='addon.captador'` → vacío), así que el daño estaba **latente**
      — que es justo cuando sale barato atarlo.

      **Arreglado** en `onia-platform` `5922faa` (rama `claude/chatbots-platform-review-0d1d09`):
      la cadencia se topea contra el disparador real y se dice en días
      (`lib/onia-core/modules/agents-cadencia.ts`). El test falló primero en rojo por el motivo
      correcto — `expected 'corre cada 1 h' not to match /cada 1 h/` — y lleva el caso que YA
      cumple, para que un helper que se rinda devolviendo `null` no pase en verde.
      Gates: `tsc` 0 · `vitest` 3072 passed · `eslint` 0 errores.

      ⚠️ **Commiteado, NO desplegado**: el contenedor sigue con el build viejo. Anotado en el
      pedido de deploy que ya existe (`t_0268567b`), no en uno nuevo.

      ⚠️ **`verificar_cola.js` marca `agents-cadencia.ts` como fantasma y NO lo es** — no hay que
      investigarlo de cero la próxima vuelta: el verificador resuelve el repo hermano contra
      `/root/loops/onia-platform`, que es el clon de `master`, y el archivo todavía vive sólo en
      `claude/chatbots-platform-review-0d1d09`. Se apaga solo cuando `onia-cola` mergee. Se
      confirma con `ls /root/loops/onia-platform-chatbot/lib/onia-core/modules/agents-cadencia.ts`.

      Las dos correcciones sucesivas del catálogo están en
      `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md` §7.

- [ ] 🔴 **`/billing/new`: crear factura no lleva a la pantalla de cobro.** Medido el
      2026-09-07 por `recorrido-cliente` con `--escribir`, rubro Clínica dental: se carga un
      ítem manual (Bs 10,00) y se aprieta «Crear Factura». La factura SÍ se crea en la base
      (`invoices` id `cmtqq67wl000q01rwujm8y6lo`, folio `2026-0001`, Bs 10.00) pero la pantalla
      se queda en `/billing/new` sin redirigir a ningún lado, y volviendo a `/billing` (Cobros)
      la lista sigue diciendo «0 facturas / No hay facturas aún» — como si la factura recién
      creada no existiera para esa vista. Tablero: `t_6359aa00`. Capturas:
      `hermes-content/docs/recorrido/capturas/paso-08-cobro.png` (Cobros vacío antes) y
      `paso-08c-factura-creada.png` (formulario con el ítem, antes de apretar Crear Factura).

- [ ] ⚪ **Pendiente fiscal (`SIAT_EMISSION`) para facturar de verdad.** Va último a propósito:
      es un trámite externo, no código, y `/billing` ya funciona sin él. **No bloquea un cierre**
      — bloquea la factura fiscal, que el catálogo ya sabe no prometer. Si un loop se planta acá
      esperando, pierde la vuelta.

      Lo que sí se puede prometer hoy está en `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md` §7.

## Lo que este carril NO hace

- **No toca los dos rubros bloqueados** (veterinaria, ganadería). Están fuera de la v1.0.
- **No reescribe un 🟡.** Ver arriba: le falta kilometraje.
- **No despliega.** El deploy de `onia-platform` tiene su propio runbook y su propio dueño
  (`onia-platform/.claude/skills/onia-deploy/`).
- **No le escribe a un prospecto.** Regla del [`README.md`](README.md) de esta carpeta.

## Cerrado

*(vacío — esta cola se abrió el 2026-09-05)*
