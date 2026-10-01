import { createElement, type ReactNode } from "react";

/**
 * Inline de los documentos legales. Soportado: **negrita**, [texto](url) y correos sueltos — lo unico que
 * usan los documentos de src/content/legal.
 *
 * ⚠️ Un correo NUNCA queda pegado a otro texto en el mismo nodo (2026-10-01).
 * Cloudflare (Email Address Obfuscation) reescribe cada correo del HTML como
 * `<a class="__cf_email__">[email protected]</a>`, y su script lo vuelve a texto
 * ANTES de hidratar, pero como un nodo de texto APARTE. Una celda que decía
 * «…llega a business@onia.com.bo» quedaba partida en dos nodos donde React
 * esperaba uno: React error #418 en /privacidad, desktop y móvil. Cada correo
 * sale como su propio `<a href="mailto:">`, igual que el pie (que nunca falló):
 * el texto decodificado es el único hijo del enlace y la hidratación coincide.
 */

const INLINE_RE =
  /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)|([A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,})/g;

export function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const match of text.matchAll(INLINE_RE)) {
    const index = match.index ?? 0;
    if (index > last) {
      nodes.push(text.slice(last, index));
    }
    if (match[1] !== undefined) {
      nodes.push(createElement("strong", { key: `b${key}` }, ...renderInline(match[1])));
    } else if (match[4] !== undefined) {
      nodes.push(
        createElement("a", { key: `m${key}`, href: `mailto:${match[4]}` }, match[4]),
      );
    } else {
      nodes.push(
        createElement("a", { key: `a${key}`, href: match[3] }, match[2]),
      );
    }
    last = index + match[0].length;
    key += 1;
  }
  if (last < text.length) {
    nodes.push(text.slice(last));
  }
  return nodes;
}
