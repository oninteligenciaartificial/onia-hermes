# Handoff — carril `mercado-y-pauta` (sesión «Ventas y pauta Onia Platform», antes «Análisis de mercado»)

> ⏩ **1-oct, vigente: el carril sigue en la NUBE** (`session_01BnctfaNRsm3ogJ46A7B5P5`). Rige la regla nueva
> de `CLAUDE.md`: la madre corre local y ordena por mensaje, y esta sesión contesta en su transcript. Lo que
> exige la PC (Facebook, Instagram o el Administrador de anuncios con el login de Sergio Urcullo) lo hace la
> madre. El aviso anterior, «pasa a una sesión local», quedó sin efecto.
>
> **1-oct, tarde — tareas de la madre, estado.** Pruebas por vencer: las mira la madre en la PC (aquí no
> hay VPS); borradores A/B en el transcript. D1/D4 renderizadas con las capturas candidatas recortadas
> (`3834f60a`): **esperan el OK de Sergio Urcullo a las capturas y a las piezas**. El marco de captura del pack
> mide ~450×300 y en el celular se lee justo: si no alcanza, la salida es un layout de captura a todo ancho
> en el renderer compartido. Cupos 9-10 dentales (Spadental, MUN) en `ONIA_PROSPECTOS_DENTAL_SCZ.md` §6.5.
> Estética e importadora re-leídas en vivo (`c6a4caa5`): 12 y 6; Cames bajó a reserva. Pasos para crear
> la campaña en pausa en `ONIA_ADQUISICION_Y_PAUTA.md` §5.8.1. **Trampa:** `ads_create_ad` deja
> borradores y `ads_activate_entity` los publica en ACTIVO. Borradores para los 6 leads, verificados
> contra el código de la 1.0, en `ONIA_LEADS_ESPERANDO.md` §3: el de 4 doctores sale **solo con la 1.0
> publicada**. Página: https://claude.ai/artifact/8sFD37TVJMcEJaHcZ2PWSV (28 negocios). **Intento fallido:**
> el conector de Meta sigue sin ver ONIA Ads (re-medido el 1-oct a las 20:15 UTC).
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

**Qué quedó a medias, y dónde**

- **La campaña de Meta: especificada, NO creada** (`ONIA_ADQUISICION_Y_PAUTA.md` §5.8). La crea la sesión que
  tenga el conector de Meta Ads en la cuenta ONIA Ads, o Sergio Urcullo a mano, en PAUSA. **Se enciende con
  la 1.0 publicada y la medición probada** (plan de 14 días de la sesión principal, 30-sep): **qué falta y de
  quién es, en la lista de encendido (§5.9)**.
- ⚠️ **Corregido 30-sep ~19:55 UTC: D1 y D4 VUELVEN a esta sesión.** A las 14:40, Sergio Urcullo le dijo a
  Marca personal *«aquí es solo marca personal y comunidad»* y ellos no las tomaron. A la noche confirmó que
  esta sesión, Ventas y pauta, maneja Meta con las piezas incluidas. El párrafo de abajo es historia.
- ~~**Piezas D1 y D4: ENTREGADAS a Marca personal**~~ (Sergio Urcullo, 30-sep: los carruseles son de Marca
  personal; Mercado no los genera). Pasaron en el prompt de arranque de su sesión de la nube
  `session_012ppFowADbJNtZ6WBMtqpuf`. A Mercado le queda qué dice y qué prueba cada pieza (§5.4 y §5.8); el
  diseño y el render son de ellos. Lo que sigue es cómo quedaron al entregarlas.
  **Briefs escritos y renderizados de prueba, esperando las capturas de la 1.0**
  (`carousels/briefs/ads/onia-platform-dental-meta-d1-los-de-manana.json` y `…-d4-tratamiento-a-medias.json`).
  Las cuatro capturas las pidió Mercado a la sesión principal (EL HILO, 30-sep ~12:40 UTC) y van en
  `carousels/briefs/assets/onia-1.0-dental-ads/`, cuyo README dice qué se ve en cada una. Mientras falten, esas
  láminas salen con *"Falta la captura aprobada del producto"*. **Cómo se retoma cuando lleguen:**
  `eval "$(sh scripts/carousel_cloud_setup.sh)"` y después
  `node scripts/carousel_render.js --brief <brief> --out hermes-content/carousels/out/ads/<nombre>`; se miran
  las 7 láminas de cada una y se le muestran a Sergio Urcullo. **D4 reemplaza al carrusel del 21-sep**, que queda
  sin usar.
- **Pedidos abiertos** (EL HILO, 30-sep): a Plataforma, página de entrada para clínicas (BSUID y agentes
  quedaron anotados por ellos para v1.x/v2.0). **El bot listo para pauta y el `referral` que Chatwoot descarta
  son del carril chatbot**, no de Plataforma (lo aclararon a las 04:02 UTC), y ese carril **no tiene sesión
  viva**: lo asigna Sergio Urcullo. Plataforma quedó en pausa la noche del 30-sep y retoma el 1-oct. El punto
  del Recall **se retiró**: ya estaba en la 1.0 (ver *Intentos fallidos*).

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

**Qué depende de Sergio**

1. **Contestar a los que ya escribieron** (`ONIA_LEADS_ESPERANDO.md`) — es gratis y es el paso 1 del orden de
   canales. Ver la hipótesis *Clínica Dental "DS"* en `ONIA_PROSPECTOS_DENTAL_SCZ.md` §5.1.
2. **Publicar la 1.0** cuando la veas lista: trae el Recall de tratamiento a medias, el origen de cada alta y el
   píxel liviano, que destraban el mejor ángulo de pauta y la medición por web. Y **confirmar con tus palabras
   que el segundo rubro es importadora** (llegó por el aviso de Plataforma; su propio doc recomendaba estética).
3. **Para la pauta:** tarjeta en ONIA Ads · vincular la página "Onia" en Business Manager · confirmar el WhatsApp
   de Onia en la página · **reconectar el conector de Meta Ads** en `claude.ai/customize/connectors` con el
   usuario que administra ONIA Ads (y abrir sesión nueva) · saber a qué tipo de cambio le cobra el banco la
   tarjeta (cambia el techo de CAC a la mitad, §5.6) · **OK explícito de gasto con techo**.
   **Para encender, además** (§5.9): decidir **quién contesta las conversaciones y en cuánto tiempo**
   (fila 6), porque el carril chatbot sigue sin dueño; publicar la frase-prefijo del bot y probarla con dos
   mensajes (fila 5); aprobar D1 y D4 **viéndolas renderizadas**.
4. **Confirmar la fecha del CIO 2026** (Congreso Internacional de Odontología de Santa Cruz; en 2025 fue del 1
   al 3 de octubre): si es estos días, ir vale más que la primera semana de pauta.
5. **La observación incómoda** (`ONIA_ADQUISICION_Y_PAUTA.md` §4): de las tres sesiones de marketing, solo
   ésta apunta al comprador de la etapa 1. Marca personal y Lucía construyen autoridad, no traen clínicas. Es
   decisión suya si sigue así; acá solo quedó la cuenta a la vista.

**Próximos pasos** (en orden; cada uno con su "listo")

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
