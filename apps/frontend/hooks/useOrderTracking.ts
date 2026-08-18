import { client } from "@/lib/orpc";
import type { OrderTrackingStatus } from "@/types/checkout";
import type { GetOrderByIdResponse } from "@lobango/contracts/order";
import { useCallback, useEffect, useState } from "react";

export interface UseOrderTrackingReturn {
  orderId: string;
  orderData: GetOrderByIdResponse | null;
  status: OrderTrackingStatus;
  errorMessage: string;
  showInput: boolean;
  fetchOrder: (id: string) => Promise<void>;
  handleOrderIdSubmit: (id: string) => void;
  handleTryAnotherId: () => void;
  handleRetry: () => void;
}

export function useOrderTracking(
  initialOrderId?: string | null
): UseOrderTrackingReturn {
  const [orderId, setOrderId] = useState<string>("");
  const [orderData, setOrderData] = useState<GetOrderByIdResponse | null>(null);
  const [status, setStatus] = useState<OrderTrackingStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showInput, setShowInput] = useState<boolean>(false);

  const fetchOrder = useCallback(async (id: string) => {
    const cleanId = id.trim();
    if (!cleanId) {
      setErrorMessage("Please enter a valid order ID.");
      setShowInput(true);
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await client.order.getOrderById({ orderId: cleanId });

      if (response && response.success) {
        setOrderData(response);
        if (typeof window !== "undefined") {
          localStorage.setItem("orderId", cleanId);
        }
        setShowInput(false);
        setStatus("success");
      } else {
        setErrorMessage("Order not found. Please check your order ID.");
        setShowInput(true);
        setStatus("error");
      }
    } catch (err: unknown) {
      console.error("Error fetching order:", err);
      const isNotFound =
        typeof err === "object" &&
        err !== null &&
        "status" in err &&
        (err as { status: number }).status === 404;

      if (isNotFound) {
        setErrorMessage("Order not found. Please verify your order ID.");
      } else {
        setErrorMessage(
          "Failed to fetch order details. Please check your connection and try again."
        );
      }
      setShowInput(true);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (initialOrderId) {
      const clean = initialOrderId.trim();
      setOrderId(clean);
      fetchOrder(clean);
      return;
    }

    if (typeof window !== "undefined") {
      const storedOrderId = localStorage.getItem("orderId");
      if (storedOrderId) {
        const clean = storedOrderId.trim();
        setOrderId(clean);
        fetchOrder(clean);
      } else {
        setShowInput(true);
      }
    }
  }, [initialOrderId, fetchOrder]);

  const handleOrderIdSubmit = useCallback(
    (id: string) => {
      const cleanId = id.trim();
      if (!cleanId) {
        setErrorMessage("Please enter a valid order ID.");
        return;
      }
      setOrderId(cleanId);
      fetchOrder(cleanId);
    },
    [fetchOrder]
  );

  const handleTryAnotherId = useCallback(() => {
    setOrderData(null);
    setShowInput(true);
    setErrorMessage("");
    setOrderId("");
    setStatus("idle");
    if (typeof window !== "undefined") {
      localStorage.removeItem("orderId");
      const url = new URL(window.location.href);
      url.search = "";
      window.history.replaceState({}, "", url.pathname);
    }
  }, []);

  const handleRetry = useCallback(() => {
    if (orderId) {
      fetchOrder(orderId);
    } else {
      setShowInput(true);
    }
  }, [orderId, fetchOrder]);

  return {
    orderId,
    orderData,
    status,
    errorMessage,
    showInput,
    fetchOrder,
    handleOrderIdSubmit,
    handleTryAnotherId,
    handleRetry,
  };
}
