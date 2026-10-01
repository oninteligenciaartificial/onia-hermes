# Handoff — carril `mercado-y-pauta` (sesión «Ventas y pauta Onia Platform», antes «Análisis de mercado»)

> ⏩ **1-oct, vigente: el carril sigue en la NUBE** (`session_01BnctfaNRsm3ogJ46A7B5P5`). Rige la regla nueva
> de `CLAUDE.md`: la madre corre local y ordena por mensaje, y esta sesión contesta en su transcript. Lo que
> exige la PC (Facebook, Instagram o el Administrador de anuncios con el login de Sergio Urcullo) lo hace la
> madre. El aviso anterior, «pasa a una sesión local», quedó sin efecto.
>
> 🔁 **1-oct, noche — RELEVO.** Sergio Urcullo abre la sucesora en el entorno **`onia-higgsfield`** (acceso
> completo: Facebook, Instagram y buscadores). La sucesora carga primero la skill **`onia-ventas-pauta`** (lo
> aprendido, para no re-investigar) y después lee este archivo: el estado vigente está en los campos de abajo, y
> la tabla «Verificar los 28 prospectos» está al final.
>
> **Renombrada el 30-sep, de noche, por decisión de Sergio Urcullo.** El archivo conserva su nombre para no
> romper enlaces.
>
> **Es dueña de conseguir clínicas:** la lista de las primeras 10 para el contacto 1:1, el registro de
> objeciones de cada demo, Meta Ads de punta a punta (piezas del anuncio incluidas; D1 y D4 vuelven acá) y
> @oniahq solo como la página que pauta.
>
> **No es suya:** los carruseles de contenido, que son de Marca personal; el producto; el VPS; el chatbot,
> que Sergio Urcullo dijo el 30-sep que lo arregla él.

> Rama `claude/nice-lamport-5og9lv` · sesión `session_01BnctfaNRsm3ogJ46A7B5P5` · abierta el 2026-09-30.
> Formato: los siete campos de `README.md` de esta carpeta.
> Página para Sergio Urcullo con el resumen y las cinco decisiones: https://claude.ai/artifact/NpSFgbLpND6Ruh8QMu63ts (privada).

**Objetivo**

Dejar decidido **con datos** a quién y por dónde se vende Onia Platform, y la campaña de Meta lista para
crear en PAUSA. "Hecho" =
1. veredicto sobre «¿uno o siete rubros?» con números → ✅ `ONIA_CLIENTE_IDEAL.md` §6 y §7;
2. competencia **por adquisición** + prospectos con señal → ✅ `ONIA_ADQUISICION_Y_PAUTA.md` §2-§3 y
   `ONIA_PROSPECTOS_DENTAL_SCZ.md` §5;
3. campaña especificada con techo, criterios de corte y bloqueos con dueño → ✅ `ONIA_ADQUISICION_Y_PAUTA.md`
   §5-§6 (**creada: no** — el conector de Meta está en otra cuenta; ver *Qué depende de Sergio*);
4. funciones y productos nuevos por el test de tres preguntas → ✅ `ONIA_ESTRATEGIA_DE_EMPRESA.md` §14;
5. cada sesión avisada de lo que le toca → ✅ EL HILO (`COORDINATION_MANIFEST.md`) + dos avisos directos a
   Plataforma.

Pedido textual de Sergio Urcullo: *"revisar si es rentable colocar tantos rubros… me dicen si ofreces a
demasiadas personas nunca vas a vender nada… revisar meta ads, revisar clasificaciones, revisar
competidores… armar las campañas de meta"* y, a mitad de sesión, *"qué funciones deberíamos añadir…
agentes que hablan con agentes… posibles nuevos productos… un marketplace como Uber, Yango, PedidosYa"*.

**Qué quedó EN PRODUCCIÓN**

Nada del producto: este carril no toca código ni la web. Lo que quedó publicado son docs en `main` (vía el
autosync de esta rama). **Ninguna campaña creada, cero gasto.**

