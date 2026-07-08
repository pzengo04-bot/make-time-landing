import blackAsset from "@/assets/roo-performance-tee-black.png.asset.json";
import navyAsset from "@/assets/roo-performance-tee-navy.png.asset.json";

export type ProductSize = "XS" | "S" | "M" | "L" | "XL" | "XXL";
export type ProductColor = { name: string; hex: string; image: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number; // in cents; 0 = "TBD"
  priceLabel?: string; // override display when price is TBD
  tagline: string;
  description: string;
  details: string[];
  colors: ProductColor[];
  sizes: ProductSize[];
};

export const products: Product[] = [
  {
    id: "roo-performance-tee",
    slug: "performance-tee",
    name: "Performance Tee",
    price: 0,
    priceLabel: "Price TBD",
    tagline: "Lightweight. Breathable. Built for training.",
    description:
      "The Roo Performance Tee is our foundational training piece — cut for movement, weighted for everyday, and finished with the details you notice after the first wear. Details coming soon.",
    details: [
      "Athletic cut — moves with you, not against you",
      "Breathable premium fabric (spec coming soon)",
      "Reinforced stitching at high-wear seams",
      "Pre-shrunk for a consistent fit wash after wash",
    ],
    colors: [
      { name: "Black", hex: "#111111", image: blackAsset.url },
      { name: "Navy", hex: "#1b2340", image: navyAsset.url },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
];

export const getProductBySlug = (slug: string) =>
  products.find((p) => p.slug === slug);

export const getProductById = (id: string) =>
  products.find((p) => p.id === id);

export const getColor = (product: Product, name: string) =>
  product.colors.find((c) => c.name === name) ?? product.colors[0];

export const formatPrice = (product: Product) => {
  if (!product.price) return product.priceLabel ?? "—";
  return `$${(product.price / 100).toFixed(2)}`;
};
