import { Card } from "@/app/components/ui/Card";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 md:py-20">
      <div className="mb-8 space-y-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">About KISMATE</p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Thoughtful connection, built for real life.</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <h2 className="text-xl font-semibold">Why KISMATE</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            We believe meaningful relationships start with clarity, respect, and compatibility—not noise.
          </p>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold">What we value</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Trust, sincerity, and healthy communication are central to how we help people meet.
          </p>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold">Global but personal</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            KISMATE is designed for a global audience while feeling warm, respectful, and culturally aware.
          </p>
        </Card>
      </div>
    </main>
  );
}
