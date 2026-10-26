# ONIA — Brand System oficial 2026
> ⚠️ **Corregido 2026-09-07 — este doc NO manda sobre color ni logo.** Se declara
> «canónico», y para tipografía, retícula y tono lo sigue siendo. Pero su paleta es
> ANTERIOR al 27-jul y no contiene los tres colores que están DENTRO de los SVG que el
> sitio sirve (`#12100E`, `#F4F6F4`, `#00D26A`). Sobre color del logo manda
> `ONIA_MARCA_ESTRATEGIA_20260727.md` §4-bis. Índice: `ONIA_MARCA.md`.


> **Doc canonico de la identidad Onia.** Blanco, negro y verde. Minimalista, agencia seria.
> Supersede a `hermes-content/docs/historial/web-factory/ONIA_BRAND_2026.md` (v1, queda de archivo) y **reconcilia** el conflicto con
> `ONIA_LOGO_SPEC_20260726.md` (ver §1.4). Los tokens de §5 son los que estan VIVOS en
> `web-factory/apps/onia-platform/src/app/globals.css` — doc y codigo dicen lo mismo.
>
> El logo definitivo lo pasa Sergio despues. El sistema esta diseñado para que el swap de
> logo sea reemplazar archivos SVG, cero retoque de tokens ni layout (§4).

---

## 0. El sistema en una frase + 3 reglas de oro

**Onia es una hoja blanca con tinta negra, donde lo unico que tiene color es lo que esta
encendido.**

1. **El verde es un estado, no un color.** Significa "encendido / activo / aprobado".
   Si un elemento es verde es porque esta vivo (modulo activo, agente corriendo, CTA
   primario, dato aprobado). Prohibido el verde decorativo — un layout sin nada encendido
   es blanco y negro, y esta bien asi. Proporcion guia: **~90% blanco · ~9% negro · ~1% verde.**
2. **Nunca negro puro, nunca gris ajeno.** Todos los neutros llevan un sesgo verdoso
   imperceptible (hue ~165, chroma ≤0.012) para que blanco, negro y verde sean UNA familia.
   Prohibido `#000000` y los grises azulados genericos (Tailwind slate/gray).
3. **La seriedad la ponen el espacio y el color, no castrar el caracter.** Blanco dominante,
   lineas de 1px, verde escaso = agencia seria. La tipografia con personalidad (Bricolage)
   se queda: es la firma.

---

## 1. Paleta — blanco, negro y EL verde

### 1.1 El verde elegido: **Esmeralda profunda** (hue OKLCH 162, base `#027650`)

Se evaluaron tres direcciones y se elige UNA:

| Candidato | Veredicto | Por que |
|---|---|---|
| **Esmeralda profunda** (base `#027650`, oklch 50% 0.109 162) | **ELEGIDO** | Tiene señal (se lee "vivo" de lejos) y a la vez es institucional: su luminosidad esta al nivel de los verdes bancarios, lejos del neon. Es el unico de los tres que rinde como SISTEMA: el paso 600 aguanta texto AA sobre blanco (5.66:1) y el 400 brilla sobre negro sin quemarse (8.14:1). |
| Verde lima tech (familia `#00E676`/`#B7F818`) | Descartado | Falla AA sobre blanco de forma irrecuperable (ratios ≈1.6–2.2:1 — jamas puede ser texto ni CTA en tema claro) y el registro es crypto/gaming, no "agencia seria". En Bolivia ademas colisiona con la estetica de casas de apuestas. |
| Verde bosque/pino (base `#326541`, chroma bajo) | Descartado | Elegante pero gris: de lejos se percibe neutro y mata la lectura de "esto esta ENCENDIDO", que es la promesa literal del producto (encender modulos). En tema oscuro se apaga (los pasos claros se ven verde-gris). Queda como "verde tinta" opcional de papeleria si algun dia hace falta un segundo registro. |

**Criterio de la eleccion (lo que Sergio necesita saber):** el verde de Onia tiene tres
trabajos — encendido, aprobado, dinero/valor — y los tres piden un verde con señal pero con
peso. La esmeralda profunda es "semaforo en verde con traje": comunica accion sin gritar, y
es el unico candidato que pasa contraste AA en ambos temas sin excepciones.

### 1.2 La escala verde (fuente unica — todos los verdes salen de aca)

