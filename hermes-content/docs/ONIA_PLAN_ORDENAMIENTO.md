# Plan de ordenamiento — que las sesiones dejen de reconstruir

**Problema medido, no supuesto.** Sergio: *"estamos dando muchas vueltas en esas cosas."*
La Fase 0 (2026-08-24, tres auditorías con evidencia) encontró por qué.

> Un tema, un archivo, sin fecha. **Este doc se EDITA**, no se reemplaza por una copia nueva.

---

## Lo que se midió

| Hallazgo | Número real |
|---|---|
| Documentos en `docs/` | **416** (223 en la raíz, 115 en `historial/`) |
| Con fecha completa FUERA de `historial/` | **99** — 61 en la raíz, que conviven con los vivos |
| Archivos vivos que **contradicen** el precio de la fuente | **24** (20 en `hermes-content`, 4 en `onia-platform/docs`) |
| De esos, **material que ve un cliente** | **6** |
| Docs que se autodeclaran fuente de verdad | 17 (el esqueleto a preservar) |
| Huérfanos que nadie enlaza | 24 — **4 de ellos se declaran fuente** |

**El código está limpio.** Cero precios hardcodeados en `onia-platform`, con dos guardas
automáticas ya vivas. **El desorden es 100% de documentos.**

### Las dos puertas de entrada están rotas

1. **`LEEME-PRIMERO.md`** dice "163 documentos" (hay 223) y **5 de sus 6 punteros
   apuntan a `historial/`**. Quien empieza por ahí aterriza en historia.
2. **`ONIA_PRICING_2026.md`** se autodeclara *"documento canónico de precios"* — contra
   `CLAUDE.md`, que dice que mandan `pricing.ts` y `subscription-plans.ts`. Tiene cifras
   de **junio** y es **el doc más enlazado del repo: 17 archivos entrantes**. Su tabla está
   clonada literal en otros dos.

### El caso que lo resume

`sales-kit/01-ONE-PAGER-OFERTA.md:53` dice `Bs 1.500 inst. + Bs 1.490/mes`
**y en la misma celda cita `pricing.ts` como su fuente**. La fuente dice **Bs 390/mes, sin
cargo inicial**. Un vendedor lo lee y cree que verificó.

Y el generador de propuestas (`propuestas/generador/clientes.json`) tiene los planes en
`390/890/1.990` cuando la fuente dice `320/750/1.500`: **toda propuesta que salga hoy lleva
precios que no existen.**

---

## Fase 1 — Una sola cifra por concepto

**Por qué primero:** es lo único que ya está costando plata.

### 1.1 Lo que ve un cliente (6 archivos, hacer YA)

| Archivo:línea | Dice | Debe decir |
|---|---|---|
| `sales-kit/01-ONE-PAGER-OFERTA.md:53` | Bs 1.500 inst. + 1.490/mes | **Bs 390/mes o Bs 3.900/año, sin cargo inicial** |
| `propuestas/generador/clientes.json:904,912,920,932` | 390 / 890 / 1.990 | **320 / 750 / 1.500** (anual 3200 / 7500 / 15000) |
| `propuestas/propuesta-dentalgest.html:131,133` | idem | **regenerar**: `node generar-propuestas.js dentalgest --pdf` |
| `docs/ONIA_VENDOR_PACKET_2026.html:352,386,611,632,666` | Bs 650 inst. + 350/mes | Bs 390/mes, sin instalación |
| `sales-kit/SALES_VENDOR_PRICING_DECK_2026.html:298-303` | 349 / 590 / 990 | 320 / 750 / 1.500 |
| `sales-kit/ONIA_PROJECTS_VENDOR_DECK_2026.html:410-412` | 349 / 590 / 990 | idem |

### 1.2 Los internos (18 archivos)

