import {
  WEB_DIRECTIONS, WEB_FONTS, WEB_GOALS, WEB_LAYOUTS, WEB_PALETTES,
  type WebConfiguratorSelection,
} from "@/content/web-configurator";
import { WEB_STACKS } from "@/content/webs";

export type PlatformVisualSelection = WebConfiguratorSelection & { readonly version: 1 };
const fields = ["version", "goal", "layout", "direction", "palette", "accent", "font", "stack"];

export function decodePlatformSelection(snapshot: string | null): PlatformVisualSelection | null {
  if (!snapshot || snapshot.length > 1024) return null;
  try {
    const value: unknown = JSON.parse(snapshot);
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const candidate = value as Record<string, unknown>;
    if (Object.keys(candidate).length !== fields.length || Object.keys(candidate).some((key) => !fields.includes(key))) return null;
    if (candidate.version !== 1 || typeof candidate.accent !== "string" || !/^#[0-9A-Fa-f]{6}$/.test(candidate.accent)) return null;
    const sets = { goal: WEB_GOALS, layout: WEB_LAYOUTS, direction: WEB_DIRECTIONS, palette: WEB_PALETTES, font: WEB_FONTS, stack: WEB_STACKS };
    if (Object.entries(sets).some(([key, options]) => !options.some((item) => item.id === candidate[key]))) return null;
    return value as PlatformVisualSelection;
  } catch {
    return null;
  }
}

export function platformRequestUrl(selection: PlatformVisualSelection): string {
  const checked = decodePlatformSelection(JSON.stringify(selection));
  if (!checked) throw new Error("La selección visual no es válida");
  return `https://app.onia.com.bo/mi-web?${new URLSearchParams({ visual: JSON.stringify(checked) })}`;
}
