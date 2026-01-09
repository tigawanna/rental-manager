import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/admin")({
  component: RouteComponent,
  beforeLoad({ context }) {
    if (context?.viewer?.user?.role !== "admin") {
      throw redirect({ to: "/dashboard" });
    }
  },
});

function RouteComponent() {
  return (
    <div className="min-h-screen w-full h-full flex justify-center items-center">
      <Outlet />
    </div>
  );
}
