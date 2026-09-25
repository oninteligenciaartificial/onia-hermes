# Marca ONIA — qué publica @oniahq y cuándo se pauta

> **Fuente sin fecha: se EDITA, no se duplica.** Manda sobre dos cosas: **(1)** qué publica la
> cuenta corporativa `@oniahq` y **(2)** la pauta paga de ONIA (Meta Ads). Las dos le hablan al
> cliente de la Etapa 1 y a nadie más.
>
> **Nace de un choque medido.** El 2026-09-21 a las 15:31 (La Paz) el handoff
> `handoff/meta-ads-prospeccion.md` decidió **«no pautar todavía»**, en una rama sin integrar
> (`bdfdfb04`). Cuatro horas y media después, otra sesión armó en `main` la campaña completa de
> Meta «ONIA Platform Dental» (`5dd85e6d` 19:59, `3f38fa3e` 20:53). **Ninguno de los dos
> archivos cita al otro**: la campaña salió apuntada a «Bolivia» cuando el handoff pedía Santa
> Cruz + 25 km, y sin nombrar los cuatro bloqueos de la cuenta ni los cinco leads sin
> contestar. La decisión llegó a `main` recién el 25-sep (`dc443322`). Un handoff es el estado
> de un carril al cerrar, no una regla: la próxima sesión que abra la campaña no tenía dónde
> leer que está frenada a propósito. El mapa de docs del 25-sep lo marcó como hueco
> (`historial/MAPA_DOCS_20260925.md` §3.2).
>
> ⛔ **No es fuente de** precios (se leen de `onia-platform/lib/subscription-plans.ts` y
> `lib/pricing.ts`), de a quién se le vende (`ONIA_CLIENTE_IDEAL.md`), de qué se vende
> (`ONIA_CATALOGO_DE_VENTA.md`) ni de dónde va cada pieza (`ONIA_DONDE_VA_CADA_COSA.md`).
> Los cita; no los repite. Cómo se aprieta el botón en cada red: `contenido/PUBLICACION.md`.
>
> Cada dato lleva fecha y fuente (`archivo:línea`). **Rutas:** las que empiezan con
> `hermes-content/`, `scripts/` o `web-factory/` son desde la raíz del repo; `CLAUDE.md` y
> `onia-platform/…` se nombran tal cual; el resto cuelga de `hermes-content/docs/`.
> `campaigns/…` abrevia `hermes-content/campaigns/onia-platform-meta-2026-09-21/`, y en §6
> `README.md:N` a secas es el de esa campaña. **Lo que no se re-midió el 2026-09-25 lo dice al
> lado.**

---

## 0. En cinco líneas

1. **@oniahq y la pauta le hablan a UNA persona:** el dueño o administrador de una clínica
   dental o estética de Santa Cruz, con 2 a 6 profesionales y recepción. Es la única cuenta de
   ONIA que sirve a la Etapa 1.
2. **Pauta: no todavía** (decisión del 21-sep). Primero se contesta a los cinco leads que
   llegaron solos; pagar por leads nuevos con ésos esperando es tirar la plata.
3. **La campaña «ONIA Platform Dental» (21-sep)** tiene los estáticos y el carrusel
   renderizados, el video UGC sin generar y **nada publicado**.
4. **La cuenta de anuncios tenía cuatro bloqueos** medidos el 17-sep (sin medio de pago, página
   sin vincular, campaña archivada con 0 anuncios, píxel no instalado). **No re-medidos hoy.**
5. **@oniahq no publica desde agosto.** Lo B2B publicado en septiembre: nada.

---

## 1. A quién le habla — la única cuenta de ONIA que sirve a la Etapa 1

**La etapa vigente** es la Etapa 1, «Producto único · hoy → 5 clientes»: congelar todo lo que no
sea Onia Platform + chatbot y **vender sólo el rubro dental/estética**
(`ONIA_ESTRATEGIA_DE_EMPRESA.md:218-224`; criterio de salida numérico en `:224`).

**El cliente**, textual (`ONIA_CLIENTE_IDEAL.md:22-24`):

> *Onia le vende a la clínica de Santa Cruz que ya tiene más pacientes de los que puede seguir a
> mano: 2 a 6 profesionales atendiendo, con recepción, que pierde plata en los pacientes que no
> volvieron.*

