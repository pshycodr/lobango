import { useCartStore } from "@/store/useCartStore";
import { usePermissionsStore } from "@/store/usePermissionsStore";
import type { MenuItem } from "@lobango/contracts/menu";
import Image from "next/image";
import React from "react";

export interface MenuItemCardProps {
  item: MenuItem;
  getDescription: (item: MenuItem) => string;
}

export function MenuItemCard({ item, getDescription }: MenuItemCardProps) {
  const quantity = useCartStore(
    (state) => state.cart.find((i) => i.id === item.id)?.quantity || 0
  );
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const newOrders = usePermissionsStore((state) => state.newOrders);

  const handleAdd = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      description: getDescription(item),
      quantity: 1,
      image: item.image || "/assets/images/menu-3.png",
    });
  };

  const handleIncrease = () => updateQuantity(item.id, quantity + 1);

  const handleDecrease = () => {
    if (quantity <= 1) {
      removeItem(item.id);
    } else {
      updateQuantity(item.id, quantity - 1);
    }
  };

  return (
    <div className="group mb-4 flex items-start justify-between overflow-hidden rounded-xl border border-(--white-alpha-10) bg-(--eerie-black-2) p-4 shadow-md transition-all duration-300 hover:border-(--white-alpha-20)">
      {/* LEFT SIDE */}
      <div className="flex-1 pr-4">
        <div className="mb-2 flex items-center gap-2">
          <div
            className={`border-opacity-80 flex h-3 w-3 items-center justify-center rounded-sm border ${
              item.isVeg ? "border-green-400" : "border-red-400"
            }`}
          >
            <div
              className={`h-1.5 w-1.5 rounded-full ${
                item.isVeg ? "bg-green-400" : "bg-red-400"
              }`}
            ></div>
          </div>
        </div>

        <h3 className="mb-1 text-base font-medium text-(--white) transition-colors duration-200 group-hover:text-(--gold-crayola)">
          {item.name}
        </h3>

        <div className="mb-2 text-sm font-medium text-(--gold-crayola)">
          ₹{item.price}
        </div>

        <p className="line-clamp-2 text-xs leading-relaxed font-light text-(--quick-silver)">
          {getDescription(item)}
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="relative h-28 w-28 shrink-0">
        <Image
          src={item.image || "/assets/images/menu-3.png"}
          alt={item.name}
          fill
          className="rounded-lg object-cover"
          sizes="112px"
        />

        {newOrders &&
          (quantity > 0 ? (
            <div className="bg-opacity-10 border-opacity-60 absolute right-0.5 -bottom-4 flex min-w-[90px] scale-90 items-center justify-between rounded-lg border border-(--gold-crayola) bg-(--gold-crayola) px-3 py-2 text-sm font-medium text-(--smoky-black-1) shadow-sm backdrop-blur-sm transition-all duration-200">
              <button
                className="hover:bg-opacity-20 flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200 hover:bg-(--gold-crayola)"
                onClick={handleDecrease}
                aria-label="Decrease quantity"
              >
                –
              </button>
              <span className="w-6 text-center text-[13px] tracking-wide select-none">
                {quantity.toString().padStart(2, "0")}
              </span>
              <button
                className="hover:bg-opacity-20 flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200 hover:bg-(--gold-crayola)"
                onClick={handleIncrease}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="bg-opacity-10 border-opacity-60 hover:bg-opacity-20 absolute right-5.5 -bottom-3 rounded-md border border-(--gold-crayola) bg-(--gold-crayola) px-3 py-1.5 text-sm font-semibold text-(--smoky-black-1) transition-all duration-200"
            >
              ADD +
            </button>
          ))}
      </div>
    </div>
  );
}
