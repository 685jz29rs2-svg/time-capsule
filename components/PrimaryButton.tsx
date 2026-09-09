import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const CLASS =
  "group/button inline-flex h-12 w-full max-w-sm shrink-0 items-center justify-center rounded-lg bg-primary px-3.5 text-base font-medium text-primary-foreground transition-all hover:bg-primary/80 disabled:pointer-events-none disabled:opacity-50";

export function PrimaryButton({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`${CLASS} ${className ?? ""}`} {...props} />;
}

export function PrimaryLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={`${CLASS} ${className ?? ""}`}>
      {children}
    </Link>
  );
}
