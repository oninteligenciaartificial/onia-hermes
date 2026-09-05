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

- [ ] 🔴 **Add-ons sin consumidor: o los consume algo, o salen del catálogo.**
      `addon.inventory_advanced`, `addon.chatbot` y `addon.web`. El catálogo ya midió que
      `addon.chatbot` **está muerta y la que trabaja es otra** (revisado 2026-08-30 y 2026-08-31:
      sólo aparece en tests). Un add-on que se cobra y no habilita nada es una promesa rota
      cobrada — el peor defecto posible con un cliente nuevo.

      Medición previa en `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md` §5. Los montos y las
      claves de add-on son fuente única en `lib/pricing.ts` (`onia-platform`): ahí se comprueba
      qué clave cobra y con `grep` en `app/` quién la lee. Si nadie la lee, no habilita nada.

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
