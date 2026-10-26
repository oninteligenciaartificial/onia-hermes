# Onia Bot — Capa de conocimiento editable (2026-08-06)

> **Diseño, no implementación.** Ningún archivo de `hermes-content/deploy/vps-ops/bot/`
> se tocó al escribir esto.
>
> **Problema:** el guion y los hechos del bot viven congelados en `config.mjs`
> (`SCRIPT` + `DEFAULT_CONFIG`). Cada módulo, rubro o servicio nuevo obliga a editar
> código y redesplegar. Como "siempre añadimos cosas nuevas", eso no escala y deja
> el negocio dependiendo de un desarrollador.
>
> **Objetivo:** separar **lógica** (código con tests: lo que garantiza que el bot no
> prometa ni cotice) de **hechos** (datos editables sin desplegar: qué hace Onia, qué
> módulos hay por rubro, quién da la demo, ciudades, novedades, respuestas frecuentes).

## 0. Qué se reusa (para no inventar una capa nueva)

Antes de proponer nada se verificó qué ya existe en el repo:

| Fuente | Qué aporta | Decisión |
|---|---|---|
| `hermes-content/docs/ONIA_CHATBOT_PROPIO_SPEC_20260725.md` §7.1/§7.2 | Ya declara la frontera "va a config, nunca a código" vs "queda fijo" | **Este doc es la ejecución de §7.1.** La tabla de §1 la refina con lo que hoy existe de verdad |
| `hermes-content/docs/ONIA_CHATBOT_KNOWLEDGE_BE_20260726.md` (c)7 | Bolivian Electric ya resolvió esto: *"Modismos como dato aprobado por humano, no código"* (`catalog_synonyms` + caché fuera del request path) | **Se copia el patrón tal cual** para el léxico de rubros |
| `hermes-content/docs/ONIA_CATALOGO_TIPOS_CHATBOT_20260731.md` §2 (T1) | El módulo `knowledge` del core "reemplaza ese arreglo fijo por contenido que edita el cliente" | El `faq[]` de §2 usa **los mismos nombres de campo** que `knowledge_article` (`title`/`body`/`status`/`tags`), para migrar sin traducir |
| `onia-core/modules/knowledge.json` | Entidades `KnowledgeCategory` / `KnowledgeArticle`, `status: draft`, `installInProductRepos: false`, solo track `proveegest-electrico` | **NO se instala.** Es KB por tenant-cliente y está congelada por política. Se adopta la forma, no el módulo |
| `onia-core/contract.json` → `verticalPacks[].rubro` (11) + `verticalTracks[].status` | Los rubros y el estado real de cada vertical **ya son datos del core** | **El bot NO duplica la lista de rubros: la proyecta.** Y `status` decide si un módulo se puede nombrar (§4) |

Lo que sí falta y este doc define: el archivo de hechos del bot, su carga tolerante y su
validación. Nada más.

---

## 1. Frontera exacta: lógica vs hechos

Regla de corte: **es lógica si equivocarse hace que el bot prometa, cotice, mienta o
rompa un contrato de datos. Es hecho si equivocarse solo lo hace decir algo desactualizado.**

### 1.1 `config.mjs` — inventario clasificado

| Hoy en `config.mjs` | Qué es | Adónde va |
|---|---|---|
| `SCRIPT.M0`, `M0_DISCLOSURE`, `M1a`, `M1b`, `M1c`, `M1_RAMA_DENTAL`, `M2`, `M2b`, `M3`, `M4_BODY`, `M5`, `M6`, `M7`, `M8_SOPORTE`, `M_AUDIO_FAIL`, `M_ATTACH_BODY`, `PENDING_*` | **Lógica.** El texto ES el control de promesa (M4_BODY es literalmente "el bot no cotiza") | **Código.** Solo cambian sus `{{variables}}` (ver 1.2) |
| `SCRIPT.M_SIAT_BODY` | **Mixto**: es una respuesta frecuente con una fecha (30-sep) que caduca | **Datos** como `faq[siat]`; el texto actual queda en código como fallback |
| `identity.botName` · `productName` · `humanName` | Hecho | **Datos** |
| `identity.tone` (`voseo-boliviano-informal`) | Lógica — cambiar el registro invalida todo el guion escrito | Código |
| `triggers.demo` | Hecho (sinónimos) | **Datos**, solo **unión** con el set del código |
| `triggers.optOut` | **Lógica.** Sin opt-out se quema el número y no hay defensa ante Meta (piso común §4.2 del catálogo) | Código. Los datos pueden **agregar**, nunca quitar |
| `qualification.maxReAsks` (2) | Lógica (máquina de estados, spec D3) | Código |
| `qualification.fields[].key` (`industry`/`teamSize`/`city`) | Lógica (claves de estado y del banco) | Código |
| `qualification.fields[].missLabel` | Texto, pero acoplado literal a M0/M1a por contrato | Código (viaja con el guion) |
| `qualification.branches` (qué rubro pide un dato extra) | Hecho | **Datos** (`askKey` debe apuntar a una plantilla que exista en código) |
| `branches.*.moduleNote` (" El módulo dental ya está armado…") | **Hecho + promesa** | **Datos con candado**: solo se renderiza si el rubro está en el allowlist de código (§4) |
| `slots` / `DEMO_SLOTS` | Hecho externo — ya lo resuelve Cal.com (`resolveConfig`) | Sin cambio. El placeholder queda de fallback |
| `handoff.*` (`ownerRoleKey`, `reviewQueue`, `notifyChannel`) | Lógica (contrato con `review_queue` y con `roles`) | Código |
| `pipelineStatus` | Lógica (valores exactos del CHECK que entiende el panel) | Código |
| `businessHours.days` · `startHour` · `endHour` · `tzLabel` | Hecho | **Datos** |
| `businessHours.tzOffsetMinutes` (-240) | Lógica (corrección: Bolivia no tiene horario de verano) | Código |
| `offScript.maxBeforeHandoff` (2) | Lógica | Código |
| `followUp.maxSteps` (1) · `afterHours` (20) · `staleAfterDays` | Lógica. Los 20 h son matemática de la ventana de servicio de Meta, no una preferencia | Código |
| `dryRun` | Lógica (compuerta de seguridad) | Env (`ONIA_BOT_DRY_RUN`) |
| `renderTemplate` · `isOutsideBusinessHours` · `branchFor` · `allQualificationFields` · `joinEs` · `slotsPending` | Lógica | Código |

