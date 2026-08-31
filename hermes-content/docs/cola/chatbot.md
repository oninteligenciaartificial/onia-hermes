# La cola — carril `chatbot`

> **Por qué existe este archivo.** El carril chatbot era el único sin cola: tenía
> `hermes-content/docs/handoff/chatbot.md`, que es **estado**, no plan. Y sin cola no puede
> tener loop — un loop sin cola no tiene qué comer, así que el carril sólo avanza cuando
> alguien abre su sesión a mano.
>
> Su plan SÍ existía: estaba enterrado dentro del handoff como backlogs sucesivos (v2, v3, v4,
> v5, v6, v6.5, v6.6, v6.7). Esto lo saca a la superficie. Doctrina y formato:
> `hermes-content/docs/cola/README.md`.

**Extraído del handoff el 2026-08-31, con Gate 1 corrido ítem por ítem.** De 15 pendientes
heredados, **7 eran fantasma** (46%): ya estaban hechos y el handoff los seguía arrastrando.
Están abajo en "Cerrado", cada uno con el archivo y la línea que lo prueba.

---

## Objetivo único

**Que un desconocido escriba y esa conversación se vea en la bandeja.**

**Hecho =** se abre `/inbox` con la sesión del dueño y hay una conversación de una persona
que no somos nosotros — ni una org QA, ni el probador, ni Sergio desde su celular.

**Por qué éste y no otro.** El producto está construido: bandeja nativa, editor conversacional,
multimedia, visión, comprobantes, insistencia, campañas, push. Trece piezas en tres días. Lo
que NO existe es la única prueba de que sirve: alguien de afuera usándolo. Un objetivo que
fuera "cerrar v6.8" o "difusiones masivas" agregaría la pieza catorce a un producto que
todavía no atendió a nadie.

**El estado de arranque, medido hoy:** el enlace de WhatsApp de onia.com.bo YA manda
desconocidos al +591 75414930, que está en Cloud API con el bot atendiendo
(`web-factory/apps/onia-platform/src/lib/site.ts:30-49`). O sea que la distribución existe
hace semanas. Lo que falta es la última cuadra: que esa conversación **aparezca en la
bandeja**, y que la respuesta sea la que corresponde a lo que la persona clickeó.

---

## Cómo se trabaja esta cola

Igual que las otras cuatro — el detalle está en `hermes-content/docs/cola/README.md`. El
resumen: un ítem por vuelta, Gate 1 antes de tocar nada (¿ya está hecho? verificar EN VIVO,
un grep sirve para descartar y nunca para confirmar), gates completos donde haya código
(`tsc --noEmit` + tests + `eslint`, los tres), y si toca pantalla **se abre y se MIRA**.

**Nada entra a "Ahora" sin evidencia de que existe**, y se verifica solo:

```bash
node scripts/verificar_cola.js hermes-content/docs/cola/chatbot.md
```

**Nunca:** desplegar al VPS sin OK de Sergio · tocar otro carril (web-factory es dueño de
`web-factory/`, producto de la cola de plataforma) · gastar plata · bajar una superficie viva.

---

## Ahora

- [ ] **1 · Contar si un desconocido YA escribió — antes de construir nada.** El 2026-08-29
      la limpieza QA dejó anotado que quedaban **26 conversaciones reales en la cuenta 2** de
      Chatwoot, y **nadie las miró nunca**. Si alguna es de una persona de afuera, el objetivo
      de este carril puede estar cumplido desde hace días y el carril entero está construyendo
      encima de una pregunta que cuesta cinco minutos. Y si ninguna lo es, el número es la
      línea de base contra la que se mide todo lo que sigue.
      **Cómo:** listar las conversaciones de la cuenta 2 por inbox y por fecha
      (`hermes-content/deploy/vps-ops/bot/chatwoot-adapter.mjs` tiene el cliente de la API),
      separar QA (orgs `zz*`, conv 27/38/39/43/44) de lo demás, y para cada inbox real
      preguntar si su id está en `clinic_settings.chatwootInboxId` de alguna org — que es la
      única llave de tenencia de la bandeja (`lib/chatbot/bandeja-auth.ts:22`).
      **Hecho =** un número escrito acá: cuántas conversaciones de desconocidos hay, en qué
      inbox, y si ese inbox se ve o no en `/inbox`.
      ⚠️ Sólo lectura. No borrar ninguna conversación en esta vuelta: la limpieza QA del
      29-ago ya se llevó nueve, y las que quedan son la evidencia de este ítem.

