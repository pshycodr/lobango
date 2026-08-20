"use client";

import { FloatingCart } from "@/components/Menu/FloatingCart";
import { MenuContent } from "@/components/Menu/MenuContent";
import { MenuSidebar } from "@/components/Menu/MenuSidebar";
import { MobileMenuToggle } from "@/components/Menu/MobileMenuToggle";
import { useMenuFilter } from "@/hooks/useMenuFilter";
import { usePermissionsStore } from "@/store/usePermissionsStore";
import { Rubik } from "next/font/google";
import { useEffect } from "react";

const rubik = Rubik({ subsets: ["latin"] });

export function MenuView() {
  const {
    categories,
    searchQuery,
    isMobileMenuOpen,
    activeCategory,
    setSearchQuery,
    setIsMobileMenuOpen,
    scrollToSection,
    getItemDescription,
  } = useMenuFilter();

  const fetchPermissions = usePermissionsStore(
    (state) => state.fetchPermissions
  );

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  return (
    <div className={`min-h-screen bg-(--smoky-black-1) ${rubik.className}`}>
      <div className="flex">
        <MobileMenuToggle
          isOpen={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <MenuSidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          categories={categories}
          activeCategory={activeCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSelectCategory={scrollToSection}
        />

        <div className="flex-1 lg:ml-80">
          <MenuContent
            categories={categories}
            getDescription={getItemDescription}
          />
        </div>
        <FloatingCart />
      </div>
    </div>
  );
}
