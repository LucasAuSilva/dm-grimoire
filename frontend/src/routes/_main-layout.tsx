import { Outlet, createFileRoute } from '@tanstack/react-router'
import { TopBar } from '@/components/top-bar'

export const Route = createFileRoute('/_main-layout')({
  component: () => (
    <main className="p-6 flex flex-col gap-4">
      <TopBar />
      <Outlet />
    </main>
  ),
})