- [ ] **2 · Una org sólo puede tener UN inbox, y nadie puede cambiarlo — así ningún WhatsApp
      llega nunca a la bandeja.** Éste es el hueco que hace inalcanzable el objetivo, y no
      estaba escrito en ninguna parte. Verificado hoy, en cuatro archivos:
      - Al crear la org se le crea un inbox **web** y ése se guarda:
        `app/api/admin/clinics/route.ts:97-105` (`createInbox` + `update chatwootInboxId`).
      - Una vez puesto, **nunca se pisa**: `lib/chatbot/canal-web.ts:27` devuelve
        `created:false` y se va; `app/api/admin/chatbots/route.ts:53` hace lo mismo.
      - La única pantalla que lo muestra es **de sólo lectura**:
        `app/(dashboard)/admin/organizations/[id]/WhatsAppOrgConfig.tsx:215` lo pinta en un
        `<dd>`, sin input ni PATCH.
      - Y no hay nada del otro lado: **cero apariciones** de `embedded` en todo `app/` y
        `lib/` de la plataforma.
      **La consecuencia hoy:** el inbox de WhatsApp del +591 75414930 existe en Chatwoot
      (alta manual, hecha dos veces) pero no es el `chatwootInboxId` de ninguna org, así que
      `lib/chatbot/bandeja.ts` no lo puede mostrar. **La consecuencia mañana:** el día que
      Sergio corra la prueba del popup de Embedded Signup, nace un inbox de WhatsApp que la
      plataforma **va a ignorar** — el cliente conecta su número y su bandeja sigue vacía. La
      pieza que gatea todo el carril entrega un inbox huérfano.
      **Hecho =** un mensaje enviado al +591 75414930 aparece en `/inbox`, MIRADO con captura.
      **Lo mínimo que lo logra** (elegir al construir, no ahora): un PATCH de superadmin que
      apunte una org a un inbox existente. Lo caro sería una tabla de N inboxes por org —
      no hace falta hasta que un cliente tenga web **y** WhatsApp a la vez.

- [ ] **3 · Las frases que la web YA manda no están registradas como campañas: el desconocido
      pregunta una cosa y el bot le contesta el saludo genérico.** Las frases de campaña se
      construyeron ayer (`hermes-content/deploy/vps-ops/bot/recepcionista.mjs:117`
      `campanaExacta`, espejo en `lib/chatbot/knowledge.ts:101`, deployadas en el commit
      `e5c1ad3`) y **no las usa nadie**: cero campañas publicadas en ningún documento.
      Mientras tanto onia.com.bo manda **seis frases fijas distintas** al mismo número, todas
      desde `web-factory/apps/onia-platform/src/lib/site.ts` — "Hola, quiero conocer Onia"
      (línea 41), "Hola, vengo de la web de Onia. Quiero saber si me sirve para mi negocio."
      (49), y las tres de comercio/servicios/importadoras (52-58), más las de los
      configuradores de servicios. Cada una es una intención declarada — la persona ya dijo
      qué quiere antes de escribir — y el bot la trata a todas igual.
      **Por qué es el ítem barato de mayor valor:** no hay que construir nada. La capacidad
      existe, la distribución existe, el número atiende. Falta escribir el documento.
      **Hecho =** las frases cargadas como campañas desde el panel
      (`app/(dashboard)/settings/chatbot/EnsenaleConversando.tsx` las crea hablando),
      publicadas, y las seis contestadas con su respuesta propia — probado por el probador
      real y MIRADO.
      ⚠️ **No se toca `site.ts`**: es del carril web-factory. Las frases se copian tal cual
      están hoy; si alguna cambia allá, la campaña deja de matchear y hay que re-copiarla.