- **El dolor de entrada es el paciente con tratamiento a medias que no volvió**, no la
  facturación (`ONIA_CLIENTE_IDEAL.md:104-110`). El SIAT **no** se usa como urgencia: el emisor
  propio está en trámite y el Portal del SIN es gratis (`:112-115`).
- **Consecuencia para esta cuenta:** nada escrito para «cualquier negocio». Los 7 carruseles de
  agosto le hablaban al «dueño de negocio formal» en general (`hermes-content/contenido/README.md:44`); hoy no
  califican sin reescribirse para la clínica (inventario del 25-sep, fila S11-07,
  `historial/contenido/INVENTARIO_GUIONES_20260925.md`).

### La marca personal le habla a otra audiencia — y está bien que así sea

La serie de YouTube lo dejó escrito, con la cuenta delante (`SERIE_CLAUDE_CODE.md:16-22`):

> *«el que mira un tutorial de Claude Code es un dev del mundo, y el que paga Onia es un dueño de
> negocio boliviano. Son audiencias casi disjuntas.»* … *«La etapa vigente de Onia (cinco
> clientes con la v1.0) sigue viva y sigue siendo otra cosa: esta serie no compite con ella ni
> la reemplaza.»*

Sergio Urcullo decidió que ése no es el objetivo de la serie («primero autoridad, después el
curso»). Lo que se sigue de ahí, para este archivo:

- **El alcance de `@sergiourcullo` no cuenta como avance de la Etapa 1.** El estado operativo
  del 25-sep lo midió: todo lo producido en septiembre fue marca personal y **lo B2B publicado
  fue nada** (`historial/contenido/ESTADO_OPERATIVO_CONTENIDO_20260925.md` §8).
- **Una pieza de la marca personal no se reusa en @oniahq ni en la pauta** sin pasar la prueba
  del vendedor (§2).
- No confundir con §10 de la estrategia: ahí «Contenido / ads» falla el test de tres preguntas
  **como servicio que se le vende a un cliente** (`ONIA_ESTRATEGIA_DE_EMPRESA.md:379`). Esto es
  otra cosa: la publicidad **propia** de ONIA para conseguir los clientes que faltan — el
  producto no tiene problema de rentabilidad, tiene problema de clientes (`CLAUDE.md` §1).

---

## 2. Qué puede publicar: la prueba del vendedor (y lo que venció de ella)

La regla nace de una corrección de Sergio Urcullo del 2026-08-16 (`hermes-content/contenido/README.md:3-5`):

> **Si la pieza le sirve igual a alguien que nunca te va a comprar, no va en @oniahq.**
> (`hermes-content/contenido/README.md:52-53`)

**Por qué:** un post genérico no sólo rinde poco — *«el algoritmo aprende a quién mostrarte»*,
y una cuenta que junta curiosos de IA queda apuntando a la audiencia equivocada
(`hermes-content/contenido/README.md:58-60`).

**Los dos tipos que caben** (`hermes-content/contenido/README.md:67-80`): 📚 **informativo aplicado** — enseña
algo que el dueño usa sobre SU clínica, cierra con «Guardalo» — y 🎯 **venta** — producto,
prueba, oferta. **Prohibido:** IA o tecnología que no termina en el negocio del que mira,
noticias, «top 10 herramientas», consejo fiscal presentado como obligación.

### Lo que cambió desde el 16-ago (cada corrección con su motivo)

| La regla decía | Hoy | Por qué |
|---|---|---|
| «…no va en @oniahq. **Va en Lucía.**» (`README:52-53`) | La pieza que falla la prueba **no va en @oniahq ni en la pauta**. Dónde va, si va a algún lado, lo decide `ONIA_DONDE_VA_CADA_COSA.md` | Lucía está congelada: la Etapa 1 congela todo lo que no sea Platform + chatbot (`ESTRATEGIA:219`) y el influencer IA es «otro producto entero» (`:378`) |
| «somos una agencia y solo vendemos el producto» (`README:5`) | Se conserva **«solo vendemos el producto»** | Hay UN solo producto (`CLAUDE.md` §3). «Agencia» quedó viejo |
| «dueño de negocio formal que ya tiene el problema» (`README:44`) | La clínica del cliente ideal (§1) | `ONIA_CLIENTE_IDEAL.md` es del 18-sep y angosta el perfil |
| — | **Sólo módulos 🟢 del catálogo, cero cifras inventadas, cero obra** (`ONIA_DONDE_VA_CADA_COSA.md:51`) | «La venta nunca exhibe obra» y «no fabricar» (`CLAUDE.md` §3 y §5): cero clientes pagando |
| — | **El sistema es la oferta; el chatbot es add-on, nunca el titular** | `CLAUDE.md` §3 (Sergio Urcullo, 03-sep). D01 «8 de la noche» pone al asistente de titular → reescribir (inventario S11-05) |
| CTA «Reservá una demo» (ads A2–A8, D01: `hermes-content/PARA-PUBLICAR/COLA.md:152`) | **«Creá tu cuenta — 14 días gratis»** | El alta está **abierta** desde el 29-ago: `/register` crea la cuenta sola (`CLAUDE.md` §2) |

