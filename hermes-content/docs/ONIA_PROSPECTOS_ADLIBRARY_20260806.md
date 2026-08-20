# Prospectos calificados por gasto real en pauta — Bolivia, 2026-08-06

> Fuente: **Meta Ad Library en vivo** (conector Ads MCP), no listados ni scraping.
> Criterio de entrada: **anuncio ACTIVO hoy en Bolivia**. Cumple la regla de
> `CRM_PROSPECTING.md` (solo info pública, cada prospecto con fuente, cero contactos inventados).

---

## 1. Por qué esta lista vale más que una lista de negocios

El filtro no es "tiene negocio" — es **"le está pagando a Meta ahora mismo"**. Eso significa
tres cosas que ningún directorio te dice:

1. **Tiene presupuesto de marketing y ya decidió gastarlo.** No hay que crear el presupuesto,
   hay que redirigirlo.
2. **Mide.** Alguien mira ese gasto y se pregunta si sirve.
3. **Le duele exactamente lo que vendemos.** El anuncio trae la conversación; el agujero está
   *después*: quién responde, en cuánto, quién hace seguimiento, quién agenda.

> **El gancho que sale de los datos, no de la teoría:** varios de estos anuncios son
> literalmente *"Chatea con nosotros"* (click-to-WhatsApp). Están **pagando por conversaciones
> que después contestan a mano**. Ese es el pitch entero: *"ya estás pagando por los mensajes —
> el problema es lo que pasa cuando llegan"*.

⚠️ **Los contactos NO están en esta tabla a propósito.** La Ad Library da nombre de página y
`page_id`, no teléfono ni email. El contacto se saca de la página antes de escribir. Nada de
inventar datos (regla dura del CRM).

## 2. Grupo A — Inmobiliarias (prioridad ALTA: tenemos caso)

Tenemos a Franco Marín (Century 21 Home) como cliente inmobiliario → hay **caso propio y
lenguaje del rubro**, y los agentes C21 se hablan entre ellos. Producto: web + panel privado +
chatbot de calificación (InmoGest).

| Empresa | `page_id` | Señal observada |
|---|---|---|
| **Flavia Vasquez — Century21 Forza** | `194334013771006` | **7 anuncios activos en USD** (el que más gasta de la muestra). Preventa Macororó 16-17 y Domus Black Equipetrol + ads *"Chatea con nosotros"* |
| **Cynthia Lema — Agente Inmobiliaria** | `404764319395364` | 2 ads *"Chatea con nosotros"* (BOB) |
| Viviana Paz — C21 Zafiro Bolivia | `227852940415204` | activa (BOB) |
| Prisma Inmobiliaria | `954473624425002` | 2 ads activos (BOB) — es empresa, no agente suelto |
| Eunice Alves — REMAX | `709090486212786` | monoambientes Equipetrol (BOB) |
| Diana Heredia — Century 21 Invest | `1216587504865534` | activa (BOB) |
| Denisse Ichuta / Metro Cuadrado | `1069456406250982` | activa (BOB) |
| Inversionistas de Impacto — Daniel Castro | `315568668314612` | activa (BOB), enfoque inversión |

**Ángulo:** *"Vi que estás pagando ads de 'Chatea con nosotros'. ¿Cuántos de esos mensajes
terminan en visita agendada? Te muestro en 10 min cómo se responden y califican solos."*

## 3. Grupo B — Clínicas dentales (prioridad ALTA: tenemos producto)

DentalGest existe y el nicho está **casi vacío en pauta** (`ADS_PATTERN_BANK_2026.md` §1: solo
5 anuncios de software dental en 5 países). Estas clínicas gastan en **captar** pacientes; nadie
les vende el **sistema** que los retiene.

