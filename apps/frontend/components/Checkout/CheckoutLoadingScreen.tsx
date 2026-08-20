import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export interface CheckoutLoadingScreenProps {
  message: string;
}

export function CheckoutLoadingScreen({ message }: CheckoutLoadingScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-(--smoky-black-1)">
      <div className="text-center">
        <LoadingSpinner message={message} />
        <p className="mt-4 text-white">{message}</p>
      </div>
    </div>
  );
}