### 1.2 Hechos que hoy están *escritos dentro del guion* (la deuda real)

Son literales incrustados en plantillas de `config.mjs`. La plantilla se queda; el
literal pasa a ser una variable que se resuelve desde los datos.

> **Actualizado al estado real post-`f072916c`** (el reordenamiento del embudo). `M1b`
> ya no existe: el "presencial / Santa Cruz" y la duración vivían ahí y hoy la duración
> está en `M0`. La tabla de abajo es lo que hay HOY en el archivo, no lo que había.

| Literal | Dónde | Variable | Estado |
|---|---|---|---|
| "en **15 minutos** por **videollamada**" | `SCRIPT.M0` | `{{demo_duracion}}` + `{{demo_modalidad}}` | ✅ hecho |
| "en horario de oficina (**lun-vie, 9:00-18:00**)" | `SCRIPT.M5` y `SCRIPT.M8_SOPORTE` | `{{horario_frase}}` | ✅ hecho |
| "desde el **30 de septiembre** es obligatoria" | `SCRIPT.M_SIAT_BODY` | pasa entera a `faq[siat]` | ✅ hecho |

`{{ciudad_presencial}}` **no se implementó como campo aparte**: al desaparecer `M1b` se
quedó sin ningún lugar donde renderizarse, y una clave editable que no se consume es
justo el fallo silencioso que esta capa viene a evitar. La ciudad presencial se edita
dentro de `demo.modalidad` ("videollamada, o presencial si estás en Santa Cruz"), que sí
tiene consumidor (`M0`) y sí pasa por el guardrail.

> ⚠️ **Contradicción encontrada en producción — SIGUE ABIERTA, ahora acorralada.**
> `M0` promete "15 minutos" y la reserva usa `CALCOM_BOT_DURATION_MINUTES` = **45**.
> Cuál es la verdadera es una **decisión de negocio de Sergio** y no se tomó desde el
> código: bajar la reserva le rompe la agenda, subir el texto le cambia la promesa al
> prospecto. Lo que sí se hizo:
> - los dos números salen del **mismo bloque** (`config.mjs` → `DEMO`), el guion por
>   `{{demo_duracion}}` y la reserva porque `run-turn.mjs` le pasa `duracionMinutos` a
>   Cal.com (`CALCOM_BOT_DURATION_MINUTES` sigue ganando si está definido en el entorno);
> - la divergencia está **declarada** (`DEMO.pendiente: true`) y **clavada por un test**
>   (`knowledge.test.mjs` → "DURACION DE LA DEMO"): cambiar uno de los dos números sin el
>   otro rompe la suite;
> - la capa editable **no puede crear la contradicción**: si un `knowledge.json` toca la
>   duración, tiene que traer los dos campos y decir el mismo número, o se rechaza entero.
>
> **Tomar la decisión = una sola edición:** poner el mismo número en `duracionMinutos` y
> `duracionFrase` (en `knowledge.json`, sin desplegar, o en `config.mjs` con
> `pendiente: false`) y actualizar el assert del test.

### 1.3 `intents.mjs` — el punto que más duele al crecer

| Pieza | Qué es | Adónde va |
|---|---|---|
| `RUBROS[]`: las palabras de cada rubro (`ferreteri\w+`, `dentista\w*`, `restaurant\w*`…) | **Hecho / léxico.** Es exactamente lo que hay que tocar cada vez que aparece un rubro nuevo | **Datos** — como **listas de palabras**, nunca como regex (§4) |
| Algoritmo: orden ("la primera que matchea gana"), `strong` pisa a `weak`, `CUE_NEGOCIO`, caída a `"otro"` | Lógica | Código |
| `RE_SILLONES` y unidades de rama | Lógica de parseo | Código |
| `isDisqualified` | Lógica | Código |

