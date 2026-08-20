import { CheckCircle, Copy } from "lucide-react";
import React from "react";

export interface BookingIdSectionProps {
  bookingId: string;
  copied: boolean;
  onCopy: (text: string) => void;
}

export function BookingIdSection({
  bookingId,
  copied,
  onCopy,
}: BookingIdSectionProps) {
  return (
    <div className="mb-4 rounded-lg border border-(--white-alpha-10) bg-(--eerie-black-2) p-4">
      <p className="mb-2 text-sm font-medium text-(--gold-crayola)">
        Your Booking ID:
      </p>
      <div className="flex items-center gap-2">
        <code className="flex-1 rounded bg-black/30 px-3 py-2 font-mono text-sm text-white">
          {bookingId}
        </code>
        <button
          onClick={() => onCopy(bookingId)}
          className={`rounded p-2 transition-colors ${
            copied
              ? "bg-green-600 text-white"
              : "bg-(--gold-crayola) text-black hover:bg-(--gold-crayola)/80"
          }`}
        >
          {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
        </button>
      </div>
      {copied && (
        <p className="mt-2 text-xs text-green-400">Copied to clipboard!</p>
      )}
    </div>
  );
}
