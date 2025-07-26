'use client';

import Image from 'next/image';
import { useRef } from 'react';


const promoItems = [
  {
    title: "Maxican Pizza",
    description: "Food is any substance consumed to provide nutritional support for an organism.",
    image: "/assets/images/promo-1.png",
    icon: "/assets/images/promo-icon-1.svg"
  },
  {
    title: "Soft Drinks",
    description: "Food is any substance consumed to provide nutritional support for an organism.",
    image: "/assets/images/promo-2.png",
    icon: "/assets/images/promo-icon-2.svg"
  },
  {
    title: "French Fry",
    description: "Food is any substance consumed to provide nutritional support for an organism.",
    image: "/assets/images/promo-3.png",
    icon: "/assets/images/promo-icon-3.svg"
  },
  {
    title: "Burger Kingo",
    description: "Food is any substance consumed to provide nutritional support for an organism.",
    image: "/assets/images/promo-4.png",
    icon: "/assets/images/promo-icon-4.svg"
  },
  {
    title: "Chicken Masala",
    description: "Food is any substance consumed to provide nutritional support for an organism.",
    image: "/assets/images/promo-5.png",
    icon: "/assets/images/promo-icon-5.svg"
  }
];

export default function Promo() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="section-divider bg-isabelline py-16">
      <div className="container mx-auto px-4 relative">
        {/* Navigation Arrows - Desktop Only */}
        <div className="hidden md:flex justify-between absolute top-1/2 left-0 right-0 transform -translate-y-1/2 z-10 px-2">
          <button 
            onClick={scrollLeft}
            className="bg-white p-2 rounded-full shadow-md hover:bg-[var(--deep-saffron)] hover:text-white transition-colors"
            aria-label="Scroll left"
          >
            &larr;
          </button>
          <button 
            onClick={scrollRight}
            className="bg-white p-2 rounded-full shadow-md hover:bg-[var(--deep-saffron)] hover:text-white transition-colors"
            aria-label="Scroll right"
          >
            &rarr;
          </button>
        </div>

        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-10 scrollbar-hide snap-x snap-mandatory"
        >
          {promoItems.map((item, index) => (
            <div 
              key={index}
              className="flex-shrink-0 w-[300px] snap-start scroll-ml-4 first:pl-4 last:pr-4"
            >
              <PromoCard {...item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PromoCard({ title, description, image, icon }: typeof promoItems[0]) {
    return (
      <div className="relative bg-white text-center p-10 shadow-md z-1 group overflow-hidden">
        {/* Yellow background animation */}
        <div className="absolute inset-0 bg-[var(--deep-saffron)] z-[-1] transition-all duration-500 ease-in-out 
          origin-bottom scale-y-[0.3] group-hover:scale-y-100
          before:content-[''] before:absolute before:inset-0 before:bg-[var(--deep-saffron)] 
          before:clip-path-mexican before:transition-all before:duration-500 
          before:group-hover:clip-path-full" />
        
        {/* Card content */}
        <div className="relative z-10">
          <div className="mb-6 transition-colors duration-300 group-hover:[&_path]:fill-white">
            <Image 
              src={icon} 
              width={60} 
              height={60} 
              alt="" 
              className="mx-auto"
            />
          </div>
  
          <h3 className="text-xl font-semibold mb-4 transition-colors duration-300 group-hover:text-white">
            {title}
          </h3>
  
          <p className="mb-4 transition-colors duration-300 group-hover:text-white">
            {description}
          </p>
  
          <div className="w-[200px] h-[200px] mx-auto relative">
            <Image 
              src={image} 
              width={300} 
              height={300} 
              alt={title}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>
      </div>
    );
}