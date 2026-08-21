import { OrderSummary } from "@/components/Checkout/OrderSummary";
import { PlaceOrderButton } from "@/components/Checkout/PlaceOrderButton";
import type { Address } from "@/types/address";
import type { CartItem } from "@/types/cart";
import type { LoadingState } from "@/types/checkout";
import { CheckoutValidation } from "./CheckoutValidation";

export interface CheckoutMainContentProps {
  cart: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onPlaceOrder: () => void;
  isPaymentLoading: boolean;
  selectedAddress: Address | undefined;
  locationAllowsCheckout?: boolean;
  locationBlocksCheckout?: boolean;
  newOrders: boolean | null;
  isLocationLoading?: boolean;
  loadingState: LoadingState;
}

export function CheckoutMainContent({
  cart,
  subtotal,
  deliveryFee,
  total,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  isPaymentLoading,
  selectedAddress,
  locationAllowsCheckout,
  locationBlocksCheckout,
  newOrders,
  isLocationLoading,
  loadingState,
}: CheckoutMainContentProps) {
  const isCheckoutAllowed =
    Boolean(selectedAddress) &&
    newOrders !== false &&
    loadingState.type === "none";

  return (
    <div className="lg:col-span-2">
      <OrderSummary
        items={cart}
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        total={total}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
      />

      <div className="flex h-15 w-full flex-col items-center">
        <PlaceOrderButton
          onPlaceOrder={onPlaceOrder}
          loading={isPaymentLoading}
          total={total}
          disabled={!isCheckoutAllowed}
        />

        <CheckoutValidation
          selectedAddress={selectedAddress}
          locationAllowsCheckout={locationAllowsCheckout}
          locationBlocksCheckout={locationBlocksCheckout}
          newOrders={newOrders}
          isLocationLoading={isLocationLoading}
          loadingState={loadingState}
        />
      </div>
    </div>
  );
}
