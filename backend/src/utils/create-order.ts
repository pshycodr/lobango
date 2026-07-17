// // /api/create-order.ts
// import Razorpay from 'razorpay';
// import { Context } from 'hono';
// import { getDB } from '../db/db';
// import { orders } from '../db/schema';

// const razorpay = new Razorpay({
//   key_id: 'rzp_test_XXXXXXX',       // Replace with your test key_id
//   key_secret: 'your_key_secret',    // Replace with your test key_secret
// });

// export async function createRazorpayOrder(c: Context) {
//   const body = await c.req.json();
//   const { amount, currency = 'INR', customer_name } = body;

//   const payment_capture = 1;

//   const options = {
//     amount: amount * 100, // Amount in paisa
//     currency,
//     receipt: `rcpt_${Date.now()}`,
//     payment_capture,
//   };

//   try {
//     const response = await razorpay.orders.create(options);

//     // Optional: Store order in DB
//     const db = getDB(c.env.DB);
//     await db.insert(orders).values({
//       order_id: response.id,
//       customer_name,
//       total_amount: amount,
//       payment_method: 'razorpay',
//       status: 'created',
//     });

//     return c.json({ id: response.id, currency, amount });
//   } catch (err) {
//     console.error(err);
//     return c.json({ error: 'Failed to create order' }, 500);
//   }
// }