**Qué quedó a medias, y dónde** (al 1-oct, 20:30 UTC; todo commiteado y en `main`)

- **D1 y D4 (piezas del anuncio): renderizadas, esperan el OK de Sergio Urcullo.** Salieron con las capturas
  **candidatas** de la 1.0, recortadas a la prueba (`3834f60a`). Están en
  `carousels/out/ads/onia-platform-dental-meta-d1-candidato/` y `…-d4-candidato/` (7 láminas y
  `_contactsheet.png` cada una). Las capturas viven en `carousels/briefs/assets/onia-1.0-dental-ads/candidato-20260930/`
  (`recortes/` y su README). **No se copian a la carpeta aprobada sin el OK de Sergio Urcullo.** Límite visto:
  el marco de captura del pack `community-editorial` mide ~450×300, y en el celular se lee justo. Si Sergio
  Urcullo lo juzga ilegible, la salida es un layout de captura a todo ancho en `scripts/carousel_render.js`
  (renderer compartido: avisar a Marca personal antes de tocarlo).
- **La campaña de Meta: especificada, NO creada.** Tabla en `ONIA_ADQUISICION_Y_PAUTA.md` §5.8; pasos exactos
  para crearla en pausa en §5.8.1; qué falta para encender en §5.9. Bloqueo principal: el conector de Meta
  no ve ONIA Ads (re-medido el 1-oct a las 20:15 UTC).
- **Prospectos: 28, nadie contactado.**
  - 10 dentales: `ONIA_PROSPECTOS_DENTAL_SCZ.md` §6.1 y §6.5. Los cupos 9-10 (Spadental, MUN) salieron de la
    Biblioteca de Anuncios en vivo el 1-oct.
  - 12 de estética y 6 importadoras: `ONIA_PROSPECTOS_OTROS_RUBROS_SCZ.md`, re-leídas en vivo el 1-oct
    (`c6a4caa5`). Cames bajó a reserva.
  - Página con «Copiar mensaje» y botones: https://claude.ai/artifact/8sFD37TVJMcEJaHcZ2PWSV. Su fuente es
    `primeras-clinicas.html` en el scratchpad de esta sesión, que **se pierde** con ella. Si hay que cambiar la
    página, se lee con `Artifact read` y se republica al mismo URL.
  - En **ninguno** se verificó ciudad, tamaño ni WhatsApp abriendo su página: desde la nube vieja, Facebook e
    Instagram daban 403. Es lo primero que puede hacer la sucesora (tabla al final).
- **Leads que ya escribieron: borradores listos, nada enviado** (`ONIA_LEADS_ESPERANDO.md` §3). El de 4
  doctores (conv 35) tiene sus 6 respuestas verificadas leyendo el código de `onia-platform` `origin/master`
  `a7f228c`. Dos son un «no»: los períodos de 15/30/60 y el PDF. **La 1.0 ya está en producción**
  (`release-4dc829e8` la contiene). **Crece con 4 usuarios todavía no:** no se cotiza Crece para 4.
- **Pruebas por vencer (pedido de la madre):** las mira la madre en la PC, con acceso a la base. Los borradores A
  y B de seguimiento están en el transcript de esta sesión (`session_01BnctfaNRsm3ogJ46A7B5P5`).
- **Guion de demo de 20 minutos por rubro: escrito** (`hermes-content/sales-kit/02-GUION-DEMO.md`), con la prueba
  de cada capacidad en el código. ⛔ **No hay cuenta demo en producción** (§0.1 del guion): sin ella no hay
  demo. Al seed le faltan datos de estética y servicios (pedido para Plataforma). **Sin tocar y desalineados**
  con los precios y planes de hoy: `sales-kit/04-OBJECIONES.md` y `05-CHECKLIST-CAPTURAS.md` (DentalGest,
  «Pro Bs 750», trimestral, SIAT). Hay que corregirlos antes de usarlos.
- **Pedidos abiertos a otros carriles** (EL HILO, 30-sep): página de entrada para clínicas (Plataforma). El bot
  listo para pauta y el `referral` que Chatwoot descarta son del carril chatbot, que Sergio Urcullo dijo que
  arregla él.

