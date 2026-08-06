import { Phone, Users } from "lucide-react";
import type { Booking } from "../../types/bookings";
import StatusBadge from "./StatusBadge";

interface BookingCardProps {
  booking: Booking;
  onClick: (booking: Booking) => void;
  onStatusClick: (booking: Booking, e: React.MouseEvent) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onClick,
  onStatusClick,
}) => {
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
      className="group cursor-pointer rounded-xl border border-(--eerie-black-4) bg-(--eerie-black-2) p-4 transition-all duration-300 select-none hover:border-(--gold-crayola)/30 hover:bg-(--eerie-black-3) active:scale-[0.98]"
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg leading-tight font-semibold text-(--white)">
            {booking.customer_name}
          </h3>
          <p className="mt-1 text-xs text-(--quick-silver)">
            #{booking.booking_id}
          </p>
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
      <div className="mb-4 space-y-3">
        {/* Date & Time (highlighted) */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-(--quick-silver)">Date & Time</span>
          <span className="text-base font-bold text-(--gold-crayola)">
            {formatDate(booking.date)} • {formatTime(booking.time)}
          </span>
        </div>

        {/* Contact */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-(--quick-silver)">Contact</span>
          <div className="flex items-center gap-1 text-sm text-(--white)">
            <Phone size={12} className="opacity-80" />
            <a
              href={`tel:+${booking.customer_phone}`}
              className="hover:text-(--gold-crayola) hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {booking.customer_phone}
            </a>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-(--quick-silver)">Email</span>
          <span className="max-w-[140px] truncate text-sm text-(--white) md:max-w-[200px]">
            {booking.customer_email}
          </span>
        </div>

        {/* Guests */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-(--quick-silver)">Guests</span>
          <div className="text-md flex items-center gap-1 font-semibold text-(--gold-crayola)">
            <Users size={12} />
            <span>{booking.number_of_people} guests</span>
          </div>
        </div>

        {/* Occasion/Message */}
        {booking.occasion && (
          <div className="flex items-start justify-between">
            <span className="text-sm text-(--quick-silver)">Message</span>
            <span className="line-clamp-2 max-w-[70%] text-sm text-(--white) capitalize">
              {booking.occasion}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-(--eerie-black-4) pt-3">
        <div className="text-xs text-(--quick-silver)">
          {formatCreatedAt(booking.created_at)} •{" "}
          {formatCreatedAtTime(booking.created_at)}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
