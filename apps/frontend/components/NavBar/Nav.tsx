"use client";

import { smoothScrollTo } from "@/lib/utils";
import type { NavItem } from "@/types/home";
import { X } from "lucide-react";
import Image from "next/image";

export interface NavbarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navItems: NavItem[] = [
  { label: "Home", href: "#home", active: true },
  { label: "Menus", href: "#menu" },
  { label: "About Us", href: "#about" },
  { label: "Our Chefs", href: "#" },
  { label: "Contact", href: "#" },
];

export function Navbar({ isOpen, onToggle }: NavbarProps) {
  const handleNavClick = (href: string) => {
    if (href.startsWith("#") && href !== "#") {
      smoothScrollTo(href);
    }
    onToggle();
  };

  return (
    <nav
      className={`navbar bg-smoky-black-1 fixed top-0 bottom-0 -left-90 z-2 w-full max-w-90 overflow-y-auto px-7 pb-12 transition-all duration-500 ${
        isOpen ? "visible translate-x-90 transform" : "invisible"
      } md:visible md:static md:max-w-none md:translate-x-0 md:transform md:overflow-visible md:bg-transparent md:px-0 md:pb-0`}
    >
      <button
        className="close-btn hover:text-gold-crayola mt-7 mb-5 ml-auto rounded-full border border-current p-1 text-white md:hidden"
        onClick={onToggle}
        aria-label="close menu"
      >
        <X className="h-4 w-4" strokeWidth={2} />
      </button>

      <a href="#" className="logo mx-auto mb-15 block max-w-max md:hidden">
        <Image
          src="/assets/images/logo.svg"
          width={160}
          height={50}
          alt="Labanga - Home"
        />
      </a>

      <ul className="navbar-list border-white-alpha-20 mb-25 border-b md:mb-0 md:flex md:gap-7 md:border-none">
        {navItems.map((item) => (
          <li
            key={item.label}
            className="navbar-item border-white-alpha-20 border-t md:border-none"
          >
            <button
              onClick={() => handleNavClick(item.href)}
              className={`navbar-link text-label-2 hover-underline relative w-full max-w-none py-2 text-left uppercase md:font-bold md:tracking-wide ${
                item.active ? "active" : ""
              }`}
            >
              <div
                className={`separator absolute top-1/2 left-0 -translate-y-1/2 rotate-45 transform opacity-0 transition-opacity duration-250 ${
                  item.active ? "opacity-100" : ""
                } md:hidden`}
              ></div>

              <span
                className={`span transition-all duration-250 ${
                  item.active
                    ? "text-gold-crayola translate-x-5 transform md:transform-none"
                    : ""
                }`}
              >
                {item.label}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="text-center md:hidden">
        <p className="text-headline-1 font-forum mb-4">Visit Us</p>

        <address className="text-body-4 not-italic">
          BHATAR, PURBO BORDHAMAN, WEST BENGAL, IND, <br />
        </address>

        <p className="text-body-4 mt-2">Open: 8.00 am - 2.30pm</p>

        <a
          href="mailto:hello@anishroy.dev"
          className="text-body-4 hover-underline mt-2 inline-block"
        >
          hello@anishroy.dev
        </a>

        <div className="separator mx-auto my-7"></div>

        <p className="contact-label font-bold">Booking Request</p>

        <a
          href="tel:+919547061233"
          className="text-body-1 contact-number hover-underline text-gold-crayola mx-auto mt-2 block max-w-max"
        >
          +919547061233
        </a>
      </div>
    </nav>
  );
}
