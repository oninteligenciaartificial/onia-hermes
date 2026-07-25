# ONIA — Identidad visual v1 (2026)

> Fuente de verdad de la marca ONIA. Blanco, negro y verde. Agencia seria, minimalista, con caracter.
> Estado: v1 aprobable. Sergio va a pasar SU logo despues — los wordmarks de este doc son la
> base minimalista para comparar y rediseñar sobre ella, no la version final grabada en piedra.
> Assets: `web-factory/apps/onia-platform/public/brand/` (wordmark-a/b/c.svg + favicon.svg).

## 0. Que se conserva y que se reemplaza

| Del sitio actual (onia-platform) | Decision |
|---|---|
| Motion didactico (escenas, reveal, module-toggle) | SE CONSERVA |
| Layout editorial / jerarquia | SE CONSERVA |
| Tipografia con caracter (Bricolage Grotesque) | SE CONSERVA (ver §2) |
| Papel calido + acento ambar | SE REEMPLAZA por blanco/negro/verde (este doc) |

La idea semantica del sitio actual ("el acento marca lo ENCENDIDO, nunca decora") es buena y
se mantiene tal cual — solo cambia el color del encendido: ambar → verde.

---

## 1. Paleta

Tres colores. Nada mas.

- **Blanco (papel):** el escenario. Casi todo el lienzo es blanco.
- **Negro (tinta):** la voz. Texto, lineas, estructura. Negro-verdoso, no #000 puro.
- **Verde:** el estado. Significa "encendido / activo / aprobado". Es SEMANTICO, no decorativo:
  si un elemento es verde, es porque esta vivo (modulo activo, agente corriendo, CTA primario,
  dato aprobado). Un layout sin nada encendido es blanco y negro y esta bien asi.

Regla de proporcion orientativa: **~90% blanco · ~9% negro · ~1% verde.** El verde vale porque
es escaso.

### 1.1 El verde — dos candidatos

Ambos son verdes profundos "de agencia", no verde lima startup. Hex calculado desde OKLCH con
clamp de gamut; los valores OKLCH listados son los reales del hex final.

**Candidato A — Esmeralda profunda (hue 162) ← RECOMENDADO**

| Paso | Hex | OKLCH | Uso tipico |
|---|---|---|---|
| 50 | `#EDFBF3` | oklch(97.5% 0.018 161) | fondos de chip/badge "activo" (claro) |
| 100 | `#D5F4E3` | oklch(94% 0.04 162) | fondo hover suave, fila seleccionada |
| 200 | `#B2EACD` | oklch(89.1% 0.07 162) | bordes de estado activo (claro) |
| 300 | `#86D9B0` | oklch(82.1% 0.101 162) | acento sobre negro (texto grande, iconos) |
| 400 | `#4DBD8C` | oklch(72.1% 0.126 162) | **verde-señal en tema oscuro** (LED, links, texto acento) |
| 500 | `#089868` | oklch(60.1% 0.13 162) | **verde-señal en tema claro** (LED, indicadores no-texto) |
| 600 | `#027650` | oklch(50% 0.109 162) | **VERDE ONIA — base de marca.** Texto acento, CTA, links (claro) |
| 700 | `#016141` | oklch(43.6% 0.095 162) | hover/pressed del CTA, texto acento reforzado |
| 800 | `#004D32` | oklch(37.1% 0.082 162) | texto sobre verde-100/200, headings acento |
| 900 | `#013925` | oklch(30.5% 0.066 162) | casi-negro verde, fondos de bloque invertido |

**Candidato B — Verde pino (hue 152, chroma bajo)**

| Paso | Hex | OKLCH |
|---|---|---|
| 50 | `#F0F9F2` | oklch(97.3% 0.013 153) |
| 100 | `#DCF0E0` | oklch(93.6% 0.03 152) |
| 200 | `#C0E2C8` | oklch(88.1% 0.05 152) |
| 300 | `#9FCAA9` | oklch(79.9% 0.065 152) |
| 400 | `#7BAC88` | oklch(69.9% 0.074 152) |
| 500 | `#528560` | oklch(57% 0.079 152) |
| 600 | `#326541` | oklch(46.1% 0.081 152) |
| 700 | `#275235` | oklch(39.9% 0.069 153) |
| 800 | `#1D4128` | oklch(34.1% 0.061 152) |
| 900 | `#15311D` | oklch(28.5% 0.05 151) |

