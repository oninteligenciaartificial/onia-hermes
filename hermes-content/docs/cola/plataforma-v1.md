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

## Definición 1.0 — pedida por Sergio Urcullo el 2026-09-10, medida ese día

**1.0 = un cliente de los 5 rubros puede DESCUBRIR, PROBAR, USAR y PAGAR Onia sin que
intervenga un humano de Onia, y sin encontrar una sola promesa falsa.** Vara de calidad:
Lety/Dapta/SendyPro (titular claro, un precio, pocos clics). Nueve puntos, cada uno con su
LISTO medible; el estado es del 10-sep y se re-mide, no se hereda:

| # | Punto | LISTO = | Estado 10-sep |
|---|---|---|---|
| 1 | Alta sola | registro → correo EN BANDEJA → clic → panel | ✅ CERRADO 13-sep 00:11 con el Chrome de Sergio: correo "Confirmá tu correo" EN RECIBIDOS (no spam, 6:55 pm), clic en "Confirmar mi correo" → app.onia.com.bo/onboarding con la cuenta adentro y el nombre precargado. E2E completo sin humanos de Onia |
| 2 | Recorrido de los 5 rubros | cada rubro cierra su flujo core sin romperse | 🟡 `recorrido-cliente` patrulla diario (hoy 13:12 exit 0) |
| 3 | Cobro | comprobante → APPROVED → plan activo solo | ✅ probado 10-sep; 12-sep: escalera C (320/550/890/1.290, bot en Full) DESPLEGADA — el checkout valida los montos nuevos |
| 4 | El plan manda | trial vencido bloquea; topes se cumplen | ✅ modal + topes (`f05b2fc` «el tope que nadie aplicaba») + reservas de cuenta apagada cerradas (`ba2270b`) |
| 5 | Factura SIAT | la suscripción cobrada emite factura | 🟢 13-sep 03:00: **FASE 1 COMPLETA AL 100 % (checkpoint local): 5.732/5.732** — matriz base 5042/5042 (VI cerró 560/560 en la pasada 3) **+ etapa VIII 690/690 en `908 VALIDADA`** con firma XMLDSig propia (node:crypto, cero deps) y certificado autofirmado con NIT en `serialNumber` — el piloto no valida cadena, medido en vivo (SIN 922/914 como guardas). Wrapper F1.4 desplegado (health verde :8517). Quedan, y son de Sergio: (1) cotejar el marcador del portal (2 min, login suyo); (2) si da 100 %: **solicitar Fase 2 (inspección), pedir VIRTUAL** (15 min); (3) Leslie: certificado de PRODUCCIÓN Bs 70 en solicitud.firmadigital.bo — no bloquea la Fase 1. Guía: `ONIA_SIAT_TU_PARTE_DEL_TRAMITE.md` |
| 6 | Chatbot atiende solo (web + WhatsApp) | responde, califica y agenda demo | 🟢 12-sep: reinicio-por-vencimiento DESPLEGADO (deploy-bot 16 archivos, backup 224551Z) — las conversaciones viejas reviven; conocimiento con escalera C vivo (951 tests). Los 3 prospectos de agosto: ORDEN de Sergio 12-sep — se escriben SOLO con el chatbot perfeccionado y la 1.0 lista; si no, no |
| 7 | Panel del dueño estilo Hostinger | pestañas agrupadas y cada sección cierra su flujo | ✅ estructura VIVA (grupos + Primeros pasos + fecha La Paz + 2FA); queda `feat/canal-meta` (App Review = Sergio Urcullo) |
| 8 | Cero promesas falsas | lo que cada pantalla promete por rubro/plan se abre | 🟡 barridos 8-sep y 9-sep (`e843507` estética/dental) + 10-sep el NOMBRE del plan (`fe6eb65`, gate `nombre-de-plan-a-mano`); el recorrido caza el resto |
| 9 | Opera sin Sergio | correos, avisos, backups, publicador corren solos | ✅ medido 10-sep (publicador «al día», watchdog del bot, correo entrega) |

**Fuera de la 1.0 (decidido, no se reabre):** veterinaria/ganadería, offline ganadero,
pasarela automática QR, apps móviles, contenido/influencers/marketing (congelados 5-sep).

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

- [x] 🔴 **CERRADO el 2026-09-18 — el panel le reclamaba el pago a las cuentas de Onia, en
      TODAS las pantallas** (`onia-platform` `36687657`, rama del carril; gates en el VPS
      sobre el arbol con `origin/master` mergeado: tsc 0 · 5.698 tests · eslint 0 errores).

      **Lo pidio Sergio Urcullo hoy** mirando /settings con la cuenta interna: *"yo no tengo
      que pagar nada, sacalo"*. `7e275e29` saco «Mi plan» de esa pantalla para las cuentas que
      no son clientes (`esCuentaQueNoEsCliente`) — y con eso cerro la puerta a la que el dueño
      **VA**, dejando abiertas las TRES por las que el producto lo va a **buscar a el**, que se
      deciden todas en `app/(dashboard)/layout.tsx` y se pintan en cada pantalla del panel:
      la franja de estado de abajo (CTA «Ver mi plan»), la banda grande de renovacion y el
      banner de solo lectura («Renovar mi plan»).

      **MIRADO en produccion, no deducido.** `node scripts/mirar_bandeja_dueno.mjs --email
      sergio@onia.com.bo --ruta /settings/addon-chatbot` (org `clinica-sergio-p2ljs`, cuenta
      NUESTRA): la franja decia **«Profesional · prueba: 30 días»** con el enlace **«Ver mi
      plan»**, o sea mandaba a la seccion que ese mismo commit le acababa de esconder. Contadas
      en `supabase-db` ese dia hay **cinco** organizaciones y **ninguna es un cliente**, asi que
      hoy ese reclamo solo lo puede leer Onia.

      **No se apago la mitad OPERATIVA**, a proposito: que la cuenta esta en solo lectura le
      importa igual a una cuenta nuestra —si no, el producto parece roto— y el texto de
      `avisoSoloLectura` es operativo («podes consultar y exportar»). Lo que se calla es el
      CARGO: el CTA y la banda. La pregunta viaja como parametro **OBLIGATORIO** (`esCliente`),
      asi que `tsc` caza al panel que se olvide — encontro **cuatro** llamadores, uno el segundo
      `LayoutShell` del propio layout.

      **Gate:** `lib/subscription/a-una-cuenta-propia-no-se-le-cobra.test.ts`, universo derivado
      del disco (quien llama a `dondeSeRenueva`), exencion nombrada y re-medida
      (`aviso-de-pago-resuelto`: contesta un pago que el dueño YA hizo). Validado por mutacion
      en tres direcciones; **la segunda paso VERDE con la primera version del gate**, que exigia
      la MENCION de `esCliente` en vez de la LLAMADA a la fuente: `const esCliente = true` lo
      dejaba conforme. Se cerro pidiendo la llamada y prohibiendo el literal y el shorthand JSX.

      **Lo que NO cierra este item, medido:** esto apaga la venta en el PANEL. Falta barrer las
      superficies que le hablan al dueño **fuera** del panel con el mismo criterio — el push y el
      aviso in-app de vencimiento salen de `lib/subscription/vencimientos.ts`, que hoy solo
      consume el cron de renovacion (ese SI filtra con `filtroPrismaSoloClientes`), asi que la
      clase esta cubierta por ahora **por el filtro del cron y no por el aviso**: el dia que otro
      llamador use `vencimientos.ts` nace mudo. El gate de este commit no lo ve, porque su
      universo son los que llaman a `dondeSeRenueva`.

- [x] 🔴 **CERRADO el 2026-09-18 — un negocio del plan más barato salía del alta con un
      administrador de más, gratis** (`onia-platform` `e25eadd6`, rama del carril; los tres gates
      verdes en el VPS sobre el árbol con `origin/master` ya mergeado: tsc 0 · 465 archivos de
      test · eslint 0).

      **Era la CUARTA puerta de DG-043, y la dejó escrita este mismo carril ayer** como *"lo que
      NO cierra este ítem"*. De las dos superficies que ese párrafo nombraba, **una ya no existía**
      (`paso-equipo.tsx` la cerró `1705269d`: hoy recibe `plan` y filtra) — o sea era un pendiente
      medio fantasma, y por eso se re-midió antes de tocar nada. La que **sí** seguía viva es la
      que importa: `POST /api/onboarding/aplicar` escribía el `rol` que venía **en el cuerpo**.

      **Por qué el filtro de la pantalla no alcanzaba.** El rol viaja en el JSON que manda el
      cliente, así que la pantalla es una *sugerencia*: quien postea directo elegía `ADMIN` en
      cualquier plan y la ficha nacía con ese rol. Las otras tres puertas ya preguntaban
      (`POST /api/team`, `POST /api/admin/users`, `PATCH /api/admin/users/[id]`) — ésta no, y es
      justo la del alta, que la recorre **todo** cliente nuevo.

      **Decisiones que el arreglo fija:** el rol se deriva con la MISMA función que filtra la
      pantalla (`rolGuardableSegunPlan`, junto a sus hermanas en `coadministradores.ts`), y **una
      sola vez** — abajo había dos lecturas más del rol pedido, la agenda del miembro y lo que la
      pantalla de cierre promete, que con el valor sin filtrar decían otra cosa que la ficha
      guardada. **Degrada en vez de rechazar, a propósito:** sus hermanas contestan 403 porque son
      acciones sueltas, pero ésta vive dentro de la transacción del alta, y un 403 ahí deja al
      cliente nuevo sin `onboardingCompletedAt` —sin poder mirar **nada**— por el rol de un
      miembro **opcional**. Cae al mejor rol que su plan permite, derivado del **rubro**: en
      comercio, que no tiene profesional con agenda (`rolesEquipo` = STAFF, ADMIN), el piso es
      STAFF, y entonces nadie le promete agenda ni le escribe horarios. Un `"DOCTOR"` tipeado en
      la cura rompía ese caso.

      **Cierra la CLASE, que es lo que venía fallando:** las cuatro puertas se encontraron **a
      mano, una por día**. `lib/subscription/puertas-que-escriben-un-rol.test.ts` camina el
      **disco** (`readdirSync`, no `git ls-files`: la puerta nueva es el archivo aún sin
      commitear), acota la escritura con **llaves balanceadas** —`data: { role: role as Role }`
      viaja en una sola línea y un detector por renglón perdía `/api/admin/users/[id]`— y
      **deriva** la exención: un rol literal que no es ADMIN, como el `"DOCTOR"` fijo de
      `/api/doctors`, no tiene nada que preguntar, y entra al universo solo el día que reciba el
      rol por parámetro.

      **Validado por 6 mutaciones**, en las dos direcciones: guardar el rol pedido · el `select`
      sin `plan` · la promesa de agenda y la escritura de horarios con el rol sin filtrar · una
      puerta **nueva** que no pregunta · una puerta viva que deja de preguntar — todas en rojo
      nombrando su sujeto; y la puerta de rol literal **no** se acusa.

      ⚠️ **Dos falsos verdes PROPIOS, encontrados por la mutación y corregidos:** el mock de
      `organization.update` no respetaba el `select` (sin eso, olvidarse `plan: true` pasaba el
      gate en verde y en producción llegaba `undefined`, que cae a `free` y degradaba a **todo el
      mundo**), y ningún caso distinguía el rol pedido del guardado hasta que entró el de comercio
      — los dos primeros intentos de mutación salieron verdes contra un gate que ya estaba escrito.

      ⚠️ **Commiteado y publicado en la rama del carril, NO desplegado:** lo mergea `onia-cola`.
      No se pudo mirar renderizado con sesión real — sigue vivo el corte de 2FA que manda toda
      ruta del panel a `/profile?mfa=obligatorio` (tarea `t_3bb6b9ee`, depende de Sergio Urcullo).

- [x] 🔴 **CERRADO el 2026-09-18 — el dueño que conectaba su Instagram o el chat de su web no
      podía apagarlos nunca** (`onia-platform` `3a61c3ea`, rama del carril; los tres gates
      verdes acá Y re-corridos en el VPS sobre el árbol con `origin/master` mergeado: tsc 0 ·
      5587 tests · eslint 0 errores).

      **La cura del día anterior no viajó a los hermanos.** El 17-sep se cerró el camino de
      vuelta del canal de WhatsApp. `chatbot-canal-meta` y `chatbot-canal-web` están en el mismo
      directorio, escritos con el mismo molde, y quedaron igual que antes: derivado del disco,
      los dos exportan `POST` y **no** `DELETE`, y sus tarjetas del panel
      (`CanalMetaCard.tsx`, `CanalWebCard.tsx`) sólo llaman al `POST` — mientras
      `CanalWhatsappCard.tsx` ya tenía su botón.

      **Qué costaba:** el dueño que conectaba su página quedaba con el bot contestándole a SUS
      clientes en SU Instagram y Messenger, en nombre de su marca, sin más salida que
      escribirnos. Es el agujero de seguridad y, a la vez, horas de soporte por cliente — el
      techo del negocio (`ONIA_ESTRATEGIA_DE_EMPRESA.md` §9).

      **Decisiones que el arreglo fija:** el apagado se gatea **sólo por el rol, nunca por el
      add-on** (exigirlo le cerraría la salida justo al que dio de baja el add-on o se le venció
      el plan); Meta suelta los **tres** campos (`chatwootMetaInboxId`, `metaPageId`,
      `metaInstagramId`) porque los dos últimos son la huella de la cuenta del dueño y
      `encenderCanalMeta` los lee para creerse vinculado; el botón del canal web va **fuera** del
      ternario del snippet, porque si el código no se pudo leer el canal sigue atendiendo y
      apagarlo es más urgente, no menos.

      **Gates (cierran la CLASE, no la instancia):**
      `lib/chatbot/todo-canal-se-puede-apagar.test.ts` camina el universo del **disco**
      (`readdirSync`, no `git ls-files`: el canal nuevo es justo el archivo sin commitear), mide
      con los comentarios en blanco para que este archivo no se absuelva solo, y exige las **dos**
      mitades — API y pantalla —, que el `DELETE` no pregunte por el add-on y que el botón
      confirme antes de cortar. `lib/chatbot/apagar-canal.test.ts` exige que los tres apagados no
      se pisen entre sí (un `data` de más apaga un canal que el dueño no pidió apagar, que es la
      dirección simétrica del bug del slot compartido que documenta `canal-whatsapp.test.ts`) y
      que sean idempotentes; de paso `apagarCanalWhatsapp` tampoco tenía test propio.

      **Validado por 5 mutaciones**, todas en rojo nombrando su sujeto: `DELETE` quitado · botón
      quitado · add-on exigido en el `DELETE` · Meta soltando sólo el inbox · universo recortado
      (el gate apagándose solo).

      ⚠️ **Commiteado y publicado en la rama del carril, NO desplegado:** lo mergea `onia-cola` y
      el pedido de deploy vivo es `t_b8d00627`, esperando el `ok` de Sergio Urcullo. **No se pudo
      mirar renderizada en producción**: el bug de MFA vencido manda toda ruta del panel a
      `/profile?mfa=obligatorio`, y su arreglo (`b1247fb`) está en `master` pero **no** en el
      build vivo — medido el 2026-09-18: `BUILD_ID` vivo `OFd4xCDzoTbQdThUbfzDv` =
      `build-f078373`, con **64** commits de `master` sin publicar.

- [x] ✅ **CERRADO el 2026-09-17 — el negocio de cualquier plan podía crearse un segundo
      administrador gratis: la misma pantalla tenía DOS botones y sólo uno preguntaba el plan.**

      **Qué pasaba.** El 17-sep entró `multiAdminIncluded` (decisión de Sergio Urcullo: los
      coadministradores vienen en los paquetes caros, dentro de un solo pago). Se cerraron tres
      superficies — `POST /api/team`, `PATCH /api/admin/users/[id]` y el selector de `/settings` —
      y quedó abierta la cuarta, que es justo la que el dueño usa: el modal de **Equipo**
      (`app/(dashboard)/team/InviteModal.tsx`) ofrece el rol "Administrador" sin mirar el plan, y
      tiene dos caminos con el MISMO selector: *crear con contraseña* postea a `/api/team` (403,
      correcto) e *invitar por correo* postea a **`/api/admin/users`, que no preguntaba nada** y
      devolvía 201 — con invitación real de Supabase, o sea el segundo admin podía entrar. La ruta
      ya consultaba el plan para otras dos cosas (`checkPlanExpiry`, `checkUserLimit`): la pregunta
      que faltaba era exactamente la que se cobra.

      **Prueba.** Test en ROJO primero por el motivo correcto (`plan free: expected 201 to be 403`,
      2 fallando de 7) en `app/api/admin/users/route.test.ts`, y verde después del arreglo; el caso
      anti-tautología recorre `PLAN_IDS` del catálogo y exige `201 ⇔ multiAdminIncluido(plan)`, así
      que la puerta no puede volver a decidir con una lista tipeada. Gates: `npx tsc --noEmit` 0
      errores (los 4 que salían eran la carpeta de tipos generada de Next, stale, acusando la ruta
      del webhook legado de WhatsApp que el commit `abf6cb5b` borró hoy — se curan borrando esa
      carpeta generada), `eslint` limpio, `vitest` completo verde. Commit en `onia-platform`, rama
      `claude/chatbots-platform-review-0d1d09`.

      **Lo que NO cierra este ítem, con su reproducción exacta —** dos superficies más de la misma
      clase, las dos SIN acceso real (por eso no bloquean): (1) `app/onboarding/pasos/paso-equipo.tsx`
      ofrece "Administrador" en el paso 4 del alta sin filtrar por plan — recibe `vocabulario` por
      prop y **no recibe el plan**, hay que pasárselo desde su llamador; (2) `POST /api/onboarding/aplicar`
      (línea ~182, `role: equipo.rol`) crea esa ficha con rol ADMIN sin preguntar. La ficha nace con
      `userId: pendiente-<uuid>`, así que **no puede loguear**: el daño aparecía al invitarla después,
      y esa puerta ya quedó cerrada acá. Se ve con
      `grep -n "rolesEquipo" app/onboarding/pasos/paso-equipo.tsx`.

      **Y el gate que dejó la clase abierta está identificado:**
      `lib/subscription/coadministradores.test.ts:72` exige el filtro nombrando **a mano** un solo
      archivo (`SettingsClient.tsx`), así que ninguna otra pantalla que ofrezca `rolesEquipo` es
      sujeto de nadie. Cerrarlo pide derivar el universo **caminando la carpeta** (`readdirSync`, no
      `git ls-files`: el archivo nuevo sin commitear es justo el sujeto que se quiere cazar) y exigir
      `rolesOfrecidosPorPlan` en cada pantalla que ofrezca esos roles. No se escribió en esta vuelta
      porque saldría ROJO por `paso-equipo.tsx` y ese gate está en la cadena: trabaría el merge de
      **todos** los carriles hasta que (1) esté arreglado. Los dos van juntos, en la misma vuelta.

- [x] ✅ **CERRADO el 2026-09-18 — el CI de `master` está VERDE, medido en GitHub; el token que
      la vuelta del 17-sep dio por inexistente SÍ existe. Y el vigía que avisaba no decía CUÁNDO
      fue el fallo: arreglado** (`scripts/loops/vigia-ci.sh` + 3 casos nuevos en su prueba).

      **El desbloqueo es el token.** El ítem de abajo (17-sep) cerró con *«juzgarlas del todo pide
      abrir el run en GitHub y el `GITHUB_TOKEN` de `/root/.hermes/.env` está comentado»*. Es
      cierto de ESE archivo y falso del sistema: el vigía de CI tiene el suyo, fine-grained con
      **Actions: Read-only**, en **`/root/.config/onia/github-token` del VPS** (existe desde el
      6-sep, `chmod 600`). Con él la pregunta se contesta en un comando:

          T=$(cat /root/.config/onia/github-token)
          curl -s -H "Authorization: Bearer $T" \
            "https://api.github.com/repos/oninteligenciaartificial/onia-platform/actions/runs?branch=master&per_page=30"

      **Veredicto medido (2026-09-18 10:46 UTC):** `Security | completed | success | 8bf65db` y
      `CI | completed | success | 8bf65db` — el HEAD de `master`. Los 14 runs más recientes son
      **todos `success`**; los únicos `failure` de Security son del 17-sep 20:11/20:12
      (`2465969`, `736a1f3`), ya superados. **`master` no está roto.**

      **La tarea `t_8e76db40` citaba un run del 5 de septiembre** (`545dd28`, run
      `33992799604`), curado el **6-sep** por `.gitleaks.toml` (`0c54d656`). Reproducido en un
      clon **completo** (el del VPS es parcial y no sirve para esto): sobre el árbol de
      `545dd288` el paso 1 da `leaks found: 2` y exit 1 — dos ejemplos de `curl` de la pantalla de
      API keys de `onia-platform` (`ApiKeysClient.tsx`, líneas 279 y 284), falsos positivos de la regla
      `curl-auth-header`; sobre el árbol de hoy da `no leaks found`, exit 0.

      🔴 **El arreglo, porque la clase se repite: el aviso no llevaba la fecha del run.** Un rojo
      de hace trece días y uno de hace cinco minutos se leían idénticos, y los dos decían
      *«mientras siga así, `master` está roto y el deploy va a fallar»*. Eso ya costó una vuelta
      entera (la del 17-sep, que corrió los cinco gates a mano y aun así no pudo juzgarlo). Ahora
      el aviso agrega `Corrida del <fecha> (hace N d)`, y sólo cuando aporta — un rojo de hoy no
      dice «hace 0 días». Validado **por mutación**: quitándole `created_at` al parser, la prueba
      sale exit 1 con exactamente esas 2 fallas.

      ⚠️ **Dos trampas medidas, por si otro carril repite el camino.** (1) Reproducir el escaneo
      en el clon del VPS da falsos: es parcial (`blob:none`), así que gitleaks no alcanza los
      blobs y escribe `ERR ... ssh: Could not resolve hostname gh-platform` en rangos largos.
      (2) `0 commits scanned` **no** es siempre el falso verde que `rango-gitleaks.sh` cierra:
      `545dd288` cambia **sólo un binario** (`app/favicon.ico`), y un diff sin texto no tiene
      nada que escanear. Se descarta mirando los padres (`git rev-list --parents -n 1`) y el
      `--stat`, no asumiendo.

- [x] ✅ **CERRADO el 2026-09-17 — el tablero decía que `master` de `onia-platform` estaba roto
      y NO lo está: los cinco gates del CI, corridos a mano sobre el commit que el pedido de
      deploy pide publicar, están en verde** (medición, sin cambio de código).

      **Por qué importaba medirlo:** dos tareas del tablero (`t_64aa6738` · CI, `t_db5cffd4` ·
      Security) decían *"mientras siga así, `master` está roto y el deploy va a fallar"*. Si
      fuera cierto, el pedido de deploy vivo de la plataforma (`t_a91f564e`, que cita
      `DEPLOY PEDIDO e43c590`) publicaría un árbol que no compila, y además el rojo traba el
      merge de **todos** los carriles. Es el hecho más caro que había sin verificar.

      **Las dos tareas apuntan a commits ya superados, y eso se puede decir sin el token de
      GitHub.** La de CI reporta `b176eb9` (17-sep 16:52 UTC) y la de Security `545dd28` (del 5
      de septiembre, 12 días antes). `git merge-base --is-ancestor b176eb9 origin/master` → sí:
      ya superado. El HEAD real de `master` es `e43c590` (17-sep 20:34 UTC), **12 commits
      adelante** del que la tarea llama «roto».

      **Medido sobre `e43c590`, los cinco pasos que corre `.github/workflows/ci.yml`:**
      `check:onia-core` → `OK: mirror + catalog match contract v1.0.0 (12 packs, 9 modules)` ·
      `lint` → 0 errores (107 warnings) · `typecheck` (`tsc --noEmit`) → 0 ·
      `test` → **454 archivos, 5.564 pruebas pasadas**, 0 falladas ·
      `build` con las MISMAS variables del CI → `✓ Compiled successfully`.
      El lockfile también está sano: `npm ci` reinstaló los 684 paquetes sin quejarse.

      🔴 **Y la trampa que casi me hace reportar lo contrario, que es la parte que le sirve a
      otros carriles: `npm ci --dry-run` BORRA `node_modules`.** Lo lancé para validar el
      lockfile *mientras el build corría en segundo plano*, y le arrancó los módulos por debajo
      al proceso: el build murió con `TypeError: _webpack.WebpackError is not a constructor` y
      `Build failed because of webpack errors`. Ese mensaje **no nombra la causa** — es el
      manejador de errores de Next fallando al construir el error real —, así que se lee como
      «el código de `master` está roto». `ls node_modules | wc -l` daba **0**. O sea: el rojo
      era mío, no del repo. `--dry-run` en `npm ci` no es de sólo lectura: `npm ci` borra el
      árbol **antes** de simular nada, y encima ejecuta el `postinstall` (`prisma: not found`).
      Dos reglas que salen de acá: nunca correr `npm ci` (ni con `--dry-run`) mientras algo
      compila en ese árbol, y ante un fallo de webpack sin archivo nombrado, **preguntarle al
      instrumento antes que al producto**.

      ⚠️ **Ojo con el exit code:** `... | tail -30; echo $?` devuelve el exit de `tail`, no el
      del build — daba `BUILD_EXIT=0` con el build fallado. El veredicto se leyó de la salida
      (`Build failed…`) y después con `> log 2>&1; echo $?` sin pipe.

      **Lo que NO cambia:** las dos tareas de CI siguen abiertas porque juzgarlas del todo pide
      abrir el run en GitHub y el `GITHUB_TOKEN` de `/root/.hermes/.env` está comentado; lo que
      sí queda medido y escrito es que **el árbol que el deploy va a publicar compila**.

- [x] ✅ **CERRADO el 2026-09-17 — el mismo filtro, seis horas después: no veía nuestros correos
      PERSONALES, y el drip seguía vendiéndole Onia a Sergio Urcullo** (`onia-platform`
      `316476e`, publicado en la rama del carril como `2d5695a`; **commiteado y mergeado a la
      rama, NO desplegado** — entra al pedido de la plataforma cuando el integrador lo junte).

      **Medido en producción.** `/var/log/onia-trial-drip.log` del VPS: la org
      `bolivian-electricidad-e6t21` recibió la secuencia de venta **completa** — pasos 3, 7, 12,
      14 y 15 —, y en `supabase-db` su dueño es `sergio.urcullo.m@gmail.com`, el correo personal
      de Sergio Urcullo. Bolivian Electric es **otro proyecto de Onia** (repo y deploy propios):
      no hay un cliente pagando detrás. La cuarta org de la base, `zz-qa-bandeja-10`, usa
      `oninteligenciaartificial+prueba10@gmail.com` — la casilla del **operador**, que el propio
      producto usa de `ADMIN_NOTIFICATION_EMAIL` por defecto
      (`onia-platform/app/api/subscription-payment/route.ts`).

      **Por qué el arreglo de la mañana no alcanzó, y es la parte que sirve a otros carriles:**
      la identidad se estaba deduciendo de una **firma** — un prefijo de slug, un dominio —, y
      una firma sólo reconoce lo que **nosotros marcamos al sembrar**. Las cuentas propias no se
      siembran: se usan, y no tienen marca. Hay que **nombrarlas**. De las cuatro organizaciones
      de la base, la regla del dominio veía dos.

      **Y el test volvió a afirmar el defecto, en el mismo archivo y el mismo día.** El de la
      mañana listaba `clinica-sergio-p2ljs` como cliente; el arreglo lo sacó de ahí… y dejó en
      la lista de «clientes de verdad» a `bolivian-electricidad-e6t21`, con su motivo redactado
      («otro negocio de Sergio Urcullo… es un cliente»). Corregir la instancia no cerró la clase
      porque el instrumento se reescribió con el mismo supuesto.

      **Cómo quedó:** `CORREOS_PROPIOS` nombra las dos direcciones nuestras fuera del dominio y
      se compara la dirección **entera** — `sergio.urcullo.m@outlook.com` y
      `sergio.urcullo.martinez@gmail.com` son de otra persona y siguen siendo clientes, porque
      excluir de más deja a un cliente sin el aviso de que su plan se corta. El subaddressing
      (`+prueba10`) entra porque es la misma casilla; los puntos de Gmail quedan afuera a
      propósito, porque el `where` de Prisma no los puede expresar y una capacidad que tenga el
      que juzga en memoria y no tenga la consulta es **como esos dos lados se separan**. Los dos
      consumidores (`app/api/cron/trial-drip` y `app/api/cron/renewal-reminders`) leen el mismo
      `filtroPrismaSoloClientes()`.

      **Prueba:** test en rojo primero (2 de 10) y **validado por mutación** — cegar el predicado
      da 2/10 rojo, sacar las cláusulas de la consulta da 2/10 rojo. Gates en el VPS: `tsc` 0,
      `vitest` 5011 passed, `eslint` 0 errores.

- [x] ✅ **CERRADO el 2026-09-17 — Onia le vendía Onia a Sergio Urcullo: el circuito de correos
      no reconocía sus propias cuentas** (`onia-platform` `a467002`,
      `lib/platform/cuentas-que-no-son-clientes.ts` + su test).

      **Medido en producción, no deducido.** Contadas en `supabase-db` esa tarde, en TODA la
      base hay **cuatro organizaciones y ninguna es un cliente**. `clinica-sergio-p2ljs`
      (`sergio@onia.com.bo`, con el trial venciendo ese mismo día) venía recibiendo la secuencia
      de venta completa — pasos 3, 7, 12 y 14, visibles en `/var/log/onia-trial-drip.log` del
      VPS —, en el canal que Sergio Urcullo pidió ordenar.

      **Por qué ningún gate lo vio: el instrumento afirmaba el defecto.** El filtro se escribió
      el 2026-09-17 a la mañana (`1ef24c6`) con PREFIJOS de slug, que es la marca que ponemos al
      **sembrar**; las cuentas de Onia no se siembran, se **usan**. Y el test de ese mismo
      archivo listaba `clinica-sergio-p2ljs` y `onia-interna` como **clientes a los que sí había
      que escribirles**, con el nombre del dueño al lado. Un gate cuya lista de sujetos está
      tipeada a mano no siempre falla abierto: cuando **calcula** la respuesta a partir de esa
      lista, contesta mal y **ratifica** el bug que existe para impedir.

      **El daño no es sólo ruido en una bandeja nuestra.** Mientras el producto no pueda separar
      un envío a un lead de uno a sí mismo, el `sent: N` del log se lee como N prospectos
      trabajados cuando pueden ser **cero** — así es como no se ve que el canal está muerto el
      día que importe. (Ya pasó: ocho corridas seguidas con `535 Authentication failed`.)

      **El criterio** es el dominio propio `@onia.com.bo`, y cumple la misma vara asimétrica que
      `zz-qa-`: esas direcciones las emitimos nosotros, así que ningún cliente puede tener una
      por accidente. Se compara el **final** del correo, no «lo contiene» — un cliente puede
      nombrarnos en su dirección (`onia.com.bo@gmail.com`) o vivir en `@onia.com.bo.mx`, y
      excluirlo lo dejaría sin el aviso de que su plan se corta.

      **Efecto medido contra la base:** de las 3 orgs que hoy entran al drip queda **1**
      (`bolivian-electricidad`, un negocio de verdad) y salen las 2 nuestras. Cura de una vez a
      los **dos** consumidores del filtro (`trial-drip` y `renewal-reminders`).

      **Gate validado por mutación:** sacar la pregunta del predicado → 2 rojos; sacar la
      cláusula de la consulta de Prisma → 2 rojos; cambiar «termina en» por «lo contiene» → 1
      rojo. Gates verdes en el VPS (el árbol que se publica): `tsc` 0, 5.010 pruebas, `eslint` 0
      errores.

      ⚠️ **Commiteado y publicado en su rama; NO mergeado ni desplegado** — el merge es de
      `onia-cola`.


- [x] 🔴 **~~El drip de venta le escribía a las cuentas de QA que los carriles siembran en
      producción — y una de ellas es la bandeja real de Sergio Urcullo~~ — CERRADO el 2026-09-17
      (`onia-platform` `1ef24c6`, rama del carril; tsc 0 · vitest 5003/5003 · eslint 0 errores,
      re-corridos EN EL VPS sobre el árbol que se publica).**

      **Medido en producción, no deducido.** `/var/log/onia-trial-drip.log` del VPS: el cron le
      mandó la secuencia de venta **completa** a `zz-qa-ferreteria-tornillo-ommbt` y
      `zz-qa-clinica-chatbot-9k651` (pasos 3, 12, 14 y 15 cada una) y el paso 3 a
      `zz-qa-estetica-modulos-6tzgb`, `zz-qa-salteo-horarios-20260906-yc0yq` y `zz-qa-bandeja-10`.
      Contado en la base (`organizations` ⋈ `onia_trial_drip_sends`), `zz-qa-bandeja-10` sigue
      viva y su correo es `oninteligenciaartificial+prueba10@gmail.com` — la bandeja de Sergio
      Urcullo, que ya pidió ordenar. Y salen de `business@onia.com.bo` hacia casillas de prueba:
      los rebotes de las que ya se borraron pegan en la reputación del dominio, que es **el ítem
      que este carril todavía tiene abierto** («¿Gmail nos pone en Recibidos o en Spam?», más
      abajo).

      **La causa no fue el prefijo que faltaba: fue que el criterio estaba escrito tres veces.**
      `DEMO_SLUG_PREFIX` en `lib/platform/demo-provisioning.ts`, y un `const DEMO_PREFIX =
      "demo-"` tipeado de nuevo en **cada** cron, con su comentario explicando el buen motivo
      (no arrastrar los seeders al bundle del cron). Con el hecho en tres lados, ampliarlo exige
      acordarse de los tres — y el cron que nazca mañana nace sin nada.

      **Arreglo: se invierte la dependencia.** `lib/platform/cuentas-que-no-son-clientes.ts` es
      un módulo **puro** con la fuente única; `demo-provisioning` importa de él y re-exporta; los
      dos crons piden `filtroPrismaSoloClientes()` en vez de rearmar el `NOT`.

      🔴 **`zz-qa-` entra como prefijo reservado; `qa-` NO, y está razonado en el archivo: el
      daño no es simétrico.** Excluir de más deja a un cliente real sin el aviso de que su plan
      se corta — un negocio llamado «QA Consultores» recibe el slug `qa-consultores-xxxxx` —, y
      excluir de menos sólo mete ruido en una bandeja nuestra. Un prefijo entra sólo si ningún
      negocio de verdad podría elegirlo. Consecuencia para los demás carriles: **lo que se
      siembre en producción se sella `zz-qa-…` o el producto no puede distinguirlo de un cliente**
      (las `ferreteria-dev-891411` y `estetica-verificacion-interna` del log son de antes de la
      convención, y ningún prefijo seguro las habría cazado).

      **Los dos gates, validados por mutación:**
      `lib/platform/cuentas-que-no-son-clientes.test.ts` toma como sujetos los slugs **reales que
      recibieron correo**, y ata el filtro de Prisma al predicado en memoria (lo que uno descarta,
      el otro también) — quitar `"zz-qa-"` lo pone rojo. ·
      `app/api/cron/crons-al-dueno-excluyen-cuentas-internas.test.ts` **deriva el universo del
      disco** caminando la carpeta (no `git ls-files`: el cron nuevo sin commitear es justo el
      sujeto que no hay que perder) y define «le escribe al dueño» como *sus sujetos son las orgs
      **y** manda correo* — con eso `appointment-reminders` queda fuera por la razón correcta (sus
      sujetos son citas y el destinatario es el paciente, no el dueño). Devolverle su lista propia
      a un cron lo pone rojo.

      ⚠️ **El test viejo del drip era el que defendía el agujero.** `route.test.ts` afirmaba
      `where.NOT` con los dos elementos de `"demo-"` **tipeados a mano**: las cinco cuentas
      recibieron sus correos con ese test en verde. Ahora se afirma contra la fuente única, con un
      piso de largo para que un `NOT: []` no lo satisfaga.

      **Lo que ve el cliente no cambió todavía:** producción corre el build anterior. Va con el
      pedido de deploy de `plataforma` que ya está vivo — no se abre otro.

- [x] 🔴 **~~La página PÚBLICA de contacto comercial escondía el escalón de Bs 550~~ — CERRADO
      el 2026-09-17 (`onia-platform` `03f4955`, rama del carril; tsc 0 · eslint 0 ·
      `lib/subscription` 393 tests verdes, re-corridos EN EL VPS sobre el árbol que se publica).**
      `app/contact/page.tsx` —viva en `app.onia.com.bo/contact`, HTTP 200 en 1,08 s— pintaba
      **tres** tarjetas escritas a mano (Básico 320 · Profesional 890 · Completo 1.290) y no
      nombraba a `crece` ni una vez: `curl -s https://app.onia.com.bo/contact | grep -c Crece`
      → **0**. La escalera C sumó ese escalón el 12-sep y esta vitrina nunca se enteró, así que
      el prospecto que entra por la página de contacto ve un salto de Bs 320 a Bs 890 sin saber
      que existe el del medio.
      **El segundo defecto vivía en la misma tarjeta y le cuesta plata también al que ya es
      cliente:** la del Profesional decía *"Para activar agenda pública, recurrentes y reportes
      completos"*, y `publicBookingIncluded` es `true` en `crece` desde la escalera C. El mismo
      error estaba en el `upgradeReason` del Profesional en `/settings`
      (*"Desbloquea agenda pública, …"*): al dueño de un Básico se le vende por Bs 890 algo que
      el escalón de Bs 550 ya trae.
      **Por qué no lo cazó el gate hermano:** `donde-esta-incluida-no-se-tipea` busca el par
      `<Plan> y <Plan>` DENTRO de un texto, y una vitrina es una **estructura** —un arreglo de
      tarjetas—, que no tiene esa forma. Pasaba en verde escondiendo un escalón entero.
      Ahora la lista sale de `CHECKOUT_PLANS` y las columnas de su largo; el copy va en un
      `Record` por plan, para que un escalón nuevo **no compile** hasta que alguien escriba qué
      vende, en vez de nacer invisible.
      Gate derivado del disco: `lib/subscription/la-vitrina-de-planes-no-se-tipea.test.ts`.
      **Validado por mutación en las dos direcciones, y la segunda pasó VERDE en el primer
      intento** — el ancla de la tarjeta era el precio, y en `PlanClient.tsx` el `upgradeReason`
      está ARRIBA de `DEFAULT_PLAN_AMOUNTS.professional`, así que la promesa caía en la ventana
      del plan anterior y se absolvía sola; el ancla toma ahora la PRIMERA marca que grita el
      sujeto (precio, clave de `Record` o `key: "<plan>"`).
      **Mirada renderizada** en 1440×900 y 390×844 con `reducedMotion:"reduce"`: cuatro
      tarjetas (320 · 550 · 890 · 1.290), cero respuestas ≥400, ningún texto cortado.
      🔴 **FALTA PUBLICARLO:** el pedido de deploy de la plataforma ya existe y está `blocked`
      esperando el `ok` de Sergio Urcullo. Ningún carril lo destraba.
      ⚠️ **Anotado de paso, NO tocado** (un ítem por vuelta): el header de esa misma página
      dice *"Pedí tu acceso"* apuntando a `/register`, copy del alta cerrada — el alta está
      ABIERTA desde el 29-ago y las demás superficies dicen *"Creá tu cuenta"*.

- [x] 🔴 **~~El panel del operador no conocía el plan que se vende: `/admin/plans` no mostraba
      ni ofrecía `crece`~~ — CERRADO el 2026-09-17 (`onia-platform`, rama del carril; los cinco
      gates del CI verdes: tsc 0 · 4976 tests · eslint 0 errores · check:onia-core · build).**
      La pantalla que se llama «Planes» enumeraba los planes con **cuatro tablas escritas a
      mano** —`PLAN_INFO` en `page.tsx`, `PLAN_COLORS`/`PLAN_BORDER`/`PLAN_BADGE` en
      `PlansClient.tsx`— más un **quinto** lugar: el `<select>` de la edición inline. La
      escalera C del 12-sep sumó `crece` (Bs 550) y **no entró en ninguna**.

      **Lo que veía Sergio Urcullo**: en «Planes disponibles» el escalón que se vende no
      existía, y el `<select>` para asignarle un plan a un cliente **no lo ofrecía** — aunque
      `PATCH /api/admin/clinics` ya lo acepta desde el 13-sep (`07c97f6`). Permiso concedido,
      camino ausente: se podía cobrar un plan que el panel no sabía asignar. El mismo `<select>`
      rotulaba **«Clínica»** un plan que se llama **«Completo»**.

      **Y dos afirmaciones falsas que se arreglaron solas al derivar:** la tarjeta listaba
      «Exportación CSV» sólo en el plan más caro (`csvExportEnabled` es `true` desde Básico **a
      propósito** — el export de SUS datos no es rehén del plan; es el mismo defecto que ya
      había mordido en la comparativa de `/settings`), y ninguna tarjeta decía que Full y Grupo
      **traen el chatbot adentro** (`whatsappIncluded`), que es justo lo que evita cobrarle el
      add-on a quien ya lo paga en su plan.

      **Bomba con fecha, medida:** hoy no hay ninguna org en `crece`
      (`select plan, count(*) from organizations` → `professional` 4, `free` 1), así que el
      conteo todavía no miente. El día que se venda el escalón, esa cuenta no suma en **ninguna**
      tarjeta de la fila de stats —se pintan con las mismas claves— con el «Total clínicas» de
      al lado contándola.

      **Cura:** `lib/subscription/panel-de-planes.ts` deriva las tarjetas de `PLAN_IDS` +
      `PLAN_LIMITS`; lo que hay que **decidir** (texto comercial, estilo, si el precio es piso)
      va en `Record<PlanId, …>`, así **un plan nuevo no compila** hasta que alguien lo decida. El
      `<select>` sale de `PLANES_DEL_OPERADOR` con `nombreDePlan`. De paso, `plan === "enterprise"`
      no quedó como comparación suelta (la habría acusado `plan-catalogo-es-la-fuente.test.ts`):
      es un campo `precioEsPiso` tipado por plan.

      **Gate:** `lib/subscription/el-panel-de-planes-conoce-todos-los-planes.test.ts`, con dos
      mitades — que el módulo derive, y que la pantalla **no vuelva a tipear su propia lista**
      (universo caminado del **disco**, no `git ls-files`, y comentarios en blanco para que
      nombrar los ids explicando el bug no se acuse solo). Validado por **tres** mutaciones:
      una tabla a mano nueva en la pantalla (rojo nombrando archivo e ids), la tarjeta dejando
      de afirmar el export (`basic: exportacion de datos incluida y no dicha`) y un plan sin
      estilo (rojo **doble**: `tsc` TS2741 y el caso ancla).

      ⚠️ **Commiteado en la rama del carril, NO desplegado:** lo mergea `onia-cola`. **No se
      pudo mirar renderizada en producción**: `/admin/plans` con la sesión del superadmin
      termina en `/profile?mfa=obligatorio` — el bug de MFA de más abajo, ya arreglado en
      `master` y esperando el `ok` del pedido de deploy, **también deja afuera al operador**.
      En su lugar se verificaron las seis tarjetas derivadas, una por una, contra el catálogo.

- [x] 🔴 **~~El correo de «mitad de camino» del trial afirmaba días que no derivaba de nada~~ —
      CERRADO el 2026-09-13 (`onia-platform` `1ef035f`, en la rama del carril; los tres gates
      verdes acá Y re-corridos en el VPS sobre el árbol con `origin/master` mergeado: tsc 0 ·
      4927 tests · eslint 0).** El paso 7 del drip afirma **dos** cosas —la posición (*«vas por
      la mitad de tu prueba»*) y cuánto falta (*«quedan 7 días»*)— y las dos estaban **tipeadas**,
      ciertas sólo para el trial estándar de 14.

      **El largo NO es fijo:** `PATCH /api/admin/clinics` acepta `trialDays` libre y ya se usó
      para extender pruebas a mano. La cadencia ya se había recortado contra el largo real el
      11-sep (`cadencia-vs-largo-del-trial.test.ts`: los pasos 12 y 14 cuelgan del vencimiento
      *porque afirman cuánto FALTA*) — **el arreglo no viajó al paso 7, que afirma lo mismo**:
      con 30 días de prueba el dueño leía *«quedan 7 días»* con 23 por delante; con 10, *«quedan
      7»* teniendo 3, y 48 h después el paso 12 le decía *«te quedan 2 días»* — dos correos
      nuestros contradiciéndose, en el único canal que recupera al que se registró y no volvió.

      **De qué cuelga cada paso lo decide ahora lo que su TEXTO afirma:** el 3 son días
      transcurridos (del alta), el 7 es posición + cuánto falta (de la mitad del largo real), el
      12 y el 14 cuánto falta (del vencimiento). Con los 14 estándar el disparador da 7: **cero
      cambio en el caso vivo**. `diasQueFaltan` entra como campo **requerido** de
      `TrialDripEmailData` — y `tsc` cazó al llamador que lo olvidaba
      (`app/components/trial-vencido-cumple-la-promesa.test.ts`).

      **Gate:** `lib/subscription/el-aviso-de-mitad-no-inventa-lo-que-falta.test.ts`, con los
      días esperados como **literal** (no calculados con el mismo helper que el producto usa
      para escribirlos) y el universo del último caso caminado **desde el disco**, no con
      `git ls-files`. Validado por **tres** mutaciones: el texto de las dos ramas (3 rojos),
      sólo la rama con actividad (2 rojos) y el disparador clavado en 7 (1 rojo, el caso del
      disparador).

      ⚠️ **Commiteado y publicado en la rama del carril, NO desplegado:** lo merge `onia-cola` y
      el publicador automático swapea solo (no toca fuente de precio).

- [ ] 🔴 **Punto nuevo de Sergio Urcullo (12-sep): ¿Onia Platform personalizable POR CLIENTE
      para empresas grandes?** Textual: *"que se pueda hacer in-house su trabajo y no ellos
      moldearse al sistema sino el sistema a ellos — analizá"*. Análisis en curso con medición
      real: qué se moldea HOY (packs por rubro en
      `onia-platform/lib/platform/vertical-pack.ts`, vocabulario, entitlements por org, límites
      por plan), qué está hardcodeado (campos y estados fijos), cómo lo venden Odoo/Salesforce
      (config vs código vs partner) y la trampa de servicios que rompería el techo de horas.
      Entregable: veredicto en 3 niveles + oferta concreta a empresa grande anclada en Grupo
      (Bs 2.900 + impl. 3.500) e instancia privada. **ANÁLISIS TERMINADO el 12-sep** —
      veredicto completo en `hermes-content/docs/ONIA_PERSONALIZACION_POR_CLIENTE.md`:
      N1 (configuración self-service: campos custom + estados por org + overlay de pack,
      ~18-28 días UNA vez) es el único nivel compatible con el techo de horas; N2 solo como
      implementación acotada ya existente; N3 (fork por cliente) = NO con el número delante.
      Hallazgo bonus: `limits` Json de entitlements se escribe y nadie lo lee (perilla muerta,
      1-2 días revivirla). DECISIÓN DE SERGIO: construir N1 sí/no — y la regla de la casa
      recuerda que el problema es de CLIENTES, no de features: se justifica con un prospecto
      enterprise concreto delante.


- [ ] 🔴 **PORTADA reordenada por veredicto de Sergio Urcullo (11-sep, sobre capturas del
      preview y de producción) — HECHA en `main` (`a847d9aa`), FALTA su OK mirándola y el
      deploy.** Sus palabras: *"esto no vende nada… coloca algo que impacte que se vea más el
      sistema, y el tema de los chatbots es principal, que sea más protagonista, está al final
      eso, quita esas cajitas que son solo texto… el inicio me gustaba más así como estaba puro
      texto estilo hostinger… que sea lo principal llevarlos a probar el sistema"*. Qué entró:
      hero v4 DESCARTADO (vuelve el hero de producción que él aprobó), sección HECHOS retirada,
      chatbot a la posición 2 con conversación dibujada
      (`web-factory/apps/onia-platform/src/app/(sitio)/conversacion.tsx`) + CTA al alta.
      Pendiente de ESTE ítem: (a) **AUDITORÍA PRE-PUBLICACIÓN pedida por Sergio Urcullo antes
      del deploy** (11-sep, textual: *"verificamos los precios de los add-ons y las pestañas
      secundarias que no es el hero que estén bien hechas, también verificamos cibersecurity,
      fallos de estructura de la web, información mal colocada, docs viejos, política de
      privacidad"*) — dos subagentes barriendo seguridad y contenido de
      `web-factory/apps/onia-platform/src/`; los hallazgos se arreglan ANTES del deploy;
      (b) tras la auditoría limpia, su OK → deploy con `/opt/onia-landing/_deploy/publicar.sh`;
      (c) probar un video HyperFrames como pieza del bloque chatbot ("puedes generar videos con
      hyperframes también, intentá") — arrancamos con la conversación CSS porque pesa cero.
      El 11-sep también entró la dieta de la sección de add-ons (`e12b740f`: tarjetas con
      precio en píldora, ancla del salario en una línea, copys cortos en la fuente única).

- [ ] 🔴 **ESCALERA C IMPLEMENTADA el 2026-09-12 ("tenés permiso de los precios") — REGLA DE
      DESPLIEGUE: los DOS deploys salen JUNTOS o ninguno.** Producto en `master`
      (`4bff903d`): plan `crece` 550/145/5.500, Pro 890/229/8.900, Full 1.290/12.900 CON
      chatbot incluido (`whatsappIncluded` en `onia-platform/lib/plan-catalogo.ts`, ejecutado
      por `onia-platform/lib/plan-limits.ts` como cuarta fuente de `addonHabilitado` con la
      vigencia del PLAN), Crece en `CHECKOUT_PLANS`, tests re-anclados (suite 4.687 verdes;
      los 13 rojos son artefactos Windows idénticos en master limpio, medidos en worktree).
      Landing en `main` (`a9e11c47`): 4 tarjetas con topes visibles y "Cuatro escalones".
      ✅ **Ese desfase YA NO EXISTE — medido en producción el 2026-09-12 23:5x.** Acá decía
      *"hasta que el PRODUCTO se despliegue, el checkout vivo valida los montos viejos
      (750/1500)"*, y hoy los dos destinos corren la escalera C:
      `docker exec onia-platform grep -rhoE 'monthly:[0-9]+' /app/.next/server` → 320, 550, 890,
      1290 (+ add-ons 70/150/390/2900), **sin rastro de 750 ni 1500**; y `npm run precios:vivos`
      de `web-factory/apps/onia-platform` los ve pintados en las 24 pantallas de onia.com.bo.
      Se publicaron solos, como ya sabíamos que pasa. **Queda escrito porque un carril que lea
      la advertencia vieja frena un deploy por un peligro que no está, o le cuelga un
      `DESPUES-DE:` a un pedido que no lo necesita.**

      ✅ **CERRADO el 2026-09-13: la TERCERA superficie de `whatsappIncluded` le cobraba en
      pantalla al que ya lo tiene incluido** (`onia-platform` `5344eae`). El booleano nuevo lo
      calcula bien `fuentesDelAddonWhatsApp` como `incluidoPorPlan`, pero `addonHabilitado` lo
      **colapsa**: desde ahí abajo "lo trae mi plan" y "lo pagué aparte" son indistinguibles, y
      las pantallas le ponían precio a los dos. Medido en `/settings/addon-chatbot`: el dueño de
      un plan **Completo (Bs 1.290, que YA incluye el chatbot)** leía *"Add-on activo"* arriba y
      **"Abono mensual — Bs 390/mes"** en 2xl extrabold abajo — le decía que paga 1.680 cuando
      paga 1.290. Lo mantuvo invisible el add-on **hermano sano**: la reserva pública ya
      distingue `publicBookingIncluded` y rotula "Incluido"; media familia cubierta se lee como
      familia cubierta. Las otras dos superficies de esta clase ya estaban cerradas contra el
      mismo booleano —el bot (`promesa-inclusion.mjs`) y la landing (`inclusion-chatbot.mjs`)—
      y **el producto era la única que nadie había mirado, y la única donde el número lo lee el
      cliente que YA PAGA.** Entró: `lib/chatbot/como-lo-paga-el-dueno.ts` (módulo puro, tres
      modos), `isWhatsAppIncludedInPlan` en `lib/plan-limits.ts`, prop **obligatoria** para que
      `tsc` nombre al llamador que se olvide (nombró los 8 estados de la galería), y la tarjeta
      `4e` en `app/dev/addon-chatbot` con el estado que nadie había mirado — sin ella no se mira
      nunca, que es como llegó a producción. Gates: `tsc` limpio, `eslint` 0 errores, 4.879
      tests, **corridos también en el VPS** sobre el árbol publicado.
      ⚠️ **Intento fallido que vale anotar: el primer gate pasó EN VERDE con la mutación puesta.**
      Exigía que el archivo *nombrara* `comoLoPagaElDueno`, y con la condición cambiada a
      `{true ? (` el símbolo seguía importado para el rótulo. El sujeto es la **guarda del
      monto**, no la mención: el gate vigente ancla `muestraAbono ?|&&` y exige que esté **antes**
      del monto. **Falta el deploy** para que el cliente lo vea.

      ✅ **CERRADO el 2026-09-13: la CUARTA superficie — la comparativa de planes de `/settings`
      le ponía el precio del chatbot al plan que ya lo incluye** (`onia-platform`, rama
      `claude/chatbots-platform-review-0d1d09`). `PLAN_COMPARISON_ADDON_ROWS.whatsapp`
      (`lib/pricing.ts`) tenía las tres columnas tipeadas con `WHATSAPP_ADDON.shortLabel`, así
      que la fila *"Chatbot WhatsApp (add-on)"* de la tabla que renderiza
      `filasComparativaDe` (`app/(dashboard)/settings/PlanClient.tsx:321`) decía **"Bs 390/mes"
      también en la columna del Completo**, que lo trae adentro desde la escalera C. Miente en
      las dos direcciones del negocio: **le cobra de nuevo al que ya lo paga en su plan**, y al
      que evalúa subir **le esconde que subiendo deja de pagarlo** — un argumento de venta real,
      escondido en la pantalla donde se decide. Las filas hermanas (`booking`, `extraUser`) sí
      distinguían con "Incluida"/"Incluido": media familia correcta se lee como familia correcta,
      igual que en la tercera superficie.
      🔴 **Y al medirlo apareció una hermana peor, que no tiene nada que ver con la escalera:**
      la fila **"Exportación CSV"** decía *"No incluido"* en **Básico y Profesional** mientras
      `csvExportEnabled` es `true` desde Básico **a propósito** — el comentario del catálogo lo
      dice con todas las letras (*"tus datos son tuyos: el export de SUS datos no puede ser rehén
      del plan"*, auditoría de promesas 2026-08-06). O sea que el producto **le negaba en
      pantalla un derecho que ya tiene** y le insinuaba pagar más caro para conseguirlo.
      Entró: `lib/plan-comparativa/comparativa-vs-catalogo.ts` (módulo puro, sin prisma: lo
      importa una pantalla `"use client"`) con `celdaSegunElPlan` y `celdaContradiceAlCatalogo`,
      las seis filas booleanas derivadas de `PLAN_LIMITS` en vez de tipeadas, y el mapa
      `CAMPO_EN_LA_COMPARATIVA` **en el producto**: un booleano nuevo del catálogo no compila
      hasta que alguien decida si la comparativa tiene que nombrarlo — que es exactamente la
      decisión que nadie tomó cuando entró `whatsappIncluded`.
      **El sujeto del gate no es una fila: son los campos booleanos de `PLAN_LIMITS` derivados
      del dato vivo** (`lib/plan-comparativa/la-comparativa-no-contradice-al-catalogo.test.ts`).
      Anti-tautología: ahora que las celdas se derivan del catálogo, cruzar tabla contra catálogo
      leería el mismo espejo, así que el gate **además afirma contra el literal** que el dueño
      lee ("Incluido" en la columna del Completo, "390" en las otras dos, "Incluido" en las tres
      de CSV). Validado **por mutación**: con las dos celdas devueltas a mano, 3 tests en rojo
      nombrando las tres celdas. Gates: `tsc --noEmit` limpio, `eslint` 0, suite completa verde.
      **Falta mergear y desplegar** para que el cliente lo vea.

      ✅ **CERRADO el 2026-09-17: el recorte que protege a este cliente estaba CLAVADO en «no»,
      y su gate no podía verlo porque tenía una copia propia de la expresión** (`onia-platform`,
      rama `claude/chatbots-platform-review-0d1d09`). `hayNivelConMasCupo()`
      (`lib/chatbot/cupo.ts`) es de donde cuelgan el párrafo del cupo y el botón **«Ver niveles»**
      de `/settings/chatbot`, y estaba escrita
      `new Set(Object.keys(PLAN_LIMITS).map(() => cuotaDe(true, 0)))`: **la flecha descarta el
      plan**, así que el `Set` tiene siempre un elemento y la función devuelve `false` pase lo que
      pase en el catálogo. El comentario de al lado promete lo contrario con todas las letras
      —*"el día que un plan traiga su propio cupo, esto devuelve true y los textos vuelven a
      ofrecer subir solos"*— y ese día **no llegaba nunca**: el recorte quedaba pegado y el
      producto le escondería al dueño la salida **más barata** que su propio catálogo ya tendría,
      mandándolo a la recarga (Bs 190) en vez de al plan que le sirve. Es la dirección simétrica
      de las cuatro superficies de arriba: aquéllas **cobraban de más**, ésta **ofrece de menos**.
      🔴 **Por qué sobrevivió, que es lo transferible:** el gate
      (`cupo-no-ofrece-un-nivel-que-no-existe.test.ts`) derivaba su veredicto con **su propia
      copia** de la expresión —`new Set(PLANES.map(cupoDeUnPlanConChatbot)).size > 1`, que **sí**
      mapea el plan— y **nunca llamaba a la función del producto**. La copia estaba bien y el
      producto mal; las dos daban `false` y coincidían, porque `false` es la respuesta correcta
      **hoy**. Una tautología no se ve rota mientras la realidad le dé la razón.
      Entró: el `map` toma el plan de verdad, `cuotaDe` recibe `plan` (hoy ignorado a propósito:
      el cupo lo trae el add-on, pero sin ese dato la pregunta *"¿algún plan da más?"* no tiene
      con qué contestarse), y `hayNivelConMasCupo` acepta la fuente de cupo **inyectable** para
      que el caso `true` —hoy inalcanzable con el catálogo real— sea exigible. El gate ahora le
      pregunta **al producto** en las tres ramas de texto. Validado **por mutación**: devuelto el
      `map(() => …)`, 1 de 10 en rojo nombrando el caso. Gates: `tsc --noEmit` limpio, `eslint`
      0 errores, **664 tests** de `lib/chatbot` + `lib/subscription` + `lib/plan-comparativa`
      verdes. **Falta mergear y desplegar** para que el cliente lo vea.

      ✅ **CERRADO el 2026-09-13: el panel de «Mi plan» no conocía el plan Crece, y por eso le
      ofrecía al que paga Bs 550 el plan de Bs 320 como MEJORA** (`onia-platform`, rama
      `claude/chatbots-platform-review-0d1d09`). Salió de ir a cerrar el hueco de la comparativa
      y encontrar, dos pantallas más arriba, **dos listas tipeadas a mano que la escalera C
      nunca tocó**:
      1. `PLAN_ORDER = ["free","basic","professional","clinic","enterprise"]` con el rank por
         `indexOf` ⇒ **`planRank("crece") === -1`**. Con `-1`, `isUpgrade = planRank(plan) >
         currentRank` daba **true para TODAS las tarjetas**, así que el dueño de un Crece leía el
         botón primario lleno **«Pagar Plan Básico»** sobre el plan de Bs 320 — una bajada vendida
         como mejora, en la pantalla donde se decide pagar — y **ninguna tarjeta** decía
         «✓ Plan actual», porque `isCurrent = currentPlan === plan.key` tampoco tenía con qué
         coincidir. El `-1` no falla: miente en silencio.
      2. `planesDe` devolvía cuatro tarjetas y **Crece no era ninguna**, o sea que a los rubros
         clínicos (dental, estética, servicios profesionales — la rama `esDental`) el panel les
         escondía el escalón de Bs 550 y les dejaba el salto de Bs 570 hasta Profesional, que es
         **exactamente el 2,3x que la escalera C existe para borrar** (lo dice el comentario de
         `DEFAULT_PLAN_AMOUNTS`). `/checkout` sí lo vendía desde el día uno, y `PlanesNeutros`
         (comercio/importadora) también, porque **deriva su lista de `CHECKOUT_PLANS`**: media
         familia derivada se lee como familia derivada.
      🔴 **Y en las tarjetas estaba viva la MISMA mentira que se acababa de cerrar en la tabla de
      abajo:** el Básico listaba *«Exportación CSV»* con `included: false` mientras
      `csvExportEnabled` es `true` desde Básico a propósito. Las tarjetas son la **tercera**
      representación de los mismos booleanos, en el mismo archivo, a dos centímetros de la tabla.
      Entró: `lib/subscription/escalon-de-plan.ts` (módulo puro) — **el escalón de un plan es lo
      que CUESTA**, derivado de `DEFAULT_PLAN_AMOUNTS`, así que no hay lista que actualizar y el
      plan que venga entra solo; `esSubida()` devuelve **false ante un plan desconocido** (la otra
      mitad del `-1`: la columna `plan` es String y puede traer un id legado — ante la duda no se
      llama «subida» a nada, en vez de llamarle subida a todo); la tarjeta de Crece con cada
      bullet correspondido contra `PLAN_LIMITS.crece` (agentes y agenda pública SÍ, reportes y
      recurrentes NO — ésos son el motivo de subir a Profesional); y el `upgradeReason` del Básico
      apuntando a Crece y no a Profesional.
      **El sujeto del gate no es «crece»: son los planes que el checkout VENDE** (`CHECKOUT_PLANS`,
      la fuente de otro circuito), cruzados contra las tarjetas que esta pantalla pinta
      (`app/(dashboard)/settings/el-panel-conoce-los-planes-que-vende.test.ts`). **Validado por
      mutación, tres veces:** escalón ciego a `crece` → 4 rojos; tarjeta de Crece fuera → 2 rojos;
      CSV de vuelta en `included: false` → 1 rojo; árbol restaurado → 7 verdes. Gates:
      `tsc --noEmit` limpio, `vitest` 4.895/4.895 (0 rojos), `eslint` 0 errores. Commit
      `419b819` (publicado; los gates se re-corrieron en el VPS sobre ese árbol: `vitest` 4.895/4.895, `eslint` 0 errores, `tsc` limpio).
      ⚠️ **Intento fallido que vale anotar: el primer arreglo agregaba DOS listas a mano más**, y
      lo atajaron gates que ya existían, no yo — `lib/plan-catalogo-es-la-fuente.test.ts` cazó el
      `currentPlan === "crece"` que le sumé a la cascada de color del chip (sacado: el chip neutro
      ya dice «Crece» porque el rótulo sale de `nombreDePlan`), y
      `lib/platform/nombre-de-plan-a-mano.test.ts` cazó `"Subí a Crece…"` tipeado en vez de
      `PLAN_LABELS.crece`. La línea `plan === "free"` de `escalonDe` sí quedó, **declarada en
      `EXENTAS` con su motivo**: pone al trial en el piso de la escalera y no decide ninguna
      capacidad. La escalera C entró por la puerta que estos gates cubren; el orden de los planes
      no lo cubría nadie.
      ⚠️ **No se abrió renderizada**: el cambio está en la rama, así que producción todavía sirve
      la pantalla vieja y mirarla ahí no probaría nada. Se mira **después del deploy**, y hasta
      entonces esto no está terminado.
      ✅ **CERRADO el 2026-09-13: ese hueco escondía algo peor que una columna faltante — cada
      botón «Contratar» de la comparativa pedía el plan de la columna ANTERIOR** (`onia-platform`
      `a9b2d27`, rama `claude/chatbots-platform-review-0d1d09`). La tabla se pinta en **tres**
      franjas que tienen que coincidir columna por columna, y sólo una era derivada: el `thead`
      (rótulos) y cada fila del `tbody` estaban tipeados con cuatro columnas, mientras el `tfoot`
      mapea `planesDe`. Al sumarle `crece` a las tarjetas (`419b819`, el arreglo de acá arriba, ya
      en `master`) el pie pasó a pintar **cinco** botones bajo **cuatro** columnas:

      ```
      header:  Característica | Básico | Profesional | Completo    | Grupo
      pie:     Contratar...   | Básico | Crece       | Profesional | Completo | Grupo
      ```

      O sea que el dueño que apretaba «Contratar» bajo el rótulo **Profesional (Bs 890)** mandaba
      un WhatsApp pidiendo el **Crece (Bs 550)**, y el de «Completo» pedía el Profesional —
      en la pantalla donde se decide pagar, y con una celda de más en la tabla. **No llegó a
      producción por poco:** `419b819` está en `origin/master` pero NO en el build vivo
      (`BUILD_ID OFd4xCDzoTbQdThUbfzDv` = `/opt/onia-platform/build-f078373`, y
      `git merge-base --is-ancestor 419b819 f078373` da falso), así que el defecto habría salido
      con el próximo swap.
      **Y la mitad que el hueco sí nombraba:** el plan de Bs 550 era invisible para el que lo
      paga — ninguna celda lo nombraba, ninguna columna se le resaltaba, y el Básico seguía
      mostrando el salto de Bs 570 hasta Profesional, justo el 2,3x que la escalera C existe
      para borrar.
      Entró: `celdaDeFila` con un `Record<PlanKey, …>` (un plan nuevo **no compila** hasta que
      alguien diga qué celda le toca) y las tres franjas pintadas desde `PLANS`, así que no
      pueden volver a desalinearse; columna `crece` **obligatoria** en `FilaComparativa` y en las
      19 filas, con los topes (clientes/usuarios/emails) **derivados de `PLAN_LIMITS`** en vez de
      tipeados al lado del catálogo —que es como la fila de CSV llegó a mentir—; `crece` en las
      seis filas de `PLAN_COMPARISON_ADDON_ROWS`; y `PlanDef.acento`, porque el resalte de columna
      es una propiedad DEL PLAN y no un `plan.key === "…"` en el JSX (comparar claves a mano es
      exactamente como una lista se separa del catálogo: lo prohíbe
      `lib/plan-catalogo-es-la-fuente.test.ts`, que **cazó las cinco** que había escrito). Con eso
      se borraron además las 5 exenciones cosméticas que quedaron sin sujeto.
      **`COLUMNAS_DE_LA_COMPARATIVA` suma `crece` y también `enterprise`:** una columna que se
      pinta y no está declarada ahí entra **pre-aprobada** al gate de honestidad. La de Grupo no
      tiene celda propia en casi ninguna fila —cae al valor del Completo— y ahora el gate mide esa
      caída (`?? celdaDeFila`): hoy es honesta porque sus booleanos coinciden, y el día que se
      separen deja de serlo **ruidosamente**.

      ✅ **CERRADO el 2026-09-13: la QUINTA superficie — la tarjeta de «Add-ons disponibles» de
      esa misma pantalla le listaba Bs 390 al plan que ya trae el chatbot** (`onia-platform`
      `2aa82b4`, publicado; los tres gates re-corridos EN EL VPS sobre el árbol con
      `origin/master` mergeado: `tsc` 0 · 4.931 tests · `eslint` 0 errores). El dueño de un
      **Completo (Bs 1.290)** abría `/settings`, bajaba dos secciones y leía la píldora
      **«Activo»**, la lista **«Bs 390/mes o Bs 3.900/año»** y el pie **«Add-on activo»** — los
      tres, sobre el chatbot que su plan trae adentro: le decía que paga **1.680** cuando paga
      1.290. La tarjeta recibía sólo `isWhatsAppAddonActive`, que colapsa «lo incluye mi plan»
      con «lo compré aparte».

      **Por qué sobrevivió a las cuatro vueltas anteriores, incluidas las DOS de hoy sobre este
      mismo archivo:** el add-on **hermano de la misma grilla** ya lo hace bien — la agenda
      pública rotula «Incluido» y dice «Incluida en este plan» **40 líneas más abajo**, con el
      dato (`getLimits(currentPlan).publicBookingIncluded`) resuelto **una línea** al lado del
      que faltaba. Media familia correcta se lee como familia correcta: es la misma firma que
      escondió la tercera superficie, repetida dentro del mismo archivo.

      🔴 **Y lo segundo, que es peor: el gate de la clase no podía verla.**
      `lib/chatbot/como-lo-paga-el-dueno.test.ts` (escrito esta misma mañana) **derivaba sus
      sujetos caminando el disco** — y después los filtraba con un predicado escrito a mano que
      preguntaba por `monthly`. Esta pantalla pinta **el mismo monto** como `tier.shortLabel`
      («Bs 390/mes o Bs 3.900/año»), así que quedaba **fuera del universo** y el gate firmaba
      verde sobre la pantalla rota. *Derivar los sujetos del disco no alcanza si después se los
      filtra con un predicado a mano: un monto tiene varias representaciones y el predicado se
      ata a una.*
      Entró: los campos con plata **salen del dato** (`Object.entries` del nivel del chatbot:
      un número, o un texto con «Bs» — si mañana gana `weeklyLabel`, entra solo); la atribución
      del monto al chatbot es por el **identificador gritado anterior** y no por «el primero del
      archivo», porque `EXTRA_USER_ADDON_PRICE.shortLabel` vive **600 líneas antes** en el mismo
      archivo y acusaría a la tarjeta equivocada; y un **caso ancla** exige que `PlanClient.tsx`
      esté en el universo, que es la pieza que impide volver al predicado angosto.
      `chatbotIncluidoEnElPlan` entra como prop **obligatoria** y `tsc` nombró a los **7**
      llamadores. **Tarjeta 10** en `app/dev/addon-chatbot` con el estado que nadie había
      mirado — sin ella no se mira nunca, que es exactamente cómo llegó a producción.
      **Validado por mutación, dos veces:** guarda fuera → 1 rojo nombrando la pantalla;
      predicado angosto de vuelta → 2 rojos (los campos y el ancla).
      ⚠️ **Falta mergear y desplegar** para que el cliente lo vea.
      **El sujeto del gate no es «crece»: son los planes que la pantalla VENDE** (`planesDe`) —
      `app/(dashboard)/settings/la-comparativa-se-pinta-desde-los-planes-que-vende.test.ts`.
      **Validado por mutación en las dos direcciones:** sacar `crece` de las columnas declaradas →
      1 rojo nombrándola; hacer que la columna Crece pinte la celda del Profesional → rojo
      *«debería mostrar 550 y muestra "Bs 890"»*. Árbol restaurado con `cp` → verde.
      Gates: `tsc --noEmit` limpio, `vitest` **4.898/4.898**, `eslint` 0 errores — **corridos
      también en el VPS** sobre el árbol publicado.
      ⚠️ **No se abrió renderizada**, y decirlo importa: el cambio está en la rama y producción
      sirve el build viejo, así que mirar ahí no probaría nada. Se mira **después del deploy**.
      📌 **Lo que del hueco sigue abierto:** `agentsIncluded` no tiene fila, aunque el salto a
      agentes es lo que se vende desde Crece. Queda declarado con su motivo en
      `CAMPO_EN_LA_COMPARATIVA`.

      ✅ **CERRADO el 2026-09-13: la QUINTA superficie era el GATE, y no estaba ciego al plan
      nuevo — lo ratificaba** (`onia-platform` `d0be692`, rama
      `claude/chatbots-platform-review-0d1d09`). La ayuda del producto (`/help`,
      `lib/ayuda/faq.ts`) ya tenía un gate cruzándola contra `PLAN_LIMITS`
      (`lib/ayuda/capacidad-en-el-plan-correcto.test.ts`, escrito para que la ayuda no mande a
      subir de plan por algo que el plan más barato ya trae). Ese gate tenía **su propio orden de
      planes tipeado a mano** —`["free","basic","professional","clinic","enterprise"]`, el mismo
      `PLAN_ORDER` que se cerró dos ítems más arriba— y se quedó sin `crece` con la escalera C.
      **No falló abierto en silencio, que es lo que uno espera de una lista a mano:** al saltar de
      `basic` a `professional`, `primerPlanCon("publicBookingIncluded")` contestaba
      `professional`, así que el gate **firmaba como correcta** la frase de la ayuda —*"Profesional
      (Bs 890/mes): suma agenda pública incluida"*— que le dice al dueño de un **Crece (Bs 550)**
      que pague Bs 340 más por la agenda pública que su plan **ya incluye**
      (`crece.publicBookingIncluded: true`). El instrumento defendía el cobro que existe para
      impedir; por eso las cuatro superficies anteriores se encontraron a mano y ésta no.
      **Y la enumeración se saltaba a Crece entero:** al que venía del Básico le escondía el
      escalón de Bs 550 y le dejaba a la vista el salto de 2,3x hasta Profesional. Miente en las
      dos direcciones del negocio, en la pantalla que el dueño abre **justo cuando duda**.
      Entró: `planesPorEscalon()` y `primerPlanCon()` en `lib/subscription/escalon-de-plan.ts`
      (el mismo módulo donde ya vivía *"el escalón de un plan es lo que CUESTA"*) — universo de
      `PLAN_LIMITS`, orden del precio, **ninguna lista que actualizar**; la respuesta la afirma el
      **producto** y no el test, así que gate y pantalla le piden el mismo dato a la misma
      función; `BooleanaDePlan`, porque el mapa de capacidades decía en un comentario *"cada clave
      es un campo booleano REAL"* y el tipo **no lo exigía** (`tsc` lo exige ahora, y cazó tres
      usos); Crece nombrado con lo que es el **primero** en traer (agenda pública y agentes), y el
      chatbot de WhatsApp declarado en Completo — **quinta superficie de `whatsappIncluded`**, con
      su patrón sumado al mapa vigilado.
      **La mitad que no miraba nadie:** el gate sólo juzgaba los planes que el texto **sí**
      nombraba, que es exactamente cómo Crece desapareció sin ponerse rojo. El caso nuevo exige
      que ningún plan que el checkout **vende** falte en la enumeración, con el sujeto derivado de
      `CHECKOUT_PLANS` — la fuente de **otro** circuito, no una lista de acá.
      **Validado por mutación, tres veces:** Crece fuera de la enumeración → **8 rojos** (uno por
      rubro, nombrando «Bs 550/mes, que el checkout vende»); agenda pública devuelta a Profesional
      → **8 rojos**; orden a mano sin `crece` → rojo. Árbol restaurado con `cp` → verde.
      Gates: `tsc --noEmit` limpio, `vitest` **4.906/4.906**, `eslint` 0 errores — **corridos
      también en el VPS** sobre el árbol publicado (`d0be692`).
      📌 **Anotado, no abierto:** la enumeración dice *"agenda pública"* también en los rubros sin
      agenda (comercio, importadora — `tieneAgenda()` falso). **No es regresión de este arreglo**
      —el texto viejo lo decía igual, en Profesional— pero es un rubro×capacidad legítimo para la
      próxima vuelta, y el gate de hoy no lo mira.

      Falta de la fase 2: **avisos al 70/90/100 % del cupo** y la **recarga de recordatorios**
      (la de conversaciones ya existe). ⚠️ Lo del 70/90/100 **no lo puede cerrar este carril
      solo, y el motivo es concreto**: hoy hay UN umbral (`UMBRAL_AVISO = 0.8` en
      `onia-platform/lib/chatbot/cupo.ts`) con su marcador `avisado80At`, y el reclamo atómico
      que evita el aviso duplicado es `where: { ..., avisado80At: null }`. Tres umbrales piden
      tres marcadores ⇒ **migración Prisma** — y las migraciones no viajan con el deploy (el
      publicador no las aplica, y ningún gate las ve). Empujar el código sin aplicarla deja al
      chatbot leyendo una columna inexistente. O se hace junto con quien pueda aplicarla en
      `supabase-db`, o no se empieza.

      ⚠️ **La cuenta "recargar vs subir" NO SE PUEDE ESCRIBIR TODAVÍA, y al medirlo apareció un
      defecto vivo que ya se arregló** (2026-09-12, `310bae6` en `onia-platform`, rama
      `claude/chatbots-platform-review-0d1d09` — pusheado, falta mergear y desplegar).
      **"Subir" no es una opción del cupo del chatbot: no existe un nivel con más cupo.**
      Medido: `cuotaDe` (`lib/chatbot/cupo.ts`) devuelve `WHATSAPP_ADDON.includedConversations`
      = **500** sin mirar el plan, `PlanLimits` (`lib/plan-catalogo.ts`) no declara un solo
      campo de conversaciones, y `whatsappIncluded` de la escalera C decide si el chatbot viene
      pagado **adentro** del plan — no cuántas conversaciones trae. Los **seis** planes dan 500.

      **Lo que el producto le decía al cliente**, en los tres textos del cupo y en un botón
      "Ver niveles": *"o pasar a un nivel con más cupo"*. Sale en el peor momento —cupo agotado,
      el asistente ya derivando a una persona— y manda a gastar: un cliente en Básico (Bs 320)
      que obedece y sube a Full (Bs 1.290) paga **Bs 970 más por mes por exactamente el mismo
      cupo**. La salida real es la recarga, que el mismo texto ya ofrecía al lado.

      **Arreglado condicionando la promesa, no borrándola** (`hayNivelConMasCupo()`): el día que
      un plan traiga su propio cupo, los textos y el botón vuelven solos. El botón fue en la
      misma vuelta a propósito — arreglar el párrafo y dejar el CTA deja la misma salida
      inexistente invitando. Gate `lib/chatbot/cupo-no-ofrece-un-nivel-que-no-existe.test.ts`:
      cruza el **catálogo** (la capacidad) contra el **texto emitido** (la promesa), dos fuentes
      distintas; deriva los planes del disco y las ramas ejercitando el módulo; validado por
      mutación en el aviso del corte. Gates en el VPS: `tsc` limpio, **4.737 tests verdes**.
      De paso, `cupo.test.ts` exigía la palabra "nivel" y con eso **defendía la promesa falsa**:
      re-anclado a la salida que sí existe, con el motivo escrito al lado.

      **Lo que esto deja decidido para la fase 2:** la cuenta en pantalla sólo puede comparar
      **recarga vs recarga** (Bs 190 / 200 conversaciones, caducan con el mes), no "recargar vs
      subir". Para que "subir" sea verdad hace falta que la escalera C le dé cupo de
      conversaciones DISTINTO a cada plan — y eso es ratificar montos, que la propia letra chica
      de arriba marca como pendiente de Sergio Urcullo.

      Historia: **ESCALERA C ELEGIDA por Sergio Urcullo (11-sep): 4 escalones con cupos estilo
      Higgsfield.** Su decisión,
      textual: *"la C pero que tenga restricciones y que tengan que estar pagando si quieren
      mejorar su plan, mira higgsfield te cobra por todo y si no usás tus créditos dentro del
      mes igual se te quitan; necesitamos ser la mejor opción por ser la más simple pero que
      igual paguen siempre pero que no sea exagerado"*. Investigación previa medida EN VIVO:
      ManyChat 2026 (5 escalones chicos, overage que factura en vez de bloquear, aviso al
      70/90/100 %), Alegra Perú (4 planes pegados, "Más popular" en el 3º), Dapta, Lety.

      **Letra chica PROPUESTA (ratificar montos de cupos antes de tocar la fuente única):**
      | Plan | Bs/mes | Cupos mensuales (NO acumulan) | Qué lo hace querer subir |
      |---|---|---|---|
      | Básico | 320 | 2 usuarios · 300 fichas · 200 recordatorios | sin agentes, sin reservas |
      | Crece (NUEVO) | 550 | 3 usuarios · 800 fichas · 400 recordatorios | agentes Recall+Cobrador, reservas incluidas; sin reportes/contabilidad completa |
      | Pro (destacado) | 890 | 5 usuarios · 1.500 fichas · 800 recordatorios | todo lo operativo: reportes, contabilidad completa, facturas recurrentes, todos los agentes |
      | Full | 1.290 | sin límites | **chatbot de WhatsApp INCLUIDO** + te lo entregamos configurado |
      Semanal: 89 / 145 / 229 / — · Anual: 10× (2 meses gratis) · Grupo 2.900 queda cotizado.
      Mecánica Higgsfield: el cupo del mes muere con el mes; recargas pagas (conversaciones del
      bot ya existe a Bs 190; sumar recarga de recordatorios); aviso al 70/90/100 % del cupo con
      la cuenta en pantalla ("dos recargas > subir de plan"). Implementación toca:
      `onia-platform/lib/subscription-plans.ts` (nuevo id de plan + montos),
      `onia-platform/lib/pricing.ts`, espejo de la landing
      `web-factory/apps/onia-platform/src/lib/pricing.ts`, `/precios`, checkout y validación de
      pago, y las tarjetas de plan con las LIMITACIONES visibles (pedido explícito: *"que se
      noten las limitaciones para que quieran subir el plan y ordená las funciones dependiendo
      del plan"*).

      ✅ **CERRADO el 2026-09-13: el PANEL DEL OPERADOR no conocía el plan Crece — y le cobraba
      de nuevo la reserva pública al plan que ya la trae** (`onia-platform` `07c97f6`, rama
      `claude/chatbots-platform-review-0d1d09`). Método nuevo, y por eso apareció: en vez de
      buscar la siguiente pantalla a mano —como en las cuatro superficies anteriores de
      `whatsappIncluded`—, se **derivó del disco la clase entera**: toda lista de planes tipeada
      a mano. Cuatro sujetos, los cuatro rotos por la misma causa (la escalera C sumó `crece` a
      `PLAN_LIMITS` el 12-sep y ninguna lista se enteró):
      1. `app/api/admin/clinics/route.ts:144` — `validPlans` sin `crece` ⇒ el `PATCH` contestaba
         **400 «Plan inválido»** al plan que se vende a Bs 550: **el operador no se lo podía
         asignar a ningún cliente que lo pagara**.
      2. `app/(dashboard)/admin/page.tsx:347` y `:469` — los dos `<select>` ni ofrecían la opción.
      3. `app/(dashboard)/admin/page.tsx:40` — `PAID_PUBLIC_BOOKING_PLANS` omitía `crece`, que
         tiene **`publicBookingIncluded: true`** en el catálogo: el panel mostraba **«BK OFF»** y
         dejaba **ACTIVAR (cobrar) un add-on que ese plan ya incluye adentro**. Es la misma clase
         de las cuatro superficies de `whatsappIncluded` —cobrarle al que ya lo paga—, ahora en
         `publicBookingIncluded` y del lado del que opera la cuenta.
      4. `lib/asientos.ts:122` — `tablaDeAsientos()` salteaba la **fila entera** del Crece: el
         dueño buscaba a partir de qué persona empieza a pagar y su plan no estaba.

      Entró: `PLAN_IDS` derivado de `PLAN_LIMITS` (`lib/plan-catalogo.ts`) y
      `lib/subscription/planes-del-operador.ts` (módulo puro — lo importa una pantalla
      `"use client"`, así que no arrastra prisma al navegador) con `PLANES_DEL_OPERADOR`,
      `esPlanDelOperador` y `traeReservaPublicaIncluida`, que **filtra por el predicado del
      catálogo** en vez de enumerar. **El sujeto del gate no es la fila de `crece`**: son los ids
      del catálogo vivo más el **disco** para lo que no se puede importar
      (`lib/subscription/el-operador-conoce-todos-los-planes.test.ts`), con caso ancla que se cae
      si `crece` desaparece del catálogo —para que el gate no se apague en silencio— y un caso
      que exige que el detector no acuse a la lista derivada ni a un comentario que nombre la
      vieja. **Validado en rojo antes del arreglo**: 2 tests, nombrando la tabla de asientos y los
      3 literales del panel. Gates: `tsc --noEmit` limpio, `eslint` 0, 439 tests del área —
      **corridos también en el VPS** sobre el árbol con `origin/master` mergeado (436 verdes).
      **Falta mergear y desplegar** para que el operador lo vea.

      ✅ **CERRADO el 2026-09-17: la QUINTA lista tipeada a mano de esta clase estaba en el
      catálogo mismo, y era la única que no falla con un error** (`onia-platform` `ccc845c`,
      rama `claude/chatbots-platform-review-0d1d09`). `getPlanId` decidía con
      `plan === "basic" || "crece" || "professional" || "clinic" || "enterprise"`, **una línea
      debajo de `PLAN_IDS`**, que sí se deriva de `PLAN_LIMITS`. De esa función cuelga
      `getLimits`, o sea la puerta pública de reservas (`lib/agenda/reserva-publica.ts`), la
      comparativa de `/settings`, el texto de `/help` y los topes que el producto aplica.
      **Lo caro es que el modo de falla es silencioso:** un id que la lista no nombra no tira
      ni avisa — cae a `free`, así que el cliente que paga se queda con los topes del plan
      gratis y ninguna pantalla se pone roja. Las cuatro hermanas de esta clase rompían fuerte
      (400 "Plan inválido", un `<select>` sin la opción, "BK OFF"); ésta no rompe nada.
      **Hoy no había ningún plan caído y se arregló igual, porque es la PLANTILLA**: medido en
      producción, `select plan, count(*) from organizations` da `free 1` y `professional 3`, y
      las dos listas coincidían. Se cura la forma antes de que muerda, no la instancia.
      ⚠️ **El motivo de su exención era CIERTO y aun así tapaba el agujero.**
      `plan-catalogo-es-la-fuente.test.ts` la eximía con *"es el propio catálogo normalizando
      el id (getPlanId): la fuente"* — verdad, y no la eximía de **derivarse** de esa fuente.
      Al curar, ese gate se puso rojo solo por exención huérfana: está bien construido (re-mide
      sus excusas en cada corrida) y fue el único aviso de que la excusa había perdido sujeto.
      Entró `PLAN_IDS.includes(plan)` — **no `plan in PLAN_LIMITS`**, porque con `in` las
      claves del prototipo (`constructor`, `toString`) darían verdadero y se colarían como ids;
      hay un caso que lo ancla. Gate:
      `lib/subscription/el-catalogo-se-reconoce-a-si-mismo.test.ts`, con **dos mitades y las
      dos hacen falta** — la de comportamiento (round-trip de `PLAN_IDS`) prueba que hoy no hay
      ningún plan caído, y la **estructural** prohíbe la FORMA que envejece (decidir con
      literales), porque la primera sola vuelve a verde el día que alguien agregue el plan a
      las dos listas y el agujero reaparece con el siguiente. **Validado por mutación**
      (lista a mano sin `crece`): 3 casos en rojo. Gates: `tsc` 0, `eslint` 0 errores,
      **5.017 tests verdes**, corridos también **en el VPS** sobre el árbol con `origin/master`
      mergeado. **Falta mergear y desplegar** para que llegue al cliente.

- [x] 🔴 **~~Funciones que las empresas usan DE VERDAD — recorte de superficie~~ — MEDIDO el
      2026-09-13, y la medición REFUTA la premisa del ítem: no se puede recortar por uso,
      porque NO HAY USO.** (Sergio Urcullo, 11-sep: *"mirar qué funciones vamos a usar
      realmente para las empresas"*.)

      **Cómo se midió, sin lista a mano.** El universo se derivó de la propia base
      (`information_schema.columns where column_name='organizationId'` → **73 tablas**) y se
      contaron filas por org con un `UNION ALL` generado, contra `supabase-db` de producción.
      Una lista de módulos escrita a dedo habría dejado fuera justo el módulo nuevo.

      **Las orgs son 4, no 3** (el ítem decía 3): `clinica-sergio-p2ljs` (dental),
      `bolivian-electricidad-e6t21` (importadora, **onboarding sin terminar**),
      `onia-interna` y `zz-qa-bandeja-10` (banco de QA, se excluye del conteo).

      **El resultado: 59 de las 73 tablas están en CERO en las tres orgs reales.** Las 14 con
      filas son casi todas de configuración o del sistema — `audit_logs` (60), `profiles` (3),
      `clinic_settings` (3), `organization_entitlements` (4), `onia_agents_agents` (7, los crea
      el alta), `onia_agents_runs` (26, las escribe el cron), `onia_trial_drip_sends` (4, el
      cron), `chatbot_knowledge`, `chatbot_uso_mensual`, `notifications`,
      `onia_core_role_assignments`, una tabla de backup. **Dato de negocio cargado por una
      persona hay exactamente dos cosas: 1 ficha de paciente y 6 horarios de doctor.**

      **En CERO histórico, en las tres orgs:** citas (`appointments`), tratamientos aplicados,
      recetas, odontograma, facturas (`onia_invoicing_*`), pagos, facturas recurrentes,
      inventario y almacenes (`onia_commerce_*`), gastos/comisiones/colaboradores
      (`onia_empresa_*`), documentos, despachos, aprobaciones y agenda del core
      (`onia_core_*`), planillas, alertas médicas, `whatsapp_sessions`, `push_subscriptions`,
      `subscription_payments`.

      **Por qué esto CAMBIA el próximo paso, en vez de darle datos.** El ítem asumía que el
      uso podía decir qué módulo sobra. No puede: con cero clientes pagando, un módulo sin
      filas no está de más — está **sin estrenar**. Recortar por este dato apagaría el producto
      entero. El criterio ya decidido en `ONIA_ESTRATEGIA_DE_EMPRESA.md` §9 sigue siendo el
      único aplicable: **lo que se recorta es lo que sube las horas de soporte por cliente**,
      no lo que nadie tocó. La misma medición vuelve a tener sentido recién con clientes
      reales adentro; hasta entonces, repetirla es gastar una vuelta.

      **De paso, dos hechos que sirven a otros carriles** (los dos medidos, no supuestos):
      · `subscription_payments` en cero confirma que **jamás entró un cobro** por el producto;
      · `zz-qa-bandeja-10` conserva su dato de banco (1 cita, 3 tratamientos, 10 horarios) y
      `npm run qa:sin-rastro` da **REALES: 0** — el E2E de agentes del 13-sep no dejó residuo
      dentro de la cuenta de Sergio Urcullo.
      Reproducir: derivar las tablas de `information_schema`, contar por `organizationId` y
      cruzar contra `organizations`; los conteos de arriba son de `supabase-db` el 2026-09-13.

      ✅ **CERRADO el 2026-09-13: la SÉPTIMA superficie era la única que COBRA — al que tiene el
      chatbot incluido en su plan se le reclamaba el add-on, por tres canales y con un formulario
      de pago** (`onia-platform` `a38cabc`, rama `claude/chatbots-platform-review-0d1d09`).
      Las seis anteriores mostraban un número de más; ésta manda correo, push y notificación
      in-app, y termina en «Total a pagar Bs 390» con la caja para subir el comprobante.
      **La causa, en una línea:** `addonHabilitado` resuelve `incluidoPorPlan` **primera** y sale
      (`if (incluidoPorPlan) return true`), pero `vencimientoDelAddon` —la función que contesta
      *«¿cuándo se apaga?»*— se quedó con **dos** de las tres fuentes. Su propia cabecera lo dice:
      *«la habilitacion tiene DOS fuentes»*. Era cierto el 11-sep y dejó de serlo el 12.
      **A quién le pasa:** al dueño de un **Completo (Bs 1.290, chatbot adentro)** que **antes**
      compraba el add-on aparte — conserva su capacidad `addon.whatsapp` con `validUntil`, así que
      `app/api/cron/renewal-reminders` le manda **D-7, D-3, D-1 y vencido** diciéndole que el
      `<fecha>` su asistente deja de contestar (no deja: su plan lo incluye y `addonHabilitado`
      devuelve `true` para siempre), y `/settings/addon-chatbot` cae en la rama de **RENOVACIÓN**
      con «Total a pagar Bs 390». Es **exactamente el camino que la comparativa de planes le
      vende** («subiendo dejás de pagarlo», cerrado dos ítems más arriba el mismo día): el cliente
      hace lo que le pedimos y el producto le cobra por eso.
      🔴 **Y es la misma clase que `addon-que-no-vence-no-avisa.test.ts` cerró el 11-sep.** Ese
      archivo escribió la regla con todas las letras —*«un aviso que anuncia un EFECTO deriva su
      fecha de las MISMAS fuentes que producen ese efecto»*— y después la **fijó sobre las dos
      fuentes de ese día**: cerró la instancia. Su sección «la premisa se re-mide» pregunta si la
      columna sigue siendo fuente, **no cuántas hay**, así que la tercera entró en verde y el gate
      pasó a defender el hueco.
      Entró: `incluidoPorPlan` **obligatorio** en `vencimientoDelAddon` (`tsc` nombró a los 6
      llamadores); `lib/subscription/chatbot-incluido-en-el-plan.ts` con la condición **mudada tal
      cual** desde `fuentesDelAddonWhatsApp` —que es `async` y consulta Prisma, así que el cron,
      que ya trae la org en memoria, habría tenido que re-escribirla al lado, y de dos copias la
      primera en quedarse vieja es la del aviso—; `trialEnd` en el `select` del cron (sin él
      `derivePlanStatus` lee «sin fecha» = vigente y la inclusión falla **abierta**); y la pantalla
      derivando **un solo valor** para sus dos preguntas (el rótulo y la fecha) en vez de
      consultarlo dos veces.
      **El gate no fija el caso de hoy:** deriva las fuentes leyendo los campos de
      `FuentesDelAddon` **del disco** y cruza `vencimientoDelAddon` contra `addonHabilitado` sobre
      las combinaciones del mundo — *si se anuncia un corte, el add-on tiene que estar apagado
      después de esa fecha*. La **cuarta** fuente lo pone rojo antes de existir
      (`lib/subscription/incluido-en-el-plan-no-se-reclama.test.ts`).
      **Validado por mutación, cinco veces** (rojo por el motivo correcto, árbol restaurado con
      `cp`): esquivar la tercera fuente → 3 rojos; `return null` siempre —la cura exagerada, que
      callaría también los avisos **ciertos**— → 3 rojos, incluida la baranda `anunciados > 0`;
      el cron acallándolo con literal → 1 rojo; la pantalla clavándolo en `false` → 1 rojo; una
      cuarta fuente en el tipo → 1 rojo **nombrándola**. Gates: `tsc` limpio, `eslint` 0 errores,
      `vitest` **4.920/4.920** — y los tres **re-corridos en el VPS** sobre el árbol publicado.
      ⚠️ **Hoy no es alcanzable en producción y por eso se arregla ahora:** medido en `supabase-db`
      el 2026-09-13, ninguna org tiene plan `clinic`/`enterprise` y las dos con capacidad
      `addon.whatsapp` la tienen `validUntil NULL`. El defecto se enciende solo el día que alguien
      **suba de plan**, que es el día que menos ganas hay de descubrirlo.
      **Falta mergear y desplegar** para que el cliente lo vea.

- [ ] 🔴 **Estado real de los agentes IA del producto** (Sergio Urcullo, 11-sep: *"mira también
      cómo están los agentes ai"*). **MEDIDO el 2026-09-11 en la base de prod** (supabase-db,
      tablas `onia_agents_*`): 4 agentes definidos, el cron corre y completa (22 corridas
      `completed`, 14 en los últimos 7 días, última hoy 11:00 UTC) — pero
      **`onia_agents_actions` tiene CERO filas en toda la historia**: los agentes corren en
      vacío, jamás dejaron un borrador. La portada y el panel venden exactamente ese borrador
      ("Para aprobar: avisar los pagos vencidos…"). Falta la mitad que importa: SEMBRAR un caso
      real en `clinica-sergio-p2ljs` (deuda vencida + paciente sin volver), correr el cron, ver
      el borrador aparecer en `onia-platform/app/(dashboard)/agents/page.tsx`, aprobarlo y
      verificar el efecto. Si con datos no propone nada, el generador está mudo y eso es un 🔴
      de venta. Los agentes NO llaman a ningún modelo (costo de API cero).

      **E2E EJECUTADO el 2026-09-12 (madrugada): EL MOTOR PRODUCE.** Sembrado en
      `clinica-sergio-p2ljs` (ids `e2e-agentes-*`: paciente sin volver hace 200 días + factura
      `VENCIDA` de Bs 370 hace 12 días), cadencia destrabada (las runs de hoy se borraron para
      esa org) y relanzado `/root/bin/run-onia-agents-cron.sh` → `ran:2, proposed:2`:
      el Cobrador redactó el reclamo ("saldo vencido Bs 370,00 hace 12 días") y el Recall el
      mensaje de reactivación con `suggestedMessage` completo — los DOS en `pending_approval`
      en `onia_agents_actions`, visibles en la pantalla Agentes de la clínica de Sergio para
      que él apruebe. **El misterio del "0 acciones en la historia" quedó explicado: motor
      sano + cadencia diaria + orgs sin datos disparadores** (`not_due` / feeds vacíos).
      Pendiente de este ítem: (a) ✅ **HECHO el 2026-09-13 (madrugada): circuito E2E entero
      en la org QA "ZZ QA Bandeja 1.0"** (Sergio delegó: "tú haz la prueba"). Semillas
      `e2e-agentes2-*` → cron → 2 borradores `pending_approval` (Cobrador Bs 370 con texto
      completo, Recall 6 meses) → aprobado el del Cobrador POR PANTALLA como admin de la QA
      → `executed` + dispatch `manual` en estado `sent` con link wa.me — **se usó "Enviar yo mismo" a
      propósito**: el botón "Aprobar y enviar" SÍ dispara WhatsApp Cloud API real
      (dispatcher → adapter whatsapp), verificado leyendo el código ANTES de apretar.
      Purga con respaldo (`/root/respaldos/e2e-agentes2-purga-20260913.json`), re-auditoría
      en cero. **4 fricciones de UI anotadas para F4**: (i) ✅ **CERRADA el 2026-09-13 — NO se
      reproduce, medida en producción**; (ii) ✅ **CERRADA el 2026-09-13** tras envío
      manual el panel rotulaba "Ejecutada" aunque nadie abrió el link; (iii) ✅ **CERRADA el
      2026-09-13** el aviso con el link wa.me desaparecía al navegar; (iv) ✅ **CERRADA el
      2026-09-13** la tarjeta de /pending decía "Propuesta de agente" genérico.

      ✅ **(i) CERRADA el 2026-09-13: la barra no tapa nada, y el contenedor ya se defiende
      solo.** Medida contra producción en la cuenta real (`sergio@onia.com.bo`, `/agents`),
      **en los DOS viewports**, con `reducedMotion:"reduce"` y scrolleando al fondo antes de
      leer los rects (un rect leído a medio animar es el falso positivo conocido de esta
      familia). Escritorio 1440×900: el contenedor de la pantalla es
      `pt-20 md:pt-24 **pb-40 md:pb-28** px-4 …`, documento 922 px contra viewport 900 → el
      fondo se alcanza con `scrollY 22` y lo único fijo abajo es la banda del plan `be-raiz`
      (870→900), que apoya sobre el padding y no pisa ninguna tarjeta. Móvil 390×844: la barra
      de abajo es la **navegación** (`fixed bottom-0 … md:hidden`, 64 px de alto, 779→844), y
      con `pb-40` (160 px) el contenido termina bien por encima; documento 1142 = `scrollY 298`
      + 844, o sea fondo alcanzado y nada debajo de la barra salvo la barra misma.
      **Y no es una cura frágil que se rompa al crecer la lista:** el `padding-bottom` es del
      contenedor de la pantalla, no del último hijo, así que los 3 agentes nuevos (cuando se
      desplieguen, 6 tarjetas) alargan el documento sin acercar nada a la barra.
      Instrumento: medidor efímero de una vuelta (rects de todo lo `fixed`/`sticky` anclado
      abajo + `elementsFromPoint` para ver QUÉ queda debajo), **borrado a propósito** — un
      instrumento vivo que queda de alias suelto no lo corre nadie, y lo que medía ya está
      escrito acá. Se rehace en 10 minutos si alguna pantalla vuelve a sospecharse.

      ✅ **(iv) CERRADA el 2026-09-13 — la cola de aprobaciones NOMBRA al agente.**
      Era la clase «escrituras ↔ LECTURAS», la misma de (ii)/(iii):
      `agents-runtime.ts:1185-1190` escribe `metadata.agentName` / `agentRole` / `agentId`
      en cada approval **desde que existe el módulo**, y el rótulo no los leía —
      `approval-labels.ts` devolvía la constante `"Propuesta de agente"` para todo
      `agent_action`. Con los seis agentes del catálogo (`ROLES_CON_ROTULO`: recall,
      cobrador, captador, confirmador, reponedor, seguidor) son **seis productores y una
      etiqueta**: el dueño abre `/pending`, ve seis tarjetas que dicen lo mismo y tiene que
      entrar una por una para saber cuál es cuál. Ahora dicen *"Propuesta de Cobrador"*,
      *"Propuesta de Recall"*, etc.
      **Corrección de lo que esta misma cola daba por medido:** decía que los consumidores
      del rótulo eran DOS y que *"van juntos"*. Contados contra el código de hoy, el panel
      **no es sujeto**: `onia-platform/app/(dashboard)/dashboard/page.tsx:380` filtra
      `requestType !== "agent_action"`
      antes de rotular, y pinta los borradores de agente por otra vía, con
      `accion.summary` (que ya es específico). El único que mostraba la etiqueta genérica es
      `/pending`. Igual el panel recibe la metadata, con el motivo escrito al lado: el día
      que deje de filtrar, el rótulo nombra al agente solo en vez de entrar mudo.
      **El nombre se LEE, no se mapea de nuevo.** `nombreCortoDeAgente` corta `agentName` en
      la raya larga ("Cobrador — saldos vencidos" → "Cobrador"); un segundo diccionario
      `agentRole → nombre` era más fácil y es justo lo que dejó a una pantalla diciendo la
      verdad y a la otra no en (ii). Si el dueño renombró su agente y no hay raya, se muestra
      entero; sin `agentName` (approvals viejos) cae a la etiqueta genérica, nunca a la clave.
      **Y el rótulo se arma en el SERVIDOR** (`pending-view.tsx`), que de paso saca un import
      de `lib/` de un `"use client"` — la cadena que el 2026-09-12 dejó una pantalla en 500.
      **Dos gates, los dos validados por mutación** (rojo visto ANTES en los tres casos de
      unidad, con el motivo correcto): `lib/onia-core/approval-labels.test.ts` deriva el
      sujeto de `ROLES_CON_ROTULO` y exige **seis rótulos DISTINTOS** —el agente número siete
      nace cubierto—; y `lib/onia-core/approval-labels-en-pantalla.test.ts` cierra el agujero
      que `tsc` no ve: el parámetro `metadata` es obligatorio, así que el llamador que lo
      **olvida** no compila, pero el que le pasa `null` para callarlo sí. Ese gate camina el
      disco (no `git ls-files`: un archivo nuevo sin commitear sería invisible) buscando quién
      llama a la función, y exige que ninguno la acalle. Mutaciones: `null` literal en el
      panel → rojo; un solo argumento en `pending-view` → rojo; el rótulo de vuelta a la
      constante → 3 rojos de unidad.
      Commit `9aa0cd5` (`onia-platform`, rama `claude/chatbots-platform-review-0d1d09`),
      gates re-corridos EN EL VPS antes de publicar la rama: `tsc` 0, **4.849 tests verdes**.
      ⚠️ **COMMITEADO, NO DESPLEGADO, y NO se miró renderizado** — por lo mismo que (ii)/(iii):
      el banco `/dev/demo` pide base local sembrada + `next dev`, y en producción no hay hoy
      ningún approval pendiente que mirar (los `e2e-agentes2-*` se purgaron en la vuelta
      anterior). Falta esa foto cuando haya un borrador vivo.

      <details><summary>Lo que se midió antes de tocar nada — la mitad cara ya estaba bien</summary>

      La sospecha razonable era que la tarjeta mandara a aprobar a ciegas:
      encabeza *"Al aprobar, esto sale de verdad. Revisá el texto antes"* sobre un botón
      ("Aprobar y enviar") que dispara WhatsApp Cloud API real. **Falso: el texto SÍ está.**
      `app/(dashboard)/pending/pending-client.tsx:282-291` pinta el sobre completo —
      *"Se envía por {canal} a {destinatario} ({dirección})"* más `approval.body`
      (el campo está documentado en el tipo como *"Texto EXACTO que se va a enviar"*) — y
      `blockedReason` avisa cuando hoy no podría salir. Queda sólo el rótulo, y su arreglo ya
      está ubicado, así que la próxima vuelta no lo investiga de cero:
      **es la clase «escrituras ↔ LECTURAS», la misma de (ii)/(iii).**
      `agents-runtime.ts:1185-1190` ya escribe `metadata.agentName` / `agentRole` / `agentId`
      en el approval, y el rótulo no los lee: `approval-labels.ts:18` devuelve la constante
      `"Propuesta de agente"` para todo `agent_action`. Con los 3 agentes nuevos son **seis**
      productores y **una** etiqueta: la cola de aprobaciones queda con seis tarjetas que
      dicen lo mismo y el dueño no sabe cuál es cuál sin abrir cada una.
      Al hacerlo: los consumidores del rótulo son DOS (`pending-client.tsx:244` y el panel
      `onia-platform/app/(dashboard)/dashboard/page.tsx` línea 546) y van juntos — dos diccionarios de estado
      fue exactamente lo que permitió que una pantalla dijera la verdad y la otra no en (ii).
      No se empezó en esta vuelta por tiempo: son ~4 archivos más gates, y medio arreglo
      commiteado es peor que ninguno.

      ✅ **(ii) + (iii) CERRADAS el 2026-09-13 — y el hallazgo era más grande que la
      fricción anotada.** El dispatcher declara una **regla dura en su propia cabecera**:
      *"2. NO SE FINGE UN ENVIO. […] La accion del agente solo pasa a `executed` cuando el
      mensaje SALIO."* El canal `manual` la rompe sin querer: por diseño **no manda nada por
      la red** (devuelve un link `wa.me` para que la persona lo toque), así que el adapter no
      tira, el despacho queda `sent` y la acción `executed` — idéntico a un envío real. La
      distinción la asienta `metadata.pendienteDeEnvioHumano`, y el propio canal escribe
      textual *"Quien lea el registro tiene que poder distinguirlo de un envio real"*.
      **Medido: ningún `.tsx` lo leía.** El dueño veía "Ejecutada" sobre un reclamo de deuda
      que nunca se mandó, y el único lugar con el link era un aviso efímero que se borraba al
      navegar — o sea que perdía el mensaje Y le quedaba un panel diciéndole que ya estaba
      hecho. Es la clase «escrituras ↔ LECTURAS»: un campo que se escribe y nadie lee es
      código muerto con cara de vivo.
      **Cómo se cerró** (rama `claude/chatbots-platform-review-0d1d09`, `onia-platform`):
      módulo puro `lib/onia-core/modules/agents-envio-humano.ts` como **única fuente** del
      rótulo (las pantallas ya no tienen su propio diccionario de estados: tener dos era lo
      que permitía que una dijera la verdad y la otra no) + `agents-view.tsx` rotula
      **"Falta que la envíes"** con el link `wa.me` persistente en la tarjeta, y
      `comercio-hoy.tsx` **descuenta del tick de "hecho"** lo que todavía espera el dedo.
      **Gate de CLASE** `lib/platform/panel-no-finge-un-envio.test.ts`: sujeto derivado del
      disco —superficie que lee `oniaAgentsAction` **y** nombra un estado terminado—, elegido
      a propósito para que **sobreviva al arreglo** (derivarlo del diccionario de rótulos era
      más fácil y se habría apagado solo, porque el arreglo consiste justamente en sacar ese
      diccionario de la pantalla). **Visto en ROJO antes**, nombrando `agents-view.tsx`; 20
      casos de unidad validados **por mutación en dos puntos** (esquive del despacho → 2
      rojos; puerta de estado del despacho → 2 rojos). `tsc` limpio, `eslint` 0 errores.
      ⚠️ **NO se miró renderizada:** el banco `/dev/demo` necesita base local sembrada
      (`prisma/seed-demo.ts`) y un `next dev`, que no entraban en la vuelta. Falta esa foto
      antes de darla por mirada. **Commiteado, NO desplegado.**
      (b) ✅ **purgadas el 2026-09-12**, las 12 filas, con respaldo y re-auditoría en cero;
      (c) construir los 3 agentes nuevos de abajo.

      ✅ **(v) CERRADA el 2026-09-13 — la misma pantalla se contradecía a sí misma, y se
      ve HOY en la cuenta real de Sergio Urcullo.** No estaba en la lista de fricciones:
      apareció MIRANDO `/agents` renderizada en producción
      (`mirar_bandeja_dueno.mjs --email sergio@onia.com.bo --ruta /agents`, captura
      `/root/agents-escritorio.png`). Arriba, Recall y Cobrador dicen **"propuestas 1"**;
      abajo, la sección de acciones dice **"Todavía no hay propuestas. Cuando un agente
      detecte algo […] su sugerencia va a aparecer acá"**. Los dos números salen de tablas
      distintas y el dueño no puede saber cuál creer.
      **La causa NO era la purga de QA — es del producto y le pasa a cualquier cliente.**
      `VISIBLE_ACTION_STATUSES` en `agents-view.tsx` lista cuatro estados
      (`pending_approval`, `approved`, `executed`, `auto_executed`) y el motor sella **tres
      más** que quedan afuera: `proposed`, `rejected` y `discarded`. O sea que **el dueño
      que RECHAZA su única propuesta —una acción que el producto le ofrece— la ve
      desaparecer y después lee que el agente todavía no detectó nada.** Es la clase «una
      lectura que devuelve `[]` y el texto del caso vacío AFIRMA una causa falsa».
      Verificado en la base (`supabase-db`, org `clinica-sergio-p2ljs`):
      `onia_agents_runs` tiene la corrida del 12-sep con `itemsProduced 1` y summary
      "propuestas 1 · auto 0 · descartadas 0", y `onia_agents_actions` tiene **0 filas en
      toda la base**.
      **Cómo se cerró** (rama `claude/chatbots-platform-review-0d1d09`, `onia-platform`):
      módulo puro `lib/onia-core/modules/agents-lista-vacia.ts` como única fuente del
      párrafo — se **condiciona** la promesa, no se borra: con 0 propuestas el texto de
      siempre sigue siendo el correcto; con propuestas hechas dice lo que de verdad les
      pasó. La pregunta se le hace a las **corridas** (`itemsProduced`), que es una fuente
      distinta de la lista de acciones: preguntarle a la misma tabla habría sido una
      tautología. Gate `agents-lista-vacia.test.ts`: **caso ancla derivado del disco** que
      exige que `rejected` y `discarded` sigan siendo estados que el motor escribe y la
      pantalla esconde —si algún día la lista los mostrara, el gate se pondría rojo en vez
      de apagarse solo— más el cableado (la pantalla no puede volver a tener su propio
      párrafo). **Visto en ROJO antes** (3 casos), y **validado por mutación en dos puntos
      después del arreglo**: esquive de la condición → 2 rojos; descableado de la pantalla
      → 1 rojo. `tsc` limpio, `eslint` 0 errores. **Commiteado, NO desplegado.**

      **DECIDIDO por Sergio Urcullo (11-sep, eligió las 4 opciones) y TODAVÍA SIN CONSTRUIR:
      los TRES agentes nuevos** (nota del merge del 12-sep: dos carriles reescribieron este
      ítem a la vez — la parte MEDIDA es sucesora, la DECISIÓN de los tres no se pierde).
      Sobre el mismo patrón de `onia-platform/lib/onia-core/modules/agents-runtime.ts`:
      (1) ✅ **Confirmador de citas de mañana** (`draft_message`: citas de mañana sin
      confirmar → mensaje listo para aprobar) — **CONSTRUIDO el 2026-09-12**, ver abajo,
      (2) ✅ **Seguimiento de cotizaciones** sin respuesta en N días (`draft_message` —
      importadora) — **CONSTRUIDO el 2026-09-12**, ver abajo, (3) ✅ **Stock bajo mínimo →
      tarea de pedido** al proveedor de la ficha
      (`create_task`: no depende del envío externo) — **CONSTRUIDO el 2026-09-12**, ver abajo.
      **Los TRES quedaron construidos; lo único que les falta a los tres es el mismo paso:
      mergear y desplegar.**

      ✅ **(1) HECHO: agente `confirmador`** (`onia-platform`, rama
      `claude/chatbots-platform-review-0d1d09`, `82d34b5` — **falta mergear y desplegar**). Gate nuevo
      `lib/onia-core/modules/agents-confirmador.test.ts` (17 casos), validado **por mutación en
      dos puntos**: contar «mañana» en UTC en vez de la zona del negocio → rojo; sacarle la
      puerta de rubro → rojo.

      **El hallazgo, que es por qué el gate más largo del archivo es el de la zona horaria.**
      El contenedor `onia-platform` corre con `TZ` vacío (UTC) y La Paz es UTC−4: entre las
      20:00 y la medianoche **local** el servidor ya está en el día siguiente. Un
      «mañana = ahora + 24 h» leído en UTC le manda al dueño los borradores de **pasado
      mañana** durante cuatro horas por día, y se saltea los de mañana — sin fallar nunca del
      todo. El día se lee con `Intl` en la zona de la org (`clinic_settings.timezone`, con
      cascada al default) y la suma se hace sobre el **calendario** local, no sobre el
      instante; el recorte fino lo hace el evaluador puro y el `where` de Prisma trae un
      superconjunto de 48 h a propósito.

      **Lo que NO se hizo, y por qué.** No cuelga de `reminder24hSentAt` como el seguimiento de
      visitas del captador: ese campo lo escribe **otro** circuito (el cron de
      `appointment-reminders`) y puede no haber salido nunca — medido hoy, producción tiene
      **cero citas** (`select count(*) from appointments` → 0), así que cero recordatorios.
      Colgarlo de esa precondición lo dejaría mudo por una razón que no tiene nada que ver con
      lo que decide. Y comparte `targetType: "visita"` con el captador **a propósito**: el
      cooldown del runtime se lleva por `(org, targetType, targetId)`, así que es lo único que
      impide que los dos agentes le escriban al mismo paciente por la misma cita.

      ⚠️ **La decisión decía «cada tarde» y el producto no puede prometer eso**: la cadencia de
      todos los agentes la marca **un** cron del host, 1 vez por día (11:00 UTC = 07:00 La
      Paz). El agente mira las citas de mañana una vez al día; cambiar la hora es tocar un cron
      del VPS, que no es de este carril.

      ✅ **(2) HECHO: agente `seguidor`** (`onia-platform` `0376b07`, rama
      `claude/chatbots-platform-review-0d1d09` — pusheado, **falta mergear y desplegar**).
      ⚠️ El sha se DERIVA de `origin`, no del clon de casa: desde el nodo de casa no se pushea
      `onia-platform`, la entrega va por `format-patch | ssh … git am`, y **`git am` regenera el
      sha** — el local decía `4d94cdf`, que no existe en ningún remoto. Gates re-corridos **en
      el VPS** sobre el árbol que se publicó, no sobre el de casa: `tsc` limpio, **393 archivos
      de test verdes** (4.791 casos), `eslint` limpio, `check:onia-core` OK.
      Gate nuevo `lib/onia-core/modules/agents-seguidor.test.ts` (21 casos), **validado por
      mutación en cuatro puntos**: sin puerta de validez → rojo; sin puerta de estado → 4
      rojos; sin puerta de rubro → 2 rojos; sin plazo de espera → rojo.

      **Las dos decisiones que costaron pensarlas, porque las dos tenían una versión obvia y
      equivocada.** (a) **La fecha del envío sale de `metadata.sentAt`, que ya la escribe la
      transición del rubro (`transicionarCotizacion`) — NO de `updatedAt`.** Parecen lo mismo y
      no lo son: editar una línea después de mandarla mueve `updatedAt`, así que la cotización
      que se está negociando activamente sería justo la que el agente deja de perseguir. El dato
      ya existía en el producto; inventarlo habría sido la segunda fuente.
      (b) **Una cotización VENCIDA no se persigue, y ése es el caso NORMAL, no el raro:** pasar
      a `expired` es una transición **manual** que nadie ejecuta, así que la base tiene `sent`
      con la validez cumplida. Un borrador que pregunta "¿la viste?" sobre un precio que ya no
      vale le promete al cliente un monto que el negocio no va a sostener. Sin `validUntil`
      cargado **sí** se persigue: ahí el precio nunca se declaró vencido.

      **Y una tercera, sobre qué NO dice el mensaje:** el texto al cliente **no repite el
      monto**, aunque el feed lo tenga y el resumen del panel sí lo muestre. Son dos lectores
      distintos — el resumen lo lee el dueño, que prioriza por plata; el mensaje lo lee el
      cliente, que ya tiene la cotización. Repetirle la cifra suelta por WhatsApp, sin las
      líneas ni las condiciones, convierte un seguimiento en una segunda oferta que puede no
      coincidir con el documento.

      ⚠️ **Hoy no tendría a quién perseguir, y se midió antes de decir lo contrario:**
      `select ... from onia_commerce_quotes` en producción devuelve **cero filas** en todas las
      orgs. Es el mismo estado que el Confirmador (cero citas) y por el mismo motivo — no hay
      clientes usando el producto todavía, no es que el agente esté mudo. Lo que prueba que
      produce es el gate, no la base.

      ✅ **(3) HECHO: agente `reponedor`** (`onia-platform` `42ab871`, rama
      `claude/chatbots-platform-review-0d1d09` — pusheado, **falta mergear y desplegar**).
      Gates en el VPS: `tsc` limpio, **4.749 tests verdes**, `eslint` limpio, `check:onia-core`
      OK. Gate nuevo `lib/onia-core/modules/agents-reponedor.test.ts` (10 casos), **validado por
      mutación en tres puntos**: predicado propio en vez de `isBelowReorder` → rojo en el borde
      `quantity === reorderPoint`; sin puerta de rubro → rojo; sin rótulo → rojo.

      **Lo que apareció al construirlo y es el hallazgo:** el predicado ya existía
      —`isBelowReorder` en `lib/onia-core/modules/commerce-logic.ts`, port fiel del core, con
      sus tests— y tenía **CERO llamadores en producción**: sus únicas referencias eran su
      propio archivo de test. Un módulo que nadie llama vale cero. El agente no lo reescribe,
      lo llama; y el `<=` tampoco se duplica en el `where` de Prisma (el SQL acota a lo que el
      dueño curó, `reorderPoint` cargado, y el evaluador puro decide) — así la regla que
      decide si el negocio se queda sin mercadería vive en **un solo lugar**.

      Las cuatro puertas que un agente nuevo tiene que cruzar, cada una con el bug que la
      originó: **rubro** (`agents-por-rubro`: corre sólo donde hay inventario, preguntándole al
      pack con `llevaInventario` y no a una lista de tracks escrita al lado — así fue como el
      Recall terminó corriendo mudo en tres rubros); **rótulo** (`agents-rotulos`, o la pantalla
      renderiza un hueco); **tipo de work item** (`reponer_insumo`, que el vocabulario del core
      ya tenía — sin eso caía al default `seguimiento_paciente` y las tareas de pedido de una
      ferretería aterrizaban en la bandeja de recepción clínica); y **entidad relacionada**
      (`stock_item` → `OniaCommerceStockItem`). De paso, `isAgentKind` pasó a derivarse de
      `AGENT_KINDS`: con la lista escrita a mano, un kind nuevo entraba al cron y el endpoint
      externo lo rechazaba.

      Es `create_task` y `autonomyLevel: "auto"` a propósito: **no contacta a nadie**, así que
      no ocupa la cola de aprobaciones —que es para lo que SALE del negocio— y no depende del
      envío externo (S6), que sigue sin existir. Cooldown de 7 días por existencia: el proveedor
      tarda, y repetir la tarea a diario hasta que llegue la mercadería entierra la cola.
      El guard 15b del propio producto cazó mi copy en tuteo («Revisa») antes de que lo viera
      un cliente — el gate de rubro×texto funcionando sobre trabajo nuevo. Restricción vigente: el ENVÍO externo (S6) no
      existe — aprobar registra la acción; el WhatsApp real es obra aparte y no se promete hasta
      que exista. Las dos precondiciones que Sergio Urcullo puso antes de estos tres (E2E de los 2
      vivos, y la cadencia) **ya están cerradas** en los dos ítems de abajo.

- [x] 🔴 **El auditor que escribí AYER para esto dio «limpio» con DOCE filas de prueba vivas
      dentro de la cuenta de Sergio Urcullo — porque su marca era una lista escrita a mano.
      Filas borradas y segundo detector, el que no depende de la marca, cableado (2026-09-12).**

      **Lo medido, no razonado.** `npm run qa:sin-rastro` salía `En organizaciones REALES: 0`,
      exit 0. Preguntándole a la misma base por `e2e-agentes` en vez de por `zz-?qa`:
      **12 filas dentro de `clinica-sergio-p2ljs`** — 2 pacientes, 1 cita, 1 factura vencida de
      Bs 370, 2 `onia_agents_actions` y 2 `onia_core_approval_requests`. Las sembró este mismo
      carril en la vuelta anterior para probar el E2E de los agentes, y el ítem de arriba las
      declaraba "pendiente de purgar".

      🔴 **Lo peor no era la basura: eran DOS borradores en `pending_approval` en la pantalla
      Agentes de Sergio Urcullo** — un reclamo de cobro por "saldo vencido Bs 370,00 hace 12
      días" y un mensaje de reactivación, los dos dirigidos a pacientes que no existen. El
      producto se los ofrecía para aprobar; aprobarlos habría intentado escribir a `+59170000001`.

      **La lección, que es de método y por eso vale para todos:** el auditor derivaba el universo
      de TABLAS de `information_schema` —eso estaba bien y encontró `audit_logs`— pero después
      filtraba con **una marca escrita a dedo** (`MARCA = 'zz-?qa'`). Derivar los sujetos del
      disco no sirve de nada si el predicado que los juzga es una lista blanca: falla abierto
      exactamente en el sujeto nuevo, y el sujeto nuevo lo sembró **el mismo carril que escribió
      el auditor, dos horas después**.

      **El arreglo es una segunda pregunta que no pasa por la marca:** ¿hay filas en una
      organización real cuyo `id` **no lo generó el producto**? Los generadores conocidos son
      tres (cuid de Prisma, uuid, hex de la migración) y se leen de la base, no de una creencia:
      medido ese día, de **74 tablas** con `organizationId` sólo **7 filas** en TODA la base
      tenían un id fuera de esos formatos, y **4 eran la siembra**. La única excepción legítima
      —`sergio20260904addonwa001`, el add-on de WhatsApp otorgado a mano el 4-sep— se nombra por
      su **literal exacto** y se re-mide en cada corrida: una excusa por forma (`^sergio…`)
      dejaría pre-aprobada a la próxima fila que alguien inserte con ese prefijo.

      **Validación viva, el mismo comando, antes y después:** con las filas puestas
      `npm run qa:sin-rastro` pasó a `En organizaciones REALES: 4` (exit 1) nombrando las cuatro
      raíces; borradas en transacción con respaldo en
      `/root/backups-qa/e2e-agentes-cuenta-real-20260912.json` (7 KB, 12 filas), volvió a
      `REALES: 0` **y la búsqueda por la marca `e2e-agentes` también da 0**.
      Gate: `scripts/qa_sin_rastro.test.mjs`, 13 casos (5 nuevos), en la cadena
      (`npm run test:qa-sin-rastro`). Validado por mutación DESPUÉS de estar verde: agregarle
      `e2e-` a los generadores conocidos (2 rojos), volver la excusa por forma (1 rojo) y tirar
      el resultado del segundo detector (1 rojo).

- [x] 🔴 **La cuenta REAL de Sergio Urcullo tenía 7 filas de datos de prueba adentro, y una de
      ellas hizo que otro carril abriera una tarea CRÍTICA por un cruce de tenant que NUNCA
      EXISTIÓ. Limpiada y verificada en producción el 2026-09-12; el auditor que la encontró
      queda cableado (`npm test`).**

      **Lo que se creía:** `recorrido-cliente` midió que el paso 6 de Importadora, con la sesión
      de una cuenta de prueba recién creada, había escrito un paciente **dentro de
      `clinica-sergio-p2ljs`** — la cuenta real de Sergio Urcullo. Tarea `t_3f352044`, prioridad
      crítica: un fallo de aislamiento multi-tenant es lo más grave que puede tener este producto.

      **Lo que pasó, medido, no razonado.** La ruta que crea pacientes escribe auditoría SIEMPRE
      (`app/api/patients/route.ts`: `prisma.patient.create` y acto seguido `logAudit`). En
      `audit_logs` **no hay ni un `PATIENT_CREATED` en 48 h** — así que esa fila no la creó
      ninguna sesión web. La creé **yo**, este carril, con un `INSERT` directo, en la vuelta
      anterior (`2e034412`), para poder probar aprobar→enviar sobre una org con onboarding hecho.
      El id que declara ese commit —`zzqa20260912pac1`— es exactamente el que la tarea reporta.
      **El producto no tiene cruce de tenant. Lo tenía el instrumento, y era mío.**

      🔴 **Por qué el otro carril no podía saberlo, y esto es la lección que importa:** al
      paciente le puse un nombre con la **forma sellada de ESE carril**
      (`zz-qa-AAAA-MM-DD-HHMM …`). Su barredor borra por esa forma —correctamente, es la suya—,
      así que se llevó mi fila, la contó como propia y concluyó que su paso 6 había escrito en
      una cuenta ajena. **Un sello de QA sin el nombre del carril que siembra hace que el
      instrumento del vecino acuse al producto de un bug que es tuyo.**

      🔴 **Y la limpieza de esa vuelta, declarada "verificada contra la base", estaba
      incompleta:** el inventario era una lista a mano (paciente · cita · acciones · aprobaciones
      · despachos · corridas) y la escritura **derivada** no estaba en la lista. Quedaron **4
      filas en `audit_logs` de la cuenta real** con el nombre del paciente de prueba y el texto
      de un WhatsApp que nunca se mandó — y el dueño las ve: `/admin/audit` existe
      (`app/(dashboard)/admin/audit/page.tsx`). Borradas por id exacto, con respaldo previo en
      `/root/backups-qa/audit-logs-zzqa-20260912.json`: 61 → 57 filas, 0 contaminadas.

      **El arreglo NO es acordarse mejor: es preguntarle a la base.**
      `scripts/qa_sin_rastro.mjs` **deriva el universo de `information_schema`** —toda tabla real
      con `organizationId` (más `organizations` por su `id`) y todas sus columnas de texto y
      JSON— y busca la marca `zz-?qa` en cada una. Una tabla nueva entra sola; `jsonb` entra
      (es donde sobrevivió el rastro); es **tri-estado** (exit 2 = no pude preguntar, nunca
      "limpio"); y una fila cuya organización no existe **no se absuelve**, cuenta como real.

      **Lo que encontró en su primera corrida viva, que ninguna lista a mano habría visto: 74
      tablas miradas y 3 filas MÁS de basura de QA dentro de la cuenta real**, de otras corridas
      y con una semana de antigüedad — 2 recordatorios en `notifications.message`
      (`zz-qa-verif-4a`, del 5-sep) y un proveedor `zz-qa-proveedor` en
      `onia_core_business_partners`. Respaldadas en
      `/root/backups-qa/basura-qa-cuenta-real-20260912.json` y borradas en una transacción.
      **Re-auditado: `En organizaciones REALES: 0`, exit 0.**

      Gate: `scripts/qa_sin_rastro.test.mjs`, 8 casos, en la cadena (`npm run test:qa-sin-rastro`).
      Validado por mutación DESPUÉS de estar verde — sacarle `jsonb` al universo, absolver a la
      fila huérfana, y hacer que el catch devuelva "limpio" ponen 1 caso en rojo cada uno.
      Medición viva: `npm run qa:sin-rastro` (~7 s). **Este carril la corre al cerrar toda vuelta
      que siembre en producción**, que es la única forma de que un alias suelto no valga cero.

- [x] ✅ **MEDIDO Y ARREGLADO el 2026-09-12 (`ea80ada`, onia-platform — pusheado a la rama,
      falta mergear y desplegar): los agentes corrían DÍA POR MEDIO, y la pantalla promete
      «corre todos los días».** (Sergio Urcullo, 11-sep: *"mira también cómo están los agentes
      ai"*.)

      **Lo que se midió en producción**, no heredado — `supabase-db` + `/var/log/onia-agents-cron.log`:

      | | |
      |---|---|
      | Agentes vivos | **4**: Recall y Cobrador en las dos orgs con plan vigente (`clinica-sergio-p2ljs`, `bolivian-electricidad-e6t21`). El **Captador nunca corrió**: `kind_not_enabled` — vive detrás de `addon.captador` y nadie lo compró |
      | Corridas | 22, **todas `completed`, sin un solo `error`**, todas con `propuestas 0` |
      | Borradores esta semana | **CERO.** `onia_agents_actions` = 0 filas en toda la base; `onia_core_approval_requests` = 0 |
      | Circuito aprobar→enviar | **Construido entero y JAMÁS ejecutado en producción** — 0 aprobaciones desde que existe |

      **Por qué 0 propuestas, contado hoy y no en septiembre:** las dos orgs con agentes tienen
      **0 citas y 0 facturas** (la dental tiene 1 paciente y ninguna cita). Recall exige una cita
      completada hace ≥180 días sin cita futura; Cobrador, una factura emitida y vencida. Con esos
      datos, `propuestas 0` es la respuesta **correcta** del motor, no un fallo. El diagnóstico del
      04-sep decía lo mismo y **se volvió a contar** en vez de heredarse.

      🔴 **El defecto real estaba en otro lado, y ningún gate podía verlo: el disparador.** El cron
      `0 11 * * *` disparó los 11 días del mes, pero las corridas quedaron los días **04, 05, 07,
      09 y 11** — los días **06, 08 y 10** todos los agentes contestaron `skippedReason: "not_due"`.
      La causa es aritmética: `intervalMinutes` vale **1440**, exactamente la cadencia del
      disparador, y `shouldRunAgent` exigía `elapsed >= interval` contra el `startedAt` de la
      corrida anterior. El cron nunca arranca en el mismo milisegundo (11:00:01 un día, 11:00:02
      el otro) y la fila se sella **después** de la llamada HTTP, así que el disparo siguiente
      llega unos segundos **antes** de cumplir las 24 h → no corre, y recién al otro día (48 h)
      vuelve a entrar. **El producto entregaba la mitad de la frecuencia que promete.**

      **LA CLASE, para buscarla en otro lado:** cuando la cadencia declarada de un trabajo IGUALA
      la del reloj que lo despierta, el jitter del reloj se come un disparo de cada dos. No falla
      nunca del todo —lo que lo hace invisible—, sólo entrega la mitad. Cada pieza tenía razón por
      separado: el cron corrió, el runtime contestó 200, la corrida cerró `completed`, y
      `agents-cadencia.ts` ya topeaba lo que la pantalla **dice** contra el disparador real. Lo que
      faltaba era que el **scheduler cumpliera esa misma promesa**. Vale para todo cron con
      intervalo propio: barridos del bot, drips, recordatorios.

      Arreglo: `margenDeJitter()` en `lib/onia-core/modules/agents-logic.ts` — 5 % del intervalo,
      **topeado a 60 min**. Proporcional para que valga igual en media hora que en un día; topeado
      para que no se vuelva «corre cuando quiera» (un agente mensual no puede adelantarse día y
      medio). Gate `lib/onia-core/modules/agents-corre-en-cada-disparo.test.ts`: el sujeto es el
      **cruce** de los dos módulos (lo que se promete y lo que el runtime deja correr), con el
      universo derivado de `AGENT_KINDS` — el rol que se agregue mañana entra solo. Validado por
      mutación en **cuatro** direcciones y cada una cae en SU caso: revertir el arreglo (7 rojos),
      margen 0 (7), quitar el tope (1) y frontera estricta `>` (1).
      Gates verdes en las dos máquinas: `tsc` 0 · **4727** tests · `eslint` 0 errores.

      ⚠️ **Lo que queda abierto y NO es de este ítem:** el circuito aprobar→enviar está entero
      (CAS anti-doble-clic, `approvalId` UNIQUE, no finge entrega, y `/pending` ofrece «enviar» y
      «preparar link para mandarlo yo»), pero **nunca se ejecutó con un caso real** porque nunca
      hubo una propuesta que aprobar. Probarlo de punta a punta exige sembrar una cita vieja en
      una org de QA y mirar el despacho — ítem propio, no una línea de éste.

- [x] ✅ **EJECUTADO EN PRODUCCIÓN el 2026-09-12 04:15-04:17 UTC: aprobar→enviar funciona de
      punta a punta. Es la PRIMERA aprobación de la historia del producto.** Era la mitad del
      pedido de Sergio Urcullo del 11-sep que quedaba sin cumplir: el circuito estaba construido
      entero y **nunca se había ejecutado** (0 aprobaciones desde que existe).

      **Estado de partida, contado, no heredado:** `onia_agents_actions` 0 · `onia_core_approval_requests` 0
      · `onia_core_dispatches` 0 · 4 agentes · 22 corridas.

      **Lo que se hizo, y por qué NO en una org `zz-qa` como decía este ítem.** Crear una org de
      QA funcional exige pasar por el alta real (usuario de Supabase Auth + perfil + onboarding),
      porque sin perfil no hay magic link y sin onboarding completo la app redirige a `/onboarding`
      y **ninguna pantalla se puede mirar**. Eso es media vuelta para poder apretar UN botón. Se
      sembró en `clinica-sergio-p2ljs` (dental, `professional` vigente, onboarding hecho) sólo
      **dos filas**, selladas por corrida: paciente `zzqa20260912pac1` y cita `zzqa20260912cit1`
      COMPLETADA hace 200 días. Todo borrado por id EXACTO al terminar.

      🔴 **La trampa que casi invalida la prueba, y que este ítem no preveía: la CADENCIA.** El
      cron dispara `0 11 * * *` y `shouldRunAgent` exige 1440 min contra el `startedAt` anterior;
      la última corrida era de las 11:00 del 11-sep, así que a las 04:15 faltaban ~2 h 40 y el
      agente contestaba `not_due` — no hay parámetro para forzar (`app/api/cron/onia-agents/route.ts`
      no acepta ninguno). Se movió el `startedAt` de la corrida `cmtwuh6a5007801rwcgx3q7lo`, **anotado
      antes de tocarlo** (`2026-09-11 11:00:04.202+00`) y devuelto al cerrar. Es la misma clase que
      arregló `ea80ada` un rato antes, vista desde el otro lado: mientras ese arreglo no esté
      desplegado, **producción sigue con la regla estricta**.

      **Las dos corridas, y las dos importan:**

      | | teléfono | resultado |
      |---|---|---|
      | 1.ª | `+59100000000` | **rechazado**: `numeroParaWhatsapp` exige móvil boliviano (8 dígitos que empiezan en 6 o 7). Despacho `failed`, la pantalla dijo *"Aprobado, pero el envío NO salió… Reintentalo abajo, en «Envíos fallidos»"* y ofreció **Reintentar** con el texto a la vista |
      | 2.ª | `70000000` | **`sent`** con `waLink` `https://wa.me/59170000000?text=…`, `entregaManual: true`, `pendienteDeEnvioHumano: true`, `providerMessageId` NULL |

      El camino de fallo **no era un accidente de la prueba: es la mitad que casi nadie mira**, y
      salió honesta — no fingió entrega, nombró la causa exacta con el valor recibido, y dejó el
      reintento a mano. Se probó sin querer y por eso vale.

      **HECHO, mirado renderizado y contado en la base:** acción `cmtxvii5t002701rwd4xhey4y` →
      `executed` (`executedAt` 04:17:06), aprobación → `approved`, despacho
      `cmtxvis9y002a01rw3zom8z9j` → `sent`. La pantalla dice *"Mensaje listo para … El sistema NO
      lo envió: abrí el link y envialo desde TU WhatsApp"* con **Abrir WhatsApp con el mensaje** y
      **Copiar link**, y la cola de aprobaciones queda vacía. Captura:
      `hermes-content/docs/historial/2026-09-12-aprobar-enviar-punta-a-punta.png`.

      ⚠️ **El botón NO se llama «preparar link»** —como decía este ítem— sino **«Enviar yo mismo
      por WhatsApp»** (`app/(dashboard)/pending/pending-client.tsx:263`). Un texto de botón citado
      de memoria en una cola manda a buscar un ancla que no existe.

      **Limpieza verificada, no declarada:** `onia_agents_actions` 0 · `onia_core_approval_requests` 0
      · `onia_core_dispatches` 0 · paciente 0 · cita 0 · corridas **22** (las mismas que al arrancar:
      se borraron las 3 que generó esta prueba) · 4 agentes intactos · `startedAt` devuelto a
      `2026-09-11 11:00:04.202+00`.

- [ ] 🔴 **Dos propuestas de diseño para el dashboard del producto** (Sergio Urcullo, 11-sep:
      *"ese color que hay ahorita no es nada intuitivo y no hay botones que resalten, que se
      diferencien para que la experiencia sea más fácil"*). Dos direcciones renderizadas
      (maquetas sobre el shell real: `onia-platform/app/(dashboard)/layout.tsx` y
      `onia-platform/app/globals.css`, no dibujos sueltos), con jerarquía de botones
      primario/secundario y color semántico; se le MUESTRAN y él elige. Nada se aplica al
      producto sin su OK.

- [x] ✅ **CERRADO el 2026-09-11 (`c14db84`, rama `claude/chatbots-platform-review-0d1d09`
      de onia-platform — falta mergear a `master` y desplegar; pedido `t_cba4fa74`): el
      cliente que se arrepintió de la baja del asistente y VOLVIÓ A PAGAR no recibía un solo
      aviso, y la pantalla le seguía diciendo que no se renovaba.**

      El add-on del chatbot ganó vigencia, aviso y baja en dos días, todo calcado del PLAN —
      menos una cosa. El plan declara *"activar siempre levanta una baja previa"* y escribe
      `planCanceledAt: null` en **cada** activación (`lib/subscription/activation.ts:47`);
      `activarAddonPagado` no tocaba `canceledAt`, así que la baja del add-on sólo se
      deshacía por **orden del operador** (`addonCanceledAtTrasOrden({darDeBaja:false})`), que
      es el camino que un cliente no recorre: **el que se arrepiente vuelve a pagar.**

      **Lo que costaba, las dos en la dirección cara.** `reclamaSuRenovacion` lee `canceledAt`
      y devolvía `false` para siempre, así que el que volvió a pagar no recibía **ni uno** de
      los cuatro avisos de vencimiento del add-on (D-7/D-3/D-1/vencido, in-app y push) y su
      asistente se apagaba en silencio — el mismo defecto que el plan cerró **un día antes**
      (`8d9e467`) en el cobro hermano. Y `/settings/addon-chatbot` le seguía diciendo *"Pediste
      dar de baja el asistente… no se renueva, sigue contestando hasta el `<fecha vieja>`"*
      sobre un período que ya había vuelto a pagar.

      **Medido antes de tocar nada:** `activarAddonPagado` es la **única** puerta que activa
      el add-on. Las otras dos (`app/api/n8n/callback/subscription-approve` y
      `app/api/webhooks/bcp`) usan `buildPlanActivation`, y `evaluateAutoApproval` las corta
      en su primera línea con *"Plan invalido"* porque `whatsapp_addon` no está en el
      catálogo (`activation.ts:160`). No quedó media familia.

      **Qué entró.** `camposDeActivacionDelAddon` — función pura, paralelo exacto de
      `buildPlanActivation` — y el `upsert` la usa en `create` **y** en `update`. Va `null`
      explícito, no `undefined`: en Prisma `undefined` significa *"no toques esa columna"*,
      que es literalmente el defecto.

      **Validado por mutación, 4 en rojo:** `canceledAt` a `undefined` (5 casos), `create` sin
      el campo (1), el **esquive** de declarar el helper y no cablearlo (2), y el ancla de la
      CLASE quitándole `planCanceledAt: null` al PLAN (1, y nombra cuál de los dos cobros
      dejó de levantarla). Gates verdes sobre el árbol con `master` ya mergeado: `tsc` 0,
      `vitest` 4687, `eslint` 0. Ver `lib/subscription/addon-activar-levanta-la-baja.test.ts`.

      **LA CLASE, para buscarla en otro lado:** cuando dos cobros comparten circuito, la
      asimetría no se busca sólo en *«¿el hermano tiene la capacidad?»* sino en *«¿la DESHACE
      por los mismos caminos?»*. La baja del plan se levanta por **dos** vías —orden del
      operador y pago aprobado— y la del add-on tenía una. Ningún gate podía verlo: no sobra
      ni falta una palabra, el monto sale de la fuente única, no es rubro ni rol ni plan, y la
      columna existe así que `tsc` está contento.

- [x] ✅ **CERRADO el 2026-09-11 (`44fa680`, rama `claude/chatbots-platform-review-0d1d09`
      de onia-platform — falta mergear a `master` y desplegar): la baja del add-on del
      chatbot estaba construida ENTERA y no se podía ordenar desde ningún lado.**

      El add-on ganó su baja ese mismo día (`7057748`): el módulo con la regla del contrato
      (`lib/subscription/baja-del-addon.ts`), sus tests, la columna `canceledAt`, el acuse
      que ve el dueño (`avisoDeBajaDelAddon`, cableado en `AddonChatbotClient`) y el cron que
      lo respeta (`reclamaSuRenovacion`). El `PATCH /api/admin/clinics` acepta
      `darDeBajaAddon` y lo escribe bien.

      **Y ninguna pantalla lo mandaba.** Medido sobre el árbol entero:
      `grep -rn darDeBajaAddon --include=*.ts --include=*.tsx` devolvía **sólo** líneas de
      adentro de la ruta. O sea una capacidad completa, con todos sus tests en verde y `tsc`
      contento, que **no existía para nadie**: al cliente que quería soltar el asistente y
      seguir con el sistema le quedaban las dos salidas que el propio módulo declara malas —
      que el operador lo APAGUE (cobrar y no entregar, contra `terminos.md` §3.3) o no hacer
      nada (cuatro reclamos por período por algo que ya rechazó).

      **La FIRMA que lo delata, y por eso el gate mira al LLAMADOR y no al módulo:**
      `explicarBajaDelAddon` —el texto escrito para que el operador sepa qué va a pasar
      cuando apriete— tenía **cero llamadores**, mientras su gemelo del plan (`explicarBaja`)
      se usaba en `PlansClient`. *Un helper hecho para una pantalla que nadie llama es la
      sombra de una pantalla que no se hizo.*

      **Qué entró.** `/admin/plans` trae la capacidad `addon.whatsapp` (`validUntil`,
      `canceledAt`) y ofrece la baja **sólo si la org la tiene** —el PATCH contesta 422 sin
      ella, y mandarlo a ciegas voltearía también la edición del plan del mismo guardado—; el
      texto del operador sale de `explicarBajaDelAddon`; y la ruta devuelve `addonCanceledAt`
      para que la fecha efectiva la calcule el servidor y el panel la LEA, en vez de
      recalcularla (una segunda escalera de la misma regla se desincroniza).

      **El gate de la CLASE:** `lib/subscription/orden-del-backoffice-tiene-camino.test.ts` —
      *toda orden que el PATCH del backoffice acepta tiene que tener quién la mande*, con el
      sujeto derivado del disco. Es «permiso concedido, CAMINO ausente» un escalón más
      adentro: ahí el sujeto es una pantalla a la que no se llega; acá, una **orden** que la
      API entiende y que ninguna pantalla emite. Validado por mutación en tres direcciones,
      las tres en rojo: quitar el envío · el **ESQUIVE** de clavar el valor
      (`darDeBajaAddon: false` satisface el cruce sin darle al operador ninguna decisión) ·
      la excusa vencida.

      ⚠️ **Dos bugs del propio instrumento, los dos en la dirección cara** (acusar a código
      sano), corregidos antes de creerle: leía el destructuring del **POST** en vez del PATCH
      —el primer `= body;` del archivo— y no entendía el **spread condicional**, así que
      acusaba a la pantalla que SÍ manda la orden.

      🔴 **OJO AL DESPLEGAR, y no lo ve ningún gate de deploy:** la migración
      `20260911170000_addon_canceled_at` sigue **pendiente** en producción (33 de 34
      aplicadas, medido con `docker exec supabase-db psql`). Sin ella este botón tira `P2022`
      **después** de que el `update` de la org ya se aplicó. El swap no corre
      `prisma migrate`: se ve con `node scripts/migraciones_pendientes.mjs`.

- [x] ✅ **CERRADO el 2026-09-11 (`588d2fa`, onia-platform — falta mergear a `master` y
      desplegar): extender un trial era una orden que la API entiende y que el panel no
      ofrecía, así que se hacía por `curl` o tocando la base.**

      El PATCH acepta `trialDays` desde siempre y ninguna pantalla lo mandaba — ya había
      costado: el 2026-09-04 hubo que extenderle el trial a dos orgs QA para que el motor de
      agentes dejara de devolver `agents_runtime_disabled`. Segunda instancia de la clase
      «una orden que la API entiende y que ninguna pantalla emite»; `trialDays` salió de
      `SIN_CAMINO_A_PROPOSITO`, que ahora queda **vacía**.

      **Lo que no era obvio, y por eso el arreglo no es sólo un input:** la prueba no decide
      sola. `derivePlanStatus` pone al contrato por encima —«quien pagó ya es cliente, aunque
      le sobren días de prueba»—, así que sobre una org con `planEnd` los días **se guardan y
      no cambian nada** de lo que esa cuenta puede hacer. Sin decirlo, el operador cierra el
      formulario creyendo que le devolvió el acceso a alguien. Y el conteo arranca **hoy**,
      no se suma a lo que quedaba: un número más chico que los días restantes **acorta** la
      prueba. Las dos cosas se avisan antes de apretar, no después.

      El campo vacío no manda la orden y un valor `<= 0` tampoco: la ruta lo descarta en
      silencio, así que mandarlo era pedir algo que no pasa y ver «Guardado» igual. La fecha
      sale del **mismo** helper en la ruta y en el aviso (`lib/subscription/trial-del-operador.ts`)
      — dos cuentas iguales en dos archivos distintos es como la pantalla termina prometiendo
      una fecha y el servidor escribiendo otra.

      **Validado por mutación: 7 en rojo, base verde.** La 3.ª es el esquive que importa
      —dejar la llamada como guard y borrar el nodo que la pinta—, y sólo la caza el caso que
      exige el **render**, medido sobre el código sin comentarios (si no, la bitácora que
      explica el aviso absuelve al archivo de tenerlo). La 7.ª invierte la prioridad de
      `derivePlanStatus` y cae: sin ese anclaje el aviso podría afirmar una regla que el
      producto ya no aplica.

      Gates: `tsc` 0 · `vitest` 4681 passed · `eslint` 0 errores. **Mirado** renderizado con
      el CSS del build vivo en los tres estados (en prueba / con contrato / valor inválido):
      el aviso entra sin desbordar.
      Se ve con: `npx vitest run lib/subscription/orden-del-backoffice-tiene-camino.test.ts lib/subscription/trial-del-operador.test.ts`

- [x] ✅ **CERRADO el 2026-09-11 (`8d9e467`, onia-platform — falta mergear y desplegar): el
      que pidió la baja perdía la escritura sin un solo aviso previo, y no tenía cómo
      verificar que su baja había quedado registrada.**

      La baja nació el 10-sep (`409ae11`) con sus **dos** mitades bien hechas: la fecha
      efectiva al final del período pago —el contrato concede no renovar, no reembolsa por
      adelantado— y el cron de renovación filtrando `planCanceledAt: null`, que es correcto:
      al que pidió irse no se le cobra cuatro veces más.

      **Pero ese filtro era lo ÚNICO que le avisaba CUÁNDO pierde la escritura**, porque los
      pasos D-7 / D-3 / D-1 / vencido salen de ese mismo cron. Apagar el canal **comercial**
      apagó también el aviso **operativo** que viajaba por ahí.

      Medido sobre el árbol entero: `planCanceledAt` no aparecía en ninguna superficie del
      dueño salvo `avisoSoloLectura`, que pregunta por `isWriteBlocked` y por lo tanto
      aparece recién **después** del corte. `/admin/plans` sí muestra «De baja», pero es
      backoffice SUPERADMIN: lo ve el operador, no el cliente. Consecuencias, las dos mudas:
      el día `planEnd` la cuenta pasa a `canceled` → `read_only` **sin gracia** (la gracia es
      sólo del trial) sin un aviso previo por ningún canal; y «ya lo hablé» y «no se anotó»
      eran indistinguibles desde el panel.

      Ningún gate podía verlo: no sobra ni falta una palabra, el rubro, el rol y el monto
      derivan bien, y la pantalla renderiza perfecto. `baja.test.ts` cubre la FECHA y
      `aviso-solo-lectura.test.ts` cubre que el aviso use la misma función que corta — las
      dos verdes, con razón, sobre este defecto.

      Repone la mitad operativa **sin** reponer la comercial: el banner dice que quedó
      anotada y qué pasa el día del corte, y **no lleva botón de pagar** — ponerlo devolvería
      por la ventana lo que el filtro del cron echó por la puerta.
      `lib/subscription/baja-programada.ts` + `components/AvisoBajaProgramada.tsx`, cableado
      en `app/(dashboard)/layout.tsx`.

      **Validado por mutación: 7 en rojo, base verde.** La 3.ª encontró que el guard del
      llamador **nacía hueco** — el ancla aceptaba `= false && bajaProgramada ?`, así que
      bastaba anteponer `false &&` para dejar el banner muerto con el caso en VERDE. Sólo lo
      delató la mutación, no leerlo. Gates: `tsc` 0 · `vitest` 4636 passed · `lint` 0 errores.
      **Mirado** renderizado con el CSS del build vivo: el icono `event_busy` (ya en la fuente
      subseteada) dibuja el glifo, no la palabra.

- [x] ✅ **CERRADO el 2026-09-11 (`f231555`, onia-platform — falta mergear y desplegar):
      reprogramar una cita podía pisar el turno de otro paciente, y el sistema le mandaba
      al cliente el correo confirmándoselo.**

      Las **dos** puertas que CREAN una cita —el panel (`lib/agenda/crear-cita.ts`) y la
      reserva pública que usa el cliente del cliente— toman el candado del día del
      profesional y rechazan el solapamiento. La que la **MUEVE**,
      `PATCH /api/appointments/[id]`, aceptaba `dateTime` y hacía el `update` pelado: sin
      candado y sin mirar si a esa hora ya hay alguien.

      La recepción arrastra la cita de las 10:00 a las 11:00, a las 11:00 ya hay otro
      paciente, y el sistema guardaba **las dos** — mismo profesional, misma hora. Y no
      queda en un dato feo: `avisarCambioDeCita` le manda acto seguido el correo con la hora
      nueva, así que el producto le **confirma** a un cliente un turno que acaba de
      sobrevender, y los dos se presentan. Toca a los cuatro rubros con agenda, tres de
      ellos de la v1.0.

      **Por qué ningún gate podía verlo, que es la parte reusable:** la pantalla renderiza
      bien, no sobra ni falta una palabra, no es rubro, ni rol, ni plan, y el camino feliz
      funciona. Es la familia de siempre —la mitad sana hace leer la familia como cubierta—:
      con la CREACIÓN blindada, nadie volvió a preguntar por la EDICIÓN. **La firma que lo
      delata sin leer una línea de producto:** `hasAppointmentConflict` ya traía
      `excludeAppointmentId` —un parámetro que sólo sirve para reprogramar, porque la propia
      cita siempre choca consigo misma— y tenía **cero llamadores**. Un parámetro escrito
      para un caso que nunca se implementó.

      El chequeo y la escritura van en la **misma** transacción y detrás del **mismo**
      candado que el alta (`lib/agenda/reprogramar-cita.ts`): preguntar «¿está libre?» y
      guardar en dos pasos sueltos deja la ventana en la que dos recepciones mueven dos
      citas a la misma hora y las dos leen «libre». Un cambio que no toca la hora —una nota,
      un estado, o re-mandar la misma hora— no paga el candado. Y el rechazo sale con el
      **mismo 409 y el mismo texto** que da el alta: quien mueve una cita necesita saber que
      el turno está tomado, no leer «error al actualizar» y volver a intentarlo.

      **Prueba:** `lib/agenda/reprogramar-cita.test.ts` (11 casos), en ROJO primero por el
      motivo correcto —«`app/api/appointments/[id]/route.ts` hace el update pelado»— y
      validado por mutación en **tres** direcciones, cada una en su caso: el **esquive** de
      llamar al helper con `null` en vez de la reprogramación derivada, el corte arrancado
      del helper, y el detector ciego (se queda sin sujetos). Los sujetos se derivan del
      **disco** —toda ruta que escriba `dateTime` en el `data` de un `update` de cita—, así
      que una ruta nueva nace cubierta. Suite `4582 passed`, `tsc` y `eslint` en 0, y el
      árbol publicado es byte a byte el que midieron los gates: `git rev-parse HEAD^{tree}`
      da el mismo valor en las dos máquinas.

      ⚠️ **El detector nació con un falso positivo en la dirección cara** —la que manda a
      romper lo que funciona—: recortaba el bloque del `update` «hasta el próximo `});`»,
      que depende de la indentación y se pasaba de largo, así que acusaba al cron de
      recordatorios (que sólo marca `whatsapp24hSentAt`) por un `dateTime:` que vivía 40
      líneas más abajo. Se arregló recortando con **paréntesis balanceados** y mirando sólo
      dentro del `data:`, y quedó anclado con su caso: el cron y el portal público **tocan**
      una cita sin moverle la hora y no son sujetos de este gate.

- [x] ✅ **CERRADO el 2026-09-11 (`e887e8e`, onia-platform — falta mergear y desplegar): el
      add-on del chatbot avisaba por el PANEL y no por correo.**

      El plan avisa por TRES canales (correo, in-app, push) y el add-on tenía DOS. Media
      familia cubierta se lee como familia cubierta — que es exactamente cómo nació el
      agujero que `53227ab` cerró el día anterior.

      **El motivo por el que quedó a medias era REAL y sigue en pie:** el correo del plan
      promete *«pasa a solo lectura (tus datos quedan intactos y podés mirarlos y
      exportarlos)»*, y eso es **falso** para el add-on — vencerlo no toca un dato ni corta
      una escritura: apaga el asistente. **Lo correcto no era callarse el canal, era
      escribir la plantilla que le corresponde:** el aviso in-app sólo lo ve quien ENTRA al
      panel, y el que está por perder el asistente puede no entrar en una semana.

      Lo que trae: `sendAddonReminderEmail` nombra los **dos** canales que se apagan en los
      cuatro pasos —`app/api/chatbot-knowledge/published/route.ts` corta con
      `isWhatsAppAddonActive` ANTES de leer la fila, así que el chat de la web y el WhatsApp
      mueren juntos y decir uno solo le hace creer al dueño que el otro sigue— y aclara que
      el resto del sistema no se toca. `terminoDelAddon` cotiza con `getWhatsappAddonAmount`, la **misma** función con
      la que `validateWhatsappAddonPaymentDetails` acepta el comprobante: si el correo
      dijera otra cosa, el dueño transfiere lo que el correo dice y el cobro se rechaza por
      «Monto inválido». Sin ciclo conocido NO cotiza, y el `throw` de esa función se degrada
      a «no se sabe» porque una excepción ahí mataría también el aviso del PLAN de esa org.
      La CTA va a `/settings/addon-chatbot`: `/checkout` excluye a propósito los pagos del
      add-on. El cron queda con **un** recorrido —correo garantizado, panel mejor-esfuerzo
      para los dos conceptos—; antes el panel podía tirar abajo un aviso del add-on que el
      correo ya había entregado.

      **Dos defectos de INSTRUMENTO aparecieron escribiéndolo, los dos en la dirección
      cara** (mandan a romper lo que funciona): `copysQuePrometen` leía los COMENTARIOS y
      atribuía la promesa al último `function` de arriba, así que la bitácora que **cita**
      «solo lectura» para explicar por qué el add-on no la reusa se la cargaba a
      `sendRenewalReminderEmail` — obedecer ese rojo era borrar el registro de por qué
      existe la plantilla nueva. Y el recorte del caso del plan en
      `email-idioma-del-rubro.test.ts` cortaba en la próxima función exportada, así que se
      tragaba el bloque del add-on entero y un sustantivo escrito allá habría salido con el
      mensaje del plan.

      **Prueba:** gate `lib/subscription/correo-del-addon.test.ts` (16 casos), en ROJO
      primero (15 casos por el motivo correcto) y validado por mutación en **seis**
      direcciones, cada una cayendo en SU caso y ninguna tapada por otra: el cron deja de
      mandarlo (1 rojo), **esquive** mandándolo con la CTA del plan (1), el copy reusa la
      promesa del plan (6 — incluido el gate del comentario, que prueba que arreglarlo no lo
      dejó ciego), cotiza siempre el mensual (1), inventa monto sin ciclo (1), y nombra un
      solo canal (4). Suite `4571 passed`, `tsc` y `eslint` en 0. Y el árbol publicado es
      byte a byte el que midieron los gates: `git rev-parse HEAD^{tree}` da lo mismo en las
      dos máquinas — entregar desde el nodo de casa con `git am` sobre un gemelo atrasado
      publica un árbol que nadie midió.

      **No muerde hoy:** medido en producción, **cero** pagos de add-on aprobados y las dos
      capacidades vivas (`clinica-sergio-p2ljs`, `onia-interna`) son otorgamientos con
      `validUntil` NULL, que no vencen.

- [x] ✅ **CERRADO el 2026-09-11 — la migración del `concepto` YA ESTÁ APLICADA en
      producción.** Lo pedía este mismo ítem
      (`prisma/migrations/20260911120000_renewal_reminder_concepto/migration.sql`,
      `onia-platform`) y quedó escrito antes de medirlo.

      **Medido, no supuesto** — `docker exec supabase-db psql -U postgres -d postgres -tAc
      "select column_name from information_schema.columns where
      table_name='onia_renewal_reminder_sends'"` devuelve
      `concepto createdAt id organizationId sentOk step venceEl`, y el conteo cierra:
      33 filas en `_prisma_migrations` contra 32 carpetas en `prisma/migrations`.

      ⚠️ **Lo que sí era falso y se corrige acá, porque manda al revés:** este ítem decía
      que la migración *«va en el mismo movimiento que el swap»*. **No es cierto** — el
      publicador no aplica migraciones (`grep -ciE 'migrate|prisma'
      /opt/onia-platform/_deploy/publicar.sh` da `0`, medido por `onia-cola` el mismo día).
      Un swap **no** cierra esta clase de brecha. La próxima migración hay que aplicarla a
      mano o el ítem espera para siempre a un movimiento que no la incluye.

- [x] ✅ **CERRADO el 2026-09-11 (`f46a049`, onia-platform): el aviso del add-on
      amenazaba con apagar algo que no se apaga.**

      La mitad que **AVISA** y la que **APLICA** no hacían la misma pregunta. El cron
      (`app/api/cron/renewal-reminders`) armaba el vencimiento del add-on con
      `entitlements[0].validUntil` **pelado**, y la habilitación
      (`isWhatsAppAddonActive`) es `organizations.whatsappAddon || capacidad vigente`.
      El booleano viejo es un otorgamiento **a mano y sin fecha** — lo dice el propio
      `addon-vigencia.ts`, que por eso no vuelve a encenderlo al cobrar. Para una org que
      ya lo tiene en `true`, ese `||` sostiene el add-on para siempre y el cron igual le
      mandaba los cuatro pasos (D-7/D-3/D-1/vencido) por in-app, push y correo diciéndole
      que el `<fecha>` su asistente deja de contestar. **No deja.**

      **No es hipotético:** medido contra `supabase-db`, de las cuatro organizaciones de
      producción `clinica-sergio-p2ljs` —una clínica **real**, no QA— tiene la columna en
      `t`. El día que pague el add-on, la aprobación le escribe `validUntil` y desde ahí
      recibe la amenaza mes a mes, por tres canales, sobre un corte que el producto no va
      a hacer. Una amenaza que no se cumple no es un detalle de copy: es lo que hace que
      el cliente deje de creerle al aviso siguiente, que sí es cierto.

      **Por qué ningún gate podía verlo, que es la parte reusable:** no sobra ni falta una
      palabra (el copy es correcto cuando el add-on **sí** vence), el monto sale de la
      fuente única, el rol filtra bien y el rubro no entra.
      `addon-whatsapp-un-solo-criterio` obliga a preguntar «¿está activo?» con el helper
      canónico y estaba **verde con razón**: el cron no pregunta eso, pregunta «¿cuándo
      termina?» — y esa pregunta no tenía dueño. Encima
      `onia-platform-chatbot/app/api/cron/renewal-reminders/route.ts` era el único
      archivo de su carpeta: cero tests.

      **La regla:** un aviso que anuncia un EFECTO deriva su fecha de las **mismas fuentes
      que producen ese efecto**. Una fuente sin fecha no es una fecha más: es la ausencia
      de vencimiento, y gana.

      Lo que trae: `vencimientoDelAddon` en `lib/subscription/addon-vigencia.ts` (la
      pregunta con nombre, no una condición suelta en el cron); el cron le pide la columna
      a la base y decide con el helper; y la excusa **nombrada** en
      `addon-whatsapp-un-solo-criterio`, que ese gate re-mide en cada corrida.

      Validado por mutación, **las 7 en rojo** y restaurado en verde: revertir el arreglo,
      el esquive de llamar al helper y tirar el resultado, romper el helper en sus **dos**
      direcciones, sacar la columna del `select`, `false &&` en la guarda, y romper la
      premisa. ⚠️ **La última pasó en VERDE en la primera versión**: el corte del cuerpo de
      `isWhatsAppAddonActive` llegaba hasta el final del archivo y lo absolvía su hermano
      `checkWhatsAppAddon`, que tiene el **mismo** `org.whatsappAddon ||` dos líneas abajo.

      **Listo =** `npx vitest run lib/subscription/addon-que-no-vence-no-avisa.test.ts`
      (8/8). Gates sobre el árbol: tsc 0, vitest 4590/4597 (7 skipped), eslint 0 errores.
      **Commiteado y pusheado; todavía NO desplegado.**

- [x] ✅ **CERRADO el 2026-09-11 (`53227ab` + `7b0a154`, onia-platform): el add-on del
      chatbot podía vencer y nadie avisaba que iba a vencer.**

      El plan avisa **cuatro veces** (D-7/D-3/D-1/vencido) por **tres** canales; el add-on
      —que desde el día anterior tiene vigencia real en
      `organization_entitlements.validUntil` (`5011003`)— no avisaba **ninguna**:
      `grep -ci addon lib/subscription/renewal-reminders.ts` daba **0**. Sin recordatorio,
      el día que haya un add-on pago el asistente del cliente **se apaga sin una palabra**
      — `app/api/chatbot-knowledge/published/route.ts` corta con `isWhatsAppAddonActive` antes de leer la
      fila, así que deja de contestar el chat de la web **y** el WhatsApp a la vez.

      **Por qué ningún gate podía verlo, y es la parte reusable:** no sobra ni falta una
      palabra, el monto sale de la fuente única, el rol filtra bien y el rubro no entra. Lo
      que estaba mal era una **asimetría entre dos cobros hermanos**, y la mitad sana —la
      del plan— es justo lo que la hacía parecer cubierta.

      **No se copió la escalera al lado**, que era el atajo que la propia cola advertía:
      una lista paralela se desincroniza el día que se toque un umbral y deja una mitad con
      el defecto. El recorrido es **uno** y el concepto es un **dato**
      (`lib/subscription/vencimientos.ts`): un concepto nuevo entra agregando una fila a
      `CONCEPTOS_QUE_VENCEN`, y el gate de cobertura lo obliga a declarar su copy **y** a
      que el cron le arme su reloj.

      Lo que trae el arreglo: `concepto` en la clave del reclamo (migración aditiva, default
      `plan`) — sin él, un plan y un add-on que vencen el **mismo día** comparten
      `(org, venceEl, step)` y el segundo aviso se pierde contado como duplicado; aviso
      propio que nombra al chatbot y **no** promete «solo lectura»; destino
      `/settings/addon-chatbot` porque `/checkout` excluye a propósito los pagos del add-on;
      `tag` propio, o el push del add-on reemplaza al del plan en el teléfono; el medio de
      pago sigue saliendo de `lib/checkout/textos.ts` (`enElPanelDelAddon`); y el ciclo y la
      «pelota» (comprobante en revisión) derivados **por concepto** de la tabla compartida.

      **Dos gates del plan cambiaron de ANCLA conservando su propiedad**, y eso se dice
      porque es el movimiento que más fácil se hace mal: la garantía de que un add-on
      mensual no le cambie el ciclo a un plan anual ya no es un filtro escondido en el
      `where` (el cron necesita los dos conceptos) sino la **partición**; y el corte por
      `enRevision` vive ahora en `avisosDeHoy`, del que el reclamo está excluido por
      construcción. `SOLO_PAGOS_DEL_PLAN` se borró en el mismo movimiento: sin consumidor
      era una constante muerta, y una constante muerta vuelve el día que alguien la cablea,
      **ya aprobada porque «ya estaba»**.

      Validado por **mutación en 9 direcciones** y cada una cae en SU caso: el add-on fuera
      del recorrido, su texto copiado del plan, su tag pisado con el del plan, los envíos
      previos sin filtrar por concepto, el esquive de prometer solo lectura, el cron sin
      leer el concepto de `priorSends`, la clave del reclamo sin concepto, el cron sin armar
      el reloj del add-on, y la guarda sin P2022. Gates: `tsc` 0 · **4552** tests · `eslint`
      0 errores.

      ⚠️ **Commiteado y pusheado a la rama, NO desplegado ni migrado**: el swap y la
      migración los hace `onia-cola` cuando Sergio Urcullo aprueba el pedido de deploy. Los
      dos huecos que quedan van arriba como ítems propios (el correo, y la migración).

- [x] ✅ **CERRADO el 2026-09-11 (`54c987a`, onia-platform): el paciente confirmaba su cita, no
      se guardaba, y la pantalla se veía IGUAL que antes de apretar.**

      `/cita` es la pantalla del cliente **del** cliente: llega el recordatorio por WhatsApp o
      correo, abre el enlace en el celular y aprieta «Sí, voy a asistir». La server action
      (`app/cita/acciones.ts`) tiene tres vueltas sin `hecho=1`, y **dos las explica la pantalla
      sola** porque el estado de la cita cambió: enlace vencido → «Enlace expirado», cita ya
      cerrada → «Esta cita ya está cerrada».

      **La tercera no.** Cuando corta el limitador (`respuestaCitaLimiter`, 5/min **por token**,
      medido en `lib/rate-limit.ts:80`) la cita queda **intacta**, así que la pantalla cae al
      render final y repinta «¿Confirmás tu asistencia?» con el mismo botón — idéntica, byte por
      byte, a la de antes de apretar. Quien responde no tiene forma de distinguir *«no se
      guardó»* de *«todavía no apreté»*, y el negocio tampoco se entera.

      **Por qué ningún gate podía verlo, y es la parte reusable:** la ruta responde 200, la
      pantalla renderiza perfecta, no sobra ni falta una palabra, el texto ya es neutro entre
      rubros y el camino feliz funciona. Los dos gates de camino de fallo que existen no la
      alcanzan **por partida doble**: `app/cita` no está bajo `app/(dashboard)` ni bajo
      `app/(public)` —sus dos raíces— y además el sujeto de los dos es `fetch(`, y esta pantalla
      escribe por **server action**. Enumerado el universo: `app/` tiene **15 árboles** y los
      gates cubren **2**. Los huérfanos con escritura son justo el embudo del cliente nuevo —
      `(auth)` (entrar), `onboarding` (configurar), `checkout` (pagar)— y los seis `fetch` de
      esos tres **están sanos por diligencia, no por construcción**: nadie los custodia.

      **Arreglo:** la rama que no pudo escribir se **marca** (`sinGuardar=1`) y la pantalla la
      pinta, conservando el botón, que es la salida. **No se tocó el limitador**: el tope está
      bien, lo que faltaba era decirlo.

      Gate `app/cita/respuesta-que-no-se-guardo.test.ts`, validado por mutación en **cuatro**
      direcciones y cada una cae en SU caso: sin marca en la acción (1), sin el aviso en la
      pantalla (2), el esquive de pintarlo **siempre** (2) y el de pintar un aviso que no avisa
      (1). El nombre del parámetro se **deriva** de la pantalla —un rename lo sigue en vez de dar
      rojo falso— y se mide sobre el código **sin comentarios**, para que el gate no se absuelva
      con su propia bitácora. Gates: `tsc` 0 · **4486** tests · `eslint` 0 errores.

      ⚠️ **Commiteado y pusheado a la rama, NO desplegado**: el swap lo hace `onia-cola` cuando
      Sergio Urcullo aprueba el pedido de deploy de plataforma.

      **Lo que queda abierto y se anota con su nombre:** el hueco de cobertura de arriba. Los 3
      árboles huérfanos con escritura están sanos hoy, así que el día que alguien agregue un
      `fetch` ahí entra **pre-aprobado**. Va abajo como ítem propio.

- [x] ✅ **CERRADO el 2026-09-11 (`6527b84`, onia-platform): la promesa de «solo lectura,
      podés mirar y exportar» que el sistema le manda al cliente que PAGA no la verificaba
      nadie.**

      El gate `app/components/trial-vencido-cumple-la-promesa.test.ts` nació el 10-sep con el
      sujeto **enumerado a mano**: dos casos sobre `sendTrialDripEmail`. Esa misma noche entró
      `sendRenewalReminderEmail` (`26212f5`) haciéndole al que ya paga *la misma* promesa
      —«pasa a solo lectura (tus datos quedan intactos y podés mirarlos y exportarlos)»— y no
      era sujeto de nadie: ni de ese gate ni de los de copy, precio, rubro o rol. **La mitad
      sin vigilar volvió a ser la del que paga.**

      **Medido ANTES de tocar nada, y por eso esto es vigilancia y no un arreglo:** los cinco
      endpoints de exportación son todos `GET` (ninguno lo corta `checkPlanExpiry`), el `POST`
      que registra el pago **no** corta por vencimiento —o sea renovar funciona vencido— y
      ninguna org de producción tiene `planEnd` (las 3 medidas con `psql`: dos en trial
      `professional`, una `free`). La promesa hoy **se cumple**; lo que faltaba era que algo
      se pusiera rojo el día que deje de cumplirse.

      El arreglo no fue agregarle dos casos: el sujeto ahora **se deriva del disco**. Cada
      aparición de la promesa en `lib/email.ts` se atribuye a la función que la escribe
      (`trialDripCopy`, `renewalCopy`) y esa función tiene que estar declarada, **re-medido en
      las dos direcciones** — no puede faltar ninguna ni sobrar una. Un copy nuevo que prometa
      la lectura nace vigilado.

      Y se fija lo que hace CIERTA la promesa para el que pagó: a él **no** se le monta el
      modal de pantalla completa, porque `getTrialStatus` devuelve `noTrial` en cuanto la org
      tiene `planEnd`. Hoy eso lo sostiene una línea escrita para otra cosa (separar el trial
      del contrato pago), así que nada avisaría si alguien uniformara el corte. Se mide lo que
      la función **devuelve**, no su fuente: un grep pasaría igual.

      **Validado por mutación en 5 direcciones, las 5 en rojo:** sacar la fila declarada,
      declarar una fila fantasma, borrar la promesa de los dos copys del pago, uniformar
      `getTrialStatus` para que bloquee también al que pagó, y el esquive de `isBlocked`
      siempre `false`. Gates: `tsc` 0 · **4462** tests · `lint` 0.

      ⚠️ **Commiteado y pusheado, NO desplegado** — es un gate, así que no cambia nada de lo
      que el cliente ve; entra a producción con el próximo swap.


El orden sale de `ONIA_CATALOGO_DE_VENTA.md` §8 *«Lo que hay que cerrar»*, que ya estaba escrito
y sin operar. Acá se opera, con verificación por ítem.

> **Lote del 2026-09-10 (pedido de Sergio Urcullo: "arregla los 4… ve dejando en la cola las
> tareas y vas una por una").** Los cuatro salen del mapa del panel del chatbot medido ese día
> (5 lectores de código + 4 capturas de producción). Orden de ejecución acordado: recarga →
> cuentas → bot repetido (vive en `cola/chatbot.md`) → UI.

- [x] 🔴 **CERRADO el 2026-09-11 (`c5e422d`, **commiteado y pusheado, NO en `master` todavía** —
      medido con `git merge-base --is-ancestor c5e422d origin/master` → NO; lo mergea el
      integrador): el cliente pagaba y NADIE le decía cómo terminó.**

      Sale de seguir auditando `26212f5` (el ciclo de renovación por QR, que ya dio cinco
      arreglos). El circuito le avisa al dueño **cuatro veces** que su plan va a vencer
      (D-7/D-3/D-1/vencido) y por **tres canales** (correo, aviso in-app y push), y después
      enmudece justo en el desenlace: las tres puertas que resuelven un pago —el `PATCH` del
      superadmin, el callback de n8n y el webhook del BCP— escribían el resultado en la base sin
      contárselo a nadie.

      **El caso caro es el RECHAZO.** `adminNotes` es el motivo, y ya es texto de cliente
      (`/settings` lo pinta como *«Comprobante observado: …»*), pero sólo lo ve el que vuelve a
      entrar a esa pantalla por su cuenta. El que transfirió y espera tiene la cuenta en solo
      lectura, cree que pagó, y nadie le dice que su comprobante no se pudo validar ni qué
      corregir.

      **Por qué ningún gate podía verlo:** no sobra ni falta una palabra, no es un rubro, ni un
      plan, ni un rol; la pantalla renderiza bien, el camino feliz funciona, y las tres puertas
      tienen idempotencia y lock impecables (`claimPendingPayment`, `lockOrganizationPlan`). **Un
      aviso AUSENTE no se ve leyendo lo que hay** — sólo derivando quién debería hablar y
      preguntándole a cada uno.

      **Arreglado en la CLASE, no en la instancia.** El gate
      (`lib/subscription/pago-resuelto-avisa.test.ts`) deriva sus sujetos del **disco**: las
      rutas que llaman a `claimPendingPayment`, que es la única transición `PENDING → resuelto`.
      Una cuarta puerta nace cubierta y hay que excusarla a mano, a la vista. Quién lo recibe
      sale de `rolesQueAbren("/settings")`, **no** de una lista de roles al lado del envío —
      copiarla es exactamente como nació el defecto que `aviso-alcanzable-por-rol.ts` cierra; el
      in-app y el push usan el MISMO criterio, así que nadie recibe un enlace que le rebote mudo.

      **Lo que se midió ANTES de escribir, y descartó dos falsos positivos:**
      · `app/api/subscription-payment/bcp-qr/route.ts` **no** es sujeto — está apagado (`503` sin credenciales del banco) y su
      fila la concilia el webhook, no una revisión humana. · En el callback de n8n, *«no
      aprobado»* vuelve a `PENDING` —sigue esperando revisión— y ahí **no hay desenlace que
      contar**: avisar sería prometer un final que no ocurrió. · Mi primer barrido dio «cero
      avisos» también en la ruta que **sí** avisa (`/api/subscription-payment` manda correo a
      `ADMIN_EMAIL`): el `grep` no cubría `emailClient.emails.send`. Un `grep` sirve para
      descartar, nunca para confirmar.

      **Dos trampas del propio arreglo:** el `planEnd` se captura de la activación y **no** se
      relee de la org (releerlo puede traer el de otro pago concurrente); y `fechaLegibleBolivia`
      vive en `lib/` y no en el `route.ts` —que no puede exportar helpers—, porque el contenedor
      corre con `TZ` vacío y sin `timeZone` la fecha sale 4 h adelantada y de noche cambia el día.

      **Validado por mutación en 5 direcciones**, todas en rojo y restaurado en 143/143: sacar el
      aviso de una puerta (el gate la **nombra**) · el **esquive** (importar y no llamar) · sacar
      `timeZone` · inventar la causa de un rechazo sin motivo · cegar el detector. **Gates:**
      `tsc` 0 · `vitest` 4457 · `eslint` 0 errores — corridos **en el VPS**, sobre el árbol que se
      publica, no sólo en casa.

- [x] 🔴 **CERRADO el 2026-09-11 (`63de4ff`, **ya en `master`** — medido el 2026-09-11 01:05 La Paz
      con `git merge-base --is-ancestor 63de4ff origin/master` → SÍ): el recordatorio de
      renovación le cotizaba a TODOS el precio MENSUAL, y el que paga anual iba a transferir
      Bs 1.500 por una renovación de Bs 15.000.**

      Sale de auditar `26212f5`, que entró a `master` esa misma madrugada (el ciclo de
      renovación por QR). `organizations` **no guarda el ciclo** —sólo `plan` y `planEnd`—; el
      ciclo vive en el último pago aprobado (`subscription_payments.cycle`). El cron armaba el
      monto con `DEFAULT_PLAN_AMOUNTS[plan].monthly` y el correo lo pegaba dentro de una
      instrucción de pago: *«pagás por QR o transferencia (Bs 1.500,00)»*. El semanal leía
      Bs 320 por una renovación de Bs 89, y el segundo párrafo afirmaba *«El mes nuevo se suma
      al final»* a quien compró un año.

      🔴 **No era cosmético: la mitad que MUESTRA y la que APLICA leían fuentes distintas.**
      `evaluateAutoApproval` (`lib/subscription/activation.ts:163`) compara contra
      `getPlanAmount(plan, cycle)` y rechaza con *«Monto declarado inválido»* si difiere más de
      0,01. El cliente que hacía **exactamente lo que el correo le decía** pagaba de menos, su
      pago no se aprobaba solo, y su plan no se renovaba. De paso, `DEFAULT_PLAN_AMOUNTS`
      directo se saltea el override por env que `getPlanAmount` sí respeta.

      **Por qué ningún gate podía verlo:** el número sale de la fuente única (así que
      `monto-de-plan-a-mano.test.ts` estaba verde), el plan sale de `nombreDePlan` (así que
      `nombre-de-plan-a-mano.test.ts` estaba verde), no sobra ninguna palabra prohibida y no hay
      rubro de por medio. **El monto es REAL: lo que estaba mal es de qué CICLO es.** La
      interfaz ya documentaba `montoLabel` como *«monto del ciclo»* — el único llamador violaba
      el contrato de su propio tipo.

      **El arreglo:** `terminoDeRenovacion(plan, cycle)` en
      `lib/subscription/renewal-reminders.ts` cotiza con `getPlanAmount` —el MISMO que valida
      el cobro— y nombra el plazo por el ciclo. Devuelve **`null` cuando no se sabe** (org con
      el plan otorgado a mano, sin pago aprobado) y ahí el correo **no cotiza ningún número**:
      mismo patrón que `buscarNegocio()` y `horario-que-se-dice` — retorno ambiguo separado y
      promesa CONDICIONADA, no borrada. `montoLabel` pasa a `string | null` a propósito, para
      que `tsc` no deje caer a otro llamador en el mensual sin decidirlo.

      **Prueba:** `lib/subscription/monto-del-ciclo-que-paga.test.ts`, sujetos derivados del
      catálogo (un plan o un ciclo nuevo nace vigilado) y **con el caso que mira al LLAMADOR** —
      sin él el módulo queda impecable y el cron sigue con su atajo. Validado por mutación en
      4 direcciones (ignorar el ciclo · default silencioso · plazo fijo en «mes» · el cron
      volviendo a la tabla cruda): las 4 en rojo con su línea `Tests N failed` y `exit 1`.
      Gates sobre el árbol real: `tsc` 0 · `vitest` **4413 pasados** · `eslint` 0 errores ·
      `check:onia-core` OK (ese último no lo corre el integrador y sí el CI).

      ⚠️ **Todavía no lo ve nadie:** está en `claude/chatbots-platform-review-0d1d09`, **no**
      en `master`. `git merge-base --is-ancestor 63de4ff origin/master` da falso, así que
      **no** se le escribió `DEPLOY PEDIDO` a `t_5511da55`: el integrador lo mergea en su
      vuelta y ahí recién la promesa del pedido sería cierta.

      **Hoy no hay víctima, y por eso convenía arreglarlo hoy:** producción tiene 4 orgs, las 4
      con `planEnd` NULL y **cero pagos aprobados** (contado el 2026-09-11 en `supabase-db`).
      El cron evalúa cero orgs. Este código corre por primera vez **el día que paga el primer
      cliente**, que es justo el objetivo de la v1.0.

- [x] 🔴 **CERRADO el 2026-09-11 (`859fd05`): el aviso de que TU plan vence lo apagaba el
      interruptor de los correos a TUS clientes — o sea el ítem de acá abajo nació con el
      agujero adentro.**

      `emailNotifications` gobierna lo que el NEGOCIO le manda a SUS clientes. Lo dice el
      schema (*«controla si la clínica envía emails automáticos a pacientes»*,
      `schema.prisma:35`) y lo dice el interruptor de `/settings` que lo apaga:
      **«Envía confirmaciones y recordatorios por email al agendar citas»** — ni una palabra
      sobre su cuenta, su plan ni su factura.

      **Dos crons lo usaban para decidir si Onia le habla al DUEÑO sobre SU cuenta**
      (`onia-platform-chatbot/app/api/cron/renewal-reminders/route.ts` y su hermano
      `onia-platform-chatbot/app/api/cron/trial-drip/route.ts`), los dos en el `where`. Así
      que un dueño que apagara ese toggle —un clic, pensando en sus pacientes— **dejaba de
      enterarse de que su plan vence y de que la cuenta pasa a solo lectura**. Y como el aviso
      in-app y el push cuelgan de la misma query, **los tres canales se apagaban juntos**. El
      drip encima lo llamaba *«opt-out»*, que es exactamente el malentendido: el opt-out real
      de la relación comercial es `planCanceledAt`, que los dos ya respetaban.

      **Hoy no muerde a nadie, y por eso mismo importa:** las 4 orgs de producción lo tienen
      en `true` (medido en `supabase-db`, no heredado), así que es un **botón cargado** — el
      día que alguien lo toque, el defecto entra ya aprobado porque nadie audita un toggle que
      «ya estaba». Misma familia que la entrada de lista blanca que ningún sujeto usa.

      **Por qué ningún gate podía verlo:** no sobra ni falta una palabra, el rubro deriva bien,
      el monto sale de la fuente única y la fecha ya lleva la zona del negocio — los cuatro
      ejes que este carril barrió estaban limpios. **El defecto vive en el par (lo que el
      interruptor DICE que apaga, lo que realmente apaga)**, que es un dato correcto para su
      propósito reusado para otro.

      **Gate:** `lib/platform/aviso-al-dueno-no-lo-apaga-el-cliente.test.ts`, con el sujeto
      derivado en las **dos** direcciones —las funciones que escriben al dueño salen de
      `lib/email.ts` (las que hacen `to: [data.adminEmail]`) y sus llamadores del disco—, así
      un cron nuevo que le escriba al dueño **nace cubierto**. Medido sobre el fuente sin
      comentarios. Validado **por mutación en 4 direcciones**: reponer el filtro en cada cron ·
      el **esquive** (`{ equals: true }`, otra forma del mismo filtro) · detector siempre-vacío.
      Las 4 `exit 1`, cada una verificada de que entró; base y restaurado `exit 0`.

      ⚠️ **Y `master` estaba ROJO por su cuenta**, desde el merge del cron nuevo y antes de
      tocar nada — verificado sobre `origin/master` **puro**, en un worktree aparte. Lo cazaron
      dos gates de cobertura de este carril y nadie los había atendido: la ruta sin clasificar
      (`api-route-registry`) y el remitente sin vigilar (`email-idioma-del-rubro`). Los dos
      cerrados en este commit; la excusa del remitente **re-mide su motivo** sobre la plantilla
      (hoy no nombra a la gente del negocio), también validada por mutación.

      **Gates:** `npx tsc --noEmit` 0 · `npx vitest run` **4407 pasan / 357 archivos** ·
      `npx eslint .` 0 errores. Corridos **dos veces**: en casa y en el VPS sobre el árbol
      exacto que se publicó (`git rev-parse HEAD^{tree}` idéntico en las dos máquinas).

      🔴 **Commiteado y pusheado a la rama del carril, NO desplegado ni mergeado a `master`.**

- [x] 🔴 **CERRADO el 2026-09-11 (~01:00 UTC): la recurrencia de los cobros por QR — el
      cliente PAGO no recibía NI UN aviso antes del corte.** Medido antes de construir: todo
      lo existente (AvisoSoloLectura, 403, drip) dispara DESPUÉS del vencimiento o es del
      trial; con pago por QR manual no hay débito automático, así que la recurrencia ES el
      recordatorio + la fricción mínima. Las dos mitades que ya existían: `/checkout` acepta
      renovar con plan activo, y `extendPlanEnd` arranca de max(planEnd, hoy) — pagar antes no
      quita días. Lo construido (commit `26212f54` en master de onia-platform, deployado):
      cron diario `/api/cron/renewal-reminders` (D-7/D-3/D-1/vencido; correo + campanita +
      push; UNA vez POR CICLO — la clave única lleva el planEnd del ciclo, renovar abre los
      pasos del ciclo nuevo solos), tabla `onia_renewal_reminder_sends` (RLS, migración
      aplicada en prod con registro), plantilla `sendRenewalReminderEmail` (sin datos
      bancarios a propósito), script `onia-platform/scripts/cron/run-onia-renewal-reminders.sh`
      instalado en el crontab del VPS (08:05 La Paz). **PROBADO E2E en prod**: org QA con
      vencimiento a 3 días → corrida 1 `sent:1 paso 3` (correo real entregado a
      sergio@onia.com.bo), corrida 2 `sent:0` (idempotencia); revertido después. Tests 6/6
      (`onia-platform/lib/subscription/renewal-reminders.test.ts`) + suite subscription
      172/172. **La otra mitad del futuro**: cuando el banco entregue las credenciales BCP
      (trámite de Sergio Urcullo), `/checkout` ya muestra QR dinámico con aprobación
      automática por callback — el ciclo queda 100% sin humanos.

- [x] 🟡 **CERRADO el 2026-09-11: precios de venta con referencia en dólares** (pedido de
      Sergio Urcullo). `TIPO_CAMBIO_REFERENCIA_BS_POR_USD = 11,37` en
      `onia-platform/lib/pricing.ts` (única fuente, informativo — se cobra SIEMPRE en Bs; NO
      confundir con el TCO del BCB de importadora) + `formatUsdAprox()`, pintado en las
      tarjetas de plan del checkout, el "Monto a pagar"/QR, el add-on chatbot y PlanClient.

- [ ] 🔴 **T-plata — dos bloqueos que solo Sergio Urcullo puede pagar** (detectados el
      10-sep midiendo el precio de la recarga; avisados por el tablero):
      (1) **OpenAI sin crédito desde el 9-sep ~04-06 UTC** (medido en LiteLLM_SpendLogs: 38
      failures 429): la rama off-guion del bot cae al texto de respaldo (no muda, pero no
      reformula) y **Hermes está caído entero** (misma cuenta). Recargar en
      platform.openai.com. El gasto del bot es ruido: USD 0,00085 en toda su historia.
      (2) **Método de pago en Meta antes del 1-oct-2026**: la hoja oficial "effective
      October 1, 2026" ya salió — service USD 0,0113/mensaje (Rest of Latin America, cubre
      Bolivia) tras 1.000 mensajes de servicio gratis/mes por número; **sin tarjeta cargada
      Meta DEJA DE ENTREGAR desde el mensaje 1.001** — bot mudo a mitad de mes. Vale para
      nuestro número y para cada cliente con número propio (anotarlo en el onboarding del
      canal WhatsApp). Fundamento completo en el comentario de RECARGA_CONVERSACIONES de
      `onia-platform/lib/pricing.ts` y memoria meta-whatsapp-clientes actualizada.
      **LISTO =** crédito OpenAI >0 (el off-guion vuelve a reformular, Hermes contesta) y
      método de pago visible en el billing de Meta.

- [x] 🔴 **CERRADO el 2026-09-11: el gasto de Hermes bajado ~10x** (pedido de Sergio
      Urcullo: "no puedo permitirme gastar mucho"). Atribuido ANTES de cortar (regla
      hermes-gasto-bajar-no-subir): 98% del gasto era gpt-5-mini con ~100K tokens de prompt
      POR LLAMADA, y el 93% del prompt era la MEMORIA de Hermes inflada a 500 KB — los loops del sistema (`scripts/loops/README.md`) la appendean via onia-aprender y nadie compactaba (663
      entradas §, los loops la appendean y nadie compactaba). Lo hecho: memoria compactada
      500 KB → 60 KB / 663 → 109 entradas (backup en
      /root/.hermes/backups/MEMORY-pre-compactacion-20260911.md; datos operativos textuales
      conservados) — prompt total 523 KB → 96 KB medido con `hermes prompt-size`; y el job
      mas caro (onia-ordenador-tablero) de cada 6 h a 2/dia (13:00 y 23:00 UTC). Proyeccion:
      de ~$25-30/mes a ~$2-4/mes. ⚠️ Pendiente estructural anotado abajo: la memoria vuelve
      a crecer si nadie la compacta — tope automatico.

- [ ] 🟡 **La memoria de Hermes necesita TOPE automatico de compactacion.** La de 500 KB se
      compacto a mano el 11-sep, pero onia-aprender.sh y el supervisor siguen appendeando:
      sin tope vuelve a inflarse en semanas. Fix: cron semanal (o en el propio sync) que si
      /root/.hermes/memories/MEMORY.md supera ~100 KB dispara compactacion con backup; engancharlo al sync de loops que ya corre cada hora (fuente en el repo: `scripts/loops/README.md`)
      (mismo criterio del 11-sep: regla + 1 linea de porque, datos operativos textuales).
      Carril loops. **LISTO =** dos semanas seguidas con MEMORY.md < 100 KB sin mano humana.

- [x] 🟡 **CERRADO el 2026-09-11: banda GRANDE de renovacion en el panel** (pedido de Sergio
      Urcullo: "un apartado grande en la pantalla que avise con opcion de generar el QR").
      `onia-platform/components/AvisoRenovacion.tsx` + `onia-platform/lib/subscription/aviso-renovacion.ts`
      (3/3 tests): D-7 a D-1, solo ADMIN, tono urgente en D-1, boton "Renovar ahora" a
      /checkout; el texto del medio de pago sale de medioDePagoOnia(isBcpQrConfigured()) — sin
      credenciales del banco NO promete QR (pagos manuales hasta que el banco entregue,
      confirmado por Sergio Urcullo 11-sep); con credenciales, el MISMO boton termina en el
      QR dinamico. Commit `6e8ae641`, viaja en el deploy de esta noche.

- [x] 🟡 **CERRADO el 2026-09-11: el editor del bot queda SIMPLE por defecto** (lema de
      Sergio Urcullo: "todo súper fácil y ya configurado; opciones avanzadas para mayor
      settings"). Arriba: plantilla armada + Enséñale conversando + Identidad y horario +
      Publicar + probador; Seguimiento/cita/palabras clave/catálogo/FAQ plegados en un
      `<details>` "Opciones avanzadas" que se abre solo ante un error del validador
      (`onia-platform/app/(dashboard)/settings/chatbot/ChatbotClient.tsx`, 242 tests verdes).

- [ ] 🟡 **BYOK (clave de IA propia) como opción avanzada — hoy NO existe y está bien.** El
      LLM del bot de cada cliente es el LiteLLM central de Onia (clave nuestra, cero
      configuración del cliente = el lema). Cuando un cliente grande lo pida: campo "Clave de
      OpenAI propia (opcional)" en Opciones avanzadas del editor, que el motor use por-inbox
      (`hermes-content/deploy/vps-ops/bot/run-turn.mjs` askLiteLLM lee env; pasaría a leer
      del knowledge de la org). No construir antes de que exista el pedido real.

- [ ] 🔴 **LOTE AUDITORÍA 11-sep (velocidad + diseño vs Lety/Dapta, pedido de Sergio
      Urcullo) — medido con Lighthouse + Playwright + curl, capturas en el chat de la sesión.**
      ⚠️ **DERIVADO el 2026-09-11: no lo ejecuta este carril, y por eso no se puede cerrar acá.**
      Los nueve puntos viven en `web-factory/apps/onia-platform/src/app/(sitio)/`, que es zona de
      `web-venta` — medido, no supuesto: los últimos 12 commits de esa carpeta en `origin/main`
      son todos suyos (`fix(venta):`). Quedó repartido así, y este carril no lo vuelve a mirar:
      · **(a)-(d), velocidad** → tarea `t_c38481ac` del tablero, asignada a `carril-web-venta`,
        `ready` (verificado con `show`, no con el exit de `assign`). Es mecánica invisible: no
        cambia lo que el cliente LEE, así que va sin que Sergio Urcullo mire nada.
      · **(e)-(i), diseño** → ya estaban preguntadas: `t_54ff72b5`, `t_781090e0` y `t_a0644214`,
        las dos últimas `blocked` esperándolo a él. Crear una cuarta era repetirle una decisión
        que ya tiene sobre la mesa.
      Lo bueno medido: Onia carga MÁS RÁPIDO que ambas referencias (load 494 ms vs Lety
      12.913 ms y Dapta 9.493 ms desktop), precio visible en el fold (ninguna referencia lo
      tiene), 1 clic a /register, 0 render-blocking, 0 imágenes sin dimensiones. Lo que
      falla, por impacto:
      ✅ (a)+(b)+(c) CERRADOS el 2026-09-11 (commits `b1004df6` + sin-fade, PUBLICADOS en
      onia.com.bo y re-medidos con Lighthouse desde el VPS — instrumento estable para
      futuras mediciones): peso total **1.491 → 434 KB (−71%)**, requests 43 → 26, Chatwoot
      **0 KB** en carga inicial, hero pinta sin esperar
      JS y SIN fade (lección medida: un texto en opacity 0 no cuenta como pintado — el fade
      de entrada en el fold cuesta LCP venga de JS o de CSS), polyfills eliminados por
      browserslist moderno. Score 86, FCP 2,1 s, **LCP 3,8 s — mejor pero aún > 2,5**: lo que
      queda es (d) TTFB ~740 ms (regla de caché de HTML en Cloudflare — la decide Sergio
      Urcullo en su panel CF o autorizando el conector) y ~680 ms de render delay del h1
      (revisar font-display de la fuente de titulares). El detalle de (a), que es el que
      trajo el ahorro y la lección:
      (a) ✅ **CERRADO 2026-09-11 (`3927d847`)** VELOCIDAD — el widget de Chatwoot era el
      **71% del peso** de la landing (1.062 KB de 1.491 KB, 18 requests) y lo descargaba toda
      visita. Ahora espera al primer gesto de una persona o 12 s (`src/lib/chat-diferido.ts`,
      gate `chat-diferido.test.ts`, medición viva `scripts/chat-diferido-vivo.mjs`). Medido
      sobre la portada buildeada: **0 pedidos y 0 KB al chat sin tocar nada**. Sin launcher
      propio: la burbuja es la misma y no hubo cambio visual que aprobar. ⚠️ Y la trampa que
      costó la vuelta: con `scroll` y `mousemove` en la lista de gestos el SDK salía pedido a
      los **176 ms** sin que nadie tocara nada —la página dispara `scroll` sola— con el gate
      de unidad en verde. Sólo lo vio abrir la página y escuchar lo que pide;
      ⚠️ **El «o 5 s» que decía el resumen del lote era del snippet VIEJO** (inline en
      `layout.tsx`, con `scroll` adentro): lo reemplazó este módulo al integrar, y la espera
      vigente es **12 s**. Se corrigió acá al mergear para que el resumen no contradiga al
      código que corre;
      (b) ⚠️ **CORREGIDO 2026-09-18: la primera mitad de este ítem era FALSA y su remedio una
      regresión.** Decía *"LCP móvil 3,1 s: `dueno-duerme.webp` está lazy — pasar a
      fetchpriority=high"*. Medido contra `onia.com.bo` con Playwright + `PerformanceObserver`
      (`largest-contentful-paint`, `buffered:true`, `reducedMotion:'reduce'`): **el elemento LCP
      es TEXTO del hero en los dos viewports** — `<P>` a 1.256 ms en móvil 390×844, `<H1>` a
      896 ms en escritorio 1440×900 —, y esa foto está a **3.109 px** de scroll en móvil (2.602
      en escritorio), o sea casi cuatro pantallas abajo: **no puede ser el LCP por definición**.
      Ponerle `fetchpriority=high` a 104 KB que nadie ve todavía sólo los pone a competir por
      ancho de banda contra el hero, que sí es el LCP; el `loading=lazy` de ahí es correcto y se
      deja. **La segunda mitad (srcset 800w) sí era cierta**: está escrita en `claude/web-venta`
      (`0df2a089`, gate validado por mutación, 104 → 31 KB) pero **todavía NO publicada** — el
      `img` vivo de hoy trae `srcset` vacío. Medición y porqué en la cabecera de
      `web-factory/apps/onia-platform/src/fotos-de-venta-con-srcset.test.ts`; tarea `t_21723822`.
      ⚠️ El presupuesto de LCP del **LISTO** sigue abierto, pero se persigue por (d) TTFB y el
      render delay del h1, **no por esta foto**;
      (c) 🟡 JS propio 197,7 KB gz (> presupuesto 150): el chunk de polyfills legacy (39,6 KB gz)
      se elimina fijando browserslist moderno;
      (d) 🟡 TTFB 0,5-1,05 s en páginas estáticas de venta: cache de HTML en Cloudflare/ISR
      (Lety: 0,36 s);
      (e) 🔴 DISEÑO — el h1 "Todo el negocio, en una pantalla." describe la UI; el de Lety
      ("Sell AI. To dentists. Get paid every month.") nombra comprador y resultado. Rotar el
      rubro en el titular con el vocabulario que ya existe (`web-factory/apps/onia-platform/src/app/(sitio)/page.tsx`
      h1 + TITULO/DESCRIPCION/OG + guard `hero.test.ts`);
      (f) 🔴 el panel del hero vende SUSTANTIVOS (6 pastillas sin un número); Lety vende
      NÚMEROS ($13.300/mo con curva). Dibujar un "día simulado" en Bs (14 citas · Bs 2.340
      cobrados · 9 recordatorios) — sigue siendo panel dibujado (regla 1-sep), etiquetado
      "ejemplo"; archivos `(sitio)/ui.tsx` PanelDibujado;
      (g) 🟡 cero señal de confianza en el fold (sin inventar: integraciones reales WhatsApp/
      QR bancos/SIAT + "Hecho en Bolivia" + "14 días sin tarjeta" como fila compacta);
      (h) 🟡 hero centrado deja el fold sin evidencia: split copy-izquierda/panel-derecha
      (patrón Lety) en `(sitio)/portada.module.css`;
      (i) 🟡 CTA verde sobre hero verde (tres verdes idénticos compitiendo) + burbuja de chat
      tapa el panel en móvil + eyebrow duplica el claim del h1.
      ⚠️ (e)-(i) tocan la pieza APROBADA del 1-sep: el rediseño se muestra renderizado a
      Sergio Urcullo ANTES de publicar (regla "una superficie viva no se reemplaza sin que la
      VEA"). (a)-(d) son mecánica invisible: van directo.
      **LISTO =** LCP < 2,5 s y peso total < 500 KB medidos con Lighthouse, y el hero nuevo
      aprobado por Sergio Urcullo mirándolo.

- [x] ✅ **T-nueva — CERRADO el 2026-09-10 23:45 UTC: su LISTO se cumple hoy.** Contado en
      `supabase-db`, no deducido: `public.organizations` tiene **3 filas** (`onia-interna`,
      `bolivian-electricidad-e6t21`, `clinica-sergio-p2ljs`) — las mismas tres que dejó la purga
      de T2 — y `auth.users` con `%qa%` = **0**. Entre la purga (22:54) y esa cuenta el recorrido
      corrió **dos veces** (22:09→22:11 y 23:09→23:15, en `/var/log/onia-loop-recorrido-cliente.log`),
      que es exactamente el LISTO pedido: *dos corridas seguidas dejan `organizations` con las
      mismas filas que antes*.

      El mecanismo ya está en el script y no hacía falta escribirlo: `--solo-limpiar`
      (`scripts/recorrido_cliente.mjs`) barre lo `zz-qa-AAAA-MM-DD-HHMM` **al arrancar la
      vuelta**, sin depender de que el recorrido entero termine — que era el agujero real (una
      vuelta cortada por tope de tiempo nunca llegaba a `limpiarProduccion()`). Así un huérfano
      no sobrevive ni un ciclo. Queda anotado el límite honesto: entre dos corridas la org puede
      vivir hasta una hora, y eso es lo que el LISTO acepta.

      **Diagnóstico original, que sigue siendo la explicación correcta de por qué se juntaron
      las 7:** Medido
      durante la purga del 10-sep: mientras se borraban las 7 QA acumuladas apareció
      `zz-qa-2026-09-10-2209-negocio-wxbwh`, creada por el patrullaje diario a las 22:09 (así
      se juntaron las 7 — 4 eran de "modulos" del 06-sep, mismo patrón). El pedido de Sergio
      Urcullo ("solo una cuenta") no se sostiene si el loop la repuebla cada madrugada.
      **Fix:** el prompt/script del recorrido borra su org + `auth.users` al terminar (éxito o
      fallo), protocolo de la skill onia-db (`onia-platform/.claude/skills/onia-db/SKILL.md`): email
      `oninteligenciaartificial+qa*` o `zz-qa-*@onia.com.bo`, borrado por slug exacto. Carril
      loops (`hermes-content/docs/cola/loops.md` es su cola natural). **LISTO =** dos corridas
      seguidas del recorrido dejan `public.organizations` con las mismas filas que antes.

- [x] 🔴 **T1 — La recarga "+200 conversaciones por Bs 190" se VENDE pero no se puede APLICAR.**
      **CERRADO el 2026-09-10** (`6183fb02` en master de onia-platform, DEPLOYADO 22:56 UTC con
      gates 5/5): columna `recargadas` en `chatbot_uso_mensual` (migración
      `20260910230000_chatbot_recargadas` aplicada en prod con backup), `cuotaDe(addon,
      recargadas)`, `aplicarRecarga()` que además destraba los avisos del 80 %/corte (eran
      una-vez-por-mes: el que recargaba y volvía a agotar quedaba mudo), `POST
      /api/admin/organizations/[id]/recarga-chatbot` (superadmin, 409 sin add-on) y botón en la
      ficha admin junto al toggle. Tests 35/35 (`onia-platform/lib/chatbot/cupo.test.ts`),
      tsc/eslint 0. **VERIFICADO MIRANDO el 2026-09-10 ~23:45 UTC**: recarga aplicada a
      Clinica Sergio por el BOTON real de la ficha, y `/settings/chatbot` del cliente
      renderiza "0 de 700" con el texto dinamico — capturado y enviado a Sergio Urcullo.
      La recarga queda puesta en su org de pruebas (700 este mes, vuelve sola a 500 el 1-oct).
      Medido 10-sep: `CupoConversacionesCard` la ofrece desde el 80% del cupo (decisión de
      Sergio Urcullo del 05-sep), el cliente pagaría por WhatsApp… y `cuotaDe()`
      (`lib/chatbot/cupo.ts`) devuelve SIEMPRE el literal 500 de `pricing.ts`: no hay campo por
      org ni acción de admin que sume las 200. Si alguien paga hoy, no hay cómo dárselas.
      **Plan:** campo `recargadas` en la fila mensual `chatbotUsoMensual` (la recarga es del mes
      en curso) + `cuotaDe()` = incluidas + recargadas + botón superadmin "Aplicar recarga
      pagada (+200)" junto a donde vive el toggle del add-on + migración en prod por el runbook
      (INSERT en `_prisma_migrations`, prisma no llega desde el host). **LISTO =** en prod, org
      con recarga aplicada muestra "x de 700" en `/settings/chatbot` y el motor recibe
      `limite: 700` por `/api/chatbot-knowledge/published`, mirado, no supuesto.

- [x] 🔴 **T2 — CERRADO el 2026-09-10 en la base** (falta solo la mirada en `/admin/chatbots`,
      va con las capturas del cierre): backup pre-purga-qa-20260910-2254.sql (public+auth,
      805 KB, en `/root/backups-chatbot/` del VPS) → DELETE de las 7 orgs QA por slug exacto +
      la octava que el recorrido creó a las 22:09 → DELETE de sus 8 `auth.users` por email
      exacto. Quedan 3 orgs / 3 usuarios: `onia-interna` (superadmin), `bolivian-electricidad`
      (cliente real), `clinica-sergio` (ver pregunta abajo). `auth.users` con `%qa%` = 0.
      Anotado: el inbox 7 de Chatwoot (era de zz-qa-clinica-chatbot) quedó huérfano, inofensivo.
      **Pregunta ABIERTA a Sergio Urcullo:** ¿`clinica-sergio-p2ljs` (sergio@onia.com.bo) se
      borra también? Es su banco de pruebas con el add-on activo y el bot configurado —
      borrarla mata las pruebas del panel; no se toca sin su palabra.

      Purga original (pedido Sergio Urcullo
      10-sep: "solo tenemos una cuenta… borra las demás"). Medido en la base ese día: 10 orgs,
      de las cuales **7 son QA** (`zz-qa-clinica-chatbot`, `zz-qa-ferreteria-tornillo`,
      `zz-qa-estetica-modulos`, `qa-modulos-mrk0q`, `qa-modulos-rj7tv`,
      `zz-qa-salteo-horarios-20260906`, `zz-qa-cobro-e2e`) con sus usuarios `+qa*@gmail.com` /
      `zz-qa-*@onia.com.bo` (receta de limpieza en `hermes-content/docs/handoff/cobro-e2e.md`;
      verificación mirando con `scripts/onia-mirar.js`). **Se quedan:** `onia-interna`
      (superadmin, LA cuenta central),
      `bolivian-electricidad` (cliente real, gmail de Sergio Urcullo). **Pregunta abierta:**
      `clinica-sergio-p2ljs` (sergio@onia.com.bo) es la org de PRUEBAS de Sergio Urcullo con el
      add-on activo y el bot configurado — borrarla mata su banco de pruebas del panel; no se
      borra sin su palabra. **Plan:** backup de filas → DELETE de las 7 (cascada) → borrar sus
      `auth.users` → anotar inbox 7 de Chatwoot huérfano. **LISTO =** `/admin/chatbots` lista
      solo las orgs vivas, mirado en prod.

- [x] ✅ **T3 — CERRADO el 2026-09-10. Las tres partes, y la (a) por refutación medida: su
      causa escrita era falsa.**

      **(b) — arreglado por otro carril y YA DESPLEGADO** (`363dfa4e` + `bc7a447a` en `master`,
      mirado en producción ~23:45 UTC): la causa real no era la fuente sino **`flex-shrink`** —
      dentro del nav con `overflow-x-auto` los spans de icono se comprimían a 0-16 px con
      `font-size: 24` y el glifo desbordaba pisando el label. Fix de CLASE: `flex-shrink: 0` en
      `.material-symbols-outlined` (`globals.css`) —un glifo es indivisible, vale para todo el
      producto— más los `Link` de `AdminNav` con `shrink-0 whitespace-nowrap`. Re-medido en
      prod: los 8 spans en 24 px, barra legible (captura enviada). De paso cayó otro bug de
      CLASE: la URL del `woff2` era fija y Cloudflare/el navegador servían subsets viejos tras
      cada deploy — ahora `subset-iconos.mjs` versiona `?v=<hash>` en `globals.css` y en el
      preload de `layout.tsx`.

      **(c) — arreglado**: `AddonChatbotClient.tsx:193-208` ya pinta los dos CTA en la rama del
      add-on ACTIVO — «Configurar mi asistente» → `/settings/chatbot` y «Ver conversaciones» →
      `/inbox` —, con el comentario que cita la captura del 10-sep que lo motivó (verificado
      también con captura de producción).

      **(a) — la causa que decía este ítem («falta reservar espacio, padding-bottom del
      contenedor scrolleable») es FALSA hoy.** Los dos carriles llegaron a lo mismo por caminos
      distintos: con viewport real scrolleado al fondo la barra no tapa nada (la captura del
      10-sep era `fullPage`, congelada a mitad de scroll), y contado en px del disco el colchón
      de `LayoutShell` despeja todo el mobiliario flotante:

      | | colchón | lo más alto que flota | despeja por |
      |---|---|---|---|
      | móvil | `pb-40` = **160 px** | FAB 152 · asistente 124 · BottomNav 64 | **8 px** |
      | escritorio | `md:pb-28` = **112 px** | asistente 96 · FAB 96 · franja de estado 30 | **16 px** |

      Y las dos pantallas que nombraba **no tienen contenedor de scroll propio** (`grep` de
      `overflow-y` y `h-screen` en las carpetas del editor del bot y de la tabla de chatbots del
      panel admin: sólo un `aside` con `lg:sticky` y una lista interna), así que heredan el
      colchón de `LayoutShell` y éste las despeja.

      **Lo que sí faltaba, y es la clase:** ese colchón es un número tipeado a mano que tiene
      que dominar a TODO el mobiliario flotante, y no lo re-medía nadie. `capas.ts` contesta
      *qué capa va arriba*; nadie contestaba *cuánto espacio necesita el contenido para
      despejarlas*. Ya falló una vez —el propio `LayoutShell.tsx` lo cuenta: con el colchón
      anterior (`pb-32`, y `pb-12` en escritorio) el FAB se comía el borde de «Guardar» en
      Configuración— y se arregló **a mano contra el FAB**, el único mobiliario de entonces.
      Después entraron la barra del asistente y la franja del plan, y el margen quedó en 8 px:
      un retoque de diseño de volver a taparlo.

      **Gate** (`components/layout/colchon-despeja-lo-que-flota.test.ts`, `2d87ae1`): el sujeto
      es `CAPAS_FLOTANTES` —la tabla que ya manda sobre los z—, así que una capa nueva que entre
      ahí y no declare cuánto ocupa **se nombra** en vez de entrar ya aprobada; los números se
      leen del disco, no se copian. Validado **por mutación en 5 direcciones** (colchón
      encogido · capa que crece · capa nueva sin declarar · excusa del velo que caduca · lector
      roto), las 5 `exit 1` nombrando la capa, base y restaurado `exit 0`, cada mutación
      verificada de que entró. Gates: `tsc` 0 · `vitest` **4385** pasan / 354 archivos ·
      `eslint` 0 errores.

      🔴 **Ese gate está commiteado y pusheado, pero NO mergeado** — medido el 2026-09-11:
      `git merge-base --is-ancestor 2d87ae1 origin/master` dice que no. Es un test, así que no
      cambia lo que ve el cliente; lo que falta es el merge del integrador para que empiece a
      cuidar. Lo de (b) y (c), en cambio, ya está en `master` y desplegado.

      **Texto original del ítem, para no perder qué se había visto:** (a) la barra flotante
      "Preguntá por tu negocio" (`onia-platform/components/ayuda/BarraAsistente.tsx`) se pinta
      ENCIMA del formulario del editor del bot (tapa "A quién deriva el bot") y de la última
      fila de la tabla de `/admin/chatbots` — falta reservar espacio (padding-bottom del
      contenedor scrolleable) o bajar su z/altura; (b) en la barra PANEL ADMIN
      (`onia-platform/app/(dashboard)/admin/AdminNav.tsx`) los iconos pisan el texto de las
      pestañas (Clínicas, Pagos, Planes, Usuarios, Auditoría se leen encimadas); (c)
      `/settings/addon-chatbot` activa
      (`onia-platform/app/(dashboard)/settings/addon-chatbot/AddonChatbotClient.tsx`) queda
      media pantalla vacía sin un solo enlace al editor (`/settings/chatbot`) ni a la bandeja
      (`/inbox`) — lo pagado no tiene camino de uso desde ahí. **LISTO =** las tres pantallas
      re-capturadas en prod sin solaparse y con los CTA, mirado.

- [x] 🟡 **CERRADO el 2026-09-10 — y al medirlo apareció que T5 era la mitad chica de algo
      peor: el guion le PIDE al prospecto una palabra y el motor no la escuchaba.**

      **Lo que decía T5** (sigue siendo cierto): una señal de COMPRA en `handoff_humano`
      recibía el acuse genérico "Te leo, y esto también se lo paso a Sergio" — frío para el
      mensaje más caliente que existe.

      **Lo que apareció al reproducirlo en el simulador, y no estaba escrito:** `M5` cierra
      con «Si es urgente, decime "urgente" y lo marco» — y `M8_SOPORTE`, su hermana, con la
      misma promesa. `grep -rn "urgente" hermes-content/deploy/vps-ops/bot/*.mjs` devolvía
      **sólo los dos literales del guion**: la detección no existía en ninguna parte. O sea
      que el bot le decía al prospecto exactamente qué escribir y después no lo escuchaba.

      **Y era peor que "acuse genérico": el segundo mensaje caía en SILENCIO TOTAL.** El
      acuse se gasta con el primer inbound (`handoffAckAt`), así que todo lo que llegaba
      después salía por `silencio:handoff_en_curso` — y una señal de compra casi siempre
      llega después de un "gracias, quedo atento". Medido tal cual:

          vos > quiero hablar con una persona
            [M5] "... Si es urgente, decime "urgente" y lo marco."
          vos > quiero comprar el sistema, cuando puedo pagar
            [M5_ACUSE] "Te leo, y esto también se lo paso a Sergio"
          vos > en serio, quiero pagar hoy mismo
            (el bot NO responde)          [notas] silencio:handoff_en_curso

      **LA CLASE**, que es lo que quedó cuidado y no la instancia: *el guion le pide al
      prospecto una acción y el motor no la escucha*. Ningún gate del carril podía verla —
      no sobra ninguna palabra (el texto es correcto y amable), no falta un rubro, el precio
      sale de la fuente y el camino feliz anda. Lo que está mal es el par **(lo que el guion
      PIDE, lo que el motor HACE con eso)**.

      **Arreglo** (`intents.needsHumanNow` + rama `handoff_humano` de `bot-engine.mjs`):
      "urgente" **o** intención de comprar el sistema emiten un `notify_sergio` con `kind`
      propio `handoff_urgente` y contestan `M5_URGENTE` ("Listo, lo marqué como urgente").
      **Una sola vez por conversación** (`urgenteAvisadoAt`, en `raw` — sin DDL): el canal de
      Telegram ya le llega saturado a Sergio Urcullo y repetirlo es apagarlo. Va **antes** del
      candado del acuse, que es lo que lo hace funcionar en el 2.º turno. La etiqueta
      `handoff_urgente` se agregó a `ETIQUETAS` de `aviso-telegram.mjs`, o el aviso habría
      llegado con el slug interno crudo en vez de "🔥 URGENTE — contestá esto primero".

      **Las tres listas de `raw`.** `urgenteAvisadoAt` entró en `createState`,
      `toConversationRow` **y** `stateFromRow` + el patch de `persistence.mjs`. Es la trampa
      que ya mordió dos veces (`handoffAckAt` y `branchAsked`): el motor lo setea, la base no
      lo recibe, y el aviso sale de nuevo en cada turno. Tiene caso propio.

      **PRUEBA.** `hermes-content/deploy/vps-ops/bot/urgencia-en-el-handoff.test.mjs`, 8 casos,
      en ROJO primero (7 de 8) por el motivo correcto. Suite del bot **895/895**. El caso
      `promesa` **deriva sus sujetos del `SCRIPT` leído del disco** (`decime "X"`), así que
      cubre las DOS hermanas —`M5` y `M8_SOPORTE`— y un texto nuevo con la misma promesa nace
      cubierto. Validado por **5 mutaciones**, todas en rojo y el control de vuelta en 8/0:
      arrancar la detección (6 rojos) · **el esquive**: contestar "lo marqué" y NO avisar
      (6 rojos, que es la promesa rota encima de la promesa rota) · sacar el campo de
      `toConversationRow` (1) · dejar de escuchar la palabra del guion (4) · sacar el
      anti-spam (1). Reproducido en el simulador: hoy contesta `M5_URGENTE` con
      `[notas] handoff:quiere_comprar`, y `construirAviso` lo entrega como
      **🔥 URGENTE — contestá esto primero**.

      🔴 **Commiteado y pusheado, NO desplegado.** El bot vivo corre `/opt/onia/bot`, que es
      un rsync y no un checkout: hasta el swap, un prospecto que escriba "urgente" sigue
      recibiendo el acuse genérico. Pedido de deploy: `t_fab8ad4d` (destino `bot`).

- [x] 🔴 **CERRADO el 2026-09-11 (`52fb146`, rama del carril — falta el merge del
      integrador y el deploy): su caja ya fía contra la MISMA ficha, y está probado contra
      la base de producción.**

      **El arreglo:** `lib/comercio/ficha-del-fiado.ts` — `ensureFichaDelFiado` deriva del
      pack (`guardaClientesEnPatients`, o sea de la pantalla que el rubro OFRECE, nunca de
      una lista de tracks al lado), busca por TELÉFONO —la clave estable que ya usaba el
      partner, porque el nombre se tipea distinto cada vez— y deja la fila en `patient`.
      `ensureClienteFiado` lo llama primero y cuelga el partner de esa ficha: la orden lo
      sigue necesitando como FK, pero queda enganchado por `metadata.patientId`. Cuando la
      ficha ya existe **gana su nombre**: el dueño lo escribió a propósito, lo tipeado en
      el mostrador es de apuro, y las dos pantallas tienen que decir lo mismo. Un partner
      de antes del arreglo se engancha solo en su próxima venta fiada.

      **Probado contra PRODUCCIÓN, no sólo con `tx` mockeada** (`scripts/fiado-en-la-ficha-vivo.ts`):
      corre dentro de una transacción que termina en `throw`, así que el rollback lo hace
      el motor y no un `DELETE` que puede quedar a medias. Salida del 2026-09-11:
      `patientId cmtw8nqtg00010qkvrvjm7nm4`, la fila **leída de la tabla** con el nombre
      correcto, y `residuo tras el rollback: organizations=0 patients=0`. Eso es
      exactamente el LISTO que pedía este ítem.

      **El caso que mira al LLAMADOR va aparte a propósito** (`lib/comercio/ventas.test.ts`):
      el gate del módulo seguiría VERDE si alguien saca la llamada de `ensureClienteFiado`
      —el arreglo quedaría escrito y sin efecto—, que es la trampa del parámetro opcional
      un escalón más arriba. Validado **por mutación en 6 direcciones** (sin la llamada ·
      predicado siempre `true` · siempre `false` · no reusa la ficha · sin el enganche del
      partner viejo · el partner no toma el nombre de la ficha): las 6 en rojo, cada una
      verificada de que entró, base restaurada en verde. Gates: `tsc` 0 · `vitest` **4396**
      pasan / 355 archivos · `eslint` 0 errores, corridos sobre el árbol que aterriza —
      `git rev-parse HEAD^{tree}` da el mismo valor en casa y en el gemelo del VPS, que es
      lo único que prueba que lo publicado es lo medido cuando se entrega por `git am`.

      **La excusa nombrada se actualizó, no se borró** (`administrar-lo-que-se-acumula.test.ts`):
      el pack sigue sin `/comercio/clientes` —dos entradas «Clientes» a dos tablas son
      peores que el hueco—, pero ahora el motivo es completo en vez de una postergación.
      **La clase que deja:** una excusa nombrada puede ser correcta sobre el MENÚ y falsa
      sobre el DATO; el gate re-medía el menú y nadie re-medía la tabla.

      **Texto original del ítem:** Sale del arreglo de la importadora (`d634913`, 2026-09-10). Ese pack tiene
      `/comercio/caja` **y** `/patients` (rotulada «Clientes»), y las dos guardan gente en
      tablas distintas: fiar llama a `ensureClienteFiado`, que da de alta en
      `onia_core_business_partners`, mientras `/patients` lee `patient`. O sea que quien fía
      queda en un lugar que el dueño no abre nunca. **No se arregla con una entrada de menú**
      —agregarle `/comercio/clientes` le pondría DOS «Clientes» apuntando a dos tablas, peor
      que el hueco—: el arreglo es que su caja fíe contra la misma ficha, y eso es desarrollo.
      Por eso está declarado como excusa NOMBRADA en
      `lib/platform/administrar-lo-que-se-acumula.test.ts`, que la **re-mide cada corrida**:
      el día que el pack gane la pantalla o pierda la caja, el gate dice que la excusa sobra.
      Hoy no hay daño acumulado — medido el 2026-09-10, `qa-modulos-mrk0q` tiene 0 partners —,
      así que es trabajo de antes-de-que-duela, no un incendio.
      LISTO = una venta fiada desde la caja de ese rubro deja al cliente donde su dueño lo ve,
      con la fila en la base como prueba.

- [x] 🔴 **CERRADO el 2026-09-10 (`825f227`, rama del carril — falta el merge del integrador):
      el aviso del cupo del chatbot y el del tope de clientes le llegaban al teléfono de la
      recepción y del profesional, que no pueden abrir la pantalla a la que llevan.**

      **La QUINTA pregunta sobre rol.** `lib/platform/ruta-por-rol.ts` enumera cuatro —el menú,
      la ruta, la acción y el enlace que una pantalla pinta— y **las cuatro tienen por sujeto una
      PANTALLA**. Un push no es ninguna: no es item de menú, no es un `redirect()`, no es una
      acción de pantalla y no es un `.tsx` que pinte un `href`. Por eso ningún gate podía verlo.

      **Estaba en DOS archivos a la vez, y con la mitad buena al lado:** en `lib/chatbot/cupo.ts`
      y en `lib/agenda/tope-en-la-puerta-publica.ts`, la notificación in-app filtraba
      destinatarios a `ADMIN`/`SUPERADMIN` y el push de **dos líneas más abajo** salía a TODOS
      los suscritos de la org, hacia `/settings/chatbot` y `/settings`, que son `SOLO_ADMIN`. El
      archivo ya sabía hacerlo bien; justo la mitad que viaja al teléfono no lo hacía.

      **Son dos daños, no uno:** el **rebote mudo** —se toca el aviso y vuelve al inicio, sin
      cartel ni error, que se lee como producto roto y termina en soporte— y que **se le cuenta a
      un empleado el estado comercial del negocio**: que el cupo que su jefe paga se agotó, que
      está por chocar el tope de su plan. Es la misma regla que ya se aplicó en la puerta pública
      (el estado comercial no se le cuenta a quien no lo decide), del lado de adentro.

      ⚠️ **Honestidad sobre el alcance: `public.push_subscriptions` tenía 0 filas al medirlo**
      (contado, no deducido). Es un defecto de **código**, todavía no de datos: entra **ya
      aprobado** el día que un doctor o la recepción active las notificaciones, que es
      exactamente lo que el producto les ofrece — la misma forma que el texto de venta muerto o
      la entrada de lista blanca pre-aprobada. Y hay 6 perfiles no-admin de 16 en producción.

      **Arreglo** (`lib/platform/aviso-alcanzable-por-rol.ts`): el corte usa `puedeAbrirRuta`, la
      **misma** función que el enlace, a propósito — copiar la lista de roles al lado del
      `sendPushToUser` es exactamente como nació esto. Sin rol conocido no se manda nada
      (fail-closed). **Trampa del modelo:** `PushSubscription.userId` referencia `Profile.id`, no
      `Profile.userId` (ver el `@relation` del schema), así que el rol se pide por la relación
      declarada y no cruzando ids a mano — un JOIN por `userId` devuelve vacío y parece que nadie
      está suscrito.

      **Gate:** `lib/platform/aviso-alcanzable-por-rol.test.ts` (8 casos), sujetos derivados del
      disco y medidos sobre el fuente **sin comentarios**. Cubre las **dos** mitades: el aviso que
      difunde a la org y el que va a una persona. Validado **por mutación en 6 direcciones**
      —cupo crudo · tope crudo · **esquive** (importar el helper y dejar el `findMany` al lado) ·
      un aviso puntual apuntado a una ruta admin · el filtro arrancado · el caso ancla del
      módulo—: las 6 `exit 1`, base `exit 0`, y cada mutación verificada de que entró.

      🔴 **Dos falsos positivos PROPIOS, corregidos antes de dar el gate por bueno, los dos en la
      dirección cara:** `/appointments` declara `ALL_ROLES` y **no es un corte** (mi primera
      versión acusaba a un aviso sano), y clasificar difunde/puntual por la presencia del
      `findMany` **se rompía justo con el arreglo** —el arreglo borra la forma que el detector
      perseguía—. Y el **esquive** no lo cazaba mi primera versión: sólo apareció mutando
      DESPUÉS de arreglar.

      **Gates:** `npx tsc --noEmit` 0 · `npx vitest run` **4347 pasan / 351 archivos** ·
      `npx eslint .` 0 errores. Marca puesta en el pedido de deploy vivo `t_6f2e10b9`.

- [x] 🔴 **CERRADO el 2026-09-10 (`d5ec6de`, ya en `master` — verificado el 2026-09-10): la ayuda
      del producto le negaba al dueño una exportación que su plan YA incluye.** Punto 8 de la
      Definición 1.0 («cero promesas falsas»), en la dirección que casi nadie audita: prometer
      de MENOS.

      `/help` decía *«La exportación a CSV está en el plan Completo»* y la enumeración de planes
      la ponía como lo que suma el Completo. Medido contra `lib/plan-catalogo.ts`:
      `csvExportEnabled` es `true` **desde `basic`** y el propio catálogo fija por qué —*«el
      export de SUS datos no puede ser rehén del plan»*, auditoría 2026-08-06—; el botón de
      `/reports` cuelga de `canExportCsv`, no del plan de reportes (su `puedeExportarCsv`), así
      que un Básico entra al reporte básico y **tiene el botón**. Y `onia.com.bo/precios` lo
      vende como «los exportás desde el plan más chico». Al dueño de Bs 320 y al de Bs 750 se
      les pedía saltar a Bs 1.500 por algo que ya pagaban, en la pantalla que consultan justo
      cuando no encuentran algo. Eran **11 atribuciones falsas en los 7 packs**: la pregunta de
      los planes no declara `ruta`, así que la ven todos.

      **La CLASE, que es lo que vale:** la ayuda afirma **en qué plan vive cada capacidad** y el
      plan va tipeado al lado del texto. Los tres gates hermanos miran otra cosa —
      `monto-de-plan-a-mano` los montos, `nombre-de-plan-a-mano` que no se filtre la clave en
      inglés, `plan-catalogo-es-la-fuente` que mostrar y aplicar pidan el mismo campo— y
      **ninguno cruza la afirmación contra `PLAN_LIMITS`**. No sobra ni falta una palabra, el
      rubro deriva bien y la pantalla renderiza perfecto: ningún barrido de literales podía
      verlo. Es la familia simétrica, **dentro del producto**, del gate que web-venta cerró ese
      mismo día en el sitio (`datos-que-se-llevan.test.ts`).

      **Gate:** `lib/ayuda/capacidad-en-el-plan-correcto.test.ts`. Mide lo que `construirFaq`
      **devuelve** para los 7 packs (no el fuente: así no hay comentario, interpolación ni
      concatenación que confunda al patrón) y exige que el plan nombrado sea el **primero** que
      trae la capacidad. Validado por mutación en tres direcciones: atribución correcta movida
      de plan (`recurringInvoices` professional→clinic) → rojo nombrándola; la ayuda deja de
      nombrar la capacidad (**esquive**) → rojo por el ancla; detector vacío → rojo por
      cobertura. Gates: `tsc` 0 · **4.338** tests · `eslint` 0 errores. Árbol publicado idéntico
      al medido (`tree 5563659`).

- [x] 🔴 **CERRADO el 2026-09-10 (`7d3c050`, ya en `master` — verificado el 2026-09-10): el panel
      le ofrecía a la recepción y al profesional dos enlaces que los rebotaban MUDO al inicio.**
      Punto 8 de la Definición 1.0 («cero promesas falsas»).

      **Es la CUARTA pregunta sobre rol, y no la veía ningún gate.** Había tres:
      `filterNavItems` filtra el **menú**, `rol-en-la-ruta.test.ts` defiende la **ruta**, y
      `accion-negada-por-rol.test.ts` (ayer) mira la **acción** contra la API. Las dos primeras
      preguntan por la ruta, así que un enlace pintado **dentro** de una pantalla —o en el
      layout— no es item de menú de nadie y no era sujeto de ninguno. `enlaces-del-panel-
      alcanzables.test.ts` sí cruza href, pero contra el **pack**: otro eje.

      **Lo que veía el que no es admin:** apretaba y volvía a `/dashboard`. Sin cartel, sin
      error, sin request fallida. Un rebote mudo se lee como producto roto y termina en
      soporte, que es el techo real del negocio. Los dos casos pegan a **6 de los 16 perfiles**
      de producción (STAFF 3, DOCTOR 3):

      - **`components/layout/BarraEstado.tsx`** vive en `LayoutShell`, o sea **todas** las
        pantallas: *«vence en N días · Ver mi plan»* → `/settings`. El **dato** le importa a
        todo el que trabaja adentro y el **CTA** sólo a quien puede abrirlo, así que queda el
        aviso y se va el botón muerto.
      - **`app/(dashboard)/inbox/InboxClient.tsx`** — el más caro: `/inbox` es la pantalla de
        la **recepción**, y con el canal apagado le decía *«Encendé tu asistente»* con un botón
        a `/settings/chatbot`. Ahora al que no puede se le dice la acción que **sí** puede
        hacer (pedírselo a quien administra); el aviso no se le borra.

      El criterio es **uno** (`lib/platform/ruta-por-rol.ts`), derivado de `sidebarNavItems` —la
      fuente que `rol-en-la-ruta` ya enforza— más los cortes que no son item de menú. Copiar la
      lista de roles al lado del botón es exactamente como nació esto.

      **El gate cierra la CLASE** (`lib/platform/enlace-alcanzable-por-rol.test.ts`): deriva del
      disco los cruces *(pantalla, enlace)*, cruza los roles que alcanzan el **origen** contra
      los que abren el **destino**, y cada cruce vivo declara CÓMO se cubre con la declaración
      **re-medida** — uno nuevo nace rojo con su nombre, y una fila que sobra también.

      ⚠️ **Tres correcciones del instrumento, las tres en la dirección cara** (acusar a código
      sano), que la primera medición tenía mal: (1) el origen sale del **nav**, no de los
      `redirect()` — `/empresa` y `/team` cortan con `requireEmpresaAccess()`/`requireAdmin()` y
      figuraban abiertos a los cuatro roles, con 7 falsos positivos; (2) `/team` lo abre
      **SUPERADMIN** (`requireAdmin`) aunque su item del menú declare sólo `ADMIN`: manda lo que
      la ruta **aplica**; (3) la guarda se pide en la **vecindad** del enlace y resolviendo la
      variable derivada, no por presencia del símbolo en el archivo — eso se satisface
      importando el helper y tirando el resultado.

      **Validado por mutación:** revertir cada arreglo da rojo, y el **esquive** también. Los
      comentarios se blanquean conservando saltos, o el gate reporta la línea corrida.

      **Anotado, no cerrado:** `/patients` fue la primera de esta clase en resolverse bien, pero
      su guarda copia la lista de roles (`role === "ADMIN" || role === "SUPERADMIN"`) en vez de
      preguntarle a `puedeAbrirRuta`. Hoy coinciden; migrarla al criterio único es trabajo
      aparte y queda declarado en la tabla del gate, no suelto.

      **Listo =** `npx vitest run lib/platform/enlace-alcanzable-por-rol.test.ts` (5/5) y la
      suite entera: **4335 tests**, `tsc --noEmit` y `eslint` exit 0.

- [x] 🔴 **CERRADO el 2026-09-10 (`a106f7e`, ya en `master` — verificado el 2026-09-10):
      `/appointments` le ofrecía «Eliminar» a quien la API le contesta 403 por su rol, y el
      rechazo era MUDO.** Punto 8 de la Definición 1.0 («cero promesas falsas»).

      `/appointments` es `ALL_ROLES` **a propósito** —cada uno tiene que ver sus citas— y aun
      así pintaba el botón a los cuatro roles. `DELETE /api/appointments/[id]` contesta 403
      *«Solo admins pueden eliminar citas»* a DOCTOR y STAFF, que en producción son **6 de los
      16 perfiles** (medido: `select role, count(*) from public.profiles` → ADMIN 9, STAFF 3,
      DOCTOR 3, SUPERADMIN 1). Y `handleDelete` era el **único de los seis handlers del
      archivo** sin rama de fallo (`if (res.ok)` pelado, sin `else`): sus cinco hermanos ya
      usan `mensajeDeError` y uno hasta lleva el comentario del arreglo anterior.

      **Lo que veía el que no es admin:** confirmaba un diálogo que le afirmaba
      *«permanentemente, no se puede deshacer»* y no pasaba **nada** — ni cambio, ni cartel, ni
      error. Un fallo mudo se lee como producto roto y termina en soporte, que es el techo real
      del negocio.

      **Por qué ningún gate podía verlo, que es lo reusable.** Hay TRES preguntas sobre rol y
      sólo había dos: `navigation.ts` filtra el **menú** y `rol-en-la-ruta.test.ts` defiende la
      **ruta** — las dos sobre la ruta. La tercera vive un nivel más adentro: la **acción**. Y
      `rol-en-la-ruta` no puede alcanzarla *por construcción*: deriva su universo de los items
      que el nav restringe MÁS que la línea base de su pack, así que una ruta `ALL_ROLES` nunca
      es sujeto suyo. No sobra ni falta una palabra, la pantalla renderiza perfecto, el rubro
      deriva bien, el plan la incluye y el menú está BIEN.

      **Van las dos capas:** la acción no se ofrece, y si el servidor la rechaza igual (plan
      vencido, módulo apagado) el rechazo **se dice**. El criterio es UNO y lo comparten API y
      pantalla (`lib/platform/acciones-por-rol.ts`) — copiar la lista de roles al lado del botón
      es exactamente como nació esto.

      **El gate cierra la CLASE:** `lib/platform/accion-negada-por-rol.test.ts` deriva del disco
      los cruces *pantalla → API que niega por rol* (**10 vivos**), cada uno declara CÓMO se
      cubre y la declaración se **re-mide**; un cruce nuevo sin fila sale rojo con su nombre.
      Validado por mutación en 5 direcciones, incluido el esquive (llamar al helper y tirar el
      resultado) y un cruce nuevo inyectado.

      ⚠️ **Tres correcciones del instrumento, las tres en la dirección cara** (acusar a código
      sano): (1) sólo cuenta el rechazo **incondicional** — `role === "DOCTOR" && doctorId !==
      profile.id` en `POST /api/appointments` *acota*, no niega, y la pantalla ya lo respeta;
      (2) no cuenta `target.role` (`/api/team/[id]`), que describe a quién se borra y no a quién
      llama; (3) el detector reconoce **también la vía buena** (el helper), porque si sólo
      persiguiera la lista escrita a mano, el arreglo sacaba la acción del universo y su fila
      quedaba huérfana — el gate dejaría de cuidar al sujeto justo después de arreglarlo.

      **Queda anotado, no cerrado:** `DELETE`/`PATCH /api/doctors/[id]` cortan con
      `role !== "ADMIN"`, o sea le niegan también a **SUPERADMIN**, que sí llega a `/settings`.
      Es la cuenta interna de Onia (1 perfil), no un rol que un negocio reparta, así que queda
      fuera del universo del gate **con su motivo escrito** — no es un cruce sin declarar.

      **Listo =** `npx vitest run lib/platform/accion-negada-por-rol.test.ts` (8/8) y la suite
      entera en verde: **4319 tests**, `tsc --noEmit` y `eslint` exit 0.

- [x] 🔴 **CERRADO el 2026-09-10 (`057cc58`, ya en `master` — verificado el 2026-09-10): el
      cliente que PAGÓ y se le venció el plan quedaba en solo lectura sin que NADA se lo
      dijera.** El único aviso del panel era `TrialBlockedModal`, y el layout lo mostraba con
      `getTrialStatus(...).isBlocked`. Esa función arranca con
      `const isActiveTrialContract = !org.planEnd; if (!isActiveTrialContract) return noTrial;`
      — o sea devuelve `isBlocked: false` para **cualquier** organización con `planEnd`, que es,
      por definición, **el que ya pagó**.

      Mientras tanto las **32** rutas de `app/api` que escriben (contadas, no estimadas) cortan
      por `checkPlanExpiry` → `isWriteBlocked`, que **sí** bloquea con el `planEnd` vencido. Y la
      gracia es **sólo del trial** — `graceDeadline` lo dice con todas las letras: *«un contrato
      pago corta el día que vence»* —, así que el que pagó corta **sin colchón** y encima era el
      único mudo: se enteraba en el último clic, con un 403. **El que está en prueba sí veía el
      modal. El único ciego era el único que ya había pagado.**

      **Por qué sobrevivió, que es lo reusable:** la mitad que **MUESTRA** y la mitad que
      **APLICA** leían fuentes distintas — la primera preguntaba por el **trial**, la segunda por
      el estado del **plan**. Ningún gate podía verlo: no sobra ni falta una palabra, la pantalla
      renderiza perfecto, el rubro deriva bien y las rutas responden. **Lo que falla es QUIÉN
      pregunta.** Es la mitad hermana de `ba2270b` (cerrado el 08-sep): ahí se cerró que cortar
      recién en la escritura deja al visitante llenar los cuatro pasos para comerse el rechazo en
      el último clic — pero se aplicó a la puerta **pública**, y la puerta del **dueño** quedó
      igual. Cerrar una mitad hizo dar la otra por cubierta, otra vez.

      **Arreglo** (`lib/subscription/aviso-solo-lectura.ts` · `components/AvisoSoloLectura.tsx` ·
      `app/(dashboard)/layout.tsx`):
      - `avisoSoloLectura()` pregunta con **`isWriteBlocked`, la misma función que corta**, no una
        copia al lado: las 32 quedan cubiertas por construcción y la 33.ª nace cubierta.
      - El banner va **además** del modal, no en su lugar. El modal se cierra a propósito (el
        dueño que viene a mirar sus números para decidir si paga tiene que poder mirarlos) y
        después el panel no volvía a decir nada más.
      - El texto respeta lo que el correo del día 14 y 15 **ya prometió** —*«podés consultarlo y
        exportarlo cuando quieras»*—: lo que se frena es registrar, no mirar ni llevarse lo suyo.
      - Las **8** rutas que decían *«Escribinos para renovar»* mandaban a una **persona** teniendo
        `/checkout`, que cobra solo (Definición 1.0 §1: *«sin que intervenga un humano de Onia»*,
        §3 probado el 10-sep). Un solo `MENSAJE_SUSCRIPCION_VENCIDA`, que nombra el camino.

      **Gate:** `lib/subscription/aviso-solo-lectura.test.ts` (14 casos; los sujetos de las rutas
      se **derivan del disco**, con un ancla que falla si el barrido se vacía). Validado **por
      mutación en 3 direcciones** —reintroducir el corte por `planEnd` (6 rojos) · calcular el
      aviso y no renderizarlo, que es el esquive (1 rojo) · devolver una ruta a «Escribinos»
      (1 rojo)—; base en verde. Los casos de «NO ve el aviso» están escritos con su estado a
      mano y **no** comparados contra `isWriteBlocked`: ese caso sería tautológico, porque es lo
      que el módulo ya consulta.

      ⚠️ **Un caso mío salió en rojo y el equivocado era el test, no el producto:** supuse que un
      contrato pago vencido ayer estaba en gracia. `graceDeadline` dice lo contrario y está
      documentado como decisión. Se corrigió el caso y se **ancló ese límite**, que es lo que
      vuelve caro al defecto.

      **Gates:** `npx tsc --noEmit` exit 0 · `npx vitest run` **4292 pasan / 346 archivos** ·
      `npx eslint .` 0 errores.

      🔴 **NO ESTÁ DESPLEGADO:** `057cc58` ya está en `master` (verificado el 2026-09-10). Hay
      pedido de deploy vivo para `plataforma` (`t_6e23cd1c`); el `ok` de Sergio Urcullo sólo
      publica esto si el integrador mergea antes. Anotado como comentario en ese pedido.

- [x] 🔴 **CERRADO el 2026-09-10 (`31233cd`, ya en `master` — verificado el 2026-09-10): el
      negocio cancelaba o movía una cita y al CLIENTE no le llegaba nada.** El sistema le habla
      dos veces —cuando la cita nace (correo de confirmación, `lib/agenda/crear-cita.ts:241`) y
      cuando se acerca (recordatorios de 24 h y 2 h)— y se callaba justo en el tercer momento,
      el único en que el aviso le ahorra el viaje. Medido en `app/api/appointments/[id]/route.ts`:
      el `PATCH` (por donde entra «Cancelar» del panel, `app/(dashboard)/appointments/page.tsx:307`) y el
      `DELETE` escribían la auditoría y publicaban el realtime, y **ningún envío al cliente**.
      Peor: el cron de recordatorios filtra `status: { in: ["CONFIRMADA","PENDIENTE"] }`
      (`app/api/cron/appointment-reminders/route.ts:459`), así que a la cita cancelada se le apagan también
      los recordatorios — lo último que el sistema le dijo queda siendo la confirmación con una
      hora que ya no existe, y se presenta igual.

      **Por qué ningún gate podía verlo:** no sobra ni falta una palabra, la pantalla renderiza
      perfecto, el rubro deriva bien y el camino feliz funciona. Lo que lo mantenía invisible es
      que la mitad SIMÉTRICA sí estaba —cuando el CLIENTE cancela desde su enlace, el negocio
      recibe su notificación (`/api/appointments/respond`)—, y una mitad sana hace leer la
      familia entera como cubierta.

      **Hecho:** `lib/agenda/aviso-de-cambio-de-cita.ts` (decisión pura `cambioQueMereceAviso` +
      envío) y `sendAppointmentChange(Safe)` en `lib/email.ts`. Correo al cliente con la fecha
      anterior tachada en el reprogramado (sin eso tiene que comparar dos correos), e in-app +
      push al profesional cuando el cambio lo hizo otra persona. Respeta lo que ya respetaba el
      alta: `emailOptOut`, `emailNotifications`, emisor configurado, zona del negocio, rubro y
      **cupo mensual con su aviso al dueño** si corta (si no, el corte sería mudo otra vez).
      Cancelar lo ya cancelado y marcar COMPLETADA/NO_ASISTIO no avisan, a propósito.
      **Prueba:** 9 casos nuevos —incluido uno que mira al LLAMADOR, porque el módulo puede
      quedar impecable y el aviso no salir nunca— validados por mutación en 3 direcciones
      (PATCH sin llamada → 1 rojo, DELETE sin llamada → 1 rojo, decisión siempre `null` → 3
      rojos). Gates verdes sobre el árbol real: `tsc` 0, **4271 tests**, `eslint` 0 errores.

      **Dos hermanos de la misma familia, en el mismo commit:** el rótulo del motivo derivaba
      del rubro en el HTML de la confirmación y del recordatorio y en su versión de **texto
      plano** seguía diciendo «Tratamiento» en dental duro para los siete rubros; y el guard del
      cupo (`lib/agenda/cupo-de-correo-avisa.test.ts`) resolvía el aviso sólo si la función
      estaba definida en el MISMO archivo, así que fallaba **CERRADO** al reusar el helper
      compartido — su rojo mandaba a duplicarlo. Ahora sigue el import un nivel, y la mutación
      que le saca el aviso al módulo nuevo lo vuelve a poner en rojo.

- [x] 🔴 **CERRADO el 2026-09-10 (`f590421`, ya en `master` — verificado el 2026-09-10): el
      producto le ofrece al dueño configurar su zona horaria, la respeta en TODO el panel, y la
      ignoraba justo en las dos superficies que salen hacia el CLIENTE DEL CLIENTE.**
      `PATCH /api/clinic-settings` acepta `timezone` y `/settings` se la muestra como «Zona
      horaria» (`modelo-por-rubro.ts:47`); `/agenda`, `/dashboard`, `/billing` y los pagos leen
      `clinicSettings?.timezone`. Pero: `app/cita/page.tsx` —la pantalla que el paciente abre
      desde el correo para confirmar o cancelar— formateaba con `const tz = "America/La_Paz"`
      mientras su **propia acción hermana**, `app/cita/acciones.ts:50`, sí leía la del negocio:
      **la misma cita, dos horas distintas**, una en la pantalla del paciente y otra en el aviso
      que le llega al negocio. Y `app/api/cron/appointment-reminders/route.ts` mandaba el
      recordatorio diario con la constante, sin siquiera traer la columna
      (`clinicSettings: { select: { id: true } }`). Ahora la zona se resuelve **una vez por
      cita**, así el WhatsApp y el correo —que hablan de la misma cita— no pueden discrepar.

      **Por qué no lo veía ningún gate:** `lib/platform/fecha-en-zona-del-negocio.test.ts` exige
      que el formateo **pase** `timeZone`, y los dos lo pasaban — el valor era la constante. El
      gate miraba la PRESENCIA del parámetro y nunca el ORIGEN de su valor. Es la clase «la capa
      que todos auditan está sana»: como el panel entero deriva bien, nadie mira la pública.

      Gate nuevo: `lib/agenda/hora-de-la-cita-en-zona-del-negocio.test.ts`, sujetos derivados del
      DISCO (un archivo nace cubierto), 10 casos. Falló en rojo nombrando los dos.
      **Dos hallazgos de la validación por mutación, escritos y NO tapados:** revertir el cron a
      `formatDateTime(dt, TZ_POR_DEFECTO)` dejaba el gate VERDE (alias de alias), y ampliar el
      regex para cubrirlo **acusaba al arreglo correcto** (`?? "America/La_Paz"` es la cascada),
      que es la dirección cara. Queda como límite conocido con su caso.
      Gates: `tsc` 0 · 4228 tests · `eslint` 0 errores.

- [x] **CERRADO el 2026-09-10 (`969cc14`, ya en `master` — verificado el 2026-09-10): los otros
      dos sujetos de esa MISMA clase.** `app/(dashboard)/patients/[id]/page.tsx` trae ahora
      `clinicSettings: { select: { timezone: true } }` en el mismo `findUnique` que ya pedía el
      track, y `lib/export/datos-negocio.ts` cambió sus dos `Intl` de MÓDULO por
      `formateadoresEn(zona)` —construidos una vez por export, no por fila— alimentado desde
      `OpcionesExport.timezone`; su único llamador (`app/api/settings/export/route.ts`) se la
      pasa. Los dos salieron de `EXENTOS`: el gate falló en rojo nombrándolos antes del arreglo.

      **Tres agujeros del gate, medidos en esta vuelta y cerrados con su caso:**
      1. **Forma corta `{ timeZone }` — fallaba ABIERTO.** Sin `:` el patrón no matchea, así que
         el archivo dejaba de ser sujeto: con `const timeZone = "America/La_Paz"` los 10 casos
         daban VERDE sobre el defecto. Antes de ampliar se midió **a quién más acusa** (la
         lección de la vuelta anterior): de los 2 formateos con forma corta que hay en `app/` y
         `lib/`, los dos son sanos —reciben la zona por PARÁMETRO— y la ampliación los perdona.
      2. **Todo LLAMADOR del export pasa la zona.** `timezone` es opcional a propósito (sin ella
         se cae en `DEFAULT_TZ`, no en UTC), y eso abre el hueco que este proyecto ya pagó: el
         módulo impecable, sus gates verdes y `tsc` callado mientras el llamador no la pasa.
      3. **Ese caso mira la LLAMADA, no el archivo.** Preguntarlo sobre el archivo entero pasaba
         en VERDE con el argumento arrancado, porque el `timezone: true` del `select` que TRAE
         el dato lo absolvía: la línea que existe para arreglar el bug era la que lo tapaba.

      Y dos casos de **comportamiento** en el export, que es lo que ningún gate de forma ve: con
      otra zona la celda cambia (`08:30` en Ciudad de México contra `10:30` en La Paz, misma
      cita), y sin zona declarada cae en la cascada del producto.

      **El hueco simétrico de la ficha no necesita gate:** sacar `clinicSettings` del `select`
      lo caza `tsc` con `TS2339` —Prisma tipa el select— medido, no supuesto.

      Validado por mutación en **7 direcciones**, cada una confirmada por el veredicto impreso y
      no por ausencia de `FAIL`. Gates: `tsc` 0 · 4235 tests · `eslint` 0 errores.

      **Tropiezo de la entrega, que casi publica un árbol sin medir:** desde el nodo de casa el
      push de `onia-platform` está deshabilitado y la vía es
      `git format-patch | ssh … git am && git push`. El `am` aplicó el parche sobre el HEAD que
      tenía el VPS, que estaba **2 commits atrás de `origin/master`** — así que el árbol
      publicado NO era el árbol sobre el que corrieron los gates, y el push salió con exit 0
      igual. Se vio comparando `git rev-parse HEAD^{tree}` en las dos
      máquinas, que es el chequeo que la memoria compartida ya manda hacer y que acá encontró
      algo. Se corrigió mergeando `origin/master` **allá**, con lo que los dos árboles quedaron
      idénticos, y se **volvieron a correr los gates en el VPS sobre el árbol que aterrizó**
      (`tsc` 0, gate y export verdes) antes de alinear el local con `reset --hard`.
      ⚠️ **No le pasaba a ningún cliente todavía, y por eso no era 🔴:** las 10 orgs de
      producción están en La Paz, el `@default` de la columna — coincidían por casualidad, no
      por construcción.
      **Queda vivo el límite conocido del gate:** un alias de alias
      (`const TZ = DEFAULT_TZ` usado como valor) sigue sin cazarse; resolverlo pide un parser,
      no un regex, y está escrito como caso para que el día que alguien lo cierre el gate avise.

- [x] 🔴 **CERRADO el 2026-09-10 mismo día (`eaa67038` en master, PUBLICADO por el
      publicador 14:45 La Paz): el 403 mudo del login ahora ofrece reenviar el enlace.**
      Vive en `onia-platform/app/(auth)/login/LoginForm.tsx` (⚠️ corregido 2026-09-10: el cierre real `6e0b2905` metió todo en LoginForm, no en los archivos separados que planeaba este ítem).
      E2E completo contra producción con cuenta QA sin confirmar, fotografiado: login →
      cartel + botón "Reenviarme el correo de confirmación" → clic → aviso con tip de
      Spam/Promociones → reenvío real (`status=sent` 250 de Gmail 18:54:20Z) → el enlace
      (`/auth/confirm` con el mismo `token_hash` del correo) abre sesión y aterriza en
      `/onboarding`. El cooldown de GoTrue (~60s tras el correo del alta) responde 429 y la
      UI lo traduce a "esperá un minuto" — probado también. QA limpiado (2 orgs + 2 users,
      match exacto). Lo que NO prueba: la bandeja física (Gmail MCP caído) — eso sigue en
      el ítem de entregabilidad de arriba.

- [x] 🟡 **CERRADO el 2026-09-10 (chatbot-cola) — `bc48959`, rama del carril, PENDIENTE de
      merge a `master` y de deploy: el alta con nombre de negocio repetido decía "Error
      interno" (500) en vez de decir que ese nombre ya está usado.** Medido el 2026-09-10
      registrando por API dos veces el mismo `orgSlug`: choque de único en la base → 500
      crudo. El wizard de /register genera slugs con sufijo y casi nunca choca, pero el
      error existe y un 500 en el alta es la peor primera impresión. LISTO = registrar dos
      veces el mismo nombre devuelve un mensaje claro y el formulario lo muestra; test que
      lo fija.

      **La causa, leída en el código:** el choque de un `UNIQUE` lo tira Prisma como
      `P2002`, que **no** es `ProvisioningError`, así que se escapaba del `catch` tipado de
      `app/api/auth/register/route.ts` y caía en el 500 genérico "Error interno al crear la
      cuenta" — que no le dice al dueño **qué cambiar**.

      - **El arreglo va en `provisionOrganization`** (`lib/platform/provisioning.ts`), que es
        la puerta **única** del alta: así el alta manual del operador queda curada por la
        misma línea. Es la plantilla, no la instancia.
      - **El sujeto no es "el slug": es cualquier `P2002` del provisioning.** El mensaje se
        especializa por campo (`slug`/`name` → el nombre; `userId`/`email` → ya tiene cuenta)
        y el **default es honesto, no mudo**, así que un `@unique` nuevo nace cubierto en vez
        de volver al 500. Enumerar sólo los campos conocidos sería una lista de inclusión que
        falla **abierta** justo en la puerta de entrada del producto.
      - **Lo que NO es `P2002` se propaga tal cual.** La dirección cara del arreglo era
        tragarse una caída de la base y culparle el nombre al dueño; hay dos casos que lo
        fijan (error genérico y `P2003`).
      - **Sale 409, no 400** — por consistencia con el correo repetido, que ya salía así dos
        capas más arriba **en el mismo route**. El formulario muestra `result.error` para
        cualquier respuesta no-OK, así que el texto llega igual: verificado en el fuente y
        atado con un gate.
      - **Gate:** `lib/platform/alta-con-nombre-repetido.test.ts` (10 casos) +
        `app/api/auth/register/route.test.ts`. **Validado por mutación en 7 direcciones**, las
        7 en rojo: sin el `.catch` que traduce (6 casos) · traducir cualquier error y no sólo
        `P2002` (2) · campo desconocido de vuelta al 500 (1) · el route de vuelta a 400 fijo
        (1) · y las dos de **esquive del formulario** — pintar un texto fijo en lugar del
        mensaje del servidor (1) y arrancar el JSX del aviso (1).
      - ⚠️ **La primera versión del ancla del JSX pasaba en VERDE con el aviso arrancado.**
        Buscaba `{error}` en el archivo entero y la absolvía el
        `const { error } = await supabase.auth…` del alta con Google — una **desestructuración**,
        no un render. Se midió por **vecindad** del bloque `{error && (`. Sólo apareció
        mutando: el caso hueco no se ve leyéndolo.
      - Gates verdes sobre el árbol publicado: `tsc` 0 · **4.330** tests · `eslint` 0 errores.
        Árbol entregado idéntico al medido (`tree 701e194d`).

      ⚠️ **El párrafo de acá abajo NO es de este ítem: es el registro del botón de reenviar
      el correo, que se cierra en el `[x]` de arriba** (`eaa67038`, ya publicado). Quedó
      pegado bajo el bullet equivocado por una vuelta anterior; se conserva porque tiene
      detalle que el otro no (el conflicto de merge y por qué `/verify-email` no servía).

      **HECHO el 2026-09-10 (chatbot-cola) — `4d45f2f`, MERGEADO a `master` en `2f344e5` (integrador, 2026-09-10 15:5x La Paz).** ⚠️ Lo de «NO desplegado» venció el mismo día: el arreglo GEMELO de la sesión de control (`eaa6703`) ya está **vivo en producción** —`docker exec onia-platform grep -rl Reenviarme /app/.next/server` da un chunk—, así que el 403 mudo ya tiene salida para un cliente real. `4d45f2f` **no** es ancestro de `eaa6703`: son dos escrituras del mismo arreglo, y la rama resolvió el choque a favor del lado medible (`10952417`). Lo que falta desplegar de este ítem es sólo el reemplazo por la versión con gate.
      El botón y la decisión viven en `onia-platform/app/(auth)/login/LoginForm.tsx` (corregido: no en
      archivos separados — cierre real `6e0b2905`). Medido contra producción con un alta QA
      (`zz-qa-reenvio-2026-09-10-1852`, borrada al terminar: org/perfil/auth en **0/0/0**, y
      las 7 `zz-qa%` de otros carriles intactas):

      - **El 403 se reprodujo:** `POST /api/auth/login` sin confirmar → HTTP 403
        `email_not_confirmed`.
      - **El reenvío funciona, y su respuesta MÁS PROBABLE es un 429.** `POST
        /supabase/auth/v1/resend` con anon key devolvió primero
        `{"code":429,"error_code":"over_email_send_rate_limit","msg":"…after 43 seconds"}` y
        después `200 {}`. Por eso el botón trata el corte por frecuencia aparte ("Ya mandamos
        uno recién, esperá un minuto") y no como un error cualquiera.
      - **Salió de verdad, y es el segundo correo, no el del alta:** Postfix entregó DOS con
        **Queue ID distinto** — `E6AC01103710` (18:50:34, el del alta) y `EEB7E1103710`
        (18:51:44, **la hora exacta del reenvío**) —, los dos `dsn=2.0.0, status=sent (250
        2.0.0 OK … gsmtp)` con `opendkim … (s=mail, d=onia.com.bo)`. Se contó por Queue ID a
        propósito: confirmar una entrega por el destinatario cuelga el verde del correo
        anterior.
      - **El enlace del correo REENVIADO abre sesión:** `node scripts/alta_correo_confirma.mjs`
        → `[1] enlace → /onboarding · OK` y `[2] login → /onboarding · ENTRA`, exit 0, en un
        navegador que nunca vio el alta. Su token (`7cc3f936…`) ya **no** trae el prefijo
        `pkce_` que tenía el del alta del 31-ago.
      - **MIRADO renderizado**, no supuesto: los tres estados (el 403 con su salida ·
        "Reenviando…" deshabilitado · el cartel de mandado) con el CSS del build vivo, ya que
        producción todavía corre el build anterior. `/tmp/reenvio.png`. El icono es `send`,
        que ya está en la fuente subseteada — uno nuevo se vería como su NOMBRE en letras
        gigantes, que es el bug que un cliente vio en este mismo `/login`.

      **Lo que estaba escondido detrás:** `/verify-email` YA tenía un botón de reenvío y no
      servía para este caso — arranca con `supabase.auth.getUser()` y rebota a `/login` si no
      hay sesión, y el que no confirmó no tiene sesión **por definición**. La pantalla existía,
      alcanzable, bien escrita, e inútil justo para quien la necesitaba: es la familia
      «permiso concedido, CAMINO ausente» con el camino apuntando a una puerta que se cierra
      sola. Ver un arreglo hermano ya hecho es lo que hace dar la familia por cubierta.

      Gate real: `onia-platform/app/(auth)/login/LoginForm.test.ts` (3 casos del cierre `6e0b2905`; los 13 planeados no existen), validado en
      **6 direcciones** — incluida la de **esquive** (llamar al helper y mostrar "listo" sin
      mirar `.entregado`) y la de sacar el componente del JSX dejando el módulo intacto. Las 6
      dan rojo. El ancla que exige que el LoginForm lo USE se mide sobre el código **sin
      comentarios** y por **vecindad**: un gate se absuelve con su propia bitácora si busca en
      el archivo entero.

      ⚠️ **`master` traía el MISMO arreglo escrito por otra sesión, y el merge salió en
      conflicto — resuelto el 2026-09-10 en `86b0fe7`.** Las dos versiones guardan el correo
      que falló y ofrecen reenviar; la de `master` lo hace inline (`isEmailNotConfirmed`,
      `confirmEmail`) y **sin test**, y la de esta rama con el helper extraído. Se resolvió a
      favor del lado **medible** (13 casos + 6 mutaciones), y no se perdió nada: `diff` de la
      BASE contra `master` sobre ese archivo devuelve **sólo** fragmentos del mismo arreglo
      duplicado — `master` no tocó otra cosa ahí. Lo que el lado de `master` **no** tenía y se
      habría perdido eligiéndolo: la traducción del **429 `over_email_send_rate_limit`** de
      GoTrue, que es lo más probable que vea quien aprieta el botón, y el `entregado` que
      impide cantar "listo" sin que GoTrue lo acepte. Árbol publicado idéntico al medido
      (`tree 0a5e033d`, tsc 0 · 4.311 tests · eslint 0).

- [ ] 🔴 **Nadie probó que el correo de confirmación LLEGUE a una bandeja — y sin ese clic el
      alta nueva muere** (`app/auth/confirm/route.ts` · `scripts/alta_correo_confirma.mjs`)**.**
      Medido el 2026-09-10 con el circuito entero: GoTrue manda por Postfix
      (`onia-mail`), DKIM firmado, y Gmail aceptó con `250 OK` dos veces. Pero un 250 no es
      bandeja — "Gmail acepta y descarta" (skill `onia-verificacion`). El caso real que lo
      motiva: `sergio.urcullo.m@gmail.com` (alta del 31-ago, org Bolivian electricidad) pasó
      **10 días sin confirmar y sin poder entrar** — su enlace era del flujo PKCE viejo (el
      arreglo `/auth/confirm` con `token_hash` nació el 1-sep, un día tarde para él) y el 403
      del login (`email_not_confirmed`) no se lo contó nadie. Se le reenvió el 10-sep con el
      flujo nuevo y Gmail lo aceptó. LISTO = una alta QA de punta a punta donde el enlace se
      abre DESDE el correo recibido en una bandeja real (no spam), el login entra, y el
      SPF/DMARC de `onia.com.bo` queda verificado con el resultado pegado.

      **MEDIDO EL 2026-09-10 (chatbot-cola): el enlace del correo SÍ deja entrar, y queda
      UNA sola cosa sin probar — el veredicto de spam de Gmail, que no se puede mirar desde
      acá.** Alta QA real contra producción (`POST /api/auth/register`, org
      `zz-qa-correo-2026-09-10-0847`, correo `oninteligenciaartificial+zzqa09101247@gmail.com`,
      HTTP 200 en 1,6 s) y el circuito entero, paso por paso:

      - **Sale:** GoTrue registró `user_confirmation_requested` y Postfix lo relevó él mismo a
        `gmail-smtp-in.l.google.com` — `dsn=2.0.0, status=sent (250 2.0.0 OK … gsmtp)`, con
        `opendkim: DKIM-Signature field added (s=mail, d=onia.com.bo)` y
        `from=<business@onia.com.bo>`.
      - **Está autenticado, con el resultado pegado:**
        `SPF: v=spf1 ip4:187.77.16.63 include:_spf.mx.cloudflare.net ~all` (el 187.77.16.63 es
        el mismo IP desde el que Postfix entregó, o sea SPF alineado) ·
        `DMARC: v=DMARC1; p=none; rua=mailto:business@onia.com.bo; fo=1` ·
        `DKIM mail._domainkey.onia.com.bo: v=DKIM1;h=sha256;k=rsa;p=MIIBIjANBg…` (resuelve).
      - **El enlace que VIAJA en el correo funciona, y en OTRO navegador.** La plantilla
        (`app.onia.com.bo/correos-auth/confirmacion.html`, la que GoTrue descarga) arma
        `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup`; el token real de
        `auth.users.confirmation_token` era `pkce_f70615b…` — **el prefijo PKCE que mató al alta
        del 31-ago sigue ahí**, y aun así `/auth/confirm` lo canjea bien: aterrizó en
        `/onboarding` desde un contexto limpio, que es el caso normal (uno se registra en la
        compu y abre el mail en el teléfono). Capturado y MIRADO.
      - **El login entra** en un navegador que nunca vio el alta: `/login` con ese correo y su
        clave → `/onboarding`, con el nombre del negocio ya cargado. Capturado y MIRADO.
      - **Instrumento, para que esto no se vuelva a medir a mano:**
        `node scripts/alta_correo_confirma.mjs --email <correo> --password <clave>`
        (`npm run alta:correo-vivo`). Su `--self-check` (8 casos) va **cableado a la cadena
        `npm test`** como `test:alta-correo` — un instrumento vivo que queda de alias suelto no
        lo corre nadie —, y la medición viva queda aparte porque necesita producción. Validado
        por mutación: con `veredictoDelEnlace` siempre en verde, `exit 1` y 4 casos en rojo.
        Reconstruye la URL del correo desde la MISMA fuente
        que GoTrue en vez de inventarla, y prueba el login en contexto limpio a propósito —
        confirmar deja sesión en el navegador que abrió el enlace, así que probar ahí no
        probaría nada del login. Sale `2` (no medido) si no puede leer el token: un instrumento
        que no puede medir lo dice, no sale verde.
      - **Producción quedó limpia:** la org, su perfil y el usuario de Auth borrados (0/0/0), y
        las **5** organizaciones `zz-qa%` de otros carriles intactas.

      🔴 **Lo único que falta, y no lo puede hacer este carril: mirar si Gmail lo puso en
      Recibidos o en Spam.** El `250 OK` es aceptación, no bandeja, y el conector de Gmail pide
      una autorización que una sesión de loop no puede dar. Es una MIRADA de 5 segundos, no una
      investigación: el mensaje ya está en la cuenta, asunto **«Confirmá tu correo · Onia»**,
      para `oninteligenciaartificial+zzqa09101247@gmail.com`, del 10-sep 12:47 UTC (08:47 La
      Paz). Preguntado en el tablero: `t_040684cb`, `blocked` verificado con `show` (un `exit 0`
      de `block` no prueba que haya quedado bloqueada). Si contesta **Spam**, el arreglo es
      nuestro y no pide nada más de él: subir `DMARC` de `p=none` a `p=quarantine` y revisar el
      remitente. Si contesta **Recibidos**, el punto se cierra.

- [x] 🔴 **CERRADO el 2026-09-10 (`0735d5c`, ya en `master` — verificado el 2026-09-10): el
      recordatorio del add-on de WhatsApp salía hacia Meta con un número que WhatsApp no puede
      resolver, y lo tapaba un comentario que prometía justo lo que no hacía.**
      `lib/whatsapp.ts` decía *«Normalizar numero: quitar espacios, guiones, asegurarse de que
      empiece con codigo de pais»* y el código sólo hacía lo primero. **Un comentario que afirma
      una garantía que no cumple es peor que ninguno: desactiva la auditoría**, porque el que lo
      lee da el tema por resuelto.

      **Por qué es un defecto vivo y no teórico:** el propio producto pide el teléfono en dos
      formatos según el rubro — `placeholder="70000000"` en el alta de clientes de comercio y en
      la caja (8 dígitos), `"+591 70000000"` en los clínicos — y ni `wa.me` ni la Cloud API
      resuelven un número sin código de país. En producción ya hay un cliente cargado así
      (`patients.phone = 70000001`, contado el 2026-09-10). El resultado no es un error: el
      mensaje no llega, o llega a otra persona.

      **Y el repo YA lo sabía por escrito, desde el lado que RECIBE:**
      `lib/whatsapp/cliente-del-negocio.ts:44` documenta que *«el número llega de WhatsApp con
      código de país (`59171234567`) y el negocio suele haberlo guardado sin él (`71234567`)»*.
      Lo que faltaba era aplicarlo del lado que **ENVÍA**.

      **Cuatro superficies lo mandaban crudo y UNA normalizaba** —la pantalla de confirmación de reserva, con su copia
      local y su comentario explicando por qué—: el patrón *«arreglar la instancia y no la
      clase»*, con el hermano sano haciendo que la familia pareciera cubierta. Ahora las cinco
      comparten `numeroParaWhatsapp()`: `lib/whatsapp.ts` (recordatorio de cita y texto libre),
      `lib/onia-core/dispatch/channels.ts` (el link que el dueño toca tras aprobar una acción del
      agente), `app/api/n8n/whatsapp/send`, `/admin/solicitudes` (contactar a un lead del alta) y
      `app/(public)/book/confirm/[token]/page.tsx`, que entregó su copia.

      **`null` en vez de mandarlo igual.** Un número que no se resuelve NO se envía: entregar el
      recordatorio a un número mal formado no es intentarlo, es darle a un desconocido el nombre
      del paciente, su profesional y la hora de su cita. El llamador decide qué hacer con el
      `null` — no enviar, o pintar el dato sin enlace — en vez de heredar una decisión que el
      helper no puede tomar. Al unificar **no se amplió la semántica**: sólo móviles (6/7), el
      criterio que ya tenía la superficie que funcionaba; un fijo no recibe WhatsApp.

      ⚠️ **El gate nació HUECO dos veces, y las dos sólo se vieron mutando DESPUÉS de arreglar.**
      (1) Preguntar si el archivo *menciona* el helper deja pasar el esquive. (2) Corregido a
      variable→origen, seguía verde: `lib/whatsapp.ts` tiene dos funciones hermanas y **las dos
      llaman `phone` a su variable**, así que la sana absolvía a la rota por colisión de nombre.
      El sujeto tiene que ser **cada punto de salida** con la asignación que manda en ESE punto.
      Validado por mutación en cuatro direcciones (romper el arreglo con esquive · el exento que
      deja de cumplir su motivo · un consumidor nuevo, que el gate nombra · romper el prefijo).

      ⚠️ **Cuatro tests cementaban el defecto**: dos afirmaban el link `wa.me` sin el 591 como
      resultado correcto, uno el `+` en el body de Meta, y uno usaba `"123"` de fixture — con lo
      que probaba otra cosa que la que decía. Se corrigieron con su porqué al lado.

      **Verificación:** `npx vitest run` → 4213 pasan · `npx tsc --noEmit` → 0 ·
      `npx eslint .` → 0 errores. Contra los teléfonos REALES de producción: `70000001` →
      `59170000001`, y el lead `+591 57400703` → `null` (el `5` no es prefijo boliviano), que
      ahora se muestra marcado en vez de abrir un chat que no existe.

- [x] 🟡 **CERRADO el 2026-09-10 (`b25b2a3`, ya en `master` — verificado el 2026-09-10): el
      alta no mentía sobre el correo por una guarda equivocada, mentía sobre SÍ MISMA.** El
      síntoma era cierto (`POST /api/auth/register` → `emailDelivery: "not_configured"`,
      reproducido hoy) y **la causa escrita acá era falsa**, así que el LISTO pedía lo
      contrario de lo correcto. Los dos errores, medidos:

      - **`lib/email-governance.ts:47` (`isTransactionalEmailConfigured`) NO está en el camino
        que corre.** Con `EMAIL_PROVIDER=smtp` —que es lo que tiene el contenedor—
        `getTransactionalEmailConfig()` entra por su rama SMTP, valida `SMTP_HOST` (`onia-mail`)
        y el puerto, y **devuelve `configured: true` sin tocar `RESEND_API_KEY` ni una vez**. La
        configuración estaba sana; el guard acusado nunca se ejecutó.
      - **El welcome no sale porque NO CORRESPONDE, y eso está bien.** La respuesta del alta
        traía `confirmationPending: true` (el contenedor tiene `ONIA_REGISTRO_CONFIRMA_CORREO=si`
        — no aparecía en el `grep` de arriba porque su nombre no dice «EMAIL» ni «ALTA»), y con
        la confirmación pendiente el welcome se saltea a propósito: dice *«entrá al dashboard»* y
        todavía no puede entrar. **Mandarlo, que es lo que pedía el LISTO viejo, era el bug.**

      Lo roto era el LABEL: la variable arrancaba en `"not_configured"` y nadie la volvía a
      tocar en ese camino, así que el alta reportaba *«no hay correo configurado»* sobre un SMTP
      que en el mismo segundo estaba entregando el mail de confirmación. Un estado que se lee
      como diagnóstico y dice otra cosa manda a arreglar lo que funciona — y ya lo hizo: escribió
      este ítem.

      **Arreglo:** estado nuevo `"no_corresponde"` (el welcome se salteó por diseño, no por
      configuración rota), y el cuerpo del éxito se arma en **un solo lugar**. Eso de paso cierra
      un agujero del honeypot: su éxito FALSO se armaba aparte y **le faltaba
      `confirmationPending`**, o sea que un bot distinguía las dos respuestas comparándolas,
      justo lo que el comentario del honeypot promete que no pasa.

      **Gate:** dos casos en `app/api/auth/register/route.test.ts` — *«switch ENCENDIDO + correo
      configurado: dice no_corresponde, nunca not_configured»* y *«el éxito falso es IDÉNTICO al
      real, también con la config de producción»*. El mock de `email-governance` estaba clavado
      en `configured: false` para toda la suite —el escenario **contrario** al de producción, por
      eso el caso no se podía escribir— y ahora se prende por caso. Validado **por mutación en 2
      direcciones** (honeypot con cuerpo propio · volver a `not_configured`): las dos `exit 1`, 2
      casos en rojo cada una; base y restaurado, 17/17. Gates: `tsc` 0 · `vitest` 4185 · `eslint` 0.

- [x] 🔴 **CERRADO el 2026-09-10 (`afa9da6`, ya en `master` — verificado el 2026-09-10):
      el botón «Agendar» que ve el cliente del cliente lo mandaba a un callejón, teniendo el
      sistema el enlace bueno en la mano.** La pantalla **«Mis Citas»**
      (`/book/my-appointments/<token>` — el enlace que el negocio le manda por WhatsApp a su
      cliente) cerraba con *«¿Necesitás otra cita? · Reserva en segundos, sin registro»* y un
      botón **Agendar** → `/book`. Y `/book` **no puede reservar**: se vació a propósito el
      2026-08-19 porque listaba a todos los clientes de Onia con nombre, teléfono y correo, así
      que hoy sólo dice *«Pedí su enlace directo de reserva o buscalo en sus redes sociales»*.
      O sea: al que estaba mirando el nombre, la dirección y el teléfono de su negocio tres
      tarjetas más arriba, lo mandábamos a conseguir el enlace por su cuenta. Segunda instancia
      en el pie de `/contact`: *«Agenda pública»* → el mismo callejón.

      **Por qué ningún gate podía verlo, que es lo reusable:** los que vigilan enlaces preguntan
      si el destino **existe** —404, redirect, host muerto— y `/book` responde 200, renderiza
      perfecto y su texto es honesto **para quien llega de afuera**. No sobra ni falta una
      palabra, así que ningún barrido de literales, precios, obra ni vocabulario lo alcanza. Lo
      que está mal es el **par**: de dónde viene el que aprieta y qué puede hacer al llegar. Es
      el escalón inverso de *«una promesa que cambia se barre en toda la superficie»* — acá lo
      que cambió fue la **capacidad del destino**, y por eso los textos de origen siguieron
      siendo ciertos palabra por palabra.

      **Arreglo:** el `GET` de `/api/booking/appointments` trae el `slug` y decide con
      `puedeRecibirReservasPublicas` —el **mismo** helper que las tres puertas de `/api/booking`—,
      y devuelve `reservaUrl`: **enlace o `null`**, nunca un slug pelado que obligue a la pantalla
      a adivinar (ése es el retorno ambiguo que ya nos costó una promesa falsa en el alta). El CTA
      cuelga de ese dato, así que a un negocio **vencido**, **sin el add-on** o de un **rubro sin
      agenda** no se le ofrece «reserva en segundos» en lugar de mandarlo a una pantalla que lo
      rechaza.

      **Gate:** `app/(public)/book/agendar-lleva-a-agendar.test.ts`. El sujeto se deriva del disco
      **en las dos puntas** y no hay lista negra: qué pantallas agendan sale de cuáles llaman al
      POST que crea la cita —exigiendo `method: "POST"`, porque `confirm` y la propia «Mis citas»
      también nombran esa URL y sólo **leen**—, así que `/book` vuelve a ser destino válido el día
      que vuelva a reservar. El logo del encabezado **se exime solo** por no tener texto, y esa
      exención se re-mide en cada corrida en vez de estar escrita.

      ⚠️ **La primera versión del gate se apagó con su propio arreglo**: su sujeto era «href
      literal a `/book`», y al pasar el CTA a `href={…reservaUrl}` esa forma desapareció del disco
      y el gate se quedó sin nada que mirar. **Lo cazó el caso de anclaje**, no la lectura.
      Validado **por mutación en 7 direcciones** (CTA al índice · «Agenda pública» de vuelta ·
      condición quitada · sin `slug` · sin helper · dos esquives que borran el CTA entero): las
      siete `exit 1`, base y restaurado `exit 0`. El esquive además destapó que buscar
      `reservaUrl` suelto en el archivo pasaba con el CTA borrado —lo nombra la interfaz—, así
      que ahora se exige **dentro del `href`**.

      **Gates:** `npx tsc --noEmit` exit 0 · `npx vitest run` **4183 pasan / 335 archivos** ·
      `npx eslint .` 0 errores.

- [x] 🔴 **CERRADO el 2026-09-08 (`f8d0fc2`, ya en `master` — verificado el 2026-09-10):
      la pantalla donde el dueño PAGA le cobraba a 3 de los 5 rubros de la v1.0 dos pantallas
      a las que nunca iba a poder entrar.** La tarjeta del plan **Profesional** —el destacado,
      el salto de Bs 320 a Bs 750— decía *«Reportes completos y facturas recurrentes»* a
      **comercio, importadora y servicios profesionales**. Medido sobre `VERTICAL_PACKS`, no
      deducido: ninguno de los tres declara `/reports` ni `/billing/recurring`, así que no hay
      enlace **y** el layout los devuelve a `/dashboard`. La promesa no se podía cumplir ningún
      día, y se cobra en `/checkout` y en la tab «Mi Plan».

      **Por qué sobrevivió, que es lo reusable.** El 08-sep se cerró exactamente esto en la
      **tabla comparativa** de `/settings` (filtrar `plan.features` por `f.pantalla` con
      `entregaLaPantalla`), y la lista `enciende` de `lib/subscription/plan-display.ts` —texto
      plano, sin metadato de pantalla— quedó afuera: **el arreglo curó la instancia y no la
      clase, y la instancia que quedó sin curar es la que se cobra.** El gate hermano
      (`plan-display.test.ts`) contrasta cada bullet contra **quién lo enciende por PLAN**
      (`PLAN_LIMITS`), y esa pregunta no puede ver la otra mitad: una capacidad puede estar
      encendida por plan y ser **inalcanzable por rubro** al mismo tiempo.

      **El mismo barrido encontró sus hermanas, todas del mismo origen** — el copy preguntaba
      «¿qué rubro es?» con listas de tracks escritas a mano (`esDental`, que es la negación de
      otras dos) en vez de preguntarle al pack qué entrega:
      · *«Agentes Recall y Cobrador»* seguía nombrando al Recall en comercio, importadora y
        ganadería **un día después** de que `64279ff` lo acotara — la promesa no se barrió
        donde se vende, sólo donde se apagó el motor;
      · *«Reservas online»* se le ofrecía a **ganadería**, que no tiene agenda, y **no** a
        **servicios profesionales**, que sí la tiene y la paga (promete de menos);
      · *«Recordatorios automáticos por email»* a rubros sin agenda — el único correo
        automático al cliente del cliente es el de **cita**;
      · *«Kardex de inventario con costos»* a servicios profesionales, que vende un catálogo de
        servicios y no declara ninguna pantalla de stock;
      · el salto *«dejás de perder pacientes»* a una ganadería, por el mismo `esDental`.

      **Arreglo:** cada bullet se le pregunta al **pack** con el predicado canónico
      (`entregaLaPantalla` / `rolCorreEnTrack`). Y para que el Profesional de comercio e
      importadora no quede vendiendo el aire que se le sacó, se nombra **lo que sí les
      enciende y estaba sin decir**: contabilidad completa (IVA y Libro de Compras y Ventas) y
      planilla del mes, que montan sobre `reportsEnabled` igual que `/reports`
      (`canUseFullAccounting`, `canUseRrhhPlanilla`) pero viven en pantallas que esos packs sí
      tienen.

      **Prueba:** el gate nuevo (`lib/subscription/plan-promete-lo-que-el-rubro-alcanza.test.ts`)
      en **ROJO antes del arreglo nombrando 28 promesas** con su rubro, su plan y su predicado,
      y **validado por mutación en 4 direcciones, las 4 en rojo**. Su sujeto es el **universo**
      —los 8 tracks de `VERTICAL_PACKS` × los 3 planes × salto y bullets—, no una lista: el
      hermano mira 4 tracks escritos a mano y por eso el bullet de ganadería sobrevivió. Cubre
      las **dos direcciones** (promete de más y promete de menos) y exige que ningún bullet
      quede sin clasificar y que ninguna exención sobre. `tsc` 0 · **4174 tests** · eslint 0.

      **Pendiente anotado, no hecho:** el bullet *«Fiados: quién te debe y cuánto»* usa esa
      palabra para los cuatro rubros de comercio, y el menú de servicios profesionales llama a
      esa pantalla **«Por cobrar»** y el de importadora **«Créditos»** (el helper ya existe:
      `lib/comercio/idioma-de-credito.ts`). No es una promesa falsa —la pantalla está—, es
      vocabulario.

      ⚠️ **Commiteado, NO desplegado**: el cliente no lo ve hasta que Sergio Urcullo apruebe el
      pedido de deploy vivo de la plataforma.

- [x] 🔴 **CERRADO el 2026-09-08 (`f2237e8`, ya en `master` — verificado el 2026-09-10):
      la pantalla donde el dueño configura el asistente que PAGA le ponía ejemplos de otro
      rubro.** `/settings/chatbot` (add-on de Bs 390/mes) tenía dos ejemplos tipeados en un
      rubro para los ocho: el rótulo de la categoría decía **«Veterinaria»** y el nombre del
      ítem decía **«Ortodoncia»** — que es literalmente el `ejemploServicio` dental. Un
      comercio, una importadora o un estudio contable configuraban su bot leyendo ejemplos de
      dos negocios ajenos, con los campos de al lado ya derivando bien de su rubro.

      **Por qué ningún gate podía verlo, que es lo que valió la vuelta.** Los dos gates de copy
      multi-rubro descartan los textos de **una sola palabra** —`if (!texto.includes(" "))
      continue`, puesto para no ahogarse en identificadores y clases CSS— y un ejemplo de
      formulario casi siempre *es* una palabra sola: la familia (rubro, texto) tenía una rendija
      por la que pasa justo su caso más escondido. Ni el sujeto ni el patrón estaban mal; lo que
      deja ciego al gate es un filtro puesto por un buen motivo, que se conserva. Y encima
      `/settings/chatbot` es **subruta**: la fila de cobertura declara `/settings` cubierta por
      `planes-en-el-idioma-del-rubro.test.ts`, un gate sobre PLANES que nunca la mira. Dos
      motivos independientes, los dos cerrados.

      Es la **cuarta** pasada por esta familia: `vocabulario.ts` ya documenta `ejemploServicio`
      (01-sep, catálogo), `ejemploRegistro` (07-sep, ficha) y `ejemploPalabras` (esta misma
      pantalla, tres campos) — y las tres veces el comentario dice *«arreglar la instancia y no
      la clase»*. Por eso el gate nuevo (`lib/platform/ejemplo-de-formulario-por-rubro.test.ts`)
      deriva su sujeto del **disco** — `app/(dashboard)` y `components/` enteros, 134
      placeholders mirados—, no de una lista: un formulario nuevo nace cubierto y hay que
      eximirlo a mano, a la vista. Las dos exenciones (`/admin`, panel interno de Onia) son por
      literal exacto y se **re-miden**: si el texto eximido desaparece, su fila se pone roja en
      vez de pre-aprobar el hueco.

      **Prueba:** el gate en ROJO antes del arreglo nombrando los dos placeholders con su
      archivo, y **validado por mutación en 4 direcciones, las 4 en rojo** — revertir cada mitad
      del arreglo, devolverle al gate el filtro de una palabra, y recortarle el árbol
      `components/`. `tsc` 0 · **4153 tests** (eran 4030) · eslint 0 errores.

      ⚠️ **Commiteado, NO desplegado**: el cliente no lo ve hasta que Sergio Urcullo apruebe el
      pedido de deploy vivo (`t_daa8750c`), que hoy publica 9 arreglos + éste.

- [x] 🔴 **CERRADO el 2026-09-08 (`64279ff`, ya en `master` — verificado el 2026-09-10):
      el Recall corría todos los días en tres rubros que no tienen a quién reactivar, y tres
      rubros pagaban agentes sin una pantalla donde verlos.**

      `AGENT_KINDS` gatea por **add-on** (`requiresFeature`) y **no por rubro**, mientras
      `runAgentsForAllOrgs` enumera las orgs por **plan** (Pro+). De ahí salen dos defectos que
      ningún gate del proyecto podía expresar: no sobra ni falta una palabra, la pantalla
      renderiza bien, y el vocabulario por rubro ya estaba arreglado (`agents-rotulos.ts`,
      06-sep) — así que el gate vecino estaba **verde sobre el defecto**.

      1. **El Recall lee `patient` + `appointment`.** Comercio, importadora y ganadería no
         guardan clientes en la ficha ni tienen agenda: corría a diario sobre una tabla vacía
         por construcción y devolvía `[]` siempre. **Falla mudo** — la corrida cierra
         `completed` con 0 propuestas, que es indistinguible de un día sin nadie a quien
         reactivar. Y si hubiera producido algo, el borrador ofrece *«¿Te agendamos una cita?»*
         a un negocio sin agenda.
      2. **Al revés:** el runtime les corre agentes a rubros que **no tienen `/agents`** ni en
         el menú ni permitido por el layout. Pagan plan Profesional por una función que el
         motor **escribe** (corridas, acciones, aprobaciones) y que no pueden ver, pausar ni
         configurar. Es la **quinta** de la familia «permiso concedido, CAMINO ausente»
         (`/requerimientos`, `/empresa`, `/rrhh`, `/prescriptions`), y la primera en que el
         motor escribe de verdad.

      **Medido en la base de producción**, no razonado:
      `zz-qa-ferreteria-tornillo-ommbt` **22 corridas**, `bolivian-electricidad-e6t21` **10**,
      `qa-modulos-rj7tv` **2** — las tres con **0 acciones** producidas y sin `/agents` en su
      menú. `gestios-servicios-profesionales` (v1.0) era el único con el Recall **útil** —
      tiene ficha y agenda — y sin dónde verlo.

      **El arreglo le pregunta al PACK**, con el predicado canónico
      (`guardaClientesEnPatients`), nunca a una lista de tracks escrita al lado; y es
      **fail-closed** ante un track desconocido, porque adivinar que sí tiene los datos es
      exactamente como se coló esto. Cobrador y Captador **no** se acotan: el primero ya
      ramifica por rubro (`COMERCIO_TRACKS`, fiados vs facturas) y el segundo lee los
      `WorkItem` del intake, que existen en los siete packs — acotarlos sería apagar una
      función que anda.

      **Sujeto derivado del universo** (`VERTICAL_PACKS` × roles, y `RUBROS_ACTIVOS` para el
      camino), así que un rubro o un rol nuevo nace cubierto. **Validado por mutación en 4
      direcciones, las 4 en rojo**: sacar el acote (6 casos), romper el fail-closed (1),
      revertir el camino de servicios profesionales (1), y recortar el sujeto a un subconjunto
      cómodo (1). Archivos: `lib/onia-core/modules/agents-por-rubro.ts` (+ su test),
      `agents-runtime.ts` (gate por rubro antes de `ensureAgentForOrg` ⇒ cero writes),
      `vertical-pack.ts` (el camino en los 3 navs) y `agents-view.tsx`.
      Gates: `tsc` 0 · `vitest` **4023** verdes · `eslint` 0.
      ⚠️ **Commiteado y en la rama, NO desplegado**: viaja con el pedido de deploy de
      `plataforma` (`t_daa8750c`), donde quedó comentado el sha.

- [x] 🔴 **CERRADO el 2026-09-08 (`cc383c1`, ya en `master` — verificado el 2026-09-10):
      tres de las cuatro organizaciones que PAGARON el add-on de WhatsApp no lo tenían, según
      el producto — sin recordatorio de cita, sin intake, y con el cartel de venta encima.**

      El add-on tiene **dos fuentes** y sólo `isWhatsAppAddonActive` (`lib/plan-limits.ts`) mira
      las dos: la columna vieja `organizations.whatsappAddon` **o** la capacidad
      `addon.whatsapp` de `organization_entitlements`. Medido en producción ese día:

      | org | `whatsappAddon` | `addon.whatsapp` |
      |---|---|---|
      | `clinica-sergio-p2ljs` | `t` | `active` |
      | `onia-interna` | `f` | `active` |
      | `zz-qa-clinica-chatbot-9k651` | `f` | `active` |
      | `zz-qa-ferreteria-tornillo-ommbt` | `f` | `active` |

      Para esas **tres**, cada punto que leía la columna cruda contestaba «no lo tenés»:
      el cron **no le mandaba el recordatorio de cita al paciente** (y el paciente no se entera
      de que le faltó un aviso); el intake de ONIA Core **descartaba la consulta** que entraba
      por WhatsApp; `/api/n8n/whatsapp/send` daba 403; el canal de Instagram/Messenger daba 403
      y su `GET` mandaba dibujar «contratalo» a quien ya lo tenía; `/settings`,
      `/settings/addon-chatbot` y `/communications` le ofrecían **comprar lo que ya pagó**; y el
      circuito de cobro le aceptaba **pagarlo de nuevo**.

      **Por qué nadie lo veía, que es lo que se arregló de fondo:** el 2026-09-04 se cazó este
      mismo defecto en `/settings/chatbot` y se lo ató con un gate cuyo sujeto es el `page.tsx`
      **de esa carpeta**. Se arregló la instancia y la clase quedó abierta. No sobra ni falta una
      palabra, la pantalla renderiza perfecto, no es un rubro, y `whatsappAddon` es una columna
      real del schema: `tsc` está contento.

      **El gate de clase** (`lib/platform/addon-whatsapp-un-solo-criterio.test.ts`) deriva los
      sujetos del **disco**, así que un lector nuevo de la columna nace cubierto y hay que
      excusarlo a la vista; y **cada excusa se re-mide**, porque una excusa que se pudre deja
      entrar el defecto siguiente pre-aprobado. Validado por **5 mutaciones**, todas verificadas
      de que entraron: revertir el arreglo del cron → rojo nombrándolo · excusa sobrante → rojo ·
      barrido vacío → rojo · detector ciego → 3 casos en rojo · sin filtrar comentarios → rojo.

      ⚠️ **La primera versión del gate enumeraba FORMAS de decidir** (`if`, `?:`, `&&`, `!`,
      prop JSX) **y se le escapó la más silenciosa**, que estaba viva: el `GET` de
      `/api/chatbot-canal-meta` hacía `addon: Boolean(org.whatsappAddon)` — la columna no decide
      ahí, se le **manda al navegador para que decida allá**. La cazó un test hermano, no el
      gate. Enumerar formas es una lista de inclusión y falla abierto; el sujeto correcto es
      **leer la columna**, y quien de verdad tenga que hacerlo se declara.

      **Gates:** `tsc` 0 · `vitest` **3971 pasan / 326 archivos** · `eslint` 0 errores.
      ✅ **Ya está en `master`** — medido el 2026-09-11 01:05 La Paz. Este pie decía «NO mergeado
      a `master`» mientras el encabezado del MISMO ítem ya decía «ya en `master`»: el ítem se
      contradecía solo, porque al actualizar el encabezado nadie barrió su pie. Y citaba el
      pedido `t_daa8750c`, que hoy figura **archived** — un puntero a una tarea escrito a mano
      caduca cuando el pedido se rehace. El pedido vivo **se deriva, no se copia**:
      `node scripts/deploy_sin_pedido.mjs` lo nombra; `bash /opt/onia-platform/_deploy/publicar.sh --dry-run`
      da la cifra honesta de lo que falta publicar.

- [x] 🔴 **CERRADO el 2026-09-08 (`c334440`, ya en `master` — verificado el 2026-09-10):
      el correo del trial sólo sabía hablar en dental o en mostrador, y de los cinco rubros de
      la v1.0 los tres del medio caían del lado equivocado.**

      El drip es la **única superficie del producto que le escribe al dueño sin que él entre**:
      cinco correos (días 3, 7, 12, 14 y 15) con **un solo botón**, en la semana en que decide
      si paga. Partía a los rubros con `trackId === "dentagest-clinical"` — los **dos
      extremos** — y todo lo que no era dental entraba como mostrador:

      | rubro (v1.0) | lo que recibía | lo que es |
      |---|---|---|
      | Estética y spa | día 3: contaba `oniaCommerceProduct`, tabla **vacía por construcción** → «todavía no cargaste tus tratamientos» con 40 clientas adentro; el botón iba a `/comercio/inventario`, que su pack **ni tiene en el menú** → redirect mudo a `/dashboard`. Día 7: «no registraste ninguna venta» con la agenda llena | guarda a sus clientas en `patients` y vive de la **agenda** |
      | Servicios profesionales | lo mismo | igual |
      | Importadora y comercio | correcto | correcto (por eso nadie lo vio) |

      **La clase, que es lo que importa:** un predicado de **dos extremos** no puede describir a
      cinco rubros, y el del medio no lo delata ninguno de los dos que sí funcionan. Es la
      misma firma que ya pagamos en `datos-negocio.test.ts` (un gate que probaba dental y un
      comercio), pero acá el defecto no estaba en el gate: **estaba en el producto**, y en la
      única superficie que sale a buscar al cliente. Ningún barrido de literales, precios, obra
      ni vocabulario puede verla: no sobra ni falta una palabra — el número es real y sale de
      la base, lo que está mal es **de qué tabla**.

      **Arreglo:** los tres predicados se **derivan del pack**
      (`onia-platform/lib/subscription/drip-por-rubro.ts` →
      `guardaClientesEnPatients`, `tieneAgenda`, y la ruta buscada **en el nav de ese pack**),
      misma doctrina que sus hermanos de `vertical-pack.ts`: un rubro nuevo cae solo del lado
      que le toca. La excepción de la importadora (cuenta cotizaciones además de ventas) queda
      intacta. La decisión **salió del `route.ts`** porque un route de Next no puede exportar
      helpers: mientras vivió ahí adentro **no había forma de gatearla**.

      **Verificado midiendo, no leyendo:**
      - El cron **está vivo**: `0 13 * * * /root/bin/run-onia-trial-drip.sh` (09:00 La Paz) y
        `public.onia_trial_drip_sends` lleva **13 envíos reales**; hoy 13:00 UTC salió el paso 7
        a `bolivian-electricidad-e6t21`. Hoy hay dos orgs en trial de los rubros afectados
        (`zz-qa-estetica-modulos-6tzgb`, `qa-modulos-mrk0q`) que **todavía no recibieron** su
        primer paso — o sea que esto se arregló antes de que saliera el primer correo torcido.
      - **Mutación en las dos direcciones:** con el predicado viejo en el módulo caen **3**
        casos; devolviéndolo al cron cae el **del llamador** — el caso que existe porque el
        módulo puede quedar impecable y el cron seguir con su ternario, con el gate en verde y
        `tsc` también.
      - Gates sobre el árbol real: `tsc` 0 · `vitest` **3905/3905** · `eslint` 0 errores.

      ⚠️ **Ambiental, para el que corra gates en el VPS:** allá `npx tsc --noEmit` daba 2
      errores sobre `avisadoAgotadaAt` en `lib/chatbot/cupo.ts` — el schema lo declara y el
      cliente Prisma generado no. **No era el cambio:** `npx prisma generate` y `tsc` pasó a 0.

- [x] 🔴 **CERRADO el 2026-09-08: once acciones del panel le confirmaban al dueño —con el
      parpadeo de la pantalla— cosas que el servidor había rechazado.** Cancelar una cita,
      reprogramarla, dar de baja a un empleado, borrar a alguien del equipo, guardar los
      horarios de atención: `await fetch(...)` y en la línea siguiente `router.refresh()` /
      `window.location.reload()`, sin mirar una sola vez qué contestó el servidor.

      **La clase, que es lo que importa.** El 2026-09-08, más temprano, se cerró el camino de
      fallo de `onia-platform/app/(public)` —la superficie del cliente del cliente— y **su familia simétrica,
      el panel donde trabaja el DUEÑO, quedó abierta**. Es la tercera vez que este carril paga
      lo mismo: al cerrar el hueco de una familia hay que preguntar cuál es la simétrica.

      Y la pregunta del gate del panel **no es la de allá**. Allá el `fetch` TIRA (se cortó la
      red) y lo ataja un `try`/`catch`. Acá **la respuesta LLEGA**, con un `403 «Tu suscripción
      ha vencido»`, y ningún `catch` la ve: para enterarse hay que leer `.ok`. Un archivo puede
      tener sus cuatro `catch` en orden y estar ciego a todos los rechazos del servidor.

      **El disparador no es raro:** `checkPlanExpiry` corta **todas** las escrituras de una
      organización con la suscripción vencida (los `GET` siguen pasando). El día que vence, cada
      uno de estos botones miente en vez de explicar por qué no funciona.

      **Por qué era peor que quedarse mudo:** en cuatro de los once la pantalla además *actuaba*
      el éxito. `settings` sacaba a la persona de la lista del equipo (`setTeamMembers(prev =>
      prev.filter(...))`) — desaparecía de la pantalla y **seguía teniendo acceso al sistema**;
      `treatments` la sacaba del catálogo; el interruptor de avisos por correo se movía y no
      volvía nunca. El producto no callaba: **afirmaba lo contrario de lo que había pasado**.

      | dónde | qué daba por hecho sin preguntar |
      |---|---|
      | `onia-platform/app/(dashboard)/appointments/page.tsx` ×3 | cancelar · marcar completada · **cambiar la fecha** (cerraba el modal: el paciente seguía citado a la hora vieja) |
      | `onia-platform/app/(dashboard)/settings/SettingsClient.tsx` ×4 | borrar del equipo · borrar profesional · **guardar horarios** (de ahí sale la agenda) · avisos por correo |
      | `onia-platform/app/(dashboard)/empresa/EmpresaClient.tsx` | borrar un gasto y su crédito fiscal |
      | `onia-platform/app/(dashboard)/rrhh/RrhhClient.tsx` | dar de baja / reactivar a un empleado |
      | `onia-platform/app/(dashboard)/treatments/TreatmentsClient.tsx` | borrar un servicio del catálogo |
      | `onia-platform/app/(dashboard)/patients/[id]/prescriptions/PrescriptionsClient.tsx` | borrar una receta |

      **Por qué ningún gate podía verlo:** no sobra ni falta una palabra —los barridos de copy,
      obra, rubro y precios pasan verdes—, la pantalla renderiza perfecto (la captura también), y
      `await fetch(...)` sin usar el resultado es TypeScript válido y `eslint` limpio. En los
      seis archivos **el alta de al lado SÍ mira la respuesta y avisa**: cuando el hermano sano
      está a diez líneas, el archivo se lee como cubierto.

      **Atado en** `onia-platform/app/(dashboard)/camino-de-fallo.test.ts` (12 casos), con el detector
      `escriturasSinMirarLaRespuesta` en `onia-platform/lib/superficie-publica/cobertura-de-fallo.ts` y el
      helper `onia-platform/lib/http/mensaje-de-error.ts`, que muestra el motivo que ya manda la ruta
      («Tu suscripción ha vencido…») en vez de un «algo salió mal». Sujeto derivado del disco y
      **un exento por literal exacto**, no por ruta: `onia-platform/app/(dashboard)/profile/MfaSection.tsx:144`, limpieza
      best-effort después de que el factor ya se borró, con un caso que se pone rojo si el
      exento se pudre.

      ⚠️ **Un agujero del gate lo encontró la MUTACIÓN, no la lectura:** la primera versión
      buscaba `.ok` sobre el texto crudo, así que **un comentario que lo nombrara absolvía a la
      llamada que ese mismo comentario describe** — el guard avalado por su propia bitácora. Se
      arregló mirando sólo código real y quedó anclado en un caso.

      **Validado por mutación en las dos direcciones**, cada una confirmada por su línea
      `Tests N failed`: revertir un arreglo → rojo; esquivar poniendo `res.ok` en un comentario →
      rojo; arreglar el exento (sobra) → rojo; **pantalla nueva con el defecto → rojo** (el
      barrido la alcanza); detector siempre-vacío → 4 rojos. Base: 12 verdes.

      **Gates:** `tsc` 0 · `vitest` 3885 verdes (315 archivos) · `eslint` 0 errores.
      Commit `029c915` en `onia-platform`, rama `claude/chatbots-platform-review-0d1d09`.
      ⚠️ **Commiteado y en la rama, NO desplegado**: falta que `onia-cola` lo mergee a `master`
      y que el swap lo publique, así que **el cliente todavía ve los once botones mintiendo**.

- [x] 🔴 **El enlace de reserva que el negocio manda por WhatsApp le vendía el panel a su cliente
      — cerrado el 2026-09-08 (`b4b2e34` en `onia-platform`, publicado en la rama, falta que el
      integrador lo mergee a `master`).**
      Gates nuevos: `app/(public)/head-de-la-superficie-publica.test.ts` (5 casos, sujetos
      derivados del disco) y `app/(public)/book/[orgSlug]/tarjeta-del-negocio.test.ts` (5 casos).

      **Medido en producción**, `curl -A 'WhatsApp/2.23.20.0'` sobre el enlace de una clínica
      real (`app.onia.com.bo/book/clinica-sergio-p2ljs`, HTTP 200, 28.336 B): el `<head>` era el
      del layout **raíz**, o sea el del panel de gestión.

      ```
      <title>Onia | El sistema con IA que maneja tu negocio en Bolivia</title>
      <meta property="og:url" content="https://app.onia.com.bo">
      <meta name="robots" content="index, follow">        (+ max-snippet:-1)
      ```

      Al paciente que abre ese enlace le llegaba **la tarjeta del software** —dirigida al dueño,
      que no es quien la recibe— y con la `og:url` apuntando a la raíz en vez de a su reserva.
      La vista previa se lee **antes** de abrir la página: es lo único que ve el que no entra.

      Y el agravante que no era de copy: las rutas que llevan un **token** en la URL
      (`/portal/[token]`, `/book/my-appointments/[token]`, `/book/confirm/[token]`) muestran los
      datos de **una** persona y se declaraban `index, follow` con snippet ilimitado. `robots.txt`
      no las excluye — el de Cloudflare es `User-agent: * / Allow: /`, verificado el mismo día.

      **Por qué sobrevivió, y es la clase:** `app/(public)` es la superficie que ve el **cliente
      del cliente**, y su `<head>` no lo mira ningún instrumento del proyecto — no sale en
      captura (no es visible), no sobra ninguna palabra (cada frase es correcta *para el panel*),
      y los barridos de rubro y de copy derivan sus sujetos de `app/(dashboard)` y `components/`.
      El gate de compartir/OG que sí existe vive en `web-venta` y mira `onia.com.bo`, otra app.

      El arreglo condiciona la promesa en vez de borrarla: `/book/[orgSlug]` arma su `<head>` con
      el nombre del **negocio** (`title: { absolute }`, o Next le pega el template `"%s | Onia"`
      del layout raíz) y deriva su `og:url` y su `canonical` del slug; si el slug no existe o la
      base no contesta cae a un título neutro y **no tira** —una excepción en `generateMetadata`
      voltearía una página que funciona—. `/book/*` y `/portal/[token]` pasan a `noindex`: no
      apaga nada (siguen sirviendo 200 y WhatsApp dibuja la tarjeta igual), y además evita que
      el buscador reconstruya el índice central de `/book` que se retiró a propósito porque
      exponía la cartera de clientes de Onia.

      ⚠️ **Los dos gates pasaron en VERDE con el arreglo arrancado, y sólo se vio mutando.** La
      bitácora que explica *por qué* va `index: false` contiene ese mismo texto, así que el gate
      se absolvía con su propia explicación; y `openGraph` matcheaba dentro de `openGraphXX`. Se
      mide sobre **código sin comentarios** y con límites en los patrones. Validados por mutación:
      4 + 3 mutaciones, cada una **verificada de que entró** antes de leer el veredicto.

      Gates: `tsc` 0 · `vitest` **3847** verdes · `eslint` 0 errores.
      ⚠️ **Commiteado y en la rama, NO desplegado:** viaja con el pedido `DESPLEGAR: plataforma`.

- [x] 🔴 **El `roles:` del menú no era una barrera: escondía el enlace y la URL abría la pantalla
      igual — cerrado el 2026-09-08 (`3e9cd3a` en `onia-platform`, publicado en la rama).**

      **La clase, que es lo que importa:** `navigation.ts` declara `roles:` por item y el sidebar
      lo respeta (`filterNavItems`), así que la Planilla o las facturas recurrentes no le
      aparecen a una recepcionista. Pero el layout de `(dashboard)` resuelve el acceso con
      `resolveRouteAccess(pathname, pack, features)` —**pack y features, nunca rol**— y le pasa
      `role` al Sidebar sólo para RENDERIZAR. El propio layout tiene escrito el diagnóstico para
      el otro eje y nadie lo trasladó a éste: *«la nav ya se filtra por pack, pero la URL no»*.

      **Por qué no lo veía nadie.** No sobra ni falta una palabra (ningún barrido de copy la ve),
      la pantalla renderiza perfecto, el menú está BIEN —esconde lo que debe— y `route-access`
      también, porque su pregunta es otra. Los dos gates de caminos que ya existían
      (`caminos-transversales`, `enlaces-del-panel-alcanzables`) cruzan nav × **PACK**; ninguno
      cruzaba nav × **ROL**.

      **Lo que estaba vivo**, medido sobre las 13 rutas que algún pack restringe más que su
      propia línea base — **tres de trece**:

      | ruta | lo que declara su menú | lo que hacía |
      |---|---|---|
      | `/billing/recurring` | `[SUPERADMIN, ADMIN]` | mostraba **todas** las facturas recurrentes del negocio (cliente, monto, próximo cobro) a un DOCTOR o a la recepción, más los botones de pausar y borrar — que la API sí rechaza con `requireAdmin`, o sea que además no funcionaban. La página hasta calculaba `isSuperAdmin`, pero sólo para saltear el corte por plan |
      | `/agents` | `[SUPERADMIN, ADMIN]` | exigía `requireFeature("module.agents")` (el entitlement del add-on pago) y nunca el rol |
      | `/requerimientos` | `[SUPERADMIN, ADMIN, STAFF]` | sólo `requireAuth()` |

      **Dos que parecían agujeros y NO lo eran** — la dirección cara, la que manda a «arreglar» lo
      que anda: `/admin` tiene su guarda en **su propio `layout.tsx`** y `/empresa` en su
      **`access.ts`** (`requireEmpresaAccess`). Un detector que mirara sólo `page.tsx` acusaba a
      los dos en falso; por eso el gate lee la **cadena** de la ruta, no la página.

      **El gate nuevo, `lib/platform/rol-en-la-ruta.test.ts`:** deriva el universo del **dato**
      (`VERTICAL_PACKS`) y —esto es lo que lo hace correcto— **relativo a la línea base de cada
      pack**. Un item que excluye DOCTOR en un comercio no restringe nada: ese pack excluye DOCTOR
      de **todo**, incluido su `/dashboard`. Sin ese recorte el universo sube a ~40 rutas y el gate
      exigiría enforcement donde aplicarlo dejaría a alguien fuera de su propia home — **un bucle
      de redirect**. Cada ruta declara CÓMO se cubre y la declaración **se re-mide en cada
      corrida**: si el guard declarado desaparece, esa fila se pone roja en vez de pre-aprobar.

      **Validado en ROJO primero por el motivo correcto** (3 casos, los mismos 3 medidos a mano,
      con las otras 10 en verde) y **por mutación en las tres direcciones**: el *esquive*
      —mencionar el rol sin `redirect`, que es como se ve un guardia hueco— da rojo; una ruta
      restringida nueva sin fila da rojo **nombrándola** (`/agenda`); y el detector siempre-vacío
      lo caza el ancla. Gates: `tsc` 0 · `vitest` 3795 · `eslint` 0 errores.

      ⚠️ **Commiteado y en la rama, NO desplegado**: viaja con el pedido de deploy de `plataforma`,
      que sigue esperando el `ok` de Sergio Urcullo.

      **Lo que queda anotado y NO se hizo, con su motivo:** el arreglo de fondo es que el layout
      corte por rol en un solo punto, como ya hace por pack — pero eso toca las 40 pantallas para
      los 4 roles y necesita una guarda explícita contra el bucle de redirect medido arriba
      (nunca bloquear la home del propio rol). Con el gate puesto, una ruta restringida nueva no
      puede nacer sin defensa, así que la deuda ya no crece.

- [x] 🔴 **Si al confirmar la reserva se cortaba la red, la pantalla se quedaba MUDA: ni cita ni
      explicación — cerrado el 2026-09-08 (`592baa1` en `onia-platform`, publicado en la rama).**

      **La clase, que es lo que importa:** los gates de esta casa recorren el camino FELIZ. El de
      FALLO no lo mira nadie, y en producción el camino feliz suele andar, así que el defecto no
      aparece ni mirando la pantalla ni con captura. `handleSubmit` de `/book/[orgSlug]` tenía
      `try { … } finally {}` **sin `catch`**: cuando el `fetch` no llegaba a contestar —el celular
      pierde señal a mitad del envío, se corta la conexión mientras se lee el cuerpo—, el
      `finally` apagaba el «Agendando...», el botón volvía a su estado normal y **no aparecía
      nada**. El que quería reservar apretaba, veía parpadear el botón y se quedaba sin saber si
      tenía turno. Sin cita, y el negocio tampoco se enteraba.

      Importa por **dónde vive**: `app/(public)` se abre desde un enlace de WhatsApp y casi
      siempre en un celular en la calle, o sea que la red cortada es el caso **normal**, no el
      raro.

      **Por qué nadie lo vio, y esto es lo nuevo:** de los seis `fetch` de la superficie pública,
      **cinco** atrapaban el rechazo y le decían algo a la persona («Error de conexión. Intentá de
      nuevo.», «No se pudo entregar», «No se pudo subir el archivo»). El único que no era **el que
      RESERVA**, que es el de más valor de toda la superficie. Cuando los hermanos de una familia
      manejan el fallo, la familia se lee como cubierta y nadie sospecha del que falta.

      **Arreglado sin `alert`:** el `else` del servidor usaba `alert()`; ahora las dos ramas
      —servidor y red— salen por el mismo cartel en pantalla, arriba del botón, diciendo explícito
      que **NO quedó agendada** para que nadie se vaya creyendo que sí.

      **Gate `app/(public)/camino-de-fallo.test.ts`**, sujetos derivados del disco. El sujeto es la
      **LLAMADA y no el archivo, a propósito**: este mismo `page.tsx` tiene cuatro `catch` (los dos
      `useEffect` encadenan el suyo), así que un gate por archivo pasaba en **VERDE sobre el
      defecto**. Rojo primero por el motivo correcto (`page.tsx:152 (POST)`) y validado por **4
      mutaciones**: quitar el `catch`, **dejarlo vacío** (el esquive, que sólo aparece mutando
      DESPUÉS de arreglar), quitar un `.catch` encadenado, y un sujeto nuevo con el defecto en
      otro archivo; las cuatro caen en rojo nombrando archivo y línea, y restaurado vuelve a 10/10.

      **Gates:** `tsc` exit 0 · `vitest` **3779 pasan / 310 archivos** · `eslint` 0 errores.
      Cartel **MIRADO** renderizado con el CSS y la fuente subseteada del build vivo (430 px,
      glifo real de 18×18 y no la palabra, cero respuestas ≥400).

      ⚠️ **Commiteado y en la rama, NO desplegado:** el cliente todavía no lo ve.

- [x] 🔴 **La reserva pública le decía al cliente del negocio «Sin horarios disponibles · Probá
      con otra fecha» cuando en realidad NO había podido cargar los horarios — cerrado el
      2026-09-08 (`e69736b` en `onia-platform`, publicado en la rama).**

      **La clase, que es lo que importa:** `/book/[orgSlug]` es la única superficie del producto
      que ve **el cliente del cliente** —un desconocido pidiendo turno, con la marca del negocio
      delante—, y ningún gate de este proyecto la barre: todos miran `app/(dashboard)` y
      `components/`. El paso 3 cargaba los horarios con
      `.catch(() => { if (!cancelled) setSlots([]); })` y pintaba, para lista vacía, «Sin horarios
      disponibles · Probá con otra fecha». O sea que un fallo —429 del límite por IP
      (`publicApiLimiter`, 30/min; el propio `rate-limit.ts` ya documenta que una IP suele estar
      compartida por NAT), un 403 o un 500— se le mostraba al que quería reservar **como si el
      negocio no tuviera lugar**. Nadie podía enterarse: el dueño mira su panel, no esta pantalla,
      y el fallo no dejaba ni un rastro. Y el consejo que daba —probá con otra fecha— es
      justamente lo que consume el límite que produce el error, así que volvía a salir el mismo
      cartel.

      Es la misma clase que se cerró el 06-sep en el alta (`buscarNegocio()` devolvía `[]` tanto
      por «busqué y no encontré» como por «no hay buscador»): **un retorno ambiguo confunde “no
      pude preguntar” con “te contesté que no”.** De los cuatro `.catch` de `app/(public)`, los
      otros tres ya distinguían — faltaba justo el del paso que decide la reserva.

      **La superficie está VIVA:** 7 de las 9 orgs de producción están en `professional`, y
      `professional` trae `publicBookingIncluded: true` (`lib/plan-catalogo.ts`). Medido con
      `docker exec supabase-db psql`, no deducido.

      **Arreglado sin borrar la promesa, condicionándola:** `lib/agenda/disponibilidad-publica.ts`
      separa los dos casos y **el error gana sobre la lista vacía** —ese orden ES el arreglo,
      porque cuando la carga falla la lista siempre queda vacía—; el 429 se dice como espera
      («Fueron muchas consultas seguidas. Reintentá en unos segundos») y hay botón de reintentar.

      **Gate `lib/agenda/disponibilidad-publica.test.ts`:** mide la decisión **y** que la PANTALLA
      la use (un helper correcto que nadie llama es como esta familia vuelve). Validado en ROJO
      primero por el motivo correcto —6 casos de lógica en verde, 3 de la pantalla en rojo— y por
      **3 mutaciones**: invertir el orden error/cantidad, devolver el `catch` mudo y volver a
      tipear el cartel a mano; las tres caen en rojo y restaurado vuelve a verde.

      **Gates:** `tsc` exit 0 · `vitest` **3769 pasan / 309 archivos, 0 fallos** · `eslint` 0
      errores. De paso, el gate de iconos cazó un `cloud_off` fuera de la fuente subseteada —se
      habría visto **la palabra en letras gigantes**, el bug más caro del proyecto—: va `refresh`,
      que ya está incluido.

      ⚠️ **Commiteado y en la rama, NO desplegado:** viaja con el pedido `t_bf1607af`
      (`DESPLEGAR: plataforma`), que espera el `ok` de Sergio Urcullo.

- [x] 🔴 **El panel le negaba al cliente vencido exactamente lo que su propio correo le había
      prometido 24 h antes — cerrado el 2026-09-08 (`999f932` en `onia-platform`, publicado en la
      rama, falta que el integrador lo mergee a `master`).**
      Gate nuevo: `app/components/trial-vencido-cumple-la-promesa.test.ts` (6 casos).

      El día 14 y el 15 el sistema le escribe al dueño, con su nombre y su negocio adentro:
      *«tu cuenta pasa a **solo lectura**: no se borra nada y podés seguir consultando tus datos,
      pero ya no registrar»* y *«todo lo que cargaste sigue ahí y podés **consultarlo y
      exportarlo** cuando quieras»* (`lib/email.ts`, `trialDripCopy` pasos 14 y 15).
      `lib/subscription/plan-state.ts` lo escribe como decisión de diseño: *«read_only NO borra ni
      esconde datos: la cuenta sigue pudiendo leer todo y exportárselo. Solo se frena la
      escritura»*.

      **La capa de datos lo cumple**, y por eso el defecto era invisible: medido sobre las **151
      rutas** de `app/api`, **ningún** handler `GET` corta por `checkPlanExpiry` — sólo cortan
      `POST`/`PATCH`/`DELETE`. El lado que todo el mundo audita estaba bien.

      **Lo anulaba la UI.** `TrialBlockedModal` se monta sobre TODA ruta del panel
      (`app/(dashboard)/layout.tsx:191`), tapa la pantalla con `inset-0 z-[9999]`, se comía la
      tecla `Escape` a propósito (`e.preventDefault()`) y **no tenía un solo control para
      cerrarse**. El dueño que venía a mirar sus números para decidir si pagaba leía **«Acceso
      Bloqueado»** — encima arriba de la frase «Tus datos siguen intactos», que era cierta y no le
      servía de nada.

      ⚠️ **La clase, que es lo que hay que llevarse:** *una capa cumple la promesa y la de arriba
      la anula*. Ningún guardia del proyecto podía verla — no sobra ninguna palabra prohibida, no
      falta ningún rubro, `/checkout` responde, la pantalla renderiza perfecto, y el único estado
      que la dispara (trial vencido **más** gracia vencida) no lo crea ningún instrumento. El
      sujeto del gate por eso no es la pantalla ni el correo: es el **CRUCE** de los dos.

      **Arreglo:** el modal se puede cerrar («Ver mis datos (solo lectura)», y `Escape` ahora
      cierra en vez de comerse la tecla), y el copy dice lo que de verdad pasa —«Tu cuenta quedó
      en solo lectura»— con la MISMA palabra del correo, que es lo único que le deja al dueño atar
      las dos cosas. **Cerrarlo no afloja nada:** la escritura la sigue frenando la API con su
      motivo escrito (`403 «Tu suscripción ha vencido…»`).

      **Validado por MUTACIÓN, no por lectura** — las tres en rojo con su línea `Tests N failed`:
      volver al título viejo (1 rojo), borrar el botón (2 rojos) y el **esquive**, un botón que
      existe y no apaga nada (1 rojo, lo caza el caso que ata el `onClick` al estado que decide si
      el modal se dibuja). Suite **3751 passed**, `tsc` y `eslint` en 0.
      **Mirada renderizada** con el CSS del build vivo, no en producción —que corre un build
      anterior—: `ONIA_MIRAR=1 npx vitest run …` + Playwright, `/tmp/trial-vencido.png`.

- [x] 🔴 **La receta que el paciente se lleva a la farmacia salía fechada al DÍA SIGUIENTE de
      noche, y el pie del mismo papel decía la fecha correcta — cerrado el 2026-09-07
      (`8bc5182` en `onia-platform`, publicado en la rama).**
      Gate nuevo: `lib/platform/fecha-en-zona-del-negocio.test.ts` (8 casos).

      El contenedor corre con `TZ` vacío — medido en vivo:
      `docker exec onia-platform node -e "…"` devuelve `process.env.TZ` **undefined** e
      `Intl.DateTimeFormat().resolvedOptions().timeZone` = **UTC**. Así que toda fecha que el
      SERVIDOR formatea sin `timeZone` sale **4 h adelantada**, y entre las 20:00 y la medianoche
      de La Paz **nombra el día siguiente** — justo la franja en la que atienden dental y estética.

      ⚠️ **Esto es la CLASE del defecto que la vuelta anterior arregló como instancia.** El
      2026-09-06 se arregló el aviso de cita al profesional (`lib/agenda/crear-cita.ts`), que iba
      4 h adelantado mientras el correo de la misma cita iba bien. Quedaban **nueve** llamadas más,
      todas de servidor, y la peor no era una pantalla sino **un documento que sale del sistema**:
      `app/print/prescription/[id]/page.tsx` imprimía la fecha de emisión sin zona y, 90 líneas
      más abajo, su pie de página **sí** la llevaba. Un mismo papel contradiciéndose. Arregladas
      las nueve: la receta ahora lee `clinicSettings.timezone` (y el pie usa **la misma**, en vez
      de la zona fija que tenía escrita, para que no se puedan volver a separar); las ocho del panel usan
      `DEFAULT_TZ` de `lib/time.ts`, que ya era la fuente única.

      **Por qué ningún gate podía verlo:** no sobra ninguna palabra (un barrido de literales
      prohibidos no tiene qué buscar), el texto ya está en el idioma del rubro, la captura se ve
      perfecta, y la fecha es un **dato real** — lo único mal es el huso en que se la calculó.
      El sujeto del gate nuevo sale del **disco** (`app/`, `lib/`, `components/`), así que un
      archivo nuevo nace cubierto; los `"use client"` quedan fuera a propósito, porque ahí formatea
      el navegador del dueño, que ya está en su zona.

      ⚠️ **Y el primer instrumento mentía en las dos direcciones, así que ninguna de las dos
      listas servía.** `grep -v timeZone` por LÍNEA acusaba a `crear-cita.ts` y `whatsapp-bot.ts`,
      que están **sanos** (la opción baja de renglón) — se resolvió recorriendo la llamada con
      paréntesis balanceados. Y al revés: `toLocaleString` es **ambiguo** — `Number` tiene el suyo,
      y las tres de `app/(dashboard)/communications/page.tsx` son **números** (`monthTotal.toLocaleString`).
      Exigirles zona era mandar a romper código sano. Hoy `toLocaleDateString`/`toLocaleTimeString`
      se exigen siempre y `toLocaleString` sólo cuando el receptor es reconociblemente una fecha;
      el límite de esa heurística está escrito en la cabecera del gate, no escondido.

      Validado **por mutación en las dos direcciones**: revertir el arreglo de la receta → rojo
      nombrándola; recortar las raíces del barrido → rojo (sin ese caso, vaciar `RAICES` dejaba el
      gate verde para siempre); restaurar → 8/8 verde. Gates: `tsc` 0 · `vitest` 3574 verdes (300
      archivos) · `eslint` 0 errores.

      ⚠️ **NO desplegado, y NO alcanza con el pedido de deploy que ya existe.** Medido al cerrar:
      `git merge-base --is-ancestor 8bc5182 origin/master` da **NO**, y el pedido vivo
      (`t_deddf471`) publicaría `69d95ad`, que es el HEAD de `master` — o sea que ejecutarlo hoy
      **no incluye este arreglo**. Faltan DOS pasos, en este orden: que `onia-cola` mergee la rama
      a `master`, y recién después el swap. Escribir «viaja con el pedido de deploy» sin
      comprobarlo es lo que este carril corrigió el 2026-09-07 (`5eeac96f`).

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
      Gate: `onia-platform/lib/platform/pantallas-compartidas-cubiertas.test.ts`, bloque *«las subrutas de una
      pantalla compartida»* (89 casos).

      El panel enlaza `onia-platform/app/(dashboard)/patients/[id]/records/new/page.tsx` con el guard `esClinico`, o sea los **tres**
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
      `onia-platform/app/(dashboard)/patients/[id]/records/new/page.tsx` (dental),
      `onia-platform/app/(dashboard)/reports/clinical-balance/page.tsx` («Tratamientos
      completados», que en una veterinaria son «Servicios») y
      `onia-platform/app/(dashboard)/settings/chatbot/ChatbotClient.tsx`, con tres placeholders
      de **veterinaria** fijos —«mascota, perro, gato»— para los siete rubros, en un archivo cuyo
      propio prop `ejemplos` dice «nunca dental fijo»: el arreglo cubrió tres campos y dejó estos.

      Arreglados derivando del pack con el mecanismo que ya existía (`ejemploRegistro` y
      `ejemploPalabras` en `onia-platform/lib/onboarding/vocabulario.ts`, al lado de
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
      Gate: `onia-platform/app/(dashboard)/patients/ficha-por-rubro.test.ts`.
      La ficha la comparten los tres rubros clínicos y **servicios profesionales**, uno de
      los cinco que la v1.0 vende. Lo clínico ya se había separado (tipo de sangre, emergencia,
      alergias, historia, tratamientos) pero **cumpleaños y género quedaron afuera de ese
      arreglo**: en el alta viven en el MISMO grid que el nombre y el CI, diez líneas encima de
      un bloque que sí distingue el rubro. El cliente de un estudio contable puede ser una
      EMPRESA, así que el sistema le pedía el género de una razón social, y la lista le ofrecía
      **filtrar por género** y le calculaba la edad.
      **Cuatro superficies**, todas bajo `onia-platform/app/(dashboard)/patients`: el alta, la
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
      `ls /root/loops/onia-platform/lib/platform/caminos-transversales.test.ts`.

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
      confirma con `ls /root/loops/onia-platform/lib/onia-core/modules/agents-cadencia.ts`.

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

      ---

      **Medido el 2026-09-08 (no heredado): la corrida que el doc daba por «corriendo» terminó
      el 04-sep 04:12 UTC, cuatro días antes**, con el log cerrado en `fin` y cero procesos
      vivos. Dejó **los tres combos del PdV 0 en 125/125 en las etapas IV, VII y XI** — o sea
      `pv0-ds17-tf1` y `pv0-ds24-tf3` son **dos casos nuevos al 100%**, que es lo que este
      «Listo =» pide. **Lo único que falta para cerrarlo es leer el portal**, y eso necesita el
      login de Sergio Urcullo: no es trabajo de este carril.

      **Y apareció trabajo que sí era de este carril, desbloqueado y sin hacer desde el 6-ago:**
      las etapas **VI (20/280, 3%)** y **IX (20/80, 12%)** no dependían del PdV 1 ni de nadie.
      Estaban frenadas porque `ensureCufd()` se cableó sólo en las tres etapas que motivaron su
      arreglo (IV, VII, XI) y no en sus hermanas, y **nadie lo vio porque
      `run-fase1-volumen.sh` corre únicamente IV → VII → XI**: el instrumento miraba justo las
      tres que ya estaban sanas. Arreglado en `a28b3689` (`fase1-runner.mjs`), guardias
      validados por mutación, 371/371 verdes. **Desbloquea 320 casos** (260 de VI + 60 de IX).
      Detalle y los dos mensajes del SIN, en `ONIA_SIAT_ESTADO_HOMOLOGACION.md` §7.

      **VI y IX CORRIDAS Y DESBLOQUEADAS el 2026-09-08 02:2x-02:4x UTC** contra el piloto
      (`codigoAmbiente=2`), con el runner arreglado. Medido en el estado vivo del emisor en el VPS
      (`/opt/onia-siat/fase1-state.json`), no deducido:

      | etapa | antes | ahora | el error que la tenía frenada |
      |---|---|---|---|
      | VI | `pv0: 20` | **`pv0: 22`** (target) | `984 EL EVENTO SIGNIFICATIVO NO CORRESPONDE AL CUFD` — ya no aparece |
      | IX | `pv0: 20` | **`pv0: 22`** (target) | `123 CUFD FUERA DE TOLERANCIA` — ya no aparece |

      En las dos queda **sólo `pv1`**, que es el bloqueo legítimo: falta crear el Punto de Venta 1
      en SIAT, y eso es de Sergio Urcullo.

      ⚠️ **`a28b3689` era necesario pero NO suficiente, y esto es lo que valía la vuelta.** Al
      reintentar con el runner arreglado, VI frenó con *«sin ventana válida para el evento
      significativo (CUFD o evento previo demasiado frescos): esperar ~2 min y reintentar»*. Ese
      mensaje —que pide textualmente reintentar— caía en la **misma rama del `catch`** que un
      prerequisito determinista, así que quedaba escrito en `blockedCases`; `loop()` saltea todo
      caso bloqueado y `run-fase1-volumen.sh` nunca pasa `--retry-blocked`. **Un tropiezo de dos
      minutos congelaba la etapa para siempre**, y nada se ponía rojo. Eso —no el `ensureCufd`
      solo— es lo que las tuvo un mes en 20. Arreglado en `95606460` (`TransitorioError`), con
      las dos mitades validadas por mutación, 374/374 verdes.

      ⚠️ **Cómo se corrieron, porque importa para repetirlo:** el emisor de `/opt/onia-siat`
      **no tiene el arreglo** (`ensureCufd` → 4, contra 6 en el repo; su `mtime` es del 04-sep) y
      su `run-fase1-volumen.sh` ni siquiera nombra a VI y IX (`for E in IV VII XI`). Se corrió el
      runner **del clon de main del VPS** (`/root/loops/onia-hermes/…`, que sí tiene el arreglo)
      con el `cwd` y el `.env` de `/opt/onia-siat`, así que el estado y las credenciales son las
      de producción y **no se desplegó nada**. El emisor sólo usa módulos nativos de node: no
      necesita `node_modules`. Backup previo:
      `/opt/onia-siat/fase1-state.backup-20260908-0218.json`.

      **Lo que sigue, en orden:** releer el portal → actualizar el número de acá. **Eso necesita
      el login de Sergio Urcullo y no es trabajo de este carril.** El PdV 1 (la otra mitad de la
      matriz) también es suyo. Que `/opt/onia-siat` quede alineado con el repo es la tarea
      `t_7d2019bb`.

      **2026-09-10 (chatbot-cola) — el bloqueo era REAL pero NADIE se lo había pedido, y además
      el ok solo no alcanzaba.** Dos cosas medidas, ninguna heredada:

      1. **El bloqueo estaba escrito acá y en ningún lado más.** Las tres tareas de SIAT del
         tablero figuran `done`: no existía **ninguna** viva pidiéndole el PdV 1. Un bloqueo que
         vive en un `.md` no le llega a Sergio Urcullo — sólo una tarea `needs_input` le llega
         por Telegram. Lleva sin pedirse desde el **2026-08-27**, que es cuando el SIN contestó
         `933 · EL PUNTO DE VENTA ES INEXISTENTE O INVALIDO` (`fase1-log.ndjson`, etapa I,
         `pv:1`, tres intentos). Pedido en **`t_39a0c27c`**, `status: blocked` verificado con
         `show` (no con el exit del `block`), con los pasos, el portal, el usuario y los 6 tipos
         de PdV que ofrece el SIN ya resueltos: es una auditoría de 5 minutos, no una
         investigación. Cuánto frena, contado del estado vivo y no estimado: **11 combos =
         1.169 documentos de cobertura** (IV/VII/XI × 3 combos × 125, más VI y IX × 22). Todo
         el lado `pv0` está **completo en las 9 etapas**.
         Para re-derivar el pedido vivo sin citar un id que caduca:
         `onia-tablero.sh list --status blocked | grep -i 'Punto de Venta'`.

      2. 🔴 **Y el ok solo habría repetido el mes perdido.** `run-fase1-volumen.sh` **de
         producción** seguía con `for E in IV VII XI` — el recorte original, todavía vivo: el
         deploy del emisor alineó los módulos (`/opt/onia-siat/emisor/src`, hoy idénticos al
         repo: `ensureCufd` 6=6, `TransitorioError` 4=4) y **no** el orquestador, que vive un
         nivel más arriba y quedó afuera de la copia. Peor, la copia del repo
         tampoco corría la **etapa I**, que es la que pide el CUIS por punto de venta. O sea que
         el día que exista el PdV 1, correr ese script **no lo desbloquea**: los 11 combos
         volverían a caer con `sin CUIS para el punto de venta 1: correr la etapa I antes`, y
         VI y IX quedarían clavadas otra vez.

         **Arreglado en la clase, no en la instancia.** Agregar las etapas que faltaban habría
         sido reponer el mismo defecto un archivo más allá: la lista a mano **es** el defecto —
         una lista de inclusión al lado de `STAGE_ORDER`, que es la fuente y ya está anclada por
         test. Ahora el script las **deriva** del runner y **aborta** si no puede leerlas (caer
         a una lista por defecto haría que una corrida a medias se lea igual que una entera).
         Verificado ejecutando la derivación contra los módulos reales: devuelve
         `I II III IV V VI VII IX XI`, las 9.

         **Gate:** `test/fase1-runner.test.mjs` › «run-fase1-volumen.sh corre TODAS las etapas»,
         validado **por mutación en 3 direcciones** — tipear la lista · el **esquive** (nombrar
         `STAGE_ORDER` en un comentario y seguir tipeando) · derivar **filtrando la I**: las
         tres en rojo, base y restaurado en verde.
         ⚠️ **La tercera pasó en VERDE en la primera versión del gate** y sólo se vio mutando
         *después* de arreglar: el caso resolvía por texto («si nombra `STAGE_ORDER`, corre
         `STAGE_ORDER`»), o sea comparaba la fuente contra sí misma. Ahora **ejecuta** el
         `node -e` del script en un sandbox con el layout del VPS y afirma sobre la salida.

         **Y el gate no lo corría nadie:** los **92** tests del emisor —el módulo del que
         depende la v1.0 por la decisión del 07-sep— **no estaban en la cadena `npm test`**.
         Cableados como `test:siat-fase1` (puro, sin red ni repo hermano, 4,3 s): 92/92 verdes,
         `test:guards-cableados` verde.

         🔴 **Commiteado, NO desplegado:** `/opt/onia-siat/run-fase1-volumen.sh` sigue con las
         tres etapas viejas. Desplegar no es de este carril — va por `DESPLEGAR: siat`. **Esto
         tiene que llegar ANTES de que se corra la matriz de `pv1`**, o el ok de Sergio Urcullo
         desbloquea 1.125 de los 1.169 y repite el bug de VI y IX.

- [x] 🔴 **CERRADO el 2026-09-08: una cuenta APAGADA seguía tomando reservas por la puerta
      pública, y el desconocido que reservaba se presentaba a un negocio que no lo esperaba.**
      `POST /api/booking/appointments` crea un `patient` y una `appointment` en la base del
      negocio: es una **escritura que inicia un tercero**. Las **35** rutas de `app/api` que
      escriben cortan por `checkPlanExpiry` (contado, no estimado); las tres puertas de
      `/api/booking` —y con ellas el conocimiento que se le publica al bot del cliente— **no
      preguntaban nada**. Una org en `read_only` seguía recibiendo por la puerta de atrás el
      servicio que dejó de pagar.

      **Por qué sobrevivió, que es lo reusable:** `motivoSinReservaPublica` miraba `org.plan`,
      que es el plan **contratado** y no el **estado**. Una org con el trial vencido hace meses
      sigue diciendo `professional`, así que `publicBookingIncluded` daba `true` para siempre.
      Ningún gate podía verlo: la pantalla renderiza perfecto, el rubro deriva bien, el plan la
      incluye y la ruta responde 200 — no sobra ni falta una palabra. **Lo que falla es QUIÉN
      pregunta.** Es la mitad hermana de `trial-vencido-cumple-la-promesa` (cerrado el 08-sep):
      ahí se verificó que las escrituras **del panel** cortan, y eso hizo dar por cubierta la
      familia entera con la puerta pública abierta.

      **Arreglo** (`ba2270b`, rama `claude/chatbots-platform-review-0d1d09`): el corte va en el
      **helper**, no en la ruta, así que cubre las tres puertas más el bot por construcción y
      una cuarta nace cubierta. Pregunta con la **misma** función que el panel (`isWriteBlocked`),
      de modo que la gracia del trial vale también acá: a quien paga un día tarde no se le cierra
      la agenda. Y corta en las **tres**, no sólo en la que escribe, porque cortar al final
      dejaría al visitante llenar los cuatro pasos para comerse el rechazo en el último clic.
      El motivo nuevo es `"vencida"` y va **antes** que `"plan"`: decirle «te falta el add-on» a
      quien lo tuvo y se le venció es mentira. Al cliente del cliente se le sigue diciendo lo
      mismo y neutro («Agenda pública no disponible para este negocio»): el estado comercial de
      nuestro cliente no se le cuenta a SU cliente.

      **La defensa contra el hueco mudo es de TIPOS:** `NegocioParaReserva` extiende `PlanDates`
      con los campos **requeridos**, así un llamador que no le pida las fechas a Prisma **no
      compila**. Sin eso llegan `undefined`, `derivePlanStatus` las lee como «sin fecha» y
      devuelve vigente — falla **abierto**, en silencio y con el gate del módulo en verde. `tsc`
      lo confirmó: los únicos errores fueron los casos viejos del test, y **ninguno** de los 4
      llamadores reales, que ya seleccionaban las fechas.

      **Gate:** `lib/agenda/reserva-publica.test.ts` (15 casos), validado **por mutación en 3
      direcciones** —helper sin el corte · un llamador sin `trialEnd` · la vigencia evaluada
      DESPUÉS del plan (esquive)—: las tres `exit 1`, base y restaurado `exit 0`.
      **Gates:** `npx tsc --noEmit` exit 0 · `npx vitest run` **4160 pasan / 332 archivos** ·
      `npx eslint .` 0 errores.

      🔴 **NO ESTÁ DESPLEGADO y además falta un paso antes:** `ba2270b` está en la rama del
      carril, **no en `master`**. Si el `ok` de `t_daa8750c` llega antes de que el integrador
      mergee, este arreglo **no viaja en ese swap**. Anotado como comentario en ese pedido.

- [x] 🟡 **CERRADO el 2026-09-08: la puerta pública crea clientes sin contarlos contra el tope
      del plan — y la mitad que faltaba no era el corte, era el aviso.** `checkPatientLimit` lo
      llaman **cinco** rutas y las cinco son del panel (`app/api/patients/route.ts`,
      `app/api/patients/import/route.ts`, `app/api/v1/patients/route.ts`,
      `app/api/comercio/clientes/route.ts` + el medidor de `/settings`).
      `app/api/booking/appointments/route.ts` hace `tx.patient.create(...)` y **no lo llama**, así
      que el tope que `onia.com.bo/precios` vende —300 clientes en Básico, y es el gancho para
      subir a Bs 750— **no se aplica por la agenda pública**.

      **La vuelta anterior lo dejó sin arreglar alegando «hay una decisión de producto y no la
      invento». Eso estaba mal y por eso el ítem sobrevivió un día:** las decisiones técnicas las
      toma la sesión y quedan escritas, a Sergio Urcullo se le piden plata, marca y contactar
      personas. Tomada acá:

      **La puerta pública NO rechaza, y ahora está fijado por un gate.** El que llega ahí es el
      cliente DEL cliente: rechazarlo lo castiga por el estado comercial de un negocio que no
      controla, el mensaje honesto no se puede escribir sin exponerle a un desconocido que su
      dentista se pasó del plan que nos paga, y encima le cuesta al negocio una persona real —para
      cobrarle Bs 430 más le sacamos un cliente, el upsell más caro posible. El tope sigue
      mordiendo donde está el dueño: los cinco 403 del panel quedan intactos.

      **El agujero de verdad era el otro, y ése sí se arregló:** la fila que crea la puerta pública
      **sí** cuenta en `contarClientesDelRubro`, así que el dueño cruza el tope sin haber cargado a
      nadie y se entera **chocando** contra un 403 por gente que él no agregó. Ahora se le avisa
      —notificación in-app a los admins + web push, el mismo patrón que el cupo del chatbot—, como
      mucho una vez por día, **en el idioma de su rubro** y sólo cuando el alta es de un cliente
      **nuevo** (la ruta hace find-or-create por teléfono: reservar de nuevo no mueve el tope).
      Es la misma forma que el cupo del chatbot cerrado hoy: el límite se aplica y el que paga se
      entera chocando.

      **Arreglo** (`e911638`, rama `claude/chatbots-platform-review-0d1d09`):
      `lib/agenda/tope-en-la-puerta-publica.ts`. `rechazar: false` es un **campo** y no una
      ausencia de código a propósito: una ausencia no se puede poner en rojo el día que alguien
      la llene.

      **Gate:** `lib/agenda/tope-en-la-puerta-publica.test.ts`, 8 casos, validado **por mutación en
      6 direcciones** (`rechazar: true`; umbral `>` en vez de `>=`; ignorar `clienteNuevo`; texto
      dental duro; esquivar el `await` en la ruta; y el llamador pasando un literal): las seis
      `exit 1`, base `exit 0`. Incluye el caso que mira **al llamador** —sin él el módulo queda
      impecable y no cambia nada en producción, que es la forma del parámetro opcional con
      default— y lee la ruta **sin comentarios**, porque el comentario que dejé ahí nombra el
      módulo y el gate se absolvería solo.

      **Gates:** `npx tsc --noEmit` exit 0 · `npx vitest run` **4168 pasan / 333 archivos** ·
      `npx eslint .` 0 errores.

      🔴 **NO ESTÁ DESPLEGADO:** `e911638` ya está en `master` (verificado el 2026-09-10). Viaja
      cuando el integrador lo mergee y Sergio Urcullo apruebe el pedido de deploy vivo.

- [x] 🔴 **CERRADO el 2026-09-08: la pantalla donde el dueño decide CUÁNTO PAGA le vendía a
      3 de los 5 rubros de la v1.0 cuatro pantallas que su rubro no tiene.** `/reports` y
      `/billing/recurring` están gateadas por PLAN (`reportsEnabled`, `recurringInvoicesEnabled`
      en `lib/plan-catalogo.ts`: `true` desde Profesional para **todos** los planes) y **además
      por RUBRO**: sólo dental, estética y veterinaria las declaran en su nav, así que
      `allowedSegmentsForPack` no les da el segmento a comercio, importadora ni servicios
      profesionales — con `PLATFORM_LAYER=1` (medido en el contenedor vivo, no deducido) el
      layout los devuelve a `/dashboard`, mudo. Con la agenda pasa igual: comercio e importadora
      no tienen `/appointments`.

      Y `/settings/plan` las listaba plano para los siete rubros: **"Agenda y citas"**, **"Agenda
      pública incluida"**, **"Facturas recurrentes"** y **"Reportes de ingresos y citas" /
      "Reportes avanzados + exportación CSV"** — 22 promesas imposibles, contadas por el gate en
      rojo antes de tocar el arreglo. Un dueño de ferretería en Básico leía *"Reportes avanzados
      — no incluido"* como **motivo para subir de Bs 320 a Bs 750**, pagaba, y no recibía ninguna
      de las cuatro. La ayuda ya lo sabía: `app/(dashboard)/help/page.tsx` dice *"ferretería no
      puede leer «Facturación» ni «Reportes» (no las tiene)"*. La mano derecha lo sabía y la
      izquierda lo cobraba.

      **Por qué ningún gate podía verlo:** no sobra una palabra prohibida (el texto es legítimo
      en dental), el monto sale de la fuente única (`monto-de-plan-a-mano.test.ts` verde), el
      vocabulario deriva del rubro (`planes-en-el-idioma-del-rubro.test.ts` verde) y los gates de
      caminos no alcanzan `/reports` porque **ningún** pack de esos tres la pinta: no es sujeto
      de nadie. Por eso el sujeto del gate nuevo es el **universo derivado** (los 7 packs × las
      features que declaran pantalla), no las filas que ya existen.

      **Arreglo** (`9c7031a`, rama `claude/chatbots-platform-review-0d1d09`):
      `entregaLaPantalla(track, href)` generaliza a `tieneAgenda` derivando del nav —la misma
      fuente de `allowedSegmentsForPack`, así que un `false` significa las dos cosas a la vez—;
      `PlanFeature` gana `pantalla` y `planesDe` descarta la que el pack no entrega, **incluida o
      como gancho de upsell** (las dos cobran igual); y la comparativa del pie salió del JSX a
      `filasComparativaDe()`, porque era otro render del mismo dato y ningún test podía mirarla
      tipeada dentro del markup.

      **Gate:** `app/(dashboard)/settings/planes-prometen-pantallas-del-rubro.test.ts`, validado
      **por mutación en 3 direcciones** (sin filtro en cada mitad + una feature de pantalla sin
      declarar): las tres `exit 1`, base `exit 0`. **Gates:** `npx tsc --noEmit` exit 0 ·
      `npx vitest run` **3994 pasan / 331 archivos** · `npx eslint .` 0 errores.

      🔴 **NO ESTÁ DESPLEGADO, y encima falta un paso antes:** `9c7031a` está en la rama del
      carril, **no en `master`**. Si el `ok` de `t_daa8750c` llega antes de que el integrador
      mergee, este arreglo no viaja en ese swap. Anotado como comentario en ese pedido.

- [x] 🔴 **CERRADO el 2026-09-08: el dueño elegía pagar el AÑO y el mensaje con el que
      contrataba pedía el MES.** En `/settings/plan` el selector Mensual/Anual cambia la tarjeta
      entera —precio anual, «Bs 7.500 facturado anualmente», «Ahorras Bs 1.500 al año»
      (`PlanClient.tsx:559-603`)— y el modal del QR cobra el total anual (`:942`). Lo único que
      no cambiaba era el mensaje del botón **«Contratar por WhatsApp»**, que es lo que
      efectivamente le llega a Sergio Urcullo: Profesional y Completo lo tenían escrito con
      `mensual` fijo y su monto mensual. Quien lo lee cobra la modalidad equivocada, al precio
      equivocado, en el único camino de contratación que tiene la pantalla.

      **Por qué sobrevivió, que es lo reusable:** `waMsg` está tipado
      `(orgName: string, cycle: BillingCycle) => string` y el llamador **sí** le pasa el ciclo
      (`:909`), pero una implementación puede declararse `(org) => ...` e ignorarlo —TypeScript
      acepta la aridad menor—, así que `tsc` queda en 0 y nada se pone rojo. El arreglo del ciclo
      se había hecho en Básico y no viajó a sus hermanos: **la instancia, no la clase.** Por eso
      el arreglo no copia el ternario tres veces: la frase de modalidad sale ahora de un solo
      lugar (`modalidadContratada`), así un plan nuevo no la puede tipear.

      **Ningún gate podía verlo, y los tres vecinos estaban en verde:** no sobra ni falta una
      palabra prohibida; el monto sale de `DEFAULT_PLAN_AMOUNTS`, así que
      `monto-de-plan-a-mano.test.ts` pasa; y el vocabulario deriva del rubro, así que
      `planes-en-el-idioma-del-rubro.test.ts` pasa **y no mira `waMsg`**. El defecto sólo existe
      en el CRUCE (ciclo elegido, texto del mensaje).

      **Gate:** `app/(dashboard)/settings/modalidad-de-cobro-en-el-mensaje.test.ts`, que mide los
      textos que la función **devuelve** —no el fuente, así no se absuelve con su propio
      comentario ni con la aridad declarada—, incluye la **mitad simétrica** (con ciclo mensual
      el mensaje tampoco puede ofrecer el año) y dos anclajes: que existan sujetos que prometan
      modalidad, y que **Empresa quede exenta por lo que su texto dice** (pide una propuesta
      formal) y no por llamarse Empresa. **Validado por mutación en 4 direcciones:** revertir el
      arreglo en Profesional → rojo; el esquive que toma `cycle` y no lo usa → rojo; detector
      siempre-vacío → rojo; Empresa prometiendo modalidad → rojo.

      Commit `9bbf0a7`. Gates: `npx tsc --noEmit` exit 0 · `npx vitest run` **3983 pasan / 330
      archivos** · `npx eslint .` 0 errores.
      ✅ **Ya está en `master`**: `git merge-base --is-ancestor 9bbf0a7 origin/master` da **SÍ**,
      medido el 2026-09-11 01:05 La Paz. El texto anterior decía lo contrario citando ese mismo
      comando — era cierto cuando se escribió y venció cuando el integrador mergeó, que es el
      modo en que un pendiente de merge/deploy escrito en una cola caduca: **el que escribe el
      rojo no es el que lo resuelve, así que no tiene motivo para volver a medirlo.** También
      citaba el pedido `t_daa8750c`, hoy **archived**. El pedido vivo se deriva con
      `node scripts/deploy_sin_pedido.mjs`, nunca se copia.

- [x] 🔴 **CERRADO el 2026-09-08: en la pantalla donde el dueño PAGA Onia, el modal del QR le
      pedía «Clínica registrada» a los cinco rubros — y el botón flotante le decía «Nuevo
      paciente» a un centro de estética cuyo propio menú dice «Clientas».**

      **La clase, que es lo que importa:** el gate de cobertura
      (`lib/platform/pantallas-compartidas-cubiertas.test.ts`) declara las 25 pantallas que dos o
      más packs comparten y barre, en cada corrida, **los fuentes DE LA RUTA**
      (`app/(dashboard)/<href>/*`). El 07-sep ese barrido ya subió un escalón —antes leía sólo el
      server component y el copy vivía en su client component hermano—, y el escalón siguiente
      quedaba abierto: **una pantalla renderiza componentes de `components/`, y ésos no los mira
      nadie.** Ni el sujeto ni el patrón estaban mal: los dos están bien, y el archivo con el
      defecto queda FUERA del barrido. Por eso `/settings` figuraba **cubierta por su gate** y su
      modal de pago decía «clínica» cinco veces.

      **Lo que estaba vivo, medido barriendo `components/` entero (4 archivos de 55 nombraban un
      rubro; 2 eran defecto y 2 legítimos):**

      | dónde | qué leía quien no es dental |
      |---|---|
      | `components/billing/QRPaymentModal.tsx` (lo renderiza `/settings`) | rótulo «Clínica registrada \*», dos errores «Ingresá el nombre de quien paga y la clínica registrada.» y dos resúmenes «**Clínica:** …» |
      | `components/layout/navigation.ts` (el FAB, que está en TODAS las pantallas) | «Nuevo paciente» — los tres packs clínicos tomaban `quickActionItems` **por referencia** del dental |

      **Arreglado:** `vocabulario.ts` suma `negocioTitulo` (Clínica · Centro de estética · Empresa
      · Negocio · Estudio · Estancia · Veterinaria · Onia) —campo propio y no un recorte de
      `negocio`, porque `onia-interna` no lleva «tu» delante—; el modal recibe `negocio` y
      `negocioTitulo` como props **requeridas** (un opcional con default es un hueco
      indetectable) y `PlanClient` se los pasa del `vocab` que ya tenía; y `quickActionsClinicaDe`
      —hermano de `navClinicaDe`, que faltaba— deriva el alta del FAB, así que estética pasó a
      «Nueva clienta».

      **Y de paso el hueco latente que lo hacía posible:** `QuickActionsFab` cae en
      `items ?? quickActionItems`, así que ese seed es lo que ve quien no declara el suyo — y
      decía «Nuevo paciente». Quedó **neutro** («Nuevo cliente»); dental deriva el suyo como los
      demás. Los dos llamadores reales (`app/(dashboard)/layout.tsx`) sí pasan `quickActions`: el
      fallback no estaba disparando, pero el default silencioso es la forma en que esta familia
      vuelve.

      **El gate nuevo, `lib/platform/componentes-compartidos-por-rubro.test.ts`:** deriva el
      sujeto del **disco** (`components/` entero, 55 archivos) —así un componente nuevo nace
      cubierto y hay que eximirlo a mano, a la vista—, exime por **literal exacto** y no por ruta
      (mismo criterio que `/admin` en el gate hermano), y **vuelve a medir cada exención**: si el
      texto eximido desaparece, esa fila se pone roja en vez de pre-aprobar. Más un caso que
      prueba el detector contra las trampas ya medidas (el comentario, el identificador, lo
      interpolado, «pen**diente**s») y otro que exige que cada pack declare el rótulo de su FAB.

      **Validado en ROJO primero, por el motivo correcto:** 7 casos en rojo antes del arreglo
      —`QRPaymentModal`, `navigation.ts`, `esteticagest-clinical: el alta de cliente usa su propia
      palabra` («expected 'Nuevo paciente' to be 'Nueva clienta')— y 68/68 en verde después.
      Gates: `tsc` 0 · `vitest` 3751 (0 fallos) · `eslint` 0. Commit `185d616` en
      `claude/chatbots-platform-review-0d1d09` de `onia-platform`.

      ⚠️ **Commiteado y en la rama, NO desplegado**: viaja con el pedido de deploy de
      `plataforma` (`t_bf1607af`), que sigue esperando el `ok` de Sergio Urcullo.


- [x] **CERRADO el 2026-09-11 (`ef69e9b`): el gate de camino de fallo cubría 2 de los 17
      árboles de `app/`, y los huérfanos con escritura son el embudo del cliente nuevo.**
      Medido al cerrar el defecto de
      `/cita`: `app/(dashboard)/camino-de-fallo.test.ts` y `app/(public)/camino-de-fallo.test.ts`
      derivan sus sujetos del disco —bien— pero sus raíces están escritas a mano
      (`app/(dashboard)` y `app/(public)`), así que **15 árboles no son sujeto de nadie**.

      Los que escriben hoy y quedan afuera: `app/(auth)` (registro, login, 2FA), `app/onboarding`
      (aplicar y extraer) y `app/checkout` (el comprobante de pago). Sus **seis** `fetch` están
      sanos —los seis manejan `!res.ok` y el `catch`, verificado uno por uno—, o sea que esto
      **no es un defecto vivo: es que están sanos por diligencia y no por construcción**. El día
      que alguien agregue un `fetch` ahí entra pre-aprobado, y es la pantalla donde entra la
      plata.

      Y hay una segunda mitad, que es la que hizo falta para cazar `/cita`: el **sujeto** de los
      dos gates es `fetch(`, así que una pantalla que escribe por **server action** les es
      invisible aunque su árbol sí estuviera cubierto. Ampliar la raíz sin ampliar el sujeto deja
      esa mitad abierta.

      **Listo =** un solo gate que derive sus sujetos de `app/` entero con los árboles exentos
      **nombrados y re-medidos** en cada corrida (no una lista de raíces que se pudre), que cubra
      las dos formas de escribir (`fetch` y server action), y validado por mutación agregando un
      árbol nuevo: tiene que **nombrarlo**, no ignorarlo.

      **CÓMO QUEDÓ** (`app/camino-de-fallo-cubierto.test.ts`, 17 casos). El universo son los
      **17 árboles derivados del disco**; lo que queda afuera va nombrado con su motivo **y el
      motivo se vuelve a medir en cada corrida**. Hoy hay un solo exento —`app/api`, porque no
      dibuja ninguna pantalla: cero `.tsx` y cero `"use client"`— y los dos que delegan
      (`(dashboard)` y `(public)`) se re-miden exigiendo que su gate **exista y siga nombrando
      su árbol**, porque allá la pregunta es más profunda y tienen exentos propios que no
      conviene mantener en dos lugares. Los otros **catorce los barre este gate**.

      La segunda mitad, `salidasMudasDeServerAction` en el módulo compartido: un `return;`
      desnudo antes de la escritura, en una función **exportada** de un archivo `"use server"`,
      devuelve la misma pantalla que si no se hubiera apretado. Las internas quedan afuera a
      propósito — el aviso best-effort de `app/cita/acciones.ts` corre DESPUÉS de que la
      decisión ya se guardó y ahí cortar callado es correcto.

      **Validado por mutación, las cinco:** árbol nuevo con escritura ciega → **lo nombra**
      (`app/facturacion/EmisorClient.tsx:4 (DELETE)`); el mismo árbol sano → verde, sin falso
      positivo; server action con salida muda → rojo (`acciones.ts:36 (responderCita)`); gate
      propio borrado → rojo; exención de `app/api` caducada (un `.tsx` ahí) → rojo.

      **Un caso propio nació TAUTOLÓGICO y lo cazó leerlo, no correrlo:** preguntaba «¿está en
      barridos o en declarados?» con `barridos` definido como «los que no están declarados», así
      que no podía fallar nunca. Reescrito contra el EFECTO: los archivos del árbol tienen que
      terminar en la lista que se barre.

      **No había defecto vivo, y ése era el punto:** los cuatro árboles descubiertos que
      escriben —`(auth)`, `checkout`, `onboarding`, `dev`— salieron limpios con los dos
      detectores. Estaban sanos por diligencia, no por construcción.

      Gates verdes en casa (`tsc` 0 · `vitest` 4503 · `eslint` 0 errores) y el gate nuevo
      verde también en el VPS, sobre un árbol idéntico byte a byte — se comparó
      `git rev-parse HEAD^{tree}` en las dos máquinas antes de pushear, porque `git am` aplica
      sobre el HEAD de allá y publicaría otro árbol si el gemelo estuviera atrasado.

      ⚠️ **Es un gate: no cambia nada que el cliente vea, así que no pide deploy.**

## Lo que este carril NO hace

- **No toca los dos rubros bloqueados** (veterinaria, ganadería). Están fuera de la v1.0.
- **No reescribe un 🟡.** Ver arriba: le falta kilometraje.
- **No despliega.** El deploy de `onia-platform` tiene su propio runbook y su propio dueño
  (`onia-platform/.claude/skills/onia-deploy/`).
- **No le escribe a un prospecto.** Regla del [`README.md`](README.md) de esta carpeta.

## Cerrado

- [x] 🔴 **CERRADO el 2026-09-17: los avisos de vencimiento mandaban al dueño de un plan
      Empresa a una pantalla que NO puede cobrarle.** ⚠️ COMMITEADO Y PUSHEADO (`c399caaa`,
      rama `claude/chatbots-platform-review-0d1d09` de `onia-platform`), **falta mergear y
      desplegar**.

      El mismo día, `06036905` cerró el callejón de «Renovar Empresa» en `/settings`: el
      checkout DESCARTA `enterprise` (`CHECKOUT_PLANS` no lo trae), así que el botón dejaba al
      dueño en un selector de cuatro tarjetas donde la suya no está. Esa cura tapó la puerta a
      la que el dueño VA y dejó abiertas las que el producto usa para ir a buscarlo a ÉL.

      El barrido derivado del disco encontró **seis** superficies, no las cuatro que se ven a
      ojo: la banda grande del panel (`components/AvisoRenovacion.tsx`), el banner de solo
      lectura (`lib/subscription/aviso-solo-lectura.ts`), el aviso in-app/push
      (`lib/subscription/vencimientos.ts`), el correo
      (`onia-platform/app/api/cron/renewal-reminders/route.ts`) y —la que no estaba en la
      lista escrita a mano— el aviso de pago **RECHAZADO**
      (`lib/subscription/aviso-de-pago-resuelto.ts`), que mandaba a reintentar al mismo
      callejón. La sexta (`trial-drip`) queda exenta con su motivo **re-medido**: el plan de la
      prueba sí lo cobra el checkout, y si `TRIAL_PLAN` cambia el gate lo dice.

      **Cura:** el destino se DERIVA de lo que el checkout puede cobrar
      (`lib/subscription/donde-se-renueva.ts`), nunca de un `plan === "enterprise"` al lado.
      El mensaje de WhatsApp reusa `ENTERPRISE_PLAN_PRICE.activationMessage` — la misma fuente
      que `PlanClient`, para que el dueño no le escriba a Sergio Urcullo dos cosas distintas
      según por dónde entró.

      **Gate:** `lib/subscription/el-aviso-manda-donde-si-se-renueva.test.ts`, que cruza contra
      `planesVendibles` —la que PINTA las tarjetas— y no contra `CHECKOUT_PLANS`, que es la
      lista que el router ya lee (eso sería el espejo comparándose consigo mismo). Validado por
      mutación en las dos mitades: reponer el hardcode en la banda → rojo nombrando el archivo;
      hacer que el router deje de distinguir → rojo nombrando los 4 rubros × `enterprise`.

      **Alcance, medido y dicho como es:** hoy **ninguna** org está en `enterprise`
      (`select plan, count(*) from organizations` → 1 `free`, 3 `professional`), así que esto
      no le muerde a nadie AÚN. Pero `PLANES_DEL_OPERADOR = PLAN_IDS` lo incluye y Sergio
      Urcullo lo declaró vendible el 17-sep: el primer cliente de Empresa —el más caro,
      Bs 2.900/mes— es el que se comía el callejón, y por el correo, que es el canal que
      alcanza a quien no está mirando el panel.

      Gates verdes en `/root/loops/onia-platform-chatbot`: `npx tsc --noEmit` (0),
      `npx vitest run` (5.562 pasan), `npx eslint .` (0 errores).

- [x] 🔴 **CERRADO el 2026-09-17: el dueño no podía quitarle el acceso de administrador a un
      empleado que se fue.** ⚠️ COMMITEADO Y PUBLICADO (`9f103875`, rama
      `claude/chatbots-platform-review-0d1d09` de `onia-platform`), **falta mergear y desplegar**.
      El producto sabía COBRAR el segundo administrador —DG-043 cerró las dos puertas que lo
      crean— y no tenía **ninguna** puerta para sacarlo. Las tres vías del cliente contestaban
      403: `PATCH /api/admin/users/[id]` ("Superadmin access required for admin roles", encima en
      inglés), `DELETE /api/admin/users/[id]` ("Cannot remove admin users") y `DELETE
      /api/team/[id]` ("No podés eliminar administradores desde Equipo"); y la ficha del miembro
      (`app/(dashboard)/team/[id]/UserActions.tsx`) **escondía** la zona de peligro cuando la
      persona era `ADMIN`, así que el botón de eliminar ni aparecía y el de cambiar rol fallaba
      siempre. Resultado: un empleado que renunciaba conservaba acceso total a la cuenta y el
      dueño tenía que escribirle a Onia — agujero de seguridad **y** horas de soporte por
      cliente, que es el techo real del negocio (`ONIA_ESTRATEGIA_DE_EMPRESA.md` §9).
      Es la dirección simétrica de la clase cerrada cinco veces esta semana: **un permiso
      concedido sin su CAMINO de vuelta.**
      La decisión vive en UNA función pura (`lib/platform/quitar-administrador.ts`) porque son
      tres puertas y una cura que no viaja a todas deja la clase abierta. Única baranda: la
      organización nunca queda sin administrador; el conteo sale de la base en el momento y un
      conteo que no se pudo hacer NO habilita. `SUPERADMIN` lo sigue administrando Onia.
      **Intento fallido / trampa:** dos casos existentes (`"impide que un ADMIN cambie a otro
      ADMIN"` y `"no deja borrar a otro ADMIN"`) eran fixtures que **defendían el defecto** —
      obedecerlos habría cerrado la vuelta sin arreglar nada. Ahora sostienen la baranda.
      Gate: `lib/platform/quitar-administrador.test.ts` ancla la **guarda**, no la mención del
      helper, y exige que su índice sea MENOR que el de la escritura que protege; validado por
      mutación (`false &&` en la condición → rojo, restaurado → verde). tsc y eslint limpios,
      5.554 tests en verde (corridos también en el gemelo del VPS antes de publicar).

- [x] 🔴 **CERRADO el 2026-09-17: los tres correos que convierten la prueba en cliente ofrecían
      Bs 890 como único precio, con Bs 320 disponible.** ⚠️ COMMITEADO Y PUBLICADO (`109ee15`,
      rama `claude/chatbots-platform-review-0d1d09` de `onia-platform`), **falta mergear y
      desplegar** — pedido anotado en `t_0de82d2f`.
      Los pasos 12, 14 y 15 del drip del trial son los únicos correos que le piden plata al dueño,
      y `trialDripPriceLine()` (`onia-platform/lib/email.ts:1233`) tenía el plan TIPEADO:
      `getPlanAmount("professional", ...)`. La escalera C (12-sep) metió el plan Crece (Bs 550)
      entre Básico y Profesional y este correo nunca se enteró — el monto se derivaba bien, así
      que ningún cruce de cifras se ponía rojo: lo que estaba clavado era el SUJETO, no el número.
      Y la segunda mitad se contradecía sola: «o si preferís empezar suave, Bs 229 por semana» son
      ~Bs 991/mes, más caro que los Bs 890 que la misma frase nombra dos palabras antes.
      **Prueba:** la línea pasó al módulo puro `lib/subscription/precio-para-el-correo.ts`, que
      deriva el piso de `planesPorEscalon()`. El correo del paso 14 emite hoy, leído renderizado
      desde `trialDripCopy`: «Los planes arrancan en Bs 320/mes (plan Básico). El que estuviste
      usando en la prueba, Profesional, es Bs 890/mes.» Gate
      `lib/subscription/precio-para-el-correo.test.ts` (10 casos), **validado por mutación**:
      restaurando el literal `"professional"` y el semanal «suave» caen 6 de 10 por el motivo
      correcto. `tsc --noEmit` limpio y `vitest run lib/subscription/` en 364/364, corridos en el
      VPS sobre el árbol que se publica.
      **De paso, un bug que destapó el gate nuevo:** `getPlanAmount` (`lib/subscription-plans.ts`,
      la fuente única de montos) **tiraba** `TypeError` con un plan desconocido en vez de devolver
      `null`, porque su guarda `if (base === undefined)` estaba DESPUÉS del acceso
      `DEFAULT_PLAN_AMOUNTS[plan][cycle]`. Es alcanzable: `organizations.plan` es String y
      `planesPorEscalon()` incluye `free`, que no está en la tabla de precios porque no se cobra.

- [x] 🔴 **CERRADO el 2026-09-17: cinco frases mandaban al plan de Bs 890 por la agenda que el
      de Bs 550 ya trae.** ⚠️ COMMITEADO Y PUBLICADO (`dd03c75`, rama
      `claude/chatbots-platform-review-0d1d09` de `onia-platform`), **falta mergear y desplegar**.
      La escalera C (12-sep) le dio `publicBookingIncluded` al plan `crece` (Bs 550) y las frases
      que dicen DÓNDE viene incluida la agenda pública estaban tipeadas desde antes: seguían
      diciendo *«incluida en Profesional y Completo»*. Medido contra el catálogo el 17-sep: la
      traen **cuatro** planes (`crece`, `professional`, `clinic`, `enterprise`), no dos.

      **A quién le costaba plata:** al dueño de un Básico (Bs 320) que quería la agenda se le
      decía que para tenerla incluida hay que llegar a Profesional (Bs 890), cuando el escalón
      de al lado ya la trae — Bs 340/mes de más, o un add-on de Bs 150 que no necesitaría. Y al
      que YA está en Crece, la tarjeta de `/settings` le rotulaba «Incluido» arriba y le decía
      lo contrario en el párrafo de abajo.

      **Las cinco superficies:** `BOOKING_ADDON_PRICE.publicLabel` y `.heroLabel`, el `summary`
      de `PUBLIC_PRICING_ADDONS`, el `limit` de `ADMIN_ADDON_INFO` (los cuatro en
      `onia-platform/lib/pricing.ts`) y el párrafo de la tarjeta en
      `onia-platform/app/(dashboard)/settings/PlanClient.tsx`. Las cinco preguntan ahora
      `primerPlanCon("publicBookingIncluded")` y dicen «desde el plan Crece»: **un umbral no
      envejece cuando entra un escalón arriba; una enumeración sí.**

      **Cómo apareció, que es lo transferible:** el rótulo de esa tarjeta ya derivaba del
      catálogo y por eso el 13-sep quedó anotada como sana — lo que no derivaba era la PROSA de
      al lado. Por cada booleano de plan hay que preguntar **quién más lo AFIRMA en texto**, no
      sólo quién lo consulta.

      **Gate:** `onia-platform/lib/subscription/donde-esta-incluida-no-se-tipea.test.ts`. Afirma
      la CLASE, no el texto viejo: prohibir «Profesional y Completo» se apagaría solo el día que
      esa sea la respuesta correcta, así que prohíbe la **forma** (`<Plan> y <Plan>` en un
      literal o en texto JSX) sobre un universo caminado del DISCO — `git ls-files` no ve el
      archivo nuevo sin commitear, que es justo el sujeto a cazar. Validado por mutación:
      devolver la frase vieja → 2 rojos; vaciar el universo → 1 rojo.

      **Lo PREVENTIVO, dicho como tal:** el MRR decidía si cobrar el add-on con
      `org.plan === "basic"` — cierto por casualidad, porque hasta la escalera C Básico era el
      único plan pago sin la reserva. Ahora le pregunta al catálogo. La mutación lo confirma:
      volver a `=== "basic"` deja los 7 casos en verde, **hoy son equivalentes**, así que esto
      no arregla un bug vivo. La guarda `isSubscriptionPlan` sí hace falta: `free` tampoco la
      trae y cobrársela inflaría el MRR con una cuenta que no paga (sacarla pone el gate rojo).

      Gates: `tsc` 0 · `vitest` 4945 pass / 0 fail · `eslint` 0 errores, corridos **también en
      el VPS** sobre el árbol publicado.

- [x] 🔴 **CERRADO el 2026-09-13: un cron que no entregó NADA contestaba «ok» y su lanzador
      salía 0.** ⚠️ COMMITEADO Y PUBLICADO (`b5cae43`, rama
      `claude/chatbots-platform-review-0d1d09` de `onia-platform`), **falta mergear y desplegar**.
      **Salió de medir producción, no de leer la cola:** el ítem de arriba pedía medir qué
      módulos usan de verdad las empresas, y al contar `audit_logs` apareció que la cuenta de la
      importadora (`bolivian-electricidad-e6t21`) nunca completó el onboarding y su prueba vence
      el 14-sep. Al ir a ver si el drip que existe para eso corría, el log lo dijo:
      `/var/log/onia-trial-drip.log` tiene **ocho corridas seguidas** con todos los envíos
      rechazados (`Invalid login: 535 5.7.8 Authentication failed`) y `sent:0`, contestando
      **HTTP 200 con `ok:true`**. El lanzador del host es `curl -fsS`, y `-f` sólo falla con
      HTTP ≥ 400: el cron salió 0 los ocho días y ningún vigía tuvo de qué agarrarse.
      **Por qué se paga en clientes:** el drip es el único canal que recupera al lead que se
      registró y no volvió, y el objetivo del sistema es cerrar cinco.
      **Era una clase, no un archivo.** `renewal-reminders` ya devolvía `ok: errors.length === 0`
      y sus **cuatro** hermanos clavaban `ok: true` al lado del contador de sus propios fallos —
      el par que diverge y se arregla de un solo lado. Ahora el juicio vive en
      `lib/cron/veredicto-de-corrida.ts` y lo usan los **seis**: sin fallos 200; con algo
      entregado, `ok:false` en 200 (queda auditado y no despierta a nadie); con **cero**
      entregado, **500** — el único caso que describe un canal caído entero y el único que el
      `curl -f` puede ver.
      **El gate se equivocó dos veces antes de servir, y las dos quedaron escritas en él:**
      pedir que el nombre APARECIERA absolvía al que importa el helper y no lo llama, y buscar
      contadores por nombre (`errors|fallidos|failed`) absolvía a `{ ok: true, ...totals }`,
      que esconde su propio `errors` en el spread. Hoy pregunta tres cosas —que el veredicto se
      LLAME, que ningún cuerpo afirme un `ok` literal sin medirlo (salvo los `skipped:`, que
      declaran que no se intentó nada), y que el veredicto suba al **código HTTP**— con el
      universo derivado del disco caminando la carpeta, no `git ls-files`.
      **Validado por mutación en cuatro puntos**, rojo por el motivo correcto en los cuatro.
      Gates en casa y **re-corridos en el VPS antes de publicar**: `tsc` 0, `eslint` 0,
      **4.873 tests verdes**.
      Lo que NO cierra este carril: el `run-onia-*.sh` del host sigue siendo `curl -fsS` sin
      mirar el cuerpo — con el 500 ya le alcanza para salir ≠ 0, pero **quién lee ese exit** es
      del dueño de los crons del VPS.

- [x] **CERRADO el 2026-09-11: un mes pago del add-on del chatbot valía PARA SIEMPRE**
      (`app/api/admin/subscription-payments/route.ts` · `lib/subscription/addon-vigencia.ts`,
      commit `5011003`).

      El add-on se cobra por período —**Bs 390 al mes**, o su anual— y aprobarlo escribía
      `organizations.whatsappAddon = true`: un booleano **sin fecha**. Nada lo apaga nunca:
      ningún cron lo vence (`grep -c "whatsappAddon: false"` en `app/api/cron` y `lib/` da
      **0**), `renewal-reminders` ni lo nombra (`grep -ci addon` da **0**), y
      `isWhatsAppAddonActive` devuelve `true` mientras la columna esté encendida. **El primer
      cliente que pagara un mes se lo quedaba para siempre.**

      **Por qué no lo veía nadie: el lado hermano está SANO.** El plan tiene `planEnd`, aviso
      D-7/D-3/D-1, gracia y solo lectura — y todo eso se escribió mirando la **misma tabla**
      (`subscription_payments`) y la **misma cola del superadmin**. Media familia cubierta se
      lee como familia cubierta. Ningún gate podía **expresar** la pregunta: no sobra ni falta
      una palabra, la pantalla renderiza perfecto, no es un rubro ni un rol, el monto sale de
      la fuente única, y `whatsappAddon` es una columna real, así que `tsc` está contento. Y el
      comentario del propio código afirmaba que la fecha *«queda en `reviewedAt` del pago»* —
      un campo que **nadie lee** para decidir nada: un comentario afirmativo desactiva la
      auditoría igual que uno que explica por qué algo no se puede.

      **Dónde va la fecha, y por qué no en una columna nueva:** la capacidad `addon.whatsapp`
      de `organization_entitlements` **ya** tiene `validUntil`, y el helper canónico ya lo
      respeta (`hasActiveWhatsAppEntitlement` filtra `null | > now`). Una columna nueva sería
      una segunda fuente de verdad del mismo hecho. Activar **deja de encender el booleano** a
      propósito: es justamente el que no caduca, y como el criterio es `columna || capacidad
      vigente`, escribir las dos dejaría el add-on encendido para siempre con la fecha al lado
      sin poder apagar nada.

      **Tres agujeros más de la misma puerta, cerrados en el mismo cambio:**
      · **El ciclo del add-on no se validaba al aprobar.** La rama del add-on se saltaba toda
        validación de catálogo; un pago con `cycle: "contratacion"` —ciclo **eliminado** el
        2026-08-21 con el cobro de instalación— se aprobaba igual, y hoy no tendría de dónde
        sacar el vencimiento. Ahora es **422**, fail-closed: caer a un default es exactamente
        como se regala tiempo pago.
      · **Sin lock propio.** Dos pagos del add-on de la misma org aprobados a la vez leían la
        misma fecha y el segundo pisaba al primero: el cliente paga dos meses y recibe uno.
        Mismo TOCTOU que ya se había cerrado en `planEnd`, con su **propio** recurso
        (`addon-whatsapp:<org>`) porque el add-on no compite con el plan.
      · **El aviso callaba la fecha.** Ahora dice *«Está activo hasta el …»*. Su caso de test
        afirmaba lo contrario —*«el add-on no mueve `planEnd`: prometer un vencimiento sería
        mentir»*—, cierto **mientras** el add-on fuera para siempre: **el gate cementaba el
        defecto**.

      La vigencia y su extensión salen de `extendPlanEnd`, la **misma** función que mueve
      `planEnd`, no de una aritmética paralela: renovar antes de vencer **suma** sobre lo ya
      pagado, renovar después arranca de hoy.

      **Medido en producción ANTES de tocar** (`docker exec supabase-db psql`): las dos
      capacidades activas —`clinica-sergio-p2ljs` y `onia-interna`— son otorgamientos con
      `validUntil` **NULL** y hay **cero** pagos de add-on aprobados. O sea **esto no le corta
      el add-on a nadie** que hoy lo tenga: aplica desde el próximo cobro.

      **Prueba:** `lib/subscription/addon-vigencia.test.ts` (6 casos) y 6 casos nuevos en
      `app/api/admin/subscription-payments/route.test.ts`, **en rojo primero** por el motivo
      correcto (7 fallas). **Cinco mutaciones, cinco rojos:** volver al booleano (7 casos) ·
      el **esquive** de activar y tirar la fecha (1) · ignorar el ciclo (3) · no leer la
      vigencia vigente (1) · sacar el lock (1). ⚠️ **La cuarta pasó en VERDE en la primera
      versión:** *«mayor que la vigencia vigente»* no distingue **sumar** de **pisar**, porque
      un mes desde hoy también es mayor que una vigencia a quince días — ahora se exige el
      período entero **después** de lo ya pagado. Sólo se ve mutando, nunca leyendo.
      Gates sobre el árbol con `origin/master` mergeado: `tsc` 0 · `vitest` **4527/4534**
      (7 skipped) · `eslint` 0 errores.

      **Lo que sigue, de la misma familia y NO hecho acá:** el add-on ahora puede vencer y
      **nadie avisa que va a vencer** — el plan tiene D-7/D-3/D-1 por tres canales y el add-on
      no tiene ninguno. Hoy no muerde (cero add-ons pagos vivos, y las dos capacidades
      otorgadas no vencen), y el dueño se entera de la fecha al pagar; el día que haya un
      add-on pago, sin recordatorio el bot se apaga sin aviso. Está anotado como el próximo
      ítem de esta familia, no como una deuda oculta.

- [x] **CERRADO el 2026-09-11: el recordatorio de renovación le reclamaba pagar a quien YA
      había pagado — y a un cliente anual le cotizaba el mensual**
      (`app/api/cron/renewal-reminders/route.ts` · `lib/subscription/cobro-del-plan.ts`,
      commit `f2962df`).

      Auditando lo recién entrado a `master` (el ciclo de renovación por QR, `26212f5`, con
      ocho fixes encima en un día). El cron le preguntaba mal a `subscription_payments`, de
      dos formas:

      **1. La tabla es COMPARTIDA.** El add-on del chatbot cobra por la misma tabla, marcado
      con `plan = "whatsapp_addon"`. El cron tomaba el `cycle` del último pago aprobado **sin
      excluirlo**, así que a un cliente **anual** que compró el add-on **mensual** el
      recordatorio le cotizaba **Bs 750 por una renovación de Bs 7.500**. La consecuencia la
      describe el propio módulo de recordatorios: *«el dueño transfiere lo que el correo dice
      y el cobro se rechaza por Monto declarado inválido: paga de menos y el plan no se
      renueva»*. `app/checkout/page.tsx` **ya** excluía el add-on, con su motivo escrito al
      lado (*«o un pago del add-on taparía el estado real de la suscripción»*); el cron nació
      sin ese filtro. Por la misma puerta se colaba la cadencia: un plan semanal volvía a
      recibir «vence en una semana» el día que lo pagó, que es lo que `887b3ea` cerró el día
      anterior.

      **2. De quién es la pelota.** Todo pago va a **revisión humana** (`activation.ts`: *una
      captura de pantalla no es prueba de pago*), así que `PENDING` no es un caso raro: es el
      camino **normal** entre que el cliente transfiere y que nosotros aprobamos. En ese hueco
      el cron seguía mandando **«Tu plan venció — Renovar mi plan»** por correo, in-app y push
      a quien ya había pagado. No es sólo mala cara: **lo invita a transferir dos veces.**

      **Por qué no lo veía ningún gate:** no sobra ni falta una palabra, el monto sale de la
      fuente única, el rol filtra bien, la fecha va en la zona del negocio y el rubro no entra.
      Lo que estaba mal era **a quién se le preguntaba** y **qué estado se ignoraba**. Y el
      hermano sano al lado —`estadoDelCheckout`, que **sí** sabe decir «en revisión»— hacía
      leer la familia como cubierta.

      **El corte va ANTES de reclamar el paso, a propósito:** si el comprobante se RECHAZA,
      `planEnd` no se movió y mañana sale el recordatorio que corresponde (la pelota volvió a
      ser suya); si se APRUEBA, `planEnd` avanza y el ciclo nuevo nace con sus pasos libres. El
      silencio queda **medido** en la respuesta del cron (`enRevision`), porque un cero no se
      distingue de la calma.

      **De paso, el guardia hermano del monto estaba HUECO:** `monto-del-ciclo-que-paga.test.ts`
      exigía `toContain("terminoDeRenovacion")` y **el `import` lo absolvía** — reemplacé la
      llamada por un monto a mano y sus 6 casos siguieron en VERDE. Anclado a la asignación.
      Sólo se ve mutando; leerlo no alcanza.

      **Prueba:** 11 casos nuevos en `lib/subscription/cobro-del-plan.test.ts`, **en rojo
      primero** por el motivo correcto (los 2 que miran al LLAMADOR). Seis mutaciones, seis
      rojos: filtro fuera de la consulta · guarda muerta con `false &&` (literal intacto) ·
      corte movido después del reclamo · el módulo contando el `PENDING` del add-on (callar de
      más) · el ciclo sin filtrar · el monto armado a mano. Gates sobre el árbol real:
      **4514 tests, `tsc` 0, `eslint` 0**.

      ⏳ **Entregado, esperando merge a `master` y publicación** — el integrador lo toma de
      `claude/chatbots-platform-review-0d1d09`; el pedido de deploy vivo es `t_0e451a15`.

- [x] **CERRADO el 2026-09-11: el gate que prueba que el recordatorio de cita LLEGA llevaba
      días REVENTANDO EN ROJO, o sea acusando al producto de no entregar**
      (`scripts/recordatorio_cita_vivo.mjs` · `npm run recordatorio:vivo`)**.** Corriendo los
      gates vivos uno por uno salió con un stack de Node y `exit 1`:
      `insert or update on table "patients" violates foreign key constraint
      "patients_organizationId_fkey" — Key (organizationId)=(cmsvyguui…) is not present`.

      **La causa: el gate pedía prestado su sujeto.** Tenía la org y el doctor escritos a mano
      como dos ids de producción. Esa org figuraba **«borrable»** en
      `ONIA_INFRA_LIMPIEZA_Y_ORDEN.md` §5.1 y alguien la borró, con razón. Desde entonces el
      `insert` moría, la excepción salía **sin `catch`** y el proceso terminaba en **código 1 —
      ROJO**, que se lee «la plataforma no le avisa al paciente». El falso rojo va en la
      dirección cara: manda a depurar un circuito sano.

      **Y nadie lo vio, por la trampa que este repo ya tiene anotada:** lo único cableado a
      `npm test` es su `--self-check` **puro** (`test:recordatorio-instrumento`), que no toca
      producción y seguía en verde; la medición **viva** quedó de alias suelto y no la corría
      nadie.

      **Pedir prestada una fila tiene una segunda muerte, más silenciosa:** que siga existiendo
      y deje de CALIFICAR. El cron corta con `isWriteBlocked(org)` — corte que entró **ayer**
      (`278f030`) — así que el día que a la org prestada se le venza el plan, el gate se pone
      rojo sobre un circuito que hace exactamente lo correcto.

      **El arreglo: el gate es DUEÑO de su sujeto.** Crea org + profesional + paciente + cita
      sellados con la corrida, mide, y el `finally` borra las cuatro filas en orden de
      dependencia (acotado al sello, nunca a `zz-qa-%` suelto, que es de dos carriles).
      Ninguna limpieza ajena puede volver a matarlo. Además, **sembrar es preparar, no medir**:
      si el `insert` falla ahora sale `2` — NO MEDIDO —, nunca rojo.

      **Dos precondiciones se preguntan en vez de suponerse, y las dos salen NO MEDIDO:**
      · que la org sembrada esté viva **según la regla del producto** (`cuentaViva`, espejo de
      `planAccessLevel(...)==="full"`), así un endurecimiento del corte se reporta como
      «fixture viejo» y no como rojo;
      · que el cupo mensual de correo no esté agotado — `sinCupo` descarta la cita **antes** de
      intentar entregar, así que cobrarlo como rojo acusa al producto de algo que no se pudo
      ni ejercer.

      **El fixture con los defaults de la tabla ya mordió, en la primera corrida del arreglo:**
      sin `plan`, la org nace `free`, y `free` trae `emailsPerMonth: 0`
      (`lib/plan-catalogo.ts`) → `evaluadas:1, sinCupo:1`. Un sujeto tiene que parecerse a un
      cliente REAL: `/api/auth/register` crea toda org con `TRIAL_PLAN` (`professional`), y las
      tres orgs vivas de producción lo tienen.

      **Prueba, medida hoy contra producción — el circuito estaba SANO todo este tiempo:**
      `{"evaluadas":1,"enviados24Email":1,"sinCupo":0}` · `reminder24hSentAt` escrito ·
      entrega real en el log de `onia-mail`: `status=sent (250 2.0.0 OK … gsmtp)` · **exit 0**.
      Producción quedó **limpia** (0 filas del sello; la única `zz-qa-%` que queda es de
      `recorrido-cliente` y no se tocó). Self-check: **21 casos**, validados con **5
      mutaciones** que caen en rojo — incluida la que repone un id a mano, que es el ancla
      para que el arreglo no se deshaga en silencio.

- [x] **CERRADO el 2026-09-11: el plan SEMANAL recibía «tu plan vence en una semana» el día
      que lo pagaba** (`lib/subscription/renewal-reminders.ts` · `plan-state.ts` ·
      `app/api/cron/renewal-reminders/route.ts`)**.** La escalera D-7/D-3/D-1/vencido que
      entró el 10-sep (`26212f5`) se calibró para el ciclo **mensual** y se aplicaba igual al
      semanal, que dura **7 días exactos** (`addCycle`). Medido con el código vivo: un cliente
      paga su semana, `extendPlanEnd` le pone `planEnd = hoy + 7 d`, y el cron del día
      siguiente calcula `diasRestantes = 7` → dispara el paso 7. **Cuatro avisos de cobro en
      siete días, el primero a horas de haber pagado.** El Básico semanal son **Bs 89**, la
      forma más barata de entrar: el primer cliente pago es el más probable que lo sufra.
      Hoy hay **0 orgs con `planEnd`** en producción, así que el defecto estaba **latente** —
      entraba ya aprobado con el primer cobro semanal, porque nadie audita lo que «ya estaba».

      **Por qué no lo veía ningún gate:** el monto sale de la fuente única y es el del ciclo
      correcto (`63de4ff`), el rol filtra bien (`825f227`), `planCanceledAt` se respeta, el
      rubro no entra y **no sobra ni falta una palabra**. Lo que estaba mal es el par
      *(cadencia, largo del ciclo)*, que no era sujeto de nadie.

      **Se cerró la CLASE, no la instancia:** un paso sólo corresponde si su umbral es MENOR
      que el largo del ciclo, y el largo se **deriva de `addCycle`** —la misma función que
      mueve `planEnd` al cobrar— en vez de una tabla al lado que se desincronice. Un ciclo
      nuevo más corto (quincenal) queda cubierto solo. `cycle` va **requerido** en
      `selectRenewalStep`: un opcional con default deja el hueco en el LLAMADOR y no lo ve ni
      `tsc` ni el gate del módulo. Ciclo desconocido (plan otorgado a mano) = `null` y no se
      recorta nada — mismo criterio que ya usa el monto: ante la duda no se inventa.

      **PRUEBA.** Rojo primero por el motivo correcto: `AssertionError: expected 7 to be null`.
      Verde después, y las **tres mutaciones en rojo**: guardia arrancado (exit 1) · el helper
      del largo a una constante (exit 1) · el llamador sin `cycle` (**exit 2 en `tsc`**,
      TS2345 — ésa es la que justifica el parámetro requerido). Gates corridos **en el VPS**,
      sobre el árbol exacto que se publicó: `tsc` 0 · `vitest` **4444** · `eslint` 0 errores.
      Commits `887b3ea` + `99c5178` en `claude/chatbots-platform-review-0d1d09`.

      ⚠️ **Está en la RAMA, no en `master`, y por lo tanto NO llegó al cliente.** Falta que el
      integrador la mergee y después el swap. No se cuenta como entregado hasta eso.

      🔎 **De paso, y vale para todo carril: el gate que escribí para esto nació TAUTOLÓGICO.**
      Pasaba los 5 casos en verde con el esquive puesto (mutar `largoDelCicloEnDias` a la
      constante `30`), porque derivaba el vencimiento esperado de la MISMA función que el
      código bajo prueba consulta: la mutación movía a la vez el sujeto y la expectativa. Sólo
      apareció **mutando después de arreglar**. Corregido en `99c5178` cruzando dos funciones
      distintas (`extendPlanEnd`, la del cobro, contra la cadencia) y **afirmando** el largo
      del semanal contra el literal `7` en vez de derivarlo.

- [x] **CERRADO el 2026-09-10: el panel le inventaba al dueño la causa de un fallo que el
      servidor ya le había explicado.** El botón «Recordatorio» de cada cita llama a
      `POST /api/email/appointment-reminder/[id]`, que contesta **siete** motivos distintos y
      redactados para él —cupo del plan agotado (403), correo del producto sin configurar
      (503), el cliente pidió no recibir correos (422), el cliente no tiene correo (422), el
      envío falló (502), no autorizado (403), error interno (500)— y la pantalla los aplanaba
      todos a la palabra **«Sin email»**. Quien agotó su cupo mensual leía que su cliente no
      tenía correo, abría la ficha, lo veía ahí, y concluía que el sistema estaba roto: la
      causa real —que se arregla subiendo de plan, o sea plata para Onia— no la veía nadie.
      De paso, `handleSendReminder` no tenía `try`/`catch`: con la red cortada el botón quedaba
      deshabilitado en «loading» **para siempre**, porque el `setTimeout` que lo libera tampoco
      llegaba a programarse.

      **La clase, no la instancia.** Sujetos derivados del disco (todo `.tsx` del panel que
      llame a `fetch`), no una lista de pantallas: otras **tres** acciones descartaban el
      motivo — aprobar un pago del admin, guardar el plan de una organización, y
      activar/desactivar un servicio. Las cuatro arregladas con `mensajeDeError`, el helper que
      ya existía y que tres funciones del MISMO archivo de citas ya usaban (el hermano sano al
      lado del roto, otra vez).

      **Por qué ningún gate podía verlo:** no sobra ni falta una palabra (los barridos de copy,
      obra, rubro, precios y promesas pasan verdes), el rubro deriva bien —la API ya usa
      `idioma-del-error`—, la pantalla renderiza perfecto, el camino feliz funciona, y la rama
      **sí** mira `res.ok`, así que `camino-de-fallo.test.ts` la daba por cubierta. Ese gate
      pregunta si la acción MIRA la respuesta; éste es un escalón más adentro: si USA el motivo
      que la respuesta trae.

      **Gate:** `app/(dashboard)/causa-del-fallo.test.ts` + `lib/http/causa-del-fallo.ts`.
      Falla CERRADO (una rama nueva que invente su causa nace en rojo). Validado por mutación
      en tres direcciones —revertir el arreglo, detector siempre-vacío, no reconocer el motivo—:
      las tres en rojo, confirmadas por el `exit` del proceso y verificando que el reemplazo
      entró. Gates: `tsc` 0 · `vitest` 345 archivos verdes · `eslint` 0 errores.

      ⚠️ **El instrumento se validó ANTES que el producto, y hacía falta:** sus dos primeras
      mediciones dieron **27** y **15** sujetos, las dos mal y en la dirección cara —la que
      manda a arreglar código sano—. La primera metía el camino FELIZ (`if (res.ok) {`), que no
      es sujeto de este gate sino del hermano; la segunda acusaba a un `motor.ok` que no es una
      `Response` y a `messageFromPayload`, que **sí** lee el motivo. Los sujetos reales eran
      **cuatro**. Y un tercer falso positivo enseñó algo reusable: contar la ventana en líneas
      CRUDAS gasta el presupuesto en los renglones que dejó vacíos un comentario borrado, así
      que **el comentario que explica una decisión empuja el motivo fuera del alcance y el gate
      acusa al código que lo explica**. Se cuenta en líneas con contenido, y la rama se corta
      en su bloque real.

      `73350a1` (`onia-platform`), rama `claude/chatbots-platform-review-0d1d09`.
      ⚠️ **Commiteado y pusheado, NO en `master` y NO desplegado.** Falta que el integrador lo
      mergee; el pedido de deploy vivo es `t_c78d9fa8`, comentado ahí.

- [x] **CERRADO el 2026-09-10: importadora tenía «Créditos» en su menú y NINGÚN camino para
      originar uno — la pantalla quedaba vacía de por vida prometiendo que se iba a llenar.**
      Arreglado en `3e0491b` (`onia-platform`), rama `claude/chatbots-platform-review-0d1d09`.
      ⚠️ **Commiteado y pusheado, NO en `master` y NO desplegado**: falta que el integrador lo
      mergee, y recién después viaja con el pedido de deploy de `plataforma` (`t_6e23cd1c`,
      comentado ahí como *sin mergear todavía* para que nadie lo lea como publicable).

      **Lo medido, sobre los 8 packs, no deducido.** `proveegest-electrico` —importadora, rubro
      de la v1.0— declara `/comercio/fiados` como **«Créditos»**, y su propio pack escribe la
      intención al lado: *«Reusa el modulo comercio: CxC (ventas a credito B2B)»*. Pero
      `/comercio/caja` **no estaba ni en su nav ni en sus acciones rápidas**, y la caja es el
      único origen: `VentaForm` es el **único** llamador de `POST /api/comercio/ventas`, que es
      lo que escribe la orden con `metadata.fiado=true`. O sea que sus tarjetas «Por cobrar»,
      «Cliente(s) que deben» y «Vencido» quedaban en cero para siempre, bajo un vacío que dice
      *«Nadie te debe todavía»*. Los otros **tres** packs con esa pantalla sí tenían el origen
      (comercio y ganadería como «Caja», servicios profesionales como «Nuevo cobro») — y ese
      hermano sano al lado es justo lo que hacía leer la familia como cubierta.

      **La clase, que es lo que vale.** La familia «permiso concedido, CAMINO ausente»
      (`caminos-transversales`, `camino-a-recetas`, `enlaces-del-panel-alcanzables`) pregunta si
      se puede **llegar** a la pantalla. Ésta es su hermana y pregunta otra cosa: llegando
      perfecto, **¿de dónde sale lo que la pantalla promete mostrar?** Ningún gate podía verla —
      no sobra ni falta una palabra, la pantalla renderiza bien, el rubro ya derivaba su idioma
      (`idioma-de-credito.ts`) y la API ya se lo permitía (`comercio/ventas` es `CON_COMERCIO`,
      que incluye a importadora). **Faltaba el camino, no el permiso ni el código.**

      - **Gate nuevo:** `lib/platform/origen-del-dato-en-el-menu.test.ts`. Sujetos derivados de
        `VERTICAL_PACKS` —un pack nuevo nace **cubierto**— y el par (pantalla, origen) **no se
        cree a sí mismo**: se re-mide contra el disco que el origen siga siendo el único llamador
        de la API creadora, porque una excusa escrita en prosa se pudre y nadie la vuelve a
        mirar. Validado por **3 mutaciones, 3 rojos** (sacar la entrada del menú · declarar un
        origen equivocado · declarar una API que no existe), y verde al restaurar.
      - **El arreglo:** entrada **«Ventas»** en el menú de importadora, grupo `dinero`, junto a
        «Créditos». Rótulo propio porque un importador no atiende un mostrador: registra ventas,
        algunas a crédito. Icono `point_of_sale`, que ya está en el subset de la fuente.

      **Dos gates hermanos se pusieron rojos con el cambio, y los dos decían algo cierto** — el
      sistema funcionando, no ruido:

      - `idioma-de-credito.ts` armaba el texto con `` `la ${caja}` ``, así que apenas un pack le
        puso a esa pantalla un rótulo distinto de «Caja» salía **«se registran desde la Ventas»**.
        El artículo no se deduce del rótulo: ahora se **nombra el ítem del menú entre comillas**,
        y sirve igual para «Caja», «Ventas» o «Nuevo cobro».
      - con cuatro packs y rótulos que no coinciden, `/comercio/caja` entró al gate de pantalla
        compartida con el título **«Caja» tipeado fijo**. Ahora lo deriva del pack
        (`idiomaDeVenta().rotulo`). Y ese gate **leía sólo `page.tsx`**, ciego al componente
        hermano que pinta de verdad (`CajaPantalla.tsx`): pasa a leer la **carpeta entera**, que
        es la trampa del client component hermano ya medida en los gates de copy.

      Snapshot del pack eléctrico actualizado **a propósito** (+11 líneas: sólo la entrada nueva).
      Gates: `tsc` 0 · `vitest` **4.277 passed** · `eslint` 0 errores.

- [x] **CERRADO el 2026-09-10: el producto le mostraba al cliente el NOMBRE del plan en inglés
      —la clave interna— en las tres pantallas donde decide y donde paga.** Arreglado en
      `fe6eb65` (`onia-platform`), rama `claude/chatbots-platform-review-0d1d09`.
      ⚠️ **Commiteado y pusheado, NO en `master` y NO desplegado**: falta que el integrador lo
      mergee, y recién después viaja con el pedido de deploy de `plataforma`.

      `lib/pricing.ts` declara `PLAN_LABELS` como «UN solo lugar» y su propio comentario
      registra que esta clase **ya explotó una vez**: el plan top se mostraba como «Clinica» o
      «Grupo Clinico» en cinco archivos, así que un comerciante leía que contrataba algo para
      clínicas. Se escribió `nombreDePlan()` para cerrarlo — y se cerraron las **instancias** de
      entonces, no la clase. Medido hoy, tres superficies seguían esquivando el helper:

      - **`/billing/recurring`** ofrecía subir a los planes **«Professional»** y **«Clinic»**.
        Onia vende **Profesional** y **Completo**: el dueño iba a `/settings` a buscar dos planes
        que no existen con ese nombre. Y «Clinic» es exactamente el caso que el comentario de
        `PLAN_LABELS` decía haber arreglado — a una ferretería, a una importadora o a un estudio
        contable les ofrecía un plan «de clínicas».
      - **`POST /api/recurring-invoices`** repetía el mismo texto en su 403, que es lo que el
        cliente lee cuando el producto le dice que no.
      - **`/settings`** tenía `badge: "Enterprise"` **una línea debajo** de
        `name: PLAN_LABELS.enterprise`, que dice «Empresa» bien, y otra píldora «Enterprise» en
        el add-on self-hosted. Derivar en un campo no prueba que la pantalla derive. El badge se
        **saca** en vez de derivarlo: flotaba justo encima de un título que ya dice «Empresa».

      **Gate nuevo:** `lib/platform/nombre-de-plan-a-mano.test.ts`, hermano simétrico del que
      vigila el MONTO. Ningún gate existente podía hacer la pregunta: `monto-de-plan-a-mano` mira
      el número; `plan-catalogo-es-la-fuente` mira qué capacidad enciende cada plan;
      `planes-en-el-idioma-del-rubro` mira el par (rubro, palabra) y acá la palabra está mal para
      los **cinco** rubros; los barridos de obra y de promesa persiguen lo que sobra o lo que
      falta, y acá **no sobra ni falta una palabra: el nombre es de otro idioma**. `tsc` y
      `eslint` no tienen nada que decir sobre un literal.

      Deriva las claves de `PLAN_LABELS` (un plan nuevo nace vigilado) y los sujetos del DISCO
      —`.tsx` y también `.ts`, porque el error de un `route.ts` es superficie de cliente—: 399
      archivos barridos. Sólo mira lo que el cliente LEE; sin ese recorte acusaba a
      `interface Clinic` y `useState<Clinic>` de `/book/[orgSlug]`, que son **tipos**, y un rojo
      falso manda a romper código sano.

      **Validado por mutación en las dos direcciones, 6 de 6 en rojo:** revertir cada una de las
      tres instancias (M1-M3), detector siempre vacío (M4), recorte del recorrido del disco (M5),
      y sacar el filtro que separa tipo de copy (M6, **2** casos en rojo — el ancla y el barrido,
      o sea que el filtro carga en los dos sentidos). Cada mutación se confirmó que ENTRÓ con
      `grep` y se leyó por la línea `Tests N failed`, nunca por ausencia de `FAIL`.

      Gates: `tsc` 0 · `vitest` 4218 pass / 338 archivos · `eslint` 0 errores.

- [x] **CERRADO el 2026-09-10: dar de baja a alguien del equipo fallaba con un error MUDO, y
      el dueño no tenía cómo saber por qué.** Arreglado en `ad1851f` (`onia-platform`), rama
      `claude/chatbots-platform-review-0d1d09`. ⚠️ **Commiteado y pusheado, NO en `master` y NO
      desplegado**: falta que el integrador lo mergee, y recién después viaja con el pedido de
      deploy de `plataforma`.

      Tres bajas **rutinarias** del producto chocan contra una foreign key `RESTRICT` y las tres
      contestaban sin decir el motivo — rotación de personal en una clínica o un salón es lo más
      normal del mundo, y el dueño quedaba en un callejón sin salida:

      | ruta | lo que hacía | lo que veía el dueño |
      |---|---|---|
      | `app/api/team/[id]` | **sin `try/catch`** → Prisma lanza → 500 pelado | «No se pudo eliminar a esta persona.» (el fallback de la pantalla) |
      | `app/api/patients/[id]` | `catch` genérico | «Error al eliminar el cliente» |
      | `app/api/treatments/[id]` | `catch` genérico | «Error al eliminar tratamiento» |

      **Reproducido contra la base de PRODUCCIÓN**, dentro de una transacción que revierte (0
      residuo verificado con un `count` posterior):

      ```
      ERROR: update or delete on table "profiles" violates foreign key
      constraint "appointments_doctorId_fkey" on table "appointments"
      ```

      Las siete FK `RESTRICT` de producción salieron de `information_schema`, no de un supuesto:
      tres cuelgan de `profiles`, dos de `patients`, una de `treatments` y una de
      `booking_sources` (esa queda afuera a propósito: el producto no ofrece darlas de baja).

      **Ningún gate podía verlo**, y por eso sobrevivió: no sobra ni falta una palabra, la
      pantalla renderiza perfecto, el rubro deriva bien, la ruta responde, y el camino **feliz**
      —borrar algo que nadie referencia— funciona. El defecto vive sólo en el camino de **fallo**
      de una operación rutinaria. Por qué importa para la v1.0: esto no rompe nada, genera
      **llamadas a soporte**, que es el techo real del negocio (`CLAUDE.md` §9).

      **Se pregunta ANTES de borrar** (`lib/platform/borrado-bloqueado.ts`) en vez de atrapar el
      `P2003`: no ata el mensaje a la forma del `meta` de Prisma, se prueba sin base y permite
      decir **cuántas** son. Ahora contesta `409` con
      «No se puede eliminar a Ana Paz: tiene 3 citas y 1 receta en el sistema.» No promete
      «reasignalo» ni «archivalo» mientras esas pantallas no existan: hay un caso que lo exige.

      **El gate deriva su universo de `prisma/schema.prisma`** —toda relación obligatoria sin
      `onDelete:` es `RESTRICT`—, así que una referencia nueva **nace cubierta** o pone rojo; y
      exige las **dos direcciones**, para que la tabla declarada no se pudra.
      **Validado por mutación, seis en rojo:** sacar una referencia viva, agregar una muerta,
      devolver `[]` siempre, sacarle el filtro por `organizationId` al conteo, y las **dos de
      esquive** en la ruta. ⚠️ Las de esquive **pasaron VERDES con la primera versión del
      guardia**, que miraba que la ruta *llamara* al helper y no que *usara* su respuesta: una
      ruta podía llamarlo y tirar el resultado. Se reescribió sobre la **vecindad** de la
      llamada (la guarda `bloqueos.length > 0` y el `409` pegados a ella).

      Gates: `tsc` 0 · `vitest` **4199 passed** (336 archivos) · `eslint` 0.

- [x] **CERRADO el 2026-09-08: el cupo de WhatsApp cortaba MUDO — el dueño paga el add-on y se
      quedaba sin canal sin enterarse.** Arreglado en `7756295` (`onia-platform`), rama
      `claude/chatbots-platform-review-0d1d09`. ⚠️ **Commiteado, NO desplegado**: viaja con el
      pedido de deploy de `plataforma`.

      El cron de recordatorios (`app/api/cron/appointment-reminders/route.ts`) tiene **dos**
      cupos hermanos. El de **correo** avisa al dueño al cruzar el 80 % y el 100 %
      (`contarEmail` → notificación in-app `EMAIL_QUOTA_WARNING`, con su test desde siempre).
      El de **WhatsApp** cortaba en silencio: `contarWhatsapp` sólo incrementaba el contador.

      **Qué le pasaba al cliente.** El límite operativo son **200 mensajes/mes**
      (`WHATSAPP_ADDON_MONTHLY_LIMIT` ← `pricing.ts:52`), y cada cita gasta **dos** (recordatorio
      de 24 h + el de 2 h): **100 citas al mes lo agotan**. Al agotarse, los pacientes **con**
      correo caen a correo — otro canal, sin decirle al dueño que el que **paga** dejó de usarse —
      y los que **no** tienen correo (`!apt.patient.email` → `return "omitido"`) **no reciben
      nada**. Nadie se entera de ninguna de las dos cosas.

      **Por qué ningún gate podía verlo:** no sobra ni falta una palabra, no es un rubro, la
      pantalla renderiza bien, y **el corte por cupo ya estaba probado y en verde** («el cupo
      mensual de WhatsApp sube DENTRO de la corrida»). Lo que faltaba no era el corte: era el
      **aviso**. Y el mismo cron ya sabe avisar por este canal (`WHATSAPP_FAILED`), así que el
      hueco era exactamente esa mitad de la familia — cerrar una mitad hace dar la otra por
      cubierta.

      **Prueba.** Tres casos nuevos en `route.test.ts`, en ROJO antes del arreglo por el motivo
      correcto (`expected [] to have a length of 1`). Validado **por mutación en 4 direcciones,
      las 4 en rojo**: arrancar el aviso del 100 %; arrancar el del 80 %; **avisar SIEMPRE** sin
      esperar el cruce (esquive — lo ataja el caso «lejos del techo no molesta»); y avisar con el
      **tipo de su hermano de correo** (esquive). Gates: `tsc` 0 · `vitest` **4176 verdes** ·
      `eslint` 0.

- [x] 🔴 **CERRADO el 2026-09-08: el botón decía «Enviar» y el sistema no mandaba la cotización
      a nadie.** Arreglado en `9208d5c` (`onia-platform`), rama `claude/chatbots-platform-review-0d1d09`.

      El dueño de una importadora apretaba **«Enviar»**, el chip quedaba en **«Enviada»**, y su
      cliente no recibía nada: la acción sólo mueve la fila de `draft` a `sent`
      (`transicionarCotizacion`, `PATCH /api/importadora/cotizaciones/[id]`). **Medido, no
      supuesto:** el módulo no tiene correo, ni WhatsApp, ni PDF, ni link público (`grep` de
      `pdf|whatsapp|mailto|sendEmail|share|link` sobre `app/(dashboard)/importadora/` y
      `lib/importadora/cotizaciones.ts` → cero), y la cotización guarda **únicamente
      `clienteNombre`** — no existe un dato de contacto al que enviarla, así que cumplir la
      promesa era **estructuralmente imposible**. Una venta perdida en silencio, en un rubro de
      la v1.0.

      **Por qué ningún gate podía verlo, que es lo que vale para otras pantallas.** No sobra una
      palabra prohibida, no falta un rubro, el precio sale de la fuente y la pantalla renderiza
      perfecto: «Enviar/Enviada» es vocabulario **legítimo** de una cotización. Lo que estaba mal
      era el par **(lo que el rótulo AFIRMA, lo que el módulo PUEDE hacer)**. Y hay un agujero
      estructural detrás: derivando el universo de `VERTICAL_PACKS`, **estas tres pantallas
      (`/importadora/cotizaciones`, `/costeo`, `/reprecio`) las declara UN SOLO pack**, así que
      quedan fuera del gate de cobertura multi-rubro **por construcción** — no hay otro pack que
      las nombre distinto, no son «compartidas», y por eso no las mira nadie. Son las **únicas
      tres** en esa condición, y las tres son de la v1.0.

      **Arreglo: se condiciona la promesa, no se borra la función** (mismo patrón que `SEARXNG` y
      que el horario sin declarar): «Marcar como enviada» y «Enviada por vos». Llevar el estado
      del pipeline comercial sigue sirviendo; deja de mentir. La acción interna sigue llamándose
      `enviar` — es el contrato de la API y de la máquina de estados del core, no se toca.

      **El gate cruza el rótulo contra la existencia de una vía de salida, no persigue la
      palabra** (`promesa-de-envio.test.ts`): el día que se construya el envío real, «Enviar»
      vuelve a estar permitido solo y el gate se apaga **por la razón correcta**, en vez de
      quedar huérfano persiguiendo una forma que ya nadie escribe. Validado **por mutación en
      tres direcciones** —revertir el chip, esquivar con «Enviar ahora», vaciar un rótulo
      ajeno—: las tres en rojo, confirmadas por `Tests 1 failed` explícito y verificando que la
      mutación entró.

      **Mirado renderizado** con el CSS del build vivo de producción (el arreglo está detrás del
      deploy, así que la pantalla real todavía muestra el texto viejo): la fila mide **50 px
      igual que antes**, el texto más largo no la envuelve ni la rompe; chip 73→128 px, botón
      67→169 px, cero respuestas ≥400 en el log de la misma corrida.

      ⚠️ **Commiteado y pusheado, NO desplegado**: el cliente no lo ve hasta el swap. El pedido
      de deploy vivo ya existe y no se duplica.

- [x] 🔴 **CERRADO el 2026-09-08: el bot de WhatsApp le afirmaba a la gente de un negocio un
      horario de atención que NADIE había cargado.** Arreglado en `4ce8f88` (`onia-platform`).

      Sin grilla, `horarioQueSeDice` caía en `openTime`/`closeTime`, y ese par **no es un dato
      del negocio**: es el literal que el alta escribe para toda org nueva
      (`app/api/auth/register/route.ts` → `initialSettings`, y el mismo par como `@default` de
      `clinic_settings` en `prisma/schema.prisma`). Ninguna pantalla del producto lo escribe —
      `SettingsClient` sólo lo muestra, y la única ruta que lo acepta
      (`PATCH /api/clinic-settings`) está registrada sólo para dental y no la llama nadie—, así
      que **sin grilla vale `08:00 - 18:00`, siempre**.

      **Medido en producción, no deducido** (`docker exec supabase-db psql`, 2026-09-08): de las
      **10** organizaciones, **CINCO** no tienen grilla — `bolivian-electricidad-e6t21`
      (`proveegest-electrico`), `qa-modulos-rj7tv` (`proveegest-electrico`), `qa-modulos-mrk0q`
      (servicios profesionales), `zz-qa-estetica-modulos-6tzgb` y `zz-qa-salteo-horarios-…` — y a
      las cinco el bot les contestaba `08:00 - 18:00` como un hecho. Texto exacto que recibía la
      persona, capturado antes de tocar nada:

      | superficie | lo que decía |
      |---|---|
      | menú (`horariosText`) | `⏰ Horario de atención:\n*08:00 - 18:00*` |
      | contexto de la IA (`buildSystemPrompt`) | `Horario de atención: 08:00 - 18:00` |

      **Por qué duele más de lo que parece:** a comercio e importadora `opcionesDelMenu` les
      ofrece **UNA sola** opción, «Horarios de atención». O sea que lo único que el bot sabía
      hacer por **2 de los 5 rubros de la v1.0** era mandar a su gente a una puerta cerrada —
      con el add-on cobrado a Bs 390/mes.

      **Por qué no lo veía ningún gate:** el retorno era **ambiguo** — «la franja del negocio» y
      «el default que nadie tocó» salían iguales—, así que el consumidor no podía distinguirlos
      y afirmaba. Misma clase que `buscarNegocio()` devolviendo `[]` por dos motivos distintos.
      No sobra ni falta una palabra, el texto ya deriva del rubro
      (`whatsapp-ai-idioma-del-rubro.test.ts` en verde), no hay pantalla que fotografiar y el
      valor es **REAL**: sale de la base. Peor: el caso *«sin grilla dice la franja sola»* de
      `horario-que-se-dice.test.ts` lo daba por **BUENO** — el defecto tenía un gate en verde
      defendiéndolo.

      **El arreglo no borra la promesa, la CONDICIONA** (igual que `SEARXNG_URL` en el alta):
      `horarioQueSeDice` devuelve `{ lineas, declarado }` y los dos consumidores dejan de
      afirmar cuando no lo sabemos — el menú ofrece la persona que ya ofrecía, y a la IA se le
      **prohíbe deducirlo**. El corte es «nadie la tocó», no «no hay grilla»: una franja distinta
      del default sí está declarada, así que el error posible queda del lado seguro. Y `horario`
      viaja como campo **requerido**: un opcional con default deja al llamador sin pasarlo con el
      gate y `tsc` en verde.

      **Gates:** `npx tsc --noEmit` exit 0 · `npx vitest run` **3978 pasan / 327 archivos** ·
      `npx eslint .` 0 errores. Guardias validados **por mutación**: 4/4 en rojo, y el del menú y
      el de la IA fallan **un caso cada uno** — cada guardia tiene el caso que ningún otro ve.
      Lleva ancla contra `register/route.ts` y `schema.prisma`: si el alta cambia la franja, la
      detección apuntaría al valor viejo y se apagaría sola. Gate:
      `lib/agenda/horario-sin-declarar.test.ts`.

      **No está terminado hasta que se publique:** viaja en el pedido de deploy vivo de
      `plataforma`, que espera el `ok` de Sergio Urcullo.

- [x] **CERRADO el 2026-09-08: una capacidad de plan se decidía en CUATRO listas escritas a
      mano, y una de ellas es la que la API usa para RECHAZAR.**

      `canUseRecurringInvoices()` —con la que aplican `/api/recurring-invoices` y las dos
      pantallas de `billing/recurring`— decidía con `plan === "professional" || "clinic" ||
      "enterprise"`, mientras `app/(dashboard)/billing/new/page.tsx` —la pantalla que **muestra**
      la opción de recurrencia— preguntaba `getLimits(plan).recurringInvoicesEnabled`. La misma
      capacidad, en la misma feature, con dos fuentes. Lo mismo con `publicBookingIncluded`,
      tipeado en tres lugares más, **incluido `/settings`, la pantalla donde el dueño decide
      cuánto paga**.

      **Hoy coincidían — por diligencia, no por construcción.** Producción corre 8 orgs en
      `professional` y 1 en `free` (`docker exec supabase-db psql …`), así que los bordes ni se
      ejercitan: nada podía ponerse rojo si se separaban. Es la clase que abre `CLAUDE.md`
      (cuatro precios vivos del mismo producto) y la misma del cupo de clientes del 2026-09-08,
      donde la mitad que muestra y la que aplica contaban de **tablas** distintas. Ningún
      instrumento del proyecto puede verla: no sobra ni falta una palabra, `tsc` está contento y
      los dos valores son reales.

      **Arreglado** en `8c12eb1`: los cuatro sitios leen `getLimits()`. El gate
      (`lib/plan-catalogo-es-la-fuente.test.ts`) deriva sus sujetos del **disco** (`app/`,
      `components/`, `lib/`), así que una comparación nueva nace cubierta; las 14 exentas se
      declaran por su **línea exacta** y se re-miden en cada corrida, de modo que una exención
      huérfana pone el gate en rojo en vez de pudrirse.

      ⚠️ **Lo que se aprendió escribiéndolo:** el quinto caso —comparar
      `canUseRecurringInvoices(plan)` contra `getLimits(plan).recurringInvoicesEnabled`— es
      **tautológico con el arreglo puesto**: los dos leen la misma fuente, así que mover el
      catálogo mueve los dos lados, y **pasaba en verde con el gate roto** (mutación M3). Se
      reemplazó por el invariante que sí puede romperse: que la mitad que muestra y la que aplica
      le pidan al catálogo el **mismo campo**. Validado por mutación en cuatro direcciones, cada
      una confirmada por su línea `Tests N failed`.

      **Prueba:** `tsc` 0 · `eslint` 0 · `vitest` 3965 passed. **Commiteado y pusheado; NO
      desplegado** — viaja en el pedido de deploy de `plataforma` que ya existe.

- [x] **CERRADO el 2026-09-08: el gate que vigila el idioma del rubro en los correos veía 6 de
      los 10 remitentes que `lib/email.ts` exporta. Los 4 de afuera estaban sanos — el hueco no
      tapaba un bug, tapaba al PRÓXIMO.**

      **La clase, y por qué es la segunda vez.** El arreglo del 2026-09-07 (`2075cf7`) entró
      porque `sendInvoiceEmailSafe` no cumplía la forma `send…Email(` con la que el detector
      agrupaba, así que la factura nunca fue sujeto. Ese arreglo corrigió **la instancia**:
      agregó `InvoiceEmail` a la lista y dejó escrito en el propio archivo *«los correos se
      nombran de a uno, no por una forma que casualmente los agrupe»* — y a dos líneas siguió
      habiendo una forma que los agrupa, sólo que más larga. Medido hoy: **10 remitentes
      exportados, 6 vigilados**.

      **Los 4 de afuera, verificados uno por uno (no deducidos):**
      · `sendWelcomeEmail` — su único llamador (`app/api/auth/register/route.ts:333`) **sí** pasa
        `trackId: verticalTrackId`. Sano. Ahora entra al detector, así que un llamador nuevo que
        lo olvide se pone rojo.
      · `sendTrialDripEmail` — no lleva `trackId`: lleva los sustantivos del rubro ya resueltos
        (`negocio`, `catalogNoun`, `activityNoun`) y son **obligatorios en el tipo**, o sea que
        `tsc` no deja llamarlo sin rubro. Sano.
      · `sendDoctorAppointmentNotification` y su `Safe` — **cero llamadores en todo el repo.**
        Nacieron en el primer commit (`ff8e104`) y **nunca estuvieron cableados**: no es una
        regresión. Al profesional se le avisa in-app + push desde `avisarCitaCreada`, y ese texto
        (`textoCitaParaElProfesional`) es neutro entre rubros.

      **Por qué el remitente muerto importa igual:** está completo, exportado y es el único de
      los tres que **ya deriva el rubro**. Es la clase que el proyecto documenta para el copy
      muerto de la web — *el día que alguien lo cablea entra YA APROBADO, porque nadie audita lo
      que «ya estaba»*. Ahora no: su excusa se **vuelve a medir**, así que cablearlo pone el gate
      en rojo y obliga a meterlo bajo el detector.

      **El gate:** `__tests__/lib/email-idioma-del-rubro.test.ts` — el sujeto ya no es una lista
      de nombres, es **lo que `lib/email.ts` exporta, leído del disco en cada corrida**. Cada
      remitente tiene que estar **vigilado** o **excusado con su motivo**, ninguna excusa puede
      **sobrar**, y **cada excusa se re-mide**. Un remitente nuevo nace sin fila y lo pone en
      rojo.

      **Validado por MUTACIÓN en 4 direcciones**, confirmando por la línea `Tests N failed`:
      detector viejo → **1 rojo** nombrando `sendWelcomeEmail`; cablear el remitente muerto (un
      archivo temporal que lo llama) → **1 rojo** nombrando el archivo; excusa sobrante → **1
      rojo**; `negocio` vuelto opcional en el tipo del drip → **1 rojo**. Restaurado: **20
      verdes**.

      Gates: `tsc` **0** · `vitest` **3962** pasados / 324 archivos · `eslint` **0**.

      ⚠️ **Es cobertura, no un arreglo que el cliente vea:** ningún correo cambió y `lib/email.ts`
      quedó sin tocar (`git diff` vacío). Lo que cambió es que el próximo remitente no puede
      nacer sin vigilancia. Por eso **no** suma nada al pedido de deploy: no hay nada que
      publicar.

      Commit `08a5505` en `claude/chatbots-platform-review-0d1d09` de `onia-platform` (entra a
      `master` cuando `onia-cola` mergee).

- [x] 🔴 **CERRADO el 2026-09-08: `/book/<slug>` le ofrecía a una ferretería y a una importadora
      que su cliente reservara una cita — y el dueño no tiene UNA sola pantalla donde verla.**

      **Medido en producción, no deducido:** `curl` a `/api/booking/doctors` devolvió **HTTP 200
      con un profesional** para `zz-qa-ferreteria-tornillo-ommbt` (`gestios-general`, plan
      `professional`, 7 horarios activos) y para `qa-modulos-rj7tv` (`proveegest-electrico`, 5
      horarios). Los dos packs tienen **cero rutas de citas** en su nav —ni `/agenda` ni
      `/appointments`—, así que la cita se creaba y el layout del panel le bloqueaba el segmento
      al dueño. **Cero citas creadas todavía**: estaba vivo pero nadie lo pisó.

      **La clase:** la condición estaba escrita CUATRO veces (`api/booking/doctors`, `slots`,
      `appointments` y el conocimiento que se le publica al bot del cliente) y las cuatro
      preguntaban lo mismo —si el PLAN la incluye—, ninguna por el RUBRO. Como `professional`
      trae `publicBookingIncluded`, alcanzaba con el plan para abrirla. Es la superficie que ve
      el **cliente DEL cliente**: no la mira ningún instrumento del proyecto —la pantalla
      renderiza perfecto, no sobra ni falta una palabra, y el dueño no entra nunca—. Misma clase
      que el menú de citas que el bot de WhatsApp le abría a esos dos rubros (cerrado el mismo
      día): **mismo `tieneAgenda`, la superficie hermana que había quedado abierta**.

      **Arreglado:** `lib/agenda/reserva-publica.ts` deja la pregunta en un solo lugar y **separa
      los dos motivos** —el del PLAN es comercial (se destraba comprando el add-on), el del RUBRO
      es estructural (no se destraba con plata)—, cableado en las cuatro capas. De paso,
      `/settings` dejó de mostrarle al dueño de un comercio la tarjeta que le vendía **«Activar
      add-on»** de algo que su pack no puede usar.

      **El gate (`lib/agenda/reserva-publica.test.ts`)** lleva el caso que mira a los
      **LLAMADORES** —el helper puede quedar impecable y las rutas seguir preguntando sólo por el
      plan, con `tsc` y el gate del módulo en verde— y un **anclaje** que se pone rojo si algún
      día ningún pack queda sin agenda. Validado **en ROJO primero** (4 casos) y **por mutación en
      dos direcciones**, confirmando por *exit code*.

      ⚠️ **Un track desconocido sigue abriendo la agenda, a propósito:** cae a
      `dentagest-clinical` en TODO el producto, así que su panel muestra `/appointments` — cortar
      sólo acá le daría panel con agenda y agenda pública en 403, la contradicción que este carril
      caza. Queda anclado con su caso; hoy hay **0 orgs sin track**.

      **Y el fixture de `doctors/route.test.ts` era una ferretería**, o sea que desde este arreglo
      medía otra cosa (403 en vez de 200): pasa a estética, que prueba lo mismo —que el track
      viaja para no hablarle dental a quien no lo es— sin apoyarse en el defecto.

      Gates: `tsc` 0 · `vitest` **3957 pasan / 0 fallos** · `eslint` 0 errores. Commit `2df57bf`
      en `claude/chatbots-platform-review-0d1d09` de `onia-platform`.
      ⚠️ **Commiteado y en la rama, NO desplegado**: viaja con el pedido de deploy de `plataforma`.

- [x] **CERRADO el 2026-09-08: el cliente confirmaba o cancelaba su cita desde el correo, se
      guardaba, y si el aviso al negocio fallaba le aparecía un error — así que se iba creyendo
      que NO había cancelado, y el negocio tampoco se enteraba.** Commit `9e579b2`, rama
      `claude/chatbots-platform-review-0d1d09` de `onia-platform`. ⚠️ **Commiteado y en la rama,
      NO desplegado**: falta el merge a `master` (es de `onia-cola`) y después el swap.
      Comentado en el pedido vivo `t_bf1607af`.

      **Qué estaba mal, y por qué ningún instrumento podía verlo.** `responderCita`
      (`app/cita/acciones.ts`) hace dos cosas en orden: guarda la decisión y después avisa al
      negocio. El aviso corría pelado, después del `update`. En ese punto la escritura ya es
      irreversible, así que cualquier tropiezo del aviso le muestra al cliente un error sobre
      algo que **sí** quedó hecho. La ruta responde 200, la pantalla se ve perfecta, no sobra
      ninguna palabra y el texto ya es neutro entre rubros: ningún barrido de literales, precios,
      obra ni vocabulario lo alcanza. Se ve preguntando **qué pasa si el aviso falla**.

      Y con él salieron dos hermanos del mismo camino:
      · `recipientId: appointment.doctorId` con `doctorId String?` en el schema y `recipientId`
        **NOT NULL** en `Notification`. Hoy no explota porque los dos creadores de cita exigen
        profesional (`z.string().min(1)` en `crear-cita.ts` y en `api/booking/appointments`) —
        es una bomba con la espoleta puesta. Ahora, sin profesional, el aviso va a los ADMIN.
      · La zona horaria estaba clavada en `"America/La_Paz"` mientras el resto del sistema la
        deriva de `clinicSettings.timezone` (`crear-cita.ts:203`). **El gate de zonas
        (`fecha-en-zona-del-negocio.test.ts`) exige que se PASE `timeZone` y es ciego a que el
        VALOR sea una constante**, así que pasaba en verde sobre el aviso que le muestra al
        profesional una hora distinta de la que su propia agenda le da para la misma cita.
        Latente hoy: las 10 orgs de producción están en `America/La_Paz` (medido con `psql`).

      **Y el gate hermano quedaba hueco por este mismo arreglo**, que es lo que más vale de la
      vuelta: `no-muta-en-get.test.ts` vigilaba `notification.create` y la acción pasó a
      `createMany` — su `not.toHaveBeenCalled()` habría seguido en **verde** aunque el GET
      volviera a escribir. Ahora mira las dos vías. Un arreglo puede apagar el guardia del
      defecto vecino sin que nada se ponga rojo.

      **Prueba:** `app/cita/aviso-no-tumba-la-respuesta.test.ts`, 6 casos, los tres guardias
      validados **por mutación** (sacar el `try/catch` → 2 rojos; volver al destinatario único →
      1 rojo; volver la zona a constante → 1 rojo; cada uno cae por su propio caso, ninguno
      tapado por otro). Gates: `npx tsc --noEmit` exit 0 · `npx vitest run` **3897 pasan / 319
      archivos** · `npx eslint .` 0 errores.

- [x] **CERRADO el 2026-09-08: el bot le decía al cliente la ENVOLVENTE de la semana como si
      fuera el horario de atención — y lo mandaba a una puerta cerrada.** Commit `6b1ce7c`,
      rama `claude/chatbots-platform-review-0d1d09` de `onia-platform`. ⚠️ **Commiteado y en
      la rama, NO desplegado**: falta el merge a `master` (es de `onia-cola`) y después el
      swap. Verificado: `git merge-base --is-ancestor 6b1ce7c origin/master` da NO, así que el
      pedido `t_bf1607af` **todavía no lo publica** — comentado ahí.

      **Qué estaba mal.** `clinicSettings.openTime/closeTime` es, **por construcción**, la
      apertura más temprana y el cierre más tardío de *todos* los tramos de la semana —
      `derivarHorarioClinica()` (`lib/onboarding/aplicar.ts:218`) lo dice en su propio
      comentario. Sirve para lo que se escribió: acotar hasta dónde la agenda puede ofrecer
      turnos. Es **falso** como respuesta a *«¿a qué hora abren?»*, y era exactamente eso lo
      que el bot del cliente (add-on de **Bs 390/mes**) contestaba, en sus **dos** superficies:
      el menú (`whatsapp-bot.ts`) y el contexto que recibe la IA (`whatsapp-ai.ts`), que lo
      repetía en texto libre.

      **Medido en producción, no deducido** (2026-09-08, org real `clinica-sergio-p2ljs`):

      | | lo que el negocio hace | lo que el bot decía |
      |---|---|---|
      | lun–vie | 09:00–13:00 **y** 15:00–19:00 | `09:00 – 19:00` |
      | sábado | 09:00–13:00 | `09:00 – 19:00` |
      | domingo | cerrado | `09:00 – 19:00` |

      O sea: dos horas por día, medio sábado y **todo el domingo** mandando pacientes a una
      puerta cerrada. **La grilla verdadera ya estaba guardada al lado**, en
      `perfilNegocio.horarios`, y `resumirHorarios()` ya sabía imprimirla.

      **Por qué ningún gate podía verlo.** No sobra ninguna palabra (nada prohibido), el texto
      ya deriva del rubro (`whatsapp-ai-idioma-del-rubro.test.ts` en verde), no hay pantalla
      que fotografiar —es WhatsApp, la superficie del cliente DEL cliente— y **el número es
      real**: sale de la base, así que ningún barrido de literales, precios ni vocabulario lo
      alcanza. La clase es **un dato correcto para su propósito, reusado para otro**.

      **Arreglo.** `lib/agenda/horario-que-se-dice.ts` (nuevo) resuelve la grilla real y cae a
      la franja sola cuando no hay grilla — sin inventar días. `PatientContext` **pierde**
      `openTime`/`closeTime` y **gana `horarioLineas` obligatorio**: un opcional con default
      habría dejado el hueco mudo (gate del módulo en verde, llamador sin pasar nada);
      haciéndolo obligatorio `tsc` nombró los 3 fixtures que lo construían. El par crudo ya no
      es alcanzable desde ese contexto.

      **Validado por mutación**, cada rojo confirmado por su línea `Tests N failed`: el módulo
      ignorando la grilla → 6 rojos; el menú imprimiendo la envolvente (forma de *esquive*) →
      1 rojo; la IA recibiéndola cruda → 1 rojo. Cada consumidor cae por **su propio** caso,
      que ningún hermano tapa. Gates: `tsc` 0 · `vitest` **3837 verdes** · `eslint` 0 errores.

- [x] **CERRADO el 2026-09-08: el bot de WhatsApp del CLIENTE le abría un menú de CITAS a
      comercio e importadora, que no tienen agenda.** Commit `e4465c9`, rama
      `claude/chatbots-platform-review-0d1d09` de `onia-platform`. ⚠️ **Commiteado y en la
      rama, NO desplegado**: falta el merge a `master` y el swap.

      **Qué estaba mal.** `menuText()` de `lib/whatsapp-bot.ts` estaba escrito para el dental
      y salía igual en los siete rubros: `1️⃣ Ver próxima cita · 2️⃣ Confirmar cita ·
      3️⃣ Cancelar cita · 4️⃣ Horarios`. `gestios-general` (comercio) y `proveegest-electrico`
      (importadora) —**2 de los 5 rubros de la v1.0**— no declaran `/appointments` ni
      `/agenda` en su nav, o sea que no agendan. Al cliente de una ferretería el bot que su
      dueño paga a **Bs 390/mes** le ofrecía tres opciones imposibles **en el primer
      mensaje**, se las **repetía después de cada respuesta libre**, y si elegía una le
      contestaba *«No tienes citas programadas próximamente»*, que da a entender que podría
      tenerlas. Y `buildSystemPrompt` (`lib/whatsapp-ai.ts`) le ordenaba a la IA, en regla
      fija: *«Para agendar, confirmar o cancelar citas, indica que use el menú (opciones 1,
      2, 3)»* — o sea el add-on prometía una capacidad que ese pack no tiene.

      **La clase: el par (rubro, CAPACIDAD), no (rubro, palabra).** El gate hermano de este
      mismo archivo —`whatsapp-ai-idioma-del-rubro.test.ts`— vigila que «clientes»/«cliente»
      deriven del rubro, **y derivaban**: el prompt de una ferretería decía *«Hablas con sus
      compradores»* y dos líneas más abajo la mandaba a un menú de citas. Ninguna palabra
      sobra ni falta, así que ningún barrido de literales, de precios, de obra ni de
      vocabulario puede verlo.

      **Cómo se arregló.** `tieneAgenda(trackId)` en `lib/platform/vertical-pack.ts`,
      **derivado del pack** (`nav` con `/appointments`), misma doctrina que sus hermanas
      `fichaClinica` / `llevaInventario`; string-tolerante vía `resolveVerticalPack` porque su
      llamador es el webhook, donde el track llega crudo de la base. `opcionesDelMenu()` es
      ahora **una sola lista**: de ahí salen el texto impreso **y** el ruteo del número
      (`switch` sobre la opción elegida, no sobre `case "1"`), así que no pueden divergir —
      que es exactamente cómo nació el defecto. Sin agenda el menú queda con horarios y el
      pase a un humano, y la regla 2 del prompt se da vuelta: *no ofrezcas ni prometas un
      turno*. Los rubros con agenda quedan idénticos.

      **Prueba.** Test primero en ROJO por el motivo correcto: **12 casos** de 33
      (`lib/whatsapp-bot-menu-por-rubro.test.ts`), sujetos derivados de `VERTICAL_PACKS` —un
      rubro nuevo nace medido—. Verde después: 33/33. **Validado por mutación, 4 de 4 en
      rojo**, incluidas las dos de ESQUIVE que un gate ingenuo no ataja: menú **vacío** sin
      agenda (mata las citas y deja al cliente mudo) → 4 rojos, y **numerar el texto distinto
      del ruteo** → 8 rojos. Gates: `npx vitest run` 3.828 en verde, `tsc --noEmit` y
      `eslint` en 0.

- [x] **CERRADO el 2026-09-08: el cupo del chatbot avisaba que IBA a cortar, no que YA
      cortó.** Commit `ccab1db`, rama `claude/chatbots-platform-review-0d1d09` de
      `onia-platform`. ⚠️ **Commiteado y en la rama, NO desplegado**, y además **la migración
      NO está aplicada en producción**: falta el merge a `master`, el `ALTER TABLE` a mano
      (`prisma/migrations/20260908000000_chatbot_cupo_aviso_del_corte/migration.sql`) y el
      swap. Sin la columna el aviso del corte no sale y todo lo demás sigue igual —
      `registrarMensajeEntrante` cuelga del relay de Chatwoot y jamás tira.

      **Qué estaba mal.** El add-on (Bs 390/mes) corta a las 500 conversaciones del mes:
      desde ese instante el asistente deriva cada conversación nueva a una persona del equipo
      del dueño. Había aviso al 80 % (`avisado80At`), que es una **predicción** — «al
      agotarse, deriva…» — y **ninguno en el corte**, que es el hecho. O sea: el dueño paga
      por un asistente que deja de contestar y se entera abriendo `/settings/chatbot`, o por
      un cliente perdido. Del 80 % al 100 % puede pasar una tarde. Y hay una recarga que se
      cobra, así que el silencio también se come el upsell.

      De paso, el `return` que cortaba la función cuando no tocaba avisar el 80 % hacía que
      una conversación que cruzaba los **dos** umbrales de una sola vez (un mes que arranca
      con el cupo gastado, o un límite que baja al cambiar de plan) disparara sólo el primero.

      **La clase: el producto aplica un límite y avisa ANTES, no CUANDO lo aplica.** Ningún
      gate podía verla — no sobra ninguna palabra, el texto ya es neutro entre rubros, la
      pantalla renderiza bien y el aviso del 80 % tenía su test en verde. El 06-sep se cerró
      la mitad de venta de este mismo tema (`limite-que-corta.test.ts`: la web no nombraba el
      cupo, el dueño se enteraba pagando); ésta es su hermana adentro del producto, y no la
      cazó nadie porque cerrar una mitad de una familia hace dar la otra por cubierta.

      **Prueba.** Test primero en ROJO por el motivo correcto (2 casos), verde después:
      `npx vitest run lib/chatbot/cupo.test.ts` → 30/30. Suite completa 3.754 en verde,
      `tsc --noEmit` y `eslint` en 0.

      **Y un instrumento roto que apareció escribiéndolo:** el test usaba `clearAllMocks`, que
      **no** vacía la cola de `mockResolvedValueOnce`. Un caso que encola dos respuestas y
      consume una le deja la sobrante al siguiente, y el siguiente mide otra cosa que la que
      dice medir — mi caso nuevo salió rojo por eso y no por el defecto. Va `resetAllMocks`.

- [x] **CERRADO el 2026-09-08: el bot que el cliente PAGA se presentaba como «una clínica
      dental» ante los clientes de los otros cuatro rubros.** Commits `8009a9e` (arreglo) y
      `a13d3af` (gate), rama `claude/chatbots-platform-review-0d1d09` de `onia-platform`.
      ⚠️ **Commiteado y en la rama, NO desplegado**: falta el merge a `master` y después el
      swap — viaja con el pedido de deploy `t_bf1607af`.

      **Qué estaba mal.** El add-on de WhatsApp (Bs 390/mes, `pricing.ts`) atiende a los
      clientes DE la org. Su system prompt decía, literal:
      `Eres el asistente virtual de ${clinicName}, una clínica dental.` — más «términos
      dentales», «urgencias dentales o dolor severo», «INFORMACIÓN DE LA CLÍNICA»,
      «INSTRUCCIONES ESPECIALES DE LA CLÍNICA» y «El paciente se llama X». En el menú del bot,
      además: «llamando a **la clínica**», el fallback «tu **doctor**» y `patientName ??
      "Paciente"`. Un comercio, una importadora, un estudio contable o un centro de estética
      que contrataba el add-on tenía un bot que se presentaba ante SUS clientes como una
      clínica dental: **4 de los 5 rubros de la v1.0**, en la superficie por la que paga.

      **La clase, y por qué sobrevivió: es la superficie más invisible del producto.** No sale
      en captura, no está en el HTML de ninguna url, no la ve un `curl`, no es un correo
      nuestro —el eje «texto que SALE del sistema» se barrió el 06 y 07-sep y llegó hasta el
      correo, la factura, el recibo, la receta, el CSV y los errores de API—, y **no la ve ni
      el dueño**: la ven sus clientes, por WhatsApp, en un texto que además lo GENERA un LLM a
      partir de este prompt. Ningún gate del proyecto podía expresar la pregunta.

      **El arreglo deriva, no borra**: `buildSystemPrompt` toma `vocabularioDeTrack(
      organization.verticalTrackId)` y el webhook se lo pasa. Sin ese segundo paso el default
      dental seguía mandando en producción y el arreglo valía cero.

      **El gate cruza (rubro × prompt), no el texto** — «paciente» es correcto en dental y en
      veterinaria y sólo está mal en los otros—, con ancla anti-esquive: dental tiene que
      SEGUIR diciendo «pacientes», así que borrar la palabra no lo satisface.

      ⚠️ **Y el gate nació con un hueco que sólo apareció mutando: no veía el CABLEADO.**
      `trackId` es opcional (para no romper a quien ya llamaba) y su default es dental, así
      que sacar `trackId,` del webhook dejaba el bug intacto con **los 30 casos en verde y
      `tsc` en 0**. Cubierto en `a13d3af`, derivando los llamadores de
      `git grep generateBotReply(` —un llamador nuevo nace cubierto— y con el caso que se pone
      rojo si la lista queda vacía, en vez de aprobar por lista vacía.

      **Prueba.** Rojo antes por el motivo correcto (30/30). Cuatro mutaciones, todas en rojo:
      revertir el prompt (24), el llamador sin `trackId` (1, nombrando el archivo), esquivar
      borrando la palabra (9), detector sin sujetos (1). Gates: `tsc` 0 · `vitest` **3676**
      verdes · `eslint` 0 errores. Ver `lib/whatsapp-ai-idioma-del-rubro.test.ts`.

- [x] **CERRADO el 2026-09-08: nadie vigilaba el simétrico de «camino ausente» — el enlace
      que lleva a una pantalla que ese rubro tiene BLOQUEADA.** Commit `c3a2fda` (rama
      `claude/chatbots-platform-review-0d1d09` de `onia-platform`), **NO desplegado** — es un
      gate, no cambia lo que el cliente ve.

      **La clase.** `caminos-transversales.test.ts` cubre una dirección: *permiso concedido,
      camino ausente* — el tenant puede entrar y ningún menú la ofrece (`/requerimientos`,
      `/empresa`, `/rrhh`, `/patients/[id]/prescriptions`: cuatro veces). La **simétrica** no
      la vigilaba nadie: el panel PINTA un botón hacia un segmento que `route-access` le
      bloquea a ese pack, el dueño hace clic y el layout lo devuelve a `/dashboard`.

      Es la más silenciosa de las dos. No sobra ni falta una palabra —ningún barrido de copy
      la ve—, la pantalla se ve perfecta, el enlace existe, y el redirect es **mudo**: sin
      error, sin request fallida, sin cartel. Sólo aparece abriendo la pantalla con la sesión
      del rubro equivocado, que es justo lo que un instrumento no hace solo.

      **Lo medido, y por qué el hallazgo fue un gate y no un arreglo.** Barrido de los hrefs
      de `app/(dashboard)` cruzados contra `allowedSegmentsForPack` de los siete packs: **UN**
      enlace de esa clase, y **ya estaba guardado** — la ficha del cliente ofrece «Facturar» y
      servicios profesionales no tiene `/billing` (su caja es `/comercio/caja`); lo tapa
      `veFacturacion`, derivado de `pack.nav`. El guard existía; lo que no existía era algo
      que impidiera que el próximo enlace **nazca sin él**.

      **Tres hipótesis descartadas midiendo, antes de escribir una línea** — las tres se leían
      como defecto vivo y ninguna lo era:
      1. *Las tres acciones del panel están tipeadas a mano* (`/patients/new`, `/appointments`,
         `/billing/new`, `dashboard/page.tsx:584`) **y las tres están bloqueadas para comercio
         e importadora.** Falso: `page.tsx` hace **return temprano** por rubro (línea 118-124)
         y esos packs ven `ComercioHoy` / `ImportadoraHoy`, cuyos enlaces sí derivan. Cruzados
         los tres paneles contra los packs que de verdad los reciben: cero bloqueados.
      2. *La tarjeta «Por pagar a proveedores» muestra `Bs 0` cuando la lectura falló*
         (`comercio/fiados/page.tsx`: el `catch` deja `[]` y el aviso vive 100 líneas más
         abajo; igual en `empresa/gastos` y `rrhh`). Es el patrón del retorno ambiguo, pero
         **latente**: las tres tablas existen en producción
         (`onia_commerce_purchases`, `onia_empresa_expenses`, `onia_payroll_employee_profiles`),
         así que el `catch` no dispara hoy.
      3. *Nombre del archivo descargado y `<title>` del panel por rubro.* Los nombres son
         neutros (`onia-facturas`, `gastos`, `planilla`) y dentro del ZIP ya derivan
         (`${nombreClientes}.csv`); sólo dos pantallas exportan `metadata.title`.

      **El gate.** `lib/platform/enlaces-del-panel-alcanzables.test.ts`: sujetos del **disco**,
      permisos de `allowedSegmentsForPack` —la MISMA función que usa el layout para bloquear,
      no una lista de tracks al lado—, exento `dashboard/` **con su motivo** (rama por rubro),
      y una tabla `COBERTURA` que no puede faltar ni sobrar. Tres anclas contra quedarse mudo.
      Validado por **mutación en cuatro direcciones**, todas rojas y restauradas en verde:
      enlace nuevo sin guard, fila de `COBERTURA` borrada, enlace real removido (la fila sobra)
      y detector siempre-vacío.

      **Su límite, dicho de frente:** es un gate de **cobertura**, no de comportamiento —
      obliga a declarar el enlace, no comprueba que el guard funcione. Romper `veFacturacion`
      sin tocar el `href` lo deja en verde.

      Gates: `tsc` 0 · `eslint` 0 errores · `vitest` 3640/304.

- [x] 🔴 **CERRADO el 2026-09-08: a un centro de estética el catálogo le ofrecía archivar
      «Limpieza facial profunda» bajo Endodoncia.** Commit `74879aa` (rama
      `claude/chatbots-platform-review-0d1d09`), **NO desplegado** — viaja con el pedido de
      deploy de `plataforma`.

      **El defecto.** `/treatments` la tienen en su menú los TRES packs clínicos (dental,
      estética, veterinaria: `sidebarNavItems` por referencia + `navClinicaDe()`). El
      formulario de alta del catálogo pedía el nombre con el ejemplo **«Ej: Extracción dental
      simple»** y su desplegable de Categoría eran las diez especialidades ODONTOLÓGICAS
      —Preventivo, Restaurativo, Endodoncia, Periodoncia, Cirugía, Ortodoncia, Estética,
      Prótesis, Implantología, Otro—, que además son los encabezados con los que agrupa la
      lista. Estética es un rubro de la v1.0.

      **Por qué sobrevivió, que es lo único que vale recordar.** El encabezado de esta pantalla
      YA derivaba del rubro (se arregló el 2026-09-06 en `page.tsx`) y
      `pantallas-compartidas-cubiertas.test.ts` la daba por **cubierta**, apuntando a
      `copy-de-pantallas-compartidas.test.ts`. Pero ese gate lee `page.tsx`, y la pantalla la
      pinta `TreatmentsClient.tsx`, un client component aparte que **ningún caso abría**: el
      sujeto (los rubros) estaba bien derivado y lo que faltaba era **superficie**. Ningún
      barrido de palabras prohibidas puede verlo — cada término es correcto en el rubro que lo
      escribió; lo que está mal es el par (rubro, texto).

      Es la misma familia que `ejemploServicio` y `ejemploRegistro`, un escalón más afuera: se
      creó el campo por rubro, se migraron dos pantallas (`NewInvoiceClient`,
      `paso-servicios`) y la tercera —la que se llama justamente como el concepto— quedó atrás.

      **El arreglo.** `categoriasServicio` y `servicio` (singular) en
      `lib/onboarding/vocabulario.ts` para los OCHO tracks; `TreatmentsClient` deriva ejemplo,
      categorías y sustantivo con el mismo `useAccountContext()` que ya usa su pantalla
      hermana de facturación. El singular va como campo aparte y no se saca quitándole la «s»
      al plural, que rompe en `planes` → `plane`.

      **Prueba.** Los 9 casos nuevos de `copy-de-pantallas-compartidas.test.ts` estaban en
      ROJO antes del arreglo. Validado por MUTACIÓN en tres direcciones, y el árbol restaurado
      vuelve a verde: devolver el placeholder dental → 1 rojo; devolver la lista tipeada en la
      pantalla → 5 rojos; hacer que estética herede las categorías dentales → 3 rojos.
      Gates: `tsc` 0 · `vitest` 3600/3606 · `eslint` 0 errores.

      **Lo que NO alcanza este arreglo, dicho para que nadie lo dé por barrido:** sólo se miró
      `/treatments`. Las demás pantallas compartidas cuyo copy vive en un client component
      hermano siguen sin auditar por ese eje.

- [x] 🔴 **CERRADO el 2026-09-07: el dueño ponía la fecha límite del 9 y su cliente leía el 8.**
      Commit `9ad61aa` (rama `claude/chatbots-platform-review-0d1d09`), **NO desplegado** —
      viaja con el pedido de deploy de `plataforma`.

      **El defecto.** Un `<input type="date">` devuelve `"2026-09-09"`: un día del calendario,
      sin hora y sin zona. `new Date("2026-09-09")` lo vuelve **medianoche UTC**, que en La Paz
      (UTC-4) son las 20:00 del día ANTERIOR. Medido corriendo la cadena real:
      `new Date("2026-09-09").toISOString()` → `2026-09-09T00:00:00.000Z` →
      `toLocaleDateString("es-BO")` en La Paz → **`8/9/2026`**. Dos superficies lo mostraban:
      el panel de requerimientos y —peor— el **portal público**, que es donde lo lee el cliente
      del cliente, sin cuenta. Y no era sólo texto: en `recurring-invoices` de `startDate` sale
      `computeNextRunAt`, o sea el día real en que se EMITE la factura.

      **Por qué sobrevivió, que es lo único que vale recordar.** La clase ya se había arreglado
      **dos veces** —`invoices.dueDate` y `payments.paidAt`— y el comentario de
      `app/api/invoices/route.ts` la deja escrita con nombre y apellido: *«se guarda al mediodía
      del negocio, no a medianoche UTC (que en La Paz se lee como el día anterior)»*. Las dos
      veces se arregló la **instancia**. Sin gate, la pantalla siguiente nace rota — y nacieron
      dos. Ningún gate podía verlo: no sobra ninguna palabra, el texto ya está en el idioma del
      rubro, la captura se ve perfecta y la fecha es un dato REAL. El gate hermano
      (`lib/platform/fecha-en-zona-del-negocio.test.ts`) exige `timeZone` al **formatear** — y
      `formatDate` la pasa — así que **certificaba este defecto como correcto**: lo que estaba
      mal no era el formateo sino el instante guardado.

      **Qué entra.** El instante lo arma el servidor con `fechaSoloAInstante(campo, timezone)`
      (mediodía del negocio), que es el único que sabe la zona; el panel manda el día tal cual
      y ya no convierte en el navegador. Panel y portal muestran con `formatDate`, que fija la
      zona del negocio. Y `lib/fechas-de-calendario.test.ts`, gate de cobertura con el sujeto
      derivado del **disco**.

      ⚠️ **El gate se escribió mal la primera vez y lo delató él mismo.** Con
      `new Date(<campo>)` de sujeto —o sea, con la FORMA DEL DEFECTO— arreglar un campo lo borra
      del disco y su declaración queda huérfana: el gate dejaba de cuidarlo justo después de
      arreglarlo y no podía ver la vuelta atrás. Es la trampa de «medir la precondición del bug»
      que ya está anotada, encontrada en vivo. Corregido: el sujeto es **todo campo del pedido
      convertido a `Date`, por cualquiera de las dos vías**, así un campo arreglado sigue
      vigilado. De paso quedaron cubiertas las tres instancias viejas (`invoices.dueDate`,
      `patients.dob` ×2), que hasta hoy podían revertirse sin que nada se pusiera rojo.

      **Validado por mutación**, no por que pase: revertir el arreglo, agregar una fecha nueva
      sin declarar y dejar una declaración huérfana ponen rojo, cada una nombrando su sujeto.
      Gates en `/root/loops/onia-platform-chatbot`: `tsc` 0, `vitest` 0 (3.588 pasados),
      `eslint` 0 errores.

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

- [x] 🔴 **CERRADO el 2026-09-07: al profesional le avisábamos la cita con una hora 4 h
      adelantada — y a la noche, con el día cambiado.**

      **El defecto:** `avisarCitaCreada` (`lib/agenda/crear-cita.ts`) manda **dos avisos de la
      misma cita**. El correo al cliente pasaba `timezone: org.clinicSettings.timezone`; la
      **notificación in-app y el push al profesional**, cuarenta líneas más arriba **en la misma
      función**, formateaban con `toLocaleDateString`/`toLocaleTimeString` **sin `timeZone`**.

      **Medido dentro del contenedor, no supuesto** (`docker exec onia-platform node -e …`):
      `process.env.TZ` es `undefined` y `Intl.DateTimeFormat().resolvedOptions().timeZone`
      devuelve **`UTC`**. Con eso, una cita de las **14:00** le llegaba al profesional como
      **«06:00 p. m.»**, y una de las **20:30 del martes** como **«miércoles 12:30 a. m.»** —
      mientras el cliente, por correo, leía la hora correcta. Los dos avisos de la misma cita
      se contradecían entre sí, y el que se equivoca es el que tiene que estar ahí.

      **Por qué sobrevivió a todos los gates:** no sobra ninguna palabra, el texto ya estaba en
      el idioma del rubro (arreglado el 06-sep), la pantalla se ve perfecta y **el correo —que
      es lo que se auditó— estaba bien**. El defecto sólo aparece **comparando los dos avisos
      entre sí**. Es la misma clase «arreglar la instancia y no la clase»: `lib/whatsapp-bot.ts`
      ya pasaba `timeZone: settings.timezone` en sus dos formateos.

      **El arreglo:** `eec06d7` en `claude/chatbots-platform-review-0d1d09`. La construcción del
      texto salió a `textoCitaParaElProfesional()`, que **exige la zona**, y `avisarCitaCreada`
      carga la org **antes** de armar el aviso. El default quedó declarado **una sola vez**
      (`TZ_POR_DEFECTO`) y el correo lo lee de ahí: dos defaults escritos por separado se
      desincronizan sin que nada se ponga rojo.

      **El gate:** `lib/agenda/aviso-en-hora-del-negocio.test.ts` — cubre la instancia (incluido
      el caso que **cambia de día**, que es el peor) y además la **clase**: ningún
      `toLocale*String` del módulo sin `timeZone`, filtrando comentarios **por estado** y no por
      prefijo. **Validado por mutación en las dos direcciones:** romper el arreglo pone **5**
      casos en rojo, y una llamada nueva sin zona **en otra parte del archivo** la ve **sólo** el
      guard de clase (1 rojo) — o sea que ese guardia no es redundante. Gates: `tsc` 0,
      `eslint` 0, `vitest` **3566** pasados / 299 archivos.

      ⚠️ **NO llega al cliente todavía:** `eec06d7` **no es ancestro de `origin/master`**
      (comprobado con `git merge-base --is-ancestor`), así que **no viaja en el swap que hoy
      espera el `ok`** — el dry-run del publicador cuenta 4 arreglos sobre `HEAD 7c4ff18` y
      éste no es uno. Entra cuando `onia-cola` mergee la rama. Anotado en `t_deddf471`, sin
      abrir un pedido nuevo.

- [x] 🔴 **CERRADO el 2026-09-08: agotado el cupo mensual de correos, la confirmación de la
      cita no salía y NADIE se enteraba — ni el cliente, ni el negocio.**

      **El defecto:** `avisarCitaCreada` (`lib/agenda/crear-cita.ts`) pedía permiso con
      `checkEmailLimit` y envolvía el envío en `if (emailCheck.allowed) { … }` **sin `else`**.
      Agotado el cupo (Básico: **200/mes**), la confirmación no salía, `confirmationSentAt`
      quedaba en `null`, **no se reintentaba nunca** y no quedaba ni una línea en ningún lado:
      el negocio veía «Nueva cita: Fulano» igual que siempre y daba por hecho que su cliente
      estaba avisado. El cliente no recibía nada y el dueño se enteraba **cuando no se
      presentaba**.

      **Por qué sobrevivió a todos los gates:** no sobra ninguna palabra, no falta ningún rubro,
      la pantalla renderiza perfecto y **la cita SÍ se crea**. El defecto sólo aparece
      preguntando qué pasa en la rama que nadie mira. Y lo mantuvo vivo que **la mitad hermana ya
      estaba resuelta**: el cron de recordatorios (`app/api/cron/appointment-reminders`) avisa a
      los admins al cruzar el **80 %** y el **100 %** del MISMO cupo, y su encabezado lo dice con
      todas las letras — *«un negocio no puede quedarse sin cupo sin enterarse»*. **Ver la mitad
      sana hace dar la familia por cubierta.** Es la misma clase que se cerró esta madrugada para
      el cupo del chatbot (`lib/chatbot/cupo.ts`), una instancia más abajo.

      **Alcance real, medido y no supuesto** (`docker exec supabase-db psql`, 2026-09-08): las
      **9** orgs de producción llevan **0** recordatorios este mes y 8 están en `professional`
      (800/mes), así que **hoy no le pega a nadie**. Es un defecto **latente**: se dispara con el
      primer cliente Básico con volumen — o sea, con el primer cliente que pague. `onia-interna`
      está en `free` (`emailsPerMonth: 0`), y ahí el arreglo **no** avisa, a propósito.

      **El arreglo:** `ea045d8` en `claude/chatbots-platform-review-0d1d09`. El corte ahora deja
      **aviso in-app a los ADMINS** —los que pueden cambiar el plan, el mismo destinatario que
      elige el cron— **nombrando al cliente** que quedó sin confirmación y diciendo qué hacer
      («avisale por otro medio»). Un plan sin correo **no** genera aviso: no hay cupo que
      agotarse y sería un aviso por cita, para siempre — la misma línea que traza el cron con su
      `if (emailsPerMonth <= 0) return`. Dos reglas escritas por separado para el mismo cupo se
      desincronizan sin que nada se ponga rojo.

      **El gate:** `lib/agenda/cupo-de-correo-avisa.test.ts` — la instancia (5 casos sobre la
      función pura, incluidos los dos bordes que NO deben avisar) y la **clase**: todo pedidor de
      cupo en `lib/` —los envíos **automáticos**, donde no hay a quién devolverle la negativa por
      HTTP— tiene que convertirla en aviso. Los sujetos se **derivan del disco**, así que un
      archivo nuevo nace cubierto. **Validado por mutación:** corte mudo, esquive, borde del plan
      sin cupo y aviso sin nombre → los **cuatro en rojo**.

      ⚠️ **La PRIMERA versión de ese guard estaba HUECA y pasaba en verde con el corte mudo
      puesto** — y sólo se vio mutando. Buscaba los símbolos en el **archivo entero**, así que
      `avisoDeCupoDeCorreo(` matcheaba **su propia definición** y `notification.create`
      matcheaba el aviso de «Nueva cita», que no tiene nada que ver. El sujeto es la **vecindad
      de la llamada**, nunca el archivo. Gates: `tsc` 0 · `eslint` 0 errores · `vitest` **3760**
      pasados / 308 archivos.

      ⚠️ **NO llega al cliente todavía:** `ea045d8` **no es ancestro de `origin/master`**
      (comprobado con `git merge-base --is-ancestor`, no supuesto), así que ningún swap de hoy lo
      incluye. Entra cuando `onia-cola` mergee la rama, y recién ahí se publica.

      ⚠️ **Y el pedido de deploy de `plataforma` NO está vivo: `t_deddf471` figura `done`**
      (completada el 2026-09-08 03:40). Medido con el publicador en seco —que es el número
      honesto, porque lo deriva al ejecutarse— quedan **7 arreglos mergeados que el cliente no
      ve** (`HEAD f4d007e`, staged `NINGUNO`). No se abre pedido acá: `onia-cola` mide eso en
      cada vuelta y es quien lo crea; un segundo aviso del mismo hecho es el ruido que hace que
      Sergio Urcullo deje de creerle a los avisos.

- [x] 🔴 **CERRADO el 2026-09-08: el panel le avisaba «Cerca del límite — considera subir de
      plan» a una ferretería, sobre una pared que el producto nunca levantaba.**

      **El defecto, y va en las DOS direcciones a la vez.** El tope de clientes del plan tenía
      **dos fuentes de conteo**: la que la pantalla MUESTRA y la que el producto APLICA.

      · **Comercio e importadora** (2 de los 5 rubros de la v1.0): el medidor de `/settings`
        contaba bien —`onia_core_business_partners`— y `checkPatientLimit` contaba `patient`,
        tabla **vacía ahí por construcción**. La cuenta daba **0**, el tope **nunca cortaba**, y
        encima `POST /api/comercio/clientes` no verificaba **ningún** cupo. O sea: la barra se
        ponía roja al 80 %, aparecía *«Cerca del límite — considera subir de plan»*, y el tope
        que `onia.com.bo/precios` vende (**300 clientes en Básico**) no se aplicaba nunca.
        Empujar un upgrade por una pared inexistente es la dirección cara.

      · **Servicios profesionales**: al revés. `contarClientesDelRubro` elegía la tabla con
        `usaPanelComercio`, y ese rubro **usa el panel de comercio Y guarda a su gente en
        `patients`** — así que el medidor le marcaba **«0 / 1.500» para siempre**, que es
        exactamente el bug que ese arreglo vino a matar, reintroducido por el predicado.

      **La causa de fondo:** el predicado contestaba *«¿qué panel usa?»* cuando la pregunta es
      *«¿dónde guarda a su gente?»*. Son distintas y `gestios-servicios-profesionales` las
      contesta distinto. `plan-catalogo.ts` ya había cerrado este mal para la **tabla** de topes
      —*«Dos tablas del mismo número: una que se APLICA y otra que se MUESTRA, libres de
      separarse»*— y quedó vivo un escalón más abajo, en el **conteo**.

      **Por qué sobrevivió a todos los gates:** no sobra ni falta una palabra, la pantalla
      renderiza perfecto y **los dos números son REALES, salen de la base**. Ningún barrido de
      literales, precios, obra ni vocabulario puede verlo. Lo único que lo delata es preguntar
      si el medidor y el corte cuentan la **misma tabla**.

      **Alcance real, medido y no supuesto** (`docker exec supabase-db psql`, 2026-09-08): las
      **9** orgs de producción tienen como máximo **3** clientes, así que aplicar el tope **no
      bloquea a nadie hoy**. Es un defecto **latente**: se dispara con el primer cliente con
      volumen.

      **El arreglo:** `12a4a09` en `claude/chatbots-platform-review-0d1d09`.
      `guardaClientesEnPatients(trackId)` se **deriva del pack** (mira si su menú ofrece
      `/patients`), igual que sus hermanas `usaPanelComercio` / `fichaClinica`; las dos mitades
      cuentan ahora con la **misma función**. De paso el 403 sale en el **idioma del rubro**: ese
      mensaje lo lee ahora también una ferretería, y «pacientes activos» ahí no significa nada.

      **El gate:** `__tests__/lib/cupo-de-clientes-por-rubro.test.ts` — la **clase**, no la
      instancia. Para **cada** track de `VERTICAL_PACKS` exige que el medidor y el 403 cuenten la
      misma tabla, y que esa tabla sea donde el rubro guarda a sus clientes; más la **cobertura**
      de que el alta de cada rubro pasa por el tope, con los sujetos derivados del pack —un rubro
      nuevo **nace cubierto**, y el que no ofrece pantalla de clientes lo re-mide en cada corrida
      en vez de declararlo en prosa. **Validado por MUTACIÓN**, confirmando por el *exit* y por la
      línea `Tests N failed` (no por ausencia de `FAIL`): revertir el conteo del 403 → **5 en
      rojo**; revertir el predicado del medidor → **5 en rojo**; sacar el chequeo del alta de
      comercio → **2 en rojo**; restaurado, **26 verdes**.

      Gates: `tsc` **0** · `eslint` **0 errores** · `vitest` **3873** pasados / 314 archivos.

      ⚠️ **NO llega al cliente todavía:** `12a4a09` está en la rama del carril, **no** en
      `origin/master` (comprobado con `git merge-base --is-ancestor`, no supuesto). Entra cuando
      `onia-cola` mergee, y recién ahí se publica.

- [x] 🔴 **CERRADO el 2026-09-08: la PRIMERA pantalla de servicios profesionales le hablaba en
      idioma de tienda de barrio.** `/dashboard` no es una pantalla: `dashboard/page.tsx`
      devuelve **cuatro cuerpos** según el pack, y `comercio-hoy.tsx` lo comparten **comercio,
      servicios profesionales y ganadería**. A los tres les decía «**Fiado** · en la calle»,
      «Nadie te debe — los **fiados** se registran desde **la caja**», «**Producto(s)** sin
      stock» y la tarjeta «**Stock crítico**». Un estudio contable no fía en el mostrador ni
      tiene stock, y su propio menú llama a esa pantalla «**Por cobrar**». Son **2 de los 5
      rubros** de la v1.0, en lo primero que ven al entrar.

      **Lo que lo hacía invisible:** los dos helpers que lo resuelven —`idiomaDeCredito` e
      `idiomaDeVenta`— ya existían, **probados**, a dos carpetas: se escribieron el 06-sep para
      `/comercio/fiados` y `/comercio/caja` y **no viajaron** al panel que muestra el MISMO dato
      primero. Y el gate de la familia, `lib/platform/pantalla-compartida-habla-su-idioma.test.ts`,
      deriva sus sujetos del **desacuerdo de rótulo** (toda ruta que dos packs llamen distinto en
      su menú) — y los siete packs llaman **igual** a `/dashboard`. Es la misma premisa que ya
      falló tres veces en `pantallas-compartidas-cubiertas.test.ts` (`/appointments`,
      `/comercio/caja`, `/inventory`): **el desacuerdo no está en el nombre de la ruta, está
      adentro**.

      **El arreglo:** el track viaja desde la página (que ya lo tenía en `account`) y los
      sustantivos salen de los helpers. La tarjeta de stock y su celda cuelgan de
      `venta.llevaStock`: a quien vende servicios no se le puede agotar uno, y mostrarle
      «0 producto(s)» es un dato que para él no existe. Medido con las funciones del producto:
      servicios profesionales → `rotulo: "Por cobrar"`, `que: "crédito"`, `llevaStock: false`.

      **El gate:** `app/(dashboard)/dashboard/panel-habla-su-idioma.test.ts` — la **clase**.
      Agrupa los packs con las **mismas** funciones que la página usa para elegir la rama
      (`usaPanelInterno` / `usaPanelImportadora` / `usaPanelComercio`), así que **un panel nuevo
      nace cubierto**, y exige **dos** cosas: que todo cuerpo compartido **lea el pack**, y que
      no **tipee** el sustantivo de un solo rubro en su copy visible — el segundo existe porque
      el primero se satisface importando el helper **sin usarlo**. Extrae sólo el texto entre
      etiquetas JSX (los identificadores `fiado`/`fiadoVendidoHoy` no son copy: el propio
      `dashboard/page.tsx` ya tiene un comentario avisando que eso confundió a otro trinquete) y
      descarta comentarios en las dos direcciones. **Validado por MUTACIÓN en 5 direcciones**,
      confirmando por la línea `Tests N failed`: rótulo fijo → **1 rojo**; **esquive** (importa el
      helper y deja el texto de mostrador) → **1 rojo**; celda de stock fija → **1 rojo**; sin el
      import → **1 rojo**; agrupador que reparte un panel por pack (ancla) → **rojo**;
      restaurado, **5 verdes**.

      Gates: `tsc` **0** · `vitest` **3913** pasados / 320 archivos · `eslint` **0**.

      ⚠️ **NO llega al cliente todavía:** `7fb1143` está en la rama del carril, **no** en
      `origin/master`. Entra cuando `onia-cola` mergee, y se publica con el pedido de deploy vivo
      `t_bf1607af` (ya comentado con este sha) cuando Sergio Urcullo conteste `ok`.

- [x] 🔴 **CERRADO el 2026-09-10 (`a6dee65`, ya en `master` — verificado el 2026-09-10): al
      agendar una cita, la respuesta que llegaba tarde le borraba al usuario la hora que
      acababa de elegir, y «Agendar Cita» quedaba deshabilitado sin decir por qué.**
      Tarea `t_645d123a`. Lo midió `recorrido-cliente` en vivo el 2026-09-10 15:13 La Paz
      (rubro Estética, cuenta `zz-qa-2026-09-10-1510`); capturas en
      `hermes-content/docs/recorrido/capturas/paso-07-cita.png`. Su diagnóstico era correcto y
      había **dos defectos más** en el mismo `useEffect`:

      1. **La carrera.** El efecto depende de `[doctorId, date, durationMin]` y al resolver hacía
         `setFormData(f => ({...f, timeSlot: ''}))` sin preguntar si su respuesta seguía siendo
         la vigente. Dos `fetch` solapados y gana el más **lento**.
      2. **La lista quedaba desincronizada del formulario** — no estaba en el reporte y es peor
         que perder la selección: la corrida obsoleta también escribía sus `slots`, calculados
         con el `durationMin` **viejo**. La pantalla podía ofrecer una hora que no entra en el
         servicio elegido, y esa cita se agenda **pisando a la de al lado**.
      3. **El camino de fallo mentía, y afirmaba una causa.** `try`/`finally` sin `catch` y el
         resultado detrás de un `if (res.ok)` sin `else`: con un 429, un 403 o la red cortada,
         `availableSlots` quedaba en `[]` y la pantalla afirmaba *«El profesional no trabaja este
         día o no hay horarios configurados»* — un hecho **falso** sobre la agenda del dueño, que
         encima lo manda a configurar lo que ya tiene. El 429 no es teórico: `availabilityLimiter`
         da 120/min **por IP** y su propio comentario dice que lo usa *«una recepción que salta
         entre fechas con el teléfono en la mano, muchas veces detrás de un NAT (una sola IP para
         toda la clínica)»* (`lib/rate-limit.ts:92`).

      **Por qué sobrevivió, que es lo reusable:** el gate hermano de este panel
      (`app/(dashboard)/camino-de-fallo.test.ts`, 08-sep) persigue **escrituras** que no miran la
      respuesta; su familia **simétrica —las lecturas—** quedaba abierta. Y ahí el daño es peor:
      una escritura que falla en silencio no hace nada, pero **una lectura que falla en silencio
      devuelve `[]`, y `[]` ya tiene un texto escrito para el caso vacío que afirma una causa.**
      Mismo retorno ambiguo que `buscarNegocio()` y `horario-que-se-dice`. Además, la superficie
      **pública** (`app/(public)/book`) ya tenía las dos cosas —guard `cancelled` y
      `slotsRateLimit`— desde que se cerró su camino de fallo el 08-sep: **el hermano sano a dos
      carpetas es lo que hacía leer la familia como cubierta.**

      **Arreglo en el HELPER** (`lib/agenda/carga-de-horarios.ts`), no en la pantalla, para que la
      próxima superficie que pregunte por disponibilidad nazca cubierta: `esRespuestaVigente()`
      corta la corrida obsoleta antes de que escriba nada, y `leerDisponibilidad()` devuelve
      `listos` | `no_se_pudo` en vez de `[]` para los dos casos. El reset de `timeSlot` al
      resolver se fue: los tres disparadores ya lo limpian en su propio handler al **disparar**.

      **Validado por mutación, 6 en rojo con `exit 1`, cada una verificada de que entró:** sin
      guard · reset restituido · texto tipeado a mano · el helper leyendo un 429 como vacío · y
      **las dos de esquive**. ⚠️ La primera versión del guard medía la **presencia** del símbolo,
      y el esquive —llamarlo y tirar el resultado— pasaba en **VERDE** con el defecto entero de
      vuelta; ahora se exige que el resultado **gobierne un `return`**. Sólo se ve mutando
      **después** de arreglar.

      Gates: `tsc` **0** · `vitest` **4249** pasados / 340 archivos · `eslint` **0** errores,
      corridos **en el VPS sobre el árbol que se publicó** (`23a3d069`, idéntico byte a byte al
      medido en casa) — entregar con `format-patch` entre máquinas publica otro árbol si el
      gemelo está atrasado.

      ⚠️ **NO llega al cliente todavía:** `a6dee65` está en la rama del carril, **no** en
      `origin/master` (comprobado con `git merge-base --is-ancestor`). Por eso **no** se comentó
      como `DEPLOY PEDIDO` en el pedido vivo: un sha que no está en `master` promete algo que el
      `ok` de Sergio Urcullo no publicaría. Entra cuando `onia-cola` mergee.

*(vacío — esta cola se abrió el 2026-09-05)*

## 🔴 Bug crítico en producción — bloquea a TODO cliente nuevo desde 2026-09-17 (tarea t_82251f19)

Encontrado por `recorrido-cliente`, 2026-09-17 08:12 UTC. `lib/mfa/policy.ts:16`:
`MFA_ENFORCE_FROM` es una fecha ABSOLUTA fija (`2026-09-17T04:00:00Z`, escrita el 03-sep como
"hoy + 14 días" de gracia para ADMIN/SUPERADMIN que YA existían), no relativa al alta de cada
cuenta. Desde hoy, un cliente que se registra AHORA (rol ADMIN, cero gracia real) termina el
onboarding OK y queda bloqueado: `app/(dashboard)/layout.tsx:89` lo redirige a `/profile` en
TODA ruta (`/dashboard`, `/patients`, `/billing`, agenda) hasta que active un authenticator app.

Reproducido con `zz-qa-2026-09-17-0809@onia.com.bo`: onboarding cerrado
(`hermes-content/docs/recorrido/capturas/paso-05b-onboarding-listo.png`) pero
`/dashboard`→`/profile` con banner "La verificación en dos pasos es obligatoria para tu rol"
(`paso-05c-gate-levantado.png`).

**Efecto: cada alta nueva desde hoy es inutilizable de punta a punta**, sin aviso durante el
onboarding de que hace falta una app externa. Posible arreglo: gracia relativa a
`organizations.createdAt` (o `profile.createdAt`), no a una constante de fecha absoluta.

Detalle completo y tarea: `/root/bin/onia-tablero.sh show t_82251f19`.

✅ **ARREGLADO EN `master` el 2026-09-17 04:54 La Paz (chatbot-cola, `b1247fb`) — lo que falta es
PUBLICARLO, no volver a arreglarlo.** `lib/mfa/policy.ts`: la gracia dejó de ser una fecha sola y
pasó a colgar del alta de cada cuenta — `fechaExigenciaMfa(cuentaCreadaEl) = max(piso, alta + 14
días)`, con `MFA_ENFORCE_FROM` degradado a **piso** (lo prometido a las cuentas que ya existían el
03-sep) y un alta inválida (`NaN`) cayendo al piso, nunca apagando la política. El llamador real
(`app/(dashboard)/layout.tsx:97`) le pasa `profile.createdAt` a las DOS funciones —la que corta y
la que cuenta los días del banner—, y eso lo sostiene `lib/mfa/gracia-cuelga-del-alta.test.ts`.
Una cuenta creada hoy queda exigida el 1-oct, y **las que ya cayeron en la trampa se destraban
solas con el deploy** (su `max` las manda a alta + 14).

🔴 **Pero el defecto SIGUE VIVO PARA EL CLIENTE**, y eso es lo que hay que leer acá: producción
corre el build `f078373`, anterior al arreglo — medido el 17-sep 07:30 La Paz casando `BUILD_ID`
(`docker exec onia-platform cat /app/.next/BUILD_ID` → `OFd4xCDzoTbQdThUbfzDv` =
`/opt/onia-platform/build-f078373/…`), y en ese árbol `grep -c fechaExigenciaMfa
lib/mfa/policy.ts` da **0**. El pedido de deploy ya existe y está `blocked` esperando el `ok` de
Sergio Urcullo (*«Publicar app.onia.com.bo: 13 arreglos…»*, `t_db98ee26`). **Ningún carril lo
destraba**: no se abre otro pedido ni se despliega a mano.