> ✅ **Hecho el 2026-08-27 para todo `hermes-content/docs/`** (carril `carril/precios-docs`).
> Quedan fuera de ese barrido, a propósito: `historial/` (es historia), los `.html` (otro
> carril), `hermes-content/propuestas/`, `hermes-content/skills/` y `onia-platform/docs/`.
> Los dos que exigían REHACER la cuenta —`ONIA_AGENTES_COSTO_API.md` y
> `ONIA_FECHAS_CRITICAS_PLAN.md`— se recalcularon enteros, y **dos conclusiones cambiaron de
> signo**: a Bs 390 el régimen "Onia absorbe Meta" pierde plata dentro de su propio cupo, y
> el colchón de soporte humano cayó de ~15 h/mes a ~3,9 h/mes.

`ONIA_CHATBOT_LINEA_DE_ENTREGA.md:14,198` · `ONIA_CHATBOT_ALTA_WHATSAPP_CLIENTE.md:38,275,285` ·
`ONIA_CHATBOT_ESTADO_LOOP.md:101,179` · `ONIA_AGENTES_COSTO_API.md:16,121,270,281,286` ·
`ONIA_FECHAS_CRITICAS_PLAN.md:58,63,69,72` · `ONIA_RADAR_DECISIONES_PRODUCTO.md:59` ·
`ONIA_SENDYPRO_ANALISIS.md:177,184,186,214,242` · `ONIA_PSICOLOGIA_PRECIOS_COMPETENCIA.md:249,327,328,352` ·
`ONIA_PENDIENTES_PARA_LANZAR.md:65,76` · `ONIA_PRICING_2026.md:159` · `ONIA_VENDOR_MANUAL_2026.md:133` ·
`ONIA_VENDOR_SALES_PLAYBOOK_2026.md:81` · `ONIA_DEPLOYMENT_OFFLINE_HA_PRICING_2026.md:440,441,502,503` ·
`propuestas/ONIA_PRICING_ESTRATEGIA_ESCALADA_2026.md` · `propuestas/ONIA_CATALOGO_PRECIOS_2026.md:44` ·
`onia-platform/docs/{WHATSAPP_ADDON_COSTS,whatsapp-addon-architecture,PRICING,FOUNDER_PRICING}.md`

⚠️ **`ONIA_AGENTES_COSTO_API.md` no es un reemplazo de texto**: los Bs 1.490 son la BASE de
todo su cálculo de margen. Con Bs 390 las conclusiones cambian — **hay que rehacer las
cuentas, no cambiar el número.**

### 1.3 Degradar al falso canónico

> ✅ **Hecho el 2026-08-27.** `ONIA_PRICING_2026.md` ya no se declara canónico y arranca con el
> aviso que manda a los dos archivos de código y a `ONIA_QUE_SE_VENDE_Y_A_QUE_PRECIO.md`. Se
> redirigieron sus enlaces entrantes dentro de `hermes-content/docs/` y se pusieron banners a
> las dos copias de su tabla (`ONIA_VENDOR_MANUAL_2026.md`,
> `ONIA_CASH_ENGINE_SERVICE_CATALOG_2026.md`) más `ONIA_VENDOR_SALES_PLAYBOOK_2026.md`.
> **Faltan los punteros de fuera de esa carpeta**: `COORDINATION_MANIFEST.md`,
> `docs/ORCHESTRATOR.md` (el de la raíz), `hermes-content/propuestas/{PRICING_RATIONALE_INTERNO,
> BCP_PASARELA_CREDENCIALES_INTERNO}.md` y `hermes-content/skills/{consultoria-onia,
> propuestas-comerciales-onia}.md`.

`ONIA_PRICING_2026.md` deja de declararse canónico y pasa a apuntar a las dos fuentes.
**Sus 17 enlaces entrantes hay que redirigirlos**, o el doc degradado se sigue leyendo.
Mismo trato a las dos copias de su tabla: `ONIA_VENDOR_MANUAL_2026.md:43-54` y
`ONIA_CASH_ENGINE_SERVICE_CATALOG_2026.md:82-84`.

### 1.4 La guarda que lo clava

Ya existe el patrón en el producto: `lib/pricing-honestidad.test.ts` impide prometer lo que
nadie consume. **Escribir el equivalente para docs**: un script que falle si un archivo de
`sales-kit/`, `propuestas/` o `docs/` escribe una cifra de precio sin venir de las fuentes.

