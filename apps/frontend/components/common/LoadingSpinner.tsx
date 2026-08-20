export interface LoadingSpinnerProps {
  message?: string;
  subMessage?: string;
}

export function LoadingSpinner({
  message = "Fetching your order",
  subMessage = "Please wait while we get your order details",
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative mb-6">
        <div className="h-20 w-20 animate-spin rounded-full border-4 border-(--white-alpha-20)"></div>
        <div className="absolute top-0 left-0 h-20 w-20 animate-spin rounded-full border-4 border-transparent border-t-(--gold-crayola)"></div>
        <div
          className="absolute top-2 left-2 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-(--gold-crayola)"
          style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
        ></div>
      </div>

      <div className="text-center">
        <div className="mb-2 flex items-center justify-center space-x-1">
          <span className="animate-pulse text-lg font-semibold text-(--gold-crayola)">
            {message}
          </span>
          <div className="flex space-x-1">
            <div className="h-1 w-1 animate-bounce rounded-full bg-(--gold-crayola)"></div>
            <div
              className="h-1 w-1 animate-bounce rounded-full bg-(--gold-crayola)"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="h-1 w-1 animate-bounce rounded-full bg-(--gold-crayola)"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
        {subMessage && (
          <p className="text-sm text-(--quick-silver)">{subMessage}</p>
        )}
      </div>

      <div className="mt-4 h-1 w-48 overflow-hidden rounded-full bg-(--white-alpha-10)">
        <div className="h-full animate-pulse rounded-full bg-linear-to-r from-(--gold-crayola) to-yellow-300"></div>
      </div>
    </div>
  );
}
