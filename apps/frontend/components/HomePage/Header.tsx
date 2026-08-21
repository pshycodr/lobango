"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollPos, setLastScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (scrollY >= 50) {
        setIsScrolled(true);
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
    <header
      className={`fixed top-0 left-0 z-40 w-full border-b border-transparent text-white transition-all duration-250 ${
        isScrolled ? "border-(--black-alpha-15) bg-(--eerie-black-4)" : ""
      } ${isHidden ? "-translate-y-full delay-250" : ""} ${
        isScrolled ? "sm:top-0" : ""
      }`}
    >
      <div className="container mx-auto flex items-center justify-between gap-2 px-5">
        <Link href="#" className="block">
          <Image
            src="/assets/images/logo.png"
            className={`${!isScrolled ? "rounded-b-xl bg-(--smoky-black-1)" : ""}`}
            width={100}
            height={50}
            alt="Labanga - Home"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="mx-8 hidden flex-1 items-center justify-end lg:flex">
          <ul className="flex gap-8">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className={`hover:[var(--gold-crayola)] relative mx-auto pb-1 text-sm font-semibold tracking-tighter text-white uppercase transition-colors after:absolute after:-bottom-2 after:left-0 after:h-1.5 after:w-full after:scale-x-20 after:border-t after:border-b after:border-(--gold-crayola) after:opacity-0 after:transition-all after:duration-500 hover:after:scale-x-100 hover:after:opacity-100 ${
                    item.active ? "text-(--gold-crayola)" : ""
                  }`}
                >
                  {item.name}
                  <div
                    className={`absolute -bottom-3 left-0 h-1.5 w-full border-t border-b border-(--gold-crayola) transition-all duration-500 ${
                      item.active
                        ? "scale-x-100 opacity-100"
                        : "scale-x-20 opacity-0"
                    }`}
                  ></div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Find A Table Button */}
        <Link
          href="#reserv"
          className="group relative z-10 block min-h-10 max-w-max overflow-hidden border-2 border-(--gold-crayola) px-3 py-2 text-xs font-bold tracking-[3px] text-(--gold-crayola) uppercase transition-all duration-500 hover:text-(--smoky-black-1) sm:px-11 sm:py-3 sm:text-base"
        >
          <div className="absolute bottom-full left-1/2 -z-10 h-[200%] w-[200%] -translate-x-1/2 rounded-full bg-(--gold-crayola) transition-all duration-500 group-hover:bottom-[-50%]"></div>
          <span className="block transition-transform duration-250 group-hover:-translate-y-10">
            Book A Table
          </span>
          <span className="absolute top-full left-1/2 min-w-max -translate-x-1/2 text-(--smoky-black-1) transition-all duration-250 group-hover:top-1/2 group-hover:-translate-y-1/2">
            Book A Table
          </span>
        </Link>
      </div>
    </header>
  );
}

export default Header;
