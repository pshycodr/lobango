import type { CartItem } from "@/types/cart";
import Image from "next/image";
import React from "react";

export interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export function CartItemCard({ item, onUpdateQuantity }: CartItemCardProps) {
  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(0, item.quantity + change);
    onUpdateQuantity(item.id, newQuantity);
  };

  return (
    <div className="group rounded-lg border border-(--white-alpha-10) bg-(--eerie-black-2) p-3 transition-all duration-200 hover:border-(--gold-crayola) hover:bg-(--eerie-black-3)">
      <div className="flex items-center gap-3">
        {/* Image */}
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-(--eerie-black-4)">
          <Image
            src={item.image}
            alt={item.name}
            width={48}
            height={48}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <h3 className="font-playfair mb-1 text-sm leading-tight font-medium text-(--white)">
            {item.name}
          </h3>
          <p className="font-inter text-xs leading-tight text-(--quick-silver)">
            {item.description}
          </p>
        </div>

        {/* Price and Controls */}
        <div className="flex items-center gap-3">
          <span className="font-playfair text-lg font-semibold text-(--gold-crayola)">
            ₹{item.price.toFixed(0)}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="flex h-6 w-6 items-center justify-center rounded border border-(--gold-crayola) text-sm text-(--gold-crayola) transition-all duration-150 hover:bg-(--gold-crayola) hover:text-(--smoky-black-1) active:scale-95"
            >
              −
            </button>

            <span className="font-inter w-6 text-center text-sm font-medium text-(--white)">
              {item.quantity}
            </span>

            <button
              onClick={() => handleQuantityChange(1)}
              className="flex h-6 w-6 items-center justify-center rounded border border-(--gold-crayola) text-sm text-(--gold-crayola) transition-all duration-150 hover:bg-(--gold-crayola) hover:text-(--smoky-black-1) active:scale-95"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
