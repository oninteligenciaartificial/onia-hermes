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
      Medido el 2026-09-06 10:35 UTC por `onia-cola`: **tres** destinos con pedido en `blocked`,
      uno por destino, y **ninguno contestado**.

      | destino | cuánto falta por publicar — se DERIVA, no se copia |
      |---|---|
      | `landing` (`onia.com.bo`) | `bash /opt/onia-landing/_deploy/publicar.sh --dry-run` |
      | `plataforma` (`app.onia.com.bo`) | `bash /opt/onia-platform/_deploy/publicar.sh --dry-run` |
      | `bot` (WhatsApp) | `bash /opt/onia/bot/_deploy/publicar.sh --dry-run` |

      ⚠️ **Acá había una columna con las cifras (25 / 3 / 17) y se sacó el 2026-09-06 17:55 La
      Paz, porque un número escrito acá se pudre en una hora.** Cada merge a `main` lo sube y
      cada swap lo baja a cero, así que la tabla mentía casi siempre — y en las dos direcciones:
      de más («quedan 25» cuando ya se publicaron) y de menos («quedan 3» con 27 esperando). Es
      el MISMO defecto que este ítem ya documenta dos párrafos abajo para los IDs de tarea
      escritos a mano, un escalón más arriba: **lo que cambia solo no se copia, se deriva.** Los
      tres comandos salen con código 0 sin tocar producción y ya filtran lo que no viaja al
      navegador; medido así el 2026-09-06 17:38 La Paz daban 27 · 4 · 17 archivos.

      ⚠️ **La plataforma SE PUBLICÓ el 2026-09-06 a las 17:08 UTC (13:08 La Paz), y esta tabla
      decía lo contrario — corregido a las 19:45 UTC por `onia-cola`.** Decía «22 sin desplegar,
      corre `build-545dd28`». Hoy corre `build-5fc8bcd` y los **trece** shas que el pedido
      prometía están adentro (`8b420b6 38bcf8a 195349b 2099778 5922faa 30526c3 5fc333d ad2d45f
      3fe2db9 06b68c9 a797954 df3e645 bcdfd79`, verificados uno por uno con
      `git merge-base --is-ancestor <sha> 5fc8bcd`): el alta sin horarios, el corte del mediodía,
      los dos rubros que el panel negaba, el botón Otorgar sin efecto, la Planilla sin camino y
      las métricas del asistente **están vivos**. El pedido siguió `blocked` igual, así que le
      pedía a Sergio Urcullo un `ok` **por trabajo ya hecho** — el modo de falla que este ítem
      describe, pero al revés: no «dice resuelto sobre lo pendiente», sino **«dice pendiente
      sobre lo resuelto»**, y de ese lado nadie sospecha porque el pedido sigue ahí, prolijo y
      ejecutable. Cerrado con su evidencia; los **3** arreglos posteriores tienen pedido nuevo,
      porque el cuerpo del viejo no los describía y el cuerpo es lo único que él lee.

      **La cifra de la tabla se saca del publicador, no de `git log`.** `bash
      /opt/onia-platform/_deploy/publicar.sh --dry-run` (y su gemelo de `onia-landing`) filtra lo
      que no viaja al navegador: el mismo día `git log --since` crudo daba **42** para landing, el
      cuerpo de la tarea decía **24** y el publicador **25**. Sólo la última es accionable.

      **Este loop NO vuelve a avisar de esto**: el integrador ya mide y ya creó el pedido; un
      segundo aviso del mismo hecho es el spam que hizo que nadie leyera el primero. Lo que sí
      hace este carril es **no dar por entregado** un arreglo suyo mientras su pedido siga en
      `blocked` — construido ≠ terminado.

      ⚠️ **Acá había DOS IDs de tarea escritos a mano (`t_e05a44d7`, `t_8ac57b3f`) y los dos
      caducaron — corregido el 2026-09-06.** Hoy figuran `archived` y **`done`**, y el ítem
      remataba con *«Pedidos: `onia-tablero.sh show t_8ac57b3f`»*: quien lo obedecía leía
      **`done`** y concluía que la plataforma ya se había desplegado, con **22 arreglos** que el
      cliente no ve. Un pedido de deploy **se rehace** cuando su evidencia envejece (el `edit` del
      tablero no cambia el cuerpo), así que el ID viejo muere y el nuevo no está escrito en
      ningún lado — el ID rota **en la dirección cara**: dice «resuelto» sobre lo que sigue sin
      publicar. Es el mismo remedio que ya se le aplicó al comando de deploy, un escalón más
      arriba: **el pedido vivo se DERIVA, nunca se copia de una medición anterior.**

      ```sh
      # los pedidos vivos, sin IDs escritos a mano (uno por destino, o sobra/falta uno):
      for id in $(/root/bin/onia-tablero.sh list | grep -E '^[⊘▶◻]' | awk '{print $2}'); do
        d=$(/root/bin/onia-tablero.sh show "$id" | grep -iE '^DESPLEGAR:')
        [ -n "$d" ] && echo "$id  $d"
      done
      # 2026-09-06 devuelve exactamente 3 lineas: bot, landing, plataforma.
      # Ojo: NO usar `show | grep -q &&`, que cierra el pipe antes de tiempo y el
      # tablero remata con un BrokenPipeError que se lee como si fallara.
      ```

      Evidencia: `hermes-content/docs/cola/plataforma-v1.md` (este archivo) y el runbook
      `onia-platform/.claude/skills/onia-deploy/SKILL.md`.

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

      **Anclado en código y YA en `master`:** el gate
      `onia-platform/lib/platform/agenda-necesita-clientes.test.ts` exige que todo pack que
      ofrezca agenda pueda abrir la pantalla de sus clientes — sujetos derivados del disco, así
      que un rubro nuevo nace cubierto. Rojo probado sacando la entrada del nav (2 casos fallan,
      los otros 4 packs siguen verdes); verde con ella.
      *(Acá decía «todavía NO en `master`… hasta entonces **no lo puede correr otro carril**, por
      eso no se cita como ruta». **Venció**: `onia-cola` mergeó la rama y el 2026-09-06 el gate
      corre desde `master` — `npx vitest run lib/platform/agenda-necesita-clientes.test.ts` →
      **6 tests verdes, exit 0**. Ya se cita como ruta y cualquier carril lo puede correr.)*

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
      | comportamiento | 69 tests verdes: `app/(dashboard)/patients/ficha-por-rubro.test.ts` + `lib/platform/api-guard.test.ts` |

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

