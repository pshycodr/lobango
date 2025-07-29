import { MenuItem } from "@/types/menu";
import { useState } from "react";

export const MenuItemCard = ({ item, getDescription }: {
  item: MenuItem;
  getDescription: (item: MenuItem) => string;
}) => {

  const [count, setCount] = useState(1);

  return (
    <div className="bg-[var(--eerie-black-2)] rounded-lg shadow-sm transition-all duration-300 overflow-hidden border border-[var(--white-alpha-10)] hover:border-[var(--white-alpha-20)] group flex items-start justify-between p-4 mb-4">
      <div className="flex-1 pr-4">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-3 h-3 border border-opacity-80 flex items-center justify-center ${item.isVeg ? 'border-green-400' : 'border-red-400'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-400' : 'bg-red-400'}`}></div>
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

      <div className="relative w-28 h-28 flex-shrink-0">
        <img
          src={item.image || "/assets/images/menu-3.png"}
          alt={item.name}
          className="w-full h-full object-cover rounded-md"
        />
        <button className="absolute bottom-0.5 right-6 bg-[var(--gold-crayola)] bg-opacity-10 text-[var(--smoky-black-1)] border border-[var(--gold-crayola)] border-opacity-60 hover:bg-opacity-20 text-xs font-semibold px-3 py-1.5 rounded-md transition-all duration-200">
          ADD +
        </button>

      </div>
    </div>
  )
}