'use client'; 

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { searchOutline, closeOutline } from 'ionicons/icons';

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full py-5 px-20 z-50 transition-all duration-300 border-b-1 border-b-[var(--champagne-pink_20)] ${
          isScrolled 
            ? 'fixed bg-white shadow-md text-[var(--rich-black-fogra-29)]' 
            : 'absolute text-white'
        } ${
          isScrolled && isMenuOpen ? 'bg-white' : ''
        }`}
        data-header
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1>
            <Link href="/" className="text-3xl font-extrabold tracking-tighter">
              Lobango<span className="text-[var(--deep-saffron)]">.</span>
            </Link>
          </h1>

          <nav 
            className={`absolute top-full left-1/2 transform -translate-x-1/2 w-[calc(100%-30px)] bg-white shadow-md px-5 py-0 h-0 overflow-hidden invisible transition-all duration-300 ${
              isMenuOpen ? 'h-[236px] visible' : ''
            } ${
              isScrolled ? 'text-[var(--rich-black-fogra-29)]' : ''
            }`}
            data-navbar
          >
            <ul className="my-2">
              {['Home', 'About Us', 'Shop', 'Blog', 'Contact Us'].map((item) => (
                <li key={item} className="border-b border-black/5 last:border-b-0">
                  <Link 
                    href={`#${item.toLowerCase().replace(' ', '-')}`} 
                    className="block py-2.5 px-4 font-medium text-black transition-colors hover:text-[var(--dark-orange)]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-5">
            <button 
              className="text-2xl transition-colors hover:text-[var(--dark-orange)]"
              aria-label="Search"
              onClick={toggleSearch}
            >
              <IonIcon icon={searchOutline} />
            </button>

            <button className="hidden sm:block bg-[var(--dark-orange)] text-white font-medium px-8 py-2 rounded-full transition-colors hover:bg-[var(--rich-black-fogra-29)]">
              Reservation
            </button>

            <button 
              className="grid gap-1 w-6"
              aria-label="Toggle Menu"
              onClick={toggleMenu}
            >
              <span className={`block h-0.5 bg-current transition-all duration-300 ${
                isMenuOpen ? 'w-3 transform translate-y-1.5 rotate-45' : 'w-2.5'
              }`}></span>
              <span className={`block h-0.5 bg-current transition-all duration-300 ${
                isMenuOpen ? 'transform -rotate-45' : 'w-5'
              }`}></span>
              <span className={`block h-0.5 bg-current transition-all duration-300 ${
                isMenuOpen ? 'w-3 transform -translate-y-1.5 rotate-45' : 'w-2.5 ml-auto'
              }`}></span>
            </button>
          </div>
        </div>
      </header>

      {/* Search Box */}
      <div 
        className={`fixed top-[-60%] left-0 w-full h-[110%] bg-black/95 flex justify-center items-center px-4 z-[60] opacity-0 invisible transition-all duration-500 ${
          isSearchOpen ? 'opacity-100 visible translate-y-[50%]' : ''
        }`}
        data-search-container
      >
        <div className="relative w-full max-w-[500px]">
          <input
            type="search"
            name="search"
            aria-label="Search here"
            placeholder="Type keywords here..."
            className="w-full text-3xl text-[var(--gainsboro)] bg-transparent border-b border-[var(--gainsboro)]/30 px-5 py-5 pr-16 focus:outline-none"
          />

          <button 
            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-4xl text-[var(--onyx)] transition-colors hover:text-[var(--gainsboro)]"
            aria-label="Submit search"
            onClick={toggleSearch}
          >
            <IonIcon icon={searchOutline} />
          </button>

          <button 
            className="absolute inset-0 z-[-1] cursor-pointer"
            aria-label="Cancel search"
            onClick={toggleSearch}
          ></button>
        </div>
      </div>
    </>
  );
}