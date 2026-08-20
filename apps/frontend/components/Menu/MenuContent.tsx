import type { Category, MenuItem } from "@lobango/contracts/menu";
import React from "react";
import { MenuHero } from "./MenuHero";
import { MenuSection } from "./MenuSection";
import { NoResults } from "./NoResults";

export interface MenuContentProps {
  categories: Category[];
  getDescription: (item: MenuItem) => string;
}

export function MenuContent({ categories, getDescription }: MenuContentProps) {
  return (
    <div className="pt-20 pb-12 lg:pt-12">
      <MenuHero />

      {categories.length === 0 ? (
        <NoResults />
      ) : (
        categories.map((category) => (
          <MenuSection
            key={category.category}
            category={category}
            getDescription={getDescription}
          />
        ))
      )}
    </div>
  );
}
