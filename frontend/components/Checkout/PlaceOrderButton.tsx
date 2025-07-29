import { useState } from 'react';

interface PlaceOrderButtonProps {
  onPlaceOrder: () => void;
  disabled?: boolean;
  loading?: boolean;
  total: number;
}

export default function PlaceOrderButton({ 
  onPlaceOrder, 
  disabled = false, 
  loading = false,
  total 
}: PlaceOrderButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    if (!disabled && !loading) {
      onPlaceOrder();
    }
  };

  const formatPrice = (price: number) => `${price.toFixed(2)}`;

  return (
    <div className="p-6">
      <button
        onClick={handleClick}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        disabled={disabled || loading}
        className={`
          w-full h-14 rounded-xl text-lg font-bold leading-normal tracking-[0.015em]
          transition-all duration-200 transform cursor-pointer
          ${disabled || loading 
            ? 'bg-[var(--davys-grey)] text-[var(--quick-silver)] cursor-not-allowed' 
            : `bg-[var(--gold-crayola)] text-[var(--smoky-black-1)] hover:bg-[var(--gold-crayola)] hover:brightness-110 ${
                isPressed ? 'scale-95 brightness-90' : 'hover:scale-[1.02]'
              }`
          }
          shadow-lg hover:shadow-xl
        `}
      >
        <span className="truncate">
          {loading ? 'Processing...' : `Place Order • ₹${formatPrice(total)}`}
        </span>
      </button>
    </div>
  );
}