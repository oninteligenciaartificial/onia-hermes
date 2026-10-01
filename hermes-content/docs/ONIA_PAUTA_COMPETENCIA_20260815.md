# D4 — Qué pauta la competencia en Bolivia (Biblioteca de Anuncios de Meta)

> ⚠️ **FOTO DEL 15-AGO — ya no es lo vigente (marcado el 2026-09-30 por el carril Mercado).** Lo actual
> sobre la pauta de la competencia está en `ONIA_ADQUISICION_Y_PAUTA.md` §2. Cambios que importan: **Softclinic
> tiene 0 anuncios** (acá figura como *"competidor directo"*, y su identidad no está clara); **Dentalink y
> Medilink** (Healthatom, Chile) pautan en Bolivia sin parar desde junio; **TuDoc** (boliviano, con SIAT) no
> figuraba. La fecha del 30-sep que acá aparece como reloj de la facturación en línea ya pasó: ver §2.4 del doc
> nuevo.

> 2026-08-15. Ejecuta el prompt D4 de `references/video-intake/PROMPTS_POR_SESION.md` línea 579.
> Herramienta: `ads_library_search` del MCP de Meta. **Gratis, público, sin dar de alta nada.**
> Spyglass (`app.spyglass.so`) queda descartado: no hace falta pagar por esto.

**Cobertura real:** 4 búsquedas por término + 3 por `page_id`, país `BO`. Se leyó el **metadato**
de cada anuncio (página, fecha de creación, fecha de entrega, título del enlace, moneda).
**No se abrieron los `ad_snapshot_url`**, así que el creativo visual no está mirado — la
clasificación por formato de abajo se infiere del título del enlace y del CTA, y se marca como tal.

---

## 1. El hallazgo que más vale: el hueco está vacío

```
"diseño de páginas web para empresas Santa Cruz"  ·  BO  ·  activos
→ estimated_total_count: 0
```

**Cero anuncios.** Nadie le está pautando diseño web a empresas en Bolivia ahora mismo.

Es el hueco más barato de ocupar que apareció, y coincide con la pieza que ya está encolada y
sin producir: el **antes/después de webs entregadas** (prompt A1). No competís contra nadie por
ese inventario.

⚠️ Un `count: 0` es de ESE término exacto. No prueba que nadie venda webs — prueba que nadie lo
está pautando con esas palabras. Vale como señal, no como censo.

## 2. El nicho de "IA y automatización" lo ocupan cursos, no implementadores

14 anuncios activos para *"automatización con inteligencia artificial para negocios"*. El reparto:

| Anunciante | Qué vende | Moneda |
|---|---|---|
| Educly App AI | *"Domina la IA en 28 Días"* — **4 anuncios** del mismo curso | USD |
| Instituto Digital Next | *"🤖 IA + Automatización 2026"* + *"⭐ Inglés Completo A1–C1"* | **BOB** |
| Megapack.cursos | *"🔥 Dominá Claude desde cero"* — 2 anuncios | USD |
| Behind-U Education | *"Pide tu programa completo"* | MXN |
| Lite Thinking • LT Tech | *"Lidera empresas con Inteligencia Artificial"* | USD |
| Aprende Ya · Betancourt Blog · Impulso IA · Andre Cano | infoproducto / contenido | USD |

**Casi todos venden formación, no implementación.** Y solo uno factura en bolivianos
(Instituto Digital Next), que además es una academia genérica — el mismo día lanzó el de IA y el
de inglés, o sea que el rubro le da igual.

**Qué significa para nosotros:** el comprador boliviano de este nicho hoy recibe *"aprendé a
hacerlo vos"*. Nadie le está diciendo *"te lo dejo funcionando"*. Ese es el posicionamiento libre.

## 3. Los tres competidores REALES de producto

Filtro aplicado: factura en **BOB** (o sea le pauta a Bolivia con plata local) y vende
**software**, no cursos.

### 3.1 Softclinic — competidor directo de DentalGest

```
page_id 737824982739173  ·  2 anuncios  ·  BOB
ambos creados el 2026-08-05, entrega desde el 2026-08-05
ad_creative_link_title: VACÍO en los dos
```

**Toda su pauta son 2 anuncios lanzados el mismo día.** No hay campaña sostenida ni rotación de
creativos. Es la definición de un competidor con presupuesto chico.