---

## 3. Cómo tiene que verse: publicidad que no parezca hecha por IA

Regla de la casa, `CLAUDE.md` §5 (corrección de Sergio Urcullo, 2026-09-21). **Su caso es esta
misma campaña:** la primera versión negra/verde quedó rechazada porque *«repetía el mismo
afiche, parecía generada por IA y no construía un argumento de venta»*
(`hermes-content/campaigns/onia-platform-meta-2026-09-21/README.md:124-129`).

- **Una pieza tiene un trabajo de venta:** dolor exacto del rubro, consecuencia económica,
  mecanismo comprobable y **un solo CTA**. Si se puede cambiar «clínica dental» por cualquier
  negocio y el copy sigue igual, se rechaza.
- **Producto visible o no sale:** al menos una parte central muestra **UI real** (capturas del
  tenant demo), nunca pantallas generadas con IA ni mockups decorativos.
- **UGC con IA = presentadora IA original de ONIA**, que explica y demuestra; nunca clienta,
  odontóloga ni testimonio (`campaigns/…/ugc-dental-30s.md:5-6`: dice «te muestro», nunca «en
  mi clínica» ni «desde que lo uso», `:19`).
- **Se mira la pieza completa antes de cerrarla.** Bonita no alcanza: tiene que dejar reconocer
  el problema, entender el mecanismo y saber qué hacer después.
- **Claims** autorizados y prohibidos de la campaña: `campaigns/…/README.md:87-101` (viven ahí).
- **Gasto en Higgsfield:** `higgsfield generate cost` antes de `generate create` y aprobación
  explícita para cada video (`CLAUDE.md` §5). Skills: `hermes-content/skills/carruseles-onia.md`
  y `hermes-content/skills/ugc-empresas-higgsfield.md`.

---

## 4. La pauta: decisión vigente — **no todavía**

> **No se pauta todavía.** Decisión del 2026-09-21, con la medición que la sostiene
> (`handoff/meta-ads-prospeccion.md:14-15`). Sólo Sergio Urcullo la cambia, y nada se enciende
> sin su OK explícito (`:139`).

**El porqué, textual** (`handoff/meta-ads-prospeccion.md:153-154`): *«pagar por leads nuevos
mientras cinco gratis esperan 31 días es tirar la plata.»*

- **Cinco leads llegaron solos** (tres clínicas dentales, una de estética y un «vengo de la
  web»), el más viejo del 21-ago, **todos sin respuesta** al re-medirlos contra producción el
  21-sep (`:118-127`). El mejor es una clínica odontológica de 4 doctores con seis preguntas
  por escrito: el cliente ideal exacto. **No re-medido el 25-sep.**
- Los barridos automáticos del 18-sep **no** los rescataron: trabajan sobre lo nuevo, no sobre
  la deuda de agosto (`:129-132`). A los de WhatsApp ya sólo se les escribe con plantilla
  aprobada (`:134-135`).
- `subscription_payments` = **0 filas** al 21-sep: cero clientes pagando (`:142-143`).

**El orden, y por qué es ése** (`handoff/meta-ads-prospeccion.md:147-179`) — cada paso es más
barato que el siguiente y produce antes:

1. **Contestarle a los cinco.** Antes, verificar en el producto, una por una, cuáles de las seis
   funciones que pidió la clínica de 4 doctores existen hoy (`:157-159`); sus preguntas están
   en `ONIA_LEADS_ESPERANDO.md`.
2. **Arreglar el one-pager**, que todavía vende «DentalGest» y planes viejos, y mostrárselo a
   Sergio Urcullo antes de reemplazar el actual (`:161-166`, `:79-81`).
3. **Arreglar la atribución:** la landing no propaga `?src=` hasta `/register`, así que todo lead
   pago llegaría con `src = NULL` (`:64-72`). Condición previa, no un extra.
