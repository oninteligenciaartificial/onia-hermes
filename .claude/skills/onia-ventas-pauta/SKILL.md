---
name: onia-ventas-pauta
description: "Invocar para CUALQUIER trabajo del carril Ventas y pauta de Onia: prospectar negocios con señal (Biblioteca de Anuncios de Meta), escribir o verificar mensajes 1:1 y respuestas a leads, el guion de demo, el registro de objeciones, las piezas del anuncio (D1/D4) y la campaña de Meta en ONIA Ads. Dice qué ya está medido para no volver a investigarlo: método, comandos, trampas e intentos fallidos con su fecha."
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
| Leads que ya escribieron y sus borradores | `hermes-content/docs/ONIA_LEADS_ESPERANDO.md` §3 |
| Guion de demo de 20 minutos por rubro | `hermes-content/sales-kit/02-GUION-DEMO.md` |
| Precios | `onia-platform/lib/subscription-plans.ts` (`DEFAULT_PLAN_AMOUNTS`); límites en `lib/plan-catalogo.ts` |

## 1. Reglas que no se negocian

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
su Facebook desde la PC: se le pide a la madre con la lista exacta. Al que queda listo, el mensaje le cierra la
condición con una sola pregunta («¿cuántas profesionales atienden hoy?», «¿las importan ustedes directo?»).

**Re-leer antes de enviar:** un prospecto cuya pauta se cortó recibe un mensaje sobre un anuncio que ya no
existe. El 1-oct, de 13 prospectos del 30-sep: Cames ya no pautaba, y DASHA, Corpo Belo y Jhimbo habían
cambiado de anuncios (hubo que corregir su línea «Vi…»).

**Formato del mensaje 1:1** (de usted, para el dueño o la dueña):
«Buen día, soy Sergio Urcullo, de Onia, aquí en Santa Cruz. Este mensaje es para el dueño o la dueña de X.
/ Vi sus anuncios de… (lo observable, con fecha) / el dolor concreto del rubro / el mecanismo que producción
cumple hoy / ¿Le muestro cómo se ve en una demo de 20 minutos?». Sin precio, sin cifras, sin testimonios.
- **Dental y estética prometen solo esto:** cada mañana Onia deja escrito el mensaje para el paciente o la
  clienta de mañana que no confirmó, y se manda desde el propio WhatsApp.
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
| «Preguntá por tu negocio» es IA | ❌ | Son 30 temas escritos a mano, sin modelo (`BarraAsistente.tsx`) |
| «La IA calcula el costo de importación» | ❌ | El costeo es cálculo; en importadoras la IA solo está en el mensaje de cobro |

   Cómo se midió la variable, sin imprimir secretos:
   `ssh onia-vps 'docker exec onia-platform sh -c "echo AGENTS_LLM=\${AGENTS_LLM}"'`.

## 4. Piezas del anuncio (D1 y D4)

**v2 del 2-oct, cómo se armó** (`briefs/ads/*-d1v2-*` y `*-d4v2-*`, salida en `carousels/out/ads/…v2…`):
- **Portada con la pantalla real, no con una imagen generada.** Es producto visible desde la primera lámina, sin
  gasto de Higgsfield y sin esperar aprobación. La arcilla queda como opción.
- **Para que la captura se lea en el celular:** un recorte de **~320 px de ancho, renderizado a 3×**. Con eso el
  texto de 13–15 px pasa a ~40 px en la lámina.
  - Una tarjeta entera, de ~770 px, queda en letra de ~7 pt: no se lee, por más que se agrande.
  - El mensaje real **se cita en el texto de la lámina** («…») en vez de mostrarlo chico, como en `sergio-k6v2`.
- **Recortar:** `.claude/skills/onia-ventas-pauta/scripts/recortar-captura.js` (Playwright: un div con `overflow:hidden` y `deviceScaleFactor` 3). Si en el borde se
  cuela una letra de otra línea, se tapa ese rectángulo con blanco. **Nunca se toca el texto de la pantalla.**
