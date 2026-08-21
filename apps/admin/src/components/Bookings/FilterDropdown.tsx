import type { FilterOption } from "@/types/bookings";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

export interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export function FilterDropdown({
  label,
  options,
  value,
  onChange,
  icon: Icon,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full min-w-[140px] items-center gap-2 rounded-lg border border-(--eerie-black-4) bg-(--eerie-black-2) px-4 py-2 text-sm text-(--white) transition-colors hover:border-(--gold-crayola)/30 sm:w-auto"
      >
        <Icon size={16} className="text-(--gold-crayola)" />
        <span className="flex-1 text-left">{value || label}</span>
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 left-0 z-10 mt-1 rounded-lg border border-(--eerie-black-4) bg-(--eerie-black-1) shadow-xl sm:right-auto sm:min-w-[180px]">
          <div className="py-1">
            <button
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className="block w-full px-4 py-2 text-left text-sm text-(--white) hover:bg-(--eerie-black-3)"
            >
              All {label}
            </button>
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="block w-full px-4 py-2 text-left text-sm text-(--white) capitalize hover:bg-(--eerie-black-3)"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterDropdown;
