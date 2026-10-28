---
name: onia-ventas-pauta
description: "Invocar para CUALQUIER trabajo del carril Ventas y pauta de Onia: prospectar negocios con señal (Biblioteca de Anuncios de Meta), escribir o verificar mensajes 1:1 y respuestas a leads, el guion de demo, el registro de objeciones, las piezas del anuncio (A1/A2/D4, G1-G5), un VSL o video de venta, y la campaña de Meta en ONIA Ads. §9 es el método «anuncio que vende» de punta a punta (investigar, promesa verificada, guion, creativo, QA, prueba y métricas). Dice qué ya está medido para no volver a investigarlo: método, comandos, trampas e intentos fallidos con su fecha."
---

# Ventas y pauta — lo que ya se sabe

> Nace el 1-oct-2026. Sergio Urcullo: *«tienen que aprender a hacer las cosas, que quede como
> autoconocimiento, sin eso investigamos y perdemos las cosas»*. **Antes de investigar, leé esto.** Al
> cerrar una tarea, sumá acá lo aprendido (con fecha y caso real) en el mismo commit del trabajo.

## 0. Qué es de este carril y qué no

- **Suyo:** conseguir clientes. Listas para contacto 1:1, respuestas a leads, registro de objeciones, guion
  de demo, Meta Ads de punta a punta (piezas incluidas) y @oniahq solo como la página que pauta.
- **No es suyo:** carruseles de contenido (Marca personal), producto (Plataforma), VPS, chatbot.
- **Estado vivo:** `hermes-content/docs/handoff/mercado-y-pauta.md`. Las fuentes, una por tema:

| Tema | Fuente |
|---|---|
| A quién se le vende, plan por tamaño | `hermes-content/docs/ONIA_CLIENTE_IDEAL.md` |
| Qué se vende hoy (vivo en producción) | `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md` |
| Cómo se consiguen clientes, la campaña, la lista de encendido | `hermes-content/docs/ONIA_ADQUISICION_Y_PAUTA.md` (§5.8, §5.8.1, §5.9) |
| Prospectos dentales y registro de objeciones | `hermes-content/docs/ONIA_PROSPECTOS_DENTAL_SCZ.md` (§6, §7) |
| Prospectos de estética, importadora, comercio y servicios | `hermes-content/docs/ONIA_PROSPECTOS_OTROS_RUBROS_SCZ.md` |
| Leads que ya escribieron: quiénes son | `hermes-content/docs/ONIA_LEADS_ESPERANDO.md` (§3.1: las preguntas de «F» contra el catálogo) |
| Qué se les manda (plantillas A/B, respuestas, días 3-7-14) | `hermes-content/sales-kit/SEGUIMIENTO-LEADS.md` |
| Guion de demo de 20 minutos por rubro | `hermes-content/sales-kit/02-GUION-DEMO.md` |
| Los 6 add-ons que Sergio Urcullo nombró el 8-oct (web, IA local, campañas de Meta, app, influencers IA, consultorías): potencial, mercado, test de 3 preguntas y orden para después de la 1.0 | `hermes-content/docs/ONIA_ADDONS.md` |
| Competencia: mapa, fichas y tandas semanales | `hermes-content/research/competencia/MAPA_COMPETENCIA.md` y `hermes-content/docs/ONIA_UI_MEJORAS_1.0.md` §8 |
| Formatos de anuncio que sostienen los competidores, con su versión Onia | `hermes-content/research/competencia/anuncios/FORMATOS-QUE-SOSTIENEN.md` |
| Precios | `onia-platform/lib/subscription-plans.ts` (`DEFAULT_PLAN_AMOUNTS`); límites en `lib/plan-catalogo.ts` |

## 1. Reglas que no se negocian

> **Reglas de la sesión principal, 3-oct** (antes «madre»; hoy mandan `AGENTS.md` y `CLAUDE.md`; nacen después del bucle de D4: se armó prometiendo el tratamiento a medias, que en
> producción no encontraba a nadie, porque la frase no se comparó con el catálogo antes de renderizar):
> 1. **Cada tarea arranca con 3 líneas escritas en el transcript:** META, PRUEBA DE HECHO y REGLA DE PARADA.
> 2. **Antes de renderizar una pieza o mandar un mensaje, cada frase se compara con
>    `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md`.** Si no figura como vivo, no se dice. El código en producción
>    no alcanza.
> 3. **Tokens:** workflows de 5 agentes como máximo; nada de leer transcripts ni docs enteros (se lee la sección con
>    `grep -n` + `sed -n`); effort bajo y modelo chico para lo mecánico. Medido el 3-oct: más del 95 % del gasto
>    fue releer contexto.

> **De USTED, nunca vos ni tú** (Sergio Urcullo, 3-oct: *«no se usa vos, es muy informal, usted»*).
> - **Alcance:** el bot de venta, las respuestas a la pauta, las plantillas de WhatsApp, los mensajes 1:1 y los
>   agentes de voz, producto, web y anuncios. **Actualización 9-oct:** producto y clientes = usted; marca personal = vos.
>   Los briefs históricos en voseo se corrigen antes de reutilizarlos; no se cambia una plantilla aprobada en Meta sin su proceso de aprobación.

**Aprendizajes incorporados 9-oct (sin afirmar implementación):** `hermes-content/references/video-intake/2026-10-08-orquestacion-e-ingresos-5-posts.md` §2 propone diagnóstico → plan → llamada; validar capacidad de respuesta antes de prometer «7 minutos», nunca copiar «309 leads/día». §5 aporta conflicto → giro → producto como solución, sin burla ni cifras ajenas. `2026-10-04-reels-para-lucia.md` §4 aporta problema/solución/producto/objeción/descubrimiento para auditar el plan: casos de éxito solo con evidencia propia y permiso. La conversión se mide por demos, no por likes. Para recursos de marca personal se usa «Buscá PALABRA en Avisos», no una promesa de DM.
> - **El bot ya está de usted** (3-oct; gate `bot/de-usted.test.mjs`). Lo que quedó afuera y por qué está en la skill
>   `onia-chatbot`, sección «El bot de ventas habla de usted». Dos cosas dependen de Sergio Urcullo:
>   1. **Plantillas de Meta** (`seguimiento_demo`, `recordatorio_demo`): siguen en voseo porque el bot manda la
>      copia literal de lo aprobado. Pasan a usted solo con una plantilla nueva aprobada en Meta.
>   2. **El recepcionista** (el bot que cada cliente pone delante de sus clientes): sigue de vos. Pendiente de
>      decidir si también va de usted o si lo elige cada negocio.
> - **Respuesta nueva a la pauta: SIN FIRMA, no se publica** (regla del 3-oct). La campaña del anuncio entró al repo
>   con `363dcf10` (30-sep, «REQUIERE FIRMA»); el barrido del 3-oct solo pasó ESE texto a usted, sin cambiar qué
>   dice. La versión nueva que espera firma es esta:
>   > ¡Gracias por escribir desde el anuncio! Para mostrarle Onia con el caso de su clínica, y no una demo genérica,
>   > cuéntenos: • ¿Cuántos profesionales atienden? • ¿Quién agenda las citas hoy? Con eso Sergio le escribe para
>   > coordinar la demo. Y si usted es paciente y busca un turno, por acá no damos citas: escríbale directo a su
>   > clínica.
>
>   Al firmarla: reemplaza `respuesta` de la campaña del anuncio en `knowledge.onia.json`, corre la suite del bot y
>   se publica con el deploy del bot (no lo hace este carril).

- **Nadie se contacta** sin que Sergio Urcullo apruebe el mensaje y el canal exactos. Lo envía él.
- **En Meta no se crea ni se enciende nada** sin su OK explícito. Se crea en PAUSA, con cero gasto.
- **Nunca** se usan para Onia las cuentas «NUVO 1usd» (`1350762290562517`) ni «Arthur Fuentes»
  (`4655821921409564`): ni gasto, ni métricas, ni campañas. ONIA Ads es `act_1073680778314945`; la página
  «Onia» es `1140384625819526`.
- El píxel va solo en onia.com.bo, nunca en app.onia.com.bo.
- No se fabrica nada: hay 0 clientes pagando, así que no hay testimonios ni cifras de resultado. Un mensaje o un
  anuncio promete solo lo que producción hace hoy (`ONIA_ADQUISICION_Y_PAUTA.md` §5.4).
- Leer la base de producción necesita el OK de Sergio Urcullo. El portal del SIAT no lo abre ninguna sesión.

## 2. Prospectar con señal (método medido el 30-sep y el 1-oct)

**La señal que vale:** el negocio **paga pauta hoy** para que le escriban o agenden. Eso dice que invierte en
conseguir clientes y que el chat le llena la agenda, que es el dolor que Onia resuelve.

**La herramienta que SÍ funciona desde la nube:** `mcp__Meta_ads__ads_library_search` (lectura pública).
- País `BO`, estado `ACTIVE`. Buscar por `page_ids` (para re-confirmar a los que ya están) y por términos
  (`spa`, `estética`, `depilación`, `botox`, `faciales`, `agenda tu cita`, `importadora`, `repuestos`,
  `mayorista`, `clínica dental`, `odontología`).
- Fechas: el inicio viene en segundos UNIX; `1790800000` ≈ 30-sep 20:30 UTC.
- **Límites medidos el 1-oct:** trae solo el **título del enlace** (no el texto ni la imagen); corta en 50
  resultados; con estado `ALL` **no** devuelve los inactivos (no se sabe cuándo alguien dejó de pautar); la
  búsqueda es por texto, **no por ciudad**.

**La vara para entrar a la lista** (igual en todos los rubros):
1. Pauta **activa hoy**, en **BOB**, con botón a chat o WhatsApp, o que pide agendar, reservar o cotizar.
2. **Sostenida:** más de un anuncio, o semanas pautando. Dos anuncios de un solo día = «recién empezada».
3. **Ciudad y tamaño** se marcan **sin verificar** salvo que el anuncio o la página lo digan. Nunca se
   inventan ciudad, tamaño, teléfonos ni nombres; lo inferido lleva `[inferencia]`.
4. **Afuera:** cadenas, franquicias y hospitales; el consultorio de una sola persona; otra ciudad; más de 6
   profesionales; el que ya paga otro software de agenda (sería un reemplazo); el que vive de paquetes de
   sesiones (estética: Onia no los tiene); varias sedes (Onia no es multi-sede); el que vende en dólares o con
   precio por cliente (importadora).
5. **Cruzar con los leads** de `ONIA_LEADS_ESPERANDO.md`: a quien ya escribió no se le escribe dos veces.

**Verificar ciudad, tamaño y canal ANTES de redactar el mensaje (medido el 1-oct, de noche).** De los 28 prospectos
del 30-sep y el 1-oct, al verificarlos **salieron 8 y quedaron 13 sin dato**. Solo 7 siguen:
- **Estética: salieron 5 de 12.** Dos eran de La Paz y una de Cochabamba: la Biblioteca las trajo con la búsqueda
  «estética Santa Cruz», y en Cochabamba hay una «Avenida Santa Cruz». Otra era una tienda de insumos y la quinta ya
  usaba AgendaPro.
- **Dental: salieron 2 de 10.** Odontoking pasó de «4 o más» doctores en agosto a 28 en su web hoy. Cortez tiene sedes
  en La Paz y Santa Cruz.

Redactar primero y verificar después costó una tarde de mensajes tirados. Las fuentes que funcionan, en orden:
1. **La web propia.** La página de equipo cuenta los profesionales: `odontoking.com/quienes-somos`, `/staff/`. Los
   botones `wa.me` dan el WhatsApp real: el de San Pedro no era el teléfono de la home.
