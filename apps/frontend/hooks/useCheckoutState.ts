import type { Address } from "@/types/address";
import type { LoadingState, PaymentData } from "@/types/checkout";
import { useCallback, useEffect, useState } from "react";

export interface UseCheckoutStateReturn {
  loadingState: LoadingState;
  setLoadingState: (state: LoadingState) => void;
  isClient: boolean;
  selectedAddress: Address | undefined;
  setSelectedAddress: (address: Address | undefined) => void;
  handleSelectAddress: (address: Address) => void;
  isAddressModalOpen: boolean;
  setIsAddressModalOpen: (open: boolean) => void;
  showPaymentConfirmation: boolean;
  setShowPaymentConfirmation: (show: boolean) => void;
  paymentData: PaymentData | undefined;
  setPaymentData: (data: PaymentData | undefined) => void;
}

export function useCheckoutState(): UseCheckoutStateReturn {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    type: "page",
    message: "Loading checkout...",
  });
  const [isClient, setIsClient] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(
    undefined
  );
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData | undefined>(
    undefined
  );

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const savedAddress = localStorage.getItem("selected-address");
      if (savedAddress) {
        try {
          setSelectedAddress(JSON.parse(savedAddress));
        } catch (error) {
          console.error("Failed to parse saved address:", error);
        }
      }
    }
  }, []);

  const handleSelectAddress = useCallback((address: Address) => {
    setSelectedAddress(address);
    if (typeof window !== "undefined") {
      localStorage.setItem("selected-address", JSON.stringify(address));
    }
  }, []);

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
    setPaymentData,
  };
}
