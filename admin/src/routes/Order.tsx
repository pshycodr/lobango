import { createFileRoute } from '@tanstack/react-router'
import OrderDetails from '../pages/Order'

export const Route = createFileRoute('/Order')({
  component: RouteComponent,
})

function RouteComponent() {
  return <OrderDetails />
}
