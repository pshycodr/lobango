'use client';

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY >= 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-5 right-5 bg-[var(--gold-crayola)] text-[var(--smoky-black-1)] text-xl w-12 h-12 rounded-full grid place-items-center shadow-[var(--shadow-1)] transition-all duration-250 z-40 hover:bg-white hover:text-[var(--gold-crayola)] ${isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      aria-label="back to top"
    >
      <ChevronUp />
    </button>
  );
};

export default BackToTop;