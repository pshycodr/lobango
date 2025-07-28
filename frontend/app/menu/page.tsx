'use client';

import { useState, useEffect, useRef } from 'react';
import menuData from '@/data/menu.json';
import { Rubik } from "next/font/google";
import { MobileMenuToggle } from '@/components/Menu/MobileMenuToggle';
import { MenuSidebar } from '@/components/Menu/MenuSidebar';
import { MenuContent } from '@/components/Menu/MenuContent';
import { Category, MenuItem } from '@/types/menu';

const rubik = Rubik({ subsets: ['latin'] });

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

export default function MenuPage() {
  // @ts-ignore
  const [filteredCategories, setFilteredCategories] = useState<Category[]>(menuData.menu);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  // @ts-ignore
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  const getItemDescription = (item: MenuItem) => {
    if (item.description) return item.description;

    const descriptions: Record<string, string> = {
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
          <MobileMenuToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />

          <MenuSidebar
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            categories={filteredCategories}
            activeCategory={activeCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSelectCategory={scrollToSection}
          />

          <div className="flex-1 lg:ml-80">
            <MenuContent 
              categories={filteredCategories} 
              getDescription={getItemDescription} 
            />
          </div>
        </div>
      </div>
    </>
  );
}