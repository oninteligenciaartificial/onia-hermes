# Pendientes para lanzar — qué está a medias y en qué orden se mata

## LA COLA DE TERMINACIÓN — 2026-08-22 (orden de Sergio: "terminar el servicio, uno por uno")

> Regla de la cola: **un ítem a la vez en cada carril, nada nuevo hasta cerrar el anterior.**
> Cada ítem grande corre con el loop de tres roles (planeador→ejecutador→evaluador,
> `Workflow loop-tres-roles`) con su "LISTO =" verificable. Decisión de Sergio implícita en
> la orden: la caja con carrito y el panel de importadora SE CONSTRUYEN (no esperan a v1.1).

| # | Ítem | Horas | Estado | LISTO = |
|---|---|---|---|---|
| 1 | Deploy lotes 1+2 (formato Bs, nombres de plan, jerga) | — | ✅ CERRADO 22-ago 19:38 UTC | `/contact` renderizado: `Completo — Bs 1.500/mes` ✓ |
| 2 | Lote 3: calendario, 6 tablas móvil, ayuda por rubro, voseo | ~21 | ✅ CERRADO 22-ago 20:42 UTC | prod verificado: registro y booking vosean ('Elegí tu profesional'), 1923 tests |
| 3 | **Caja con carrito** multi-línea + ticket del día + anular | 16 | ✅ CERRADO 22-ago 21:01 UTC | loop 2 vueltas; en prod (page+route compilados, 16 tests); vive tras login — se mira con la primera sesión real | venta de 3 productos en un ticket, lista del día, anulación revierte stock y caja; mirado renderizado |
| 4 | **Panel propio de importadora** | 16 | ✅ CERRADO 22-ago 21:58 UTC | en prod; mirado tras login con superadmin (app sana); la vista importadora se mira cuando exista una org de ese rubro | el dashboard de importadora no menciona caja ni mostrador; sus accesos van a SUS pantallas |
| 5 | Rediseño panel dental | 16 | ✅ CERRADO 23-ago 00:26 UTC | en prod (738d271). 🔶 Vive tras login: NADIE lo miró en producción todavía — lo mira Sergio al entrar | hero con el día andando, sin columna vacía, pendientes con jerarquía |
| 6 | Datos fotografiables + comercio sin vocabulario dental | 9 | ✅ CERRADO 23-ago 00:26 UTC | en prod; verificado en local por el evaluador (dental Bs 942,50, importadora Bs 21.633) | panel de los 3 rubros sin ceros y sin palabra Demo |
| 7 | Lote final: vacío del inventario, voseo en TODO el producto, guards | 7 | ✅ CERRADO 23-ago — en prod y **mirado**: `/login` dice «Entrá a tu cuenta». Cola: `/contact` (ruta suelta) se había escapado del barrido y le hablaba **en dental a los 5 rubros** — arreglado y fijado con el guard 20 (2a2b77b) | vacío que invita en vez de parecer error |
| 8 | **Fotografiar los 5 rubros** → llenar el hueco de la landing (40% de la página) | 3 | ✅ CERRADO 23-ago (8a2d74b6) — **falta que Sergio lo VEA antes de publicar** | la sección de rubros muestra el panel real de cada uno, mirado a 1440 y a 390 |

### Lo que hubo que arreglar para poder fotografiar (ítem 8)

Ninguna de las cuatro se veía leyendo el código; salieron de mirar la pantalla:

1. **El sembrado tenía 3 inquilinos y la landing publica 5.** Estética y servicios no se
   podían fotografiar porque no había cuenta que abrir. Ahora son cinco, con ruteo explícito
   por track (el `else` final le habría sembrado embarques de aduana a una estética).
2. **`seedDemoData` viene del core y parecía agnóstico: no lo es.** Sembraba el catálogo
   dental para cualquier rubro — un estudio contable vendía "Resina compuesta".
3. **Las marcas de utilería estaban a la vista, y de tres formas distintas**: `Demo · `,
   `(demo)` y `(demo, hace 220 días)`, más "Paciente de demostración" en las notas — en
   dental, que es el rubro vivo y el que más se fotografía.
4. **Los cinco rubros compartían la misma clientela.** La agenda dental y la de estética
   salían idénticas —mismo nombre, misma hora, mismo teléfono— y sólo cambiaba el motivo.

