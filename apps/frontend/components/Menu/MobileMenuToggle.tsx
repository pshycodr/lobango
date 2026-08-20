import React from "react";

export interface MobileMenuToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

export function MobileMenuToggle({ isOpen, onClick }: MobileMenuToggleProps) {
  return (
    <button
      onClick={onClick}
      className="fixed top-6 left-6 z-50 rounded-lg border border-(--white-alpha-10) bg-(--eerie-black-2) p-2.5 text-(--gold-crayola) shadow-lg backdrop-blur-sm transition-all duration-200 hover:border-(--gold-crayola) lg:hidden"
      aria-label="Toggle menu"
    >
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {isOpen ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M6 18L18 6M6 6l12 12"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 6h16M4 12h16M4 18h16"
          />
        )}
      </svg>
    </button>
  );
}
