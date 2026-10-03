# Onia — Lead magnet: la guía de una página (PRD)

**Estado:** ejecutar
**Por qué:** el contenido ya está escrito en el repo, la página hermana (`/facturacion`) y el
pipeline de leads ya viven en producción, y la búsqueda de «facturación en línea obligatoria»
sigue viva aunque el plazo del 1-oct-2026 quedó sin efecto (ver ⚠️ abajo).

> **Origen.** P03 salió de un reel de @ianlee.js cuyo magnet era una guía **sobre PRDs**. Ese
> TEMA no se copia — un ferretero boliviano no descarga una guía de PRDs; se copia la MECÁNICA
> (guía corta gratis → captura de contacto). El "de una página" es decisión de Sergio: el reel
> nunca dice el largo — **NO VERIFICADO** como atributo del original.

## 1. La decisión: cuál es LA guía

**"Facturación en línea 2026: cómo habilitarte GRATIS en el portal del SIN — 6 pasos, en una
página."**

Por qué esta y no otra:

| Candidata | Por qué NO |
|---|---|
| Guía de PRDs (el tema del original) | Mercado equivocado. Nuestro comprador es dueño de negocio, no fundador técnico |
| "10 tips para tu clínica" / por rubro | Sin fecha límite no hay urgencia, y parte la audiencia en tres |
| "Qué exige el SIN" (era «el 1-oct»; ese plazo quedó sin efecto el 30-sep) | Ya está publicado y gratis en `/facturacion`. Un magnet que repite una página pública no vale un correo |
| **Cómo habilitarte, paso a paso** | ✅ Es la pregunta que aparece DESPUÉS de leer `/facturacion`, no está en ningún lado en una sola hoja, aplica a los 5 rubros vendibles (todos tienen NIT), y la hicimos con nuestro propio NIT — no se fabrica nada |

El gancho ya **no** es la fecha. ⚠️ **Corregido el 2026-10-03:** acá decía que la **RND
102600000007** fijaba el 30-sep-2026 como último día de transición y que desde el 1-oct los grupos
9° al 12° emitían solo en línea. El **30-sep-2026 la RND 102600000038 abrogó** las RND que
designaban a esos grupos (102400000004, 005, 012 y 025) y dejó sin efecto sus plazos de
incorporación; el SIN asignará periódicamente una modalidad en línea a los contribuyentes del IVA
que al 30-sep no habían implementado ninguna (Par. II, sin fecha y sin decir cómo lo comunica). Motivo declarado: aplicar la Ley 1733 (IVA
sobre el precio neto, separado en la factura). Texto leído en el PDF del SIN; detalle en
`ONIA_FACTURACION_ESTADO_REAL.md` §2.6. El gancho que queda es el que la norma sí sostiene:
**«¿qué modalidad tengo hoy?»** y cómo habilitarse gratis en el Portal Web. *(Hasta la segunda
pasada del 3-oct decía «¿ya me asignaron…?» y que la asignación «figura en la Oficina Virtual»: la
RND no dice cómo se comunica, y a un ex grupo 9°-12° le hacía leer que seguía obligado.)*

## 2. Promesa y a quién

- **Promesa:** "En una hoja: cómo saber qué modalidad de facturación tenés, y los 6
  pasos para habilitarte gratis en la Oficina Virtual. Sin comprar nada." *(Decía «si te toca el 1
  de octubre»: ese plazo quedó sin efecto el 30-sep, RND 102600000038.)*
- **A quién:** dueño de negocio boliviano de 1 a 5 personas, con NIT activo, que escuchó del
  plazo y no sabe qué hacer el lunes. Dental/estética, comercio-ferretería, importadora.
- **Por qué deja el correo:** le ahorra la tarde de averiguar en qué grupo está y qué botón
  tocar. Que la opción gratuita sea lo PRIMERO que decimos es lo que lo hace creíble.

## 3. El contenido REAL de la única página

Siete bloques, en este orden. El texto fiscal **no se redacta acá**: sale de
`web-factory/apps/onia-platform/src/lib/siat.ts`, que ya es la fuente única (bloques 1, 2 y 7).
Lo nuevo (bloques 3 a 6) se agrega a ESE archivo, no a un segundo lugar.

