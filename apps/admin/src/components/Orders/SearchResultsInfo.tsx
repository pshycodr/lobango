import { X } from "lucide-react";
import React from "react";

interface SearchResultsInfoProps {
  searchQuery: string;
  resultCount: number;
  onClearSearch: () => void;
}

const SearchResultsInfo: React.FC<SearchResultsInfoProps> = ({
  searchQuery,
  resultCount,
  onClearSearch,
}) => {
  if (!searchQuery.trim()) return null;

  return (
    <div className="mb-4 flex items-center justify-between rounded-lg border border-(--eerie-black-4) bg-(--eerie-black-2) p-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-(--white)">
          Showing {resultCount} result{resultCount !== 1 ? "s" : ""} for
        </span>
        <span className="text-sm font-medium text-(--gold-crayola)">
          "{searchQuery}"
        </span>
      </div>
      <button
        onClick={onClearSearch}
        className="flex items-center gap-1 text-sm text-(--quick-silver) transition-colors hover:text-(--white)"
      >
        <X size={16} />
        Clear search
      </button>
    </div>
  );
};

export default SearchResultsInfo;
