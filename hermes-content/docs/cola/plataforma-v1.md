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

- [x] 🔴 **Abrir el enlace del correo CANCELABA la cita, sin que nadie decidiera nada —
      cerrado el 2026-09-07 (`bb0ba47` en `onia-platform`, publicado en la rama). Y estaba en
      DOS puertas, no en una.**
      Gates nuevos: `app/cita/no-muta-en-get.test.ts` (9 casos) y
      `app/api/appointments/respond/route.test.ts` (6).

      El recordatorio de cita le manda al cliente del cliente dos botones, «Confirmar» y
      «Cancelar» (`lib/email.ts:616-623`). Las dos puertas ejecutaban la acción **en el propio
      GET**, así que no hacía falta DECIDIR: bastaba con que algo **tocara** el enlace. Los
      filtros antispam corporativos (Safe Links, Proofpoint, Mimecast) visitan cada URL de un
      correo entrante para escanearla, y la vista previa de WhatsApp hace lo mismo si el mensaje
      se reenvía. Cualquiera de esos GET cancelaba la cita, le avisaba al negocio *«Fulano
      canceló su cita»* y liberaba el turno — **sin forma de distinguirlo de una cancelación de
      verdad**.

      **La clase, que es lo que importa:** un gate de superficie no puede verlo. La ruta responde
      200, la pantalla se ve perfecta, no sobra ninguna palabra y el texto ya era neutro entre
      rubros — pasaba todos los cortes que este carril sabe hacer. Aparece con **otra** pregunta,
      que hasta hoy nadie hacía: **¿el GET ESCRIBE?** `app/cita` no tenía un solo test, y es la
      única superficie que ve el cliente **del** cliente.

      **Y el arreglo subió a la clase, no a la instancia.** Barridos los `page.tsx` públicos,
      apareció una SEGUNDA puerta: `/api/appointments/respond` — pública, exenta de login en
      `proxy.ts:115`, con el mismo `confirmToken` y el mismo `update` en el GET. Arreglar sólo
      `/cita` dejaba el agujero abierto entero. No se borra, porque el correo apuntó ahí hasta
      `58e1b9b` (`git log -S "appointments/respond" -- lib/email.ts`) y hay correos **ya
      entregados** con esa URL adentro: queda como redirección a la pantalla que pregunta. Hoy
      **un solo lugar escribe** en todo el producto, la server action de `app/cita/acciones.ts`,
      detrás de un POST que ningún escáner dispara.

      **Cuánto faltó para que costara plata:** el cron de recordatorios corre **cada 15 min**
      (`*/15 * * * * /root/bin/run-onia-appointment-reminders.sh`) y lleva **1.630 corridas con
      `enviados24Email:0`** — todavía no hay citas reales, así que se cerró **antes** del primer
      cliente. Con el primero, empezaba a morder sola.

      Los dos gates **validados por mutación**, que es lo único que separa un verde de un verde
      falso: dejar el formulario Y volver a escribir en el GET → rojo; sacar el botón → rojo. Y
      un detalle que casi deja hueco el segundo gate: sin una cita viva en el mock, la ruta corta
      en 404 **antes** de llegar a la escritura y los casos pasan sin medir nada.
      Gates: `tsc` 0 · `vitest` 3560 verdes · `eslint` 0 errores. Pantalla MIRADA renderizada con
      el CSS del build vivo (los tres estados), porque el deploy está esperando el `ok`.

      ⚠️ **Publicado en la rama del carril, NO en `master` y NO desplegado — y el orden importa,
      porque decirlo mal es un modo de falla conocido.** El publicador buildea desde
      `origin/master` (`publicar.sh --dry-run` contesta hoy *«3 arreglos, HEAD 0331198»*), así
      que **este arreglo todavía no viaja con el pedido de deploy**: primero lo tiene que mergear
      el integrador (`onia-cola`), y recién ahí entra. Medido, no supuesto:
      `git merge-base --is-ancestor bb0ba47 origin/master` → **no**. Escribir «viaja con el
      pedido» antes del merge es prometerle a Sergio Urcullo un arreglo que el swap no incluiría.

- [x] 🔴 **La ficha clínica le pedía «Caries dentinaria en pieza 46» a un centro de estética —
      cerrado el 2026-09-07 (`3a4977d` en `onia-platform`, publicado en la rama). Y lo que lo
      dejó vivo es que NINGÚN gate mira las subrutas.**
      Gate: `onia-platform-chatbot/lib/platform/pantallas-compartidas-cubiertas.test.ts`, bloque *«las subrutas de una
      pantalla compartida»* (89 casos).

      El panel enlaza `onia-platform-chatbot/app/(dashboard)/patients/[id]/records/new/page.tsx` con el guard `esClinico`, o sea los **tres**
      rubros clínicos, y sus tres placeholders estaban tipeados en dental: «Dolor en el diente
      46», «Caries dentinaria en pieza 46», «Restauración con resina compuesta». Un centro de
      estética —uno de los cinco rubros que la v1.0 vende— cargaba el historial de su clienta
      leyendo eso. **El guard existía y funcionaba: era más GRUESO que su copy**, la misma forma
      que `/help` enseñándole el odontograma a estética y veterinaria.

      **La clase, que es lo que importa:** el gate de cobertura declara cada pantalla compartida
      y la barre con `fuentesDeLaRuta`, que a propósito **no entra en subdirectorios**; y el gate
      de caminos enumera ítems de menú, y una subruta no es ítem de menú de nadie. Entre los dos
      quedaba un árbol entero —la ficha, el detalle, los formularios de alta— sin un solo sujeto.
      Barriéndolo aparecieron **tres** archivos sirviendo copy de un rubro a todos:
      `onia-platform-chatbot/app/(dashboard)/patients/[id]/records/new/page.tsx` (dental),
      `onia-platform-chatbot/app/(dashboard)/reports/clinical-balance/page.tsx` («Tratamientos
      completados», que en una veterinaria son «Servicios») y
      `onia-platform-chatbot/app/(dashboard)/settings/chatbot/ChatbotClient.tsx`, con tres placeholders
      de **veterinaria** fijos —«mascota, perro, gato»— para los siete rubros, en un archivo cuyo
      propio prop `ejemplos` dice «nunca dental fijo»: el arreglo cubrió tres campos y dejó estos.

      Arreglados derivando del pack con el mecanismo que ya existía (`ejemploRegistro` y
      `ejemploPalabras` en `onia-platform-chatbot/lib/onboarding/vocabulario.ts`, al lado de
      `ejemploServicio`, cuyo
      comentario documenta **este mismo error** resuelto para el catálogo el 01-sep — nunca viajó
      a la ficha).

      ⚠️ **Y el gate nació hueco dos veces; lo destapó la mutación, no la lectura.** La v1 eximía
      al archivo que *nombrara* `vocabularioDeTrack`, y `ChatbotClient` se escapaba por un
      **comentario** que cita el símbolo. La v2 preguntaba por el símbolo sin comentarios y quedó
      **peor**: al arreglar esa pantalla le agregué el import, y con eso el archivo se eximía
      solo — revertir el arreglo dejaba los 89 casos en **verde**. Es el agujero contra el que
      advierte la cabecera de ese mismo archivo (`/settings` importaba el vocabulario y tenía ocho
      textos dentales al lado) y lo reabrí abajo. **No hay eximición por derivar:** la regla es
      que en una subruta compartida no hay palabra de un solo rubro, y las tres que la necesitan
      se declaran con el símbolo que las justifica, verificado en cada corrida.
      Validado por mutación en cuatro direcciones: revertir el arreglo → rojo; una subruta
      **nueva** con copy dental → rojo (nace cubierta); podrir una fila declarada → rojo;
      restaurado → verde.
      ⚠️ **Commiteado y en la rama, NO desplegado**: viaja con el pedido de deploy de `plataforma`.

