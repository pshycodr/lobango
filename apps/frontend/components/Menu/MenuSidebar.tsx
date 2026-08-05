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
        className="lg:hidden fixed inset-0 bg-[var(--black-alpha-80)] backdrop-blur-sm z-40"
        onClick={onClose}
      />
    )}

    {/* Sidebar */}
    <div
      className={`
      lg:w-80 w-72 bg-[var(--eerie-black-1)] border-r border-[var(--white-alpha-10)]
      lg:fixed lg:h-screen overflow-y-auto shadow-xl z-40
      ${isOpen ? "fixed inset-y-0 left-0" : "fixed -left-72 lg:left-0"}
      transition-all duration-300 ease-in-out
    `}
    >
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1
            className={`text-2xl lg:text-3xl font-light text-[var(--gold-crayola)] ${playfair.className} tracking-wide`}
          >
            Lobango
          </h1>
          <p className="text-[var(--quick-silver)] text-sm mt-2 font-light">
            Menu
          </p>
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--gold-crayola)] via-opacity-30 to-transparent mt-4"></div>
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
