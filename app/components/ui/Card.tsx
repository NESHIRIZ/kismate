import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn("rounded-[1.75rem] border border-border bg-card shadow-[0_18px_45px_rgba(15,23,42,0.06)]", className)}>
      {children}
    </div>
  );
}