- [x] 🔴 **A un estudio contable le pedíamos el género y el cumpleaños de su cliente —
      cerrado el 2026-09-07 (`e9b857a` en `onia-platform`, publicado en la rama).**
      Gate: `onia-platform-chatbot/app/(dashboard)/patients/ficha-por-rubro.test.ts`.
      La ficha la comparten los tres rubros clínicos y **servicios profesionales**, uno de
      los cinco que la v1.0 vende. Lo clínico ya se había separado (tipo de sangre, emergencia,
      alergias, historia, tratamientos) pero **cumpleaños y género quedaron afuera de ese
      arreglo**: en el alta viven en el MISMO grid que el nombre y el CI, diez líneas encima de
      un bloque que sí distingue el rubro. El cliente de un estudio contable puede ser una
      EMPRESA, así que el sistema le pedía el género de una razón social, y la lista le ofrecía
      **filtrar por género** y le calculaba la edad.
      **Cuatro superficies**, todas bajo `onia-platform-chatbot/app/(dashboard)/patients`: el alta, la
      edición, la ficha y **la lista**, que entró al gate por primera vez — el
      filtro por género vivía justo en la pantalla que ninguno de los tres casos miraba.
      **El gate dejó de CONTAR bloques** `{esClinico && (` y ahora pregunta, por literal, si
      aparece sólo detrás del interruptor: el conteo se rompía al agregar un bloque (pasó acá)
      y no decía cuál faltaba cuando bajaba. Filtra los comentarios antes de buscar, o acusa a
      la bitácora que explica el propio defecto.
      El interruptor es `fichaClinica()`, de `lib/platform/vertical-pack.ts`.
      **Prueba:** `npx vitest run 'app/(dashboard)/patients/'` → 18/18; verificado por
      **mutación** (sacando `esClinico` del filtro de género el gate cae en rojo por el motivo
      correcto). `tsc` 0 · `eslint` 0 errores · **3253** tests. Sin desplegar: viaja en el
      pedido de deploy de `plataforma` que ya espera el `ok`.

- [x] 🔴 **Este carril se mudó de máquina y quedó SIN el árbol de `onia-platform`: no podía
      escribir una línea del producto, y nada se puso rojo — arreglado el 2026-09-07.**
      `chatbot-cola` pasó a correr en **nodo-casa** (`3 * * * *`, primera corrida allá hoy
      03:03 UTC), y la mudanza llevó el worktree de `onia-hermes` pero **no** el de
      `onia-platform`: `/root/loops/onia-platform-chatbot` **no existía** en esa máquina
      (sí en el VPS, la máquina vieja). Como este es **el único loop que escribe en
      `onia-platform`** —el repo que ES el objetivo nº 1 del sistema desde el 2026-09-05—, el
      segundo plato del carril estaba muerto: cero código de producto, cada vuelta, para siempre.

      **Por qué sobrevivió, que es lo que vale:** el gate de registro
      (`scripts/loops_registrados.mjs`) verifica que la **línea de cron** exista y coincida con
      la tabla de `loops.md` **en las dos direcciones** — y esta mañana daba **`OK` / exit 0**,
      con razón: el horario estaba perfecto. Lo que nadie verifica es el **espacio de trabajo**:
      que los árboles que el loop necesita existan *en la máquina donde corre*. Un loop puede
      estar impecablemente registrado y no tener dónde trabajar. Es la misma familia que este
      repo ya tiene medida —*una lista de inclusión que cubre sólo lo que ya falló*— un escalón
      más arriba: el gate cubre **el horario**, no **el taller**.

      Y el modo de falla es el silencioso, no el ruidoso: el loop arranca, mide su objetivo,
      no encuentra árbol, y lo honesto que puede reportar es *«no había nada desbloqueado que
      hacer»* — indistinguible de una vuelta sana. El clon vecino `/root/loops/onia-platform`
      sí estaba (lo usa `onia-cola` para mergear a `master`), así que un vistazo rápido a
      `ls /root/loops` **confirma en falso** que la plataforma está disponible.

      **Arreglado y verificado, no razonado:** `git worktree add` desde
      `/root/loops/onia-platform` sobre `claude/chatbots-platform-review-0d1d09` (4.834
      archivos), `git merge origin/master` → **0 commits atrás**, y `npm ci` → **692 paquetes**
      con `vitest` y `tsc` locales. La prueba de que el árbol sirve de verdad no es que exista:
      es **`npx tsc --noEmit` → exit 0**. Eso importa acá más que en otro lado, porque este repo
      ya midió que en un worktree **pelado** `npx tsc` se baja *otro* paquete llamado `tsc`,
      imprime *«This is not the tsc command you are looking for»* y **sale con éxito** — o sea
      que el gate firma verde sin compilar un archivo. Un árbol sin `node_modules` no da rojo:
      da un **verde falso**, que es el caro.

      ⚠️ **De paso, un dato que corrige lo que la memoria compartida le dice hoy a los cuatro
      carriles de casa.** Está escrito que un gate que lee rutas del VPS *«deja de medir cuando
      su loop se muda al nodo de casa»*, y eso es cierto **sólo para archivos**: `/opt/onia-landing`,
      `/opt/onia-platform` y `/opt/onia/bot` no existen allá. Pero **`docker` sí funciona**, y no
      es un docker local: `/usr/bin/docker` → `/root/bin/docker` es un **shim que delega en el VPS
      por SSH** (lo deja `instalar-homelab.sh`; `docker info` contesta `srv1360183`). O sea que
      desde casa un `docker exec` **toca PRODUCCIÓN**. Son seis shims así, y `docker` es el que
      importa acá. Consecuencia práctica para cualquier carril que escriba un gate: lo que hay
      que evitar es la **ruta `/opt`**, no el `docker exec` — y un carril que dé por imposible
      medir desde casa se está frenando de gratis. (Los otros cinco shims viven todos en
      `/root/bin/`, fuera del repo: el del tablero, el de Telegram, el de aprender, el de
      consolidar memoria y el del VPS.) Por eso `scripts/sonda_widget.mjs` —que lee
      Chatwoot y `supabase-db` por `docker exec`— corre allá sin tocarle una línea: resuelve el
      nombre del contenedor **por prefijo** (`docker ps --filter name=`), así que encuentra
      `onia-chatbot_chatwoot-db.1.sddet…` aunque su constante diga `onia-chatbot_chatwoot-db`.