2. **Estética: el directorio `beautynailhairsalons.com`, por `page_id`.** Copia la «Información» de cada página de
   Facebook, con publicaciones recientes.
   - `https://www.beautynailhairsalons.com/BO/Santa-Cruz-de-la-Sierra/<page_id>/x` redirige (301) a la ciudad
     real.
   - Un 404 quiere decir que no está indexada.
   - Solo cubre la categoría belleza: dentales e importadoras dan 404.
   - **Para dentales existe el mismo directorio: `dentists10.com` (8-oct).**
     `https://www.dentists10.com/BO/Santa-Cruz-de-la-Sierra/<page_id>/x` redirige (301) a la ciudad real y trae la
     dirección, el teléfono y los posts con fecha. Resolvió 27 de 81 páginas dentales que pautaban, con este loop:
     `curl -s -o /dev/null -w '%{http_code} %{redirect_url}' <url>`. Va **antes** de cualquier búsqueda web.
   - **La búsqueda web no encuentra las páginas de Facebook de clínicas chicas bolivianas (8-oct).** Con 2 agentes
     y 50 búsquedas sobre 23 páginas sin directorio, ninguna quedó en Santa Cruz. DuckDuckGo pide captcha y Bing
     ignora las comillas. Lo que el directorio no tiene va directo a la PC, con el id del anuncio para abrirlo.
   - Resolvió 9 de 12 de estética y 7 de la reserva. Es evidencia media: con ella se descarta; para confirmar, se
     cruza con la web o el anuncio.
3. **Directorios públicos:** medicoespecialista.com.bo, boliviayp, amerpages, boliviapymes y Waze/Yandex. Los
   fragmentos del buscador sobre una red social se anotan como «fragmento» (evidencia débil).

**Veredicto, con tres estados:**
- **SIGUE:** ciudad confirmada, canal propio y nada que la descarte. El tamaño que falte se pregunta primero en la
  conversación.
- **SALE:** un dato verificado la descarta.
- **EN ESPERA:** falta la ciudad o el canal, o hay un descarte probable sin confirmar. Se resuelve desde la PC, o
  entra la reserva.

**Trampas medidas:**
- **Homónimos de otro país:** MUN en Zaragoza, Corpo Belo en Brasil (usa Reservio), Todo Frenos en Venezuela, Remel
  de Thermo Fisher. Confirmar Bolivia y Santa Cruz antes de atribuir un dato.
- **La moneda de la cuenta de anuncios no es la de la venta.** Jhimbo pauta en USD y vende en Bs en su web.
- **Dos páginas no son dos sedes.** Jhimbo declara «+1 sucursal». Pero «Sucursal Santa Cruz» o «Sucursal Central»
  en la página sí es multi-sede: así salieron Stima y MiaFarma.
- **Buscar en la Biblioteca por el nombre del negocio** encuentra solo si el nombre está en el texto del anuncio.
  Cero resultados no prueba que no paute.

**Lo que solo se ve desde la PC, en Facebook (2-oct): de 13 en espera, salieron 9.**
- Uno era un hospital de 24 horas.
- Un fundador se había retirado.
- Una sola médica en un consultorio, o un solo cirujano.
- Un spa de mascotas.
- Una central en Cochabamba.
- Dos sedes en la misma ciudad (MUN).
- Páginas quietas desde hace meses.

La nube resuelve la ciudad y el canal. **El tamaño real y si el negocio sigue vivo** casi siempre necesitan abrir
su Facebook desde la PC: se pide como issue `orquesta` + `carril:investigacion` con `donde: pc` y la lista exacta. Al que queda listo, el mensaje le cierra la
condición con una sola pregunta («¿cuántas profesionales atienden hoy?», «¿las importan ustedes directo?»).

**Re-leer antes de enviar:** un prospecto cuya pauta se cortó recibe un mensaje sobre un anuncio que ya no
existe. El 1-oct, de 13 prospectos del 30-sep: Cames ya no pautaba, y DASHA, Corpo Belo y Jhimbo habían
cambiado de anuncios (hubo que corregir su línea «Vi…»).

**Formato del mensaje 1:1** (de usted, para el dueño o la dueña):
«Buen día, soy Sergio Urcullo, de Onia, aquí en Santa Cruz. Este mensaje es para el dueño o la dueña de X.
/ Vi sus anuncios de… (lo observable, con fecha) / el dolor concreto del rubro / el mecanismo que producción
cumple hoy / ¿Le muestro cómo se ve en una demo de 20 minutos?». Sin precio, sin cifras, sin testimonios.
- **Dental y estética prometen solo esto:** cada mañana Onia le deja anotado a quién escribirle (quién tiene cita
  mañana y no confirmó, quién canceló o faltó y no volvió a agendar, quién le debe) con el mensaje listo, y nada
  sale sin que usted lo apruebe (catálogo §8.3). La IA va como en el catálogo §8.1: «Con IA le propone el texto de
  cada recordatorio, y usted lo aprueba una sola vez». **No se dice «se manda desde su propio WhatsApp»**: el
  catálogo §7 no deja prometer el envío por WhatsApp (corregido 8-oct). Molde completo: `ONIA_PROSPECTOS_DENTAL_SCZ.md`
  §6.9, que pasó el revisor de promesas.
- **Importadora promete solo esto:** el costo real por producto importado y el aviso cuando el tipo de cambio
  deja un precio bajo costo. **No** se promete que la cotización sale del sistema.
- Comercio y servicios: los dos arreglos que faltaban (editar producto, precio y stock; agenda de varios
  profesionales en planes bajos) **están en el código de producción** (leído el 1-oct, ver `02-GUION-DEMO.md`
  §3). La nota de no agendar demos queda hasta que Plataforma lo confirme en pantalla.

## 3. Verificar una respuesta a un lead contra el código

Nace del lead de 4 doctores (conv 35, 25-ago): pidió seis capacidades concretas y el costo total, y
contestarle de memoria es la forma de quemarlo.

1. El producto está en `/home/user/onia-platform` (o `add_repo` de `oninteligenciaartificial/onia-platform`).
   El árbol de trabajo puede estar viejo: leer **siempre** con `git fetch --depth=50 origin master` y después
   `git show origin/master:<ruta>` o `git grep <patrón> origin/master -- <rutas>`.
2. **Qué está en producción:** `ONIA_CATALOGO_DE_VENTA.md` anota la release (el 1-oct, `release-4dc829e8`).
   Para saber si un commit ya está publicado:
   `git merge-base --is-ancestor <commit> <release> && echo publicado`. Así se supo el 1-oct que la 1.0
   (`3d5f954`) ya estaba publicada y Crece con 4 usuarios (`8f2c2b5`) todavía no.
3. Por cada pregunta: archivo y constante que la prueba, en una tabla («De dónde sale»). Lo que no se encuentra
   **es un «no»**, y se dice. Para afirmar que algo NO existe se lista el módulo entero
   (`git ls-tree -r --name-only origin/master lib/onia-core/modules/`): un `grep` sirve para descartar, nunca
   para confirmar una ausencia (error del 30-sep con el tratamiento a medias).
4. **Datos ya medidos (1-oct, `a7f228c`):**

| Capacidad | Dato | Archivo |
|---|---|---|
| Tratamiento a medias | `EN_PROGRESO`, sin cita por delante y **21 días sin venir** (`diasSinVenir`); solo dental y estética; propone, un humano aprueba en `/pending` | `lib/onia-core/modules/agents-tratamiento-a-medias.ts` |
| Canceló o faltó y no reprogramó | `CANCELADA` y `NO_ASISTIO`, ventana de **14 días** | `lib/onia-core/modules/agents-reprogramador.ts` |
| Agentes | desde **Crece** (`agentsIncluded`) | `lib/plan-catalogo.ts` |
| Usuarios por plan | Básico 2 · Crece 3 en producción (4 con `a7f228c`) · Profesional 5 · Clínica sin tope | `lib/plan-catalogo.ts` |
| Exportar | CSV desde Básico; **PDF no**; la cola de seguimiento no se exporta | `csvExportEnabled`, `app/api/settings/export` |
| Reporte semanal o mensual automático | **No hay**: es la cola diaria de `/pending` | — |

5. El precio se lee de `DEFAULT_PLAN_AMOUNTS` el **día del envío**: una env var puede pisarlo en producción.

6. **Qué se puede decir sobre la IA (medido el 2-oct en `release-8f07e537`, que es lo que corre en producción).**
   Plataforma va a sumar la IA que redacta cada mensaje del recall: hasta que esté publicada, esto es lo vigente.

| Frase | ¿Es cierta? | De dónde sale |
|---|---|---|
| «Sistema de gestión con IA» | ✅ | Hay IA en los agentes |
| «La IA redacta el mensaje de confirmar, recuperar, cobrar, seguir o reprogramar» | ✅, desde **Crece**: 50 redacciones por mes en Crece, 150 en Profesional, 400 en Clínica | `agents-plantilla.ts` (`PLANTILLA_KINDS`) y `plan-catalogo.ts` (`agentsAiCallsPerMonth`). En producción `AGENTS_LLM=1`, con URL y clave cargadas |
| «Vos lo aprobás; sin tu OK no se usa» | ✅ | Solo corre la `plantillaAprobada` |
| «La IA nunca ve los datos de tus pacientes» | ✅ | Recibe solo el tipo de agente, el nombre del negocio y el rubro |
| «Cada mañana» / «lo detecta sola» | ✅ | Los agentes corren a las 11:00 UTC (07:00 en Bolivia) con el cron `0 11 * * *` del VPS; el log `/var/log/onia-agents-cron.log` dice «OK» el 1-oct. El tratamiento a medias va dentro del Recall |
| «Con tu tono» / «la editás» | ❌ | Escribe en el tono del rubro. El dueño solo puede **aprobarla**: no hay edición en `/agents` |
| «La IA escribe el mensaje del tratamiento a medias» | ❌ | `buildTratamientoAMediasMessage` es un texto fijo |
| «La IA escribe el mensaje» / «la IA lo redacta» (de cada paciente) | ❌ | Catálogo §8: la IA escribe UNA vez el modelo y Onia le pone los datos. ⚠️ La frase «la IA escribe una sola vez el modelo y Onia le pone los datos» **la rechaza el revisor de promesas** (8-oct: liga «IA» con «escribe… mensaje»). Se usa la del catálogo §8.1: «Con IA le propone el texto de cada recordatorio, y usted lo aprueba una sola vez» |
| «Preguntá por tu negocio» es IA | ❌ | Son 30 temas escritos a mano, sin modelo (`BarraAsistente.tsx`) |
| «La IA calcula el costo de importación» | ❌ | El costeo es cálculo; en importadoras la IA solo está en el mensaje de cobro |

   **El kit tiene gate para esto (3-oct).** `scripts/venta-honestidad.test.mjs` corre sobre
   `hermes-content/sales-kit/*.md` las MISMAS formas que vigilan la web
   (`web-factory/apps/onia-platform/scripts/promesa-que-el-producto-cumple.mjs`): la IA que escribe cada
   mensaje, «sale por tu WhatsApp», «agenda por profesional», «entiende las fotos», el sistema que agenda
   solo y el resultado («recupera / te devuelve pacientes»). Nace de que el barrido del 2-oct limpió la web
   y el one-pager siguió diciendo las cuatro primeras. Un renglón que las nombra para prohibirlas
   (sección «Lo que no se dice», ❌, «promete…») no cuenta. Si una frase nueva choca, el texto que sí se
   dice es el de la web: «La IA redacta el texto de cada agente y vos lo aprobás una vez». Un borrador
   suelto (mensaje a un lead, texto de un anuncio) no pasa por ningún gate: guardalo en un archivo y corré
   `npm --prefix web-factory/apps/onia-platform run promesas:revisar -- <archivo>` (sale 1 si promete).
   ⚠️ «Con el tono de tu negocio»: el catálogo §8 lo deja decir y esta tabla dice ❌ (escribe en el tono
   del rubro). Hasta que se resuelva, el one-pager no lo dice.

   Cómo se midió la variable, sin imprimir secretos:
   `ssh onia-vps 'docker exec onia-platform sh -c "echo AGENTS_LLM=\${AGENTS_LLM}"'`.

