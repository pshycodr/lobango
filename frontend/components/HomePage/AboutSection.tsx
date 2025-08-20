"use client"

import { Forum } from 'next/font/google';
import Image from 'next/image';

const forum = Forum({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-forum',
});

const AboutSection = () => {
  return (
    <section className="relative py-[var(--section-space)] text-center lg:py-[170px_100px] overflow-hidden" aria-labelledby="about-label" id="about">
      <div className="container mx-auto px-4">
        <div className="grid gap-30 lg:grid-cols-[0.7fr_1fr]  lg:gap-8 lg:items-center">
          {/* Content */}
          <div className="lg:pr-24 xl:pr-0 ">
            <p className="text-center text-lg text-[var(--gold-crayola)] font-bold uppercase tracking-normal mb-3 relative after:content-[''] after:block after:w-25 after:mx-auto after:mt-1.5 after:bg-[url('/assets/images/separator.svg')] after:bg-no-repeat after:bg-center after:h-4" id="about-label">
              Our Story
            </p>

            <h2 className={`text-white ${forum.className} mb-4 text-4xl lg:text-5xl`}>
              Every Flavour Tells a Story
            </h2>

            <p className="text-white leading-[var(--lineHeight-5)] mb-8">
            At Lobango, every meal is a celebration of flavor and tradition. Born from a love of authentic ingredients and heartfelt cooking, Lobango brings people together to share unforgettable moments. Step inside, and you’re not just a guest—you’re part of our family. Welcome to Lobango, where great food and warm memories are made.
            </p>

            <div className="font-bold mb-2 text-amber-50 items-center mx-auto">Book Through Call</div>

            <a
              href="tel:+916296832453"
              className="text-[var(--gold-crayola)]  mx-auto block mb-7 transition-colors hover:underline lg:mx-0 items-center"
            >
            +91 6296832453
            </a>
          </div>

          {/* Banner */}
          <figure className="relative mb-30 lg:mb-0  lg:scale-75 bottom-10 lg:bottom-0">
            <div className="w-full pl-12 sm:pl-20 lg:pl-0">
              <Image
                src="/assets/images/about-banner.jpg"
                width={570}
                height={570}
                loading="lazy"
                alt="about banner"
                className="w-full parallax-item"
                data-parallax-speed="1"
              />
            </div>

            {/* Absolute Images */}
            <div className="absolute -bottom-20 left-0 lg:-left-15 w-38 py-12 parallax-item" data-parallax-speed="1.75">
              <div className="relative before:absolute before:top-0 before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-35 before:bg-[url('/assets/images/img-pattern.svg')] before:bg-repeat before:-z-10">
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

            <div className="absolute -top-16 right-0 overflow-hidden w-[134px] h-[134px]">
              <div className="relative w-full h-full">
                {/* Spinning background */}
                <div className="absolute inset-0 bg-[url('/assets/images/badge-2-bg.png')] bg-no-repeat bg-contain spin-slow" />

                {/* Static foreground image */}
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

        {/* Shape */}

        <Image
          src="/assets/images/shape-1.png"
          width={120}
          height={115}
          loading="lazy"
          alt="shape"
          className="hidden xl:block absolute scale-160  opacity-60 bottom-10 left-14  animate-float"
        />
      </div>
    </section>
  );
};

export default AboutSection;