import { usePermissionsStore } from '@/store/usePermissionsStore';
import React from 'react';

interface CartSummaryProps {
  subtotal: number;
  total: number;
  deliveryFee: number;
  itemCount: number;
  onCheckout: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ subtotal, total, deliveryFee, itemCount, onCheckout }) => {


  const { newOrders } = usePermissionsStore()

  return (
    <div className="bg-[var(--eerie-black-2)] rounded-lg p-4 border border-[var(--white-alpha-10)] sticky top-4">
      <h2 className="text-[var(--white)] text-lg font-semibold font-playfair mb-4">
        Order Summary
      </h2>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-[var(--quick-silver)] font-inter">Items ({itemCount})</span>
          <span className="text-[var(--white)] font-inter">₹{subtotal.toFixed(0)}</span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-[var(--quick-silver)] font-inter">Delivery Fee</span>
          <span className="text-[var(--white)] font-inter">₹{deliveryFee.toFixed(0)}</span>
        </div>

        <div className="border-t border-[var(--white-alpha-20)] pt-2">
          <div className="flex justify-between items-center">
            <span className="text-[var(--white)] text-base font-playfair font-semibold">Total</span>
            <span className="text-[var(--gold-crayola)] text-lg font-bold font-playfair">
              ₹{total.toFixed(0)}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onCheckout}
        disabled={!newOrders}
        className={`w-full py-2.5 rounded-lg text-sm font-semibold font-inter transition-all duration-200 active:scale-98
    bg-[var(--gold-crayola)] text-[var(--smoky-black-1)] hover:bg-[hsl(38,61%,68%)]
    ${!newOrders ? "opacity-50 cursor-not-allowed" : ""}
  `}
      >
        Proceed to Checkout
      </button>

      <p className="text-[var(--quick-silver)] text-xs text-center mt-2 font-inter">
        Free delivery on orders over ₹299
      </p>
    </div>
  );
};