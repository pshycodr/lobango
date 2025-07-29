import { ArrowLeft } from 'lucide-react';

interface CheckoutHeaderProps {
  onBack?: () => void;
}

export default function CheckoutHeader({ onBack }: CheckoutHeaderProps) {
  return (
    <div className="flex items-center justify-center bg-[var(--smoky-black-1)] py-8 px-6 border-b border-[var(--eerie-black-2)]">
      <button 
        onClick={onBack}
        className="absolute left-6 text-[var(--white)] flex size-10 shrink-0 items-center justify-center hover:bg-[var(--white-alpha-10)] rounded-lg transition-colors duration-200"
      >
        <ArrowLeft size={20} />
      </button>
      <h1 className="text-[var(--gold-crayola)] text-3xl font-bold leading-tight tracking-[-0.02em]">
        Checkout
      </h1>
    </div>
  );
}