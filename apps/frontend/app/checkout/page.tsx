import { CheckoutView } from "@/components/Checkout/CheckoutView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | Lobango",
  description: "Complete your delicious food order.",
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
