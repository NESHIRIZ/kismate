import { cn } from "@/lib/cn";
import { ImageWithFallback } from "@/app/components/ui/ImageWithFallback";

type ProfileImageProps = {
  src?: string | null;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  className?: string;
};

const sizeMap = {
  sm: "h-16 w-16",
  md: "h-28 w-28",
  lg: "h-40 w-40",
  xl: "h-56 w-56",
  hero: "h-[420px] w-full",
};

const roundedMap = {
  none: "rounded-none",
  sm: "rounded-lg",
  md: "rounded-2xl",
  lg: "rounded-[2rem]",
  full: "rounded-full",
};

export function ProfileImage({
  src,
  alt,
  size = "md",
  rounded = "lg",
  className = "",
}: ProfileImageProps) {
  return (
    <div className={cn("relative overflow-hidden bg-stone-200 shadow-sm ring-1 ring-stone-200", sizeMap[size], roundedMap[rounded], className)}>
      <ImageWithFallback
        src={src ?? "/images/profiles/profile-fallback.svg"}
        alt={alt}
        width={800}
        height={1000}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
