import { Forum } from "next/font/google";

const forum = Forum({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-forum",
});

const ContactSection = ({
  title,
  content,
}: {
  title: string;
  content: React.ReactNode;
}) => (
  <div>
    <p className="mb-1 font-bold text-amber-50">{title}</p>
    {content}
  </div>
);

export const ContactInfo = () => (
  <div
    className="bg-top-left bg-repeat p-10 text-center lg:p-16"
    style={{ backgroundImage: "url('/assets/images/form-pattern.png')" }}
  >
    <h2
      className={`text-3xl text-white sm:text-6xl ${forum.className} mb-10 text-center`}
    >
      Contact Us
    </h2>

    <div className="space-y-6">
      <ContactSection
        title="Booking Request"
        content={
          <a
            href="tel:+916296832453"
            className="mx-auto mb-5 block max-w-max font-(--fontSize-body-1) text-(--gold-crayola) transition-colors hover:underline"
          >
            +91 6296832453
          </a>
        }
      />

      <div className="spin-slow mx-auto my-5 h-2 w-2 rotate-45 border border-(--gold-crayola)"></div>

      <ContactSection
        title="Location"
        content={
          <address className="mb-6 font-(--fontSize-body-4) text-(--gold-crayola) not-italic">
            BHATAR, PURBO BORDHAMAN, <br />
            WEST BENGAL, IND
          </address>
        }
      />

      <ContactSection
        title="Lunch Time"
        content={
          <p className="mb-6 leading-(--lineHeight-3) font-(--fontSize-body-4) text-(--quick-silver)">
            Monday to Sunday <br />
            11.00 am - 2.30pm
          </p>
        }
      />

      <ContactSection
        title="Dinner Time"
        content={
          <p className="leading-(--lineHeight-3) font-(--fontSize-body-4) text-(--quick-silver)">
            Monday to Sunday <br />
            07.30 pm - 10.00pm
          </p>
        }
      />
    </div>
  </div>
);
