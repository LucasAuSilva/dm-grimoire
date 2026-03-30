import { useEffect, useState } from 'react'

import OBR from '@owlbear-rodeo/sdk'
import { createFileRoute, Outlet } from '@tanstack/react-router'

import { LoadingProvider } from '@/context/loading-context'
import { ThemeProvider } from '@/components/theme-provider'
import { setupContextMenu } from '@/lib/owlbear'

export const Route = createFileRoute('/(extensions)/_layout')({
  component: Component,
})

function Component() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!OBR.isAvailable) {
      setReady(true)
      return
    }

    OBR.onReady(() => {
      setupContextMenu()
      setReady(true)
    })
  }, [])

  if (!ready) {
    return (
      <ThemeProvider defaultTheme="dark">
        <div className="p-3 text-sm text-muted-foreground animate-pulse">
          Loading Owlbear…
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider defaultTheme="dark">
      <LoadingProvider>
        <div className="p-3">
          <Outlet />
        </div>
      </LoadingProvider>
    </ThemeProvider>
  )
}
