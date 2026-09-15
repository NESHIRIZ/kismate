import { Card } from "@/app/components/ui/Card";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 md:py-20">
      <div className="mb-8 space-y-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Privacy</p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Respect for your boundaries.</h1>
      </div>

      <Card className="p-8 text-sm leading-7 text-muted-foreground">
        <p>
          KISMATE is designed to protect personal information, respect user consent, and keep controls in your hands.
          This page is a placeholder for the final privacy policy and will be replaced with legal wording in a later phase.
        </p>
      </Card>
    </main>
  );
}
