import { client } from "@/lib/orpc";
import { useCallback, useEffect, useState } from "react";

export type CancelOrderStep = "confirm" | "otp";

export interface UseCancelOrderParams {
  orderId: string;
  customerEmail: string;
  customerName: string;
  onSuccess?: () => void;
}

export interface UseCancelOrderReturn {
  isModalOpen: boolean;
  step: CancelOrderStep;
  otp: string;
  isLoading: boolean;
  isResending: boolean;
  error: string | null;
  resendCountdown: number;
  openModal: () => void;
  closeModal: () => void;
  setOtp: (otp: string) => void;
  handleRequestOtp: () => Promise<void>;
  handleResendOtp: () => Promise<void>;
  handleVerifyAndCancel: () => Promise<void>;
}

const RESEND_INTERVAL_SECONDS = 60;

export function useCancelOrder({
  orderId,
  customerEmail,
  customerName,
  onSuccess,
}: UseCancelOrderParams): UseCancelOrderReturn {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState<CancelOrderStep>("confirm");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    if (resendCountdown <= 0) return;

    const timer = setInterval(() => {
      setResendCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCountdown]);

  const openModal = useCallback(() => {
    setStep("confirm");
    setOtp("");
    setError(null);
    setIsLoading(false);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    if (isLoading) return;
    setIsModalOpen(false);
    setStep("confirm");
    setOtp("");
    setError(null);
  }, [isLoading]);

  const handleRequestOtp = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await client.otp.sendOtpEmail({
        email: customerEmail,
        purpose: "cancel_order",
        resourceId: orderId,
        name: customerName,
      });

      setStep("otp");
      setResendCountdown(RESEND_INTERVAL_SECONDS);
    } catch (err: unknown) {
      console.error("Failed to send OTP email:", err);
      const message =
        typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: unknown }).message)
          : "Failed to send verification code. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [customerEmail, customerName, orderId]);

  const handleResendOtp = useCallback(async () => {
    if (resendCountdown > 0 || isResending) return;

    setIsResending(true);
    setError(null);

    try {
      await client.otp.sendOtpEmail({
        email: customerEmail,
        purpose: "cancel_order",
        resourceId: orderId,
        name: customerName,
      });

      setResendCountdown(RESEND_INTERVAL_SECONDS);
    } catch (err: unknown) {
      console.error("Failed to resend OTP email:", err);
      const message =
        typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: unknown }).message)
          : "Failed to resend verification code. Please try again.";
      setError(message);
    } finally {
      setIsResending(false);
    }
  }, [customerEmail, customerName, orderId, resendCountdown, isResending]);

  const handleVerifyAndCancel = useCallback(async () => {
    const cleanOtp = otp.trim();
    if (cleanOtp.length !== 6) {
      setError("Please enter a valid 6-digit verification code.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const verifyRes = await client.otp.verifyOtp({
        email: customerEmail,
        purpose: "cancel_order",
        resourceId: orderId,
        otp: cleanOtp,
      });

      if (!verifyRes.actionToken) {
        throw new Error("Verification failed. Please request a new code.");
      }

      await client.order.cancelOrder({
        orderId,
        actionToken: verifyRes.actionToken,
      });

      setIsModalOpen(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: unknown) {
      console.error("Failed to verify OTP or cancel order:", err);
      const message =
        typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: unknown }).message)
          : "Invalid or expired verification code. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [customerEmail, onSuccess, orderId, otp]);

  return {
    isModalOpen,
    step,
    otp,
    isLoading,
    isResending,
    error,
    resendCountdown,
    openModal,
    closeModal,
    setOtp,
    handleRequestOtp,
    handleResendOtp,
    handleVerifyAndCancel,
  };
}