## 4. Piezas del anuncio (D1 y D4)

> ⏸️ **EN PAUSA (2-oct, tarde).** Sergio Urcullo: *«DEJA DE ARMAR, PRIMERO MIRA LA META ADS LIBRARY Y MIRA
> COMPETENCIAS»*. **Primero el estudio de la Biblioteca** (lo hace la PC: issue `orquesta` + `carril:investigacion` con `donde: pc`; desde la nube Facebook no
> abre), después el diseño. v3 no está aprobada: D4 está frenado por el catálogo (§4.1) y el primer beneficio de D1
> («La IA escribe el mensaje») viola el catálogo §8. Lo de abajo es el MÉTODO de render, no un formato aprobado.

**v3 del 2-oct (sin aprobar), anuncio de software de imagen única** (`briefs/ads/*-d1v3-*` y `*-d4v3-*`, salida en
`carousels/out/ads/…v3…/feed.png` 1080×1350 y `story.png` 1080×1920; hoja para mirarlas:
`carousels/out/ads/onia-platform-dental-meta-v3-hoja.png`).

```bash
node .claude/skills/onia-ventas-pauta/scripts/anuncio-render.js --brief <brief.json> --out <dir> [--formato feed|story|todos]
```

- **Formato = lo que sobrevive en la Biblioteca** (§4.1), no el de la marca personal. De arriba abajo: lockup
  `onia | dental`, «Para dueños de clínicas dentales», titular del dolor, una línea de mecanismo con lo que Onia
  enciende en verde, la pantalla real en un marco de navegador (`app.onia.com.bo/pending`), tres beneficios con
  tilde y un botón «Escribinos por WhatsApp» con la nota «Te lo mostramos con una clínica de ejemplo».
- **Marca de la web, no del panel ni de la marca personal:** letra Archivo (la del sitio y la del logo, en
  `scripts/fonts/`, OFL), hoja `#F4F6F4`, tinta `#12100E`, verde `#027650` solo en la acción, el énfasis y las
  tildes. El lockup sale de `web-factory/apps/onia-platform/public/brand/v2/hires/` (nunca se redibuja).
- **Que se lea en el celular** (la imagen se ve a ~390 px de ancho): el marco muestra la tarjeta real a ~1,2×
  (contexto), y encima van recortes AMPLIADOS de lo que hay que leer: la línea del paciente y su motivo a ~2,1×,
  el botón verde a ~1,9×, el link de reserva a ~1,75×. Son los mismos píxeles de la captura.
  - La caja del recorte puede ser más ancha que el recorte (`box`): el relleno tapa el resto de la fila real
    (botón, «Rechazar») sin dejar ver una franja verde suelta.
  - El fondo de la caja es el de la tarjeta (`#FCFDFC`, medido con `ffmpeg … crop=1:1`). En blanco puro se ve
    la costura.
- **Historias 9:16:** `pad` 250 px arriba y 380 abajo. Meta tapa arriba el perfil y abajo el botón y el texto;
  ahí no va nada.
- **El renderer avisa** si un bloque se sale del lienzo o si dos se pisan. Antes los bloques se encogían en
  silencio y la captura tapaba los beneficios (2-oct, primer render).

Trampas pagadas armando v3 (2-oct):
- **El largo de un recorte se mide renderizando anchos de prueba** (312 / 318 / 322 px) y mirando el borde. A
  ojo, sobre una ampliación 2×, le erré por 14 px y «sin confirmar» salió cortado dos veces.
- Un `<img>` de logo dentro de un flex en columna se estira a todo el ancho: `align-self:flex-start`.
- Mirarlas al lado de la competencia, al tamaño del celular (`qc` de 390 px), mostró que la pantalla quedaba
  chica. Se corrigió agrandando los recortes, no achicando el titular.

> ⛔ **Rechazos anteriores, para no repetirlos:**
> - **v1 (1-oct):** pack `community-editorial`, crema, cinco láminas iguales y la captura en un marco de
>   ~450×300 que no se lee. Sergio Urcullo: *«respeta tus reglas, mira cómo los hace mi marca personal, aprende
>   cómo los hace la competencia»*.
> - **v2 (2-oct):** pack `referentes` de la marca personal (portada de arcilla verde, `ensayo`, `dato`, 7
>   láminas). Sergio Urcullo: *«es diferente el contenido de la onia platform que el de mi cuenta personal, te
>   dije que entres a ads library y veas qué es lo que funciona»*. **Mi error:** leí «mirá cómo lo hace mi marca
>   personal» como «usá su estilo», cuando la referencia de formato era la Biblioteca. Ninguno de los 18
>   anuncios de software capturados es un carrusel editorial.
>
> Las herramientas de carrusel (`carousel_render.js`, `recortar-captura.js`) siguen sirviendo para la marca
> personal y para recortes sueltos; para la pauta del producto, no.

- Títulos, texto precargado y CTA de cada anuncio en `ONIA_ADQUISICION_Y_PAUTA.md` §5.8.
- **Las capturas viajan con el brief**, en `carousels/briefs/assets/onia-1.0-dental-ads/`. Las del 30-sep están en
  `candidato-20260930/`: sus textos están en producción (`release-8f07e537`), pero la pieza igual espera el OK de
  Sergio Urcullo.
- Cada pieza se revisa **renderizada** antes de subirla por el carril autorizado (actualización 9-oct: no esperar otro OK de diseño). La activación de pauta que gasta conserva el OK de presupuesto y canal.

### 4.1 Mirar la competencia antes de escribir (método del 2-oct)

- **Dónde están:** `hermes-content/research/competencia/anuncios/<anunciante>/` + `CAPTURAS-HECHAS.md` (18 de 22,
  capturados desde la PC el 1-oct). La nube no abre `facebook.com`: un pedido nuevo de capturas va como
  issue `orquesta` + `carril:investigacion` con `donde: pc`, con la lista de id (`hermes-content/docs/historial/research/competencia/PEDIDO-CAPTURAS.md` es el formato).
- **La única señal de rendimiento pública es la antigüedad.** `grep -o 'En circulación desde[^\n]*' */*.txt`: lo que
  pasa ~6 semanas al aire sin cortarse le rinde a quien lo paga; lo que tiene horas no prueba nada, por prolijo
  que se vea. **Se aprende de los que sobreviven, no de los más nuevos ni de los más lindos.**
- **Qué tienen los 7 de software que sobreviven** (17-jul a 17-ago): todos tienen una **persona** (6 videos y un
  estático), **ninguno es sólo pantalla**; la primera línea le habla al **dueño de su plata o su tiempo**; el
  líder no titula con IA; CTA único a cuenta gratis o demo, sin precio en la pieza; ninguno va a WhatsApp.
- **Qué se copia y qué no:** se copia el **orden** (plata del dueño → mecanismo → un CTA). No se copian sus cifras
  («25 % de los ingresos» es de ellos, no medido por Onia), ni testimonios, ni «+4000 doctores» (cero clientes).
  Ningún material de venta nombra a la competencia.
- **La brecha que queda** es una pieza con persona: Sergio Urcullo mostrando la pantalla, o un presentador IA sólo
  si él lo pide (skill `ugc-empresas-higgsfield`, gasto aprobado).
- **Antes de prometer una función, mirar QUÉ corre en producción, no lo que dice un doc:** `ssh onia-vps 'docker ps
  --format "{{.Names}} {{.Image}}" | grep onia-platform'` da el release; el commit se lee en el clon de
  `onia-platform`, y una frase de la pantalla se busca en el bundle servido (`docker exec onia-platform grep -rl
  "<frase>" /app/.next/server`). ⛔ **Pero «está en producción» no es «se puede prometer».** El 2-oct vi
  el código del tratamiento a medias en el bundle y escribí «D4 se puede prometer»: el detector existía y no
  encontraba a nadie (cuenta «En progreso», la ficha carga «Pendiente», 0 cargados). **Qué se puede decir lo fija
  `ONIA_CATALOGO_DE_VENTA.md`** («Se puede decir» / «NO se puede decir», §8 para la IA). Se lee ANTES de escribir
  una promesa, y lo que no está ahí se pide a Plataforma que lo mire funcionando.
- **Mapa de toda la competencia (SaaS, ERP y bots):** `hermes-content/research/competencia/MAPA_COMPETENCIA.md` +
  sus fichas (3-oct). Leer «Lo que cambia decisiones» antes de elegir el ángulo de una pieza. De ahí:
  - **«Qué pacientes tienen que volver» ya es el gancho de Agenda en Día y Eholo.** El de D4 es otro: el
    tratamiento EMPEZADO y presupuestado que no se cobró. D4 sigue congelado por el catálogo (§8) hasta que el
    detector encuentre pacientes en producción; al descongelarlo se mantiene ese ángulo y no se pasa al de «recall».
  - D1 (cita sin confirmar) no choca con ese gancho.
  - **Comercio e importadora: sin pauta hasta tener la factura del SIN.** Mi Factura Bolivia (Bs 320) y Control
    Facilito (Bs 772) ya la traen en el plan.
- **El umbral del tratamiento a medias es «21 días sin venir»** (`diasSinVenir`), con el tratamiento en curso y
  sin cita futura. «21 días en progreso» o «21 días sin cita» son inexactos: corregido en D4 el 2-oct.

### 4.2 v5 del 8-oct: plantilla `bloques`, video y por qué v4 era básica

> Sergio Urcullo, 8-oct: *«los diseños… demasiado básicos… mejora tus trabajos»*. Comparación completa con la
> competencia: `hermes-content/research/competencia/anuncios/COMPARACION-DISENO-8OCT.md`.

- **Por qué v4 era básica (diagnóstico):** una losa de texto sobre hoja clara; ningún foco visual; la pantalla real
  chica y con sus recortes pisando la barra del navegador; tres tildes genéricas. Los que sobreviven tienen UN foco
  enorme (un número, una cara), un campo de color y el producto en grande.
- **Plantilla nueva** `"plantilla":"bloques"` en `anuncio-render.js` (la vieja sigue sin cambios): cabecera sobre hoja y
  panel de **tinta** `#0C110F` (paleta de la marca; los degradados están prohibidos). Bloques: `hora {valor, rotulo, chip}`
  (el gancho; el chip usa el amarillo real del «Pendiente» de la app, `rgb(254,249,194)` / `rgb(137,75,0)`, medido en la
  captura), `flecha {texto}`, `tile {crop, width, anillos:[[x,y,w,h] en px de la CAPTURA]}`, `leyenda`, `texto`.
  Briefs: `carousels/briefs/ads/…a1v5-las-diez.json` y `…a2v2-el-saldo.json`.
- **Video:** `scripts/anuncio-video.js --brief … --out …` anima la misma pieza (9:16, 11 s, sin audio): fija el reloj de
  la Web Animations API en cada cuadro, saca JPG con Chromium y los une con ffmpeg (los dos están en la nube; 33 s de
  render). **El titular tiene que estar en el cuadro 0**: es la miniatura que Meta muestra antes del play.
  Tiempos en `video.tiempos` del brief.
