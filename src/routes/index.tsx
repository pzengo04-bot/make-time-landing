import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import heroImage from "@/assets/hero.jpg";
import productFitted from "@/assets/product-fitted.jpg";
import productPerformance from "@/assets/product-performance.jpg";
import productOversized from "@/assets/product-oversized.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Roo Athletics — Make Time." },
      { name: "description", content: "Premium athletic essentials built for the ones who show up — even when life gets busy. Join the Roo Athletics waitlist for early access." },
      { property: "og:title", content: "Roo Athletics — Make Time." },
      { property: "og:description", content: "Premium athletic essentials built for the ones who show up — even when life gets busy." },
    ],
  }),
  component: Index,
});

const products = [
  {
    name: "Fitted Tee",
    desc: "Athletic taper. Fitted sleeves. Built to show definition without feeling tight.",
    img: productFitted,
  },
  {
    name: "Performance Tee",
    desc: "Lightweight, breathable, and made for training.",
    img: productPerformance,
  },
  {
    name: "Oversized Shirt",
    desc: "Relaxed fit. Premium feel. Made for rest days, lifts, and everyday wear.",
    img: productOversized,
  },
];

function WaitlistForm({ variant = "hero" }: { variant?: "hero" | "footer" }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto w-full max-w-md rounded-full border border-border bg-card/60 px-6 py-4 text-center text-sm text-foreground backdrop-blur">
        You're on the list. Watch your inbox.
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex w-full max-w-md flex-col gap-2 sm:flex-row sm:rounded-full sm:border sm:border-border sm:bg-card/40 sm:p-1.5 sm:backdrop-blur"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="min-w-0 flex-1 rounded-full border border-border bg-card/60 px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30 sm:border-0 sm:bg-transparent sm:py-2.5 sm:focus:ring-0"
      />
      <button
        type="submit"
        className="shrink-0 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-glow sm:py-2.5"
      >
        {variant === "hero" ? "Join the Waitlist" : "Join Now"}
      </button>
    </form>
  );
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-6 py-4 sm:flex sm:max-w-7xl sm:justify-between">
        <a href="#top" className="font-display text-xl tracking-[0.18em] text-foreground sm:text-2xl">
          ROO <span className="text-muted-foreground">ATHLETICS</span>
        </a>
        <nav className="hidden items-center gap-10 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground md:flex">
          <a href="#coming-soon" className="transition-colors hover:text-foreground">Coming Soon</a>
          <a href="#about" className="transition-colors hover:text-foreground">About</a>
          <a href="#waitlist" className="transition-colors hover:text-foreground">Waitlist</a>
        </nav>
        <a
          href="#waitlist"
          className="shrink-0 rounded-full bg-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-all hover:bg-primary/90 sm:px-5 sm:text-xs"
        >
          Join Waitlist
        </a>
      </div>
    </header>
  );
}

function Index() {
  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      <Nav />

      {/* HERO */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-hero pt-24">
        <img
          src={heroImage}
          alt="Athlete training in a dark premium gym"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,oklch(0.04_0_0)_85%)]" />

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-foreground" />
            Launching Soon
          </span>

          <h1 className="font-display text-[18vw] leading-[0.85] tracking-tight text-foreground sm:text-[140px] md:text-[170px]">
            MAKE TIME.
          </h1>

          <p className="mt-8 max-w-xl text-base text-muted-foreground sm:text-lg">
            Premium athletic essentials built for the ones who show up — even when life gets busy.
          </p>

          <div id="waitlist-hero" className="mt-10 w-full">
            <WaitlistForm variant="hero" />
            <p className="mt-4 text-xs text-muted-foreground">
              Get early access to drops, discounts, and founding member perks.
            </p>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Scroll
        </div>
      </section>

      {/* COMING SOON / CATALOG */}
      <section id="coming-soon" className="bg-section py-28 sm:py-36">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 flex flex-col items-start justify-between gap-6 sm:mb-20 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                The First Drop
              </p>
              <h2 className="font-display text-6xl leading-none tracking-tight text-foreground sm:text-7xl md:text-8xl">
                COMING SOON.
              </h2>
            </div>
            <p className="max-w-sm text-sm text-muted-foreground">
              Three essentials. Engineered to move with you, made to last past the trend cycle.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {products.map((p) => (
              <article
                key={p.name}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card-premium transition-all duration-500 hover:border-foreground/30 hover:shadow-elegant"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  <img
                    src={p.img}
                    alt={p.name}
                    width={1024}
                    height={1280}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  />
                  <span className="absolute right-4 top-4 rounded-full border border-border bg-background/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground backdrop-blur">
                    Coming Soon
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl tracking-wide text-foreground">
                    {p.name.toUpperCase()}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT — Make Time manifesto */}
      <section id="about" className="border-y border-border bg-background py-28 sm:py-36">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
            The Philosophy
          </p>
          <h2 className="font-display text-5xl leading-[0.95] tracking-tight text-foreground sm:text-6xl md:text-7xl">
            BUILT FOR THE ONES <br />
            WHO <span className="text-muted-foreground">MAKE TIME.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Roo Athletics is for the consistent. The ones who show up before sunrise and after the
            long days. We make the essentials — engineered to move, designed to last, dialed in for
            the lifters who refuse to skip.
          </p>
        </div>
      </section>

      {/* SECOND WAITLIST */}
      <section id="waitlist" className="relative overflow-hidden bg-hero py-28 sm:py-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,oklch(0.04_0_0)_80%)]" />
        <div className="relative mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-display text-5xl leading-none tracking-tight text-foreground sm:text-6xl md:text-7xl">
            BE FIRST IN LINE.
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base text-muted-foreground sm:text-lg">
            Join the Roo Athletics waitlist for early access and launch updates.
          </p>
          <div className="mt-10">
            <WaitlistForm variant="footer" />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-background py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-6 sm:flex sm:justify-between">
          <span className="font-display text-sm tracking-[0.2em] text-foreground">
            ROO <span className="text-muted-foreground">ATHLETICS</span>
          </span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            © {new Date().getFullYear()} — Make Time.
          </span>
        </div>
      </footer>
    </div>
  );
}
