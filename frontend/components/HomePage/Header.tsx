'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Navbar from '../NavBar/Nav'
import { smoothScrollTo } from '@/lib/utils'

export default function Header() {
  const [isActive, setIsActive] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY >= 50) {
        setIsActive(true)
        // Hide header when scrolling down, show when scrolling up
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsHidden(true)
        } else {
          setIsHidden(false)
        }
      } else {
        setIsActive(false)
        setIsHidden(false)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen)
    document.body.classList.toggle('nav-active')
  }

  const handleReservationClick = () => {
    smoothScrollTo('reserv')
  }

  return (
    <header className={`header fixed top-0 md:top-13 left-0 w-full bg-transparent py-10 z-4 border-b border-transparent transition-all duration-250 ${
      isActive ? 'py-5 bg-eerie-black-4 border-black-alpha-15' : ''
    } ${isHidden ? 'transform -translate-y-full delay-250' : ''}`}>
      <div className="container mx-auto px-5 flex justify-between items-center gap-2">
        
        <a href="#" className="logo">
          <Image 
            src="/assets/images/logo.svg" 
            width={160} 
            height={50} 
            alt="Labanga - Home" 
            className="w-40 h-auto"
          />
        </a>

        <Navbar isOpen={isNavOpen} onToggle={toggleNav} />

        <button
          onClick={handleReservationClick}
          className="btn btn-secondary hidden md:block"
        >
          <span className="text text-1">Find A Table</span>
          <span className="text text-2" aria-hidden="true">Find A Table</span>
        </button>

        <button 
          className="nav-open-btn md:hidden p-3 pr-0"
          onClick={toggleNav}
          aria-label="open menu"
        >
          <span className="line w-7 h-0.5 bg-white my-1 transform-origin-left animate-menu-btn"></span>
          <span className="line w-7 h-0.5 bg-white my-1 transform-origin-left animate-menu-btn" style={{ animationDelay: '150ms' }}></span>
          <span className="line w-7 h-0.5 bg-white my-1 transform-origin-left animate-menu-btn" style={{ animationDelay: '300ms' }}></span>
        </button>

        <div 
          className={`overlay fixed inset-0 bg-black-alpha-80 z-1 transition-all duration-500 ${
            isNavOpen ? 'opacity-100 pointer-events-all' : 'opacity-0 pointer-events-none'
          }`}
          onClick={toggleNav}
        ></div>

      </div>
    </header>
  )
}