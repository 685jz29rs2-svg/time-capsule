import type { ReactNode } from "react";

export function Notice({
  title,
  tone = "warning",
  actions,
  children,
}: {
  title?: string;
  tone?: "warning" | "error";
  actions?: ReactNode;
  children: ReactNode;
}) {
  const ring = tone === "error" ? "ring-destructive/40" : "ring-[color:var(--wax)]/40";
  return (
    <div className={`w-full rounded-2xl bg-card px-4 py-5 text-sm leading-6 ring-1 sm:px-5 ${ring}`}>
      {title ? <p className="font-medium">{title}</p> : null}
      <div className={title ? "mt-1.5 text-muted-foreground" : "text-muted-foreground"}>{children}</div>
      {actions ? <div className="mt-3">{actions}</div> : null}
    </div>
  );
}
