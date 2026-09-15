import Link from "next/link";
import { KismateLogo } from "./branding/KismateLogo";
import { Container } from "./container";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/70">
      <Container>
        <div className="grid gap-10 py-12 md:grid-cols-4">
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="inline-flex items-center">
              <KismateLogo variant="full" color="brand" className="text-foreground" />
            </Link>
            <p className="text-sm leading-6 text-muted-foreground">
              Meaningful connections built on compatibility, trust, and genuine chemistry.
            </p>
          </div>

          <div className="grid gap-8 md:col-span-3 md:grid-cols-3">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Explore</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-foreground">Home</Link>
                </li>
                <li>
                  <Link href="/#how-it-works" className="hover:text-foreground">How it works</Link>
                </li>
                <li>
                  <Link href="/safety" className="hover:text-foreground">Safety</Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground">About</Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground">Terms</Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Connect</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/signup" className="hover:text-foreground">Create account</Link>
                </li>
                <li>
                  <Link href="/signin" className="hover:text-foreground">Sign in</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-border/80 py-6 text-sm text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} KISMATE. All rights reserved.</p>
          <p>Meaningful connections.</p>
        </div>
      </Container>
    </footer>
  );
}
