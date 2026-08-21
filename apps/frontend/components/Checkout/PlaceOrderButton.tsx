import { usePermissionsStore } from "@/store/usePermissionsStore";
import { useState } from "react";

export interface PlaceOrderButtonProps {
  onPlaceOrder: () => void;
  disabled?: boolean;
  loading?: boolean;
  total: number;
}

export function PlaceOrderButton({
  onPlaceOrder,
  disabled = false,
  loading = false,
  total,
}: PlaceOrderButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const newOrders = usePermissionsStore((state) => state.newOrders);

  const isButtonDisabled = disabled || loading || newOrders === false;

  const handleClick = () => {
    if (!isButtonDisabled) {
      onPlaceOrder();
    }
  };

  const formatPrice = (price: number) => `${price.toFixed(2)}`;

  return (
    <div className="fixed bottom-0.5 z-10 w-full rounded-xl p-6 backdrop-blur-sm sm:w-xl">
      <button
        onClick={handleClick}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        disabled={isButtonDisabled}
        className={`h-14 w-full transform cursor-pointer rounded-xl text-lg leading-normal font-bold tracking-[0.015em] shadow-lg transition-all duration-200 hover:shadow-xl ${
          isButtonDisabled
            ? "cursor-not-allowed bg-(--davys-grey) text-(--quick-silver)"
            : `bg-(--gold-crayola) text-(--smoky-black-1) hover:brightness-110 ${
                isPressed ? "scale-95 brightness-90" : "hover:scale-[1.02]"
              }`
        }`}
      >
        <span className="truncate">
          {loading ? "Processing..." : `Place Order • ₹${formatPrice(total)}`}
        </span>
      </button>
    </div>
  );
}
