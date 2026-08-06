import { MapPin, Clock, Phone, Mail } from "lucide-react";

const Topbar = () => {
  return (
    <div className="fixed top-0 left-0 z-40 hidden w-full border-b border-(--white-alpha-20) bg-transparent py-2.5 text-white transition-transform duration-250 sm:block">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-8">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" strokeWidth={60} />
            <span className="text-(--fontSize-label-1)">
              BHATAR, PURBO BORDHAMAN, WEST BENGAL, IND
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" strokeWidth={60} />
            <span className="text-(--fontSize-label-1)">
              Daily : 8.00 am to 10.00 pm
            </span>
          </div>

          <a
            href="tel:+919547061233"
            className="flex items-center gap-2 transition-colors hover:text-(--gold-crayola)"
          >
            <Phone className="h-4 w-4" strokeWidth={60} />
            <span className="text-(--fontSize-label-1)">+919547061233</span>
          </a>

          <a
            href="mailto:debabratadan6@gmail.com"
            className="flex items-center gap-2 transition-colors hover:text-(--gold-crayola)"
          >
            <Mail className="h-4 w-4" strokeWidth={60} />
            <span className="text-(--fontSize-label-1)">
              debabratadan6@gmail.com
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
