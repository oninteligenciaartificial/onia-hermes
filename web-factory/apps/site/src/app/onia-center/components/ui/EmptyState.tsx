import Link from "next/link";

interface EmptyStateProps {
  title: string;
  body: string;
  linkHref?: string;
  linkLabel?: string;
}

export function EmptyState({ title, body, linkHref, linkLabel }: EmptyStateProps) {
  return (
    <div className="grid gap-2 rounded-lg border border-border bg-card p-12 text-center">
      <h2 className="text-lg font-medium text-card-foreground">{title}</h2>
      <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">{body}</p>
      {linkHref && linkLabel ? (
        <Link href={linkHref} className="mt-2 justify-self-center text-sm font-medium text-primary">
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}
