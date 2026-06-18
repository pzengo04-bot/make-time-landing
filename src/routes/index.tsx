import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { useCountUp } from "@/hooks/use-count-up";
import heroProduct from "@/assets/hero-product.jpg";
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
    desc: "Athletic taper. Fitted sleeves. Everyday comfort.",
    img: productFitted,
  },
  {
    name: "Performance Tee",
    desc: "Lightweight. Breathable. Built for training.",
    img: productPerformance,
  },
  {
    name: "Oversized Tee",
    desc: "Relaxed fit. Premium weight. Everyday wear.",
    img: productOversized,
  },
];

function WaitlistForm({
  variant = "hero",
  size = "md",
}: {
  variant?: "hero" | "footer";
  size?: "md" | "lg";
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/public/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputPad = size === "lg" ? "px-6 py-5 text-base" : "px-5 py-4 text-sm";
  const btnPad = size === "lg" ? "px-9 py-5 text-sm" : "px-7 py-4 text-sm";

  if (submitted) {
    return (
      <div className="w-full rounded-2xl border border-border bg-card/60 px-6 py-5 text-center text-sm text-foreground backdrop-blur">
        You're in. We'll keep you updated on Roo Athletics.
      </div>
    );
  }

  return (
    <>
    <form
      onSubmit={onSubmit}
      className="flex w-full flex-col gap-3 sm:flex-row"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className={`min-w-0 flex-1 rounded-xl border border-border bg-card/70 ${inputPad} text-foreground placeholder:text-muted-foreground transition-colors focus:border-foreground/60 focus:bg-card focus:outline-none focus:ring-2 focus:ring-foreground/10`}
      />
      <button
        type="submit"
        disabled={loading}
        className={`btn-premium shrink-0 rounded-xl bg-primary ${btnPad} font-semibold uppercase tracking-[0.18em] text-primary-foreground disabled:opacity-60`}
      >
        {loading ? "Joining…" : variant === "hero" ? "Join the Waitlist" : "Join Now"}
      </button>
    </form>
    {error ? (
      <p className="mt-3 text-xs text-red-400" role="alert">{error}</p>
    ) : null}
    </>
  );
}

function SocialProof({ count = 127 }: { count?: number }) {
  const { ref, value } = useCountUp<HTMLSpanElement>(count);
  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      <div className="flex -space-x-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-7 w-7 rounded-full border border-background bg-gradient-to-br from-muted to-accent"
          />
        ))}
      </div>
      <p className="uppercase tracking-[0.16em]">
        Join <span ref={ref} className="font-semibold text-foreground">{value}+</span> founding members
      </p>
    </div>
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
          <a href="#why" className="transition-colors hover:text-foreground">About</a>
          <a href="#waitlist" className="transition-colors hover:text-foreground">Waitlist</a>
        </nav>
        <a
          href="#waitlist"
          className="btn-premium shrink-0 rounded-full bg-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-foreground sm:px-5 sm:text-xs"
        >
          Join Waitlist
        </a>
      </div>
    </header>
  );
}