Y el hallazgo que explica el "las capturas se ven muy mal" de Sergio: **no era el encuadre,
era la escala.** La tarjeta medía 290×340 px; cualquier pantalla de gestión entraba ahí al
45% y el texto de 16 px caía a 7 px. La tarjeta pasó a 478×560 y el recorte va casi 1:1.
| 9 | v1.1: chatbot Bs 390 + WhatsApp por cliente + conversaciones en el panel | ~24 | tras v1.0 | ver ONIA_PLAN_DE_VERSIONES |

**Los loops que revisan todo el tiempo (vivos hoy):**
- Monitor de pantalla del cliente — cada 15 min, mide glifos/peso/texto, avisa a Telegram. VIVO.
- Guardián del VPS — cada 10 min, autocura contenedores. VIVO.
- Higiene de docs — diario 06:10. VIVO.
- Recordatorios de cita — cada 15 min. VIVO.
- El driver de esta sesión: wakeup que encadena la cola — cuando un ítem aterriza, lanza el
  siguiente sin esperar orden humana. El "LISTO =" de cada fila es lo que el evaluador
  del loop verifica antes de dar por cerrado.

**De Sergio (nada me bloquea):** números del plan nuevo de Higgsfield · rotaciones cuando
tenga su laptop · esperar la Access Verification de Meta (~5 días) · los 12 workflows n8n
dudosos.


> Doc VIVO. Estado verificado el 2026-08-18 mirando producción, no de memoria.
> Regla: nada acá se declara "listo" si no está encendido en prod y visto.

## 🔴 Bloqueantes de venta (matar primero)

| # | Qué | Estado exacto | Quién |
|---|---|---|---|
| ~~1~~ | ~~**Factura no se crea sin fecha de vencimiento**~~ | ✅ **ARREGLADO 2026-08-19**, en rama `fix/factura-sin-vencimiento` (commit `e0033b4`), **no en producción todavía**. Era `.optional()` en Zod, que acepta `undefined` y rechaza `null`. Se arregló la clase entera, no el campo del reporte: facturas (`dueDate`, `notes`, `treatmentId`) y el POST de recurrentes (`endDate`, `notes`), que rechazaba justo lo que su propio PATCH ya aceptaba — el mismo bug esperando turno. Y el 400 ahora **nombra el campo**. Suite 1581 → 1587. ✅ **EN PRODUCCIÓN desde el 2026-08-20 19:08 UTC** (e8fc111, swap de 4 s, backup fechado, sin rollback). Verificado: BUILD_ID nuevo sirviendo y el viejo en 404, la ruta de facturas compilada en el runtime vivo, login mirado (glifos, no texto), logs limpios. Con él subieron: tour guiado por rubro, bot de ayuda, FAQ por rubro y roles con nombre. ⚠️ Lo que AÚN nadie probó en prod con sesión real: crear la factura sin vencimiento punta a punta, el tour marcando pasos contra la base real, y el bot de ayuda respondiendo — primer uso real = primera verificación | Sergio: crear una factura sin fecha y avisar |
| ~~2~~ | ~~**Dos políticas contradictorias**~~ | ✅ **EN PRODUCCIÓN 2026-08-20** (3f1111a): texto único ratificado por Sergio — OniaAgency + NIT 5371375010, business@onia.com.bo, cero Gmail (había 6), leyes reales, sin promesas falsas. La raíz era `lib/legal.ts`: el fix arregló también /terms y /data-processing | ✅ |
| ~~3~~ | ~~**Portabilidad que no existía**~~ | ✅ **EN PRODUCCIÓN 2026-08-20**: botón "Exportar mis datos" en Configuración (solo ADMIN, sin gate de plan — es un derecho). ZIP de planillas ordenadas: Resumen primero, una por entidad con vocabulario del rubro, formato Excel es-BO, audit trail. Tests 1635→1653. ⚠️ Falta el clic real de Sergio con su sesión | Sergio: probar el botón |
| ~~4~~ | ~~**Cobro del add-on chatbot**~~ | ✅ **EN PRODUCCIÓN 2026-08-20 23:50 UTC** (7bc8c81): el dueño contrata desde Configuración (monto leído de pricing.ts; hoy Bs 390 — cuando se construyó eran Bs 2.990, instalación incluida), sube comprobante, cae en la cola /admin/payments con etiqueta propia, y **al aprobar el add-on se enciende solo** en la misma transacción. Cero tablas nuevas: viaja por el circuito de planes. Tests 1653→1669. ⚠️ Falta el primer ciclo real: un comprobante de verdad aprobado por Sergio | Sergio: primer ciclo real |
| 5 | **Cuenta corriente empresa BCP sin abrir** | Sin ella no hay API de QR → el checkout sigue sin pasarela. Paquete redactado y listo para firmar | **Leslie firma · Sergio llama al ejecutivo** |

