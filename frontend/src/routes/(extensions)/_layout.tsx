import { useEffect, useState } from 'react'

import OBR from '@owlbear-rodeo/sdk'
import { createFileRoute, Outlet } from '@tanstack/react-router'

import { LoadingProvider } from '@/context/loading-context'
import { ThemeProvider } from '@/components/theme-provider'

export const Route = createFileRoute('/(extensions)/_layout')({
  component: Component,
})

function Component() {
  const [ready, setReady] = useState(() => !OBR.isAvailable)

  useEffect(() => {
    if (!OBR.isAvailable) {
      setReady(true)
      return
    }

    if (OBR.isReady) {
      setReady(true)
      return
    }

    return OBR.onReady(() => {
      setReady(true)
    })
  }, [])

  if (!ready) {
    return <div className="p-3 text-sm text-muted-foreground">Loading Owlbear…</div>
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
