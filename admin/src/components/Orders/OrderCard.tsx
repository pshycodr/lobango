import type { Order } from "../../types/orders";
import StatusBadge from "../Order/OrderStatusBadge";

const OrderCard: React.FC<{ order: Order; onClick: () => void }> = ({ order, onClick }) => {
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div
            onClick={onClick}
            className="bg-[var(--eerie-black-2)] border border-[var(--eerie-black-4)] rounded-xl p-4 
                   hover:bg-[var(--eerie-black-3)] hover:border-[var(--gold-crayola)]/30 
                   transition-all duration-300 cursor-pointer group active:scale-[0.98]"
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-[var(--white)] font-semibold text-lg">{order.name}</h3>
                    <p className="text-[var(--quick-silver)] text-sm">#{order.orderId}</p>
                </div>
                <StatusBadge status={order.status} />
            </div>

            {/* Order Details */}
            <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                    <span className="text-[var(--quick-silver)] text-sm">Total Amount</span>
                    <span className="text-[var(--gold-crayola)] font-semibold text-lg">${order.total.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-[var(--quick-silver)] text-sm">Payment</span>
                    <div className="flex items-center gap-2">
                        <span className="text-[var(--white)] text-sm capitalize">{order.paymentMethod}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${order.paymentStatus === 'paid'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-orange-500/20 text-orange-400'
                            }`}>
                            {order.paymentStatus}
                        </span>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-[var(--quick-silver)] text-sm">Items</span>
                    <span className="text-[var(--white)] text-sm">{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-3 border-t border-[var(--eerie-black-4)]">
                <div className="text-[var(--quick-silver)] text-xs">
                    {formatDate(order.createdAt)} • {formatTime(order.createdAt)}
                </div>
                <div className="text-[var(--gold-crayola)] text-sm font-medium group-hover:text-[var(--white)] transition-colors">
                    View Details →
                </div>
            </div>
        </div>
    );
};

export default OrderCard;