`guardrails.mjs` es **lógica completa, sin excepción**: los 6 códigos, el mecanismo de
reemplazo total y `SAFE_REPLY`. Nunca entra en datos (spec §7.2.2 y §7.2.6).

---

## 2. Esquema del archivo de conocimiento

Un solo archivo JSON, `onia.bot.knowledge/1`. Ejemplo **completo y real**: todos los
valores salen del repo y están citados; lo que falta va marcado como pendiente.

```json
{
  "schema": "onia.bot.knowledge/1",
  "version": "2026-08-06.1",
  "updatedBy": "sergio",

  "identity": {
    "productName": "Onia",
    "humanName": "Sergio",
    "botName": "el asistente automático de Onia"
  },

  "empresa": {
    "sitio": "https://onia.com.bo/",
    "whatsapp": "+59175414930",
    "ciudadBase": "Santa Cruz",
    "ciudadesPresencial": ["Santa Cruz"],
    "horario": {
      "dias": [1, 2, 3, 4, 5],
      "desde": 9,
      "hasta": 18,
      "frase": "lun-vie, 9:00-18:00"
    }
  },

  "demo": {
    "quienLaDa": "Sergio",
    "duracionMinutos": 45,
    "duracionFrase": "15-20 minutos",
    "modalidad": "videollamada, o presencial si estás en Santa Cruz"
  },

  "rubros": [
    {
      "key": "dental",
      "label": "odontología",
      "coreRubro": "salud_dental",
      "fuerte": ["dentista", "odontologia", "ortodoncia", "clinica dental",
                 "consultorio dental", "laboratorio dental", "protesis dental", "sillon"],
      "debil": [],
      "moduloListo": true,
      "moduloNota": " El módulo dental ya está armado justo para eso.",
      "rama": { "askKey": "M1_RAMA_DENTAL", "campo": "chairs", "missLabel": "cuántos sillones tenés" }
    },
    {
      "key": "gastronomia",
      "label": "gastronomía",
      "coreRubro": "gastronomia",
      "fuerte": ["restaurante", "pizzeria", "cafeteria", "heladeria", "panaderia",
                 "pasteleria", "catering", "food truck", "comida rapida", "polleria",
                 "churrasqueria", "hamburgueseria", "sushi"],
      "debil": ["cafe", "bar", "resto", "snack"],
      "moduloListo": false,
      "moduloNota": null,
      "rama": null
    },
    {
      "key": "salud",
      "label": "salud",
      "coreRubro": "salud_veterinaria",
      "fuerte": ["consultorio medico", "centro medico", "pediatria", "dermatologia",
                 "fisioterapia", "kinesiologia", "psicologia", "nutricionista",
                 "oftalmologia", "traumatologia", "ginecologia", "veterinaria",
                 "laboratorio clinico", "medico"],
      "debil": ["clinica", "consultorio"],
      "moduloListo": false,
      "moduloNota": null,
      "rama": null
    },
    {
      "key": "servicios",
      "label": "servicios",
      "coreRubro": "servicios_profesionales",
      "fuerte": ["peluqueria", "barberia", "salon de belleza", "estetica", "gimnasio",
                 "spa", "hotel", "hostal", "inmobiliaria", "constructora", "contabilidad",
                 "contador", "abogado", "estudio juridico", "bufete", "academia", "colegio",
                 "escuela", "guarderia", "imprenta", "fotografia", "lavanderia",
                 "taller mecanico", "mecanica", "cerrajeria", "mudanzas", "transporte",
                 "limpieza"],
      "debil": ["taller", "agencia", "estudio", "consultora"],
      "moduloListo": false,
      "moduloNota": null,
      "rama": null
    },
    {
      "key": "comercio",
      "label": "comercio",
      "coreRubro": "construccion_ferreteria",
      "fuerte": ["ferreteria", "libreria", "boutique", "farmacia", "botica", "repuestos",
                 "muebleria", "agropecuaria", "bazar", "distribuidora", "importadora",
                 "mayorista", "minimarket", "supermercado"],
      "debil": ["tienda", "almacen", "mercado", "local"],
      "moduloListo": false,
      "moduloNota": null,
      "rama": null
    }
  ],

  "faq": [
    {
      "id": "siat",
      "title": "Facturación en línea / SIAT",
      "gatillos": ["siat", "factura electronica", "facturacion en linea", "sin", "homologad"],
      "body": "Sobre facturación en línea te contesto sólo lo que es público: desde el 30 de septiembre es obligatoria y el SIN tiene un portal gratis. Lo que hace {{producto}} es que los datos ya estén cargados para que no tipees dos veces. El detalle exacto de tu caso lo ve {{humano}} en la demo.",
      "status": "publicado",
      "vigenteHasta": null,
      "tags": ["fiscal"]
    },
    {
      "id": "que-es-onia",
      "title": "¿Qué hace Onia?",
      "gatillos": ["que hacen", "que es onia", "a que se dedican", "que ofrecen"],
      "body": "Onia es una plataforma por módulos que un negocio usa para trabajar: agenda, cobros, clientes y agentes que responden solos por WhatsApp. Qué módulos te sirven a vos lo ve {{humano}} en la demo, con tus números.",
      "status": "publicado",
      "vigenteHasta": null,
      "tags": ["producto"]
    }
  ],

  "triggersExtra": {
    "demo": ["quiero ver el sistema", "agendame"],
    "optOut": []
  }
}
```

