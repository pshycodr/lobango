import { Context } from "hono";
import { getDB } from "../../db/db";
import { orders, bookings } from "../../db/schema";

export async function downloadData(c: Context) {
  try {
    const db = getDB(c.env.DB);

    const ordersData = await db
      .select({
        name: orders.customer_name,
        email: orders.customer_email,
        phone: orders.customer_phone,
      })
      .from(orders);

    const bookingsData = await db
      .select({
        name: bookings.customer_name,
        email: bookings.customer_email,
        phone: bookings.customer_phone,
      })
      .from(bookings);

    // Map to store unique customers by phone+email+name
    const customerMap = new Map<
      string,
      {
        name: string;
        email: string;
        phone: string;
        source: "Orders" | "Bookings" | "Orders/Bookings";
      }
    >();

    const makeKey = (c: { name: string; email: string; phone: string }) =>
      `${c.name?.trim().toLowerCase()}|${c.email?.trim().toLowerCase()}|${c.phone?.trim()}`;

    // Process orders
    for (const customer of ordersData) {
      const key = makeKey(customer);
      customerMap.set(key, {
        ...customer,
        source: "Orders",
      });
    }

    // Process bookings
    for (const customer of bookingsData) {
      const key = makeKey(customer);
      if (customerMap.has(key)) {
        // Update existing to Orders/Bookings if found in both
        customerMap.set(key, {
          ...customerMap.get(key)!,
          source: "Orders/Bookings",
        });
      } else {
        customerMap.set(key, {
          ...customer,
          source: "Bookings",
        });
      }
    }

    const uniqueCustomers = Array.from(customerMap.values());

    return c.json({
      success: true,
      customers: uniqueCustomers,
      orders: ordersData,
      bookings: bookingsData,
    });
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return c.json(
      {
        success: false,
        error: "Unable to fetch data. Please try again later.",
      },
      500,
    );
  }
}
