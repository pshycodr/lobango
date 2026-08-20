import { MenuView } from "@/components/Menu/MenuView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu | Lobango",
  description: "Explore our handcrafted delicious multi-cuisine menu.",
};

export default function MenuPage() {
  return <MenuView />;
}
