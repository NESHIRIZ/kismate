import Link from "next/link";
import { Card } from "@/app/components/ui/Card";
import { ProfileImage } from "@/app/components/profiles/ProfileImage";

const featureCards = [
  {
    title: "Discover",
    description: "Meet people who match your values, lifestyle, and connection preferences.",
  },
  {
    title: "Meaningful profiles",
    description: "Learn more than a photo with thoughtful bios, interests, and intentions.",
  },
  {
    title: "Compatibility",
    description: "Explore shared priorities like lifestyle, intentions, and relationship goals.",
  },
  {
    title: "Matches",
    description: "Mutual interest leads to real conversations and better first messages.",
  },
  {
    title: "Conversations",
    description: "Start chats with people who have already shown genuine interest.",
  },
  {
    title: "Safety",
    description: "Control your visibility, block unwanted interactions, and report concerns.",
  },
];

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-border bg-[radial-gradient(circle_at_top,_rgba(180,111,93,0.12),_transparent_30%),linear-gradient(180deg,_#f9f4ee_0%,_#ffffff_100%)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-24">
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-primary">
              KISMATE™
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
              Find someone who truly connects with you.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-muted-foreground">
              KISMATE helps you discover compatible people and build genuine relationships around trust, lifestyle, and shared intentions.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[0_16px_40px_rgba(180,111,93,0.2)] transition hover:bg-primary/90"
              >
                Create your profile
              </Link>
              <Link
                href="/#how-it-works"
                className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-6 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                Discover KISMATE
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <div>
                <span className="block text-2xl font-semibold text-foreground">12k+</span>
                meaningful matches
              </div>
              <div>
                <span className="block text-2xl font-semibold text-foreground">94%</span>
                profile completion
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-5 top-10 h-24 w-24 rounded-full bg-primary/15 blur-2xl" />
            <div className="absolute -right-4 bottom-8 h-28 w-28 rounded-full bg-[#d9b8a5]/40 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-3 shadow-[0_30px_80px_rgba(30,42,56,0.12)]">
              <ProfileImage
                src="/images/profiles/profile-fallback.svg"
                alt="A couple smiling together"
                size="hero"
                rounded="lg"
                className="h-[440px]"
              />
              <div className="absolute inset-x-8 bottom-8 rounded-2xl border border-white/40 bg-white/80 p-4 shadow-lg backdrop-blur-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-foreground">Amina & Daniel</p>
                    <p className="text-sm text-muted-foreground">Shared values • 92% compatibility</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    Match
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Discover</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">Designed for real chemistry.</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featureCards.map((card) => (
              <Card key={card.title} className="p-6 transition-transform duration-200 hover:-translate-y-1">
                <div className="mb-4 h-11 w-11 rounded-2xl bg-primary/10 ring-1 ring-primary/15" />
                <h3 className="text-xl font-semibold text-foreground">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{card.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-y border-border bg-card/70 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">How KISMATE works</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">A more thoughtful journey.</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              "Create your profile",
              "Tell us what matters to you",
              "Discover people",
              "Like someone",
              "Match when the interest is mutual",
              "Start a conversation",
            ].map((step, index) => (
              <Card key={step} className="p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {index + 1}
                </div>
                <p className="text-lg font-medium text-foreground">{step}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-[2rem] border border-border bg-[linear-gradient(180deg,#1e2a38_0%,#19212d_100%)] p-8 text-white md:p-12">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#e7d4c3]">Your next chapter starts here</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">Open to a connection that feels right.</h2>
              </div>
              <Link
                href="/signup"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Create your profile
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
