import { AlertTriangle, KeyRound, Mail, X } from "lucide-react";
import React from "react";
import type { CancelOrderStep } from "@/hooks/useCancelOrder";

export interface CancelOrderModalProps {
  isOpen: boolean;
  step: CancelOrderStep;
  customerEmail: string;
  orderId: string;
  otp: string;
  isLoading: boolean;
  isResending: boolean;
  error: string | null;
  resendCountdown: number;
  onClose: () => void;
  onOtpChange: (otp: string) => void;
  onRequestOtp: () => void;
  onResendOtp: () => void;
  onVerifyAndCancel: () => void;
}

export function CancelOrderModal({
  isOpen,
  step,
  customerEmail,
  orderId,
  otp,
  isLoading,
  isResending,
  error,
  resendCountdown,
  onClose,
  onOtpChange,
  onRequestOtp,
  onResendOtp,
  onVerifyAndCancel,
}: CancelOrderModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "var(--black-alpha-80)" }}
    >
      <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-(--white-alpha-10) bg-(--eerie-black-2) shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 z-10 rounded-full p-1.5 text-(--quick-silver) transition-colors hover:bg-(--white-alpha-10) hover:text-(--white) disabled:opacity-50"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Step 1: Confirmation */}
        {step === "confirm" && (
          <div className="p-6 md:p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <h3 className="mb-2 text-xl font-bold text-(--white)">
              Cancel Order
            </h3>

            <p className="mb-2 text-sm leading-relaxed text-(--quick-silver)">
              Are you sure you want to cancel order{" "}
              <span className="font-mono font-semibold text-(--gold-crayola)">
                {orderId}
              </span>
              ?
            </p>

            <p className="mb-6 text-xs text-red-400/90">
              This action cannot be undone. We will send a verification code to
              your registered email address to confirm cancellation.
            </p>

            {error && (
              <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                {error}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="w-full rounded-xl border border-(--white-alpha-20) px-5 py-2.5 text-sm font-medium text-(--quick-silver) transition-colors hover:bg-(--white-alpha-10) hover:text-(--white) disabled:opacity-50 sm:w-auto"
              >
                No, Keep Order
              </button>
              <button
                type="button"
                onClick={onRequestOtp}
                disabled={isLoading}
                className="flex w-full items-center justify-center space-x-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-700 disabled:opacity-50 sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <span>Yes, Cancel Order</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === "otp" && (
          <div className="p-6 md:p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-(--gold-crayola)/10 text-(--gold-crayola)">
              <KeyRound className="h-6 w-6" />
            </div>

            <h3 className="mb-1 text-xl font-bold text-(--white)">
              Enter Verification Code
            </h3>

            <p className="mb-4 text-xs text-(--quick-silver)">
              We&apos;ve sent a 6-digit verification code to:
              <br />
              <span className="font-semibold text-(--gold-crayola)">
                {customerEmail}
              </span>
            </p>

            {error && (
              <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                {error}
              </div>
            )}

            <div className="mb-6 space-y-4">
              <div>
                <label
                  htmlFor="cancel-otp-input"
                  className="mb-2 block text-xs font-medium text-(--quick-silver)"
                >
                  6-Digit OTP Code
                </label>
                <input
                  id="cancel-otp-input"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={otp}
                  onChange={(e) =>
                    onOtpChange(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="• • • • • •"
                  className="w-full rounded-xl border border-(--white-alpha-20) bg-(--smoky-black-3) px-4 py-3 text-center font-mono text-2xl tracking-[0.5em] text-(--white) placeholder:text-(--white-alpha-20) focus:border-(--gold-crayola) focus:outline-hidden"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-between text-xs text-(--quick-silver)">
                <div className="flex items-center space-x-1">
                  <Mail size={14} />
                  <span>Check your inbox & spam</span>
                </div>
                {resendCountdown > 0 ? (
                  <span className="text-(--white-alpha-40)">
                    Resend in {resendCountdown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={onResendOtp}
                    disabled={isResending}
                    className="font-medium text-(--gold-crayola) hover:underline disabled:opacity-50"
                  >
                    {isResending ? "Sending..." : "Resend Code"}
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="w-full rounded-xl border border-(--white-alpha-20) px-5 py-2.5 text-sm font-medium text-(--quick-silver) transition-colors hover:bg-(--white-alpha-10) hover:text-(--white) disabled:opacity-50 sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onVerifyAndCancel}
                disabled={isLoading || otp.trim().length !== 6}
                className="flex w-full items-center justify-center space-x-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Cancelling Order...</span>
                  </>
                ) : (
                  <span>Confirm Cancellation</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
