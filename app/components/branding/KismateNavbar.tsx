import Link from "next/link";
import { KismateLogo } from "@/app/components/branding/KismateLogo";

const marketingLinks = [
  { href: "/", label: "Home" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/safety", label: "Safety" },
  { href: "/about", label: "About" },
];

export function KismateNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3" aria-label="KISMATE home">
          <KismateLogo variant="full" color="brand" className="text-foreground" />
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
          {marketingLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/signin"
            className="inline-flex h-10 items-center rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-10 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground shadow-[0_12px_30px_rgba(180,111,93,0.18)] transition hover:bg-primary/90"
          >
            Create account
          </Link>
        </div>
      </div>
    </header>
  );
}
