'use client';

import AddressModal from "@/components/AddressModal/AddressModal";
import CheckoutHeader from "@/components/Checkout/CheckoutHeader";
import { CheckoutLoadingScreen } from "@/components/Checkout/CheckoutLoadingScreen";
import { CheckoutMainContent } from "@/components/Checkout/CheckoutMainContent";
import { CheckoutSidebar } from "@/components/Checkout/CheckoutSidebar";
import PaymentConfirmation from "@/components/Checkout/PaymentConfirmation";
import { PaymentLoadingOverlay } from "@/components/Checkout/PaymentLoadingOverlay";
import LocationCheck from "@/components/LocationCheck/LocationCheck";
import LocationPermissionModal from "@/components/Checkout/LocationPermissionModal";
import { useCheckoutState } from "@/hooks/useCheckoutState";
import { useLocationCheck } from "@/hooks/useLocationCheck";
import { useOrderCalculations } from "@/hooks/useOrderCalculations";
import { useRazorpay } from "@/hooks/useRazorpay";
import api from "@/lib/axios";
import { useCartStore } from "@/store/useCartStore";
import { usePermissionsStore } from "@/store/usePermissionsStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";



export default function CheckoutPage() {
    const router = useRouter();
    const { cart, updateQuantity, removeItem, clearCart } = useCartStore();
    const { newOrders, fetchPermissions } = usePermissionsStore();
    
    // Location permission state
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
    
    // Custom hooks
    const {
        loadingState,
        setLoadingState,
        selectedAddress,
        handleSelectAddress,
        isAddressModalOpen,
        setIsAddressModalOpen,
        showPaymentConfirmation,
        setShowPaymentConfirmation,
        paymentData,
        setPaymentData
    } = useCheckoutState();
    
    const { subtotal, deliveryFee, total } = useOrderCalculations(cart);
    
    const {
        canCheckout: locationAllowsCheckout,
        shouldBlockCheckout: locationBlocksCheckout,
        isLoading: isLocationLoading,
        error: locationError
    } = useLocationCheck({ autoCheck: locationPermissionGranted });

    const { loadRazorpayScript, initiatePayment } = useRazorpay({
        cart,
        total,
        setLoadingState,
        clearCart,
        onPaymentSuccess: (data) => {
            setShowPaymentConfirmation(true);
            setPaymentData(data);
        }
    });

    // Check for location permission on page load
    useEffect(() => {
        const checkLocationPermission = async () => {
            try {
                if ('geolocation' in navigator) {
                    const permission = await navigator.permissions.query({ name: 'geolocation' });
                    
                    if (permission.state === 'granted') {
                        setLocationPermissionGranted(true);
                    } else if (permission.state === 'prompt' || permission.state === 'denied') {
                        setShowLocationModal(true);
                    }
                } else {
                    // Fallback for browsers that don't support permissions API
                    setShowLocationModal(true);
                }
            } catch (error) {
                // If permissions API fails, show modal as fallback
                setShowLocationModal(true);
            }
        };

        checkLocationPermission();
        fetchPermissions();
    }, []);

    // Initialize checkout after location permission is granted
    useEffect(() => {
        if (!locationPermissionGranted) return;

        const initializeCheckout = async () => {
            setLoadingState({ type: 'page', message: 'Initializing checkout...' });
            
            try {
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
    }, [locationPermissionGranted]);

    // Event handlers
    const handleBack = () => {
        router.back();
    };

    const handleChangeAddress = () => {
        setIsAddressModalOpen(true);
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

        if (!locationAllowsCheckout) {
            alert('Sorry, we cannot deliver to your current location. Please check if you are within our delivery area.');
            return;
        }

        try {
            await initiatePayment(selectedAddress);
        } catch (error) {
            alert("Failed to create order. Please try again.");
        }
    };

    const handleViewOrder = () => {
        router.push('/order-tracking');
    };

    const handleGoHome = () => {
        router.push('/menu');
    };

    // Location permission handlers
    const handleLocationPermissionGranted = () => {
        setLocationPermissionGranted(true);
        setShowLocationModal(false);
    };

    const handleLocationPermissionDenied = () => {
        setShowLocationModal(true);
        // Keep modal open until permission is granted
    };

    // Show location modal if permission not granted
    if (showLocationModal && !locationPermissionGranted) {
        return (
            <LocationPermissionModal
                isOpen={showLocationModal}
                onPermissionGranted={handleLocationPermissionGranted}
                onPermissionDenied={handleLocationPermissionDenied}
            />
        );
    }

    // Show loading screen during page initialization
    if (loadingState.type === 'page' || !locationPermissionGranted) {
        return <CheckoutLoadingScreen message={loadingState.message || 'Initializing...'} />;
    }

    return (
        <div
            className="min-h-screen bg-[var(--smoky-black-1)]"
            style={{
                fontFamily: 'var(--font-work-sans), var(--font-noto-sans), sans-serif',
            } as React.CSSProperties}
        >
            <CheckoutHeader onBack={handleBack} />
            
            {/* Location Check */}
            <div className="max-w-4xl mx-auto px-6 pt-4">
                <LocationCheck 
                    onLocationChange={(canCheckout) => {
                        // Handle location change if needed
                    }}
                    className="mb-4"
                />
            </div>
            
            {/* Orders closed message */}
            {newOrders === false && (
                <div className='flex justify-center items-center w-full'>
                    <p className="p-4 mt-5 text-center text-red-500 text-xl font-semibold flex justify-center items-center gap-3 tracking-tighter border-2 rounded-md border-red-500">
                        Online orders are currently closed.
                    </p>
                </div>
            )}

            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <CheckoutSidebar
                        selectedAddress={selectedAddress}
                        onChangeAddress={handleChangeAddress}
                        onChangePayment={handleChangePayment}
                    />

                    <CheckoutMainContent
                        cart={cart}
                        subtotal={subtotal}
                        deliveryFee={deliveryFee}
                        total={total}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemoveItem={handleRemoveItem}
                        onPlaceOrder={handlePlaceOrder}
                        isPaymentLoading={loadingState.type === 'payment'}
                        selectedAddress={selectedAddress}
                        locationAllowsCheckout={locationAllowsCheckout}
                        locationBlocksCheckout={locationBlocksCheckout}
                        newOrders={newOrders}
                        isLocationLoading={isLocationLoading}
                        loadingState={loadingState}
                    />
                </div>
            </div>

            {/* Modals and Overlays */}
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
                <PaymentLoadingOverlay
                    type={loadingState.type as 'payment' | 'verification'}
                    message={loadingState.message}
                />
            )}
        </div>
    );
}