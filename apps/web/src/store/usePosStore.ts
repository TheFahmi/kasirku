import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  variants?: { id: string; name: string; price: number }[];
}

export interface CartItem extends Product {
  cartKey: string;
  qty: number;
}

interface PosState {
  bizMode: 'retail' | 'fb' | 'service';
  products: Product[];
  cart: CartItem[];
  customers: any[];
  transactions: any[];
  discount: { type: 'Rp' | '%'; value: number };
  
  setBizMode: (mode: 'retail' | 'fb' | 'service') => void;
  setProducts: (products: Product[]) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartKey: string) => void;
  updateCartQty: (cartKey: string, qty: number) => void;
  clearCart: () => void;
  setDiscount: (type: 'Rp' | '%', value: number) => void;
  
  cartSubtotal: () => number;
  cartTotal: () => number;

  fetchProducts: (storeCode?: string) => Promise<void>;
  fetchCustomers: (storeCode?: string) => Promise<void>;
  fetchTransactions: (storeCode?: string) => Promise<void>;
  submitOrder: (paymentMethod: string, amountPaid: number, storeCode?: string) => Promise<boolean>;
}

export const usePosStore = create<PosState>()(
  persist(
    (set, get) => ({
      bizMode: 'retail',
      products: [],
      cart: [],
      customers: [],
      transactions: [],
      discount: { type: 'Rp', value: 0 },

      fetchProducts: async (storeCode = 'kasirku-main') => {
        try {
          const res = await fetch(`http://localhost:3005/products?storeCode=${storeCode}`);
          if (res.ok) set({ products: await res.json() });
        } catch (e) {
          console.error(e);
        }
      },
      
      fetchCustomers: async (storeCode = 'kasirku-main') => {
        try {
          const res = await fetch(`http://localhost:3005/customers?storeCode=${storeCode}`);
          if (res.ok) set({ customers: await res.json() });
        } catch (e) {
          console.error(e);
        }
      },
      
      fetchTransactions: async (storeCode = 'kasirku-main') => {
        try {
          const res = await fetch(`http://localhost:3005/transactions?storeCode=${storeCode}`);
          if (res.ok) set({ transactions: await res.json() });
        } catch (e) {
          console.error(e);
        }
      },

      submitOrder: async (paymentMethod, amountPaid, storeCode = 'kasirku-main') => {
        try {
          const state = get();
          if (state.cart.length === 0) return false;

          const total = state.cartTotal();
          const tx = {
            id: `TX-${Date.now()}`,
            items: state.cart,
            total,
            paymentMethod,
            amountPaid,
            change: amountPaid - total,
            storeCode,
            createdAt: new Date().toISOString()
          };

          const res = await fetch('http://localhost:3005/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tx)
          });

          if (res.ok) {
            state.clearCart();
            return true;
          }
          return false;
        } catch (e) {
          console.error('Failed to submit order', e);
          return false;
        }
      },

      setBizMode: (mode) => set({ bizMode: mode }),
      setProducts: (products) => set({ products }),
      addToCart: (item) => set((state) => {
        const existing = state.cart.find(i => i.cartKey === item.cartKey);
        if (existing) {
          return { cart: state.cart.map(i => i.cartKey === item.cartKey ? { ...i, qty: i.qty + item.qty } : i) };
        }
        return { cart: [...state.cart, item] };
      }),
      removeFromCart: (cartKey) => set((state) => ({ cart: state.cart.filter(i => i.cartKey !== cartKey) })),
      updateCartQty: (cartKey, qty) => set((state) => ({
        cart: state.cart.map(i => i.cartKey === cartKey ? { ...i, qty } : i)
      })),
      clearCart: () => set({ cart: [] }),
      setDiscount: (type, value) => set({ discount: { type, value } }),

      cartSubtotal: () => {
        return get().cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
      },
      cartTotal: () => {
        const sub = get().cartSubtotal();
        const d = get().discount;
        let dist = 0;
        if (d.type === 'Rp') dist = d.value;
        else if (d.type === '%') dist = sub * (d.value / 100);
        return Math.max(0, sub - dist);
      }
    }),
    { name: 'kasirku-pos-store' }
  )
);
