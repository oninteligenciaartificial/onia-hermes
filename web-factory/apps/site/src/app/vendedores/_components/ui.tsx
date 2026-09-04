import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { Tone } from "../types";

export function StatusPill({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: Tone;
}) {
  return <span className={`seller-pill is-${tone}`}>{children}</span>;
}

export function SectionPanel({
  id,
  label,
  title,
  description,
  icon: Icon,
  action,
  children,
  density = "regular",
}: {
  id?: string;
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
  action?: ReactNode;
  children: ReactNode;
  density?: "regular" | "compact";
}) {
  return (
    <section className={`seller-panel is-${density}`} id={id}>
      <div className="seller-panel-heading">
        <div>
          <span>{label}</span>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="seller-panel-heading__side">
          {action}
          <Icon size={17} />
        </div>
      </div>
      {children}
    </section>
  );
}

export function DetailList({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="seller-detail-list">
      <strong>{title}</strong>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
