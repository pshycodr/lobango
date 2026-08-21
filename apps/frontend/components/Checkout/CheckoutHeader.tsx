import { ArrowLeft } from "lucide-react";

export interface CheckoutHeaderProps {
  onBack?: () => void;
}

export function CheckoutHeader({ onBack }: CheckoutHeaderProps) {
  return (
    <div className="flex items-center justify-center border-b border-(--eerie-black-2) bg-(--smoky-black-1) px-6 py-8">
      <button
        onClick={onBack}
        className="absolute left-6 flex size-10 shrink-0 items-center justify-center rounded-lg text-(--white) transition-colors duration-200 hover:bg-(--white-alpha-10)"
      >
        <ArrowLeft size={20} />
      </button>
      <h1 className="text-3xl leading-tight font-bold tracking-[-0.02em] text-(--gold-crayola)">
        Checkout
      </h1>
    </div>
  );
}
