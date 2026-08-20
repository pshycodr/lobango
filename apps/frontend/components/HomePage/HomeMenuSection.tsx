"use client";

import { Forum } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const forum = Forum({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-forum",
});

export function HomeMenuSection() {
  const menuItems = [
    {
      image: "/assets/images/tandorisnacks/tandoorichicken.jpg",
      title: "Tandoori Chicken (1pc)",
      price: "₹130",
      badge: "Non-Veg",
      description:
        "Chicken marinated in yogurt & spices, roasted in a tandoor for a smoky flavor.",
      link: "/menu#kebabs",
    },
    {
      image: "/assets/images/roll/chicken roll.jpg",
      title: "Chicken Roll",
      price: "₹50",
      badge: "Non-Veg",
      description:
        "Spiced chicken wrapped in paratha with onions, chutney & lime.",
      link: "/menu#rolls",
    },
    {
      image: "/assets/images/indianchineaseveg/PaneerButterMasala.jpg",
      title: "Paneer Butter Masala",
      price: "₹190",
      badge: "Veg",
      description: "Soft paneer in a creamy, buttery tomato gravy.",
      link: "/menu#indian/chinese-(veg)",
    },
    {
      image: "/assets/images/nonvegstarters/chickenlolipop.jpg",
      title: "Chicken Lollipop",
      price: "₹180",
      badge: "Non-Veg",
      description: "Crispy chicken wings marinated in spices & deep-fried.",
      link: "/menu#non-veg-starters",
    },
    {
      image: "/assets/images/momo/vegmomo.jpg",
      title: "Veg Momo",
      price: "₹50",
      badge: "Veg",
      description: "Steamed dumplings filled with vegetables & spices.",
      link: "/menu#momos",
    },
    {
      image: "/assets/images/cocktail/bluelagun.jpg",
      title: "Blue Lagoon",
      price: "₹99",
      badge: "Veg",
      description: "Refreshing mocktail with blue curaçao, lemonade & soda.",
      link: "/menu#mocktails",
    },
  ];

  return (
    <section
      className="relative z-10 overflow-hidden p-5 py-15 sm:px-25"
      aria-label="menu-label"
      id="menu"
    >
      <div className="container mx-auto px-4">
        <p className="relative mb-10 text-center text-lg font-bold tracking-normal text-(--gold-crayola) uppercase after:mx-auto after:mt-1.5 after:block after:h-4 after:w-25 after:bg-[url('/assets/images/separator.svg')] after:bg-center after:bg-no-repeat after:content-['']">
          Our Best Sellers
        </p>

        <ul className="mb-12 grid gap-10 sm:grid-cols-2 lg:relative lg:gap-x-50 lg:gap-y-14 lg:before:absolute lg:before:top-0 lg:before:left-1/2 lg:before:h-full lg:before:border-l lg:before:border-(--white-alpha-20)">
          {menuItems.map((item, index) => (
            <li key={index}>
              <div className="group flex items-start gap-5">
                <figure
                  className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-(--gold-crayola) sm:h-32 sm:w-32 lg:h-28 lg:w-28"
                  style={{
                    minWidth: "7rem",
                    minHeight: "7rem",
                  }}
                >
                  <Image
                    src={item.image}
                    width={110}
                    height={110}
                    loading="lazy"
                    alt={item.title}
                    className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-70"
                    style={{
                      borderRadius: "0.75rem",
                    }}
                  />
                </figure>

                <div className="flex-1">
                  <div className="mb-2.5 sm:flex sm:items-center sm:justify-start sm:gap-4">
                    <h3
                      className={`text-lg text-white ${forum.className} mb-2 sm:mb-0`}
                    >
                      <Link
                        href={item.link}
                        className="transition-colors hover:text-(--gold-crayola)"
                      >
                        {item.title}
                      </Link>
                    </h3>

                    {item.badge && (
                      <span
                        className={`bg-(--gold-crayola) text-(--eerie-black-1) ${forum.className} mb-2 inline-block px-2.5 leading-(--lineHeight-6) text-(--fontSize-label-1) uppercase sm:mb-0`}
                      >
                        {item.badge}
                      </span>
                    )}

                    <span className="relative mb-2 flex flex-1 items-center gap-4 text-(--gold-crayola) sm:mb-0 sm:before:h-1.5 sm:before:flex-1 sm:before:border-t sm:before:border-b sm:before:border-(--white-alpha-20) sm:before:content-['']">
                      {item.price}
                    </span>
                  </div>

                  <p className="leading-(--lineHeight-4) text-(--quick-silver)">
                    {item.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <p className="mb-7 text-center text-(--white)">
          Home Delivery From{" "}
          <span className="text-(--gold-crayola)">11:00 am</span> to{" "}
          <span className="text-(--gold-crayola)">10:00 pm</span>
        </p>

        <Link
          href="/menu"
          className="group relative z-10 mx-auto block w-max overflow-hidden border-2 border-(--gold-crayola) px-11 py-3 font-bold tracking-[3px] text-(--gold-crayola) uppercase transition-all duration-500 hover:text-(--smoky-black-1)"
        >
          <div className="absolute bottom-full left-1/2 -z-10 h-[200%] w-[200%] -translate-x-1/2 rounded-full bg-(--gold-crayola) transition-all duration-500 group-hover:bottom-[-50%]"></div>
          <span className="block transition-transform duration-250 group-hover:-translate-y-10">
            View All Menu
          </span>
          <span className="absolute top-full left-1/2 min-w-max -translate-x-1/2 text-(--smoky-black-1) transition-all duration-250 group-hover:top-1/2 group-hover:-translate-y-1/2">
            View All Menu
          </span>
        </Link>

        {/* Decorative Shapes */}
        <Image
          src="/assets/images/shape-5.png"
          width={921}
          height={1036}
          loading="lazy"
          alt="shape"
          className="move-anim absolute top-0 left-0 -z-10 w-1/2"
        />
      </div>
    </section>
  );
}

export default HomeMenuSection;
