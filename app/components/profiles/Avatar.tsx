import { cn } from "@/lib/cn";
import { ImageWithFallback } from "@/app/components/ui/ImageWithFallback";

type AvatarProps = {
  src?: string | null;
  alt: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-xl",
};

export function Avatar({ src, alt, name, size = "md", className = "" }: AvatarProps) {
  const initials = name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (!src) {
    return (
      <div
        className={cn(
          "inline-flex items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,_#f5e9df,_#d7c6b6_58%,_#b48b6d)] font-semibold text-slate-800 shadow-sm ring-1 ring-white/70",
          sizeMap[size],
          className,
        )}
        aria-label={alt}
      >
        {initials ?? "K"}
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden rounded-full ring-1 ring-white/80 shadow-sm", sizeMap[size], className)}>
      <ImageWithFallback
        src={src}
        alt={alt}
        width={200}
        height={200}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
