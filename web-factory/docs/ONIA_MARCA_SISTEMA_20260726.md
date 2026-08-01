# Onia — sistema de marca

> 2026-07-26. Reemplaza a `ONIA_LOGO_SPEC_20260726.md` (candidatos A-G, todos descartados).
> La dirección sale de un benchmark de 44 marcas reales (IA agéntica, SaaS vertical, estudios
> de diseño) leyendo el CSS de cada sitio, no de impresiones. Research completo:
> `hermes-content/docs/ONIA_NAMING_MARCA_V2_20260726.md` + benchmark en el journal del workflow.
> **Nombre: "Onia", cerrado — ver [[feedback-no-inventar-cosas]].**

## 1. Los cinco hallazgos que ordenan todo

1. **El símbolo es la muleta de quien no confía en su tipografía.** 10/10 estudios de diseño serios y 11/16 SaaS verticales usan wordmark solo. Las únicas dos marcas del set con mascota/figura son Lindy y Dapta — las de menor craft.
2. **El peso es posicionamiento.** Ninguna marca premium pasa de 600 (Sierra 400, Work&Co 500, Attio 600). Los 700-900 son Dapta, Lindy, Siigo, Housecall Pro. Y el rango ≤300 **no existe en las 44 marcas B2B revisadas**: es territorio moda — ahí vive onia.com.
3. **Tracking negativo casi unánime** (12/15 entre -0.02em y -0.05em). La moda de lujo trabaja en +0.08em a +0.30em. Entre un logo de traje de baño y uno de software hay 200-300 milésimas de em: es otra marca a simple vista aunque digan la misma palabra.
4. **Verde y teal están saturados justo donde Onia vende.** Jane #00C1CA, Doctoralia #006A59, Mindbody #008363, Tebra #003A43, Alegra #30ABA9, Jobber #012939 — 5 de 6 del carril clínico. El violeta ya lo tomaron Decagon, Relevance y Artisan. Nadie usa negro cálido + acento cálido no-verde.
5. **La tipografía es el divisor de clase, y todas las LatAm usan fuentes genéricas** (Poppins, Nunito, Raleway, Inter). En un estudio de 9.563 wordmarks, ~98% usan lettering modificado, no una fuente descargada tal cual.

## 2. Por qué fallaba el logo anterior (medible, no opinable)

| Parámetro | v1 | Norma B2B | Diagnóstico |
|---|---|---|---|
| Peso | ~200-300 | 400-600 | No existe en B2B; existe en moda → choque con onia.com |
| Tracking | suelto | -0.02 a -0.05em | Código de lujo/moda |
| Color | verde | — | El más ocupado del carril clínico |
| Anatomía | monolínea geométrica fina | — | Es la firma de Dapta y Oniya; lee "hecho en Canva" |

Y fallaba el test que importa: **desaparece en un avatar de 40px sobre el verde de WhatsApp**, que es el canal de venta real.

## 3. El sistema

### Tipografía
**Archivo Variable** — Omnibus-Type (Héctor Gatti, Argentina), OFL 1.1 · https://fonts.google.com/specimen/Archivo

- **Wordmark: `wght 560`, `wdth 96`** — ninguna es parada estándar de la librería: es un corte propio del eje variable (mismo movimiento que Clay con su peso 575). Costo cero, evidencia de sistema real.
- Por qué: American Gothic (masa, x-height alta, terminales planas), "a" de dos pisos con terminal recto — anatomía de ingeniería, no de wellness. **Subusada en LatAm**, donde todos comparten Poppins/Inter. Bonus de pitch: diseñada en Latinoamérica.
- Descartadas a propósito: Inter (default del planeta), Geist (el nuevo Inter del mundo dev; el comprador no es dev), Poppins/Montserrat/Raleway (marcan precio bajo en PyME latina), Bricolage (display con caprichos ópticos: se ensucia a 16px).
- **Sistema: Archivo para todo** (jerarquía por tamaño y eje `wdth`, no por bold) + **Geist Mono** (OFL) solo en micro-etiquetas ≤12px MAYÚSCULA tracking +0.08em. Dos familias, ni una más.
- OFL permite vectorizar, modificar y **registrar el logo en SENAPI** sin permiso ni regalías.

