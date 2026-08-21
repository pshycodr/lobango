import { ShoppingCart } from "@/components/Cart/ShoppingCart";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Cart | Lobango",
  description: "Review items in your cart and proceed to checkout.",
};

export default function CartPage() {
  return (
    <main>
      <ShoppingCart />
    </main>
  );
}
