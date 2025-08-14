import { useState, useEffect } from 'react';
import { Address } from '@/types/address';

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

export function useCheckoutState() {
    const [loadingState, setLoadingState] = useState<LoadingState>({ 
        type: 'page', 
        message: 'Loading checkout...' 
    });
    const [isClient, setIsClient] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(undefined);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
    const [paymentData, setPaymentData] = useState<PaymentData | undefined>(undefined);

    // Load saved address on client mount
    useEffect(() => {
        setIsClient(true);
        
        if (typeof window !== 'undefined') {
            const savedAddress = localStorage.getItem('selected-address');
            if (savedAddress) {
                try {
                    setSelectedAddress(JSON.parse(savedAddress));
                } catch (error) {
                    console.error('Failed to parse saved address:', error);
                }
            }
        }
    }, []);

    const handleSelectAddress = (address: Address) => {
        setSelectedAddress(address);
        if (typeof window !== 'undefined') {
            localStorage.setItem('selected-address', JSON.stringify(address));
        }
    };

    return {
        loadingState,
        setLoadingState,
        isClient,
        selectedAddress,
        setSelectedAddress,
        handleSelectAddress,
        isAddressModalOpen,
        setIsAddressModalOpen,
        showPaymentConfirmation,
        setShowPaymentConfirmation,
        paymentData,
        setPaymentData
    };
}