- [x] 🔴 **El correo que le llega al cliente DEL cliente hablaba en dental para los siete rubros
      — arreglado el 2026-09-06 (`aeeacd0` en `onia-platform`).** La confirmación de cita y el
      recordatorio traían los rótulos **«Doctor»** y **«Tratamiento»** escritos a mano, y los
      mandan **los cuatro packs con agenda**: dental, estética, veterinaria y servicios
      profesionales. Ese correo sale **con el remite del negocio**, así que a la clienta de una
      estética y al cliente de un estudio contable les llegaba, firmado por ellos,
      *«Doctor: María Fernanda Paz»* y *«Tratamiento: Declaración mensual de impuestos»* — el
      ridículo lo hace el dueño, no nosotros. Tres de los cinco rubros vendibles.

      **Por qué sobrevivió, que es lo que vale:** es la superficie que **ningún instrumento del
      proyecto mira**. No sale en una captura, no está en el HTML de ninguna URL, no lo ve un
      `curl`, y el que lo recibe no entra nunca al sistema. El vocabulario por rubro del producto ya
      resolvía esto para la pantalla —**diez** la leen, hasta la pantalla del recibo impreso— y el correo nunca la llamó. El vocabulario incluso trae escrito el
      motivo (*«decirle 'paciente' al dueño de una ferretería delata que el sistema es de otro
      rubro y que sólo le cambiaron el logo»*): estaba aplicado hacia adentro y no hacia afuera.
      Es el mismo cruce que el bot ya vigila con `hermes-content/deploy/vps-ops/bot/rubros-vivos.mjs`,
      un escalón más lejos: ahí la superficie es lo que el bot DICE; acá, lo que el sistema MANDA.

      **Verificado:** test en ROJO primero (5 casos fallando, el de dental pasando), luego
      el test nuevo (`email-idioma-del-rubro`, en `onia-platform`) en verde con el **caso que ya cumple**
      anclado —dental sigue diciendo «Doctor», y un correo sin `trackId` sale byte a byte igual
      que antes, o sea que ningún llamador viejo cambió—. Gates: `tsc` 0 · `vitest` **3223
      passed** · `eslint` 0.

      **El gate ataca la clase, no las tres instancias:** deriva sus sujetos del **disco**
      (los árboles `lib` y `app` enteros del producto), así que el próximo archivo que mande uno de estos correos nace
      cubierto y hay que excluirlo a la vista. Validado **por mutación**: sacándole el `trackId`
      al alta de cita el test se pone rojo y **nombra el archivo**.

      ⚠️ **Commiteado y pusheado, NO desplegado** — viaja en el próximo swap de `plataforma`.

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

- [x] 🟠 **El error que ve el cliente hablaba dental, aunque la pantalla ya lo tenía traducido.**
      `55cfbf4` (2026-09-07). `/api/patients` y `/api/patients/[id]` contestaban «Paciente no
      encontrado», «Error al actualizar paciente» y «Error al eliminar paciente» tipeados a mano,
      y esas rutas **no son dentales**: `VERTICAL_API_ROUTES` las declara para `CON_AGENDA`, que
      incluye **estética** («clienta») y **servicios profesionales** («cliente») — dos de los cinco
      rubros vendibles de la v1.0.

      Lo que lo hacía invisible: la pantalla **sí** derivaba el idioma, pero en el fallback —
      `setError(data.error ?? \`Error al crear ${el} ${v.cliente}.\`)`. El `??` invierte cuál rama
      se ve: gana `data.error`, así que el texto traducido sólo aparecía cuando la API **no**
      contestaba. El trabajo de traducción ya estaba hecho y no llegaba al cliente. Ningún gate de
      rubro podía verlo — todos barren `.tsx` de pantallas y estos literales viven en
      `app/api/**/route.ts`.

      Prueba: `lib/platform/idioma-del-error.test.ts` en ROJO primero, nombrando los 6 mensajes;
      verde después. Gates: `tsc` 0 · `vitest` 3373 verdes · `eslint` 0.
      ⚠️ **Commiteado y en la rama, NO desplegado**: viaja con el pedido `t_deddf471`.

- [x] 🟠 **Las otras rutas de la misma clase ya no hablan dental — y eran 14, no 4** (`e6a7012`,
      2026-09-07). Mismo defecto que `55cfbf4`, otro camino. Un estudio contable que borraba una
      cita leía «Doctor no encontrado» y una clienta de estética «Paciente no encontrado».

      ⚠️ **Este ítem nombraba CUATRO rutas y su lista era el punto ciego.** Derivando los sujetos
      del REGISTRO en vez de la lista aparecieron **once**; ampliando el universo al segundo balde
      (`COMMON_API_ROUTES`, que este ítem ni miraba) aparecieron **tres más**: `invoices`,
      `recurring-invoices` y `app/api/email/invoice/[id]/route.ts` — las que **más** rubros leen, porque facturar lo
      hacen los siete. Son **23 mensajes en 14 archivos**. La lista del cuerpo de un pendiente es
      una PISTA; el sujeto se enumera del disco antes de cerrar.

      También cayó la premisa que traía escrita: **«doctor» no lo dice ningún rubro, ni el
      dental** — llama «Profesional» a quien atiende (`vocabulario.ts` `rolesEquipo`), así que esa
      palabra en prosa siempre es herencia clavada. Va por `nombreDeRol()`, otra fuente que la del
      cliente: dos ejes, dos helpers (`rolQueAtiende` / `profesionalNoEncontrado` /
      `errorAlProfesional`, más `elCliente` / `elClienteAlInicio` / `clienteEnTitulo`).
      `doctorId` queda **fuera a propósito**: el límite de palabra lo excluye porque es el nombre
      del parámetro de la API —su contrato—, no prosa que lea una persona.

      Prueba: `lib/platform/idioma-del-error.test.ts` de **42 a 124 casos**, sujetos derivados de
      los DOS baldes (una ruta nueva nace cubierta) y un único exento —la clave del enum
      `ADMIN · DOCTOR · STAFF` del panel de Super Admin— eximido por literal exacto, no por ruta, y
      vigilado por un caso que se pone rojo si el exento se pudre. Validado **por mutación en las
      dos direcciones**: inyectar el defecto en una ruta `common` que no toqué → rojo; revertir un
      arreglo → rojo; podrir el exento → rojo; y `doctorId`, que debe seguir permitido, sigue en
      verde. Gates: `tsc` 0 · `vitest` 3496 verdes · `eslint` 0 errores.
      ⚠️ **Commiteado y en la rama, NO desplegado**: viaja con el pedido de deploy de `plataforma`.

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
      y manda al archivo a extender, en vez de callarse.

      **Y de las cuatro «sanas», dos lo estaban por una mirada y ahora lo están por una
      invariante** (`0a5bdbe`). «La pantalla ya deriva su título del pack» **no** es cobertura:
      `/comercio` y `/patients` lo hacían y lo único que lo sostenía era haberlas MIRADO una vez
      — un cambio en el vocabulario, en `llevaInventario` o en el rótulo del menú las despegaba
      sin que nada se pusiera rojo. Medido antes de escribir nada: las **8** combinaciones
      (rubro, pantalla) coinciden hoy, así que no había defecto, faltaba la regla. Llevan la misma
      que `/treatments` y `/empresa`, con el ancla de que **el rótulo no es igual en todos los
      rubros** (sin eso, con un solo rótulo posible cualquier literal fijo acierta). Por eso la
      variante «derivado» se eliminó del gate de cobertura: era una tercera forma de declararse
      cubierto sin gate, que es exactamente lo que acá fallaba. Quedan **cinco por gate** y
      `/dashboard` neutral con su motivo escrito. Verde: tsc 0 · vitest 3214 · eslint 0 errores.
      **Son gates: no viajan al navegador y no piden deploy.**

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

