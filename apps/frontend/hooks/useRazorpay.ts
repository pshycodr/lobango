import { client } from "@/lib/orpc";
import type { Address } from "@/types/address";
import type { CartItem } from "@/types/cart";
import type { LoadingState, PaymentData } from "@/types/checkout";
import type { CreateOrder, RazorPay } from "@lobango/contracts/order";
import { useCallback } from "react";

export interface UseRazorpayProps {
  cart: CartItem[];
  total: number;
  setLoadingState: (state: LoadingState) => void;
  clearCart: () => void;
  onPaymentSuccess: (data: PaymentData) => void;
}

export interface UseRazorpayReturn {
  loadRazorpayScript: () => Promise<void>;
  initiatePayment: (selectedAddress: Address) => Promise<void>;
}

interface RazorpayOptions {
  key: string;
  amount: string;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorPay) => Promise<void>;
  modal: {
    ondismiss: () => void;
  };
  prefill: {
    name: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

interface RazorpayInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export function useRazorpay({
  cart,
  total,
  setLoadingState,
  clearCart,
  onPaymentSuccess,
}: UseRazorpayProps): UseRazorpayReturn {
  const loadRazorpayScript = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (typeof window !== "undefined" && window.Razorpay) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("Failed to load Razorpay script"));
      document.body.appendChild(script);
    });
  }, []);

  const handlePaymentSuccess = useCallback(
    async (
      response: RazorPay,
      orderData: CreateOrder,
      selectedAddress: Address
    ) => {
      try {
        setLoadingState({
          type: "verification",
          message: "Verifying payment...",
        });

        const razorpayPayload: RazorPay = {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        };

        const verifyRes = await client.order.createOrder({
          order: orderData,
          razorpay: razorpayPayload,
        });

        setLoadingState({
          type: "verification",
          message: "Finalizing order...",
        });

        clearCart();
        if (typeof window !== "undefined") {
          localStorage.setItem("orderId", verifyRes.orderId);
        }

        setLoadingState({ type: "none", message: "" });

        onPaymentSuccess({
          amount: total,
          paymentId: response.razorpay_payment_id,
          orderId: verifyRes.orderId,
          customerName: selectedAddress.name,
        });
      } catch (error) {
        console.error("Payment verification failed:", error);
        setLoadingState({ type: "none", message: "" });
        throw new Error(
          "Payment verification failed. Please contact support if amount was debited."
        );
      }
    },
    [clearCart, onPaymentSuccess, setLoadingState, total]
  );

  const initiatePayment = useCallback(
    async (selectedAddress: Address) => {
      try {
        setLoadingState({
          type: "payment",
          message: "Creating payment order...",
        });

        const orderData: CreateOrder = {
          customerName: selectedAddress.name,
          customerPhone: selectedAddress.phone,
          customerEmail: selectedAddress.email,
          customerAddress: selectedAddress.address,
          longitude: selectedAddress.longitude,
          latitude: selectedAddress.latitude,
          paymentMethod: "razorpay",
          items: cart.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        };

        const paymentOrder = await client.payment.createPayment({
          amount: String(Math.round(total * 100)),
          currency: "INR",
        });

        setLoadingState({
          type: "payment",
          message: "Opening payment gateway...",
        });

        const options: RazorpayOptions = {
          key: paymentOrder.key_id,
          amount: paymentOrder.amount,
          currency: paymentOrder.currency,
          name: "Lobango",
          description: `Order for ${selectedAddress.name}`,
          order_id: paymentOrder.razorpayOrderId,
          handler: async (response: RazorPay) => {
            await handlePaymentSuccess(response, orderData, selectedAddress);
          },
          modal: {
            ondismiss: () => {
              setLoadingState({ type: "none", message: "" });
            },
          },
          prefill: {
            name: selectedAddress.name,
            contact: selectedAddress.phone,
          },
          theme: {
            color: "#F37254",
          },
        };

        if (typeof window !== "undefined" && window.Razorpay) {
          const razorpay = new window.Razorpay(options);
          razorpay.open();
        } else {
          throw new Error("Razorpay SDK is not loaded.");
        }
      } catch (error) {
        console.error("Error initiating payment:", error);
        setLoadingState({ type: "none", message: "" });
        throw error;
      }
    },
    [cart, handlePaymentSuccess, setLoadingState, total]
  );

  return {
    loadRazorpayScript,
    initiatePayment,
  };
}
