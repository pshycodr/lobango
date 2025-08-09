import { createFileRoute } from '@tanstack/react-router'
import BookingsAdminPage from '../pages/Bookings'

export const Route = createFileRoute('/Bookings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <BookingsAdminPage/>
}
