import { X } from 'lucide-react';
import React from 'react';

interface SearchResultsInfoProps {
    searchQuery: string;
    resultCount: number;
    onClearSearch: () => void;
}

const SearchResultsInfo: React.FC<SearchResultsInfoProps> = ({
    searchQuery,
    resultCount,
    onClearSearch
}) => {
    if (!searchQuery.trim()) return null;

    return (
        <div className="mb-4 flex items-center justify-between bg-[var(--eerie-black-2)] border border-[var(--eerie-black-4)] rounded-lg p-3">
        <div className="flex items-center gap-2">
            <span className="text-[var(--white)] text-sm">
                Showing {resultCount} result{resultCount !== 1 ? 's' : ''} for 
            </span>
            <span className="text-[var(--gold-crayola)] font-medium text-sm">"{searchQuery}"</span>
        </div>
        <button
            onClick={onClearSearch}
            className="flex items-center gap-1 text-[var(--quick-silver)] hover:text-[var(--white)] text-sm transition-colors"
        >
            <X size={16} />
            Clear search
        </button>
    </div>
    );
};

export default SearchResultsInfo;