import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import Navigation from '../components/Common/Navigation'
import { StatusBar, Style } from '@capacitor/status-bar'
import { Capacitor } from '@capacitor/core'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  React.useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setBackgroundColor({ color: '#000000' })
      StatusBar.setStyle({ style: Style.Dark })
    }
  }, [])

  return (
    <>
      <Outlet />
      <Navigation />
    </>
  )
}
