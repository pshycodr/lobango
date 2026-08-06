import { SubmitStatus } from "@lobango/contracts/bookings";
import { AlertCircle, CheckCircle, X } from "lucide-react";
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
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
    <div className="relative w-full max-w-md rounded-lg border border-(--white-alpha-10) bg-(--smoky-black-1) p-6">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 transition-colors hover:text-white"
      >
        <X size={20} />
      </button>

      <div className="mb-6 text-center">
        {submitStatus.type === "success" ? (
          <CheckCircle size={48} className="mx-auto mb-4 text-green-400" />
        ) : (
          <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
        )}

        <h3
          className={`mb-2 text-xl font-bold ${
            submitStatus.type === "success" ? "text-green-400" : "text-red-400"
          }`}
        >
          {submitStatus.type === "success"
            ? "Request Placed!"
            : "Booking Failed"}
        </h3>

        <p className="mb-4 text-white/80">{submitStatus.message}</p>

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
        className="w-full rounded bg-(--gold-crayola) py-3 font-bold text-black transition-colors hover:bg-(--gold-crayola)/80"
      >
        {submitStatus.type === "success" ? "Great!" : "Try Again"}
      </button>
    </div>
  </div>
);
