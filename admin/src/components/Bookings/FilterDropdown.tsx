import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { FilterOption } from "../../types/bookings";

interface FilterDropdownProps {
    label: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
    icon: React.ComponentType<{ size?: number; className?: string }>;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
    label,
    options,
    value,
    onChange,
    icon: Icon
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--eerie-black-2)] border border-[var(--eerie-black-4)] rounded-lg text-[var(--white)] text-sm hover:border-[var(--gold-crayola)]/30 transition-colors w-full sm:w-auto min-w-[140px]"
            >
                <Icon size={16} className="text-[var(--gold-crayola)]" />
                <span className="flex-1 text-left">{value || label}</span>
                <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-1 left-0 right-0 sm:right-auto sm:min-w-[180px] bg-[var(--eerie-black-1)] border border-[var(--eerie-black-4)] rounded-lg shadow-xl z-10">
                    <div className="py-1">
                        <button
                            onClick={() => {
                                onChange('');
                                setIsOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-[var(--white)] hover:bg-[var(--eerie-black-3)] text-sm"
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
                                className="block w-full text-left px-4 py-2 text-[var(--white)] hover:bg-[var(--eerie-black-3)] text-sm capitalize"
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterDropdown;