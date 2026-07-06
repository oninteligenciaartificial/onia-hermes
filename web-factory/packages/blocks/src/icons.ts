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
};

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
