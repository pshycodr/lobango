type MenuItem = {
  id: string;
  name: string;
  price: number;
  category?: string;
  description?: string;
  isVeg: boolean;
  image: string;
};

type Category = {
  category: string;
  items: MenuItem[];
};

export const MenuCategories = ({
  categories,
  activeCategory,
  onSelectCategory,
}: {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}) => (
  <nav className="space-y-1">
    {categories.map((category) => (
      <button
        key={category.category}
        onClick={() => onSelectCategory(category.category)}
        className={`w-full text-left px-4 py-3 rounded-md transition-all duration-200 group ${
          activeCategory === category.category
            ? "bg-[var(--white-alpha-10)] text-[var(--gold-crayola)] border-l-2 border-[var(--gold-crayola)]"
            : "text-[var(--quick-silver)] hover:bg-[var(--white-alpha-10)] hover:text-[var(--white)] hover:pl-5"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="font-normal text-sm">{category.category}</span>
          <span
            className={`text-xs text-[var(--quick-silver)] ${
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
