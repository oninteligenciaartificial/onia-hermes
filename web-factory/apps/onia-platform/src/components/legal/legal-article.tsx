import type { ReactNode } from "react";
import type { LegalBlock } from "@/lib/legal";
import styles from "./legal-page.module.css";

/**
 * Render de los bloques legales (Server Component, sin JS al cliente).
 * Inline soportado: **negrita** y [texto](url) — lo unico que usan los
 * documentos de src/content/legal.
 */

const INLINE_RE = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const match of text.matchAll(INLINE_RE)) {
    const index = match.index ?? 0;
    if (index > last) {
      nodes.push(text.slice(last, index));
    }
    if (match[1] !== undefined) {
      nodes.push(<strong key={`b${key}`}>{match[1]}</strong>);
    } else {
      nodes.push(
        <a key={`a${key}`} href={match[3]}>
          {match[2]}
        </a>,
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

function renderBlock(block: LegalBlock, index: number): ReactNode {
  switch (block.kind) {
    case "h2":
      return (
        <h2 key={index} id={block.id} className={styles.h2}>
          {block.text}
        </h2>
      );
    case "p":
      return (
        <p key={index} className={block.lead ? styles.leadP : styles.p}>
          {renderInline(block.text)}
        </p>
      );
    case "list":
      return (
        <ul key={index} className={styles.list}>
          {block.items.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ul>
      );
    case "notice":
      return (
        <aside key={index} className={styles.notice} role="note">
          {renderInline(block.text)}
        </aside>
      );
    case "table":
      return (
        <div key={index} className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                {block.header.map((cell, i) => (
                  <th key={i} scope="col">
                    {renderInline(cell)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c}>{renderInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "hr":
      return <hr key={index} className={styles.hr} />;
    default:
      return null;
  }
}

export function LegalArticle({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <article className={styles.article}>
      {blocks.map((block, index) => renderBlock(block, index))}
    </article>
  );
}
