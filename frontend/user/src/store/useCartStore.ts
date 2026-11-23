import { create } from 'zustand';
import { Product, CartItem } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [
    // Pre-populate with one item for demonstration
    {
      product: {
        id: 'prod_001',
        categoryId: 'cat_01',
        title: 'Organic Kolar Ashwagandha Root Powder',
        description: 'Pure Withania somnifera cultivated in the fertile red soil of Kolar.',
        priceINR: 420,
        stockQuantity: 45,
        unit: '150 grams',
        originRegion: 'Kolar, Karnataka',
        isOrganicCertified: true,
        doshaRecommendation: ['Vata', 'Kapha'],
        rating: 4.9,
        reviewCount: 142,
        imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=500',
        ingredients: ['100% Organic Ashwagandha Root'],
        isAvailable: true,
      },
      quantity: 1,
    },
  ],

  addItem: (product, quantity = 1) => {
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
          ),
        };
      }
      return { items: [...state.items, { product, quantity }] };
    });
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((i) => i.product.id !== productId),
    }));
  },

  updateQuantity: (productId, quantity) => {
    set((state) => {
      if (quantity <= 0) {
        return { items: state.items.filter((i) => i.product.id !== productId) };
      }
      return {
        items: state.items.map((i) =>
          i.product.id === productId ? { ...i, quantity } : i
        ),
      };
    });
  },

  clearCart: () => set({ items: [] }),

  getTotalItems: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().items.reduce((sum, item) => sum + item.product.priceINR * item.quantity, 0);
  },
}));
