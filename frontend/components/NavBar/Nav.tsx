'use client'

import { X } from 'lucide-react'
import Image from 'next/image'
import { smoothScrollTo } from '@/lib/utils'
import type { NavItem } from '@/types/home'

interface NavbarProps {
  isOpen: boolean
  onToggle: () => void
}

const navItems: NavItem[] = [
  { label: 'Home', href: '#home', active: true },
  { label: 'Menus', href: '#menu' },
  { label: 'About Us', href: '#about' },
  { label: 'Our Chefs', href: '#' },
  { label: 'Contact', href: '#' },
]

export default function Navbar({ isOpen, onToggle }: NavbarProps) {
  const handleNavClick = (href: string) => {
    if (href.startsWith('#') && href !== '#') {
      smoothScrollTo(href)
    }
    onToggle()
  }

  return (
    <nav className={`navbar fixed bg-smoky-black-1 top-0 -left-90 bottom-0 max-w-90 w-full px-7 pb-12 overflow-y-auto z-2 transition-all duration-500 ${
      isOpen ? 'visible transform translate-x-90' : 'invisible'
    } md:static md:bg-transparent md:max-w-none md:px-0 md:pb-0 md:overflow-visible md:transform-none md:translate-x-0 md:visible`}>
      
      <button 
        className="close-btn text-white border border-current p-1 rounded-full ml-auto mt-7 mb-5 hover:text-gold-crayola md:hidden"
        onClick={onToggle}
        aria-label="close menu"
      >
        <X className="w-4 h-4" strokeWidth={2} />
      </button>

      <a href="#" className="logo max-w-max mx-auto mb-15 md:hidden">
        <Image 
          src="/assets/images/logo.svg" 
          width={160} 
          height={50} 
          alt="Labanga - Home"
        />
      </a>

      <ul className="navbar-list border-b border-white-alpha-20 mb-25 md:flex md:gap-7 md:border-none md:mb-0">
        {navItems.map((item) => (
          <li key={item.label} className="navbar-item border-t border-white-alpha-20 md:border-none">
            <button
              onClick={() => handleNavClick(item.href)}
              className={`navbar-link relative text-label-2 uppercase py-2 max-w-none w-full text-left hover-underline md:font-bold md:tracking-wide ${
                item.active ? 'active' : ''
              }`}
            >
              <div className={`separator absolute top-1/2 left-0 transform -translate-y-1/2 rotate-45 opacity-0 transition-opacity duration-250 ${
                item.active ? 'opacity-100' : ''
              } md:hidden`}></div>
              
              <span className={`span transition-all duration-250 ${
                item.active ? 'text-gold-crayola transform translate-x-5 md:transform-none' : ''
              }`}>
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
          href="mailto:debabratadan6@gmail.com" 
          className="text-body-4 hover-underline inline-block mt-2"
        >
          debabratadan6@gmail.com
        </a>

        <div className="separator mx-auto my-7"></div>

        <p className="contact-label font-bold">Booking Request</p>

        <a 
          href="tel:+919547061233" 
          className="text-body-1 contact-number text-gold-crayola max-w-max mx-auto hover-underline block mt-2"
        >
          +919547061233
        </a>
      </div>
    </nav>
  )
}