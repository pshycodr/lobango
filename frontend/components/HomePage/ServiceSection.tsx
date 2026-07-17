"use client"

import Image from 'next/image';
import Link from 'next/link';
import { Forum } from "next/font/google"

const forum = Forum({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-forum',
});


const ServiceSection = () => {
  const services = [
    {
      image: '/assets/images/service-1.jpg',
      title: 'Snacks',
      width: 285,
      height: 336
    },
    {
      image: '/assets/images/service-2.jpg',
      title: 'Main course',
      width: 285,
      height: 336
    },
    {
      image: '/assets/images/service-3.jpg',
      title: 'Drinks',
      width: 285,
      height: 336
    }
  ];

  return (
    <section className="relative p-5 pt-10 sm:p-[70px]  bg-[var(--smoky-black-2)] text-center overflow-hidden z-10" aria-label="service">
      <div className="container mx-auto px-4">
        <p className="text-xs text-[var(--gold-crayola)] font-bold uppercase tracking-tighter mb-3 relative after:content-[''] after:block after:w-25 after:mx-auto after:mt-1.5 after:bg-[url('/assets/images/separator.svg')] after:bg-no-repeat after:bg-center after:h-4">
          Flavors For Royalty
        </p>

        <h2 className={`${forum.className} text-4xl sm:text-5xl text-white mb-4`}>
          We Offer Top Notch
        </h2>

        <p className="text-xs sm:text-sm text-white leading-10 mb-10">
          Lobanga Provide Best Quality and Hygienic Food
        </p>

        <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-40">
          {services.map((service, index) => (
           <li
           key={index}
           className={`transition-transform duration-500 ${
             index === 0 || index === 2 ? 'lg:-translate-y-30' : ''
           }`}
         >
              <div className="">
                
                <Link href="#" className="relative block pb-8 mb-7 z-10 group">
                  <div 
                    className="relative scale-95 overflow-hidden bg-[var(--eerie-black-4)] transition-transform duration-500 group-hover:scale-100"
                    style={{ aspectRatio: `${service.width} / ${service.height}` }}
                  >
                    
                    <Image 
                      src={service.image} 
                      width={service.width} 
                      height={service.height} 
                      loading="lazy" 
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Shine Effect */}
                    <div className="absolute -left-15 inset-0 w-1/2 h-full bg-gradient-to-r from-transparent to-white/40 -skew-x-12 -translate-x-full transition-transform duration-1000 group-hover:translate-x-[275%]"></div>
                  </div>
                  
                  {/* Pattern Background */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-35 h-full bg-[url('/assets/images/img-pattern.svg')] bg-center bg-cover bg-repeat transition-all duration-500 -z-10 group-hover:scale-x-[-1] group-hover:delay-300"></div>
                </Link>

                <div className='relative -top-5'>
                  <h3 className={`text-3xl text-white ${forum.className}`}>
                    <Link href="#" className="transition-colors hover:text-[var(--gold-crayola)]">
                      {service.title}
                    </Link>
                  </h3>

                  <Link href="/menu" className="text-[var(--gold-crayola)] pb-1 mx-auto text-sm uppercase tracking-tighter font-bold transition-colors hover:text-white relative after:absolute after:left-0 after:-bottom-2 after:w-full after:h-1.5 after:border-t after:border-b after:border-[var(--gold-crayola)] after:scale-x-20 after:opacity-0 after:transition-all after:duration-500 hover:after:scale-x-100 hover:after:opacity-100">
                    View Menu
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Decorative Shapes */}
        <Image 
          src="/assets/images/shape-1.png" 
          width={246} 
          height={412} 
          loading="lazy" 
          alt="shape"
          className="hidden lg:block absolute bottom-0 left-0 max-w-max -z-10 move-anim"
        />
        <Image 
          src="/assets/images/shape-2.png" 
          width={343} 
          height={345} 
          loading="lazy" 
          alt="shape"
          className="hidden lg:block scale-160 absolute top-15 right-5 max-w-max -z-10 move-anim"
        />
      </div>
    </section>
  );
};

export default ServiceSection;