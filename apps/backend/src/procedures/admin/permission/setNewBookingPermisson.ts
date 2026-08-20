import { adminOrpc } from "@/orpc/base";
import { API_TAGS } from "@/orpc/openapi/tags";
import {
  SetBookingPermissionRequestSchema,
  SetBookingPermissionResponseSchema,
} from "@lobango/contracts/permissions/booking";

export const setNewBookingPermission = adminOrpc
  .route({
    method: "POST",
    path: "/permission/new-booking",
    tags: [API_TAGS.PERMISSIONS, API_TAGS.ADMIN],
    summary: "Set/Update the new booking permission",
    description:
      "This is used to flag the availability of the booking service in frontend",
  })
  .input(SetBookingPermissionRequestSchema)
  .output(SetBookingPermissionResponseSchema)
  .errors({
    NOT_FOUND: {
      message: "Permission not found",
    },
  })
  .handler(async ({ context, input }) => {
    const cacheKey = context.cache.getKey.bookingPermission();
    await context.cache.set(cacheKey, input.newBooking.toString());
    return { success: true, newBooking: input.newBooking };
  });
