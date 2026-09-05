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

- [x] 🔴 **Gate 1 sobre el propio §8: se contradecía con la tabla de §2 — contado de nuevo el
      2026-09-05 y corregido. Mentía §8.** `/patients` **no debe** estar en el nav de
      `gestios-servicios-profesionales`, y no por olvido: la ficha (la ficha por id,
      `medical-alerts`, `records`, `treatments`, `import`) es de los packs **clínicos**, así que
      abrir el segmento le daría a un estudio contable una ficha clínica con sus APIs en **403**.
      El agujero real —que ese rubro no pudiera crear el cliente de su cita— ya estaba tapado:
      alta en línea en el modal de cita contra `/api/patients`, que sí es suya.

      **Se midió haciendo el cambio, no razonándolo:** agregar la entrada al nav puso en rojo dos
      gates que ya defendían esa decisión — `lib/platform/api-route-registry.test.ts` (nombra las
      cinco rutas que darían 403) y `app/(dashboard)/appointments/page.test.ts` (*"la precondición
      del arreglo sigue en pie"*). Revertido; suite verde (294 tests de `lib/platform` +
      `appointments`). Corregido en `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md` §8 ítem 1.

      ⚠️ **Lección para este carril, que arrastra 46% de pendientes fantasma:** el pendiente no era
      fantasma *ni* real — era **al revés de como estaba escrito**. Un ítem que manda a "terminar"
      algo puede estar pidiendo deshacer una decisión ya tomada, y el repo la tenía escrita como
      test. Antes de "terminar" lo que un doc pide, correr los gates del cambio: si algo se pone
      rojo, el doc es el que está viejo.

- [ ] 🔴 **El panel invita a una pantalla que el propio gate rebota, en un rubro que se vende.**
      Encontrado el 2026-09-05 midiendo el ítem de arriba — no estaba en ninguna cola.
      En `gestios-servicios-profesionales` el panel arma la tarjeta *"Completar contacto —
      N cliente(s) de hoy tienen contacto incompleto"* con `href: "/patients"`
      en el panel del dueño (`dashboard`), **sin mirar el rubro**, y usa el vocabulario
      del rubro (`v.cliente`) así que se lee perfecta. El gate manda `/patients` de vuelta a
      `/dashboard`: el dueño hace clic y aterriza donde ya estaba, sin explicación. Lo mismo con
      el mapa `workItemHref` — `Patient` y `PatientTreatment` apuntan a `/patients`, líneas 346-347.

      **No se arregla abriendo el segmento** — eso es justo lo que el ítem de arriba midió que
      rompe dos gates. Se arregla **filtrando las tarjetas por `allowedSegmentsForPack`** antes de
      renderizarlas: una tarjeta cuyo destino el pack no puede visitar no se muestra. Conviene que
      el guard sea general (toda tarjeta del panel, no sólo ésta), porque el mismo patrón se repite
      en `workItemHref` y en la pantalla `/operations`.

      Archivos: el gate vive en `lib/platform/route-access.ts` y el pack en
      `lib/platform/vertical-pack.ts` (repo `onia-platform`); las tarjetas se arman en el panel
      del dueño, `page.tsx` del segmento `dashboard`.

      **Reproducción en 30 s, sin navegador:**
      `cd /root/loops/onia-platform-chatbot && node -e "..."` → o más simple, el gate que falta:
      hoy `resolveRouteAccess("/patients", VERTICAL_PACKS["gestios-servicios-profesionales"], …)`
      devuelve `{allowed:false, redirectTo:"/dashboard"}` mientras el panel sigue
      emitiendo ese `href`. Test sugerido: ninguna `PriorityItem` puede apuntar a un segmento
      fuera de `allowedSegmentsForPack` del pack del tenant.

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
