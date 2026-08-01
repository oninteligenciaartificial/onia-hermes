# Tipografía — sistema y banco de conocimiento

> 2026-07-27. Nace de desarmar el CSS real de Fanvue (`fv-landing-page.shared.css`,
> su Webflow) porque a Sergio le gustó ese diseño. Acá queda **lo que aprendimos**
> y **lo que ya está cableado** en Onia.
>
> Regla de la casa: los datos de abajo salieron de leer el CSS, no de memoria.
> Si alguien los actualiza, que sea volviendo a mirar la fuente.

---

## 1. Lo que ya está usable en Onia (no es solo teoría)

| Rol | Fuente | Token | Dónde |
|---|---|---|---|
| **Titular grande condensado** | **Archivo** (variable, ejes `wght` + `wdth`) | `--font-display-cnd` | clase `.display` |
| Titulares normales | Bricolage Grotesque | `--font-display` | `h1, h2, h3` |
| Cuerpo | DM Sans | `--font-sans` | `body` |
| Números, etiquetas, datos | Spline Sans Mono | `--font-mono` | `.eyebrow`, chips |

Cableado en `apps/onia-platform/src/app/layout.tsx` + `globals.css`.
Se ve vivo en la ruta interna **`/patrones`** (noindex).

### La clase `.display` — reglas de uso

```html
<h1 class="display">Tu negocio, <em>ordenado</em></h1>
```

- **UNO por pantalla.** Si hay dos, ninguno es grande.
- **Solo de `--text-hero` para arriba.** Condensado a tamaño chico no se lee
  "editorial", se lee apretado. Es el error clásico.
- **Máximo 4-5 palabras.** Es un gesto, no un párrafo.
- `line-height: 0.92` a propósito: las líneas se tocan y forman un bloque sólido.
  Ese bloque ES el efecto; con interlineado normal se pierde.
- `<em>` adentro no pone cursiva: **pinta la palabra en verde acento**. Es nuestra
  versión del contraste (ver §3).

**Por qué Archivo y no otra:** es variable con eje de ancho (`wdth` 62–125), así que
el condensed-extrabold sale del **mismo archivo** que el regular — cero peso extra por
corte. Y es **OFL**: se puede modificar y el resultado es nuestro. Alternativas que
descartamos: Oswald (sobreusado), Anton (un solo peso), Bebas Neue (solo mayúsculas).

---

## 2. El teardown de Fanvue — qué usan realmente

No usan una tipografía: usan **siete**, con roles separados.

| Rol | Fuente | Selectores reales |
|---|---|---|
| **Titulares — su voz de marca** | **Akzidenz-Grotesk Next**, corte *Extra Bold Condensed* | `.heading-hero`, `.heading`, `.heading-faq`, `.heading-footer` |
| Cuerpo / testimonios | Basier Circle | `.rich-text-block`, `.testimonials-*` |
| Base del `body` | Space Grotesk | `body` |
| Secciones nuevas | Plus Jakarta Sans + Inter Tight | `.main-cta`, `.manifesto-body`, `.description` |
| Números y etiquetas | Space Mono | `.point-number`, `.advantage-title`, `.counter-text` |
| Palabras sueltas dentro del titular | EB Garamond *Italic* | `.text-span-*` |

**El detalle que lo delata:** la declaran como `FV MAIN Akzidgrtsknext` — *FV MAIN* =
*Fanvue main*. Le pusieron nombre de marca a su tipografía. Eso es tratar la tipografía
como activo distintivo, no como decoración.

**Lectura honesta del stack:** siete familias es demasiado. Las capas de Plus Jakarta
Sans e Inter Tight son claramente un rediseño encima del original sin limpiar lo viejo.
No copiar eso.

### Licencias — qué se puede y qué no

| Fuente | Licencia | ¿Usable? |
|---|---|---|
| Akzidenz-Grotesk Next | Berthold/Monotype, paga (web por pageviews) | ❌ Cara |
| Basier Circle | Atipo Foundry, paga | ❌ |
| Space Grotesk | **SIL OFL** | ✅ |
| Plus Jakarta Sans | **SIL OFL** | ✅ |
| Inter Tight | **SIL OFL** | ✅ |
| Space Mono | **SIL OFL** | ✅ |
| EB Garamond | **SIL OFL** | ✅ |

**Cinco de siete son libres.** El sistema entero se replica sin pagar licencia.

> ⚠️ **Ojo con Fontshare** (General Sans, Satoshi, Switzer). Se ven gratis pero su FFL
> **prohíbe modificar los glifos** y reclama derechos sobre el resultado derivado.
> Inservibles para un logo que vamos a registrar. Para marca: **solo OFL**.

---

## 3. El patrón que vale la pena robar

No es la fuente. Es **la estructura de contraste**:

1. Un **display condensado muy pesado** para el titular.
2. Un **acento de otra naturaleza** metido adentro del titular — ellos usan una
   serif cursiva; nosotros usamos **color**, porque una 5ta familia no paga su costo.
3. Un **monoespaciado para los números y las etiquetas**, nunca para texto corrido.
4. Una sans neutra y aburrida para el cuerpo. El cuerpo no tiene que ser interesante.

Eso es lo que hace que un titular se lea "editorial" y no "startup genérica". La fuente
específica es intercambiable; la estructura no.

**Presupuesto de familias:** máximo 4 en producción (display condensado, display normal,
sans, mono). Ya estamos en 4. Sumar una quinta necesita justificación explícita.

---

## 4. Si algún día queremos la cursiva serif de verdad

Es el único elemento del patrón que no portamos. Costo: **una familia más** (EB Garamond,
OFL, gratis) y ~15-25 kB con `preload: false` y subset latino. Vale la pena solo si
aparece un caso donde el color no alcanza para el contraste. Decisión de Sergio, no
default.

---

Relacionado: `MOTION_PATTERN_BANK_2026.md` — patrones **P15-P18** (ScrollList, Marquee,
Coverflow, BleedWordmark), del mismo teardown de Fanvue ·
`ONIA_MARCA_ESTRATEGIA_20260727.md` (la tipografía del logo, que es otra decisión) ·
`WEB_FACTORY_DESIGN_INTELLIGENCE_LATEST.md`.
