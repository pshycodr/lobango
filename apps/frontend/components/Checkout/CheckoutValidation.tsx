import type { Address } from "@/types/address";
import type { LoadingState } from "@/types/checkout";

export interface CheckoutValidationProps {
  selectedAddress: Address | undefined;
  locationAllowsCheckout?: boolean;
  locationBlocksCheckout?: boolean;
  newOrders: boolean | null;
  isLocationLoading?: boolean;
  loadingState: LoadingState;
  className?: string;
}

export function CheckoutValidation({
  selectedAddress,
  newOrders,
  loadingState,
  className = "",
}: CheckoutValidationProps) {
  const isCheckoutAllowed =
    Boolean(selectedAddress) &&
    newOrders !== false &&
    loadingState.type === "none";

  if (isCheckoutAllowed) return null;

  return (
    <div className={`mt-2 text-center ${className}`}>
      {!selectedAddress && (
        <p className="text-sm text-gray-400">
          Please select a delivery address
        </p>
      )}
      {newOrders === false && (
        <p className="text-sm text-red-400">
          Online orders are currently closed
        </p>
      )}
    </div>
  );
}
