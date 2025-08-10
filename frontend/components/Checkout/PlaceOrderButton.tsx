import { usePermissionsStore } from '@/store/usePermissionsStore'
import { useState } from 'react'

interface PlaceOrderButtonProps {
  onPlaceOrder: () => void
  disabled?: boolean
  loading?: boolean
  total: number
}

export default function PlaceOrderButton({
  onPlaceOrder,
  disabled = false,
  loading = false,
  total
}: PlaceOrderButtonProps) {
  const [isPressed, setIsPressed] = useState(false)
  const { newOrders } = usePermissionsStore()

  const isButtonDisabled = disabled || loading || !newOrders

  const handleClick = () => {
    if (!isButtonDisabled) {
      onPlaceOrder()
    }
  }

  const formatPrice = (price: number) => `${price.toFixed(2)}`

  return (
    <div className="p-6 fixed bottom-0.5 w-full sm:w-xl z-10 backdrop-blur-sm rounded-xl">
      <button
        onClick={handleClick}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        disabled={isButtonDisabled}
        className={`w-full h-14 rounded-xl text-lg font-bold leading-normal tracking-[0.015em] transition-all duration-200 transform cursor-pointer shadow-lg hover:shadow-xl ${
          isButtonDisabled
            ? 'bg-[var(--davys-grey)] text-[var(--quick-silver)] cursor-not-allowed'
            : `bg-[var(--gold-crayola)] text-[var(--smoky-black-1)] hover:brightness-110 ${
                isPressed ? 'scale-95 brightness-90' : 'hover:scale-[1.02]'
              }`
        }`}
      >
        <span className="truncate">
          {loading ? 'Processing...' : `Place Order • ₹${formatPrice(total)}`}
        </span>
      </button>
    </div>
  )
}
