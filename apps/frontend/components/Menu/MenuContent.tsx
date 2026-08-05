import { Category, MenuItem } from "@lobango/contracts/menu";
import { MenuHero } from "./MenuHero";
import { MenuSection } from "./MenuSection";
import { NoResults } from "./NoResults";

export const MenuContent = ({
  categories,
  getDescription,
}: {
  categories: Category[];
  getDescription: (item: MenuItem) => string;
}) => (
  <div className="pt-20 lg:pt-12 pb-12">
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
