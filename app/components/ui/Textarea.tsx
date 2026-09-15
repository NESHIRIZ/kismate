import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
};

export function Textarea({ label, className, ...props }: TextareaProps) {
  return (
    <label className="block space-y-2">
      {label ? <span className="text-sm font-medium text-foreground">{label}</span> : null}
      <textarea
        {...props}
        className={cn(
          "min-h-[120px] w-full rounded-2xl border border-border bg-background px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
          className,
        )}
      />
    </label>
  );
}
