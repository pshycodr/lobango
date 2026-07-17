import { MenuItem } from "@/types/menu";
import { useCartStore } from "@/store/useCartStore";
import { useMemo } from "react";
import Image from "next/image";
import { usePermissionsStore } from "@/store/usePermissionsStore";

export const MenuItemCard = ({
  item,
  getDescription,
}: {
  item: MenuItem;
  getDescription: (item: MenuItem) => string;
}) => {
  const { cart, addItem, updateQuantity, removeItem } = useCartStore();
  const { newOrders } = usePermissionsStore()
  const cartItem = useMemo(() => cart.find((i) => i.id === item.id), [cart, item.id]);
  const quantity = cartItem?.quantity || 0;

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
    <div className="bg-[var(--eerie-black-2)] rounded-xl shadow-md transition-all duration-300 overflow-hidden border border-[var(--white-alpha-10)] hover:border-[var(--white-alpha-20)] group flex items-start justify-between p-4 mb-4 ">
      {/* LEFT SIDE */}
      <div className="flex-1 pr-4">
        <div className="flex items-center gap-2 mb-2">
          <div
            className={`w-3 h-3 border border-opacity-80 flex items-center justify-center rounded-sm ${item.isVeg ? "border-green-400" : "border-red-400"
              }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? "bg-green-400" : "bg-red-400"
                }`}
            ></div>
          </div>
        </div>

        <h3 className="text-base font-medium text-[var(--white)] mb-1 group-hover:text-[var(--gold-crayola)] transition-colors duration-200">
          {item.name}
        </h3>

        <div className="text-sm text-[var(--gold-crayola)] font-medium mb-2">
          ₹{item.price}
        </div>

        <p className="text-[var(--quick-silver)] text-xs leading-relaxed font-light line-clamp-2">
          {getDescription(item)}
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="relative w-28 h-28 flex-shrink-0">
        <Image
          src={item.image || "/assets/images/menu-3.png"}
          alt={item.name}
          fill
          className="object-cover rounded-lg"
          sizes="112px" // 28 * 4 = 112px
        />

        {newOrders && (
          quantity > 0 ? (
            <div className="absolute scale-90 -bottom-4 right-0.5 flex items-center justify-between gap- bg-[var(--gold-crayola)] bg-opacity-10 border border-[var(--gold-crayola)] border-opacity-60 text-[var(--smoky-black-1)] text-sm font-medium px-3 py-2 rounded-lg shadow-sm backdrop-blur-sm transition-all duration-200 min-w-[90px]">
              <button
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[var(--gold-crayola)] hover:bg-opacity-20 transition-all duration-200"
                onClick={handleDecrease}
                aria-label="Decrease quantity"
              >
                –
              </button>
              <span className="w-6 text-center select-none text-[13px] tracking-wide">
                {quantity.toString().padStart(2, "0")}
              </span>
              <button
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[var(--gold-crayola)] hover:bg-opacity-20 transition-all duration-200"
                onClick={handleIncrease}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="absolute -bottom-3 right-5.5 bg-[var(--gold-crayola)] bg-opacity-10 text-[var(--smoky-black-1)] border border-[var(--gold-crayola)] border-opacity-60 hover:bg-opacity-20 text-sm font-semibold px-3 py-1.5 rounded-md transition-all duration-200"
            >
              ADD +
            </button>
          )
        )}
      </div>
    </div>
  );
};
