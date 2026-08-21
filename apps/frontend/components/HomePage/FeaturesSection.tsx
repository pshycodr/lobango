import Image from "next/image";
import React from "react";

export function FeaturesSection() {
  const features = [
    {
      icon: "/assets/images/features-icon-1.png",
      title: "Hygienic Food",
    },
    {
      icon: "/assets/images/features-icon-2.png",
      title: "Fresh Environment",
    },
    {
      icon: "/assets/images/features-icon-3.png",
      title: "Skilled Chefs",
    },
    {
      icon: "/assets/images/features-icon-4.png",
      title: "Event & Party",
    },
  ];

  return (
    <section
      className="relative overflow-visible py-(--section-space) text-center"
      aria-label="features"
    >
      <div className="container mx-auto px-4">
        <p className="relative mb-3 font-bold tracking-(--letterSpacing-2) text-(--gold-crayola) uppercase after:mx-auto after:mt-1.5 after:block after:h-4 after:w-25 after:bg-[url('/assets/images/separator.svg')] after:bg-center after:bg-no-repeat after:content-['']">
          Why Choose Us
        </p>

        <h2 className="mb-10 font-(--fontFamily-forum) text-white">
          Our Strength
        </h2>

        <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <li key={index}>
              <div
                className={`p-8 pb-10 ${index % 2 === 0 ? "bg-(--eerie-black-3)" : "bg-(--smoky-black-3)"}`}
              >
                <div className="mx-auto max-w-max transition-transform duration-500 hover:scale-x-[-1] hover:rotate-180">
                  <Image
                    src={feature.icon}
                    width={100}
                    height={80}
                    loading="lazy"
                    alt="icon"
                  />
                </div>

                <h3 className="my-5 font-(--fontFamily-forum) text-white">
                  {feature.title}
                </h3>

                <p className="leading-(--lineHeight-6) text-(--quick-silver)">
                  {/* Empty as per original design */}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* Decorative Shapes */}
        <Image
          src="/assets/images/shape-3.png"
          width={120}
          height={115}
          loading="lazy"
          alt="shape"
          className="animate-float absolute -bottom-50 left-10 hidden scale-100 opacity-80 xl:block"
        />
      </div>
    </section>
  );
}

export default FeaturesSection;
