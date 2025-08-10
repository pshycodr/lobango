import { MenuItemCard } from "./MenuItemCard";
import { Playfair_Display } from "next/font/google";
import { Category, MenuItem } from "@/types/menu";

const playfair = Playfair_Display({ subsets: ['latin'] });

export const MenuSection = ({ 
  category,
  getDescription
}: {
  category: Category;
  getDescription: (item: MenuItem) => string;
}) => {
  const sectionId = category.category.replace(/\s+/g, '-').toLowerCase();

  return (
    <section 
      id={sectionId}
      className="mb-16 px-4 scroll-mt-24" 
    >
      <div className="mb-10">
        <h2 className={`text-2xl md:text-3xl font-light text-[var(--white)] mb-3 ${playfair.className} tracking-wide`}>
          {category.category}
        </h2>
        <div className="h-px w-16 bg-[var(--gold-crayola)] opacity-50 rounded-full"></div>
        <p className="text-[var(--quick-silver)] mt-3 text-sm font-light">
          {category.items.length} items
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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