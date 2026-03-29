import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TopBar } from '@/components/top-bar'
import { LoadingProvider } from '@/context/loading-context'
import { ThemeProvider } from '@/components/theme-provider'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <React.Fragment>
      <main className="p-6 flex flex-col gap-4">
        <TopBar/>
        <ThemeProvider defaultTheme='system'>
          <LoadingProvider>
            <Outlet />
          </LoadingProvider>
        </ThemeProvider>
      </main>
    </React.Fragment>
  )
}
