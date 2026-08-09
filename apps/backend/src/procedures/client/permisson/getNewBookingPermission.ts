import { orpc } from "@/orpc/base";
import { API_TAGS } from "@/orpc/openapi/tags";
import { PERMISSIONS } from "@/types/kvKeys";
import { ORPCError } from "@orpc/server";
import { z } from "zod";

const GetNewBookingPermissionOutput = z.object({
  new_bookings: z.boolean(),
});

export const getNewBookingPermission = orpc
  .route({
    method: "GET",
    path: "/permission/new-booking",
    tags: [API_TAGS.PERMISSIONS],
    summary: "Check if new bookings are enabled",
    description:
      "This is used to flag the availability of the booking service in frontend",
  })
  .output(GetNewBookingPermissionOutput)
  .handler(async ({ context }) => {
    const value = await context.env.KV.get(PERMISSIONS.NEW_BOOKINGS);

    if (value == null) {
      throw new ORPCError("NOT_FOUND", { message: "Permission not found" });
    }

    return { new_bookings: value === "true" };
  });