- ⚠️ **`cta` al nivel del brief pone el botón en TODAS las láminas.** El CTA del anuncio va en `cta_anuncio`; el
  botón solo en la última lámina, con `cta` dentro de esa lámina.
- ⚠️ **Hoja de contactos en la nube:** `carousel_contactsheet.js` busca `/usr/bin/chromium`. Se apunta a un
  envoltorio de `headless_shell` con `--no-sandbox`, porque como root sin eso no arranca.
- **Control antes de mostrarlas:** ninguna lámina con más de un 40 % vacío. Una franja de captura sola deja la
  lámina vacía: se junta con la cita del mensaje.

> ⛔ **1-oct, de noche: Sergio Urcullo rechazó D1 y D4.** Sus palabras: *«no entiendo por qué haces los carruseles
> así, respeta tus reglas, mira cómo los hace mi marca personal, aprende cómo los hace la competencia»*.
> - **Qué estaba mal:** se armaron con el pack `community-editorial`, crema, el que él ya había rechazado el 29-sep,
>   porque el `CLAUDE.md` todavía lo nombraba como piso (corregido el 2-oct). Salieron cinco láminas iguales,
>   títulos en mayúsculas, verde de adorno y la captura en un marco de ~450×300 que no se lee.
> - **Mi error:** las miré y se las mandé sin contrastarlas con la regla «Publicidad que no parezca hecha por IA».
>
> **Para rehacerlas:**
> 1. **Pack `referentes`**, como `sergio-k6v2-*`: portada verde con un objeto de arcilla; interiores blancos con
>    una idea cada uno (`ensayo`, `dato`, `lista`, `captura`); cierre verde con el botón.
> 2. **La competencia mirada de verdad:** las 22 capturas que se pidieron en
>    `research/competencia/anuncios/PEDIDO-CAPTURAS.md`. Hasta el 1-oct nadie había mirado sus creativos, solo los
>    títulos.
> 3. **«Sistema con IA»** (pedido del 2-oct), usando solo las frases que Plataforma confirme en el código.

- Briefs vigentes: `hermes-content/carousels/briefs/ads/onia-platform-dental-meta-d1v2-los-de-manana.json` y
  `…-d4v2-tratamiento-a-medias.json`, de 7 láminas cada uno (los sin `v2` son los rechazados del 1-oct). Títulos,
  texto precargado y CTA en `ONIA_ADQUISICION_Y_PAUTA.md` §5.8.
- ⚠️ Los dos scripts piden banderas: `carousel_render.js --brief <json> --out <dir>` (sin `--brief` contesta
  «Missing --brief») y `carousel_contactsheet.js --dir <dir>`. Pasarles la ruta suelta no hace nada.
- **Render en la nube:** `eval "$(sh scripts/carousel_cloud_setup.sh)"` y después
  `node scripts/carousel_render.js --brief <brief> --out <dir>` + `node scripts/carousel_contactsheet.js --dir <dir>`.
  Sin el setup sale letra DejaVu, el pie cortado y sin navegador (skill `diseno-contenido-onia` §5).
- **Las capturas viajan con el brief**, en `carousels/briefs/assets/onia-1.0-dental-ads/`. Las candidatas del
  30-sep están en `candidato-20260930/` y **no** pasan a la carpeta aprobada sin el OK de Sergio Urcullo.
- **Una captura entera de pantalla queda como una mancha** en el marco de ~450×300 del pack
  `community-editorial`. Se recorta a la tarjeta que prueba el punto. Sin PIL ni ImageMagick: un HTML con un div
  `overflow:hidden` y la imagen corrida en negativo, capturado con
  `headless_shell --force-device-scale-factor=2 --window-size=W,H --screenshot`. Recortes y coordenadas:
  `candidato-20260930/recortes/README.md`. Ni así se lee entero en el celular: la salida pendiente es un layout
  de captura a todo ancho en el renderer compartido (avisar a Marca personal).
