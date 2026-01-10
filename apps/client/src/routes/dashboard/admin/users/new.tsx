import { AdminUserForm } from '@/components/admin/AdminUserForm'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/admin/users/new')({
  component: RouteComponent,
})

type CreateUserForm = {
  name: string
  email: string
  password?: string
  role?: string
  orgId?: string | undefined
}



export function RouteComponent() {
  const navigate = useNavigate()
  const qc = useQueryClient()





  return (
    <div className="p-6">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold mb-2">Create User</h1>
        <p className="text-sm text-muted-foreground mb-6">Create a new user and optionally add them to one of your organizations</p>

        <AdminUserForm
          mode="create"
          onSuccess={() => {
            qc.invalidateQueries({ queryKey: ['users'] })
            navigate({ to: '/dashboard/admin/users' })
          }}
        />
      </div>
    </div>
  )
}
