"use client";
import Image from "next/image";
import { Forum } from "next/font/google";

const forum = Forum({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-forum",
});

const TestimonialSection = () => {
  return (
    <section
      className="relative py-[var(--section-space)] pb-[340px] text-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/assets/images/testimonial-bg.jpg')" }}
      aria-label="testimonials"
    >
      <div className="container mx-auto px-4">
        <div className={`text-8xl text-white ${forum.className} mb-5`}>”</div>

        <p
          className={`text-2xl lg:text-4xl text-white ${forum.className} tracking-tight max-w-[700px]  mx-auto mb-10`}
        >
          I wanted to thank you for inviting me down for that amazing dinner the
          other night. The food was extraordinary.
        </p>

        <div className="flex justify-center gap-0.5 mb-12">
          <div className="w-2 h-2 border border-[var(--gold-crayola)] rotate-45 spin-slow"></div>
          <div className="w-2 h-2 border border-[var(--gold-crayola)] rotate-45 spin-slow"></div>
          <div className="w-2 h-2 border border-[var(--gold-crayola)] rotate-45 spin-slow"></div>
        </div>

        <div className="text-center">
          <Image
            src="/assets/images/testi-avatar.jpg"
            width={100}
            height={100}
            loading="lazy"
            alt="kunal chaterjee"
            className="mx-auto rounded-full mb-4"
          />

          <p className=" text-[var(--gold-crayola)] font-bold uppercase tracking-[var(--letterSpacing-3)]">
            kunal chaterjee
          </p>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