### Decisiones de esquema

1. **No hay bloque `novedades` separado.** Una novedad es una FAQ con fecha de
   vencimiento: `faq[].vigenteHasta`. Un concepto menos que mantener, cero pérdida.
2. **`faq[]` usa `title`/`body`/`status`/`tags`** — los mismos nombres que
   `knowledge_article` en `onia-core/modules/knowledge.json`. El día que el módulo
   `knowledge` se adopte, migrar es copiar filas, no traducir campos.
3. **`fuerte`/`debil` son palabras, no regex.** El cargador escapa y compila
   (`\bpalabra\w*\b`) y aplica el mismo orden y la misma regla `strong` pisa a `weak`
   que ya está en `intents.mjs`. Un editor no debe poder escribir una regex: una mala
   mata el matcher o cuelga el proceso.
4. **`coreRubro` es el puente al core**, no una copia. Los 5 rubros que el bot
   distingue hoy no son los 11 `verticalPacks[].rubro` del core; `coreRubro` mapea
   cada uno al pack correspondiente y es lo que valida `moduloListo` (§4).

### 2.1 Lo que ENTRA en la v1 implementada (allowlist real)

> El esquema de arriba es el destino. La v1 que está en el repo acepta **solo lo que
> tiene consumidor de verdad**, porque una clave que se acepta y no hace nada le miente
> al editor exactamente igual que un archivo que no se aplicó. Allowlist vigente
> (`knowledge.mjs` → `SHAPE`), archivo de arranque en
> `hermes-content/deploy/vps-ops/bot/knowledge.example.json`:

| Clave | Consumidor real |
|---|---|
| `schema` (obligatorio, exacto) · `version` · `updatedBy` | identidad del archivo · `/health` |
| `identity.{productName, humanName, botName}` | `varsFor` → todo el guion |
| `empresa.horario.{dias, desde, hasta, frase}` | `businessHours` (ventana real) + `{{horario_frase}}` en M5/M8 |
| `demo.{duracionMinutos, duracionFrase, modalidad}` | `{{demo_duracion}}`/`{{demo_modalidad}}` en M0 **y** la reserva en Cal.com |
| `faq[]` con `id: "siat"` (`title`,`body`,`status`,`vigenteHasta`,`tags`) | reemplaza el cuerpo de `M_SIAT_BODY` |
| `triggersExtra.demo[]` | **unión** con `triggers.demo` del código |
| `rubrosExtra[]` (`key`, `label`, `fuerte[]`, `debil[]`) — desde 2026-08-08 | `intents.lexiconOf()`: el matcher de rubros. Es lo que permite **agregar un rubro sin desplegar** |
| `productos[]` (`key`, `nombre`, `queResuelve`) — desde 2026-08-09 | `{{productos}}` en `M_QUE_ES_ONIA`, la respuesta a "¿qué hacen?". Permite **agregar un producto sin desplegar**. Sin campo `listo`: eso lo decide `MODULOS_LISTOS` en código (§4, candado 5) |

Lo que quedó **fuera a propósito** en la v1, con el motivo:

- ~~**`rubros[]` (el léxico de `intents.mjs`)**~~ — **IMPLEMENTADO 2026-08-08** como
  `rubrosExtra[]`, con 4 diferencias respecto del ejemplo de §2, todas a propósito:
  - **se llama `rubrosExtra` y sólo AGREGA.** Los 5 rubros del código no se re-declaran ni
    se pueden borrar: un rubro nuevo se suma al final y uno existente recibe palabras
    nuevas (unión, igual que `triggersExtra`). Lo único que el archivo pisa es la
    `label`, que es texto que el prospecto lee.
  - **sin `moduloListo` / `moduloNota`.** Nombrar un módulo que no existe es prometer una
    feature (N2) con otro disfraz: sigue siendo un commit en `qualification.branches`.
  - **sin `coreRubro` ni `rama`.** No tienen consumidor en runtime hoy; una clave que se
    acepta y no hace nada le miente al editor igual que un archivo que no se aplicó.
  - **compuerta del banco automática**: si el archivo trae `rubrosExtra`, `--check` corre
    los 62 casos con y sin el léxico y **rechaza la publicación si el banco baja** o si
    aparecen datos inventados. Deja de ser una regla escrita y pasa a ser un candado.
