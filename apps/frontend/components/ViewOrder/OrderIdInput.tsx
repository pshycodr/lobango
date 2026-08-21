import { Playfair_Display } from "next/font/google";
import React, { useState } from "react";

const playfair = Playfair_Display({ subsets: ["latin"] });

export interface OrderIdInputProps {
  onSubmit: (orderId: string) => void;
}

export function OrderIdInput({ onSubmit }: OrderIdInputProps) {
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
    <div className="rounded-lg border border-(--white-alpha-10) bg-(--eerie-black-2) p-8">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <h2
            className={`${playfair.className} mb-2 text-2xl font-semibold text-white`}
          >
            Track Your Order
          </h2>
          <p className="text-sm text-(--quick-silver)">
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
              className="w-full rounded-lg border border-(--white-alpha-20) bg-(--smoky-black-3) px-4 py-3 text-white placeholder-(--quick-silver) transition-colors duration-200 focus:border-(--gold-crayola) focus:outline-none"
              required
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !inputValue.trim()}
            className={`w-full rounded-lg px-4 py-3 font-medium transition-all duration-200 ${
              isSubmitting
                ? "cursor-not-allowed bg-(--quick-silver) text-(--smoky-black-1)"
                : "bg-(--gold-crayola) text-(--smoky-black-1) hover:bg-(--gold-crayola)/90 disabled:cursor-not-allowed disabled:opacity-50"
            }`}
          >
            {isSubmitting ? "Tracking..." : "Track Order"}
          </button>
        </form>

        <div className="mt-6 rounded-lg border border-(--white-alpha-10) bg-(--smoky-black-3) p-4">
          <p className="text-xs leading-relaxed text-(--quick-silver)">
            Your order ID was sent via email when you placed your order.
          </p>
        </div>
      </div>
    </div>
  );
}
