import type { Address } from "@/types/address";
import type { LoadingState, PaymentData } from "@/types/checkout";
import { useCallback, useState, useSyncExternalStore } from "react";

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

const emptySubscribe = () => () => {};

export function useCheckoutState(): UseCheckoutStateReturn {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    type: "page",
    message: "Loading checkout...",
  });

  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(
    () => {
      if (typeof window === "undefined") return undefined;
      try {
        const savedAddress = localStorage.getItem("selected-address");
        return savedAddress ? (JSON.parse(savedAddress) as Address) : undefined;
      } catch {
        return undefined;
      }
    }
  );

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData | undefined>(
    undefined
  );

  const handleSelectAddress = useCallback((address: Address) => {
    setSelectedAddress(address);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("selected-address", JSON.stringify(address));
      } catch {
        // ignore
      }
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