| Paso | Hex | OKLCH | Uso |
|---|---|---|---|
| 50 | `#EDFBF3` | oklch(97.5% 0.018 161) | fondo de chip/badge "activo" (claro) |
| 100 | `#D5F4E3` | oklch(94% 0.04 162) | hover suave, fila seleccionada, ::selection |
| 200 | `#B2EACD` | oklch(89.1% 0.07 162) | bordes de estado activo (claro) |
| 300 | `#86D9B0` | oklch(82.1% 0.101 162) | hover/texto acento reforzado en OSCURO |
| 400 | `#4DBD8C` | oklch(72.1% 0.126 162) | **verde-señal + texto acento en tema oscuro** |
| 500 | `#089868` | oklch(60.1% 0.13 162) | **verde-señal en tema claro** — SOLO pixeles no-texto (LED, dots, barras) |
| 600 | `#027650` | oklch(50% 0.109 162) | **VERDE ONIA — base de marca.** Texto acento, links, "aprobado" (claro) |
| 700 | `#016141` | oklch(43.6% 0.095 162) | hover/pressed, kickers, focus ring (claro) |
| 800 | `#004D32` | oklch(37.1% 0.082 162) | texto sobre verde-100/200 |
| 900 | `#013925` | oklch(30.5% 0.066 162) | fondo de chip activo en oscuro, casi-negro verde |

Reglas duras de contraste (verificadas WCAG 2.1, tabla completa en §6):
- Texto verde chico en claro: SOLO 600/700/800. Nunca 500 ni mas claro.
- Texto verde en oscuro: SOLO 300/400. Nunca 500 ni mas oscuro sobre tinta.
- 500 (claro) / 400 (oscuro) = `--accent`, la "señal": LEDs, dots, barras, anillos. No texto.
- En oscuro el verde **sube de LUZ, no de saturacion** (600→400), nunca se "neoniza".

### 1.3 Los neutros: grises FRIOS-VERDOSOS (decision)

Ni grises calidos (eran del mundo papel+ambar que se retira) ni azulados (huelen a template).
Todos los neutros comparten el hue del verde (~160–170) con chroma imperceptible (≤0.012):
el ojo no ve "gris verdoso", ve UNA familia coherente. Es lo que hace que la triada se sienta
diseñada y no ensamblada.

| Token | Hex | OKLCH | Rol |
|---|---|---|---|
| papel | `#F9FBFA` | oklch(98.6% 0.002 165) | fondo base claro |
| blanco | `#FFFFFF` | oklch(100% 0 0) | superficies/cards sobre papel |
| papel-dim | `#F3F5F4` | oklch(96.8% 0.002 165) | fondo alterno de seccion |
| linea | `#D4D9D6` | oklch(88.1% 0.007 160) | bordes estructura |
| linea-soft | `#E2E5E3` | oklch(91.9% 0.004 157) | divisores suaves |
| ink | `#141A17` | oklch(21% 0.011 164) | texto principal (claro) — el "negro" Onia |
| ink-soft | `#424A46` | oklch(40% 0.012 164) | texto secundario |
| ink-faint | `#69716D` | oklch(54.1% 0.011 165) | terciario/captions (4.83:1 AA) |
| tinta-bg | `#0C110F` | oklch(17.1% 0.009 169) | fondo base oscuro |
| tinta-deep | `#070B0A` | oklch(14.4% 0.007 180) | fondo profundo |
| tinta-surface | `#141A18` | oklch(21.1% 0.01 173) | cards oscuro |
| tinta-linea | `#28302D` | oklch(30% 0.012 171) | bordes oscuro |
| texto-dark | `#ECEFED` | oklch(94.9% 0.004 157) | texto principal (oscuro) |
| texto-dark-soft | `#B3B9B5` | oklch(78% 0.009 157) | secundario (oscuro) |
| texto-dark-faint | `#8D9490` | oklch(66% 0.01 161) | terciario (oscuro, 6.14:1 AA) |

Fuera de la triada solo viven DOS colores funcionales, ambos discretos: `--danger` (rojo
suave para errores/huecos) y `--wa` (verde WhatsApp, marca de terceros, solo en su boton).

### 1.4 Reconciliacion con el verde del logo (`#3EA639`) — cerrado

`ONIA_LOGO_SPEC_20260726.md` pedia calibrar la identidad al verde del logo recibido. Se
evaluo con numeros y la respuesta es NO como token de UI: `#3EA639` da **3.13:1 sobre
blanco** (falla AA texto normal — no puede ser link, kicker ni CTA en tema claro) y su
registro es "cesped recreativo", no institucional. **Resolucion: un solo verde de sistema
(esmeralda §1.2); el verde del logo vive DENTRO del SVG del logo, autocontenido.** Es la
practica estandar (el logo es arte propio, la UI es sistema) y hace el swap de logo trivial.

---

## 2. Tipografia — se queda el trio (decision)

