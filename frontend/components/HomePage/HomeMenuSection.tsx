"use client"

import Image from 'next/image';
import Link from 'next/link';
import { Forum } from "next/font/google"

const forum = Forum({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-forum',
});

const HomeMenuSection = () => {
  const menuItems = [
    {
      image: '/assets/images/menu-1.png',
      title: 'Greek Salad',
      price: '₹25.50',
      badge: 'Seasonal',
      description: 'Tomatoes, green bell pepper, sliced cucumber onion, olives, and feta cheese.'
    },
    {
      image: '/assets/images/menu-2.png',
      title: 'Lasagne',
      price: '₹40.00',
      description: 'Vegetables, cheeses, ground meats, tomato sauce, seasonings and spices'
    },
    {
      image: '/assets/images/menu-3.png',
      title: 'Butternut Pumpkin',
      price: '₹10.00',
      description: 'Typesetting industry lorem Lorem Ipsum is simply dummy text of the priand.'
    },
    {
      image: '/assets/images/menu-4.png',
      title: 'Tokusen Wagyu',
      price: '₹39.00',
      badge: 'New',
      description: 'Vegetables, cheeses, ground meats, tomato sauce, seasonings and spices.'
    },
    {
      image: '/assets/images/menu-5.png',
      title: 'Olivas Rellenas',
      price: '₹25.00',
      description: 'Avocados with crab meat, red onion, crab salad stuffed red bell pepper and green bell pepper.'
    },
    {
      image: '/assets/images/menu-6.png',
      title: 'Opu Fish',
      price: '₹49.00',
      description: 'Vegetables, cheeses, ground meats, tomato sauce, seasonings and spices'
    }
  ];

  return (
    <section className="relative py-15 p-5 sm:px-25 overflow-hidden z-10" aria-label="menu-label" id="menu">
      <div className="container mx-auto px-4">
        <p className="text-center text-lg text-[var(--gold-crayola)] font-bold uppercase tracking-normal mb-3 relative after:content-[''] after:block after:w-25 after:mx-auto after:mt-1.5 after:bg-[url('/assets/images/separator.svg')] after:bg-no-repeat after:bg-center after:h-4">
          Special Selection
        </p>

        <h2 className={`text-center text-2xl text-white ${forum.className} mb-10`}>
          main course
        </h2>

        <ul className="grid gap-10 sm:grid-cols-2 lg:gap-x-50 lg:gap-y-14 mb-12 lg:relative lg:before:absolute lg:before:top-0 lg:before:left-1/2 lg:before:h-full lg:before:border-l lg:before:border-[var(--white-alpha-20)]">
          {menuItems.map((item, index) => (
            <li key={index}>
              <div className="flex items-start gap-5 group">
                <figure 
                  className="flex-shrink-0 rounded-3xl bg-[var(--gold-crayola)] overflow-hidden"
                  style={{ aspectRatio: '100 / 100' }}
                >
                  <Image 
                    src={item.image} 
                    width={100} 
                    height={100} 
                    loading="lazy" 
                    alt={item.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:opacity-70 group-hover:scale-105"
                  />
                </figure>

                <div className="flex-1">
                  <div className="sm:flex sm:justify-start sm:items-center sm:gap-4 mb-2.5">
                    <h3 className={`text-lg text-white ${forum.className} mb-2 sm:mb-0`}>
                      <Link href="#" className="transition-colors hover:text-[var(--gold-crayola)]">
                        {item.title}
                      </Link>
                    </h3>

                    {item.badge && (
                      <span className={`bg-[var(--gold-crayola)] text-[var(--eerie-black-1)] ${forum.className} text-[var(--fontSize-label-1)] leading-[var(--lineHeight-6)] uppercase px-2.5 inline-block mb-2 sm:mb-0`}>
                        {item.badge}
                      </span>
                    )}

                    <span className="flex-1 flex items-center gap-4 relative text-[var(--gold-crayola)] mb-2 sm:mb-0 sm:before:content-[''] sm:before:h-1.5 sm:before:flex-1 sm:before:border-t sm:before:border-b sm:before:border-[var(--white-alpha-20)]">
                      {item.price}
                    </span>
                  </div>

                  <p className="text-[var(--quick-silver)] leading-[var(--lineHeight-4)]">
                    {item.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <p className="text-center text-[var(--white)] mb-7">
          During winter daily from <span className="text-[var(--gold-crayola)]">7:00 pm</span> to <span className="text-[var(--gold-crayola)]">9:00 pm</span>
        </p>

        <Link href="/menu" className="relative mx-auto block w-max text-[var(--gold-crayola)] font-bold uppercase tracking-[3px] border-2 border-[var(--gold-crayola)] px-11 py-3 overflow-hidden z-10 transition-all duration-500 hover:text-[var(--smoky-black-1)] group">
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-[200%] h-[200%] rounded-full bg-[var(--gold-crayola)] transition-all duration-500 -z-10 group-hover:bottom-[-50%]"></div>
          <span className="block transition-transform duration-250 group-hover:-translate-y-10">View All Menu</span>
          <span className="absolute top-full left-1/2 -translate-x-1/2 min-w-max text-[var(--smoky-black-1)] transition-all duration-250 group-hover:top-1/2 group-hover:-translate-y-1/2">View All Menu</span>
        </Link>

        {/* Decorative Shapes */}
        <Image 
          src="/assets/images/shape-5.png" 
          width={921} 
          height={1036} 
          loading="lazy" 
          alt="shape"
          className="hidden lg:block absolute top-0 left-0   -z-10 w-1/2 move-anim"
        />
        <Image 
          src="/assets/images/shape-6.png" 
          width={343} 
          height={345} 
          loading="lazy" 
          alt="shape"
          className="hidden lg:block absolute top-0 left-0   -z-10 w-1/2 move-anim"
        />
      </div>

    </section>
  );
};

export default HomeMenuSection;