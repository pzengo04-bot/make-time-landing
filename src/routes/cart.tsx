import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartDrawer } from "@/components/cart-drawer";
import { useCart, cartItemCount } from "@/lib/cart-store";
import { getProductById, formatPrice, getColor } from "@/lib/catalog";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Bag — Roo Athletics" },
      { name: "description", content: "Review your Roo Athletics bag before checkout." },
      { property: "og:title", content: "Your Bag — Roo Athletics" },
      { property: "og:description", content: "Review your Roo Athletics bag before checkout." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const items = useCart((s) => s.items);
  const removeItem = useCart((s) => s.removeItem);
  const updateQty = useCart((s) => s.updateQty);
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <CartDrawer />
      <main className="mx-auto max-w-5xl px-6 pt-32 pb-24 sm:pt-40">
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Your Bag
        </p>
        <h1 className="mt-3 font-display text-5xl leading-none tracking-tight text-foreground sm:text-6xl">
          {count > 0 ? `${count} ${count === 1 ? "ITEM" : "ITEMS"}.` : "EMPTY."}
        </h1>

        {count === 0 ? (
          <div className="mt-12 rounded-2xl border border-border bg-card-premium p-10 text-center">
            <p className="text-sm text-muted-foreground">Nothing in your bag yet.</p>
            <Link
              to="/shop"
              className="btn-premium mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1.6fr_1fr]">
            <ul className="divide-y divide-border border-y border-border">
              {visible.map((item) => {
                const p = getProductById(item.productId);
                if (!p) return null;
                const color = getColor(p, item.color);
                return (
                  <li key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-5 py-6">
                    <div className="h-32 w-28 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                      <img src={color.image} alt={p.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="font-display text-xl tracking-wide text-foreground">
                            {p.name.toUpperCase()}
                          </h2>
                          <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                            {color.name} · Size {item.size}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-foreground">{formatPrice(p)}</p>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-4">
                        <div className="inline-flex items-center rounded-full border border-border">
                          <button type="button" aria-label="Decrease" onClick={() => updateQty(item.productId, item.size, item.color, item.qty - 1)} className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground">−</button>
                          <span className="min-w-6 text-center text-xs font-semibold text-foreground">{item.qty}</span>
                          <button type="button" aria-label="Increase" onClick={() => updateQty(item.productId, item.size, item.color, item.qty + 1)} className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground">+</button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId, item.size, item.color)}
                          className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <aside className="h-fit rounded-2xl border border-border bg-card-premium p-6 lg:sticky lg:top-32">
              <h2 className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                Order Summary
              </h2>
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="text-foreground">{subtotal > 0 ? `$${(subtotal / 100).toFixed(2)}` : "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd className="text-muted-foreground">Calculated at checkout</dd>
                </div>
              </dl>
              <div className="mt-6 border-t border-border pt-6">
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Total</span>
                  <span className="font-display text-2xl text-foreground">
                    {subtotal > 0 ? `$${(subtotal / 100).toFixed(2)}` : "—"}
                  </span>
                </div>
              </div>
              <Link
                to="/checkout"
                className="btn-premium mt-6 inline-flex w-full justify-center rounded-full bg-primary px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground"
              >
                Checkout
              </Link>
              <Link
                to="/shop"
                className="mt-3 inline-flex w-full justify-center rounded-full border border-border px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
              >
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
