import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_main-layout/')({
  beforeLoad: () => {
    throw redirect({
      to: '/converter'
    })
  }
})

// TODO: Make and landing page for the project :p
