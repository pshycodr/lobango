import type { CartItem } from "@/types/cart";
import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";

export interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export function OrderSummary({
  items,
  subtotal,
  deliveryFee,
  total,
  onUpdateQuantity,
  onRemoveItem,
}: OrderSummaryProps) {
  const formatPrice = (price: number) => `₹${price.toFixed(2)}`;

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      onRemoveItem(id);
    } else {
      onUpdateQuantity(id, newQuantity);
    }
  };

  return (
    <div className="mb-4 rounded-lg bg-(--eerie-black-1) p-4">
      <h3 className="mb-4 text-lg font-bold text-(--white)">Order Summary</h3>

      {/* Order Items - Scrollable on mobile */}
      <div className="-mx-2 mb-4 max-h-[50vh] space-y-3 overflow-y-auto px-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative flex items-start gap-3 rounded-lg bg-(--eerie-black-2) p-3"
          >
            {/* Remove button (mobile-friendly) */}
            <button
              onClick={() => onRemoveItem(item.id)}
              className="absolute top-1 right-1 cursor-pointer p-1 text-(--quick-silver) hover:text-(--gold-crayola)"
              aria-label="Remove item"
            >
              <X size={16} />
            </button>

            {/* Item image */}
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 56px, 64px"
              />
            </div>

            {/* Item details */}
            <div className="min-w-0 flex-1 pr-4">
              <div className="flex items-start justify-between gap-2">
                <h4 className="line-clamp-1 flex-1 text-sm font-semibold wrap-break-word text-(--white)">
                  {item.name}
                </h4>
                <p className="shrink-0 text-sm font-bold text-(--gold-crayola)">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
              <p className="mt-1 mb-2 line-clamp-2 text-xs text-(--quick-silver)">
                {item.description}
              </p>
              {/* Quantity controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity - 1)
                  }
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-(--gold-crayola) text-(--gold-crayola) transition-colors active:bg-(--gold-crayola) active:text-(--smoky-black-1)"
                  aria-label="Decrease quantity"
                >
                  <Minus size={12} />
                </button>

                <span className="min-w-6 text-center text-sm font-medium text-(--white)">
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity + 1)
                  }
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-(--gold-crayola) text-(--gold-crayola) transition-colors active:bg-(--gold-crayola) active:text-(--smoky-black-1)"
                  aria-label="Increase quantity"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Totals */}
      <div className="space-y-2 border-t border-(--eerie-black-3) pt-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-(--quick-silver)">Subtotal</p>
          <p className="text-sm text-(--white)">{formatPrice(subtotal)}</p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-(--quick-silver)">Delivery Fee</p>
          <p className="text-sm text-(--white)">{formatPrice(deliveryFee)}</p>
        </div>

        <div className="flex items-center justify-between border-t border-(--eerie-black-3) pt-3">
          <p className="text-base font-bold text-(--white)">Total</p>
          <p className="text-base font-bold text-(--gold-crayola)">
            {formatPrice(total)}
          </p>
        </div>
      </div>
    </div>
  );
}