- **`empresa.{sitio, whatsapp, ciudadBase, ciudadesPresencial}` y `demo.quienLaDa`** — no
  hay plantilla que los renderice. `quienLaDa` ya vive en `identity.humanName`.
- **`faq[].gatillos`** — hoy el ruteo al SIAT lo decide `RE_SIAT` en `intents.mjs`, que es
  lógica. Un gatillo editable cambiaría a qué rama del embudo se contesta, no el texto.
- **`triggersExtra.optOut`** — `isOptOut()` no lee la config: los gatillos de baja son un
  regex en código y solo cambian por commit. Quitar una baja es lo único que quema el
  número ante Meta, así que la capa editable ni lo toca.

### Pendientes (no inventar)

- `demo.duracionFrase` vs `duracionMinutos`: hay que decidir el valor real (hoy 15-20
  en el guion, 45 en Cal.com). **Pendiente de Sergio.**
- URL de política de privacidad de Onia: la app de Meta la exige para publicarse y hoy
  no existe (`historial/ONIA_BOT_GOLIVE_RUNBOOK_20260801.md` → Pendientes conocidos). Cuando
  exista, entra como `empresa.politicaPrivacidad` y como FAQ.
- El mapeo `salud → salud_veterinaria` y `comercio → construccion_ferreteria` es
  aproximado: el core no tiene un pack "salud general" ni uno "comercio minorista".
  **Revisar con el dueño del core antes de encender `moduloListo` en esos rubros.**

---

## 3. Dónde vive y cómo se recarga

### 3.1 Realidad del despliegue de hoy (verificada)

```
/opt/onia/bot/            ← HOST del VPS (187.77.16.63), fuera de git, durable
   *.mjs, webhook.env (chmod 600), webhook-server.sh, webhook-watchdog.sh
        │  webhook-server.sh: STAMP = md5 de *.mjs  →  docker cp  →
        ▼
onia-center:/tmp/onia-bot/  ← DENTRO del contenedor, EFÍMERO
   proceso caliente en :3020 (docker exec -d)  ·  watchdog por cron cada 2 min
```

El bot no lee ningún archivo en runtime: todo entra por `-e` (env) o por PostgREST
(`persistence.mjs`, schema `onia_center`).

### 3.2 Ubicaciones

| Fuente | Ruta | Quién edita | Cuándo aplica |
|---|---|---|---|
| **DB** (paso b) | `onia_center.bot_knowledge`, fila más nueva | el panel ONIA Center | ≤ TTL, sin tocar el VPS |
| **Archivo** (paso a) | `/opt/onia/bot/knowledge.json` (host) → `/tmp/onia-bot/knowledge.json` (contenedor) | SSH | ≤ TTL tras `docker cp` |
| **Código** | `config.mjs` `DEFAULT_CONFIG` | commit + deploy | siempre disponible como piso |

Precedencia: **DB → archivo → código.** Cada fuente es opcional; el paso (a) arranca
solo con archivo.

### 3.3 Caché y TTL

- Caché en memoria del proceso, **TTL 300 s**.
- Al vencer el TTL se **sirve la copia vieja y se refresca en segundo plano**. El
  refresco NUNCA corre dentro del camino de la respuesta (patrón de
  `learned-synonyms.ts` de BE — lección (c)7).
- El TTL no rige para el arranque: al levantar, primera carga sincrónica con timeout
  corto (2 s); si no llega, arranca con código y reintenta.

### 3.4 Degradación (el bot no puede caerse ni quedar mudo)

Mismo contrato que `persistence.mjs`: **ninguna función tira.**

| Situación | Qué pasa |
|---|---|
| DB caída / sin credenciales | cae al archivo |
| Archivo ausente | cae al código. Es el estado de hoy: 100 % funcional |
| JSON corrupto o inválido | **se rechaza entero** y se conserva la última copia buena en memoria; si no hay ninguna, código |
| Un `faq[]` con texto prohibido | se rechaza el archivo ENTERO (§4), no la entrada suelta |
| Cualquier excepción del cargador | se captura, se apila en `warnings`, se sigue con código |

**Nunca se acepta parcialmente.** Aceptar la mitad hace creer al editor que publicó
algo que el bot no está diciendo — la falla más cara que ya nos pasó
(`sync-onia-core.mjs` fallando en silencio, CLAUDE.md).

### 3.5 Que no falle en silencio (obligatorio)

- `GET /health` (ya existe, `webhook-server.mjs`) suma:
  `knowledge: { source: "db"|"file"|"code", version, rubros, faq, lastError, loadedAt }`.
  Es la lección (c)4 de BE: *"todo add-on necesita `/health` que reporte el tamaño de
  sus datos"*.
- El watchdog (cron cada 2 min, ya existe) **avisa si `source` cae a `"code"`** después
  de haber sido `db`/`file`. Sin esa alarma, "edité y no pasó nada" tarda días en
  descubrirse.

### 3.6 Bug de despliegue — ✅ CORREGIDO

