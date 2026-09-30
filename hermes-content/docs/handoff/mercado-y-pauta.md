# Handoff — carril `mercado-y-pauta` (sesión «Análisis de mercado Onia Platform»)

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
  tenga el conector de Meta Ads en la cuenta ONIA Ads, o Sergio Urcullo a mano, en PAUSA.
- **Los creativos del 21-sep, sin corregir a propósito.** La lámina 8 del carrusel
  (`carousels/briefs/ads/onia-platform-dental-meta-20260921-carousel.json`, slide `cta`) dice *"Desde Bs
  320/mes"* (Básico, sin agentes) y *"CREÁ TU CUENTA"*. **No se re-renderizó** porque el ángulo entero
  (*"¿cuántos tratamientos quedaron a medias?"*) depende de que exista el Recall de tratamiento a medias: si
  Plataforma lo construye, se corrige solo la lámina 8 (sin precio, CTA *"Escribinos"*); si no, cambia el
  ángulo. Además `node_modules` no está instalado en esta máquina. Se hace **cuando se vaya a encender**.
- **Pedidos a Plataforma sin respuesta todavía** (EL HILO, 2.º aviso del 30-sep): Recall de tratamiento a
  medias para la 1.0, BSUID, bot listo para pauta, `referral` que Chatwoot descarta, `utm` en la web.

**Archivos y cambios**

- Nuevo: `hermes-content/docs/ONIA_ADQUISICION_Y_PAUTA.md` — fuente sin fecha de *cómo se consiguen clientes*.
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
- **Hipótesis que resultó falsa:** que los anuncios del 21-sep solo tenían mal el precio. Mirando el código, el
  problema es mayor: **el Recall no detecta el tratamiento a medias** (solo *sin visita ≥180 días*), así que la
  portada misma promete algo que el agente no hace.
- **Frase que hubo que corregir en la misma sesión:** escribí que ningún competidor *ofrece* el agente que
  propone a quién recuperar. Lo medido es que ninguno lo *titula* en su pauta; la web de Dentalink anuncia
  *recall* y *"venta de tratamientos"* (sin abrir). Quedó corregido en `ONIA_CLIENTE_IDEAL.md` §2.
- **Sin llave del VPS en esta sesión:** no se pudo re-medir la cuenta ONIA Ads por Graph API, ni los leads, ni
  los pagos. Lo que dice "no re-medido hoy" viene de handoffs del 21 y 27-sep.

**Qué depende de Sergio**

1. **Contestar a los que ya escribieron** (`ONIA_LEADS_ESPERANDO.md`) — es gratis y es el paso 1 del orden de
   canales. Ver la hipótesis *Clínica Dental "DS"* en `ONIA_PROSPECTOS_DENTAL_SCZ.md` §5.1.
2. **Decidir con Plataforma si el Recall de tratamiento a medias entra en la 1.0** (evidencia en la estrategia §14).
3. **Para la pauta:** tarjeta en ONIA Ads · vincular la página "Onia" en Business Manager · confirmar el WhatsApp
   de Onia en la página · **reconectar el conector de Meta Ads** en `claude.ai/customize/connectors` con el
   usuario que administra ONIA Ads (y abrir sesión nueva) · saber a qué tipo de cambio le cobra el banco la
   tarjeta (cambia el techo de CAC a la mitad, §5.6) · **OK explícito de gasto con techo**.
4. **Confirmar la fecha del CIO 2026** (Congreso Internacional de Odontología de Santa Cruz; en 2025 fue del 1
   al 3 de octubre): si es estos días, ir vale más que la primera semana de pauta.
5. **La observación incómoda** (`ONIA_ADQUISICION_Y_PAUTA.md` §4): de las tres sesiones de marketing, solo
   ésta apunta al comprador de la etapa 1. Marca personal y Lucía construyen autoridad, no traen clínicas. Es
   decisión suya si sigue así; acá solo quedó la cuenta a la vista.

**Próximos pasos** (en orden; cada uno con su "listo")

1. Sergio Urcullo contesta a los 5 → *listo = cinco respuestas enviadas, con capacidades verificadas en el producto*.
2. Plataforma responde por EL HILO sobre el Recall de tratamiento a medias → *listo = decisión escrita en
   `cola/plataforma-v1.md`*.
3. Lista de las primeras 10 clínicas para contacto 1:1 (cruce de §1 y §5 de `ONIA_PROSPECTOS_DENTAL_SCZ.md`,
   ciudad y tamaño verificados) con el subagente `onia-crm-prospeccion` → *listo = 10 filas con fuente y mensaje
   propuesto, esperando el OK de Sergio Urcullo*.
4. Destrabar los 8 bloqueos de `ONIA_ADQUISICION_Y_PAUTA.md` §6 → *listo = `ads_get_ad_accounts` ve ONIA Ads con
   método de pago y página promocionable*.
5. Corregir y re-renderizar los creativos según el Recall (§5.4) → *listo = piezas miradas, sin precio del
   Básico, CTA "Escribinos", código por anuncio*.
6. Crear la campaña en PAUSA con la tabla del §5.8 → *listo = ids de campaña/conjunto/anuncios anotados acá*.
7. Encender con el OK de Sergio Urcullo; mirar a los 7 días, decidir a los 14 → *listo = costo por
   conversación calificada medido y anotado en `ONIA_ADQUISICION_Y_PAUTA.md` §5.3 como benchmark propio*.
