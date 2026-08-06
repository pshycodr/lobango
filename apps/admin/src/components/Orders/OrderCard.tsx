import type { Order } from "../../types/orders";
import StatusBadge from "../Order/OrderStatusBadge";

const OrderCard: React.FC<{ order: Order; onClick: () => void }> = ({
  order,
  onClick,
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-xl border border-(--eerie-black-4) bg-(--eerie-black-2) p-4 transition-all duration-300 hover:border-(--gold-crayola)/30 hover:bg-(--eerie-black-3) active:scale-[0.98]"
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-(--white)">{order.name}</h3>
          <p className="text-sm text-(--quick-silver)">#{order.orderId}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Order Details */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-(--quick-silver)">Total Amount</span>
          <span className="text-lg font-semibold text-(--gold-crayola)">
            ₹{order.total.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-(--quick-silver)">Payment</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-(--white) capitalize">
              {order.paymentMethod}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                order.paymentStatus === "paid"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-orange-500/20 text-orange-400"
              }`}
            >
              {order.paymentStatus}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-(--quick-silver)">Items</span>
          <span className="text-sm text-(--white)">
            {order.items.length} item{order.items.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-(--eerie-black-4) pt-3">
        <div className="text-xs text-(--quick-silver)">
          {formatDate(order.createdAt)} • {formatTime(order.createdAt)}
        </div>
        <div className="text-sm font-medium text-(--gold-crayola) transition-colors group-hover:text-(--white)">
          View Details →
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
