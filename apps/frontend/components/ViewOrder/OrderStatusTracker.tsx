import { useState, useEffect } from "react";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"] });

interface OrderStatusTrackerProps {
  currentStatus: string;
}

interface StatusStep {
  id: string;
  label: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
  isRejected?: boolean;
}

export default function OrderStatusTracker({
  currentStatus,
}: OrderStatusTrackerProps) {
  const [animatedSteps, setAnimatedSteps] = useState<StatusStep[]>([]);
  const [lineProgress, setLineProgress] = useState(0);

  const getStatusSteps = (status: string): StatusStep[] => {
    const normalizedStatus = status.toLowerCase();
    const isRejected = normalizedStatus === "rejected";

    const steps = [
      {
        id: "pending",
        label: "Order Placed",
        description: "We have received your order",
        isCompleted: true,
        isActive: normalizedStatus === "pending",
        isRejected: false,
      },
      {
        id: "accepted",
        label: "Order Confirmed",
        description: "Restaurant is preparing your order",
        isCompleted: ["accepted", "out for delivery", "delivered"].includes(
          normalizedStatus,
        ),
        isActive: normalizedStatus === "accepted",
        isRejected: isRejected,
      },
      {
        id: "out for delivery",
        label: "Out for Delivery",
        description: "Your order is on the way",
        isCompleted: ["delivered"].includes(normalizedStatus),
        isActive: normalizedStatus === "out for delivery",
        isRejected: isRejected,
      },
      {
        id: "delivered",
        label: "Delivered",
        description: "Order successfully delivered",
        isCompleted: normalizedStatus === "delivered",
        isActive: normalizedStatus === "delivered",
        isRejected: isRejected,
      },
    ];

    if (isRejected) {
      return [
        steps[0],
        {
          id: "rejected",
          label: "Order Rejected",
          description: "Unable to process your order",
          isCompleted: true,
          isActive: true,
          isRejected: true,
        },
      ];
    }

    return steps;
  };

  useEffect(() => {
    const steps = getStatusSteps(currentStatus);
    setAnimatedSteps([]);
    setLineProgress(0);

    // First, animate the steps appearing
    const stepTimeouts = steps.map((step, index) => {
      return setTimeout(() => {
        setAnimatedSteps((prev) => [...prev, step]);
      }, index * 200);
    });

    // Then animate the line progress after all steps are visible
    const lineTimeout = setTimeout(
      () => {
        const completedCount = steps.filter((s) => s.isCompleted).length;
        const totalSteps = steps.length;

        if (completedCount > 1) {
          // Calculate progress: from 0% to the percentage of completed steps
          const targetProgress =
            ((completedCount - 1) / (totalSteps - 1)) * 100;
          setLineProgress(targetProgress);
        }
      },
      steps.length * 200 + 300,
    ); // Wait for all steps to appear + small delay

    return () => {
      stepTimeouts.forEach((timeout) => clearTimeout(timeout));
      clearTimeout(lineTimeout);
    };
  }, [currentStatus]);

  const getStatusMessage = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return {
          message: "Order is being processed",
          color: "text-amber-400",
          bgColor: "bg-amber-400/10",
          borderColor: "border-amber-400/30",
        };
      case "accepted":
        return {
          message: "Kitchen is preparing your order",
          color: "text-blue-400",
          bgColor: "bg-blue-400/10",
          borderColor: "border-blue-400/30",
        };
      case "out for delivery":
        return {
          message: "Order is out for delivery",
          color: "text-[var(--gold-crayola)]",
          bgColor: "bg-[var(--gold-crayola)]/10",
          borderColor: "border-[var(--gold-crayola)]/30",
        };
      case "delivered":
        return {
          message: "Order delivered successfully",
          color: "text-green-400",
          bgColor: "bg-green-400/10",
          borderColor: "border-green-400/30",
        };
      case "rejected":
        return {
          message: "Order could not be processed",
          color: "text-red-400",
          bgColor: "bg-red-400/10",
          borderColor: "border-red-400/30",
        };
      default:
        return {
          message: "Tracking order status",
          color: "text-[var(--quick-silver)]",
          bgColor: "bg-[var(--quick-silver)]/10",
          borderColor: "border-[var(--quick-silver)]/30",
        };
    }
  };

  const renderIcon = (step: StatusStep) => {
    if (step.isRejected) {
      return (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      );
    }

    if (step.isCompleted && step.id === "delivered") {
      return (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      );
    }

    if (step.isCompleted) {
      return <div className="w-3 h-3 bg-current rounded-full"></div>;
    }

    if (step.isActive) {
      return (
        <div className="relative">
          <div className="w-3 h-3 bg-[var(--gold-crayola)] rounded-full"></div>
          <div className="absolute inset-0 w-3 h-3 bg-[var(--gold-crayola)]/40 rounded-full animate-ping"></div>
        </div>
      );
    }

    return (
      <div className="w-3 h-3 border-2 border-[var(--quick-silver)]/50 rounded-full bg-[var(--smoky-black-3)]"></div>
    );
  };

  const statusInfo = getStatusMessage(currentStatus);
  const isRejected = currentStatus.toLowerCase() === "rejected";

  return (
    <div className="bg-[var(--eerie-black-2)] rounded-xl p-6 md:p-8 border border-[var(--white-alpha-10)] shadow-lg">
      <div className="text-center mb-8">
        <h2
          className={`${playfair.className} text-2xl md:text-3xl font-bold text-[var(--gold-crayola)] mb-4`}
        >
          Order Tracking
        </h2>
        <div
          className={`${statusInfo.bgColor} ${statusInfo.color} ${statusInfo.borderColor} border px-6 py-3 rounded-full inline-flex items-center space-x-3`}
        >
          <div
            className={`w-2 h-2 ${statusInfo.color.replace("text-", "bg-")} rounded-full ${!isRejected ? "animate-pulse" : ""}`}
          ></div>
          <span className="font-medium text-sm">{statusInfo.message}</span>
        </div>
      </div>

      <div className="relative max-w-lg mx-auto">
        {/* Progress Line Container */}
        {!isRejected && animatedSteps.length > 1 && (
          <div
            className="absolute left-4 top-12 w-0.5 overflow-hidden"
            style={{ height: `${(animatedSteps.length - 1) * 80}px` }}
          >
            {/* Background line */}
            <div className="absolute inset-0 w-full bg-[var(--white-alpha-20)]"></div>
            {/* Animated progress line */}
            <div
              className="absolute top-0 left-0 w-full bg-[var(--gold-crayola)] transition-all duration-2000 ease-out shadow-sm"
              style={{
                height: `${lineProgress}%`,
                boxShadow: "0 0 4px rgba(255, 193, 7, 0.4)",
              }}
            />
          </div>
        )}

        <div className="space-y-8">
          {animatedSteps.map((step, index) => (
            <div
              key={step.id}
              className={`relative flex items-start space-x-4 transform transition-all duration-500 ease-out ${
                index < animatedSteps.length
                  ? "translate-x-0 opacity-100"
                  : "translate-x-8 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Step Icon */}
              <div
                className={`
                relative z-10 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-500
                ${
                  step.isRejected
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                    : step.isCompleted
                      ? "bg-[var(--gold-crayola)] text-[var(--smoky-black-1)] shadow-lg shadow-[var(--gold-crayola)]/20"
                      : step.isActive
                        ? "bg-[var(--gold-crayola)]/20 text-[var(--gold-crayola)] border-2 border-[var(--gold-crayola)]"
                        : "bg-[var(--smoky-black-3)] text-[var(--quick-silver)] border-2 border-[var(--white-alpha-20)]"
                }
              `}
              >
                {renderIcon(step)}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0 pb-2">
                <div className="flex items-center justify-between mb-2">
                  <h3
                    className={`font-bold text-lg ${
                      step.isRejected
                        ? "text-red-400"
                        : step.isCompleted || step.isActive
                          ? "text-white"
                          : "text-[var(--quick-silver)]"
                    }`}
                  >
                    {step.label}
                  </h3>
                  {step.isActive && !step.isRejected && (
                    <div className="flex items-center space-x-2 tracking-wide px-2 py-1 bg-[var(--gold-crayola)]/10 rounded-full border border-[var(--gold-crayola)]/20">
                      <div className="relative">
                        <div className="absolute h-2 w-2 rounded-full bg-green-500 opacity-75 animate-ping"></div>
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      </div>
                      <span className="text-xs text-[var(--gold-crayola)] font-semibold uppercase tracking-wide">
                        Live
                      </span>
                    </div>
                  )}
                </div>
                <p
                  className={`text-sm ${
                    step.isRejected
                      ? "text-red-300"
                      : step.isCompleted || step.isActive
                        ? "text-[var(--quick-silver)]"
                        : "text-[var(--davys-grey)]"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {currentStatus.toLowerCase() === "delivered" && (
        <div className="mt-8 bg-green-500/10 rounded-xl p-6 border border-green-500/20">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-green-500 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-green-400 font-bold text-lg mb-2">
              Order Completed
            </h3>
            <p className="text-[var(--quick-silver)] text-sm">
              Thank you for your business!
            </p>
          </div>
        </div>
      )}

      {isRejected && (
        <div className="mt-8 bg-yellow-500/10 rounded-xl p-6 border border-yellow-500/20">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-yellow-500 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
            </div>
            <h3 className="text-yellow-400 font-bold text-lg mb-2">
              Order Cancelled
            </h3>
            <p className="text-[var(--quick-silver)] text-sm">
              Your payment will be refunded within 3–5 business days.
            </p>
            <p className="text-white text-sm mt-3">
              Need help? Call{" "}
              <span className="font-semibold">+91 6296832453</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
