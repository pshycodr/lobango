import type { OrderItem } from "../../types/orders";



const OrderItemCard: React.FC<{ item: OrderItem }> = ({ item }) => (
    <div className="bg-[var(--eerie-black-2)] border border-[var(--eerie-black-4)] rounded-lg p-4">
        <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
                <h4 className="text-[var(--white)] font-medium text-lg">{item.name}</h4>
                {item.description && (
                    <p className="text-[var(--quick-silver)] text-sm mt-1">{item.description}</p>
                )}
            </div>
            <div className="text-right ml-4">
                <div className="text-[var(--gold-crayola)] font-semibold">₹{item.price}</div>
                <div className="text-[var(--quick-silver)] text-sm">× {item.quantity}</div>
            </div>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-[var(--eerie-black-4)]">
            <span className="text-[var(--quick-silver)] text-sm">Subtotal</span>
            <span className="text-[var(--white)] font-medium">₹{(item.price * item.quantity)}</span>
        </div>
    </div>
);

export default OrderItemCard;