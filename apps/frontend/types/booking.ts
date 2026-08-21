export type BookingStatusType = "idle" | "loading" | "success" | "error";

export interface SubmitStatus {
  type: "success" | "error" | null;
  message: string;
  bookingId?: string;
}
