import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"] });

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
  onTryAnother: () => void;
}

export default function ErrorMessage({
  message,
  onRetry,
  onTryAnother,
}: ErrorMessageProps) {
  return (
    <div className="rounded-xl border border-red-500/20 bg-(--eerie-black-2) p-6 md:p-8">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
          <svg
            className="h-8 w-8 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <h3
          className={`${playfair.className} mb-2 text-lg font-semibold text-red-400`}
        >
          Oops! Something went wrong
        </h3>

        <p className="mb-6 text-(--quick-silver)">{message}</p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={onRetry}
            className="hover:bg-opacity-90 rounded-lg bg-(--gold-crayola) px-6 py-2 font-semibold text-(--smoky-black-1) transition-all"
          >
            Try Again
          </button>
          <button
            onClick={onTryAnother}
            className="rounded-lg border border-(--gold-crayola) px-6 py-2 font-semibold text-(--gold-crayola) transition-all hover:bg-(--gold-crayola) hover:text-(--smoky-black-1)"
          >
            Use Different Order ID
          </button>
        </div>
      </div>
    </div>
  );
}
