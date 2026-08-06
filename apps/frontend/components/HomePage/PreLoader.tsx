"use client";

import { useEffect, useState } from "react";
import { Forum } from "next/font/google";

const forum = Forum({
  subsets: ["latin"],
  weight: ["400"],
});

const Preloader = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
      document.body.classList.add("loaded");
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-(--smoky-black-1) transition-all duration-1000 ease-in-out ${isLoaded ? "pointer-events-none opacity-0" : "opacity-100"} ${forum.className}`}
    >
      <div className="text-center">
        {/* Main Logo Circle */}
        <div className="relative mx-auto mb-8 h-20 w-20">
          <div className="absolute inset-0 rounded-full border-2 border-(--white-alpha-10)"></div>
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-(--gold-crayola)"></div>
          <div
            className="absolute inset-3 animate-spin rounded-full border border-transparent border-t-(--gold-crayola)"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>
        </div>

        {/* Restaurant Name */}
        <div className="mb-6">
          <h1 className="font-forum mb-3 text-4xl font-light tracking-[0.25em] text-(--gold-crayola)">
            LOBANGO
          </h1>
          <div className="mx-auto mb-2 h-px w-24 bg-(--gold-crayola)"></div>
          <p className="text-xs tracking-[0.2em] text-(--white-alpha-20) uppercase">
            Multi Cuisine Restaurant
          </p>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2">
          <div className="h-2 w-2 animate-bounce rounded-full bg-(--gold-crayola)"></div>
          <div
            className="h-2 w-2 animate-bounce rounded-full bg-(--gold-crayola)"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="h-2 w-2 animate-bounce rounded-full bg-(--gold-crayola)"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
