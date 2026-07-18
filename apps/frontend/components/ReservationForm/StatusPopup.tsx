import { X, CheckCircle, AlertCircle } from "lucide-react";
import { SubmitStatus } from "@/types/bookings";
import { BookingIdSection } from "./BookingIdSection";

export const StatusPopup = ({
  submitStatus,
  copied,
  onClose,
  onCopy,
}: {
  submitStatus: SubmitStatus;
  copied: boolean;
  onClose: () => void;
  onCopy: (text: string) => void;
}) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-[var(--smoky-black-1)] border border-[var(--white-alpha-10)] rounded-lg p-6 max-w-md w-full relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
      >
        <X size={20} />
      </button>

      <div className="text-center mb-6">
        {submitStatus.type === "success" ? (
          <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
        ) : (
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
        )}

        <h3
          className={`text-xl font-bold mb-2 ${
            submitStatus.type === "success" ? "text-green-400" : "text-red-400"
          }`}
        >
          {submitStatus.type === "success"
            ? "Request Placed!"
            : "Booking Failed"}
        </h3>

        <p className="text-white/80 mb-4">{submitStatus.message}</p>

        {submitStatus.bookingId && (
          <BookingIdSection
            bookingId={submitStatus.bookingId}
            copied={copied}
            onCopy={onCopy}
          />
        )}
      </div>

      <button
        onClick={onClose}
        className="w-full bg-[var(--gold-crayola)] text-black font-bold py-3 rounded hover:bg-[var(--gold-crayola)]/80 transition-colors"
      >
        {submitStatus.type === "success" ? "Great!" : "Try Again"}
      </button>
    </div>
  </div>
);
