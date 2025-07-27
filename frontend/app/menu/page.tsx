// app/menu/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import menuData from '../../data/menu.json';
import { Rubik, Playfair_Display } from "next/font/google";

const rubik = Rubik({ subsets: ['latin'] });
const playfair = Playfair_Display({ subsets: ['latin'] });

// Color CSS Variables
const colorVars = `
  :root {
    --gold-crayola: hsl(38, 61%, 73%);
    --quick-silver: hsla(0, 0%, 65%, 1);
    --davys-grey: hsla(30, 3%, 34%, 1);
    --smoky-black-1: hsla(40, 12%, 5%, 1);
    --smoky-black-2: hsla(30, 8%, 5%, 1);
    --smoky-black-3: hsla(0, 3%, 7%, 1);
    --eerie-black-1: hsla(210, 4%, 9%, 1);
    --eerie-black-2: hsla(210, 4%, 11%, 1);
    --eerie-black-3: hsla(180, 2%, 8%, 1);
    --eerie-black-4: hsla(0, 0%, 13%, 1);
    --white: hsla(0, 0%, 100%, 1);
    --white-alpha-20: hsla(0, 0%, 100%, 0.2);
    --white-alpha-10: hsla(0, 0%, 100%, 0.1);
    --black: hsla(0, 0%, 0%, 1);
    --black-alpha-80: hsla(0, 0%, 0%, 0.8);
    --black-alpha-15: hsla(0, 0%, 0%, 0.15);
  }
`;

type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  isVeg?: boolean;
};

type Category = {
  category: string;
  items: MenuItem[];
};

// Search Component
const SearchBar = ({ searchQuery, setSearchQuery, isMobile }: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isMobile: boolean;
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
      className={`w-full pl-12 pr-4 ${isMobile ? 'py-3' : 'py-3'} bg-[var(--eerie-black-3)] border border-[var(--white-alpha-10)] rounded-lg text-[var(--white)] placeholder-[var(--quick-silver)] placeholder:text-sm focus:ring-1 focus:ring-[var(--gold-crayola)] focus:ring-opacity-30 focus:border-[var(--gold-crayola)] focus:border-opacity-50 outline-none transition-all duration-300`}
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>
);