- [x] 🟡 **CERRADO el 2026-09-07: la pantalla de Citas le decía «El doctor» a un estudio contable
      y a una veterinaria — en el mismo formulario cuyo label ya decía «Profesional».**

      **El defecto, medido:** en `/appointments`, el campo de quién atiende deriva bien su rótulo
      del rubro (`nombreDeRol('DOCTOR', track)` → «Profesional», «Veterinario/a») y el aviso de
      abajo tenía la palabra clavada: *«El doctor no trabaja este día o no hay horarios
      configurados.»* La misma pantalla contradiciéndose sola, para los **cuatro** rubros con
      agenda: dental, estética, veterinaria y **servicios profesionales**, que tiene Citas en su
      menú y no tiene doctores.

      **Por qué importa más de lo que parece:** ése es exactamente el mensaje que recibe el
      cliente NUEVO cuya alta quedó sin horarios cargados — o sea, en su primer intento de
      agendar de su vida. El bug hermano (alta que deja la agenda muerta) ya está cerrado; éste
      era el cartel que quedaba.

      **Por qué ningún gate lo veía, y es lo reusable.**
      `lib/platform/pantallas-compartidas-cubiertas.test.ts` deriva sus sujetos de las pantallas
      que dos packs nombran **DISTINTO** en el menú, apoyado en su propio razonamiento: *«si
      todos los packs la llaman igual, no hay par (rubro, texto) que pueda contradecirse»*. Eso
      es cierto del **rótulo** y falso del **contenido**: los cuatro packs llaman «Citas» a
      `/appointments`, así que la pantalla quedaba fuera del barrido por la razón equivocada.

      **La segunda mitad, que no se ve con ningún instrumento:** `roleLabels` seguía exportada en
      `components/ui/Badge.tsx` con `DOCTOR: "Doctor"` y **cero consumidores** — la tabla que
      `nombreDeRol` vino a reemplazar. Un rótulo muerto no sale en la captura, ni en el HTML
      servido, ni en un barrido de la pantalla, y el día que alguien lo cablea entra **ya
      aprobado**, porque nadie audita una constante que «ya estaba». Se borró.

      **Arreglado y publicado** en `onia-platform` `a831216` (rama
      `claude/chatbots-platform-review-0d1d09`, empujada desde el gemelo del VPS porque el push
      de ese repo está deshabilitado en el nodo de casa). Gate nuevo:
      `lib/platform/rol-en-el-idioma-del-rubro.test.ts`, con los sujetos derivados del **disco** y
      un solo exento nombrado (`app/(dashboard)/admin`, que lo usa Onia y no el cliente).

      **Validado por MUTACIÓN, no por leerlo:** revertir el literal pone rojo **sólo** el caso de
      prosa; devolver `roleLabels` **sólo** el de la tabla; romper el filtro de comentarios
      **sólo** su fixture. Ese filtro va con fixture y no contra los archivos vivos a propósito:
      hoy lo sostienen las bitácoras que explican este mismo defecto, así que el día que alguien
      las reescriba el guardia quedaría hueco — y un gate que persigue un literal en prosa, sin
      filtro, obliga a borrar el registro de lo que pasó.

      **Gates:** `npx tsc --noEmit` exit 0 · `npx vitest run` **3264 pasan / 288 archivos** ·
      `npx eslint .` 0 errores. **No está terminado hasta que se publique:** viaja en el pedido
      `t_deddf471` (`DESPLEGAR: plataforma`), que espera el `ok` de Sergio Urcullo.

- [x] 🟡 **CERRADO el 2026-09-07: el cliente ya podía exportar sus datos y no había botón — y la
      misma pantalla le ofrecía comprar la exportación que ya había pagado.**

      **El defecto, medido:** `csvExportEnabled` es `true` desde `basic` en `lib/plan-catalogo.ts`
      —a propósito, y con el comentario que cita la promesa— y `/api/reports/export` lo respeta
      cortando con `canExportCsv(plan)`. Pero el **único** enlace a ese endpoint vivía detrás de
      `isClinicPlan` (`isSuperAdmin || plan === "clinic"`), así que **basic, professional y
      enterprise** tenían el permiso y **no tenían camino**: exportaban tipeando la URL a mano.
      Es la **quinta** de la familia *permiso concedido, camino ausente* (`/requerimientos`,
      `/empresa`, `/rrhh`, `/patients/[id]/prescriptions`).

      **Por qué es peor que las cuatro anteriores:** aquéllas callaban; ésta **desmentía**. Al
      plan Básico le mostraba el banner *«Actualizá al plan Profesional…»* con **«exportación
      CSV»** en la lista de lo que se desbloquea al subir. Le cobraba lo que ya había pagado. Y
      `onia.com.bo/precios` lo vende al pie de la tabla —*«Tus datos son tuyos: los exportás en
      CSV desde el plan más chico»*— como una de sus **tres** razones de compra, junto a «sin
      tarjeta» y «sin permanencia»: la venta prometía y el producto negaba.

      **Lo reusable:** la pantalla tiene **DOS ramas** que renderizan por separado —la del reporte
      básico, que retorna temprano y es donde vive el banner, y la de reportes completos—. El
      enlace faltaba en una y estaba mal gateado en la otra; **arreglar una sola rama es como
      nació este bug**. Ahora las dos preguntan `puedeExportarCsv`, que es la **misma pregunta que
      hace la API**.

      **El gate no mide la precondición.** Pregunta por `canExportCsv`, nunca por `isClinicPlan`:
      uno que midiera `isClinicPlan` estaría midiendo el **síntoma** y quedaría rojo para siempre
      apenas se arregla — el modo de falla que ya costó dos pedidos de deploy vencidos
      (`addon_canal_vivo`). Sujetos derivados de `PLAN_LIMITS`, con el caso que **YA cumple**
      (`free` sigue sin permiso) para que «dale el botón a todos» no pase en verde, y con el
      filtro de comentarios probado en las **dos** direcciones — sin él, el gate se ponía rojo
      sobre la bitácora que explica por qué ese texto no está.

      **Mirado renderizado**, no sólo gateado: las dos cabeceras fotografiadas con el CSS y la
      fuente de iconos del build **vivo** (`/root/reports-arreglado.png`). No se puede mirar en
      producción: el contenedor corre el build anterior al arreglo. Los cinco iconos salen como
      **glifo** (24 px), no como la palabra — el bug más caro del proyecto descartado a la vista.

      **Arreglado y publicado** en `onia-platform` `33b40ff` (rama
      `claude/chatbots-platform-review-0d1d09`, empujada desde el gemelo del VPS porque el push de
      ese repo está deshabilitado en el nodo de casa; árbol verificado idéntico al local).
      Gate nuevo: `app/(dashboard)/reports/camino-a-exportar.test.ts`.

      **Gates:** `npx tsc --noEmit` exit 0 · `npx vitest run` **3273 pasan / 288 archivos** ·
      `npx eslint .` 0 errores. **No está terminado hasta que se publique:** anotado en el pedido
      `t_deddf471` (`DESPLEGAR: plataforma`), que espera el `ok` de Sergio Urcullo.
      ✅ **El riesgo que decía acá está levantado (2026-09-07):** `33b40ff` ya está en `master`
      —entró con el merge `2aa79f8`, tres gates verdes sobre el árbol real (tsc 0, 3273 tests,
      lint 0 errores)— así que el swap lo publica sí o sí. Ese aviso duró lo que tardó el
      integrador en pasar: **un `no está en master todavía` es una medición con fecha de
      vencimiento**, y leído tarde manda al revés (hace creer que el arreglo no viaja).