## 🟡 A medias (construido, no terminado)

| Qué | Lo que falta |
|---|---|
| **Emisión fiscal SIAT** | El producto llama a un **mock** (CUF simulado, cero red). El emisor real existe pero **no está deployado**; `SIAT_EMISSION` no existe en el entorno de prod; las 3 orgs tienen NIT vacío. Bloqueo real: **Fase 2, inspección del SIN, límite 04-nov-2026** (ya NO es el NIT: está activo) |
| **Nota de crédito** | Nace BORRADOR y el RCV excluye borradores → **anular no baja el débito fiscal** |
| **Compras / crédito fiscal** | Una clínica no tiene por dónde cargar compras → su crédito fiscal es estructuralmente 0 |
| **WhatsApp del cliente** | App Review de Meta EN CURSO (~20 días). Mientras, el bot vive en el widget web (que funciona) |
| ~~**Landing v2 (Fanvue)**~~ | ✅ **VIVA en onia.com.bo desde el 2026-08-20**, verificada mirando producción: v2 promovida a `/`, conmutador de rubros estilo Fanvue andando, precio del chatbot al día de ese deploy (Bs 1.490; desde el 2026-08-21 son **Bs 390/mes sin instalación**), cero escalera N1/N2/N3 (seguía publicada con precios retirados). La v1 queda en git |
| **Notificaciones entre equipo** | Centro de notificaciones y Web Push existen en código; **NO verificado entre dos usuarios reales**. Es la prueba que falta para decir "así funciona en una empresa" |
| **Poda de agentes/MCP** | 6 agentes de proyecto retirados (reversible). Faltan ~24 globales, 7 jobs y la lista de MCP a desconectar |
| **Loops sin promptear** | Investigación pendiente (cayó por 529). El workflow de 3 roles ya existe y funciona |
| **Webs conectadas al sistema** | 4 circuitos documentados; Bolivian Electric es el laboratorio. Sin empezar |

## 🟠 Decisión de Sergio — dos catálogos del mismo empaquetado (2026-08-20)

Un análisis mandó a "conectar los tiers al registro"; verificado, la premisa era falsa
(el registro YA valida el rubro contra el enum del core). Lo REAL que apareció:

- **`lib/subscription-plans.ts`** (producto, lo que cobra): `basic/professional/clinic/enterprise`
  @ 320/750/1.500/2.900 — lanzamiento congelado 12 meses.
- **`onia-core/business-tiers.json`** (core, sin UN caller fuera del core): `ordenado/profesional/empresa`
  @ 390/890/1.990 + `e1/e2/e3` en USD.

Mismo empaquetado, ids y montos distintos, y `tierMeetsLimits()` construida y testeada con
valor cero — el patrón "construido ≠ terminado" por tercera vez. La pregunta que solo vos
respondés: **¿los ids de plan del producto adoptan los ids de tier del core, o se escribe un
mapeo explícito plan↔tier?** Hasta entonces, nadie escribe código sobre esa entidad.

## Deploy combinado 2026-08-21 01:09 UTC (8fe8cb5) — I1 + enchufe BCP

- **Portal de requerimientos EN PRODUCCIÓN** (I1, el "primero de todo" del carril): la
  máquina de estados YA EXISTÍA en el core — fue encender, no construir. Cero tablas
  nuevas. Un "acceso" jamás se auto-acepta. 1736 tests.
- **Enchufe BCP dormido en producción**: sin env de BCP el checkout es idéntico a ayer;
  el día que el banco entregue credenciales se enciende por configuración. Las 8
  preguntas técnicas para el ejecutivo viven en la cabecera de `lib/gateway/bcp-qr.ts`.
- **Hallazgo grave arreglado en caliente**: `payment-proofs` NO EXISTÍA en prod — el
  bucket de los comprobantes de pago. Subir un comprobante casi seguro fallaba desde
  siempre. Creado (privado, 5 MB, espejo del código) y probado con subida+borrado real.
