import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartDrawer } from "@/components/cart-drawer";
import { products, formatPrice } from "@/lib/catalog";

export const Route = createFileRoute("/shop/")({
  head: () => ({
    meta: [
      { title: "Shop — Roo Athletics" },
      {
        name: "description",
        content:
          "Shop the Roo Athletics collection. Premium athletic essentials, cut for movement and built to outlast the mileage.",
      },
      { property: "og:title", content: "Shop — Roo Athletics" },
      {
        property: "og:description",
        content:
          "Premium athletic essentials from Roo Athletics. Built for the ones who show up.",
      },
    ],
  }),
  component: ShopIndex,
});

function ShopIndex() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <CartDrawer />

      <main className="mx-auto max-w-7xl px-6 pt-32 pb-24 sm:pt-40">
        <div className="mb-14 max-w-2xl">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
            The Collection
          </p>
          <h1 className="mt-4 font-display text-6xl leading-none tracking-tight text-foreground sm:text-7xl md:text-8xl">
            SHOP.
          </h1>
          <p className="mt-6 text-base text-muted-foreground sm:text-lg">
            Every piece Roo makes is built for the ones who show up — even
            when life gets busy.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Link
              key={p.id}
              to="/shop/$slug"
              params={{ slug: p.slug }}
              className="card-shimmer group relative overflow-hidden rounded-2xl border border-border bg-card-premium transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-foreground/30"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                <img
                  src={p.colors[0].image}
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                />
                <span className="absolute right-4 top-4 rounded-full border border-border bg-background/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground backdrop-blur">
                  Preview
                </span>
              </div>
              <div className="flex items-baseline justify-between p-6">
                <div>
                  <h2 className="font-display text-2xl tracking-wide text-foreground">
                    {p.name.toUpperCase()}
                  </h2>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {p.colors.length} {p.colors.length === 1 ? "color" : "colors"}
                  </p>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {formatPrice(p)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