| Rol | Fuente (Google Fonts) | Pesos | Por que |
|---|---|---|---|
| Display / titulares | **Bricolage Grotesque** | 500–700 | Grotesca con personalidad real (ink traps, contraste optico) sin ser cartoon. Es EL caracter de la marca — cambiarla por una grotesca fria (Inter Tight / General Sans) daria "mas serio" de lejos pero mataria lo unico memorable. La seriedad ya la ponen el verde profundo y el blanco. Nunca los cortes ultra-condensed ni el peso 800. |
| Cuerpo / UI | **DM Sans** | 400/500 | Neutra, geometrica, gran legibilidad en cuerpo chico. No compite con el display. |
| Datos / cifras / codigo | **Spline Sans Mono** | 400/500 | Recibos, tablas, montos, terminal. Refuerza el registro "sistema real, no folleto". Cifras SIEMPRE con `font-variant-numeric: tabular-nums`. |

Reglas:
- Titulares en sentence case ("Encendé tu negocio"), nunca ALL CAPS largos.
- Tracking −1% a −2.5% en tamaños hero; `clamp()` agresivo (hero ≥4.5rem desktop).
- La marca grafica es SIEMPRE minuscula: **onia**. En texto corrido "Onia" u "ONIA" segun contexto.
- Maximo estas 3 familias. Prohibido sumar una cuarta "para un caso especial".

---

## 3. Reglas de uso — el "minimal serio" en numeros

### 3.1 Espaciado, radios, bordes, sombras

- **Ritmo de seccion:** `--space-section: clamp(4.5rem, 3rem + 6vw, 9rem)`. El blanco extra
  ES el minimalismo; nunca comprimir para "que entre mas". Header fijo 60px.
- **Radios — dos valores y pill:** `14px` (cards, inputs, chips) y `22px` (bloques grandes).
  Pill `999px` SOLO botones y badges. Nunca radios ad-hoc ni tres radios en un componente.
- **Bordes:** 1px solido `--line` para estructura (tablas, recibos, diagramas — estetica de
  documento tecnico); `--line-soft` para divisores. Dashed SOLO significa "todavia no".
  Prohibido borde de gradiente y borde 2px+ decorativo.
- **Sombras — dos niveles y neutras:** `--shadow-card` y `--shadow-pop`, nada mas. Sin
  tinte de color; el unico halo permitido es `--accent-glow` en el LED.
- **Grosor del verde:** el verde aparece en trazos finos — borde 1px, barra 2–3px, dot
  8–10px, texto acento. Nunca en areas grandes. Un elemento encendido por vista es lo
  ideal; tres es el maximo.

### 3.2 Imagen: fotografia e ilustracion (decision)

- **SI: captura REAL del producto.** Screenshot verdadero con marco de browser > cualquier
  ilustracion. Si no existe la pantalla, marco "captura real pendiente" — placeholder
  honesto, nunca mockup falso como proof (regla de la casa).
- **NO fotografia stock** (gente sonriendo en oficinas = template). Fotografia propia de
  contexto boliviano solo si es real y aporta; no es requisito de la v1.
- **Ilustracion: solo diagramatica.** Diagramas de flujo, esquemas de modulos, iconografia
  lineal (stroke monocromo, mismo grosor optico que la tipografia). Prohibido: 3D renders
  genericos, blobs, glassmorphism, mesh gradients, particulas, mascotas.

### 3.3 Prohibiciones de marca (lista dura)

- Gradientes violeta/azul "AI-startup". Ningun gradiente de marca; el verde es plano.
- Verde lima/neon (`#00FF88` y familia). Verde solo de la escala §1.2.
- Verde decorativo: fondos verdes grandes, secciones enteras verdes, iconos verdes "porque
  quedaba lindo". Si no significa activo/aprobado/encendido, va en tinta.
- `#000000` puro y grises azulados.
- Sombra de color, glow neon, borders de gradiente.
- Emojis en UI de producto y titulares (en canales sociales, con criterio).

### 3.4 Tono verbal (la voz visual tiene voz escrita)

1. **Directo y en voseo boliviano:** "Encendé el modulo y listo".
2. **Concreto sobre abstracto:** el resultado con numero o hecho, nunca "optimizamos procesos".
3. **Serio sin acartonado:** ingenio seco permitido; "revolucionario"/"disruptivo" prohibidos.
4. **Honesto por diseño:** capturas reales, coberturas reales, precios reales.
5. **El sistema habla del hacer:** "registro, calculo, aviso, espero tu OK" — Onia ejecuta,
   el dueño aprueba.

