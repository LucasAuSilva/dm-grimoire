import { ThemeProvider } from '@/components/theme-provider'
import { LoadingProvider } from '@/context/loading-context'
import OBR from '@owlbear-rodeo/sdk'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/(extensions)/_layout')({
  component: Component,
})

function Component() {
  const [ready, setReady] = useState(!OBR.isAvailable)

  useEffect(() => {
    if (!OBR.isAvailable) {
      setReady(true)
      return
    }

    OBR.onReady(() => {
      console.log('[DM Grimoire] OBR ready')
      setReady(true)
    })
  }, [])

  if (!ready) {
    return (
      <div className="p-3 text-sm text-muted-foreground">
        Loading Owlbear…
      </div>
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
