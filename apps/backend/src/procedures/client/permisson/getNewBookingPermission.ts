import { orpc } from "@/orpc/base";
import { API_TAGS } from "@/orpc/openapi/tags";
import { GetBookingPermissionResponseSchema } from "@lobango/contracts/permissions/booking";
import { ORPCError } from "@orpc/server";

export const getNewBookingPermission = orpc
  .route({
    method: "GET",
    path: "/permission/new-booking",
    tags: [API_TAGS.PERMISSIONS],
    summary: "Check if new bookings are enabled",
    description:
      "This is used to flag the availability of the booking service in frontend",
  })
  .output(GetBookingPermissionResponseSchema)
  .handler(async ({ context }) => {
    const cacheKey = context.cache.getKey.bookingPermission();
    const value = await context.env.KV.get(cacheKey);

    if (value == null) {
      throw new ORPCError("NOT_FOUND", { message: "Permission not found" });
    }

    return { success: true as const, newBooking: value === "true" };
  });