- El visual `contract` del renderer trae «INPUT/OUTPUT» en inglés fijo: para «ONIA → VOS» usar `table`.
  Las etiquetas largas se pisan con la flecha: cortas, como «PENDIENTES».
- El campo del título es `headline`, no `title`: con `title` la lámina sale sin título y sin aviso.
- Cada pieza se le muestra **renderizada** a Sergio Urcullo antes de subirla.

### 4.1 Mirar la competencia antes de escribir (método del 2-oct)

- **Dónde están:** `hermes-content/research/competencia/anuncios/<anunciante>/` + `CAPTURAS-HECHAS.md` (18 de 22,
  capturados por la madre desde la PC el 1-oct). La nube no abre `facebook.com`: un pedido nuevo de capturas se le
  manda a la madre con la lista de id (`PEDIDO-CAPTURAS.md` es el formato).
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
  "<frase>" /app/.next/server`). El 2-oct así se vio que el tratamiento a medias ya estaba en producción
  (`release-8f07e537`) mientras `ONIA_ADQUISICION_Y_PAUTA.md` §0 y §5.4 seguían diciendo que no.
- **El umbral del tratamiento a medias es «21 días sin venir»** (`diasSinVenir`), con el tratamiento en curso y
  sin cita futura. «21 días en progreso» o «21 días sin cita» son inexactos: corregido en D4 el 2-oct.

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
- Presupuesto en centavos de USD: USD 140 = `14000`, como presupuesto total de la campaña con fecha de fin.
  Meta rechaza un **límite** de gasto menor a USD 100.

## 6. Qué bloquea la nube (y qué no)

| Qué | En la nube «Default» (30-sep y 1-oct) | Cómo se resolvió |
|---|---|---|
| `facebook.com`, `instagram.com`, webs de clínicas, buscadores | 403 del proxy | La Biblioteca por el conector; para mirar páginas, el entorno `onia-higgsfield` o la PC |
| **Entorno «Default» con red completa (1-oct, noche)** | Las webs, los directorios y los buscadores abren. **`facebook.com` redirige al login** con `curl` y con Chromium. Abrir Instagram, `wa.me` o Maps con Chromium **lo bloquea el control de permisos**: no se reintenta por otro lado | Webs propias, el directorio por `page_id` (§2) y la Biblioteca por el conector. Lo que solo se ve dentro de Facebook (cuántos atienden, el texto del anuncio) se mira desde la PC |
| VPS y base de producción | sin llave (`ONIA_VPS_SSH_KEY_B64` vacía) | lo mide la madre en la PC |
| `SendMessage` a otra sesión | falla: la nube no puede mandar | se contesta en el propio transcript; la madre lo lee |
| `ssh onia-vps` después de reiniciar la sesión (2-oct) | El hook deja la llave y la config, pero **falta el programa `ssh`** | `apt-get install -y openssh-client` |
| Cupo de búsquedas web | 200 por sesión; se agotó con 4 subagentes | Darle a cada subagente un tope. El 1-oct, de noche, 4 subagentes con 25, 30, 20 y 12 búsquedas verificaron 28 prospectos y 9 de reserva, y usaron el tope completo |
| Fuentes de Google en el render | no bajan | `scripts/carousel_cloud_setup.sh` instala TTF locales |

## 7. Después de cada demo

Anotar las objeciones **el mismo día**: `ONIA_PROSPECTOS_DENTAL_SCZ.md` §7, o «Registro de objeciones» al final
de `ONIA_PROSPECTOS_OTROS_RUBROS_SCZ.md`. Regla del plan de 14 días: **si tras 10 demos nadie quiere pagar, se
cambia el producto, no el discurso.**

⚠️ **Hoy (1-oct) no hay cuenta demo en producción** (`02-GUION-DEMO.md` §0.1). Sin ella no hay demo: es lo
primero que se resuelve con Sergio Urcullo y Plataforma.
