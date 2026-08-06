import { Search } from "lucide-react";

interface HeaderProps {
  totalOrders: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  totalOrders,
  searchQuery,
  onSearchChange,
}) => (
  <div className="mb-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="mb-2 text-2xl font-bold text-(--white) md:text-3xl">
          Orders Management
        </h1>
        <p className="text-(--quick-silver)">
          {totalOrders} total orders • Updated just now
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative w-full sm:w-80">
        <Search
          size={20}
          className="absolute top-1/2 left-3 -translate-y-1/2 transform text-(--quick-silver)"
        />
        <input
          type="text"
          placeholder="Search orders by name, phone, order ID..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-(--eerie-black-4) bg-(--eerie-black-2) py-2.5 pr-4 pl-10 text-(--white) placeholder-(--quick-silver) focus:border-transparent focus:ring-2 focus:ring-(--gold-crayola) focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute top-1/2 right-3 -translate-y-1/2 transform text-(--quick-silver) hover:text-(--white)"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  </div>
);

export default Header;