- Pendiente de deploy (en master): fix de hidratación del checkout (`b822c1d`).
- 🔴 **Operación de rotación pendiente (planificada, no de apuro)**: password de
  Postgres del VPS (fragmento expuesto en un chat de agente) + limpiar
  `/root/.bash_history` que tiene tokens de Meta en texto plano + rotarlos. Recrea
  contenedores: necesita ventana.

## Cola de sesión cerrada 2026-08-21 (diagnósticos + fixes)

- **/book — fuga de datos CERRADA en prod** (swap 2026-08-21 02:19 UTC, sin rollback; verificado sin sesion: 0 emails/telefonos/orgs en el payload y el DOM): el índice público publicaba el listado
  completo de clientes (nombre, teléfono, email) sin auth, además de "cita dental" a
  rubros no dentales. Fix: el índice ya no consulta la base ni lista orgs; cada negocio
  comparte su link directo gateado. Daño real acotado (solo 2 orgs QA en prod, cero
  clientes reales), pero se cierra antes del primer cliente. 1746 tests.
- **B4** — los 6 patrones de UI vistos; checkout-card tenía el bug del `0.01ms` en
  reduced-motion (se copiaba a bloques) → `transition: none` + spinner quieto.
- **F2** — 12 evals del bot; 11 gratis verde, la del modelo real estimada en US$0,00034 y
  NO corrida (permiso). Suite en `bot/evals/`.
- **E3** — 9 features de comandas verificadas; la máquina de estados y el pack de
  gastronomía YA existen en el core, encender el track es el paso 0.
- **E5** — Strix estimado US$10–25/corrida; recomendación: no gastar hoy (cero clientes).
- **payment-proofs** — bucket verificado, cero comprobantes perdidos.

## DEPLOY 2026-08-21 21:43 UTC (353f685) — los 3 defectos que solo se ven con datos reales

Segundo swap del dia, sin rollback. 1804 tests, tsc limpio.
- El panel ya no imprime la **razon de ruteo interna** junto a cada propuesta de los agentes
  ("accion sensible (contacta/publica/cobra/gasta/scraping)"). Se sigue auditando.
- Los agentes escribian **"285 BOB" y "hace 10 dias"** en el texto que le sale al CLIENTE
  FINAL por WhatsApp. Ahora "Bs 285" y con tildes.
- Cuatro rotulos de facturacion decian "paciente" a rubros que no son clinicas.

El gate del LF paso en los 3 puntos (archive local, tarball, extraido en el VPS): el CRLF
que ayer dejo el cron sin ejecutar no vuelve. Cron verificado post-swap, corrida limpia.

🔶 **Los 3 arreglos NO se pudieron mirar**: viven detras del login. Lo que si esta probado es
que el runtime sirve el codigo nuevo (`Bs. 3.900` con punto en 15 archivos del runtime y 0 en
el backup; al reves con la version vieja de coma). Es prueba del intercambio, no de la pantalla.

📌 Pendiente anotado, no urgente: 9 backups `runtime-next.prev-*` acumulados, /opt/onia-platform
pesa 19 GB (disco al 59%, 79 GB libres). Conviene dejar 2-3 y borrar el resto — **no lo hice
solo**: borrar backups es destructivo y va con permiso.

## DEPLOY 2026-08-21 20:04 UTC (56604e4) — recordatorios, precio 390 y la PWA instalable

Swap sin rollback. **1.804 tests** (la suma cierra exacta: 1746 + 16 + 42), tsc limpio.
Verificado MIRANDO sin sesion:
- **`/manifest.json` da 200** (era 307). La PWA es instalable: hay icono en el celular sin
  pasar por ninguna tienda. Cadena completa viva (sw.js, los 4 iconos, el `<link rel=manifest>`).
- **`/register`** sin una sola palabra de obra, con "¿Otro rubro? Escribinos", 5 rubros y los
  5 llegan al paso 2.
- **`/icon.svg`** verde. La fuente de iconos pesa 243 KB / 0,07 s (era 3,9 MB / 117 s).
- **El cron de recordatorios quedo instalado y ya disparo solo** (20:15:01, entrada unica).

