import type { ReactNode } from "react";
import type { LegalBlock } from "@/lib/legal";
import { renderInline } from "./inline";
import styles from "./legal-page.module.css";

/**
 * Render de los bloques legales (Server Component, sin JS al cliente). El
 * inline (negrita, enlaces y correos) vive en `./inline`.
 */

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
