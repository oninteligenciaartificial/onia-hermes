import Link from "next/link";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  Clapperboard,
  Clock,
  Coins,
  Factory,
  Film,
  Gauge,
  ListChecks,
  Play,
  Ratio,
  ShieldCheck,
  Sparkles,
  Terminal,
  UserCheck,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import "../onia-center.css";
import { MotionArticle, MotionReveal } from "../web-factory/motion-shell";
import { getVideoLabSnapshot, type VideoLabJob, type VideoLabStatus } from "./source";

export const dynamic = "force-static";

export const metadata = {
  title: "Video Lab | ONIA Center",
};

export default async function VideoLabCenterPage() {
  const snapshot = await getVideoLabSnapshot();

  return (
    <main className="onia-center-page onia-videolab-page">
      <aside className="onia-center-sidebar">
        <div className="onia-brand">
          <span>
            <Clapperboard size={20} />
          </span>
          <div>
            <strong>Video Lab</strong>
            <small>Fábrica de video</small>
          </div>
        </div>

        <nav className="onia-nav" aria-label="Navegacion Video Lab">
          <div className="onia-nav-group">
            <span>Modulo</span>
            <Link href="/onia-center">
              <ArrowLeft size={15} />
              <span>ONIA Center</span>
              <small>Volver</small>
            </Link>
            <Link className="is-active" href="/onia-center/video-lab" aria-current="page">
              <Clapperboard size={15} />
              <span>Video Lab</span>
              <small>Operativo</small>
            </Link>
            <Link href="/onia-center/web-factory">
              <Factory size={15} />
              <span>Web Factory</span>
              <small>Modulo</small>
            </Link>
          </div>

          <div className="onia-nav-group">
            <span>Jobs</span>
            {snapshot.jobs.map((job) => (
              <a href={`#job-${job.id}`} key={job.id}>
                <Film size={15} />
                <span>{job.title}</span>
                <small>{job.statusLabel}</small>
              </a>
            ))}
          </div>
        </nav>
      </aside>

      <section className="onia-center-main">
        <header className="onia-hero">
          <div>
            <span className="onia-eyebrow">ONIA Center / IA y automatizacion</span>
            <h1>Video Lab operativo</h1>
            <p>
              Cada pieza de video pasa por aquí: brief, generación con Higgsfield, preview y aprobación.
              La fábrica produce; el Video Lab es la única fuente de estado y nada se publica solo.
            </p>
          </div>
          <div className="onia-hero-actions">
            <Link href="/onia-center/web-factory">
              <Factory size={16} />
              Web Factory
            </Link>
            <Link href="/onia-center?view=integraciones">
              <Workflow size={16} />
              Integraciones
            </Link>
          </div>
        </header>

        <MotionReveal className="onia-active-module onia-videolab-metrics" ariaLabel="Estado general Video Lab">
          <MetricCard icon={Film} label="Jobs" value={String(snapshot.counts.total)} detail="Piezas en el Video Lab" />
          <MetricCard icon={Clock} label="En espera" value={String(snapshot.counts.waiting)} detail="Pendientes de aprobación o cambios" />
          <MetricCard icon={Play} label="Generando" value={String(snapshot.counts.generating)} detail="Higgsfield produciendo (async)" />
          <MetricCard icon={BadgeCheck} label="Listos" value={String(snapshot.counts.ready)} detail="Preview a revisar / publicar" />
          <MetricCard icon={Coins} label="Créditos est." value={String(snapshot.counts.creditsEstimated)} detail="Suma estimada de la cola" />
        </MotionReveal>

        <MotionReveal className="onia-panel onia-videolab-lanes-panel">
          <SectionHeader
            icon={Workflow}
            eyebrow="Líneas de producción"
            title="Tres lanes con distinta autonomía"
            description="Cada lane define hasta dónde genera sola la fábrica antes de que un humano intervenga."
          />
          <div className="onia-videolab-lanes">
            {snapshot.lanes.map((lane) => (
              <article key={lane.id} className={`onia-videolab-lane is-${lane.id}`}>
                <div className="onia-videolab-lane__head">
                  <strong>{lane.label}</strong>
                  <span>{lane.jobCount} jobs</span>
                </div>
                <p>{lane.blurb}</p>
              </article>
            ))}
          </div>
        </MotionReveal>

        <MotionReveal className="onia-panel onia-videolab-pipeline-panel">
          <SectionHeader
            icon={Gauge}
            eyebrow="Pipeline"
            title="De brief a publicación"
            description="Estados reales del Video Lab. La generación es asíncrona y la publicación siempre requiere aprobación."
          />
          <ol className="onia-videolab-pipeline">
            {snapshot.pipeline.map((step, index) => (
              <li key={step.status}>
                <span className="onia-videolab-pipeline__num">{index + 1}</span>
                <div>
                  <strong>{step.label}</strong>
                  <p>{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </MotionReveal>

        <MotionReveal className="onia-webfactory-grid onia-videolab-grid" ariaLabel="Jobs del Video Lab">
          {snapshot.jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </MotionReveal>

        <MotionReveal className="onia-panel onia-videolab-safety">
          <SectionHeader
            icon={ShieldCheck}
            eyebrow="Reglas duras"
            title="Qué protege el Video Lab"
            description="La velocidad no rompe estas reglas: se aplican en cada job, en cada lane."
          />
          <ul className="onia-videolab-safety-list">
            {snapshot.safety.map((rule) => (
              <li key={rule}>
                <ShieldCheck size={15} />
                <span>{rule}</span>
              </li>
            ))}
          </ul>

          <div className="onia-videolab-commands">
            {snapshot.commands.map((command) => (
              <article key={command.command}>
                <span>
                  <Terminal size={14} />
                  {command.label}
                </span>
                <code>{command.command}</code>
                <p>{command.purpose}</p>
              </article>
            ))}
          </div>

          <div className="onia-videolab-footnote">
            <small>Fuente de estado: {snapshot.videoLabRoot}</small>
            <small>Última lectura: {formatDate(snapshot.generatedAt)}</small>
          </div>
        </MotionReveal>
      </section>
    </main>
  );
}

function JobCard({ job }: { job: VideoLabJob }) {
  return (
    <MotionArticle className={`onia-panel onia-videolab-job is-${job.status}`} id={`job-${job.id}`}>
      <div className={`onia-videolab-preview is-${job.lane}`}>
        {job.previewUrl ? (
          <video src={job.previewUrl} controls playsInline preload="none" />
        ) : (
          <div className="onia-videolab-preview__placeholder">
            <Play size={22} aria-hidden="true" />
            <p>{job.thumbnailHint}</p>
          </div>
        )}
        <span className="onia-videolab-preview__lane">{laneLabel(job.lane)}</span>
      </div>

      <div className="onia-videolab-job__head">
        <div>
          <span>{job.format} / {job.lane}</span>
          <h2>{job.title}</h2>
        </div>
        <StatusPill status={job.status}>{job.statusLabel}</StatusPill>
      </div>

      <div className="onia-videolab-meta">
        <Meta icon={Sparkles} label="Modelo" value={job.model} />
        <Meta icon={Ratio} label="Formato" value={`${job.aspectRatio} · ${job.durationS}s`} />
        <Meta
          icon={Coins}
          label="Créditos"
          value={job.creditsUsed != null ? `${job.creditsUsed} usados` : `${job.creditsEstimated} est.`}
        />
      </div>

      {job.gate ? (
        <div className="onia-videolab-gate">
          <UserCheck size={15} />
          <div>
            <strong>Gate</strong>
            <p>{job.gate}</p>
          </div>
        </div>
      ) : null}

      {job.note ? (
        <div className="onia-videolab-note">
          <AlertTriangle size={14} />
          <span>{job.note}</span>
        </div>
      ) : null}

      <div className="onia-videolab-action">
        <ListChecks size={15} />
        <code>{job.approveCommand}</code>
      </div>
    </MotionArticle>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article>
      <span>
        <Icon size={17} />
        {label}
      </span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}

function Meta({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <span>
      <small>
        <Icon size={13} />
        {label}
      </small>
      <strong>{value}</strong>
    </span>
  );
}

function StatusPill({ status, children }: { status: VideoLabStatus; children: ReactNode }) {
  return <span className={`onia-videolab-status is-${status}`}>{children}</span>;
}

function SectionHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="onia-section-heading">
      <span>
        <Icon size={16} />
        {eyebrow}
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function laneLabel(lane: VideoLabJob["lane"]) {
  return lane === "onia" ? "ONIA" : lane.charAt(0).toUpperCase() + lane.slice(1);
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("es-BO", { dateStyle: "medium", timeStyle: "short" }).format(date);
}
