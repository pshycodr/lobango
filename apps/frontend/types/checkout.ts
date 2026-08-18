export type CheckoutLoadingType = "page" | "payment" | "verification" | "none";

export interface LoadingState {
  type: CheckoutLoadingType;
  message: string;
}

export interface PaymentData {
  amount: number;
  paymentId?: string;
  orderId?: string;
  customerName?: string;
}

export type OrderTrackingStatus = "idle" | "loading" | "success" | "error";
