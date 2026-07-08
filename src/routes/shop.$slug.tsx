import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartDrawer } from "@/components/cart-drawer";
import { getProductBySlug, formatPrice, type ProductSize } from "@/lib/catalog";
import { useCart } from "@/lib/cart-store";

export const Route = createFileRoute("/shop/$slug")({
  loader: ({ params }) => {
    const product = getProductBySlug(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Product not found — Roo Athletics" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { product } = loaderData;
    const title = `${product.name} — Roo Athletics`;
    return {
      meta: [
        { title },
        { name: "description", content: product.tagline },
        { property: "og:title", content: title },
        { property: "og:description", content: product.tagline },
        { property: "og:image", content: product.images[0] },
        { name: "twitter:image", content: product.images[0] },
      ],
    };
  },
  notFoundComponent: ProductNotFound,
  errorComponent: ProductError,
  component: ProductDetail,
});

function ProductNotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <CartDrawer />
      <main className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-40 pb-24 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Nothing here
        </p>
        <h1 className="mt-3 font-display text-5xl tracking-tight text-foreground sm:text-6xl">
          PRODUCT NOT FOUND.
        </h1>
        <Link
          to="/shop"
          className="btn-premium mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground"
        >
          Back to shop
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

function ProductError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  console.error(error);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 pt-40 pb-24 text-center">
        <h1 className="font-display text-4xl text-foreground">Something broke.</h1>
        <button
          type="button"
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="btn-premium mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground"
        >
          Try again
        </button>
      </main>
      <SiteFooter />
    </div>
  );
}

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const addItem = useCart((s) => s.addItem);
  const [size, setSize] = useState<ProductSize | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { useCart.persist.rehydrate(); }, []);

  const onAdd = () => {
    if (!size) {
      setError("Choose a size first.");
      return;
    }
    setError(null);
    addItem(product.id, size, 1);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <CartDrawer />

      <main className="mx-auto max-w-7xl px-6 pt-32 pb-24 sm:pt-36">
        <nav className="mb-8 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          <Link to="/shop" className="transition-colors hover:text-foreground">Shop</Link>
          <span className="mx-3">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          {/* Gallery */}
          <div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-muted">
              <img
                src={product.images[activeImage]}
                alt={`${product.name} view ${activeImage + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
            {product.images.length > 1 ? (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {product.images.map((src: string, i: number) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    aria-label={`View image ${i + 1}`}
                    className={`aspect-square overflow-hidden rounded-lg border transition-colors ${
                      activeImage === i ? "border-foreground" : "border-border hover:border-foreground/40"
                    }`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {/* Info */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              {product.color}
            </p>
            <h1 className="mt-3 font-display text-5xl leading-none tracking-tight text-foreground sm:text-6xl">
              {product.name.toUpperCase()}
            </h1>
            <p className="mt-4 text-sm uppercase tracking-[0.22em] text-foreground">
              {formatPrice(product)}
            </p>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            {/* Size */}
            <div className="mt-10">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Size</p>
                <button
                  type="button"
                  className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  onClick={() => alert("Size guide coming soon.")}
                >
                  Size guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s: ProductSize) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`min-w-14 rounded-full border px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition-colors ${
                      size === s
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-foreground hover:border-foreground/50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={onAdd}
              className="btn-premium mt-8 inline-flex w-full justify-center rounded-full bg-primary px-6 py-5 text-xs font-semibold uppercase tracking-[0.22em] text-primary-foreground"
            >
              Add to Bag
            </button>
            {error ? (
              <p className="mt-3 text-xs text-red-400" role="alert">{error}</p>
            ) : null}
            <p className="mt-4 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Preview mode — no charges will be taken at checkout.
            </p>

            {/* Details */}
            <div className="mt-12 border-t border-border pt-8">
              <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Details</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {product.details.map((d: string) => (
                  <li key={d} className="flex gap-3">
                    <span className="mt-2 h-[3px] w-[3px] shrink-0 rounded-full bg-muted-foreground" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
