"use client";

import ErrorMessage from "@/components/ViewOrder/ErrorMessage";
import OrderDetails from "@/components/ViewOrder/OrderDetails";
import OrderIdInput from "@/components/ViewOrder/OrderIdInput";
import OrderItems from "@/components/ViewOrder/OrderItems";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import api from "@/lib/axios";
import axios from "axios";
import { Inter, Playfair_Display } from "next/font/google";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"] });

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  orderId: string;
  name: string;
  phone: string;
  address: string;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  createdAt: string;
}

interface OrderResponse {
  success: boolean;
  order: Order;
  items: OrderItem[];
}

function ViewOrderContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string>("");
  const [orderData, setOrderData] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showInput, setShowInput] = useState<boolean>(false);

  useEffect(() => {
    const queryOrderId = searchParams.get("orderId");

    if (queryOrderId) {
      const cleanOrderId = queryOrderId.trim();
      setOrderId(cleanOrderId);
      fetchOrder(cleanOrderId);
      return;
    }

    const storedOrderId = localStorage.getItem("orderId");
    if (storedOrderId) {
      setOrderId(storedOrderId);
      fetchOrder(storedOrderId);
    } else {
      setShowInput(true);
    }
  }, [searchParams]);

  const fetchOrder = async (id: string) => {
    if (!id || id.trim() === "") {
      setError("Invalid order ID provided.");
      setShowInput(true);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/api/v1/client/getorders", {
        order_id: id.trim(),
      });

      if (response.data.success) {
        setOrderData(response.data);
        localStorage.setItem("orderId", id.trim());
        setShowInput(false);
      } else {
        setError("Order not found. Please check your order ID.");
        setShowInput(true);
      }
    } catch (err) {
      console.error("Error fetching order:", err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setError("Order not found. Please verify your order ID.");
          // @ts-ignore
        } else if (err.response?.status >= 500) {
          setError("Server error. Please try again later.");
        } else {
          setError("Failed to fetch order details. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection and try again.");
      }
      setShowInput(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderIdSubmit = (id: string) => {
    const cleanId = id.trim();
    if (!cleanId) {
      setError("Please enter a valid order ID.");
      return;
    }
    setOrderId(cleanId);
    fetchOrder(cleanId);
  };

  const handleTryAnotherId = () => {
    setOrderData(null);
    setShowInput(true);
    setError("");
    setOrderId("");
    localStorage.removeItem("orderId");

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.search = "";
      window.history.replaceState({}, "", url.pathname);
    }
  };

  const handleRetry = () => {
    if (orderId) {
      fetchOrder(orderId);
    } else {
      setShowInput(true);
    }
  };

  return (
    <>
      <header className="mb-8 text-center">
        <h1
          className={`${playfair.className} mb-2 text-3xl font-bold text-(--gold-crayola) md:text-4xl`}
        >
          My Order
        </h1>
        <p className="text-sm text-(--quick-silver) md:text-base">
          Track your delicious order status
        </p>
        {orderId && (
          <p className="mt-2 text-xs text-(--white-alpha-20)">
            Order ID:{" "}
            <span className="font-mono text-(--gold-crayola)">{orderId}</span>
          </p>
        )}
      </header>

      {loading && <LoadingSpinner />}

      {error && (
        <ErrorMessage
          message={error}
          onRetry={handleRetry}
          onTryAnother={handleTryAnotherId}
        />
      )}

      {showInput && !loading && <OrderIdInput onSubmit={handleOrderIdSubmit} />}

      {orderData && !loading && (
        <div className="space-y-6">
          <OrderDetails
            order={orderData.order}
            onTryAnother={handleTryAnotherId}
          />
          <OrderItems items={orderData.items} total={orderData.order.total} />
        </div>
      )}
    </>
  );
}

function ViewOrderFallback() {
  return (
    <div className="text-center">
      <LoadingSpinner />
    </div>
  );
}

export default function ViewOrderPage() {
  return (
    <div
      className={`min-h-screen bg-linear-to-b from-(--eerie-black-1) to-(--smoky-black-2) ${inter.className}`}
    >
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <Suspense fallback={<ViewOrderFallback />}>
          <ViewOrderContent />
        </Suspense>
      </div>
    </div>
  );
}