**Archivos y cambios**

- Nuevo: `hermes-content/docs/ONIA_ADQUISICION_Y_PAUTA.md` — fuente sin fecha de *cómo se consiguen clientes*.
- Nuevos (30-sep, tarde): briefs `carousels/briefs/ads/onia-platform-dental-meta-d1-los-de-manana.json` y
  `…-d4-tratamiento-a-medias.json` · `carousels/briefs/assets/onia-1.0-dental-ads/README.md` (las cuatro capturas) ·
  `scripts/carousel_cloud_setup.sh` (render en la nube igual al de la PC) · trampa en la skill
  `diseno-contenido-onia` §5, puntos 5 y 6.
- Editados: `ONIA_CLIENTE_IDEAL.md` (§2 matiz de la IA, §6 «¿uno o siete?», §7 tamaño del segmento) ·
  `ONIA_ESTRATEGIA_DE_EMPRESA.md` (§0 punto 12; §14: Recall de tratamiento a medias, agentes que hablan con
  agentes, marketplace) · `ONIA_PROSPECTOS_DENTAL_SCZ.md` (§5, clínicas que pagan pauta) ·
  `ONIA_DENTALGEST_ESTRUCTURA_ULTIMA_MILLA_2026.md` (corrección TuDoc/SIAT) · `ONIA_CATALOGO_DE_IDEAS.md`
  (puntero a §14) · `ONIA_PAUTA_COMPETENCIA_20260815.md` y `ONIA_ADS_CAMPANA_1_LISTA_20260813.md` (marcadas
  como fotos de agosto) · `COORDINATION_MANIFEST.md` §EL HILO (fila Mercado, id vivo de Lucía, avisos).
- Investigación completa, con fuentes: `research/ONIA_MERCADO_COMPETENCIA_BOLIVIA_20260930.md` ·
  `ONIA_TENDENCIAS_AGENTES_20260930.md` · `ONIA_MARKETPLACE_EVALUACION_20260930.md` ·
  `ONIA_META_ADS_PLAYBOOK_20260930.md` · `ONIA_BIBLIOTECA_ANUNCIOS_20260930.md`.
- **1-oct:** `ONIA_PROSPECTOS_DENTAL_SCZ.md` §6.5 (cupos 9-10) · `ONIA_PROSPECTOS_OTROS_RUBROS_SCZ.md` (re-lectura
  en vivo, 18 negocios) · `ONIA_ADQUISICION_Y_PAUTA.md` §5.8.1 y filas 2, 7 y 8 de §5.9 ·
  `ONIA_LEADS_ESPERANDO.md` §3 (borradores) · `sales-kit/02-GUION-DEMO.md` (guion por rubro) ·
  skill nueva `.claude/skills/onia-ventas-pauta/SKILL.md` (sumada a `onia-router`) ·
  `carousels/briefs/assets/onia-1.0-dental-ads/candidato-20260930/recortes/` · `carousels/out/ads/*-candidato/`.

**Intentos fallidos**

- **El conector de Meta Ads sigue en OTRA cuenta de Facebook** (NUVO 1usd / Arthur Fuentes). Sirve para la
  Biblioteca de Anuncios (lectura pública), **no** para crear en ONIA Ads. Mirar primero `ads_get_ad_accounts`:
  si no aparece `1073680778314945`, no sirve para crear. **Nunca gastar en esas dos.**
- **El proxy de la sesión no llega a `facebook.com` ni a `onia.com.bo`** (curl → `000`): los creativos de la
  competencia y la home renderizada **no se pudieron mirar**. `onia.com.bo` se mira desde el entorno de nube
  `onia-higgsfield` o desde la PC.
- **El cupo de búsquedas web de la sesión se agotó (200/200)** con cuatro subagentes investigando en paralelo, y
  el proxy devolvió 403/`EGRESS_BLOCKED` en casi todas las páginas: lo marcado *vía buscador* es extracto, no
  lectura. **Lección:** con varios subagentes, repartir el cupo o darle a cada uno un tope de búsquedas.
