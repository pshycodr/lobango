import { Forum } from 'next/font/google';

const forum = Forum({
    subsets: ['latin'],
    weight: ['400'],
    variable: '--font-forum',
});

const ContactSection = ({
    title,
    content
}: {
    title: string;
    content: React.ReactNode;
}) => (
    <div>
        <p className="font-bold mb-1 text-amber-50">{title}</p>
        {content}
    </div>
);

export const ContactInfo = () => (
    <div
        className="text-center p-10 lg:p-16 bg-repeat bg-top-left"
        style={{ backgroundImage: "url('/assets/images/form-pattern.png')" }}
    >
        <h2 className={`text-3xl sm:text-6xl text-white ${forum.className} text-center mb-10`}>
            Contact Us
        </h2>

        <div className="space-y-6">
            <ContactSection
                title="Booking Request"
                content={
                    <a
                        href="tel:+919547061233"
                        className="font-[var(--fontSize-body-1)] text-[var(--gold-crayola)] max-w-max mx-auto block mb-5 transition-colors hover:underline"
                    >
                        +919547061233
                    </a>
                }
            />

            <div className="w-2 h-2 border border-[var(--gold-crayola)] rotate-45 mx-auto my-5 spin-slow"></div>

            <ContactSection
                title="Location"
                content={
                    <address className="font-[var(--fontSize-body-4)] text-[var(--gold-crayola)] not-italic mb-6">
                        BHATAR, PURBO BORDHAMAN, <br />
                        WEST BENGAL, IND
                    </address>
                }
            />

            <ContactSection
                title="Lunch Time"
                content={
                    <p className="font-[var(--fontSize-body-4)] text-[var(--quick-silver)] leading-[var(--lineHeight-3)] mb-6">
                        Monday to Sunday <br />
                        11.30 am - 2.30pm
                    </p>
                }
            />

            <ContactSection
                title="Dinner Time"
                content={
                    <p className="font-[var(--fontSize-body-4)] text-[var(--quick-silver)] leading-[var(--lineHeight-3)]">
                        Monday to Sunday <br />
                        07.30 pm - 10.00pm
                    </p>
                }
            />
        </div>
    </div>
);