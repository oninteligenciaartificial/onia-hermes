# Gancho de ad: nombrar la herramienta vieja, no el producto

**Formato:** texto principal de un anuncio de Meta (Facebook/Instagram feed), 6–14 líneas, con
video o imagen al lado.
**Para qué carril:** `ads-creatividades-publicos` y `carril-contenido`. Es un gancho de **ad del
PRODUCTO**, no de la marca personal de Sergio.
**Rubro medido:** software de gestión para clínicas, comercios y pymes en Bolivia y Argentina —
el rubro exacto de Onia Platform.

---

## La estructura, bloque por bloque

Seis bloques. El orden importa: el producto **no aparece hasta el bloque 3**.

| # | Bloque | Qué va | Largo |
|---|---|---|---|
| 1 | **El desorden de hoy, con nombre y apellido** | La herramienta vieja que el lector usa AHORA, dicha literal: Excel, papel y lápiz, planillas sueltas, "cada cosa en un sistema distinto", "a mano". Nunca "tu gestión es ineficiente" | 1 línea |
| 2 | **El reconocimiento** | Cierre en pregunta (`¿Te suena?`, `¿Todavía…?`) **o** la sentencia que renombra el problema (`Eso no es gestionar, es dedicar tiempo a…`) | media línea |
| 3 | **El producto entra recién acá** | `Con <producto> …` + la promesa en una frase. Primera vez que se nombra la marca | 1 línea |
| 4 | **La lista numerada de lo que reemplaza** | 3 ítems, numerados `1️⃣2️⃣3️⃣` o `✅`. **Cada ítem es una de las cosas sueltas del bloque 1**, ahora dentro del sistema. Con el detalle concreto abajo, no el nombre del módulo solo | 3–6 líneas |
| 5 | **Para quién es** | `Ideal para <tipos de negocio>` — filtra al que no es, y le dice al que sí que es para él | 1 línea |
| 6 | **CTA de conversación, no de compra** | Demo / "escribinos por WhatsApp" / "te mostramos cómo funciona". **Ninguno de los anuncios leídos pide comprar en el ad** | 1–2 líneas |

### Plantilla para copiar

```
¿Todavía manejás [COSA 1], [COSA 2] y [COSA 3] por separado?

Con [PRODUCTO] centralizás la operación de tu [NEGOCIO] en un solo sistema.

1️⃣ [COSA 1 resuelta] — [el detalle concreto, no el nombre del módulo]
2️⃣ [COSA 2 resuelta] — [detalle concreto]
3️⃣ [COSA 3 resuelta] — [detalle concreto]

Ideal para [tipo de negocio A], [tipo B] y [tipo C].

¿Querés ver cómo funciona en vivo? Escribinos y coordinamos una demostración.
```

**Las tres reglas que separan esta receta de "usá un gancho fuerte":**

1. **La cosa vieja se nombra, no se describe.** «Excel» y «papel y lápiz» aparecen literales en
   los anuncios leídos. «Procesos ineficientes» no aparece en ninguno.
2. **La lista del bloque 4 es la del bloque 1, en el mismo orden.** El anuncio de Sinergya abre
   con `ventas, inventario, contabilidad y facturación` y eso mismo es lo que centraliza. El de
   Skyia abre con `turnos, historias clínicas, recetas` y esos son sus tres ítems numerados.
   Es el mismo índice dos veces — igual que en [`carrusel-indice-en-portada.md`](carrusel-indice-en-portada.md),
   donde la portada, la lámina 2 y el caption repiten la misma lista.
3. **El CTA pide una conversación.** De los 30 anuncios del rubro que leí, ninguno cierra con
   "comprá": cierran en demo, WhatsApp o formulario.

### Variantes que existen en el rubro y ONIA HOY no puede usar

- **Testimonio en primera persona con nombre y empresa** (Reservo abre con
  `"Mi consultorio era un caos hasta que encontré la solución. Cynthia Arteta, dueña de Unna
  Medical Center…"`). Es la variante más fuerte que vi y **Onia no la tiene disponible: no hay
  clientes pagando**. No se fabrica. Queda anotado como lo que desbloquea el primer cliente
  que acepte dar su nombre.
- **Cifra de tracción** (`Cientos de PyMEs argentinas ya gestionan… con Devy`). Mismo caso:
  sin el número real, no se escribe.
- **Precio en el gancho** (`Desde $335.000 + IVA por mes`, Sistema ISIS, Argentina). Si una
  pieza de Onia usa precio, se **lee** de `onia-platform/lib/subscription-plans.ts` (planes) o
  `onia-platform/lib/pricing.ts` (add-ons). Nunca de memoria.

---

## Fuente: Biblioteca de Anuncios de Meta (pública, sin cuenta)

**Se lee sin cuenta y sin loguearse.** Verificado el
2026-09-03 desde el VPS: la página renderiza los anuncios activos en el DOM.

