import Link from "next/link";
import { cookies } from "next/headers";
import { KISMATE_SESSION_COOKIE, verifyJwt } from "@/lib/auth";
import { getUserById } from "@/lib/db";
import { getUnreadMessageCountForUser } from "@/lib/db";

export async function MobileBottomNav() {
  const cookieStore = await cookies();
  const token = cookieStore.get(KISMATE_SESSION_COOKIE)?.value;
  const payload = token ? verifyJwt(token) : null;
  const user = payload ? getUserById(payload.sub) : null;

  if (!user) {
    return null;
  }

  const unreadCount = getUnreadMessageCountForUser(user.id);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl md:hidden" aria-label="Mobile navigation">
      <div className="grid grid-cols-4 gap-2 px-3 py-2">
        <Link href="/discover" className="flex flex-col items-center justify-center rounded-xl px-2 py-2 text-[11px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
          Discover
        </Link>
        <Link href="/matches" className="flex flex-col items-center justify-center rounded-xl px-2 py-2 text-[11px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
          Matches
        </Link>
        <Link href="/messages" className="relative flex flex-col items-center justify-center rounded-xl px-2 py-2 text-[11px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
          Messages
          {unreadCount > 0 ? (
            <span className="absolute right-3 top-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
              {unreadCount}
            </span>
          ) : null}
        </Link>
        <Link href="/profile" className="flex flex-col items-center justify-center rounded-xl px-2 py-2 text-[11px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
          Profile
        </Link>
      </div>
    </nav>
  );
}
