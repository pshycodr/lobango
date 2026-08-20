import { AboutSection } from "@/components/HomePage/AboutSection";
import { BackToTop } from "@/components/HomePage/BackToTop";
import { FeaturesSection } from "@/components/HomePage/FeaturesSection";
import { FooterSection } from "@/components/HomePage/FooterSection";
import { Header } from "@/components/HomePage/Header";
import { HeroSection } from "@/components/HomePage/Hero";
import { HomeMenuSection } from "@/components/HomePage/HomeMenuSection";
import { Preloader } from "@/components/HomePage/PreLoader";
import { ReservationSection } from "@/components/HomePage/ReservationTable";
import { ServiceSection } from "@/components/HomePage/ServiceSection";
import { TestimonialSection } from "@/components/HomePage/TestimonialSection";
import { DM_Sans, Forum } from "next/font/google";
import React from "react";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-dm-sans",
});

const forum = Forum({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-forum",
});

export default function HomePage() {
  return (
    <div className={`${dmSans.variable} ${forum.variable}`}>
      <Preloader />
      <Header />

      <main className="bg-(--eerie-black-1)">
        <HeroSection />
        <ServiceSection />
        <HomeMenuSection />
        <TestimonialSection />
        <ReservationSection />
        <FeaturesSection />
        <AboutSection />
      </main>

      <FooterSection />
      <BackToTop />
    </div>
  );
}
