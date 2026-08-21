"use client";

import { AddressModal } from "@/components/AddressModal/AddressModal";
import { CheckoutHeader } from "@/components/Checkout/CheckoutHeader";
import { CheckoutLoadingScreen } from "@/components/Checkout/CheckoutLoadingScreen";
import { CheckoutMainContent } from "@/components/Checkout/CheckoutMainContent";
import { CheckoutSidebar } from "@/components/Checkout/CheckoutSidebar";
import { LocationPermissionModal } from "@/components/Checkout/LocationPermissionModal";
import { PaymentConfirmation } from "@/components/Checkout/PaymentConfirmation";
import { PaymentLoadingOverlay } from "@/components/Checkout/PaymentLoadingOverlay";
import { LocationCheck } from "@/components/LocationCheck/LocationCheck";
import { useCheckoutState } from "@/hooks/useCheckoutState";
import { useLocationCheck } from "@/hooks/useLocationCheck";
import { useOrderCalculations } from "@/hooks/useOrderCalculations";
import { useRazorpay } from "@/hooks/useRazorpay";
import { useCartStore } from "@/store/useCartStore";
import { usePermissionsStore } from "@/store/usePermissionsStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export function CheckoutView() {
  const router = useRouter();
  const cart = useCartStore((state) => state.cart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const newOrders = usePermissionsStore((state) => state.newOrders);
  const fetchPermissions = usePermissionsStore(
    (state) => state.fetchPermissions
  );

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [, setLocationPermissionGranted] = useState(false);

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
    setPaymentData,
  } = useCheckoutState();

  const { subtotal, deliveryFee, total } = useOrderCalculations(cart);

  const {
    canCheckout: locationAllowsCheckout,
    shouldBlockCheckout: locationBlocksCheckout,
    isLoading: isLocationLoading,
  } = useLocationCheck({ autoCheck: false });

  const { loadRazorpayScript, initiatePayment } = useRazorpay({
    cart,
    total,
    setLoadingState,
    clearCart,
    onPaymentSuccess: (data) => {
      setShowPaymentConfirmation(true);
      setPaymentData(data);
    },
  });

  useEffect(() => {
    const initializeCheckout = async () => {
      setLoadingState({ type: "page", message: "Loading payment gateway..." });
      try {
        await loadRazorpayScript();
        setLoadingState({ type: "none", message: "" });
      } catch (error) {
        console.error("Checkout initialization failed:", error);
        setLoadingState({ type: "none", message: "" });
      }
    };

    initializeCheckout();
    fetchPermissions();

    // Check if permission is already granted silently without blocking
    if ("permissions" in navigator) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((permission) => {
          if (permission.state === "granted") {
            setLocationPermissionGranted(true);
          }
        })
        .catch(() => {
          // Ignore error; manual entry is supported
        });
    }
  }, [fetchPermissions, loadRazorpayScript, setLoadingState]);

  const handleBack = () => {
    router.back();
  };

  const handleChangeAddress = () => {
    setIsAddressModalOpen(true);
  };

  const handleChangePayment = () => {
    // Payment method switch logic
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }

    try {
      await initiatePayment(selectedAddress);
    } catch (error) {
      console.error("Failed to place order:", error);
      alert("Failed to create order. Please try again.");
    }
  };

  const handleViewOrder = () => {
    router.push("/order-tracking");
  };

  const handleGoHome = () => {
    router.push("/menu");
  };

  const handleLocationPermissionGranted = () => {
    setLocationPermissionGranted(true);
    setShowLocationModal(false);
  };

  const handleLocationPermissionDenied = () => {
    setShowLocationModal(false);
  };

  if (loadingState.type === "page") {
    return (
      <CheckoutLoadingScreen
        message={loadingState.message || "Initializing checkout..."}
      />
    );
  }

  return (
    <div
      className="min-h-screen bg-(--smoky-black-1)"
      style={
        {
          fontFamily:
            "var(--font-work-sans), var(--font-noto-sans), sans-serif",
        } as React.CSSProperties
      }
    >
      <CheckoutHeader onBack={handleBack} />

      <div className="mx-auto max-w-4xl px-6 pt-4">
        <LocationCheck className="mb-4" />
      </div>

      {newOrders === false && (
        <div className="flex w-full items-center justify-center">
          <p className="mt-5 flex items-center justify-center gap-3 rounded-md border-2 border-red-500 p-4 text-center text-xl font-semibold tracking-tighter text-red-500">
            Online orders are currently closed.
          </p>
        </div>
      )}

      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
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
            isPaymentLoading={loadingState.type === "payment"}
            selectedAddress={selectedAddress}
            locationAllowsCheckout={locationAllowsCheckout}
            locationBlocksCheckout={locationBlocksCheckout}
            newOrders={newOrders}
            isLocationLoading={isLocationLoading}
            loadingState={loadingState}
          />
        </div>
      </div>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSelectAddress={handleSelectAddress}
        currentAddress={selectedAddress}
      />

      {showLocationModal && (
        <LocationPermissionModal
          isOpen={showLocationModal}
          onClose={() => setShowLocationModal(false)}
          onPermissionGranted={handleLocationPermissionGranted}
          onPermissionDenied={handleLocationPermissionDenied}
        />
      )}

      {showPaymentConfirmation && paymentData && (
        <div className="fixed inset-0 z-50">
          <PaymentConfirmation
            paymentData={paymentData}
            onViewOrder={handleViewOrder}
            onGoHome={handleGoHome}
          />
        </div>
      )}

      {(loadingState.type === "payment" ||
        loadingState.type === "verification") && (
        <PaymentLoadingOverlay
          type={loadingState.type as "payment" | "verification"}
          message={loadingState.message}
        />
      )}
    </div>
  );
}
