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

- [ ] 🔴 **Add-ons sin consumidor: o los consume algo, o salen del catálogo.**
      `addon.inventory_advanced`, `addon.chatbot` y `addon.web`. El catálogo ya midió que
      `addon.chatbot` **está muerta y la que trabaja es otra** (revisado 2026-08-30 y 2026-08-31:
      sólo aparece en tests). Un add-on que se cobra y no habilita nada es una promesa rota
      cobrada — el peor defecto posible con un cliente nuevo.

      Medición previa en `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md` §5. Los montos y las
      claves de add-on son fuente única en `lib/pricing.ts` (`onia-platform`): ahí se comprueba
      qué clave cobra y con `grep` en `app/` quién la lee. Si nadie la lee, no habilita nada.

- [ ] 🟡 **`/requerimientos` es una pantalla huérfana: existe, tiene su portal, y no la enlaza
      ningún nav.** Decidir y ejecutar: se enlaza, o deja de contarse como módulo en el catálogo.
      Las dos salidas son válidas; dejarla como está no.

      Está listada como módulo en `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md` §4.

- [ ] 🟡 **Recorrer cada módulo 🟡 con datos reales y MIRARLO renderizado**, rubro por rubro de
      los cinco de la v1.0. Es kilometraje, no código: lo que se busca es dónde se rompe el
      camino, no qué reescribir. Se cruza con el loop `recorrido-cliente`, que ya hace esto de
      punta a punta — **leer su cola antes de repetir su trabajo**:
      `hermes-content/docs/cola/recorrido-cliente.md`, la cola de ese loop.

      Los doce módulos 🟡 con su pantalla están en `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md` §4.

- [ ] 🟡 **Los agentes de IA (`/agents`) se venden como módulo y el catálogo se corrigió a sí
      mismo dos veces sobre si corren solos.** Decidir en firme: se agendan con cron propio, o se
      venden como disparo manual — y que la pantalla diga exactamente eso.

      Las dos correcciones sucesivas están en `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md` §7.

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