- [x] ✅ **CERRADO el 2026-09-07 como FANTASMA: `/billing/new` no está roto — el instrumento
      firmaba «roto» sin haber esperado.** Este ítem entró el 2026-09-07 04:14 diciendo que crear
      una factura no lleva a la pantalla de cobro, y era **el único 🔴 de producto de la v1.0**.
      No se reescribió una línea de `/billing/new`: primero se midió la MEDICIÓN, y no se sostiene.

      **La prueba, en un segundo y sin abrir nada** — `scripts/recorrido_cliente.mjs:345` esperaba
      la navegación con un `waitForURL` cuyo patrón **la pantalla de partida ya cumple**: pide
      «billing» seguido de un segmento cualquiera, y «new» es un segmento cualquiera.

      ```
      node -e "console.log(/\/billing\/[^/]+$/.test('/billing/new'))"   → true
      ```

      Así que `waitForURL` resolvió **al instante** —no esperó los 10 s que declara— y la línea 349
      comparó la URL de partida contra sí misma. El veredicto «quedó en `/billing/new`» describe el
      estado ANTES de que el producto tuviera tiempo de hacer nada.

      **La captura lo confirma, MIRADA y no citada:** en `paso-08c-factura-creada.png` el botón está
      en su estado «Guardando» (los tres puntos) y **no hay ningún cartel de error**. Si el `POST`
      hubiera fallado, el cliente hace `setSaving(false)` y pinta el error
      (`NewInvoiceClient.tsx:106-110`) — se vería el botón normal y el mensaje. Lo que muestra la
      foto es el `POST` **en vuelo**. Y la factura terminó creándose (folio `2026-0001`): el `POST`
      completó *después* del disparo de la foto.

      **Y el producto navega, probado en la misma corrida:** el paso 6, el alta de un paciente, usa
      el mismo `router.push` hacia una ruta de detalle nueva, salió `ok` y encontró el dato de vuelta
      **en la lista** — o sea que en Next 16 la navegación re-consulta al servidor sola. Por eso
      tampoco falta ningún `router.refresh()` acá, aunque 30 archivos de la casa lo usen: el que
      faltaría no cambia este resultado.

      ⚠️ **Lo que se cerró NO es «cobrar funciona»: es que la evidencia que decía lo contrario es
      inválida.** La medición válida la dará `recorrido-cliente` cuando arregle su espera; el
      arreglo exacto quedó escrito en el tablero (`t_daa76d62`, con las dos direcciones a probar).
      Es el único `waitForURL` del archivo, así que el daño estaba acotado al paso 8.

      **Por qué se escribe entero:** obedecer este ítem al pie de la letra mandaba a reescribir una
      pantalla sana, que es el error más caro que este proyecto tiene medido — el falso ROJO que
      hace deshacer código vivo. Tablero: `t_6359aa00`.

- [x] 🟡 **CERRADO el 2026-09-07: la pantalla de Roles le decía «Doctor» y «pack dental» a los
      SIETE rubros — a un clic de la pantalla que ya se había arreglado.**

      **El defecto, medido:** `/team/roles` (Equipo → botón «Roles») rotulaba las cinco claves de
      rol con un mapa escrito a mano que decía **«Doctor»**. Ningún rubro llama así a ese rol —
      **ni siquiera el dental**: en `rolesEquipo` son «Profesional» (dental, estética, servicios
      profesionales) y «Veterinario/a» (veterinaria). Su copy visible ofrecía *«Asigna roles del
      **pack dental** por miembro»*, un nombre interno que al cliente no se le nombra
      (`CLAUDE.md`), y la fila mostraba **«Rol base: DOCTOR»**, la clave cruda del enum — el mismo
      defecto que `vocabulario.ts` documenta como ya cerrado en Configuración.

      La pantalla **no tiene guard de rubro** y se alcanza con **un clic** desde `/team`, así que
      la ven los siete packs.

      **Por qué sobrevivió, y es lo reusable:** `/team` YA estaba arreglada — sus tarjetas salen
      del vocabulario (`resumen-equipo.ts`, con su test). Se arregló **la instancia y no la
      clase**, y la hermana sana tapa a la rota: mirar `/team` da por cubierta la familia. Mismo
      patrón en `/reports`, que derivaba `rolProfesional` para los títulos y dejaba `?? "Doctor"`
      en la fila sin nombre resuelto — a una ferretería con plan Profesional.

      **Arreglado** en `onia-platform` `776fd66` (rama `claude/chatbots-platform-review-0d1d09`,
      empujada desde el gemelo del VPS porque el push de ese repo está deshabilitado en el nodo de
      casa). ⚠️ `git am` **regenera el sha**, así que el commit local y el publicado son distintos
      con el mismo árbol: se alineó con `reset --hard` al publicado sólo después de comparar
      `git rev-parse HEAD^{tree}` en las dos máquinas — citar el local deja un sha fantasma, que
      es justo lo que `verificar_cola.js` ataja. El rótulo sale de
      `rolesEquipo`, la MISMA fuente del alta, los badges y `/team`. Gate nuevo:
      `app/(dashboard)/team/roles/rotulos-de-rol-operativo.test.ts` — **16 casos**, con los
      sujetos derivados de `VERTICAL_PACKS` (un pack nuevo nace cubierto) y uno de **cobertura**
      que exige que ninguna clave quede sin rótulo, en vez de caer en la clave cruda.

      **Validado por MUTACIÓN, las cinco en rojo:** copy con «pack dental» · mapa fijo en la
      función pura · la clave cruda en la fila · el fallback tipeado de `/reports` · y el propio
      filtro de comentarios devolviendo vacío. Ese filtro va con **ESTADO** y no por prefijo de
      línea: el interior de un bloque `{/* … */}` arranca con texto normal, así que un filtro por
      prefijo lo deja pasar — y sin él el gate da rojo sobre el comentario que explica este mismo
      defecto y obliga a borrar la bitácora.

      ⚠️ **Trampa de método que costó rehacer el trabajo:** validar por mutación revirtiendo con
      `git checkout -- <archivo>` **no funciona para archivos nuevos** (`pathspec did not match`),
      y en la misma corrida ese comando **sí** revirtió los archivos ya rastreados, deshaciendo
      los arreglos. La mutación se revierte con una copia previa, no con `git checkout`.

      **MIRADA, no supuesta:** producción corre un build anterior (el deploy espera el `ok`), así
      que una captura de `app.onia.com.bo` mostraría el defecto y no el arreglo. Se renderizó el
      componente con el **CSS del build vivo** (`docker exec onia-platform`, 155 KB) y se
      fotografió: dental y estudio contable, los dos con «Profesional», «Rol base: Administrador»
      y «Rol base: Profesional», y **cero respuestas ≥400** en la corrida. Herramienta:
      `mirar-roles.render.test.ts` (`ONIA_MIRAR=1`, no es un gate).

      **Gates:** `npx tsc --noEmit` exit 0 · `npx vitest run` **3289 pasan / 289 archivos** ·
      `npx eslint .` 0 errores. **No está terminado hasta que se publique:** viaja en el pedido
      `t_deddf471` (`DESPLEGAR: plataforma`), que espera el `ok` de Sergio Urcullo.

