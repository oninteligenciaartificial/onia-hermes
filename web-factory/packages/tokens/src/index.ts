export type ClientTokenInput = {
  colores: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
    fg: string;
  };
  tipografia: {
    heading: string;
    body: string;
  };
};

export function clientTokenVars(client: ClientTokenInput): Record<string, string> {
  const onPrimary = readableTextOn(client.colores.primary);

  return {
    "--color-primary": client.colores.primary,
    "--color-secondary": client.colores.secondary,
    "--color-accent": client.colores.accent,
    "--color-bg": client.colores.bg,
    "--color-fg": client.colores.fg,
    "--color-on-primary": onPrimary,
    "--font-heading": fontStack(client.tipografia.heading),
    "--font-body": fontStack(client.tipografia.body),
    "--background": client.colores.bg,
    "--foreground": client.colores.fg,
    "--primary": client.colores.primary,
    "--primary-foreground": onPrimary,
    "--secondary": client.colores.secondary,
    "--secondary-foreground": readableTextOn(client.colores.secondary),
    "--accent": client.colores.accent,
    "--accent-foreground": readableTextOn(client.colores.accent),
    // La tarjeta NO puede ser el mismo color que la pagina. Medido en el
    // dashboard (2026-08-30): `--card` era exactamente `--color-bg`, o sea 1,00:1
    // contra el fondo — la tarjeta era invisible y toda la separacion la cargaba
    // un borde de pelo. El sistema de capas existia solo en oscuro, donde `--card`
    // (#161c22) si difiere del fondo (#0c1013). Un 3% del fg alcanza para que la
    // superficie se lea como capa sin ensuciar la marca, y funciona con cualquier
    // color de cliente (claro u oscuro), que es lo que un valor fijo no haria.
    "--card": "color-mix(in oklab, var(--color-fg) 3%, var(--color-bg))",
    "--card-foreground": client.colores.fg,
    "--popover": "color-mix(in oklab, var(--color-fg) 3%, var(--color-bg))",
    "--popover-foreground": client.colores.fg,
    "--muted": "color-mix(in srgb, var(--color-fg) 7%, var(--color-bg))",
    "--muted-foreground": "color-mix(in srgb, var(--color-fg) 68%, var(--color-bg))",
    "--border": "color-mix(in srgb, var(--color-fg) 14%, transparent)",
    "--input": "color-mix(in srgb, var(--color-fg) 14%, transparent)",
    "--ring": client.colores.primary,
    "--radius": "0.75rem",
  };
}

/**
 * Neutral dark-mode surface overrides. Only bg/fg and the direct surface vars
 * are swapped; everything derived from --color-fg/--color-bg via color-mix
 * (muted, border, input, muted-foreground) re-resolves automatically in the
 * dark scope thanks to lazy var() substitution, and brand colors stay intact.
 */
const DARK_BG = "#0c1013";
const DARK_FG = "#e7e9ec";

/**
 * Tokens del modo oscuro.
 *
 * OJO — el bug que esto arregla: antes solo se cambiaban bg/fg/card/popover, y
 * `--color-secondary` / `--color-primary` se quedaban con el valor de la marca
 * pensado para fondo CLARO. En 5 de las 11 fichas de cliente el `secondary` ES
 * el `fg` (un azul casi negro, #0f172a), asi que en oscuro los titulos salian
 * negro sobre negro: contraste **1,05:1**, texto invisible en un sitio de
 * cliente publicado. La plantilla `landing` colorea con `--color-secondary` los
 * titulos de features, proof y proceso.
 *
 * Ahora la marca se respeta MIENTRAS se lea; si no alcanza el contraste sobre el
 * fondo oscuro, ese token cae al color de texto del modo oscuro. No se aplana el
 * diseno de los clientes cuyo color SI se lee.
 */
export function clientDarkTokenVars(client?: ClientTokenInput): Record<string, string> {
  const base: Record<string, string> = {
    "--color-bg": DARK_BG,
    "--color-fg": DARK_FG,
    "--background": DARK_BG,
    "--foreground": DARK_FG,
    "--card": "#161c22",
    "--card-foreground": DARK_FG,
    "--popover": "#161c22",
    "--popover-foreground": DARK_FG,
  };
  if (!client) return base;

  // 4.5:1 es el minimo de WCAG AA para texto normal.
  const legible = (color: string) => contrastRatio(color, DARK_BG) >= 4.5;
  if (!legible(client.colores.secondary)) {
    base["--color-secondary"] = DARK_FG;
    base["--secondary"] = DARK_FG;
    base["--secondary-foreground"] = DARK_BG;
  }
  if (!legible(client.colores.primary)) {
    // La marca se ACLARA, no se borra. Antes esto ponia DARK_FG directo y el
    // panel perdia la identidad en oscuro: sidebar activo, boton, celda KPI hero
    // y barras salian BLANCOS (visto mirando el dashboard, 2026-08-30). Subir la
    // L en HSL conserva hue y saturacion, asi que un verde sigue siendo verde.
    // DARK_FG queda de ultimo recurso para las marcas acromaticas, donde aclarar
    // no produce color: ahi el blanco es lo unico legible.
    const claro = lightenUntilLegible(client.colores.primary);
    base["--color-primary"] = claro;
    base["--primary"] = claro;
    base["--primary-foreground"] = DARK_BG;
    // El par completo, o el arreglo crea otro invisible: `--color-on-primary` es
    // el token que usan los BOTONES solidos (background primary + color
    // on-primary). Si el primary se cambia a DARK_FG y el on-primary se queda en
    // el #ffffff calculado para el color claro, el boton queda blanco sobre casi
    // blanco: 1,21:1, ilegible. Es exactamente lo que axe encontraba en 93 nodos
    // de la landing demo en oscuro. `--ring` sigue al primary por el mismo motivo
    // (el foco tiene que verse sobre el fondo oscuro).
    base["--color-on-primary"] = readableTextOn(claro);
    base["--ring"] = claro;
  }
  return base;
}

