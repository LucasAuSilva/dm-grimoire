import { ThemeProvider } from '@/components/theme-provider'
import { LoadingProvider } from '@/context/loading-context'
import { setupContextMenu } from '@/lib/owlbear-context-menu'
import OBR from '@owlbear-rodeo/sdk'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/(extensions)/_layout')({
  component: Component
})


function Component() {
  useEffect(() => {
    OBR.onReady(() => {
      setupContextMenu()
    })
  }, [])

  return (
    <ThemeProvider defaultTheme='dark'>
      <LoadingProvider>
        <div className="p-3">
          <Outlet />
        </div>
      </LoadingProvider>
    </ThemeProvider>
  )
}
