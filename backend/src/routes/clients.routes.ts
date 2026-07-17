import { Hono } from "hono";
import { placeOrder } from "./order/placeOrder";
import { getOrders } from "./order/getOrders";
import { cancelOrder } from "./order/cancelOrder";
import { createRazorpayOrder } from "./payments/createOrder";
import addBooking from "./booking/addBooking";


const clientRouter = new Hono()

clientRouter.post("/order", placeOrder)
clientRouter.post("/getorders", getOrders)
clientRouter.put("/order/cancel", cancelOrder)

clientRouter.post("/booking", addBooking)

export default clientRouter