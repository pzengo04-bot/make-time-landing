import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/checkout/confirmed")({
  head: () => ({
    meta: [
      { title: "Reserved — Roo Athletics" },
      { name: "description", content: "Your Roo Athletics order is reserved. We'll email you at launch." },
      { property: "og:title", content: "Reserved — Roo Athletics" },
      { property: "og:description", content: "Your Roo Athletics order is reserved. We'll email you at launch." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Confirmed,
});

function Confirmed() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-40 pb-24 text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          You're reserved
        </p>
        <h1 className="mt-3 font-display text-6xl leading-none tracking-tight text-foreground sm:text-7xl">
          THANK YOU.
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
          Your order is held. Roo Athletics isn't live yet, so no payment was
          taken — we'll email you the moment the first drop is available so you
          can complete checkout before anyone else.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="btn-premium inline-flex rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground"
          >
            Back home
          </Link>
          <Link
            to="/shop"
            className="inline-flex rounded-full border border-border px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            Keep browsing
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
