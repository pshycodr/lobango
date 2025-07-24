import { Hono } from 'hono'
import { cors } from 'hono/cors'
import orderRouter from './routes/clients.routes'
import adminRouter from './routes/admin.routes'
import clientRouter from './routes/clients.routes'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})


app.use("/api/*", cors())

app.route("/api/v1/client", clientRouter)
app.route("/api/v1/admin", adminRouter)


export default app 