- **Anillos:** el recuadro se calcula con las coordenadas de la captura × el factor de escala. Primera vez un anillo
  cruzó el nombre del paciente por 6 px de margen: **un anillo no puede invadir otra línea de texto**; se baja el margen
  o se saca el anillo (los de v5 quedaron solo en el mensaje y el botón).
- **Historias 9:16:** el panel + `ctaBottom` no pueden sumar más que el lienzo; el renderer avisa «se sale del lienzo:
  panel». Con `ctaBottom` 250 el botón queda a ~263 px del borde, fuera de lo que Meta tapa.
- **Lo que NO arregla el diseño:** la persona (los 7 que sobreviven la tienen) y el rendimiento (sin gasto no hay cifras).
- **Las dos capturas de una misma pieza tienen que ser de la MISMA persona de demo.** Hoy la agenda y Pendientes son de
  capturas distintas del 30-sep; con la cuenta demo se arma el caso entero (agenda → pendiente → mensaje).
- **Biblioteca desde la nube:** HTTP 403 de Facebook (8-oct). No se rodea; se captura desde la PC (issue `orquesta` + `carril:investigacion` con `donde: pc`). Los sitios de
  referencia sí abren con la receta de Playwright del §6, salvo Doctolib (Cloudflare «verifique que es humano»).

### 4.3 Laboratorio de creativos (8-oct): los 5 formatos que SOSTIENEN y cómo se hace cada uno

> Pedido de Sergio Urcullo: *«aprender a hacer campañas mirando a la competencia, y que sea real»*. Documento:
> `research/competencia/anuncios/FORMATOS-QUE-SOSTIENEN.md`.

- **Método:** ordenar los `.txt` de `anuncios/` por «En circulación desde» (`grep -m1 -o "En circulación desde el [0-9]* [a-z]*\.* [0-9]*"`) y
  mirar los fotogramas en hoja de contacto (`montage … -geometry 260x460`). Lo único público es la antigüedad; **no prueba rendimiento
  y las capturas del 1-2 oct no prueban que sigan vivas** (se pide como issue `orquesta` + `carril:investigacion` con `donde: pc`).
- **Lo que enseñaron (8-oct):** de los 5 formatos más viejos, **4 llevan una persona**; el más viejo (Dt.Dental, 100 d) es un selfie sin
  producción; ninguno lleva precio ni cifra propia; ninguno va a WhatsApp. El copy **«No es X, no es Y… Es Z»** de CitaPro sostiene
  3 anuncios (83, 63 y 23 d).
- **Código:** plantilla `bloques` para estático (`--formato feed|story|cuadro`), `anuncio-video.js` para video (`video.duracion` y
  `video.tiempos` en el brief) y carrusel = una lámina por brief con `pagina` («1 / 4») y sin `cta` salvo la última. El cuadrado 1:1 es el
  de las láminas de carrusel: `todos` NO lo incluye.
- **Dos formatos de ventana:** el titular **tiene que estar en el cuadro 0** del video; en la historia, nada de logo ni botón en los 250 px
  de arriba ni en los de abajo.
- **Trampas de esta tanda:** (1) el chip «Sin confirmar» se partió en dos líneas al agrandar el número (`white-space:nowrap`);
  (2) el control «pisa» marcó falso positivo con el paginador absoluto (ahora ignora lo `position:absolute`); (3) el control de
  seguridad de Claude Code **bloquea `rm -f $VAR/*`**: usar rutas literales o sobrescribir los archivos con el mismo nombre.
- **Higgsfield:** se cotiza con `higgsfield generate cost` desde la PC (CLAUDE.md); desde la nube no se cotiza ni se genera.


### 4.4 Grabar la app y armar el corto del VSL (9-oct)

- **`scripts/grabar-captura.mjs`:** plan en JSON (`ir`, `esperar`, `mover`, `anillo`, `foto`, `clic`) → `.mp4` H.264 de la app con cursor grande y anillos, más fotos
  PNG y un `.log.json`. Esqueletos: `grabar-captura.vsl-dental-C1-C7.plan.json` (solo mira) y `…-C2-clic.plan.json`. Probado contra una página local; **la app real
  no se probó** (falta la cuenta). Trampas que ya pagué: (1) el cursor es un `<div>` y **cada página nueva lo reinicia**: la posición viaja en `sessionStorage`;
  (2) la punta cae al 80 % del ancho y 65 % del alto del elemento, no al centro: en el centro tapa el texto; (3) el video empieza al abrir el contexto: se recorta
  con `t0_ms` (el login queda fuera); (4) contra `127.0.0.1` no se pasa el proxy de la nube; (5) las fotos **traen el cursor y los anillos**: para una captura limpia
  no se pone `anillo` antes de la `foto`.
- **Frenos, y por qué (aprendido el 9-oct):** el VSL avisa que un clic en «Aprobar» puede mandar un mensaje de verdad. **Mi primer borrador adivinaba el botón peligroso por su texto y un
  revisor independiente lo saltó seis veces**, todas reproducidas en una página local: `<input type=submit value="Aprobar">` (el `innerText` es vacío), «Aprobá» (la UI habla en voseo y la regex
  no), un selector que apunta a otro botón, `--base=URL` con «=» (se ignoraba y caía a producción con el login real), una regex de correo de subcadena (`aqarias@`, `latest.perez@`) y un
  `ir` a `/api/…` (un GET que muta). **Lección: un freno por el texto de la interfaz falla abierto; el freno sólido es no depender de él.** Hoy: todo clic exige `"envio": true` +
  `ONIA_GRABAR_PERMITE_ENVIO=1`; el selector da exactamente un elemento y el clic cae sobre él; `--base` con lista de hosts; rutas sin `//`, `@` ni `/api/`; el login en `try/catch` que solo
  imprime la primera línea (el «Call log» de Playwright puede traer lo que se escribía) y borra el `.webm` si falla. Probados los 14 caminos. **Regla del carril: un script que puede cambiar
  datos de producción pasa por un revisor que no lo escribió antes de mergearse.**
- **`scripts/vsl-animatic.mjs`:** tabla JSON de tramos → láminas PNG y un preview de 360×640 del largo exacto (con la pantalla marcada «Falta la captura aprobada»). Es para que
  Sergio Urcullo vea el ritmo **antes** de grabar o cortar; no es el video. Caso: `carousels/briefs/ads/VSL-CORTO-TABLA-DE-CORTES.md`. Trampa: el demuxer `concat` de
  ffmpeg resuelve las rutas relativas contra la carpeta de la lista, no contra el cwd: se le pasan rutas absolutas. Otra: `page.setContent` corre en `about:blank` y Chromium **no deja cargar la fuente local** (sale en Arial sin avisar); se escribe el HTML a un archivo y se abre por `file://`, y se comprueba con `document.fonts.check`.

## 5. La campaña de Meta

- **1-oct, 21:00 UTC: el conector YA ve ONIA Ads** (`1073680778314945`, negocio «OniaAgency», `is_ads_mcp_enabled`),
  pero con **`has_payment_method: false`**. Sin la tarjeta no se crea nada, ni en pausa. También aparece la cuenta
  personal «Sergio Urcullo» (`679613631427810`, USD, con tarjeta): **no se usa para Onia** sin su decisión.
- **Para saber si la página sirve, se usa `ads_get_user_pages`, no `ads_get_ad_account_pages`.** Este último solo
  lista las páginas que la cuenta ya promocionó: en ONIA Ads, que nunca pautó, devuelve `[]`. El 1-oct a las 21:15
  lo leí como «página sin vincular» y se lo dije a Sergio Urcullo; a las 21:40, `ads_get_user_pages` y
  `ads_get_pages_for_business` (`1451773736711697`) listaban «Onia» (`1140384625819526`). ONIA Ads no tiene ninguna
  cuenta de Instagram vinculada (`ads_get_ig_accounts` → `[]`).
- Antes de esa hora, el conector `Meta_ads` veía otra cuenta de Facebook («NUVO 1usd», «Arthur Fuentes»). A las
  20:15 UTC ONIA Ads todavía no aparecía. Primero `ads_get_ad_accounts`; si no lista `1073680778314945` con
  `has_payment_method: true`, no sirve para crear. Lo destraba Sergio Urcullo reconectando el conector con
  el usuario que administra ONIA Ads.
- **Pasos para crearla en pausa:** `ONIA_ADQUISICION_Y_PAUTA.md` §5.8.1.
- ⛔ **`ads_create_ad` trabaja en modo borrador** (leído el 1-oct): los anuncios quedan en DRAFT, y
  **`ads_activate_entity` sobre la campaña los publica en ACTIVO, gastando.** Solo se llama con el OK escrito
  de gasto (fila 9 de §5.9).
- `client_conversation_id` es obligatorio en cada llamada: 20 caracteres, y el mismo en toda la conversación.
- Presupuesto en centavos de USD: **USD 56 = `5600`** (Bs 750 de techo de Meta, plan 1.0 §3), como presupuesto total
  de la campaña con fecha de fin. «USD 140 / 14000» era del 30-sep y **ya no vale** (corregido el 8-oct).
- **El techo de la pauta lo fija `ONIA_PLAN_1.0_Y_CAJA.md`, no `ONIA_ADQUISICION_Y_PAUTA.md`.** El 8-oct esa fuente
  decía USD 10/día (USD 140, ≈ Bs 1.600), más del doble de los Bs 750 de la caja. Dos docs con dos techos es el error
  que la regla «una sola fuente de verdad» existe para evitar: ante la duda, manda el más nuevo y el que cuenta la caja.
- **Qué NO ve el conector de Meta (8-oct):** el número de WhatsApp vinculado a la página (lo mira Sergio Urcullo en
  Business Manager); los benchmarks de una cuenta sin gasto (`ads_insights_industry_benchmark` →
  «No industry benchmark data»; `ads_insights_advertiser_context` → «Vertical: \N»). Los costos de la campaña son
  supuestos hasta la semana 1.
- **El píxel se mira con `ads_get_datasets`** (`ONIA Web` `1012611478191231`, `last_fired_time`): dispara el 8-oct.
  Meta rechaza un **límite** de gasto menor a USD 100.

### 5.1 Seguimiento por WhatsApp y remarketing (medido 3-oct; playbook `sales-kit/SEGUIMIENTO-LEADS.md`)

- **Una plantilla no lleva audio.** Encabezados válidos: texto, imagen, video, documento, ubicación (docs de
  Meta). El audio de Sergio Urcullo va como VIDEO (voz sobre una captura fija, MP4 H.264 + AAC, ≤16 MB) o, con la
  ventana de 24 h abierta, como nota de voz suelta.
- **Las plantillas a leads salen desde la bandeja de Chatwoot con el usuario de Sergio Urcullo.** Así el bot se
  calla (traspaso de `chatwoot-adapter.mjs`). Si salen por envío automático, el botón que toca el lead le llega al
  bot y contesta con su guion.
- **Contar los leads «hoy» no se puede desde la nube (8-oct).** No hay llave del VPS, ni token de Chatwoot, y el conector
  de Gmail da «Precondition check failed». El conteo de una corrida (pedidos de acceso, respuestas humanas en Chatwoot y
  plantillas sincronizadas) está en `ONIA_LEADS_ESPERANDO.md`, «Conteo de hoy en una sola corrida». Se le pide a la
  PC, y no se redacta sobre el número heredado.
- **Las plantillas aprobadas se leen en `channel_whatsapp.message_templates` de chatwoot-db**, con la fecha de la
  última sincronización. Ningún conector de Meta las lista: el de desarrolladores solo ve la configuración de las
  apps.
