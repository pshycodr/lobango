export const MobileMenuToggle = ({ 
    isOpen, 
    onClick 
  }: {
    isOpen: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className="lg:hidden fixed top-6 left-6 z-50 bg-[var(--eerie-black-2)] border border-[var(--white-alpha-10)] text-[var(--gold-crayola)] p-2.5 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-200 hover:border-[var(--gold-crayola)] hover:border-opacity-30"
      aria-label="Toggle menu"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {isOpen ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
        )}
      </svg>
    </button>
  );