function Index() {
  const whyKicker = useReveal<HTMLParagraphElement>();
  const whyHeading = useReveal<HTMLHeadingElement>({ delayMs: 100 });
  const whyLine1 = useReveal<HTMLParagraphElement>({ delayMs: 200 });
  const whyLine2 = useReveal<HTMLParagraphElement>({ delayMs: 300 });
  const whyLine3 = useReveal<HTMLParagraphElement>({ delayMs: 400 });
  const whyLine4 = useReveal<HTMLParagraphElement>({ delayMs: 500 });
  const whyClose = useReveal<HTMLParagraphElement>({ delayMs: 650 });
  const ctaHeading = useReveal<HTMLHeadingElement>();
  const ctaCopy = useReveal<HTMLParagraphElement>({ delayMs: 120 });
  const ctaForm = useReveal<HTMLDivElement>({ delayMs: 240 });
  const catalogKicker = useReveal<HTMLParagraphElement>();
  const catalogHeading = useReveal<HTMLHeadingElement>();
  const catalogSub = useReveal<HTMLParagraphElement>({ delayMs: 120 });

  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      <Nav />

      {/* HERO */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-hero pt-28 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,oklch(0.20_0_0)_0%,transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,oklch(0.03_0_0)_90%)]" />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
          {/* LEFT */}
          <div className="flex flex-col items-start text-left">
            <span className="reveal reveal-in inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-foreground" />
              Launching Soon
            </span>

            <h1
              className="reveal reveal-in mt-6 font-display text-[20vw] leading-[0.85] tracking-tight text-foreground sm:text-8xl lg:text-9xl xl:text-[10rem]"
              style={{ transitionDelay: "120ms" }}
            >
              MAKE<br />TIME.
            </h1>

            <p
              className="reveal reveal-in mt-8 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg"
              style={{ transitionDelay: "240ms" }}
            >
              Premium athletic essentials built for people who stay consistent — even when life gets busy.
            </p>

            <div
              className="reveal reveal-in mt-10 w-full max-w-lg"
              style={{ transitionDelay: "360ms" }}
            >
              <WaitlistForm variant="hero" size="lg" />
              <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Early access · Founding member perks · Exclusive launch pricing
              </p>
            </div>

            <div
              className="reveal reveal-in mt-8"
              style={{ transitionDelay: "480ms" }}
            >
              <SocialProof count={93} />
            </div>
          </div>

          {/* RIGHT — product showcase */}
          <div className="reveal reveal-in relative" style={{ transitionDelay: "240ms" }}>
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,oklch(0.22_0_0)_0%,transparent_65%)] blur-2xl" />
            <div className="relative mx-auto aspect-[3/4] w-full max-w-md lg:max-w-lg">
              <img
                src={heroProduct}
                alt="Roo Athletics Fitted Tee in premium studio lighting"
                width={1024}
                height={1365}
                className="hero-float h-full w-full object-contain"
              />
              <div className="pointer-events-none absolute inset-x-8 bottom-2 h-10 rounded-[100%] bg-black/60 blur-2xl" />
            </div>
            <div className="mt-6 flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              <span className="h-px w-8 bg-border" />
              The Fitted Tee — First Drop
              <span className="h-px w-8 bg-border" />
            </div>
          </div>
        </div>

        <div className="float-soft absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Scroll
        </div>
      </section>

      {/* COMING SOON / CATALOG */}
      <section id="coming-soon" className="bg-section py-28 sm:py-36">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center sm:mb-20">
            <p
              ref={catalogKicker.ref}
              className={`reveal ${catalogKicker.shown ? "reveal-in" : ""} mb-4 text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground`}
            >
              The First Drop
            </p>
            <h2
              ref={catalogHeading.ref}
              className={`reveal ${catalogHeading.shown ? "reveal-in" : ""} font-display text-6xl leading-none tracking-tight text-foreground sm:text-7xl md:text-8xl`}
              style={{ transitionDelay: "100ms" }}
            >
              COMING SOON.
            </h2>
            <p
              ref={catalogSub.ref}
              className={`reveal ${catalogSub.shown ? "reveal-in" : ""} mx-auto mt-6 max-w-md text-sm text-muted-foreground sm:text-base`}
            >
              The first Roo essentials collection.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {products.map((p, i) => (
              <ProductCard key={p.name} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY ROO — manifesto */}
      <section id="why" className="relative overflow-hidden border-y border-border bg-background py-32 sm:py-40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,oklch(0.12_0_0)_0%,transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <p
            ref={whyKicker.ref}
            className={`reveal ${whyKicker.shown ? "reveal-in" : ""} mb-6 text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground`}
          >
            The Philosophy
          </p>
          <h2
            ref={whyHeading.ref}
            className={`reveal ${whyHeading.shown ? "reveal-in" : ""} font-display text-6xl leading-none tracking-tight text-foreground sm:text-7xl md:text-8xl`}
          >
            WHY ROO?
          </h2>

          <div className="mt-14 space-y-5 font-display text-3xl leading-tight tracking-wide text-foreground sm:text-4xl md:text-5xl">
            <p
              ref={whyLine1.ref}
              className={`reveal ${whyLine1.shown ? "reveal-in" : ""}`}
            >
              Roo was built for people who stay consistent.
            </p>
            <p
              ref={whyLine2.ref}
              className={`reveal ${whyLine2.shown ? "reveal-in" : ""} text-muted-foreground`}
            >
              The early alarms.
            </p>
            <p
              ref={whyLine3.ref}
              className={`reveal ${whyLine3.shown ? "reveal-in" : ""} text-muted-foreground`}
            >
              The long days.
            </p>
            <p
              ref={whyLine4.ref}
              className={`reveal ${whyLine4.shown ? "reveal-in" : ""} text-muted-foreground`}
            >
              The workouts nobody sees.
            </p>
          </div>

          <p
            ref={whyClose.ref}
            className={`reveal ${whyClose.shown ? "reveal-in" : ""} mx-auto mt-14 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg`}
          >
            No matter how busy life gets, make time for yourself.
          </p>
        </div>
      </section>

      {/* BOTTOM CTA — full width */}
      <section id="waitlist" className="relative overflow-hidden bg-hero py-32 sm:py-40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.18_0_0)_0%,oklch(0.03_0_0)_75%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2
            ref={ctaHeading.ref}
            className={`reveal ${ctaHeading.shown ? "reveal-in" : ""} font-display text-6xl leading-none tracking-tight text-foreground sm:text-7xl md:text-8xl`}
          >
            BE FIRST <br className="sm:hidden" />IN LINE.
          </h2>
          <p
            ref={ctaCopy.ref}
            className={`reveal ${ctaCopy.shown ? "reveal-in" : ""} mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg`}
          >
            Join the Roo Athletics waitlist for launch updates and early access.
          </p>
          <div
            ref={ctaForm.ref}
            className={`reveal ${ctaForm.shown ? "reveal-in" : ""} mx-auto mt-12 max-w-xl`}
          >
            <WaitlistForm variant="footer" size="lg" />
            <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-background py-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-display text-base tracking-[0.22em] text-foreground">
            ROO <span className="text-muted-foreground">ATHLETICS</span>
          </span>
          <nav className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            <a
              href="https://instagram.com/roo.athletics"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-foreground"
            >
              Instagram
            </a>
            <a
              href="mailto:hello@rooathletics.com"
              className="transition-colors hover:text-foreground"
            >
              hello@rooathletics.com
            </a>
            <span>© {new Date().getFullYear()} Roo Athletics</span>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function ProductCard({
  product,
  index,
}: {
  product: { name: string; desc: string; img: string };
  index: number;
}) {
  const { ref, shown } = useReveal<HTMLElement>({ delayMs: index * 120 });
  return (
    <article
      ref={ref}
      className={`reveal ${shown ? "reveal-in" : ""} card-shimmer group relative rounded-2xl border border-border bg-card-premium transition-[border-color,box-shadow,transform] duration-500 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-elegant`}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-2xl bg-muted">
        <img
          src={product.img}
          alt={product.name}
          width={1024}
          height={1280}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="absolute right-4 top-4 rounded-full border border-border bg-background/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground backdrop-blur">
          Coming Soon
        </span>
      </div>
      <div className="p-6">
        <h3 className="font-display text-2xl tracking-wide text-foreground">
          {product.name.toUpperCase()}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{product.desc}</p>
      </div>
    </article>
  );
}
