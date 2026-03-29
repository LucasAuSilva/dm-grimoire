import { Outlet, createRootRoute } from '@tanstack/react-router'
import { LoadingProvider } from '@/context/loading-context'
import { ThemeProvider } from '@/components/theme-provider'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <ThemeProvider defaultTheme='system'>
      <LoadingProvider>
        <Outlet />
      </LoadingProvider>
    </ThemeProvider>
  )
}
