import type { EditorProject, EditorProjectAction } from "./source";
import { SurfaceCard } from "../../ui/SurfaceCard";
import { Badge } from "../../ui/Badge";

interface VideoProjectsTableProps {
  projects: EditorProject[];
  onOpenCuts: (reviewId: string) => void;
}

const ACTION_CLASS: Record<EditorProjectAction["kind"], string> = {
  gate: "text-[color:var(--gate-strong)] hover:bg-[color:var(--gate-wash)]",
  primary: "text-primary hover:bg-[color:var(--accent-wash)]",
  muted: "text-muted-foreground hover:bg-secondary",
};

function Duration({ project }: { project: EditorProject }) {
  if (!project.durationFromLabel && !project.durationToLabel) {
    return <span className="text-[color:var(--faint)]">—</span>;
  }
  return (
    <span className="inline-flex items-center gap-1.5 tabular-nums">
      {project.durationFromLabel ? (
        <>
          <span className="text-[color:var(--faint)] line-through decoration-1">{project.durationFromLabel}</span>
          <span className="text-[color:var(--faint)]" aria-hidden="true">
            →
          </span>
        </>
      ) : null}
      {project.durationToLabel ? <span className="font-semibold text-foreground">{project.durationToLabel}</span> : null}
      {project.deltaLabel ? (
        <span className="rounded-[5px] px-1.5 py-px text-[10.5px] font-semibold tabular-nums onia-center-tone-green">
          {project.deltaLabel}
        </span>
      ) : null}
    </span>
  );
}

export function VideoProjectsTable({ projects, onOpenCuts }: VideoProjectsTableProps) {
  return (
    <SurfaceCard
      title="Proyectos de video"
      subtitle="Crudo, estado y duración original → final por pieza"
      action={
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-semibold tabular-nums text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
          {projects.length} activos
        </span>
      }
      contentClassName="p-0"
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[12.5px]">
          <thead>
            <tr>
              {["Proyecto", "Carril", "Estado", "Duración"].map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap border-b border-border bg-[color:var(--surface-2)] px-4 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.04em] text-[color:var(--faint)]"
                >
                  {h}
                </th>
              ))}
              <th className="whitespace-nowrap border-b border-border bg-[color:var(--surface-2)] px-4 py-2.5 text-right text-[10.5px] font-semibold uppercase tracking-[0.04em] text-[color:var(--faint)]">
                Créditos
              </th>
              <th className="border-b border-border bg-[color:var(--surface-2)] px-4 py-2.5">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr
                key={project.id}
                className="border-b border-[color:var(--line-soft)] transition-colors last:border-b-0 hover:bg-secondary"
              >
                <td className="px-4 py-3 align-middle">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold tracking-[-0.005em] text-foreground">{project.title}</span>
                    <span className="text-[11px] text-[color:var(--faint)]">{project.rawLabel}</span>
                  </div>
                </td>
                <td className="px-4 py-3 align-middle text-[11px] font-semibold text-muted-foreground">
                  {project.laneLabel}
                </td>
                <td className="px-4 py-3 align-middle">
                  <Badge tone={project.tone}>{project.statusLabel}</Badge>
                </td>
                <td className="px-4 py-3 align-middle">
                  <Duration project={project} />
                </td>
                <td className="px-4 py-3 text-right align-middle">
                  <span
                    className="tabular-nums"
                    style={project.credits ? undefined : { color: "var(--faint)" }}
                  >
                    {project.credits === null ? "—" : project.credits}
                  </span>
                </td>
                <td className="px-4 py-3 text-right align-middle">
                  <button
                    type="button"
                    onClick={
                      project.action.kind === "gate" && project.cutReviewId
                        ? () => onOpenCuts(project.cutReviewId as string)
                        : undefined
                    }
                    className={`inline-flex min-h-[32px] items-center whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[11.5px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[color:var(--ring)] ${ACTION_CLASS[project.action.kind]}`}
                  >
                    {project.action.label}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SurfaceCard>
  );
}
