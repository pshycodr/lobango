import { usePermissionsStore } from "@/store/usePermissionsStore";
import React from "react";

export interface CartSummaryProps {
  subtotal: number;
  total: number;
  deliveryFee: number;
  itemCount: number;
  onCheckout: () => void;
}

export function CartSummary({
  subtotal,
  total,
  deliveryFee,
  itemCount,
  onCheckout,
}: CartSummaryProps) {
  const newOrders = usePermissionsStore((state) => state.newOrders);

  return (
    <div className="sticky top-4 rounded-lg border border-(--white-alpha-10) bg-(--eerie-black-2) p-4">
      <h2 className="font-playfair mb-4 text-lg font-semibold text-(--white)">
        Order Summary
      </h2>

      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-inter text-(--quick-silver)">
            Items ({itemCount})
          </span>
          <span className="font-inter text-(--white)">
            ₹{subtotal.toFixed(0)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="font-inter text-(--quick-silver)">Delivery Fee</span>
          <span className="font-inter text-(--white)">
            ₹{deliveryFee.toFixed(0)}
          </span>
        </div>

        <div className="border-t border-(--white-alpha-20) pt-2">
          <div className="flex items-center justify-between">
            <span className="font-playfair text-base font-semibold text-(--white)">
              Total
            </span>
            <span className="font-playfair text-lg font-bold text-(--gold-crayola)">
              ₹{total.toFixed(0)}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onCheckout}
        disabled={!newOrders}
        className={`font-inter w-full rounded-lg bg-(--gold-crayola) py-2.5 text-sm font-semibold text-(--smoky-black-1) transition-all duration-200 hover:bg-[hsl(38,61%,68%)] active:scale-98 ${
          !newOrders ? "cursor-not-allowed opacity-50" : ""
        }`}
      >
        Proceed to Checkout
      </button>

      <p className="font-inter mt-2 text-center text-xs text-(--quick-silver)">
        Free delivery on orders over ₹299
      </p>
    </div>
  );
}
