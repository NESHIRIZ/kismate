type KismateLogoProps = {
  variant?: "full" | "icon" | "mark";
  color?: "light" | "dark" | "brand";
  className?: string;
};

function getColors(color: KismateLogoProps["color"]) {
  switch (color) {
    case "light":
      return {
        primary: "#F8F4EE",
        secondary: "#DDB29D",
        accent: "#F4E7DA",
        ring: "#F8F4EE",
      };
    case "dark":
      return {
        primary: "#151A22",
        secondary: "#C98C71",
        accent: "#EADBD0",
        ring: "#151A22",
      };
    default:
      return {
        primary: "#1E2A38",
        secondary: "#B46F5D",
        accent: "#E7D4C3",
        ring: "#1E2A38",
      };
  }
}

export function KismateLogo({
  variant = "full",
  color = "brand",
  className = "",
}: KismateLogoProps) {
  const colors = getColors(color);

  const baseClasses = className || "";

  if (variant === "icon") {
    return (
      <svg
        viewBox="0 0 120 120"
        aria-label="KISMATE logo"
        className={baseClasses}
        role="img"
      >
        <rect x="10" y="10" width="100" height="100" rx="32" fill={colors.accent} />
        <circle cx="40" cy="48" r="16" fill={colors.primary} opacity="0.95" />
        <circle cx="80" cy="48" r="16" fill={colors.primary} opacity="0.95" />
        <path
          d="M28 76c8-11 19-17 32-17s24 6 32 17"
          fill="none"
          stroke={colors.secondary}
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M40 40c3-7 9-11 16-11s13 4 16 11"
          fill="none"
          stroke={colors.ring}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.9"
        />
        <circle cx="60" cy="76" r="5" fill={colors.secondary} />
      </svg>
    );
  }

  if (variant === "mark") {
    return (
      <svg
        viewBox="0 0 120 120"
        aria-label="KISMATE mark"
        className={baseClasses}
        role="img"
      >
        <circle cx="40" cy="48" r="17" fill={colors.primary} opacity="0.96" />
        <circle cx="80" cy="48" r="17" fill={colors.primary} opacity="0.96" />
        <path
          d="M24 82c7-12 18-18 36-18s29 6 36 18"
          fill="none"
          stroke={colors.secondary}
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M39 47c4-8 10-12 21-12 10 0 17 5 21 12"
          fill="none"
          stroke={colors.accent}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 ${baseClasses}`}>
      <svg
        viewBox="0 0 120 120"
        aria-label="KISMATE logo"
        className="h-10 w-10 shrink-0"
        role="img"
      >
        <rect x="10" y="10" width="100" height="100" rx="32" fill={colors.accent} />
        <circle cx="40" cy="48" r="16" fill={colors.primary} opacity="0.95" />
        <circle cx="80" cy="48" r="16" fill={colors.primary} opacity="0.95" />
        <path
          d="M28 76c8-11 19-17 32-17s24 6 32 17"
          fill="none"
          stroke={colors.secondary}
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M40 40c3-7 9-11 16-11s13 4 16 11"
          fill="none"
          stroke={colors.ring}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.9"
        />
        <circle cx="60" cy="76" r="5" fill={colors.secondary} />
      </svg>
      <div className="leading-none">
        <div className="text-lg font-semibold tracking-[0.18em] text-current">KISMATE</div>
        <div className="mt-1 text-[9px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
          Meaningful connections.
        </div>
      </div>
    </div>
  );
}