| Empresa | `page_id` | Señal observada |
|---|---|---|
| **Odontología Valdivia** | `904758429388158` | **5 anuncios activos en USD** — presupuesto grande y creatividad propia ("3 razones para decirle no a los implantes") |
| **Clínica Vida Oral** | `786235031250980` | 3 ads activos en USD |
| Clinica Dental San Antonio — Dr. Victor Antelo | `539892242715942` | USD, **Tarija** (fuera de SCZ) |
| Ecodent — Estética y Cosmética Dental | `127183110688870` | BOB |
| Clínica Odontológica Arcángel | `109580533741062` | BOB |
| Clínica Plan Dental | `832497950124267` | BOB |
| HOUSE DENT — Dr. Morales | `1079497428576707` | BOB |
| Clínica Dental Odontoestética Garcia Berrios | `101052426077422` | BOB |
| ELYON Consultorio Dental | `578962321976020` | BOB |
| Dental Care Solution | `102013778831648` | BOB |
| Dr. Marco Alcocer Caceres | `1753336328085548` | BOB, odontólogo individual |
| Renova | `1055040924354972` | BOB |

**Ángulo (el del banco, A2):** *"¿Cuántos pacientes no volvieron este mes?"* — no compite con
su ad, ataca lo que pasa después.

## 4. Grupo C — Salud y veterinaria (prioridad MEDIA: agenda + recordatorios)

| Empresa | `page_id` | Rubro / señal |
|---|---|---|
| Club de Mascotas — Clínica Veterinaria | `233604736797095` | USD; su ad apunta a IG `@clubdemascotas.bo` |
| Centro Estético Veterinario Rabito | `1425700487445108` | USD |
| Centro Veterinario Lucio | `2216457738593630` | BOB |
| Oncofem | `1651466168409207` | BOB, clínica médica femenina |
| FisioBel — Fisioterapia y Belleza | `163134980227265` | BOB |
| Clínica Life Brasil | `102454255977811` | BOB, *"PROMO BOLIVIA"* — capta pacientes bolivianos |
| Diplomados y Posgrado Online Siglo XX | `910400878832895` | BOB, educación (inscripciones = embudo) |

**Ángulo:** recordatorios de cita y reprogramación automática. En veterinaria y fisioterapia el
dolor es **el turno perdido**, no el paciente nuevo.

## 5. Descartados a propósito (para no perder tiempo)

- **3Shape LATAM** (DKK), **Cer Solutions 2.0** (MXN), **Puntos de venta** (MXN) — extranjeros
  con pauta que *alcanza* Bolivia; no son negocios locales.
- El nicho **gimnasios** salió podrido: casi todo son infoproductos de calistenia en BRL/USD
  (Protocolo de Calistenia Militar, Muscle Charge), no gimnasios bolivianos. **No prospectar
  gym por esta vía.**
- **Estética/depilación:** solo 4 resultados en todo el país. El rubro no pauta; hay que
  buscarlo por otro canal (mapa/IG), no por Ad Library.

## 6. Siguiente acción concreta

1. **Sacar contacto público** de los 4 marcados en negrita (Flavia Vasquez, Cynthia Lema,
   Odontología Valdivia, Clínica Vida Oral) — son los que más gastan = los que más miden.
2. **Una demo por grupo, no una por prospecto**: 1 pieza inmobiliaria + 1 dental con
   `ugc-saas-flow` sobre su propia web. Se reusa en todo el grupo.
3. Cargar los 4 en Notion con `fuente = Meta Ad Library 2026-08-06` y `estado = Investigado`.
4. Escribir con el ángulo de su grupo — **nunca el genérico "automatizá con IA"**
   (`ADS_PATTERN_BANK_2026.md` §2 lo prohíbe: 367 anuncios dicen lo mismo).

> **Repetir esta búsqueda es barato y automatizable:** `ads_library_search` con
> `countries=['BO'], ad_active_status='ACTIVE'` por rubro. Candidato claro a cron semanal en
> n8n → top 5 nuevos a Telegram (el flujo ya está diseñado en `CRM_PROSPECTING.md`
> §"Flujo n8n - Prospeccion semanal"; hoy corre a mano).

---

Relacionado: `CRM_PROSPECTING.md` (reglas, estados, campos) ·
`NOTION_VENDOR_CRM_SCHEMA_2026.md` (dónde se cargan) ·
`ADS_PATTERN_BANK_2026.md` (qué ángulo usar) · `ONIA_LEADS_PRIORITY_2026.md`.