### Verificación de la Fase 1
- [ ] `grep -rE "1[.,]?490|Bs\.? ?650|349/mes|590/mes|990/mes|890/mes|1[.,]990/mes"` en
      `hermes-content/` fuera de `historial/` → **cero resultados**
- [ ] Una propuesta regenerada muestra 320/750/1.500
- [ ] El script de guarda corre en verde
- [ ] **Verificar MIRANDO**: abrir el one-pager y un deck renderizados

### Anti-patrones de esta fase
- ❌ Cambiar el número en `ONIA_AGENTES_COSTO_API.md` sin rehacer el cálculo
- ❌ Editar `propuesta-*.html` a mano — se REGENERAN desde `clientes.json`
- ❌ Degradar `ONIA_PRICING_2026.md` sin redirigir sus 17 enlaces

---

## Fase 2 — Arreglar las dos puertas de entrada

**Por qué segundo:** con los números correctos pero el índice roto, la sesión igual aterriza mal.

- ✅ **`LEEME-PRIMERO.md` reescrito el 2026-08-27.** Ningún puntero va a `historial/`; arranca
  por dónde viven los precios (los dos archivos de código) y ordena los docs vivos por venta,
  plata/legal, infra y handoff. Corrige de paso el conteo (decía 163 documentos; son 390) y
  cierra el ítem del tipo de cambio 6,96, que ya está arreglado en `fx.logic.mjs`.
- **Enlazar los 4 huérfanos que SÍ mandan** — `ONIA_INFRA_LIMPIEZA_Y_ORDEN`,
  `ONIA_LEGAL_BOLIVIA_ESTADO`, `ONIA_WEB_FACTORY_Y_PRODUCTO_UI`,
  `ONIA_AGENTES_IA_DISENO_FUNCIONAL`. **No archivarlos: nadie los nombra pero mandan.**
- **Renombrar los 7 que se declaran fuente y llevan fecha** — su nombre contradice la regla.

### Verificación
- [ ] Cada puntero de `LEEME-PRIMERO.md` existe y NO está en `historial/`
- [ ] Los 17 docs fuente están enlazados desde el índice

---

## Fase 3 — Un tema, un archivo

- **Archivar** los 61 con `YYYYMMDD` de la raíz → `historial/`
- **Fusionar los clusters**: n8n (6→1) · orquestación Hermes (6→1: `ONIA.md`,
  `ORCHESTRATOR.md`, `PROJECTS_ORCHESTRATION.md`, `OPERATIONS.md`, `EXECUTION_PROTOCOL.md`,
  `DASHBOARD.md`) · video (`VIDEO_FACTORY_PLAN` + `VIDEO_FACTORY_DESIGN`) · los 25
  `ONIA_BOX_*` bajo su índice maestro
- **Sacar de `historial/`** los 10 que no tienen fecha (o ponérsela)
- Modelo a copiar: **`docs/handoff/` es la única carpeta 100% en regla.** Su `README.md` ya
  define la plantilla correcta.

### Anti-patrón
- ❌ Borrar. Se **mueve** a `historial/`. La historia no molesta si está en su carpeta.

---

## Fase 4 — El stack de skills

**Parcialmente hecho el 2026-08-24** (commit `e4230280`): se corrigieron `onia-chatbot`
(decía "`$env` NO existe" — el consejo que produjo 7 workflows con claves adentro; y decía
que el editor de conocimiento no existía, estando en producción), `onia-router` (ruteaba a
6 subagentes retirados, 3 skills inexistentes, 1 ruta rota), y las descriptions de
`onia-core` y `onia-contabilidad-bolivia` que llamaban "productos" a los packs.

**Queda:**
- ✅ ~~**`_retirados/` está DENTRO de `.claude/agents/`**~~ — **resuelto 2026-09-29:** los 6
  retirados se borraron (y 2 agentes más sin uso); ver `historial/LIMPIEZA_SKILLS_20260929.md`.
