import { Playfair_Display } from "next/font/google";
import React, { useMemo } from "react";

const playfair = Playfair_Display({ subsets: ["latin"] });

export interface OrderStatusTrackerProps {
  currentStatus: string;
}

export interface StatusStep {
  id: string;
  label: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
  isRejected?: boolean;
}

export function OrderStatusTracker({ currentStatus }: OrderStatusTrackerProps) {
  const getStatusSteps = (status: string): StatusStep[] => {
    const normalizedStatus = status.toLowerCase();
    const isRejected =
      normalizedStatus === "rejected" || normalizedStatus === "cancelled";

    const steps: StatusStep[] = [
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
        isCompleted: [
          "accepted",
          "preparing",
          "out for delivery",
          "out_for_delivery",
          "delivered",
        ].includes(normalizedStatus),
        isActive:
          normalizedStatus === "accepted" || normalizedStatus === "preparing",
        isRejected,
      },
      {
        id: "out for delivery",
        label: "Out for Delivery",
        description: "Your order is on the way",
        isCompleted: ["delivered"].includes(normalizedStatus),
        isActive:
          normalizedStatus === "out for delivery" ||
          normalizedStatus === "out_for_delivery",
        isRejected,
      },
      {
        id: "delivered",
        label: "Delivered",
        description: "Order successfully delivered",
        isCompleted: normalizedStatus === "delivered",
        isActive: normalizedStatus === "delivered",
        isRejected,
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

  const steps = useMemo(() => getStatusSteps(currentStatus), [currentStatus]);

  const isRejected =
    currentStatus.toLowerCase() === "rejected" ||
    currentStatus.toLowerCase() === "cancelled";

  const lineProgress = useMemo(() => {
    const completedCount = steps.filter((s) => s.isCompleted).length;
    const totalSteps = steps.length;
    if (completedCount <= 1 || totalSteps <= 1) return 0;
    return ((completedCount - 1) / (totalSteps - 1)) * 100;
  }, [steps]);

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
      case "preparing":
        return {
          message: "Kitchen is preparing your order",
          color: "text-blue-400",
          bgColor: "bg-blue-400/10",
          borderColor: "border-blue-400/30",
        };
      case "out for delivery":
      case "out_for_delivery":
        return {
          message: "Order is out for delivery",
          color: "text-(--gold-crayola)",
          bgColor: "bg-(--gold-crayola)/10",
          borderColor: "border-(--gold-crayola)/30",
        };
      case "delivered":
        return {
          message: "Order delivered successfully",
          color: "text-green-400",
          bgColor: "bg-green-400/10",
          borderColor: "border-green-400/30",
        };
      case "rejected":
      case "cancelled":
        return {
          message: "Order could not be processed",
          color: "text-red-400",
          bgColor: "bg-red-400/10",
          borderColor: "border-red-400/30",
        };
      default:
        return {
          message: "Tracking order status",
          color: "text-(--quick-silver)",
          bgColor: "bg-(--quick-silver)/10",
          borderColor: "border-(--quick-silver)/30",
        };
    }
  };

  const renderIcon = (step: StatusStep) => {
    if (step.isRejected) {
      return (
        <svg
          className="h-4 w-4"
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
          className="h-4 w-4"
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
      return <div className="h-3 w-3 rounded-full bg-current"></div>;
    }

    if (step.isActive) {
      return (
        <div className="relative">
          <div className="h-3 w-3 rounded-full bg-(--gold-crayola)"></div>
          <div className="absolute inset-0 h-3 w-3 animate-ping rounded-full bg-(--gold-crayola)/40"></div>
        </div>
      );
    }

    return (
      <div className="h-3 w-3 rounded-full border-2 border-(--quick-silver)/50 bg-(--smoky-black-3)"></div>
    );
  };

  const statusInfo = getStatusMessage(currentStatus);

  return (
    <div className="rounded-xl border border-(--white-alpha-10) bg-(--eerie-black-2) p-6 shadow-lg md:p-8">
      <div className="mb-8 text-center">
        <h2
          className={`${playfair.className} mb-4 text-2xl font-bold text-(--gold-crayola) md:text-3xl`}
        >
          Order Tracking
        </h2>
        <div
          className={`${statusInfo.bgColor} ${statusInfo.color} ${statusInfo.borderColor} inline-flex items-center space-x-3 rounded-full border px-6 py-3`}
        >
          <div
            className={`h-2 w-2 ${statusInfo.color.replace("text-", "bg-")} rounded-full ${!isRejected ? "animate-pulse" : ""}`}
          ></div>
          <span className="text-sm font-medium">{statusInfo.message}</span>
        </div>
      </div>

      <div className="relative mx-auto max-w-lg">
        {!isRejected && steps.length > 1 && (
          <div
            className="absolute top-12 left-4 w-0.5 overflow-hidden"
            style={{ height: `${(steps.length - 1) * 80}px` }}
          >
            <div className="absolute inset-0 w-full bg-(--white-alpha-20)"></div>
            <div
              className="absolute top-0 left-0 w-full bg-(--gold-crayola) shadow-sm transition-all duration-1000 ease-out"
              style={{
                height: `${lineProgress}%`,
                boxShadow: "0 0 4px rgba(255, 193, 7, 0.4)",
              }}
            />
          </div>
        )}

        <div className="space-y-8">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="relative flex transform items-start space-x-4 transition-all duration-500 ease-out"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-500 ${
                  step.isRejected
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                    : step.isCompleted
                      ? "bg-(--gold-crayola) text-(--smoky-black-1) shadow-(--gold-crayola)/20 shadow-lg"
                      : step.isActive
                        ? "border-2 border-(--gold-crayola) bg-(--gold-crayola)/20 text-(--gold-crayola)"
                        : "border-2 border-(--white-alpha-20) bg-(--smoky-black-3) text-(--quick-silver)"
                }`}
              >
                {renderIcon(step)}
              </div>

              <div className="min-w-0 flex-1 pb-2">
                <div className="mb-2 flex items-center justify-between">
                  <h3
                    className={`text-lg font-bold ${
                      step.isRejected
                        ? "text-red-400"
                        : step.isCompleted || step.isActive
                          ? "text-white"
                          : "text-(--quick-silver)"
                    }`}
                  >
                    {step.label}
                  </h3>
                  {step.isActive && !step.isRejected && (
                    <div className="flex items-center space-x-2 rounded-full border border-(--gold-crayola)/20 bg-(--gold-crayola)/10 px-2 py-1 tracking-wide">
                      <div className="relative">
                        <div className="absolute h-2 w-2 animate-ping rounded-full bg-green-500 opacity-75"></div>
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      </div>
                      <span className="text-xs font-semibold tracking-wide text-(--gold-crayola) uppercase">
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
                        ? "text-(--quick-silver)"
                        : "text-(--davys-grey)"
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
        <div className="mt-8 rounded-xl border border-green-500/20 bg-green-500/10 p-6">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-500">
              <svg
                className="h-6 w-6 text-white"
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
            <h3 className="mb-2 text-lg font-bold text-green-400">
              Order Completed
            </h3>
            <p className="text-sm text-(--quick-silver)">
              Thank you for your business!
            </p>
          </div>
        </div>
      )}

      {isRejected && (
        <div className="mt-8 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-6">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500">
              <svg
                className="h-6 w-6 text-white"
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
            <h3 className="mb-2 text-lg font-bold text-yellow-400">
              Order Cancelled
            </h3>
            <p className="text-sm text-(--quick-silver)">
              Your payment will be refunded within 3–5 business days.
            </p>
            <p className="mt-3 text-sm text-white">
              Need help? Call{" "}
              <span className="font-semibold">+91 1234567890</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