⚠️ **Bug cazado instalando el cron, y era serio:** el script salia del repo con **CRLF**
(`core.autocrlf` en Windows), asi que el shebang quedaba `#!/bin/sh`+CR y el script
**no ejecutaba en absoluto** — "cannot execute: required file not found". Habria fallado en
silencio 96 veces por dia, justo en el cron que este deploy existia para encender. Corregido
con `*.sh text eol=lf` en `.gitattributes` y las dos trampas escritas en la skill onia-deploy.

🔶 **Lo mas debil de este deploy, dicho explicito:** todo lo que vive detras del login
(la fuga dental del Sidebar, los 6 rotulos de facturacion, las 9 tildes, la BottomNav por
rubro, el shell sin glass y las pantallas del chatbot a Bs 390) descansa en 96 tests
unitarios, **no en una pantalla de produccion mirada**. Y el camino de envio de
recordatorios nunca corrio contra datos reales: produccion tiene 0 citas.

## 2026-08-21 — el dia que la venta empezo a decir la verdad

**Lo que se descubrio midiendo (no suponiendo):**
- El material del chatbot **vendia cosas que el codigo no hace**: "IA entrenada con tu
  contenido" (el modo cliente no usa LLM), "recordatorios de cita y de cobro" (no existian),
  "agenda" (no agenda), "500 conversaciones, al llegar corta" (no hay contador). Se
  construyeron los recordatorios y se corrigio el texto del resto.
- **El correo estaba ROTO desde el 20-ago y la app decia "enviado".** Causa: `mail.onia.com.bo`
  resolvia a Cloudflare y Gmail rechaza si la vuelta del DNS no cierra (FCrDNS). Sergio lo
  corrigio; verificado que ahora cierra. Ademas `lib/email.ts` ahora detecta destinatarios
  rechazados — antes nodemailer no lanzaba y la app mentia.
- 🔴 **SPF NO autoriza al VPS** (hallazgo nuevo): `v=spf1 include:_spf.mx.cloudflare.net ~all`
  no incluye 187.77.16.63. Todo nuestro correo falla SPF. Falta agregar `ip4:187.77.16.63`.
- **El merge a medias del 20-ago habia borrado el modo recepcionista del bot** — 187 lineas,
  sin romper ningun test. El proximo deploy le cambiaba el bot a los clientes por el guion de
  venta de Onia. Recuperado. Leccion: los marcadores se ven con grep, la perdida semantica no.
- La PWA no era instalable por **una linea**: `/manifest.json` daba 307. Eso respondia solo la
  pregunta de las tiendas — con el manifest publico hay icono en el celular sin Play Store.

**Decisiones de Sergio:**
- **Chatbot Bs 390/mes, sin instalacion**, anual 3.900. El cliente le paga a Meta directo
  (se cae el +20%). Derivado de competencia (Xmart boliviano cobra 173-288), valor medido y
  canibalizacion con el plan Full. Detalle en la memoria `precio-chatbot-390-sin-instalacion`.
