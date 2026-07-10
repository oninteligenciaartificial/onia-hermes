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

/**
 * Self-hosted Inter, one Latin variable file (~47kb) covering every weight
 * 100-900. Shipped next to each generated site as ./fonts/inter-latin-var.woff2
 * (the generator copies it), so no runtime request to a third-party font CDN —
 * better performance, privacy, and a clean production CSP. `font-display: swap`
 * keeps text visible while the face loads.
 */
export const fontFaceCss = `@font-face {
  font-family: "Inter";
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url("./fonts/inter-latin-var.woff2") format("woff2");
}`;

export function clientTokenCss(client: ClientTokenInput, selector = ":root"): string {
  const declarations = Object.entries(clientTokenVars(client))
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n");
  const light = `${selector} {\n${declarations}\n}`;

  // The @font-face and dark variant are only emitted for the default :root
  // scope. A scoped (preview) call embeds tokens inside an already-rendered
  // page, so re-declaring the global font-face would duplicate it.
  if (selector !== ":root") {
    return light;
  }

  const darkAuto = Object.entries(clientDarkTokenVars())
    .map(([name, value]) => `    ${name}: ${value};`)
    .join("\n");
  const darkManual = Object.entries(clientDarkTokenVars())
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n");

  return `${fontFaceCss}

${light}

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
  const clean = font.replace(/["'<>]/g, "").trim() || "Inter";
  // "Inter" is always the loaded fallback: a client can name its own family,
  // but unless that face is also self-hosted it degrades to Inter (which is),
  // then to the platform UI sans — never to an unstyled serif.
  return `"${clean}", "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
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
