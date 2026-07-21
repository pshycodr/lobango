import { z } from "zod";

export const UpdateBookingSchema = z.object({
  booking_id: z.string(),
  status: z.enum(["pending", "accepted", "rejected"]),
});

export type UpdateBooking = z.infer<typeof UpdateBookingSchema>
