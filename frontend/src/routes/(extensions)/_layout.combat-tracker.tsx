import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(extensions)/_layout/combat-tracker')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(extensions)/_combat-tracker"!</div>
}