---

## Después

- [ ] **v6.8 — recorrida de fricción completa.** Es el próximo paso que el handoff dejó
      escrito y sigue vigente: recorrer `/settings/chatbot` y `app/(dashboard)/inbox/InboxClient.tsx`
      como si fuera el primer día del dueño, anotando cada roce. Va después del objetivo
      porque pulir la pantalla de un producto que todavía no atendió a un desconocido es
      optimizar sin señal.
- [ ] **Limpieza de la data QA NUEVA.** La del 29-ago ya se ejecutó; después se generó más:
      org `zzqa-horario-0001` ("ZZ QA Horario") con su usuario y su inbox, y las
      conversaciones QA 39, 43 y 44 (bandeja, insistencia, comprobante). **No borrar todavía**:
      son la evidencia de cuatro ítems cerrados, igual que las dos orgs que el carril de
      producto decidió NO borrar por el mismo motivo. Se limpia cuando haya conversaciones
      reales que las reemplacen como prueba.
- [ ] **Vigilar que el reconcile nocturno de Chatwoot no revierta el branding.** Son SEIS
      `installation_configs` (BRAND_NAME, INSTALLATION_NAME, WIDGET_BRAND_URL, LOGO,
      LOGO_DARK, LOGO_THUMBNAIL). El loop de orden (cron `63ae20ad`) los re-aplica, pero
      nunca se verificó que gane la carrera contra el reconcile. Si aparece el logo de
      Chatwoot en `chat.onia.com.bo`, re-aplicar LOS SEIS y limpiar caché
      (`GlobalConfig.clear_cache`).
- [ ] **Botón "Cobrar con QR" dentro de la conversación** (pieza 5 del backlog v5). El
      circuito está completo en mock y verificado mirando (`/bcp/cobrar` + `/bcp/callback`,
      contrato del banco calcado); el código no cambia para el modo real. Espera las
      credenciales del BCP — ver Bloqueado.
- 📌 **Nota para el carril web-factory (no la ejecuta este carril):** tres de las frases de
  `site.ts` dicen *"avisen cuando Onia para comercio/servicios/importadoras esté listo"*, y
  eso es **exhibir obra en la superficie de venta** — prohibido por CLAUDE.md §3. Además los
  tres rubros ya se venden. Anotado acá para que no se pierda; lo decide su dueño.

---

## Bloqueado en Sergio

> Ninguno de estos frena la cola: se anota, se avisa y se sigue con el próximo desbloqueado.

| # | Qué | Por qué sólo él | Qué desbloquea |
|---|---|---|---|
| S1 | **Probar el popup de Embedded Signup con un +591 real** (`chat.onia.com.bo` → Add Inbox → WhatsApp → Connect with WhatsApp Business) | Necesita su sesión de Meta y un chip. Todo lo nuestro está hecho desde el 28-ago: Access Verification ✅, Configuration ID `1824225392073753`, dominio JS SDK autorizado, las 3 InstallationConfigs cargadas | Que un CLIENTE conecte su propio WhatsApp solo. ⚠️ Hoy el inbox que nazca queda huérfano — ver ítem 2 de Ahora |
| S2 | **Credenciales del BCP + certificado mTLS (`.pfx`)** | Trámite bancario | El botón "Cobrar con QR" en la conversación. Sin banco no hay código que lo destrabe |
| S3 | **Traslado del 75414930 a coexistencia** — OK explícito ("vamos con A") + ventana acordada + el PIN de dos pasos a mano | El número queda MUDO 30-60 min y el rollback depende de un PIN que sólo él tiene. Runbook completo: `hermes-content/docs/ONIA_RUNBOOK_COEXISTENCIA_75414930.md` | Que Sergio siga usando su app de WhatsApp en el mismo número que atiende el bot |
| S4 | **Verificar el push "te escribieron" en su celular** (suscribirse y recibir) | Hace falta un dispositivo real | El circuito está testeado 95/95 y deployado; sólo falta la prueba física |
| S5 | **¿Silenciar el Telegram de los agentes n8n que sí trabajan?** (Vendedor, Contenido, Finanzas, Prospector, Radar IA, Web Factory Radar) + los recordatorios de agenda cada 30 min | Es su canal y su umbral de ruido. No se apagan los workflows: hacen trabajo — hay que editar el nodo de aviso de cada uno | Que Telegram vuelva a ser sólo errores, que es la regla que ya se aplicó al resto |
| S6 | **Proyecto Supabase cloud `Dental-gest` (`kvepqgikokjlacxngkiw`) sigue ACTIVE_HEALTHY** — decidir pausar o borrar. Y si algún día se reactiva `Gesti-Os` (`jafxylfocvvlflpqfsix`), **rotar su `service_role` primero**: estuvo expuesto en los JSON de n8n que se redactaron el 29-ago | Es plata y es borrado de datos | Cerrar la cola del saneamiento de secretos |

