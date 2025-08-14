import { useMemo } from 'react';
import { CartItem } from '@/types/cart';

export function useOrderCalculations(cart: CartItem[]) {
    return useMemo(() => {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = subtotal > 299 ? 0 : 30;
        const taxRate = 0.08;
        const tax = subtotal * taxRate;
        const total = subtotal + deliveryFee + tax;

        return {
            subtotal,
            deliveryFee,
            tax,
            total
        };
    }, [cart]);
}