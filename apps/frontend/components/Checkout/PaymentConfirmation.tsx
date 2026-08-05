import { useState, useEffect } from "react";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";

interface PaymentConfirmationProps {
  paymentData?: {
    amount: number;
    paymentId?: string;
    orderId?: string;
    customerName?: string;
  };
  onViewOrder?: () => void;
  onGoHome?: () => void;
}

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({
  paymentData,
  onViewOrder,
  onGoHome,
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showButton, setShowButton] = useState(false);

  // Default values if no payment data is provided
  const amount = paymentData?.amount || 0;
  const paymentId =
    paymentData?.paymentId ||
    `PAY-${Math.random().toString(36).substr(2, 12).toUpperCase()}`;
  const orderId =
    paymentData?.orderId ||
    `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const customerName = paymentData?.customerName || "Valued Customer";

  useEffect(() => {
    // Show success animation immediately
    const successTimer = setTimeout(() => setShowSuccess(true), 300);

    // Show button after 2 seconds like Flipkart/Zomato
    const buttonTimer = setTimeout(() => setShowButton(true), 2000);

    return () => {
      clearTimeout(successTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--smoky-black-1)] relative overflow-hidden flex items-center justify-center p-4 md:p-6">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            <div className="w-1 h-1 bg-[var(--gold-crayola)] rounded-full"></div>
          </div>
        ))}
      </div>

      {/* Success Ripple Effect */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="animate-ripple-1 bg-[var(--gold-crayola)] opacity-20 rounded-full"></div>
          <div className="animate-ripple-2 bg-[var(--gold-crayola)] opacity-15 rounded-full"></div>
          <div className="animate-ripple-3 bg-[var(--gold-crayola)] opacity-10 rounded-full"></div>
        </div>
      )}

      {/* Confetti Animation */}
      {showSuccess && (
        <div className="fixed inset-0 pointer-events-none z-20">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1}s`,
                animationDuration: `${2 + Math.random() * 1}s`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor:
                    Math.random() > 0.5
                      ? "var(--gold-crayola)"
                      : "var(--white)",
                }}
              ></div>
            </div>
          ))}
        </div>
      )}

      <div className="w-full max-w-sm mx-auto relative z-30">
        {/* Main Success Animation Container */}
        <div className="text-center">
          {/* Success Icon with Animation */}
          <div
            className={`relative mb-6 md:mb-8 transform transition-all duration-1000 ${
              showSuccess ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          >
            {/* Pulsing Background Ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-[var(--gold-crayola)] opacity-20 rounded-full animate-ping"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-28 h-28 md:w-32 md:h-32 bg-[var(--gold-crayola)] opacity-10 rounded-full animate-ping"
                style={{ animationDelay: "0.5s" }}
              ></div>
            </div>

            {/* Main Success Icon */}
            <div className="relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 mx-auto bg-[var(--gold-crayola)] rounded-full shadow-lg animate-bounce-once">
              <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-[var(--smoky-black-1)]" />
            </div>

            {/* Floating Sparkles around icon */}
            <div className="absolute -top-2 -right-2 animate-sparkle-1">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-[var(--gold-crayola)]" />
            </div>
            <div className="absolute -bottom-2 -left-2 animate-sparkle-2">
              <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3 text-[var(--gold-crayola)]" />
            </div>
            <div className="absolute top-0 -left-4 animate-sparkle-3">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[var(--gold-crayola)] rounded-full"></div>
            </div>
          </div>

          {/* Success Message */}
          <div
            className={`mb-6 md:mb-8 transform transition-all duration-800 delay-300 ${
              showSuccess
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[var(--white)] mb-2 md:mb-3 leading-tight">
              Payment Successful! 🎉
            </h1>
            <p className="text-[var(--quick-silver)] text-sm md:text-base mb-1 md:mb-2 leading-relaxed">
              Thank you {customerName}!
            </p>
            <p className="text-[var(--quick-silver)] text-xs md:text-sm mb-4 md:mb-6 leading-relaxed">
              Your order has been confirmed and we&apos;re preparing it with
              love
            </p>

            {/* Payment Details Card */}
            <div className="bg-[var(--eerie-black-2)] rounded-xl md:rounded-2xl p-4 md:p-6 border border-[var(--eerie-black-3)] shadow-lg">
              <div className="flex justify-between items-center mb-3 md:mb-4">
                <span className="text-[var(--quick-silver)] text-xs md:text-sm">
                  Amount Paid
                </span>
                <span className="text-[var(--gold-crayola)] text-xl md:text-2xl font-bold">
                  ₹{amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-3 md:mb-4">
                <span className="text-[var(--quick-silver)] text-xs md:text-sm">
                  Order ID
                </span>
                <span className="text-[var(--white)] text-xs md:text-sm font-mono truncate max-w-[120px] md:max-w-[160px]">
                  {orderId}
                </span>
              </div>
              <div className="flex justify-between items-center mb-3 md:mb-4">
                <span className="text-[var(--quick-silver)] text-xs md:text-sm">
                  Payment ID
                </span>
                <span className="text-[var(--white)] text-2xs md:text-xs font-mono truncate max-w-[120px] md:max-w-[160px]">
                  {paymentId}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--quick-silver)] text-xs md:text-sm">
                  Status
                </span>
                <div className="flex items-center gap-1 md:gap-2">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-xs md:text-sm font-medium">
                    Completed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Appear after 2 seconds */}
          <div
            className={`space-y-2 md:space-y-3 transform transition-all duration-700 ${
              showButton
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-8 opacity-0 scale-95"
            }`}
          >
            <button
              onClick={onViewOrder}
              className="w-full bg-[var(--gold-crayola)] text-[var(--smoky-black-1)] font-bold py-3 md:py-4 px-4 md:px-6 rounded-xl md:rounded-2xl hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-2 md:gap-3 group shadow-lg active:scale-95"
            >
              <span className="text-sm md:text-base">View Order Status</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>

            {/* Secondary Button */}
            <button
              onClick={onGoHome}
              className="w-full bg-[var(--eerie-black-2)] border border-[var(--eerie-black-3)] text-[var(--quick-silver)] font-medium py-2.5 md:py-3 px-4 md:px-6 rounded-xl md:rounded-2xl hover:bg-[var(--eerie-black-3)] hover:text-[var(--white)] transition-all duration-300 active:scale-95 text-sm md:text-base"
            >
              Continue Shopping
            </button>

            {/* Subtle hint text */}
            <p className="text-[var(--quick-silver)] text-2xs md:text-xs mt-2 md:mt-3 opacity-75">
              Track your order in real-time
            </p>
          </div>
        </div>

        {/* Bottom Decorative Elements */}
        <div className="absolute -bottom-8 md:-bottom-10 left-1/2 transform -translate-x-1/2 pointer-events-none">
          <div className="flex gap-1 md:gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 md:w-2 md:h-2 bg-[var(--gold-crayola)] rounded-full animate-bounce opacity-60 ${
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
};

export default PaymentConfirmation;
