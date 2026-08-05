import { useMemo } from "react";
import menuData from "@/data/menu.json";
import { CartItem } from "@/types/cart";

function getMenuItemPrice(id: string): number {
  for (const category of menuData.menu) {
    const item = category.items.find((i) => i.id === id);
    if (item) return item.price;
  }
  return 0;
}

export function useOrderCalculations(cart: CartItem[]) {
  return useMemo(() => {
    const subtotal = cart.reduce((sum, item) => {
      const realPrice = getMenuItemPrice(item.id);
      return sum + realPrice * Number(item.quantity);
    }, 0);

    const deliveryFee = subtotal > 299 ? 0 : 30;
    const total = subtotal + deliveryFee;

    return {
      subtotal,
      deliveryFee,
      total,
    };
  }, [cart]);
}
