import Image from "next/image";
import { cn } from "@/lib/cn";
import { type ProfileRecord } from "@/lib/kismate";

export function ProfilePreview({
  profile,
  className,
}: {
  profile: Partial<ProfileRecord> & { age?: number; profilePhoto?: string; interests?: string[] };
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_20px_48px_rgba(30,42,56,0.08)]", className)}>
      <div className="relative h-64 w-full bg-[radial-gradient(circle_at_top,_rgba(180,111,93,0.18),_transparent_35%),linear-gradient(135deg,_#f6efe9,_#f3f4f6)]">
        <Image
          src={profile.profilePhoto ?? "/images/profiles/profile-fallback.svg"}
          alt={profile.displayName ?? "Profile preview"}
          width={800}
          height={1000}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-2xl font-semibold text-foreground">{profile.displayName ?? "Your profile"}</p>
            <p className="text-sm text-muted-foreground">{profile.age ?? 0} years old</p>
          </div>
          <span className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {profile.relationshipIntent ?? "Serious dating"}
          </span>
        </div>

        <div>
          <p className="text-sm font-medium text-foreground">{profile.headline ?? "New to KISMATE"}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{profile.bio ?? "Tell potential matches a little about yourself."}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(profile.interests ?? []).slice(0, 6).map((interest) => (
            <span
              key={interest}
              className="rounded-full border border-border bg-muted/60 px-2.5 py-1 text-xs font-medium text-foreground"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
