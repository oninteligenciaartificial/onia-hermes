import { Play } from "lucide-react";
import type { CutReview } from "./source";

interface CutPreviewProps {
  review: CutReview;
}

// Scrubber keep/cut: KEEP = esmeralda del acento (se queda); CUT = neutro apagado
// (se corta). No usamos rojo: el rojo del panel es alerta, y un corte no es un
// error, es material removido — el gris apagado lo comunica sin gritar.
const CUT_FILL = "color-mix(in oklch, var(--muted-foreground) 22%, var(--surface-2))";

export function CutPreview({ review }: CutPreviewProps) {
  return (
    <div>
      <div
        className="relative mx-[18px] mt-3.5 overflow-hidden rounded-xl border border-border"
        style={{
          background: "linear-gradient(160deg, color-mix(in oklch, var(--foreground) 12%, var(--card)), var(--surface-2))",
        }}
      >
        <div className="relative flex aspect-video items-center justify-center">
          <span
            className="absolute left-2.5 top-2.5 rounded-md px-2 py-1 text-[10px] font-semibold text-white"
            style={{ background: "oklch(0.24 0.02 250 / 0.72)" }}
          >
            {review.previewLabel}
          </span>
          <button
            type="button"
            aria-label="Reproducir preview del corte"
            className="grid h-[46px] w-[46px] place-items-center rounded-full bg-white/90 shadow-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]"
          >
            <Play size={16} className="ml-0.5" style={{ color: "oklch(0.28 0.02 250)" }} aria-hidden="true" />
          </button>
          <span
            className="absolute bottom-2.5 right-2.5 rounded-md px-2 py-0.5 text-[10.5px] font-semibold tabular-nums text-white"
            style={{ background: "oklch(0.24 0.02 250 / 0.72)" }}
          >
            {review.timeLabel}
          </span>
        </div>
      </div>

      <div className="px-[18px] pb-1 pt-3">
        <div
          className="flex h-3.5 gap-px overflow-hidden rounded-md border border-border"
          role="img"
          aria-label={`Línea de tiempo: verde se queda, gris se corta. Recorte ${review.trimLabel}.`}
        >
          {review.segments.map((seg) => (
            <span
              key={seg.index}
              style={{
                flex: seg.weight,
                background: seg.decision === "keep" ? "var(--primary)" : CUT_FILL,
              }}
            />
          ))}
        </div>
        <div className="mt-2 flex items-center gap-4 text-[10.5px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-primary" aria-hidden="true" />
            Me quedo
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm border border-border" style={{ background: CUT_FILL }} aria-hidden="true" />
            Se corta
          </span>
          <span className="ml-auto tabular-nums">
            Recorte <b className="font-semibold text-foreground">{review.trimLabel}</b>
          </span>
        </div>
      </div>
    </div>
  );
}
