import { Hono } from "hono";
import { viewOrders } from "./admin/viewOrders";
import { adminCheck } from "../middleware/adminAuth";
import { adminLogin } from "./admin/adminLogin";
import { adminLogout } from "./admin/adminLogout";


const adminRouter = new Hono()

adminRouter.post('/login', adminLogin)
adminRouter.post('/logout', adminLogout)

adminRouter.get("/orders", adminCheck, viewOrders)

export default adminRouter