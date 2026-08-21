import type { OrderItem } from "@lobango/contracts/order";

export interface OrderItemCardProps {
  item: OrderItem;
}

export function OrderItemCard({ item }: OrderItemCardProps) {
  const price =
    typeof item.price === "number" ? item.price : parseFloat(item.price) || 0;
  const quantity =
    typeof item.quantity === "number"
      ? item.quantity
      : parseInt(String(item.quantity), 10) || 1;
  const subtotal = price * quantity;

  return (
    <div className="rounded-lg border border-(--eerie-black-4) bg-(--eerie-black-2) p-4">
      <div className="mb-2 flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-lg font-medium text-(--white)">{item.name}</h4>
        </div>
        <div className="ml-4 text-right">
          <div className="font-semibold text-(--gold-crayola)">
            ₹{price.toFixed(2)}
          </div>
          <div className="text-sm text-(--quick-silver)">× {quantity}</div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-(--eerie-black-4) pt-2">
        <span className="text-sm text-(--quick-silver)">Subtotal</span>
        <span className="font-medium text-(--white)">
          ₹{subtotal.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

export default OrderItemCard;
