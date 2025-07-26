'use client';

import Image from 'next/image';
import { IonIcon } from '@ionic/react';
import { chevronForward } from 'ionicons/icons';
import Button from '../common/Button';
import { Rubik, Shadows_Into_Light } from "next/font/google"

const rubikFont = Rubik({
  subsets: ['latin'],
})
const shadows_Into_Light = Shadows_Into_Light({
  subsets: ['latin'],
  weight: '400'
})

export default function Hero() {
  return (
    <section
      id="home"
      className="relative  bg-[url('/assets/images/hero-bg.jpg')] bg-cover bg-center bg-no-repeat px-20 pt-[145px] pb-[200px] text-center md:text-left overflow-hidden z-10"
    >
      <div className="container mx-auto px-4">
        <div className="relative z-20">
          <p className={`text-[var(--dark-orange)] font-shadows-into-light ${shadows_Into_Light.className} text-xl md:text-2xl mb-6`}>
            Eat Sleep And
          </p>

          <h1 className={`text-[var(--champagne-pink)] ${rubikFont.className} text-4xl md:text-7xl font-bold leading-tight tracking-tighter max-w-[12ch] mx-auto md:mx-0`}>
            Supper delicious Burger in town!
          </h1>

          <p className="text-[var(--desert-sand)] my-4 max-w-[44ch] mx-auto md:mx-0">
            Food is any substance consumed to provide nutritional support for an organism.
          </p>

          <Button children={"Book a Table"} />
        </div>

        {/* Hero Banner - Hidden on mobile, visible on desktop */}
        <div className="w-2xl hidden md:block absolute top-[20%] right-[50px] max-w-[45%] aspect-[1/0.9] z-10">
          <Image
            src="/assets/images/hero-banner-bg.png"
            width={820}
            height={716}
            alt=""
            aria-hidden="true"
            className="w-full hero-img-bg scale-[1.4] translate-x-5 -translate-y-5 absolute "
          />
          <Image
            src="/assets/images/hero-banner.png"
            width={700}
            height={637}
            alt="Burger"
            className="w-full hero-img "
            priority
          />
        </div>

        {/* Hero background shape - Desktop only */}
        <div className="hidden md:block absolute right-0 bottom-[-2px] w-full h-full bg-[url('/assets/images/hero-bg-shape.png')] bg-no-repeat bg-[right_bottom] bg-contain pointer-events-none z-0" />
      </div>
    </section>
  );
}