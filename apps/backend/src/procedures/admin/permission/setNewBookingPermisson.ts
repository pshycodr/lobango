import { adminOrpc } from "@/orpc/base";
import { API_TAGS } from "@/orpc/openapi/tags";
import { z } from "zod";

const SetNewBookingPermissionInput = z.object({
  new_bookings: z.boolean(),
});

const SetNewBookingPermissionOutput = z.object({
  success: z.boolean(),
  new_bookings: z.boolean(),
});

export const setNewBookingPermission = adminOrpc
  .route({
    method: "POST",
    path: "/permission/new-booking",
    tags: [API_TAGS.PERMISSIONS, API_TAGS.ADMIN],
    summary: "Set/Update the new booking permission",
    description:
      "This is used to flag the availability of the booking service in frontend",
  })
  .input(SetNewBookingPermissionInput)
  .output(SetNewBookingPermissionOutput)
  .errors({
    NOT_FOUND: {
      message: "Permission not found",
    },
  })
  .handler(async ({ context, input }) => {
    const cacheKey = context.cache.getKey.bookingPermission();
    await context.cache.set(cacheKey, input.new_bookings.toString());
    return { success: true, new_bookings: input.new_bookings };
  });
