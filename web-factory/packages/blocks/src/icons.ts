// Small inline SVG icon set (lucide-style paths, MIT-derived). stroke uses
// currentColor so icons inherit token colors, and inline SVG keeps the static
// output at 0kb JS. Unknown names fall back to a check mark.
const ICONS: Record<string, string> = {
  "map-pin": '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  star: '<path d="M11.5 2.8a.6.6 0 0 1 1 0l2.3 4.9 5.4.8a.6.6 0 0 1 .3 1l-3.9 3.8.9 5.4a.6.6 0 0 1-.9.6L12 17l-4.8 2.5a.6.6 0 0 1-.9-.6l.9-5.4-3.9-3.8a.6.6 0 0 1 .3-1l5.4-.8z"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>',
  "shield-check": '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
  sparkles: '<path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"/><path d="M18.5 14.5l.6 1.7 1.7.6-1.7.6-.6 1.7-.6-1.7-1.7-.6 1.7-.6z"/>',
  smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01"/><path d="M15 9h.01"/>',
  tooth: '<path d="M7 3c1.6 0 2.2 1 5 1s3.4-1 5-1c1.8 0 3 1.4 3 4 0 4-2 9-3.5 12-.5 1-1.6 1-1.9-.2l-.8-3.6c-.2-.9-1.4-.9-1.6 0l-.8 3.6c-.3 1.2-1.4 1.2-1.9.2C6.5 16 4.5 11 4.5 7 4.5 4.4 5.6 3 7 3z"/>',
  alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 7v5l3 2"/>',
  message: '<path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  "arrow-right": '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  // Names that data/clients/*.json actually uses. Without these, renderIcon
  // silently fell back to `check` for 10 of the 17 names in the corpus, which
  // renders three identical ticks on a services grid.
  calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
  chart: '<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  drafting: '<circle cx="12" cy="5" r="2"/><path d="m12.99 6.74 1.93 3.44"/><path d="M19.14 12a10 10 0 0 1-14.28 0"/><path d="m21 21-2.16-3.84"/><path d="m3 21 8.02-14.26"/>',
  grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/>',
  layout: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  stethoscope: '<path d="M11 2v2"/><path d="M5 2v2"/><path d="M5 4H4a2 2 0 0 0-2 2v3a6 6 0 0 0 12 0V6a2 2 0 0 0-2-2h-1"/><path d="M8 15a6 6 0 0 0 12 0v-3"/><circle cx="20" cy="10" r="2"/>',
  utensils: '<path d="M3 2v7a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V2"/><path d="M5.5 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6a2 2 0 0 0 2 2h3Zm0 0v7"/>',
};

// Unknown names fall back to `check` silently, which is fine at render time but
// hides a data/icon-set mismatch. Exposed so a test can assert the set covers
// the names the client data actually ships.
export function hasIcon(name: string): boolean {
  return name in ICONS;
}

export function renderIcon(name: string, className = "wf-icon"): string {
  const path = ICONS[name] ?? ICONS.check;
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
}

// Pick a credential icon by keyword so trust items feel specific, not generic.
export function pickCredencialIcon(text: string): string {
  const t = text.toLowerCase();
  if (/(matr[ií]cula|colegiad|licencia|t[ií]tulo)/.test(t)) return "award";
  if (/(esteril|higien|bioseg|seguridad)/.test(t)) return "shield-check";
  if (/(urgenc|mismo d[ií]a|guardia|dolor)/.test(t)) return "activity";
  if (/(a[ñn]os|experien|trayect)/.test(t)) return "star";
  if (/(pago|plan|financ|cuota)/.test(t)) return "clock";
  return "check";
}
