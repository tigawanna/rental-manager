import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { authClient } from '@/lib/better-auth/client'
import { useAppForm } from '@/lib/tanstack/form'

import { formOptions } from '@tanstack/react-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { CreateOrg } from '../organizations/-components/OrgDialogs'

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

const formOpts = formOptions({
  defaultValues: {
    name: '',
    email: '',
    password: '',
    role: 'tenant',
  },
})

export function RouteComponent() {
  const navigate = useNavigate()
  const qc = useQueryClient()

  // List organizations the current admin is in
  const orgsQuery = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      try {
        const { data, error } = await authClient.organization.list({})
        if (error) throw error
        return data
      } catch (err) {
        throw err
      }
    },
  })

  const [selectedOrgId, setSelectedOrgId] = useState<string | undefined>(undefined);

  const createMutation = useMutation({
    mutationFn: async (payload: CreateUserForm) => {
      const { name, email, password, role } = payload
      // Create user via admin plugin
      const { data, error } = await authClient.admin.createUser({
        body: {
          name,
          email,
          password,
          role,
        },
      } as any)

      if (error) throw error
      return data
    },
    onSuccess: async (data, variables) => {
      // Optionally add to organization if selected by inviting the user to the org
      try {
        const orgId = variables.orgId
        const userEmail = variables.email
        if (orgId && userEmail) {
          const { data: addResp, error } = await authClient.organization.inviteMember({
            email: userEmail,
            role: 'member',
            organizationId: orgId,
          } as any)
          if (error) {
            toast.error('User created but failed to add to organization', { description: error.message })
            // continue
          }
        }

        toast.success('User created')
        qc.invalidateQueries({ queryKey: ['admin-users'] } as any)
        navigate({ to: '/dashboard/admin/users' })
      } catch (err: any) {
        toast.error('User was created but adding to org failed', { description: String(err?.message ?? err) })
        qc.invalidateQueries({ queryKey: ['admin-users'] } as any)
        navigate({ to: '/dashboard/admin/users' })
      }
    },
    onError(err: any) {
      toast.error('Failed to create user', { description: String(err?.message ?? err) })
    },
  })

  const form = useAppForm({
    ...formOpts,
    onSubmit: async ({ value }) => {
      const v = value as CreateUserForm

      // Basic validation
      const schema = z.object({
        name: z.string().min(1, 'Name required'),
        email: z.email('Invalid email'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        role: z.string().optional(),
        orgId: z.string().optional().nullable(),
      })

      const result = schema.safeParse(v)
      if (!result.success) {
        toast.error('Validation error', { description: result.error.issues.map(i => i.message).join(', ') })
        return
      }

      await createMutation.mutateAsync({ ...v, orgId: selectedOrgId })
    },
  })

  const orgOptions = useMemo(() => {
    const d = orgsQuery.data as any
    // try a few common shapes
    const list = d?.organizations ?? d?.organizations_list ?? d?.data ?? d ?? []
    if (Array.isArray(list)) return list
    if (list?.organizations) return list.organizations
    return []
  }, [orgsQuery.data])



  return (
    <div className="p-6">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold mb-2">Create User</h1>
        <p className="text-sm text-muted-foreground mb-6">Create a new user and optionally add them to one of your organizations</p>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4">

          <form.AppField name="name" validators={{ onChange: z.string().min(1, 'Name is required') }}>
            {(f) => <f.TextField label="Name" />}
          </form.AppField>

          <form.AppField name="email" validators={{ onChange: z.string().email('Invalid email') }}>
            {(f) => <f.EmailField />}
          </form.AppField>

          <form.AppField name="password" validators={{ onChange: z.string().min(8, 'Password at least 8 chars') }}>
            {(f) => <f.PasswordField label="Password" />}
          </form.AppField>

          <div className="flex gap-4">
            <div className="flex-1">
              <form.AppField name="role">
                {(f) => (
                  <f.SelectField
                    label="Role"
                    items={[
                      { label: 'admin', value: 'admin' },
                      { label: 'landlord', value: 'landlord' },
                      { label: 'manager', value: 'manager' },
                      { label: 'staff', value: 'staff' },
                      { label: 'tenant', value: 'tenant' },
                    ]}
                  />
                )}
              </form.AppField>
            </div>

            <div className="flex-1">
              <label className="text-sm">Add to Organization (optional)</label>
              <div className="flex gap-2 items-center">
                <Select value={selectedOrgId ?? "__none"} onValueChange={(v) => setSelectedOrgId(v === "__none" ? undefined : v)}>
                  <SelectTrigger className="min-w-56">
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">None</SelectItem>
                    {(orgOptions ?? []).map((o: any) => (
                      <SelectItem key={o.id ?? o._id ?? o.orgId ?? o.name} value={o.id ?? o._id ?? o.orgId ?? o.name}>
                        {o.name ?? o.title ?? o.displayName ?? o.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Create organization button + dialog */}
                <CreateOrg
                  triggerLabel="Create org"
                  className="h-10"
                  onCreated={(org) => {
                    setSelectedOrgId(org.id)
                  }}
                />
              </div>
            </div>
          </div>

          <form.AppForm>
            <form.SubmitButton label="Create user" className="w-full" />
          </form.AppForm>
        </form>
      </div>
    </div>
  )
}
