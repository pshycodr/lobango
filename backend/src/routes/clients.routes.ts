import { Hono } from "hono";
import { placeOrder } from "./order/placeOrder";
import { getOrders } from "./order/getOrders";
import { cancelOrder } from "./order/cancelOrder";
import { createRazorpayOrder } from "./order/createOrder";


const clientRouter = new Hono()

clientRouter.post("/order", placeOrder)
clientRouter.post("/getorders", getOrders)
clientRouter.put("/order/cancel", cancelOrder)

clientRouter.post("/payment/create-order", createRazorpayOrder)

export default clientRouter