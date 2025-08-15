'use client';

import { useEffect, useState } from 'react';
import { Forum } from "next/font/google";

const forum = Forum({
  subsets: ['latin'],
  weight: ['400'],
});

const Preloader = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
      document.body.classList.add('loaded');
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`fixed inset-0 bg-[var(--smoky-black-1)] z-50 flex items-center justify-center transition-all duration-1000 ease-in-out ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'} ${forum.className}`}>
      
      <div className="text-center">
        {/* Main Logo Circle */}
        <div className="relative w-20 h-20 mx-auto mb-8">
          <div className="absolute inset-0 border-2 border-[var(--white-alpha-10)] rounded-full"></div>
          <div className="absolute inset-0 border-2 border-transparent border-t-[var(--gold-crayola)] rounded-full animate-spin"></div>
          <div className="absolute inset-3 border border-transparent border-t-[var(--gold-crayola)] rounded-full animate-spin" 
               style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>

        {/* Restaurant Name */}
        <div className="mb-6">
          <h1 className="text-4xl font-light text-[var(--gold-crayola)] tracking-[0.25em] mb-3 font-forum">
            LOBANGO
          </h1>
          <div className="w-24 h-px bg-[var(--gold-crayola)] mx-auto mb-2"></div>
          <p className="text-[var(--white-alpha-20)] text-xs tracking-[0.2em] uppercase">
            Multi Cuisine Restaurant
          </p>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-[var(--gold-crayola)] rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-[var(--gold-crayola)] rounded-full animate-bounce" 
               style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-[var(--gold-crayola)] rounded-full animate-bounce" 
               style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>

    </div>
  );
};

export default Preloader;