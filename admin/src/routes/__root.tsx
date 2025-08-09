import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import Navigation from '../components/Common/Navigation'
import { StatusBar, Style } from '@capacitor/status-bar'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  React.useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Capacitor) {
      StatusBar.setStyle({ style: Style.Dark })
      StatusBar.setBackgroundColor({ color: '#000000' })
    }
  }, [])

  return (
    <React.Fragment>
      <Outlet />
      <Navigation />
    </React.Fragment>
  )
}
