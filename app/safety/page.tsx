import Link from "next/link";
import { Card } from "@/app/components/ui/Card";

export default function SafetyPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 md:py-20">
      <div className="mb-8 space-y-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Safety</p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">A safer way to meet.</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <h2 className="text-xl font-semibold">Privacy-first</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            We keep your personal details protected and only reveal the information you choose to share.
          </p>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold">Block and report</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            You can block or report members when something feels off, and those actions are handled carefully.
          </p>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold">Responsible design</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            KISMATE is built with clear boundaries, respectful defaults, and safer interactions in mind.
          </p>
        </Card>
      </div>

      <div className="mt-10 rounded-[2rem] border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">
          This placeholder page will later be expanded with full detailed safety guidance and policy wording.
        </p>
        <Link href="/signup" className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground">
          Create your profile
        </Link>
      </div>
    </main>
  );
}
