import { Outlet, createRootRoute } from '@tanstack/react-router'
import { LoadingProvider } from '@/context/loading-context'
import { ThemeProvider } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <ThemeProvider defaultTheme='system'>
      <LoadingProvider>
        <TooltipProvider>
          <Outlet />
        </TooltipProvider>
      </LoadingProvider>
    </ThemeProvider>
  )
}
