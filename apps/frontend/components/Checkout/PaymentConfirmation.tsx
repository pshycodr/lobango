import type { PaymentData } from "@/types/checkout";
import { ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";

export interface PaymentConfirmationProps {
  paymentData?: PaymentData;
  onViewOrder?: () => void;
  onGoHome?: () => void;
}

const PARTICLES = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 5) % 100}%`,
  top: `${(i * 23 + 7) % 100}%`,
  animationDelay: `${(i * 0.4).toFixed(1)}s`,
  animationDuration: `${3 + ((i * 3) % 20) / 10}s`,
}));

const CONFETTI = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: `${(i * 13 + 3) % 100}%`,
  animationDelay: `${((i * 7) % 10) / 10}s`,
  animationDuration: `${2 + ((i * 5) % 10) / 10}s`,
  isGold: i % 2 === 0,
}));

export function PaymentConfirmation({
  paymentData,
  onViewOrder,
  onGoHome,
}: PaymentConfirmationProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const amount = paymentData?.amount || 0;
  const paymentId = paymentData?.paymentId || "PAY-CONFIRMED";
  const orderId = paymentData?.orderId || "ORD-CONFIRMED";
  const customerName = paymentData?.customerName || "Valued Customer";

  useEffect(() => {
    const successTimer = setTimeout(() => setShowSuccess(true), 300);
    const buttonTimer = setTimeout(() => setShowButton(true), 2000);

    return () => {
      clearTimeout(successTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-(--smoky-black-1) p-4 md:p-6">
      {/* Animated Background Particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {PARTICLES.map((particle) => (
          <div
            key={particle.id}
            className="animate-float absolute opacity-20"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.animationDelay,
              animationDuration: particle.animationDuration,
            }}
          >
            <div className="h-1 w-1 rounded-full bg-(--gold-crayola)"></div>
          </div>
        ))}
      </div>

      {/* Success Ripple Effect */}
      {showSuccess && (
        <div className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center">
          <div className="animate-ripple-1 rounded-full bg-(--gold-crayola) opacity-20"></div>
          <div className="animate-ripple-2 rounded-full bg-(--gold-crayola) opacity-15"></div>
          <div className="animate-ripple-3 rounded-full bg-(--gold-crayola) opacity-10"></div>
        </div>
      )}

      {/* Confetti Animation */}
      {showSuccess && (
        <div className="pointer-events-none fixed inset-0 z-20">
          {CONFETTI.map((item) => (
            <div
              key={item.id}
              className="animate-confetti absolute"
              style={{
                left: item.left,
                animationDelay: item.animationDelay,
                animationDuration: item.animationDuration,
              }}
            >
              <div
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: item.isGold
                    ? "var(--gold-crayola)"
                    : "var(--white)",
                }}
              ></div>
            </div>
          ))}
        </div>
      )}

      <div className="relative z-30 mx-auto w-full max-w-sm">
        {/* Main Success Animation Container */}
        <div className="text-center">
          {/* Success Icon with Animation */}
          <div
            className={`relative mb-6 transform transition-all duration-1000 md:mb-8 ${
              showSuccess ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          >
            {/* Pulsing Background Ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-20 w-20 animate-ping rounded-full bg-(--gold-crayola) opacity-20 md:h-24 md:w-24"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="h-28 w-28 animate-ping rounded-full bg-(--gold-crayola) opacity-10 md:h-32 md:w-32"
                style={{ animationDelay: "0.5s" }}
              ></div>
            </div>

            {/* Main Success Icon */}
            <div className="animate-bounce-once relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-(--gold-crayola) shadow-lg md:h-20 md:w-20">
              <CheckCircle className="h-8 w-8 text-(--smoky-black-1) md:h-10 md:w-10" />
            </div>

            {/* Floating Sparkles around icon */}
            <div className="animate-sparkle-1 absolute -top-2 -right-2">
              <Sparkles className="h-3 w-3 text-(--gold-crayola) md:h-4 md:w-4" />
            </div>
            <div className="animate-sparkle-2 absolute -bottom-2 -left-2">
              <Sparkles className="h-2.5 w-2.5 text-(--gold-crayola) md:h-3 md:w-3" />
            </div>
            <div className="animate-sparkle-3 absolute top-0 -left-4">
              <div className="h-1.5 w-1.5 rounded-full bg-(--gold-crayola) md:h-2 md:w-2"></div>
            </div>
          </div>

          {/* Success Message */}
          <div
            className={`mb-6 transform transition-all delay-300 duration-800 md:mb-8 ${
              showSuccess
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <h1 className="mb-2 text-xl leading-tight font-bold text-(--white) md:mb-3 md:text-2xl lg:text-3xl">
              Payment Successful! 🎉
            </h1>
            <p className="mb-1 text-sm leading-relaxed text-(--quick-silver) md:mb-2 md:text-base">
              Thank you {customerName}!
            </p>
            <p className="mb-4 text-xs leading-relaxed text-(--quick-silver) md:mb-6 md:text-sm">
              Your order has been confirmed and we&apos;re preparing it with
              love
            </p>

            {/* Payment Details Card */}
            <div className="rounded-xl border border-(--eerie-black-3) bg-(--eerie-black-2) p-4 shadow-lg md:rounded-2xl md:p-6">
              <div className="mb-3 flex items-center justify-between md:mb-4">
                <span className="text-xs text-(--quick-silver) md:text-sm">
                  Amount Paid
                </span>
                <span className="text-xl font-bold text-(--gold-crayola) md:text-2xl">
                  ₹{amount.toFixed(2)}
                </span>
              </div>
              <div className="mb-3 flex items-center justify-between md:mb-4">
                <span className="text-xs text-(--quick-silver) md:text-sm">
                  Order ID
                </span>
                <span className="max-w-[120px] truncate font-mono text-xs text-(--white) md:max-w-[160px] md:text-sm">
                  {orderId}
                </span>
              </div>
              <div className="mb-3 flex items-center justify-between md:mb-4">
                <span className="text-xs text-(--quick-silver) md:text-sm">
                  Payment ID
                </span>
                <span className="text-2xs max-w-[120px] truncate font-mono text-(--white) md:max-w-[160px] md:text-xs">
                  {paymentId}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-(--quick-silver) md:text-sm">
                  Status
                </span>
                <div className="flex items-center gap-1 md:gap-2">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500 md:h-2 md:w-2"></div>
                  <span className="text-xs font-medium text-green-400 md:text-sm">
                    Completed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className={`transform space-y-2 transition-all duration-700 md:space-y-3 ${
              showButton
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-8 scale-95 opacity-0"
            }`}
          >
            <button
              onClick={onViewOrder}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-(--gold-crayola) px-4 py-3 font-bold text-(--smoky-black-1) shadow-lg transition-all duration-300 hover:brightness-110 active:scale-95 md:gap-3 md:rounded-2xl md:px-6 md:py-4"
            >
              <span className="text-sm md:text-base">View Order Status</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 md:h-5 md:w-5" />
            </button>

            <button
              onClick={onGoHome}
              className="w-full rounded-xl border border-(--eerie-black-3) bg-(--eerie-black-2) px-4 py-2.5 text-sm font-medium text-(--quick-silver) transition-all duration-300 hover:bg-(--eerie-black-3) hover:text-(--white) active:scale-95 md:rounded-2xl md:px-6 md:py-3 md:text-base"
            >
              Continue Shopping
            </button>

            <p className="text-2xs mt-2 text-(--quick-silver) opacity-75 md:mt-3 md:text-xs">
              Track your order in real-time
            </p>
          </div>
        </div>

        {/* Bottom Decorative Elements */}
        <div className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 transform md:-bottom-10">
          <div className="flex gap-1 md:gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-1.5 rounded-full bg-(--gold-crayola) opacity-60 md:h-2 md:w-2 ${
                  showSuccess ? "animate-bounce" : ""
                }`}
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
