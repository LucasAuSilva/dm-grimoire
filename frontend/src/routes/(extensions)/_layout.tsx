import { ThemeProvider } from '@/components/theme-provider'
import { LoadingProvider } from '@/context/loading-context'
import OBR from '@owlbear-rodeo/sdk'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/(extensions)/_layout')({
  component: Component,
})

function Component() {
  const [ready, setReady] = useState(() => !OBR.isAvailable || OBR.isReady)

  useEffect(() => {
    OBR.scene.isReady().then(setReady);
    return OBR.scene.onReadyChange(setReady);
  }, []);

  if (!ready) {
    return <div className="p-3 text-sm text-muted-foreground">Loading Owlbear…</div>
  }

  if (ready) {
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
}
