import { Address } from '@/types/address';

interface CheckoutValidationProps {
    selectedAddress: Address | undefined;
    locationAllowsCheckout: boolean;
    locationBlocksCheckout: boolean;
    newOrders: boolean | null;
    isLocationLoading: boolean;
    loadingState: { type: string };
    className?: string;
}

export function CheckoutValidation({
    selectedAddress,
    locationAllowsCheckout,
    locationBlocksCheckout,
    newOrders,
    isLocationLoading,
    loadingState,
    className = ""
}: CheckoutValidationProps) {
    const isCheckoutAllowed = (
        selectedAddress && 
        locationAllowsCheckout && 
        newOrders !== false && 
        !isLocationLoading &&
        loadingState.type === 'none'
    );

    if (isCheckoutAllowed) return null;

    return (
        <div className={`mt-2 text-center ${className}`}>
            {!selectedAddress && (
                <p className="text-sm text-gray-400">Please select a delivery address</p>
            )}
            {locationBlocksCheckout && (
                <p className="text-sm text-red-400">Outside delivery area</p>
            )}
            {newOrders === false && (
                <p className="text-sm text-red-400">Online orders are currently closed</p>
            )}
            {isLocationLoading && (
                <p className="text-sm text-blue-400">Checking location...</p>
            )}
        </div>
    );
}