**Recomendacion: Candidato A (Esmeralda profunda, base `#027650`).**
Razones:
1. A los 3 usos del verde ONIA ("encendido", aprobado, dinero/valor) les sirve un verde con
   señal. El pino (B) es elegante pero gris — de lejos parece neutro y pierde la lectura de
   "esto esta VIVO", que es la promesa del producto (encender modulos).
2. A sigue siendo serio: L 50% esta al nivel de los verdes institucionales bancarios, lejos
   del lima/menta startup (eso seria L>75% con chroma alto).
3. A rinde mejor como sistema: 600 aguanta texto AA sobre blanco (5.45:1) y 400 brilla sobre
   negro sin quemarse (8.14:1). B en oscuro se apaga (#7BAC88 se percibe verdegris).
4. B queda como "verde tinta" opcional para papeleria/fondos si algun dia hace falta un
   segundo registro mas sobrio — no entra en la web v1.

### 1.2 Neutros (blanco-papel y negro-tinta)

El blanco y el negro de ONIA tienen un sesgo verdoso IMPERCEPTIBLE (chroma ≤0.012, hue ~165)
para que los tres colores pertenezcan a la misma familia. Nunca usar #000000 puro.

| Token | Hex | OKLCH | Rol |
|---|---|---|---|
| `papel` | `#F9FBFA` | oklch(98.6% 0.002 165) | fondo base tema claro |
| `blanco` | `#FFFFFF` | oklch(100% 0 0) | superficies/cards sobre papel |
| `papel-dim` | `#F3F5F4` | oklch(96.8% 0.002 165) | fondo alterno de seccion |
| `linea` | `#D4D9D6` | oklch(88.1% 0.007 160) | bordes |
| `linea-soft` | `#E2E5E3` | oklch(91.9% 0.004 157) | divisores suaves |
| `ink` | `#141A17` | oklch(21% 0.011 164) | texto principal (claro) |
| `ink-soft` | `#424A46` | oklch(40% 0.012 164) | texto secundario |
| `ink-faint` | `#69716D` | oklch(54.1% 0.011 165) | texto terciario/captions |
| `tinta-bg` | `#0C110F` | oklch(17.1% 0.009 169) | fondo base tema oscuro |
| `tinta-deep` | `#070B0A` | oklch(14.4% 0.007 180) | fondo profundo (hero oscuro) |
| `tinta-surface` | `#141A18` | oklch(21.1% 0.01 173) | cards tema oscuro |
| `tinta-surface-dim` | `#101513` | oklch(19% 0.009 169) | superficie alterna oscura |
| `tinta-linea` | `#28302D` | oklch(30% 0.012 171) | bordes tema oscuro |
| `texto-dark` | `#ECEFED` | oklch(94.9% 0.004 157) | texto principal (oscuro) |
| `texto-dark-soft` | `#B3B9B5` | oklch(78% 0.009 157) | texto secundario (oscuro) |
| `texto-dark-faint` | `#8D9490` | oklch(66% 0.01 161) | texto terciario (oscuro) |

### 1.3 Tema claro (definido a mano)

```css
:root {
  color-scheme: light;
  --bg: #F9FBFA;            /* papel */
  --bg-deep: #F3F5F4;
  --surface: #FFFFFF;
  --surface-dim: #F3F5F4;
  --ink: #141A17;
  --ink-soft: #424A46;
  --ink-faint: #69716D;     /* 4.83:1 sobre --bg — AA texto chico OK */
  --line: #D4D9D6;
  --line-soft: #E2E5E3;
  /* encendido (verde ONIA) */
  --verde: #027650;         /* 600 — texto acento, links, CTA bg */
  --verde-strong: #016141;  /* 700 — hover/pressed */
  --verde-ink: #004D32;     /* 800 — texto sobre verde-soft */
  --verde-soft: #D5F4E3;    /* 100 — fondos de chip/badge activo */
  --verde-senal: #089868;   /* 500 — SOLO elementos no-texto (LED, dots, barras) */
  --verde-glow: rgb(8 152 104 / 0.30);
}
```

### 1.4 Tema oscuro (definido a mano)

```css
:root[data-theme="dark"] {
  color-scheme: dark;
  --bg: #0C110F;            /* tinta */
  --bg-deep: #070B0A;
  --surface: #141A18;
  --surface-dim: #101513;
  --ink: #ECEFED;
  --ink-soft: #B3B9B5;
  --ink-faint: #8D9490;     /* 6.14:1 sobre --bg — AA OK */
  --line: #28302D;
  --line-soft: #1E2522;
  /* encendido: en oscuro el verde SUBE de luz, no de saturacion */
  --verde: #4DBD8C;         /* 400 — texto acento, links */
  --verde-strong: #86D9B0;  /* 300 — hover */
  --verde-ink: #86D9B0;
  --verde-soft: #013925;    /* 900 como fondo de chip activo */
  --verde-senal: #4DBD8C;   /* 400 — LED en oscuro */
  --verde-glow: rgb(77 189 140 / 0.25);
}
```

Boton primario por tema (el par se invierte):
- **Claro:** fondo `#027650` (600) + texto `#FFFFFF` → 5.66:1. Hover: fondo 700.
- **Oscuro:** fondo `#4DBD8C` (400) + texto `#0C110F` (tinta) → 8.14:1. Hover: fondo 300.

### 1.5 Contraste AA — verificado a mano

Calculado con WCAG 2.1 (luminancia relativa sRGB), script propio, 2026-07-25.
AA: ≥4.5:1 texto normal · ≥3:1 texto grande y componentes UI.

| Par | Ratio | Veredicto |
|---|---|---|
| verde-600 `#027650` sobre blanco `#FFFFFF` | **5.66:1** | AA texto normal ✓ |
| verde-600 sobre papel `#F9FBFA` | **5.45:1** | AA texto normal ✓ |
| blanco sobre verde-600 (CTA claro) | **5.66:1** | AA ✓ |
| verde-700 `#016141` sobre papel | **7.25:1** | AA ✓ (AAA texto grande) |
| blanco sobre verde-700 (CTA hover) | **7.53:1** | AA ✓ |
| verde-500 `#089868` sobre papel | **3.54:1** | solo UI/texto grande (≥3:1) — por eso 500 = `--verde-senal`, nunca texto chico |
| verde-400 `#4DBD8C` sobre tinta `#0C110F` | **8.14:1** | AA ✓ (texto acento oscuro) |
| verde-300 `#86D9B0` sobre tinta | **11.40:1** | AA ✓ |
| tinta sobre verde-400 (CTA oscuro) | **8.14:1** | AA ✓ |
| ink `#141A17` sobre papel | **16.98:1** | AAA ✓ |
| ink-soft `#424A46` sobre papel | **8.79:1** | AAA ✓ |
| ink-faint `#69716D` sobre papel | **4.83:1** | AA texto chico ✓ |
| texto-dark `#ECEFED` sobre tinta | **16.45:1** | AAA ✓ |
| texto-dark-soft sobre tinta | **9.54:1** | AAA ✓ |
| texto-dark-faint sobre tinta | **6.14:1** | AA ✓ |
| verde-600 sobre verde-50 (chip) | **5.31:1** | AA ✓ |
| verde-800 sobre verde-100 (chip fuerte) | **8.48:1** | AAA texto grande ✓ |
| ink sobre verde-50 | **16.55:1** | AAA ✓ |

Reglas duras derivadas:
- Texto verde chico en claro: SOLO 600/700/800. Nunca 500 ni mas claro.
- Texto verde en oscuro: SOLO 300/400. Nunca 500 ni mas oscuro sobre tinta.
- `--verde-senal` (500 claro / 400 oscuro) es para pixeles no-texto: LEDs, dots, barras,
  anillos de progreso.

---

## 2. Tipografia

**Se mantiene el trio actual del sitio.** Encaja con "agencia seria, minimalista con caracter":

| Rol | Fuente | Por que |
|---|---|---|
| Display / titulares | **Bricolage Grotesque** | Grotesca con personalidad (ink traps, contraste optico) sin ser cartoon. Es EL caracter de la marca. Pesos 500–700, tracking -1% a -2.5% en tamaños hero. Nunca los cortes ultra-condensed ni el peso 800 (grita). |
| Cuerpo / UI | **DM Sans** | Neutra, geometrica, gran legibilidad. 400/500. |
| Datos / codigo / cifras | **Spline Sans Mono** | Recibos, tablas, cifras, terminal. 400/500. Refuerza el registro "sistema real". |

Alternativa evaluada y descartada: cambiar display a una grotesca mas fria (p.ej. Inter Tight /
General Sans) daria "mas serio" pero mataria el caracter que a Sergio le gusta del sitio actual.
La seriedad la ponen el COLOR (verde profundo, cero decoracion) y el espacio en blanco, no
castrar la tipografia.

Reglas:
- Titulares en sentence case ("Encendé tu negocio"), nunca ALL CAPS largos.
- El wordmark es SIEMPRE minuscula: **onia**. En texto corrido la empresa se escribe "Onia"
  o "ONIA" segun contexto, pero la marca grafica es lowercase.
- Cifras y montos en Spline Sans Mono con `font-variant-numeric: tabular-nums`.

---

## 3. Reglas de uso — que si, que no

**SI**
- Blanco dominante; el layout respira. La densidad la da la tipografia, no los fondos.
- Verde = estado. Un solo elemento encendido por vista es lo ideal; tres es el maximo.
- Negro-verdoso `#141A17` para texto; bloques invertidos con `tinta` para secciones de peso.
- Lineas de 1px (`--line`) para estructura: tablas, diagramas, recibos. Estetica de documento
  tecnico/editorial.
- Motion didactico existente (module-toggle, escenas): el verde reemplaza al ambar como color
  de "encendido" 1:1.
- Fotografia/captura REAL del producto. Screenshots reales > ilustraciones.
- Iconografia lineal (stroke), monocroma, mismo grosor optico que la tipografia.

**NO**
- Gradientes violeta/azul "AI-startup". Ningun gradiente de marca; el verde es plano.
- 3D renders genericos, blobs, glassmorphism, mesh gradients, particulas.
- Verde lima/neon (#00FF88 y familia). Verde solo de la escala de este doc.
- Verde como decoracion: fondos verdes grandes, secciones enteras verdes, iconos verdes
  "porque quedaba lindo". Si no significa "activo/aprobado/encendido", va en tinta.
- #000000 puro y grises azulados (#111827 y familia Tailwind slate/gray). Los neutros son
  los de §1.2.
- Sombras dramaticas de color, glow neon, borders de gradiente.
- Emojis en UI de producto y titulares. (En canales sociales, con criterio.)
- Mezclar el ambar viejo con el verde nuevo durante la migracion: se migra por seccion
  completa, no conviven en una misma vista.

---

## 4. Tono verbal (5 lineas)

1. **Directo y en voseo boliviano:** "Encendé el modulo y listo" — nunca "nuestra solucion
   holistica empodera su transformacion digital".
2. **Concreto sobre abstracto:** siempre el resultado con numero o hecho ("tu factura SIAT
   sale sola"), nunca promesas vagas ("optimizamos procesos").
3. **Serio sin ser acartonado:** se permite ingenio seco en titulares; jamas chiste forzado,
   jamas hype ("revolucionario", "disruptivo" = prohibidos).
4. **Honesto por diseño:** lo que no esta listo no se muestra como listo; capturas reales,
   coberturas reales, precios reales. La confianza es el producto.
5. **El sistema habla en primera persona del hacer:** "registro, calculo, aviso, espero tu
   OK" — ONIA ejecuta y el dueño aprueba; el texto siempre deja el control del lado del cliente.

---

## 5. Wordmark "onia" — 3 propuestas

Archivos: `web-factory/apps/onia-platform/public/brand/wordmark-{a,b,c}.svg` + `favicon.svg`.
Las tres comparten el mismo esqueleto (minuscula, geometrica, monolinea de trazo 16 sobre
altura-x 80: la "o" y el cuenco de la "a" son circulos perfectos, la "n" es un arco puro).
Lo que cambia entre propuestas es DONDE vive el detalle verde — el "encendido":

| | Concepto | Detalle propio | Registro |
|---|---|---|---|
| **A — led** | El punto de la "i" es un **cuadrado verde**: un modulo encendido / pixel vivo. | dot cuadrado `verde-senal`, resto tinta | El mas limpio y el que mejor cuenta la promesa ("encender modulos"). |
| **B — anillo de estado** | Terminales rectos (mas tecnico) y un **segmento de arco verde** en la "o", como anillo de progreso/actividad. | arco 50° en la "o", dot cuadrado tinta | Mas "sistema/telemetria"; el verde es mas sutil. |
| **C — cursor** | Tras la "a", un **cuadrado verde a nivel de linea base**: cursor de terminal — el sistema esta esperando tu orden. | bloque baseline verde, dot redondo tinta | El mas editorial/dev; alarga el logo (relacion 2.5:1). |

**Recomendacion: A (led).** Es la que se lee como logo (y no como diagrama) a cualquier tamaño,
el detalle sobrevive en 16px (el favicon ES el led), y la metafora es exactamente el pitch del
producto: elegis tu rubro y ENCENDES modulos. B queda como recurso grafico de UI (el anillo de
estado ya es un patron del panel) y C como recurso para cierres de seccion/firma en docs.

Los SVG traen `prefers-color-scheme`: tinta `#141A17` → `#ECEFED` en oscuro; led `#089868` →
`#4DBD8C` en oscuro. Para fondos forzados usar la clase `.ink`/`.led` inline.

**Favicon** (`favicon.svg`): baldosa `tinta` redondeada + led verde `#4DBD8C` centrado. Lee
bien en pestañas claras y oscuras sin variantes.

> **NOTA:** Sergio va a pasar SU logo. Estas tres propuestas son la vara minimalista para
> compararlo: si su logo gana, estos quedan de archivo; si se rediseña, se parte del esqueleto
> A. El resto del doc (paleta, tipografia, reglas, tono) vale igual con cualquier logo.

---

## Apendice A — Migracion de tokens del sitio (guia, NO ejecutada en esta sesion)

Mapeo 1:1 contra `web-factory/apps/onia-platform/src/app/globals.css` de hoy:

| Token actual (ambar/papel calido) | Nuevo valor (este doc) |
|---|---|
| `--bg` oklch(96.8% 0.013 88) | `#F9FBFA` |
| `--surface` | `#FFFFFF` |
| `--ink` oklch(23% 0.02 65) | `#141A17` |
| `--accent` (ambar 72) | `--verde` `#027650` |
| `--accent-strong` | `#016141` |
| `--accent-ink` | `#004D32` |
| `--accent-soft` | `#D5F4E3` |
| `--accent-glow` | rgb(8 152 104 / .30) |
| `--ok` (verde semaforico aparte) | SE UNIFICA con la escala verde (600 claro / 400 oscuro) |
| `--danger` | se mantiene rojo suave actual (unico color fuera de la triada, solo errores) |
| tema oscuro (marrones 72-76) | neutros `tinta-*` de §1.2 |

El `--wa` (WhatsApp) se mantiene solo dentro del boton de WhatsApp, que es marca de terceros.

## Apendice B — Metodo de verificacion

Contrastes calculados con script propio (sRGB → luminancia relativa WCAG 2.1; OKLCH → hex via
OKLab con clamp de chroma al gamut sRGB). Todos los pares de §1.5 se recalculan si se toca un
hex. Regla: ningun token de texto entra al sistema sin su ratio anotado en este doc.