Compliance comercial intacto (C7): nunca "por ley tenes que comprarnos" — el portal del SIN
es gratis y se dice de frente; el agente REPROGRAMA (no promete imposibles); cero
testimonios/SLA/cifras inventadas; precios solo "desde Bs 320/mes — precio de lanzamiento";
add-ons "a cotizar".

### 3.5 Motion

Se REUSA el kit existente (`src/motion/**` + `MOTION_PATTERN_BANK_2026.md`), sin retocar
springs/duraciones/eases. El verde reemplazo al ambar 1:1 como color de "encendido" en las
escenas didacticas (module-toggle, agent-scene). Compositor-only + `prefers-reduced-motion`
obligatorios. El motion es didactico (explica el producto), nunca decorativo.

---

## 4. Logo — como se aplica cuando llegue el de Sergio

Mientras no llega, la web usa el **wordmark placeholder "onia" (variante led)**: minuscula
geometrica en tinta con el punto de la "i" como cuadrado verde — un modulo encendido. Assets
en `web-factory/apps/onia-platform/public/brand/` (wordmark-a/b/c.svg, favicon.svg,
onia-logo.svg = recreacion preliminar del logo recibido).

### 4.1 Contrato de archivos (swap sin tocar codigo)

| Path | Rol | Requisito |
|---|---|---|
| `public/brand/logo.svg` | logo principal (header, footer) | auto-adaptable via `prefers-color-scheme` o `currentColor` |
| `public/brand/logo-dark.svg` | opcional si el SVG no auto-adapta | mismo viewBox |
| `public/brand/favicon.svg` | favicon | debe leer a 16px; si no lee, queda el led actual |

Los componentes referencian el PATH, no el contenido: recibir el logo = reemplazar archivos.

### 4.2 Zonas y tamaños

- **Header:** 24–28px de alto (respira dentro de los 60px). Zona de respeto = una altura-x
  en los 4 lados; nada la invade.
- **Footer:** 20–24px; variante silenciosa (tinta 100%, sin verde) aceptable.
- **Hero/docs/propuestas:** maximo 40px. **El logo nunca es el heroe; el titular si.**
- **Minimo absoluto:** 18px; por debajo, solo el simbolo/favicon.

### 4.3 Color del logo por fondo

| Fondo | Tinta del logo | Verde del logo |
|---|---|---|
| papel / blanco | `#141A17` | su verde propio (dentro del SVG) |
| tinta (oscuro) | `#ECEFED` | sube de LUZ, no de saturacion (ref: `#4DBD8C`) |
| verde-600 (bloque invertido) | blanco monocromo, sin verde | — |

Nunca: logo sobre foto ruidosa, con sombra/glow, estirado, ni en gris.

---

## 5. Tokens CSS oficiales (copiar/pegar — identicos a los vivos en `globals.css`)

Los nombres `--accent*` se conservan (los ~90 usos existentes en componentes no se tocan);
la escala cruda `--verde-*` es la fuente y los nombres semanticos apuntan a ella.

### 5.1 Tema claro

```css
:root {
  color-scheme: light;

  /* escala verde ONIA (§1.2) — fuente unica */
  --verde-50: #EDFBF3;  --verde-100: #D5F4E3; --verde-200: #B2EACD;
  --verde-300: #86D9B0; --verde-400: #4DBD8C; --verde-500: #089868;
  --verde-600: #027650; --verde-700: #016141; --verde-800: #004D32;
  --verde-900: #013925;

  /* papel */
  --bg: #F9FBFA;
  --bg-deep: #F3F5F4;
  --surface: #FFFFFF;
  --surface-dim: #F3F5F4;

  /* tinta */
  --ink: #141A17;
  --ink-soft: #424A46;
  --ink-faint: #69716D; /* 4.83:1 sobre --bg — AA texto chico OK */
  --line: #D4D9D6;
  --line-soft: #E2E5E3;

  /* encendido (verde ONIA) */
  --accent: var(--verde-500);        /* señal no-texto: LED, dots, barras */
  --accent-strong: var(--verde-700); /* hover/pressed, focus ring */
  --accent-ink: var(--verde-700);    /* texto acento (kicker, labels) */
  --accent-soft: var(--verde-100);   /* fondos chip/badge activo */
  --accent-glow: rgb(8 152 104 / 0.30);

  /* semanticos */
  --ok: var(--verde-600);
  --ok-soft: var(--verde-50);
  --danger: oklch(60% 0.14 28);
  --danger-soft: oklch(93.5% 0.04 28);
  --wa: oklch(56% 0.13 155);

  /* sombras: neutras, dos niveles */
  --shadow-card:
    0 1px 2px oklch(25% 0.01 165 / 0.06),
    0 14px 36px -14px oklch(25% 0.02 165 / 0.18);
  --shadow-pop:
    0 2px 4px oklch(25% 0.01 165 / 0.09),
    0 24px 56px -20px oklch(25% 0.025 165 / 0.26);

  /* sistema */
  --text-hero: clamp(2.7rem, 1.1rem + 5.6vw, 5.4rem);
  --text-h2: clamp(2.05rem, 1.3rem + 2.5vw, 3.3rem);
  --text-h3: clamp(1.25rem, 1.05rem + 0.7vw, 1.6rem);
  --text-body: clamp(1rem, 0.95rem + 0.2vw, 1.0925rem);
  --space-section: clamp(4.5rem, 3rem + 6vw, 9rem);
  --radius: 14px;
  --radius-lg: 22px;
  --header-h: 60px;
}
```

