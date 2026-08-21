"use client";

import { Forum } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const forum = Forum({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-forum",
});

export function ServiceSection() {
  const services = [
    {
      image: "/assets/images/service-1.jpg",
      title: "Snacks",
      width: 285,
      height: 336,
    },
    {
      image: "/assets/images/service-2.jpg",
      title: "Main course",
      width: 285,
      height: 336,
    },
    {
      image: "/assets/images/service-3.jpg",
      title: "Drinks",
      width: 285,
      height: 336,
    },
  ];

  return (
    <section
      className="relative z-10 overflow-hidden bg-(--smoky-black-2) p-5 pt-10 text-center sm:p-17.5"
      aria-label="service"
    >
      <div className="container mx-auto px-4">
        <p className="relative mb-3 text-xs font-bold tracking-tighter text-(--gold-crayola) uppercase after:mx-auto after:mt-1.5 after:block after:h-4 after:w-25 after:bg-[url('/assets/images/separator.svg')] after:bg-center after:bg-no-repeat after:content-['']">
          Flavors For Royalty
        </p>

        <h2
          className={`${forum.className} mb-4 text-4xl text-white sm:text-5xl`}
        >
          We Offer Top Notch
        </h2>

        <p className="mb-10 text-xs leading-10 text-white sm:text-sm">
          Lobanga Provide Best Quality and Hygienic Food
        </p>

        <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-40">
          {services.map((service, index) => (
            <li
              key={index}
              className={`transition-transform duration-500 ${
                index === 0 || index === 2 ? "lg:-translate-y-30" : ""
              }`}
            >
              <div className="">
                <Link href="#" className="group relative z-10 mb-7 block pb-8">
                  <div
                    className="relative scale-95 overflow-hidden bg-(--eerie-black-4) transition-transform duration-500 group-hover:scale-100"
                    style={{
                      aspectRatio: `${service.width} / ${service.height}`,
                    }}
                  >
                    <Image
                      src={service.image}
                      width={service.width}
                      height={service.height}
                      loading="lazy"
                      alt={service.title}
                      className="h-full w-full object-cover"
                    />

                    {/* Shine Effect */}
                    <div className="absolute inset-0 -left-15 h-full w-1/2 -translate-x-full -skew-x-12 bg-linear-to-r from-transparent to-white/40 transition-transform duration-1000 group-hover:translate-x-[275%]"></div>
                  </div>

                  {/* Pattern Background */}
                  <div className="absolute -top-4 left-1/2 -z-10 h-full w-35 -translate-x-1/2 bg-[url('/assets/images/img-pattern.svg')] bg-cover bg-center bg-repeat transition-all duration-500 group-hover:scale-x-[-1] group-hover:delay-300"></div>
                </Link>

                <div className="relative -top-5">
                  <h3 className={`text-3xl text-white ${forum.className}`}>
                    <Link
                      href="#"
                      className="transition-colors hover:text-(--gold-crayola)"
                    >
                      {service.title}
                    </Link>
                  </h3>

                  <Link
                    href="/menu"
                    className="relative mx-auto pb-1 text-sm font-bold tracking-tighter text-(--gold-crayola) uppercase transition-colors after:absolute after:-bottom-2 after:left-0 after:h-1.5 after:w-full after:scale-x-20 after:border-t after:border-b after:border-(--gold-crayola) after:opacity-0 after:transition-all after:duration-500 hover:text-white hover:after:scale-x-100 hover:after:opacity-100"
                  >
                    View Menu
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Decorative Shapes */}
        <Image
          src="/assets/images/shape-1.png"
          width={246}
          height={412}
          loading="lazy"
          alt="shape"
          className="move-anim absolute bottom-0 left-0 -z-10 hidden max-w-max lg:block"
        />
        <Image
          src="/assets/images/shape-2.png"
          width={343}
          height={345}
          loading="lazy"
          alt="shape"
          className="move-anim absolute top-15 right-5 -z-10 hidden max-w-max scale-160 lg:block"
        />
      </div>
    </section>
  );
}

export default ServiceSection;