- **La llamada gratis de 20 min es `sergiourcullo.vercel.app/llamada`,** que redirige a `cal.com/sergiourcullo/20min`
  («Llamada 1 a 1», 200 el 8-oct). `onia.com.bo/llamada` da 404.
- **Público personalizado con un puñado de teléfonos: no.** Meta recomienda al menos 1.000 personas y exige base
  legal para subir la lista. Para menos de 100 leads, el remarketing es la secuencia de plantillas (≈ USD 0,074
  cada una, `usage-run.mjs`).
- **Un borrador viejo puede quedar en contra del catálogo.** El de «F» del 1-oct contestaba «sí» al tratamiento a
  medias, y el catálogo lo prohibió el 2-oct. Antes de mandar un borrador guardado, se lo compara de nuevo.
- **Un playbook nuevo no borra el borrador viejo: hay que sacarlo (5-oct).** El playbook del 3-oct reemplazó los
  mensajes del 1-oct, pero `ONIA_LEADS_ESPERANDO.md` §3 los siguió mostrando como «esperan el OK» dos días más. Al
  reemplazar un texto, el viejo se borra en el mismo commit; queda en el historial de git. Antes de reescribir un
  borrador, buscar si otro doc ya lo reemplazó: `grep -rn '<nombre del lead>' hermes-content/sales-kit/`.
- **El gate del kit lee cualquier «Bs N» como precio al cliente (5-oct).** El costo interno «≈ Bs 17» del playbook
  dejó en rojo `npm run test:venta-honestidad` en `main`. Un costo propio va en USD, que es lo que cobra Meta; el
  cambio del banco sigue sin medir. Después de tocar `sales-kit/`, correr ese test.


### 5.1 La campaña como archivo ejecutable (10-oct)

- **`carousels/briefs/ads/CAMPANA-1-LISTA-PARA-CREAR.json`** es la campaña prueba 1 con los parámetros exactos del conector, el copy de usted, el público,
  US$ 4 × 14 días, los cortes de los días 3/7/14 y la respuesta del bot. **Los números mandan en `ONIA_ADQUISICION_Y_PAUTA.md`; el JSON, en la forma.**
  `scripts/campana-lista.test.mjs` (11 pruebas, en `npm test`) los cruza con el doc, con el conocimiento del bot y con el detector de promesas.
  Si una cifra cambia, se cambia en los dos y el test dice cuál quedó vieja.
- **«Crear en pausa» no existe en `Meta_ads`:** crear deja BORRADORES y `ads_activate_entity` los publica en ACTIVO. Pausa = borrador; encender = el último paso.
  Nada se crea antes del OK de Sergio Urcullo, y ese OK solo vale **escrito en la sesión que crea** (CLAUDE.md, 10-oct).
- **El código del anuncio es letra(s) + número y NADA más.** El 9-oct puse `D1V` y `D1S` a los anuncios del video y del selfie: el motor del bot
  (`bot-engine.mjs`, `conCodigoDelAnuncio`, `/\(\s*([a-z]{1,2}\d{1,2})\s*\)/`) no los lee y **el lead nace sin origen, sin que nada se ponga rojo**. Lo vi al
  probar el motor real con cada código (`D1V → pieceKey null`; `D1`, `D2`, `D3`, `D5 → anuncio-D…`). Hoy: A1-E `D1`, A1-V `D2`, A1-S `D3`, A2 `D5`, carrusel `D6`.
  **Método:** un código nuevo se prueba con `step()` del motor, no se razona desde la regex; el test lo hace por cada anuncio del JSON.
- **No se agregan al doc de la pauta precargados nuevos entre backticks** (`` `Hola, vi el anuncio de Onia (D2)…` ``): `frase-de-la-pauta.test.mjs` fija que el doc traiga EXACTAMENTE
  D1 y D4, y es un gate del deploy del bot. Los códigos nuevos viven en el JSON.
- **Lectura de solo lectura de la cuenta (10-oct):** `ads_get_ad_accounts` (tarjeta), `ads_get_datasets` (píxel, `last_fired_time`) y `ads_get_ad_entities` con
  `object_state=draft` (borradores) bastan para medir las filas 3 y 8 del go/no-go sin crear nada. «Probar eventos» y el WhatsApp vinculado a la página **no** los ve el conector.
- **Un JSON que va a gastar plata pasa por un revisor que no lo escribió (10-oct).** Lo revisó un subagente contrastándolo con los esquemas de `ads_create_*` y encontró 10 cosas reales:
  (1) **sin `instagram_user_id` el anuncio NO sale por Instagram** (el esquema lo dice) y ONIA Ads no tiene IG vinculado: los US$ 56 corrían solo por Facebook y yo había puesto posiciones de Instagram;
  (2) **el `nota` del brief se RENDERIZA en la imagen** («Se lo mostramos en una llamada de 20 minutos»): al revisar un anuncio se lee TODO el texto de la imagen y no solo el `caption`; el bot y `/contacto` dicen 30 min (L-04);
  (3) la pieza había perdido el filtro «Para dueños y dueñas…» (§5.2), que es lo que frena a los pacientes que buscan turno: quedó en el kicker y en la primera línea del texto;
  (4) la captura muestra «Enviar yo mismo por WhatsApp» (G-03 🟡): la captura nueva sale sin ese botón o con G-03 en ✅;
  (5) «sistema de gestión con IA… le deja anotado a quién escribirle» roza el catálogo §8: el «a quién» sale de reglas, no de la IA; se sacó «con IA» del texto;
  (6) a la lista de condiciones le faltaban «quién contesta», la duración de la llamada y «canales 1 y 2 contactados» (CAJA §3).
  **Método:** el texto del anuncio vive en el brief (`caption`) y el JSON lo copia; `campana-lista.test.mjs` exige que sean iguales, que cada marcador `{{…}}` salga de un paso anterior y que cada condición definida se exija.
- **Hallazgo al leer el bot (10-oct):** el primer mensaje del bot ofrece una demo de **30 minutos**; el VSL y el CTA dicen **20** (L-04). No se promete un número de minutos
  en un anuncio hasta que lo unifique Sergio Urcullo.

## 6. Qué bloquea la nube (y qué no)

| Qué | En la nube «Default» (30-sep y 1-oct) | Cómo se resolvió |
|---|---|---|
| `facebook.com`, `instagram.com`, webs de clínicas, buscadores | 403 del proxy | La Biblioteca por el conector; para mirar páginas, el entorno `onia-higgsfield` o la PC |
| **Entorno «Default» con red completa (1-oct, noche)** | Las webs, los directorios y los buscadores abren. **`facebook.com` redirige al login** con `curl` y con Chromium. Abrir Instagram, `wa.me` o Maps con Chromium **lo bloquea el control de permisos**: no se reintenta por otro lado | Webs propias, el directorio por `page_id` (§2) y la Biblioteca por el conector. Lo que solo se ve dentro de Facebook (cuántos atienden, el texto del anuncio) se mira desde la PC |
| VPS y base de producción | sin llave (`ONIA_VPS_SSH_KEY_B64` vacía) | lo mide la sesión principal en la PC (la infra tiene un dueño a la vez) |
| `SendMessage` a otra sesión | falla: la nube no puede mandar | se contesta en el propio transcript; lo que necesita la PC va como issue `orquesta` con `donde: pc` |
| `ssh onia-vps` después de reiniciar la sesión (2-oct) | El hook deja la llave y la config, pero **falta el programa `ssh`** | `apt-get install -y openssh-client` |
| Cupo de búsquedas web | 200 por sesión; se agotó con 4 subagentes | Darle a cada subagente un tope. El 1-oct, de noche, 4 subagentes con 25, 30, 20 y 12 búsquedas verificaron 28 prospectos y 9 de reserva, y usaron el tope completo |
| Fuentes de Google en el render | no bajan | `scripts/carousel_cloud_setup.sh` instala TTF locales |
| **Playwright contra nuestros dominios (8-oct)** | `ERR_CERT_AUTHORITY_INVALID` con el headless shell, con Chromium completo y aun con el proxy | Chromium completo (`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`) + `proxy: HTTPS_PROXY` + `--ignore-certificate-errors-spki-list` con la huella SPKI de las CA «O = Anthropic … production» de `/root/.ccr/ca-bundle.crt` (la misma confianza que usa curl). Ya resuelto en `scripts/auditar-app.mjs`. Con eso, onia.com.bo y la app dan 200 |
| `send_message` a la sesión de la PC (8-oct; historia: ya no hay «madre» que ordene a otras) | `elevated_session_untrusted_device`: no sale | Se contesta en el transcript; el trabajo de fondo se pide como issue `orquesta` |

## 6.1 Promesa contra lo que funciona (8-oct)

`hermes-content/docs/ONIA_PROMESA_VS_PRODUCTO.md` es la compuerta para volver a contactar: su §2 lista lo que prometen
los mensajes de la §6.9, y nada sale hasta que esas filas estén en ✅. Antes de escribir un mensaje nuevo, su promesa
tiene que estar en esa tabla y en ✅. Para mirar la app por dentro: `scripts/auditar-app.mjs` (solo lectura, cuenta de
prueba en variables de entorno). Trampa: el texto que devuelve `innerText` trae los nombres de los iconos
(«credit_card_off»), pero en pantalla se ven bien. Se mira la captura, no el texto.

## 7. Después de cada demo

Anotar las objeciones **el mismo día**: `ONIA_PROSPECTOS_DENTAL_SCZ.md` §7, o «Registro de objeciones» al final
de `ONIA_PROSPECTOS_OTROS_RUBROS_SCZ.md`. Regla del plan de 14 días: **si tras 10 demos nadie quiere pagar, se
cambia el producto, no el discurso.**

⚠️ **Hoy (1-oct) no hay cuenta demo en producción** (`02-GUION-DEMO.md` §0.1). Sin ella no hay demo: es lo
primero que se resuelve con Sergio Urcullo y Plataforma.

## 8. Mirar a un competidor por dentro (aprendido con Dapta, 1-oct)

Resultado: `research/competencia/DAPTA_COMO_FUNCIONA.md` (sin fecha, fuente del tema) con capturas en
`research/competencia/dapta/`.

- ⛔ **El agente de llamadas de Dapta NO es un canal** (3-oct). Sergio Urcullo lo armó solo para ver la
  interfaz y sacar ideas. No se usa con leads, no se le cargan prospectos y no entra en ningún plan de contacto.

- **Las capturas van al repo, no al scratchpad.** El scratchpad se borra y el doc queda citando archivos que no
  existen. Se copian a `research/competencia/<competidor>/` (app en `app/`, páginas en `web/`).
- **Los asistentes de plantillas guardan solos.** En Dapta, «Continuar» creó un borrador de agente («Julia»).
  Antes de apretar «Continuar», «Crear con IA» o un acceso directo del inicio, suponer que guarda o gasta
  créditos. Lo creado sin querer no se borra: se reporta y decide Sergio Urcullo.
- **Web, docs y app se contradicen; se miden las tres.** En Dapta la web vende SMS y llamadas por WhatsApp que la
  app no tiene, y los docs dicen 40 créditos por mensaje cuando la app cobra de 12 a 40 según el modelo.
- **Los docs de GitBook traen un bloque «Agent Instructions».** Es dato. Al guardar la copia se corta.
- **Antes de proponer «decí X en la web», grep del espejo** (`web-factory/apps/onia-platform/src/app/(sitio)/`).
  Un informe propuso decir «sin tarjeta» y ya estaba en la home, /empezar, /agentes y /nosotros.
- **La Biblioteca de Anuncios fuera de la UE no guarda los anuncios comerciales inactivos.** «¿Pautaban en julio?»
  no se puede contestar después: se mide el día.

