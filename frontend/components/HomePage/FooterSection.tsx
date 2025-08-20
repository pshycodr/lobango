'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail } from 'lucide-react';

const FooterSection = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription logic here
    console.log('Subscribed with email:', email);
    setEmail('');
  };

  const footerLinks1 = ['Home', 'Menus', 'About Us', 'Our Chefs', 'Contact'];
  const footerLinks2 = ['Facebook', 'Instagram', 'Twitter', 'Youtube', 'Google Map'];

  return (
    <footer
      className="relative py-[var(--section-space)] text-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/assets/images/footer-bg.jpg')" }}
    >
      <div className="container mx-auto px-4">
        <div className="grid gap-10 mb-[70px] lg:grid-cols-[0.45fr_1fr_0.45fr] lg:items-center">

          {/* Footer Brand */}
          <div className="relative py-12 px-10 bg-[var(--smoky-black-1)] bg-[url('/assets/images/footer-form-bg.png')]  bg-top bg-repeat lg:order-1 lg:py-25 lg:px-15">
            {/* Side Patterns */}
            <div className="absolute top-0 left-0 w-4 h-full bg-[url('/assets/images/footer-form-pattern.svg')]"></div>
            <div className="absolute top-0 right-0 w-4 h-full bg-[url('/assets/images/footer-form-pattern.svg')]"></div>

            <Link href="#" className="block max-w-max mx-auto mb-10">
              <Image src="/assets/images/logo.png" width={160} height={50} loading="lazy" alt="labanga home" />
            </Link>

            <address className="text-[var(--quick-silver)] leading-[var(--lineHeight-3)] not-italic mb-2">
              BHATAR, PURBA BORDHAMAN, WEST BENGAL, IND
            </address>

            <a
              href="mailto: lobangorestaurant@gmail.com"
              className="text-[var(--quick-silver)] leading-[var(--lineHeight-3)] block my-1.5 transition-colors hover:text-[var(--gold-crayola)]"
            >
              lobangorestaurant@gmail.com
            </a>

            <a
              href="tel:+916296832453"
              className="text-[var(--quick-silver)] leading-[var(--lineHeight-3)] block my-1.5 transition-colors hover:text-[var(--gold-crayola)]"
            >
              Booking Request : +91 6296832453
            </a>

            <p className="text-[var(--quick-silver)] leading-[var(--lineHeight-3)] mb-10">
              Open : 11:00 am - 10:00 pm
            </p>

            <div className="flex justify-center gap-0.5 mb-6">
              <div className="w-2 h-2 border border-[var(--gold-crayola)] rotate-45 spin-slow"></div>
              <div className="w-2 h-2 border border-[var(--gold-crayola)] rotate-45 spin-slow"></div>
              <div className="w-2 h-2 border border-[var(--gold-crayola)] rotate-45 spin-slow"></div>
            </div>

            <p className="text-white font-[var(--fontFamily-forum)] mb-8">
              Like our  <span className='text-[var(--gold-crayola)]'>Service!</span> Drop a <span className='text-[var(--gold-crayola)]'>Review</span>
            </p>

            <textarea
              name="message"
              placeholder="Message"
              // value={formData.message}
              // onChange={handleInputChange}
              className="bg-[var(--eerie-black-2)] text-white h-35 p-5 border border-[var(--white-alpha-10)] outline-none transition-colors focus:border-[var(--gold-crayola)] w-full resize-none leading-none mb-5 placeholder:text-white"
            ></textarea>

            <form
              onSubmit={handleSubscribe}
              className="relative flex flex-col gap-4 sm:gap-0 sm:block"
            >
              <div className="relative w-full">
                <Mail className="absolute top-1/2 left-4 text-white -translate-y-1/2 w-4 h-4 pointer-events-none" />
                <input
                  type="email"
                  name="email_address"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[var(--eerie-black-2)] text-white h-14 pl-10 pr-5 lg:pr-52 border border-[var(--white-alpha-10)] outline-none transition-colors focus:border-[var(--gold-crayola)] w-full placeholder:text-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="
                  bg-[var(--gold-crayola)] text-black font-bold uppercase tracking-[3px] 
                  px-11 overflow-hidden z-10 transition-all duration-500 hover:text-white group min-w-max
                  h-14
                  w-full sm:w-auto
                  relative sm:absolute sm:top-0 sm:right-0 sm:bottom-0"
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-[200%] h-[200%] rounded-full bg-[var(--smoky-black-1)] transition-all duration-500 -z-10 group-hover:bottom-[-50%]" />
                <span className="block transition-transform duration-250 group-hover:-translate-y-10">Send</span>
                <span className="absolute top-full left-1/2 -translate-x-1/2 min-w-max text-white transition-all duration-250 group-hover:top-1/2 group-hover:-translate-y-1/2">
                  Subscribe
                </span>
              </button>
            </form>

          </div>

          {/* Footer Links 1 */}
          <ul className="grid gap-5">
            {footerLinks1.map((link, index) => (
              <li key={index}>
                <Link
                  href="#"
                  className="text-[var(--quick-silver)] font-bold uppercase tracking-[var(--letterSpacing-4)] mx-auto transition-colors hover:text-[var(--gold-crayola)] block max-w-max"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>

          {/* Footer Links 2 */}
          <ul className="grid gap-5 lg:order-2">
            {footerLinks2.map((link, index) => (
              <li key={index}>
                <Link
                  href="#"
                  className="text-[var(--quick-silver)] font-bold uppercase tracking-[var(--letterSpacing-4)] mx-auto transition-colors hover:text-[var(--gold-crayola)] block max-w-max"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-[var(--white-alpha-20)]">
          <p className="text-[var(--quick-silver)] leading-[var(--lineHeight-3)]">
            &copy; 2025 labanga. All Rights Reserved | Crafted by{' '}
            <Link
              href="#"
              target="_blank"
              className="text-[var(--gold-crayola)] underline"
            >
              webcheap.in
            </Link>
          </p>
        </div>
      </div>

    </footer>
  );
};

export default FooterSection;