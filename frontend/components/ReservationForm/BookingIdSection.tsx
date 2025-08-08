import { Copy, CheckCircle } from 'lucide-react';

export const BookingIdSection = ({
    bookingId,
    copied,
    onCopy
}: {
    bookingId: string;
    copied: boolean;
    onCopy: (text: string) => void;
}) => (
    <div className="bg-[var(--eerie-black-2)] border border-[var(--white-alpha-10)] rounded-lg p-4 mb-4">
        <p className="text-[var(--gold-crayola)] text-sm font-medium mb-2">
            Your Booking ID:
        </p>
        <div className="flex items-center gap-2">
            <code className="bg-black/30 px-3 py-2 rounded text-white font-mono text-sm flex-1">
                {bookingId}
            </code>
            <button
                onClick={() => onCopy(bookingId)}
                className={`p-2 rounded transition-colors ${copied
                        ? 'bg-green-600 text-white'
                        : 'bg-[var(--gold-crayola)] text-black hover:bg-[var(--gold-crayola)]/80'
                    }`}
            >
                {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
            </button>
        </div>
        {copied && (
            <p className="text-green-400 text-xs mt-2">Copied to clipboard!</p>
        )}
    </div>
);