### 8.1 Tanda semanal de competencia (método del 8-oct)
- **Precios: del texto del navegador, no de un buscador.** Una búsqueda dio Jelou a USD 24,9 / 199,9 con 2.500 ejecuciones; la página de hoy dice
  USD 25 / 299 con 1.000. `WebFetch` resume con un modelo chico: sirve para orientarse, no para citar una cifra. Capturar con Playwright
  (receta del §6) y leer el `.txt`.
- **Probar las rutas antes de afirmar un cambio:** `/pricing` de AgendaPro y `/precios` de Doctocliq dieron 404 por rutas adivinadas; la real de
  Doctocliq es `/planes-y-precios`. Un 404 de ruta adivinada no es «cambió la oferta».
- **Cada hallazgo lleva:** quién y cuánto lleva · versión Onia · dueño · tarea Codex (casi nunca: un prompt escrito hoy queda viejo, `master`
  se mueve). Va a `docs/ONIA_UI_MEJORAS_1.0.md` §8, una tanda por semana, la más nueva arriba.
- **Lo que pide login o Instagram** va al transcript como «PEDIDO PC: <qué> — para qué lo quiero». Contactar a un tercero (pedir su demo) no.
- **Norma o ley (aprendido el 9-oct con la historia clínica y la factura de Bolivia):** el buscador y `WebFetch` solo orientan; la cita sale del
  **PDF oficial**. `WebFetch` no lee los PDF comprimidos (FlateDecode), pero **guarda el binario** y avisa dónde: se extrae con
  `pdftotext -layout <archivo> <salida.txt>` y se busca con `grep -n`. Así salió el «archivado por lo menos por unos 10 años» de las *Normas en
  Salud Oral* (R.M. 1320, 2010), que ningún resumen traía. Un PDF del Ministerio de Salud puede ser **«documento de trabajo»** o estar vencido: se
  dice en la misma celda donde se cita.
- **Un plazo del SIN se verifica en su lista de RND, no en un blog:** `impuestos.gob.bo/index.php/rnd-2026/` lista número, fecha y título. El
  9-oct el buscador dio la abrogación de los grupos 9-12 como dato de un tercero; el **título** en la lista oficial (RND 102600000038, 30-sep)
  lo confirmó, pero **el texto no se leyó**: lo que viene después («el SIN asignará la modalidad periódicamente, sin fecha») queda marcado como
  dicho por un tercero. Con eso no se escribe «desde el 1 de octubre debe facturar en línea»: era la lectura de la RND 102600000007 y quedó vieja
  a las 24 horas. Una urgencia de fecha en un anuncio se prueba contra la lista oficial el mismo día que se publica.
- **Una norma como titular se separa en tres capas antes de usarla:** qué dice el texto (cita), a quién alcanza (¿consultorio privado? ¿odontólogo
  o solo médico?) y si sigue vigente. Si falta una capa, el titular es una pregunta, no una afirmación, y pasa por Sergio Urcullo antes de salir.

### 8.2 Contenido, pauta y comunicación de un competidor (método del 8-oct, 15 competidores)
Resultado: `research/competencia/COMUNICACION_Y_PAUTA_COMPETENCIA.md` (síntesis) + la sección «Contenido, pauta y comunicación»
de cada ficha. Cinco subagentes en paralelo, uno por grupo, y después un verificador por grupo que re-midió cada cifra.
- **Videos, en este orden:** (1) `ver-videos/scripts/gemini-see-video.mjs`: el 8-oct dio **429 de cuota** en casi todo. Con
  «exceeded your current quota» no se reintenta. `GEMINI_MODEL=gemini-flash-lite-latest` sí corrió (AgendaPro, CitaPro, Calendico),
  pero lee peor la letra y los subtítulos. (2) Sin Gemini: subtítulos automáticos (`yt-dlp --skip-download --write-auto-subs`) +
  fotogramas leídos con visión. (3) Catálogo con `yt-dlp --flat-playlist --print "%(id)s|%(title)s|%(view_count)s|%(duration)s"`.
- **YouTube bloquea la bajada** desde esta IP (PO token, 429, «confirma que no eres un bot»). Lo que funcionó sin cookies:
  el cliente `android` de yt-dlp (`--extractor-args "youtube:player_client=android"`) para MP4 de 360p, sobre todo shorts;
  el cliente iOS + `--ignore-no-formats-error` para subtítulos y metadatos; y el **storyboard de YouTube** como fotogramas
  (1 por segundo, 101x180 en vertical y 320x180 en horizontal). Los subtítulos vuelven a dar 429 tras pocas consultas: espaciar.
- **TikTok:** yt-dlp baja el video y a veces lista el perfil (Leadsales, 300 videos; CitaPro sí el 7-oct y no el 8-oct). La voz se
  transcribe en local con faster-whisper. Los seguidores salen de la página pública.
- **Instagram:** login y 429. Solo `WebFetch` del perfil público (seguidores y una grilla sin captions). No se corre ig-radar.
- **Biblioteca (`ads_library_search`):** se busca **por `page_id`**, no por texto (el texto mezcla anunciantes y no prueba que alguien
  no pauta). Bolivia se mide con el filtro de país, un país por consulta. Trampas medidas: da como máximo 50 resultados y no
  pagina, así que los conteos por titular son mínimos (Jelou: 382 activos, 50 visibles); en AgendaPro «activos» y «todos»
  devuelven lo mismo; el filtro de inactivos devolvió 0 en Leadsales, que sí tiene anuncios viejos; con filtro de país cuenta
  distinto (Leadsales: 55 sin filtro, 30 con MX); y el «estimated_total_count» se mueve entre consultas. No da texto, creativo,
  botón ni destino, y Facebook da 403 por curl: **los creativos se capturan desde la PC** (issue `orquesta` + `carril:investigacion` con `donde: pc`, con ids, §7 de la síntesis).
- **Lectura:** la única señal son los días al aire. Quien rota a diario (Dapta, Clinera) no da señal. Vistas altas con pocos
  likes (Kommo, 357 mil con 28) = probable pauta, no orgánico.
- **Trampas que hicieron caer cifras al verificar:** una ventana de 60 videos no es el canal (Leadsales: el de 4,5 M estaba
  fuera); los listados redondean las vistas de más de 1.000; los tiempos por tramo se corren unos 10 s si no se re-leen los
  subtítulos (Lety); el valor de un contador animado no es un ejemplo fijo (hero de Lety); un porcentaje derivado
  («los tres primeros hacen el 94 %») se recalcula con el catálogo completo.
- **«Vi el video» se dice con cobertura:** por pieza, «subtítulos y cuadros», «solo subtítulos» o «solo cuadros». Dos cuadros no son un video.
- **Cada «toma» lleva dónde va y su evidencia** (id del video o del anuncio). **Antes de escribir la versión Onia, se cruza con
  `ONIA_PROMESA_VS_PRODUCTO.md`.** Caso: la ficha de Lety propuso un reel «conectá tu WhatsApp → cobrá por QR», y las dos están
  fuera de lo que se promete (J-* ❌, y el QR es para pagarle a Onia).

## 9. Anuncio que vende, de punta a punta (método del 8-oct)

> Pedido de Sergio Urcullo (8-oct): *«quiero que aprendas a hacer anuncios que venden, ayudame a hacer mi VSL, mis
> campañas»*. Esta sección junta lo medido en §2-§8 con lo aprendido ese día de 14 videos de venta (subtítulos, sin
> imagen) y de los repos públicos de copy. Seis pasos; **no se salta ninguno**. Piezas ya escritas con este método:
> `sales-kit/06-VSL-DENTAL.md` (Onia, de usted), `references/marca-personal/VSL-ASESORIA-GRATIS.md` (marca personal,
> de vos) y el plan de campañas en `ONIA_ADQUISICION_Y_PAUTA.md` §5.11.

### 9.1 Investigar (antes de escribir una línea)

- **Competencia en Meta:** Biblioteca por `page_id` (§8.2) y las capturas desde la PC (§4.1). La única señal pública es
  la **antigüedad**: se aprende de lo que dura más de 30 días, no de lo nuevo ni de lo lindo (§4.1, 2-oct).
- **Lo que repiten los que duran** (`research/competencia/COMUNICACION_Y_PAUTA_COMPETENCIA.md` §2, 8-oct): un concepto
  en 2-5 copias; una persona en cuadro con poca producción; la primera línea habla de la plata o el tiempo del dueño y
  nombra su rubro; producto real; un solo CTA de baja fricción; tandas nuevas cada 2-4 semanas.
- **VSL de referencia (medidos el 8-oct por subtítulos, sin ver imagen):** Gadzhi `pPpb4t2eV2M` (45 min, 76 % enseña
  y demuestra, la oferta entra al 80 %); Hormozi `qsXxckCbci0` (la venta son 80 s al 21 % de un video educativo),
  `Mst4hreQYl0` (imán de leads y escasez por capacidad real) y `pxVeOkOVr2w` (oferta: creíble, retorno claro, negocio
  detrás de lo gratis); nicho dental: Dentalink `kUgUqHQ83ww` y `EWEv30Q-tm4` (demo por beneficio, sin precio),
  Doctocliq `M9Dc_C6XP48` (spot de 2 min con plan gratis), AgendaPro `prAcMK4yt8c` (el dueño cuenta su caso).
  **En software clínico en español no apareció ningún VSL clásico** (precio + garantía + urgencia): se vende con demo
  y prueba gratis. El VSL largo de oferta es de infoproductos y coaching de ticket alto.
- **Cómo se bajan sin navegador:** `ver-videos` (§8.2). Subtítulos con `yt-dlp --skip-download --write-auto-subs
  --extractor-args "youtube:player_client=android"`; los traducidos dan 429: solo los originales. **Lo que se baja va
  al repo** (`references/video-intake/`), nunca solo al scratchpad: se borra.

### 9.2 Ángulo y promesa verificada

1. **Un dolor del dueño con consecuencia en plata o tiempo**, en su rubro: «un paciente que no confirma es un sillón
   vacío», «un cobro que nadie recuerda es plata que no entra». Si el copy sirve igual para cualquier negocio, se
   rechaza (CLAUDE.md, «Publicidad que no parezca hecha por IA»).
2. **Cada frase se ata a una fila de `ONIA_PROMESA_VS_PRODUCTO.md`** y se escribe en una tabla `frase | fila | estado`.
   Solo sale lo que está en ✅. Lo ⬜ se escribe marcado **«cuando esté en verde (fila X)»**; lo ❌ no se escribe.
3. **Lo que está en ✅ al 8-oct (19 filas), y es todo lo que hoy se puede decir:** 5 rubros (A-02) · 14 días sin
   tarjeta (A-04) · si no le sirve no paga (A-08) · sin instalar, desde el navegador (A-10) · «sistema de gestión con
   IA» solo como lema, nunca en el titular (G-14) · precios, pago semanal/mensual/anual, precio final en bolivianos,
   sin implementación, sin permanencia, topes de fichas y usuarios (K-01 a K-07) · agentes incluidos desde Crece
   (K-11) · reservas online (K-12) · los datos son del cliente, no se venden ni entrenan IA (L-02) · empresa
   registrada con NIT (L-03) · L-09, L-10, L-12. **Ninguna función operativa** (agenda, ficha, cobros, Pendientes)
   está vista todavía: falta la cuenta de prueba (§6.1).
4. **No se dice nunca** (catálogo §7-§8): tratamiento a medias (D-03), agente de WhatsApp (J-*), factura SIAT, envío
   por WhatsApp (G-03 🟡), «la IA escribe cada mensaje», testimonios, cifras de clientes, «una clínica de ejemplo»
   (L-05), competidores. ⚠️ **A1 v5 dice «lo aprueba y lo envía, con un toque»**: eso es G-03 (🟡) y no está en sus
   filas exigidas. Se corrige antes de subir (8-oct).