- **Dos hipótesis falsas encadenadas, la segunda mía:**
  1. Que los anuncios del 21-sep solo tenían mal el precio. Mirando el código de producción, el problema era
     mayor: producción **no** detecta el tratamiento a medias (solo *sin visita ≥180 días*).
  2. **Que la 1.0 tampoco lo detectaba.** Lo afirmé en los docs, en EL HILO y en un aviso directo a Plataforma
     (03:52 UTC), y propuse construirlo en 3–7 días. **Era falso:** en la 1.0 lo busqué con un `grep` sobre
     *una* función (`evaluateRecallCandidates`, sigue en 180) y generalicé; el módulo
     `agents-tratamiento-a-medias.ts` (21 días, decisión de Sergio Urcullo del 29-sep) estaba al lado. Lo
     marcó el plan de Plataforma. Corregido en todos los lugares con la marca ⚠️ y con un aviso de corrección.
     **Lección:** un `grep` sirve para descartar, nunca para confirmar una ausencia; para decir "ningún agente
     lo hace" se lista el módulo entero (`ls lib/onia-core/modules/`).
- **Renderizar en la nube, cuatro intentos (30-sep, tarde):**
  1. Chromium completo con `CAROUSEL_BROWSER`: letra DejaVu, pie cortado y capturas vacías.
  2. Fuentes instaladas en WOFF: fontconfig las lista, Chromium no las toma.
  3. `--proxy-server` apuntando al proxy de la sesión: tampoco trae las fuentes.
  4. `headless_shell` más fuentes en **TTF**: sale igual que en la PC. Quedó en `scripts/carousel_cloud_setup.sh`.

  Las capturas vacías eran otra cosa: el carrusel del 21-sep apuntaba a `docs/recorrido/capturas/`, que está en
  `.gitignore`. **Lección:** antes de dar por buena una pieza renderizada en otra máquina, mirar que sus
  capturas estén versionadas.
- **Frase que hubo que corregir en la misma sesión:** escribí que ningún competidor *ofrece* el agente que
  propone a quién recuperar. Lo medido es que ninguno lo *titula* en su pauta; la web de Dentalink anuncia
  *recall* y *"venta de tratamientos"* (sin abrir). Quedó corregido en `ONIA_CLIENTE_IDEAL.md` §2.
- **Sin llave del VPS en esta sesión:** no se pudo re-medir la cuenta ONIA Ads por Graph API, ni los leads, ni
  los pagos. Lo que dice "no re-medido hoy" viene de handoffs del 21 y 27-sep.
- **`ads_create_ad` trabaja en modo borrador** (leído en el conector el 1-oct): los anuncios quedan en DRAFT, y
  `ads_activate_entity` sobre la campaña **los publica en ACTIVO, gastando**. «Crear en pausa» termina antes de
  esa llamada (§5.8.1).
- **Las capturas candidatas enteras se veían como manchas** dentro del marco de ~450×300 del pack. Recortarlas
  a la tarjeta que prueba el punto duplicó el tamaño legible. No alcanza para leer todo en el celular.
- **Cada `ads_library_search` trae solo el título del enlace**, no el texto ni la imagen del anuncio, y corta en
  50 resultados. Con estado ALL no devuelve los inactivos: no se sabe cuándo dejó de pautar Cames.

**Qué depende de Sergio Urcullo** (lo mínimo, en orden)

1. **Decidir la cuenta demo:** el 1-oct dijo «no se crean demos». ¿Eso incluye la cuenta para mostrar Onia en
   las demos de venta? Sin ella no se puede hacer ninguna (`sales-kit/02-GUION-DEMO.md` §0.1).
2. **OK a los mensajes** de los leads que ya escribieron (`ONIA_LEADS_ESPERANDO.md` §3).
3. **Mirar D1 y D4 renderizadas** (`carousels/out/ads/*-candidato/_contactsheet.png`) y decir: sirven / la
   captura no se lee.
