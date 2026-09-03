> ⚠️ **SUPERADO.** El estado vigente esta en `hermes-content/docs/ONIA_ESTADO_REAL_20260813.md`
> y la apuesta vigente en `docs/platform/ONIA_DECISION_SAAS_CONSULTORIA_20260813.md`.
> Este documento se conserva como historia: NO tomes decisiones con el.

# Onia Propuestas v3 — Plan de mejora de diseño y conversión

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
| Comparativa vs statu quo | `comparativa` | ancla visual antes del precio (TR4 vs Onia) |
| Próximos pasos + CTA | `proximosPasos[]` + `ctaWhatsapp` | convierte lectura en respuesta; wa.me prefilleado |
| Polish PDF | — | font stack moderno, `page-break-inside:avoid`, figure/cta styles |

Aplicado a: `dentalgest` (imagen + próximos pasos + CTA) y `onia-empresarial`
(portada + resumen ejecutivo + imagen + comparativa TR4 + próximos pasos + CTA).
Imágenes de ambientación generadas con Higgsfield (text2image_soul_v2, 2K) en
`propuestas/assets/`.

## Fase 2 — Contenido real (bloqueado por hechos, no por código)

| # | Ítem | Bloqueado por |
|---|---|---|
| 2.1 | `casos[]` con el caso fundador Bolivian Electric (números reales del ticket) | cierre BE fase 1 (R3) |
| 2.2 | Screenshot real del panel DentalGest reemplaza ambientación en la propuesta | app viva en dentalgest.app pero requiere login → carril D (repo DentaGest) saca el screenshot de una org demo |
| 2.3 | Testimonios de clientes web (Bench/Garabato/HSB al entregar) | entregas en curso |
| 2.4 | ~~Validación de precios v2~~ **RESUELTO 2026-07-05**: Sergio ratificó lista v2 pymes + ventana 31-jul (320/750/1.500 congelado 12m) y E1 ofertable ya (E2/E3 se recotizan tras BE). Ambas propuestas LISTAS para enviar. | — |

## Fase 3 — Propuesta trackeable (pixel HECHO 2026-07-05; hosting opcional)

Idea PandaDoc sin pagar PandaDoc. **Lo hecho:**

1. Generador `--track <token>` → produce `propuesta-<slug>-<token>.html` con
   pixel invisible (TDD; el PDF se imprime sin pixel para no falsear).
2. Workflow n8n **"ONIA - Propuesta Abierta (pixel)"** (`UMpcKi7wfMmC9KCw`,
   publicado): `GET /webhook/propuesta-abierta?t=<token>&s=<slug>` → Telegram a
   Sergio (token, slug, hora La Paz, dispositivo). Probado end-to-end
   (ejecución 21418 success). `ignoreBots` activo.
3. Funciona SIN hosting: el HTML enviado por WhatsApp/correo dispara el pixel
   al abrirse en el navegador del prospecto.

**Opcional (carril G, infra):** hostear el HTML en el VPS bajo `/p/<token>`
para mandar link en vez de archivo + medir tiempo por sección. No bloquea el
uso actual.

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