// Mobile Menu Toggle Button
const MobileMenuToggle = ({ isOpen, setIsOpen }: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => (
  <button
    onClick={() => setIsOpen(!isOpen)}
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

// Sidebar Navigation Component
const SidebarNavigation = ({ filteredCategories, activeCategory, scrollToSection, searchQuery, setSearchQuery, isMobileMenuOpen, setIsMobileMenuOpen }: {
  filteredCategories: Category[];
  activeCategory: string;
  scrollToSection: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}) => (
  <>
    {/* Mobile Overlay */}
    {isMobileMenuOpen && (
      <div
        className="lg:hidden fixed inset-0 bg-[var(--black-alpha-80)] backdrop-blur-sm z-40"
        onClick={() => setIsMobileMenuOpen(false)}
      />
    )}

    {/* Sidebar */}
    <div className={`
      lg:w-80 w-72 bg-[var(--eerie-black-1)] border-r border-[var(--white-alpha-10)]
      lg:fixed lg:h-screen overflow-y-auto shadow-xl z-40
      ${isMobileMenuOpen ? 'fixed inset-y-0 left-0' : 'fixed -left-72 lg:left-0'}
      transition-all duration-300 ease-in-out
    `}>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className={`text-2xl lg:text-3xl font-light text-[var(--gold-crayola)] ${playfair.className} tracking-wide`}>
            Lobango
          </h1>
          <p className="text-[var(--quick-silver)] text-sm mt-2 font-light">Menu</p>
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--gold-crayola)] via-opacity-30 to-transparent mt-4"></div>
        </div>

        {/* Search */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isMobile={true}
        />

        {/* Navigation Categories */}
        <nav className="space-y-1">
          {filteredCategories.map((category) => (
            <button
              key={category.category}
              onClick={() => {
                scrollToSection(category.category);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-md transition-all duration-200 group ${activeCategory === category.category
                  ? 'bg-[var(--white-alpha-10)] text-[var(--gold-crayola)] border-l-2 border-[var(--gold-crayola)]'
                  : 'text-[var(--quick-silver)] hover:bg-[var(--white-alpha-10)] hover:text-[var(--white)] hover:pl-5'
                }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-normal text-sm">{category.category}</span>
                <span className={`text-xs text-[var(--quick-silver)] ${activeCategory === category.category ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
                  } transition-opacity`}>
                  {category.items.length}
                </span>
              </div>
            </button>
          ))}
        </nav>
      </div>
    </div>
  </>
);

// Hero Section Component
const HeroSection = () => (
  <div className="mb-16 text-center px-4">
    <h2 className={`text-3xl md:text-4xl lg:text-5xl font-light text-[var(--white)] mb-6 ${playfair.className} tracking-wide`}>
      Our Menu
    </h2>
    <p className="text-[var(--quick-silver)] text-base lg:text-lg max-w-2xl mx-auto font-light leading-relaxed">
      Carefully crafted dishes that celebrate flavor, tradition, and culinary artistry
    </p>
    <div className="flex justify-center items-center gap-4 mt-8">
      <div className="h-px w-12 bg-[var(--gold-crayola)] opacity-40"></div>
      <div className="w-1 h-1 bg-[var(--gold-crayola)] rounded-full opacity-60"></div>
      <div className="h-px w-12 bg-[var(--gold-crayola)] opacity-40"></div>
    </div>
  </div>
);

// Menu Item Card Component
const MenuItemCard = ({ item, isVeg, getItemDescription, getItemImage }: {
  item: MenuItem;
  isVeg: boolean;
  getItemDescription: (item: MenuItem) => string;
  getItemImage: (item: MenuItem) => string;
}) => (
  <div className="bg-[var(--eerie-black-2)] rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-[var(--white-alpha-10)] hover:border-[var(--white-alpha-20)] group">
    <div className="flex flex-col sm:flex-row">
      {/* Item Info */}
      <div className="flex-1 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-[var(--white)] mb-2 group-hover:text-[var(--gold-crayola)] transition-colors duration-200">
              {item.name}
            </h3>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-3 h-3 border border-opacity-80 flex items-center justify-center ${isVeg ? 'border-green-400' : 'border-red-400'
                }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-green-400' : 'bg-red-400'
                  }`}></div>
              </div>
              <span className="text-xs text-[var(--quick-silver)] font-light">
                {isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
              </span>
            </div>
          </div>
          <div className="text-right ml-4">
            <span className="text-xl font-medium text-[var(--gold-crayola)]">
              ₹{item.price}
            </span>
          </div>
        </div>

        <p className="text-[var(--quick-silver)] text-sm mb-6 leading-relaxed font-light">
          {getItemDescription(item)}
        </p>

        <button className="w-full bg-transparent border border-[var(--gold-crayola)] border-opacity-60 hover:bg-[var(--gold-crayola)] hover:bg-opacity-10 hover:text-[var(--smokey-black-2)] hover:font-semibold text-[var(--gold-crayola)] font-light py-2.5 px-4 rounded-md transition-all duration-200 text-sm">
          Add to Order
        </button>
      </div>

      {/* Item Image */}
      <div className="w-full sm:w-24 lg:w-28 h-24 lg:h-28 m-4 rounded-md overflow-hidden flex-shrink-0">
        <div className={`w-full h-full ${getItemImage(item)} flex items-center justify-center text-white text-xs text-center p-2 opacity-90`}>
          <span className="font-light drop-shadow-sm">{item.name}</span>
        </div>
      </div>
    </div>
  </div>
);

// Menu Section Component
const MenuSection = ({ category, sectionRefs, isVegetarian, getItemDescription, getItemImage }: {
  category: Category;
  sectionRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
  isVegetarian: (item: MenuItem) => boolean;
  getItemDescription: (item: MenuItem) => string;
  getItemImage: (item: MenuItem) => string;
}) => (
  <div
    // @ts-ignore
    ref={(el) => (sectionRefs.current[category.category] = el)}
    className="mb-16 px-4"
    id={category.category.replace(/\s+/g, '-').toLowerCase()}
  >
    {/* Section Header */}
    <div className="mb-10">
      <h2 className={`text-2xl md:text-3xl font-light text-[var(--white)] mb-3 ${playfair.className} tracking-wide`}>
        {category.category}
      </h2>
      <div className="h-px w-16 bg-[var(--gold-crayola)] opacity-50 rounded-full"></div>
      <p className="text-[var(--quick-silver)] mt-3 text-sm font-light">
        {category.items.length} items
      </p>
    </div>

    {/* Menu Items Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {category.items.map((item) => {
        const isVeg = isVegetarian(item);
        return (
          <MenuItemCard
            key={item.id}
            item={item}
            isVeg={isVeg}
            getItemDescription={getItemDescription}
            getItemImage={getItemImage}
          />
        );
      })}
    </div>
  </div>
);

// No Results Component
const NoResults = () => (
  <div className="text-center py-20 px-4">
    <div className="text-6xl mb-8 opacity-30">🔍</div>
    <h2 className="text-2xl font-light text-[var(--white)] mb-4">No dishes found</h2>
    <p className="text-[var(--quick-silver)] text-base font-light">Please try a different search term</p>
  </div>
);

// Main Menu Page Component
const MenuPage = () => {
  // @ts-ignore
  const [filteredCategories, setFilteredCategories] = useState<Category[]>(menuData.menu);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  // @ts-ignore
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // Helper function to determine if item is vegetarian
  const isVegetarian = (item: MenuItem) => {
    const vegKeywords = ['paneer', 'veg', 'dal', 'aloo', 'palak', 'mushroom', 'cheese', 'cottage', 'korma'];
    const nonVegKeywords = ['chicken', 'mutton', 'fish', 'prawn', 'egg', 'meat', 'lamb', 'goat', 'momo'];

    const itemName = item.name.toLowerCase();
    const hasVegKeyword = vegKeywords.some(keyword => itemName.includes(keyword));
    const hasNonVegKeyword = nonVegKeywords.some(keyword => itemName.includes(keyword));

    if (hasNonVegKeyword) return false;
    if (hasVegKeyword) return true;

    return true;
  };

  // Generate descriptions for items
  const getItemDescription = (item: MenuItem) => {
    if (item.description) return item.description;

    const descriptions: { [key: string]: string } = {
      'chicken': 'Tender chicken prepared with aromatic spices and traditional techniques',
      'mutton': 'Slow-cooked mutton with carefully selected spices and herbs',
      'fish': 'Fresh fish delicately seasoned with regional spices',
      'paneer': 'Soft cottage cheese in a rich, flavorful sauce',
      'dal': 'Traditional lentil preparation with authentic spices',
      'rice': 'Fragrant basmati rice, perfectly steamed',
      'momo': 'Hand-crafted dumplings with seasoned filling',
      'korma': 'Creamy, mildly spiced curry with cashews and herbs'
    };

    const itemName = item.name.toLowerCase();
    for (const [key, desc] of Object.entries(descriptions)) {
      if (itemName.includes(key)) {
        return desc;
      }
    }

    return 'Expertly prepared with fresh ingredients and traditional methods';
  };

  // Get item image gradient
  const getItemImage = (item: MenuItem) => {
    const itemName = item.name.toLowerCase();

    if (itemName.includes('chicken') || itemName.includes('mutton') || itemName.includes('goat')) {
      return 'bg-gradient-to-br from-amber-700 to-orange-800';
    } else if (itemName.includes('fish')) {
      return 'bg-gradient-to-br from-blue-600 to-teal-700';
    } else if (itemName.includes('paneer') || itemName.includes('korma')) {
      return 'bg-gradient-to-br from-yellow-600 to-orange-600';
    } else if (itemName.includes('dal')) {
      return 'bg-gradient-to-br from-yellow-700 to-amber-800';
    } else if (itemName.includes('momo')) {
      return 'bg-gradient-to-br from-red-600 to-pink-700';
    } else if (itemName.includes('rice')) {
      return 'bg-gradient-to-br from-green-600 to-emerald-700';
    }

    return 'bg-gradient-to-br from-gray-500 to-gray-700';
  };

  // Scroll spy functionality
  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling) return;

      const sections = Object.entries(sectionRefs.current);
      const scrollPosition = window.scrollY + 200;

      let currentSection = '';

      for (const [category, ref] of sections) {
        if (ref) {
          const { offsetTop, offsetHeight } = ref;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            currentSection = category;
            break;
          }
        }
      }

      if (currentSection && currentSection !== activeCategory) {
        setActiveCategory(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeCategory, isScrolling]);

  // Handle search filtering
  useEffect(() => {
    let result = [...menuData.menu];

    if (searchQuery) {
      result = result.map(category => ({
        ...category,
        items: category.items.filter(item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.items.length > 0);
    }
    // @ts-ignore
    setFilteredCategories(result);

    if (result.length > 0 && !activeCategory) {
      setActiveCategory(result[0].category);
    }
  }, [searchQuery, activeCategory]);

  // Smooth scroll to section
  const scrollToSection = (category: string) => {
    const section = sectionRefs.current[category];
    if (section) {
      setIsScrolling(true);
      setActiveCategory(category);

      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: colorVars }} />
      <div className={`min-h-screen bg-[var(--smoky-black-1)] ${rubik.className}`}>
        <div className="flex">
          {/* Mobile Menu Toggle */}
          <MobileMenuToggle
            isOpen={isMobileMenuOpen}
            setIsOpen={setIsMobileMenuOpen}
          />

          {/* Sidebar Navigation */}
          <SidebarNavigation
            filteredCategories={filteredCategories}
            activeCategory={activeCategory}
            scrollToSection={scrollToSection}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />

          {/* Main Content */}
          <div className="flex-1 lg:ml-80">
            <div className="pt-20 lg:pt-12 pb-12">
              {/* Hero Section */}
              <HeroSection />

              {/* Menu Sections */}
              {filteredCategories.length === 0 ? (
                <NoResults />
              ) : (
                filteredCategories.map((category) => (
                  <MenuSection
                    key={category.category}
                    category={category}
                    sectionRefs={sectionRefs}
                    isVegetarian={isVegetarian}
                    getItemDescription={getItemDescription}
                    getItemImage={getItemImage}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MenuPage;