import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useCart, cartItemCount } from "@/lib/cart-store";
import { getProductById, formatPrice, getColor } from "@/lib/catalog";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Roo Athletics" },
      { name: "description", content: "Reserve your Roo Athletics order." },
      { property: "og:title", content: "Checkout — Roo Athletics" },
      { property: "og:description", content: "Reserve your Roo Athletics order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  address: z.string().min(1, "Required"),
  apt: z.string().optional(),
  city: z.string().min(1, "Required"),
  region: z.string().min(1, "Required"),
  postal: z.string().min(3, "Required"),
  country: z.string().min(2, "Required"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    useCart.persist.rehydrate();
    setHydrated(true);
  }, []);

  const visible = hydrated ? items : [];
  const count = cartItemCount(visible);
  const subtotal = visible.reduce((sum, i) => {
    const p = getProductById(i.productId);
    return sum + (p?.price ?? 0) * i.qty;
  }, 0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { country: "United States" },
  });

  const onSubmit = async (values: FormValues) => {
    // Preview mode: no payment. Save the email to the waitlist so you're notified at launch.
    try {
      await fetch("/api/public/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email.trim() }),
      });
    } catch {
      // non-blocking — we still confirm the reservation
    }
    clear();
    navigate({ to: "/checkout/confirmed" });
  };

  if (hydrated && count === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-6 pt-40 pb-24 text-center">
          <h1 className="font-display text-5xl tracking-tight text-foreground">YOUR BAG IS EMPTY.</h1>
          <p className="mt-4 text-sm text-muted-foreground">Add something before checking out.</p>
          <Link
            to="/shop"
            className="btn-premium mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground"
          >
            Go to shop
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 pt-32 pb-24 sm:pt-36">
        <div className="mb-8 rounded-xl border border-border bg-card/60 px-5 py-4 text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Preview mode — no payment will be taken. Submitting this form reserves your spot and adds you to the launch list.
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Checkout</p>
            <h1 className="mt-3 font-display text-5xl leading-none tracking-tight text-foreground sm:text-6xl">
              RESERVE YOUR<br />ORDER.
            </h1>

            <Section title="Contact">
              <Field label="Email" error={errors.email?.message}>
                <input type="email" autoComplete="email" {...register("email")} className={inputCls} />
              </Field>
            </Section>

            <Section title="Shipping Address">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="First name" error={errors.firstName?.message}>
                  <input autoComplete="given-name" {...register("firstName")} className={inputCls} />
                </Field>
                <Field label="Last name" error={errors.lastName?.message}>
                  <input autoComplete="family-name" {...register("lastName")} className={inputCls} />
                </Field>
              </div>
              <Field label="Address" error={errors.address?.message}>
                <input autoComplete="address-line1" {...register("address")} className={inputCls} />
              </Field>
              <Field label="Apt / Suite (optional)" error={errors.apt?.message}>
                <input autoComplete="address-line2" {...register("apt")} className={inputCls} />
              </Field>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="City" error={errors.city?.message}>
                  <input autoComplete="address-level2" {...register("city")} className={inputCls} />
                </Field>
                <Field label="State / Region" error={errors.region?.message}>
                  <input autoComplete="address-level1" {...register("region")} className={inputCls} />
                </Field>
                <Field label="Postal code" error={errors.postal?.message}>
                  <input autoComplete="postal-code" {...register("postal")} className={inputCls} />
                </Field>
              </div>
              <Field label="Country" error={errors.country?.message}>
                <input autoComplete="country-name" {...register("country")} className={inputCls} />
              </Field>
            </Section>

            <Section title="Order notes (optional)">
              <Field label="Anything we should know?" error={errors.notes?.message}>
                <textarea rows={3} {...register("notes")} className={`${inputCls} resize-none`} />
              </Field>
            </Section>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-premium mt-8 inline-flex w-full justify-center rounded-full bg-primary px-6 py-5 text-xs font-semibold uppercase tracking-[0.22em] text-primary-foreground disabled:opacity-60"
            >
              {isSubmitting ? "Reserving…" : "Reserve My Order"}
            </button>
            <p className="mt-4 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              No payment collected. We'll email you the moment Roo Athletics is live.
            </p>
          </form>

          <aside className="h-fit rounded-2xl border border-border bg-card-premium p-6 lg:sticky lg:top-32">
            <h2 className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
              Your Order
            </h2>
            <ul className="mt-5 space-y-4">
              {visible.map((item) => {
                const p = getProductById(item.productId);
                if (!p) return null;
                const color = getColor(p, item.color);
                return (
                  <li key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-3">
                    <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                      <img src={color.image} alt={p.name} className="h-full w-full object-cover" />
                      <span className="absolute -right-1.5 -top-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-bold text-background">
                        {item.qty}
                      </span>
                    </div>
                    <div className="flex flex-1 items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{p.name}</p>
                        <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          {color.name} · {item.size}
                        </p>
                      </div>
                      <p className="text-xs font-medium text-foreground">{formatPrice(p)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 space-y-3 border-t border-border pt-6 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">{subtotal > 0 ? `$${(subtotal / 100).toFixed(2)}` : "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-muted-foreground">—</span>
              </div>
              <div className="flex items-baseline justify-between border-t border-border pt-4">
                <span className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Total</span>
                <span className="font-display text-2xl text-foreground">
                  {subtotal > 0 ? `$${(subtotal / 100).toFixed(2)}` : "—"}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-card/70 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-foreground/60 focus:bg-card focus:outline-none focus:ring-2 focus:ring-foreground/10";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10 border-t border-border pt-8">
      <h2 className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">{title}</h2>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </span>
      {children}
      {error ? <span className="mt-1 block text-xs text-red-400">{error}</span> : null}
    </label>
  );
}
