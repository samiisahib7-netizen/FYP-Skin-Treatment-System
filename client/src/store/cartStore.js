/**
 * Cart store — global shopping cart.
 * Persists to localStorage so refresh keeps items.
 *
 * Item shape: { productId, name, price, image, quantity, stock }
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      add: (item, qty = 1) => {
        const items = get().items.slice();
        const existing = items.find((i) => i.productId === item.productId);
        if (existing) {
          existing.quantity = Math.min(existing.quantity + qty, item.stock ?? Infinity);
        } else {
          items.push({ ...item, quantity: Math.min(qty, item.stock ?? Infinity) });
        }
        set({ items });
      },

      remove: (productId) => set({ items: get().items.filter((i) => i.productId !== productId) }),

      setQty: (productId, quantity) => {
        const items = get().items
          .map((i) => (i.productId === productId ? { ...i, quantity: Math.max(1, quantity) } : i))
          .filter((i) => i.quantity > 0);
        set({ items });
      },

      clear: () => set({ items: [] }),

      // Derived helpers
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.quantity * i.price, 0),
    }),
    { name: 'skin-treatment-cart' }
  )
);

export default useCartStore;
