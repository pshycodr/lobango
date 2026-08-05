"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollPos, setLastScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (scrollY >= 50) {
        setIsScrolled(true);

        // Hide header when scrolling down
        if (scrollY > lastScrollPos) {
          setIsHidden(true);
        } else {
          setIsHidden(false);
        }
      } else {
        setIsScrolled(false);
        setIsHidden(false);
      }

      setLastScrollPos(scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollPos]);

  const menuItems = [
    { name: "Home", href: "#home", active: true },
    { name: "Menus", href: "#menu" },
    { name: "About Us", href: "#about" },
  ];

  return (
    <>
      <header
        className={`fixed text-white top-0 left-0 w-full z-40 border-b border-transparent transition-all duration-250 ${isScrolled ? " bg-[var(--eerie-black-4)] border-[var(--black-alpha-15)]" : ""} ${isHidden ? "-translate-y-full delay-250" : ""} sm:top-[px] ${isScrolled ? "sm:top-0" : ""}`}
      >
        <div className="container mx-auto px-5 flex justify-between items-center gap-2">
          <Link href="#" className="block">
            <Image
              src="/assets/images/logo.png"
              className={` ${!isScrolled ? "bg-[var(--smoky-black-1)] rounded-b-xl" : ""}`}
              width={100}
              height={50}
              alt="Labanga - Home"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-end mx-8 flex-1">
            <ul className="flex gap-8">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className={`text-white pb-1 mx-auto text-sm uppercase tracking-tighter font-semibold transition-colors hover:[var(--gold-crayola)] relative after:absolute after:left-0 after:-bottom-2 after:w-full after:h-1.5 after:border-t after:border-b after:border-[var(--gold-crayola)] after:scale-x-20 after:opacity-0 after:transition-all after:duration-500 hover:after:scale-x-100 hover:after:opacity-100 ${item.active ? "text-[var(--gold-crayola)] " : ""}`}
                  >
                    {item.name}
                    <div
                      className={`absolute left-0 -bottom-3 w-full h-1.5 border-t border-b border-[var(--gold-crayola)] transition-all duration-500 ${item.active ? "scale-x-100 opacity-100" : "scale-x-20 opacity-0"}`}
                    ></div>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Find A Table Button */}
          <Link
            href="#reserv"
            className="block min-h-10 relative text-[var(--gold-crayola)]   font-bold uppercase tracking-[3px] max-w-max border-2 border-[var(--gold-crayola)] px-3 sm:px-11 py-2 sm:py-3 text-xs sm:text-base overflow-hidden z-10 transition-all duration-500 hover:text-[var(--smoky-black-1)] group"
          >
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-[200%] h-[200%] rounded-full bg-[var(--gold-crayola)] transition-all duration-500 -z-10 group-hover:bottom-[-50%]"></div>
            <span className="block transition-transform duration-250 group-hover:-translate-y-10">
              Book A Table
            </span>
            <span className="absolute top-full left-1/2 -translate-x-1/2 min-w-max text-[var(--smoky-black-1)] transition-all duration-250 group-hover:top-1/2 group-hover:-translate-y-1/2">
              Book A Table
            </span>
          </Link>
        </div>
      </header>
    </>
  );
};

export default Header;