- [x] 🟡 **`/requerimientos`: CERRADO el 2026-09-06 — la tenían los SIETE packs desde siempre.
      Y midiendo eso apareció la que de verdad no tenía camino: la Planilla.**

      Este ítem se corrigió una vez (§8.3 decía «no la enlaza ningún nav»; falso) y **quedó
      corregido a medias**: pasó a decir que la llevan tres packs y que los dos clínicos «hoy
      no la tienen». **También falso.** Medido, no grepeado:

      ```
      Object.entries(VERTICAL_PACKS).map(([id, p]) => [id, p.nav.map(n=>n.href).includes("/requerimientos")])
      → los 7 packs: true
      ```

      **Por qué las dos correcciones fallaron igual, que es la parte que sirve.** Las dos
      grepearon `vertical-pack.ts` y encontraron 3 hits. Pero el pack dental **no declara su
      nav**: es `sidebarNavItems` por referencia (`vertical-pack.ts:99`), y estética y
      veterinaria la derivan con `navClinicaDe()`, que mapea el MISMO array renombrando dos
      rótulos. El href vive en `components/layout/navigation.ts:87` — un archivo que el grep
      nunca tocó. **Un `grep` sirve para descartar, nunca para confirmar una ausencia**, y acá
      confirmó dos veces la misma ausencia inexistente. La forma barata de no repetirlo:
      preguntarle al pack YA construido, no al archivo donde uno espera que esté escrito.

      ✅ **Y la medición correcta encontró un agujero real, que se arregló en la misma vuelta:
      `/rrhh` (Planilla) no tenía camino en los tres packs clínicos.** Misma familia exacta que
      `/requerimientos` y `/empresa`: segmento COMÚN, permiso concedido, **camino ausente**. La
      única puerta del pack dental era un botón adentro de `/team`, puesto ahí a propósito
      porque esta nav estaba congelada por snapshot. No alcanza: «Equipo» son los USUARIOS del
      sistema y «Planilla» los EMPLEADOS — una clínica con 4 empleados que no usan el sistema
      no tiene motivo para abrir Equipo, así que su planilla (**plan professional+, o sea
      PAGA**) sólo aparecía tipeando la URL. Dental y estética son **2 de los 5 rubros de la
      v1.0**.

      Arreglado en `onia-platform` `ad2d45f` (rama `claude/chatbots-platform-review-0d1d09`):
      entra Planilla al grupo «dinero» de `navigation.ts`, y va con el gate que cierra la clase
      —`lib/platform/caminos-transversales.test.ts`— que **deriva sus sujetos de
      `COMMON_SEGMENTS` menos una lista de EXENTOS con su motivo**, así una transversal nueva
      nace cubierta y hay que eximirla a mano, a la vista. Falló primero en rojo nombrando los
      3 packs, y lleva dos casos que YA cumplen (que ningún exento sea un nombre inventado; que
      la lista de sujetos no quede vacía), porque un filtro que devuelve `[]` pasa en verde.

      El fixture y los 3 snapshots congelados de la nav se actualizaron **a propósito y con su
      motivo**: eso es el guardia funcionando, no drift. El diff de snapshots son 50 líneas
      agregadas y **0 borradas**, todas `/rrhh`.
      Gates: `tsc` 0 · `vitest` 3078 passed · `eslint` 0 errores · `iconos-en-la-fuente` 35/35.

      ⚠️ **Commiteado, NO desplegado** — el contenedor sigue con el build viejo
      (`BUILD_ID 3OJpL4LsTtarEkANQEORf`). Anotado en el pedido de deploy que ya existe
      (`t_0268567b`), no en uno nuevo.

      ⚠️ **Lo que NO se hizo y no hay que darlo por hecho:** no se miró el sidebar renderizado.
      El riesgo visual de esta clase de cambio es uno solo y conocido —que el icono salga como
      palabra, el bug más famoso del proyecto— y lo cubre `scripts/iconos-en-la-fuente.mjs`,
      que corrió verde; `badge` además ya se dibuja hoy en producción para los otros tres
      packs. Mirarlo entero cae dentro del ítem de kilometraje de abajo, después del deploy.

      ⚠️ **`verificar_cola.js` marca `caminos-transversales.test.ts` como fantasma y NO lo es**
      — misma causa ya anotada para `agents-cadencia.ts`: el verificador resuelve el repo
      hermano contra `/root/loops/onia-platform`, el clon de `master`, y el archivo todavía
      vive sólo en la rama. **El gate ya salía en exit 1 antes de esta vuelta** por el mismo
      motivo (`app/(dashboard)/patients/ficha-por-rubro.test.ts`, línea 185); no es una regresión de este
      cambio y se apaga solo cuando `onia-cola` mergee. Se confirma con
      `ls /root/loops/onia-platform-chatbot/lib/platform/caminos-transversales.test.ts`.

      Recorrer `/requerimientos` con datos reales sigue vivo, y cae en ese mismo ítem.
      Está listada como módulo en `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md` §4.

      ⚠️ **La explicación de arriba está VENCIDA — medido el 2026-09-06.** Decía que el rojo del
      gate se apagaría solo «cuando `onia-cola` mergee», y ya mergeó: `HEAD` del worktree de
      `onia-platform` **es ancestro de `origin/master`** y aun así
      `app/(dashboard)/patients/ficha-por-rubro.test.ts` **no existía con ese nombre** (`ls` da *No such file*). O sea
      el fantasma de las líneas 185 y 283 dejó de ser «todavía no llegó» y pasó a ser una
      referencia a un archivo que no está: o lo renombraron en el merge, o nunca entró. Hay que
      buscarlo y corregir las dos líneas, no volver a esperar.

      ✅ **BUSCADO Y CORREGIDO el 2026-09-06.** El archivo **existe**: es
      `app/(dashboard)/patients/ficha-por-rubro.test.ts`. Lo que estaba mal era la RUTA escrita
      en esta cola, no el archivo — un fantasma del que citaba, no del que se citaba. Se
      encontró en un comando (`find . -name 'ficha-por-rubro*'`), después de que dos vueltas lo
      dieran por desaparecido con `ls` sobre la ruta equivocada: **un `ls` que falla prueba que
      NO está ahí, nunca que no está.** Las tres citas quedaron con la ruta completa.

