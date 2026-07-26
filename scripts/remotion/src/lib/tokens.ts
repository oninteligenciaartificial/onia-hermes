// Tokens de diseño compartidos por las 5 composiciones.
//
// MISMOS valores que .claude/skills/editor-videos/scripts/make-mockup.mjs (función
// baseCss): ink/ink2/text/muted/hairline/gloss del tema oscuro, y acento naranja
// #FF7A00 ("estilo Santiago") como default. Un apoyo animado (Remotion) y su
// versión estática (make-mockup) tienen que convivir en el mismo reel sin
// desentonar — por eso NO se inventa paleta nueva acá.
export type ThemeMode = "dark" | "light";

export interface DesignTokens {
  ink: string;
  ink2: string;
  text: string;
  muted: string;
  hairline: string;
  gloss: string;
  accent: string;
  accentDeep: string;
}

export function tokens(accent: string, mode: ThemeMode = "dark"): DesignTokens {
  const dark = mode !== "light";
  return {
    ink: dark ? "#0A0C11" : "#FFFFFF",
    ink2: dark ? "#15181F" : "#F4F5F7",
    text: dark ? "#F6F8FB" : "#0B0D12",
    muted: dark ? "rgba(246,248,251,0.60)" : "rgba(11,13,18,0.58)",
    hairline: dark ? "rgba(255,255,255,0.11)" : "rgba(11,13,18,0.10)",
    gloss: dark ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.85)",
    accent,
    accentDeep: mix(accent, "#000000", 0.38),
  };
}

/** Escala 1 unidad = width/1000, igual convención que --u en make-mockup.mjs.
 *  Cambiar --width escala la pieza entera sin re-tunear tipografías. */
export function u(width: number, n: number): number {
  return (width / 1000) * n;
}

/** Sombra de tarjeta (misma curva que --shadow en make-mockup.mjs). */
export function cardShadow(width: number): string {
  const w = width / 1000;
  return [
    `0 ${46 * w}px ${96 * w}px ${-24 * w}px rgba(0,0,0,0.62)`,
    `0 ${10 * w}px ${26 * w}px rgba(0,0,0,0.32)`,
  ].join(", ");
}

/** Mismo stack de fuentes que make-mockup.mjs: solo fuentes del sistema, cero red
 * (determinista, sin depender de que Chromium descargue nada). */
export const FONT_STACK =
  'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

function mix(hex: string, towards: string, amount: number): string {
  const a = hexToRgb(hex);
  const b = hexToRgb(towards);
  const lerp = (x: number, y: number) => Math.round(x + (y - x) * amount);
  return rgbToHex(lerp(a.r, b.r), lerp(a.g, b.g), lerp(a.b, b.b));
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  const full = h.length === 3
    ? h.split("").map((c) => c + c).join("")
    : h.padEnd(6, "0");
  const num = parseInt(full.slice(0, 6), 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  return (
    "#" +
    [clamp(r), clamp(g), clamp(b)]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
  );
}
