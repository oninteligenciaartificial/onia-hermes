> **Foto de investigación del 2026-09-30 (carril Mercado, sesión «Análisis de mercado Onia Platform»).** No es fuente de verdad: lo vigente está en `ONIA_ADQUISICION_Y_PAUTA.md`, `ONIA_CLIENTE_IDEAL.md` y `ONIA_ESTRATEGIA_DE_EMPRESA.md` §14. Los avisos de este texto sobre "cambios sin commitear" en otros docs se refieren al árbol durante la sesión y ya quedaron resueltos en esos docs.

# Investigación A — Mercado y competencia para ONIA (Santa Cruz, Bolivia)

> Fecha: **2026-09-30**. Solo lectura del repo; único archivo escrito: este.
> Para: Sergio Urcullo. No es fuente de precios (esos mandan en `subscription-plans.ts` / `pricing.ts`).

## Cómo se hizo y qué limitó la investigación (leer antes de usar los números)

- **La red de esta sesión bloquea abrir páginas** (403 del proxy a todo dominio probado:
  `impuestos.gob.bo`, `seprec.gob.bo`, `ine.gob.bo`, `minsalud.gob.bo`, `santacruzodontologos.com`,
  `web.archive.org`, `eldeber.com.bo`, `softwaredentalink.com`, `doctocliq.com`, `agendapro.com`…).
  No se reintentó ni se rodeó. Todo dato web viene **del extracto que devuelve el buscador**.
- **El cupo de búsquedas web de la sesión se agotó (200/200)** a mitad del relevamiento de competidores.
  Lo que faltaba se cerró con la **Biblioteca de Anuncios de Meta** (MCP, consulta directa, país `BO`),
  que sí respondía. Los creativos (`ad_snapshot_url`) **no se abrieron**: se leyó el metadato.
- Etiquetas usadas:
  - **[verificado: fuente primaria]** = consulté la fuente misma (Biblioteca de Meta vía API; repo).
  - **[primaria vía buscador]** = el dato es de la fuente oficial (SIN, SEPREC, OMS, web del vendedor),
    pero lo leí en el extracto del buscador, sin poder abrir la página. Primaria en origen, no en contexto.
  - **[secundaria]** = medio, blog, agregador. **[inferencia]** = cálculo mío, con método a la vista.
- Todo lo que el repo ya tenía (SEPREC 117.894 unidades en SCZ, ~15.000 odontólogos 2019, precios de
  Kommo/HighLevel/Botmaker/Respond.io/Dapta/Lety/Dentalink/AgendaPro, pauta del 15-ago, SendyPro) **no se
  repite**; solo se cita cuando este informe lo corrige o lo actualiza.

---

## 0. Respuesta corta

1. **Dental en Santa Cruz sigue siendo la mejor combinación de tamaño + dolor + acceso para una persona**,
   pero el segmento exacto (2–6 profesionales con recepción) es **más chico de lo que dice
   `ONIA_CLIENTE_IDEAL.md` §7**: estimo **~150–400 clínicas** en el departamento **[inferencia]**.
   Alcanza holgado para **5 clientes (1–3 % del segmento)**; para **40** habría que ganar **1 de cada 4 a
   10** clínicas del segmento. El techo de 40 no se llena solo con dental-SCZ.
2. **El 30-sep-2026 no se encontró una nueva prórroga**: desde el **1-oct-2026** los grupos 9°–12° emiten
   solo en línea (RND 102600000007). Es una lista nominal (~27.000 NIT conocidos entre 10°, 11° y 12°), no
   todo el padrón. **La urgencia fiscal grande que viene es otra: el IVA "por fuera" de la Ley 1733**, con
   pruebas piloto de sistemas del **1-oct al 16-nov-2026** (RND 102600000034) — golpea más a comercio e
   importadoras que a clínicas, y ONIA no puede montarse encima (emisor propio al 24,8 % de la fase 1).
3. **Competencia real en dental/clínicas**: Healthatom (Chile) con **Dentalink y Medilink pautando en
   Bolivia sin parar desde junio**, todo en USD y todo con "IA" clínica (dictar fichas, RX, simular
   sonrisa, resumen clínico); y **TuDoc, un software médico boliviano con agenda + historia clínica +
   facturación SIAT + IA** que el repo no tenía registrado. **Nadie de los vistos titula con "pacientes
   que dejaron el tratamiento a medias"**: ese hueco sigue libre.
4. **Comercio/ferretería es océano rojo**: ≥12 vendedores locales pautan software de ventas/inventario en
   BOB esta semana. **Estética** tiene 5× más avisos que dental en SCZ, pero es muy fragmentada
   (marcas de una sola profesional, sin recepción).
5. **Cómo se llega a la clínica**: Meta/Instagram + WhatsApp (las clínicas ya pagan pauta), educación
   continua (diplomados que pautan en BOB), el Colegio de Odontólogos de SCZ (Jornadas Odontológicas
   Cruceñas) y el **CIO — Congreso Internacional de Odontología de Santa Cruz**, que en 2025 fue el
   **1–3 de octubre**: la edición 2026 podría estar ocurriendo estos días (fecha no verificada).

---

## 1. Tamaño del mercado por rubro

### 1.1 Base general (para todos los rubros)

