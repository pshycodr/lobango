import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItem = {
    id: string;
    name: string;
    price: number;
    description: string;
    quantity: number;
};

interface CartStore {
    cart: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    updateQuantity: (id: string, quantity: number) => void;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            cart: [],
            addItem: (item) =>
                set((state) => {
                    const exists = state.cart.find((i) => i.id === item.id);
                    if (exists) {
                        return {
                            cart: state.cart.map((i) =>
                                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
                            ),
                        };
                    }
                    return { cart: [...state.cart, item] };
                }),
            removeItem: (id) => set((state) => ({ cart: state.cart.filter((i) => i.id !== id) })),
            clearCart: () => set({ cart: [] }),
            updateQuantity: (id, quantity) =>
                set((state) => ({
                    cart: state.cart.map((i) =>
                        i.id === id ? { ...i, quantity } : i
                    ),
                })),
        }),
        {
            name: "restaurant-cart", 
        }
    )
);
