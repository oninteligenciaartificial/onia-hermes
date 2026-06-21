import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleDot, ListChecks } from "lucide-react";
import type { RequirementGroup, SellerScreen } from "../types";
import { StatusPill } from "./ui";

export function SellerScreenHeader({ screen }: { screen: SellerScreen }) {
  return (
    <header className="seller-screen-header">
      <div>
        <span className="seller-kicker">{screen.label}</span>
        <h1>{screen.title}</h1>
        <p>{screen.description}</p>
      </div>

      <aside className="seller-screen-meta" aria-label="Contexto de pantalla">
        <div className="seller-screen-tags">
          {screen.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        {screen.primaryAction ? (
          <Link href={screen.primaryAction.href}>
            {screen.primaryAction.label}
            <ArrowRight size={15} />
          </Link>
        ) : null}
      </aside>
    </header>
  );
}

export function SellerScreenGrid({
  children,
  aside,
}: {
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className={aside ? "seller-screen-grid" : "seller-screen-stack"}>
      <section className="seller-screen-flow">{children}</section>
      {aside ? <aside className="seller-screen-aside">{aside}</aside> : null}
    </div>
  );
}

export function OperatingBlock({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <article className="seller-operating-block">
      <div>
        <ListChecks size={16} />
        <strong>{title}</strong>
      </div>
      <p>{description}</p>
      <ul>
        {items.map((item) => (
          <li key={item}>
            <CircleDot size={12} />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function RequirementCards({ requirements }: { requirements: RequirementGroup[] }) {
  const toneByPriority = {
    obligatorio: "danger",
    operativo: "info",
    siguiente: "neutral",
  } as const;

  return (
    <div className="seller-requirements-list">
      {requirements.map((requirement) => (
        <article className="seller-requirement-card" key={requirement.id}>
          <div className="seller-requirement-card__head">
            <div>
              <span>{requirement.owner}</span>
              <strong>{requirement.title}</strong>
            </div>
            <StatusPill tone={toneByPriority[requirement.priority]}>{requirement.priority}</StatusPill>
          </div>
          <ul>
            {requirement.items.map((item) => (
              <li key={item}>
                <CheckCircle2 size={14} />
                {item}
              </li>
            ))}
          </ul>
          <p>{requirement.why}</p>
        </article>
      ))}
    </div>
  );
}
