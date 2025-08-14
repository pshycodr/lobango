'use client';

import AddressModal from '@/components/AddressModal/AddressModal';
import CheckoutHeader from '@/components/Checkout/CheckoutHeader';
import DeliveryAddress from '@/components/Checkout/DeliveryAddress';
import OrderSummary from '@/components/Checkout/OrderSummary';
import PaymentConfirmation from '@/components/Checkout/PaymentConfirmation';
import PaymentMethod from '@/components/Checkout/PaymentMethod';
import PlaceOrderButton from '@/components/Checkout/PlaceOrderButton';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import api from '@/lib/axios';
import { useCartStore } from '@/store/useCartStore';
import { usePermissionsStore } from '@/store/usePermissionsStore';
import { Address } from '@/types/address';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

interface PaymentData {
    amount: number;
    paymentId?: string;
    orderId?: string;
    customerName?: string;
}

interface LoadingState {
    type: 'page' | 'payment' | 'verification' | 'none';
    message: string;
}

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, updateQuantity, removeItem, clearCart } = useCartStore();
    const [loadingState, setLoadingState] = useState<LoadingState>({ type: 'page', message: 'Loading checkout...' });
    const [isClient, setIsClient] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(undefined);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
    const [paymentData, setPaymentData] = useState<PaymentData | undefined>(undefined);

    const { newOrders, fetchPermissions } = usePermissionsStore();

    useEffect(() => {
        fetchPermissions()
    }, [])

    useEffect(() => {
        const initializeCheckout = async () => {
            setLoadingState({ type: 'page', message: 'Initializing checkout...' });
            
            try {
                setIsClient(true);

                if (typeof window !== 'undefined') {
                    const savedAddress = localStorage.getItem('selected-address');
                    if (savedAddress) {
                        setSelectedAddress(JSON.parse(savedAddress));
                    }
                }

                // Load Razorpay script
                setLoadingState({ type: 'page', message: 'Loading payment gateway...' });
                await loadRazorpayScript();
                
                // Warm up API
                setLoadingState({ type: 'page', message: 'Preparing services...' });
                await api.get("/").catch((err) => console.error("Warm-up failed", err));
                
                setLoadingState({ type: 'none', message: '' });
            } catch (error) {
                console.error('Checkout initialization failed:', error);
                setLoadingState({ type: 'none', message: '' });
            }
        };

        initializeCheckout();
    }, []);

    const loadRazorpayScript = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            if (window && (window as any).Razorpay) {
                resolve();
                return;
            }

            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Razorpay script'));
            document.body.appendChild(script);
        });
    };

    const { subtotal, deliveryFee, tax, total } = useMemo(() => {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = subtotal > 299 ? 0 : 30;
        const taxRate = 0.08;
        const tax = subtotal * taxRate;
        const total = subtotal + deliveryFee + tax;

        return {
            subtotal,
            deliveryFee,
            tax,
            total
        };
    }, [cart]);

    const handleBack = () => {
        router.back();
    };

    const handleChangeAddress = () => {
        setIsAddressModalOpen(true);
    };

    const handleSelectAddress = (address: Address) => {
        setSelectedAddress(address);
        localStorage.setItem('selected-address', JSON.stringify(address));
    };

    const handleChangePayment = () => {
        // Payment method change logic here
    };

    const handleUpdateQuantity = (id: string, quantity: number) => {
        updateQuantity(id, quantity);
    };

    const handleRemoveItem = (id: string) => {
        removeItem(id);
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            alert('Please select a delivery address');
            return;
        }

        try {
            setLoadingState({ type: 'payment', message: 'Creating payment order...' });
            
            const userData: Address = selectedAddress;

            const orderData = {
                customerName: userData.name,
                customerPhone: userData.phone,
                customerEmail: userData.email,
                customerAddress: userData.address,
                paymentMethod: "razorpay",
                amount: Math.ceil(total),
                items: cart.map(item => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                })),
            };

            const res = await api.post("/api/v1/payment/create-order", orderData);
            const { razorpayOrderId, amount, currency, orderId: localOrderId, key_id } = res.data;

            setLoadingState({ type: 'payment', message: 'Opening payment gateway...' });

            const options = {
                key: key_id,
                amount: amount.toString(),
                currency,
                name: "Lobango",
                description: `Order ID: ${localOrderId}`,
                order_id: razorpayOrderId,
                handler: async function (response: any) {
                    try {
                        setLoadingState({ type: 'verification', message: 'Verifying payment...' });
                        
                        const verifyRes = await api.post("/api/v1/client/order", {
                            ...orderData,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        setLoadingState({ type: 'verification', message: 'Finalizing order...' });

                        clearCart();
                        localStorage.setItem('orderId', verifyRes.data.orderId);
                        
                        setLoadingState({ type: 'none', message: '' });
                        setShowPaymentConfirmation(true);
                        setPaymentData({
                            amount: total,
                            paymentId: response.razorpay_payment_id,
                            orderId: localOrderId,
                            customerName: userData.name
                        });
                    } catch (error) {
                        console.error("Payment verification failed:", error);
                        setLoadingState({ type: 'none', message: '' });
                        alert("Payment verification failed. Please contact support if amount was debited.");
                    }
                },
                modal: {
                    ondismiss: function() {
                        setLoadingState({ type: 'none', message: '' });
                    }
                },
                prefill: {
                    name: userData.name,
                    contact: userData.phone,
                },
                theme: {
                    color: "#F37254",
                },
            };

            const razorpay = new (window as any).Razorpay(options);
            razorpay.open();

        } catch (error) {
            console.error("Error placing order:", error);
            setLoadingState({ type: 'none', message: '' });
            alert("Failed to create order. Please try again.");
        }
    };

    const handleViewOrder = () => {
        router.push('/order-tracking');
    };

    const handleGoHome = () => {
        router.push('/menu');
    };

    // Show loading spinner for page initialization
    if (loadingState.type === 'page') {
        return (
            <div className="min-h-screen bg-[var(--smoky-black-1)] flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner />
                    <p className="text-white mt-4">{loadingState.message}</p>
                </div>
            </div>
        );
    }

    // if (cart.length === 0) {
    //     router.push('/cart');
    //     return null;
    // }

    return (
        <div
            className="min-h-screen bg-[var(--smoky-black-1)]"
            style={{
                fontFamily: 'var(--font-work-sans), var(--font-noto-sans), sans-serif',
            } as React.CSSProperties}
        >
            <CheckoutHeader onBack={handleBack} />
            
            {/* Orders closed message */}
            {newOrders === false ? (
                <div className='flex justify-center items-center w-full'>
                    <p className="p-4 mt-5 text-center text-red-500 text-xl font-semibold flex justify-center items-center gap-3 tracking-tighter border-2 rounded-md border-red-500">
                        Online orders are currently closed.
                    </p>
                </div>
            ) : null}

            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <DeliveryAddress
                            address={selectedAddress}
                            onChangeAddress={handleChangeAddress}
                        />

                        <PaymentMethod
                            onChangePayment={handleChangePayment}
                        />
                    </div>

                    <div className="lg:col-span-2">
                        <OrderSummary
                            items={cart}
                            subtotal={subtotal}
                            deliveryFee={deliveryFee}
                            tax={tax}
                            total={total}
                            onUpdateQuantity={handleUpdateQuantity}
                            onRemoveItem={handleRemoveItem}
                        />

                        <div className='flex justify-center w-full h-15'>
                            <PlaceOrderButton
                                onPlaceOrder={handlePlaceOrder}
                                loading={loadingState.type === 'payment'}
                                total={total}
                                disabled={!selectedAddress || loadingState.type !== 'none'}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <AddressModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                onSelectAddress={handleSelectAddress}
                currentAddress={selectedAddress}
            />

            {showPaymentConfirmation && paymentData && (
                <div className="fixed inset-0 z-50">
                    <PaymentConfirmation
                        paymentData={paymentData}
                        onViewOrder={handleViewOrder}
                        onGoHome={handleGoHome}
                    />
                </div>
            )}

            {/* Payment/Verification Loading Overlay */}
            {(loadingState.type === 'payment' || loadingState.type === 'verification') && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-[var(--smoky-black-1)] rounded-lg p-8 max-w-sm w-full mx-4 text-center">
                        <LoadingSpinner />
                        <h3 className="text-lg font-semibold mt-4 mb-2">
                            {loadingState.type === 'payment' ? 'Processing Payment' : 'Verifying Payment'}
                        </h3>
                        <p className="text-gray-600">{loadingState.message}</p>
                        {loadingState.type === 'payment' && (
                            <p className="text-sm text-gray-500 mt-2">
                                Please complete the payment to continue
                            </p>
                        )}
                        {loadingState.type === 'verification' && (
                            <p className="text-sm text-gray-500 mt-2">
                                Please wait while we confirm your payment
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}