---

## Cerrado — no rehacer

> **Siete de estos eran pendientes vivos en el handoff y ya estaban hechos.** Se verificaron
> uno por uno contra el código de hoy, no contra el handoff. Cada uno lleva su prueba: si
> alguien los vuelve a abrir, que sea contra el archivo, no contra la memoria.

**Los siete fantasmas** (el handoff los seguía listando como pendientes):

- [x] **Los DOS "fixes de fondo del motor" del 23-ago** que el handoff decía que "siguen
      esperando su sesión". Los dos están puestos: el timestamp en el arranque vive en
      `hermes-content/deploy/vps-ops/bot/webhook-server.mjs:542-545` (con el comentario que
      cita el pedido de los dos handoffs), y `markMessageDelivered` en el turno normal está
      en `hermes-content/deploy/vps-ops/bot/chatwoot-adapter.mjs:733-737` — se cerró como
      PIEZA 4 el 29-ago y el handoff lo arrastró igual en "Próximos pasos".
- [x] **"Decisión: FAQ genérica por cliente (`id:"negocio"`)"**, listada como pendiente de
      Sergio. Está viva y contestando desde el 28-ago:
      `hermes-content/deploy/vps-ops/bot/knowledge.mjs:66` mapea `negocio → R_FAQ_NEGOCIO`,
      con su guardarraíl de palabras disparadoras en la línea 394.
- [x] **"¿Cablear la alerta del watchdog a Telegram?"**, listada como decisión pendiente.
      Ya está cableada: `hermes-content/deploy/vps-ops/bot/webhook-watchdog.sh` avisa bot
      caído y BOT MUDO hacia Chatwoot (1 aviso por incidente + recuperación).
- [x] **"Pantalla del dueño para su canal, sin pasar por el superadmin"** (Próximos pasos 2).
      Es la pieza 3 del 29-ago: `app/(dashboard)/settings/chatbot/CanalWebCard.tsx` con el
      botón de encendido y el snippet, sobre `lib/chatbot/canal-web.ts`.
- [x] **"Siembra con datos reales + bench de humo"** (Próximos pasos 1). El bench existe y da
      6/6: `hermes-content/deploy/vps-ops/bot/humo-plantillas.mjs` con su fixture
      `hermes-content/deploy/vps-ops/bot/plantillas-humo.json`; la plantilla bebe el horario
      real de la org desde `lib/chatbot/plantillas.ts`.
- [x] **"Limpieza de data QA (conversaciones 29/31/32/33, inbox 6, filas sintéticas)"**,
      listada como pendiente de coordinar con Sergio. **Ejecutada el 29-ago 00:40 con su
      aprobación**: 10 conversaciones + el inbox 6 huérfano destruidos por rails, 12
      `bot_conversations` y 52 `bot_messages` sintéticos borrados, backups CSV en
      `/opt/onia/backups/db/qa-limpieza-20260829-003953/`. La data QA que quedó es
      **posterior** — está en Después.
