import { useState } from 'react';
import api from '@/lib/axios';
import { Address } from '@/types/address';
import { CartItem } from '@/types/cart';

interface LoadingState {
    type: 'page' | 'payment' | 'verification' | 'none';
    message: string;
}

interface PaymentData {
    amount: number;
    paymentId?: string;
    orderId?: string;
    customerName?: string;
}

interface UseRazorpayProps {
    cart: CartItem[];
    total: number;
    setLoadingState: (state: LoadingState) => void;
    clearCart: () => void;
    onPaymentSuccess: (data: PaymentData) => void;
}

export function useRazorpay({
    cart,
    total,
    setLoadingState,
    clearCart,
    onPaymentSuccess
}: UseRazorpayProps) {
    
    const loadRazorpayScript = (): Promise<void> => {
        return new Promise((resolve, reject) => {
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

    const initiatePayment = async (selectedAddress: Address) => {
        try {
            setLoadingState({ type: 'payment', message: 'Creating payment order...' });
            
            const orderData = {
                customerName: selectedAddress.name,
                customerPhone: selectedAddress.phone,
                customerEmail: selectedAddress.email,
                customerAddress: selectedAddress.address,
                longitude: selectedAddress.longitude,
                latitude: selectedAddress.latitude,
                paymentMethod: "razorpay",
                amount: Math.ceil(total),
                items: cart.map(item => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                })),
            };

            console.log("here is order data: ",orderData);
            
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
                    await handlePaymentSuccess(response, orderData, selectedAddress, localOrderId);
                },
                modal: {
                    ondismiss: function() {
                        setLoadingState({ type: 'none', message: '' });
                    }
                },
                prefill: {
                    name: selectedAddress.name,
                    contact: selectedAddress.phone,
                },
                theme: {
                    color: "#F37254",
                },
            };

            const razorpay = new (window as any).Razorpay(options);
            razorpay.open();

        } catch (error) {
            console.error("Error initiating payment:", error);
            setLoadingState({ type: 'none', message: '' });
            throw error;
        }
    };

    const handlePaymentSuccess = async (
        response: any, 
        orderData: any, 
        selectedAddress: Address, 
        localOrderId: string
    ) => {
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
            
            onPaymentSuccess({
                amount: total,
                paymentId: response.razorpay_payment_id,
                orderId: localOrderId,
                customerName: selectedAddress.name
            });
        } catch (error) {
            console.error("Payment verification failed:", error);
            setLoadingState({ type: 'none', message: '' });
            throw new Error("Payment verification failed. Please contact support if amount was debited.");
        }
    };

    return {
        loadRazorpayScript,
        initiatePayment
    };
}