El `link_title` vacío en los dos sugiere creativo sin enlace externo —
típicamente Click-to-WhatsApp o video con CTA en la pieza. **A verificar** abriendo el snapshot.

### 3.2 Facturación Electrónica io — el que se mueve por la fecha fiscal

```
page_id 116864281513629  ·  3 anuncios  ·  BOB
2026-07-21  "Chatea con nosotros" ×10   ← Click-to-WhatsApp, 10 posiciones/variantes
2026-08-15  "Postularme" ×3             ← anuncio de EMPLEO, creado hoy
2026-08-15  "Postularme" ×3             ← ídem
```

**Dos de sus tres anuncios activos son búsqueda de personal, creados hoy.** Está contratando,
no vendiendo. Con la facturación en línea obligatoria el **30-sep-2026** encima, eso se lee como
un competidor preparándose para un pico de demanda.

Es la señal de mercado más concreta de toda la pasada: **alguien más está viendo el mismo reloj
que nosotros, y ya está armando equipo.**

### 3.3 AppYaa

```
page_id 857893647418441  ·  1 anuncio  ·  BOB  ·  2026-07-06  ·  link_title vacío
```

Un solo anuncio, del 6 de julio. Presencia mínima. **A verificar** qué vende exactamente.

### Menciones de la búsqueda de chatbot, que NO son competencia local

- **WhatChimp** — 20+ anuncios, USD, multi-idioma (inglés/francés/portugués/español/árabe).
  Es una plataforma SaaS global de chatbot de WhatsApp, no un competidor boliviano. Copy único
  repetido en 20 anuncios: *"0% de comisión en la API"*.
- **Ergia.ai** (COP) y **Agatsu Digital** (PEN) — regionales. Agatsu tiene el mejor titular de
  toda la pasada: *"Deja de perder ventas por demorar"*. Ese ángulo es exactamente nuestro dolor
  #1 y **está probado corriendo en Perú**.
- **Kenathan Giovanni Conde** (BOB, 2026-06-08) — *"Sitio Web Emprendedores"*. Persona, no
  empresa. Le vende a emprendedores, no a empresas formales: otro comprador.
- **Tecno Impulso** (BOB, 2026-05-20) — sin título de enlace.

---

## 4. El formato que repiten

Del metadato, no del creativo:

| Formato | Quién | Evidencia |
|---|---|---|
| **Click-to-WhatsApp** | Facturación Electrónica io, Ergia.ai | `"Chatea con nosotros"` repetido ×10 = un creativo servido en 10 posiciones |
| **Enlace a landing con promesa numerada** | Educly, Instituto Digital Next | *"en 28 Días"*, *"A1–C1"* |
| **Creativo sin enlace** | Softclinic, AppYaa, Tecno Impulso | `link_title` vacío |

El molde de clasificación de Spyglass (GRWM · text overlay · brand story · demo de producto ·
testimonio) **no se puede aplicar sin abrir los snapshots**. Queda pendiente y es gratis.

---

## 5. Las dos conclusiones

**1. El hueco: nadie vende "te lo dejo funcionando" en bolivianos.** El nicho de IA lo ocupan
cursos que enseñan a hacerlo uno mismo, y los dos competidores de software real corren 2 y 3
anuncios. No hay que ganarle a nadie con presupuesto — hay que estar.

**2. El reloj es real y alguien más lo está mirando.** Facturación Electrónica io publicó dos
anuncios de contratación **hoy**, a ~7 semanas de que la facturación en línea sea obligatoria.
Es la confirmación externa del plazo del 30-sep que hasta ahora solo teníamos escrito en la
memoria del proyecto.

## 6. Lo que NO se hizo, y es gratis

- **Abrir los `ad_snapshot_url`** para ver el creativo y clasificarlo de verdad. Sin eso, la
  tabla de formatos es inferencia.
- Buscar por rubro: veterinaria, estética, importadora. Se buscó dental y facturación.

## 7. Reglas que se respetaron

- **No se dio de alta Spyglass** ni ninguna herramienta paga. La Biblioteca de Meta alcanzó.
- **No se copió ningún creativo.** Se mira el formato y el hueco.
- **No se inventó un competidor:** las 3 fichas de §3 salen de `page_id` verificable y su pauta
  se consultó por página, no por término.
- Ninguna cifra de este doc viene de un video: todas salen de la API de Meta el 2026-08-15.
