import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Home')({
  component: RouteComponent,
})

async function RouteComponent() {
  return <div>Hello "/Home"!</div>
}

