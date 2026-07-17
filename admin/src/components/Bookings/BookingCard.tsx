import { Phone, Users } from "lucide-react";
import type { Booking } from "../../types/bookings";
import StatusBadge from "./StatusBadge";

interface BookingCardProps {
  booking: Booking;
  onClick: (booking: Booking) => void;
  onStatusClick: (booking: Booking, e: React.MouseEvent) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onClick, onStatusClick }) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatCreatedAt = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatCreatedAtTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div
      onClick={() => onClick(booking)}
      className="bg-[var(--eerie-black-2)] border border-[var(--eerie-black-4)] rounded-xl p-4 
                 hover:bg-[var(--eerie-black-3)] hover:border-[var(--gold-crayola)]/30 
                 transition-all duration-300 cursor-pointer group active:scale-[0.98] select-none"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-[var(--white)] font-semibold text-lg leading-tight">
            {booking.customer_name}
          </h3>
          <p className="text-[var(--quick-silver)] text-xs mt-1">#{booking.booking_id}</p>
        </div>
        <StatusBadge
          status={booking.status}
          onClick={(e) => {
            e.stopPropagation();
            onStatusClick(booking, e);
          }}
        />
      </div>

      {/* Booking Details */}
      <div className="space-y-3 mb-4">
        {/* Date & Time (highlighted) */}
        <div className="flex justify-between items-center">
          <span className="text-[var(--quick-silver)] text-sm">Date & Time</span>
          <span className="text-[var(--gold-crayola)] font-bold text-base">
            {formatDate(booking.date)} • {formatTime(booking.time)}
          </span>
        </div>

        {/* Contact */}
        <div className="flex justify-between items-center">
          <span className="text-[var(--quick-silver)] text-sm">Contact</span>
          <div className="flex items-center gap-1 text-[var(--white)] text-sm">
            <Phone size={12} className="opacity-80" />
            <a
              href={`tel:+${booking.customer_phone}`}
              className="hover:underline hover:text-[var(--gold-crayola)]"
              onClick={(e) => e.stopPropagation()}
            >
              {booking.customer_phone}
            </a>
          </div>
        </div>

        {/* Email */}
        <div className="flex justify-between items-center">
          <span className="text-[var(--quick-silver)] text-sm">Email</span>
          <span className="text-[var(--white)] text-sm truncate max-w-[140px] md:max-w-[200px]">
            {booking.customer_email}
          </span>
        </div>

        {/* Guests */}
        <div className="flex justify-between items-center">
          <span className="text-[var(--quick-silver)] text-sm">Guests</span>
          <div className="flex items-center gap-1 text-[var(--gold-crayola)] text-md font-semibold">
            <Users size={12} />
            <span>{booking.number_of_people} guests</span>
          </div>
        </div>

        {/* Occasion/Message */}
        {booking.occasion && (
          <div className="flex justify-between items-start">
            <span className="text-[var(--quick-silver)] text-sm">Message</span>
            <span className="text-[var(--white)] text-sm capitalize line-clamp-2 max-w-[70%]">
              {booking.occasion}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-3 border-t border-[var(--eerie-black-4)]">
        <div className="text-[var(--quick-silver)] text-xs">
          {formatCreatedAt(booking.created_at)} • {formatCreatedAtTime(booking.created_at)}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
