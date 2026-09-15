import Link from "next/link";
import { cookies } from "next/headers";
import { KISMATE_SESSION_COOKIE, verifyJwt } from "@/lib/auth";
import { getUserById } from "@/lib/db";
import { KismateLogo } from "./branding/KismateLogo";
import { Container } from "./container";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/safety", label: "Safety" },
  { href: "/about", label: "About" },
] as const;

export async function SiteHeader() {
  const cookieStore = await cookies();
  const token = cookieStore.get(KISMATE_SESSION_COOKIE)?.value;
  const payload = token ? verifyJwt(token) : null;
  const user = payload ? getUserById(payload.sub) : null;

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-xl">
      <Container>
        <div className="flex h-20 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2" aria-label="KISMATE home">
            <KismateLogo variant="full" color="brand" className="text-foreground" />
          </Link>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="hidden rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted sm:inline-flex"
              >
                Dashboard
              </Link>
              <form action="/api/auth/logout" method="post">
                <button
                  type="submit"
                  className="inline-flex h-10 items-center rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground transition hover:bg-muted"
                >
                  Sign out
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/signin"
                className="hidden h-10 items-center rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground transition hover:bg-muted sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-10 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground shadow-[0_12px_32px_rgba(180,111,93,0.2)] transition hover:bg-primary/90"
              >
                Create account
              </Link>
            </div>
          )}
        </div>
      </Container>
    </header>
  );
}
