
const FilterButton: React.FC<{
    label: string;
    isActive: boolean;
    count: number;
    onClick: () => void;
}> = ({ label, isActive, count, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${isActive
            ? 'bg-[var(--gold-crayola)] text-[var(--smoky-black-1)]'
            : 'bg-[var(--eerie-black-2)] text-[var(--quick-silver)] hover:bg-[var(--eerie-black-3)] hover:text-[var(--white)]'
            }`}
    >
        {label} {count > 0 && `(${count})`}
    </button>
);

export default FilterButton
