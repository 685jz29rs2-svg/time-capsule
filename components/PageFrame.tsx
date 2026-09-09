import type { ReactNode } from "react";

export function PageFrame({
  children,
  center = false,
}: {
  children: ReactNode;
  center?: boolean;
}) {
  return (
    <main
      className={`mx-auto flex w-full max-w-lg flex-1 flex-col px-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 sm:pt-8 ${
        center ? "items-center text-center" : ""
      }`}
    >
      {children}
    </main>
  );
}
