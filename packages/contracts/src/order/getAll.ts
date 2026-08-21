import { z } from "zod";
import { OrderSchema } from "./schemas";

const DateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format");

export const GetAllOrdersRequestSchema = z
  .object({
    date: DateSchema.optional().describe("Return orders for a specific date"),

    from: DateSchema.optional().describe("Start date for the order date range"),

    to: DateSchema.optional().describe("End date for the order date range"),
  })
  .refine(({ from, to }) => !((from && !to) || (!from && to)), {
    message: "`from` and `to` must be provided together",
  })
  .refine(({ date, from, to }) => !(date && (from || to)), {
    message: "`date` cannot be combined with `from` or `to`",
  });

export type GetAllOrdersRequest = z.infer<typeof GetAllOrdersRequestSchema>;

export const GetAllOrderSchema = OrderSchema.pick({
  orderId: true,
  customerName: true,
  customerPhone: true,
  totalAmount: true,
  paymentMethod: true,
  paymentStatus: true,
  status: true,
  createdAt: true,
});

export type GetAllOrder = z.infer<typeof GetAllOrderSchema>;

export const GetAllOrdersResponseSchema = z.object({
  success: z.literal(true),
  count: z.number().describe("Total Number of Orders"),
  orders: z.array(GetAllOrderSchema),
});

export type GetAllOrdersResponse = z.infer<typeof GetAllOrdersResponseSchema>;
