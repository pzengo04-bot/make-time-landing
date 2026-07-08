# Roo Athletics — Storefront (Showcase Mode)

Build a real e-commerce front end around one product (Roo Performance Tee). Cart and checkout screens are fully designed and interactive, but no payment provider is wired up yet — the "Place order" button confirms with a "You'll be notified when we launch" screen and stores the email in the existing waitlist table.

Product image + copy will be added by you after the scaffold is in place (placeholders wired up so swapping is trivial).

## New routes

```text
/            existing landing (kept; nav updated, links to /shop)
/shop        product grid (currently one tile: Performance Tee)
/shop/performance-tee   product detail page (gallery, size picker, add to cart)
/cart        cart drawer route + full cart page
/checkout    checkout form (contact, shipping, review) — non-functional submit
/checkout/confirmed   post-submit thank-you / waitlist confirmation
```

Each route gets its own `head()` with unique title + description + og tags per Tanstack routing rules.

## Components

- `SiteHeader` — logo, nav (Shop, About, Contact-ish), cart icon with item-count badge
- `SiteFooter` — reuse existing footer (Instagram link stays)
- `ProductCard` — image, name, price, "View"
- `ProductGallery` — main image + thumbnail strip
- `SizePicker` — XS–XXL pills, selected state, "Size guide" link (opens modal, placeholder copy)
- `AddToCartButton` — adds to cart store, animates count
- `CartDrawer` — slide-in from right, items, subtotal, "View cart" / "Checkout"
- `CartLineItem` — image, name, size, qty stepper, remove
- `CheckoutForm` — email, shipping address, order notes; validated with zod + react-hook-form
- `OrderSummary` — sticky sidebar with items + totals

## Cart state

- Client-only Zustand store persisted to `localStorage` (`roo-cart-v1`).
- Shape: `{ items: { productId, size, qty }[], addItem, removeItem, updateQty, clear }`.
- Product catalog is a static TS module (`src/lib/catalog.ts`) — one product entry with sizes, price, description placeholder. Trivial to add more later.

## Checkout behavior (non-functional)

- Form validates and shows an inline order summary.
- Submit does NOT charge anything. It:
  1. Posts email to existing `/api/public/waitlist` endpoint (already exists; no backend changes).
  2. Clears the cart.
  3. Navigates to `/checkout/confirmed` with a friendly "Reserved — we'll email when Roo Athletics launches" message.
- A visible banner at the top of `/checkout` reads: "Preview mode — no payment will be taken." So it's clear this isn't live commerce.

## Product content (placeholders until you provide)

- Product photo: placeholder gradient tile with "PHOTO" label until you attach the tee image. Once attached I'll upload it via Lovable Assets and swap in `catalog.ts`.
- Copy: name "Performance Tee", price `$—`, description "Details coming soon.", sizes XS/S/M/L/XL/XXL, one color "Black". You can fill in real price / fabric / colors later — one edit to `catalog.ts`.

## Design

Match existing Roo Athletics landing aesthetic (Anton display, Inter body, current color tokens in `styles.css`). No new fonts, no palette changes. Cart drawer + product page follow the same minimal, athletic-editorial feel as the current hero.

## Out of scope (explicitly)

- No Stripe / Shopify / Paddle integration.
- No inventory tracking, no order database, no admin.
- No account/login.
- No shipping-rate calculation, no taxes, no discount codes.

When you're ready to go live, the next step will be picking a provider (Shopify recommended for physical apparel) and wiring the existing checkout UI + catalog to it.

## Technical notes

- `bun add zustand react-hook-form @hookform/resolvers zod` (zod already present via existing waitlist).
- All routes are public and prerender-safe (no protected server functions in loaders).
- Cart store reads `localStorage` inside `useEffect` / hydrated guard to avoid SSR mismatch.