- [ ] 🔴 **SIAT entra en la v1.0 — decisión de Sergio Urcullo, 2026-09-07: «sin factura no se
      vende». Y el rótulo de este ítem estaba MAL, que es por qué llevaba semanas al final.**
      Este mismo ítem decía *«es un trámite externo, no código»* y *«va último a propósito»*.
      Medido hoy contra `ONIA_SIAT_ESTADO_HOMOLOGACION.md`: lo que falta **no es un trámite**,
      son **5 de 6 tipos de caso sin cubrir**. El NIT está limpio y no bloquea nada.

      **Lo que dice el marcador real del SIN** (última lectura del portal: **2026-08-27, hace 11
      días — reléela antes de trabajar, no la cites**):
      · estado `INICIADO`, **24,8% de la Fase 1**, Porcentaje General **0%**;
      · **el SIN cuenta COBERTURA, no volumen** — 750 documentos contaron como 125 porque eran la
        misma combinación repetida. Son **6 casos de 125 cada uno**, y **solo 1 está al 100%**;
      · los que faltan son de tipo `1 · FACTURA COMPRA-VENTA`, `17 · FACTURA DE
        HOSPITALES/CLÍNICAS` y `24 · NOTA DE CRÉDITO-DÉBITO`, con sus combinaciones;
      · **límite de pruebas: 04/11/2026** (Art. 18.III). No se mueve.

      ⚠️ **Y sigue en pie la advertencia vieja, que ahora significa otra cosa:** *«si un loop se
      planta acá esperando, pierde la vuelta»*. Ya no aplica a esperar al SIN — aplica a esperar
      **a que alguien te diga qué caso emitir**. La cobertura se calcula de la tabla del §5 de ese
      doc; no hace falta preguntar.

      **Primero medí, después emitís.** El porcentaje de arriba tiene 11 días: una vuelta que
      trabaje sobre él sin releer el portal puede estar cubriendo un caso ya cerrado.

      **Listo =** Porcentaje General del portal **> 0%** con al menos un caso nuevo al 100%, leído
      del portal y no deducido. Y el número de esta cola actualizado con la fecha de esa lectura.


## Lo que este carril NO hace

- **No toca los dos rubros bloqueados** (veterinaria, ganadería). Están fuera de la v1.0.
- **No reescribe un 🟡.** Ver arriba: le falta kilometraje.
- **No despliega.** El deploy de `onia-platform` tiene su propio runbook y su propio dueño
  (`onia-platform/.claude/skills/onia-deploy/`).
- **No le escribe a un prospecto.** Regla del [`README.md`](README.md) de esta carpeta.

## Cerrado

- [x] 🔴 **CERRADO el 2026-09-07: la quinta pantalla de la ficha decía «pacientes» a una
      estética y a un estudio contable, y la ayuda mandaba al estudio a cargar sus clientes
      en el catálogo de servicios.** Commit `90b2a47` (rama `claude/chatbots-platform-review-0d1d09`),
      **NO desplegado** — producción corre `build-fe4026e`.

      **El defecto, y por qué sobrevivió.** `/patients` la comparten **cuatro** rubros y tiene
      **cinco** pantallas. Cuatro —listado, ficha, alta, edición— ya derivaban el nombre de la
      persona de `vocabularioDeTrack`. La quinta, la importación por CSV, lo escribía en duro
      **siete veces**: *«Importar pacientes desde CSV»*, *«Máximo 500 pacientes»*,
      *«pacientes-ejemplo.csv»*. Medido sobre los cuatro packs: `clientes` vale **«clientas»**
      en estética y **«clientes»** en servicios profesionales — **dos de los cuatro rubros
      vendibles** leían el vocabulario de otro rubro justo donde cargan su cartera por primera
      vez. **Lo tapó la hermana sana:** ver cuatro pantallas derivadas da la familia por cubierta.

      **Y estaba a UN clic de verse, sin mirar código:** las dos superficies que la ANUNCIAN sí
      derivan del rubro — el onboarding dice *«Cargá tus clientas»* (`lib/onboarding/aplicar.ts`)
      y la ayuda *«Importar clientas»*. El dueño hacía clic en su propio idioma y aterrizaba en
      el de otro.

      🔴 **El segundo eje es el que ningún barrido de literales prohibidos puede ver, porque no
      SOBRA una palabra: FALTA.** El registro de rutas le permite `patients/import` a
      `CON_AGENDA` (los tres clínicos **más servicios profesionales**) y la entrada de la ayuda
      la ofrecía sólo a la familia `clinica`. Y el resultado no era «no sé», que sería
      inofensivo: medido con `buscarAyuda`, un estudio contable que pregunta *«¿puedo subir mi
      lista de clientes desde un Excel?»* recibía **`/comercio/importar`** — la importación del
      **catálogo**. Lo mandaba a cargar a sus clientes como servicios vendibles, **con
      confianza**. Peor que el silencio, porque el dueño la sigue.

      **La prueba: el gate se validó POR MUTACIÓN en tres direcciones**, y la tercera es la que
      importa. Devolver `familias: CLINICA` → rojo. Devolver un literal `pacientes` → rojo.
      **Esquivarlo borrando la palabra** (*«Importar desde CSV»*, *«Volver»*, la pantalla muda)
      → **con la primera versión del guard pasaba en VERDE**, porque sólo pedía que el archivo
      mencionara `vocabularioDeTrack` en alguna parte. Un gate que persigue lo que sobra
      necesita su gemelo que exija que la función siga **viva**, y ese gemelo hay que probarlo
      rompiéndolo: sin la mutación, habría reportado el arreglo hecho con medio arreglo.

      Lleva además el caso que **ya cumplía** (el listado, que no puede moverse), el que protege
      al comercio de que abrir esta entrada le desvíe la importación de **su** catálogo, y el
      simétrico: no ofrecérsela a quien el producto se la niega.

      **Archivos:** `app/(dashboard)/patients/import/page.tsx`,
      `app/(dashboard)/patients/import/importar-en-el-idioma-del-rubro.test.ts`,
      `lib/ayuda/base.ts`. Gates: `tsc` 0, `eslint` 0, `vitest` **3366** pasados.