4. **Recién ahí**, con la tarjeta puesta: **recrear** la campaña **en pausa** (la vieja está
   archivada: se recrea, no se reactiva), público **Santa Cruz + 25 km** (`:173-179`).

---

## 5. La cuenta de anuncios: cuatro bloqueos (medidos el 17-sep, no re-medidos)

Medido en vivo el 17-sep con la Graph API desde el VPS (`handoff/meta-ads-prospeccion.md:43-52`,
que tiene los IDs):

| Qué | Estado al 17-sep | Quién lo destraba |
|---|---|---|
| Medio de pago en la cuenta ONIA Ads | ❌ ausente | Sergio Urcullo / Leslie |
| Página «Onia» vinculada a la cuenta | ❌ `promote_pages` vacío (ser `owned_page` del business no alcanza) | Sergio Urcullo, en Business Manager |
| Campaña 1 | ❌ **ARCHIVED desde el 1-sep, con 0 anuncios** — se recrea, no se reactiva | código |
| Píxel en `onia.com.bo` | ❌ no instalado, nunca disparó | carril web |

✅ Lo que sí estaba resuelto: el token de sistema no vence y tiene los permisos de ads
(`:54-57`).

⚠️ **Trampa que ya costó llamadas:** el conector de Meta Ads de las sesiones está logueado con
**otra** cuenta de Meta: ve «NUVO 1usd» y «Arthur Fuentes», no ONIA Ads. **No sirve para esta
cuenta y jamás se gasta en esas dos** (`:59-62`). Se confirmó de nuevo el 25-sep
(`historial/contenido/ESTADO_OPERATIVO_CONTENIDO_20260925.md` §8 y §13).

**No re-medido el 25-sep:** el conector ve otra identidad y el VPS tiene un solo dueño a la vez.
Se re-mide con el comando de `handoff/meta-ads-prospeccion.md:197-205`.

**Lo que el píxel ausente le hace a la campaña:** su README pide comprobar **antes de activar**
que el evento de registro llega a Meta y, si no hay evento confiable, arrancar con Lead Form en
vez de optimizar a un evento ciego (`campaigns/…/README.md:31-33`). Con el píxel sin instalar,
hoy ese evento no existe.

---

## 6. La campaña «ONIA Platform Dental» (21-sep): qué está listo y qué falta

Su detalle —copy para Meta, claims, referencias de Ads Library, plan de prueba— **manda en**
`hermes-content/campaigns/onia-platform-meta-2026-09-21/README.md`. Acá sólo su estado.
Estado declarado: *«creatividades preparadas; no publicadas»* (`README.md:5`).

### Listo

| Pieza | Estado | Dónde |
|---|---|---|
| Carrusel 4:5, 8 láminas (v2) | renderizado (8 láminas + hoja de contacto) | `hermes-content/carousels/out/ads/onia-platform-dental-meta-20260921-carousel-v2-feed/` |
| Estático feed y story (v2) | renderizados | `…-static-v2-feed/` · `…-static-v2-story/` (misma carpeta `out/ads/`) |
| UGC IA 9:16, 27 s | guion final + 2 imágenes ancla de la presentadora; **video NO generado** | `campaigns/…/ugc-dental-30s.md`, `campaigns/…/assets/*.png` |
| Copy, claims y plan de prueba | escritos | `README.md:67-109` |

⚠️ En `out/ads/` conviven las carpetas de la **v1 rechazada** (`…-carousel`, `…-static-feed`,
`…-static-story`, sin «v2»): **no se usan** (`README.md:124-129`).

### Falta, antes de publicar una sola pieza

1. **Lo de §4 y §5.** Sin eso no hay pauta, por buena que sea la pieza.
2. **El OK de Sergio Urcullo mirando las piezas renderizadas.** Construir y publicar son dos
   permisos distintos (`CLAUDE.md` §4). En el repo no consta que las haya visto.
3. **Alinear el público con el cliente ideal.** La campaña dice «Bolivia» y «2–5 personas en
   el equipo» (`README.md:7-9`); el cliente ideal es Santa Cruz, 2 a 6 profesionales **con
   recepción** (`ONIA_CLIENTE_IDEAL.md:22-24`), y el handoff pide Santa Cruz + 25 km
   (`handoff/meta-ads-prospeccion.md:179`).