- Búsqueda Bolivia, «software de gestión para negocios»:
  `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BO&is_targeted_country=false&media_type=all&q=software%20de%20gestion%20para%20negocios&search_type=keyword_unordered`
- Búsqueda Argentina, «sistema de gestión para clínicas» y «software de gestión para pymes»:
  misma URL con `country=AR` y la `q=` cambiada.
- Cada anuncio tiene permalink propio y público: `https://www.facebook.com/ads/library/?id=<Library ID>`
  — verificado con `?id=1449643883671583`, devuelve la ficha sola con el mismo texto.

**Cómo se reproduce** (chromium no está en el PATH del VPS; el binario que existe es el de
Playwright):

```
/root/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome --headless --disable-gpu \
  --no-sandbox --virtual-time-budget=25000 --dump-dom "<url de arriba>"
```

**Qué se miró exactamente:** 89 anuncios **activos** distintos en 4 búsquedas, de los cuales
**30 son del rubro de Onia** (software de gestión para clínicas, comercios o pymes). De cada
uno: el texto principal completo, el anunciante, la fecha de alta y si tiene varias versiones.

**Los 6 anuncios que cumplen la receta entera** (abren nombrando la herramienta vieja **y** en
pregunta), con su `Library ID` para abrirlos uno por uno:

| Anunciante | País | Library ID | Alta | Primera línea |
|---|---|---|---|---|
| Sinergya Bolivia (CodeX) | BO | `1449643883671583` | 2 sep 2026 | ¿TODAVÍA MANEJAS VENTAS, INVENTARIO, CONTABILIDAD Y FACTURACIÓN POR SEPARADO? |
| Skyia | AR | `2278391992977905` | 5 ago 2026 | Turnos desordenados, historias clínicas sueltas, recetas que no encontrás… ¿Te suena? |
| Siripd | AR | `2311492599666173` | 28 ago 2026 | ¿Tu negocio funciona a papel y lápiz? Hay una forma mejor. |
| VetForms Pro | AR | `1776745913431836` | 30 ago 2026 | ¿Sigues creando cada formulario de tu clínica desde cero? |
| Easysocio | AR | `984827984515873` | 27 may 2026 | ¿Tu gimnasio ya no entra en un Excel? |
| ProtecVisión | BO | `1055921840379972` | 1 sep 2026 | ¿Todavía llevas el control de asistencia de tu personal de forma manual? |

Otros dos abren nombrando la herramienta vieja **sin** pregunta, y son los ejemplos más limpios
del bloque 2 como sentencia: Omnia Salud (`28387590097593386`) y Medtech (`2138605240201877`).

**Qué NO se pudo ver, y por eso no está escrito acá:** la Biblioteca **no publica** impresiones,
clics, CTR ni gasto de los anuncios comerciales — eso sólo existe para anuncios políticos. **No
hay ni un número de rendimiento en esta receta.** Tampoco se vio el video/imagen de cada
anuncio: la receta cubre el texto, no la pieza visual.

---

## Por qué se cree que funciona

**Lo que dice la fuente** (dato duro, verificable en la ficha de cada anuncio):

- **16 de los 30 anuncios del rubro nombran la herramienta vieja en las dos primeras líneas.**
  Es el arranque más repetido del rubro, por encima de presentar el producto.
- 11 de 30 abren en pregunta. 6 hacen las dos cosas.
- La Biblioteca muestra **fecha de alta y estado**. Los anuncios que siguen `Active` meses
  después de darse de alta (Easysocio desde el 27 de mayo, Heiko desde el 18 de marzo) llevan
  **más de tres meses de gasto continuo**. Eso es lo único parecido a una señal de rendimiento
  que la fuente publica.

**Lo que infiero yo, y es inferencia:**

- Que un anunciante sostenga un anuncio tres meses **sugiere** que le rinde: nadie paga tanto
  tiempo por algo que no convierte. **No lo puedo probar** — puede ser un presupuesto en piloto
  automático. Tratalo como indicio, no como métrica.
- Creo que la mecánica del bloque 1 es que el lector **se reconoce antes de que le vendan**: el
  Excel y el papel no son metáforas, son el objeto que tiene abierto en la pantalla mientras
  scrollea. Un gancho que dice «optimizá tu gestión» no le señala nada suyo.
- Creo que el bloque 5 (`Ideal para…`) sirve de doble filo barato: descarta al que no compra y
  confirma al que sí. Es la línea más fácil de omitir y aparece en la mayoría de los anuncios
  del rubro.

**Para Onia en concreto:** el producto se vende por **packs de rubro**, así que el bloque 1
cambia por rubro y todo lo demás queda igual. La herramienta vieja a nombrar es distinta en una
clínica dental (cuaderno de turnos, historias en papel) que en un comercio (Excel de stock,
cuaderno de fiados). Una sola plantilla, siete llenados.