- [x] **"Pricing: ¿existe un escalón más barato sólo widget web, sin WhatsApp?"**. Sergio lo
      decidió el 30-ago: **OPCIÓN A, Bs 390 plano todo incluido**, ratificado y sin cambio de
      código porque `lib/pricing.ts:23` ya lo tenía (`entryMonthly: 390`, `annualTotal: 3900`).
      La comparativa que sostiene la decisión: `hermes-content/docs/ONIA_PRICING_CHATBOT_PROPUESTA.md`.

**Lo construido y verificado en producción** (resumen; el detalle largo vive en el handoff):

- [x] Editor del chatbot **pre-armado por rubro** (`lib/chatbot/plantillas.ts`, 19 tests) +
      el bug de UI que dejaba el nombre del servicio en 26px.
- [x] **Bandeja nativa `/inbox`** viva: backend (`lib/chatbot/bandeja.ts`,
      `lib/chatbot/bandeja-auth.ts`, `app/api/bandeja/route.ts`), pantalla
      (`app/(dashboard)/inbox/InboxClient.tsx`), tenencia revalidada fila por fila, y el
      **candado bot-humano** con armado y desarme.
- [x] **Multimedia** en la bandeja, **visión LLM** (`hermes-content/deploy/vps-ops/bot/vision.mjs`,
      US$ 0,0007 por imagen) y **detector de comprobantes** — que jamás confirma un pago.
- [x] **Editor conversacional** "Enséñale conversando"
      (`app/(dashboard)/settings/chatbot/EnsenaleConversando.tsx` +
      `lib/chatbot/editor-conversacional.ts` + `hermes-content/deploy/vps-ops/bot/editor-sugerir.mjs`).
- [x] **Insistencia** con perilla en el panel y barrido por cron
      (`hermes-content/deploy/vps-ops/bot/insistencia-run.mjs`), **push "te escribieron"**
      (`lib/chatbot/push-te-escribieron.ts`) y **frases de campaña** (deploy `e5c1ad3`).
- [x] **El motor estuvo caído 4 días** (24 al 28-ago) y volvió: `/tmp/onia-bot` a medias +
      la excepción de firewall perdida en el reboot. Las dos causas están auto-curadas desde
      `hermes-content/deploy/vps-ops/bot/webhook-watchdog.sh`.
- [x] **Branding de Chatwoot completo** (seis configs), **canario de auth** cada 5 min,
      **n8n saneado** (4 workflows con claves vivas redactados y archivados, 27 inactivos
      archivados) y el **webhook de Cal.com despublicado** — estaba huérfano y aceptaba POSTs
      forjados.

---

## Rechazado, con motivo — no volver a proponerlo

- **Difusiones masivas** (el último hueco contra Sendy). Necesita plantillas de Meta
  **aprobadas por cada org** y tiene costo por mensaje a partir del 1-oct-2026, cuando se
  cierra la ventana gratis de 24 h. Construirlo sin un cliente que lo pida es especificar a
  ciegas un flujo cuyo costo todavía no conocemos. **Se reabre el día que un cliente lo pida**,
  y ahí se especifica con su caso.
- **Un escalón de precio más barato "sólo widget web"**. Ya decidido: Bs 390 plano todo
  incluido (`lib/pricing.ts:23`). Reabrirlo es desandar una decisión de Sergio del 30-ago
  tomada con la comparativa de mercado en la mano.
- **Apagar los workflows de n8n que avisan por Telegram.** Hacen trabajo real: apagarlos para
  bajar ruido rompe la automatización para arreglar una notificación. Lo que corresponde es
  editar el nodo de aviso de cada uno — y eso espera la decisión S5.
- **Un modelo local para la visión del bot.** Sergio ya lo descartó el 30-ago con el motivo
  escrito: *"pagamos api nomás de modelo barato"* — ollama ya estranguló el VPS una vez
  (steal 93%, load 158). El costo medido de la API es US$ 0,0007 por imagen.
