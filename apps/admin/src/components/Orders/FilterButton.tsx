const FilterButton: React.FC<{
  label: string;
  isActive: boolean;
  count: number;
  onClick: () => void;
}> = ({ label, isActive, count, onClick }) => (
  <button
    onClick={onClick}
    className={`rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-300 ${
      isActive
        ? "bg-(--gold-crayola) text-(--smoky-black-1)"
        : "bg-(--eerie-black-2) text-(--quick-silver) hover:bg-(--eerie-black-3) hover:text-(--white)"
    }`}
  >
    {label} {count > 0 && `(${count})`}
  </button>
);

export default FilterButton;
