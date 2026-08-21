import menuData from "@/data/menu.json";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import type { Category, MenuItem } from "@lobango/contracts/menu";
import { useCallback, useMemo, useState } from "react";

const DEFAULT_DESCRIPTIONS: Record<string, string> = {
  chicken:
    "Tender chicken prepared with aromatic spices and traditional techniques",
  mutton: "Slow-cooked mutton with carefully selected spices and herbs",
  fish: "Fresh fish delicately seasoned with regional spices",
  paneer: "Soft cottage cheese in a rich, flavorful sauce",
  dal: "Traditional lentil preparation with authentic spices",
  rice: "Fragrant basmati rice, perfectly steamed",
  momo: "Hand-crafted dumplings with seasoned filling",
  korma: "Creamy, mildly spiced curry with cashews and herbs",
};

export interface UseMenuFilterReturn {
  categories: Category[];
  searchQuery: string;
  isMobileMenuOpen: boolean;
  activeCategory: string;
  setSearchQuery: (query: string) => void;
  setIsMobileMenuOpen: (open: boolean) => void;
  scrollToSection: (category: string) => void;
  getItemDescription: (item: MenuItem) => string;
}

export function useMenuFilter(): UseMenuFilterReturn {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const allCategories = useMemo(
    () => menuData.menu as unknown as Category[],
    []
  );

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return allCategories;
    }
    const query = searchQuery.toLowerCase().trim();
    return allCategories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            cat.category.toLowerCase().includes(query)
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [allCategories, searchQuery]);

  const sectionIds = useMemo(
    () =>
      filteredCategories.map((c) =>
        c.category.replace(/\s+/g, "-").toLowerCase()
      ),
    [filteredCategories]
  );

  const activeSection = useScrollSpy(sectionIds, 100);

  const activeCategory = useMemo(() => {
    const found = filteredCategories.find(
      (cat) => cat.category.replace(/\s+/g, "-").toLowerCase() === activeSection
    );
    return found?.category || filteredCategories[0]?.category || "";
  }, [filteredCategories, activeSection]);

  const getItemDescription = useCallback((item: MenuItem): string => {
    if (item.description) return item.description;
    const itemName = item.name.toLowerCase();
    for (const [key, desc] of Object.entries(DEFAULT_DESCRIPTIONS)) {
      if (itemName.includes(key)) {
        return desc;
      }
    }
    return "Expertly prepared with fresh ingredients and traditional methods";
  }, []);

  const scrollToSection = useCallback((category: string) => {
    const sectionId = category.replace(/\s+/g, "-").toLowerCase();
    const element = document.getElementById(sectionId);
    if (element) {
      setIsMobileMenuOpen(false);
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
    }
  }, []);

  return {
    categories: filteredCategories,
    searchQuery,
    isMobileMenuOpen,
    activeCategory,
    setSearchQuery,
    setIsMobileMenuOpen,
    scrollToSection,
    getItemDescription,
  };
}
