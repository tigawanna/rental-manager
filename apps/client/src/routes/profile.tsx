import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/profile')({
  component: RouteComponent,
    beforeLoad: async (context) => {
      if (!context.context.viewer?.user) {
        throw redirect({
          to: "/auth",
          search: {
            returnTo: context.location.pathname,
          },
        });
      }
    },
})

function RouteComponent() {
  return <div>Hello "/profile"!</div>
}
