import { MapPin, Clock, Phone, Mail } from "lucide-react";

const Topbar = () => {
  return (
    <div className="hidden sm:block text-white fixed top-0 left-0 w-full py-2.5 border-b border-[var(--white-alpha-20)] z-40 transition-transform duration-250 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-8">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" strokeWidth={60} />
            <span className="text-[var(--fontSize-label-1)]">
              BHATAR, PURBO BORDHAMAN, WEST BENGAL, IND
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" strokeWidth={60} />
            <span className="text-[var(--fontSize-label-1)]">
              Daily : 8.00 am to 10.00 pm
            </span>
          </div>

          <a
            href="tel:+919547061233"
            className="flex items-center gap-2 transition-colors hover:text-[var(--gold-crayola)]"
          >
            <Phone className="w-4 h-4" strokeWidth={60} />
            <span className="text-[var(--fontSize-label-1)]">
              +919547061233
            </span>
          </a>

          <a
            href="mailto:debabratadan6@gmail.com"
            className="flex items-center gap-2 transition-colors hover:text-[var(--gold-crayola)]"
          >
            <Mail className="w-4 h-4" strokeWidth={60} />
            <span className="text-[var(--fontSize-label-1)]">
              debabratadan6@gmail.com
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
