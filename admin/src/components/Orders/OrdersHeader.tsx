import { Search } from "lucide-react";

interface HeaderProps {
    totalOrders: number;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ totalOrders, searchQuery, onSearchChange }) => (
    <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--white)] mb-2">Orders Management</h1>
                <p className="text-[var(--quick-silver)]">
                    {totalOrders} total orders • Updated just now
                </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-80">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--quick-silver)]" />
                <input
                    type="text"
                    placeholder="Search orders by name, phone, order ID..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--eerie-black-2)] border border-[var(--eerie-black-4)] 
                       rounded-lg text-[var(--white)] placeholder-[var(--quick-silver)] 
                       focus:outline-none focus:ring-2 focus:ring-[var(--gold-crayola)] focus:border-transparent"
                />
                {searchQuery && (
                    <button
                        onClick={() => onSearchChange('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--quick-silver)] hover:text-[var(--white)]"
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    </div>
);

export default Header;