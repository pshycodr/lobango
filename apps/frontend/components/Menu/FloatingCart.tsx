"use client";

import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";

export const FloatingCart = () => {
  const { cart } = useCartStore();
  const router = useRouter();

  if (cart.length === 0) return null;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleGoToCart = () => {
    router.push("/cart");
  };

  return (
    <>
      <div
        className={`animate-in slide-in-from-bottom-4 lg:slide-in-from-bottom-8 lg:slide-in-from-right-8 fixed right-0 bottom-0 left-0 z-50 flex items-center justify-between transition-all duration-500 lg:right-6 lg:bottom-6 lg:left-auto lg:w-auto lg:rounded-xl`}
      >
        <button
          onClick={handleGoToCart}
          className={`hover:shadow-3xl group flex w-full items-center justify-between gap-3 rounded-lg border border-(--white-alpha-20) bg-(--eerie-black-1) p-4 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-(--white-alpha-10) lg:w-auto lg:justify-start lg:gap-4`}
        >
          {/* Cart Icon with Badge */}
          <div className="relative animate-pulse">
            <div className="bg-opacity-20 border-opacity-30 group-hover:bg-opacity-30 flex h-10 w-10 items-center justify-center rounded-full border border-(--gold-crayola) bg-(--gold-crayola) transition-all duration-300 group-hover:scale-110">
              <ShoppingCart
                className="h-5 w-5 transition-transform duration-300"
                strokeWidth={2}
              />
            </div>
            <div className="absolute -top-1 -right-1 flex h-5 w-5 animate-bounce items-center justify-center rounded-full bg-(--gold-crayola) text-xs font-bold text-(--smoky-black-1) group-hover:animate-pulse">
              {totalItems > 99 ? "99+" : totalItems}
            </div>
            <div className="absolute inset-0 h-10 w-10 animate-ping rounded-full border-2 border-(--gold-crayola) opacity-20"></div>
          </div>

          {/* Text */}
          <div className="text-left transition-transform duration-300 group-hover:translate-x-1">
            <p className="text-sm font-medium text-(--white) transition-colors duration-300 group-hover:text-(--gold-crayola)">
              {totalItems} {totalItems === 1 ? "item" : "items"} in cart
            </p>
            <p className="text-xs text-(--quick-silver) transition-colors duration-300 group-hover:text-(--white)">
              {totalItems === 1 ? "Tap to review item" : "Tap to review items"}
            </p>
          </div>

          {/* Price */}
          <div className="ml-auto text-right transition-transform duration-300 group-hover:translate-x-1 lg:ml-4">
            <p className="text-lg font-semibold text-(--gold-crayola) transition-transform duration-300 group-hover:scale-110">
              ₹{totalPrice}
            </p>
            <p className="text-xs text-(--quick-silver) transition-colors duration-300 group-hover:text-(--white)">
              Total
            </p>
          </div>

          {/* Arrow */}
          <div className="animate-bounce-x ml-2 transition-transform duration-300 group-hover:translate-x-2">
            <svg
              className="h-5 w-5 text-(--gold-crayola) opacity-70 group-hover:opacity-100"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </button>
      </div>
    </>
  );
};
