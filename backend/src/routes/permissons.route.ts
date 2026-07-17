import { Hono } from "hono";
import { getNewBookingPermission } from "./permissions/getNewBookingPermission";
import { getNewOrderPermission } from "./permissions/getNewOrderPermission";

const permissionsRouter = new Hono()

permissionsRouter.get("/new-order", getNewOrderPermission)
permissionsRouter.get("/new-booking", getNewBookingPermission)


export default permissionsRouter