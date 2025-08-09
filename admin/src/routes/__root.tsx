import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import Navigation from '../components/Common/Navigation'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <React.Fragment>
      {/* <div>Hello "__root"!</div> */}
      <Outlet />
      <Navigation />
    </React.Fragment>
  )
}