`webhook-server.sh` calculaba el STAMP con `cat "$BOT_DIR"/*.mjs | md5sum`: **un cambio
que tocara solo el `.json` no cambiaba el stamp**, así que un `restart` no re-copiaba y el
contenedor se quedaba con la versión vieja, en silencio. Los dos arreglos, hechos:

1. `*.json` incluido en el STAMP → un `restart` arrastra la edición. El cálculo estaba
   **duplicado en los 4 wrappers** (`webhook-server.sh`, `run-turn.sh`,
   `chatwoot-adapter.sh`, `followup-run.sh`), que comparten carpeta y stamp: se corrigió
   en los 4. Con uno solo sin arreglar, el primer mensaje que entrara por ese camino
   volvía a dejar el stamp viejo y la edición desaparecía.
2. `webhook-server.sh knowledge`: copia SOLO el archivo, **lo valida adentro del
   contenedor** con el mismo validador que usa el bot al cargar, y recién si pasa lo mueve
   a su lugar. Sin reiniciar: con el TTL el bot lo toma en ≤ 5 min. Si el archivo se
   rechaza, se borra el temporal y el bot sigue con lo anterior.

### 3.7 Cómo se edita en el VPS (runbook, 4 comandos)

El archivo vivo es `/opt/onia/bot/knowledge.json` en el **host**, fuera de git — igual que
`webhook.env`. El repo trae la plantilla `knowledge.example.json` y **nunca** un
`knowledge.json` (está en `.gitignore`): si el repo lo trajera, cada deploy le pisaría las
ediciones al que las hizo, sin aviso.

```bash
ssh -i ~/.ssh/onia_hermes_vps_ed25519 root@187.77.16.63

# 1. la primera vez: partir de la plantilla versionada
cp /opt/onia/bot/knowledge.example.json /opt/onia/bot/knowledge.json

# 2. editar los hechos
nano /opt/onia/bot/knowledge.json

# 3. aplicar. VALIDA primero: si trae un precio, una promesa, una clave desconocida o el
#    JSON está roto, NO se aplica y muestra el error exacto (el bot sigue con lo anterior)
/opt/onia/bot/webhook-server.sh knowledge

# 4. confirmar QUÉ está usando el bot (source debe decir "file" y la version, la tuya)
/opt/onia/bot/webhook-server.sh status
```

La edición entra sola en ≤ 5 min (TTL). Para que entre ya:
`/opt/onia/bot/webhook-server.sh restart`. Para probar un archivo sin aplicarlo:
`docker exec onia-center node /tmp/onia-bot/knowledge.mjs --check /tmp/onia-bot/knowledge.json`.

> Si `status` sigue diciendo `"source":"code"` después del paso 3, el archivo **no** está
> mandando: mirá `knowledge.lastError` en la misma salida. Nunca asumas que se aplicó.

---

## 4. Validación — la regla innegociable

> **Ningún precio ni promesa puede entrar por la capa editable. El bot nunca cotiza:
> el precio lo da un humano en la demo.**

No alcanza con escribirlo en un doc. Se hace cumplir con **cinco candados**, cuatro de
ellos reusando código que ya existe y está testeado.

**1 · Allowlist de claves (el candado estructural).** El cargador acepta *exactamente*
las claves del esquema `onia.bot.knowledge/1`. Cualquier clave desconocida → archivo
rechazado. Consecuencia directa: **la capa editable no puede definir ni pisar
`script` ni ninguna plantilla `M*`**. El motor renderiza con
`config.script[templateKey]` (`bot-engine.mjs:184`); si los datos no pueden aportar
esa clave, no pueden inyectar un mensaje nuevo. `precio`, `planes`, `desde`, `tarifa`
tampoco existen en el esquema: no hay dónde escribir una cifra.

**2 · El guardrail que ya vigila al LLM vigila también a los datos.** Todo string libre
del archivo (`faq[].body`, `moduloNota`, `demo.modalidad`, `label`…) pasa por
`checkGuardrails()` de `guardrails.mjs` — los mismos 6 códigos: `declara_precio`,
`promete_siat`, `promete_feature`, `finge_humano`, `cifra_inventada`,
`consejo_profesional`. Una sola violación en cualquier parte → **archivo rechazado
entero** y el bot sigue con código.

> Esto invierte una premisa vigente: hoy el comentario de `guardrails.mjs` dice que las
> plantillas M0-M7 **no** pasan por el guardrail porque "las escribimos nosotros y están
> versionadas". Eso vale para el texto congelado en código. **Todo texto editable sí
> pasa.** La exención se apoya en el versionado, no en el autor.

**3 · Doble compuerta (escritura y carga).** El mismo validador corre en dos momentos:
al **publicar** (panel o CLI), devolviendo al editor la línea exacta y el código
violado — así nunca llega al bot; y al **cargar**, por si alguien editó el archivo a
mano por SSH saltándose el paso anterior.

**4 · Los datos solo se mueven en la dirección segura.** Asimetría deliberada, y es la
decisión de diseño más importante de este documento:

