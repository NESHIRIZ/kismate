import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <label className="block space-y-2">
      {label ? <span className="text-sm font-medium text-foreground">{label}</span> : null}
      <input
        {...props}
        className={cn(
          "h-12 w-full rounded-2xl border border-border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
          error ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "",
          className,
        )}
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
