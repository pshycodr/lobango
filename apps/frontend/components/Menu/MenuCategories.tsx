import type { Category } from "@lobango/contracts/menu";
import React from "react";

export interface MenuCategoriesProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export function MenuCategories({
  categories,
  activeCategory,
  onSelectCategory,
}: MenuCategoriesProps) {
  return (
    <nav className="space-y-1">
      {categories.map((category) => (
        <button
          key={category.category}
          onClick={() => onSelectCategory(category.category)}
          className={`group w-full rounded-md px-4 py-3 text-left transition-all duration-200 ${
            activeCategory === category.category
              ? "border-l-2 border-(--gold-crayola) bg-(--white-alpha-10) text-(--gold-crayola)"
              : "text-(--quick-silver) hover:bg-(--white-alpha-10) hover:pl-5 hover:text-(--white)"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-normal">{category.category}</span>
            <span
              className={`text-xs text-(--quick-silver) ${
                activeCategory === category.category
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-60"
              } transition-opacity`}
            >
              {category.items.length}
            </span>
          </div>
        </button>
      ))}
    </nav>
  );
}
