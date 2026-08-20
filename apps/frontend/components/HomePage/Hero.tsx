"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Forum } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const forum = Forum({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-forum",
});

export function HeroSection() {
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
      className="relative z-10 h-screen overflow-hidden pt-32 text-center"
      id="home"
    >
      {/* Slider Items */}
      <ul className="h-full w-full">
        {slides.map((slide, index) => (
          <li
            key={index}
            className={`absolute top-1/2 left-1/2 z-10 grid h-full w-full -translate-x-1/2 -translate-y-1/2 place-content-center pt-25 transition-all duration-1000 ${
              index === currentSlide
                ? "visible opacity-100"
                : "invisible opacity-0"
            }`}
          >
            {/* Background Image */}
            <div className="pointer-events-none absolute inset-0 -z-10 select-none">
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
              <p className="relative text-sm tracking-wide text-(--gold-crayola) uppercase after:mx-auto after:mt-1.5 after:block after:h-4 after:w-25 after:bg-[url('/assets/images/separator.svg')] after:bg-center after:bg-no-repeat after:content-['']">
                {slide.subtitle}
              </p>

              <h1
                className={`text-5xl text-white lg:text-8xl ${forum.className} leading-none`}
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

              <p className="mb-10 text-sm leading-(--lineHeight-4) text-amber-50 lg:text-lg">
                {slide.text}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-5">
                <Link
                  href="/menu"
                  className="mt-5 inline-block rounded-lg border-2 border-(--gold-crayola) bg-(--gold-crayola) px-11 py-3 font-bold tracking-[3px] text-(--smoky-black-1) uppercase"
                >
                  Order Now
                </Link>
                {isOrderId && (
                  <Link
                    href="/order-tracking"
                    className="mt-5 inline-block rounded-lg border-2 border-(--gold-crayola) bg-(--smoky-black-1) px-11 py-3 font-bold tracking-[3px] text-(--gold-crayola) uppercase"
                  >
                    View Order
                  </Link>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Navigation Buttons */}
      <button
        className="absolute top-1/2 left-8 z-10 hidden h-11 w-11 -translate-y-1/2 rotate-45 place-items-center border border-(--gold-crayola) text-2xl text-(--gold-crayola) transition-all duration-250 hover:bg-(--gold-crayola) hover:text-black md:grid"
        onClick={prevSlide}
        onMouseEnter={stopAutoSlide}
        onMouseLeave={startAutoSlide}
        aria-label="slide to previous"
      >
        <ChevronLeft className="-rotate-45" />
      </button>

      <button
        className="absolute top-1/2 right-8 z-10 hidden h-11 w-11 -translate-y-1/2 rotate-45 place-items-center border border-(--gold-crayola) text-2xl text-(--gold-crayola) transition-all duration-250 hover:bg-(--gold-crayola) hover:text-black md:grid"
        onClick={nextSlide}
        onMouseEnter={stopAutoSlide}
        onMouseLeave={startAutoSlide}
        aria-label="slide to next"
      >
        <ChevronRight className="-rotate-45" />
      </button>

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
}

export const Hero = HeroSection;
export default HeroSection;
