import { ThemeProvider } from '@/components/theme-provider'
import { LoadingProvider } from '@/context/loading-context'
import OBR from '@owlbear-rodeo/sdk'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/(extensions)/_layout')({
  component: Component
})


function Component() {
  const [ready, setReady] = useState(!OBR.isAvailable)

  useEffect(() => {
    OBR.onReady(() => {
      setReady(true)
    })
  }, [])

  if (!ready) return null

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
