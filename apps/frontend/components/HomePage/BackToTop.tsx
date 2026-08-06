"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY >= 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed right-5 bottom-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-(--gold-crayola) text-xl text-(--smoky-black-1) shadow-(--shadow-1) transition-all duration-250 hover:bg-white hover:text-(--gold-crayola) ${
        isVisible ? "visible opacity-100" : "invisible opacity-0"
      }`}
      aria-label="back to top"
    >
      <ChevronUp />
    </button>
  );
};

export default BackToTop;
