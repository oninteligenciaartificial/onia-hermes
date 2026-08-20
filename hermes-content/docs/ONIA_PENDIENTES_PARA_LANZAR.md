# Pendientes para lanzar — qué está a medias y en qué orden se mata

> Doc VIVO. Estado verificado el 2026-08-18 mirando producción, no de memoria.
> Regla: nada acá se declara "listo" si no está encendido en prod y visto.

## 🔴 Bloqueantes de venta (matar primero)

| # | Qué | Estado exacto | Quién |
|---|---|---|---|
| ~~1~~ | ~~**Factura no se crea sin fecha de vencimiento**~~ | ✅ **ARREGLADO 2026-08-19**, en rama `fix/factura-sin-vencimiento` (commit `e0033b4`), **no en producción todavía**. Era `.optional()` en Zod, que acepta `undefined` y rechaza `null`. Se arregló la clase entera, no el campo del reporte: facturas (`dueDate`, `notes`, `treatmentId`) y el POST de recurrentes (`endDate`, `notes`), que rechazaba justo lo que su propio PATCH ya aceptaba — el mismo bug esperando turno. Y el 400 ahora **nombra el campo**. Suite 1581 → 1587. Falta: mergear y deployar | Nosotros — deploy |
| 2 | **Dos políticas de privacidad vivas y contradictorias** | `onia.com.bo/privacidad` v1.0 (OniaAgency, NIT correcto) vs `app.onia.com.bo/privacy` v2026.06.03 con razón social **que no existe en SEPREC** y Gmail personal — y esa es la que el cliente ACEPTA al registrarse | Nosotros escribimos, Sergio ratifica |
| 3 | **Portabilidad prometida que no existe** | Los Términos §4.2 prometen exportar datos; el único export real es CSV de facturas (y gateado por plan). Cero export de pacientes/historias/citas. Choca con Ley 3131 art. 10 | Nosotros |
| 4 | **Cobro del add-on chatbot** | Contratar = link de WhatsApp + activación manual del superadmin. Sin circuito de pago | Nosotros (estaba en construcción, cayó por 529) |
| 5 | **Cuenta corriente empresa BCP sin abrir** | Sin ella no hay API de QR → el checkout sigue sin pasarela. Paquete redactado y listo para firmar | **Leslie firma · Sergio llama al ejecutivo** |

## 🟡 A medias (construido, no terminado)

| Qué | Lo que falta |
|---|---|
| **Emisión fiscal SIAT** | El producto llama a un **mock** (CUF simulado, cero red). El emisor real existe pero **no está deployado**; `SIAT_EMISSION` no existe en el entorno de prod; las 3 orgs tienen NIT vacío. Bloqueo real: **Fase 2, inspección del SIN, límite 04-nov-2026** (ya NO es el NIT: está activo) |
| **Nota de crédito** | Nace BORRADOR y el RCV excluye borradores → **anular no baja el débito fiscal** |
| **Compras / crédito fiscal** | Una clínica no tiene por dónde cargar compras → su crédito fiscal es estructuralmente 0 |
| **WhatsApp del cliente** | App Review de Meta EN CURSO (~20 días). Mientras, el bot vive en el widget web (que funciona) |
| **Landing v2 (Fanvue)** | Construida en `/v2`, con las 7 leyes medidas y media real. **Espera tu OK** para reemplazar la actual |
| **Landing v1 rediseñada** | Todas las secciones post-hero rehechas, en local. Espera OK |
| **Notificaciones entre equipo** | Centro de notificaciones y Web Push existen en código; **NO verificado entre dos usuarios reales**. Es la prueba que falta para decir "así funciona en una empresa" |
| **Poda de agentes/MCP** | 6 agentes de proyecto retirados (reversible). Faltan ~24 globales, 7 jobs y la lista de MCP a desconectar |
| **Loops sin promptear** | Investigación pendiente (cayó por 529). El workflow de 3 roles ya existe y funciona |
| **Webs conectadas al sistema** | 4 circuitos documentados; Bolivian Electric es el laboratorio. Sin empezar |

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
