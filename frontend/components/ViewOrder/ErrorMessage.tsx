import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'] });

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
  onTryAnother: () => void;
}

export default function ErrorMessage({ message, onRetry, onTryAnother }: ErrorMessageProps) {
  return (
    <div className="bg-[var(--eerie-black-2)] rounded-xl p-6 md:p-8 border border-red-500/20">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        <h3 className={`${playfair.className} text-lg font-semibold text-red-400 mb-2`}>
          Oops! Something went wrong
        </h3>

        <p className="text-[var(--quick-silver)] mb-6">{message}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onRetry}
            className="px-6 py-2 bg-[var(--gold-crayola)] text-[var(--smoky-black-1)] rounded-lg font-semibold hover:bg-opacity-90 transition-all"
          >
            Try Again
          </button>
          <button
            onClick={onTryAnother}
            className="px-6 py-2 border border-[var(--gold-crayola)] text-[var(--gold-crayola)] rounded-lg font-semibold hover:bg-[var(--gold-crayola)] hover:text-[var(--smoky-black-1)] transition-all"
          >
            Use Different Order ID
          </button>
        </div>
      </div>
    </div>
  );
}