### 9.3 Guion: seis tramos, en este orden

| Tramo | Regla | De dónde sale |
|---|---|---|
| **Gancho + filtro** (0-3 s) | Titular y filtro («Para dueños y dueñas de clínicas dentales de Santa Cruz») en el **cuadro 0**. El gancho tiene 3 partes que **no se repiten** entre sí: lo que se ve, lo que se dice, el texto en pantalla | §4.2; `ad-creative/references/hook-system.md` (global, «A Hook Is Three Components») |
| **Problema** | 1 dolor (2-3 en el VSL largo), con su consecuencia. Sin cifras propias: no hay | §4.1; catálogo §7 |
| **Mecanismo** | Qué hace Onia, con el nombre de la pantalla («Pendientes»), en el idioma del catálogo §8.3 | catálogo §8 |
| **Prueba en UI real** | Pantalla de la cuenta demo, **la misma persona de ejemplo en todas**, rótulo con el módulo y un anillo sobre el dato. Nunca pantallas generadas | CLAUDE.md «producto visible»; §4.2 |
| **Oferta** | Solo filas ✅: 14 días sin tarjeta, si no le sirve no paga, precio final en bolivianos, sin permanencia. **Sin el número del precio** en la pieza (no se actualiza solo) | `ONIA_ADQUISICION_Y_PAUTA.md` §5.4; Dentalink, Hormozi y Gadzhi no dicen precio |
| **CTA único** | Una acción **según dónde se ve la pieza**: en pauta, «Escríbanos por WhatsApp: en 20 minutos vemos si le sirve»; en el VSL largo que ya está dentro del chat, «Reserve los 20 minutos» (la persona ya escribió; pedirle que escriba otra vez no lleva a nada). En la marca personal: «link en mi perfil». Si la apertura nombra un dolor, el titular escrito es el filtro y no repite lo dicho | COMUNICACION §3; `PLAN-REFERENTES.md` §1 |

- **Duración:** pauta de 10 a 35 s, nunca más de 60 s (COMUNICACION §4 regla 2). El VSL de 3-5 min **no va a la
  pauta**: va al chat de WhatsApp después de calificar y al «Ver cómo funciona» de la página para clínicas.
- **Lo que hacen todos los VSL medidos y se copia:** dan antes de pedir (demo, regalo); prometen una duración y la
  cumplen; filtran en los primeros 20 s; dicen de frente qué ganan ellos (Gadzhi, 2:20); la venta llega tarde y corta;
  escasez **solo por capacidad real** (cupos, horas de Sergio Urcullo), nunca cuenta regresiva.
- **Lo que no se copia:** «la gran mentira», culpar a otros, «solo hoy» sin motivo (fórmula Benson, `pnUQsUA1LRs`);
  los motivos inventados de urgencia de Hormozi; promesas de ingreso (Gadzhi); testimonios y cifras de alumnos.
- **De usted** en Onia, producto y anuncios (§1, actualizado 9-oct); **de vos** en la marca
  personal. La pauta de Onia **no** usa el estilo de la marca personal (§4, rechazo v2).

### 9.4 Creativo: formato y herramienta

| Pieza | Herramienta | Nota |
|---|---|---|
| Estático 4:5 / 9:16 / 1:1, video sin persona de ~11 s | `scripts/anuncio-render.js` y `anuncio-video.js`, plantilla `bloques` (§4.2-4.3) | La nube lo rinde sola (~33 s) |
| Persona + pantalla (selfie G4, VSL corto) | `editor-videos` (**tabla de cortes + preview 360p ANTES de cortar**) y HyperFrames para rótulos y tarjetas (`talking-head-recut`) | Bruto a Drive «Videos Onia Octubre» con el código en el nombre |
| VSL largo (3-5 min) | `editor-videos` + `hyperframes` + `embedded-captions` | Un cambio visual cada 2-4 s; rótulo por módulo |
| Grabación de pantalla con cursor (cuenta demo) | **Script por escribir** (Playwright `recordVideo` + skill `oversized-cursor`); `auditar-app.mjs` solo captura imágenes | Antes de hacer clic en «Aprobar» (G-01) la cuenta lleva contactos de prueba propios: un clic puede enviar de verdad. Cuenta dedicada, nunca superadmin. Si el script no está, se pide como issue `orquesta` + `carril:video` con `donde: pc` |
| Presentador IA | `hermes-content/skills/ugc-empresas-higgsfield.md` (no es skill registrada: se abre por ruta) | Solo si Sergio Urcullo lo pide; costo con `higgsfield generate cost` desde la PC; nunca como cliente ni odontólogo |

Reglas de edición de la pauta: las 11 de COMUNICACION §4 (subtítulos Archivo con chip amarillo «Pendiente», cartela de
2-3 s, nada en los 250 px de arriba y abajo de una historia, sin música en el selfie).

### 9.5 QA antes de mostrarla (gate, en orden)

1. Tabla `frase | fila | estado` completa: ninguna fila ⬜ o ❌ en lo que se publica.
2. El copy en un archivo y `node web-factory/apps/onia-platform/scripts/promesa-que-el-producto-cumple.mjs <archivo>`
   (sale 1 si promete). Si se tocó `sales-kit/`: `npm run test:venta-honestidad` (cualquier «Bs N» tiene que ser un
   monto que el código cobra).
3. Mirarla renderizada al tamaño del celular (`qc` de 390 px) **al lado de los que duran** (§4.2). Titular en el
   cuadro 0. Historia sin nada en las zonas que tapa Meta.
4. Una sola acción, de usted, sin precio, sin «IA» en el titular, sin competidores.
5. Diseño nuevo ⇒ **revisión del render antes de publicar**, sin esperar otro OK de Sergio Urcullo (9-oct; CLAUDE.md, «Qué se publica sin preguntar»). Gasto y contacto con terceros conservan sus permisos; Codex respeta la tarea cerrada.

### 9.6 Prueba y métricas

- **Una campaña, un conjunto, 2-3 anuncios = copias de un mismo concepto** que cambian solo la apertura o el formato
  (estático, video, persona). Así se aprende qué formato rinde sin cambiar el mensaje.
- **Cada anuncio con su código en el texto precargado** («…(D3)…»): Chatwoot descarta el `referral` (`ONIA_ADQUISICION_Y_PAUTA.md` §5.5).
- **Se miden a mano cada día:** conversaciones, cuántas son de dueños de clínica, costo por conversación, CTR, demos,
  costo por demo, frecuencia. En video, además, **reproducciones de 3 s ÷ impresiones** (cuánto frena el gancho) y
  **ThruPlay ÷ reproducciones de 3 s** (cuánto retiene): métricas estándar de Meta, **sin umbral propio** hasta la
  semana 1.
- **Corte:** día 3, día 7 y día 14 de `ONIA_ADQUISICION_Y_PAUTA.md` §5.7. No se toca la segmentación ni se sube más de
  20 % el presupuesto durante la prueba.
- **Con US$ 56 no hay estadística:** la prueba dice si el filtro trae dueños, no cuál pieza gana (`ONIA_ADQUISICION_Y_PAUTA.md` §5.3).

### 9.7 Skills de afuera: qué sirve y qué no (8-oct)

- **En el repo (la nube las ve):** `ad-creative` (el sistema de ganchos sirve) y `copywriting`. Para pulir el texto,
  `humanizer` (solo en la PC). `ads`, `copy-editing` y `social` se archivaron el 27-oct por no usarse. ⛔ De `ad-creative` **no se usan** las plantillas de reseña, testimonio, antes/después,
  prensa, competidor ni el chat falso estilo iMessage: chocan con «no fabricar» y «ningún material nombra a la
  competencia». Están en inglés y de tú: se adaptan a usted.
- **Ninguna skill instalada escribe un VSL.** Lo único público con estructura de VSL es
  `coleschaffer/dtc-copywriting-skills` (`vsl-script`, MIT): cada skill corre un preámbulo bash con `curl`, telemetría
  y `open` de YouTube, así que **no se instala tal cual**; se copia solo el cuerpo, con OK de Sergio Urcullo.
- **No se instala:** MCP de Meta de terceros (`pipeboard-co/meta-ads-mcp` y otros; el conector oficial ya está),
  `AKCodez/higgsfield-claude-skills` (Playwright sobre la web de Higgsfield, prohibido), `goose-skills` (MCP remoto
  con login de Google), `OpenMontage` (AGPL, muchas claves).

### 9.8 Trampas e intentos fallidos

- **3-oct:** D4 se armó prometiendo el tratamiento a medias porque «estaba en producción»; no encontraba a nadie. Una
  frase sin fila en ✅ no se renderiza.
- **1-2 oct:** v1 (crema editorial) y v2 (estilo de la marca personal) rechazadas; la referencia de formato es la
  Biblioteca, no un pack nuestro.
- **8-oct:** v4 era «una losa de texto»; la v5 mejoró el diseño pero **no tiene persona**, y los 7 que sobreviven sí.
- **8-oct:** el pedido de «VSL» no decía de qué oferta. Son dos (Onia de usted y la asesoría gratis de vos) y se
  escribieron por separado. El VSL de un curso sigue prohibido hasta que el curso exista
  (`ONIA_COMUNIDAD_CONTENIDO.md`, «Semana 4+»).

### 9.9 Renovación en 4 grupos, criterios de Biblioteca y checkout (FLUNA, 10-oct; aprendido el 17-oct)

> Origen: 4 mini clases + «Las 10 skills del flujo» + skill `anunciante-supremo` que Sergio Urcullo mandó el 16-oct.
> Ficha con las 12 dimensiones, contradicciones y evidencia: `references/video-intake/2026-10-16-fluna-mini-clases-y-anunciante-supremo.md`.
> Todo es **declarado por terceros** de un grupo de infoproductos (compra web, US$ 17): las cifras no son de ONIA.

- **Los 4 grupos son un orden de aprendizaje, no un calendario diario.** Se testea un eje por vez: **G1 réplica** del top de la
  competencia (ya hecho: `FORMATOS-QUE-SOSTIENEN.md`) → **G2 formatos**: mismo ángulo y comunicación del que dio conversaciones,
  formato distinto → **G3 variaciones** mínimas (hook de los 3 primeros segundos, titular, color) → **G4 ángulos nuevos** con los
  formatos que ya sostuvieron. Con el tope de US$ 56 (§5) no hay estadística: una campaña, un conjunto, 2-3 anuncios (§9.6);
  el G2 llega recién tras el corte del día 3-7 de `ONIA_ADQUISICION_Y_PAUTA.md` §5.7. Cada grupo = una campaña con el nombre
  `PRODUCTO-PAIS-G#-ABO` o `-CBO`, todas con el mismo píxel (`ONIA Web`). Lo que sigue vendiendo se deja prendido.
  Nunca dos ejes en la misma variante; oferta, precio y plazos no se tocan entre variantes.
- **Criterio de Biblioteca (de `/cazar` y `/auditor-supremo`):** se cuentan los anuncios que **sobreviven**, no los que hay.
  ≥8 con 7+ días en un anunciante = empieza a convertir; ≥15 con 8+ días **sobre la misma oferta** = validado; un creativo
  repetido muchas veces = ese es el ángulo. «100 activos con 0 de 7+ días» es una fábrica de creativos, no un ganador.
  ⚠️ El conector `Meta_ads` **no da impresiones ni el creativo** (§8.2): «Claude te da el top 5 por impresiones» (Franco) **no
  se puede afirmar**. Solo antigüedad; para videos y para los más viejos de un anunciante con >50, la captura la hace la PC.
