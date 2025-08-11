'use client';

import AddressModal from '@/components/AddressModal/AddressModal';
import CheckoutHeader from '@/components/Checkout/CheckoutHeader';
import DeliveryAddress from '@/components/Checkout/DeliveryAddress';
import OrderSummary from '@/components/Checkout/OrderSummary';
import PaymentConfirmation from '@/components/Checkout/PaymentConfirmation';
import PaymentMethod from '@/components/Checkout/PaymentMethod';
import PlaceOrderButton from '@/components/Checkout/PlaceOrderButton';
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

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, updateQuantity, removeItem, clearCart } = useCartStore();
    const [loading, setLoading] = useState(false);
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
        setIsClient(true);

        if (typeof window !== 'undefined') {
            const savedAddress = localStorage.getItem('selected-address');
            if (savedAddress) {
                setSelectedAddress(JSON.parse(savedAddress));
            }
        }
    }, []);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        api.get("/").catch((err) => console.error("Warm-up failed", err));
    }, []);

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

        setLoading(true);
        try {
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

            const options = {
                key: key_id,
                amount: amount.toString(),
                currency,
                name: "Lobango",
                description: `Order ID: ${localOrderId}`,
                order_id: razorpayOrderId,
                handler: async function (response: any) {
                    const verifyRes = await api.post("/api/v1/client/order", {
                        ...orderData,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                    });

                    clearCart();

                    localStorage.setItem('orderId', verifyRes.data.orderId)
                    setShowPaymentConfirmation(true);
                    setPaymentData({
                        amount: total,
                        paymentId: response.razorpay_payment_id,
                        orderId: localOrderId,
                        customerName: userData.name
                    });
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
            alert("Payment failed or cancelled. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleViewOrder = () => {
        router.push('/order-tracking');
    };

    const handleGoHome = () => {
        router.push('/menu');
    };

    if (!isClient) {
        return (
            <div className="min-h-screen bg-[var(--smoky-black-1)] flex items-center justify-center">
                <div className="text-[var(--white)]">Loading...</div>
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
            {newOrders === false ? (
                <div className='flex justify-center items-center w-full'>
                    <p className="p-4 mt-5 text-center text-red-500 text-xl font-semibold flex justify-center items-center gap-3 tracking-tighter border-2 rounded-md border-red-500 ">Online orders are currently closed.</p>
                </div>) : ""}

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

                        <div className='flex justify-center w-ful h-15'>
                            <PlaceOrderButton
                                onPlaceOrder={handlePlaceOrder}
                                loading={loading}
                                total={total}
                                disabled={!selectedAddress}
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
        </div>
    );
}