/**
 * Sube la luminosidad HSL del color hasta que pase 4.5:1 contra el fondo oscuro,
 * conservando hue y saturacion (un verde de marca sigue leyendose verde).
 * Devuelve DARK_FG si ni el maximo alcanza: pasa con marcas acromaticas
 * (negro/gris puro), donde aclarar no produce color y el blanco es lo unico legible.
 */
function lightenUntilLegible(hex: string): string {
  const [h, s, l] = hexToHsl(hex);
  if (s === 0) return DARK_FG; // acromatico: aclararlo da gris, no marca
  for (let paso = l; paso <= 0.96; paso += 0.02) {
    const candidato = hslToHex(h, s, paso);
    // Dos gates, no uno: el color tiene que leerse sobre el fondo oscuro Y
    // aguantar su propia tinta encima. Parar en el primero que pasa contra el
    // fondo dejaba el boton solido en 4,42:1 — apenas debajo, invisible al ojo
    // pero un fallo de AA que axe reporta. Lo encontro el test, no la revision.
    if (
      contrastRatio(candidato, DARK_BG) >= 4.5 &&
      contrastRatio(readableTextOn(candidato), candidato) >= 4.5
    ) {
      return candidato;
    }
  }
  return DARK_FG;
}

function hexToHsl(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255) as [number, number, number];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const l = (max + min) / 2;
  if (delta === 0) return [0, 0, l];
  const s = delta / (1 - Math.abs(2 * l - 1));
  const h =
    max === r ? ((g - b) / delta) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4;
  return [(((h * 60) % 360) + 360) % 360, s, l];
}

function hslToHex(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const sector = Math.floor(h / 60) % 6;
  const [r, g, b] = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
  ][sector] as [number, number, number];
  const canal = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${canal(r)}${canal(g)}${canal(b)}`;
}

/** Contraste WCAG entre dos colores hex (1 = identicos, 21 = negro sobre blanco). */
function contrastRatio(hexA: string, hexB: string): number {
  const lum = (hex: string) => {
    const canal = (valor: number) => {
      const s = valor / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    const [r, g, b] = hexToRgb(hex);
    return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
  };
  const a = lum(hexA);
  const b = lum(hexB);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export function clientTokenCss(client: ClientTokenInput, selector = ":root"): string {
  const declarations = Object.entries(clientTokenVars(client))
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n");
  const light = `${selector} {\n${declarations}\n}`;

  // The dark variant is only emitted for the default :root scope. It follows the
  // OS preference (unless the user forced light) and honors an explicit
  // [data-theme="dark"] on <html> for a manual toggle.
  if (selector !== ":root") {
    return light;
  }

  const darkAuto = Object.entries(clientDarkTokenVars(client))
    .map(([name, value]) => `    ${name}: ${value};`)
    .join("\n");
  const darkManual = Object.entries(clientDarkTokenVars(client))
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n");

  return `${light}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${darkAuto}
  }
}

[data-theme="dark"] {
${darkManual}
}`;
}

export function clientTokenStyle(client: ClientTokenInput): Record<string, string> {
  return clientTokenVars(client);
}

function fontStack(font: string): string {
  const clean = font.replace(/["'<>]/g, "").trim() || "Onest";
  return `"${clean}", "Onest", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
}

/**
 * Ink for text sitting ON a brand color (solid buttons: background --color-primary
 * + color --color-on-primary).
 *
 * Se elige por CONTRASTE WCAG real, no por un promedio de canales. La version
 * anterior comparaba una luminancia sin correccion gamma contra 0.58, y en los
 * tonos medios se equivocaba: con un azul de marca #3D7DFF elegia blanco, que da
 * **3,77:1** — texto ilegible en el CTA principal, mientras la tinta oscura daba
 * 5,4:1. Nadie lo veia porque axe devuelve "incomplete" (no "violation") cuando
 * el boton vive sobre un fondo con gradiente, asi que el gate pasaba en verde.
 */
function readableTextOn(hex: string): string {
  const dark = "#111827";
  return contrastRatio(hex, dark) > contrastRatio(hex, "#ffffff") ? dark : "#ffffff";
}

function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((part) => `${part}${part}`)
          .join("")
      : normalized;

  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
  ];
}