- [x] 🔴 **CERRADO el 2026-09-07: la AYUDA le enseñaba a un centro de estética y a una
      veterinaria dónde está «el odontograma» — una pantalla que el producto les CIERRA.**

      **El defecto:** `/help` la tienen los **siete** packs, y su listado traía la pregunta
      *«¿Dónde está el odontograma?»* con la respuesta *«En la ficha del paciente, en su
      pestaña de odontograma»*. Pero `/patients/[id]/odontogram` **redirige** a todo el que no
      sea dental, y la ficha **no le pinta el enlace**. O sea: las dos pantallas cortaban bien
      y el índice de ayuda mandaba a buscar algo que no está. **Estética es rubro vendible de
      la v1.0.**

      🔴 **Por qué ningún guard lo veía, que es lo reusable.** `construirFaq` ya tenía **dos**
      filtros y el defecto cae en el **hueco entre ellos**:

      | guard | qué mira | por qué no alcanza |
      |---|---|---|
      | `ruta` | la nav del pack | el odontograma **no es ítem de menú de nadie**: vive dentro de la ficha. Declararlo ahí lo escondía **hasta del dental** |
      | `familias` | la familia de rubro | la familia `clinica` son **tres tracks**: dental, estética y veterinaria |

      Es un escalón distinto del hueco ya anotado entre dos gates hermanos: acá los dos guards
      están bien y el que aplicaba era **más grueso que su sujeto**. La superficie afectada son
      las **subrutas de ficha**, que ningún gate de caminos recorre.

      **Arreglo:** `onia-platform` `0d0d02a` (rama `claude/chatbots-platform-review-0d1d09`).
      No es una lista de tracks al lado de la pregunta —eso vuelve a divergir—: se agrega
      `soloSi`, al que se le pasa el **mismo predicado que usa la pantalla**.
      `tieneOdontograma()` queda en `vertical-pack.ts` junto a `fichaClinica` y
      `llevaInventario`, y ahora lo leen los **tres** lugares que antes lo tenían tipeado
      suelto (la ruta, la ficha y la ayuda). Un track nuevo con odontograma se agrega tocando
      **sólo esa función**.

      **El odontograma NO se borró:** el dentista conserva su pregunta, y ese caso está anclado
      porque sin él **borrar** la pregunta pasaba en verde.

      Gate nuevo `lib/ayuda/ayuda-por-track.test.ts`, con los sujetos derivados de los **siete
      packs** (un rubro nuevo nace cubierto). Validado por **mutación en tres direcciones**,
      las tres en rojo: sacar el filtro `soloSi`, volver a `familias: CLINICA`, y hacer que el
      predicado diga que sí a todos.

      ⚠️ **Y un fallo callado que encontró el propio gate:** olvidar `trackId` en una llamada
      hace que `soloSi` reciba `undefined`, conteste que no, y la pregunta desaparezca **para
      todos** — se lee como «esa ayuda no existe». Por eso el parámetro es **obligatorio**: que
      `tsc` lo exija es lo único que lo hace visible. Pasó de verdad en el primer intento.

      **MIRADO renderizado** en las dos direcciones (banco `/dev/faq-ayuda`, cero respuestas
      `>=400`): dental muestra la pregunta bajo «Pacientes»; estética dice «Clientas», ya no la
      ve y no queda tarjeta vacía. Gates: `tsc` 0 · `vitest` **3360** passed / 293 archivos ·
      `eslint` 0 errores.

      **NO DESPLEGADO** — llega al cliente con el swap de `plataforma` (`t_deddf471`).

- [x] 🟡 **El gate de cobertura multi-rubro miraba 6 de 25 pantallas compartidas: ampliado a
      las 25.** `lib/platform/pantallas-compartidas-cubiertas.test.ts` excluía por escrito las
      que todos los packs llaman **igual**, con este razonamiento adentro: *«si todos la llaman
      igual, no hay par (rubro, texto) que pueda contradecirse»*. Es cierto del **rótulo** y
      falso del **contenido**, y esa premisa falló **cuatro** veces seguidas, las cuatro con
      rótulo idéntico en los siete packs: `/appointments`, `/comercio/caja`, `/inventory` y
      `/settings` (los cuatro más abajo en esta misma sección).

      **Lo que cambió:** el sujeto pasa de «compartida con rótulo distinto» a **«compartida por
      dos o más packs»** — de 6 filas a 25 — y cada una declara CÓMO se cubre, en tres formas
      que **todas dejan rastro ejecutable**:

      | forma | cuántas | qué se verifica en cada corrida |
      |---|---|---|
      | `gate` | 9 | el gate propio existe y nombra la ruta |
      | `barrido` | 15 | este archivo barre los fuentes de la ruta: cero palabra de un solo rubro |
      | `fuera-de-cliente` | 1 | `/admin`: todo pack que la muestra la da sólo a `SUPERADMIN` |

      **«Ya deriva del pack» sigue prohibida como cobertura**, y ahora con su medición: `/settings`
      IMPORTABA `vocabularioDeTrack`, lo usaba para dos campos y tenía ocho textos dentales
      tipeados al lado. Un chequeo de imports la daba por cubierta.

      ⚠️ **Las tres trampas del detector, todas con su caso que las ancla** — las tres van en la
      dirección cara, hacen acusar a una pantalla sana: `diente` sin `\b` matchea
      «pen**diente**s» (`/communications`, `/reports`, `/rrhh`, `/requerimientos`);
      `doctorId, patientEmail` se cuela como frase por la coma; y `` `Eliminar a ${doctor.name}` ``
      trae el identificador dentro de la interpolación. El mismo caso exige que el detector **sí**
      encuentre «paciente» y «Odontograma»: sin esa mitad puede pudrirse en «siempre vacío» y las
      15 filas pasan en verde sin mirar nada.

      **Validado por MUTACIÓN, las cuatro en rojo:** volver el sujeto a rótulo distinto (2 casos),
      borrar una fila (`/contabilidad`), romper el detector, e inyectar «pacientes» en `/rrhh`.
      Gates: `tsc` 0 · `vitest` 3.356 · `eslint` 0. Commit `c603bbf` (rama
      `claude/chatbots-platform-review-0d1d09`, publicada en `50cb996` con `origin/master`
      mergeado — el árbol gateado es el publicado, `1a5cf5dd`).

      Se ve con: `npx vitest run lib/platform/pantallas-compartidas-cubiertas.test.ts` (47 casos).

