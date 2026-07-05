# ONIA Propuestas v3 — Plan de mejora de diseño y conversión

Fecha: 2026-07-05 · Carril C (`propuestas-v2`) · Estado: Fase 1 HECHA.

Base de decisión: data de millones de propuestas (Proposify/PandaDoc) +
mejores prácticas de pricing SaaS B2B. Números clave:

- Propuestas con imágenes: **+72% de cierre, 20% más rápido**. Con video: +41%.
- Testimonios/casos junto al pricing: **+34% conversión**.
- 67% del abandono en pricing = sospecha de costos ocultos (nuestro bloque
  "terceros" ya lo cubre — mantener siempre).
- Velocidad de envío correlaciona directo con cierre → ninguna mejora puede
  romper el "cliente nuevo en 30 segundos" del generador.

## Fase 1 — Generador v3 (HECHA 2026-07-05)

Secciones opcionales nuevas en `generador/generar-propuestas.js` (TDD, 16 tests):

| Sección | Campo | Por qué |
|---|---|---|
| Portada full-page | `portada` | compradores enterprise esperan documento formal |
| Resumen ejecutivo | `resumenEjecutivo` | sección #2 de la estructura ganadora (7 secciones) |
| Imágenes con caption | `imagenes[]` | +72% cierre; ambientación IA, NO UI falsa |
| Prueba social | `casos[]` | +34%; implementado pero VACÍO hasta tener casos reales |
| Comparativa vs statu quo | `comparativa` | ancla visual antes del precio (TR4 vs ONIA) |
| Próximos pasos + CTA | `proximosPasos[]` + `ctaWhatsapp` | convierte lectura en respuesta; wa.me prefilleado |
| Polish PDF | — | font stack moderno, `page-break-inside:avoid`, figure/cta styles |

Aplicado a: `dentalgest` (imagen + próximos pasos + CTA) y `onia-empresarial`
(portada + resumen ejecutivo + imagen + comparativa TR4 + próximos pasos + CTA).
Imágenes de ambientación generadas con Higgsfield (soul_2, 2K) en
`propuestas/assets/`.

## Fase 2 — Contenido real (bloqueado por hechos, no por código)

| # | Ítem | Bloqueado por |
|---|---|---|
| 2.1 | `casos[]` con el caso fundador Bolivian Electric (números reales del ticket) | cierre BE fase 1 (R3) |
| 2.2 | Screenshot real del panel DentalGest reemplaza ambientación en la propuesta | demo-able R2 (repo DentaGest); sacar screenshot del panel real |
| 2.3 | Testimonios de clientes web (Bench/Garabato/HSB al entregar) | entregas en curso |
| 2.4 | Validación de precios v2 antes de ENVIAR cualquier PDF | **S1 — Sergio (2 min)** |

## Fase 3 — Propuesta trackeable (carril G infra, NO este carril)

Idea PandaDoc sin pagar PandaDoc: hostear el HTML de la propuesta en el VPS
(187.77.16.63) bajo ruta con token único por prospecto + pixel/beacon → n8n →
Telegram a Sergio ("X abrió la propuesta, 4 min en Paquetes"). Piezas:

1. Carpeta estática en el VPS servida por el contenedor web existente
   (o Easypanel static). Ruta `/p/<token>`.
2. Beacon JS (1 línea) → webhook n8n → notificación Telegram + registro CRM.
3. El generador ya produce el HTML; solo falta el paso de publicación
   (`--publish` podría subir por SSH). Respetar regla: infra = UN solo dueño,
   coordinar con carril G.

## Fase 4 — Video (opcional, cuando haya demo pulida)

Video 60-90s (demo panel + Hermes Telegram) linkeado con QR en el PDF (+41%
cierre). Producirlo en el carril H (contenido/Higgsfield) cuando R2 esté
demo-able. QR apunta a la URL trackeable de Fase 3 (doble señal).

## Reglas que NO se negocian (de la skill)

- Generador siempre, nunca HTML a mano.
- `casos[]` solo con datos reales — prohibido inventar testimonios/números.
- Imágenes: ambientación o fotos reales; nunca screenshots falsos de producto.
- Bloque "terceros" se mantiene en toda propuesta (transparencia = cierre).
- Todo cambio de reglas se edita primero en
  `hermes-content/skills/propuestas-comerciales-onia.md`.

Fuentes: proposify.com/blog/proposal-best-practices ·
proposify.com/blog/proposal-structure-tips · pandadoc.com/blog/interactive-proposals ·
webstacks.com/blog/saas-pricing-page-design · payproglobal.com/answers/what-is-social-proof-in-saas
