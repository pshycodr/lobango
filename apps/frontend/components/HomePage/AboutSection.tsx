"use client";

import { Forum } from "next/font/google";
import Image from "next/image";
import React from "react";

const forum = Forum({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-forum",
});

export function AboutSection() {
  return (
    <section
      className="relative overflow-hidden py-(--section-space) text-center lg:py-[170px_100px]"
      aria-labelledby="about-label"
      id="about"
    >
      <div className="container mx-auto px-4">
        <div className="grid gap-30 lg:grid-cols-[0.7fr_1fr] lg:items-center lg:gap-8">
          {/* Content */}
          <div className="lg:pr-24 xl:pr-0">
            <p
              className="relative mb-3 text-center text-lg font-bold tracking-normal text-(--gold-crayola) uppercase after:mx-auto after:mt-1.5 after:block after:h-4 after:w-25 after:bg-[url('/assets/images/separator.svg')] after:bg-center after:bg-no-repeat after:content-['']"
              id="about-label"
            >
              Our Story
            </p>

            <h2
              className={`text-white ${forum.className} mb-4 text-4xl lg:text-5xl`}
            >
              Every Flavour Tells a Story
            </h2>

            <p className="mb-8 leading-(--lineHeight-5) text-white">
              At Lobango, every meal is a celebration of flavor and tradition.
              Born from a love of authentic ingredients and heartfelt cooking,
              Lobango brings people together to share unforgettable moments.
              Step inside, and you’re not just a guest—you’re part of our
              family. Welcome to Lobango, where great food and warm memories are
              made.
            </p>

            <div className="mx-auto mb-2 items-center font-bold text-amber-50">
              Book Through Call
            </div>

            <a
              href="tel:+911234567890"
              className="mx-auto mb-7 block items-center text-(--gold-crayola) transition-colors hover:underline lg:mx-0"
            >
              +91 1234567890
            </a>
          </div>

          {/* Banner */}
          <figure className="relative bottom-10 mb-30 lg:bottom-0 lg:mb-0 lg:scale-75">
            <div className="w-full pl-12 sm:pl-20 lg:pl-0">
              <Image
                src="/assets/images/about-banner.jpg"
                width={570}
                height={570}
                loading="lazy"
                alt="about banner"
                className="parallax-item w-full"
                data-parallax-speed="1"
              />
            </div>

            {/* Absolute Images */}
            <div
              className="parallax-item absolute -bottom-20 left-0 w-38 py-12 lg:-left-15"
              data-parallax-speed="1.75"
            >
              <div className="relative before:absolute before:top-0 before:bottom-0 before:left-1/2 before:-z-10 before:w-35 before:-translate-x-1/2 before:bg-[url('/assets/images/img-pattern.svg')] before:bg-repeat">
                <Image
                  src="/assets/images/about-abs-image.jpg"
                  width={285}
                  height={285}
                  loading="lazy"
                  alt=""
                  className="w-full"
                />
              </div>
            </div>

            <div className="absolute -top-16 right-0 h-[134px] w-[134px] overflow-hidden">
              <div className="relative h-full w-full">
                <div className="spin-slow absolute inset-0 bg-[url('/assets/images/badge-2-bg.png')] bg-contain bg-no-repeat" />
                <Image
                  src="/assets/images/badge-2.png"
                  width={133}
                  height={134}
                  loading="lazy"
                  alt=""
                />
              </div>
            </div>
          </figure>
        </div>

        <Image
          src="/assets/images/shape-1.png"
          width={120}
          height={115}
          loading="lazy"
          alt="shape"
          className="animate-float absolute bottom-10 left-14 hidden scale-160 opacity-60 xl:block"
        />
      </div>
    </section>
  );
}

export default AboutSection;
