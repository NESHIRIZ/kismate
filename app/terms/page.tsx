import { Card } from "@/app/components/ui/Card";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 md:py-20">
      <div className="mb-8 space-y-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Terms</p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Guidelines for respectful use.</h1>
      </div>

      <Card className="p-8 text-sm leading-7 text-muted-foreground">
        <p>
          These terms form the framework for using KISMATE responsibly, respectfully, and lawfully. Final legal language will be added in a later phase.
        </p>
      </Card>
    </main>
  );
}
