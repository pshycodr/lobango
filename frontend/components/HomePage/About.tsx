'use client';

import Image from 'next/image';
import { IonIcon } from '@ionic/react';
import { checkmarkOutline } from 'ionicons/icons';
import Button from '../common/Button';

export default function About() {
  const features = [
    "Delicious & Healthy Foods",
    "Spacific Family And Kids Zone",
    "Music & Other Facilities",
    "Fastest Food Home Delivery"
  ];

  return (
    <section id="about" className="section-divider bg-gray-100 p-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Image Banner */}
          <div className="relative aspect-[1/0.9]">
            <Image
              src="/assets/images/about-banner.png"
              width={509}
              height={459}
              alt="Burger with Drinks"
              className="w-full h-full object-contain mx-auto"
            />
            
            {/* Animated Discount Badge */}
            <Image
              src="/assets/images/sale-shape-red.png"
              width={216}
              height={226}
              alt="Get up to 50% off now"
              className="absolute top-0 left-0 animate-bounce"
            />
          </div>

          {/* Content */}
          <div className="text-center md:text-left p-5">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-rubik">
              Foodie, Burgers, and Best Pizzas <span className="text-[var(--deep-saffron)]">in Town!</span>
            </h2>

            <p className="text-gray-600 mb-8">
              The restaurants in Hangzhou also catered to many northern Chinese who had fled south from Kaifeng during
              the Jurchen invasion of the 1120s, while it is also known that many restaurants were run by families.
            </p>

            <ul className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center justify-center md:justify-start gap-2">
                  <IonIcon 
                    icon={checkmarkOutline} 
                    className="bg-[var(--deep-saffron)] text-white text-xs p-1 rounded-full" 
                  />
                  <span className="font-medium text-gray-900">{feature}</span>
                </li>
              ))}
            </ul>

            <Button className="mx-auto md:mx-0">Order Now</Button>
          </div>
        </div>
      </div>
    </section>
  );
}