import { z } from "zod";

export interface BookingResponse {
  success: boolean;
  booking_id?: string;
  error?: string;
  issues?: any[];
}

export const BookingSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(10),
  email: z.email(),
  person: z.string().min(1),
  message: z.string().optional().default("N/A"),
  date: z.string().min(1),
  time: z.string().min(1),
});

export type Booking = z.infer<typeof BookingSchema>;

export interface SubmitStatus {
  type: "success" | "error" | null;
  message: string;
  bookingId?: string;
}