| Dato | Valor | Fuente · fecha | Nivel |
|---|---|---|---|
| Unidades económicas en SCZ | **118.308** (29,9 % del país) | SEPREC, Información Estadística a sep-2025 — [PDF](https://www.seprec.gob.bo/wp-content/uploads/2025/11/Informacion-ESTADISTICA-WEB-SEP.pdf) · [Los Tiempos 24-sep-2025](https://www.lostiempos.com/actualidad/pais/20250924/santa-cruz-concentra-casi-30-empresas-bolivia-lidera-creacion-nuevas) | [primaria vía buscador] (el repo tenía 117.894 a ago-2025) |
| Base empresarial nacional | ~395.800 unidades | derivado de 136.559 = 34,5 % (mismo PDF) | [inferencia] |
| Contribuyentes activos (NIT) | **500.208**; Régimen General **347.618** | SIN, Memoria ene–oct 2025 — [PDF](https://www.impuestos.gob.bo/wp-content/uploads/2025/11/105409f7900.pdf) | [primaria vía buscador] |
| Participación de SCZ en el padrón | **27,82 %** → ~139.000 NIT; ~96.700 en RG si se aplica igual proporción | mismo PDF | cifra [primaria vía buscador]; el reparto por RG es [inferencia] |

### 1.2 Dental

| Dato | Valor | Fuente · fecha | Nivel |
|---|---|---|---|
| Establecimientos dentales registrados por el SEDES en el **departamento** de SCZ | **125 clínicas + 1.812 consultorios** "legalmente establecidos" | Nota del SEDES SCZ en [Econoticias](https://www.econoticias.com.bo/sedes-notifica-y-clausura-consultorios-dentales/). Sin fecha visible; menciona "jueves 24 de mayo" → **2018** (o 2012) | [secundaria]; **posiblemente vieja (~8 años)**; fecha [inferencia] |
| Informalidad en consultorios dentales | Tarija (Cercado): de ~150 consultorios, **solo 37 (25 %)** tenían aval del SEDES | [El País, Tarija](https://www.elpaisonline.com/index.php/noticiastarija/item/156507-de-150-consultorios-dentales-solo-37-tienen-el-aval-del-sedes) — fecha no visible | [secundaria], **fecha desconocida** |
| Odontólogos en Bolivia (OMS) | **2.014** (2017), 1,8 por 10.000 hab. | [Perfil OMS de salud oral de Bolivia 2022](https://cdn.who.int/media/docs/default-source/country-profiles/oral-health/oral-health-bol-2022-country-profile.pdf) | [primaria vía buscador]; **vieja y probablemente subcontada** (reporte oficial al sistema público) |
| Odontólogos (otra estimación) | "1 dentista por cada 1.600 personas" → ~7.070 con 11,31 M hab. (Censo 2024) | [bolivia.com](https://www.bolivia.com/noticias/autonoticias/DetalleNoticia15277.asp) (fecha no visible; cita un estudio de fuerza laboral en salud) | cifra [secundaria]; cálculo [inferencia] |
| Colegio de Odontólogos de Bolivia en la FDI | 1.200 miembros declarados | [FDI](https://www.fdiworlddental.org/colegio-de-odontologos-de-bolivia) | [secundaria]; es membresía FDI, no padrón |
| Unidades de "servicios de salud y asistencia social" en SEPREC | **7.102 a nivel nacional** (1,8 %); SCZ ≈ 2.100 si pesa 29,9 % | SEPREC sep-2025 (PDF arriba) | nacional [primaria vía buscador]; SCZ [inferencia]. Incluye médicos, labs, etc. **Subcuenta dental**: el profesional independiente no siempre se registra en SEPREC |
| Colegio de Odontólogos de SCZ | **No publica padrón** en línea (ya anotado en `ONIA_PROSPECTOS_DENTAL_SCZ.md`) | — | no hay dato 2025–2026 |

**Estimación: clínicas con 2–6 profesionales en SCZ** [inferencia, método explícito]

- **Método A (estructura SEDES):** 125 "clínicas" (≈ multi-sillón / multi-profesional) en ~2018.
  × 1,2–1,4 de crecimiento a 2026 × 1,0–1,5 por las no registradas (las clínicas grandes se registran más
  que el consultorio de uno, por eso el factor es menor que el 4× de Tarija) × 75–85 % concentradas en la
  capital → **~110–220 clínicas en la ciudad**.
- **Método B (odontólogos):** 7.000–15.000 odontólogos en el país × 30–35 % en SCZ × 15–25 % trabajando en
  consultas de 2–6 profesionales ÷ 3 profesionales promedio → **~105–440 consultas**.
- **Rango triangulado: ~150–400 establecimientos** (punto medio ~250). Señal de consistencia: solo en una
  búsqueda de avisos activos ("clínica dental Santa Cruz", 30-sep) aparecen **~20 clínicas dentales
  distintas pagando pauta** [verificado: fuente primaria, Biblioteca de Meta].
- **Qué implica:** 5 clientes = **1,3–3,3 %** del segmento → factible. 40 clientes = **10–27 %** → muy
  exigente para una persona con un solo rubro y una sola ciudad. Matiza `ONIA_CLIENTE_IDEAL.md` §7
  ("alcanza, y por mucho"): alcanza para la etapa 1; el techo de soporte pide sumar estética (mismo
  producto) o Cochabamba/La Paz más adelante.
- Señales de que existe el puesto de recepción/asistente (criterio 2 del cliente ideal): "Enfocate Santa
  Cruz" pauta el curso *"Conviértete en Asistente Dental"* (aviso 1045177421443735, 2026-08-24, BOB)
  [verificado: fuente primaria]. Señal del extremo chico: se alquilan consultorios equipados por turno
  (*"CONSULTORIO EQUIPADO EN ALQUILER ODONTOLÓGICO DENTAL 📍4to Anillo"*, aviso 915622974340688,
  2026-08-10, BOB) → hay muchos odontólogos de un solo sillón, que no son cliente ideal [inferencia].

### 1.3 Estética / spa

- **No encontré ningún conteo oficial** (SEDES, SEPREC por actividad, cámaras). No se inventa.
- Proxy de actividad comercial: la búsqueda de avisos **activos** "estética Santa Cruz" en BO devuelve
  **280** avisos vs **56** de "clínica dental Santa Cruz" (30-sep) [verificado: fuente primaria]. En la
  muestra dominan marcas personales ("Dra. Rebeca Nunes", "Dra. Helen Rojas", "Dra. Melissa Torres",
  "SPA Skarleth García", "JP Body Sculpt Estética", "Derma Peel", "Spa Corpo Belo", "Essenza Consultorio
  médico y Estética", "Kallos Institute") → **más numeroso y más activo en Meta, pero fragmentado**: muchas
  no tendrán recepción ni 2+ profesionales [inferencia].

### 1.4 Comercio / ferretería

| Dato | Valor | Fuente · fecha | Nivel |
|---|---|---|---|
| Comercio al por mayor y menor (incl. reparación de vehículos) en SCZ | **42.587** unidades (36,1 % de SCZ); 136.559 nacional (34,5 %) | SEPREC sep-2025 (PDF arriba) | [primaria vía buscador] |
| Ferreterías específicamente | **No desagregado** en lo que pude leer | — | sin dato |
| Ferreterías que pautan (SCZ, activos, 30-sep) | 21 avisos: Ferretería 25 de Marzo, Mapse, Ace Hardware Bolivia, Ferrotramon, Distribuidora Suárez, Santielli, Chinacruz… | Biblioteca de Meta | [verificado: fuente primaria] |

### 1.5 Importadoras

- **Sin conteo oficial encontrado** (Aduana/IBCE no aparecieron antes de agotarse el cupo de búsquedas).
- Proxy: "importadora Santa Cruz" activos en BO = **135 avisos** (Importadora Yuna SRL, Importadora Nina,
  Importadora DK, Elementare SRL, Cames Importadora, Bambú, Eurobol, CoralGris, Llantas Sudamericana…)
  [verificado: fuente primaria]. Muchas le venden al consumidor final; activas en Meta y WhatsApp.

### 1.6 Servicios profesionales

- **34.829** unidades de "servicios profesionales y técnicos" a nivel nacional (8,8 %), SEPREC sep-2025
  [primaria vía buscador] → **~10.400 en SCZ** si pesa 29,9 % [inferencia]. Sin desagregación por
  profesión (contadores, abogados, arquitectos).

---

## 2. Dolor y disposición a pagar

### 2.1 Qué pasó con la facturación en línea alrededor del 30-sep-2026

| Norma | Qué dice | Fuente · fecha | Nivel |
|---|---|---|---|
| **RND 102600000007** (25-mar-2026) | Amplía **hasta el 30-sep-2026** el plazo a los grupos **9°, 10°, 11° y 12°** (definidos por RND 102400000004, 102400000005, 102400000012 y 102400000025). **Desde el 1-oct-2026** emiten **solo** por Electrónica en Línea, Computarizada en Línea o **Portal Web en Línea** | [Nota del SIN](https://www.impuestos.gob.bo/index.php/nota_prensa/el-sin-amplia-hasta-el-30-de-septiembre-el-plazo-para-la-implementacion-de-la-facturacion-en-linea/) | [primaria vía buscador] (coincide con el repo) |
| ¿Hubo otra prórroga? | **No encontré ninguna.** Las RND de septiembre que aparecen son: **034** (1-sep, IVA Transparente), **035** (hotelería, abroga la RND 102000000030), **036** (valores del RAU 2025), **037** (prórroga de declaraciones de agosto-2026 para NIT terminados en 0-1-2 hasta el 17-sep). La 038 no aparece | [impuestos.com.bo](https://impuestos.com.bo/) (agregador) + [lista RND 2026 del SIN](https://www.impuestos.gob.bo/index.php/rnd-2026/) (**no se pudo abrir**) | [secundaria]. **No se puede descartar una RND de último momento** |
| Tamaño de los grupos | 10° + 11° = **7.586** contribuyentes; 12° = **19.268** NIT (dato del repo, `ONIA_FECHAS_CRITICAS_PLAN.md` §2); 9° sin dato | [Gosocket](https://gosocket.net/centro-de-recursos/se-amplia-plazo-para-implementar-la-modalidad-de-facturacion-en-linea-para-el-decimo-y-decimo-primer-grupo-de-contribuyentes/) | [secundaria] → ~27.000 NIT conocidos, **<10 % del Régimen General** [inferencia] |
| **Ley 1733 de Alivio Tributario** (27-may-2026) | IVA **"por fuera"**: 13 % sobre precio neto, se muestra aparte (hoy la tasa efectiva por dentro es ~14,94 %). **Rige el 1° del mes siguiente a la publicación de su Decreto Supremo reglamentario**, que al cierre de las fuentes **seguía pendiente** | [Ley 1733 (PDF SIN)](https://www.impuestos.gob.bo/wp-content/uploads/2026/05/L17332051NCPP.pdf) · [boliviaimpuestos: IVA por fuera](https://boliviaimpuestos.com/iva-por-fuera-ley-1733/) | [primaria vía buscador] + [secundaria] |
| **RND 102600000034** (1-sep-2026) "Ajustes al Sistema de Facturación" | Arranca la adecuación técnica al IVA Transparente. Consulta pública de especificaciones **hasta el 21-sep-2026**; **pruebas en ambiente piloto del 1-oct al 16-nov-2026** para **todo** contribuyente con sistema de facturación propio o de proveedor; "Anexo Técnico Ley 1733 (en construcción)" v0.0 | [RND (PDF)](https://www.impuestos.gob.bo/wp-content/uploads/2026/09/RND-1026000000034.pdf) · [El Mundo](https://elmundo.com.bo/sin-construye-nuevo-sistema-informatico-de-facturacion/) · [Infodiez](https://www.infodiez.com/impuestos-construye-nuevo-sistema-informatico-de-facturacion-con-aportes-tecnicos/) | [primaria vía buscador] + [secundaria] |
| **DS 5708** (16-sep-2026) | Amplía la regularización ("perdonazo") de la Ley 1733 del 23-sep **al 31-dic-2026** (deudas 2018–2025; contado con 50 % menos de mantenimiento de valor, o hasta 36 cuotas) | [ABI](https://abi.bo/gobierno-amplia-el-plazo-de-regularizacion-tributaria-hasta-el-31-de-diciembre/) · [El Mundo](https://elmundo.com.bo/sin-amplia-plazo-de-regularizacion-tributaria-hasta-el-31-de-diciembre/) | [secundaria] |

**A quién le pega más:**
- **Comercio e importadoras**: el IVA por fuera obliga a cambiar listas de precios, cajas y sistemas, y
  todo sistema de facturación tiene que re-autorizarse (se suma a la RND 102600000026 del TCO del BCB en
  facturas en moneda extranjera y la 102600000006 de traslado de mercancías, ya en el repo). **Urgencia
  fiscal: la más alta.**
- **Clínicas**: facturan servicios; les toca el IVA por fuera y, solo si su NIT está en un grupo, la
  facturación en línea. **Urgencia fiscal: media.** Su urgencia real es de negocio (paciente que no vuelve).
- **Para ONIA**: el propio repo ya anota la pregunta al SIN de si la solicitud 9473 migra al anexo de la
  RND 034 y la Fase 2 antes del 04-nov (`handoff/codex-continuar-1.0.md`). **Vender "urgencia SIAT" sigue
  prohibido** por las razones de `ONIA_CLIENTE_IDEAL.md` §4, y ahora hay una más: el piso técnico se está
  moviendo para todos.

### 2.2 ¿Qué rubro ya paga software de gestión en Bolivia?

| Rubro | Evidencia de que ya paga | Nivel |
|---|---|---|
| **Comercio** | Sí, claramente. Pautan en BOB esta semana: Sistema de Ventas CAMSI (2026-09-29), Leo Business Core (*"Sistema de ventas e inventario para tu negocio"*, 2026-09-28), StarSystem Bolivia (con páginas de "ejecutivas" de venta, 2026-09-07), Next System (*"TU FERRETERÍA MÁS RENTABLE 🔧"*, 2026-09-21, USD), Bizora, Desarrollo Creativo (*"Pedí una demo por WhatsApp"*), Sistemas de Gestión Comercial, Informática Bolivia, MJ Store Apps, Excel Apps Bolivia, Esi Bolivia (Odoo, *"Más control para tus importaciones"*), Facturación Electrónica io. Precios de mercado Bs 85–236/mes ya relevados en el repo | [verificado: fuente primaria] |
| **Salud (médico/dental)** | Sí, en parte. TuDoc (boliviano) declara **"más de 200 clínicas"** y **"más de 50.000 citas"**; Healthatom sostiene ~30 avisos en BO desde junio (no se paga pauta 4 meses sin retorno) | cifras de TuDoc [primaria vía buscador, declaración del vendedor]; lectura de Healthatom [inferencia] |
| **Estética** | Débil. Balance Aesthetic Software (Perú, PEN) pauta en BO (2026-09-03); CitaPro (2 avisos, jul) según la pasada paralela; AgendaPro declara estar disponible en Bolivia | [verificado: fuente primaria] / [secundaria] |
| **Importadoras** | Sí, ERP de ticket alto (partners de Odoo: Esi Bolivia; CUCU ya en el repo con Bs 720/mes + Bs 4.500 de alta) | [verificado: fuente primaria] + repo |
| **Servicios profesionales** | Sin evidencia encontrada | — |

### 2.3 Resumen de dolor por rubro

| Rubro | Dolor principal | Urgencia regulatoria 2026-Q4 | Disposición a pagar probada | Competencia |
|---|---|---|---|---|
| Dental | Paciente con tratamiento a medias que no vuelve (dicho por el cliente) | Media | Sí (TuDoc, Healthatom) | Media: 2 extranjeros fuertes + 1 local |
| Estética | Agenda, no-shows, paquetes de sesiones | Baja-media | Débil | Baja-media, fragmentada |
| Comercio/ferretería | Stock, caja, precios con IVA por fuera | **Alta** | **Sí, alta** | **Muy alta, local, en BOB** |
| Importadora | Costeo, tipo de cambio, IVA por fuera | **Alta** | Sí (ERP) | Media (partners Odoo) |
| Servicios profesionales | Facturación y cobranza | Media | Sin evidencia | Sin dato |

---

## 3. Competidores en clínicas / dental / estética con presencia en Bolivia

| Competidor | Origen | ¿Vende en Bolivia? Evidencia | ¿Precio en BOB? | Titular / posicionamiento | Canales visibles | IA |
|---|---|---|---|---|---|---|
| **TuDoc** (`tudoc.com.bo`) | **Bolivia** | Sí: *"software médico en Bolivia"*, *"más de 200 clínicas"*, soporte por WhatsApp *"sin bots"*, capacitación *"en menos de 2 horas"*, *"actualiza automáticamente la normativa del SIN"*. App en App Store (id1435104984), página FB "Tu Doc En Linea" | **No publica**: se cotiza por volumen | *"Agenda, historias clínicas y facturación en línea SIAT en un solo sistema"* | SEO (aparece primero en "software médico Bolivia"), App Store, FB | **Sí**: *"IA que resume el historial completo del paciente"*; interoperabilidad FHIR |
| **Dentalink** (Healthatom) | Chile | **Sí, pauta en BO**: 15 avisos jun→sep-2026, USD, page 106612849382553 | No (USD; precios ya en el repo) | *"Dentalink, el Software Dental líder en Latinoamérica"*; 15.000+ clientes, 20+ países ([web](https://www.softwaredentalink.com/)) | Meta Ads con imán (*"📊 Calcula gratis qué procesos automatizar en 1 min"*, 2026-06-17), avisos de catálogo, formulario instantáneo | **Sí**: *"Dicta tus fichas con IA"* (2026-09-08), *"Simula sonrisas con IA"* (2026-09-10), *"Análisis de RX con IA"* (2026-08-12) |
| **Medilink** (Healthatom) | Chile | **Sí, pauta en BO**: 17 avisos ago→sep-2026, tanda nueva del **28-sep**, USD, page 407332546278146 | No | *"Todo en un solo sistema"*, *"Controla tu clínica hoy"* | Meta Ads con *"Agenda tu asesoría gratis"* | **Sí**: *"Fichas con IA: Dictas y listo"*, *"Resumen clínico con IA"*, *"Gestiona tu clínica con IA"* |
| **Doctocliq** | Perú | Aparece en rankings SEO para Bolivia; **0 avisos en BO** | No (desde USD 19/mes; plan gratis hasta 30 pacientes o citas/mes) | *"El mejor software dental y médico de Latinoamérica"*; 2.000+ médicos en 11 países ([planes](https://www.doctocliq.com/planes-y-precios)) | SEO y blog (p. ej. [ferias dentales 2026](https://www.doctocliq.com/blog/ferias-dentales-2026-latinoamerica)) | No verificado |
| **AgendaPro** | Chile (YC W21) | Declara disponibilidad en Bolivia (extracto del buscador); la búsqueda de avisos por nombre no discrimina | No | *"Software N°1 para Belleza, Spa, Salud y Bienestar"* ([web](https://agendapro.com/mx)) | SEO por país y rubro | No verificado en esta sesión |
| **Citalo** | Uruguay (dato del repo) | Landing propia **/bo/**: *"Software Citas Odontólogos Bolivia"* ([web](https://www.citalo.app/bo/software-turnos-odontologos)) | No publica; prueba 14 días sin tarjeta | Turnos por WhatsApp; promete *"-40 % de ausencias"* | SEO por país | No verificado |
| **Turnito** | No verificado (integra Mercado Pago) | Blog *"Los mejores software de reservas para odontólogos en Bolivia [2026]"* que se ubica a sí mismo primero ([blog](https://turnito.app/blog/los-mejores-software-de-reservas-para-odontologos-en-bolivia-2026/)) | Gratis + 5 % de comisión si cobra pagos | Agenda gratis + recordatorios WhatsApp | SEO programático por país | No |
| **ReservaSimple** | No verificado | Páginas *"App Citas Dentistas Bolivia Online Gratis"* ([web](https://www.reservasimple.com/app-citas-dentista-bolivia)) | "Gratis" | Reservas | SEO por país y rubro | No |
| **Reservo** | Chile | Sin evidencia de Bolivia | — | Software de agenda para salud y estética ([web](https://reservo.cl/)) | SEO | No |
| **Balance Aesthetic Software** | Perú | Pauta en BO (PEN, 2026-09-03) | No | *"Centros Médicos · Centros Estéticos · Salones de Belleza · Recordatorio Automático"* | Meta Ads | No verificado |
| **Ultra Pack Dentista** | No verificado (USD) | Pauta en BO; *"Agenda para odontólogos — Agenda en Día"* (2026-09-23) | No | Pasó de plantillas de Canva a agenda | Meta Ads sostenida | No verificado |
| **SA-Dental** | No verificado (USD) — **agencia**, no software | ~50 avisos en BO jul→sep-2026 | No | *"30 PACIENTES EXTRA POR MES O NO PAGAS"*; también busca vendedores remotos y anuncia *"SA Horizon — Agente de ventas (Call Center)"* | Meta Ads intensiva + fuerza de venta a comisión | Posible (no verificado) |
| **Smart Funnels AI** | No verificado (USD) | 1 aviso en BO (2026-03-27) | No | *"Implementación GRATIS con agentes IA para tu clínica dental"* | Meta Ads | Sí (declarado) |
| **Softclinic** (page 737824982739173) | ¿Bolivia? (sin identificar) | Tenía 2 avisos BOB el 5-ago; **0 hoy** | — | — | Meta Ads (cortó) | — |
| **Resulta SRL** (page 236285439561125) | Bolivia; **quizás** "Resultar Servicios y Soluciones SRL" (SCZ, diseño de sistemas, [D&B](https://www.dnb.com/business-directory/company-profiles.resultar_servicios_y_soluciones_srl.21e3868d64e343ef37ba10d567ddb951.html)) | 2 avisos BOB creados el **28-sep**, que aparecen en "software odontológico" y "clínica dental Santa Cruz" | — | Sin título | Meta Ads | — |
| **Doctoralia / Docplanner** | España/Polonia | **No opera en Bolivia** como marketplace; solo figura su app para especialistas en la App Store BO ([link](https://apps.apple.com/bo/app/doctoralia-para-especialistas/id1237598188)) | — | — | — | (Noa, fuera de BO) |
| Directorios locales: Doctorpolis, DoctorPlace, doctorbolivia | Bolivia | Directorios para pacientes (Doctorpolis: 1.000+ médicos, 118 especialidades) ([Doctorpolis](https://www.doctorpolis.com.bo/)) | — | Reserva/visibilidad, **no gestión** | SEO | No |
| SoftClinic GenX | India | Declara presencia en Bolivia; sin evidencia local | — | HMS hospitalario | — | "AI powered" |

Fechas de los avisos = fecha de creación en la Biblioteca de Meta, consultada el 2026-09-30, país `BO`.
URL de cualquier aviso: `https://www.facebook.com/ads/library/?id=<id>` (ids en §7).

**Lectura de la tabla**
1. **El único competidor con adquisición pagada sostenida en Bolivia es extranjero (Healthatom, dos
   marcas, en USD)**. Ningún software dental boliviano pauta hoy (coincide con la pasada paralela de la
   Biblioteca de Meta del 30-sep que está en este mismo scratchpad).
2. **"IA" ya no diferencia**: TuDoc, Dentalink y Medilink la usan en el titular. **Su IA es del trabajo
   clínico** (dictar, resumir, RX, simular), no de la plata que se pierde. Ninguno de los vistos titula
   con *recuperar al paciente que dejó el tratamiento a medias*. Ese es el hueco, pero hay que
   **nombrar el trabajo**, no la tecnología.
3. **Ventaja de ONIA que sí se sostiene**: precio fijo en bolivianos contra USD flotante (Healthatom,
   Doctocliq), y precio publicado contra "cotizamos" (TuDoc).

**Correcciones al repo que salen de acá (anotadas, no hechas: la investigación es solo lectura)**
- `ONIA_DENTALGEST_ESTRUCTURA_ULTIMA_MILLA_2026.md` dice *"Nadie de estos incluye factura fiscal válida en
  Bolivia dentro del sistema dental"*. **TuDoc declara agenda + historia clínica + SIAT en un solo
  sistema** (médico; si tiene odontograma no se verificó).
- `ONIA_CLIENTE_IDEAL.md` §2 dice que los agentes son *"lo único que ningún competidor local tiene"*. Sigue
  siendo cierto **para agentes que redactan mensajes de recuperación**, pero **no para "IA"** en general.
- `ONIA_PAUTA_COMPETENCIA_20260815.md` llama a Softclinic *"competidor directo de DentalGest"*: hoy tiene
  0 avisos y su identidad no está clara (el buscador devuelve un Softclinic indio).
- `ONIA_CLIENTE_IDEAL.md` §7: ver §1.2 (segmento ~150–400, no "por mucho").

---

## 4. Cómo compra una clínica en Santa Cruz — canales con evidencia

| Canal | Evidencia | Nivel | Qué significa para una sola persona |
|---|---|---|---|
| **Meta / Instagram + WhatsApp** | ~20 clínicas dentales distintas con avisos activos para "clínica dental Santa Cruz" (Clínica Dental Cortez SCZ creó varios el 29-sep; Clínica Dental San Pedro con clic a WhatsApp, 23-sep; ODES, Stildent, Natural Smile, Sonríe a la Vida, MUN, Rocha, Sanident, KOREA, Vid…) | [verificado: fuente primaria] | La clínica objetivo **ya paga para conseguir pacientes** → entiende de embudo y es alcanzable por Meta. Los 3 registros orgánicos del repo llegaron así |
| **Proveedores que ya le venden al odontólogo por Meta** | Athel – Materiales Dentales (BOB, 29-sep); Saludable-Mente (*"¡Cotiza tus materiales aquí!"*, BOB, 10-sep); SillaCare Bolivia (*"¡Odontólogos de La Paz y El Alto! Renueven su sillón…"*, BOB, 29-sep) | [verificado: fuente primaria] | Los depósitos dentales **existen como canal digital**; alianza posible (no verificado si revenden software) |
| **Educación continua** | OsteoCompas Bolivia: diplomados de odontopediatría (3ª versión), ortopedia dentofacial (4ª), especialidad en periodoncia (3ª), maestría en cirugía bucal (2ª) — avisos BOB del 26-sep; Unifranz Postgrado con programas "con prácticas en Santa Cruz" (28-sep); Centro de Postgrado Odontológico Potosí | [verificado: fuente primaria] | El odontólogo paga por formarse; **una charla de gestión dentro de un diplomado** es un canal barato [inferencia] |
| **Colegio de Odontólogos de SCZ** | Organiza las **Jornadas Odontológicas Cruceñas**: la **XXVI** fue el **25 y 26 de junio** en el Hotel Los Tajibos ([UAGRM](https://www.uagrm.edu.bo/noticias/estudiantes-de-odontologia-de-la-uagrm-participan-en-las-xxvi-jornadas-odontologicas-crucenas_1b90d6)); año no visible (probablemente 2025). Web [santacruzodontologos.com](https://santacruzodontologos.com/), FB [santacruzodontologos](https://www.facebook.com/santacruzodontologos) | [primaria vía buscador] | La **XXVII** caería ~jun-2026 (ya pasó) o ~jun-2027 [inferencia] |
| **CIO — Congreso Internacional de Odontología, Santa Cruz** | 2024 en Fexpocruz; **2025 del 1 al 3 de octubre, Hotel Los Tajibos**; **CIO 2026** anunciado con precongresos ([FB CioScBolivia](https://www.facebook.com/CioScBolivia/) · [CIO 2024 en Luma](https://luma.com/dof56ozx) · [conferencia CIO Bolivia 2025](https://ortodental.com.mx/conferencias/conferencia-cio-bolivia-2025-innovacion-en-ortodoncia-con-el-dr-hector-garcia-alatorre/)). Bcruz SRL aparece vinculado al CIO 2021 ([bcruz](https://www.bcruz.com.bo/cio-2021-congreso-internacional-de-odontologia-santa-cruz-bolivia/)) | [secundaria] | **Fecha 2026 no verificada**; si repite el patrón, **principios de octubre de 2026 = estos días** [inferencia]. Es el evento dental más grande de SCZ: vale más ir a mirar y conversar que poner stand |
| **Recomendación entre colegas** | **Sin evidencia externa** (no alcanzó el cupo de búsqueda). Solo la del repo: el lead de 4 doctores llegó solo por WhatsApp | — | No se puede afirmar |

**Eventos 2026–2027 concretos**: CIO 2026 (SCZ, fecha a confirmar en su FB); diplomados OsteoCompas en
curso (inscripciones abiertas, sep-2026); programas de Unifranz Postgrado con prácticas en SCZ;
XXVII Jornadas Odontológicas Cruceñas (~jun-2027, a confirmar con el Colegio: +591 78159760, dato del repo).
Para estética aparecen escuelas que pautan (Escuela de Belleza El Maná, Academia Katihusca Sampaio – Santa
Cruz, Kallos Institute) [verificado: fuente primaria]; **no encontré congresos de estética 2026–2027**.

---

## 5. Conclusión: ¿qué rubro tiene mejor tamaño + dolor + acceso para una persona?

| Rubro | Tamaño en SCZ | Dolor | Acceso para 1 persona | Competencia | Veredicto |
|---|---|---|---|---|---|
| **Dental 2–6 profesionales** | ~150–400 [inferencia] | **Específico y dicho por el cliente** | **Bueno**: Meta, WhatsApp, Colegio, CIO, diplomados; 3 registros orgánicos | Healthatom (USD, IA clínica) + TuDoc (local, SIAT) | **Seguir acá, solo acá**, hasta 5 clientes |
| Estética/spa | Mayor que dental por avisos, sin cifra | Agenda y paquetes (ONIA no tiene bonos/paquetes: `rubro-dental-estetica-oportunidades.md` §A-6) | Muy bueno por Meta, pero fragmentado | AgendaPro, Balance, CitaPro | Segundo rubro **después** de 5 dentales |
| Comercio/ferretería | El más grande (42.587 unidades) | Alto y fiscal (IVA por fuera) | Difícil: ruido y precio | **≥12 locales en BOB**, Bs 85–236 | No, hoy |
| Importadora | Sin cifra | Alto (TC, costeo, IVA) | B2B, ticket alto, venta larga | Partners Odoo | No, hoy |
| Servicios profesionales | ~10.400 [inferencia] | Genérico | Sin canal claro | Sin dato | No |

**La frase de "si le ofrecés a demasiada gente nunca vas a vender nada" tiene respaldo en los datos**: el
rubro más grande (comercio) es el más disputado y barato; el más accesible (estética) es el más
fragmentado; el que junta dolor declarado, clínicas que ya invierten en marketing y un hueco de mensaje
libre es **dental en Santa Cruz**. Con ~250 clínicas en el segmento, **5 clientes es 2 %**: el problema no
es el mercado, es contestar a los que ya llegaron y titular con el trabajo que nadie titula
("te muestro qué pacientes dejaron el tratamiento a medias").

---

## 6. Qué no pude verificar

- **Abrir cualquier página web** (bloqueo de red) y **terminar la búsqueda web** (cupo 200/200 agotado).
  Todo lo marcado "vía buscador" es extracto, no lectura del documento.
- **Si el SIN publicó una prórroga el 29 o 30-sep-2026.** No aparece en lo que se pudo buscar, pero la
  lista oficial de RND 2026 no se pudo abrir.
- **Estado del Decreto Supremo reglamentario de la Ley 1733** después de mediados de septiembre (define
  desde qué mes rige el IVA por fuera).
- **Tamaño del grupo 9°** de facturación en línea.
- **Número de odontólogos colegiados en SCZ** (el Colegio no publica padrón) y cualquier cifra dental
  posterior a 2019. El dato SEDES (125 + 1.812) tiene fecha inferida (~2018) y es departamental.
- El PDF del ICE (Gobernación) [*Personal y centros de salud en Santa Cruz 2025*](https://ice.santacruz.gob.bo/uploads/PERSONAL_Y_CENTROS_DE_SALUD_EN_SANTA_CRUZ_2025_348a482bc5.pdf):
  existe y podría traer conteos de establecimientos, **no se pudo abrir**.
- **Estética/spa, ferreterías, importadoras**: sin conteo oficial.
- **TuDoc**: precio, clientes reales (el "200+" es declaración propia), si tiene odontograma y si su IA hace
  recordatorio/recuperación de pacientes.
- **Si Dentalink/Medilink tienen una función de "pacientes inactivos / recall"** (erosionaría el hueco del
  §3). Sus titulares no la nombran; su producto no se miró.
- Identidad de **Softclinic**, **Resulta SRL** y **AppYaa**; qué venden exactamente.
- **Fecha del CIO 2026** y año exacto de la XXVI Jornadas Odontológicas Cruceñas.
- Canal **boca a boca** y **depósitos dentales físicos** en SCZ: sin estudio ni fuente; solo evidencia de
  pauta digital.
- Los **creativos** de los avisos (snapshots de facebook.com bloqueados): formato y copy completo sin mirar.

---

## 7. Fuentes

**Fiscal (SIN y derivados)** — nota RND 102600000007:
https://www.impuestos.gob.bo/index.php/nota_prensa/el-sin-amplia-hasta-el-30-de-septiembre-el-plazo-para-la-implementacion-de-la-facturacion-en-linea/ ·
RND 102600000034 (1-sep-2026): https://www.impuestos.gob.bo/wp-content/uploads/2026/09/RND-1026000000034.pdf ·
resumen RND 034: https://boliviaimpuestos.com/rnd-102600000034-ajustes-facturacion-iva-transparente/ ·
consulta pública hasta 21-sep: https://elmundo.com.bo/sin-construye-nuevo-sistema-informatico-de-facturacion/ ·
Ley 1733: https://www.impuestos.gob.bo/wp-content/uploads/2026/05/L17332051NCPP.pdf ·
IVA por fuera: https://boliviaimpuestos.com/iva-por-fuera-ley-1733/ ·
DS 5708: https://abi.bo/gobierno-amplia-el-plazo-de-regularizacion-tributaria-hasta-el-31-de-diciembre/ ·
grupos 10°–11°: https://gosocket.net/centro-de-recursos/se-amplia-plazo-para-implementar-la-modalidad-de-facturacion-en-linea-para-el-decimo-y-decimo-primer-grupo-de-contribuyentes/ ·
RND 035–037 (agregador): https://impuestos.com.bo/ ·
padrón 2025: https://www.impuestos.gob.bo/wp-content/uploads/2025/11/105409f7900.pdf

**Mercado** — SEPREC sep-2025: https://www.seprec.gob.bo/wp-content/uploads/2025/11/Informacion-ESTADISTICA-WEB-SEP.pdf ·
SEDES SCZ dental: https://www.econoticias.com.bo/sedes-notifica-y-clausura-consultorios-dentales/ ·
Tarija: https://www.elpaisonline.com/index.php/noticiastarija/item/156507-de-150-consultorios-dentales-solo-37-tienen-el-aval-del-sedes ·
OMS: https://cdn.who.int/media/docs/default-source/country-profiles/oral-health/oral-health-bol-2022-country-profile.pdf ·
1/1.600: https://www.bolivia.com/noticias/autonoticias/DetalleNoticia15277.asp ·
Dental Tribune: https://la.dental-tribune.com/news/la-odontologia-en-bolivia-2/ ·
FDI: https://www.fdiworlddental.org/colegio-de-odontologos-de-bolivia

**Competidores** — TuDoc: https://tudoc.com.bo/ · https://apps.apple.com/mx/app/tudoc/id1435104984 ·
Dentalink: https://www.softwaredentalink.com/ · Healthatom: https://www.healthatom.com/ ·
Doctocliq: https://www.doctocliq.com/planes-y-precios · AgendaPro: https://agendapro.com/mx ·
Citalo: https://www.citalo.app/bo/software-turnos-odontologos ·
Turnito: https://turnito.app/blog/los-mejores-software-de-reservas-para-odontologos-en-bolivia-2026/ ·
ReservaSimple: https://www.reservasimple.com/app-citas-dentista-bolivia · Reservo: https://reservo.cl/ ·
Doctorpolis: https://www.doctorpolis.com.bo/ · SoftClinic GenX: https://www.softclinicsoftware.com/

**Biblioteca de Anuncios de Meta** (consultada 2026-09-30, `BO`; URL = `facebook.com/ads/library/?id=<id>`) —
Dentalink 1059477226705411 (dicta fichas), 1083821247567581 (simula sonrisas), 2561434227628085 (RX),
3523024997874486 (calculadora) · Medilink 1611457617145107, 2369874997088490, 1639217754433925 ·
Resulta SRL 2231002107466994, 1584097369303361 · Ultra Pack Dentista 1948259779463466 ·
SA-Dental 1615824286745807 · Smart Funnels AI 26426396430336566 · Balance Aesthetic 1613702807126274 ·
Leo Business Core 1877855540246995 · CAMSI 2534291307078485 · StarSystem 1779070879909340 ·
Next System 2943110046029555 · Esi Bolivia 1046864021523587 · Clínica Dental Cortez SCZ 28382463031414540 ·
Clínica Dental San Pedro 4488078054763407 · OsteoCompas 1143269841702867 · Unifranz Postgrado 930551306417882 ·
Enfocate Santa Cruz 1045177421443735 · SillaCare 1384155860598327 · Athel 922430910676907 ·
Saludable-Mente 1061554423254864 · consultorio en alquiler 915622974340688

**Eventos** — CIO: https://www.facebook.com/CioScBolivia/ · https://luma.com/dof56ozx ·
https://ortodental.com.mx/conferencias/conferencia-cio-bolivia-2025-innovacion-en-ortodoncia-con-el-dr-hector-garcia-alatorre/ ·
Jornadas: https://www.uagrm.edu.bo/noticias/estudiantes-de-odontologia-de-la-uagrm-participan-en-las-xxvi-jornadas-odontologicas-crucenas_1b90d6 ·
Colegio SCZ: https://santacruzodontologos.com/