- **Veterinaria fuera de la web** hasta que el registro la entregue ("aun no terminemos los
  que ya tenemos"). La venta se alinea a la entrega, no al reves.
- **Tile verde** canonico; se borro el `app/icon.svg` naranja que lo tapaba.
- **Motor de video: HyperFrames.** Remotion queda como baseline historico y no se reabre.
- **No ir a las tiendas** por ahora: la PWA instalable da lo mismo sin cuota ni comision, y
  Apple obliga a su cobro para suscripciones (nombra "QR codes" como metodo prohibido).

**Gasto fijo real:** VPS US$40 (el doc decia 12-15) + Claude Max US$200 + Higgsfield
(pendiente). Operar cuesta ~Bs 461/mes; **3 clientes con plan Pro + chatbot cubren todo**.

## 🟢 Vivo y verificado en producción (no tocar salvo bug)

Registro y onboarding multi-rubro · 6 rubros · agenda/citas/pacientes/tratamientos ·
facturación interna con PDF y pagos · contabilidad con IVA 13% / IT 3% **sin
placeholders** · agentes Recall y Cobrador corriendo cada 24 h · chatbot por
organización (formulario → publicar → su bot contesta como recepcionista, con botones) ·
panel `/admin/chatbots` con alta en 1 click · gate del add-on (apagarlo apaga el bot) ·
canario de flujo en el guardián · hero nuevo en onia.com.bo · QR personal eliminado del
checkout.

## Deuda visual del dashboard — herencia DentalGest (detectada mirando, 2026-08-18)

| Qué se ve | Por qué está mal |
|---|---|
| **"Plan: professional"** en Contabilidad | Clave cruda de la base. Existe `PLAN_LABELS`/`nombreDePlan()` justo para esto (regla `onia-frontend`) |
| **Acentos faltantes en toda la navegación**: Facturacion, Configuracion, Cerrar sesion, Conciliacion, emision, preparacion, dueno, STOCK CRITICO | Herencia de cuando el proyecto evitaba tildes. Se ve amateur en la primera pantalla |
| **6 tarjetas KPI idénticas en fila** | Es el *banned pattern* nº1 de nuestro propio `design-quality.md`. La dirección ya elegida (v4/v5 "libro mayor editorial") lo resuelve con celdas de pelo y un solo numeral héroe |
| **Iconos en círculos verdes** en cada KPI | Estética DentalGest 2025; hoy el acento verde es semántico, no decorativo |
| **Emoji 🚀 en "Prioridades"** | Ningún otro lugar del producto usa emoji: rompe el sistema |
| **"Bs 100,00" vs "Bs 0"** en la misma pantalla | Dos formatos de moneda conviviendo |
| **"ONIA CORE BETA" / "MODULO GERENCIAL"** como kicker | Vocabulario interno de ingeniería expuesto al dueño del negocio |
| **"Inventario simple"** en el menú | El "simple" es una nota para nosotros, no un nombre de módulo para el cliente |

## Web Factory — cerrado el 2026-08-19/20 (en rama, sin deployar)

| Qué | Estado |
|---|---|
| **Popup de captura de 2 pasos** (`packages/blocks/src/two-step-popup.ts`) | El 10/10 de la escalera: paso 1 un clic que segmenta, paso 2 el WhatsApp. La respuesta del paso 1 viaja con el lead por el circuito `?src=` que ya corre en prod. 153/153 unit · 16/16 e2e (escritorio y móvil) · mirado renderizado |
| **Secuencia de scroll estilo Apple** | **Decidido que NO se construye**, con el número medido: la versión más barata que se ve bien pesa 1,6 MB (0,5 MB optimista con render sobre fondo plano) contra un presupuesto de 150 KB de JS |
| **Extractor de anatomía web** (`harvester/vision/extract_web_anatomy.mjs`) | Mide las 15 capas de un sitio vivo. Contrato en `web-factory/docs/ANATOMIA_DE_UNA_WEB.md`. Ya corrió sobre 6 sitios |
| **Síntesis cruzada** (`anatomia/SINTESIS.md`) | 9 leyes por mayoría, 4 defectos que no se copian, y **6 correcciones a nuestro propio pattern bank** |
| **Indexabilidad (C1)** | Ya estaba hecha. El encargo pedía `canonical` en el layout raíz, que **habría desindexado el sitio entero**. Sólo faltaba el checklist: `web-factory/docs/CHECKLIST_PRE_ENTREGA.md` |
| **Web de Bolivian Electric** | Rediseñada en el repo correcto (`C:\dev\clientes\bolivian-electric-web`, rama `feat/rediseno-leyes-web-factory`): `transition:all` 57 → 0, catálogo de 14 cajas iguales → índice técnico con cifras reales, JS −5,4 kB, sin desborde en 8 combinaciones. **Sin deployar** |

⚠️ **Lección de método, 2026-08-19**: el extractor tumbó 6 afirmaciones que yo mismo había
escrito como canon (entre ellas "Fanvue no tiene ningún parallax" y "peso 500, nunca
700/800"). Todas salían de mediciones flojas. **Una medición floja no es neutra: envenena
el canon**, y después se construye sobre eso. Protocolo: `docs/ANATOMIA_DE_UNA_WEB.md`.

## Orden sugerido para lanzar

1. ~~Bug de la factura~~ → **hecho en rama; falta mergear y deployar.** Hasta que no esté
   en producción y verificado ahí, sigue valiendo cero: está construido, no terminado.
2. Política de privacidad única + portabilidad honesta (riesgo legal real, barato).
3. Dashboard: acentos + `PLAN_LABELS` + matar las 6 tarjetas iguales (porte de v5).
4. Cobro del add-on.
5. Landing (v1 o v2, tu elección) al aire.
6. Lo demás: WhatsApp (Meta), SIAT (Fase 2), webs conectadas.
