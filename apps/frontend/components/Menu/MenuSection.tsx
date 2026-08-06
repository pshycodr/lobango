import { Category, MenuItem } from "@lobango/contracts/menu";
import { Playfair_Display } from "next/font/google";
import { MenuItemCard } from "./MenuItemCard";

const playfair = Playfair_Display({ subsets: ["latin"] });

export const MenuSection = ({
  category,
  getDescription,
}: {
  category: Category;
  getDescription: (item: MenuItem) => string;
}) => {
  const sectionId = category.category.replace(/\s+/g, "-").toLowerCase();

  return (
    <section id={sectionId} className="mb-16 scroll-mt-24 px-4">
      <div className="mb-10">
        <h2
          className={`mb-3 text-2xl font-light text-(--white) md:text-3xl ${playfair.className} tracking-wide`}
        >
          {category.category}
        </h2>
        <div className="h-px w-16 rounded-full bg-(--gold-crayola) opacity-50"></div>
        <p className="mt-3 text-sm font-light text-(--quick-silver)">
          {category.items.length} items
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {category.items.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            getDescription={getDescription}
          />
        ))}
      </div>
    </section>
  );
};
