import { createFileRoute } from '@tanstack/react-router'
import AdminOrdersView from '../pages/Orders'

export const Route = createFileRoute('/Orders')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AdminOrdersView />
}