1. **Titular + la norma en una línea.** `SIAT_TITULAR` + `SIAT_BAJADA`.
2. **"Podés cumplir GRATIS."** `SIAT_BLOQUES[0]` — el Portal Web en Línea del SIN es gratuito
   y cumple al 100%. Va primero, siempre.
3. **Paso 0 — ¿te toca a vos?** El grupo lo fija tu **NIT**, no tu rubro (RND 2024:
   102400000004, 05, 12 y 25). Entrá a `siat.impuestos.gob.bo` con tu NIT o preguntale a tu
   contador: ahí figura la modalidad de tu padrón. No adivines.
4. **Los 6 pasos en la Oficina Virtual** (recorte del checklist interno, sin lo nuestro):
   1. Entrar a la Oficina Virtual (impuestos.gob.bo → "SIAT en Línea") con las credenciales
      del NIT.
   2. Revisar que **no tengas marcas de riesgo tributario activas** (requisito Art. 19.d).
      Si hay una observación, se resuelve primero — o el resto no avanza.
   3. Solicitar la autorización de la modalidad. Para emitir a mano ya: **Portal Web en Línea**.
   4. Configurar **casa matriz / sucursal (0)** y **al menos un punto de venta**.
   5. Registrar productos/servicios y clientes, y **sincronizar catálogos** (actividades,
      leyendas, unidades). Homologar cómo se llama lo que vendés.
   6. **Emitir una factura de prueba** y verificar tres cosas: que valide, que llegue el PDF y
      que el XML quede registrado en el SIN.
5. **Tené esto a mano antes de empezar** (5 ítems): NIT + credenciales de la Oficina Virtual ·
   razón social exacta · tus códigos de actividad · correo del negocio · NIT/CI y razón social
   de un cliente para la factura de prueba.
6. **Lo que te frena** (derivado de los pasos, no de estadísticas inventadas): dejarlo para la
   última semana de septiembre · descubrir una marca de riesgo recién en el paso 3 · llegar al
   paso 6 sin catálogos sincronizados y que la prueba no valide.
7. **Cierre honesto + fuentes.** Una sola línea comercial: *"El portal es gratis y cumple. Lo
   que cuesta es tipear cada venta dos veces. Si querés que la factura salga de la venta que ya
   registraste: onia.com.bo/facturacion"*. Después, `SIAT_FUENTES` completo con el descargo de
   que no es asesoría tributaria.

**Prohibido en esta página:** cualquier cifra de precio (viven en `lib/subscription-plans.ts` y
`lib/pricing.ts`), cualquier testimonio, logo o porcentaje de resultado — hay cero clientes
pagando — y cualquier estado de obra ("muy pronto", "beta"). El estado fiscal honesto de
nuestro emisor ya está declarado en `/facturacion`; el magnet enlaza ahí, no lo repite.

## 4. Cómo se captura el correo

Formulario de **un campo obligatorio**: correo. WhatsApp opcional (es el canal real en Bolivia).
Nada más — ni rubro, ni ciudad, ni nombre del negocio.

- **La guía se lee sin dar nada** (es indexable y ese es medio punto del ejercicio). El correo
  compra **el PDF** y el aviso si el SIN mueve la fecha otra vez. Content upgrade, no muro.
- **Endpoint:** reusa el proxy que ya existe,
  `web-factory/apps/onia-platform/src/app/api/agenda-intake/route.ts` → Onia Center. No se crea
  endpoint nuevo, no se crea tabla nueva.
- **Cambio necesario y verificado:** el intake de Center hoy **descarta el email** y exige
  `negocio` o `nombre`, así que un envío de solo-correo se rechaza con 422. En
  `web-factory/apps/site/src/app/api/onia-center/leads/intake/route.ts`:

```ts
const email = clean(body.email);                       // nuevo
if (!business && !name && !email) {                    // antes: (!business && !name)
  return NextResponse.json({ error: "missing_fields" }, { status: 422 });
}
// dentro del lead:
company: business || name || email,
contact: [name, whatsapp, email].filter(Boolean).join(" · "),
```

