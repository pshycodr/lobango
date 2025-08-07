import Image from 'next/image';

const FeaturesSection = () => {
  const features = [
    {
      icon: '/assets/images/features-icon-1.png',
      title: 'Hygienic Food'
    },
    {
      icon: '/assets/images/features-icon-2.png',
      title: 'Fresh Environment'
    },
    {
      icon: '/assets/images/features-icon-3.png',
      title: 'Skilled Chefs'
    },
    {
      icon: '/assets/images/features-icon-4.png',
      title: 'Event & Party'
    }
  ];

  return (
    <section className="relative py-[var(--section-space)] text-center overflow-visible" aria-label="features">
      <div className="container mx-auto px-4">
        <p className="text-[var(--gold-crayola)] font-bold uppercase tracking-[var(--letterSpacing-2)] mb-3 relative after:content-[''] after:block after:w-25 after:mx-auto after:mt-1.5 after:bg-[url('/assets/images/separator.svg')] after:bg-no-repeat after:bg-center after:h-4">
          Why Choose Us
        </p>

        <h2 className="text-white font-[var(--fontFamily-forum)] mb-10">
          Our Strength
        </h2>

        <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <li key={index}>
              <div className={`p-8 pb-10 ${index % 2 === 0 ? 'bg-[var(--eerie-black-3)]' : 'bg-[var(--smoky-black-3)]'}`}>
                <div className="max-w-max mx-auto transition-transform duration-500 hover:scale-x-[-1] hover:rotate-180">
                  <Image
                    src={feature.icon}
                    width={100}
                    height={80}
                    loading="lazy"
                    alt="icon"
                  />
                </div>

                <h3 className=" text-white font-[var(--fontFamily-forum)] my-5">
                  {feature.title}
                </h3>

                <p className="text-[var(--quick-silver)] leading-[var(--lineHeight-6)]">
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
          className="hidden xl:block absolute scale-100  opacity-80 -bottom-50 left-10  animate-float"
        />
      </div>
    </section>
  );
};

export default FeaturesSection;