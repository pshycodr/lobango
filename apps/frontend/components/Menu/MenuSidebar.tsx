import { Category } from "@lobango/contracts/menu";
import { Playfair_Display } from "next/font/google";
import { MenuCategories } from "./MenuCategories";
import { MenuSearch } from "./MenuSearch";

const playfair = Playfair_Display({ subsets: ["latin"] });

export const MenuSidebar = ({
  isOpen,
  onClose,
  categories,
  activeCategory,
  searchQuery,
  setSearchQuery,
  onSelectCategory,
}: {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  activeCategory: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectCategory: (category: string) => void;
}) => (
  <>
    {/* Mobile Overlay */}
    {isOpen && (
      <div
        className="fixed inset-0 z-40 bg-(--black-alpha-80) backdrop-blur-sm lg:hidden"
        onClick={onClose}
      />
    )}

    {/* Sidebar */}
    <div
      className={`z-40 w-72 overflow-y-auto border-r border-(--white-alpha-10) bg-(--eerie-black-1) shadow-xl lg:fixed lg:h-screen lg:w-80 ${isOpen ? "fixed inset-y-0 left-0" : "fixed -left-72 lg:left-0"} transition-all duration-300 ease-in-out`}
    >
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1
            className={`text-2xl font-light text-(--gold-crayola) lg:text-3xl ${playfair.className} tracking-wide`}
          >
            Lobango
          </h1>
          <p className="mt-2 text-sm font-light text-(--quick-silver)">Menu</p>
          <div className="via-opacity-30 mt-4 h-px bg-linear-to-r from-transparent via-(--gold-crayola) to-transparent"></div>
        </div>

        {/* Search */}
        <MenuSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Categories */}
        <MenuCategories
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={onSelectCategory}
        />
      </div>
    </div>
  </>
);
