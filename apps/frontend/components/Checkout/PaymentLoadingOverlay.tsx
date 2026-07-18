import LoadingSpinner from "@/components/common/LoadingSpinner";

interface PaymentLoadingOverlayProps {
  type: "payment" | "verification";
  message: string;
}

export function PaymentLoadingOverlay({
  type,
  message,
}: PaymentLoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center">
        <LoadingSpinner />
        <h3 className="text-lg font-semibold mt-4 mb-2">
          {type === "payment" ? "Processing Payment" : "Verifying Payment"}
        </h3>
        <p className="text-gray-600">{message}</p>
        {type === "payment" && (
          <p className="text-sm text-gray-500 mt-2">
            Please complete the payment to continue
          </p>
        )}
        {type === "verification" && (
          <p className="text-sm text-gray-500 mt-2">
            Please wait while we confirm your payment
          </p>
        )}
      </div>
    </div>
  );
}
