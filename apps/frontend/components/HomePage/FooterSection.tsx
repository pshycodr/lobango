"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";

const FooterSection = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribed with email:", email);
    setEmail("");
  };

  const footerLinks1 = [
    { label: "Home", href: "/" },
    { label: "Menus", href: "/menu" },
    // { label: 'About Us', href: '/about' },
    // { label: 'Our Chefs', href: '/chefs' },
    // { label: 'Contact', href: '/contact' },
  ];

  const footerLinks2 = [
    { label: "Facebook", href: "https://www.facebook.com/share/1Bg5DX8X8R/" },
    // { label: 'Instagram', href: 'https://instagram.com' },
    // { label: 'Twitter', href: 'https://twitter.com' },
    // { label: 'Youtube', href: 'https://youtube.com' },
    { label: "Google Map", href: "https://maps.app.goo.gl/a5KSt8Dzzffy7Kd66" },
  ];

  return (
    <footer
      className="relative bg-cover bg-center bg-no-repeat py-(--section-space) text-center"
      style={{ backgroundImage: "url('/assets/images/footer-bg.jpg')" }}
    >
      <div className="container mx-auto px-4">
        <div className="mb-[70px] grid gap-10 lg:grid-cols-[0.45fr_1fr_0.45fr] lg:items-center">
          {/* Footer Brand */}
          <div className="relative bg-(--smoky-black-1) bg-[url('/assets/images/footer-form-bg.png')] bg-top bg-repeat px-10 py-12 lg:order-1 lg:px-15 lg:py-25">
            <div className="absolute top-0 left-0 h-full w-4 bg-[url('/assets/images/footer-form-pattern.svg')]"></div>
            <div className="absolute top-0 right-0 h-full w-4 bg-[url('/assets/images/footer-form-pattern.svg')]"></div>

            <Link href="/" className="mx-auto mb-10 block max-w-max">
              <Image
                src="/assets/images/logo.png"
                width={160}
                height={50}
                loading="lazy"
                alt="labanga home"
              />
            </Link>

            <address className="mb-2 leading-(--lineHeight-3) text-(--quick-silver) not-italic">
              BHATAR, PURBA BORDHAMAN, WEST BENGAL, IND
            </address>

            <a
              href="mailto: lobangorestaurant@gmail.com"
              className="my-1.5 block leading-(--lineHeight-3) text-(--quick-silver) transition-colors hover:text-(--gold-crayola)"
            >
              lobangorestaurant@gmail.com
            </a>

            <a
              href="tel:+916296832453"
              className="my-1.5 block leading-(--lineHeight-3) text-(--quick-silver) transition-colors hover:text-(--gold-crayola)"
            >
              Booking Request : +91 6296832453
            </a>

            <p className="mb-10 leading-(--lineHeight-3) text-(--quick-silver)">
              Open : 11:00 am - 10:00 pm
            </p>

            <div className="mb-6 flex justify-center gap-0.5">
              <div className="spin-slow h-2 w-2 rotate-45 border border-(--gold-crayola)"></div>
              <div className="spin-slow h-2 w-2 rotate-45 border border-(--gold-crayola)"></div>
              <div className="spin-slow h-2 w-2 rotate-45 border border-(--gold-crayola)"></div>
            </div>

            <p className="mb-8 font-(--fontFamily-forum) text-white">
              Like our <span className="text-(--gold-crayola)">Service!</span>{" "}
              Drop a <span className="text-(--gold-crayola)">Review</span>
            </p>

            <textarea
              name="message"
              placeholder="Message"
              className="mb-5 h-35 w-full resize-none border border-(--white-alpha-10) bg-(--eerie-black-2) p-5 leading-none text-white transition-colors outline-none placeholder:text-white focus:border-(--gold-crayola)"
            ></textarea>

            <form
              onSubmit={handleSubscribe}
              className="relative flex flex-col gap-4 sm:block sm:gap-0"
            >
              <div className="relative w-full">
                <Mail className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-white" />
                <input
                  type="email"
                  name="email_address"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 w-full border border-(--white-alpha-10) bg-(--eerie-black-2) pr-5 pl-10 text-white transition-colors outline-none placeholder:text-white focus:border-(--gold-crayola) lg:pr-52"
                  required
                />
              </div>

              <button
                type="submit"
                className="group relative z-10 h-14 w-full min-w-max overflow-hidden bg-(--gold-crayola) px-11 font-bold tracking-[3px] text-black uppercase transition-all duration-500 hover:text-white sm:absolute sm:top-0 sm:right-0 sm:bottom-0 sm:w-auto"
              >
                <div className="absolute bottom-full left-1/2 -z-10 h-[200%] w-[200%] -translate-x-1/2 rounded-full bg-(--smoky-black-1) transition-all duration-500 group-hover:bottom-[-50%]" />
                <span className="block transition-transform duration-250 group-hover:-translate-y-10">
                  Send
                </span>
                <span className="absolute top-full left-1/2 min-w-max -translate-x-1/2 text-white transition-all duration-250 group-hover:top-1/2 group-hover:-translate-y-1/2">
                  Subscribe
                </span>
              </button>
            </form>
          </div>

          {/* Footer Links 1 */}
          <ul className="grid gap-5">
            {footerLinks1.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className="mx-auto block max-w-max font-bold tracking-(--letterSpacing-4) text-(--quick-silver) uppercase transition-colors hover:text-(--gold-crayola)"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Footer Links 2 */}
          <ul className="grid gap-5 lg:order-2">
            {footerLinks2.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mx-auto block max-w-max font-bold tracking-(--letterSpacing-4) text-(--quick-silver) uppercase transition-colors hover:text-(--gold-crayola)"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Copyright */}
        <div className="border-t border-(--white-alpha-20) pt-6">
          <p className="leading-(--lineHeight-3) text-(--quick-silver)">
            &copy; 2025 labanga. All Rights Reserved | Crafted by{" "}
            <a
              href="https://webcheap.in"
              target="_blank"
              className="text-(--gold-crayola) underline"
            >
              webcheap.in
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
