export const MenuSearch = ({ 
    searchQuery, 
    setSearchQuery 
  }: {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
  }) => (
    <div className="relative mb-8">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg className="h-4 w-4 text-[var(--gold-crayola)] opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search our menu..."
        className="w-full pl-12 pr-4 py-3 bg-[var(--eerie-black-3)] border border-[var(--white-alpha-10)] rounded-lg text-[var(--white)] placeholder-[var(--quick-silver)] placeholder:text-sm focus:ring-1 focus:ring-[var(--gold-crayola)] focus:ring-opacity-30 focus:border-[var(--gold-crayola)] focus:border-opacity-50 outline-none transition-all duration-300"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );