"use client";

import { Forum } from "next/font/google";
import Image from "next/image";
import React from "react";

const forum = Forum({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-forum",
});

export function TestimonialSection() {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat py-(--section-space) pb-[340px] text-center"
      style={{ backgroundImage: "url('/assets/images/testimonial-bg.jpg')" }}
      aria-label="testimonials"
    >
      <div className="container mx-auto px-4">
        <div className={`text-8xl text-white ${forum.className} mb-5`}>”</div>

        <p
          className={`text-2xl text-white lg:text-4xl ${forum.className} mx-auto mb-10 max-w-[700px] tracking-tight`}
        >
          I wanted to thank you for inviting me down for that amazing dinner the
          other night. The food was extraordinary.
        </p>

        <div className="mb-12 flex justify-center gap-0.5">
          <div className="spin-slow h-2 w-2 rotate-45 border border-(--gold-crayola)"></div>
          <div className="spin-slow h-2 w-2 rotate-45 border border-(--gold-crayola)"></div>
          <div className="spin-slow h-2 w-2 rotate-45 border border-(--gold-crayola)"></div>
        </div>

        <div className="text-center">
          <Image
            src="/assets/images/testi-avatar.jpg"
            width={100}
            height={100}
            loading="lazy"
            alt="kunal chaterjee"
            className="mx-auto mb-4 rounded-full"
          />

          <p className="font-bold tracking-(--letterSpacing-3) text-(--gold-crayola) uppercase">
            kunal chaterjee
          </p>
        </div>
      </div>
    </section>
  );
}

export default TestimonialSection;