### Espaciado
Minúscula. Tracking base **-0.022em**, más kerning óptico manual en 3 pares: `o|n` -6/1000, `n|i` **+4/1000** (dos verticales que si no hacen ruido de "m"), `i|a` -6/1000. El refinamiento que a Söhne le costó 8.190 pares, en "onia" se resuelve en 3.

### La intervención única
**El tittle de la "i" redibujado**: cuadrado exacto del ancho del asta, radio 0, esquina viva, con el hueco reducido a 0.55 del ancho del asta. Nada más se toca.

Tres razones: (a) la firma de onia.com es un punto redondo sobre trazo hairline — un cuadrado de esquina viva sobre un asta de 560 es su opuesto en el detalle más comparable; (b) precedente directo: Stripe reemplaza el punto de la "i" por un rectángulo y ese es su único gesto; (c) **en español "IA" es la palabra, no una alusión**: el nombre se descompone `on + ia`, y el color aterriza exactamente donde empieza *inteligencia artificial*. Reemplaza al isotipo de IA sin colgar un asterisco.

Regla dura: **una sola intervención**. Kia tiene 30 años de awareness y aun así millones leyeron "KN"; Onia tiene cero.

### Color

| Rol | Hex | Uso |
|---|---|---|
| Tinta | `#231F1C` | Negro cálido. Nunca `#000` |
| Papel | `#FAF8F5` | Nunca `#FFF`, nunca el gris azulado de Tailwind |
| Terracota | `#C4441F` | AA: 5.0:1 sobre blanco, 4.8:1 sobre papel |
| Grises | no existen | Solo opacidades de la tinta (12% / 30% / 55%) |

**Regla del terracota — la más importante del sistema.** Aparece en exactamente tres lugares: el tittle del logo, el CTA principal, y **todo lo que hizo un agente** (mensaje enviado, turno reprogramado, cobro gestionado). Nunca decorativo, nunca fondo de sección. Así el color significa *acción autónoma* — lo que Onia vende. El dueño de la clínica ve terracota = ve plata que entró sin que él hiciera nada.

Nadie lo usa: no es el verde clínico, ni el azul SaaS, ni el violeta de la cohorte IA, ni el lima de Dapta.

### Símbolo
**No.** El choque con onia.com es de parámetros tipográficos, no de falta de ícono. Ya se rechazaron el botón de encendido y las formas abstractas; una tercera versión sería insistir con la respuesta equivocada.

## 4. Assets

Generados con `fontTools` desde Archivo variable (script reproducible; no son imágenes de IA):

| Archivo | Qué es |
|---|---|
| `onia-logo.svg` | Wordmark, tinta en `currentColor` + tittle terracota |
| `onia-logo-light.svg` | Para fondo oscuro (los `<img>` no heredan currentColor) |
| `onia-logo-mono.svg` | Monocromo: el tittle va a 100% de tinta, nunca gris |
| `onia-favicon.svg` | Tile terracota radio 4px + "on" en papel |

Ubicación: `web-factory/apps/onia-platform/public/brand/`.

**Favicon = "on"** porque a 16px "onia" completa no lee, y porque "on" dice *siempre encendido* — el significado que buscaba el botón de encendido rechazado, escrito en vez de dibujado. En WhatsApp es el único punto del sistema donde el terracota es fondo: el chrome verde de WhatsApp lo empuja hacia adelante en vez de camuflarlo (justo lo que le pasa hoy al verde).

**El cuadrado es el átomo del sistema**: es el tittle, es el bullet de listas, es el indicador de "el agente está trabajando", es el punto de estado. Un elemento haciendo trabajo en cinco lugares es un sistema de marca; el mismo elemento en un solo lugar es un logo.

## 5. Pendiente

- Aprobación de Sergio. Si aprueba: aplicar tokens a `apps/onia-platform` (hoy usa verde #3EA639 + Bricolage), generar el lockup de producto, y actualizar el favicon del sitio.
- Verificación SENAPI de marca "ONIA" en clase software antes de registrar.
