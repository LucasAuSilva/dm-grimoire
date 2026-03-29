import { ThemeProvider } from '@/components/theme-provider'
import { LoadingProvider } from '@/context/loading-context'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(extensions)/_layout')({
  component: () => (
    <ThemeProvider defaultTheme='dark'>
      <LoadingProvider>
        <div className="p-3">
          <Outlet />
        </div>
      </LoadingProvider>
    </ThemeProvider>
  ),
})

