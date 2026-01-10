import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/admin/users/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/admin/users/new"!</div>
}
