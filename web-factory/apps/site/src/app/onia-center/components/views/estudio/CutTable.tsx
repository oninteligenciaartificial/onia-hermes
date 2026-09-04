import type { CutSegment } from "./source";

interface CutTableProps {
  segments: CutSegment[];
  // false = columna Texto sin truncar (modo foco: se ve la frase completa).
  truncateText?: boolean;
}

export function CutTable({ segments, truncateText = true }: CutTableProps) {
  return (
    <table className="mt-1.5 w-full border-collapse text-[11.5px]">
      <thead>
        <tr>
          {["#", "Tiempo", "Decisión", "Motivo", "Texto"].map((h) => (
            <th
              key={h}
              className="border-b border-border px-[18px] py-2 text-left text-[9.5px] font-semibold uppercase tracking-[0.04em] text-[color:var(--faint)]"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {segments.map((seg) => {
          const isCut = seg.decision === "cut";
          return (
            <tr
              key={`${seg.index}-${seg.timeLabel}`}
              className={`border-b border-[color:var(--line-soft)] transition-colors last:border-b-0 hover:bg-secondary ${
                isCut ? "text-muted-foreground" : ""
              }`}
            >
              <td className="w-5 px-[18px] py-2.5 align-top font-semibold tabular-nums text-[color:var(--faint)]">
                {seg.index}
              </td>
              <td className="whitespace-nowrap px-[18px] py-2.5 align-top font-mono text-[10.5px] tabular-nums">
                {seg.timeLabel}
              </td>
              <td className="px-[18px] py-2.5 align-top">
                {isCut ? (
                  <span className="inline-flex items-center rounded-[5px] border border-border bg-[color:var(--surface-2)] px-1.5 py-0.5 text-[9.5px] font-bold tracking-[0.03em] text-muted-foreground">
                    CUT
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-[5px] px-1.5 py-0.5 text-[9.5px] font-bold tracking-[0.03em] onia-center-tone-green">
                    KEEP
                  </span>
                )}
              </td>
              <td className="px-[18px] py-2.5 align-top text-[11px]">{seg.reason}</td>
              <td
                className={`px-[18px] py-2.5 align-top text-[10.5px] text-[color:var(--faint)] ${isCut ? "italic" : ""} ${
                  truncateText ? "max-w-[150px] truncate" : ""
                }`}
                title={truncateText ? seg.fullText ?? seg.text : undefined}
              >
                {truncateText ? seg.text : seg.fullText ?? seg.text}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
