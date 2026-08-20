import type { Order } from "@lobango/contracts/order";
import { Playfair_Display } from "next/font/google";
import React from "react";
import { OrderStatusTracker } from "./OrderStatusTracker";

const playfair = Playfair_Display({ subsets: ["latin"] });

export interface OrderDetailsProps {
  order: Order;
  onTryAnother: () => void;
}

export function OrderDetails({ order, onTryAnother }: OrderDetailsProps) {
  const getPaymentStatusColor = (status: string) => {
    return status.toLowerCase() === "paid" ? "text-green-400" : "text-red-400";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <OrderStatusTracker currentStatus={order.status} />

      <div className="rounded-xl border border-(--white-alpha-10) bg-(--eerie-black-2) p-6 md:p-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2
            className={`${playfair.className} mb-2 text-xl font-semibold text-(--gold-crayola) sm:mb-0 md:text-2xl`}
          >
            Order Information
          </h2>
          <button
            onClick={onTryAnother}
            className="text-sm text-(--gold-crayola) transition-all hover:underline"
          >
            Try Another ID
          </button>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-(--white-alpha-10) bg-(--smoky-black-3) p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-(--quick-silver)">Order ID</span>
              <button
                onClick={() => navigator.clipboard.writeText(order.orderId)}
                className="text-xs text-(--gold-crayola) hover:underline"
              >
                Copy
              </button>
            </div>
            <p className="font-mono text-lg font-semibold text-(--white)">
              {order.orderId}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-(--white-alpha-10) bg-(--smoky-black-3) p-4">
              <p className="mb-2 text-sm text-(--quick-silver)">
                Customer Details
              </p>
              <p className="mb-1 font-medium text-(--white)">
                {order.customerName}
              </p>
              <p className="text-sm text-(--gold-crayola)">
                {order.customerPhone}
              </p>
            </div>
            <div className="rounded-lg border border-(--white-alpha-10) bg-(--smoky-black-3) p-4">
              <p className="mb-2 text-sm text-(--quick-silver)">Order Date</p>
              <p className="font-medium text-(--white)">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-(--white-alpha-10) bg-(--smoky-black-3) p-4">
            <p className="mb-2 text-sm text-(--quick-silver)">
              Delivery Address
            </p>
            <p className="leading-relaxed text-(--white)">
              {order.customerAddress}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-(--white-alpha-10) bg-(--smoky-black-3) p-4">
              <p className="mb-2 text-sm text-(--quick-silver)">
                Payment Method
              </p>
              <p className="font-medium text-(--white) capitalize">
                {order.paymentMethod}
              </p>
            </div>
            <div className="rounded-lg border border-(--white-alpha-10) bg-(--smoky-black-3) p-4">
              <p className="mb-2 text-sm text-(--quick-silver)">
                Payment Status
              </p>
              <div className="flex items-center space-x-2">
                <div
                  className={`h-2 w-2 rounded-full ${order.paymentStatus.toLowerCase() === "paid" ? "bg-green-400" : "bg-red-400"}`}
                ></div>
                <p
                  className={`font-semibold capitalize ${getPaymentStatusColor(order.paymentStatus)}`}
                >
                  {order.paymentStatus}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
