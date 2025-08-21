import OrderSummary from '@/components/Checkout/OrderSummary';
import PlaceOrderButton from '@/components/Checkout/PlaceOrderButton';
import { CheckoutValidation } from './CheckoutValidation';
import { CartItem } from '@/types/cart';
import { Address } from '@/types/address';

interface CheckoutMainContentProps {
    cart: CartItem[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemoveItem: (id: string) => void;
    onPlaceOrder: () => void;
    isPaymentLoading: boolean;
    // Validation props
    selectedAddress: Address | undefined;
    locationAllowsCheckout: boolean;
    locationBlocksCheckout: boolean;
    newOrders: boolean | null;
    isLocationLoading: boolean;
    loadingState: { type: string };
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
    loadingState
}: CheckoutMainContentProps) {
    const isCheckoutAllowed = (
        selectedAddress && 
        locationAllowsCheckout && 
        newOrders !== false && 
        !isLocationLoading &&
        loadingState.type === 'none'
    );

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

            <div className='flex flex-col items-center w-full h-15'>
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