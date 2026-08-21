import LoadingSpinner from "@/components/Common/Loader";
import InfoCard from "@/components/Order/InfoCard";
import MapLocation from "@/components/Order/MapLocation";
import OrderItemCard from "@/components/Order/OrderItemCard";
import StatusBadge from "@/components/Order/OrderStatusBadge";
import StatusUpdateModal from "@/components/Order/StatusUpdateModal";
import { useAdminOrderDetails } from "@/hooks/useAdminOrderDetails";
import { Route } from "@/routes/__root";
import type { OrderStatus } from "@lobango/contracts/enums";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  ArrowLeft,
  Clock,
  CreditCard,
  IndianRupee,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  User,
} from "lucide-react";
import { useState } from "react";

interface OrderSearchParams {
  orderId?: string;
}

export function AdminOrderDetails() {
  const searchParams = useSearch({ from: Route.id }) as OrderSearchParams;
  const orderId = searchParams.orderId;

  const { order, items, isLoading, isUpdating, updateStatus } =
    useAdminOrderDetails({ orderId });

  const [showStatusModal, setShowStatusModal] = useState(false);
  const navigate = useNavigate();

  const formatDateTime = (
    dateString: string
  ): { date: string; time: string } => {
    try {
      const date = new Date(dateString);
      return {
        date: date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time: date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      };
    } catch (error) {
      console.error("Error formatting date:", error);
      return { date: "Invalid Date", time: "Invalid Time" };
    }
  };

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    await updateStatus(newStatus);
    setShowStatusModal(false);
  };

  const handleBack = () => {
    navigate({ to: "/" });
  };

  if (!orderId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--smoky-black-1)">
        <div className="text-center text-(--white)">
          <p>Invalid order ID.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--smoky-black-1)">
        <LoadingSpinner />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--smoky-black-1)">
        <div className="p-10 text-center text-(--white)">
          <Package size={48} className="mx-auto mb-4 text-(--quick-silver)" />
          <h2 className="mb-2 text-xl font-semibold">Order Not Found</h2>
          <p className="mb-4 text-(--quick-silver)">
            The order with ID #{orderId} could not be found.
          </p>
          <button
            onClick={handleBack}
            className="rounded-lg bg-(--gold-crayola) px-4 py-2 font-medium text-(--smoky-black-1) transition-colors hover:bg-(--gold-crayola)/90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => {
    const price =
      typeof item.price === "number" ? item.price : parseFloat(item.price) || 0;
    const quantity =
      typeof item.quantity === "number"
        ? item.quantity
        : parseInt(String(item.quantity), 10) || 1;
    return sum + price * quantity;
  }, 0);

  const total = parseFloat(order.totalAmount) || subtotal;
  const { date, time } = formatDateTime(order.createdAt);

  return (
    <div className="min-h-screen bg-(--smoky-black-1)">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-(--eerie-black-4) bg-(--smoky-black-1)/95 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="rounded-lg p-2 text-(--quick-silver) transition-colors hover:bg-(--eerie-black-2) hover:text-(--white)"
                aria-label="Go back"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-(--white) md:text-2xl">
                  Order #{order.orderId}
                </h1>
                <div className="flex items-center gap-2 text-sm text-(--quick-silver)">
                  <Clock size={12} />
                  <span>
                    {date} • {time}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        {/* Order Status */}
        <div className="rounded-xl border border-(--eerie-black-4) bg-(--eerie-black-2) p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-(--white)">
              Order Status
            </h2>
            <StatusBadge
              status={order.status}
              size="lg"
              onClick={() => setShowStatusModal(true)}
              disabled={isUpdating}
            />
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <InfoCard
            icon={<User size={20} />}
            title="Customer Information"
            content={
              <div className="space-y-3">
                <div className="text-lg font-medium text-(--white)">
                  {order.customerName || "N/A"}
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={14} className="text-(--gold-crayola)" />
                  <a
                    href={`tel:+${order.customerPhone}`}
                    className="text-(--quick-silver) hover:underline"
                  >
                    {order.customerPhone || "N/A"}
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin
                    size={14}
                    className="mt-0.5 shrink-0 text-(--gold-crayola)"
                  />
                  <span className="flex-1 leading-relaxed text-(--quick-silver)">
                    {order.customerAddress || "No address provided"}
                  </span>
                </div>
              </div>
            }
          />

          <InfoCard
            icon={<CreditCard size={20} />}
            title="Payment Information"
            content={
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-(--quick-silver)">Method:</span>
                  <span className="font-medium text-(--white) capitalize">
                    {order.paymentMethod || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-(--quick-silver)">Status:</span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      order.paymentStatus === "paid"
                        ? "border border-green-500/30 bg-green-500/20 text-green-400"
                        : "border border-orange-500/30 bg-orange-500/20 text-orange-400"
                    }`}
                  >
                    {order.paymentStatus || "pending"}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-(--eerie-black-4) pt-2">
                  <span className="text-(--quick-silver)">Total:</span>
                  <span className="text-lg font-semibold text-(--gold-crayola)">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>
            }
          />
        </div>

        {/* Delivery Location Map */}
        {order.latitude && order.longitude && (
          <MapLocation
            latitude={order.latitude}
            longitude={order.longitude}
            address={order.customerAddress}
            customerName={order.customerName}
          />
        )}

        {/* Order Items */}
        <div className="overflow-hidden rounded-xl border border-(--eerie-black-4) bg-(--eerie-black-2)">
          <div className="flex items-center gap-3 border-b border-(--eerie-black-4) p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-(--gold-crayola)/10">
              <ShoppingBag size={20} className="text-(--gold-crayola)" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-(--white)">
                Order Items
              </h2>
              <p className="text-sm text-(--quick-silver)">
                {items.length} item{items.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="p-6">
            {items.length > 0 ? (
              <div className="space-y-4">
                {items.map((item) => (
                  <OrderItemCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-(--quick-silver)">
                <ShoppingBag size={48} className="mx-auto mb-3 opacity-50" />
                <p>No items found in this order</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="overflow-hidden rounded-xl border border-(--eerie-black-4) bg-(--eerie-black-2)">
          <div className="flex items-center gap-3 border-b border-(--eerie-black-4) p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-(--gold-crayola)/10">
              <IndianRupee size={20} className="text-(--gold-crayola)" />
            </div>
            <h3 className="text-lg font-semibold text-(--white)">
              Order Summary
            </h3>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-(--quick-silver)">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="border-t border-(--eerie-black-4) pt-4">
                <div className="flex items-center justify-between text-xl font-bold">
                  <span className="text-(--white)">Total</span>
                  <span className="text-(--gold-crayola)">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <StatusUpdateModal
          currentStatus={order.status}
          isOpen={showStatusModal}
          onClose={() => setShowStatusModal(false)}
          onUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}

export default AdminOrderDetails;
