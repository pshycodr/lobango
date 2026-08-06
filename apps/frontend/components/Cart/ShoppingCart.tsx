"use client";

import React, { useEffect } from "react";
import { CartItemCard } from "./CartItemCard";
import { CartSummary } from "./CartSummary";
import { useCartStore } from "@/store/useCartStore"; // adjust path if needed
import { useRouter } from "next/navigation";
import { usePermissionsStore } from "@/store/usePermissionsStore";
import { useOrderCalculations } from "@/hooks/useOrderCalculations";

export const ShoppingCart: React.FC = () => {
  const cartItems = useCartStore((state) => state.cart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const { cart } = useCartStore();
  const router = useRouter();
  const { newOrders, fetchPermissions } = usePermissionsStore();

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      removeItem(id);
    } else {
      updateQuantity(id, quantity);
    }
  };

  const { subtotal, deliveryFee, total } = useOrderCalculations(cart);

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleCheckout = () => {
    console.log("Proceeding to checkout with items:", cartItems);

    router.push("/checkout");
    return null;
  };

  return (
    <div className="min-h-screen bg-(--smoky-black-1)">
      {/* Header */}
      <div className="border-b border-(--white-alpha-10) bg-(--eerie-black-1)">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-playfair mb-2 text-3xl font-semibold text-(--gold-crayola) md:text-4xl">
              Your Cart
            </h1>
            <p className="font-inter text-sm text-(--quick-silver)">
              {itemCount} {itemCount === 1 ? "item" : "items"} ready for
              checkout
            </p>
          </div>
        </div>
      </div>

      {newOrders === false ? (
        <div className="flex w-full items-center justify-center">
          <p className="mt-5 flex items-center justify-center gap-3 rounded-md border-2 border-red-500 p-4 text-center text-xl font-semibold tracking-tighter text-red-500">
            Online orders are currently closed.
          </p>
        </div>
      ) : (
        ""
      )}

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-3">
              {cartItems.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-(--eerie-black-2)">
                    <span className="text-2xl">🛒</span>
                  </div>
                  <h3 className="font-playfair mb-1 text-lg font-semibold text-(--white)">
                    Your cart is empty
                  </h3>
                  <p className="font-inter text-sm text-(--quick-silver)">
                    Add some delicious items to get started
                  </p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                  />
                ))
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 lg:mt-0">
            {cartItems.length > 0 && (
              <CartSummary
                subtotal={subtotal}
                total={total}
                deliveryFee={deliveryFee}
                itemCount={itemCount}
                onCheckout={handleCheckout}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