4. **OK al primer lote de mensajes 1:1** de la página de 28, después de la verificación de la tabla de abajo.
5. **Meta:** reconectar el conector con el usuario que administra ONIA Ads, poner la tarjeta en ONIA Ads,
   confirmar la página «Onia» y su WhatsApp, y averiguar a qué tipo de cambio cobra el banco. Después, el OK de
   gasto con techo (USD 140, 14 días).
6. Lo de siempre: quién contesta las conversaciones de la pauta (fila 6 de §5.9) y la fecha del CIO 2026.

**Próximos pasos** (sucesora, en orden; cada uno con su «listo»)

1. **Verificar los 28 prospectos** con la tabla de abajo → *listo = cada fila marcada sigue / sale, con el dato
   que la decide anotado en su doc fuente*.
2. Mostrarle a Sergio Urcullo los mensajes de los que siguen, y los de los leads → *listo = OK por escrito,
   mensaje por mensaje*. Los envía él.
3. Llenar el registro de objeciones el mismo día de cada demo (`ONIA_PROSPECTOS_DENTAL_SCZ.md` §7 y
   `ONIA_PROSPECTOS_OTROS_RUBROS_SCZ.md`, «Registro de objeciones»). Regla: 10 demos y nadie paga → se
   cambia el producto, no el discurso.
4. D1 y D4: con el OK de Sergio Urcullo a las capturas, copiarlas a la carpeta aprobada, re-renderizar y
   mostrarlas → *listo = piezas aprobadas viéndolas*.
5. Cuando `ads_get_ad_accounts` liste `1073680778314945`, crear la campaña con §5.8.1 **hasta el paso 6** →
   *listo = ids anotados acá*. Encender (paso 7) solo con el OK escrito de gasto.

### Verificar los 28 prospectos (qué abrir y qué confirmar)

En **todos**: (a) que sea de **Santa Cruz**; (b) que tenga **2 a 6** profesionales o empleados; (c) que tenga un
**WhatsApp** propio y activo; (d) que el anuncio siga **activo**; (e) releer la línea «Vi…» del mensaje contra lo
que se ve ese día. Si falla (a) o (b), sale y entra uno de la reserva de su doc. La columna «Además» es lo propio
de cada uno. Ids de anuncio = `facebook.com/ads/library/?id=<id>`.