- **Hooks (de `anunciante-supremo/plantillas/hooks.md`, suma a §9.3):** el test de alineación es obligatorio — tapando el texto,
  lo hablado o lo visual, se adivinan los otros dos; titular de máximo 2 líneas con `|` para forzar el corte; número específico;
  y se mira **un cuadro del hook renderizado** antes de darlo por bueno (un bloque `*énfasis*` no se parte y deja un conector
  huérfano en un tercer renglón).
- **Checkout del prepago (de la clase de Rodrigo): sirven 3 de sus 6 piezas.** (1) Banner con la promesa, lo que incluye y el
  precio final; (2) botón de WhatsApp de soporte («¿dudas? escríbanos»); (3) FAQ de pago y «cómo pagar con QR en 3 pasos»
  (¿por qué el QR muestra un nombre de persona?, ¿cuándo se activa?, ¿puedo pedir factura?). Pedir solo lo necesario
  (email, nombre, teléfono). ⛔ **No** se copian: testimonios (cero clientes), **garantía** (el prepago es sin devolución,
  decidido el 16-oct; la prueba de 14 días sin tarjeta es otra cosa y no se presenta como garantía del prepago), cuenta
  regresiva. Es propuesta al carril Plataforma; no se toca el checkout desde Ventas.
- **Prohibido de ese material:** testimonios o capturas de WhatsApp «hechas con IA», «POV habla la clienta», «entrevista
  en la calle» y chat de grupo simulados (fabricar clientes); cuenta regresiva de 7 min o reloj de 72 h; cobrar por cuentas
  bancarias de otros países o retiro a Binance para «pasar desapercibido» (choca con el modelo Facilitador y con la
  transparencia del QR); cualquier cifra de ROAS o de ingresos del creador.
- **`anunciante-supremo` no se instala** sin OK (llave de APIMART de un tercero, ~300 MB, gasto por tanda ≈ US$ 1; hace
  anuncios de infoproducto con B-roll, no «producto visible»). De ahí se usa la receta de reuso: música, B-roll y voz
  guardados, y variantes que mueven un solo eje.
- **«Antes de 3 ventas solo se lanza la promesa»** vale para ONIA solo con fecha y contenido reales (taller del 31-oct, cupos
  verdaderos): se vende lo que existirá en fecha, sin exhibir obra ni inventar entregables.
- **Pendiente:** ver los dos Canva (403 de Cloudflare desde la nube, 17-oct); decisión de Sergio Urcullo sobre devolución y
  sobre un proveedor de QR sin NIT («Tesavis [?]», no verificado).

### 9.10 Higgsfield en la pauta y el funnel (27-oct)

> Investigación completa, con fuentes y fechas: `hermes-content/docs/research/2026-10-27-higgsfield-anuncios-y-funnel.md`.
> Los créditos salen de documentación pública o de mediciones viejas del repo: **ninguno está cotizado con la cuenta**.

- **En un anuncio de software Higgsfield pone poco.** Lo que vende no se genera: la pantalla real, el copy verificado, una
  persona real, el destino y el seguimiento. Marketing Studio y Ads Studio están hechos para producto físico. Su estilo
  «SaaS» inventa la interfaz, y sus plantillas de reseña, testimonio y antes/después fabrican clientes: no se usan.
- **Dónde sí entra, de más barato a más caro** (créditos por intento; un crédito ≈ US$ 0,05):
  - un fondo sin texto con Soul 2.0: ~0,12;
  - una imagen con texto con GPT Image 2.5: ~1;
  - ideas de ángulo con Ads Studio: 4 por maqueta. No se publica ni su copy ni su diseño;
  - una apertura de 3-5 s sin personas: Kling 3.0 sin sonido ~6 (extrapolado) o Seedance 2.5, 35 por 5 s;
  - un presentador IA de 10-15 s con Marketing Studio: 70-90 a 720p. Solo si Sergio Urcullo lo pide.
- **La tanda 1 de Meta no necesita Higgsfield.** Las tres copias del concepto A1 (estático, video de 11 s y selfie) salen
  de código y de una grabación (§4.2 y `ONIA_ADQUISICION_Y_PAUTA.md` §5). Como mucho entra una variante de apertura
  (A1-V-b), con tope de 20 créditos, cotizada y con OK.
- **El primer trabajo útil cuesta cero: cotizar.** `higgsfield generate cost` por función, para llenar la tabla con
  números de la cuenta. Trampa: con una ruta local, `generate cost` sube el archivo.
- **El funnel de Onia Platform, verificado el 27-oct:**
  1. Anuncio → WhatsApp del bot, con el código (D1, D2, D3) en el texto precargado.
  2. Las 5 preguntas de `ONIA_CLIENTE_IDEAL.md`.
  3. Llamada en `sergiourcullo.vercel.app/llamada`: cal.com, responde 200.
  4. Registro en `app.onia.com.bo/register`: responde 200.
  5. Seguimiento del día 3, 7 y 14 con piezas reales.

  `onia.com.bo/llamada` da 404: no se usa como destino.
- **Riesgos abiertos:**
  - Los términos de Higgsfield (23-oct) piden 18 años, y no está escrito quién es el titular de la cuenta.
  - Meta etiqueta «AI info» lo hecho con IA de terceros. Es inferencia, sin probar.
  - Hay una contradicción que decide Sergio Urcullo: `ONIA_PLAN_1.0_Y_CAJA.md` §4 deja octubre sin gasto de Higgsfield
    para pauta, y `HIGGSFIELD_VIDEO_SYSTEM.md` le asigna 340 créditos.

### 8.2 Biblioteca de Anuncios por el conector `Meta_ads` (8-oct): cómo se usa y qué NO dice
- **Herramienta:** `mcp__Meta_ads__ads_library_search` (se carga con ToolSearch). **Pide en cada llamada** `client_conversation_id` (20 caracteres alfanuméricos, el mismo toda la conversación) y `client_model`; exige al menos `search_terms`, `page_ids` o `countries`. Solo funciona con una cuenta de anuncios activa (ONIA Ads lo es).
- **Devuelve:** nombre de página, titular, fecha de inicio (epoch), moneda y enlace. **No devuelve el creativo ni el texto.** Los **más nuevos van primero y el tope es 50**: de un anunciante con más de 50 activos **no se ven los más viejos** (error de lectura que casi cometo con Dentalink, 92 activos). Para los viejos, `page_ids` + capturar desde la PC.
- **Días al aire** = `(hoy − ad_delivery_start_time) / 86400` en python. Solo es antigüedad: **no prueba rendimiento**.
- **Ids de página** (8-oct): AgendaPro `1429581593936821` · Dentalink `106612849382553` · Doctocliq `122294408384514` · Dt.Dental `644396635996094` · CitaPro `117313424662542` · Wa7pro `1346974258489921`.
- **Búsqueda por país** (`countries:["BO"]`) = anuncios cuyo alcance incluye Bolivia: sirve para ver quién le pauta a Santa Cruz (ADQ §2.6.1). **Ausencia ≠ inexistencia.**
- **Lo que no sirve:** el navegador de la nube (Biblioteca 403, Pinterest pide sesión). **Pinterest no mide rendimiento**: es inspiración visual.
- **No es raspado masivo:** pocas consultas dirigidas (la herramienta lo prohíbe).

## 10. Vender valor y psicología de compra (Gadzhi y Hormozi, medido el 20-oct)

Ficha con evidencia por video: `hermes-content/references/video-intake/2026-10-20-gadzhi-vender-valor-psicologia.md`
(2 llamadas reales suyas, su embudo, mensajes en frío, producto barato y una llamada comentada por su vendedor).
Sirve para la demo con clínicas (usted) y para el taller de la marca personal (vos).

- **Cuenta antes que pieza.** Antes de pautar o de vender: cuánto vale un cliente, cuánto se puede pagar por conseguirlo
  y la única métrica que se mira. Si la cuenta no da, no se vende (él rechaza clientes por eso). Taller del 31-oct:
  tope de Bs 30 por inscripto pagado; se corta la pauta si al día 3 lo supera.
- **Orden de la conversación 1 a 1:** marco («los dos tenemos que ver que sirve») → **meta en número** → **costo de hoy**
  (horas por semana, plata) → por qué quiere cambiar → recién ahí la solución. El comprador dice con sus palabras por qué
  lo necesita. Al que «solo quiere información» se le pregunta con qué quería ayuda.
- **Primer mensaje en frío:** algo concreto de la persona + qué gana ella + una pregunta. **Su objetivo es que conteste**,
  no vender: sin precio ni link en el primero.
- **Valor contra lo que ya paga o pierde** (horas del dueño, un empleado, la tarea que repite), nunca contra el precio
  de un competidor. El precio va después del valor, dicho de frente.
- **Riesgo cero sin vender horas:** que el comprador no pueda quedar peor que hoy (él cobra solo sobre lo que supera lo
  que el cliente ya lograba). En producto barato, una devolución condicionada; decide Sergio Urcullo.
- **Prueba propia, nunca ajena:** pantalla real, cifras propias, entrevistas a clientes que sí pagaron. Sin testimonios
  todavía → se muestra cómo lo usa Sergio Urcullo en Onia.
- **Filtrar sube la venta:** «para quién no es» y «no somos los más baratos» atraen al que paga.
- **Cierre con paso inmediato:** QR o alta en el mismo chat; si hay dos que deciden, que lo hablen y se vuelve el mismo día.
- **No se copia:** escasez inventada (relojes, «quedan 150»), listas de espera de marketing, cifras de ingreso como
  promesa, sorteos, lujo como prueba, ni decirle al comprador que se busca «que se sienta en deuda».

### 10.1 Hormozi: la oferta y el cierre

Ficha: `hermes-content/references/video-intake/2026-10-20-hormozi-oferta-y-cierre.md` (su marco de cierre, 9 hábitos
medidos en sus equipos, «la oferta es la reina» y la ecuación de valor leída de su libro).

- **Antes de una pieza o un precio, pasar la oferta por la ecuación:** (resultado × probabilidad de lograrlo) ÷
  (demora × esfuerzo). Lo que más sube el valor es **bajar la demora y el esfuerzo** (que funcione hoy y sin trabajo
  del comprador); subir promesas es lo fácil y lo que todos copian. En Onia: «el bot contesta desde el primer día»
  vale más que otra función.
- **La oferta cabe en una frase y trae su razón** (primera edición, cupos de fundador). Sin razón, lo barato no se cree.
- **Garantía = más probabilidad percibida = se puede cobrar más.** Que no cueste horas de Sergio Urcullo.
- **CLOSER** en toda conversación 1 a 1: clarificar por qué está → etiquetar el problema con sus palabras → qué probó
  y por qué no fue su culpa → vender el destino en ≤ 3 min con 3 pilares y una historia cotidiana por pilar → «¿cuál
  es tu duda principal?» → reforzar en las primeras 48 h después del pago.
- **En la conversación solo hay preguntas, reformulaciones e historias.** Escuchar el doble de lo que se habla.
- **Obstáculos antes del precio** (tiempo, pareja o socio, «no sé si puedo»): después del precio ya son objeciones.
- **Asistencia y referidos:** pregunta de preferencia antes del evento; «¿a quién conocés que…?» después de pagar
  (pide un nombre). Nunca terminar sin la próxima fecha.
- **Lo gratis vende si después se vende igual:** la clase o la prueba gratis no cierra sola.
- **No se copia:** sorteos, promesas de ingreso o peso, presión al pedir referidos, cobrar «y pedir perdón después».
