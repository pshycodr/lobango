"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Forum } from "next/font/google";

const forum = Forum({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-forum",
});

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoSlideInterval, setAutoSlideInterval] =
    useState<NodeJS.Timeout | null>(null);
  const [isOrderId, setIsOrderid] = useState<boolean>(false);

  const slides = [
    {
      image: "/assets/images/hero-slider-1.jpg",
      subtitle: "Tradational & Hygine",
      title: "For the love of delicious food",
      text: "Come with family & feel and enjoy of mouthwatering food",
    },
    {
      image: "/assets/images/hero-slider-2.jpg",
      subtitle: "delightful experience",
      title: "Flavors Inspired by the Seasons",
      text: "Come with family & feel the joy of mouthwatering food",
    },
    {
      image: "/assets/images/hero-slider-3.jpg",
      subtitle: "amazing & delicious",
      title: "Where every flavor tells a story",
      text: "Come with family & feel the joy of mouthwatering food",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev >= slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev <= 0 ? slides.length - 1 : prev - 1));
  };

  const startAutoSlide = () => {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    const interval = setInterval(nextSlide, 7000);
    setAutoSlideInterval(interval);
  };

  const stopAutoSlide = () => {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
      setAutoSlideInterval(null);
    }
  };

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  useEffect(() => {
    const orderId = localStorage.getItem("orderId");
    setIsOrderid(Boolean(orderId));
  }, []);

  return (
    <section
      className="relative pt-32 h-screen overflow-hidden z-10 text-center"
      id="home"
    >
      {/* Slider Items */}
      <ul className=" w-full h-full">
        {slides.map((slide, index) => (
          <li
            key={index}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full grid place-content-center pt-25 transition-all duration-1000 z-10 ${index === currentSlide ? "opacity-100 visible" : "opacity-0 invisible"}`}
          >
            {/* Background Image */}
            <div className="absolute inset-0 pointer-events-none select-none -z-10">
              <Image
                src={slide.image}
                fill
                alt=""
                className="object-cover"
                quality={100}
                style={{
                  animation:
                    index === currentSlide
                      ? "smoothScale 7s linear forwards"
                      : "none",
                }}
              />
            </div>

            {/* Content */}
            <div
              className={`space-y-4 ${index === currentSlide ? "animate-fade-in-up" : ""}`}
            >
              <p className="text-sm text-[var(--gold-crayola)]  uppercase tracking-wide relative after:content-[''] after:block after:w-25 after:mx-auto after:mt-1.5 after:bg-[url('/assets/images/separator.svg')] after:bg-no-repeat after:bg-center after:h-4">
                {slide.subtitle}
              </p>

              <h1
                className={`lg:text-8xl text-5xl text-white ${forum.className} leading-none`}
              >
                {slide.title.split(" ").map((word, i, arr) => (
                  <span key={i}>
                    {word}
                    {i === Math.floor(arr.length / 2) - 1 && <br />}
                    {i < arr.length - 1 &&
                      i !== Math.floor(arr.length / 2) - 1 &&
                      " "}
                  </span>
                ))}
              </h1>

              <p className="text-sm lg:text-lg text-amber-50 leading-[var(--lineHeight-4)] mb-10">
                {slide.text}
              </p>

              <div className="flex gap-5  justify-center items-center flex-wrap ">
                <Link
                  href="/menu"
                  className="inline-block text-[var(--smoky-black-1)] bg-[var(--gold-crayola)] font-bold uppercase tracking-[3px] border-2 border-[var(--gold-crayola)] px-11 py-3 rounded-lg mt-5"
                >
                  Order Now
                </Link>
                {isOrderId ? (
                  <Link
                    href="/order-tracking"
                    className="inline-block text-[var(--gold-crayola)] bg-[var(--smoky-black-1)]  font-bold uppercase tracking-[3px] border-2 border-[var(--gold-crayola)] px-11 py-3 rounded-lg mt-5"
                  >
                    View Order
                  </Link>
                ) : (
                  ""
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Navigation Buttons */}
      <button
        className="hidden md:grid absolute z-10 text-[var(--gold-crayola)] text-2xl border border-[var(--gold-crayola)] w-11 h-11 place-items-center top-1/2 left-8 -translate-y-1/2 rotate-45 transition-all duration-250 hover:bg-[var(--gold-crayola)] hover:text-black"
        onClick={prevSlide}
        onMouseEnter={stopAutoSlide}
        onMouseLeave={startAutoSlide}
        aria-label="slide to previous"
      >
        <ChevronLeft className="-rotate-45" />
      </button>

      <button
        className="hidden md:grid absolute z-10 text-[var(--gold-crayola)] text-2xl border border-[var(--gold-crayola)] w-11 h-11 place-items-center top-1/2 right-8 -translate-y-1/2 rotate-45 transition-all duration-250 hover:bg-[var(--gold-crayola)] hover:text-black"
        onClick={nextSlide}
        onMouseEnter={stopAutoSlide}
        onMouseLeave={startAutoSlide}
        aria-label="slide to next"
      >
        <ChevronRight className="-rotate-45" />
      </button>

      {/* Book A Table Button */}
      {/* <Link href="#reserv" className="absolute bottom-4 right-4 z-20 bg-[var(--gold-crayola)] w-28 h-28 p-3 scale-60 sm:scale-75 lg:bottom-12 lg:right-12 lg:scale-100 flex flex-col items-center justify-center text-center rounded-full  after:absolute after:inset-0 after:border after:border-[var(--gold-crayola)] after:rounded-full after:animate-spin" style={{ animationDuration: '15s' }}>
        <Image src="/assets/images/hero-icon.png" width={48} height={48} alt="booking icon" className="mb-1.5" />
        <span className="text-black font-bold uppercase tracking-[var(--letterSpacing-1)] leading-[var(--lineHeight-3)] text-xs">
          Book A Table
        </span>
      </Link> */}

      <style jsx>{`
        @keyframes smoothScale {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.15);
          }
        }

        @keyframes fade-in-up {
          0% {
            transform: translateY(30px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fade-in-up > * {
          animation: fade-in-up 1s ease forwards;
        }

        .animate-fade-in-up > *:nth-child(1) {
          animation-delay: 500ms;
        }
        .animate-fade-in-up > *:nth-child(2) {
          animation-delay: 1000ms;
        }
        .animate-fade-in-up > *:nth-child(3) {
          animation-delay: 1500ms;
        }
        .animate-fade-in-up > *:nth-child(4) {
          animation-delay: 2000ms;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
