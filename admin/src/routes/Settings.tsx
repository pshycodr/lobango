import { createFileRoute } from '@tanstack/react-router'
import AdminSettingsPage from '../pages/Settings'

export const Route = createFileRoute('/Settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AdminSettingsPage />
}