### 5.2 Tema oscuro (pegar en `[data-theme="dark"]` Y en el media query `prefers-color-scheme`)

```css
  color-scheme: dark;
  --bg: #0C110F;
  --bg-deep: #070B0A;
  --surface: #141A18;
  --surface-dim: #101513;
  --ink: #ECEFED;
  --ink-soft: #B3B9B5;
  --ink-faint: #8D9490; /* 6.14:1 sobre --bg — AA OK */
  --line: #28302D;
  --line-soft: #1E2522;
  /* encendido: en oscuro el verde sube de LUZ, no de saturacion */
  --accent: var(--verde-400);
  --accent-strong: var(--verde-300);
  --accent-ink: var(--verde-300);
  --accent-soft: var(--verde-900);
  --accent-glow: rgb(77 189 140 / 0.25);
  --ok: var(--verde-400);
  --ok-soft: var(--verde-900);
  --danger: oklch(69% 0.13 30);
  --danger-soft: oklch(29.5% 0.045 30);
  --wa: oklch(72% 0.14 155);
  --shadow-card:
    0 1px 2px oklch(0% 0 0 / 0.35),
    0 16px 40px -16px oklch(0% 0 0 / 0.55);
  --shadow-pop:
    0 2px 4px oklch(0% 0 0 / 0.4),
    0 26px 60px -20px oklch(0% 0 0 / 0.65);
```

### 5.3 Boton primario por tema (el par se invierte)

- **Claro:** fondo verde-600 + texto blanco → 5.66:1. Hover: fondo 700.
- **Oscuro:** fondo verde-400 + texto tinta `#0C110F` → 8.14:1. Hover: fondo 300.
- El CTA actual del sitio (fondo `--ink` + led verde) tambien es canonico — mas "agencia
  seria" que un boton verde gigante. Ambos patrones son validos; verde-600 pleno se reserva
  para EL cta principal de una vista, maximo uno.

---

## 6. Contraste AA — verificado (WCAG 2.1, script propio)

AA: ≥4.5:1 texto normal · ≥3:1 texto grande y componentes UI. Pares clave:

| Par | Ratio | Veredicto |
|---|---|---|
| verde-600 sobre blanco | 5.66:1 | AA texto ✓ |
| verde-600 sobre papel | 5.45:1 | AA texto ✓ |
| blanco sobre verde-600 (CTA claro) | 5.66:1 | AA ✓ |
| verde-700 sobre papel | 7.25:1 | AA ✓ |
| verde-500 sobre papel | 3.54:1 | SOLO UI/texto grande — por eso 500 = señal, nunca texto chico |
| verde-400 sobre tinta | 8.14:1 | AA ✓ |
| verde-300 sobre tinta | 11.40:1 | AA ✓ |
| ink sobre papel | 16.98:1 | AAA ✓ |
| ink-faint sobre papel | 4.83:1 | AA ✓ |
| texto-dark sobre tinta | 16.45:1 | AAA ✓ |
| texto-dark-faint sobre tinta | 6.14:1 | AA ✓ |
| verde-600 sobre verde-50 (chip) | 5.31:1 | AA ✓ |
| verde del logo `#3EA639` sobre blanco | 3.13:1 | FALLA AA texto — por eso NO es token de UI (§1.4) |

Regla de mantenimiento: ningun token de texto entra al sistema sin su ratio anotado aca.

---

## Apendice — Estado de aplicacion

- Tokens §5 vivos en `src/app/globals.css`; `themeColor` y favicon led cableados en
  `src/app/layout.tsx` / `src/app/icon.svg` (commits `c47ed573`, `a589c045`).
- Wordmark placeholder (led) en header y footer via `components/brand-wordmark.tsx`.
- Motion kit intacto: el retheme fue SOLO valores de tokens; ningun spring/ease tocado.
- Pendiente externo: vector original del logo de Sergio → swap por contrato §4.1.
