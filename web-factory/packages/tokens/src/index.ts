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
    "--card": client.colores.bg,
    "--card-foreground": client.colores.fg,
    "--popover": client.colores.bg,
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
export function clientDarkTokenVars(): Record<string, string> {
  return {
    "--color-bg": "#0c1013",
    "--color-fg": "#e7e9ec",
    "--background": "#0c1013",
    "--foreground": "#e7e9ec",
    "--card": "#161c22",
    "--card-foreground": "#e7e9ec",
    "--popover": "#161c22",
    "--popover-foreground": "#e7e9ec",
  };
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

  const darkAuto = Object.entries(clientDarkTokenVars())
    .map(([name, value]) => `    ${name}: ${value};`)
    .join("\n");
  const darkManual = Object.entries(clientDarkTokenVars())
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

function readableTextOn(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.58 ? "#111827" : "#ffffff";
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