| # | Negocio | Abrir | Además |
|---|---|---|---|
| D1 | Odontoking Clínica Dental | facebook.com/odontoking.scz · wa.me/59162000223 | web odontoking.com: siguen 4+ doctores. ¿Es «F», el lead de conv 35 (+59173232758)? Si sí, NO se le escribe por acá |
| D2 | Clínica Dental San Pedro | facebook.com/ads/library/?id=4488078054763407 · instagram.com/clinica_dental_san_pedro · wa.me/59175310054 | web clinicadentalsanpedro.com.bo: contar profesionales (riesgo de pasar de 6) |
| D3 | Nexo Odontología Integral | wa.me/59172102164 | web nexoodontologiaintegral.com: contar profesionales |
| D4 | Clínica Dental Cortez (sede Santa Cruz) | facebook.com/ads/library/?id=28382463031414540 · instagram.com/clinicadentalcortez_santacruz · wa.me/59174165595 | web clinicadentalcortez.com.bo: que el WhatsApp sea de la sede SCZ; contar profesionales |
| D5 | Clínica Dental Jáuregui | instagram.com/clinica.dental.jauregui | contar profesionales |
| D6 | Odontoclínica | instagram.com/odontoclinicabo · wa.me/59170202576 | contar profesionales |
| D7 | Clínica Dentalife (SRL) | instagram.com/clinicadentalifesrl | contar profesionales |
| D8 | Clínica Dental Camacho | instagram.com/clinicadentalcamacho | contar profesionales; ¿siguen publicando? |
| D9 | Clínica Dental Ezequiel – Spadental | facebook.com/ads/library/?id=957751963254738 · facebook.com/758264870991469 | ciudad SCZ; ¿más de un doctor? Si es 1, sale |
| D10 | MUN Clínica Odontología Especializada | facebook.com/ads/library/?id=1586919549733766 · facebook.com/572588712615373 | ciudad SCZ (si no, sale); cuántos especialistas |
| E1 | Serderma – Skin Care & Repair | facebook.com/ads/library/?id=1627500379414059 · facebook.com/106801775686899 | Ciudad: solo la ubica en Santa Cruz la búsqueda de Mercado. Un título dice «Perfil nuevo»: confirmar que ésa es la página vigente |
| E2 | Dermamedic | facebook.com/ads/library/?id=1483115053721898 · facebook.com/1427662330819904 | Si es estética o consulta dermatológica médica. Contar profesionales: si pasa de 6, sale |
| E3 | DASHA SPA SCZ | facebook.com/ads/library/?id=954501251031123 · facebook.com/104974815691833 | Tamaño y recepción. Que no sea una cadena con sucursales |
| E4 | Pimentel Centro Estético y Spa | facebook.com/ads/library/?id=917663934510569 · facebook.com/104724632014604 | Ciudad y tamaño. Si el mensaje sale del lunes 5-oct en adelante, cambiar «esta semana» |
| E5 | JP Body Sculpt Estética | facebook.com/ads/library/?id=1100160929651066 · facebook.com/447449838452412 | Ciudad y tamaño. Que sea estética corporal («Body Sculpt» lo sugiere [inferencia]). Si lo central es vender paquetes de sesiones, sale: Onia no los tiene y en la demo … |
| E6 | FisioBel – Fisioterapia y Belleza | facebook.com/ads/library/?id=2250081115857981 · facebook.com/163134980227265 | Si pesa más la fisioterapia que la belleza: el pack es de estética y habla de «clientas». Tamaño |
| E7 | Spa Norvet | facebook.com/ads/library/?id=2169920297256782 · facebook.com/1115743118298684 | Ciudad y tamaño. Si el mensaje sale del lunes 5-oct en adelante, cambiar «esta semana» |
| E8 | Spa Corpo Belo | facebook.com/ads/library/?id=1791957192125527 · facebook.com/108487890540798 | Que las promociones sigan. Si vende sobre todo paquetes. El mensaje no repite sus precios |
| E9 | Gelinski Medicina Estética & Spa | facebook.com/ads/library/?id=1404213515022283 · facebook.com/1065901009942124 | Ciudad: la búsqueda no decía Santa Cruz. Contar profesionales: si es una sola médica, sale. Si es medicina estética más que spa |
| E10 | Afrodita Medicina Estética central | facebook.com/ads/library/?id=28654751507525138 · facebook.com/1099521206570111 | Ciudad. Si tiene sucursales, sale (multi-sede). Tamaño |
| E11 | PUNTO SPA | facebook.com/ads/library/?id=3231165610411166 · facebook.com/1775902156003112 | Ciudad y tamaño. «Peel + peeling + puntas de diamante» puede ser un combo: si vende sobre todo paquetes, sale |
| E12 | Gloss Skin Spa | facebook.com/ads/library/?id=1612878703668081 · facebook.com/212395831963932 | Ciudad y tamaño. Que la pauta siga: son 2 anuncios de un solo día |
| I1 | Todo Frenos Bolivia | facebook.com/ads/library/?id=2299529400584400 · facebook.com/1635734929973915 | Ciudad. Si importa directo o le compra a un importador (si no importa, el costeo no le sirve). Si a los talleres les vende con precio por cliente |
| I2 | Importadora Jhimbo y Jhimbo Importadora | facebook.com/ads/library/?id=1752608759191474 · facebook.com/103300217870326 · facebook.com/2242967225958211 | Ciudad. Por qué hay dos páginas: si son dos sedes, Onia no tiene multi-sede. Si vende en dólares |
| I3 | Importadora ReMel Medical y REMEL Medical SC | facebook.com/ads/library/?id=1824706905373809 · facebook.com/107403528165762 · facebook.com/918686151335600 | Si «SC» es Santa Cruz. Qué importa («Medical» sugiere insumos médicos [inferencia]). Si vende por licitación o con precio por cliente, no calza |
| I4 | EMTOP Bolivia – SCZ | facebook.com/ads/library/?id=1383787037302290 · facebook.com/303629722824572 | Tamaño. Si importan ellos o compran al representante de la marca («herramientas EMTOP» es [inferencia] por el nombre). Si a las ferreterías les venden con lista por cl… |
| I5 | Importadora Quevedo | facebook.com/ads/library/?id=1671744687713413 · facebook.com/1562055387425917 | Qué importa: no se sabe (los títulos no lo dicen). Ciudad. Moneda de la cuenta USD: si también vende en dólares, no calza. Si cotiza por WhatsApp, en la demo no se mue… |
| I6 | Importadora KAIS | facebook.com/ads/library/?id=899867776391088 · facebook.com/101059708412214 | Qué importa: no se sabe. Ciudad y tamaño. Si vende al por mayor con precio por cliente, no calza |