4. **El precio del cierre.** La campaña muestra un «desde Bs …/mes» (`README.md:26`, `:79`,
   `:92`). Se compara contra `onia-platform/lib/subscription-plans.ts` (`DEFAULT_PLAN_AMOUNTS`)
   antes de publicar; hasta hoy sólo se comparó contra el espejo del sitio (inventario del
   25-sep, §5 fila 17). **No verificado contra la fuente.**
5. **La atribución.** El destino lleva `utm_*` (`README.md:28`); el formulario del producto lee
   `src` (`handoff/meta-ads-prospeccion.md:66-69`). **No verificado** si el producto guarda
   `utm_*`: `onia-platform` no estuvo en esta sesión.
6. **El evento de registro en Meta** (píxel) o Lead Form (§5).
7. **El UGC:** cotizar en vivo con `higgsfield generate cost` y aprobación explícita; el gasto
   quedó bloqueado por no poder cotizar desde una sesión autenticada (`README.md:131-133`).
8. **Las capturas del tenant demo:** revisarlas mirándolas —sin datos personales ni un estado
   viejo del producto— (`README.md:120-122`).
9. **Una contradicción entre fuentes, a resolver (no la resuelve este archivo).** Las piezas
   nombran cobros y al agente Recall (`ugc-dental-30s.md:37`; claims en `README.md:89-93`); en el
   catálogo los dos están 🟡 — *se puede vender mostrándolo, sin prometer «probado»*
   (`ONIA_CATALOGO_DE_VENTA.md:27-31`, `:110`, `:116`)— mientras que la fila de @oniahq en
   `ONIA_DONDE_VA_CADA_COSA.md:51` pide nombrar **sólo** módulos 🟢. Por `CLAUDE.md` §2 manda el
   catálogo sobre qué se vende; la fila más estricta queda anotada para Sergio Urcullo.

---

## 7. @oniahq: estado de la cuenta

| Qué | Estado | Fuente |
|---|---|---|
| La cuenta | profesional («Empresa de software»), vinculada a la página de Facebook «Onia»; **0 publicaciones · 22 seguidores** al 16-ago | `hermes-content/contenido/ONIAHQ.md:3-6`. El «25» que circula no tiene medición (estado operativo 25-sep §5) |
| La bio | cambiada el 16-ago: «Un solo sistema: agenda, cobros, inventario y caja…», para cualquier negocio | `hermes-content/contenido/ONIAHQ.md:21-27`. Con el cliente ideal del 18-sep, revisarla es decisión de Sergio Urcullo (la lee todo el que cae) |
| Última publicación con evidencia | el carrusel del **21-ago** («R.I.P. al cuaderno»); el 28-ago una persona real comentó SISTEMA en un post de @oniahq y el DM llegó | `ONIA_CIRCUITO_COMENTARIO_DM.md:330` y `:14-17` |
| Lo programado después | 7 carruseles en cola de Postiz del 19-ago al 02-sep; Postiz estuvo caído ~3 semanas hasta el 04-sep; D01 «8 de la noche» seguía listo y sin publicar el 03-sep | `hermes-content/contenido/ONIAHQ.md:130-141`; estado operativo 25-sep §3; `hermes-content/PARA-PUBLICAR/COLA.md:139-155` |
| Septiembre | **ninguna publicación registrada** | estado operativo 25-sep §0.9 y §8 |

**No re-medido el 25-sep: nadie abrió el feed.** Cuántas de las 7 programadas salieron de
verdad no consta en ningún archivo.

### Las palabras clave de @oniahq

`SISTEMA` y `LISTA`, **y no hay una tercera** (`hermes-content/contenido/README.md:101-111`).
El circuito comentario→DM de esta cuenta **entrega**: primera entrega verificada a un tercero
el 28-ago (`ONIA_CIRCUITO_COMENTARIO_DM.md:14-17`). La fuente del circuito es ese archivo, no
éste.

- ⚠️ **D01 pide `DEMO`** (`hermes-content/PARA-PUBLICAR/COLA.md:144`): una tercera palabra,
  fuera de la regla y sin constancia de que esté cableada (`:154-155`).
