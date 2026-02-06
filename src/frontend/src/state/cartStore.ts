import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';

interface CartItem {
  productId: bigint;
  quantity: number;
  unitPriceAtOrder: bigint;
}

interface CartStore {
  items: CartItem[];
  addItem: (productId: bigint, quantity: number, unitPrice: bigint) => void;
  removeItem: (productId: bigint) => void;
  updateQuantity: (productId: bigint, quantity: number) => void;
  getTotalEstimate: () => bigint;
  clearCart: () => void;
}

// Serializable version of CartItem for storage
interface SerializableCartItem {
  productId: string;
  quantity: number;
  unitPriceAtOrder: string;
}

interface SerializableCartStore {
  items: SerializableCartItem[];
}

// Custom storage with bigint serialization
const customStorage: PersistStorage<CartStore> = {
  getItem: (name) => {
    const str = localStorage.getItem(name);
    if (!str) return null;
    
    try {
      const parsed: { state: SerializableCartStore; version?: number } = JSON.parse(str);
      // Convert string representations back to bigint
      const state: CartStore = {
        items: parsed.state.items.map((item) => ({
          productId: BigInt(item.productId),
          quantity: item.quantity,
          unitPriceAtOrder: BigInt(item.unitPriceAtOrder),
        })),
        addItem: () => {},
        removeItem: () => {},
        updateQuantity: () => {},
        getTotalEstimate: () => BigInt(0),
        clearCart: () => {},
      };
      return {
        state,
        version: parsed.version,
      };
    } catch (error) {
      console.error('Error parsing cart storage:', error);
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      // Convert bigint to string for serialization
      const serializable: { state: SerializableCartStore; version?: number } = {
        state: {
          items: value.state.items.map((item) => ({
            productId: item.productId.toString(),
            quantity: item.quantity,
            unitPriceAtOrder: item.unitPriceAtOrder.toString(),
          })),
        },
        version: value.version,
      };
      localStorage.setItem(name, JSON.stringify(serializable));
    } catch (error) {
      console.error('Error saving cart storage:', error);
    }
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId, quantity, unitPrice) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.productId === productId);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
              ),
            };
          }
          return {
            items: [...state.items, { productId, quantity, unitPriceAtOrder: unitPrice }],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
        }));
      },

      getTotalEstimate: () => {
        const items = get().items;
        return items.reduce((total, item) => total + item.unitPriceAtOrder * BigInt(item.quantity), BigInt(0));
      },

      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'cart-storage',
      storage: customStorage,
    }
  )
);
