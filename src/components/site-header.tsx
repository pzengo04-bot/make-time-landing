import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useCart, cartItemCount } from "@/lib/cart-store";

export function SiteHeader() {
  const items = useCart((s) => s.items);
  const openDrawer = useCart((s) => s.openDrawer);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    useCart.persist.rehydrate();
    setHydrated(true);
  }, []);

  const count = hydrated ? cartItemCount(items) : 0;

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link
          to="/"
          className="font-display text-xl tracking-[0.18em] text-foreground sm:text-2xl"
        >
          ROO <span className="text-muted-foreground">ATHLETICS</span>
        </Link>
        <nav className="hidden items-center gap-10 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground md:flex">
          <Link
            to="/shop"
            activeProps={{ className: "text-foreground" }}
            className="transition-colors hover:text-foreground"
          >
            Shop
          </Link>
          <Link
            to="/"
            hash="why"
            className="transition-colors hover:text-foreground"
          >
            About
          </Link>
          <Link
            to="/"
            hash="waitlist"
            className="transition-colors hover:text-foreground"
          >
            Waitlist
          </Link>
        </nav>
        <button
          type="button"
          onClick={openDrawer}
          aria-label={`Open cart (${count} items)`}
          className="relative inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-foreground/40 sm:text-xs"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <span>Cart</span>
          {count > 0 ? (
            <span className="ml-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-foreground px-1.5 text-[10px] font-bold text-background">
              {count}
            </span>
          ) : null}
        </button>
      </div>
    </header>
  );
}
