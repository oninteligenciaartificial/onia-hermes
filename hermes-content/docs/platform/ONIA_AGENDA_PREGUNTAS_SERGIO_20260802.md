# Agenda maestra — TODAS las preguntas de Sergio, punto por punto

> **2026-08-02.** Sergio: *"las preguntas que he estado haciendo, estructurémoslas y
> toquémoslas punto por punto, porque son importantes"*. Este doc es esa estructura:
> cada pregunta con su estado real. Se actualiza al cerrar cada punto. Nada se
> considera cerrado sin su verificación.

## A. RESUELTO Y EN PRODUCCIÓN (verificado, no prometido)

| # | Pregunta | Dónde está la respuesta |
|---|---|---|
| 1 | ¿Self-service o manual? → trial 14 días sin tarjeta | en prod; `ONIA_PLANES_REQUISITOS_20260801.md` §4 |
| 2 | Estructura de dominios (¿por qué app./forms.?) | explicado + los 4 dominios en vivo |
| 3 | ¿En qué base estamos? ¿Docker/Easypanel obligatorios? | explicado; backup diario creado; renombrar contenedores = planificado con backup |
| 4 | Gestios → módulo comercio | en prod: kardex, caja, ventas UI, contabilidad |
| 5 | Registro multirubro con configuración previa | en prod: paso 0 "¿Qué tipo de negocio tenés?" |
| 6 | Landing recargada → rediseño estilo Fanvue | EN VIVO en onia.com.bo (aprobada por Sergio) |
| 7 | Tipografía de Fanvue exacta | medida del CSS real: AG Next Medium ancho normal → Archivo 600 |
| 8 | Marca: dental sin marca, logo por lámina | barrido completo + assets v2 oficiales |
| 9 | ¿Cómo funcionan los agentes? | propone→cola→aprobás→ejecuta; idempotencia+cupo |
| 10 | ¿Cómo conectan sus QRs? | explicado: su banco hoy; conciliación automática = reunión BCP |
| 11 | ¿Cuándo metemos mano? | tabla servicio-vs-automatización en el chat + docs |
| 12 | Repos que pasaste (ponytail, ScrapeGraphAI) | instalado / descartado con números |
| 13 | GitHub trending UI/UX | `ONIA_UI_TRENDS_GITHUB_20260801.md` (alerta AGPL incluida) |
| 14 | Funciones operativas y qué falta por rubro | `ONIA_FUNCIONES_OPERATIVAS_20260801.md` |
| 15 | Imágenes reales (Higgsfield autorizado) | 3 fotos generadas, en la landing viva |

## B. DECIDIDO POR MÍ — ESPERA TU RATIFICACIÓN (punto por punto AHORA)

| # | Punto | Mi decisión propuesta | Tu palabra |
|---|---|---|---|
| B1 | **Webs de clientes** | 3 niveles: mini-web automática (Pro) · web completa hecha por nosotros (add-on) · NO builder self-service | ☐ |
| B2 | **Agentes WhatsApp** | PRE-ARMADOS por rubro (ni Dapta-style ni artesanal): cliente conecta su número + aprueba | ☐ |
| B3 | **Pricing/promos** | mensual (no semanal) · fundadores 10 con precio congelado · referidos 1 mes · nunca descuento permanente | ☐ |
| B4 | **Orden de rubros siguientes** | estética + veterinaria primero (90% del set dental, días) · importadora después (2 capacidades por portar) | ☐ |
| B5 | **Landing: "Comercio"** | cambiar "pronto" → "disponible" (ya es verdad: registro + venta + contabilidad viven) | ☐ |

## C. EN DESARROLLO (mío, con fecha de hoy)

| # | Qué | Estado |
|---|---|---|
| C1 | **Dashboard visual v2** | rehaciéndose AHORA con: logo real (archivo, no dibujo), Archivo, panel "el sistema trabajó por vos" (automatizaciones visibles), animación de entrada. El v1 quedó rechazado con razón |
| C2 | Salida de Vercel por fases | plan escrito; falta ejecutar fases + tu OK a los 16 irreversibles |
| C3 | Sembrar cola de aprobación (primeras propuestas del agente) | siguiente en el producto |
| C4 | Papercuts comercio | roles del wizard aún dentales · tab "Mi Plan" con copy dental |

## D. BLOQUEADO EN VOS (nada avanza sin esto)

| # | Qué | Qué destraba |
|---|---|---|
| D1 | **Ticket promedio por cita en SCZ** | el argumento de venta en plata ("una cita recuperada lo paga") |
| D2 | **NIT + homologación SIAT** (caduca 1-oct) | factura fiscal real — el diferenciador de la tabla comparativa |
| D3 | **Verificación de negocio en Meta (S5) + número (S6)** | envío real de WhatsApp; sin esto, tope de 2 números |
| D4 | **Cuál chatbot sobrevive** (lo revisás vos) | que no nazca un tercero |
| D5 | **Reunión BCP (miércoles 5-ago)** | QR dinámico + conciliación automática |
| D6 | Aprobar dashboard v2 cuando llegue | construirlo en el producto |

---
Regla de trabajo desde ahora: **cada punto B se ratifica explícito, uno por uno, antes
de ejecutarse.** Los A no se reabren salvo que Sergio lo pida. Los C reportan al
cerrar. Los D se recuerdan en cada cierre de sesión.
