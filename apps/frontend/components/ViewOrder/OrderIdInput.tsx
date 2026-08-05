import { useState } from "react";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"] });

interface OrderIdInputProps {
  onSubmit: (orderId: string) => void;
}

export default function OrderIdInput({ onSubmit }: OrderIdInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setIsSubmitting(true);
      onSubmit(inputValue.trim());
      setTimeout(() => setIsSubmitting(false), 1000);
    }
  };

  return (
    <div className="bg-[var(--eerie-black-2)] rounded-lg p-8 border border-[var(--white-alpha-10)]">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2
            className={`${playfair.className} text-2xl font-semibold text-white mb-2`}
          >
            Track Your Order
          </h2>
          <p className="text-[var(--quick-silver)] text-sm">
            Enter your order ID to view status
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Order ID"
              className="w-full px-4 py-3 bg-[var(--smoky-black-3)] border border-[var(--white-alpha-20)] rounded-lg text-white placeholder-[var(--quick-silver)] focus:outline-none focus:border-[var(--gold-crayola)] transition-colors duration-200"
              required
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !inputValue.trim()}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              isSubmitting
                ? "bg-[var(--quick-silver)] text-[var(--smoky-black-1)] cursor-not-allowed"
                : "bg-[var(--gold-crayola)] text-[var(--smoky-black-1)] hover:bg-[var(--gold-crayola)]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Tracking..." : "Track Order"}
          </button>
        </form>

        <div className="mt-6 p-4 bg-[var(--smoky-black-3)] rounded-lg border border-[var(--white-alpha-10)]">
          <p className="text-[var(--quick-silver)] text-xs leading-relaxed">
            Your order ID was sent via email when you placed your order.
          </p>
        </div>
      </div>
    </div>
  );
}