- ✅ ~~**`ONIA_SKILLS_STACK_Y_SUBAGENTES.md`** desactualizado~~ — **resuelto 2026-09-29**
  (215 globales, 1 subagente).
- **Falta una skill de infra/VPS.** Es el carril con el conocimiento más caro y repetido
  (contenedores, Swarm, firewall del 3000, el steal de Hostinger, operar Docker por el
  socket cuando el CLI cuelga) y hoy vive solo en memorias sueltas, que no se cargan solas.
- **Duplicación**: `.agents/skills/` tiene 28 carpetas idénticas a `.claude/skills/` más 3
  huérfanas, y `impeccable` diverge entre las dos copias.

---

## Fase 5 — El plan por frentes

Recién con lo anterior cerrado. Estado real al 2026-08-24:

| Frente | Dónde está | Lo que sigue |
|---|---|---|
| **Plataforma** | Desplegada, `03b410a`, 2040 tests. Marca, citas, precios, reprecio FX y lotes con vencimiento en producción | **Multi-almacén** (`branchId` no existe) — decide si Bolivian Electric puede usarlo |
| **Chatbots** | Tech Provider, App Review aprobado. Workflow IG→DM vivo, 200 en 0,52 s | ⚠️ **Access Verification vence el 20-oct-2026**. Y `knowledge.json` tiene **un solo hecho**: es contenido, no código |
| **Webs** | Lead magnet vivo en `/guia-facturacion`. Cola de 5 prompts con veredicto | Ejecutar P03/P01/P02/P04 en ese orden |
| **Infra** | Sana: steal 9%, load 1,2, webs bajo 1 s | `docker update --restart=no` a Temporal/Elasticsearch/Speaches |

### Decisiones que esperan a Sergio
1. **La flecha**: ¿comercio de mostrador, o Bolivian Electric como piloto? Lo segundo tiene
   nombre, dolor relevado en 10 puestos y acceso directo — pero exige multi-almacén.
2. ✅ **DECIDIDO (2026-08-24): los precios de webs y consultoría NO entran en la regla.** Esa
   línea **no lleva lista de precios**: se cotiza caso por caso, porque el alcance cambia con
   cada cliente y una lista fija obliga a estirar o a regalar
   (`ONIA_QUE_SE_VENDE_Y_A_QUE_PRECIO.md` §4.5, `ONIA_WEB_COMO_SE_VENDE.md` §8).
   🔴 **Queda escrito para que nadie las "corrija" contra `pricing.ts`**: ese archivo no cubre
   esta línea, y un barrido que las toque está rompiendo, no ordenando. Los avisos ya están
   puestos en `ONIA_PRICING_2026.md`, `ONIA_CASH_ENGINE_SERVICE_CATALOG_2026.md`,
   `KIT_VENTAS_AGENTE_IA_2026.md`, `PROJECTS_ORCHESTRATION.md` y los dos docs de vendedores.
3. **El seguimiento del bot no tiene hora de silencio** — puede escribirle a un prospecto a
   las 6 de la mañana. Ponerle el freno achica la ventana de Meta. Está esperando desde el 16-ago.

---

## Fase final — Verificación

- [ ] `grep` de cada cifra retirada en `hermes-content/` fuera de `historial/` → cero
- [ ] Ningún archivo con `YYYYMMDD` fuera de `historial/`, salvo los que se declaren fuente
      (y esos, renombrados)
- [ ] Cada puntero de `LEEME-PRIMERO.md` resuelve a un archivo vivo
- [ ] Los 6 subagentes retirados ya no aparecen en la lista de agentes disponibles
- [ ] Una sesión nueva que arranque por `onia-router` llega a los docs correctos **sin
      preguntar y sin reconstruir**

### La prueba de fuego
Abrir una sesión nueva, invocar `onia-router`, y pedirle el precio del chatbot y el estado
del editor de conocimiento. **Si contesta Bs 390 y "está en producción", el ordenamiento
funcionó.** Si dice Bs 1.490 o "no existe", falta trabajo.
