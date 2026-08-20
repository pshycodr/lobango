import React from "react";

export interface MenuSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function MenuSearch({ searchQuery, setSearchQuery }: MenuSearchProps) {
  return (
    <div className="relative mb-8">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <svg
          className="h-4 w-4 text-(--gold-crayola) opacity-60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search our menu..."
        className="focus:ring-opacity-30 focus:border-opacity-50 w-full rounded-lg border border-(--white-alpha-10) bg-(--eerie-black-3) py-3 pr-4 pl-12 text-(--white) placeholder-(--quick-silver) transition-all duration-300 outline-none placeholder:text-sm focus:border-(--gold-crayola) focus:ring-1 focus:ring-(--gold-crayola)"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}