- **Atribución:** el `?src=` de la URL ya viaja al pipeline (`source: src || "landing"`).
  Un valor por canal: `guia-siat-bio`, `guia-siat-dm`, `guia-siat-ads`, `guia-siat-facturacion`.
- **Sin doble opt-in en v1**: entra correo basura y se acepta. El seguimiento real es WhatsApp.

## 5. Dónde vive

| Qué | Dónde |
|---|---|
| La página | Ruta nueva `/guia-facturacion` en `web-factory/apps/onia-platform` (el sitio que sirve el VPS, contenedor `onia-landing`) |
| El texto | `src/lib/siat.ts` — se EXTIENDE, no se copia |
| El "PDF" | La misma página con `@media print` y un botón `window.print()`. Cero pipeline de PDF, cero storage |
| Segundo canal, ya vivo | Instagram: comentario "FACTURA" → DM con el link (circuito verificado en prod el 18-ago; no hace falta ManyChat) |

Enlace cruzado obligatorio con `/facturacion` en ambas direcciones, y canonical propio en cada
una: `/facturacion` responde *qué exige la norma*, `/guia-facturacion` responde *cómo me
habilito*. Intenciones distintas — pero si el ranking de `/facturacion` cae, se fusionan.

## 6. Cómo se mide

La landing **no tiene analytics instalado** (verificado: cero `gtag`/`plausible`/`@vercel/analytics`
en el repo), así que no hay tasa de conversión sin construir algo. Lo que sí se mide hoy, gratis:

| Métrica | Cómo | Meta v1 |
|---|---|---|
| Correos capturados / semana | Leads en Onia Center con `source` que empieza en `guia-siat` | ≥ 10 la primera semana |
| Qué canal trae | Comparar los cuatro valores de `src` entre sí | Saber cuál sostener antes de gastar en ads |
| Conversación abierta | Leads del magnet a los que Sergio les escribió | ≥ 50% contactados en 48 h |
| Fin de vida | ~~Después del 1-oct-2026 la promesa caduca~~ Reescrita el 3-oct: el plazo quedó sin efecto (RND 102600000038) y la promesa pasó a «¿ya te asignaron la modalidad?», que no caduca con una fecha | Revisar el 15-oct si la búsqueda del plazo sigue trayendo correos |

Sin denominador de visitas no hay "% de descarga". Si eso empieza a decidir plata (ads), recién
ahí se instala un contador — no antes.

## 7. Riesgos y no verificados

- **NO VERIFICADO:** si la guía de Ian Lee es realmente de una página, y si su DM es manual o
  automatizado. El reel no lo dice y no se abrió el DM.
- **Canibalización SEO** con `/facturacion`: mitigación arriba, y se vigila el ranking del
  término del plazo, que es el más valioso del sitio.
- **Riesgo de fecha:** hubo dos prórrogas (RND 102500000036 y 102600000007) y después la
  abrogación (RND 102600000038, 30-sep-2026). Cada cambio se corrige en `lib/siat.ts` y las dos
  páginas se enteran solas — ese es el motivo de que el texto viva en un solo archivo. El gate
  `(sitio)/plazo-sin-efecto.test.ts` pone en rojo cualquier superficie servida que vuelva a
  afirmar la obligación del 1-oct como vigente.
- **No colisiona** con el otro magnet anotado (ítem 3.9 del catálogo de ideas, "auditor de webs
  gratis"): otra pieza, otro público.

## Fuentes

- `hermes-content/docs/ONIA_SIAT_HABILITAR_FACTURACION_CHECKLIST_2026.md` — los 6 pasos y la
  lista de datos a mano.
- `web-factory/apps/onia-platform/src/lib/siat.ts` — fuente única del texto normativo.
- `.../onia-platform/src/app/api/agenda-intake/route.ts` y
  `.../site/src/app/api/onia-center/leads/intake/route.ts` — el circuito de captura.
- https://www.instagram.com/ianlee.js/reel/Db6y_ypvWbF/ — el patrón copiado (la mecánica, no el
  tema ni el arte).
