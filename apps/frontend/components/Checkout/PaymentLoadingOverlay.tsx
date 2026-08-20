import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export interface PaymentLoadingOverlayProps {
  type: "payment" | "verification";
  message: string;
}

export function PaymentLoadingOverlay({
  type,
  message,
}: PaymentLoadingOverlayProps) {
  return (
    <div className="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="mx-4 w-full max-w-sm rounded-lg bg-white p-8 text-center">
        <LoadingSpinner message={message} />
        <h3 className="mt-4 mb-2 text-lg font-semibold text-gray-900">
          {type === "payment" ? "Processing Payment" : "Verifying Payment"}
        </h3>
        <p className="text-gray-600">{message}</p>
        {type === "payment" && (
          <p className="mt-2 text-sm text-gray-500">
            Please complete the payment to continue
          </p>
        )}
        {type === "verification" && (
          <p className="mt-2 text-sm text-gray-500">
            Please wait while we confirm your payment
          </p>
        )}
      </div>
    </div>
  );
}