<details><summary>Próximos pasos del 30-sep (historia)</summary>

1. Sergio Urcullo contesta a los 5 → *listo = cinco respuestas enviadas, con capacidades verificadas en el producto*.
2. Plataforma responde por EL HILO los pedidos del 2.º aviso (bot para pauta, BSUID, `referral`) → *listo =
   respuesta anotada en EL HILO*.
3. ✅ **Lista de las primeras clínicas para contacto 1:1 (30-sep, de noche):** quedaron 8 de 10 en
   `ONIA_PROSPECTOS_DENTAL_SCZ.md` §6. Cada una trae señal, fuente, canal público y mensaje propuesto; en §6.4 hay
   una reserva para los 2 cupos que faltan. §7 es el registro de objeciones de las demos.
   - Página para Sergio Urcullo, con «Copiar» y «Abrir en WhatsApp»: https://claude.ai/artifact/8sFD37TVJMcEJaHcZ2PWSV.
   - **Nadie fue contactado**: cada envío espera su OK.
   - Nada se re-verificó en vivo, porque el proxy bloqueó las webs, Facebook e Instagram. Por eso cada ficha trae
     su lista «Antes de enviar».
   - *Siguiente:* con las respuestas, llenar §7 y cargar las demos en el tablero de Control.
   - **Ampliado el 30-sep, de noche** (Sergio Urcullo: *«no solo somos clínica»*):
     - `ONIA_PROSPECTOS_OTROS_RUBROS_SCZ.md` suma 8 de estética y 5 importadoras, con mensaje.
     - Comercio y servicios: 5 candidatos cada uno, sin mensaje hasta que la 1.0 arregle lo que falla en una
       demo.
     - Los 21 están en la misma página, separados por rubro.
     - Estética e importadora salen de la Biblioteca de Anuncios, que busca por texto: ciudad y tamaño quedan
       sin verificar.
4. Destrabar los 8 bloqueos de `ONIA_ADQUISICION_Y_PAUTA.md` §6 → *listo = `ads_get_ad_accounts` ve ONIA Ads con
   método de pago y página promocionable*.
5. Creativos (**los hace esta sesión**): llegan las cuatro capturas de la 1.0 → se renderizan D1 y D4 con `scripts/carousel_cloud_setup.sh` → se le muestran a Sergio Urcullo →
   *listo = piezas miradas y aprobadas por él, sin precio en la imagen, CTA "Escribinos", código por anuncio*.
   (Briefs listos desde el 30-sep.)
6. Crear la campaña en PAUSA con la tabla del §5.8 → *listo = ids de campaña/conjunto/anuncios anotados acá*.
7. Encender con el OK de Sergio Urcullo; mirar a los 7 días, decidir a los 14 → *listo = costo por
   conversación calificada medido y anotado en `ONIA_ADQUISICION_Y_PAUTA.md` §5.3 como benchmark propio*.

</details>
