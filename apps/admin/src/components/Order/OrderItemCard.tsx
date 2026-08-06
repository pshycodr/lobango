import type { OrderItem } from "../../types/orders";

const OrderItemCard: React.FC<{ item: OrderItem }> = ({ item }) => (
  <div className="rounded-lg border border-(--eerie-black-4) bg-(--eerie-black-2) p-4">
    <div className="mb-2 flex items-start justify-between">
      <div className="flex-1">
        <h4 className="text-lg font-medium text-(--white)">{item.name}</h4>
        {item.description && (
          <p className="mt-1 text-sm text-(--quick-silver)">
            {item.description}
          </p>
        )}
      </div>
      <div className="ml-4 text-right">
        <div className="font-semibold text-(--gold-crayola)">₹{item.price}</div>
        <div className="text-sm text-(--quick-silver)">× {item.quantity}</div>
      </div>
    </div>
    <div className="flex items-center justify-between border-t border-(--eerie-black-4) pt-2">
      <span className="text-sm text-(--quick-silver)">Subtotal</span>
      <span className="font-medium text-(--white)">
        ₹{item.price * item.quantity}
      </span>
    </div>
  </div>
);

export default OrderItemCard;