- [x] 🟡 **Recorrer cada módulo 🟡 con datos reales y MIRARLO renderizado**, rubro por rubro de
      los cinco de la v1.0. Es kilometraje, no código: lo que se busca es dónde se rompe el
      camino, no qué reescribir. Se cruza con el loop `recorrido-cliente`, que ya hace esto de
      punta a punta — **leer su cola antes de repetir su trabajo**:
      `hermes-content/docs/cola/recorrido-cliente.md`, la cola de ese loop.

      Los doce módulos 🟡 con su pantalla están en `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md` §4.

      **Avance 2026-09-06 — primera tanda MIRADA: 8 módulos 🟡 en dental, y los ocho están sanos.**
      Capturados con la sesión real del dueño (`scripts/mirar_bandeja_dueno.mjs --email
      oninteligenciaartificial+qachatbot@gmail.com --ruta /X`, org `zz-qa-clinica-chatbot-9k651`,
      plan professional) y **abiertos y leídos uno por uno**, no contados por exit 0:
      `/billing` (2 facturas reales, cobrado Bs 100), `/contabilidad` (IVA/IT del mes, con la
      salvedad "no reemplaza la declaración en el SIAT"), `/rrhh` (planilla con SMN 3.300 y bono
      de antigüedad), `/agents` (los dos agentes activos, "corre cada 24 h", 1 acción esperando
      aprobación), `/empresa`, `/communications`, `/reports`, `/requerimientos`.
      Capturas en `/root/capturas-amarillos/`. **Ninguno pide código: es kilometraje, como decía
      el catálogo.**

      **Lo que sí apareció, y no estaba en ninguna pantalla: el catálogo vendía un módulo que no
      existe.** §4 declaraba «Operaciones» con pantalla `/operations`, y esa ruta **no existe** —
      `next.config.ts:80` la redirige a `/dashboard`, no está en ninguna nav, ni en
      `route-access.ts`, ni en `vertical-pack.ts`. La redirección es lo que lo mantuvo vivo: quien
      tipeaba la URL no veía un 404, veía el panel, así que ni un barrido de enlaces rotos podía
      encontrarlo. Con él, otros tres: `/accounting` (redirige a `/contabilidad`), la fila de
      Agentes que decía «no corren solos» cuando **§7 del mismo archivo** dice desde el 2026-08-30
      que sí (subvender una capacidad real), y `/requerimientos` marcada «pantalla huérfana, cero
      `href` en todo el repo» cuando está en `navigation.ts:100`.

      **Arreglado y atado** en §4 del catálogo + `scripts/catalogo_modulos_vivos.mjs`: cruza cada
      ruta declarada contra el árbol de rutas del producto (`onia-platform`, carpeta del dashboard) y exige que §4 no contradiga a §7.
      Falló primero en rojo por el motivo correcto (2 pantallas fantasma + 1 contradicción) y
      lleva el caso que YA cumple, para que no apruebe en verde sin encontrar nada. Si no ve el
      repo hermano sale con 2 (NO MEDIDO), nunca verde.

      ⚠️ **«Atado» no era cierto hasta el 2026-09-06 15:5x UTC: el gate existía y no lo corría
      nadie** — ni estaba en la cadena `npm test` ni tenía un `npm run` que lo invocara. Y no era
      un olvido: cablearlo tal cual **ponía `main` en rojo por AMBIENTE**, porque su `--self-check`
      exigía el árbol del repo hermano y devolvía **1** cuando no lo encontraba (reproducido
      apuntando los tres candidatos a rutas inexistentes). Ese rojo traba el merge de los quince
      carriles por algo ajeno al cambio de cualquiera. `guards-cableados` no podía verlo: ata los
      `test:*` **declarados**, y éste nunca se declaró — la misma lista-de-inclusión que ya falló
      abierto en otros gates. **Arreglado** (`onia-cola`): el self-check pasó a ser **puro**
      (prueba las dos direcciones contra `scripts/`, con `scripts/loops` como la pantalla que SÍ
      existe) y la ausencia del hermano la sigue reportando `medir()` con su exit 2. Verificado
      por mutación: rompiendo el detector en cada dirección, el self-check se pone rojo por el
      motivo correcto. Ahora corre en la cadena como `test:catalogo-instrumento`, y la medición
      viva es `npm run catalogo:modulos-vivos`.

      **Avance 2026-09-06 — segunda tanda MIRADA: los 9 módulos del pack de comercio
      (`gestios-general`), y los nueve están sanos.** Org `zz-qa-ferreteria-tornillo-ommbt`
      (trial vencido el 2026-08-30, **extendido al 2026-10-06** para poder medir), cuenta
      `oninteligenciaartificial+qacomercio@gmail.com`, capturados con
      `scripts/mirar_bandeja_dueno.mjs --ruta /X` y **abiertos y leídos uno por uno**:
      `/comercio` (catálogo), `/comercio/inventario`, `/comercio/caja`, `/comercio/fiados`,
      `/comercio/clientes`, `/contabilidad`, `/rrhh`, `/empresa`, `/requerimientos`.
      Capturas en `/root/capturas-comercio/`.

      La org tiene **cero productos**, así que lo que se recorrió es el **estado vacío** — que es
      el primer camino de todo cliente nuevo, y es donde ya se rompió el de horarios («Saltar por
      ahora» dejaba la agenda muerta). Acá **ninguno queda muerto**: cada pantalla vacía dice qué
      falta y ofrece la salida («Cargá el primero con el botón Nuevo producto», «Tus clientes
      aparecen acá solos → Ir a la caja», «Los fiados se registran desde la caja»). Vocabulario de
      comercio correcto (catálogo/productos/clientes, nunca «pacientes») y ninguna exhibe obra.

      ⚠️ **Un falso positivo que cuesta caro y que conviene no volver a pagar:** en la primera
      pasada `/comercio/caja` salió con **«Algo salió mal — ha ocurrido un error inesperado»**, la
      cara exacta de un bug del producto. No lo era: un chunk de JS
      (`/_next/static/chunks/2hdoqbwoi0rkc.js`) había devuelto **522 transitorio**, y el error
      boundary de `app/(dashboard)/error.tsx` atrapa eso igual que a un fallo real. El chunk
      **existe en el build vivo** (17.794 B) y responde 200 en tres intentos; recapturada, la caja
      se ve entera. Lo delator ya estaba impreso: el propio script escribe `respuestas >=400:` en
      su log y **yo miré la foto sin leer el log**. La captura sola no alcanza —
      se miran **las dos**, y antes de tocar código se descarta el chunk caído.

      **Falta:** importadora, estética y servicios profesionales. Importadora tiene org
      (`bolivian-electricidad-e6t21`) pero es de un **cliente real y su dueño es la cuenta de
      Sergio Urcullo** — mirarla no se hace con una sesión ajena sin avisar; **estética y
      servicios profesionales no tienen ninguna org en producción**, así que hay que darlas de
      alta antes de poder mirarlas.

      **Avance 2026-09-06 — el bloqueo de «no hay a quién mirar» está levantado para estética.**
      Recontado primero contra la base, no contra este doc: las 5 orgs de producción eran 3 de
      dental, 1 de comercio y 1 de importadora — cero de estética y cero de servicios
      profesionales, tal como decía. Ahora hay una org de estética **dada de alta por el alta
      REAL de producción**, no insertada por SQL: `zz-qa-estetica-modulos-6tzgb`,
      `verticalTrackId=esteticagest-clinical`, plan `professional`, trial al 2026-10-06.
      Instrumento nuevo y reusable: `scripts/alta_qa_rubro.mjs`
      (`--rubro "Estética y spa" --negocio "ZZ QA Estetica Modulos"`), idempotente — la segunda
      corrida encuentra la org y **no** crea una segunda.

      Se hace por la pantalla y no por SQL a propósito: insertar la org saltearía justo lo que
      hay que verificar y dejaría un sujeto que el producto nunca construyó (sin onboarding, sin
      las filas que el alta escribe). Mirar módulos sobre eso no probaría nada del cliente real.
      De paso quedó medido que **el alta de estética funciona de punta a punta**: ofrece el
      rubro, acepta el formulario y crea la org con el track correcto.

      ⚠️ **Dónde se retoma, y por qué no se miró ningún módulo todavía:** la sesión del dueño
      entra (magiclink OK, correo confirmado con el token real del mail) pero la app la **manda a
      `/onboarding`**, porque la org nueva no lo completó — `onboardingCompletedAt` es null y el
      redirect es global, así que **ninguna** ruta de módulo se puede mirar hasta pasarlo.
      Próximo paso concreto: completar el onboarding de esa org por la UI (no marcando la columna
      a mano: eso fingiría el paso y dejaría la org sin la agenda por defecto ni el resto de lo
      que el onboarding escribe), y recién ahí recorrer los 8 🟡 transversales con
      `scripts/mirar_bandeja_dueno.mjs --email zz-qa-estetica-modulos@onia.com.bo --ruta /X`.

      **Avance 2026-09-06 — el onboarding se recorrió por la UI y estética quedó mirable. Y el
      recorrido encontró el defecto que mata el primer día de un cliente nuevo.**
      Instrumento: `scripts/onboarding_por_la_ui.mjs` (los 6 pasos, captura de cada uno en
      `/root/capturas-onboarding-estetica/`, veredicto contra la BASE y no contra la pantalla).
      Se entra por «Completar el formulario», nunca por «Buscar mi negocio»: ese botón dispara la
      extracción con IA, que es gasto. `onboardingCompletedAt` pasó de null a `2026-09-06 12:07`.

      🔴 **El paso de horarios viene con los SIETE días en «Cerrado» y `Continuar` HABILITADO**,
      bajo una bajada que dice *"La agenda no va a aceptar citas fuera de este horario"*. Quien
      aprieta el botón grande —el camino por defecto, no el de saltear— termina el alta con la
      agenda muerta: **0 filas en `doctor_schedules`**, el modal de Agendar Cita con «Profesional»
      vacío y el botón apagado **sin decir por qué**, y la pantalla de cierre celebrando el alta
      con un tilde verde y «HORARIOS: Sin cargar». Capturas: `/root/estetica-nueva-cita.png` y
      `/root/capturas-onboarding-estetica/{03-horarios,06-listo}.png`.

      **El código YA está arreglado y el defecto sigue vivo igual: falta el deploy.**
      `diasAgendaParaAlta` (`lib/onboarding/horarios-agenda.ts`) tiene el piso `JORNADA_POR_DEFECTO`
      desde `195349b` (06-sep), pero producción corre `build-545dd28` (05-sep) —casado por
      `BUILD_ID`— y `git merge-base --is-ancestor 195349b 545dd28` da **falso**. Evidencia
      comentada en el pedido de deploy que ya existía, `t_0268567b`; **no se abrió una tarea
      nueva**: el título de esa dice «quien se salta un paso» y el hallazgo la ensancha (también
      le pasa a quien NO saltea).

      **Atado para que no vuelva a pasar mudo:** el recorrido exige agenda si el alta *mostró* el
      paso de horarios — el sujeto sale de lo observado, no de una lista de rubros, así que un
      rubro nuevo nace cubierto. Y hay `--solo-agenda` para medir una cuenta ya dada de alta sin
      volver a crear una org. Probado en las dos direcciones: **exit 1** sobre estética (0 filas)
      y **exit 0** sobre la dental de QA (7 filas) — un gate que sólo prueba el rojo pasa igual
      estando roto. Es también el chequeo del swap: tras el deploy tiene que dar exit 0.

      **Falta:** un defecto de copy chico, con su reproducción: entrando por «Completar el
      formulario», el paso 2 encabeza *"No pudimos encontrar tus datos, así que los cargamos
      juntos"* — nunca se buscó nada, porque el cliente eligió cargarlos a mano
      (`/root/capturas-onboarding-estetica/02-negocio.png`, bajada de `paso-negocio`).

      **Avance 2026-09-06 — tercera tanda MIRADA: los 13 módulos de estética, y DOS hablaban en
      dental.** Org `zz-qa-estetica-modulos-6tzgb`, cuenta `zz-qa-estetica-modulos@onia.com.bo`,
      capturas en `/root/capturas-estetica/` **abiertas y leídas una por una** (y el log de cada
      corrida junto a la foto: cero respuestas ≥400, así que ningún error boundary de chunk caído
      se leyó como bug del producto). Sanas y con vocabulario correcto —«clientas», «tu centro de
      estética»— las once: `/patients`, `/agenda`, `/appointments`, `/dashboard`, `/inventory`,
      `/billing`, `/contabilidad`, `/rrhh`, `/empresa`, `/communications`, `/reports`,
      `/requerimientos`. Los estados vacíos ofrecen la salida en todos.

      🔴 **Las dos que no: `/treatments` decía «Catálogo de servicios y precios de tu clínica» y
      `/agents` ofrecía «Recall — reactivación de pacientes».** Un centro de estética no es una
      clínica y no tiene pacientes. **Arreglado y atado** en `581afdf` (`onia-platform`, rama del
      carril): `lib/onia-core/modules/agents-rotulos.ts` (nuevo, puro, del que `AGENT_KINDS`
      IMPORTA sus rótulos en vez de tenerlos escritos otra vez) + `agents-view.tsx` traduciendo en
      **las dos ramas** —la org sin agentes pinta el catálogo, la que ya los tiene pinta lo
      guardado en la fila, sembrado en dental— + `app/(dashboard)/treatments/page.tsx` leyendo el vocabulario y
      titulándose con el rótulo del menú que el dueño tocó (la veterinaria lo llama «Servicios» y
      la pantalla se titulaba «Tratamientos»). Gates en `lib/onia-core/modules/agents-rotulos.test.ts`
      y `lib/platform/copy-de-pantallas-compartidas.test.ts`, con sujetos derivados de
      `VERTICAL_PACKS` y verificados en ROJO reinyectando el defecto en su forma real.
      Verde: tsc 0 · vitest 3135 · eslint 0 errores. **Commiteado, NO desplegado.**

      **La lección, que vale más que las dos pantallas:** todos los barridos de este proyecto
      persiguen texto PROHIBIDO. Acá **no sobraba ninguna palabra** — «tu clínica» es copy
      legítimo, y correcto, en el rubro que lo escribió. Lo que estaba mal era el par
      (rubro, texto), y eso no se juzga leyendo el texto: hay que abrir la pantalla **con la
      sesión del rubro equivocado**. Misma familia que `/v1/empezar` ofreciéndole «Historia
      clínica con odontograma» a un lead de Comercio. Un rubro derivado de otro (estética y
      veterinaria salen del pack clínico con `navClinicaDe()`) es donde más barato sale heredar
      el idioma del padre.

      Se buscó una tercera instancia y **no se reprodujo**: `app/(dashboard)/settings/PlanClient.tsx` tiene
      «Para clínicas que quieren automatizar…», pero con el ancla puesta el instrumento se negó a
      sacar la captura porque ese texto **no está** en `/settings` de estética. No se reporta lo
      que no se vio.

      ⚠️ **Acá decía «Falta: importadora — mirarla necesita el OK de Sergio Urcullo», y ese
      bloqueo estaba VENCIDO:** nació antes de `scripts/alta_qa_rubro.mjs`, que da de alta una org
      QA propia sin tocar la del cliente (`bolivian-electricidad-e6t21`). Se resolvió en la quinta
      y la sexta tanda, más abajo — **no hacía falta ningún OK.**

      **Avance 2026-09-06 — cuarta tanda MIRADA: los 12 módulos de servicios profesionales, y
      la CAJA le habla en comercio.** Org `qa-modulos-mrk0q` (`gestios-servicios-profesionales`,
      plan professional, trial al 2026-09-20), cuenta `zz-qa-servicios-modulos@onia.com.bo`, dada
      de alta por el alta REAL y con el onboarding recorrido por la UI (`onboardingCompletedAt`
      null → `2026-09-06 15:05`). Capturas en `/root/capturas-servicios/` **abiertas y leídas una
      por una**, con el log de cada corrida al lado: **cero respuestas ≥400 en las doce**, así que
      ningún error boundary de chunk caído se leyó como bug del producto.

      Sanas y con vocabulario propio del rubro —«tu estudio», «Clientes», «Servicios», nunca
      «pacientes» ni «tu clínica»— once: `/dashboard`, `/comercio` («Servicios», «0 servicio(s)
      cargados», «Cargá el primero con el botón «Nuevo servicio»»), `/patients` («Clientes»,
      «Agregar primer cliente»), `/agenda`, `/appointments` («la disponibilidad de **tu
      estudio**»), `/comercio/fiados`, `/requerimientos`, `/contabilidad`, `/team`, `/rrhh`,
      `/empresa`. Los estados vacíos ofrecen la salida en todos.

      ✅ **La que no era `/comercio/caja` — arreglada el 2026-09-06, ver abajo.** Con cero servicios cargados, el bloque «Registrar venta»
      dice *«Todavía no hay **productos vendibles**. Cargá el primero en el **catálogo** (con
      precio y **stock**)»*. Un estudio contable o jurídico no vende productos, no tiene catálogo
      —su menú y su pantalla se llaman **Servicios**— y **un servicio no tiene stock**. Y se
      contradice con su propia hermana: `/comercio` ya deriva el idioma del pack (`esServicios`)
      y dice «0 servicio(s) cargados», así que la caja manda al cliente a una pantalla que en su
      menú no existe con ese nombre, a cargar un dato que su rubro no tiene.
      Captura: `/root/capturas-servicios/comercio-caja.png`.

      ✅ **ARREGLADO el 2026-09-06** en `9c72275` (`onia-platform`, rama del carril). No era un
      texto sino **seis**: el estado vacío, los tres errores del carrito, la etiqueta del picker y
      la columna de la tabla — todos escritos en comercio. La señal se deriva del pack en
      `lib/comercio/idioma-de-venta.ts` (nuevo, puro), y **`CajaPantalla` la lee de la ORG, no de
      la sesión**: así el banco `/dev/demo`, que monta ese mismo componente sin sesión, tampoco
      queda hablando en comercio. Un estudio lee ahora *«Todavía no hay servicios vendibles.
      Cargá el primero en Servicios (con precio)»* — sin stock, y con el nombre que esa pantalla
      tiene **en su menú**.

      **Avance 2026-09-06 — quinta tanda: importadora ya tiene a quién mirar, y la pantalla de
      créditos le hablaba como a una tienda de barrio.** El bloqueo escrito acá («su única org es
      de un cliente real, mirarla necesita el OK de Sergio Urcullo») estaba **vencido**: nació
      antes que `scripts/alta_qa_rubro.mjs`, que da de alta una org QA propia sin tocar la del
      cliente. Org `qa-modulos-rj7tv` (`proveegest-electrico`, plan professional, trial al
      2026-09-20), cuenta `zz-qa-importadora-modulos@onia.com.bo`, dada de alta por el alta REAL
      y con el onboarding recorrido por la UI (6/6 pasos OK, `onboardingCompletedAt` null →
      `2026-09-06 17:05`, 5 filas de `doctor_schedules` escritas por el paso de equipo, cero
      respuestas ≥400). Capturas en `/root/capturas-onboarding-importadora/`.

      **7 de los 13 módulos del pack MIRADOS**, capturas en `/root/capturas-importadora/`
      abiertas y leídas una por una, con el log de cada corrida al lado (**cero respuestas ≥400**
      en las siete, así que ningún error boundary de chunk caído se leyó como bug del producto).
      Sanas seis: `/dashboard`, `/comercio` (catálogo, «productos» es correcto acá: una
      importadora sí vende cosas con stock), `/comercio/inventario`,
      `/importadora/cotizaciones` («Cotizaciones B2B», estado vacío con salida),
      `/importadora/costeo` y `/importadora/reprecio` — estas dos, excelentes y muy propias del
      rubro (FOB, GA, subpartida NANDINA, TCO oficial del BCB, DS 5646, y *«el sistema no
      inventa tasa»*).

      🔴 **La que no: `/comercio/fiados`.** Su menú la llama **«Créditos»** y la pantalla se
      titulaba **«Fiados y deudas»**, hablaba de *«fiados del mostrador»*, mostraba el KPI *«En la
      calle»* y remataba con *«Los fiados se registran desde **la caja**»* — y **la caja no está
      en el menú de importadora**. El estado vacío, que es el primer camino de todo cliente
      nuevo, mandaba al dueño a una pantalla que él no tiene, a registrar algo que su negocio no
      hace: un importador B2B no fía en el mostrador, da crédito comercial contra factura.
      Captura: `/root/capturas-importadora/comercio-fiados.png`.

      ✅ **ARREGLADO y atado** en `1f96d16` (`onia-platform`, rama del carril). No era un texto
      sino **seis**: título, bajada, KPI, encabezado de sección, estado vacío y contador por
      cliente. `lib/comercio/idioma-de-credito.ts` (nuevo, puro) **deriva** todo del pack —el
      rótulo que ese pack le pone a la pantalla en su menú, y si la caja está en ese menú—, así
      que un rubro nuevo nace cubierto; y se lee de la **ORG**, no de la sesión. Gate
      `lib/comercio/idioma-de-credito.test.ts` con sujetos derivados de `VERTICAL_PACKS`,
      verificado en ROJO reinyectando el defecto en su forma real. Verde: tsc 0 · vitest 3163 ·
      eslint 0 errores. **Commiteado, NO desplegado** (sha comentado en `t_0268567b`).

      ⚠️ **Y no era un rubro suelto: `gestios-servicios-profesionales` la llama «Por cobrar» en su
      menú y leía exactamente lo mismo.** Son **2 de los 4 packs** que tienen esta pantalla. En la
      tanda anterior miré `/comercio/fiados` con la sesión de servicios profesionales y **la di
      por sana**: el defecto no se ve leyendo el texto —«fiado» es copy correcto y bien escrito—,
      se ve cruzando el texto contra **el nombre que esa misma pantalla tiene en el menú del
      rubro**. Una pantalla mirada no queda cubierta para siempre: queda cubierta para el eje que
      se miró.

      ✅ **Eso ya se hizo — los 6 transversales de importadora (`/inbox`, `/requerimientos`,
      `/empresa`, `/contabilidad`, `/team`, `/rrhh`) se miraron en la sexta tanda, más abajo.**
      El comando que se usó, que sirve para cualquier rubro:
      `node scripts/mirar_bandeja_dueno.mjs --email zz-qa-importadora-modulos@onia.com.bo --ruta /X
      --salida /root/capturas-importadora/X.png` (ojo: `--salida` es un **archivo**, no una
      carpeta; pasarle una carpeta muere con `unsupported mime type "null"`).

      El gate (`app/(dashboard)/comercio/caja/VentaForm.render.test.ts`) renderiza el form con los
      sujetos de `VERTICAL_PACKS` y lee el **texto visible**, no el HTML crudo — buscar la palabra
      en el markup la encontraría dentro de una clase, que es como un `includes("disabled")` da
      verdadero siempre contra Tailwind. Falló primero en ROJO por el motivo correcto (*«la caja
      de gestios-servicios-profesionales dice producto, que es de otro rubro»*), lleva el caso que
      YA cumple (un comercio sigue leyendo «catálogo» y «stock») y **se probó por mutación**:
      apuntando `CajaPantalla` a un idioma fijo se pone en rojo y al restaurarlo vuelve a verde.
      MIRADO renderizado con el CSS del build vivo y cero respuestas ≥400:
      `/root/capturas-servicios/comercio-caja-arreglada.png`.
      Verde: tsc 0 · vitest 3155 · eslint 0 errores. **Commiteado, NO desplegado.**

      ⚠️ **Ganadería (`ganadero-offline`) también tiene la caja y vende «hacienda», no productos.**
      Lleva inventario, así que el helper le deja el idioma de comercio — que es lo que decía
      antes, no una regresión. Queda **fuera de la v1.0** a propósito y no se tocó: cambiarlo sin
      una sesión de ese rubro con qué mirarlo sería inventar alcance.

      Un tropiezo que conviene no volver a pagar: el ancla que exige que `CajaPantalla` **no** use
      `getAccountContext` se puso roja por **su propio comentario**, el que explica por qué no se
      usa. Se filtran los comentarios antes de aplicar el patrón — si no, el gate obliga a borrar
      la bitácora que lo justifica.

      **Confirmado que los dos defectos del alta NO eran de estética, son de todo rubro con
      agenda** — se reprodujeron idénticos acá, lo que ensancha el pedido de deploy `t_0268567b`:
      (1) el paso de horarios trae los **siete días en «Cerrado» con «Continuar» habilitado**
      (`/root/capturas-onboarding-servicios/03-horarios.png`), y (2) el paso de datos encabeza
      *«No pudimos encontrar tus datos, así que los cargamos juntos»* con etiquetas «No lo
      encontramos — completalo» en cada campo, **entrando por «Completar el formulario», donde
      nunca se buscó nada** (`/root/capturas-onboarding-servicios/02-negocio.png`).

      ⚠️ **Un matiz que evita un diagnóstico falso:** acá la agenda **no** quedó muerta (5 filas
      en `doctor_schedules`, lun-vie 09:00-18:00) pese a pasar el paso de horarios con todo
      cerrado. No es que el defecto no aplique: las filas las escribió el **paso de equipo**, con
      doctor asignado. O sea que el mismo camino por defecto deja la agenda viva o muerta según
      si el rubro carga equipo, y medirlo sólo en un rubro habría dado por arreglado —o por
      inexistente— un defecto que sigue vivo.

      Un verde falso que se cazó en el propio instrumento antes de que mintiera: por el camino
      «la org ya existía» salía con código 0 **sin confirmar el correo**, o sea declaraba
      utilizable una cuenta que no podía entrar. La confirmación ahora corre en los DOS caminos.
      El otro fallo fue mío y no del producto: la consulta de idempotencia preguntaba por
      `public."User"`, tabla que no existe (es `public.profiles`), y el `catch` se tragaba el
      error — el script llegó a reportar «el alta NO creó la organización» sobre un alta que
      había funcionado perfecto.

      **CERRADO 2026-09-06 — sexta tanda: los 6 transversales que faltaban de importadora, y con
      eso los CINCO rubros de la v1.0 quedaron recorridos.** Org `qa-modulos-rj7tv`, cuenta
      `zz-qa-importadora-modulos@onia.com.bo`, capturas en `/root/capturas-importadora/`
      **abiertas y leídas una por una**, con el log de cada corrida al lado: **cero respuestas
      ≥400 en las seis**, así que ningún error boundary de chunk caído se leyó como bug del
      producto. Sanas cinco: `/inbox` («Tu canal de chat todavía no está encendido» → «Configurar
      mi asistente»), `/requerimientos`, `/contabilidad` (IVA 13% e IT 3%, Ley 843, con la
      salvedad «no reemplaza la declaración en el SIAT ni es asesoría fiscal»), `/team` y `/rrhh`
      («Equipo y planilla», SMN Bs 3.300, aporte a la Gestora 12,71%, RC-IVA). Los estados vacíos
      ofrecen la salida en todos.

      ✅ **La que no: `/empresa`.** Su menú la llama **«Gastos»** y la pantalla se titulaba
      **«Empresa · Tu empresa este mes»**. Recontado contra los siete packs antes de tocar nada:
      **seis la llaman «Gastos»** y sólo `gestios-servicios-profesionales` la llama «Empresa» —
      o sea el título estaba escrito para el único pack que NO es de la v1.0, y les hablaba mal a
      los cuatro que sí lo son. **ARREGLADO y atado** en `7149658` (`onia-platform`, rama del
      carril): el rótulo se **deriva** del pack, así que un rubro nuevo nace cubierto. El gate va
      en `lib/platform/copy-de-pantallas-compartidas.test.ts`, el archivo que ya cubre esta
      familia, con los sujetos sacados de `VERTICAL_PACKS`; falló primero en ROJO por el motivo
      correcto y lleva el caso que ancla que **el rótulo no es igual en todos los rubros** — si lo
      fuera, la regla sobraría y el barrido pasaría en verde el día que alguien vuelva a fijar el
      título. Verde: tsc 0 · vitest 3175 · eslint 0 errores. **Commiteado, NO desplegado.**
      Captura del defecto: `/root/capturas-importadora/empresa.png`.

      ⚠️ **Un falso positivo que se descartó leyendo el código y no la foto:** en la captura,
      `/empresa` ofrece «Ver agenda» y «Reuniones», y ni Agenda ni Reuniones están en el menú de
      importadora — la firma exacta del defecto de fiados («los fiados se registran desde la
      caja», que no existe en ese menú). No lo era: los dos apuntan a `/empresa/reuniones`, una
      **subruta del propio módulo**, igual que «Ver y cargar gastos» y «Ver colaboradores». Un
      enlace a una pantalla que no está en el menú sólo es defecto si esa pantalla es de OTRO
      módulo; las subrutas del módulo abierto no tienen por qué estar en la navegación.

      **Balance de los cinco rubros:** dental 8 módulos, comercio 9, estética 13, servicios
      profesionales 12, importadora 13 — **55 pantallas miradas renderizadas**, con 5 defectos
      encontrados y arreglados (`/treatments` y `/agents` en estética, `/comercio/caja` en
      servicios, `/comercio/fiados` en importadora y servicios, `/empresa` en los seis packs que
      la llaman «Gastos»). **Los cinco eran del mismo tipo y ninguno lo podía ver un barrido de
      literales:** el texto era correcto en el rubro que lo escribió y estaba mal el par
      (rubro, texto). Lo único que los encuentra es abrir la pantalla **con la sesión del rubro
      que la nombra distinto** — y el eje que hay que cruzar es el **rótulo del menú**, no el
      vocabulario del rubro, que es lo que ya estaba bien en todas.

      🔒 **Y el recorrido de 55 pantallas no se vuelve a hacer, así que lo que quedaba abierto era
      la pantalla número 56 — cerrado el 2026-09-06 en `f997f2f`.** Los tres gates que dejaron los
      arreglos derivan sus **sujetos** de `VERTICAL_PACKS` (un rubro nuevo nace cubierto), pero su
      lista de **pantallas** está escrita a mano: la misma lista-de-inclusión un escalón más
      arriba, la que ya falló abierta en otros gates de este proyecto. Contado: los packs comparten
      **seis** pantallas con rótulos distintos —`/comercio`, `/comercio/fiados`, `/dashboard`,
      `/empresa`, `/patients`, `/treatments`— y los gates cubrían **dos**. Las otras cuatro están
      **sanas** (`/comercio` y `/patients` derivan su idioma del pack; `/dashboard` se titula
      «Hoy», que no es palabra de ningún rubro), pero eso no lo sabía nadie de forma ejecutable.
      `lib/platform/pantallas-compartidas-cubiertas.test.ts` no prueba el copy: prueba la
      **cobertura** — toda pantalla que dos packs nombran distinto tiene que estar declarada con
      **cómo** se cubre, y toda declaración tiene que seguir siendo cierta. Verificado por mutación
      en las cuatro direcciones, cada una roja por su motivo; la que importa es la cuarta:
      agregando una pantalla NUEVA al menú de dos packs con rótulos distintos, el gate la **nombra**
      y manda al archivo a extender, en vez de callarse. Verde: tsc 0 · vitest 3200 · eslint 0
      errores. **Es un gate: no viaja al navegador y no pide deploy.**

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
