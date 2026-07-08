import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useCart, cartItemCount } from "@/lib/cart-store";
import { getProductById, formatPrice } from "@/lib/catalog";

export function CartDrawer() {
  const items = useCart((s) => s.items);
  const open = useCart((s) => s.drawerOpen);
  const close = useCart((s) => s.closeDrawer);
  const removeItem = useCart((s) => s.removeItem);
  const updateQty = useCart((s) => s.updateQty);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    useCart.persist.rehydrate();
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  const visibleItems = hydrated ? items : [];
  const count = cartItemCount(visibleItems);
  const subtotal = visibleItems.reduce((sum, i) => {
    const p = getProductById(i.productId);
    return sum + (p?.price ?? 0) * i.qty;
  }, 0);

  return (
    <>
      {/* backdrop */}
      <div
        onClick={close}
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-label="Shopping cart"
        aria-hidden={!open}
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-background shadow-elegant transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              Your Bag
            </p>
            <h2 className="mt-1 font-display text-2xl tracking-wide text-foreground">
              {count} {count === 1 ? "ITEM" : "ITEMS"}
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close cart"
            className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {visibleItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                Your bag is empty
              </p>
              <Link
                to="/shop"
                onClick={close}
                className="btn-premium mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground"
              >
                Browse the Shop
              </Link>
            </div>
          ) : (
            <ul className="space-y-6">
              {visibleItems.map((item) => {
                const p = getProductById(item.productId);
                if (!p) return null;
                return (
                  <li key={`${item.productId}-${item.size}`} className="flex gap-4">
                    <div className="h-24 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-display text-lg tracking-wide text-foreground">
                            {p.name.toUpperCase()}
                          </h3>
                          <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                            {p.color} · Size {item.size}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          {formatPrice(p)}
                        </p>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="inline-flex items-center rounded-full border border-border">
                          <button
                            type="button"
                            onClick={() => updateQty(item.productId, item.size, item.qty - 1)}
                            aria-label="Decrease quantity"
                            className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground"
                          >−</button>
                          <span className="min-w-6 text-center text-xs font-semibold text-foreground">{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.productId, item.size, item.qty + 1)}
                            aria-label="Increase quantity"
                            className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground"
                          >+</button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId, item.size)}
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
          )}
        </div>

        {visibleItems.length > 0 ? (
          <div className="border-t border-border px-6 py-6">
            <div className="flex items-center justify-between text-sm">
              <span className="uppercase tracking-[0.22em] text-muted-foreground">Subtotal</span>
              <span className="font-medium text-foreground">
                {subtotal > 0 ? `$${(subtotal / 100).toFixed(2)}` : "—"}
              </span>
            </div>
            <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Shipping and taxes calculated at checkout
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <Link
                to="/checkout"
                onClick={close}
                className="btn-premium inline-flex justify-center rounded-full bg-primary px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground"
              >
                Checkout
              </Link>
              <Link
                to="/cart"
                onClick={close}
                className="inline-flex justify-center rounded-full border border-border px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
              >
                View Full Cart
              </Link>
            </div>
          </div>
        ) : null}
      </aside>
    </>
  );
}
