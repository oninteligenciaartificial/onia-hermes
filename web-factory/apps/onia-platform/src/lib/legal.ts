/**
 * Cargador de documentos legales (src/content/legal/*.md).
 *
 * Los borradores legales viven como Markdown (fuente unica, se entregan tal
 * cual al abogado) y aca se convierten en bloques tipados que renderiza
 * <LegalArticle>. Parser minimo y deliberado: solo cubre lo que esos
 * documentos usan (frontmatter, h2, parrafos, listas, tablas, blockquotes,
 * hr, **negrita** y [links](...)) — sin dependencias nuevas.
 *
 * Solo importar desde Server Components (usa node:fs en build).
 */

import fs from "node:fs";
import path from "node:path";

export interface LegalMeta {
  title: string;
  slug: string;
  status: string;
  version: string;
  updatedAt: string;
}

export interface LegalTocEntry {
  id: string;
  text: string;
}

export type LegalBlock =
  | { kind: "h2"; id: string; text: string }
  | { kind: "p"; text: string; lead: boolean }
  | { kind: "list"; items: string[] }
  | { kind: "notice"; text: string }
  | { kind: "table"; header: string[]; rows: string[][] }
  | { kind: "hr" };

export interface LegalDoc {
  meta: LegalMeta;
  blocks: LegalBlock[];
  toc: LegalTocEntry[];
}

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "legal");

/** Quita diacriticos combinantes (U+0300..U+036F) tras normalizar a NFD. */
function stripDiacritics(text: string): string {
  let out = "";
  for (const ch of text.normalize("NFD")) {
    const code = ch.charCodeAt(0);
    if (code < 0x0300 || code > 0x036f) {
      out += ch;
    }
  }
  return out;
}

function slugify(text: string): string {
  return stripDiacritics(text)
    .toLowerCase()
    .replace(/^\d+\.\s*/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseFrontmatter(lines: string[]): { meta: LegalMeta; bodyStart: number } {
  const meta: Record<string, string> = {};
  let bodyStart = 0;
  if (lines[0]?.trim() === "---") {
    for (let i = 1; i < lines.length; i += 1) {
      const line = lines[i];
      if (line.trim() === "---") {
        bodyStart = i + 1;
        break;
      }
      const match = /^([A-Za-z]+):\s*"?([^"]*)"?\s*$/.exec(line);
      if (match) {
        meta[match[1]] = match[2];
      }
    }
  }
  return {
    meta: {
      title: meta.title ?? "",
      slug: meta.slug ?? "",
      status: meta.status ?? "borrador",
      version: meta.version ?? "0.1",
      updatedAt: meta.updatedAt ?? "",
    },
    bodyStart,
  };
}

function splitTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isTableSeparator(line: string): boolean {
  return /^\|?[\s:-]+\|[\s|:-]*$/.test(line.trim());
}

/** Convierte el cuerpo Markdown en bloques tipados. */
function parseBlocks(lines: string[]): LegalBlock[] {
  const blocks: LegalBlock[] = [];
  let paragraph: string[] = [];
  let sawH2 = false;

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({ kind: "p", text: paragraph.join(" "), lead: !sawH2 });
      paragraph = [];
    }
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === "") {
      flushParagraph();
      i += 1;
      continue;
    }

    if (trimmed.startsWith("# ") && !trimmed.startsWith("## ")) {
      // El h1 del Markdown no se renderiza: el hero de la pagina pone el titulo.
      flushParagraph();
      i += 1;
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushParagraph();
      const text = trimmed.slice(3).trim();
      sawH2 = true;
      blocks.push({ kind: "h2", id: slugify(text), text });
      i += 1;
      continue;
    }

    if (trimmed.startsWith(">")) {
      flushParagraph();
      const quote: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quote.push(lines[i].trim().replace(/^>\s?/, ""));
        i += 1;
      }
      blocks.push({ kind: "notice", text: quote.join(" ").trim() });
      continue;
    }

    if (trimmed.startsWith("- ")) {
      flushParagraph();
      const items: string[] = [];
      while (i < lines.length) {
        const itemLine = lines[i];
        if (itemLine.trim().startsWith("- ")) {
          items.push(itemLine.trim().slice(2).trim());
          i += 1;
        } else if (/^\s{2,}\S/.test(itemLine) && items.length > 0) {
          items[items.length - 1] = `${items[items.length - 1]} ${itemLine.trim()}`;
          i += 1;
        } else {
          break;
        }
      }
      blocks.push({ kind: "list", items });
      continue;
    }

    if (trimmed.startsWith("|")) {
      flushParagraph();
      const header = splitTableRow(trimmed);
      const rows: string[][] = [];
      i += 1;
      if (i < lines.length && isTableSeparator(lines[i])) {
        i += 1;
      }
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(splitTableRow(lines[i]));
        i += 1;
      }
      blocks.push({ kind: "table", header, rows });
      continue;
    }

    if (/^-{3,}$/.test(trimmed)) {
      flushParagraph();
      blocks.push({ kind: "hr" });
      i += 1;
      continue;
    }

    paragraph.push(trimmed);
    i += 1;
  }

  flushParagraph();
  return blocks;
}

/** Carga y parsea un documento legal por slug ("terminos" | "privacidad"). */
export function loadLegalDoc(slug: string): LegalDoc {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, `${slug}.md`), "utf8");
  const lines = raw.split(/\r?\n/);
  const { meta, bodyStart } = parseFrontmatter(lines);
  let blocks = parseBlocks(lines.slice(bodyStart));

  // El primer blockquote del Markdown repite el aviso de borrador que el hero
  // de la pagina ya muestra con diseño propio: se omite para no duplicar.
  if (blocks[0]?.kind === "notice") {
    blocks = blocks.slice(1);
  }

  const toc: LegalTocEntry[] = blocks
    .filter((block): block is Extract<LegalBlock, { kind: "h2" }> => block.kind === "h2")
    .map((block) => ({ id: block.id, text: block.text }));

  return { meta, blocks, toc };
}

const MONTHS_ES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
] as const;

/** "2026-07-25" → "25 de julio de 2026" (sin depender del locale del runtime). */
export function formatLegalDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) {
    return iso;
  }
  const month = MONTHS_ES[Number(match[2]) - 1] ?? iso;
  return `${Number(match[3])} de ${month} de ${match[1]}`;
}