| La capa editable PUEDE | La capa editable NO PUEDE |
|---|---|
| agregar palabras a un rubro | quitar un gatillo de opt-out |
| agregar sinónimos del disparador `demo` | agregar o reemplazar una plantilla del guion |
| agregar / editar / despublicar una FAQ | escribir un precio, un plan o un porcentaje |
| corregir ciudad, horario, quién da la demo | prometer una integración o una feature |
| **apagar** `moduloListo` de un rubro | **encender** `moduloListo` de un rubro |

Los gatillos de `optOut` y los de `demo` se aplican por **unión** con el set del
código: agregar es libre, quitar es imposible.

**5 · `moduloListo` con doble llave: código + core.** Nombrar un módulo que no existe
es prometer una feature (N2) con otro disfraz. Por eso `moduloNota` solo se renderiza
si se cumplen las dos:

- el rubro está en un `Set` **congelado en código** (`MODULOS_LISTOS`, hoy `{dental}`), y
- su `coreRubro` corresponde a un `verticalTracks[].status === "first_beta_active"` en
  `onia-core/contract.json` (hoy solo `dentagest-clinical`; los otros 10 están
  `pending_adoption`, `planned_after_core`, `roadmap_planned` o `roadmap_exploring`).

La segunda condición se verifica **en el repo, al publicar** (donde vive
`contract.json`), no en runtime: el contenedor no tiene el core y **no se agrega un
sync nuevo** — ese patrón ya falló en silencio una vez. En runtime manda el `Set` del
código. Encender un módulo nuevo sigue siendo un commit, y eso está bien: es una
promesa comercial, no un dato.

**Gate de publicación:** todo cambio de `rubros[]` corre `bench.mjs` (60 casos,
hoy 60/60). Si el benchmark baja, no se publica. Ya existe; solo hay que exigirlo.

---

## 5. Ruta de adopción en 3 pasos

### (a) Archivo en el VPS, editable por SSH — ✅ IMPLEMENTADO (2026-08-06)

1. ✅ Cargador `knowledge.mjs`: lee `/tmp/onia-bot/knowledge.json` (ruta por defecto = al
   lado del módulo; `ONIA_BOT_KNOWLEDGE_FILE` la pisa), valida (§4), cachea con TTL 300 s
   refrescando fuera del camino de la respuesta, degrada a `DEFAULT_CONFIG`. Nunca tira, y
   la degradación es **identidad**: sin archivo devuelve el MISMO objeto de config.
2. ✅ `config.mjs` pasa a ser el **piso**: los valores actuales quedan como fallback
   literal, sin borrar nada. Los 20 templates renderizan byte a byte igual que antes.
3. ✅ **(2026-08-08)** `intents.mjs` compilando el léxico desde `rubrosExtra[]`: las
   palabras se normalizan, se **escapan** (nunca son regex) y se compilan `\bpalabra\w*\b`,
   agregadas SIEMPRE detrás de las del código. `parseQualification`, `findIndustry` e
   `industryLabel` reciben la config; sin `rubrosExtra` devuelven exactamente el léxico de
   antes. Compuerta: `--check` corre el banco y rechaza si baja (§2.1).
4. ✅ Variables nuevas en `varsFor` (`demo_duracion`, `demo_modalidad`, `horario_frase`) y
   las plantillas de §1.2 usándolas.
5. ✅ `webhook-server.sh` (y los otros 3 wrappers): STAMP con `*.json` + acción
   `knowledge` con validación previa (§3.6).
6. ✅ `/health` reporta `knowledge: { source, version, updatedBy, faq, triggersDemo,
   rubros, loadedAt, path, lastError }`. ⛔ Falta la **alarma del watchdog** si `source` cae a
   `code` después de haber sido `file`: `webhook-watchdog.sh` hoy solo mira que `/health`
   conteste, no qué dice. Sin esa alarma, "edité y no pasó nada" se ve solo si alguien
   mira `/health` a mano.

Resultado hoy: cambiar horario, identidad, duración/modalidad de la demo, la respuesta
del SIAT **y agregar un rubro nuevo** = editar un JSON por SSH. Sin build, sin commit, sin
reinicio. Falta sólo la alarma del watchdog (punto 6).

### (b) Editable desde el panel ONIA Center

7. Tabla `onia_center.bot_knowledge` — **append-only**, mismo patrón que `bot_messages`:
   `id`, `payload jsonb`, `version text`, `updated_by`, `created_at`. El bot lee la fila
   más nueva. El rollback es republicar una fila vieja; no hace falta ni un flag ni una
   tabla de historial.
8. El cargador antepone la DB al archivo (mismo PostgREST de `persistence.mjs`, mismas
   credenciales que el contenedor ya tiene).
9. Pantalla del panel: editar FAQ y hechos, **previsualizar**, y publicar solo si el
   validador da verde — mostrando el código violado, no un "error" genérico. Es el
   equivalente de `/bot-config` de BE (transparencia de textos y reglas).

> No se hace que el panel escriba `/tmp/onia-bot/knowledge.json` aunque comparta
> contenedor: `/tmp` se borra al recrear el contenedor y las ediciones desaparecerían
> sin aviso.

