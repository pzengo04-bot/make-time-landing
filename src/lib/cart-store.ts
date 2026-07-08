import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ProductSize } from "./catalog";

export type CartItem = {
  productId: string;
  size: ProductSize;
  color: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  drawerOpen: boolean;
  addItem: (productId: string, size: ProductSize, color: string, qty?: number) => void;
  removeItem: (productId: string, size: ProductSize, color: string) => void;
  updateQty: (productId: string, size: ProductSize, color: string, qty: number) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      drawerOpen: false,
      addItem: (productId, size, color, qty = 1) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === productId && i.size === size && i.color === color,
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === productId && i.size === size && i.color === color
                  ? { ...i, qty: i.qty + qty }
                  : i,
              ),
              drawerOpen: true,
            };
          }
          return {
            items: [...state.items, { productId, size, color, qty }],
            drawerOpen: true,
          };
        }),
      removeItem: (productId, size, color) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.size === size && i.color === color),
          ),
        })),
      updateQty: (productId, size, color, qty) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.productId === productId && i.size === size && i.color === color
                ? { ...i, qty: Math.max(0, qty) }
                : i,
            )
            .filter((i) => i.qty > 0),
        })),
      clear: () => set({ items: [] }),
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
    }),
    {
      name: "roo-cart-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      skipHydration: true,
    },
  ),
);

export const cartItemCount = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.qty, 0);
