import { Phone, Mail, Calendar, Clock, Users } from "lucide-react";
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
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (timeString: string): string => {
        console.log(timeString);
        
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div
            onClick={() => onClick(booking)}
            className="bg-[var(--eerie-black-2)] border border-[var(--eerie-black-4)] rounded-xl p-4 hover:bg-[var(--eerie-black-3)] transition-all duration-200 cursor-pointer hover:border-[var(--gold-crayola)]/30 hover:shadow-lg hover:shadow-[var(--gold-crayola)]/10"
        >
            {/* Header with Status */}
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-[var(--white)] font-semibold text-lg">#{booking.booking_id}</h3>
                <StatusBadge
                    status={booking.status}
                    onClick={(e) => onStatusClick(booking, e)}
                />
            </div>

            {/* Customer Info */}
            <div className="mb-4">
                <p className="text-[var(--white)] font-medium mb-1">{booking.customer_name}</p>
                <div className="flex items-center gap-2 text-[var(--quick-silver)] text-sm mb-1">
                    <Phone size={14} />
                    <span>{booking.customer_phone}</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--quick-silver)] text-sm">
                    <Mail size={14} />
                    <span className="truncate">{booking.customer_email}</span>
                </div>
            </div>

            {/* Booking Details Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-[var(--quick-silver)] text-sm">
                    <Calendar size={14} className="text-[var(--gold-crayola)]" />
                    <span>{formatDate(booking.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--quick-silver)] text-sm">
                    <Clock size={14} className="text-[var(--gold-crayola)]" />
                    <span>{formatTime(booking.time)}</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--quick-silver)] text-sm">
                    <Users size={14} className="text-[var(--gold-crayola)]" />
                    <span>{booking.number_of_people} guests</span>
                </div>
                <div className="text-[var(--quick-silver)] text-sm">
                    <span className="text-[var(--gold-crayola)]">Occasion:</span>
                    <br />
                    <span className="text-xs">{booking.occasion || 'N/A'}</span>
                </div>
            </div>

            {/* Created At */}
            <div className="text-xs text-[var(--quick-silver)]/70 border-t border-[var(--eerie-black-4)] pt-2">
                Created: {new Date(booking.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                })}
            </div>
        </div>
    );
};

export default BookingCard;