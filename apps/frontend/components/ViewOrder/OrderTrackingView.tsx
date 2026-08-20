"use client";

import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/ViewOrder/ErrorMessage";
import { OrderDetails } from "@/components/ViewOrder/OrderDetails";
import { OrderIdInput } from "@/components/ViewOrder/OrderIdInput";
import { OrderItems } from "@/components/ViewOrder/OrderItems";
import { useOrderTracking } from "@/hooks/useOrderTracking";
import { Inter, Playfair_Display } from "next/font/google";
import React from "react";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"] });

export interface OrderTrackingViewProps {
  searchOrderId?: string | null;
}

export function OrderTrackingView({ searchOrderId }: OrderTrackingViewProps) {
  const {
    orderId,
    orderData,
    status,
    errorMessage,
    showInput,
    handleOrderIdSubmit,
    handleTryAnotherId,
    handleRetry,
  } = useOrderTracking(searchOrderId);

  const isLoading = status === "loading";
  const isError = status === "error";

  return (
    <div
      className={`min-h-screen bg-linear-to-b from-(--eerie-black-1) to-(--smoky-black-2) ${inter.className}`}
    >
      <div className="container mx-auto max-w-2xl px-4 py-8">
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

        {isLoading && <LoadingSpinner />}

        {isError && (
          <ErrorMessage
            message={errorMessage}
            onRetry={handleRetry}
            onTryAnother={handleTryAnotherId}
          />
        )}

        {showInput && !isLoading && (
          <OrderIdInput onSubmit={handleOrderIdSubmit} />
        )}

        {orderData && !isLoading && (
          <div className="space-y-6">
            <OrderDetails
              order={orderData.order}
              onTryAnother={handleTryAnotherId}
            />
            <OrderItems
              items={orderData.items}
              total={orderData.order.totalAmount}
            />
          </div>
        )}
      </div>
    </div>
  );
}
