import { z } from "zod";

export interface NewBookingResponse {
  success: boolean;
  booking_id: string;
}

export const NewBookingSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(10),
  email: z.email(),
  person: z.string().min(1),
  message: z.string().optional().default("N/A"),
  date: z.string().min(1),
  time: z.string().min(1),
});

export type NewBooking = z.infer<typeof NewBookingSchema>;