### (c) Opcional — que la rama LLM lea el mismo conocimiento

10. `askLiteLLM` (`run-turn.mjs:131`) recibe hoy un system prompt que prohíbe todo y no
    tiene ningún hecho. Se le inyectan como **grounding** las FAQ con
    `status: "publicado"` y vigentes, más los hechos de `empresa`/`demo` — tope duro de
    ~20 entradas / 2.000 caracteres para no inflar el prompt ni el costo.
11. Regla que se agrega al prompt: *"solo podés reformular lo que está en estos hechos;
    si la respuesta no está acá, no la inventes"*.
12. **No cambia ningún mecanismo de seguridad**: la salida sigue pasando por
    `enforceGuardrails`, y si no hay LiteLLM sigue cayendo a `safe_reply`. El
    conocimiento es contexto, nunca instrucciones: el texto de una FAQ se cita como
    dato, jamás se ejecuta como orden.

Los pasos (a) y (b) son independientes de (c). (a) ya resuelve el problema del dueño;
(c) es mejora de calidad y puede esperar.

---

## 6. Riesgos y qué se rompe si alguien edita mal

| Riesgo | Qué pasa | Mitigación |
|---|---|---|
| **Edición silenciosa que no aplica** (JSON tocado, STAMP sin cambiar, o archivo rechazado sin que nadie mire) | El bot sigue con el código y todos creen que se publicó. Es el modo de falla que ya nos costó días con `sync-onia-core.mjs` | `/health` con `source`+`version` · alarma del watchdog si cae a `code` · validador al publicar |
| **Palabra de rubro demasiado amplia** (ej. "local", "estudio" en `fuerte`) | Clasifica mal, dispara la rama equivocada y el bot habla de otro negocio | Las genéricas van en `debil` (exigen la señal de posesión del código) · `bench.mjs` obligatorio antes de publicar |
| **Regex escrita a mano por un editor** | Matcher roto o proceso colgado | El esquema acepta **palabras**, no patrones; el cargador escapa y compila |
| **Intento de meter un precio o una promesa** | Sería la muerte del argumento de venta ("no alucina") | Rechazo del archivo por `checkGuardrails` + allowlist sin campos donde escribir una cifra |
| **Encender `moduloListo` de un rubro sin módulo** | El bot promete una feature que no existe (N2) | Doble llave: `Set` congelado en código + `status` del core al publicar |
| **Borrar el archivo o dejarlo corrupto** | Se pierden todas las ediciones de golpe | Degradación a código (el bot sigue vendiendo igual que hoy) + append-only en DB desde el paso (b) |
| **Contenedor recreado** | `/tmp/onia-bot` se vacía | El watchdog re-sincroniza desde `/opt/onia/bot`; la copia durable vive en el host y, desde (b), en la DB |
| **FAQ vieja que ya no es cierta** (ej. la fecha del SIAT una vez pasada) | El bot afirma algo falso — el peor daño posible de esta capa | `vigenteHasta` obligatorio en toda FAQ con fecha; vencida = no se sirve |
| **Inyección por FAQ hacia el LLM** (solo en el paso c) | Un texto editable podría intentar dar órdenes al modelo | Se cita como dato, nunca como instrucción · `enforceGuardrails` sigue filtrando la salida |
| **Ediciones simultáneas panel + SSH** | La DB gana siempre y la edición por SSH parece ignorada | Documentado: con (b) encendido, el archivo es fallback. `/health` dice cuál está mandando |

---

## 7. Qué NO se hace (a propósito)

- **No se instala el módulo `knowledge` del core.** Está `draft`,
  `installInProductRepos: false` y es KB por tenant-cliente. Se adopta la forma de sus
  campos para migrar barato después.
- **No se agrega un sync del core al VPS.** El chequeo contra `contract.json` corre en
  el repo, al publicar. Un sync más es un punto más donde fallar en silencio.
- **No hay versionado propio ni workflow de aprobación.** Append-only en la DB alcanza
  para rollback. Cuando haya varios editores se revisa; hoy hay uno.
- **No se hace multi-tenant.** Sigue siendo un solo tenant (Onia). El salto a N
  clientes es el de la spec §7.3 y va cuando haya clientes pagando.

---

*Fuentes verificadas en el repo: `hermes-content/deploy/vps-ops/bot/{config,intents,guardrails,run-turn,persistence,webhook-server}.mjs`, `webhook-server.sh`, `webhook-watchdog.sh` · `hermes-content/docs/{ONIA_CHATBOT_PROPIO_SPEC_20260725,ONIA_CHATBOT_KNOWLEDGE_BE_20260726,ONIA_CATALOGO_TIPOS_CHATBOT_20260731,ONIA_BOT_GOLIVE_RUNBOOK_20260801}.md` · `onia-core/contract.json`, `onia-core/modules/knowledge.json` · `supabase/migrations/20260725_onia_center_bot_conversations.sql`.*
