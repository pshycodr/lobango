import { Hono } from "hono";
import { placeOrder } from "./order/placeOrder";
import { getOrders } from "./order/getOrders";


const clientRouter = new Hono()

clientRouter.post("/order", placeOrder)
clientRouter.get("/order", getOrders)

export default clientRouter