'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { smoothScrollTo } from '@/lib/utils'
import type { HeroSlide } from '@/types/home'

const heroSlides: HeroSlide[] = [
  {
    id: '1',
    image: '/assets/images/hero-slider-1.jpg',
    subtitle: 'Tradational & Hygine',
    title: 'For the love of delicious food',
    description: 'Come with family & feel and enjoy of mouthwatering food',
    buttonText: 'View Our Menu',
    buttonLink: '#menu'
  },
  {
    id: '2',
    image: '/assets/images/hero-slider-2.jpg',
    subtitle: 'delightful experience',
    title: 'Flavors Inspired by the Seasons',
    description: 'Come with family & feel the joy of mouthwatering food',
    buttonText: 'View Our Menu',
    buttonLink: '#menu'
  },
  {
    id: '3',
    image: '/assets/images/hero-slider-3.jpg',
    subtitle: 'amazing & delicious',
    title: 'Where every flavor tells a story',
    description: 'Come with family & feel the joy of mouthwatering food',
    buttonText: 'View Our Menu',
    buttonLink: '#menu'
  }
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoSliding, setIsAutoSliding] = useState(true)

  useEffect(() => {
    if (!isAutoSliding) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 7000)

    return () => clearInterval(interval)
  }, [isAutoSliding])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const handleMenuClick = () => {
    smoothScrollTo('menu')
  }

  const handleBookTableClick = () => {
    smoothScrollTo('reserv')
  }

  return (
    <section className="hero text-center relative py-30 min-h-screen overflow-hidden z-1" id="home">
      <ul className="hero-slider">
        {heroSlides.map((slide, index) => (
          <li 
            key={slide.id}
            className={`slider-item absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full grid place-content-center pt-25 transition-all duration-1000 z-1 ${
              index === currentSlide ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
          >
            <div className="slider-bg absolute inset-0 transform scale-100 pointer-events-none select-none -z-1">
              <Image
                src={slide.image}
                width={1880}
                height={950}
                alt=""
                className="img-cover animate-smooth-scale"
                priority={index === 0}
              />
            </div>

            <p className={`section-subtitle text-label-2 text-gold-crayola font-bold uppercase tracking-widest mb-3 transform translate-y-7 opacity-0 ${
              index === currentSlide ? 'animate-slider-reveal' : ''
            }`} style={{ animationDelay: '500ms' }}>
              {slide.subtitle}
            </p>

            <h1 className={`hero-title text-display-1 font-forum mb-4 transform translate-y-7 opacity-0 ${
              index === currentSlide ? 'animate-slider-reveal' : ''
            }`} style={{ animationDelay: '1000ms' }}>
              {slide.title.split(' ').reduce((acc, word, i, arr) => {
                if (i === Math.ceil(arr.length / 2)) {
                  return acc + '<br>' + word
                }
                return acc + (i === 0 ? '' : ' ') + word
              }, '')}
            </h1>

            <p className={`hero-text text-body-2 my-10 transform translate-y-7 opacity-0 ${
              index === currentSlide ? 'animate-slider-reveal' : ''
            }`} style={{ animationDelay: '1500ms' }}>
              {slide.description}
            </p>

            <button
              onClick={handleMenuClick}
              className={`btn btn-primary mx-auto transform translate-y-7 opacity-0 ${
                index === currentSlide ? 'animate-slider-reveal' : ''
              }`}
              style={{ animationDelay: '2000ms' }}
            >
              <span className="text text-1">{slide.buttonText}</span>
              <span className="text text-2" aria-hidden="true">{slide.buttonText}</span>
            </button>
          </li>
        ))}
      </ul>

      <button 
        className="slider-btn prev hidden md:grid absolute z-1 text-gold-crayola text-2xl border border-gold-crayola w-11 h-11 place-items-center top-1/2 left-7 transform -translate-y-1/2 rotate-45 transition-all duration-250 hover:bg-gold-crayola hover:text-black"
        onClick={prevSlide}
        onMouseEnter={() => setIsAutoSliding(false)}
        onMouseLeave={() => setIsAutoSliding(true)}
        aria-label="slide to previous"
      >
        <ChevronLeft className="transform -rotate-45" />
      </button>

      <button 
        className="slider-btn next hidden md:grid absolute z-1 text-gold-crayola text-2xl border border-gold-crayola w-11 h-11 place-items-center top-1/2 right-7 transform -translate-y-1/2 rotate-45 transition-all duration-250 hover:bg-gold-crayola hover:text-black"
        onClick={nextSlide}
        onMouseEnter={() => setIsAutoSliding(false)}
        onMouseLeave={() => setIsAutoSliding(true)}
        aria-label="slide to next"
      >
        <ChevronRight className="transform -rotate-45" />
      </button>

      <button
        onClick={handleBookTableClick}
        className="hero-btn absolute bottom-4 right-4 z-2 bg-gold-crayola w-28 h-28 p-3 transform scale-60 md:scale-100 rounded-full"
      >
        <Image
          src="/assets/images/hero-icon.png"
          width={48}
          height={48}
          alt="booking icon"
          className="mx-auto mb-1"
        />
        
        <span className="text-center text-black font-bold uppercase tracking-wide leading-tight text-xs block">
          Book A Table
        </span>
        
        <div className="absolute inset-0 border border-gold-crayola rounded-full animate-rotate360"></div>
      </button>
    </section>
  )
}