- ⚠️ **La promesa de `SISTEMA` cambió y hay que barrerla antes de reactivar la cuenta.** El DM
  de `SISTEMA` que figura en el test del circuito (27/28-ago) dice *«Te dejo el link para
  agendar el diagnostico de 20 minutos…»* y manda a `onia.com.bo/?src=onia-ig-sistema`
  (`ONIA_CIRCUITO_COMENTARIO_DM.md:333`); el Cal propio está **apagado desde el 29-ago**
  (`ONIA_CALCOM_SELF_HOST_RUNBOOK_2026.md:3-4`) y hoy el CTA del producto es «Creá tu cuenta»
  (`CLAUDE.md` §2). Una promesa que cambia se barre en toda la superficie (`CLAUDE.md` §2).
  **No verificado qué dice hoy el DM.**

### Cómo se mide

Por **registros**, no por likes: registro iniciado, registro completado y costo por registro
(`campaigns/…/README.md:103-109`). La métrica de
`hermes-content/contenido/ONIAHQ.md:205-216` («reuniones agendadas con `?src=`») es anterior
al alta abierta (29-ago).

---

## 8. Qué depende de Sergio Urcullo

| # | Qué | Fuente |
|---|---|---|
| 1 | **Contestar a los cinco leads**, o decidir cuándo y con qué mensaje | `handoff/meta-ads-prospeccion.md:118-127`; `ONIA_LEADS_ESPERANDO.md:14` |
| 2 | Tarjeta en ONIA Ads y **vincular la página** en Business Manager (5 min, gratis) | `handoff/meta-ads-prospeccion.md:138` |
| 3 | **OK explícito para encender la pauta.** Nada se activa sin eso | `:139` |
| 4 | Ver el one-pager corregido antes de que reemplace al actual | `:140` |
| 5 | Ver **renderizadas** las piezas de la campaña del 21-sep y dar —o no— el OK | `CLAUDE.md` §4 |
| 6 | Aprobar el gasto del UGC con la cotización en vivo delante | `CLAUDE.md` §5; `campaigns/…/README.md:131-133` |
| 7 | Decidir la contradicción 🟡/🟢 de §6.9 y si la bio de @oniahq se reescribe para la clínica | §6, §7 |

---

## 9. Qué manda acá y qué sigue mandando en otro lado

| Archivo | Qué sigue mandando ahí | Qué pasa a mandar acá |
|---|---|---|
| `hermes-content/contenido/README.md` | Las palabras `SISTEMA`/`LISTA` y su recurso. **Lo lee `web-factory/apps/onia-platform/scripts/recursos-vivos.mjs` (carril Platform): no se mueve ni se renombra sin avisar** (mapa de docs 25-sep §3.1) | La prueba del vendedor **corregida** (§2) |
| `hermes-content/contenido/ONIAHQ.md` | La foto de agosto: bio, inventario, la cola de Postiz, cómo se usa `scripts/postiz_schedule.mjs` | Todo lo posterior al 21-sep sobre @oniahq |
| `handoff/meta-ads-prospeccion.md` | El estado de ese carril al 21-sep y los comandos para re-medir | La decisión «no pautar todavía» y su orden (§4) |
| `hermes-content/campaigns/onia-platform-meta-2026-09-21/README.md` | Copy, claims, referencias de Ads Library, plan de prueba | Su estado y lo que falta (§6) |
| `ONIA_ADS_CAMPANA_1_LISTA_20260813.md` | Textos de anuncios de agosto — **sus cifras están vencidas** (`handoff/meta-ads-prospeccion.md:177-178`) | — |
| `ONIA_DONDE_VA_CADA_COSA.md` | Dónde va cada pieza (manda sobre lugares) | — |
| `contenido/PUBLICACION.md` | Cómo se publica hoy en cada red | — |

**Pendiente (no se hizo en el commit que creó este archivo, que no toca archivos existentes):**
poner en `hermes-content/contenido/README.md` y `hermes-content/contenido/ONIAHQ.md` un aviso que apunte acá, y sumar este
archivo al índice `ONIA_CIRCUITO_DE_CONTENIDO.md`.

---

## 10. Cómo se re-verifica

- **Leads y pagos** (el número que cambia la etapa entera): los dos comandos de
  `ONIA_CLIENTE_IDEAL.md:223-233`.
- **La cuenta de anuncios:** `handoff/meta-ads-prospeccion.md:197-205`, por Graph API desde el
  VPS. **No con el conector de Meta Ads** (otra cuenta, §5).
- **El feed de @oniahq:** abrir la cuenta y **mirarla**. Un 200 o un post «programado» no es
  una publicación.
- **El precio de la campaña:** contra `onia-platform/lib/subscription-plans.ts`, el día que se
  vaya a publicar.