- [x] 🔴 **La pantalla donde el cliente decide CUÁNTO PAGA le hablaba en dental a cuatro
      rubros.** `/settings` la comparten los **siete** packs y las tarjetas de plan se le
      muestran a todos los rubros clínicos (`esDental = !esComercio`), que no son sólo dental:
      **estética, veterinaria y servicios profesionales** entran por la misma rama. Los tres
      leían **«Odontograma interactivo»** (×3), **«Catálogo de tratamientos ilimitado»** (×3) y
      **«Para clínicas grandes que necesitan control gerencial»** justo antes de pagar — ocho
      textos por rubro, contados por el test antes de arreglar.

      **Por qué sobrevivió, que es lo reusable:** un arreglo anterior ya había tomado el
      vocabulario para `v.clientes` y `v.negocio` y **dejó el resto tipeado**, así que el
      archivo IMPORTA `vocabularioDeTrack` y aun así decía dental — un chequeo del tipo «¿esta
      pantalla deriva del pack?» la daba por cubierta. Y el gate de cobertura no podía verla:
      excluye las pantallas que todos los packs llaman igual, y los siete la llaman
      «Configuración».

      **El odontograma NO se borró:** dental lo sigue viendo (es una feature real que tiene);
      los demás leen la ficha de sus clientes, y el test ancla esa dirección inversa porque
      vaciar el texto también haría pasar el caso principal.

      Commit `633b6ed` (`onia-platform`, rama del carril). Gates: `tsc` exit 0 ·
      `vitest` 3311 passed / 292 archivos · `eslint` exit 0.
      Se ve con: `npx vitest run 'app/(dashboard)/settings/planes-en-el-idioma-del-rubro.test.ts'`


- [x] 🔴 **CERRADO el 2026-09-07: a un centro de estética le sugeríamos un proveedor dental —
      y el defecto estaba en el punto ciego del gate que existe para cazarlo.**

      **El defecto:** en `/inventory` el campo **Proveedor** proponía de ejemplo
      *«Dental Supply Bolivia»*. Esa pantalla la comparten los **tres packs clínicos**
      —dental, **estética** (rubro vendible de la v1.0) y veterinaria— y los tres la llaman
      **«Inventario»**. Al dueño de un centro de estética el sistema le sugería el proveedor
      de otro negocio.

      **Por qué no lo vio nadie, que vale más que el defecto:** es un `placeholder`. No es un
      párrafo, no sobra ninguna palabra, ningún barrido de literales prohibidos lo mira, y en
      el rubro que lo escribió es copy **legítimo**. Es la forma más escondida de la familia
      (rubro, texto).

      🔴 **Y el hallazgo grande, medido: el gate de cobertura mira 6 de 25 pantallas
      compartidas.** `lib/platform/pantallas-compartidas-cubiertas.test.ts` excluye **por
      escrito** las pantallas que todos los packs llaman igual, razonando que *«si todos los
      packs la llaman igual, no hay par (rubro, texto) que pueda contradecirse»*. Esa premisa
      **ya falló tres veces, las tres con rótulo idéntico en todos sus packs**:

      | pantalla | rótulo | defecto | cuándo |
      |---|---|---|---|
      | `/appointments` | «Citas» en los 4 | «El doctor» a un estudio contable | 2026-09-07 |
      | `/comercio/caja` | «Caja» en los 3 | «productos con stock» a servicios profesionales | 2026-09-06 |
      | `/inventory` | «Inventario» en los 3 | proveedor dental a estética | 2026-09-07 |

      Las tres se arreglaron como **instancia**; la premisa sigue en pie y deja **19 pantallas
      sin vigilar**. **El rótulo del menú no es el eje** — el defecto vive en el copy, no en el
      nombre. Queda anotado en «Después»: el sujeto del gate tiene que ser *toda* pantalla que
      dos packs comparten.

      ⚠️ **Y un instrumento que casi me hace declarar sanas a las que no lo están:** medir
      «esta pantalla deriva del vocabulario» con `grep vocabularioDeTrack` da **CERO** sobre
      `/comercio/caja`, que **sí** deriva (usa otro helper, `idioma.ques`). Es una lista de
      inclusión de nombres de símbolo y falla **abierto**.

      **Arreglo:** `onia-platform` `e843507` (rama `claude/chatbots-platform-review-0d1d09`).
      Gate nuevo en `app/(dashboard)/inventory/placeholder-sin-rubro.test.ts`, que **deriva sus
      sujetos de los placeholders del archivo** — un ejemplo nuevo nace cubierto. Rojo primero
      por el motivo exacto (1 de 12) y validado por **mutación** en la otra dirección («caja
      veterinaria» también lo pone rojo). No prohíbe el idioma compartido de los tres clínicos
      («bioseguridad», «uso en consulta»): prohibirlo obligaría a empeorar ejemplos que hoy
      están bien. Gates: `tsc` 0 · **3306** tests · `eslint` 0 errores.

      **NO DESPLEGADO** — llega al cliente con el swap de `plataforma` (`t_deddf471`).

- [x] 🔴 **CERRADO el 2026-09-07: el CONTRATO que firma quien se da de alta describía una
      clínica dental — y el alta vende los cinco rubros.**

      **El defecto, medido en producción con `curl` (no supuesto):** `app.onia.com.bo/terms`
      (HTTP 200) definía el servicio como *«software como servicio para gestión **dental**:
      pacientes, agenda, tratamientos, **odontograma**»* y trataba al cliente como **«la
      clínica»** en ocho cláusulas; `/data-processing` le imponía *«Obligaciones de la
      clínica»*; el pie de `/contact` decía *«Sistema de gestión **dental** para **clínicas**
      en Bolivia»*. Los tres los enlaza `app/(auth)/register/SignupForm.tsx`, y el alta ofrece
      los cinco rubros de `RUBROS_ACTIVOS`: **el que elegía Comercio, Importadora o Servicios
      profesionales aceptaba un contrato de odontología** que no describe lo que contrató.

      **Por qué sobrevivió:** es superficie **compartida** por los cinco rubros. No pasa por
      `lib/onboarding/vocabulario.ts` (que sólo cubre el panel), no sale en una captura del
      dashboard y ningún gate de caminos la mira. Es la misma familia (rubro × texto) que ya
      dio el correo de citas y la receta, un escalón más afuera: la superficie **legal**.

      **El arreglo:** `800a583` en `claude/chatbots-platform-review-0d1d09`. La cláusula 4 no se
      borró — se **acotó a los rubros de salud**, para no perder la protección donde sí
      corresponde. `/privacy` quedó **intacto a propósito**: ya decía *«En verticales de salud
      esto incluye datos de pacientes (historia clínica, odontograma…)»*, que es correcto.

      **El gate:** `app/superficie-compartida-por-rubro.test.ts`, con los sujetos derivados del
      **disco** y exenciones nombradas, así una pantalla nueva nace cubierta. La primera versión
      marcaba `/privacy` — falso positivo que mandaba a romper una redacción buena —, por eso la
      regla del odontograma mide la **vecindad** y perdona la mención ya acotada. Validado por
      **mutación en las dos direcciones**. Gates: `tsc` 0, `eslint` 0 errores, `vitest`
      3294/290.

      ⚠️ **NO llega al cliente todavía:** `800a583` **no es ancestro de `origin/master`**;
      necesita merge (`onia-cola`) para viajar en el deploy que espera el `ok` de Sergio Urcullo
      (`t_deddf471`). Anotado ahí, sin abrir un pedido nuevo.


*(vacío — esta cola se abrió el 2026-09-05)*
