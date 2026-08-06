import { HttpStatus } from "@/constants/httpStatusCodes";
import { eq } from "drizzle-orm";
import { Context } from "hono";
import z from "zod";
import { getDB } from "../../db/db";
import { orders } from "../../db/schema";

const CancelOrderSchema = z.object({
  order_id: z.string().trim(),
  ph_no: z.string().trim().min(8),
});

type CancelOrderRequest = z.infer<typeof CancelOrderSchema>;

export async function cancelOrder(c: Context) {
  try {
    const body = await c.req.json();
    const parsed = CancelOrderSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, HttpStatus.BadRequest);
    }

    const data: CancelOrderRequest = parsed.data;
    const db = getDB(c.env.DB);

    // Fetch order
    const existing = await db.query.orders.findFirst({
      where: eq(orders.order_id, data.order_id),
    });

    if (!existing) {
      return c.json({ error: "Order not found" }, HttpStatus.NotFound);
    }

    if (existing.customer_phone !== data.ph_no) {
      return c.json(
        { error: "Phone number does not match this order." },
        HttpStatus.Forbidden
      );
    }

    if (existing.status === "cancelled") {
      return c.json({ message: "Order already cancelled." }, HttpStatus.Ok);
    }

    // Update order status
    await db
      .update(orders)
      .set({ status: "cancelled" })
      .where(eq(orders.order_id, data.order_id))
      .run();

    return c.json({
      success: true,
      message: `Order ${data.order_id} cancelled successfully.`,
    });
  } catch (error: any) {
    console.error("Cancel order failed", {
      error,
      timestamp: new Date().toISOString(),
    });
    return c.json(
      { error: "Internal Server Error" },
      HttpStatus.InternalServerError
    );
  }
}
