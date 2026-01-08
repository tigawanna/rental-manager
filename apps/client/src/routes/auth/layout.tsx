import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  component: AuthLayout,
});

interface AuthLayoutProps {}

export function AuthLayout({}: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-linear-to-br from-primary/20 via-accent/10 to-primary/50">
      <Outlet />
    </div>
  );
}
