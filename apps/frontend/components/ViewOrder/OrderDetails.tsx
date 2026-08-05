import { Playfair_Display } from "next/font/google";
import OrderStatusTracker from "./OrderStatusTracker";

const playfair = Playfair_Display({ subsets: ["latin"] });

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

interface OrderDetailsProps {
  order: Order;
  onTryAnother: () => void;
}

export default function OrderDetails({
  order,
  onTryAnother,
}: OrderDetailsProps) {
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

      <div className="bg-[var(--eerie-black-2)] rounded-xl p-6 md:p-8 border border-[var(--white-alpha-10)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2
            className={`${playfair.className} text-xl md:text-2xl font-semibold text-[var(--gold-crayola)] mb-2 sm:mb-0`}
          >
            Order Information
          </h2>
          <button
            onClick={onTryAnother}
            className="text-[var(--gold-crayola)] text-sm hover:underline transition-all"
          >
            Try Another ID
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-[var(--smoky-black-3)] rounded-lg p-4 border border-[var(--white-alpha-10)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[var(--quick-silver)] text-sm">
                Order ID
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(order.orderId)}
                className="text-[var(--gold-crayola)] text-xs hover:underline"
              >
                Copy
              </button>
            </div>
            <p className="text-[var(--white)] font-mono text-lg font-semibold">
              {order.orderId}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[var(--smoky-black-3)] rounded-lg p-4 border border-[var(--white-alpha-10)]">
              <p className="text-[var(--quick-silver)] text-sm mb-2">
                Customer Details
              </p>
              <p className="text-[var(--white)] font-medium mb-1">
                {order.name}
              </p>
              <p className="text-[var(--gold-crayola)] text-sm">
                {order.phone}
              </p>
            </div>
            <div className="bg-[var(--smoky-black-3)] rounded-lg p-4 border border-[var(--white-alpha-10)]">
              <p className="text-[var(--quick-silver)] text-sm mb-2">
                Order Date
              </p>
              <p className="text-[var(--white)] font-medium">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          <div className="bg-[var(--smoky-black-3)] rounded-lg p-4 border border-[var(--white-alpha-10)]">
            <p className="text-[var(--quick-silver)] text-sm mb-2">
              Delivery Address
            </p>
            <p className="text-[var(--white)] leading-relaxed">
              {order.address}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[var(--smoky-black-3)] rounded-lg p-4 border border-[var(--white-alpha-10)]">
              <p className="text-[var(--quick-silver)] text-sm mb-2">
                Payment Method
              </p>
              <p className="text-[var(--white)] capitalize font-medium">
                {order.paymentMethod}
              </p>
            </div>
            <div className="bg-[var(--smoky-black-3)] rounded-lg p-4 border border-[var(--white-alpha-10)]">
              <p className="text-[var(--quick-silver)] text-sm mb-2">
                Payment Status
              </p>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${order.paymentStatus.toLowerCase() === "paid" ? "bg-green-400" : "bg-red-400"}`}
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
